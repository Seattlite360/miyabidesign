// Whole-page screenshot pass. Walks every <main> section (and a pinned section's
// start, middle and end) with real scroll steps, so scrubbed reveals and Lenis fire.
//   node pageshots.mjs <url> <outdir> <width> <height> [reduced] [night]
// Needs playwright-core (npm i playwright-core) and a Chromium: set CHROME to its path
// (in Claude cloud sessions: /opt/pw-browsers/chromium... see scroll-craft doctor.mjs).
// Headless Chromium has no H.264: serve a VP9 copy of the hero clip (scripts/lab.sh).
import fs from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/package.json")("playwright-core");
const [url, out, w, h, ...flags] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || process.env.SCROLLCRAFT_CHROME });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1,
  reducedMotion: flags.includes("reduced") ? "reduce" : "no-preference" });
if (flags.includes("night")) await ctx.addInitScript(() => localStorage.setItem("site-theme", "night"));
const p = await ctx.newPage();
const errs = [];
p.on("pageerror", e => errs.push(String(e)));
p.on("console", m => { if (m.type() === "error" || m.type() === "warning") errs.push(m.text()); });
p.on("requestfailed", r => errs.push("failed: " + r.url()));
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(4500);                                   // preloader
const stops = await p.evaluate(() => {
  const H = innerHeight, r = [];
  const top = el => (el.closest(".pin-spacer") || el).getBoundingClientRect().top + scrollY;
  const add = (n, y) => r.push([n, Math.max(0, Math.round(y))]);
  for (const s of document.querySelectorAll("main > section")) {
    const id = s.id || "section";
    const sp = s.closest(".pin-spacer") || s.querySelector(".pin-spacer");
    const long = sp ? sp.offsetHeight - H : s.offsetHeight - H;
    if (s.hasAttribute("data-sc-act") || long > H * 1.5) {
      for (const k of [0, 0.3, 0.6, 0.95]) add(`${id}-${Math.round(k * 100)}`, top(s) + long * k);
    } else add(id, top(s) + H * 0.1);
  }
  add("footer", document.documentElement.scrollHeight - H);
  return r;
});
for (const [n, y] of stops) {
  const cur = await p.evaluate(() => scrollY);
  for (let i = 1; i <= 8; i++) { await p.evaluate(v => window.scrollTo(0, v), cur + (y - cur) * i / 8); await p.waitForTimeout(60); }
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `${out}/${n}.png` });
}
const metrics = await p.evaluate(() => ({
  horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
  pageHeightInScreens: +(document.documentElement.scrollHeight / innerHeight).toFixed(1) }));
console.log(JSON.stringify({ shots: stops.length, metrics, errs }, null, 1));
await b.close();
