"use client";
import { useState, useEffect } from "react";
import { detectAI, DetectionResult } from "@/lib/aiDetector";
import { api } from "@/lib/api";
import { Shield, ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, Info, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  text:    string;
  tone?:   string;
  topic?:  string;
}

export function AIDetectionPanel({ text, tone = "formal", topic = "text" }: Props) {
  const [result, setResult]             = useState<DetectionResult | null>(null);
  const [expanded, setExpanded]         = useState(false);
  const [showInfo, setShowInfo]         = useState(false);
  const [animScore, setAnimScore]       = useState(0);
  const [humanisedText, setHumanisedText] = useState("");
  const [humanisedResult, setHumanisedResult] = useState<DetectionResult | null>(null);
  const [isHumanising, setIsHumanising] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (!text || text.length < 50) return;
    const detection = detectAI(text);
    setResult(detection);
    setAnimScore(0);
    const step = detection.overallScore / 40;
    let current = 0;
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

  const handleHumanise = async () => {
    if (!text || isHumanising) return;
    setIsHumanising(true);
    setExpanded(true);
    let accumulated = "";

    try {
      await api.postHumanise(
        { text, tone, topic },
        (chunk) => { accumulated += chunk; setHumanisedText(accumulated); },
        () => {
          setIsHumanising(false);
          // Run detection on humanised text
          const newResult = detectAI(accumulated);
          setHumanisedResult(newResult);
          setShowComparison(true);
          toast.success(`Score reduced: ${result?.overallScore}% → ${newResult.overallScore}%`);
        },
        (err) => { setIsHumanising(false); toast.error(err); }
      );
    } catch (e: any) {
      setIsHumanising(false);
      toast.error(e?.message || "Humanise failed");
    }
  };

  if (!result) return null;

  const { overallScore, riskLevel, riskLabel, dimensions, reliable } = result;

  const riskColor =
    riskLevel === "high"   ? "#E05050" :
    riskLevel === "medium" ? "#E8A050" :
    "#1D9E75";

  const RiskIcon =
    riskLevel === "high"   ? ShieldAlert :
    riskLevel === "medium" ? Shield :
    ShieldCheck;

  return (
    <div style={{
      background: "var(--bg-1)",
      border: `1px solid ${riskColor}30`,
      borderRadius: "12px",
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "14px 16px",
        background: `${riskColor}08`,
        borderBottom: expanded ? `1px solid ${riskColor}20` : "none",
        cursor: "pointer",
      }} onClick={() => setExpanded((v) => !v)}>
        <RiskIcon size={18} color={riskColor} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: "var(--text-1)" }}>
              AI Detection Analysis
            </span>
            {!reliable && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", background: "var(--bg-2)", padding: "1px 6px", borderRadius: "4px", border: "1px solid var(--border)" }}>
                short text — less reliable
              </span>
            )}
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: riskColor, fontWeight: 500 }}>
            {riskLabel}
          </span>
        </div>

        {/* Score circle */}
        <div style={{ position: "relative", width: "52px", height: "52px", flexShrink: 0 }}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="var(--border)" strokeWidth="4"/>
            <circle cx="26" cy="26" r="22" fill="none" stroke={riskColor} strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(animScore / 100) * 138.2} 138.2`}
              strokeDashoffset="34.55"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px", color: riskColor }}>
              {animScore}%
            </span>
          </div>
        </div>
        {expanded ? <ChevronUp size={15} color="var(--text-3)" /> : <ChevronDown size={15} color="var(--text-3)" />}
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: "16px" }}>

          {/* Score bar */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#1D9E75" }}>Human</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#E05050" }}>AI Generated</span>
            </div>
            <div style={{ height: "8px", background: "var(--bg-3)", borderRadius: "99px", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #1D9E75, #E8A050, #E05050)", opacity: 0.3 }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, width: "3px", borderRadius: "99px", background: riskColor, left: `${overallScore}%`, transform: "translateX(-50%)", boxShadow: `0 0 6px ${riskColor}` }} />
              {/* Show humanised score on same bar */}
              {humanisedResult && (
                <div style={{ position: "absolute", top: 0, bottom: 0, width: "3px", borderRadius: "99px", background: "#1D9E75", left: `${humanisedResult.overallScore}%`, transform: "translateX(-50%)", boxShadow: "0 0 6px #1D9E75" }} />
              )}
            </div>
            {humanisedResult && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "6px", gap: "8px", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: riskColor }}>{overallScore}% original</span>
                <ArrowRight size={12} color="var(--text-4)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#1D9E75", fontWeight: 700 }}>{humanisedResult.overallScore}% after humanising ✅</span>
              </div>
            )}
          </div>

          {/* Dimensions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {dimensions.map((dim) => (
              <div key={dim.name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-2)", width: "140px", flexShrink: 0 }}>
                  {dim.name}
                </span>
                <div style={{ flex: 1, height: "5px", background: "var(--bg-3)", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "99px", width: `${dim.score}%`, background: dim.isRisk ? "#E05050" : "#1D9E75", transition: "width 0.6s ease" }} />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: dim.isRisk ? "#E05050" : "#1D9E75", background: dim.isRisk ? "#FAECEC" : "#E1F5EE", padding: "1px 7px", borderRadius: "99px", flexShrink: 0, width: "72px", textAlign: "center" }}>
                  {dim.label}
                </span>
              </div>
            ))}
          </div>

          {/* Before/After comparison */}
          {showComparison && humanisedText && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Humanised Version
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#1D9E75", background: "#E1F5EE", padding: "1px 8px", borderRadius: "99px" }}>
                  {humanisedResult?.overallScore}% AI score
                </span>
              </div>
              <div style={{
                background: "var(--bg-2)", border: "1px solid #1D9E7530",
                borderRadius: "10px", padding: "16px",
                fontFamily: "var(--font-serif)", fontSize: "14px",
                lineHeight: "1.8", color: "var(--text-1)",
                maxHeight: "300px", overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}>
                {humanisedText}
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(humanisedText); toast.success("Humanised text copied!"); }}
                style={{
                  marginTop: "8px", padding: "7px 14px",
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  borderRadius: "7px", cursor: "pointer",
                  color: "var(--text-2)", fontFamily: "var(--font-sans)", fontSize: "12px",
                  transition: "all 0.12s",
                }}
              >
                Copy humanised text
              </button>
            </div>
          )}

          {/* How it works */}
          <div style={{ marginBottom: "14px" }}>
            <button onClick={() => setShowInfo((v) => !v)} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", color: "var(--text-4)", fontFamily: "var(--font-mono)", fontSize: "11px", padding: 0 }}>
              <Info size={11} /> How is this calculated? {showInfo ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
            {showInfo && (
              <div style={{ marginTop: "8px", padding: "10px 12px", background: "var(--bg-2)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-3)", lineHeight: 1.7, margin: 0 }}>
                  Analyses 5 linguistic patterns: <strong style={{ color: "var(--text-2)" }}>sentence variety</strong> (humans write with more rhythm), <strong style={{ color: "var(--text-2)" }}>AI signature phrases</strong> (45 known LLM phrases), <strong style={{ color: "var(--text-2)" }}>vocabulary range</strong> (AI repeats safe words), <strong style={{ color: "var(--text-2)" }}>sentence openings</strong>, and <strong style={{ color: "var(--text-2)" }}>punctuation patterns</strong>. Runs entirely in your browser — no external API.
                </p>
              </div>
            )}
          </div>

          {/* Humanise button */}
          <button
            onClick={handleHumanise}
            disabled={isHumanising}
            style={{
              width: "100%", padding: "11px",
              background: (riskLevel === "low" && !showComparison) ? "var(--bg-3)" : isHumanising ? "var(--bg-3)" : "var(--brand)",
              border: "none", borderRadius: "9px",
              cursor: (riskLevel === "low" && !showComparison) || isHumanising ? "not-allowed" : "pointer",
              color: (riskLevel === "low" && !showComparison) || isHumanising ? "var(--text-4)" : "var(--bg-base)",
              fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
              transition: "all 0.15s",
            }}
          >
            {isHumanising ? (
              <><Loader2 size={15} className="spin" /> Humanising text…</>
            ) : showComparison ? (
              <>🔄 Humanise Again</>
            ) : (
              <>🔄 Humanise Text — reduce AI detection risk</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
