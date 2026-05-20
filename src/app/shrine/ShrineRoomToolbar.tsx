"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShrineRoom } from "@/components/shrine/ShrineRoom";
import type { ShrineObject, ShrineVisibility } from "@/lib/shrine/types";
import { useShrineChannel } from "@/lib/shrine/useShrineChannel";

type Props = {
  themeId: string;
  objects: ShrineObject[];
  candleLit: boolean;
  musicOn: boolean;
  generatedBgUrl: string | null;
  shrineId: string;
  viewerId: string;
  viewerName: string;
  visibility: ShrineVisibility;
};

export function ShrineRoomToolbar({
  themeId,
  objects,
  candleLit: initialCandle,
  musicOn: initialMusic,
  generatedBgUrl,
  shrineId,
  viewerId,
  viewerName,
  visibility,
}: Props) {
  const router = useRouter();
  const [candleLit, setCandleLit] = useState(initialCandle);
  const [musicOn, setMusicOn] = useState(initialMusic);

  // In PRIVATE mode the room is meant to feel contemplative-alone — the host
  // does not join the realtime channel at all. No presence, no chime, no
  // chat strip even if a guest is somehow still subscribed from before.
  const isPrivate = visibility === "PRIVATE";
  const { messages, other, send } = useShrineChannel({
    shrineId,
    ownerId: viewerId, // host: ownerId === viewerId
    viewer: isPrivate ? null : { id: viewerId, name: viewerName },
  });

  async function toggleCandle() {
    const next = !candleLit;
    setCandleLit(next);
    await fetch("/api/shrine", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candleLit: next }),
    }).catch(() => {});
  }

  async function toggleMusic() {
    const next = !musicOn;
    setMusicOn(next);
    await fetch("/api/shrine", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ musicOn: next }),
    }).catch(() => {});
  }

  // Host clicked X. Broadcast room:closed so any connected guest is sent
  // home, then navigate. Best-effort: if the API call fails we still leave.
  async function leave() {
    if (!isPrivate) {
      await fetch("/api/shrine/leave", { method: "POST" }).catch(() => {});
    }
    router.push("/dashboard");
  }

  // When candle is toggled off via the global toggle, dim every candle object too.
  const projectedObjects = objects.map((o) =>
    o.type === "candle" ? { ...o, props: { ...o.props, lit: candleLit } } : o,
  );

  return (
    <ShrineRoom
      themeId={themeId}
      objects={projectedObjects}
      isHost
      candleLit={candleLit}
      musicOn={musicOn}
      generatedBgUrl={generatedBgUrl}
      guest={other}
      viewerId={viewerId}
      messages={messages}
      chatEnabled={!isPrivate}
      onSendMessage={send}
      onToggleCandle={toggleCandle}
      onToggleMusic={toggleMusic}
      onEdit={() => router.push("/shrine/edit")}
      onLeave={leave}
    />
  );
}
