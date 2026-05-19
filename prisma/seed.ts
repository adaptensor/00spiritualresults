/**
 * Seed one demo module — "Forgiveness across the wisdom traditions".
 *
 * This is a HAND-AUTHORED demo so Phase 1 has something to navigate end-to-end.
 * Real modules will eventually come from the AI generator in
 * src/app/api/generate-module/route.ts.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Seeding Spiritual Results demo content…");

  const slug = "forgiveness-across-traditions";

  // Wipe prior demo content (for idempotent reseeding).
  const existing = await db.module.findUnique({ where: { slug } });
  if (existing) {
    await db.module.delete({ where: { id: existing.id } });
    console.log(`  ✓ removed existing module "${slug}"`);
  }

  const module = await db.module.create({
    data: {
      slug,
      title: "Forgiveness Across the Wisdom Traditions",
      subtitle: "How four paths each approach the act of letting go",
      description:
        "An introductory three-lesson module exploring how Christianity, Buddhism, Sufism, and Stoic philosophy each understand forgiveness — what it asks of us, what it gives back, and where the traditions agree and diverge.",
      traditions: ["CHRISTIANITY", "BUDDHISM", "SUFISM", "PHILOSOPHY", "COMPARATIVE"],
      difficulty: 1,
      estimatedMinutes: 35,
      sortOrder: 0,
      status: "PUBLISHED",
      publishedAt: new Date(),
      provenance: {
        generator: "human",
        author: "Spiritual Results editorial",
        note: "Demo seed module for Phase 1 scaffolding.",
      },
      lessons: {
        create: [
          {
            order: 1,
            title: "The Christian invitation: forgive as you have been forgiven",
            estimatedMinutes: 10,
            body: christianLesson,
            reflectionPrompt:
              "Bring to mind one person you have not yet forgiven. What does it cost you to keep that account open?",
          },
          {
            order: 2,
            title: "The Buddhist release: forgiveness as the end of suffering",
            estimatedMinutes: 12,
            body: buddhistLesson,
            reflectionPrompt:
              "When you replay a wound in your mind, who is suffering in that moment — the one who hurt you, or you?",
          },
          {
            order: 3,
            title: "The Sufi and Stoic horizons: mercy and the indifferent",
            estimatedMinutes: 13,
            body: sufiStoicLesson,
            reflectionPrompt:
              "If the person who hurt you were standing before you a hundred years from now, when both of you are dust — what does the grievance look like?",
          },
        ],
      },
    },
    include: { lessons: true },
  });

  // Attach a quiz to the LAST lesson (closes the module).
  const lastLesson = module.lessons[module.lessons.length - 1];
  await db.quiz.create({
    data: {
      lessonId: lastLesson.id,
      title: "Forgiveness — module review",
      passScore: 70,
      questions: {
        create: [
          {
            order: 1,
            prompt:
              "In the Lord's Prayer, the petition for forgiveness is conditioned on what?",
            choices: [
              "Our financial offering to the church",
              "Forgiving those who have trespassed against us",
              "Daily attendance at worship",
              "Public confession of every sin",
            ],
            correctIndex: 1,
            explanation:
              "Matthew 6:12 — 'Forgive us our debts, as we also have forgiven our debtors.' The forgiveness we receive is tied to the forgiveness we extend.",
          },
          {
            order: 2,
            prompt:
              "In the Buddhist understanding, holding a grudge is most directly described as:",
            choices: [
              "A righteous act of remembrance",
              "A holy duty owed to the wronged",
              "Drinking poison and waiting for the other person to die",
              "A required step before forgiveness can occur",
            ],
            correctIndex: 2,
            explanation:
              "This image — often attributed to the Buddha (though its exact textual origin is debated) — captures the core insight: resentment harms the one carrying it more than the one it is aimed at.",
          },
          {
            order: 3,
            prompt:
              "In Sufi thought, the Divine name *al-Ghaffār* points to which aspect of mercy?",
            choices: [
              "Punishment that is just",
              "Concealment and continuous forgiving",
              "Distance from the impure",
              "Strict accounting of every deed",
            ],
            correctIndex: 1,
            explanation:
              "*al-Ghaffār* means 'the One who repeatedly covers' — mercy that conceals fault and keeps forgiving without exhaustion.",
          },
          {
            order: 4,
            prompt:
              "Marcus Aurelius counseled the Stoic to begin each day by remembering that he would meet:",
            choices: [
              "Only friends and well-wishers",
              "People who are ungrateful, arrogant, dishonest, jealous, and surly",
              "Strangers whose intentions are unknowable",
              "Those who agree with his philosophy",
            ],
            correctIndex: 1,
            explanation:
              "Meditations II.1 — anticipating difficult people robs them of the power to surprise and inflame you.",
          },
          {
            order: 5,
            prompt:
              "Across these four traditions, the most consistent claim about forgiveness is that it is primarily:",
            choices: [
              "A gift the wrongdoer earns through repentance",
              "An obligation owed to one's community",
              "A practice that frees the one who forgives",
              "A guarantee of restored relationship",
            ],
            correctIndex: 2,
            explanation:
              "Though each tradition adds its own emphasis, all four locate the primary fruit of forgiveness in the heart of the one who forgives — not in the deserving of the one forgiven.",
          },
        ],
      },
    },
  });

  console.log(`  ✓ seeded module "${module.title}"`);
  console.log(`  ✓ ${module.lessons.length} lessons + 1 quiz (5 questions)`);
  console.log("Done.");
}

const christianLesson = `## The petition that has teeth

When the disciples asked Jesus how to pray, he gave them six short petitions. Five of them ask things of God. Only one ties what we receive to what we give:

> Forgive us our debts, as we also have forgiven our debtors. — Matthew 6:12

The line is unsettling because it sets a price. The Greek word translated *debts* (*opheilēmata*) is not metaphor. It is the same word used for what one neighbor owes another for a wagon, a field, a wage. Sin, in this prayer, is bookkeeping — and the petitioner is asking that God close their books in the same way the petitioner has closed others'.

## What forgiveness is *not*

The early Christian writers were careful to distinguish forgiveness from three things it is often confused with:

- **Excusing.** To excuse is to say *no real harm was done*. To forgive is to say *real harm was done, and I will not collect.*
- **Forgetting.** Forgiveness does not require memory to fail. It requires memory to stop demanding payment.
- **Reconciliation.** One forgives alone. One reconciles together. The first does not depend on the other person — the second does.

Augustine, four centuries later, would put it sharply: *We forgive even those who do not ask, because we ourselves have been forgiven things we never knew we owed.*

## The hard part

The hard part of the Christian invitation is not the act of forgiving once. It is the seventy-times-seven of it (Matthew 18:22) — the discovery that forgiveness is not a single transaction but a posture you take up again every morning, often toward the same person, often toward the same wound.

This is why the tradition holds that forgiveness is not weakness. It is one of the strongest things a person can do — because it must be done over and over, with no expectation that it will be easier the next time.`;

const buddhistLesson = `## A different vocabulary

Buddhism does not use the word *forgiveness* the way the Christian tradition does. It does not ask you to *forgive* in the sense of cancelling a debt owed to you. It asks something stranger: it asks you to notice that the debt was always being collected from *yourself*.

## The image of the poison

There is a saying often attributed to the Buddha — its exact textual origin is debated, but its insight is firmly within the Dhamma:

> Holding onto anger is like drinking poison and expecting the other person to die.

When you replay a wound in your mind — what they said, what they did, what they should have said — the person hurting in that replay is you. The original wound has long since closed. What remains is the wound you keep reopening.

This is why the Buddhist tradition treats letting go (*paṭinissagga*) not as a moral demand but as a *practical instruction*. It is not "you owe this to the person who hurt you." It is "you owe this to yourself."

## Mettā — the practice

The classical practice for releasing resentment is *mettā bhāvanā*, the cultivation of loving-kindness. It traditionally proceeds in a sequence:

1. First, extend kindness to yourself: *May I be safe. May I be peaceful. May I be free from suffering.*
2. Then, to someone you love.
3. Then, to a neutral person — someone you neither love nor dislike.
4. Then, to a difficult person.
5. Finally, to all beings without distinction.

The fourth step is where forgiveness, in the Buddhist sense, actually happens. It is not a declaration. It is a wish — repeated until the heart can mean it — that the one who hurt you also be free of the suffering that drove them to hurt.

## What changes

Practitioners often report that nothing dramatic happens. The other person doesn't apologize. The wound is not erased. What changes is something quieter: the grip loosens. The replay stops running. The poison drains out.`;

const sufiStoicLesson = `## Two horizons, one direction

In this final lesson we turn to two traditions that arrived at remarkably similar conclusions about forgiveness from opposite metaphysical starting points: **Sufism**, which sees the universe as the unveiling of a Beloved who is *al-Ghaffār* — the endlessly forgiving One — and **Stoicism**, which sees the universe as indifferent matter governed by reason.

## Sufism: mercy as the deepest name

Sufi teachers point to a striking pattern in the ninety-nine Names of God in the Islamic tradition: the names of mercy vastly outnumber the names of wrath. Among them:

- *al-Raḥmān* — the Compassionate
- *al-Raḥīm* — the Merciful
- *al-Ghafūr* — the Forgiving
- *al-Ghaffār* — the One who continuously, repeatedly forgives
- *al-ʿAfuww* — the One who effaces faults entirely

The Sufi insight is that these are not personality traits of a distant deity. They are *qualities the human heart is invited to mirror*. To forgive is not to do something foreign to your nature. It is to do something *most native* to it — to enact, in your own small way, the same covering-over that the Real is enacting in every moment.

Rumi puts it characteristically:

> The wound is the place where the Light enters you.

The point is not romantic. It is that the wound, properly held, is the very thing that opens you to the mercy you are then capable of extending to others.

## Stoicism: anticipation as inoculation

Marcus Aurelius, two centuries after Christ and four centuries before the Sufis, opens Book II of his *Meditations* with this discipline:

> Begin the morning by saying to thyself, I shall meet with the busybody, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil.

The Stoic forgiveness is not warm. It is *cool*. It does not ask you to love the offender. It asks you to *expect* the offender — and then to notice that the offense, having been anticipated, has lost most of its sting.

Behind this is the Stoic doctrine that **no one does wrong willingly** — only out of ignorance of the true good. The person who wronged you was, in this view, more like someone stumbling in the dark than someone choosing evil with full sight.

## Where the four traditions meet

Christianity says: *forgive because you have been forgiven.*
Buddhism says: *forgive because the alternative poisons you.*
Sufism says: *forgive because forgiveness is the deepest name of the Real.*
Stoicism says: *forgive because the offender is not free in the way you imagined.*

The starting points could not be more different. The destination is the same.

The four traditions agree that forgiveness is not a favor you do for the one who wronged you. It is something far stranger and far better: it is what frees you to be the person you were before the wound.`;

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
