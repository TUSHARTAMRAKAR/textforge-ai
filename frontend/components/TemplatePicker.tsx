"use client";
import { useGenerateStore } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";
import {
  FileText, Mail, BookOpen, Briefcase, Package, Share2, ClipboardList, Sparkles, X,
  type LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  TemplatePicker — horizontal scrolling row of template chips
//
//  Selecting a template applies its tone/length/language and
//  pre-fills the topic field with a focused instruction.
// ─────────────────────────────────────────────────────────────

const ICONS: Record<string, LucideIcon> = {
  FileText, Mail, BookOpen, Briefcase, Package, Share2, ClipboardList, Sparkles,
};

export function TemplatePicker({ disabled }: { disabled?: boolean }) {
  const { templateId, applyTemplate, setTemplateId, setTopic, topic } = useGenerateStore();

  const handleSelect = (id: string) => {
    if (templateId === id) {
      setTemplateId(undefined);
      return;
    }
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    const cleanTopic = (topic || "").replace(/^(Write a|Compose|Generate)[^:]*:\s*/i, "").trim();
    applyTemplate({
      id: tpl.id,
      tone: tpl.tone,
      length: tpl.length,
    });
    if (!cleanTopic) {
      setTopic(tpl.placeholder);
    }
  };

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "9px",
      }}>
        <span className="label" style={{ marginBottom: 0 }}>Templates</span>
        {templateId && (
          <button
            onClick={() => setTemplateId(undefined)}
            disabled={disabled}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-3)", fontSize: "11px", fontFamily: "var(--font-mono)",
              display: "flex", alignItems: "center", gap: "3px",
            }}
          >
            <X size={11} /> Clear
          </button>
        )}
      </div>
      <div style={{
        display: "flex", gap: "8px",
        overflowX: "auto", paddingBottom: "4px",
        margin: "0 -4px", padding: "0 4px 6px",
      }}
        className="template-scroll"
      >
        {TEMPLATES.map((tpl) => {
          const Icon = ICONS[tpl.icon] ?? FileText;
          const active = templateId === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => handleSelect(tpl.id)}
              disabled={disabled}
              title={tpl.description}
              style={{
                flexShrink: 0,
                display: "flex", alignItems: "center", gap: "8px",
                padding: "9px 14px",
                background: active ? "var(--brand-subtle)" : "var(--bg-2)",
                border: `1px solid ${active ? "var(--border-focus)" : "var(--border)"}`,
                borderRadius: "9px",
                cursor: "pointer",
                color: active ? "var(--brand)" : "var(--text-1)",
                fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
                transition: "all 0.15s ease",
                boxShadow: active ? "0 0 0 3px var(--brand-glow)" : "none",
              }}
            >
              <Icon size={14} />
              {tpl.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
