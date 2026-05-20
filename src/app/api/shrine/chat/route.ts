import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabase/server";

// Chat for the two-soul room.
//   POST  /api/shrine/chat       — send a message (host or admitted guest).
//   GET   /api/shrine/chat?shrineId=&before=&limit=50  — paginated history.
//
// The trust boundary lives here. Clients NEVER publish directly to the
// Supabase channel — they POST here, we authorize, we persist to Neon, and
// THEN we broadcast. The browser cannot spoof a senderId.

const SendSchema = z.object({
  shrineId: z.string().cuid(),
  body: z.string().min(1).max(1000),
});

async function ensureViewerInRoom(viewerId: string, shrineId: string) {
  const shrine = await db.shrine.findUnique({
    where: { id: shrineId },
    select: { userId: true },
  });
  if (!shrine) return { ok: false as const, status: 404, reason: "Shrine not found" };
  if (shrine.userId === viewerId) {
    return { ok: true as const, ownerId: shrine.userId };
  }
  const guest = await db.shrineGuest.findUnique({
    where: { shrineId_guestId: { shrineId, guestId: viewerId } },
  });
  if (!guest || guest.blockedAt) {
    return { ok: false as const, status: 403, reason: "Not in room" };
  }
  return { ok: true as const, ownerId: shrine.userId };
}

export async function POST(req: Request) {
  const viewer = await getOrCreateLocalUser();
  if (!viewer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = SendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const auth = await ensureViewerInRoom(viewer.id, parsed.data.shrineId);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  const message = await db.chatMessage.create({
    data: {
      shrineId: parsed.data.shrineId,
      senderId: viewer.id,
      body: parsed.data.body.trim(),
    },
  });

  const payload = {
    id: message.id,
    senderId: viewer.id,
    senderName: viewer.name || viewer.username || "someone",
    body: message.body,
    createdAt: message.createdAt.toISOString(),
  };

  // Best-effort broadcast — if Supabase is briefly unavailable the persisted
  // message will still appear via history fetch on the next client poll.
  try {
    const channel = getSupabaseAdmin().channel(`shrine:${auth.ownerId}`);
    await channel.send({ type: "broadcast", event: "chat", payload });
    void channel.unsubscribe();
  } catch (e) {
    console.error("supabase broadcast failed", e);
  }

  return NextResponse.json({ ok: true, message: payload });
}

// Owner-only wipe of every chat row for this user's shrine. Used by the
// editor's "Clear conversation" button so the host can start fresh before
// inviting a new guest or flipping back to PRIVATE. Broadcasts chat:clear so
// any currently-connected client drops its local message buffer in real time.
export async function DELETE() {
  const viewer = await getOrCreateLocalUser();
  if (!viewer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shrine = await db.shrine.findUnique({
    where: { userId: viewer.id },
    select: { id: true, userId: true },
  });
  if (!shrine) return NextResponse.json({ error: "Shrine not found" }, { status: 404 });

  const { count } = await db.chatMessage.deleteMany({
    where: { shrineId: shrine.id },
  });

  try {
    const channel = getSupabaseAdmin().channel(`shrine:${shrine.userId}`);
    await channel.send({
      type: "broadcast",
      event: "chat:clear",
      payload: { clearedAt: new Date().toISOString() },
    });
    void channel.unsubscribe();
  } catch (e) {
    console.error("supabase broadcast failed (chat:clear)", e);
  }

  return NextResponse.json({ ok: true, cleared: count });
}

const QuerySchema = z.object({
  shrineId: z.string().cuid(),
  before: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export async function GET(req: Request) {
  const viewer = await getOrCreateLocalUser();
  if (!viewer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    shrineId: url.searchParams.get("shrineId"),
    before: url.searchParams.get("before") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const auth = await ensureViewerInRoom(viewer.id, parsed.data.shrineId);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  const messages = await db.chatMessage.findMany({
    where: {
      shrineId: parsed.data.shrineId,
      ...(parsed.data.before
        ? { createdAt: { lt: new Date(parsed.data.before) } }
        : {}),
    },
    include: { sender: { select: { id: true, name: true, username: true } } },
    orderBy: { createdAt: "desc" },
    take: parsed.data.limit,
  });

  return NextResponse.json({
    messages: messages.reverse().map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender.name || m.sender.username || "someone",
      body: m.body,
      createdAt: m.createdAt.toISOString(),
    })),
  });
}
