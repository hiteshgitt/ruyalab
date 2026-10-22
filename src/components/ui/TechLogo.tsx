import {
  siCloudflare,
  siGsap,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siReact,
  siThreedotjs,
  siTypescript,
  siWordpress,
  type SimpleIcon,
} from "simple-icons";

/** Brand marks from simple-icons (CC0); two generic marks are drawn here. */
const BRANDS: Record<string, SimpleIcon> = {
  "Next.js": siNextdotjs,
  React: siReact,
  TypeScript: siTypescript,
  GSAP: siGsap,
  "Three.js": siThreedotjs,
  "Node.js": siNodedotjs,
  PHP: siPhp,
  WordPress: siWordpress,
  Cloudflare: siCloudflare,
};

const CUSTOM: Record<string, string> = {
  // Four-point spark with orbiting nodes
  "AI integrations":
    "M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2zM20 18.5a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zM6.5 20a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z",
  // Curly braces with a link dot
  APIs: "M8 3H6.5A2.5 2.5 0 0 0 4 5.5v4L2 12l2 2.5v4A2.5 2.5 0 0 0 6.5 21H8v-2H6.5a.5.5 0 0 1-.5-.5v-4.7L4.6 12 6 10.2V5.5a.5.5 0 0 1 .5-.5H8zm8 0h1.5A2.5 2.5 0 0 1 20 5.5v4l2 2.5-2 2.5v4a2.5 2.5 0 0 1-2.5 2.5H16v-2h1.5a.5.5 0 0 0 .5-.5v-4.7l1.4-1.8L18 10.2V5.5a.5.5 0 0 0-.5-.5H16zM12 10.25a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5z",
};

/** Hover colour; very dark brand colours fall back to the theme's text colour. */
export function brandColor(name: string): string {
  const hex = BRANDS[name]?.hex;
  if (!hex) return "var(--c-blue)";
  const n = parseInt(hex, 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum < 60 ? "var(--c-text)" : `#${hex}`;
}

export function TechLogo({ name, className }: { name: string; className?: string }) {
  const path = BRANDS[name]?.path ?? CUSTOM[name];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={path} fillRule={CUSTOM[name] ? "evenodd" : undefined} />
    </svg>
  );
}
