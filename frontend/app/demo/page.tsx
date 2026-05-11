"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink, ChevronRight, Play, Pause, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  Demo Page — /demo
//
//  Professor presentation mode. Shows all TextForge AI
//  features in order with pre-filled examples and
//  auto-playing text animation.
// ─────────────────────────────────────────────────────────────

const DEMO_STEPS = [
  {
    id: "intro",
    title: "TextForge AI",
    subtitle: "From a notebook assignment to a production AI application",
    color: "#D47E30",
    icon: "🔥",
    content: null,
    cta: null,
  },
  {
    id: "generate",
    title: "Smart Text Generation",
    subtitle: "Topic + Tone + Length + Language + SEO Keywords → Publication-ready text in seconds",
    color: "#D47E30",
    icon: "✨",
    content: {
      type: "demo",
      topic: "The impact of artificial intelligence on modern healthcare",
      tone: "Academic",
      length: "Medium (~350 words)",
      language: "English",
      output: `The integration of artificial intelligence (AI) into modern healthcare represents one of the most transformative developments in medical history. Machine learning algorithms now demonstrate diagnostic accuracy rivalling experienced clinicians across disciplines including radiology, pathology, and dermatology (Topol, 2019).

AI systems excel particularly in pattern recognition tasks. Deep learning models trained on millions of medical images can detect diabetic retinopathy with 90% sensitivity — comparable to ophthalmologist performance — while processing thousands of scans per hour (Gulshan et al., 2016). This scalability addresses critical healthcare workforce shortages in underserved regions.

Predictive analytics represents another frontier. Natural language processing systems mine electronic health records to identify sepsis risk hours before clinical deterioration, enabling life-saving interventions. Early warning systems demonstrate 18% reduction in intensive care mortality in randomised trials.

The economic implications are substantial. McKinsey estimates AI could generate $100 billion annually in value for the US healthcare system through improved efficiency and outcomes. Paradoxically, AI also democratises expertise — a rural clinic with an AI diagnostic assistant can offer specialist-level screening previously accessible only at tertiary centres.

Ethical considerations remain paramount. Algorithmic bias, where models underperform on underrepresented populations, necessitates rigorous validation across demographic groups. Transparency in clinical AI decision-making is equally critical — physicians require explainable outputs to maintain accountability.

The trajectory is clear: AI will not replace physicians but will fundamentally augment clinical capability, allowing practitioners to focus on empathy, complex reasoning, and the irreplaceable human dimensions of care.`,
    },
    cta: { label: "Try it yourself", href: "/workspace" },
  },
  {
    id: "detection",
    title: "AI Detection & Humaniser",
    subtitle: "Every generation shows a risk score — and one click rewrites it to pass detectors",
    color: "#E05050",
    icon: "🛡️",
    content: {
      type: "detection",
      score: 38,
      dimensions: [
        { name: "Sentence Variety", score: 42, label: "Medium", risk: false },
        { name: "AI Phrases", score: 55, label: "Medium", risk: true },
        { name: "Vocabulary Range", score: 28, label: "High", risk: false },
        { name: "Sentence Openings", score: 18, label: "Varied", risk: false },
        { name: "Punctuation Pattern", score: 35, label: "Mixed", risk: false },
      ],
      afterScore: 14,
      humanisedPreview: `AI's arrival in healthcare isn't just incremental progress — it's a genuine shift in what medicine can do. Diagnostic algorithms now match specialist accuracy in reading X-rays, spotting tumours, and flagging retinal disease. Not someday. Now.

What makes this interesting isn't the technology itself. It's the scale. A single trained model can screen thousands of patients overnight. In regions where one doctor serves ten thousand people, that matters enormously.

The economic case is straightforward: less waste, faster diagnosis, fewer missed cases. But the human case is more compelling. When AI handles pattern recognition, clinicians get time back — for the conversations, the judgment calls, the moments that actually require a human in the room.

None of this is without tension. Models trained on narrow populations fail on others. Black-box outputs make accountability murky. These aren't small problems.

Still, the direction is set. AI won't replace doctors. It will change what doctors spend their time doing — and arguably, for the better.`,
    },
    cta: { label: "See it live", href: "/workspace" },
  },
  {
    id: "domain",
    title: "Deep Domain Templates",
    subtitle: "ChatGPT asks 0 questions before writing a legal contract. TextForge asks 14.",
    color: "#7F77DD",
    icon: "⚖️",
    content: {
      type: "domain",
      domains: [
        { name: "Legal", icon: "⚖️", params: 14, color: "#7F77DD", example: "NDA between TextForge AI and Client Corp — India jurisdiction, 2-year term, mutual confidentiality, arbitration" },
        { name: "Medical", icon: "🏥", params: 12, color: "#1D9E75", example: "STEMI Case Study — 52M, anterior MI, emergency PCI, cardiology follow-up" },
        { name: "Startup", icon: "🚀", params: 13, color: "#D85A30", example: "Seed pitch narrative — AI/SaaS, ₹1.5Cr ask, 40% MoM growth, India market" },
        { name: "Research", icon: "🔬", params: 11, color: "#185FA5", example: "IEEE abstract — ML + NLP, n=50,000, 94.2% accuracy, NeurIPS target" },
        { name: "Grant", icon: "💰", params: 10, color: "#BA7517", example: "DST India proposal — AgriTech, ₹50L, 5,000 farmers, crop disease detection" },
        { name: "HR", icon: "👥", params: 10, color: "#D4537E", example: "Senior SWE JD — startup tone, remote, ₹18-26 LPA + ESOP, React/Node" },
      ],
    },
    cta: { label: "Try Domain Docs", href: "/domain" },
  },
  {
    id: "citations",
    title: "Academic Citations Generator",
    subtitle: "Real verifiable sources from 200M+ papers — every paragraph has references",
    color: "#185FA5",
    icon: "📚",
    content: {
      type: "citations",
      topic: "Deep learning in medical image classification",
      style: "APA 7th",
      sources: [
        { inText: "(Litjens et al., 2017)", title: "A survey on deep learning in medical image analysis", journal: "Medical Image Analysis", year: 2017, citations: 4821 },
        { inText: "(Esteva et al., 2017)", title: "Dermatologist-level classification of skin cancer with deep neural networks", journal: "Nature", year: 2017, citations: 3204 },
        { inText: "(Gulshan et al., 2016)", title: "Development and validation of a deep learning algorithm for detection of diabetic retinopathy", journal: "JAMA", year: 2016, citations: 2891 },
        { inText: "(Rajpurkar et al., 2017)", title: "CheXNet: Radiologist-level pneumonia detection on chest X-rays", journal: "arXiv", year: 2017, citations: 1876 },
      ],
      outputPreview: `Deep learning has fundamentally transformed medical image classification, achieving diagnostic accuracy previously attainable only by specialist clinicians. A comprehensive survey by Litjens et al. (2017) catalogued over 300 deep learning applications across medical imaging modalities, establishing the field's rapid maturation.

Landmark studies demonstrated human-competitive performance across specialties. Esteva et al. (2017) achieved dermatologist-level accuracy in classifying 129,450 skin lesion images, while Gulshan et al. (2016) developed a retinal algorithm detecting diabetic retinopathy with 90.3% sensitivity. Thoracic imaging followed: Rajpurkar et al. (2017) demonstrated pneumonia detection surpassing radiologist performance on the ChestX-ray14 benchmark.

The convergence of large annotated datasets, computational advances, and architectural innovations — particularly convolutional neural networks — underpins these achievements.

References:
Gulshan, V., et al. (2016). Development and validation of a deep learning algorithm for detection of diabetic retinopathy in retinal fundus photographs. JAMA, 316(22), 2402–2410.
Litjens, G., et al. (2017). A survey on deep learning in medical image analysis. Medical Image Analysis, 42, 60–88.`,
    },
    cta: { label: "Generate with citations", href: "/citations" },
  },
  {
    id: "stats",
    title: "Analytics Dashboard",
    subtitle: "MongoDB aggregation pipelines + Recharts — your generation history visualised",
    color: "#1D9E75",
    icon: "📊",
    content: {
      type: "stats",
      metrics: [
        { label: "Total Generations", value: "47", icon: "✨" },
        { label: "Total Words", value: "18,420", icon: "📝" },
        { label: "Starred", value: "12", icon: "⭐" },
        { label: "Day Streak", value: "7", icon: "🔥" },
      ],
      toneBreakdown: [
        { tone: "Academic", count: 18, color: "#E0B85E" },
        { tone: "Formal", count: 14, color: "#7EB8E8" },
        { tone: "Creative", count: 9, color: "#B89AE0" },
        { tone: "Casual", count: 6, color: "#5EC49A" },
      ],
    },
    cta: { label: "View your stats", href: "/stats" },
  },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [typedText, setTypedText]     = useState("");
  const [showOutput, setShowOutput]   = useState(false);
  const intervalRef = useRef<any>(null);
  const typeRef     = useRef<any>(null);

  const step = DEMO_STEPS[currentStep];

  // Auto-advance
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = setTimeout(() => {
      if (currentStep < DEMO_STEPS.length - 1) {
        goToStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, 8000);
    return () => clearTimeout(intervalRef.current);
  }, [isPlaying, currentStep]);

  // Typewriter effect for output text
  useEffect(() => {
    setTypedText("");
    setShowOutput(false);
    clearTimeout(typeRef.current);

    const content = step.content;
    if (!content || content.type !== "demo") return;

    const fullText = content.output;
    let i = 0;
    typeRef.current = setTimeout(() => {
      setShowOutput(true);
      const interval = setInterval(() => {
        i += 6;
        setTypedText(fullText.slice(0, i));
        if (i >= fullText.length) clearInterval(interval);
      }, 16);
      return () => clearInterval(interval);
    }, 600);

    return () => clearTimeout(typeRef.current);
  }, [currentStep]);

  const goToStep = (idx: number) => {
    setCurrentStep(idx);
    setTypedText("");
    setShowOutput(false);
  };

  const reset = () => {
    setIsPlaying(false);
    goToStep(0);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>

      {/* Progress bar */}
      <div style={{ height: "3px", background: "var(--bg-2)", flexShrink: 0 }}>
        <div style={{
          height: "100%", background: "var(--brand)",
          width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%`,
          transition: "width 0.4s ease",
        }} />
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Left sidebar — steps ── */}
        <div style={{
          width: "220px", flexShrink: 0, borderRight: "1px solid var(--border)",
          padding: "16px 8px", display: "flex", flexDirection: "column", gap: "4px",
          overflowY: "auto",
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px", marginBottom: "8px" }}>
            Demo Flow
          </p>
          {DEMO_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => { setIsPlaying(false); goToStep(i); }} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 10px", borderRadius: "8px",
              background: i === currentStep ? `${s.color}15` : "transparent",
              border: `1px solid ${i === currentStep ? s.color + "40" : "transparent"}`,
              cursor: "pointer", textAlign: "left", transition: "all 0.12s",
            }}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{s.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: i === currentStep ? 600 : 400, color: i === currentStep ? s.color : "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.title}
                </p>
              </div>
              {i < currentStep && <span style={{ fontSize: "10px", color: "#1D9E75" }}>✓</span>}
              {i === currentStep && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />}
            </button>
          ))}

          {/* Controls */}
          <div style={{ marginTop: "auto", padding: "8px", display: "flex", gap: "6px" }}>
            <button onClick={() => setIsPlaying(!isPlaying)} style={{
              flex: 1, padding: "8px", borderRadius: "8px",
              background: "var(--brand)", border: "none", cursor: "pointer",
              color: "var(--bg-base)", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
            }}>
              {isPlaying ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Auto-play</>}
            </button>
            <button onClick={reset} style={{
              padding: "8px", borderRadius: "8px",
              background: "var(--bg-2)", border: "1px solid var(--border)",
              cursor: "pointer", color: "var(--text-2)",
            }}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          {/* Step header */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "28px" }}>{step.icon}</span>
              <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "24px", color: step.color, letterSpacing: "-0.02em" }}>
                {step.title}
              </h1>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", background: "var(--bg-2)", padding: "2px 8px", borderRadius: "99px", border: "1px solid var(--border)" }}>
                {currentStep + 1} / {DEMO_STEPS.length}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-2)", lineHeight: 1.6 }}>
              {step.subtitle}
            </p>
          </div>

          {/* Intro step */}
          {step.id === "intro" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "Live at", value: "textforge-ai-sable.vercel.app", icon: "🌐" },
                { label: "AI Model", value: "Google Gemini 2.5 Flash", icon: "🤖" },
                { label: "Database", value: "MongoDB Atlas", icon: "🗄️" },
                { label: "Auth", value: "Google + GitHub OAuth", icon: "🔐" },
                { label: "Backend", value: "Express + TypeScript", icon: "⚡" },
                { label: "Frontend", value: "Next.js 14 + React", icon: "⚛️" },
                { label: "ML Model", value: "PyTorch LSTM (notebook)", icon: "🧠" },
                { label: "Deployed", value: "Vercel + Railway", icon: "☁️" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ padding: "14px 16px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>{icon}</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--text-1)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generate demo */}
          {step.id === "generate" && step.content && (
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "TOPIC", value: step.content.topic },
                  { label: "TONE", value: step.content.tone },
                  { label: "LENGTH", value: step.content.length },
                  { label: "LANGUAGE", value: step.content.language },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: "10px 12px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>{label}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-1)", fontWeight: 500 }}>{value}</p>
                  </div>
                ))}
                <div style={{ padding: "10px 12px", background: "var(--brand-subtle)", border: "1px solid var(--border-hover)", borderRadius: "8px" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>STREAMING</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--brand)", fontWeight: 600 }}>SSE token-by-token</p>
                </div>
              </div>
              <div style={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", fontFamily: "var(--font-serif)", fontSize: "14px", lineHeight: "1.85", color: "var(--text-1)", minHeight: "320px", whiteSpace: "pre-wrap" }}>
                {showOutput ? typedText : ""}
                {showOutput && typedText.length < (step.content.output?.length || 0) && (
                  <span style={{ display: "inline-block", width: "2px", height: "16px", background: "var(--brand)", verticalAlign: "text-bottom", animation: "blink 1s infinite" }} />
                )}
              </div>
            </div>
          )}

          {/* Detection demo */}
          {step.id === "detection" && step.content?.type === "detection" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Original text — AI score</p>
                <div style={{ padding: "16px", background: "var(--bg-1)", border: "1px solid #E0505030", borderRadius: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)" }}>AI Detection Analysis</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "20px", color: "#E8A050" }}>{step.content.score}%</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#E8A050" }}>Mostly human-like</span>
                  </div>
                  {step.content.dimensions.map((d: any) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-2)", width: "130px", flexShrink: 0 }}>{d.name}</span>
                      <div style={{ flex: 1, height: "4px", background: "var(--bg-3)", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "99px", width: `${d.score}%`, background: d.risk ? "#E05050" : "#1D9E75" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: d.risk ? "#E05050" : "#1D9E75", width: "55px", textAlign: "right" }}>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>After humanise — AI score drops</p>
                <div style={{ padding: "16px", background: "var(--bg-1)", border: "1px solid #1D9E7530", borderRadius: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)" }}>After Humanise</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "20px", color: "#1D9E75" }}>{step.content.afterScore}%</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#1D9E75" }}>✅ Likely human-written</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "13px", lineHeight: "1.8", color: "var(--text-2)" }}>
                    {step.content.humanisedPreview}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Domain demo */}
          {step.id === "domain" && step.content?.type === "domain" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }}>
                {step.content.domains.map((d: any) => (
                  <div key={d.name} style={{ padding: "16px", background: "var(--bg-1)", border: `1px solid ${d.color}30`, borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "20px" }}>{d.icon}</span>
                      <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px", color: d.color }}>{d.name}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: d.color, background: `${d.color}15`, padding: "1px 6px", borderRadius: "99px", marginLeft: "auto" }}>{d.params} params</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-3)", lineHeight: 1.5 }}>{d.example}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 16px", background: "var(--brand-subtle)", border: "1px solid var(--border-hover)", borderRadius: "10px" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--brand)", fontWeight: 600 }}>
                  "ChatGPT asks 0 questions before writing a legal contract. TextForge AI asks 14 — jurisdiction, governing law, liability limits, IP ownership, dispute resolution. The depth of domain expertise embedded in the prompts IS the product."
                </p>
              </div>
            </div>
          )}

          {/* Citations demo */}
          {step.id === "citations" && step.content?.type === "citations" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                  {step.content.sources.length} real sources found — {step.content.style} format
                </p>
                {step.content.sources.map((s: any) => (
                  <div key={s.title} style={{ padding: "10px 12px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#185FA5", fontWeight: 600, flexShrink: 0, marginTop: "1px" }}>{s.inText}</span>
                      <div>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-1)", fontWeight: 500, marginBottom: "2px" }}>{s.title}</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)" }}>{s.journal} · {s.year}</p>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#1D9E75", background: "#E1F5EE", padding: "1px 6px", borderRadius: "99px" }}>📊 {s.citations.toLocaleString()} citations</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Generated with citations woven in</p>
                <div style={{ padding: "16px 20px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "12px", fontFamily: "var(--font-serif)", fontSize: "13px", lineHeight: "1.85", color: "var(--text-1)" }}>
                  {step.content.outputPreview.split(/(\([A-Z][^)]{2,50}\d{4}[^)]*\))/g).map((part: string, i: number) =>
                    i % 2 === 1 ? (
                      <span key={i} style={{ color: "#185FA5", fontWeight: 600, fontFamily: "var(--font-mono)", fontSize: "11px", background: "#E6F1FB", padding: "1px 3px", borderRadius: "3px" }}>{part}</span>
                    ) : <span key={i}>{part}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats demo */}
          {step.id === "stats" && step.content?.type === "stats" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
                {step.content.metrics.map((m: any) => (
                  <div key={m.label} style={{ padding: "16px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: "24px", marginBottom: "6px" }}>{m.icon}</div>
                    <p style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "22px", color: "var(--brand)", marginBottom: "4px" }}>{m.value}</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-3)" }}>{m.label}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>Tone breakdown</p>
                {step.content.toneBreakdown.map((t: any) => (
                  <div key={t.tone} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-2)", width: "80px" }}>{t.tone}</span>
                    <div style={{ flex: 1, height: "8px", background: "var(--bg-3)", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: "99px", width: `${(t.count / 47) * 100}%`, background: t.color }} />
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)", width: "24px", textAlign: "right" }}>{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA + Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => currentStep > 0 && goToStep(currentStep - 1)} disabled={currentStep === 0} style={{
                padding: "8px 16px", borderRadius: "8px", background: "var(--bg-2)",
                border: "1px solid var(--border)", cursor: currentStep === 0 ? "not-allowed" : "pointer",
                color: currentStep === 0 ? "var(--text-4)" : "var(--text-1)",
                fontFamily: "var(--font-sans)", fontSize: "13px",
              }}>← Previous</button>
              <button onClick={() => currentStep < DEMO_STEPS.length - 1 && goToStep(currentStep + 1)} disabled={currentStep === DEMO_STEPS.length - 1} style={{
                padding: "8px 16px", borderRadius: "8px", background: "var(--brand)",
                border: "none", cursor: currentStep === DEMO_STEPS.length - 1 ? "not-allowed" : "pointer",
                color: "var(--bg-base)", fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600,
                display: "flex", alignItems: "center", gap: "5px",
              }}>Next <ChevronRight size={14} /></button>
            </div>

            {step.cta && (
              <Link href={step.cta.href} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "8px",
                background: `${step.color}15`, border: `1px solid ${step.color}40`,
                color: step.color, fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600,
                textDecoration: "none", transition: "all 0.15s",
              }}>
                {step.cta.label} <ExternalLink size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
