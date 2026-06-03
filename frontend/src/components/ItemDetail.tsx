import { CATEGORY_COLOR, estResaleCents, money, sellThrough, type Item } from "../data";

export default function ItemDetail({
  item,
  onClose,
  onWore,
}: {
  item: Item;
  onClose: () => void;
  onWore: () => void;
}) {
  const resale = estResaleCents(item);
  const pctOfPaid = Math.round((resale / item.priceCents) * 100);
  const st = sellThrough(item);

  return (
    <div className="detail">
      <button className="detail-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <div className="detail-body">
        <div
          className="detail-img"
          style={{
            background: `linear-gradient(150deg, ${CATEGORY_COLOR[item.category]} 0%, ${CATEGORY_COLOR[item.category]}cc 100%)`,
          }}
        >
          <span className="mono">{item.name[0]}</span>
          <span className="cat">{item.category}</span>
        </div>

        <div className="detail-head">
          <div className="rt">{item.retailer}</div>
          <h2>{item.name}</h2>
        </div>

        <div className="stat-row">
          <div className="st">
            <div className="n">{money(item.priceCents)}</div>
            <div className="l">Paid</div>
          </div>
          <div className="st">
            <div className="n">{item.wears > 0 ? money(Math.round(item.priceCents / item.wears)) : "—"}</div>
            <div className="l">Cost / wear</div>
          </div>
          <div className="st">
            <div className="n">{item.wears}</div>
            <div className="l">Wears</div>
          </div>
        </div>

        <button className="btn btn-ghost btn-block" onClick={onWore}>
          + I wore this
        </button>

        <hr className="rule" />

        <section>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Resale value · estimate
          </div>
          <div className="resale">
            <span className="big">{money(resale)}</span>
            <span className="pct">≈ {pctOfPaid}% of what you paid</span>
          </div>
          <div className="sell">
            <span className="sell-lbl">{st.label}</span>
            <span className="sell-bar">
              <span style={{ width: `${st.pct}%` }} />
            </span>
            <span className="sell-pct">{st.pct}%</span>
          </div>
          <div className="handoff">
            <button className="btn btn-ghost btn-block">List on Poshmark ↗</button>
            <button className="btn btn-ghost btn-block">List on eBay ↗</button>
          </div>
          <p className="fine" style={{ marginTop: 14 }}>
            Estimate from cross-platform sold comps. Tally never lists or sells
            for you — every listing is one tap, your call.
          </p>
        </section>
      </div>
    </div>
  );
}
