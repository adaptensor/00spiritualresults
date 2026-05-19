"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  lessonId: string;
  moduleSlug: string;
  alreadyCompleted: boolean;
  nextLessonId: string | null;
  hasQuiz: boolean;
};

export function LessonCompleteButton({
  lessonId,
  moduleSlug,
  alreadyCompleted,
  nextLessonId,
  hasQuiz,
}: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [busy, setBusy] = useState(false);

  async function markComplete() {
    setBusy(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("mark-complete failed:", err);
        setBusy(false);
        return;
      }
      setCompleted(true);
      router.refresh();
    } catch (e) {
      console.error(e);
      setBusy(false);
    }
  }

  if (completed) {
    return (
      <div className="mt-12 rounded-lg border border-[var(--color-gold-soft)]/40 bg-[var(--color-gold-soft)]/5 p-6 text-center">
        <p className="mb-4 text-[var(--color-gold-soft)]">✓ Lesson complete</p>
        <div className="flex flex-wrap justify-center gap-3">
          {hasQuiz && (
            <Link
              href={`/modules/${moduleSlug}/lessons/${lessonId}/quiz`}
              className="rounded-full bg-[var(--color-gold)] px-5 py-2 text-sm font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)]"
            >
              Take the quiz →
            </Link>
          )}
          {nextLessonId && (
            <Link
              href={`/modules/${moduleSlug}/lessons/${nextLessonId}`}
              className="rounded-full border border-[var(--color-gold-soft)] px-5 py-2 text-sm text-[var(--color-gold-soft)] hover:bg-[var(--color-gold-soft)]/10"
            >
              Next lesson →
            </Link>
          )}
          {!nextLessonId && !hasQuiz && (
            <Link
              href={`/modules/${moduleSlug}`}
              className="rounded-full border border-[var(--color-gold-soft)] px-5 py-2 text-sm text-[var(--color-gold-soft)] hover:bg-[var(--color-gold-soft)]/10"
            >
              Back to module
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 text-center">
      <button
        onClick={markComplete}
        disabled={busy}
        className="rounded-full bg-[var(--color-gold)] px-8 py-3 text-base font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)] disabled:opacity-50"
      >
        {busy ? "Saving…" : "Mark as complete"}
      </button>
    </div>
  );
}
