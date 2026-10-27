"use client";

import { useEffect } from "react";

/**
 * Fires when the no-JS / race-condition contact path lands on /thanks.
 * The AJAX path already calls track("contact_submit") from enhance.js.
 */
export function ContactSubmitBeacon() {
  useEffect(() => {
    const key = "ruyalab_contact_submit_beacon";
    try {
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode — still send once this mount */
    }

    const id = document.documentElement.dataset.ga;
    if (!id) return;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", id);
      if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.head.appendChild(script);
      }
    }
    window.gtag("event", "contact_submit", { method: "form", transport_type: "beacon" });
  }, []);

  return null;
}
