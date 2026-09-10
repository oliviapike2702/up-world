# TMA September 2026 — the build map

**The one goal: save Liv time on this launch.** Concretely that means (1) she doesn't draft copy,
(2) she doesn't chase applicants by memory, (3) she doesn't have to hold the plan in her head.
Everything below serves one of those three. If a piece of work doesn't, it isn't on this map.

Written 29-30 Jul 2026 with Liv. Replaces the earlier M0-M8 ladder, which was **sequenced wrong** —
it built the weekly-maintenance layer before the marketing it was supposed to maintain. Liv caught
it: "how are you wanting to write the task when emails aren't sorted, LinkedIn posts haven't been
planned, partial applicants aren't ready."

**Anchor dates:** doors open Fri 31 Jul · one talk Wed 2 Sept · external deadline Fri 18 Sept ·
internal deadline Fri 25 Sept · kickoff Wed 30 Sept · course ends 16 Dec.
**Target:** 25 paid at £1,490 exc VAT (best-ever is 21).
**The calendar is `../marketing/2026-sept-calendar.md`** — the marketing truth. Dates move there first.

---

## Three tracks, not one ladder

The mistake was treating this as a single chain. It's three, and only one of them has a dependency.

```
TRACK A — CONTENT ......... the emails and posts. The actual time saving.
TRACK B — APPLICATIONS .... screening + partials. Independent of A. Can run in parallel.
TRACK C — WEEKLY RHYTHM ... the Sunday message. REVIEWS what A produced, so it comes last.
                                    ↑
                            A must exist first
```

Track C cannot come first. It maintains; it doesn't create.

---

## Already done (30 Jul)

Worth stating, because the remaining list reads longer than it is.

- **Dates anchored.** Three separate documents disagreed about kickoff. Now one truth: 30 Sept.
- **The calendar built** — 10 emails, narrative arc, segments, max 2 CTAs, one value email a week,
  no countdown emails.
- **Warm-lead list exported** — 47 live deals, 42 with LinkedIn URLs:
  `../marketing/2026-07-29-warm-leads-linkedin-dm-list.csv`
- **Benchmarks re-anchored** — funnel tracker rebuilt to 9 weeks against the real kickoff; all four
  of M2's open questions closed. Targets: 3,530 views / 1,263 TF views / 694 starts / 139
  applicants / 29 accepted / 25 paid.
- **A real bug fixed** — the Typeform pull read an endpoint returning 0 applications while 4 real
  people had applied. Everything downstream would have shown zero.
- **Sheets write unblocked** — the weekly refresh can actually write now.
- **Screening rubric** exists as the `tma-applicant-screening` skill, built from ~30 real decisions.
- **Application → deal and payment → Paid** automations built and tested (22 Jul).
- **Lottie's plain-text voice model found** — two real emails, in Mailchimp only, now referenced in
  the calendar.

---

# TRACK A — Content

The bulk of the work, and the bulk of the time saving. Liv checks TOV, key info, look, and
dates/facts. She does not draft.

### A1 · Friday's launch email — **the deadline**
The Jan Development Plan email re-cut as doors-open. Six CTAs down to two. New sender (it's signed
by Jonny, who has left). Goes to List All.
⚠ **Check the Mailchimp draft first** — a September version reportedly exists already (build log,
22 Jul). Don't rebuild what's half-built.
→ *Exit test:* sitting in Mailchimp, reviewed by Liv, ready to send Fri 31 Jul.

### A2 · Emails 2-10 — one at a time until the voice is calibrated, then batch
**Not a batch of nine up front.** Liv's call, 30 Jul: the copy hasn't been validated once, so
producing nine drafts risks producing nine wrong ones. An earlier version of this plan argued for
batching on narrative-coherence grounds — coherence is worth nothing if the voice is off.

The sequence that makes tweaks compound instead of repeat:
1. Draft A1. Liv edits.
2. **Her edits go into `context/tov/copy-learnings.md`** — which exists for exactly this, and which
   the workspace rules say takes precedence over general voice guidance.
3. Draft the next one starting from those rules. Repeat.
4. Once edits drop off, batch the remainder — by then coherence is a free win rather than a gamble.

If the tweaking *doesn't* drop off after two or three, that's real signal about the voice work, not
something to push through.

Needs first: `context/tov/_spine.md`, the Lottie voice doc, and `copy-learnings.md`.
→ *Exit test:* each draft in Mailchimp, filed in a named folder for this cohort; `copy-learnings.md`
updated after each round of Liv's edits.

### A3 · LinkedIn posts against the same beats
Company page, Liv's own, Lottie's via Heloise. Hung off the calendar's beats so they reinforce the
emails rather than running parallel to them.
⚠ **Limit:** LinkedIn can be drafted, never posted or measured, by Claude.
→ *Exit test:* a post per beat, ready to schedule.

### A4 · The two missing assets
- **New case studies.** `decisions.md` flags this as repeatedly unsolved — the handover doc says the
  course is life-changing but the case studies don't exist, and the "Testimonials for graphic" Drive
  folder is empty. This blocks email #6 (grad stories) and weakens #9. **It is a gathering job —
  asking grads — not a writing job.** Cannot be written around.
- **Podcast graphics** for email #8. The `up-world-design` skill can make these on brand.

**Blocked on Liv/Lottie:** emails #2 and #10 are plain text from Lottie and need her *real*
material. There is a `context/research/Lottie background bank.md` for exactly this reason. If it
holds nothing true about why she built the course, it's a question for Lottie, not a writing task.

---

# TRACK B — Applications

Independent of Track A. Nothing here waits on the emails.

### B1 · Screen the four applications already in — **now**
Four real completed applications arrived **before doors opened**: Kanchan Supekar (27 Jul), Elif
Gokcen and Rana Youness (28 Jul), Enya Buchenau (29 Jul). Use `tma-applicant-screening`.
→ *Exit test:* four recommendations made, Liv confirms or corrects, deals moved.

### B2 · Screening on a schedule
The rubric and the Slack loop are already proven manually end to end. This just puts them on a timer.
Claude recommends in-thread and tags Liv; **nothing moves until she confirms, even the obvious ones**;
the stage's own HubSpot workflow sends the applicant email, never Claude.
⚠ **Blocked on one unknown:** whether Claude can post to Slack unprompted. Claude Tag was assessed
22 Jul and parked as a context reset. Until tested, the honest fallback is that Claude drafts and Liv
pastes.
→ *Exit test:* one real application screened without Liv summoning anyone.

### B3 · Partials, daily
⚠ **Corrected 7 Aug — the 30 Jul verification was wrong.** It claimed part-fills "come back from the
API with the email." Tested against real ones on 7 Aug and confirmed false: Typeform's public REST
API does not expose partial submissions with answer data at all — not unfiltered, not
`completed=false`, not a wide date range, not a direct GET on a known partial's response ID. The API
only ever returns fully completed responses, or pure zero-answer landing stubs.

**Real partials do exist and are chaseable** — 5 confirmed live on 7 Aug, including two senior
profiles (Head of Digital, Head of marketing and strategy) stalled 6-9 days — but they're only visible
in Typeform's own Results UI / Smart Insights screen, not via any API call. **Not automatable daily.**
The workable version: Liv exports a CSV from that screen periodically, and
`.claude/skills/tma-launch-marketing/scripts/parse-typeform-partials.py <file>` turns it into a chase
list (name, role, days stalled, source). `weekly-pull.js` and the skill are corrected to say this
plainly rather than silently reporting "0 contactable partials."
→ *Exit test:* Liv exports a CSV, the parser surfaces someone worth a personal chase, she chases them.

---

# TRACK C — Weekly rhythm

Comes last. Reviews what Track A produced and what Track B surfaced.

### C1 · The `tma-launch-marketing` skill
The written rules, so a fresh session produces the same thing every week. Must contain:
- **Liv's own format**, taken from her real Slack updates: 🧠 for the diagnosis, ✍️ for what was done
  about it. Flags grouped by area, not one flat list. **Named individuals, not counts** ("Jess
  Chadwick, Rachel Loosey…"). Actions tagged to people.
- **The rule that stops it being a readout:** a number only appears if a judgement is attached.
  Every line ends in "so I've done X" or "so you need to decide Y". No FYI lines. "3 of 25 paid" on
  its own is something Liv can already see in HubSpot.
- **Silence when nothing changed.** A task that always speaks becomes wallpaper.
- **Opens are noise** — the domain issue has suppressed them ~6 months. Judge on clicks, replies,
  applications, unsubs.
- **Thresholds** from `launch-funnel-dashboard/m2-launch-setup-and-curve.md` §6-7 — without written
  targets, "conversion is half what it should be" isn't computable.
- **The real stretch is conversion, not traffic.** Both ads-era cohorts already beat the view
  targets; ads-era applicant→paid runs 15-19% vs ~47% without ads. A red flag on views matters far
  less than one on applicant→paid.
- **Two gotchas the dashboard build found the hard way:** Typeform *visits* are cumulative since form
  creation, so weekly needs a delta; HubSpot must be filtered on
  `hs_v2_date_entered_current_stage`, or 200+ old-cohort deals count as this week's activity.
- **Bottleneck definitions:** Acceptance sent >10 days, interview booked but not held, applied >5
  days with no contact.
- Voice: apply-for-a-place never buy-a-ticket; scarcity of awarded places never discounts; never
  invent a price, date or place count; **nothing ever sends without Liv**.
→ *Exit test:* hand it to a session with no memory of this work and get the same output. That test is
the point — a scheduled task *is* a session with no memory.

### C2 · The Sunday task
Scheduled, reading the calendar + C1. Four things, in Liv's stated order:
1. **Marketing funnel health** — red flags with a suggested action, green flags with a reason
2. **Pipeline health** — where it's bottlenecking, and named actions ("move X to cold", "call Y",
   "Z said two weeks ago they were checking with their manager")
3. **Last week / this week** — short highlights only, plus marketing to review with what changed and
   why, plus **anything that hasn't happened**
4. All four sources confirmed live 30 Jul: GA4 ✅ · Typeform ✅ · HubSpot ✅ · Mailchimp ✅

**Also decide here:** what happens to `control-room-refresh` (Fri 3pm) and `workspace-review`
(Fri 9am), which overlap this. Three reports and no single truth is the failure mode.
→ *Exit test:* in the scheduled-task list with a real next-run date.

### C3 · Run it once and fix it
First runs are always wrong — wrong length, wrong depth, too much data and not enough judgement.
→ *Exit test:* Liv has read one real output and said what to change. **Until this, C1 and C2 are a
draft, not a system.**

---

## A1 build notes (30 Jul) — read before building email #2

Campaign `356acdbab4`, web_id `14208326`, "Accelerator LAUNCH Sep 2026 - doors open (Fri 31 Jul)".
Built by editing Liv's existing Sept draft (created 20 Jul), which had links, UTMs, course dates and
sender updated but the January copy untouched.

**Fixed:** January hook → the next-quarter development-plan conversation · £1,490 stated (full price
only) · Jo Fawcett corrected from "Marketing Executive" to ex-CMO Zizzi · Sam Thomson added ·
podcast guests named · a wrong talk date (19 Aug, when the talk is 2 Sept) · a live
`[PLACEHOLDER-LUMA-LINK-TALK-1]` broken link · a rule-of-three banned by `_spine.md` · 20 links cut
to 4 buttons, all "APPLY NOW", plus the boss-guide link.

**Cut on Liv's call:** the talk block (too many CTAs for one email), the lavender "PLUS, you'll get"
benefits box, a duplicate Molly section, and the orphaned dividers left behind.

### Three lessons that cost real time — do not repeat

1. **Pushing raw HTML converted the campaign to custom-HTML, so Liv lost click-to-edit.** This is
   documented in `context/how-to/mailchimp.md` ("prefer the template route for editability") and was
   walked into anyway. **Build email #2 into the classic master template `11604777`**, which is both
   API-fillable and click-editable.
2. **Claude and Liv overwrote each other.** A PUT was verified live, then Liv's open browser tab
   saved its stale copy back over it. Only one party edits at a time — say so explicitly before
   touching a campaign the other has open.
3. **Repurposing an existing block duplicated content.** The talk block was rewritten into "Molly's
   story" without checking that the original Molly case study sat directly beneath it. Read what
   surrounds a block before reusing it.

**Left for Liv, deliberately:** audience (still 3,858 engaged, calendar says List All), send time
(March's 8:45am Wednesday did 63.9% opens; Friday afternoon is the weakest slot), and the footer.

**The footer is not in the email.** `contact.company` on audience `db462cb289` is set to
"The Copy Club, 20 Groveway" — so it appears on **every** Up World Mailchimp send. Not changed: it
may be the registered company name and therefore legally correct, while Up World is the trading name.
Needs a decision, not a fix.

## Not Claude's, and some of it is urgent

- **Talk booking (Nzola) by Fri 14 Aug.** The feeder email goes 19 Aug and can't promote a Luma page
  that doesn't exist. Single most at-risk item in the launch.
- **The Copy Club link on the live Typeform.** Question 1 links to
  `thecopyclub.co.uk/the-start-up-marketing-accelerator/` — old brand, wrong site, on a published
  form with doors open. (The stale "25th March 2026" date on the same question *has* been fixed.)
- **Mailchimp segments still named "Accelerator 2026"** from the March cohort. Friday's email goes to
  a March-shaped list unless they're re-cut.
- **Speed-to-call Calendly flow** — sheet says "Not started"; Liv said sorted on 29 Jul. Needs
  reconciling. With one late talk, applications bulk-land 2-12 Sept and payment is due 25 Sept:
  ~3 weeks application-to-cash, straight into the accepted→paid leak (86% → 41% → 25%).
- **Put the Lottie event on LinkedIn** (LI Events listing).
- Ads: Adelle's plan live, Lottie's UGC filmed, before Fri 7 Aug.
- Backup interviewer still unnamed.

## Risks accepted, not solved

- Payment Zap has no pipeline filter after Find Associations — an applicant with two active TMA deals
  could get the wrong one moved.
- "Arranging interview" + "Interview scheduled" agreed to merge, not executed.
- Interview-booking auto-move workflow parked after it corrupted an unrelated 2024 deal twice.
- App passwords in the old handover doc still need rotating.
- The funnel tracker starts w/c 3 Aug, so it will never see w/c 27 Jul — which already holds 32
  pageviews and the four real applications above.

## Status

| Track | Step | State |
|---|---|---|
| — | Dates anchored | ✓ 30 Jul |
| — | Calendar built | ✓ 29 Jul |
| — | Benchmarks re-anchored | ✓ 30 Jul |
| A | A1 Friday's launch email | ✓ 30 Jul — built in Mailchimp `356acdbab4` (web_id 14208326), Liv to set audience + send time and schedule. See build notes below. |
| A | A2 Emails 2-10 | not started |
| A | A3 LinkedIn posts | not started |
| A | A4 Case studies + podcast graphics | not started (A4 case studies = Liv/grads) |
| B | B1 Screen the 4 in now | not started |
| B | B2 Screening scheduled | blocked on Slack test |
| B | B3 Partials daily | ready to build |
| C | C1 The skill | after A2 |
| C | C2 Sunday task | after C1 |
| C | C3 First run + correct | after C2 |
