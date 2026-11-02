import { headers } from "next/headers";
import { readFields, validate, type ContactState } from "./schema";
import { emailConfig, sendConfirmation, sendEnquiry } from "./email";
import { createEnquiry } from "@/cms/db";
import { clientKey, hitRateLimit, scoreSubmission, verifyTurnstile } from "./spam";

/**
 * Delivery, in order of preference:
 *  1. Email (RESEND_API_KEY + CONTACT_TO_EMAIL): the enquiry goes to the studio
 *     inbox (Reply-To = visitor) and optionally the visitor gets a receipt.
 *  2. CONTACT_WEBHOOK_URL: the submission is POSTed as JSON (Slack, Zapier…).
 *     Runs in addition to email when both are configured.
 * Spam / rate-limit: silent success (no Resend) so bots don't burn quota.
 */
export async function deliverContact(formData: FormData): Promise<ContactState> {
  // Honeypot — bots that fill "website" are dropped quietly
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  const fields = readFields(formData);
  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values: fields };
  }

  const hdrs = await headers();
  const ipKey = clientKey(hdrs);
  const ip = ipKey.replace(/^ip:/, "");
  const emailKey = `email:${fields.email.toLowerCase()}`;

  // Rate limits (per isolate + warm instances): 3 / 10 min per IP, 2 / 30 min per email
  if (hitRateLimit(ipKey, 3, 10 * 60 * 1000) || hitRateLimit(emailKey, 2, 30 * 60 * 1000)) {
    console.warn("[contact] rate-limited", { ipKey, email: fields.email });
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  const startedRaw = String(formData.get("form_ts") ?? "").trim();
  const started = Number(startedRaw);
  const elapsedMs = Number.isFinite(started) && started > 0 ? Date.now() - started : null;

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "").trim();
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    console.warn("[contact] turnstile failed", { ipKey });
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  const verdict = scoreSubmission(fields, { elapsedMs });
  if (verdict.discard) {
    console.warn("[contact] spam discarded", {
      score: verdict.score,
      reasons: verdict.reasons,
      email: fields.email,
      name: fields.name,
    });
    return { status: "success", message: "Thanks — we'll be in touch." };
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
          spamScore: verdict.score,
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
  // Confirmation doubles Resend usage — off unless CONTACT_SEND_CONFIRMATION=1 and clean.
  if (mail && !verdict.skipConfirmation) {
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
    console.error("[contact] CMS enquiry log failed:", err);
  }

  return {
    status: "success",
    message: receipt
      ? `Thanks — your message is in. We've sent a confirmation to ${fields.email}.`
      : "Thanks — your message is in. We'll be in touch soon.",
  };
}
