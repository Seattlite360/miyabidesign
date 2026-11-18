// @ts-nocheck
// Miyabi Design: Services page sections (9 sections below the hero).
// Paste-ready Framer code component. Edit copy and image slots in the "html" property.
// Only the CTA buttons use Miyabi Red. No prices. Poppins only.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1462
 * @framerIntrinsicHeight 9400
 */

const CSS = `
/* ===== Tokens ===== */
.mz{
  --ink:#000000; --muted:#696969; --canvas:#FFFFFF; --tint:#F2F2F2; --dark:#1A1A1A;
  --accent:#AC3235; --accent-hover:#B4494C;
  --radius:8px; /* match the Master Buttons radius when pasted into Framer */
  --gutter:64px; --sec:160px;
  font-family:'Poppins',sans-serif; font-weight:300; color:var(--ink); background:var(--canvas);
  -webkit-font-smoothing:antialiased; line-height:1.6; font-size:18px;
}
@media (max-width:1100px){.mz{--gutter:40px;--sec:120px}}
@media (max-width:700px){.mz{--gutter:20px;--sec:88px;font-size:16px}}
.mz *,.mz *::before,.mz *::after{box-sizing:border-box}
.mz ::selection{background:#000;color:#F2F2F2}
.mz a{color:inherit;text-underline-offset:3px}
.mz :focus-visible{outline:2px solid #000;outline-offset:2px}
.mz .dark :focus-visible{outline-color:#fff}
.mz h2,.mz h3,.mz p,.mz ul,.mz ol{margin:0;padding:0}
.mz ul,.mz ol{list-style:none}
.mz button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;text-align:left}

/* ===== Layout ===== */
.mz section{padding:var(--sec) var(--gutter)}
.mz .tint{background:var(--tint)}
.mz .dark{background:var(--dark);color:#fff}
.mz .wrap{max-width:1200px;margin:0 auto}
.mz h2{font-size:56px;font-weight:300;line-height:1.05;letter-spacing:-.03em;max-width:16ch}
.mz h3{font-size:28px;font-weight:300;line-height:1.2;letter-spacing:-.015em}
@media (max-width:700px){.mz h2{font-size:34px}.mz h3{font-size:22px}}
.mz .body{max-width:65ch}
.mz .muted{color:var(--muted)}
.mz .dark .muted{color:#b5b5b5}
.mz .label{font-size:13px;font-weight:500;line-height:1.4;letter-spacing:.04em}
.mz .head{margin-bottom:72px}
@media (max-width:700px){.mz .head{margin-bottom:44px}}

/* ===== CTA (the only red on the page) ===== */
.mz .cta{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 32px;background:var(--accent);color:#fff;
  font-size:16px;font-weight:500;line-height:1;letter-spacing:.01em;text-decoration:none;border-radius:var(--radius);
  transition:background .2s,transform .1s}
.mz .cta:hover{background:var(--accent-hover)}
.mz .cta:active{transform:scale(.97)}
@media (max-width:700px){.mz .cta{display:flex;width:100%}}
.mz .textlink{font-size:16px;font-weight:500;letter-spacing:.01em}

/* ===== Image slots ===== */
.mz .slot{position:relative;width:100%;background:#E6E6E6;border:1px dashed #9a9a9a;display:flex;align-items:center;justify-content:center;
  text-align:center;padding:24px;color:var(--muted);font-size:13px;font-weight:500;letter-spacing:.04em;line-height:1.5;overflow:hidden}
.mz .slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mz .slot .name{max-width:28ch}
.mz .slot:has(.sample){padding-top:56px}
.mz .sample{position:absolute;left:12px;top:12px;background:#000;color:#fff;font-size:12px;font-weight:500;letter-spacing:.04em;padding:6px 10px;z-index:2}
.mz .r-45{aspect-ratio:4/5}.mz .r-23{aspect-ratio:2/3}.mz .r-916{aspect-ratio:9/16}.mz .r-a4{aspect-ratio:210/297}.mz .r-32{aspect-ratio:3/2}.mz .r-43{aspect-ratio:4/3}

/* ===== 1. Who it's for (image-led tabs) ===== */
.mz .who-tabs{display:flex;gap:48px;border-bottom:1px solid #d6d6d6;margin-bottom:56px}
.mz .who-tab{font-size:40px;font-weight:300;letter-spacing:-.025em;line-height:1.1;padding:0 0 20px;color:#9a9a9a;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .35s}
.mz .who-tab[aria-selected="true"]{color:#000;border-bottom-color:#000}
@media (max-width:700px){.mz .who-tabs{gap:24px}.mz .who-tab{font-size:26px}}
.mz .who-panel{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.mz .who-panel[hidden]{display:none}
.mz .who-panel .copy{display:grid;gap:24px;justify-items:start}
@media (max-width:900px){.mz .who-panel{grid-template-columns:1fr;gap:32px}.mz .who-panel .slot{order:-1}}

/* ===== 2. Listing pack showcase (scroll sync) ===== */
.mz .sync{display:grid;grid-template-columns:1fr 1fr;gap:96px;align-items:start}
.mz .sync-stage{position:sticky;top:96px;display:flex;justify-content:center}
.mz .sync-stage .stack{position:relative;width:min(100%,420px)}
.mz .sync-stage .frame{position:absolute;inset:0;opacity:0;transition:opacity .35s ease;display:flex;align-items:center;justify-content:center}
.mz .sync-stage .frame.on{opacity:1}
.mz .sync-stage .stack::before{content:"";display:block;aspect-ratio:4/5.2}
.mz .sync-steps li{min-height:64vh;display:flex;flex-direction:column;justify-content:center;gap:16px;opacity:.35;transition:opacity .35s}
.mz .sync-steps li.on{opacity:1}
.mz .sync-steps .mobile-slot{display:none}
.mz .caption{margin-top:48px;color:var(--muted);font-size:16px}
@media (max-width:900px){
  .mz .sync{grid-template-columns:1fr;gap:0}
  .mz .sync-stage{display:none}
  .mz .sync-steps li{min-height:0;opacity:1;padding:0 0 56px}
  .mz .sync-steps .mobile-slot{display:flex;margin-bottom:12px}
}

/* ===== 3. 24-hour rail ===== */
.mz .rail{position:relative;--s:10%;--e:50%;--t:90%;--p:0}
.mz .rail ol{display:grid;grid-template-columns:repeat(5,1fr);gap:0}
.mz .rail li{position:relative;padding:56px 16px 0 0}
.mz .rail .node{position:absolute;top:0;left:50%;width:20px;height:20px;margin-left:-10px;border-radius:50%;background:#fff;border:2px solid #000;
  opacity:.4;transition:opacity .35s}
.mz .rail .node.lit{opacity:1;background:#000}
.mz .rail .after .node{border-color:var(--muted);opacity:1;background:#fff}
.mz .rail li{text-align:center;padding:56px 12px 0}
.mz .rail .time{display:block;margin-bottom:8px}
.mz .rail .after .time,.mz .rail .after p{color:var(--muted)}
.mz .rail .track,.mz .rail .fill,.mz .rail .dash{position:absolute;top:9px;height:2px}
.mz .rail .track{left:var(--s);width:calc(var(--e) - var(--s));background:#d6d6d6}
.mz .rail .fill{left:var(--s);width:calc(var(--e) - var(--s));background:#000;transform-origin:left;transform:scaleX(var(--p))}
.mz .rail .dash{left:var(--e);width:calc(var(--t) - var(--e));background:repeating-linear-gradient(90deg,var(--muted) 0 6px,transparent 6px 12px)}
.mz .rail .note{margin-top:56px;color:var(--muted);font-size:16px}
@media (max-width:900px){
  .mz .rail ol{grid-template-columns:1fr;gap:36px}
  .mz .rail li{text-align:left;padding:0 0 0 52px;min-height:20px}
  .mz .rail .node{left:0;margin-left:0;top:4px}
  .mz .rail .track,.mz .rail .fill,.mz .rail .dash{top:auto;left:9px;width:2px}
  .mz .rail .track{top:var(--s);height:calc(var(--e) - var(--s))}
  .mz .rail .fill{top:var(--s);height:calc(var(--e) - var(--s));transform-origin:top;transform:scaleY(var(--p))}
  .mz .rail .dash{top:var(--e);height:calc(var(--t) - var(--e));background:repeating-linear-gradient(180deg,var(--muted) 0 6px,transparent 6px 12px)}
}

/* ===== 4. Guarantee ===== */
.mz .guarantee .wrap{display:grid;gap:40px;justify-items:start}
.mz .guarantee p.big{font-size:32px;line-height:1.25;letter-spacing:-.02em;max-width:30ch}
@media (max-width:700px){.mz .guarantee p.big{font-size:24px}}

/* ===== 5. Plans (compact segmented control) ===== */
.mz .plans-lead{margin-bottom:28px}
.mz .seg{display:inline-flex;background:#fff;border:1px solid #d0d0d0;border-radius:999px;padding:4px;gap:2px;margin-bottom:48px}
.mz .seg button{font-size:14px;font-weight:500;letter-spacing:.01em;padding:0 22px;min-height:44px;border-radius:999px;text-align:center;transition:background .3s,color .3s}
.mz .seg button[aria-selected="true"]{background:#000;color:#fff}
@media (max-width:700px){.mz .seg{display:flex;width:100%}.mz .seg button{flex:1;padding:0 6px;font-size:13px}}
.mz .plan-panel{max-width:60ch;display:grid;gap:20px;animation:mzfade .35s ease}
.mz .plan-panel[hidden]{display:none}
@keyframes mzfade{from{opacity:0}to{opacity:1}}
.mz .plans-note{margin-top:40px;color:var(--muted);font-size:16px;max-width:65ch}
.mz .plans .cta{margin-top:40px}

/* ===== 6. Developer build (accordion) ===== */
.mz .dev{display:grid;grid-template-columns:1.1fr 1fr;gap:80px;align-items:start}
.mz .acc{border-top:1px solid #d0d0d0}
.mz .acc-item{border-bottom:1px solid #d0d0d0}
.mz .acc-btn{display:flex;width:100%;justify-content:space-between;align-items:center;gap:24px;padding:24px 0;font-size:28px;font-weight:300;letter-spacing:-.015em;line-height:1.2}
.mz .acc-btn .plus{flex:none;width:20px;height:20px;position:relative}
.mz .acc-btn .plus::before,.mz .acc-btn .plus::after{content:"";position:absolute;left:0;right:0;top:9px;height:2px;background:#000;transition:transform .35s}
.mz .acc-btn .plus::after{transform:rotate(90deg)}
.mz .acc-btn[aria-expanded="true"] .plus::after{transform:rotate(0)}
.mz .acc-btn{color:#9a9a9a;transition:color .35s}
.mz .acc-btn[aria-expanded="true"]{color:#000}
.mz .acc-btn.sel{color:#9a9a9a;transition:color .35s}
.mz .acc-btn.sel[aria-pressed="true"]{color:#000}
.mz .acc-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s ease}
.mz .acc-panel>div{overflow:hidden}
.mz .acc-btn[aria-expanded="true"]+.acc-panel{grid-template-rows:1fr}
.mz .acc-panel p{padding:0 0 28px;color:var(--muted);max-width:52ch}
.mz .dev-stage{position:sticky;top:96px}
.mz .dev-stage .frame{display:none}.mz .dev-stage .frame.on{display:block}
.mz .dev .after{margin-top:40px}
@media (max-width:900px){.mz .dev{grid-template-columns:1fr;gap:40px}.mz .dev-stage{position:static;order:-1}.mz .acc-btn{font-size:22px}}

/* ===== 7. Compliance ===== */
.mz .three{display:grid;grid-template-columns:repeat(3,1fr);gap:48px}
.mz .three li{border-top:1px solid #000;padding-top:24px}
@media (max-width:900px){.mz .three{grid-template-columns:1fr;gap:32px}}

/* ===== 8. FAQ ===== */
.mz .faq{border-top:1px solid #d0d0d0;max-width:860px}
.mz .faq details{border-bottom:1px solid #d0d0d0}
.mz .faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:24px;padding:24px 0;font-size:24px;font-weight:300;letter-spacing:-.015em;line-height:1.25}
.mz .faq summary::-webkit-details-marker{display:none}
.mz .faq summary .plus{flex:none;width:18px;height:18px;position:relative}
.mz .faq summary .plus::before,.mz .faq summary .plus::after{content:"";position:absolute;left:0;right:0;top:8px;height:2px;background:#000;transition:transform .35s}
.mz .faq summary .plus::after{transform:rotate(90deg)}
.mz .faq details[open] summary .plus::after{transform:rotate(0)}
.mz .faq details p{padding:0 0 28px;color:var(--muted);max-width:60ch}
@media (max-width:700px){.mz .faq summary{font-size:19px}}

/* ===== 9. Final CTA ===== */
.mz .final .wrap{display:grid;gap:40px;justify-items:start}

@media (prefers-reduced-motion:reduce){
  .mz *{transition:none!important;animation:none!important}
  .mz .rail{--p:1!important}
}
`

const HTML = `<div class="mz">

<!-- 1. WHO IT'S FOR -->
<section id="who">
  <div class="wrap">
    <div class="head"><h2>Two ways we work.</h2></div>
    <div class="who-tabs" role="tablist" aria-label="Who we work with">
      <button class="who-tab" role="tab" id="wt-agencies" aria-controls="wp-agencies" aria-selected="true">Agencies</button>
      <button class="who-tab" role="tab" id="wt-developers" aria-controls="wp-developers" aria-selected="false" tabindex="-1">Developers</button>
    </div>
    <div class="who-panel" role="tabpanel" id="wp-agencies" aria-labelledby="wt-agencies">
      <div class="copy">
        <h3>Your brand on every listing, within 24 hours.</h3>
        <p class="body muted">We build your agency's template set once. After that, send the listing info and get the full pack back within 24 hours.</p>
        <a class="textlink" href="#pack">See the listing pack</a>
      </div>
      <div class="slot r-32" data-slot="who-agencies"><span class="name">IMAGE SLOT: who-agencies<br>Agency template set mockup (La Pineta or Sabdia)</span></div>
    </div>
    <div class="who-panel" role="tabpanel" id="wp-developers" aria-labelledby="wt-developers" hidden>
      <div class="copy">
        <h3>A brand your project can sell from.</h3>
        <p class="body muted">One build for one project: identity, brochure, signage and launch assets, designed around your renders.</p>
        <a class="textlink" href="#developer">See the developer build</a>
      </div>
      <div class="slot r-32" data-slot="who-developers"><span class="name">IMAGE SLOT: who-developers<br>Developer project identity (Six Marbella or Sabdia)</span></div>
    </div>
  </div>
</section>

<!-- 2. WHAT'S IN A LISTING PACK -->
<section id="pack" class="tint">
  <div class="wrap">
    <div class="head"><h2>One listing in. Four pieces out.</h2></div>
    <div class="sync">
      <div class="sync-stage" aria-hidden="true">
        <div class="stack">
          <div class="frame on" data-i="0"><div class="slot r-23" style="width:70%"><span class="sample">Sample pack</span><span class="name">IMAGE SLOT: pack-signboard<br>Casa Palmera signboard 600 x 900 mm<br>Waiting on rebuild without status wording</span></div></div>
          <div class="frame" data-i="1"><div class="slot r-a4" style="width:86%"><span class="sample">Sample pack</span><span class="name">IMAGE SLOT: pack-a4-flyer<br>Casa Palmera A4 cover<br>Waiting on rebuild without status wording</span></div></div>
          <div class="frame" data-i="2"><div class="slot r-45" style="width:90%"><span class="sample">Sample pack</span><span class="name">IMAGE SLOT: pack-ig-post<br>Casa Palmera Instagram post 1080 x 1350<br>Waiting on rebuild without status wording</span></div></div>
          <div class="frame" data-i="3"><div class="slot r-916" style="width:56%"><span class="sample">Sample pack</span><span class="name">IMAGE SLOT: pack-ig-story<br>Casa Palmera Instagram story 1080 x 1920<br>Waiting on rebuild without status wording</span></div></div>
        </div>
      </div>
      <ol class="sync-steps">
        <li class="on" data-i="0">
          <div class="slot r-23 mobile-slot" style="max-width:260px"><span class="sample">Sample pack</span><span class="name">IMAGE SLOT: pack-signboard</span></div>
          <h3>Signboard, 600 x 900 mm</h3>
          <p class="body muted">Readable from a moving car. The hero photo is cropped by hand every time.</p>
        </li>
        <li data-i="1">
          <div class="slot r-a4 mobile-slot" style="max-width:300px"><span class="sample">Sample pack</span><span class="name">IMAGE SLOT: pack-a4-flyer</span></div>
          <h3>A4 flyer</h3>
          <p class="body muted">Address, price line, features, floorplan and agent details. Empty fields disappear, never print blank.</p>
        </li>
        <li data-i="2">
          <div class="slot r-45 mobile-slot" style="max-width:320px"><span class="sample">Sample pack</span><span class="name">IMAGE SLOT: pack-ig-post</span></div>
          <h3>Instagram post, 1080 x 1350</h3>
          <p class="body muted">A portrait crop made by hand, not by software.</p>
        </li>
        <li data-i="3">
          <div class="slot r-916 mobile-slot" style="max-width:220px"><span class="sample">Sample pack</span><span class="name">IMAGE SLOT: pack-ig-story</span></div>
          <h3>Instagram story, 1080 x 1920</h3>
          <p class="body muted">Its own 9:16 crop, kept clear of the phone's buttons.</p>
        </li>
      </ol>
    </div>
    <p class="caption">Listing pack built from the Casa Palmera brand we designed for Sabdia Properties.</p>
  </div>
</section>

<!-- 3. HOW IT WORKS: 24-HOUR RAIL -->
<section id="how">
  <div class="wrap">
    <div class="head"><h2>Listing info today. Pack within 24 hours.</h2></div>
    <div class="rail" id="rail">
      <div class="track"></div><div class="fill"></div><div class="dash"></div>
      <ol>
        <li><span class="node"></span><span class="label time">0h</span><h3>You send the listing info</h3></li>
        <li><span class="node"></span><span class="label time">Within 24h</span><h3>We design the full pack</h3></li>
        <li><span class="node"></span><span class="label time">By 24h</span><h3>Your pack arrives for review</h3></li>
        <li class="after"><span class="node"></span><span class="label time">Next</span><p>Your agent signs off the copy</p></li>
        <li class="after"><span class="node"></span><span class="label time">Next</span><p>Your printer prints and delivers on their timeline</p></li>
      </ol>
    </div>
  </div>
</section>

<!-- 4. GUARANTEE -->
<section class="dark guarantee">
  <div class="wrap">
    <p class="big">Your first listing pack's production is free with every build. After that, every pack arrives within 24 hours of the listing info, or it's free.</p>
    <a class="cta" href="/contact">Send your first listing</a>
  </div>
</section>

<!-- 5. PLANS BY TEAM SIZE -->
<section id="plans" class="tint plans">
  <div class="wrap">
    <div class="head"><h2>Plans by team size.</h2></div>
    <p class="plans-lead body">Your price depends on one thing: how many agents are on your team.</p>
    <div class="seg" role="tablist" aria-label="Team size">
      <button role="tab" id="pt-0" aria-controls="pp-0" aria-selected="true">Solo agent</button>
      <button role="tab" id="pt-1" aria-controls="pp-1" aria-selected="false" tabindex="-1">2 to 5 agents</button>
      <button role="tab" id="pt-2" aria-controls="pp-2" aria-selected="false" tabindex="-1">6+ agents</button>
    </div>
    <div class="plan-panel" role="tabpanel" id="pp-0" aria-labelledby="pt-0"><h3>Solo agent</h3><p class="body muted">Your agency build, then pay per listing pack. No monthly fee.</p></div>
    <div class="plan-panel" role="tabpanel" id="pp-1" aria-labelledby="pt-1" hidden><h3>2 to 5 agents</h3><p class="body muted">Your agency build, plus a monthly plan with 3 listing packs. Extra packs when you need them. Resets every month.</p></div>
    <div class="plan-panel" role="tabpanel" id="pp-2" aria-labelledby="pt-2" hidden><h3>6+ agents</h3><p class="body muted">Your agency build, plus unlimited listing packs every month. Cancel anytime.</p></div>
    <p class="plans-note">Every plan: first listing pack's production free. Every pack within 24 hours of the listing info, or it's free. Printing runs on your printer's timeline.</p>
    <a class="cta" href="/contact">Ask for pricing</a>
  </div>
</section>

<!-- 6. DEVELOPER BUILD -->
<section id="developer">
  <div class="wrap">
    <div class="head"><h2>The developer build.</h2></div>
    <div class="dev">
      <div class="acc" id="acc">
        <div class="acc-item"><button class="acc-btn sel" id="ab-0" aria-pressed="true" data-i="0">Project identity</button></div>
        <div class="acc-item"><button class="acc-btn sel" id="ab-1" aria-pressed="false" data-i="1">Brochure</button></div>
        <div class="acc-item"><button class="acc-btn sel" id="ab-2" aria-pressed="false" data-i="2">Site signage and hoarding</button></div>
        <div class="acc-item"><button class="acc-btn sel" id="ab-3" aria-pressed="false" data-i="3">Display suite materials</button></div>
        <div class="acc-item"><button class="acc-btn sel" id="ab-4" aria-pressed="false" data-i="4">Project website</button></div>
        <div class="acc-item"><button class="acc-btn sel" id="ab-5" aria-pressed="false" data-i="5">Launch campaign assets</button></div>
        <div class="acc-item"><button class="acc-btn" id="ab-6" aria-expanded="false" aria-controls="ap-6" data-i="6">Render direction<span class="plus"></span></button><div class="acc-panel" id="ap-6" role="region" aria-labelledby="ab-6"><div><p>We brief and manage the render studio. You approve every shot.</p></div></div></div>
        <p class="after body muted">One-time build per project. No ongoing fees.</p>
      </div>
      <div class="dev-stage" aria-hidden="true">
        <div class="frame on" data-i="0"><div class="slot r-43"><span class="name">IMAGE SLOT: dev-identity<br>Casa Palmera or Haven identity (Sabdia Properties)</span></div></div>
        <div class="frame" data-i="1"><div class="slot r-43"><span class="name">IMAGE SLOT: dev-brochure<br>Six Marbella or La Pineta brochure spread</span></div></div>
        <div class="frame" data-i="2"><div class="slot r-43"><span class="name">IMAGE SLOT: dev-signage<br>Signage or hoarding for a Sabdia project</span></div></div>
        <div class="frame" data-i="3"><div class="slot r-43"><span class="name">IMAGE SLOT: dev-display-suite<br>Display suite materials, La Pineta mockup</span></div></div>
        <div class="frame" data-i="4"><div class="slot r-43"><span class="name">IMAGE SLOT: dev-website<br>Project website mockup</span></div></div>
        <div class="frame" data-i="5"><div class="slot r-43"><span class="name">IMAGE SLOT: dev-launch<br>Launch campaign assets</span></div></div>
        <div class="frame" data-i="6"><div class="slot r-43"><span class="name">IMAGE SLOT: dev-renders<br>Render direction example</span></div></div>
      </div>
    </div>
  </div>
</section>

<!-- 7. COMPLIANCE -->
<section class="tint">
  <div class="wrap">
    <div class="head"><h2>Built for Queensland and New South Wales rules.</h2></div>
    <ul class="three">
      <li><p class="body">Price lines show a number, Contact Agent, Auction or Price Guide. Nothing else.</p></li>
      <li><p class="body">AI photo edits and virtual staging are labelled on the image itself.</p></li>
      <li><p class="body">We only use features the listing states. Your agent signs off the copy before anything prints.</p></li>
    </ul>
  </div>
</section>

<!-- 8. FAQ -->
<section id="faq">
  <div class="wrap">
    <div class="head"><h2>Questions agents ask.</h2></div>
    <div class="faq">
      <details><summary>What do you need from us?<span class="plus"></span></summary><p>Photos, the listing copy, the price wording and the agent's details. That's it.</p></details>
      <details><summary>How fast is a pack?<span class="plus"></span></summary><p>Within 24 hours of receiving the listing info. If it's late, that pack is free.</p></details>
      <details><summary>Do you print?<span class="plus"></span></summary><p>We can arrange printing. It's charged separately and your printer sets the print and delivery timing.</p></details>
      <details><summary>Do you use AI on photos?<span class="plus"></span></summary><p>Only when you ask, and every edited or virtually staged image is labelled.</p></details>
      <details><summary>Who writes the property description?<span class="plus"></span></summary><p>We use only what the listing states. Your agent signs off before print.</p></details>
      <details><summary>Can we cancel?<span class="plus"></span></summary><p>The 6+ agent plan can be cancelled anytime.</p></details>
      <details><summary>Do you work with developers?<span class="plus"></span></summary><p>Yes. One build per project, no ongoing fees.</p></details>
      <details><summary>Where are you based?<span class="plus"></span></summary><p>Gifu, Japan. One hour behind Brisbane, so we work your business day.</p></details>
    </div>
  </div>
</section>

<!-- 9. FINAL CTA -->
<section class="tint final">
  <div class="wrap">
    <h2>Send one listing. See your pack.</h2>
    <a class="cta" href="/contact">Send a listing</a>
  </div>
</section>

</div>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What do you need from us?","acceptedAnswer":{"@type":"Answer","text":"Photos, the listing copy, the price wording and the agent's details. That's it."}},
{"@type":"Question","name":"How fast is a pack?","acceptedAnswer":{"@type":"Answer","text":"Within 24 hours of receiving the listing info. If it's late, that pack is free."}},
{"@type":"Question","name":"Do you print?","acceptedAnswer":{"@type":"Answer","text":"We can arrange printing. It's charged separately and your printer sets the print and delivery timing."}},
{"@type":"Question","name":"Do you use AI on photos?","acceptedAnswer":{"@type":"Answer","text":"Only when you ask, and every edited or virtually staged image is labelled."}},
{"@type":"Question","name":"Who writes the property description?","acceptedAnswer":{"@type":"Answer","text":"We use only what the listing states. Your agent signs off before print."}},
{"@type":"Question","name":"Can we cancel?","acceptedAnswer":{"@type":"Answer","text":"The 6+ agent plan can be cancelled anytime."}},
{"@type":"Question","name":"Do you work with developers?","acceptedAnswer":{"@type":"Answer","text":"Yes. One build per project, no ongoing fees."}},
{"@type":"Question","name":"Where are you based?","acceptedAnswer":{"@type":"Answer","text":"Gifu, Japan. One hour behind Brisbane, so we work your business day."}}
]}
</script>`

function setup(root: any): () => void {

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Generic roving-tabindex tablist (sections 1 and 5) */
  function tabs(listSel, tabSel, panelPrefix){
    var list = root.querySelector(listSel); if(!list) return;
    var t = [].slice.call(list.querySelectorAll(tabSel));
    function pick(i: number, focus?: boolean){
      t.forEach(function(b, j){
        var on = i === j;
        b.setAttribute('aria-selected', on);
        b.tabIndex = on ? 0 : -1;
        var p = root.querySelector('#'+b.getAttribute('aria-controls'));
        if(p) p.hidden = !on;
      });
      if(focus) t[i].focus();
    }
    t.forEach(function(b, i){
      b.addEventListener('click', function(){ pick(i); });
      b.addEventListener('keydown', function(e){
        var k = e.key, n = t.length;
        if(k === 'ArrowRight' || k === 'ArrowDown'){ e.preventDefault(); pick((i + 1) % n, true); }
        else if(k === 'ArrowLeft' || k === 'ArrowUp'){ e.preventDefault(); pick((i - 1 + n) % n, true); }
        else if(k === 'Home'){ e.preventDefault(); pick(0, true); }
        else if(k === 'End'){ e.preventDefault(); pick(n - 1, true); }
      });
    });
  }
  tabs('.who-tabs', '.who-tab');
  tabs('.seg', 'button');

  /* Section 2: scroll sync */
  var steps = [].slice.call(root.querySelectorAll('.sync-steps li'));
  var frames = [].slice.call(root.querySelectorAll('.sync-stage .frame'));
  function setSync(i){
    steps.forEach(function(s, j){ s.classList.toggle('on', i === j); });
    frames.forEach(function(f, j){ f.classList.toggle('on', i === j); });
  }
  function syncCheck(){
    var mid = window.innerHeight * 0.5, best = 0, bd = 1e9;
    steps.forEach(function(s, i){
      var r = s.getBoundingClientRect(), d = Math.abs((r.top + r.height / 2) - mid);
      if(d < bd){ bd = d; best = i; }
    });
    setSync(best);
  }

  /* Section 3: rail */
  var rail = root.querySelector('#rail');
  var nodes = rail ? [].slice.call(rail.querySelectorAll('.node')) : [];
  function layoutRail(){
    if(!rail) return;
    var vertical = window.matchMedia('(max-width:900px)').matches;
    var rr = rail.getBoundingClientRect();
    function c(n){ var r = n.getBoundingClientRect(); return vertical ? (r.top + r.height / 2 - rr.top) : (r.left + r.width / 2 - rr.left); }
    rail.style.setProperty('--s', c(nodes[0]) + 'px');
    rail.style.setProperty('--e', c(nodes[2]) + 'px');
    rail.style.setProperty('--t', c(nodes[4]) + 'px');
  }
  function railCheck(){
    if(!rail) return;
    var p = 1;
    if(!reduce){
      var r = rail.getBoundingClientRect(), vh = window.innerHeight;
      p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (Math.max(r.height, 200) + vh * 0.2)));
    }
    rail.style.setProperty('--p', p);
    for(var i = 0; i < 3; i++) nodes[i].classList.toggle('lit', p >= i * 0.5 - 0.001);
  }

  /* Section 6: accordion + image swap */
  var acc = root.querySelector('#acc');
  var dframes = [].slice.call(root.querySelectorAll('.dev-stage .frame'));
  if(acc){
    var btns = [].slice.call(acc.querySelectorAll('.acc-btn'));
    function show(i){ dframes.forEach(function(f, j){ f.classList.toggle('on', j === i); }); }
    btns.forEach(function(b, i){
      b.addEventListener('click', function(){
        if(b.classList.contains('sel')){
          btns.forEach(function(x){ if(x.classList.contains('sel')) x.setAttribute('aria-pressed', x === b); else x.setAttribute('aria-expanded', 'false'); });
        } else {
          var open = b.getAttribute('aria-expanded') === 'true';
          btns.forEach(function(x){ if(x.classList.contains('sel')) x.setAttribute('aria-pressed', 'false'); else x.setAttribute('aria-expanded', 'false'); });
          if(!open) b.setAttribute('aria-expanded', 'true');
        }
        show(i);
      });
      b.addEventListener('keydown', function(e){
        var n = btns.length;
        if(e.key === 'ArrowDown'){ e.preventDefault(); btns[(i + 1) % n].focus(); }
        if(e.key === 'ArrowUp'){ e.preventDefault(); btns[(i - 1 + n) % n].focus(); }
      });
    });
  }

  var raf = 0;
  function onScroll(){ if(raf) return; raf = requestAnimationFrame(function(){ raf = 0; syncCheck(); railCheck(); }); }
  var onResize = function(){ layoutRail(); onScroll(); };
  var onLoad = function(){ layoutRail(); syncCheck(); railCheck(); };
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onResize);
  window.addEventListener('load', onLoad);
  layoutRail(); syncCheck(); railCheck();
  return function(){
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('load', onLoad);
    if(raf) cancelAnimationFrame(raf);
  };
}

export default function ServicesSections(props: { html?: string }) {
    const ref = React.useRef<HTMLDivElement>(null)
    const html = props.html && props.html.trim() ? props.html : HTML

    React.useEffect(() => {
        if (typeof document === "undefined") return
        if (!document.querySelector('link[data-mz-poppins]')) {
            const l = document.createElement("link")
            l.rel = "stylesheet"
            l.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap"
            l.setAttribute("data-mz-poppins", "1")
            document.head.appendChild(l)
        }
        const el = ref.current
        if (!el) return
        return setup(el)
    }, [html])

    return (
        <div style={{ width: "100%" }}>
            <style>{CSS}</style>
            <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    )
}

ServicesSections.defaultProps = { html: "" }

addPropertyControls(ServicesSections, {
    html: {
        type: ControlType.String,
        title: "HTML",
        displayTextArea: true,
        description: "Leave empty to use the built-in sections. Paste edited markup here to override.",
    },
})
