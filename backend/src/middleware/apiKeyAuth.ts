import { Request, Response, NextFunction } from "express";
import { ApiKey } from "../models/ApiKey";

// ─────────────────────────────────────────────────────────────
//  apiKeyAuth.ts  —  Public API authentication middleware
//
//  Validates `Authorization: Bearer tf_live_xxx` headers used
//  by the public /v1/* endpoints. On success, attaches userId
//  to the request and increments the key's usage counters.
// ─────────────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      apiUserId?: string;
      apiKeyId?: string;
    }
  }
}

export async function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const auth = req.header("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Missing API key. Send Authorization: Bearer <key>" });
    return;
  }

  const key = auth.slice(7).trim();
  if (!key.startsWith("tf_live_")) {
    res.status(401).json({ success: false, message: "Invalid API key format" });
    return;
  }

  try {
    const found = await ApiKey.findOneAndUpdate(
      { key, isRevoked: false },
      { lastUsed: new Date(), $inc: { requestCount: 1 } },
      { new: true }
    );
    if (!found) {
      res.status(401).json({ success: false, message: "Invalid or revoked API key" });
      return;
    }
    req.apiUserId = found.userId;
    req.apiKeyId = String(found._id);
    next();
  } catch (error) {
    next(error);
  }
}
