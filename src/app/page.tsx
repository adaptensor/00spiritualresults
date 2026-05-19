import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const traditions = [
  "Christianity",
  "Islam",
  "Buddhism",
  "Hinduism",
  "Judaism",
  "Sufism",
  "Taoism",
  "Confucianism",
  "Bahá’í",
  "Jainism",
  "Sikhism",
  "Shinto",
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[var(--color-ink)]">
      {/* Nav */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5 md:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[var(--color-gold-soft)]"
          >
            <img
              src="/spiritual-results-mark.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8"
              aria-hidden
            />
            <span
              className="text-xl tracking-wide"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Spiritual Results
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm text-[var(--color-parchment-deep)] hover:text-[var(--color-gold-soft)]"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[var(--color-gold)] px-5 py-2 text-sm font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)]"
              >
                Begin
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-sm text-[var(--color-parchment-deep)] hover:text-[var(--color-gold-soft)]"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 text-center">
        {/* Soft cream-to-gold backdrop */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(184,137,60,0.10) 0%, rgba(250,247,238,0) 55%), linear-gradient(180deg, #FFFCF3 0%, #FAF7EE 100%)",
          }}
        />
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-5xl md:text-7xl font-light text-[var(--color-gold-soft)]">
            Connect with Ancient Wisdom
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-[var(--color-parchment-deep)]">
            A safe, soothing space for spiritual growth and cross-faith dialogue.
            Learn from thousands of years of teaching — at your own pace.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-full bg-[var(--color-gold)] px-8 py-3 text-base font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)]"
            >
              Begin your path
            </Link>
            <Link
              href="/modules"
              className="rounded-full border border-[var(--color-gold-soft)] px-8 py-3 text-base text-[var(--color-gold-soft)] hover:bg-[var(--color-gold-soft)]/10"
            >
              Browse modules
            </Link>
          </div>
        </div>
      </section>

      {/* Traditions */}
      <section className="border-t border-[var(--color-gold)]/10 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-8 text-sm uppercase tracking-widest text-[var(--color-gold-soft)]">
            Drawing from
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[var(--color-parchment-deep)]">
            {traditions.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--color-gold)]/20 px-5 py-2 text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="border-t border-[var(--color-gold)]/10 px-6 py-24">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
          <Pillar
            title="Learn at your pace"
            body="Self-paced modules with short readings, reflection prompts, and a quiz at the end. No deadlines. No judgment."
          />
          <Pillar
            title="Across traditions"
            body="Compare how Christianity, Buddhism, Sufism, and other paths each approach the same question — forgiveness, suffering, gratitude, presence."
          />
          <Pillar
            title="Track your growth"
            body="Your progress, your journal, your milestones. Look back on what you’ve studied and what it’s changed."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-gold)]/10 px-6 py-10 text-center text-sm text-[var(--color-parchment-deep)]/60">
        <p>© {new Date().getFullYear()} Spiritual Results. A quiet place to study.</p>
        <p className="mt-2">
          Looking for deeper AI dialogue?{" "}
          <a
            href={process.env.NEXT_PUBLIC_SPIRITUAL_AI_URL ?? "https://spiritualresults.ai"}
            className="text-[var(--color-gold-soft)] hover:underline"
          >
            Visit spiritualresults.ai →
          </a>
        </p>
      </footer>
    </main>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="mb-3 text-2xl text-[var(--color-gold-soft)]">{title}</h3>
      <p className="leading-relaxed text-[var(--color-parchment-deep)]">{body}</p>
    </div>
  );
}
