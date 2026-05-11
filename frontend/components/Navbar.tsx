"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { toggleTheme, getTheme } from "@/lib/theme";
import { UserMenu } from "@/components/UserMenu";
import { features } from "@/lib/features";

function AnimatedTagline() {
  const text = "FORGE YOUR TEXT WITH AI";
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.16em", color: "var(--brand)", display: "flex", overflow: "hidden", marginTop: "1px" }}>
      {text.split("").map((char, i) => (
        <span key={i} style={{ display: "inline-block", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(4px)", transition: `opacity 0.3s ease ${i * 0.03}s, transform 0.3s ease ${i * 0.03}s`, whiteSpace: "pre" }}>
          {char}
        </span>
      ))}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  useEffect(() => { setThemeState(getTheme()); }, []);

  const isWorkspace = pathname === "/workspace";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: "56px",
      background: "rgba(26,18,8,0.88)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: isWorkspace ? "100%" : "1440px",
        margin: "0 auto",
        padding: isWorkspace ? "0 16px" : "0 24px",
        height: "100%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "9px",
            background: "linear-gradient(135deg, #D47E30 0%, #E8A050 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 14px rgba(212,126,48,0.4)", flexShrink: 0,
          }}>
            <Flame size={18} color="#1A1208" strokeWidth={2.5} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--text-1)", letterSpacing: "-0.02em" }}>TextForge</span>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "12px", color: "var(--text-3)" }}>AI</span>
            </div>
            <AnimatedTagline />
          </div>
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

          {/* Citations + Domain Docs — only on workspace page */}
          {isWorkspace && (
            <Link href="/citations" style={{
              fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "13px",
              color: "var(--text-2)", textDecoration: "none",
              padding: "7px 12px", borderRadius: "8px",
              background: "transparent", border: "1px solid transparent",
              transition: "all 0.15s", display: "flex", alignItems: "center", gap: "5px",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
            >
              📚 Citations
            </Link>
          )}
          {isWorkspace && (
            <Link href="/domain" style={{
              fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "13px",
              color: "var(--text-2)",
              textDecoration: "none",
              padding: "7px 12px", borderRadius: "8px",
              background: "transparent",
              border: "1px solid transparent",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: "5px",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
            >
              ⚖️ Domain Docs
            </Link>
          )}

          {/* Nav links — only outside workspace */}
          {!isWorkspace && (
            <>
              {[
                { href: "/workspace", label: "Workspace" },
                { href: "/stats",     label: "Stats"    },
                { href: "/api-keys",  label: "API Keys" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "13px",
                  color: pathname === href ? "var(--brand)" : "var(--text-2)",
                  textDecoration: "none",
                  padding: "7px 12px", borderRadius: "8px",
                  background: pathname === href ? "var(--brand-subtle)" : "transparent",
                  border: `1px solid ${pathname === href ? "var(--border-hover)" : "transparent"}`,
                  transition: "all 0.15s",
                }}>
                  {label}
                </Link>
              ))}
              <div style={{ width: "1px", height: "18px", background: "var(--border)", margin: "0 2px" }} />
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={() => { const next = toggleTheme(); setThemeState(next); }}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            style={{
              width: "34px", height: "34px", borderRadius: "8px",
              background: "var(--bg-2)", border: "1px solid var(--border)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-2)", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.background = "var(--bg-3)"; (e.currentTarget).style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { (e.currentTarget).style.background = "var(--bg-2)"; (e.currentTarget).style.color = "var(--text-2)"; }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* User menu — shows Sign in button or avatar dropdown */}
          {features.authEnabled && <UserMenu />}

        </div>
      </div>
    </nav>
  );
}
