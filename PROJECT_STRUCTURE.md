# Project Structure Documentation

## 📁 Directory Layout

```
veritas-fact-forensics/
├── 📄 README.md                          # Main project documentation
├── 📄 LICENSE                            # MIT License
├── 📄 CHANGELOG.md                       # Version history and updates
├── 📄 CONTRIBUTING.md                    # Contribution guidelines
├── 📄 PROJECT_STRUCTURE.md               # This file
│
├── 🐍 main.py                            # FastAPI application entry point
├── requirements.txt                      # Python dependencies
├── .env.example                          # Environment variables template
├── .gitignore                            # Git ignore rules
│
├── 📁 utils/                             # Utility modules
│   ├── __init__.py
│   ├── gemini_service.py                 # AI analysis using Google Gemini
│   ├── exif_reader.py                    # EXIF metadata extraction
│   ├── db.py                             # Supabase database operations
│   └── gnews_decoder.py                  # Google News URL decoding
│
├── 📁 static/                            # Frontend assets
│   ├── index.html                        # Main HTML template
│   ├── 📁 css/                           # Stylesheets
│   │   └── style.css
│   └── 📁 js/                            # Client-side JavaScript
│       └── app.js
│
├── 📁 tests/                             # Test suite (to be created)
│   ├── __init__.py
│   ├── test_gemini_service.py
│   ├── test_exif_reader.py
│   ├── test_db.py
│   └── conftest.py                       # Pytest configuration
│
├── 📁 .github/                           # GitHub configuration
│   ├── 📁 workflows/                     # GitHub Actions
│   │   ├── tests.yml                     # Test & lint workflow
│   │   └── deploy.yml                    # Deployment workflow
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── 📁 docs/                              # Extended documentation (optional)
│   ├── API.md                            # API reference
│   ├── ARCHITECTURE.md                   # System architecture
│   ├── DEPLOYMENT.md                     # Deployment guide
│   └── DATABASE.md                       # Database schema docs
│
├── 📁 scratch/                           # Temporary/experimental files
│   └── .gitkeep
│
├── schema.sql                            # Database schema (Supabase)
├── setup_db.py                           # Database initialization script
├── install_node.py                       # Node.js installation script
├── vercel.json                           # Vercel deployment config
│
└── .env                                  # Environment variables (local only)
```

---

## 📝 File Descriptions

### Core Application Files

| File | Purpose | Description |
|------|---------|-------------|
| `main.py` | Application Entry Point | FastAPI application with all API endpoints, middleware setup, and request handlers |
| `requirements.txt` | Dependencies | Python packages needed for the project |
| `.env.example` | Config Template | Template for environment variables (copy to `.env` locally) |
| `vercel.json` | Deployment Config | Vercel-specific configuration for Python runtime |

### Utility Modules (`utils/`)

| Module | Purpose | Key Functions |
|--------|---------|---|
| `gemini_service.py` | AI Analysis Engine | `analyze_article_text()`, `analyze_image()`, `analyze_video()` |
| `exif_reader.py` | Image Metadata | `scan_image_metadata()` - extracts EXIF data from images |
| `db.py` | Database Layer | `save_scan()`, `get_user_history()`, `get_bookmarks()`, database queries |
| `gnews_decoder.py` | URL Decoding | `decode_google_news_url_async()` - resolves Google News URLs |

### Frontend Assets (`static/`)

| File | Purpose |
|------|---------|
| `index.html` | Main UI template |
| `css/style.css` | Styling and layout |
| `js/app.js` | Client-side logic and API calls |

### Testing (`tests/`)

| File | Purpose |
|------|---------|
| `test_gemini_service.py` | Tests for AI analysis functions |
| `test_exif_reader.py` | Tests for image metadata extraction |
| `test_db.py` | Tests for database operations |
| `conftest.py` | Pytest fixtures and configuration |

### CI/CD Workflows (`.github/workflows/`)

| Workflow | Trigger | Actions |
|----------|---------|---------|
| `tests.yml` | Push/PR to main/develop | Run linting, tests, coverage checks |
| `deploy.yml` | Push to main | Build and deploy to Vercel |

---

## 🔄 Request Flow

```
User Request
    ↓
[main.py - FastAPI Route Handler]
    ↓
[Input Validation & Preprocessing]
    ↓
[Select Analysis Type]
    ├─→ Text → utils.gemini_service.analyze_article_text()
    ├─→ Image → utils.exif_reader.scan_image_metadata() + gemini_service.analyze_image()
    ├─→ Video → gemini_service.analyze_video()
    └─→ URL → scrape + analyze_article_text()
    ↓
[Database Operations - utils.db module]
    ├─→ save_scan()
    ├─→ get_user_history()
    └─→ add_bookmark()
    ↓
[Response to Client]
```

---

## 🗄️ Database Schema

### Key Tables

1. **profiles**
   - User information, reputation, gamification stats
   - RLS: Users can only modify their own profile

2. **scans**
   - Analysis history (text, URL, image, video)
   - Stores credibility scores, metrics, reasoning
   - RLS: Public scans readable by all, private scans owner-only

3. **bookmarks**
   - User-saved scans
   - Links users to scans they bookmarked
   - RLS: Users can only access own bookmarks

4. **global_news_feed**
   - Pre-seeded verified news articles
   - Read-only for users
   - Updated periodically with live RSS feeds

5. **debunk_rumors**
   - Fact-checked claims and hoaxes
   - Links to fact-checker sources
   - Threat/credibility scores

---

## 🚀 Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
│  (Source Code)  │
└────────┬────────┘
         │
         ↓ (Push to main)
┌─────────────────────┐
│  GitHub Actions     │
│  (CI/CD Pipeline)   │
│  - Tests            │
│  - Build            │
├─────────────────────┤
│  Tests Pass ✓       │
│  Build Success ✓    │
└────────┬────────────┘
         │
         ↓ (Deploy)
┌─────────────────────┐
│  Vercel Servers     │
│  - Python Runtime   │
│  - FastAPI App      │
└────────┬────────────┘
         │
         ↓ (Connected to)
┌─────────────────────┐
│  Supabase Database  │
│  - PostgreSQL       │
│  - Real-time Sync   │
└─────────────────────┘
         │
         ↓ (Served at)
https://veritas-fact-forensics.vercel.app
```

---

## 📦 Dependencies Overview

### Core Framework
- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI web server
- **Pydantic** - Data validation

### AI & ML
- **google-generativeai** - Gemini AI API
- **scikit-learn** - Machine learning (TF-IDF)
- **numpy** - Numerical computing

### Data & APIs
- **httpx** - Async HTTP client
- **supabase** - Database client
- **exifread** - EXIF metadata reading

### Utilities
- **python-multipart** - Form data parsing

---

## 🔐 Security Features

1. **CORS Middleware** - Controls cross-origin requests
2. **Row-Level Security (RLS)** - Database-level access control
3. **Environment Variables** - Sensitive data protection
4. **Input Validation** - Pydantic schemas
5. **Error Handling** - Prevents information leakage

---

## 📊 Adding New Features

### Adding a New Analysis Type

1. **Create utility function in `utils/` module**
   ```python
   # utils/new_analyzer.py
   def analyze_new_type(data: dict) -> dict:
       # Implementation
       return {"score": 0, "analysis": "..."}
   ```

2. **Add endpoint in `main.py`**
   ```python
   @app.post("/api/analyze/new-type")
   async def analyze_new_type_route(req: NewTypeRequest):
       result = analyze_new_type(req.data)
       saved = save_scan(...)
       return {"analysis": result}
   ```

3. **Update documentation**
   - Add to README.md API section
   - Add to CHANGELOG.md
   - Update request/response examples

4. **Add tests in `tests/`**
   ```python
   def test_analyze_new_type():
       result = analyze_new_type(sample_data)
       assert "score" in result
   ```

---

## 🧪 Testing Strategy

- **Unit Tests**: Individual function testing
- **Integration Tests**: Multi-module interaction
- **API Tests**: Endpoint validation
- **Database Tests**: Query correctness

Run tests: `pytest --cov=utils -v`

---

## 📈 Performance Optimization

- **Caching**: 5-minute cache for RSS feeds
- **Async Operations**: Concurrent API calls
- **Database Indexing**: Indexed frequently queried columns
- **Lazy Loading**: Load images/videos on demand

---

## 🔗 Related Documentation

- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [API Documentation](README.md#-api-documentation) - Endpoint reference

---

**Last Updated**: 2026-06-28
