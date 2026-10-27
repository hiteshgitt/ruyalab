"use client";

import { useState } from "react";
import styles from "../../admin.module.css";

export function CopyKickoff({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 1600);
      }}
    >
      {done ? "Copied" : "Copy post"}
    </button>
  );
}
