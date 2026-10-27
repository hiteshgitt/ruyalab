import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/cms/db";
import { renderMarkdown } from "@/cms/markdown";
import { site } from "@/lib/site";
import styles from "../blog.module.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { publishedOnly: true });
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || post.title,
      url: `/blog/${post.slug}`,
      siteName: site.name,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { publishedOnly: true });
  if (!post) notFound();

  return (
    <article className={`container ${styles.wrap}`}>
      <p className="label">
        <Link href="/blog">( Blog )</Link>
      </p>
      <h1 className={`display ${styles.title}`}>{post.title}</h1>
      <p className={styles.meta}>
        <time dateTime={post.publishedAt || post.updatedAt}>
          {new Date(post.publishedAt || post.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </p>
      {post.excerpt ? <p className={styles.lead}>{post.excerpt}</p> : null}
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
    </article>
  );
}
