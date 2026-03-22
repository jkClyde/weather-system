"use client";

import {
    Thermometer, Droplets, Activity, AlertTriangle,
    TrendingUp, TrendingDown, CheckCircle2, Zap, Download,
} from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    AreaChart, Area, BarChart, Bar, ComposedChart, Line,
    XAxis, YAxis, CartesianGrid, ReferenceLine,
    Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { dailySummaries, weeklyTrend } from "@/constants/historyData";

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-border rounded-xl shadow-xl p-3 text-xs min-w-[140px]">
            <p className="font-bold text-foreground mb-2 font-mono">{label}</p>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        {p.name}
                    </span>
                    <span className="font-bold text-foreground">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, delta, deltaLabel, accent, icon }: {
    label: string; value: string; sub: string;
    delta?: "up" | "down" | "neutral"; deltaLabel?: string;
    accent: string; icon: React.ReactNode;
}) {
    return (
        <div className="relative overflow-hidden bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accent}`} />
            <div className="pl-3 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0">
                        {icon}
                    </div>
                    {deltaLabel && (
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${delta === "up" ? "text-red-600 bg-red-50 border-red-100 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20"
                            : delta === "down" ? "text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                                : "text-muted-foreground bg-muted border-border"
                            }`}>
                            {delta === "up" && <TrendingUp className="w-3 h-3" />}
                            {delta === "down" && <TrendingDown className="w-3 h-3" />}
                            {deltaLabel}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-3xl font-bold text-foreground tracking-tight leading-none mb-1">{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
            </div>
        </div>
    );
}

// ─── Chart wrapper ────────────────────────────────────────────────────────────
function ChartCard({ title, sub, accentClass, badge, children }: {
    title: string; sub: string; accentClass: string;
    badge?: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="relative bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${accentClass}`} />
            <div className="p-5 pb-2">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-base font-bold text-foreground">{title}</h2>
                        <p className="text-sm text-muted-foreground font-mono mt-0.5">{sub}</p>
                    </div>
                    {badge}
                </div>
            </div>
            <div className="px-2 pb-5">{children}</div>
        </div>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, #3B4D7A, #1F263E)" }} />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{children}</span>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReportPage() {
    const totalAlerts = dailySummaries.reduce((s, d) => s + d.alerts, 0);
    const totalReadings = dailySummaries.reduce((s, d) => s + d.totalReadings, 0).toLocaleString();
    const weekAvgTemp = (dailySummaries.reduce((s, d) => s + d.avgTemp, 0) / dailySummaries.length).toFixed(1);
    const weekAvgHum = (dailySummaries.reduce((s, d) => s + d.avgHumidity, 0) / dailySummaries.length).toFixed(1);
    const weekPeakVib = Math.max(...dailySummaries.map(d => d.peakVibration)).toFixed(2);

    const vibData = dailySummaries.map(d => ({
        date: d.date,
        peak: d.peakVibration,
        avg: d.avgVibration,
    }));

    return (
        <div className="flex flex-col gap-8 p-4 md:p-6 bg-background min-h-screen">

            {/* ── Report header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-widest mb-1">
                        Weekly Report · Mar 16 – Mar 22, 2025
                    </p>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Analytic Report</h1>

                    <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-semibold text-foreground">{totalReadings}</span> readings ·{" "}
                        <span className="font-semibold text-foreground">2 devices</span> ·{" "}
                        <span className="font-semibold text-foreground">3 locations</span>
                    </p>
                </div>
                <button
                    className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white shadow-md transition-all hover:opacity-90 active:scale-95 self-start sm:self-auto"
                    style={{ background: "#1F263E" }}
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-orange-400 via-sky-500 via-violet-400 to-transparent opacity-40 -mt-4" />

            {/* ── KPIs ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <KpiCard label="Avg Temperature" value={`${weekAvgTemp}°C`} sub="7-day daily average"
                    delta="up" deltaLabel="+0.6° vs prior week"
                    accent="from-orange-400 to-amber-400"
                    icon={<Thermometer className="w-4 h-4 text-orange-500" />} />
                <KpiCard label="Avg Humidity" value={`${weekAvgHum}%`} sub="7-day daily average"
                    delta="up" deltaLabel="+1.2% vs prior week"
                    accent="from-sky-400 to-cyan-400"
                    icon={<Droplets className="w-4 h-4 text-sky-500" />} />
                <KpiCard label="Peak Vibration" value={`${weekPeakVib}g`} sub="Mar 22 at 14:58"
                    delta="up" deltaLabel="New 7-day high"
                    accent="from-violet-400 to-purple-400"
                    icon={<Activity className="w-4 h-4 text-violet-500" />} />
                <KpiCard label="Total Alerts" value={String(totalAlerts)} sub="All resolved"
                    delta="neutral" deltaLabel="100% resolved"
                    accent="from-amber-400 to-orange-400"
                    icon={<AlertTriangle className="w-4 h-4 text-amber-500" />} />
            </div>

            {/* ── Trend charts ── */}
            <div>
                <SectionLabel>Weekly Trends</SectionLabel>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    <ChartCard
                        title="Temperature"
                        sub="Daily average · °C"
                        accentClass="bg-gradient-to-r from-orange-400 to-amber-400"
                        badge={<span className="text-xs font-mono text-orange-500 bg-orange-50 border border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20 px-2.5 py-1 rounded-full font-semibold">7 days</span>}
                    >
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="tG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.22} />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.8} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                <YAxis domain={[25, 33]} tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTip />} />
                                <ReferenceLine y={30} stroke="#f97316" strokeDasharray="4 3" strokeWidth={1.2} opacity={0.55}
                                    label={{ value: "Alert ≥30°C", position: "insideTopRight", fontSize: 10, fill: "#f97316" }} />
                                <Area type="monotone" dataKey="temperature" name="Avg Temp (°C)"
                                    stroke="#f97316" strokeWidth={2.5} fill="url(#tG)"
                                    dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard
                        title="Humidity"
                        sub="Daily average · %"
                        accentClass="bg-gradient-to-r from-sky-400 to-cyan-400"
                        badge={<span className="text-xs font-mono text-sky-500 bg-sky-50 border border-sky-100 dark:bg-sky-500/10 dark:border-sky-500/20 px-2.5 py-1 rounded-full font-semibold">7 days</span>}
                    >
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="hG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.22} />
                                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.8} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                <YAxis domain={[53, 70]} tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTip />} />
                                <ReferenceLine y={65} stroke="#0ea5e9" strokeDasharray="4 3" strokeWidth={1.2} opacity={0.55}
                                    label={{ value: "Alert ≥65%", position: "insideTopRight", fontSize: 10, fill: "#0ea5e9" }} />
                                <Area type="monotone" dataKey="humidity" name="Avg Humidity (%)"
                                    stroke="#0ea5e9" strokeWidth={2.5} fill="url(#hG)"
                                    dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 0 }}
                                    activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            {/* ── Vibration + alerts ── */}
            <div>
                <SectionLabel>Vibration & Alerts</SectionLabel>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    <div className="lg:col-span-2">
                        <ChartCard
                            title="Vibration — Peak vs Average"
                            sub="Daily readings · g"
                            accentClass="bg-gradient-to-r from-violet-400 to-purple-500"
                            badge={
                                <span className="text-xs font-mono text-violet-500 bg-violet-50 border border-violet-100 dark:bg-violet-500/10 dark:border-violet-500/20 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                    <Zap className="w-3 h-3" />Sensor
                                </span>
                            }
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <ComposedChart data={vibData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.8} />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                    <Tooltip content={<ChartTip />} />
                                    <ReferenceLine y={0.18} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.5} opacity={0.6}
                                        label={{ value: "Critical ≥0.18g", position: "insideTopRight", fontSize: 10, fill: "#ef4444" }} />
                                    <ReferenceLine y={0.09} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1} opacity={0.5}
                                        label={{ value: "Warning ≥0.09g", position: "insideTopRight", fontSize: 10, fill: "#f59e0b" }} />
                                    <Bar dataKey="peak" name="Peak vib (g)" fill="#a78bfa" opacity={0.85} radius={[4, 4, 0, 0]} />
                                    <Line type="monotone" dataKey="avg" name="Avg vib (g)" stroke="#7c3aed" strokeWidth={2.5}
                                        dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                                        activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    <div className="lg:col-span-1">
                        <ChartCard
                            title="Daily Alerts"
                            sub="Events per day"
                            accentClass="bg-gradient-to-r from-amber-400 to-orange-400"
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.8} />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "monospace" }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip content={<ChartTip />} />
                                    <Bar dataKey="alerts" name="Alerts" fill="#f97316" opacity={0.85} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </div>
            </div>

            {/* ── Daily summary table ── */}
            <div>
                <SectionLabel>Daily Summary</SectionLabel>
                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                                    <TableHead className="pl-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</TableHead>
                                    <TableHead className="text-xs font-bold text-orange-500 uppercase tracking-widest">Avg Temp</TableHead>
                                    <TableHead className="text-xs font-bold text-orange-400 uppercase tracking-widest">Min / Max</TableHead>
                                    <TableHead className="text-xs font-bold text-sky-500 uppercase tracking-widest">Avg Hum</TableHead>
                                    <TableHead className="text-xs font-bold text-sky-400 uppercase tracking-widest">Min / Max</TableHead>
                                    <TableHead className="text-xs font-bold text-violet-500 uppercase tracking-widest">Peak Vib</TableHead>
                                    <TableHead className="text-xs font-bold text-amber-500 uppercase tracking-widest">Alerts</TableHead>
                                    <TableHead className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Uptime</TableHead>
                                    <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Readings</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...dailySummaries].reverse().map((d, i) => (
                                    <TableRow key={d.date} className={`border-border hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                                        <TableCell className="pl-5 whitespace-nowrap">
                                            <span className="font-mono text-sm font-semibold text-muted-foreground bg-muted border border-border rounded-lg px-2 py-1">{d.date}</span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span className="font-mono text-base font-bold text-orange-500">{d.avgTemp}°C</span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span className="font-mono text-sm text-orange-300">{d.minTemp}</span>
                                            <span className="text-muted-foreground mx-1 text-xs">–</span>
                                            <span className="font-mono text-sm font-semibold text-orange-500">{d.maxTemp}°C</span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span className="font-mono text-base font-bold text-sky-500">{d.avgHumidity}%</span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span className="font-mono text-sm text-sky-300">{d.minHumidity}</span>
                                            <span className="text-muted-foreground mx-1 text-xs">–</span>
                                            <span className="font-mono text-sm font-semibold text-sky-500">{d.maxHumidity}%</span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span className={`font-mono text-base font-bold ${d.peakVibration > 0.18 ? "text-red-500" : d.peakVibration > 0.09 ? "text-amber-500" : "text-violet-500"}`}>
                                                {d.peakVibration}g
                                            </span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {d.alerts > 0
                                                ? <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"><AlertTriangle className="w-3 h-3" />{d.alerts}</span>
                                                : <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"><CheckCircle2 className="w-3 h-3" />None</span>
                                            }
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.uptime}%` }} />
                                                </div>
                                                <span className="font-mono text-xs text-foreground">{d.uptime}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span className="font-mono text-sm font-semibold text-foreground">{d.totalReadings}</span>
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