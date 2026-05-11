import axios from "axios";

// ─────────────────────────────────────────────────────────────
//  api.ts — All backend API calls live here.
//  Components never call fetch/axios directly — they use this.
//  This keeps API logic centralised and easy to update.
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Inject the signed-in user id (from NextAuth) into every request
// so the backend can scope history/favourites/stats per user.
let currentUserId: string | null = null;
export function setApiUserId(id: string | null) {
  currentUserId = id;
}
client.interceptors.request.use((cfg) => {
  if (currentUserId) cfg.headers["x-user-id"] = currentUserId;
  return cfg;
});

export type Tone = "formal" | "casual" | "creative" | "academic";
export type Length = "short" | "medium" | "long";
export type Language = "en" | "hi" | "es" | "fr" | "ja" | "ar" | "de" | "zh";

export interface GenerateOptions {
  topic: string;
  tone: Tone;
  length: Length;
  language?: Language;
  keywords?: string[];
  templateId?: string;
}

export interface RefineOptions {
  originalText: string;
  instruction: string;
  topic: string;
  tone: Tone;
  length: Length;
  language?: Language;
  refinementOf?: string;
}

export interface Generation {
  _id: string;
  topic: string;
  tone: Tone;
  length: Length;
  language?: Language;
  keywords?: string[];
  output: string;
  wordCount: number;
  model: string;
  isFavourite?: boolean;
  isShared?: boolean;
  createdAt: string;
  citationCount?: number;   // Set for cited generations
  citationStyle?: string;   // "apa" | "mla" | "ieee"
}

export interface HistoryFilters {
  page?: number;
  limit?: number;
  tone?: Tone;
  language?: Language;
  search?: string;
  favouritesOnly?: boolean;
}

export interface HistoryResponse {
  data: Generation[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface StatsData {
  totalGenerations: number;
  totalWords: number;
  favouritesCount: number;
  byTone: { _id: string; count: number }[];
  byLanguage: { _id: string; count: number }[];
  last30Days: { _id: string; count: number; words: number }[];
}

async function streamSSE(
  url: string,
  body: unknown,
  onChunk: (text: string) => void,
  onDone: (savedId?: string) => void,
  onError: (err: string) => void
): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (currentUserId) headers["x-user-id"] = currentUserId;

  const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });

  if (!response.ok) {
    try {
      const err = await response.json();
      onError(err.message || "Generation failed");
    } catch {
      onError(`Request failed (${response.status})`);
    }
    return;
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let savedId: string | undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const payload = JSON.parse(line.slice(6));
        if (payload.error) { onError(payload.error); return; }
        if (payload.id)    { savedId = payload.id; }
        if (payload.done)  { onDone(savedId); return; }
        if (payload.text)  { onChunk(payload.text); }
      } catch {
        /* ignore malformed lines */
      }
    }
  }

  onDone(savedId);
}

export const api = {
  async postGenerate(
    options: GenerateOptions,
    onChunk: (text: string) => void,
    onDone: (savedId?: string) => void,
    onError: (err: string) => void
  ): Promise<void> {
    return streamSSE(`${BASE_URL}/api/generate`, options, onChunk, onDone, onError);
  },

  async postRefine(
    options: RefineOptions,
    onChunk: (text: string) => void,
    onDone: (savedId?: string) => void,
    onError: (err: string) => void
  ): Promise<void> {
    return streamSSE(`${BASE_URL}/api/generate/refine`, options, onChunk, onDone, onError);
  },

  // Humanise text — reduce AI detection score
  async postHumanise(
    options: { text: string; tone: string; topic: string },
    onChunk: (text: string) => void,
    onDone: (savedId?: string) => void,
    onError: (err: string) => void
  ): Promise<void> {
    return streamSSE(`${BASE_URL}/api/generate/humanise`, options, onChunk, onDone, onError);
  },

  // Deep Domain Template generation
  async postDomainGenerate(
    options: { domain: string; outputType: string; fields: Record<string, string> },
    onChunk: (text: string) => void,
    onDone: (savedId?: string) => void,
    onError: (err: string) => void
  ): Promise<void> {
    return streamSSE(`${BASE_URL}/api/domain/generate`, options, onChunk, onDone, onError);
  },

  async getHistory(filters: HistoryFilters = {}): Promise<HistoryResponse> {
    const qs = new URLSearchParams();
    qs.set("page", String(filters.page ?? 1));
    qs.set("limit", String(filters.limit ?? 10));
    if (filters.tone) qs.set("tone", filters.tone);
    if (filters.language) qs.set("language", filters.language);
    if (filters.search) qs.set("search", filters.search);
    if (filters.favouritesOnly) qs.set("favouritesOnly", "true");
    const res = await client.get(`/api/history?${qs.toString()}`);
    return res.data;
  },

  async deleteGeneration(id: string): Promise<void> {
    await client.delete(`/api/history/${id}`);
  },

  async clearAllHistory(): Promise<void> {
    await client.delete("/api/history");
  },

  async toggleFavourite(id: string): Promise<Generation> {
    const res = await client.patch(`/api/history/${id}/favourite`);
    return res.data.data;
  },

  async setShared(id: string, isShared: boolean): Promise<Generation> {
    const res = await client.patch(`/api/history/${id}/share`, { isShared });
    return res.data.data;
  },

  async getShared(id: string): Promise<Generation> {
    const res = await client.get(`/api/share/${id}`);
    return res.data.data;
  },

  async getStats(): Promise<StatsData> {
    const res = await client.get(`/api/stats`);
    return res.data.data;
  },

  // ── API key management (Public API Mode) ────────────────────
  async listApiKeys(): Promise<{ _id: string; name: string; key: string; lastUsed?: string; requestCount: number; isRevoked: boolean; createdAt: string }[]> {
    const res = await client.get(`/api/keys`);
    return res.data.data;
  },

  async createApiKey(name: string): Promise<{ _id: string; name: string; key: string; createdAt: string }> {
    const res = await client.post(`/api/keys`, { name });
    return res.data.data;
  },

  async revokeApiKey(id: string): Promise<void> {
    await client.delete(`/api/keys/${id}`);
  },
};
