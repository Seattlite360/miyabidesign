# Ship: verify, deploy, licences, pitfalls

## Verify

```bash
S=.claude/skills/miyabi-website-design-skill/scripts
bash $S/lab.sh <site> <lab-dir> 4501 <ffmpeg>          # VP9 copies + server
export CHROME=<chromium path>                           # cloud: /opt/pw-browsers/chromium*/chrome-linux/chrome
node $S/pageshots.mjs http://localhost:4501 shots/desktop 1440 900
node $S/pageshots.mjs http://localhost:4501 shots/mobile 390 844
node $S/pageshots.mjs http://localhost:4501 shots/reduced 1440 900 reduced
```
Run the node scripts from a folder with `playwright-core` installed (`npm i playwright-core`).
Pass: no horizontal overflow, no console errors except known missing private assets, every
section readable, hero cues ≥ 4.5:1 (scroll-craft `shoot.mjs` measures it). Look at every PNG;
make a contact sheet if there are many. One fix batch, one confirm pass, then stop.

## Deploy (Netlify, from the user's machine)

```bash
cd <repo> && git pull origin <branch>
# add private assets that are git-ignored, e.g. the founder portrait:
curl -L -o <site>/img/<portrait>.jpg "<url>"
rm -f <site>/fonts/licensed/*          # never deploy personal-use fonts
npx netlify-cli deploy --dir=<site>          # draft URL, changes every deploy
npx netlify-cli deploy --dir=<site> --prod   # stable https://<name>.netlify.app
```
- Netlify free has no password protection: the link is unlisted, not private. Real protection:
  Netlify Pro password, or Cloudflare Pages + Access (free tier).
- The hero clip must be served over http(s): `file://` blocks the engine's Blob fetch.
- Local preview: `cd <site> && python3 -m http.server 4500` → http://localhost:4500.

## Licences and privacy

- Public repo rule: no API keys, no licensed fonts, no third-party photos. Git-ignore them and
  deploy from the local folder (Netlify deploys the folder, not the repo).
- Fonts: OFL = free for commercial use, self-host. Personal-use only (e.g. Elgoc) = preview only,
  buy before any client or public use. Adobe kits = allowed domains only.
- GSAP (incl. SplitText) is free for commercial use; Lenis MIT; scroll-craft engine per its LICENSE.
- Developer's own photos (founder portrait): fine inside a pitch to that developer; keep the link limited.

## Pitfalls we already paid for

| Symptom | Cause | Fix |
|---|---|---|
| Hero clip never plays in headless screenshots | Chromium for testing has no H.264 | `lab.sh` makes VP9 copies with the same names |
| Clip plays locally only from a server | `file://` blocks Blob fetch | Always serve over http |
| No ffmpeg / ffprobe | Not installed in the container | `pip install imageio-ffmpeg`, use its binary; shim ffprobe if a script needs it |
| Traced logo is a negative | potracer fills False pixels | Trace `~mask` (the script does) |
| Logo layers bleed colours | Nearest-colour assignment on anti-aliased edges | Residual-based ownership (the script does); pass `--colors` |
| Logo sprite blank | External `<use>` references | Separate `<img>` SVG files |
| Intro text fails contrast in tests | Scrim was a cue, hidden during measurement | Scrim driven by page JS, radial, fades with the intro |
| First clip frame cropped too tight | Push-in started zoomed | Frame 0 = full-height lot, anchored zoom |
| Screenshot script misses the location pin | Looked for `.pin-spacer` inside, it wraps outside | `closest('.pin-spacer')` (pageshots does both) |
| Images pasted mid-turn can't be used | They aren't saved to disk | Ask for a normal message attachment or a file path |
| Sites and CDNs 403 from the cloud container | Egress policy | npm for libraries, WebSearch for facts, user sends files |
| Pushing a git tag fails | Only the working branch may be pushed | Record the commit hash in the README instead |
