"use client";
import { useState } from "react";
import { Sparkles, Loader2, Copy, Download, Volume2 } from "lucide-react";
import toast from "react-hot-toast";
import { exportPDF, exportDOCX } from "@/lib/exporters";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const LANGUAGES = [
  { code: "hi", name: "Hindi",   native: "हिन्दी",  flag: "🇮🇳", color: "#FF6B35", region: "North India" },
  { code: "mr", name: "Marathi", native: "मराठी",   flag: "🟠", color: "#E8471A", region: "Maharashtra" },
  { code: "ta", name: "Tamil",   native: "தமிழ்",   flag: "🟡", color: "#C4A000", region: "Tamil Nadu" },
  { code: "te", name: "Telugu",  native: "తెలుగు",  flag: "🔵", color: "#1565C0", region: "Andhra/Telangana" },
  { code: "bn", name: "Bengali", native: "বাংলা",   flag: "🟢", color: "#2E7D32", region: "West Bengal" },
  { code: "gu", name: "Gujarati",native: "ગુજરાતી", flag: "🟣", color: "#6A1B9A", region: "Gujarat" },
];

const CONTEXTS = [
  { id: "general",   label: "General",   icon: "🌐", desc: "Everyday content" },
  { id: "education", label: "Education", icon: "📚", desc: "Students & teachers" },
  { id: "business",  label: "Business",  icon: "💼", desc: "Indian market focus" },
  { id: "news",      label: "News",      icon: "📰", desc: "Journalism style" },
  { id: "social",    label: "Social",    icon: "📱", desc: "Social media ready" },
];

const TONES = [
  { id: "casual",   label: "Casual",   desc: "रोज़मर्रा की भाषा" },
  { id: "formal",   label: "Formal",   desc: "औपचारिक भाषा" },
  { id: "creative", label: "Creative", desc: "रचनात्मक लेखन" },
  { id: "academic", label: "Academic", desc: "शैक्षणिक शैली" },
];

const EXAMPLE_TOPICS: Record<string, string[]> = {
  hi: ["आर्टिफिशियल इंटेलिजेंस का भारत पर प्रभाव", "डिजिटल इंडिया की सफलता", "भारतीय किसानों की चुनौतियाँ"],
  mr: ["महाराष्ट्रातील शेतकरी संकट", "मुंबईचा विकास", "स्टार्टअप इंडिया"],
  ta: ["செயற்கை நுண்ணறிவும் இந்தியாவும்", "தமிழ் மொழியின் சிறப்பு", "விவசாயிகளின் நலன்"],
  te: ["భారత్‌లో సాంకేతిక విప్లవం", "తెలంగాణ అభివృద్ధి", "రైతుల సమస్యలు"],
  bn: ["ভারতে কৃত্রিম বুদ্ধিমত্তার প্রভাব", "বাংলার সংস্কৃতি", "শিক্ষার গুরুত্ব"],
  gu: ["ભારતમાં ટેકનોલોજીનો વિકાસ", "ગુજરાતનો ઉદ્યોગ", "ખેડૂતોની સમસ્યા"],
};

export default function VernacularPage() {
  const [selectedLang, setSelectedLang] = useState("hi");
  const [topic, setTopic]               = useState("");
  const [tone, setTone]                 = useState("casual");
  const [length, setLength]             = useState("medium");
  const [context, setContext]           = useState("general");
  const [output, setOutput]             = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone]             = useState(false);

  const lang = LANGUAGES.find(l => l.code === selectedLang)!;

  const handleGenerate = async () => {
    if (!topic.trim() || topic.length < 3) {
      toast.error("Please enter a topic");
      return;
    }
    setIsGenerating(true);
    setOutput("");
    setIsDone(false);

    try {
      const response = await fetch(`${API_URL}/api/vernacular/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language: selectedLang, tone, length, context }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Generation failed");
      }

      const reader  = response.body!.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          let payload: any;
          try { payload = JSON.parse(raw); } catch { continue; }

          if (payload.text)  setOutput(prev => prev + payload.text);
          if (payload.error) { toast.error(payload.error); setIsGenerating(false); return; }
          if (payload.done)  { setIsDone(true); setIsGenerating(false); toast.success(`Generated in ${lang.native}!`); return; }
        }
      }
      setIsGenerating(false);
      setIsDone(true);
    } catch (err: any) {
      setIsGenerating(false);
      toast.error(err.message || "Generation failed");
    }
  };

  const handleExport = async (type: "pdf" | "docx") => {
    if (!output) return;
    const gen = { topic: `[${lang.name}] ${topic}`, output, tone, length, language: selectedLang, wordCount: output.split(/\s+/).length };
    try {
      if (type === "pdf")  { await exportPDF(gen);  toast.success("PDF downloaded!"); }
      if (type === "docx") { await exportDOCX(gen); toast.success("DOCX downloaded!"); }
    } catch (e: any) { toast.error(e?.message || "Export failed"); }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "32px" }}>🇮🇳</span>
            <div>
              <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "28px", color: "var(--text-1)", letterSpacing: "-0.02em" }}>
                Bharat AI — भारत AI
              </h1>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--brand)", letterSpacing: "0.06em" }}>
                INDIA-FIRST VERNACULAR CONTENT GENERATOR
              </p>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-3)", maxWidth: "600px" }}>
            Native content generation in 6 Indian languages — not translation, but genuine cultural expression with idioms, references, and regional context.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", alignItems: "start" }}>

          {/* ── Left: Controls ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Language selector */}
            <div>
              <label style={labelStyle}>Select Language — भाषा चुनें</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setSelectedLang(l.code); setOutput(""); setIsDone(false); }} style={{
                    padding: "12px", borderRadius: "10px", textAlign: "center",
                    border: `2px solid ${selectedLang === l.code ? l.color : "var(--border)"}`,
                    background: selectedLang === l.code ? `${l.color}12` : "var(--bg-1)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 700, color: selectedLang === l.code ? l.color : "var(--text-1)", marginBottom: "2px" }}>
                      {l.native}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-3)" }}>
                      {l.name} · {l.region}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic input */}
            <div>
              <label style={labelStyle}>Topic — विषय</label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder={`e.g. ${EXAMPLE_TOPICS[selectedLang]?.[0] || "Your topic here"}`}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" as const }}
              />
              {/* Example topics */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                {EXAMPLE_TOPICS[selectedLang]?.map(t => (
                  <button key={t} onClick={() => setTopic(t)} style={{
                    fontFamily: "var(--font-sans)", fontSize: "11px", color: lang.color,
                    background: `${lang.color}10`, border: `1px solid ${lang.color}30`,
                    borderRadius: "99px", padding: "2px 10px", cursor: "pointer",
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Context */}
            <div>
              <label style={labelStyle}>Context — संदर्भ</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {CONTEXTS.map(c => (
                  <button key={c.id} onClick={() => setContext(c.id)} style={{
                    padding: "8px 6px", borderRadius: "8px", textAlign: "center",
                    border: `1px solid ${context === c.id ? lang.color : "var(--border)"}`,
                    background: context === c.id ? `${lang.color}12` : "var(--bg-1)",
                    cursor: "pointer", transition: "all 0.12s",
                  }}>
                    <div style={{ fontSize: "16px", marginBottom: "2px" }}>{c.icon}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 600, color: context === c.id ? lang.color : "var(--text-1)" }}>{c.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label style={labelStyle}>Tone — भाव</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {TONES.map(t => (
                  <button key={t.id} onClick={() => setTone(t.id)} style={{
                    padding: "8px 10px", borderRadius: "8px",
                    border: `1px solid ${tone === t.id ? lang.color : "var(--border)"}`,
                    background: tone === t.id ? `${lang.color}12` : "var(--bg-1)",
                    cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                  }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: tone === t.id ? lang.color : "var(--text-1)" }}>{t.label}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--text-4)" }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div>
              <label style={labelStyle}>Length — लंबाई</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                {[
                  { id: "short",  label: "Short",  sub: "~150 शब्द" },
                  { id: "medium", label: "Medium", sub: "~350 शब्द" },
                  { id: "long",   label: "Long",   sub: "~700 शब्द" },
                ].map(l => (
                  <button key={l.id} onClick={() => setLength(l.id)} style={{
                    padding: "8px 6px", borderRadius: "8px", textAlign: "center",
                    border: `1px solid ${length === l.id ? lang.color : "var(--border)"}`,
                    background: length === l.id ? `${lang.color}12` : "var(--bg-1)",
                    cursor: "pointer", transition: "all 0.12s",
                  }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600, color: length === l.id ? lang.color : "var(--text-1)" }}>{l.label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)" }}>{l.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} style={{
              width: "100%", padding: "14px",
              background: isGenerating || !topic.trim() ? "var(--bg-3)" : lang.color,
              border: "none", borderRadius: "10px",
              cursor: isGenerating || !topic.trim() ? "not-allowed" : "pointer",
              color: isGenerating || !topic.trim() ? "var(--text-4)" : "#fff",
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "15px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.15s",
            }}>
              {isGenerating
                ? <><Loader2 size={17} className="spin" /> {lang.native} में लिख रहे हैं…</>
                : <><Sparkles size={17} /> {lang.native} में लिखें</>
              }
            </button>

            {/* Language info card */}
            <div style={{ padding: "12px 14px", background: "var(--bg-1)", border: `1px solid ${lang.color}20`, borderRadius: "10px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: lang.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                {lang.name} — Cultural Context
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-3)", lineHeight: 1.6 }}>
                {lang.code === "hi" && "North Indian culture, Hindu traditions, Bollywood, cricket, festivals"}
                {lang.code === "mr" && "Maharashtra, Maratha pride, Ganesh Chaturthi, Mumbai & Pune culture"}
                {lang.code === "ta" && "Dravidian culture, Sangam literature, Kollywood, classical traditions"}
                {lang.code === "te" && "Telugu literature, Tollywood, Kuchipudi, Hyderabad's IT culture"}
                {lang.code === "bn" && "Tagore's Bengal, Durga Puja, intellectual tradition, literature"}
                {lang.code === "gu" && "Navratri, business values, Gandhi, Gujarat's entrepreneurial spirit"}
              </p>
            </div>
          </div>

          {/* ── Right: Output ── */}
          <div>
            {/* Action bar */}
            {isDone && output && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} style={actionBtnStyle}>
                  <Copy size={13} /> Copy
                </button>
                <button onClick={() => handleExport("pdf")} style={actionBtnStyle}>
                  <Download size={13} /> PDF
                </button>
                <button onClick={() => handleExport("docx")} style={actionBtnStyle}>
                  <Download size={13} /> DOCX
                </button>
                <div style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: "7px", background: `${lang.color}15`, border: `1px solid ${lang.color}30` }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: lang.color, fontWeight: 600 }}>
                    {lang.native} · {output.split(/\s+/).length} words
                  </span>
                </div>
              </div>
            )}

            {/* Output area */}
            {output ? (
              <div style={{
                background: "var(--bg-1)", border: `1px solid ${lang.color}25`,
                borderRadius: "14px", padding: "28px 32px",
                fontSize: "16px", lineHeight: "2.0", color: "var(--text-1)",
                fontFamily: "'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Bengali', sans-serif",
                whiteSpace: "pre-wrap", minHeight: "300px",
                borderLeft: `4px solid ${lang.color}`,
              }}>
                {output}
                {isGenerating && (
                  <span style={{ display: "inline-block", width: "2px", height: "18px", background: lang.color, marginLeft: "2px", animation: "blink 1s infinite", verticalAlign: "text-bottom" }} />
                )}
              </div>
            ) : (
              <div style={{
                height: "400px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "var(--bg-1)", border: `1px solid var(--border)`,
                borderRadius: "14px", gap: "16px",
              }}>
                <div style={{ fontSize: "48px" }}>🇮🇳</div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "20px", fontWeight: 700, color: "var(--text-2)" }}>
                  भारत AI
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-4)", textAlign: "center", maxWidth: "300px" }}>
                  Select a language, enter a topic, and generate native Indian content
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  {LANGUAGES.map(l => (
                    <span key={l.code} style={{
                      fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600,
                      color: l.color, background: `${l.color}12`,
                      padding: "4px 12px", borderRadius: "99px",
                      border: `1px solid ${l.color}30`,
                    }}>
                      {l.native}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-sans)", fontSize: "11px",
  fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase",
  color: "var(--text-3)", marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-1)", border: "1px solid var(--border)",
  borderRadius: "8px", padding: "9px 12px", color: "var(--text-1)",
  fontFamily: "var(--font-sans)", fontSize: "13px", outline: "none",
  boxSizing: "border-box",
};

const actionBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "5px",
  padding: "7px 12px", borderRadius: "7px",
  background: "var(--bg-1)", border: "1px solid var(--border)",
  cursor: "pointer", color: "var(--text-2)",
  fontFamily: "var(--font-sans)", fontSize: "12px", transition: "all 0.12s",
};
