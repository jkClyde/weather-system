// lib/supabase/sensor-queries.ts
// All data fetching for the dashboard, history, and report pages.
// Use these in Server Components — they call createClient() from the server client.

import { createClient } from "@/lib/supabase/server";
import { ChartPoint, Reading, Status } from "@/type";

// ─── Helper — derive status from values ──────────────────────────────────────
function deriveStatus(temp: number, hum: number, vib: number): Status {
    if (vib > 0.18 || temp > 40 || hum > 85) return "critical";
    if (vib > 0.09 || temp > 30 || hum > 65) return "warning";
    return "normal";
}

// ─── Recent readings (last 7 rows) ───────────────────────────────────────────
// Replaces: recentReadings constant
export async function getRecentReadings(): Promise<Reading[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("sensor_readings")
        .select("id, created_at, temperature, humidity, vibration")
        .order("created_at", { ascending: false })
        .limit(7);

    if (error) throw new Error(error.message);

    return (data ?? []).map((r) => ({
        id: r.id,
        timestamp: new Date(r.created_at).toLocaleTimeString("en-PH", {
            hour: "2-digit", minute: "2-digit", second: "2-digit",
        }),
        temperature: Number(r.temperature),
        humidity: Number(r.humidity),
        vibration: Number(r.vibration),
        status: deriveStatus(Number(r.temperature), Number(r.humidity), Number(r.vibration)),
    }));
}

// ─── Chart data (today's readings grouped by 30-min bucket) ──────────────────
// Replaces: chartData constant
export async function getChartData(): Promise<ChartPoint[]> {
    const supabase = await createClient();

    // Pull today's readings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from("sensor_readings")
        .select("created_at, temperature, humidity, vibration")
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    if (!data?.length) return [];

    // Group into 30-minute buckets and average each bucket
    const buckets: Record<string, { temps: number[]; hums: number[]; vibs: number[] }> = {};

    for (const row of data) {
        const d = new Date(row.created_at);
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = d.getMinutes() < 30 ? "00" : "30";
        const key = `${hh}:${mm}`;

        if (!buckets[key]) buckets[key] = { temps: [], hums: [], vibs: [] };
        buckets[key].temps.push(Number(row.temperature));
        buckets[key].hums.push(Number(row.humidity));
        buckets[key].vibs.push(Number(row.vibration));
    }

    return Object.entries(buckets).map(([time, b]) => ({
        time,
        temperature: parseFloat((b.temps.reduce((s, v) => s + v, 0) / b.temps.length).toFixed(1)),
        humidity: parseFloat((b.hums.reduce((s, v) => s + v, 0) / b.hums.length).toFixed(1)),
        vibration: parseFloat((b.vibs.reduce((s, v) => s + v, 0) / b.vibs.length).toFixed(3)),
    }));
}

// ─── Stats cards ─────────────────────────────────────────────────────────────
// Replaces: stats constant
export async function getStats() {
    const supabase = await createClient();

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // 24h averages
    const { data: recent, error: e1 } = await supabase
        .from("sensor_readings")
        .select("temperature, humidity, vibration, created_at")
        .gte("created_at", since24h);

    if (e1) throw new Error(e1.message);

    // All-time count
    const { count, error: e2 } = await supabase
        .from("sensor_readings")
        .select("id", { count: "exact", head: true });

    if (e2) throw new Error(e2.message);

    const rows = recent ?? [];

    const avgTemp = rows.length
        ? (rows.reduce((s, r) => s + Number(r.temperature), 0) / rows.length).toFixed(1)
        : "—";

    const avgHum = rows.length
        ? (rows.reduce((s, r) => s + Number(r.humidity), 0) / rows.length).toFixed(1)
        : "—";

    const peakVib = rows.length
        ? Math.max(...rows.map((r) => Number(r.vibration))).toFixed(2)
        : "—";

    const peakVibRow = rows.length
        ? rows.reduce((max, r) => Number(r.vibration) > Number(max.vibration) ? r : max, rows[0])
        : null;

    const peakTime = peakVibRow
        ? new Date(peakVibRow.created_at).toLocaleTimeString("en-PH", {
            hour: "2-digit", minute: "2-digit",
        })
        : null;

    return [
        {
            label: "Avg Temp (24h)",
            value: avgTemp === "—" ? "—" : `${avgTemp}°C`,
            sub: "Past 24 hours",
            color: "text-orange-500",
            icon: "🌡️",
            bg: "bg-orange-50",
        },
        {
            label: "Avg Humidity (24h)",
            value: avgHum === "—" ? "—" : `${avgHum}%`,
            sub: "Past 24 hours",
            color: "text-sky-500",
            icon: "💧",
            bg: "bg-sky-50",
        },
        {
            label: "Peak Vibration",
            value: peakVib === "—" ? "—" : `${peakVib}g`,
            sub: peakTime ? `Today at ${peakTime}` : "No data today",
            color: "text-violet-500",
            icon: "⚡",
            bg: "bg-violet-50",
        },
        {
            label: "Total Readings",
            value: count != null ? count.toLocaleString() : "—",
            sub: "Since deployment",
            color: "text-emerald-500",
            icon: "📊",
            bg: "bg-emerald-50",
        },
    ];
}

// ─── History page — paginated raw readings ────────────────────────────────────
export async function getHistoryReadings(opts?: {
    date?: string;       // e.g. "2025-03-22"
    status?: Status;
    deviceId?: string;
    page?: number;
    perPage?: number;
}) {
    const supabase = await createClient();
    const page = opts?.page ?? 1;
    const perPage = opts?.perPage ?? 15;
    const from = (page - 1) * perPage;

    let query = supabase
        .from("sensor_readings")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, from + perPage - 1);

    if (opts?.date) {
        const start = new Date(opts.date);
        const end = new Date(opts.date);
        end.setDate(end.getDate() + 1);
        query = query.gte("created_at", start.toISOString()).lt("created_at", end.toISOString());
    }

    if (opts?.deviceId) query = query.eq("device_id", opts.deviceId);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    const rows = (data ?? []).map((r) => {
        const temp = Number(r.temperature);
        const hum = Number(r.humidity);
        const vib = Number(r.vibration);
        const status = deriveStatus(temp, hum, vib);

        // Filter by status client-side since Supabase can't compute derived columns
        return {
            id: r.id,
            date: new Date(r.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
            timestamp: new Date(r.created_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            temperature: temp,
            humidity: hum,
            vibration: vib,
            status,
            device: r.device_id,
            location: r.location,
            notes: r.notes ?? "",
            source: r.source as "esp32" | "manual",
        };
    }).filter((r) => !opts?.status || r.status === opts.status);

    return { rows, total: count ?? 0 };
}

// ─── Insert a manual reading ──────────────────────────────────────────────────
// Use this in a Server Action from the data-input page
export async function insertReading(payload: {
    temperature: number;
    humidity: number;
    vibration: number;
    deviceId: string;
    location: string;
    notes?: string;
    source: "esp32" | "manual";
    timestamp?: string; // ISO string — if omitted, DB uses now()
}) {
    const supabase = await createClient();

    const { error } = await supabase.from("sensor_readings").insert({
        temperature: payload.temperature,
        humidity: payload.humidity,
        vibration: payload.vibration,
        device_id: payload.deviceId,
        location: payload.location,
        notes: payload.notes ?? null,
        source: payload.source,
        ...(payload.timestamp ? { created_at: payload.timestamp } : {}),
    });

    if (error) throw new Error(error.message);
}