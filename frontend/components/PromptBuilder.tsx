"use client";
import { useGenerateStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Sparkles, Loader2, RotateCcw, ChevronDown, ChevronUp, X, Plus, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { LANGUAGES } from "@/lib/languages";
import { TemplatePicker } from "./TemplatePicker";

const TONES = [
  { value: "formal",   label: "Formal",   desc: "Professional & authoritative" },
  { value: "casual",   label: "Casual",   desc: "Friendly & conversational"    },
  { value: "creative", label: "Creative", desc: "Vivid & imaginative"           },
  { value: "academic", label: "Academic", desc: "Scholarly & precise"           },
] as const;

const LENGTHS = [
  { value: "short",  label: "Short",  words: "~150 words" },
  { value: "medium", label: "Medium", words: "~350 words" },
  { value: "long",   label: "Long",   words: "~700 words"  },
] as const;

const EXAMPLES = [
  "The future of artificial intelligence",
  "Climate change and renewable energy",
  "The history of the internet",
  "Quantum computing explained simply",
  "Why sleep is essential for humans",
];

interface Props {
  compactMode?: boolean;
}

export function PromptBuilder({ compactMode }: Props) {
  const {
    topic, tone, length, language, keywords, isStreaming,
    setTopic, setTone, setLength, setLanguage, setKeywords,
    appendOutput, setIsStreaming, setIsDone, setError, setSavedId, resetOutput,
  } = useGenerateStore();

  const [example, setExample]         = useState(EXAMPLES[0]);
  const [showLanguage, setShowLanguage] = useState(false);
  const [optionsOpen, setOptionsOpen]   = useState(false);
  const [kwDraft, setKwDraft]           = useState("");
  const langRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setExample(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]);
  }, []);

  useEffect(() => {
    if (!showLanguage) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLanguage(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLanguage]);

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic first"); return; }
    if (topic.trim().length < 3) { toast.error("Topic must be at least 3 characters"); return; }
    resetOutput(); setIsStreaming(true);
    try {
      await api.postGenerate(
        { topic: topic.trim(), tone, length, language, keywords },
        (text)    => appendOutput(text),
        (savedId) => { setIsStreaming(false); setIsDone(true); if (savedId) setSavedId(savedId); toast.success("Done!"); },
        (err)     => { setIsStreaming(false); setError(err); toast.error(err); }
      );
    } catch (err: any) {
      setIsStreaming(false);
      const msg = err?.message || "Something went wrong";
      setError(msg); toast.error(msg);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); handleGenerate(); }
  };

  const addKw = () => {
    const k = kwDraft.trim().slice(0, 40);
    if (!k) return;
    if (keywords.includes(k)) { setKwDraft(""); return; }
    if (keywords.length >= 10) { toast.error("Max 10 keywords"); return; }
    setKeywords([...keywords, k]);
    setKwDraft("");
  };

  const selectedLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  // ── Summary of current settings shown in the input bar ──────
  const settingsSummary = `${tone} · ${length} · ${selectedLang.flag} ${selectedLang.name}${keywords.length > 0 ? ` · ${keywords.length} keyword${keywords.length > 1 ? "s" : ""}` : ""}`;

  // ══════════════════════════════════════════════════════════════
  //  COMPACT MODE — Claude-style bottom bar with collapsible panel
  // ══════════════════════════════════════════════════════════════
  if (compactMode) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>

        {/* ── Collapsible options panel ── */}
        {optionsOpen && (
          <div style={{
            borderBottom: "1px solid var(--border)",
            padding: "16px 16px 14px",
            display: "flex", flexDirection: "column", gap: "16px",
            background: "var(--bg-2)",
          }}>

            {/* Templates */}
            <div>
              <TemplatePicker disabled={isStreaming} />
            </div>

            {/* Tone */}
            <div>
              <p style={sectionLabel}>Tone</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {TONES.map(({ value, label, desc }) => (
                  <button key={value} onClick={() => setTone(value)} disabled={isStreaming} style={{
                    padding: "10px 12px", borderRadius: "9px", textAlign: "left", cursor: "pointer",
                    border: `1px solid ${tone === value ? "var(--border-focus)" : "var(--border)"}`,
                    background: tone === value ? "var(--brand-subtle)" : "var(--bg-1)",
                    transition: "all 0.12s",
                  }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: tone === value ? "var(--brand)" : "var(--text-1)", marginBottom: "2px" }}>{label}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-3)" }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length + Language row */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "14px" }}>
              <div>
                <p style={sectionLabel}>Length</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
                  {LENGTHS.map(({ value, label, words }) => (
                    <button key={value} onClick={() => setLength(value)} disabled={isStreaming} style={{
                      padding: "10px 6px", borderRadius: "9px", textAlign: "center", cursor: "pointer",
                      border: `1px solid ${length === value ? "var(--border-focus)" : "var(--border)"}`,
                      background: length === value ? "var(--brand-subtle)" : "var(--bg-1)",
                      transition: "all 0.12s",
                    }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: length === value ? "var(--brand)" : "var(--text-1)" }}>{label}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", marginTop: "2px" }}>{words}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div ref={langRef} style={{ position: "relative" }}>
                <p style={sectionLabel}>Language</p>
                <button
                  onClick={() => setShowLanguage((v) => !v)}
                  disabled={isStreaming}
                  style={{
                    width: "100%", padding: "10px 10px",
                    borderRadius: "9px", border: "1px solid var(--border)",
                    background: "var(--bg-1)", color: "var(--text-1)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                    fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
                    transition: "all 0.12s",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "10px",
                      background: "var(--brand-subtle)", color: "var(--brand)",
                      padding: "2px 5px", borderRadius: "4px",
                      border: "1px solid var(--border-hover)",
                    }}>{selectedLang.flag}</span>
                    {selectedLang.nativeName}
                  </span>
                  <ChevronDown size={13} style={{ opacity: 0.5 }} />
                </button>
                {showLanguage && (
                  <div style={{
                    position: "absolute", bottom: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
                    background: "var(--bg-1)", border: "1px solid var(--border-hover)",
                    borderRadius: "10px", boxShadow: "0 -8px 24px rgba(0,0,0,0.3)",
                    padding: "4px", maxHeight: "220px", overflowY: "auto",
                  }}>
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => { setLanguage(l.code); setShowLanguage(false); }} style={{
                        width: "100%", textAlign: "left", padding: "7px 9px", borderRadius: "7px",
                        background: l.code === language ? "var(--brand-subtle)" : "transparent",
                        border: "none", cursor: "pointer",
                        color: l.code === language ? "var(--brand)" : "var(--text-1)",
                        fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
                        display: "flex", alignItems: "center", gap: "8px",
                      }}
                        onMouseEnter={(e) => { if (l.code !== language) (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; }}
                        onMouseLeave={(e) => { if (l.code !== language) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-3)", padding: "2px 5px", borderRadius: "4px", color: "var(--text-2)" }}>{l.flag}</span>
                        <span>{l.nativeName}</span>
                        <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-3)" }}>{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SEO Keywords */}
            <div>
              <p style={{ ...sectionLabel, display: "flex", alignItems: "center", gap: "7px" } as any}>
                SEO Keywords
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)",
                  textTransform: "none", background: "var(--bg-1)", padding: "1px 6px",
                  borderRadius: "4px", border: "1px solid var(--border)", letterSpacing: "0",
                }}>optional</span>
              </p>
              <div style={{
                background: "var(--bg-1)", border: "1px solid var(--border)",
                borderRadius: "9px", padding: "7px",
                display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center",
              }}>
                {keywords.map((k) => (
                  <span key={k} style={{
                    display: "inline-flex", alignItems: "center", gap: "3px",
                    background: "var(--brand-subtle)", color: "var(--brand)",
                    border: "1px solid var(--border-hover)",
                    borderRadius: "6px", padding: "3px 6px 3px 8px",
                    fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
                  }}>
                    {k}
                    <button onClick={() => setKeywords(keywords.filter((x) => x !== k))} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", padding: "1px" }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={kwDraft}
                  onChange={(e) => setKwDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addKw(); }
                    if (e.key === "Backspace" && !kwDraft && keywords.length > 0) setKeywords(keywords.slice(0, -1));
                  }}
                  placeholder={keywords.length === 0 ? "Type a keyword and press Enter…" : "Add another…"}
                  disabled={isStreaming || keywords.length >= 10}
                  style={{
                    flex: 1, minWidth: "130px",
                    background: "transparent", border: "none", outline: "none",
                    color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "12px",
                    padding: "3px 5px",
                  }}
                />
                {kwDraft && (
                  <button onClick={addKw} style={{
                    background: "var(--brand)", color: "var(--bg-base)",
                    border: "none", borderRadius: "5px", padding: "3px 8px",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "3px",
                    fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600,
                  }}>
                    <Plus size={10} /> Add
                  </button>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", marginTop: "4px" }}>
                Up to 10 terms — woven naturally into the output.
              </p>
            </div>
          </div>
        )}

        {/* ── Main input row ── */}
        <div style={{ padding: "10px 12px 4px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
          <textarea
            ref={textareaRef}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Type a topic… (e.g. ${example})`}
            rows={2}
            disabled={isStreaming}
            maxLength={500}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "15px",
              resize: "none", lineHeight: 1.6,
            }}
          />
          {/* Clear */}
          <button
            onClick={() => { resetOutput(); setTopic(""); }}
            disabled={isStreaming}
            title="Clear"
            style={{
              width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
              background: "var(--bg-2)", border: "1px solid var(--border)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-3)", transition: "all 0.12s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
          >
            <RotateCcw size={14} />
          </button>
          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={isStreaming || !topic.trim()}
            style={{
              height: "36px", padding: "0 18px", flexShrink: 0,
              background: isStreaming || !topic.trim() ? "var(--bg-3)" : "var(--brand)",
              border: "none", borderRadius: "10px",
              cursor: isStreaming || !topic.trim() ? "not-allowed" : "pointer",
              color: isStreaming || !topic.trim() ? "var(--text-3)" : "var(--bg-base)",
              fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px",
              display: "flex", alignItems: "center", gap: "6px",
              transition: "all 0.15s",
            }}
          >
            {isStreaming
              ? <><Loader2 size={15} className="spin" /> Generating…</>
              : <><Sparkles size={15} /> Generate</>
            }
          </button>
        </div>

        {/* ── Bottom toolbar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "4px 12px 10px",
        }}>
          {/* Settings toggle button + current settings summary */}
          <button
            onClick={() => setOptionsOpen((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: optionsOpen ? "var(--brand-subtle)" : "transparent",
              border: `1px solid ${optionsOpen ? "var(--border-hover)" : "transparent"}`,
              borderRadius: "7px", padding: "4px 9px",
              cursor: "pointer", color: optionsOpen ? "var(--brand)" : "var(--text-3)",
              fontFamily: "var(--font-sans)", fontSize: "12px",
              transition: "all 0.12s",
            }}
          >
            <SlidersHorizontal size={12} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {settingsSummary}
            </span>
            {optionsOpen ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)" }}>
              ⌘+Enter to generate
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)" }}>
              {topic.length}/500
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  //  FULL MODE — used on /generate page (original layout kept)
  // ══════════════════════════════════════════════════════════════
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Templates */}
      <TemplatePicker disabled={isStreaming} />

      {/* Topic */}
      <div>
        <label className="label">Topic</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. The impact of AI on healthcare..."
          rows={4}
          disabled={isStreaming}
          className="input-base"
          maxLength={500}
          style={{ fontSize: "15px", lineHeight: "1.65" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)" }}>Try: {example}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)" }}>{topic.length}/500</span>
        </div>
      </div>

      {/* Tone */}
      <div>
        <label className="label">Tone</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {TONES.map(({ value, label, desc }) => (
            <button key={value} onClick={() => setTone(value)} disabled={isStreaming} style={{
              padding: "14px 16px", borderRadius: "10px",
              border: `1px solid ${tone === value ? "var(--border-focus)" : "var(--border)"}`,
              background: tone === value ? "var(--brand-subtle)" : "var(--bg-2)",
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              boxShadow: tone === value ? "0 0 0 3px var(--brand-glow)" : "none",
            }}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: tone === value ? "var(--brand)" : "var(--text-1)", marginBottom: "3px" }}>{label}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-3)" }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Length + Language */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px" }}>
        <div>
          <label className="label">Length</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            {LENGTHS.map(({ value, label, words }) => (
              <button key={value} onClick={() => setLength(value)} disabled={isStreaming} style={{
                padding: "12px 6px", borderRadius: "10px",
                border: `1px solid ${length === value ? "var(--border-focus)" : "var(--border)"}`,
                background: length === value ? "var(--brand-subtle)" : "var(--bg-2)",
                cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                boxShadow: length === value ? "0 0 0 3px var(--brand-glow)" : "none",
              }}>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: length === value ? "var(--brand)" : "var(--text-1)" }}>{label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", marginTop: "2px" }}>{words}</div>
              </button>
            ))}
          </div>
        </div>
        <div ref={langRef} style={{ position: "relative" }}>
          <label className="label">Language</label>
          <button onClick={() => setShowLanguage((v) => !v)} disabled={isStreaming} style={{
            width: "100%", padding: "12px 12px", borderRadius: "10px",
            border: "1px solid var(--border)", background: "var(--bg-2)", color: "var(--text-1)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
            fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500, transition: "all 0.15s",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--brand-subtle)", color: "var(--brand)", padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--border-hover)" }}>{selectedLang.flag}</span>
              {selectedLang.nativeName}
            </span>
            <ChevronDown size={14} style={{ opacity: 0.6 }} />
          </button>
          {showLanguage && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
              background: "var(--bg-1)", border: "1px solid var(--border-hover)",
              borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              padding: "4px", maxHeight: "260px", overflowY: "auto",
            }}>
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => { setLanguage(l.code); setShowLanguage(false); }} style={{
                  width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: "7px",
                  background: l.code === language ? "var(--brand-subtle)" : "transparent",
                  border: "none", cursor: "pointer",
                  color: l.code === language ? "var(--brand)" : "var(--text-1)",
                  fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
                  display: "flex", alignItems: "center", gap: "10px",
                }}
                  onMouseEnter={(e) => { if (l.code !== language) (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; }}
                  onMouseLeave={(e) => { if (l.code !== language) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-3)", padding: "2px 5px", borderRadius: "4px", color: "var(--text-2)" }}>{l.flag}</span>
                  <span>{l.nativeName}</span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-3)" }}>{l.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO Keywords */}
      <KeywordsInput value={keywords} onChange={setKeywords} disabled={isStreaming} />

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
        <button onClick={handleGenerate} disabled={isStreaming || !topic.trim()} className="btn-primary"
          style={{ flex: 1, justifyContent: "center", padding: "14px", fontSize: "15px" }}>
          {isStreaming ? <><Loader2 size={17} className="spin" /> Generating…</> : <><Sparkles size={17} /> Generate Text</>}
        </button>
        <button onClick={resetOutput} disabled={isStreaming} title="Clear output" style={{
          width: "48px", background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-3)", transition: "all 0.15s", flexShrink: 0,
        }}
          onMouseEnter={(e) => { (e.currentTarget).style.background = "var(--bg-3)"; (e.currentTarget).style.color = "var(--text-1)"; }}
          onMouseLeave={(e) => { (e.currentTarget).style.background = "var(--bg-2)"; (e.currentTarget).style.color = "var(--text-3)"; }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Keywords chip input ──────────────────────────────────────
function KeywordsInput({ value, onChange, disabled }: { value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) {
  const [draft, setDraft] = useState("");
  const addKw = () => {
    const k = draft.trim().slice(0, 40);
    if (!k) return;
    if (value.includes(k)) { setDraft(""); return; }
    if (value.length >= 10) { toast.error("Maximum 10 keywords"); return; }
    onChange([...value, k]);
    setDraft("");
  };
  return (
    <div>
      <label className="label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        SEO Keywords
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", textTransform: "none", background: "var(--bg-2)", padding: "1px 6px", borderRadius: "4px", border: "1px solid var(--border)", letterSpacing: "0" }}>optional</span>
      </label>
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "8px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
        {value.map((k) => (
          <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "var(--brand-subtle)", color: "var(--brand)", border: "1px solid var(--border-hover)", borderRadius: "6px", padding: "4px 6px 4px 9px", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500 }}>
            {k}
            <button onClick={() => onChange(value.filter((x) => x !== k))} disabled={disabled} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", padding: "1px" }}>
              <X size={11} />
            </button>
          </span>
        ))}
        <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKw(); } if (e.key === "Backspace" && !draft && value.length > 0) onChange(value.slice(0, -1)); }}
          placeholder={value.length === 0 ? "Type a keyword and press Enter…" : "Add another…"}
          disabled={disabled || value.length >= 10}
          style={{ flex: 1, minWidth: "140px", background: "transparent", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "13px", padding: "4px 6px" }}
        />
        {draft && (
          <button onClick={addKw} disabled={disabled} style={{ background: "var(--brand)", color: "var(--bg-base)", border: "none", borderRadius: "5px", padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600 }}>
            <Plus size={11} /> Add
          </button>
        )}
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", marginTop: "5px" }}>
        Up to 10 terms — woven naturally into the output.
      </p>
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--text-3)",
  marginBottom: "8px",
};
