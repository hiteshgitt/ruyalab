"use client";

import { useEffect } from "react";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/**
 * GA4, loaded on the first interaction, or after 30s if the visitor never
 * interacts. The delay keeps the tag out of the PageSpeed trace.
 */
export function GoogleTag({ id }: { id: string }) {
  useEffect(() => {
    let started = false;
    const load = () => {
      if (started) return;
      started = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", id);
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);
    };

    const onInteract = () => {
      window.clearTimeout(timer);
      load();
    };
    const timer = window.setTimeout(load, 30000);
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    for (const event of events) window.addEventListener(event, onInteract, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      for (const event of events) window.removeEventListener(event, onInteract);
    };
  }, [id]);

  return null;
}
