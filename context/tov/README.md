# tov — the voice system

Multi-voice, multi-channel. Start with `_spine.md` (hard rules ALL voices share), then pick the voice:

- **Lottie (default)** → `Up World tone of voice.md` — the master doc
- **Up Club / community "we"** → `Up Club tone of voice.md`
- **Liv's own emails** → `liv-email-voice.md`
- **Nzola (WCU newsletter)** → ⚠ no doc yet; do not guess — ask for real sends

Then add the **channel** layer on top of the voice:

- **LinkedIn / podcast posts** → `linkedin-voice.md` ✓ (anatomy, length, format, banned
  constructions; resolves the three cross-doc contradictions). Raw sources behind it:
  `Lottie LinkedIn Context and TOV.rtf` (tone + 7 real posts) and
  `../../marketing/Socials/` (the six-section anatomy + hook templates).
  Lottie's *personal* feed is the `lottie-linkedin` skill's job, not this folder's.
- **Email** → `../../marketing/Email/email-playbook.md` (the craft layer: voice moves, the two
  structure genres, proof, failure log)

Facts for Lottie-authored copy: `../research/Lottie background bank.md` (never invent credentials).
Gold reference copy: `examples/`. Channel exceptions: `../../../rules/writing-rules.md`
(⚠ partly unresolved — `linkedin-voice.md` §9 overrides it on emojis and sign-offs).

**Copies of most of this ship inside `.claude/skills/up-world-tov/references/` so the skill can be
shared with the team.** Files here are the source of truth. After editing anything in this folder,
run `.claude/skills/up-world-tov/tools/sync-references.sh` to push the change into the skill.
