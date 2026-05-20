"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShrineRoom } from "@/components/shrine/ShrineRoom";
import type { ShrineObject } from "@/lib/shrine/types";

type Props = {
  themeId: string;
  objects: ShrineObject[];
  candleLit: boolean;
  musicOn: boolean;
  generatedBgUrl: string | null;
};

export function ShrineRoomToolbar({
  themeId,
  objects,
  candleLit: initialCandle,
  musicOn: initialMusic,
  generatedBgUrl,
}: Props) {
  const router = useRouter();
  const [candleLit, setCandleLit] = useState(initialCandle);
  const [musicOn, setMusicOn] = useState(initialMusic);

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
      onToggleCandle={toggleCandle}
      onToggleMusic={toggleMusic}
      onEdit={() => router.push("/shrine/edit")}
    />
  );
}
