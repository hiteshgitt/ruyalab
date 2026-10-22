import styles from "./CapabilityIcon.module.css";

/**
 * Custom line icons for the five capabilities. Each has one "live" part
 * (data-anim) that animates when its card is hovered or focused.
 */
const ICONS: Record<string, React.JSX.Element> = {
  // Digital experiences — browser with a sparkle cursor
  "01": (
    <>
      <rect x="6" y="12" width="52" height="38" rx="6" />
      <path d="M6 21h52" />
      <circle cx="12.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M16 31h18M16 38h12" />
      <g data-anim="sparkle">
        <path d="M46 28l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" className={styles.fill} />
      </g>
    </>
  ),
  // Product engineering — dashboard tiles with a rising bar
  "02": (
    <>
      <rect x="6" y="8" width="22" height="22" rx="5" />
      <rect x="36" y="8" width="22" height="14" rx="5" />
      <rect x="36" y="30" width="22" height="26" rx="5" />
      <rect x="6" y="38" width="22" height="18" rx="5" />
      <g data-anim="bar">
        <rect x="42" y="40" width="4" height="10" rx="1.5" className={styles.fill} />
        <rect x="49" y="36" width="4" height="14" rx="1.5" className={styles.fill} />
      </g>
    </>
  ),
  // AI & intelligent products — a node network around a spark
  "03": (
    <>
      <circle cx="32" cy="32" r="9" />
      <circle cx="10" cy="14" r="4" />
      <circle cx="54" cy="14" r="4" />
      <circle cx="10" cy="50" r="4" />
      <circle cx="54" cy="50" r="4" />
      <path d="M13 17l12 9M51 17l-12 9M13 47l12-9M51 47l-12-9" />
      <g data-anim="pulse">
        <path d="M32 26l1.6 4.4L38 32l-4.4 1.6L32 38l-1.6-4.4L26 32l4.4-1.6z" className={styles.fill} />
      </g>
    </>
  ),
  // Creative development — wireframe cube in orbit
  "04": (
    <>
      <g data-anim="spin">
        <ellipse cx="32" cy="34" rx="28" ry="10" strokeDasharray="3 5" />
      </g>
      <path d="M32 10l16 9v18l-16 9-16-9V19z" />
      <path d="M16 19l16 9 16-9M32 28v18" />
      <path d="M32 10l16 9-16 9-16-9z" className={styles.fillSoft} />
    </>
  ),
  // Content & CMS — stacked documents with flowing lines
  "05": (
    <>
      <rect x="18" y="6" width="34" height="42" rx="5" />
      <path d="M12 14v38a5 5 0 0 0 5 5h27" />
      <g data-anim="lines">
        <path d="M25 17h20M25 24h20M25 31h13" />
      </g>
      <rect x="25" y="37" width="10" height="5" rx="1.5" className={styles.fill} />
    </>
  ),
};

export function CapabilityIcon({ index, className }: { index: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`${styles.icon} ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[index]}
    </svg>
  );
}
