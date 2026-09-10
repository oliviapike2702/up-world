#!/usr/bin/env python3
import os
SKILL = "/Users/oliviapike/Documents/Claude/Projects/.claude/skills/up-world-design"
OUT   = "/Users/oliviapike/Documents/Claude/Projects/up-world/marketing/campaigns/2026-bmbc/podcast-assets/concepts"

def a(p): return open(os.path.join(SKILL, p)).read().strip()
FONT   = open(f"{SKILL}/assets/fonts/figtree-embed.css").read()
LIZZIE = a("assets/bmbc/guest-lizzie.datauri.txt")
LOTTIE = a("assets/bmbc/lottie-headshot.datauri.txt")
BMBC_NAVY = a("assets/bmbc/bmbc-logo-blue-pink-700.datauri.txt")
BMBC_WHITE = a("assets/bmbc/bmbc-logo-white-700.datauri.txt")
UW_PINK = a("assets/logos/up-world-roundel-pink-512.datauri.txt")
UW_NAVY = a("assets/logos/up-world-roundel-navy-512.datauri.txt")

BASE = """<!doctype html><html><head><meta charset="utf-8"><style>
{font}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1080px;background:#2a2a2a}}
.card{{position:relative;width:1080px;height:1080px;overflow:hidden;
  font-family:'Figtree','Trebuchet MS',system-ui,sans-serif}}
{css}
</style></head><body><div class="card">{body}</div></body></html>"""

def page(css, body): return BASE.format(font=FONT, css=css, body=body)

# ---------------------------------------------------------------------------
# CONCEPT 1 — "Paper editorial": calm, premium, warm paper, overlap duo
# ---------------------------------------------------------------------------
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
    <img src="{BMBC_NAVY}" alt="BMBC">
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
    <img class="c1-photo c1-host" src="{LOTTIE}" alt="Lottie">
    <img class="c1-photo c1-guest" src="{LIZZIE}" alt="Lizzie">
    <div class="c1-plate c1-plate-host"><div class="nm">Lottie Unwin</div><div class="ro">Host</div></div>
    <div class="c1-plate c1-plate-guest"><div class="nm">Lizzie Staiano</div><div class="ro">Guest</div></div>
  </div>
  <div class="c1-foot">
    <span class="avail">Listen wherever you get your podcasts</span>
    <div class="by"><span>A podcast by</span><img src="{UW_PINK}" alt="Up World"></div>
  </div>
</div>
"""

# ---------------------------------------------------------------------------
# CONCEPT 2 — "Navy spotlight": bold, guest-forward, giant pink blob
# ---------------------------------------------------------------------------
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
    <img src="{LOTTIE}" alt="Lottie">
    <div class="t"><div class="a">Hosted by</div><div class="b">Lottie</div></div>
  </div>
</div>
<h1 class="c2-title">A day in the life of<br>a Brand Manager</h1>
<div class="c2-name"><b>Lizzie Staiano</b> &middot; Head of Marketing, TOTM</div>
<div class="c2-foot">
  <img class="bmb" src="{BMBC_WHITE}" alt="BMBC">
  <div class="div"></div>
  <div class="by"><span>by</span><img src="{UW_PINK}" alt="Up World"></div>
</div>
"""

# ---------------------------------------------------------------------------
# CONCEPT 3 — "Pull quote": conversation teaser, type-led, question hook
# ---------------------------------------------------------------------------
c3_css = """
.card{background:#FBF8F4}
.c3-band{position:absolute;left:0;right:0;bottom:0;height:300px;background:#16173D;z-index:1}
.c3-eyebrow{position:absolute;z-index:5;top:70px;left:78px;font-size:19px;font-weight:800;
  letter-spacing:.2em;text-transform:uppercase;color:#E7536E}
.c3-quotemark{position:absolute;z-index:2;top:96px;left:66px;font-size:340px;line-height:1;
  font-weight:900;color:#E7536E;opacity:.12;font-family:Georgia,serif}
.c3-q{position:absolute;z-index:5;top:180px;left:78px;right:360px;
  font-weight:900;color:#16173D;font-size:66px;line-height:1.02;letter-spacing:-.025em;text-wrap:balance}
.c3-q .hl{color:#E7536E}
.c3-guest{position:absolute;z-index:4;right:70px;top:150px;width:300px;height:300px;
  object-fit:cover;object-position:center 28%;border:9px solid #FBF8F4;
  border-radius:54% 46% 48% 52% / 46% 54% 46% 54%;box-shadow:0 16px 38px rgba(22,23,61,.22)}
.c3-attr{position:absolute;z-index:5;right:78px;top:466px;width:292px;text-align:center;
  font-size:20px;font-weight:700;color:#232552;line-height:1.3}
.c3-attr b{color:#16173D;font-weight:900;font-size:23px}
.c3-band-in{position:absolute;z-index:6;left:0;right:0;bottom:0;height:300px;
  padding:0 78px;display:flex;align-items:center;justify-content:space-between}
.c3-band-l .ep{font-size:16px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;
  color:#E7536E;margin-bottom:10px}
.c3-band-l .show{font-size:34px;font-weight:900;color:#fff;letter-spacing:-.01em}
.c3-band-l .avail{font-size:15px;font-weight:600;color:rgba(255,255,255,.7);margin-top:10px}
.c3-band-r{display:flex;align-items:center;gap:16px}
.c3-band-r img.bmb{height:88px}
.c3-band-r .by{display:flex;align-items:center;gap:10px}
.c3-band-r .by span{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.c3-band-r .by img{height:44px}
"""
c3_body = f"""
<div class="c3-band"></div>
<div class="c3-quotemark">&ldquo;</div>
<div class="c3-eyebrow">The Secret Podcast &middot; Ep 1</div>
<h1 class="c3-q">So what does a brand manager <span class="hl">actually do</span> all day?</h1>
<img class="c3-guest" src="{LIZZIE}" alt="Lizzie Staiano">
<div class="c3-attr"><b>Lizzie Staiano</b><br>Head of Marketing, TOTM</div>
<div class="c3-band-in">
  <div class="c3-band-l">
    <div class="ep">A day in the life</div>
    <div class="show">Hosted by Lottie Unwin</div>
    <div class="avail">Listen wherever you get your podcasts</div>
  </div>
  <div class="c3-band-r">
    <img class="bmb" src="{BMBC_WHITE}" alt="BMBC">
    <div class="by"><span>by</span><img src="{UW_PINK}" alt="Up World"></div>
  </div>
</div>
"""

# ---------------------------------------------------------------------------
# CONCEPT 4 — "Split panel": dynamic two-tone, confetti, blobs on the seam
# ---------------------------------------------------------------------------
c4_css = """
.card{background:#FBF8F4}
.c4-pink{position:absolute;left:0;top:0;width:100%;height:560px;background:#E7536E;z-index:1}
.c4-curve{position:absolute;left:0;top:420px;width:100%;height:280px;background:#FBF8F4;
  border-radius:60% 40% 0 0 / 100% 100% 0 0;z-index:1}
.c4-eyebrow{position:absolute;z-index:5;top:60px;left:0;right:0;text-align:center;
  font-size:20px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#16173D}
.c4-title{position:absolute;z-index:5;top:112px;left:90px;right:90px;text-align:center;
  font-weight:900;font-size:66px;line-height:1;letter-spacing:-.03em;color:#fff;text-wrap:balance}
.c4-duo{position:absolute;z-index:6;top:352px;left:0;width:100%;display:flex;justify-content:center}
.c4-photo{width:300px;height:300px;object-fit:cover;border:9px solid #FBF8F4;
  box-shadow:0 16px 36px rgba(22,23,61,.26)}
.c4-host{border-radius:46% 54% 52% 48% / 52% 46% 54% 48%;object-position:center 15%;margin-right:-34px;z-index:1}
.c4-guest{border-radius:54% 46% 48% 52% / 46% 54% 46% 54%;object-position:center 28%;z-index:2}
.c4-plates{position:absolute;z-index:7;top:688px;left:0;width:100%;display:flex;justify-content:center;gap:22px}
.c4-plate{background:#fff;border-radius:999px;padding:15px 28px;text-align:center;
  box-shadow:0 10px 24px rgba(22,23,61,.16)}
.c4-plate .nm{font-size:22px;font-weight:900;color:#E7536E;line-height:1}
.c4-plate .ro{font-size:12px;font-weight:700;color:#16173D;letter-spacing:.08em;
  text-transform:uppercase;margin-top:5px;opacity:.75}
.c4-foot{position:absolute;z-index:7;left:0;right:0;bottom:56px;display:flex;
  align-items:center;justify-content:center;gap:16px}
.c4-foot img.bmb{height:78px}
.c4-foot .div{width:2px;height:54px;background:rgba(22,23,61,.15)}
.c4-foot .by{display:flex;align-items:center;gap:10px}
.c4-foot .by span{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#16173D;opacity:.55}
.c4-foot .by img{height:48px}
.cf{position:absolute;z-index:3}
"""
c4_body = f"""
<div class="c4-pink"></div>
<div class="c4-curve"></div>
<svg class="cf" style="top:48px;left:56px;width:54px;height:54px" viewBox="0 0 54 54"><path d="M4 38 C10 28 4 20 12 12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>
<svg class="cf" style="top:150px;left:120px;width:26px;height:26px" viewBox="0 0 26 26"><circle cx="13" cy="13" r="6" fill="#fff"/></svg>
<svg class="cf" style="top:70px;right:80px;width:44px;height:44px" viewBox="0 0 44 44"><path d="M4 4 L10 22 M18 8 L24 26" stroke="#16173D" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
<svg class="cf" style="top:172px;right:150px;width:24px;height:24px" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#16173D"/></svg>
<div class="c4-eyebrow">The Secret Podcast &middot; Episode 1</div>
<h1 class="c4-title">A day in the life<br>of a Brand Manager</h1>
<div class="c4-duo">
  <img class="c4-photo c4-host" src="{LOTTIE}" alt="Lottie">
  <img class="c4-photo c4-guest" src="{LIZZIE}" alt="Lizzie">
</div>
<div class="c4-plates">
  <div class="c4-plate"><div class="nm">Lottie Unwin</div><div class="ro">Host</div></div>
  <div class="c4-plate"><div class="nm">Lizzie Staiano</div><div class="ro">Head of Marketing, TOTM</div></div>
</div>
<div class="c4-foot">
  <img class="bmb" src="{BMBC_NAVY}" alt="BMBC">
  <div class="div"></div>
  <div class="by"><span>by</span><img src="{UW_NAVY}" alt="Up World"></div>
</div>
"""

concepts = {
    "concept-1-editorial": page(c1_css, c1_body),
    "concept-2-spotlight": page(c2_css, c2_body),
    "concept-3-pullquote": page(c3_css, c3_body),
    "concept-4-split":     page(c4_css, c4_body),
}
for name, html in concepts.items():
    open(f"{OUT}/{name}.html", "w").write(html)
    print("wrote", name, len(html))
