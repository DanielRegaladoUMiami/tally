# Tally — UI prototype

Interactive, mobile-framed prototype of the Tally app. **Vite + React + TypeScript**, hand-crafted editorial design system (ivory · charcoal · serif — Fraunces display + Inter).

```bash
npm install
npm run dev      # landing → http://127.0.0.1:5173/tally/ · app → /tally/app.html
npm test         # Vitest: data logic + screen render + waitlist tests
npm run build    # typecheck + production bundle (multi-page)
```

Two entry points: **`index.html`** = the marketing/landing + waitlist (the Pages front door), **`app.html`** = the product prototype. Deployed to GitHub Pages at `base: "/tally/"` via `.github/workflows/deploy-pages.yml`.

## Screens
- **Connect** — "see what your closet really cost" → connect inbox (simulated).
- **Spend** — the reveal: animated count-up of what you've spent, by category / retailer, with "worth noting" callouts.
- **Closet** — auto-populated item grid with cost-per-wear.
- **Share** — a screenshot-ready editorial spend card (the viral surface).

## Notes
- Data is currently hardcoded in `src/data.ts`, mirroring the Python pipeline's parsed receipts (`../tests/fixtures/emails`). Next: wire to the real ingestion API.
- Aesthetic direction is **clean editorial / premium** — restrained, serif, whitespace, muted category colors. Keep it that way.
