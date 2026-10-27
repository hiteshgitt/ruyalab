import { navItems, site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { Mascot } from "@/components/mascot/Mascot";
import styles from "./Footer.module.css";

export function Footer() {
  // Static pages: resolved at build time, so each deploy picks up the new year.
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container grid ${styles.top}`}>
        <div className={styles.brand}>
          <a href="/" aria-label="Ruyalab — home" className={styles.logoLink}>
            <Logo />
          </a>
          <p className={styles.statement}>
            An independent creative technology studio. Design, engineering and AI by the same team —
            shipping digital products and experiences built for what comes next.
          </p>
        </div>

        <nav aria-label="Footer" className={styles.col}>
          <p className="label">Index</p>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} className={styles.link}>
                  <span className="paren">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {(site.email || site.socials.length > 0) && (
          <div className={styles.col}>
            <p className="label">Contact</p>
            <ul>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className={styles.link}>
                    {site.email}
                  </a>
                </li>
              )}
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={`container ${styles.base}`}>
        <p className="label">© {year} Ruyalab</p>
        <p className="label">Design · Engineering · AI</p>
      </div>

      <div className={styles.mega} aria-hidden="true">
        <Mascot pose="hero" decorative className={styles.peek} />
        <span>Ruyalab</span>
      </div>
    </footer>
  );
}
