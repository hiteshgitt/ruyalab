import { loadAdminMedia } from "@/cms/actions";
import { MediaLibrary } from "./MediaLibrary";
import styles from "../../admin.module.css";

export default async function CmsMediaPage() {
  const items = await loadAdminMedia();

  return (
    <div className={styles.dash}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Content</p>
          <h1 className={styles.title}>Media</h1>
          <p className={styles.muted}>
            Upload images and PDFs for blog posts and the site. Locally files live under{" "}
            <code>.data/media</code>. Production needs Cloudflare R2 bound as <code>CMS_MEDIA</code>.
          </p>
        </div>
      </header>
      <MediaLibrary initial={items} />
    </div>
  );
}
