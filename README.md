# 🕵️ Veritas: AI-Powered Fact-Checking & Deepfake Forensics

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://veritas-fact-forensics.vercel.app)
[![Google Gemini AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini-orange?style=flat-square)](https://ai.google.dev/)

**Combat Misinformation. Detect Deepfakes. Verify Truth.**

[🌐 Live Demo](#-live-demo) • [📚 Documentation](#-api-documentation) • [🚀 Quick Start](#-quick-start) • [🏗️ Architecture](#-architecture)

</div>

---

## 📖 Overview

**Veritas** is a comprehensive multimedia fact-checking and digital forensics platform that uses AI-powered analysis to detect misinformation, verify credibility, and identify deepfakes. Built for students, journalists, and truth-seekers.

### 🎯 Problem Statement
In the age of AI-generated content and sophisticated misinformation campaigns, distinguishing fact from fiction is harder than ever. Veritas provides:
- **Real-time credibility scoring** using machine learning
- **Deepfake detection** through image/video forensics
- **Automated fact-checking** against verified news feeds
- **Logical fallacy detection** in articles and claims
- **Domain reputation lookup** for publisher trustworthiness

---

## ✨ Features

### 📝 Text Analysis
- **Credibility Scoring** (0-100): TF-IDF based bias detection
- **Logical Fallacy Detection**: Identifies reasoning errors
- **Bias Classification**: Left/Right/Center/Mixed analysis
- **Sentiment Analysis**: Tone and emotional manipulation detection
- **Summary Generation**: AI-powered content condensing

### 🖼️ Image Forensics
- **EXIF Metadata Scanning**: Camera info, timestamps, location data
- **Deepfake Detection**: AI-based morphing analysis
- **Anomaly Detection**: Pixel inconsistencies, splicing marks
- **Reverse Image Search Integration**: Trace original sources
- **Metadata Tampering Detection**

### 🎬 Video Analysis
- **Frame-by-frame Analysis**: Detect facial inconsistencies
- **Audio Deepfake Detection**: Voice synthesis indicators
- **Codec Analysis**: Compression artifacts
- **Temporal Anomalies**: Frame interpolation detection

### 🌐 URL Verification
- **Auto Web Scraping**: Extract article text & metadata
- **og:image Resolution**: Fetch actual article covers
- **Domain Trust Registry**: Publisher reputation scores
- **SSL Certificate Validation**: HTTPS authenticity

### 📰 Live News Feeds
- **Global News Aggregation**: Real-time RSS feeds
- **Rumor/Hoax Ledger**: Fact-checked claims database
- **Category Filtering**: Science, Tech, Economics, Politics
- **India-specific News**: Dedicated section for Indian sources

### 💬 AI-Powered Chat
- **Interactive Guidance**: Ask about deepfakes, fallacies, credibility
- **Pre-built Q&A**: Common questions answered instantly
- **Gemini AI Integration**: Advanced conversational analysis (optional)

---

## 🌐 Live Demo

**🚀 Access Veritas at:** [https://veritas-fact-forensics.vercel.app](https://veritas-fact-forensics.vercel.app)

### Demo Features:
- ✅ Analyze any news article or URL
- ✅ Upload images for deepfake detection
- ✅ Browse live verified news feed
- ✅ Search debunked rumors database
- ✅ Chat with AI forensics assistant
- ✅ View credibility analysis history

---

## 🏗️ Architecture

```
Veritas Fact-Forensics (Full Stack)
├── Backend (FastAPI + Python)
│   ├── main.py                 # Core API endpoints
│   ├── utils/
│   │   ├── gemini_service.py   # AI analysis engine
│   │   ├── exif_reader.py      # Image metadata extraction
│   │   ├── db.py               # Supabase integration
│   │   └── gnews_decoder.py    # Google News URL decoding
│   ├── requirements.txt        # Python dependencies
│   └── schema.sql              # Supabase database schema
├── Frontend (Next.js/React) [Optional]
│   ├── pages/
│   ├── components/
│   └── styles/
├── Static Assets
│   ├── css/                    # Styling
│   ├── js/                     # Client-side logic
│   └── index.html              # Main UI
└── Deployment
    ├── vercel.json             # Vercel configuration
    └── .env.example            # Environment variables template
```

### 🔄 Request Flow

```
User Input (Text/URL/Image/Video)
    ↓
[Scraping Layer] - Extract content & metadata
    ↓
[Preprocessing] - Normalize, clean, tokenize
    ↓
[ML Pipeline] - TF-IDF, bias classification, fallacy detection
    ↓
[AI Analysis] - Gemini Vision/LLM for advanced insights
    ↓
[Forensics] - EXIF, deepfake detection, anomaly scoring
    ↓
[Verification] - Cross-reference with news feeds & domain registry
    ↓
[Output] - Credibility score, analysis, recommendations
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | FastAPI 0.136.3 |
| **Runtime** | Python 3.9+ |
| **AI Engine** | Google Gemini 2.5 Flash |
| **ML Library** | Scikit-Learn (TF-IDF) |
| **Database** | Supabase (PostgreSQL) |
| **Image Analysis** | PIL + Custom forensics |
| **Deployment** | Vercel + Python Runtime |
| **HTTP Client** | httpx (async) |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- Supabase account (free tier available)
- Google Gemini API key (optional, for advanced AI features)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/atharvraval05/veritas-fact-forensics.git
   cd veritas-fact-forensics
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Google Gemini API (Optional)
   GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Setup Supabase Database**
   - Create a new Supabase project
   - Go to SQL Editor → Create a new query
   - Copy-paste contents of `schema.sql`
   - Execute to create tables

6. **Run the development server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Access the application**
   - Open browser: `http://localhost:8000`
   - API docs: `http://localhost:8000/docs` (Swagger UI)

---

## 📚 API Documentation

### Core Endpoints

#### **1. Text Analysis**
```http
POST /api/analyze/text
Content-Type: application/json

{
  "text": "Article text or claim to analyze...",
  "url": "https://source-url.com (optional)",
  "user_id": "user-uuid (optional)"
}
```

**Response:**
```json
{
  "id": "scan-id-uuid",
  "analysis": {
    "credibility_score": 78,
    "bias_category": "center",
    "metrics": {
      "clickbait_score": 0.32,
      "sensationalism": 0.45,
      "logical_fallacies": ["appeal_to_emotion", "hasty_generalization"]
    },
    "reasoning": "Article uses emotionally charged language but provides balanced sources..."
  }
}
```

#### **2. URL Analysis**
```http
POST /api/analyze/url
Content-Type: application/x-www-form-urlencoded

url=https://article-url.com
user_id=user-uuid (optional)
```

**Response:**
```json
{
  "id": "scan-id-uuid",
  "headline": "Article Title (scraped)",
  "scraped_text": "Full article text extracted...",
  "analysis": { ... }
}
```

#### **3. Image Upload & Deepfake Detection**
```http
POST /api/analyze/image
Content-Type: multipart/form-data

file: <image-file.png|jpg|jpeg|tiff|webp>
user_id: user-uuid (optional)
```

**Response:**
```json
{
  "id": "scan-id-uuid",
  "exif": {
    "camera_model": "Canon EOS 5D Mark IV",
    "timestamp": "2026-01-15T14:32:00Z",
    "gps_coordinates": "40.7128, -74.0060",
    "has_exif": true
  },
  "analysis": {
    "credibility_score": 45,
    "verdict": "potentially_morphed",
    "anomalies": ["facial_inconsistencies", "lighting_mismatch"],
    "regions": ["face", "background"],
    "reasoning": "Detected unnatural facial contours and inconsistent lighting..."
  }
}
```

#### **4. Image URL Analysis**
```http
POST /api/analyze/image_url
Content-Type: application/json

{
  "url": "https://image-url.com/photo.jpg",
  "user_id": "user-uuid (optional)"
}
```

#### **5. Video Forensics**
```http
POST /api/analyze/video
Content-Type: multipart/form-data

file: <video-file.mp4|avi|mov|mkv|webm>
user_id: user-uuid (optional)
```

#### **6. Get Live News Feed**
```http
GET /api/feeds
```

**Response:**
```json
{
  "global_news": [
    {
      "id": "12345",
      "title": "NASA Discovers Water on Mars",
      "source": "AP News",
      "url": "https://...",
      "image_url": "https://...",
      "credibility_score": 98,
      "status": "verified",
      "category": "Science",
      "created_at": "2026-06-28T10:30:00Z"
    }
  ],
  "debunk_rumors": [
    {
      "id": "dyn_r0",
      "claim": "5G Causes COVID-19",
      "status": "debunked",
      "score": 85,
      "summary": "Multiple scientific studies debunk this claim...",
      "source_factcheck": "Snopes",
      "created_at": "2026-06-20T08:00:00Z"
    }
  ]
}
```

#### **7. Domain Reputation Lookup**
```http
GET /api/domain/lookup?domain=example.com
```

**Response:**
```json
{
  "domain": "example.com",
  "trust_score": 92,
  "reputation": "trusted",
  "ssl_valid": true,
  "article_count": 4532
}
```

#### **8. User History**
```http
GET /api/history?user_id=user-uuid
```

#### **9. Chat with AI Assistant**
```http
POST /api/chat
Content-Type: application/json

{
  "message": "How do I verify if an image is deepfaked?",
  "history": [
    {"role": "user", "content": "Previous message..."},
    {"role": "assistant", "content": "Previous response..."}
  ]
}
```

### Interactive API Explorer
Visit `/docs` (Swagger UI) or `/redoc` (ReDoc) after starting the server.

---

## 🗄️ Database Schema

### Tables Overview
- **profiles**: User gamification stats (reputation, rank, XP)
- **scans**: Analysis history (text, URL, image, video)
- **bookmarks**: User-saved scans
- **global_news_feed**: Verified news (pre-seeded)
- **debunk_rumors**: Fact-checked hoaxes

### Row-Level Security (RLS)
All tables implement Supabase RLS policies for data privacy.

---

## 🔐 Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=              # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=         # Supabase anonymous key

# Optional
GEMINI_API_KEY=                        # Google Gemini API key (for advanced AI)
```

---

## 📊 Use Cases

- ✅ **Journalists**: Verify news sources before publishing
- ✅ **Educators**: Teach media literacy and critical thinking
- ✅ **Fact-Checkers**: Automate rumor analysis
- ✅ **Students**: Academic projects on AI & misinformation
- ✅ **Content Creators**: Check image authenticity
- ✅ **Researchers**: Study deepfake detection algorithms

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Click "Deploy"

### Deploy to Railway/Render

```bash
# Railway
railway up

# Or Render
render deploy
```

---

## 🧪 Testing

### Local Testing
```bash
# Run with auto-reload
uvicorn main:app --reload

# Test specific endpoint
curl -X POST http://localhost:8000/api/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Sample text to analyze"}'
```

### API Testing Tools
- Postman: Import `/docs` JSON
- Curl: See examples above
- Python: `requests` library

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Follow PEP 8 style guide
- Add docstrings to functions
- Include unit tests for new features
- Update README if needed

---

## 📋 Roadmap

- [x] Core text analysis engine
- [x] Image EXIF & deepfake detection
- [x] Video forensics pipeline
- [x] Live news feed integration
- [x] AI chatbot integration
- [ ] Real-time collaborative fact-checking
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (custom CNN for deepfakes)
- [ ] Public API with rate limiting

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Atharva Raval**
- 3rd Year Diploma (CSE)
- 📧 Email: atharvraval05@gmail.com
- 🔗 GitHub: [@atharvraval05](https://github.com/atharvraval05)
- 🌐 Portfolio: [Your portfolio link]

---

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced analysis capabilities
- **Supabase** for serverless database infrastructure
- **Vercel** for seamless Python deployment
- **FastAPI** community for excellent documentation

---

## 📞 Support & Contact

- 📖 **Documentation**: Check `/docs` after running the server
- 🐛 **Report Bugs**: [Open an issue](https://github.com/atharvraval05/veritas-fact-forensics/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/atharvraval05/veritas-fact-forensics/discussions)
- 📧 **Email**: atharvraval05@gmail.com

---

**Made with ❤️ for truth and transparency**

<div align="center">

⭐ If this project helped you, please star it!

</div>
