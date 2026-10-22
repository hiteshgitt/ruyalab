"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { IrisHandle } from "./iris";
import { IrisFallback } from "./IrisFallback";
import styles from "./HeroVisual.module.css";

type Status = "poster" | "live" | "static";

let webglSupport: boolean | undefined;
function canUseWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const c = document.createElement("canvas");
      webglSupport = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const REDUCED = "(prefers-reduced-motion: reduce)";

function shouldStayStatic(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return window.matchMedia(REDUCED).matches || nav.connection?.saveData === true || !canUseWebGL();
}

// Re-evaluates live if the user toggles reduced motion at the OS level.
function subscribeStatic(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function HeroVisual() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [runtimeStatus, setStatus] = useState<Status>("poster");
  const forceStatic = useSyncExternalStore(subscribeStatic, shouldStayStatic, () => false);
  const status: Status = forceStatic ? "static" : runtimeStatus;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || forceStatic) return;

    let handle: IrisHandle | null = null;
    let cancelled = false;
    let inView = true;
    const cleanups: Array<() => void> = [];

    const sync = () => handle?.setActive(inView && !document.hidden);

    const boot = async () => {
      const { createIris } = await import("./iris");
      if (cancelled) return;
      const small = window.innerWidth < 768;
      const modest = (navigator.hardwareConcurrency ?? 8) <= 4;
      try {
        handle = createIris(canvas, {
          quality: small || modest ? "low" : "high",
          onContextLost: () => setStatus("static"),
        });
      } catch {
        setStatus("static");
        return;
      }

      // Pause when offscreen or the tab is hidden.
      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      });
      io.observe(wrap);
      document.addEventListener("visibilitychange", sync);
      cleanups.push(() => {
        io.disconnect();
        document.removeEventListener("visibilitychange", sync);
      });

      // Scroll progress across the hero drives the iris opening.
      // Progress 0 → 1 as the section travels from entering to leaving.
      const host = wrap.closest("section") ?? wrap;
      const onScroll = () => {
        const r = host.getBoundingClientRect();
        handle?.setScroll((window.innerHeight - r.top) / (window.innerHeight + r.height));
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      // Pointer parallax only for precise pointers; touch devices skip it.
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const onMove = (e: PointerEvent) => {
          handle?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onMove));
      }

      // Compile shaders off the main thread where supported, then reveal.
      await handle.ready;
      if (cancelled) return;
      sync();
      requestAnimationFrame(() => !cancelled && setStatus("live"));
    };

    // WebGL is an enhancement: only fetch Three.js and compile shaders when
    // the scene is about to scroll into view, then on an idle frame.
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    let idleId: number | undefined;
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        approach.disconnect();
        idleId = ric(() => void boot().catch(() => setStatus("static")), { timeout: 800 });
      },
      { rootMargin: "400px 0px" },
    );
    approach.observe(wrap);

    return () => {
      cancelled = true;
      approach.disconnect();
      if (idleId !== undefined) cic(idleId);
      cleanups.forEach((fn) => fn());
      handle?.dispose();
    };
  }, [forceStatic]);

  return (
    <div ref={wrapRef} className={styles.visual} data-status={status}>
      <IrisFallback className={styles.poster} />
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
}
