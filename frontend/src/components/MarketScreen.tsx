import {
  CATEGORY_COLOR,
  closetResaleCents,
  estResaleCents,
  ITEMS,
  money,
  portfolioChangePct,
  portfolioSeries,
  trendPct,
} from "../data";

const UP = "#5f7a5f";
const DOWN = "#9c5b47";

function linePoints(series: number[], w = 100, h = 34): string {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  return series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - 3 - ((v - min) / span) * (h - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function fmtTrend(t: number): string {
  const arrow = t > 0 ? "▲" : t < 0 ? "▼" : "•";
  return `${arrow} ${Math.abs(t)}%`;
}

export default function MarketScreen() {
  const value = closetResaleCents();
  const paid = ITEMS.reduce((s, i) => s + i.priceCents, 0);
  const holds = Math.round((value / paid) * 100);
  const chg = portfolioChangePct();
  const series = portfolioSeries();
  const up = chg >= 0;
  const movers = [...ITEMS].sort((a, b) => trendPct(b) - trendPct(a)).slice(0, 8);

  const pts = linePoints(series);
  const area = `0,34 ${pts} 100,34`;

  return (
    <>
      <header className="appbar">
        <span className="wordmark">Market</span>
        <span className="live">● Live</span>
      </header>
      <span className="eyebrow">Your closet, as a portfolio</span>

      <div className="hero" style={{ paddingBottom: 0 }}>
        <div className="amount" style={{ fontSize: 60 }}>
          {money(value, false)}
        </div>
        <div className="sub">
          resale value ·{" "}
          <span style={{ color: up ? UP : DOWN, fontWeight: 600 }}>
            {fmtTrend(chg)} this quarter
          </span>
        </div>
        <div className="sub" style={{ marginTop: 4 }}>
          you paid <b>{money(paid, false)}</b> · holds <b>{holds}%</b> of value
        </div>
      </div>

      <svg className="pf-spark" viewBox="0 0 100 34" preserveAspectRatio="none">
        <polygon points={area} fill={up ? "rgba(95,122,95,0.10)" : "rgba(156,91,71,0.10)"} />
        <polyline
          points={pts}
          fill="none"
          stroke={up ? UP : DOWN}
          strokeWidth="1.1"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <hr className="rule" />

      <section className="section">
        <span className="eyebrow">Top movers</span>
        {movers.map((it) => {
          const t = trendPct(it);
          return (
            <div className="mover" key={it.name}>
              <span className="m-name">
                <span className="dot" style={{ background: CATEGORY_COLOR[it.category] }} />
                <span>
                  <span className="mn">{it.name}</span>
                  <span className="mr">{it.retailer}</span>
                </span>
              </span>
              <span className="m-val">
                <span className="mv">{money(estResaleCents(it), false)}</span>
                <span className="mt" style={{ color: t >= 0 ? UP : DOWN }}>
                  {fmtTrend(t)}
                </span>
              </span>
            </div>
          );
        })}
      </section>

      <p className="fine" style={{ padding: "0 0 4px" }}>
        Estimated resale values from cross-platform sold comps. Not financial
        advice — your clothes, your call.
      </p>
    </>
  );
}
