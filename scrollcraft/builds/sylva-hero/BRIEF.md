# Sylva Residences: hero brief

**Self-authored, not interviewed.** Kalebh asked for an autonomous run ("go until this
session's tokens run out or the task is complete", then "please continue"). Every
answer below is taken from his Sylva landing page prompt
(`sylva-landing-page-prompt.md`) and his messages in this session, quoted where he
said it himself. Where the prompt is silent, the answer is marked *(inferred)*.

**Scope.** scroll-craft governs the **hero act only**. Kalebh: "I want the prompt to be
followed strictly but ... for the hero shot i want to use scroll-craft to animate
slowly from empty lot to full built finished luxurious building." The rest of the
page follows the Sylva prompt's ERA Residence system (GSAP + Lenis, data-reveal,
data-parallax, a real slider, one horizontal location section). The skill's hard
rules that improve the whole page (no scroll cue, no section counters, eyebrows
rationed, zero em dashes, no invented numbers) are applied page-wide.

## The eight answers

1. **Vibe.** "warm & editorial"; "Warm materiality (stone, timber)"; "full-bleed,
   photography-led, editorial, not real-estate stock." References: ERA Residence,
   and the La Calma villa moodboard (travertine plaster, walnut, bottle-green water).
2. **Journey.** Empty lot, then the structure, then the finished tower; then who it
   is, what it is made of, how people live there, the views, where it is, who builds
   it, register. *(Hero order is Kalebh's; section order from the prompt's pattern
   table.)*
3. **Energy.** Calm throughout, "motion that whispers." The hero is the one long,
   slow build. *(inferred from "animate slowly")*
4. **Feeling, and the one moment.** Leave the viewer feeling "I have to walk through
   this home." The moment: watching the empty lot become the finished tower under
   their own hand.
5. **Something no site they have seen does.** *(inferred)* The building rises floor
   by floor as you scroll, and a surveyor's datum line rides the rising edge,
   counting the storeys up to the real fifteen.
6. **Distance from premium-minimal.** Editorial premium. "Genuine $10,000+ custom web
   design commission, not a template and not an AI default."
7. **One unbroken world or distinct scenes.** Distinct scenes. Only the hero is one
   continuous shot.
8. **Assets owned.** Three AI renders: empty lot, under construction, finished (each
   of the last two as wide + close-up diptychs). The Sylva identity artwork. No
   footage, no kie.ai key. Route: build the clip from the renders, no generation.

## Feeling curve (hero)

```
1  Recognition   a real place: the river, the skyline, a fenced and empty corner lot, full-bleed
2  Focus         the frame closes from the whole neighbourhood onto the one site
3  Anticipation  the structure rises out of the ground, the datum line counting storeys
4  Awe           the finished terracotta tower rises through it, level 15 reached
5  Resolve       the name arrives beside the building and the page holds on it
```

## The peak

"You scroll and the building literally gets built in front of you, floor by floor."
Lives in the hero act, beats 3 and 4. It has the largest span on the page (4.0
viewport-heights) and the quietest thing before it (the preloader and a still
panorama with one line of type).

## Tell-someone sentence

It's the site where the tower builds itself on the empty lot as you scroll down.

## Authored silence

- Clip time 0 to 0.13: the clip holds on the lot while the page narrows the
  panorama onto the frame. The page is moving (clip-path), so this is not dead scroll.
- Clip time 0.60 to 1.0: slow push-in on the finished tower while the name arrives
  and the stage slides away. Deliberate settle, not a freeze.

## Grammar, gate, signature

- **Grammar:** the page is **Chaptered editorial**, imposed by the brief (ERA
  Residence: hard section changes, flow sections, one lateral moment, a slider).
  Deviation, by brief: ERA's fixed minimal bar with one CTA instead of a margin folio.
  Filmic one-shot lost because only the hero is continuous. Live surface, continuous
  world, typographic poster, gallery, split stage and cutlist each contradict the
  brief's photography-led editorial direction.
- **Signature move:** the datum line. A 1px Aqua rule with a level tag rides the
  rising wipe edge inside the frame, synced to the clip's real playhead, counting
  L01 to L15 (the DA's real storey count).
- **Fingerprint gate:** registry empty, nothing to clear.

## Score (hero act)

| Beat | Device | Why |
|---|---|---|
| Recognition to resolve | `scrub` (one act, span 4.0) | The build is a change of state over time; only a scrubbed clip lets the reader's hand drive it |
| Focus | bespoke clip-path from `--sc-p` | The frame closing is framing, not footage, so it lives in the page, not the clip |
| Stage captions | `cue` crossovers | One line per stage, overlapping ~15% so there is never an empty column |
| Signature | datum line from `video.currentTime` | Rides the baked wipe schedule (mirrored in `render_clip.py` and `sylva.js`) |
