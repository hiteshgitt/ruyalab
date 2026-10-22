import { projects } from "@/data/projects";
import { RevealScope } from "@/components/motion/RevealScope";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard, type CardLayout } from "@/components/work/ProjectCard";
import styles from "./Work.module.css";

const LAYOUTS: CardLayout[] = ["wide", "tall", "offset", "pano"];

export function Work() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <RevealScope className="container">
        <SectionHeading
          index="01"
          label={`Selected work — ${String(projects.length).padStart(2, "0")}`}
          id="work-title"
          aside={
            <p>
              Self-initiated concept studies — original explorations, not client commissions — that
              show how we approach the problems we care about most.
            </p>
          }
        >
          Ideas, made <span className="blue">tangible</span>
        </SectionHeading>

        <div className={`grid ${styles.list}`}>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} layout={LAYOUTS[i % LAYOUTS.length]} />
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
