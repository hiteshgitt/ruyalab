/**
 * Portfolio entries. These are concept studies — original, self-initiated
 * explorations — and are labelled as such everywhere they appear. Replace or
 * extend with real client work (or wire to a CMS) using the same shape.
 */

export type ProjectStatus = "Concept" | "In progress" | "Live";

/** Procedural cover artwork, used when no `cover` image is supplied. */
export type ProjectVisual = "orbit" | "ledger" | "signal" | "strata";

export type Project = {
  slug: string;
  name: string;
  /** Client or product name. For concepts, the fictional product name. */
  client: string;
  industry: string;
  services: string[];
  summary: string;
  year: number;
  status: ProjectStatus;
  visual: ProjectVisual;
  cover?: { src: string; alt: string; width: number; height: number };
  /** Render an internal case-study page at /work/[slug]. */
  caseStudy?: {
    challenge: string;
    approach: string;
    outcome: string;
  };
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "atlas-observatory",
    name: "Atlas Observatory",
    client: "Atlas — concept product",
    industry: "Climate data",
    services: ["Product design", "WebGL", "Data visualisation"],
    summary:
      "An explorable 3D globe that turns dense planetary datasets into a calm, navigable story for non-specialists.",
    year: 2026,
    status: "Concept",
    visual: "orbit",
    caseStudy: {
      challenge:
        "Climate datasets are vast, technical and usually presented as charts for experts. The question we asked: what would it take for a curious non-specialist to explore them for ten minutes without getting lost?",
      approach:
        "We prototyped a single spatial interface — a slowly rotating globe — where every layer shares the same camera, legend and timeline. Data is streamed in tiles and rendered with lightweight shaders so the experience holds up on mid-range phones.",
      outcome:
        "A working prototype that explores the interaction model and performance budget. It is a self-initiated study, not a commissioned product.",
    },
  },
  {
    slug: "ledgerline",
    name: "Ledgerline",
    client: "Ledgerline — concept product",
    industry: "Fintech",
    services: ["SaaS platform", "Design system", "Engineering"],
    summary:
      "A finance operations dashboard exploring how much clarity a dense, real-time product can carry before it needs another screen.",
    year: 2026,
    status: "Concept",
    visual: "ledger",
    caseStudy: {
      challenge:
        "Operations teams live inside dashboards that grow by accretion. Each new metric adds noise until the important signal is the hardest thing to find.",
      approach:
        "We designed a typographic, grid-first system where hierarchy comes from scale and rhythm rather than colour, then built it as a typed component library with live-updating views.",
      outcome:
        "A reference design system and interactive prototype used to test information density patterns.",
    },
  },
  {
    slug: "murmur",
    name: "Murmur",
    client: "Murmur — concept product",
    industry: "Customer experience",
    services: ["AI product", "Conversational UI", "Prototyping"],
    summary:
      "A conversational support layer that knows when to answer, when to ask, and when to hand over to a person.",
    year: 2025,
    status: "Concept",
    visual: "signal",
    caseStudy: {
      challenge:
        "Most AI assistants are optimised to always respond. In support, a confident wrong answer costs more than a short wait for a human.",
      approach:
        "We explored retrieval-grounded responses with explicit confidence states in the interface, plus a hand-over pattern that carries full context to a human agent.",
      outcome:
        "An interaction prototype and evaluation harness for testing escalation behaviour.",
    },
  },
  {
    slug: "folio-press",
    name: "Folio Press",
    client: "Folio — concept platform",
    industry: "Publishing",
    services: ["Headless WordPress", "Next.js", "Editorial design"],
    summary:
      "A headless publishing platform where editors keep the tools they know and readers get a fast, art-directed magazine.",
    year: 2025,
    status: "Concept",
    visual: "strata",
    caseStudy: {
      challenge:
        "Editorial teams want WordPress. Readers want speed and craft. Traditional themes force a trade-off between the two.",
      approach:
        "WordPress as a structured content API, Next.js as the presentation layer, with block-level art direction that editors control without writing code.",
      outcome:
        "A reference architecture and front-end prototype for content-led sites.",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
