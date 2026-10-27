# Organic growth — founder ops

90-day north star: **8–12 qualified enquiries** and **3–5 discovery calls**, no paid ads.

Positioning line (use everywhere):

> Ruyalab — design, engineering and AI by the same team.

Primary wedge: AI-powered products and product engineering for founders / heads of product.

---

## Done on the website (this repo)

- Homepage, studio, contact, footer, meta description, and OG card copy sharpened to the wedge.
- GA4 events (fire after the deferred analytics boot):
  - `contact_submit` — successful contact form
  - `case_study_view` — visit to `/work/[slug]`
  - `product_outbound` — click “Visit site” on a live product case study
- Sitemap remains at `https://ruyalab.com/sitemap.xml`.

In GA4 Admin → Events, mark `contact_submit` as a **key event**.

---

## You need to do these (I cannot)

### 1. Google Search Console (today)

1. Open the property for `ruyalab.com` or `https://ruyalab.com`.
2. **Sitemaps** → submit `https://ruyalab.com/sitemap.xml`.
3. Wait until status is **Success** (not only “Indexing requested” on URL Inspection).
4. Reply here when sitemap shows Success, or paste a screenshot if it fails.

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
