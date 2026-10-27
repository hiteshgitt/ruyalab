import { loadAdminEnquiries, updateEnquiryAction } from "@/cms/actions";
import { EnquiriesList } from "./EnquiriesList";
import styles from "../../admin.module.css";

export default async function CmsEnquiriesPage() {
  const enquiries = await loadAdminEnquiries();

  return (
    <div className={styles.dash}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Growth</p>
          <h1 className={styles.title}>Enquiries</h1>
          <p className={styles.muted}>
            Contact-form submissions land here. Rows stay compact — open one to update stage, ICP and notes.
          </p>
        </div>
      </header>

      <div className={styles.card}>
        {enquiries.length === 0 ? (
          <div className={styles.emptyPanel}>
            <p className={styles.muted}>No enquiries yet. Submit the contact form once to verify the pipeline.</p>
          </div>
        ) : (
          <EnquiriesList enquiries={enquiries} action={updateEnquiryAction} />
        )}
      </div>
    </div>
  );
}
