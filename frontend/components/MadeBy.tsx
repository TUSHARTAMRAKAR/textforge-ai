"use client";
import { useState, useEffect } from "react";

// ── Animated "Made with ❤️ by TUSHAR TAMRAKAR" component ────
// Each character of the name animates in with a stagger delay
// The heart pulses continuously
// On hover — each letter glows with the brand color

export function MadeBy() {
  const [visible, setVisible] = useState(false);
  const name = "TUSHAR TAMRAKAR";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "6px",
      fontFamily: "var(--font-mono)",
    }}>
      {/* "Made with" */}
      <span style={{
        fontSize: "12px", color: "var(--text-3)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>
        Made with
      </span>

      {/* Pulsing heart */}
      <span style={{
        fontSize: "13px",
        display: "inline-block",
        animation: "heartbeat 1.4s ease-in-out infinite",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease 0.3s",
      }}>
        ❤️
      </span>

      {/* "by" */}
      <span style={{
        fontSize: "12px", color: "var(--text-3)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease 0.4s",
      }}>
        by
      </span>

      {/* Animated name — each character staggers in */}
      <span style={{ display: "flex", alignItems: "center" }}>
        {name.split("").map((char, i) => (
          <span
            key={i}
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: char === " " ? "0.3em" : "0.08em",
              color: "var(--brand)",
              display: "inline-block",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(6px)",
              transition: `opacity 0.4s ease ${0.5 + i * 0.04}s, transform 0.4s ease ${0.5 + i * 0.04}s, color 0.2s ease, text-shadow 0.2s ease`,
              whiteSpace: "pre",
              cursor: "default",
              textShadow: "none",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#FDFBD4";
              el.style.textShadow = "0 0 12px rgba(212,126,48,0.8)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--brand)";
              el.style.textShadow = "none";
              el.style.transform = "translateY(0)";
            }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* Heartbeat animation */}
      <style>{`
        @keyframes heartbeat {
          0%   { transform: scale(1);    }
          14%  { transform: scale(1.25); }
          28%  { transform: scale(1);    }
          42%  { transform: scale(1.2);  }
          70%  { transform: scale(1);    }
          100% { transform: scale(1);    }
        }
      `}</style>
    </div>
  );
}
