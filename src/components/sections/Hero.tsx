import type { CSSProperties } from "react";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { Sticker } from "@/components/motion/Sticker";
import { LiveMascot } from "@/components/mascot/LiveMascot";
import { Mascot } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { Flower } from "@/components/ui/Shapes";
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
          {/* Device with the live mascot */}
          <div className={styles.deviceWrap}>
            <div className={styles.device}>
              <div className={styles.screen}>
                <div className={styles.status} aria-hidden="true">
                  <span>9:41</span>
                  <span className={styles.island} />
                  <svg viewBox="0 0 34 12" width="34" height="12">
                    <rect x="0" y="7" width="3" height="5" rx="1" fill="currentColor" />
                    <rect x="5" y="5" width="3" height="7" rx="1" fill="currentColor" />
                    <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
                    <rect x="17" y="1" width="16" height="10" rx="3" fill="none" stroke="currentColor" />
                    <rect x="19" y="3" width="10" height="6" rx="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div className={styles.screenTop} aria-hidden="true">
                  <span className="paren">Ruyalab</span>
                  <span>+</span>
                  <span className="paren">Vision</span>
                </div>
                <p className={styles.screenWord} aria-hidden="true">
                  Ideas
                </p>
                <div className={styles.screenSide} aria-hidden="true">
                  ( DISCOVER ) + ( DESIGN ) + ( BUILD )
                </div>
                <div className={styles.liveMascot}>
                  <LiveMascot />
                </div>
                <div className={styles.screenChips} aria-hidden="true">
                  <span>Discover</span>
                  <span>Design</span>
                  <span data-on="true">Build</span>
                </div>
              </div>
            </div>
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
              <p className={styles.mono}>
                ( Design, engineering and artificial intelligence — combined into products people
                actually want to use ) +
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
