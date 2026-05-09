"use client";
import { Generation, api } from "@/lib/api";
import { Trash2, Copy, ChevronDown, ChevronUp, Clock, Hash, Star, Share2, Download } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { exportPDF } from "@/lib/exporters";

interface Props {
  generation: Generation;
  onDelete:   (id: string) => void;
  onFavouriteToggle?: (id: string, isFavourite: boolean) => void;
}

const TONE_COLORS: Record<string, string> = {
  formal:   "#60A5FA",
  casual:   "#34D399",
  creative: "#A78BFA",
  academic: "#FBBF24",
};

export function HistoryCard({ generation, onDelete, onFavouriteToggle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [favourited, setFavourited] = useState(!!generation.isFavourite);

  const handleCopy = () => {
    navigator.clipboard.writeText(generation.output);
    toast.success("Copied!");
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(generation._id);
  };

  const handleFavourite = async () => {
    try {
      const updated = await api.toggleFavourite(generation._id);
      const next = !!updated.isFavourite;
      setFavourited(next);
      onFavouriteToggle?.(generation._id, next);
    } catch {
      toast.error("Failed to update favourite");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/s/${generation._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied!");
    } catch {
      window.prompt("Copy share link:", url);
    }
  };

  const handleExportPdf = async () => {
    try {
      await exportPDF(generation);
      toast.success("PDF downloaded");
    } catch (e: any) {
      toast.error(e?.message || "Export failed");
    }
  };

  const preview = generation.output.slice(0, 180) + (generation.output.length > 180 ? "…" : "");
  const timeAgo = formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true });
  const color   = TONE_COLORS[generation.tone] || "var(--text-2)";

  return (
    <div style={{
      background: "var(--bg-1)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      padding: "24px 28px",
      transition: "all 0.2s ease",
      opacity: deleting ? 0.4 : 1,
      pointerEvents: deleting ? "none" : "auto",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
        <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px", color: "var(--text-1)", lineHeight: 1.3 }}>
          {generation.topic}
        </h3>
        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
          <button onClick={handleFavourite} className="btn-ghost" title={favourited ? "Unfavourite" : "Favourite"} style={{ padding: "8px" }}>
            <Star size={15} fill={favourited ? "var(--brand)" : "none"} color={favourited ? "var(--brand)" : "currentColor"} />
          </button>
          <button onClick={handleShare} className="btn-ghost" title="Copy share link" style={{ padding: "8px" }}>
            <Share2 size={15} />
          </button>
          <button onClick={handleExportPdf} className="btn-ghost" title="Export as PDF" style={{ padding: "8px" }}>
            <Download size={15} />
          </button>
          <button onClick={handleCopy} className="btn-ghost" title="Copy text" style={{ padding: "8px" }}>
            <Copy size={15} />
          </button>
          <button onClick={handleDelete} className="btn-ghost" title="Delete" style={{ padding: "8px", color: "var(--text-3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B6B")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
          >
            <Trash2 size={15} />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="btn-ghost" title={expanded ? "Collapse" : "Expand"} style={{ padding: "8px" }}>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Meta badges */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        <span style={{
          fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: 500,
          color: color, background: `${color}15`,
          padding: "3px 10px", borderRadius: "99px",
          border: `1px solid ${color}30`, textTransform: "capitalize",
        }}>{generation.tone}</span>
        <span style={{
          fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)",
          background: "var(--bg-2)", padding: "3px 10px",
          borderRadius: "99px", border: "1px solid var(--border)", textTransform: "capitalize",
        }}>{generation.length}</span>
        {generation.language && generation.language !== "en" && (
          <span style={{
            fontSize: "11px", color: "var(--brand)", fontFamily: "var(--font-mono)",
            background: "var(--brand-subtle)", padding: "3px 10px",
            borderRadius: "99px", border: "1px solid var(--border-hover)", textTransform: "uppercase",
          }}>{generation.language}</span>
        )}
        {generation.keywords && generation.keywords.length > 0 && (
          <span style={{
            fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)",
            background: "var(--bg-2)", padding: "3px 10px",
            borderRadius: "99px", border: "1px solid var(--border)",
          }}>SEO: {generation.keywords.length}</span>
        )}
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
          <Hash size={10} />{generation.wordCount} words
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
          <Clock size={10} />{timeAgo}
        </span>
      </div>

      <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.8 }}>
        {expanded ? generation.output : preview}
      </p>

      {generation.output.length > 180 && (
        <button onClick={() => setExpanded(!expanded)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--brand)", fontSize: "13px", fontWeight: 500,
          marginTop: "10px", padding: 0, fontFamily: "var(--font-sans)",
        }}>
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}
    </div>
  );
}
