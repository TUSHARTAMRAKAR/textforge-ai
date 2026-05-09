"use client";
import { useEffect, useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";
import { features } from "@/lib/features";
import { setApiUserId } from "@/lib/api";

// ─────────────────────────────────────────────────────────────
//  AuthButtons — sign-in / sign-out + active session display.
//
//  Hidden entirely when NEXT_PUBLIC_AUTH_ENABLED !== "true",
//  so the rest of the app keeps working anonymously without
//  any extra setup.
// ─────────────────────────────────────────────────────────────

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function AuthButtons() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!features.authEnabled) return;
    let cancelled = false;
    setLoading(true);
    fetch("/api/auth/session")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (cancelled) return;
        const u = data?.user ?? null;
        setUser(u);
        setApiUserId(u?.id ?? u?.email ?? null);
      })
      .catch(() => { if (!cancelled) setUser(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (!features.authEnabled) return null;
  if (loading) return null;

  if (!user) {
    return (
      <a
        href="/api/auth/signin"
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "7px 12px",
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          color: "var(--text-1)",
          fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
          textDecoration: "none",
          transition: "all 0.15s ease",
        }}
      >
        <LogIn size={13} /> Sign in
      </a>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "5px 10px",
        background: "var(--brand-subtle)",
        border: "1px solid var(--border-hover)",
        borderRadius: "99px",
        color: "var(--brand)",
        fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
      }}>
        <User size={11} /> {user.name || user.email}
      </span>
      <a
        href="/api/auth/signout"
        title="Sign out"
        style={{
          display: "inline-flex", alignItems: "center",
          padding: "7px",
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          color: "var(--text-3)",
          textDecoration: "none",
          transition: "all 0.15s ease",
        }}
      >
        <LogOut size={13} />
      </a>
    </div>
  );
}
