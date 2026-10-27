"use client";

import { useState, useTransition } from "react";
import type { MediaAsset } from "@/cms/types";
import { deleteMediaAction, updateMediaAltAction } from "@/cms/actions";
import styles from "../../admin.module.css";

export function MediaLibrary({ initial }: { initial: MediaAsset[] }) {
  const [items, setItems] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function onUpload(form: HTMLFormElement) {
    setError(null);
    setMessage(null);
    const body = new FormData(form);
    const res = await fetch("/api/cms/media", { method: "POST", body });
    const data = (await res.json()) as { item?: MediaAsset; error?: string };
    if (!res.ok || !data.item) {
      setError(data.error || "Upload failed.");
      return;
    }
    setItems((prev) => [data.item!, ...prev]);
    setMessage("Uploaded.");
    form.reset();
  }

  return (
    <div className={styles.stack}>
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Upload</h2>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
        <form
          className={styles.mediaUpload}
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            start(async () => onUpload(form));
          }}
        >
          <div className={styles.field}>
            <label htmlFor="file">File</label>
            <input id="file" name="file" type="file" accept="image/*,.pdf,application/pdf" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="alt">Alt text</label>
            <input id="alt" name="alt" placeholder="Describe the image" />
          </div>
          <button className={styles.btn} type="submit" disabled={pending}>
            {pending ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Library</h2>
        {items.length === 0 ? (
          <p className={styles.muted}>No files yet.</p>
        ) : (
          <ul className={styles.mediaGrid}>
            {items.map((item) => (
              <li key={item.id} className={styles.mediaCard}>
                {item.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.alt || item.filename} className={styles.mediaThumb} />
                ) : (
                  <div className={styles.mediaThumbFallback}>PDF</div>
                )}
                <div className={styles.mediaMeta}>
                  <strong>{item.filename}</strong>
                  <p className={styles.muted}>
                    {(item.size / 1024).toFixed(1)} KB · {item.mime}
                  </p>
                  <code className={styles.mediaUrl}>{item.url}</code>
                  <form
                    className={styles.mediaAltForm}
                    action={(fd) => {
                      start(async () => {
                        const res = await updateMediaAltAction(fd);
                        if (!res.ok) setError(res.error);
                        else {
                          setItems((prev) =>
                            prev.map((m) =>
                              m.id === item.id ? { ...m, alt: String(fd.get("alt") || "") } : m,
                            ),
                          );
                        }
                      });
                    }}
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <input name="alt" defaultValue={item.alt} placeholder="Alt text" />
                    <button className={`${styles.btn} ${styles.btnGhost}`} type="submit" disabled={pending}>
                      Save alt
                    </button>
                  </form>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnGhost}`}
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.url);
                        setMessage(`Copied ${item.url}`);
                      }}
                    >
                      Copy URL
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnDanger}`}
                      disabled={pending}
                      onClick={() => {
                        if (!confirm("Delete this file?")) return;
                        start(async () => {
                          const res = await deleteMediaAction(item.id);
                          if (!res.ok) setError(res.error);
                          else setItems((prev) => prev.filter((m) => m.id !== item.id));
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
