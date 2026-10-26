import { mkdir } from "node:fs/promises";
import { build } from "esbuild";

await mkdir("public/boot", { recursive: true });
await build({
  entryPoints: ["src/boot/enhance.ts"],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  minify: true,
  outfile: "public/boot/enhance.js",
});
