"use client";

import { useEffect, useSyncExternalStore } from "react";
import { THEME_KEY, type Theme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

function savedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);

  // Follow OS changes until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!savedTheme()) document.documentElement.dataset.theme = mq.matches ? "dark" : "light";
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode: choice lasts for this page view */
    }
  };

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className ?? ""}`}
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      data-theme-state={theme}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className={styles.icon}>
        {/* Sun rays (fade out in dark) */}
        <g className={styles.rays} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7" />
        </g>
        <mask id="theme-moon">
          <rect width="24" height="24" fill="#fff" />
          <circle className={styles.bite} cx="17" cy="7" r="6" fill="#000" />
        </mask>
        <circle className={styles.disc} cx="12" cy="12" r="5.2" fill="currentColor" mask="url(#theme-moon)" />
      </svg>
    </button>
  );
}
