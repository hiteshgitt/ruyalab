import { loadAdminEnquiries, updateEnquiryAction } from "@/cms/actions";
import { EnquiryRow } from "./EnquiryRow";
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
            Contact-form submissions land here automatically (replaces the spreadsheet for site
            enquiries). Update stage, ICP fit and notes as you work them.
          </p>
        </div>
      </header>

      <div className={styles.card}>
        {enquiries.length === 0 ? (
          <div className={styles.emptyPanel}>
            <p className={styles.muted}>
              No enquiries yet. Submit the contact form once to verify the pipeline.
            </p>
          </div>
        ) : (
          <div className={styles.enquiryList}>
            {enquiries.map((enquiry) => (
              <EnquiryRow key={enquiry.id} enquiry={enquiry} action={updateEnquiryAction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
