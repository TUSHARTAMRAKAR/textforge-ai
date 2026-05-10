import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

// ── NextAuth v4 route handler ────────────────────────────────
// authOptions is NOT exported here — Vercel rejects unknown exports
// from route files. Handler is the only export allowed.

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error:  "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user)    token.id       = user.id;
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id       = token.id;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// Only GET and POST exported — no other exports allowed
export { handler as GET, handler as POST };
