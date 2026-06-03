# 0002 — "Closet as a portfolio", not a clothing stock exchange

**Date:** 2026-06-03
**Status:** Accepted

## Context
Idea raised: a "stock market for clothing" — live per-item prices set by supply and demand, like a bid/ask exchange.

## Analysis
The concept is real and proven — **StockX** (and GOAT, plus Vestiaire/Rebag price indices) is exactly a bid/ask order book with live market prices. But it only works under two conditions:

1. **Fungibility** — units must be standardized and interchangeable (a Jordan 1 size 10 deadstock = any other). A single market price can only exist for an identical, repeatable SKU.
2. **Liquidity** — many buyers *and* sellers trading the *same* SKU frequently, or no order book forms (an exchange needs *more* liquidity than an ordinary marketplace).

These hold for hype sneakers, limited streetwear, designer handbags, watches, and cards. They **fail for general/used clothing**: every garment is unique (condition, fit, wear, no SKU) → non-fungible → no order book → no single "live price." And a solo founder cannot bootstrap exchange-grade liquidity against StockX/Vestiaire.

## Decision
Do **not** build a clothing exchange. Instead, capture the compelling part of the idea by **presenting resale value as a live market index** — *"your closet as a portfolio."* A read-only **Market** screen: total resale value, change-over-time chart, % vs. what you paid, and a "top movers" watchlist (per-item resale value + trend).

This:
- Reuses the valuation engine (the moat) instead of requiring a two-sided exchange.
- Delivers the emotional hook of a stock ticker ("my Aligns are up 9% this quarter") with zero liquidity, payments, or order-book risk.
- Stays consistent with [`0001-scope-and-pivot.md`](./0001-scope-and-pivot.md): resale is a *signal + handoff*, never a native transaction venue.

## Shipped
`frontend/` Market tab: closet value + quarterly change, an area/line value chart, and a top-movers list. Market movement is currently **mocked** (`trendPct` / `portfolioSeries` in `data.ts`) as a placeholder for the real sold-comps valuation engine.

## If a standalone "StockX-of-X" is ever pursued
Only viable for a **liquid, fungible segment** (designer / hype / handbags), and even then competes with incumbents who already own that liquidity. The defensible solo angle there is the **data/index layer**, not the exchange.
