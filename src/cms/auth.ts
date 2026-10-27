import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { verifyTotp } from "./totp";

const COOKIE = "ruyalab_cms_session";
const PENDING_COOKIE = "ruyalab_cms_pending";
const MAX_AGE_SEC = 60 * 60 * 8; // 8 hours
const PENDING_AGE_SEC = 60 * 5; // 5 minutes to enter TOTP

function secret() {
  const value = process.env.CMS_SESSION_SECRET?.trim();
  if (!value || value.length < 16) {
    throw new Error("CMS_SESSION_SECRET must be set (16+ characters).");
  }
  return value;
}

function adminUsername() {
  const value = process.env.CMS_ADMIN_USERNAME?.trim();
  if (!value || value.length < 3) {
    throw new Error("CMS_ADMIN_USERNAME must be set (3+ characters).");
  }
  return value;
}

function adminPassword() {
  const value = process.env.CMS_ADMIN_PASSWORD?.trim();
  if (!value || value.length < 10) {
    throw new Error("CMS_ADMIN_PASSWORD must be set (10+ characters).");
  }
  return value;
}

function totpSecret() {
  const value = process.env.CMS_TOTP_SECRET?.trim().replace(/\s+/g, "");
  if (!value || value.length < 16) {
    throw new Error("CMS_TOTP_SECRET must be set (base32, 16+ characters).");
  }
  return value;
}

function b64url(buf: Buffer | string) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  return b.toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqualStr(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function cmsConfigured(): boolean {
  try {
    secret();
    adminUsername();
    adminPassword();
    totpSecret();
    return true;
  } catch {
    return false;
  }
}

export function verifyCredentials(username: string, password: string): boolean {
  try {
    const userOk = safeEqualStr(username.trim().toLowerCase(), adminUsername().toLowerCase());
    const expected = Buffer.from(adminPassword());
    const got = Buffer.from(password);
    const passOk =
      expected.length === got.length ? timingSafeEqual(expected, got) : (timingSafeEqual(expected, expected), false);
    return userOk && passOk;
  } catch {
    return false;
  }
}

export function verifyAuthenticatorCode(code: string): boolean {
  try {
    return verifyTotp(code, totpSecret(), 1);
  } catch {
    return false;
  }
}

type SessionKind = "full" | "pending";

function createToken(kind: SessionKind, username: string, maxAgeSec: number): string {
  const payload = b64url(
    JSON.stringify({
      sub: username,
      kind,
      exp: Date.now() + maxAgeSec * 1000,
    }),
  );
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string | undefined, kind: SessionKind): { ok: true; sub: string } | { ok: false } {
  if (!token) return { ok: false };
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return { ok: false };
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false };
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
      kind?: string;
      sub?: string;
    };
    if (data.kind !== kind) return { ok: false };
    if (typeof data.exp !== "number" || data.exp <= Date.now()) return { ok: false };
    if (typeof data.sub !== "string" || !data.sub) return { ok: false };
    return { ok: true, sub: data.sub };
  } catch {
    return { ok: false };
  }
}

export async function setPendingCookie(username: string) {
  const jar = await cookies();
  jar.set(PENDING_COOKIE, createToken("pending", username, PENDING_AGE_SEC), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PENDING_AGE_SEC,
  });
}

export async function clearPendingCookie() {
  const jar = await cookies();
  jar.delete(PENDING_COOKIE);
}

export async function hasPendingAuth(): Promise<boolean> {
  if (!cmsConfigured()) return false;
  const jar = await cookies();
  return readToken(jar.get(PENDING_COOKIE)?.value, "pending").ok;
}

export async function setSessionCookie(username?: string) {
  const jar = await cookies();
  const sub = username || adminUsername();
  jar.set(COOKIE, createToken("full", sub, MAX_AGE_SEC), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  jar.delete(PENDING_COOKIE);
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
  jar.delete(PENDING_COOKIE);
}

export async function isCmsAuthed(): Promise<boolean> {
  if (!cmsConfigured()) return false;
  const jar = await cookies();
  return readToken(jar.get(COOKIE)?.value, "full").ok;
}

export async function requireCmsAuth() {
  if (!(await isCmsAuthed())) {
    throw new Error("Unauthorized");
  }
}
