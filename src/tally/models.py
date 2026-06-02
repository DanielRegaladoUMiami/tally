"""Core domain model for Tally.

A `Purchase` is the atomic unit: one clothing item the user bought, with what
they paid and where. Prices are stored as integer cents to avoid float drift.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date

# Ordered category rules — first keyword match wins, so put the more specific
# categories (shoes, activewear, denim) before the generic ones (top).
CATEGORY_KEYWORDS: dict[str, tuple[str, ...]] = {
    "Shoes": ("shoe", "sneaker", "boot", "heel", "sandal", "loafer", "flat", "mule"),
    "Activewear": ("legging", "active", "sports bra", "yoga", "gym", "track pant"),
    "Denim": ("jean", "denim"),
    "Dresses": ("dress", "gown", "romper", "jumpsuit"),
    "Skirts": ("skirt",),
    "Outerwear": ("jacket", "coat", "blazer", "parka", "puffer", "trench"),
    "Knitwear": ("sweater", "cardigan", "knit", "hoodie", "sweatshirt"),
    "Tops": ("top", "tee", "t-shirt", "shirt", "blouse", "tank", "cami", "bodysuit"),
    "Bottoms": ("pant", "trouser", "short", "cargo"),
    "Bags": ("bag", "tote", "purse", "backpack", "clutch"),
    "Accessories": ("belt", "scarf", "hat", "sunglass", "jewelry", "necklace", "earring"),
}


def categorize(item_name: str) -> str:
    """Best-effort category from the item name. Falls back to ``"Other"``."""
    name = item_name.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in name for kw in keywords):
            return category
    return "Other"


@dataclass
class Purchase:
    """One purchased clothing item."""

    item_name: str
    retailer: str
    price_cents: int
    purchase_date: date
    category: str = ""
    photo_url: str | None = None
    source: str = "email"
    wears: int = 0

    def __post_init__(self) -> None:
        if not self.category:
            self.category = categorize(self.item_name)

    @property
    def price(self) -> float:
        """Price in dollars (for display only — math stays in cents)."""
        return self.price_cents / 100

    @property
    def cost_per_wear_cents(self) -> int | None:
        """Cost-per-wear in cents, or ``None`` if never worn (avoid div-by-zero)."""
        if self.wears <= 0:
            return None
        return round(self.price_cents / self.wears)


@dataclass
class Closet:
    """A user's imported purchases."""

    purchases: list[Purchase] = field(default_factory=list)

    def add(self, *purchases: Purchase) -> None:
        self.purchases.extend(purchases)

    def __len__(self) -> int:
        return len(self.purchases)
