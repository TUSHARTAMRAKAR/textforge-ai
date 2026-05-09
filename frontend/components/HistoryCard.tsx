"use client";
import { Generation } from "@/lib/api";
import { Trash2, Copy, ChevronDown, ChevronUp, Clock, Hash } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface Props {
  generation: Generation;
  onDelete:   (id: string) => void;
}

const TONE_COLORS: Record<string, string> = {
  formal:   "#60A5FA",
  casual:   "#34D399",
  creative: "#A78BFA",
  academic: "#FBBF24",
};

export function HistoryCard({ generation, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generation.output);
    toast.success("Copied!");
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(generation._id);
  };

  const preview = generation.output.slice(0, 180) + (generation.output.length > 180 ? "…" : "");
  const timeAgo = formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true });
  const color   = TONE_COLORS[generation.tone] || "var(--text-2)";

  return (
    <div style={{
      background: "var(--surface-1)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      padding: "24px 28px",
      transition: "all 0.2s ease",
      opacity: deleting ? 0.4 : 1,
      pointerEvents: deleting ? "none" : "auto",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,212,170,0.2)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text-1)", lineHeight: 1.3 }}>
          {generation.topic}
        </h3>
        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
          <button onClick={handleCopy}   className="btn-ghost" style={{ padding: "8px" }}><Copy   size={15} /></button>
          <button onClick={handleDelete} className="btn-ghost" style={{ padding: "8px", color: "var(--text-3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B6B")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
          >
            <Trash2 size={15} />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="btn-ghost" style={{ padding: "8px" }}>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Meta badges */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        <span style={{
          fontSize: "11px", fontFamily: "DM Mono, monospace", fontWeight: 500,
          color: color, background: `${color}15`,
          padding: "3px 10px", borderRadius: "99px",
          border: `1px solid ${color}30`, textTransform: "capitalize",
        }}>{generation.tone}</span>
        <span style={{
          fontSize: "11px", color: "var(--text-3)", fontFamily: "DM Mono, monospace",
          background: "var(--surface-2)", padding: "3px 10px",
          borderRadius: "99px", border: "1px solid var(--border)", textTransform: "capitalize",
        }}>{generation.length}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-3)", fontFamily: "DM Mono, monospace" }}>
          <Hash size={10} />{generation.wordCount} words
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-3)", fontFamily: "DM Mono, monospace" }}>
          <Clock size={10} />{timeAgo}
        </span>
      </div>

      {/* Text preview */}
      <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.8 }}>
        {expanded ? generation.output : preview}
      </p>

      {generation.output.length > 180 && (
        <button onClick={() => setExpanded(!expanded)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--brand)", fontSize: "13px", fontWeight: 500,
          marginTop: "10px", padding: 0, fontFamily: "DM Sans, sans-serif",
        }}>
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}
    </div>
  );
}
