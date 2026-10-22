export type Theme = "light" | "dark";

export const THEME_KEY = "ruyalab-theme";

/**
 * Runs in <head> before first paint: saved choice → OS preference → light.
 * Kept tiny and dependency-free; any storage error falls back to the OS.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t})()`;
