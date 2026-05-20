import type { ShrineObject, ShrineObjectType } from "./types";

export type ShrineObjectDef = {
  type: ShrineObjectType;
  label: string;
  emoji: string;
  defaults: ShrineObject["props"];
};

export const AVAILABLE_OBJECTS: ShrineObjectDef[] = [
  { type: "candle", label: "Lit candle", emoji: "🕯", defaults: { lit: true } },
  { type: "parchment", label: "Sacred passage", emoji: "📜", defaults: { text: "" } },
  { type: "frame", label: "Icon or photo", emoji: "🖼", defaults: {} },
  { type: "flower", label: "Flower offering", emoji: "🌸", defaults: {} },
  { type: "beads", label: "Prayer beads", emoji: "📿", defaults: {} },
  { type: "incense", label: "Incense stick", emoji: "🪔", defaults: {} },
  { type: "placard", label: "A single word", emoji: "🪧", defaults: { word: "Peace" } },
];

export const MAX_OBJECTS = 7;

export function defaultObjects(): ShrineObject[] {
  return [
    {
      id: "obj-candle-1",
      type: "candle",
      x: 50,
      y: 58,
      props: { lit: true },
    },
    {
      id: "obj-parchment-1",
      type: "parchment",
      x: 28,
      y: 48,
      props: { text: "Be still, and know." },
    },
    {
      id: "obj-flower-1",
      type: "flower",
      x: 72,
      y: 64,
      props: {},
    },
  ];
}
