# M3 — Google Sheet build

**Status:** M3 built, 2026-07-19. Weekly-tracker tab built cleanly and verified. Applicant-detail
tab blocked by tooling (see below) — headers specified for a 1-minute manual add.
**Source PRD:** `launch-funnel-dashboard-prd.md` (this folder)
**Depends on:** `m1-access-foundations.md`, `m2-launch-setup-and-curve.md` (all numbers trace to M2)
**Scope:** M3 only — create the source-of-truth Sheet with structure + TMA Sept 2026 targets
pre-loaded. **No M4 (scheduled refresh), M5 (dashboard) or M6 built.** All ACTUAL columns left
empty on purpose — live population is M4's job.

---

## The Sheet

- **Title:** TMA Launch Funnel Tracker
- **File ID:** `1YAbXlqY6nLFV15XBhQIx20LM0CUspe6GuQJPAvVUWNE`
- **Link:** https://docs.google.com/spreadsheets/d/1YAbXlqY6nLFV15XBhQIx20LM0CUspe6GuQJPAvVUWNE/edit
- **Owner:** olivia@up-world.co
- **Location:** created in Liv's default Drive location (parent id `0AJ6JmtH-oTLJUk9PVA`). No folder
  was chosen — it landed top-level.
- **How built:** Google Drive MCP `create_file`, seeding a native Google Sheet from a CSV.

### Sharing — flag for Liv
I set **no** permissions. But the file **auto-inherited a domain-wide "Core Team" reader
permission** from the Workspace's default-sharing rule, so right now it is readable by the whole
`up-world.co` team, not strictly owner-only. Owner is still Liv. I did **not** touch sharing (both
because the task said not to set permissions, and because changing sharing is not something to do
unprompted). **If you want it truly private, remove the "Core Team" reader in the Share dialog.**
For this dashboard's audience (Liv, Nzola, Jonny, Lottie — all already have reporting access per the
PRD) team-read is probably fine, but calling it out so it's your call, not an accident.

---

## Tab 1 — "Weekly Tracker" (built + verified)

> Note: the tab is currently named **"Untitled"** (the CSV-to-Sheet conversion names the first tab
> that). Renaming it needs either a manual rename or a write tool that can edit this file — see the
> tooling note below. Cosmetic only; the content is correct.

One row per launch per week. 19 columns. Layout top-to-bottom:

1. **Row 1 — CAVEAT banner** (the 25-vs-historical stretch note, verbatim from M2's load-bearing
   caveat). Surfaced in the sheet as instructed so "behind target" reads as expected, not alarming.
2. **Row 2 — LEGEND** (blank = no data, never zero; booked call = live-only no target; weekly targets
   are Paid-only; top-of-funnel targets are window totals; only HubSpot "Paid" counts, "Said they'll
   pay" does not).
3. **Row 4 — column headers.**
4. **Rows 5–14 — the 10 weeks** of TMA Sept 2026 (w/c 20 Jul → w/c 22 Sep kickoff).
5. **Row 15 — WINDOW TOTAL (target)** row with the backwards-from-goal funnel totals.
6. **Rows 17+ — footer reference blocks:** Launch Config (the M2 §1 entity for TMA Sept 2026) and
   the Clean-7 → HubSpot stage map (M2 §1a), plus a multi-launch note.

### Columns
`launch_id | Launch | Week (w/c) | Phase |` then, per funnel stage, an ACTUAL + a TARGET column:
`Website views | Typeform views | Form starts | Applicants |` then `Booked calls ACTUAL (live only -
no target)` (ACTUAL only, deliberately no target), then `Accepted |` and `Paid`, then
`Paid TARGET (weekly) | Paid cumulative TARGET | Paid cumulative % of goal`.

### What's pre-loaded (every number traces to M2 — nothing invented)
- **Weekly Paid targets** (M2 §3b pacing curve): `0,0,0,0,3,2,5,5,5,5` across the 10 weeks;
  cumulative `0,0,0,0,3,5,10,15,20,25`; cum %: `0,0,0,0,10%,20%,40%,60%,80%,100%`.
- **Window-total targets** (M2 §3a backwards-from-25-paid): Website views 1318, Typeform views 290,
  Form starts 125, Applicants 40, Accepted 29, Paid 25. Booked calls = **no target** (M2 §1a: no
  historical benchmark). These sit in the WINDOW TOTAL row only.
- **Weekly top-of-funnel / Accepted targets are intentionally left blank.** M2 only modelled *paid*
  week-by-week; top-of-funnel is a window total on a front-loaded shape, not a per-week split. I did
  **not** fabricate weekly splits M2 didn't provide.
- **All ACTUAL cells blank** = no data yet (form is brand new, window opens w/c 20 Jul 2026). Blank,
  never zero — per the PRD rule.
- Launch config + stage map embedded as footer reference.

**Filtering by launch:** every row carries `launch_id` + `Launch`, so a Sheet filter view isolates a
single launch when several run at once. Only TMA Sept 2026 exists today.

---

## Tab 2 — "Applicant Detail" (NOT built — tooling blocked; manual add needed)

**Intended structure (empty for now — TMA Sept 2026 form has no applicants yet):** one row per
applicant, columns:
`launch_id | Launch | Name | Email | Current stage (clean-7) | Current HubSpot stage | Date entered
current stage | Days in current stage`

**Why it isn't there yet:** see tooling note. **To add it by hand (about 1 minute):** open the sheet
→ "+" to add a tab → name it `Applicant Detail` → paste the 8 headers above into row 1. Leave rows
empty; M4 fills them.

---

## What the tooling could and couldn't do (honest)

**Could:**
- Create a real native Google Sheet in Liv's Drive, owned by her, via the Drive MCP `create_file`.
- Seed one tab cleanly and richly from CSV — full 19-column grid, caveat/legend banners, all M2
  targets, config and stage-map reference. Verified by reading it back; landed exactly as intended.

**Couldn't (and why):**
- **Add a second tab / rename the first tab / apply formatting.** The Drive MCP `create_file` seeds
  exactly one tab and has no edit-structure ability. The obvious richer path — Zapier's Google Sheets
  actions (already enabled, no new integration needed) — can **read** this file but **cannot write**
  to it: `create_worksheet` returned *"The caller does not have permission."* This is Google's
  `drive.file` OAuth scope: Zapier's Sheets connection can only modify files **it** created, not a
  file the Drive MCP created. Confirmed live: Zapier read succeeded, Zapier write was permission-denied.
- Rather than rebuild the whole workbook through Zapier (which would have meant abandoning the clean
  CSV seed for fragile row-by-row `add_row` writes with dynamic column mapping), I kept the clean
  single-tab build and flagged the gap — an honest partial beats a fragile full one.

**Two clean routes to finish the structure (Liv's / a future session's choice):**
1. **Manual (fastest):** add the "Applicant Detail" tab by hand (headers above); optionally rename
   "Untitled" → "Weekly Tracker". Two minutes total.
2. **Rebuild via Zapier** if full tooling-driven multi-tab is wanted: create the spreadsheet *through*
   Zapier so Zapier owns write access, then add tabs/rows via Zapier. More work, loses the clean seed.

**Implication for M4 (heads-up, not built here):** whatever M4 uses to auto-write actuals needs
**write** access to this file. The Zapier Sheets connection does **not** have it (read-only on this
file). The natural fix mirrors the GA4 setup in M1: grant a service account (Google Sheets API,
Editor role on this one file) and have M4's scheduled script write via that — same pattern as the GA4
service account already in place. Decide the M4 write path before building M4.

---

## Open items still owed to Liv (carried from M2 §5, unchanged)
1. **Kickoff 22 vs 29 Sept.** Weekly buckets currently assume 22 Sept. If it slips a week, shift the
   10 week labels + curve by one week (the config cell flags this; dates are editable).
2. **Paid pacing shape** — the back-loaded Sept 2024 curve is used as default (M2's recommendation).
   Early paid should read as "ahead of pace", not error.
3. **Booked call** shown as a live-count column with no target — confirm that's the intended treatment
   (it is built that way).
