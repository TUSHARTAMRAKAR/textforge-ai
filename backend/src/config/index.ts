import dotenv from "dotenv";

dotenv.config();

// ─────────────────────────────────────────────────────────────
//  config.ts
//  Single source of truth for all environment variables.
//  Throws at startup if a required variable is missing —
//  so you catch config errors immediately, not at runtime.
// ─────────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",

  gemini: {
    apiKey: requireEnv("GEMINI_API_KEY"),
    model: "gemini-2.5-flash",
    maxTokens: 2048,
  },

  mongodb: {
    uri: requireEnv("MONGODB_URI"),
  },

  cors: {
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "50", 10),
  },
};
