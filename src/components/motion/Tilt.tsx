import type { ElementType, ComponentPropsWithoutRef } from "react";

/**
 * Marks an element for a subtle pointer tilt. The tilt itself is attached
 * after the page has gone quiet, and only for precise pointers.
 */
type Props<T extends ElementType> = { as?: T; max?: number } & ComponentPropsWithoutRef<T>;

export function Tilt<T extends ElementType = "div">({ as, max = 6, children, ...rest }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag data-tilt="" data-tilt-max={max} {...rest}>
      {children}
    </Tag>
  );
}
