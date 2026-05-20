import { NextResponse } from "next/server";
import { getOrCreateLocalUser } from "@/lib/auth";
import { GenerateRequestSchema } from "@/lib/shrine/types";
import { buildGeminiPrompt } from "@/lib/shrine/prompt";

// Stub. Real Gemini wiring ships in a follow-up:
//   1. Add GOOGLE_GENERATIVE_AI_API_KEY to env_vars_jamie.txt + Vercel.
//   2. Call Imagen 3 / Gemini 2.0 Flash with the prompt below.
//   3. Upload the returned PNG to Vercel Blob (or GCS).
//   4. Persist generatedBgUrl + generatedPrompt on the user's Shrine row.
export async function POST(req: Request) {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const prompt = buildGeminiPrompt(parsed.data.description, parsed.data.theme);

  return NextResponse.json(
    {
      ok: false,
      reason: "not_implemented",
      prompt,
      imageUrl: null,
      message:
        "Gemini scene generation is queued for the next session. For now the preset theme background will be used.",
    },
    { status: 501 },
  );
}
