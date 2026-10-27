"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/cms/actions";
import type { SeoSettings } from "@/cms/types";
import { DEFAULT_SEO } from "@/lib/site";
import styles from "../../admin.module.css";

export function SeoForm({
  initial,
  action,
}: {
  initial: SeoSettings;
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [tagline, setTagline] = useState(initial.tagline);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className={styles.card}
      action={(fd) => {
        start(async () => {
          setError(null);
          setMessage(null);
          const res = await action(fd);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          if (res.seo) {
            setTitle(res.seo.title);
            setDescription(res.seo.description);
            setTagline(res.seo.tagline);
          }
          setMessage("Saved. Title, description and tagline apply on the next page load.");
        });
      }}
    >
      <h2 className={styles.sectionTitle}>Editable site SEO</h2>
      <p className={styles.muted}>
        These override homepage / default meta, Open Graph, JSON-LD description, and llms.txt. Robots and sitemaps
        stay in code on purpose.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <div className={styles.field}>
        <label htmlFor="seo-title">Default title ({title.length}/70)</label>
        <input
          id="seo-title"
          name="title"
          value={title}
          maxLength={70}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="seo-description">Meta description ({description.length}/320)</label>
        <textarea
          id="seo-description"
          name="description"
          rows={4}
          value={description}
          maxLength={320}
          required
          minLength={40}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="seo-tagline">Tagline ({tagline.length}/160)</label>
        <input
          id="seo-tagline"
          name="tagline"
          value={tagline}
          maxLength={160}
          onChange={(e) => setTagline(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={() => {
            setTitle(DEFAULT_SEO.title);
            setDescription(DEFAULT_SEO.description);
            setTagline(DEFAULT_SEO.tagline);
          }}
        >
          Reset to defaults
        </button>
        <button className={styles.btn} type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save SEO"}
        </button>
      </div>
    </form>
  );
}
