-- Contact-form enquiries for the studio CMS tracker.
--   npx wrangler d1 execute ruyalab-cms --remote --file=migrations/0002_enquiries.sql

CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  project_type TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Contact form',
  stage TEXT NOT NULL DEFAULT 'New',
  icp_fit TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at DESC);
