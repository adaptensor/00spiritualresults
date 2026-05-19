import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateLocalUser } from "@/lib/auth";

/**
 * PHASE 2 STUB — AI Module Generator
 *
 * The vision: an admin posts a topic ("Forgiveness across wisdom traditions",
 * "Contemplation in the Sufi heart") and an LLM agent reads the corpus
 * (Library_1-100, Quran translations, Bahai texts) and produces a complete
 * structured module:
 *   - title, subtitle, description
 *   - 3–7 lessons, each with markdown body, reflection prompt, ~10 min reading
 *   - one end-of-module quiz with 5 questions tied to the lessons
 *   - sourceTexts metadata so we can cite + audit
 *
 * Architecture sketch:
 *   1. Authorize: caller must be an admin (TODO: add User.role).
 *   2. Validate input topic + tradition tags.
 *   3. Retrieval: vector-search the corpus for relevant passages
 *      (corpus lives outside this app — TBD where: Supabase pgvector,
 *      Neon pgvector, or a separate /Adaptensor/spiritualresults-corpus repo).
 *   4. Generate with Anthropic Sonnet 4.6 (cheap + structured output via JSON
 *      schema). System prompt enforces:
 *        - Each lesson cites at least 2 source passages.
 *        - Reflection prompts are open-ended, never doctrinal.
 *        - No claim that one tradition is "right" or "best".
 *   5. Persist as Module with status=DRAFT + provenance JSON.
 *   6. Return moduleId for the admin review UI.
 *
 * Not implemented yet; this endpoint refuses to do anything in v1.
 */

const BodySchema = z.object({
  topic: z.string().min(3).max(300),
  traditions: z.array(z.string()).min(1),
  difficulty: z.number().int().min(1).max(5).default(1),
});

export async function POST(req: Request) {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // TODO(phase2): check user.role === "ADMIN" once we add roles.

  const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "bad_request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      error: "not_implemented",
      message:
        "AI module generation is Phase 2. The plan + architecture sketch is in this file's comments. For v1, modules are seeded via prisma/seed.ts.",
      receivedTopic: parsed.data.topic,
    },
    { status: 501 },
  );
}
