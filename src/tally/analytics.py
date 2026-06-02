"""Spend analytics (issue #2) — the "how much have I spent on clothes?" engine.

All money math is in integer cents. The caller passes a reference ``today`` so
results are deterministic and testable (no hidden clock).
"""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field
from datetime import date

from tally.models import Purchase


def _sorted_desc(totals: dict[str, int]) -> list[tuple[str, int]]:
    return sorted(totals.items(), key=lambda kv: kv[1], reverse=True)


@dataclass
class SpendSummary:
    """The numbers behind the spend-mirror reveal."""

    total_cents: int
    ytd_cents: int
    count: int
    avg_cents: int
    by_month: list[tuple[str, int]] = field(default_factory=list)  # "YYYY-MM" -> cents
    by_retailer: list[tuple[str, int]] = field(default_factory=list)
    by_category: list[tuple[str, int]] = field(default_factory=list)
    most_expensive: Purchase | None = None
    least_expensive: Purchase | None = None

    @property
    def total(self) -> float:
        return self.total_cents / 100

    @property
    def ytd(self) -> float:
        return self.ytd_cents / 100


def build_summary(purchases: list[Purchase], today: date) -> SpendSummary:
    """Aggregate purchases into a `SpendSummary` as of ``today``."""
    if not purchases:
        return SpendSummary(total_cents=0, ytd_cents=0, count=0, avg_cents=0)

    total = sum(p.price_cents for p in purchases)
    ytd = sum(p.price_cents for p in purchases if p.purchase_date.year == today.year)

    by_month: dict[str, int] = defaultdict(int)
    by_retailer: dict[str, int] = defaultdict(int)
    by_category: dict[str, int] = defaultdict(int)
    for p in purchases:
        by_month[p.purchase_date.strftime("%Y-%m")] += p.price_cents
        by_retailer[p.retailer] += p.price_cents
        by_category[p.category] += p.price_cents

    return SpendSummary(
        total_cents=total,
        ytd_cents=ytd,
        count=len(purchases),
        avg_cents=round(total / len(purchases)),
        by_month=sorted(by_month.items()),  # chronological
        by_retailer=_sorted_desc(by_retailer),
        by_category=_sorted_desc(by_category),
        most_expensive=max(purchases, key=lambda p: p.price_cents),
        least_expensive=min(purchases, key=lambda p: p.price_cents),
    )
