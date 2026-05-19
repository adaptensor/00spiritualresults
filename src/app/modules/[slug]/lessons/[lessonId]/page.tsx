import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { LessonCompleteButton } from "@/components/LessonReader";
import { db } from "@/lib/db";
import { getOrCreateLocalUser } from "@/lib/auth";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export default async function LessonPage({
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
      module: {
        include: { lessons: { orderBy: { order: "asc" }, select: { id: true } } },
      },
      quiz: { select: { id: true } },
    },
  });
  if (!lesson || lesson.module.slug !== slug || lesson.module.status !== "PUBLISHED") {
    notFound();
  }

  // Auto-enroll on first lesson view.
  await db.enrollment.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId: lesson.moduleId } },
    update: {},
    create: { userId: user.id, moduleId: lesson.moduleId },
  });

  const progress = await db.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
    select: { id: true },
  });

  const lessonIndex = lesson.module.lessons.findIndex((l) => l.id === lesson.id);
  const nextLessonId = lesson.module.lessons[lessonIndex + 1]?.id ?? null;

  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href={`/modules/${slug}`}
          className="mb-6 inline-block text-sm text-[var(--color-parchment-deep)]/70 hover:text-[var(--color-gold-soft)]"
        >
          ← Back to module
        </Link>

        <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-gold-soft)]/70">
          Lesson {lessonIndex + 1} of {lesson.module.lessons.length}
        </p>
        <h1 className="mb-8 text-4xl text-[var(--color-gold-soft)]">{lesson.title}</h1>

        <article
          className="prose-spiritual"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.body) }}
        />

        {lesson.reflectionPrompt && (
          <section className="mt-10 rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-ink-deep)] p-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-gold-soft)]">
              Reflection
            </p>
            <p className="italic text-[var(--color-parchment-deep)]">
              {lesson.reflectionPrompt}
            </p>
          </section>
        )}

        <LessonCompleteButton
          lessonId={lesson.id}
          moduleSlug={slug}
          alreadyCompleted={!!progress}
          nextLessonId={nextLessonId}
          hasQuiz={!!lesson.quiz}
        />
      </main>
    </div>
  );
}
