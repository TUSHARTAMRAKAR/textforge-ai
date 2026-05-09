import { Router, Request, Response, NextFunction } from "express";
import { getSharedGenerationById } from "../services/historyService";
import { createError } from "../middleware/errorHandler";

// ─────────────────────────────────────────────────────────────
//  share.ts  —  /api/share/:id
//
//  Public, unauthenticated read-only endpoint that powers
//  shareable generation links. Owners can disable sharing
//  on a generation via PATCH /api/history/:id/share.
// ─────────────────────────────────────────────────────────────

const router = Router();

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gen = await getSharedGenerationById(req.params.id);
    if (!gen) return next(createError("Generation not found or sharing disabled", 404));
    res.json({
      success: true,
      data: {
        _id: gen._id,
        topic: gen.topic,
        tone: gen.tone,
        length: gen.length,
        language: gen.language,
        keywords: gen.keywords,
        output: gen.output,
        wordCount: gen.wordCount,
        model: gen.model,
        createdAt: gen.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
