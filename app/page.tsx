"use client";

import * as React from "react";
import { Thermometer, Wind, Zap, Wifi } from "lucide-react";
import { SensorCard } from "@/components/SensorCard";
import { recentReadings, stats } from "@/config/data";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ─── tiny helpers ─────────────────────────────────────────── */

function PulsingDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${color}`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
    </span>
  );
}

function TempCell({ value }: { value: number }) {
  const hot = value >= 30;
  const warm = value >= 27;
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-full
        ${hot ? "bg-red-500/10 text-red-500" : warm ? "bg-orange-500/10 text-orange-500" : "bg-sky-500/10 text-sky-500"}`}
    >
      {value}°C
    </span>
  );
}

function HumidityBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct > 80 ? "bg-blue-500" : pct > 60 ? "bg-sky-400" : "bg-teal-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-xs font-medium text-sky-500">{value}%</span>
    </div>
  );
}

function VibCell({ value }: { value: number }) {
  const bars = 5;
  const active = Math.round((value / 0.1) * bars);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-end gap-[2px] h-4">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-sm transition-all duration-300 ${i < active ? "bg-violet-500" : "bg-muted"}`}
            style={{ height: `${40 + i * 15}%` }}
          />
        ))}
      </div>
      <span className="font-mono text-xs font-medium text-violet-500">{value}g</span>
    </div>
  );
}

const statusConfig: Record<string, { dot: string; badge: string; label: string }> = {
  normal: { dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Normal" },
  warning: { dot: "bg-amber-400", badge: "bg-amber-400/10  text-amber-600  border-amber-400/20", label: "Warning" },
  critical: { dot: "bg-red-500", badge: "bg-red-500/10    text-red-600    border-red-500/20", label: "Critical" },
};

function StatusCell({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.normal;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}>
      <PulsingDot color={cfg.dot} />
      {cfg.label}
    </span>
  );
}

/* ─── main page ────────────────────────────────────────────── */

export default function Page() {
  const [highlighted, setHighlighted] = React.useState<number | null>(null);
  const [tick, setTick] = React.useState(new Date());

  // flash latest row every 4s to simulate live data arriving
  React.useEffect(() => {
    const id = setInterval(() => {
      setHighlighted(recentReadings[0].id);
      setTick(new Date());
      setTimeout(() => setHighlighted(null), 800);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-5 p-5 overflow-auto">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Real-time sensor monitoring — ESP32 node active
        </p>
      </div>

      {/* Sensor cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SensorCard
          label="Temperature"
          value="28.4"
          unit="°C"
          icon={Thermometer}
          trend="down"
          trendLabel="↓ 0.5° from last hour"
          status="normal"
          accentClass="bg-gradient-to-r from-orange-400 to-red-400"
          iconBgClass="bg-orange-500/10 text-orange-500"
        />
        <SensorCard
          label="Humidity"
          value="62.1"
          unit="%"
          icon={Wind}
          trend="up"
          trendLabel="↑ 1.2% from last hour"
          status="warning"
          accentClass="bg-gradient-to-r from-sky-400 to-blue-500"
          iconBgClass="bg-sky-500/10 text-sky-500"
        />
        <SensorCard
          label="Vibration"
          value="0.03"
          unit="g"
          icon={Zap}
          trend="stable"
          trendLabel="Stable — no anomalies"
          status="normal"
          accentClass="bg-gradient-to-r from-violet-400 to-purple-500"
          iconBgClass="bg-violet-500/10 text-violet-500"
        />
      </div>

      {/* Stats + Table row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary stats */}
        <div className="flex flex-col gap-4">
          {stats.map((s) => (
            <Card key={s.label} className={`border-border/60 py-0 ${s.bg}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-1">
                    {s.icon} {s.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.sub}</p>
                </div>
                <span className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent readings table — lively */}
        <Card className="lg:col-span-2 border-border/60 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent readings</CardTitle>
                <CardDescription className="text-sm mt-0.5">Latest 7 sensor entries</CardDescription>
              </div>
              <Badge
                variant="outline"
                className="font-mono text-xs tracking-widest text-emerald-600 border-emerald-500/30 bg-emerald-500/5 flex items-center gap-1.5"
              >
                <Wifi className="w-3 h-3" />
                LIVE
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* column header */}
            <div className="grid grid-cols-[1fr_1fr_1.4fr_1.1fr_1fr] gap-x-6 px-6 py-2 border-b border-border/40 bg-muted/30">
              {["Time", "Temp", "Humidity", "Vibration", "Status"].map((h) => (
                <span key={h} className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {h}
                </span>
              ))}
            </div>

            {/* data rows */}
            <div className="divide-y divide-border/30">
              {recentReadings.map((r, i) => {
                const isNew = highlighted === r.id;
                return (
                  <div
                    key={r.id}
                    className={`grid grid-cols-[1fr_1fr_1.4fr_1.1fr_1fr] gap-x-6 items-center px-6 py-3
                      transition-colors duration-500
                      ${isNew ? "bg-emerald-500/5" : i % 2 === 0 ? "bg-transparent" : "bg-muted/10"}
                      hover:bg-muted/25`}
                  >
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {r.timestamp}
                    </span>
                    <TempCell value={r.temperature} />
                    <HumidityBar value={r.humidity} />
                    <VibCell value={r.vibration} />
                    <StatusCell status={r.status} />
                  </div>
                );
              })}
            </div>

            {/* live footer ticker */}
            <div className="flex items-center gap-2 px-6 py-2.5 border-t border-border/30 bg-muted/20">
              <PulsingDot color="bg-emerald-500" />
              <span className="font-mono text-xs text-muted-foreground">
                Node ESP32-A1 · polling every 5s
              </span>
              <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                {tick.toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}