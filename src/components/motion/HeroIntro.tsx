import type { ReactNode } from "react";

/**
 * The hero entrance itself is pure CSS (see Hero.module.css) so it starts at
 * first paint. Scroll-linked drift is attached later, after the lab trace.
 */
export function HeroIntro({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} data-hero-intro="">
      {children}
    </div>
  );
}
