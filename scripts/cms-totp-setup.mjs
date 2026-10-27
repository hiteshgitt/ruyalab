#!/usr/bin/env node
/**
 * Generate a CMS TOTP secret + otpauth URL for Google Authenticator / 1Password / Authy.
 *
 * Usage:
 *   node scripts/cms-totp-setup.mjs [username]
 */
import { createHmac, randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function generateTotpSecret(bytes = 20) {
  const buf = randomBytes(bytes);
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(input) {
  const cleaned = input.replace(/=+$/g, "").toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const out = [];
  for (const ch of cleaned) {
    const idx = ALPHABET.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function hotp(secret, counter) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", secret).update(buf).digest();
  const offset = digest[digest.length - 1] & 0xf;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  return String(code % 1_000_000).padStart(6, "0");
}

const username = process.argv[2] || "admin";
const secret = generateTotpSecret();
const issuer = "Ruyalab CMS";
const label = encodeURIComponent(`${issuer}:${username}`);
const url = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
const nowCode = hotp(base32Decode(secret), Math.floor(Date.now() / 1000 / 30));

console.log(`
CMS authenticator setup
-----------------------
Username for login: ${username}

1) Add to .env.local / Worker secrets:
   CMS_ADMIN_USERNAME=${username}
   CMS_TOTP_SECRET=${secret}

2) Scan this URL in Google Authenticator / 1Password / Authy
   (or paste the secret manually):

${url}

Secret (manual entry): ${secret}
Current code (sanity check): ${nowCode}

3) Cloudflare:
   npx wrangler secret put CMS_ADMIN_USERNAME
   npx wrangler secret put CMS_TOTP_SECRET
`);
