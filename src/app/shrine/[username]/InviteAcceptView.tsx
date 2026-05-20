"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Contemplative landing for redeeming a shrine invite. Renders only when the
// token is valid + unredeemed + viewer is signed in. The POST happens on
// explicit click so link previewers cannot accidentally burn the token.

type Props = {
  token: string;
  username: string;
  hostName: string;
};

export function InviteAcceptView({ token, username, hostName }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enter() {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/shrine/invite/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "This invite is no longer valid.");
      setSubmitting(false);
      return;
    }
    router.replace(`/shrine/${username}`);
  }

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
          An invitation
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 26,
            lineHeight: 1.3,
            margin: "0 0 14px",
            fontWeight: 400,
          }}
        >
          {hostName} has invited you<br />into their shrine.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 15,
            color: "rgba(232,220,196,0.7)",
            margin: "0 0 32px",
            lineHeight: 1.7,
          }}
        >
          A quiet, candlelit room where two souls can sit together.
        </p>
        <button
          onClick={enter}
          disabled={submitting}
          style={{
            background: "#8B6A1F",
            color: "#F5EDD9",
            border: "none",
            padding: "14px 32px",
            borderRadius: 100,
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            letterSpacing: "0.04em",
            cursor: submitting ? "default" : "pointer",
            opacity: submitting ? 0.6 : 1,
            transition: "all 0.25s",
          }}
        >
          {submitting ? "Entering…" : "Enter the room"}
        </button>
        {error ? (
          <div
            style={{
              marginTop: 18,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 13,
              color: "#C49A6C",
            }}
          >
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
