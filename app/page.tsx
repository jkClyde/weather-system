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
    <div className="flex flex-col gap-6 p-0 md:p-6 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Page title */}
      <div className="px-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sensor Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1.5">
          Real-time monitoring • ESP32 active • Last update: 2 seconds ago
        </p>
      </div>

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Sensor cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
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

        {/* Right column - Chart and Stats */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Area Chart */}
          <Card className="border-slate-200 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Sensor Readings Over Time
                  </CardTitle>
                  <CardDescription className="text-sm mt-1.5 text-slate-600">
                    Today, 08:00 – 15:00
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] tracking-widest text-emerald-600 border-emerald-500/30 bg-emerald-500/5 px-3 py-1"
                >
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: 11 }} 
                    iconType="circle"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    name="Temp (°C)" 
                    stroke="#f97316" 
                    strokeWidth={2} 
                    fill="url(#colorTemp)" 
                    dot={false} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="humidity" 
                    name="Humidity (%)" 
                    stroke="#38bdf8" 
                    strokeWidth={2} 
                    fill="url(#colorHum)" 
                    dot={false} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="vibration" 
                    name="Vibration (g)" 
                    stroke="#a78bfa" 
                    strokeWidth={2} 
                    fill="url(#colorVib)" 
                    dot={false} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stats cards - 2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <Card 
                key={s.label} 
                className="border-slate-200 shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        {s.label}
                      </p>
                      <p className={`text-2xl font-bold ${s.color} mt-1`}>
                        {s.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
                    </div>
                    <div className="text-2xl opacity-80">
                      {s.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Recent readings table - full width */}
      <Card className="border-slate-200 shadow-lg bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Recent Readings
              </CardTitle>
              <CardDescription className="text-sm mt-1.5 text-slate-600">
                Latest 7 sensor entries
              </CardDescription>
            </div>
            <Badge 
              variant="outline" 
              className="font-mono text-[10px] tracking-widest text-slate-600 border-slate-300 px-3 py-1"
            >
              AUTO-REFRESH
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 bg-slate-50">
                <TableHead className="font-medium text-xs text-slate-700 pl-6">Time</TableHead>
                <TableHead className="font-medium text-xs text-slate-700">Temperature</TableHead>
                <TableHead className="font-medium text-xs text-slate-700">Humidity</TableHead>
                <TableHead className="font-medium text-xs text-slate-700">Vibration</TableHead>
                <TableHead className="font-medium text-xs text-slate-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReadings.map((r) => (
                <TableRow 
                  key={r.id} 
                  className="border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-mono text-sm text-slate-600 pl-6">
                    {r.timestamp}
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-orange-600">
                    {r.temperature}°C
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-sky-600">
                    {r.humidity}%
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-violet-600">
                    {r.vibration}g
                  </TableCell>
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
  );
}