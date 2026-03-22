"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "uploads"; // change to your bucket name

// Upload a file — returns the public URL
export async function uploadFile(file: File, path: string): Promise<string> {
    const supabase = createClient();

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

// Generate a signed URL for private buckets (expires in 1 hour)
export async function getSignedUrl(path: string): Promise<string> {
    const supabase = createClient();

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, 3600);

    if (error) throw new Error(error.message);
    return data.signedUrl;
}

// Delete a file
export async function deleteFile(path: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(error.message);
}

// ─── Example: avatar upload component ────────────────────────────────────────
//
// export function AvatarUpload({ userId }: { userId: string }) {
//   async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const path = `avatars/${userId}/${file.name}`;
//     const url = await uploadFile(file, path);
//     console.log("Uploaded:", url);
//   }
//   return <input type="file" accept="image/*" onChange={handleChange} />;
// }