import { useEffect, useState, type FormEvent } from "react";

// Google Apps Script web-app URL (ends in /exec) that appends to a Sheet.
// See docs/waitlist-setup.md. Empty string = demo mode (local only, no capture).
const WAITLIST_ENDPOINT = "";
const STORAGE_KEY = "tally_waitlisted";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "done" | "error";

export default function Waitlist({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) setStatus("done");
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    try {
      if (WAITLIST_ENDPOINT) {
        // Apps Script can't answer a CORS preflight, so use no-cors + a
        // "simple" content-type. The response is opaque, so a fetch that
        // resolves (no network error) is treated as success.
        await fetch(WAITLIST_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ email, source: "landing" }),
        });
      }
      localStorage.setItem(STORAGE_KEY, email);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="wl-done">
        You’re on the list ✓ <span>We’ll email you when it’s your turn.</span>
      </p>
    );
  }

  return (
    <form className="wl" onSubmit={submit} noValidate>
      <input
        id={id}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        aria-label="Email address"
      />
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
      </button>
      {status === "error" && <span className="wl-err">Enter a valid email.</span>}
    </form>
  );
}
