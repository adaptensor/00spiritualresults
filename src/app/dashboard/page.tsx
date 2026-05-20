import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { db } from "@/lib/db";
import { getOrCreateLocalUser } from "@/lib/auth";
import { getTheme } from "@/lib/shrine/themes";

export const dynamic = "force-dynamic";

async function trace<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string; meta?: unknown };
    console.error(
      `DASHBOARD_QUERY_FAIL label=${label} code=${err.code ?? "?"} msg=${err.message?.slice(0, 400) ?? "?"} meta=${JSON.stringify(err.meta)?.slice(0, 200) ?? "?"}`
    );
    throw e;
  }
}

export default async function DashboardPage() {
  const user = await trace("getOrCreateLocalUser", () => getOrCreateLocalUser());
  if (!user) redirect("/sign-in");

  const enrollments = await trace("enrollment.findMany", () =>
    db.enrollment.findMany({
      where: { userId: user.id },
      include: { module: { include: { lessons: { select: { id: true } } } } },
      orderBy: { startedAt: "desc" },
    })
  );
  const lessonsCompleted = await trace("lessonProgress.count", () =>
    db.lessonProgress.count({ where: { userId: user.id } })
  );
  const shrine = await trace("shrine.findUnique", () =>
    db.shrine.findUnique({ where: { userId: user.id } })
  );

  const shrineTheme = getTheme(shrine?.theme ?? "candlelit-chapel");

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
          <Link
            href="/shrine"
            className="group relative block overflow-hidden rounded-2xl border transition"
            style={{
              height: 200,
              background: shrineTheme.bg,
              borderColor: "rgba(139,106,31,0.18)",
              boxShadow: "0 1px 4px rgba(42,34,24,0.04)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(0,0,0,0.25) 100%)",
                pointerEvents: "none",
              }}
            />
            <div className="relative flex h-full flex-col items-center justify-center text-center">
              <p
                className="mb-1.5"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {shrineTheme.name}
              </p>
              <p
                className="text-[#FAF7EE] transition group-hover:text-white"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 24,
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                }}
              >
                Enter your shrine →
              </p>
            </div>
          </Link>
        </section>

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
