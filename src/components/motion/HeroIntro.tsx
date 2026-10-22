"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * The hero entrance itself is pure CSS (see Hero.module.css) so it starts at
 * first paint without waiting for hydration — the hero copy is the LCP
 * element. This component adds only the scroll-linked hand-off: the copy
 * drifts up and softens as the next section arrives.
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const content = root?.querySelector("[data-hero-content]");
      if (!root || !content) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.to(content, {
          yPercent: -8,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
