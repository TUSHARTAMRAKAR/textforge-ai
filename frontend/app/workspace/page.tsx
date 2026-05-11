"use client";
import { AIDetectionPanel } from "@/components/AIDetectionPanel";
import { useEffect, useState, useCallback, useRef } from "react";
import { api, Generation } from "@/lib/api";
import { useGenerateStore } from "@/lib/store";
import { PromptBuilder } from "@/components/PromptBuilder";
import { OutputPanel } from "@/components/OutputPanel";
import {
  Plus, Search, Star, Trash2, MoreHorizontal,
  PanelLeftClose, PanelLeftOpen, BarChart3, Key,
  Pencil, X, Loader2, Inbox, ChevronDown, ChevronUp,
  HelpCircle, Globe, LogOut, LogIn, ExternalLink,
  Copy, Download, Share2, FileText, FileType, FileCode,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { exportPDF, exportDOCX, exportMarkdown } from "@/lib/exporters";
import { LANGUAGES } from "@/lib/languages";
import { setApiUserId } from "@/lib/api";

const REFINE_ACTIONS = [
  { id: "shorter",    label: "Shorter",     instruction: "Make this text noticeably shorter while keeping the key ideas." },
  { id: "longer",     label: "Longer",      instruction: "Expand this text with more detail, examples, and supporting points." },
  { id: "formal",     label: "More formal", instruction: "Rewrite in a more formal, professional tone." },
  { id: "simpler",    label: "Simpler",     instruction: "Rewrite in simpler language a 12-year-old could understand." },
];

const TONE_COLORS: Record<string, string> = {
  formal:   "#7EB8E8",
  casual:   "#5EC49A",
  creative: "#B89AE0",
  academic: "#E0B85E",
};

function formatDate(dateStr: string): string {
  const d    = new Date(dateStr);
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const HH   = String(d.getHours()).padStart(2, "0");
  const MIN  = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${HH}:${MIN}`;
}

interface ChatMessage {
  id:        string;
  savedId?:  string;
  topic:     string;
  output:    string;
  tone:      string;
  length:    string;
  language?: string;
  wordCount: number;
  createdAt: string;
}

export default function WorkspacePage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [collapsed, setCollapsed]     = useState(false);
  const [activeTab, setActiveTab]     = useState<"all" | "starred">("all");
  const [search, setSearch]           = useState("");
  const [searchOpen, setSearchOpen]   = useState(false);
  const [activeGenId, setActiveGenId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Bottom panel states
  const [showHelp, setShowHelp]           = useState(false);
  const [showMoreMenu, setShowMoreMenu]   = useState(false);
  const [showUserMenu, setShowUserMenu]   = useState(false);

  const searchRef  = useRef<HTMLInputElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const helpRef    = useRef<HTMLDivElement>(null);
  const moreRef    = useRef<HTMLDivElement>(null);
  const userRef    = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();

  const {
    isDone, resetOutput, topic, output, isStreaming,
    savedId, wordCount, tone, length, language,
    setTopic, setTone, setLength, setLanguage,
  } = useGenerateStore();

  // Inject userId into API calls — MUST happen before any API call
  useEffect(() => {
    if (status === "loading") return;
    const id = session?.user ? ((session.user as any).id || session.user.email) : null;
    setApiUserId(id);
    // Refetch history immediately after userId is set
    // This ensures sidebar shows only the logged-in user's generations
    fetchHistory();
  }, [session, status]);

  // Close popups on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setShowHelp(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMoreMenu(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchHistory = useCallback(async () => {
    // Guests see empty sidebar — no shared anonymous history
    // Only logged-in users see their own private history
    if (status !== "loading" && !session?.user) {
      setGenerations([]);
      setLoading(false);
      return;
    }
    if (status === "loading") return;
    try {
      const res = await api.getHistory({
        page: 1, limit: 50,
        favouritesOnly: activeTab === "starred",
        search: search.trim() || undefined,
      });
      setGenerations(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [activeTab, search, session, status]);

  // Only fetch after auth status is known — prevents guest data showing briefly
  useEffect(() => {
    if (status === "loading") return;
    fetchHistory();
  }, [activeTab, status]);
  useEffect(() => { const t = setTimeout(() => fetchHistory(), 300); return () => clearTimeout(t); }, [search]);
  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50); }, [searchOpen]);

  // Append new generation as bubble
  useEffect(() => {
    if (!isDone || !output || !savedId) return;
    setChatMessages((prev) => {
      if (prev.find((m) => m.savedId === savedId)) return prev;
      return [...prev, { id: savedId + "_" + Date.now(), savedId, topic, output, tone, length, language, wordCount, createdAt: new Date().toISOString() }];
    });
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    api.getHistory({ page: 1, limit: 50, favouritesOnly: activeTab === "starred" })
      .then((res) => setGenerations(res.data)).catch(() => {});
  }, [isDone, savedId]);

  const handleLoadGeneration = (gen: Generation) => {
    setActiveGenId(gen._id);
    resetOutput();
    setChatMessages([{ id: gen._id, savedId: gen._id, topic: gen.topic, output: gen.output, tone: gen.tone, length: gen.length, language: gen.language, wordCount: gen.wordCount, createdAt: gen.createdAt }]);
    setTopic(gen.topic); setTone(gen.tone as any); setLength(gen.length as any);
    if (gen.language) setLanguage(gen.language as any);
  };

  const handleNewChat = () => { setActiveGenId(null); setChatMessages([]); resetOutput(); setTopic(""); };

  const handleDelete = async (id: string) => {
    try { await api.deleteGeneration(id); setGenerations((p) => p.filter((g) => g._id !== id)); if (activeGenId === id) handleNewChat(); toast.success("Deleted"); }
    catch { toast.error("Failed"); }
  };

  const handleFavouriteToggle = async (id: string, current: boolean) => {
    try {
      await api.toggleFavourite(id);
      if (activeTab === "starred" && current) setGenerations((p) => p.filter((g) => g._id !== id));
      else setGenerations((p) => p.map((g) => g._id === id ? { ...g, isFavourite: !current } : g));
    } catch { toast.error("Failed"); }
  };

  const currentTitle = chatMessages[0]?.topic || topic || "New generation";
  const userName     = session?.user?.name || "Guest";
  const userEmail    = session?.user?.email || "";
  const userImage    = session?.user?.image;
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)", overflow: "hidden", position: "relative", zIndex: 1 }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════ */}
      <aside style={{
        width: collapsed ? "52px" : "260px",
        minWidth: collapsed ? "52px" : "260px",
        background: "var(--bg-1)",
        borderRight: "1px solid var(--border)",
        height: "100%", display: "flex", flexDirection: "column",
        transition: "width 0.26s cubic-bezier(0.4,0,0.2,1), min-width 0.26s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden", flexShrink: 0,
      }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "10px 0" : "10px 10px",
          borderBottom: "1px solid var(--border)", gap: "4px", flexShrink: 0,
        }}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} style={iconBtn} title="Expand"><PanelLeftOpen size={17} /></button>
          ) : (
            <>
              <button onClick={handleNewChat} style={{
                flex: 1, display: "flex", alignItems: "center", gap: "7px",
                background: "var(--brand-subtle)", border: "1px solid var(--border-hover)",
                borderRadius: "9px", padding: "7px 11px",
                cursor: "pointer", color: "var(--brand)",
                fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "12.5px",
                transition: "all 0.15s",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(212,126,48,0.18)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; }}
              >
                <Plus size={15} /> New generation
              </button>
              <button onClick={() => setSearchOpen((v) => !v)} style={iconBtn} title="Search"><Search size={15} /></button>
              <button onClick={() => setCollapsed(true)} style={iconBtn} title="Collapse"><PanelLeftClose size={15} /></button>
            </>
          )}
        </div>

        {/* Search */}
        {!collapsed && searchOpen && (
          <div style={{ padding: "7px 10px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "7px", background: "var(--bg-2)" }}>
            <Search size={12} color="var(--text-3)" />
            <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "12px" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex", padding: 0 }}><X size={12} /></button>}
          </div>
        )}

        {/* Tabs */}
        {!collapsed && (
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            {(["all", "starred"] as const).map((id) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                flex: 1, padding: "7px 0", background: "transparent", border: "none",
                borderBottom: `2px solid ${activeTab === id ? "var(--brand)" : "transparent"}`,
                cursor: "pointer", color: activeTab === id ? "var(--brand)" : "var(--text-3)",
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 600,
                textTransform: "capitalize", transition: "all 0.15s",
              }}>
                {id === "starred" ? "⭐ Starred" : "All"}
              </button>
            ))}
          </div>
        )}

        {/* Conversation list */}
        {!collapsed && (
          <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "28px 0" }}>
                <Loader2 size={17} color="var(--brand)" className="spin" />
              </div>
            ) : generations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 12px" }}>
                <Inbox size={22} color="var(--text-4)" style={{ margin: "0 auto 8px", display: "block" }} />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--text-3)" }}>
                  {activeTab === "starred" ? "No starred items" : search ? "No results" : "No generations yet"}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {generations.map((gen) => (
                  <SidebarItem key={gen._id} generation={gen} isActive={activeGenId === gen._id}
                    onClick={() => handleLoadGeneration(gen)} onDelete={handleDelete} onFavouriteToggle={handleFavouriteToggle} />
                ))}
              </div>
            )}
          </div>
        )}

        {collapsed && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "8px", gap: "4px" }}>
            <button onClick={handleNewChat} style={iconBtn} title="New"><Plus size={17} /></button>
            <button onClick={() => { setCollapsed(false); setSearchOpen(true); }} style={iconBtn} title="Search"><Search size={17} /></button>
          </div>
        )}

        {/* ══ BOTTOM SECTION — Claude-style ══════════════════════ */}
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: collapsed ? "8px 0" : "6px 8px",
          display: "flex", flexDirection: "column", gap: "2px",
          flexShrink: 0, position: "relative",
        }}>

          {/* Stats — always visible in sidebar */}
          <SidebarLink href="/stats" Icon={BarChart3} label="Stats" collapsed={collapsed} />

          {/* API Keys — always visible in sidebar */}
          <SidebarLink href="/api-keys" Icon={Key} label="API Keys" collapsed={collapsed} />

          {/* ── User account section ── */}
          <div ref={userRef} style={{ position: "relative" }}>
            <button
              onClick={() => { setShowUserMenu((v) => !v); setShowHelp(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: "10px", padding: collapsed ? "8px 0" : "8px 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: "9px", background: "transparent", border: "none",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {/* Avatar */}
              {userImage ? (
                <Image src={userImage} alt={userName} width={28} height={28}
                  style={{ borderRadius: "50%", border: "1.5px solid var(--border-hover)", flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                  background: session ? "var(--brand)" : "var(--bg-3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "11px",
                  color: session ? "var(--bg-base)" : "var(--text-3)",
                }}>
                  {session ? userInitials : "?"}
                </div>
              )}
              {!collapsed && (
                <>
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session ? userName.split(" ")[0] : "Guest"}
                    </p>
                    {session && (
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {userEmail}
                      </p>
                    )}
                  </div>
                  <ChevronUp size={13} color="var(--text-4)" style={{ flexShrink: 0, transform: showUserMenu ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                </>
              )}
            </button>

            {/* ── User popup — contains ALL options ── */}
            {showUserMenu && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 6px)",
                left: collapsed ? "52px" : 0, right: 0,
                background: "var(--bg-1)", border: "1px solid var(--border-hover)",
                borderRadius: "12px", boxShadow: "0 -8px 32px rgba(0,0,0,0.3)",
                zIndex: 300, overflow: "hidden",
                minWidth: "230px",
              }}>

                {/* User info */}
                {session && (
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: "var(--text-1)" }}>{userName}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis" }}>{userEmail}</p>
                  </div>
                )}

                <div style={{ padding: "4px" }}>

                  {/* Get Help */}
                  <div ref={helpRef} style={{ position: "relative" }}>
                    <button onClick={() => setShowHelp((v) => !v)} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "10px",
                      padding: "9px 12px", borderRadius: "8px",
                      background: showHelp ? "var(--bg-2)" : "transparent", border: "none",
                      cursor: "pointer", color: "var(--text-1)",
                      fontFamily: "var(--font-sans)", fontSize: "13px", transition: "all 0.12s",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; }}
                      onMouseLeave={(e) => { if (!showHelp) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <HelpCircle size={15} color="var(--text-3)" />
                      <span style={{ flex: 1, textAlign: "left" }}>Get help</span>
                      <ChevronDown size={12} color="var(--text-4)" style={{ transform: showHelp ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                    </button>
                    {showHelp && (
                      <div style={{ background: "var(--bg-2)", borderRadius: "8px", margin: "2px 0", padding: "2px" }}>
                        {[
                          { label: "Documentation",      href: "https://github.com", desc: "Setup & usage guide"  },
                          { label: "API Reference",       href: null,                 desc: "All endpoints"        },
                          { label: "Report a bug",        href: "https://github.com", desc: "Open a GitHub issue"  },
                          { label: "Keyboard shortcuts",  href: null,                 desc: "⌘+Enter to generate" },
                        ].map(({ label, href, desc }) => (
                          href ? (
                            <a key={label} href={href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "6px", textDecoration: "none", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "12px", transition: "background 0.12s" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-3)"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500 }}>{label}</div>
                                <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "1px" }}>{desc}</div>
                              </div>
                              <ExternalLink size={11} color="var(--text-4)" />
                            </a>
                          ) : (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "6px" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, color: "var(--text-1)" }}>{label}</div>
                                <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "1px", fontFamily: "var(--font-mono)" }}>{desc}</div>
                              </div>
                            </div>
                          )
                        ))}
                        <div style={{ height: "1px", background: "var(--border)", margin: "4px 8px" }} />
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)", padding: "4px 12px 6px" }}>
                          TextForge AI v1.1.0 · Open Source · MIT
                        </p>
                      </div>
                    )}
                  </div>

                  <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />

                  {/* Sign out / Sign in */}
                  {session ? (
                    <button onClick={() => signOut({ callbackUrl: "/login" })} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "10px",
                      padding: "9px 12px", borderRadius: "8px",
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-2)", fontFamily: "var(--font-sans)", fontSize: "13px",
                      transition: "all 0.12s",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(224,80,80,0.1)"; (e.currentTarget as HTMLElement).style.color = "#E05050"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  ) : (
                    <a href="/login" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", textDecoration: "none", color: "var(--brand)", fontFamily: "var(--font-sans)", fontSize: "13px", transition: "background 0.12s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--brand-subtle)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <LogIn size={15} /> Sign in
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ═════════════════════════════════════════ */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <div style={{
          height: "52px", flexShrink: 0, display: "flex", alignItems: "center",
          padding: "0 20px", borderBottom: "1px solid var(--border)",
          background: "var(--bg-1)", position: "relative",
        }}>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "10px", maxWidth: "55%" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentTitle}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              color: "var(--brand)", background: "var(--brand-subtle)",
              border: "1px solid var(--border-hover)",
              borderRadius: "99px", padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0,
            }}>gemini-2.5-flash</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }} id="topbar-actions" />
        </div>

        {/* Message area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px 16px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
            {chatMessages.map((msg, idx) => (
              <MessageBubble key={msg.id} message={msg} index={idx} totalCount={chatMessages.length} />
            ))}
            <OutputPanel topbarMode inlineMode />
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Bottom input */}
        <div style={{ flexShrink: 0, padding: "10px 20px 18px", background: "var(--bg-base)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
            <PromptBuilder compactMode />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sidebar nav link ─────────────────────────────────────── */
function SidebarLink({ href, Icon, label, collapsed }: { href: string; Icon: any; label: string; collapsed: boolean }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: collapsed ? "9px 0" : "8px 12px",
      justifyContent: collapsed ? "center" : "flex-start",
      borderRadius: "8px", textDecoration: "none",
      color: "var(--text-3)", fontFamily: "var(--font-sans)", fontSize: "13px",
      transition: "all 0.15s",
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"; (e.currentTarget as HTMLElement).style.color = "var(--text-1)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
      title={label}
    >
      <Icon size={16} />{!collapsed && <span>{label}</span>}
    </Link>
  );
}

/* ── Message bubble ──────────────────────────────────────────── */
function MessageBubble({ message, index, totalCount }: { message: ChatMessage; index: number; totalCount: number }) {
  const [exportOpen, setExportOpen] = useState(false);
  const [starred, setStarred]       = useState(false);
  const exportRef                   = useRef<HTMLDivElement>(null);
  const color                       = TONE_COLORS[message.tone] || "var(--text-3)";

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => { if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  const handleCopy = () => { navigator.clipboard.writeText(message.output); toast.success("Copied!"); };
  const handleShare = async () => {
    if (!message.savedId) return;
    const url = `${window.location.origin}/s/${message.savedId}`;
    try { await navigator.clipboard.writeText(url); toast.success("Share link copied!"); }
    catch { window.prompt("Copy share link:", url); }
  };
  const handleStar = async () => {
    if (!message.savedId) return;
    try { const u = await api.toggleFavourite(message.savedId); setStarred(!!u.isFavourite); toast.success(u.isFavourite ? "⭐ Starred!" : "Unstarred"); }
    catch { toast.error("Failed"); }
  };
  const handleExport = async (kind: "pdf" | "docx" | "md" | "txt") => {
    setExportOpen(false);
    const gen = { topic: message.topic, output: message.output, tone: message.tone, length: message.length, language: message.language, wordCount: message.wordCount };
    try {
      if (kind === "pdf")  { await exportPDF(gen);  toast.success("PDF downloaded"); return; }
      if (kind === "docx") { await exportDOCX(gen); toast.success("DOCX downloaded"); return; }
      if (kind === "md")   { exportMarkdown(gen);   toast.success("Markdown downloaded"); return; }
      const blob = new Blob([message.output], { type: "text/plain" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `${message.topic.slice(0, 40)}.txt`; a.click();
      URL.revokeObjectURL(url); toast.success("TXT downloaded");
    } catch (e: any) { toast.error(e?.message || "Export failed"); }
  };

  return (
    <div className="animate-fade-up">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", flex: 1 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "13px", color: "var(--text-2)" }}>{message.topic}</span>
          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: color, background: `${color}15`, padding: "1px 7px", borderRadius: "99px", border: `1px solid ${color}25`, textTransform: "capitalize" }}>{message.tone}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)" }}>{message.wordCount}w</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)" }}>{formatDate(message.createdAt)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
          <button onClick={handleStar} title={starred ? "Unstar" : "Star"} style={actionBtn}>
            <Star size={14} fill={starred ? "var(--brand)" : "none"} color={starred ? "var(--brand)" : "currentColor"} />
          </button>
          <button onClick={handleShare} style={actionBtn}><Share2 size={14} /><span style={{ fontSize: "12px" }}>Share</span></button>
          <button onClick={handleCopy} style={actionBtn}><Copy size={14} /><span style={{ fontSize: "12px" }}>Copy</span></button>
          <div ref={exportRef} style={{ position: "relative" }}>
            <button onClick={() => setExportOpen((v) => !v)} style={actionBtn}>
              <Download size={14} /><span style={{ fontSize: "12px" }}>Export</span>
              <ChevronDown size={11} style={{ transform: exportOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }} />
            </button>
            {exportOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 200, background: "var(--bg-1)", border: "1px solid var(--border-hover)", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", padding: "4px", minWidth: "160px" }}>
                {[{ id: "pdf", label: "PDF document", Icon: FileType }, { id: "docx", label: "Word document", Icon: FileText }, { id: "md", label: "Markdown", Icon: FileCode }, { id: "txt", label: "Plain text", Icon: FileText }].map(({ id, label, Icon }) => (
                  <button key={id} onClick={() => handleExport(id as any)} style={{ width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: "7px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", transition: "background 0.12s" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "var(--bg-2)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <Icon size={14} color="var(--text-3)" />{label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px 28px", position: "relative" }}>
        {totalCount > 1 && <div style={{ position: "absolute", top: "12px", right: "14px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-4)" }}>#{index + 1}</div>}
        <p className="generation-output">{message.output}</p>
      </div>

      {/* Refine buttons — only on the most recent bubble */}
      {index === totalCount - 1 && (
        <RefineBar message={message} />
      )}

      {/* AI Detection Panel — below refine with spacing */}
      <div style={{ marginTop: "8px" }}>
        <AIDetectionPanel text={message.output} tone={message.tone} topic={message.topic} />
      </div>
    </div>
  );
}

/* ── Refine bar ─────────────────────────────────────────────── */
function RefineBar({ message }: { message: ChatMessage }) {
  const [refining, setRefining] = useState<string | null>(null);
  const {
    topic, tone, length, language,
    appendOutput, setIsStreaming, setIsDone,
    setError, setSavedId, resetOutput,
  } = useGenerateStore();

  const handleRefine = async (action: typeof REFINE_ACTIONS[number]) => {
    if (!message.output || !message.savedId) return;
    setRefining(action.id);
    resetOutput();
    setIsStreaming(true);
    try {
      await api.postRefine(
        {
          originalText: message.output,
          instruction:  action.instruction,
          topic:        message.topic,
          tone:         message.tone as any,
          length:       message.length as any,
          language:     message.language as any,
          refinementOf: message.savedId,
        },
        (text) => appendOutput(text),
        (newId) => {
          setIsStreaming(false);
          setIsDone(true);
          if (newId) setSavedId(newId);
          toast.success(`Refined: ${action.label}`);
          setRefining(null);
        },
        (err) => {
          setIsStreaming(false);
          setError(err);
          toast.error(err);
          setRefining(null);
        }
      );
    } catch (e: any) {
      setIsStreaming(false);
      toast.error(e?.message || "Refine failed");
      setRefining(null);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingTop: "4px" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-4)", letterSpacing: "0.06em" }}>
        ✦ REFINE
      </span>
      {REFINE_ACTIONS.map((action) => (
        <button key={action.id}
          onClick={() => handleRefine(action)}
          disabled={!!refining}
          style={{
            padding: "6px 14px", borderRadius: "99px",
            background: "var(--bg-2)", border: "1px solid var(--border)",
            cursor: refining ? "not-allowed" : "pointer",
            color: refining === action.id ? "var(--brand)" : "var(--text-2)",
            fontFamily: "var(--font-sans)", fontSize: "13px",
            transition: "all 0.12s",
            opacity: refining && refining !== action.id ? 0.5 : 1,
          }}
          onMouseEnter={(e) => { if (!refining) { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-1)"; }}}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
        >
          {refining === action.id ? "⏳ Refining…" : action.label}
        </button>
      ))}
    </div>
  );
}

/* ── Sidebar item ──────────────────────────────────────────── */
function SidebarItem({ generation, isActive, onClick, onDelete, onFavouriteToggle }: {
  generation: Generation; isActive: boolean;
  onClick: () => void; onDelete: (id: string) => void;
  onFavouriteToggle: (id: string, current: boolean) => void;
}) {
  const [hovered, setHovered]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [label, setLabel]       = useState(generation.topic);
  const menuRef                 = useRef<HTMLDivElement>(null);
  const color                   = TONE_COLORS[generation.tone] || "var(--text-3)";

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div onClick={!renaming && !menuOpen ? onClick : undefined}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: "9px", background: isActive ? "var(--brand-subtle)" : hovered ? "var(--bg-2)" : "transparent", border: `1px solid ${isActive ? "var(--border-hover)" : hovered || menuOpen ? "var(--border)" : "transparent"}`, transition: "all 0.12s", cursor: renaming ? "default" : "pointer" }}
    >
      {renaming ? (
        <div style={{ padding: "8px 10px", display: "flex", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
          <input autoFocus value={label} onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setRenaming(false); toast.success("Renamed"); } if (e.key === "Escape") { setRenaming(false); setLabel(generation.topic); } }}
            style={{ flex: 1, background: "var(--bg-3)", border: "1px solid var(--border-focus)", borderRadius: "6px", padding: "4px 8px", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "12px", outline: "none" }}
          />
          <button onClick={() => setRenaming(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex" }}><X size={12} /></button>
        </div>
      ) : (
        <div style={{ padding: "9px 10px", display: "flex", alignItems: "flex-start", gap: "6px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: isActive ? 600 : 500, fontSize: "12.5px", color: isActive ? "var(--brand)" : "var(--text-1)", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", marginBottom: "4px" }}>{label}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color, background: `${color}18`, padding: "1px 6px", borderRadius: "99px", border: `1px solid ${color}28`, textTransform: "capitalize" }}>{generation.tone}</span>
              <span style={{ fontSize: "10px", color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>{generation.wordCount}w</span>
            </div>
          </div>
          {(hovered || menuOpen) && (
            <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMenuOpen((v) => !v)} style={{ background: menuOpen ? "var(--bg-3)" : "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "4px", borderRadius: "6px", display: "flex" }}>
                <MoreHorizontal size={14} />
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "var(--bg-1)", border: "1px solid var(--border-hover)", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", zIndex: 200, minWidth: "145px", padding: "4px" }}>
                  <MenuItem icon={<Star size={13} fill={generation.isFavourite ? "var(--brand)" : "none"} color={generation.isFavourite ? "var(--brand)" : "currentColor"} />} label={generation.isFavourite ? "Unstar" : "Star"} onClick={() => { setMenuOpen(false); onFavouriteToggle(generation._id, !!generation.isFavourite); }} />
                  <MenuItem icon={<Pencil size={13} />} label="Rename" onClick={() => { setMenuOpen(false); setRenaming(true); }} />
                  <MenuItem icon={<Trash2 size={13} />} label="Delete" danger onClick={() => { setMenuOpen(false); onDelete(generation._id); }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "7px", background: hov ? (danger ? "rgba(224,80,80,0.1)" : "var(--bg-2)") : "transparent", border: "none", cursor: "pointer", color: hov && danger ? "#E05050" : danger ? "var(--text-2)" : "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "13px", textAlign: "left", transition: "all 0.12s" }}>
      {icon}{label}
    </button>
  );
}

const iconBtn: React.CSSProperties = { width: "30px", height: "30px", borderRadius: "7px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", transition: "all 0.12s" };
const actionBtn: React.CSSProperties = { display: "flex", alignItems: "center", gap: "4px", padding: "5px 9px", borderRadius: "7px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-2)", fontFamily: "var(--font-sans)", transition: "all 0.12s", fontSize: "13px" };
