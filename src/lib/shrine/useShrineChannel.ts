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
  const lastChimeAtRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Hydrate chat history once on mount.
  useEffect(() => {
    if (!viewer) return;
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
  }, [shrineId, viewer]);

  // Establish channel + presence.
  useEffect(() => {
    if (!viewer) return;
    const supabase = getSupabaseBrowser();
    const channel = supabase.channel(`shrine:${ownerId}`, {
      config: {
        presence: { key: `${PRESENCE_KEY_PREFIX}:${viewer.id}` },
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
      if (target && target === viewer.id) {
        window.location.href = "/dashboard";
      }
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
          if (m.user_id && m.user_id !== viewer.id) {
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

    channel.on("presence", { event: "join" }, ({ newPresences }) => {
      const isReal = (newPresences || []).some(
        (p) => (p as { user_id?: string }).user_id && (p as { user_id?: string }).user_id !== viewer.id,
      );
      if (isReal) playChime(audioCtxRef, lastChimeAtRef);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ user_id: viewer.id, name: viewer.name });
      }
    });

    channelRef.current = channel;
    return () => {
      channel.unsubscribe().catch(() => {});
      channelRef.current = null;
    };
  }, [shrineId, ownerId, viewer]);

  const send = useCallback(
    async (body: string) => {
      const text = body.trim();
      if (!text || !viewer) return;
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
    [shrineId, viewer],
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
