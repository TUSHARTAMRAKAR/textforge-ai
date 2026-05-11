import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { buildVernacularPrompt, generateTextStream } from "../services/geminiService";
import { saveGeneration } from "../services/historyService";
import { generateLimiter } from "../middleware/rateLimiter";
import { createError } from "../middleware/errorHandler";
import { config } from "../config";

const router = Router();

const VernacularSchema = z.object({
  topic:    z.string().min(3).max(500).trim(),
  language: z.enum(["hi", "mr", "ta", "te", "bn", "gu"]),
  tone:     z.enum(["formal", "casual", "creative", "academic"]).default("casual"),
  length:   z.enum(["short", "medium", "long"]).default("medium"),
  context:  z.enum(["general", "education", "business", "news", "social"]).default("general"),
  region:   z.string().optional(),
});

function userIdFromReq(req: Request): string | undefined {
  const h = req.header("x-user-id");
  return h && h.length > 0 ? h : undefined;
}

// POST /api/vernacular/generate
router.post("/generate", generateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = VernacularSchema.safeParse(req.body);
    if (!parsed.success) return next(createError(parsed.error.errors[0].message, 400));

    const { topic, language, tone, length, context, region } = parsed.data;
    const prompt = buildVernacularPrompt({ topic, language, tone, length, context, region });

    const fullOutput = await generateTextStream(prompt, res);

    if (fullOutput) {
      const saved = await saveGeneration({
        topic:      `[${language.toUpperCase()}] ${topic}`,
        tone,
        length,
        language,
        prompt,
        output:     fullOutput,
        modelName:  config.gemini.model,
        userId:     userIdFromReq(req),
        templateId: `vernacular_${language}`,
      });

      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ id: String(saved._id), done: true })}\n\n`);
        res.end();
      }
    }
  } catch (error) { next(error); }
});

export default router;
