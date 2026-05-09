import type { Tone, Length } from "./api";

// ─────────────────────────────────────────────────────────────
//  templates.ts — Pre-built prompt templates
//
//  Selecting a template applies its tone/length and prefixes
//  the user's topic with a focused instruction. Powers the
//  "Custom Templates" feature on the Generate page.
// ─────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  tone: Tone;
  length: Length;
  topicPrefix?: string;
  placeholder: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "blog",
    name: "Blog Post",
    icon: "FileText",
    description: "Engaging blog content for your site",
    tone: "casual",
    length: "long",
    topicPrefix: "Write a blog post titled: ",
    placeholder: "How AI is transforming healthcare in 2026",
  },
  {
    id: "email",
    name: "Professional Email",
    icon: "Mail",
    description: "Polished business correspondence",
    tone: "formal",
    length: "short",
    topicPrefix: "Compose a professional email regarding: ",
    placeholder: "Following up on our meeting about Q2 roadmap",
  },
  {
    id: "essay",
    name: "Essay",
    icon: "BookOpen",
    description: "Structured academic writing",
    tone: "academic",
    length: "long",
    topicPrefix: "Write a well-cited essay on: ",
    placeholder: "The economic impact of climate change",
  },
  {
    id: "cover-letter",
    name: "Cover Letter",
    icon: "Briefcase",
    description: "Job application cover letter",
    tone: "formal",
    length: "medium",
    topicPrefix: "Write a cover letter for the role of: ",
    placeholder: "Senior Software Engineer at Stripe",
  },
  {
    id: "product",
    name: "Product Description",
    icon: "Package",
    description: "Compelling marketing copy",
    tone: "creative",
    length: "short",
    topicPrefix: "Write a product description for: ",
    placeholder: "A waterproof wireless bluetooth speaker",
  },
  {
    id: "social",
    name: "Social Media Post",
    icon: "Share2",
    description: "Catchy social caption",
    tone: "casual",
    length: "short",
    topicPrefix: "Write a social media post about: ",
    placeholder: "Launching our new mobile app today",
  },
  {
    id: "summary",
    name: "Executive Summary",
    icon: "ClipboardList",
    description: "Concise high-level overview",
    tone: "formal",
    length: "medium",
    topicPrefix: "Write an executive summary about: ",
    placeholder: "Q1 sales performance and Q2 forecast",
  },
  {
    id: "story",
    name: "Short Story",
    icon: "Sparkles",
    description: "Imaginative creative writing",
    tone: "creative",
    length: "long",
    topicPrefix: "Write a short story about: ",
    placeholder: "A lighthouse keeper who discovers a portal",
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
