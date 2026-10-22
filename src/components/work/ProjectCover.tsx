import type { ProjectVisual } from "@/data/projects";

/**
 * Original procedural cover artwork for concept projects: a vivid brand panel
 * and a drawn motif for each product. Drawn on a
 * 1600×1000 canvas and cropped by the container (preserveAspectRatio slice),
 * so one artwork serves every aspect ratio. Deterministic for SSR.
 */

const W = 1600;
const H = 1000;

type Palette = { bg: string; ink: string; acc: string };

const PALETTES: Record<ProjectVisual, Palette> = {
  orbit: { bg: "#0b1438", ink: "#e6ecff", acc: "#ffd000" },
  ledger: { bg: "#ffd000", ink: "#0b0b0d", acc: "#2f45ff" },
  signal: { bg: "#ff4b2b", ink: "#0b0b0d", acc: "#ffffff" },
  strata: { bg: "#cfc8ff", ink: "#0b0b0d", acc: "#ff4b2b" },
};

function Orbit({ ink, acc }: Palette) {
  const cx = 1000;
  const cy = 440;
  const R = 330;
  return (
    <>
      <circle cx={cx} cy={cy} r={R} fill="#101d4b" stroke={ink} strokeOpacity="0.3" strokeWidth="2" />
      {Array.from({ length: 11 }, (_, i) => {
        const lat = -75 + i * 15;
        const y = cy + Math.sin((lat * Math.PI) / 180) * R;
        const rx = Math.cos((lat * Math.PI) / 180) * R;
        return <ellipse key={`l${i}`} cx={cx} cy={y} rx={rx} ry={rx * 0.16} fill="none" stroke={ink} strokeOpacity="0.16" strokeWidth="2" />;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const rx = Math.abs(Math.cos((i / 9) * Math.PI)) * R;
        return <ellipse key={`m${i}`} cx={cx} cy={cy} rx={rx} ry={R} fill="none" stroke={ink} strokeOpacity="0.12" strokeWidth="2" />;
      })}
      <ellipse cx={cx} cy={cy} rx={R * 1.55} ry={R * 0.42} fill="none" stroke="#45e3ff" strokeWidth="5" transform={`rotate(-18 ${cx} ${cy})`} />
      {Array.from({ length: 26 }, (_, i) => {
        const a = i * 2.39996;
        const r = R * Math.sqrt((i + 0.5) / 26) * 0.92;
        return <circle key={`d${i}`} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r * 0.9} r={i % 5 === 0 ? 10 : 4} fill={i % 5 === 0 ? acc : ink} fillOpacity={i % 5 === 0 ? 1 : 0.55} />;
      })}
      <circle cx={cx + R * 1.47} cy={cy - R * 0.36} r="16" fill={acc} />
    </>
  );
}

function Ledger({ ink, acc }: Palette) {
  const cols = 14;
  const bw = 52;
  const gap = 24;
  const x0 = 120;
  const base = 820;
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`g${i}`} x1="100" x2="1500" y1={260 + i * 112} y2={260 + i * 112} stroke={ink} strokeOpacity="0.12" strokeWidth="2" />
      ))}
      {Array.from({ length: cols }, (_, i) => {
        const h = 120 + ((Math.sin(i * 1.7) + 1) / 2) * 380 + (i % 4) * 30;
        const accent = i === 9;
        return <rect key={i} x={x0 + i * (bw + gap)} y={base - h} width={bw} height={h} rx="10" fill={accent ? acc : ink} fillOpacity={accent ? 1 : 0.85} />;
      })}
    </>
  );
}

function Signal({ ink, acc }: Palette) {
  return (
    <>
      {Array.from({ length: 20 }, (_, i) => {
        const y0 = 200 + i * 30;
        const accent = i === 10;
        let d = "";
        for (let x = 0; x <= W; x += 20) {
          const env = Math.exp(-Math.pow((x - 560) / 380, 2));
          const y = y0 + Math.sin(x / 38 + i * 0.5) * 70 * env * (1 - Math.abs(i - 10) / 12);
          d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
        }
        return <path key={i} d={d} fill="none" stroke={accent ? acc : ink} strokeOpacity={accent ? 1 : 0.4} strokeWidth={accent ? 6 : 2.5} />;
      })}
      <rect x="100" y="110" width="330" height="80" rx="40" fill={ink} />
      <circle cx="150" cy="150" r="11" fill={acc} />
      <text x="180" y="162" fill="#fff" fontFamily="ui-monospace, monospace" fontSize="32" letterSpacing="3">
        LISTENING
      </text>
    </>
  );
}

function Strata({ ink, acc }: Palette) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={200 + i * 270} x2={200 + i * 270} y1="60" y2="940" stroke={ink} strokeOpacity="0.14" strokeWidth="2" />
      ))}
      <text x="110" y="860" fill={ink} fontFamily="Impact, 'Arial Narrow', sans-serif" fontSize="760" letterSpacing="-10">
        FO
      </text>
      <rect x="760" y="140" width="300" height="380" rx="20" fill="#fff" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x="790" y={200 + i * 32} width={i % 4 === 3 ? 140 : 240} height="12" rx="6" fill={ink} fillOpacity="0.3" />
      ))}
      <rect x="790" y="165" width="110" height="14" rx="7" fill={acc} />
    </>
  );
}

const ART: Record<ProjectVisual, (p: Palette) => React.JSX.Element> = {
  orbit: Orbit,
  ledger: Ledger,
  signal: Signal,
  strata: Strata,
};

export function ProjectCover({ visual, className }: { visual: ProjectVisual; className?: string }) {
  const p = PALETTES[visual];
  const Art = ART[visual];
  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width={W} height={H} fill={p.bg} />
      <Art {...p} />
    </svg>
  );
}
