import "server-only";
import { db } from "@/lib/db";
import { defaultObjects } from "./objects";
import { ShrineObjectSchema, type ShrineObject } from "./types";

export async function getOrCreateShrine(userId: string) {
  const existing = await db.shrine.findUnique({ where: { userId } });
  if (existing) return existing;

  return db.shrine.create({
    data: {
      userId,
      objects: defaultObjects() as object[],
    },
  });
}

export function parseObjects(raw: unknown): ShrineObject[] {
  if (!Array.isArray(raw)) return [];
  const out: ShrineObject[] = [];
  for (const item of raw) {
    const parsed = ShrineObjectSchema.safeParse(item);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}
