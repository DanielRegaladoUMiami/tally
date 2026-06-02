"""Tally demo CLI: ingest order emails → spend report + shareable card.

    uv run python -m tally --emails tests/fixtures/emails --out demo_out

(If `import tally` fails under plain `uv run`, prefix with `PYTHONPATH=src`.)
"""

from __future__ import annotations

import argparse
from datetime import date
from pathlib import Path

from tally.analytics import build_summary
from tally.card import fmt_money, render_report_html, render_spend_card_svg
from tally.ingest import parse_emails_from_dir
from tally.models import Purchase

_DEFAULT_EMAILS = Path(__file__).resolve().parents[2] / "tests" / "fixtures" / "emails"


def _seed_wears(purchases: list[Purchase]) -> None:
    """Deterministically seed wear counts so cost-per-wear has something to show."""
    for p in purchases:
        p.wears = sum(ord(c) for c in p.item_name) % 6  # 0..5, some never-worn


def _parse_today(value: str | None) -> date:
    return date.fromisoformat(value) if value else date.today()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="tally", description="Tally spend-mirror demo")
    parser.add_argument(
        "--emails",
        type=Path,
        default=_DEFAULT_EMAILS,
        help="directory of order-confirmation emails (.txt/.eml)",
    )
    parser.add_argument(
        "--out", type=Path, default=Path("demo_out"), help="output directory for the report + card"
    )
    parser.add_argument("--today", default=None, help="reference date YYYY-MM-DD")
    args = parser.parse_args(argv)

    today = _parse_today(args.today)
    purchases = parse_emails_from_dir(args.emails)
    if not purchases:
        print(f"No purchases parsed from {args.emails}")
        return 1
    _seed_wears(purchases)
    summary = build_summary(purchases, today)

    print(f"\n  TALLY — parsed {summary.count} items from {args.emails}\n")
    print(
        f"  You've spent {fmt_money(summary.total_cents)} on clothes "
        f"({fmt_money(summary.ytd_cents)} this year)"
    )
    print(f"  Avg per item: {fmt_money(summary.avg_cents)}\n")
    print("  By category:")
    for label, cents in summary.by_category:
        print(f"    {label:<14} {fmt_money(cents):>10}")
    print("\n  By retailer:")
    for label, cents in summary.by_retailer:
        print(f"    {label:<18} {fmt_money(cents):>10}")

    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "index.html").write_text(
        render_report_html(summary, purchases, today), encoding="utf-8"
    )
    (args.out / "spend_card.svg").write_text(render_spend_card_svg(summary), encoding="utf-8")
    print(f"\n  Wrote {args.out / 'index.html'} and {args.out / 'spend_card.svg'}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
