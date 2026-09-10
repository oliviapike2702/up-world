# Course Sales Pipeline Agent — spec & learnings

**Status:** v0 spec (not yet built as a skill) · **Written:** 3 August 2026 · **Owner:** Olivia Pike
**Scope:** Course sales pipelines in HubSpot — built on Brand Manager Bootcamp (BMBC), designed to also run The Marketing Accelerator (TMA) and future cohorts.

This is the pre-build spec. It captures everything learned from manually running the BMBC pipeline clean-up on 30 Jul–3 Aug 2026, so the skill can be built from it rather than rediscovering it. When it graduates to a skill it lives in `.claude/skills/`; the reusable thinking stays here.

---

## 1. What the agent is for

Turn a messy course-sales pipeline into a trustworthy, actioned board and a plain-English update. Concretely:
- Keep the pipeline **clean and correctly staged** (dedupe, bin noise, move people to the right column as they progress).
- Surface **who to chase** and **what's flagged** per stage.
- Produce a **daily/weekly pipeline update** (in Claude, and as a Slack post) that a human sends.

**Commercial frame it serves:** a cohort has a fixed number of seats and a hard start date. BMBC Sept 2026 = ~20 seats, £999 (£899 early bird), starts 3 Sept. The job is to fill seats before the date, so the agent is always oriented to *conversions and follow-ups*, not vanity activity.

---

## 2. The funnel model

The pipeline is a clean funnel. This order matters — each stage has a precise meaning.

| # | Stage | Means |
|---|---|---|
| 0 | **Undefined lead** | Role unknown, not yet qualified. New imports land here until enriched. |
| 1 | **Warm Lead** | Identified, on-fit target, **not yet contacted**. |
| 2 | **Nzola reached out** | Contacted (WhatsApp / LinkedIn / email), awaiting a genuine reply. |
| 3 | **Hot Lead** | Genuinely replied / engaged. |
| 4 | **Awaiting Payment** | Verbally in, not yet paid. |
| 5 | **Paid** | Enrolled. |
| — | **Interested in Next time** | Declined this cohort, nurture for next. |
| — | **Pull out** | Was progressing, dropped. |
| — | **Gone cold** | Contacted, chased, went silent — no conversion. |
| — | **Not relevant** | Not the audience (wrong role, student, junk, event sign-in). |

**Intake rule (the important bit):** every new lead lands in **Undefined → enrich + qualify → promote to Warm or bin to Not relevant.** This stops raw imports getting dumped into "Warm" so that "Warm" always means a genuinely qualified, uncontacted target. Before this, ~177 raw leads sat in Warm and only ~40% were real.

---

## 3. Signal rules — how to read the truth (the crown jewels)

The single biggest lesson: **the convenient HubSpot fields lie. Read the actual activity records.**

### Do NOT trust
- **`num_contacted_notes`** / the "times contacted" counter — counts webinar/meeting noise, and *misses* outreach logged as plain notes. (Malisa Kelly showed 0 but had a real WhatsApp note.)
- **`notes_last_contacted`** — wrong in both directions. Said active deals were cold and cold deals were fresh. (Imogen/Nefeli looked 3 weeks silent but were contacted yesterday; Hollie looked fresh but her last real note was weeks old.)
- **`hs_lastmodifieddate`** — bumps on any internal/automation change, not human contact.

### DO read
**Union of all engagement objects, by real timestamp: notes + emails + meetings + calls.** The most recent genuine touch is the truth.
- **Emails carry replies that notes miss** — an email with subject `Re: Brand Manager Bootcamp` and direction `INCOMING_EMAIL` is a reply.
- **A logged email about BMBC counts as a touch** (subject contains brand manager / bootcamp / boot camp / bmbc).

### Reply detection (needed to move Reached out → Hot)
A **genuine reply** = an inbound engagement that is about the course and is human:
- `INCOMING_EMAIL` whose subject/text is BMBC-related, **AND is not an auto-reply**.
- **Filter out auto-replies**: subject containing *"Automatic reply / Out of office / Auto: / autoreply"*. (4 "replies" were out-of-office bounces to a campaign blast — not replies.)
- A note explicitly recording the lead responding (e.g. "replied — keen", "shared his mobile", "definitely interested").
- A **one-way connection request** is NOT a reply — it's outreach. (Deidrea/Rhys sat in Hot on just "connection request sent" — they belonged back in Reached out.)

### "Nzola reached out" trigger
A lead belongs in *Nzola reached out* if there's a note recording outreach — **match on the action, not the name**: `WhatsApp` / `LinkedIn` / `messaged` / `emailed` / `connection request`, not just the word "Nzola". (Emily Snelson/Harriet Stubbs had "LinkedIn update (Brand Manager Bootcamp)" notes with no "Nzola" and were missed by a name-only match.)

---

## 4. The classification brain

For qualifying raw leads (Undefined/Warm hygiene):

1. **Dedupe by email** (merge duplicate deals — see §7 for the reconciliation of merged IDs).
2. **Bin to Not relevant:** event sign-ins (company field = a stuffed Typeform), students (`.ac.uk`), test/junk (`sara@sara.com`, `X_`-prefixed), non-marketing roles (sales/HR/recruitment). **Watch the edge cases** — Shopify-import records can be real people (a Co-Founder, a Senior Marketing Manager); don't bin by source alone.
3. **No job title → Undefined** (enrich first).
4. **Has a marketing title → Warm**, scored on fit:
   - **Direct** (buys for self, the core student): Brand Manager, Assistant/Junior BM, Marketing Manager/Executive, Brand/Performance/Digital/Trade Marketing, CRM Manager, etc.
   - **Decider** (buys a seat *for their team*): Head of Marketing/Brand, Marketing/Brand Director, CMO, Founder, Global Head. Different angle ("send your team"), often higher value.
   - Flag big-corporate vs startup as a judgment call for the human (BMBC's pitch is "startups don't train").
5. **Has a genuine outreach note → Nzola reached out.**

---

## 5. Slack ↔ HubSpot reconciliation (sales truth is split)

**Sales do not reliably reach the HubSpot Paid stage. The source of truth for a sale is Slack.**

- A **Zapier "purchase bot"** posts every sale to **#brand-manager-boot-camp** (channel `C0AT5QNLNS0`): *"New Brand Manager Boot Camp Purchase! Name / Email / Purchase type."*
- The checkout automation **creates the contact and sends the onboarding email off the sale itself** — independent of the pipeline. So a buyer can be fully paid, have the email, and **have no deal in HubSpot at all** (Francesca Pearson, MOTH).
- **Match a purchase to a deal by COMPANY / EMAIL DOMAIN, not by name** — because **managers often buy on behalf of their team.** The buyer (attendee) is frequently *not* the worked lead (the manager). MOTH: Rhona McKeran (Head of Marketing, worked lead, sat in "Reached out") bought a seat; **Francesca Pearson** (Brand Manager) is the attendee who "paid".
- **Multi-seat:** one manager can buy several seats (Moju wanted 2, Blanco Nino 2). Seats sold ≠ deals won — count seats.
- **Dispositions also live in Slack**, not just HubSpot (e.g. Ivana Spocchia told Nzola she's not interested — a decline the board didn't show).

**Reconciliation the agent must do:** pull the purchase-bot history, match each sale to a company/deal, and flag paid-but-unmarked deals. **Care:** moving/creating a deal in the Paid stage can **re-trigger a stage-entry email workflow** — don't blindly move a manager into Paid (it'll email them). Prefer creating the attendee's deal in Paid, and flag the workflow risk before writing.

---

## 6. Data gotchas / hard-won corrections (a checklist of ways the naive read was wrong)

- "Nothing converted last week" — **wrong**, 2 sales (MOTH + TOTM) sat in Slack, never moved to Paid.
- "4 hot replies waiting" — **wrong**, all 4 were auto-replies to a campaign send.
- "Awaiting Payment stalling, £2k at risk" — **wrong**, all 3 were contacted in the last day or two; the date field lied.
- "Deidrea/Rhys are hot" — **wrong**, connection-request-only, no reply.
- "Malisa/Ali/Jenny never contacted" — **wrong**, real notes the counter didn't register.
- Named-based purchase matching — **misses manager-buys-for-team sales** entirely.

**The meta-lesson: pull live every time, read the real records, and reconcile Slack + HubSpot. A cached or single-source read produces a confidently wrong headline.**

---

## 7. Tooling, access & mechanics

- **HubSpot access — two doors** (see also `../../context/how-to/hubspot.md` and memory `hubspot-api-access`):
  - **Connector (MCP)** → records: read, create/update/move/merge deals, contacts, notes.
  - **Direct API key `~/.hubspot_key`** → structure/config the connector can't do: create/reorder pipeline stages, rename stages. Everything in the clean-up used this.
  - Rule: **records → connector; structure → direct key.** Always check the connector first.
- **Enrichment:** the account has **Breeze Intelligence** (fields `hs_is_enriched`, `hs_seniority`, `hs_linkedin_url`, `industry`, etc.). It's a **metered, in-app action** — the API can't trigger it. Flow: human enriches → agent reads back `hs_seniority`/`jobtitle`/`industry` → re-ranks Undefined into Warm/Not relevant.
- **CRM search index lags** — verify writes with a **direct batch-read by ID**, not a search (search showed 0 right after a confirmed update).
- **Deal merges are irreversible; a merge returns a NEW deal ID.** Stage moves are reversible.
- **Stage-entry workflows fire on entering a stage** (incl. creating a deal directly in it) — a move can send an email. Flag before writing to Paid.

**Reference IDs (BMBC 2026):** pipeline `3934525658` · Undefined `5752575209` · Warm `5624130751` · Reached out `5752320232` · Hot `5624130752` · Awaiting `5624130753` · Paid `5624130754` · Interested `5624130755` · Pull out `5624130756` · Gone cold `5624130757` · Not relevant `5752319175`. Purchase bot channel `C0AT5QNLNS0` (#brand-manager-boot-camp).

---

## 8. Guardrails & autonomy model

- **Suggest-first, then earn write access** (Liv's model). v1 is read + recommend; writes come once trusted.
- **Reversible writes** (stage moves) can proceed on a nod. **Irreversible** (merges, deletes) and **structural/config** (stage create/reorder) get explicit confirmation and a clear statement of what/why.
- **Never assume the CRM is complete** — reconcile with Slack, and flag "reply happened but no logged next step" for a human.
- **Scope everything to the specific course** (BMBC-only touches; don't count Up Club / Accelerator / webinar activity as BMBC engagement).
- **Always pull live and timestamp the output.** A pipeline update is only true at the second it's pulled.

---

## 9. What the agent produces

1. **Triage / qualification pass** — dedupe → classify → stage → ranked "who to chase".
2. **Per-stage hygiene audit** — who's flagged, who moves where (with reasons), read from notes+emails.
3. **Morning / weekly pipeline update** — counts, health verdict, prioritised actions, in Claude and as a Slack post (human sends). Reconciled against the Slack purchase bot.

**Move logic per stage (from notes+emails, reconciled):**
- Warm → Reached out: has a genuine outreach note/email.
- Reached out → Hot: genuine (non-auto) reply, or a booked call.
- Reached out: no reply in ~5 days → follow-up due.
- Hot → Reached out: only a connection request, no reply.
- Hot → Gone cold: real reply then silent 2+ weeks and re-engagement fails.
- Anything with no title → Undefined (enrich).
- Sale in Slack → mark the company's deal Paid (attendee recorded); mind the email-trigger.

### The weekly report format (that actually works)

Landed after many rounds with Liv. Structure, in order:
1. **Greeting + horizon** — e.g. "Morning team! 🌞 BMBC, just over 3 weeks to kick-off (3 Sept)."
2. **📍 Where we're at** — 2 sentences of *state*, not process: paid count + seats to go, then the one-line story (what's close, what's leaking). ("I cleaned the board / reconciled sales / the stages mean something now" is explicitly NOT wanted — no process brag.)
3. **🚩 Key flags** — the decisions/attention items (stale deals, mis-staged people, missing data like an unlogged deadline, the follow-up gap). Each names the person and the action.
4. **💳 Convert now** — closest-to-money, named, with their real current status.
5. **🎯 Deciders to open** — *uncontacted* warm deciders (Head/Director/CMO/Founder at real brands) who buy for their team. End with the owner action, e.g. "👉 Nzola, can you LinkedIn these?"
6. **🌟 Focus 7** — target-fit people in Warm/Reached who've *genuinely* shown interest (replied, asked a question, shared contact), each with a one-line signal. Lead with real repliers; fill with strong ICPs. (Nzola messaging *them* is not "interest" — that's just outbound.)
7. **Board** — one-line stage counts. Drop Undefined (Liv doesn't want it in the report).

**Copy rules (Liv's voice):** warm, direct, UK English, **no em-dashes**, emojis to break up the wall of text, **name names**, numbers over adjectives. **Never overclaim** — don't call the whole funnel "real"; state only what's verified (Paid count, stage definitions). Pull live every time and quote the *real* note/email detail (actual deadlines, what they actually said), never a paraphrased guess — if a detail isn't logged (e.g. Iza's HR deadline), say so and flag it to be logged. Deciders-vs-direct is a genuine trade-off to surface near a deadline: deciders are bigger but slower (must be sold on sending someone), direct practitioners are faster individual wins.

---

## 10. Open items / to build

- [ ] **Fix the checkout Zap** to auto-create the HubSpot deal in Paid on purchase (matched by company), so manager-buys-for-team sales stop leaving orphan contacts and Paid stays accurate. *(On Liv's weekly grid, 3 Aug.)*
- [ ] **Enrichment loop** — decide the trigger for running Breeze on Undefined, then the read-back + re-rank.
- [ ] **Build the skill** from this spec (BMBC first, then generalise to TMA). Consider the **outreach sequence** as a second layer (drafting the Nzola-style WhatsApp/LinkedIn/email chasers — draft-only, human sends).
- [ ] **Slack reconciliation automation** — pull purchase-bot history, match by company, flag unmarked-paid.

---

*Related: `../../context/how-to/hubspot.md` (HubSpot how-to), `../brand-manager-boot-camp/` (BMBC product), memory `hubspot-api-access`. This doc is the canonical spec — update it here as the skill is built and the model evolves.*
