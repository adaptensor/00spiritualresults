"use client";

import type { ShrineObjectProps, ShrineObjectType } from "@/lib/shrine/types";

type PrimitiveProps = { scale?: number } & ShrineObjectProps;

export function ShrineCandle({ lit = true, scale = 1 }: PrimitiveProps) {
  const s = scale;
  return (
    <div
      style={{
        position: "relative",
        width: 24 * s,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {lit && (
        <div
          style={{
            position: "absolute",
            top: -30 * s,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60 * s,
            height: 60 * s,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,200,80,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}
      {lit && (
        <div
          className="shrine-candle-flame"
          style={{
            width: 10 * s,
            height: 20 * s,
            marginBottom: -3 * s,
            background:
              "radial-gradient(ellipse at 50% 80%, #ffe680 0%, #ff9d00 40%, transparent 100%)",
            borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
          }}
        />
      )}
      <div
        style={{
          width: 14 * s,
          height: 52 * s,
          background:
            "linear-gradient(180deg, #f5e8cc 0%, #e8d8b0 50%, #dcc898 100%)",
          borderRadius: `${3 * s}px ${3 * s}px ${2 * s}px ${2 * s}px`,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      />
      <div
        style={{
          width: 22 * s,
          height: 6 * s,
          background: "linear-gradient(180deg, #8a7a60 0%, #6a5a40 100%)",
          borderRadius: `0 0 ${3 * s}px ${3 * s}px`,
        }}
      />
    </div>
  );
}

export function ShrineParchment({ text = "", scale = 1 }: PrimitiveProps) {
  const s = scale;
  return (
    <div
      style={{
        width: 140 * s,
        padding: `${14 * s}px ${16 * s}px`,
        background: "linear-gradient(145deg, #f5ecd4 0%, #ede0c0 100%)",
        borderRadius: 4 * s,
        transform: "rotate(-1.5deg)",
        boxShadow:
          "0 3px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
        border: "1px solid rgba(180,160,120,0.25)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 13 * s,
          fontStyle: "italic",
          color: "#4a3a20",
          lineHeight: 1.6,
          textAlign: "center",
          wordBreak: "break-word",
          margin: 0,
        }}
      >
        {text || "A sacred passage\nwritten by the host."}
      </p>
    </div>
  );
}

export function ShrineFrame({ scale = 1 }: PrimitiveProps) {
  const s = scale;
  return (
    <div
      style={{
        width: 70 * s,
        height: 85 * s,
        padding: 5 * s,
        border: `${2 * s}px solid rgba(184,137,60,0.6)`,
        borderRadius: 2 * s,
        background:
          "linear-gradient(135deg, rgba(40,30,16,0.5) 0%, rgba(60,45,25,0.4) 100%)",
        boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 1 * s,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(200,170,120,0.15) 0%, rgba(80,60,30,0.2) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 10 * s,
            color: "rgba(200,170,120,0.4)",
            fontStyle: "italic",
          }}
        >
          icon
        </span>
      </div>
    </div>
  );
}

export function ShrineFlower({ scale = 1 }: PrimitiveProps) {
  const s = scale;
  const ps = 8 * s;
  return (
    <svg width={40 * s} height={40 * s} viewBox="0 0 40 40">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="20"
          cy="20"
          rx={ps}
          ry={ps * 1.4}
          fill="rgba(245,235,220,0.7)"
          stroke="rgba(200,180,140,0.3)"
          strokeWidth="0.5"
          transform={`rotate(${a} 20 20) translate(0 -${ps * 0.8})`}
        />
      ))}
      <circle cx="20" cy="20" r={4 * s} fill="rgba(220,190,100,0.6)" />
    </svg>
  );
}

export function ShrineBeads({ scale = 1 }: PrimitiveProps) {
  const s = scale;
  const beads: { x: number; y: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI + 0.3;
    const rx = 22 * s;
    const ry = 14 * s;
    beads.push({ x: 28 + Math.cos(angle) * rx, y: 18 + Math.sin(angle) * ry });
  }
  return (
    <svg width={60 * s} height={38 * s} viewBox="0 0 60 38">
      <path
        d={`M ${beads.map((b) => `${b.x},${b.y}`).join(" L ")}`}
        fill="none"
        stroke="rgba(160,130,80,0.4)"
        strokeWidth="1"
      />
      {beads.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r={3 * s}
          fill="rgba(140,100,50,0.6)"
          stroke="rgba(100,70,30,0.3)"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

export function ShrineIncense({ scale = 1 }: PrimitiveProps) {
  const s = scale;
  return (
    <div
      style={{
        position: "relative",
        width: 20 * s,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {[0, 0.8, 1.6].map((d, i) => (
        <div
          key={i}
          className="shrine-smoke"
          style={{
            position: "absolute",
            top: -8 * s,
            left: "50%",
            width: 4 * s,
            height: 4 * s,
            borderRadius: "50%",
            background: "rgba(200,190,170,0.5)",
            animationDelay: `${d}s`,
            animationDuration: `${2.2 + i * 0.4}s`,
          }}
        />
      ))}
      <div
        style={{
          width: 3 * s,
          height: 3 * s,
          borderRadius: "50%",
          background: "#e09040",
          boxShadow: "0 0 4px rgba(220,140,40,0.5)",
          marginBottom: -1,
        }}
      />
      <div
        style={{
          width: 2 * s,
          height: 44 * s,
          background: "linear-gradient(180deg, #8a7050 0%, #6a5040 100%)",
          borderRadius: 1,
        }}
      />
      <div
        style={{
          width: 16 * s,
          height: 5 * s,
          background: "rgba(100,80,50,0.6)",
          borderRadius: "0 0 4px 4px",
        }}
      />
    </div>
  );
}

export function ShrinePlacard({ word = "Peace", scale = 1 }: PrimitiveProps) {
  const s = scale;
  return (
    <div
      style={{
        padding: `${8 * s}px ${18 * s}px`,
        background: "linear-gradient(135deg, #f2e8d0 0%, #e8dcc0 100%)",
        borderRadius: 3 * s,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        border: "1px solid rgba(180,160,120,0.2)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 18 * s,
          fontWeight: 400,
          color: "#3a2a14",
          letterSpacing: "-0.01em",
        }}
      >
        {word}.
      </span>
    </div>
  );
}

export const OBJECT_RENDERERS: Record<
  ShrineObjectType,
  (props: PrimitiveProps) => React.ReactNode
> = {
  candle: (p) => <ShrineCandle {...p} />,
  parchment: (p) => <ShrineParchment {...p} />,
  frame: (p) => <ShrineFrame {...p} />,
  flower: (p) => <ShrineFlower {...p} />,
  beads: (p) => <ShrineBeads {...p} />,
  incense: (p) => <ShrineIncense {...p} />,
  placard: (p) => <ShrinePlacard {...p} />,
};
