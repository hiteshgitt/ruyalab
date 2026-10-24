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
              Products we built and run ourselves, alongside web applications and websites we built for
              clients. Client names are kept confidential. Open any project for the full story.
            </p>
          }
        >
          Products <span className="blue">&amp; client work</span>
        </SectionHeading>

        <div className={`grid ${styles.list}`}>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} layout={(project.status === "Live" ? "featured" : "card") as CardLayout} />
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
