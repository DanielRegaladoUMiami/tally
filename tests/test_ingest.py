"""Tests for receipt ingestion (issue #1)."""

from __future__ import annotations

from datetime import date
from pathlib import Path

from tally.ingest import parse_emails_from_dir, parse_order_email

FIXTURES = Path(__file__).parent / "fixtures" / "emails"


def test_parse_shein_fixture() -> None:
    raw = (FIXTURES / "01_shein.txt").read_text(encoding="utf-8")
    purchases = parse_order_email(raw)

    assert len(purchases) == 4  # totals/shipping/tax excluded
    assert all(p.retailer == "SHEIN" for p in purchases)
    assert all(p.purchase_date == date(2025, 3, 12) for p in purchases)

    by_name = {p.item_name: p.price_cents for p in purchases}
    assert by_name["Ribbed Bodycon Mini Dress"] == 1299
    assert by_name["Strappy Block Heel Sandals"] == 2199


def test_totals_and_shipping_are_not_items() -> None:
    purchases = parse_emails_from_dir(FIXTURES)
    names = " ".join(p.item_name.lower() for p in purchases)
    for banned in ("subtotal", "total", "shipping", "tax", "promo", "saved"):
        assert banned not in names


def test_dot_leaders_stripped_from_names() -> None:
    raw = (FIXTURES / "02_aritzia.txt").read_text(encoding="utf-8")
    purchases = parse_order_email(raw)
    names = {p.item_name for p in purchases}

    assert "Wilfred Effortless Cardigan" in names  # trailing "...." removed
    assert all("." not in n for n in names)
    assert all(p.retailer == "Aritzia" for p in purchases)


def test_full_pipeline_counts_and_total() -> None:
    purchases = parse_emails_from_dir(FIXTURES)
    assert len(purchases) == 21
    assert sum(p.price_cents for p in purchases) == 123248  # $1,232.48
    assert all(p.price_cents > 0 for p in purchases)
