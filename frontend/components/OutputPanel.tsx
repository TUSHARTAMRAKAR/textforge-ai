"use client";
import { useGenerateStore } from "@/lib/store";
import { Copy, Download, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function OutputPanel() {
  const { output, isStreaming, isDone, wordCount, error } = useGenerateStore();

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "textforge-output.txt"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
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
      {/* Warm corner glow */}
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
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
              <Loader2 size={10} className="spin" /> Generating…
            </span>
          )}
        </div>

        {output && (
          <div style={{ display: "flex", gap: "4px" }}>
            <button onClick={handleCopy} className="btn-ghost" style={{ fontSize: "13px" }}>
              <Copy size={14} /> Copy
            </button>
            <button onClick={handleDownload} className="btn-ghost" style={{ fontSize: "13px" }}>
              <Download size={14} /> Download
            </button>
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
    </div>
  );
}
