# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Up World — the business

This is a **content workspace** (no build/lint/test commands). It is the context library for
Up World: a marketing-education business. Top brand = Up World; underneath sit **Up Club**
(paid membership, ~1,200 marketers), **Big Up Club** (a separate membership, run by Abbie — see
`big-up-club/`, currently an empty skeleton), and **Courses** (standalone, no membership needed:
Brand Manager Boot Camp, The Marketing Accelerator, AI course coming). Founder = Lottie
(also temp head of Up World from mid-July 2026); Liv runs Up Club; Nzola writes the WCU
newsletter; Abbie runs Big Up Club. See `context/team.md`.

## This folder is now mirrored on GitHub
`up-world/` is shared with the team at `oliviapike2702/up-world` (private repo). This local
folder is now a working scratchpad, not the source of truth — GitHub is.
- **Before starting any client/product work** → pull latest from GitHub.
- **At the end of a piece of work** → commit + push what's finished.
- **Stays local only, never pushed:**
  - Anything still marked DRAFT or actively mid-edit (currently: the BMBC podcast LinkedIn
    drafts, the superseded Email 4 draft, and whatever's actively moving in the Accelerator's
    current build log/calendar/weekly updates)
  - `_archive/pre-move-backup-2026-07-21/` — stale by design
  - `node_modules/` under `courses/marketing-accelerator/admin/launch-funnel-dashboard/` — build
    junk, gitignored
- Migrated 2026-09-10: `context/`, `up-club/` (pilot), `big-up-club/`, `courses/` (minus the
  files above), `marketing/`.

## Read first (every task in this folder)
1. `context/tov/_spine.md` — hard writing rules shared by every voice
2. The right voice doc (below) + `context/` (brand, how-to, strategy, audience) as relevant
3. The relevant product folder: `up-club/` or `courses/<course>/`

## Structure
- `context/` — shared brains for everything that's genuinely cross-product: `tov/` (voice
  system), `brand/` (visual identity: hexes, type, logo/photo rules + Drive asset map),
  `how-to/` (canva, mailchimp, hubspot, meta-ads — the LinkedIn guides are NOT here, they live in
  `marketing/Socials/`), `strategy/` (the Q3-Q4
  master timeline — the live cross-project source of truth for what's happening when through
  end of 2026), `research/`, `team.md` (incl. extended freelancer network),
  `how-to/tools-stack.md` (tool access map — never credentials), `roadmap.md` (dated, sourced,
  auto-appended from Granola by the daily digest — committed items only), `blue-sky-thinking.md`
  (undated, hand-maintained, loose ideas not yet committed — graduates to `roadmap.md` or a
  product folder once firmed up), `hiring/` (live and past job specs for Up World roles; the
  Google Doc is the live version, the file here is the snapshot plus the reasoning behind it).
  Up Club-specific audience
  research and plans (incl. the AI Season one-pager) live in `up-club/`, not here.
- `marketing/` — cross-product channel infra only: `Email/`, `Graphics/`, `Paid Ads/`, `Socials/`.
  A course's own campaigns live inside that course's `marketing/` folder (see `courses/` below);
  Up Club's own campaigns (incl. AI Season) live in `up-club/marketing/`. No `campaigns/` folder
  exists at this top level — recreate `campaigns/<year>-<name>/` only if a genuine whole-brand
  push comes up with no single product home.
- `up-club/` — the membership: `context/` (member ops), `customers/` (proposition, pricing,
  personas, agencies — who they are and what we sell them), `marketing/` (Up Club's own
  campaigns, incl. AI Season), `emails/` (WCU), `events/online/` + `events/irl/` (formats + Up
  Fest), `reporting/`, `admin/` (inbox process; cohort launch playbook + strategy/decisions still
  to fill), `sources/` (empty shelf, raw member interviews/testimonials if any turn up)
- `courses/` — one folder per course, same shape (`product/`, `marketing/`, `reporting/`,
  `admin/`, `sources/`); copy an existing course folder's structure to start a new one.
  `product/` includes curriculum, proposition, price, structure, coaches, budget. `sources/`
  is raw and read-only (transcripts, raw testimonials) — never edited, only pulled from.
  `_shared/` holds tools/reporting that span every course rather than living in one.
  A course's own marketing/reporting/admin live inside that course's folder, not in the
  top-level `marketing/` (which is cross-product channel infra only).

## Voice system (context/tov/)
- **Default = Lottie** (founder voice): `Up World tone of voice.md` is the master doc.
  Story-led openers, dry and self-deprecating, every claim grounded in a real number/name,
  sell stated plainly and late, sign-off "Lottie x".
- **Up Club / community "we"**: `Up Club tone of voice.md` — Lottie's energy, less essay,
  more get-you-in-the-room.
- **Liv's own emails**: `liv-email-voice.md` — warmer, chattier, exclamation marks fine.
- **WCU newsletter = Nzola** — no voice doc exists yet; do not guess it. Ask for real sends.
- **Channel layers go on top of the voice.** LinkedIn and podcast posts → `context/tov/linkedin-voice.md`
  (anatomy, 1,250-char floor, line breaks, banned constructions; it also resolves the emoji,
  sign-off and closing-question conflicts across the docs). Email craft → `marketing/Email/email-playbook.md`
  (voice moves, the two structure genres, proof, failure log). Lottie's *personal* LinkedIn feed is
  the `lottie-linkedin` skill's job, not these docs.
- Facts for Lottie-authored copy come from `context/research/Lottie background bank.md` —
  never invent credentials or anecdotes.
- Gold reference copy lives in `context/tov/examples/` (incl. the before/after
  "Email 4 — TOV comparison" teaching example).
- **`context/tov/copy-learnings.md`** — empirical rules from Liv's real edits to Up World copy.
  Load this alongside the voice docs for any writing task. Rules here take precedence over
  general TOV guidance where they conflict.
- After drafting, run the `humanizer` skill. The `up-world-tov` and `email-sequence` skills
  also apply to copy work.
- **`up-world-tov` is the shareable skill for the team.** It carries bundled copies of these docs
  in `.claude/skills/up-world-tov/references/` so it works on a machine without this workspace.
  The files here stay the source of truth. After editing any voice doc, run
  `.claude/skills/up-world-tov/tools/sync-references.sh` to push the change into the skill.

## Hard guardrails
- **Never invent** prices, dates, spots, member/subscriber numbers, quotes, or testimonials.
  Unknown → write `[PLACEHOLDER]` and flag it. (BMBC facts are documented in
  `courses/brand-manager-boot-camp/product/`; Up Club pricing (Jan 2026) is in
  `up-club/customers/offer-pricing.md` — confirm before quoting publicly.)
- **Email is draft-only** — a human always approves and sends.
- UK English. **No em dashes.** Sentence-case headings. No AI-tell vocabulary
  (see `context/tov/_spine.md` and `../rules/`).
- Tool split: **Mailchimp** = big campaigns, selling, WCU newsletter.
  **HubSpot** = nurture flows, course weekly (cohort) emails, CRM source of truth.
- Live data (contacts, segments, stats) lives in HubSpot/Mailchimp — pull it, don't copy it
  into files. Finished assets live in Google Drive — link, don't duplicate.

## Filing rules
- Goes out to win/convert people → `marketing/` (channel folder, or `campaigns/<year>-<name>/`
  for a full push).
- What a product IS or how it's run → that product's folder.
- Reference used by everything → `context/`.
- New course → copy an existing course folder's structure (`product/`, `curriculum/`, `cohorts/`).
