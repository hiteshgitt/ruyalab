"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/cms/actions";
import type { Enquiry } from "@/cms/types";
import styles from "../../admin.module.css";

const STAGES = ["New", "Replied", "Call booked", "Proposal", "Won", "Lost"] as const;

export function EnquiryRow({
  enquiry,
  action,
}: {
  enquiry: Enquiry;
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <article className={styles.enquiryCard}>
      <div className={styles.enquiryHead}>
        <div>
          <strong>{enquiry.name}</strong>
          <p className={styles.muted}>
            <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
            {enquiry.company ? ` · ${enquiry.company}` : ""}
            {enquiry.projectType ? ` · ${enquiry.projectType}` : ""}
          </p>
        </div>
        <time className={styles.muted} dateTime={enquiry.createdAt}>
          {new Date(enquiry.createdAt).toLocaleString()}
        </time>
      </div>
      <p className={styles.enquiryMessage}>{enquiry.message}</p>

      <form
        className={styles.enquiryForm}
        action={(fd) => {
          start(async () => {
            setError(null);
            setMessage(null);
            const res = await action(fd);
            if (!res.ok) setError(res.error);
            else setMessage("Saved");
          });
        }}
      >
        <input type="hidden" name="id" value={enquiry.id} />
        <div className={styles.field}>
          <label htmlFor={`stage-${enquiry.id}`}>Stage</label>
          <select id={`stage-${enquiry.id}`} name="stage" defaultValue={enquiry.stage}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor={`source-${enquiry.id}`}>Source</label>
          <input id={`source-${enquiry.id}`} name="source" defaultValue={enquiry.source} />
        </div>
        <div className={styles.field}>
          <label htmlFor={`icp-${enquiry.id}`}>ICP fit (Y/N)</label>
          <input id={`icp-${enquiry.id}`} name="icpFit" defaultValue={enquiry.icpFit} placeholder="Y / N" />
        </div>
        <div className={styles.field}>
          <label htmlFor={`notes-${enquiry.id}`}>Notes</label>
          <textarea id={`notes-${enquiry.id}`} name="notes" rows={2} defaultValue={enquiry.notes} style={{ minHeight: "4.5rem" }} />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.success}>{message}</p>}
        <button className={styles.btn} type="submit" disabled={pending}>
          {pending ? "Saving…" : "Update"}
        </button>
      </form>
    </article>
  );
}
