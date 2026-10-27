"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ActionResult } from "@/cms/actions";
import type { Post } from "@/cms/types";
import styles from "../../admin.module.css";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function PostEditor({
  post,
  saveAction,
  deleteAction,
}: {
  post?: Post | null;
  saveAction: (formData: FormData) => Promise<ActionResult>;
  deleteAction?: () => Promise<ActionResult>;
}) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <h1 className={styles.title} style={{ margin: 0 }}>
          {post ? "Edit post" : "New post"}
        </h1>
        <Link className={`${styles.btn} ${styles.btnGhost}`} href="/ruyashield/posts">
          Back
        </Link>
      </div>

      <form
        action={(fd) => {
          start(async () => {
            setError(null);
            const res = await saveAction(fd);
            if (!res.ok) setError(res.error);
          });
        }}
      >
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              if (!slugTouched) setSlug(slugify(next));
            }}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={3} defaultValue={post?.excerpt || ""} style={{ minHeight: "5rem" }} />
        </div>

        <div className={styles.field}>
          <label htmlFor="body">Body (Markdown)</label>
          <textarea id="body" name="body" defaultValue={post?.body || ""} placeholder={"## Heading\n\nParagraph with **bold** and [links](https://ruyalab.com/)."} />
        </div>

        <div className={styles.field}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={post?.status || "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.btn} type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </button>
          {post?.status === "published" && (
            <Link className={`${styles.btn} ${styles.btnGhost}`} href={`/blog/${post.slug}`} target="_blank">
              View live
            </Link>
          )}
        </div>
      </form>

      {deleteAction && (
        <form
          style={{ marginTop: "1.5rem" }}
          action={() => {
            start(async () => {
              if (!confirm("Delete this post permanently?")) return;
              const res = await deleteAction();
              if (!res.ok) setError(res.error);
            });
          }}
        >
          <button className={`${styles.btn} ${styles.btnDanger}`} type="submit" disabled={pending}>
            Delete post
          </button>
        </form>
      )}
    </div>
  );
}
