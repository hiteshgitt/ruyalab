import Link from "next/link";
import { cacheLife } from "next/cache";
import { navItems, site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { Mascot } from "@/components/mascot/Mascot";
import styles from "./Footer.module.css";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();

  return (
    <footer className={styles.footer}>
      <div className={`container grid ${styles.top}`}>
        <div className={styles.brand}>
          <Link href="/" aria-label="Ruyalab — home" className={styles.logoLink}>
            <Logo />
          </Link>
          <p className={styles.statement}>
            An independent creative technology lab combining engineering, design and artificial
            intelligence to build meaningful digital products.
          </p>
        </div>

        <nav aria-label="Footer" className={styles.col}>
          <p className="label">Index</p>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className={styles.link}>
                  <span className="paren">{item.label}</span>
                </Link>
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
