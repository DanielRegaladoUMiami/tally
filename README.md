# Tally

**The closet that fills itself.** Tally auto-imports your clothing purchases so you see what you've spent, what your closet is worth to resell, and what's worth selling next — without manually cataloging a single item.

> Status: pre-MVP scaffold. See [`ROADMAP.md`](./ROADMAP.md) for the plan and [`docs/decisions/0001-scope-and-pivot.md`](./docs/decisions/0001-scope-and-pivot.md) for the validation and scope rationale.

## Why
- **The hook:** answer *"how much have I actually spent on clothes?"* in the first session — no manual cataloging. The closet is a byproduct of importing your purchases.
- **The moat:** a neutral, cross-platform resale-valuation + sell-through engine ("your closet is worth ~$X vs you paid $Y"), powered by your closet + cost-basis + wear data.
- **The revenue:** list unworn items out to existing marketplaces (Poshmark / Vinted / eBay) via affiliate / deep-link — riding their liquidity instead of building our own.

## Privacy
Privacy-first is a product constraint: minimal data scopes, on-device parsing where feasible, and **we never sell your spend data.**

## Develop

```bash
uv sync
uv run pre-commit install
uv run pytest
```

## License

Apache 2.0
