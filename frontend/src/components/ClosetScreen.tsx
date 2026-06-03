import { useMemo, useState } from "react";
import { CATEGORY_COLOR, costPerWear, ITEMS, money, type Category } from "../data";

const FILTERS: ("All" | Category)[] = ["All", "Knitwear", "Denim", "Tops", "Dresses", "Shoes"];

export default function ClosetScreen() {
  const [filter, setFilter] = useState<"All" | Category>("All");
  const items = useMemo(
    () => (filter === "All" ? ITEMS : ITEMS.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <>
      <header className="appbar">
        <span className="wordmark">Closet</span>
        <span className="avatar" style={{ width: "auto", borderRadius: 999, padding: "0 12px", fontFamily: "var(--sans)", fontSize: 12 }}>
          {ITEMS.length} pieces
        </span>
      </header>

      <div className="chips">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`chip${filter === f ? " on" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid">
        {items.map((it) => (
          <article className="tile" key={it.name}>
            <div
              className="img"
              style={{
                background: `linear-gradient(150deg, ${CATEGORY_COLOR[it.category]} 0%, ${CATEGORY_COLOR[it.category]}cc 100%)`,
              }}
            >
              <span className="mono">{it.name[0]}</span>
              <span className="cat">{it.category}</span>
            </div>
            <div className="info">
              <div className="nm">{it.name}</div>
              <div className="rt">{it.retailer}</div>
              <div className="pr">
                <span>{money(it.priceCents)}</span>
                <span className="cpw">{costPerWear(it)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
