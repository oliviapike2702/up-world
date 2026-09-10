# May 2026 cohort — event attendance KR

Prepared 8 July 2026 for the June monthly review. KR: 30% of the May cohort attend an event
(Up Talk, Huddle Up or PD workshop).

## Headline

**39 of 67 cohort members (58%) have attended at least one event. Target is 30% — met at
nearly double.** Even on the most conservative floor (PD workshops + the stale Up Talk column
only, ignoring HubSpot Huddle Up data entirely), it's 22 of 67 (33%) — still over target.

| Source | Count | Where the data lives |
|---|---|---|
| PD workshop | 19 | May 2026 Cohort sheet, Activity Tracker col I |
| Huddle Up (attended, past-dated) | 31 | HubSpot `huddle_up_attendance` contact property |
| Up Talk | 5 | Activity Tracker col L — STALE (Zapier broke ~June) |
| **Any of the above** | **39 (58%)** | |
| + future Huddle Up registrations + any Zoom webinar | 44 (66%) | upper bound |

Denominator: 68 rows in the Activity Tracker minus Liv's own staff row = 67.

## Caveats and data notes

1. **Denominator is the tracker, not the HubSpot segment.** The official cohort is the
   'Up Club May Cohort 2026' list in HubSpot — needs reconciling (list ID required to query it).
2. **`huddle_up_attendance` appears to log registrations, not confirmed attendance** — it contains
   future-dated events (15/07, 29/07, even 13/08). Past-dated entries were counted as attended;
   some may be no-shows. The companion property `total_number_of_of_huddle_ups_attended` is not
   being maintained (0 for people with entries).
3. **Up Talk attendance is the gap.** Marketing events exist in HubSpot (85 of them, all Up Talks
   included) but attendee lists aren't reachable through the CRM connector, and the tracker column
   died with the Zapier. The 5 counted are certainly an undercount — which only strengthens the KR.
4. Every one of the 68 tracker emails matched a HubSpot contact — no orphans.

## Fix options for Up Talk tracking (pick one)

- **HubSpot active list per quarter** ("attended any marketing event"), then query by list ID —
  no Zapier needed, works with this connector ongoing.
- **Read attendee lists via browser** from the marketing events pages — works now, manual-ish.
- **Repair the Zapier** feeding the Activity Tracker — restores the sheet as the single view.
