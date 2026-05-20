# NEXT_SESSION — spiritualresults.org handoff

Last touched: 2026-05-20.
Read this first on next session start. Companion to [`CLAUDE_DESIGN_PROMPT.md`](CLAUDE_DESIGN_PROMPT.md) (the original design doc) — this doc tracks delta since launch.

---

## State of the product

**Live**: https://spiritualresults.org — production-deployed, SSL provisioned, live Clerk keys.

**Built end-to-end:**
- Phase 1 scaffold: landing, Clerk auth (standalone instance, not Adaptensor SSO), `/dashboard`, modules browse/detail, lesson reader, quiz UI, demo seed module ("Forgiveness Across the Wisdom Traditions").
- Auth bug fix: local User now resolves by email when Clerk re-creates an OAuth identity (`src/lib/auth.ts`, commit `1a6f611`).
- **Shrine MVP** — full editor with theme picker, 7 object primitives, drag-to-position, soundscape + visibility radios, persistence via `PUT /api/shrine` (commit `923b189`).
- **Shrine Imagen integration** — `/api/shrine/generate` calls `imagen-4.0-ultra-generate-001`, uploads PNG to Vercel Blob, persists `generatedBgUrl` on the Shrine row. Editor Generate button is live with loading state, regenerate, and "Clear · use preset" (commit `a09d00e`, this session).

---

## ✅ Prod env vars pushed (2026-05-20)

`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `BLOB_READ_WRITE_TOKEN` are all on Vercel for production+preview+development. Redeploy `dpl_CD3GWWVDEfroMuPhKQGFb9t3AgBK` is live. CLI smoke confirmed landing 200, `/shrine` 307 (auth redirect), `/api/shrine/generate` 401 (auth-guarded). Final auth-required test (logging in and clicking Generate) still owed once Jamie has a moment in-browser.

---

## What's left until completion (priority order)

### 1. Shrine invites + chat — the social half of the shrine
**Scope:** the design vision is "two souls sharing a candlelit room." Today the room is private. To unlock that:
- `/shrine/[username]` — guest view route, looks up shrine by username (need to add `username` to User, currently unique slug missing).
- Invite-by-link flow (`/shrine/[username]?invite={token}` with single-use token in DB), invite-by-email (Resend).
- Real-time chat strip — the `<ChatStrip>` in `ShrineRoom.tsx` is purely visual today. Wire Pusher or Supabase Realtime, persist messages, presence indicator wired to real socket events not the hardcoded `guest = null`.
- Sound the chime when someone joins.

**Estimate:** ~2 sessions. Bigger because of the realtime infra decision + presence/permission edge cases.

### 2. Phase 2 AI lesson generator — the LMS engine
**Scope:** the corpus exists (`c:\Adaptensor\Spiritual_Results\Library_1-100\`, Quran, Bahá'í) but nothing reads it.
- pgvector extension on Neon, embed all 100+ source texts.
- Admin role on `User` (not yet a field — Phase 2 prereq).
- `/admin/generate` — admin types a topic, Anthropic Sonnet 4.6 retrieves passages cross-tradition, produces Module + Lessons + Quiz as DRAFT.
- Replace 501 stub at `src/app/api/generate-module/route.ts`.

**Estimate:** ~3 sessions. Vector setup + RAG plumbing + admin UI + content review pass.

### 3. Soundscape audio
Currently radio buttons store the choice but nothing plays. Add `<audio>` element to `ShrineRoom`, source 5 ambient loops (wind, bells, water, fire crackle, silence). Cheap if loops are royalty-free; could also generate via Lyria (`lyria-3-pro-preview` is on the Gemini API per the model list).

**Estimate:** ~half a session.

### 4. Journal + Goals (designed, not built)
- `/journal`, `/journal/new`, `/journal/[id]` — private markdown entries.
- `/goals` — three states (set / reflecting / released), soft outbound link to spiritualresults.ai.

**Estimate:** ~1 session each.

### 5. Quiz UX polish
Design calls for contemplative tone ("5 of 5. Held with care." / "4 of 5. Take a breath…"), sage-check vs soft-amber dots, no bright red. Currently functional but jars against the rest of the brand.

**Estimate:** ~half a session.

### 6. AdaptGent helper
Floating bottom-right button, deep gold (`#8B6A1F`), free for everyone, lesson-help only. Stub the API as a thin Anthropic Sonnet 4.6 call with a system prompt scoped to "explain this lesson, do not give general life advice."

**Estimate:** ~half a session.

### 7. Account dialog
Small modal off the avatar — email, sign out, delete account.

**Estimate:** ~quick.

---

## Reference

- **Codebase**: `c:\Adaptensor\00spiritualresults\` — Next.js 16, Tailwind v4, Prisma 6, Neon, Clerk, Anthropic SDK, `@vercel/blob`, `@google/genai` (via REST, no SDK).
- **Repo**: `adaptensor/00spiritualresults` (public), main auto-deploys to Vercel.
- **DB**: Neon project `spiritualresults`, `neondb_owner`, single DB shared by dev + prod.
- **Clerk**: standalone production instance `spiritualresults.org`; dev is `well-gobbler-41.clerk.accounts.dev`.
- **Design source of truth**: [`docs/CLAUDE_DESIGN_PROMPT.md`](CLAUDE_DESIGN_PROMPT.md).
- **Memory entry**: `c:\Users\jamie\.claude\projects\c--Adaptensor\memory\project_spiritualresults.md`.

## Suggested first action next session

Push the two env vars to Vercel + redeploy + smoke-test the prod shrine (15-min task). **Then** start on shrine invites + chat — that's the feature that turns a personal room into the product Jamie actually wants to ship: two souls sharing a candlelit space.
