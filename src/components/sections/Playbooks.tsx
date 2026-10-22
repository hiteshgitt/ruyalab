"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { playbooks } from "@/data/services";
import { Mascot } from "@/components/mascot/Mascot";
import styles from "./Playbooks.module.css";

const STEP_MS = 2800;

/**
 * Interactive playbooks: pick a playbook (tabs), and the stepper walks through
 * its five stages with the mascot gliding to the active one. Auto-advance runs
 * only while visible, pauses on hover/focus or any manual choice, and has an
 * explicit pause control; it never runs under reduced motion.
 */
export function Playbooks() {
  const [book, setBook] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(true);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const steps = playbooks[book].steps;
  const current = steps[step];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  const running = playing && !hovering && inView && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => window.clearInterval(t);
  }, [running, steps.length]);

  const choose = (i: number) => {
    setStep(i);
    setPlaying(false);
  };

  const selectBook = (i: number) => {
    setBook(i);
    setStep(0);
  };

  const onTabKey = (e: KeyboardEvent) => {
    const last = playbooks.length - 1;
    const next =
      e.key === "ArrowRight" ? (book === last ? 0 : book + 1)
      : e.key === "ArrowLeft" ? (book === 0 ? last : book - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    selectBook(next);
    tabs.current[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <div className={styles.head}>
        <div>
          <p className="label">
            <span className="paren accent">How we think</span>
          </p>
          <h3 className={`display ${styles.title}`}>
            Our <span className="blue">playbooks</span>
          </h3>
        </div>
        <div role="tablist" aria-label="Playbooks" className={styles.tabs} onKeyDown={onTabKey}>
          {playbooks.map((p, i) => (
            <button
              key={p.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={book === i}
              aria-controls={`${id}-panel`}
              tabIndex={book === i ? 0 : -1}
              className={styles.tab}
              onClick={() => selectBook(i)}
            >
              <span className={styles.tabNum}>0{i + 1}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${book}`}
        className={styles.panel}
        style={{ "--active": step, "--n": steps.length } as CSSProperties}
      >
        <div className={styles.rail}>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.fill} />
          </div>
          <span className={styles.glider} aria-hidden="true">
            <Mascot pose={current.pose} decorative className={styles.gliderImg} />
          </span>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={`${book}-${s.title}`}>
                <button
                  type="button"
                  className={styles.step}
                  aria-current={step === i ? "step" : undefined}
                  data-done={i < step}
                  onClick={() => choose(i)}
                  onFocus={() => choose(i)}
                >
                  <span className={styles.dot}>{i + 1}</span>
                  <span className={`display ${styles.stepTitle}`}>{s.title}</span>
                  <span className={styles.stepShort}>{s.short}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.detail} aria-live="polite" key={`${book}-${step}`}>
          <div className={styles.detailArt}>
            <Mascot pose={current.pose} decorative className={styles.detailImg} />
          </div>
          <div className={styles.detailText}>
            <p className="label">
              Step {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </p>
            <p className={`display ${styles.detailTitle}`}>
              {current.title} <span className={styles.detailShort}>— {current.short}</span>
            </p>
            <p className={styles.detailBody}>{current.detail}</p>
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.ctrl}
              aria-label="Previous step"
              onClick={() => choose((step - 1 + steps.length) % steps.length)}
            >
              ←
            </button>
            <button
              type="button"
              className={styles.ctrl}
              aria-label="Next step"
              onClick={() => choose((step + 1) % steps.length)}
            >
              →
            </button>
            {!reduced && (
              <button
                type="button"
                className={`${styles.ctrl} ${styles.play}`}
                aria-pressed={!playing}
                aria-label={playing ? "Pause autoplay" : "Play autoplay"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? "❚❚" : "▶"}
              </button>
            )}
          </div>
          {running && <span className={styles.timer} aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
