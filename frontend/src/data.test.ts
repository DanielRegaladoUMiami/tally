import { describe, expect, it } from "vitest";
import {
  buildSummary,
  closetResaleCents,
  costPerWear,
  estResaleCents,
  ITEMS,
  money,
  portfolioChangePct,
  portfolioSeries,
  sellThrough,
  trendPct,
  type Item,
} from "./data";

const find = (needle: string): Item => {
  const it = ITEMS.find((i) => i.name.includes(needle));
  if (!it) throw new Error(`fixture not found: ${needle}`);
  return it;
};

describe("money", () => {
  it("formats with and without cents", () => {
    expect(money(123248)).toBe("$1,232.48");
    expect(money(123248, false)).toBe("$1,232");
    expect(money(0)).toBe("$0.00");
  });
});

describe("buildSummary", () => {
  const s = buildSummary();

  it("totals the whole closet", () => {
    expect(s.count).toBe(21);
    expect(s.totalCents).toBe(123248); // $1,232.48
    expect(s.totalCents).toBe(ITEMS.reduce((a, i) => a + i.priceCents, 0));
  });

  it("computes this-year (2026) spend", () => {
    const manual = ITEMS.filter((i) => i.date.startsWith("2026")).reduce((a, i) => a + i.priceCents, 0);
    expect(s.ytdCents).toBe(manual);
    expect(s.ytdCents).toBe(96500); // $965.00
    expect(s.ytdCents).toBeLessThan(s.totalCents);
  });

  it("averages per item", () => {
    expect(s.avgCents).toBe(Math.round(s.totalCents / s.count));
    expect(s.avgCents).toBe(5869);
  });

  it("breakdowns sum to the total and are sorted high→low", () => {
    expect(s.byCategory.reduce((a, c) => a + c.cents, 0)).toBe(s.totalCents);
    expect(s.byRetailer.reduce((a, r) => a + r.cents, 0)).toBe(s.totalCents);
    for (let i = 1; i < s.byCategory.length; i++) {
      expect(s.byCategory[i - 1].cents).toBeGreaterThanOrEqual(s.byCategory[i].cents);
    }
    expect(s.byCategory[0].label).toBe("Knitwear");
    expect(s.byRetailer[0].label).toBe("Lululemon");
  });

  it("orders months chronologically", () => {
    const months = s.byMonth.map((m) => m.label);
    expect(months).toEqual([...months].sort());
    expect(months[0]).toBe("2025-01");
  });

  it("finds the most expensive and best-value items", () => {
    expect(s.mostExpensive.name).toBe("Wilfred Effortless Cardigan"); // $128
    expect(s.bestValue.name).toBe("Gold Hoop Earrings"); // $0.45 / wear
  });
});

describe("costPerWear", () => {
  it("divides price by wears, flags unworn", () => {
    expect(costPerWear({ ...find("Gold Hoop"), wears: 40 })).toBe("$0.45 / wear");
    expect(costPerWear({ ...find("Linen-Blend"), wears: 0 })).toBe("not worn yet");
  });
});

describe("estResaleCents", () => {
  it("depreciates by category × brand, with a floor", () => {
    expect(estResaleCents(find("Wilfred Effortless Cardigan"))).toBe(5890); // $58.90
    // cheap fast-fashion floors at $3
    expect(estResaleCents(find("Ribbed Bodycon Mini Dress"))).toBe(300);
  });

  it("never exceeds what was paid and stays >= $3", () => {
    for (const it of ITEMS) {
      const r = estResaleCents(it);
      expect(r).toBeGreaterThanOrEqual(300);
      expect(r).toBeLessThanOrEqual(it.priceCents);
    }
  });
});

describe("sellThrough", () => {
  it("rates desirable + liquid items as fast, clamps the range", () => {
    const align = sellThrough(find("Align"));
    expect(align.label).toBe("Sells fast");
    expect(align.pct).toBeGreaterThanOrEqual(65);

    const cardigan = sellThrough(find("Wilfred"));
    expect(cardigan.label).toBe("Steady demand");

    for (const it of ITEMS) {
      const { pct } = sellThrough(it);
      expect(pct).toBeGreaterThanOrEqual(22);
      expect(pct).toBeLessThanOrEqual(92);
    }
  });
});

describe("portfolio / market", () => {
  it("closet resale value is positive and below what was paid", () => {
    const worth = closetResaleCents();
    expect(worth).toBe(ITEMS.reduce((a, i) => a + estResaleCents(i), 0));
    expect(worth).toBeGreaterThan(0);
    expect(worth).toBeLessThan(buildSummary().totalCents);
  });

  it("keeps every item's trend within the clamped band", () => {
    for (const it of ITEMS) {
      const t = trendPct(it);
      expect(t).toBeGreaterThanOrEqual(-14);
      expect(t).toBeLessThanOrEqual(12);
    }
    expect(trendPct(find("Align"))).toBeGreaterThan(0); // Lululemon holds value
    expect(trendPct(find("Ribbed Bodycon Mini Dress"))).toBeLessThan(0); // SHEIN drops
  });

  it("aggregate change is finite and in range", () => {
    const c = portfolioChangePct();
    expect(Number.isFinite(c)).toBe(true);
    expect(Math.abs(c)).toBeLessThanOrEqual(14);
  });

  it("value series has 6 points and ends at the current value", () => {
    const series = portfolioSeries();
    expect(series).toHaveLength(6);
    expect(series[5]).toBe(closetResaleCents());
    expect(series.every((v) => v > 0)).toBe(true);
  });
});
