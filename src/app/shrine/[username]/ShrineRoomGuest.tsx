"use client";

import { ShrineRoom } from "@/components/shrine/ShrineRoom";
import type { ShrineObject } from "@/lib/shrine/types";

// Read-only client wrapper rendered to viewers who are NOT the shrine owner.
// No candle/music mutation — guests cannot toggle host state. Real-time
// presence + chat get wired in Phase 6; for now the room is just visible.

type Props = {
  themeId: string;
  objects: ShrineObject[];
  candleLit: boolean;
  musicOn: boolean;
  generatedBgUrl: string | null;
  hostName: string;
};

export function ShrineRoomGuest({
  themeId,
  objects,
  candleLit,
  musicOn,
  generatedBgUrl,
  hostName,
}: Props) {
  const projectedObjects = objects.map((o) =>
    o.type === "candle" ? { ...o, props: { ...o.props, lit: candleLit } } : o,
  );

  // The host is implicitly present in their own room — surface that to the
  // guest as the initial presence indicator. Phase 6 will replace this with
  // real Supabase presence state.
  const initial = (hostName || "?").charAt(0).toUpperCase();

  return (
    <ShrineRoom
      themeId={themeId}
      objects={projectedObjects}
      isHost={false}
      candleLit={candleLit}
      musicOn={musicOn}
      generatedBgUrl={generatedBgUrl}
      guest={{ name: hostName, initial }}
    />
  );
}
