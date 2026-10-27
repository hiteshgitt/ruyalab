import { readFields, validate, type ContactState } from "./schema";
import { emailConfig, sendConfirmation, sendEnquiry } from "./email";
import { createEnquiry } from "@/cms/db";

/**
 * Delivery, in order of preference:
 *  1. Email (RESEND_API_KEY + CONTACT_TO_EMAIL): the enquiry goes to the studio
 *     inbox (Reply-To = visitor) and the visitor gets a receipt.
 *  2. CONTACT_WEBHOOK_URL: the submission is POSTed as JSON (Slack, Zapier…).
 *     Runs in addition to email when both are configured.
 * With neither, development logs to the console and production returns an
 * honest "not connected" error. See README.
 */
export async function deliverContact(formData: FormData): Promise<ContactState> {
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  const fields = readFields(formData);
  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values: fields };
  }

  const mail = emailConfig();
  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  const submittedAt = new Date().toISOString();

  if (!mail && !webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] no delivery configured — submission logged only:", fields);
      try {
        await createEnquiry({ ...fields, source: "Contact form" });
      } catch (err) {
        console.error("[contact] CMS enquiry log failed:", err);
      }
      return {
        status: "success",
        message: "Thanks — your message is in. (Development mode: logged to the server console.)",
      };
    }
    const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    return {
      status: "error",
      message: email
        ? `Our form isn't accepting messages right now. Please email us at ${email}.`
        : "Our form isn't accepting messages right now. Please try again later.",
      values: fields,
    };
  }

  try {
    if (mail) await sendEnquiry(mail, fields, { submittedAt });
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...fields,
          text: `New enquiry from ${fields.name} <${fields.email}>${fields.company ? ` (${fields.company})` : ""}\nType: ${fields.projectType || "—"}\n\n${fields.message}`,
          submittedAt,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    }
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again in a moment.",
      values: fields,
    };
  }

  let receipt = false;
  if (mail) {
    try {
      await sendConfirmation(mail, fields);
      receipt = true;
    } catch (err) {
      console.error("[contact] confirmation email failed:", err);
    }
  }

  try {
    await createEnquiry({ ...fields, source: "Contact form" });
  } catch (err) {
    // Delivery already succeeded — do not fail the visitor for a CRM write issue.
    console.error("[contact] CMS enquiry log failed:", err);
  }

  return {
    status: "success",
    message: receipt
      ? `Thanks — your message is in. We've sent a confirmation to ${fields.email}.`
      : "Thanks — your message is in. We'll be in touch soon.",
  };
}
