"use client";
import { useEffect, useState, useMemo } from "react";
import { HistoryCard } from "@/components/HistoryCard";
import { api, Generation, Tone, Language } from "@/lib/api";
import { Loader2, History, Inbox, Search, Star, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import { LANGUAGES } from "@/lib/languages";

const TONES: { value: Tone; label: string }[] = [
  { value: "formal",   label: "Formal" },
  { value: "casual",   label: "Casual" },
  { value: "creative", label: "Creative" },
  { value: "academic", label: "Academic" },
];

type Tab = "all" | "favourites";

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  const [tab, setTab]                 = useState<Tab>("all");
  const [search, setSearch]           = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [toneFilter, setToneFilter]   = useState<Tone | "all">("all");
  const [langFilter, setLangFilter]   = useState<Language | "all">("all");

  // Debounce the search input so we don't query MongoDB on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getHistory({
        page,
        limit: 10,
        tone: toneFilter === "all" ? undefined : toneFilter,
        language: langFilter === "all" ? undefined : langFilter,
        search: debouncedSearch || undefined,
        favouritesOnly: tab === "favourites",
      });
      setGenerations(res.data);
      setTotalPages(res.pagination.pages);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page, tab, debouncedSearch, toneFilter, langFilter]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => { setPage(1); }, [tab, debouncedSearch, toneFilter, langFilter]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGeneration(id);
      setGenerations((prev) => prev.filter((g) => g._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleFavouriteToggle = (id: string, isFavourite: boolean) => {
    if (tab === "favourites" && !isFavourite) {
      setGenerations((prev) => prev.filter((g) => g._id !== id));
    } else {
      setGenerations((prev) => prev.map((g) => g._id === id ? { ...g, isFavourite } : g));
    }
  };

  const hasActiveFilter = useMemo(
    () => debouncedSearch !== "" || toneFilter !== "all" || langFilter !== "all",
    [debouncedSearch, toneFilter, langFilter]
  );

  const clearFilters = () => {
    setSearch(""); setToneFilter("all"); setLangFilter("all");
  };

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <History size={26} color="var(--brand)" />
        <div>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "28px", color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            History
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-3)", marginTop: "2px" }}>
            All your past generations — searchable, filterable, exportable.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", borderBottom: "1px solid var(--border)" }}>
        {[
          { id: "all", label: "All", Icon: History },
          { id: "favourites", label: "Favourites", Icon: Star },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "10px 16px", marginBottom: "-1px",
              background: "transparent", border: "none",
              borderBottom: `2px solid ${tab === id ? "var(--brand)" : "transparent"}`,
              cursor: "pointer",
              color: tab === id ? "var(--brand)" : "var(--text-2)",
              fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600,
              transition: "all 0.15s ease",
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "10px",
        marginBottom: "20px", alignItems: "center",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "8px 12px",
          flex: 1, minWidth: "240px",
        }}>
          <Search size={14} color="var(--text-3)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics or text…"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "13px",
            }}
          />
        </div>

        <select
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value as Tone | "all")}
          style={selectStyle}
        >
          <option value="all">All tones</option>
          {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value as Language | "all")}
          style={selectStyle}
        >
          <option value="all">All languages</option>
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>

        {hasActiveFilter && (
          <button onClick={clearFilters} style={{
            display: "flex", alignItems: "center", gap: "5px",
            padding: "8px 12px",
            background: "var(--bg-2)", border: "1px solid var(--border)",
            borderRadius: "9px", cursor: "pointer",
            color: "var(--text-3)",
            fontFamily: "var(--font-sans)", fontSize: "12px",
          }}>
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <Loader2 size={28} color="var(--brand)" className="spin" />
        </div>
      ) : generations.length === 0 ? (
        <div className="card" style={{ padding: "60px 24px", textAlign: "center" }}>
          <Inbox size={36} color="var(--text-4)" style={{ margin: "0 auto 14px", display: "block" }} />
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "15px", color: "var(--text-2)" }}>
            {tab === "favourites" ? "No favourites yet" : hasActiveFilter ? "No matches" : "No generations yet"}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-4)", marginTop: "5px" }}>
            {tab === "favourites"
              ? "Star a generation to pin it here."
              : hasActiveFilter
                ? "Try a different search or filter."
                : "Head to the generator to create your first one."}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {generations.map((gen) => (
              <HistoryCard
                key={gen._id}
                generation={gen}
                onDelete={handleDelete}
                onFavouriteToggle={handleFavouriteToggle}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "28px" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary"
              >
                Previous
              </button>
              <span style={{
                display: "flex", alignItems: "center", padding: "0 14px",
                color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: "13px",
              }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "9px 12px",
  background: "var(--bg-2)",
  border: "1px solid var(--border)",
  borderRadius: "9px",
  color: "var(--text-1)",
  fontFamily: "var(--font-sans)",
  fontSize: "13px",
  cursor: "pointer",
  outline: "none",
};
