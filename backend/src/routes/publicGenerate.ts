import { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { buildPrompt, generateText } from "../services/geminiService";
import { saveGeneration } from "../services/historyService";
import { createError } from "../middleware/errorHandler";
import { config } from "../config";

// ─────────────────────────────────────────────────────────────
//  publicGenerate.ts  —  POST /v1/generate
//
//  Public, API-key-authenticated endpoint for third-party use.
//  Returns the full generation as JSON (no SSE streaming) so
//  it works cleanly from any HTTP client.
// ─────────────────────────────────────────────────────────────

const router = Router();

// Per-key limit — keyed off the apiKeyId attached by apiKeyAuth
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.apiKeyId || req.ip || "unknown",
  message: { success: false, message: "API key rate limit reached. Please slow down." },
});

const PublicGenerateSchema = z.object({
  topic: z.string().min(3).max(500).trim(),
  tone: z.enum(["formal", "casual", "creative", "academic"]).default("formal"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  language: z.enum(["en", "hi", "es", "fr", "ja", "ar", "de", "zh"]).default("en"),
  keywords: z.array(z.string().min(1).max(40)).max(10).default([]),
});

router.post(
  "/",
  publicLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = PublicGenerateSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(createError(parsed.error.errors[0].message, 400));
      }

      const prompt = buildPrompt(parsed.data);
      const output = await generateText(prompt);

      const saved = await saveGeneration({
        ...parsed.data,
        prompt,
        output,
        model: config.gemini.model,
        userId: req.apiUserId,
      });

      res.json({
        success: true,
        data: {
          id: saved._id,
          output,
          wordCount: saved.wordCount,
          model: saved.model,
          createdAt: saved.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
