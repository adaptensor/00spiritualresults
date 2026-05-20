import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// DELETE /api/shrine/guests/[id]  → host blocks a previously-admitted guest.
// Soft-block via blockedAt and broadcast a 'kick' event so the guest's
// currently-open tab redirects immediately. On next navigation the gate
// itself enforces the block by returning 404.

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const shrine = await db.shrine.findUnique({ where: { userId: user.id } });
  if (!shrine) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const guest = await db.shrineGuest.findUnique({ where: { id } });
  if (!guest || guest.shrineId !== shrine.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.shrineGuest.update({
    where: { id },
    data: { blockedAt: new Date() },
  });

  try {
    const channel = getSupabaseAdmin().channel(`shrine:${user.id}`);
    await channel.send({
      type: "broadcast",
      event: "kick",
      payload: { userId: guest.guestId },
    });
    void channel.unsubscribe();
  } catch (e) {
    console.error("supabase kick broadcast failed", e);
  }

  return NextResponse.json({ ok: true });
}
