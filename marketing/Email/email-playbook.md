# Up World email playbook

The standard the email-marketer agent (and any human) drafts against. Built 14 Jul 2026 by
synthesising the four sent BMBC emails, the TMA launch results, the Up World voice system, and
the Email 4 teaching example. This is the craft layer — reusable across campaigns. Campaign-specific
hard facts (prices, spots, dates) live with each campaign (e.g. `campaigns/2026-bmbc/_results-log.md`),
never here, so this doc doesn't go stale.

> **This is a living document.** Update it after every email we write. New pattern that worked →
> add it. Correction Liv makes on a draft → capture it here so it never recurs. Mistake caught →
> add it to §7 (the failure log is the most valuable section — it's how we stop repeating misses).
> Log the change in the changelog at the bottom. The corrections are the asset, not the emails.

> **The build guide is separate.** This is the craft (what to write and why). How to actually
> build it in Mailchimp — the API workflow, the master template, wonky blobs, hosting, gotchas —
> lives in `../context/how-to/mailchimp.md` and the `mailchimp-email-kit/`. Don't duplicate it here.

**Evidence tags used below:** `[SOLID]` = seen in real sent+approved copy or backed by results.
`[THIN]` = inferred from one example, treat as a hypothesis to test.

---

## 0. Why email matters (the business case)
`[SOLID]` In the TMA March 2026 launch, **email converted applicants to paid at 44%** — 2nd only to
referrals (40%), versus Meta ads at 9%. Email and referral are the quality engines; paid is the
volume engine. Email's job is converting the warm and engaged, not chasing cold reach. Spend the
craft here.

## 1. The one rule that governs everything
`[SOLID]` From the voice master: *if the copy could come from any community on any topic, it has
failed.* Rewrite until it could only be Up World. Every rule below serves that.

## 2. Voice (how it sounds)
Her voice isn't reducible to a few adjectives (and a three-word tag would be a banned tricolon).
It's a set of **moves she makes**, evidenced across her real emails `[SOLID]`:
- **Opens on a personal confession or origin story** — first person, specific, no hook gimmick:
  "When I started managing my first team, aged 24, I had a shock." / "My plan wasn't to start a
  business. I'd moved to Delhi." / "I bet you ARE a good enough marketer to get promoted."
- **Argues from her own CV, with real numbers and named brands**, never borrowed authority:
  "Built 10+ teams." "We've trained over 120 people." Elizabeth Scarlett, Copy Club, Here We Flo.
  Specific numbers everywhere (aged 24, £3k+VAT, 2% of revenue, 2 SPOTS LEFT).
- **Takes an uncomfortable position and states it flat**, no hedge: "1%?! That's honestly nothing."
  "They are going to get increasingly left behind."
- **Dry and self-deprecating, undercuts herself in brackets**: "(who's counting?!)", "at the risk
  of sounding like a faux guru", "weeped with stingy eyes as I chopped onions very slowly".
- **Warm and collective — "I want us to", not "you should"**: "I want us to stop making the same
  mistakes." She stands next to the reader, not over them.
- **Emphasis with the odd CAPS word**, never bold spam ("2 SPOTS LEFT", "a CRAZY amount").
- **Lands on one idea and a low-key ask**: "Got any questions, then hit reply, I'm always happy to
  help." Sign-off "Lottie x" or "L X".

Full authority: `../context/tov/Up World tone of voice.md` (5 pillars). Hard rules: `../context/tov/_spine.md`.

Non-negotiables (`[SOLID]`, and every sent BMBC email obeys them):
- UK English. **No em dashes, ever** (the biggest AI tell). Commas, full stops, brackets.
- Never fabricate a fact, number, date, price, link or quote. Unknown → `[PLACEHOLDER]`.
- Be specific: real numbers, real brands, real names ("Wilton London", "P&G, Unilever, Diageo").
- Talk to one person as "you". Sentence-case headings.
- No hype without backing. If it's hard, say it's hard. Scarcity only when true.
- Don't tell the reader how to feel ("excited to share"). Show the thing.
- Have an opinion, take a side, back it. No "it depends".
- Banned words/structures: delve, leverage, unlock, elevate, seamless, robust, curated, bespoke,
  "not just X but Y", rule-of-three tricolons, "-ing" analysis tags, vague sourcing. Full list in
  the master doc. Run the `humanizer` skill on any AI draft.

Nuance the written rules miss `[SOLID]`, learned from the real Email 4:
- **Rhythmic anaphora is allowed even though tricolons are banned.** Lottie's real copy uses
  "Some people come in... Some come in... Some just come in" for warmth and build. The ban is on
  snappy marketing tricolons ("fast, reliable, secure"), not on parallel repetition that earns its
  length. Don't "correct" this out of good copy.
- **Dry self-aware asides in brackets are on-brand:** "(yes, I have done no other roles, but let's
  go with it)". Keep them.

## 3. Structure (genre-dependent, looser than a funnel)
Two real patterns, not one rigid skeleton `[SOLID]`. The through-line is what matters, not the slot order.

**Sales / course email** (BMBC 1–4): personal or provocative open → the argument, taking its time
(name the problem first: startups don't train marketers, P&G/Unilever/Diageo do) → one repeated
core idea → a scannable details block (weeks, lectures, clinics, price; occasional 👉/🔥 bullets,
sparingly) → CTA once or twice as a plain instruction ("Reserve your spot") → a tight facts block
(kick-off date, cohort size, price) → "Lottie x".

**Story / talk email** (the raffle origin story, the leadership talk, the team-structure talk):
open on a personal story, meander through it to the point, land on one idea and a warm ask (often
"hit reply and tell me your situation"). **No details or facts block** — those only appear when
there's a product being sold.

**The standard is the through-line, not the order:** open on something real and personal, argue
from lived experience, land on one clear idea plus a low-key ask. Don't force the sales skeleton
onto every email — that's how her voice turns into a template she'd never actually write.

Segment the angle, keep the voice `[SOLID]` (BMBC 2/3 did this well):
- **Juniors:** lead with the private pain — "it's not that you lack confidence, it's that nobody
  taught you the frameworks". Professional loneliness, imposter feeling, career progression.
- **Heads-of / founders:** lead with ROI and team development. "Shameless — I'm writing to
  encourage you to invest in putting your team on a course I run." Name the business return
  (better briefs, less back-and-forth, retention). Founders engaged best in BMBC (highest clicks).

## 4. Proof and testimonials `[SOLID]` (from the approved Email 4)
- **Lead with the outcome, not the quote.** "Gabby got promoted from Marketing Executive to Brand
  Manager at Wilton London." *then* the quote as colour. The promotion is the proof.
- **Named promotion beats generic praise.** The approved Email 4 dropped the anonymised "[name]"
  testimonials (Malini, Ellie) in favour of three real promotion stories (Gabby, Rachel, Elena).
- **Introduce a quote, don't dump it.** "She put it like this:" gives it weight. Land it after:
  "That's a promotion. That's what I built this for."
- **Trim quotes** to the sharp part; don't run the whole survey paragraph.
- Testimonial bank (survey scores + named quotes) lives in the BMBC testimonials Drive folder
  (id `1HOgZG8PJcFfMnt_OEMzVxCyfLZPNLXbq`). Survey data supports a real stat (ratings of 8–10,
  high recommend scores) if a numeric proof point is wanted — verify the exact figure before using.

## 5. The look (craft side — full build guide is `../context/how-to/mailchimp.md`)
The technical build (template id, API calls, blob rendering, hosting) is documented in the how-to,
so it isn't repeated here. What matters at the craft level `[SOLID]`:
- Built on the coded master template ("Up World — Master Template (general)"), text auto-filled via
  API, graphics dropped into image slots. BMBC is a sub-version (swap header logo, fill content).
- **Graphics are the human/design step** — hero headers and wonky-blob testimonial cards come from
  the `up-world-design` skill / Canva; text is automated, images are chosen and placed by a person.
- **Always strip unused template blocks before send** — leftover blocks ship Mailchimp's default
  filler ("Repeatable content blocks..."). Real defect caught in the Email 4 draft.
- Brand palette: navy `#16173d`, pink `#ea526d`, peach, mint, lavender. Font Figtree. Pink pill
  buttons. Testimonials framed in the wonky blob. Full asset URLs in the how-to.
- Mailchimp = big campaigns, selling, WCU. HubSpot = nurture flows and cohort weekly emails.

## 6. Measurement — what to trust `[SOLID]`
- **The domain issue suppresses open rates (~6 months, fix expected ~late Jul 2026).** Until the
  fix is confirmed live, **judge every email on clicks, replies, unsubs and sign-ups — not opens.**
  Plain-text sends can't track opens at all (Email 1 shows a false 0%). After the fix lands, note
  the date; don't compare pre/post opens like-for-like.
- Log every send's results to the campaign results log and read it before drafting the next email.
- The `email-sequence` skill's benchmark table (20–70% opens) is wrong for this account right now —
  scaffolding only, not a target.

## 7. Failure modes we've already caught (don't repeat)
- Stale/contradictory numbers in a live draft (Email 4 said "8 left" when it was 12). Verify spots,
  price and dates against ground truth before every send.
- Leftover Mailchimp template filler blocks shipping to subscribers.
- Quote-dumping testimonials with no outcome framing (the pre-edit Email 4 problem).
- Anonymised/generic testimonials over named promotion stories.
- Treating open rate as a real signal while the domain issue is live.
- Over-selling / "feels a bit desperate" chasers — TMA retro: places are *applied for, not bought*;
  scarcity of awarded places is the right urgency, not a price deadline.
- **Compressing Lottie's voice into a short adjective list** (esp. a three-word tricolon). Her voice
  is a set of moves from real copy, not a tag. Characterise it, don't label it. (Caught 14 Jul.)
- **Forcing one rigid email structure.** It's genre-dependent — sales emails have a facts block,
  story/talk emails don't. Match the pattern to the job. (Caught 14 Jul.)
- **Listing benefits / "here's everything you get".** A feature dump (8 lectures, 4 clinics, a
  podcast...) is a hard no. Prove value by *demonstrating* it — teach one real thing so the reader
  feels the depth — never by itemising what's included. (Caught 15 Jul.)
- **Repeating a hook already used in an earlier send.** Each email needs a fresh idea. Don't reuse
  the "gulp moment" or the "it's not confidence, it's frameworks" line (Email 2), the promotions
  (Email 4), etc. Check what's been sent before reaching for an angle. (Caught 15 Jul.)

## 8. Open gaps (resolve before relevant sends)
- **Buyer suppression:** how to exclude people who've already bought from sales sends is unconfirmed.
  Sending a sales email to a paid customer is a trust-eroding error — resolve before any send.
- **Domain-fix date:** unconfirmed. Governs when opens/subject A/B tests become trustworthy.
- **Nzola's sends:** use the Up World "we" / community voice (resolved 14 Jul — no separate Nzola
  voice doc needed).

## 9. Draft process (human-in-the-loop, drafts only)
1. Read this playbook + the campaign results log + the campaign facts.
2. Draft one email. Never send — drafts only, a human always approves.
3. Liv checks four things only: **TOV, key info, look, dates/hard facts.** Everything else is the
   agent's call as the expert.
4. Capture every correction back here or in the voice docs, so the next draft is better. The
   corrections are the asset, not the email.
5. After send, log results (clicks/unsubs/sign-ups) and note one thing to change next time.

---

## Changelog
Every update to this playbook gets a dated line here, so we can see how the standard has learned.

- **14 Jul 2026** — created. Synthesised from BMBC emails 1–4, TMA launch results, the voice
  system and the Email 4 teaching example. Wired to the Mailchimp build guide. First rep;
  §3 angle-split and §2 anaphora nuance flagged `[THIN]`, to test on Email 5.
- **14 Jul 2026** — Liv review of §2/§3. Rewrote §2 from the Lottie email corpus (BMBC founder
  email, Delhi raffle story, leadership + team-structure talk emails) — voice is now characterised
  by her real moves, not a three-word tag. Reframed §3 as genre-dependent (sales vs story/talk),
  not one rigid skeleton. Both lessons added to §7.
- **15 Jul 2026** — Liv review of the BMBC plan. Two rules added to §7: no benefit-dumps (prove
  value by demonstrating, not listing), and no repeating an already-used hook. Substance email
  reworked from a feature list into a teach-one-real-thing email; pain email moved off the
  already-used "gulp moment" onto professional loneliness.
