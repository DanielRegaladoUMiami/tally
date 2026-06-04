import Waitlist from "./Waitlist";

// prefix public assets with the deploy base (e.g. "/tally/") for GitHub Pages
const asset = (p: string) => import.meta.env.BASE_URL + p;

const STEPS = [
  {
    n: "01",
    t: "Connect your inbox",
    d: "Tally reads your order confirmations. Nothing to type, no tags to scan — your closet fills itself.",
  },
  {
    n: "02",
    t: "See the number",
    d: "Your total clothing spend — this year and all-time — by brand, category and month. In the first minute.",
  },
  {
    n: "03",
    t: "Know what it’s worth",
    d: "Every piece valued for resale. List the ones you never wear in two taps — your closet, as a portfolio.",
  },
];

export default function Landing() {
  return (
    <div className="lp">
      <nav className="lp-nav">
        <span className="lp-mark">Tally</span>
        <span className="lp-navlinks">
          <a className="lp-navlink" href={asset("app.html")}>
            See the app
          </a>
          <a className="lp-navcta" href="#join">
            Join waitlist
          </a>
        </span>
      </nav>

      <header className="lp-hero">
        <div className="lp-hero-copy">
          <span className="lp-eyebrow">The closet that fills itself</span>
          <h1>
            How much have you <em>actually</em> spent on clothes?
          </h1>
          <p className="lp-sub">
            Connect your inbox and Tally adds up every dollar — no typing — then
            shows what your closet is worth to resell.
          </p>
          <div id="join">
            <Waitlist id="hero-email" />
          </div>
          <p className="lp-fine">Free · read-only · we never sell your spend data.</p>
        </div>
        <div className="lp-hero-art">
          <img src={asset("screens/spend.png")} alt="Tally spend screen" />
        </div>
      </header>

      <section className="lp-reveal">
        <p>
          The average Gen-Z shopper has <em>no idea</em>. Tally turns years of
          scattered receipts into one honest number — and one screenshot worth
          sharing.
        </p>
      </section>

      <section className="lp-steps">
        {STEPS.map((s) => (
          <div className="lp-step" key={s.n}>
            <span className="lp-step-n">{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </section>

      <section className="lp-show">
        <div className="lp-show-text">
          <span className="lp-eyebrow">Your closet, as a portfolio</span>
          <h2>Watch its resale value move.</h2>
          <p>
            Tally values every piece from real sold-comps and shows your closet
            like a stock ticker — what holds value, what to sell, what it’s all
            worth today.
          </p>
        </div>
        <div className="lp-show-art">
          <img src={asset("screens/market.png")} alt="Tally market screen" />
        </div>
      </section>

      <section className="lp-show alt">
        <div className="lp-show-text">
          <span className="lp-eyebrow">Made to share</span>
          <h2>The number everyone’s screenshotting.</h2>
          <p>
            One tap turns your year into a clean, postable card. The reveal that
            travels — and brings the next person in.
          </p>
        </div>
        <div className="lp-show-art">
          <img src={asset("screens/share.png")} alt="Tally share card" />
        </div>
      </section>

      <section className="lp-privacy">
        <p>
          <strong>Privacy first.</strong> Read-only access, minimal scopes,
          on-device parsing where we can. We never sell your spend data —{" "}
          <em>ever</em>.
        </p>
      </section>

      <section className="lp-final">
        <h2>See what your closet really cost.</h2>
        <Waitlist id="footer-email" />
        <p className="lp-fine">Join early — the first invites go to the waitlist.</p>
      </section>

      <footer className="lp-footer">
        <span>Tally — the closet that fills itself</span>
        <a href="https://github.com/DanielRegaladoUMiami/tally">GitHub</a>
      </footer>
    </div>
  );
}
