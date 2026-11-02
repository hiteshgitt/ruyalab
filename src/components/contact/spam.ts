import type { ContactFields } from "./schema";

/**
 * Contact spam gate — runs before Resend so bots can't burn the free quota.
 * Silent "success" for discarded spam (don't teach bots the rules).
 */

const FREE_MAIL = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "mail.ru",
  "yandex.ru",
  "yandex.com",
  "proton.me",
  "protonmail.com",
]);

const BIG_BRAND_COMPANY =
  /^(google|alphabet|microsoft|meta|facebook|amazon|apple|openai|ibm|oracle|salesforce|netflix|uber|airbnb)\b/i;

const PRICE_ONLY =
  /\b(price|pricing|прайс|прайс[а-я]*|cost|quote|бюджет|сколько|how much)\b/i;

const memoryHits = new Map<string, { n: number; reset: number }>();

export type SpamVerdict = {
  /** Discard entirely — no Resend, no CMS. */
  discard: boolean;
  /** Skip visitor confirmation email (saves quota). */
  skipConfirmation: boolean;
  score: number;
  reasons: string[];
};

function emailDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

function localPart(email: string): string {
  return (email.split("@")[0] ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function nameTokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

/** Crude: "RobertJougs" with no space + mixed case mid-word. */
function looksLikeFusedName(name: string): boolean {
  if (/\s/.test(name.trim())) return false;
  return /[a-z][A-Z]/.test(name) || (name.length >= 10 && /^[A-Z][a-z]+[A-Z][a-z]+$/.test(name));
}

function nameEmailMismatch(name: string, email: string): boolean {
  const local = localPart(email);
  if (local.length < 3) return false;
  const tokens = nameTokens(name);
  if (!tokens.length) {
    // fused name vs unrelated local
    const fused = name.toLowerCase().replace(/[^a-z]/g, "");
    if (fused.length >= 4 && !local.includes(fused.slice(0, 4)) && !fused.includes(local.slice(0, 4))) {
      return true;
    }
    return false;
  }
  return !tokens.some((t) => local.includes(t) || t.includes(local.slice(0, Math.min(4, local.length))));
}

function mostlyNonLatin(message: string): boolean {
  const letters = message.replace(/[^\p{L}]/gu, "");
  if (letters.length < 8) return false;
  const nonLatin = letters.replace(/[A-Za-z]/g, "");
  return nonLatin.length / letters.length > 0.7;
}

export function scoreSubmission(fields: ContactFields, meta: { elapsedMs: number | null }): SpamVerdict {
  let score = 0;
  const reasons: string[] = [];

  if (looksLikeFusedName(fields.name)) {
    score += 2;
    reasons.push("fused-name");
  }
  if (nameEmailMismatch(fields.name, fields.email)) {
    score += 2;
    reasons.push("name-email-mismatch");
  }

  const domain = emailDomain(fields.email);
  const company = fields.company.trim();
  if (company && BIG_BRAND_COMPANY.test(company) && FREE_MAIL.has(domain)) {
    score += 3;
    reasons.push("brand-company-free-mail");
  }

  const msg = fields.message.trim();
  if (msg.length < 40 && PRICE_ONLY.test(msg)) {
    score += 2;
    reasons.push("price-only");
  }
  if (mostlyNonLatin(msg) && /^[\x00-\x7F]+$/.test(fields.name)) {
    score += 1;
    reasons.push("script-mismatch");
  }

  // Submitted too fast for a human (< 2.5s) when timing field present
  if (meta.elapsedMs !== null && meta.elapsedMs >= 0 && meta.elapsedMs < 2500) {
    score += 3;
    reasons.push("too-fast");
  }
  // Missing timing from enhanced form is a mild signal (plain no-JS still ok)
  if (meta.elapsedMs === null) {
    score += 1;
    reasons.push("no-timing");
  }

  // URL spam / injection attempts in message
  if ((msg.match(/https?:\/\//gi) || []).length >= 3) {
    score += 2;
    reasons.push("link-spam");
  }

  const discard = score >= 3;
  const skipConfirmation = discard || score >= 1 || process.env.CONTACT_SEND_CONFIRMATION?.trim() !== "1";

  return { discard, skipConfirmation, score, reasons };
}

export function clientKey(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip")?.trim();
  if (cf) return `ip:${cf}`;
  const xff = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (xff) return `ip:${xff}`;
  return "ip:unknown";
}

/** Sliding window: max `limit` hits per `windowMs` for a key. */
export function hitRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const cur = memoryHits.get(key);
  if (!cur || now > cur.reset) {
    memoryHits.set(key, { n: 1, reset: now + windowMs });
    return false;
  }
  cur.n += 1;
  return cur.n > limit;
}

/** Optional Cloudflare Turnstile — only enforced when secret is configured. */
export async function verifyTurnstile(token: string, ip: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    // Fail closed only when Turnstile is explicitly configured
    return false;
  }
}
