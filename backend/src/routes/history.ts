import { Router, Request, Response, NextFunction } from "express";
import {
  getHistory,
  getGenerationById,
  deleteGeneration,
  clearAllHistory,
} from "../services/historyService";
import { createError } from "../middleware/errorHandler";

// ─────────────────────────────────────────────────────────────
//  history.ts  —  /api/history routes
//
//  GET    /api/history            — paginated list of generations
//  GET    /api/history/:id        — single generation by ID
//  DELETE /api/history/:id        — delete one generation
//  DELETE /api/history            — clear all history
// ─────────────────────────────────────────────────────────────

const router = Router();

// GET /api/history?page=1&limit=10
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
    const limit = Math.min(50, parseInt(String(req.query.limit || "10"), 10));

    const result = await getHistory(page, limit);

    res.json({
      success: true,
      data: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/history/:id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const generation = await getGenerationById(req.params.id);
    if (!generation) {
      return next(createError("Generation not found", 404));
    }
    res.json({ success: true, data: generation });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/history/:id
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await deleteGeneration(req.params.id);
      if (!deleted) {
        return next(createError("Generation not found", 404));
      }
      res.json({ success: true, message: "Generation deleted" });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/history  (clear all)
router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await clearAllHistory();
    res.json({
      success: true,
      message: `Cleared ${count} generation(s)`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
