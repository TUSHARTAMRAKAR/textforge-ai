import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { generateTextStream, buildPrompt } from "../services/geminiService";
import { saveGeneration } from "../services/historyService";
import { generateLimiter } from "../middleware/rateLimiter";
import { createError } from "../middleware/errorHandler";

// ─────────────────────────────────────────────────────────────
//  generate.ts  —  POST /api/generate
//
//  This is the core route. Here's what happens on each request:
//
//  1. Validate the request body with Zod (type-safe input)
//  2. Start streaming Claude's response back via SSE
//  3. Once streaming completes, save the full text to MongoDB
//
//  The client connects as an EventSource and receives
//  each token as it's generated — live "typing" effect.
// ─────────────────────────────────────────────────────────────

const router = Router();

// Zod schema — validates & types the request body at runtime
const GenerateSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(500, "Topic cannot exceed 500 characters")
    .trim(),
  tone: z.enum(["formal", "casual", "creative", "academic"]).default("formal"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
});

// POST /api/generate
router.post(
  "/",
  generateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Step 1: Validate input
      const parsed = GenerateSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(
          createError(parsed.error.errors[0].message, 400)
        );
      }

      const { topic, tone, length } = parsed.data;

      // Step 2: Build the prompt (for saving to DB later)
      const prompt = buildPrompt({ topic, tone, length });

      // Step 3: Stream Claude's response + capture full text
      // generateTextStream sets SSE headers and writes to res
      const fullOutput = await generateTextStream(
        { topic, tone, length },
        res
      );

      // Step 4: Save to MongoDB after streaming completes
      // (We do this after because we need the full text)
      if (fullOutput) {
        await saveGeneration({
          topic,
          tone,
          length,
          prompt,
          output: fullOutput,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/generate/preview — returns just the prompt (no Claude call)
// Useful for showing users what prompt will be sent
router.get(
  "/preview",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic = "artificial intelligence", tone = "formal", length = "medium" } = req.query;

      const prompt = buildPrompt({
        topic: String(topic),
        tone: tone as "formal" | "casual" | "creative" | "academic",
        length: length as "short" | "medium" | "long",
      });

      res.json({ success: true, prompt });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
