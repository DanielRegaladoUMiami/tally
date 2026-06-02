"""Tests for rendering (issues #2/#3) and category logic."""

from __future__ import annotations

from datetime import date

from tally.analytics import build_summary
from tally.card import fmt_money, render_report_html, render_spend_card_svg
from tally.models import Purchase, categorize


def test_categorize() -> None:
    assert categorize("Ribbed Bodycon Mini Dress") == "Dresses"
    assert categorize("High Waist Skinny Jeans") == "Denim"
    assert categorize("Align High-Rise Legging") == "Activewear"
    assert categorize("Strappy Block Heel Sandals") == "Shoes"
    assert categorize("Mystery Object") == "Other"


def test_fmt_money() -> None:
    assert fmt_money(123248) == "$1,232.48"
    assert fmt_money(123248, decimals=False) == "$1,232"


def _summary():
    purchases = [
        Purchase("Mini Dress", "SHEIN", 1299, date(2025, 3, 1), wears=3),
        Purchase("Align Legging", "Lululemon", 9800, date(2026, 2, 14), wears=0),
    ]
    return build_summary(purchases, today=date(2026, 6, 2)), purchases


def test_card_svg_is_wellformed() -> None:
    summary, _ = _summary()
    svg = render_spend_card_svg(summary)
    assert svg.lstrip().startswith("<svg")
    assert svg.rstrip().endswith("</svg>")
    assert fmt_money(summary.total_cents, decimals=False) in svg  # headline total


def test_report_html_contains_key_numbers() -> None:
    summary, purchases = _summary()
    html_doc = render_report_html(summary, purchases, date(2026, 6, 2))
    assert "<!doctype html>" in html_doc
    assert fmt_money(summary.total_cents) in html_doc
    assert "cost-per-wear" in html_doc.lower()
    # cost-per-wear shown for worn item, "not worn yet" for the unworn one
    assert "not worn yet" in html_doc


def test_cost_per_wear() -> None:
    p = Purchase("Mini Dress", "SHEIN", 1299, date(2025, 3, 1), wears=3)
    assert p.cost_per_wear_cents == 433
    p_unworn = Purchase("Tee", "SHEIN", 850, date(2025, 3, 1), wears=0)
    assert p_unworn.cost_per_wear_cents is None
