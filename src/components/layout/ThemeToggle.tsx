import styles from "./ThemeToggle.module.css";

/** Theme button. The head script has already set data-theme; clicks are wired inline. */
export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${className ?? ""}`}
      data-theme-toggle=""
      aria-label="Toggle color theme"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className={styles.icon}>
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
