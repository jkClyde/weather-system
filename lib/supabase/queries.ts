// ─── Server-side queries (use in Server Components / Server Actions) ──────────

import { createClient } from "@/lib/supabase/server";
// import type { Database } from "@/lib/supabase/types"; // uncomment after gen types

// Fetch all rows
export async function getPosts() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

// Fetch single row
export async function getPost(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select("*, author:profiles(full_name, avatar_url)")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

// Insert
export async function createPost(title: string, body: string, userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .insert({ title, body, user_id: userId })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

// Update
export async function updatePost(id: string, title: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("posts")
        .update({ title })
        .eq("id", id);

    if (error) throw new Error(error.message);
}

// Delete
export async function deletePost(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}