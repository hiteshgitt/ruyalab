"use server";

import { readFields, validate, type ContactState } from "./schema";

/**
 * Delivery: if CONTACT_WEBHOOK_URL is set, the submission is POSTed there as
 * JSON (works with Slack/Discord-style webhooks, Zapier, Make, n8n, or your
 * own endpoint). Without it, development logs to the server console and
 * production returns an honest "not connected" error. See README.
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never see or fill this field.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  const fields = readFields(formData);
  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values: fields };
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] CONTACT_WEBHOOK_URL not set — submission logged only:", fields);
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
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...fields,
        // Plain-text summary for chat-style webhooks.
        text: `New enquiry from ${fields.name} <${fields.email}>${fields.company ? ` (${fields.company})` : ""}\nType: ${fields.projectType || "—"}\n\n${fields.message}`,
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again in a moment.",
      values: fields,
    };
  }

  return { status: "success", message: "Thanks — your message is in. We'll be in touch soon." };
}
