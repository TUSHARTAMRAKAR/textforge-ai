"use client";
import { PromptBuilder } from "@/components/PromptBuilder";
import { OutputPanel } from "@/components/OutputPanel";
import { useEffect, useState, useCallback } from "react";
import { api, Generation } from "@/lib/api";
import { PanelLeftClose, PanelLeftOpen, Trash2, Flame, Inbox, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGenerateStore } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";

const TONE_COLORS: Record<string, string> = {
  formal:   "#7EB8E8",
  casual:   "#5EC49A",
  creative: "#B89AE0",
  academic: "#E0B85E",
};

export default function GeneratePage() {
  const [generations, setGenerations]   = useState<Generation[]>([]);
  const [loading, setLoading]           = useState(true);
  const [collapsed, setCollapsed]       = useState(false);
  const { isDone } = useGenerateStore();

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.getHistory({ page: 1, limit: 30 });
      setGenerations(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHistory(); }, [isDone]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGeneration(id);
      setGenerations((p) => p.filter((g) => g._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", position: "relative", zIndex: 1, overflow: "hidden" }}>

      {/* ══ COLLAPSIBLE SIDEBAR ══════════════════════════════════ */}
      <aside style={{
        width: collapsed ? "52px" : "280px",
        minWidth: collapsed ? "52px" : "280px",
        background: "var(--bg-1)",
        borderRight: "1px solid var(--border)",
        height: "100%",
        overflow: "hidden",
        flexShrink: 0,
        transition: "width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>

        {/* Sidebar header */}
        <div style={{
          height: "52px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "0" : "0 16px 0 18px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          {/* Brand mark in sidebar — visible when collapsed */}
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} title="Expand sidebar" style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center",
              width: "36px", height: "36px", borderRadius: "8px",
              transition: "background 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <Flame size={18} />
            </button>
          ) : (
            <>
              {/* TextForge brand in sidebar */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "26px", height: "26px", borderRadius: "7px",
                  background: "linear-gradient(135deg, #D47E30, #E8A050)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 10px rgba(212,126,48,0.3)",
                }}>
                  <Flame size={13} color="#1A1208" strokeWidth={2.5} />
                </div>
                <span style={{
                  fontFamily: "var(--font-sans)", fontWeight: 700,
                  fontSize: "14px", color: "var(--text-1)",
                  letterSpacing: "-0.01em", whiteSpace: "nowrap",
                }}>
                  TextForge
                </span>
                {generations.length > 0 && (
                  <span style={{
                    background: "var(--brand-subtle)",
                    color: "var(--brand)",
                    border: "1px solid var(--border-hover)",
                    borderRadius: "99px",
                    padding: "1px 8px",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                  }}>
                    {generations.length}
                  </span>
                )}
              </div>

              {/* Collapse button */}
              <button onClick={() => setCollapsed(true)} title="Collapse sidebar" style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-3)", padding: "6px", borderRadius: "7px",
                display: "flex", transition: "all 0.15s",
              }}
                onMouseEnter={(e) => { (e.currentTarget).style.background = "var(--bg-2)"; (e.currentTarget).style.color = "var(--text-1)"; }}
                onMouseLeave={(e) => { (e.currentTarget).style.background = "none"; (e.currentTarget).style.color = "var(--text-3)"; }}
              >
                <PanelLeftClose size={17} />
              </button>
            </>
          )}
        </div>

        {/* Sidebar content — history list */}
        {!collapsed && (
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
                <Loader2 size={20} color="var(--brand)" className="spin" />
              </div>
            ) : generations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <Inbox size={28} color="var(--text-4)" style={{ margin: "0 auto 10px", display: "block" }} />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-3)" }}>No generations yet</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)", marginTop: "4px" }}>
                  Generate something!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {generations.map((gen) => (
                  <SidebarItem key={gen._id} generation={gen} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collapsed: just show expand button in middle */}
        {collapsed && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "12px", gap: "6px" }}>
            <button onClick={() => setCollapsed(false)} title="Expand" style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-3)", padding: "8px", borderRadius: "8px",
              transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = "var(--bg-2)"; (e.currentTarget).style.color = "var(--brand)"; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = "none"; (e.currentTarget).style.color = "var(--text-3)"; }}
            >
              <PanelLeftOpen size={17} />
            </button>
            {/* Rotated history count */}
            {generations.length > 0 && (
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                color: "var(--text-4)", marginTop: "4px",
              }}>
                {generations.length}
              </span>
            )}
          </div>
        )}
      </aside>

      {/* ══ MAIN CONTENT ════════════════════════════════════════ */}
      <main style={{
        flex: 1,
        overflowY: "auto",
        padding: "36px 40px",
        minWidth: 0,
      }}>
        {/* Page title */}
        <div style={{ marginBottom: "32px" }} className="animate-fade-up">
          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "28px",
            letterSpacing: "-0.025em",
            color: "var(--text-1)",
            marginBottom: "6px",
          }}>
            Generate Text
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-3)" }}>
            Choose your topic, tone, and length — Gemini does the rest.
          </p>
        </div>

        {/* Two-col grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 480px) 1fr",
          gap: "20px",
          alignItems: "start",
        }} className="animate-fade-up delay-1">

          {/* Left: controls */}
          <div style={{
            background: "var(--bg-1)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "28px",
          }}>
            <PromptBuilder />
          </div>

          {/* Right: output */}
          <OutputPanel />
        </div>
      </main>
    </div>
  );
}

/* ── Compact sidebar history item ─────────────────────────── */
function SidebarItem({ generation, onDelete }: { generation: Generation; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const color = TONE_COLORS[generation.tone] || "var(--text-3)";
  const timeAgo = formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-2)" : "transparent",
        border: `1px solid ${hovered ? "var(--border-hover)" : "transparent"}`,
        borderRadius: "10px",
        padding: "11px 13px",
        transition: "all 0.15s ease",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 500, fontSize: "13px",
          color: "var(--text-1)", lineHeight: 1.4,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          flex: 1,
        }}>
          {generation.topic}
        </p>
        {hovered && (
          <button
            onClick={() => onDelete(generation._id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-4)", padding: "2px", flexShrink: 0,
              borderRadius: "4px", transition: "color 0.15s",
              display: "flex",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E05050")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-4)")}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "7px", marginTop: "7px" }}>
        <span style={{
          fontSize: "10px", fontFamily: "var(--font-mono)",
          color: color,
          background: `${color}18`,
          padding: "1px 7px", borderRadius: "99px",
          border: `1px solid ${color}28`,
          textTransform: "capitalize",
        }}>
          {generation.tone}
        </span>
        <span style={{ fontSize: "10px", color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>
          {generation.wordCount}w
        </span>
        <span style={{ fontSize: "10px", color: "var(--text-4)", fontFamily: "var(--font-mono)", marginLeft: "auto" }}>
          {timeAgo}
        </span>
      </div>
    </div>
  );
}
