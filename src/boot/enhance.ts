import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const FINE = "(hover: hover) and (pointer: fine)";

type PlayStep = { title: string; short: string; detail: string; pose: string };
type Playbook = { key: string; label: string; steps: PlayStep[] };

function bootMotion() {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);
  const q = <E extends Element = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<E>(sel));
  const mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    const splits = q<HTMLElement>("[data-split]").map((el) =>
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.21,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        },
      }),
    );

    const groups = new Map<Element, HTMLElement[]>();
    q<HTMLElement>("[data-reveal]").forEach((el) => {
      const key = el.closest("[data-reveal-group]") ?? el;
      groups.set(key, [...(groups.get(key) ?? []), el]);
    });
    groups.forEach((els, trigger) => {
      gsap.from(els, {
        y: 36,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.105,
        scrollTrigger: { trigger, start: "top 88%", once: true },
      });
    });

    q<HTMLElement>("[data-parallax]").forEach((el) => {
      const amount = parseFloat(el.dataset.parallax || "0.12");
      gsap.fromTo(
        el,
        { yPercent: -amount * 50 },
        {
          yPercent: amount * 50,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    const wordSplits = q<HTMLElement>("[data-scrub-words]").map((el) =>
      SplitText.create(el, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.32 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
            },
          );
        },
      }),
    );

    q<HTMLElement>("[data-draw]").forEach((el) => {
      const axis = el.dataset.draw === "y" ? "scaleY" : "scaleX";
      gsap.fromTo(
        el,
        { [axis]: 0 },
        {
          [axis]: 1,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top 75%", end: "bottom 60%", scrub: 0.5 },
        },
      );
    });

    document.querySelectorAll<HTMLElement>("[data-hero-intro]").forEach((root) => {
      const content = root.querySelector("[data-hero-content]");
      if (!content) return;
      gsap.to(content, {
        yPercent: -8,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    });

    document.querySelectorAll<HTMLElement>("[data-sticker]").forEach((el) => {
      const bounds = el.dataset.bounds;
      mm.add(`${MOTION_OK} and ${FINE}`, () => {
        const [drag] = Draggable.create(el, {
          type: "x,y",
          bounds: bounds ? (el.closest(bounds) ?? undefined) : undefined,
          zIndexBoost: true,
          onPress() {
            gsap.to(el, { scale: 1.08, rotate: -4, duration: 0.25, ease: "back.out(3)" });
          },
          onRelease() {
            gsap.to(el, { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
          },
        });
        return () => drag?.kill();
      });
    });

    return () => {
      splits.forEach((s) => s.revert());
      wordSplits.forEach((s) => s.revert());
    };
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function bootTilt() {
  if (!matchMedia(`${FINE} and ${MOTION_OK}`).matches) return;
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
    const max = Number(el.dataset.tiltMax || 6);
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
  });
}

function bootDevice() {
  const root = document.querySelector<HTMLElement>("[data-device]");
  if (!root) return;
  root.dataset.settled = "";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hover = false;
  let inView = true;
  const buttons = () => Array.from(root.querySelectorAll<HTMLButtonElement>("[data-device-option]"));
  const paint = (mode: string, cycling: boolean) => {
    root.dataset.mode = mode;
    buttons().forEach((b) => {
      const on = b.dataset.deviceOption === mode;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (on && cycling) b.dataset.cycling = "";
      else b.removeAttribute("data-cycling");
    });
  };
  let timer = 0;
  const sync = () => {
    window.clearInterval(timer);
    const cycling = root.dataset.auto !== "false" && !hover && inView && !reduced;
    paint(root.dataset.mode || "mobile", cycling);
    if (!cycling) return;
    const order = ["mobile", "tablet", "desktop"];
    timer = window.setInterval(() => {
      const i = order.indexOf(root.dataset.mode || "mobile");
      paint(order[(i + 1) % order.length], true);
    }, 4200);
  };
  root.addEventListener("pointerenter", () => {
    hover = true;
    sync();
  });
  root.addEventListener("pointerleave", () => {
    hover = false;
    sync();
  });
  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    sync();
  });
  io.observe(root);
  sync();
}

function bootMascots() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll<SVGSVGElement>("[data-live-mascot]").forEach((svg) => {
    const iris = svg.querySelector<SVGGElement>("[data-iris]");
    const pupil = svg.querySelector<SVGGElement>("[data-pupil]");
    const star = svg.querySelector<SVGGElement>("[data-star]");
    if (!iris || !pupil) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let idle = 0;
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const cx = r.left + r.width * 0.49;
      const cy = r.top + r.height * 0.525;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / 260, 1);
      target.x = (dx / dist) * reach;
      target.y = (dy / dist) * reach;
      idle = 0;
    };
    const tick = () => {
      idle += 1;
      if (idle > 240) {
        target.x *= 0.98;
        target.y *= 0.98;
      }
      const k = reduced ? 1 : 0.12;
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      iris.setAttribute("transform", `translate(${(cur.x * 22).toFixed(2)} ${(cur.y * 18).toFixed(2)})`);
      pupil.setAttribute("transform", `translate(${(cur.x * 14).toFixed(2)} ${(cur.y * 11).toFixed(2)})`);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(svg);
    window.addEventListener("pointermove", onMove, { passive: true });
    svg.addEventListener("click", () => {
      if (!star) return;
      star.removeAttribute("data-spinning");
      void star.getBoundingClientRect();
      star.dataset.spinning = "";
    });
  });
}

function bootPlaybooks() {
  const root = document.querySelector<HTMLElement>("[data-playbooks]");
  const dataEl = document.getElementById("playbook-data");
  if (!root || !dataEl) return;
  const books = JSON.parse(dataEl.textContent || "[]") as Playbook[];
  if (!books.length) return;
  let book = Number(root.dataset.book || 0);
  let step = Number(root.dataset.step || 0);
  let playing = root.dataset.playing !== "false";
  let hover = false;
  let inView = false;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const panel = root.querySelector<HTMLElement>("[data-panel]");
  const detail = root.querySelector<HTMLElement>("[data-detail]");

  const render = () => {
    const current = books[book];
    const steps = current.steps;
    step = ((step % steps.length) + steps.length) % steps.length;
    const item = steps[step];
    root.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((tab) => {
      const on = Number(tab.dataset.tab) === book;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    });
    if (panel) {
      panel.style.setProperty("--active", String(step));
      panel.style.setProperty("--n", String(steps.length));
      panel.setAttribute("aria-labelledby", `playbook-tab-${book}`);
    }
    root.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((btn, i) => {
      const s = steps[i];
      if (!s) return;
      const title = btn.querySelector("[data-step-title]");
      const short = btn.querySelector("[data-step-short]");
      if (title) title.textContent = s.title;
      if (short) short.textContent = s.short;
      if (i === step) btn.setAttribute("aria-current", "step");
      else btn.removeAttribute("aria-current");
      if (i < step) btn.dataset.done = "true";
      else btn.removeAttribute("data-done");
    });
    const label = root.querySelector("[data-step-label]");
    const title = root.querySelector("[data-detail-title]");
    const body = root.querySelector("[data-detail-body]");
    if (label) label.textContent = `Step ${String(step + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
    if (title) title.innerHTML = `${item.title} <span class="${title.querySelector("span")?.className ?? ""}">— ${item.short}</span>`;
    if (body) body.textContent = item.detail;
    const src = `/mascots/${item.pose}.svg`;
    root.querySelectorAll<HTMLImageElement>("[data-glider] img, [data-detail-art] img").forEach((img) => {
      img.src = src;
    });
    const play = root.querySelector<HTMLButtonElement>("[data-step-play]");
    if (play) {
      play.setAttribute("aria-pressed", playing ? "false" : "true");
      play.setAttribute("aria-label", playing ? "Pause autoplay" : "Play autoplay");
      play.textContent = playing ? "❚❚" : "▶";
    }
    const running = playing && !hover && inView && !reduced;
    if (detail) {
      if (running) detail.dataset.running = "";
      else detail.removeAttribute("data-running");
    }
  };

  let timer = 0;
  const sync = () => {
    window.clearInterval(timer);
    render();
    const steps = books[book].steps;
    if (!(playing && !hover && inView && !reduced)) return;
    timer = window.setInterval(() => {
      step = (step + 1) % steps.length;
      render();
    }, 2800);
  };

  root.addEventListener("click", (e) => {
    const target = e.target as Element;
    const tab = target.closest<HTMLButtonElement>("[data-tab]");
    const stepBtn = target.closest<HTMLButtonElement>("[data-step]");
    if (tab) {
      book = Number(tab.dataset.tab);
      step = 0;
      sync();
      return;
    }
    if (stepBtn) {
      step = Number(stepBtn.dataset.step);
      playing = false;
      sync();
      return;
    }
    if (target.closest("[data-step-prev]")) {
      step -= 1;
      playing = false;
      sync();
      return;
    }
    if (target.closest("[data-step-next]")) {
      step += 1;
      playing = false;
      sync();
      return;
    }
    if (target.closest("[data-step-play]")) {
      playing = !playing;
      sync();
    }
  });

  root.addEventListener("keydown", (e) => {
    const tabs = root.querySelector("[data-tabs]");
    if (!tabs?.contains(e.target as Node)) return;
    const last = books.length - 1;
    const next =
      e.key === "ArrowRight" ? (book === last ? 0 : book + 1)
      : e.key === "ArrowLeft" ? (book === 0 ? last : book - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    book = next;
    step = 0;
    sync();
    root.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
  });

  root.addEventListener("pointerenter", () => {
    hover = true;
    sync();
  });
  root.addEventListener("pointerleave", () => {
    hover = false;
    sync();
  });
  const io = new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting;
      sync();
    },
    { threshold: 0.35 },
  );
  io.observe(root);
  sync();
}

/** Ensure the gtag stub exists so events queue correctly before the script loads. */
function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") return;
  window.gtag = function gtag(...args: unknown[]) {
    // Must push Arguments-shaped entries — an array literal is ignored by gtag.js.
    window.dataLayer?.push(args);
  };
}

/** Queue a GA4 event even if the gtag script has not finished loading yet. */
function track(name: string, params: Record<string, string> = {}) {
  ensureGtag();
  window.gtag?.("event", name, params);
}

function bootContact() {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  const success = document.querySelector<HTMLElement>("[data-contact-success]");
  const message = document.querySelector<HTMLElement>("[data-contact-message]");
  const error = document.querySelector<HTMLElement>("[data-contact-error]");
  const reset = document.querySelector<HTMLButtonElement>("[data-contact-reset]");
  if (!form || !success) return;

  const showError = (text: string) => {
    if (!error) return;
    error.hidden = false;
    error.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const messageField = form.querySelector<HTMLTextAreaElement>("[name=message]");
    if (messageField && messageField.value.trim().length < 20) {
      messageField.setCustomValidity("A few more details help — at least 20 characters.");
      messageField.reportValidity();
      messageField.setCustomValidity("");
      return;
    }
    const submit = form.querySelector<HTMLButtonElement>("[type=submit]");
    if (submit) submit.disabled = true;
    if (error) error.hidden = true;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
        headers: { accept: "application/json" },
      });
      const data = (await res.json()) as { status?: string; message?: string };
      if (!res.ok || data.status !== "success") {
        showError(data.message || "Something went wrong sending your message. Please try again in a moment.");
        return;
      }
      if (message) message.textContent = data.message || "Thanks — your message is in. We'll be in touch soon.";
      form.hidden = true;
      success.hidden = false;
      success.focus();
      track("contact_submit", { method: "form" });
    } catch {
      showError("Something went wrong sending your message. Please try again in a moment.");
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  reset?.addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    if (error) error.hidden = true;
    form.querySelector<HTMLElement>("input, textarea, select")?.focus();
  });
}

function bootAnalytics() {
  const id = document.documentElement.dataset.ga;
  if (!id) return;
  ensureGtag();
  // Config once even if the gtag.js script tag was injected elsewhere (e.g. Zaraz).
  if (!document.documentElement.dataset.gaConfigured) {
    document.documentElement.dataset.gaConfigured = "1";
    window.gtag?.("js", new Date());
    window.gtag?.("config", id, { send_page_view: true });
  }
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }

  const path = location.pathname;
  const work = path.match(/^\/work\/([^/]+)\/?$/);
  if (work) track("case_study_view", { project: work[1] });

  document.addEventListener(
    "click",
    (e) => {
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("[data-track]");
      if (!link) return;
      const name = link.dataset.track;
      if (!name) return;
      track(name, {
        label: link.dataset.trackLabel || link.href,
        href: link.href,
      });
    },
    { passive: true },
  );
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

bootMotion();
bootTilt();
bootDevice();
bootMascots();
bootPlaybooks();
bootAnalytics();
bootContact();
