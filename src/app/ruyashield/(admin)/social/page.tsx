import { loadAdminSocials, saveSocialAction } from "@/cms/actions";
import { SocialForm } from "./SocialForm";
import styles from "../../admin.module.css";

export default async function CmsSocialPage() {
  const links = await loadAdminSocials();

  return (
    <div className={styles.dash}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Site</p>
          <h1 className={styles.title}>Social links</h1>
          <p className={styles.muted}>
            Shown in the site footer. Leave empty to keep using <code>NEXT_PUBLIC_SOCIAL_LINKS</code>.
            CMS values override env when at least one valid https link is saved.
          </p>
        </div>
      </header>
      <div className={styles.card}>
        <SocialForm initial={links} action={saveSocialAction} />
      </div>
    </div>
  );
}
