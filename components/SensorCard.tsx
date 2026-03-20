import * as React from "react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Status } from "@/type";

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; className: string }> = {
    normal: { label: "Normal", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 font-medium" },
    warning: { label: "Warning", className: "bg-amber-500/10 text-amber-700 border-amber-500/30 font-medium" },
    critical: { label: "Critical", className: "bg-red-500/10 text-red-700 border-red-500/30 font-medium" },
  };
  const { label, className } = map[status];
  return <Badge variant="outline" className={`text-[11px] px-2.5 py-0.5 ${className}`}>{label}</Badge>;
}

export function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-red-500" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
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

export function SensorCard({
  label, value, unit, icon: Icon, trend, trendLabel, status, accentClass, iconBgClass,
}: SensorCardProps) {
  return (
    <Card className="relative overflow-hidden border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentClass}`} />
      
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between">
          <CardDescription className="text-xs font-medium tracking-wide uppercase text-slate-600">
            {label}
          </CardDescription>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      
      <CardContent className="pb-5">
        <div className="flex items-end justify-between">
          {/* Value section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-slate-900 group-hover:scale-105 transition-transform duration-300">
                {value}
              </span>
              <span className="text-lg font-medium text-slate-500">
                {unit}
              </span>
            </div>
            
            {/* Trend indicator */}
            <div className="flex items-center gap-1.5">
              <TrendIcon trend={trend} />
              <span className="text-xs text-slate-600 font-medium">
                {trendLabel}
              </span>
            </div>
          </div>
          
          {/* Icon section */}
          <div className={`p-3 rounded-xl ${iconBgClass} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}