# Handoff: Spiritual Results (.org)

## Overview

Spiritual Results is a contemplative web platform for cross-faith spiritual study, personal sanctuary-building, and journaling. This handoff covers the **spiritualresults.org** domain — the free, everyday sanctuary side.

The platform has a sister domain (**spiritualresults.ai** — paid, deeper AI features) that shares one account and one database. The .ai side is NOT in scope here — it's referenced only as subtle outbound links.

## About the Design Files

The files in this bundle are **design references created in HTML** — interactive prototypes showing intended look, behavior, and interactions. They are NOT production code to copy directly.

The task is to **recreate these HTML designs in React + TypeScript + Tailwind CSS v4**, using the architecture and patterns described below. The HTML prototypes use inline React (Babel) with inline styles — production code should use Tailwind utility classes instead.

## Fidelity

These are **high-fidelity (hifi)** prototypes. Colors, typography, spacing, interactions, hover states, and animations are all final. The developer should recreate the UI faithfully using Tailwind classes, matching exact hex values, font sizes, spacing, and interaction behavior.

---

## Design Tokens

### Color Palette (use exactly)

| Token | Value | Tailwind suggestion |
|---|---|---|
| Background | `#FAF7EE` | `bg-[#FAF7EE]` |
| Surface | `#FFFFFF` | `bg-white` |
| Surface alt | `#F2EBD8` | `bg-[#F2EBD8]` |
| Text primary | `#2A2218` | `text-[#2A2218]` |
| Text secondary | `#5C4F3D` | `text-[#5C4F3D]` |
| Text tertiary | `#8A7A66` | `text-[#8A7A66]` |
| Accent gold | `#8B6A1F` | `text-[#8B6A1F]` |
| Accent gold strong | `#B8893C` | `bg-[#B8893C]` |
| Accent gold hover | `#A07728` | `hover:bg-[#A07728]` |
| Border gold | `rgba(139,106,31,0.20)` | `border-[rgba(139,106,31,0.20)]` |
| Sage | `#5E7148` | `text-[#5E7148]` (presence only) |
| Soft amber | `#A85C1B` | `text-[#A85C1B]` (warnings) |
| Dark on gold | `#1F1810` | `text-[#1F1810]` |

### Typography

| Element | Font | Weight | Size | Extras |
|---|---|---|---|---|
| Display headings | Cormorant Garamond | 300 | 48–80px | `letter-spacing: -0.01em` |
| Section headings | Cormorant Garamond | 400 | 20–38px | `letter-spacing: -0.01em` |
| Body text | Inter | 400 | 14–16px | `line-height: 1.7` |
| Small labels | Inter | 600 | 10–11px | `letter-spacing: 0.13em`, uppercase |
| Buttons | Inter | 500 | 14–16px | — |

Google Fonts import: `Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400` and `Inter:wght@300;400;500;600`

### Spacing & Radius

| Element | Value |
|---|---|
| Card border-radius | 14–16px |
| Pill / tag radius | 100px (fully rounded) |
| Button radius | 10px (rounded, user-selected) |
| Section vertical padding | 56–128px (generous — the whole page breathes) |
| Max content width (dashboard) | 896px (`max-w-4xl`) |
| Focus ring | `2px solid rgba(139,106,31,0.45)`, offset 2px |

### Shadows

| Usage | Value |
|---|---|
| Card rest | `0 1px 4px rgba(42,34,24,0.02)` |
| Card hover | `0 2px 12px rgba(139,106,31,0.06)` |
| Floating panels | `0 8px 32px rgba(42,34,24,0.10)` |
| Frosted nav | `0 1px 8px rgba(42,34,24,0.04)` |

---

## Screens / Views

### 1. Landing Page (`/`)

**Purpose:** Marketing page for unauthenticated visitors.

**Layout:** Full-width, vertically stacked sections. No max-width constraint on sections, but inner content is centered and max ~780px for text, ~920px for feature columns.

**Sections (top to bottom):**

#### Sticky Header
- Fixed top, full-width, 72px tall
- **Left:** Pendant logo (38×38px `pendant.png`) + "Spiritual Results" in Cormorant Garamond 23px gold
- **Right:** "Sign in" text link (Inter 14px, secondary → gold on hover) + "Begin" filled gold button (Inter 14px, 9px 24px padding)
- **At top:** Fully transparent
- **On scroll (>50px):** `rgba(255,255,255,0.9)` background, `backdrop-filter: blur(16px)`, faint gold bottom border, subtle shadow
- Transition: 0.6s ease on all properties

#### Hero
- Full viewport height, centered
- Headline: "Connect with ancient wisdom." — Cormorant Garamond, `clamp(44px, 6.5vw, 78px)`, weight 300, gold, `text-wrap: balance`
- Subhead: Inter, `clamp(16px, 1.4vw, 19px)`, text-secondary, max-width 540px, `text-wrap: pretty`
- Two CTAs side-by-side with 16px gap: "Begin your path" (filled gold, 14px 34px padding, 10px radius) + "Browse what's here" (outline gold)
- Background: subtle warm radial glow — `radial-gradient(ellipse 850px 650px at 50% 44%, rgba(184,137,60,0.09) 0%, transparent 100%)`
- 200px+ breathing room above and below

#### Gold Divider
- 100px wide, 1px tall, `rgba(139,106,31,0.20)`, centered
- Appears between sections

#### Traditions Strip
- Label: "DRAWING FROM" — Inter 11px, weight 600, uppercase, 0.14em spacing, tertiary
- 12 pills in flex-wrap row, centered, max-width 700px
- Each pill: Inter 13px, secondary text, cream bg, 1px gold border, 100px radius, 7px 18px padding
- Traditions: Christianity, Islam, Buddhism, Hinduism, Judaism, Sufism, Taoism, Confucianism, Bahá'í, Jainism, Sikhism, Shinto

#### Features (3 columns)
- Heading: "What you'll find" — Cormorant `clamp(28px, 3.2vw, 38px)`, weight 300, gold
- Grid: `repeat(auto-fit, minmax(250px, 1fr))`, max-width 920px
- Each column: icon (32px, gold, strokeWidth 1.2) + title (Cormorant 23px, text-primary) + description (Inter 15px, text-secondary, max 280px)
- Icons: Book (open book), Arch (pointed arch), Pen (writing pen) — drawn as thin SVGs

#### Quote Carousel
- One quote at a time, centered, max-width 620px, min-height 130px
- Quote text: Cormorant Garamond italic, `clamp(21px, 2.8vw, 30px)`, weight 300, text-primary
- Attribution: Inter 13px, tertiary, 0.02em spacing
- Transitions: `opacity 1.6s ease` crossfade
- Cycles every 8 seconds
- Small dot indicators (6px circles) below — gold when active, border-gold otherwise
- 5 quotes: Psalm 46:10, Zen proverb, Qur'an 2:153, Buddha, Socrates

#### Footer
- Top border: 1px gold
- Copyright: Inter 13px, tertiary
- Link: "Want to go deeper? Visit spiritualresults.ai →" — tertiary → gold on hover

---

### 2. Dashboard (`/dashboard`)

**Purpose:** First screen for signed-in users. Central hub connecting all features.

**Layout:** No sidebar. Centered column, `max-width: 896px`, generous horizontal padding `clamp(24px, 5vw, 48px)`.

#### Dashboard Nav (sticky)
- Height 60px, sticky top
- **Left:** Pendant 30×30 + "Spiritual Results" Cormorant 19px gold
- **Right:** Text links (Inter 13px): Dashboard (weight 500, primary) · Modules · Journal · Goals · Shrine (weight 400, secondary). 22px gap. Each → gold on hover.
- Avatar button: 34px circle, surfaceAlt bg, gold border, user initials (Inter 12px weight 500). On click → account dropdown.
- On scroll: blur background, slightly stronger border
- **Mobile (<640px):** Hide text nav links

#### Account Dropdown
- Absolute positioned below avatar, 260px wide
- White card, 14px radius, gold border, floating shadow
- Content: Name (Inter 15px, 500), email (13px, secondary), "Member since" (12px, tertiary)
- Gold divider line
- "Sign out" link in amber
- "Manage subscription on spiritualresults.ai →" (12px, tertiary)
- Click outside to close

#### Greeting Section
- Top padding: 72px
- Heading: "[Good morning/afternoon/evening], [firstName]." — Cormorant `clamp(36px, 5vw, 48px)`, weight 300, gold
- **Time-aware:** Uses `new Date().getHours()` — morning (<12), afternoon (<17), evening
- Rotating phrase below: Inter 16px, italic, secondary. Cycles every 6 seconds with fade-up animation (`translateY(6px)` → `translateY(0)`, opacity 0→1, 1.2s)
- Phrases per time: morning ("A new day begins gently." / "The light returns." / "Begin here."), afternoon ("Welcome back." / "The path continues." / "A quiet moment."), evening ("The day draws to a close." / "Rest arrives." / "A gentle evening.")

#### Shrine Card
- Full width within max-w, height 200px, radius 20px
- Background: `linear-gradient(135deg, rgba(184,137,60,0.08) 0%, rgba(184,137,60,0.02) 60%, transparent 100%)`
- Border: 1px `rgba(139,106,31,0.10)`
- Center: theme name (Inter 10px uppercase, 0.15em spacing, tertiary) + "Enter your shrine →" (Cormorant 22px, gold)
- **Hover:** gradient intensifies (0.08→0.13, border 0.10→0.18), cursor pointer
- **Guest presence** (bottom-right): 8px sage circle with CSS `sagePulse` animation (box-shadow pulse 2.4s) + "[Name] is here with you." (Inter 13px, sage)

#### Recent Guests
- Label: "People who've been with you recently." — Inter 14px, secondary
- Row of 5 avatar buttons, 44px circles, surfaceAlt bg, gold border
- Each shows initial letter (Inter 15px, weight 500)
- **Hover:** background tints gold, border becomes goldStrong
- **Click:** tooltip above — "Invite [name] back →" (white card, gold border, 10px radius, shadow)

#### Module Card
- White card, 16px radius, gold border
- **Hover:** border strengthens, subtle gold shadow
- Left: tradition pill (Inter 11px, gold on light-gold bg) + title (Cormorant 21px, text-primary)
- Right: "Lesson 2 of 3" (Inter 13px, tertiary) + "Continue →" (Cormorant 15px, gold link)

#### Journal Section
- Label: "YOUR JOURNAL" — Inter 11px uppercase
- Grid: `repeat(auto-fill, minmax(220px, 1fr))`, 14px gap
- Each card: white, 14px radius, gold border, 20px padding
- Date (Inter 12px, 600, tertiary) + preview text (Inter 14px, secondary, 3-line clamp)
- **Hover:** border strengthens, subtle shadow
- Below: "Open journal →" gold link

#### Goals Section (Interactive)
- Label: "YOUR GOALS" — Inter 11px uppercase
- **"+ Add a goal"** button (Inter 14px, gold) → expands to inline form: text input + Save (gold pill) + Cancel (outline pill). Enter to submit.
- When empty: italic Cormorant 20px tertiary prompt — "What do you hope this season holds for you?"
- Each goal card: white, 14px radius, gold border, 20px 24px padding
  - Row: StateBadge + title (Cormorant 19px, gold) + date (Inter 12px, tertiary)
  - Description below if present (Inter 14px, secondary)
  - Links row: "Coaching on this goal lives at spiritualresults.ai →" (12px, tertiary) + "Release this goal" (12px, tertiary, underlined)
  - **Release confirmation:** "Are you sure? Yes / Cancel" inline
- **State badges:** pill shape (100px radius), 3px 10px padding
  - `set` → gold text on `rgba(139,106,31,0.08)`
  - `reflecting` → goldHover text on lighter bg
  - `released` → tertiary text on grey-ish bg

#### Outbound Link
- Centered: "Looking for a teacher? Visit spiritualresults.ai →" — Inter 14px, tertiary

---

### 3. AdaptGent Floating Helper (all signed-in pages)

**Purpose:** Site help chatbot. Helps with navigation and module understanding only — not deep spiritual counseling.

#### Floating Button
- Fixed bottom-right, 24px from each edge, z-index 1000
- 56×56 circle, `#8B6A1F` gold background
- **Icon:** Custom lantern SVG (thin lines: arch handle, glass body, base, flame dot)
- Shadow: `0 4px 16px rgba(139,106,31,0.20)`, grows on hover
- **Hover:** `scale(1.05)`, shadow intensifies
- When panel open: icon switches to "×" (24px white)

#### Chat Panel
- Fixed, bottom 92px, right 24px, z-index 1001
- Width: `min(400px, calc(100vw - 48px))`, max-height `calc(100vh - 140px)`
- White card, 20px radius, `rgba(139,106,31,0.12)` border, floating shadow

**Header:**
- 18px 22px padding, bottom border
- 32px gold circle with small lantern icon + "AdaptGent" (Cormorant 17px) + "Here to help with the lessons." (Inter 11px, tertiary)
- "×" close button

**Empty State:**
- "How can I help you today?" (Inter 13px, tertiary)
- 4 starter prompts as pill buttons: cream bg, gold border, 100px radius, 10px 18px padding
  - "Explain this passage to me."
  - "Suggest a reflection question."
  - "I don't know what this term means."
  - "What other traditions say something similar?"
- **Hover:** border → goldStrong, text → gold

**Chat Mode:**
- Flex column, 12px gap
- User bubbles: gold bg, white text, rounded `16px 16px 4px 16px`, 11px 16px padding
- Assistant bubbles: cream bg (`#FAF7EE`), secondary text, rounded `16px 16px 16px 4px`
- Loading: "· · ·" with pulse animation

**Input:**
- 10px 14px padding, cream bg, gold border, 12px radius
- Placeholder: "Ask gently…"
- Send button: 36px circle, goldStrong when input has text, surfaceAlt otherwise
- Footer: "Asking gently, no records kept." (Inter 11px, tertiary, centered)

**AI Backend:** In production, constrain to site help + module content. System prompt provided in `sr-adaptgent.jsx`.

---

### 4. Shrine (`/shrine` and `/shrine/[username]`)

**Purpose:** The centerpiece. A personal immersive room the user designs. Friends can visit and chat inside.

#### Room View (full viewport)

**Background:** Full-viewport atmospheric scene. In production, generated by **Gemini API** from user text descriptions. The prototype uses layered CSS gradients for 7 preset themes. See Gemini Integration section below.

**7 Themes (CSS gradient definitions in `sr-shrine-scene.jsx`):**
1. Candlelit Chapel — dark amber base, warm central glow
2. Forest Grove — green-gold dappled light
3. Mountain Altar — sunrise orange-pink, misty peaks
4. Garden — twilight purple-green
5. Hearth Room — deep warm orange, central fire glow
6. Seashore at Dawn — pale blue-grey, golden horizon
7. Desert Oasis — pink-amber twilight

**Vignette overlay:** `radial-gradient(ellipse 70% 65% at 50% 50%, transparent 50%, rgba(0,0,0,0.3) 100%)`

**Objects (overlaid on background):**
All objects are positioned absolutely using `left: x%`, `top: y%`, `transform: translate(-50%, -50%)`. Draggable in editor mode.

| Object | Visual | Animation |
|---|---|---|
| Lit candle | Cream wax body (14×52px) + teardrop flame + warm glow circle | `candleFlicker` 2.5s: opacity 0.7–1, subtle scale oscillation |
| Sacred parchment | Cream card, slight rotation (-1.5deg), Cormorant italic 13px, editable text | None |
| Gold frame | Gold 2px border rectangle (70×85px), dark interior with faint placeholder | None |
| White flower | 5 elliptical petals arranged radially, golden center | None |
| Prayer beads | 12 small circles along a curved arc | None |
| Incense | Brown stick + ember tip (orange glow) + smoke wisps | `smokeRise` 2.2–3s: translateY 0→-62px, opacity fade, scaleX grow |
| Placard | Cream card, single word in Cormorant 18px | None |

Max 7 objects per room.

**Controls (top-right, vertical stack):**
- 38×38 white circles, `rgba(255,255,255,0.80)` with `backdrop-filter: blur(8px)`
- Brown icon inside (strokeWidth 1.5)
- Buttons: Candle toggle, Music toggle, Invite friend, Edit room (host only), Leave (×)
- **Hover:** scale 1.08, bg opacity increases

**Back pill (top-left):** "← Back to dashboard" — white translucent pill, Inter 13px, secondary text, blur backdrop

**Theme badge (top-center):** "[Theme Name] · Scene by Gemini" — dark translucent pill, Inter 10px uppercase, 50% white text

**Guest badge (top-left below back, guest view only):** "[Name]'s shrine." — Cormorant 15px italic, translucent white pill

**Presence indicator (bottom-left, host view):** Sage pulse dot + "[Name] joined you." — translucent white pill, Inter 13px sage

#### Chat Strip (bottom-right)
- **Expanded:** 360px wide translucent white card, `rgba(255,255,255,0.88)`, blur 14px, 18px radius
  - Header: guest avatar initial (sage circle) + "with [Name]" + minimize button
  - Messages: user bubbles (gold bg, white text, `16px 16px 4px 16px` radius) + guest bubbles (cream bg, secondary text, `16px 16px 16px 4px` radius)
  - Timestamps: Inter 10px, tertiary
  - Input: "Speak softly…" placeholder, cream bg, gold border
- **Collapsed:** Single pill — "say something" — translucent white, Inter 13px, secondary

#### Editor View (`/shrine/edit`, host only)

**Layout:** Two-column grid: left 40% controls, right 60% live preview. On mobile (<768px): stacks with preview on top (45vh), controls below.

**Left Column (white bg, scrollable):**

1. **Header:** "Design your shrine" — Cormorant 26px, weight 300, gold

2. **Theme section:** Grid of 7 thumbnail buttons showing the CSS gradient. Active has 2.5px gold border. Theme name label at bottom of each. Aspect ratio 16:10, 10px radius.

3. **Generate with Gemini section:**
   - Textarea: "Describe your ideal sanctuary..." — Inter 13px, cream bg, gold border, 12px radius, 3 rows
   - "Generate with Gemini" pill button (goldStrong). Changes to "Regenerate" after first generation.
   - "View prompt" outline button — toggles structured prompt display
   - Loading state: golden shimmer circle animation + "Imagining your sanctuary…" (Cormorant 15px italic)
   - After generation: "✓ Background generated (1/3 refinements used)" in sage
   - Prompt display: monospace-ish pre block on light bg, shows full structured prompt

4. **Objects section:**
   - "Drag objects in the preview to reposition them." (Inter 12px, tertiary)
   - Placed objects list: each row shows emoji + label + text input (for parchment/placard) + "×" remove
   - Available objects as pill buttons below (filtered to unplaced ones)

5. **Soundscape:** Radio buttons — Wind, Bells, Water, Fire crackle, Silence

6. **Visibility:** Radio buttons — Invited people only (default), Anyone with the link, Just me

7. **Save / Discard** buttons at bottom

**Right Column:** Live ShrineRoom preview with objects draggable.

---

## Interactions & Behavior

### Animations

| Name | Duration | Easing | Properties | Used in |
|---|---|---|---|---|
| `candleFlicker` | 2.5s infinite | ease-in-out | opacity 0.7–1, scaleX/Y oscillation | Candle flame |
| `smokeRise` | 2.2–3s infinite | ease-out | translateY 0→-62px, opacity 0.45→0, scaleX 1→1.7 | Incense smoke |
| `sagePulse` | 2.4s infinite | ease-in-out | box-shadow pulse (sage green 0→6px→0) | Presence dot |
| `fadeInPhrase` | 1.2s forwards | ease | opacity 0→1, translateY 6px→0 | Dashboard greeting phrase |
| `geminiShimmer` | 1.8s infinite | ease-in-out | opacity 0.4→1, scale 1→1.15 | Gemini loading |
| Quote crossfade | 1.6s | ease | opacity 0→1 | Landing page quotes |

### Transitions (all elements)
- Color changes: `0.25s ease`
- Background/border: `0.3s ease`
- Box-shadow: `0.3s ease`
- Scale transforms: `0.25s ease`
- Nav frosted state: `0.5–0.6s ease`
- Shrine background change: `1.5s ease`

### Responsive Breakpoints
- Mobile: < 640px (hide dashboard nav links)
- Tablet: < 768px (shrine editor stacks)
- Use `clamp()` throughout for fluid sizing

---

## State Management

### Dashboard
- `scrolled` (boolean) — nav frost state
- `showAccount` (boolean) — account dropdown
- `goals` (array) — interactive add/remove/state-change
- `showAdd` (boolean) — goal add form visibility
- `confirming` (string|null) — goal ID being released
- `tooltip` (number|null) — which guest avatar tooltip is showing
- Time of day derived from `new Date().getHours()`

### Shrine
- `mode` ('room' | 'editor') — current view
- `theme` (string) — active theme ID
- `objects` (array) — `{ id, type, x, y, props }` — positioned objects
- `candleLit` (boolean) — candle toggle
- `musicOn` (boolean) — soundscape toggle
- `soundscape` (string) — selected ambient sound
- `visibility` (string) — room access level
- `selectedObj` (string|null) — selected object in editor
- `chatExpanded` (boolean) — chat strip state

### AdaptGent
- `open` (boolean) — panel visibility
- `messages` (array) — `{ role, content }` chat history
- `input` (string) — current input text
- `loading` (boolean) — waiting for AI response

---

## Gemini Integration (Shrine Backgrounds)

### Architecture
1. User opens shrine editor, types natural language description
2. Description wrapped in structured prompt (see `buildGeminiPrompt()` in `sr-shrine-editor.jsx`)
3. Send to Gemini API (2.0 Flash or Imagen 3) → returns 16:9 background image
4. Image stored (cloud storage, linked to user account)
5. User can refine up to 3 times with follow-up prompts

### Structured Prompt Template
The prompt constrains Gemini to produce:
- **Painterly/illustrated** style (NOT photographic)
- Contemplative mood, dawn/dusk lighting, low contrast
- Warm earth-tone palette (ambers, creams, deep browns, sage greens)
- **No people, text, faces, animals**
- 16:9 aspect ratio (1920×1080)
- Center 40% left relatively clear (objects overlay there)
- Atmospheric depth at edges with gentle darkening
- Mood words: quiet · warm · candlelit · parchment · prayerful · breath · hush · dawn · dusk · still

Full template in `sr-shrine-editor.jsx`, function `buildGeminiPrompt()`.

### API Configuration
- Server-side API key in `.env`
- Rate-limited per user (3 refinements per session)
- Generated images stored in cloud storage, linked to user account

---

## Vault Integration (Journal)

All journal data saves to **vault.adaptensor.com** instead of Neon.

### Flow
1. User writes journal entry
2. On save, modal prompts: "Include any chat entries?"
3. User selects: which friend → which chat threads → confirm
4. Bundled entry (journal text + selected chats) → POST to Vault API
5. User's personal Vault API key (set in account settings) authenticates

### API
- Each user creates a Vault API key at vault.adaptensor.com
- Key stored in user's Spiritual Results account settings
- All reads/writes go through Vault API
- Entries remain accessible from the .org dashboard

---

## Pages Not Yet Designed (Build from Spec)

Detailed descriptions in `FULL_DESIGN_SPEC.md`:

1. **Sign-up / Sign-in** — Clerk component wrapper pages
2. **Modules** — `/modules` (card list), `/modules/[slug]` (detail), `/modules/[slug]/lessons/[id]` (reader), `/modules/[slug]/lessons/[id]/quiz`
3. **Journal** — `/journal` (list), `/journal/new` (writer), `/journal/[id]` (read)
4. **Goals** — `/goals` (full page version of dashboard goals section)

---

## Tech Stack

- **Framework:** React + TypeScript + Next.js
- **Styling:** Tailwind CSS v4 — utility classes only, no CSS-in-JS
- **Icons:** Lucide React — inline SVG where Lucide doesn't fit
- **Auth:** Clerk (`<SignIn />`, `<SignUp />`)
- **Routing:** `next/link` internal, `<a>` external
- **No UI libraries:** No shadcn, Radix, MUI — full ownership
- **Responsive:** 375px → 1440px, mobile-first
- **Accessibility:** WCAG AA color contrast, visible focus states on all interactive elements

---

## Assets

| File | Description |
|---|---|
| `pendant.png` | Logo pendant — copper/emerald with Star of David pattern, transparent bg. Used at 30–38px beside wordmark. |

---

## File Index

| File | Description |
|---|---|
| `Landing Page.html` | Landing page prototype (open in browser) |
| `sr-landing.jsx` | Landing page React components |
| `Dashboard.html` | Dashboard prototype |
| `sr-dashboard.jsx` | Dashboard components (nav, greeting, shrine card, modules, journal, goals) |
| `sr-adaptgent.jsx` | AdaptGent floating helper (lantern button + chat panel + AI) |
| `Shrine.html` | Shrine prototype |
| `sr-shrine-scene.jsx` | Shrine room view (7 theme backgrounds, object SVGs, chat strip, controls) |
| `sr-shrine-editor.jsx` | Shrine editor (theme picker, Gemini prompt flow, object manager) |
| `tweaks-panel.jsx` | Design review tweaks panel (not for production) |
| `pendant.png` | Logo asset |
| `FULL_DESIGN_SPEC.md` | Complete original design specification |
