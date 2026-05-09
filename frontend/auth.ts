// ─────────────────────────────────────────────────────────────
//  auth.ts — NextAuth v5 (Auth.js) configuration
//
//  Disabled by default. Set NEXT_PUBLIC_AUTH_ENABLED=true plus
//  AUTH_SECRET, AUTH_GOOGLE_ID/SECRET and/or AUTH_GITHUB_ID/SECRET
//  in .env.local to turn on Google + GitHub sign-in.
//
//  When enabled, the signed-in user's id is forwarded to the
//  Express backend via the `x-user-id` header — the backend
//  scopes history, favourites, stats, and API keys per user.
// ─────────────────────────────────────────────────────────────

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

const providers = [];
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) (session.user as any).id = token.id;
      return session;
    },
  },
  pages: { signIn: "/sign-in" },
});
