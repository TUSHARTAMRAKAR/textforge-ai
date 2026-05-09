import { Request, Response, NextFunction } from "express";
import { config } from "../config";

// ─────────────────────────────────────────────────────────────
//  errorHandler.ts
//
//  Catches ALL unhandled errors from route handlers.
//  Returns a clean JSON error to the client instead of
//  crashing the server or leaking stack traces in production.
// ─────────────────────────────────────────────────────────────

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;

  // In development, include the full stack trace for debugging
  // In production, never expose internals to the client
  const response = {
    success: false,
    message: err.message || "Internal server error",
    ...(config.isDev && { stack: err.stack }),
  };

  console.error(`[Error] ${statusCode} — ${err.message}`);
  if (config.isDev) console.error(err.stack);

  res.status(statusCode).json(response);
}

// Helper to create errors with status codes cleanly
export function createError(message: string, statusCode = 500): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}
