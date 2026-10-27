"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../admin.module.css";

const items = [
  { href: "/ruyashield", label: "Overview", match: "exact" as const, group: "content" },
  { href: "/ruyashield/posts", label: "Blog posts", match: "prefix" as const, group: "content" },
  { href: "/ruyashield/media", label: "Media", match: "prefix" as const, group: "content" },
  { href: "/ruyashield/social", label: "Social links", match: "prefix" as const, group: "content" },
  { href: "/ruyashield/enquiries", label: "Enquiries", match: "prefix" as const, group: "growth" },
  { href: "/ruyashield/linkedin", label: "LinkedIn pack", match: "prefix" as const, group: "growth" },
  { href: "/ruyashield/seo", label: "SEO status", match: "prefix" as const, group: "growth" },
];

function isActive(pathname: string, href: string, match: "exact" | "prefix") {
  if (match === "exact") return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();
  const content = items.filter((i) => i.group === "content");
  const growth = items.filter((i) => i.group === "growth");

  return (
    <aside className={styles.sidebar} aria-label="CMS">
      <p className={styles.sideLabel}>Content</p>
      <nav className={styles.sideNav}>
        {content.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-active={isActive(pathname, item.href, item.match) ? "true" : "false"}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <p className={styles.sideLabel}>Growth</p>
      <nav className={styles.sideNav}>
        {growth.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-active={isActive(pathname, item.href, item.match) ? "true" : "false"}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
