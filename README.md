<div align="center">

<img src="https://img.shields.io/badge/TextForge-AI-D47E30?style=for-the-badge&logo=fire&logoColor=white" alt="TextForge AI" height="40"/>

# 🔥 TextForge AI

### Generative Text Model — Full-Stack AI Web Application

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Generate coherent, high-quality text on any topic with real-time AI streaming.**
Built with Next.js 14, Node.js/Express, MongoDB Atlas, and Google Gemini 2.5 Flash.

[Setup Guide](docs/SETUP.md) · [API Docs](docs/API.md) · [Deploy Guide](docs/DEPLOY.md) · [LSTM Notebook](notebook/)

</div>

---

## ✨ Features

### Core
- **🤖 Gemini 2.5 Flash** — Google's latest free model for state-of-the-art text quality
- **⚡ Real-time streaming** — Watch text appear token-by-token via Server-Sent Events
- **🎛️ Full control** — Topic, tone (formal / casual / creative / academic) and length
- **🔒 Rate limited** — Smart per-IP and per-API-key limits
- **📓 LSTM notebook** — Bonus academic deliverable from scratch in PyTorch

### New in v1.1
- **🌍 Multi-language output** — English · Hindi · Spanish · French · German · Japanese · Arabic · Chinese
- **🔑 SEO keywords** — Up to 10 keywords woven naturally into the output
- **📝 Custom templates** — Blog post, email, essay, cover letter, product description, social, summary, story
- **♻️ Refine / Regenerate** — Shorter · Longer · More formal · Simpler — one click
- **⭐ Favourites & bookmarks** — Star generations, separate Favourites tab
- **🔍 Search & filter history** — Full-text search + filter by tone or language
- **🔗 Share generations** — Public read-only links anyone can open
- **📤 Export to PDF / DOCX / Markdown** — Download in any format
- **📊 Stats dashboard** — Total generations, words forged, 30-day usage chart, tone & language breakdown
- **🔐 User authentication (optional)** — Google + GitHub via NextAuth, per-user history
- **🛠️ Public API mode** — Mint API keys, call `/v1/generate` from your own apps

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js 14)                    │
│  Home · Generate · History · Stats · API Keys · /s/:id    │
│  Zustand state · Recharts · jsPDF · docx · NextAuth (opt) │
└────────────────────┬─────────────────────────────────────┘
                     │ REST + SSE (fetch)
┌────────────────────▼─────────────────────────────────────┐
│              BACKEND (Express + TypeScript)               │
│  Internal:  /api/generate  /api/history  /api/share       │
│             /api/stats     /api/keys                      │
│  Public:    /v1/generate   (Bearer tf_live_xxx)           │
│  Helmet · Zod · rate-limit · per-key + per-IP limits      │
└──────────┬───────────────────────────────┬───────────────┘
           │                               │
┌──────────▼──────────┐         ┌──────────▼──────────────┐
│  Google Gemini API  │         │     MongoDB Atlas        │
│  gemini-2.5-flash   │         │  generations · apiKeys   │
└─────────────────────┘         └──────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Google account (free Gemini API key — no card)
- MongoDB Atlas free account

### 1. Clone

```bash
git clone https://github.com/TUSHARTAMRAKAR/textforge-ai.git
cd textforge-ai
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: add GEMINI_API_KEY and MONGODB_URI
npm run dev
# ✅ http://localhost:5000/health
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
# ✅ http://localhost:3000
```

### 4. (Optional) Enable user authentication

See [docs/AUTH.md](docs/AUTH.md) for the full Google + GitHub OAuth walkthrough.
TL;DR — set `NEXT_PUBLIC_AUTH_ENABLED=true` and fill in `AUTH_GOOGLE_ID`/`SECRET` and/or `AUTH_GITHUB_ID`/`SECRET` plus `AUTH_SECRET` (generate via `openssl rand -base64 32`).

---

## 🔌 API Reference

### Internal API (used by the web app)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate` | Generate text (SSE stream) |
| `POST` | `/api/generate/refine` | Regenerate with refinement instruction |
| `GET`  | `/api/generate/preview` | Preview engineered prompt (no AI call) |
| `GET`  | `/api/history` | Paginated history with `?search`, `?tone`, `?language`, `?favouritesOnly` |
| `GET`  | `/api/history/:id` | Get single generation |
| `PATCH`| `/api/history/:id/favourite` | Toggle favourite |
| `PATCH`| `/api/history/:id/share` | Toggle share status |
| `DELETE`| `/api/history/:id` | Delete one |
| `DELETE`| `/api/history` | Clear all |
| `GET`  | `/api/share/:id` | Public read-only generation (powers `/s/:id`) |
| `GET`  | `/api/stats` | Aggregated stats for the dashboard |
| `GET`  | `/api/keys` | List user's API keys |
| `POST` | `/api/keys` | Create a new API key (returned in plain text once) |
| `DELETE`| `/api/keys/:id` | Revoke a key |
| `GET`  | `/health` | Health check |

### Public API (third-party access via API key)

```bash
curl -X POST http://localhost:5000/v1/generate \
  -H "Authorization: Bearer tf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "The future of renewable energy",
    "tone": "academic",
    "length": "medium",
    "language": "en",
    "keywords": ["solar", "wind", "grid"]
  }'
```

Returns `{ success, data: { id, output, wordCount, model, createdAt } }`.

See [docs/API.md](docs/API.md) for full request/response examples.

---

## 🧪 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS variables |
| Charts | Recharts |
| State | Zustand |
| Auth (optional) | NextAuth v5 (Google + GitHub) |
| Exports | jsPDF + docx |
| Backend | Express + TypeScript |
| AI | Google Gemini 2.5 Flash |
| Database | MongoDB Atlas + Mongoose |
| Validation | Zod |
| Security | Helmet + express-rate-limit |
| ML demo | PyTorch LSTM |

---

## 🚢 Deploying

See [docs/DEPLOY.md](docs/DEPLOY.md) for one-shot deployment to **Vercel (frontend) + Railway (backend)** — both on free tiers.

---

## 📄 License

MIT © 2025 TextForge AI
