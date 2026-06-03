export default function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <div className="dots">
        <span className="bars">
          <i /> <i /> <i /> <i />
        </span>
        <span className="batt" />
      </div>
    </div>
  );
}
