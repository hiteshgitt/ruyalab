/** Shared motion tokens — keep in sync with the CSS --ease / --d tokens. */
export const motion = {
  ease: "expo.out",
  easeInOut: "power3.inOut",
  duration: 1.1,
  stagger: 0.07,
  /** Where scroll reveals start: element top hits 88% of viewport height. */
  start: "top 88%",
} as const;

export const MQ = {
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;
