import { useMemo, useState } from "react";
import { buildSummary } from "./data";
import StatusBar from "./components/StatusBar";
import ConnectScreen from "./components/ConnectScreen";
import SpendScreen from "./components/SpendScreen";
import ClosetScreen from "./components/ClosetScreen";
import ShareScreen from "./components/ShareScreen";
import TabBar, { type Tab } from "./components/TabBar";

export default function App() {
  const [connected, setConnected] = useState(false);
  const [tab, setTab] = useState<Tab>("spend");
  const summary = useMemo(() => buildSummary(), []);

  return (
    <div className="stage">
      <div className="phone">
        <div className="island" />
        <div className="screen">
          <StatusBar />
          {!connected ? (
            <ConnectScreen onDone={() => setConnected(true)} />
          ) : (
            <>
              <div className="body" key={tab}>
                {tab === "spend" && <SpendScreen summary={summary} />}
                {tab === "closet" && <ClosetScreen />}
                {tab === "share" && <ShareScreen summary={summary} />}
              </div>
              <TabBar active={tab} onChange={setTab} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
