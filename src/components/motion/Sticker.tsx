import type { CSSProperties, ReactNode } from "react";
import styles from "./Sticker.module.css";

/**
 * A floating decoration. Dragging is attached later, and only for precise
 * pointers, so a touch drag never hijacks scrolling.
 */
export function Sticker({
  children,
  className,
  float = 0,
  bounds,
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Float phase offset in seconds, so stickers don't bob in unison. */
  float?: number;
  /** CSS selector for the drag bounds (closest ancestor match). */
  bounds?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`${styles.sticker} ${className ?? ""}`} style={style} aria-hidden="true" data-sticker="" data-bounds={bounds}>
      {/* Three layers, three owners of `transform`: drag (outer), pop-in, idle float */}
      <div className={styles.pop}>
        <div className={styles.float} style={{ animationDelay: `${-float}s` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
