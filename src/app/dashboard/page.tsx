import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { db } from "@/lib/db";
import { getOrCreateLocalUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getOrCreateLocalUser();
  if (!user) redirect("/sign-in");

  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      module: {
        include: {
          lessons: { select: { id: true } },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  const lessonsCompleted = await db.lessonProgress.count({
    where: { userId: user.id },
  });

  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h1 className="mb-2 text-4xl text-[var(--color-gold-soft)]">
            Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-[var(--color-parchment-deep)]">
            {lessonsCompleted === 0
              ? "Your path begins with a single lesson."
              : `You’ve completed ${lessonsCompleted} lesson${lessonsCompleted === 1 ? "" : "s"} so far.`}
          </p>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl text-[var(--color-gold-soft)]">Your modules</h2>

          {enrollments.length === 0 ? (
            <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-ink-deep)] p-8 text-center">
              <p className="mb-4 text-[var(--color-parchment-deep)]">
                You haven’t begun a module yet.
              </p>
              <Link
                href="/modules"
                className="inline-block rounded-full bg-[var(--color-gold)] px-6 py-2 text-sm font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)]"
              >
                Browse modules
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {enrollments.map((e) => (
                <Link
                  key={e.id}
                  href={`/modules/${e.module.slug}`}
                  className="block rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-ink-deep)] p-6 transition hover:border-[var(--color-gold-soft)]"
                >
                  <p className="mb-1 text-xs uppercase tracking-widest text-[var(--color-gold-soft)]/70">
                    {e.status === "COMPLETED" ? "Completed" : "In progress"}
                  </p>
                  <h3 className="mb-1 text-xl text-[var(--color-gold-soft)]">
                    {e.module.title}
                  </h3>
                  {e.module.subtitle && (
                    <p className="text-sm text-[var(--color-parchment-deep)]">
                      {e.module.subtitle}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-[var(--color-parchment-deep)]/70">
                    {e.module.lessons.length} lesson
                    {e.module.lessons.length === 1 ? "" : "s"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
