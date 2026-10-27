import { join } from "node:path";
import type { MediaAsset } from "./types";

type D1Prepared = {
  bind: (...values: unknown[]) => D1Prepared;
  first: <T>() => Promise<T | null>;
  all: <T>() => Promise<{ results: T[] }>;
  run: () => Promise<unknown>;
};

type D1Database = {
  prepare: (query: string) => D1Prepared;
};

type R2Object = { arrayBuffer: () => Promise<ArrayBuffer> };
type R2Bucket = {
  put: (key: string, value: ArrayBuffer | Uint8Array, options?: { httpMetadata?: { contentType?: string } }) => Promise<unknown>;
  get: (key: string) => Promise<R2Object | null>;
  delete: (key: string) => Promise<unknown>;
};

type MediaRow = {
  id: string;
  filename: string;
  mime: string;
  size: number;
  alt: string;
  created_at: string;
};

type LocalMediaDb = { media: MediaRow[] };

const META_PATH = join(process.cwd(), ".data", "media.json");
const FILES_DIR = join(process.cwd(), ".data", "media");

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  return crypto.randomUUID();
}

function rowToAsset(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    filename: row.filename,
    mime: row.mime,
    size: row.size,
    alt: row.alt,
    createdAt: row.created_at,
    url: `/api/media/${row.id}`,
  };
}

async function getBindings(): Promise<{ db: D1Database | null; r2: R2Bucket | null }> {
  try {
    const mod = await import(/* webpackIgnore: true */ "@opennextjs/cloudflare");
    const ctx = await mod.getCloudflareContext({ async: true });
    const env = ctx?.env as { CMS_DB?: D1Database; CMS_MEDIA?: R2Bucket } | undefined;
    return { db: env?.CMS_DB ?? null, r2: env?.CMS_MEDIA ?? null };
  } catch {
    return { db: null, r2: null };
  }
}

function readLocalMeta(): LocalMediaDb {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  if (!fs.existsSync(META_PATH)) return { media: [] };
  try {
    return JSON.parse(fs.readFileSync(META_PATH, "utf8")) as LocalMediaDb;
  } catch {
    return { media: [] };
  }
}

function writeLocalMeta(db: LocalMediaDb) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  fs.mkdirSync(FILES_DIR, { recursive: true });
  fs.writeFileSync(META_PATH, JSON.stringify(db, null, 2));
}

function writeLocalFile(id: string, bytes: Uint8Array) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  fs.mkdirSync(FILES_DIR, { recursive: true });
  fs.writeFileSync(join(FILES_DIR, id), bytes);
}

function readLocalFile(id: string): Uint8Array | null {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  const path = join(FILES_DIR, id);
  if (!fs.existsSync(path)) return null;
  return new Uint8Array(fs.readFileSync(path));
}

function deleteLocalFile(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs") as typeof import("node:fs");
  const path = join(FILES_DIR, id);
  if (fs.existsSync(path)) fs.unlinkSync(path);
}

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_BYTES = 5 * 1024 * 1024;

export async function listMedia(): Promise<MediaAsset[]> {
  const { db } = await getBindings();
  if (db) {
    const { results } = await db.prepare("SELECT * FROM media ORDER BY created_at DESC").all<MediaRow>();
    return (results || []).map(rowToAsset);
  }
  return readLocalMeta()
    .media.slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(rowToAsset);
}

export async function getMedia(id: string): Promise<MediaAsset | null> {
  const { db } = await getBindings();
  if (db) {
    const row = await db.prepare("SELECT * FROM media WHERE id = ?").bind(id).first<MediaRow>();
    return row ? rowToAsset(row) : null;
  }
  const row = readLocalMeta().media.find((m) => m.id === id);
  return row ? rowToAsset(row) : null;
}

export async function readMediaBytes(id: string): Promise<{ bytes: Uint8Array; mime: string; filename: string } | null> {
  const asset = await getMedia(id);
  if (!asset) return null;
  const { r2 } = await getBindings();
  if (r2) {
    const obj = await r2.get(id);
    if (!obj) return null;
    return { bytes: new Uint8Array(await obj.arrayBuffer()), mime: asset.mime, filename: asset.filename };
  }
  const bytes = readLocalFile(id);
  if (!bytes) return null;
  return { bytes, mime: asset.mime, filename: asset.filename };
}

export async function uploadMedia(input: {
  filename: string;
  mime: string;
  bytes: Uint8Array;
  alt?: string;
}): Promise<MediaAsset> {
  if (!ALLOWED.has(input.mime)) {
    throw new Error("Only images (JPEG/PNG/WebP/GIF/SVG) and PDF are allowed.");
  }
  if (input.bytes.byteLength > MAX_BYTES) {
    throw new Error("File is too large (5 MB max).");
  }

  const { db, r2 } = await getBindings();
  if (db && !r2) {
    // D1 is bound (production) but R2 is not enabled yet.
    throw new Error(
      "Media uploads on production need Cloudflare R2. Enable R2 in the dashboard, create bucket ruyalab-cms-media, bind it as CMS_MEDIA, then retry.",
    );
  }

  const id = newId();
  const row: MediaRow = {
    id,
    filename: input.filename.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 180),
    mime: input.mime,
    size: input.bytes.byteLength,
    alt: (input.alt || "").trim().slice(0, 200),
    created_at: nowIso(),
  };

  if (db && r2) {
    await r2.put(id, input.bytes, { httpMetadata: { contentType: input.mime } });
    await db
      .prepare(
        `INSERT INTO media (id, filename, mime, size, alt, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(row.id, row.filename, row.mime, row.size, row.alt, row.created_at)
      .run();
    return rowToAsset(row);
  }

  // Local next dev
  writeLocalFile(id, input.bytes);
  const local = readLocalMeta();
  local.media.unshift(row);
  writeLocalMeta(local);
  return rowToAsset(row);
}

export async function deleteMedia(id: string): Promise<void> {
  const { db, r2 } = await getBindings();
  if (db) {
    await db.prepare("DELETE FROM media WHERE id = ?").bind(id).run();
    if (r2) await r2.delete(id);
    return;
  }
  const local = readLocalMeta();
  local.media = local.media.filter((m) => m.id !== id);
  writeLocalMeta(local);
  deleteLocalFile(id);
}

export async function updateMediaAlt(id: string, alt: string): Promise<MediaAsset> {
  const clean = alt.trim().slice(0, 200);
  const { db } = await getBindings();
  if (db) {
    await db.prepare("UPDATE media SET alt = ? WHERE id = ?").bind(clean, id).run();
    const row = await db.prepare("SELECT * FROM media WHERE id = ?").bind(id).first<MediaRow>();
    if (!row) throw new Error("Media not found.");
    return rowToAsset(row);
  }
  const local = readLocalMeta();
  const idx = local.media.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Media not found.");
  local.media[idx] = { ...local.media[idx], alt: clean };
  writeLocalMeta(local);
  return rowToAsset(local.media[idx]);
}
