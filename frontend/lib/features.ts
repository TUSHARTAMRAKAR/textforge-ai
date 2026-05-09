// ─────────────────────────────────────────────────────────────
//  features.ts — Feature flags
//
//  Flip features on/off without rebuilding routes.
//  Driven by NEXT_PUBLIC_* env vars so they reach the browser.
// ─────────────────────────────────────────────────────────────

export const features = {
  authEnabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === "true",
  publicApiEnabled: process.env.NEXT_PUBLIC_PUBLIC_API_ENABLED !== "false",
};
