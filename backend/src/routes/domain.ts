import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { buildDomainPrompt, generateTextStream } from "../services/geminiService";
import { saveGeneration } from "../services/historyService";
import { generateLimiter } from "../middleware/rateLimiter";
import { createError } from "../middleware/errorHandler";
import { config } from "../config";

const router = Router();

const DomainGenerateSchema = z.object({
  domain:     z.enum(["legal", "medical", "startup", "research", "grant", "hr"]),
  outputType: z.string().min(1).max(50),
  fields:     z.record(z.string(), z.string()),
});

function userIdFromReq(req: Request): string | undefined {
  const h = req.header("x-user-id");
  return h && h.length > 0 ? h : undefined;
}

// POST /api/domain/generate
router.post("/generate", generateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = DomainGenerateSchema.safeParse(req.body);
    if (!parsed.success) return next(createError(parsed.error.errors[0].message, 400));

    const { domain, outputType, fields } = parsed.data;

    // Build the deep domain prompt
    const prompt = buildDomainPrompt({ domain, outputType, fields });

    // Stream the response
    const fullOutput = await generateTextStream(prompt, res);

    // Save to MongoDB with domain metadata
    let savedId: string | undefined;
    if (fullOutput) {
      const topic = fields.companyName || fields.party1Name || fields.chiefComplaint || `${domain} document`;
      const saved = await saveGeneration({
        topic:      `[${domain.toUpperCase()}] ${topic}`,
        tone:       "formal",
        length:     "long",
        language:   "en",
        prompt,
        output:     fullOutput,
        modelName:  config.gemini.model,
        userId:     userIdFromReq(req),
        templateId: `domain_${domain}_${outputType}`,
      });
      savedId = String(saved._id);
    }

    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ id: savedId, done: true })}\n\n`);
      res.end();
    }
  } catch (error) { next(error); }
});

export default router;
