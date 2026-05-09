"use client";
import { useEffect, useState } from "react";
import { api, StatsData } from "@/lib/api";
import {
  BarChart3, Loader2, Sparkles, Star, Hash, TrendingUp, Languages,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { LANGUAGES } from "@/lib/languages";
import toast from "react-hot-toast";

const TONE_COLORS: Record<string, string> = {
  formal:   "#7EB8E8",
  casual:   "#5EC49A",
  creative: "#B89AE0",
  academic: "#E0B85E",
};

export default function StatsPage() {
  const [stats, setStats]   = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(() => toast.error("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "120px 0" }}>
        <Loader2 size={32} color="var(--brand)" className="spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-3)" }}>
        Could not load stats. Make sure the backend is running.
      </div>
    );
  }

  const last30 = stats.last30Days.map((d) => ({
    date: d._id.slice(5),
    count: d.count,
    words: d.words,
  }));

  const toneData = stats.byTone.map((t) => ({
    name: t._id,
    value: t.count,
    color: TONE_COLORS[t._id] || "var(--brand)",
  }));

  const langData = stats.byLanguage.map((l) => ({
    name: LANGUAGES.find((x) => x.code === l._id)?.name ?? l._id,
    count: l.count,
  }));

  return (
    <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <BarChart3 size={26} color="var(--brand)" />
        <div>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "28px", color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            Stats
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-3)", marginTop: "2px" }}>
            Everything you've forged with TextForge AI.
          </p>
        </div>
      </div>

      {/* Big number cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px",
        marginBottom: "28px",
      }}>
        <StatCard Icon={Sparkles}   label="Total Generations" value={stats.totalGenerations.toLocaleString()} />
        <StatCard Icon={Hash}       label="Total Words Forged" value={stats.totalWords.toLocaleString()} />
        <StatCard Icon={Star}       label="Favourites"        value={stats.favouritesCount.toLocaleString()} />
        <StatCard Icon={Languages}  label="Languages Used"    value={String(stats.byLanguage.length)} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: "14px", marginBottom: "14px" }}>
        <ChartCard title="Last 30 days" Icon={TrendingUp}>
          {last30.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={last30} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} />
                <YAxis stroke="var(--text-3)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="var(--brand)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--brand)" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="By tone" Icon={Sparkles}>
          {toneData.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={toneData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={90}
                  paddingAngle={3}
                >
                  {toneData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="var(--bg-1)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "8px" }}>
            {toneData.map((t) => (
              <span key={t.name} style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontFamily: "var(--font-mono)", fontSize: "11px",
                color: "var(--text-2)",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, display: "inline-block" }} />
                {t.name} · {t.value}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="By language" Icon={Languages}>
        {langData.length === 0 ? <EmptyChart /> : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={langData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text-3)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} />
              <YAxis stroke="var(--text-3)" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="var(--brand)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

function StatCard({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <div className="card" style={{ padding: "20px 22px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "10px",
      }}>
        <span className="label" style={{ marginBottom: 0 }}>{label}</span>
        <Icon size={16} color="var(--brand)" />
      </div>
      <div style={{
        fontFamily: "var(--font-sans)", fontWeight: 700,
        fontSize: "32px", color: "var(--text-1)", letterSpacing: "-0.02em",
      }}>
        {value}
      </div>
    </div>
  );
}

function ChartCard({ title, Icon, children }: { title: string; Icon: any; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <Icon size={16} color="var(--brand)" />
        <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "14px", color: "var(--text-1)" }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div style={{
      height: 240, display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--text-4)", fontFamily: "var(--font-mono)", fontSize: "12px",
    }}>
      No data yet
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "var(--bg-1)",
  border: "1px solid var(--border-hover)",
  borderRadius: "8px",
  fontFamily: "var(--font-sans)",
  fontSize: "12px",
  color: "var(--text-1)",
};
