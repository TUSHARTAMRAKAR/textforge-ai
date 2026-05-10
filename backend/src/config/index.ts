import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function parseAllowedOrigins(): (string | RegExp)[] {
  const raw = process.env.CLIENT_URL || "http://localhost:3000";
  const explicit = raw.split(",").map((s) => s.trim()).filter(Boolean);

  return [
    ...explicit,
    // Allow ALL Vercel preview deployments for this project
    /^https:\/\/textforge-.*\.vercel\.app$/,
    // Allow localhost on any port for development
    /^http:\/\/localhost:\d+$/,
  ];
}

export const config = {
  port:    parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isDev:   process.env.NODE_ENV !== "production",

  gemini: {
    apiKey:    requireEnv("GEMINI_API_KEY"),
    model:     process.env.GEMINI_MODEL || "gemini-2.5-flash",
    maxTokens: 2048,
  },

  mongodb: {
    uri: requireEnv("MONGODB_URI"),
  },

  cors: {
    allowedOrigins: parseAllowedOrigins(),
    clientUrl:      process.env.CLIENT_URL || "http://localhost:3000",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "50", 10),
  },
};
