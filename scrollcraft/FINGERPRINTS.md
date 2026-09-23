# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| sylva-hero (Sylva Residences, hero act only) | Chaptered editorial (brief-imposed, ERA Residence) | Fixed minimal bar: wordmark, 5 links, day/night toggle, one CTA (brief deviation from the grammar's margin folio) | `scrub` of an ffmpeg-built clip from three supplied renders, opening on a full-bleed panorama that closes onto a right-hand frame | 1 engine act (scrub, span 4.0) then GSAP flow sections, one horizontal location pin, a slider; 16.2vh total | Register form beside a sticky heading, then footer | Datum line: an Aqua rule rides the clip's rising wipe, counting L01 to L15 (the DA's real storey count) | Photographic (AI renders, labelled) | Static HTML |


---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Datum line / storey counter riding a rising wipe** (sylva-hero). A later build should not reuse a scroll-synced level counter.
- **Panorama clip-path closing onto an off-centre frame before the scrub starts** (sylva-hero).

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
