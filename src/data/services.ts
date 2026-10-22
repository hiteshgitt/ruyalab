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

/** Playbooks — adapted from the brand kit's workflow diagrams. */
export type PlaybookStep = {
  title: string;
  short: string;
  detail: string;
  pose: "discover" | "explore" | "hero" | "code" | "build" | "launch" | "grow";
};

export type Playbook = { key: string; label: string; steps: PlaybookStep[] };

export const playbooks: Playbook[] = [
  {
    key: "idea",
    label: "Idea → product",
    steps: [
      { title: "Idea", short: "Define the vision", detail: "Name the problem, the audience and what success would look like — in a page, not a deck.", pose: "hero" },
      { title: "Research", short: "Explore options", detail: "Map what already exists, talk to the people involved, and find where the real opportunity sits.", pose: "discover" },
      { title: "Prototype", short: "Test assumptions", detail: "Build the smallest thing that answers the riskiest question, then put it in front of real people.", pose: "explore" },
      { title: "Build", short: "Develop the product", detail: "Turn what we learned into a typed, tested, production-grade product.", pose: "build" },
      { title: "Launch", short: "Ship and learn", detail: "Release, measure what matters, and feed it straight back into the next iteration.", pose: "launch" },
    ],
  },
  {
    key: "problem",
    label: "Problem solving",
    steps: [
      { title: "Understand", short: "Clarify the problem", detail: "Separate symptoms from causes and agree on exactly what we are solving.", pose: "discover" },
      { title: "Break down", short: "Find subproblems", detail: "Split the problem into parts small enough to reason about and test independently.", pose: "explore" },
      { title: "Solve", short: "Choose an approach", detail: "Weigh the trade-offs openly and commit to the simplest approach that holds up.", pose: "code" },
      { title: "Optimize", short: "Improve complexity", detail: "Remove what isn't needed and make what remains faster and easier to change.", pose: "grow" },
      { title: "Verify", short: "Test edge cases", detail: "Prove it works where things usually break — the edges, the errors, the scale.", pose: "hero" },
    ],
  },
  {
    key: "software",
    label: "Software development",
    steps: [
      { title: "Discover", short: "Requirements", detail: "Capture what the software must do, for whom, and under which constraints.", pose: "discover" },
      { title: "Design", short: "Architecture & UX", detail: "Shape the system and the experience together, so neither is an afterthought.", pose: "explore" },
      { title: "Develop", short: "Code & review", detail: "Small, reviewed changes in a typed codebase — readable today, maintainable next year.", pose: "code" },
      { title: "Test", short: "QA & validation", detail: "Automated checks plus hands-on testing across devices, browsers and assistive tech.", pose: "build" },
      { title: "Deploy", short: "Release safely", detail: "Ship behind previews and monitoring, with a fast way back if anything misbehaves.", pose: "launch" },
    ],
  },
];
