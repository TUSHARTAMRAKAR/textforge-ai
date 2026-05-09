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

const REFINE_ACTIONS = [
  { id: "shorter",     label: "Shorter",     instruction: "Make this text noticeably shorter while keeping the key ideas." },
  { id: "longer",      label: "Longer",      instruction: "Expand this text with more detail, examples, and supporting points." },
  { id: "more-formal", label: "More Formal", instruction: "Rewrite this in a more formal, professional tone." },
  { id: "simpler",     label: "Simpler",     instruction: "Rewrite this in simpler language a 12-year-old could understand." },
];

export function OutputPanel() {
  const {
    output, isStreaming, isDone, wordCount, error, savedId,
    topic, tone, length, language,
    appendOutput, setIsStreaming, setIsDone, setError, setSavedId, resetOutput,
  } = useGenerateStore();

  const [exportOpen, setExportOpen] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [refining, setRefining] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Reset favourite indicator whenever a new generation arrives
  useEffect(() => { setFavourited(false); }, [savedId]);

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleExport = async (kind: "pdf" | "docx" | "md" | "txt") => {
    if (!output) return;
    setExportOpen(false);
    const gen = { topic, output, tone, length, language, wordCount };
    try {
      if (kind === "pdf") { await exportPDF(gen); toast.success("PDF downloaded"); return; }
      if (kind === "docx") { await exportDOCX(gen); toast.success("DOCX downloaded"); return; }
      if (kind === "md") { exportMarkdown(gen); toast.success("Markdown downloaded"); return; }
      const blob = new Blob([output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${topic.slice(0, 40) || "textforge"}.txt`; a.click();
      URL.revokeObjectURL(url);
      toast.success("TXT downloaded");
    } catch (e: any) {
      toast.error(e?.message || "Export failed");
    }
  };

  const handleShare = async () => {
    if (!savedId) {
      toast.error("Wait for the generation to save first");
      return;
    }
    const url = `${window.location.origin}/s/${savedId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied!");
    } catch {
      window.prompt("Copy share link:", url);
    }
  };

  const handleFavourite = async () => {
    if (!savedId) {
      toast.error("Wait for the generation to save first");
      return;
    }
    try {
      const updated = await api.toggleFavourite(savedId);
      setFavourited(!!updated.isFavourite);
      toast.success(updated.isFavourite ? "Added to favourites" : "Removed from favourites");
    } catch {
      toast.error("Failed to update favourite");
    }
  };

  const handleRefine = async (action: typeof REFINE_ACTIONS[number]) => {
    if (!output || !savedId) {
      toast.error("Wait for the original generation to finish");
      return;
    }
    const original = output;
    setRefining(action.id);
    resetOutput();
    setIsStreaming(true);
    try {
      await api.postRefine(
        {
          originalText: original,
          instruction: action.instruction,
          topic, tone, length, language,
          refinementOf: savedId,
        },
        (text) => appendOutput(text),
        (newId) => {
          setIsStreaming(false);
          setIsDone(true);
          if (newId) setSavedId(newId);
          toast.success(`Refined: ${action.label}`);
          setRefining(null);
        },
        (err) => {
          setIsStreaming(false);
          setError(err);
          toast.error(err);
          setRefining(null);
        }
      );
    } catch (e: any) {
      setIsStreaming(false);
      setError(e?.message || "Refine failed");
      toast.error(e?.message || "Refine failed");
      setRefining(null);
    }
  };

  const isEmpty = !output && !isStreaming && !error;

  return (
    <div style={{
      background: "var(--bg-1)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      display: "flex",
      flexDirection: "column",
      minHeight: "520px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: "180px", height: "180px",
        background: "radial-gradient(circle, rgba(212,126,48,0.07) 0%, transparent 70%)",
        pointerEvents: "none", borderRadius: "50%",
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0, gap: "10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <FileText size={16} color="var(--brand)" />
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)" }}>
            Output
          </span>
          {isDone && (
            <span style={{
              background: "var(--brand-subtle)", color: "var(--brand)",
              border: "1px solid var(--border-hover)",
              borderRadius: "99px", padding: "2px 9px",
              fontSize: "11px", fontFamily: "var(--font-mono)",
            }}>
              {wordCount} words
            </span>
          )}
          {isStreaming && (
            <span style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "rgba(212,126,48,0.08)", color: "var(--brand)",
              border: "1px solid rgba(212,126,48,0.2)",
              borderRadius: "99px", padding: "2px 9px",
              fontSize: "11px", fontFamily: "var(--font-mono)",
            }}>
              <Loader2 size={10} className="spin" /> {refining ? `Refining: ${refining}` : "Generating…"}
            </span>
          )}
        </div>

        {output && (
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {isDone && savedId && (
              <>
                <button onClick={handleFavourite} className="btn-ghost" title="Save to favourites" style={{ fontSize: "13px" }}>
                  <Star size={14} fill={favourited ? "var(--brand)" : "none"} color={favourited ? "var(--brand)" : "currentColor"} />
                </button>
                <button onClick={handleShare} className="btn-ghost" title="Copy share link" style={{ fontSize: "13px" }}>
                  <Share2 size={14} /> Share
                </button>
              </>
            )}
            <button onClick={handleCopy} className="btn-ghost" style={{ fontSize: "13px" }}>
              <Copy size={14} /> Copy
            </button>
            <div ref={exportRef} style={{ position: "relative" }}>
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="btn-ghost"
                style={{ fontSize: "13px" }}
              >
                <Download size={14} /> Export <ChevronDown size={11} />
              </button>
              {exportOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 60,
                  background: "var(--bg-1)", border: "1px solid var(--border-hover)",
                  borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  padding: "4px", minWidth: "180px",
                }}>
                  {[
                    { id: "pdf",  label: "PDF document",  Icon: FileType },
                    { id: "docx", label: "Word document", Icon: FileText },
                    { id: "md",   label: "Markdown",      Icon: FileCode },
                    { id: "txt",  label: "Plain text",    Icon: FileText },
                  ].map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => handleExport(id as any)}
                      style={{
                        width: "100%", textAlign: "left",
                        padding: "8px 10px", borderRadius: "7px",
                        background: "transparent", border: "none", cursor: "pointer",
                        color: "var(--text-1)",
                        fontFamily: "var(--font-sans)", fontSize: "13px",
                        display: "flex", alignItems: "center", gap: "8px",
                      }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      <Icon size={14} color="var(--text-3)" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{
        flex: 1, padding: "24px",
        display: isEmpty || error ? "flex" : "block",
        alignItems: "center", justifyContent: "center",
        overflowY: "auto",
      }}>
        {isEmpty && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: "var(--bg-2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
            }}>
              <FileText size={20} color="var(--text-4)" />
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "14px", color: "var(--text-2)" }}>
              Your generated text appears here
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-4)", marginTop: "5px" }}>
              Fill in the form and hit Generate
            </p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#E05050", fontWeight: 500 }}>{error}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-4)", marginTop: "5px" }}>
              Please try again
            </p>
          </div>
        )}

        {output && (
          <p className={`generation-output ${isStreaming ? "streaming-cursor" : ""}`}>
            {output}
          </p>
        )}
      </div>

      {/* Refinement bar */}
      {isDone && output && savedId && (
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "12px 16px",
          display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px",
          flexShrink: 0,
          background: "var(--bg-base)",
        }}>
          <span style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            <Wand2 size={12} color="var(--brand)" /> Refine
          </span>
          {REFINE_ACTIONS.map((a) => (
            <button
              key={a.id}
              onClick={() => handleRefine(a)}
              disabled={isStreaming}
              style={{
                padding: "6px 12px",
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: isStreaming ? "not-allowed" : "pointer",
                color: "var(--text-1)",
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
                transition: "all 0.15s ease",
                opacity: isStreaming ? 0.5 : 1,
              }}
              onMouseEnter={(e) => { if (!isStreaming) { (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--brand)"; } }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-1)"; }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
