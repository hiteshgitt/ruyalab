"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/cms/actions";
import type { SocialLink } from "@/cms/types";
import styles from "../../admin.module.css";

type Row = SocialLink;

export function SocialForm({
  initial,
  action,
}: {
  initial: SocialLink[];
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [rows, setRows] = useState<Row[]>(initial.length ? initial : [{ label: "", href: "" }]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) => {
        start(async () => {
          setError(null);
          setMessage(null);
          const res = await action(fd);
          if (!res.ok) setError(res.error);
          else setMessage("Saved. Footer will use these links on the next request.");
        });
      }}
    >
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      {rows.map((row, i) => (
        <div className={styles.socialRow} key={i}>
          <input
            name="label"
            placeholder="LinkedIn"
            value={row.label}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...next[i], label: e.target.value };
              setRows(next);
            }}
          />
          <input
            name="href"
            placeholder="https://…"
            value={row.href}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...next[i], href: e.target.value };
              setRows(next);
            }}
          />
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={() => setRows(rows.filter((_, j) => j !== i))}
          >
            Remove
          </button>
        </div>
      ))}

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={() => setRows([...rows, { label: "", href: "" }])}
        >
          Add link
        </button>
        <button className={styles.btn} type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save social links"}
        </button>
      </div>
    </form>
  );
}
