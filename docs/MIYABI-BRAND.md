---
brand: Miyabi Design (雅)
source: https://plum-line-350195.framer.app/
extracted: 2026-08-09
version: 1.0 — baseline extraction from live homepage
confidence: Colors/type pulled from live inline styles + logo pixel-sampling (high confidence). Some values are Framer-generated defaults where the live page didn't expose a custom value (flagged below).
---

## Overview

Miyabi Design (雅 — "elegance/refinement") is a bilingual (EN/JP) graphic design studio based in Gifu, Japan, serving Japan and Australia, specializing in real-estate/property branding, print collateral, logo & identity, and web/social design. The brand's visual center of gravity is a **restrained, editorial black-and-white base** with **one reserved accent: a muted brush-stroke red on the 雅 kanji mark**. Everything else — nav, body copy, section backgrounds — stays neutral (black/white/gray), so the red mark and the portfolio work itself carry all the visual weight. This is a "let the work speak" brand, not a saturated, colorful one.

The tone is confident and competitive without being aggressive: copy leans on phrases like "get noticed, become invaluable" and "make your marketing pop" — practical, benefit-first, small-business-facing. Pricing is transparent and dual-currency (AUD/JPY), aimed at real-world SMB and real-estate clients rather than enterprise.

**Key characteristics:**
- Pure white canvas, near-black text — no cream/warm tint, no gray-wash background. High contrast, gallery-like.
- Exactly one brand color: a muted brick/vermillion red (~`#AC3235`–`#B4494C`) reserved for the 雅 kanji stroke. Recommended extension: use it as the primary CTA/button color sitewide (see **Red Accent — Extension Decision** below) — not yet implemented on the live site as of this extraction.
- Wordmark pairs a hand-brushed kanji glyph with a wide-tracked, thin serif "MIYABI DESIGN" — East-meets-West, calligraphy next to modern minimalist type.
- Live site type is Poppins at light weight (300) for nearly all running text — gives an airy, uncluttered feel that lets portfolio photography dominate.
- Portfolio-first layout: large full-bleed images of client work (logos, letterhead mockups, flyers) are the actual content — chrome (nav, buttons, cards) is intentionally minimal so it doesn't compete.
- Bilingual pricing tables (AUD primary, JPY secondary) are a structural, load-bearing brand element — not a footnote.

## Brand Mark

- **Kanji glyph (雅):** Hand-brush-stroke rendering, not a typeset character — has ink-brush texture/weight variation. Color: muted brick-red, `#AC3235` at the ink core, feathering toward `#B4494C` / `#C36A6C` at stroke edges (natural brush anti-aliasing — don't flatten to one hex when reproducing at large sizes; keep the soft edge).
- **Wordmark:** "MIYABI DESIGN" in a thin-weight serif, all-caps, wide letter-spacing (~0.15–0.2em), pure black (`#000000`). This is baked into the logo artwork as a fixed asset — it does not match the live site's body font (Poppins) and should be treated as a locked lockup, not reproduced in Poppins.
- **Lockup:** Kanji sits to the left, wordmark to the right, vertically centered, on white. No background container, no drop shadow — logo always floats on plain white/light neutral ground.
- **Minimum clear space:** Treat the kanji's full stroke width as the minimum padding on all sides (matches the generous whitespace it currently sits in).

## Voice & Messaging

**Positioning:** "Get noticed, become invaluable." — the brand promise is competitive visibility, not just aesthetics.

**Taglines in current use:**
- "Make your marketing pop."
- "We craft specialised Real Estate marketing on the same day."
- "Get noticed, become invaluable."

**Tone:** Direct, benefit-led, confident. Short declarative sentences. Speaks to competitive advantage ("step ahead of your competition"), speed ("same-day," "3-week turnaround"), and ROI ("maximize its sale price," "permanent solution to your day-by-day mundane design tasks"). Not playful or quirky — no jokes, no exclamation-heavy copy. Reads like a capable freelancer talking straight to a business owner, not an agency deck.

**Bilingual requirement:** Key pricing and CTAs appear in both English and Japanese (e.g., "$500AU / あるいは ¥50,000"). Any new client-facing copy for the JP market should keep this side-by-side pattern rather than relegating Japanese to a separate page.

**Do:**
- Lead with the business outcome (stand out, sell faster, save time) before describing the deliverable.
- Keep sentences short and concrete; use real numbers (turnaround days, page counts, prices).
- Offer a clear next step every time ("inquire now," "free branding consultation," "Contact Us").

**Don't:**
- Don't get abstract or "brand-speak" heavy (no "synergy," "storytelling journey," etc.) — this brand sells outcomes, not philosophy.
- Don't undersell the Japan/Australia bilingual angle — it's a genuine differentiator, not a footnote.

## Colors

### Brand
- **Miyabi Red** (ink core `#AC3235`, soft edge `#B4494C`): The single reserved brand accent, currently used only on the 雅 kanji mark. High-confidence — pixel-sampled directly from the logo artwork.

### Neutrals (live site, pixel/CSS-confirmed)
- **Ink / Primary text** — `#000000` (`rgba(0,0,0,1)`): headlines, primary body text.
- **Body secondary** — `#696969` (`rgb(105,105,105)`): supporting paragraph text, captions.
- **Canvas / background** — `#FFFFFF`: the dominant page background, edge-to-edge.
- **Section tint** — `#F2F2F2` (`rgb(242,242,242)`): occasional light-gray section band, used sparingly to separate content blocks without a hard border.
- **Dark band / footer** — `#1A1A1A` (`rgb(26,26,26)`) and near-black `#050505` (`rgb(5,5,5)`): footer and a couple of dark UI chips.
- **Muted blue-gray accent** — `#8291A4` (`rgb(130–132,145,164–165)`): a secondary, low-saturation blue-gray that shows up on a handful of elements (icon tints / secondary chips) — the only non-neutral, non-red color found in live use.
- **Stray bright blue** — `#0099FF` — appears once in the extracted styles; likely a Framer link-hover default rather than an intentional brand color. Treat as noise, not policy, unless you tell me otherwise.

### Confidence notes
The neutrals above are pulled directly from `style="..."` attributes on the live page (not guessed), so treat them as accurate. The red is pixel-sampled from the actual logo PNG. Nothing here is a generic Framer template default.

## Red Accent — Extension Decision

The live site uses Miyabi Red only on the 雅 kanji mark — never on a button, link, or UI element. Extending it is a real brand decision. Four options, ranked by how much they preserve the scarcity that makes the mark work:

**A. CTA-only — recommended.** Red (`#AC3235`) becomes the fill color for every primary action button ("Inquire Now," "Contact Us," "Get Started"). Nothing else changes. Contrast-checked: `#AC3235` against white is 6.44:1, clearing WCAG AA in both directions (red text on white, or white text on a red button) — so this is implementable without an accessibility tradeoff. For a business positioned on "get noticed," this gives the one non-black/gray color on the page to the moment you actually want clicked, rather than spending it on decoration.

**B. Interactive accent.** Red on links and hover states in addition to buttons. More surface area for the color, but it fires on every hover and every inline link instead of a few deliberate moments — dilutes scarcity faster than A.

**C. Editorial accent.** Red confined to small structural marks — section numerals, a divider rule, a tag underline — never on anything clickable. Keeps CTAs black. Reads as "designed" but doesn't drive action the way A does.

**D. No change.** Red stays logo-only. A legitimate policy (matches a restraint-as-signal, minimalist reading of the brand) — but if this is the choice, it should be recorded as a decision, not left as an open gap.

**Decision: A — CTA-only.** Lowest implementation cost in Framer, preserves scarcity, and directly serves the "get noticed, become invaluable" positioning by making the brand's one accent color functionally meaningful rather than purely decorative. Treat every `button-primary` on the site as `background: #AC3235` going forward; secondary/text buttons stay black or outline-on-white.

## Typography

### Families in live use
- **Poppins** (weight 300/Light dominant, some 500/600/700 for emphasis) — the workhorse font for nearly all body copy, headings, and UI labels on the live site. Gives the airy, minimalist feel.
- **Satoshi** (bold, 700, tight letter-spacing ~ -0.01em) — used sparingly on small (11px) tag/label elements, likely badges or category chips.
- **Inter** (Medium) — appears on a few nav-adjacent elements, likely a Framer component default rather than an intentional secondary typeface.
- **Logo wordmark font** — a separate thin-weight, wide-tracked serif baked into the logo artwork itself (not a live web font on the page). Don't try to match this to Poppins; it's a locked asset.
- Fonts loaded but not confirmed in visible use in this pass: **Atkinson Hyperlegible**, **Instrument Serif** — present in the font-loading manifest, possibly used on pages beyond the homepage (services/contact) or in states not captured in this single-page pass. Worth checking before assuming they're unused.

### Practical hierarchy (based on observed sizes/weights)
| Role | Font | Weight | Approx. size | Notes |
|---|---|---|---|---|
| Hero / display headline | Poppins | 300 | ~27–29px+ | Light weight even at display size — restraint over boldness |
| Section subhead | Poppins | 300–500 | ~18–23px | |
| Body copy | Poppins | 300 | 14–16px | |
| Nav links | Inter Medium / Poppins | 500 | ~13–14px | |
| Tags / badges | Satoshi | 700 | ~11px | Tight tracking, small-caps feel |
| Fine print / legal | Poppins | 300 | 8–10px | |

### Principle
Weight stays light (300) almost everywhere — the brand avoids bold, heavy type even in headlines. Emphasis is created by **size and whitespace**, not boldness. Reserve heavier weights (700) for small tag/badge moments only, mirroring current Satoshi usage.

## Layout Principles

- **Full-bleed portfolio imagery** is the primary content unit — sections are frequently "image + short caption," not text-heavy blocks.
- **Generous whitespace** around the logo and between sections; nothing feels cramped.
- **Alternating text/image layout** for service sections (per the homepage structure: headline+copy on one side, portfolio image on the other).
- **Pricing tables** are structured, bilingual, and scannable — plan name, price (AUD), price (JPY), short description. This pattern should carry to any new package/pricing work.
- **Sticky nav**, 3 items only: Home / Services / Contact Us — deliberately minimal, no mega-menu.

## Imagery Style

Portfolio work shown includes logo/letterhead mockups (e.g., a teal-snowflake "HALO AIR" mark on textured paper), angular wordmark logos (e.g., "SABDIA" in a geometric grotesk), real-estate flyers, brochures, and business cards. The presentation style is **realistic mockup photography** (paper texture, soft shadows, angled perspective) rather than flat vector previews — this makes the design work feel tangible and client-ready. New portfolio pieces added to the site should follow the same photographed-mockup treatment, not flat screenshots.

## Business Reference (for copy/pricing consistency)

- **Location / market:** Gifu, Japan, serving Japan + Australia.
- **Contact:** kalebhsaldana@gmail.com · Instagram · Line · +81 80 5732 4224.
- **Services:** Real Estate Property Branding, Branding & Identity Packages, Promotional Material (flyers, brochures/magazines up to 12 pages, business cards), Website & Social Media Design, Ongoing/Customizable Design Templates.
- **Pricing pattern (AUD / JPY):** e.g., Property Branding from $500AU / ¥50,000; Branding & Identity Package $600AU / ¥60,000; Ongoing Templates $300AU / ¥30,000; Business Cards $50AU / ¥5,000; Flyer $100AU / ¥10,000; Brochure $150AU / ¥15,000. Website projects: minimum 3-week turnaround, timeline scales with page count.
- **CTA pattern:** always end a pitch with a concrete, low-friction next step — "inquire now" or "free branding consultation."

## Do's and Don'ts

**Do**
- Keep the canvas pure white/near-black. Resist the urge to add a colorful palette — red is the *only* color note, now functional on CTAs as well as the mark (see Red Accent decision above).
- Use Poppins Light for the vast majority of type; reserve heavier weight only for small tags/badges.
- Keep pricing bilingual (AUD + JPY) and structurally prominent, not buried.
- Lead copy with outcomes (visibility, speed, sale price) before describing the design service itself.
- Present portfolio work as photographed mockups, not flat exports.
- Fill every primary CTA button with Miyabi Red (`#AC3235`); keep secondary/text buttons black or outline.

**Don't**
- Don't introduce a *second* accent color without deciding it deliberately — the brand has exactly one (the red), and that restraint is a feature, not a gap to "fix" by default.
- Don't bulk up headline weight to bold — light-weight display type is the brand's quiet-confidence signal.
- Don't drop the Japanese-language pricing/CTA pairing on new pages aimed at the JP market.
- Don't clutter the nav — it's 3 items on purpose.
- Don't put red on hover states or inline text links (Option B) — that dilutes the scarcity the CTA-only decision is built on.

## Gaps / Open Questions

- I only crawled the homepage in this pass — Services and Contact pages may carry additional components (forms, testimonial layout, full pricing grid) not captured here. Worth a follow-up pass if you want full-site coverage.
- The red kanji-ink color is pixel-sampled and has natural brush-stroke variation (`#AC3235` core → `#B4494C`/`#C36A6C` edges) rather than one flat hex — treat it as a small range, not a single swatch.
- The muted blue-gray (`#8291A4`) and the one-off bright blue (`#0099FF`) showed up in the live styles but their intentionality is unclear — flag to confirm before treating either as an official secondary brand color.
- Atkinson Hyperlegible and Instrument Serif are loaded as web fonts but weren't confirmed in visible use on the homepage — may be used elsewhere on the site (or leftover from a template).
- The red-as-CTA decision (above) is documented but not yet implemented on the live Framer site — buttons there are still black as of this extraction. Next real step is applying it in Framer.

## How to Use This File

Reference this MIYABI-BRAND.md before any Miyabi Design work — copywriting, page edits, new pricing/packages, or visual assets. When a request conflicts with something documented here (e.g., "make the button red" vs. the current one-color-reserved-for-the-mark convention), flag the conflict and confirm before proceeding, rather than quietly overriding the existing brand.
