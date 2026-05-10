<div align="center">

<br/>

<img width="72" height="72" src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/flame.svg" alt="TextForge AI"/>

<br/>
<br/>

# TextForge AI

<p align="center">
  <strong>A production-grade, full-stack Generative Text Model</strong><br/>
  <sub>Built with Next.js 14 · Express · MongoDB Atlas · Google Gemini 2.5 Flash · PyTorch LSTM · NextAuth</sub>
</p>

<br/>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js"/></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/></a>
  <a href="https://mongodb.com/atlas"><img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/></a>
  <a href="https://aistudio.google.com"><img src="https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini"/></a>
  <a href="https://pytorch.org"><img src="https://img.shields.io/badge/PyTorch-2.0-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" alt="PyTorch"/></a>
  <a href="https://next-auth.js.org"><img src="https://img.shields.io/badge/NextAuth-4.24-purple?style=flat-square" alt="NextAuth"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-D47E30?style=flat-square" alt="MIT License"/></a>
</p>

<br/>

<p align="center">
  <a href="#-live-demo">Live Demo</a> ·
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-system-architecture">Architecture</a> ·
  <a href="#-feature-set">Features</a> ·
  <a href="#-api-reference">API</a> ·
  <a href="#-the-lstm-notebook">LSTM Notebook</a> ·
  <a href="#-roadmap">Roadmap</a>
</p>

<br/>

> *"The measure of a developer is not in the lines of code they write,*
> *but in the systems they architect and the problems they solve."*

<br/>

</div>

---

## The Origin Story

This project began as a college assignment:

> *"Create a text generation model using GPT or LSTM to generate coherent paragraphs on specific topics. Deliverable: A notebook demonstrating generated text based on user prompts."*

A notebook would have been sufficient. TextForge AI is what happens when a developer refuses to do the minimum.

| Requirement | Minimum Submission | TextForge AI |
|---|---|---|
| Text generation model | ✅ Basic | ✅ Gemini 2.5 Flash + custom LSTM |
| Coherent output | ✅ | ✅ Prompt-engineered, structured |
| Topic-based generation | ✅ | ✅ + Tone, Length, Language, SEO Keywords |
| Notebook deliverable | ✅ | ✅ 11-step PyTorch LSTM from scratch |
| User interface | ❌ | ✅ Full Next.js 14 application |
| Real-time streaming | ❌ | ✅ Token-by-token SSE streaming |
| Authentication | ❌ | ✅ Google + GitHub OAuth (NextAuth v4) |
| Cloud database | ❌ | ✅ MongoDB Atlas with per-user scoping |
| REST API backend | ❌ | ✅ Express + TypeScript + Zod |
| Template system | ❌ | ✅ 8 professional templates |
| Multi-language AI output | ❌ | ✅ 8 languages via Gemini |
| SEO keyword weaving | ❌ | ✅ Natural keyword integration |
| Generation history | ❌ | ✅ Full CRUD with sidebar |
| Favourites & bookmarks | ❌ | ✅ Per-user starred generations |
| Shareable links | ❌ | ✅ Public SSR share pages |
| Export system | ❌ | ✅ PDF, DOCX, Markdown, TXT |
| Stats dashboard | ❌ | ✅ MongoDB aggregation analytics |
| Public API mode | ❌ | ✅ API key management system |
| Refine & regenerate | ❌ | ✅ Shorter / Longer / More formal |
| Dark / Light mode | ❌ | ✅ Persisted, flash-free |
| Security hardening | ❌ | ✅ Helmet, CORS, Rate limiting, Zod |
| Documentation | ❌ | ✅ API docs, Architecture, Setup guide |
| Professional README | ❌ | ✅ You're reading it |

---

## 🚀 Live Demo

> Deployment in progress — frontend on Vercel, backend on Railway.

```
Frontend  →  https://textforge-ai.vercel.app
Backend   →  https://textforge-api.railway.app
Health    →  https://textforge-api.railway.app/health
Notebook  →  Open in Google Colab (free GPU)
```

---

## ✨ Feature Set

### 🤖 Generation Engine
- **Real-time SSE Streaming** — Text appears token-by-token. First character visible within 200ms using Server-Sent Events over a persistent HTTP connection.
- **Prompt Engineering** — Every generation passes through a structured prompt construction pipeline in `geminiService.ts`. Tone, length, language, and SEO keywords are architecturally woven into a single high-fidelity model instruction.
- **8 Professional Templates** — Blog Post, Professional Email, Essay, Cover Letter, Product Description, Social Media, Executive Summary, Short Story. Each pre-configures the optimal tone, length, and topic guidance.
- **Multi-language Output** — Generate in English, Hindi, Spanish, French, German, Japanese, Arabic, Mandarin. Language instruction is injected at the prompt level — no post-processing, no translation API needed.
- **SEO Keyword Weaving** — Up to 10 keywords are instructed to appear naturally within the generated text. Not stuffed. Not forced. Woven.
- **Refine & Regenerate** — Shorter, Longer, More formal, Simpler. One click sends the existing output back through Gemini with a refinement instruction. The refined result stacks below the original.

### 🔐 Authentication
- **Google + GitHub OAuth** — Industry-standard OAuth 2.0 flow via NextAuth v4. JWT strategy — no database needed for sessions.
- **Per-user data isolation** — Every generation, favourite, and API key is scoped to `userId`. Logged-in users see only their own history. Guest mode works fully anonymously.
- **Beautiful login page** — Custom `/login` with Google and GitHub buttons, guest mode option, and the full TextForge Spiced Chai design.
- **Claude-style user menu** — Avatar, name, email, provider badge. Bottom-left sidebar account section with Get Help, Stats, API Keys, and Log out — mirrors the UX pattern of professional AI tools.

### 📚 History & Management
- **Conversation-style UI** — Generations stack as chat bubbles in the main area, exactly like Claude or ChatGPT. Click any sidebar item to load its content. Generate again to add a new bubble below.
- **Collapsible sidebar** — 260px default, collapses to a 52px icon rail with smooth cubic-bezier animation. TextForge brand visible in both states.
- **Search + Filter** — Real-time debounced search across topic and output fields. Filter by tone, language, or starred status.
- **Favourites** — Star any generation. Separate Starred tab in sidebar. Compound MongoDB index for fast favourites queries.
- **3-dot context menus** — Hover any sidebar item to reveal Star, Rename, Delete options.
- **Absolute timestamps** — `dd/mm/yyyy HH:MM` format on every message bubble. Clean word count badges.

### 📤 Export & Sharing
- **Export to PDF** — Branded PDF with jsPDF. Orange header line, proper typography.
- **Export to DOCX** — Word document via the `docx` library.
- **Export to Markdown** — Clean `.md` file with metadata frontmatter.
- **Export to Plain Text** — Raw `.txt` download.
- **Shareable links** — `POST /api/history/:id/share` marks a generation as public. `/s/[id]` renders a beautiful SSR public page with dynamic OG metadata for social sharing.

### 📊 Analytics
- **Stats dashboard** — Built with Recharts. LineChart (30-day activity), PieChart (tone breakdown), BarChart (language breakdown), 4 metric cards (total generations, total words, favourites, streak).
- **MongoDB aggregation pipelines** — 4 parallel `$group` aggregations with `$dateToString` for time-series data. All computed server-side.

### 🔌 Public API
- **API key management** — Generate `tf_live_` prefixed keys. Copy (one-time reveal), revoke, track usage and `lastUsed`. Full CRUD via `/api/keys`.
- **`apiKeyAuth` middleware** — Validates keys on every request. Increments usage counter atomically.

### 🎨 Interface & UX
- **Spiced Chai design system** — A warm, distinctive palette: `#D47E30` brand orange, `#1A1208` deep dark, `#FDFBD4` cream. 6 surface tokens, 4 text tokens, 3 border tokens — all CSS variables supporting dark and light modes.
- **Dark / Light mode** — Anti-flash inline script in `layout.tsx` applies theme before React hydration. Smooth CSS variable transitions. Persisted to `localStorage`.
- **Claude-inspired typography** — Plus Jakarta Sans (UI), Lora serif (generated output), JetBrains Mono (labels, timestamps, mono elements).
- **Animated tagline** — "FORGE YOUR TEXT WITH AI" types character-by-character in the hero section, resets every 8 seconds. Navbar version uses staggered CSS transitions.
- **Topic title in topbar** — The current generation's topic is shown centered in the topbar alongside the `gemini-2.5-flash` model badge — exactly like Claude's conversation title.
- **⌘+Enter shortcut** — Generate from the input bar without clicking the button.

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                               │
│                      Next.js 14 — App Router                             │
│                                                                          │
│  /              /workspace          /history    /stats    /login         │
│  Landing page   Main generator      Full CRUD   Charts    OAuth          │
│                 + sidebar           page        dashboard page            │
│                 + chat bubbles                                            │
│                 + bottom nav                                             │
│                                                                          │
│  Zustand store · NextAuth SessionProvider · Tailwind CSS · Recharts     │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ HTTP / SSE (Fetch API)
                                │ x-user-id header on every request
                                │
┌───────────────────────────────▼──────────────────────────────────────────┐
│                        APPLICATION LAYER                                 │
│                     Express 4 + TypeScript                               │
│                                                                          │
│  Morgan → Helmet → CORS → apiLimiter → Routes                           │
│                                                                          │
│  POST /api/generate          ←  Zod validate → buildPrompt()            │
│  POST /api/generate/refine   ←  buildRefinementPrompt()                 │
│  GET|PATCH|DELETE /api/history                                           │
│  GET /api/share/:id          ←  public, no auth                         │
│  GET|POST|DELETE /api/keys   ←  apiKeyAuth middleware                   │
│  GET /api/stats              ←  4 aggregation pipelines                 │
│  GET /health                 ←  uptime monitoring ready                 │
│                                                                          │
│  generateLimiter (5/min) · apiLimiter (50/15min) · errorHandler        │
└──────────┬───────────────────────────────────────┬───────────────────────┘
           │  @google/generative-ai SDK             │  Mongoose ODM
           │  generateContentStream()               │  userId-scoped queries
┌──────────▼──────────────────┐    ┌───────────────▼───────────────────────┐
│   Google Gemini 2.5 Flash   │    │          MongoDB Atlas M0             │
│                             │    │                                       │
│  SSE token streaming        │    │  collections:                        │
│  1,500 req/day free         │    │    generations  (indexed × 3)        │
│  1M tokens/min free         │    │    apikeys      (tf_live_ prefix)    │
│  No credit card             │    │                                       │
│                             │    │  512MB free · cloud-hosted           │
└─────────────────────────────┘    └───────────────────────────────────────┘
```

### Complete Data Flow — One Generation Request

```
① User types topic → selects tone / length / language → clicks Generate
② PromptBuilder reads Zustand store → calls api.postGenerate()
③ fetch POST /api/generate  {topic, tone, length, language, keywords}
   + header: x-user-id: "google-oauth-uid-123"
④ Express: Morgan logs → Helmet checks → CORS verifies → generateLimiter checks
⑤ Zod validates every field — rejects malformed input before touching AI
⑥ geminiService.buildPrompt() constructs structured multi-instruction prompt
⑦ geminiService.generateTextStream() sets SSE headers on response object
⑧ Gemini SDK streams tokens → backend writes "data: {text, done}\n\n"
⑨ Frontend ReadableStream reader receives each chunk, decodes, splits on \n\n
⑩ onChunk(text) → appendOutput(text) → Zustand store update
⑪ React re-renders OutputPanel with new text (live typing effect)
⑫ Stream ends → onDone() fires → isStreaming=false, isDone=true
⑬ Backend saves complete generation to MongoDB with userId
⑭ savedId returned via final SSE event → frontend stores for share/star/export
⑮ Sidebar auto-refreshes generation list via direct api.getHistory() call
   (never changes activeGenId — new bubble stacks in current chat session)
```

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.2 | React framework — App Router, SSR, file-based routing |
| **React** | 18.3 | Component model, concurrent features |
| **TypeScript** | 5.4 | End-to-end type safety |
| **Tailwind CSS** | 3.4 | Utility-first CSS, JIT compiler |
| **NextAuth.js** | 4.24 | Google + GitHub OAuth, JWT sessions |
| **Zustand** | 4.5 | Lightweight global state — no boilerplate |
| **Recharts** | 2.x | Stats dashboard — Line, Pie, Bar charts |
| **Lucide React** | 0.383 | Tree-shakeable SVG icon system |
| **React Hot Toast** | 2.4 | Accessible toast notifications |
| **date-fns** | 3.6 | Immutable, tree-shakeable date utilities |
| **jsPDF** | 2.x | Client-side PDF generation |
| **docx** | 8.x | Word document generation |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Async I/O runtime, event loop |
| **Express** | 4.19 | HTTP server, middleware pipeline |
| **TypeScript** | 5.4 | Type safety on the server |
| **@google/generative-ai** | 0.15 | Gemini SDK with streaming support |
| **Mongoose** | 8.4 | MongoDB ODM — schemas, hooks, indexes |
| **Zod** | 3.23 | Runtime schema validation + TS inference |
| **Helmet** | 7.1 | 11 security-focused HTTP headers |
| **express-rate-limit** | 7.3 | Sliding window IP-based rate limiting |
| **Morgan** | 1.10 | HTTP request logging middleware |
| **UUID** | 10.0 | API key generation |

### AI / ML / Infrastructure

| Technology | Purpose |
|---|---|
| **Google Gemini 2.5 Flash** | Production text generation — free, fast, capable |
| **PyTorch 2.0** | LSTM model training and inference (notebook) |
| **NumPy** | Tensor operations and data manipulation |
| **Matplotlib** | Training loss curve visualization |
| **MongoDB Atlas M0** | Cloud database — free forever tier |
| **Vercel** | Frontend deployment (planned) |
| **Railway** | Backend deployment (planned) |

---

## 📁 Project Structure

```
textforge-ai/                              ← Monorepo root
│
├── 📄 README.md                           ← You are here
├── 📄 .gitignore                          ← node_modules, .env, dist excluded
├── 📄 LICENSE                             ← MIT License
│
├── 📁 backend/                            ← Node.js + Express REST API
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example                       ← Environment variable template
│   └── src/
│       ├── index.ts                       ← Server bootstrap + middleware pipeline
│       ├── config/
│       │   ├── index.ts                   ← Env validation — fails fast on missing vars
│       │   └── database.ts                ← MongoDB connection + retry logic
│       ├── models/
│       │   ├── Generation.ts              ← Mongoose schema + 3 indexes + pre-save hook
│       │   └── ApiKey.ts                  ← tf_live_ prefixed key schema
│       ├── services/
│       │   ├── geminiService.ts           ← Prompt engineering + SSE streaming
│       │   └── historyService.ts          ← All DB CRUD + aggregation pipelines
│       ├── routes/
│       │   ├── generate.ts                ← POST /api/generate + /refine
│       │   ├── history.ts                 ← GET|PATCH|DELETE /api/history
│       │   ├── share.ts                   ← GET /api/share/:id (public)
│       │   ├── stats.ts                   ← GET /api/stats (aggregations)
│       │   └── apiKeys.ts                 ← GET|POST|DELETE /api/keys
│       └── middleware/
│           ├── rateLimiter.ts             ← Dual-layer sliding window limits
│           ├── errorHandler.ts            ← Global error boundary
│           └── apiKeyAuth.ts              ← API key validation middleware
│
├── 📁 frontend/                           ← Next.js 14 Web Application
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js                     ← Image domains, env vars
│   ├── tailwind.config.js                 ← Custom fonts + design tokens
│   ├── auth.ts                            ← NextAuth v4 config (Google + GitHub)
│   ├── .env.local.example
│   ├── app/
│   │   ├── globals.css                    ← Spiced Chai design system + animations
│   │   ├── layout.tsx                     ← Root layout + AuthProvider + theme init
│   │   ├── page.tsx                       ← Landing page + animated hero + tech footer
│   │   ├── not-found.tsx                  ← Custom 404
│   │   ├── login/page.tsx                 ← OAuth login page
│   │   ├── workspace/page.tsx             ← Main app (sidebar + chat + input bar)
│   │   ├── history/page.tsx               ← Full history with search + filter
│   │   ├── stats/page.tsx                 ← Analytics dashboard
│   │   ├── api-keys/page.tsx              ← API key management
│   │   ├── s/[id]/page.tsx                ← Public share page (SSR + OG metadata)
│   │   └── api/auth/[...nextauth]/        ← NextAuth route handler
│   ├── components/
│   │   ├── Navbar.tsx                     ← Fixed nav + animated tagline + theme toggle
│   │   ├── PromptBuilder.tsx              ← Full controls + compact bottom-bar mode
│   │   ├── OutputPanel.tsx                ← SSE streaming + topbar portal actions
│   │   ├── HistoryCard.tsx                ← Full history page card
│   │   ├── AuthProvider.tsx               ← SessionProvider wrapper (client)
│   │   └── UserMenu.tsx                   ← Avatar dropdown (navbar)
│   └── lib/
│       ├── api.ts                         ← All backend calls + SSE stream reader
│       ├── store.ts                       ← Zustand global state
│       ├── theme.ts                       ← Dark/light mode persistence
│       ├── exporters.ts                   ← PDF, DOCX, Markdown generators
│       ├── templates.ts                   ← 8 prompt templates
│       ├── languages.ts                   ← 8 supported AI output languages
│       ├── features.ts                    ← Feature flags (auth, public API)
│       └── utils.ts                       ← cn() Tailwind class merger
│
├── 📁 notebook/                           ← Academic ML Deliverable
│   ├── lstm_text_generation.ipynb         ← 11-step PyTorch LSTM from scratch
│   └── requirements.txt
│
└── 📁 docs/
    ├── API.md                             ← Full endpoint reference
    ├── SETUP.md                           ← Development environment guide
    ├── ARCHITECTURE.md                    ← Design decisions + trade-offs
    └── GITHUB_DEPLOY.md                   ← Push + deploy guide
```

---

## 🧠 The AI Layer — Prompt Engineering

The quality of AI-generated text depends almost entirely on the quality of the prompt. TextForge AI implements a structured prompt engineering pipeline in `geminiService.ts`.

### `buildPrompt()` — The Core Function

```typescript
export function buildPrompt(options: GenerateOptions): string {
  const { topic, tone, length, language, keywords } = options;
  const lengthConfig = LENGTH_MAP[length];   // { words: 350, description: "detailed (around 350 words)" }
  const toneGuide    = TONE_MAP[tone];       // Full style instruction
  const langName     = LANGUAGE_MAP[language]; // "Hindi (Devanagari script)"

  return `You are TextForge AI, an expert writer...
TOPIC: ${topic}
WRITING GUIDELINES:
- Tone: ${toneGuide}
- Length: Be ${lengthConfig.description}
- Language: Write the entire response in ${langName}
${keywords.length ? `- SEO Keywords: Weave naturally: ${keywords.join(", ")}` : ""}
- Structure: Strong opening → supporting development → meaningful conclusion
- Output only the generated text. No title, heading, or preamble.`;
}
```

### Tone Instruction Map

| Tone | Instruction |
|---|---|
| `formal` | Professional, authoritative. No contractions. No colloquialisms. |
| `casual` | Conversational, friendly. Contractions welcome. |
| `creative` | Vivid, imaginative. Metaphors, varied structure, expressive vocabulary. |
| `academic` | Scholarly, precise terminology. Objective, evidence-based. |

---

## ⚡ Real-time Streaming — SSE Deep Dive

### Why SSE Instead of WebSockets?

Server-Sent Events are unidirectional (server → client) — exactly our use case. WebSockets are bidirectional and add connection management complexity. SSE works over standard HTTP/1.1, auto-reconnects on disconnect, and is natively supported in every modern browser.

### Backend — Token Streaming

```typescript
// SSE headers set BEFORE calling Gemini
// If Gemini throws, we write an error SSE event — never throw after headers sent
res.setHeader("Content-Type",      "text/event-stream");
res.setHeader("Cache-Control",     "no-cache");
res.setHeader("Connection",        "keep-alive");
res.setHeader("X-Accel-Buffering", "no");  // disable nginx buffering

const stream = await model.generateContentStream(prompt);

for await (const chunk of stream) {
  const text = chunk.text();
  if (text) res.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
}
res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
```

### Frontend — ReadableStream Reader

```typescript
const response = await fetch(url, { method: "POST", body: JSON.stringify(options) });
const reader   = response.body!.getReader();
const decoder  = new TextDecoder();
let   buffer   = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n\n");
  buffer = lines.pop() || "";  // retain incomplete message
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const payload = JSON.parse(line.slice(6));
    if (payload.done)  { onDone();               return; }
    if (payload.text)  { onChunk(payload.text);          }
  }
}
```

The buffer pattern handles the critical edge case where a TCP packet boundary splits an SSE message across two `read()` calls.

---

## 📓 The LSTM Notebook — Academic Deliverable

The Jupyter notebook (`notebook/lstm_text_generation.ipynb`) is an 11-step, fully-annotated demonstration of text generation from first principles.

### Model Architecture

```
Input Characters
      ↓
Embedding Layer    [vocab_size → embed_dim=128]
      ↓
LSTM Layer 1       [embed_dim → hidden_dim=256, dropout=0.3]
      ↓
LSTM Layer 2       [hidden_dim → hidden_dim=256, dropout=0.3]
      ↓
Dropout Layer      [p=0.3]
      ↓
Linear Layer       [hidden_dim → vocab_size]
      ↓
Temperature Sampling → Next Character
```

**Total trainable parameters: ~500,000**

### Training Configuration

| Hyperparameter | Value | Rationale |
|---|---|---|
| Sequence length | 80 chars | Captures medium-range dependencies |
| Batch size | 32 | Balance between gradient quality and speed |
| Epochs | 30 | Sufficient convergence on demonstration corpus |
| Learning rate | 0.002 | Adam default; scheduler halves every 10 epochs |
| Gradient clip | 5.0 | Prevents exploding gradients — critical for RNNs |
| Dropout | 0.3 | Regularisation against overfitting |
| Optimizer | Adam | Adaptive per-parameter learning rates |
| Loss | CrossEntropyLoss | Standard for character-level multi-class |

### LSTM vs Gemini — Honest Comparison

| Dimension | LSTM (Notebook) | Gemini 2.5 Flash (App) |
|---|---|---|
| Architecture | Recurrent (sequential) | Transformer (parallel attention) |
| Parameters | ~500K | Billions |
| Training data | 30 curated sentences | Trillions of tokens |
| Output quality | Basic pattern learning | Human-level coherence |
| Training time | Minutes on CPU | Months on TPU clusters |
| Cost | Free (local) | Free API tier |
| Purpose | Learning fundamentals | Production application |

---

## 🗄 Database Schema

```typescript
// Generation Document
interface IGeneration {
  _id:         ObjectId;     // MongoDB auto-generated unique ID
  topic:       string;       // 3–500 characters, trimmed
  tone:        "formal" | "casual" | "creative" | "academic";
  length:      "short" | "medium" | "long";
  language:    string;       // "en" | "hi" | "es" | "fr" | "ja" | "ar" | "de" | "zh"
  keywords:    string[];     // Up to 10 SEO terms
  prompt:      string;       // Full engineered prompt (stored for transparency)
  output:      string;       // Complete AI-generated text
  wordCount:   number;       // Auto-calculated in pre-save hook
  model:       string;       // "gemini-2.5-flash"
  userId:      string;       // OAuth user ID — scopes all queries per user
  isFavourite: boolean;      // Bookmarking — indexed for fast starred queries
  isShared:    boolean;      // Public share toggle
  templateId:  string;       // Which template was used (if any)
  refinementOf:string;       // Parent generation ID (for refine chain)
  createdAt:   Date;         // Mongoose automatic timestamp
  updatedAt:   Date;
}

// Indexes
GenerationSchema.index({ createdAt: -1 });                    // Fast history
GenerationSchema.index({ isFavourite: 1, createdAt: -1 });    // Fast starred
GenerationSchema.index({ userId: 1, createdAt: -1 });         // Per-user scoping
```

---

## 📡 API Reference

**Base URL:** `http://localhost:5000`

### Core Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/generate` | Optional | Stream text generation via SSE |
| `POST` | `/api/generate/refine` | Optional | Refine existing output |
| `GET` | `/api/generate/preview` | — | Preview prompt (no AI call) |
| `GET` | `/api/history` | Optional | Paginated generations list |
| `GET` | `/api/history/:id` | Optional | Single generation |
| `DELETE` | `/api/history/:id` | Optional | Delete generation |
| `DELETE` | `/api/history` | Optional | Clear all history |
| `PATCH` | `/api/history/:id/favourite` | Optional | Toggle star |
| `PATCH` | `/api/history/:id/share` | Optional | Toggle public share |
| `GET` | `/api/share/:id` | Public | Read shared generation |
| `GET` | `/api/stats` | Optional | Analytics aggregations |
| `GET` | `/api/keys` | Required | List API keys |
| `POST` | `/api/keys` | Required | Create API key |
| `DELETE` | `/api/keys/:id` | Required | Revoke API key |
| `GET` | `/health` | — | Health check |

**Auth:** Pass `x-user-id` header (injected automatically by frontend via Zustand + axios interceptor) or `x-api-key` header for public API access.

Full documentation: [docs/API.md](docs/API.md)

---

## 🔐 Security Architecture

| Layer | Technology | Protection |
|---|---|---|
| **Transport** | Helmet.js | X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, hides X-Powered-By |
| **Origin** | CORS | Whitelists only `CLIENT_URL` env var — all other origins rejected at preflight |
| **Rate limiting** | express-rate-limit | 50 req/15min global · 5 req/min on `/generate` specifically |
| **Input validation** | Zod | Every request body field validated at runtime before touching AI or DB |
| **Secret management** | .env + .gitignore | API keys, OAuth secrets, DB credentials never in source control |
| **Error handling** | Custom middleware | Stack traces in dev, clean messages in production — internals never exposed |
| **Body size** | Express built-in | `{ limit: "10kb" }` — mitigates memory exhaustion DoS attacks |
| **API keys** | Custom middleware | `tf_live_` prefix, usage counting, revocation, `lastUsed` tracking |

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Check |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | Any | `git --version` |
| Google Account | — | For Gemini API key + OAuth |
| MongoDB Atlas | Free | [mongodb.com/atlas](https://mongodb.com/atlas) |
| GitHub Account | — | For GitHub OAuth |

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/textforge-ai.git
cd textforge-ai
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — fill in GEMINI_API_KEY and MONGODB_URI
npm run dev
# ✅ http://localhost:5000/health
```

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.local.example .env.local
# Edit .env.local — fill in OAuth credentials and NEXTAUTH_SECRET
npm run dev
# ✅ http://localhost:3000
```

### 4. Notebook (Optional)

```bash
cd ../notebook
pip install -r requirements.txt
jupyter notebook lstm_text_generation.ipynb
# Or upload to Google Colab for free GPU
```

---

## 🔧 Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=             # aistudio.google.com — free, no card
MONGODB_URI=                # mongodb+srv://user:pass@cluster.host/textforge?...
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_SECRET=            # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=           # console.cloud.google.com
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=           # github.com/settings/developers
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_PUBLIC_API_ENABLED=true
```

---

## 🗺 Roadmap

### Version 1.1 — Shipped ✅
- [x] Templates system (8 professional templates)
- [x] Multi-language AI output (8 languages)
- [x] SEO keyword weaving
- [x] Stats dashboard with Recharts
- [x] Favourites / Bookmarks
- [x] Shareable public links with OG metadata
- [x] Export to PDF, DOCX, Markdown, TXT
- [x] Refine & regenerate (Shorter, Longer, More formal, Simpler)
- [x] Public API with `tf_live_` prefixed key management
- [x] User authentication (Google + GitHub OAuth via NextAuth v4)
- [x] Per-user data isolation with `x-user-id` header scoping
- [x] Claude-style workspace UI (sidebar, chat bubbles, bottom input bar)
- [x] Dark / Light mode with anti-flash init
- [x] History search + filter (tone, language, starred)
- [x] Collapsible sidebar with user account section

### Version 1.2 — In Progress 🔄
- [ ] Live deployment (Vercel + Railway)
- [ ] Version history per topic (refinement chain UI)
- [ ] Bulk generation mode

### Version 1.3 — Planned 📋
- [ ] **UI Internationalisation (i18n)** — Full interface translation into 8 languages via `next-intl`. Note: AI content generation in multiple languages already works via Gemini prompt injection. This covers the app interface strings.
- [ ] User profile page with generation statistics
- [ ] Collaborative sharing with edit permissions
- [ ] Browser extension for one-click generation

---

## 🤝 Contributing

```bash
# 1. Fork on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/textforge-ai.git

# 3. Create a feature branch
git checkout -b feat/your-feature

# 4. Commit with conventional commits
git commit -m "feat: add export to PDF functionality"
# Types: feat · fix · docs · style · refactor · perf · test · chore

# 5. Push and open a Pull Request
git push origin feat/your-feature
```

---

## 📄 License

Distributed under the **MIT License** — free to use, modify, and distribute.
See [LICENSE](LICENSE) for the full text.

---

<div align="center">

<br/>

<img width="40" src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/flame.svg"/>

<br/>

**TextForge AI**

*Built by a developer who refused to submit just a notebook.*

<br/>

*"Forge Your Text With AI"*

<br/>

[![Star on GitHub](https://img.shields.io/github/stars/YOUR_USERNAME/textforge-ai?style=social)](https://github.com/YOUR_USERNAME/textforge-ai)

<br/>
<br/>

</div>
