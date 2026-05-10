"use client";
import { useState, useRef, useEffect } from "react";
import { DOMAIN_TEMPLATES, DomainTemplate, getDomainById } from "@/lib/domainTemplates";
import { useGenerateStore } from "@/lib/store";
import { api } from "@/lib/api";
import { OutputPanel } from "@/components/OutputPanel";
import { Sparkles, Loader2, ChevronRight, ArrowLeft, Download, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { exportPDF, exportDOCX } from "@/lib/exporters";
import Link from "next/link";

export default function DomainPage() {
  const [selectedDomain, setSelectedDomain] = useState<DomainTemplate | null>(null);
  const [selectedOutput, setSelectedOutput]  = useState<string>("");
  const [fieldValues, setFieldValues]        = useState<Record<string, string>>({});
  const [step, setStep]                      = useState<"pick" | "configure" | "result">("pick");

  const {
    output, isStreaming, isDone, wordCount,
    appendOutput, setIsStreaming, setIsDone,
    setError, setSavedId, resetOutput,
  } = useGenerateStore();

  const handleSelectDomain = (domain: DomainTemplate) => {
    setSelectedDomain(domain);
    setSelectedOutput(domain.outputTypes[0].id);
    setFieldValues({});
    resetOutput();
    setStep("configure");
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedDomain) return;

    // Check required fields
    const missingFields = selectedDomain.fields
      .filter((f) => f.required && !fieldValues[f.id]?.trim())
      .map((f) => f.label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.slice(0, 2).join(", ")}${missingFields.length > 2 ? "..." : ""}`);
      return;
    }

    resetOutput();
    setIsStreaming(true);
    setStep("result");

    try {
      await api.postDomainGenerate(
        { domain: selectedDomain.id, outputType: selectedOutput, fields: fieldValues },
        (text)  => appendOutput(text),
        (savedId) => { setIsStreaming(false); setIsDone(true); if (savedId) setSavedId(savedId); toast.success("Document generated!"); },
        (err)   => { setIsStreaming(false); setError(err); toast.error(err); }
      );
    } catch (err: any) {
      setIsStreaming(false);
      setError(err?.message || "Generation failed");
      toast.error(err?.message || "Generation failed");
    }
  };

  const handleExport = async (type: "pdf" | "docx") => {
    if (!output || !selectedDomain) return;
    const gen = {
      topic: `${selectedDomain.name} Document`,
      output, tone: "formal", length: "long",
      language: "en", wordCount,
    };
    try {
      if (type === "pdf")  { await exportPDF(gen);  toast.success("PDF downloaded!"); }
      if (type === "docx") { await exportDOCX(gen); toast.success("DOCX downloaded!"); }
    } catch (e: any) { toast.error(e?.message || "Export failed"); }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)", padding: "40px 24px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          {step !== "pick" && (
            <button onClick={() => { setStep("pick"); setSelectedDomain(null); resetOutput(); }} style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-3)", fontFamily: "var(--font-sans)", fontSize: "13px",
              marginBottom: "16px", padding: 0,
            }}>
              <ArrowLeft size={14} /> Back to domains
            </button>
          )}
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "28px", color: "var(--text-1)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            {step === "pick" ? "Deep Domain Templates" : step === "configure" ? `Configure ${selectedDomain?.name} Document` : `${selectedDomain?.name} Document`}
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-3)" }}>
            {step === "pick"
              ? "Professional document generation with domain-specific parameters. Not just AI text — expert-structured output."
              : step === "configure"
              ? selectedDomain?.description
              : "Your professionally generated document"}
          </p>
        </div>

        {/* ── STEP 1: Pick a domain ── */}
        {step === "pick" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {DOMAIN_TEMPLATES.map((domain) => (
              <button key={domain.id} onClick={() => handleSelectDomain(domain)} style={{
                background: "var(--bg-1)", border: "1px solid var(--border)",
                borderRadius: "14px", padding: "24px",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.15s ease",
              }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = domain.color;
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = `0 8px 24px ${domain.color}20`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{domain.icon}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px", color: "var(--text-1)", marginBottom: "4px" }}>
                  {domain.name}
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: domain.color, fontWeight: 600, marginBottom: "8px" }}>
                  {domain.tagline}
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-3)", lineHeight: 1.6, marginBottom: "14px" }}>
                  {domain.description}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "10px",
                    color: domain.color, background: domain.bgColor,
                    padding: "2px 8px", borderRadius: "99px",
                  }}>
                    {domain.fields.length} parameters
                  </span>
                  <ChevronRight size={14} color="var(--text-3)" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 2: Configure ── */}
        {step === "configure" && selectedDomain && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>

            {/* Left: Output type selector */}
            <div>
              <label style={labelStyle}>Document Type</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
                {selectedDomain.outputTypes.map((ot) => (
                  <button key={ot.id} onClick={() => setSelectedOutput(ot.id)} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px", borderRadius: "10px",
                    border: `1px solid ${selectedOutput === ot.id ? selectedDomain.color : "var(--border)"}`,
                    background: selectedOutput === ot.id ? `${selectedDomain.color}12` : "var(--bg-1)",
                    cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                  }}>
                    <span style={{ fontSize: "18px" }}>{ot.icon}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: selectedOutput === ot.id ? selectedDomain.color : "var(--text-1)" }}>
                        {ot.label}
                      </div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-3)" }}>
                        {ot.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Generate button */}
              <button onClick={handleGenerate} disabled={isStreaming} style={{
                width: "100%", padding: "14px",
                background: isStreaming ? "var(--bg-3)" : selectedDomain.color,
                border: "none", borderRadius: "10px",
                cursor: isStreaming ? "not-allowed" : "pointer",
                color: isStreaming ? "var(--text-3)" : "#fff",
                fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "15px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.15s",
              }}>
                {isStreaming
                  ? <><Loader2 size={17} className="spin" /> Generating document…</>
                  : <><Sparkles size={17} /> Generate {selectedDomain.name} Document</>
                }
              </button>

              {/* Example use case */}
              <div style={{
                marginTop: "14px", padding: "12px 14px",
                background: "var(--bg-2)", borderRadius: "8px",
                border: "1px solid var(--border)",
              }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                  Example use case
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-2)", lineHeight: 1.6 }}>
                  {selectedDomain.exampleUseCase}
                </p>
              </div>
            </div>

            {/* Right: Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "70vh", overflowY: "auto", paddingRight: "4px" }}>
              {selectedDomain.fields.map((field) => (
                <div key={field.id}>
                  <label style={labelStyle}>
                    {field.label}
                    {field.required && <span style={{ color: selectedDomain.color, marginLeft: "3px" }}>*</span>}
                  </label>
                  {field.helpText && (
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-4)", marginBottom: "5px" }}>
                      {field.helpText}
                    </p>
                  )}
                  {field.type === "select" ? (
                    <select
                      value={fieldValues[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Select {field.label}…</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={fieldValues[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" as const }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={fieldValues[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Result ── */}
        {step === "result" && (
          <div>
            {/* Action buttons */}
            {isDone && output && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                <button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} style={actionBtnStyle}>
                  <Copy size={14} /> Copy
                </button>
                <button onClick={() => handleExport("pdf")} style={actionBtnStyle}>
                  <Download size={14} /> Export PDF
                </button>
                <button onClick={() => handleExport("docx")} style={actionBtnStyle}>
                  <Download size={14} /> Export DOCX
                </button>
                <button onClick={() => setStep("configure")} style={{ ...actionBtnStyle, color: selectedDomain?.color }}>
                  <Sparkles size={14} /> Generate Another
                </button>
              </div>
            )}

            {/* Streaming indicator */}
            {isStreaming && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Loader2 size={14} color={selectedDomain?.color} className="spin" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)" }}>
                  Generating your {selectedDomain?.name} document…
                </span>
              </div>
            )}

            {/* Output */}
            {output && (
              <div style={{
                background: "var(--bg-1)", border: "1px solid var(--border)",
                borderRadius: "14px", padding: "32px 36px",
                fontFamily: "var(--font-serif)", fontSize: "15px",
                lineHeight: "1.85", color: "var(--text-1)",
                whiteSpace: "pre-wrap",
              }}>
                {output}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--text-3)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-2)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "9px 12px",
  color: "var(--text-1)",
  fontFamily: "var(--font-sans)",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const actionBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "6px",
  padding: "8px 14px", borderRadius: "8px",
  background: "var(--bg-1)", border: "1px solid var(--border)",
  cursor: "pointer", color: "var(--text-1)",
  fontFamily: "var(--font-sans)", fontSize: "13px",
  transition: "all 0.12s",
};
