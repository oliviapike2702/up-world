# M5 — Dashboard view

**Status:** M5 built, 2026-07-19. A working, on-brand dashboard exists and is viewable today.
It reads live Sheet data at *generation* time, not on every open — see "How live is this,
really" below before assuming it auto-updates.

**Source PRD:** `launch-funnel-dashboard-prd.md` (this folder)
**Depends on:** `m1-access-foundations.md` (credentials), `m2-launch-setup-and-curve.md`
(targets/curve), `m3-sheet-build.md` (the Sheet, file id
`1YAbXlqY6nLFV15XBhQIx20LM0CUspe6GuQJPAvVUWNE`), `m4-weekly-refresh.md` (the write mechanism —
paused, not activated; row 5 has real live-pulled zeros as of 2026-07-19)
**Scope:** M5 only. No M6 (verification) built. Read-only — nothing written to the Sheet or any
source system.

---

## What was actually decided, and why (option (a) vs (b))

The PRD asked for "a lightweight dashboard reading from that sheet" and offered three shapes to
weigh honestly rather than defaulting to the most impressive-sounding one.

**Option (a) — Google Apps Script bound to the Sheet** (the precedent pattern from the Up Club
HubSpot dashboard PRD, `up-world/up-club/reporting/up-club-hubspot-source-of-truth-prd.md`,
line 44/159: "Google Sheets as data store; Apps Script renders an internal dashboard from the
sheet data") is genuinely the best long-term shape — always live, no regeneration step, a real
menu/sidebar Liv and the team open inside the Sheet itself. **It was investigated and is
blocked in this environment, not silently avoided:**

- Deploying or editing an Apps Script project needs the **Apps Script API** (`script.projects`,
  `script.projects.create`, etc.). This session's toolset was checked (a live `ToolSearch`
  across every connected MCP tool) and **no Apps Script API access exists anywhere in this
  workspace** — not as a direct API key (like GA4/Typeform), not as an MCP connector, not via
  Zapier's available app list. This is the same shape of gap M1 hit for GA4/Typeform before
  Liv provisioned a service account: it needs a human in Google Cloud Console, because Claude
  Code has no tool here that can create or push code into an Apps Script project.
- **Exact unblock steps, if this is wanted later** (mirrors the GA4/Sheets service-account
  pattern already proven twice in M1/M4):
  1. In Google Cloud Console (the same `up-world-reporting` project used for GA4/Sheets),
     enable the **Apps Script API**.
  2. Either build the Apps Script project by hand in the Sheet's Extensions → Apps Script
     editor (a person can always do this — it's a normal Sheets feature, no API needed for a
     human to use it directly), or grant a future Claude session the Apps Script API scope so
     it can push code via `script.projects.updateContent` / `script.projects.deployments.create`.
  3. Either path can then reuse the HTML/logic already built for option (b) below — the
     rendering logic doesn't need to be rewritten, just moved from "generate a static HTML
     file" to "render inside `doGet()`".
  - **Fastest real path today, if Liv wants true one-click-inside-the-Sheet access soon:** open
    the Sheet → Extensions → Apps Script → paste a `doGet()` that reads the same ranges this
    build's script reads and renders similar HTML, then Deploy → Web app. That's a ~15-30 min
    manual build for a person with Sheets access; it's not blocked for a human, only for this
    session's tooling.

**Option (b) — a generated HTML file, built and published now.** This is what got built. It is
real, it works today, every number in it traces to a live Sheet read, and it required no new
credentials or permissions beyond what M1/M4 already set up (reuses the same
`~/.ga4_key.json` service-account JWT auth as `m4-scripts/sheets-write.js`, read-only scope).

---

## What was built

**`m5-scripts/generate-dashboard.js`** — a Node script that:
1. Authenticates as `courses-dashboard@up-world-reporting.iam.gserviceaccount.com` (same key,
   same pattern as M4's `sheets-write.js`) with the **read-only-in-effect** `spreadsheets`
   scope (it only ever calls `GET`, never writes).
2. Reads live: Tab 1 ("Untitled", the weekly tracker) rows 1-15 in full, and Tab 2
   ("Application detail") rows 1-50.
3. Computes, from that live read only: per-stage actual totals (summed across whatever weeks
   have real data — currently only row 5, all genuine zeros), the WINDOW TOTAL targets (row
   15), stage-to-stage conversion rates (only where both sides have real non-zero data — never
   a fabricated 0%), and a RAG state per stage.
4. Renders one self-contained HTML file, `m5-dashboard.html`, in Up World brand: Figtree
   (inlined from the brand pack's `figtree-embed.css`), pink `#E8536E` / navy `#16173D` / white,
   the navy-on-white roundel logo, sentence case, UK English, no em dashes, light/dark theme
   support.
5. Writes nothing back anywhere — it only reads the Sheet and writes the local HTML file.

**Where Liv can see it right now:** published as a Claude Artifact —
**https://claude.ai/code/artifact/411461c6-6c63-47ef-b9de-ce3eca4db4ea** — viewable by anyone
Liv shares it with via the artifact's share menu (private by default, per how Artifacts work).
The same file also sits at
`up-world/courses/_shared/reporting/m5-dashboard.html` if anyone wants to open it locally or
re-host it another way.

---

## How live is this, really — the honest answer

**Not auto-refreshing on open.** The HTML file is a snapshot of the Sheet's values at the
moment `generate-dashboard.js` last ran (2026-07-19, this session). Opening the Artifact or the
local file again tomorrow will show the same numbers as today, even if the Sheet has changed,
until someone re-runs the script and re-publishes.

**To refresh it:**
```
cd up-world/courses/_shared/reporting/m5-scripts
NODE_PATH=../m4-scripts/node_modules node generate-dashboard.js
```
then re-publish `m5-dashboard.html` as the Artifact (same URL, since it's the same file path).

**Why this is the honest tradeoff, not a shortcut:** genuinely live-on-open needs either (a)
Apps Script (blocked today, see above) or a hosted server continuously polling the Sheets API
(no persistent server infrastructure exists in this environment — there is nowhere to run one).
A regenerate-on-request static file is what's actually buildable with the tools available today.
It is not wired to M4's schedule (which is itself still paused, per Liv's explicit choice) — if
M4 is ever turned on and run weekly, re-running `generate-dashboard.js` right after each M4 run
(or as an extra step appended to M4's own scheduled task prompt) would keep this dashboard
genuinely one week fresh, at most. That wiring hasn't been built — flagging it as the natural
next step, not doing it unasked.

---

## What the dashboard actually shows today (2026-07-19), and why it's mostly empty by design

Every number below was read live from the Sheet during this build, not invented:

- **Header:** "TMA Sept 2026 — launch funnel", "The Marketing Accelerator", goal chip "25 paid
  spaces".
- **Caveat banner** (row 1 of the Sheet, shown verbatim, prominent, not buried): the
  25-vs-historical-stretch note.
- **Legend banner** (row 2, shown verbatim): blank ≠ zero, booked calls has no target, weekly
  targets are Paid-only, etc.
- **Funnel, all 7 stages** (website views, Typeform views, form starts, applicants, booked
  calls, accepted, paid): every stage's **actual = 0** and every stage shows a neutral **"not
  started yet"** badge (grey, not red) rather than a RAG failure state — because the real Sheet
  data is genuinely all zero (the selling window opens tomorrow, 20 Jul 2026; the Typeform form
  has had zero responses; HubSpot has had no new movement in-window yet). "Booked calls" shows
  "no target set" specifically, per M2 §1a (it has no historical benchmark). Targets shown
  (window totals): website 1,318 / Typeform views 290 / form starts 125 / applicants 40 /
  accepted 29 / paid 25 — all read from row 15.
- **Conversion badges:** every stage shows "conversion not yet measurable" rather than a
  fabricated 0% — there is no real numerator/denominator pair with data yet.
- **Paid pacing strip:** the 10 weekly cumulative-%-of-goal figures read straight from column S
  (0%, 0%, 0%, 0%, 10%, 20%, 40%, 60%, 80%, 100%) — no paid actual exists yet to plot against it.
- **Applicant detail:** genuine empty state, "No applicants yet" — read live from the
  "Application detail" tab, which has headers only, zero data rows (confirmed live: Liv added
  the tab by hand as flagged in M3, but the TMA Sept 2026 Typeform form has had no real
  responses yet).

**This is the correct, expected result for today's date, not a bug or a thin build.** Once the
window opens and M4 (still paused) starts populating actuals, re-running the generator will show
real bars, real conversions, and real RAG colours in place of today's "not started" state.

---

## Honest gaps / what wasn't attempted here

- **RAG thresholds (green ≥90% of target, amber ≥60%, red <60%) are a reasonable default I
  chose, not something specified in the PRD/M2/M3.** Worth a quick sign-off from Liv once real
  data exists to see if those cutoffs feel right, or too generous/harsh given the 25-vs-20
  stretch context.
- **Multiple concurrent launches** (PRD's reusability requirement) — this build only handles
  the one Sheet/one launch that exists today (TMA Sept 2026). The script hardcodes the one
  sheet ID and the one tab name; if/when a second launch's Sheet exists, the script would need
  a small generalisation (loop over launch configs) rather than being launch-agnostic today.
  Flagging, not building ahead of actual need.
- **No auto-scheduling of the regeneration step** — see "how live is this" above.
