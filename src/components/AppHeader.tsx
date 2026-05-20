import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  return (
    <header className="border-b border-[var(--color-gold)]/10 bg-[var(--color-ink-deep)] px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 text-[var(--color-gold-soft)]"
        >
          <img
            src="/spiritual-results-mark.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7"
            aria-hidden
          />
          <span
            className="text-xl tracking-wide"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Spiritual Results
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/dashboard"
            className="text-[var(--color-parchment-deep)] hover:text-[var(--color-gold-soft)]"
          >
            Dashboard
          </Link>
          <Link
            href="/modules"
            className="text-[var(--color-parchment-deep)] hover:text-[var(--color-gold-soft)]"
          >
            Modules
          </Link>
          <Link
            href="/shrine"
            className="text-[var(--color-parchment-deep)] hover:text-[var(--color-gold-soft)]"
          >
            Shrine
          </Link>
          <UserButton afterSignOutUrl="/" />
        </nav>
      </div>
    </header>
  );
}
