# Services page: image + decision handoff

From the Claude Code session that owns the listing-pack pipeline (2026-11-19). The Framer/TSX session reads this and does the embed. Public repo: no prospect, outreach, price or key data in here.

## Images now in `framer/services/img/`
All real Miyabi/Sabdia/La Pineta/Six Marbella work. Nothing AI-generated, cropped, or edited to hide wording. Native aspect ratios kept; slots should use `object-fit: cover`.

| Slot key | File | Size | What it is |
|---|---|---|---|
| `signboard` | `casa-palmera-signboard.webp` | 1000x1495 | Casa Palmera signboard, Palm Springs style (unchanged) |
| `a4` | `casa-palmera-a4-cover.webp` | 1000x1404 | **Rebuilt.** A4 cover with "Sabdia Constructions" + logo restored, no status wording |
| `post` | `casa-palmera-ig-post.webp` | 1080x1350 | IG post (unchanged) |
| `story` | `casa-palmera-ig-story.webp` | 810x1440 | IG story (unchanged) |
| `who-agencies` | `who-agencies.webp` | 1600x1067 (3:2) | La Pineta brochure + Instagram post on one surface: the "set" an agency gets |
| `who-developers` | `who-developers.webp` | 1600x1067 (3:2) | Blanc (Sabdia) project brochure spread on dark marble |
| `dev-identity` | `dev-identity.webp` | 1600x1067 (3:2) | Casa Palmera logo, gold foil on textured stock |
| `dev-brochure` | `dev-brochure.webp` | 1600x1200 (4:3) | Six Marbella brochure, inside spread + cover |
| `dev-signage` | `dev-signage.webp` | 1600x1067 (3:2) | Sabdia site hoarding on a street |
| `dev-display-suite` | `dev-display-suite.webp` | 1600x1067 (3:2) | La Pineta display materials (magazine spreads) |
| `dev-website` | `dev-website.webp` | 1600x1067 (3:2) | Casa Palmera website + phone + print mockup |
| `dev-launch` | `dev-launch.webp` | 1600x1067 (3:2) | Casa Palmera launch brochure on a shelf |

The `dev-stage` slots are `r-43` (4:3). Only `dev-brochure` is natively 4:3; the rest are 3:2, so `cover` trims a little off the sides. If that clips anything, switch those slots to `r-32` or `object-fit: contain`. `dev-renders` has no image: "Render direction" is the expander only, as specified.

## Decisions (made at the owner's discretion)
1. **"Built by Sabdia Constructions" on the A4 cover: RESTORED.** The other three images already carry the agency name, so the cover was the odd one out. Rebuilt from the Casa Palmera dry run with status blank and agent set. Visually checked: no "For Sale", "Just Listed" or "Contact Agent" anywhere on the cover. Pipeline change: `_tools/brochure_pack.py --no-status` (blanks the status line; default behaviour for real listings is unchanged).
2. **Old "Services introduction" in Framer: KEEP HIDDEN.** Visible: No on all four breakpoints, so it has no live effect, and hiding is reversible. Delete later once the page is signed off.
3. **FAQ headline "Questions agents ask.": KEEP.** It matches the agency-first plans section and the page voice. Developers are covered by the "Do you work with developers?" question.
4. **Developer-build panels: leave as they are.** Six are image-only by design (the label is the copy). "Render direction" keeps its one sentence ("We brief and manage the render studio. You approve every shot."). Adding copy to the other five would make the accordion uneven.
5. **Desktop 1462px live check: still the owner's.** Needs a wide display. Checklist: sticky pack stage switching, 24-hour rail animation, tabs and FAQ, all four Casa Palmera images show, no duplicate old sections.

## What the listing pack delivers (for copy and captions)
One listing in, within 24 hours out:
- **Signboard**, 600 x 900 mm, print-ready PDF (CMYK) with bleed
- **A4 brochure**, 4 pages: cover, the residence, features and gallery, back page with agent contact
- **Instagram post**, 1080 x 1350
- **Instagram story**, 1080 x 1920, plus an animated story video (about 14 seconds, MP4)
- **Email (EDM)**, HTML, in the same style
All five come in the agency's own template, in one of five elevation styles (Hamptons, Prestige, Modern, Palm Springs and one more). Printing runs on the agency's printer's timeline.

## Still open on the Miyabi side (not needed for this page)
- Palm Springs chip in the free pack form and its carousel card: planned for tomorrow.
- Rules unchanged: never publish Framer, no prices, no em dashes, Miyabi Red only on the 雅 mark and CTA buttons, Poppins only.
