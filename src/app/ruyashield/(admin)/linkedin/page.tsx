import { LINKEDIN_KICKOFFS } from "@/cms/linkedin-kickoffs";
import { CopyKickoff } from "./CopyKickoff";
import styles from "../../admin.module.css";

export default function LinkedInPackPage() {
  return (
    <div className={styles.dash}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Growth</p>
          <h1 className={styles.title}>LinkedIn pack</h1>
          <p className={styles.muted}>
            LinkedIn does not let websites auto-post without a LinkedIn app + your OAuth approval. Use
            these kickoffs as copy-paste from your personal profile (then reshare from the company page).
          </p>
        </div>
      </header>

      <div className={styles.kickoffGrid}>
        {LINKEDIN_KICKOFFS.map((post) => (
          <article key={post.id} className={styles.card}>
            <div className={styles.row}>
              <div>
                <h2 className={styles.sectionTitle} style={{ marginBottom: "0.35rem" }}>
                  {post.title}
                </h2>
                <p className={styles.muted}>{post.when}</p>
              </div>
              <CopyKickoff text={post.body} />
            </div>
            <pre className={styles.kickoffBody}>{post.body}</pre>
          </article>
        ))}
      </div>
    </div>
  );
}
