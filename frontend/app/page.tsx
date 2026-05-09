"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Brain, Shield, History } from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  { icon: Sparkles, title: "Gemini 2.5 Flash",    desc: "Google's latest free model — 1,500 req/day, zero cost." },
  { icon: Zap,      title: "Real-time Streaming", desc: "Watch text appear token-by-token with live SSE." },
  { icon: Brain,    title: "Prompt Engineering",  desc: "Tone, length, and topic controls craft the perfect prompt." },
  { icon: History,  title: "Sidebar History",     desc: "Every generation saved. Browse instantly from the sidebar." },
  { icon: Shield,   title: "Rate Protected",      desc: "Smart per-IP limits protect your API quota." },
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
          Generate coherent, high-quality paragraphs on any topic.
          Choose tone, length, and subject.
        </p>

        <div className="animate-fade-up delay-3" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/generate" className="btn-primary" style={{ fontSize: "15px", padding: "14px 28px", textDecoration: "none" }}>
            Start Generating <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "0 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
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
                A full-stack generative text model built with modern web tech and Google's free Gemini API.
              </p>
            </div>

            {/* Nav */}
            <div>
              <p className="label">Navigate</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {[{ label: "Generate", href: "/generate" }, { label: "History", href: "/history" }].map(({ label, href }) => (
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
              © 2025 TextForge AI — MIT License
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--brand)", letterSpacing: "0.12em" }}>
              FORGE YOUR TEXT WITH AI ◈
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
