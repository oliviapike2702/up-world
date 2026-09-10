#!/usr/bin/env python3
"""Generate Claude Design-native versions of concepts 1 & 2:
   reference the project's own asset paths + Figtree webfont (no embedded data URIs),
   matching the existing 'BMB Podcast - Announcement' file convention."""
import os
STAGE = "/Users/oliviapike/Documents/Claude/Projects/up-world/marketing/campaigns/2026-bmbc/podcast-assets/concepts/design-sync"
os.makedirs(STAGE, exist_ok=True)

FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap');"

# project-relative asset paths (already present in the Up World Design System project)
LIZZIE     = "assets/event/lizzie-staiano.png"
LOTTIE     = "assets/event/lottie.png"
UW_PINK    = "assets/logos/up-world-pink.png"
UW_NAVY    = "assets/logos/up-world-navy.png"
BMBC_NAVY  = "assets/logos/brand-manager-bootcamp-navy-by-upworld.png"
BMBC_PINK  = "assets/logos/brand-manager-bootcamp-mono-pink-by-upworld.png"  # pink mono, for navy bg

BASE = """<!-- @dsCard group="BMBC Podcast" -->
<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
{font}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1080px;background:#2a2a2a}}
.card{{position:relative;width:1080px;height:1080px;overflow:hidden;
  font-family:'Figtree','Trebuchet MS',system-ui,sans-serif}}
{css}
</style></head><body><div class="card">{body}</div></body></html>"""

def page(css, body): return BASE.format(font=FONT_IMPORT, css=css, body=body)

# --- CONCEPT 1: Editorial ---------------------------------------------------
c1_css = """
.card{background:#FBF8F4}
.c1-ring{position:absolute;border:3px solid #E7536E;border-radius:50%;opacity:.35}
.c1-inner{position:absolute;inset:0;padding:66px 72px 58px;display:flex;flex-direction:column;z-index:3}
.c1-top{display:flex;align-items:flex-start;justify-content:space-between}
.c1-top img{height:104px}
.c1-tag{background:#E7536E;color:#fff;font-size:19px;font-weight:900;letter-spacing:.14em;
  text-transform:uppercase;padding:13px 24px;border-radius:999px;transform:rotate(-3deg);
  box-shadow:0 10px 24px rgba(231,83,110,.3);white-space:nowrap;margin-top:14px}
.c1-eyebrow{margin-top:44px;font-size:19px;font-weight:800;letter-spacing:.22em;
  text-transform:uppercase;color:#E7536E}
.c1-title{margin-top:16px;font-weight:900;color:#16173D;font-size:82px;line-height:.96;
  letter-spacing:-.03em;text-wrap:balance;max-width:15ch}
.c1-uline{position:relative;white-space:nowrap;color:#E7536E}
.c1-uline svg{position:absolute;left:0;bottom:-.16em;width:100%;height:.32em;overflow:visible}
.c1-sub{margin-top:22px;font-size:26px;font-weight:700;color:#232552}
.c1-sub b{color:#E7536E;font-weight:800}
.c1-duo{position:relative;flex:1;margin-top:10px}
.c1-photo{position:absolute;object-fit:cover;border:9px solid #FBF8F4;
  box-shadow:0 18px 40px rgba(22,23,61,.22)}
.c1-guest{width:326px;height:326px;right:70px;bottom:96px;object-position:center 28%;
  border-radius:54% 46% 48% 52% / 46% 54% 46% 54%;z-index:2}
.c1-host{width:216px;height:216px;right:340px;bottom:150px;object-position:center 15%;
  border-radius:46% 54% 52% 48% / 52% 46% 54% 48%;z-index:1}
.c1-plate{position:absolute;z-index:4;background:#16173D;color:#fff;padding:13px 24px;
  border-radius:999px;text-align:center;box-shadow:0 10px 24px rgba(22,23,61,.28);white-space:nowrap}
.c1-plate .nm{font-size:22px;font-weight:900;line-height:1}
.c1-plate .ro{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:#E7536E;margin-top:5px}
.c1-plate-guest{right:78px;bottom:34px}
.c1-plate-host{right:360px;bottom:96px}
.c1-foot{display:flex;align-items:center;justify-content:space-between;
  border-top:2.5px solid rgba(22,23,61,.13);padding-top:22px;margin-top:auto}
.c1-foot .avail{font-size:15px;font-weight:700;color:#232552;letter-spacing:.01em}
.c1-foot .by{display:flex;align-items:center;gap:12px}
.c1-foot .by span{font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
  color:#16173D;opacity:.5}
.c1-foot .by img{height:52px}
"""
c1_body = f"""
<div class="c1-ring" style="width:420px;height:420px;right:-130px;top:-96px"></div>
<div class="c1-inner">
  <div class="c1-top">
    <img src="{BMBC_NAVY}" alt="Brand Manager Bootcamp">
    <span class="c1-tag">The Secret Podcast</span>
  </div>
  <div class="c1-eyebrow">Episode 1</div>
  <h1 class="c1-title">A day in the life of a
    <span class="c1-uline">Brand Manager
      <svg viewBox="0 0 300 14" preserveAspectRatio="none"><path d="M4 9 C70 3,150 13,220 6 S288 4,296 8"
        fill="none" stroke="#E7536E" stroke-width="6" stroke-linecap="round"/></svg>
    </span>
  </h1>
  <p class="c1-sub">with <b>Lizzie Staiano</b>, Head of Marketing @ TOTM</p>
  <div class="c1-duo">
    <img class="c1-photo c1-host" src="{LOTTIE}" alt="Lottie Unwin">
    <img class="c1-photo c1-guest" src="{LIZZIE}" alt="Lizzie Staiano">
    <div class="c1-plate c1-plate-host"><div class="nm">Lottie Unwin</div><div class="ro">Host</div></div>
    <div class="c1-plate c1-plate-guest"><div class="nm">Lizzie Staiano</div><div class="ro">Guest</div></div>
  </div>
  <div class="c1-foot">
    <span class="avail">Listen wherever you get your podcasts</span>
    <div class="by"><span>A podcast by</span><img src="{UW_PINK}" alt="Up World"></div>
  </div>
</div>
"""

# --- CONCEPT 2: Spotlight ---------------------------------------------------
c2_css = """
.card{background:#16173D;display:flex;flex-direction:column;align-items:center;
  padding:58px 70px 46px}
.c2-blob{position:absolute;width:520px;height:520px;background:#E7536E;
  border-radius:44% 56% 58% 42% / 50% 44% 56% 50%;top:150px;left:170px;z-index:1}
.c2-eyebrow{position:relative;z-index:5;font-size:21px;font-weight:800;letter-spacing:.2em;
  text-transform:uppercase;color:#E7536E}
.c2-guestwrap{position:relative;z-index:4;margin-top:40px;width:430px;height:430px;flex:none}
.c2-guest{width:430px;height:430px;object-fit:cover;object-position:center 26%;
  border:11px solid #FBF8F4;border-radius:52% 48% 46% 54% / 48% 52% 50% 50%;
  box-shadow:0 22px 50px rgba(0,0,0,.32);display:block}
.c2-hostbadge{position:absolute;right:-14px;bottom:2px;z-index:6;display:flex;align-items:center;
  gap:12px;background:#FBF8F4;border-radius:999px;padding:8px 22px 8px 8px;
  box-shadow:0 10px 26px rgba(0,0,0,.35)}
.c2-hostbadge img{width:56px;height:56px;border-radius:50%;object-fit:cover;object-position:center 15%;flex:none}
.c2-hostbadge .t{line-height:1.1;text-align:left}
.c2-hostbadge .t .a{font-size:12px;font-weight:700;color:#232552;opacity:.7}
.c2-hostbadge .t .b{font-size:18px;font-weight:900;color:#16173D}
.c2-title{position:relative;z-index:5;margin-top:38px;text-align:center;font-weight:900;
  font-size:66px;line-height:1;letter-spacing:-.03em;color:#fff;text-wrap:balance}
.c2-name{position:relative;z-index:5;margin-top:22px;text-align:center;font-size:23px;
  font-weight:700;color:#fff}
.c2-name b{color:#E7536E;font-weight:900}
.c2-foot{position:relative;z-index:6;margin-top:auto;display:flex;align-items:center;
  justify-content:center;gap:16px}
.c2-foot img.bmb{height:74px}
.c2-foot .div{width:2px;height:52px;background:rgba(255,255,255,.2)}
.c2-foot .by{display:flex;align-items:center;gap:10px}
.c2-foot .by span{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.c2-foot .by img{height:48px}
"""
c2_body = f"""
<div class="c2-blob"></div>
<div class="c2-eyebrow">The Secret Podcast &middot; Ep 1</div>
<div class="c2-guestwrap">
  <img class="c2-guest" src="{LIZZIE}" alt="Lizzie Staiano">
  <div class="c2-hostbadge">
    <img src="{LOTTIE}" alt="Lottie Unwin">
    <div class="t"><div class="a">Hosted by</div><div class="b">Lottie</div></div>
  </div>
</div>
<h1 class="c2-title">A day in the life of<br>a Brand Manager</h1>
<div class="c2-name"><b>Lizzie Staiano</b> &middot; Head of Marketing, TOTM</div>
<div class="c2-foot">
  <img class="bmb" src="{BMBC_PINK}" alt="Brand Manager Bootcamp">
  <div class="div"></div>
  <div class="by"><span>by</span><img src="{UW_PINK}" alt="Up World"></div>
</div>
"""

files = {
    "BMB Podcast - Ep1 (Editorial).html": page(c1_css, c1_body),
    "BMB Podcast - Ep1 (Spotlight).html": page(c2_css, c2_body),
}
for name, html in files.items():
    open(os.path.join(STAGE, name), "w").write(html)
    print("staged:", name, len(html), "bytes")
