import { projects } from "@/data/projects";
import { capabilities, playbooks, process, stack } from "@/data/services";
import { site } from "@/lib/site";

/**
 * llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI
 * assistants and agents. Generated from the same data the pages render, so
 * it never drifts from what visitors see.
 */

const studies = projects.filter((p) => p.caseStudy);

export function llmsIndex(): string {
  return `# ${site.name}

> ${site.description}

Ruyalab is an independent creative technology studio. It designs and builds marketing websites, web applications, AI-powered products, interactive 3D experiences and headless content platforms. Strategy, design and engineering are done by the same team.

The projects listed under "Concept studies" are self-initiated explorations, not client commissions.

## Pages

- [Home](${site.url}/): Studio overview, capabilities, process, technology and contact form
- [Selected work](${site.url}/#work): Concept studies with summaries
- [Capabilities](${site.url}/#capabilities): The five disciplines the studio offers
- [Studio](${site.url}/#studio): Approach and working playbooks
- [Contact](${site.url}/#contact): Enquiry form for new projects

## Concept studies

${studies.map((p) => `- [${p.name}](${site.url}/work/${p.slug}): ${p.summary} (${p.industry}; ${p.services.join(", ")})`).join("\n")}

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
Status: ${p.status} (self-initiated study, ${p.year})
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

## Concept studies

The following are self-initiated explorations, not client commissions.

${caseStudies}
`;
}
