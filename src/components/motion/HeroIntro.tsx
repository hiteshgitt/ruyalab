"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MQ } from "@/lib/motion";

/**
 * The hero entrance itself is pure CSS (see Hero.module.css) so it starts at
 * first paint without waiting for hydration — the hero copy is the LCP
 * element. This component adds only the scroll-linked hand-off: the copy
 * drifts up and softens as the next section arrives.
 * GSAP is loaded after mount so it is not part of the initial script parse.
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const content = root?.querySelector("[data-hero-content]");
    if (!root || !content) return;
    let revert = () => {};
    let cancelled = false;

    void (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.to(content, {
          yPercent: -8,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      });
      revert = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
