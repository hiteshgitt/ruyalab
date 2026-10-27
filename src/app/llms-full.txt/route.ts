import { llmsFull } from "@/lib/llms";
import { getPublicSeo } from "@/lib/public-seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const seo = await getPublicSeo();
  return new Response(llmsFull(seo.description), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
