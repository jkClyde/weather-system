// app/components/SensorCard.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Status } from "@/type";

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; className: string }> = {
    normal: { label: "Normal", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    warning: { label: "Warning", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    critical: { label: "Critical", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  };
  const { label, className } = map[status];
  return <Badge variant="outline" className={`text-[12px] font-oxygen tracking-wide p-3.75 ${className}`}>{label}</Badge>;
}

export function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-red-500" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
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
    <Card className="relative overflow-hidden border-border/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-background via-background to-muted/10 hover:from-muted/5 hover:to-muted/20 group">
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentClass} group-hover:h-[3px] transition-all duration-300`} />
      <CardHeader className="pb-2 pt-5 flex justify-between items-center">
        <CardDescription className="font-oxygen text-[14px] tracking-widest uppercase text-[#000A12] font-light">{label}</CardDescription>
        <div className="flex items-center justify-between"><StatusBadge status={status} /></div>
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