import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { Response } from "express";
import type { Tone, Length, Language } from "../models/Generation";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const LENGTH_MAP: Record<Length, { words: number; description: string }> = {
  short:  { words: 150, description: "concise (around 150 words)" },
  medium: { words: 350, description: "detailed (around 350 words)" },
  long:   { words: 700, description: "comprehensive (around 700 words)" },
};

const TONE_MAP: Record<Tone, string> = {
  formal:   "Use professional, authoritative language. Avoid contractions and colloquialisms.",
  casual:   "Use conversational, friendly language. Contractions and informal phrasing are welcome.",
  creative: "Use vivid, imaginative language. Employ metaphors, varied sentence structure, and expressive vocabulary.",
  academic: "Use scholarly language with precise terminology. Maintain an objective, evidence-based tone.",
};

const LANGUAGE_MAP: Record<Language, string> = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  es: "Spanish",
  fr: "French",
  ja: "Japanese",
  ar: "Arabic",
  de: "German",
  zh: "Mandarin Chinese (Simplified)",
};

export interface GenerateOptions {
  topic:     string;
  tone:      Tone;
  length:    Length;
  language?: Language;
  keywords?: string[];
}

export interface RefineOptions {
  originalText: string;
  instruction:  string;
  tone?:        Tone;
  length?:      Length;
}

export function buildPrompt(options: GenerateOptions): string {
  const { topic, tone, length } = options;
  const language  = options.language ?? "en";
  const keywords  = (options.keywords ?? []).map((k) => k.trim()).filter(Boolean);
  const lengthConfig = LENGTH_MAP[length];
  const toneGuide    = TONE_MAP[tone];
  const langName     = LANGUAGE_MAP[language];

  const keywordBlock = keywords.length
    ? `\n- SEO Keywords: Weave these terms naturally into the text — ${keywords.join(", ")}`
    : "";

  return `You are TextForge AI, an expert writer capable of producing high-quality, coherent text on any topic.

Your task is to write a well-structured piece of text about the following topic:

TOPIC: ${topic}

WRITING GUIDELINES:
- Tone: ${toneGuide}
- Length: Be ${lengthConfig.description}
- Language: Write the entire response in ${langName}${keywordBlock}
- Structure: Begin with a strong opening sentence, develop the topic with supporting details, and close with a meaningful conclusion
- Quality: Ensure the text flows naturally and reads as if written by a knowledgeable human expert
- Do NOT include a title, heading, or any preamble — output only the generated text itself

Write the text now:`;
}

export function buildRefinementPrompt(options: RefineOptions): string {
  const { originalText, instruction } = options;
  return `You are TextForge AI. The user previously generated the text below and wants you to refine it.

REFINEMENT INSTRUCTION: ${instruction}

ORIGINAL TEXT:
"""
${originalText}
"""

Rewrite the text following the refinement instruction above. Keep the core meaning and topic intact unless the instruction explicitly says otherwise. Output ONLY the refined text — no preamble, no explanation, no quotes.

Refined text:`;
}

// ── Streaming Generator ───────────────────────────────────────
// Key fix: SSE headers are set BEFORE calling Gemini.
// If Gemini throws, we write an error SSE event and return "".
// We NEVER throw after headers are sent — that caused the
// "Cannot set headers after they are sent" crash.
export async function generateTextStream(
  prompt: string,
  res: Response
): Promise<string> {
  // Set SSE headers FIRST — before any async call
  res.setHeader("Content-Type",      "text/event-stream");
  res.setHeader("Cache-Control",     "no-cache");
  res.setHeader("Connection",        "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  let fullText = "";

  try {
    const model      = genAI.getGenerativeModel({ model: config.gemini.model });
    const streamResult = await model.generateContentStream(prompt);

    for await (const chunk of streamResult.stream) {
      const text = chunk.text();
      if (text) {
        fullText += text;
        res.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
      }
    }

    return fullText;

  } catch (error: any) {
    // ── Clean error message for the user ──────────────────────
    let userMessage = "Generation failed. Please try again.";

    if (error?.message?.includes("API_KEY_INVALID") || error?.message?.includes("API key not valid")) {
      userMessage = "Invalid Gemini API key. Please update GEMINI_API_KEY in your .env file.";
    } else if (error?.message?.includes("429") || error?.message?.includes("quota")) {
      userMessage = "Gemini quota exceeded. Please wait a minute and try again.";
    } else if (error?.message?.includes("SAFETY")) {
      userMessage = "The content was blocked by safety filters. Try a different topic.";
    }

    // Write the error as an SSE event — the frontend handles it gracefully
    // Do NOT throw — headers are already sent, throwing causes the double-response crash
    res.write(`data: ${JSON.stringify({ error: userMessage, done: true })}\n\n`);
    res.end();

    // Log the full error server-side for debugging
    console.error("[Gemini Error]", error?.message || error);

    return "";
  }
}

export async function generateText(prompt: string): Promise<string> {
  const model    = genAI.getGenerativeModel({ model: config.gemini.model });
  const result   = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// ─────────────────────────────────────────────────────────────
//  DEEP DOMAIN PROMPT BUILDERS
//  These are the core of the Deep Domain Templates feature.
//  Each function takes structured domain-specific parameters
//  and builds a deeply engineered expert-level prompt.
// ─────────────────────────────────────────────────────────────

export interface DomainGenerateOptions {
  domain:     string;
  outputType: string;
  fields:     Record<string, string>;
}

export function buildDomainPrompt(options: DomainGenerateOptions): string {
  switch (options.domain) {
    case "legal":    return buildLegalPrompt(options);
    case "medical":  return buildMedicalPrompt(options);
    case "startup":  return buildStartupPrompt(options);
    case "research": return buildResearchPrompt(options);
    case "grant":    return buildGrantPrompt(options);
    case "hr":       return buildHRPrompt(options);
    default: throw new Error(`Unknown domain: ${options.domain}`);
  }
}

function buildLegalPrompt({ outputType, fields }: DomainGenerateOptions): string {
  const jurisdictionGuide: Record<string, string> = {
    india:         "Indian Contract Act 1872, governed by Indian law, enforceable in Indian courts",
    us_california: "California law, governed by the State of California, USA",
    us_delaware:   "Delaware law, one of the most business-friendly jurisdictions in the USA",
    uk:            "English law, governed by the laws of England and Wales",
    singapore:     "Singapore law, SIAC arbitration preferred",
    uae:           "UAE Federal Law, DIFC courts jurisdiction",
  };

  const jurisdiction = jurisdictionGuide[fields.jurisdiction] || fields.jurisdiction;

  return `You are a senior corporate lawyer with 20+ years of experience drafting ${fields.contractType} agreements across multiple jurisdictions.

Draft a professional, legally-structured ${fields.contractType?.replace(/_/g, " ")} between the following parties:

PARTY 1: ${fields.party1Name} (${fields.party1Role?.replace(/_/g, " ")})
PARTY 2: ${fields.party2Name} (${fields.party2Role?.replace(/_/g, " ")})

LEGAL PARAMETERS:
- Jurisdiction & Governing Law: ${jurisdiction}
- Contract Duration: ${fields.duration?.replace(/_/g, " ")}
- Contract Value / Compensation: ${fields.contractValue || "As mutually agreed"}
- Confidentiality: ${fields.confidentialityLevel?.replace(/_/g, " ")}
- Liability Limitation: ${fields.liabilityLimit?.replace(/_/g, " ")}
- Dispute Resolution: ${fields.disputeResolution}
- Intellectual Property: ${fields.ipOwnership?.replace(/_/g, " ")}
- Non-Compete: ${fields.nonCompete?.replace(/_/g, " ") || "None"}

${fields.specialClauses ? `SPECIAL CLAUSES / ADDITIONAL TERMS:\n${fields.specialClauses}` : ""}

DOCUMENT REQUIREMENTS:
- Use proper legal numbering (1., 1.1, 1.2 etc.)
- Include: Recitals/Background, Definitions, Obligations of each party, Payment terms, Confidentiality, IP ownership, Termination, Limitation of Liability, Dispute Resolution, General provisions (severability, entire agreement, amendments)
- Use precise legal language appropriate for ${jurisdiction}
- Include signature block with date lines for both parties
- Mark optional clauses clearly
- Do NOT include [PLACEHOLDER] text — use the actual values provided

Generate the complete contract now:`;
}

function buildMedicalPrompt({ outputType, fields }: DomainGenerateOptions): string {
  const formatMap: Record<string, string> = {
    case_study:        "SOAP format (Subjective, Objective, Assessment, Plan) expanded into full academic case study with Introduction, Case Presentation, Discussion, and Conclusion",
    patient_summary:   "SOAP Note format: Subjective, Objective, Assessment, Plan",
    research_abstract: "Structured abstract: Background, Objective, Methods, Results, Conclusion (250 words max)",
    discharge_notes:   "Discharge Summary format: Admission details, Hospital course, Discharge diagnosis, Medications on discharge, Follow-up instructions",
  };

  const docFormat = formatMap[outputType] || "Standard clinical document format";

  return `You are a senior clinician and medical educator with expertise in ${fields.medicalSpecialty?.replace(/_/g, " ")}.

Write a professional clinical document in the following format:
${docFormat}

PATIENT DETAILS:
- Patient: ${fields.patientAge}
- Chief Complaint: ${fields.chiefComplaint}
- Primary Diagnosis: ${fields.diagnosis}
- Comorbidities / PMH: ${fields.comorbidities || "None reported"}
- Symptoms & Duration: ${fields.symptoms}
- Investigations / Labs: ${fields.investigations || "Not provided"}
- Current Medications: ${fields.medications || "None"}

CLINICAL MANAGEMENT:
- Treatment Plan: ${fields.treatment}
- Prognosis: ${fields.prognosis?.replace(/_/g, " ")}
- Follow-up: ${fields.followUp || "As per standard protocol"}

DOCUMENT STANDARDS:
- Use correct medical terminology and abbreviations (spell out on first use)
- Structure must be appropriate for ${fields.medicalSpecialty?.replace(/_/g, " ")} specialty
- Maintain patient confidentiality tone (use "the patient" not names)
- Include relevant clinical reasoning in the assessment section
- Flag any red flags or urgent concerns clearly
- Suitable for inclusion in academic portfolio or hospital record

Generate the complete clinical document now:`;
}

function buildStartupPrompt({ outputType, fields }: DomainGenerateOptions): string {
  const docGuide: Record<string, string> = {
    executive_summary: "a crisp 2-page executive summary (400-600 words) covering: Company overview, Problem, Solution, Market opportunity, Business model, Traction, Team, Ask",
    problem_statement: "a compelling problem statement (300-400 words) that makes investors feel the urgency of the problem using data, stories, and market evidence",
    value_proposition: "a sharp value proposition (200-300 words) explaining the unique benefit, target customer, and why this solution beats alternatives",
    pitch_narrative:   "a full 3-minute pitch narrative (500-600 words) structured as: Hook, Problem, Solution, Market, Business model, Traction, Team, Ask, Vision",
    investor_email:    "a cold investor outreach email (150-200 words) with subject line, hook, one-liner, traction highlight, ask, and CTA",
  };

  const docInstruction = docGuide[outputType] || "a professional startup document";

  return `You are a seasoned startup advisor who has helped companies raise over $500M in venture funding. You write with the precision of Paul Graham essays and the urgency of a YC application.

Write ${docInstruction} for the following startup:

COMPANY: ${fields.companyName}
INDUSTRY: ${fields.industry?.replace(/_/g, " ")}
STAGE: ${fields.stage?.replace(/_/g, " ")}

THE PROBLEM:
${fields.problem}

THE SOLUTION:
${fields.solution}

MARKET OPPORTUNITY:
${fields.targetMarket}

BUSINESS MODEL: ${fields.businessModel?.replace(/_/g, " ")}
TRACTION: ${fields.traction || "Pre-revenue — focus on market opportunity and team"}
FUNDING ASK: ${fields.fundingAsk || "Not specified"}
USE OF FUNDS: ${fields.useOfFunds || "Not specified"}
UNFAIR ADVANTAGE / MOAT: ${fields.unfairAdvantage}
TEAM: ${fields.teamBackground || "Founding team details not provided"}

WRITING STANDARDS:
- Write like the best YC applications — specific, data-driven, no buzzwords
- Every claim should feel provable — use numbers wherever possible
- Avoid: "revolutionary", "game-changing", "disruptive", "cutting-edge"
- Use instead: specific metrics, customer quotes, market data
- Investor audience: sophisticated angel investors and early-stage VCs
- Tone: confident but not arrogant, urgent but grounded

Generate the complete document now:`;
}

function buildResearchPrompt({ outputType, fields }: DomainGenerateOptions): string {
  const sectionGuide: Record<string, string> = {
    abstract:          `a structured academic abstract (max ${fields.wordLimit || 250} words) with clearly labelled sections: Background, Objective, Methods, Results, Conclusion`,
    literature_review: `a critical literature review (${fields.wordLimit || 800} words) that synthesises existing research, identifies gaps, and justifies the current study`,
    methodology:       `a detailed methodology section (${fields.wordLimit || 800} words) covering research design, data collection, instruments, analysis approach, and ethical considerations`,
    discussion:        `a discussion and analysis section (${fields.wordLimit || 1000} words) interpreting findings in context of existing literature, addressing limitations, and drawing implications`,
    conclusion:        `a conclusion section (${fields.wordLimit || 500} words) summarising findings, stating contributions, acknowledging limitations, and suggesting future research directions`,
  };

  const citationGuides: Record<string, string> = {
    apa7:     "APA 7th edition (Author, Year) in-text citations",
    ieee:     "IEEE numbered citations [1], [2] in square brackets",
    mla9:     "MLA 9th edition (Author page) citations",
    chicago:  "Chicago author-date style",
    harvard:  "Harvard (Author Year) referencing",
    vancouver: "Vancouver numbered superscript citations",
  };

  return `You are a senior academic researcher and prolific author in the field of ${fields.researchField?.replace(/_/g, " ")} with 50+ peer-reviewed publications.

Write ${sectionGuide[outputType] || "an academic section"} for the following research paper:

PAPER TITLE: ${fields.researchTitle}
RESEARCH QUESTION: ${fields.researchQuestion}
${fields.hypothesis ? `HYPOTHESIS: ${fields.hypothesis}` : ""}
METHODOLOGY: ${fields.methodology?.replace(/_/g, " ")}
${fields.sampleSize ? `SAMPLE / DATASET: ${fields.sampleSize}` : ""}
${fields.keyFindings ? `KEY FINDINGS: ${fields.keyFindings}` : ""}
${fields.limitations ? `LIMITATIONS: ${fields.limitations}` : ""}
TARGET: ${fields.targetJournal || "High-impact peer-reviewed journal"}
CITATION STYLE: ${citationGuides[fields.citationStyle] || fields.citationStyle}

ACADEMIC WRITING STANDARDS:
- Write at the level expected by ${fields.targetJournal || "a Q1 journal"}
- Use precise academic language — avoid vague terms like "many researchers"
- Every claim must be attributable — use hedging language where evidence is limited ("suggests", "indicates", "preliminary evidence")
- Use passive voice where appropriate for objectivity
- Include transition sentences between paragraphs
- For ${fields.citationStyle || "APA"} style: format in-text citations correctly with [Author, Year] placeholders
- Word limit: approximately ${fields.wordLimit || 500} words

Generate the complete section now:`;
}

function buildGrantPrompt({ outputType, fields }: DomainGenerateOptions): string {
  const docGuide: Record<string, string> = {
    project_proposal:     "a full project proposal narrative (600-800 words) covering: Problem statement, Proposed solution, Implementation approach, Expected impact, Organisation capacity, Sustainability plan",
    impact_statement:     "a compelling impact statement (400-500 words) with specific, measurable outcomes, beneficiary numbers, and long-term systemic change",
    budget_justification: "a detailed budget justification document explaining each cost category with rationale, value for money, and alignment to project objectives",
    objectives:           "a SMART objectives and deliverables section with clear timelines, measurable targets, and success indicators",
    executive_summary:    "a concise executive summary (300-400 words) covering: problem, solution, budget ask, expected outcomes, and organisation credentials",
  };

  return `You are a grant writing specialist who has successfully secured over ₹50 crores in funding for NGOs, research institutions, and social enterprises.

Write ${docGuide[outputType] || "a grant document"} for the following funding application:

ORGANISATION TYPE: ${fields.organisationType?.replace(/_/g, " ")}
FUNDING BODY: ${fields.fundingBody}
GRANT TYPE: ${fields.grantType?.replace(/_/g, " ")}
PROJECT TITLE: ${fields.projectTitle}
SECTOR: ${fields.sector?.replace(/_/g, " ")}
AMOUNT REQUESTED: ${fields.amountRequested}
PROJECT DURATION: ${fields.projectDuration?.replace(/_/g, " ")}
TARGET BENEFICIARIES: ${fields.targetBeneficiaries}

PROBLEM BEING ADDRESSED:
${fields.problemStatement}

EXPECTED OUTCOMES & DELIVERABLES:
${fields.expectedOutcomes}

GRANT WRITING STANDARDS:
- Open with a compelling, data-backed problem statement
- Use specific numbers — beneficiary counts, percentages, monetary values
- Connect every activity to a measurable outcome
- Use language the funder uses in their own mission statement
- Demonstrate organisational capacity without being boastful
- Avoid jargon — write for a non-specialist review committee
- Show sustainability beyond the grant period
- Use active, results-oriented language ("will deliver", "will train", "will measure")

Generate the complete document now:`;
}

function buildHRPrompt({ outputType, fields }: DomainGenerateOptions): string {
  const cultureVoice: Record<string, string> = {
    corporate:    "professional and formal — clear hierarchy, structured environment, stability focus",
    startup:      "energetic and direct — fast-paced, ownership mindset, impact-driven language",
    collaborative:"warm and inclusive — team-first, cross-functional, psychological safety",
    innovative:   "forward-thinking — cutting-edge tech, experimentation valued, growth mindset",
    inclusive:    "belonging-focused — DEI-forward language, diverse perspectives valued",
  };

  const docGuide: Record<string, string> = {
    job_description:    "a comprehensive job description with: Role overview, Key responsibilities (8-10 bullet points), Required qualifications, Nice-to-have skills, What we offer, About the company section",
    performance_review: "a structured performance review template with: Overall rating, Key achievements, Areas of strength, Development areas, Goals for next period, Manager comments section",
    offer_letter:       "a professional offer letter with: Position details, Start date placeholder, Compensation breakdown, Benefits summary, Conditions of employment, Acceptance instructions",
    policy_document:    "an HR policy document with: Policy statement, Scope, Definitions, Procedures, Responsibilities, Non-compliance consequences, Review date",
    interview_questions:"a structured interview question set with: 5 technical questions, 4 behavioural questions (STAR format), 3 cultural fit questions, 2 situational questions, evaluation criteria",
  };

  return `You are a Head of People & Culture with 15 years of experience scaling teams at high-growth companies.

Write ${docGuide[outputType] || "an HR document"} for the following role:

ROLE: ${fields.roleTitle}
DEPARTMENT: ${fields.department?.replace(/_/g, " ")}
SENIORITY: ${fields.seniorityLevel?.replace(/_/g, " ")}
COMPANY TYPE: ${fields.companySize?.replace(/_/g, " ")}
INDUSTRY: ${fields.industry?.replace(/_/g, " ")}
WORK LOCATION: ${fields.workLocation?.replace(/_/g, " ")}
${fields.salaryRange ? `COMPENSATION: ${fields.salaryRange}` : ""}

REQUIRED SKILLS & EXPERIENCE:
${fields.requiredSkills}

COMPANY CULTURE TONE: ${cultureVoice[fields.cultureTone] || fields.cultureTone}

${fields.additionalContext ? `ADDITIONAL CONTEXT:
${fields.additionalContext}` : ""}

HR WRITING STANDARDS:
- Use ${cultureVoice[fields.cultureTone] || "professional"} voice throughout
- Job descriptions: lead with impact, not just tasks ("You will build X" not "Responsible for X")
- Avoid gendered language — use "they/them" or restructure sentences
- Be specific about seniority expectations — avoid "x+ years" without context
- Include BOTH technical hard skills AND soft skills/behaviours
- Make the company sound like a place people want to work — sell the role
- For interview questions: include what a GOOD answer looks like as guidance

Generate the complete document now:`;
}

// ─────────────────────────────────────────────────────────────
//  HUMANISE PROMPT BUILDER
//  Takes AI-generated text and rewrites it to sound more human.
//  Targets the exact patterns our detector measures.
// ─────────────────────────────────────────────────────────────

export interface HumaniseOptions {
  text:     string;
  tone:     string;
  topic:    string;
}

export function buildHumanisePrompt({ text, tone, topic }: HumaniseOptions): string {
  return `You are an expert editor who specialises in making AI-generated text sound authentically human-written.

Rewrite the following text about "${topic}" to sound more natural and human. Apply these specific techniques:

HUMANISATION TECHNIQUES:
1. VARY sentence lengths dramatically — mix very short sentences with longer ones. "This matters. A lot." followed by a complex sentence.
2. REMOVE these AI phrases completely: "furthermore", "moreover", "in conclusion", "it is worth noting", "it is important to note", "delve into", "tapestry", "nuanced", "multifaceted", "a testament to", "in today's world"
3. ADD natural human imperfections — occasional rhetorical questions, direct address ("think about it"), conversational asides
4. VARY sentence openings — don't start multiple sentences with "The" or "This"
5. USE contractions where appropriate for ${tone} tone — "it's", "that's", "isn't"
6. REPLACE generic adjectives with specific, unexpected ones
7. ADD one concrete example or analogy that a human would naturally reach for
8. REDUCE comma usage — break long comma-separated lists into separate sentences

CRITICAL RULES:
- Preserve ALL the factual information and meaning
- Keep the same approximate length (within 10%)
- Maintain ${tone} tone throughout
- Do NOT add new facts that weren't in the original
- Output ONLY the rewritten text — no preamble, no explanation

ORIGINAL TEXT TO HUMANISE:
${text}

REWRITTEN VERSION:`;
}
