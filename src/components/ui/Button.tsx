import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "yellow" | "ghost" | "text";

type Common = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Show the trailing arrow. */
  arrow?: boolean | "down";
};

type LinkProps = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;
type ButtonProps = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

function Inner({ children, arrow }: Pick<Common, "children" | "arrow">) {
  return (
    <>
      <span className={styles.labelWrap}>
        <span className={styles.label}>{children}</span>
        <span className={styles.label} aria-hidden="true">
          {children}
        </span>
      </span>
      {arrow && (
        <svg
          className={styles.arrow}
          data-dir={arrow === "down" ? "down" : "right"}
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </>
  );
}

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", children, className, arrow = false, ...rest } = props;
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as LinkProps;
    const external = /^(https?:|mailto:|tel:)/.test(href);
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...anchorRest}
        >
          <Inner arrow={arrow}>{children}</Inner>
        </a>
      );
    }
    return (
      <a href={href} className={cls} {...anchorRest}>
        <Inner arrow={arrow}>{children}</Inner>
      </a>
    );
  }

  return (
    <button className={cls} {...(rest as ComponentPropsWithoutRef<"button">)}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
