"use client";

import { useState } from "react";
import { Thermometer, Wind, Zap, Download, Search, Calendar, Filter, TrendingUp, AlertTriangle, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock historical data
const generateHistoricalData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  for (let i = 0; i < 168; i++) { // 7 days of hourly data
    const date = new Date(startDate);
    date.setHours(date.getHours() + i);
    
    data.push({
      id: i + 1,
      timestamp: date.toISOString(),
      temperature: (25 + Math.random() * 8).toFixed(1),
      humidity: (55 + Math.random() * 20).toFixed(1),
      vibration: (0.02 + Math.random() * 0.15).toFixed(2),
      status: Math.random() > 0.85 ? "warning" : Math.random() > 0.95 ? "critical" : "normal",
      nodeId: "ESP32-001",
    });
  }
  return data;
};

const historicalData = generateHistoricalData();

// Generate chart data (daily averages)
const generateChartData = (data: any[]) => {
  const dailyData: { [key: string]: { temp: number[], hum: number[], vib: number[], count: number } } = {};
  
  data.forEach(reading => {
    const date = new Date(reading.timestamp).toLocaleDateString();
    if (!dailyData[date]) {
      dailyData[date] = { temp: [], hum: [], vib: [], count: 0 };
    }
    dailyData[date].temp.push(parseFloat(reading.temperature));
    dailyData[date].hum.push(parseFloat(reading.humidity));
    dailyData[date].vib.push(parseFloat(reading.vibration));
    dailyData[date].count++;
  });

  return Object.keys(dailyData).map(date => ({
    date: date,
    temperature: (dailyData[date].temp.reduce((a, b) => a + b, 0) / dailyData[date].count).toFixed(1),
    humidity: (dailyData[date].hum.reduce((a, b) => a + b, 0) / dailyData[date].count).toFixed(1),
    vibration: (dailyData[date].vib.reduce((a, b) => a + b, 0) / dailyData[date].count).toFixed(2),
  }));
};

export default function HistoryPage() {
  const [dateRange, setDateRange] = useState("7days");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Filter data based on selections
  const filteredData = historicalData.filter(reading => {
    const statusMatch = statusFilter === "all" || reading.status === statusFilter;
    const searchMatch = searchQuery === "" || 
      reading.nodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reading.timestamp.includes(searchQuery);
    return statusMatch && searchMatch;
  });

  const chartData = generateChartData(filteredData);

  // Calculate statistics
  const stats = {
    temperature: {
      min: Math.min(...filteredData.map(r => parseFloat(r.temperature))).toFixed(1),
      max: Math.max(...filteredData.map(r => parseFloat(r.temperature))).toFixed(1),
      avg: (filteredData.reduce((sum, r) => sum + parseFloat(r.temperature), 0) / filteredData.length).toFixed(1),
    },
    humidity: {
      min: Math.min(...filteredData.map(r => parseFloat(r.humidity))).toFixed(1),
      max: Math.max(...filteredData.map(r => parseFloat(r.humidity))).toFixed(1),
      avg: (filteredData.reduce((sum, r) => sum + parseFloat(r.humidity), 0) / filteredData.length).toFixed(1),
    },
    vibration: {
      min: Math.min(...filteredData.map(r => parseFloat(r.vibration))).toFixed(2),
      max: Math.max(...filteredData.map(r => parseFloat(r.vibration))).toFixed(2),
      avg: (filteredData.reduce((sum, r) => sum + parseFloat(r.vibration), 0) / filteredData.length).toFixed(2),
    },
  };

  // Event summary
  const eventSummary = {
    critical: filteredData.filter(r => r.status === "critical").length,
    warning: filteredData.filter(r => r.status === "warning").length,
    normal: filteredData.filter(r => r.status === "normal").length,
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Timestamp", "Node ID", "Temperature (°C)", "Humidity (%)", "Vibration (g)", "Status"];
    const csvData = filteredData.map(r => [
      new Date(r.timestamp).toLocaleString(),
      r.nodeId,
      r.temperature,
      r.humidity,
      r.vibration,
      r.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sensor-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <Badge
      variant="outline"
      className={`text-xs font-mono ${
        status === "critical"
          ? "border-red-500/30 bg-red-500/5 text-red-600"
          : status === "warning"
          ? "border-amber-500/30 bg-amber-500/5 text-amber-600"
          : "border-emerald-500/30 bg-emerald-500/5 text-emerald-600"
      }`}
    >
      {status.toUpperCase()}
    </Badge>
  );

  return (
    <div className="flex flex-col gap-5 p-0 md:p-5 overflow-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="text-base text-muted-foreground mt-1">
          View and analyze historical sensor data
        </p>
      </div>

      {/* Filters and controls */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Date range selector */}
            <div className="space-y-1.5">
              <Label htmlFor="dateRange" className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                Date Range
              </Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="dateRange" className="font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status filter */}
            <div className="space-y-1.5">
              <Label htmlFor="statusFilter" className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="statusFilter" className="font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Metric filter */}
            <div className="space-y-1.5">
              <Label htmlFor="metricFilter" className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                Metric
              </Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger id="metricFilter" className="font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metrics</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="vibration">Vibration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-1.5">
              <Label htmlFor="search" className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Node ID, date..."
                  className="pl-9 font-mono text-sm"
                />
              </div>
            </div>

            {/* Export button */}
            <div className="space-y-1.5">
              <Label className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
                Export
              </Label>
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="w-full font-mono text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Event Summary */}
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-mono tracking-wider uppercase text-muted-foreground">Events</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Critical</span>
                <span className="text-base font-bold font-mono text-red-600">{eventSummary.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Warning</span>
                <span className="text-base font-bold font-mono text-amber-600">{eventSummary.warning}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Normal</span>
                <span className="text-base font-bold font-mono text-emerald-600">{eventSummary.normal}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Stats */}
        <Card className="border-border/60 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <p className="text-sm font-mono tracking-wider uppercase text-muted-foreground">Temperature</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Min</span>
                <span className="text-base font-bold font-mono text-orange-600">{stats.temperature.min}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg</span>
                <span className="text-base font-bold font-mono text-orange-600">{stats.temperature.avg}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Max</span>
                <span className="text-base font-bold font-mono text-orange-600">{stats.temperature.max}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Humidity Stats */}
        <Card className="border-border/60 bg-sky-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="h-4 w-4 text-sky-500" />
              <p className="text-sm font-mono tracking-wider uppercase text-muted-foreground">Humidity</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Min</span>
                <span className="text-base font-bold font-mono text-sky-600">{stats.humidity.min}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg</span>
                <span className="text-base font-bold font-mono text-sky-600">{stats.humidity.avg}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Max</span>
                <span className="text-base font-bold font-mono text-sky-600">{stats.humidity.max}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vibration Stats */}
        <Card className="border-border/60 bg-violet-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-violet-500" />
              <p className="text-sm font-mono tracking-wider uppercase text-muted-foreground">Vibration</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Min</span>
                <span className="text-base font-bold font-mono text-violet-600">{stats.vibration.min}g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg</span>
                <span className="text-base font-bold font-mono text-violet-600">{stats.vibration.avg}g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Max</span>
                <span className="text-base font-bold font-mono text-violet-600">{stats.vibration.max}g</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Chart */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Sensor Trends</CardTitle>
              <CardDescription className="text-sm mt-1">
                Daily averages over selected period
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-[11px] tracking-widest text-blue-600 border-blue-500/30 bg-blue-500/5"
            >
              {filteredData.length} READINGS
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fontFamily: "monospace" }} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fontFamily: "monospace" }} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "monospace" }} />
              {(selectedMetric === "all" || selectedMetric === "temperature") && (
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temp (°C)" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "humidity") && (
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  name="Humidity (%)" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "vibration") && (
                <Line 
                  type="monotone" 
                  dataKey="vibration" 
                  name="Vibration (g)" 
                  stroke="#a78bfa" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Historical Data</CardTitle>
              <CardDescription className="text-sm mt-1">
                Showing {filteredData.length} of {historicalData.length} total readings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="border-border/60">
                  <TableHead className="font-mono text-xs tracking-widest pl-6">Timestamp</TableHead>
                  <TableHead className="font-mono text-xs tracking-widest">Node</TableHead>
                  <TableHead className="font-mono text-xs tracking-widest">Temp</TableHead>
                  <TableHead className="font-mono text-xs tracking-widest">Humidity</TableHead>
                  <TableHead className="font-mono text-xs tracking-widest">Vibration</TableHead>
                  <TableHead className="font-mono text-xs tracking-widest">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.slice(0, 50).map((reading) => (
                  <TableRow key={reading.id} className="border-border/40 hover:bg-muted/30">
                    <TableCell className="font-mono text-sm text-muted-foreground pl-6">
                      {new Date(reading.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{reading.nodeId}</TableCell>
                    <TableCell className="font-mono text-sm text-orange-500">{reading.temperature}°C</TableCell>
                    <TableCell className="font-mono text-sm text-sky-500">{reading.humidity}%</TableCell>
                    <TableCell className="font-mono text-sm text-violet-500">{reading.vibration}g</TableCell>
                    <TableCell>
                      <StatusBadge status={reading.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredData.length > 50 && (
            <div className="p-4 text-center border-t border-border/40">
              <p className="text-sm text-muted-foreground">
                Showing first 50 of {filteredData.length} results. Use filters to narrow down or export all data.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}