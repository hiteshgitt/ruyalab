import type { CSSProperties } from "react";
import styles from "./Marquee.module.css";

/**
 * Infinite mono ticker — "+ ( DESIGN ) ( ENGINEERING ) +". Pure CSS; pauses on
 * hover and stops under reduced motion. Decorative: the same words appear as
 * real content elsewhere, so the whole band is hidden from assistive tech.
 */
export function Marquee({
  items,
  reverse = false,
  speed = 40,
  className,
}: {
  items: string[];
  reverse?: boolean;
  /** Seconds per loop. */
  speed?: number;
  className?: string;
}) {
  const run = (
    <span className={styles.run}>
      {items.map((item, i) => (
        <span key={i} className={styles.item}>
          {i % 2 === 0 && <span className={styles.plus}>+</span>}
          <span className="paren">{item}</span>
        </span>
      ))}
    </span>
  );
  return (
    <div
      className={`${styles.marquee} ${className ?? ""}`}
      data-reverse={reverse}
      style={{ "--speed": `${speed}s` } as CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.track}>
        {run}
        {run}
      </div>
    </div>
  );
}
