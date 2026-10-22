import { site } from "@/lib/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { RevealScope } from "@/components/motion/RevealScope";
import { Mascot } from "@/components/mascot/Mascot";
import { Flower } from "@/components/ui/Shapes";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className="container">
        <RevealScope className={styles.panel}>
          <div className={styles.intro}>
            <p className={styles.meta} data-reveal>
              <span className="paren">06</span> + Contact
            </p>
            <h2 id="contact-title" className={`display ${styles.title}`} data-split>
              Have something <span className={styles.hl}>ambitious</span> in mind?
            </h2>
            <p className={styles.copy} data-reveal>
              Tell us what you&apos;re imagining. Let&apos;s work out how to make it real.
            </p>
            {site.email && (
              <p className={styles.direct} data-reveal>
                <span className={styles.directLabel}>( Or write directly )</span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            )}
            <div className={styles.mascotWrap} aria-hidden="true">
              <Flower className={styles.flower} style={{ position: "absolute" }} />
              <Mascot pose="launch" decorative className={styles.mascot} />
            </div>
          </div>

          <div className={styles.formCard} data-reveal>
            <ContactForm />
          </div>
        </RevealScope>
      </div>
    </section>
  );
}
