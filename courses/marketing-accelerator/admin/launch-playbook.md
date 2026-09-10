# TMA launch playbook

The canonical, reusable playbook for launching a Marketing Accelerator cohort. Built 8 July 2026 from the March 2026 launch record (`../marketing/`, `../reporting/`) plus Liv's retro decisions. Timeline is T-minus: **T-0 = the IRL kick-off day**. Roles are slots; September 2026 owners are named in brackets. Update the decision log each cohort.

## Decision log — September 2026 retro (8 Jul 2026, Liv)
1. **Speed-to-call**: automate the whole application → messaging → booking path. Application thank-you flow ends with a Calendly link framed as "if you're approved, select a slot for your interview" (keeps the apply-for-a-place positioning while killing the wait that lost people in March).
2. **Urgency = places-scarcity**, led throughout ("X of 25 places awarded"). Early-bird price survives quietly for self-funders; no emails built around it.
3. **No revivals**: no deposit scheme, no £100 referral bonus, no grad Q&As. Keep the machine simple.
4. **Restore two emails** March skipped: grad stories, and the last-week/last-day deadline pair.
5. **HubSpot is the only source of truth.** No hand-updated applicant sheet, ever.
6. **Keep Typeform** (revisit Team Tailor for 2027).
7. **Fix GA4 properly in August** (events on TMA page + thank-you page; build the "viewed webpage → warm lead" HubSpot capture that has never existed). ⚠ Needs a named owner.
8. **Roles**: Liv runs the launch; Nzola owns ops (the old Marc role); Lottie helps with interviews.
9. **Ads = Adelle's plan**: ~£1K on quiz (data/retargeting only), rest of ~£4K on direct, Lottie UGC filmed before ads go live. The quiz follow-up email gets written and owned as part of the sequence.
10. **Target: 25 paid at £1,390 EB / £1,490 FP exc VAT** (March delivered 22).
11. **Dates**: pencilled late Sept kick-off; calendar below is PROVISIONAL until confirmed.

## Roles (slots)
- **Launch lead** [Liv]: owns this playbook, the calendar, emails, weekly reporting, decisions.
- **Ops** [Nzola]: pipeline hygiene in HubSpot, chaser ladder (WhatsApp → LinkedIn → voicenote), interview scheduling, Luma, calendar invites, onboarding admin. Everything in the March "Marc" column.
- **Face** [Lottie]: the two talks, interview support, LinkedIn DMs from her account (via Heloise), UGC ad video, deployed on stubborn warm leads.
- **Paid ads** [Adelle]: Meta direct + quiz, weekly Monday report.
- **Design** [Amy]: cohort graphics, testimonial/new-member assets, TMA arrow logo on everything.
- **Finance** [Hana]: payment-plan contracts before any plan starts.

## Targets and funnel model
25 paid. Funnel benchmarks (from the model + March actuals): form views → 55% start → ~20% complete → ~72% accepted → **the leak: accepted → paid** (86% → 41% → 25% over the last three cohorts; everything in decisions 1, 2 and 4 attacks this). Watch weekly against a cumulative paid target; report every Thursday off HubSpot, in Slack.
Start every launch with the warm pools, in order: "Interested in next cohort" + "Decided to pull out" deals from last cohort → sold-out waitlist Typeform sign-ups (new September asset) → warm/medium-warm HubSpot lists.

## Master timeline (T-minus weeks; March 2026 ran this over 13 weeks, September compresses to ~9)

### Set-up phase (T-9 to T-7) — the unglamorous fortnight that decides everything
1. **Asset audit** (new, from March pain): sweep every live touchpoint for last-cohort leftovers: webpage CTA + dates, Typeform dates/questions/testimonial, ALL HubSpot workflow emails (copy, prices, Shopify links, senders, images), thank-you page, email signatures. March shipped a wrong-price email and a broken buy button; this audit is why.
2. **Workflow test pass** (new, from March pain): run 2 dummy applicants end to end (one partial, one full) before doors open. Check: right emails fire at right stages, paid people exit reminder flows, deals auto-create with £1,490 value, everything logs.
3. Sort warm-lead lists; tag old course members; block list for applied people.
4. Wire Typeform → Zapier → Slack + HubSpot deal; speed-to-call Calendly flow on approval (decision 1).
5. Shopify payment pages; payment-plan contract process confirmed with Hana.
6. GA4 fix + webpage-view warm-lead capture (decision 7).
7. Book both Lottie talks (Luma + Zoom + calendar WITH Zoom link in the invite); send decks early.
8. Budget, targets, this calendar agreed. Brief Nzola on the ops runbook; brief Adelle; Lottie films UGC.

### Marketing phase (T-7 to T-4)
- T-7: **Doors open.** Launch email + warm-pool outreach first. Ads go live (UGC ready). LinkedIn launch posts (company + team + Lottie).
- T-6: Push Lottie talk 1. Segmented emails: Train your team (seniors) / Time to level up (mid-levels).
- T-5: **Lottie talk 1** (target 130 sign-ups). Run-sheet: `../marketing/campaign-plan.md`. Next-day recording email + Lottie DMs to hot attendees.
- T-4: Scarcity milestone email ("X of 25 places awarded") replaces the old early-bird arc. New-member graphics start as people pay.

### Selling phase (T-4 to T-1)
- T-3: Grad stories email (restored). Push Lottie talk 2. Weekly scarcity counts in all comms.
- T-2: **Lottie talk 2** + conversion follow-ups. **External deadline** comms: last-week email (restored).
- T-1: Last-day email (restored). WhatsApp everything. Abbie-style phone sweep of unresponsives. **Internal deadline** ends the week: the buffer week of quiet hustling, "drop-out" scarcity email only if needed.

### Enrolment + kick-off (T-1 to T-0)
Per payment: confirmation comms (March gap — now exists), calendar invites, Drive, Slack, membership coupon. Group-coaching capacity maths BEFORE kick-off (22 people ≠ 20 slots again). IRL day per the run-sheet + Jonny's venue retro doc.

## Email sequence skeleton (September, post-retro)
Warm-pool opener → Development plan email (March's best: 70% opens, send to the engaged segment) → Launch "doors open" → Talk 1 promo + reminder → Train your team / Time to level up split → Scarcity milestone ("X of 25 awarded") → Podcast reveal (optional) → Grad stories → Talk 2 promo + reminder → Last week → Last day → (buffer: drop-out email only if needed). Plus per-talk recording + takeaways emails, plus the quiz-ad follow-up email (owned, decision 9), plus the post-interview funnel comms calendar (Lottie's ask: pre-written "% of places confirmed" touches so chasing isn't manual).
Voice: apply-for-a-place language, never buy-a-ticket; scarcity of awarded places, not discounts; no desperation. All sends filed into a named Mailchimp folder per cohort (March 2026's never were: finding them cost real work).

## Sales motion (per applicant, September version)
Typeform → auto: Slack post + HubSpot deal (£1,490) → qualified by job title (MM/SMM = hot) → auto-email: "if you're approved, select a slot" Calendly → interview (Lottie/Liv, 10 to 15 min, phone; know the course contents; offer grad intros) → Acceptance sent: automated payment-link email → 10-day reminder → WhatsApp task → Paid → onboarding checklist. Chaser ladder on stalls: WhatsApp → LinkedIn → voicenote → phone sweep. HubSpot stages are the only tracker (decision 5).

## Reporting
Thursday Slack update from HubSpot: paid (cumulative vs target), accepted-awaiting-payment, interviews booked, applications by source, scarcity count for next week's comms. Adelle's ads report Mondays.

## September 2026 provisional calendar (all dates shift with T-0; confirm kick-off first)
- T-0 kick-off: PROVISIONAL late Sept (assume Wed 23 Sept until confirmed)
- Set-up complete / doors open: ~mid-Aug · Talk 1: ~late Aug · Scarcity milestone: ~early Sept · Talk 2 + external deadline: ~mid-Sept · Internal deadline: ~week before kick-off
- Which means set-up starts ~28 July. ⚠ Three weeks away.

## Open flags
- [PLACEHOLDER] September cohort dates (kick-off, course Wednesdays, grad dinner) — everything above re-anchors on this
- [PLACEHOLDER] GA4 fix owner (in-house vs freelancer brief)
- [PLACEHOLDER] Lottie's September interview capacity ("helps out" vs March's all-interviews) — affects Calendly gating
- Rotate the app passwords sitting in the old handover doc; move to a password manager
