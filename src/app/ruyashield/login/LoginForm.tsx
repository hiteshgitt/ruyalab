"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/cms/actions";
import styles from "../admin.module.css";

export function LoginForm({
  action,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) => {
        start(async () => {
          setError(null);
          const res = await action(fd);
          if (!res.ok) setError(res.error);
        });
      }}
    >
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className={styles.btn} type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
