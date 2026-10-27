import { join } from "node:path";
import { LINKEDIN_KICKOFFS } from "./linkedin-kickoffs";
import type {
  Enquiry,
  EnquiryStage,
  LinkedInDraft,
  Post,
  PostInput,
  PostStatus,
  SeoSettings,
  SocialLink,
} from "./types";
import { DEFAULT_SEO } from "@/lib/site";

type D1Prepared = {
  bind: (...values: unknown[]) => D1Prepared;
  first: <T>() => Promise<T | null>;
  all: <T>() => Promise<{ results: T[] }>;
  run: () => Promise<unknown>;
};

type D1Database = {
  prepare: (query: string) => D1Prepared;
};

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  project_type: string;
  message: string;
  source: string;
  stage: EnquiryStage;
  icp_fit: string;
  notes: string;
  created_at: string;
};

type LocalDb = {
  posts: PostRow[];
  settings: Record<string, string>;
  enquiries: EnquiryRow[];
};

const LOCAL_PATH = join(process.cwd(), ".data", "cms.json");

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return crypto.randomUUID();
}

function rowToPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function readLocal(): LocalDb {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  if (!fs.existsSync(LOCAL_PATH)) return { posts: [], settings: {}, enquiries: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8")) as Partial<LocalDb>;
    return {
      posts: parsed.posts || [],
      settings: parsed.settings || {},
      enquiries: parsed.enquiries || [],
    };
  } catch {
    return { posts: [], settings: {}, enquiries: [] };
  }
}

function rowToEnquiry(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    projectType: row.project_type,
    message: row.message,
    source: row.source,
    stage: row.stage,
    icpFit: row.icp_fit,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function writeLocal(db: LocalDb) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  fs.mkdirSync(join(process.cwd(), ".data"), { recursive: true });
  fs.writeFileSync(LOCAL_PATH, JSON.stringify(db, null, 2));
}

async function getD1(): Promise<D1Database | null> {
  try {
    // Present on Cloudflare Workers Builds / OpenNext; absent in plain `next dev`.
    // webpackIgnore keeps local `next build` from failing when the package is not installed.
    const mod = await import(/* webpackIgnore: true */ "@opennextjs/cloudflare");
    const ctx = await mod.getCloudflareContext({ async: true });
    const env = ctx?.env as { CMS_DB?: D1Database } | undefined;
    return env?.CMS_DB ?? null;
  } catch {
    return null;
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeInput(input: PostInput): PostInput {
  const slug = slugify(input.slug || input.title);
  if (!slug) throw new Error("Slug is required.");
  if (!input.title.trim()) throw new Error("Title is required.");
  if (input.status !== "draft" && input.status !== "published") {
    throw new Error("Status must be draft or published.");
  }
  return {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    body: input.body,
    status: input.status,
    publishedAt: input.publishedAt ?? null,
  };
}

export async function listPosts(opts?: { status?: PostStatus | "all" }): Promise<Post[]> {
  const status = opts?.status ?? "all";
  const d1 = await getD1();
  if (d1) {
    const sql =
      status === "all"
        ? "SELECT * FROM posts ORDER BY COALESCE(published_at, updated_at) DESC"
        : "SELECT * FROM posts WHERE status = ? ORDER BY COALESCE(published_at, updated_at) DESC";
    const stmt = status === "all" ? d1.prepare(sql) : d1.prepare(sql).bind(status);
    const { results } = await stmt.all<PostRow>();
    return (results || []).map(rowToPost);
  }
  const local = readLocal();
  return local.posts
    .filter((p) => status === "all" || p.status === status)
    .sort((a, b) => (b.published_at || b.updated_at).localeCompare(a.published_at || a.updated_at))
    .map(rowToPost);
}

export async function getPostById(id: string): Promise<Post | null> {
  const d1 = await getD1();
  if (d1) {
    const row = await d1.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first<PostRow>();
    return row ? rowToPost(row) : null;
  }
  const row = readLocal().posts.find((p) => p.id === id);
  return row ? rowToPost(row) : null;
}

export async function getPostBySlug(slug: string, opts?: { publishedOnly?: boolean }): Promise<Post | null> {
  const d1 = await getD1();
  if (d1) {
    const row = opts?.publishedOnly
      ? await d1
          .prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'")
          .bind(slug)
          .first<PostRow>()
      : await d1.prepare("SELECT * FROM posts WHERE slug = ?").bind(slug).first<PostRow>();
    return row ? rowToPost(row) : null;
  }
  const row = readLocal().posts.find(
    (p) => p.slug === slug && (!opts?.publishedOnly || p.status === "published"),
  );
  return row ? rowToPost(row) : null;
}

export async function createPost(input: PostInput): Promise<Post> {
  const data = normalizeInput(input);
  const existing = await getPostBySlug(data.slug);
  if (existing) throw new Error("That slug is already in use.");
  const ts = nowIso();
  const publishedAt = data.status === "published" ? data.publishedAt || ts : null;
  const row: PostRow = {
    id: newId(),
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    status: data.status,
    published_at: publishedAt,
    created_at: ts,
    updated_at: ts,
  };

  const d1 = await getD1();
  if (d1) {
    await d1
      .prepare(
        `INSERT INTO posts (id, slug, title, excerpt, body, status, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        row.id,
        row.slug,
        row.title,
        row.excerpt,
        row.body,
        row.status,
        row.published_at,
        row.created_at,
        row.updated_at,
      )
      .run();
    return rowToPost(row);
  }

  const local = readLocal();
  local.posts.push(row);
  writeLocal(local);
  return rowToPost(row);
}

export async function updatePost(id: string, input: PostInput): Promise<Post> {
  const current = await getPostById(id);
  if (!current) throw new Error("Post not found.");
  const data = normalizeInput(input);
  const clash = await getPostBySlug(data.slug);
  if (clash && clash.id !== id) throw new Error("That slug is already in use.");

  const ts = nowIso();
  let publishedAt = current.publishedAt;
  if (data.status === "published") {
    publishedAt = data.publishedAt || current.publishedAt || ts;
  } else {
    publishedAt = null;
  }

  const row: PostRow = {
    id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    status: data.status,
    published_at: publishedAt,
    created_at: current.createdAt,
    updated_at: ts,
  };

  const d1 = await getD1();
  if (d1) {
    await d1
      .prepare(
        `UPDATE posts SET slug=?, title=?, excerpt=?, body=?, status=?, published_at=?, updated_at=?
         WHERE id=?`,
      )
      .bind(row.slug, row.title, row.excerpt, row.body, row.status, row.published_at, row.updated_at, id)
      .run();
    return rowToPost(row);
  }

  const local = readLocal();
  const idx = local.posts.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("Post not found.");
  local.posts[idx] = row;
  writeLocal(local);
  return rowToPost(row);
}

export async function deletePost(id: string): Promise<void> {
  const d1 = await getD1();
  if (d1) {
    await d1.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    return;
  }
  const local = readLocal();
  local.posts = local.posts.filter((p) => p.id !== id);
  writeLocal(local);
}

export async function getSetting(key: string): Promise<string | null> {
  const d1 = await getD1();
  if (d1) {
    const row = await d1.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first<{ value: string }>();
    return row?.value ?? null;
  }
  return readLocal().settings[key] ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const ts = nowIso();
  const d1 = await getD1();
  if (d1) {
    await d1
      .prepare(
        `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`,
      )
      .bind(key, value, ts)
      .run();
    return;
  }
  const local = readLocal();
  local.settings[key] = value;
  writeLocal(local);
}

export async function getCmsSocials(): Promise<SocialLink[]> {
  const raw = await getSetting("social_links");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SocialLink[];
    return parsed.filter((s) => s.label?.trim() && s.href?.startsWith("https://"));
  } catch {
    return [];
  }
}

export async function setCmsSocials(links: SocialLink[]): Promise<void> {
  const clean = links
    .map((s) => ({ label: s.label.trim(), href: s.href.trim() }))
    .filter((s) => s.label && s.href.startsWith("https://"));
  await setSetting("social_links", JSON.stringify(clean));
}

const LINKEDIN_KEY = "linkedin_posts";
const SEO_KEY = "seo";

function seedLinkedInDrafts(): LinkedInDraft[] {
  const ts = nowIso();
  return LINKEDIN_KICKOFFS.map((k) => ({
    id: k.id,
    title: k.title,
    body: k.body,
    createdAt: ts,
    updatedAt: ts,
  }));
}

async function readLinkedInDrafts(): Promise<LinkedInDraft[]> {
  const raw = await getSetting(LINKEDIN_KEY);
  if (!raw) {
    const seeded = seedLinkedInDrafts();
    await setSetting(LINKEDIN_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw) as LinkedInDraft[];
    if (!Array.isArray(parsed)) return seedLinkedInDrafts();
    return parsed.filter((p) => p?.id && typeof p.body === "string");
  } catch {
    return seedLinkedInDrafts();
  }
}

async function writeLinkedInDrafts(drafts: LinkedInDraft[]): Promise<void> {
  await setSetting(LINKEDIN_KEY, JSON.stringify(drafts));
}

export async function listLinkedInDrafts(): Promise<LinkedInDraft[]> {
  const drafts = await readLinkedInDrafts();
  return [...drafts].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function createLinkedInDraft(input: { title: string; body: string }): Promise<LinkedInDraft> {
  const title = input.title.trim() || "Untitled LinkedIn post";
  const body = input.body.trim();
  if (body.length < 20) throw new Error("Post body needs at least 20 characters.");
  const ts = nowIso();
  const draft: LinkedInDraft = { id: newId(), title, body, createdAt: ts, updatedAt: ts };
  const drafts = await readLinkedInDrafts();
  drafts.unshift(draft);
  await writeLinkedInDrafts(drafts);
  return draft;
}

export async function updateLinkedInDraft(
  id: string,
  input: { title: string; body: string },
): Promise<LinkedInDraft> {
  const title = input.title.trim() || "Untitled LinkedIn post";
  const body = input.body.trim();
  if (body.length < 20) throw new Error("Post body needs at least 20 characters.");
  const drafts = await readLinkedInDrafts();
  const idx = drafts.findIndex((d) => d.id === id);
  if (idx < 0) throw new Error("LinkedIn draft not found.");
  const next: LinkedInDraft = { ...drafts[idx], title, body, updatedAt: nowIso() };
  drafts[idx] = next;
  await writeLinkedInDrafts(drafts);
  return next;
}

export async function deleteLinkedInDraft(id: string): Promise<void> {
  const drafts = await readLinkedInDrafts();
  const next = drafts.filter((d) => d.id !== id);
  if (next.length === drafts.length) throw new Error("LinkedIn draft not found.");
  await writeLinkedInDrafts(next);
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const raw = await getSetting(SEO_KEY);
  if (!raw) return { ...DEFAULT_SEO };
  try {
    const parsed = JSON.parse(raw) as Partial<SeoSettings>;
    return {
      title: (parsed.title || DEFAULT_SEO.title).trim() || DEFAULT_SEO.title,
      description: (parsed.description || DEFAULT_SEO.description).trim() || DEFAULT_SEO.description,
      tagline: (parsed.tagline || DEFAULT_SEO.tagline).trim() || DEFAULT_SEO.tagline,
    };
  } catch {
    return { ...DEFAULT_SEO };
  }
}

export async function setSeoSettings(input: SeoSettings): Promise<SeoSettings> {
  const next: SeoSettings = {
    title: input.title.trim(),
    description: input.description.trim(),
    tagline: input.tagline.trim(),
  };
  if (next.title.length < 8) throw new Error("Title is too short.");
  if (next.description.length < 40) throw new Error("Description needs at least 40 characters.");
  if (next.title.length > 70) throw new Error("Title should stay under 70 characters.");
  if (next.description.length > 320) throw new Error("Description should stay under 320 characters.");
  if (next.tagline.length > 160) throw new Error("Tagline should stay under 160 characters.");
  await setSetting(SEO_KEY, JSON.stringify(next));
  return next;
}

export function suggestSlug(title: string) {
  return slugify(title);
}

export async function cmsStorageMode(): Promise<"d1" | "local"> {
  return (await getD1()) ? "d1" : "local";
}

export async function createEnquiry(input: {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
  source?: string;
}): Promise<Enquiry> {
  const row: EnquiryRow = {
    id: newId(),
    name: input.name.trim(),
    email: input.email.trim(),
    company: (input.company || "").trim(),
    project_type: (input.projectType || "").trim(),
    message: input.message.trim(),
    source: input.source || "Contact form",
    stage: "New",
    icp_fit: "",
    notes: "",
    created_at: nowIso(),
  };

  const d1 = await getD1();
  if (d1) {
    await d1
      .prepare(
        `INSERT INTO enquiries
         (id, name, email, company, project_type, message, source, stage, icp_fit, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        row.id,
        row.name,
        row.email,
        row.company,
        row.project_type,
        row.message,
        row.source,
        row.stage,
        row.icp_fit,
        row.notes,
        row.created_at,
      )
      .run();
    return rowToEnquiry(row);
  }

  const local = readLocal();
  local.enquiries.unshift(row);
  writeLocal(local);
  return rowToEnquiry(row);
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const d1 = await getD1();
  if (d1) {
    const { results } = await d1
      .prepare("SELECT * FROM enquiries ORDER BY created_at DESC")
      .all<EnquiryRow>();
    return (results || []).map(rowToEnquiry);
  }
  return readLocal()
    .enquiries.slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(rowToEnquiry);
}

export async function updateEnquiry(
  id: string,
  patch: { stage?: EnquiryStage; icpFit?: string; notes?: string; source?: string },
): Promise<Enquiry> {
  const d1 = await getD1();
  if (d1) {
    const current = await d1.prepare("SELECT * FROM enquiries WHERE id = ?").bind(id).first<EnquiryRow>();
    if (!current) throw new Error("Enquiry not found.");
    const next: EnquiryRow = {
      ...current,
      stage: patch.stage || current.stage,
      icp_fit: patch.icpFit ?? current.icp_fit,
      notes: patch.notes ?? current.notes,
      source: patch.source ?? current.source,
    };
    await d1
      .prepare("UPDATE enquiries SET stage=?, icp_fit=?, notes=?, source=? WHERE id=?")
      .bind(next.stage, next.icp_fit, next.notes, next.source, id)
      .run();
    return rowToEnquiry(next);
  }

  const local = readLocal();
  const idx = local.enquiries.findIndex((e) => e.id === id);
  if (idx < 0) throw new Error("Enquiry not found.");
  local.enquiries[idx] = {
    ...local.enquiries[idx],
    stage: patch.stage || local.enquiries[idx].stage,
    icp_fit: patch.icpFit ?? local.enquiries[idx].icp_fit,
    notes: patch.notes ?? local.enquiries[idx].notes,
    source: patch.source ?? local.enquiries[idx].source,
  };
  writeLocal(local);
  return rowToEnquiry(local.enquiries[idx]);
}
