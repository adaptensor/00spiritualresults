import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/shrine/guests  → host lists the persistent guest whitelist.
// Blocked guests are returned with blockedAt set so the host's UI can show
// them separately ("removed: <name>") if it wants.

export async function GET() {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shrine = await db.shrine.findUnique({ where: { userId: user.id } });
  if (!shrine) return NextResponse.json({ guests: [] });

  const guests = await db.shrineGuest.findMany({
    where: { shrineId: shrine.id },
    include: { guest: { select: { id: true, username: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    guests: guests.map((g) => ({
      id: g.id,
      blockedAt: g.blockedAt?.toISOString() ?? null,
      createdAt: g.createdAt.toISOString(),
      user: g.guest,
    })),
  });
}
