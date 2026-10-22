/**
 * Site-wide configuration. Anything that must be real (domain, email, social
 * profiles) comes from environment variables so nothing is invented. Unset
 * values are omitted from the UI rather than replaced with placeholders.
 */

function resolveSiteUrl(): string {
  // Dashboard-entered values often carry stray whitespace or a trailing slash.
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export type SocialLink = { label: string; href: string };

function parseSocials(raw: string | undefined): SocialLink[] {
  // Format: "Label|https://url,Label|https://url"
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.split("|").map((s) => s.trim()))
    .filter(([label, href]) => label && href?.startsWith("https://"))
    .map(([label, href]) => ({ label, href }));
}

export const site = {
  name: "Ruyalab",
  url: resolveSiteUrl(),
  title: "Ruyalab — Creative Technology Studio",
  description:
    "Ruyalab is an independent creative technology studio blending design, engineering and AI to build digital products and experiences built for what comes next.",
  tagline: "Design, engineering and AI — built for what comes next.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  socials: parseSocials(process.env.NEXT_PUBLIC_SOCIAL_LINKS),
} as const;

export const navItems = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Capabilities", href: "/#capabilities", id: "capabilities" },
  { label: "Studio", href: "/#studio", id: "studio" },
  { label: "Contact", href: "/#contact", id: "contact" },
] as const;
