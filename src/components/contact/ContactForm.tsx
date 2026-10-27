import { Button } from "@/components/ui/Button";
import { PROJECT_TYPES } from "./schema";
import styles from "./ContactForm.module.css";

/** Plain form. Enhance.js posts via fetch then always sends visitors to /thanks. */
export function ContactForm() {
  return (
    <form action="/api/contact" method="post" className={styles.form} data-contact-form="">
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name" className="label">
            Name <span aria-hidden="true">*</span>
          </label>
          <input id="contact-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={120} />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email" className="label">
            Email <span aria-hidden="true">*</span>
          </label>
          <input id="contact-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={160} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-company" className="label">
            Company <span className={styles.optional}>(optional)</span>
          </label>
          <input id="contact-company" name="company" type="text" autoComplete="organization" maxLength={160} />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-projectType" className="label">
            Project type <span className={styles.optional}>(optional)</span>
          </label>
          <div className={styles.selectWrap}>
            <select id="contact-projectType" name="projectType" defaultValue="">
              <option value="">Choose one</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message" className="label">
          What are you imagining? <span aria-hidden="true">*</span>
        </label>
        <textarea id="contact-message" name="message" rows={5} required minLength={20} maxLength={5000} />
      </div>

      <div className={styles.hp} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.submitRow}>
        <Button type="submit" arrow>
          Start a conversation
        </Button>
        <p className={styles.req}>
          <span aria-hidden="true">*</span> Required
        </p>
      </div>

      <div aria-live="polite" className={styles.live}>
        <p className={styles.formError} data-contact-error="" hidden />
      </div>
    </form>
  );
}
