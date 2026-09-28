---
name: miyabi-website-design-skill
description: >
  Miyabi Design's method for a luxury real-estate landing page that a developer sees
  during a pitch: an editorial, ERA Residence-grade single page whose hero builds the
  tower on the empty lot as you scroll (scroll-craft), with interiors-first imagery,
  the client's own traced logo, a switchable palette/type system, verified facts,
  human copy, and an unlisted Netlify link to share. Distilled from the Sylva
  Residences build (sylva/ in this repo), with a working template and scripts. Use for
  "build a landing page for this development", "property / apartment / residences
  website", "pitch site for a developer", "do what we did for Sylva", or any new
  Miyabi real-estate page.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion, WebSearch, WebFetch, Skill
---

# miyabi-website-design-skill

One page that makes a developer feel "I have to walk through this home", built fast
enough to show in a sales pitch before they have paid for anything. The finished
reference is `sylva/` in the Miyabi repo; `template/` here is that build's code.

**Output:** a static folder (HTML, CSS, JS, no build step) plus a before/after $10K
checklist, a screenshot strip, and a share link.

## Non-negotiables (each one cost a revision on Sylva)

1. **Never reinvent the logo.** Trace the supplied artwork (`scripts/trace_logo.py`) and
   use it as `<img>` SVG files. Never set the wordmark in type. If live type is unavoidable,
   use the brand's official font only.
2. **One typeface per line.** No emphasis words in a second face or italic mid-line.
3. **Light, warm grounds. No black, and never brown-on-black.** Creams, one metal accent
   (copper), greens for depth. The darkest tone is a deep green, not #000. White on a
   dark band is fine.
4. **Interiors first.** Exteriors get used up by the hero. Galleries and "living" sections
   lead with interiors; add at most one exterior detail.
5. **Every fact verified, every image labelled.** No invented numbers. AI renders carry an
   "AI-generated visualisation" tag. Drop any claim newer sources contradict.
6. **Zero em dashes. Human copy.** Run the humanizer pass on every string (see
   `references/playbook.md` §Copy).
7. **Licence-clean.** Final fonts SIL OFL and self-hosted, so nothing to buy and identical on
   every device. Personal-use fonts and third-party photos never enter a public repo
   (git-ignore them, deploy from the local folder).
8. **Keep versions switchable.** Every palette or type pairing the client has seen stays
   reachable by `?palette=` / `?type=`. "Go back to the old colours" is one attribute.
9. **Motion whispers.** Every animation maps to hierarchy, story, feedback or state.
   `prefers-reduced-motion` gets a full path (ERA Residence has none: beat it).

## Workflow

### 1. Intake (ask, don't guess, unless told to run autonomously)
Use `references/brief.md`: the eight questions, the facts to collect, the assets list.
Ask everything in one AskUserQuestion round. If the user says "work autonomously", write
the answers yourself, mark each *(inferred)*, and save them as the build's BRIEF.md.

### 2. Facts
WebSearch the address + developer + "development application". Collect storeys, homes,
bedroom mix, site area, architect, neighbours, transport, the developer's story and
portfolio. Two sources per number. If the network blocks a site, use search summaries
and tell the user; ask them to send files, not links.

### 3. Scaffold
```bash
bash .claude/skills/miyabi-website-design-skill/scripts/new-site.sh <slug>
```
The template is the whole Sylva page, working: hero act, reveals, parallax, motifs,
slider, one horizontal location pin, nav, form, preloader, reduced-motion path.
You change content, tokens and assets, not the machinery.

### 4. Brand
- Logo: `python3 scripts/trace_logo.py art.png img/logo/logo-horizontal.svg --box x0,y0,x1,y1 --colors "#..,#.." --light "#FBF7EF"`
  Do the same for `logo-stacked.svg`. Crop the tagline out and set it in live type. Always pass
  `--colors` sampled from the art: auto-detection is only a first guess. Screenshot the result
  next to the source before using it.
- Palette: edit `html[data-palette="a"]` in `css/versions.css`. Sample hexes from the client's
  references, then check contrast (body 4.5:1, links too). Details: `references/playbook.md`.
- Type: default pairing is Marcellus (display) + Lexend Exa (body) + Inter (logo tagline only,
  small, tracked .34em). Offer alternatives as a preview sheet and let the user pick.

### 5. Hero: the building builds itself (scroll-craft)
Invoke the `scroll-craft` skill for the hero act and follow its hard rules. The Miyabi recipe:
- Inputs: renders from one camera position: empty lot, structure, finished (wide versions).
- `python3 scripts/render_build_clip.py master.mp4 <ffmpeg> lot.png structure.png finished.png`
  then scroll-craft's `encode.sh` (desktop CRF 24, plus a portrait mobile crop).
- Paste the printed schedule into `HERO_CLIP` in `js/site.js`; set `storeys` to the real count,
  `ground`/`top` per rise to where the ground line and roof sit in the frame.
- Desktop opens on the full lot panorama (`img/stage-01-site.webp`) and narrows onto the clip
  frame. In `site.js` set `LOT` to that image's size, the push-in focus in its pixels, and
  `frame0X = (LOT.w - LOT.h * clipW / clipH) / 2` (the default centre crop). Reduced motion swaps
  stills from `STAGE_SRC` instead of playing the clip.
- Signature move: the datum line, a 1px accent rule that rides the wipe edge counting levels.
- Cues: intro line, one caption per stage (overlapping ~15%), then the logo, tagline, three
  real numbers and one CTA.

### 6. Sections (ERA grammar, in this order)
Residence (facts grid) · Architecture (one detail image) · Living (interior-led rows) ·
Gallery (real slider, interiors first) · Location (the only horizontal pin) · Builder (dark
band, founder portrait) · Register (form with loading, success and error states) · Footer
(disclaimer). Reveal attributes: `data-reveal="h|p|line|ctn"`, `data-parallax="img-in"`,
`data-motif`. Full contract in `references/playbook.md`.

### 7. Copy
Write from the facts only, then run the humanizer (invoke it if installed; otherwise apply
`references/playbook.md` §Copy). Then:
```bash
bash scripts/check-leftovers.sh <site>      # template facts, dashes, slop words, alt text, missing files
```
It must print `Clean.` before anyone sees the page.

### 8. Verify (bounded: one pass, one fix batch, one confirm)
Score the plan before building and the page after, with the $10K checklist
(`references/brief.md`). Then `scripts/lab.sh` + `scripts/pageshots.mjs` at 1440×900, 390×844
and reduced motion, plus scroll-craft's `shoot.mjs` for the hero. Look at every shot. Say
plainly what isn't tested (real iPhone, Low Power Mode).

### 9. Ship
`references/ship.md`: Netlify draft, then `--prod` for a stable URL; add private assets
locally before deploying; tell the user the link is unlisted, not private.

## Files

| Path | What |
|---|---|
| `template/` | The working page: `index.html`, `css/site.css` (system), `css/versions.css` (palette/type versions), `js/site.js` (all motion), `vendor/` (GSAP, ScrollTrigger, SplitText, Lenis, scroll-craft engine), `fonts/` (OFL) |
| `scripts/new-site.sh` | Scaffold a new site from the template |
| `scripts/trace_logo.py` | Trace supplied logo art into layered SVG (+ light version) |
| `scripts/render_build_clip.py` | Lot → structure → finished scrub clip, prints `HERO_CLIP` |
| `scripts/check-leftovers.sh` | Pre-flight text and asset checks |
| `scripts/lab.sh` | VP9 lab copy + local server for headless verification |
| `scripts/pageshots.mjs` | Whole-page screenshot walk, overflow and console errors |
| `references/brief.md` | Intake questions, fact list, client prompt template, $10K checklist |
| `references/playbook.md` | Palette, type, logo, imagery, motion, section and copy rules, with the reasons |
| `references/ship.md` | Verification detail, deploy, licensing, privacy, known pitfalls |
