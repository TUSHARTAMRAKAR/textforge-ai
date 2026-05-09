# TextForge AI — GitHub Deployment Guide

## Step 1: Create the GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `textforge-ai`
3. Description: `🔥 Full-stack AI text generation app — Next.js + Express + Gemini + MongoDB`
4. Set to **Public** (so recruiters and teachers can see it)
5. **Do NOT** initialise with README (we already have one)
6. Click **Create repository**

---

## Step 2: Push your code

Open your terminal inside the `textforge-ai/` folder:

```bash
# Initialise git
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial TextForge AI project setup

- Next.js 14 frontend with App Router
- Express + TypeScript backend
- Google Gemini 2.0 Flash streaming integration
- MongoDB Atlas history with Mongoose
- LSTM demo notebook
- Full documentation"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/textforge-ai.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 3: Verify on GitHub

After pushing, your repo should show:
- ✅ Beautiful README rendered on the homepage
- ✅ All folders: `frontend/`, `backend/`, `notebook/`, `docs/`
- ✅ No `.env` files (check — they must NOT be there)

---

## Step 4: Add GitHub Topics (makes it discoverable)

On your repo page → click the ⚙️ gear next to **About** → add topics:
```
nextjs  react  typescript  express  mongodb  gemini  ai  text-generation  lstm  nlp
```

---

## Commit Message Convention

Use conventional commits for a professional history:

```bash
git commit -m "feat: add copy-to-clipboard in OutputPanel"
git commit -m "fix: handle SSE connection timeout"
git commit -m "docs: update API.md with preview endpoint"
git commit -m "style: improve HistoryCard responsive layout"
git commit -m "refactor: extract prompt builder logic to utils"
```

Format: `type(scope): description`
Types: `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

---

## Optional: Deploy for Free

### Frontend → Vercel (free)
1. Go to [vercel.com](https://vercel.com) → Import project from GitHub
2. Set root to `frontend/`
3. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

### Backend → Railway (free tier)
1. Go to [railway.app](https://railway.app) → Deploy from GitHub
2. Set root to `backend/`
3. Add all env vars from `.env.example`
4. Railway auto-detects Node.js and runs `npm start`
