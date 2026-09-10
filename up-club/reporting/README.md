# reporting — weekly metrics + monthly member/churn reporting for Up Club

Weekly framework (every Monday, into the "Up Club Reporting" sheet): `weekly-reporting.md` ✓

Monthly churn analyses for the community health OKR (KR2: churn under 75/quarter,
agency churn max 1/quarter, insights from 50% of cancelled members).

Live data sources (pull fresh each month, don't copy in):
- Cancellations sheet: "Up World Leaver Feedback", tab "2026 Automation" (row per cancellation via automation)
- HubSpot: contact properties `cancellation_date` + `cancellation_reason` (11-option taxonomy), dashboard "cancellations by month and cancellation reason"
- Win-back results: Nzola's updates in the cancellations Slack channel

Conventions: exclude Big Up Club memberships (Abbie's, reported separately), dedupe on
email + cancellation timestamp, categorise with the HubSpot taxonomy, report gross and
net-of-win-backs.

Files:
- `june-2026-churn-analysis.md` ✓ (visual dashboard: https://claude.ai/code/artifact/c38f24f2-4ac3-479b-a41c-9f8210a3863b)
- `may-2026-cohort-event-attendance.md` ✓ (KR: 30% of cohort attend an event; sources: cohort sheet Activity Tracker + HubSpot `huddle_up_attendance`)
- `up-talks-jul25-jul26.csv` ✓ (every Up Talk Jul 2025–Jul 2026: Luma sign-ups × HubSpot attendance × show-up rate; Luma pulled via public calendar API `cal-SEqf4MlnD5yHLjO`; visual page: https://claude.ai/code/artifact/292faaaf-1fcc-4630-a16f-e77fcdee2084)
- `up-club-hubspot-source-of-truth-prd.md` ✓ (working PRD, HubSpot-as-source-of-truth build, M1–M7, draft 2026-06-29)
- `up-club-hubspot-diagrams-15jul2026.pdf` + `.md` ✓ (Chay's architecture diagrams and 15 July status snapshot for the same initiative — see the `.md` for what's live vs. still to build; commercial-layer findings moved to `up-club/customers/hubspot-commercial-opportunities.md`)
