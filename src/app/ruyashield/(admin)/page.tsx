import Link from "next/link";
import { loadAdminMeta, loadAdminPosts, loadAdminSocials } from "@/cms/actions";
import styles from "../admin.module.css";

export default async function CmsOverviewPage() {
  const [posts, socials, meta] = await Promise.all([loadAdminPosts(), loadAdminSocials(), loadAdminMeta()]);
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;
  const recent = posts.slice(0, 6);

  return (
    <div className={styles.dash}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Studio CMS</p>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.muted}>
            Publish posts for organic reach, keep social links current, and grow into enquiries and media from
            this sidebar.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.btn} href="/ruyashield/posts/new">
            New blog post
          </Link>
          <Link className={`${styles.btn} ${styles.btnGhost}`} href="/blog" target="_blank">
            Open /blog
          </Link>
        </div>
      </header>

      <div className={styles.statGrid}>
        <div className={styles.stat}>
          <span>Published</span>
          <strong>{published}</strong>
        </div>
        <div className={styles.stat}>
          <span>Drafts</span>
          <strong>{drafts}</strong>
        </div>
        <div className={styles.stat}>
          <span>Social links</span>
          <strong>{socials.length}</strong>
        </div>
        <div className={styles.stat}>
          <span>Storage</span>
          <strong>{meta.storage === "d1" ? "D1" : "Local"}</strong>
          <em>{meta.storage === "local" ? "Dev file store" : "Cloudflare"}</em>
        </div>
      </div>

      <div className={styles.split}>
        <section className={styles.card}>
          <div className={styles.row}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
              Recent posts
            </h2>
            <Link className={`${styles.btn} ${styles.btnGhost}`} href="/ruyashield/posts">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className={styles.emptyPanel}>
              <p className={styles.muted}>No posts yet. Your first published note can feed LinkedIn and `/blog`.</p>
              <Link className={styles.btn} href="/ruyashield/posts/new">
                Write the first post
              </Link>
            </div>
          ) : (
            <ul className={styles.recentList}>
              {recent.map((post) => (
                <li key={post.id}>
                  <Link href={`/ruyashield/posts/${post.id}`}>
                    <span className={styles.recentTitle}>{post.title}</span>
                    <span className={styles.badge} data-tone={post.status}>
                      {post.status}
                    </span>
                  </Link>
                  <p className={styles.muted}>
                    /{post.slug} · {new Date(post.updatedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className={styles.sideStack}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Shortcuts</h2>
            <div className={styles.tileGrid}>
              <Link className={styles.tile} href="/ruyashield/posts/new">
                <strong>New post</strong>
                <span>Draft or publish Markdown</span>
              </Link>
              <Link className={styles.tile} href="/ruyashield/posts">
                <strong>Blog posts</strong>
                <span>Edit drafts and live posts</span>
              </Link>
              <Link className={styles.tile} href="/ruyashield/social">
                <strong>Social setup</strong>
                <span>{socials.length ? `${socials.length} link${socials.length === 1 ? "" : "s"}` : "Add LinkedIn / GitHub"}</span>
              </Link>
              <Link className={styles.tile} href="/" target="_blank">
                <strong>Public site</strong>
                <span>ruyalab.com</span>
              </Link>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Checklist</h2>
            <ul className={styles.checkList}>
              <li data-done={published > 0 ? "true" : "false"}>Publish at least one blog post</li>
              <li data-done={socials.length > 0 ? "true" : "false"}>Add social profile links</li>
              <li data-done="false">Copy LinkedIn kickoffs from CMS → post on LinkedIn</li>
              <li data-done="false">Wire Cloudflare D1 for production</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
