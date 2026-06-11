import os
import re
import httpx
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

# Import local utilities
from utils.exif_reader import scan_image_metadata
from utils.gemini_service import analyze_article_text, analyze_image, analyze_video
from utils.db import save_scan, get_global_news, get_debunk_rumors, get_db_mode, lookup_domain_reputation

app = FastAPI(title="Veritas Premium Forensics & Radar")

# Enable CORS for local debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

# Request schemas
class TextAnalysisRequest(BaseModel):
    text: str
    url: Optional[str] = None
    user_id: Optional[str] = None

class ImageUrlAnalysisRequest(BaseModel):
    url: str
    user_id: Optional[str] = None

# Helper to crawl and clean URL text
async def scrape_url_text(url: str) -> tuple[str, str]:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        target_url = url
        if not url.startswith(("http://", "https://")):
            target_url = "https://" + url
            
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(target_url, headers=headers)
            
        if resp.status_code != 200:
            raise Exception(f"HTTP Error {resp.status_code}")
            
        html = resp.text
        
        # Extract Title
        title_match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else "Scraped Article"
        
        # Clean HTML body
        body_content = re.sub(r"<script.*?>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
        body_content = re.sub(r"<style.*?>.*?</style>", "", body_content, flags=re.DOTALL | re.IGNORECASE)
        body_content = re.sub(r"<!--.*?-->", "", body_content, flags=re.DOTALL)
        
        # Find paragraphs
        paragraphs = re.findall(r"<p.*?>(.*?)</p>", body_content, flags=re.DOTALL | re.IGNORECASE)
        
        clean_paragraphs = []
        for p in paragraphs:
            clean_p = re.sub(r"<.*?>", "", p).strip()
            clean_p = clean_p.replace("&nbsp;", " ").replace("&amp;", "&").replace("&quot;", '"').replace("&apos;", "'")
            if len(clean_p) > 40:
                clean_paragraphs.append(clean_p)
                
        article_text = "\n\n".join(clean_paragraphs)
        
        if not article_text.strip():
            raw_text = re.sub(r"<.*?>", " ", body_content)
            raw_text = re.sub(r"\s+", " ", raw_text).strip()
            article_text = raw_text[:2000]
            
        return title, article_text
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to crawl URL: {str(e)}")

# API Endpoints

@app.get("/api/config")
def get_config():
    return {
        "is_mock_mode": get_db_mode()
    }

@app.post("/api/analyze/text")
async def analyze_text(req: TextAnalysisRequest):
    result = analyze_article_text(req.text, req.url)
    
    saved = save_scan(
        user_id=req.user_id,
        input_type="text",
        content=req.text[:2000],
        headline=req.text[:100] + "...",
        credibility_score=result["credibility_score"],
        bias_category=result["bias_category"],
        metrics=result["metrics"],
        reasoning=result["reasoning"]
    )
    
    return {
        "id": saved["id"] if isinstance(saved, dict) else getattr(saved, "id", None),
        "analysis": result
    }

@app.post("/api/analyze/url")
async def analyze_url(url: str = Form(...), user_id: Optional[str] = Form(None)):
    headline, text = await scrape_url_text(url)
    
    if len(text.strip()) < 10:
        raise HTTPException(status_code=400, detail="The crawled URL did not contain sufficient text content to analyze.")
        
    result = analyze_article_text(text, url)
    
    saved = save_scan(
        user_id=user_id,
        input_type="url",
        content=url,
        headline=headline,
        credibility_score=result["credibility_score"],
        bias_category=result["bias_category"],
        metrics=result["metrics"],
        reasoning=result["reasoning"]
    )
    
    return {
        "id": saved["id"] if isinstance(saved, dict) else getattr(saved, "id", None),
        "headline": headline,
        "scraped_text": text[:3000],
        "analysis": result
    }

@app.post("/api/analyze/image")
async def analyze_image_route(file: UploadFile = File(...), user_id: Optional[str] = Form(None)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.webp')):
        raise HTTPException(status_code=400, detail="Unsupported image format. Upload JPEG, PNG, TIFF, or WebP.")
        
    file_bytes = await file.read()
    
    # Run EXIF scan
    exif_info = scan_image_metadata(file_bytes)
    
    # Run Gemini Vision or mock analysis
    result = analyze_image(file_bytes, exif_info)
    
    saved = save_scan(
        user_id=user_id,
        input_type="image",
        content=file.filename,
        headline=f"Image Forensics: {file.filename}",
        credibility_score=result["credibility_score"],
        bias_category=result["verdict"],
        metrics={
            "anomalies_count": len(result["anomalies"]),
            "regions_count": len(result["regions"]),
            "has_exif": exif_info["has_exif"]
        },
        reasoning=result["reasoning"],
        exif_data=exif_info
    )
    
    return {
        "id": saved["id"] if isinstance(saved, dict) else getattr(saved, "id", None),
        "exif": exif_info,
        "analysis": result
    }

@app.post("/api/analyze/image_url")
async def analyze_image_url_route(req: ImageUrlAnalysisRequest):
    if not req.url:
        raise HTTPException(status_code=400, detail="Image URL is required.")
        
    try:
        target_url = req.url
        if not req.url.startswith(("http://", "https://")):
            target_url = "https://" + req.url
            
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            resp = await client.get(target_url, headers=headers)
            
        if resp.status_code != 200:
            raise Exception(f"HTTP Error {resp.status_code} while fetching image")
            
        file_bytes = resp.content
        if len(file_bytes) > 5 * 1024 * 1024:
            raise Exception("Fetched image exceeds 5MB size limit.")
            
        filename = req.url.split("/")[-1].split("?")[0]
        if not filename or not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.webp')):
            filename = "downloaded_image.jpg"
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image URL: {str(e)}")
        
    exif_info = scan_image_metadata(file_bytes)
    result = analyze_image(file_bytes, exif_info)
    
    saved = save_scan(
        user_id=req.user_id,
        input_type="image",
        content=req.url,
        headline=f"Image URL: {filename}",
        credibility_score=result["credibility_score"],
        bias_category=result["verdict"],
        metrics={
            "anomalies_count": len(result["anomalies"]),
            "regions_count": len(result["regions"]),
            "has_exif": exif_info["has_exif"]
        },
        reasoning=result["reasoning"],
        exif_data=exif_info
    )
    
    return {
        "id": saved["id"] if isinstance(saved, dict) else getattr(saved, "id", None),
        "exif": exif_info,
        "analysis": result
    }

@app.post("/api/analyze/video")
async def analyze_video_route(file: UploadFile = File(...), user_id: Optional[str] = Form(None)):
    """
    Audits video files for digital morphing and deepfake anomalies.
    """
    if not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
        raise HTTPException(status_code=400, detail="Unsupported video format. Upload MP4, AVI, MOV, MKV, or WebM.")
        
    video_bytes = await file.read()
    
    # Run Video Forensic audit
    result = analyze_video(video_bytes, file.filename)
    
    saved = save_scan(
        user_id=user_id,
        input_type="video",
        content=file.filename,
        headline=f"Video Forensics: {file.filename}",
        credibility_score=result["credibility_score"],
        bias_category=result["verdict"],
        metrics={
            "anomalies_count": len(result["anomalies"]),
            "size_kb": result["metadata"]["size_kb"]
        },
        reasoning=result["reasoning"]
    )
    
    return {
        "id": saved["id"] if isinstance(saved, dict) else getattr(saved, "id", None),
        "analysis": result
    }

@app.get("/api/feeds")
def get_feeds():
    return {
        "global_news": get_global_news(),
        "debunk_rumors": get_debunk_rumors()
    }

@app.get("/api/domain/lookup")
def lookup_domain(domain: str):
    return lookup_domain_reputation(domain)

# Mount Static Files
os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
def read_root():
    return FileResponse("static/index.html")
