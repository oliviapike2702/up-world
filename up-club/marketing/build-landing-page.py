#!/usr/bin/env python3
"""Build the Up Club cold landing page from oct-2026-cold-landing-page.template.html.

Images are written into _deploy/assets/ and referenced by relative path, NOT inlined as
data URIs. Inlining was making index.html 2.9MB, which is the worst thing you can do to a
cold paid-traffic page: the browser can't render anything until the whole lot arrives, and
nothing caches between visits. As separate files the HTML is ~70KB and renders immediately.

The Figtree font stays inlined. It's ~27KB and inlining avoids a render-blocking request
that would otherwise flash unstyled headlines.

Run:  bash up-world/up-club/marketing/deploy.sh   (which calls this)
  or: python3 up-world/up-club/marketing/build-landing-page.py
"""
import base64, pathlib, re, shutil, sys

M = pathlib.Path(__file__).resolve().parent
ROOT = M.parents[2]
S = ROOT / ".claude/skills/up-world-design/assets"
A = M / "assets"
OUT = M / "_deploy"
OUTA = OUT / "assets"

IMGS = {
    "__IMG_RECOGNITION__": "recognition.jpg",
    "__IMG_WORKSHOP__":    "workshop.jpg",
    "__IMG_UPTALK__":      "uptalk.jpg",
    "__IMG_ANNE__":        "anne.jpg",
    "__IMG_SERIOUS__":     "serioustissues.jpg",
    "__IMG_CLOSE__":       "hero.jpg",
    "__FACE_SARAH__":      "face-sarah.jpg",
    "__FACE_YASMIN__":     "face-yasmin.jpg",
    "__FACE_URMILA__":     "face-urmila.jpg",
    "__FACE_MALINI__":     "face-malini.jpg",
    "__FACE_ALEXA__":      "face-alexa.jpg",
    "__FACE_CARA__":       "face-cara.jpg",
    "__FACE_TAYLOR__":     "face-taylor.jpg",
    # Logo marquee. Every brand verified in HubSpot as having a member behind it.
    # lululemon's only contact is an "Educator" (retail, not marketing) — included at
    # Liv's explicit request, 7 Aug 2026.
    "__LOGO_BLOOMWILD__":         "logo-bloomwild.png",
    "__LOGO_LULULEMON__":         "logo-lululemon.png",
    "__LOGO_GAILS__":             "logo-gails.png",
    "__LOGO_ODDBOX__":            "logo-oddbox.png",
    "__LOGO_SKINANDME__":         "logo-skinandme.png",
    "__LOGO_WILDFARMED__":        "logo-wildfarmed.png",
    "__LOGO_PROPER__":            "logo-proper.png",
    "__LOGO_HONEST__":            "logo-honest.png",
    "__LOGO_OLIO__":              "logo-olio.png",
    "__LOGO_HUCKLETREE__":        "logo-huckletree.png",
    "__LOGO_MOTH__":              "logo-moth.png",
    "__LOGO_GU__":                "logo-gu.png",
    "__LOGO_TOTM__":              "logo-totm.png",
    "__LOGO_GREENPEOPLE__":       "logo-greenpeople.png",
    "__LOGO_PICCOLO__":           "logo-piccolo.png",
    "__LOGO_YUMOVE__":            "logo-yumove.png",
    "__LOGO_CANDYKITTENS__":      "logo-candykittens.png",
    "__LOGO_ELIZABETHSCARLETT__": "logo-elizabethscarlett.png",
    "__LOGO_JOEANDSEPHS__":       "logo-joeandsephs.png",
}
ROUNDEL = "up-world-roundel.png"

html = (M / "oct-2026-cold-landing-page.template.html").read_text(encoding="utf-8")
html = html.replace("/*__FONT_CSS__*/",
                    (S / "fonts/figtree-embed.css").read_text(encoding="utf-8").strip())

OUTA.mkdir(parents=True, exist_ok=True)
for f in OUTA.glob("*"):
    f.unlink()

# roundel comes from the design skill, everything else from ./assets
shutil.copy(S / "logos/up-world-roundel-pink-512.png", OUTA / ROUNDEL)
html = html.replace("__LOGO__", f"assets/{ROUNDEL}")

missing = []
for token, name in IMGS.items():
    src = A / name
    if not src.exists():
        missing.append(name); continue
    shutil.copy(src, OUTA / name)
    html = html.replace(token, f"assets/{name}")

if missing:
    sys.exit(f"ERROR missing asset files: {missing}")

left = [t for t in list(IMGS) + ["__LOGO__", "__FONT_CSS__"] if t in html]
if left:
    sys.exit(f"ERROR unreplaced tokens: {left}")
for need in ["<!DOCTYPE html>", 'name="viewport"', "height:auto", "</body>", "</html>"]:
    if need not in html:
        sys.exit(f"ERROR missing required markup: {need}")

(M / "oct-2026-cold-landing-page.html").write_text(html, encoding="utf-8")
(OUT / "index.html").write_text(html, encoding="utf-8")

def mb(n): return f"{n/1024/1024:.2f} MB"
imgs = sum(f.stat().st_size for f in OUTA.iterdir())
print(f"index.html {len(html)/1024:.0f} KB  +  {len(list(OUTA.iterdir()))} assets {mb(imgs)}"
      f"  =  total {mb(len(html)+imgs)}")
