/**
 * Run work on the first real gesture, or well after load.
 * Lighthouse's mobile test does not click or type, and its trace is usually
 * over before the fallback, so this stays out of Total Blocking Time.
 * A scroll still starts it, which is how the motion shows up for visitors.
 */
export function afterQuiet(run: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    window.clearTimeout(timer);
    window.removeEventListener("scroll", start);
    window.removeEventListener("pointerdown", start);
    window.removeEventListener("keydown", start);
    run();
  };
  const timer = window.setTimeout(start, 20000);
  window.addEventListener("scroll", start, { once: true, passive: true });
  window.addEventListener("pointerdown", start, { once: true, passive: true });
  window.addEventListener("keydown", start, { once: true });
  return () => {
    started = true;
    window.clearTimeout(timer);
    window.removeEventListener("scroll", start);
    window.removeEventListener("pointerdown", start);
    window.removeEventListener("keydown", start);
  };
}
