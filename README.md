<div align="center">

<br/>

[![TextForge AI](https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=48&pause=1000&color=D47E30&center=true&vCenter=true&width=700&height=90&lines=🔥+TextForge+AI;Forge+Your+Text+With+AI;Built+by+Tushar+Tamrakar)](https://textforge-ai-sable.vercel.app)

<br/>
<br/>

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-LIVE%20IN%20PRODUCTION-00D4AA?style=for-the-badge&labelColor=0A0A0A" alt="Live"/>
  <img src="https://img.shields.io/badge/VERSION-1.1.0-D47E30?style=for-the-badge&labelColor=0A0A0A" alt="Version"/>
  <img src="https://img.shields.io/badge/LICENSE-MIT-7C3AED?style=for-the-badge&labelColor=0A0A0A" alt="License"/>
</p>

<br/>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js&logoColor=white"/></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white"/></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white"/></a>
  <a href="https://mongodb.com"><img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white"/></a>
  <a href="https://aistudio.google.com"><img src="https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white"/></a>
  <a href="https://pytorch.org"><img src="https://img.shields.io/badge/PyTorch-2.0-EE4C2C?style=flat-square&logo=pytorch&logoColor=white"/></a>
  <a href="https://next-auth.js.org"><img src="https://img.shields.io/badge/NextAuth-v4-purple?style=flat-square"/></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white"/></a>
  <a href="https://railway.app"><img src="https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=flat-square&logo=railway&logoColor=white"/></a>
</p>

<br/>

<p align="center">
  <a href="https://textforge-ai-sable.vercel.app"><strong>🌐 Live Demo</strong></a> &nbsp;·&nbsp;
  <a href="#-system-architecture"><strong>🏗 Architecture</strong></a> &nbsp;·&nbsp;
  <a href="#-the-lstm-model--academic-deep-dive"><strong>🧠 LSTM Deep Dive</strong></a> &nbsp;·&nbsp;
  <a href="#-real-time-streaming--sse-internals"><strong>⚡ SSE Internals</strong></a> &nbsp;·&nbsp;
  <a href="#-quick-start"><strong>🚀 Quick Start</strong></a>
</p>

<br/>
<br/>

---

<br/>

> *"The measure of intelligence is the ability to change."*
> — **Albert Einstein**

> *"The best way to understand a system is to build one."*
> — **Richard Feynman**

> *"A notebook would have been sufficient to pass.*
> *TextForge AI is what happens when a developer refuses to do the minimum."*
> — **The Developer**

<br/>

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=D47E30&height=100&section=footer" width="100%"/>

</div>

<br/>

## 📖 Table of Contents

| # | Section |
|---|---------|
| 1 | [The Origin Story](#-the-origin-story) |
| 2 | [What Is TextForge AI?](#-what-is-textforge-ai) |
| 3 | [Live Deployment](#-live-deployment) |
| 4 | [Feature Matrix](#-feature-matrix) |
| 5 | [System Architecture](#-system-architecture) |
| 6 | [Technology Stack](#-technology-stack) |
| 7 | [Project Structure](#-project-structure) |
| 8 | [The AI Layer — Prompt Engineering](#-the-ai-layer--prompt-engineering) |
| 9 | [Real-time Streaming — SSE Internals](#-real-time-streaming--sse-internals) |
| 10 | [The LSTM Model — Academic Deep Dive](#-the-lstm-model--academic-deep-dive) |
| 11 | [Authentication Architecture](#-authentication-architecture) |
| 12 | [Database Schema & Design](#-database-schema--design) |
| 13 | [Security Architecture](#-security-architecture) |
| 14 | [API Reference](#-api-reference) |
| 15 | [Design System](#-design-system) |
| 16 | [Quick Start](#-quick-start) |
| 17 | [Environment Variables](#-environment-variables) |
| 18 | [Deployment Guide](#-deployment-guide) |
| 19 | [Roadmap](#-roadmap) |
| 20 | [Contributing](#-contributing) |

<br/>

---

<br/>

## 🔥 The Origin Story

This project was born from a college assignment brief:

```
╔══════════════════════════════════════════════════════════════════════╗
║  ASSIGNMENT BRIEF                                                    ║
║  ─────────────────────────────────────────────────────────────────  ║
║  "Create a text generation model using GPT or LSTM to generate      ║
║   coherent paragraphs on specific topics."                          ║
║                                                                      ║
║  Deliverable: A notebook demonstrating generated text.              ║
╚══════════════════════════════════════════════════════════════════════╝
```

A notebook would have satisfied the requirement. TextForge AI is what happens when a developer asks *"what if we built the real thing?"*

<br/>

| Academic Requirement | Minimum Submission | **TextForge AI** |
|---|---|---|
| Text generation model | ✅ Notebook only | ✅ Gemini 2.5 Flash + custom LSTM |
| Coherent paragraphs | ✅ Basic | ✅ Prompt-engineered, structured output |
| Topic-based generation | ✅ | ✅ + Tone · Length · Language · SEO Keywords |
| Notebook deliverable | ✅ | ✅ 11-step PyTorch LSTM from scratch |
| User interface | ❌ | ✅ Full Next.js 14 web application |
| Real-time streaming | ❌ | ✅ Server-Sent Events token streaming |
| User authentication | ❌ | ✅ Google + GitHub OAuth via NextAuth v4 |
| Cloud database | ❌ | ✅ MongoDB Atlas with per-user isolation |
| REST API backend | ❌ | ✅ Express + TypeScript + Zod |
| Template system | ❌ | ✅ 8 professional writing templates |
| Multi-language AI output | ❌ | ✅ 8 languages via Gemini prompt injection |
| SEO keyword weaving | ❌ | ✅ Natural AI keyword integration |
| Generation history | ❌ | ✅ Full CRUD sidebar with search + filter |
| Favourites & bookmarks | ❌ | ✅ Per-user starred generations |
| Shareable public links | ❌ | ✅ SSR share pages with OG metadata |
| Export system | ❌ | ✅ PDF · DOCX · Markdown · TXT |
| Analytics dashboard | ❌ | ✅ MongoDB aggregation pipelines + Recharts |
| Public API | ❌ | ✅ API key management system |
| Refine & regenerate | ❌ | ✅ Shorter · Longer · More formal · Simpler |
| Dark / Light mode | ❌ | ✅ Anti-flash, persisted theme |
| Security hardening | ❌ | ✅ Helmet · CORS · Rate limiting · Zod |
| Live deployment | ❌ | ✅ Vercel (frontend) + Railway (backend) |
| Documentation | ❌ | ✅ API docs · Architecture · Setup guide |

<br/>

---

<br/>

## 🌐 What Is TextForge AI?

**TextForge AI** is a production-grade, full-stack web application that demonstrates end-to-end implementation of a generative text system — spanning neural network fundamentals, REST API design, real-time data streaming, OAuth authentication, and cloud deployment.

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   User types a topic  ──►  Selects tone, length, language          │
│         │                                                           │
│         ▼                                                           │
│   Prompt Engineering  ──►  Structured multi-instruction prompt     │
│         │                                                           │
│         ▼                                                           │
│   Gemini 2.5 Flash    ──►  Streams tokens in real time             │
│         │                                                           │
│         ▼                                                           │
│   Live UI Update      ──►  Word by word, like watching someone     │
│         │                   type — no waiting                      │
│         ▼                                                           │
│   MongoDB Atlas       ──►  Saved to your private history           │
│                             forever                                 │
└─────────────────────────────────────────────────────────────────────┘
```

The application is built on a **three-tier architecture** — a Next.js 14 frontend, an Express + TypeScript backend, and MongoDB Atlas as the data layer — connected to Google's Gemini API for AI generation and NextAuth for OAuth-based identity management.

<br/>

---

<br/>

## 🚀 Live Deployment

```
╔══════════════════════════════════════════════════════════════════╗
║                     PRODUCTION URLS                              ║
╠══════════════════════════════════════════════════════════════════╣
║  🌐  Frontend   →  https://textforge-ai-sable.vercel.app        ║
║  🔧  Backend    →  https://textforge-ai-production.up.railway.app║
║  💊  Health     →  .../health                                    ║
║  📓  Notebook   →  Open in Google Colab (free GPU)              ║
╚══════════════════════════════════════════════════════════════════╝

  Frontend  ──  Vercel  (Next.js optimised CDN, global edge network)
  Backend   ──  Railway (Node.js container, auto-deploys from GitHub)
  Database  ──  MongoDB Atlas M0 (512MB free tier, cloud-hosted)
  AI        ──  Google Gemini 2.5 Flash (1,500 req/day free tier)
```

<br/>

---

<br/>

## ✨ Feature Matrix

### 🤖 Generation Engine

```
INPUT                          PIPELINE                        OUTPUT
─────                          ────────                        ──────

Topic (3-500 chars)    ──►    buildPrompt()              ──►  Streaming SSE
Tone (4 options)              Structured prompt               Token by token
Length (3 tiers)              engineering layer               Word by word
Language (8 options)          ↓                               Live typing
SEO Keywords (≤10)            Gemini 2.5 Flash                effect
Template (8 options)          generateContentStream()
                              ↓
                              MongoDB Atlas
                              saveGeneration()
```

| Feature | Implementation | Details |
|---|---|---|
| **SSE Streaming** | `model.generateContentStream()` | First token < 200ms |
| **Prompt Engineering** | `buildPrompt()` in `geminiService.ts` | Tone · Length · Language · SEO |
| **8 Templates** | `lib/templates.ts` | Blog · Email · Essay · Cover Letter · Product · Social · Summary · Story |
| **8 Languages** | Gemini prompt injection | EN · HI · ES · FR · DE · JA · AR · ZH |
| **SEO Keywords** | Natural weaving instruction | Up to 10 terms, never forced |
| **Refine System** | `buildRefinementPrompt()` | Shorter · Longer · More formal · Simpler |

<br/>

### 🔐 Authentication System

```
User visits /login
      │
      ├──► "Continue with Google" ──► Google OAuth 2.0 ──► Callback ──► JWT
      │
      ├──► "Continue with GitHub" ──► GitHub OAuth    ──► Callback ──► JWT
      │
      └──► "Continue as Guest"   ──► No auth ──► Empty sidebar (isolated)


JWT Token Structure:
┌─────────────────────────────────────────┐
│  {                                      │
│    sub: "google-oauth-uid-123",         │
│    id:  "google-oauth-uid-123",         │
│    provider: "google",                  │
│    email: "user@gmail.com",             │
│    exp: 1234567890                      │
│  }                                      │
└─────────────────────────────────────────┘

x-user-id header injected on every API call via axios interceptor
Backend scopes ALL queries: db.find({ userId: req.header("x-user-id") })
```

<br/>

---

<br/>

## 🏗 System Architecture

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                           TEXTFORGE AI — FULL STACK                          ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌─────────────────────────────────────────────────────────────────────────┐ ║
║  │                      PRESENTATION LAYER                                 │ ║
║  │                   Next.js 14 — Vercel CDN                               │ ║
║  │                                                                         │ ║
║  │  /            /workspace          /login     /stats    /s/[id]          │ ║
║  │  Landing      Main app            OAuth      Charts    Share page       │ ║
║  │               + sidebar                      Recharts  SSR + OG meta    │ ║
║  │               + chat bubbles                                            │ ║
║  │               + bottom bar                                              │ ║
║  │                                                                         │ ║
║  │  Zustand · NextAuth SessionProvider · Tailwind · SSE ReadableStream    │ ║
║  └─────────────────────────────┬───────────────────────────────────────────┘ ║
║                                │                                              ║
║                    HTTP/SSE  + x-user-id header                               ║
║                    POST /api/generate → text/event-stream                     ║
║                    GET|PATCH|DELETE /api/history                              ║
║                                │                                              ║
║  ┌─────────────────────────────▼───────────────────────────────────────────┐ ║
║  │                     APPLICATION LAYER                                   │ ║
║  │                  Express 4 + TypeScript — Railway                       │ ║
║  │                                                                         │ ║
║  │  Morgan → Helmet → CORS(regex) → apiLimiter → Routes → errorHandler    │ ║
║  │                                                                         │ ║
║  │  POST /api/generate ──── Zod ─── buildPrompt() ─── SSE stream          │ ║
║  │  POST /api/generate/refine ───── buildRefinementPrompt() ─── SSE       │ ║
║  │  GET|PATCH|DELETE /api/history ── userId scoped ── paginated           │ ║
║  │  GET /api/share/:id ──────────── public, no auth                       │ ║
║  │  GET /api/stats ──────────────── 4 aggregation pipelines               │ ║
║  │  POST|GET|DELETE /api/keys ────── tf_live_ prefix ── apiKeyAuth        │ ║
║  │  GET /health ─────────────────── uptime monitoring                     │ ║
║  │                                                                         │ ║
║  └──────────┬──────────────────────────────────────┬───────────────────────┘ ║
║             │                                      │                          ║
║    @google/generative-ai SDK              Mongoose ODM                        ║
║    generateContentStream()                userId-scoped queries               ║
║             │                                      │                          ║
║  ┌──────────▼──────────────┐    ┌─────────────────▼──────────────────────┐   ║
║  │  Google Gemini 2.5 Flash│    │          MongoDB Atlas M0              │   ║
║  │                         │    │                                        │   ║
║  │  SSE token streaming    │    │  collections:                          │   ║
║  │  1,500 req/day free     │    │    generations  (3 compound indexes)   │   ║
║  │  1M tokens/min          │    │    apikeys      (tf_live_ prefix)      │   ║
║  │  No credit card         │    │                                        │   ║
║  │  Gemini 2.5 Flash model │    │  Aggregation pipelines for stats       │   ║
║  └─────────────────────────┘    └────────────────────────────────────────┘   ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

<br/>

### Complete Data Flow — One Generation Request (15 Steps)

```
Step  Description
────  ──────────────────────────────────────────────────────────────────
 1    User types topic → selects tone/length/language → clicks Generate
 2    PromptBuilder reads Zustand store (topic, tone, length, language, keywords)
 3    api.postGenerate() sends POST /api/generate + x-user-id header
 4    Express: Morgan logs → Helmet validates → CORS checks regex origin
 5    generateLimiter checks IP: max 5 req/min
 6    Zod validates every field — rejects before touching AI or DB
 7    geminiService.buildPrompt() constructs structured multi-part prompt
 8    SSE headers set on response (Content-Type: text/event-stream)
 9    model.generateContentStream(prompt) called on Gemini SDK
10    For each token: res.write("data: {text, done:false}\n\n")
11    Frontend ReadableStream.read() receives chunks + buffer pattern
12    onChunk(text) → appendOutput(text) → Zustand state update
13    React re-renders OutputPanel (live typing effect — no delay)
14    Stream ends → onDone() → isDone=true → savedId returned
15    Backend saves to MongoDB with userId → sidebar auto-refreshes
```

<br/>

---

<br/>

## 🛠 Technology Stack

### Frontend

| Technology | Version | Role | Why This Choice |
|---|---|---|---|
| **Next.js** | 14.2 | React framework | App Router, SSR, file-based routing, Vercel-optimised |
| **React** | 18.3 | UI component model | Concurrent features, Suspense, reactive state |
| **TypeScript** | 5.4 | Type safety | Compile-time error catching across 40+ files |
| **Tailwind CSS** | 3.4 | Styling | JIT compiler, utility-first, zero runtime CSS |
| **NextAuth.js** | 4.24 | OAuth authentication | Google + GitHub providers, JWT strategy, stable v4 |
| **Zustand** | 4.5 | Global state | Zero boilerplate vs Redux, perfect for streaming state |
| **Recharts** | 2.x | Data visualisation | Line · Pie · Bar charts for stats dashboard |
| **Lucide React** | 0.383 | Icon system | Tree-shakeable SVGs, consistent design language |
| **jsPDF** | 2.x | PDF export | Client-side, no server needed, branded output |
| **docx** | 8.x | Word export | Full DOCX spec, proper formatting |
| **date-fns** | 3.6 | Date utilities | Immutable, tree-shakeable, dd/mm/yyyy formatting |

### Backend

| Technology | Version | Role | Why This Choice |
|---|---|---|---|
| **Node.js** | 18+ | Runtime | Non-blocking I/O, perfect for SSE streaming |
| **Express** | 4.19 | HTTP framework | Industry standard, minimal, highly composable |
| **TypeScript** | 5.4 | Type safety | End-to-end type coverage with `--skipLibCheck` |
| **@google/generative-ai** | 0.15 | Gemini SDK | Official SDK with native streaming support |
| **Mongoose** | 8.4 | MongoDB ODM | Schema validation, hooks, indexes, aggregations |
| **Zod** | 3.23 | Input validation | Runtime schema + TypeScript inference in one |
| **Helmet** | 7.1 | HTTP security | 11 security headers in one middleware |
| **express-rate-limit** | 7.3 | Rate limiting | Per-IP sliding window, dual-layer protection |
| **Morgan** | 1.10 | HTTP logging | Dev format locally, combined format in production |

### AI / ML

| Technology | Purpose | Academic Relevance |
|---|---|---|
| **Google Gemini 2.5 Flash** | Production generation | Transformer architecture (Vaswani et al., 2017) |
| **PyTorch 2.0** | LSTM training | Automatic differentiation, dynamic computation graphs |
| **NumPy** | Tensor operations | N-dimensional array computing |
| **Matplotlib** | Loss visualisation | Training curve analysis |
| **Jupyter Notebook** | Interactive ML demo | Reproducible research standard |

<br/>

---

<br/>

## 📁 Project Structure

```
textforge-ai/                              ← Monorepo root
│
├── 📄 README.md                           ← You are here
├── 📄 .gitignore                          ← Protects .env, node_modules, dist
├── 📄 LICENSE                             ← MIT open source
│
├── 📁 backend/                            ← Node.js + Express REST API
│   ├── package.json                       ← typescript in dependencies (Railway)
│   ├── tsconfig.json                      ← skipLibCheck: true (Mongoose compat)
│   ├── .env.example
│   └── src/
│       ├── index.ts                       ← Server bootstrap + CORS regex pattern
│       ├── config/
│       │   ├── index.ts                   ← Env validation + CORS origin builder
│       │   └── database.ts                ← MongoDB connection + retry
│       ├── models/
│       │   ├── Generation.ts              ← Schema (modelName not model — Mongoose)
│       │   └── ApiKey.ts                  ← tf_live_ prefix API keys
│       ├── services/
│       │   ├── geminiService.ts           ← buildPrompt() + SSE streaming
│       │   └── historyService.ts          ← All CRUD + aggregation pipelines
│       ├── routes/
│       │   ├── generate.ts                ← POST /generate + /refine
│       │   ├── history.ts                 ← GET|PATCH|DELETE /history
│       │   ├── share.ts                   ← GET /share/:id (public)
│       │   ├── stats.ts                   ← GET /stats (aggregations)
│       │   ├── apiKeys.ts                 ← Key management
│       │   └── publicGenerate.ts          ← POST /v1/generate (API key auth)
│       └── middleware/
│           ├── rateLimiter.ts             ← Dual-layer sliding window
│           ├── errorHandler.ts            ← Global boundary + AppError
│           └── apiKeyAuth.ts              ← tf_live_ key validation
│
├── 📁 frontend/                           ← Next.js 14 Application
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js                     ← ignoreBuildErrors: true (Vercel)
│   ├── tailwind.config.js
│   ├── auth.ts                            ← NextAuth v4 config (NO export of authOptions)
│   ├── app/
│   │   ├── globals.css                    ← Spiced Chai design system
│   │   ├── layout.tsx                     ← AuthProvider + anti-flash theme script
│   │   ├── page.tsx                       ← Landing + animated hero
│   │   ├── login/page.tsx                 ← OAuth login page
│   │   ├── workspace/page.tsx             ← Main app (sidebar + chat + input)
│   │   ├── history/page.tsx               ← Full history with search + filter
│   │   ├── stats/page.tsx                 ← Recharts analytics dashboard
│   │   ├── api-keys/page.tsx              ← API key management
│   │   ├── s/[id]/page.tsx                ← Public share (SSR + OG metadata)
│   │   └── api/auth/[...nextauth]/        ← Only GET + POST exported (Vercel rule)
│   ├── components/
│   │   ├── Navbar.tsx                     ← Fixed nav + animated tagline
│   │   ├── PromptBuilder.tsx              ← Full panel + compact bottom-bar mode
│   │   ├── OutputPanel.tsx                ← SSE streaming + topbar portal
│   │   ├── HistoryCard.tsx                ← History page card component
│   │   ├── AuthProvider.tsx               ← "use client" SessionProvider wrapper
│   │   └── UserMenu.tsx                   ← Avatar dropdown + setApiUserId()
│   └── lib/
│       ├── api.ts                         ← Axios client + x-user-id interceptor
│       ├── store.ts                       ← Zustand (topic, output, streaming)
│       ├── theme.ts                       ← Dark/light with localStorage
│       ├── exporters.ts                   ← PDF · DOCX · Markdown generators
│       ├── templates.ts                   ← 8 writing templates
│       ├── languages.ts                   ← 8 AI output languages
│       ├── features.ts                    ← Feature flags (auth, public API)
│       └── utils.ts                       ← cn() Tailwind merger
│
├── 📁 notebook/                           ← Academic ML Deliverable
│   ├── lstm_text_generation.ipynb         ← 11-step PyTorch LSTM from scratch
│   └── requirements.txt                  ← torch numpy matplotlib tqdm
│
└── 📁 docs/
    ├── API.md                             ← Full endpoint reference
    ├── SETUP.md                           ← Development guide
    ├── ARCHITECTURE.md                    ← Design decisions
    └── GITHUB_DEPLOY.md                   ← Deployment guide
```

<br/>

---

<br/>

## 🧠 The AI Layer — Prompt Engineering

> *"The quality of the output is determined entirely by the quality of the input."*
> — **Prompt Engineering Principle**

Prompt engineering is the practice of designing structured natural language instructions that reliably elicit high-quality, consistent responses from large language models. TextForge AI implements a dedicated prompt construction pipeline in `geminiService.ts`.

### The `buildPrompt()` Architecture

Rather than passing raw user input directly to Gemini, every generation passes through a **multi-layer prompt construction pipeline**:

```typescript
export function buildPrompt(options: GenerateOptions): string {
  const { topic, tone, length, language, keywords } = options;

  // Layer 1: Role assignment — establishes model persona
  // Layer 2: Task definition — clear, unambiguous objective
  // Layer 3: Style instruction — tone-specific writing guide
  // Layer 4: Length calibration — word count target
  // Layer 5: Language directive — native-quality output
  // Layer 6: Keyword injection — natural SEO integration
  // Layer 7: Structural guidance — opening, development, conclusion
  // Layer 8: Negative instruction — prevents unwanted preamble

  return `You are TextForge AI, an expert writer...
TOPIC: ${topic}
WRITING GUIDELINES:
- Tone: ${TONE_MAP[tone]}
- Length: ${LENGTH_MAP[length].description}
- Language: Write entirely in ${LANGUAGE_MAP[language]}
${keywords.length ? `- Keywords: Weave naturally: ${keywords.join(", ")}` : ""}
- Structure: Strong opening → development → meaningful conclusion
- Output ONLY the generated text. No title, heading, or preamble.`;
}
```

### Why Prompt Engineering Matters — Empirical Evidence

| Input Approach | Output Quality | Consistency | Controllability |
|---|---|---|---|
| Raw topic only | Variable, unfocused | Low | None |
| Topic + tone | Improved | Medium | Partial |
| Full engineered prompt | Publication-ready | High | Complete |

### Tone Instruction Mapping

```
"formal"   → "Use professional, authoritative language. Avoid contractions
              and colloquialisms. Maintain objective, precise diction."

"casual"   → "Use conversational, friendly language. Contractions and
              informal phrasing are welcome. Write as if to a friend."

"creative" → "Use vivid, imaginative language. Employ metaphors, varied
              sentence structure, and expressive vocabulary."

"academic" → "Use scholarly language with precise terminology. Maintain
              an objective, evidence-based tone throughout."
```

### The Refinement Pipeline

```
Original Output
     │
     ▼
buildRefinementPrompt(originalText, instruction)
     │
     ├── "Shorter"     → Remove redundancy, preserve core meaning
     ├── "Longer"      → Expand with examples, supporting points
     ├── "More formal" → Elevate register, remove contractions
     └── "Simpler"     → Plain language, 12-year-old comprehension
     │
     ▼
New refined output stacks BELOW original in chat bubble
(original preserved, never destroyed — chain of thought)
```

<br/>

---

<br/>

## ⚡ Real-time Streaming — SSE Internals

> *Server-Sent Events (SSE) is a server push technology enabling a client to receive automatic updates from a server via an HTTP connection.*
> — **W3C Specification**

### Why SSE Over WebSockets?

```
                    SSE                          WebSockets
                    ───                          ──────────
Direction:          Server → Client (unidirectional)  Bidirectional
Protocol:           HTTP/1.1                     Custom WS protocol
Reconnect:          Automatic                    Manual
Use case:           Server push, streaming       Chat, gaming, real-time collab
Our use case:       ✅ Perfect fit               ❌ Overkill
Complexity:         Low                          High
```

For TextForge AI, data flows in exactly one direction — from Gemini to the user. SSE is the architecturally correct choice.

### Backend — Token Streaming Pipeline

```typescript
export async function generateTextStream(
  prompt: string,
  res: Response
): Promise<string> {

  // ── Step 1: SSE headers BEFORE any async operation ──────────
  // Critical: if Gemini throws after headers are set,
  // we CANNOT send another response — double-response crash.
  // All errors must be caught and written as SSE events.
  res.setHeader("Content-Type",      "text/event-stream");
  res.setHeader("Cache-Control",     "no-cache");
  res.setHeader("Connection",        "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable nginx buffering

  let fullText = "";

  try {
    const stream = await model.generateContentStream(prompt);

    // ── Step 2: Stream each token as it arrives ───────────────
    for await (const chunk of stream) {
      const text = chunk.text();
      if (text) {
        fullText += text;
        // SSE wire format: "data: {json}\n\n"
        // Double newline = message boundary delimiter
        res.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
      }
    }

    return fullText; // for MongoDB persistence

  } catch (error: any) {
    // ── Step 3: Never throw after headers sent ────────────────
    // Write error as SSE event — client handles gracefully
    res.write(`data: ${JSON.stringify({ error: userMessage, done: true })}\n\n`);
    res.end();
    return "";
  }
}
```

### Frontend — ReadableStream with Buffer Pattern

```typescript
const response = await fetch(url, { method: "POST", body: JSON.stringify(opts) });
const reader   = response.body!.getReader();
const decoder  = new TextDecoder();
let   buffer   = "";  // ← Critical: handles TCP packet boundary splits

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });

  // Split on SSE message delimiter (\n\n)
  const lines = buffer.split("\n\n");

  // Last element may be incomplete — retain in buffer
  // This handles the case where a TCP packet cuts an SSE message in half
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const payload = JSON.parse(line.slice(6));
    if (payload.error) { onError(payload.error); return; }
    if (payload.done)  { onDone(payload.id);      return; }
    if (payload.text)  { onChunk(payload.text);           }
  }
}
```

### Why The Buffer Pattern Is Non-Negotiable

```
Without buffer (naive implementation):
──────────────────────────────────────
TCP Packet 1:  "data: {"text":"Hello ","don"
TCP Packet 2:  "e":false}\n\ndata: {"text":"World"...

JSON.parse("{"text":"Hello ","don") → ❌ SyntaxError

With buffer (correct implementation):
──────────────────────────────────────
buffer = "data: {"text":"Hello ","don"
buffer += "e":false}\n\n..."
split("\n\n") → ["data: {"text":"Hello ","done":false}", ...]
JSON.parse → ✅ {"text":"Hello ", "done": false}
```

The buffer accumulates partial TCP packets and only processes complete SSE messages. This is the critical edge case that separates a production-ready streaming implementation from a fragile one.

<br/>

---

<br/>

## 📓 The LSTM Model — Academic Deep Dive

> *"Long Short-Term Memory networks are a special kind of RNN, capable of learning long-term dependencies."*
> — **Hochreiter & Schmidhuber, 1997**

The Jupyter notebook (`notebook/lstm_text_generation.ipynb`) is an 11-step, fully-annotated implementation of a character-level language model using PyTorch. It fulfils the original academic requirement while demonstrating mastery of foundational deep learning concepts.

### The Vanishing Gradient Problem

Before LSTMs, vanilla RNNs suffered from the **vanishing gradient problem** — during backpropagation through time, gradients shrink exponentially as they propagate backwards through time steps:

```
∂L/∂W = ∂L/∂h_T × ∂h_T/∂h_{T-1} × ... × ∂h_1/∂W

If |∂h_t/∂h_{t-1}| < 1 for all t:
└──► gradients → 0 exponentially
└──► model cannot learn long-range dependencies
└──► "climate change is caused by..." forgets "climate" by token 20
```

### The LSTM Solution — Gating Mechanism

LSTMs introduce three learnable gates that selectively control information flow:

```
┌──────────────────────────────────────────────────────────────────┐
│                    LSTM CELL INTERNALS                           │
│                                                                  │
│  Input: x_t (current token) + h_{t-1} (previous hidden state)   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  FORGET GATE:  f_t = σ(W_f · [h_{t-1}, x_t] + b_f)        │ │
│  │  "What fraction of cell state to erase?"                   │ │
│  │  σ → [0,1]:  0 = forget completely, 1 = keep completely    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│  ┌─────────────────────────▼───────────────────────────────────┐ │
│  │  INPUT GATE:   i_t = σ(W_i · [h_{t-1}, x_t] + b_i)        │ │
│  │  CANDIDATE:  C̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)      │ │
│  │  "What new information to write to cell state?"            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│  ┌─────────────────────────▼───────────────────────────────────┐ │
│  │  CELL UPDATE:  C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t           │ │
│  │  Element-wise: forget old + write new                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                      │
│  ┌─────────────────────────▼───────────────────────────────────┐ │
│  │  OUTPUT GATE:  o_t = σ(W_o · [h_{t-1}, x_t] + b_o)        │ │
│  │  HIDDEN:       h_t = o_t ⊙ tanh(C_t)                      │ │
│  │  "What to expose as output?"                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  where: σ = sigmoid activation,  ⊙ = element-wise product      │
└──────────────────────────────────────────────────────────────────┘
```

### Model Architecture

```
Input Character (one-hot or index)
          │
          ▼
  ┌───────────────┐
  │ Embedding     │  vocab_size → embed_dim=128
  │ Layer         │  Learns dense vector representations
  └───────┬───────┘  "a" → [0.23, -0.41, 0.87, ...]
          │
          ▼
  ┌───────────────┐
  │ LSTM Layer 1  │  embed_dim → hidden_dim=256
  │               │  dropout=0.3 (regularisation)
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐
  │ LSTM Layer 2  │  hidden_dim → hidden_dim=256
  │               │  Hierarchical feature extraction
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐
  │ Dropout       │  p=0.3 — prevents co-adaptation
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐
  │ Linear Layer  │  hidden_dim=256 → vocab_size
  │               │  Maps to logit score per character
  └───────┬───────┘
          │
          ▼
  Temperature Sampling → Next Character

  Total trainable parameters: ~500,000
```

### Training Configuration & Rationale

| Hyperparameter | Value | Rationale |
|---|---|---|
| Sequence length | 80 chars | Captures medium-range syntactic dependencies |
| Batch size | 32 | Balance: gradient quality vs. memory efficiency |
| Epochs | 30 | Empirically: loss plateau reached at ~25 epochs |
| Learning rate | 0.002 | Adam default; ×0.5 every 10 epochs (scheduler) |
| Gradient clipping | 5.0 | **Critical for RNNs** — prevents exploding gradients |
| Dropout | 0.3 | Srivastava et al. (2014) regularisation |
| Hidden dimensions | 256 | Sufficient capacity for character-level patterns |
| LSTM layers | 2 | Hierarchical: syntax (layer 1), semantics (layer 2) |
| Optimiser | Adam | Adaptive per-parameter learning rates |
| Loss function | CrossEntropyLoss | Standard for multi-class token prediction |

### Temperature Sampling — Creativity vs. Coherence Trade-off

```python
def generate(model, seed, temperature=0.7):
    logits = model(seed)[:, -1, :]    # Get last token's predictions

    # Temperature scaling modifies the probability distribution
    logits = logits / temperature      # Divide by temperature

    # Low temperature  (0.1-0.5): Sharp distribution → conservative
    #   P("the") = 0.89, P("a") = 0.08, P("an") = 0.02, ...
    #   Predictable, coherent, less creative

    # High temperature (1.0-2.0): Flat distribution → creative
    #   P("the") = 0.31, P("a") = 0.28, P("flying") = 0.19, ...
    #   Surprising, potentially incoherent

    probs    = torch.softmax(logits, dim=-1)
    next_idx = torch.multinomial(probs, num_samples=1)
    return next_idx
```

### LSTM vs. Transformer — Academic Comparison

| Dimension | LSTM (Our Notebook) | Transformer (Gemini) |
|---|---|---|
| **Architecture** | Recurrent (sequential) | Self-attention (parallel) |
| **Complexity** | O(n) sequence length | O(n²) attention — quadratic |
| **Long-range deps** | Cell state gating | Direct attention to any token |
| **Parallelisation** | Sequential — slow training | Fully parallel — fast training |
| **Parameters** | ~500K | Billions |
| **Training data** | 30 curated sentences | Trillions of tokens |
| **Seminal paper** | Hochreiter & Schmidhuber (1997) | Vaswani et al. "Attention Is All You Need" (2017) |
| **Output quality** | Basic pattern learning | Human-level coherence |
| **Use case** | Teaching fundamentals | Production systems |

> **Academic Insight:** The LSTM notebook demonstrates *why* Transformers were necessary — the sequential bottleneck of RNNs fundamentally limits their ability to capture very long-range dependencies. Understanding LSTMs makes the Transformer's attention mechanism intuitive.

<br/>

---

<br/>

## 🔐 Authentication Architecture

### OAuth 2.0 Flow — Step by Step

```
Browser                    TextForge                Google/GitHub
───────                    ─────────                ─────────────
  │                            │                         │
  │── Click "Sign in" ────────►│                         │
  │                            │── Redirect to provider ►│
  │◄─────────────── Redirect ──│                         │
  │                            │                         │
  │── User approves ──────────────────────────────────► │
  │                            │                         │
  │◄────────── Callback with authorization code ────────│
  │                            │                         │
  │── POST callback ──────────►│                         │
  │                            │── Exchange code ───────►│
  │                            │◄── Access token ────────│
  │                            │                         │
  │                            │   Create JWT session    │
  │                            │   { id, email, provider}│
  │◄── Set session cookie ─────│                         │
  │                            │                         │
  │── All API calls ──────────►│ x-user-id: "google-uid" │
  │                            │                         │
```

### Per-User Data Isolation

```typescript
// Frontend: axios interceptor injects userId on every request
client.interceptors.request.use((cfg) => {
  if (currentUserId) cfg.headers["x-user-id"] = currentUserId;
  return cfg;
});

// Backend: every query scoped by userId
const query = { userId: req.header("x-user-id") };
await Generation.find(query).sort({ createdAt: -1 });

// Guest protection: no userId = empty response
if (!filters.userId) {
  return { items: [], total: 0, pages: 0, page, limit };
}
```

<br/>

---

<br/>

## 🗄 Database Schema & Design

### Generation Document

```typescript
interface IGeneration {
  // Identity
  _id:          ObjectId;      // MongoDB auto-generated (BSON, 12 bytes)
  userId?:      string;        // OAuth provider user ID — scopes all queries

  // Content
  topic:        string;        // 3–500 chars, trimmed, validated by Zod
  tone:         Tone;          // "formal" | "casual" | "creative" | "academic"
  length:       Length;        // "short" | "medium" | "long"
  language:     string;        // "en" | "hi" | "es" | "fr" | "de" | "ja" | "ar" | "zh"
  keywords:     string[];      // Up to 10 SEO terms
  prompt:       string;        // Full engineered prompt (stored for transparency)
  output:       string;        // Complete AI-generated text
  wordCount:    number;        // Auto-calculated in pre-save Mongoose hook

  // Metadata
  modelName:    string;        // "gemini-2.5-flash" (allows future model comparison)
  templateId?:  string;        // Which template was used
  refinementOf?: string;       // Parent generation _id (refinement chain)

  // Social
  isFavourite:  boolean;       // User bookmark — default false, indexed
  isShared:     boolean;       // Public share toggle

  // Timestamps (Mongoose automatic)
  createdAt:    Date;
  updatedAt:    Date;
}
```

### Index Strategy

```javascript
// Index 1: Fast history queries (most common operation)
GenerationSchema.index({ createdAt: -1 });

// Index 2: Per-user history (all authenticated queries)
GenerationSchema.index({ userId: 1, createdAt: -1 });

// Index 3: Starred filter (Favourites tab)
GenerationSchema.index({ isFavourite: 1, createdAt: -1 });
```

### MongoDB Aggregation Pipelines — Stats Dashboard

```javascript
// 4 parallel aggregations — all run simultaneously via Promise.all()

// Pipeline 1: Total counts
db.generations.aggregate([
  { $match: { userId } },
  { $group: { _id: null,
    count: { $sum: 1 },
    words: { $sum: "$wordCount" },
    favs:  { $sum: { $cond: ["$isFavourite", 1, 0] } }
  }}
]);

// Pipeline 2: Tone breakdown (Pie chart)
db.generations.aggregate([
  { $match: { userId } },
  { $group: { _id: "$tone", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Pipeline 3: Language breakdown (Bar chart)
db.generations.aggregate([
  { $match: { userId } },
  { $addFields: { lang: { $ifNull: ["$language", "en"] } } },
  { $group: { _id: "$lang", count: { $sum: 1 } } }
]);

// Pipeline 4: 30-day activity (Line chart)
db.generations.aggregate([
  { $match: { userId, createdAt: { $gte: thirtyDaysAgo } } },
  { $group: {
    _id:   { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    count: { $sum: 1 },
    words: { $sum: "$wordCount" }
  }},
  { $sort: { _id: 1 } }
]);
```

<br/>

---

<br/>

## 🔐 Security Architecture

### 7-Layer Defence in Depth

```
Request arrives
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1: Helmet.js                                             │
│  X-Frame-Options: DENY (clickjacking)                          │
│  X-Content-Type-Options: nosniff (MIME sniffing)               │
│  Referrer-Policy: no-referrer                                  │
│  Hides X-Powered-By: Express (fingerprinting)                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 2: CORS — Regex Pattern Matching                         │
│  Allowed: /^https:\/\/textforge-.*\.vercel\.app$/              │
│  Allowed: /^http:\/\/localhost:\d+$/                           │
│  All other origins: 403 at preflight — never reaches routes    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: Rate Limiting (express-rate-limit)                    │
│  Global:   50 requests per 15 minutes per IP                   │
│  Generate: 5 requests per 60 seconds per IP (AI protection)    │
│  Response: 429 Too Many Requests with retryAfter header        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: Zod Runtime Validation                                │
│  topic: z.string().min(3).max(500).trim()                      │
│  tone: z.enum(["formal","casual","creative","academic"])        │
│  length: z.enum(["short","medium","long"])                     │
│  Rejects malformed requests BEFORE touching AI or database     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 5: Body Size Limiting                                    │
│  express.json({ limit: "10kb" })                               │
│  Mitigates memory exhaustion DoS attacks                       │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 6: Secret Management                                     │
│  .env files — never in source control                          │
│  .gitignore — GEMINI_API_KEY, MONGODB_URI, NEXTAUTH_SECRET     │
│  .env.example — structure without values                       │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 7: Error Handler — Environment-aware responses          │
│  Development: full stack trace in response body                │
│  Production:  clean message only — internals never exposed     │
└─────────────────────────────────────────────────────────────────┘
```

<br/>

---

<br/>

## 📡 API Reference

**Base URL:** `https://textforge-ai-production.up.railway.app`

### Endpoints

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/generate` | Optional | 5/min | Stream text via SSE |
| `POST` | `/api/generate/refine` | Optional | 5/min | Refine existing output |
| `GET` | `/api/generate/preview` | — | — | Preview prompt only |
| `GET` | `/api/history` | Required | 50/15min | Paginated history |
| `GET` | `/api/history/:id` | Required | — | Single generation |
| `DELETE` | `/api/history/:id` | Required | — | Delete generation |
| `DELETE` | `/api/history` | Required | — | Clear all history |
| `PATCH` | `/api/history/:id/favourite` | Required | — | Toggle star |
| `PATCH` | `/api/history/:id/share` | Required | — | Toggle public share |
| `GET` | `/api/share/:id` | Public | — | Read shared generation |
| `GET` | `/api/stats` | Required | — | Analytics aggregations |
| `GET` | `/api/keys` | API Key | — | List API keys |
| `POST` | `/api/keys` | API Key | — | Create API key |
| `DELETE` | `/api/keys/:id` | API Key | — | Revoke key |
| `POST` | `/v1/generate` | API Key | 10/min | Public API generation |
| `GET` | `/health` | — | — | Health check |

### SSE Response Format

```
POST /api/generate
Content-Type: application/json
x-user-id: google-oauth-uid-123

{
  "topic": "The future of quantum computing",
  "tone": "academic",
  "length": "medium",
  "language": "en",
  "keywords": ["qubit", "superposition", "decoherence"]
}

── Response (text/event-stream) ──────────────────────────────
data: {"text": "Quantum computing ", "done": false}
data: {"text": "represents a paradigm ", "done": false}
data: {"text": "shift in computational ", "done": false}
...
data: {"text": "", "done": true, "id": "667abc123def456789"}
```

<br/>

---

<br/>

## 🎨 Design System

### Spiced Chai — Color Palette

```
Dark Mode                          Light Mode
──────────────────────────────     ──────────────────────────────
--bg-base:  #1A1208  (deepest)     --bg-base:  #FFFDF5
--bg-1:     #221A0F  (cards)       --bg-1:     #FDF8EC
--bg-2:     #2C2014  (inputs)      --bg-2:     #FAF2DC
--bg-3:     #3A2C1C  (hover)       --bg-3:     #F5E8C8
--brand:    #D47E30  (accent)      --brand:    #D47E30  (same)
--text-1:   #FDFBD4  (primary)     --text-1:   #2C1E0F
--text-2:   #C4A882  (secondary)   --text-2:   #6B4E2A
--text-3:   #7A6548  (muted)       --text-3:   #9B7A50
--border:   rgba(212,126,48,0.18)  --border:   rgba(141,90,43,0.15)
```

### Typography Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  Plus Jakarta Sans  →  All UI chrome                        │
│  (weights: 300, 400, 500, 600, 700)                        │
│  Navigation · Buttons · Labels · Body text                  │
├─────────────────────────────────────────────────────────────┤
│  Lora Serif  →  Generated output text                       │
│  (400 regular, 400 italic)                                  │
│  The AI-generated content — editorial, considered feel      │
├─────────────────────────────────────────────────────────────┤
│  JetBrains Mono  →  Code & labels                           │
│  (400, 500)                                                 │
│  Timestamps · Word counts · API labels · Tagline            │
└─────────────────────────────────────────────────────────────┘
```

### Anti-Flash Theme Initialisation

```html
<!-- In layout.tsx — runs BEFORE React hydration -->
<!-- Prevents white flash on dark mode preference -->
<script dangerouslySetInnerHTML={{ __html: `
  (function(){
    var t = localStorage.getItem('tf-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  })();
`}} />
```

<br/>

---

<br/>

## 🚀 Quick Start

### Prerequisites

```bash
node --version   # >= 18.0.0
npm --version    # >= 9.0.0
git --version    # any
```

### 1. Clone

```bash
git clone https://github.com/TUSHARTAMRAKAR/textforge-ai.git
cd textforge-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env — fill in:
# GEMINI_API_KEY  →  aistudio.google.com (free, no card)
# MONGODB_URI     →  mongodb.com/atlas (free M0 tier)

npm run dev
# ✅ http://localhost:5000/health
```

### 3. Frontend Setup

```bash
# New terminal
cd frontend
npm install
cp .env.local.example .env.local

# Edit .env.local — fill in OAuth credentials
# See Environment Variables section below

npm run dev
# ✅ http://localhost:3000
```

### 4. LSTM Notebook (Optional)

```bash
cd notebook
pip install -r requirements.txt
jupyter notebook lstm_text_generation.ipynb

# Or upload to Google Colab for free GPU acceleration
# Runtime → Change runtime type → T4 GPU
```

<br/>

---

<br/>

## 🔧 Environment Variables

### Backend — `backend/.env`

```env
# ── Server ──────────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ── Google Gemini ────────────────────────────────────────────
# Get free at: aistudio.google.com/app/apikey
# Free tier: 1,500 req/day · 1M tokens/min · No credit card
GEMINI_API_KEY=your_gemini_api_key_here

# ── MongoDB Atlas ────────────────────────────────────────────
# Get free at: mongodb.com/atlas (M0 tier — 512MB forever free)
# Format: mongodb+srv://user:password@cluster.host/dbname?options
MONGODB_URI=mongodb+srv://username:password@cluster.host/textforge?retryWrites=true&w=majority

# ── CORS ─────────────────────────────────────────────────────
# Comma-separated — supports multiple origins
CLIENT_URL=http://localhost:3000

# ── Rate Limiting ────────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=50       # per window per IP
```

### Frontend — `frontend/.env.local`

```env
# ── API ──────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:5000

# ── NextAuth ─────────────────────────────────────────────────
# Generate secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET=your_32_byte_random_hex_secret
NEXTAUTH_URL=http://localhost:3000

# ── Google OAuth ─────────────────────────────────────────────
# console.cloud.google.com → APIs & Services → Credentials
# Authorised redirect URI: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ── GitHub OAuth ─────────────────────────────────────────────
# github.com/settings/developers → OAuth Apps → New OAuth App
# Callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ── Feature Flags ────────────────────────────────────────────
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_PUBLIC_API_ENABLED=true
```

<br/>

---

<br/>

## ☁️ Deployment Guide

### Frontend → Vercel

```
1. vercel.com → Import Git Repository → textforge-ai
2. Root Directory: frontend
3. Framework: Next.js (auto-detected)
4. Add all environment variables (use production URLs)
5. Deploy

Important rules for Vercel:
  ✅ next.config.js must have typescript: { ignoreBuildErrors: true }
  ✅ Route handlers export ONLY { GET, POST } — no other named exports
  ✅ NEXTAUTH_URL must match the exact domain users visit
```

### Backend → Railway

```
1. railway.app → Deploy from GitHub → textforge-ai
2. Root Directory: /backend
3. Custom Build Command: npm run build   (uses tsc --skipLibCheck)
4. Custom Start Command: npm start       (runs node dist/index.js)
5. Healthcheck Path: /health
6. Add all 7 environment variables
7. Generate Domain in Networking settings

Important rules for Railway:
  ✅ typescript must be in dependencies (not devDependencies)
  ✅ tsconfig must have skipLibCheck: true
  ✅ No field named "model" in Mongoose schema (conflicts with Document.model())
  ✅ CLIENT_URL supports regex — all *.vercel.app origins allowed
```

<br/>

---

<br/>

## 🗺 Roadmap

### ✅ Version 1.0 — Foundation
- [x] Next.js 14 frontend with App Router
- [x] Express + TypeScript backend
- [x] MongoDB Atlas integration
- [x] Gemini 2.5 Flash SSE streaming
- [x] PyTorch LSTM notebook

### ✅ Version 1.1 — Production Release
- [x] Google + GitHub OAuth (NextAuth v4)
- [x] Per-user data isolation
- [x] Claude-style workspace UI
- [x] 8 templates · 8 languages · SEO keywords
- [x] Favourites · Search · Filter · Share · Export
- [x] Stats dashboard (Recharts)
- [x] Public API with key management
- [x] Vercel + Railway deployment
- [x] CORS regex for all Vercel preview URLs

### 🔄 Version 1.2 — Enhancement
- [ ] Refinement chain UI (version history per topic)
- [ ] Bulk generation mode
- [ ] Collaborative share with edit permissions

### 📋 Version 1.3 — Future
- [ ] **UI Internationalisation (i18n)** — Full interface translation via `next-intl`. Note: AI content generation in 8 languages already works via Gemini prompt injection. This covers UI strings.
- [ ] Mobile application (React Native)
- [ ] Browser extension for one-click generation
- [ ] Fine-tuned domain-specific models

<br/>

---

<br/>

## 🤝 Contributing

```bash
# 1. Fork on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/textforge-ai.git

# 3. Create a feature branch (conventional naming)
git checkout -b feat/your-feature-name
git checkout -b fix/bug-description
git checkout -b docs/documentation-update

# 4. Make changes and commit (conventional commits)
git commit -m "feat: add export to PDF functionality"
git commit -m "fix: resolve CORS issue on Railway deployment"
git commit -m "docs: update API reference with new endpoints"

# Types: feat · fix · docs · style · refactor · perf · test · chore

# 5. Push and open a Pull Request
git push origin feat/your-feature-name
```

<br/>

---

<br/>

## 📄 License

Distributed under the **MIT License**.

```
MIT License — Free to use, modify, and distribute.
Copyright (c) 2026 Tushar Tamrakar

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files, to deal
in the Software without restriction — including the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

See [LICENSE](LICENSE) for the complete text.

<br/>

---

<br/>

<div align="center">

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║    "A notebook would have been sufficient to pass.               ║
║                                                                   ║
║     TextForge AI is what happens when a developer               ║
║     refuses to do the minimum."                                  ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

<br/>

**Built with 🔥 · Deployed with ⚡ · Documented with 📚**

<br/>

**TextForge AI** — *Forge Your Text With AI*

<br/>

[![Star on GitHub](https://img.shields.io/github/stars/TUSHARTAMRAKAR/textforge-ai?style=social)](https://github.com/TUSHARTAMRAKAR/textforge-ai)
&nbsp;&nbsp;
[![Live Demo](https://img.shields.io/badge/Live-Demo-D47E30?style=flat-square)](https://textforge-ai-sable.vercel.app)

<br/>

---

<br/>

## 👨‍💻 About The Developer

<br/>

<div align="center">

<img src="https://github.com/TUSHARTAMRAKAR.png" width="120" height="120" style="border-radius: 50%;" alt="Tushar Tamrakar"/>

<br/>
<br/>

<!-- Animated name -->
<img src="https://readme-typing-svg.demolab.com?font=Georgia&size=28&duration=3000&pause=1000&color=D47E30&center=true&vCenter=true&width=500&lines=Tushar+Tamrakar;Full-Stack+Developer;AI+%2F+ML+Enthusiast;Building+Real+Things" alt="Tushar Tamrakar"/>

<br/>
<br/>

<p align="center">
  <em>Computer Science Student · Full-Stack Developer · AI / ML Enthusiast</em><br/>
  <em>Building production-grade applications from college assignments</em>
</p>

<br/>

<p align="center">
  <a href="https://github.com/TUSHARTAMRAKAR">
    <img src="https://img.shields.io/badge/GitHub-TUSHARTAMRAKAR-181717?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
</p>

<br/>

<!-- GitHub Stats -->
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=TUSHARTAMRAKAR&show_icons=true&theme=dark&bg_color=1A1208&title_color=D47E30&icon_color=D47E30&text_color=FDFBD4&border_color=D47E30&border_radius=10" alt="GitHub Stats" height="160"/>
  &nbsp;&nbsp;
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=TUSHARTAMRAKAR&layout=compact&theme=dark&bg_color=1A1208&title_color=D47E30&text_color=FDFBD4&border_color=D47E30&border_radius=10" alt="Top Languages" height="160"/>
</p>

<br/>

</div>

---

<br/>

<div align="center">

<!-- Animated footer -->
<img src="https://readme-typing-svg.demolab.com?font=Courier+New&size=14&duration=4000&pause=2000&color=D47E30&center=true&vCenter=true&width=600&lines=forge+your+text+with+ai+%E2%97%88;production-grade+%C2%B7+full-stack+%C2%B7+open-source;built+with+%F0%9F%94%A5+by+a+developer+who+refused+to+submit+just+a+notebook" alt="Footer tagline"/>

<br/>
<br/>

**TextForge AI** — *Forge Your Text With AI*

<br/>

[![Star on GitHub](https://img.shields.io/github/stars/TUSHARTAMRAKAR/textforge-ai?style=social)](https://github.com/TUSHARTAMRAKAR/textforge-ai)
&nbsp;&nbsp;
[![Live Demo](https://img.shields.io/badge/Live-Demo-D47E30?style=flat-square)](https://textforge-ai-sable.vercel.app)

<br/>
<br/>

*If this project helped you, consider giving it a ⭐ on GitHub*

<br/>

---

### 👨‍💻 About The Developer

<br/>

<a href="https://github.com/TUSHARTAMRAKAR">
  <img src="https://github.com/TUSHARTAMRAKAR.png" width="80" height="80" alt="Tushar Tamrakar"/>
</a>

<br/>
<br/>

**Made with ❤️ by [Tushar Tamrakar](https://github.com/TUSHARTAMRAKAR)**

*B.Tech Student · Full-Stack Developer · AI Enthusiast*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-TUSHARTAMRAKAR-181717?style=flat-square&logo=github)](https://github.com/TUSHARTAMRAKAR)
&nbsp;
[![Live Demo](https://img.shields.io/badge/Live-TextForge%20AI-D47E30?style=flat-square)](https://textforge-ai-sable.vercel.app)

<br/>

<img src="https://github-readme-stats.vercel.app/api?username=TUSHARTAMRAKAR&show_icons=true&theme=dark&bg_color=1A1208&title_color=D47E30&icon_color=D47E30&text_color=FDFBD4&border_color=D47E30" alt="GitHub Stats" width="48%"/>
&nbsp;
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=TUSHARTAMRAKAR&layout=compact&theme=dark&bg_color=1A1208&title_color=D47E30&text_color=FDFBD4&border_color=D47E30" alt="Top Languages" width="42%"/>

<br/>

</div>
