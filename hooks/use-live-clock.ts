// hooks/use-live-clock.ts
import { useState, useEffect } from "react";

export function useLiveClock(locale = "en-PH") {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        // Set immediately on mount to avoid hydration mismatch
        setNow(new Date());

        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatted = now
        ? now.toLocaleString(locale, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
        : null;

    return { now, formatted };
}