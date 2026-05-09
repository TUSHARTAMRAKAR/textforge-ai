"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Key, Plus, Trash2, Loader2, Copy, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { features } from "@/lib/features";

interface ApiKey {
  _id: string;
  name: string;
  key: string;
  lastUsed?: string;
  requestCount: number;
  isRevoked: boolean;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<{ key: string; name: string } | null>(null);
  const [name, setName] = useState("");

  useEffect(() => { void load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.listApiKeys();
      setKeys(data as ApiKey[]);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        // Authentication is gated — show a friendly message instead of an error toast
        setKeys([]);
      } else {
        toast.error("Failed to load keys");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) { toast.error("Give the key a name"); return; }
    try {
      setCreating(true);
      const data = await api.createApiKey(trimmed);
      setNewKey({ key: data.key, name: data.name });
      setName("");
      await load();
    } catch {
      toast.error("Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this key? Existing apps using it will stop working.")) return;
    try {
      await api.revokeApiKey(id);
      toast.success("Key revoked");
      await load();
    } catch {
      toast.error("Failed to revoke");
    }
  };

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", padding: "40px 24px" }}>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Key size={26} color="var(--brand)" />
        <div>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "28px", color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            API Keys
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-3)", marginTop: "2px" }}>
            Use these keys to call the public TextForge API from your own apps.
          </p>
        </div>
      </div>

      {!features.authEnabled && (
        <div className="card" style={{
          padding: "16px 20px", marginBottom: "20px",
          background: "var(--brand-subtle)", borderColor: "var(--border-hover)",
          display: "flex", gap: "12px", alignItems: "flex-start",
        }}>
          <AlertCircle size={16} color="var(--brand)" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-1)", fontWeight: 500, marginBottom: "4px" }}>
              Authentication is currently disabled
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-2)", lineHeight: 1.6 }}>
              API keys are scoped per user. Set <code style={codeStyle}>NEXT_PUBLIC_AUTH_ENABLED=true</code> and configure NextAuth in <code style={codeStyle}>frontend/auth.ts</code> to enable per-user keys. See <code style={codeStyle}>docs/SETUP.md</code> for details.
            </p>
          </div>
        </div>
      )}

      {/* Create key */}
      <div className="card" style={{ padding: "18px 22px", marginBottom: "20px" }}>
        <label className="label">New key</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production server, My SaaS app, …"
            disabled={creating}
            className="input-base"
            style={{ flex: 1 }}
          />
          <button onClick={handleCreate} disabled={creating || !name.trim()} className="btn-primary">
            {creating ? <Loader2 size={15} className="spin" /> : <Plus size={15} />}
            Create
          </button>
        </div>
      </div>

      {/* Newly minted key (only shown once!) */}
      {newKey && (
        <div className="card" style={{
          padding: "18px 22px", marginBottom: "20px",
          background: "var(--brand-subtle)", borderColor: "var(--border-focus)",
        }}>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: "var(--brand)", marginBottom: "8px" }}>
            Your new key — save it now, you won't see it again.
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "var(--bg-base)", border: "1px solid var(--border)",
            padding: "10px 12px", borderRadius: "8px",
          }}>
            <code style={{
              flex: 1, fontFamily: "var(--font-mono)", fontSize: "12px",
              color: "var(--text-1)", overflowX: "auto", whiteSpace: "nowrap",
            }}>
              {newKey.key}
            </code>
            <button onClick={() => { navigator.clipboard.writeText(newKey.key); toast.success("Copied!"); }} className="btn-ghost">
              <Copy size={13} /> Copy
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            style={{
              marginTop: "10px", background: "transparent", border: "none",
              cursor: "pointer", color: "var(--text-3)", fontSize: "12px",
              fontFamily: "var(--font-mono)",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Existing keys list */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Loader2 size={24} color="var(--brand)" className="spin" />
        </div>
      ) : keys.length === 0 ? (
        <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
          <Key size={28} color="var(--text-4)" style={{ margin: "0 auto 12px", display: "block" }} />
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-3)" }}>
            No API keys yet. Create one above.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {keys.map((k) => (
            <div key={k._id} className="card" style={{
              padding: "14px 18px",
              display: "flex", alignItems: "center", gap: "16px",
              opacity: k.isRevoked ? 0.5 : 1,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)" }}>
                    {k.name}
                  </span>
                  {k.isRevoked && (
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "10px",
                      background: "rgba(224,80,80,0.1)", color: "#E05050",
                      padding: "2px 8px", borderRadius: "99px",
                      border: "1px solid rgba(224,80,80,0.3)",
                    }}>REVOKED</span>
                  )}
                </div>
                <code style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)",
                }}>
                  {k.key}
                </code>
                <div style={{
                  display: "flex", gap: "12px", marginTop: "4px",
                  fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)",
                }}>
                  <span>{k.requestCount} reqs</span>
                  {k.lastUsed && <span>last used {new Date(k.lastUsed).toLocaleDateString()}</span>}
                  <span>created {new Date(k.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {!k.isRevoked && (
                <button
                  onClick={() => handleRevoke(k._id)}
                  className="btn-ghost"
                  title="Revoke"
                  style={{ color: "var(--text-3)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B6B")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Usage docs */}
      <div className="card" style={{ padding: "20px 24px", marginTop: "28px" }}>
        <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "15px", color: "var(--text-1)", marginBottom: "10px" }}>
          Using the API
        </h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-3)", marginBottom: "12px", lineHeight: 1.6 }}>
          Send a POST request to the public endpoint with your key in the Authorization header.
        </p>
        <pre style={{
          background: "var(--bg-base)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "14px 16px",
          fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-1)",
          overflowX: "auto", lineHeight: 1.7,
        }}>
{`curl -X POST ${typeof window !== "undefined" ? window.location.origin.replace("3000", "5000") : "https://api.textforge.example"}/v1/generate \\
  -H "Authorization: Bearer tf_live_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "The future of renewable energy",
    "tone": "academic",
    "length": "medium",
    "language": "en",
    "keywords": ["solar", "wind", "grid"]
  }'`}
        </pre>
      </div>
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  background: "var(--bg-2)",
  padding: "1px 6px",
  borderRadius: "4px",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
};
