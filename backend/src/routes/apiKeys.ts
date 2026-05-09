import { Router, Request, Response, NextFunction } from "express";
import { ApiKey, generateApiKey } from "../models/ApiKey";
import { createError } from "../middleware/errorHandler";

// ─────────────────────────────────────────────────────────────
//  apiKeys.ts  —  /api/keys
//
//  Authenticated users manage their own API keys here.
//  Frontend `/api-keys` dashboard talks to these endpoints.
// ─────────────────────────────────────────────────────────────

const router = Router();

function requireUserId(req: Request, res: Response): string | null {
  const userId = req.header("x-user-id");
  if (!userId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return null;
  }
  return userId;
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const keys = await ApiKey.find({ userId }).sort({ createdAt: -1 }).lean();
    // Mask key bodies so the dashboard never re-exposes the full key after creation
    const masked = keys.map((k) => ({
      ...k,
      key: `${k.key.slice(0, 12)}…${k.key.slice(-4)}`,
    }));
    res.json({ success: true, data: masked });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const name = String(req.body?.name || "Untitled key").trim().slice(0, 60);
    const key = generateApiKey();
    const created = await ApiKey.create({ userId, key, name });
    res.json({
      success: true,
      data: {
        _id: created._id,
        name: created.name,
        key: created.key,
        createdAt: created.createdAt,
      },
      message: "Save this key now — it will be masked after this response.",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const updated = await ApiKey.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isRevoked: true }
    );
    if (!updated) return next(createError("Key not found", 404));
    res.json({ success: true, message: "Key revoked" });
  } catch (error) {
    next(error);
  }
});

export default router;
