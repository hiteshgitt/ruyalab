import { RevealScope } from "@/components/motion/RevealScope";
import { LiveMascot } from "@/components/mascot/LiveMascot";
import { Playbooks } from "@/components/sections/Playbooks";
import styles from "./Studio.module.css";

const PILLARS = [
  {
    title: "Strategic thinking",
    body: "We start with the problem, not the medium. Every project begins by understanding what success looks like — for the business and for the people using it.",
  },
  {
    title: "Thoughtful design",
    body: "Considered systems over decoration. Interfaces that are clear first and memorable second — never one at the expense of the other.",
  },
  {
    title: "Engineering discipline",
    body: "Typed, tested and measured. We build for performance, accessibility and maintainability, so what launches keeps working long after.",
  },
];

export function Studio() {
  return (
    <section id="studio" className={styles.section} aria-labelledby="studio-title">
      <div className="container">
        <RevealScope className={styles.panel}>
          <div className={styles.topbar} data-reveal>
            <p className={`label ${styles.meta}`}>
              <span className="paren">03</span> + Studio
            </p>
            <p className={`label ${styles.meta} ${styles.metaR}`} aria-hidden="true">
              ( Strategy ) + ( Design ) + ( Engineering )
            </p>
          </div>

          <div className={styles.main}>
            <div className={styles.copy}>
              <h2 id="studio-title" className={`display ${styles.statement}`} data-scrub-words>
                Technology is the medium. <span className={styles.hl}>Possibility</span> is the point.
              </h2>
              <p className={styles.lead} data-reveal>
                Ruyalab sits where strategy, design, engineering and AI overlap. The people shaping an
                idea are the people building it — so nothing gets lost between the first sketch and the
                final deploy.
              </p>
            </div>

            {/* Our vision mascot — its eye follows the visitor */}
            <div className={styles.stage} aria-hidden="true" data-reveal>
              <span className={`${styles.ring} ${styles.ringA}`} />
              <span className={`${styles.ring} ${styles.ringB}`} />
              <span className={styles.glow} />
              <div className={styles.mascot}>
                <LiveMascot />
              </div>
              <span className={styles.caption}>( Vision ) + ( Ruya )</span>
            </div>
          </div>

          <ol className={styles.pillars} data-reveal-group>
            {PILLARS.map((p, i) => (
              <li key={p.title} className={styles.pillar} data-reveal>
                <span className={`label ${styles.pillarNum}`}>( 0{i + 1} )</span>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </RevealScope>

        <RevealScope className={styles.workflows}>
          <div data-reveal>
            <Playbooks />
          </div>
        </RevealScope>
      </div>
    </section>
  );
}
