"use client";

import { useEffect, useRef, useState } from "react";
import { LiveMascot } from "@/components/mascot/LiveMascot";
import { Mascot } from "@/components/mascot/Mascot";
import styles from "./DeviceMorph.module.css";

type Mode = "mobile" | "tablet" | "desktop";
const MODES: Mode[] = ["mobile", "tablet", "desktop"];
const CYCLE_MS = 4200;

/**
 * One device frame that morphs mobile → tablet → desktop, showing the same
 * product on every screen. The frame resizes while the screens cross-fade, so
 * content never visibly reflows. Auto-cycles while on screen (not under
 * reduced motion); hovering, focusing or choosing a device stops it.
 */
export function DeviceMorph() {
  const [mode, setMode] = useState<Mode>("mobile");
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const running = auto && !hover && inView && !reduced;
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
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className={styles.box} aria-hidden="true">
        <span className={styles.stand} />
        <div className={styles.frame} data-hit>
          <div className={styles.screen}>
            {/* Mobile — the live mascot app */}
            <div className={`${styles.layer} ${styles.lMobile}`}>
              <div className={styles.status}>
                <span>9:41</span>
                <span className={styles.island} />
                <svg viewBox="0 0 34 12">
                  <rect x="0" y="7" width="3" height="5" rx="1" fill="currentColor" />
                  <rect x="5" y="5" width="3" height="7" rx="1" fill="currentColor" />
                  <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
                  <rect x="17" y="1" width="16" height="10" rx="3" fill="none" stroke="currentColor" />
                  <rect x="19" y="3" width="10" height="6" rx="1.5" fill="currentColor" />
                </svg>
              </div>
              <div className={styles.appTop}>
                <span>( Ruyalab )</span>
                <span>( Vision )</span>
              </div>
              <p className={styles.appWord}>Ideas</p>
              <div className={styles.liveMascot}>
                <LiveMascot />
              </div>
              <div className={styles.appChips}>
                <span>Discover</span>
                <span>Design</span>
                <span data-on="true">Build</span>
              </div>
            </div>

            {/* Tablet — a dashboard */}
            <div className={`${styles.layer} ${styles.lTablet}`}>
              <div className={styles.dash}>
              <p className={styles.dashTitle}>Overview</p>
              <div className={styles.kpis}>
                <div className={styles.kpi} data-tone="yellow">
                  <span>Growth</span>
                  <svg viewBox="0 0 60 24" preserveAspectRatio="none">
                    <path d="M0 20 L10 16 L20 18 L30 10 L40 12 L50 5 L60 3" />
                  </svg>
                </div>
                <div className={styles.kpi}>
                  <span>Signals</span>
                  <svg viewBox="0 0 60 24" preserveAspectRatio="none">
                    <path d="M0 14 L10 18 L20 8 L30 12 L40 6 L50 10 L60 4" />
                  </svg>
                </div>
              </div>
              <div className={styles.chart}>
                {[42, 64, 38, 80, 56, 92, 70, 100].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} data-on={i === 7} />
                ))}
              </div>
              <div className={styles.rows}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className={styles.row}>
                    <b />
                    <span />
                    <i />
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* Desktop — a marketing site */}
            <div className={`${styles.layer} ${styles.lDesktop}`}>
              <div className={styles.browserBar}>
                <i />
                <i />
                <i />
                <span className={styles.url}>your-product.app</span>
              </div>
              <div className={styles.site}>
                <div className={styles.siteNav}>
                  <b className={styles.siteLogo} />
                  <span />
                  <span />
                  <span />
                  <b className={styles.sitePill}>Start</b>
                </div>
                <div className={styles.siteHero}>
                  <div>
                    <p className={styles.siteKicker}>( New ) + ( Launch )</p>
                    <p className={styles.siteTitle}>
                      Built for
                      <br />
                      <mark>what&apos;s next</mark>
                    </p>
                    <div className={styles.siteBtns}>
                      <b />
                      <b />
                    </div>
                  </div>
                  <Mascot pose="hero" decorative className={styles.siteMascot} />
                </div>
                <div className={styles.siteCards}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={styles.siteCard} data-i={i}>
                      <span />
                      <span />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
