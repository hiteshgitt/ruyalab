"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { submitContact } from "./actions";
import { PROJECT_TYPES, readFields, validate, type ContactFields, type ContactState, type FieldErrors } from "./schema";
import styles from "./ContactForm.module.css";

const INITIAL: ContactState = { status: "idle" };
const ORDER: (keyof ContactFields)[] = ["name", "email", "company", "projectType", "message"];

export function ContactForm() {
  // Remounting the inner form is the cleanest way to reset action state.
  const [round, setRound] = useState(0);
  return <FormInner key={round} onReset={() => setRound((r) => r + 1)} />;
}

function FormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL);
  // Client-side errors override server errors until the next server round trip.
  const [local, setLocal] = useState<FieldErrors | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errors = local ?? state.errors ?? {};

  const focusFirstInvalid = (errs: FieldErrors) => {
    const first = ORDER.find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error" && state.errors) focusFirstInvalid(state.errors);
  }, [state]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const errs = validate(readFields(new FormData(e.currentTarget)));
    if (Object.keys(errs).length > 0) {
      e.preventDefault();
      setLocal(errs);
      focusFirstInvalid(errs);
      return;
    }
    setLocal(null);
  };

  // Clear (or update) a field's error as soon as the user fixes it.
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof ContactFields;
    const form = e.target.form;
    if (!errors[name] || !form) return;
    const next = validate(readFields(new FormData(form)));
    setLocal({ ...errors, [name]: next[name] });
  };

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className={styles.success} role="status">
        <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" className={styles.check}>
          <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15 24.5l6 6 12-13" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p className={styles.successTitle}>Message received.</p>
        <p className={styles.successBody}>{state.message}</p>
        <Button type="button" variant="text" onClick={onReset}>
          Send another message
        </Button>
      </div>
    );
  }

  const v = state.values ?? {};
  const field = (name: keyof ContactFields) => ({
    id: `contact-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    onChange,
  });
  const err = (name: keyof ContactFields) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className={styles.form} aria-busy={pending}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name" className="label">
            Name <span aria-hidden="true">*</span>
          </label>
          <input {...field("name")} type="text" autoComplete="name" required defaultValue={v.name} />
          {err("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email" className="label">
            Email <span aria-hidden="true">*</span>
          </label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" required defaultValue={v.email} />
          {err("email")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-company" className="label">
            Company <span className={styles.optional}>(optional)</span>
          </label>
          <input {...field("company")} type="text" autoComplete="organization" defaultValue={v.company} />
          {err("company")}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-projectType" className="label">
            Project type <span className={styles.optional}>(optional)</span>
          </label>
          <div className={styles.selectWrap}>
            <select {...field("projectType")} defaultValue={v.projectType ?? ""}>
              <option value="">Choose one</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {err("projectType")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message" className="label">
          What are you imagining? <span aria-hidden="true">*</span>
        </label>
        <textarea {...field("message")} rows={5} required defaultValue={v.message} />
        {err("message")}
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.submitRow}>
        <Button type="submit" arrow disabled={pending}>
          {pending ? "Sending…" : "Start a conversation"}
        </Button>
        <p className={styles.req}>
          <span aria-hidden="true">*</span> Required
        </p>
      </div>

      <div aria-live="polite" className={styles.live}>
        {state.status === "error" && state.message && !local && <p className={styles.formError}>{state.message}</p>}
        {local && Object.values(local).some(Boolean) && (
          <p className={styles.formError}>Please check the highlighted fields.</p>
        )}
      </div>
    </form>
  );
}
