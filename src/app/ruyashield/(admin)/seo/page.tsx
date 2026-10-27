import Link from "next/link";
import { site } from "@/lib/site";
import { listPosts } from "@/cms/db";
import { isCmsAuthed } from "@/cms/auth";
import { redirect } from "next/navigation";
import styles from "../../admin.module.css";

export default async function CmsSeoPage() {
  if (!(await isCmsAuthed())) redirect("/ruyashield/login");
  const published = (await listPosts({ status: "published" })).length;

  const checks = [
    {
      label: "GA4 (site tag)",
      detail: site.gaId ? `Live as ${site.gaId} via deferred /boot/enhance.js` : "Missing",
      ok: Boolean(site.gaId),
      note: "GTM container is optional — do not dual-tag if GA4 is already firing.",
    },
    {
      label: "robots.txt",
      detail: `${site.url}/robots.txt — Allow / · Disallow /ruyashield`,
      ok: true,
      href: "/robots.txt",
    },
    {
      label: "Core sitemap",
      detail: `${site.url}/sitemap.xml — homepage + case studies (static asset)`,
      ok: true,
      href: "/sitemap.xml",
    },
    {
      label: "Blog sitemap",
      detail: `${site.url}/blog/sitemap.xml — published CMS posts (${published})`,
      ok: true,
      href: "/blog/sitemap.xml",
    },
    {
      label: "llms.txt",
      detail: "AI crawler map for ChatGPT / Claude / Perplexity",
      ok: true,
      href: "/llms.txt",
    },
    {
      label: "CMS admin",
      detail: "/ruyashield is noindex + robots Disallow",
      ok: true,
    },
  ];

  return (
    <div className={styles.dash}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Growth</p>
          <h1 className={styles.title}>SEO status</h1>
          <p className={styles.muted}>
            Robots, sitemaps and analytics are owned in code (more reliable for Google than editing them
            in a CMS). This page is the checklist — GSC indexing still needs your Search Console click.
          </p>
        </div>
      </header>

      <div className={styles.card}>
        <ul className={styles.seoList}>
          {checks.map((c) => (
            <li key={c.label} data-ok={c.ok ? "true" : "false"}>
              <div>
                <strong>{c.label}</strong>
                <p className={styles.muted}>{c.detail}</p>
                {"note" in c && c.note ? <p className={styles.muted}>{c.note}</p> : null}
              </div>
              {c.href ? (
                <Link className={`${styles.btn} ${styles.btnGhost}`} href={c.href} target="_blank">
                  Open
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
