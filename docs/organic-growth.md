# Organic growth — founder ops

90-day north star: **8–12 qualified enquiries** and **3–5 discovery calls**, no paid ads.

Positioning line (use everywhere):

> Ruyalab — design, engineering and AI by the same team.

Primary wedge: AI-powered products and product engineering for founders / heads of product.

---

## Status (code vs you)

| Item | Status |
| --- | --- |
| ruyalab.com wedge copy + pipeline events + static sitemap | Done (live) |
| Sitemap `noindex` removed; live test available to Google | Done — wait for Sitemaps **Success** |
| Enquiry tracker template | [enquiry-tracker.csv](enquiry-tracker.csv) |
| Talkel “Built by Ruyalab” | In git `main` — confirm live after deploy |
| Web Monitor “Built by Ruyalab” link | In git `layoutchage` — live still shows old “by Ruyalab” text; needs that branch deployed |
| Social `NEXT_PUBLIC_SOCIAL_LINKS` | Later (your call) |
| LinkedIn 3 kickoff posts | You |
| GSC: request indexing on homepage; wait on sitemap row | You |
| GA4: mark `contact_submit` key event | You (after one form submit) |

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

### 1. Google Search Console + Cloudflare (today)

The sitemap file itself is valid (HTTP 200, real XML). If GSC still says **Couldn't fetch**, Google’s crawler is being blocked before it gets the file — almost always **Cloudflare Bot Fight Mode** on this host (same class of issue that once broke PageSpeed).

**In Cloudflare (ruyalab.com zone):**

1. **Bot Fight Mode** — leave **Off** (you already did).
2. **Configure AI bot policies** (Security → Settings → Bot traffic) — this is a separate control. If it is set to **Block AI bots** / block crawlers, it has returned **403 to Googlebot** for other sites even while Bot Fight Mode was off. Set it to **Allow** / do not block verified search crawlers.
3. Optional WAF rule: **Skip** remaining checks when `URI Path` is `/sitemap.xml` or `/robots.txt`, or `Verified Bot` eq Google.
4. **Security → Events**: filter `sitemap.xml`. You should eventually see Google IPs (`66.249.x.x`), not only your home ISP.

**In Search Console (required debug step):**

1. URL Inspection → paste `https://ruyalab.com/sitemap.xml` → **Test live URL**.
2. You want **Page fetch = Successful** and **Crawl allowed? = Yes**.
3. If live test fails, the details page is the real reason (not the Sitemaps table).
4. Also check **Manual actions** — sitemaps are ignored while one is open.
5. Then Resubmit the sitemap and wait 1–3 days for **Last read** to fill in.

**Then in Search Console:**

1. Sitemaps → open `https://ruyalab.com/sitemap.xml` → **Resubmit** (or remove and submit again).
2. Wait until **Last read** fills in and status is **Success**.
3. Reply here with Success, or a Cloudflare Events screenshot if it still fails.

The site now also ships a **static** `public/sitemap.xml` (built at deploy) so the file is not only a Worker-rendered route.

### 2. Social profiles (this week)

Send me the real `https://` URLs you will post from, for example:

- LinkedIn company page
- Your personal LinkedIn (for founder posts — not stored on the site unless you want it)
- GitHub org or X, if you will keep them alive

I will put them in Cloudflare Workers build env as:

`NEXT_PUBLIC_SOCIAL_LINKS=LinkedIn|https://...,GitHub|https://...`

Only list profiles you will actually use.

### 3. Product sites — “Built by Ruyalab”

On **Talkel** and **Web Monitor**, add a plain footer/about link:

`Built by [Ruyalab](https://ruyalab.com/)`

Those repos are not in this codebase. Either:

- point me at the Talkel / Web Monitor repo paths or remotes, or
- add the link yourself and confirm.

### 4. LinkedIn kickoff (this week)

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
