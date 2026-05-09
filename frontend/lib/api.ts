import axios from "axios";

// ─────────────────────────────────────────────────────────────
//  api.ts  —  All backend API calls live here.
//  Components never call fetch/axios directly — they use this.
//  This keeps API logic centralised and easy to update.
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export interface GenerateOptions {
  topic: string;
  tone: "formal" | "casual" | "creative" | "academic";
  length: "short" | "medium" | "long";
}

export interface Generation {
  _id: string;
  topic: string;
  tone: string;
  length: string;
  output: string;
  wordCount: number;
  model: string;
  createdAt: string;
}

export interface HistoryResponse {
  data: Generation[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const api = {
  // Streaming generate — returns an EventSource
  // The component listens for SSE events and appends chunks to state
  streamGenerate(options: GenerateOptions): EventSource {
    const params = new URLSearchParams({
      topic:  options.topic,
      tone:   options.tone,
      length: options.length,
    });
    // POST via fetch is handled separately; SSE uses GET-like EventSource
    // We trigger a POST via fetch and listen via the response body stream
    return new EventSource(`${BASE_URL}/api/generate?${params}`);
  },

  // POST generate — used for actual streaming via fetch (ReadableStream)
  async postGenerate(
    options: GenerateOptions,
    onChunk: (text: string) => void,
    onDone:  () => void,
    onError: (err: string) => void
  ): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/generate`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(options),
    });

    if (!response.ok) {
      const err = await response.json();
      onError(err.message || "Generation failed");
      return;
    }

    // Read the SSE stream using the Streams API
    const reader  = response.body!.getReader();
    const decoder = new TextDecoder();
    let   buffer  = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE messages are separated by double newlines
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";  // Keep incomplete chunk in buffer

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const payload = JSON.parse(line.slice(6));
          if (payload.error) { onError(payload.error); return; }
          if (payload.done)  { onDone(); return; }
          if (payload.text)  { onChunk(payload.text); }
        } catch { /* ignore malformed lines */ }
      }
    }

    onDone();
  },

  // History endpoints
  async getHistory(page = 1, limit = 10): Promise<HistoryResponse> {
    const res = await client.get(`/api/history?page=${page}&limit=${limit}`);
    return res.data;
  },

  async deleteGeneration(id: string): Promise<void> {
    await client.delete(`/api/history/${id}`);
  },

  async clearAllHistory(): Promise<void> {
    await client.delete("/api/history");
  },
};
