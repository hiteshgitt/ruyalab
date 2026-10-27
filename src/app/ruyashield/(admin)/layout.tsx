import Link from "next/link";
import { redirect } from "next/navigation";
import { isCmsAuthed } from "@/cms/auth";
import { logoutAction, loadAdminMeta } from "@/cms/actions";
import styles from "../admin.module.css";
import { AdminNav } from "./AdminNav";

export default async function CmsAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isCmsAuthed())) redirect("/ruyashield/login");
  const meta = await loadAdminMeta();

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <div className={styles.topBrand}>
          <strong>RuyaShield</strong>
          <span>
            Ruyalab CMS · {meta.storage === "local" ? "local store" : "Cloudflare D1"}
          </span>
        </div>
        <div className={styles.topActions}>
          <Link href="/" className={`${styles.btn} ${styles.btnOnDark}`} target="_blank">
            View site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className={`${styles.btn} ${styles.btnOnDark}`}>
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className={styles.body}>
        <AdminNav />
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
