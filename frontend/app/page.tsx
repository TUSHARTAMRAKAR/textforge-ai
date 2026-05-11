"use client";
import Link from "next/link";
import { MadeBy } from "@/components/MadeBy";
import { ArrowRight, Sparkles, Zap, Brain, Shield, BookOpen, Globe2, FileText, Search } from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  { icon: Sparkles,  title: "Gemini 2.5 Flash",         desc: "Google's latest free model — 1,500 req/day, zero cost." },
  { icon: Zap,       title: "Real-time SSE Streaming",   desc: "Watch text appear token-by-token — first token in under 200ms." },
  { icon: Brain,     title: "Deep Domain Templates",     desc: "Legal, Medical, Startup, Research, Grant, HR — 70+ parameters." },
  { icon: Shield,    title: "AI Detection + Humaniser",  desc: "5-dimension risk scoring — one click to rewrite and pass detectors." },
  { icon: BookOpen,  title: "Academic Citations",        desc: "Real sources from 200M+ papers via Semantic Scholar and CrossRef." },
  { icon: Globe2,    title: "Bharat AI — भारत AI",      desc: "Native generation in Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati." },
  { icon: Search,    title: "Searchable History",        desc: "Filter, search, favourite, share — every generation saved forever." },
  { icon: FileText,  title: "Public API Mode",           desc: "Mint API keys and call TextForge from your own apps." },
];

const techStack = [
  { name: "Next.js 14",       role: "Frontend",   color: "#F0F0F0" },
  { name: "TypeScript",       role: "Types",      color: "#3178C6" },
  { name: "Tailwind CSS",     role: "Styling",    color: "#38BDF8" },
  { name: "Zustand",          role: "State",      color: "#D47E30" },
  { name: "Express.js",       role: "Backend",    color: "#8BC34A" },
  { name: "Gemini 2.5 Flash", role: "AI Model",   color: "#D47E30" },
  { name: "MongoDB Atlas",    role: "Database",   color: "#47A248" },
  { name: "Mongoose",         role: "ODM",        color: "#AA2222" },
  { name: "Zod",              role: "Validation", color: "#A78BFA" },
  { name: "PyTorch LSTM",     role: "ML Demo",    color: "#EE4C2C" },
];

// Animated tagline — hero section
function HeroTagline() {
  const text = "◈  FORGE YOUR TEXT WITH AI  ◈";
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= text.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 45);
    return () => clearTimeout(t);
  }, [step]);

  // Re-animate every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => setStep(0), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: "13px",
      letterSpacing: "0.2em",
      color: "var(--brand)",
      display: "flex",
      alignItems: "center",
      gap: 0,
      minHeight: "22px",
    }}>
      {text.split("").map((char, i) => (
        <span key={i} style={{
          opacity: i < step ? 1 : 0,
          transition: "opacity 0.1s ease",
          whiteSpace: "pre",
        }}>
          {char}
        </span>
      ))}
      {step < text.length && (
        <span style={{
          display: "inline-block",
          width: "8px", height: "14px",
          background: "var(--brand)",
          marginLeft: "1px",
          animation: "blink 0.8s step-end infinite",
          verticalAlign: "middle",
          borderRadius: "1px",
        }} />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{
        maxWidth: "960px", margin: "0 auto",
        padding: "88px 40px 80px",
        textAlign: "center",
      }}>

        {/* Badge */}
        <div className="animate-fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: "7px",
          background: "var(--brand-subtle)",
          border: "1px solid var(--border-hover)",
          borderRadius: "99px", padding: "5px 14px",
          marginBottom: "36px",
        }}>
          <Sparkles size={12} color="var(--brand)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--brand)", letterSpacing: "0.08em" }}>
            POWERED BY GEMINI 2.5 FLASH — FREE
          </span>
        </div>

        {/* Main heading — serif for elegance like Claude */}
        <h1 className="animate-fade-up delay-1" style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(48px, 7vw, 80px)",
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          color: "var(--text-1)",
          marginBottom: "28px",
        }}>
          Text<span style={{ color: "var(--brand)" }}>Forge</span>
          <br />
          <span style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "0.72em",
            color: "var(--text-2)",
            letterSpacing: "-0.02em",
          }}>
            Generative AI
          </span>
        </h1>

        {/* Animated tagline — ALWAYS visible and animating */}
        <div className="animate-fade-up delay-2" style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
          <HeroTagline />
        </div>

        <p className="animate-fade-up delay-2" style={{
          fontFamily: "var(--font-sans)", fontSize: "17px",
          color: "var(--text-2)", maxWidth: "500px",
          margin: "0 auto 44px", lineHeight: 1.75,
          fontWeight: 300,
        }}>
          Generate academic articles with real citations, domain-specific legal and medical documents,
          AI-scored content with humanisation, and native Indian language writing — all in one platform.
        </p>

        <div className="animate-fade-up delay-3" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/workspace" style={{
            fontSize: "15px", padding: "16px 36px", textDecoration: "none",
            background: "linear-gradient(135deg, #D47E30, #E8A050, #D47E30)",
            backgroundSize: "200% 200%",
            color: "#1A1208", fontWeight: 700,
            borderRadius: "12px",
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontFamily: "var(--font-sans)",
            boxShadow: "0 0 24px rgba(212,126,48,0.4), 0 4px 16px rgba(212,126,48,0.3)",
            animation: "btnPulse 2s ease-in-out infinite, btnShimmer 3s linear infinite",
            border: "1px solid rgba(212,126,48,0.5)",
            letterSpacing: "0.02em",
          }}>
            Start Generating <ArrowRight size={17} />
          </Link>
        </div>
        <style>{`
          @keyframes btnPulse {
            0%, 100% { box-shadow: 0 0 24px rgba(212,126,48,0.4), 0 4px 16px rgba(212,126,48,0.3); transform: scale(1); }
            50%       { box-shadow: 0 0 40px rgba(212,126,48,0.7), 0 8px 32px rgba(212,126,48,0.5); transform: scale(1.03); }
          }
          @keyframes btnShimmer {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "0 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`card animate-fade-up delay-${(i % 3) + 1}`} style={{ padding: "22px 20px" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "9px",
                background: "var(--brand-subtle)", border: "1px solid var(--border-hover)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "14px",
              }}>
                <Icon size={17} color="var(--brand)" />
              </div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)", marginBottom: "7px" }}>
                {title}
              </h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-3)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-1)",
        padding: "52px 40px 40px",
      }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>

          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "36px", marginBottom: "44px" }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "9px",
                  background: "linear-gradient(135deg, #D47E30, #E8A050)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 14px rgba(212,126,48,0.35)",
                }}>
                  <span style={{ fontSize: "16px" }}>🔥</span>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "17px", color: "var(--text-1)" }}>
                  TextForge <span style={{ color: "var(--brand)" }}>AI</span>
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-3)", maxWidth: "240px", lineHeight: 1.65 }}>
                A production-grade AI writing platform — citations, domain documents, AI detection, and vernacular generation for 1.4B Indians.
              </p>
            </div>

            {/* Nav */}
            <div>
              <p className="label">Navigate</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {[{ label: "Generate", href: "/workspace" }].map(({ label, href }) => (
                  <Link key={href} href={href} style={{
                    fontFamily: "var(--font-sans)", fontSize: "14px",
                    color: "var(--text-2)", textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Tech stack */}
          <div style={{ marginBottom: "36px" }}>
            <p className="label" style={{ marginBottom: "14px" }}>Built With</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {techStack.map(({ name, role, color }) => (
                <div key={name} style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  background: "var(--bg-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "7px", padding: "6px 12px",
                  transition: "all 0.15s ease", cursor: "default",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}50`;
                    (e.currentTarget as HTMLElement).style.background = `${color}0C`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-2)";
                  }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-1)", whiteSpace: "nowrap" }}>
                    {name}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-3)", whiteSpace: "nowrap" }}>
                    {role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: "1px solid var(--border)", paddingTop: "24px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-4)" }}>
              © 2026 TextForge AI — MIT License
            </span>
            <MadeBy />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--brand)", letterSpacing: "0.12em" }}>
              FORGE YOUR TEXT WITH AI ◈
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
