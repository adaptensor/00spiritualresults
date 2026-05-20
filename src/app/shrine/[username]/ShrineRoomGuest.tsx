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
  hostName: string;
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
  hostName,
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

  // If real presence has resolved someone in the room, prefer that; otherwise
  // fall back to "the host's room" as ambient presence so the room feels held.
  const guest =
    other ??
    (hostName
      ? { name: hostName, initial: (hostName || "?").charAt(0).toUpperCase() }
      : null);

  return (
    <ShrineRoom
      themeId={themeId}
      objects={projectedObjects}
      isHost={false}
      candleLit={candleLit}
      musicOn={musicOn}
      generatedBgUrl={generatedBgUrl}
      guest={guest}
      viewerId={viewerId}
      messages={messages}
      onSendMessage={send}
    />
  );
}
