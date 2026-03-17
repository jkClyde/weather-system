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