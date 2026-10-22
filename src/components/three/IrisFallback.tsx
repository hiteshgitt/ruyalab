/**
 * Static SVG rendition of the Iris sculpture. Serves as the poster before
 * WebGL is ready, and as the permanent visual for reduced motion, Save-Data,
 * unsupported WebGL or a lost context. Fully deterministic (no randomness),
 * so it is safe to server-render.
 */

const RINGS = Array.from({ length: 18 }, (_, i) => {
  const t = i / 17;
  const r = 132 + t * 115;
  const tilt = 0.12 + t * 0.22;
  return {
    r,
    ry: r * Math.cos(tilt),
    rot: ((i * 0.37 * 180) / Math.PI) % 360,
    accent: i === 6 || i === 15,
    opacity: i === 6 || i === 15 ? 0.7 : 0.1 + (1 - t) * 0.22,
  };
});

const CONTOURS = Array.from({ length: 9 }, (_, i) => {
  const y = -84 + i * 21;
  const amp = 6 + (i % 3) * 4;
  const phase = i * 0.9;
  let d = "";
  for (let x = -110; x <= 110; x += 10) {
    const yy = y + Math.sin(x / 26 + phase) * amp + Math.cos(x / 41 - phase) * amp * 0.5;
    d += `${x === -110 ? "M" : "L"}${x} ${yy.toFixed(1)} `;
  }
  return d.trim();
});

export function IrisFallback({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-300 -300 600 600" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="iris-core" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#24357a" />
          <stop offset="0.55" stopColor="#101b45" />
          <stop offset="0.86" stopColor="#0b1233" />
          <stop offset="1" stopColor="#7d8fd6" />
        </radialGradient>
        <radialGradient id="iris-halo">
          <stop offset="0" stopColor="#2f6bff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="iris-fade" cx="40%" cy="35%" r="70%">
          <stop offset="0.2" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="iris-clip">
          <circle r="100" />
        </clipPath>
        <mask id="iris-mask">
          <circle r="100" fill="url(#iris-fade)" />
        </mask>
      </defs>
      <circle r="290" fill="url(#iris-halo)" />
      {RINGS.map((ring, i) => (
        <ellipse
          key={i}
          rx={ring.r}
          ry={ring.ry}
          fill="none"
          stroke={ring.accent ? (ring.r > 200 ? "#8f5bff" : "#45e3ff") : "#e6ecff"}
          strokeOpacity={ring.opacity}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          transform={`rotate(${ring.rot.toFixed(1)})`}
        />
      ))}
      <circle r="100" fill="url(#iris-core)" />
      <g clipPath="url(#iris-clip)" mask="url(#iris-mask)">
        {CONTOURS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#45e3ff" strokeOpacity="0.8" strokeWidth="1.1" />
        ))}
      </g>
    </svg>
  );
}
