// ─────────────────────────────────────────────────────────────
//  citationService.ts — Academic Citation Fetcher
//
//  WHY: Real verifiable citations from free academic APIs.
//  No API key needed. Works immediately.
//
//  SOURCES:
//  1. Semantic Scholar — 200M+ papers, free, no key
//  2. CrossRef        — 130M+ works, free, no key
//
//  FORMATS: APA 7th, MLA 9th, IEEE
// ─────────────────────────────────────────────────────────────

export interface Citation {
  id:            string;
  title:         string;
  authors:       string[];
  year:          number | null;
  journal?:      string;
  doi?:          string;
  url?:          string;
  citationCount?: number;   // How many times this paper was cited
  abstract?:     string;    // Short abstract for context
  source:        "semantic_scholar" | "crossref";
}

export interface FormattedCitation {
  inText:      string;   // e.g. (Smith et al., 2023) or [1]
  bibliography: string;  // Full formatted reference
  citation:    Citation;
}

export type CitationStyle = "apa" | "mla" | "ieee";

// ── Fetch from Semantic Scholar ───────────────────────────────
// Week 2: Added fieldsOfStudy filter + citation count sorting
// for better relevance
async function fetchSemanticScholar(query: string, limit = 4): Promise<Citation[]> {
  try {
    const encoded = encodeURIComponent(query);
    // Request more than needed so we can filter and rank
    const fetchLimit = limit * 3;
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encoded}&limit=${fetchLimit}&fields=title,authors,year,venue,externalIds,openAccessPdf,citationCount,abstract`;

    const response = await fetch(url, {
      headers: { "User-Agent": "TextForgeAI/1.0 (academic-citations)" },
    });

    if (!response.ok) return [];
    const data = await response.json() as any;
    if (!data.data) return [];

    return data.data
      .filter((p: any) =>
        p.title &&
        p.authors?.length > 0
      )
      // Sort by citation count descending — most cited = most relevant
      .sort((a: any, b: any) => (b.citationCount || 0) - (a.citationCount || 0))
      .slice(0, limit)
      .map((p: any) => ({
        id:            p.paperId || Math.random().toString(36).slice(2),
        title:         p.title,
        authors:       p.authors?.map((a: any) => a.name) || [],
        year:          p.year || null,
        journal:       p.venue || undefined,
        doi:           p.externalIds?.DOI || undefined,
        url:           p.openAccessPdf?.url || `https://www.semanticscholar.org/paper/${p.paperId}`,
        citationCount: p.citationCount || 0,
        abstract:      p.abstract?.slice(0, 200) || undefined,
        source:        "semantic_scholar" as const,
      }));
  } catch { return []; }
}

// ── Fetch from CrossRef ───────────────────────────────────────
async function fetchCrossRef(query: string, limit = 3): Promise<Citation[]> {
  try {
    const encoded  = encodeURIComponent(query);
    const url      = `https://api.crossref.org/works?query=${encoded}&rows=${limit}&select=title,author,published,container-title,DOI&mailto=textforge@example.com`;
    const response = await fetch(url, {
      headers: { "User-Agent": "TextForgeAI/1.0 (academic-citations)" },
    });

    if (!response.ok) return [];
    const data = await response.json() as any;
    if (!data.message?.items) return [];

    return data.message.items
      .filter((item: any) =>
        item.title?.[0] &&
        item.author?.length > 0
      )
      .map((item: any) => ({
        id:      item.DOI || Math.random().toString(36).slice(2),
        title:   item.title?.[0] || "Untitled",
        authors: item.author?.map((a: any) =>
          a.family ? `${a.family}${a.given ? ", " + a.given : ""}` : a.name || "Unknown"
        ) || [],
        year:    item.published?.["date-parts"]?.[0]?.[0] || null,
        journal: item["container-title"]?.[0] || undefined,
        doi:     item.DOI || undefined,
        url:     item.DOI ? `https://doi.org/${item.DOI}` : undefined,
        source:  "crossref" as const,
      }));
  } catch { return []; }
}

// ── Main fetch function ───────────────────────────────────────
export async function fetchCitations(topic: string, limit = 6): Promise<Citation[]> {
  // Run both APIs in parallel
  const [semantic, crossref] = await Promise.all([
    fetchSemanticScholar(topic, Math.ceil(limit * 0.6)),
    fetchCrossRef(topic, Math.floor(limit * 0.4)),
  ]);

  // Merge, deduplicate by title similarity, take best results
  const all = [...semantic, ...crossref];
  const seen = new Set<string>();
  const unique: Citation[] = [];

  for (const c of all) {
    const key = c.title.toLowerCase().slice(0, 40);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(c);
    }
  }

  // Sort by recency
  return unique
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────
//  CITATION FORMATTERS
// ─────────────────────────────────────────────────────────────

function formatAuthorAPA(authors: string[]): string {
  if (authors.length === 0) return "Unknown";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} et al.`;
}

function formatAuthorMLA(authors: string[]): string {
  if (authors.length === 0) return "Unknown";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]}, and ${authors[1]}`;
  return `${authors[0]}, et al.`;
}

function inTextAPA(citation: Citation): string {
  const author = formatAuthorAPA(citation.authors);
  const year   = citation.year || "n.d.";
  return `(${author}, ${year})`;
}

export function formatCitations(
  citations: Citation[],
  style: CitationStyle
): FormattedCitation[] {
  return citations.map((c, index) => {
    let inText      = "";
    let bibliography = "";

    if (style === "apa") {
      const author = formatAuthorAPA(c.authors);
      const year   = c.year || "n.d.";
      inText = `(${author}, ${year})`;
      bibliography = `${c.authors.join(", ")} (${year}). ${c.title}. ${c.journal ? `*${c.journal}*. ` : ""}${c.doi ? `https://doi.org/${c.doi}` : c.url || ""}`;

    } else if (style === "mla") {
      const author = formatAuthorMLA(c.authors);
      const year   = c.year || "n.d.";
      inText = `(${c.authors[0]?.split(",")[0] || "Unknown"} ${year})`;
      bibliography = `${author}. "${c.title}." ${c.journal ? `*${c.journal}*, ` : ""}${year}${c.doi ? `, https://doi.org/${c.doi}` : ""}.`;

    } else if (style === "ieee") {
      inText = `[${index + 1}]`;
      const author = c.authors.slice(0, 3).join(", ");
      const year   = c.year || "n.d.";
      bibliography = `[${index + 1}] ${author}${c.authors.length > 3 ? " et al." : ""}, "${c.title}," ${c.journal ? `*${c.journal}*, ` : ""}${year}${c.doi ? `. doi: ${c.doi}` : ""}.`;
    }

    return { inText, bibliography, citation: c };
  });
}

// ─────────────────────────────────────────────────────────────
//  BUILD CITED PROMPT
//  Tells Gemini to write with these specific citations
// ─────────────────────────────────────────────────────────────
export function buildCitedPrompt(
  topic: string,
  tone: string,
  length: string,
  language: string,
  formatted: FormattedCitation[],
  style: CitationStyle
): string {
  const styleGuide = {
    apa:  "APA 7th edition — use (Author, Year) format",
    mla:  "MLA 9th edition — use (Author Year) format",
    ieee: "IEEE — use numbered citations [1], [2] etc.",
  };

  const citationList = formatted.map((f, i) =>
    `${i + 1}. ${f.inText} → ${f.citation.authors[0]?.split(",")[0] || "Unknown"} (${f.citation.year || "n.d."}) "${f.citation.title.slice(0, 60)}"`
  ).join("\n");

  const bibliography = formatted.map(f => f.bibliography).join("\n");

  return `Write a ${length} academic article about "${topic}" in ${tone} tone.

MANDATORY: Use these ${formatted.length} real citations naturally in the text:
${citationList}

Rules: Place ${styleGuide[style]} citations after relevant claims. End with "References:" section.

Bibliography to use exactly:
${bibliography}

Article:`;
}
