export type Capability = {
  index: string;
  title: string;
  description: string;
  disciplines: string[];
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Digital Experiences",
    description:
      "High-quality marketing websites, interactive websites, and digital storytelling.",
    disciplines: ["Marketing sites", "Interactive storytelling", "Launch campaigns"],
  },
  {
    index: "02",
    title: "Product Engineering",
    description:
      "Web applications, dashboards, SaaS platforms, and custom software.",
    disciplines: ["Web apps", "Dashboards", "SaaS platforms", "Custom software"],
  },
  {
    index: "03",
    title: "AI & Intelligent Products",
    description:
      "AI-powered workflows, conversational interfaces, and intelligent applications.",
    disciplines: ["AI workflows", "Conversational UI", "Intelligent apps"],
  },
  {
    index: "04",
    title: "Creative Development",
    description:
      "Interactive 3D, motion systems, WebGL, immersive interfaces, and experimental web experiences.",
    disciplines: ["WebGL & 3D", "Motion systems", "Immersive interfaces"],
  },
  {
    index: "05",
    title: "Content & CMS Platforms",
    description:
      "Headless WordPress, content-driven experiences, and scalable publishing systems.",
    disciplines: ["Headless WordPress", "Content platforms", "Publishing systems"],
  },
];

export type ProcessStep = { index: string; title: string; description: string };

export const process: ProcessStep[] = [
  { index: "01", title: "Discover", description: "Understand the problem and the opportunity." },
  { index: "02", title: "Define", description: "Establish the strategy, scope and direction." },
  { index: "03", title: "Design", description: "Shape the experience and the visual system." },
  { index: "04", title: "Build", description: "Engineer, test and refine." },
  { index: "05", title: "Launch", description: "Deploy, measure and improve." },
];

export type StackGroup = { label: string; note: string; items: string[] };

export const stack: StackGroup[] = [
  {
    label: "Interface",
    note: "What people see and touch",
    items: ["Next.js", "React", "TypeScript", "GSAP", "Three.js"],
  },
  {
    label: "Platform",
    note: "What keeps it running",
    items: ["Node.js", "PHP", "WordPress", "Cloudflare"],
  },
  {
    label: "Intelligence",
    note: "What makes it think",
    items: ["AI integrations", "APIs"],
  },
];
