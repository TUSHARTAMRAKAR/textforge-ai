import { notFound } from "next/navigation";
import Link from "next/link";
import { Flame, ExternalLink, Hash, Globe } from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  /s/[id] — Public shareable view of a generation
//
//  Anyone with the link can read the generation. Owners can
//  disable sharing on a per-generation basis from the History
//  page (PATCH /api/history/:id/share { isShared: false }).
// ─────────────────────────────────────────────────────────────

interface SharedGen {
  _id: string;
  topic: string;
  tone: string;
  length: string;
  language?: string;
  keywords?: string[];
  output: string;
  wordCount: number;
  model: string;
  createdAt: string;
}

async function getShared(id: string): Promise<SharedGen | null> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const r = await fetch(`${base}/api/share/${id}`, { cache: "no-store" });
    if (!r.ok) return null;
    const json = await r.json();
    return json.data as SharedGen;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const gen = await getShared(params.id);
  return {
    title: gen ? `${gen.topic} — TextForge AI` : "Shared generation — TextForge AI",
    description: gen ? gen.output.slice(0, 160) : "A generation shared via TextForge AI",
  };
}

export default async function SharedPage({ params }: { params: { id: string } }) {
  const gen = await getShared(params.id);
  if (!gen) return notFound();

  const formattedDate = new Date(gen.createdAt).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main style={{ maxWidth: "780px", margin: "0 auto", padding: "60px 24px 80px" }}>
      <div className="animate-fade-up" style={{ marginBottom: "24px" }}>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          textDecoration: "none", marginBottom: "20px",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #D47E30 0%, #E8A050 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(212,126,48,0.4)",
          }}>
            <Flame size={16} color="#1A1208" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "16px", color: "var(--text-1)" }}>
            TextForge <span style={{ color: "var(--brand)" }}>AI</span>
          </span>
        </Link>

        <span className="label" style={{ display: "inline-block", marginBottom: "10px" }}>Shared generation</span>
        <h1 style={{
          fontFamily: "var(--font-sans)", fontWeight: 700,
          fontSize: "clamp(28px, 4vw, 38px)", letterSpacing: "-0.02em",
          color: "var(--text-1)", lineHeight: 1.15, marginBottom: "16px",
        }}>
          {gen.topic}
        </h1>

        <div style={{
          display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "8px",
          fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)",
        }}>
          <span style={chip}>{gen.tone}</span>
          <span style={chip}>{gen.length}</span>
          {gen.language && (
            <span style={{ ...chip, color: "var(--brand)", borderColor: "var(--border-hover)", background: "var(--brand-subtle)" }}>
              <Globe size={11} style={{ marginRight: 4, display: "inline" }} /> {gen.language.toUpperCase()}
            </span>
          )}
          <span style={chip}><Hash size={11} style={{ marginRight: 4, display: "inline" }} />{gen.wordCount} words</span>
          <span style={chip}>{formattedDate}</span>
          <span style={chip}>{gen.model}</span>
        </div>
      </div>

      <article
        className="generation-output animate-fade-up delay-1"
        style={{
          background: "var(--bg-1)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "32px 36px",
          marginTop: "24px",
        }}
      >
        {gen.output}
      </article>

      <div className="animate-fade-up delay-2" style={{
        marginTop: "32px", display: "flex", justifyContent: "center", gap: "12px",
      }}>
        <Link href="/generate" className="btn-primary" style={{ textDecoration: "none" }}>
          <ExternalLink size={15} /> Generate your own
        </Link>
      </div>
    </main>
  );
}

const chip: React.CSSProperties = {
  background: "var(--bg-2)",
  border: "1px solid var(--border)",
  padding: "3px 10px",
  borderRadius: "99px",
  textTransform: "capitalize",
};
