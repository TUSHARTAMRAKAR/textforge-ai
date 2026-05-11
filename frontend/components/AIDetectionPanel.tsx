"use client";
import { useState, useEffect } from "react";
import { detectAI, DetectionResult } from "@/lib/aiDetector";
import { Shield, ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, Info } from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  AIDetectionPanel.tsx
//
//  WHY: Shows the AI detection risk score below every generated
//  text bubble. Gives users actionable insight into how
//  detectable their text is and prepares them for the
//  "Humanise" feature (Week 2).
//
//  PROPS:
//  - text: the generated text to analyse
//  - onHumanise: callback for the Humanise button (Week 2)
// ─────────────────────────────────────────────────────────────

interface Props {
  text:        string;
  onHumanise?: () => void;
  isHumanising?: boolean;
}

export function AIDetectionPanel({ text, onHumanise, isHumanising }: Props) {
  const [result, setResult]       = useState<DetectionResult | null>(null);
  const [expanded, setExpanded]   = useState(false);
  const [showInfo, setShowInfo]   = useState(false);
  const [animScore, setAnimScore] = useState(0);

  // Run detection when text changes
  useEffect(() => {
    if (!text || text.length < 50) return;
    const detection = detectAI(text);
    setResult(detection);

    // Animate score counting up
    setAnimScore(0);
    const step     = detection.overallScore / 40;
    let   current  = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= detection.overallScore) {
        setAnimScore(detection.overallScore);
        clearInterval(interval);
      } else {
        setAnimScore(Math.round(current));
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  if (!result) return null;

  const { overallScore, riskLevel, riskLabel, dimensions, reliable } = result;

  // Colors based on risk level
  const riskColor =
    riskLevel === "high"   ? "#E05050" :
    riskLevel === "medium" ? "#E8A050" :
    "#1D9E75";

  const riskBg =
    riskLevel === "high"   ? "#FAECEC" :
    riskLevel === "medium" ? "#FDF3E7" :
    "#E1F5EE";

  const RiskIcon =
    riskLevel === "high"   ? ShieldAlert :
    riskLevel === "medium" ? Shield :
    ShieldCheck;

  return (
    <div style={{
      marginTop: "12px",
      background: "var(--bg-1)",
      border: `1px solid ${riskColor}30`,
      borderRadius: "12px",
      overflow: "hidden",
      transition: "all 0.2s ease",
    }}>

      {/* ── Header row ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "14px 16px",
        background: `${riskColor}08`,
        borderBottom: expanded ? `1px solid ${riskColor}20` : "none",
        cursor: "pointer",
      }} onClick={() => setExpanded((v) => !v)}>

        {/* Icon */}
        <RiskIcon size={18} color={riskColor} />

        {/* Label */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontWeight: 600,
              fontSize: "13px", color: "var(--text-1)",
            }}>
              AI Detection Analysis
            </span>
            {!reliable && (
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                color: "var(--text-4)", background: "var(--bg-2)",
                padding: "1px 6px", borderRadius: "4px",
                border: "1px solid var(--border)",
              }}>
                short text — less reliable
              </span>
            )}
          </div>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: "12px",
            color: riskColor, fontWeight: 500,
          }}>
            {riskLabel}
          </span>
        </div>

        {/* Score circle */}
        <div style={{ position: "relative", width: "52px", height: "52px", flexShrink: 0 }}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            {/* Background circle */}
            <circle cx="26" cy="26" r="22" fill="none"
              stroke="var(--border)" strokeWidth="4"/>
            {/* Score arc */}
            <circle cx="26" cy="26" r="22" fill="none"
              stroke={riskColor} strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(animScore / 100) * 138.2} 138.2`}
              strokeDashoffset="34.55"
              style={{ transition: "stroke-dasharray 0.05s linear" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontWeight: 700,
              fontSize: "13px", color: riskColor,
            }}>
              {animScore}%
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        {expanded
          ? <ChevronUp size={15} color="var(--text-3)" />
          : <ChevronDown size={15} color="var(--text-3)" />
        }
      </div>

      {/* ── Expanded details ── */}
      {expanded && (
        <div style={{ padding: "16px" }}>

          {/* Score bar */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: "6px",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#1D9E75" }}>Human</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#E05050" }}>AI Generated</span>
            </div>
            <div style={{
              height: "8px", background: "var(--bg-3)",
              borderRadius: "99px", overflow: "hidden", position: "relative",
            }}>
              {/* Gradient track */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to right, #1D9E75, #E8A050, #E05050)",
                opacity: 0.3,
              }} />
              {/* Score indicator */}
              <div style={{
                position: "absolute", top: 0, bottom: 0,
                width: "3px", borderRadius: "99px",
                background: riskColor,
                left: `${overallScore}%`,
                transform: "translateX(-50%)",
                boxShadow: `0 0 6px ${riskColor}`,
              }} />
            </div>
          </div>

          {/* Dimensions grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {dimensions.map((dim) => (
              <div key={dim.name} style={{
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                {/* Dimension name */}
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "12px",
                  color: "var(--text-2)", width: "140px", flexShrink: 0,
                }}>
                  {dim.name}
                </span>

                {/* Bar */}
                <div style={{
                  flex: 1, height: "5px", background: "var(--bg-3)",
                  borderRadius: "99px", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: "99px",
                    width: `${dim.score}%`,
                    background: dim.isRisk ? "#E05050" : "#1D9E75",
                    transition: "width 0.6s ease",
                  }} />
                </div>

                {/* Label badge */}
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  color: dim.isRisk ? "#E05050" : "#1D9E75",
                  background: dim.isRisk ? "#FAECEC" : "#E1F5EE",
                  padding: "1px 7px", borderRadius: "99px",
                  flexShrink: 0, width: "72px", textAlign: "center",
                }}>
                  {dim.label}
                </span>
              </div>
            ))}
          </div>

          {/* How it works info */}
          <div style={{ marginBottom: "14px" }}>
            <button
              onClick={() => setShowInfo((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-4)", fontFamily: "var(--font-mono)",
                fontSize: "11px", padding: 0,
              }}
            >
              <Info size={11} /> How is this calculated?
              {showInfo ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
            {showInfo && (
              <div style={{
                marginTop: "8px", padding: "10px 12px",
                background: "var(--bg-2)", borderRadius: "8px",
                border: "1px solid var(--border)",
              }}>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "11px",
                  color: "var(--text-3)", lineHeight: 1.7, margin: 0,
                }}>
                  This analysis measures 5 linguistic patterns known to differ between human and AI writing:
                  <strong style={{ color: "var(--text-2)" }}> sentence variety</strong> (humans write with more rhythm),
                  <strong style={{ color: "var(--text-2)" }}> AI signature phrases</strong> (words LLMs overuse),
                  <strong style={{ color: "var(--text-2)" }}> vocabulary range</strong> (AI repeats safe words),
                  <strong style={{ color: "var(--text-2)" }}> sentence openings</strong> (AI starts sentences similarly),
                  and <strong style={{ color: "var(--text-2)" }}> punctuation patterns</strong> (AI overuses commas).
                  No external API is used — analysis runs entirely in your browser.
                </p>
              </div>
            )}
          </div>

          {/* Humanise button — Week 2 */}
          <button
            onClick={onHumanise}
            disabled={isHumanising || !onHumanise}
            style={{
              width: "100%", padding: "11px",
              background: riskLevel === "low" ? "var(--bg-3)" : "var(--brand)",
              border: "none", borderRadius: "9px",
              cursor: riskLevel === "low" || !onHumanise ? "not-allowed" : "pointer",
              color: riskLevel === "low" || !onHumanise ? "var(--text-4)" : "var(--bg-base)",
              fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
              transition: "all 0.15s",
              opacity: !onHumanise ? 0.6 : 1,
            }}
          >
            {isHumanising ? (
              <>⏳ Humanising text…</>
            ) : riskLevel === "low" ? (
              <>✅ Text already looks human-written</>
            ) : (
              <>🔄 Humanise Text — reduce AI detection risk</>
            )}
          </button>

          {riskLevel !== "low" && !onHumanise && (
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              color: "var(--text-4)", textAlign: "center", marginTop: "6px",
            }}>
              Humanise feature coming in next update
            </p>
          )}
        </div>
      )}
    </div>
  );
}
