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
    
    # Generic fallback logic
    return {
        "name": domain.capitalize(),
        "factual_reporting": "Unverified",
        "bias": "Unknown / Unrated",
        "description": f"The domain '{domain}' is not registered in our core database list. Please scan its articles manually to audit credibility.",
        "known_conspiracies": "No logged conspiracies or hoaxes found in registry."
    }
