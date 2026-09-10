# Up Club HubSpot Source of Truth PRD

**Status:** Draft, 2026-06-29
**Owner:** Olivia Pike
**Surface:** HubSpot CRM, Google Sheets (Up Club Reporting), Google Apps Script dashboard, Up Club Slack workspace

---

## Problem

Up Club runs a 1,000+ member community with 10 data sources (Memberspace, Typeform, Mailchimp, Zoom, Luma, Slack/Waves, Fireflies, Stripe, HubSpot fields) and no single joined view of a member. Weekly reporting is entirely manual: Olivia reads numbers across 6 tools and types them into a Google Sheet. There is no member health score, no early churn warning, and no way to query the community's own knowledge without scrolling Slack.

The outcome is a fully connected HubSpot as source of truth, an automated weekly report that fills itself, an internal dashboard, and a Slack bot that can answer member and ops questions from the knowledge base — without exposing personal data.

We want to:
1. Make HubSpot the single joined record for every member, pulling from all live sources automatically.
2. Replace the manual Monday reporting routine with a scored, flagged, agent-written Google Sheet that reviews itself.
3. Surface that data in an internal Apps Script dashboard.
4. Give Up Club Slack a read-only Q&A bot grounded in the community's knowledge base, with no personal data exposure.

**Success metric:** Monday reporting time drops from ~90 min manual to <10 min review-and-publish. Member health score exists and flags churn risks before cancellation.

---

## Constraints

- **Freedom:** Has to fit in — HubSpot is the sanctioned CRM; Zapier is the sanctioned automation layer; Slack is the community platform. No ripping out or replacing these.
- **Touches:** Live member data (names, engagement, payment status, Slack activity). Writes to the Up Club Reporting Google Sheet. Posts in Up Club Slack.
- **Build on / must not disturb:** Existing HubSpot properties and Zapier flows must not be broken. The live Google Sheet tab must never be overwritten without a staging review step. The Memberspace → HubSpot sync is already live and must remain untouched.
- **Tools it may add:** Slack MCP connector, HubSpot MCP connector, Fireflies MCP connector, Google Drive/Sheets MCP connector, Zoom MCP connector (webinar account only), custom Luma MCP (read-only, Luma Plus API).
- **Data & safety:** Member engagement data is personal. HubSpot data must stay within HubSpot and the Google Sheet (no third-party LLM storage). Agent writes to a staging tab first — Olivia reviews before publishing to the live tab. The Slack bot returns zero personal member data; it is read-only and knowledge-base-only. Any real-world write action (posting in Slack, updating the live sheet) requires explicit human approval step.
- **Heads-up note:** No external sign-off required. Olivia owns all systems. Inform the Up Collective team before the Slack bot goes live in the member workspace.

---

## Decisions captured (from scoping conversation)

| Question | Decision |
|---|---|
| PRD structure: one doc or phased? | One roadmap PRD covering all 3 phases |
| Stripe connection in Phase 1? | Skip Stripe in v1. Use HubSpot/Memberspace cancellation data only. Revisit in v2. |
| Zoom meetings account? | Webinar Zoom via HubSpot connector. All other Zoom (meetings) pushed into HubSpot via Zapier. No second Zoom connector needed. |
| Luma event attendance? | Build a custom read-only Luma MCP against the Luma API. Luma Plus already active. |
| Phase 2 dashboard surface? | Google Sheets as data store; Apps Script renders an internal dashboard from the sheet data. |
| Phase 2 audience? | Internal only (Olivia + team). No public-facing requirement. |
| Phase 3 bot capability? | Read-only Q&A only. No self-service, no write actions. |
| Phase 3 knowledge base sources? | Google Docs/Sheets (curated knowledge base) + Slack history + HubSpot aggregate/non-personal data only. |
| Phase 3 HubSpot guardrail? | No individual member data surfaced. Aggregate queries only (e.g. "how many mentors", "next event"). |
| Agent safety model? | Writes to staging tab first. Never silently overwrites live tab. Missing data = "no data", not zero. 3+ missing signals = "Needs review" flag, not a confident score. |
| Member scoring formula? | Score = 3×SlackPost7d + SlackActive30d + 2×MIN(Events30d,2) + EmailOpen + EmailClick + 2×Call90d + Mentor + Onboarded. Flag = churn risk if cancel pending or failed payment; highly engaged if Score ≥ 7; unengaged if Score ≤ 3; else steady. |
| Join key across sources? | Email address is the primary join key across all data sources. Name fuzzy-match as fallback for event attendance reconciliation. |

---

## Implementation milestones

**Dependency order:** M1 (HubSpot schema) → M2 (connectors) → M3 (Luma MCP) → M4 (agent + scoring) → M5 (Apps Script dashboard) → M6 (Slack bot) → M7 (verification). M5 and M6 can run in parallel once M4 is complete.

---

### M1 — HubSpot schema audit and clean-up

Confirm the existing HubSpot contact properties that Phase 1 will read and write. No new contacts are created; this milestone is read and map only.

- [ ] List all existing HubSpot contact properties relevant to the agent: membership plan, membership status, cancellation date, cancellation reason, LinkedIn URL, role, industry, location, strengths, intro wishes, mentor/mentee match fields, new HU attendee flag, Luma event attendance fields, Mailchimp open/click fields, Zoom webinar attendance fields
- [ ] Confirm which properties are populated by Memberspace sync (do not touch)
- [ ] Confirm which properties are populated by Typeform → Zapier (do not touch)
- [ ] Confirm which properties are populated by the existing Luma → Zapier feed (these will be replaced by the custom Luma MCP in M3)
- [ ] Identify properties that are currently empty or manually filled — these are the Phase 1 write targets
- [ ] Document the join key: confirm email is the primary key across Memberspace, Mailchimp, Slack, Fireflies, and Luma records
- [ ] Create a new HubSpot contact property group: "Member Health Agent" — all agent-written fields go here to keep them visually separated from manually managed fields
- [ ] Define the 8 binary signal fields the scoring formula needs (SlackPost7d, SlackActive30d, Events30d, EmailOpen, EmailClick, Call90d, Mentor, Onboarded) and confirm or create them in HubSpot

---

### M2 — Connect all v1 data source connectors

Wire every live-in-v1 connector. Luma is handled separately in M3. All connections are read-only unless specified.

**HubSpot MCP connector**
- [ ] Confirm HubSpot MCP is connected and authenticated with Olivia's HubSpot login
- [ ] Verify it can read: contacts, membership plan, membership status, cancellation date/reason, Typeform profile fields (LinkedIn, role, industry, location, strengths, intro wishes), Mailchimp open/click per contact, Zoom webinar attendance per contact, mentor/mentee match properties, new HU attendee flag
- [ ] Confirm read works on a sample of 10 contacts

**Slack MCP connector**
- [ ] Confirm Slack MCP is connected and authenticated to Up Club Slack workspace
- [ ] Verify it can read Waves archive (confirm exact channel names for Waves)
- [ ] Verify it can return per-member post recency and message count for the past 30 days
- [ ] Verify it can return weekly active member count
- [ ] Confirm it cannot write to any channel without explicit tool call (safety check)

**Fireflies MCP connector**
- [ ] Confirm Fireflies MCP is connected and authenticated
- [ ] Verify it can read call transcripts and notes, queryable by participant email
- [ ] Verify date of most recent call per member is accessible
- [ ] Confirm read-only (no write access)

**Zoom (webinar account) via HubSpot**
- [ ] Confirm Zoom webinar attendance is already flowing into HubSpot contact records
- [ ] Verify the field name in HubSpot and confirm the last-synced date is current
- [ ] Set up Zapier flow: remaining Zoom meeting accounts → HubSpot contact update (meeting attendance count, last meeting date). Confirm flow is active and tested with a real record.

**Google Drive / Sheets connector**
- [ ] Confirm Google Drive MCP is connected and authenticated with Olivia's Google account
- [ ] Confirm it can read and write the Up Club Reporting Google Sheet
- [ ] Identify the exact Sheet ID and tab names: Weekly Topline tab, Per-Member Health tab, Staging tab (create staging tab if it does not exist)
- [ ] Confirm Olivia is the sheet owner and the connector inherits her permissions

---

### M3 — Build the custom Luma MCP (read-only)

Custom read-only MCP connector against the Luma Plus API to pull event guest lists into HubSpot.

- [ ] Confirm Luma Plus API key is available and the API is accessible (base URL, auth method)
- [ ] Identify the Luma API endpoints needed: list events, list guests per event (with email, RSVP status, attendance status)
- [ ] Build a read-only MCP server with two tools: `luma_list_events` (returns events in a date range) and `luma_get_event_guests` (returns guest list with email and attendance for a given event ID)
- [ ] Test both tools against at least 2 past Luma events and confirm email addresses are returned
- [ ] Write a Zapier flow (or the MCP itself) to push each guest's attendance into HubSpot: match by email, write event name, event date, and attended (true/false) into the Luma attendance field(s) defined in M1
- [ ] Retire / disable the old weak Luma → Zapier feed once the new flow is confirmed working (do not run both simultaneously)
- [ ] Document the hosting approach for the MCP server (local Claude agent run / hosted endpoint — confirm with Olivia before build)

---

### M4 — Member Health Agent: join, score, flag, write

The core weekly job. Depends on M1, M2, M3.

**Weekly schedule**
- [ ] Set up a Monday 08:00 scheduled trigger for the agent run
- [ ] Confirm on-demand trigger also works (manual run from Cowork)

**Data join**
- [ ] Agent reads all HubSpot contacts with an active or recently-cancelled membership status
- [ ] For each contact, agent reads: membership plan/status, profile completeness (Typeform fields), Mailchimp open/click (last 30d), Zoom webinar attendance (last 30d), Luma event attendance (last 30d), Slack post recency and active flag, Fireflies call date (last 90d), mentor match status, onboarding completion flag, cancellation status
- [ ] Agent joins records by email; name fuzzy-match used for event attendance reconciliation where email is absent
- [ ] Any signal from a source that is unreachable is written as `no_data`, not `0`
- [ ] If 3 or more signals for a member are `no_data`, flag the row as `Needs review` instead of computing a score

**Scoring and flagging**
- [ ] Compute score per member: `Score = 3×SlackPost7d + SlackActive30d + 2×MIN(Events30d,2) + EmailOpen + EmailClick + 2×Call90d + Mentor + Onboarded`
- [ ] Apply flag logic: if `CancelPending OR FailedPayment` → "Churn risk"; elif `Score ≥ 7` → "Highly engaged"; elif `Score ≤ 3` → "Unengaged"; else "Steady"
- [ ] Write score and flag back to the HubSpot contact record (in the Member Health Agent property group from M1)

**Sheet write — staging tab**
- [ ] Write the weekly topline row to the Staging tab: Total members, Cancellations (wk), Monthly/Quarterly/Annual counts, Brand/Freelancer/Agency split, New HU attendees, Email opens, Email clicks, Slack active members, Mentor matches (new this week)
- [ ] Write the per-member health tab to staging: one row per member with Last Slack, Events 30d, Email, 1:1 (call flag), Score, Flag
- [ ] Write a short "what changed" summary to staging: members who moved flag this week (e.g. 3 new churn risks, 2 re-engaged)
- [ ] Agent posts a Slack notification to a private ops channel: "Staging tab ready for review — [date]. X churn risks, Y highly engaged. Review and publish when ready."
- [ ] Olivia reviews staging tab and triggers a publish step (manual button or command) to copy staging → live tabs
- [ ] Publish step is never automatic; it requires explicit action from Olivia

---

### M5 — Apps Script internal dashboard

Internal-only dashboard that reads from the live Google Sheet and renders a visual summary. Depends on M4 being live for at least one real run.

- [ ] Create a new Google Apps Script project bound to the Up Club Reporting Google Sheet
- [ ] Dashboard reads the Weekly Topline tab and renders: total members (with week-on-week delta), % churn, email open %, Slack active count, mentor matches — all vs targets
- [ ] Dashboard reads the Per-Member Health tab and renders: count by flag (Highly engaged / Steady / Unengaged / Churn risk / Needs review), a ranked list of top 10 churn-risk members (name + score + last Slack date only)
- [ ] Dashboard reads the what-changed summary and displays it as a text block at the top
- [ ] Dashboard is accessible via the Apps Script web app URL (deploy as "execute as me", "access: anyone with the link within the organisation" or "only me" — confirm with Olivia)
- [ ] Dashboard auto-refreshes data on open (reads live sheet, no caching)
- [ ] Dashboard does not display individual email addresses, payment details, or any field not already in the sheet

---

### M6 — Up Club Slack Q&A bot (read-only knowledge base)

Read-only bot that answers member questions in Up Club Slack. No personal data. Depends on M2 (Slack connector). Can build in parallel with M5.

**Knowledge base setup**
- [ ] Identify and list the Google Docs/Sheets that form the curated knowledge base (FAQs, member guide, event info, mentor programme guide, Up Club norms). Olivia to confirm the exact documents.
- [ ] Confirm Google Drive connector can read all identified knowledge base documents
- [ ] Define which Slack channels count as searchable history for the bot (confirm channel list with Olivia — e.g. #resources, #intros, #general but NOT DMs or private channels)
- [ ] Define the HubSpot aggregate queries the bot is allowed to answer: e.g. "how many members?", "when is the next event?", "how many mentors are available?" — produce a written allowlist. Olivia to approve the allowlist before bot goes live.

**Bot build**
- [ ] Build the bot as a Slack app (or via an existing Slack bot integration) that listens for @mentions or a specific slash command in approved channels
- [ ] Bot answers only from: (a) curated Google Docs knowledge base, (b) approved Slack channel history, (c) approved HubSpot aggregate queries from the allowlist
- [ ] Bot does not return any individual member's name, email, score, flag, payment status, or profile data in any response
- [ ] Bot includes a standard footer on every response: "This is an automated answer from the Up Club knowledge base. For anything personal, message Olivia directly."
- [ ] If the bot cannot answer from the approved sources, it responds: "I don't have that in the knowledge base — try #help or message Olivia."
- [ ] Bot is deployed to a staging Slack channel first (e.g. a test channel) before going live in the member workspace
- [ ] Olivia reviews at least 20 test questions in staging before approving go-live
- [ ] Inform the Up Collective team before the bot goes live in the member workspace

---

### M7 — Verification (merge gate)

Run before each phase is considered shipped.

**Phase 1 / M1–M4**
- [ ] All 10 data sources have confirmed connector access or a documented fallback (Zapier/HubSpot passthrough)
- [ ] Run one full agent cycle on-demand; confirm staging tab is populated with real data, not illustrative values
- [ ] Confirm no live tab was overwritten without the staging review step
- [ ] Spot-check 5 member records: verify score matches manual calculation using the formula
- [ ] Confirm `no_data` appears (not `0`) for any source that was unreachable during the test run
- [ ] Confirm `Needs review` flag appears for any member with 3+ missing signals
- [ ] Confirm the old Luma → Zapier feed is retired and not double-counting attendance
- [ ] Confirm HubSpot schema is unchanged for Memberspace-owned and Typeform-owned properties

**Phase 2 / M5**
- [ ] Apps Script dashboard loads from the live sheet (not staging)
- [ ] All metrics display correctly against targets
- [ ] Churn-risk list shows name, score, last Slack date only — no email, payment data, or full profile
- [ ] Dashboard URL is tested on at least one other device/browser to confirm access

**Phase 3 / M6**
- [ ] 20 test questions answered correctly in staging Slack channel
- [ ] At least 5 test questions that *should* fail (personal data requests, off-topic, unanswerable) return the correct fallback response, not a hallucinated answer
- [ ] Bot does not return any individual member's personal data in any test response
- [ ] Footer appears on every bot response
- [ ] Up Collective team informed before go-live

---

## Out of scope / future additions

- **Stripe payment-failure early warning** — *deliberate for v1*; HubSpot/Memberspace cancellation data is sufficient. Revisit as v2 when Stripe privacy approach is confirmed.
- **Second Zoom account direct connector** — *deliberate for v1*; meeting attendance flows via Zapier into HubSpot. Revisit if Zapier coverage proves insufficient.
- **Member self-service via Slack bot** — *deliberate*; bot is read-only Q&A only in v1. Future PRD if members want to query their own profile or manage mentorship via Slack.
- **Ops assistant bot (private channel)** — *deferred*; separate PRD once the knowledge base is stable and usage patterns are known.
- **Public-facing or stakeholder dashboard** — *deliberate*; internal only in v1. Future PRD if Up Collective leadership needs a shareable view.
- **Automated publish (no staging review)** — *deliberate and permanent*; staging → live always requires Olivia's explicit approval. This is a safety constraint, not a v1 limitation.
- **Granola → member record link** — *deferred*; Fireflies covers call notes in v1. Future PRD when Granola MCP is available or Granola notes are exported.
- **A/B testing the health score formula** — *deferred*; separate PRD once 8 weeks of scored data exists to validate against actual churn.

---

## Open questions to resolve during implementation

- Which exact Google Docs/Sheets are in the curated knowledge base for the Slack bot? Olivia to provide a list before M6 begins.
- Which Slack channels are in scope for the bot's searchable history? Olivia to confirm the allowlist before M6 begins.
- What is the Luma Plus API base URL and auth method (API key or OAuth)? Confirm in M3 before build begins.
- Where will the custom Luma MCP server be hosted? Options: run locally within Claude agent, deploy as a hosted endpoint. Needs a decision before M3 build.
- What is the exact Google Sheet ID and tab naming convention for the Up Club Reporting sheet? Needed in M2 before any write is attempted.
- What is the private Slack ops channel name where the agent posts the staging-ready notification?

---

## Pre-mortem flags

**Technical risks (will the build itself fail?)**

- **Slack Waves data structure:** The Slack MCP returns messages from channels, but Waves is a third-party analytics layer on top of Slack. If Waves stores its data outside Slack (i.e. not readable via the Slack MCP), the per-member post recency signal will be missing. Catches in M2 connector verification.
- **Email join key gaps:** If Fireflies call participants are logged under a different email than their HubSpot contact (e.g. personal vs work email), the join will fail silently. The `no_data` safety rule protects the score, but coverage will be lower than expected. Catches in M4 data join spot-check.
- **Luma API rate limits:** The Luma Plus API may have rate limits that affect a full guest-list pull for large events. Needs verification in M3 before building the sync loop. Flag as `[UNVERIFIED - confirm in M3]`.
- **Apps Script execution time limit:** Google Apps Script has a 6-minute execution time limit for free accounts (30 min for Workspace). If the dashboard queries are slow against a large sheet, it may time out. Catches in M5 testing.
- **HubSpot API read limits:** HubSpot's free/starter tiers have API call limits. If the agent runs across 1,000+ contacts with multiple property reads per contact, it may hit rate limits. Confirm HubSpot plan and API limits before M4 build. Flag as `[UNVERIFIED - confirm before M4]`.

**Strategic risks (will the build achieve the success metric even if it ships?)**

- **Score formula not validated against real churn:** The scoring formula (weights 3/1/2/1/1/2/1/1) is defined but not yet back-tested against actual churn data. If the weights are wrong, the "Churn risk" flag will miss real churners or over-flag healthy members. Mitigation: add a baseline-capture checkpoint after 4 weeks of live scoring — compare flagged churn risks against actual cancellations. Catches in the Out of scope item "A/B testing the health score formula."
- **Monday review step becoming a bottleneck:** If staging review takes >10 min regularly (e.g. because flags need investigation), the time saving is eroded. Mitigation: the "what changed" summary is designed to make the review fast. Monitor actual review time in weeks 1–4.
- **Slack bot adoption:** If members don't know the bot exists or don't trust it, it won't be used. The PRD doesn't include a launch announcement. Add a one-time #general post explaining the bot before go-live (out of scope for this PRD but worth flagging).

---

## Research grounding

- Luma Plus API availability confirmed by user (Luma Plus plan active). API endpoint details to be verified in M3 — `[UNVERIFIED - confirm base URL and auth in M3]`.
- HubSpot API rate limits vary by plan tier — `[UNVERIFIED - confirm plan and daily call limit before M4 build]`.
- Google Apps Script execution time: 6 min (consumer), 30 min (Google Workspace) — from Google documentation; verify against Olivia's account type before M5 build.
