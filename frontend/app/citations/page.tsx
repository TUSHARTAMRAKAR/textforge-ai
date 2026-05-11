"use client";
import { useState } from "react";
import { Sparkles, Loader2, BookOpen, ExternalLink, Copy, Download, Search } from "lucide-react";
import { useGenerateStore } from "@/lib/store";
import toast from "react-hot-toast";
import { exportPDF, exportDOCX } from "@/lib/exporters";

// ─────────────────────────────────────────────────────────────
//  Citations Page — /citations
//
//  WHY: Generates academic text with REAL verifiable citations
//  from Semantic Scholar + CrossRef APIs.
//  Answer to professor: "Every paragraph has real sources."
// ─────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CitationData {
  inText:      string;
  bibliography: string;
  citation: {
    title:   string;
    authors: string[];
    year:    number | null;
    journal?: string;
    doi?:    string;
    url?:    string;
    source:  string;
  };
}

const STYLE_INFO = {
  apa:  { label: "APA 7th",  example: "(Smith et al., 2023)",  color: "#7F77DD" },
  mla:  { label: "MLA 9th",  example: "(Smith 2023)",          color: "#1D9E75" },
  ieee: { label: "IEEE",     example: "[1], [2], [3]",          color: "#185FA5" },
};

// ── Renders cited text with highlighted citations and bold references ──
function CitedTextRenderer({ text, style }: { text: string; style: string }) {
  if (!text) return null;

  // Split into paragraphs
  const paragraphs = text.split(/\n+/).filter(p => p.trim());

  return (
    <div>
      {paragraphs.map((para, i) => {
        const isReferencesHeader = /^(references|bibliography|works cited)/i.test(para.trim());
        const isReferenceItem    = /^\[?\d+\]?\s+/.test(para.trim()) || /^[A-Z][a-z]+,\s+[A-Z]/.test(para.trim());

        if (isReferencesHeader) {
          return (
            <div key={i} style={{ marginTop: "28px", marginBottom: "12px" }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px",
                color: "var(--brand)", letterSpacing: "0.02em",
                borderBottom: "2px solid var(--brand)", paddingBottom: "6px",
                marginBottom: "12px",
              }}>
                {para.trim()}
              </div>
            </div>
          );
        }

        if (isReferenceItem) {
          return (
            <p key={i} style={{
              fontFamily: "var(--font-mono)", fontSize: "12px",
              color: "var(--text-2)", lineHeight: "1.7",
              marginBottom: "8px", paddingLeft: "20px",
              textIndent: "-20px", borderLeft: "2px solid var(--border)",
              paddingLeft: "12px", textIndent: "0",
            }}>
              {para.trim()}
            </p>
          );
        }

        // Highlight in-text citations
        // APA: (Author, Year) or (Author et al., Year)
        // MLA: (Author Year)
        // IEEE: [1] [2]
        const highlighted = para.replace(
          /(\([A-Z][^)]{2,60}\d{4}[^)]*\)|\[[0-9,\s]+\])/g,
          (match) => `__CITE__${match}__CITE__`
        );
        const parts = highlighted.split("__CITE__");

        return (
          <p key={i} style={{ marginBottom: "16px", lineHeight: "1.9" }}>
            {parts.map((part, j) => {
              if (j % 2 === 1) {
                // This is a citation — highlight it
                return (
                  <span key={j} style={{
                    color: "var(--brand)",
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    background: "var(--brand-subtle)",
                    padding: "1px 4px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-hover)",
                  }}>
                    {part}
                  </span>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function CitationsPage() {
  const [topic, setTopic]           = useState("");
  const [tone, setTone]             = useState("academic");
  const [length, setLength]         = useState("medium");
  const [style, setStyle]           = useState<"apa"|"mla"|"ieee">("apa");
  const [citationCount, setCitationCount] = useState(5);
  const [isGenerating, setIsGenerating]   = useState(false);
  const [output, setOutput]         = useState("");
  const [citations, setCitations]   = useState<CitationData[]>([]);
  const [isDone, setIsDone]         = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim() || topic.trim().length < 3) {
      toast.error("Please enter a topic (min 3 characters)");
      return;
    }

    // Reset state
    setIsGenerating(true);
    setOutput("");
    setIsDone(false);
    // Keep citations visible — don't clear them
    // setCitations([]) was causing the bug

    try {
      const response = await fetch(`${API_URL}/api/citations/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, length, style, citationCount }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Generation failed");
      }

      const reader  = response.body!.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";
      let   citCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let payload: any;
          try { payload = JSON.parse(raw); }
          catch { continue; }

          if (payload.type === "citations") {
            setCitations(payload.citations);
            citCount = payload.citations?.length || 0;
          } else if (payload.text) {
            setOutput((prev) => prev + payload.text);
          } else if (payload.error) {
            setIsGenerating(false);
            toast.error(payload.error);
            return;
          } else if (payload.done) {
            setIsDone(true);
            setIsGenerating(false);
            toast.success(`Generated with ${citCount} real citations!`);
            return;
          }
        }
      }

      // Stream ended without done event
      setIsGenerating(false);
      setIsDone(true);

    } catch (err: any) {
      setIsGenerating(false);
      toast.error(err.message || "Generation failed — check your connection");
    }
  };

  const handleExport = async (type: "pdf" | "docx") => {
    if (!output) return;
    const gen = { topic: `[CITED] ${topic}`, output, tone, length, language: "en", wordCount: output.split(/\s+/).length };
    try {
      if (type === "pdf")  { await exportPDF(gen);  toast.success("PDF downloaded!"); }
      if (type === "docx") { await exportDOCX(gen); toast.success("DOCX downloaded!"); }
    } catch (e: any) { toast.error(e?.message || "Export failed"); }
  };

  const selectedStyle = STYLE_INFO[style];

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <BookOpen size={22} color="var(--brand)" />
            <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "28px", color: "var(--text-1)", letterSpacing: "-0.02em" }}>
              Academic Citations Generator
            </h1>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-3)" }}>
            Generate academic text with real, verifiable citations from 200M+ papers via Semantic Scholar & CrossRef.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", alignItems: "start" }}>

          {/* ── Left panel — controls ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Topic */}
            <div>
              <label style={labelStyle}>Research Topic</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The impact of machine learning on drug discovery"
                rows={3}
                style={{ ...inputStyle, resize: "vertical" as const }}
              />
            </div>

            {/* Citation Style */}
            <div>
              <label style={labelStyle}>Citation Style</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {(["apa","mla","ieee"] as const).map((s) => (
                  <button key={s} onClick={() => setStyle(s)} style={{
                    padding: "10px 6px", borderRadius: "8px", textAlign: "center",
                    border: `1px solid ${style === s ? STYLE_INFO[s].color : "var(--border)"}`,
                    background: style === s ? `${STYLE_INFO[s].color}15` : "var(--bg-1)",
                    cursor: "pointer", transition: "all 0.12s",
                  }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "13px", color: style === s ? STYLE_INFO[s].color : "var(--text-1)" }}>
                      {STYLE_INFO[s].label}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", marginTop: "3px" }}>
                      {STYLE_INFO[s].example}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label style={labelStyle}>Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} style={inputStyle}>
                <option value="academic">Academic — scholarly & precise</option>
                <option value="formal">Formal — professional</option>
                <option value="casual">Casual — accessible</option>
              </select>
            </div>

            {/* Length */}
            <div>
              <label style={labelStyle}>Length</label>
              <select value={length} onChange={(e) => setLength(e.target.value)} style={inputStyle}>
                <option value="short">Short — ~150 words</option>
                <option value="medium">Medium — ~350 words</option>
                <option value="long">Long — ~700 words</option>
              </select>
            </div>

            {/* Citation count */}
            <div>
              <label style={labelStyle}>Number of Citations: <span style={{ color: "var(--brand)", fontFamily: "var(--font-mono)" }}>{citationCount}</span></label>
              <input
                type="range" min={3} max={8} value={citationCount}
                onChange={(e) => setCitationCount(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--brand)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)" }}>3 min</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)" }}>8 max</span>
              </div>
            </div>

            {/* Generate button */}
            <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} style={{
              width: "100%", padding: "13px",
              background: isGenerating || !topic.trim() ? "var(--bg-3)" : "var(--brand)",
              border: "none", borderRadius: "10px",
              cursor: isGenerating || !topic.trim() ? "not-allowed" : "pointer",
              color: isGenerating || !topic.trim() ? "var(--text-4)" : "var(--bg-base)",
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "15px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.15s",
            }}>
              {isGenerating
                ? <><Loader2 size={17} className="spin" /> Fetching sources & generating…</>
                : <><Sparkles size={17} /> Generate with Real Citations</>
              }
            </button>

            {/* How it works */}
            <div style={{ padding: "12px 14px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "10px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                How it works
              </p>
              {[
                "1. Searches Semantic Scholar (200M papers)",
                "2. Cross-checks with CrossRef (130M works)",
                `3. Formats in ${selectedStyle.label} style`,
                "4. Gemini writes with citations woven in",
                "5. Full bibliography auto-generated",
              ].map((step) => (
                <p key={step} style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-3)", marginBottom: "4px" }}>
                  {step}
                </p>
              ))}
            </div>
          </div>

          {/* ── Right panel — output ── */}
          <div>
            {/* Citations found */}
            {citations.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Search size={14} color="var(--brand)" />
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: "var(--text-1)" }}>
                    {citations.length} Real Sources Found
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: selectedStyle.color, background: `${selectedStyle.color}15`, padding: "1px 8px", borderRadius: "99px" }}>
                    {selectedStyle.label} format
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {citations.map((c, i) => (
                    <div key={i} style={{
                      padding: "10px 14px", background: "var(--bg-1)",
                      border: "1px solid var(--border)", borderRadius: "8px",
                      display: "flex", alignItems: "flex-start", gap: "10px",
                    }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: selectedStyle.color, fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>
                        {c.inText}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-1)", fontWeight: 500, marginBottom: "2px" }}>
                          {c.citation.title.length > 80 ? c.citation.title.slice(0, 80) + "…" : c.citation.title}
                        </p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", marginBottom: "3px" }}>
                          {c.citation.authors.slice(0, 2).join(", ")} · {c.citation.year} {c.citation.journal ? `· ${c.citation.journal}` : ""}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {(c.citation as any).citationCount > 0 && (
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#1D9E75", background: "#E1F5EE", padding: "1px 6px", borderRadius: "99px" }}>
                              📊 {(c.citation as any).citationCount} citations
                            </span>
                          )}
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", background: "var(--bg-2)", padding: "1px 6px", borderRadius: "99px" }}>
                            {c.citation.source === "semantic_scholar" ? "Semantic Scholar" : "CrossRef"}
                          </span>
                        </div>
                      </div>
                      {c.citation.url && (
                        <a href={c.citation.url} target="_blank" rel="noreferrer" style={{ color: "var(--text-4)", flexShrink: 0 }}>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated output */}
            {output && (
              <div>
                {/* Action buttons */}
                {isDone && (
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} style={actionBtnStyle}>
                      <Copy size={13} /> Copy
                    </button>
                    <button onClick={() => handleExport("pdf")} style={actionBtnStyle}>
                      <Download size={13} /> PDF
                    </button>
                    <button onClick={() => handleExport("docx")} style={actionBtnStyle}>
                      <Download size={13} /> DOCX
                    </button>
                  </div>
                )}

                <div style={{
                  background: "var(--bg-1)", border: "1px solid var(--border)",
                  borderRadius: "14px", padding: "28px 32px",
                  fontFamily: "var(--font-serif)", fontSize: "15px",
                  lineHeight: "1.9", color: "var(--text-1)",
                }}>
                  <CitedTextRenderer text={output} style={style} />
                  {isGenerating && <span style={{ display: "inline-block", width: "2px", height: "16px", background: "var(--brand)", marginLeft: "2px", animation: "blink 1s infinite" }} />}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!output && !isGenerating && (
              <div style={{
                height: "400px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "var(--bg-1)", border: `1px solid ${citations.length > 0 ? "var(--brand)" : "var(--border)"}`,
                borderRadius: "14px", gap: "12px",
                transition: "border-color 0.3s",
              }}>
                <BookOpen size={36} color={citations.length > 0 ? "var(--brand)" : "var(--text-4)"} />
                {citations.length > 0 ? (
                  <>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 600, color: "var(--brand)", textAlign: "center" }}>
                      {citations.length} real sources ready!
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-3)", textAlign: "center", maxWidth: "280px" }}>
                      Click <strong>"Generate with Real Citations"</strong> to create your cited academic text
                    </p>
                    <div style={{ fontSize: "28px", animation: "bounce 1s infinite" }}>👆</div>
                  </>
                ) : (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-3)", textAlign: "center", maxWidth: "300px" }}>
                    Your cited academic text will appear here with real sources from Semantic Scholar & CrossRef
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-sans)", fontSize: "11px",
  fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase",
  color: "var(--text-3)", marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-1)", border: "1px solid var(--border)",
  borderRadius: "8px", padding: "9px 12px", color: "var(--text-1)",
  fontFamily: "var(--font-sans)", fontSize: "13px", outline: "none",
  boxSizing: "border-box",
};

const actionBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "5px",
  padding: "7px 12px", borderRadius: "7px",
  background: "var(--bg-1)", border: "1px solid var(--border)",
  cursor: "pointer", color: "var(--text-2)",
  fontFamily: "var(--font-sans)", fontSize: "12px", transition: "all 0.12s",
};
