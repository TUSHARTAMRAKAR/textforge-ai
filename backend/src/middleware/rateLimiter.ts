import rateLimit from "express-rate-limit";
import { config } from "../config";

// ─────────────────────────────────────────────────────────────
//  rateLimiter.ts
//
//  Protects the /generate endpoint from abuse.
//  Each IP gets a limited number of requests per window.
//  This also protects your Anthropic API bill!
// ─────────────────────────────────────────────────────────────

// General API limiter — applies to all routes
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // default: 15 minutes
  max: config.rateLimit.max,           // default: 50 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait a few minutes and try again.",
  },
});

// Stricter limiter specifically for the generate endpoint
// (Claude API calls cost money — be extra careful here)
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 5,               // max 5 generations per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Generation limit reached. Please wait 1 minute before generating again.",
  },
});
