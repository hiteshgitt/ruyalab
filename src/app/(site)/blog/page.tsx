import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/cms/db";
import { site } from "@/lib/site";
import styles from "./blog.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes from ${site.name} on product, craft and shipping.`,
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await listPosts({ status: "published" });

  return (
    <div className={`container ${styles.wrap}`}>
      <p className="label">( Blog )</p>
      <h1 className={`display ${styles.title}`}>From the studio</h1>
      <p className={styles.lead}>
        Short notes on product, craft and what we are shipping — same team for design, engineering and AI.
      </p>

      {posts.length === 0 ? (
        <p className={styles.empty}>No posts published yet.</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className={styles.card}>
                <time dateTime={post.publishedAt || post.updatedAt}>
                  {new Date(post.publishedAt || post.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <h2>{post.title}</h2>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
