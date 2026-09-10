# How we use Mailchimp

Mailchimp sends: **big campaigns, selling, the WCU newsletter.** (HubSpot does targeted sends and nurture flows → `hubspot.md`.)

Segments and email-programme state below harvested 8 July 2026 from the Liv Handover doc (Jan 2026).

## Where the email programme is at (Jan 2026 candour)

"Our emails aren't amazing but that's okay for now." Current priorities: get out of spam, send more segmented, stop cramming emails with info, look more professional. Prior CRM projects for reference: Up World Email Audit (Aug 2024), Up World CRM audit (July 2025, Zoe and Kendra — produced the current master template).

## Templates and assets

- **Master template** lives in Mailchimp templates (from the 2025 CRM project). Old campaign emails need remaking into it as they come up for reuse — budget time for this.
- Email banners and "wonky blobs" graphics: Canva decks (links in the handover doc and WCU format doc).

## Segment taxonomy

> ⚠ **STALE — do not build sends off this table without checking.** Verified against the live
> account on 3 Aug 2026 (all 342 segments listed via `GET /lists/{id}/segments`): **none of the
> `[Engagement]` segments below exist**, and neither do `[EXCLUDE] Bounce Segment` or
> `[EXCLUDE] Never Engaged`. What actually exists and is usable for engagement/suppression:
> `Most engaged` (saved, 932) · `Unengaged` (128) · `Rarely/ Bounced` (886) · `In a flow` (1094) ·
> `[EXCLUDE] Cancelled / Paused Members` (425) · `full database exclusion` (1277) ·
> `Subscribed` (saved, 12,493).
> For reference, "everyone subscribed minus all of those" came to **9,617** on 3 Aug 2026.
> Liv still needs to confirm what the intended engagement tiers map to before this table is
> rewritten — the section below is kept only as a record of the original intent.

Engagement segments (always include the first four in newsletter sends):

| Segment | Meaning | Send policy |
|---|---|---|
| [Engagement] is new | Newer subscriber showing engagement | All newsletter comms |
| [Engagement] is often | Engages often | All newsletter comms |
| [Engagement] 30 Days Engaged | Opened/clicked in the last month | All newsletter comms |
| [Engagement] 60 Days Engaged | Opened/clicked within the last ~20 campaigns | All newsletter comms |
| [Engagement] 90 Days Engaged | Opened/clicked in the last 3 months | Twice a month, best newsletter only (plus the always-include segments) |
| [Engagement] is sometimes | Some signs of engagement | Once a month, best newsletter only |
| [Engagement] is rarely | Barely engaged | Big announcements ("doors open") and high-value offers only |

Common segments:

| Segment | Meaning | Notes |
|---|---|---|
| **seductive** | Paying Up Club member | Members comms (incl. WCU) |
| Paying Big Up Club member | | Members comms |
| Senior Marketer in aud | | Can get BUC and UC campaigns (sign up their team) |
| Junior Marketer in aud | | Never send BUC campaigns |
| On the Up Club Waitlist | | Excluded from all comms during launch periods |

Exclude segments: [EXCLUDE] Bounce Segment (marked "cleaned" — exclude always) · [EXCLUDE] In A Flow (currently in the welcome flow — exclude from campaigns) · [EXCLUDE] Never Engaged.

Merge tags used in footers: `*|CURRENT_YEAR|*`, `*|LIST:COMPANY|*`, `*|UPDATE_PROFILE|*`, `*|UNSUB|*`.

---

# Building emails in Mailchimp from Claude (API workflow) — set up 14 Jul 2026

Claude can build finished, on-brand email **drafts** in Mailchimp directly via the Marketing API. **Draft-only — a human always reviews and sends.**

**Access:** direct API key at `~/.mailchimp_key` (data centre `us17`), main list "Up World" `db462cb289`. Auth = HTTP basic `anystring:<key>` (never print the key). Do NOT use the Mailchimp AI-agent connector — it only does multi-channel plans and fabricates testimonials/stats.

**Reusable kit** lives in `mailchimp-email-kit/` (this folder): `master-template.html` (source of the Mailchimp template), `make-blob.py` (photo → wonky-blob renderer), `wonky-blob.svg` (canonical blob shape).

## Template hierarchy
- **Up World master = general, reusable.** In Mailchimp as **"Up World — Master Template (general)", template id `11604777`.** 660px wide (matches OG emails). It's a **classic template with `mc:edit` regions** → click-to-edit in Mailchimp AND fillable via API.
- **Sub-versions (e.g. Brand Manager Bootcamp)** = start from the master, swap the header logo, fill the content. Keep only the blocks you need, delete the rest.
- 13 editable regions: header_heading, header_button, intro, cta_top, testimonial (one — duplicate for more), textimage, benefits, lavender, mint, quote, closing, cta_bottom, signoff. Optional coloured blocks: peach benefits, lavender rounded, mint attention, pink quote, text+image split.

## Brand assets (hosted on Mailchimp — reuse these URLs)
- Up World roundel (pink): `mcusercontent.com/e694a652bd53e2b99566a44b0/images/9d56a67c-5ed6-f583-5746-8d4beddd78fc.png`
- BMBC white logo, cropped (no roundel): `.../images/429b2aac-aec8-878c-cb82-19916fed0250.png`
- Colours: navy `#16173d`, pink `#ea526d`, peach `#feebe5`, mint `#e3fef5`, lavender `#ebeeff`, grey `#f4f4f4`. Font **Open Sans** (Arial fallback) — confirmed in Email 5 build Jul 2026. Buttons = pink pill, 50px radius.

## Wonky blob images
- Email clients can't render live SVG, so: mask the photo into the blob via SVG `clipPath`, then **render to a transparent PNG with headless Chrome** (`make-blob.py` — no PIL/cairosvg on this machine, Chrome is the rasteriser), then host on Mailchimp and use as an `<img>`.
- Working Chrome flags: `--headless=new --default-background-color=00000000 --force-device-scale-factor=2 --window-size=643,648 --screenshot=out.png file://render.html`.
- Blob shape = one vector path in `wonky-blob.svg` (~643×648), exported from Liv's Canva "Claude - Up World WOnky Blob images".

## Photos (the one manual step)
- Real event photos live in Google Drive **"Community Pics"** (folder id `1zihT4uobd8jpVINoq3e_I2R8Uc0DFtqM`).
- Claude **cannot pull pixels** from Drive or from chat attachments. So Liv saves chosen photos into `~/Downloads` with clear names (e.g. `header.jpg`, `gabby.jpg`) and Claude reads them from there.
- Header photo = full-bleed background (resize ~1400px wide, then host). Testimonial/grad photos = blob-framed.

## BMBC campaign segments
**Send to:** [ENGAGEMENT] 30 Days Engaged

**Exclude:**
- all senior marketers in audience
- All Senior Marketers (Members and Non Members)
- Senior Marketers (Whole database) 2025
- [EXCLUDE] Bounced Segment
- [EXCLUDE] In a flow
- Start-Up Marketing Accelerator Grads
- BMBC Grads
- BMBC Grad
- Brand Manager Bootcamp Sept 2026 (already purchased)

## From name
- Lottie-voiced emails: `from_name` = **"Lottie at Up World"** (not just "Lottie")

## How to fill / build via API
1. Create campaign: `POST /campaigns` with `settings.template_id` = 11604777.
2. Fill regions: `PUT /campaigns/{id}/content` with `{template:{id:11604777, sections:{region_name:"<html>"}}}`.
3. One-off fully-coded email: `PUT /campaigns/{id}/content` with `{html:"..."}` — but this becomes custom-HTML (editable only in code view), so prefer the template route for editability.
4. Host images: `POST /file-manager/files` with base64 → returns an `mcusercontent.com` URL. (The Claude preview pane only renders web-hosted images, not local files.)

## Gotchas
- **The master template's CTA buttons are hardcoded `href="#"`.** `mc:edit` on an `<a>` only
  replaces the *inner text*, never the `href`. Fill the template via the API and every button
  ships pointing at `#`. Since template-locked campaigns also reject raw HTML (see below), the
  fix is: build the final HTML from the local `mailchimp-email-kit/master-template.html`, swap
  the hrefs there, and push it to a campaign created with **no** `template_id`. Cost of that
  route: the campaign becomes custom-HTML (code-view editing only, no click-to-edit).
  Found the hard way on the Up Talk build, 3 Aug 2026.
- **Emptying an unused `mc:edit` region does not remove its images.** Setting `testimonial` and
  `textimage` to `""` left two orphan photos floating in the email. Delete the whole `<tr>` block
  from the template source instead of blanking the region.
- **New drag-drop builder designs are NOT API-readable.** The 2025 master template (id `11603910`) was built in the new builder, so the API only sees stock boilerplate — that's why we built a fresh classic coded template.
- Classic template + `mc:edit` = editable + fillable. Custom-HTML = code-edit only.
- Editable **images** in the classic editor can balloon to full width — keep testimonial photos fixed-size (swap via API at build time); text stays click-to-edit.
- **Template-locked campaigns silently reject raw HTML.** If a campaign has a `template_id` set, `PUT /content` with `{"html":"..."}` returns 200 but the GET always reverts to the template-generated HTML — changes never stick. Fix: create a new campaign via `POST /campaigns` with no `template_id` and push raw HTML to that instead. Always verify with a GET after every PUT — don't trust the PUT response alone.
- **Don't force explicit height on email images.** Setting `height="590"` (or any fixed px) stretches images whose natural proportions don't match. Fix gaps at source by re-cropping the image rather than constraining via HTML attributes.
- **Always send a test email to check the live HTML** — Mailchimp's preview pane can show stale/cached content. "Send a test email" always reflects what's actually in the campaign.
- **"Hey gang," in test emails** = Mailchimp substituting its default FNAME fallback. Not a bug — real sends show each subscriber's first name. Change the fallback in audience settings if needed.
- **Canva header button text is baked into the image.** The CTA in the header graphic (e.g. "I WANT TO LEARN") is part of the Canva export — separate from the HTML CTA buttons below it. If they need to match, re-export the Canva graphic.

## Email header graphic layout rules (Canva)
Headers live in the "Up World email Headers (Mailchimp)" Canva file (`DAHPSjLy4nk`). When building or editing one, apply these layout rules:
- **Equal edge spacing:** logo distance from the top of the photo = button distance from the bottom. Same gap top and bottom.
- **Equal internal spacing:** gap between logo and headline = gap between headline and button. Consistent rhythm throughout.
- **All elements centred horizontally:** logo, headline text, and button all centre-aligned.
- When the headline text is longer than the original, reduce font size to maintain 3 lines max, then rebalance positions so spacing stays equal.
- Brief format for future builds: "photo background, BMBC logo centred top, [headline] centred middle, [CTA text] pill button centred bottom, equal spacing throughout."
- **Canva export gotcha:** Canva pages export at full page height (e.g. 1123px) even when the design only fills the top portion. Always crop the exported PNG to the visible photo area before uploading to Mailchimp — use the stdlib PNG crop script in this session or sips. Uncropped = massive white gap below the header image in the email.

---

# Building an engagement segment via API — set up 30 Jul 2026

"Give me a segment of everyone who clicked an email about X." Mailchimp's own saved segments
can't do this at scale (see gotcha below), so we build it from the reports API and push a
**static** segment.

## Why static, not saved
Saved (auto-updating) segments filter on "clicked campaign X" **one condition per campaign** and
cap out well below the number of campaigns a real topic spans. A static segment is a fixed list
of members — it covers unlimited campaigns, but it's a **snapshot**. Put the date in the segment
name so nobody mistakes it for live, and re-run before each launch.

## The steps
1. **Find the campaigns.** `GET /campaigns?count=1000&offset=N` — paginate, the account is well
   over 1,000. Match on **title AND subject line** (titles are inconsistent; "Acc Course Feb 2026"
   only matches via its subject). Filter to `status == "sent"` — drafts have no data.
2. **Eyeball the list with Liv before pulling.** Keyword matching drags in false positives: a
   general newsletter that merely mentions the topic in the subject (a click there could be on
   any story), and same-word-different-product campaigns (Start-Up Accelerator vs Marketing
   Accelerator). Show her the matched list and agree exclusions first.
3. **Pull clickers per campaign.** `GET /reports/{cid}/click-details` → link ids, then
   `GET /reports/{cid}/click-details/{link_id}/members?count=1000&offset=N` for each link with
   `unique_clicks > 0`. Dedupe into a set, lowercased. **Don't use `/email-activity`** — it
   paginates over every recipient (10k+ per campaign) instead of just the clickers.
4. **Filter to contactable.** Pull the whole list once
   (`GET /lists/{id}/members?count=1000&offset=N&fields=members.email_address,members.status`)
   and keep only `status == "subscribed"`. Far faster than per-member lookups.
5. **Create and fill.** `POST /lists/{id}/segments` with `{name, static_segment: [first 500]}`,
   then `POST /lists/{id}/segments/{sid}` with `{"members_to_add": [...]}` in **batches of 500**.
   Verify with a GET on the segment's `member_count`.

## Expect heavy attrition
Roughly **35-40% of historic clickers are no longer contactable** on a 3-year lookback —
unsubscribed plus cleaned (hard-bounced, usually people who left the company their work email
belonged to). Always report the breakdown, not just the final number: the raw click count looks
much healthier than the sendable one.

## Reference build
- **Accelerator clickers 2023-26** (30 Jul 2026): 37 sent campaigns Jan 2023 → Mar 2026,
  1,741 unique clickers → 427 unsubscribed, 242 cleaned, 1 off-list → **1,071 in the segment**
  (id `8363152`, list `db462cb289`). Excluded a general "Coming Up This Week" newsletter and the
  2023 Start-Up Accelerator R2 launch (different product).

## Reference build
- BMBC Sept 2026 Email 4 (grad stories) built this way: header (workshop photo + BMBC rocket logo + "Everything you need to know but were never taught" + RESERVE YOUR SPOT), three grad testimonials in wonky blobs (Gabby / Rachel / Elena), pink dividers, £899→£999 price. Draft sits in the account.
- ⚠ Test drafts + test images left in the account from the build session (titles prefixed "ZZ TEST") — not deleted, Liv said leave them.
