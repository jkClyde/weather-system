"use client";

import * as React from "react";
import { Thermometer, Wind, Zap } from "lucide-react";
import { SensorCard, StatusBadge } from "@/components/SensorCard";
import CustomTooltip from "@/components/CustomToolTip";
import { recentReadings, stats, chartData } from "@/config/data";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

      {/* Area Chart */}
      {/* <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Sensor readings over time</CardTitle>
              <CardDescription className="text-xs mt-0.5">Today, 08:00 – 15:00</CardDescription>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-[10px] tracking-widest text-emerald-600 border-emerald-500/30 bg-emerald-500/5"
            >
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
      </Card> */}

      {/* Stats + Table row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary stats */}
        <div className="flex flex-col gap-4">
          {stats.map((s) => (
            <Card key={s.label} className={`border-border/60 py-0 ${s.bg}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-1">
                  <p className={`text-[11px] font-mono text-muted-foreground tracking-widest uppercase flex items-center gap-1`}>
                    {s.icon} {s.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
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
                    <TableCell className="font-mono text-xs text-muted-foreground pl-6">{r.timestamp}</TableCell>
                    <TableCell className="font-mono text-xs text-orange-500">{r.temperature}°C</TableCell>
                    <TableCell className="font-mono text-xs text-sky-500">{r.humidity}%</TableCell>
                    <TableCell className="font-mono text-xs text-violet-500">{r.vibration}g</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
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