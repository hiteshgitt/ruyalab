"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/cms/actions";
import styles from "../admin.module.css";

export function LoginForm({
  loginAction,
  totpAction,
  cancelAction,
  startOnTotp = false,
}: {
  loginAction: (formData: FormData) => Promise<ActionResult>;
  totpAction: (formData: FormData) => Promise<ActionResult>;
  cancelAction: () => Promise<ActionResult>;
  startOnTotp?: boolean;
}) {
  const [step, setStep] = useState<"credentials" | "totp">(startOnTotp ? "totp" : "credentials");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (step === "totp") {
    return (
      <form
        action={(fd) => {
          start(async () => {
            setError(null);
            const res = await totpAction(fd);
            if (!res.ok) setError(res.error);
          });
        }}
      >
        <p className={styles.muted} style={{ marginBottom: "1rem" }}>
          Step 2 of 2 — open your authenticator app and enter the 6-digit code.
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.field}>
          <label htmlFor="code">Authenticator code</label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            required
            autoFocus
          />
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            disabled={pending}
            onClick={() => {
              start(async () => {
                await cancelAction();
                setStep("credentials");
                setError(null);
              });
            }}
          >
            Back
          </button>
          <button className={styles.btn} type="submit" disabled={pending}>
            {pending ? "Verifying…" : "Verify & sign in"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      action={(fd) => {
        start(async () => {
          setError(null);
          const res = await loginAction(fd);
          if (!res.ok) {
            setError(res.error);
            return;
          }
          if (res.needsTotp) setStep("totp");
        });
      }}
    >
      <p className={styles.muted} style={{ marginBottom: "1rem" }}>
        Step 1 of 2 — username and password.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.field}>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" autoComplete="username" required autoFocus />
      </div>
      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className={styles.btn} type="submit" disabled={pending}>
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
