import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getOrCreateLocalUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { GenerateRequestSchema } from "@/lib/shrine/types";
import { buildGeminiPrompt } from "@/lib/shrine/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const IMAGEN_MODEL = process.env.IMAGEN_MODEL ?? "imagen-4.0-ultra-generate-001";
const IMAGEN_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict`;

type ImagenPrediction = { bytesBase64Encoded?: string; mimeType?: string };
type ImagenResponse = { predictions?: ImagenPrediction[] };

export async function POST(req: Request) {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured on the server." },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const prompt = buildGeminiPrompt(parsed.data.description, parsed.data.theme);

  const imagenRes = await fetch(IMAGEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "16:9",
        personGeneration: "DONT_ALLOW",
      },
    }),
  });

  if (!imagenRes.ok) {
    const detail = await imagenRes.text().catch(() => "");
    console.error(
      `[shrine/generate] Imagen ${imagenRes.status} on model "${IMAGEN_MODEL}":`,
      detail.slice(0, 1500),
    );
    return NextResponse.json(
      {
        error: "Imagen request failed",
        status: imagenRes.status,
        model: IMAGEN_MODEL,
        detail: detail.slice(0, 1500),
      },
      { status: 502 },
    );
  }

  const json = (await imagenRes.json()) as ImagenResponse;
  const prediction = json.predictions?.[0];
  const b64 = prediction?.bytesBase64Encoded;
  if (!b64) {
    return NextResponse.json(
      {
        error: "Imagen returned no image (likely a safety-filter refusal).",
        prompt,
      },
      { status: 422 },
    );
  }

  const buffer = Buffer.from(b64, "base64");
  const mimeType = prediction?.mimeType ?? "image/png";
  const ext = mimeType === "image/jpeg" ? "jpg" : "png";

  const blob = await put(
    `shrines/${user.id}/${Date.now()}.${ext}`,
    buffer,
    {
      access: "public",
      contentType: mimeType,
      addRandomSuffix: false,
    },
  );

  await db.shrine.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      theme: parsed.data.theme,
      generatedBgUrl: blob.url,
      generatedPrompt: prompt,
    },
    update: {
      generatedBgUrl: blob.url,
      generatedPrompt: prompt,
    },
  });

  return NextResponse.json({
    ok: true,
    imageUrl: blob.url,
    prompt,
  });
}

export async function DELETE() {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.shrine.update({
    where: { userId: user.id },
    data: { generatedBgUrl: null, generatedPrompt: null },
  });

  return NextResponse.json({ ok: true });
}
