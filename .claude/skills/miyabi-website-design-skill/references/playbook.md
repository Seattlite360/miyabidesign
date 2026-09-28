# Playbook: the design decisions and why

## Palette

- Tokens are semantic: `--bg --bg-2 --line --text --text-soft --accent --link --cta-bg
  --cta-bg-hover --cta-text --focus --veil-rgb --scrim-rgb --datum --band-* --cap-key-on-photo
  --frame-bg`. Set them per version in `css/versions.css`; never hard-code a colour in a rule.
- Sample hexes from the client's reference image (real pixels), not from memory. Then check:
  body text ≥ 4.5:1 on `--bg`, links ≥ 4.5:1 (darken the accent one step for `--link` if needed),
  CTA text on `--cta-bg` ≥ 4.5:1.
- Kalebh's taste, learned on Sylva: warm creams (#F7F0E4 / #EFE4D2), copper accent (#8C5943,
  lighter #C97F5C over photos), forest and sage greens for depth (#2C3325, #3E4A30, #5A5B40).
  No black. No brown type on near-black grounds. White on a dark green band is fine.
- Scrims under type on photos are tinted with the palette's darkest green (`--scrim-rgb`), radial,
  never flat black.
- Light-only palettes hide the day/night toggle and force `data-theme="day"` (index.html head
  script and `initTheme`). Add the palette name to both regexes when you add a light-only one.
- Adding a version: copy the `palette a` block to `palette b`, change values, add `b` to the
  head-script whitelist. Show the user `?palette=b` and keep `a`.

## Type

- Default final pairing (all SIL OFL, self-hosted in `fonts/`): **Marcellus** for headings, hero
  lines, captions and numbers; **Lexend Exa** 300 for body (its width is the "expensive" cue);
  **Inter** only for the logo tagline at ~.7rem, tracking .34em.
- One face per line from start to end. `em` inherits family and style (already in `site.css`).
- Before proposing a face, check the licence: OFL / owned / personal-use only. Personal-use
  fonts (Elgoc on Sylva) may be previewed, never shipped; licensed files are git-ignored.
- Adobe Fonts kits only work on the kit's allowed domains: another reason to prefer OFL.
- When the user wants options, build a preview sheet (same line set in 4 to 6 candidates),
  screenshot it, let them choose. Never switch the whole page on a guess.

## Logo

- Trace, never redraw: `scripts/trace_logo.py` per lockup (horizontal, stacked, mark), each
  colour a separate layer, `--light` for the one-colour version on dark photos.
- Crop the tagline out of the traced art and set it as live text (`.hero__tag`, `.footer__tag`).
- Use as `<img src="img/logo/…svg">`. External `<use href="sprite.svg#…">` failed to render;
  inline SVG can't be recoloured through `<use>` with class selectors (use custom properties).
- Swap in the designer's original vector files whenever they exist; same filenames.

## Imagery

- Hero renders must share one camera position or the build wipe shows a seam.
- Interiors lead the gallery and the living section; exteriors are the hero's job.
- Every AI image: `.ai-tag` label on it, and a disclaimer line in the footer. If an interior's
  window view isn't the site's, say so in the caption.
- Founder portrait: the client's own photo, git-ignored, with an `onerror` fallback image so the
  page never shows a broken image.
- Export `webp` at ~1800px wide for full-bleed, ~1000px for column images; always set width/height.

## Motion (ERA Residence system, verified against the live site)

| Piece | Template hook | Rule |
|---|---|---|
| Smooth scroll | Lenis driving ScrollTrigger (`site.js` top) | Off under reduced motion |
| Headings | `data-reveal="h"` | Slow, scrubbed, SplitText lines |
| Body | `data-reveal="p"` | Faster, line by line |
| Single lines | `data-reveal="line"` | Short fade/rise |
| Containers | `data-reveal="ctn"` | Fade/rise as a block |
| Parallax | `data-parallax="img-in"` | Subtle; the "expensive" cue, not a moment |
| Motif | `data-motif="river|fins|ripple"` SVG paths | One recurring graphic, drawn differently per section |
| Gallery | `data-slider` | Real slider: dots, progress, current/total, drag, keys. Not scroll-jacked |
| Horizontal | `data-location` | The only scroll-jack on the page; vertical list on phones |
| Preloader | `.preloader` | Logo reveal tied to real image and font loading, hard stop 7 s |
| Hero | `data-sc-act="scrub"` | scroll-craft engine; page code adds panorama narrowing and the datum |

No custom cursor, no magnetic buttons: ERA's polish is scrub timing and slider feel.
Keep total page height near 14 to 16 screens; the location pin is most of it.

## Sections and copy

- Order: hero · residence (facts grid) · architecture · living · gallery · location · builder · register · footer.
- Eyebrows rationed (two at most), no section counters, no "scroll to explore" nudge.
- The hero title cue holds: logo image, tagline, three real numbers, one CTA.
- Footer legal line: concept presentation by Miyabi Design, working name, not affiliated with or
  endorsed by the developer or architect, AI imagery for discussion only, facts from public
  reporting and may change.

### Copy (humanizer rules, applied to every string)
- Say the specific fact, not the adjective: "88 homes, one to three bedrooms", not "luxurious residences".
- No: nestled, boasts, unparalleled, world-class, seamless, curated, elevate, redefine, in the heart
  of, breathtaking, testament, embark, discover. No rule-of-three padding. No rhetorical questions.
- No em or en dashes: rewrite the sentence (use a full stop or comma).
- Short declarative sentences, active voice, Australian spelling for Australian clients.
- Numbers as the source states them; spell out small numbers in prose if it reads better, digits in stats.
