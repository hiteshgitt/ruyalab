"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, Draggable, useGSAP, MQ } from "@/lib/gsap";
import styles from "./Sticker.module.css";

/**
 * A floating, draggable decoration. The outer element is what Draggable moves;
 * inner wrappers carry the pop-in and the idle float, so nothing fights over
 * `transform` (GSAP would otherwise bake a mid-animation scale into its own).
 * Dragging is enabled only for precise pointers (a touch drag would hijack
 * page scrolling) and when motion is allowed.
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
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motionOk} and ${MQ.finePointer}`, () => {
        const [d] = Draggable.create(el, {
          type: "x,y",
          bounds: bounds ? el.closest(bounds) ?? undefined : undefined,
          zIndexBoost: true,
          onPress() {
            gsap.to(el, { scale: 1.08, rotate: -4, duration: 0.25, ease: "back.out(3)" });
          },
          onRelease() {
            gsap.to(el, { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
          },
        });
        return () => d.kill();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`${styles.sticker} ${className ?? ""}`} style={style} aria-hidden="true">
      {/* Three layers, three owners of `transform`: drag (outer), pop-in, idle float */}
      <div className={styles.pop}>
        <div className={styles.float} style={{ animationDelay: `${-float}s` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
