import type { Generation } from "./api";

// ─────────────────────────────────────────────────────────────
//  exporters.ts — Export a generation to PDF / DOCX / Markdown
//
//  All exporters run entirely in the browser with no server
//  round-trip. jsPDF and docx are loaded dynamically so the
//  ~120kb bundles only load when the user actually exports.
// ─────────────────────────────────────────────────────────────

export interface ExportableGeneration {
  topic: string;
  output: string;
  tone?: string;
  length?: string;
  language?: string;
  wordCount?: number;
  createdAt?: string | Date;
}

function safeFilename(topic: string): string {
  return topic
    .slice(0, 60)
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase() || "textforge-output";
}

// ── PDF ─────────────────────────────────────────────────────
export async function exportPDF(gen: ExportableGeneration): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const titleLines = doc.splitTextToSize(gen.topic, usableWidth);
  doc.text(titleLines, margin, margin + 10);

  let y = margin + 10 + titleLines.length * 24;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(120);
  const meta = [
    gen.tone, gen.length, gen.language, gen.wordCount ? `${gen.wordCount} words` : null,
  ].filter(Boolean).join("  ·  ");
  if (meta) {
    doc.text(meta, margin, y + 12);
    y += 24;
  }

  doc.setDrawColor(212, 126, 48);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(20);

  const bodyLines = doc.splitTextToSize(gen.output, usableWidth);
  const lineHeight = 16;
  for (const line of bodyLines) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  doc.save(`${safeFilename(gen.topic)}.pdf`);
}

// ── DOCX ────────────────────────────────────────────────────
export async function exportDOCX(gen: ExportableGeneration): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");
  const { saveAs } = await import("file-saver");

  const meta = [
    gen.tone, gen.length, gen.language, gen.wordCount ? `${gen.wordCount} words` : null,
  ].filter(Boolean).join("  ·  ");

  const paragraphs: any[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: gen.topic, bold: true })],
    }),
  ];

  if (meta) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: meta, italics: true, color: "888888", size: 20 })],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [new TextRun("")] }));

  for (const line of gen.output.split(/\n+/)) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: line, size: 24 })],
        spacing: { after: 200 },
      })
    );
  }

  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeFilename(gen.topic)}.docx`);
}

// ── Markdown ────────────────────────────────────────────────
export function exportMarkdown(gen: ExportableGeneration): void {
  const meta = [
    gen.tone && `**Tone:** ${gen.tone}`,
    gen.length && `**Length:** ${gen.length}`,
    gen.language && `**Language:** ${gen.language}`,
    gen.wordCount && `**Words:** ${gen.wordCount}`,
  ].filter(Boolean).join(" · ");

  const md = `# ${gen.topic}\n\n${meta ? meta + "\n\n---\n\n" : ""}${gen.output}\n`;
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFilename(gen.topic)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
