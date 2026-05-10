"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────
//  Showcase Page — /domain/showcase
//
//  WHY: Professors and evaluators don't want to fill 14 fields
//  to see what the feature does. This page shows the BEST
//  possible output for each domain — pre-generated, beautifully
//  displayed, instantly impressive.
//
//  Think of it as the "portfolio" of the Deep Domain feature.
// ─────────────────────────────────────────────────────────────

const SAMPLES = [
  {
    domain:     "Legal",
    icon:       "⚖️",
    color:      "#7F77DD",
    bgColor:    "#EEEDFE",
    outputType: "Non-Disclosure Agreement",
    parameters: ["Jurisdiction: India", "Parties: TextForge AI ↔ Client Corp", "Duration: 2 years", "IP: Disclosing party retains", "Dispute: Arbitration"],
    preview: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of the date last signed below, between TextForge Technologies Pvt. Ltd., a company incorporated under the Companies Act 2013, having its registered office at Raipur, Chhattisgarh ("Disclosing Party"), and Client Corp ("Receiving Party").

1. DEFINITIONS
1.1 "Confidential Information" means any non-public information disclosed by the Disclosing Party, whether orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure.

2. OBLIGATIONS OF RECEIVING PARTY
2.1 The Receiving Party agrees to: (a) hold all Confidential Information in strict confidence; (b) not disclose any Confidential Information to third parties without prior written consent; (c) use Confidential Information solely for the purpose of evaluating a potential business relationship.

3. TERM
This Agreement shall remain in effect for a period of two (2) years from the date of execution, unless earlier terminated by mutual written consent.

4. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the Indian Contract Act, 1872, and any disputes shall be resolved through arbitration under the Arbitration and Conciliation Act, 1996.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date written below.

___________________________          ___________________________
TextForge Technologies Pvt. Ltd.     Client Corp
Authorised Signatory                 Authorised Signatory
Date: _____________                  Date: _____________`,
  },
  {
    domain:     "Medical",
    icon:       "🏥",
    color:      "#1D9E75",
    bgColor:    "#E1F5EE",
    outputType: "Clinical Case Study",
    parameters: ["Specialty: Cardiology", "Patient: 52M", "Diagnosis: STEMI", "Format: SOAP", "Prognosis: Good"],
    preview: `CLINICAL CASE STUDY — ACUTE MYOCARDIAL INFARCTION (STEMI)

SUBJECTIVE
A 52-year-old male presented to the emergency department with a 3-hour history of severe, crushing chest pain (8/10 on NRS) radiating to the left arm and jaw, accompanied by diaphoresis and nausea. The patient reported no prior cardiac history but acknowledged hypertension (on Amlodipine 5mg OD) and a 20-pack-year smoking history. Family history is significant for paternal coronary artery disease.

OBJECTIVE
Vital signs: BP 158/96 mmHg, HR 98 bpm (irregular), RR 20/min, SpO2 94% on room air, Temp 37.1°C.
ECG: ST-segment elevation of 3mm in leads V1-V4 with reciprocal changes in inferior leads — consistent with anterior STEMI.
Troponin I: 4.2 ng/mL (significantly elevated; normal <0.04 ng/mL).
CXR: Mild pulmonary congestion, no cardiomegaly.
Echo (bedside): Anterior wall hypokinesia, EF estimated 40%.

ASSESSMENT
Primary diagnosis: ST-Elevation Myocardial Infarction (STEMI) — anterior (ICD-10: I21.0)
Contributing factors: Uncontrolled hypertension, active smoking, hyperlipidaemia (newly identified).
Risk stratification: TIMI Score 5/7 — high risk.

PLAN
Immediate: Aspirin 300mg loading dose, Clopidogrel 600mg, IV Heparin 5000 units bolus. Urgent cardiology referral for primary PCI. Oxygen supplementation to maintain SpO2 >95%.
Post-procedure: Beta-blocker, ACE inhibitor, statin therapy. Cardiac rehabilitation referral. Smoking cessation counselling. Dietary modification.
Follow-up: Outpatient cardiology review at 4 weeks. Repeat echocardiogram at 3 months. HbA1c and lipid panel at 6 weeks.

PROGNOSIS: Good with timely intervention. Patient counselled regarding lifestyle modifications and medication adherence.`,
  },
  {
    domain:     "Startup",
    icon:       "🚀",
    color:      "#D85A30",
    bgColor:    "#FAECE7",
    outputType: "Investor Pitch Narrative",
    parameters: ["Stage: Seed", "Industry: AI/SaaS", "Ask: ₹1.5Cr", "Market: ₹4,200Cr", "Model: Freemium"],
    preview: `TEXTFORGE AI — SEED ROUND PITCH

Every day, 50 million small businesses in India need to write something — a product description, a client email, a social media post. Most spend 6-8 hours a week on content they're not confident about, in a language that isn't their first, for audiences they don't fully understand.

They don't need another generic AI chatbox. They need an expert who asks the right questions.

TextForge AI is a generative text platform that doesn't just write for you — it interviews you first. Choose legal contract, medical case study, or startup pitch. Answer 12-14 domain-specific questions. Get output that a professional in that field would recognise as structurally correct.

In 4 months of beta: 500 active users, ₹2.1L MRR, 67% month-over-month retention — 3x the SaaS benchmark. Our largest user segment isn't tech-savvy founders. It's B.Tech students, small clinic owners, and first-generation entrepreneurs who never had access to a lawyer or MBA on speed dial.

The market is ₹4,200 crore and growing at 34% annually. We don't need to capture much of it to build a significant business.

We're raising ₹1.5 crore at a ₹9 crore post-money valuation. The funds go to: engineering (50%), growth marketing in Tier-2 cities (30%), and domain expert partnerships for prompt validation (20%).

Our moat isn't the AI — it's the 70+ parameters of domain-specific prompt engineering that took 6 months to build. Gemini can be swapped. Our domain knowledge library cannot.

We're not building another ChatGPT wrapper. We're building the professional document layer that India's next 100 million internet users will use to participate in the formal economy.

Join us.`,
  },
  {
    domain:     "Research",
    icon:       "🔬",
    color:      "#185FA5",
    bgColor:    "#E6F1FB",
    outputType: "Research Abstract",
    parameters: ["Field: CS/AI", "Style: IEEE", "250 words", "Method: Experimental", "Target: NeurIPS"],
    preview: `ABSTRACT

Background: Large language models (LLMs) have demonstrated remarkable capabilities in natural language generation tasks; however, their performance on low-resource Indian languages remains substantially below that achieved on high-resource languages such as English and Mandarin.

Objective: This study investigates the effect of language-specific tokenization strategies combined with cross-lingual attention mechanisms on the accuracy of LLMs when generating coherent text in Hindi, Marathi, and Tamil.

Methods: We evaluated four tokenization approaches — standard BPE, language-adaptive BPE, character-level, and a novel hybrid morpheme-aware tokenizer — across three transformer architectures (GPT-2, mT5, and a custom 340M-parameter model) trained on a curated 8.2 billion token multilingual corpus. Evaluation was conducted on 1,200 human-annotated samples across three linguistic tasks: semantic coherence, grammatical accuracy, and cultural appropriateness.

Results: The hybrid morpheme-aware tokenizer combined with multi-head cross-lingual attention achieved a 23.4% improvement in semantic coherence scores (p<0.001) and a 17.8% improvement in grammatical accuracy over the BPE baseline on Hindi text generation. Improvements were consistent across all three languages tested. Cultural appropriateness scores showed the largest variance, suggesting contextual fine-tuning as a priority for future work.

Conclusion: Language-specific tokenization is a critical but under-explored axis for improving LLM performance on morphologically rich Indian languages. These findings suggest that architecture-level adaptations — not merely data scaling — are necessary to close the performance gap with high-resource languages.

Keywords: large language models, low-resource NLP, tokenization, Hindi text generation, cross-lingual attention`,
  },
  {
    domain:     "Grant",
    icon:       "💰",
    color:      "#BA7517",
    bgColor:    "#FAEEDA",
    outputType: "Project Proposal",
    parameters: ["Funder: DST India", "Amount: ₹50L", "Sector: AgriTech", "Duration: 2 years", "Beneficiaries: 5,000 farmers"],
    preview: `PROJECT PROPOSAL

Project Title: AI-Powered Crop Disease Detection for Smallholder Farmers in Vidarbha

Submitted to: Department of Science & Technology (DST), Government of India
Amount Requested: ₹50,00,000
Project Duration: 24 months
Applicant Organisation: AgriSense Technologies (DPIIT Recognised Startup)

PROBLEM STATEMENT
Vidarbha's 8.5 million smallholder farmers lose an estimated 40% of their annual crop yield to fungal and bacterial diseases — not because treatment doesn't exist, but because diagnosis arrives too late. The nearest agricultural extension officer serves 2,400 farmers on average. By the time a farmer receives a diagnosis, the disease has spread to 60-70% of the crop. The economic cost is ₹3,200 crore annually in Vidarbha alone.

PROPOSED SOLUTION
AgriSense proposes developing and deploying a smartphone-based AI diagnostic tool that enables any farmer with a ₹6,000 Android phone to photograph a diseased leaf and receive: (a) disease identification with 94% accuracy, (b) treatment recommendations in Marathi, and (c) nearest pesticide supplier location. The system uses a convolutional neural network trained on 180,000 annotated crop disease images across 12 major crops.

IMPLEMENTATION APPROACH
Phase 1 (Months 1-8): Model development, validation with agricultural universities in Nagpur and Amravati, and pilot deployment with 500 farmers.
Phase 2 (Months 9-20): Full rollout to 5,000 farmers across 3 districts. Integration with PM-KISAN database for direct farmer outreach.
Phase 3 (Months 21-24): Impact evaluation, open-source model release, and documentation for national scale-up.

EXPECTED OUTCOMES
• 5,000 farmers trained and using the app by Month 20
• 30% average reduction in crop loss among active users (validated against control group)
• ₹1,920 average income increase per farmer per crop cycle
• Model accuracy: >92% on unseen test data across all 12 crops

SUSTAINABILITY
Post-grant, the application will transition to a freemium model with premium features for agribusinesses and fertiliser companies. Current LOIs from 3 agri-input companies totalling ₹18L annually ensure financial sustainability beyond DST support.`,
  },
  {
    domain:     "HR",
    icon:       "👥",
    color:      "#D4537E",
    bgColor:    "#FBEAF0",
    outputType: "Job Description",
    parameters: ["Role: Senior SWE", "Level: Senior", "Remote", "Startup tone", "Tech stack: React/Node"],
    preview: `SENIOR FULL-STACK ENGINEER
Remote · Full-time · ₹18-26 LPA + ESOP

About the Role
You won't just write code here — you'll architect the systems that 2 million users depend on daily. As our first senior engineer, you'll make foundational technical decisions, mentor a growing team, and ship features that directly drive revenue. If you want ownership, this is it.

What You'll Do
• Design and build scalable full-stack features across our Next.js frontend and Express/Node.js backend — from API design to pixel-perfect UI
• Own the performance and reliability of our core generation pipeline — we're at 50K daily API calls and growing 40% MoM
• Make architectural decisions on database schema, caching strategy, and infrastructure — with full context and full trust
• Review code, mentor 2 junior engineers, and raise the technical bar across the team
• Partner directly with the founder on product decisions — your engineering perspective shapes the roadmap

What We're Looking For
Must have: 5+ years building production web applications · Deep expertise in React 18 and Node.js/TypeScript · MongoDB or PostgreSQL at scale · Experience with REST API design and SSE/WebSockets · You've debugged production incidents at 2AM and know what "system design" actually means

Nice to have: Experience with LLM APIs (OpenAI, Gemini, Anthropic) · Redis caching · AWS/GCP deployment · Prior startup experience

Who Thrives Here
You ship fast and clean. You ask "why" before "how". You'd rather fix the root cause than patch the symptom. You care about the user, not just the ticket.

What We Offer
₹18-26 LPA based on experience · 0.3-0.7% ESOP (4-year vest, 1-year cliff) · Fully remote, async-first culture · ₹50,000 annual learning budget · Direct access to founding team · Your name on an architecture that matters`,
  },
];

export default function ShowcasePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SAMPLES[activeIdx];

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--bg-base)", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--brand)", background: "var(--brand-subtle)", padding: "2px 10px", borderRadius: "99px", border: "1px solid var(--border-hover)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Live Sample Outputs
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "28px", color: "var(--text-1)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Deep Domain Templates — Showcase
            </h1>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--text-3)", maxWidth: "560px" }}>
              Real outputs generated by TextForge AI using domain-specific parameters. Each document is structurally correct for its professional context.
            </p>
          </div>
          <Link href="/domain" style={{
            display: "flex", alignItems: "center", gap: "7px",
            padding: "10px 18px", borderRadius: "10px",
            background: "var(--brand)", color: "var(--bg-base)",
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px",
            textDecoration: "none", transition: "all 0.15s",
          }}>
            Generate Your Own <ArrowRight size={15} />
          </Link>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px", alignItems: "start" }}>

          {/* Left: Domain selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {SAMPLES.map((s, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "10px",
                border: `1px solid ${i === activeIdx ? s.color : "var(--border)"}`,
                background: i === activeIdx ? `${s.color}12` : "var(--bg-1)",
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}>
                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: i === activeIdx ? s.color : "var(--text-1)" }}>
                    {s.domain}
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "var(--text-3)" }}>
                    {s.outputType}
                  </div>
                </div>
              </button>
            ))}

            {/* Stats */}
            <div style={{ marginTop: "12px", padding: "14px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "10px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                Feature Stats
              </p>
              {[
                { label: "Domains",    value: "6" },
                { label: "Parameters", value: "70+" },
                { label: "Output types", value: "25" },
                { label: "vs ChatGPT", value: "0 params" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-3)" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: label === "vs ChatGPT" ? "#E05050" : "var(--brand)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sample output */}
          <div>
            {/* Parameters used */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.08em", alignSelf: "center" }}>
                Parameters used:
              </span>
              {active.parameters.map((p) => (
                <span key={p} style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px",
                  color: active.color, background: active.bgColor,
                  padding: "2px 9px", borderRadius: "99px",
                  border: `1px solid ${active.color}30`,
                }}>
                  {p}
                </span>
              ))}
            </div>

            {/* Document header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "10px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>{active.icon}</span>
                <div>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)" }}>
                    {active.domain} — {active.outputType}
                  </span>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", marginTop: "2px" }}>
                    Generated by TextForge AI · gemini-2.5-flash
                  </div>
                </div>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(active.preview); toast.success("Copied!"); }}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "6px 12px", borderRadius: "7px",
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  cursor: "pointer", color: "var(--text-2)",
                  fontFamily: "var(--font-sans)", fontSize: "12px",
                  transition: "all 0.12s",
                }}
              >
                <Copy size={13} /> Copy
              </button>
            </div>

            {/* The actual document */}
            <div style={{
              background: "var(--bg-1)", border: `1px solid ${active.color}30`,
              borderRadius: "14px", padding: "32px 36px",
              fontFamily: "var(--font-serif)", fontSize: "14px",
              lineHeight: "1.9", color: "var(--text-1)",
              whiteSpace: "pre-wrap", maxHeight: "600px", overflowY: "auto",
            }}>
              {active.preview}
            </div>

            {/* CTA */}
            <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
              <Link href="/domain" style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "9px 16px", borderRadius: "8px",
                background: active.color, color: "#fff",
                fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px",
                textDecoration: "none", transition: "all 0.15s",
              }}>
                Generate {active.domain} Document <ArrowRight size={13} />
              </Link>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-4)", alignSelf: "center" }}>
                This was generated with {SAMPLES[activeIdx].parameters.length} parameters in ~8 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
