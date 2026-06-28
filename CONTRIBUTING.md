# Contributing to Veritas Fact-Forensics

Thank you for your interest in contributing to Veritas! This document provides guidelines and instructions for contributing.

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:
- Be respectful and inclusive
- Report inappropriate behavior to maintainers
- Focus on constructive feedback
- Collaborate in good faith

## 🤔 How to Contribute

### Reporting Bugs

Before creating a bug report, please check the [issue list](https://github.com/atharvraval05/veritas-fact-forensics/issues) to avoid duplicates.

**When creating a bug report, include:**
- Clear, descriptive title
- Step-by-step reproduction instructions
- Expected vs actual behavior
- Screenshots/logs if applicable
- Your system information (OS, Python version, etc.)
- Relevant code snippets

### Suggesting Features

**When suggesting a feature:**
- Use a clear, descriptive title
- Provide a detailed description of the feature
- Explain the use case and benefits
- List similar features in other projects if applicable
- Include mockups/examples if relevant

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/veritas-fact-forensics.git
   cd veritas-fact-forensics
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding style (PEP 8 for Python)
   - Add docstrings to functions and classes
   - Write clear commit messages
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add descriptive message of changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Reference related issues (e.g., "Closes #123")
   - Provide a clear description of changes
   - Include screenshots/videos for UI changes
   - Request reviewers

## 🎨 Coding Standards

### Python Code Style
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use type hints where possible
- Maximum line length: 100 characters
- Use meaningful variable names

### Docstring Format
```python
def analyze_sentiment(text: str) -> dict:
    """
    Analyze the sentiment of given text.
    
    Args:
        text (str): The input text to analyze
        
    Returns:
        dict: Dictionary containing:
            - sentiment (str): 'positive', 'negative', or 'neutral'
            - score (float): Confidence score (0-1)
            - reasoning (str): Explanation of analysis
            
    Raises:
        ValueError: If text is empty
        
    Example:
        >>> analyze_sentiment("I love this project!")
        {'sentiment': 'positive', 'score': 0.95, 'reasoning': '...'}
    """
    pass
```

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

**Type:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

**Example:**
```
feat: Add image watermark detection

- Implemented PIL-based watermark scanner
- Added detection confidence scoring
- Integrated with image forensics pipeline

Closes #42
```

## 🧪 Testing

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-cov pytest-asyncio

# Run all tests
pytest

# Run with coverage
pytest --cov=utils tests/

# Run specific test
pytest tests/test_gemini_service.py -v
```

### Writing Tests
```python
import pytest
from utils.gemini_service import analyze_article_text

def test_analyze_article_text_high_credibility():
    """Test that factual articles receive high credibility scores."""
    result = analyze_article_text("NASA confirms water on Mars", url="https://nasa.gov")
    assert result["credibility_score"] >= 80
    assert result["bias_category"] in ["left", "right", "center", "mixed"]

@pytest.mark.asyncio
async def test_analyze_url_with_scraping():
    """Test URL analysis with web scraping."""
    result = await analyze_url("https://example.com/article")
    assert "headline" in result
    assert "analysis" in result
```

## 📦 Development Setup

### Prerequisites
- Python 3.9+
- Pip or Conda
- Git

### Setup Steps
```bash
# Clone repository
git clone https://github.com/atharvraval05/veritas-fact-forensics.git
cd veritas-fact-forensics

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install dev dependencies
pip install pytest pytest-asyncio pytest-cov black flake8 mypy

# Setup pre-commit hooks (optional)
pip install pre-commit
pre-commit install
```

### Running Development Server
```bash
# With auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# API documentation
# Swagger: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc
```

## 📚 Documentation

### Updating Documentation
- Edit `.md` files in the root directory
- Follow Markdown best practices
- Include code examples where relevant
- Keep documentation in sync with code changes

### Docstring Requirements
All public functions must have docstrings including:
- Brief description
- Args with types
- Returns with type and description
- Raises if applicable
- Examples for complex functions

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Or use GitHub integration
# (automatic deployment on push to main)
```

## 📝 Pull Request Review Process

1. **Automated Checks**
   - Code style validation
   - Test suite runs
   - Build verification

2. **Manual Review**
   - Code quality assessment
   - Logic verification
   - Documentation check

3. **Approval & Merge**
   - Minimum 1 approval required
   - All checks must pass
   - Squash and merge recommended

## 🎯 Priority Areas for Contribution

1. **Deepfake Detection**: Improve ML models
2. **Performance**: Optimize database queries, API responses
3. **Testing**: Increase test coverage
4. **Documentation**: Enhance API docs, add tutorials
5. **Frontend**: Build modern React/Next.js UI
6. **Accessibility**: Improve WCAG compliance

## 🔐 Security

### Reporting Security Issues
**Do NOT open public issues for security vulnerabilities.**

Instead:
1. Email atharvraval05@gmail.com with details
2. Include reproduction steps
3. Suggest a fix if possible
4. Allow 30 days for response before disclosure

## ✨ Recognition

Contributors will be recognized in:
- README.md Contributors section
- GitHub contributors page
- Release notes

## 📞 Need Help?

- 📧 Email: atharvraval05@gmail.com
- 💬 GitHub Discussions: [Ask questions](https://github.com/atharvraval05/veritas-fact-forensics/discussions)
- 📖 Documentation: Check README.md and code comments

---

**Thank you for contributing to Veritas! Together, we're building tools for truth. ❤️**
