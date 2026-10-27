import Link from "next/link";
import { navItems, site } from "@/lib/site";
import { resolveSocials } from "@/cms/socials";
import { Logo } from "@/components/ui/Logo";
import { Mascot } from "@/components/mascot/Mascot";
import { SocialIcon } from "@/components/ui/SocialIcon";
import styles from "./Footer.module.css";

export async function Footer() {
  // Static pages: resolved at build time, so each deploy picks up the new year.
  const year = new Date().getFullYear();
  const socials = await resolveSocials();

  return (
    <footer className={styles.footer}>
      <div className={`container grid ${styles.top}`}>
        <div className={styles.brand}>
          <Link href="/" aria-label="Ruyalab — home" className={styles.logoLink}>
            <Logo />
          </Link>
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

        {(site.email || socials.length > 0) && (
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
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                    <SocialIcon label={s.label} href={s.href} className={styles.socialIcon} />
                    <span>{s.label}</span>
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
