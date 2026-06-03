export type Tab = "spend" | "closet" | "share";

const ICONS: Record<Tab, JSX.Element> = {
  spend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <line x1="6" y1="20" x2="6" y2="13" />
      <line x1="12" y1="20" x2="12" y2="7" />
      <line x1="18" y1="20" x2="18" y2="11" />
    </svg>
  ),
  closet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.2a1.9 1.9 0 1 1 1.5 1.9c-.7.2-1 .6-1 1.2" />
      <path d="M12 9.6 4.3 15c-.9.6-.5 2 .6 2h14.2c1.1 0 1.5-1.4.6-2L12 9.6Z" />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M5 12v6.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V12" />
    </svg>
  ),
};

const LABELS: Record<Tab, string> = { spend: "Spend", closet: "Closet", share: "Share" };

export default function TabBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <nav className="tabbar">
      {(Object.keys(LABELS) as Tab[]).map((t) => (
        <button
          key={t}
          className={`tab${active === t ? " active" : ""}`}
          onClick={() => onChange(t)}
        >
          {ICONS[t]}
          <span className="tl">{LABELS[t]}</span>
        </button>
      ))}
    </nav>
  );
}
