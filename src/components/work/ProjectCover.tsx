import type { ProjectVisual } from "@/data/projects";

/**
 * Original procedural cover artwork for projects: a vivid brand panel
 * and a drawn motif for each product. Drawn on a
 * 1600×1000 canvas and cropped by the container (preserveAspectRatio slice),
 * so one artwork serves every aspect ratio. Deterministic for SSR.
 */

const W = 1600;
const H = 1000;

type Palette = { bg: string; ink: string; acc: string };

const PALETTES: Record<ProjectVisual, Palette> = {
  call: { bg: "#2f45ff", ink: "#ffffff", acc: "#ffd000" },
  pulse: { bg: "#ffd000", ink: "#0b0b0d", acc: "#2f45ff" },
  journal: { bg: "#cfc8ff", ink: "#0b0b0d", acc: "#ff4b2b" },
  stand: { bg: "#0b1438", ink: "#e6ecff", acc: "#ff4b2b" },
  campus: { bg: "#ff4b2b", ink: "#0b0b0d", acc: "#ffffff" },
  wordpress: { bg: "#0b0b0d", ink: "#f4f4f0", acc: "#ffd000" },
};

const MONO = "ui-monospace, monospace";
const SANS = "system-ui, sans-serif";
const DISPLAY = "Impact, 'Arial Narrow', sans-serif";

function Call({ ink, acc }: Palette) {
  const cx = 800;
  return (
    <>
      {[250, 360, 480, 610].map((r, i) => (
        <circle key={r} cx={cx} cy="390" r={r} fill="none" stroke={ink} strokeOpacity={0.22 - i * 0.04} strokeWidth="3" />
      ))}
      {/* speech bubble */}
      <path d="M210 170h330a34 34 0 0 1 34 34v96a34 34 0 0 1-34 34H300l-46 40v-40h-44a34 34 0 0 1-34-34v-96a34 34 0 0 1 34-34z" fill={ink} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="216" y={208 + i * 34} width={i === 2 ? 190 : 300} height="14" rx="7" fill="#2f45ff" fillOpacity={i === 0 ? 0.9 : 0.35} />
      ))}
      {/* phone on a live call */}
      <g transform="translate(0 50)">
      <rect x="620" y="90" width="360" height="610" rx="52" fill="#0b0b0d" />
      <rect x="650" y="124" width="116" height="40" rx="20" fill="#ff4b2b" />
      <circle cx="674" cy="144" r="7" fill={ink} />
      <text x="690" y="154" fill={ink} fontFamily="ui-monospace, monospace" fontSize="24" letterSpacing="2">REC</text>
      <text x="950" y="154" textAnchor="end" fill={ink} fillOpacity="0.6" fontFamily="ui-monospace, monospace" fontSize="24">03:12</text>
      <circle cx={cx} cy="270" r="64" fill={acc} />
      <text x={cx} y="294" textAnchor="middle" fill="#0b0b0d" fontFamily="Impact, 'Arial Narrow', sans-serif" fontSize="68">R</text>
      <text x={cx} y="384" textAnchor="middle" fill={ink} fontFamily="system-ui, sans-serif" fontSize="34" fontWeight="700">Ruya</text>
      <text x={cx} y="420" textAnchor="middle" fill={ink} fillOpacity="0.55" fontFamily="system-ui, sans-serif" fontSize="22">Hiring manager</text>
      {Array.from({ length: 15 }, (_, i) => {
        const h = 16 + Math.abs(Math.sin(i * 1.3) * 70) * (1 - Math.abs(i - 7) / 9);
        return <rect key={i} x={662 + i * 19} y={510 - h / 2} width="10" height={h} rx="5" fill={i === 7 ? acc : ink} fillOpacity={i === 7 ? 1 : 0.7} />;
      })}
      {[700, 800, 900].map((x) => (
        <circle key={x} cx={x} cy="625" r="34" fill={x === 800 ? "#ff4b2b" : ink} fillOpacity={x === 800 ? 1 : 0.14} />
      ))}
      </g>
      {/* feedback score */}
      <circle cx="1150" cy="260" r="96" fill={ink} />
      <circle cx="1150" cy="260" r="74" fill="none" stroke="#2f45ff" strokeOpacity="0.15" strokeWidth="16" />
      <circle cx="1150" cy="260" r="74" fill="none" stroke={acc} strokeWidth="16" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 74 * 0.78} 999`} transform="rotate(-90 1150 260)" />
      <text x="1150" y="282" textAnchor="middle" fill="#0b0b0d" fontFamily="Impact, 'Arial Narrow', sans-serif" fontSize="64">78</text>
      <rect x="1040" y="430" width="400" height="64" rx="32" fill={acc} />
      <text x="1072" y="472" fill="#0b0b0d" fontFamily="ui-monospace, monospace" fontSize="24">✓ I have been working</text>
    </>
  );
}

function Pulse({ ink, acc }: Palette) {
  // Response-time trace inside a browser window, with an uptime ring and a push alert beside it.
  const pts = Array.from({ length: 23 }, (_, i) => {
    const x = 540 + i * 24;
    const spike = i === 15 ? 150 : i === 14 || i === 16 ? 60 : 0;
    const y = 520 - (Math.sin(i * 0.9) + 1) * 26 - spike;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]} 600 L${pts[0][0]} 600 Z`;
  const ring = 2 * Math.PI * 70;
  return (
    <>
      {Array.from({ length: 30 }, (_, i) => (
        <rect key={i} x={110 + i * 46} y="880" width="30" height="70" rx="8" fill={i === 19 ? "#ff4b2b" : ink} fillOpacity={i === 19 ? 1 : 0.85} />
      ))}
      {/* browser window */}
      <rect x="500" y="150" width="600" height="500" rx="30" fill="#fff" />
      <rect x="500" y="150" width="600" height="70" rx="30" fill={ink} />
      <rect x="500" y="190" width="600" height="30" fill={ink} />
      {["#ff4b2b", "#ffd000", "#4cc38a"].map((c, i) => (
        <circle key={c} cx={540 + i * 30} cy="185" r="9" fill={c} />
      ))}
      <rect x="650" y="168" width="300" height="34" rx="17" fill="#fff" fillOpacity="0.14" />
      <text x="800" y="192" textAnchor="middle" fill="#fff" fillOpacity="0.7" fontFamily={MONO} fontSize="18">
        shop.example
      </text>
      <text x="540" y="276" fill={ink} fillOpacity="0.5" fontFamily={MONO} fontSize="20" letterSpacing="2">
        RESPONSE TIME
      </text>
      <text x="540" y="340" fill={ink} fontFamily={DISPLAY} fontSize="64">
        182 ms
      </text>
      <path d={area} fill={acc} fillOpacity="0.14" />
      <path d={line} fill="none" stroke={acc} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[15][0]} cy={pts[15][1]} r="11" fill="#ff4b2b" />
      {["WP", "Next.js", "Laravel", "PHP"].map((t, i) => (
        <g key={t}>
          <rect x={540 + i * 128} y="604" width="116" height="30" rx="15" fill={ink} fillOpacity="0.08" />
          <text x={598 + i * 128} y="625" textAnchor="middle" fill={ink} fillOpacity="0.7" fontFamily={SANS} fontSize="17">
            {t}
          </text>
        </g>
      ))}
      {/* uptime ring */}
      <circle cx="340" cy="300" r="100" fill={ink} />
      <circle cx="340" cy="300" r="70" fill="none" stroke="#fff" strokeOpacity="0.15" strokeWidth="16" />
      <circle cx="340" cy="300" r="70" fill="none" stroke="#4cc38a" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${ring * 0.96} 999`} transform="rotate(-90 340 300)" />
      <text x="340" y="312" textAnchor="middle" fill="#fff" fontFamily={DISPLAY} fontSize="40">
        99.9%
      </text>
      {/* push alert */}
      <rect x="1040" y="420" width="420" height="120" rx="26" fill={ink} />
      <circle cx="1100" cy="480" r="26" fill="#ff4b2b" />
      <path d="M1100 466v18M1100 492v2" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <text x="1146" y="470" fill="#fff" fontFamily={SANS} fontSize="26" fontWeight="700">
        Portal is down
      </text>
      <text x="1146" y="506" fill="#fff" fillOpacity="0.6" fontFamily={MONO} fontSize="20">
        HTTP 503 · just now
      </text>
      <rect x="1180" y="190" width="280" height="56" rx="28" fill={ink} />
      <circle cx="1212" cy="218" r="9" fill="#4cc38a" />
      <text x="1232" y="227" fill="#fff" fontFamily={MONO} fontSize="20" letterSpacing="2">
        EVERY 60S
      </text>
    </>
  );
}

function Journal({ ink, acc }: Palette) {
  // A bilingual long-form article with a members-only paywall and a membership card.
  return (
    <>
      <rect x="560" y="170" width="520" height="640" rx="20" fill={ink} fillOpacity="0.12" transform="rotate(6 820 490)" />
      <rect x="520" y="130" width="560" height="660" rx="20" fill="#fbf8f2" />
      <text x="560" y="200" fill={ink} fontFamily="Georgia, 'Times New Roman', serif" fontSize="44" fontStyle="italic">
        The Journal
      </text>
      <rect x="932" y="168" width="108" height="40" rx="20" fill={ink} />
      <text x="986" y="195" textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize="18" letterSpacing="2">
        IS · EN
      </text>
      <line x1="560" x2="1040" y1="226" y2="226" stroke={ink} strokeOpacity="0.2" strokeWidth="2" />
      <rect x="560" y="250" width="480" height="250" rx="12" fill="#2f5d4a" />
      <circle cx="930" cy="320" r="34" fill="#ffd000" />
      <path d="M560 500 L680 380 L760 450 L860 340 L1040 500 Z" fill="#1d3b2f" />
      <path d="M560 500 L640 440 L720 480 L800 430 L900 470 L1040 420 L1040 500 Z" fill="#14281f" />
      <text x="560" y="560" fill={ink} fontFamily="Georgia, 'Times New Roman', serif" fontSize="40">
        Slow mornings, warm water
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x="560" y={588 + i * 30} width={i === 2 ? 300 : 480} height="12" rx="6" fill={ink} fillOpacity="0.22" />
      ))}
      <rect x="520" y="690" width="560" height="100" fill="#fbf8f2" fillOpacity="0.85" />
      <rect x="690" y="712" width="220" height="56" rx="28" fill={acc} />
      <rect x="722" y="736" width="20" height="16" rx="3" fill="#fff" />
      <path d="M726 736v-6a6 6 0 0 1 12 0v6" fill="none" stroke="#fff" strokeWidth="3" />
      <text x="756" y="749" fill="#fff" fontFamily={MONO} fontSize="20" letterSpacing="2">
        MEMBERS
      </text>
      {/* membership and retreat cards */}
      <g transform="translate(70 0) rotate(-8 300 330)">
        <rect x="150" y="240" width="300" height="180" rx="22" fill={ink} />
        <text x="180" y="290" fill="#fff" fillOpacity="0.6" fontFamily={MONO} fontSize="18" letterSpacing="2">
          MEMBERSHIP
        </text>
        <text x="180" y="350" fill="#fff" fontFamily={DISPLAY} fontSize="48">
          3 months
        </text>
        <rect x="180" y="374" width="120" height="14" rx="7" fill={acc} />
      </g>
      <rect x="1140" y="300" width="300" height="150" rx="22" fill="#fff" />
      <text x="1170" y="350" fill={ink} fillOpacity="0.5" fontFamily={MONO} fontSize="18" letterSpacing="2">
        RETREAT · MAY
      </text>
      <text x="1170" y="400" fill={ink} fontFamily="Georgia, 'Times New Roman', serif" fontSize="34">
        4 nights, north
      </text>
      <rect x="1170" y="420" width="90" height="10" rx="5" fill={acc} />
    </>
  );
}

function Stand({ ink, acc }: Palette) {
  // An isometric exhibition stand: two walls, a screen, a counter and a lit header beam.
  const s = 80;
  const iso = (x: number, y: number, z: number) => [740 + (x - y) * s * 0.866, 440 + (x + y) * s * 0.5 - z * s];
  const poly = (pts: [number, number, number][]) => pts.map((p) => iso(...p).map((n) => n.toFixed(1)).join(",")).join(" ");
  const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: string, front: string, side: string) => (
    <>
      <polygon points={poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill={front} />
      <polygon points={poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]])} fill={side} />
      <polygon points={poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} fill={top} />
    </>
  );
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={i * 200} x2={i * 200 + 600} y1="1000" y2="650" stroke={ink} strokeOpacity="0.08" strokeWidth="2" />
      ))}
      <polygon points={poly([[0, 0, 0], [6, 0, 0], [6, 4, 0], [0, 4, 0]])} fill={ink} fillOpacity="0.14" />
      <polygon points={poly([[0, 0, 0], [6, 0, 0], [6, 0, 3], [0, 0, 3]])} fill="#ffffff" />
      <polygon points={poly([[0, 0, 0], [0, 4, 0], [0, 4, 3], [0, 0, 3]])} fill="#c9d2ff" />
      <polygon points={poly([[1, 0.01, 1.1], [3.8, 0.01, 1.1], [3.8, 0.01, 2.6], [1, 0.01, 2.6]])} fill="#2f45ff" />
      <polygon points={poly([[1.3, 0.02, 1.4], [2.6, 0.02, 1.4], [2.6, 0.02, 2.3], [1.3, 0.02, 2.3]])} fill="#ffd000" />
      <polygon points={poly([[0.01, 1, 0.9], [0.01, 3, 0.9], [0.01, 3, 2.5], [0.01, 1, 2.5]])} fill="#0b1438" fillOpacity="0.2" />
      {box(0, 6, 0, 0.4, 3, 3.45, "#ffffff", acc, "#c9341b")}
      {box(3.6, 5.6, 2.4, 3.2, 0, 1.1, "#ffffff", "#dfe4ff", "#a6b1ea")}
      {box(4.1, 5.1, 2.6, 3.0, 1.1, 1.16, acc, acc, acc)}
      {[1, 2.5, 4, 5.5].map((x) => {
        const [cx, cy] = iso(x, 0.4, 3.0);
        return <polygon key={x} points={`${cx - 8},${cy} ${cx + 8},${cy} ${cx + 70},${cy + 220} ${cx - 70},${cy + 220}`} fill="#fff" fillOpacity="0.08" />;
      })}
      <rect x="1120" y="160" width="300" height="56" rx="28" fill={ink} />
      <text x="1150" y="197" fill="#0b1438" fontFamily={MONO} fontSize="20" letterSpacing="2">
        DESIGN · BUILD
      </text>
    </>
  );
}

function Campus({ ink, acc }: Palette) {
  // A fan of admissions landing pages, the front one carrying an enquiry form.
  const page = (hero: string, key: string) => (
    <g key={key}>
      <rect x="0" y="0" width="420" height="560" rx="22" fill={acc} />
      <rect x="0" y="0" width="420" height="44" rx="22" fill={ink} fillOpacity="0.08" />
      <rect x="20" y="60" width="380" height="200" rx="12" fill={hero} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="20" y={290 + i * 30} width={i === 2 ? 200 : 380} height="14" rx="7" fill={ink} fillOpacity="0.2" />
      ))}
    </g>
  );
  return (
    <>
      <g transform="translate(330 250) rotate(-12)">{page("#2f45ff", "a")}</g>
      <g transform="translate(860 190) rotate(10)">{page("#ffd000", "b")}</g>
      <g transform="translate(590 130)">
        <rect x="0" y="0" width="420" height="640" rx="22" fill={acc} />
        <rect x="0" y="0" width="420" height="230" rx="22" fill="#0b1438" />
        <rect x="0" y="200" width="420" height="30" fill="#0b1438" />
        {/* mortarboard */}
        <path d="M210 70 L300 108 L210 146 L120 108 Z" fill="#ffd000" />
        <path d="M160 126 v34 c0 14 100 14 100 0 v-34" fill="#ffd000" />
        <path d="M300 108 v46" stroke="#ffd000" strokeWidth="5" />
        <text x="210" y="200" textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize="20" letterSpacing="3">
          ADMISSIONS OPEN
        </text>
        <text x="32" y="290" fill={ink} fontFamily={SANS} fontSize="26" fontWeight="700">
          Enquire now
        </text>
        {["Full name", "Mobile", "Programme"].map((f, i) => (
          <g key={f}>
            <rect x="32" y={316 + i * 70} width="356" height="52" rx="12" fill="none" stroke={ink} strokeOpacity="0.25" strokeWidth="2" />
            <text x="50" y={349 + i * 70} fill={ink} fillOpacity="0.45" fontFamily={SANS} fontSize="20">
              {f}
            </text>
          </g>
        ))}
        <rect x="32" y="534" width="356" height="64" rx="32" fill={ink} />
        <text x="210" y="574" textAnchor="middle" fill="#fff" fontFamily={MONO} fontSize="22" letterSpacing="3">
          APPLY NOW →
        </text>
      </g>
      <rect x="1080" y="140" width="320" height="60" rx="30" fill={ink} />
      <circle cx="1114" cy="170" r="10" fill="#4cc38a" />
      <text x="1136" y="179" fill="#fff" fontFamily={MONO} fontSize="20" letterSpacing="2">
        NEW LEAD · CRM
      </text>
    </>
  );
}

function WordPress({ ink, acc }: Palette) {
  // The framework as a layer diagram: theme on top, adapters, core plugin, WordPress underneath.
  const label = (x: number, y: number, t: string, fill: string, size = 26) => (
    <text x={x} y={y} textAnchor="middle" fill={fill} fontFamily={MONO} fontSize={size} letterSpacing="2">
      {t}
    </text>
  );
  const adapters: [string, string][] = [
    ["BLOCKS", acc],
    ["ELEMENTOR", "#cfc8ff"],
    ["COMMERCE", "#ff4b2b"],
  ];
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={i * 110} x2={i * 110} y1="0" y2={H} stroke={ink} strokeOpacity="0.06" strokeWidth="2" />
      ))}
      {[250, 390, 530].map((y) => (
        <path key={y} d={`M800 ${y} v30`} stroke={ink} strokeOpacity="0.4" strokeWidth="3" strokeDasharray="6 6" />
      ))}
      <rect x="480" y="150" width="640" height="100" rx="22" fill={ink} />
      {label(800, 210, "THEME · PRESENTATION", "#0b0b0d")}
      {adapters.map(([t, c], i) => (
        <g key={t}>
          <rect x={480 + i * 220} y="280" width="200" height="110" rx="22" fill={c} />
          {label(580 + i * 220, 345, t, "#0b0b0d", 22)}
        </g>
      ))}
      <rect x="480" y="420" width="640" height="110" rx="22" fill="#2f45ff" />
      {label(800, 470, "CORE PLUGIN", "#fff")}
      {label(800, 506, "DI · PSR-4 · TESTED", "#fff", 18)}
      <rect x="480" y="560" width="640" height="100" rx="22" fill="none" stroke={ink} strokeOpacity="0.35" strokeWidth="3" />
      {label(800, 620, "WORDPRESS", ink)}
      {/* code chip */}
      <g transform="translate(40 0) rotate(-6 290 300)">
        <rect x="150" y="250" width="290" height="140" rx="20" fill="#17181c" stroke={ink} strokeOpacity="0.15" strokeWidth="2" />
        <text x="176" y="300" fill={acc} fontFamily={MONO} fontSize="22">add_action(</text>
        <text x="200" y="336" fill={ink} fillOpacity="0.7" fontFamily={MONO} fontSize="22">&apos;init&apos;, …</text>
        <text x="176" y="372" fill={acc} fontFamily={MONO} fontSize="22">);</text>
      </g>
      {/* block inserter */}
      <g transform="translate(-40 0) rotate(5 1310 300)">
        <rect x="1180" y="200" width="260" height="220" rx="20" fill={ink} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={1206 + (i % 3) * 74} y={226 + Math.floor(i / 3) * 74} width="60" height="60" rx="12" fill="#0b0b0d" fillOpacity={i === 0 ? 1 : 0.12} />
        ))}
        <path d="M1236 242v28M1222 256h28" stroke={acc} strokeWidth="5" strokeLinecap="round" />
        <rect x="1206" y="378" width="140" height="14" rx="7" fill="#0b0b0d" fillOpacity="0.3" />
      </g>
    </>
  );
}

const ART: Record<ProjectVisual, (p: Palette) => React.JSX.Element> = {
  call: Call,
  pulse: Pulse,
  journal: Journal,
  stand: Stand,
  campus: Campus,
  wordpress: WordPress,
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
