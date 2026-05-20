"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Flame, Music, UserPlus, Pencil, X, Send } from "lucide-react";
import { OBJECT_RENDERERS } from "./ScenePrimitives";
import { getTheme } from "@/lib/shrine/themes";
import type { ShrineObject } from "@/lib/shrine/types";
import type { ChatMsg } from "@/lib/shrine/useShrineChannel";

export type Guest = { name: string; initial: string } | null;

type ShrineRoomProps = {
  themeId: string;
  objects: ShrineObject[];
  isHost: boolean;
  candleLit: boolean;
  musicOn: boolean;
  editing?: boolean;
  generatedBgUrl?: string | null;
  selectedObjectId?: string | null;
  guest?: Guest;
  viewerId?: string;
  messages?: ChatMsg[];
  // When false, the chat strip is hidden even if a channel is wired. Used
  // when the host has set visibility=PRIVATE — the room is meant to feel
  // contemplative-alone, and old chat bubbles break that mood.
  chatEnabled?: boolean;
  onSendMessage?: (body: string) => Promise<void>;
  onToggleCandle?: () => void;
  onToggleMusic?: () => void;
  onEdit?: () => void;
  // When supplied (host only), the X button calls this instead of routing
  // directly to /dashboard, so the host can broadcast room:closed first.
  onLeave?: () => void;
  onMoveObject?: (id: string, x: number, y: number) => void;
  onSelectObject?: (id: string | null) => void;
};

export function ShrineRoom({
  themeId,
  objects,
  isHost,
  candleLit,
  musicOn,
  editing = false,
  generatedBgUrl = null,
  selectedObjectId = null,
  guest = null,
  viewerId,
  messages,
  chatEnabled = true,
  onSendMessage,
  onToggleCandle,
  onToggleMusic,
  onEdit,
  onLeave,
  onMoveObject,
  onSelectObject,
}: ShrineRoomProps) {
  const theme = getTheme(themeId);
  const [chatExpanded, setChatExpanded] = useState(false);

  const sceneStyle: React.CSSProperties = generatedBgUrl
    ? {
        backgroundImage: `url(${generatedBgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { background: theme.bg };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: editing ? "100%" : "100vh",
        overflow: "hidden",
        transition: "background 1.5s ease",
        ...sceneStyle,
      }}
    >
      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* theme badge */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 25,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
          padding: "6px 16px",
          borderRadius: 100,
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 500,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {theme.name}
        {generatedBgUrl ? " · Scene by Gemini" : ""}
      </div>

      {/* back pill */}
      {!editing && (
        <Link
          href="/dashboard"
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 30,
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(8px)",
            padding: "8px 18px",
            borderRadius: 100,
            textDecoration: "none",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "#5C4F3D",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            transition: "all 0.25s",
          }}
        >
          ← Back to dashboard
        </Link>
      )}

      {/* controls */}
      {!editing && (
        <ShrineControls
          isHost={isHost}
          candleLit={candleLit}
          musicOn={musicOn}
          onToggleCandle={onToggleCandle}
          onToggleMusic={onToggleMusic}
          onEdit={onEdit}
          onLeave={onLeave}
        />
      )}

      {/* objects */}
      {objects.map((obj) => (
        <DraggableObject
          key={obj.id}
          obj={obj}
          editing={editing}
          selected={selectedObjectId === obj.id}
          onMove={onMoveObject}
          onSelect={onSelectObject}
        />
      ))}

      {/* presence — shows the other party when wired to real-time (Phase 6) */}
      {!editing && guest && <PresenceIndicator guest={guest} />}

      {/* chat strip — only live when we have a real channel wired up AND
          the host hasn't set the room PRIVATE. */}
      {!editing && chatEnabled && onSendMessage && messages && (
        <ChatStrip
          expanded={chatExpanded}
          onToggle={() => setChatExpanded((v) => !v)}
          messages={messages}
          viewerId={viewerId}
          onSend={onSendMessage}
        />
      )}
    </div>
  );
}

/* ── Draggable object wrapper ──────────────────────────────────────── */

type DraggableObjectProps = {
  obj: ShrineObject;
  editing: boolean;
  selected: boolean;
  onMove?: (id: string, x: number, y: number) => void;
  onSelect?: (id: string | null) => void;
};

function DraggableObject({ obj, editing, selected, onMove, onSelect }: DraggableObjectProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerDown(e: React.PointerEvent) {
    if (!editing || !ref.current) return;
    e.preventDefault();
    onSelect?.(obj.id);

    const parent = ref.current.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startOx = obj.x;
    const startOy = obj.y;

    function move(ev: PointerEvent) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const nx = Math.max(0, Math.min(100, startOx + (dx / rect.width) * 100));
      const ny = Math.max(0, Math.min(100, startOy + (dy / rect.height) * 100));
      onMove?.(obj.id, nx, ny);
    }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const Render = OBJECT_RENDERERS[obj.type];
  if (!Render) return null;

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      style={{
        position: "absolute",
        left: `${obj.x}%`,
        top: `${obj.y}%`,
        transform: "translate(-50%, -50%)",
        cursor: editing ? "grab" : "default",
        zIndex: selected ? 20 : 10,
        transition: editing ? "none" : "left 0.5s ease, top 0.5s ease",
        filter: editing && selected ? "drop-shadow(0 0 8px rgba(184,137,60,0.6))" : "none",
        touchAction: "none",
      }}
    >
      {Render(obj.props)}
    </div>
  );
}

/* ── Controls ──────────────────────────────────────────────────────── */

type ShrineControlsProps = {
  isHost: boolean;
  candleLit: boolean;
  musicOn: boolean;
  onToggleCandle?: () => void;
  onToggleMusic?: () => void;
  onEdit?: () => void;
  onLeave?: () => void;
};

function ShrineControls({
  isHost,
  candleLit,
  musicOn,
  onToggleCandle,
  onToggleMusic,
  onEdit,
  onLeave,
}: ShrineControlsProps) {
  const leaveBtn: { icon: React.ReactNode; label: string; action?: () => void; href?: string } =
    onLeave
      ? { icon: <X size={18} strokeWidth={1.5} />, label: "Close the room", action: onLeave }
      : { icon: <X size={18} strokeWidth={1.5} />, label: "Leave", href: "/dashboard" };

  const btns: Array<{
    icon: React.ReactNode;
    label: string;
    action?: () => void;
    href?: string;
    active?: boolean;
  }> = [
    { icon: <Flame size={18} strokeWidth={1.5} />, label: candleLit ? "Candle on" : "Candle off", action: onToggleCandle, active: candleLit },
    { icon: <Music size={18} strokeWidth={1.5} />, label: musicOn ? "Sound on" : "Sound off", action: onToggleMusic, active: musicOn },
    ...(isHost ? [{ icon: <UserPlus size={18} strokeWidth={1.5} />, label: "Invite a friend", href: "/shrine/edit" }] : []),
    ...(isHost ? [{ icon: <Pencil size={18} strokeWidth={1.5} />, label: "Edit room", action: onEdit }] : []),
    leaveBtn,
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 30,
      }}
    >
      {btns.map((b, i) => {
        const inner = (
          <span
            title={b.label}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(8px)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              color: "#5C4F3D",
              opacity: b.active === false ? 0.5 : 1,
              transition: "all 0.25s",
            }}
          >
            {b.icon}
          </span>
        );
        if (b.href) {
          return (
            <Link key={i} href={b.href} aria-label={b.label}>
              {inner}
            </Link>
          );
        }
        return (
          <button
            key={i}
            onClick={b.action}
            aria-label={b.label}
            disabled={!b.action}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: b.action ? "pointer" : "default",
            }}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}

/* ── Presence indicator ─────────────────────────────────────────────── */

function PresenceIndicator({ guest }: { guest: { name: string; initial: string } }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: 24,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.80)",
        backdropFilter: "blur(8px)",
        padding: "10px 18px",
        borderRadius: 100,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <span
        className="shrine-sage-pulse"
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#5E7148",
          display: "inline-block",
        }}
      />
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#5E7148" }}>
        {guest.name} joined you.
      </span>
    </div>
  );
}

/* ── Chat strip ─────────────────────────────────────────────────────── */
// Live chat for the two-soul room. Subscribes via the useShrineChannel hook
// (called by the parent wrapper) and renders {messages, send}.

type ChatStripProps = {
  expanded: boolean;
  onToggle: () => void;
  messages: ChatMsg[];
  viewerId?: string;
  onSend: (body: string) => Promise<void>;
};

function ChatStrip({ expanded, onToggle, messages, viewerId, onSend }: ChatStripProps) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  async function submit() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    await onSend(text);
    setSending(false);
  }

  if (!expanded) {
    const unread = messages.length;
    return (
      <button
        onClick={onToggle}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 30,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(10px)",
          border: "none",
          padding: "10px 24px",
          borderRadius: 100,
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "#5C4F3D",
        }}
      >
        {unread > 0 ? `${unread} ${unread === 1 ? "message" : "messages"}` : "say something"}
      </button>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        zIndex: 30,
        width: "min(380px, calc(100vw - 48px))",
        maxHeight: "min(60vh, 520px)",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(139,106,31,0.08)",
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#5C4F3D" }}>
          {messages.length === 0 ? "Quiet" : "Together"}
        </span>
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#8A7A66",
            fontSize: 16,
            padding: "2px 6px",
          }}
          aria-label="Close"
        >
          −
        </button>
      </div>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 14,
              color: "#8A7A66",
              textAlign: "center",
              padding: "20px 0",
              lineHeight: 1.6,
            }}
          >
            The room is quiet. Say something kind.
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === viewerId;
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: mine ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background: mine ? "rgba(184,137,60,0.16)" : "rgba(139,106,31,0.06)",
                  color: "#3D3326",
                  padding: "8px 13px",
                  borderRadius: 14,
                  fontFamily: "var(--font-sans)",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                }}
              >
                {!mine && (
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "#8A7A66",
                      marginBottom: 2,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {m.senderName}
                  </div>
                )}
                {m.body}
              </div>
            );
          })
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 12px",
          borderTop: "1px solid rgba(139,106,31,0.08)",
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Speak softly…"
          maxLength={1000}
          style={{
            flex: 1,
            border: "1px solid rgba(139,106,31,0.16)",
            background: "rgba(255,255,255,0.7)",
            borderRadius: 100,
            padding: "8px 14px",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "#3D3326",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          aria-label="Send"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "#8B6A1F",
            color: "#F5EDD9",
            cursor: draft.trim() && !sending ? "pointer" : "default",
            opacity: draft.trim() && !sending ? 1 : 0.5,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={15} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}
