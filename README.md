# Ruyalab

Website for Ruyalab, an independent creative technology studio. It is a single homepage with concept case-study pages, a WebGL hero, scroll choreography built with GSAP, and a contact form.

**Stack:** Next.js 16.4 (App Router, Cache Components, Turbopack), React 19.3, strict TypeScript, CSS Modules with design tokens, GSAP 3.15 (ScrollTrigger, SplitText, Draggable), Three.js 0.186 and simple-icons.

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
    three/             iris.ts (vanilla Three.js scene), HeroVisual (loader/lifecycle), IrisFallback (SVG)
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

- **Hero.** The entrance is pure CSS, so it starts at first paint; the hero paragraph is the LCP element and stays static. The large wordmark letters lift on hover. The stickers can be dragged on mouse and trackpad, and only float on touch so they never get in the way of scrolling. Each sticker uses three wrapper layers (drag, pop-in, float) so GSAP and CSS never fight over the same `transform`.
- **Scroll reveals.** `RevealScope` reads data attributes on the page markup: `data-split`, `data-reveal` / `data-reveal-group`, `data-parallax`, `data-scrub-words` and `data-draw`. Hover lifts on revealed elements use the separate `translate` property for the same reason as the stickers.
- **Cards.** Capability cards tilt toward the pointer and turn yellow on hover. Process steps open as an accordion on hover or keyboard focus.
- **Reduced motion.** Everything is turned off under `prefers-reduced-motion`. All content is visible without JavaScript.

## The 3D iris (Studio section)

The iris is a WebGL sculpture recoloured to the mascot palette: a navy core with cyan contour lines and violet and cyan rings. It opens as you scroll through the section.

- **Lazy.** Three.js is only fetched when the Studio section comes within 400px of the viewport, so it costs nothing on first load.
- **Efficient.** Rendering pauses when the section is off screen or the tab is hidden. Pixel ratio is capped, and phones get a lighter quality setting.
- **Fallback.** A matching SVG replaces it under reduced motion, Save-Data, missing WebGL, an initialisation error or a lost WebGL context.

## Verification (production build, headless Chrome)

- `tsc`, `eslint` and `next build` all pass with no errors.
- Tested in both themes at 360, 390, 768, 1024, 1440 and 1920 px: no console errors, no failed requests and no horizontal overflow. WebGL starts when you scroll to Studio and falls back to the static SVG under reduced motion.
- **Theme:** follows the OS by default, toggles with mouse or keyboard, persists across reloads, and is already set when the HTML is parsed, so there is no flash.
- **Interaction:** stickers drag, and the mascot's iris follows the pointer. The mobile menu traps focus and closes with Esc. The contact form validates, delivered a real submission to a local webhook in testing, and shows success and reset states.
- **Lighthouse** (local run, simulated throttling):

  | | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
  | --- | --- | --- | --- | --- | --- | --- | --- |
  | Desktop (light / dark) | 99–100 | 100 | 100 | 100 | 0.7 s | 10–90 ms | 0 |
  | Mobile (light / dark) | 90–93 | 100 | 100 | 100 | 3.0–3.3 s | 160–240 ms | 0 |

  Mobile LCP is Lighthouse's simulated slow-4G estimate. In the recorded trace, the LCP element paints at about 200 ms.

## Known limitations

- An unknown `/work/<slug>` renders the 404 page with `noindex` but returns HTTP 200. With Cache Components, the static shell's status is sent before `notFound()` resolves. Unknown root paths return a real 404.
- The OG image fetches Anton from Google Fonts at build time (cached). If that fails, it falls back to a generic sans-serif.
- There is no JSON-LD structured data. Add an `Organization` schema once real business details (legal name, address, profiles) are confirmed.

## Deployment

The site is a standard Next.js app. On Vercel, import the repo and set the environment variables above. Every page except unknown slugs is prerendered statically.
