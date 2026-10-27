import { siGithub, siInstagram, siX, siYoutube } from "simple-icons";

/** LinkedIn is not shipped in current simple-icons builds; keep the standard mark locally. */
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1-.004-4.123 2.062 2.062 0 0 1 .004 4.123zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const BY_LABEL: Record<string, { path: string }> = {
  linkedin: { path: LINKEDIN_PATH },
  github: siGithub,
  x: siX,
  twitter: siX,
  instagram: siInstagram,
  youtube: siYoutube,
};

function resolvePath(label: string, href: string): string {
  const key = label.trim().toLowerCase();
  if (BY_LABEL[key]) return BY_LABEL[key].path;
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host.includes("linkedin")) return LINKEDIN_PATH;
    if (host.includes("github")) return siGithub.path;
    if (host === "x.com" || host.includes("twitter")) return siX.path;
    if (host.includes("instagram")) return siInstagram.path;
    if (host.includes("youtube")) return siYoutube.path;
  } catch {
    /* ignore */
  }
  return "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z";
}

/** Brand mark for a CMS/env social link. */
export function SocialIcon({ label, href, className }: { label: string; href: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={resolvePath(label, href)} />
    </svg>
  );
}
