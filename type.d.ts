// app/types.ts
export type Status = "normal" | "warning" | "critical";

export interface Reading {
  id: number;
  timestamp: string;
  temperature: number;
  humidity: number;
  vibration: number;
  status: Status;
}

export interface ChartPoint {
  time: string;
  temperature: number;
  humidity: number;
  vibration: number;
}

export interface SensorCardProps {
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
