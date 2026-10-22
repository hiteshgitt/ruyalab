# Ruyalab

Website for Ruyalab, an independent creative technology studio. It is a single homepage with concept case-study pages, a morphing multi-device hero, scroll choreography built with GSAP, and a contact form.

**Stack:** Next.js 16.4 (App Router, fully static generation, Turbopack), React 19.3, strict TypeScript, CSS Modules with design tokens, GSAP 3.15 (ScrollTrigger, SplitText, Draggable), and simple-icons.

**Design:** the direction comes from two references: a Dribbble shot and a "floating cards" layout. Display type is Anton, ultra-condensed and uppercase. Body text is Inter, and labels use Geist Mono in the form `( WORK )`. Large sunflower-yellow panels carry most sections. The brand's "vision eye" mascot plays the role of the reference's character. The site has **light and dark themes**. It follows the OS setting until the visitor uses the header toggle; that choice is saved, and an inline script applies it before first paint so the wrong theme never flashes.

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
npm run lint && npx tsc --noEmit && npm run build
```

## Configuration

Values that must be real (the domain, email address and social profiles) come from environment variables. When a value is unset, the UI leaves it out rather than showing a placeholder. See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OG, sitemap and robots. **Set this before deploying.** On Vercel it falls back to `VERCEL_PROJECT_PRODUCTION_URL`. Otherwise it falls back to `localhost:3000`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shows a direct email link in the contact section and footer. |
| `NEXT_PUBLIC_SOCIAL_LINKS` | `Label\|https://url` pairs, comma-separated. |
| `CONTACT_WEBHOOK_URL` | **Required for the contact form to deliver messages in production** (see below). |

### Making the contact form operational

The form posts to a Server Action (`src/components/contact/actions.ts`). The action validates on the server using the same rules as the client (`schema.ts`), has a honeypot field, and works without JavaScript.

Messages are delivered by POSTing JSON to `CONTACT_WEBHOOK_URL`:

```json
{ "name": "...", "email": "...", "company": "...", "projectType": "...", "message": "...", "text": "<plain-text summary>", "submittedAt": "ISO-8601" }
```

The `text` field means Slack or Discord incoming webhooks work as-is. Zapier, Make and n8n can forward the payload to email or a CRM. If you'd rather send email directly, replace the `fetch` in `actions.ts` with your provider's SDK.

- **No webhook in development:** submissions are logged to the server console and the form shows success.
- **No webhook in production:** the form shows an honest "not accepting messages" error and keeps the visitor's input. It never pretends a message was sent.

There is no rate limiting beyond the honeypot. If spam becomes a problem, add a firewall or rate-limit rule at the edge, or a bot check.

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

- **Projects** (`src/data/projects.ts`): the four entries are **self-initiated concept studies**, and every place they appear labels them that way. Replace them with real work using the same shape. Real work can include an optional `cover` image (rendered with `next/image`), a `caseStudy` (which generates `/work/[slug]`) and a `liveUrl`.
- **Capabilities, process and stack**: see `src/data/services.ts`.

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
