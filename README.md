# Ruyalab

Website for Ruyalab, an independent creative technology studio. It is a single homepage with product and client case-study pages, a morphing multi-device hero, scroll choreography built with GSAP, and a contact form.

**Stack:** Next.js 16.4 (App Router, fully static generation, Turbopack), React 19.3, strict TypeScript, CSS Modules with design tokens, GSAP 3.15 (ScrollTrigger, SplitText, Draggable), and simple-icons.

**Design:** the direction comes from two references: a Dribbble shot and a "floating cards" layout. Display type is Anton, ultra-condensed and uppercase. Body text is Inter, and labels use Geist Mono in the form `( WORK )`. Large sunflower-yellow panels carry most sections. The brand's "vision eye" mascot plays the role of the reference's character. The site has **light and dark themes**. It follows the OS setting until the visitor uses the header toggle; that choice is saved, and an inline script applies it before first paint so the wrong theme never flashes.

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
npm run lint && npx tsc --noEmit && npm run build
```

## Organic growth

Founder checklist, LinkedIn kickoff posts, and pipeline tracking: [docs/organic-growth.md](docs/organic-growth.md).

## Studio CMS (RuyaShield)

Admin at `/ruyashield` — blog posts and footer social links. Local uses `.data/cms.json`; production needs Cloudflare D1 (`CMS_DB`) plus `CMS_ADMIN_USERNAME` / `CMS_ADMIN_PASSWORD` / `CMS_TOTP_SECRET` / `CMS_SESSION_SECRET`. Setup: [docs/cms.md](docs/cms.md).

## Configuration

Values that must be real (the domain, email address and social profiles) come from environment variables. When a value is unset, the UI leaves it out rather than showing a placeholder. See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OG, sitemap and robots. **Set this before deploying.** On Vercel it falls back to `VERCEL_PROJECT_PRODUCTION_URL`. Otherwise it falls back to `localhost:3000`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shows a direct email link in the contact section and footer. |
| `NEXT_PUBLIC_SOCIAL_LINKS` | `Label\|https://url` pairs, comma-separated. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | **Enable contact-form email in production** (see below). |
| `CONTACT_WEBHOOK_URL` | Optional: also POST submissions to a webhook. |

### Making the contact form operational

The form posts to a Server Action (`src/components/contact/actions.ts`). The action validates on the server using the same rules as the client (`schema.ts`), has a honeypot field, and works without JavaScript.

**Email (recommended):** set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`. Email goes out through [Resend](https://resend.com)'s HTTPS API (`email.ts`), so no SMTP is needed; that matters on Cloudflare Workers, where SMTP isn't practical. Each enquiry sends two emails:

1. **To the studio inbox** with every field, `Reply-To` set to the visitor, so pressing Reply answers them.
2. **To the visitor** as a short receipt, `Reply-To` set to the studio inbox. The receipt deliberately leaves out the visitor's message and any links, so nobody can use the form to send arbitrary content to strangers from your domain.

If the first email fails, the visitor sees an error and their input is kept. The receipt is best-effort: a typo'd visitor address doesn't turn a delivered enquiry into an error.

Setup:
1. Create a Resend account, **add the domain `ruyalab.com`**, and add the DNS records it lists (in Cloudflare → DNS, all *DNS only*). They live on `send.ruyalab.com` and `resend._domainkey`, so they don't conflict with Hostinger's mail records. Wait until Resend shows the domain as **Verified**.
2. Create an API key with **Sending access** only.
3. In Cloudflare → Workers → ruyalab → **Settings → Variables and Secrets** (the runtime ones):
   - `RESEND_API_KEY`: type **Secret**
   - `CONTACT_TO_EMAIL` = `contact@ruyalab.com`
   - `CONTACT_FROM_EMAIL` = `Ruyalab <contact@ruyalab.com>`

**Webhook (optional, in addition):** `CONTACT_WEBHOOK_URL` POSTs each submission as JSON. The `text` field means Slack or Discord webhooks work as-is.

With neither configured, production shows an honest "not accepting messages" error and development logs submissions to the console.

Spam protection is the honeypot only. If spam shows up, add Cloudflare Turnstile to the form.

## Structure

```
src/
  app/                 layout (fonts, metadata), page, work/[slug], sitemap, robots, OG image, icon, 404
  components/
    layout/            Header (client: scroll state, active section, accessible mobile menu), Footer
    sections/          Hero, Work, Capabilities, Studio, Process, Technology, Contact (Server Components)
    motion/            RevealScope (declarative scroll motion), HeroIntro (scroll hand-off)
    work/              ProjectCard, ProjectCover (procedural SVG artwork)
    contact/           ContactForm (client), actions.ts (server), schema.ts (shared validation)
    ui/                Button, SectionHeading, Logo
  data/                projects.ts, services.ts — typed content, ready to swap for a CMS
  lib/                 site.ts (config), gsap.ts (plugin registration + motion tokens)
```

Design tokens (color, fluid type scale, spacing, easing and durations) live at the top of `src/app/globals.css`.

### Content

- **Projects** (`src/data/projects.ts`): Talkel and Web Monitor are **live Ruyalab products** (with `liveUrl`); the others are **client work**, described without the client's name, logo or live link. Replace them with real work using the same shape. Real work can include an optional `cover` image (rendered with `next/image`), a `caseStudy` (which generates `/work/[slug]`) and a `liveUrl`.
- **Capabilities, process and stack**: see `src/data/services.ts`.

## SEO and crawlability

Everything is generated from the same data the pages render (`src/data/*`, `src/lib/site.ts`), so none of it can drift out of date.

| URL | What it is |
| --- | --- |
| `/sitemap.xml` | Every indexable page, with `lastmod` |
| `/robots.txt` | Allows all crawlers; points to the sitemap |
| `/llms.txt` | [llms.txt](https://llmstxt.org) site map for AI assistants (ChatGPT, Claude, Perplexity) |
| `/llms-full.txt` | All case studies, playbooks and capabilities as plain Markdown |
| `/manifest.webmanifest` | Web app manifest (name, colours, icons) |
| `/logo.png` | 512×512 raster logo, referenced by structured data |
| `/opengraph-image` | 1200×630 social preview |

- **Structured data** (`src/lib/seo.tsx`):
  - Every page carries `Organization` (name, logo, contact email, the areas the studio works in) and `WebSite`.
  - Case-study pages add `CreativeWork` and `BreadcrumbList`.
  - Only facts that are visible on the site are marked up.
- **Meta tags:**
  - Canonical URLs on every page.
  - `googlebot` allows large image previews and full-length snippets.
  - Open Graph and Twitter cards.
  - Unknown URLs return a real 404.
- **One canonical host.** `www` 301-redirects to the root domain, `http` redirects to `https`, and `NEXT_PUBLIC_SITE_URL` must be `https://ruyalab.com`.

## Brand assets

- **Mascots** live in `public/mascots/*.svg`. They are copied from the brand kit with the background removed so they work on both themes. The poses are hero, explore, discover, code, build, launch and grow. `<Mascot pose="…" />` renders them, and every pose has descriptive alt text.
- **Live mascot** (`components/mascot/LiveMascot.tsx`): the hero character is drawn inline. Its iris follows the pointer, it blinks and bobs, and the star spins when you click it. It only animates while it is on screen.
- **Workflows** live in `public/workflows/*.svg` and are shown as accessible tabs in the Studio section. I fixed unescaped `&` characters that made one file invalid XML, and removed the kit's editing notes from the artwork.
- **Icons:** the five capability icons are custom and animate on hover. Technology logos come from simple-icons (CC0) and switch to the brand colour on hover. The logo is a mini version of the mascot's eye.

## Motion and interaction

- **Hero.** The entrance is pure CSS, so it starts at first paint; the hero paragraph is the LCP element and stays static. The large wordmark letters lift on hover. A single centred device (`DeviceMorph`) morphs mobile → tablet → desktop, showing the same product on each screen. It auto-cycles only while on screen, stops on hover or when the visitor picks a device from the `( MOBILE ) ( TABLET ) ( DESKTOP )` switcher, and never runs under reduced motion. The frames sit in a fixed-height stage, so nothing below the device shifts when it changes. The stickers can be dragged on mouse and trackpad and only float on touch. Each sticker uses three wrapper layers (drag, pop-in, float) so GSAP and CSS never fight over the same `transform`.
- **Scroll reveals.** `RevealScope` reads data attributes on the page markup: `data-split`, `data-reveal` / `data-reveal-group`, `data-parallax`, `data-scrub-words` and `data-draw`. Hover lifts on revealed elements use the separate `translate` property for the same reason as the stickers.
- **Cards.** Capability cards tilt toward the pointer and turn yellow on hover. Process steps open as an accordion on hover or keyboard focus.
- **Reduced motion.** Everything is turned off under `prefers-reduced-motion`. All content is visible without JavaScript.

## Studio mascot

The Studio section's centrepiece is the live mascot (the same component as the hero phone). It sits inside slowly counter-rotating orbit rings and a soft glow, and its eye follows the visitor's pointer. It replaces the earlier Three.js sculpture, so there is no WebGL or Three.js on the site any more. It is a small inline SVG and only animates while on screen.

## Verification (production build, headless Chrome)

- `tsc`, `eslint` and `next build` all pass with no errors.
- Tested in both themes at 360, 390, 768, 1024, 1440 and 1920 px: no console errors, no failed requests and no horizontal overflow.
- **Theme:** follows the OS by default, toggles with mouse or keyboard, persists across reloads, and is already set when the HTML is parsed, so there is no flash.
- **Interaction:** stickers drag, and the mascot's iris follows the pointer. The mobile menu traps focus and closes with Esc. The contact form validates, delivered a real submission to a local webhook in testing, and shows success and reset states.
- **Lighthouse** (local run, simulated throttling):

  | | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
  | --- | --- | --- | --- | --- | --- | --- | --- |
  | Desktop (light / dark) | 99–100 | 100 | 100 | 100 | 0.7 s | 10–90 ms | 0 |
  | Mobile (light / dark) | 90–93 | 100 | 100 | 100 | 3.0–3.3 s | 160–240 ms | 0 |

  Mobile LCP is Lighthouse's simulated slow-4G estimate. In the recorded trace, the LCP element paints at about 200 ms.

## Known limitations

- The OG image fetches Anton from Google Fonts at build time (cached). If that fails, it falls back to a generic sans-serif.
- There is no JSON-LD structured data. Add an `Organization` schema once real business details (legal name, address, profiles) are confirmed.

## Deployment

Every page is prerendered at build time (SSG), so the site runs on any Next.js host.

**Cloudflare Workers (current setup).** The repo is connected to Workers Builds. Every push to `main` builds the site with the OpenNext adapter and deploys it to `ruyalab.talkel.workers.dev`.

- **Cache Components is turned off on purpose.** Next.js warns that its Cache Components mode can't run reliably on the Workers runtime because of how Workers implements `setTimeout()`. With it enabled, every page hung and Cloudflare returned error 1101. Because the site is fully static, it doesn't need Cache Components.
- **Check before pushing.** To test the Worker locally (requires Node 22 or later), run `npx opennextjs-cloudflare build && npx wrangler dev` with a `wrangler.jsonc` that matches the dashboard bindings (`ASSETS`, `IMAGES`, `WORKER_SELF_REFERENCE`).
- **Environment variables** go in Cloudflare → Workers → ruyalab → Settings:
  - `NEXT_PUBLIC_*` values are inlined at build time, so add them as **build** variables, then redeploy.
  - `CONTACT_WEBHOOK_URL` is read when the form is submitted, so it is a **runtime** variable. Store it as a secret.

**Vercel or Node.** These also work with no extra configuration (`npm run build && npm start` for Node).
