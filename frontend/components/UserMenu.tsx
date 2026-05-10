"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, Loader2, LogIn } from "lucide-react";
import Image from "next/image";
import { setApiUserId } from "@/lib/api";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen]           = useState(false);
  const ref                       = useRef<HTMLDivElement>(null);

  // ── KEY FIX: inject userId into every API call when session loads ──
  // This makes the backend filter history/stats by the logged-in user.
  // When signed out, clears the userId so anonymous mode works.
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user) {
      const id = (session.user as any).id || session.user.email || null;
      setApiUserId(id);
    } else {
      setApiUserId(null);
    }
  }, [session, status]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (status === "loading") {
    return (
      <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={15} color="var(--text-3)" className="spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <a href="/login" style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "7px 14px", borderRadius: "8px",
        background: "var(--brand)", color: "var(--bg-base)",
        fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px",
        textDecoration: "none", transition: "all 0.15s",
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(212,126,48,0.35)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
      >
        <LogIn size={14} /> Sign in
      </a>
    );
  }

  const name     = session.user?.name || "User";
  const email    = session.user?.email || "";
  const image    = session.user?.image;
  const provider = (session.user as any)?.provider || "";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: "8px",
        background: "var(--bg-2)", border: "1px solid var(--border)",
        borderRadius: "10px", padding: "5px 10px 5px 5px",
        cursor: "pointer", transition: "all 0.15s",
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
      >
        {image ? (
          <Image src={image} alt={name} width={26} height={26}
            style={{ borderRadius: "50%", border: "1.5px solid var(--border-hover)" }} />
        ) : (
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px", color: "var(--bg-base)",
          }}>
            {initials}
          </div>
        )}
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
          color: "var(--text-1)", maxWidth: "80px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {name.split(" ")[0]}
        </span>
        <ChevronDown size={12} color="var(--text-3)"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "var(--bg-1)", border: "1px solid var(--border-hover)",
          borderRadius: "12px", minWidth: "210px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          zIndex: 300, overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)", marginBottom: "3px" }}>{name}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>
            {provider && (
              <span style={{
                display: "inline-block", marginTop: "6px",
                fontFamily: "var(--font-mono)", fontSize: "10px",
                color: "var(--brand)", background: "var(--brand-subtle)",
                border: "1px solid var(--border-hover)",
                borderRadius: "99px", padding: "1px 8px", textTransform: "capitalize",
              }}>via {provider}</span>
            )}
          </div>
          <div style={{ padding: "4px" }}>
            <button onClick={() => signOut({ callbackUrl: "/login" })} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", background: "none", border: "none",
              cursor: "pointer", color: "var(--text-2)",
              fontFamily: "var(--font-sans)", fontSize: "14px",
              borderRadius: "8px", transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.color = "#E05050"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
