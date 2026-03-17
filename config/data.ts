// app/data.ts
import { Reading, ChartPoint } from "@/type";
import { Home, FileText, Database, Activity, Bell, Settings } from "lucide-react";

// Chart data
export const chartData: ChartPoint[] = [
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

// Recent readings table
export const recentReadings: Reading[] = [
  { id: 1, timestamp: "15:02:34", temperature: 28.4, humidity: 62.1, vibration: 0.03, status: "normal" },
  { id: 2, timestamp: "15:01:34", temperature: 28.6, humidity: 62.5, vibration: 0.04, status: "normal" },
  { id: 3, timestamp: "15:00:34", temperature: 29.1, humidity: 63.8, vibration: 0.09, status: "warning" },
  { id: 4, timestamp: "14:59:34", temperature: 30.8, humidity: 66.2, vibration: 0.14, status: "warning" },
  { id: 5, timestamp: "14:58:34", temperature: 31.9, humidity: 68.4, vibration: 0.21, status: "critical" },
  { id: 6, timestamp: "14:57:34", temperature: 29.3, humidity: 64.1, vibration: 0.06, status: "normal" },
  { id: 7, timestamp: "14:56:34", temperature: 28.7, humidity: 62.9, vibration: 0.03, status: "normal" },
];


export const stats = [
  { label: "Avg Temp (24h)", value: "27.8°C", sub: "Within normal range", color: "text-orange-500" },
  { label: "Avg Humidity (24h)", value: "59.3%", sub: "Slightly elevated", color: "text-sky-500" },
  { label: "Peak Vibration", value: "0.21g", sub: "Today at 14:58", color: "text-violet-500" },
  { label: "Total Readings", value: "1,284", sub: "Since deployment", color: "text-emerald-500" },
];
