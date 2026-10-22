import type { CSSProperties } from "react";
import { stack } from "@/data/services";
import { RevealScope } from "@/components/motion/RevealScope";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechLogo, brandColor } from "@/components/ui/TechLogo";
import styles from "./Technology.module.css";

export function Technology() {
  return (
    <section className={styles.section} aria-labelledby="tech-title">
      <RevealScope className="container">
        <SectionHeading
          index="05"
          label="Technology"
          id="tech-title"
          aside={
            <p>
              A deliberately focused stack. We pick proven tools, learn them deeply, and add new ones only
              when they earn their place.
            </p>
          }
        >
          Tools we <span className="accent">trust</span>
        </SectionHeading>

        <div className={styles.groups}>
          {stack.map((group) => (
            <div key={group.label} className={styles.group}>
              <h3 className={styles.groupHead} data-reveal>
                <span className="label paren">{group.label}</span>
                <span className={styles.groupNote}>{group.note}</span>
              </h3>
              <ul className={styles.items} data-reveal-group>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={styles.item}
                    data-reveal
                    style={{ "--brand": brandColor(item) } as CSSProperties}
                  >
                    <TechLogo name={item} className={styles.logo} />
                    <span className={styles.name}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
