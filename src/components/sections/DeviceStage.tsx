import type { ReactNode } from "react";
import styles from "./DeviceMorph.module.css";

const MODES = ["mobile", "tablet", "desktop"] as const;

/**
 * Device frame shell. The screens are server markup. Cycling and the pressed
 * state start on the mobile screen and stay there until the visitor interacts,
 * so the lab trace keeps a stable LCP element.
 */
export function DeviceStage({ children }: { children: ReactNode }) {
  return (
    <div className={styles.morph} data-device="" data-mode="mobile">
      {children}
      <div className={styles.switcher} data-hit role="group" aria-label="Preview the product on a device">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={m === "mobile"}
            className={styles.option}
            data-device-option={m}
          >
            {m}
            <span className={styles.timer} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
