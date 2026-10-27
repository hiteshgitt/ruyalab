"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/cms/actions";
import type { Enquiry } from "@/cms/types";
import styles from "../../admin.module.css";

const STAGES = ["New", "Replied", "Call booked", "Proposal", "Won", "Lost"] as const;

function stageTone(stage: string) {
  if (stage === "New") return "new";
  if (stage === "Won") return "won";
  if (stage === "Lost") return "lost";
  return "mid";
}

function preview(text: string, max = 110) {
  const one = text.replace(/\s+/g, " ").trim();
  if (one.length <= max) return one;
  return `${one.slice(0, max).trim()}…`;
}

export function EnquiryRow({
  enquiry,
  action,
  defaultOpen = false,
}: {
  enquiry: Enquiry;
  action: (formData: FormData) => Promise<ActionResult>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [stage, setStage] = useState(enquiry.stage);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <article className={styles.enquiryCard} data-open={open ? "true" : "false"}>
      <button
        type="button"
        className={styles.enquirySummary}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.enquiryMain}>
          <span className={styles.enquiryWho}>
            <span className={styles.badge} data-tone={stageTone(stage)}>
              {stage}
            </span>
            <strong>{enquiry.name}</strong>
            <span className={styles.muted}>
              {enquiry.email}
              {enquiry.company ? ` · ${enquiry.company}` : ""}
            </span>
          </span>
          {!open ? <span className={styles.enquiryPreview}>{preview(enquiry.message)}</span> : null}
        </span>
        <span className={styles.enquiryMeta}>
          <time dateTime={enquiry.createdAt}>{new Date(enquiry.createdAt).toLocaleString()}</time>
          <span className={styles.enquiryChevron} aria-hidden="true">
            {open ? "▾" : "▸"}
          </span>
        </span>
      </button>

      {open ? (
        <div className={styles.enquiryDetail}>
          <p className={styles.enquiryMessage}>{enquiry.message}</p>
          <p className={styles.enquiryContact}>
            <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
          </p>

          <form
            className={styles.enquiryForm}
            action={(fd) => {
              start(async () => {
                setError(null);
                setMessage(null);
                const res = await action(fd);
                if (!res.ok) setError(res.error);
                else {
                  setStage(String(fd.get("stage") || stage) as Enquiry["stage"]);
                  setMessage("Saved");
                }
              });
            }}
          >
            <input type="hidden" name="id" value={enquiry.id} />
            <div className={styles.field}>
              <label htmlFor={`stage-${enquiry.id}`}>Stage</label>
              <select
                id={`stage-${enquiry.id}`}
                name="stage"
                defaultValue={enquiry.stage}
                onChange={(e) => setStage(e.target.value as Enquiry["stage"])}
              >
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
              <label htmlFor={`icp-${enquiry.id}`}>ICP</label>
              <input id={`icp-${enquiry.id}`} name="icpFit" defaultValue={enquiry.icpFit} placeholder="Y / N" />
            </div>
            <div className={`${styles.field} ${styles.enquiryNotes}`}>
              <label htmlFor={`notes-${enquiry.id}`}>Notes</label>
              <textarea id={`notes-${enquiry.id}`} name="notes" rows={2} defaultValue={enquiry.notes} />
            </div>
            <div className={styles.enquiryActions}>
              {error ? <p className={styles.error}>{error}</p> : null}
              {message ? <p className={styles.success}>{message}</p> : null}
              <button className={styles.btn} type="submit" disabled={pending}>
                {pending ? "Saving…" : "Update"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </article>
  );
}
