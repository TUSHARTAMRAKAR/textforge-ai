import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { generateTextStream, generateText, buildPrompt, buildRefinementPrompt, buildHumanisePrompt } from "../services/geminiService";
import { saveGeneration } from "../services/historyService";
import { generateLimiter } from "../middleware/rateLimiter";
import { createError } from "../middleware/errorHandler";
import { config } from "../config";

const router = Router();

const GenerateSchema = z.object({
  topic:      z.string().min(3).max(500).trim(),
  tone:       z.enum(["formal","casual","creative","academic"]).default("formal"),
  length:     z.enum(["short","medium","long"]).default("medium"),
  language:   z.enum(["en","hi","es","fr","ja","ar","de","zh"]).default("en"),
  keywords:   z.array(z.string().min(1).max(40)).max(10).default([]),
  templateId: z.string().optional(),
});

const RefineSchema = z.object({
  originalText: z.string().min(10),
  instruction:  z.string().min(3).max(200),
  topic:        z.string().min(1).max(500),
  tone:         z.enum(["formal","casual","creative","academic"]).default("formal"),
  length:       z.enum(["short","medium","long"]).default("medium"),
  language:     z.enum(["en","hi","es","fr","ja","ar","de","zh"]).default("en"),
  refinementOf: z.string().optional(),
});

function userIdFromReq(req: Request): string | undefined {
  const h = req.header("x-user-id");
  return h && h.length > 0 ? h : undefined;
}

// POST /api/generate
router.post("/", generateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = GenerateSchema.safeParse(req.body);
    if (!parsed.success) return next(createError(parsed.error.errors[0].message, 400));

    const { topic, tone, length, language, keywords, templateId } = parsed.data;
    const prompt = buildPrompt({ topic, tone, length, language, keywords });
    const fullOutput = await generateTextStream(prompt, res);

    let savedId: string | undefined;
    if (fullOutput) {
      const saved = await saveGeneration({
        topic, tone, length, language, keywords, prompt,
        output:    fullOutput,
        modelName: config.gemini.model,  // ← fixed: was "model"
        userId:    userIdFromReq(req),
        templateId,
      });
      savedId = String(saved._id);
    }

    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ id: savedId, done: true })}\n\n`);
      res.end();
    }
  } catch (error) { next(error); }
});

// POST /api/generate/refine
router.post("/refine", generateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = RefineSchema.safeParse(req.body);
    if (!parsed.success) return next(createError(parsed.error.errors[0].message, 400));

    const { originalText, instruction, topic, tone, length, language, refinementOf } = parsed.data;
    const prompt = buildRefinementPrompt({ originalText, instruction, tone, length });
    const fullOutput = await generateTextStream(prompt, res);

    let savedId: string | undefined;
    if (fullOutput) {
      const saved = await saveGeneration({
        topic: `${topic} (refined: ${instruction})`,
        tone, length, language, prompt,
        output:    fullOutput,
        modelName: config.gemini.model,  // ← fixed: was "model"
        userId:    userIdFromReq(req),
        refinementOf,
      });
      savedId = String(saved._id);
    }

    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ id: savedId, done: true })}\n\n`);
      res.end();
    }
  } catch (error) { next(error); }
});

// GET /api/generate/preview
router.get("/preview", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic = "artificial intelligence", tone = "formal", length = "medium", language = "en" } = req.query;
    const keywords = typeof req.query.keywords === "string"
      ? req.query.keywords.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const prompt = buildPrompt({
      topic: String(topic), tone: tone as any,
      length: length as any, language: language as any, keywords,
    });
    res.json({ success: true, prompt });
  } catch (error) { next(error); }
});

// POST /api/generate/humanise
router.post("/humanise", generateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, tone, topic } = req.body;
    if (!text || text.length < 50) return next(createError("Text too short to humanise", 400));

    const prompt = buildHumanisePrompt({ text, tone: tone || "formal", topic: topic || "general" });

    // Set SSE headers
    res.setHeader("Content-Type",      "text/event-stream");
    res.setHeader("Cache-Control",     "no-cache");
    res.setHeader("Connection",        "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    // Use generateText (non-streaming) to avoid parse errors on rewrites
    const fullOutput = await generateText(prompt);

    if (!fullOutput) {
      res.write(`data: ${JSON.stringify({ error: "Humanise failed", done: true })}

`);
      res.end();
      return;
    }

    // Stream the result in chunks manually for UI compatibility
    const words  = fullOutput.split(" ");
    const chunkSize = 5;
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(" ") + (i + chunkSize < words.length ? " " : "");
      res.write(`data: ${JSON.stringify({ text: chunk, done: false })}

`);
    }

    // Save to MongoDB
    const saved = await saveGeneration({
      topic:     `[HUMANISED] ${topic || "text"}`,
      tone:      tone || "formal",
      length:    "medium",
      language:  "en",
      prompt,
      output:    fullOutput,
      modelName: config.gemini.model,
      userId:    userIdFromReq(req),
    });

    res.write(`data: ${JSON.stringify({ id: String(saved._id), done: true })}

`);
    res.end();

  } catch (error) { next(error); }
});

export default router;
