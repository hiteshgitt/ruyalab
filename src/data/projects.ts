/**
 * Portfolio entries. "Live" entries are products Ruyalab built and runs;
 * "Client work" entries are commissions, described without naming the client
 * (no client name, logo or live link). Extend (or wire to a CMS) using the
 * same shape.
 */

export type ProjectStatus = "Live" | "Client work";

/** Procedural cover artwork, used when no `cover` image is supplied. */
export type ProjectVisual = "call" | "pulse" | "journal" | "stand" | "campus" | "wordpress";

export type Project = {
  slug: string;
  name: string;
  /** Product name, or a description of the client that does not name them. */
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
    slug: "talkel",
    name: "Talkel",
    client: "Talkel — Ruyalab product",
    industry: "EdTech",
    services: ["Voice AI", "Android app", "Web app"],
    summary:
      "An AI phone-call partner for rehearsing the English conversations that matter — interviews, salary talks, tough client calls — then seeing exactly what to fix.",
    year: 2026,
    status: "Live",
    visual: "call",
    liveUrl: "https://talkel.ruyalab.com/",
    caseStudy: {
      challenge:
        "Plenty of people read and write English well but freeze when they have to speak it under pressure — a job interview, a raise, an unhappy client. Most apps drill vocabulary; almost none let you rehearse the moment itself.",
      approach:
        "A real-time voice call with AI characters who react, ask follow-ups and push back. Open practice scenarios sit alongside eleven missions with five pressure levels, interviews tailored to your own role, and Indian, American, British or Australian accents. After each call Talkel scores the conversation and lists every fix — grammar, more natural phrasing, Hinglish translated word for word, filler words and pauses — explained in English or Hindi.",
      outcome:
        "Live on the web with an Android app on the way to the Play Store. Ten free minutes of practice every day, and custom topics let people rehearse their own situation.",
    },
  },
  {
    slug: "web-monitor",
    name: "Web Monitor",
    client: "Web Monitor — Ruyalab product",
    industry: "Developer tools",
    services: ["SaaS platform", "Mobile app", "Integrations"],
    summary:
      "Round-the-clock monitoring for WordPress, Laravel, Next.js and PHP sites — real response times, downtime alerts, security and SEO health, on the web and your phone.",
    year: 2026,
    status: "Live",
    visual: "pulse",
    liveUrl: "https://webmonitor.ruyalab.com/",
    caseStudy: {
      challenge:
        "Teams run WordPress, Laravel, Next.js and plain PHP sites side by side, and too often hear a site is slow or down from a customer. A basic uptime ping says a site answered — not whether it is healthy.",
      approach:
        "A small integration for each platform — a WordPress plugin, an npm package, Composer packages for Laravel and CodeIgniter, or one endpoint for anything else — reports real health, performance, SEO and security data. Every site is checked every minute, downtime opens an incident and a push alert, and a Pro Advanced view adds AI insights built on the site's own history.",
      outcome:
        "Live with a free Basic plan, a web dashboard and the same live view on Android and iPhone. Every number comes from a real check — when something can't be measured, it says so instead of guessing.",
    },
  },
  {
    slug: "wellness-publishing-platform",
    name: "Wellness Journal",
    client: "Wellness publisher — client confidential",
    industry: "Media & wellness",
    services: ["Web application", "Headless CMS", "Memberships & payments"],
    summary:
      "A bilingual editorial and membership platform for a Nordic wellness publication — long-form journalism, members-only content, retreats and paid subscriptions.",
    year: 2026,
    status: "Client work",
    visual: "journal",
    caseStudy: {
      challenge:
        "A wellness publication and retreat practice wanted one home for its writing, its retreats and its paying members — in two languages, with the calm pacing of a printed magazine rather than the look of a SaaS template.",
      approach:
        "A Next.js front end on Payload CMS and Postgres, with every page in two languages. Editors control gating per article; memberships, an introductory three-month offer and renewal reminders run on Stripe with transactional email. Events, retreats and advertising campaigns are managed from the same CMS, with role-based access for the team.",
      outcome:
        "An editorial site and member platform the client's team runs day to day — publishing, selling memberships and filling retreats without a developer in the loop.",
    },
  },
  {
    slug: "exhibition-studio-website",
    name: "Exhibition Studio",
    client: "Exhibition design & fabrication company — client confidential",
    industry: "Exhibitions & manufacturing",
    services: ["Marketing website", "Creative development", "Bilingual content"],
    summary:
      "A premium bilingual website for an exhibition stand design and fabrication company — editorial typography, cinematic scroll motion and a full project portfolio.",
    year: 2026,
    status: "Client work",
    visual: "stand",
    caseStudy: {
      challenge:
        "The company designs, builds and installs exhibition stands across Europe, but its site read like a supplier listing. It needed to sell craft and scale to marketing teams choosing a partner for their next trade fair — in Polish and English.",
      approach:
        "A fully static Next.js site with large display type, duotone photography and GSAP scroll choreography: line-by-line reveals, masked image reveals, counters and a pinned horizontal walk through the eight-step process. Ten case studies, a sector index, published client reviews and a contact form that sends straight to the team's inbox, with localised metadata for both languages.",
      outcome:
        "A fast, static site that presents the company as a design-led partner, with a portfolio and content structure ready to move into a CMS.",
    },
  },
  {
    slug: "education-websites",
    name: "Education Websites",
    client: "Universities, business schools and K-12 schools — clients confidential",
    industry: "Higher education",
    services: ["University websites", "Admissions landing pages", "Lead capture"],
    summary:
      "Websites and admissions campaign pages for universities, business schools and K-12 schools across India and the UAE — built to turn ad traffic into qualified applications.",
    year: 2026,
    status: "Client work",
    visual: "campus",
    caseStudy: {
      challenge:
        "Every admissions season brings new programmes, entrance tests and expos, each with its own ad campaign and a short window to capture enquiries. Institutions need pages that launch in days, load fast on mobile data and feed every lead straight to their admissions teams.",
      approach:
        "Lightweight, static-first landing pages for each programme and campaign, with enquiry forms wired to the institution's CRM, tag-manager tracking and per-campaign variants. For full institutional sites we build on Next.js or Laravel with a CMS, so editors can update programmes, news and events themselves.",
      outcome:
        "Around thirty sites and campaign pages delivered for institutions in India and the UAE, from undergraduate and MBA admissions to school enrolment and education expos.",
    },
  },
  {
    slug: "wordpress-engineering",
    name: "WordPress Engineering",
    client: "Agencies, publishers and brands — clients confidential",
    industry: "Web platforms",
    services: ["Custom plugins", "Custom themes", "Gutenberg blocks"],
    summary:
      "Custom WordPress plugins, themes and block libraries on our own modular framework — business logic in a tested core plugin, presentation in a lean theme.",
    year: 2026,
    status: "Client work",
    visual: "wordpress",
    caseStudy: {
      challenge:
        "Most WordPress builds pile business logic into the theme and a stack of third-party plugins, so every redesign or update breaks something. Teams want to keep the editor they know without inheriting that fragility.",
      approach:
        "An in-house modular framework: a core plugin holds all business logic with dependency injection and PSR-4 autoloading, a presentation-only theme handles the front end, and adapters add Gutenberg blocks, Elementor widgets or WooCommerce only where a site needs them. A Vite build pipeline, WordPress Coding Standards, static analysis, and accessibility, security and performance are built in. We also ship standalone plugins, such as the integration that feeds health data to Web Monitor.",
      outcome:
        "Client sites where editors keep the WordPress tools they know, redesigns touch only the theme, and logic is tested once and reused across projects.",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
