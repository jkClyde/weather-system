"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Gauge } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px),
            linear-gradient(to right, #94a3b8 1px, transparent 1px)`,
                    backgroundSize: "48px 48px",
                }}
            />
            {/* Glow blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md flex flex-col gap-8">

                {/* Logo + heading */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shadow-lg shadow-sky-500/10">
                        <Gauge className="w-7 h-7 text-sky-400" strokeWidth={1.5} />
                    </div>
                    <div>
                        {/* <h1 className="text-2xl font-bold text-white tracking-tight">
                            Welcome back
                        </h1> */}
                        <p className="text-sm text-slate-400 mt-1">
                            Sign in to your SensorDash account
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Error banner */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="email"
                                className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-sky-400/80 hover:text-sky-400 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    {showPassword
                                        ? <EyeOff className="w-4 h-4" />
                                        : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-1 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 disabled:bg-sky-500/40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
                        >
                            {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                                : "Sign in"}
                        </button>
                    </form>
                </div>

                {/* Sign up link */}
                {/* <p className="text-center text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                    >
                        Create one
                    </Link>
                </p> */}
            </div>
        </div>
    );
}