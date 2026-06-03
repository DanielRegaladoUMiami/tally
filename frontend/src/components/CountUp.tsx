import { useEffect, useRef, useState } from "react";
import { money } from "../data";

type Props = { cents: number; withCents?: boolean; duration?: number };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animates a money value from 0 → cents on mount. */
export default function CountUp({ cents, withCents = true, duration = 1100 }: Props) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / duration);
      setValue(Math.round(easeOutCubic(t) * cents));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cents, duration]);

  return <>{money(value, withCents)}</>;
}
