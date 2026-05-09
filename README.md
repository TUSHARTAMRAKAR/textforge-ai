<div align="center">

<img src="https://img.shields.io/badge/TextForge-AI-6366f1?style=for-the-badge&logo=fire&logoColor=white" alt="TextForge AI" height="40"/>

# 🔥 TextForge AI

### Generative Text Model — Full-Stack AI Web Application

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Generate coherent, high-quality text on any topic with real-time AI streaming.**  
Built with Next.js 14, Node.js/Express, MongoDB Atlas, and Google Gemini 2.0 Flash.

[Live Demo](#) · [API Docs](docs/API.md) · [Setup Guide](docs/SETUP.md) · [LSTM Notebook](notebook/)

</div>

---

## ✨ Features

- **🤖 AI-powered generation** — Google Gemini 2.0 Flash for state-of-the-art text quality
- **⚡ Real-time streaming** — Watch text appear token-by-token via Server-Sent Events (SSE)
- **🎛️ Full control** — Choose topic, tone (formal / casual / creative / academic) and length
- **📚 Generation history** — Every output saved to MongoDB with word count and metadata
- **🔒 Rate limiting** — Protects API quota with per-IP limits (5 generations/min)
- **📓 LSTM Notebook** — Bonus Jupyter notebook demonstrating character-level LSTM from scratch
- **📱 Responsive UI** — Mobile-first dark theme built with Tailwind CSS

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                 │
│  Home Page → Generate Page → History Page               │
│  Zustand state · React Query · Tailwind CSS             │
└────────────────────┬────────────────────────────────────┘
                     │ REST + SSE (fetch)
┌────────────────────▼────────────────────────────────────┐
│                  BACKEND (Express + TypeScript)          │
│  POST /api/generate  ·  GET|DELETE /api/history          │
│  Rate Limiting · Helmet · Zod Validation                 │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐  ┌────────────▼──────────────────┐
│   Google Gemini API  │  │       MongoDB Atlas            │
│   gemini-2.0-flash  │  │   generations collection       │
│   SSE streaming     │  │   indexed by createdAt         │
└─────────────────────┘  └───────────────────────────────┘
```

---

## 📁 Project Structure

```
textforge-ai/
├── 📁 frontend/                  # Next.js 14 App Router
│   ├── app/
│   │   ├── layout.tsx            # Root layout + Navbar + Toaster
│   │   ├── page.tsx              # Landing page
│   │   ├── generate/page.tsx     # Main generator (PromptBuilder + OutputPanel)
│   │   └── history/page.tsx      # Paginated generation history
│   ├── components/
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   ├── PromptBuilder.tsx     # Topic, tone, length controls + trigger
│   │   ├── OutputPanel.tsx       # Live streaming output + copy/download
│   │   └── HistoryCard.tsx       # Individual history entry card
│   └── lib/
│       ├── api.ts                # All backend API calls (SSE + REST)
│       ├── store.ts              # Zustand global state
│       └── utils.ts              # cn() Tailwind helper
│
├── 📁 backend/                   # Node.js + Express API
│   └── src/
│       ├── config/
│       │   ├── index.ts          # Environment variable validation
│       │   └── database.ts       # MongoDB Atlas connection
│       ├── models/
│       │   └── Generation.ts     # Mongoose schema + word count hook
│       ├── services/
│       │   ├── geminiService.ts  # Prompt engineering + SSE streaming
│       │   └── historyService.ts # CRUD operations for generations
│       ├── routes/
│       │   ├── generate.ts       # POST /api/generate (Zod validated)
│       │   └── history.ts        # GET / DELETE /api/history
│       ├── middleware/
│       │   ├── rateLimiter.ts    # express-rate-limit config
│       │   └── errorHandler.ts   # Global error handler
│       └── index.ts              # App entry point + server bootstrap
│
├── 📁 notebook/                  # Bonus: LSTM demo
│   ├── lstm_text_generation.ipynb
│   └── requirements.txt
│
├── 📁 docs/
│   ├── API.md                    # Full API reference
│   ├── SETUP.md                  # Dev environment setup guide
│   └── ARCHITECTURE.md           # System design decisions
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Google account (for free Gemini API key)
- MongoDB Atlas free account

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/textforge-ai.git
cd textforge-ai
```

### 2. Get your free Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → **Create API key**
3. Copy the key — no card required ✅

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=your_key_here
MONGODB_URI=your_mongodb_atlas_uri_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
# ✅ http://localhost:5000/health
```

### 4. Frontend setup

```bash
cd ../frontend
npm install
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
# ✅ http://localhost:3000
```

### 5. LSTM Notebook (optional)

```bash
cd ../notebook
pip install -r requirements.txt
jupyter notebook lstm_text_generation.ipynb
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate` | Generate text (SSE stream) |
| `GET` | `/api/generate/preview` | Preview prompt (no AI call) |
| `GET` | `/api/history` | Get paginated history |
| `GET` | `/api/history/:id` | Get single generation |
| `DELETE` | `/api/history/:id` | Delete one generation |
| `DELETE` | `/api/history` | Clear all history |
| `GET` | `/health` | Health check |

See [docs/API.md](docs/API.md) for full request/response examples.

---

## 🧠 How It Works

### Prompt Engineering
TextForge doesn't just pass the user's topic directly to Gemini. It builds a structured prompt:

```
You are TextForge AI, an expert writer...
TOPIC: {user_topic}
WRITING GUIDELINES:
  - Tone: {tone_guidance}
  - Length: {length_guidance}
  - Structure: strong opening → development → conclusion
```

This produces far more coherent, structured output than a raw prompt.

### Real-time Streaming (SSE)
The backend uses `generateContentStream()` from the Gemini SDK and forwards each token chunk as a Server-Sent Event:
```
data: {"text": "Artificial ", "done": false}
data: {"text": "intelligence ", "done": false}
...
data: {"text": "", "done": true}
```

The frontend reads this via the Fetch Streams API and appends each chunk to React state in real time.

---

## 🧪 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | React framework + SSR |
| Styling | Tailwind CSS | Utility-first CSS |
| State | Zustand | Lightweight global state |
| Backend | Express + TypeScript | REST API server |
| AI | Google Gemini 2.0 Flash | Text generation |
| Database | MongoDB Atlas + Mongoose | Generation history |
| Validation | Zod | Runtime type safety |
| Security | Helmet + express-rate-limit | API protection |
| ML Demo | PyTorch LSTM | Academic baseline |

---

## 📄 License

MIT © 2025 TextForge AI
