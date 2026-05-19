import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ModulesPage() {
  const modules = await db.module.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    include: { lessons: { select: { id: true } } },
  });

  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h1 className="mb-2 text-4xl text-[var(--color-gold-soft)]">Modules</h1>
          <p className="text-[var(--color-parchment-deep)]">
            Self-paced studies drawn from the world’s wisdom traditions.
          </p>
        </div>

        {modules.length === 0 ? (
          <p className="text-[var(--color-parchment-deep)]/70">
            No modules published yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {modules.map((m) => (
              <Link
                key={m.id}
                href={`/modules/${m.slug}`}
                className="block rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-ink-deep)] p-6 transition hover:border-[var(--color-gold-soft)]"
              >
                <div className="mb-2 flex flex-wrap gap-1">
                  {m.traditions.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[var(--color-gold)]/10 px-2 py-0.5 text-xs text-[var(--color-gold-soft)]"
                    >
                      {prettyTradition(t)}
                    </span>
                  ))}
                </div>
                <h3 className="mb-1 text-2xl text-[var(--color-gold-soft)]">
                  {m.title}
                </h3>
                {m.subtitle && (
                  <p className="mb-3 text-sm italic text-[var(--color-parchment-deep)]">
                    {m.subtitle}
                  </p>
                )}
                <p className="mb-4 line-clamp-3 text-sm text-[var(--color-parchment-deep)]">
                  {m.description}
                </p>
                <div className="flex justify-between text-xs text-[var(--color-parchment-deep)]/70">
                  <span>
                    {m.lessons.length} lesson{m.lessons.length === 1 ? "" : "s"}
                  </span>
                  <span>~{m.estimatedMinutes} min</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function prettyTradition(t: string): string {
  return t
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
