# Sylva Residences landing page (proof of concept)

Internal pitch piece by Miyabi Design for 22-24 Sylvan Road, Toowong (Immerse Projects, BDA
Architecture). Static site, no build step. "Sylva Residences" is a working name.

## Run it

Any static server from this folder, for example:

```bash
cd sylva && python3 -m http.server 4500
# open http://localhost:4500
```

Opening `index.html` straight from disk will not play the hero clip: the scroll-craft engine
fetches it as a Blob, which browsers block on `file://`.

## What drives what

| Part | Mechanism |
|---|---|
| Hero (empty lot to finished tower) | **scroll-craft** engine (`vendor/scrollcraft.*`, untouched). One `scrub` act, span 4.0, clip `media/hero.mp4` (phones: `media/hero-m.mp4`, portrait). Page JS adds the desktop panorama-to-frame narrowing and the datum line. |
| Everything below the hero | GSAP 3 + ScrollTrigger + SplitText, Lenis smooth scroll (the ERA Residence stack). `data-reveal`, `data-parallax`, a real slider, one horizontal scroll moment (location). |
| Day / night | A real theme switch: `data-theme` on `<html>` cascades the palette tokens. Photo swap is wired (`data-src-night`) but no night render exists yet. |
| Reduced motion | No smooth scroll, no pins, no clip fetch. The hero poster swaps stage by stage as the captions change, and the location track becomes a native sideways scroll region. |

## Design versions

Two switches on `<html>` in `index.html`, overrides in `css/versions.css`:

| Switch | Values | Default |
|---|---|---|
| `data-palette` | `v5` creams, Copper, forest greens, light only; `v4` Stone / Copper / Sage / Umber with dark mode; `v3` Paper / Canopy / Aqua (original) | `v5` |
| `data-type` | `v2` Abril Fatface display + Elgoc tagline, `original` Ambroise | `v2` |

Compare without editing anything: `?palette=v4`, `?palette=v3`, `?type=original`, or combine them. To go back for good,
set the attributes on `<html>` to `v3` / `original`. The first build is commit `60b8aa2`.

The logo is never set in type. Nav, hero, preloader and footer use the official lockups in `img/logo/`,
traced from the supplied artwork (`trace_logo.py` reproduces them). Replace them with the original vector
files from the design source whenever those are available; same filenames.
Elgoc is free for personal use only: buy the commercial licence before client or public use. It loads
from a local install first, then from `fonts/elgoc/` (see the README there). Font files in that folder are
git-ignored on purpose: this repo is public and the licence does not allow redistribution.

## Fonts

- **Ambroise Std François** (headers) and **Ambroise Std** italics come from the Adobe Fonts kit
  **`pzu1gsq`** ("Sylva Residences") on Kalebh's account. It is allowed on `localhost`,
  `127.0.0.1`, `*.github.io`, `*.netlify.app`, `*.vercel.app` and `*.framer.app`. **Add the real
  domain at fonts.adobe.com before hosting anywhere else**, or the headers fall back.
- **Lexend Exa** (body) is self-hosted from `fonts/` (SIL OFL).
- **Bodoni Moda** is self-hosted as the Didone stand-in while the kit loads, or if it is blocked.

## The register form

`<form data-endpoint="">` is empty on purpose. With no endpoint the form validates, then says
plainly that this preview isn't connected yet. Put a URL that accepts a JSON `POST` in
`data-endpoint` and it sends `{ name, email, phone, bedrooms, project }`, with loading, success
and error states.

## Rebuilding the hero clip

Source and brief: `scrollcraft/builds/sylva-hero/` (`BRIEF.md`, `render_clip.py`).

```bash
python3 render_clip.py <folder with a.png b_wide.png c_wide.png> out/hero-master.mp4 <ffmpeg>
bash .claude/skills/scroll-craft/scripts/encode.sh out/hero-master.mp4 sylva/media/hero.mp4 desktop 24
# phones: crop=560:1080:319:0 first, then encode.sh ... mobile
```

The wipe schedule in `render_clip.py` is mirrored in `js/sylva.js` (`HERO_CLIP`), and the page's
datum line rides it. Change both together.

## Honest gaps

- All imagery is AI-generated, and labelled as such on the page. Move to real photography and
  renders once the developer supplies them.
- No interiors, floor plans, pricing or release dates exist publicly, so none are shown.
- No night render exists, so the day/night toggle switches the theme but not the photos.
- Tested in headless Chromium at 1440×900 and 390×844, with and without reduced motion. **Not yet
  tested on a real iPhone or Android device.**
