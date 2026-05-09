<div align="center">

<br/>

<img width="80" src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/flame.svg" alt="TextForge AI Logo"/>

<br/>
<br/>

# TextForge AI

### *Forge Your Text With AI*

<p align="center">
  <strong>A production-grade, full-stack Generative Text Model</strong><br/>
  Built with Next.js 14 · Express · MongoDB Atlas · Google Gemini 2.5 Flash · PyTorch LSTM
</p>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-D47E30?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](docs/GITHUB_DEPLOY.md)

<br/>

> *"The best way to understand language models is to build one — then build the infrastructure around it."*

<br/>

[**Live Demo**](#) &nbsp;·&nbsp; [**API Reference**](docs/API.md) &nbsp;·&nbsp; [**Setup Guide**](docs/SETUP.md) &nbsp;·&nbsp; [**Architecture**](docs/ARCHITECTURE.md) &nbsp;·&nbsp; [**LSTM Notebook**](notebook/)

<br/>

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Why This Project Exists](#-why-this-project-exists)
- [Live Demo](#-live-demo)
- [Feature Set](#-feature-set)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [The AI Layer — Prompt Engineering](#-the-ai-layer--prompt-engineering)
- [Real-time Streaming — SSE Deep Dive](#-real-time-streaming--sse-deep-dive)
- [The LSTM Model — Academic Deliverable](#-the-lstm-model--academic-deliverable)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Security Architecture](#-security-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Design System](#-design-system)
- [Performance](#-performance)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔥 Overview

**TextForge AI** is a full-stack, production-grade web application that demonstrates end-to-end implementation of a generative text system — from neural network fundamentals to a real-time streaming user interface backed by a cloud database.

The application accepts a user-defined **topic**, **writing tone**, **output length**, **language**, and optional **SEO keywords** as structured inputs. It constructs an expertly engineered prompt, transmits it to Google's **Gemini 2.5 Flash** large language model, and streams the AI-generated response token-by-token back to the user interface in real time — creating the live "typing" effect characteristic of modern AI products.

Every generation is persisted to **MongoDB Atlas** and surfaced through a collapsible history sidebar, enabling users to revisit, copy, export, and manage their entire generation history. The application ships with a full **Jupyter notebook** demonstrating a character-level **LSTM** trained from scratch in PyTorch — bridging the gap between academic ML theory and production AI engineering.

This project was architected and developed as both a **college project deliverable** and a **professional portfolio piece**, intentionally exceeding the minimum requirements of the assignment to demonstrate industry-level engineering practices.

---

## 💡 Why This Project Exists

The original assignment brief was:

> *"Create a text generation model using GPT or LSTM to generate coherent paragraphs on specific topics. Deliverable: A notebook demonstrating generated text based on user prompts."*

A notebook alone would have been sufficient to pass. TextForge AI goes dramatically further:

| Requirement | Minimum Submission | TextForge AI |
|---|---|---|
| Text generation model | ✅ | ✅ LSTM notebook + Gemini API |
| Coherent paragraph output | ✅ | ✅ Prompt-engineered, structured output |
| Topic-based generation | ✅ | ✅ + Tone, Length, Language, SEO Keywords |
| Notebook deliverable | ✅ | ✅ 11-step PyTorch notebook |
| User interface | ❌ | ✅ Full Next.js 14 web application |
| Real-time streaming | ❌ | ✅ SSE token-by-token streaming |
| Persistent storage | ❌ | ✅ MongoDB Atlas cloud database |
| REST API backend | ❌ | ✅ Express + TypeScript API |
| Templates system | ❌ | ✅ Blog Post, Email, Essay templates |
| Multi-language output | ❌ | ✅ 10+ languages supported |
| SEO keyword weaving | ❌ | ✅ Natural keyword integration |
| History & management | ❌ | ✅ Full CRUD with sidebar |
| Professional documentation | ❌ | ✅ API docs, Architecture, Setup guides |
| Security hardening | ❌ | ✅ Helmet, CORS, Rate limiting, Zod |
| Dark / Light mode | ❌ | ✅ Persisted theme with no flash |

---

## 🚀 Live Demo

> *Deployment in progress — frontend on Vercel, backend on Railway.*

```
Frontend : https://textforge-ai.vercel.app
Backend  : https://textforge-ai-api.railway.app
Health   : https://textforge-ai-api.railway.app/health
```

---

## ✨ Feature Set

### Core Generation Engine
- **Real-time SSE Streaming** — Text appears token-by-token using Server-Sent Events over a persistent HTTP connection. Zero perceptible latency between generation start and first visible character.
- **Prompt Engineering** — Every user input is transformed by a structured prompt engineering layer in `geminiService.ts` before reaching the model. Tone, length, language, and SEO keywords are all woven into a single high-quality prompt.
- **Template System** — Pre-built prompt templates for Blog Post, Professional Email, and Essay — each pre-configures tone, length, and provides topic guidance.
- **Multi-language Output** — Generate in English, Hindi, Spanish, French, German, Japanese, Arabic, Portuguese, Italian, and Chinese. Language instruction is injected directly into the model prompt.
- **SEO Keyword Weaving** — Optional keyword input (up to 10 terms). Keywords are instructed to appear naturally within the generated text — not forced or repetitive.
- **Four Tones** — Formal (professional/authoritative), Casual (friendly/conversational), Creative (vivid/metaphorical), Academic (scholarly/evidence-based).
- **Three Length Tiers** — Short (~150 words), Medium (~350 words), Long (~700 words).

### History & Management
- **Collapsible Sidebar** — 280px history panel with TextForge branding, collapses to a 52px icon rail with smooth cubic-bezier animation. Mirrors the design pattern of professional SaaS tools.
- **Auto-refresh** — Sidebar regenerates its list after every completed generation without requiring a page reload.
- **Per-entry Controls** — Copy to clipboard, delete, expand/collapse preview — all accessible from hover-revealed action buttons.
- **Tone Color Coding** — Each tone has a distinct color in the history sidebar (blue/formal, green/casual, purple/creative, amber/academic) for instant visual identification.
- **Relative Timestamps** — Human-readable time display ("3 minutes ago", "2 days ago") using `date-fns`.

### Interface & UX
- **Dark / Light Mode** — Full theme system built on CSS custom properties. Theme preference persisted to `localStorage`. Anti-flash inline script in `layout.tsx` applies theme before React hydration — eliminating the white flash on page load.
- **Animated Tagline** — "FORGE YOUR TEXT WITH AI" types out character-by-character using staggered React state transitions, resets every 8 seconds, with a blinking block cursor.
- **Spiced Chai Design System** — A warm, distinctive color palette (`#D47E30` brand orange, `#1A1208` deep dark, `#FDFBD4` cream) across 6 surface tokens, 4 text tokens, and 3 border tokens — all as CSS variables supporting both dark and light modes.
- **Claude-inspired Typography** — Plus Jakarta Sans (UI), Lora serif (generated output), JetBrains Mono (labels/code) — matching the typographic hierarchy of Anthropic's Claude interface.
- **Stats Dashboard** — Generation analytics: total generations, total words forged, most used tone, usage over time.
- **Toast Notifications** — Success/error feedback via `react-hot-toast`, styled with the Spiced Chai palette.

### Backend & Infrastructure
- **TypeScript End-to-End** — Every file in both frontend and backend is strictly typed TypeScript. No `any` types in business logic.
- **Zod Validation** — Runtime schema validation on all API inputs. Invalid requests are rejected before reaching the AI or database layer.
- **Dual Rate Limiting** — General limit (50 req/15min) on all routes + strict limit (5 req/min) on the generate endpoint specifically.
- **Helmet Security** — Configures 11 security-focused HTTP response headers.
- **Structured Error Handling** — Global error handler with environment-aware responses: stack traces in development, clean messages in production.
- **Health Check Endpoint** — `GET /health` returns service status, version, and timestamp — ready for uptime monitoring.
- **Morgan Request Logging** — HTTP request logs in `dev` format during development, Apache `combined` format in production.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│                   Next.js 14 (App Router)                           │
│                                                                     │
│  ┌──────────────┐  ┌─────────────────┐  ┌────────────────────────┐ │
│  │  Landing /   │  │  /generate      │  │  /history              │ │
│  │  Home Page   │  │  PromptBuilder  │  │  HistoryCard grid      │ │
│  │              │  │  OutputPanel    │  │  Paginated results     │ │
│  └──────────────┘  │  Sidebar        │  └────────────────────────┘ │
│                    └─────────────────┘                              │
│  Zustand Store · React Query · Tailwind CSS · SSE ReadableStream    │
└────────────────────────────┬────────────────────────────────────────┘
                             │  HTTP / SSE  (fetch API)
                             │  POST /api/generate → text/event-stream
                             │  GET|DELETE /api/history
┌────────────────────────────▼────────────────────────────────────────┐
│                       APPLICATION LAYER                             │
│                    Express 4 + TypeScript                           │
│                                                                     │
│  Morgan  →  Helmet  →  CORS  →  Rate Limiter  →  Routes            │
│                                                                     │
│  ┌─────────────────────────┐   ┌──────────────────────────────┐    │
│  │  POST /api/generate     │   │  GET    /api/history         │    │
│  │  Zod validate           │   │  GET    /api/history/:id     │    │
│  │  buildPrompt()          │   │  DELETE /api/history/:id     │    │
│  │  generateTextStream()   │   │  DELETE /api/history         │    │
│  │  saveGeneration()       │   │  PATCH  /api/history/:id/fav │    │
│  └──────────┬──────────────┘   └──────────────────────────────┘    │
└─────────────┼────────────────────────────────┬─────────────────────┘
              │  @google/generative-ai SDK      │  Mongoose ODM
┌─────────────▼──────────────┐   ┌─────────────▼───────────────────┐
│   Google Gemini 2.5 Flash  │   │       MongoDB Atlas M0          │
│                            │   │                                 │
│   generateContentStream()  │   │   db: textforge                 │
│   SSE token streaming      │   │   col: generations              │
│   1,500 req/day free       │   │   512MB free storage            │
│   1M tokens/min free       │   │   Indexed: createdAt, fav       │
└────────────────────────────┘   └─────────────────────────────────┘
```

### Data Flow — A Single Generation Request

```
1.  User clicks "Generate Text"
2.  PromptBuilder reads Zustand store (topic, tone, length, language, keywords)
3.  api.postGenerate() sends POST to /api/generate with JSON body
4.  Express: Morgan logs → Helmet checks → CORS verifies → generateLimiter checks
5.  Zod validates request body fields and types
6.  geminiService.buildPrompt() constructs structured multi-instruction prompt
7.  geminiService.generateTextStream() sets SSE headers on response
8.  Gemini SDK streams tokens → backend writes "data: {text, done}\n\n" to response
9.  Frontend ReadableStream reader receives each chunk
10. onChunk() calls appendOutput() in Zustand store
11. OutputPanel re-renders with new text (React reactive update)
12. Stream ends → onDone() fires → isStreaming=false, isDone=true
13. Backend saves complete generation to MongoDB via historyService.saveGeneration()
14. Sidebar auto-fetches updated history list
```

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.2 | React framework with App Router, SSR, file-based routing |
| **React** | 18.3 | Component model, concurrent features, Suspense |
| **TypeScript** | 5.4 | Static typing, interfaces, compile-time error catching |
| **Tailwind CSS** | 3.4 | Utility-first CSS, responsive design, JIT compiler |
| **Zustand** | 4.5 | Lightweight global state — no boilerplate, no context hell |
| **Lucide React** | 0.383 | Consistent, tree-shakeable SVG icon system |
| **React Hot Toast** | 2.4 | Accessible toast notifications |
| **date-fns** | 3.6 | Immutable, tree-shakeable date utilities |
| **clsx + twMerge** | latest | Conditional class composition without conflicts |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Async I/O runtime, event loop, V8 engine |
| **Express** | 4.19 | HTTP server, middleware pipeline, routing |
| **TypeScript** | 5.4 | Full type safety on the server |
| **@google/generative-ai** | 0.15 | Official Gemini SDK with streaming support |
| **Mongoose** | 8.4 | MongoDB ODM — schemas, validation, middleware hooks |
| **Zod** | 3.23 | Runtime schema validation + TypeScript type inference |
| **Helmet** | 7.1 | HTTP security headers (CSP, HSTS, X-Frame-Options, etc.) |
| **express-rate-limit** | 7.3 | Per-IP sliding window rate limiting |
| **CORS** | 2.8 | Cross-Origin Resource Sharing configuration |
| **Morgan** | 1.10 | HTTP request/response logging middleware |
| **ts-node-dev** | 2.0 | TypeScript hot-reload development server |

### AI / ML

| Technology | Purpose |
|---|---|
| **Google Gemini 2.5 Flash** | Production text generation — 1,500 req/day free, 1M tokens/min |
| **PyTorch 2.0** | LSTM neural network training and inference |
| **NumPy** | Tensor operations and data manipulation |
| **Matplotlib** | Training loss curve visualization |
| **Jupyter Notebook** | Interactive ML demonstration environment |

### Infrastructure & Services

| Service | Purpose | Cost |
|---|---|---|
| **MongoDB Atlas M0** | Cloud-hosted document database | Free forever |
| **Google AI Studio** | Gemini API key management | Free tier |
| **GitHub** | Version control, collaboration, portfolio display | Free |
| **Vercel** | Frontend deployment (planned) | Free tier |
| **Railway** | Backend deployment (planned) | Free tier |

---

## 📁 Project Structure

```
textforge-ai/
│
├── 📄 README.md                        ← You are here
├── 📄 .gitignore                       ← Excludes .env, node_modules, dist
├── 📄 LICENSE                          ← MIT License
│
├── 📁 backend/                         ← Node.js + Express REST API
│   ├── 📄 package.json                 ← Dependencies + npm scripts
│   ├── 📄 tsconfig.json                ← TypeScript compiler config
│   ├── 📄 .env.example                 ← Environment variable template
│   └── 📁 src/
│       ├── 📄 index.ts                 ← Server bootstrap + middleware pipeline
│       ├── 📁 config/
│       │   ├── 📄 index.ts             ← Env validation + config object
│       │   └── 📄 database.ts          ← MongoDB connection + error handling
│       ├── 📁 models/
│       │   └── 📄 Generation.ts        ← Mongoose schema + IGeneration interface
│       ├── 📁 services/
│       │   ├── 📄 geminiService.ts     ← Prompt engineering + SSE streaming
│       │   └── 📄 historyService.ts    ← All database CRUD operations
│       ├── 📁 routes/
│       │   ├── 📄 generate.ts          ← POST /api/generate (Zod validated)
│       │   └── 📄 history.ts           ← GET|PATCH|DELETE /api/history
│       └── 📁 middleware/
│           ├── 📄 rateLimiter.ts       ← Dual-layer IP-based rate limiting
│           └── 📄 errorHandler.ts      ← Global error boundary + AppError type
│
├── 📁 frontend/                        ← Next.js 14 Web Application
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js           ← Custom fonts + design tokens
│   ├── 📄 postcss.config.js
│   ├── 📄 .env.local.example
│   ├── 📁 app/                         ← Next.js App Router
│   │   ├── 📄 globals.css              ← Design system + CSS variables + animations
│   │   ├── 📄 layout.tsx               ← Root layout + theme init + Navbar
│   │   ├── 📄 page.tsx                 ← Landing page (/)
│   │   ├── 📄 not-found.tsx            ← 404 page
│   │   ├── 📁 generate/
│   │   │   ├── 📄 page.tsx             ← Generator + collapsible sidebar
│   │   │   └── 📄 loading.tsx          ← Skeleton loading state
│   │   └── 📁 history/
│   │       └── 📄 page.tsx             ← Full history page with pagination
│   ├── 📁 components/
│   │   ├── 📄 Navbar.tsx               ← Fixed nav + animated tagline + theme toggle
│   │   ├── 📄 PromptBuilder.tsx        ← All generation controls + templates
│   │   ├── 📄 OutputPanel.tsx          ← SSE streaming display + actions
│   │   └── 📄 HistoryCard.tsx          ← Individual history entry component
│   └── 📁 lib/
│       ├── 📄 api.ts                   ← All backend calls + SSE stream reader
│       ├── 📄 store.ts                 ← Zustand state (topic, output, streaming)
│       ├── 📄 theme.ts                 ← Dark/light mode persistence utilities
│       └── 📄 utils.ts                 ← cn() Tailwind class merger
│
├── 📁 notebook/                        ← Academic ML Deliverable
│   ├── 📄 lstm_text_generation.ipynb   ← 11-step PyTorch LSTM from scratch
│   └── 📄 requirements.txt            ← torch, numpy, matplotlib, tqdm
│
└── 📁 docs/                            ← Project Documentation
    ├── 📄 API.md                       ← Full endpoint reference + examples
    ├── 📄 SETUP.md                     ← Development environment guide
    ├── 📄 ARCHITECTURE.md              ← Design decisions + trade-offs
    └── 📄 GITHUB_DEPLOY.md            ← Push to GitHub + deploy guide
```

---

## 🧠 The AI Layer — Prompt Engineering

The quality of AI-generated text is almost entirely determined by the quality of the prompt. TextForge AI implements a structured prompt engineering layer in `geminiService.ts` that transforms simple user inputs into high-fidelity model instructions.

### The `buildPrompt()` Function

Rather than passing the user's raw topic directly to Gemini, every generation goes through a prompt construction pipeline:

```typescript
export function buildPrompt(options: GenerateOptions): string {
  const { topic, tone, length, language, keywords } = options;

  const lengthConfig = LENGTH_MAP[length];  // word count + description
  const toneGuide    = TONE_MAP[tone];      // detailed style instruction

  return `You are TextForge AI, an expert writer capable of producing
high-quality, coherent text on any topic.

TOPIC: ${topic}

WRITING GUIDELINES:
- Tone: ${toneGuide}
- Length: Be ${lengthConfig.description}
- Language: Write the entire response in ${language}
- Structure: Strong opening → supporting development → meaningful conclusion
- Quality: Natural, human-expert level prose
${keywords.length > 0
  ? `- SEO Keywords: Weave these terms naturally: ${keywords.join(", ")}`
  : ""}

Output only the generated text. No title, heading, or preamble.`;
}
```

### Why This Matters

| Input | Without Engineering | With Engineering |
|---|---|---|
| Topic only | Generic, unfocused output | Structured, purposeful paragraphs |
| Tone selection | Ignored | Deep style adherence |
| Length selection | Approximate at best | Accurate word targets |
| Language | English only | Native-quality output in 10+ languages |
| SEO keywords | Never appears | Woven in naturally, not forced |

### Tone Instruction Map

```typescript
const TONE_MAP = {
  formal:   "Use professional, authoritative language. Avoid contractions.",
  casual:   "Use conversational, friendly language. Contractions welcome.",
  creative: "Use vivid, imaginative language with metaphors and varied structure.",
  academic: "Use scholarly language with precise terminology and objective tone.",
};
```

---

## ⚡ Real-time Streaming — SSE Deep Dive

### Why Streaming?

For a 350-word "medium" generation, Gemini takes 8–12 seconds end-to-end. Without streaming, users stare at a blank screen for 10 seconds. With SSE streaming, text appears within 200ms and continues for the duration — a fundamentally better user experience that mirrors tools like ChatGPT and Claude.

### Why SSE Instead of WebSockets?

Server-Sent Events are unidirectional (server → client), which is exactly our use case. WebSockets are bidirectional and introduce connection management complexity. SSE works over standard HTTP/1.1, auto-reconnects on disconnect, and is natively supported in every modern browser.

### Backend Implementation

```typescript
// geminiService.ts
export async function generateTextStream(
  options: GenerateOptions,
  res: Response
): Promise<string> {
  const prompt = buildPrompt(options);

  // SSE protocol headers
  res.setHeader("Content-Type",       "text/event-stream");
  res.setHeader("Cache-Control",      "no-cache");
  res.setHeader("Connection",         "keep-alive");
  res.setHeader("X-Accel-Buffering",  "no");  // disable nginx buffering

  let fullText = "";
  const stream = await model.generateContentStream(prompt);

  for await (const chunk of stream) {
    const text = chunk.text();
    if (text) {
      fullText += text;
      // SSE wire format: "data: {json}\n\n"
      res.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
    }
  }

  res.write(`data: ${JSON.stringify({ text: "", done: true })}\n\n`);
  res.end();
  return fullText; // for MongoDB persistence
}
```

### Frontend Implementation

```typescript
// lib/api.ts — ReadableStream reader
const response = await fetch(`${BASE_URL}/api/generate`, {
  method: "POST",
  body: JSON.stringify(options),
});

const reader  = response.body!.getReader();
const decoder = new TextDecoder();
let   buffer  = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n\n");
  buffer = lines.pop() || "";  // retain incomplete message

  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    const payload = JSON.parse(line.slice(6));
    if (payload.error) { onError(payload.error); return; }
    if (payload.done)  { onDone();               return; }
    if (payload.text)  { onChunk(payload.text);          }
  }
}
```

The buffer pattern handles the critical edge case where a TCP packet boundary falls in the middle of an SSE message — incomplete messages are accumulated until the next `read()` completes them.

---

## 📓 The LSTM Model — Academic Deliverable

The Jupyter notebook (`notebook/lstm_text_generation.ipynb`) is an 11-step, fully-annotated demonstration of building a text generation model from first principles using PyTorch.

### Why LSTM?

Long Short-Term Memory networks (Hochreiter & Schmidhuber, 1997) were the state-of-the-art for sequence modeling before the Transformer architecture (Vaswani et al., 2017) revolutionized NLP. Understanding LSTMs provides foundational insight into:
- Sequential data modeling and temporal dependencies
- The vanishing gradient problem in deep networks
- Gating mechanisms that selectively preserve and discard information
- Character-level vs word-level language modeling trade-offs
- Temperature-based sampling and the creativity/coherence trade-off

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
Linear Layer       [hidden_dim=256 → vocab_size]
      ↓
Softmax + Sample   [temperature scaling]
      ↓
Next Character
```

**Total trainable parameters:** ~500,000

### Training Configuration

| Hyperparameter | Value | Rationale |
|---|---|---|
| Sequence length | 80 characters | Captures medium-range dependencies |
| Batch size | 32 | Balance between gradient quality and speed |
| Epochs | 30 | Sufficient convergence on small corpus |
| Learning rate | 0.002 | Adam optimizer default; scheduler halves every 10 epochs |
| Gradient clip | 5.0 | Prevents exploding gradients — critical for RNNs |
| Dropout | 0.3 | Regularization against overfitting |
| Hidden dim | 256 | Sufficient capacity for character-level patterns |
| LSTM layers | 2 | Hierarchical feature extraction |
| Optimizer | Adam | Adaptive learning rates per parameter |
| Loss function | CrossEntropyLoss | Standard for multi-class classification |

### Temperature Sampling

```python
def generate_text(model, seed_text, num_chars=300, temperature=0.7):
    # temperature < 1.0 → sharper distribution → conservative output
    # temperature > 1.0 → flatter distribution → creative output
    logits = logits[:, -1, :] / temperature
    probs  = torch.softmax(logits, dim=-1)
    next_char_idx = torch.multinomial(probs, num_samples=1).item()
```

### LSTM vs Gemini — Honest Comparison

| Dimension | LSTM (Notebook) | Gemini 2.5 Flash (App) |
|---|---|---|
| Architecture | Recurrent (sequential) | Transformer (parallel attention) |
| Parameters | ~500K | Billions |
| Training data | 30 curated sentences | Trillions of tokens |
| Training time | Minutes on CPU | Months on TPU clusters |
| Output quality | Basic pattern learning | Human-level coherence |
| Controllability | Temperature only | Full prompt engineering |
| Cost | Free (local compute) | Free API tier |
| Purpose | Understanding fundamentals | Production application |

### Running the Notebook

**Option A — Google Colab (recommended, free GPU):**
1. Navigate to [colab.research.google.com](https://colab.research.google.com)
2. File → Upload notebook → select `lstm_text_generation.ipynb`
3. Runtime → Change runtime type → GPU
4. Runtime → Run all

**Option B — Local:**
```bash
cd notebook
pip install -r requirements.txt
jupyter notebook lstm_text_generation.ipynb
```

---

## 🗄 Database Schema

### Generation Document

```typescript
interface IGeneration {
  _id:         ObjectId;     // MongoDB auto-generated unique ID
  topic:       string;       // User input — 3 to 500 characters
  tone:        "formal" | "casual" | "creative" | "academic";
  length:      "short" | "medium" | "long";
  language:    string;       // e.g. "English", "Hindi", "Spanish"
  keywords:    string[];     // SEO keywords woven into output
  prompt:      string;       // Full engineered prompt sent to Gemini
  output:      string;       // Complete AI-generated text
  wordCount:   number;       // Auto-calculated in pre-save hook
  model:       string;       // "gemini-2.5-flash" — allows future comparison
  isFavourite: boolean;      // Bookmarking — default false
  createdAt:   Date;         // Mongoose automatic timestamp
  updatedAt:   Date;         // Mongoose automatic timestamp
}
```

### Indexes

```typescript
GenerationSchema.index({ createdAt: -1 });              // Fast history queries
GenerationSchema.index({ isFavourite: 1, createdAt: -1 }); // Fast favourites queries
```

### Pre-save Hook

```typescript
GenerationSchema.pre("save", function (next) {
  // Auto-calculate word count on every save
  this.wordCount = this.output.split(/\s+/).filter(Boolean).length;
  next();
});
```

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### `POST /api/generate`

Generates text using Gemini AI. Streams response via SSE.

**Request**
```json
{
  "topic":    "The future of quantum computing",
  "tone":     "academic",
  "length":   "medium",
  "language": "English",
  "keywords": ["qubit", "superposition", "decoherence"]
}
```

**SSE Response Stream**
```
data: {"text": "Quantum computing ", "done": false}
data: {"text": "represents a paradigm ", "done": false}
...
data: {"text": "", "done": true}
```

**Rate limit:** 5 requests/minute per IP

---

### `GET /api/generate/preview`

Returns the engineered prompt without calling Gemini.

**Query:** `?topic=...&tone=...&length=...&language=...`

**Response:** `{ "success": true, "prompt": "..." }`

---

### `GET /api/history`

Paginated generation history.

**Query:** `?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 10, "total": 42, "pages": 5 }
}
```

---

### `GET /api/history/:id` · `DELETE /api/history/:id` · `DELETE /api/history`

Single fetch, single delete, bulk delete. All return `{ "success": true, ... }`.

---

### `PATCH /api/history/:id/favourite`

Toggles `isFavourite` on a generation.

**Response:** `{ "success": true, "isFavourite": true }`

---

### `GET /health`

```json
{ "status": "ok", "service": "TextForge AI Backend", "version": "1.1.0" }
```

Full documentation: [docs/API.md](docs/API.md)

---

## 🔐 Security Architecture

### Layer 1 — Transport & Headers (Helmet.js)
Sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, disables `X-Powered-By` (hides Express fingerprint), configures `Strict-Transport-Security` for HTTPS deployments.

### Layer 2 — Origin Restriction (CORS)
Backend explicitly whitelists only the frontend origin (`CLIENT_URL` env var). Cross-origin requests from any other domain are rejected at the CORS preflight level — before reaching any route handler.

### Layer 3 — Rate Limiting (express-rate-limit)
Two independent limiters:
- **Global:** 50 requests per 15-minute sliding window per IP — prevents API abuse
- **Generate:** 5 requests per 60-second window per IP — protects Gemini quota

### Layer 4 — Input Validation (Zod)
Every request body field is validated at runtime before touching the AI or database:
- `topic`: string, min 3 chars, max 500 chars, trimmed
- `tone`: strict enum — rejects anything outside the four valid values
- `length`: strict enum — rejects anything outside the three valid values
- `language`: string, validated against supported language list
- `keywords`: array of strings, max 10 items

### Layer 5 — Secret Management
All secrets (`GEMINI_API_KEY`, `MONGODB_URI`) live exclusively in `.env` files. These are listed in `.gitignore` and have never been committed to version control. The `.env.example` file provides structure without values — collaborators supply their own credentials.

### Layer 6 — Error Boundaries
The global error handler (`middleware/errorHandler.ts`) catches all unhandled exceptions. In `NODE_ENV=development`, responses include stack traces for debugging. In `NODE_ENV=production`, only the error message is returned — internal code structure, file paths, and stack traces are never exposed to clients.

### Layer 7 — Body Size Limiting
`express.json({ limit: "10kb" })` rejects request bodies exceeding 10 kilobytes — mitigating a class of memory exhaustion denial-of-service attacks.

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Verify |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | Any | `git --version` |
| Google Account | — | For Gemini API key |
| MongoDB Atlas | Free | [mongodb.com/atlas](https://mongodb.com/atlas) |

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
# Open .env and fill in your GEMINI_API_KEY and MONGODB_URI
npm run dev
```

Verify at: `http://localhost:5000/health`

### 3. Frontend

```bash
# Open a second terminal
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open: `http://localhost:3000`

### 4. Notebook (Optional)

```bash
cd notebook
pip install -r requirements.txt
jupyter notebook lstm_text_generation.ipynb
```

---

## 🔧 Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Google Gemini API — free at aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Atlas — free at mongodb.com/atlas
# Format: mongodb+srv://username:password@cluster.host/dbname?options
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/textforge?retryWrites=true&w=majority

# CORS — URL of your frontend
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000   # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=50    # requests per window per IP
```

### Frontend — `frontend/.env.local`

```env
# URL of your backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🎨 Design System

### Color Palette — Spiced Chai

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `--bg-base` | `#1A1208` | `#FFFDF5` | Page background |
| `--bg-1` | `#221A0F` | `#FDF8EC` | Cards, panels, sidebar |
| `--bg-2` | `#2C2014` | `#FAF2DC` | Inputs, secondary surfaces |
| `--bg-3` | `#3A2C1C` | `#F5E8C8` | Hover states |
| `--brand` | `#D47E30` | `#D47E30` | Buttons, accents, highlights |
| `--text-1` | `#FDFBD4` | `#2C1E0F` | Primary text |
| `--text-2` | `#C4A882` | `#6B4E2A` | Secondary text |
| `--text-3` | `#7A6548` | `#9B7A50` | Labels, placeholders |
| `--border` | `rgba(212,126,48,0.18)` | `rgba(141,90,43,0.15)` | All borders |

### Typography

| Font | Usage | Weights |
|---|---|---|
| **Plus Jakarta Sans** | All UI chrome — nav, buttons, labels, body | 300, 400, 500, 600, 700 |
| **Lora** | Generated output text, hero subtitle | 400 regular, 400 italic |
| **JetBrains Mono** | Code, timestamps, word counts, tagline | 400, 500 |

---

## ⚡ Performance

### Frontend
- **Zero layout shift** — theme applied before React hydration via inline script
- **Tree-shaken icons** — Lucide React only bundles icons that are imported
- **Skeleton loading** — `generate/loading.tsx` prevents content flash
- **Optimistic UI** — generation state updates immediately on submit

### Backend
- **Streaming response** — First byte delivered within ~200ms of generation start
- **Connection pooling** — Mongoose maintains a persistent MongoDB connection pool
- **Early validation** — Zod rejects invalid requests before any async operations
- **Indexed queries** — All frequent query patterns have corresponding MongoDB indexes

---

## 🗺 Roadmap

### Version 1.1 — In Progress
- [x] Templates system (Blog Post, Professional Email, Essay)
- [x] Multi-language output (10+ languages)
- [x] SEO keyword weaving
- [x] Stats dashboard
- [ ] Favourites / Bookmarks (schema ready, UI in progress)
- [ ] Live deployment (Vercel + Railway)

### Version 1.2 — Planned
- [ ] User authentication (NextAuth.js — Google + GitHub OAuth)
- [ ] Per-user private history
- [ ] Export to PDF and DOCX
- [ ] Search and filter history
- [ ] Regenerate / Refine existing outputs

### Version 1.3 — Future
- [ ] Public API with personal API key management
- [ ] Bulk generation mode
- [ ] Version history per topic
- [ ] Collaborative sharing via public links

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/textforge-ai.git

# 3. Create a feature branch
git checkout -b feat/your-feature-name

# 4. Make your changes, then commit using conventional commits
git commit -m "feat: add export to PDF functionality"

# 5. Push to your fork
git push origin feat/your-feature-name

# 6. Open a Pull Request on GitHub
```

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Formatting, no logic change
refactor: Code restructure, no behavior change
perf:     Performance improvement
test:     Adding tests
chore:    Build process, dependency updates
```

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for full text.

---

<div align="center">

<br/>

Built with 🔥 by a developer who refused to submit just a notebook.

<br/>

**TextForge AI** &nbsp;·&nbsp; *Forge Your Text With AI*

<br/>

[![Star on GitHub](https://img.shields.io/github/stars/YOUR_USERNAME/textforge-ai?style=social)](https://github.com/YOUR_USERNAME/textforge-ai)

<br/>

</div>
