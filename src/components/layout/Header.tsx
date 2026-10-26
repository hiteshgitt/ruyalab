import { navItems } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

/** Static bar. Scroll state, the mobile menu, and the current section are wired inline. */
export function Header() {
  return (
    <header className={styles.header} data-header="">
      <div className={`container ${styles.bar}`}>
        <a href="/" className={styles.home} aria-label="Ruyalab — home" data-home="">
          <Logo />
        </a>

        <nav aria-label="Primary" className={styles.desktopNav}>
          <ul className={styles.links}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} className={styles.link}>
                  <span className="paren">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <Button href="/#contact" className={styles.cta}>
            Start a project
          </Button>
          <button
            type="button"
            className={styles.toggle}
            data-nav-toggle=""
            aria-expanded="false"
            aria-controls="mobile-menu"
          >
            <span className="visually-hidden">Open menu</span>
            <span aria-hidden="true" className={styles.burger} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={styles.panel} data-nav-panel="" hidden role="dialog" aria-modal="true" aria-label="Site menu">
        <nav aria-label="Mobile" className="container">
          <ul className={styles.panelLinks}>
            {navItems.map((item, i) => (
              <li key={item.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={item.href} className={styles.panelLink}>
                  <span className="label">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="/#contact" arrow className={styles.panelCta}>
            Start a project
          </Button>
        </nav>
      </div>
    </header>
  );
}
