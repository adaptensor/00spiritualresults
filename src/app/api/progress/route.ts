import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getOrCreateLocalUser } from "@/lib/auth";

const BodySchema = z.object({
  lessonId: z.string().min(1),
  secondsSpent: z.number().int().min(0).max(60 * 60 * 6).optional(),
});

export async function POST(req: Request) {
  const user = await getOrCreateLocalUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request", issues: parsed.error.flatten() }, { status: 400 });
  }
  const { lessonId, secondsSpent = 0 } = parsed.data;

  // Validate lesson exists + belongs to a published module.
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { id: true, status: true } } },
  });
  if (!lesson || lesson.module.status !== "PUBLISHED") {
    return NextResponse.json({ error: "lesson_not_found" }, { status: 404 });
  }

  // Upsert progress.
  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { secondsSpent: { increment: secondsSpent } },
    create: { userId: user.id, lessonId, secondsSpent },
  });

  // Ensure user is enrolled in the module.
  await db.enrollment.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId: lesson.module.id } },
    update: {},
    create: { userId: user.id, moduleId: lesson.module.id },
  });

  // Check if the module is now fully complete.
  const totalLessons = await db.lesson.count({ where: { moduleId: lesson.module.id } });
  const doneLessons = await db.lessonProgress.count({
    where: {
      userId: user.id,
      lesson: { moduleId: lesson.module.id },
    },
  });
  if (totalLessons > 0 && doneLessons >= totalLessons) {
    await db.enrollment.update({
      where: { userId_moduleId: { userId: user.id, moduleId: lesson.module.id } },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true, completed: doneLessons, total: totalLessons });
}
