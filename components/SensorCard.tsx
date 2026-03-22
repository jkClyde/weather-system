"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Status } from "@/type";
import { SensorCardProps } from "@/type";
import { SceneFreezing, SceneCold, SceneOvercast, SceneSunny, ScenePartlyCloudy, SceneHot, SceneDry, SceneRainy, SceneVeryHumid, SceneVibStable, SceneVibLow, SceneVibMed, SceneVibHigh } from "@/config/scenes";
import { TrendIcon } from "./trendIcon";

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; className: string }> = {
    normal: { label: "Normal", className: "bg-white/20 text-white border-white/30 font-medium backdrop-blur-sm" },
    warning: { label: "Warning", className: "bg-amber-400/20 text-amber-100 border-amber-300/40 font-medium backdrop-blur-sm" },
    critical: { label: "Critical", className: "bg-red-400/20 text-red-100 border-red-300/40 font-medium backdrop-blur-sm" },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={`text-[14px] p-3.75 ${className}`}>
      {label}
    </Badge>
  );
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

type CardType = "temperature" | "humidity" | "vibration";

function getCardType(label: string): CardType {
  const l = label.toLowerCase();
  if (l.includes("temp")) return "temperature";
  if (l.includes("hum")) return "humidity";
  return "vibration";
}

function getScene(type: CardType, v: number): React.ReactNode {
  if (type === "temperature") {
    if (v < 0) return <SceneFreezing />;
    if (v < 12) return <SceneCold />;
    if (v < 22) return <SceneOvercast />;
    if (v < 30) return <SceneSunny />;
    if (v < 37) return <ScenePartlyCloudy />;
    return <SceneHot />;
  }
  if (type === "humidity") {
    if (v < 30) return <SceneDry />;
    if (v < 60) return <SceneSunny />;
    if (v < 78) return <SceneRainy />;
    return <SceneVeryHumid />;
  }
  if (v < 0.05) return <SceneVibStable />;
  if (v < 0.3) return <SceneVibLow />;
  if (v < 0.8) return <SceneVibMed />;
  return <SceneVibHigh />;
}

function getStateLabel(type: CardType, v: number): string {
  if (type === "temperature") {
    if (v < 0) return "Freezing";
    if (v < 12) return "Cold";
    if (v < 22) return "Cool";
    if (v < 30) return "Comfortable";
    if (v < 37) return "Warm";
    return "Hot";
  }
  if (type === "humidity") {
    if (v < 30) return "Too Dry";
    if (v < 60) return "Comfortable";
    if (v < 78) return "Humid";
    return "Very Humid";
  }
  if (v < 0.05) return "Stable";
  if (v < 0.3) return "Low";
  if (v < 0.8) return "Moderate";
  return "High Alert";
}


function getCardGradient(type: CardType, v: number): string {
  if (type === "temperature") {
    if (v < 0) return "from-blue-900  via-blue-700   to-sky-500";
    if (v < 12) return "from-sky-800   via-sky-600    to-cyan-400";
    if (v < 22) return "from-cyan-800  via-sky-600    to-blue-400";
    if (v < 30) return "from-sky-600   via-sky-400    to-blue-300";
    if (v < 37) return "from-blue-600  via-sky-500    to-cyan-300";
    return "from-blue-700  via-blue-500   to-sky-400";
  }
  if (type === "humidity") {
    if (v < 30) return "from-amber-700  via-yellow-500  to-amber-300";
    if (v < 60) return "from-teal-700   via-emerald-500 to-green-300";
    if (v < 78) return "from-blue-800   via-blue-600    to-sky-400";
    return "from-blue-950   via-blue-800   to-blue-600";
  }
  if (v < 0.05) return "from-emerald-800 via-emerald-600 to-green-400";
  if (v < 0.3) return "from-lime-800    via-lime-600    to-green-400";
  if (v < 0.8) return "from-amber-800   via-amber-600   to-yellow-400";
  return "from-red-900     via-red-700     to-rose-500";
}

// ─── SensorCard ───────────────────────────────────────────────────────────────


export function SensorCard({
  label, value, unit, trend, trendLabel, status,
}: SensorCardProps) {
  const numVal = parseFloat(value);
  const cardType = getCardType(label);
  const gradient = getCardGradient(cardType, numVal);
  const stateLabel = getStateLabel(cardType, numVal);
  const scene = getScene(cardType, numVal);

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${gradient}
        shadow-lg hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300 group
        min-h-[176px]
      `}
    >
      <div className="absolute inset-0 opacity-75 group-hover:opacity-85 transition-opacity duration-500">
        {scene}
      </div>

      {/* Bottom-to-top fade so text stays legible regardless of illustration brightness */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full min-h-[176px] p-4">

        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/65 select-none">
            {label}
          </span>
          <StatusBadge status={status} />
        </div>

        {/* Push value to bottom */}
        <div className="flex-1" />

        {/* Value row */}
        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-[2.6rem] leading-none font-bold tracking-tight text-white drop-shadow">
            {value}
          </span>
          <span className="text-xl font-medium text-white/70 mb-0.5">
            {unit}
          </span>
        </div>

        {/* Trend + state label */}
        <div className="flex items-center justify-between mt-1.5 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <TrendIcon trend={trend} />
            <span className="text-[11px] text-white/60 font-medium truncate">
              {trendLabel}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-white/50 tracking-wide shrink-0">
            {stateLabel}
          </span>
        </div>
      </div>
    </div>
  );
}