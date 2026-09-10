import subprocess, os, sys

BLOB = "M 350.476562 0 C 331.5625 0 311.867188 2.605469 290.972656 8.277344 C 208.871094 30.546875 131.792969 66.566406 64.136719 118.417969 C 15.339844 155.828125 6.597656 216.351562 2.578125 275.914062 C -0.292969 318.472656 -0.40625 361.511719 7.402344 403.429688 C 18.734375 464.339844 47.046875 521.976562 88.300781 568.183594 C 113.371094 596.269531 143.621094 620.433594 178.679688 634.128906 C 203.777344 643.933594 229.738281 647.992188 256.070312 647.992188 C 319.578125 647.992188 385.183594 624.367188 445.792969 600.824219 C 492.226562 582.785156 540.527344 563.472656 573.449219 526.078125 C 595.378906 501.164062 608.820312 469.871094 618.484375 438.109375 C 636.734375 378.105469 642.535156 313.28125 627.210938 252.457031 C 617.507812 213.960938 599.695312 178.082031 582.023438 142.527344 C 571.808594 121.984375 561.355469 101.117188 545.550781 84.492188 C 535.703125 74.152344 524.03125 65.734375 511.976562 58.09375 C 457.324219 23.558594 407.394531 0 350.476562 0 L 350.464844 0 Z"

sp = os.path.dirname(os.path.abspath(__file__))
inp = os.path.abspath(sys.argv[1]); outp = os.path.join(sp, sys.argv[2])
htmlc = f'''<!doctype html><html><head><style>html,body{{margin:0;padding:0;background:transparent}}</style></head><body>
<svg width="643" height="648" viewBox="0 0 643 648" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="w"><path d="{BLOB}"/></clipPath></defs>
<image href="file://{inp}" x="0" y="0" width="643" height="648" preserveAspectRatio="xMidYMid slice" clip-path="url(#w)"/>
</svg></body></html>'''
tmp = os.path.join(sp, "render_tmp.html")
open(tmp, "w").write(htmlc)
chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
subprocess.run([chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
    "--force-device-scale-factor=2", "--default-background-color=00000000",
    "--window-size=643,648", f"--screenshot={outp}", f"file://{tmp}"], capture_output=True)
print("rendered", sys.argv[2], "->", os.path.exists(outp))
