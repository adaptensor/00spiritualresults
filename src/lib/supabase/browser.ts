"use client";

import { createClient } from "@supabase/supabase-js";

// Anon-key client for client-side Realtime subscribe + presence tracking.
// Safe to expose in the browser. Bidirectional sends go through the server
// (/api/shrine/chat) so the anon key cannot be abused to spoof messages —
// publishes from this client are limited to presence track() calls.

let cached: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
