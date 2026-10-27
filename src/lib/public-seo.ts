import { connection } from "next/server";
import { DEFAULT_SEO } from "@/lib/site";
import type { SeoSettings } from "@/cms/types";

/** Site-facing SEO (CMS overrides when saved). Safe fallback to defaults. */
export async function getPublicSeo(): Promise<SeoSettings> {
  // Read at request time so CMS SEO edits are not baked into the static shell.
  await connection();
  try {
    const { getSeoSettings } = await import("@/cms/db");
    return await getSeoSettings();
  } catch {
    return { ...DEFAULT_SEO };
  }
}
