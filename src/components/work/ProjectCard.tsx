import type { Project } from "@/data/projects";
import { ProjectCover } from "./ProjectCover";
import styles from "./ProjectCard.module.css";

export type CardLayout = "featured" | "card";

/**
 * A project presented as a self-explanatory card: cover art with the project
 * type tagged on top and an info bar (name, summary, services, CTA) on the
 * cover itself, so it reads as "a project" at a glance.
 */
export function ProjectCard({ project, index, layout }: { project: Project; index: number; layout: CardLayout }) {
  const href = project.caseStudy ? `/work/${project.slug}` : project.liveUrl;
  const external = !project.caseStudy && Boolean(project.liveUrl);
  const num = String(index + 1).padStart(2, "0");
  const titleId = `p-${project.slug}`;

  const body = (
    <>
      <div className={styles.zoom}>
        <div className={styles.art} data-parallax="0.08">
          {project.cover ? (
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              className={styles.img}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <ProjectCover visual={project.visual} className={styles.img} />
          )}
        </div>
      </div>

      <p className={styles.tag}>
        <span>( {project.status === "Live" ? "Live" : "Client"} {num} )</span>
        <span aria-hidden="true">+</span>
        <span>( {project.industry} )</span>
      </p>

      <div className={styles.info}>
        <div className={styles.infoMain}>
          <h3 id={titleId} className={`display ${styles.name}`}>
            {project.name}
          </h3>
          <p className={styles.summary}>{project.summary}</p>
          <ul className={styles.services} aria-label="Services">
            {project.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        {href && (
          <span className={styles.cta} aria-hidden="true">
            {external ? "Visit site" : project.status === "Live" ? "View product" : "View project"}
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  return (
    <article className={styles.card} data-layout={layout} data-reveal>
      {href ? (
        external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link} aria-labelledby={titleId}>
            {body}
          </a>
        ) : (
          <a href={href} className={styles.link} aria-labelledby={titleId}>
            {body}
          </a>
        )
      ) : (
        <div className={styles.link}>{body}</div>
      )}
    </article>
  );
}
