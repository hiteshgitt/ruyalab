import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type Props = {
  index: string;
  label: string;
  id: string;
  children: ReactNode;
  aside?: ReactNode;
};

/** "( 01 ) + SELECTED WORK" rail, giant Anton title, optional aside. */
export function SectionHeading({ index, label, id, children, aside }: Props) {
  return (
    <header className={`grid ${styles.head}`}>
      <p className={`label ${styles.meta}`} data-reveal>
        <span className={`paren ${styles.index}`}>{index}</span>
        <span aria-hidden="true">+</span>
        <span>{label}</span>
      </p>
      <h2 id={id} className={`display ${styles.title}`} data-split>
        {children}
      </h2>
      {aside && (
        <div className={styles.aside} data-reveal>
          {aside}
        </div>
      )}
    </header>
  );
}
