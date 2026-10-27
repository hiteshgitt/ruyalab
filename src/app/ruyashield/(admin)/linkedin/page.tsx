import {
  createLinkedInAction,
  deleteLinkedInAction,
  loadAdminLinkedIn,
  updateLinkedInAction,
} from "@/cms/actions";
import { LinkedInManager } from "./LinkedInManager";
import styles from "../../admin.module.css";

export default async function LinkedInPackPage() {
  const drafts = await loadAdminLinkedIn();

  return (
    <div className={styles.dash}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Growth</p>
          <h1 className={styles.title}>LinkedIn posts</h1>
          <p className={styles.muted}>
            Draft posts here and Copy into your personal LinkedIn (then reshare from the company page). Auto-post
            needs a LinkedIn app — not enabled.
          </p>
        </div>
      </header>

      <LinkedInManager
        initial={drafts}
        createAction={createLinkedInAction}
        updateAction={updateLinkedInAction}
        deleteAction={deleteLinkedInAction}
      />
    </div>
  );
}
