import { createClient } from "@supabase/supabase-js";

// Service-role client for server-side broadcasts and trusted operations.
// NEVER import this from a client component. The service_role key bypasses
// row-level security and must stay on the server.
//
// Used in /api/shrine/chat to publish authoritative chat events to the
// shrine:<ownerId> Realtime channel after persisting the message to Neon.

let cached: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return cached;
}
