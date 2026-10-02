# How we use HubSpot

HubSpot runs: **nurture flows and course weekly (cohort) emails.** Also CRM source of truth.

Also in HubSpot (from the Jan 2026 handover):
- **SayHi customer-service inbox** — Conversations > Inbox; tickets workflow → `../../up-club/customer service/inbox-and-process.md`
- **Onboarding workflows** — new members (and a separate, scrappier agency onboarding workflow) auto-enrol on payment
- **Cohort waitlist workflows + segments** — per doors-opening; "Up Club Warm Leads" segment = clicked previous doors campaigns or joined a previous waitlist
- **Reporting segments** — e.g. weekly new Huddle Up attendees (fed by Zapier)
- **Deals board** — agency membership pipeline (and the TMA pipeline)

✓ Partly documented (HubSpot source-of-truth PRD exists). ⚠ Add: flow setup, how course weekly emails run.

## Gotcha: workflow trigger for iframe-embedded forms
If a HubSpot form is embedded via iframe (as on up-club.co), the workflow trigger **"Form
interaction has been completed"** is analytics/cookie-dependent and can silently fail to fire,
even though the form submission and contact record are created correctly. Use **"Form was
submitted"** instead — it's CRM-based and doesn't depend on cookies. Found Sept 2026 while
debugging a workflow that looked broken but wasn't actually missing submissions.
