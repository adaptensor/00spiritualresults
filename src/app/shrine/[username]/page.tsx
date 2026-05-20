import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseObjects } from "@/lib/shrine/server";
import { ShrineRoomGuest } from "./ShrineRoomGuest";
import { InviteAcceptView } from "./InviteAcceptView";

export const dynamic = "force-dynamic";

// Guest view of a shrine, addressed by the owner's username slug.
//
// Permission gate:
//   - viewer is the owner          → redirect to /shrine
//   - shrine is PRIVATE            → 404 (do not leak existence)
//   - viewer is unauthed           → /sign-in?redirect_url=<here>
//   - viewer is in ShrineGuest     → render the room (read-only)
//   - everyone else                → 404
//
// Invite redemption (?invite=token): if the query is present we branch to a
// landing card asking the viewer to confirm. The actual redemption is a POST
// to /api/shrine/invite/redeem so link previewers cannot burn the token.

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ invite?: string }>;
};

export default async function ShrineGuestPage({ params, searchParams }: PageProps) {
  const { username: rawUsername } = await params;
  const { invite } = await searchParams;
  const username = rawUsername.toLowerCase();

  const owner = await db.user.findUnique({
    where: { username },
    include: { shrine: true },
  });
  if (!owner || !owner.shrine) notFound();

  const viewer = await getOrCreateLocalUser();

  // Branch 1: invite-token flow.
  if (invite) {
    if (!viewer) {
      const target = `/shrine/${username}?invite=${encodeURIComponent(invite)}`;
      redirect(`/sign-in?redirect_url=${encodeURIComponent(target)}`);
    }

    // The owner clicking their own invite link is a no-op; send them home.
    if (viewer.id === owner.id) redirect("/shrine");

    const inviteRow = await db.shrineInvite.findUnique({ where: { token: invite } });
    const validInvite =
      inviteRow &&
      inviteRow.shrineId === owner.shrine.id &&
      !inviteRow.revokedAt &&
      inviteRow.expiresAt > new Date() &&
      (inviteRow.usedById === null || inviteRow.usedById === viewer.id);

    if (!validInvite) {
      return <InviteInvalidView hostName={hostNameOf(owner)} />;
    }

    // Already redeemed by THIS viewer: skip the confirmation and go through
    // the normal gate (they're already in ShrineGuest, so the room renders).
    if (inviteRow.usedById === viewer.id) {
      redirect(`/shrine/${username}`);
    }

    return (
      <InviteAcceptView
        token={invite}
        username={username}
        hostName={hostNameOf(owner)}
      />
    );
  }

  // Branch 2: normal gate.
  if (viewer && viewer.id === owner.id) {
    redirect("/shrine");
  }

  if (owner.shrine.visibility === "PRIVATE") {
    notFound();
  }

  if (!viewer) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/shrine/${username}`)}`);
  }

  const guestRow = await db.shrineGuest.findUnique({
    where: { shrineId_guestId: { shrineId: owner.shrine.id, guestId: viewer.id } },
  });
  if (!guestRow || guestRow.blockedAt) {
    notFound();
  }

  const objects = parseObjects(owner.shrine.objects);
  const viewerName = viewer.name || viewer.username || "a visitor";

  return (
    <ShrineRoomGuest
      themeId={owner.shrine.theme}
      objects={objects}
      candleLit={owner.shrine.candleLit}
      musicOn={owner.shrine.musicOn}
      generatedBgUrl={owner.shrine.generatedBgUrl}
      shrineId={owner.shrine.id}
      ownerId={owner.id}
      viewerId={viewer.id}
      viewerName={viewerName}
    />
  );
}

function hostNameOf(owner: { name: string | null; username: string | null }) {
  return owner.name || owner.username || "your host";
}

function InviteInvalidView({ hostName }: { hostName: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a1410",
        color: "#E8DCC4",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 440,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(139,106,31,0.2)",
          borderRadius: 18,
          padding: "44px 36px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(232,220,196,0.55)",
            marginBottom: 18,
          }}
        >
          This door has closed
        </div>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 16,
            color: "rgba(232,220,196,0.8)",
            margin: "0 0 28px",
            lineHeight: 1.7,
          }}
        >
          The invitation from {hostName} has expired or been revoked. Reach out
          and ask for a fresh one if you&apos;d still like to visit.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.08)",
            color: "#E8DCC4",
            border: "1px solid rgba(232,220,196,0.2)",
            padding: "12px 28px",
            borderRadius: 100,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
