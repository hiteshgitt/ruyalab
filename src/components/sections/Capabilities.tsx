import { capabilities } from "@/data/services";
import { RevealScope } from "@/components/motion/RevealScope";
import { Tilt } from "@/components/motion/Tilt";
import { Mascot } from "@/components/mascot/Mascot";
import { CapabilityIcon } from "@/components/ui/CapabilityIcon";
import styles from "./Capabilities.module.css";

export function Capabilities() {
  return (
    <section id="capabilities" className={styles.section} aria-labelledby="capabilities-title">
      <RevealScope className="container">
        <h2 id="capabilities-title" className="visually-hidden">
          What Ruyalab does
        </h2>

        {/* Poster composition: WHAT / RUYALAB / ( mascot ) / DOES */}
        <div className={styles.poster} data-reveal-group>
          <div className={styles.row}>
            <span className={`label ${styles.side} ${styles.sideL}`} aria-hidden="true">
              What&apos;s next
            </span>
            <span className={`display ${styles.big}`} aria-hidden="true" data-reveal>
              What
            </span>
            <span className={styles.rail}>
              <a href="#cap-03" className={styles.pill}>
                AI products
              </a>
            </span>
          </div>
          <div className={styles.row}>
            <span />
            <span className={`display ${styles.big} ${styles.brand}`} aria-hidden="true" data-reveal>
              Ruyalab
            </span>
            <span />
          </div>
          <div className={styles.row}>
            <span className={`display ${styles.side} ${styles.sideL} ${styles.asterisk}`} aria-hidden="true">
              *
            </span>
            <span className={styles.tileRow} aria-hidden="true" data-reveal>
              <span className={`display ${styles.bracket}`}>(</span>
              <span className={styles.tile}>
                <Mascot pose="explore" decorative className={styles.tileImg} />
              </span>
              <span className={`display ${styles.bracket}`}>)</span>
            </span>
            <span className={`label ${styles.side} ${styles.findLabel}`} aria-hidden="true">
              Find the idea
            </span>
          </div>
          <div className={styles.row}>
            <span className={`${styles.rail} ${styles.railL}`}>
              <a href="#cap-01" className={styles.pill}>
                Start exploring
              </a>
            </span>
            <span className={`display ${styles.big}`} aria-hidden="true" data-reveal>
              Does
            </span>
            <span />
          </div>

          {/* Wide screens: the side gutters carry the intro and a capability index */}
          <div className={styles.asideL} data-reveal>
            <p className={`label ${styles.asideLabel}`}>
              <span className="paren">Five disciplines</span>
            </p>
            <p className={styles.intro}>
              Five disciplines, one team. Most projects draw on several at once — that overlap is where
              the interesting work happens.
            </p>
          </div>

          <nav className={styles.asideR} aria-label="Capabilities index" data-reveal>
            <p className={`label ${styles.asideLabel}`}>
              <span className="paren">Find the idea</span>
            </p>
            <ol className={styles.index}>
              {capabilities.map((c) => (
                <li key={c.index}>
                  <a href={`#cap-${c.index}`} className={styles.indexLink}>
                    <span className={styles.indexNum}>{c.index}</span>
                    <CapabilityIcon index={c.index} className={styles.indexIcon} />
                    <span className={styles.indexTitle}>{c.title}</span>
                    <span aria-hidden="true" className={styles.indexArrow}>
                      ↘
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <ol className={styles.cards} data-reveal-group>
          {capabilities.map((c) => (
            <li key={c.index} id={`cap-${c.index}`} className={styles.item} data-reveal tabIndex={-1}>
            <Tilt className={`cap-card ${styles.card}`}>
              <div className={styles.cardTop}>
                <span className={`display ${styles.num}`}>{c.index}</span>
                <CapabilityIcon index={c.index} className={styles.icon} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.desc}>{c.description}</p>
                <ul className={styles.tags} aria-label={`${c.title} disciplines`}>
                  {c.disciplines.map((d) => (
                    <li key={d} className="paren">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Tilt>
            </li>
          ))}
        </ol>
      </RevealScope>
    </section>
  );
}
