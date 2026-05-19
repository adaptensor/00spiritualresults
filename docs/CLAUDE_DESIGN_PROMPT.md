# Claude Design Prompt — spiritualresults.org

Copy everything below the `---` line into Claude (claude.ai). Paste into a new
conversation. Optionally attach a screenshot of the current live site
(`https://00spiritualresults.vercel.app`) so Claude has a starting reference.

---

## Context — please read all of this before producing anything

You are designing the visual UI for a new contemplative web platform. I am the
founder. I will iterate with you page by page. **Do not produce everything at
once.** Produce one page or component per response, then wait for my feedback.

The platform has two sister domains that share one account and one database:

- **spiritualresults.org** — entirely free. The everyday sanctuary. **This is
  what you are designing.**
- **spiritualresults.ai** — paid, deeper AI features (chat with spiritual
  teachers, AI goal coaching). Mentioned only as a subtle outbound link. Not
  your focus.

## Who it is for

People — religious, secular, seeking, grieving, recovering, just curious — who
want a quiet place to think about the wisdom traditions and to be with one or
two trusted friends.

The tone is contemplative, slow, sacred. It is **not a productivity app**. There
are no streaks, badges, notification dots, leaderboards, urgency banners, or
growth-hack patterns. Nothing FOMO. Nothing shouty. Nothing clinical.

## What .org offers (your full scope)

1. **Free reading modules** — short multi-lesson courses drawn from many
   wisdom traditions (Christianity, Buddhism, Sufism, Stoicism, Hinduism,
   Judaism, Bahá'í, Taoism, Confucianism, Shinto, Jainism, Sikhism, and
   secular contemplative philosophy). User reads, reflects, optionally takes a
   5-question review quiz at the end. The user is never quizzed before they've
   read.
2. **A personal Shrine — the centerpiece of the product.** Each user has ONE
   personal room which they design. They pick a theme, place a few objects,
   light a candle, choose a soundscape. They invite specific friends in by
   name. When a friend enters, they see *the host's* room — not a shared,
   co-decorated one. The host is the only designer. Chat happens inside the
   room, in real time. Conversations are saved per room.
3. **A personal Journal** — private entries the user writes whenever. Yours
   alone. Markdown supported, but the mockup can show plain prose.
4. **Goals** — user writes goals. The platform stores them. The AI coaching on
   goals lives on `.ai` (paid); on `.org` goals just sit listed, with a soft
   outbound link.
5. **AdaptGent help modal** — floating bottom-right button. Opens a small chat
   that ONLY helps with using the site and understanding the modules. Not deep
   AI. Subtle.

## What you should NOT design

- Any paid feature, any pricing page, any upgrade flow
- Admin panels
- Email templates
- Settings deeper than a small account dialog

---

## Brand

### Palette (use exactly these hex values)

| Token              | Hex                          | Used for                              |
| ------------------ | ---------------------------- | ------------------------------------- |
| Background         | `#FAF7EE`                    | Page background — warm cream          |
| Surface            | `#FFFFFF`                    | Elevated cards, nav, modals           |
| Surface alt        | `#F2EBD8`                    | Subtle section backgrounds            |
| Text primary       | `#2A2218`                    | Body copy, headings (when not gold)   |
| Text secondary     | `#5C4F3D`                    | Subtitles, helper text                |
| Text tertiary      | `#8A7A66`                    | Captions, fine print                  |
| Accent gold        | `#8B6A1F`                    | Key headings, accent text, links      |
| Accent gold strong | `#B8893C`                    | Filled CTAs, button backgrounds       |
| Accent gold hover  | `#A07728`                    | Button hover states                   |
| Border gold        | `rgba(139,106,31,0.20)`      | Hairline borders                      |
| Sage               | `#5E7148`                    | "Presence" indicators only            |
| Soft amber         | `#A85C1B`                    | Quiet warnings (no bright red)        |
| Dark on gold       | `#1F1810`                    | Text on filled gold buttons           |

### Typography

- Headings: **Cormorant Garamond** (serif). Use a light weight (300–400) on
  display sizes; the elegance comes from the letterforms, not the weight.
- Body: **Inter** (sans).
- Letter spacing on headings: `-0.01em`.
- Line height for body: `1.7`.

### Tone words to guide your visual choices

> quiet · slow · warm · candlelit · parchment · prayerful · breath · hush
> · dawn · dusk · still

### Avoid

- Glassmorphism, neon, vibrant gradients, harsh shadows
- Bright reds, electric blues, saturated greens
- Emoji as decoration
- Heavy uppercase, bold weights anywhere except the smallest section labels
- Animated entrance effects on every element (only the candle and the smoke
  should animate; everything else is still)

---

## Tech constraints

- React + TypeScript + **Tailwind CSS v4**
- No third-party UI libraries (no shadcn, no Radix, no MUI). Full ownership.
- **Lucide React** icons (`lucide-react`). If a Lucide icon doesn't fit (e.g.
  the candle), use an inline SVG.
- `next/link` for internal routing, regular `<a>` for external
- Mobile responsive (375px → 1440px)
- All interactive elements need visible focus states
- Color contrast WCAG AA minimum

For each component you produce, give me a **single self-contained `.tsx` file**
I can drop into the codebase. Use Tailwind utility classes. Hardcoded mock data
is fine — comment where the real data plugs in.

---

## Pages and components, in priority order

### 1. The Landing Page (`/`)

A quiet single-page marketing site for visitors who haven't signed up.

**Sections:**

- **Sticky header** — left: "Spiritual Results" wordmark in deep gold serif.
  Right: "Sign in" link + "Begin" gold button. When the page is scrolled, the
  header gains a faint white-with-blur background. At the top of the page, the
  header is fully transparent over the cream.
- **Hero.** Single sentence headline in Cormorant Garamond, 64–80px,
  letterspacing `-0.01em`, gold: *"Connect with ancient wisdom."* Subhead in
  brown: *"A safe, soothing space for spiritual growth and cross-faith
  dialogue. Learn from thousands of years of teaching — at your own pace."*
  Two CTAs side-by-side: "Begin your path" (filled gold) and "Browse what's
  here" (outline gold). Background: a barely-there warm radial glow on cream.
  Plenty of vertical breathing room (200px+ above and below the hero text).
- **"Drawing from" strip.** A soft uppercase label, then a wrapped row of 12
  small pill-shaped tradition badges: *Christianity · Islam · Buddhism ·
  Hinduism · Judaism · Sufism · Taoism · Confucianism · Bahá'í · Jainism ·
  Sikhism · Shinto*. Pills: cream background, 1px gold border, brown text.
- **"What you'll find" — three columns:**
  1. **Learn at your pace.** Self-paced lessons with short readings,
     reflection prompts, and an optional review quiz.
  2. **Build a sanctuary.** A personal room you design. Invite a trusted
     friend to come and talk.
  3. **Keep a journal.** A private place to write what you're thinking. Yours
     alone.
- **A slowly rotating quote display.** One quote at a time, attributed, cycles
  every 8 seconds with a slow fade. 4–5 quotes pulled from different
  traditions. E.g. *"Be still, and know that I am God. — Psalm 46:10"* / *"The
  obstacle is the path. — Zen proverb"* / *"O you who believe, seek help in
  patience and prayer. — Qur'an 2:153"* / *"Each new morning we are born again.
  — Buddha"* / *"The unexamined life is not worth living. — Socrates"*.
- **Footer.** Quiet. Copyright line. A single soft link: *"Want to go deeper?
  Visit spiritualresults.ai →"*.

### 2. Sign-up / Sign-in pages

These wrap the Clerk `<SignIn />` and `<SignUp />` components. Just design the
*wrapper page* — a centered cream page with the wordmark above the Clerk
widget, a single line of welcome copy below ("A quiet place to study."), and a
small footer link "← Back to the entrance."

### 3. The Dashboard (`/dashboard`)

The first screen a signed-in user sees.

**Layout:** generous whitespace, no sidebar — just a centered max-width column
(`max-w-4xl`). The persistent top nav is small and unobtrusive: the wordmark
on the left, a few small text links on the right (*Dashboard · Modules ·
Journal · Goals · Shrine*), then the user avatar.

**Sections, top to bottom:**

- **Greeting.** *"Good morning, [first name]."* in Cormorant serif at 48px.
  Below, a short rotating contemplative phrase ("A new day begins gently.",
  "Welcome back.", "The light returns.", "Begin here."). Time-aware:
  morning / afternoon / evening.
- **Your Shrine card.** A wide rectangular card, ~200px tall. A subtle
  gradient hint of the user's chosen theme (e.g. for "Candlelit Chapel," a
  warm amber-to-cream gradient). Center: "Enter your shrine →" link in serif
  deep gold. If a guest is currently present in the user's shrine, a small
  sage-green pulse with "Maya is here with you." appears in the corner of the
  card. On hover the card brightens slightly.
- **Recent guests.** A small row of 3–5 circular avatars: *"People who've
  been with you recently."* Click to invite back.
- **Your modules.** If user has an in-progress module: title + lesson position
  ("Lesson 2 of 3") + a "Continue" link. If empty, a soft prompt: *"Begin your
  first lesson →"*.
- **Your journal.** Last 3 entries as small soft cards (date + first line).
  "Open journal →" link below.
- **Your goals.** Listed simply. "Add a goal +" inline button. If zero, a
  prompt: *"What do you hope this season holds for you?"*.
- **Subtle outbound.** Tertiary-brown text, no button styling: *"Looking for a
  teacher? Visit spiritualresults.ai →"*.

### 4. The Shrine (THE centerpiece — give this the most care)

This is `/shrine` for the user's own room, and `/shrine/[username]` for a
guest entering someone else's. Both views look identical except:
- In the host's view, an "Edit room" pencil appears in the top-right
- In a guest's view, a small badge appears: *"Maya's shrine."*

**The room view:**

- **Full-viewport immersive scene.** The persistent top nav fades to almost
  nothing — just a small "← Back to dashboard" pill in the top-left (white,
  brown text, soft shadow).
- **The center 60% of the screen is the room scene.** See "themes" below.
- **Bottom-anchored chat strip.** A translucent white card pinned to the
  lower-right or lower-center, 360px wide, soft drop shadow, 80% opacity over
  the room scene. Shows the last few messages. Input at the bottom: *"Speak
  softly…"* placeholder. When idle (no recent messages), the strip
  auto-collapses to a thin sliver labeled "say something" so the room visual
  is unobstructed.
- **Top-right corner — vertical stack of small icons** (small white circular
  buttons, brown icons):
  - Candle (toggle the lit candle on/off — visual only)
  - Music note (toggle ambient soundscape)
  - Person-plus (invite a friend)
  - Pencil (edit the room — host only)
  - X (leave the room)

**Seven themes.** Each is a stylized illustrated or painted scene — NOT a
photograph. Calm, low contrast, dawn or dusk lighting. For the mockup, design
**Candlelit Chapel** fully, and show a thumbnail of how a second one (Forest
Grove) would feel.

1. **Candlelit Chapel** — soft stone arches, a single tall candle on a stone
   altar, dim warm light, motes of dust in a faint sunbeam.
2. **Forest Grove** — dappled green-gold sunlight, mossy stones, distant trees,
   a single low log to sit on.
3. **Mountain Altar** — sunrise behind a single rock cairn, far peaks in haze.
4. **Garden** — a low stone bench, white roses, a small fountain, English-
   garden feel at twilight.
5. **Hearth Room** — a low fire in a stone fireplace, a sheepskin rug, deep
   winter quiet.
6. **Seashore at Dawn** — wet sand, soft mist, a piece of driftwood.
7. **Desert Oasis** — a single palm, a still pool, twilight pink sky, the
   first star.

**Objects the host can place** (max 5–7 per room):
- A **lit candle** (gently flickers — a CSS `@keyframes` opacity wobble)
- An **icon or photograph** in a thin gold frame
- A **sacred passage on parchment** (the host writes the text)
- A **flower offering** (white rose, lotus, lily)
- **Prayer beads** draped over a stone
- An **incense stick** with a thin animated curl of smoke
- A **single word** in serif on a small placard: "Peace." "Patience." "Mother."
  "Begin."

**Presence indicator.** When a guest enters, a soft sage-green ring pulses at
the bottom-left briefly, then settles. A small tooltip: *"Maya joined you."*
Their initial appears in a small sage circle in the top-right corner of the
chat strip.

### 5. The Shrine designer (`/shrine/edit`) — host only

A two-column layout:
- **Right column (60% of width):** live preview of the room, exactly as a
  guest would see it.
- **Left column:**
  - **Theme.** Seven small thumbnails to pick from. The active one has a gold
    ring around it.
  - **Objects.** A draggable list. Each object placed on the room has a small
    handle in the preview: tap once to select, drag to move, X to remove.
  - **Words.** A textarea for the sacred passage or single word. Live preview
    on the parchment in the room.
  - **Soundscape.** Five quiet ambient choices, radio-style: *Wind · Bells ·
    Water · Fire crackle · Silence*.
  - **Visibility.** Three radio options: *Anyone with the link · Invited
    people only (default) · Just me*.
  - **Save** (filled gold) and **Discard** at the bottom.

On mobile this becomes single-column: preview on top, controls below.

### 6. Modules

- **`/modules`** — list of modules as soft cream cards on white background.
  Each card: title (serif gold), 1-line subtitle (brown italic), source-
  tradition pills at top, "Begin →" link bottom-right. Cards on hover: soft
  gold border lift.
- **`/modules/[slug]`** — module title, source-tradition pills, description,
  then an ordered list of lessons. Each lesson row: lesson number in serif,
  title, estimated minutes, a soft "✓ done" if completed.
- **`/modules/[slug]/lessons/[id]`** — the lesson reader. Narrow centered
  column (max 640px), serif title, lush body text rendering markdown,
  line-height 1.8, blockquote left-bordered in gold and italic, a *reflection
  prompt* card at the end with italic brown text on cream, and a single
  "Mark complete" or "Continue" gold button.
- **`/modules/[slug]/lessons/[id]/quiz`** — all 5 questions on a single page,
  one card per question. After submitting: each question shows its result (a
  small sage check or soft-amber dot, never bright red) and a short
  explanation. No score blasting. *"5 of 5. Held with care."* or *"4 of 5.
  Take a breath and return when ready."*

### 7. Journal

- **`/journal`** — a vertical scroll of dated entries, each a soft cream card
  on white. Click to open. Most recent first. A floating "+ new entry" button
  in deep gold, bottom-right (above the AdaptGent button).
- **`/journal/new`** — full-screen writer. A title field at the top, a date
  auto-stamp, then a large textarea on cream. "Save" link in the top-right.
- **`/journal/[id]`** — read view. Edit button in the top-right.

### 8. Goals (`/goals`)

- A simple vertical list. Each goal is a single card on white: short title in
  serif gold, optional 1-line description in brown, date set in tertiary
  brown.
- "Add a goal +" inline form at the top.
- Each goal has three states: **set**, **reflecting**, **released**. The
  state is shown as a small word badge to the left of the title.
- Beneath each goal, a soft outbound: *"Coaching on this goal lives at
  spiritualresults.ai →"*.
- No deletion drama: a "Release this goal" link below each goal, with subtle
  inline confirm ("Are you sure? Yes / Cancel").

### 9. AdaptGent floating helper (visible on every signed-in page)

The same pattern as the AdaptGent floating button on relastrat.com, with two
changes for this site:
- **Color: deep gold** (`#8B6A1F`) instead of coral.
- **Free for everyone — no lock, no upgrade prompt.** Just help.

**The button:**
- 56×56 circular, fixed bottom-right (24px from each edge), z-index high.
- Deep gold background. Soft drop shadow that grows slightly on hover.
- Icon: an understated lantern, an open book with a small spark, or an olive
  branch. NOT a generic chat bubble or robot face. Pick the most contemplative
  option.
- Subtle scale-up to 1.05 on hover.

**The panel that opens (on click):**
- 400px wide, pinned 92px from the bottom-right.
- White card, gold-tinted thin border, soft drop shadow.
- **Header:** small icon + "AdaptGent" wordmark + 1-line subtitle: *"Here to
  help with the lessons."*
- **Body when empty** — a list of starter prompts as soft pills:
  - "Explain this passage to me."
  - "Suggest a reflection question for this lesson."
  - "I don't know what this term means."
  - "What other traditions say something similar?"
- **Body when in conversation** — user bubbles in deep gold with white text,
  agent bubbles in cream with brown text. Round corners, with the bottom
  corner squared off on the speaker's side.
- **Input at the bottom:** *"Ask gently…"* placeholder. Send icon.
- **Footer line:** *"Asking gently, no records kept."* in tertiary-brown.

### 10. Account dialog

Small dialog, not a whole page. Reachable from the user's avatar in the top-
right. Lists:
- Name, email, "Member since [date]"
- "Sign out" in soft amber
- A subtle "Manage subscription on spiritualresults.ai →" link

---

## Iteration plan

**For our first round, produce ONLY the Landing Page** (item #1) as a single
self-contained React `.tsx` file. Then wait. I will come back with notes, and
we'll move next to the Dashboard, then the Shrine (which I expect we'll iterate
on most heavily — that's the soul of the product).

When you produce code:
- **One `.tsx` file per response.**
- Hardcoded sample data inline (mark with `// MOCK:` comments).
- All imports at the top.
- Tailwind utility classes only (no styled-components, no CSS-in-JS).
- A short note at the bottom of your response: the choices you made, the
  parts you're least sure about, and one or two questions you'd like me to
  answer before the next page.

Begin with the Landing Page.
