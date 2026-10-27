import Link from "next/link";
import { site } from "@/lib/site";
import { listPosts } from "@/cms/db";
import { loadAdminSeo, saveSeoAction } from "@/cms/actions";
import { SeoForm } from "./SeoForm";
import styles from "../../admin.module.css";

export default async function CmsSeoPage() {
  const [seo, published] = await Promise.all([
    loadAdminSeo(),
    listPosts({ status: "published" }).then((p) => p.length),
  ]);

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
      detail: "Uses the meta description below when saved",
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
          <h1 className={styles.title}>SEO</h1>
          <p className={styles.muted}>
            Edit title, description and tagline here. The checklist below is status-only — GSC indexing still needs
            your Search Console click.
          </p>
        </div>
      </header>

      <SeoForm initial={seo} action={saveSeoAction} />

      <div className={styles.card} style={{ marginTop: "1.25rem" }}>
        <h2 className={styles.sectionTitle}>Status checklist</h2>
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
