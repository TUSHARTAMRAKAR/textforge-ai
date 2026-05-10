// ─────────────────────────────────────────────────────────────
//  domainTemplates.ts — Deep Domain Template Definitions
//
//  This is the CORE of the Deep Domain feature.
//  Each domain has:
//    - metadata (name, description, icon, color)
//    - fields (the 10-14 parameters the user fills in)
//    - outputTypes (what documents can be generated)
//
//  The prompt engineering functions are in geminiService.ts
//  These field definitions drive the dynamic form in DomainForm.tsx
// ─────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "number"
  | "date";

export interface DomainField {
  id:          string;
  label:       string;
  type:        FieldType;
  placeholder?: string;
  options?:    { value: string; label: string }[];
  required:    boolean;
  helpText?:   string;
}

export interface DomainOutputType {
  id:          string;
  label:       string;
  description: string;
  icon:        string;
}

export interface DomainTemplate {
  id:          string;
  name:        string;
  tagline:     string;
  description: string;
  icon:        string;
  color:       string;
  bgColor:     string;
  fields:      DomainField[];
  outputTypes: DomainOutputType[];
  exampleUseCase: string;
}

// ─────────────────────────────────────────────────────────────
//  DOMAIN 1: LEGAL
// ─────────────────────────────────────────────────────────────
const legalDomain: DomainTemplate = {
  id:          "legal",
  name:        "Legal",
  tagline:     "Contract & Agreement Generator",
  description: "Generate legally-structured contracts, NDAs, and agreements with jurisdiction-specific clauses, liability limits, and dispute resolution terms.",
  icon:        "⚖️",
  color:       "#7F77DD",
  bgColor:     "#EEEDFE",
  exampleUseCase: "A freelance developer needs an NDA before sharing proprietary code with a client.",
  outputTypes: [
    { id: "nda",         label: "Non-Disclosure Agreement (NDA)",    description: "Protect confidential information",       icon: "🔒" },
    { id: "service",     label: "Service Agreement",                  description: "Define scope of work and payment",       icon: "🤝" },
    { id: "employment",  label: "Employment Contract",                description: "Hire with clear terms and conditions",   icon: "👔" },
    { id: "freelance",   label: "Freelance Contract",                 description: "Project-based work agreement",           icon: "💻" },
    { id: "partnership", label: "Partnership Agreement",              description: "Define roles in a business partnership", icon: "🏢" },
  ],
  fields: [
    {
      id: "contractType", label: "Contract Type", type: "select", required: true,
      options: [
        { value: "nda",         label: "Non-Disclosure Agreement (NDA)" },
        { value: "service",     label: "Service Agreement" },
        { value: "employment",  label: "Employment Contract" },
        { value: "freelance",   label: "Freelance Contract" },
        { value: "partnership", label: "Partnership Agreement" },
      ],
    },
    {
      id: "party1Name", label: "Party 1 — Full Name / Company", type: "text",
      placeholder: "e.g. Tushar Tamrakar / TextForge Technologies Pvt. Ltd.",
      required: true,
    },
    {
      id: "party1Role", label: "Party 1 — Role", type: "select", required: true,
      options: [
        { value: "client",      label: "Client" },
        { value: "employer",    label: "Employer" },
        { value: "disclosing",  label: "Disclosing Party" },
        { value: "service_provider", label: "Service Provider" },
        { value: "partner",     label: "Business Partner" },
      ],
    },
    {
      id: "party2Name", label: "Party 2 — Full Name / Company", type: "text",
      placeholder: "e.g. Ravi Kumar / Acme Corp",
      required: true,
    },
    {
      id: "party2Role", label: "Party 2 — Role", type: "select", required: true,
      options: [
        { value: "contractor",  label: "Contractor / Freelancer" },
        { value: "employee",    label: "Employee" },
        { value: "receiving",   label: "Receiving Party" },
        { value: "client",      label: "Client" },
        { value: "partner",     label: "Business Partner" },
      ],
    },
    {
      id: "jurisdiction", label: "Jurisdiction", type: "select", required: true,
      helpText: "The country/state whose laws govern this contract",
      options: [
        { value: "india",          label: "India" },
        { value: "us_california",  label: "USA — California" },
        { value: "us_delaware",    label: "USA — Delaware" },
        { value: "uk",             label: "United Kingdom" },
        { value: "singapore",      label: "Singapore" },
        { value: "uae",            label: "UAE" },
      ],
    },
    {
      id: "contractValue", label: "Contract Value / Compensation", type: "text",
      placeholder: "e.g. ₹2,00,000 fixed / $5,000/month / Equity: 2%",
      required: false,
    },
    {
      id: "duration", label: "Contract Duration", type: "select", required: true,
      options: [
        { value: "one_time",   label: "One-time project" },
        { value: "1_month",    label: "1 month" },
        { value: "3_months",   label: "3 months" },
        { value: "6_months",   label: "6 months" },
        { value: "1_year",     label: "1 year" },
        { value: "2_years",    label: "2 years" },
        { value: "indefinite", label: "Indefinite / At-will" },
      ],
    },
    {
      id: "confidentialityLevel", label: "Confidentiality Level", type: "select", required: true,
      options: [
        { value: "standard",    label: "Standard — General business info" },
        { value: "strict",      label: "Strict — Trade secrets, proprietary tech" },
        { value: "mutual",      label: "Mutual — Both parties share confidential info" },
        { value: "none",        label: "None — No confidentiality clause needed" },
      ],
    },
    {
      id: "liabilityLimit", label: "Liability Limitation", type: "select", required: true,
      options: [
        { value: "contract_value",  label: "Limited to contract value" },
        { value: "3x_contract",     label: "Limited to 3x contract value" },
        { value: "no_limit",        label: "No limitation (full liability)" },
        { value: "exclude_indirect",label: "Exclude indirect/consequential damages" },
      ],
    },
    {
      id: "disputeResolution", label: "Dispute Resolution", type: "select", required: true,
      options: [
        { value: "arbitration",  label: "Arbitration" },
        { value: "mediation",    label: "Mediation first, then litigation" },
        { value: "litigation",   label: "Court litigation" },
        { value: "negotiation",  label: "Good-faith negotiation" },
      ],
    },
    {
      id: "ipOwnership", label: "Intellectual Property Ownership", type: "select", required: true,
      helpText: "Who owns work created under this contract?",
      options: [
        { value: "client_owns",      label: "Client / Employer owns all IP" },
        { value: "contractor_owns",  label: "Contractor retains IP, grants licence" },
        { value: "joint",            label: "Joint ownership" },
        { value: "na",               label: "Not applicable" },
      ],
    },
    {
      id: "nonCompete", label: "Non-Compete Clause", type: "select", required: false,
      options: [
        { value: "none",       label: "No non-compete" },
        { value: "6_months",   label: "6 months post-termination" },
        { value: "1_year",     label: "1 year post-termination" },
        { value: "2_years",    label: "2 years post-termination" },
      ],
    },
    {
      id: "specialClauses", label: "Special Clauses / Notes", type: "textarea",
      placeholder: "e.g. Payment within 30 days of invoice. Source code delivery via GitHub. Requires weekly status reports.",
      required: false,
      helpText: "Any additional terms or specific requirements",
    },
  ],
};

// ─────────────────────────────────────────────────────────────
//  DOMAIN 2: MEDICAL
// ─────────────────────────────────────────────────────────────
const medicalDomain: DomainTemplate = {
  id:          "medical",
  name:        "Medical",
  tagline:     "Clinical Document Writer",
  description: "Generate professional clinical documents — case studies, patient summaries, research abstracts, and discharge notes — with medically accurate structure and terminology.",
  icon:        "🏥",
  color:       "#1D9E75",
  bgColor:     "#E1F5EE",
  exampleUseCase: "A medical student needs to write a structured case study for their clinical rotation assessment.",
  outputTypes: [
    { id: "case_study",       label: "Clinical Case Study",       description: "Detailed patient case for academic use",    icon: "📋" },
    { id: "patient_summary",  label: "Patient Summary / SOAP",    description: "Structured clinical encounter note",        icon: "🩺" },
    { id: "research_abstract",label: "Medical Research Abstract", description: "Journal-ready research abstract",           icon: "🔬" },
    { id: "discharge_notes",  label: "Discharge Summary",         description: "End-of-care patient handoff document",      icon: "🏠" },
  ],
  fields: [
    {
      id: "documentType", label: "Document Type", type: "select", required: true,
      options: [
        { value: "case_study",        label: "Clinical Case Study" },
        { value: "patient_summary",   label: "Patient Summary / SOAP Note" },
        { value: "research_abstract", label: "Medical Research Abstract" },
        { value: "discharge_notes",   label: "Discharge Summary" },
      ],
    },
    {
      id: "medicalSpecialty", label: "Medical Specialty", type: "select", required: true,
      options: [
        { value: "general",        label: "General Medicine / Internal Medicine" },
        { value: "cardiology",     label: "Cardiology" },
        { value: "neurology",      label: "Neurology" },
        { value: "orthopedics",    label: "Orthopedics" },
        { value: "pediatrics",     label: "Pediatrics" },
        { value: "psychiatry",     label: "Psychiatry" },
        { value: "oncology",       label: "Oncology" },
        { value: "endocrinology",  label: "Endocrinology / Diabetes" },
        { value: "pulmonology",    label: "Pulmonology / Respiratory" },
        { value: "gastroenterology", label: "Gastroenterology" },
      ],
    },
    {
      id: "patientAge", label: "Patient Age & Gender", type: "text",
      placeholder: "e.g. 45-year-old male / 28F / Paediatric, 8 years",
      required: true,
    },
    {
      id: "chiefComplaint", label: "Chief Complaint / Presenting Problem", type: "textarea",
      placeholder: "e.g. Chest pain radiating to left arm for 2 hours, diaphoresis, shortness of breath",
      required: true,
      helpText: "The primary reason the patient sought medical care",
    },
    {
      id: "diagnosis", label: "Primary Diagnosis", type: "text",
      placeholder: "e.g. Acute Myocardial Infarction (STEMI) / Type 2 Diabetes Mellitus",
      required: true,
      helpText: "Include ICD-10 code if known",
    },
    {
      id: "comorbidities", label: "Comorbidities / Past Medical History", type: "text",
      placeholder: "e.g. Hypertension, Type 2 DM, prior MI in 2019",
      required: false,
    },
    {
      id: "symptoms", label: "Symptoms & Duration", type: "textarea",
      placeholder: "e.g. Chest pain: 6/10 severity, 2 hours duration. Nausea × 1 hour. No fever. SOB on exertion.",
      required: true,
    },
    {
      id: "investigations", label: "Key Investigations / Lab Findings", type: "textarea",
      placeholder: "e.g. ECG: ST elevation in V1-V4. Troponin: 2.4 ng/mL (elevated). CXR: normal.",
      required: false,
    },
    {
      id: "treatment", label: "Treatment Plan / Interventions", type: "textarea",
      placeholder: "e.g. Aspirin 300mg loading, Heparin infusion, Emergency PCI. Admitted to ICU.",
      required: true,
    },
    {
      id: "medications", label: "Current Medications", type: "text",
      placeholder: "e.g. Metformin 500mg BD, Amlodipine 5mg OD, Atorvastatin 40mg OD",
      required: false,
    },
    {
      id: "prognosis", label: "Prognosis & Outcome", type: "select", required: true,
      options: [
        { value: "good",         label: "Good — full recovery expected" },
        { value: "guarded",      label: "Guarded — uncertain outcome" },
        { value: "poor",         label: "Poor — significant morbidity likely" },
        { value: "improving",    label: "Improving — responding to treatment" },
        { value: "stable",       label: "Stable — chronic management required" },
      ],
    },
    {
      id: "followUp", label: "Follow-up Plan", type: "text",
      placeholder: "e.g. Review in 2 weeks. Repeat ECG at 1 month. Cardiology OPD in 6 weeks.",
      required: false,
    },
  ],
};

// ─────────────────────────────────────────────────────────────
//  DOMAIN 3: STARTUP
// ─────────────────────────────────────────────────────────────
const startupDomain: DomainTemplate = {
  id:          "startup",
  name:        "Startup",
  tagline:     "Pitch & Business Document Generator",
  description: "Generate investor-ready pitch decks, executive summaries, problem statements, and value propositions using the language VCs and accelerators expect.",
  icon:        "🚀",
  color:       "#D85A30",
  bgColor:     "#FAECE7",
  exampleUseCase: "A founder needs an executive summary to send to investors before a seed funding round.",
  outputTypes: [
    { id: "executive_summary", label: "Executive Summary",       description: "2-page investor-ready overview",          icon: "📄" },
    { id: "problem_statement", label: "Problem Statement",       description: "Compelling problem narrative",            icon: "❓" },
    { id: "value_proposition", label: "Value Proposition",       description: "Why customers choose you",               icon: "💡" },
    { id: "pitch_narrative",   label: "Pitch Narrative",         description: "Full verbal pitch script",               icon: "🎤" },
    { id: "investor_email",    label: "Cold Investor Email",     description: "Outreach email to angels/VCs",           icon: "📧" },
  ],
  fields: [
    {
      id: "documentType", label: "Document Type", type: "select", required: true,
      options: [
        { value: "executive_summary", label: "Executive Summary" },
        { value: "problem_statement", label: "Problem Statement" },
        { value: "value_proposition", label: "Value Proposition" },
        { value: "pitch_narrative",   label: "Full Pitch Narrative" },
        { value: "investor_email",    label: "Cold Investor Email" },
      ],
    },
    {
      id: "companyName", label: "Company / Startup Name", type: "text",
      placeholder: "e.g. TextForge AI", required: true,
    },
    {
      id: "industry", label: "Industry Vertical", type: "select", required: true,
      options: [
        { value: "saas",          label: "SaaS / Software" },
        { value: "ai_ml",         label: "AI / Machine Learning" },
        { value: "fintech",       label: "Fintech" },
        { value: "healthtech",    label: "Healthtech / MedTech" },
        { value: "edtech",        label: "EdTech" },
        { value: "ecommerce",     label: "E-commerce / D2C" },
        { value: "climate",       label: "Climate / Sustainability" },
        { value: "agritech",      label: "AgriTech" },
        { value: "logistics",     label: "Logistics / Supply Chain" },
        { value: "consumer",      label: "Consumer App" },
      ],
    },
    {
      id: "stage", label: "Funding Stage", type: "select", required: true,
      options: [
        { value: "idea",     label: "Idea Stage — no product yet" },
        { value: "pre_seed", label: "Pre-seed — MVP built" },
        { value: "seed",     label: "Seed — early traction" },
        { value: "series_a", label: "Series A — scaling" },
      ],
    },
    {
      id: "problem", label: "The Problem You Solve", type: "textarea",
      placeholder: "e.g. Small businesses spend 8+ hours/week writing product descriptions, emails, and marketing copy — with inconsistent quality and no subject matter expertise.",
      required: true,
      helpText: "Be specific. Use data/numbers if possible.",
    },
    {
      id: "solution", label: "Your Solution", type: "textarea",
      placeholder: "e.g. TextForge AI uses Gemini 2.5 Flash to generate publication-ready text in 30 seconds, with tone, length, and SEO keyword control.",
      required: true,
    },
    {
      id: "targetMarket", label: "Target Market & Size", type: "text",
      placeholder: "e.g. 50M small businesses in India — $4.2B content creation market",
      required: true,
    },
    {
      id: "businessModel", label: "Business Model", type: "select", required: true,
      options: [
        { value: "saas_subscription", label: "SaaS — Monthly/Annual subscription" },
        { value: "freemium",          label: "Freemium — Free + paid tiers" },
        { value: "usage_based",       label: "Usage-based pricing" },
        { value: "marketplace",       label: "Marketplace commission" },
        { value: "b2b_enterprise",    label: "B2B enterprise sales" },
        { value: "direct_sales",      label: "Direct D2C sales" },
      ],
    },
    {
      id: "traction", label: "Traction / Key Metrics", type: "text",
      placeholder: "e.g. 500 beta users, ₹2L MRR, 40% MoM growth, 3 paying enterprise clients",
      required: false,
      helpText: "Leave blank if pre-revenue",
    },
    {
      id: "fundingAsk", label: "Funding Ask", type: "text",
      placeholder: "e.g. ₹1.5 Crore / $500K seed round",
      required: false,
    },
    {
      id: "useOfFunds", label: "Use of Funds", type: "text",
      placeholder: "e.g. 50% engineering, 30% marketing, 20% operations",
      required: false,
    },
    {
      id: "unfairAdvantage", label: "Unfair Advantage / Moat", type: "textarea",
      placeholder: "e.g. Proprietary prompt engineering library trained on 10,000 domain-specific documents. First-mover in Hindi AI content generation.",
      required: true,
      helpText: "What can competitors NOT easily copy?",
    },
    {
      id: "teamBackground", label: "Team Background (optional)", type: "text",
      placeholder: "e.g. Ex-Google engineer + IIT Bombay MBA. Combined 12 years in AI/ML.",
      required: false,
    },
  ],
};

// ─────────────────────────────────────────────────────────────
//  Export all domains
// ─────────────────────────────────────────────────────────────
export const DOMAIN_TEMPLATES: DomainTemplate[] = [
  legalDomain,
  medicalDomain,
  startupDomain,
];

export const getDomainById = (id: string): DomainTemplate | undefined =>
  DOMAIN_TEMPLATES.find((d) => d.id === id);
