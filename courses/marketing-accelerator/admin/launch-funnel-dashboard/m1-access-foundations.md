# M1 — Access & data foundations

**Status:** M1 investigation complete, 2026-07-19
**Source PRD:** `launch-funnel-dashboard-prd.md` (this folder)
**Scope:** This file covers M1 only — access confirmation and documentation. No Sheet, dashboard, curve, or scheduled-refresh work happens here (that's M2 onward).

Files actually read/checked while doing this work: `launch-funnel-dashboard-prd.md`, `up-world/context/how-to/tools-stack.md`, `up-world/context/how-to/mailchimp.md`, `up-world/context/how-to/hubspot.md`, plus a live grep across `up-world/marketing/`, `up-world/courses/marketing-accelerator/`, `up-world/up-club/`, and the whole `Projects/` tree for `utm_`. HubSpot findings below come from live queries against the connected HubSpot MCP tools (`get_properties`, `search_crm_objects`, `query_crm_data`, `search_properties`) — not from memory or the PRD's assumptions.

---

## 1. GA4 read access — resolved, 2026-07-19

**Update:** Liv completed this. Service account `courses-dashboard@up-world-reporting.iam.gserviceaccount.com` created in the `up-world-reporting` Google Cloud project, Analytics Data API enabled, JSON key downloaded and moved to `~/.ga4_key.json` (chmod 600). GA4 property ID for Up World: **342528552**.

**Live-tested, 2026-07-19:** ran a real `runReport` call against the GA4 Data API using this key — authenticated successfully and returned actual data (1,156 `screenPageViews` across the whole property, last 7 days). Confirmed end-to-end, not just "credential exists."

**Typeform also live-tested the same session:** `GET https://api.typeform.com/me` with the token at `~/.typeform_key` returned 200, authenticated as `olivia@up-world.co`. Both credentials are proven working, not just present.

---

### Original investigation (kept for reference) — was: blocked-pending-Liv

**Status: blocked-pending-Liv.** Confirmed (again, independently) there is no existing GA4 credential anywhere in this workspace or in `~` (checked `~/.ga4_key` and equivalent dotfile patterns — nothing). I have no Google Cloud tooling in this session, so I cannot generate this myself; Google credentials always require a human in Google Cloud Console + GA4 admin.

**What Liv needs to do, step by step (mirrors the Mailchimp direct-API-key pattern):**

1. In Google Cloud Console, create (or reuse) a project, then enable the **Google Analytics Data API** for it.
2. Create a **Service Account** in that project (IAM & Admin → Service Accounts → Create). Service accounts are the right pattern here, not a personal OAuth token — they don't expire and don't ride on Liv's personal Google login.
3. Generate a **JSON key** for that service account (Keys tab → Add key → JSON). This file is the credential — treat it exactly like the Mailchimp key: never paste its contents into chat, never commit it.
4. In **GA4 Admin** (admin.google.com is wrong — this is inside analytics.google.com, Admin → Property Access Management) for the **up-world.co property**, add the service account's email address (looks like `name@project-id.iam.gserviceaccount.com`) as a user with **Viewer** role. Viewer is read-only — matches the PRD's "read-only scope" requirement.
5. Save the downloaded JSON key file somewhere outside the workspace, analogous to `~/.mailchimp_key` — e.g. `~/.ga4_key.json`, then `chmod 600 ~/.ga4_key.json`.
6. Tell me (or a future Claude session) the exact GA4 **property ID** (numeric, found in GA4 Admin → Property Settings — not the same as the measurement ID starting `G-`) once you have it. That property ID is also listed as an open question in the PRD (line 130) — this is where it gets resolved.
7. Once the key exists, a future Claude session can use it to call the GA4 Data API directly (same shape as the Mailchimp API-key pattern) for M4's scheduled pull.

Nothing else in M1 depends on this being done today — it just needs to happen before M3/M4.

---

## 2. Typeform read access — blocked-pending-Liv

**Status: blocked-pending-Liv.** Same check, same result: no `~/.typeform_key` or equivalent, nothing in the workspace. Typeform is currently a **shared account** per `tools-stack.md` (not an individual seat), so someone with access to that shared login needs to generate the token.

**What Liv needs to do:**

1. Log into the shared Typeform account (workspace settings or personal settings, depending on Typeform's current UI) → **Personal tokens** (sometimes under "Connect" → "Personal Access Tokens", or account settings → Developer).
2. Create a new token. Name it something identifiable, e.g. `claude-launch-dashboard-readonly`.
3. Scope: Typeform tokens are account-wide bearer tokens rather than fine-grained read/write scopes per se, but when creating it, only grant the **read** permissions Typeform's UI offers (forms:read, responses:read) if it lets you pick — decline anything write-shaped.
4. Save the token to `~/.typeform_key`, then `chmod 600 ~/.typeform_key` — same pattern as `~/.mailchimp_key`.
5. Separately, note down the **form ID(s)** for each active/upcoming launch (visible in the form's URL or under Share → Embed). This resolves another PRD open question (line 131) and is required per-launch, since M1's decisions capture "each launch is identified by its own Typeform form ID."
6. Document the token's existence and location in `up-world/context/how-to/` (a new `typeform.md`, mirroring `mailchimp.md`/`hubspot.md`) once it's live — not yet created, since there's nothing to document until the token exists.

---

## 3. HubSpot Deal-read access — done (real live check performed)

**Status: done.** This session has the HubSpot MCP connector active (tools `search_crm_objects`, `query_crm_data`, `get_crm_objects`, `search_properties`, `get_properties`, etc.) and I queried it live — this is not inferred from the PRD or memory.

**What I confirmed:**
- Deal stage, deal name, pipeline, and stage-entry timestamp are all readable. `hs_v2_date_entered_current_stage` ("Date entered current stage") exists on Deals and is exactly the field M4 will need for days-in-stage calculations.
- **Applicant email is not a direct Deal property.** I searched Deal properties for anything email-shaped and found only `contact` (labelled "this data comes from the new biz typeform" — looks specific to the Brand Hackers New Business pipeline, not TMA) plus contact-logging metadata (`notes_last_contacted`, `num_contacted_notes`). Standard HubSpot behaviour: applicant name/email lives on the **associated Contact record**, reachable via the Deal↔Contact association, not a field on the Deal itself. M3/M4's applicant-detail tab will need to pull Contact.email (and Contact.firstname/lastname) via that association, not assume it sits on the Deal.
- Ran `SELECT pipeline, dealstage, COUNT(*) FROM DEAL ... GROUP BY pipeline, dealstage` against three pipelines to see real, current stage usage (not just the full label superset, which includes unused legacy stage IDs sharing labels across pipelines).

**Pipelines that exist today** (from live `pipeline` property enumeration on Deals):

| Pipeline | ID |
|---|---|
| Brand Hackers New Business | 23553015 |
| Brand Manager Bootcamp (legacy) | 3934514394 |
| The Marketing Accelerator | 888214769 |
| Match-Making Roles | 21806560 |
| Sponsorship | 21199302 |
| Ecommerce Pipeline | 75e28846-ad0d-4be2-a027-5e1da6590b98 |
| Up Club Agency | 2132728011 |
| Big Up Club | 2294380763 |
| Brand Hackers Existing | 2732874981 |
| Brand Manager Bootcamp 2026 | 3934525658 |

Full mapping table and analysis of the two course-launch-relevant pipelines is in section 5 below.

---

## 4. UTM tagging audit — done (result: no UTM tagging found, later ruled unnecessary)

**Update, 2026-07-19 (after this audit ran):** Liv confirmed website views don't need UTM attribution at all — "website views" means pageviews on each course's own landing page (the BMBC page, the TMA page), not campaign-attributed traffic. The PRD's Launch identifiers decision and M1/M2 checklists have been updated accordingly. The audit finding below still stands as a fact (no UTM tagging exists in this workspace) but it's no longer a gap that blocks anything — it's simply moot.

**Status: done, and the finding is a gap, not a convention.** Grepped case-insensitively for `utm_` across `up-world/marketing/`, `up-world/courses/marketing-accelerator/`, `up-world/up-club/`, and then re-ran across the entire `Documents/Claude/Projects/` tree to be sure. **Zero matches anywhere.** No campaign links in this workspace currently carry UTM parameters, and there is no documented UTM convention in `context/how-to/` or elsewhere to fall back on.

**What this means for the PRD:** the pre-mortem already flagged this risk (line 141: "Weak UTM tagging on any given launch's traffic sources would silently undercount website views in GA4"). The audit confirms it's not "weak" — it's **absent**. Before GA4 website-view numbers can be trusted as per-launch (rather than total-site) figures, someone needs to:
1. Decide a UTM convention (e.g. `utm_campaign=tma-sept-2026`, `utm_source=`, `utm_medium=` per channel).
2. Retrofit it onto the links actually driving traffic to the launch landing page (LinkedIn posts, email CTAs, paid ads) going forward — historical traffic can't be retagged after the fact.

I have not invented a convention — that's a decision for Liv/Lottie, not something to assume into existence. Flagging to Liv now, as the checkbox instructs, rather than waiting for M3.

---

## 5. HubSpot pipeline/stage-name mapping — done, and it confirms the PRD's own worry

**Status: done for the two pipelines that actually run course launches today** (The Marketing Accelerator, Brand Manager Bootcamp 2026). The legacy Brand Manager Bootcamp pipeline (3934514394) has **zero deals in it** — it's dead, fully superseded by "Brand Manager Bootcamp 2026." Other pipelines (Sponsorship, Match-Making, Ecommerce, Brand Hackers, Up Club Agency, Big Up Club) are not course-launch funnels and are out of scope for this dashboard.

**The Marketing Accelerator (pipeline 888214769) — live stage usage:**

| Funnel stage (PRD) | HubSpot stage name(s) in use | Live count |
|---|---|---|
| Partial Submission | Partial Applied | 97 |
| Complete Submission | Applied | 3 |
| (in-between/chase states, no clean PRD equivalent) | More info needed (21), WA chaser sent (2), WA+LI chaser sent (2), Unresponsive (15) | — |
| Booked Call | *(no stage literally named "booked call" — closest is "Acceptance sent," see note)* | — |
| Accepted | Acceptance sent | 6 |
| Paid | Paid | 23 |
| (exit/decline states) | Not right (32), Declined too junior (3), Decided to pull out (17), Interested in next cohort (2), Said they'll pay (1) | — |

**Note — the PRD's assumed stage set doesn't quite match reality.** The PRD (line 68) names 7 stages including "Booked Call," but TMA's actual pipeline has no stage literally called that — it goes Partial Applied → Applied → (chasers/more info) → Arranging 'interview' → Interview scheduled → Acceptance sent → Said they'll pay → Paid. "Arranging 'interview'" and "Interview scheduled" are the closest match to "Booked Call," but the wording is call/interview, not "booked call." **This needs a decision from Liv before M3 builds a fixed 7-column schema**: either the Sheet's "Booked Call" column maps to "Interview scheduled," or the schema should use TMA's real stage names rather than the PRD's assumed ones.

**Brand Manager Bootcamp 2026 (pipeline 3934525658) — live stage usage:**

| HubSpot stage name in use | Live count |
|---|---|
| Warm Lead | 178 |
| Hot Lead (whatsapp+li) | 7 |
| Awaiting Payment | 3 |
| Paid | 8 |
| Interested in Next time | 2 |

**This is the sharper finding.** BMBC 2026's stage names are **completely different** from TMA's — no "Partial Applied," no "Applied," no "Acceptance sent." It runs Warm Lead → Hot Lead → Awaiting Payment → Paid, a much shorter/different-shaped funnel. This confirms the PRD's own pre-mortem risk (line 140: "HubSpot pipeline/stage names may not be consistent launch to launch") **is not hypothetical — it's already true today, between the two live pipelines.** A single fixed stage-mapping table won't work as-is; M2/M3 will need a per-pipeline stage-mapping config (which the PRD's Launch entity in M2, line 77, already anticipates via "HubSpot pipeline ID" as a per-launch field) — this just confirms that field is doing real, necessary work, not just future-proofing.

**Open item to hand to Liv:** confirm with her (or whoever runs BMBC) whether "Warm Lead"→"Hot Lead"→"Awaiting Payment"→"Paid" is the intended full BMBC application flow, or whether stages are being skipped/mis-set — 178 Warm Lead vs only 8 Paid is a steep drop that's worth a sense-check before trusting it as ground truth.

---

## 7. Historical cohort data for the M2 curve — found in Google Drive, 2026-07-19

**Context:** Liv confirmed HubSpot Deals only started being used for the Accelerator from the most recent (last) cohort onward — everything before that (Sept 2024, March 2025 cohorts) was tracked entirely in Google Sheets. Liv asked to track those down rather than derive the curve off a single cohort. Searched Drive live and found real, usable data for both:

**March 2025 cohort:**
- "Accelerator Applications March 2025" — spreadsheet id `1Atb-SUUAYohN6waPBho0V8iFfQk6nbbuBYn95eyKr1Y`. Has a **PAID** tab with individual applicant rows and payment status (early bird / full price / invoice).
- "Marketing Accelerator Ads Plan" — spreadsheet id `11-L3LedzQagzxZTfypPvP9xOIdRYvf2xq43HK6wUfHc`. Has funnel counts (leads, applications, approved, paid) but ⚠ **Liv flagged this is likely paid-ads-sourced applicants only, not the whole funnel** — ads have only run for the last 2 cohorts, so this sheet would undercount organic applicants for any cohort. Liv is double-checking; until confirmed, treat this sheet as channel-mix context only, not the source for total weekly counts. The **PAID tab on the March 2025 cohort sheet** (all applicants regardless of channel) is the one to use for that cohort's real total.
- "Accelerator Course - March 2025 - Campaign Plan" — spreadsheet id `1A2GQv3n01WNazj2t4pIvgC6xlx0aDpBXGL6h5CVtHbs`. Dated campaign/launch-week plan — useful for anchoring which calendar week is "week 1" etc.

**Sept 2024 cohort:**
- "Accelerator September 2024" — spreadsheet id `18_B_r6rK3EdrH0hP_cU56t5jq3sHliVglM5BRxt_VAU`.
- A series of **dated snapshot exports**: `September_2024_Accelerator_Applications_<unix-timestamp>.xlsx`, taken every few days through Aug-Sept 2024 (files at ids `1EaoODCRDiOMSeXuxOkyXHTGYHTW_BHeu`, `1gsSHcZyev9hZvqLIUQYevi-q4sfk9hjZ`, `1KYvM_SlX6FyoewheKaka39yHBXcnD_ae`, `1Dt5jF7-FGYyEs_uKMic6hfpFEqcJy9Zx`, and more — search Drive for the exact filename pattern to get the full set). These are genuinely valuable: each is a point-in-time snapshot of applications, so together they reconstruct a real week-by-week progression, not just a start/end total.
- "Accelerator Course - September 2024 - Campaign Plan" — spreadsheet id `1XYeMk_GpCTFBwoN5NfDug-J1VdFiRfGjMqGX6-mkLnc`.

**Bonus, not asked for but sitting there:** April 2024 and Sept 2023 cohort application exports also exist in Drive, if the curve ever needs a 4th or 5th data point.

**Conclusion:** a 3-cohort curve (Sept 2024, March 2025, + the one live in HubSpot) is genuinely buildable from real data, not a guess from one launch. M2 should read these files directly (via Drive `read_file_content`) rather than re-deriving from scratch.

**Data-quality check, 2026-07-19 — read the actual files rather than assume:**
- The "Marketing Accelerator Ads Plan" sheet is confirmed **ads-only** by Liv (ads have only run the last 2 cohorts) — excluded from the curve entirely, channel-mix context at most.
- The "Accelerator September 2024" sheet itself is just a graduate roster (name/role/company), not funnel data — **not useful on its own**.
- One of the Sept 2024 dated snapshot exports (`1Dt5jF7-FGYyEs_uKMic6hfpFEqcJy9Zx`) **is** useful: per-applicant Status (blank / PAID / Sent acceptance / bootcamp space) + a manually-logged "Creation Log" timestamp per row (e.g. "Olivia Pike 30 Jul, 2024 11:23 AM" — when Liv processed each application, not an automated Typeform timestamp).
- The March 2025 sheet (`1Atb-SUUAYohN6waPBho0V8iFfQk6nbbuBYn95eyKr1Y`) contains a genuine raw Typeform export tab: per-applicant timestamp, **partial/completed** status, and channel, running Dec 2024 → March 2025 — the cleanest of the two historical sources. Also contains a lead-qualifying tracker tab ("Stage we're at") similar to the old manual flow from the Accelerator Flows diagram.
- **Verdict:** both older cohorts have real, individual-level, dated data — not a guess — but the two use different formats from each other and from what HubSpot will give M2 for the current cohort. Normalizing all three into one common weekly-count shape is real M2 work, not a quick copy-paste.

---

## 6. Join-key model documentation — done

This is documentation of what the PRD already established (line 69), written out in full so M2 onward can build against it without re-deriving it:

**Two distinct data regimes, joined at one specific point:**

1. **Anonymous / traffic-level (no individual join possible):**
   - GA4 website views — counted per session/pageview, no personal identifier.
   - Typeform views and starts — counted per form-load/session, before any personal data is submitted.
   - These numbers are aggregate-only. There is no way to trace an individual GA4 pageview or Typeform "start" forward to a named person — by design, Typeform doesn't attach identity until a field like email is actually filled in and the response is (at minimum) partially submitted.

2. **Identified / individual-level, joined by email (from Typeform completion onward):**
   - Typeform **completion** (a submitted response) carries whatever fields the form collected — typically including email.
   - That email is the join key into **HubSpot Deals**, from "Partial Submission" onward (per the Decisions table, line 39: "HubSpot Deals is now the single source of truth from Partial Submission onward").
   - Inside HubSpot, email itself is not a Deal property — it lives on the **associated Contact record** (confirmed live in section 3 above). So the practical join chain is: Typeform response (email) → HubSpot Contact (matched/created by email) → HubSpot Deal (associated with that Contact, stage tracked from Partial Applied onward).

**Consequence for the funnel view (already flagged in the PRD's pre-mortem, line 139, confirmed correct here):** the drop-off between "Typeform views/starts" and "Partial Submission" can **never be a true 1:1 headcount funnel** — the early stages are anonymous counts, the later stages are named individuals. Any funnel visual (M5) needs to represent that seam honestly (e.g. a visual break or an "approximate" label between the aggregate and individual-level sections) rather than implying a continuous, exact drop-off count.

---

## Summary for M2 onward

**M1 is fully complete as of 2026-07-19.** All three data sources are live-tested and proven working, not just configured:
- **HubSpot** — live, verified (pipelines, stages, Deal↔Contact join all confirmed).
- **GA4** — live, verified (real `runReport` call returned real numbers). Property ID 342528552, key at `~/.ga4_key.json`.
- **Typeform** — live, verified (`/me` returned 200, authenticated). Token at `~/.typeform_key`. Still need: form ID(s) for the active/upcoming launches.
- **UTM audit** — done; turned out to be moot (website views are page-level, not UTM-attributed — see Decisions in the PRD).
- **Join-key model** — documented.
- **"Booked Call" stage mapping** — resolved: it's HubSpot's "Arranging 'interview'" / "Interview scheduled" stage.
- **BMBC's differently-shaped pipeline** — deliberately deferred, not addressed in v1.

Nothing is blocking M2 anymore except confirming Typeform form IDs for the launches being tracked.

**GA4 page-path breakdown confirmed live, 2026-07-19:** ran a `pagePath`-dimensioned report over the last 30 days. Real result includes `/the-marketing-accelerator` (104 views) and `/brand-manager-bootcamp` (245 views) as distinct rows — confirms website views can be filtered per-launch by landing page path, no UTM tagging needed. These two paths are the GA4 identifiers to use in each launch's config.

**Historical Accelerator Typeform forms, for M2's curve-derivation pull:**
- `yhXBWQKN` — most recent completed Accelerator cohort (title not yet confirmed live)
- `BG6sJr2o` — live-confirmed, 2026-07-19: "The Marketing Accelerator March 2025 - APPLICATION"
- `dLWkeXkJ` — live-confirmed, 2026-07-19: "The Marketing Accelerator September 2024 - APPLICATION". Confirmed by Liv as Sept 2024, not March 2024 (her earlier label was a slip).

These are reference cohorts for deriving the default weighted curve in M2, not the active launch.

**Typeform form ID for the new/active launch — live-confirmed, 2026-07-19:** `Ve2btZwn`, title "The Marketing Accelerator Sept 2026 - APPLICATION," created today. This is the **TMA Sept 2026** launch — the first live launch this dashboard will track once M2 onward is built. No responses yet (expected, form is brand new).

**Typeform funnel-metric availability — live-verified, 2026-07-19 (resolves a pre-mortem risk):** the `GET /insights/{form_id}/summary` endpoint returns, per device platform, `total_visits`, `unique_visits`, `responses_count`, `completion_rate` and `average_time`. So the full Typeform layer of the funnel — **views (visits) → starts → completions** — is genuinely retrievable via API, not an approximation. This was previously flagged as a risk ("Typeform views can't be reconciled"); the visit/start/completion counts themselves are available, though they remain anonymous aggregate counts (no individual join until a response carries an email — the join-seam point in section 6 still holds).
