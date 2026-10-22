import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/lib/site";

// Pages are fully static, so the build time is when their content last changed.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects
      .filter((p) => p.caseStudy)
      .map((p) => ({
        url: `${site.url}/work/${p.slug}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
  ];
}
