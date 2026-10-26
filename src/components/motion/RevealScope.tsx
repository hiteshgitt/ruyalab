import type { ElementType, ComponentPropsWithoutRef } from "react";

/**
 * Declarative scroll motion. Children opt in with data attributes, so content
 * stays readable without JavaScript. The motion itself is attached after the
 * page has gone quiet (see src/boot/enhance.ts):
 *
 *   data-split            masked line-by-line headline reveal
 *   data-reveal           fade/rise; siblings sharing a data-reveal-group stagger
 *   data-parallax="0.15"  scrubbed vertical drift (fraction of element height)
 *   data-scrub-words      words brighten as the block scrolls through
 *   data-draw="x|y"       line grows along an axis, scrubbed
 */
type Props<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function RevealScope<T extends ElementType = "div">({ as, children, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag {...rest}>{children}</Tag>;
}
