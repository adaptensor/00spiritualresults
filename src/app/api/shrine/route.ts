import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ShrineUpdateSchema } from "@/lib/shrine/types";

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

  return NextResponse.json({ ok: true, shrine: updated });
}
