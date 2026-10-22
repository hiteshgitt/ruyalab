import styles from "./Logo.module.css";

/** Wordmark + mini vision-eye mark (a simplified mascot). "Ruya" means vision. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`${styles.logo} ${className ?? ""}`}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="logo-iris" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#5ff6ff" />
            <stop offset=".45" stopColor="#168aff" />
            <stop offset="1" stopColor="#8f4dff" />
          </linearGradient>
        </defs>
        <ellipse cx="16" cy="16" rx="14.5" ry="12.5" className={styles.shell} />
        <ellipse cx="16" cy="16" rx="11" ry="9" fill="#07132f" />
        <g className={styles.iris}>
          <ellipse cx="16" cy="16" rx="8.6" ry="7" fill="url(#logo-iris)" />
          <ellipse cx="16" cy="16" rx="5.4" ry="4.6" fill="#06112d" />
          <path d="M16 12.6l1 2.2 2.3.8-2.3.8-1 2.2-1-2.2-2.3-.8 2.3-.8z" fill="#e9fdff" />
        </g>
      </svg>
      <span className={styles.word}>Ruyalab</span>
    </span>
  );
}
