"use client";

import { useEffect, useState } from "react";

// Editor-side panel for issuing, copying, revoking invite links and managing
// the existing guest whitelist. Lives inside <ShrineEditor>. Email field is
// wired today — the actual send happens in Phase 5 once Resend is in place.

type Invite = {
  id: string;
  token: string;
  url: string;
  invitedEmail: string | null;
  expiresAt: string;
  createdAt: string;
};

type Guest = {
  id: string;
  blockedAt: string | null;
  createdAt: string;
  user: { id: string; username: string | null; name: string | null; email: string };
};

export function InvitePanel() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function refresh() {
    const [iRes, gRes] = await Promise.all([
      fetch("/api/shrine/invite"),
      fetch("/api/shrine/guests"),
    ]);
    if (iRes.ok) {
      const data = await iRes.json();
      setInvites(data.invites);
    }
    if (gRes.ok) {
      const data = await gRes.json();
      setGuests(data.guests);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createInvite() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/shrine/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email ? { email } : {}),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not create invite.");
      setBusy(false);
      return;
    }
    setEmail("");
    setBusy(false);
    refresh();
  }

  async function revokeInvite(id: string) {
    await fetch(`/api/shrine/invite/${id}`, { method: "DELETE" });
    refresh();
  }

  async function blockGuest(id: string) {
    await fetch(`/api/shrine/guests/${id}`, { method: "DELETE" });
    refresh();
  }

  async function copyLink(invite: Invite) {
    await navigator.clipboard.writeText(invite.url);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId((c) => (c === invite.id ? null : c)), 1600);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="friend@example.com (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-[rgba(139,106,31,0.20)] bg-white px-3 py-2 text-[13px] text-[#5C4F3D] outline-none focus:border-[#B8893C]"
        />
        <button
          onClick={createInvite}
          disabled={busy}
          className="rounded-full bg-[#8B6A1F] px-4 py-2 text-[12px] font-medium text-[#F5EDD9] transition hover:bg-[#A07728] disabled:opacity-60"
        >
          {busy ? "…" : email ? "Send" : "Get link"}
        </button>
      </div>
      {error && <p className="text-xs text-[#A85C1B]">{error}</p>}

      {invites.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8A7A66]">
            Pending invites
          </p>
          <ul className="flex flex-col gap-1.5">
            {invites.map((i) => (
              <li
                key={i.id}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                style={{ background: "rgba(139,106,31,0.04)" }}
              >
                <span className="flex-1 truncate text-[12px] text-[#5C4F3D]">
                  {i.invitedEmail ?? "Link invite"}
                </span>
                <button
                  onClick={() => copyLink(i)}
                  className="text-[11px] text-[#8B6A1F] underline-offset-2 hover:underline"
                >
                  {copiedId === i.id ? "Copied" : "Copy link"}
                </button>
                <button
                  onClick={() => revokeInvite(i.id)}
                  className="text-[11px] text-[#A85C1B] hover:opacity-80"
                  title="Revoke"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {guests.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8A7A66]">
            Current guests
          </p>
          <ul className="flex flex-col gap-1.5">
            {guests.map((g) => (
              <li
                key={g.id}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                style={{
                  background: g.blockedAt ? "rgba(168,92,27,0.06)" : "rgba(94,113,72,0.06)",
                  opacity: g.blockedAt ? 0.55 : 1,
                }}
              >
                <span className="flex-1 truncate text-[12px] text-[#5C4F3D]">
                  {g.user.name || g.user.username || g.user.email}
                  {g.blockedAt ? " · removed" : ""}
                </span>
                {!g.blockedAt && (
                  <button
                    onClick={() => blockGuest(g.id)}
                    className="text-[11px] text-[#A85C1B] hover:opacity-80"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {invites.length === 0 && guests.length === 0 && (
        <p
          className="text-[12px] italic text-[#8A7A66]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Generate a link or invite by email to share this shrine with one soul.
        </p>
      )}
    </div>
  );
}
