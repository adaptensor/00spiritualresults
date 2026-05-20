"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Flame, Music, UserPlus, Pencil, X } from "lucide-react";
import { OBJECT_RENDERERS } from "./ScenePrimitives";
import { getTheme } from "@/lib/shrine/themes";
import type { ShrineObject } from "@/lib/shrine/types";

type Guest = { name: string; initial: string } | null;

type ShrineRoomProps = {
  themeId: string;
  objects: ShrineObject[];
  isHost: boolean;
  candleLit: boolean;
  musicOn: boolean;
  editing?: boolean;
  generatedBgUrl?: string | null;
  selectedObjectId?: string | null;
  onToggleCandle?: () => void;
  onToggleMusic?: () => void;
  onEdit?: () => void;
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
  onToggleCandle,
  onToggleMusic,
  onEdit,
  onMoveObject,
  onSelectObject,
}: ShrineRoomProps) {
  const theme = getTheme(themeId);
  const [chatExpanded, setChatExpanded] = useState(false);
  const guest: Guest = null;

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

      {/* presence (host only) */}
      {!editing && isHost && guest && <PresenceIndicator guest={guest} />}

      {/* chat strip stub (visual only — full chat ships with invites session) */}
      {!editing && <ChatStrip expanded={chatExpanded} onToggle={() => setChatExpanded((v) => !v)} />}
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
};

function ShrineControls({
  isHost,
  candleLit,
  musicOn,
  onToggleCandle,
  onToggleMusic,
  onEdit,
}: ShrineControlsProps) {
  const btns: Array<{
    icon: React.ReactNode;
    label: string;
    action?: () => void;
    href?: string;
    active?: boolean;
  }> = [
    { icon: <Flame size={18} strokeWidth={1.5} />, label: candleLit ? "Candle on" : "Candle off", action: onToggleCandle, active: candleLit },
    { icon: <Music size={18} strokeWidth={1.5} />, label: musicOn ? "Sound on" : "Sound off", action: onToggleMusic, active: musicOn },
    { icon: <UserPlus size={18} strokeWidth={1.5} />, label: "Invite a friend (coming soon)" },
    ...(isHost ? [{ icon: <Pencil size={18} strokeWidth={1.5} />, label: "Edit room", action: onEdit }] : []),
    { icon: <X size={18} strokeWidth={1.5} />, label: "Leave", href: "/dashboard" },
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

/* ── Chat strip stub ────────────────────────────────────────────────── */
// Full real-time chat ships with the invites session. For now this is a
// purely visual pill that expands to a placeholder card.

function ChatStrip({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  if (!expanded) {
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
        say something
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
        width: "min(360px, calc(100vw - 48px))",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(14px)",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(139,106,31,0.06)",
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#5C4F3D" }}>
          Quiet
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
        style={{
          padding: "22px 18px",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 14,
          color: "#8A7A66",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        Inviting a friend in to talk is coming soon.
      </div>
    </div>
  );
}
