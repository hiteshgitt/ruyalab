import type { CSSProperties, ReactNode } from "react";

/** Eight-petal flower blob (reference-style), with optional centred content. */
export function Flower({ className, children, style }: { className?: string; children?: ReactNode; style?: CSSProperties }) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return { cx: 50 + Math.cos(a) * 26, cy: 50 + Math.sin(a) * 26 };
  });
  return (
    <span className={className} style={{ position: "relative", display: "grid", placeItems: "center", ...style }}>
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
        <g fill="currentColor">
          {petals.map((p, i) => (
            <circle key={i} cx={p.cx.toFixed(2)} cy={p.cy.toFixed(2)} r="20" />
          ))}
          <circle cx="50" cy="50" r="30" />
        </g>
      </svg>
      {children && <span style={{ position: "relative" }}>{children}</span>}
    </span>
  );
}
