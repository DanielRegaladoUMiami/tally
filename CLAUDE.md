# Tally

## Goal
**The closet that fills itself.** Tally auto-imports your clothing purchases (forward-receipt-to-inbox + order-email parsing; optional Plaid top-line apparel spend) so you see **"how much have I actually spent on clothes?"** in the first session — with the closet built as a *byproduct* of import, never a manual cataloging chore.

The venture moat is a **neutral, cross-platform resale-valuation + sell-through engine** ("your closet is worth ~$X vs you paid $Y"), built on legally-sourced eBay sold comps and powered by the proprietary *closet + cost-basis + wear* data graph. Monetization rides existing marketplace liquidity via **list-out / crosslist** (affiliate / deep-link), not a native marketplace.

See `docs/decisions/0001-scope-and-pivot.md` for the validation verdict and why the scope is what it is.

## Scope
**In (build order):**
1. Ingestion → spend-mirror (the flagship; collapse the onboarding tax)
2. Cost-per-wear + closet-net-worth resale-valuation engine (the moat)
3. List-out / crosslist to Poshmark / Vinted / eBay (affiliate; the revenue proof)
4. Thin, honest stylist + (only-if-liquidity) native transactions

**Out / deferred (do NOT build in MVP):** native P2P marketplace · "receive offers" · payments / escrow / KYC / 1099-K / custody of funds · swap/exchange · AI "taste" stylist as a headline · full Gmail restricted-scope OAuth · any paywall or paid acquisition · luxury/high-value items.

## Stack
- **Backend:** Python 3.11+, FastAPI, Postgres, DuckDB (resale-comps warehouse)
- **ML/vision:** self-hosted SAM 3 (cutout) + small VLM (tagging) + Marqo-FashionSigLIP (compatibility)
- **Frontend:** Expo / React Native or PWA (reuse JS/Next.js — avoid Swift/Kotlin tax)
- **Tooling:** uv (deps/build), ruff (lint+format via pre-commit)

## Current milestone
v0.1 — initial scaffold

## Local rules
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`)
- **No `Co-Authored-By` in commits** — sole author is Daniel
- Use `uv` not pip; `uv add <pkg>` to add deps
- Pre-commit hooks (ruff) run on every commit
- README/docs in English; conversation can be Spanish
- **Privacy-first is a product constraint, not an afterthought:** minimal scopes, parse on-device where feasible, *never sell spend data*. (Direct counter to the Phia Nov-2025 HTML-exfiltration scandal.)
- Instrument analytics/events from day 1 for investor metrics (activation, D7/D30 retention, viral coefficient, % connecting a 2nd data source)

## How to run
```bash
uv sync                  # create env + install deps
uv run pre-commit install
uv run pytest            # tests import from src/ via pytest pythonpath
# project-specific run commands go here as they land
```
> Gotcha: `uv sync`'s editable install of this src-layout package isn't honored in some venvs (`import tally` fails). Tests are unaffected (pytest reads from `src/`). For a working editable in plain `uv run python`, run `uv pip install -e .` once after `uv sync`.

## Frontend
Interactive UI prototype in `frontend/` — Vite + React + TS, editorial aesthetic (ivory · charcoal · serif: Fraunces + Inter). Mobile phone-frame prototype with Connect → Spend reveal → Closet → Share card.
```bash
cd frontend && npm install && npm run dev   # http://127.0.0.1:5173
```
Design direction is **clean editorial / premium** (Aritzia-like), chosen by Daniel — keep it restrained, serif headlines, whitespace, muted category colors (no neon).

## Where things live
- Backend source: `src/tally/`
- Frontend prototype: `frontend/` (Vite + React)
- Tests: `tests/`
- Experiments log: `docs/experiments/`
- Decision log: `docs/decisions/`
- Roadmap: `ROADMAP.md`
