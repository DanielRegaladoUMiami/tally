import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";
import { buildSummary } from "../data";
import SpendScreen from "./SpendScreen";
import ClosetScreen from "./ClosetScreen";
import MarketScreen from "./MarketScreen";
import ShareScreen from "./ShareScreen";

afterEach(cleanup);

const summary = buildSummary();

describe("App / Connect", () => {
  it("opens on the connect screen", () => {
    render(<App />);
    expect(screen.getByText(/closet really cost/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /connect email/i })).toBeInTheDocument();
  });

  it("shows a loading state after connecting", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /connect email/i }));
    expect(screen.getByText(/reading your receipts/i)).toBeInTheDocument();
  });
});

describe("SpendScreen", () => {
  it("renders the category breakdown from the summary", () => {
    render(<SpendScreen summary={summary} />);
    expect(screen.getByText("By category")).toBeInTheDocument();
    expect(screen.getByText("Knitwear")).toBeInTheDocument();
    expect(screen.getByText("$353.00")).toBeInTheDocument();
    expect(screen.getByText("Across time")).toBeInTheDocument();
  });
});

describe("ClosetScreen", () => {
  it("lists items with resale value and opens the detail + sell-it flow", () => {
    render(<ClosetScreen />);
    expect(screen.getByText("21 pieces")).toBeInTheDocument();
    expect(screen.getByText(/to resell/i)).toBeInTheDocument();

    const item = screen.getByText("Wilfred Effortless Cardigan");
    expect(item).toBeInTheDocument();

    // tap the tile → item detail overlay with resale + handoff
    fireEvent.click(item);
    expect(screen.getByText(/resale value/i)).toBeInTheDocument();
    expect(screen.getByText("$58.90")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Poshmark/i })).toBeInTheDocument();
  });

  it("increments wears on 'I wore this'", () => {
    render(<ClosetScreen />);
    fireEvent.click(screen.getByText("Wilfred Effortless Cardigan"));
    const detail = screen.getByText(/resale value/i).closest(".detail") as HTMLElement;
    const wearsBefore = within(detail).getByText("18"); // seeded wears
    expect(wearsBefore).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /I wore this/i }));
    expect(within(detail).getByText("19")).toBeInTheDocument();
  });
});

describe("MarketScreen", () => {
  it("renders the closet-as-portfolio view and top movers", () => {
    render(<MarketScreen />);
    expect(screen.getByText(/closet, as a portfolio/i)).toBeInTheDocument();
    expect(screen.getByText("Top movers")).toBeInTheDocument();
    expect(screen.getByText('Align High-Rise Legging 25"')).toBeInTheDocument();
    expect(screen.getAllByText("Lululemon").length).toBeGreaterThan(0);
  });
});

describe("ShareScreen", () => {
  it("renders the share card and export actions", () => {
    render(<ShareScreen summary={summary} />);
    expect(screen.getByText("This year I spent")).toBeInTheDocument();
    expect(screen.getByText("on clothes.")).toBeInTheDocument();
    expect(screen.getByText("$965")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save image/i })).toBeInTheDocument();
  });
});
