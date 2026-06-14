import os
import uuid
from datetime import datetime, timezone
from supabase import create_client, Client

# Load environment variables manually if exists
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

class InMemoryMockDB:
    """
    A fallback in-memory database that simulates Supabase operations
    when credentials are not provided. Contains premium news cards and domain reputation registry.
    """
    def __init__(self):
        self.profiles = {}
        self.scans = []
        self.bookmarks = []
        
        # Expanded Current Affairs News with Unsplash Images and real sources
        self.global_news_feed = [
            {
                "id": "1",
                "title": "NASA Mars Lander Confirms Deep Ground Ice Reserves in Utopia Planitia Crater",
                "source": "AP News",
                "url": "https://apnews.com/article/science-nasa-mars-exploration-ice",
                "image_url": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 98,
                "status": "verified",
                "summary": "Data from orbital radar and lander instruments has mapped extensive underground water ice fields, providing crucial water resources for future crewed Mars missions.",
                "category": "Science",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "2",
                "title": "Global Stock Markets Stabilize Following Federal Reserve Interest Rate Cut",
                "source": "Reuters",
                "url": "https://www.reuters.com/markets/",
                "image_url": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 96,
                "status": "verified",
                "summary": "Major indexes in New York, London, and Tokyo recorded steady gains after the Fed announced a 0.25% reduction, citing progress in controling target inflation.",
                "category": "Economics",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "3",
                "title": "New Room-Temperature Superconductor Claims Debunked by Joint Physics Panel",
                "source": "Nature News",
                "url": "https://www.nature.com/news",
                "image_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 94,
                "status": "verified",
                "summary": "Independent duplication attempts by three international universities failed to find zero resistance in the copper-substituted apatite structure.",
                "category": "Science",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "4",
                "title": "Major Tech Firm Unveils Commercial 1,000 Qubit Quantum Chip",
                "source": "MIT Technology Review",
                "url": "https://www.technologyreview.com/",
                "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 92,
                "status": "verified",
                "summary": "The processor utilizes advanced error correction codes, achieving a stable compute window suitable for complex cryptographic and chemical simulation algorithms.",
                "category": "Tech",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "5",
                "title": "UN Climate Summit Reaches Landmark Accord on Methane Emission Caps",
                "source": "BBC News",
                "url": "https://www.bbc.com/news/science-environment-56837908",
                "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 95,
                "status": "verified",
                "summary": "Nearly 120 nations pledged legally binding targets to reduce methane output by 35% by 2030, supported by new satellite surveillance networks.",
                "category": "Politics",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "6",
                "title": "Amazon Rainforest Conservation Program Receives $2B Funding Influx",
                "source": "Bloomberg News",
                "url": "https://www.bloomberg.com/green",
                "image_url": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 93,
                "status": "verified",
                "summary": "A coalition of international charities and sovereign green funds backed the initiative to fund drone anti-logging security details and re-forestation.",
                "category": "Politics",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "7",
                "title": "European Central Bank Announces Transition to Digital Euro Framework by 2027",
                "source": "BBC News",
                "url": "https://www.bbc.com/news/business-65782928",
                "image_url": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 94,
                "status": "verified",
                "summary": "The ECB has outlined a two-year preparation phase starting this month to finalize rules, select publishers, and test the digital currency network infrastructure before deployment.",
                "category": "Economics",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "8",
                "title": "DeepMind Unveils AlphaFold 3: Direct Biomolecular Interactions Mapping Launched",
                "source": "Nature News",
                "url": "https://www.nature.com/articles/d41586-024-01305-6",
                "image_url": "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 97,
                "status": "verified",
                "summary": "The new AI model goes beyond protein structures to predict interactions between DNA, RNA, chemical compounds, and cell structures, accelerating drug discovery pipelines.",
                "category": "Tech",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "9",
                "title": "India Space Agency Chandrayaan-4 Lunar Sample Retrieval Mission Details Released",
                "source": "Times of India",
                "url": "https://timesofindia.indiatimes.com/india/chandrayaan-4-mission-details",
                "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 95,
                "status": "verified",
                "summary": "ISRO has finalized the multi-module vehicle architecture to land on the lunar south pole, collect 2kg of regolith samples, and return them safely back to Earth.",
                "category": "Science",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "10",
                "title": "Global Semiconductor Alliance Projects 18% Supply Capacity Surge Following New Fab Builds",
                "source": "Bloomberg News",
                "url": "https://www.bloomberg.com/technology",
                "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 93,
                "status": "verified",
                "summary": "Dozens of state-subsidized microchip factories in Arizona, Germany, and Japan are scheduled to begin volume production, easing global supply backlogs.",
                "category": "Economics",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "11",
                "title": "FDA Approves Breakthrough CRISPR Gene-Editing Therapy for Sickle Cell Treatment",
                "source": "Reuters",
                "url": "https://www.reuters.com/business/healthcare-lifesciences/",
                "image_url": "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 98,
                "status": "verified",
                "summary": "The landmark approval marks the first therapeutic medicine utilizing CRISPR Cas9 editing to modify blood-producing cells, effectively curing the genetic condition.",
                "category": "Science",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "12",
                "title": "Renewable Energy Captures Record 43% Share of European Electricity Grid in 2025",
                "source": "BBC News",
                "url": "https://www.bbc.com/news/science-environment-65829871",
                "image_url": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 96,
                "status": "verified",
                "summary": "Wind and solar generation capacity surpassed fossil gas for the third consecutive quarter, supported by offshore North Sea power grid grid links.",
                "category": "Economics",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "13",
                "title": "Google Research Deploys Neural Weather Model for 10-Day Global Atmospheric Forecasts",
                "source": "MIT Technology Review",
                "url": "https://www.technologyreview.com/",
                "image_url": "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 94,
                "status": "verified",
                "summary": "The AI model, GraphCast, predicts global weather variables at 0.25-degree resolution in under one minute, outperforming traditional physical simulation supercomputers.",
                "category": "Tech",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "14",
                "title": "World Health Organization Launches Global Health Treaty Draft for Future Response",
                "source": "AP News",
                "url": "https://apnews.com/article/un-health-treaty-pandemic-response",
                "image_url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 92,
                "status": "verified",
                "summary": "Delegates have finalized early-stage guidelines on visual diagnostics tracking, vaccine IP waivers, and resource distribution contracts for upcoming health crises.",
                "category": "Politics",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "15",
                "title": "New Quantum Encryption Protocol Successfully Deployed Over 500km Fiber Link",
                "source": "Nature Physics",
                "url": "https://www.nature.com/nphys/",
                "image_url": "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 95,
                "status": "verified",
                "summary": "Researchers achieved secure quantum key distribution using phase-coded states over standard telecommunication lines, setting a new record for physical encryption.",
                "category": "Tech",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "16",
                "title": "United Nations Finalizes High Seas Protection Treaty for International Waters",
                "source": "Bloomberg News",
                "url": "https://www.bloomberg.com/features",
                "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
                "credibility_score": 96,
                "status": "verified",
                "summary": "The historic ocean protection framework places 30% of global marine sanctuaries under strict conservation limits, regulating commercial fishing and deep sea mining.",
                "category": "Politics",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]

        # Fake Rumors and leaks registry
        self.debunk_rumors = [
            {
                "id": "r1",
                "claim": "Viral Clip Claims Eiffel Tower was Destroyed by a Massive Fire",
                "status": "debunked",
                "score": 85, # high threat
                "summary": "A trending short video on TikTok showing the Eiffel Tower engulfed in smoke and flames was verified to be a CGI asset rendered in Blender. Paris officials confirmed no fire occurred.",
                "source_factcheck": "Snopes Fact Checker",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "r2",
                "claim": "Leaked Audio: Major Central Bank Preparing to Suspend Retail Currency Exchanges",
                "status": "unverified",
                "score": 62,
                "summary": "An audio clip circulating on Telegram alleges a private bank board discussion regarding a physical cash freeze. Audio analysis shows potential deepfake voice cloning indicators. Regulators have denied the claim.",
                "source_factcheck": "Reuters Verification Lab",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "r3",
                "claim": "Screenshot Claims Bananas Are Injected with Poisonous Red Chemicals",
                "status": "debunked",
                "score": 40,
                "summary": "The red streaks found in some bananas are caused by a harmless agricultural plant bacterial disease called Mokillo. No chemical or synthetic injections were detected.",
                "source_factcheck": "PolitiFact",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "r4",
                "claim": "Photo Claims Pope Francis Wore a Designer Oversized Puffer Jacket",
                "status": "debunked",
                "score": 75,
                "summary": "The highly viral photo was generated using the Midjourney AI platform by a digital artist. Close-ups show blending anomalies on the Pope's glasses and fingers.",
                "source_factcheck": "Snopes Fact Checker",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]

        # Domain reputation lookup database
        self.domain_reputation_registry = {
            "nytimes.com": {
                "name": "The New York Times",
                "factual_reporting": "High",
                "bias": "Left-Center Leaning",
                "description": "An American daily newspaper based in New York City. Governed by strict editorial standards, though articles often carry a progressive social bias.",
                "known_conspiracies": "None verified. Occasional column corrections are logged publicly."
            },
            "reuters.com": {
                "name": "Reuters News Agency",
                "factual_reporting": "Very High",
                "bias": "Least Biased / Highly Objective",
                "description": "An international news organization owned by Thomson Reuters. Focuses on neutral, descriptive coverage of global events with minimal editorial framing.",
                "known_conspiracies": "None. Respected globally as a baseline of objective journalism."
            },
            "apnews.com": {
                "name": "Associated Press (AP)",
                "factual_reporting": "Very High",
                "bias": "Least Biased / Highly Objective",
                "description": "An American non-profit news agency. Provides dry, descriptive, wire news feeds to thousands of global outlets.",
                "known_conspiracies": "None. Follows strict factual guidelines."
            },
            "theonion.com": {
                "name": "The Onion",
                "factual_reporting": "Satirical / Fabricated",
                "bias": "Satirical",
                "description": "An American digital media company and news satire organization. It publishes satirical articles on international, national, and local news.",
                "known_conspiracies": "All claims are satirical and fabricated for humor. Not a source of news."
            },
            "infowars.com": {
                "name": "InfoWars",
                "factual_reporting": "Low / Unreliable",
                "bias": "Far-Right Conspiracy",
                "description": "An American far-right conspiracy theory and fake news website owned by Alex Jones. Known for promoting debunked rumors and medical hoaxes.",
                "known_conspiracies": "Frequently publishes false claims regarding false-flag disasters, vaccine tracking chips, and weather modification weapons."
            },
            "foxnews.com": {
                "name": "Fox News",
                "factual_reporting": "Mixed",
                "bias": "Right Leaning",
                "description": "An American multinational conservative cable news television channel. Factual reporting in news reporting is moderate, but editorial segments carry strong conservative bias.",
                "known_conspiracies": "Promoted voter fraud allegations (settled for libel) and climate change denial panels."
            },
            "msnbc.com": {
                "name": "MSNBC",
                "factual_reporting": "Mixed",
                "bias": "Left Leaning",
                "description": "An American cable television channel providing news coverage and political commentary. Strong liberal bias in its prime-time host lineups.",
                "known_conspiracies": "Over-sensationalized political speculation panels; logs occasional factual corrections."
            }
        }

    def add_scan(self, user_id, input_type, content, headline, credibility_score, bias_category, metrics, reasoning, exif_data=None, image_url=None):
        new_scan = {
            "id": str(uuid.uuid4()),
            "user_id": user_id or "anonymous",
            "input_type": input_type,
            "content": content,
            "headline": headline or "Scanned Forensic Target",
            "image_url": image_url,
            "exif_data": exif_data,
            "credibility_score": credibility_score,
            "bias_category": bias_category,
            "metrics": metrics,
            "reasoning": reasoning,
            "is_public": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.scans.insert(0, new_scan)
        return new_scan

# Initialize connection or Mock Mode
is_mock_mode = True
supabase_client = None

if SUPABASE_URL and SUPABASE_ANON_KEY and "your-supabase" not in SUPABASE_URL:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        is_mock_mode = False
        print("[DB] Supabase connected successfully.")
    except Exception as e:
        print(f"[DB] Supabase connection failed: {e}. Falling back to Mock DB.")
else:
    print("[DB] Supabase credentials missing. Running in Mock DB mode.")

mock_db = InMemoryMockDB()

def get_supabase():
    return supabase_client

def get_db_mode() -> bool:
    return is_mock_mode

def get_global_news():
    if not is_mock_mode:
        try:
            res = supabase_client.table("global_news_feed").select("*").order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception:
            pass
    return mock_db.global_news_feed

def get_debunk_rumors():
    if not is_mock_mode:
        try:
            res = supabase_client.table("debunk_rumors").select("*").order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception:
            pass
    return mock_db.debunk_rumors

def save_scan(user_id, input_type, content, headline, credibility_score, bias_category, metrics, reasoning, exif_data=None, image_url=None):
    if not is_mock_mode:
        try:
            payload = {
                "user_id": user_id,
                "input_type": input_type,
                "content": content,
                "headline": headline,
                "image_url": image_url,
                "exif_data": exif_data,
                "credibility_score": credibility_score,
                "bias_category": bias_category,
                "metrics": metrics,
                "reasoning": reasoning
            }
            res = supabase_client.table("scans").insert(payload).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"[DB Error] Save scan failed: {e}")
            
    return mock_db.add_scan(user_id, input_type, content, headline, credibility_score, bias_category, metrics, reasoning, exif_data, image_url)

def lookup_domain_reputation(domain: str) -> dict:
    """
    Looks up a domain name in the reputation database registry.
    """
    domain = domain.lower().replace("www.", "").strip()
    if domain in mock_db.domain_reputation_registry:
        return mock_db.domain_reputation_registry[domain]
    
    # Online Gemini query fallback if Gemini is active
    from utils.gemini_service import has_gemini
    if has_gemini:
        try:
            import google.generativeai as genai
            import json
            import re
            
            model = genai.GenerativeModel("gemini-2.5-flash")
            prompt = f"""
            You are a media bias and credibility expert. Provide a factual reporting profile for the web domain: "{domain}".
            
            Your profile MUST include:
            1. The common publisher name (e.g. "Instagram", "Reddit", "New York Times").
            2. Factual reporting rating (e.g. "High", "Mixed", "Low", "Very High").
            3. Political bias profile (e.g. "Left-Center Leaning", "Right Leaning", "Center", "Non-political / Social Media", "Satire", "Conspiracy / Pseudoscience").
            4. A professional 2-3 sentence description of the platform's role, reputation, and standard credibility rating.
            5. Known conspiracies, controversies, or hoaxes promoted (e.g. "Frequent misinformation warnings", "None logged in trust registry", "Satirical content only").
            
            The JSON structure MUST look exactly like this:
            {{
              "name": "<Publisher Name>",
              "factual_reporting": "<High / Mixed / Low / Very High / etc.>",
              "bias": "<Bias profile label>",
              "description": "<Professional profile description>",
              "known_conspiracies": "<Logged controversies or 'None logged' description>"
            }}
            """
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            if response_text.startswith("```"):
                response_text = re.sub(r"^```(json)?", "", response_text)
                response_text = re.sub(r"```$", "", response_text).strip()
            result = json.loads(response_text)
            return {
                "name": result.get("name", domain.capitalize()),
                "factual_reporting": result.get("factual_reporting", "Mixed"),
                "bias": result.get("bias", "Neutral"),
                "description": result.get("description", ""),
                "known_conspiracies": result.get("known_conspiracies", "None logged.")
            }
        except Exception as e:
            print(f"[Gemini Domain Lookup Error] {e}")
            
    # Generic fallback logic
    return {
        "name": domain.capitalize(),
        "factual_reporting": "Unverified",
        "bias": "Unknown / Unrated",
        "description": f"The domain '{domain}' is not registered in our core database list. Please scan its articles manually to audit credibility.",
        "known_conspiracies": "No logged conspiracies or hoaxes found in registry."
    }

def get_user_history(user_id: str) -> list:
    if not is_mock_mode:
        try:
            res = supabase_client.table("scans").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"[DB Error] Fetch scans failed: {e}")
            
    # Mock fallback
    return [s for s in mock_db.scans if s.get("user_id") == user_id]

def get_user_bookmarks(user_id: str) -> list:
    if not is_mock_mode:
        try:
            res = supabase_client.table("bookmarks").select("*, scans(*)").eq("user_id", user_id).order("created_at", desc=True).execute()
            if res.data:
                output = []
                for b in res.data:
                    scan_data = b.get("scans")
                    if scan_data:
                        scan_data["bookmark_id"] = b["id"]
                        output.append(scan_data)
                return output
        except Exception as e:
            print(f"[DB Error] Fetch bookmarks failed: {e}")
            
    # Mock fallback
    output = []
    for b in mock_db.bookmarks:
        if b.get("user_id") == user_id:
            scan = next((s for s in mock_db.scans if s.get("id") == b.get("scan_id")), None)
            if scan:
                output.append(scan)
    return output

def add_bookmark(user_id: str, scan_id: str) -> dict:
    if not is_mock_mode:
        try:
            payload = {
                "user_id": user_id,
                "scan_id": scan_id
            }
            res = supabase_client.table("bookmarks").insert(payload).execute()
            if res.data:
                return {"success": True, "data": res.data[0]}
        except Exception as e:
            print(f"[DB Error] Add bookmark failed: {e}")
            return {"success": False, "error": str(e)}
            
    # Mock fallback
    exists = any(b for b in mock_db.bookmarks if b.get("user_id") == user_id and b.get("scan_id") == scan_id)
    if not exists:
        mock_db.bookmarks.append({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "scan_id": scan_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    return {"success": True}

def delete_bookmark(user_id: str, scan_id: str) -> dict:
    if not is_mock_mode:
        try:
            res = supabase_client.table("bookmarks").delete().eq("user_id", user_id).eq("scan_id", scan_id).execute()
            return {"success": True}
        except Exception as e:
            print(f"[DB Error] Delete bookmark failed: {e}")
            return {"success": False, "error": str(e)}
            
    # Mock fallback
    mock_db.bookmarks = [b for b in mock_db.bookmarks if not (b.get("user_id") == user_id and b.get("scan_id") == scan_id)]
    return {"success": True}

# Runtime cached news variable for feed matching
_live_cached_news = []

def set_live_cached_news(news_list: list):
    global _live_cached_news
    _live_cached_news = news_list

def get_live_cached_news() -> list:
    return _live_cached_news


