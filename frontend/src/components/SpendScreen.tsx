import { useState } from "react";
import { CATEGORY_COLOR, costPerWear, money, type Summary } from "../data";
import CountUp from "./CountUp";

type Scope = "year" | "all";

export default function SpendScreen({ summary }: { summary: Summary }) {
  const [scope, setScope] = useState<Scope>("year");
  const amount = scope === "year" ? summary.ytdCents : summary.totalCents;
  const maxCat = summary.byCategory[0]?.cents ?? 1;
  const maxRet = summary.byRetailer[0]?.cents ?? 1;
  const most = summary.mostExpensive;
  const best = summary.bestValue;

  return (
    <>
      <header className="appbar">
        <span className="wordmark">Tally</span>
        <span className="avatar">S</span>
      </header>

      <span className="eyebrow">
        Your wardrobe · {scope === "year" ? "2026" : "all time"}
      </span>

      <div className="hero">
        <div className="amount">
          <CountUp key={scope} cents={amount} />
        </div>
        <div className="sub">
          <b>{summary.count}</b> pieces · {money(summary.avgCents)} average
        </div>
      </div>

      <div className="toggle">
        <button
          className={scope === "year" ? "active" : ""}
          onClick={() => setScope("year")}
        >
          This year
        </button>
        <button
          className={scope === "all" ? "active" : ""}
          onClick={() => setScope("all")}
        >
          All time
        </button>
      </div>

      <hr className="rule" />

      <section className="section">
        <span className="eyebrow">By category</span>
        {summary.byCategory.slice(0, 6).map((c) => (
          <div className="row" key={c.label}>
            <div className="top">
              <span className="name">
                <span className="dot" style={{ background: CATEGORY_COLOR[c.label] }} />
                {c.label}
              </span>
              <span className="val">{money(c.cents)}</span>
            </div>
            <div className="bar">
              <span
                style={{
                  width: `${Math.max(4, (c.cents / maxCat) * 100)}%`,
                  background: CATEGORY_COLOR[c.label],
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <hr className="rule" />

      <section className="section">
        <span className="eyebrow">Where it went</span>
        {summary.byRetailer.map((r) => (
          <div className="crow" key={r.label}>
            <span className="lbl">{r.label}</span>
            <span className="num">
              {money(r.cents)} · {Math.round((r.cents / maxRet) * 100)}%
            </span>
          </div>
        ))}
      </section>

      <hr className="rule" />

      <section className="section">
        <span className="eyebrow">Worth noting</span>
        <div className="callout">
          <span
            className="thumb"
            style={{ background: CATEGORY_COLOR[most.category] }}
          >
            {most.name[0]}
          </span>
          <div className="meta">
            <div className="k">Most extravagant</div>
            <div className="t">{most.name}</div>
            <div className="s">
              {money(most.priceCents)} · {most.retailer}
            </div>
          </div>
        </div>
        <div className="callout" style={{ marginTop: 12 }}>
          <span
            className="thumb"
            style={{ background: CATEGORY_COLOR[best.category] }}
          >
            {best.name[0]}
          </span>
          <div className="meta">
            <div className="k">Best value · {best.wears} wears</div>
            <div className="t">{best.name}</div>
            <div className="s">{costPerWear(best)}</div>
          </div>
        </div>
      </section>
    </>
  );
}
