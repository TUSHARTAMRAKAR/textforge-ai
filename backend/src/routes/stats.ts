import { Router, Request, Response, NextFunction } from "express";
import { getStats } from "../services/historyService";

// ─────────────────────────────────────────────────────────────
//  stats.ts  —  GET /api/stats
//
//  Returns aggregated counts that power the Stats Dashboard
//  page on the frontend. Honours x-user-id for per-user stats
//  when authentication is enabled.
// ─────────────────────────────────────────────────────────────

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.header("x-user-id") || undefined;
    const stats = await getStats(userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

export default router;
