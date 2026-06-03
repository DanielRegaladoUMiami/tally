import { money, type Summary } from "../data";

export default function ShareScreen({ summary }: { summary: Summary }) {
  const topCategory = summary.byCategory[0]?.label ?? "—";
  return (
    <>
      <header className="appbar">
        <span className="wordmark">Share</span>
      </header>
      <span className="eyebrow">Your year, ready to post</span>

      <div className="poster-wrap" style={{ marginTop: 16 }}>
        <div className="poster">
          <span className="pm">Tally</span>
          <span className="lead">This year I spent</span>
          <span className="big">{money(summary.ytdCents, false)}</span>
          <span className="lead2">on clothes.</span>
          <div className="stats">
            <div className="st">
              <div className="n">{summary.count}</div>
              <div className="l">Pieces</div>
            </div>
            <div className="st">
              <div className="n">{money(summary.avgCents, false)}</div>
              <div className="l">Avg / item</div>
            </div>
            <div className="st">
              <div className="n" style={{ fontSize: 17 }}>{topCategory}</div>
              <div className="l">Top category</div>
            </div>
          </div>
          <span className="tag">the closet that fills itself</span>
        </div>

        <div className="share-actions">
          <button className="btn btn-ghost btn-block">Save image</button>
          <button className="btn btn-primary btn-block">Share</button>
        </div>
      </div>
    </>
  );
}
