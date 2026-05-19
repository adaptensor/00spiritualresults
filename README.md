# spiritualresults.org

Course-style learning platform. Modules drawn from the world's wisdom traditions: Christianity, Islam, Buddhism, Sufism, Hinduism, Judaism, Taoism, and more. Users sign up, work through self-paced lessons, reflect, take quizzes, track progress.

The deeper-AI side lives separately at [spiritualresults.ai](https://spiritualresults.ai).

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind v4
- **Auth**: Clerk (standalone .org instance — *not* the adaptensor.com SSO)
- **Database**: Neon Postgres + Prisma 6
- **Hosting**: Vercel
- **AI generation**: Anthropic Claude (Phase 2)

## Phase 1 status (this scaffold)

- [x] Marketing landing page
- [x] Clerk sign-in / sign-up
- [x] Dashboard with enrolled modules + progress count
- [x] Module browse + detail pages
- [x] Lesson reader with markdown rendering + reflection prompts
- [x] `POST /api/progress` to mark lessons complete
- [x] Prisma schema for User / Module / Lesson / Quiz / Enrollment / LessonProgress / QuizAttempt / Reflection
- [x] One hand-authored demo module ("Forgiveness Across the Wisdom Traditions") with 3 lessons + a 5-question quiz
- [x] Quiz-taking UI (`QuizPlayer` client component + `/modules/[slug]/lessons/[lessonId]/quiz` route + `POST /api/quiz-attempt`)
- [ ] Admin route for AI-generated modules — Phase 2
- [ ] Production DNS swap from Firebase to Vercel — see "Going live" below

---

## Local setup

### 1. Install

```powershell
cd C:\Adaptensor\00spiritualresults
npm install
```

### 2. Create a Clerk application

1. Go to https://dashboard.clerk.com → **New Application**.
2. Name: **Spiritual Results**.
3. Enable Email + Google sign-in providers.
4. Copy the **Publishable key** and **Secret key** from the API Keys tab.
5. *Do not* point this at the adaptensor.com Clerk instance — this is a separate product on its own TLD.

### 3. Create a Neon database

1. Go to https://console.neon.tech → **Create Project**.
2. Project name: `spiritualresults`.
3. Region: `us-east-2` (or wherever your Vercel is).
4. Copy the **pooled** connection string for `DATABASE_URL`.
5. Copy the **direct** (non-pooled) string for `DIRECT_URL`.

### 4. Fill `.env.local`

```powershell
cp .env.local.example .env.local
```

Paste in your Clerk keys + Neon URLs. The `ANTHROPIC_API_KEY` is only needed once you wire up the Phase 2 generator — leave the placeholder for now.

### 5. Push the schema + seed the demo module

```powershell
npm run db:push      # creates all tables in Neon
npm run db:seed      # seeds the "Forgiveness" demo module
```

### 6. Run the dev server

```powershell
npm run dev
```

Visit http://localhost:3000. You should see the marketing landing page. Click **Begin** → sign up → land on the dashboard → click **Browse modules** → open the demo module → work through the lessons.

---

## Going live

### Vercel deploy (preview)

```powershell
npx vercel --yes --scope=jamies-projects-b8b002f6
```

This creates a `*.vercel.app` preview URL. Set the same env vars from `.env.local` in the Vercel project's Environment Variables tab. Re-deploy.

### Production domain swap

`spiritualresults.org` currently points (or attempted to point) at Firebase Hosting per `c:\Adaptensor\spiritual-results-platform\DNS_SETUP.md`. That's why you see "Site Not Found" — Firebase has no deployed content there.

To swap to Vercel:

1. Promote a preview to production via `vercel --prod`.
2. In Vercel project → **Domains** → add `spiritualresults.org` + `www.spiritualresults.org`.
3. Vercel will show you DNS records (an `A` for the apex and a `CNAME` for `www`).
4. At your registrar (GoDaddy per DNS_SETUP.md):
   - **Remove** the Firebase `A 199.36.158.100` and any stale `A 15.197.148.33` / `A 3.33.130.190` records.
   - **Remove** the Firebase `TXT hosting-site=spiritual-results`.
   - **Add** Vercel's `A` record and the `CNAME www`.
5. Wait 5–30 min for DNS propagation. Vercel auto-provisions SSL.

---

## Authoring modules

For v1, modules are seeded via `prisma/seed.ts`. To add a new module:

1. Open `prisma/seed.ts`, add a new module to the seed.
2. Run `npm run db:seed`.

For Phase 2 (the actual content engine), the plan is:

1. Index the corpus (the 100 sacred/philosophical texts in `C:\Adaptensor\Spiritual_Results\Library_1-100\`, the Quran translations in `Spiritual_Results\Islam\`, and the Bahá'í books in `Spiritual_Results\Bahai\`) into pgvector on Neon.
2. Build an admin UI at `/admin/generate` where Jamie types a topic.
3. `POST /api/generate-module` (currently stubbed at `src/app/api/generate-module/route.ts`) retrieves passages from the corpus, asks Claude to produce a structured module, persists it as `status: DRAFT`.
4. Admin reviews + publishes from a `/admin/modules` UI.

The stub endpoint at `src/app/api/generate-module/route.ts` has the full architecture sketch in its top comment.

---

## Project structure

```
00spiritualresults/
├── prisma/
│   ├── schema.prisma          ← data model
│   └── seed.ts                ← demo module
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx           ← marketing landing
│   │   ├── sign-in/[[...rest]]/page.tsx
│   │   ├── sign-up/[[...rest]]/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── modules/
│   │   │   ├── page.tsx       ← browse all modules
│   │   │   └── [slug]/
│   │   │       ├── page.tsx   ← module overview
│   │   │       └── lessons/[lessonId]/page.tsx  ← lesson reader
│   │   └── api/
│   │       ├── progress/route.ts          ← mark lesson complete
│   │       └── generate-module/route.ts   ← Phase 2 stub
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   └── LessonReader.tsx   ← client component for "Mark complete"
│   ├── lib/
│   │   ├── db.ts              ← Prisma singleton
│   │   ├── auth.ts            ← Clerk → local User upsert
│   │   └── markdown.ts        ← tiny MD → HTML renderer
│   └── middleware.ts          ← Clerk route protection
├── .env.local.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Convention notes

- Folder name `00spiritualresults` matches the Adaptensor convention (00adaptday, 00adaptcity, 00stoneofphilos, 00relastrat). The site itself lives on a non-adaptensor TLD (`.org`), so its Clerk instance is independent of the adaptensor.com SSO ecosystem.
- All authed pages use `export const dynamic = "force-dynamic"` — Clerk reads cookies, so no SSG.
- Server actions are used sparingly (only for enrollment); most mutations go through `/api/*` routes for explicit client → server contracts.
