import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "ruyalab_cms_session";
const MAX_AGE_SEC = 60 * 60 * 8; // 8 hours, same idea as Web Monitor RuyaShield

function secret() {
  const value = process.env.CMS_SESSION_SECRET?.trim();
  if (!value || value.length < 16) {
    throw new Error("CMS_SESSION_SECRET must be set (16+ characters).");
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

function b64url(buf: Buffer | string) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  return b.toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function cmsConfigured(): boolean {
  try {
    secret();
    adminPassword();
    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const expected = Buffer.from(adminPassword());
  const got = Buffer.from(password);
  if (expected.length !== got.length) {
    // Still do a compare to keep timing flatter.
    timingSafeEqual(expected, expected);
    return false;
  }
  return timingSafeEqual(expected, got);
}

export function createSessionToken(): string {
  const payload = b64url(JSON.stringify({ sub: "cms-admin", exp: Date.now() + MAX_AGE_SEC * 1000 }));
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function setSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isCmsAuthed(): Promise<boolean> {
  if (!cmsConfigured()) return false;
  const jar = await cookies();
  return readSessionToken(jar.get(COOKIE)?.value);
}

export async function requireCmsAuth() {
  if (!(await isCmsAuthed())) {
    throw new Error("Unauthorized");
  }
}
