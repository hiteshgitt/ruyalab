import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { ProjectCover } from "@/components/work/ProjectCover";
import { RevealScope } from "@/components/motion/RevealScope";
import { Button } from "@/components/ui/Button";
import { JsonLd, caseStudyLd } from "@/lib/seo";
import styles from "./page.module.css";

// Only the studies listed in data exist; anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const kind = project.status === "Live" ? "product" : "client project";
  return {
    title: `${project.name} — ${kind}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    // openGraph/twitter replace the parent objects wholesale, so restate the shared image.
    openGraph: {
      type: "article",
      siteName: "Ruyalab",
      title: `${project.name} — Ruyalab ${kind}`,
      description: project.summary,
      url: `/work/${project.slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Ruyalab ${kind}`,
      description: project.summary,
      images: ["/opengraph-image"],
    },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();

  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(i + 1) % projects.length];
  const { challenge, approach, outcome } = project.caseStudy;

  return (
    <article className={styles.page}>
      <JsonLd data={caseStudyLd(project)} />
      <RevealScope className="container">
        <nav aria-label="Breadcrumb" className={styles.crumbs}>
          <Link href="/#work" className="label">
            ← Selected work
          </Link>
        </nav>

        <header className={`grid ${styles.head}`}>
          <p className={`label ${styles.meta}`} data-reveal>
            <span className="paren accent">{project.status}</span> · {project.industry} · {project.year}
          </p>
          <h1 className={`display ${styles.title}`} data-split>
            {project.name}
          </h1>
          <p className={styles.summary} data-reveal>
            {project.summary}
          </p>
        </header>

        <div className={styles.cover} data-reveal>
          <ProjectCover visual={project.visual} className={styles.coverArt} />
        </div>

        <div className={`grid ${styles.body}`}>
          <dl className={styles.facts} data-reveal>
            <div>
              <dt className="label">{project.status === "Live" ? "Product" : "Client"}</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt className="label">Services</dt>
              <dd>
                {project.services.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="label">Status</dt>
              <dd>{project.status === "Live" ? "Live — built and run by Ruyalab" : "Client work — client confidential"}</dd>
            </div>
            {project.liveUrl && (
              <div>
                <dt className="label">Live</dt>
                <dd>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Visit site<span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div className={styles.story}>
            {[
              ["The question", challenge],
              ["The approach", approach],
              ["Where it landed", outcome],
            ].map(([h, body]) => (
              <section key={h} className={styles.block} data-reveal>
                <h2 className={styles.blockTitle}>{h}</h2>
                <p>{body}</p>
              </section>
            ))}
          </div>
        </div>

        <footer className={styles.next}>
          <p className="label">Next project</p>
          <Link href={next.caseStudy ? `/work/${next.slug}` : "/#work"} className={`display ${styles.nextLink}`}>
            {next.name} <span aria-hidden="true">→</span>
          </Link>
          <Button href="/#contact" variant="ghost" arrow>
            Start a project
          </Button>
        </footer>
      </RevealScope>
    </article>
  );
}
