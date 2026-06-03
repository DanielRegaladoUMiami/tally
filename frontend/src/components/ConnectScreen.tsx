import { useState } from "react";

export default function ConnectScreen({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false);

  const connect = () => {
    setLoading(true);
    window.setTimeout(onDone, 1600);
  };

  return (
    <div className="connect">
      <div className="spacer" />
      <span className="kicker">Tally</span>
      <h1>
        See what your
        <br />
        closet really cost.
      </h1>
      <p>
        Connect your inbox. Tally reads your order emails and adds it up — no
        typing, no scanning tags. Your closet fills itself.
      </p>
      <div className="spacer" />
      {loading ? (
        <div className="loading">
          <span>Reading your receipts…</span>
          <span className="track">
            <span />
          </span>
        </div>
      ) : (
        <button className="btn btn-primary btn-block" onClick={connect}>
          Connect email
        </button>
      )}
      <p className="fine">
        Read-only. On-device parsing. We never sell your spend data.
      </p>
    </div>
  );
}
