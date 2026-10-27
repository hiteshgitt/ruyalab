"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/cms/actions";
import type { LinkedInDraft } from "@/cms/types";
import styles from "../../admin.module.css";

const BLANK_TEMPLATE = `Hook — one line about the problem.

What we built / how we think about it.

Proof or CTA → https://ruyalab.com/`;

export function LinkedInManager({
  initial,
  createAction,
  updateAction,
  deleteAction,
}: {
  initial: LinkedInDraft[];
  createAction: (formData: FormData) => Promise<ActionResult>;
  updateAction: (formData: FormData) => Promise<ActionResult>;
  deleteAction: (formData: FormData) => Promise<ActionResult>;
}) {
  const [drafts, setDrafts] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function openNew(withTemplate: boolean) {
    setCreating(true);
    setEditingId(null);
    setTitle("");
    setBody(withTemplate ? BLANK_TEMPLATE : "");
    setError(null);
    setMessage(null);
  }

  function startEdit(draft: LinkedInDraft) {
    setCreating(false);
    setEditingId(draft.id);
    setTitle(draft.title);
    setBody(draft.body);
    setError(null);
    setMessage(null);
  }

  function cancelForm() {
    setCreating(false);
    setEditingId(null);
    setTitle("");
    setBody("");
    setError(null);
  }

  return (
    <div className={styles.dash} style={{ padding: 0 }}>
      <div className={styles.row} style={{ marginBottom: "1rem" }}>
        <p className={styles.muted} style={{ margin: 0, maxWidth: "36rem" }}>
          Create drafts here, then Copy into LinkedIn. Nothing auto-posts.
        </p>
        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => openNew(true)}>
            New from template
          </button>
          <button type="button" className={styles.btn} onClick={() => openNew(false)}>
            Create new post
          </button>
        </div>
      </div>

      {(creating || editingId) && (
        <form
          className={styles.card}
          style={{ marginBottom: "1.25rem" }}
          action={(fd) => {
            start(async () => {
              setError(null);
              setMessage(null);
              const action = editingId ? updateAction : createAction;
              if (editingId) fd.set("id", editingId);
              const res = await action(fd);
              if (!res.ok) {
                setError(res.error);
                return;
              }
              if (res.draft) {
                if (editingId) {
                  setDrafts((prev) => prev.map((d) => (d.id === editingId ? res.draft! : d)));
                  setMessage("Draft updated.");
                } else {
                  setDrafts((prev) => [res.draft!, ...prev]);
                  setMessage("Draft created.");
                }
              }
              cancelForm();
            });
          }}
        >
          <h2 className={styles.sectionTitle}>{editingId ? "Edit post" : "New LinkedIn post"}</h2>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.field}>
            <label htmlFor="li-title">Title (for you)</label>
            <input
              id="li-title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Positioning — week of Oct 27"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="li-body">Post text</label>
            <textarea
              id="li-body"
              name="body"
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={20}
            />
          </div>
          <div className={styles.actions}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={cancelForm}>
              Cancel
            </button>
            <button className={styles.btn} type="submit" disabled={pending}>
              {pending ? "Saving…" : editingId ? "Save changes" : "Save draft"}
            </button>
          </div>
        </form>
      )}

      {message && <p className={styles.success}>{message}</p>}

      <div className={styles.kickoffGrid}>
        {drafts.map((draft) => (
          <article key={draft.id} className={styles.card}>
            <div className={styles.row}>
              <div>
                <h2 className={styles.sectionTitle} style={{ marginBottom: "0.35rem" }}>
                  {draft.title}
                </h2>
                <p className={styles.muted}>Updated {new Date(draft.updatedAt).toLocaleString()}</p>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={async () => {
                    await navigator.clipboard.writeText(draft.body);
                    setCopiedId(draft.id);
                    window.setTimeout(() => setCopiedId((id) => (id === draft.id ? null : id)), 1600);
                  }}
                >
                  {copiedId === draft.id ? "Copied" : "Copy post"}
                </button>
                <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => startEdit(draft)}>
                  Edit
                </button>
                <form
                  action={(fd) => {
                    fd.set("id", draft.id);
                    start(async () => {
                      setError(null);
                      const res = await deleteAction(fd);
                      if (!res.ok) {
                        setError(res.error);
                        return;
                      }
                      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
                      if (editingId === draft.id) cancelForm();
                      setMessage("Draft deleted.");
                    });
                  }}
                >
                  <button type="submit" className={`${styles.btn} ${styles.btnGhost}`} disabled={pending}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
            <pre className={styles.kickoffBody}>{draft.body}</pre>
          </article>
        ))}
      </div>
    </div>
  );
}
