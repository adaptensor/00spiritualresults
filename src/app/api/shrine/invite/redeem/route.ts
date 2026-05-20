import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/shrine/invite/redeem  → viewer accepts an invite by token.
// Stamps the invite as used and upserts the viewer into ShrineGuest so they
// can re-enter the shrine without needing the token again.
//
// Token validation rules:
//   - Token exists
//   - Not revoked
//   - Not expired
//   - Either unused (free for anyone) OR already used by THIS viewer
//     (we re-allow the original redeemer's bookmark to keep working)

const RedeemSchema = z.object({
  token: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const viewer = await getOrCreateLocalUser();
  if (!viewer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = RedeemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const invite = await db.shrineInvite.findUnique({
    where: { token: parsed.data.token },
    include: { shrine: { include: { user: true } } },
  });
  if (!invite) return NextResponse.json({ error: "Invalid token" }, { status: 410 });
  if (invite.revokedAt) return NextResponse.json({ error: "Revoked" }, { status: 410 });
  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Expired" }, { status: 410 });
  }
  if (invite.usedById && invite.usedById !== viewer.id) {
    return NextResponse.json({ error: "Already used" }, { status: 410 });
  }

  // Owner can't redeem their own invite.
  if (invite.shrine.userId === viewer.id) {
    return NextResponse.json({ error: "You own this shrine" }, { status: 400 });
  }

  // Mark used (idempotent if same viewer re-clicks their own link).
  if (!invite.usedById) {
    await db.shrineInvite.update({
      where: { id: invite.id },
      data: { usedById: viewer.id, usedAt: new Date() },
    });
  }

  // Upsert into guest whitelist. If they were previously blocked, un-block
  // them — the host issuing a fresh invite is an explicit re-welcome.
  await db.shrineGuest.upsert({
    where: { shrineId_guestId: { shrineId: invite.shrineId, guestId: viewer.id } },
    create: { shrineId: invite.shrineId, guestId: viewer.id },
    update: { blockedAt: null },
  });

  return NextResponse.json({
    ok: true,
    username: invite.shrine.user.username,
  });
}
