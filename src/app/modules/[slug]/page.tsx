import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { db } from "@/lib/db";
import { getOrCreateLocalUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const module = await db.module.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: { quiz: { select: { id: true } } },
      },
    },
  });
  if (!module || module.status !== "PUBLISHED") notFound();

  const user = await getOrCreateLocalUser();

  let completedLessonIds = new Set<string>();
  let enrolled = false;
  let enrollmentStatus: "ENROLLED" | "COMPLETED" | "ABANDONED" | null = null;
  // quizId → best score (0-100), passed
  const bestQuizByLessonId = new Map<
    string,
    { score: number; passed: boolean }
  >();

  if (user) {
    const quizIds = module.lessons.flatMap((l) => (l.quiz ? [l.quiz.id] : []));
    const [enrollment, progress, attempts] = await Promise.all([
      db.enrollment.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId: module.id } },
      }),
      db.lessonProgress.findMany({
        where: {
          userId: user.id,
          lessonId: { in: module.lessons.map((l) => l.id) },
        },
        select: { lessonId: true },
      }),
      quizIds.length > 0
        ? db.quizAttempt.findMany({
            where: { userId: user.id, quizId: { in: quizIds } },
            orderBy: { score: "desc" },
            select: { quizId: true, score: true, passed: true },
          })
        : Promise.resolve([] as { quizId: string; score: number; passed: boolean }[]),
    ]);
    enrolled = !!enrollment;
    enrollmentStatus = enrollment?.status ?? null;
    completedLessonIds = new Set(progress.map((p) => p.lessonId));

    // Map best score per quizId, then per lessonId for display.
    const bestByQuizId = new Map<string, { score: number; passed: boolean }>();
    for (const a of attempts) {
      const existing = bestByQuizId.get(a.quizId);
      if (!existing || a.score > existing.score) {
        bestByQuizId.set(a.quizId, { score: a.score, passed: a.passed });
      }
    }
    for (const lesson of module.lessons) {
      if (lesson.quiz) {
        const best = bestByQuizId.get(lesson.quiz.id);
        if (best) bestQuizByLessonId.set(lesson.id, best);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/modules"
          className="mb-6 inline-block text-sm text-[var(--color-parchment-deep)]/70 hover:text-[var(--color-gold-soft)]"
        >
          ← All modules
        </Link>

        <div className="mb-2 flex flex-wrap gap-1">
          {module.traditions.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[var(--color-gold)]/10 px-2 py-0.5 text-xs text-[var(--color-gold-soft)]"
            >
              {prettyTradition(t)}
            </span>
          ))}
        </div>

        <h1 className="mb-2 text-4xl text-[var(--color-gold-soft)]">{module.title}</h1>
        {module.subtitle && (
          <p className="mb-6 text-lg italic text-[var(--color-parchment-deep)]">
            {module.subtitle}
          </p>
        )}
        <p className="mb-8 leading-relaxed text-[var(--color-parchment-deep)]">
          {module.description}
        </p>

        {!user && (
          <Link
            href="/sign-up"
            className="mb-10 inline-block rounded-full bg-[var(--color-gold)] px-6 py-2 text-sm font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)]"
          >
            Sign up to begin
          </Link>
        )}

        {user && !enrolled && (
          <form action={enrollAction} className="mb-10">
            <input type="hidden" name="moduleId" value={module.id} />
            <button
              type="submit"
              className="rounded-full bg-[var(--color-gold)] px-6 py-2 text-sm font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)]"
            >
              Begin this module
            </button>
          </form>
        )}

        {enrollmentStatus === "COMPLETED" && (
          <div className="mb-10 rounded-lg border border-[var(--color-gold-soft)]/40 bg-[var(--color-gold-soft)]/5 p-4 text-center text-sm text-[var(--color-gold-soft)]">
            ✓ You&rsquo;ve completed this module.
          </div>
        )}

        <section>
          <h2 className="mb-4 text-xl text-[var(--color-gold-soft)]">Lessons</h2>
          <ol className="space-y-3">
            {module.lessons.map((lesson, i) => {
              const completed = completedLessonIds.has(lesson.id);
              const bestQuiz = bestQuizByLessonId.get(lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/modules/${module.slug}/lessons/${lesson.id}`}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-ink-deep)] p-4 transition hover:border-[var(--color-gold-soft)]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[var(--color-gold-soft)]/70">
                        Lesson {i + 1}
                        {lesson.quiz && (
                          <span className="ml-2 rounded bg-[var(--color-gold)]/15 px-1.5 py-0.5 text-[10px] tracking-normal text-[var(--color-gold-soft)]">
                            includes quiz
                          </span>
                        )}
                      </p>
                      <p className="text-lg text-[var(--color-parchment)]">{lesson.title}</p>
                      {bestQuiz && (
                        <p className="mt-1 text-xs text-[var(--color-parchment-deep)]/70">
                          {bestQuiz.passed ? "✓ Quiz passed" : "Quiz attempted"} ·
                          best {bestQuiz.score}%
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-[var(--color-parchment-deep)]/70">
                      {completed ? "✓ Done" : `${lesson.estimatedMinutes} min`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      </main>
    </div>
  );
}

async function enrollAction(formData: FormData) {
  "use server";
  const moduleId = String(formData.get("moduleId") ?? "");
  const user = await getOrCreateLocalUser();
  if (!user) redirect("/sign-in");
  await db.enrollment.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId } },
    update: {},
    create: { userId: user.id, moduleId },
  });
  // Re-render the same page with enrolled state.
}

function prettyTradition(t: string): string {
  return t
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
