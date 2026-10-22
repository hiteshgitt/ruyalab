import type { ContactFields } from "./schema";

/**
 * Transactional email via Resend's HTTP API (works on Cloudflare Workers;
 * no SMTP sockets needed). Server-only: imported from the contact action.
 *
 * Env:
 *   RESEND_API_KEY      secret, required to send
 *   CONTACT_TO_EMAIL    inbox that receives enquiries, e.g. contact@ruyalab.com
 *   CONTACT_FROM_EMAIL  verified sender, e.g. "Ruyalab <contact@ruyalab.com>"
 */

const RESEND_URL = "https://api.resend.com/emails";

export type EmailConfig = { apiKey: string; to: string; from: string };

export function emailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || (to ? `Ruyalab <${to}>` : undefined);
  return apiKey && to && from ? { apiKey, to, from } : null;
}

type Message = { to: string; subject: string; html: string; text: string; replyTo?: string };

async function send(cfg: EmailConfig, msg: Message): Promise<void> {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${cfg.apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: cfg.from,
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Strip header-breaking characters from anything that lands in a subject line. */
const oneLine = (s: string, max = 80) => s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

function frame(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f3f2ee;font-family:Inter,Arial,sans-serif;color:#0b0b0d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden">
<tr><td style="background:#ffd000;padding:20px 28px;font:700 20px/1 Arial Narrow,Arial,sans-serif;letter-spacing:.5px">RUYALAB</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font:700 22px/1.2 Arial,sans-serif">${title}</h1>
${body}
</td></tr></table></td></tr></table></body></html>`;
}

/** Full enquiry to the studio inbox. Reply-To is the visitor. */
export function sendEnquiry(cfg: EmailConfig, f: ContactFields, meta: { submittedAt: string }) {
  const rows: [string, string][] = [
    ["Name", f.name],
    ["Email", f.email],
    ["Company", f.company || "—"],
    ["Project type", f.projectType || "—"],
    ["Received", meta.submittedAt],
  ];
  const html = frame(
    "New website enquiry",
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;margin-bottom:20px">
${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#66676d;width:120px;vertical-align:top">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`).join("")}
</table>
<div style="padding:16px;border-radius:12px;background:#f3f2ee;font-size:15px;line-height:1.55;white-space:pre-wrap">${esc(f.message)}</div>
<p style="margin:20px 0 0;font-size:13px;color:#66676d">Reply to this email to answer ${esc(f.name)} directly.</p>`,
  );
  const text = `New website enquiry\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${f.message}\n\nReply to this email to answer ${f.name} directly.`;
  return send(cfg, {
    to: cfg.to,
    replyTo: f.email,
    subject: oneLine(`New enquiry: ${f.name}${f.projectType ? ` (${f.projectType})` : ""}`),
    html,
    text,
  });
}

/**
 * Receipt to the visitor. Deliberately does NOT echo their message or any
 * free text beyond a shortened first name, so the form can't be abused to
 * send arbitrary content to third-party addresses from our domain.
 */
export function sendConfirmation(cfg: EmailConfig, f: ContactFields) {
  const first = oneLine(f.name.split(/\s+/)[0] ?? "", 30) || "there";
  const html = frame(
    `Thanks, ${esc(first)}, we've got your enquiry.`,
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.6">Your message reached the Ruyalab team. We read every enquiry and will get back to you soon.</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.6">If you'd like to add anything, just reply to this email.</p>
<p style="margin:24px 0 0;font-size:13px;color:#66676d">Ruyalab — design, engineering and AI.<br>You received this because this address was entered in the contact form at ruyalab.com.</p>`,
  );
  const text = `Thanks, ${first}, we've got your enquiry.\n\nYour message reached the Ruyalab team. We read every enquiry and will get back to you soon.\nIf you'd like to add anything, just reply to this email.\n\nRuyalab — design, engineering and AI.\nYou received this because this address was entered in the contact form at ruyalab.com.`;
  return send(cfg, {
    to: f.email,
    replyTo: cfg.to,
    subject: "We've received your enquiry — Ruyalab",
    html,
    text,
  });
}
