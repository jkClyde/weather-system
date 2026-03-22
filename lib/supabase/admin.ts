import { createClient } from "@supabase/supabase-js";

// Only use this in Server Actions or Route Handlers — never in client components.
// Bypasses Row Level Security.
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);