import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { Response } from "express";
import type { Tone, Length, Language } from "../models/Generation";

// ─────────────────────────────────────────────────────────────
//  geminiService.ts  —  The AI Brain of TextForge
//
//  Powered by Google Gemini 2.5 Flash (free tier, no card).
//
//  Exports:
//  1. buildPrompt()           Crafts a rich prompt from inputs
//  2. buildRefinementPrompt() Crafts a refinement prompt
//  3. generateTextStream()    Streams tokens via SSE (live UI)
//  4. generateText()          Single-shot generation (internal)
// ─────────────────────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const LENGTH_MAP: Record<Length, { words: number; description: string }> = {
  short:  { words: 150, description: "concise (around 150 words)" },
  medium: { words: 350, description: "detailed (around 350 words)" },
  long:   { words: 700, description: "comprehensive (around 700 words)" },
};

const TONE_MAP: Record<Tone, string> = {
  formal:   "Use professional, authoritative language. Avoid contractions and colloquialisms.",
  casual:   "Use conversational, friendly language. Contractions and informal phrasing are welcome.",
  creative: "Use vivid, imaginative language. Employ metaphors, varied sentence structure, and expressive vocabulary.",
  academic: "Use scholarly language with precise terminology. Maintain an objective, evidence-based tone.",
};

const LANGUAGE_MAP: Record<Language, string> = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  es: "Spanish",
  fr: "French",
  ja: "Japanese",
  ar: "Arabic",
  de: "German",
  zh: "Mandarin Chinese (Simplified)",
};

export interface GenerateOptions {
  topic: string;
  tone: Tone;
  length: Length;
  language?: Language;
  keywords?: string[];
}

export interface RefineOptions {
  originalText: string;
  instruction: string;
  tone?: Tone;
  length?: Length;
}

// ── 1. Prompt Builder ────────────────────────────────────────
// Good prompt engineering = dramatically better output quality.
// Converts user's simple inputs into a rich, structured prompt.
export function buildPrompt(options: GenerateOptions): string {
  const { topic, tone, length } = options;
  const language = options.language ?? "en";
  const keywords = (options.keywords ?? []).map((k) => k.trim()).filter(Boolean);

  const lengthConfig = LENGTH_MAP[length];
  const toneGuide    = TONE_MAP[tone];
  const langName     = LANGUAGE_MAP[language];

  const keywordBlock = keywords.length
    ? `\n- SEO Keywords: Weave these terms naturally into the text without keyword-stuffing — ${keywords.join(", ")}`
    : "";

  return `You are TextForge AI, an expert writer capable of producing high-quality, coherent text on any topic.

Your task is to write a well-structured piece of text about the following topic:

TOPIC: ${topic}

WRITING GUIDELINES:
- Tone: ${toneGuide}
- Length: Be ${lengthConfig.description}
- Language: Write the entire response in ${langName}${keywordBlock}
- Structure: Begin with a strong opening sentence, develop the topic with supporting details, and close with a meaningful conclusion
- Quality: Ensure the text flows naturally and reads as if written by a knowledgeable human expert
- Do NOT include a title, heading, or any preamble — output only the generated text itself

Write the text now:`;
}

// ── 2. Refinement Prompt Builder ─────────────────────────────
// Used by the Regenerate/Refine feature — takes existing text
// and an instruction (e.g. "make it shorter") and returns a
// prompt that asks Gemini to rewrite accordingly.
export function buildRefinementPrompt(options: RefineOptions): string {
  const { originalText, instruction } = options;

  return `You are TextForge AI. The user previously generated the text below and wants you to refine it.

REFINEMENT INSTRUCTION: ${instruction}

ORIGINAL TEXT:
"""
${originalText}
"""

Rewrite the text following the refinement instruction above. Keep the core meaning and topic intact unless the instruction explicitly says otherwise. Output ONLY the refined text — no preamble, no explanation, no quotes.

Refined text:`;
}

// ── 3. Streaming Generator ───────────────────────────────────
// Sends tokens to the frontend one chunk at a time using
// Server-Sent Events (SSE). The caller is responsible for
// calling res.end() — this lets the route emit a final "id"
// event after saving the generation to MongoDB.
export async function generateTextStream(
  prompt: string,
  res: Response
): Promise<string> {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  let fullText = "";

  try {
    const model = genAI.getGenerativeModel({ model: config.gemini.model });
    const streamResult = await model.generateContentStream(prompt);

    for await (const chunk of streamResult.stream) {
      const text = chunk.text();
      if (text) {
        fullText += text;
        res.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
      }
    }

    return fullText;
  } catch (error: any) {
    const message = error?.message || "Generation failed";
    res.write(`data: ${JSON.stringify({ error: message, done: true })}\n\n`);
    res.end();
    throw error;
  }
}

// ── 4. Non-streaming Generator ───────────────────────────────
export async function generateText(prompt: string): Promise<string> {
  const model  = genAI.getGenerativeModel({ model: config.gemini.model });
  const result  = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
