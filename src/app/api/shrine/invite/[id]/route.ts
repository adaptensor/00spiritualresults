import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";

// DELETE /api/shrine/invite/[id]  → host revokes a pending invite.
// Soft-revoke: sets revokedAt rather than deleting, so we keep an audit trail.

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const shrine = await db.shrine.findUnique({ where: { userId: user.id } });
  if (!shrine) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const invite = await db.shrineInvite.findUnique({ where: { id } });
  if (!invite || invite.shrineId !== shrine.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.shrineInvite.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
