# Launch Funnel Dashboard PRD

**Status:** Draft, 2026-07-19
**Owner:** Olivia Pike
**Surface:** New Google Sheet (weekly funnel tracker), a lightweight dashboard reading from it, plus read access into GA4, Typeform and HubSpot.

## Problem

Right now, checking how a course launch (TMA, BMBC, etc.) is tracking is entirely manual: Liv digs through Mailchimp/HubSpot/Typeform/GA4 by hand each week to pull together numbers for SLT reporting, and there's no easy way to compare how this launch is pacing against past ones. The email-open-rate metric is separately unreliable right now due to a domain deliverability issue (suppressed since early 2026, fix expected late July 2026) — but that turned out to be a smaller problem than the real one: there's no view of the *whole* application funnel at all, from a visitor landing on the site through to a paid cohort spot.

We want to:
1. See the full launch funnel — website views → Typeform views → Typeform starts → Typeform completion (application) → booked call → accepted → paid — updated weekly.
2. Track actuals against an overall paid-spaces goal, broken into weekly targets that follow a realistic launch curve (not an even split).
3. See individual applicants and where they're stuck, not just aggregate counts.
4. Make this reusable for any future launch, including several running at once.

**Success metric:** none set — this is a quality-of-life and visibility build, not tied to a specific numeric target. (Skipped deliberately; see Pre-mortem for the strategic-risk tradeoff this creates.)

## Constraints

- **Freedom:** Free hand — not required to fit within today's GA4/Typeform/HubSpot structure or the old Google-Sheet-based lead-qualifying flow (which is no longer used; see Decisions).
- **Prototype or real:** The real, standing thing — meant to be used for every future launch, not a disposable test.
- **Touches:** Real applicant data — names and emails flowing through Typeform and HubSpot Deals, individual-level (not aggregated) in both the Sheet and the dashboard.
- **Data & safety:** Read-only in v1 — nothing is written back to GA4, Typeform, or HubSpot. No auto-flagging or auto-actioning of stalled applicants (see Out of scope). All four viewers (Liv, Nzola, Jonny, Lottie) already have HubSpot/reporting access today, so no new data exposure and no sign-off required before shipping.
- **Heads-up note:** Not needed — confirmed no one requires advance notice.

## Decisions captured (from scoping conversation)

| Question | Decision |
|---|---|
| What's driving the need? | Manual digging across tools every week for SLT reporting; no easy way to compare launches |
| What does "worked" look like? | Faster SLT reporting, spotting underperforming launches sooner, less time lost flicking through sheets, a visually clearer view |
| Success metric | None — skipped deliberately, not tied to a number |
| Core scope | Full weekly funnel: website views → Typeform views → Typeform starts → Typeform completion → booked call → accepted → paid, tracked against a weekly-broken-down paid-spaces goal |
| One-off or reusable | Reusable for any future launch, not TMA-specific |
| PRD sizing | One roadmap PRD, all funnel stages, phased into milestones |
| Stage → tool mapping | Website views = GA4; Typeform views/starts/completions = Typeform; booked call, accepted, paid = HubSpot Deal stages |
| Accepted/Paid data source | Both are HubSpot Deal stages (not Stripe) |
| Old Google Sheet lead-qualifying step | No longer in use — HubSpot Deals is now the single source of truth from Partial Submission onward (Marc's manual Google-Sheet qualifying flow shown in the March 2026 Accelerator Flows diagram has been dropped) |
| Output surface | A Google Sheet as the data source of truth + a lightweight dashboard reading from that sheet for the visual/shareable view |
| Audience | Liv, Nzola, Jonny, Lottie |
| Weekly target mechanism | An overall paid-spaces goal per launch, broken into weekly targets via a weighted launch curve — not an even split |
| Curve input | One default curve, reusable across launches, editable per launch if a launch shapes differently |
| Curve source | Derived from actual week-by-week paid numbers of previous Accelerator (TMA) cohorts pulled from HubSpot — not a manually guessed shape |
| Refresh cadence | Scheduled, not pulled on-demand |
| Refresh frequency | Weekly, timed ahead of the Monday SLT reporting slot |
| Build freedom | Free hand — no obligation to preserve the old Google-Sheet flow or existing tracking structure |
| Data granularity | Individual applicant-level detail needed — who's stuck at which stage, not aggregate counts only |
| Write-back to source systems | Read-only for v1. Stalled-applicant flagging into HubSpot would be valuable but is real added complexity (write action + approval-gate design) — deferred to a future PRD once v1 proves useful |
| Concurrent launches | Must support multiple launches tracked in parallel, each with its own funnel counts, goal and curve |
| Launch identifiers | Each launch is identified by its own Typeform form ID + its own HubSpot pipeline + its own GA4 landing page URL (no UTM tagging needed — website views = pageviews on that course's page, e.g. the BMBC page or the TMA page) |
| Sign-off / heads-up | None needed — all four viewers already have HubSpot/reporting access today |
| "Booked Call" stage mapping | Confirmed same thing as HubSpot's "Arranging 'interview'" / "Interview scheduled" stage in the TMA pipeline — no separate stage needed |
| BMBC 2026 stage mismatch | Not addressing now — TMA pipeline only for v1; BMBC's differently-shaped pipeline is deferred |
| First launch to track | TMA Sept 2026 (Typeform `Ve2btZwn`, page `/the-marketing-accelerator`, HubSpot pipeline `888214769`) |
| Paid-spaces goal (TMA Sept 2026) | 25 paid spaces |
| Definition of "paid" | Committed = paid. Once someone formally commits (payment plan or invoice signed, not just verbal), they count toward the 25 — even before the full money lands. Maps to the HubSpot "Paid" deal stage. Actual cash-received is not the trigger |
| Course kick-off date | 22 Sept 2026 — with a real possibility of slipping one week to 29 Sept 2026. Launch entity dates must be editable, not hardcoded |
| Selling/funnel window | Roughly early Aug → mid-Sept 2026 (~6 weeks). Marketing warms up beginning of August; paid ads kick off ~2nd week of August; applications close the week before kick-off (~week of 15 Sept, or 22 Sept if the date slips). This window — not the course delivery dates — is what the weekly curve maps against |
| Historical curve sources (confirmed) | HubSpot pipeline 888214769 (last cohort, cleanest); March 2025 Google Sheet Typeform export (`1Atb-SUUAYohN6waPBho0V8iFfQk6nbbuBYn95eyKr1Y`); Sept 2024 dated snapshot export (`1Dt5jF7-FGYyEs_uKMic6hfpFEqcJy9Zx`). Ads Plan sheet excluded (ads-only). All three use different formats — normalizing is real M2 work |
| Curve weighting | Lean on the most recent (HubSpot) cohort as the truest picture of how TMA sells today; use Sept 2024 and March 2025 only to sanity-check the shape, not as equal weight |

## Implementation milestones

**Dependency order:** M1 (access & data foundations) → M2 (launch setup & curve) → M3 (Sheet build) → M4 (scheduled refresh) → M5 (dashboard) → M6 (verification). M5 can start once M3's schema is settled, in parallel with M4.

---

### M1 — Access & data foundations

Confirm every data source is actually reachable and mapped before building anything on top of it. No sheet or dashboard work happens here.

- [ ] Confirm or set up GA4 read access (Google Analytics Data API) for the up-world.co property — mirror how the Mailchimp direct API key was set up (key stored outside the workspace, read-only scope)
- [ ] Confirm or set up Typeform read access (personal access token) to pull views/starts/completions per form
- [ ] Confirm HubSpot Deal-read access covers the pipeline(s) used for launches (already have HubSpot MCP tooling in this workspace — confirm it can read Deal stage, applicant name/email, and stage-entry timestamps)
- [x] ~~Audit current UTM tagging~~ — not needed. Website views are pageviews on the course's own landing page (e.g. GA4 pageview count for the BMBC page or the TMA page), not UTM-attributed traffic. Confirmed no UTM tagging exists anywhere in the workspace (grepped clean) — moot now that the metric is page-level, not campaign-attributed.
- [ ] Confirm whether all launches share one HubSpot pipeline or each gets its own, and document the exact stage names to map to the 7 funnel stages (Partial Submission, Complete Submission, Booked Call, Accepted, Paid) — this may differ launch to launch and needs a stage-name mapping table, not an assumption
- [ ] Document the join-key model: GA4 website views and Typeform views/starts are anonymous, traffic-level counts only (no individual join). From Partial Submission onward, email is the join key inside HubSpot Deals.

---

### M2 — Launch setup & weekly curve

Define what a "launch" is as a trackable entity, and build the default weighted curve.

- [ ] Define the Launch entity: name, selling-window start/end week (editable — see below), course kick-off date, Typeform form ID, HubSpot pipeline ID, GA4 landing page path, overall paid-spaces goal
- [ ] Seed the entity with the first real launch — TMA Sept 2026: Typeform `Ve2btZwn`, pipeline `888214769`, GA4 path `/the-marketing-accelerator`, goal **25 paid spaces**, kick-off 22 Sept 2026 (flag: may slip to 29 Sept — dates must be editable), selling window ~early Aug → mid-Sept 2026
- [ ] Pull actual week-by-week numbers for 3 real Accelerator cohorts and normalize into one common weekly-count shape (formats differ per source): the last cohort in HubSpot (pipeline 888214769, cleanest); March 2025 (Google Sheet Typeform export `1Atb-SUUAYohN6waPBho0V8iFfQk6nbbuBYn95eyKr1Y`, has per-applicant timestamp + partial/completed status); Sept 2024 (dated snapshot export `1Dt5jF7-FGYyEs_uKMic6hfpFEqcJy9Zx`, per-applicant Status + manual creation-log timestamp). Ads Plan sheet excluded — ads-only, would undercount organic
- [ ] Derive a default weighted curve (% of goal expected per week) from that normalized historical data — align each cohort by weeks-to-kick-off so the curves are comparable despite different calendar dates
- [ ] Apply the default curve automatically to a new launch's weekly targets, with the option to override it per launch
- [ ] Build the setup flow so multiple launches can be defined and tracked concurrently without one launch's data leaking into another's counts

---

### M3 — Google Sheet build

The sheet is the source of truth every other piece reads from.

- [ ] Create the new Google Sheet with a weekly-tracker tab: one row per launch per week, columns for website views, Typeform views, Typeform starts, Typeform completions, partial submissions, complete submissions, calls booked, accepted, paid (actual), paid (weighted-curve target)
- [ ] Create an applicant-detail tab: one row per applicant with name, email, launch, current stage, date entered current stage, days in current stage
- [ ] Missing data renders as "no data", never as zero
- [ ] Confirm the sheet structure supports filtering/viewing by a single launch when several are running at once

---

### M4 — Weekly scheduled refresh

- [ ] Build the scheduled pull (weekly, timed ahead of the Monday SLT reporting slot) that queries GA4, Typeform and HubSpot for every active launch
- [ ] Append/update the current week's row per launch in the weekly-tracker tab
- [ ] Refresh the applicant-detail tab with current stage and days-in-stage for every open applicant across active launches
- [ ] Confirm the refresh handles a launch starting or ending mid-week without breaking other active launches' rows

---

### M5 — Dashboard view

- [ ] Build a lightweight dashboard reading from the Google Sheet (not a second data pull) showing: a funnel view per active launch, an actual-vs-weighted-target line for paid spaces, and the applicant list with days-stuck-at-stage
- [ ] Confirm it's viewable by Liv, Nzola, Jonny and Lottie
- [ ] Confirm it can display more than one active launch without the views bleeding into each other

---

### M6 — Verification

- [ ] Run end-to-end for one live launch; sense-check every number against a manual check of GA4, Typeform and HubSpot directly
- [ ] Confirm the weekly scheduled refresh actually fires on schedule, ahead of Monday reporting
- [ ] Confirm two launches running concurrently produce two clean, non-overlapping sets of numbers
- [ ] Confirm read-only — nothing gets written back to GA4, Typeform, or HubSpot anywhere in the flow
- [ ] Manual smoke check: an applicant stuck at "Arranging Interview" for over a week shows up correctly in the applicant-detail view

## Out of scope / future additions

- Auto-flagging or writing stalled-applicant status back into HubSpot — *deferred; future PRD once the read-only v1 proves useful and the approval-gate design for a write action can be scoped properly*
- Per-course-type curve shapes (e.g. a BMBC-specific curve distinct from the Accelerator one) — *deliberate v1 simplification; one default curve derived from Accelerator history, editable per launch, but not templated per course type yet*
- The Slack accept/decline nudge and the Marc→LinkedIn DM manual steps from the Accelerator Flows diagram — *deliberately out of scope; those are manual actions people take, not data the dashboard reports on*
- Stripe as a payment data source — *deliberate; Paid is read directly from the HubSpot Deal stage, not cross-checked against Stripe*

## Open questions to resolve during implementation

- ~~Exact GA4 property ID~~ — resolved and live-tested: 342528552, key at `~/.ga4_key.json`, Viewer grant confirmed working (real query returned data).
- ~~Exact Typeform form IDs~~ — resolved: active launch `Ve2btZwn` (TMA Sept 2026); historical `1Atb...`/March 2025 export, Sept 2024 snapshot for curve. Token at `~/.typeform_key`, live-tested.
- ~~HubSpot pipeline ID(s) and stage names~~ — resolved in M1: TMA pipeline `888214769`, stage mapping documented. BMBC deferred.
- ~~Paid goal, dates, curve sources~~ — resolved: 25 spaces, kick-off 22 Sept (may slip to 29 Sept), window early Aug → mid-Sept, 3 curve sources confirmed.
- **Still open:** will the kick-off actually be 22 or 29 Sept? Confirm before the curve's weekly buckets lock, but the entity is date-editable so it's not blocking.
- **Still open:** final Google Sheet layout — one tab per launch vs. a single tab filterable by launch — implementer's call once M2's Launch entity is defined, or a quick check-in with Liv.

## Pre-mortem flags

**Technical risks (will the build itself fail?):**
- No GA4 or Typeform connector currently exists in this workspace's toolset (unlike Mailchimp, which already has a direct API key) — M1 must prove this access is actually obtainable before M3/M4 depend on it.
- Typeform's own view/start/completion counts are anonymous and can't be reconciled 1:1 against later, email-joined HubSpot stages — the "drop-off" between Typeform views and Partial Submission will always be an approximation, not a true funnel headcount. Flagged for M1's join-key documentation.
- HubSpot pipeline/stage names may not be consistent launch to launch (the Accelerator Flows diagram shows a specific stage set built for that flow) — M1 explicitly requires a stage-mapping check rather than assuming every future launch matches.
- ~~Weak UTM tagging~~ — resolved: website views are now defined as page-level GA4 pageviews on each course's own landing page, so no UTM dependency exists. Residual risk: if a course ever shares a landing page across two launches (e.g. a page reused for two TMA cohorts back to back), page-level views alone won't separate them — worth a quick check once GA4 access is live.

**Strategic risks (will it achieve the goal even if it ships?):**
- No success metric was set, so there's no way to confirm afterward whether this actually saved time or improved decisions versus feeling generally nicer to look at — worth revisiting once it's been used for one full launch.
- The default curve is derived only from past Accelerator (TMA) cohorts; the first time this dashboard is used for a differently-shaped launch (e.g. BMBC), the weekly target will likely be wrong until someone notices and overrides it.
- Read-only individual-level detail depends on Liv/Nzola/Jonny/Lottie actually noticing a stuck applicant themselves — since write-back/auto-flagging was deliberately deferred, v1's value here rests on humans checking, not the system prompting.

## Research grounding

No external or recency-sensitive facts underpin this build — GA4's Data API, Typeform's Responses API, and HubSpot's CRM API are all standard, stable integrations. The open question isn't *whether* these APIs exist, it's whether credentials/access are set up in this workspace, which is a build task (M1), not a stale-fact risk.
