# Roadmap — Tally

> Validated as **"pivot the wedge"**: the four-in-one (closet + spend + AI stylist + P2P marketplace) is a solo-founder graveyard. Build the wedge — "the closet that fills itself" — and let resale enter as intelligence, not as a regulated marketplace. Full rationale in `docs/decisions/0001-scope-and-pivot.md`.

## Current milestone: v0.1 — scaffold
- [x] Repo created (public, Apache 2.0)
- [x] CLAUDE.md + ROADMAP + uv/ruff/pre-commit scaffold
- [x] Validation verdict captured in decisions log
- [ ] First feature issue cut

## Phase 1 — Ingestion → spend-mirror (the flagship)
Collapse the onboarding tax; deliver the "how much have I spent on clothes?" reveal in the first session.
- [ ] Forward-receipt-to-inbox + manual receipt upload
- [ ] Order-email parser for top ~10 Gen-Z retailers (item, price, retailer photo, date)
- [ ] Spend dashboard: total (YTD + all-time), by month / retailer / category, avg item price, most/least expensive
- [ ] Shareable "your clothing spend" card (screenshot-optimized for TikTok)
- [ ] Auto-populated closet (item photo + price + date); one-tap add for offline buys via SAM cutout + coarse VLM tag
- [ ] Cost-per-wear seeded automatically + fast "I wore this" tap

## Phase 2 — Resale-valuation engine (the moat)
Neutral cross-platform "closet net worth" on legally-sourced comps.
- [ ] Apply for eBay Browse / Marketplace Insights API (legal sold comps)
- [ ] Comps warehouse (DuckDB): brand × category × condition × age
- [ ] Depreciation / quantile model + sell-through probability, with honest confidence bands
- [ ] "Your closet is worth ~$X vs you paid $Y" read-only view

## Phase 3 — List-out / crosslist (revenue proof)
Ride existing liquidity; no native marketplace, no payments.
- [ ] Detect unworn items → "list it in two taps" deep-link/crosslist handoff
- [ ] Affiliate / referral revenue line

## Phase 4+ — Later (gated on retention/liquidity)
- [ ] Thin, honest stylist (weather + calendar/occasion + FashionSigLIP compatibility + small-VLM "why")
- [ ] Native transactions (Stripe Connect, never custody funds) — only if liquidity concentrates in the niche

## Cross-cutting (from day 1)
- [ ] Privacy-first design (minimal scopes, on-device parsing, "we never sell your spend data")
- [ ] Analytics/event instrumentation (activation, D7/D30 retention, viral coefficient, 2nd-data-source rate)

## Validation gates (before scaling spend)
- [ ] Concierge test (20–50 UMiami/Miami Gen-Z women) — does the spend reveal "wow"? share rate?
- [ ] Landing-page / waitlist test with the TikTok hook — waitlist conversion + viral coefficient
- [ ] Coverage audit — auto-importable spend vs true total (is the number honest enough to ship?)

## Done
- Repo created and scaffolded
