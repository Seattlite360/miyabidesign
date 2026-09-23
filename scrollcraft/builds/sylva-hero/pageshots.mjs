// Page-wide screenshot pass for everything below the hero (the scroll-craft
// harness only walks engine acts). Usage: node pageshots.mjs <url> <out> <w> <h> [night] [reduced]
import fs from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/package.json")("playwright-core");
const [url, out, w, h, ...flags] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.SCROLLCRAFT_CHROME });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1,
  reducedMotion: flags.includes("reduced") ? "reduce" : "no-preference" });
if (flags.includes("night")) await ctx.addInitScript(() => localStorage.setItem("sylva-theme", "night"));
const p = await ctx.newPage();
const errs = [];
p.on("pageerror", e => errs.push(String(e)));
p.on("console", m => { if (m.type() === "error" || m.type() === "warning") errs.push(m.text()); });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(4500);
const stops = await p.evaluate(() => {
  const top = el => { const s = el.closest(".pin-spacer") || el; return s.getBoundingClientRect().top + scrollY; };
  const H = innerHeight, r = [];
  const add = (n, y) => r.push([n, Math.max(0, Math.round(y))]);
  const hero = document.querySelector("[data-hero]");
  add("hero-0", 0); add("hero-40", hero.offsetHeight * 0.3); add("hero-90", hero.offsetHeight * 0.72);
  for (const id of ["residence", "architecture", "living", "gallery"]) add(id, top(document.getElementById(id)) + H * 0.1);
  const loc = document.getElementById("location"); const lt = top(loc);
  const sp = loc.querySelector(".pin-spacer"); const lh = sp ? sp.offsetHeight - H : 0;
  add("location-a", lt + 2); add("location-b", lt + lh * 0.5); add("location-c", lt + lh * 0.98);
  for (const id of ["builder", "register"]) add(id, top(document.getElementById(id)) + H * 0.05);
  add("footer", document.documentElement.scrollHeight - H);
  return r;
});
for (const [n, y] of stops) {
  // walk there in steps so scrubbed reveals and Lenis see real scroll
  const cur = await p.evaluate(() => scrollY);
  const steps = 8;
  for (let i = 1; i <= steps; i++) { await p.evaluate(v => window.scrollTo(0, v), cur + (y - cur) * i / steps); await p.waitForTimeout(60); }
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `${out}/${n}.png` });
}
const metrics = await p.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: innerWidth, docH: document.documentElement.scrollHeight / innerHeight }));
console.log(JSON.stringify({ metrics, errs: errs.filter(e => !/typekit|TUNNEL/i.test(e)) }, null, 1));
await b.close();
