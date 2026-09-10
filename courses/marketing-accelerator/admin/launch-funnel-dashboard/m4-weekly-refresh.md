# M4 — Weekly scheduled refresh

**Status, updated 2026-07-19:** Pull logic built and live-tested (works today). Write mechanism
built and tested — **unblocked**: Liv enabled the Sheets API and shared the Sheet with the
service account as Editor, then a real write was verified live (row 5, w/c 20 Jul 2026, written
with genuine GA4 + Typeform pulls — all real zeros, no traffic yet). Scheduled task **designed,
not activated** — still awaiting confirmation on day/time before it runs recurring.

**Source PRD:** `launch-funnel-dashboard-prd.md` (this folder)
**Depends on:** `m1-access-foundations.md` (credentials), `m2-launch-setup-and-curve.md` (targets/curve),
`m3-sheet-build.md` (the Sheet itself — file id `1YAbXlqY6nLFV15XBhQIx20LM0CUspe6GuQJPAvVUWNE`)
**Scope:** M4 only. No dashboard (M5), no verification pass (M6). Read-only against GA4/Typeform/
HubSpot; the only write target is the M3 Sheet, and only once access is confirmed working.

Scripts referenced below live in `up-world/courses/_shared/reporting/m4-scripts/`
(`ga4-pull.js`, `typeform-pull.js`, `sheets-write.js`, `package.json` — needs `npm install` once,
installs `google-auth-library`).

---

## 1. Pull logic — all three sources live-tested today, real results

### GA4 (website views)

`m4-scripts/ga4-pull.js` — authenticates as `courses-dashboard@up-world-reporting.iam.gserviceaccount.com`
(same key as M1, `~/.ga4_key.json`) via `google-auth-library`'s `JWT` client, calls
`analyticsdata.googleapis.com/v1beta/properties/342528552:runReport` filtered to `pagePath` exact-match
`/the-marketing-accelerator`.

**Live test results, 2026-07-19:**
- Last 7 days (2026-07-13 → 2026-07-19): **22 real pageviews** on the TMA page.
- The tracker's actual Week 1 (2026-07-20 → 2026-07-26 — a week that hasn't started yet, since
  today is 2026-07-19): **0 views**, real and correct (window opens tomorrow).

### ⚠ BUG FOUND AND FIXED, 2026-07-30 — the Typeform pull was reporting zero applications

`typeform-pull.js` read response counts from `insights/{form}/summary`, which returned
`responses_count: 0` on 30 Jul while the form genuinely held **6 completed submissions** (4 real
applicants — Enya Buchenau, Rana Youness, Elif Gokcen, Kanchan Supekar, all 27-29 Jul — plus 2 of
Liv's tests). Everything downstream (this Sheet, the M5 dashboard, any weekly report) would have
shown zero applications while real people were applying.

**Fixed:** response counts now come from `/forms/{form}/responses`, the source of truth.
`insights/summary` is still used, but only for visit counts, which `/responses` doesn't provide.
The script now also separates real applicants from test submissions, and accepts an optional
`YYYY-MM-DD YYYY-MM-DD` range (responses *are* date-filterable, unlike visits).

**Also corrected:** the M4 doc below states HubSpot has no portable API key and must run in-session
via MCP. **There is one now** (`~/.hubspot_key`, pat-eu1) — so §4's constraint no longer holds and a
standalone script could reach all three sources.

**Also found — partials ARE readable, and ARE chaseable.** `?completed=false` returns them, so the
build log's "no native tool can see an unfinished response" is about native *integrations*, not the
API. A partials-chasing job is viable.

Two kinds, and the difference matters:
- **Landing-screen bouncers** — `response_type: "started"`, **no `answers` array at all**. They
  arrived and never answered question 1. No contact details because they gave none: unreachable by
  any tool, a real-world limit rather than a tooling gap. All 3 partials on 30 Jul are these (one is
  a Claude-browser test from 22 Jul).
- **Genuine part-fills** — question 1 of this form captures email, so anyone who enters it and then
  abandons later comes back from the API **with the email attached**, and can be chased. None exist
  yet only because total traffic is 12 visits on day one. These are what March's "167 partial leads"
  were.

⚠ An earlier version of this note claimed partials are "countable, not contactable" and that March's
167 must have come from HubSpot's "Partial Applied" stage. That was wrong — inferred from a sample of
3 landing-screen bounces. Corrected against the raw payload.

### Typeform (views / starts / completions)

`m4-scripts/typeform-pull.js` — bearer-token GET against `api.typeform.com/insights/Ve2btZwn/summary`.
**Important structural note not in M1/M2:** this endpoint returns *cumulative totals since form
creation*, not a per-week slice — there's no date-range parameter. So a weekly "Typeform views"
figure has to be a **delta**: this week's cumulative minus last week's stored cumulative. For week 1
(form created 2026-07-19, this session), cumulative-to-date *is* week 1's figure. From week 2
onward the write script needs last week's cumulative to subtract — see §2's design note.

**Live test result, 2026-07-19:** `responses_count: 0`, `total_visits: 0`, `unique_visits: 0`,
`completion_rate: 0` across all four device platforms. **Real, legitimate zero** — the form has
had no traffic yet (matches M1/M2's expectation, not a pull failure).

**Observation, not a blocker:** the form's first question text still reads *"Starting Wed 25th
March 2026"* — leftover copy from whichever form this was duplicated from. Doesn't affect the
counts this pulls, but worth Liv fixing before real traffic hits it.

### HubSpot (deal counts per stage, this week, TMA pipeline)

No standalone script — HubSpot is only reachable in this workspace via the connected MCP tool
(`query_crm_data`), which only exists inside a Claude Code session, not as a portable API key like
GA4/Typeform. This has a real consequence for how M4 must be scheduled — see §4.

**Critical design point confirmed live:** pipeline `888214769` is one continuously-reused pipeline
— the *previous* cohort's 200+ deals are still sitting in it. A pull that just filters by
`pipeline = '888214769'` would count old-cohort history as if it were this week's TMA Sept 2026
activity. **The weekly pull must filter by `hs_v2_date_entered_current_stage BETWEEN <week-start>
AND <week-end>`**, not by pipeline alone, to isolate genuinely-this-week movement.

**Live test results, 2026-07-19:**
- Filtered to last 7 days (2026-07-13 → 2026-07-19): **1 real deal** entered "Partial Applied" —
  Emma Champion (`emma@emmachampion.com`), entered 2026-07-15. Real, joined via Deal→Contact
  (confirmed live: `SELECT dealname, dealstage, CONTACT.email, CONTACT.firstname, CONTACT.lastname
  FROM DEAL WHERE pipeline = '888214769' AND hs_v2_date_entered_current_stage BETWEEN ...`).
- Filtered to the tracker's actual Week 1 (2026-07-20 → 2026-07-26, hasn't started): **0 results**,
  legitimate — matches expectation that the window hasn't opened yet.
- Full unfiltered pipeline breakdown (all-time, for sense-check against M1): Partial Applied 97,
  Applied 3, More info needed 21, WA chaser 2, WA+LI chaser 2, Unresponsive 15, Acceptance sent 6,
  Said they'll pay 1, Paid 23, Not right 32, Declined too junior 3, Decided to pull out 17,
  Interested in next cohort 2 — **identical to M1's numbers**, confirms the pull is stable and
  correct, and confirms the date-filter is doing real, necessary work (without it, "this week"
  would silently include all 97+ historic Partial Applied deals).

**Observation, not a blocker:** Emma Champion's deal entered "Partial Applied" on 2026-07-15 —
*before* the tracker's own selling-window start of 2026-07-20. Either she's a genuine early
applicant ahead of the official launch, or a test/leftover deal. Worth a quick sense-check by Liv;
doesn't block the mechanism.

---

## 2. Write mechanism — mapped, coded, and live-tested against the real Sheet

`m4-scripts/sheets-write.js` authenticates as the **same GA4 service account**
(`courses-dashboard@up-world-reporting.iam.gserviceaccount.com`) with the `spreadsheets` scope, and
calls the Sheets API v4 `values:batchUpdate` endpoint against file
`1YAbXlqY6nLFV15XBhQIx20LM0CUspe6GuQJPAvVUWNE`.

**Real column map** (read live off the Sheet via Drive's `read_file_content`, not assumed — an
earlier draft guessed a contiguous range and was wrong):

| Col | Field | Col | Field |
|---|---|---|---|
| A | launch_id | J | Form starts TARGET |
| B | Launch | K | **Applicants ACTUAL** |
| C | Week (w/c) — text, e.g. "w/c 20 Jul 2026" | L | Applicants TARGET |
| D | Phase | M | **Booked calls ACTUAL** (no target col) |
| E | **Website views ACTUAL** | N | **Accepted ACTUAL** |
| F | Website views TARGET | O | Accepted TARGET |
| G | **Typeform views ACTUAL** | P | **Paid ACTUAL** |
| H | Typeform views TARGET | Q | Paid TARGET (weekly) |
| I | **Form starts ACTUAL** | R/S | Paid cumulative TARGET / % |

Bold = the only cells M4 ever writes. Rows 5–14 = the 10 tracker weeks. The script matches a
target week by **reading column C's text** (not an ISO date — the Sheet stores "w/c 20 Jul 2026"
literally) and only writes the ACTUAL cells it has real numbers for, via individual per-cell
ranges in one `batchUpdate` call — never touching TARGET columns, never blanking a cell that a
different pull already filled this week, never writing a value it didn't actually query.

**For the Typeform cumulative-vs-weekly issue (§1):** the script as written takes a plain number
per metric — the calling logic (the scheduled task's prompt, see §4) is responsible for computing
the delta (this week's cumulative − last week's stored cumulative in column G of the previous row)
before calling `writeWeekRow`. This is a one-line subtraction, not built as a separate script
function, since it needs last week's already-written Sheet value as an input.

### Live test, 2026-07-19 — exact failure, not a repeat of M3's blocker

Ran `node sheets-write.js read` (attempting the least risky call — just reading the Sheet as this
service account, to check access before ever attempting a write):

```
403 PERMISSION_DENIED — accessNotConfigured / SERVICE_DISABLED
"Google Sheets API has not been used in project 866392885332 before or it is disabled.
Enable it by visiting
https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=866392885332
then retry."
```

This is a **different, earlier blocker than M3 hit** with Zapier (M3's was a sharing/scope
problem on a file Zapier didn't own). This one fires before permissions are even checked — the
Sheets API itself is switched off in the `up-world-reporting` Cloud project. GA4's Analytics Data
API was enabled there in M1; Sheets API is a separate API that also needs enabling.

Separately (confirmed via Drive's `get_file_permissions`, live, 2026-07-19): the service account
is **not** currently shared on the Sheet at all — only `Core Team` (domain reader) and
`olivia@up-world.co` (owner) appear in the permission list. So there are genuinely two blockers
stacked, and the API one will surface first if tested again before both are fixed.

### Exact, minimal steps for Liv to unblock (both required)

1. **Enable the Sheets API** in the `up-world-reporting` Cloud project — visit
   `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=866392885332`
   and click Enable. (Mirrors enabling the Analytics Data API for GA4 in M1 — same project,
   different API.) I have no tool that can do this myself; it's a Cloud Console action.
2. **Share the Sheet with the service account as Editor** — open the Sheet
   (https://docs.google.com/spreadsheets/d/1YAbXlqY6nLFV15XBhQIx20LM0CUspe6GuQJPAvVUWNE/edit) →
   Share button → paste `courses-dashboard@up-world-reporting.iam.gserviceaccount.com` → role
   **Editor** → Send/Save. (This is a normal Sheets share, not a Cloud Console action — Liv can
   do this directly from the Sheets UI.)

Once both are done, re-run `node m4-scripts/sheets-write.js read` — if it returns real Sheet
content instead of an error, the write path is live and `write` mode (wired with real pulled
numbers) can run for real.

**I did not fabricate a working write** — the script is real and correct, but genuinely cannot
write today. This is reported as blocked, not silently worked around.

---

## 3. Applicant-detail refresh (for when Liv adds the tab)

Per the task brief, the "Applicant Detail" tab is still Liv's manual add (M3 flagged it, not yet
confirmed done) — not built around its absence, but the refresh logic is ready for it:

- Pull: `SELECT dealname, dealstage, hs_v2_date_entered_current_stage, CONTACT.email,
  CONTACT.firstname, CONTACT.lastname FROM DEAL WHERE pipeline = '888214769' AND dealstage NOT IN
  (<exit-stage ids>)` — i.e. every currently-open TMA deal, not date-filtered (this tab tracks
  *current* stage/days-in-stage for open applicants, not weekly deltas).
- Days-in-stage = today minus `hs_v2_date_entered_current_stage` (live-confirmed this field
  exists and returns real dates, e.g. Emma Champion's 2026-07-15).
- Write: same service-account mechanism as §2, once unblocked — one row per applicant, overwriting
  the whole tab's data rows each run (simpler and safer than diffing row-by-row for a tab this
  size), never touching the header row.
- Live-tested today: the Deal→Contact join for name/email works exactly as M1 documented (see
  Emma Champion's real row in §1).

---

## 4. Proposed weekly schedule — designed, NOT activated, awaiting confirmation

**Why this can't be a plain cron'd script:** HubSpot access in this workspace exists only as an
MCP connector inside a Claude Code session — there is no portable HubSpot API key the way there is
for GA4/Typeform. So the "weekly pull" has to run as a **Claude Code scheduled task** (a prompt
that gets a fresh session each week with tool access), not a bare `node` cron job on its own —
GA4 and Typeform could run standalone, but HubSpot can't, and the write needs all three merged
before it touches the Sheet.

**Proposed configuration (not created — this is the exact config to confirm):**

- **Mechanism:** `mcp__scheduled-tasks__create_scheduled_task`
- **Schedule:** weekly, **Sunday 18:00 UK time** — ahead of Monday morning SLT reporting, late
  enough to catch the full week (Mon–Sun) but with a buffer before Monday in case a run needs a
  retry. Cron: `0 18 * * 0` (evaluated in local time per the tool's own docs).
- **Task prompt would instruct the fresh session to:**
  1. Compute the current tracker week (Monday-to-Sunday just closed) and its "w/c D MMM YYYY"
     label.
  2. Run `node ga4-pull.js <weekStart> <weekEnd>` and `node typeform-pull.js`, both in
     `up-world/courses/_shared/reporting/m4-scripts/`.
  3. Compute the Typeform weekly delta (this week's cumulative minus last week's stored value,
     read from the Sheet).
  4. Run the HubSpot query above (date-filtered to the closed week) via the HubSpot MCP tool.
  5. Call `sheets-write.js write` with the real pulled numbers for that week's row (and, once the
     Applicant Detail tab exists, refresh it too).
  6. Report back a short summary (what was written, any zeros, any pull failures) — never write
     a number it couldn't actually confirm.
- **Guardrail already built into `sheets-write.js`:** it only writes ACTUAL cells it's given real
  values for, never overwrites TARGET columns, and errors loudly (rather than writing a guess) if
  a week-label match fails — e.g. if the kickoff date slips from 22 to 29 Sept and the row labels
  shift, per M2/M3's still-open item.

**This has not been created.** No recurring task exists yet. Confirm the day/time above (or
propose a different one) before I create it — this is a standing automation, not a one-off.

---

## Summary of what's real vs blocked, 2026-07-19

| Piece | Status |
|---|---|
| GA4 pull | **Works today.** Live-tested, real numbers (22 views/7d, 0 for the unopened tracker week). |
| Typeform pull | **Works today.** Live-tested, real zero (form has no traffic yet). Needs delta logic for weeks 2+ (documented, not yet needed). |
| HubSpot pull | **Works today**, via the MCP connector in-session. Live-tested, real data (1 deal this week, full stage breakdown matches M1). Must date-filter, not just pipeline-filter, to avoid counting the old cohort. |
| Sheets write | **Built, mapped, tested — blocked.** Real 403: Sheets API disabled in `up-world-reporting`. Also missing: service account not shared as Editor on the Sheet. Both are quick Liv-side fixes (§2). |
| Weekly schedule | **Designed, not activated.** Sunday 18:00 UK proposed via `scheduled-tasks`. Awaiting Liv's confirmation before creation. |

## Handoff — what Liv needs to do before M4 can actually run live

1. Enable the Sheets API: `console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=866392885332` → Enable.
2. Share the Sheet with `courses-dashboard@up-world-reporting.iam.gserviceaccount.com` as **Editor** (Share button on the Sheet itself).
3. Confirm (or tell me to change) the proposed schedule: **Sunday 18:00 UK time, weekly**.
4. (Carried from M3, still open) Add the "Applicant Detail" tab by hand, or confirm it's still pending.
