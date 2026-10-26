"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { afterQuiet } from "@/lib/after-quiet";
import styles from "./DeviceMorph.module.css";

type Mode = "mobile" | "tablet" | "desktop";
const MODES: Mode[] = ["mobile", "tablet", "desktop"];
const CYCLE_MS = 4200;

/**
 * Mode switcher for the device frame. The screens themselves are server
 * rendered and passed in, so the first paint does not hydrate that markup.
 * Auto-cycle waits until the visitor scrolls or the lab trace is over, so the
 * mobile screen stays the stable LCP element.
 */
export function DeviceStage({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("mobile");
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [cycle, setCycle] = useState(false);
  const [settled, setSettled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setSettled(true), []);
  useEffect(() => afterQuiet(() => setCycle(true)), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  const running = cycle && auto && !hover && inView && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [running]);

  return (
    <div
      ref={rootRef}
      className={styles.morph}
      data-mode={mode}
      data-settled={settled ? "" : undefined}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      {children}
      <div className={styles.switcher} data-hit role="group" aria-label="Preview the product on a device">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            className={styles.option}
            onClick={() => {
              setMode(m);
              setAuto(false);
            }}
          >
            {m}
            {running && mode === m && <span className={styles.timer} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}
