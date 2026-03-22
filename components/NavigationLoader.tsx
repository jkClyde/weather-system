"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Gauge } from "lucide-react";

export function NavigationLoader() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [prevPath, setPrevPath] = useState(pathname);

    useEffect(() => {
        if (pathname !== prevPath) {
            // Path changed — hide the loader
            setLoading(false);
            setPrevPath(pathname);
        }
    }, [pathname, prevPath]);

    // Expose a global trigger so nav links can start the loader
    useEffect(() => {
        (window as any).__startNavLoader = () => setLoading(true);
        return () => { delete (window as any).__startNavLoader; };
    }, []);

    if (!loading) return null;

    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center "
            style={{ background: "rgba(31, 38, 62, 0.55)", backdropFilter: "blur(1px)" }}
        >
            <div className="flex flex-col items-center gap-4">
                {/* Spinning logo */}
                <div className="relative w-16 h-16">
                    {/* Outer spinning ring */}
                    <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 64 64">
                        <circle
                            cx="32" cy="32" r="28"
                            fill="none"
                            stroke="rgba(255,255,255,0.12)"
                            strokeWidth="4"
                        />
                        <circle
                            cx="32" cy="32" r="28"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="44 132"
                        />
                    </svg>
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                            <Gauge className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <p className="text-sm font-semibold text-white">Loading</p>
                    <p className="text-xs text-white/50 font-mono">SensorGrid</p>
                </div>

                {/* Animated dots */}
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}