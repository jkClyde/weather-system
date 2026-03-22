// app/api/test/route.ts
// DELETE this file after confirming Supabase is connected.
// Visit: http://localhost:3000/api/test

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            return NextResponse.json({
                status: "❌ Supabase error",
                error: error.message,
            }, { status: 500 });
        }

        return NextResponse.json({
            status: "✅ Supabase connected",
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            session: data.session ? "Active session found" : "No active session",
        });
    } catch (err) {
        return NextResponse.json({
            status: "❌ Failed to reach Supabase",
            error: String(err),
        }, { status: 500 });
    }
}