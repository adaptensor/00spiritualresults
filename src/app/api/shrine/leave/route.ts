import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// POST /api/shrine/leave — host explicitly closes the session.
// Broadcasts room:closed so every guest currently in the realtime channel
// is redirected to /dashboard. Mirrors the PRIVATE-flip path; this is the
// "I'm done for now" affordance attached to the X button in the room.
//
// Implicit exits (closing the tab, browser back) do NOT fire this — guests
// will just see presence decay. That's a known limitation.

export async function POST() {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shrine = await db.shrine.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!shrine) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const channel = getSupabaseAdmin().channel(`shrine:${user.id}`);
    await channel.send({
      type: "broadcast",
      event: "room:closed",
      payload: { closedAt: new Date().toISOString(), reason: "host_left" },
    });
    void channel.unsubscribe();
  } catch (e) {
    console.error("supabase room:closed (leave) broadcast failed", e);
  }

  return NextResponse.json({ ok: true });
}
