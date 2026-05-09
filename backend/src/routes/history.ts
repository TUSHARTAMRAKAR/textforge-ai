import { Router, Request, Response, NextFunction } from "express";
import {
  getHistory,
  getGenerationById,
  deleteGeneration,
  clearAllHistory,
  toggleFavourite,
  setShareStatus,
  type ListFilters,
} from "../services/historyService";
import { createError } from "../middleware/errorHandler";
import type { Tone, Language } from "../models/Generation";

// ─────────────────────────────────────────────────────────────
//  history.ts  —  /api/history routes
//
//  GET    /api/history                       paginated + filtered list
//  GET    /api/history/:id                   single generation by ID
//  DELETE /api/history/:id                   delete one generation
//  DELETE /api/history                       clear all history
//  PATCH  /api/history/:id/favourite         toggle favourite flag
//  PATCH  /api/history/:id/share             set isShared flag
// ─────────────────────────────────────────────────────────────

const router = Router();

function userIdFromReq(req: Request): string | undefined {
  const header = req.header("x-user-id");
  return header && header.length > 0 ? header : undefined;
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: ListFilters = {
      page: parseInt(String(req.query.page || "1"), 10),
      limit: parseInt(String(req.query.limit || "10"), 10),
      userId: userIdFromReq(req),
      favouritesOnly: req.query.favouritesOnly === "true",
    };
    if (typeof req.query.tone === "string") filters.tone = req.query.tone as Tone;
    if (typeof req.query.language === "string") filters.language = req.query.language as Language;
    if (typeof req.query.search === "string") filters.search = req.query.search;

    const result = await getHistory(filters);

    res.json({
      success: true,
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const generation = await getGenerationById(req.params.id, userIdFromReq(req));
    if (!generation) return next(createError("Generation not found", 404));
    res.json({ success: true, data: generation });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:id/favourite",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await toggleFavourite(req.params.id, userIdFromReq(req));
      if (!updated) return next(createError("Generation not found", 404));
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id/share",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isShared = req.body?.isShared !== false;
      const updated = await setShareStatus(req.params.id, isShared, userIdFromReq(req));
      if (!updated) return next(createError("Generation not found", 404));
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await deleteGeneration(req.params.id, userIdFromReq(req));
      if (!deleted) return next(createError("Generation not found", 404));
      res.json({ success: true, message: "Generation deleted" });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await clearAllHistory(userIdFromReq(req));
    res.json({ success: true, message: `Cleared ${count} generation(s)` });
  } catch (error) {
    next(error);
  }
});

export default router;
