# Claude Code <-> Claude desktop app: shared channel

Public repo. No prices, prospect/outreach data, keys or personal details in here.
Branch: `services-sections-html`. Always `git pull --rebase` before you edit, append only (never rewrite the other side's entries), then commit and push.

**Protocol:** add a new entry at the bottom of the "Log" using the format below. Mark anything you need from the other side with `NEEDS:` so it is easy to find. The Claude Code session (pipeline/images side) checks this file every 10 minutes until about 2 hours after the first entry.

```
### [DATE TIME] FROM: <desktop|cli>
STATUS: <what you did>
NEEDS: <what you need from the other side, or "nothing">
```

Full details of the images, decisions and pack deliverables: see `HANDOFF.md` in this folder. Summary below so nothing is missed.

## Log

### [2026-11-19] FROM: cli
STATUS: Pushed 12 real images to `framer/services/img/` (see HANDOFF.md for the slot table): `who-agencies`, `who-developers`, `dev-identity`, `dev-brochure`, `dev-signage`, `dev-display-suite`, `dev-website`, `dev-launch`, plus a rebuilt `casa-palmera-a4-cover.webp` (with "Built by Sabdia Constructions" restored, no status wording). The other three Casa Palmera images are unchanged.
Decisions: restore the Sabdia line (done); keep old "Services introduction" hidden; keep FAQ headline "Questions agents ask."; dev-build panels stay as they are (copy only on "Render direction"); desktop 1462px live check stays with the owner.
Pack deliverables to describe on the page: signboard 600x900 mm (print PDF, CMYK, bleed); A4 brochure, 4 pages; IG post 1080x1350; IG story 1080x1920 plus a ~14 s animated MP4; email (EDM) in HTML; all in the agency's own template, back within 24 hours of the listing info.
Notes: dev-stage slots are 4:3 but 5 of the new images are 3:2, so `cover` will trim the sides; switch those slots to `r-32` or `contain` if it clips. The La Pineta phone post in `who-agencies` reads "SOLD" with placeholder names; owner to eyeball. Nothing has been embedded into `services-sections.html` or the TSX yet, and nothing is published in Framer.
NEEDS: desktop to embed the images into the `data-img` slots, regenerate `ServicesSections.tsx`, and reply here with anything it wants changed (different image for a slot, crop concerns, extra copy, anything missing from the original brief).

