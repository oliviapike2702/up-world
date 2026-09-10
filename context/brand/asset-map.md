# Brand asset map — where the real files live

Finished assets live in Google Drive and Canva; this workspace only holds descriptions and
pointers (per the standing rule: link, don't duplicate). One line each on what it is and
when to use it.

## Source documents
- [Up World Brand Guide V1 (PDF)](https://drive.google.com/file/d/1xGvn0GYSE7VePt768nBp8R-hhXgnFliK/view) —
  the full brand book: brand house, logos, colours, type, illustration, photography, TOV,
  personas. Harvested into `brand-guidelines.md`.
- [UP WORLD COLOURS (PDF)](https://drive.google.com/file/d/1_CVP4nUPVVbBJXE41aMlSDRPpS7xJNVP/view) —
  one-pager with the two brand hexes/CMYK. Same values as the brand book.

## Drive folders (all inside Up World / Assets)
- [Assets (top)](https://drive.google.com/drive/folders/1sGJwmGzOlL9CTRq8BicC9DGll4DAX4-0) —
  parent folder for everything below.
- [Logos](https://drive.google.com/drive/folders/1V1qqOJHT5_D707OK0Zqabdm1En4rCxjJ) —
  Up World + Up Club logos in pink and navy, three roundels, newsletter logo (all PNG).
  ⚠ No vector masters here.
- [Graphics](https://drive.google.com/drive/folders/1PhsRgVMfl_Nyuzf7cVmJ5gZ38VgY6OgH) —
  finished graphics for reuse.
- [Community Pics](https://drive.google.com/drive/folders/1zihT4uobd8jpVINoq3e_I2R8Uc0DFtqM) —
  real event/community photography; first stop for imagery in emails and socials.
- [Photos of Lottie](https://drive.google.com/drive/folders/11nWt-aLPuindTPwhHhcj0Cp6x2vo7f5e) —
  founder photos for talks, press, promo.
- [Lottie TOV](https://drive.google.com/drive/folders/1_ZWxQNLbA-HLTE4AA2cjzxTblmnz_tt9) —
  voice source material (already harvested into `../tov/`; check here for anything new).
- [Testimonials (shortcut)](https://drive.google.com/file/d/1gYtudD4J_-ZMDEGFIa6vkkbij_YvMjkF/view) —
  member quotes; never invent testimonials, pull from here.

## Canva
- **Up World brand kit** exists in Canva (colours + fonts pre-set) — use it for any new
  design so brand codes apply automatically. An **Up Talent** kit also exists.
- How-we-make-graphics workflow (templates, sizes, export, where files get saved) is in
  `../how-to/canva.md`.

## Design references (in-repo) ✓
- `design references/` (this folder) — real screenshots of past Up World graphics, saved
  so visual patterns can be read directly rather than guessed: colour use, type hierarchy,
  the ribbon/swoosh motif, circular photo crops, badge stickers. The Brand Hackers file in
  here is a sister brand's own look (pale pink, serif type) — not ours; only its layout
  ideas (e.g. the host-row + info-bar structure) are fair game, never its palette or type.

## Making graphics inside Claude (brand pack skill) ✓
- The **`up-world-design`** skill (`.claude/skills/up-world-design/`) lets Claude build
  on-brand graphics directly — social posts, email/newsletter headers, slides, event/promo.
  It has the real assets **embedded** so output is on brand first time:
  - Figtree font (variable woff2) as a ready-to-inline data URI.
  - Up World roundel logo, pink + navy, full-res PNG + 512px embed-ready data URIs.
  - Colour tokens, exact canvas sizes per channel, the wonky motifs, export helper.
- These embedded copies are the **only in-repo brand assets**; everything else (other logos,
  photography) still lives in Drive per the sections above — pull + embed before use.
- The skill is the template for cloning to other brands (Up Talent, Brand Hackers, Copy Club).
