# Sylva Residences — Adobe Illustrator Setup

Everything here is generated straight from `../sylva-palette-type-spec.md` — the values are
guaranteed to match the brief, no retyping hex codes by hand.

A real `.ai` file is a proprietary binary Illustrator itself has to write — it can't be
authored outside the app. Instead, this kit uses the two formats Illustrator opens and imports
natively, so opening any of these gives you a live, editable Illustrator document:

## 1. Install the fonts first

Before opening anything below, install these from Google Fonts (also linked in
`../sylva-palette-type-spec.md`):

- [Manrope](https://fonts.google.com/specimen/Manrope) — need the ExtraBold (800) weight
- [Poppins](https://fonts.google.com/specimen/Poppins) — need the Light (300) weight
- [Newsreader](https://fonts.google.com/specimen/Newsreader) — need Light (300) Italic

If a font isn't installed when you open one of the `.svg` files, Illustrator will flag it as
missing and substitute — the text stays live and editable, it'll just look wrong until the
real font is installed and the substitution warning is resolved (Illustrator does this per
document on open).

## 2. Load the palette

Two options, use whichever fits the workflow:

- **`../assets/swatches/Sylva-Palette.ase`** — the standard route. In Illustrator:
  Swatches panel → panel menu (top-right) → **Open Swatch Library → Other Library…** → select
  the file. Loads two groups, "Sylva - Light" and "Sylva - Dark," as named global swatches.
  `Sylva-Palette-Light.ase` / `Sylva-Palette-Dark.ase` are the same thing split out, if you only
  want one mode loaded.
- **`sylva-setup.jsx`** — run via **File → Scripts → Other Script…** on an open document. Adds
  the same nine tokens per mode directly into that document's own Swatches panel (as globals,
  not spot inks) and creates three artboards sized to match the templates below. Safe to
  re-run — it skips swatches that already exist by name instead of duplicating them.

Either way, swatch names are the token names from the spec (`Stone`, `Ink`, `Copper`, …) so
they read the same in Illustrator as everywhere else in the brief.

## 3. Open the templates

Each is a standalone SVG — File → Open in Illustrator, or drag onto the Illustrator icon. Text
is live (not outlined), fills use the exact hex values from the spec, and each is sized to one
artboard so it drops straight into a multi-artboard working file if you copy/paste it in.

| File | Contents | Size |
|---|---|---|
| `Sylva-Wordmark-Lockup-Light.svg` | SYLVA / RESIDENCES lockup, Stone background — the recommended pairing from the brief | 1200 × 800 |
| `Sylva-Wordmark-Lockup-Dark.svg` | Same lockup reversed for dark grounds, using the dark-mode token values (not a plain color invert) | 1200 × 800 |
| `Sylva-Palette-Sheet.svg` | All nine tokens, light and dark, swatch + name + hex — a visual cross-check against the .ase libraries | 1200 × 800 |
| `Sylva-Type-Specimen.svg` | One sample per type role: wordmark, tracked caps, editorial italic, body copy | 1200 × 1000 |

## 4. Bring in the reference renders

`../assets/renders/` is a placeholder — the two AI-generated mood renders referenced in the
brief (`sylva-render-01.png`, `sylva-render-02.png`) weren't retrievable as files in the
session that built this kit (they came through as pasted images, not uploads). Drop the actual
files into that folder, then place them onto a working artboard for the art-direction pass —
full-bleed, dark gradient overlay for text legibility, per the brief's art-direction section.

**Compliance reminder from the brief:** both renders are AI-generated. Any use in front of
John needs the same AI-disclosure label used elsewhere in the pitch.

## What's not decided yet

Per `../00-status-and-handoff.md`: the Manrope/Poppins pairing here is a recommendation, not a
final lock, and "Sylva Residences" isn't IP Australia–cleared. Don't treat anything built from
this kit as final-for-print until both of those close out.
