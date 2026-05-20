"use client";

import { ShrineRoom } from "@/components/shrine/ShrineRoom";
import type { ShrineObject } from "@/lib/shrine/types";
import { useShrineChannel } from "@/lib/shrine/useShrineChannel";

// Read-only client wrapper rendered to viewers who are NOT the shrine owner.
// Guests cannot toggle candle/music. Realtime presence + chat come from the
// useShrineChannel hook; the host is shown as ambient initial presence so the
// guest does not feel like they walked into an empty room.

type Props = {
  themeId: string;
  objects: ShrineObject[];
  candleLit: boolean;
  musicOn: boolean;
  generatedBgUrl: string | null;
  shrineId: string;
  ownerId: string;
  viewerId: string;
  viewerName: string;
};

export function ShrineRoomGuest({
  themeId,
  objects,
  candleLit,
  musicOn,
  generatedBgUrl,
  shrineId,
  ownerId,
  viewerId,
  viewerName,
}: Props) {
  const projectedObjects = objects.map((o) =>
    o.type === "candle" ? { ...o, props: { ...o.props, lit: candleLit } } : o,
  );

  const { messages, other, send } = useShrineChannel({
    shrineId,
    ownerId,
    viewer: { id: viewerId, name: viewerName },
  });

  return (
    <ShrineRoom
      themeId={themeId}
      objects={projectedObjects}
      isHost={false}
      candleLit={candleLit}
      musicOn={musicOn}
      generatedBgUrl={generatedBgUrl}
      guest={other}
      viewerId={viewerId}
      messages={messages}
      onSendMessage={send}
    />
  );
}
