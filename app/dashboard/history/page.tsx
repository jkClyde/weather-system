"use client";

import { useState, useMemo } from "react";
import {
  Thermometer, Droplets, Activity, AlertTriangle,
  CheckCircle2, Filter, Cpu, Clock, Download,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  historyReadings, alertLog, type AlertEntry,
} from "@/constants/historyData";
import { Status } from "@/type";

// ─── Badges ───────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { dot: string; pill: string; label: string }> = {
    normal: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20", label: "Normal" },
    warning: { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20", label: "Warning" },
    critical: { dot: "bg-red-500", pill: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20", label: "Critical" },
  };
  const { dot, pill, label } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: "warning" | "critical" }) {
  return severity === "critical"
    ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Critical</span>
    : <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Warning</span>;
}

function TypeIcon({ type }: { type: AlertEntry["type"] }) {
  if (type === "temperature") return <Thermometer className="w-4 h-4 text-orange-500" />;
  if (type === "humidity") return <Droplets className="w-4 h-4 text-sky-500" />;
  return <Activity className="w-4 h-4 text-violet-500" />;
}

function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, #3B4D7A, #1F263E)" }} />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{children}</span>
      </div>
      {right}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const [filterDate, setFilterDate] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");
  const [filterDevice, setFilterDevice] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const allDates = ["All", ...Array.from(new Set(historyReadings.map(r => r.date)))];
  const allDevices = ["All", ...Array.from(new Set(historyReadings.map(r => r.device)))];

  const filtered = useMemo(() => historyReadings.filter(r => {
    return (filterDate === "All" || r.date === filterDate)
      && (filterStatus === "all" || r.status === filterStatus)
      && (filterDevice === "All" || r.device === filterDevice);
  }), [filterDate, filterStatus, filterDevice]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageSlice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Quick counts for the filter summary bar
  const normalCount = filtered.filter(r => r.status === "normal").length;
  const warningCount = filtered.filter(r => r.status === "warning").length;
  const criticalCount = filtered.filter(r => r.status === "critical").length;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 bg-background min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-widest mb-1">
            Sensor Log
          </p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">History</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Mar 16 – Mar 22, 2025 ·{" "}
            <span className="text-foreground font-semibold">{historyReadings.length}</span> total readings
          </p>
        </div>
        <button
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* ── Readings ── */}
      <div>
        <SectionLabel
          right={
            <span className="text-xs text-muted-foreground font-mono">
              {filtered.length} records
            </span>
          }
        >
          Raw Readings
        </SectionLabel>

        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap mb-3 p-3 bg-card border border-border rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Date</span>
            <select value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1); }}
              className="text-sm bg-background border border-border rounded-lg px-2.5 py-1 text-foreground outline-none focus:border-ring">
              {allDates.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as any); setPage(1); }}
              className="text-sm bg-background border border-border rounded-lg px-2.5 py-1 text-foreground outline-none focus:border-ring">
              <option value="all">All</option>
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Device</span>
            <select value={filterDevice} onChange={e => { setFilterDevice(e.target.value); setPage(1); }}
              className="text-sm bg-background border border-border rounded-lg px-2.5 py-1 text-foreground outline-none focus:border-ring">
              {allDevices.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          {/* Status summary chips */}
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{normalCount}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{warningCount}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{criticalCount}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-400 via-sky-500 to-violet-500" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-5 text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />Time</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-orange-500 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Thermometer className="w-3 h-3" />Temp</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-sky-500 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Droplets className="w-3 h-3" />Humidity</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-violet-500 uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" />Vibration</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3" />Device</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Location</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageSlice.map((r, i) => (
                  <TableRow key={r.id} className={`border-border hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                    <TableCell className="pl-5 whitespace-nowrap font-mono text-sm text-muted-foreground">{r.date}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="font-mono text-sm text-muted-foreground bg-muted border border-border rounded-lg px-2 py-0.5">{r.timestamp}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="font-mono text-base font-bold text-orange-500">{r.temperature}<span className="text-sm font-normal text-orange-300">°C</span></span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="font-mono text-base font-bold text-sky-500">{r.humidity}<span className="text-sm font-normal text-sky-300">%</span></span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className={`font-mono text-base font-bold ${r.vibration > 0.18 ? "text-red-500" : r.vibration > 0.09 ? "text-amber-500" : "text-violet-500"}`}>
                        {r.vibration}<span className="text-sm font-normal text-violet-300">g</span>
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-lg px-2 py-0.5 border border-border">
                        <Cpu className="w-3 h-3" />{r.device}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{r.location}</TableCell>
                    <TableCell className="whitespace-nowrap"><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <span className="text-sm text-muted-foreground font-mono">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 text-sm rounded-lg font-mono transition-colors ${page === p ? "text-white font-bold" : "text-muted-foreground hover:bg-muted"}`}
                  style={page === p ? { background: "#1F263E" } : {}}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Alert log ── */}
      <div>
        <SectionLabel
          right={
            <span className="text-xs font-mono text-muted-foreground">
              {alertLog.length} events · all resolved
            </span>
          }
        >
          Alert Log
        </SectionLabel>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-400 via-amber-400 to-orange-300" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
                  {["Date", "Time", "Sensor", "Severity", "Value", "Threshold", "Device", "Status"].map(h => (
                    <TableHead key={h} className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap px-4 first:pl-5">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertLog.map((a, i) => (
                  <TableRow key={a.id} className={`border-border hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                    <TableCell className="pl-5 font-mono text-sm text-muted-foreground whitespace-nowrap">{a.date}</TableCell>
                    <TableCell className="px-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-muted-foreground bg-muted border border-border rounded-lg px-2 py-0.5">{a.time}</span>
                    </TableCell>
                    <TableCell className="px-4 whitespace-nowrap">
                      <span className="flex items-center gap-2 text-sm font-semibold text-foreground capitalize">
                        <TypeIcon type={a.type} />{a.type}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 whitespace-nowrap"><SeverityBadge severity={a.severity} /></TableCell>
                    <TableCell className="px-4 whitespace-nowrap">
                      <span className={`font-mono text-base font-bold ${a.severity === "critical" ? "text-red-500" : "text-amber-500"}`}>{a.value}</span>
                    </TableCell>
                    <TableCell className="px-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-muted-foreground bg-muted border border-border rounded-lg px-2 py-0.5">{a.threshold}</span>
                    </TableCell>
                    <TableCell className="px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-lg px-2 py-0.5 border border-border">
                        <Cpu className="w-3 h-3" />{a.device}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />Resolved
                      </span>
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