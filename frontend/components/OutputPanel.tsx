"use client";
import { useGenerateStore } from "@/lib/store";
import { api } from "@/lib/api";
import {
  Copy, Download, FileText, Loader2, Wand2, Share2, FileType, FileCode,
  ChevronDown, Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { exportPDF, exportDOCX, exportMarkdown } from "@/lib/exporters";
import { createPortal } from "react-dom";

const REFINE_ACTIONS = [
  { id: "shorter",     label: "Shorter",     instruction: "Make this text noticeably shorter while keeping the key ideas." },
  { id: "longer",      label: "Longer",      instruction: "Expand this text with more detail, examples, and supporting points." },
  { id: "more-formal", label: "More formal", instruction: "Rewrite this in a more formal, professional tone." },
  { id: "simpler",     label: "Simpler",     instruction: "Rewrite this in simpler language a 12-year-old could understand." },
];

interface Props {
  topbarMode?: boolean; // renders Share/Export into #topbar-actions portal
  inlineMode?: boolean; // hides empty state — used when past messages shown above
}

export function OutputPanel({ topbarMode, inlineMode }: Props) {
  const {
    output, isStreaming, isDone, wordCount, error, savedId,
    topic, tone, length, language,
    appendOutput, setIsStreaming, setIsDone, setError, setSavedId, resetOutput,
  } = useGenerateStore();

  const [exportOpen, setExportOpen]   = useState(false);
  const [favourited, setFavourited]   = useState(false);
  const [refining, setRefining]       = useState<string | null>(null);
  const [topbarEl, setTopbarEl]       = useState<Element | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setFavourited(false); }, [savedId]);
  useEffect(() => {
    if (topbarMode) setTopbarEl(document.getElementById("topbar-actions"));
  }, [topbarMode]);

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied!");
  };

  const handleExport = async (kind: "pdf" | "docx" | "md" | "txt") => {
    if (!output) return;
    setExportOpen(false);
    const gen = { topic, output, tone, length, language, wordCount };
    try {
      if (kind === "pdf")  { await exportPDF(gen);      toast.success("PDF downloaded");  return; }
      if (kind === "docx") { await exportDOCX(gen);     toast.success("DOCX downloaded"); return; }
      if (kind === "md")   { exportMarkdown(gen);       toast.success("Markdown downloaded"); return; }
      const blob = new Blob([output], { type: "text/plain" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `${topic.slice(0, 40) || "textforge"}.txt`; a.click();
      URL.revokeObjectURL(url);
      toast.success("TXT downloaded");
    } catch (e: any) { toast.error(e?.message || "Export failed"); }
  };

  const handleShare = async () => {
    if (!savedId) { toast.error("Generate something first"); return; }
    const url = `${window.location.origin}/s/${savedId}`;
    try { await navigator.clipboard.writeText(url); toast.success("Share link copied!"); }
    catch { window.prompt("Copy share link:", url); }
  };

  const handleFavourite = async () => {
    if (!savedId) { toast.error("Generate something first"); return; }
    try {
      const updated = await api.toggleFavourite(savedId);
      setFavourited(!!updated.isFavourite);
      toast.success(updated.isFavourite ? "⭐ Starred!" : "Unstarred");
    } catch { toast.error("Failed"); }
  };

  const handleRefine = async (action: typeof REFINE_ACTIONS[number]) => {
    if (!output || !savedId) { toast.error("Wait for the original generation to finish"); return; }
    const original = output;
    setRefining(action.id);
    resetOutput();
    setIsStreaming(true);
    try {
      await api.postRefine(
        { originalText: original, instruction: action.instruction, topic, tone, length, language, refinementOf: savedId },
        (text) => appendOutput(text),
        (newId) => { setIsStreaming(false); setIsDone(true); if (newId) setSavedId(newId); toast.success(`Refined: ${action.label}`); setRefining(null); },
        (err)  => { setIsStreaming(false); setError(err); toast.error(err); setRefining(null); }
      );
    } catch (e: any) {
      setIsStreaming(false); setError(e?.message || "Refine failed");
      toast.error(e?.message || "Refine failed"); setRefining(null);
    }
  };

  const isEmpty = !output && !isStreaming && !error;

  // ── Action buttons (shared between topbar portal and inline header) ──
  const ActionButtons = (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {isDone && savedId && (
        <>
          <button onClick={handleFavourite} title="Star" style={ghostBtn}>
            <Star size={14} fill={favourited ? "var(--brand)" : "none"} color={favourited ? "var(--brand)" : "currentColor"} />
          </button>
          <button onClick={handleShare} title="Copy share link" style={ghostBtn}>
            <Share2 size={14} />
            <span style={{ fontSize: "12px" }}>Share</span>
          </button>
        </>
      )}
      {output && (
        <>
          <button onClick={handleCopy} style={ghostBtn}>
            <Copy size={14} />
            <span style={{ fontSize: "12px" }}>Copy</span>
          </button>
          <div ref={exportRef} style={{ position: "relative" }}>
            <button onClick={() => setExportOpen((v) => !v)} style={ghostBtn}>
              <Download size={14} />
              <span style={{ fontSize: "12px" }}>Export</span>
              <ChevronDown size={11} style={{ transform: exportOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }} />
            </button>
            {exportOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 300,
                background: "var(--bg-1)", border: "1px solid var(--border-hover)",
                borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                padding: "4px", minWidth: "170px",
              }}>
                {[
                  { id: "pdf",  label: "PDF document",  Icon: FileType },
                  { id: "docx", label: "Word document",  Icon: FileText },
                  { id: "md",   label: "Markdown",       Icon: FileCode },
                  { id: "txt",  label: "Plain text",     Icon: FileText },
                ].map(({ id, label, Icon }) => (
                  <button key={id} onClick={() => handleExport(id as any)} style={{
                    width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: "7px",
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "13px",
                    display: "flex", alignItems: "center", gap: "8px", transition: "background 0.12s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <Icon size={14} color="var(--text-3)" />{label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Render action buttons into topbar portal */}
      {topbarMode && topbarEl && createPortal(ActionButtons, topbarEl)}

      {/* ── Main output area ── */}
      <div style={{
        maxWidth: "760px", margin: "0 auto",
        display: "flex", flexDirection: "column",
        minHeight: "100%",
      }}>

        {/* Status badges — shown in content area (not topbar) */}
        {(isStreaming || isDone) && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <FileText size={14} color="var(--brand)" />
            {isDone && (
              <span style={{
                background: "var(--brand-subtle)", color: "var(--brand)",
                border: "1px solid var(--border-hover)",
                borderRadius: "99px", padding: "2px 9px",
                fontSize: "11px", fontFamily: "var(--font-mono)",
              }}>{wordCount} words</span>
            )}
            {isStreaming && (
              <span style={{
                display: "flex", alignItems: "center", gap: "5px",
                background: "rgba(212,126,48,0.08)", color: "var(--brand)",
                border: "1px solid rgba(212,126,48,0.2)",
                borderRadius: "99px", padding: "2px 9px",
                fontSize: "11px", fontFamily: "var(--font-mono)",
              }}>
                <Loader2 size={10} className="spin" />
                {refining ? `Refining: ${refining}` : "Generating…"}
              </span>
            )}
          </div>
        )}

        {/* Empty state — hidden in inlineMode since past messages show above */}
        {isEmpty && !inlineMode && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: "var(--bg-2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
            }}>
              <FileText size={22} color="var(--text-4)" />
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "15px", color: "var(--text-2)", marginBottom: "6px" }}>
              Your generated text appears here
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-4)" }}>
              Type a topic below and hit Generate
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#E05050", fontWeight: 500 }}>{error}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-4)", marginTop: "5px" }}>Please try again</p>
          </div>
        )}

        {/* Generated text — displayed like a chat message */}
        {output && (
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: "14px", padding: "28px 32px",
            marginBottom: "16px",
          }}>
            <p className={`generation-output ${isStreaming ? "streaming-cursor" : ""}`}>
              {output}
            </p>
          </div>
        )}

        {/* Refine bar */}
        {isDone && output && savedId && (
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            gap: "8px", padding: "4px 0 16px",
          }}>
            <span style={{
              display: "flex", alignItems: "center", gap: "5px",
              fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)",
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              <Wand2 size={12} color="var(--brand)" /> Refine
            </span>
            {REFINE_ACTIONS.map((a) => (
              <button key={a.id} onClick={() => handleRefine(a)} disabled={isStreaming} style={{
                padding: "6px 12px",
                background: "var(--bg-2)", border: "1px solid var(--border)",
                borderRadius: "8px", cursor: isStreaming ? "not-allowed" : "pointer",
                color: "var(--text-1)",
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
                transition: "all 0.15s", opacity: isStreaming ? 0.5 : 1,
              }}
                onMouseEnter={(e) => { if (!isStreaming) { const el = e.currentTarget as HTMLElement; el.style.background = "var(--brand-subtle)"; el.style.borderColor = "var(--border-hover)"; el.style.color = "var(--brand)"; } }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--bg-2)"; el.style.borderColor = "var(--border)"; el.style.color = "var(--text-1)"; }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const ghostBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "5px",
  padding: "6px 10px", borderRadius: "8px",
  background: "transparent", border: "none", cursor: "pointer",
  color: "var(--text-2)", fontFamily: "var(--font-sans)",
  transition: "all 0.12s",
};
