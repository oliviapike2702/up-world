# marketing — cross-product channel infra only

Anything that goes OUT to win/convert people, but only the parts that aren't specific to one
course or Up Club. A course's own campaigns live inside that course's own `marketing/` folder
(see `../courses/`), not here.

- `email-playbook.md` — the standard we draft emails against (voice, structure, proof, what
  converts, the failure log). Living doc, updated after every email. The build side (how to make
  it in Mailchimp) is `../context/how-to/mailchimp.md`.
- Channel folders: `Email/` · `Graphics/` · `Paid Ads/` (incl. `meta-ads.md`) · `Socials/` (incl.
  LinkedIn hook templates, post-structure guide, Lottie's LinkedIn briefing guide) — ongoing
  channel tactics live in these, moved here from `context/how-to/` since they're tactics, not
  cross-product tools.
- No `campaigns/` folder here — every real campaign now lives in its own product's `marketing/`
  folder (`courses/<course>/marketing/` or `up-club/marketing/`). If a genuine whole-brand push
  ever comes up with no single product home, recreate `campaigns/<year>-<name>/` at that point.
- After a campaign, write down what ran and how it did (results + lessons) so the next one starts smarter.
