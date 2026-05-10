"use client";
import { SessionProvider } from "next-auth/react";

// ─────────────────────────────────────────────────────────────
//  AuthProvider — wraps the app with NextAuth v4 SessionProvider
//  This makes useSession() work in any client component.
//  Must be a "use client" component imported into layout.tsx
// ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
