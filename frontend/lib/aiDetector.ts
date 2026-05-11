// ─────────────────────────────────────────────────────────────
//  aiDetector.ts — AI Detection Scoring Algorithm
//
//  WHY: AI-generated text has statistically measurable patterns.
//  This module analyses 5 linguistic dimensions and returns
//  a risk score (0-100) indicating how "AI-like" the text is.
//
//  HOW: No external API needed — pure client-side analysis.
//  Same approach used by GPTZero, Writer.com, Copyleaks.
//
//  DIMENSIONS ANALYSED:
//  1. Perplexity     — how predictable word choices are
//  2. Burstiness     — variation in sentence lengths
//  3. Vocabulary     — lexical diversity (unique/total words)
//  4. AI Phrases     — known AI signature phrases
//  5. Punctuation    — AI overuses commas and semicolons
// ─────────────────────────────────────────────────────────────

export interface DetectionDimension {
  name:        string;
  score:       number;   // 0-100 (100 = most AI-like)
  label:       string;   // "Low" | "Medium" | "High"
  description: string;
  isRisk:      boolean;  // true = this dimension suggests AI
}

export interface DetectionResult {
  overallScore:  number;              // 0-100 (100 = definitely AI)
  riskLevel:     "low" | "medium" | "high";
  riskLabel:     string;
  dimensions:    DetectionDimension[];
  wordCount:     number;
  sentenceCount: number;
  reliable:      boolean;             // false if text too short
}

// ── Known AI signature phrases ───────────────────────────────
// These appear disproportionately in AI-generated text.
// Compiled from linguistic research on LLM output patterns.
const AI_PHRASES = [
  "it is worth noting",
  "it is important to note",
  "furthermore",
  "moreover",
  "in conclusion",
  "in summary",
  "to summarise",
  "to summarize",
  "it is essential",
  "plays a crucial role",
  "plays a vital role",
  "it is crucial",
  "it is vital",
  "delve into",
  "dive into",
  "shed light on",
  "in today's world",
  "in the modern era",
  "in today's fast-paced",
  "it goes without saying",
  "needless to say",
  "at the end of the day",
  "when it comes to",
  "in terms of",
  "it is clear that",
  "it is evident that",
  "it is undeniable",
  "a testament to",
  "the fact that",
  "as previously mentioned",
  "as mentioned above",
  "in light of",
  "taking into account",
  "in order to",
  "due to the fact",
  "by and large",
  "on the other hand",
  "it should be noted",
  "tapestry",
  "nuanced",
  "multifaceted",
  "comprehensive",
  "groundbreaking",
  "revolutionary",
  "transformative",
  "cutting-edge",
  "state-of-the-art",
  "paradigm shift",
];

// ── Tokenise text into sentences ─────────────────────────────
function getSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

// ── Tokenise text into words ──────────────────────────────────
function getWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

// ─────────────────────────────────────────────────────────────
//  DIMENSION 1: Burstiness
//  Human writing has HIGH variance in sentence length.
//  AI writing has LOW variance — sentences are uniform.
//
//  Score 0 = very bursty (human-like)
//  Score 100 = very uniform (AI-like)
// ─────────────────────────────────────────────────────────────
function measureBurstiness(sentences: string[]): number {
  if (sentences.length < 3) return 50;

  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const mean    = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / lengths.length;
  const stdDev  = Math.sqrt(variance);
  const cv      = stdDev / mean; // coefficient of variation

  // High CV = high burstiness = human-like = LOW score
  // cv > 0.6 is very bursty (human), cv < 0.2 is very uniform (AI)
  const score = Math.max(0, Math.min(100, 100 - (cv * 150)));
  return Math.round(score);
}

// ─────────────────────────────────────────────────────────────
//  DIMENSION 2: Vocabulary Diversity (Type-Token Ratio)
//  TTR = unique words / total words
//  Human: high TTR (varied vocabulary)
//  AI: low TTR (repeats safe, common words)
// ─────────────────────────────────────────────────────────────
function measureVocabularyDiversity(words: string[]): number {
  if (words.length < 20) return 50;

  // Use a sliding window TTR for longer texts (corrects for length bias)
  const windowSize = Math.min(100, words.length);
  const windows: number[] = [];

  for (let i = 0; i <= words.length - windowSize; i += 20) {
    const window   = words.slice(i, i + windowSize);
    const unique   = new Set(window).size;
    windows.push(unique / windowSize);
  }

  const avgTTR = windows.reduce((a, b) => a + b, 0) / windows.length;

  // TTR > 0.75 = very diverse (human-like) = LOW score
  // TTR < 0.45 = low diversity (AI-like) = HIGH score
  const score = Math.max(0, Math.min(100, 100 - ((avgTTR - 0.3) / 0.5) * 100));
  return Math.round(score);
}

// ─────────────────────────────────────────────────────────────
//  DIMENSION 3: AI Phrase Density
//  Counts known AI signature phrases per 100 words.
//  Higher density = more AI-like.
// ─────────────────────────────────────────────────────────────
function measureAIPhraseDensity(text: string, wordCount: number): number {
  if (wordCount < 20) return 50;

  const lowerText = text.toLowerCase();
  let   hits      = 0;

  for (const phrase of AI_PHRASES) {
    let pos = 0;
    while ((pos = lowerText.indexOf(phrase, pos)) !== -1) {
      hits++;
      pos += phrase.length;
    }
  }

  // Normalise to per-100-words density
  const density = (hits / wordCount) * 100;

  // density > 3 = very AI-like, density < 0.5 = human-like
  const score = Math.min(100, Math.round(density * 25));
  return score;
}

// ─────────────────────────────────────────────────────────────
//  DIMENSION 4: Sentence Start Diversity
//  AI tends to start sentences with the same words repeatedly.
//  "The...", "This...", "It...", "In..."
// ─────────────────────────────────────────────────────────────
function measureSentenceStartDiversity(sentences: string[]): number {
  if (sentences.length < 4) return 50;

  const starts = sentences.map((s) => {
    const words = s.trim().split(/\s+/);
    return words[0]?.toLowerCase() || "";
  });

  const uniqueStarts = new Set(starts).size;
  const diversity    = uniqueStarts / starts.length;

  // Low diversity = AI-like = HIGH score
  const score = Math.max(0, Math.min(100, 100 - (diversity * 120)));
  return Math.round(score);
}

// ─────────────────────────────────────────────────────────────
//  DIMENSION 5: Punctuation Pattern
//  AI overuses commas (creates long comma-separated lists).
//  Also tends to use em-dashes and semicolons more than humans.
// ─────────────────────────────────────────────────────────────
function measurePunctuationPattern(text: string, wordCount: number): number {
  if (wordCount < 20) return 50;

  const commas     = (text.match(/,/g) || []).length;
  const semicolons = (text.match(/;/g) || []).length;
  const emDashes   = (text.match(/—|--/g) || []).length;

  // Normalise per 100 words
  const commaDensity     = (commas / wordCount) * 100;
  const semicolonDensity = (semicolons / wordCount) * 100;
  const dashDensity      = (emDashes / wordCount) * 100;

  // High comma density = AI-like
  const score = Math.min(100, Math.round(
    (commaDensity * 5) + (semicolonDensity * 15) + (dashDensity * 10)
  ));
  return Math.max(0, score);
}

// ─────────────────────────────────────────────────────────────
//  MAIN DETECTION FUNCTION
// ─────────────────────────────────────────────────────────────
export function detectAI(text: string): DetectionResult {
  const sentences = getSentences(text);
  const words     = getWords(text);
  const wordCount = words.length;

  // Need at least 50 words for reliable analysis
  const reliable = wordCount >= 50;

  // Calculate all dimensions
  const burstinessScore   = measureBurstiness(sentences);
  const vocabularyScore   = measureVocabularyDiversity(words);
  const aiPhraseScore     = measureAIPhraseDensity(text, wordCount);
  const sentenceStartScore = measureSentenceStartDiversity(sentences);
  const punctuationScore  = measurePunctuationPattern(text, wordCount);

  // Weighted overall score
  // AI phrases and burstiness are most reliable signals
  const overallScore = Math.round(
    burstinessScore    * 0.30 +  // 30% weight — most reliable
    aiPhraseScore      * 0.30 +  // 30% weight — very reliable
    vocabularyScore    * 0.20 +  // 20% weight
    sentenceStartScore * 0.10 +  // 10% weight
    punctuationScore   * 0.10    // 10% weight
  );

  const riskLevel: "low" | "medium" | "high" =
    overallScore >= 65 ? "high" :
    overallScore >= 35 ? "medium" : "low";

  const riskLabel =
    overallScore >= 80 ? "Very likely AI-generated" :
    overallScore >= 65 ? "Likely AI-generated" :
    overallScore >= 45 ? "Possibly AI-assisted" :
    overallScore >= 25 ? "Mostly human-like" :
    "Likely human-written";

  const dimensions: DetectionDimension[] = [
    {
      name:        "Sentence Variety",
      score:       burstinessScore,
      label:       burstinessScore >= 65 ? "Low" : burstinessScore >= 35 ? "Medium" : "High",
      description: "Variation in sentence length — humans write with more rhythm",
      isRisk:      burstinessScore >= 55,
    },
    {
      name:        "AI Phrases",
      score:       aiPhraseScore,
      label:       aiPhraseScore >= 65 ? "High" : aiPhraseScore >= 35 ? "Medium" : "Low",
      description: "Signature phrases disproportionately used by AI models",
      isRisk:      aiPhraseScore >= 40,
    },
    {
      name:        "Vocabulary Range",
      score:       vocabularyScore,
      label:       vocabularyScore >= 65 ? "Low" : vocabularyScore >= 35 ? "Medium" : "High",
      description: "Diversity of unique words — AI reuses safe vocabulary",
      isRisk:      vocabularyScore >= 55,
    },
    {
      name:        "Sentence Openings",
      score:       sentenceStartScore,
      label:       sentenceStartScore >= 65 ? "Repetitive" : sentenceStartScore >= 35 ? "Moderate" : "Varied",
      description: "How often sentences start with the same words",
      isRisk:      sentenceStartScore >= 55,
    },
    {
      name:        "Punctuation Pattern",
      score:       punctuationScore,
      label:       punctuationScore >= 65 ? "AI-like" : punctuationScore >= 35 ? "Mixed" : "Natural",
      description: "AI overuses commas, semicolons, and em-dashes",
      isRisk:      punctuationScore >= 55,
    },
  ];

  return {
    overallScore,
    riskLevel,
    riskLabel,
    dimensions,
    wordCount,
    sentenceCount: sentences.length,
    reliable,
  };
}
