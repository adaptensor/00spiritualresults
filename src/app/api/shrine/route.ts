import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ShrineUpdateSchema } from "@/lib/shrine/types";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function PUT(req: Request) {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = ShrineUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const previous = await db.shrine.findUnique({
    where: { userId: user.id },
    select: { visibility: true },
  });

  const updated = await db.shrine.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      ...(data.theme !== undefined ? { theme: data.theme } : {}),
      ...(data.objects !== undefined ? { objects: data.objects } : {}),
      ...(data.soundscape !== undefined ? { soundscape: data.soundscape } : {}),
      ...(data.visibility !== undefined ? { visibility: data.visibility } : {}),
      ...(data.candleLit !== undefined ? { candleLit: data.candleLit } : {}),
      ...(data.musicOn !== undefined ? { musicOn: data.musicOn } : {}),
    },
    update: {
      ...(data.theme !== undefined ? { theme: data.theme } : {}),
      ...(data.objects !== undefined ? { objects: data.objects } : {}),
      ...(data.soundscape !== undefined ? { soundscape: data.soundscape } : {}),
      ...(data.visibility !== undefined ? { visibility: data.visibility } : {}),
      ...(data.candleLit !== undefined ? { candleLit: data.candleLit } : {}),
      ...(data.musicOn !== undefined ? { musicOn: data.musicOn } : {}),
    },
  });

  // When the room transitions INTO PRIVATE, kick any guest who still has the
  // tab open. The gate already 404s them on refresh; this just makes the
  // redirect immediate instead of waiting for them to reload.
  const becamePrivate =
    data.visibility === "PRIVATE" &&
    previous?.visibility !== "PRIVATE";
  if (becamePrivate) {
    try {
      const channel = getSupabaseAdmin().channel(`shrine:${user.id}`);
      await channel.send({
        type: "broadcast",
        event: "room:closed",
        payload: { closedAt: new Date().toISOString() },
      });
      void channel.unsubscribe();
    } catch (e) {
      console.error("supabase room:closed broadcast failed", e);
    }
  }

  return NextResponse.json({ ok: true, shrine: updated });
}
