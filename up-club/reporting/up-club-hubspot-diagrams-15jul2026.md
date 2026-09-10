# Up Club HubSpot diagrams (Chay, 15 July 2026)

**File:** `up-club-hubspot-diagrams-15jul2026.pdf` (10 pages, diagrams not prose)
**Author:** Chay
**What it is:** A visual map of the "HubSpot as source of truth" initiative — the member
journey today vs. the future state, the reporting workflow (manual today vs. automated),
the Claude/agent architecture, and a dated status check of what's actually built.
**Relates to:** [up-club-hubspot-source-of-truth-prd.md](up-club-hubspot-source-of-truth-prd.md)
— that's the working PRD (draft, 2026-06-29) with milestones M1–M7. This PDF is Chay's
later snapshot (15 July) of progress against that same initiative, plus some diagrams that
aren't in the PRD at all.

## When to open this
- Before touching HubSpot/Zapier/reporting work, to check what's actually live vs. still
  to build — page 8 ("Foundation status... 15 July") is the one page with real state, not roadmap.
- When explaining the target architecture to someone (Chay, Liv, a future agent build) —
  page 9's "one body" metaphor (HubSpot=brain, Notion=data bank, Claude=mind, Railway=hands,
  Slack=mouth) is the clearest one-paragraph version of the whole system.
- When scoping any Up Club agent that reads/writes member data — the three rules on page 9
  (mouth only speaks approved knowledge; member-facing and internal Slack voices never mix;
  findings write back to the brain) are the safety constraints to inherit.

## Status as of 15 July 2026 (page 8) — don't assume this is still current, re-check the PDF or ask Chay/Liv
- **Done:** 54/60 duplicate contacts merged in HubSpot.
- **Ready at go:** 1,003 Memberspace IDs + 997 Stripe wallets linked (43 traced manually).
- **Half-built:** cancel/past-due Zaps proven live; gap is the pause workflow + rebuilding on stable IDs.
- **Not built:** engagement signals (email/event/Slack activity) — this gates the Member Health Agent.
- **Already live** (contrary to what the earlier "to build" diagrams suggest): the community
  Slack bot, running on Railway, with a human-curated content pipeline into Notion.
- **Flagged as most strategic single item:** D13 — Zap owner + pause workflow fix.

## Commercial layer that came out of the clean data (page 8, not in the PRD)
Moved to [`../customers/hubspot-commercial-opportunities.md`](<../customers/hubspot-commercial-opportunities.md>)
— revenue/ops opportunities (leak ledger, win-back list, corporate seats, Big Up escalator),
not architecture, so they live nearer the proposition/pricing files they'd actually change.

## Confidence
`[SOLID]` — read all 10 pages directly, not summarised from filename or memory.
