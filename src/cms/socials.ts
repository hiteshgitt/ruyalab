import { site } from "@/lib/site";
import { getCmsSocials } from "./db";
import type { SocialLink } from "./types";

/** CMS socials win when set; otherwise fall back to NEXT_PUBLIC_SOCIAL_LINKS. */
export async function resolveSocials(): Promise<SocialLink[]> {
  try {
    const fromCms = await getCmsSocials();
    if (fromCms.length > 0) return fromCms;
  } catch {
    // Store unavailable (e.g. local without .data) — use env.
  }
  return [...site.socials];
}
