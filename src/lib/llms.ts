import { projects } from "@/data/projects";
import { capabilities, playbooks, process, stack } from "@/data/services";
import { site } from "@/lib/site";

/**
 * llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI
 * assistants and agents. Generated from the same data the pages render, so
 * it never drifts from what visitors see.
 */

const studies = projects.filter((p) => p.caseStudy);
const products = studies.filter((p) => p.status === "Live");
const clientWork = studies.filter((p) => p.status !== "Live");

const line = (p: (typeof studies)[number]) =>
  `- [${p.name}](${site.url}/work/${p.slug}): ${p.summary} (${p.industry}; ${p.services.join(", ")})${p.liveUrl ? ` Live at ${p.liveUrl}` : ""}`;

export function llmsIndex(): string {
  return `# ${site.name}

> ${site.description}

Ruyalab is an independent creative technology studio. Design, engineering and AI are done by the same team. It ships digital products, AI-powered experiences, marketing websites, interactive 3D, and headless content platforms — without a handoff between three vendors.

The projects listed under "Products" are built and run by Ruyalab. The projects listed under "Client work" were built for clients, whose names are kept confidential.

## Pages

- [Home](${site.url}/): Studio overview, capabilities, process, technology and contact form
- [Selected work](${site.url}/#work): Products and client work with summaries
- [Capabilities](${site.url}/#capabilities): The five disciplines the studio offers
- [Studio](${site.url}/#studio): Approach and working playbooks
- [Contact](${site.url}/#contact): Enquiry form for new projects

## Products

${products.map(line).join("\n")}

## Client work

${clientWork.map(line).join("\n")}

## Capabilities

${capabilities.map((c) => `- ${c.title}: ${c.description}`).join("\n")}

## Contact

- Email: ${site.email}
- Enquiry form: ${site.url}/#contact

## Optional

- [Full content](${site.url}/llms-full.txt): Every case study and playbook in one file
- [Sitemap](${site.url}/sitemap.xml)
`;
}

export function llmsFull(): string {
  const caseStudies = studies
    .map(
      (p) => `### ${p.name}

URL: ${site.url}/work/${p.slug}
Status: ${p.status === "Live" ? `Live product, ${p.year}` : `Client work (client confidential), ${p.year}`}${p.liveUrl ? `\nLive site: ${p.liveUrl}` : ""}
Industry: ${p.industry}
Services: ${p.services.join(", ")}

${p.summary}

**The question.** ${p.caseStudy!.challenge}

**The approach.** ${p.caseStudy!.approach}

**Where it landed.** ${p.caseStudy!.outcome}`,
    )
    .join("\n\n");

  return `# ${site.name}: full content

> ${site.description}

Source: ${site.url}. Contact: ${site.email}.

## Capabilities

${capabilities.map((c) => `### ${c.index}. ${c.title}\n\n${c.description}\n\nDisciplines: ${c.disciplines.join(", ")}`).join("\n\n")}

## Process

${process.map((s) => `${s.index}. **${s.title}**: ${s.description}`).join("\n")}

## Playbooks

${playbooks.map((b) => `### ${b.label}\n\n${b.steps.map((s, i) => `${i + 1}. **${s.title}** (${s.short}): ${s.detail}`).join("\n")}`).join("\n\n")}

## Technology

${stack.map((g) => `- **${g.label}** (${g.note}): ${g.items.join(", ")}`).join("\n")}

## Work

Entries marked "Live" are products built and run by Ruyalab; the rest were built for clients, whose names are kept confidential.

${caseStudies}
`;
}
