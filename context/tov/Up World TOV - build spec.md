# Up World TOV skill: build spec

The plan for growing the current skill into one that works out what you're writing for, then caters to it. This is the map. It also tracks what we have versus what we still need to collect, so we build each piece once and don't invent anything.

## The idea

One shared spine that never changes (the hard rules and the core voice), plus small modular layers the skill snaps together per job. At the start of any request, the skill establishes four things, then assembles spine + the relevant layers.

Doing it this way means we maintain roughly a dozen building blocks, not a separate guide for every combination (four channels x three brands x two authors x three audiences would be 72 bespoke guides, which is unmaintainable).

## The four things the skill works out first

1. **Channel** what format is this: email, LinkedIn, website, event, Slack.
2. **Brand** which tier is it for (sets the audience and how exclusive the tone is):
   - **Up World** the overall brand and widest audience (newsletter, courses, social, anyone in our world).
   - **Up Club** the paid community.
   - **Big Up Club** the exclusive community for MDs (Abbie runs it).
3. **Author** is it from us (the team / community, "we") or from Lottie (founder, "I")? If it's from Lottie, she pulls from her own background every time, so the skill uses `Lottie background bank.md`.
4. **Audience** founders / seniors, juniors, or MDs. Same voice, different register and different pain points. Pain points must come from real research, not invention (see gaps below).

If the request makes any of these obvious, the skill just proceeds. If not, it asks one quick question before drafting.

## What we have vs what we still need

### Channels

| Channel | Status | What's needed |
|---|---|---|
| Email (from Lottie) | Strong | Covered by her example emails + transcripts |
| Email (from us / team) | Decent | A couple more real team-sent emails to firm it up |
| Event blurbs | Decent | Pod dinner + Up Fest give a template |
| Slack / community | Partial | 3-5 real on-voice Slack posts |
| LinkedIn (Up World) | Missing | 3-5 of your best real posts. Note: your LinkedIn voice differs from email, so this is its own layer |
| Website / blog | Started | Blog recap voice captured from real posts. Still want key sales pages: for-marketers, for-marketing-teams, big-up-club |

### Author voices

| Voice | Status |
|---|---|
| Lottie (founder "I") | Strong, plus a dedicated background bank |
| Us (team / community "we") | Defined in the doc; needs a few more written examples |
| Liv (member emails) | Strong |
| Host / MC (Up Talks) | Captured |

### Audience layers (pain points)

| Audience | Status | Source |
|---|---|---|
| Marketing managers (junior to mid) | Built | Pain points research |
| Marketing leaders / seniors | Built | Positioning research |
| MDs (Big Up Club) | Mostly built | Positioning research; keep BUC comms separate from the main group |

All audience pain points come from the research files, not guesswork. Research now received and built into the doc's Audience layers section.

## What Liv is feeding in

- [ ] 3-5 real Up World LinkedIn posts (your best, ideally tagged who they're for) — the main gap now
- [~] Website: blog recap voice captured; still want key sales pages (for-marketers, for-marketing-teams, big-up-club)
- [ ] A few more team-sent (from us, not Lottie) emails
- [x] Gus's audience research (received: pain points + leaders positioning, built into Audience layers)
- [ ] Optional: a few real Slack posts
- [ ] Confirm the flagged items in `Lottie background bank.md` (job titles, current figures)

## Build order once inputs land

1. LinkedIn layer (biggest current gap, distinct voice).
2. Audience pain-point layers from Gus's research.
3. Website layer.
4. Firm up the "from us" team-email examples and Slack.
5. Wire the router: skill asks / infers channel + brand + author + audience, then assembles spine + layers.
6. Repackage the skill and reinstall.

## Files this skill sits on

- `Up World tone of voice.md` the master voice guide (the spine + current layers)
- `Lottie background bank.md` real biographical detail for Lottie-authored copy
- `up-world-tov.skill` the installable skill (rebuilt as layers are added)
- Source material: three Lottie transcripts + her example emails + `liv-email-voice.md` + Anti AI Writing rules
