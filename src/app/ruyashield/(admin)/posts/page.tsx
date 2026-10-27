import Link from "next/link";
import { loadAdminPosts } from "@/cms/actions";
import styles from "../../admin.module.css";

export default async function CmsPostsPage() {
  const posts = await loadAdminPosts();

  return (
    <div className={styles.dash}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Content</p>
          <h1 className={styles.title}>Blog posts</h1>
          <p className={styles.muted}>Draft, publish, and edit notes that appear on `/blog`.</p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.btn} href="/ruyashield/posts/new">
            New post
          </Link>
        </div>
      </header>

      <div className={styles.card}>
        {posts.length === 0 ? (
          <div className={styles.emptyPanel}>
            <p className={styles.muted}>No posts yet. Write the first one for LinkedIn / organic growth.</p>
            <Link className={styles.btn} href="/ruyashield/posts/new">
              Write the first post
            </Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/ruyashield/posts/${post.id}`}>{post.title}</Link>
                    <div className={styles.muted}>/{post.slug}</div>
                  </td>
                  <td>
                    <span className={styles.badge} data-tone={post.status}>
                      {post.status}
                    </span>
                  </td>
                  <td className={styles.muted}>{new Date(post.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
