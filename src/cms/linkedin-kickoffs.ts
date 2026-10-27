/** Seed drafts for CMS LinkedIn posts (first visit). Edit/create more in /ruyashield/linkedin. */
export const LINKEDIN_KICKOFFS = [
  {
    id: "positioning",
    title: "Post 1 — Positioning",
    when: "This week (personal profile first, then company reshare)",
    body: `Most digital products fail in the handoff — design finishes a deck, engineering rebuilds it, AI is bolted on later.

Ruyalab is an independent creative technology studio. Design, engineering and AI are the same team. We ship products and high-craft sites without that gap.

Live proof: Talkel and Web Monitor — products we built and run ourselves.

If you’re a founder or product lead who needs one team to ship, start here → https://ruyalab.com/`,
  },
  {
    id: "talkel",
    title: "Post 2 — Talkel",
    when: "2–3 days after Post 1",
    body: `Plenty of people read English well and freeze when they have to speak it under pressure — interviews, salary talks, tough client calls.

We built Talkel: a real-time AI call partner that rehearses the moment, then shows exactly what to fix.

Case study → https://ruyalab.com/work/talkel
Try it → https://talkel.ruyalab.com/`,
  },
  {
    id: "web-monitor",
    title: "Post 3 — Web Monitor",
    when: "2–3 days after Post 2",
    body: `Too many teams find out a site is slow or down from a customer.

Web Monitor checks WordPress, Laravel, Next.js and PHP sites every minute — real health, not a dumb ping — with alerts on the web and your phone.

Case study → https://ruyalab.com/work/web-monitor
Product → https://webmonitor.ruyalab.com/`,
  },
] as const;
