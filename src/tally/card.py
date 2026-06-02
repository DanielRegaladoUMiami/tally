"""Rendering (issues #2/#3).

- `render_spend_card_svg`: the shareable, screenshot-optimized "spend card"
  (portrait, built to travel on TikTok).
- `render_report_html`: a self-contained HTML spend report for local preview.

Pure string rendering — no template engine, no runtime dependencies.
"""

from __future__ import annotations

import html
from datetime import date

from tally.analytics import SpendSummary
from tally.models import Purchase

CATEGORY_COLORS: dict[str, str] = {
    "Dresses": "#ff6b9d",
    "Tops": "#ffd166",
    "Denim": "#4d8af0",
    "Bottoms": "#06d6a0",
    "Shoes": "#f78c6b",
    "Outerwear": "#c77dff",
    "Knitwear": "#ef476f",
    "Skirts": "#ff99c8",
    "Activewear": "#118ab2",
    "Bags": "#8d99ae",
    "Accessories": "#a0c4ff",
    "Other": "#adb5bd",
}


def color_for(category: str) -> str:
    return CATEGORY_COLORS.get(category, "#adb5bd")


def fmt_money(cents: int, *, decimals: bool = True) -> str:
    if decimals:
        return f"${cents / 100:,.2f}"
    return f"${round(cents / 100):,}"


def _esc(text: str) -> str:
    return html.escape(text, quote=True)


# --------------------------------------------------------------------------- #
# Shareable card (SVG)
# --------------------------------------------------------------------------- #
def render_spend_card_svg(summary: SpendSummary) -> str:
    """A 1080x1350 portrait card with the headline spend reveal."""
    top_category = summary.by_category[0][0] if summary.by_category else "—"
    accent = color_for(top_category)
    total = fmt_money(summary.total_cents, decimals=False)

    def stat(x: int, label: str, value: str) -> str:
        return (
            f'<text x="{x}" y="1066" fill="#9aa0b4" font-size="30" '
            f'font-family="Inter, Arial, sans-serif">{_esc(label)}</text>'
            f'<text x="{x}" y="1116" fill="#ffffff" font-size="52" font-weight="700" '
            f'font-family="Inter, Arial, sans-serif">{_esc(value)}</text>'
        )

    return f"""<svg xmlns="http://www.w3.org/2000/svg"
     width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#15121f"/>
      <stop offset="1" stop-color="#241a33"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <rect x="64" y="64" width="952" height="1222" rx="44"
        fill="#1c1726" stroke="#322a44" stroke-width="2"/>
  <text x="120" y="190" fill="{accent}" font-size="34" font-weight="700" letter-spacing="6"
        font-family="Inter, Arial, sans-serif">TALLY</text>
  <text x="120" y="430" fill="#9aa0b4" font-size="44" font-family="Inter, Arial, sans-serif">
    Since I started tracking, I've spent
  </text>
  <text x="116" y="640" fill="#ffffff" font-size="200" font-weight="800"
        font-family="Inter, Arial, sans-serif">{_esc(total)}</text>
  <text x="120" y="720" fill="{accent}" font-size="44" font-weight="600"
        font-family="Inter, Arial, sans-serif">on clothes 👀</text>
  <line x1="120" y1="980" x2="960" y2="980" stroke="#322a44" stroke-width="2"/>
  {stat(120, "ITEMS", str(summary.count))}
  {stat(420, "AVG / ITEM", fmt_money(summary.avg_cents, decimals=False))}
  {stat(720, "TOP CATEGORY", top_category)}
  <text x="120" y="1230" fill="#6c6480" font-size="30" font-family="Inter, Arial, sans-serif">
    the closet that fills itself — tally
  </text>
</svg>"""


# --------------------------------------------------------------------------- #
# Local HTML report
# --------------------------------------------------------------------------- #
def _bar_rows(rows: list[tuple[str, int]], *, colored: bool = False) -> str:
    if not rows:
        return '<p class="muted">No data yet.</p>'
    top = max(c for _, c in rows) or 1
    out = []
    for label, cents in rows:
        pct = max(2, round(cents / top * 100))
        color = color_for(label) if colored else "#7c5cff"
        out.append(
            f'<div class="bar-row"><span class="bar-label">{_esc(label)}</span>'
            f'<span class="bar-track"><span class="bar-fill" '
            f'style="width:{pct}%;background:{color}"></span></span>'
            f'<span class="bar-val">{fmt_money(cents)}</span></div>'
        )
    return "\n".join(out)


def _item_rows(purchases: list[Purchase]) -> str:
    top = sorted(purchases, key=lambda p: p.price_cents, reverse=True)[:8]
    out = []
    for p in top:
        cpw = p.cost_per_wear_cents
        cpw_txt = f"{fmt_money(cpw)}/wear" if cpw is not None else "not worn yet"
        out.append(
            f"<tr><td><span class='chip' style='background:{color_for(p.category)}'></span>"
            f"{_esc(p.item_name)}</td><td class='muted'>{_esc(p.retailer)}</td>"
            f"<td class='muted'>{_esc(p.category)}</td>"
            f"<td class='num'>{fmt_money(p.price_cents)}</td>"
            f"<td class='num muted'>{cpw_txt}</td></tr>"
        )
    return "\n".join(out)


_CSS = """
* { box-sizing: border-box; }
body { margin: 0; background: #0f0d16; color: #ece9f5;
  font-family: Inter, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
.wrap { max-width: 1080px; margin: 0 auto; padding: 40px 28px 80px; }
h1 { font-size: 22px; letter-spacing: 4px; color: #b9a7ff; margin: 0 0 4px; }
.sub { color: #8a8499; margin: 0 0 36px; }
.grid { display: grid; grid-template-columns: 360px 1fr; gap: 36px; align-items: start; }
@media (max-width: 860px) { .grid { grid-template-columns: 1fr; } }
.card-frame { border-radius: 28px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,.5); }
.card-frame svg { width: 100%; height: auto; display: block; }
.panel { background: #181423; border: 1px solid #2a2338; border-radius: 20px;
  padding: 24px 26px; margin-bottom: 24px; }
.panel h2 { font-size: 13px; letter-spacing: 2px; text-transform: uppercase;
  color: #8a8499; margin: 0 0 18px; }
.headline { display: flex; gap: 28px; flex-wrap: wrap; }
.stat .big { font-size: 40px; font-weight: 800; }
.stat .lbl { color: #8a8499; font-size: 13px; }
.bar-row { display: grid; grid-template-columns: 120px 1fr 90px; gap: 12px;
  align-items: center; margin: 9px 0; font-size: 14px; }
.bar-label { color: #c9c4d8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-track { background: #241d33; border-radius: 999px; height: 12px; overflow: hidden; }
.bar-fill { display: block; height: 100%; border-radius: 999px; }
.bar-val { text-align: right; color: #ece9f5; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
td { padding: 10px 6px; border-bottom: 1px solid #241d33; }
.num { text-align: right; white-space: nowrap; }
.muted { color: #8a8499; }
.chip { display: inline-block; width: 10px; height: 10px; border-radius: 3px;
  margin-right: 10px; vertical-align: middle; }
.foot { color: #5d5872; font-size: 12px; margin-top: 30px; }
"""


def render_report_html(summary: SpendSummary, purchases: list[Purchase], today: date) -> str:
    """A self-contained HTML spend report for local preview."""
    card = render_spend_card_svg(summary)
    most = summary.most_expensive
    least = summary.least_expensive
    most_txt = f"{_esc(most.item_name)} — {fmt_money(most.price_cents)}" if most else "—"
    least_txt = f"{_esc(least.item_name)} — {fmt_money(least.price_cents)}" if least else "—"

    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tally — your clothing spend</title>
<style>{_CSS}</style></head>
<body><div class="wrap">
  <h1>TALLY</h1>
  <p class="sub">The closet that fills itself · report generated {today.isoformat()}</p>
  <div class="grid">
    <div>
      <div class="card-frame">{card}</div>
      <p class="foot">↑ shareable card (issue #3) — built to screenshot</p>
    </div>
    <div>
      <div class="panel">
        <h2>How much have I spent on clothes?</h2>
        <div class="headline">
          <div class="stat"><div class="big">{fmt_money(summary.total_cents)}</div>
            <div class="lbl">all-time</div></div>
          <div class="stat"><div class="big">{fmt_money(summary.ytd_cents)}</div>
            <div class="lbl">this year ({today.year})</div></div>
          <div class="stat"><div class="big">{summary.count}</div>
            <div class="lbl">items</div></div>
          <div class="stat"><div class="big">{fmt_money(summary.avg_cents)}</div>
            <div class="lbl">avg / item</div></div>
        </div>
      </div>
      <div class="panel"><h2>By category</h2>{_bar_rows(summary.by_category, colored=True)}</div>
      <div class="panel"><h2>By retailer</h2>{_bar_rows(summary.by_retailer)}</div>
      <div class="panel"><h2>By month</h2>{_bar_rows(summary.by_month)}</div>
      <div class="panel"><h2>Most / least expensive</h2>
        <p>💸 Most: {most_txt}<br>🪙 Least: {least_txt}</p></div>
      <div class="panel"><h2>Top items · cost-per-wear</h2>
        <table><tbody>{_item_rows(purchases)}</tbody></table></div>
    </div>
  </div>
  <p class="foot">Tally · data parsed from order-confirmation emails · prices in USD</p>
</div></body></html>"""
