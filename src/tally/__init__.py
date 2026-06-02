"""Tally — the closet that fills itself."""

from tally.analytics import SpendSummary, build_summary
from tally.ingest import parse_emails_from_dir, parse_order_email
from tally.models import Closet, Purchase, categorize

__version__ = "0.0.1"

__all__ = [
    "Closet",
    "Purchase",
    "SpendSummary",
    "build_summary",
    "categorize",
    "parse_emails_from_dir",
    "parse_order_email",
    "__version__",
]
