-- Media library metadata (files live in R2 or local .data/media).
--   npx wrangler d1 execute ruyalab-cms --remote --file=migrations/0003_media.sql

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  alt TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_created ON media (created_at DESC);
