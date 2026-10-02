# BMBC 2026 — email results log

Performance record for the Brand Manager Bootcamp (Sept 2026) email campaign only.
The email-marketer agent reads this **before drafting the next email** so recommendations
(subject style, send time, audience, testimonial choice) are based on what actually worked
for this list, not generic best practice.

**How to use:** after a campaign sends, pull its report via the Mailchimp API
(`GET /reports/{campaign_id}`, key at `~/.mailchimp_key`, us17) and add a row + a short
"what we learned" note. Never overwrite past rows — this is an append-only record.

**List:** Up World, list_id `db462cb289`.
**Course:** starts 3 Sept 2026 · 20 spots · early bird closed 14 Jul 2026 with **8 sold → 12 left**.
**Final close:** 29 sold against a target of 20-25 — sold out and over-subscribed.

---

## Sent campaigns

| # | Sent | Subject | Audience (sent to) | Open rate | Click rate | Unsubs | Campaign ID |
|---|------|---------|--------------------|-----------|-----------|--------|-------------|
| 1 | 12 Jun 2026 | Brand Manager Bootcamp is BACK | Full database (11,296) | n/a* | 1.2% (131) | 44 | 07fecb12c4 |
| 2 | 3 Jul 2026 | It's not that you lack confidence | Juniors (1,594) | 29.4% (466) | 1.5% (69) | 9 | caba4d95c8 |
| 3 | 7 Jul 2026 | Who taught your brand manager how to do their job? | Heads of / founders (1,376) | 38.7% (532) | 2.2% (83) | 4 | f17d24cc1d |
| 4 | ~14 Jul 2026 | Three promotions since the last cohort | Non-buyers 30 Days Engaged (4,173) | 67.4% (2,804) | 2.5% (292) | 15 | 9b60faa276 |
| 5 | 28 Jul 2026 | How to explain creative briefs to a 10-year-old | 30 Days Engaged, seniors/buyers excluded (3,868) | 71.1% (2,743) | 1.1% (127) | 14 | 0d264a4a77 |
| 6 | 14 Aug 2026 | You have 8 hours in a day but 20 hours of work | BMBC Openers Aug 2026 (2,615) | 80.1% (2,091) | 1.7% (208) | 8 | b7490dee1c |

\* Email 1 was sent plain-text. Mailchimp can't track opens without an HTML pixel, so the 0%
is a tracking artefact, not a real result. Judge Email 1 on clicks and unsubs only.

> **IMPORTANT — read before trusting any open rate here.** Up World's open rates have been
> artificially suppressed for ~6 months by a sending-**domain issue** (fix expected ~late Jul
> 2026). Every open rate in the table above is depressed by that, not by the subject line or
> content. Until the domain fix is confirmed live, **judge these emails on clicks, replies,
> unsubs and sign-ups — not opens.** After the fix lands, note the date; don't compare
> pre-fix and post-fix opens as like-for-like.

## What we've learned so far

- **Plain text kills open tracking.** Email 1's "0% open" is meaningless — it was plain text.
  If open rate matters as a success measure for a given email, it has to go out as HTML.
  Plain-text sends can only be judged on clicks, replies and unsubs.
- **The heads-of / founders segment (Email 3) is the strongest engager**: 37.9% open, 2.1%
  click — best of the three, and the lowest unsub rate. The decision-maker audience is paying
  more attention than the juniors. Worth weighting future BMBC angles toward the "should I send
  my team member" framing.
- **Juniors (Email 2) opened well (27.7%) but clicked low (1.5%).** They're reading but not
  acting — a price/commitment hesitation, consistent with early bird now closed at only 8 sold.
- **Unsubs dropped as the sequence went on** (44 → 9 → 4 → 15 → 14). The spike at Email 4 is proportional to the larger send size — the rate stayed low.
- **Email 4 (grad stories) is the standout**: 67.4% open, 2.5% click (292 clicks) on 4,173 sent. Social proof with real names and numbers is the strongest lever in this sequence.
- **Email 5 opened best of all at 71.1%** but clicked lowest (1.1%, 127 clicks). High curiosity, lower action — possibly the creative briefs angle felt less directly actionable than grad stories.
- **Opens have risen sharply since Email 3** (38.7% → 67.4% → 71.1%), which likely reflects the domain fix landing in late July 2026. Don't compare pre- and post-fix opens as like-for-like.
