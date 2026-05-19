import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getOrCreateLocalUser } from "@/lib/auth";

const BodySchema = z.object({
  quizId: z.string().min(1),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        chosenIndex: z.number().int().min(0).max(20),
      }),
    )
    .min(1)
    .max(50),
});

export async function POST(req: Request) {
  const user = await getOrCreateLocalUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "bad_request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { quizId, answers } = parsed.data;

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { orderBy: { order: "asc" } },
      lesson: {
        include: { module: { select: { id: true, status: true } } },
      },
    },
  });
  if (!quiz || quiz.lesson.module.status !== "PUBLISHED") {
    return NextResponse.json({ error: "quiz_not_found" }, { status: 404 });
  }

  const answerByQuestion = new Map<string, number>();
  for (const a of answers) answerByQuestion.set(a.questionId, a.chosenIndex);

  const results = quiz.questions.map((q) => {
    const chosenIndex = answerByQuestion.has(q.id)
      ? answerByQuestion.get(q.id)!
      : null;
    const isCorrect =
      chosenIndex !== null && chosenIndex === q.correctIndex;
    return {
      questionId: q.id,
      chosenIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const total = quiz.questions.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const score = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const passed = score >= quiz.passScore;

  await db.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      score,
      passed,
      answers: answers,
    },
  });

  let moduleCompleted = false;

  if (passed) {
    // Defensive: ensure the host lesson is marked complete.
    await db.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId: user.id, lessonId: quiz.lesson.id },
      },
      update: {},
      create: { userId: user.id, lessonId: quiz.lesson.id },
    });

    const moduleId = quiz.lesson.module.id;
    const [totalLessons, doneLessons] = await Promise.all([
      db.lesson.count({ where: { moduleId } }),
      db.lessonProgress.count({
        where: { userId: user.id, lesson: { moduleId } },
      }),
    ]);
    if (totalLessons > 0 && doneLessons >= totalLessons) {
      await db.enrollment.upsert({
        where: { userId_moduleId: { userId: user.id, moduleId } },
        update: { status: "COMPLETED", completedAt: new Date() },
        create: {
          userId: user.id,
          moduleId,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
      moduleCompleted = true;
    }
  }

  return NextResponse.json({
    score,
    passed,
    passScore: quiz.passScore,
    correctCount,
    total,
    moduleCompleted,
    results,
  });
}
