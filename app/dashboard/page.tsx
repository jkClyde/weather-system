"use client";

import {
  Thermometer, Wind, Zap, TrendingUp, TrendingDown,
  Activity, Droplets, Gauge, Clock, Minus,
} from "lucide-react";
import { SensorCard } from "@/components/SensorCard";
import CustomTooltip from "@/components/CustomToolTip";
import { recentReadings, stats, chartData } from "@/constants/data";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Status } from "@/type";

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; dot: string; pill: string }> = {
    normal: { label: "Normal", dot: "bg-emerald-500", pill: "bg-emerald-50  text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
    warning: { label: "Warning", dot: "bg-amber-500", pill: "bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-500/10   dark:text-amber-400   dark:border-amber-500/20" },
    critical: { label: "Critical", dot: "bg-red-500", pill: "bg-red-50     text-red-700     border-red-200     dark:bg-red-500/10     dark:text-red-400     dark:border-red-500/20" },
  };
  const { label, dot, pill } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// ─── Quick-stat pill ──────────────────────────────────────────────────────────
function Pill({ icon, value, color }: { icon: React.ReactNode; value: string; color: string }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-xs font-mono font-medium ${color}`}>
      {icon}
      {value}
    </div>
  );
}

// ─── Dashboard header ─────────────────────────────────────────────────────────
// Uses the primary navy theme from globals.css
function DashboardHeader() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-lg"
      style={{ background: "linear-gradient(135deg, #1F263E 0%, #2A3354 50%, #3B4D7A 100%)" }}
    >
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5" />
      <div className="absolute -bottom-14 -right-4  w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute top-6   right-32     w-16 h-16 rounded-full bg-white/5" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-sm">
              <Gauge className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-mono uppercase tracking-widest">SensorGrid</p>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none">
                Sensor Dashboard
              </h1>
            </div>
          </div>
          <p className="text-white/55 text-xs font-mono mt-1">
            ESP32 active · Last update:{" "}
            <span className="text-white/80 font-semibold">2 seconds ago</span>
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3">
          <span className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-mono font-semibold text-white tracking-widest uppercase">Live</span>
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Pill icon={<Thermometer className="w-3 h-3" />} value="28.4°C" color="bg-orange-400/20 border-orange-300/30 text-orange-100" />
            <Pill icon={<Droplets className="w-3 h-3" />} value="62.1%" color="bg-sky-400/20    border-sky-300/30    text-sky-100" />
            <Pill icon={<Activity className="w-3 h-3" />} value="0.03g" color="bg-violet-400/20 border-violet-300/30 text-violet-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
const statMeta: Record<string, {
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  trend: "up" | "down" | "stable";
  trendClass: string;
}> = {
  "Max Temp": {
    icon: <Thermometer className="w-5 h-5 text-orange-500" />,
    accent: "from-orange-400 to-amber-400",
    iconBg: "bg-orange-50 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20",
    trend: "up",
    trendClass: "text-red-500 bg-red-50 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  "Min Humidity": {
    icon: <Droplets className="w-5 h-5 text-sky-500" />,
    accent: "from-sky-400 to-cyan-400",
    iconBg: "bg-sky-50 border-sky-100 dark:bg-sky-500/10 dark:border-sky-500/20",
    trend: "down",
    trendClass: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  "Avg Vibration": {
    icon: <Activity className="w-5 h-5 text-violet-500" />,
    accent: "from-violet-400 to-purple-400",
    iconBg: "bg-violet-50 border-violet-100 dark:bg-violet-500/10 dark:border-violet-500/20",
    trend: "stable",
    trendClass: "text-muted-foreground bg-muted border-border",
  },
  "Uptime": {
    icon: <Gauge className="w-5 h-5 text-emerald-500" />,
    accent: "from-emerald-400 to-green-400",
    iconBg: "bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    trend: "stable",
    trendClass: "text-muted-foreground bg-muted border-border",
  },
};

function StatCard({ s }: { s: typeof stats[0] }) {
  const meta = statMeta[s.label] ?? {
    icon: <Activity className="w-5 h-5 text-muted-foreground" />,
    accent: "from-slate-300 to-slate-400",
    iconBg: "bg-muted border-border",
    trend: "stable" as const,
    trendClass: "text-muted-foreground bg-muted border-border",
  };

  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Left colour accent bar — hardcoded gradient, decorative only */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${meta.accent}`} />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${meta.iconBg}`}>
            {meta.icon}
          </div>
          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.trendClass}`}>
            {meta.trend === "up" && <TrendingUp className="w-3 h-3" />}
            {meta.trend === "down" && <TrendingDown className="w-3 h-3" />}
            {meta.trend === "stable" && <Minus className="w-3 h-3" />}
            {meta.trend === "up" ? "Rising" : meta.trend === "down" ? "Falling" : "Stable"}
          </span>
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
        <p className={`text-2xl md:text-4xl font-bold tracking-tight ${s.color} mb-0.5`}>{s.value}</p>
        <p className="text-xs text-muted-foreground">{s.sub}</p>
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, #3B4D7A, #1F263E)" }} />
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{children}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-background min-h-screen">

      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">

        {/* Sensor cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <SectionLabel>Sensors</SectionLabel>
          <SensorCard label="Temperature" value="28.4" unit="°C" icon={Thermometer}
            trend="down" trendLabel="↓ 0.5° from last hour" status="normal"
            accentClass="bg-gradient-to-r from-orange-400 to-red-400"
            iconBgClass="bg-orange-500/10 text-orange-500" />
          <SensorCard label="Humidity" value="62.1" unit="%" icon={Wind}
            trend="up" trendLabel="↑ 1.2% from last hour" status="warning"
            accentClass="bg-gradient-to-r from-sky-400 to-blue-500"
            iconBgClass="bg-sky-500/10 text-sky-500" />
          <SensorCard label="Vibration" value="0.03" unit="g" icon={Zap}
            trend="stable" trendLabel="Stable — no anomalies" status="normal"
            accentClass="bg-gradient-to-r from-violet-400 to-purple-500"
            iconBgClass="bg-violet-500/10 text-violet-500" />
        </div>

        {/* Right column */}
        <div className="lg:col-span-8 flex flex-col gap-5">

          {/* Chart */}
          <div>
            <SectionLabel>Readings Over Time</SectionLabel>
            <div className="relative bg-card border border-border rounded-2xl p-5 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-sky-500 to-violet-500" />
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Sensor Readings Over Time</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-0.5">Today, 08:00 – 15:00</p>
                </div>
                <Badge variant="outline" className="font-mono text-[9px] tracking-widest text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  LIVE
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.30} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gHum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.30} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gVib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.30} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.8} />
                  <XAxis dataKey="time"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "monospace" }}
                    tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "monospace" }}
                    tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value, entry) => (
                      <span style={{ color: (entry as any).color, fontWeight: 600, fontSize: 11 }}>{value}</span>
                    )}
                  />
                  <Area type="monotone" dataKey="temperature" name="Temp (°C)"
                    stroke="#f97316" strokeWidth={2.5} fill="url(#gTemp)" dot={false}
                    activeDot={{ r: 5, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }} />
                  <Area type="monotone" dataKey="humidity" name="Humidity (%)"
                    stroke="#0ea5e9" strokeWidth={2.5} fill="url(#gHum)" dot={false}
                    activeDot={{ r: 5, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }} />
                  <Area type="monotone" dataKey="vibration" name="Vibration (g)"
                    stroke="#a78bfa" strokeWidth={2.5} fill="url(#gVib)" dot={false}
                    activeDot={{ r: 5, fill: "#a78bfa", strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats */}
          <div>
            <SectionLabel>Statistics</SectionLabel>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {stats.map((s) => <StatCard key={s.label} s={s} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        <SectionLabel>Recent Readings</SectionLabel>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-400 via-sky-500 to-violet-500" />

          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-base font-semibold text-foreground">Recent Readings</h2>
              <p className="text-sm text-muted-foreground font-mono mt-0.5">Latest 7 sensor entries</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Auto-refresh</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-5 text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Time</TableHead>
                  <TableHead className="text-xs font-bold text-orange-500 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Thermometer className="w-3 h-3" />Temp</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-sky-500 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Droplets className="w-3 h-3" />Humidity</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-violet-500 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" />Vibration</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReadings.map((r, i) => (
                  <TableRow
                    key={r.id}
                    className={`border-border transition-colors hover:bg-primary/5 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}
                  >
                    <TableCell className="pl-5 whitespace-nowrap">
                      <span className="font-mono text-sm text-muted-foreground bg-muted border border-border rounded-lg px-2 py-1">
                        {r.timestamp}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 font-mono text-base font-bold text-orange-500">
                        {r.temperature}<span className="text-sm font-normal text-orange-300">°C</span>
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 font-mono text-base font-bold text-sky-500">
                        {r.humidity}<span className="text-sm font-normal text-sky-300">%</span>
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-0.5 font-mono text-base font-bold text-violet-500">
                        {r.vibration}<span className="text-sm font-normal text-violet-300">g</span>
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}