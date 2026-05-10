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

// ─────────────────────────────────────────────────────────────
//  DOMAIN 4: RESEARCH
// ─────────────────────────────────────────────────────────────
const researchDomain: DomainTemplate = {
  id:          "research",
  name:        "Research",
  tagline:     "Academic Paper Writer",
  description: "Generate journal-ready academic sections — abstracts, literature reviews, methodologies, and conclusions — structured to publication standards.",
  icon:        "🔬",
  color:       "#185FA5",
  bgColor:     "#E6F1FB",
  exampleUseCase: "A PhD student needs a structured abstract for their machine learning paper submission to IEEE.",
  outputTypes: [
    { id: "abstract",           label: "Research Abstract",      description: "250-word structured abstract",           icon: "📄" },
    { id: "literature_review",  label: "Literature Review",      description: "Critical synthesis of existing work",    icon: "📚" },
    { id: "methodology",        label: "Methodology Section",    description: "Research design and methods",            icon: "⚗️" },
    { id: "discussion",         label: "Discussion & Analysis",  description: "Interpretation of findings",             icon: "💭" },
    { id: "conclusion",         label: "Conclusion",             description: "Summary, implications, future work",     icon: "✅" },
  ],
  fields: [
    {
      id: "researchField", label: "Research Field / Discipline", type: "select", required: true,
      options: [
        { value: "computer_science",  label: "Computer Science / AI / ML" },
        { value: "engineering",       label: "Engineering" },
        { value: "medicine",          label: "Medicine / Health Sciences" },
        { value: "social_sciences",   label: "Social Sciences" },
        { value: "management",        label: "Management / Business" },
        { value: "physics",           label: "Physics / Mathematics" },
        { value: "chemistry",         label: "Chemistry / Biology" },
        { value: "environmental",     label: "Environmental Sciences" },
        { value: "education",         label: "Education / Pedagogy" },
      ],
    },
    {
      id: "paperSection", label: "Section to Generate", type: "select", required: true,
      options: [
        { value: "abstract",          label: "Abstract" },
        { value: "literature_review", label: "Literature Review" },
        { value: "methodology",       label: "Methodology" },
        { value: "discussion",        label: "Discussion" },
        { value: "conclusion",        label: "Conclusion" },
      ],
    },
    {
      id: "researchTitle", label: "Paper Title", type: "text",
      placeholder: "e.g. Attention Mechanisms in Large Language Models: A Comparative Study",
      required: true,
    },
    {
      id: "researchQuestion", label: "Research Question / Objective", type: "textarea",
      placeholder: "e.g. How do different attention mechanisms affect LLM performance on low-resource languages?",
      required: true,
    },
    {
      id: "hypothesis", label: "Hypothesis / Thesis Statement", type: "textarea",
      placeholder: "e.g. Multi-head cross-attention with language-specific tokenization improves accuracy by 15-20% on Hindi NLP tasks.",
      required: false,
    },
    {
      id: "methodology", label: "Methodology / Research Design", type: "select", required: true,
      options: [
        { value: "experimental",    label: "Experimental / Quantitative" },
        { value: "survey",          label: "Survey / Questionnaire" },
        { value: "case_study",      label: "Case Study" },
        { value: "systematic_review", label: "Systematic Literature Review" },
        { value: "mixed_methods",   label: "Mixed Methods" },
        { value: "computational",   label: "Computational / Simulation" },
        { value: "qualitative",     label: "Qualitative / Ethnographic" },
      ],
    },
    {
      id: "keyFindings", label: "Key Findings / Results", type: "textarea",
      placeholder: "e.g. Model achieved 94.2% accuracy on benchmark. 23% improvement over baseline. Statistical significance p<0.001.",
      required: false,
      helpText: "Leave blank for methodology/literature review sections",
    },
    {
      id: "sampleSize", label: "Sample Size / Dataset", type: "text",
      placeholder: "e.g. n=450 participants / 50,000 training samples / 3 case studies",
      required: false,
    },
    {
      id: "limitations", label: "Limitations", type: "text",
      placeholder: "e.g. Small sample size, single institution, English-language sources only",
      required: false,
    },
    {
      id: "citationStyle", label: "Citation Style", type: "select", required: true,
      options: [
        { value: "apa7",    label: "APA 7th Edition" },
        { value: "ieee",    label: "IEEE" },
        { value: "mla9",    label: "MLA 9th Edition" },
        { value: "chicago", label: "Chicago 17th" },
        { value: "harvard", label: "Harvard" },
        { value: "vancouver", label: "Vancouver (Medical)" },
      ],
    },
    {
      id: "targetJournal", label: "Target Journal / Conference", type: "text",
      placeholder: "e.g. IEEE Transactions on Neural Networks / NeurIPS 2026 / Elsevier",
      required: false,
    },
    {
      id: "wordLimit", label: "Word Limit", type: "select", required: true,
      options: [
        { value: "250",  label: "250 words (Abstract)" },
        { value: "500",  label: "500 words" },
        { value: "800",  label: "800 words" },
        { value: "1200", label: "1200 words" },
        { value: "2000", label: "2000 words (Full section)" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
//  DOMAIN 5: GRANT
// ─────────────────────────────────────────────────────────────
const grantDomain: DomainTemplate = {
  id:          "grant",
  name:        "Grant",
  tagline:     "Funding Proposal Generator",
  description: "Generate compelling grant proposals, project narratives, impact statements, and budget justifications that funding bodies and government agencies expect.",
  icon:        "💰",
  color:       "#BA7517",
  bgColor:     "#FAEEDA",
  exampleUseCase: "An NGO needs a project proposal for a government social welfare grant of ₹50 lakhs.",
  outputTypes: [
    { id: "project_proposal",     label: "Project Proposal",       description: "Full funding proposal narrative",      icon: "📋" },
    { id: "impact_statement",     label: "Impact Statement",       description: "Measurable outcomes and beneficiaries", icon: "🎯" },
    { id: "budget_justification", label: "Budget Justification",   description: "Line-item budget with rationale",       icon: "💹" },
    { id: "objectives",           label: "Goals & Objectives",     description: "SMART objectives and deliverables",     icon: "🏆" },
    { id: "executive_summary",    label: "Executive Summary",      description: "2-page grant overview",                 icon: "📄" },
  ],
  fields: [
    {
      id: "grantType", label: "Grant Type", type: "select", required: true,
      options: [
        { value: "government",    label: "Government / Public funding" },
        { value: "ngo",           label: "NGO / Non-profit grant" },
        { value: "research",      label: "Academic / Research grant" },
        { value: "startup",       label: "Startup / Innovation grant" },
        { value: "social",        label: "Social welfare / CSR" },
        { value: "international", label: "International / UN funding" },
      ],
    },
    {
      id: "fundingBody", label: "Funding Body / Agency", type: "text",
      placeholder: "e.g. DST India / Gates Foundation / World Bank / BIRAC",
      required: true,
    },
    {
      id: "projectTitle", label: "Project Title", type: "text",
      placeholder: "e.g. AI-powered Early Detection of Crop Disease in Rural Maharashtra",
      required: true,
    },
    {
      id: "sector", label: "Project Sector", type: "select", required: true,
      options: [
        { value: "education",    label: "Education" },
        { value: "health",       label: "Healthcare / Public Health" },
        { value: "agriculture",  label: "Agriculture / Rural Development" },
        { value: "technology",   label: "Technology / Innovation" },
        { value: "environment",  label: "Environment / Climate" },
        { value: "women",        label: "Women & Child Welfare" },
        { value: "skill_dev",    label: "Skill Development / Employment" },
        { value: "infrastructure", label: "Infrastructure" },
      ],
    },
    {
      id: "amountRequested", label: "Amount Requested", type: "text",
      placeholder: "e.g. ₹50,00,000 / $250,000 / €100,000",
      required: true,
    },
    {
      id: "projectDuration", label: "Project Duration", type: "select", required: true,
      options: [
        { value: "6_months",  label: "6 months" },
        { value: "1_year",    label: "1 year" },
        { value: "2_years",   label: "2 years" },
        { value: "3_years",   label: "3 years" },
        { value: "5_years",   label: "5 years" },
      ],
    },
    {
      id: "targetBeneficiaries", label: "Target Beneficiaries", type: "text",
      placeholder: "e.g. 5,000 smallholder farmers in Vidarbha region / 200 underprivileged girls",
      required: true,
    },
    {
      id: "problemStatement", label: "Problem Being Addressed", type: "textarea",
      placeholder: "e.g. 40% of crop yield loss in Maharashtra is due to late detection of fungal diseases. Farmers lack access to expert diagnosis.",
      required: true,
    },
    {
      id: "expectedOutcomes", label: "Expected Outcomes / Deliverables", type: "textarea",
      placeholder: "e.g. Mobile app deployed to 5,000 farmers. 30% reduction in crop loss. Training of 50 local agricultural extension workers.",
      required: true,
    },
    {
      id: "organisationType", label: "Applicant Organisation Type", type: "select", required: true,
      options: [
        { value: "ngo",         label: "NGO / Trust / Society" },
        { value: "university",  label: "University / Research Institute" },
        { value: "startup",     label: "Registered Startup" },
        { value: "government",  label: "Government Body / PSU" },
        { value: "company",     label: "Private Company (CSR)" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
//  DOMAIN 6: HR
// ─────────────────────────────────────────────────────────────
const hrDomain: DomainTemplate = {
  id:          "hr",
  name:        "HR",
  tagline:     "People & Talent Document Generator",
  description: "Generate professional HR documents — job descriptions, performance reviews, offer letters, and policy documents — with the right tone for your company culture.",
  icon:        "👥",
  color:       "#D4537E",
  bgColor:     "#FBEAF0",
  exampleUseCase: "A startup needs a detailed job description for a Senior Full-Stack Engineer to post on LinkedIn.",
  outputTypes: [
    { id: "job_description",   label: "Job Description",        description: "Detailed JD for job boards",          icon: "📢" },
    { id: "performance_review",label: "Performance Review",     description: "Structured annual/quarterly review",   icon: "⭐" },
    { id: "offer_letter",      label: "Offer Letter",           description: "Professional employment offer",        icon: "✉️" },
    { id: "policy_document",   label: "HR Policy Document",     description: "Company policy with guidelines",       icon: "📖" },
    { id: "interview_questions", label: "Interview Question Set", description: "Role-specific interview questions",  icon: "❓" },
  ],
  fields: [
    {
      id: "documentType", label: "Document Type", type: "select", required: true,
      options: [
        { value: "job_description",    label: "Job Description" },
        { value: "performance_review", label: "Performance Review" },
        { value: "offer_letter",       label: "Offer Letter" },
        { value: "policy_document",    label: "HR Policy Document" },
        { value: "interview_questions", label: "Interview Question Set" },
      ],
    },
    {
      id: "roleTitle", label: "Role / Job Title", type: "text",
      placeholder: "e.g. Senior Full-Stack Engineer / Product Manager / Data Scientist",
      required: true,
    },
    {
      id: "department", label: "Department", type: "select", required: true,
      options: [
        { value: "engineering",  label: "Engineering / Technology" },
        { value: "product",      label: "Product Management" },
        { value: "design",       label: "Design / UX" },
        { value: "marketing",    label: "Marketing / Growth" },
        { value: "sales",        label: "Sales / Business Development" },
        { value: "finance",      label: "Finance / Accounts" },
        { value: "hr",           label: "Human Resources" },
        { value: "operations",   label: "Operations" },
        { value: "data",         label: "Data / Analytics" },
      ],
    },
    {
      id: "seniorityLevel", label: "Seniority Level", type: "select", required: true,
      options: [
        { value: "intern",      label: "Intern / Trainee" },
        { value: "junior",      label: "Junior (0-2 years)" },
        { value: "mid",         label: "Mid-level (2-5 years)" },
        { value: "senior",      label: "Senior (5-8 years)" },
        { value: "lead",        label: "Lead / Principal (8+ years)" },
        { value: "manager",     label: "Manager" },
        { value: "director",    label: "Director / VP" },
      ],
    },
    {
      id: "companySize", label: "Company Type & Size", type: "select", required: true,
      options: [
        { value: "startup_small",  label: "Early-stage startup (1-20 people)" },
        { value: "startup_mid",    label: "Growth-stage startup (20-200 people)" },
        { value: "mid_market",     label: "Mid-market company (200-1000)" },
        { value: "enterprise",     label: "Enterprise / MNC (1000+)" },
      ],
    },
    {
      id: "workLocation", label: "Work Location", type: "select", required: true,
      options: [
        { value: "onsite",  label: "On-site / Office" },
        { value: "remote",  label: "Fully Remote" },
        { value: "hybrid",  label: "Hybrid" },
      ],
    },
    {
      id: "salaryRange", label: "Salary / CTC Range", type: "text",
      placeholder: "e.g. ₹15-22 LPA / $120k-$160k / Competitive + equity",
      required: false,
    },
    {
      id: "requiredSkills", label: "Required Skills & Technologies", type: "textarea",
      placeholder: "e.g. React, Node.js, TypeScript, MongoDB, AWS, 3+ years production experience, system design knowledge",
      required: true,
    },
    {
      id: "cultureTone", label: "Company Culture Tone", type: "select", required: true,
      options: [
        { value: "corporate",    label: "Corporate / Formal" },
        { value: "startup",      label: "Startup / Energetic" },
        { value: "collaborative",label: "Collaborative / Team-first" },
        { value: "innovative",   label: "Innovation-driven" },
        { value: "inclusive",    label: "Diverse & Inclusive focus" },
      ],
    },
    {
      id: "industry", label: "Industry", type: "select", required: true,
      options: [
        { value: "tech",        label: "Technology / Software" },
        { value: "fintech",     label: "Fintech" },
        { value: "healthcare",  label: "Healthcare" },
        { value: "ecommerce",   label: "E-commerce / Retail" },
        { value: "edtech",      label: "EdTech" },
        { value: "manufacturing", label: "Manufacturing" },
        { value: "consulting",  label: "Consulting / Services" },
      ],
    },
    {
      id: "additionalContext", label: "Additional Context / Special Requirements", type: "textarea",
      placeholder: "e.g. Must have experience with high-traffic systems (10M+ users). Equity offered. Reports to CTO.",
      required: false,
    },
  ],
};

export const DOMAIN_TEMPLATES: DomainTemplate[] = [
  legalDomain,
  medicalDomain,
  startupDomain,
  researchDomain,
  grantDomain,
  hrDomain,
];

export const getDomainById = (id: string): DomainTemplate | undefined =>
  DOMAIN_TEMPLATES.find((d) => d.id === id);
