import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { QuizPlayer } from "@/components/QuizPlayer";
import { db } from "@/lib/db";
import { getOrCreateLocalUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const user = await getOrCreateLocalUser();
  if (!user) redirect("/sign-in");

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: { select: { id: true, slug: true, status: true, title: true } },
      quiz: {
        include: { questions: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (
    !lesson ||
    lesson.module.slug !== slug ||
    lesson.module.status !== "PUBLISHED" ||
    !lesson.quiz
  ) {
    notFound();
  }

  // Soft gate: must finish the lesson before its quiz.
  const progress = await db.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
    select: { id: true },
  });
  if (!progress) {
    redirect(`/modules/${slug}/lessons/${lesson.id}`);
  }

  // Best prior attempt (for context on retakes).
  const bestAttempt = await db.quizAttempt.findFirst({
    where: { userId: user.id, quizId: lesson.quiz.id },
    orderBy: { score: "desc" },
    select: { score: true, passed: true, completedAt: true },
  });

  // Strip correctIndex/explanation from the client payload — graded server-side.
  const sanitizedQuestions = lesson.quiz.questions.map((q) => ({
    id: q.id,
    order: q.order,
    prompt: q.prompt,
    choices: Array.isArray(q.choices) ? (q.choices as string[]) : [],
  }));

  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href={`/modules/${slug}/lessons/${lessonId}`}
          className="mb-6 inline-block text-sm text-[var(--color-parchment-deep)]/70 hover:text-[var(--color-gold-soft)]"
        >
          ← Back to lesson
        </Link>

        <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-gold-soft)]/70">
          {lesson.module.title}
        </p>
        <h1 className="mb-4 text-4xl text-[var(--color-gold-soft)]">
          {lesson.quiz.title}
        </h1>
        <p className="mb-2 text-[var(--color-parchment-deep)]">
          {sanitizedQuestions.length} questions · {lesson.quiz.passScore}% to pass
        </p>
        {bestAttempt && (
          <p className="mb-10 text-xs text-[var(--color-parchment-deep)]/60">
            Your best so far: {bestAttempt.score}%
            {bestAttempt.passed ? " — already passed" : ""}
          </p>
        )}
        {!bestAttempt && <div className="mb-10" />}

        <QuizPlayer
          quizId={lesson.quiz.id}
          moduleSlug={slug}
          passScore={lesson.quiz.passScore}
          questions={sanitizedQuestions}
        />
      </main>
    </div>
  );
}
