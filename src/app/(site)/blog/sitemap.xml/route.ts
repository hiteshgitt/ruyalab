import { listPosts } from "@/cms/db";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Blog-only sitemap so the static core sitemap.xml stays a reliable GSC asset. */
export async function GET() {
  const posts = await listPosts({ status: "published" });
  const urls = [
    { loc: `${site.url}/blog`, lastmod: new Date().toISOString() },
    ...posts.map((p) => ({
      loc: `${site.url}/blog/${p.slug}`,
      lastmod: p.updatedAt || p.publishedAt || new Date().toISOString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
<loc>${u.loc}</loc>
<lastmod>${u.lastmod}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.6</priority>
</url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=600",
    },
  });
}
