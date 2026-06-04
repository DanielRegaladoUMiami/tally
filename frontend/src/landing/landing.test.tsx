import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Waitlist from "./Waitlist";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("Waitlist", () => {
  it("rejects an invalid email", () => {
    render(<Waitlist id="t" />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "not-an-email" } });
    fireEvent.click(screen.getByRole("button", { name: /join the waitlist/i }));
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });

  it("confirms after a valid email and remembers it", async () => {
    render(<Waitlist id="t" />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "sofia@umiami.edu" } });
    fireEvent.click(screen.getByRole("button", { name: /join the waitlist/i }));
    expect(await screen.findByText(/on the list/i)).toBeInTheDocument();
    expect(localStorage.getItem("tally_waitlisted")).toBe("sofia@umiami.edu");
  });

  it("shows the confirmed state on revisit", () => {
    localStorage.setItem("tally_waitlisted", "sofia@umiami.edu");
    render(<Waitlist id="t" />);
    expect(screen.getByText(/on the list/i)).toBeInTheDocument();
  });
});
