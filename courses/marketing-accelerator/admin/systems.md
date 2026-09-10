# TMA — systems and tech setup (as of March 2026 cohort)

The plumbing behind a launch. Every cohort, all workflow emails need updating: dates, Shopify links, sender names, images, form names on triggers, the WhatsApp task assignee.

## HubSpot deal pipeline: "The Marketing Accelerator" (id 888214769)
Stages and automations (workflow ids from the handover doc):
| Stage | Trigger | Automation |
|---|---|---|
| Partially Applied | auto, half-completed Typeform | wf 1744130235: instant email; if still no apply, LinkedIn DM |
| Applied | auto, completed Typeform | wf 1743225059: "thanks for applying" email |
| Arranging interview | manual | task created to WhatsApp with Calendly link |
| Acceptance sent | manual, post interview | wf 1746188478: Shopify payment-link email → 10-day reminder → WhatsApp task |
| Paid | manual once paid | none |
| Not right / Too junior | manual rejections | wf 1879705836 / wf 1843056844 |
BMBC uses an identically-shaped pipeline (stages cloned), so this design is already the cross-course standard.

## Lead capture → warm-lead tag → nurture (HubSpot)
- Mailchimp clicks on campaigns titled "Accelerator": wf 1746578622
- Viewed application Typeform: wf 1746631919
- Completed Meta quiz ad: wf 1835640023
- Viewed TMA webpage: NEVER BUILT (GA4 tracking was broken; still to create)
- Nurture flow: wf 1534840819 (see `emails.md`)
- Course-member lecture email flow: wf 2052622585. Member lists: March 2026 list 3590; 2025 list 2987. Warm leads list 3547; medium warm list 3546.

## Tool map
- Typeform: application form (partial capture after contact fields; needs date/question updates per cohort)
- Zapier: Typeform → Slack + HubSpot deal; Luma talk sign-ups → HubSpot lists (zaps 343212769, 343209147)
- Shopify: buy-button cart links for EB/FP; coupon codes (charity 50%)
- Mailchimp: campaigns, segments, "Accelerator Emails" folder
- Luma: talks + group coaching (coaching admin "is weirdly messy": post next session immediately, fill a week ahead)
- Zoom (hosts account): lectures/talks · Vimeo: recordings · Calendly: interviews · Community Phone: WhatsApp · Canva: all graphics (use the TMA arrow logo on everything) · Google Drive: course home · Memberspace: membership coupon
- Webpage: up-world.co/the-marketing-accelerator (+ thank-you page); dates/links need updating per cohort; GA4 needs fixing properly

## Per-cohort setup checklist (condensed from Dec 2025 set-up phase, all owners as slots)
1. Sort previously-interested lists in HubSpot/Mailchimp; tag old course members
2. Update Typeform (dates, questions, testimonial at start); re-link Zapier → Sheet/Slack/HubSpot
3. Update all HubSpot workflow emails (copy, dates, Shopify links, senders)
4. Website edits: dates, Typeform links, fresh testimonials; thank-you page
5. Build warm-lead capture automations (email click, Typeform view; ADD webpage view once GA4 fixed)
6. Set up HubSpot deals pipeline for the cohort; Mailchimp block list for applied people
7. Shopify payment pages; payment-plan contract process (Hana)
8. Interview Calendly link; brief whoever does interviews and WhatsApp chasing
9. Course budget; sales and marketing targets; marketing plan Dec to March
10. Book both Lottie talks (Luma, Zoom, calendar with Zoom link IN the invite, decks to Lottie early)

## Security note (do not lose)
The handover doc contains shared app passwords in plaintext. Credentials are deliberately NOT copied into this workspace. Recommend rotating them and moving to a password manager.
