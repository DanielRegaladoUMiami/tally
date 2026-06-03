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
  for (const i of items) {
    cat.set(i.category, (cat.get(i.category) ?? 0) + i.priceCents);
    ret.set(i.retailer, (ret.get(i.retailer) ?? 0) + i.priceCents);
  }

  const worn = items.filter((i) => i.wears > 0);
  return {
    totalCents: total,
    ytdCents: ytd,
    count: items.length,
    avgCents: Math.round(total / items.length),
    byCategory: sortDesc([...cat].map(([label, cents]) => ({ label, cents }))),
    byRetailer: sortDesc([...ret].map(([label, cents]) => ({ label, cents }))),
    mostExpensive: items.reduce((a, b) => (b.priceCents > a.priceCents ? b : a)),
    bestValue: worn.reduce((a, b) =>
      b.priceCents / b.wears < a.priceCents / a.wears ? b : a,
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
