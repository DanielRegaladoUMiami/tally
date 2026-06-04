import { useEffect, useState, type FormEvent } from "react";

// Plug a real endpoint here (Formspree / ConvertKit / your API) to capture
// emails for real. Empty string = demo mode (stores locally, shows success).
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
        const res = await fetch(WAITLIST_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("request failed");
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
