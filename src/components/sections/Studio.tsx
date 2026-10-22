import { RevealScope } from "@/components/motion/RevealScope";
import { HeroVisual } from "@/components/three/HeroVisual";
import { WorkflowTabs } from "@/components/sections/WorkflowTabs";
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
          <div className={styles.visual} aria-hidden="true">
            <HeroVisual />
          </div>

          <div className={styles.content}>
            <p className={`label ${styles.meta}`} data-reveal>
              <span className="paren">03</span> + Studio
            </p>

            <h2 id="studio-title" className={`display ${styles.statement}`} data-scrub-words>
              Technology is the medium. <span className={styles.hl}>Possibility</span> is the point.
            </h2>

            <p className={styles.lead} data-reveal>
              Ruyalab sits where strategy, design and engineering overlap. The people shaping an idea are
              the people building it — so nothing gets lost between the first sketch and the final deploy.
            </p>

            <ol className={styles.pillars} data-reveal-group>
              {PILLARS.map((p, i) => (
                <li key={p.title} className={styles.pillar} data-reveal>
                  <span className={`label ${styles.pillarNum}`}>( 0{i + 1} )</span>
                  <h3 className={styles.pillarTitle}>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </RevealScope>

        <RevealScope className={styles.workflows}>
          <div className={styles.wfHead} data-reveal>
            <p className="label">
              <span className="paren">How we think</span>
            </p>
            <h3 className={`display ${styles.wfTitle}`}>Our playbooks</h3>
          </div>
          <div data-reveal>
            <WorkflowTabs />
          </div>
        </RevealScope>
      </div>
    </section>
  );
}
