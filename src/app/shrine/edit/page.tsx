import { redirect } from "next/navigation";
import { getOrCreateLocalUser } from "@/lib/auth";
import { getOrCreateShrine, parseObjects } from "@/lib/shrine/server";
import { ShrineEditor } from "@/components/shrine/ShrineEditor";
import type { ShrineVisibility, Soundscape } from "@/lib/shrine/types";

export const dynamic = "force-dynamic";

export default async function ShrineEditPage() {
  const user = await getOrCreateLocalUser();
  if (!user) redirect("/sign-in");

  const shrine = await getOrCreateShrine(user.id);
  const objects = parseObjects(shrine.objects);

  return (
    <ShrineEditor
      initial={{
        theme: shrine.theme,
        objects,
        soundscape: shrine.soundscape as Soundscape,
        visibility: shrine.visibility as ShrineVisibility,
        candleLit: shrine.candleLit,
        musicOn: shrine.musicOn,
        generatedBgUrl: shrine.generatedBgUrl,
      }}
    />
  );
}
