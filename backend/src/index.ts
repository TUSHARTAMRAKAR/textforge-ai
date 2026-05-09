import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import { connectDB } from "./config/database";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import generateRouter from "./routes/generate";
import historyRouter from "./routes/history";

// ─────────────────────────────────────────────────────────────
//  index.ts  —  TextForge AI Backend Entry Point
//
//  Startup sequence:
//  1. Create Express app
//  2. Register security + logging middleware
//  3. Mount route handlers
//  4. Connect to MongoDB
//  5. Start listening for connections
// ─────────────────────────────────────────────────────────────

const app = express();

// ── Security Middleware ───────────────────────────────────────
app.use(
  helmet({
    // Allows SSE streaming (disables certain content policies that block it)
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: config.cors.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Request Parsing ───────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Reject oversized bodies
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────
// 'dev' format in development, 'combined' (Apache-style) in production
app.use(morgan(config.isDev ? "dev" : "combined"));

// ── Rate Limiting ─────────────────────────────────────────────
app.use("/api", apiLimiter);

// ── Health Check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "TextForge AI Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────
app.use("/api/generate", generateRouter);
app.use("/api/history", historyRouter);

// 404 — catch any unmatched routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global Error Handler (must be last) ───────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
async function bootstrap() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════╗
║       🔥 TextForge AI Backend            ║
║  Server running on port ${config.port}           ║
║  Environment: ${config.nodeEnv.padEnd(26)}║
║  Health: http://localhost:${config.port}/health  ║
╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Fatal: Failed to start server", error);
    process.exit(1);
  }
}

bootstrap();

export default app;
