import { redirect } from "next/navigation";
import { getOrCreateLocalUser } from "@/lib/auth";
import { getOrCreateShrine, parseObjects } from "@/lib/shrine/server";
import { ShrineRoomToolbar } from "./ShrineRoomToolbar";

export const dynamic = "force-dynamic";

export default async function ShrinePage() {
  const user = await getOrCreateLocalUser();
  if (!user) redirect("/sign-in");

  const shrine = await getOrCreateShrine(user.id);
  const objects = parseObjects(shrine.objects);

  const viewerName = user.name || user.username || "you";

  return (
    <ShrineRoomToolbar
      themeId={shrine.theme}
      objects={objects}
      candleLit={shrine.candleLit}
      musicOn={shrine.musicOn}
      generatedBgUrl={shrine.generatedBgUrl}
      shrineId={shrine.id}
      viewerId={user.id}
      viewerName={viewerName}
    />
  );
}
