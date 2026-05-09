# TextForge AI — Architecture Documentation

## System Design Decisions

### Why Next.js 14 App Router?
Next.js App Router gives us server components, streaming, and file-based routing out of the box. Combined with Tailwind CSS it's the fastest way to build a polished, production-grade UI in 2025.

### Why Express over Next.js API Routes?
The backend is intentionally separated from the frontend for two reasons:
1. **SSE streaming** — Express gives full control over response headers and connection lifecycle, which is tricky inside Next.js API routes
2. **Separation of concerns** — the backend can be deployed independently, scaled independently, and swapped for a different framework if needed

### Why Zustand over Redux?
The app's state is simple — a few form values and the streaming output. Zustand handles this in ~50 lines without boilerplate. Redux would be overkill.

### Why SSE over WebSockets?
Server-Sent Events are unidirectional (server → client), which is exactly what we need for streaming AI output. WebSockets are bidirectional and add complexity. SSE works over standard HTTP, is supported in all browsers, and auto-reconnects.

### Why MongoDB?
Generation history is document-shaped (variable-length text, metadata). MongoDB's flexible schema is a natural fit. Atlas provides a free M0 tier that's sufficient for a portfolio project.

### Why Zod for validation?
Zod validates the request body at runtime AND infers TypeScript types from the schema. This gives us type-safe inputs from a single source of truth — no duplicate type declarations.

## Data Flow

```
User types topic + selects tone/length
  ↓
PromptBuilder.tsx calls api.postGenerate()
  ↓
fetch POST /api/generate (JSON body)
  ↓
generate.ts route validates with Zod
  ↓
geminiService.buildPrompt() constructs structured prompt
  ↓
geminiService.generateTextStream() calls Gemini SDK
  ↓
SSE: each token chunk sent as "data: {...}\n\n"
  ↓
OutputPanel.tsx appends each chunk to Zustand store
  ↓
React re-renders with new text (live typing effect)
  ↓
Stream ends → historyService.saveGeneration() → MongoDB
```

## Security Measures

- **Helmet** sets secure HTTP headers (X-Frame-Options, HSTS, etc.)
- **CORS** restricts requests to the frontend origin only
- **Rate limiting** — 50 req/15min general, 5 generations/min per IP
- **Input validation** — Zod rejects oversized or malformed inputs
- **Environment variables** — API keys never in source code
- **.gitignore** — `.env` files excluded from version control
