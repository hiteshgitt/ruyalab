// Cloudflare Workers Builds runs `npm clean-install`, then the deploy command (`npx wrangler deploy`), and needs the
// OpenNext output to exist by then. This runs the OpenNext build right after install, but only inside Workers Builds
// (WORKERS_CI=1), so a local `npm install` stays fast.
import { execSync } from "node:child_process";

if (process.env.WORKERS_CI === "1" && !process.env.RUYALAB_SKIP_CI_BUILD) {
  console.log("Workers Builds: running `opennextjs-cloudflare build` before deploy");
  execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });
}
