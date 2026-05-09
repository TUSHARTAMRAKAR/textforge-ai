"use client";
import { useGenerateStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Sparkles, Loader2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

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
    topic, tone, length, isStreaming,
    setTopic, setTone, setLength,
    appendOutput, setIsStreaming, setIsDone, setError, resetOutput,
  } = useGenerateStore();

  const [example, setExample] = useState(EXAMPLES[0]);
  useEffect(() => { setExample(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]); }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic first"); return; }
    if (topic.trim().length < 3) { toast.error("Topic must be at least 3 characters"); return; }
    resetOutput(); setIsStreaming(true);
    try {
      await api.postGenerate(
        { topic: topic.trim(), tone, length },
        (text) => appendOutput(text),
        ()     => { setIsStreaming(false); setIsDone(true); toast.success("Generation complete!"); },
        (err)  => { setIsStreaming(false); setError(err); toast.error(err); }
      );
    } catch (err: any) {
      setIsStreaming(false);
      const msg = err?.message || "Something went wrong";
      setError(msg); toast.error(msg);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

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

      {/* Length */}
      <div>
        <label className="label">Length</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {LENGTHS.map(({ value, label, words }) => (
            <button key={value} onClick={() => setLength(value)} disabled={isStreaming} style={{
              padding: "14px 10px",
              borderRadius: "10px",
              border: `1px solid ${length === value ? "var(--border-focus)" : "var(--border)"}`,
              background: length === value ? "var(--brand-subtle)" : "var(--bg-2)",
              cursor: "pointer", textAlign: "center",
              transition: "all 0.15s ease",
              boxShadow: length === value ? "0 0 0 3px var(--brand-glow)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px",
                color: length === value ? "var(--brand)" : "var(--text-1)",
              }}>{label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)", marginTop: "3px" }}>{words}</div>
            </button>
          ))}
        </div>
      </div>

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
