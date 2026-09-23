# $10K checklist: Sylva Residences

Scored per the brief's gate (Taste, Substance, Felt quality). The **before** table scores the
plan as it stood once tokens, type and structure were settled, before any page code. The run was
autonomous, so it wasn't shown to Kalebh before the build, as the brief asked. It is recorded here
unchanged from the plan.

## Before (the plan)

| # | Pillar | Score | Why |
|---|---|---|---|
| 1 | Point of view, not a template | Pass | One story: the tower building itself on the lot, in terracotta, bottle green and aqua. |
| 2 | Typography that does work | Pass | Ambroise François at display scale against wide Lexend Exa: real contrast, both licensed. |
| 3 | A restrained color system | Pass | Canopy for CTAs only, Aqua as the single graphic accent, terracotta confined to the mark and the photos. |
| 4 | Hierarchy that breathes | Weak | The page structure existed only on paper. |
| 5 | Imagery with intent | Weak | Three AI renders and no interiors, so the "walk through this home" job leans on one sequence. |
| 6 | Motion that whispers | Weak | Planned against ERA's real system, not yet tuned under a hand. |
| 7 | Mobile, designed not shrunk | Missing | Nothing built yet. |
| 8 | The invisible expensive stuff | Missing | Nothing built yet. |

## After (the built page)

| # | Pillar | Score | Why |
|---|---|---|---|
| 1 | Point of view, not a template | Pass | The hero builds the tower under your scroll. The rest of the page holds that one material story. |
| 2 | Typography that does work | Pass | Display serif at up to 9rem for SYLVA and section heads, italic Ambroise for single stressed words, and Exa's width used for small caps labels. Caveat: Ambroise only loads on the kit's allowed domains. |
| 3 | A restrained color system | Pass | Canopy appears only on CTAs and the builder band. Aqua is the datum line, the river motif, links and the toggle. The night theme swaps tokens, not filters. |
| 4 | Hierarchy that breathes | Pass | One heading per section, eyebrows cut to two, no section counters, generous rhythm. |
| 5 | Imagery with intent | **Weak** | The hero sequence does the emotional job, but the page reuses the same three renders. There are no interiors, so "I have to walk through this home" isn't fully earned. Every image is labelled AI-generated. Out of scope until real renders or photography exist. |
| 6 | Motion that whispers | Pass | One scrubbed build, scrubbed heading reveals, faster line-by-line body copy, subtle parallax, one horizontal moment, a real slider. Each move maps to storytelling or state. Note: the page runs 16 viewport-heights, above scroll-craft's 8 to 14 band. The ERA-style location pin is most of the excess. |
| 7 | Mobile, designed not shrunk | Pass (headless only) | Portrait hero clip with a band scrim, the datum tag moved right, and location becomes a vertical river walk instead of a sideways scroll. **Not tested on a real phone yet.** |
| 8 | The invisible expensive stuff | **Weak** | Done: a preloader tied to real image loading, a full reduced-motion path (ERA has none), visible focus, form validation with loading, success and error states, no layout shift from the Didone fallback. Still weak: the form isn't connected to an inbox (the page says so), the desktop hero clip is 8.2 MB (phones 3.6 MB), and the headers depend on a third-party font kit. |

## Scroll-craft verification (hero act)

`shoot.mjs` on the lab build (VP9 copies of the clips, because headless Chromium ships without
H.264):

- Desktop 1440×900: no dead scroll, the clip keeps moving whenever it is on screen, and every cue
  clears 4.5:1 at its worst frame.
- Phone 390×844: same results.
- Reduced motion: no dead scroll, all cues clear 4.5:1.

Not covered: a real iPhone's video decoder, Low Power Mode and touch scrolling.
