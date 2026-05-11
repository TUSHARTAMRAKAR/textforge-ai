import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import { connectDB } from "./config/database";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import generateRouter from "./routes/generate";
import historyRouter from "./routes/history";
import shareRouter from "./routes/share";
import statsRouter from "./routes/stats";
import apiKeysRouter from "./routes/apiKeys";
import publicGenerateRouter from "./routes/publicGenerate";
import domainRouter     from "./routes/domain";
import citationsRouter from "./routes/citations";

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.isDev ? "dev" : "combined"));
app.use("/api", apiLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "TextForge AI Backend", version: "1.1.0", timestamp: new Date().toISOString() });
});

app.use("/api/generate",   generateRouter);
app.use("/api/history",    historyRouter);
app.use("/api/share",      shareRouter);
app.use("/api/stats",      statsRouter);
app.use("/api/keys",       apiKeysRouter);
app.use("/api/domain",     domainRouter);
app.use("/api/citations",  citationsRouter);

app.use("/v1/generate", apiKeyAuth, publicGenerateRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

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
