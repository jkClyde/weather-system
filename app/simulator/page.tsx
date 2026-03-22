"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Thermometer, Droplets, Activity, Cpu, MapPin,
    Play, Square, Settings, RefreshCw, Zap,
    CheckCircle2, AlertTriangle, Clock, Database,
} from "lucide-react";
import { Status } from "@/type";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SimConfig {
    interval: number;   // seconds
    deviceId: string;
    location: string;
    tempBase: number;
    tempNoise: number;
    humBase: number;
    humNoise: number;
    vibBase: number;
    vibSpike: boolean;  // randomly spike vibration
}

interface SimReading {
    id: number;
    timestamp: string;
    temperature: number;
    humidity: number;
    vibration: number;
    status: Status;
    saved: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function deriveStatus(t: number, h: number, v: number): Status {
    if (v > 0.18 || t > 40 || h > 85) return "critical";
    if (v > 0.09 || t > 30 || h > 65) return "warning";
    return "normal";
}

function generateReading(cfg: SimConfig) {
    const noise = (n: number) => (Math.random() - 0.5) * 2 * n;
    const temp = parseFloat((cfg.tempBase + noise(cfg.tempNoise)).toFixed(1));
    const hum = parseFloat((cfg.humBase + noise(cfg.humNoise)).toFixed(1));
    const vib = cfg.vibSpike && Math.random() < 0.1
        ? parseFloat((0.12 + Math.random() * 0.12).toFixed(3))
        : parseFloat((cfg.vibBase + Math.random() * 0.04).toFixed(3));
    return { temperature: temp, humidity: hum, vibration: vib };
}

function StatusBadge({ status }: { status: Status }) {
    const map: Record<Status, { dot: string; pill: string; label: string }> = {
        normal: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Normal" },
        warning: { dot: "bg-amber-500", pill: "bg-amber-50   text-amber-700   border-amber-200", label: "Warning" },
        critical: { dot: "bg-red-500", pill: "bg-red-50     text-red-700     border-red-200", label: "Critical" },
    };
    const { dot, pill, label } = map[status];
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}

// ─── Gauge bar ────────────────────────────────────────────────────────────────
function GaugeBar({ value, min, max, color, label, unit }: {
    value: number; min: number; max: number;
    color: string; label: string; unit: string;
}) {
    const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{label}</span>
                <span className={`text-2xl font-bold font-mono ${color}`}>
                    {value}<span className="text-sm font-normal text-muted-foreground ml-0.5">{unit}</span>
                </span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color.replace("text-", "bg-")}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ─── Countdown ring ───────────────────────────────────────────────────────────
function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
    const r = 20;
    const circ = 2 * Math.PI * r;
    const pct = seconds / total;
    const dash = circ * pct;

    return (
        <svg width="52" height="52" className="-rotate-90">
            <circle cx="26" cy="26" r={r} fill="none" stroke="var(--border)" strokeWidth="3.5" />
            <circle cx="26" cy="26" r={r} fill="none"
                stroke="#0ea5e9" strokeWidth="3.5"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                className="transition-all duration-1000" />
        </svg>
    );
}

const INTERVALS = [
    { label: "5 sec", value: 5 },
    { label: "15 sec", value: 15 },
    { label: "30 sec", value: 30 },
    { label: "1 min", value: 60 },
    { label: "2 min", value: 120 },
    { label: "5 min", value: 300 },
];

const DEFAULT_CONFIG: SimConfig = {
    interval: 60,
    deviceId: "ESP32-001",
    location: "Server Room A",
    tempBase: 28,
    tempNoise: 2,
    humBase: 62,
    humNoise: 3,
    vibBase: 0.03,
    vibSpike: true,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SimulatorPage() {
    const [running, setRunning] = useState(false);
    const [cfg, setCfg] = useState<SimConfig>(DEFAULT_CONFIG);
    const [readings, setReadings] = useState<SimReading[]>([]);
    const [countdown, setCountdown] = useState(0);
    const [totalSent, setTotalSent] = useState(0);
    const [lastError, setLastError] = useState<string | null>(null);
    const [nextId, setNextId] = useState(1);
    const [showCfg, setShowCfg] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const countRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef(0);

    // Insert one reading into Supabase
    const insertReading = useCallback(async () => {
        const raw = generateReading(cfg);
        const status = deriveStatus(raw.temperature, raw.humidity, raw.vibration);
        const id = nextId;
        setNextId(n => n + 1);

        const pending: SimReading = {
            id,
            timestamp: new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            ...raw, status, saved: false,
        };
        setReadings(prev => [pending, ...prev].slice(0, 50));

        try {
            const supabase = createClient();
            const { error } = await supabase.from("sensor_readings").insert({
                temperature: raw.temperature,
                humidity: raw.humidity,
                vibration: raw.vibration,
                device_id: cfg.deviceId,
                location: cfg.location,
                source: "esp32",
                notes: "Simulated reading",
            });
            if (error) throw error;

            setReadings(prev => prev.map(r => r.id === id ? { ...r, saved: true } : r));
            setTotalSent(n => n + 1);
            setLastError(null);
        } catch (err: any) {
            setLastError(err.message ?? "Failed to save");
            setReadings(prev => prev.map(r => r.id === id ? { ...r, saved: false } : r));
        }
    }, [cfg, nextId]);

    // Start / stop
    function start() {
        setRunning(true);
        insertReading();
        countdownRef.current = cfg.interval;
        setCountdown(cfg.interval);

        countRef.current = setInterval(() => {
            countdownRef.current -= 1;
            setCountdown(countdownRef.current);
        }, 1000);

        timerRef.current = setInterval(() => {
            insertReading();
            countdownRef.current = cfg.interval;
            setCountdown(cfg.interval);
        }, cfg.interval * 1000);
    }

    function stop() {
        setRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (countRef.current) clearInterval(countRef.current);
        setCountdown(0);
    }

    // Restart when interval changes while running
    useEffect(() => {
        if (running) { stop(); start(); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cfg.interval]);

    useEffect(() => () => { stop(); }, []);

    const latest = readings[0];

    function updateCfg<K extends keyof SimConfig>(key: K, val: SimConfig[K]) {
        setCfg(c => ({ ...c, [key]: val }));
    }

    const inputCls = "w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all font-mono";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 bg-background min-h-screen">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-widest mb-1">ESP32 Simulator</p>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Sensor Simulator</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Simulates ESP32 readings and inserts them directly into Supabase
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowCfg(s => !s)}
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                        {showCfg ? "Hide config" : "Configure"}
                    </button>
                    <button
                        onClick={running ? stop : start}
                        className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-md transition-all hover:opacity-90 active:scale-95 ${running ? "bg-red-500" : ""}`}
                        style={!running ? { background: "#1F263E" } : {}}
                    >
                        {running
                            ? <><Square className="w-4 h-4" />Stop Simulator</>
                            : <><Play className="w-4 h-4" />Start Simulator</>}
                    </button>
                </div>
            </div>

            {/* ── Status bar ── */}
            <div className="flex items-center gap-3 flex-wrap p-4 bg-card border border-border rounded-2xl">
                {/* Running indicator */}
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${running ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                    <span className={`text-sm font-semibold ${running ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                        {running ? "Simulator running" : "Simulator stopped"}
                    </span>
                </div>

                <div className="w-px h-4 bg-border" />

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">Every {INTERVALS.find(i => i.value === cfg.interval)?.label ?? cfg.interval + "s"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Cpu className="w-4 h-4" />
                    <span className="font-mono">{cfg.deviceId}</span>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{cfg.location}</span>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    {lastError && (
                        <span className="flex items-center gap-1.5 text-xs text-red-500 font-mono">
                            <AlertTriangle className="w-3.5 h-3.5" />{lastError}
                        </span>
                    )}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Database className="w-4 h-4" />
                        <span className="font-mono font-semibold text-foreground">{totalSent}</span>
                        <span>inserted</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ── Left: Live readings + countdown ── */}
                <div className="xl:col-span-2 flex flex-col gap-5">

                    {/* Live sensor display */}
                    <div className="relative bg-card border border-border rounded-2xl p-5 shadow-sm overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-sky-500 to-violet-500" />
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-base font-bold text-foreground">Live Reading</h2>
                                <p className="text-sm text-muted-foreground font-mono mt-0.5">
                                    {latest ? `Last at ${latest.timestamp}` : "Waiting for first reading…"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {latest && <StatusBadge status={latest.status} />}
                                {running && (
                                    <div className="relative flex items-center justify-center">
                                        <CountdownRing seconds={countdown} total={cfg.interval} />
                                        <span className="absolute text-xs font-bold font-mono text-foreground">{countdown}s</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {latest ? (
                            <div className="flex flex-col gap-5">
                                <GaugeBar value={latest.temperature} min={10} max={50} color="text-orange-500" label="Temperature" unit="°C" />
                                <GaugeBar value={latest.humidity} min={0} max={100} color="text-sky-500" label="Humidity" unit="%" />
                                <GaugeBar value={latest.vibration} min={0} max={0.4}
                                    color={latest.vibration > 0.18 ? "text-red-500" : latest.vibration > 0.09 ? "text-amber-500" : "text-violet-500"}
                                    label="Vibration" unit="g" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    Press <strong>Start Simulator</strong> to begin generating readings
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Session log */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, #3B4D7A, #1F263E)" }} />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Session Log</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">{readings.length} readings this session</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0">
                                        <tr className="border-b border-border bg-muted/60">
                                            {["Time", "Temp", "Humidity", "Vibration", "Status", "Saved"].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap first:pl-5">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {readings.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center text-sm text-muted-foreground py-8 font-mono">
                                                    No readings yet
                                                </td>
                                            </tr>
                                        ) : readings.map((r, i) => (
                                            <tr key={r.id} className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} ${i === 0 ? "animate-pulse-once" : ""}`}>
                                                <td className="pl-5 py-3 whitespace-nowrap">
                                                    <span className="font-mono text-xs text-muted-foreground bg-muted border border-border rounded-lg px-2 py-0.5">{r.timestamp}</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono font-bold text-base text-orange-500 whitespace-nowrap">
                                                    {r.temperature}<span className="text-sm font-normal text-orange-300">°C</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono font-bold text-base text-sky-500 whitespace-nowrap">
                                                    {r.humidity}<span className="text-sm font-normal text-sky-300">%</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono font-bold text-base whitespace-nowrap">
                                                    <span className={r.vibration > 0.18 ? "text-red-500" : r.vibration > 0.09 ? "text-amber-500" : "text-violet-500"}>
                                                        {r.vibration}<span className="text-sm font-normal text-violet-300">g</span>
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {r.saved
                                                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" />Saved</span>
                                                        : <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500"><RefreshCw className="w-3.5 h-3.5 animate-spin" />Saving…</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right: Config panel ── */}
                <div className="xl:col-span-1 flex flex-col gap-4">

                    {/* Interval selector */}
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-foreground mb-1">Reading Interval</h3>
                        <p className="text-xs text-muted-foreground mb-4">How often to generate and insert a reading</p>
                        <div className="grid grid-cols-3 gap-2">
                            {INTERVALS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => updateCfg("interval", opt.value)}
                                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${cfg.interval === opt.value
                                            ? "text-white border-transparent"
                                            : "bg-background border-border text-muted-foreground hover:bg-muted"
                                        }`}
                                    style={cfg.interval === opt.value ? { background: "#1F263E" } : {}}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Device config */}
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-foreground mb-4">Device</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5" />Device ID
                                </label>
                                <select value={cfg.deviceId} onChange={e => updateCfg("deviceId", e.target.value)} className={inputCls}>
                                    <option>ESP32-001</option>
                                    <option>ESP32-002</option>
                                    <option>ESP32-003</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />Location
                                </label>
                                <select value={cfg.location} onChange={e => updateCfg("location", e.target.value)} className={inputCls}>
                                    <option>Server Room A</option>
                                    <option>Server Room B</option>
                                    <option>Lab Floor 2</option>
                                    <option>Outdoor Station</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sensor ranges */}
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-foreground mb-1">Sensor Ranges</h3>
                        <p className="text-xs text-muted-foreground mb-4">Base value ± noise for each sensor</p>
                        <div className="flex flex-col gap-4">
                            {/* Temperature */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Thermometer className="w-3.5 h-3.5" />Temp base (°C)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input type="range" min={15} max={45} step={0.5} value={cfg.tempBase}
                                        onChange={e => updateCfg("tempBase", +e.target.value)}
                                        className="flex-1 accent-orange-500" />
                                    <span className="font-mono text-sm font-bold text-orange-500 w-12 text-right">{cfg.tempBase}°C</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-12">Noise ±</span>
                                    <input type="range" min={0} max={5} step={0.5} value={cfg.tempNoise}
                                        onChange={e => updateCfg("tempNoise", +e.target.value)}
                                        className="flex-1 accent-orange-400" />
                                    <span className="font-mono text-xs text-muted-foreground w-12 text-right">±{cfg.tempNoise}</span>
                                </div>
                            </div>

                            {/* Humidity */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-sky-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Droplets className="w-3.5 h-3.5" />Humidity base (%)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input type="range" min={20} max={90} step={1} value={cfg.humBase}
                                        onChange={e => updateCfg("humBase", +e.target.value)}
                                        className="flex-1 accent-sky-500" />
                                    <span className="font-mono text-sm font-bold text-sky-500 w-12 text-right">{cfg.humBase}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-12">Noise ±</span>
                                    <input type="range" min={0} max={10} step={0.5} value={cfg.humNoise}
                                        onChange={e => updateCfg("humNoise", +e.target.value)}
                                        className="flex-1 accent-sky-400" />
                                    <span className="font-mono text-xs text-muted-foreground w-12 text-right">±{cfg.humNoise}</span>
                                </div>
                            </div>

                            {/* Vibration */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-violet-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5" />Vibration base (g)
                                </label>
                                <div className="flex items-center gap-2">
                                    <input type="range" min={0} max={0.15} step={0.005} value={cfg.vibBase}
                                        onChange={e => updateCfg("vibBase", +e.target.value)}
                                        className="flex-1 accent-violet-500" />
                                    <span className="font-mono text-sm font-bold text-violet-500 w-16 text-right">{cfg.vibBase}g</span>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer mt-1">
                                    <div
                                        onClick={() => updateCfg("vibSpike", !cfg.vibSpike)}
                                        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${cfg.vibSpike ? "" : "bg-muted"}`}
                                        style={cfg.vibSpike ? { background: "#1F263E" } : {}}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${cfg.vibSpike ? "translate-x-4" : "translate-x-0.5"}`} />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Random vibration spikes (~10%)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Thresholds reference */}
                    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Alert Thresholds</h3>
                        <div className="flex flex-col gap-1.5 text-xs font-mono">
                            {[
                                { label: "Temp warning", value: "> 30°C", color: "text-amber-500" },
                                { label: "Temp critical", value: "> 40°C", color: "text-red-500" },
                                { label: "Hum warning", value: "> 65%", color: "text-amber-500" },
                                { label: "Hum critical", value: "> 85%", color: "text-red-500" },
                                { label: "Vib warning", value: "> 0.09g", color: "text-amber-500" },
                                { label: "Vib critical", value: "> 0.18g", color: "text-red-500" },
                            ].map(t => (
                                <div key={t.label} className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{t.label}</span>
                                    <span className={`font-semibold ${t.color}`}>{t.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}