// app/page.tsx
"use client";

import * as React from "react";
import {
  Activity,
  Bell,
  Database,
  FileText,
  Home,
  Settings,
  Thermometer,
  Wind,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = "normal" | "warning" | "critical";

interface Reading {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  vibration: number;
  status: Status;
}

interface ChartPoint {
  time: string;
  temperature: number;
  humidity: number;
  vibration: number;
}
// ─── Dummy Data ───────────────────────────────────────────────────────────────

const chartData: ChartPoint[] = [
  { time: "08:00", temperature: 26.1, humidity: 58.2, vibration: 0.02 },
  { time: "08:30", temperature: 26.8, humidity: 59.0, vibration: 0.03 },
  { time: "09:00", temperature: 27.3, humidity: 60.1, vibration: 0.02 },
  { time: "09:30", temperature: 27.9, humidity: 61.4, vibration: 0.05 },
  { time: "10:00", temperature: 28.4, humidity: 62.0, vibration: 0.04 },
  { time: "10:30", temperature: 29.1, humidity: 63.5, vibration: 0.08 },
  { time: "11:00", temperature: 29.8, humidity: 64.2, vibration: 0.06 },
  { time: "11:30", temperature: 30.2, humidity: 65.8, vibration: 0.12 },
  { time: "12:00", temperature: 30.9, humidity: 66.1, vibration: 0.09 },
  { time: "12:30", temperature: 31.4, humidity: 67.3, vibration: 0.07 },
  { time: "13:00", temperature: 30.8, humidity: 66.9, vibration: 0.04 },
  { time: "13:30", temperature: 29.5, humidity: 65.2, vibration: 0.03 },
  { time: "14:00", temperature: 28.9, humidity: 63.8, vibration: 0.02 },
  { time: "14:30", temperature: 28.4, humidity: 62.1, vibration: 0.03 },
  { time: "15:00", temperature: 28.2, humidity: 61.5, vibration: 0.02 },
];

const recentReadings: Reading[] = [
  { id: 1, timestamp: "15:02:34", temperature: 28.4, humidity: 62.1, vibration: 0.03, status: "normal" },
  { id: 2, timestamp: "15:01:34", temperature: 28.6, humidity: 62.5, vibration: 0.04, status: "normal" },
  { id: 3, timestamp: "15:00:34", temperature: 29.1, humidity: 63.8, vibration: 0.09, status: "warning" },
  { id: 4, timestamp: "14:59:34", temperature: 30.8, humidity: 66.2, vibration: 0.14, status: "warning" },
  { id: 5, timestamp: "14:58:34", temperature: 31.9, humidity: 68.4, vibration: 0.21, status: "critical" },
  { id: 6, timestamp: "14:57:34", temperature: 29.3, humidity: 64.1, vibration: 0.06, status: "normal" },
  { id: 7, timestamp: "14:56:34", temperature: 28.7, humidity: 62.9, vibration: 0.03, status: "normal" },
];

// ─── Nav Items ────────────────────────────────────────────────────────────────

const navMain = [
  { title: "Overview", icon: Home, isActive: true },
  { title: "Data Input", icon: FileText, isActive: false },
  { title: "History", icon: Database, isActive: false },
  { title: "Reports", icon: Activity, isActive: false },
];

const navSettings = [
  { title: "Alerts", icon: Bell, isActive: false },
  { title: "Settings", icon: Settings, isActive: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; className: string }> = {
    normal: { label: "Normal", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    warning: { label: "Warning", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    critical: { label: "Critical", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={`text-[12px] font-oxygen tracking-wide p-3.75 ${className}`}>
      {label}
    </Badge>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-red-500" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

interface SensorCardProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  trend: "up" | "down" | "stable";
  trendLabel: string;
  status: Status;
  accentClass: string;
  iconBgClass: string;
}

function SensorCard({
  label, value, unit, icon: Icon, trend, trendLabel, status, accentClass, iconBgClass,
}: SensorCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/10 hover:from-muted/5 hover:to-muted/20 group">
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentClass} group-hover:h-[3px] transition-all duration-300`} />
      <CardHeader className="pb-2 pt-5 flex justify-between items-center">
      
        <CardDescription className="font-oxygen text-[14px] tracking-widest uppercase text-[#000A12] font-light">
          {label}
        </CardDescription>
          <div className="flex items-center justify-between">
          <StatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">{value}</span>
              <span className="text-lg text-muted-foreground mb-1">{unit}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendIcon trend={trend} />
              <span className="text-xs text-muted-foreground">{trendLabel}</span>
            </div>
          </div>

           <div className={`p-2 rounded-lg ${iconBgClass} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-xs font-mono">
      <p className="text-muted-foreground mb-2 tracking-wide">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
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

      {/* Chart */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Sensor readings over time</CardTitle>
              <CardDescription className="text-xs mt-0.5">Today, 08:00 – 15:00</CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] tracking-widest text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
              REALTIME
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }} />
              <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f97316" strokeWidth={1.5} fill="url(#colorTemp)" dot={false} />
              <Area type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#38bdf8" strokeWidth={1.5} fill="url(#colorHum)" dot={false} />
              <Area type="monotone" dataKey="vibration" name="Vibration (g)" stroke="#a78bfa" strokeWidth={1.5} fill="url(#colorVib)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stats + Table row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary stats */}
        <div className="flex flex-col gap-4">
          {[
            { label: "Avg Temp (24h)", value: "27.8°C", sub: "Within normal range", color: "text-orange-500" },
            { label: "Avg Humidity (24h)", value: "59.3%", sub: "Slightly elevated", color: "text-sky-500" },
            { label: "Peak Vibration", value: "0.21g", sub: "Today at 14:58", color: "text-violet-500" },
            { label: "Total Readings", value: "1,284", sub: "Since deployment", color: "text-emerald-500" },
          ].map((s) => (
            <Card key={s.label} className="border-border/60 py-0">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-[11px] font-mono text-muted-foreground tracking-widest uppercase">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
                <span className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent readings table */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recent readings</CardTitle>
                <CardDescription className="text-xs mt-0.5">Latest 7 sensor entries</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] tracking-widest">
                AUTO-REFRESH
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="font-mono text-[10px] tracking-widest pl-6">Time</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest">Temp</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest">Humidity</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest">Vibration</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReadings.map((r) => (
                  <TableRow key={r.id} className="border-border/40 hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-muted-foreground pl-6">
                      {r.timestamp}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-orange-500">{r.temperature}°C</TableCell>
                    <TableCell className="font-mono text-xs text-sky-500">{r.humidity}%</TableCell>
                    <TableCell className="font-mono text-xs text-violet-500">{r.vibration}g</TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}