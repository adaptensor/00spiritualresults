import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";

// DELETE /api/shrine/guests/[id]  → host blocks a previously-admitted guest.
// Soft-block via blockedAt. The guest's view of /shrine/[username] will 404
// on next visit. Phase 6 adds a real-time kick broadcast on top of this.

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

  return NextResponse.json({ ok: true });
}
