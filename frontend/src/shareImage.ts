// Renders the share card to a real PNG on a canvas (1080×1350) so it can be
// downloaded or shared. Uses the page's already-loaded Fraunces/Inter fonts.
import { money, type Summary } from "./data";

const W = 1080;
const H = 1350;

async function ensureFonts(): Promise<void> {
  const faces = [
    "600 32px Fraunces",
    "400 200px Fraunces",
    "400 46px Fraunces",
    "600 21px Inter",
    "400 26px Inter",
  ];
  try {
    await Promise.all(faces.map((f) => document.fonts.load(f)));
    await document.fonts.ready;
  } catch {
    /* fall back to system fonts */
  }
}

export async function renderShareCard(
  summary: Summary,
  resaleCents: number,
): Promise<HTMLCanvasElement> {
  await ensureFonts();
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d")!;

  // background
  const g = x.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#fffdf8");
  g.addColorStop(1, "#f1e9dc");
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);

  // inner editorial border
  x.strokeStyle = "#cdc4b1";
  x.lineWidth = 2;
  x.strokeRect(44, 44, W - 88, H - 88);

  const P = 96;
  const ink = "#1d1b16";
  const ink2 = "#4a463d";
  const soft = "#918a78";
  x.textBaseline = "alphabetic";

  const text = (
    s: string,
    px: number,
    py: number,
    font: string,
    color: string,
    spacing = 0,
  ) => {
    x.font = font;
    x.fillStyle = color;
    (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacing}px`;
    x.fillText(s, px, py);
  };

  text("TALLY", P, 182, "600 32px Fraunces, Georgia, serif", ink, 8);

  text("This year I spent", P, 560, "400 46px Fraunces, Georgia, serif", ink2);
  text(money(summary.ytdCents, false), P, 728, "400 200px Fraunces, Georgia, serif", ink, 0);
  text("on clothes.", P, 812, "400 46px Fraunces, Georgia, serif", ink2);

  x.strokeStyle = "#d8cfbc";
  x.lineWidth = 1;
  x.beginPath();
  x.moveTo(P, 902);
  x.lineTo(W - P, 902);
  x.stroke();

  const cols: [string, string][] = [
    [String(summary.count), "PIECES"],
    [money(summary.avgCents, false), "AVG / ITEM"],
    [summary.byCategory[0]?.label ?? "—", "TOP CATEGORY"],
  ];
  cols.forEach(([val, lab], i) => {
    const cx = P + i * 300;
    text(val, cx, 985, "400 42px Fraunces, Georgia, serif", ink);
    text(lab, cx, 1028, "600 20px Inter, sans-serif", soft, 1.5);
  });

  text(
    `Closet worth ≈ ${money(resaleCents, false)} to resell`,
    P,
    1130,
    "400 26px Inter, sans-serif",
    ink2,
  );
  text("the closet that fills itself", P, 1262, "400 26px Inter, sans-serif", soft);

  return c;
}

function canvasToBlob(c: HTMLCanvasElement): Promise<Blob> {
  return new Promise((res, rej) =>
    c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"),
  );
}

export async function downloadShareCard(summary: Summary, resaleCents: number): Promise<void> {
  const canvas = await renderShareCard(summary, resaleCents);
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tally-spend-card.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function shareShareCard(summary: Summary, resaleCents: number): Promise<void> {
  const canvas = await renderShareCard(summary, resaleCents);
  const blob = await canvasToBlob(canvas);
  const file = new File([blob], "tally-spend-card.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: "My Tally" });
  } else {
    await downloadShareCard(summary, resaleCents);
  }
}
