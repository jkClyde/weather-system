import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
    if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-white/70" />;
    if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-white/70" />;
    return <Minus className="w-3.5 h-3.5 text-white/50" />;
}