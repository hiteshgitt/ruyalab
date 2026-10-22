import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { ProjectCover } from "./ProjectCover";
import styles from "./ProjectCard.module.css";

export type CardLayout = "wide" | "tall" | "offset" | "pano";

export function ProjectCard({ project, index, layout }: { project: Project; index: number; layout: CardLayout }) {
  const href = project.caseStudy ? `/work/${project.slug}` : project.liveUrl;
  const external = !project.caseStudy && Boolean(project.liveUrl);
  const num = String(index + 1).padStart(2, "0");

  const media = (
    <div className={styles.media}>
      <div className={styles.zoom}>
      <div className={styles.art} data-parallax="0.12">
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={styles.img}
          />
        ) : (
          <ProjectCover visual={project.visual} className={styles.img} />
        )}
      </div>
      </div>
      {href && (
        <span className={styles.chip} aria-hidden="true">
          {external ? "Visit site" : "View study"}
        </span>
      )}
    </div>
  );

  return (
    <article className={styles.card} data-layout={layout} data-reveal>
      {href ? (
        external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link} aria-labelledby={`p-${project.slug}`}>
            {media}
          </a>
        ) : (
          <Link href={href} className={styles.link} aria-labelledby={`p-${project.slug}`}>
            {media}
          </Link>
        )
      ) : (
        media
      )}

      <div className={styles.info}>
        <span className={`label ${styles.num}`}>{num}</span>
        <div className={styles.titleRow}>
          <h3 id={`p-${project.slug}`} className={styles.name}>
            {href ? (
              <Link href={href} className={styles.nameLink} tabIndex={-1}>
                {project.name}
              </Link>
            ) : (
              project.name
            )}
          </h3>
          <p className={styles.summary}>{project.summary}</p>
        </div>
        <dl className={styles.facts}>
          <div>
            <dt className="visually-hidden">Industry</dt>
            <dd>{project.industry}</dd>
          </div>
          <div>
            <dt className="visually-hidden">Services</dt>
            <dd>{project.services.join(" · ")}</dd>
          </div>
          <div className={styles.status}>
            <dt className="visually-hidden">Year and status</dt>
            <dd>
              {project.year} <span className={styles.badge}>{project.status}</span>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
