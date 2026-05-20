import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/shrine/invite  → create an invite (link-only if no email).
// GET  /api/shrine/invite  → list the host's active invites.
//
// Both are host-only. We resolve the host's own shrine via the 1:1 relation
// on User; guests cannot create invites for shrines they don't own.

const CreateInviteSchema = z.object({
  email: z.string().email().optional(),
});

const INVITE_TTL_DAYS = 30;

export async function POST(req: Request) {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = CreateInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const shrine = await db.shrine.findUnique({ where: { userId: user.id } });
  if (!shrine) return NextResponse.json({ error: "Shrine not found" }, { status: 404 });

  const token = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86_400_000);

  const invite = await db.shrineInvite.create({
    data: {
      shrineId: shrine.id,
      token,
      invitedEmail: parsed.data.email ?? null,
      expiresAt,
    },
  });

  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const url = `${base}/shrine/${user.username}?invite=${token}`;

  // Phase 5 (Resend) will hook in here to actually send the email when
  // invitedEmail is set. For now we just persist the row and return the URL.

  return NextResponse.json({
    ok: true,
    invite: {
      id: invite.id,
      token: invite.token,
      url,
      invitedEmail: invite.invitedEmail,
      expiresAt: invite.expiresAt.toISOString(),
      createdAt: invite.createdAt.toISOString(),
    },
  });
}

export async function GET() {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shrine = await db.shrine.findUnique({ where: { userId: user.id } });
  if (!shrine) return NextResponse.json({ invites: [] });

  const invites = await db.shrineInvite.findMany({
    where: {
      shrineId: shrine.id,
      revokedAt: null,
      usedById: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  return NextResponse.json({
    invites: invites.map((i) => ({
      id: i.id,
      token: i.token,
      url: `${base}/shrine/${user.username}?invite=${i.token}`,
      invitedEmail: i.invitedEmail,
      expiresAt: i.expiresAt.toISOString(),
      createdAt: i.createdAt.toISOString(),
    })),
  });
}
