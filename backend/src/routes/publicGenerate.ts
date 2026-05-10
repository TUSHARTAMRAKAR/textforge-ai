import { Router, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { buildPrompt, generateText } from "../services/geminiService";
import { saveGeneration } from "../services/historyService";
import { createError } from "../middleware/errorHandler";
import { config } from "../config";

const router = Router();

const publicLimiter = rateLimit({
  windowMs: 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false,
  keyGenerator: (req: Request) => (req as any).apiKeyId || req.ip || "unknown",
  message: { success: false, message: "Rate limit reached." },
});

const PublicGenerateSchema = z.object({
  topic:    z.string().min(3).max(500).trim(),  // ← required, not optional
  tone:     z.enum(["formal","casual","creative","academic"]).default("formal"),
  length:   z.enum(["short","medium","long"]).default("medium"),
  language: z.enum(["en","hi","es","fr","ja","ar","de","zh"]).default("en"),
  keywords: z.array(z.string().min(1).max(40)).max(10).default([]),
});

router.post("/", publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = PublicGenerateSchema.safeParse(req.body);
    if (!parsed.success) return next(createError(parsed.error.errors[0].message, 400));

    const { topic, tone, length, language, keywords } = parsed.data;
    const prompt = buildPrompt({ topic, tone, length, language, keywords }); // ← explicit args
    const output = await generateText(prompt);

    const saved = await saveGeneration({
      topic, tone, length, language, keywords,
      prompt, output,
      modelName: config.gemini.model,   // ← fixed: was "model"
      userId:    (req as any).apiUserId,
    });

    res.json({
      success: true,
      data: {
        id:        saved._id,
        output,
        wordCount: (saved as any).wordCount,
        modelName: (saved as any).modelName,
        createdAt: (saved as any).createdAt,
      },
    });
  } catch (error) { next(error); }
});

export default router;
