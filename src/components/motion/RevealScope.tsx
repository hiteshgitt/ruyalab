"use client";

import { useEffect, useRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { afterQuiet } from "@/lib/after-quiet";
import { motion, MQ } from "@/lib/motion";

/**
 * Declarative scroll motion. Server-rendered children opt in with data
 * attributes, so content stays readable without JavaScript and sections
 * remain Server Components:
 *
 *   data-split            masked line-by-line headline reveal
 *   data-reveal           fade/rise; siblings sharing a data-reveal-group stagger
 *   data-parallax="0.15"  scrubbed vertical drift (fraction of element height)
 *   data-scrub-words      words brighten as the block scrolls through
 *   data-draw="x|y"       line grows along an axis, scrubbed
 *
 * Everything is skipped under prefers-reduced-motion and cleaned up on unmount.
 */
type Props<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function RevealScope<T extends ElementType = "div">({ as, children, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let revert = () => {};
    let cancelled = false;

    const cancelQuiet = afterQuiet(() => void (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const q = <E extends Element = HTMLElement>(sel: string) =>
        Array.from(root.querySelectorAll<E & Element>(sel)) as E[];

      const mm = gsap.matchMedia();

      mm.add(MQ.motionOk, () => {
        // Masked line reveals
        const splits = q<HTMLElement>("[data-split]").map((el) =>
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 115,
                duration: motion.duration * 1.1,
                ease: motion.ease,
                stagger: motion.stagger,
                scrollTrigger: { trigger: el, start: motion.start, once: true },
              });
            },
          }),
        );

        // Fade/rise, grouped for stagger
        const groups = new Map<Element, HTMLElement[]>();
        q<HTMLElement>("[data-reveal]").forEach((el) => {
          const key = el.closest("[data-reveal-group]") ?? el;
          groups.set(key, [...(groups.get(key) ?? []), el]);
        });
        groups.forEach((els, trigger) => {
          gsap.from(els, {
            y: 36,
            autoAlpha: 0,
            duration: motion.duration,
            ease: motion.ease,
            stagger: motion.stagger * 1.5,
            scrollTrigger: { trigger, start: motion.start, once: true },
          });
        });

        // Parallax drift
        q<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = parseFloat(el.dataset.parallax || "0.12");
          gsap.fromTo(
            el,
            { yPercent: -amount * 50 },
            {
              yPercent: amount * 50,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Word-by-word brightening
        const wordSplits = q<HTMLElement>("[data-scrub-words]").map((el) =>
          SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit(self) {
              return gsap.fromTo(
                self.words,
                { opacity: 0.32 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
                },
              );
            },
          }),
        );

        // Drawn lines
        q<HTMLElement>("[data-draw]").forEach((el) => {
          const axis = el.dataset.draw === "y" ? "scaleY" : "scaleX";
          gsap.fromTo(
            el,
            { [axis]: 0 },
            {
              [axis]: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top 75%",
                end: "bottom 60%",
                scrub: 0.5,
              },
            },
          );
        });

        return () => {
          splits.forEach((s) => s.revert());
          wordSplits.forEach((s) => s.revert());
        };
      });

      // Fonts can shift layout after first paint; keep trigger positions honest.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      revert = () => mm.revert();
    })());

    return () => {
      cancelled = true;
      cancelQuiet();
      revert();
    };
  }, []);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
