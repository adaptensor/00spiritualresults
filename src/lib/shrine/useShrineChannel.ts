"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

// Wires a ShrineRoom up to Supabase Realtime for:
//   - presence (who else is in the room right now)
//   - broadcast subscription (chat messages + future events like 'kick')
//   - chat history hydration on mount
//   - join chime (synthesized via Web Audio; Phase 7 will swap for a Lyria asset)
//
// Sends go through POST /api/shrine/chat — never via the channel directly.
// The trust boundary lives server-side; this hook is presentation-layer only.

export type ChatMsg = {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
};

export type PresenceOther = { name: string; initial: string } | null;

type Viewer = { id: string; name: string };

type Args = {
  shrineId: string;
  ownerId: string;
  viewer: Viewer | null; // null when used in editing preview (no channel join)
};

const PRESENCE_KEY_PREFIX = "viewer";

export function useShrineChannel({ shrineId, ownerId, viewer }: Args) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [other, setOther] = useState<PresenceOther>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const chimedUsersRef = useRef<Set<string>>(new Set());
  const lastChimeAtRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Effect deps MUST be primitives — passing the `viewer` object directly
  // would re-fire the effect on every parent render (new object reference),
  // tearing down and recreating the Supabase channel each time, which the
  // other tab perceives as a constant leave/join cycle.
  const viewerId = viewer?.id ?? null;
  const viewerName = viewer?.name ?? "";

  // Hydrate chat history once on mount (or whenever the room itself changes).
  useEffect(() => {
    if (!viewerId) return;
    let cancelled = false;
    fetch(`/api/shrine/chat?shrineId=${shrineId}&limit=50`)
      .then((r) => (r.ok ? r.json() : { messages: [] }))
      .then((data) => {
        if (cancelled) return;
        setMessages(data.messages || []);
        for (const m of data.messages || []) {
          knownIdsRef.current.add(m.id);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [shrineId, viewerId]);

  // Establish channel + presence. Only re-runs when the room or viewer
  // identity actually changes — not on every parent render.
  useEffect(() => {
    if (!viewerId) return;
    const supabase = getSupabaseBrowser();
    const channel = supabase.channel(`shrine:${ownerId}`, {
      config: {
        presence: { key: `${PRESENCE_KEY_PREFIX}:${viewerId}` },
      },
    });

    channel.on("broadcast", { event: "chat" }, ({ payload }) => {
      const m = payload as ChatMsg;
      if (!m?.id || knownIdsRef.current.has(m.id)) return;
      knownIdsRef.current.add(m.id);
      setMessages((prev) => [...prev, m]);
    });

    channel.on("broadcast", { event: "kick" }, ({ payload }) => {
      const target = (payload as { userId?: string })?.userId;
      if (target && target === viewerId) {
        window.location.href = "/dashboard";
      }
    });

    // Host wiped the conversation from the editor. Drop every cached message
    // and forget the dedupe ids so a fresh chat session can begin cleanly.
    channel.on("broadcast", { event: "chat:clear" }, () => {
      knownIdsRef.current.clear();
      setMessages([]);
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState() as Record<
        string,
        Array<{ user_id?: string; name?: string }>
      >;
      const others: Array<{ user_id: string; name: string }> = [];
      for (const key of Object.keys(state)) {
        const metas = state[key] ?? [];
        for (const m of metas) {
          if (m.user_id && m.user_id !== viewerId) {
            others.push({ user_id: m.user_id, name: m.name || "someone" });
          }
        }
      }
      if (others.length > 0) {
        const first = others[0];
        setOther({ name: first.name, initial: first.name.charAt(0).toUpperCase() });
      } else {
        setOther(null);
      }
    });

    // Chime at most once per distinct user per session. Even on a legitimate
    // leave+rejoin we stay quiet — contemplative product, not a notification
    // app. A page refresh resets the session and re-enables the chime.
    channel.on("presence", { event: "join" }, ({ newPresences }) => {
      const arrivers = (newPresences || [])
        .map((p) => (p as { user_id?: string }).user_id)
        .filter((id): id is string => !!id && id !== viewerId);

      const trulyNew = arrivers.filter((id) => !chimedUsersRef.current.has(id));
      if (trulyNew.length === 0) return;
      for (const id of trulyNew) chimedUsersRef.current.add(id);
      playChime(audioCtxRef, lastChimeAtRef);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ user_id: viewerId, name: viewerName });
      }
    });

    channelRef.current = channel;
    return () => {
      channel.unsubscribe().catch(() => {});
      channelRef.current = null;
    };
  }, [shrineId, ownerId, viewerId, viewerName]);

  const send = useCallback(
    async (body: string) => {
      const text = body.trim();
      if (!text || !viewerId) return;
      const res = await fetch("/api/shrine/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shrineId, body: text }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.message && !knownIdsRef.current.has(data.message.id)) {
        knownIdsRef.current.add(data.message.id);
        setMessages((prev) => [...prev, data.message]);
      }
    },
    [shrineId, viewerId],
  );

  return { messages, other, send };
}

function playChime(
  ctxRef: { current: AudioContext | null },
  lastAtRef: { current: number },
) {
  const now = Date.now();
  if (now - lastAtRef.current < 10_000) return; // throttle to once per 10s
  lastAtRef.current = now;
  try {
    if (!ctxRef.current) {
      const AC =
        (window.AudioContext as typeof AudioContext) ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctxRef.current = new AC();
    }
    const ctx = ctxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.6);
  } catch {
    // Autoplay policies may block until first user gesture — silent failure
    // is acceptable; the presence indicator still appears.
  }
}
