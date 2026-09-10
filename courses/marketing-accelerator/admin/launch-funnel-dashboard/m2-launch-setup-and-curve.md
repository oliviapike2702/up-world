# M2 — Launch setup & weekly curve

**Status:** M2 complete (revised 2026-07-19 with the Sept 2024 Campaign-Plan funnel model)
**Source PRD:** `launch-funnel-dashboard-prd.md` (this folder)
**Depends on:** `m1-access-foundations.md` (all access live-tested there)
**Scope:** M2 only — (1) the Launch entity, (2) real multi-cohort funnel history, (3) the derived target/benchmark model + pacing curve, (4) override + concurrency design, (5) decisions. No Sheet, dashboard or refresh built here (M3+). Read-only throughout.

> **Read this first — the load-bearing caveat.** TMA's paid total has been **18, 19, 18, 20** across the last four half-years, and **21** in the most recent (HubSpot) cohort. **Best-ever is 21.** The TMA Sept 2026 goal of **25 is ~19% above best-ever and ~25% above the typical ~20.** At the established conversion rates it needs **~27% more top-of-funnel traffic than the best cohort ever pulled** (≈1,318 unique views vs a historical peak of 1,039). So a dashboard that benchmarks weekly progress against 25 will read **"behind" for most of the window** even if the launch is pacing normally. This is a known, deliberate stretch — not a system error. State it on the dashboard.

**Data actually pulled for this file (nothing inferred except where flagged):**
- **HubSpot** (live MCP query, pipeline `888214769`): all 23 "Paid" deals with `hs_v2_date_entered_current_stage` (date entered Paid), `createdate`, `amount`; full stage-count breakdown.
- **Sept 2024 Campaign Plan** Google Sheet `1XYeMk_GpCTFBwoN5NfDug-J1VdFiRfGjMqGX6-mkLnc` — read in full. This is Liv's real funnel model: a four-half-year benchmark table with step-conversion rates, an 8–9-week weekly grid with TARGET + ACTUAL per funnel step, and a weekly PAID target breakdown. **This is now the primary source for the benchmark and window.**
- **March 2025 Sheet** `1Atb-SUUAYohN6waPBho0V8iFfQk6nbbuBYn95eyKr1Y` — Typeform export tab (114 responses, 42 completed) for an applications-timing cross-check.
- Sept 2024 snapshot `1Dt5jF7…` (used in the first M2 draft) is **superseded** by the campaign-plan sheet above and no longer relied on.

---

## 1. The Launch entity

A "Launch" is one cohort of one course, sold over one selling window against one paid-spaces goal. Every funnel count, target and curve hangs off a Launch.

| Field | Type | Notes |
|---|---|---|
| `launch_id` | slug | Stable key tagging every weekly row + applicant. e.g. `tma-sep-2026` |
| `launch_name` | text | e.g. "TMA Sept 2026" |
| `course` | text | Course family, e.g. "The Marketing Accelerator" |
| `kickoff_date` | date | **Editable.** Week 0 of the pacing curve; everything aligns to it |
| `selling_window_start` | date | First tracked week (see reset window below) |
| `doors_close_date` | date | Applications close, ~week before kickoff |
| `paid_goal` | integer | Paid-spaces target; drives the backwards-from-goal funnel targets |
| `typeform_form_id` | text | Typeform views/starts/completions source |
| `ga4_page_path` | text | GA4 pageviews (website-views stage) |
| `hubspot_pipeline_id` | text | HubSpot Deals (booked call → accepted → paid) |
| `stage_map` | per-launch table | This pipeline's real stage names → the funnel stages shown. **Per-launch** (M1 proved TMA vs BMBC differ entirely) |
| `funnel_benchmarks` | rate set | Step-conversion rates used to compute targets (default = the model in §3) |
| `curve_override` | optional | Replaces the default pacing curve for this launch (§4) |
| `status` | enum | `planned` / `active` / `closed` |

### First instance — TMA Sept 2026 (seeded, window reset to match proven shape)

| Field | Value |
|---|---|
| `launch_id` | `tma-sep-2026` |
| `launch_name` | TMA Sept 2026 |
| `course` | The Marketing Accelerator |
| `kickoff_date` | **2026-09-22** (may slip to 2026-09-29 — editable; curve re-buckets automatically) |
| `selling_window_start` | **2026-07-20** (w/c 20 Jul) — reset from the earlier 6-week assumption to a **~9-week window**, matching Sept 2024's proven w/c-22-Jul→mid-Sept shape |
| `doors_close_date` | ~2026-09-14 (w/c 14 Sep, week before kickoff) |
| `paid_goal` | **25** |
| `typeform_form_id` | `Ve2btZwn` |
| `ga4_page_path` | `/the-marketing-accelerator` |
| `hubspot_pipeline_id` | `888214769` |
| `stage_map` | §1a below |
| `funnel_benchmarks` | §3 default rates |
| `status` | `planned` |

### 1a. TMA stage map + how the clean-7 funnel maps to reality (decision confirmed)

Liv confirmed: **show the clean 7 funnel stages, mapped to the real HubSpot stages underneath.** Applicant-detail rows keep the granular stage so nothing is lost.

| Clean-7 funnel stage (dashboard) | Source | Real HubSpot stage(s) — id |
|---|---|---|
| 1. Website views | GA4 `/the-marketing-accelerator` | — (pageviews) |
| 2. Typeform views | Typeform `Ve2btZwn` insights | — (visits) |
| 3. Typeform starts | Typeform insights | — (starts) |
| 4. Typeform completion (application) | Typeform / HubSpot | Partial Applied `1253139662` + Applied `1251313895` |
| 5. Booked call | HubSpot | Arranging 'interview' `1338680530` / Interview scheduled `4650323174` |
| 6. Accepted | HubSpot | Acceptance sent `1251313896` |
| 7. **Paid** | HubSpot | **Paid `1251313898` only** |

Working/chase states (More info needed `4649437425`, WA/WA+LI chasers, Unresponsive) fold into stage 4–5 underneath. Exit states (Not right, Declined too junior, Decided to pull out, Interested in next cohort) drop out of the funnel. **"Said they'll pay" `4863563963` does NOT count as paid** (confirmed by Liv) — it's a near-committed leading indicator, shown separately if at all. Only the Paid stage / committed-with-invoice-or-payment-plan counts toward the 25.

> Note: "Booked call" (stage 5) has **no historical conversion benchmark** — the Sept 2024 funnel model never tracked it as a step (it goes applicant → successful/accepted directly). It can be tracked live from HubSpot going forward, but the target model in §3 has no rate for it. Flagged, not invented.

---

## 2. Real multi-cohort funnel history

### 2a. The established benchmark — four half-years (from the Campaign-Plan sheet)

This is Liv's real funnel model. Absolute counts per cohort and the step-conversion rates:

| Funnel step | H1 2023 | H2 2023 | H1 2024 | H2 2024 | Model rate used |
|---|---:|---:|---:|---:|---:|
| Unique (website) views | 935 | 998 | 1017 | 1039 | — |
| Typeform (form) views | 189 | 215 | 246 | 228 | **22%** of views |
| Form starts | 102 | 82 | 92 | 99 | **43%** of form views |
| Applicants (completed) | 34 | 29 | 26 | 32 | **32%** of starts |
| Successful (accepted) | 20 | 22 | 21 | 23 | **72%** of applicants |
| **Paid** | **18** | **19** | **18** | **20** | **87%** of accepted |

Validity check: running the model rates forward from H2 2024's 1,039 unique views reproduces 229 / 98 / 31 / 23 / **19.7** — i.e. it recreates that cohort's real 228 / 99 / 32 / 23 / 20 almost exactly. The rates are internally consistent and safe to use.

**Every cohort landed 18–20 paid.** That is the historical reality the goal of 25 sits above.

### 2b. Recent cohort (HubSpot 888214769) — true paid timing, most recent

The only source with the exact date each person committed (entered Paid). 23 in Paid; **21 paying** (2 are £0 comps — Tom Kirby 25 Mar, Will Tinson 26 Mar — excluded). Paid commitments ran **7 Jan → 25 Mar 2026** with a late surge (5 of 21 in the final week). This is the most recent real *paid* behaviour and confirms paid commitments **cluster late** in the window. Its calendar window was longer (~12 weeks, doors opened December) than the standard 9-week shape, so it's used for timing signal, not window length.

### 2c. Sept 2024 launch — real weekly actuals (from the Campaign-Plan grid)

Far cleaner than the snapshot export used in the first draft. Weekly ACTUALS logged in the sheet (doors opened early Aug, doors closed **13 Sept 2024**, kickoff ~late Sept / w/c 23 Sept — the grid ends w/c 16 Sept; exact kickoff date not stated numerically in the sheet):

| Week (w/c) | Unique views | Form views | Form starts | Applicants | Accepted | Paid (logged) |
|---|---:|---:|---:|---:|---:|---:|
| 5 Aug | 156 | 62 | 9 | 2 | 2 | 1 |
| 12 Aug | 189 | 61 | 29 | 9 | 9 | 0 |
| 19 Aug | 183 | 65 | 38 | 11 | – | 0 |
| 26 Aug | 130 | 34 | 17 | 2 | 2 | 2 |
| 2 Sep | 85 | 49 | 22 | 4 | 3 | 2 |
| 9 Sep | 53 | 10 | 6 | 0 | 0 | 0 |
| 16 Sep | 152 | 43 | 25 | 8 | 7 | 5 |
| **Total (logged)** | **948** | **324** | **146** | **36** | **23** | **10** |

Two honest reads from this:
- **Top-of-funnel is front-loaded**: views, form views/starts and applicants peak in **mid-August** (doors-open surge) and taper.
- **Paid is back-loaded and under-logged**: only **10 paid** appear in the weekly grid vs the cohort's real **20** total (6 early-bird + 14 full-price per the sheet). So ~half the paid landed after/around doors-close or weren't logged weekly. Treat the weekly paid *actuals* as directional, not complete.

### 2d. March 2025 — applications-timing cross-check

Typeform export (42 completed apps, kickoff 19 Mar 2025): completed applications front-loaded, ~half in by 5 weeks out, effectively all in by 2 weeks out. Consistent with Sept 2024's front-loaded top-of-funnel. Confirms *demand arrives early, paid commits late.*

---

## 3. The target/benchmark model — SUPERSEDED, see §6

**⚠ Everything in this section (§3) was built from the Sept 2024, no-ads benchmark and is now superseded by §6 below**, which rebuilds it on the two real ads-era cohorts (March 2025, recent/"March 2026"). Kept here for the record, not as current truth. The live Sheet and both dashboards now reflect §6's numbers, not §3's.

Two framings, both from the real benchmark in §2a. **Liv finds framing (a) more useful for planning.**

### (a) Backwards-from-goal funnel targets — the headline

Working back from **25 paid** at the established step rates (87% / 72% / 32% / 43% / 22%):

| Funnel stage | Needed for 25 paid | Best-ever cohort | Stretch vs best-ever |
|---|---:|---:|---:|
| Website (unique) views | **≈ 1,318** | 1,039 | +27% |
| Typeform views | **≈ 290** | 246 | +18% |
| Form starts | **≈ 125** | 102 | +23% |
| Applicants (completed) | **≈ 40** | 34 | +18% |
| Accepted | **≈ 29** | 23 | +26% |
| **Paid** | **25** | 21 | +19% |

Read as "you need at least this many at each stage." For comparison, the same model backwards from a goal of **20** returns ≈1,055 views / 232 form views / 100 starts / 32 applicants / 23 accepted — i.e. almost exactly the historical average. **The whole funnel has to run ~20–27% hotter than it ever has to deliver 25.** That's the stretch, quantified.

### (b) Week-by-week pacing curve — reset to the ~9-week window

Two things pace differently, and the real data shows both clearly:

**Top-of-funnel (views / form views / starts / applicants): front-loaded.** From Sept 2024 actuals, the doors-open surge lands the bulk of traffic and applications in the first ~3 weeks of August, tapering into September. Spread the applicant target (~40) accordingly: heaviest in the first half of the window.

**Paid: back-loaded.** Liv's own Sept 2024 weekly PAID target breakdown (real, from the sheet) was `0,0,0,0,2,2,4,4,4,4` across the window (total 20) — i.e. **nothing until ~week 5, then a September-weighted ramp**. Scaled to the 25 goal and mapped onto TMA Sept 2026's reset weeks:

| Week (w/c) | Phase | Paid target (new) | Cumulative paid | Cum % of 25 |
|---|---|---:|---:|---:|
| 20 Jul | warm-up | 0 | 0 | 0% |
| 27 Jul | doors opening | 0 | 0 | 0% |
| 3 Aug | doors open | 0 | 0 | 0% |
| 10 Aug | early bird | 0 | 0 | 0% |
| 17 Aug | early bird | ~3 | 3 | 10% |
| 24 Aug | early bird close | ~2 | 5 | 20% |
| 31 Aug | mid | ~5 | 10 | 40% |
| 7 Sep | closing | ~5 | 15 | 60% |
| 14 Sep | doors close | ~5 | 20 | 80% |
| 22 Sep | kickoff | ~5 | 25 | 100% |

**Reconciliation / honest caveat on pacing:** the recent HubSpot cohort actually committed paid *earlier and more spread* (about half by ~6 weeks out) than this back-loaded Sept 2024 plan assumes — partly because its doors opened months ahead. So real TMA Sept 2026 paid may start before mid-August; the model treats any early paid as being ahead of pace, not as an error. If Liv wants a less extreme back-load, blend toward the HubSpot shape (earlier ramp). Recommendation: **keep the Sept 2024 back-loaded shape as the default** (it matches this window structure and is Liv's own model), and revisit after this launch produces a second true weekly paid actual.

Store the pacing curve as cumulative % of goal by week; weekly paid target = curve % × `paid_goal`. Top-of-funnel targets = the §3(a) volumes spread on the front-loaded shape.

---

## 4. Override-per-launch and concurrent-launch design

**Override per launch.** The default benchmarks (§3a rates) and default pacing curve (§3b) live once, centrally. Each Launch either inherits them or sets `funnel_benchmarks` / `curve_override` of its own. Resolution at calc time: *if the launch has an override, use it; else use the default.* This keeps one editable default reusable across launches (PRD decision) while letting a differently-shaped launch (e.g. BMBC, or a launch with a longer runway like the recent HubSpot cohort) supply its own rates/curve without touching others. Weekly target for any launch = resolved-curve % × that launch's `paid_goal`, bucketed by its own `kickoff_date`.

**Concurrent launches.** Every stored number is keyed by `launch_id`. Each launch declares its own distinct `typeform_form_id`, `ga4_page_path` and `hubspot_pipeline_id` (M1 confirmed distinct GA4 paths and pipelines exist), so pulls never share a source and counts can't bleed. Grain (M3) = one row per launch per week. Alignment is by each launch's own weeks-to-kickoff, not absolute date, so two overlapping launches stay separate. Residual watch-item (M1): if two cohorts of the same course ever share one GA4 landing path simultaneously, page-level views can't split them — not an issue for TMA Sept 2026 (single active TMA cohort).

---

## 5. Decisions

**Confirmed by Liv (applied above, not re-asked):**
- **"Said they'll pay" does NOT count toward paid.** Only the Paid stage / committed-with-invoice-or-payment-plan counts. Accepted/successful is a separate earlier stage. (Applied in §1a, §3.)
- **Show the clean 7 funnel stages, mapped to real HubSpot stages underneath.** (Applied in §1a.)
- **Build the benchmark/curve primarily from the real funnel history, leaning on recent data** — not the single messy snapshot cohort. (Applied: §3 uses the four-half-year benchmark + Sept 2024 weekly model + recent HubSpot paid timing.)
- **Widen the tracked selling window to ~8–9 weeks.** (Applied: TMA Sept 2026 window reset to w/c 20 Jul → w/c 14 Sep, kickoff 22 Sep.)

**Still to confirm with Liv:**
1. **Kickoff date 22 vs 29 Sept.** Entity is date-editable so not blocking, but every week label + the pacing curve shift by a week if it slips. Confirm before M3 locks weekly buckets.
2. **Pacing shape for paid — back-loaded (Sept 2024 plan) vs earlier ramp (recent HubSpot actual)?** Recommendation: keep the Sept 2024 back-loaded default; treat early paid as ahead of pace. One line of sign-off wanted.
3. **Booked-call stage has no historical benchmark.** Confirm it's fine to show it as a live-only count (no target line) in the clean-7 view, since the funnel model never tracked it.

---

## 6. Revision, 2026-07-21 — rebuilt on real ads-era cohorts, not the Sept 2024 (no-ads) benchmark

Liv flagged that "40 applicants" felt too low. Checking live confirmed why: **the Sept 2024 benchmark (§2a/§3) is a no-ads cohort — ads only ran for the last 2 cohorts (March 2025, and the recent/"March 2026" one), and ads roughly triple top-of-funnel volume without tripling paid output.** Real numbers, pulled live:

| Cohort | Ads? | Unique website views (GA4, cohort window) | Typeform unique visits | Completed applicants | Paid |
|---|---|---:|---:|---:|---:|
| Sept 2024 | No | 1,614 | 166 | 43 | ~20 |
| March 2025 | Yes | 1,391 | 647 | 125 | ~21 |
| Recent ("March 2026") | Yes | 3,641 | 491 | 115 | 21–23 |

Applicant→paid conversion craters from ~47% (no ads) to ~15–19% (ads) — ads bring far more, far cooler traffic. Since TMA Sept 2026 will run ads too, the ads-era cohorts are the right comparables now.

**Revised target table**, weighted 70% recent cohort / 30% March 2025 (Liv's steer: "weight more towards Jan 2026 results"), then scaled ×1.19 to reach the 25-paid goal (both real cohorts landed ~21 paid, so the scale factor is consistent across every stage):

| Stage | Old target (§3a) | **New target** | Source |
|---|---:|---:|---|
| Website views | 1,318 | **3,530** | Real GA4, both ads-era cohorts |
| Typeform views | 290 | **1,263** | Real per-field Typeform data (revised — see below) |
| Form starts | 125 | **694** | Real per-field Typeform data (revised — see below) |
| Applicants (completed) | 40 | **139** | Real Typeform responses, both cohorts |
| Accepted | 29 | 29 (unchanged) | Still the 87%-of-paid ratio assumption — not ads-era-measured |
| Paid | 25 | 25 (unchanged) | Goal |

**Correction, same session:** Form starts was first set to "no target" — the form-level `unique_visits`/`responses_count` fields don't distinguish started-not-finished. But Liv asked why, which prompted checking Typeform's **per-field** insights data (`views`/`dropoffs` per question), which does exist and is real. Field 1 (email, the form's first question) showed views ~2.1x the form-level unique-visits count, consistently across both ads-era cohorts (1,039/491 and 1,351/647) — a real Typeform counting quirk (field views aren't deduplicated the way visit-level metrics are), not an error. Liv supplied the resolved figures directly from this per-field data: **Typeform views 1,263 / Form starts 694 / Applicants 139** (narrows correctly, 1263 > 694 > 139) — these are now the live targets, replacing both the original §3a numbers and the first "no target" call on Form starts.

**Reframed caveat:** the real stretch isn't top-of-funnel traffic anymore — both real ads-era cohorts already met or beat the new views/Typeform-views targets. The genuine stretch is converting that volume into paid at a strong enough rate (ads-era applicant→paid has run ~15–19%, not the ~62% the old organic-only model implied). This reframing is now the live caveat text in the Sheet and both dashboards.

**Target conversion added alongside actual conversion**, per Liv's request — each funnel stage on the dashboard now shows both "X% conversion" (actual, when measurable) and "target Y%" (derived live from the target column, e.g. Typeform→Form-starts target conversion ≈55%, Form-starts→Applicants ≈20%), so actual can be judged against the target rate, not just the target total.

**Window reset again:** Liv confirmed marketing won't start until end of next week (~w/c 3 Aug 2026, not w/c 20 Jul as previously set) — she has a course-planning session running in a separate chat and this is a live-changing date. New window: **w/c 3 Aug → w/c 22 Sep (kickoff)**, 8 rows. The two now-inactive early weeks (w/c 20 Jul, w/c 27 Jul) were blanked in the Sheet rather than deleted. **The existing Paid weekly curve (0,0,3,2,5,5,5,5, cumulative to 25) already fit this exact 8-row window and was left untouched.**

**Weekly targets now exist for Website views / Typeform views / Form starts / Applicants / Accepted too** (a real schema change from the original §3b decision, "top-of-funnel stages carry a WINDOW TOTAL target, not split per week"), per Liv's request to show %-against-target for every stage under "This week," not just Paid. Apportioned using the one clean real weekly shape available — Sept 2024's actual unique-views sequence (156, 189, 183, 130, 85, 53, 152 across 7 weeks, normalized to %), applied to all four stages, zeroed at the kickoff row. **Flagged honestly: this weekly shape is borrowed from one real series, not independently measured per stage** — the Campaign-Plan sheet's other stage rows were too scrambled by merged-cell export artifacts to extract distinct shapes confidently, and using one consistent real shape was judged more honest than fabricating stage-specific variations that couldn't be verified.

**Sense-check data point, for Liv:** the recent cohort's first Typeform response landed 3 Dec 2025, one day after the form went live; its first Paid deal entered 7 Jan 2026 — a **5-week lag from first response to first sale.** Applied to the new 3 Aug start, the model would put the first sale landing around the first week of September, only 2–3 weeks before kickoff.

**Also surfaced, not yet resolved:** live-querying HubSpot for this revision found the previous cohort's Paid-stage deals (e.g. Laura Cunniffe, Ellie Jones, both real deals checked earlier in this build) **had been bulk-moved to "Interested in next cohort" that same day** — almost certainly the pipeline being reset for TMA Sept 2026's own intake, per M1's original reused-pipeline warning, but worth Liv confirming it was intentional, since it means "current stage = Paid" can no longer identify that old cohort's payers going forward.

---

## 7. Revision, 2026-07-30 — re-anchored to the confirmed dates

The whole model was built on `kickoff_date 2026-09-22` and `doors_close_date ~2026-09-14`. Both were
wrong: **kickoff is confirmed Wed 30 Sept 2026** (per Liv's `#startup-accelerator-team` post,
recorded in the build log 22 Jul). The 8-row grid therefore ended a week short and every paid-pacing
bucket was misaligned, so "behind pace" would have read wrong for the whole window.

**Applied live to the Sheet** (111 cells, via the service account — Sheets API now enabled, so M4's
§2 blocker is cleared):

| | Was | Now |
|---|---|---|
| Kickoff | 22 Sept | **Wed 30 Sept** |
| Tracker rows | 8 (w/c 3 Aug → w/c 22 Sep) | **9** (w/c 3 Aug → w/c 28 Sep) |
| External deadline | "doors close" w/c 14 Sep | **Fri 18 Sept** (w/c 14 Sep) |
| Internal deadline | not modelled | **Fri 25 Sept** (w/c 21 Sep) |
| Paid curve | 0,0,3,2,5,5,5,5 | **0,0,1,2,3,5,6,6,2** |
| WINDOW TOTAL row | row 15 | row 16 |

**Window totals unchanged** — 3,530 views / 1,263 Typeform views / 694 starts / 139 applicants /
29 accepted / 25 paid. Only the weekly apportionment moved.

**Why the paid curve got more back-loaded:** there is now **one talk, on Wed 2 Sept** (Liv's call,
29 Jul — she previously ran two). Applications bulk-land after it, so payment concentrates in the two
deadline weeks. The curve weights 12 of 25 into w/c 14 and 21 Sept.

**Weekly shape caveat, unchanged and still true:** top-of-funnel weekly targets are apportioned from
the Sept 2024 actual unique-views series, extended by one internal-deadline week. It is one real
series applied to all stages, not independently measured per stage.

**Window start kept at w/c 3 Aug** (Liv's call). Honest cost: the launch email goes **Fri 31 Jul**,
which falls in w/c 27 Jul, and that week already holds real activity the tracker will never
see — 32 GA4 pageviews and **4 real completed applications** (Kanchan Supekar 27 Jul, Elif Gokcen and
Rana Youness 28 Jul, Enya Buchenau 29 Jul), plus Friday/weekend launch traffic.

### §5 open items — now closed
1. **Kickoff 22 vs 29 Sept** — resolved: neither. **30 Sept.**
2. **Paid pacing shape** — back-loaded confirmed, and made more so (see above).
3. **Booked-call has no benchmark** — stays a live-only count, no target line. Unchanged.
4. **Previous cohort's Paid deals bulk-moved to "Interested in next cohort"** (flagged §6) — **it was
   intentional.** That's the 22 Jul pipeline cleanup: 224 open deals → 49, with 175 archived and 47
   moved to the warm pool. Consequence stands: "current stage = Paid" can no longer identify the old
   cohort's payers.

## What M3 inherits

- Launch entity field list (§1) = the Sheet's launch-config schema; TMA Sept 2026 is row 1 (seeded).
- Backwards-from-goal targets (§3a) = the target column per funnel stage; store the rate set so it recomputes if the goal changes.
- Pacing curve (§3b) = cumulative % of goal by week, ×`paid_goal`.
- Clean-7 → HubSpot stage map (§1a) = the join for the funnel columns.
- Put the **25-vs-historical-20 caveat** on the dashboard itself (top of this file) so "behind" reads as expected, not alarming.
- Close §5 open items with Liv before M3 fixes the column schema.
