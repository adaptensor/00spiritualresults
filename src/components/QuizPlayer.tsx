"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  order: number;
  prompt: string;
  choices: string[];
};

type QuestionResult = {
  questionId: string;
  chosenIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string | null;
};

type AttemptResult = {
  score: number;
  passed: boolean;
  passScore: number;
  correctCount: number;
  total: number;
  moduleCompleted: boolean;
  results: QuestionResult[];
};

type Props = {
  quizId: string;
  moduleSlug: string;
  passScore: number;
  questions: Question[];
};

export function QuizPlayer({ quizId, moduleSlug, passScore, questions }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allAnswered = questions.every((q) => typeof answers[q.id] === "number");

  function select(qid: string, idx: number) {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }

  async function submit() {
    if (!allAnswered || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          answers: questions.map((q) => ({
            questionId: q.id,
            chosenIndex: answers[q.id],
          })),
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        setError(`Could not submit (${res.status}). ${t.slice(0, 200)}`);
        setBusy(false);
        return;
      }
      const data: AttemptResult = await res.json();
      setResult(data);
      setBusy(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      setBusy(false);
    }
  }

  function retake() {
    setAnswers({});
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {result && (
        <ResultBanner result={result} moduleSlug={moduleSlug} onRetake={retake} />
      )}

      <ol className="space-y-6">
        {questions.map((q, i) => {
          const qResult = result?.results.find((r) => r.questionId === q.id);
          const chosen = answers[q.id];

          return (
            <li
              key={q.id}
              className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-ink-deep)] p-6"
            >
              <p className="mb-3 text-xs uppercase tracking-widest text-[var(--color-gold-soft)]/70">
                Question {i + 1} of {questions.length}
              </p>
              <p className="mb-4 text-lg leading-relaxed text-[var(--color-parchment)]">
                {q.prompt}
              </p>

              <div className="space-y-2">
                {q.choices.map((c, ci) => {
                  const isChosen = chosen === ci;
                  const isCorrect = qResult?.correctIndex === ci;
                  const isWrongChoice = !!result && isChosen && !isCorrect;

                  let cls =
                    "flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition disabled:cursor-default ";
                  if (result) {
                    if (isCorrect) {
                      cls +=
                        "border-emerald-500/50 bg-emerald-500/10 text-[var(--color-parchment)]";
                    } else if (isWrongChoice) {
                      cls +=
                        "border-red-500/50 bg-red-500/10 text-[var(--color-parchment)]";
                    } else {
                      cls +=
                        "border-[var(--color-gold)]/15 text-[var(--color-parchment-deep)]";
                    }
                  } else if (isChosen) {
                    cls +=
                      "border-[var(--color-gold-soft)] bg-[var(--color-gold-soft)]/10 text-[var(--color-parchment)]";
                  } else {
                    cls +=
                      "border-[var(--color-gold)]/20 text-[var(--color-parchment-deep)] hover:border-[var(--color-gold-soft)]/60 hover:text-[var(--color-parchment)]";
                  }

                  return (
                    <button
                      key={ci}
                      type="button"
                      onClick={() => select(q.id, ci)}
                      disabled={!!result}
                      className={cls}
                    >
                      <span className="mt-0.5 font-mono text-sm text-[var(--color-gold-soft)]/70">
                        {String.fromCharCode(65 + ci)}.
                      </span>
                      <span className="flex-1">{c}</span>
                      {result && isCorrect && (
                        <span aria-hidden className="text-emerald-400">
                          ✓
                        </span>
                      )}
                      {result && isWrongChoice && (
                        <span aria-hidden className="text-red-400">
                          ✗
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {qResult?.explanation && (
                <p className="mt-4 border-l-2 border-[var(--color-gold-soft)]/40 pl-4 text-sm italic leading-relaxed text-[var(--color-parchment-deep)]">
                  {qResult.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {!result && (
        <div className="mt-8 flex flex-col items-center gap-3">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={submit}
            disabled={!allAnswered || busy}
            className="rounded-full bg-[var(--color-gold)] px-8 py-3 text-base font-medium text-[var(--color-button-text)] transition hover:bg-[var(--color-gold-soft)] disabled:opacity-50"
          >
            {busy
              ? "Grading…"
              : allAnswered
                ? "Submit answers"
                : `Answer all ${questions.length} questions`}
          </button>
          <p className="text-xs text-[var(--color-parchment-deep)]/60">
            Need {passScore}% to pass.
          </p>
        </div>
      )}
    </div>
  );
}

function ResultBanner({
  result,
  moduleSlug,
  onRetake,
}: {
  result: AttemptResult;
  moduleSlug: string;
  onRetake: () => void;
}) {
  const passed = result.passed;
  return (
    <div
      className={`mb-10 rounded-lg border p-6 text-center ${
        passed
          ? "border-[var(--color-gold-soft)]/50 bg-[var(--color-gold-soft)]/5"
          : "border-red-500/30 bg-red-500/5"
      }`}
    >
      <p className="mb-1 text-xs uppercase tracking-widest text-[var(--color-gold-soft)]/70">
        {passed
          ? result.moduleCompleted
            ? "Module complete"
            : "Quiz passed"
          : "Not yet"}
      </p>
      <p className="mb-3 text-4xl text-[var(--color-gold-soft)]">{result.score}%</p>
      <p className="mb-5 text-sm text-[var(--color-parchment-deep)]">
        {result.correctCount} of {result.total} correct
        {passed ? " — well done." : ` — ${result.passScore}% required.`}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {passed ? (
          <Link
            href={`/modules/${moduleSlug}`}
            className="rounded-full bg-[var(--color-gold)] px-5 py-2 text-sm font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)]"
          >
            Back to module
          </Link>
        ) : (
          <button
            onClick={onRetake}
            className="rounded-full bg-[var(--color-gold)] px-5 py-2 text-sm font-medium text-[var(--color-button-text)] hover:bg-[var(--color-gold-soft)]"
          >
            Retake quiz
          </button>
        )}
        <Link
          href="/dashboard"
          className="rounded-full border border-[var(--color-gold-soft)] px-5 py-2 text-sm text-[var(--color-gold-soft)] hover:bg-[var(--color-gold-soft)]/10"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
