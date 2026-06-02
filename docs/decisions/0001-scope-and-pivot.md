# 0001 — Scope & pivot: from "four-in-one closet app" to "the closet that fills itself"

**Date:** 2026-06-02
**Status:** Accepted

## Context
The original idea was a Phia-like app bundling four things: (1) digital closet catalog, (2) clothing-spend tracker, (3) AI stylist, (4) P2P resale with offers + swap/exchange. A multi-source validation (competitive landscape, market sizing, feasibility, unit economics, red-team, GTM, legal/payments) was run before any build.

Note: **Phia is a false comparable.** Phia (Phoebe Gates / Sophia Kianni, ~$43.5M raised, ~1.5M users) is a *buy-side* AI price-comparison/affiliate tool. It does not manage your closet, track your spend, or let you sell. The original idea is much broader than Phia.

## Decision
**Pivot the wedge.** Do not build the four-in-one. Build **"the closet that fills itself"**: auto-import clothing purchases → spend-mirror → closet as a byproduct, with a neutral cross-platform **resale-valuation engine** as the moat and **list-out/crosslist** (affiliate) as revenue. Defer the marketplace, payments, swap, and the "taste" stylist.

## Why the four-in-one fails for a solo founder (ranked by lethality)
1. **Two-sided marketplace cold-start** — cannot out-liquidity Poshmark/Vinted/eBay-Depop solo.
2. **Swap/exchange** — every working swap platform abandoned true barter for a warehouse + points-currency (an ops business); barter dies on double-coincidence-of-wants.
3. **Four hard products at once** — each is its own startup; 20 hrs/week ships four mediocre features.
4. **Onboarding tax** — 8–15 hrs to catalog a closet is the #1 retention killer (shopping apps ~5.6% Day-30).
5. **Incumbents own every pillar** (Whering 9M, Acloset 7M, Indyx already auto-imports receipts).
6. **Payments = legal trap** — money-transmitter licensing, KYC, 1099-K ($600 threshold from 2026), escrow, fraud, disputes. Uninsurable for a solo operator on OPT/STEM.
7. **Weak, circular monetization** — ARPU ~$1–5/yr vs ~$15 CAC; the only venture-scale revenue (resale take-rate) needs the liquidity that won't exist.

## Why the wedge is attractive (why-now)
- Secondhand exploding: ~$393B global (2025), US ~$78.8B by 2030, ~2× the rest of fashion; 64% of Gen Z search secondhand before buying new. ThredUp flags **$23.3B of US value locked behind sell-side friction**.
- A **neutral cross-platform resale-valuation** is open white space (Phia & Poshmark pricing are siloed to their own data).
- Gen Z apparel spend fell ~13% in 2025 (PwC) → appetite for a "how much have I spent on clothes?" hook nobody owns.
- Enabling tech is cheap/solo-buildable: SAM 3 (open-weight, Nov 2025), Marqo-FashionSigLIP, small VLMs. Onboarding a 150-item closet costs ~$0.15–2.00.
- Competitive window ~12–24 months (eBay bought Depop Feb 2026; Phia's roadmap gestures at "digital closets").

## Cut from MVP (and why)
- **Native P2P marketplace / "receive offers"** — unwinnable liquidity vs incumbents.
- **Payments / escrow / KYC / 1099-K / custody** — compliance trap; defer; if ever enabled, Stripe Connect with delayed transfers, never hold a balance.
- **Swap/exchange** — least solo-buildable; needs warehouse + points currency.
- **AI "taste" stylist as a headline** — universally the worst-reviewed feature; data-hungry; impossible at cold start. Defer to a thin, honest, calendar-grounded helper later.
- **Full Gmail restricted-scope OAuth** — Google CASA verification delay; start with forward-to-inbox / manual upload.
- **Paywall / paid acquisition** — friction-vs-monetization trap; CAC fatal vs achievable ARPU.

## Riskiest assumptions to test before scaling
- The spend reveal is a strong enough "wow" to drive organic shares (demand is latent, not loud).
- Auto-import covers enough of a real wardrobe to produce a believable number.
- Users grant email/receipt (and later bank) access despite the Phia/Slice trust precedents.
- The eBay sold-comp API approval comes through (avoid ToS-violating scraping).

## Venture framing (chosen direction)
Goal = venture-scale. The consumer spend-mirror is the top-of-funnel and data moat; the **resale-valuation + sell-through engine is a first-class component from day 1** (not deferred), because the proprietary closet + cost-basis + wear graph is what a funded competitor can't easily copy. Instrument investor metrics (activation, D7/D30 retention, viral coefficient, 2nd-data-source rate) from the start.
