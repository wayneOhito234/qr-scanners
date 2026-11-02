"""Generate the menu QR codes.

Usage:  python tools/make_qr.py [BASE_URL]
Default BASE_URL is the GitHub Pages address of this repo.
"""
import sys
from pathlib import Path

import segno

BASE_URL = (sys.argv[1] if len(sys.argv) > 1 else "https://wayneohito234.github.io/qr-scanners/").rstrip("/") + "/"
OUT = Path(__file__).resolve().parent.parent / "qr"
RED = "#8f1820"

CODES = {
    "breakfast-menu": ("Breakfast Menu", "breakfast.html"),
    "main-menu": ("Main Menu", "menu.html"),
    "all-menus": ("All Menus", ""),
}

OUT.mkdir(exist_ok=True)
cards = []
for name, (label, page) in CODES.items():
    url = BASE_URL + page
    qr = segno.make(url, error="h")
    qr.save(OUT / f"{name}.png", scale=20, border=4, dark=RED)
    qr.save(OUT / f"{name}.svg", scale=10, border=4, dark=RED)
    cards.append(
        f'<div class="card"><h2>{label}</h2><img src="{name}.svg" alt="QR code for {label}">'
        f"<p>Scan to view our {label.lower()}</p><small>{url}</small></div>"
    )
    print(f"{name}: {url}")

(OUT / "print.html").write_text(
    f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Savanna Menu QR Codes</title>
<style>
  body {{ font-family: Montserrat, system-ui, sans-serif; margin: 0; padding: 24px; color: #2b1d16; }}
  .grid {{ display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; }}
  .card {{ width: 300px; border: 3px solid #c1222d; border-radius: 16px; padding: 20px; text-align: center; page-break-inside: avoid; }}
  .card h2 {{ margin: 0 0 4px; color: #c1222d; }}
  .card img {{ width: 240px; height: 240px; }}
  .card p {{ margin: 8px 0 4px; font-weight: 600; }}
  .card small {{ color: #6f625a; word-break: break-all; }}
  .brand {{ text-align: center; font-size: 28px; font-weight: 800; color: #c1222d; letter-spacing: 2px; margin-bottom: 20px; }}
</style></head>
<body><div class="brand">SAVANNA COFFEE LOUNGE</div><div class="grid">{''.join(cards)}</div></body></html>
""",
    encoding="utf-8",
)
print(f"Wrote QR codes to {OUT}")
