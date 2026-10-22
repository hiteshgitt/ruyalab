import { process } from "@/data/services";
import { RevealScope } from "@/components/motion/RevealScope";
import { Marquee } from "@/components/motion/Marquee";
import { Mascot, type MascotPose } from "@/components/mascot/Mascot";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Process.module.css";

const POSES: MascotPose[] = ["discover", "explore", "hero", "build", "launch"];

export function Process() {
  return (
    <section className={styles.section} aria-labelledby="process-title">
      <Marquee items={process.map((s) => s.title)} className={styles.ticker} speed={30} />
      <RevealScope className="container">
        <SectionHeading
          index="04"
          label="Process"
          id="process-title"
          aside={
            <p>
              A clear path from first conversation to launch — and beyond it. Each stage ends with
              something you can see, test and decide on.
            </p>
          }
        >
          How we <span className="blue">work</span>
        </SectionHeading>

        <ol className={styles.steps} data-reveal-group>
          {process.map((step, i) => (
            <li key={step.index} className={styles.step} data-reveal tabIndex={0}>
              <div className={styles.top}>
                <span className={`display ${styles.num}`}>{step.index}</span>
                <span className={`label ${styles.arrow}`} aria-hidden="true">
                  {i < process.length - 1 ? "→" : "✦"}
                </span>
              </div>
              <div className={styles.art}>
                <Mascot pose={POSES[i]} decorative className={styles.mascot} />
              </div>
              <div className={styles.text}>
                <h3 className={`display ${styles.title}`}>{step.title}</h3>
                <p className={styles.desc}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </RevealScope>
    </section>
  );
}
