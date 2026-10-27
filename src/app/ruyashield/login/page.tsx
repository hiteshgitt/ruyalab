import { redirect } from "next/navigation";
import { cmsConfigured, isCmsAuthed } from "@/cms/auth";
import { loginAction } from "@/cms/actions";
import styles from "../admin.module.css";
import { LoginForm } from "./LoginForm";

export default async function CmsLoginPage() {
  if (await isCmsAuthed()) redirect("/ruyashield");

  return (
    <div className={styles.loginWrap}>
      <div className={`${styles.card} ${styles.loginCard}`}>
        <h1 className={styles.title}>RuyaShield</h1>
        <p className={styles.muted} style={{ marginBottom: "1.25rem" }}>
          Ruyalab studio CMS — posts, social links, and more.
        </p>
        {!cmsConfigured() ? (
          <p className={styles.error}>
            Set <code>CMS_ADMIN_PASSWORD</code> and <code>CMS_SESSION_SECRET</code> in the environment,
            then reload.
          </p>
        ) : (
          <LoginForm action={loginAction} />
        )}
      </div>
    </div>
  );
}
