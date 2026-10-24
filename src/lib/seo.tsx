import type { Project } from "@/data/projects";
import { capabilities } from "@/data/services";
import { site } from "@/lib/site";

/**
 * schema.org structured data. Only facts that are true and visible on the
 * site go in here (Google penalises markup that doesn't match the page).
 */

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    logo: { "@type": "ImageObject", url: `${site.url}/logo.png`, width: 512, height: 512 },
    image: `${site.url}/opengraph-image`,
    description: site.description,
    email: site.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      url: `${site.url}/#contact`,
      availableLanguage: ["en"],
    },
    knowsAbout: capabilities.map((c) => c.title),
    ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function caseStudyLd(p: Project) {
  const url = `${site.url}/work/${p.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: p.name,
      headline: `${p.name} — ${p.status === "Live" ? "product" : "client project"}`,
      description: p.summary,
      url,
      dateCreated: String(p.year),
      creativeWorkStatus: p.status,
      genre: p.industry,
      keywords: p.services.join(", "),
      inLanguage: "en",
      creator: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": SITE_ID },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/#work` },
        { "@type": "ListItem", position: 3, name: p.name, item: url },
      ],
    },
  ];
}

/** Escape "<" so a value can never close the script tag early. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
