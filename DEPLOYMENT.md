# Deployment Guide

This guide covers deploying Veritas to production environments.

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema initialized
- [ ] Dependencies installed
- [ ] Tests passing
- [ ] Security review completed
- [ ] API documentation reviewed
- [ ] Monitoring setup complete

---

## 🌐 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account with repository pushed
- Vercel account (free tier available)
- Environment variables ready

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `veritas-fact-forensics`

### Step 2: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Access your live app at provided URL

### Post-Deployment Verification

```bash
# Test the live API
curl https://your-vercel-url.vercel.app/api/config

# Should return:
# {"is_mock_mode": false, "supabase_url": "...", "supabase_anon_key": "..."}
```

---

## 🐳 Docker Deployment

### Create Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/config || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

```bash
# Build image
docker build -t veritas-forensics .

# Run container
docker run -p 8000:8000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  -e GEMINI_API_KEY=your-key \
  veritas-forensics

# Access at http://localhost:8000
```

---

## ☁️ Railway Deployment

### Step 1: Connect Repository

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize and select your repository

### Step 2: Add Environment Variables

In Railway Dashboard → Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

### Step 3: Deploy

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

---

## 🚀 Render Deployment

### Step 1: Create render.yaml

```yaml
services:
  - type: web
    name: veritas-forensics
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: NEXT_PUBLIC_SUPABASE_URL
        scope: build,runtime
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        scope: build,runtime
      - key: GEMINI_API_KEY
        scope: build,runtime
```

### Step 2: Deploy

1. Push `render.yaml` to GitHub
2. Go to [render.com](https://render.com)
3. Click "New +"
4. Select "Web Service"
5. Connect GitHub repository
6. Configure environment variables
7. Deploy

---

## 🗄️ Database Setup

### Supabase Setup

1. Create new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Create new query
4. Copy-paste `schema.sql` contents
5. Execute

### Verify Setup

```bash
# Test connection
python setup_db.py

# Should output:
# Database connection successful
# Tables created
```

---

## 🔐 Security Considerations

### Before Production Deployment

1. **Rotate API Keys**
   ```bash
   # In Supabase dashboard
   Settings → API → Regenerate API Keys
   ```

2. **Enable HTTPS**
   - Vercel: Automatic
   - Custom domain: Use Let's Encrypt

3. **Configure CORS**
   - Whitelist production domains only
   - Remove `allow_origins=["*"]` from main.py

4. **Enable Rate Limiting**
   ```python
   from slowapi import Limiter
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   ```

5. **Enable Database Backups**
   - Supabase: Automatic daily backups
   - Configure retention policy

---

## 📊 Monitoring & Logging

### Vercel Analytics

```bash
# View deployment logs
vercel logs

# View usage
vercel env list
```

### Application Monitoring

```python
# Add to main.py
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/health")
def health_check():
    logger.info("Health check endpoint called")
    return {"status": "healthy"}
```

### Sentry Integration (Optional)

```bash
pip install sentry-sdk

# Add to main.py
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. "Module not found" error
```bash
# Solution: Verify requirements.txt is up to date
pip freeze > requirements.txt
git push
```

#### 2. Database connection timeout
```bash
# Solution: Check Supabase connection string
echo $NEXT_PUBLIC_SUPABASE_URL
# Verify network access is enabled
```

#### 3. API returning 500 errors
```bash
# Solution: Check logs
vercel logs --tail

# Check environment variables
vercel env list
```

#### 4. Deepfake detection not working
```bash
# Solution: Verify Gemini API key
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models
```

---

## 📈 Performance Optimization

### Caching Strategy

```python
import time
CACHE_DURATION = 300  # 5 minutes

FEEDS_CACHE = {
    "last_updated": 0.0,
    "data": None
}

@app.get("/api/feeds")
async def get_feeds():
    current_time = time.time()
    if (current_time - FEEDS_CACHE["last_updated"]) < CACHE_DURATION:
        return FEEDS_CACHE["data"]
    # Fetch fresh data
```

### Database Indexing

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
```

### API Response Compression

```python
from fastapi.middleware.gzip import GZIPMiddleware

app.add_middleware(GZIPMiddleware, minimum_size=1000)
```

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Support

For deployment issues:
- Check [Vercel Docs](https://vercel.com/docs)
- Review [Supabase Docs](https://supabase.com/docs)
- Open GitHub issue with error logs

---

**Last Updated**: 2026-06-28
