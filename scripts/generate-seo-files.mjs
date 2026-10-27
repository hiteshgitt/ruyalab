import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Writes static robots.txt + sitemap.xml into public/ so Cloudflare can serve
 * them as assets. Google Search Console often fails to fetch the dynamic
 * Worker route when Bot Fight Mode is on; a static file is more reliable.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://ruyalab.com").trim().replace(/\/+$/, "");
const projectsSrc = readFileSync(join(root, "src/data/projects.ts"), "utf8");
const blocks = projectsSrc.split(/\n  \{\n/);
const slugs = [];
for (const block of blocks) {
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
  if (slug && block.includes("caseStudy:")) slugs.push(slug);
}

const lastmod = new Date().toISOString();
const urls = [
  { loc: `${site}/`, changefreq: "monthly", priority: "1" },
  ...slugs.map((slug) => ({
    loc: `${site}/work/${slug}`,
    changefreq: "yearly",
    priority: "0.7",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
<loc>${u.loc}</loc>
<lastmod>${lastmod}</lastmod>
<changefreq>${u.changefreq}</changefreq>
<priority>${u.priority}</priority>
</url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-Agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`;

const out = join(root, "public");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "sitemap.xml"), sitemap);
writeFileSync(join(out, "robots.txt"), robots);
console.log(`SEO files written for ${site} (${urls.length} urls)`);
