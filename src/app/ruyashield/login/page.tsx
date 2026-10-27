import { redirect } from "next/navigation";
import { cmsConfigured, hasPendingAuth, isCmsAuthed } from "@/cms/auth";
import { cancelTotpAction, loginAction, verifyTotpAction } from "@/cms/actions";
import styles from "../admin.module.css";
import { LoginForm } from "./LoginForm";

export default async function CmsLoginPage() {
  if (await isCmsAuthed()) redirect("/ruyashield");
  const pendingTotp = await hasPendingAuth();

  return (
    <div className={styles.loginWrap}>
      <div className={`${styles.card} ${styles.loginCard}`}>
        <h1 className={styles.title}>RuyaShield</h1>
        <p className={styles.muted} style={{ marginBottom: "1.25rem" }}>
          Ruyalab studio CMS — username, password, then authenticator.
        </p>
        {!cmsConfigured() ? (
          <p className={styles.error}>
            Set <code>CMS_ADMIN_USERNAME</code>, <code>CMS_ADMIN_PASSWORD</code>,{" "}
            <code>CMS_TOTP_SECRET</code>, and <code>CMS_SESSION_SECRET</code> in the environment, then reload.
          </p>
        ) : (
          <LoginForm
            loginAction={loginAction}
            totpAction={verifyTotpAction}
            cancelAction={cancelTotpAction}
            startOnTotp={pendingTotp}
          />
        )}
      </div>
    </div>
  );
}
