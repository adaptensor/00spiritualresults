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
- **Shrine Imagen integration** — `/api/shrine/generate` calls `imagen-4.0-ultra-generate-001`, uploads PNG to Vercel Blob, persists `generatedBgUrl` on the Shrine row. Editor Generate button is live with loading state, regenerate, and "Clear · use preset" (commit `a09d00e`).
- **Shrine social half — SHIPPED 2026-05-20.** Invites by link, guest view route, real-time chat + presence + chime, real-time kick on block, full permission gating (PRIVATE / INVITED / LINK). Live-verified on prod with 3 real test accounts. Plan: `C:\Users\jamie\.claude\plans\shrine-invites-and-chat.md`. Commits: `c2eb209`, `dd3eb6f`, `3caadc7`, `dd40377`, `cc4336c`.

---

## What's left until completion (priority order)

### 1. Phase 5 — Invite-by-email via Resend
The DB row + invite URL already get created when an email is filled in the editor's "Invite a friend" section. The actual send isn't wired yet.

**To finish:**
- **DNS first (manual, you):** verify `invites.spiritualresults.org` in Resend dashboard. Add SPF + DKIM records at the domain registrar. Wait for DNS propagation (~minutes to hours).
- Install `resend@^6.12.3` and add `RESEND_API_KEY` to `.env.local` + Vercel.
- Extend `POST /api/shrine/invite` to send via Resend when `email` field is present. Create a branded React Email at `src/emails/ShrineInvite.tsx`.
- Test send to a personal Gmail; check DKIM headers pass.

**Estimate:** ~half a session of code + however long DNS takes.

### 2. Phase 7 — Lyria-generated soundscape + chime audio
Currently the synthesized chime works (you confirmed it during the 2026-05-20 verification) but it's a 1.6s sine wave. Soundscape radios save the choice but nothing plays.

**To finish:**
- Generate 5 ambient loops (wind, bells, water, fire crackle, silence) + 1 temple bell chime via Lyria-3 Pro on the existing Gemini API key.
- Host on Vercel Blob under `shrine-bg/audio/<name>.mp3`.
- Render `<audio loop autoPlay={false}>` in ShrineRoom when `musicOn && soundscape !== 'silence'`.
- Swap the Web Audio synthesized chime in `useShrineChannel` for an `<audio>` element pointing at the temple bell blob URL.

**Estimate:** ~half a session.

### 3. Polish items found during 2026-05-20 verification
Small but visible UX warts. Worth bundling.

- **Editor Save auto-navigates to `/shrine`.** Annoying for iterative testing (switch visibility → Save → bounced out of editor). Want "save and stay" — keep user on `/shrine/edit`, show a brief "Saved" toast or button-state, no `router.push`.
- **Layout shifts when clicking Visibility radio.** Likely the InvitePanel async-refetching guests/invites — while waiting for the response the panel empties, page reflows, then re-fills. Fix: hold the panel's prior data during refetch, or render skeleton bars at the correct height.

**Estimate:** ~20 min combined.

### 4. Chat history in PRIVATE mode — design call surfaced during verification
Jamie noticed during the 2026-05-20 test: after switching to PRIVATE and being bounced into `/shrine`, the chat strip still showed messages from the previous session with test2. This isn't a security bug (host always sees their own room) but raises **two design concerns** worth thinking through:

- **Vibe:** PRIVATE is meant to feel contemplative-alone. Seeing chat bubbles from a prior social session breaks the mood the setting evokes.
- **Privacy of past guests:** if visibility flips back to INVITED and a NEW guest is invited, that new guest sees ALL prior chat — including everything the previous guest said. Test2 didn't consent to test3 reading their words.

Design options (any combination):

1. **Hide the chat strip entirely when `visibility === 'PRIVATE'`.** Cheap, contemplative. Doesn't fix concern #2.
2. **Per-guest scoped chat history.** Each guest only sees messages from sessions when they were admitted. Schema change: track each ShrineGuest's `firstJoinedAt` + `lastBlockedAt`, scope chat queries to that window. Most "correct" but most complex.
3. **Ephemeral chat — soft-delete on visibility change or last-guest-leaves.** Chat as conversation-in-the-moment, not record. Lossy.
4. **Host-controlled "Clear conversation" button in the editor.** Opt-in wipe. Most flexible, least magical. Pairs nicely with #1.
5. **Per-conversation threading.** Each invite redemption opens a new chat thread; previous threads viewable separately by host. Most complex.

**Recommended bundle:** #1 + #4 — hide chat when PRIVATE (vibe) AND give the host an explicit "End conversation" wipe button (privacy of past guests).

**Estimate:** ~half a session including the polish items above.

### 4. Phase 2 AI lesson generator — the LMS engine
**Scope:** the corpus exists (`c:\Adaptensor\Spiritual_Results\Library_1-100\`, Quran, Bahá'í) but nothing reads it.
- pgvector extension on Neon, embed all 100+ source texts.
- Admin role on `User` (not yet a field — Phase 2 prereq).
- `/admin/generate` — admin types a topic, Anthropic Sonnet 4.6 retrieves passages cross-tradition, produces Module + Lessons + Quiz as DRAFT.
- Replace 501 stub at `src/app/api/generate-module/route.ts`.

**Estimate:** ~3 sessions. Vector setup + RAG plumbing + admin UI + content review pass.

### 5. Journal + Goals (designed, not built)
- `/journal`, `/journal/new`, `/journal/[id]` — private markdown entries.
- `/goals` — three states (set / reflecting / released), soft outbound link to spiritualresults.ai.

**Estimate:** ~1 session each.

### 6. Quiz UX polish
Design calls for contemplative tone ("5 of 5. Held with care." / "4 of 5. Take a breath…"), sage-check vs soft-amber dots, no bright red. Currently functional but jars against the rest of the brand.

**Estimate:** ~half a session.

### 7. AdaptGent helper
Floating bottom-right button, deep gold (`#8B6A1F`), free for everyone, lesson-help only. Stub the API as a thin Anthropic Sonnet 4.6 call with a system prompt scoped to "explain this lesson, do not give general life advice."

**Estimate:** ~half a session.

### 8. Account dialog
Small modal off the avatar — email, sign out, delete account.

**Estimate:** ~quick.

---

## Known limitations of the shipped social half

These aren't bugs; they're product/design boundaries worth knowing before users notice.

- **Presence pill shows only one other person at a time.** The design was "two souls sharing a candlelit room." If a 3rd person joins, presence pill picks the first "other" alphabetically. A multi-user pill would need a different visual treatment.
- **Candle/music toggle doesn't broadcast.** Host can toggle candle on/off and guests don't see it change live — only on next page load. This is by-design for v1; broadcasting host-state changes via the channel is a small follow-up if Jamie wants it.
- **First chime may be silent.** Browser autoplay policy blocks AudioContext until user gesture. Once the user has clicked anywhere on the page, subsequent chimes work. Phase 7 audio swap won't fix this — it's a browser policy. The presence pill is the primary signal.
- **Chime fires once per unique user per session.** A legit close-and-reopen of the other tab won't re-chime in this session. Page refresh resets the chime tracker. This is deliberate to avoid the loop bug we hit during testing.
- **Stale data in the editor.** The InvitePanel only refetches on mount — if test2 redeems an invite while test1 has the editor open, test1 doesn't see the updated guest list until refresh. Acceptable for v1; could add WebSocket-driven UI updates later.

---

## Reference

- **Codebase**: `c:\Adaptensor\00spiritualresults\` — Next.js 16, Tailwind v4, Prisma 6, Neon, Clerk, Anthropic SDK, `@vercel/blob`, `@google/genai` (via REST, no SDK), `@supabase/supabase-js`.
- **Repo**: `adaptensor/00spiritualresults` (public), main auto-deploys to Vercel.
- **DB**: Neon project `spiritualresults`, `neondb_owner`, single DB shared by dev + prod.
- **Clerk**: standalone production instance `spiritualresults.org`; dev is `well-gobbler-41.clerk.accounts.dev`.
- **Supabase**: project `ucozhxqctrzieptuavfl.supabase.co`, Realtime-only (no DB use). Free tier. Keys in `.env.local` and Vercel as `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (sb_publishable_), `SUPABASE_SERVICE_ROLE_KEY` (sb_secret_).
- **Design source of truth**: [`docs/CLAUDE_DESIGN_PROMPT.md`](CLAUDE_DESIGN_PROMPT.md).
- **Invites + chat plan**: `C:\Users\jamie\.claude\plans\shrine-invites-and-chat.md`.
- **Memory entry**: `c:\Users\jamie\.claude\projects\c--Adaptensor\memory\project_spiritualresults.md`.

## Suggested first action next session

Choose by appetite:

- **15 minutes:** ship the two polish fixes (#3 above — save-and-stay, layout reflow). Easiest win, makes the editor feel professional.
- **~1 session:** start Phase 5 (Resend email). DNS first, then code. Email invites complete the social-half experience.
- **~3 sessions:** start Phase 2 (AI lesson generator). The LMS engine — the other half of what spiritualresults.org is supposed to be.

Personal recommendation: ship the polish fixes first (15 min), then move to Phase 5 in parallel with DNS work, and use the freed time to start Phase 2 setup (pgvector extension on Neon, corpus embedding script). That gets you to feature-complete-MVP in 4-5 sessions.
