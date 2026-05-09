import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  generateTextStream,
  buildPrompt,
  buildRefinementPrompt,
} from "../services/geminiService";
import { saveGeneration } from "../services/historyService";
import { generateLimiter } from "../middleware/rateLimiter";
import { createError } from "../middleware/errorHandler";
import { config } from "../config";

// ─────────────────────────────────────────────────────────────
//  generate.ts  —  POST /api/generate, /api/generate/refine
//
//  /api/generate ........ topic + tone + length + language + keywords
//  /api/generate/refine . regenerate existing text with instruction
//  /api/generate/preview  return engineered prompt only (debug)
// ─────────────────────────────────────────────────────────────

const router = Router();

const GenerateSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(500, "Topic cannot exceed 500 characters")
    .trim(),
  tone: z.enum(["formal", "casual", "creative", "academic"]).default("formal"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  language: z.enum(["en", "hi", "es", "fr", "ja", "ar", "de", "zh"]).default("en"),
  keywords: z.array(z.string().min(1).max(40)).max(10).default([]),
  templateId: z.string().optional(),
});

const RefineSchema = z.object({
  originalText: z.string().min(10, "Original text must be at least 10 characters"),
  instruction: z.string().min(3).max(200),
  topic: z.string().min(1).max(500),
  tone: z.enum(["formal", "casual", "creative", "academic"]).default("formal"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  language: z.enum(["en", "hi", "es", "fr", "ja", "ar", "de", "zh"]).default("en"),
  refinementOf: z.string().optional(),
});

function userIdFromReq(req: Request): string | undefined {
  const header = req.header("x-user-id");
  return header && header.length > 0 ? header : undefined;
}

router.post(
  "/",
  generateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = GenerateSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(createError(parsed.error.errors[0].message, 400));
      }

      const { topic, tone, length, language, keywords, templateId } = parsed.data;
      const prompt = buildPrompt({ topic, tone, length, language, keywords });

      const fullOutput = await generateTextStream(prompt, res);

      let savedId: string | undefined;
      if (fullOutput) {
        const saved = await saveGeneration({
          topic,
          tone,
          length,
          language,
          keywords,
          prompt,
          output: fullOutput,
          model: config.gemini.model,
          userId: userIdFromReq(req),
          templateId,
        });
        savedId = String(saved._id);
      }

      res.write(`data: ${JSON.stringify({ id: savedId, done: true })}\n\n`);
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/refine",
  generateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = RefineSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(createError(parsed.error.errors[0].message, 400));
      }

      const { originalText, instruction, topic, tone, length, language, refinementOf } = parsed.data;

      const prompt = buildRefinementPrompt({ originalText, instruction, tone, length });
      const fullOutput = await generateTextStream(prompt, res);

      let savedId: string | undefined;
      if (fullOutput) {
        const saved = await saveGeneration({
          topic: `${topic} (refined: ${instruction})`,
          tone,
          length,
          language,
          prompt,
          output: fullOutput,
          model: config.gemini.model,
          userId: userIdFromReq(req),
          refinementOf,
        });
        savedId = String(saved._id);
      }

      res.write(`data: ${JSON.stringify({ id: savedId, done: true })}\n\n`);
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/preview",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        topic = "artificial intelligence",
        tone = "formal",
        length = "medium",
        language = "en",
      } = req.query;
      const keywords = typeof req.query.keywords === "string"
        ? req.query.keywords.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const prompt = buildPrompt({
        topic: String(topic),
        tone: tone as any,
        length: length as any,
        language: language as any,
        keywords,
      });

      res.json({ success: true, prompt });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
