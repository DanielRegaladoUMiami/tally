// Wardrobe data for the prototype — mirrors the Python demo's parsed receipts
// (tests/fixtures/emails). Later this comes from the real ingestion API.

export type Item = {
  name: string;
  retailer: string;
  priceCents: number;
  category: Category;
  wears: number;
  date: string; // ISO
};

export type Category =
  | "Knitwear"
  | "Denim"
  | "Tops"
  | "Bottoms"
  | "Dresses"
  | "Activewear"
  | "Outerwear"
  | "Skirts"
  | "Bags"
  | "Shoes"
  | "Accessories";

// Muted, editorial palette (no neon) — used sparingly as small marks.
export const CATEGORY_COLOR: Record<Category, string> = {
  Dresses: "#B6837A",
  Denim: "#6E7E8C",
  Tops: "#C2A878",
  Bottoms: "#8C9A86",
  Shoes: "#A98467",
  Outerwear: "#7A6E8C",
  Knitwear: "#B08968",
  Skirts: "#C3A3A3",
  Activewear: "#6F8A8A",
  Bags: "#9A8C7B",
  Accessories: "#A6A08F",
};

export const ITEMS: Item[] = [
  { name: "Ribbed Bodycon Mini Dress", retailer: "SHEIN", priceCents: 1299, category: "Dresses", wears: 9, date: "2025-03-12" },
  { name: "Oversized Graphic Tee", retailer: "SHEIN", priceCents: 850, category: "Tops", wears: 14, date: "2025-03-12" },
  { name: "High Waist Skinny Jeans", retailer: "SHEIN", priceCents: 1700, category: "Denim", wears: 22, date: "2025-03-12" },
  { name: "Strappy Block Heel Sandals", retailer: "SHEIN", priceCents: 2199, category: "Shoes", wears: 3, date: "2025-03-12" },
  { name: "Wilfred Effortless Cardigan", retailer: "Aritzia", priceCents: 12800, category: "Knitwear", wears: 18, date: "2026-01-19" },
  { name: "TNA Cozy Fleece Sweatpant", retailer: "Aritzia", priceCents: 6400, category: "Bottoms", wears: 31, date: "2026-01-19" },
  { name: "Babaton Contour Tank Top", retailer: "Aritzia", priceCents: 3500, category: "Tops", wears: 12, date: "2026-01-19" },
  { name: "Lirika Floral Maxi Dress", retailer: "Princess Polly", priceCents: 8900, category: "Dresses", wears: 2, date: "2026-03-02" },
  { name: "Faux Leather Mini Skirt", retailer: "Princess Polly", priceCents: 5200, category: "Skirts", wears: 6, date: "2026-03-02" },
  { name: "Chunky Knit Sweater", retailer: "Princess Polly", priceCents: 5800, category: "Knitwear", wears: 7, date: "2026-03-02" },
  { name: "Gold Hoop Earrings", retailer: "Princess Polly", priceCents: 1800, category: "Accessories", wears: 40, date: "2026-03-02" },
  { name: "BDG High-Waisted Baggy Jean", retailer: "Urban Outfitters", priceCents: 6900, category: "Denim", wears: 19, date: "2025-01-24" },
  { name: "UO Cropped Hoodie", retailer: "Urban Outfitters", priceCents: 4900, category: "Knitwear", wears: 16, date: "2025-01-24" },
  { name: "iets frans Faux Fur Jacket", retailer: "Urban Outfitters", priceCents: 8900, category: "Outerwear", wears: 4, date: "2025-01-24" },
  { name: 'Align High-Rise Legging 25"', retailer: "Lululemon", priceCents: 9800, category: "Activewear", wears: 48, date: "2026-02-09" },
  { name: "Scuba Oversized Half-Zip", retailer: "Lululemon", priceCents: 11800, category: "Knitwear", wears: 25, date: "2026-02-09" },
  { name: "Swiftly Tech Short-Sleeve Tee", retailer: "Lululemon", priceCents: 6800, category: "Tops", wears: 20, date: "2026-02-09" },
  { name: "The A&F Mara Tube Top", retailer: "Abercrombie", priceCents: 4000, category: "Tops", wears: 5, date: "2026-05-15" },
  { name: "Curve Love Ankle Jean", retailer: "Abercrombie", priceCents: 8900, category: "Denim", wears: 11, date: "2026-05-15" },
  { name: "Linen-Blend Tailored Short", retailer: "Abercrombie", priceCents: 6000, category: "Bottoms", wears: 0, date: "2026-05-15" },
  { name: "Crossbody Tote Bag", retailer: "Abercrombie", priceCents: 4800, category: "Bags", wears: 8, date: "2026-05-15" },
];

export const THIS_YEAR = 2026;

export type Summary = {
  totalCents: number;
  ytdCents: number;
  count: number;
  avgCents: number;
  byCategory: { label: Category; cents: number }[];
  byRetailer: { label: string; cents: number }[];
  byMonth: { label: string; cents: number }[]; // chronological "YYYY-MM"
  mostExpensive: Item;
  bestValue: Item; // lowest cost-per-wear among worn items
};

function sortDesc<T extends { cents: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => b.cents - a.cents);
}

export function buildSummary(items: Item[] = ITEMS): Summary {
  const total = items.reduce((s, i) => s + i.priceCents, 0);
  const ytd = items
    .filter((i) => Number(i.date.slice(0, 4)) === THIS_YEAR)
    .reduce((s, i) => s + i.priceCents, 0);

  const cat = new Map<Category, number>();
  const ret = new Map<string, number>();
  const mon = new Map<string, number>();
  for (const i of items) {
    cat.set(i.category, (cat.get(i.category) ?? 0) + i.priceCents);
    ret.set(i.retailer, (ret.get(i.retailer) ?? 0) + i.priceCents);
    const ym = i.date.slice(0, 7);
    mon.set(ym, (mon.get(ym) ?? 0) + i.priceCents);
  }

  const worn = items.filter((i) => i.wears > 0);
  return {
    totalCents: total,
    ytdCents: ytd,
    count: items.length,
    avgCents: Math.round(total / items.length),
    byCategory: sortDesc([...cat].map(([label, cents]) => ({ label, cents }))),
    byRetailer: sortDesc([...ret].map(([label, cents]) => ({ label, cents }))),
    byMonth: [...mon]
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([label, cents]) => ({ label, cents })),
    mostExpensive: items.reduce((a, b) => (b.priceCents > a.priceCents ? b : a)),
    // lowest cost-per-wear among worn items; fall back to all items if none worn
    bestValue: (worn.length ? worn : items).reduce((a, b) =>
      b.priceCents / Math.max(1, b.wears) < a.priceCents / Math.max(1, a.wears) ? b : a,
    ),
  };
}

export function money(cents: number, withCents = true): string {
  const v = cents / 100;
  return withCents
    ? v.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : "$" + Math.round(v).toLocaleString("en-US");
}

export function costPerWear(item: Item): string {
  if (item.wears <= 0) return "not worn yet";
  return money(Math.round(item.priceCents / item.wears)) + " / wear";
}

// ----- Resale valuation (MOCK) -------------------------------------------- //
// Placeholder for the real cross-platform sold-comps engine. Depreciation by
// category × brand desirability. Clearly an estimate in the UI.
const RESALE_CAT: Record<Category, number> = {
  Bags: 0.55, Shoes: 0.45, Outerwear: 0.5, Denim: 0.45, Knitwear: 0.4,
  Dresses: 0.38, Activewear: 0.45, Tops: 0.3, Bottoms: 0.35, Skirts: 0.38,
  Accessories: 0.5,
};
const RESALE_BRAND: Record<string, number> = {
  Lululemon: 1.2, Aritzia: 1.15, "Free People": 1.1, Abercrombie: 1.0,
  "Urban Outfitters": 0.95, "Princess Polly": 0.85, SHEIN: 0.6,
};

export function estResaleCents(i: Item): number {
  const c = RESALE_CAT[i.category] ?? 0.4;
  const b = RESALE_BRAND[i.retailer] ?? 1;
  return Math.max(300, Math.round((i.priceCents * c * b) / 10) * 10);
}

export function sellThrough(i: Item): { pct: number; label: string } {
  const b = RESALE_BRAND[i.retailer] ?? 1;
  const fast = ["Denim", "Bags", "Activewear", "Outerwear"].includes(i.category);
  let pct = 48 + (b - 1) * 70 + (fast ? 10 : 0);
  pct = Math.max(22, Math.min(92, Math.round(pct)));
  const label = pct >= 65 ? "Sells fast" : pct >= 45 ? "Steady demand" : "Slow to sell";
  return { pct, label };
}

export function closetResaleCents(items: Item[] = ITEMS): number {
  return items.reduce((s, i) => s + estResaleCents(i), 0);
}

// ----- "Closet as a portfolio" (MOCK market movement) --------------------- //
// Quarterly % change in an item's resale value. Desirable brands + liquid
// categories trend up; fast-fashion trends down. Deterministic.
export function trendPct(i: Item): number {
  const b = RESALE_BRAND[i.retailer] ?? 1; // 0.6..1.2
  const liquid = ["Denim", "Bags", "Activewear", "Outerwear", "Shoes"].includes(i.category);
  const hash = [...i.name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const p = (b - 1) * 30 + (liquid ? 3 : -1) + ((hash % 7) - 3);
  return Math.round(Math.max(-14, Math.min(12, p)) * 10) / 10;
}

// Resale-value-weighted aggregate change for the whole closet.
export function portfolioChangePct(items: Item[] = ITEMS): number {
  const val = closetResaleCents(items);
  if (val === 0) return 0;
  const w = items.reduce((s, i) => s + estResaleCents(i) * trendPct(i), 0);
  return Math.round((w / val) * 10) / 10;
}

// 6-point series of portfolio value (cents), ending at the current total.
export function portfolioSeries(items: Item[] = ITEMS): number[] {
  const total = closetResaleCents(items);
  const chg = portfolioChangePct(items) / 100;
  const start = total / (1 + chg || 1);
  const out: number[] = [];
  for (let i = 0; i < 6; i++) {
    const base = start + (total - start) * (i / 5);
    const wiggle = 1 + (((i * 37) % 9) - 4) / 400; // ±~1% deterministic
    out.push(Math.round(base * wiggle));
  }
  out[5] = total;
  return out;
}
