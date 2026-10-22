import { projects } from "@/data/projects";
import { RevealScope } from "@/components/motion/RevealScope";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard, type CardLayout } from "@/components/work/ProjectCard";
import styles from "./Work.module.css";


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
              Products we designed and prototyped on our own initiative — not client commissions — to
              show how we approach the problems we care about. Open any study for the full story.
            </p>
          }
        >
          Concept <span className="blue">studies</span>
        </SectionHeading>

        <div className={`grid ${styles.list}`}>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} layout={(i === 0 ? "featured" : "card") as CardLayout} />
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
