import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { fetchCitations, formatCitations, buildCitedPrompt, CitationStyle } from "../services/citationService";
import { generateText } from "../services/geminiService";
import { saveGeneration } from "../services/historyService";
import { generateLimiter } from "../middleware/rateLimiter";
import { createError } from "../middleware/errorHandler";
import { config } from "../config";

const router = Router();

const CitationSchema = z.object({
  topic:         z.string().min(3).max(500).trim(),
  tone:          z.enum(["formal","casual","creative","academic"]).default("academic"),
  length:        z.enum(["short","medium","long"]).default("medium"),
  language:      z.string().default("en"),
  style:         z.enum(["apa","mla","ieee"]).default("apa"),
  citationCount: z.number().min(3).max(8).default(5),
});

function userIdFromReq(req: Request): string | undefined {
  const h = req.header("x-user-id");
  return h && h.length > 0 ? h : undefined;
}

// GET /api/citations/search
router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic, count = "5" } = req.query;
    if (!topic || typeof topic !== "string") return next(createError("Topic required", 400));
    const citations = await fetchCitations(topic, parseInt(count as string));
    res.json({ success: true, data: citations, count: citations.length });
  } catch (error) { next(error); }
});

// POST /api/citations/generate
router.post("/generate", generateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = CitationSchema.safeParse(req.body);
    if (!parsed.success) return next(createError(parsed.error.errors[0].message, 400));

    const { topic, tone, length, language, style, citationCount } = parsed.data;

    // Step 1: Fetch real citations
    const citations = await fetchCitations(topic, citationCount);
    if (citations.length === 0) {
      return next(createError("Could not find academic sources for this topic. Try a more specific academic topic.", 404));
    }

    // Step 2: Format citations
    const formatted = formatCitations(citations, style as CitationStyle);

    // Step 3: Build prompt
    const prompt = buildCitedPrompt(topic, tone, length, language, formatted, style as CitationStyle);

    // Step 4: Set SSE headers ONCE
    res.setHeader("Content-Type",      "text/event-stream");
    res.setHeader("Cache-Control",     "no-cache");
    res.setHeader("Connection",        "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    // Step 5: Send citations metadata to frontend immediately
    res.write(`data: ${JSON.stringify({ citations: formatted, type: "citations" })}\n\n`);

    // Step 6: Generate with Gemini (non-streaming to avoid header conflicts)
    const fullText = await generateText(prompt);

    if (!fullText) {
      res.write(`data: ${JSON.stringify({ error: "Generation failed", done: true })}\n\n`);
      res.end();
      return;
    }

    // Step 7: Manually stream in word chunks for smooth UI
    const words = fullText.split(" ");
    for (let i = 0; i < words.length; i += 8) {
      const chunk = words.slice(i, i + 8).join(" ") + (i + 8 < words.length ? " " : "");
      res.write(`data: ${JSON.stringify({ text: chunk, done: false })}\n\n`);
    }

    // Step 8: Save to MongoDB with full citation metadata
    let savedId: string | undefined;
    const saved = await saveGeneration({
      topic:         `[CITED] ${topic}`,
      tone,
      length,
      language,
      prompt,
      output:        fullText,
      modelName:     config.gemini.model,
      userId:        userIdFromReq(req),
      templateId:    `citation_${style}`,
      citations:     formatted,           // Save full citation objects
      citationStyle: style,               // Save which style was used
      citationCount: formatted.length,    // Save count for badge display
    });
    savedId = String(saved._id);

    // Step 9: Send done event
    res.write(`data: ${JSON.stringify({ id: savedId, done: true })}\n\n`);
    res.end();

  } catch (error: any) {
    if (!res.headersSent) {
      next(error);
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || "Generation failed", done: true })}\n\n`);
      res.end();
    }
  }
});

export default router;
