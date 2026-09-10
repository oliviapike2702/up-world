# Launch funnel dashboard

One self-contained build project — internal structure follows the PRD's own build stages
(M1 → M6), not the usual product/marketing/reporting/admin split. Don't reorganize this folder;
add new stages/files in the same M-numbered pattern instead.

## Tracker sheet retired, 25 Aug 2026

The original tracker Sheet built in M3 (`1YAbXlqY6nLFV15XBhQIx20LM0CUspe6GuQJPAvVUWNE`) is
retired — Liv found its layout hard to read and asked for a redesign, consolidated into her
main Project Plan sheet instead of living separately. Live tracker now:
[Project Plan sheet, "Funnel Tracker" tab](https://docs.google.com/spreadsheets/d/1i0lodYSJj_-80SfwCE6VNWiTiUz8CMBH2nmVx4uAsnU/edit?gid=1119754560).
Old sheet is renamed and banner-flagged, not deleted — kept for historical reference.

Weekly writes now go through `m4-scripts/weekly-pull-v2.js`, not `sheets-write.js` or the
skill's `refresh-dashboard.js` (both retired, left in place for reference — the old
`refresh-dashboard.js` also had a real bug where "accepted" counted entries into "Acceptance
sent" rather than the interview stages, which the new script fixes).

**M5 dashboard rebuilt, 25 Aug 2026.** `m5-scripts/generate-dashboard.js` now reads the new
"Funnel Tracker" tab (six stages, no more booked calls/offer made/confirmed-will-pay) and
`m5-dashboard.html` regenerates from it. Still a snapshot, not auto-refreshing — re-run
`NODE_PATH=../m4-scripts/node_modules node generate-dashboard.js` from `m5-scripts/` any time
you want it current, then re-publish. Paid-applicant names/companies come from
`hubspot-snapshot.json`, refreshed the same day (5 real paid deals; Danielle Schoop's deal is
flagged with an amount recorded as £0 in HubSpot, a real data gap worth fixing there, not a
dashboard bug).
