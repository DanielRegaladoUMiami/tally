"""Receipt ingestion (issue #1).

Parse retailer order-confirmation emails into structured `Purchase` records.

v1 scope: plain-text (or text/plain part of) order-confirmation emails for the
top Gen-Z retailers, via a pragmatic generic line-item extractor plus a
retailer-detection map. This deliberately does NOT do full Gmail OAuth — the
input is a forwarded / uploaded raw email.

Known limits (future work): real emails are often HTML-only with per-retailer
templates; robust extraction needs an HTML parser (selectolax/bs4) and
per-retailer selectors, plus image-URL extraction for item photos.
"""

from __future__ import annotations

import email
import re
from datetime import date
from email.message import Message
from email.utils import parseaddr, parsedate_to_datetime
from pathlib import Path

from tally.models import Purchase

# Map a sender domain to a clean retailer/brand name. Extend as we add parsers.
RETAILER_BY_DOMAIN: dict[str, str] = {
    "shein.com": "SHEIN",
    "zara.com": "Zara",
    "urbanoutfitters.com": "Urban Outfitters",
    "princesspolly.com": "Princess Polly",
    "aritzia.com": "Aritzia",
    "abercrombie.com": "Abercrombie",
    "asos.com": "ASOS",
    "lululemon.com": "Lululemon",
    "freepeople.com": "Free People",
    "amazon.com": "Amazon",
}

# Lines that contain a price but are NOT line items.
_STOPWORDS = (
    "subtotal",
    "total",
    "shipping",
    "ship to",
    "tax",
    "discount",
    "promo",
    "estimated",
    "delivery",
    "order",
    "free",
    "balance",
    "savings",
    "gift card",
    "store credit",
    "rewards",
    "you saved",
)

_PRICE_RE = re.compile(r"\$\s?(\d{1,4}(?:,\d{3})*\.\d{2})")
_LEADING_JUNK_RE = re.compile(r"^[\s\-•*\d.)x×]+", re.UNICODE)


def _price_to_cents(text: str) -> int:
    return int(round(float(text.replace(",", "")) * 100))


def detect_retailer(msg: Message) -> str:
    """Clean retailer name from the From header (domain map, then display name)."""
    display, addr = parseaddr(msg.get("From", ""))
    domain = addr.split("@")[-1].lower() if "@" in addr else ""
    for known, name in RETAILER_BY_DOMAIN.items():
        if domain == known or domain.endswith("." + known):
            return name
    if display:
        return display.strip()
    return domain or "Unknown"


def _body_text(msg: Message) -> str:
    """Best-effort plain-text body (prefers text/plain; strips tags otherwise)."""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                return part.get_payload(decode=True).decode(
                    part.get_content_charset() or "utf-8", "replace"
                )
        # fall back to the first text/html part, tags stripped
        for part in msg.walk():
            if part.get_content_type() == "text/html":
                html = part.get_payload(decode=True).decode(
                    part.get_content_charset() or "utf-8", "replace"
                )
                return re.sub(r"<[^>]+>", " ", html)
        return ""
    payload = msg.get_payload(decode=True)
    if payload is None:
        return msg.get_payload()
    return payload.decode(msg.get_content_charset() or "utf-8", "replace")


def _order_date(msg: Message) -> date:
    raw = msg.get("Date")
    if raw:
        try:
            return parsedate_to_datetime(raw).date()
        except (TypeError, ValueError):
            pass
    return date.today()


def _extract_line_items(body: str) -> list[tuple[str, int]]:
    """Pull ``(item_name, price_cents)`` pairs from the body, skipping non-items."""
    items: list[tuple[str, int]] = []
    for raw_line in body.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        match = _PRICE_RE.search(line)
        if not match:
            continue
        lowered = line.lower()
        if any(word in lowered for word in _STOPWORDS):
            continue
        name = line[: match.start()].strip()
        name = _LEADING_JUNK_RE.sub("", name).strip(" -–—:.\t")
        if len(name) < 3:
            continue
        items.append((name, _price_to_cents(match.group(1))))
    return items


def parse_order_email(raw_email: str) -> list[Purchase]:
    """Parse one raw order-confirmation email into `Purchase` records."""
    msg = email.message_from_string(raw_email)
    retailer = detect_retailer(msg)
    purchased_on = _order_date(msg)
    body = _body_text(msg)
    return [
        Purchase(
            item_name=name,
            retailer=retailer,
            price_cents=cents,
            purchase_date=purchased_on,
        )
        for name, cents in _extract_line_items(body)
    ]


def parse_emails_from_dir(directory: str | Path) -> list[Purchase]:
    """Parse every ``*.txt``/``*.eml`` file in a directory (sorted, stable)."""
    path = Path(directory)
    purchases: list[Purchase] = []
    for file in sorted(path.glob("*")):
        if file.suffix.lower() in {".txt", ".eml"}:
            purchases.extend(parse_order_email(file.read_text(encoding="utf-8")))
    return purchases
