"""Tests for the spend engine (issue #2)."""

from __future__ import annotations

from datetime import date

from tally.analytics import build_summary
from tally.models import Purchase


def _p(name: str, retailer: str, cents: int, d: date) -> Purchase:
    return Purchase(item_name=name, retailer=retailer, price_cents=cents, purchase_date=d)


def test_empty_summary() -> None:
    s = build_summary([], today=date(2026, 6, 2))
    assert s.total_cents == 0
    assert s.count == 0
    assert s.most_expensive is None


def test_totals_ytd_and_extremes() -> None:
    purchases = [
        _p("Mini Dress", "SHEIN", 1299, date(2025, 3, 1)),
        _p("Baggy Jean", "Urban Outfitters", 6900, date(2026, 1, 10)),
        _p("Align Legging", "Lululemon", 9800, date(2026, 2, 14)),
    ]
    s = build_summary(purchases, today=date(2026, 6, 2))

    assert s.total_cents == 1299 + 6900 + 9800
    assert s.ytd_cents == 6900 + 9800  # only 2026 purchases
    assert s.count == 3
    assert s.avg_cents == round((1299 + 6900 + 9800) / 3)
    assert s.most_expensive.item_name == "Align Legging"
    assert s.least_expensive.item_name == "Mini Dress"


def test_breakdowns_sum_to_total_and_are_sorted() -> None:
    purchases = [
        _p("Tee", "SHEIN", 850, date(2025, 5, 1)),
        _p("Jeans", "SHEIN", 1700, date(2025, 5, 2)),
        _p("Cardigan", "Aritzia", 12800, date(2025, 6, 1)),
    ]
    s = build_summary(purchases, today=date(2026, 6, 2))

    assert sum(c for _, c in s.by_retailer) == s.total_cents
    assert sum(c for _, c in s.by_category) == s.total_cents
    # retailer breakdown is sorted high -> low
    assert s.by_retailer[0] == ("Aritzia", 12800)
    # months are chronological
    assert [m for m, _ in s.by_month] == ["2025-05", "2025-06"]
