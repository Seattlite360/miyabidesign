# Brief: intake, facts, assets, checklist

## The eight questions (one AskUserQuestion round)

1. **Vibe.** Two or three words plus one reference site (Sylva: "warm & editorial", ERA Residence).
2. **Journey.** What the visitor sees, in order. Default: lot → structure → finished tower →
   residence → architecture → living → gallery → location → builder → register.
3. **Energy.** Calm throughout? Default: "motion that whispers", one long slow hero build.
4. **The one feeling.** Default: "I have to walk through this home."
5. **Signature.** Something no site they have seen does. Default: the datum line counting the
   real storeys as the tower rises.
6. **Palette direction.** Their reference image (moodboard, material photo). Light or dark? Default
   light and warm.
7. **Type.** Any official brand fonts? Licences owned? Default the OFL pairing in playbook.md.
8. **Assets.** Logo artwork (lockups, tagline), hero renders from one camera (empty lot, under
   construction, finished), interiors, founder portrait, any real photography.

Autonomous run: answer them yourself from the user's messages, quote the user where they said
it, mark the rest *(inferred)*, and save as `BRIEF.md` next to the build.

## Facts to collect (two sources per number)

- Address, suburb, city; working project name (check it doesn't collide with a nearby project)
- Storeys, number of homes, bedroom mix, site area, retail/ground floor, rooftop/amenities
- Architect, developer, builder; development application status
- Neighbours and landmarks (heritage buildings, river, parks), transport (ferry, rail, bus)
- Developer's story: founder, background, years, portfolio size, named past projects
- What is NOT public (floor plans, pricing, release dates): say "registered buyers hear first"
  instead of inventing it

Record any claim you dropped and why (Sylva: "first Brisbane development" dropped because
newer reports named an earlier one).

## Client prompt template (fill and keep as the build's source of truth)

```
Build a landing page for <NAME>, a <type> at <address>. Internal proof of concept for Miyabi
Design, shown during pitches so the developer sees the finished page before paying.
Goal: leave the viewer feeling "I have to walk through this home."

Decided, build from this:
1. Name: <working name> (collision check: <result>)
2. Logo: supplied artwork only (<files>), traced, never typeset. Official font: <font or none>.
3. Palette: <tokens with hex>, sampled from <reference>. Light only: <yes/no>.
4. Type: <display> + <body> (+ <tagline face>), licences: <OFL / owned / trial>.
5. Art direction: full-bleed, photography-led, editorial, not real-estate stock.
6. Reference: <site>. Motion grammar: Lenis + GSAP ScrollTrigger scrubbed reveals,
   data-reveal h/p/line/ctn, layered parallax, a real slider for galleries, ONE horizontal
   pin (location), a recurring motif, a branded preloader, reduced-motion path.
7. Hero: scroll-craft scrub from the empty lot to the finished tower using <renders>.

Hard constraints: no Inter/Poppins/Manrope/Fraunces/Instrument Serif as a main face; no stock
imagery; AI images labelled; zero em dashes; no fake statistics or placeholder names; every
animation motivated; prefers-reduced-motion respected.
```

## The $10K checklist (score the plan before code, the page after)

Show both as pass / weak / missing tables with one-line reasons. Don't round up. Say what is out
of scope (e.g. no real photography yet) instead of calling it resolved.

**01 Taste**
1. Point of view, not a template: one clear idea the whole page commits to.
2. Typography that does work: display face at real scale and contrast; body width used on purpose.
3. A restrained color system: one accent carrying the brand, nothing competing.
4. Hierarchy that breathes: an obvious path, one heading per section.

**02 Substance**
5. Imagery with intent: does the "walk through this home" job (interiors), labelled if AI.
6. Motion that whispers: every move motivated, scored against the reference's real system.

**03 Felt quality**
7. Mobile designed, not shrunk: portrait hero clip, vertical location walk, thumb-size targets.
8. The invisible expensive stuff: preloader tied to real loading, visible focus, reduced motion,
   form states, no layout shift, nothing that reads as draft.
