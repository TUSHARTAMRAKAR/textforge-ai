<div align="center">

<br/>

[![TextForge AI](https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=52&pause=1000&color=D47E30&center=true&vCenter=true&width=800&height=100&lines=🔥+TextForge+AI;Forge+Your+Text+With+AI;6+Domains+·+70%2B+Parameters;AI+Detection+%2B+Humaniser;Real+Academic+Citations;🇮🇳+Bharat+AI+-+भारत+AI;Built+by+Tushar+Tamrakar)](https://textforge-ai-sable.vercel.app)

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-LIVE%20IN%20PRODUCTION-00D4AA?style=for-the-badge&labelColor=0A0A0A" />
  <img src="https://img.shields.io/badge/VERSION-2.0.0-D47E30?style=for-the-badge&labelColor=0A0A0A" />
  <img src="https://img.shields.io/badge/LICENSE-MIT-7C3AED?style=for-the-badge&labelColor=0A0A0A" />
</p>

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
  <a href="https://textforge-ai-sable.vercel.app"><strong>🌐 Live App</strong></a> &nbsp;·&nbsp;
  <a href="https://textforge-ai-sable.vercel.app/demo"><strong>🎓 Professor Demo</strong></a> &nbsp;·&nbsp;
  <a href="#-system-architecture"><strong>🏗 Architecture</strong></a> &nbsp;·&nbsp;
  <a href="#-the-lstm-model--academic-deep-dive"><strong>🧠 LSTM Deep Dive</strong></a> &nbsp;·&nbsp;
  <a href="#-quick-start"><strong>🚀 Quick Start</strong></a>
</p>

<br/>

---

> *"A notebook would have been sufficient to pass.*
> *TextForge AI is what happens when a developer refuses to do the minimum."*
> — **The Developer**

---

</div>

<br/>

## 📖 Table of Contents

| # | Section |
|---|---------|
| 1 | [The Origin Story](#-the-origin-story) |
| 2 | [What Is TextForge AI?](#-what-is-textforge-ai) |
| 3 | [Live Deployment](#-live-deployment) |
| 4 | [Complete Feature Matrix — v2.0](#-complete-feature-matrix--v20) |
| 5 | [System Architecture](#-system-architecture) |
| 6 | [Deep Domain Templates](#-deep-domain-templates) |
| 7 | [AI Detection & Humaniser](#-ai-detection--humaniser) |
| 8 | [Academic Citations Generator](#-academic-citations-generator) |
| 9 | [Bharat AI — India-First Vernacular](#-bharat-ai--india-first-vernacular) |
| 10 | [Real-time Streaming — SSE Internals](#-real-time-streaming--sse-internals) |
| 11 | [The LSTM Model — Academic Deep Dive](#-the-lstm-model--academic-deep-dive) |
| 12 | [Technology Stack](#-technology-stack) |
| 13 | [Project Structure](#-project-structure) |
| 14 | [Database Schema & Design](#-database-schema--design) |
| 15 | [Security Architecture](#-security-architecture) |
| 16 | [API Reference](#-api-reference) |
| 17 | [Quick Start](#-quick-start) |
| 18 | [Environment Variables](#-environment-variables) |
| 19 | [Deployment Guide](#-deployment-guide) |
| 20 | [Roadmap](#-roadmap) |

<br/>

---

## 🔥 The Origin Story

This project was born from a single college assignment brief:

```
╔══════════════════════════════════════════════════════════════════════╗
║  ASSIGNMENT BRIEF                                                    ║
║  "Create a text generation model using GPT or LSTM to generate      ║
║   coherent paragraphs on specific topics."                          ║
║  Deliverable: A notebook demonstrating generated text.              ║
╚══════════════════════════════════════════════════════════════════════╝
```

A notebook would have satisfied the requirement. TextForge AI v2.0 is what happens when a developer asks *"what if we built the real thing?"*

<br/>

| Academic Requirement | Minimum | **TextForge AI v2.0** |
|---|---|---|
| Text generation | ✅ Notebook | ✅ Gemini 2.5 Flash + PyTorch LSTM |
| Coherent paragraphs | ✅ Basic | ✅ Prompt-engineered, structured output |
| Topic-based generation | ✅ | ✅ Tone · Length · Language · SEO |
| User interface | ❌ | ✅ Full Next.js 14 production app |
| Real-time streaming | ❌ | ✅ Server-Sent Events, first token <200ms |
| Authentication | ❌ | ✅ Google + GitHub OAuth via NextAuth v4 |
| Cloud database | ❌ | ✅ MongoDB Atlas per-user isolation |
| Domain expertise | ❌ | ✅ **6 domains · 70+ params · 25 output types** |
| AI Detection | ❌ | ✅ **5-dimension linguistic scoring** |
| Humaniser | ❌ | ✅ **One-click AI score reducer** |
| Academic citations | ❌ | ✅ **200M+ real papers · APA/MLA/IEEE** |
| Indian languages | ❌ | ✅ **6 languages · cultural idioms · native script** |
| Professor demo mode | ❌ | ✅ **/demo — guided 6-step walkthrough** |
| Export system | ❌ | ✅ PDF · DOCX · Markdown · TXT |
| Analytics dashboard | ❌ | ✅ MongoDB aggregations + Recharts |
| Public API | ❌ | ✅ API key management system |
| Live deployment | ❌ | ✅ Vercel + Railway production |

<br/>

---

## 🌐 What Is TextForge AI?

**TextForge AI** is a production-grade, full-stack AI writing platform that goes far beyond generic text generation. It combines domain expertise, linguistic analysis, real academic sources, and cultural authenticity into one application.

```
╔═══════════════════════════════════════════════════════════════════╗
║                    TEXTFORGE AI v2.0                              ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  "Why use yours over ChatGPT?"                                    ║
║                                                                   ║
║  ✦ Mine asks 14 questions before writing a legal contract.        ║
║  ✦ Mine scores your text for AI detection and rewrites            ║
║    it to pass detectors in one click.                             ║
║  ✦ Mine generates academic articles with REAL verifiable          ║
║    citations from 200 million papers.                             ║
║  ✦ Mine writes natively in Hindi, Marathi, Tamil, and             ║
║    Telugu — not translation, but cultural expression.             ║
║                                                                   ║
║  ChatGPT does none of these things in one place.                  ║
║  TextForge AI does all of them.                                   ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

<br/>

---

## 🚀 Live Deployment

```
╔══════════════════════════════════════════════════════════════════════╗
║                      PRODUCTION URLs                                ║
╠══════════════════════════════════════════════════════════════════════╣
║  🌐  App      →  https://textforge-ai-sable.vercel.app             ║
║  🎓  Demo     →  https://textforge-ai-sable.vercel.app/demo        ║
║  ⚖️  Domains  →  https://textforge-ai-sable.vercel.app/domain      ║
║  📚  Citations →  https://textforge-ai-sable.vercel.app/citations  ║
║  🇮🇳  Bharat AI →  https://textforge-ai-sable.vercel.app/vernacular ║
║  🔧  Backend  →  https://textforge-ai-production.up.railway.app    ║
╚══════════════════════════════════════════════════════════════════════╝

  Frontend  ──  Vercel   (Next.js CDN, global edge network)
  Backend   ──  Railway  (Node.js container, auto-deploys from GitHub)
  Database  ──  MongoDB Atlas M0 (512MB, cloud-hosted)
  AI        ──  Google Gemini 2.5 Flash (free tier)
```

<br/>

---

## ✨ Complete Feature Matrix — v2.0

### 🤖 Core Generation Engine

| Feature | Implementation | Detail |
|---|---|---|
| **SSE Streaming** | `generateContentStream()` | First token < 200ms |
| **8 Templates** | `lib/templates.ts` | Blog · Email · Essay · Cover Letter · Product · Social · Summary · Story |
| **4 Tones** | Prompt injection | Formal · Casual · Creative · Academic |
| **3 Lengths** | Word count targeting | Short ~150 · Medium ~350 · Long ~700 |
| **8 Languages** | Gemini prompt | EN · HI · ES · FR · DE · JA · AR · ZH |
| **SEO Keywords** | Natural weaving | Up to 10 terms |
| **Refine System** | `buildRefinementPrompt()` | Shorter · Longer · Formal · Simpler |

### ⚖️ Deep Domain Templates *(New in v2.0)*

| Domain | Parameters | Output Types |
|---|---|---|
| **Legal** | 14 | NDA · Service Agreement · Employment · Freelance · Partnership |
| **Medical** | 12 | Case Study · SOAP Note · Research Abstract · Discharge Summary |
| **Startup** | 13 | Executive Summary · Problem Statement · Value Prop · Pitch · Investor Email |
| **Research** | 11 | Abstract · Literature Review · Methodology · Discussion · Conclusion |
| **Grant** | 10 | Project Proposal · Impact Statement · Budget Justification · Objectives |
| **HR** | 10 | Job Description · Performance Review · Offer Letter · Policy · Interview Qs |
| **Total** | **70+** | **25 output types** |

### 🛡️ AI Detection & Humaniser *(New in v2.0)*

| Dimension | Weight | What It Measures |
|---|---|---|
| **Burstiness** | 25% | Sentence length variance — humans write with more rhythm |
| **AI Phrase Density** | 40% | 45+ known AI signature phrases detected |
| **Vocabulary Diversity** | 15% | Sliding window type-token ratio |
| **Sentence Openings** | 10% | Repetitive starts = AI pattern |
| **Punctuation Pattern** | 10% | AI overuses commas and semicolons |

### 📚 Academic Citations Generator *(New in v2.0)*

| Feature | Detail |
|---|---|
| **Semantic Scholar** | 200M+ papers, free, no API key |
| **CrossRef** | 130M+ works, DOI lookup |
| **Citation Styles** | APA 7th · MLA 9th · IEEE |
| **Quality Filter** | Sorted by citation count — most cited = most relevant |
| **In-text highlighting** | `(Author, Year)` rendered in brand orange |
| **References section** | Auto-generated, properly formatted |

### 🇮🇳 Bharat AI — India-First Vernacular *(New in v2.0)*

| Language | Script | Cultural Context |
|---|---|---|
| **Hindi** हिन्दी | Devanagari | North Indian culture, Bollywood, cricket, Diwali |
| **Marathi** मराठी | Devanagari | Maharashtra, Shivaji, Ganesh Chaturthi, Mumbai |
| **Tamil** தமிழ் | Tamil | Sangam literature, Kollywood, AR Rahman |
| **Telugu** తెలుగు | Telugu | Tollywood, Hyderabad IT, Kuchipudi |
| **Bengali** বাংলা | Bengali | Tagore, Durga Puja, intellectual tradition |
| **Gujarati** ગુજરાતી | Gujarati | Navratri, Gandhi, entrepreneurial culture |

<br/>

---

## 🏗 System Architecture

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        TEXTFORGE AI v2.0 — FULL STACK                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │                      PRESENTATION LAYER                              │   ║
║  │                   Next.js 14 — Vercel CDN                            │   ║
║  │                                                                      │   ║
║  │  /workspace  /domain  /citations  /vernacular  /demo  /stats        │   ║
║  │                                                                      │   ║
║  │  Zustand · NextAuth · Tailwind · SSE ReadableStream                 │   ║
║  └──────────────────────────┬───────────────────────────────────────────┘   ║
║                             │  HTTP/SSE + x-user-id header                  ║
║  ┌──────────────────────────▼───────────────────────────────────────────┐   ║
║  │                     APPLICATION LAYER                                │   ║
║  │                  Express 4 + TypeScript — Railway                    │   ║
║  │                                                                      │   ║
║  │  /api/generate   → SSE streaming + refine + humanise                │   ║
║  │  /api/domain     → 6 domains, 70+ parameters, expert prompts        │   ║
║  │  /api/citations  → Semantic Scholar + CrossRef + Gemini             │   ║
║  │  /api/vernacular → 6 Indian languages + cultural profiles           │   ║
║  │  /api/history    → CRUD + paginated + userId scoped                 │   ║
║  │  /api/stats      → 4 MongoDB aggregation pipelines                  │   ║
║  │  /api/keys       → API key management (tf_live_ prefix)             │   ║
║  └──────────┬───────────────────────────┬────────────────────────────────┘  ║
║             │                           │                                    ║
║  ┌──────────▼──────────┐   ┌────────────▼──────────────────────────────┐   ║
║  │  Google Gemini      │   │          MongoDB Atlas                    │   ║
║  │  2.5 Flash          │   │                                           │   ║
║  │                     │   │  generations collection                   │   ║
║  │  generateContent    │   │  ├─ topic, tone, length, language         │   ║
║  │  Stream()           │   │  ├─ citations[], citationStyle            │   ║
║  │                     │   │  ├─ templateId (domain tracking)         │   ║
║  │  Semantic Scholar   │   │  └─ userId (per-user isolation)           │   ║
║  │  CrossRef APIs      │   │                                           │   ║
║  └─────────────────────┘   └───────────────────────────────────────────┘   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

<br/>

---

## ⚖️ Deep Domain Templates

The core insight: **ChatGPT asks 0 questions before writing a legal contract. TextForge AI asks 14.**

```
User selects domain → Legal
         │
         ▼
Dynamic form renders 14 fields:
  Party 1 name + role · Party 2 name + role
  Jurisdiction (India/US/UK/Singapore)
  Duration · Contract value
  Confidentiality level · Liability limit
  Dispute resolution · IP ownership
  Non-compete · Special clauses
         │
         ▼
buildLegalPrompt() constructs expert-level prompt:
  "You are a senior corporate lawyer with 20+ years experience...
   PARTY 1: TextForge AI (Disclosing Party)
   JURISDICTION: Indian Contract Act 1872
   LIABILITY: Limited to contract value
   DISPUTE: Arbitration under Arbitration Act 1996..."
         │
         ▼
Gemini generates jurisdiction-specific, properly structured document
         │
         ▼
Export as PDF · DOCX · with correct legal formatting
```

**Why this is exceptional:** The depth of domain knowledge embedded in the prompts took weeks to build. Anyone can call the Gemini API. Nobody can copy the 70+ parameters of domain-specific prompt engineering without the same research.

<br/>

---

## 🛡️ AI Detection & Humaniser

### The Algorithm

```typescript
// 5 dimensions, client-side — no external API needed
export function detectAI(text: string): DetectionResult {
  const burstiness    = measureBurstiness(sentences);      // 25% weight
  const aiPhrases     = measureAIPhraseDensity(text);      // 40% weight
  const vocabulary    = measureVocabularyDiversity(words); // 15% weight
  const sentenceStarts = measureSentenceStartDiversity();  // 10% weight
  const punctuation   = measurePunctuationPattern(text);   // 10% weight

  const score = burstiness*0.25 + aiPhrases*0.40 + vocabulary*0.15
              + sentenceStarts*0.10 + punctuation*0.10;
  // → Risk level: low (<35) | medium (35-65) | high (>65)
}
```

### The 45 AI Signature Phrases

Includes Gemini-specific patterns: *"remains a", "serves as", "shaping the", "landscape of", "a wide range of"* — plus universal markers: *"furthermore", "it is worth noting", "delve into", "tapestry", "nuanced", "multifaceted"*

### The Humanisation Prompt

```
Specific instructions target exactly what the detector measures:
1. VARY sentence lengths dramatically
2. REMOVE all 45 AI signature phrases
3. ADD natural rhetorical questions and asides
4. VARY sentence openings
5. USE contractions appropriately
6. REPLACE generic adjectives with specific ones
7. ADD one concrete analogy
8. REDUCE comma density
```

**Result:** Score typically drops from 55-75% → 10-20% after one humanisation pass.

<br/>

---

## 📚 Academic Citations Generator

### Architecture

```
User enters topic: "Deep learning in medical imaging"
         │
         ▼
Promise.all([
  fetchSemanticScholar(topic, 4),  ← 200M+ papers
  fetchCrossRef(topic, 3)          ← 130M+ works
])
         │
         ▼
Merge + deduplicate by title similarity
Sort by citation count (most cited = most important)
         │
         ▼
formatCitations(papers, style: "apa" | "mla" | "ieee")
→ APA: (Litjens et al., 2017)
→ MLA: (Litjens 2017)
→ IEEE: [1]
         │
         ▼
buildCitedPrompt() — instructs Gemini to weave citations naturally
         │
         ▼
Generated text with (Author, Year) highlighted in orange
Full References section auto-generated at bottom
Saved to MongoDB with citationCount badge in history
```

### Real Example Output

```
Deep learning has fundamentally transformed medical image
classification. A comprehensive survey by (Litjens et al., 2017)
catalogued over 300 applications across imaging modalities...

Landmark studies demonstrated human-competitive performance.
(Esteva et al., 2017) achieved dermatologist-level accuracy...

References:
Litjens, G., et al. (2017). A survey on deep learning in medical
  image analysis. Medical Image Analysis, 42, 60–88.
```

<br/>

---

## 🇮🇳 Bharat AI — India-First Vernacular

### Why This Matters

Every AI tool treats Indian language content as an afterthought — translated from English. Bharat AI generates content that was **written** in Hindi, not translated from English.

```
Generic AI approach:
  English prompt → English output → Google Translate → Hindi
  Result: Grammatically correct but culturally hollow

Bharat AI approach:
  Prompt engineering with:
    ✦ Language profile (cultural context, idioms, references)
    ✦ Regional specificity
    ✦ Native sentence structure
    ✦ Indian cultural references
  Result: Content a native speaker would recognise as authentic
```

### Language Profiles

Each language has a dedicated profile with:
- Cultural context (festivals, icons, traditions)  
- Idiom instructions (specific proverbs and expressions)
- Reference instructions (historical figures, contemporary icons)
- Regional variants (Mumbai Marathi vs Pune Marathi)

### Market Context

```
Hindi speakers:   530M+   ← more than the entire EU population
Tamil speakers:    80M+
Telugu speakers:   85M+
Bengali speakers: 230M+
Marathi speakers:  95M+
Gujarati speakers: 60M+
─────────────────────────
Total addressable: 1.08 BILLION people
```

<br/>

---

## ⚡ Real-time Streaming — SSE Internals

### Why SSE Over WebSockets

```
SSE: Server → Client (unidirectional, HTTP/1.1, auto-reconnect)
WebSockets: Bidirectional (custom protocol, overkill for streaming)

For text generation: data flows in ONE direction.
SSE is the architecturally correct choice.
```

### The Buffer Pattern (Critical)

```typescript
// Without buffer — breaks on TCP packet splits:
// Packet 1: "data: {"text":"Hello ","don"
// Packet 2: "e":false}\n\n..."
// JSON.parse("{"text":"Hello ","don") → ❌ SyntaxError

// With buffer — production-correct:
buffer += decoder.decode(value, { stream: true });
const lines = buffer.split("\n\n");
buffer = lines.pop() || "";  // ← retain incomplete message
for (const line of lines) {
  const payload = JSON.parse(line.slice(6));  // ✅ always complete
}
```

<br/>

---

## 📓 The LSTM Model — Academic Deep Dive

### The Vanishing Gradient Problem

$$\frac{\partial L}{\partial W} = \frac{\partial L}{\partial h_T} \cdot \prod_{t=1}^{T} \frac{\partial h_t}{\partial h_{t-1}}$$

If $\left|\frac{\partial h_t}{\partial h_{t-1}}\right| < 1$ for all $t$: gradients → 0 exponentially → model cannot learn long-range dependencies.

### LSTM Gate Equations

```
Forget gate:  f_t = σ(W_f · [h_{t-1}, x_t] + b_f)
Input gate:   i_t = σ(W_i · [h_{t-1}, x_t] + b_i)
Candidate:   C̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)
Cell update:  C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t
Output gate:  o_t = σ(W_o · [h_{t-1}, x_t] + b_o)
Hidden:       h_t = o_t ⊙ tanh(C_t)
```

### Model Architecture

```
Input Character
      ↓
Embedding Layer    (vocab_size → embed_dim=128)
      ↓
LSTM Layer 1       (128 → 256, dropout=0.3)
      ↓
LSTM Layer 2       (256 → 256)
      ↓
Dropout            (p=0.3)
      ↓
Linear             (256 → vocab_size)
      ↓
Temperature Sampling → Next Character

Total trainable parameters: ~500,000
```

### Training Configuration

| Hyperparameter | Value | Rationale |
|---|---|---|
| Sequence length | 80 chars | Medium-range syntactic dependencies |
| Batch size | 32 | Gradient quality vs memory balance |
| Epochs | 30 | Loss plateau at ~25 epochs |
| Learning rate | 0.002 | Adam default, ×0.5 every 10 epochs |
| **Gradient clipping** | **5.0** | **Critical for RNNs — prevents explosion** |
| Dropout | 0.3 | Srivastava et al. (2014) |
| Hidden dims | 256 | Sufficient character-level capacity |
| LSTM layers | 2 | Syntax (L1) + semantics (L2) |

### LSTM vs Transformer

| Dimension | LSTM (Notebook) | Transformer (Gemini) |
|---|---|---|
| Architecture | Recurrent (sequential) | Self-attention (parallel) |
| Complexity | O(n) | O(n²) attention |
| Long-range deps | Cell state gating | Direct attention |
| Parallelisation | Sequential — slow | Fully parallel — fast |
| Parameters | ~500K | Billions |
| Seminal paper | Hochreiter & Schmidhuber (1997) | Vaswani et al. (2017) |

<br/>

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 14.2 | React framework, App Router, SSR |
| **TypeScript** | 5.4 | End-to-end type safety |
| **Tailwind CSS** | 3.4 | JIT utility-first styling |
| **NextAuth.js** | 4.24 | Google + GitHub OAuth |
| **Zustand** | 4.5 | Zero-boilerplate global state |
| **Recharts** | 2.x | Analytics dashboard charts |
| **Lucide React** | 0.383 | Tree-shakeable icon system |
| **jsPDF** | 2.x | Client-side PDF export |
| **docx** | 8.x | DOCX generation |

### Backend

| Technology | Version | Role |
|---|---|---|
| **Node.js** | 18+ | Non-blocking I/O runtime |
| **Express** | 4.19 | REST API framework |
| **TypeScript** | 5.4 | Type safety across 15+ route files |
| **@google/generative-ai** | 0.15 | Gemini SDK with streaming |
| **Mongoose** | 8.4 | MongoDB ODM + aggregations |
| **Zod** | 3.23 | Runtime validation + TypeScript inference |
| **Helmet** | 7.1 | 11 HTTP security headers |
| **express-rate-limit** | 7.3 | Per-IP sliding window protection |

### External Services

| Service | Purpose | Cost |
|---|---|---|
| **Google Gemini 2.5 Flash** | AI generation | Free (1,500 req/day) |
| **Semantic Scholar API** | Academic citations | Free, no key needed |
| **CrossRef API** | Academic citations | Free, no key needed |
| **MongoDB Atlas** | Database | Free (M0 512MB) |
| **Vercel** | Frontend hosting | Free (hobby tier) |
| **Railway** | Backend hosting | Free tier |

<br/>

---

## 📁 Project Structure

```
textforge-ai/
│
├── 📄 README.md
├── 📄 LICENSE
│
├── 📁 backend/
│   └── src/
│       ├── index.ts                    ← Express server + all route registration
│       ├── config/index.ts             ← Env validation, CORS regex, model config
│       ├── models/
│       │   ├── Generation.ts           ← Schema (citations, citationStyle, templateId)
│       │   └── ApiKey.ts
│       ├── services/
│       │   ├── geminiService.ts        ← All prompt builders (domain, vernacular, humanise)
│       │   ├── citationService.ts      ← Semantic Scholar + CrossRef + formatters
│       │   └── historyService.ts       ← CRUD + 4 aggregation pipelines
│       ├── routes/
│       │   ├── generate.ts             ← /generate + /refine + /humanise
│       │   ├── domain.ts               ← 6 domain templates
│       │   ├── citations.ts            ← Academic citations with real APIs
│       │   ├── vernacular.ts           ← 6 Indian language generation
│       │   ├── history.ts              ← Paginated history
│       │   ├── share.ts                ← Public share links
│       │   ├── stats.ts                ← Analytics aggregations
│       │   └── apiKeys.ts              ← Key management
│       └── middleware/
│           ├── rateLimiter.ts          ← Dual-layer sliding window
│           ├── errorHandler.ts         ← Global boundary + AppError
│           └── apiKeyAuth.ts           ← tf_live_ prefix validation
│
├── 📁 frontend/
│   └── app/
│       ├── page.tsx                    ← Landing page (animated hero, 8 feature cards)
│       ├── workspace/page.tsx          ← Main app (sidebar + chat + refine + detection)
│       ├── domain/
│       │   ├── page.tsx                ← 3-step domain flow
│       │   └── showcase/page.tsx       ← Pre-generated sample outputs
│       ├── citations/page.tsx          ← Citations generator with highlighted output
│       ├── vernacular/page.tsx         ← Bharat AI — 6 Indian languages
│       ├── demo/page.tsx               ← Professor demo mode (6 steps, auto-play)
│       ├── stats/page.tsx              ← Recharts analytics dashboard
│       ├── history/page.tsx            ← Full history with search + filter
│       └── api-keys/page.tsx           ← API key management
│   └── components/
│       ├── AIDetectionPanel.tsx        ← Risk score + dimension bars + humanise button
│       ├── MadeBy.tsx                  ← Animated "Made with ❤️ by Tushar Tamrakar"
│       ├── Navbar.tsx                  ← Context-aware navigation
│       ├── PromptBuilder.tsx           ← Full panel + compact bottom-bar mode
│       └── UserMenu.tsx                ← Avatar dropdown + userId injection
│   └── lib/
│       ├── aiDetector.ts               ← 5-dimension AI detection algorithm
│       ├── domainTemplates.ts          ← 6 domain definitions (759 lines)
│       ├── citationService.ts          ← Citation fetching + formatting
│       ├── api.ts                      ← Axios client + x-user-id interceptor
│       └── store.ts                    ← Zustand state management
│
└── 📁 notebook/
    └── lstm_text_generation.ipynb      ← 13-cell PyTorch LSTM (upgraded v2.0)
```

<br/>

---

## 🗄 Database Schema & Design

```typescript
interface IGeneration {
  userId?:        string;    // OAuth provider UID — scopes ALL queries
  topic:          string;    // 3-500 chars
  tone:           Tone;      // formal | casual | creative | academic
  length:         Length;    // short | medium | long
  language:       string;    // en | hi | es | fr...
  output:         string;    // Generated text
  wordCount:      number;    // Pre-calculated in Mongoose hook
  modelName:      string;    // gemini-2.5-flash (not "model" — Mongoose conflict)
  templateId?:    string;    // domain_legal_nda | vernacular_hi | citation_apa
  citations?:     any[];     // Full citation objects for cited generations
  citationStyle?: string;    // apa | mla | ieee
  citationCount?: number;    // Badge display in sidebar
  isFavourite:    boolean;
  isShared:       boolean;
  createdAt:      Date;
}

// 3 compound indexes for common query patterns
GenerationSchema.index({ createdAt: -1 });
GenerationSchema.index({ userId: 1, createdAt: -1 });
GenerationSchema.index({ isFavourite: 1, createdAt: -1 });
```

<br/>

---

## 🔐 Security Architecture

```
Request arrives
     │
     ▼  Helmet.js — 11 security headers (X-Frame, MIME sniff, fingerprint)
     ▼  CORS — regex /^https:\/\/textforge-.*\.vercel\.app$/
     ▼  Rate Limiting — 50/15min global · 5/min on AI endpoints
     ▼  Zod Validation — rejects bad data before AI or database
     ▼  Body Size — express.json({ limit: "10kb" })
     ▼  Error Handler — stack traces only in development
     ↓
  Route Handler
```

<br/>

---

## 📡 API Reference

**Base URL:** `https://textforge-ai-production.up.railway.app`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate` | Stream text via SSE |
| `POST` | `/api/generate/refine` | Refine existing output |
| `POST` | `/api/generate/humanise` | Reduce AI detection score |
| `POST` | `/api/domain/generate` | Domain template generation |
| `POST` | `/api/citations/generate` | Generate with real citations |
| `GET` | `/api/citations/search` | Search academic papers |
| `POST` | `/api/vernacular/generate` | Indian language generation |
| `GET` | `/api/history` | Paginated generation history |
| `PATCH` | `/api/history/:id/favourite` | Toggle star |
| `PATCH` | `/api/history/:id/share` | Toggle public share |
| `GET` | `/api/share/:id` | Public share (no auth) |
| `GET` | `/api/stats` | Analytics aggregations |
| `POST` | `/v1/generate` | Public API (API key auth) |
| `GET` | `/health` | Health check |

<br/>

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/TUSHARTAMRAKAR/textforge-ai.git
cd textforge-ai

# 2. Backend
cd backend && npm install
cp .env.example .env
# Fill: GEMINI_API_KEY, MONGODB_URI
npm run dev  # http://localhost:5000/health

# 3. Frontend (new terminal)
cd frontend && npm install
cp .env.local.example .env.local
# Fill: OAuth credentials, NEXTAUTH_SECRET
npm run dev  # http://localhost:3000

# 4. LSTM Notebook (optional)
cd notebook
pip install torch numpy matplotlib tqdm
jupyter notebook lstm_text_generation.ipynb
# Or open in Google Colab (free T4 GPU)
```

<br/>

---

## 🔧 Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_key        # aistudio.google.com — free
MONGODB_URI=mongodb+srv://...         # mongodb.com/atlas — free M0
CLIENT_URL=http://localhost:3000
GEMINI_MODEL=gemini-1.5-flash         # 1,500 req/day free
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_SECRET=your_32_byte_hex_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...                  # console.cloud.google.com
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...                  # github.com/settings/developers
GITHUB_CLIENT_SECRET=...
```

<br/>

---

## ☁️ Deployment Guide

### Frontend → Vercel
```
1. Import repo → Root: frontend → Framework: Next.js
2. Add all env vars (production URLs)
3. Deploy

Rules:
✅ next.config.js: typescript.ignoreBuildErrors: true
✅ Route handlers export ONLY { GET, POST }
✅ NEXTAUTH_URL must match exact domain
```

### Backend → Railway
```
1. Deploy from GitHub → Root: /backend
2. Build: npm run build  (tsc --skipLibCheck)
3. Start: npm start      (node dist/index.js)
4. Health: /health

Rules:
✅ typescript in dependencies (not devDependencies)
✅ tsconfig: skipLibCheck: true
✅ No "model" field in Mongoose schema (conflicts with Document.model())
✅ CORS regex allows all *.vercel.app preview URLs
```

<br/>

---

## 🗺 Roadmap

### ✅ v1.0 — Foundation
- Next.js 14 frontend · Express backend · MongoDB Atlas
- Gemini SSE streaming · PyTorch LSTM notebook
- OAuth · History · Export · Stats · Public API

### ✅ v2.0 — Production Platform *(Current)*
- Deep Domain Templates (6 domains · 70+ params)
- AI Detection + Humaniser (5-dimension algorithm)
- Academic Citations (Semantic Scholar + CrossRef)
- Bharat AI (6 Indian languages + cultural profiles)
- Professor Demo Mode (/demo auto-play)
- Landing page upgrade (8 feature cards)
- LSTM notebook upgraded (13 cells, v2.0 docs)

### 📋 v2.1 — Coming Soon
- **Multi-Model Comparison Engine** — One prompt → Gemini + GPT + Claude side-by-side. Community leaderboard of best model per use case and tone.
- **Writing Coach** — The ANTI-ChatGPT. Analyses YOUR writing, gives specific feedback, tracks vocabulary growth and improvement over time. Gamified streaks.
- **UI Internationalisation (i18n)** — Full interface translation via `next-intl`. Note: AI content in 8 languages already works — this covers UI strings.

### 🔮 v3.0 — Future Vision
- **Mobile Application** — React Native iOS + Android
- **Browser Extension** — One-click generation from any webpage
- **Fine-tuned Domain Models** — Custom models trained on legal/medical corpora

<br/>

---

## 🤝 Contributing

```bash
git clone https://github.com/TUSHARTAMRAKAR/textforge-ai.git
git checkout -b feat/your-feature
git commit -m "feat: your feature description"
git push origin feat/your-feature
# Open Pull Request
```

Commit types: `feat` · `fix` · `docs` · `refactor` · `perf` · `test`

<br/>

---

## 📄 License

MIT License — Free to use, modify, and distribute.
Copyright (c) 2026 Tushar Tamrakar

<br/>

---

<div align="center">

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║    "A notebook would have been sufficient to pass.               ║
║     TextForge AI is what happens when a developer               ║
║     refuses to do the minimum."                                  ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

<br/>

**Built with 🔥 · Deployed with ⚡ · Documented with 📚**

<br/>

### 👨‍💻 About The Developer

<br/>

<a href="https://github.com/TUSHARTAMRAKAR">
  <img src="https://github.com/TUSHARTAMRAKAR.png" width="80" height="80" style="border-radius:50%" alt="Tushar Tamrakar"/>
</a>

<br/><br/>

**Made with ❤️ by [Tushar Tamrakar](https://github.com/TUSHARTAMRAKAR)**

*B.Tech Student · Full-Stack Developer · AI Engineer*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-TUSHARTAMRAKAR-181717?style=flat-square&logo=github)](https://github.com/TUSHARTAMRAKAR)
&nbsp;
[![Live App](https://img.shields.io/badge/Live-TextForge%20AI-D47E30?style=flat-square)](https://textforge-ai-sable.vercel.app)
&nbsp;
[![Demo](https://img.shields.io/badge/Demo-Professor%20Mode-7C3AED?style=flat-square)](https://textforge-ai-sable.vercel.app/demo)

<br/>

[![Star on GitHub](https://img.shields.io/github/stars/TUSHARTAMRAKAR/textforge-ai?style=social)](https://github.com/TUSHARTAMRAKAR/textforge-ai)

<br/>

*If this project helped you, consider giving it a ⭐ on GitHub*

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=D47E30&height=100&section=footer" width="100%"/>

</div>
