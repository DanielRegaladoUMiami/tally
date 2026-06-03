import { useMemo, useState } from "react";
import {
  CATEGORY_COLOR,
  closetResaleCents,
  costPerWear,
  estResaleCents,
  ITEMS,
  money,
  type Category,
  type Item,
} from "../data";
import ItemDetail from "./ItemDetail";

const FILTERS: ("All" | Category)[] = ["All", "Knitwear", "Denim", "Tops", "Dresses", "Shoes"];

export default function ClosetScreen() {
  const [items, setItems] = useState<Item[]>(() => ITEMS.map((i) => ({ ...i })));
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [selected, setSelected] = useState<string | null>(null);

  const shown = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );
  const worth = closetResaleCents(items);
  const selectedItem = items.find((i) => i.name === selected) ?? null;

  const wore = (name: string) =>
    setItems((prev) => prev.map((i) => (i.name === name ? { ...i, wears: i.wears + 1 } : i)));

  return (
    <>
      <header className="appbar">
        <span className="wordmark">Closet</span>
        <span
          className="avatar"
          style={{ width: "auto", borderRadius: 999, padding: "0 12px", fontFamily: "var(--sans)", fontSize: 12 }}
        >
          {items.length} pieces
        </span>
      </header>
      <p className="closet-sub">
        Worth <b>≈ {money(worth, false)}</b> to resell · auto-built from your receipts
      </p>

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
        {shown.map((it) => (
          <article className="tile" key={it.name} onClick={() => setSelected(it.name)}>
            <div
              className="img"
              style={{
                background: `linear-gradient(150deg, ${CATEGORY_COLOR[it.category]} 0%, ${CATEGORY_COLOR[it.category]}cc 100%)`,
              }}
            >
              <span className="mono">{it.name[0]}</span>
              <span className="resale-pill">≈ {money(estResaleCents(it), false)}</span>
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

      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          onClose={() => setSelected(null)}
          onWore={() => wore(selectedItem.name)}
        />
      )}
    </>
  );
}
