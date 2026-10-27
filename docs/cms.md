# Ruyalab CMS (RuyaShield)

Studio admin for **ruyalab.com** at `/ruyashield` — separate from Web Monitor’s `/ruyashield`.

## V1 tabs

| Tab | What it does |
| --- | --- |
| **Posts** | Create / edit / publish Markdown posts → public `/blog` and `/blog/[slug]` |
| **Social** | Footer social links + icons (overrides `NEXT_PUBLIC_SOCIAL_LINKS` when non-empty) |
| **Enquiries** | Contact-form tracker (stage / ICP / notes) — replaces the CSV for site leads |
| **LinkedIn pack** | 3 kickoff posts with **Copy** (LinkedIn API auto-post needs a LinkedIn app — not enabled) |
| **SEO status** | Checklist for GA4, robots, sitemaps, llms.txt (owned in code, not editable here) |
| **Media** | Upload images/PDFs → `/api/media/[id]` (local `.data/media`; production needs R2 `CMS_MEDIA`) |

Later (not built yet): case-study editor, LinkedIn OAuth auto-post.

Migrations (remote D1 `ruyalab-cms` id `79c81fb0-c122-48cb-aec5-4f96215c2372`):

```bash
npx wrangler d1 execute ruyalab-cms --remote --file=migrations/0001_cms.sql
npx wrangler d1 execute ruyalab-cms --remote --file=migrations/0002_enquiries.sql
npx wrangler d1 execute ruyalab-cms --remote --file=migrations/0003_media.sql
```

`CMS_ADMIN_PASSWORD` and `CMS_SESSION_SECRET` are already set as Worker secrets on `ruyalab`.

**Still required in Cloudflare dashboard before production CMS works:**

1. Worker `ruyalab` → Settings → Bindings → D1 → bind database `ruyalab-cms` as **`CMS_DB`** (see `wrangler.jsonc`).
2. Enable **R2**, create bucket `ruyalab-cms-media`, bind as **`CMS_MEDIA`** (for Media uploads in production).
3. Deploy/push this branch so `/ruyashield` code is live.

## Local development

1. In `.env.local`:

```bash
CMS_ADMIN_PASSWORD=your-long-dev-password
CMS_SESSION_SECRET=your-long-dev-secret-16+
```

2. `npm run dev` → open http://localhost:3000/ruyashield  
3. Content is stored in `.data/cms.json` (gitignored). No D1 required for local.

## Production (Cloudflare Workers + D1)

1. Create the database (once):

```bash
npx wrangler d1 create ruyalab-cms
```

2. Put the printed `database_id` into the Worker’s D1 binding named **`CMS_DB`** (Workers dashboard → ruyalab → Settings → Bindings, or your `wrangler.jsonc`).

3. Apply the schema:

```bash
npx wrangler d1 execute ruyalab-cms --remote --file=migrations/0001_cms.sql
```

4. Set **runtime secrets / vars** on the Worker:

- `CMS_ADMIN_PASSWORD` — long random password  
- `CMS_SESSION_SECRET` — different long random string (16+)

5. Redeploy. Sign in at `https://ruyalab.com/ruyashield`.

### Example wrangler binding snippet

```jsonc
{
  "d1_databases": [
    {
      "binding": "CMS_DB",
      "database_name": "ruyalab-cms",
      "database_id": "REPLACE_WITH_D1_DATABASE_ID"
    }
  ]
}
```

Match any other existing OpenNext bindings (`ASSETS`, `IMAGES`, `WORKER_SELF_REFERENCE`) from your current Workers Builds config — do not drop them.

## Security notes

- `/ruyashield` is `noindex` and listed in `robots.txt` as `Disallow`.
- Sessions are httpOnly cookies, 8 hours.
- One shared admin password (v1). Add TOTP / multiple admins later if needed.
- Do not link `/ruyashield` from the public site.

## Organic growth

Publish short posts, then share `/blog/...` on LinkedIn. Keep using [organic-growth.md](organic-growth.md) for the founder checklist.
