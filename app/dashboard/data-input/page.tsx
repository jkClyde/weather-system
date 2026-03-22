"use client";

import { useState, useEffect } from "react";
import {
    Thermometer, Droplets, Activity, Cpu, MapPin,
    FileText, Clock, Wifi, WifiOff, Send, Plus,
    CheckCircle2, AlertTriangle, RefreshCw, Pencil,
    ChevronRight,
} from "lucide-react";
import { Status } from "@/type";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SensorEntry {
    id: number;
    temperature: number;
    humidity: number;
    vibration: number;
    deviceId: string;
    location: string;
    notes: string;
    timestamp: string;
    source: "esp32" | "manual";
    status: Status;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function deriveStatus(temp: number, hum: number, vib: number): Status {
    if (vib > 0.18 || temp > 40 || hum > 85) return "critical";
    if (vib > 0.09 || temp > 30 || hum > 65) return "warning";
    return "normal";
}

function StatusBadge({ status }: { status: Status }) {
    const map: Record<Status, { dot: string; pill: string; label: string }> = {
        normal: { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20", label: "Normal" },
        warning: { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20", label: "Warning" },
        critical: { dot: "bg-red-500", pill: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20", label: "Critical" },
    };
    const { dot, pill, label } = map[status];
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, icon, children, hint }: {
    label: string; icon: React.ReactNode;
    children: React.ReactNode; hint?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {icon}
                {label}
            </label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

// ─── Sensor value gauge ───────────────────────────────────────────────────────
function ValueGauge({ value, min, max, unit, color, label }: {
    value: number; min: number; max: number;
    unit: string; color: string; label: string;
}) {
    const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{label}</span>
                <span className={`text-xl font-bold font-mono ${color}`}>
                    {isNaN(value) ? "—" : value}
                    <span className="text-sm font-normal ml-0.5 text-muted-foreground">{unit}</span>
                </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color.replace("text-", "bg-")}`}
                    style={{ width: `${isNaN(value) ? 0 : pct}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
}

// ─── Mock ESP32 auto-read ─────────────────────────────────────────────────────
function mockEsp32Read() {
    return {
        temperature: parseFloat((26 + Math.random() * 6).toFixed(1)),
        humidity: parseFloat((55 + Math.random() * 15).toFixed(1)),
        vibration: parseFloat((0.01 + Math.random() * 0.15).toFixed(3)),
    };
}

// ─── Empty form state ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
    temperature: "",
    humidity: "",
    vibration: "",
    deviceId: "ESP32-001",
    location: "Server Room A",
    notes: "",
    timestamp: "",
    useNow: true as boolean,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DataInputPage() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [entries, setEntries] = useState<SensorEntry[]>([]);
    const [esp32On, setEsp32On] = useState(true);
    const [autoRead, setAutoRead] = useState(false);
    const [reading, setReading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [nextId, setNextId] = useState(1);

    // Live preview derived values
    const previewTemp = parseFloat(form.temperature) || 0;
    const previewHum = parseFloat(form.humidity) || 0;
    const previewVib = parseFloat(form.vibration) || 0;
    const previewStatus = deriveStatus(previewTemp, previewHum, previewVib);
    const hasValues = form.temperature || form.humidity || form.vibration;

    // Auto-read from ESP32 every 5s when enabled
    useEffect(() => {
        if (!autoRead || !esp32On) return;
        const id = setInterval(() => {
            const data = mockEsp32Read();
            setForm(f => ({
                ...f,
                temperature: String(data.temperature),
                humidity: String(data.humidity),
                vibration: String(data.vibration),
            }));
        }, 5000);
        return () => clearInterval(id);
    }, [autoRead, esp32On]);

    function handleChange(key: keyof typeof form, val: string) {
        setForm(f => ({ ...f, [key]: val }));
        setErrors(e => { const n = { ...e }; delete n[key]; return n; });
    }

    function handleFetchNow() {
        if (!esp32On) return;
        setReading(true);
        setTimeout(() => {
            const data = mockEsp32Read();
            setForm(f => ({
                ...f,
                temperature: String(data.temperature),
                humidity: String(data.humidity),
                vibration: String(data.vibration),
            }));
            setReading(false);
        }, 800);
    }

    function validate() {
        const e: Record<string, string> = {};
        if (!form.temperature) e.temperature = "Required";
        else if (isNaN(+form.temperature) || +form.temperature < -50 || +form.temperature > 100) e.temperature = "Must be −50 to 100";
        if (!form.humidity) e.humidity = "Required";
        else if (isNaN(+form.humidity) || +form.humidity < 0 || +form.humidity > 100) e.humidity = "Must be 0 – 100";
        if (!form.vibration) e.vibration = "Required";
        else if (isNaN(+form.vibration) || +form.vibration < 0 || +form.vibration > 10) e.vibration = "Must be 0 – 10";
        if (!form.deviceId.trim()) e.deviceId = "Required";
        if (!form.location.trim()) e.location = "Required";
        if (!form.useNow && !form.timestamp) e.timestamp = "Required when not using current time";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        const now = new Date();
        const ts = form.useNow
            ? now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
            : form.timestamp;

        const entry: SensorEntry = {
            id: nextId,
            temperature: +form.temperature,
            humidity: +form.humidity,
            vibration: +form.vibration,
            deviceId: form.deviceId,
            location: form.location,
            notes: form.notes,
            timestamp: ts,
            source: autoRead ? "esp32" : "manual",
            status: deriveStatus(+form.temperature, +form.humidity, +form.vibration),
        };

        setEntries(prev => [entry, ...prev]);
        setNextId(n => n + 1);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);
        setForm(f => ({ ...EMPTY_FORM, deviceId: f.deviceId, location: f.location }));
        setErrors({});
    }

    function handleReset() {
        setForm(EMPTY_FORM);
        setErrors({});
    }

    const inputCls = (key: string) =>
        `w-full bg-background border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-all font-mono
     placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring/30
     ${errors[key] ? "border-red-400 focus:border-red-400" : "border-border focus:border-ring"}`;

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 bg-background min-h-screen">

            {/* ── Header ── */}
            <div>
                <p className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-widest mb-1">
                    Sensor Input
                </p>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Data Input</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manual entry or pull directly from your ESP32 device
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ══ LEFT: Form ══ */}
                <div className="xl:col-span-2 flex flex-col gap-5">

                    {/* ESP32 connection bar */}
                    <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-2xl px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${esp32On ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" : "bg-muted border-border"}`}>
                                {esp32On
                                    ? <Wifi className="w-4 h-4 text-emerald-500" />
                                    : <WifiOff className="w-4 h-4 text-muted-foreground" />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    ESP32 {esp32On ? "Connected" : "Disconnected"}
                                </p>
                                <p className="text-xs text-muted-foreground font-mono">
                                    {esp32On ? form.deviceId + " · " + form.location : "No device found"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            {/* Auto-read toggle */}
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <span className="text-xs text-muted-foreground font-medium">Auto-read</span>
                                <div
                                    onClick={() => esp32On && setAutoRead(a => !a)}
                                    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${autoRead && esp32On ? "bg-emerald-500" : "bg-muted"} ${!esp32On ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoRead && esp32On ? "translate-x-4" : "translate-x-0.5"}`} />
                                </div>
                            </label>

                            {/* Fetch now */}
                            <button
                                type="button"
                                onClick={handleFetchNow}
                                disabled={!esp32On || reading}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-foreground"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${reading ? "animate-spin" : ""}`} />
                                {reading ? "Reading…" : "Fetch now"}
                            </button>

                            {/* Simulate toggle */}
                            <button
                                type="button"
                                onClick={() => setEsp32On(v => !v)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${esp32On ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100 dark:border-red-500/20 dark:text-red-400 dark:bg-red-500/10" : "border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/10"}`}
                            >
                                {esp32On ? "Simulate disconnect" : "Simulate connect"}
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-5">
                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-orange-400 via-sky-500 to-violet-500 hidden" />

                        {/* Top accent line */}
                        <div className="h-1 -mx-5 -mt-5 rounded-t-2xl bg-gradient-to-r from-orange-400 via-sky-500 to-violet-500 mb-1" />

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-foreground">Sensor Reading</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {autoRead && esp32On ? "Auto-populating from ESP32" : "Enter values manually or fetch from device"}
                                </p>
                            </div>
                            {autoRead && esp32On && (
                                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                    </span>
                                    Auto-reading
                                </span>
                            )}
                        </div>

                        {/* Sensor values — 3 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Temperature" icon={<Thermometer className="w-3.5 h-3.5 text-orange-500" />} hint="Range: −50 to 100°C">
                                <div className="relative">
                                    <input type="number" step="0.1" min="-50" max="100"
                                        value={form.temperature} onChange={e => handleChange("temperature", e.target.value)}
                                        placeholder="28.4" className={inputCls("temperature")} />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">°C</span>
                                </div>
                                {errors.temperature && <p className="text-xs text-red-500">{errors.temperature}</p>}
                            </Field>

                            <Field label="Humidity" icon={<Droplets className="w-3.5 h-3.5 text-sky-500" />} hint="Range: 0 to 100%">
                                <div className="relative">
                                    <input type="number" step="0.1" min="0" max="100"
                                        value={form.humidity} onChange={e => handleChange("humidity", e.target.value)}
                                        placeholder="62.1" className={inputCls("humidity")} />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">%</span>
                                </div>
                                {errors.humidity && <p className="text-xs text-red-500">{errors.humidity}</p>}
                            </Field>

                            <Field label="Vibration" icon={<Activity className="w-3.5 h-3.5 text-violet-500" />} hint="Range: 0 to 10g">
                                <div className="relative">
                                    <input type="number" step="0.001" min="0" max="10"
                                        value={form.vibration} onChange={e => handleChange("vibration", e.target.value)}
                                        placeholder="0.03" className={inputCls("vibration")} />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">g</span>
                                </div>
                                {errors.vibration && <p className="text-xs text-red-500">{errors.vibration}</p>}
                            </Field>
                        </div>

                        {/* Device + location */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Device ID" icon={<Cpu className="w-3.5 h-3.5 text-muted-foreground" />}>
                                <select value={form.deviceId} onChange={e => handleChange("deviceId", e.target.value)}
                                    className={inputCls("deviceId")}>
                                    <option>ESP32-001</option>
                                    <option>ESP32-002</option>
                                    <option>ESP32-003</option>
                                </select>
                                {errors.deviceId && <p className="text-xs text-red-500">{errors.deviceId}</p>}
                            </Field>

                            <Field label="Location" icon={<MapPin className="w-3.5 h-3.5 text-muted-foreground" />}>
                                <select value={form.location} onChange={e => handleChange("location", e.target.value)}
                                    className={inputCls("location")}>
                                    <option>Server Room A</option>
                                    <option>Server Room B</option>
                                    <option>Lab Floor 2</option>
                                    <option>Outdoor Station</option>
                                </select>
                                {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                            </Field>
                        </div>

                        {/* Timestamp */}
                        <Field label="Timestamp" icon={<Clock className="w-3.5 h-3.5 text-muted-foreground" />}>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <div
                                        onClick={() => setForm(f => ({ ...f, useNow: !f.useNow }))}
                                        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${form.useNow ? "" : "bg-muted"}`}
                                        style={form.useNow ? { background: "#1F263E" } : {}}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.useNow ? "translate-x-4" : "translate-x-0.5"}`} />
                                    </div>
                                    <span className="text-sm text-muted-foreground">Use current time</span>
                                </label>
                                {!form.useNow && (
                                    <input type="datetime-local" value={form.timestamp}
                                        onChange={e => handleChange("timestamp", e.target.value)}
                                        className={`${inputCls("timestamp")} flex-1`} />
                                )}
                            </div>
                            {errors.timestamp && <p className="text-xs text-red-500">{errors.timestamp}</p>}
                        </Field>

                        {/* Notes */}
                        <Field label="Notes" icon={<FileText className="w-3.5 h-3.5 text-muted-foreground" />} hint="Optional — describe the reading context">
                            <textarea value={form.notes} onChange={e => handleChange("notes", e.target.value)}
                                placeholder="e.g. Post-maintenance check, abnormal vibration during equipment startup…"
                                rows={3}
                                className={`${inputCls("notes")} resize-none font-sans`} />
                        </Field>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1 border-t border-border">
                            <button type="submit"
                                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                                style={{ background: "#1F263E" }}>
                                {submitted
                                    ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" />Saved!</>
                                    : <><Send className="w-4 h-4" />Submit Reading</>}
                            </button>
                            <button type="button" onClick={handleReset}
                                className="text-sm font-medium px-4 py-2.5 rounded-xl border border-border bg-background text-muted-foreground hover:bg-muted transition-colors">
                                Reset
                            </button>
                            <span className="ml-auto text-xs text-muted-foreground font-mono">
                                {entries.length} submitted this session
                            </span>
                        </div>
                    </form>
                </div>

                {/* ══ RIGHT: Live preview ══ */}
                <div className="xl:col-span-1 flex flex-col gap-4">

                    {/* Preview card */}
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Live Preview</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Updates as you type</p>
                            </div>
                            {hasValues && <StatusBadge status={previewStatus} />}
                        </div>

                        {hasValues ? (
                            <div className="flex flex-col gap-5">
                                {/* Gauges */}
                                <ValueGauge value={previewTemp} min={0} max={50} unit="°C" color="text-orange-500" label="Temperature" />
                                <ValueGauge value={previewHum} min={0} max={100} unit="%" color="text-sky-500" label="Humidity" />
                                <ValueGauge value={previewVib} min={0} max={0.5} unit="g" color={previewVib > 0.18 ? "text-red-500" : previewVib > 0.09 ? "text-amber-500" : "text-violet-500"} label="Vibration" />

                                <div className="border-t border-border pt-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground flex items-center gap-1.5"><Cpu className="w-3 h-3" />Device</span>
                                        <span className="font-mono font-semibold text-foreground">{form.deviceId || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" />Location</span>
                                        <span className="font-semibold text-foreground text-right max-w-[120px] truncate">{form.location || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" />Time</span>
                                        <span className="font-mono font-semibold text-foreground">
                                            {form.useNow ? "Now" : form.timestamp ? new Date(form.timestamp).toLocaleTimeString() : "—"}
                                        </span>
                                    </div>
                                    {form.notes && (
                                        <div className="flex flex-col gap-1 mt-1">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1.5"><FileText className="w-3 h-3" />Notes</span>
                                            <p className="text-xs text-foreground bg-muted rounded-lg px-3 py-2 border border-border leading-relaxed">{form.notes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Status alert hint */}
                                {previewStatus !== "normal" && (
                                    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 border text-xs ${previewStatus === "critical"
                                            ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                                            : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                                        }`}>
                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                        <span>
                                            {previewStatus === "critical"
                                                ? "One or more values exceed critical thresholds."
                                                : "One or more values are above warning thresholds."}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center">
                                    <Pencil className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Start entering values to see a live preview
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Thresholds reference */}
                    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Thresholds</h3>
                        <div className="flex flex-col gap-2 text-xs font-mono">
                            {[
                                { label: "Temp warning", value: "> 30°C", color: "text-amber-500" },
                                { label: "Temp critical", value: "> 40°C", color: "text-red-500" },
                                { label: "Hum warning", value: "> 65%", color: "text-amber-500" },
                                { label: "Hum critical", value: "> 85%", color: "text-red-500" },
                                { label: "Vib warning", value: "> 0.09g", color: "text-amber-500" },
                                { label: "Vib critical", value: "> 0.18g", color: "text-red-500" },
                            ].map(t => (
                                <div key={t.label} className="flex items-center justify-between gap-2">
                                    <span className="text-muted-foreground">{t.label}</span>
                                    <span className={`font-semibold ${t.color}`}>{t.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent submissions ── */}
            {entries.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, #3B4D7A, #1F263E)" }} />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            This Session
                        </span>
                        <span className="text-xs text-muted-foreground font-mono ml-1">
                            {entries.length} {entries.length === 1 ? "entry" : "entries"}
                        </span>
                    </div>

                    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-orange-400 via-sky-500 to-violet-500" />
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/40">
                                        {["#", "Time", "Temp", "Humidity", "Vibration", "Device", "Location", "Source", "Status", "Notes"].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap first:pl-5">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((r, i) => (
                                        <tr key={r.id} className={`border-b border-border hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                                            <td className="pl-5 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="font-mono text-xs text-muted-foreground bg-muted border border-border rounded-lg px-2 py-0.5">{r.timestamp}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-base text-orange-500">
                                                {r.temperature}<span className="text-sm font-normal text-orange-300">°C</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-base text-sky-500">
                                                {r.humidity}<span className="text-sm font-normal text-sky-300">%</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-base text-violet-500">
                                                {r.vibration}<span className="text-sm font-normal text-violet-300">g</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-lg px-2 py-0.5 border border-border">
                                                    <Cpu className="w-3 h-3" />{r.deviceId}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{r.location}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${r.source === "esp32"
                                                        ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20"
                                                        : "bg-muted text-muted-foreground border-border"
                                                    }`}>
                                                    {r.source === "esp32" ? <Wifi className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                                                    {r.source === "esp32" ? "ESP32" : "Manual"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px] truncate">{r.notes || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}