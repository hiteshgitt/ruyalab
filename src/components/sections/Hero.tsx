import type { CSSProperties } from "react";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { Sticker } from "@/components/motion/Sticker";
import { DeviceMorph } from "@/components/sections/DeviceMorph";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Flower } from "@/components/ui/Shapes";
import { CapabilityIcon } from "@/components/ui/CapabilityIcon";
import { projects } from "@/data/projects";
import { capabilities } from "@/data/services";
import styles from "./Hero.module.css";

const WORD = "RUYALAB".split("");
const EDGE = "( DESIGN ) + ( ENGINEERING ) + ( AI ) + ( WEBGL ) + ( PRODUCTS ) +";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroIntro className={`container ${styles.stage}`}>
        {/* Giant wordmark — decorative; each letter reacts to hover */}
        <p className={styles.word} aria-hidden="true">
          {WORD.map((ch, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties}>
              {ch}
            </span>
          ))}
        </p>

        <div className={styles.scene} data-hero-content>
          {/* One device, morphing mobile → tablet → desktop: we build for every screen */}
          <div className={styles.deviceWrap}>
            <DeviceMorph />
          </div>

          {/* Yellow panel */}
          <div className={styles.panel}>
            <span className={`${styles.edge} ${styles.edgeL}`} aria-hidden="true">
              {EDGE} {EDGE}
            </span>
            <span className={`${styles.edge} ${styles.edgeR}`} aria-hidden="true">
              {EDGE} {EDGE}
            </span>

            <div className={styles.left}>
              <p className={styles.eyebrow} data-hero-fade>
                + <span className="paren">Independent creative technology studio</span> +
              </p>
              <h1 id="hero-title" className={`display ${styles.title}`}>
                <span className={styles.mask}>
                  <span className={styles.line} style={{ "--i": 0 } as CSSProperties}>
                    We turn ambitious
                  </span>
                </span>
                <span className={styles.mask}>
                  <span className={styles.line} style={{ "--i": 1 } as CSSProperties}>
                    ideas into
                  </span>
                </span>
                <span className={styles.mask}>
                  <span className={`${styles.line} ${styles.hl}`} style={{ "--i": 2 } as CSSProperties}>
                    digital reality.
                  </span>
                </span>
              </h1>
              <p className={styles.copy}>
                Ruyalab blends design, engineering and AI to create digital products and experiences
                built for what comes next.
              </p>
              <div className={styles.ctas} data-hero-fade>
                <Button href="#work" arrow="down">
                  Explore our work
                </Button>
                <Button href="#contact" variant="ghost" arrow className={styles.ghostOnYellow}>
                  Let&apos;s build something
                </Button>
              </div>
            </div>

            <div className={styles.right} data-hero-fade>
              {/* What we build: fills the column with real navigation */}
              <nav className={styles.build} aria-label="What we build">
                <p className={styles.buildLabel}>
                  <span className="paren">What we build</span>
                </p>
                <ul className={styles.buildList}>
                  {capabilities.map((c) => (
                    <li key={c.index}>
                      <a href={`#cap-${c.index}`} className={styles.buildLink}>
                        <span className={styles.buildNum}>{c.index}</span>
                        <CapabilityIcon index={c.index} className={styles.buildIcon} />
                        <span className={styles.buildTitle}>{c.title}</span>
                        <span className={styles.buildArrow} aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <p className={styles.mono}>
                ( Web, mobile and everything in between — one product, designed for every screen ) +
              </p>
              <dl className={styles.meta}>
                <div>
                  <dt className="paren">Disciplines</dt>
                  <dd>{String(capabilities.length).padStart(2, "0")}</dd>
                </div>
                <div>
                  <dt className="paren">Concept studies</dt>
                  <dd>{String(projects.length).padStart(2, "0")}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Draggable stickers (precise pointers) / floating (touch) */}
          <Sticker className={`${styles.sticker} ${styles.sCard}`} float={1.2} bounds="section">
            <div className={styles.card}>
              <Mascot pose="grow" decorative className={styles.cardImg} />
              <div>
                <p className={styles.cardNum}>{String(projects.length).padStart(2, "0")}</p>
                <p className={styles.cardTxt}>Concept studies</p>
              </div>
            </div>
            <span className={styles.drag}>↖ drag me</span>
          </Sticker>

          <Sticker className={`${styles.sticker} ${styles.sFlower}`} float={2.4} bounds="section">
            <Flower className={styles.flower}>
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
              </svg>
            </Flower>
          </Sticker>

          <Sticker className={`${styles.sticker} ${styles.sChip}`} float={3.1} bounds="section">
            <span className={styles.chip}>
              <span className={styles.dot} /> ( AI ) + ( WEBGL ) + ( WEB )
            </span>
          </Sticker>

          <Sticker className={`${styles.sticker} ${styles.sBubble}`} float={0.4} bounds="section">
            <span className={styles.bubble}>
              <Mascot pose="code" decorative className={styles.bubbleImg} />
            </span>
          </Sticker>

          <Sticker className={`${styles.sticker} ${styles.sStar}`} float={4} bounds="section">
            <svg viewBox="0 0 100 100" className={styles.star}>
              <path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0Z" />
            </svg>
          </Sticker>
        </div>
      </HeroIntro>
    </section>
  );
}
