"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Sun, Moon, Sparkles, History, BarChart3, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { toggleTheme, getTheme } from "@/lib/theme";
import { features } from "@/lib/features";
import { AuthButtons } from "./AuthButtons";

// Animated tagline — each character reveals with a staggered delay
function AnimatedTagline() {
  const text = "FORGE YOUR TEXT WITH AI";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      letterSpacing: "0.16em",
      color: "var(--brand)",
      display: "flex",
      overflow: "hidden",
      marginTop: "1px",
    }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(4px)",
            transition: `opacity 0.3s ease ${i * 0.03}s, transform 0.3s ease ${i * 0.03}s`,
            whiteSpace: "pre",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

const NAV_ITEMS = [
  { href: "/generate",  label: "Generate", Icon: Sparkles },
  { href: "/history",   label: "History",  Icon: History },
  { href: "/stats",     label: "Stats",    Icon: BarChart3 },
  { href: "/api-keys",  label: "API Keys", Icon: Key, requiresApi: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setThemeState(next);
  };

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    fontSize: "13px",
    color: active ? "var(--brand)" : "var(--text-2)",
    textDecoration: "none",
    padding: "7px 12px",
    borderRadius: "8px",
    background: active ? "var(--brand-subtle)" : "transparent",
    border: `1px solid ${active ? "var(--border-hover)" : "transparent"}`,
    transition: "all 0.15s ease",
  });

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: "64px",
      background: "rgba(var(--bg-base-rgb, 26,18,8), 0.88)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: "0 24px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #D47E30 0%, #E8A050 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 18px rgba(212,126,48,0.45), 0 2px 4px rgba(0,0,0,0.3)",
            flexShrink: 0,
          }}>
            <Flame size={20} color="#1A1208" strokeWidth={2.5} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "18px",
                color: "var(--text-1)",
                letterSpacing: "-0.02em",
              }}>
                TextForge
              </span>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "13px",
                color: "var(--text-3)",
              }}>
                AI
              </span>
            </div>
            <AnimatedTagline />
          </div>
        </Link>

        {/* ── Right side ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV_ITEMS.filter((n) => !n.requiresApi || features.publicApiEnabled).map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              style={navLinkStyle(pathname === href)}
              onMouseEnter={(e) => { if (pathname !== href) { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.color = "var(--text-1)"; } }}
              onMouseLeave={(e) => { if (pathname !== href) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; } }}
            >
              <Icon size={13} /> {label}
            </Link>
          ))}

          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 6px" }} />

          <AuthButtons />

          {/* Dark/Light toggle */}
          <button
            onClick={handleToggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              width: "36px", height: "36px",
              borderRadius: "8px",
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-2)",
              transition: "all 0.15s ease",
              marginLeft: "4px",
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.background = "var(--bg-3)"; (e.currentTarget).style.color = "var(--brand)"; }}
            onMouseLeave={(e) => { (e.currentTarget).style.background = "var(--bg-2)"; (e.currentTarget).style.color = "var(--text-2)"; }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
