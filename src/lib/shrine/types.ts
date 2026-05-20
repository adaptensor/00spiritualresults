import { z } from "zod";

export const SHRINE_OBJECT_TYPES = [
  "candle",
  "parchment",
  "frame",
  "flower",
  "beads",
  "incense",
  "placard",
] as const;

export type ShrineObjectType = (typeof SHRINE_OBJECT_TYPES)[number];

export const ShrineObjectPropsSchema = z
  .object({
    lit: z.boolean().optional(),
    text: z.string().max(280).optional(),
    word: z.string().max(40).optional(),
    scale: z.number().min(0.5).max(2).optional(),
  })
  .strict();

export const ShrineObjectSchema = z
  .object({
    id: z.string().min(1).max(40),
    type: z.enum(SHRINE_OBJECT_TYPES),
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    props: ShrineObjectPropsSchema.default({}),
  })
  .strict();

export type ShrineObject = z.infer<typeof ShrineObjectSchema>;
export type ShrineObjectProps = z.infer<typeof ShrineObjectPropsSchema>;

export const ShrineVisibilityEnum = z.enum(["INVITED", "LINK", "PRIVATE"]);
export type ShrineVisibility = z.infer<typeof ShrineVisibilityEnum>;

export const SoundscapeEnum = z.enum([
  "wind",
  "bells",
  "water",
  "fire crackle",
  "silence",
]);
export type Soundscape = z.infer<typeof SoundscapeEnum>;

export const ShrineUpdateSchema = z
  .object({
    theme: z.string().min(1).max(40).optional(),
    objects: z.array(ShrineObjectSchema).max(7).optional(),
    soundscape: SoundscapeEnum.optional(),
    visibility: ShrineVisibilityEnum.optional(),
    candleLit: z.boolean().optional(),
    musicOn: z.boolean().optional(),
  })
  .strict();

export type ShrineUpdate = z.infer<typeof ShrineUpdateSchema>;

export const GenerateRequestSchema = z
  .object({
    description: z.string().max(600).optional(),
    theme: z.string().min(1).max(40),
  })
  .strict();

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
