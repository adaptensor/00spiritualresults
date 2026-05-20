export type ShrineTheme = {
  id: string;
  name: string;
  desc: string;
  bg: string;
  accent: string;
};

export const SHRINE_THEMES: ShrineTheme[] = [
  {
    id: "candlelit-chapel",
    name: "Candlelit Chapel",
    desc: "Soft stone arches, a single tall candle on a stone altar, dim warm light.",
    bg: [
      "radial-gradient(ellipse 30% 35% at 50% 38%, rgba(200,155,60,0.22) 0%, transparent 70%)",
      "radial-gradient(ellipse 60% 30% at 50% 95%, rgba(20,14,6,0.7) 0%, transparent 60%)",
      "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(60,42,16,0.4) 0%, transparent 80%)",
      "linear-gradient(180deg, #18110a 0%, #2c1f0e 30%, #3a2912 50%, #221608 80%, #0e0904 100%)",
    ].join(", "),
    accent: "rgba(200,155,60,0.35)",
  },
  {
    id: "forest-grove",
    name: "Forest Grove",
    desc: "Dappled green-gold sunlight, mossy stones, distant trees.",
    bg: [
      "radial-gradient(ellipse 25% 30% at 35% 25%, rgba(140,160,50,0.18) 0%, transparent 70%)",
      "radial-gradient(ellipse 20% 25% at 65% 35%, rgba(170,150,40,0.12) 0%, transparent 60%)",
      "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(10,16,6,0.7) 0%, transparent 60%)",
      "linear-gradient(180deg, #141e0c 0%, #1e2c12 25%, #253216 50%, #182210 80%, #0c1406 100%)",
    ].join(", "),
    accent: "rgba(140,160,50,0.30)",
  },
  {
    id: "mountain-altar",
    name: "Mountain Altar",
    desc: "Sunrise behind a single rock cairn, far peaks in haze.",
    bg: [
      "radial-gradient(ellipse 60% 25% at 50% 30%, rgba(220,160,80,0.20) 0%, transparent 70%)",
      "radial-gradient(ellipse 80% 30% at 50% 100%, rgba(60,50,70,0.6) 0%, transparent 60%)",
      "linear-gradient(180deg, #2a1e2e 0%, #3a2838 15%, #8a5a30 35%, #c4844a 45%, #8a5a30 55%, #3a3040 75%, #1a1420 100%)",
    ].join(", "),
    accent: "rgba(220,160,80,0.30)",
  },
  {
    id: "garden",
    name: "Garden",
    desc: "A low stone bench, white roses, a small fountain, twilight.",
    bg: [
      "radial-gradient(ellipse 40% 35% at 50% 50%, rgba(120,100,140,0.15) 0%, transparent 70%)",
      "radial-gradient(ellipse 25% 20% at 45% 65%, rgba(180,170,200,0.10) 0%, transparent 60%)",
      "radial-gradient(ellipse 80% 35% at 50% 100%, rgba(16,20,12,0.7) 0%, transparent 60%)",
      "linear-gradient(180deg, #1c1828 0%, #252230 20%, #2a3020 45%, #1e2818 65%, #141820 85%, #0e0e16 100%)",
    ].join(", "),
    accent: "rgba(150,130,170,0.30)",
  },
  {
    id: "hearth-room",
    name: "Hearth Room",
    desc: "A low fire in a stone fireplace, a sheepskin rug, winter quiet.",
    bg: [
      "radial-gradient(ellipse 35% 30% at 50% 60%, rgba(200,110,40,0.25) 0%, transparent 70%)",
      "radial-gradient(ellipse 20% 15% at 50% 55%, rgba(240,150,50,0.15) 0%, transparent 60%)",
      "radial-gradient(ellipse 80% 35% at 50% 100%, rgba(20,12,8,0.7) 0%, transparent 60%)",
      "linear-gradient(180deg, #161010 0%, #201410 25%, #2c1c10 45%, #3a2414 55%, #201410 75%, #100a08 100%)",
    ].join(", "),
    accent: "rgba(200,110,40,0.35)",
  },
  {
    id: "seashore",
    name: "Seashore at Dawn",
    desc: "Wet sand, soft mist, a piece of driftwood.",
    bg: [
      "radial-gradient(ellipse 70% 20% at 50% 35%, rgba(200,170,120,0.15) 0%, transparent 70%)",
      "radial-gradient(ellipse 80% 25% at 50% 100%, rgba(140,160,170,0.20) 0%, transparent 60%)",
      "linear-gradient(180deg, #1a2028 0%, #283038 20%, #4a5058 35%, #8a8070 45%, #a09480 50%, #6a7078 60%, #384048 80%, #1a2028 100%)",
    ].join(", "),
    accent: "rgba(180,160,120,0.25)",
  },
  {
    id: "desert-oasis",
    name: "Desert Oasis",
    desc: "A single palm, a still pool, twilight pink sky, the first star.",
    bg: [
      "radial-gradient(ellipse 50% 30% at 50% 25%, rgba(200,120,140,0.18) 0%, transparent 70%)",
      "radial-gradient(ellipse 30% 20% at 50% 70%, rgba(80,100,120,0.15) 0%, transparent 60%)",
      "linear-gradient(180deg, #2a1828 0%, #4a2838 18%, #8a4858 30%, #c08060 42%, #d0a070 48%, #a07850 58%, #4a3828 75%, #1a1418 100%)",
    ].join(", "),
    accent: "rgba(200,120,140,0.30)",
  },
];

export function getTheme(id: string): ShrineTheme {
  return SHRINE_THEMES.find((t) => t.id === id) ?? SHRINE_THEMES[0];
}
