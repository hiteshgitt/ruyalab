# Organic growth — founder ops

90-day north star: **8–12 qualified enquiries** and **3–5 discovery calls**, no paid ads.

Positioning line (use everywhere):

> Ruyalab — design, engineering and AI by the same team.

Primary wedge: AI-powered products and product engineering for founders / heads of product.

---

## Status (code vs you)

| Phase | Item | Status |
| --- | --- | --- |
| 1 · Site | Wedge copy, meta, OG, `llms.txt` | Done (live) |
| 1 · Site | GA4 pipeline: `contact_submit`, `case_study_view`, `product_outbound` | Done (live in `/boot/enhance.js`) |
| 1 · Site | Static `sitemap.xml` + `robots.txt`; no `noindex` on sitemap | Done (live 200 / XML) |
| 2 · Products | Talkel footer → https://ruyalab.com/ | Done (live on talkel.ruyalab.com + /download) |
| 2 · Products | Web Monitor footer → https://ruyalab.com/ | Done (live on webmonitor.ruyalab.com) |
| 3 · Ops kit | Enquiry tracker CSV template | Done — [enquiry-tracker.csv](enquiry-tracker.csv) |
| 3 · Ops kit | This checklist + LinkedIn copy pack | Done (below) |
| 4 · You | GSC: homepage **Request indexing**; wait until Sitemaps = **Success** | Indexing requested — wait for Success |
| 4 · You | Browser-submit contact once → GA4 mark `contact_submit` key event | API test done; **browser submit + Mark key event** still you |
| 4 · You | LinkedIn: 3 kickoffs via CMS **LinkedIn pack → Copy** | Waiting on you (no autopost) |
| 4 · You | Enquiry tracker | **CMS Enquiries** (CSV optional backup) |
| 5 · CMS | D1 `ruyalab-cms` + migrations + CMS secrets | Done in Cloudflare |
| 5 · You | Bind `CMS_DB` on Worker + enable R2 `CMS_MEDIA` + deploy code | Remaining |
| 5 · You | Social URLs in CMS Social tab | Waiting on you (need real profile links) |

## Done on the website (this repo)

- Homepage, studio, contact, footer, meta description, and OG card copy sharpened to the wedge.
- GA4 events (fire after the deferred analytics boot):
  - `contact_submit` — successful contact form
  - `case_study_view` — visit to `/work/[slug]`
  - `product_outbound` — click “Visit site” on a live product case study
- Sitemap remains at `https://ruyalab.com/sitemap.xml`.

**GA4 — where Events moved (new Admin UI):**

There is no longer a top-level **Admin → Events**. Use either:

1. Left sidebar under the property: open **Data display** → **Events**, or
2. Top search bar: type `Events` and open it, or
3. Reports → Engagement → Events (to see counts; marking key events is still under Admin → Data display).

`contact_submit` only appears after it has fired at least once (submit the contact form on the live site, wait a few minutes / up to 24h). Then open the event → **Mark as key event**.

---

## You need to do these (I cannot)

Code + product-footer phases are finished. Everything below needs your Google / LinkedIn / spreadsheet access.

### 1. Google Search Console (today / this week)

Cloudflare **Bot Fight Mode** is already **Off**. Sitemap live-fetches as valid XML (HTTP 200, no `noindex`).

**Do this in Search Console:**

1. URL Inspection → `https://ruyalab.com/` → **Request indexing** (homepage).
2. Sitemaps → `https://ruyalab.com/sitemap.xml` — leave it; wait until **Last read** fills and status is **Success** (often 1–2 days after a good live test). Resubmit only if it is still **Couldn't fetch** after that.
3. Optional: URL Inspection → sitemap URL → **Test live URL** again if the table is stuck.
4. Reply here when Sitemaps shows **Success**, or with a screenshot if it fails.

If crawl fails again: Cloudflare → Security → Bot traffic / AI Crawl Control — do not block verified Googlebot. Security → Events filter `sitemap.xml` for `66.249.x.x`.

### 2. GA4 key event (after one real submit)

1. On the live site, submit the contact form once (a real or test enquiry).
2. Wait until `contact_submit` appears under **Data display → Events** (minutes to ~24h).
3. Open the event → **Mark as key event**.

### 3. Enquiry spreadsheet (today)

Import [enquiry-tracker.csv](enquiry-tracker.csv) into Sheets/Excel. Log every enquiry with Stage + Source.

### 4. Social profiles (when ready — not blocking kickoff)

Send real `https://` URLs you will actually post from (LinkedIn company, GitHub, X). I will set:

`NEXT_PUBLIC_SOCIAL_LINKS=LinkedIn|https://...,GitHub|https://...`

Skip any profile you will not keep alive.

### 5. LinkedIn kickoff (this week)

Post from **your personal profile** first (reach). Reshare from the company page.

**Post 1 — positioning**

> Most digital products fail in the handoff — design finishes a deck, engineering rebuilds it, AI is bolted on later.
>
> Ruyalab is an independent creative technology studio. Design, engineering and AI are the same team. We ship products and high-craft sites without that gap.
>
> Live proof: Talkel and Web Monitor — products we built and run ourselves.
>
> If you’re a founder or product lead who needs one team to ship, start here → https://ruyalab.com/

**Post 2 — Talkel (2–3 days later)**

> Plenty of people read English well and freeze when they have to speak it under pressure — interviews, salary talks, tough client calls.
>
> We built Talkel: a real-time AI call partner that rehearses the moment, then shows exactly what to fix.
>
> Case study → https://ruyalab.com/work/talkel
> Try it → https://talkel.ruyalab.com/

**Post 3 — Web Monitor (2–3 days after that)**

> Too many teams find out a site is slow or down from a customer.
>
> Web Monitor checks WordPress, Laravel, Next.js and PHP sites every minute — real health, not a dumb ping — with alerts on the web and your phone.
>
> Case study → https://ruyalab.com/work/web-monitor
> Product → https://webmonitor.ruyalab.com/

Cadence after that: **3 founder posts / week**, one company reshare. One link per post.

### 5. Enquiry tracker (spreadsheet)

Create a sheet with columns:

| Date | Name | Email | Source | ICP fit (Y/N) | Stage | Notes |
| --- | --- | --- | --- | --- | --- | --- |

Stages: `New` → `Replied` → `Call booked` → `Proposal` → `Won` / `Lost`.

Source examples: `LinkedIn`, `Organic`, `Talkel`, `Web Monitor`, `Referral`, `Direct`.

---

## Weekly 30-minute scoreboard

1. Search Console: sitemap status, indexed pages, top queries.
2. GA4: `contact_submit`, `case_study_view`, sessions from LinkedIn.
3. Spreadsheet: new enquiries and calls booked.
4. Kill anything that produced neither impressions nor conversations by day 60.

---

## Out of scope for 90 days

Paid ads, fake reviews, keyword farm pages, bought backlinks.
