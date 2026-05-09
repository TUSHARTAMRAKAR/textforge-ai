"use client";
import { useGenerateStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Sparkles, Loader2, RotateCcw, ChevronDown, X, Plus } from "lucide-react";
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
  { value: "long",   label: "Long",   words: "~700 words" },
] as const;

const EXAMPLES = [
  "The future of artificial intelligence",
  "Climate change and renewable energy",
  "The history of the internet",
  "Quantum computing explained simply",
  "Why sleep is essential for humans",
];

export function PromptBuilder() {
  const {
    topic, tone, length, language, keywords, isStreaming,
    setTopic, setTone, setLength, setLanguage, setKeywords,
    appendOutput, setIsStreaming, setIsDone, setError, setSavedId, resetOutput,
  } = useGenerateStore();

  const [example, setExample] = useState(EXAMPLES[0]);
  const [showLanguage, setShowLanguage] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExample(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]);
  }, []);

  // Close the language dropdown on outside click
  useEffect(() => {
    if (!showLanguage) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLanguage(false);
      }
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
        (text) => appendOutput(text),
        (savedId) => {
          setIsStreaming(false);
          setIsDone(true);
          if (savedId) setSavedId(savedId);
          toast.success("Generation complete!");
        },
        (err) => { setIsStreaming(false); setError(err); toast.error(err); }
      );
    } catch (err: any) {
      setIsStreaming(false);
      const msg = err?.message || "Something went wrong";
      setError(msg); toast.error(msg);
    }
  };

  const selectedLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

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
          placeholder="e.g. The impact of AI on healthcare..."
          rows={4}
          disabled={isStreaming}
          className="input-base"
          maxLength={500}
          style={{ fontSize: "15px", lineHeight: "1.65" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)" }}>
            Try: {example}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)" }}>
            {topic.length}/500
          </span>
        </div>
      </div>

      {/* Tone */}
      <div>
        <label className="label">Tone</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {TONES.map(({ value, label, desc }) => (
            <button key={value} onClick={() => setTone(value)} disabled={isStreaming} style={{
              padding: "14px 16px",
              borderRadius: "10px",
              border: `1px solid ${tone === value ? "var(--border-focus)" : "var(--border)"}`,
              background: tone === value ? "var(--brand-subtle)" : "var(--bg-2)",
              cursor: "pointer", textAlign: "left",
              transition: "all 0.15s ease",
              boxShadow: tone === value ? "0 0 0 3px var(--brand-glow)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px",
                color: tone === value ? "var(--brand)" : "var(--text-1)",
                marginBottom: "3px",
              }}>{label}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-3)" }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Length + Language row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "16px" }}>
        <div>
          <label className="label">Length</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            {LENGTHS.map(({ value, label, words }) => (
              <button key={value} onClick={() => setLength(value)} disabled={isStreaming} style={{
                padding: "12px 6px",
                borderRadius: "10px",
                border: `1px solid ${length === value ? "var(--border-focus)" : "var(--border)"}`,
                background: length === value ? "var(--brand-subtle)" : "var(--bg-2)",
                cursor: "pointer", textAlign: "center",
                transition: "all 0.15s ease",
                boxShadow: length === value ? "0 0 0 3px var(--brand-glow)" : "none",
              }}>
                <div style={{
                  fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px",
                  color: length === value ? "var(--brand)" : "var(--text-1)",
                }}>{label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", marginTop: "2px" }}>{words}</div>
              </button>
            ))}
          </div>
        </div>

        <div ref={langRef} style={{ position: "relative" }}>
          <label className="label">Language</label>
          <button
            onClick={() => setShowLanguage((v) => !v)}
            disabled={isStreaming}
            style={{
              width: "100%",
              padding: "12px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-2)",
              color: "var(--text-1)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                background: "var(--brand-subtle)", color: "var(--brand)",
                padding: "2px 6px", borderRadius: "4px",
                border: "1px solid var(--border-hover)",
              }}>{selectedLang.flag}</span>
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
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setShowLanguage(false); }}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "8px 10px", borderRadius: "7px",
                    background: l.code === language ? "var(--brand-subtle)" : "transparent",
                    border: "none", cursor: "pointer",
                    color: l.code === language ? "var(--brand)" : "var(--text-1)",
                    fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
                    display: "flex", alignItems: "center", gap: "10px",
                  }}
                  onMouseEnter={(e) => { if (l.code !== language) (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; }}
                  onMouseLeave={(e) => { if (l.code !== language) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "10px",
                    background: "var(--bg-3)", padding: "2px 5px",
                    borderRadius: "4px", color: "var(--text-2)",
                  }}>{l.flag}</span>
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
        <button
          onClick={handleGenerate}
          disabled={isStreaming || !topic.trim()}
          className="btn-primary"
          style={{ flex: 1, justifyContent: "center", padding: "14px", fontSize: "15px" }}
        >
          {isStreaming
            ? <><Loader2 size={17} className="spin" /> Generating…</>
            : <><Sparkles size={17} /> Generate Text</>
          }
        </button>
        <button
          onClick={resetOutput}
          disabled={isStreaming}
          title="Clear output"
          style={{
            width: "48px",
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "var(--text-3)", transition: "all 0.15s",
            flexShrink: 0,
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

// ── Keyword chips input ─────────────────────────────────────
function KeywordsInput({
  value, onChange, disabled,
}: { value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) {
  const [draft, setDraft] = useState("");

  const addKeyword = () => {
    const k = draft.trim().slice(0, 40);
    if (!k) return;
    if (value.includes(k)) { setDraft(""); return; }
    if (value.length >= 10) { toast.error("Maximum 10 keywords"); return; }
    onChange([...value, k]);
    setDraft("");
  };

  const removeKeyword = (k: string) => onChange(value.filter((x) => x !== k));

  return (
    <div>
      <label className="label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        SEO Keywords
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "10px",
          color: "var(--text-3)", textTransform: "none",
          background: "var(--bg-2)", padding: "1px 6px", borderRadius: "4px",
          border: "1px solid var(--border)", letterSpacing: "0",
        }}>optional</span>
      </label>
      <div style={{
        background: "var(--bg-2)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "8px",
        display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center",
      }}>
        {value.map((k) => (
          <span key={k} style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "var(--brand-subtle)", color: "var(--brand)",
            border: "1px solid var(--border-hover)",
            borderRadius: "6px", padding: "4px 6px 4px 9px",
            fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
          }}>
            {k}
            <button onClick={() => removeKeyword(k)} disabled={disabled} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "inherit", display: "flex", padding: "1px",
            }}>
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addKeyword(); }
            if (e.key === "Backspace" && !draft && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={value.length === 0 ? "Type a keyword and press Enter…" : "Add another…"}
          disabled={disabled || value.length >= 10}
          style={{
            flex: 1, minWidth: "140px",
            background: "transparent", border: "none", outline: "none",
            color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "13px",
            padding: "4px 6px",
          }}
        />
        {draft && (
          <button onClick={addKeyword} disabled={disabled} style={{
            background: "var(--brand)", color: "var(--bg-base)",
            border: "none", borderRadius: "5px", padding: "4px 8px",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "3px",
            fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600,
          }}>
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
