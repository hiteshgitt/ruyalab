import type { CSSProperties } from "react";
import { playbooks } from "@/data/services";
import { Mascot } from "@/components/mascot/Mascot";
import styles from "./Playbooks.module.css";

/**
 * Playbooks render on the first book and step. Switching, autoplay, and the
 * gliding mascot are attached after the page has gone quiet.
 */
export function Playbooks() {
  const book = playbooks[0];
  const step = book.steps[0];

  return (
    <div className={styles.root} data-playbooks="" data-book="0" data-step="0" data-playing="true">
      <script
        type="application/json"
        id="playbook-data"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(playbooks).replace(/</g, "\\u003c") }}
      />
      <div className={styles.head}>
        <div>
          <p className="label">
            <span className="paren accent">How we think</span>
          </p>
          <h3 className={`display ${styles.title}`}>
            Our <span className="blue">playbooks</span>
          </h3>
        </div>
        <div role="tablist" aria-label="Playbooks" className={styles.tabs} data-tabs="">
          {playbooks.map((p, i) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              id={`playbook-tab-${i}`}
              aria-selected={i === 0}
              aria-controls="playbook-panel"
              tabIndex={i === 0 ? 0 : -1}
              className={styles.tab}
              data-tab={i}
            >
              <span className={styles.tabNum}>0{i + 1}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id="playbook-panel"
        aria-labelledby="playbook-tab-0"
        className={styles.panel}
        data-panel=""
        style={{ "--active": 0, "--n": book.steps.length } as CSSProperties}
      >
        <div className={styles.rail}>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.fill} />
          </div>
          <span className={styles.glider} aria-hidden="true" data-glider="">
            <Mascot pose={step.pose} decorative className={styles.gliderImg} />
          </span>
          <ol className={styles.steps} data-steps="">
            {book.steps.map((s, i) => (
              <li key={s.title}>
                <button type="button" className={styles.step} aria-current={i === 0 ? "step" : undefined} data-step={i}>
                  <span className={styles.dot}>{i + 1}</span>
                  <span className={`display ${styles.stepTitle}`} data-step-title="">
                    {s.title}
                  </span>
                  <span className={styles.stepShort} data-step-short="">
                    {s.short}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.detail} aria-live="polite" data-detail="">
          <div className={styles.detailArt} data-detail-art="">
            <Mascot pose={step.pose} decorative className={styles.detailImg} />
          </div>
          <div className={styles.detailText}>
            <p className="label" data-step-label="">
              Step {String(1).padStart(2, "0")} / {String(book.steps.length).padStart(2, "0")}
            </p>
            <p className={`display ${styles.detailTitle}`} data-detail-title="">
              {step.title} <span className={styles.detailShort}>— {step.short}</span>
            </p>
            <p className={styles.detailBody} data-detail-body="">
              {step.detail}
            </p>
          </div>
          <div className={styles.controls}>
            <button type="button" className={styles.ctrl} aria-label="Previous step" data-step-prev="">
              ←
            </button>
            <button type="button" className={styles.ctrl} aria-label="Next step" data-step-next="">
              →
            </button>
            <button
              type="button"
              className={`${styles.ctrl} ${styles.play}`}
              aria-pressed="false"
              aria-label="Pause autoplay"
              data-step-play=""
            >
              ❚❚
            </button>
          </div>
          <span className={styles.timer} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
