import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { Response } from "express";

// ─────────────────────────────────────────────────────────────
//  geminiService.ts  —  The AI Brain of TextForge
//
//  Powered by Google Gemini 2.0 Flash (100% free, no card).
//
//  Three exports:
//  1. buildPrompt()          — Crafts a rich prompt from inputs
//  2. generateTextStream()   — Streams tokens via SSE (live UI)
//  3. generateText()         — Single-shot generation (internal)
// ─────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// Target word counts per length setting
const LENGTH_MAP = {
  short:  { words: 150, description: "concise (around 150 words)" },
  medium: { words: 350, description: "detailed (around 350 words)" },
  long:   { words: 700, description: "comprehensive (around 700 words)" },
};

// Writing style guidance per tone setting
const TONE_MAP = {
  formal:   "Use professional, authoritative language. Avoid contractions and colloquialisms.",
  casual:   "Use conversational, friendly language. Contractions and informal phrasing are welcome.",
  creative: "Use vivid, imaginative language. Employ metaphors, varied sentence structure, and expressive vocabulary.",
  academic: "Use scholarly language with precise terminology. Maintain an objective, evidence-based tone.",
};

export interface GenerateOptions {
  topic: string;
  tone: "formal" | "casual" | "creative" | "academic";
  length: "short" | "medium" | "long";
}

// ── 1. Prompt Builder ────────────────────────────────────────
// Good prompt engineering = dramatically better output quality.
// This converts user's simple inputs into a rich, structured prompt.
export function buildPrompt(options: GenerateOptions): string {
  const { topic, tone, length } = options;
  const lengthConfig = LENGTH_MAP[length];
  const toneGuide    = TONE_MAP[tone];

  return `You are TextForge AI, an expert writer capable of producing high-quality, coherent text on any topic.

Your task is to write a well-structured piece of text about the following topic:

TOPIC: ${topic}

WRITING GUIDELINES:
- Tone: ${toneGuide}
- Length: Be ${lengthConfig.description}
- Structure: Begin with a strong opening sentence, develop the topic with supporting details, and close with a meaningful conclusion
- Quality: Ensure the text flows naturally and reads as if written by a knowledgeable human expert
- Do NOT include a title, heading, or any preamble — output only the generated text itself

Write the text now:`;
}

// ── 2. Streaming Generator ───────────────────────────────────
// Sends tokens to the frontend one chunk at a time using
// Server-Sent Events (SSE) — gives the live "typing" effect.
// Also returns the full accumulated text for saving to MongoDB.
export async function generateTextStream(
  options: GenerateOptions,
  res: Response
): Promise<string> {
  const prompt = buildPrompt(options);

  // SSE headers — tells browser: keep this connection alive
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

  let fullText = "";

  try {
    const model = genAI.getGenerativeModel({ model: config.gemini.model });

    // generateContentStream returns an async iterable of chunks
    const streamResult = await model.generateContentStream(prompt);

    for await (const chunk of streamResult.stream) {
      const text = chunk.text();
      if (text) {
        fullText += text;
        // SSE format: each message is "data: <json>\n\n"
        res.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
      }
    }

    // Final event tells the frontend generation is complete
    res.write(`data: ${JSON.stringify({ text: "", done: true })}\n\n`);
    res.end();

    return fullText;
  } catch (error: any) {
    const message = error?.message || "Generation failed";
    res.write(`data: ${JSON.stringify({ error: message, done: true })}\n\n`);
    res.end();
    throw error;
  }
}

// ── 3. Non-streaming Generator ───────────────────────────────
// Used internally when we just need the text without streaming
// (e.g. for testing or batch operations).
export async function generateText(options: GenerateOptions): Promise<string> {
  const prompt = buildPrompt(options);
  const model  = genAI.getGenerativeModel({ model: config.gemini.model });

  const result  = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
