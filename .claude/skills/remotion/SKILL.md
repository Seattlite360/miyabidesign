---
name: "remotion"
description: "Use when creating, editing, or rendering Remotion videos — React-based programmatic video (compositions, animation with useCurrentFrame/interpolate, Remotion Studio interactivity, captions, rendering/Lambda, or building a Remotion-powered app/SaaS). Trigger on mentions of Remotion, \"remotion.dev\", programmatic video creation in React, or .tsx video compositions."
---

Remotion is a React framework for programmatically creating videos (`useCurrentFrame()`, `<Composition>`, CLI rendering, `@remotion/player`, Lambda rendering, etc). This skill condenses the official `remotion-dev/skills` best-practices pack for use inside Cowork.

Deep-dive topics that aren't fully inlined below are fetchable on demand from the source repo — see "Deep-dive reference" at the end. Fetch a page with `web_fetch` before implementing that topic rather than relying on memorized knowledge, since Remotion's API evolves.

## New project setup

Scaffold with:

```bash
npx create-video@latest --yes --blank --no-tailwind my-video
cd my-video
npm i
```

Preview with:

```bash
npx remotion studio --no-open
```

This is a long-running process; it prints the server URL. Visit a specific composition at `/[composition-id]`.

Install new packages with `npx remotion add <pkg>` (e.g. `npx remotion add @remotion/media`) so the version matches — applies to `@remotion/*`, `mediabunny`, `@mediabunny/*`, and `zod`.

### Video layout rules (this is a video, not a webpage)

- Decide what the viewer should notice first in each scene; build the frame around that one thing.
- Keep key content inside a safe area: for 1080px-wide video, ≥80px from the sides, ≥100px from top/bottom.
- Don't add redundant elements.
- Rough minimums at 1080px width: main headline 84px, important supporting text 44px — scale with composition width.

### TailwindCSS

Usable if installed in the project (see https://www.remotion.dev/docs/tailwind). Never use `transition-*` or `animate-*` classes — always animate via `useCurrentFrame()`.

## React Markup best practices

Drive all animation from `useCurrentFrame()` + `interpolate()`. CSS `transition`/`animation` and Tailwind animation classes do **not** render correctly and must be refactored away.

Prefer `scale`, `translate`, `rotate` CSS properties over `transform` — only the former are interactively editable in Remotion Studio. Keep `interpolate()` calls **inline** in the `style` prop (no extracted variables, no spreading, no math on arbitrary variables) so Studio can recognize and edit them.

```tsx
import { useCurrentFrame, Easing, interpolate, Interactive } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Title"
      style={{
        opacity: interpolate(frame, [0, 2 * fps], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        scale: interpolate(frame, [0, 100], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 200 }),
          output: "perceptual-scale", // required for `scale` animations
        }),
      }}
    >
      Hello World!
    </Interactive.Div>
  );
};
```

Assets go in `public/`, referenced via `staticFile()`. Media components: `<Video>` / `<Audio>` from `@remotion/media`, `<CanvasImage>` for images, `<AnimatedImage>` (or `@remotion/gif` outside Chrome) for animated GIF/APNG/WebP/AVIF.

```tsx
import { Audio, Video } from "@remotion/media";
import { staticFile, CanvasImage, AnimatedImage } from "remotion";

<>
  <Video src={staticFile("video.mp4")} style={{ opacity: 0.5 }} />
  <Audio src={staticFile("audio.mp3")} />
  <CanvasImage src={staticFile("logo.png")} style={{ width: 100, height: 100 }} />
  <Video src="https://remotion.media/video.mp4" />
  <AnimatedImage src={staticFile("nyancat.gif")} />
</>
```

### Delaying, trimming

Most components (`AbsoluteFill`, `Interactive.*`, `Img`, `AnimatedImage`, `CanvasImage`, `HtmlInCanvas`, `Solid`, `Sequence`, `@remotion/media`'s `Video`/`Audio`, `Gif`) support:

- `from={1 * fps}` — when the element starts appearing on the timeline.
- `durationInFrames={20 * fps}` — how long it plays; for media pass its natural duration.
- `trimBefore={2 * fps}` — trims the start of the underlying media/clock without moving it on the timeline.

If a component lacks these props, wrap it in `<Sequence>` (`layout="absolute-fill"` to behave like AbsoluteFill, `layout="none"` for a headless wrapper).

### Visual effects

Preference order: (1) plain HTML/CSS, (2) an effect prop directly on `<Video>`/`<Img>`, or wrap content in `<HtmlInCanvas effects={...}>` using a listed preset effect or a custom `createEffect()`.

## Interactivity best practices (Remotion Studio)

Structuring markup this way lets Remotion Studio recognize elements, so users can click-select, drag/resize/rotate, edit CSS, and edit keyframes visually. Overly complex markup becomes grayed-out/non-editable.

- Wrap elements in `<Interactive.Div name="...">` (or the SVG/HTML equivalent) with a descriptive `name`.
- Prefer inline text for fixed, single-use copy instead of extracting to a constant.
- Keep all `style` values as a plain inline object literal — no spreading, no referencing constants, no computed math (`frame * 10` is not supported).
- `interpolate()` input ranges may destructure `durationInFrames`, `fps`, `width`, `height` from `useVideoConfig()` and use simple forms like `2 * fps` or `durationInFrames - 1`, but the frame variable itself must be `frame` (only `frame` is interpreted) — arbitrary variables in the interpolation break editability.
- Keep `<Composition>`/`<Still>` metadata (`width`, `height`, `fps`, `durationInFrames`, `defaultProps`) inline as object literals, no type assertions — only use `calculateMetadata()` for the genuinely dynamic parts, since the Props editor writes visual edits back into inline `defaultProps`.
- Effects arrays (e.g. on `<CanvasImage effects={[...]}>`) must also be fully inline/hardcoded, not conditional or computed, for the same editability reasons.
- To make a custom userland component interactive: https://www.remotion.dev/docs/studio/make-component-interactive.md

## Rendering

```bash
npx remotion render        # full docs: https://www.remotion.dev/docs/cli/render.md
npx remotion still         # full docs: https://www.remotion.dev/docs/cli/still.md
```

For transparent-video export, fetch the deep-dive doc (below) before implementing — codec/container choice matters.

You can sanity-check a single frame during development:

```bash
npx remotion still [composition-id] --scale=0.25 --frame=30
```

(`--frame` is zero-based; at 30fps `--frame=30` is the one-second mark.) Skip this for trivial edits or pure refactors.

## Building an app with Remotion (SaaS / Player / server-side rendering)

**Templates**: Next.js App Router (+Tailwind or not, Lambda-based) — https://github.com/remotion-dev/template-next-app-dir-tailwind and https://www.remotion.dev/templates/next-no-tailwind; Next.js Pages Router — https://github.com/remotion-dev/template-next-pages-dir; Vercel Sandbox rendering — https://github.com/remotion-dev/template-vercel; React Router 7 — https://github.com/remotion-dev/template-react-router; Express render server — https://github.com/remotion-dev/template-render-server. For an existing app: https://www.remotion.dev/docs/brownfield-installation.md.

**`<Player>`** embeds a live Remotion preview in a React app:

```tsx
import { Player } from '@remotion/player';
import { MyVideo } from './remotion/MyVideo';

<Player component={MyVideo} durationInFrames={120} compositionWidth={1920} compositionHeight={1080} fps={30} controls />
```

Full API: https://www.remotion.dev/docs/player/player.md. If metadata is dynamic, sync Player props manually or reuse `calculateMetadata()` (https://www.remotion.dev/docs/dynamic-metadata.md#with-the-player).

**Server-side rendering options** (compare at https://www.remotion.dev/docs/compare-ssr.md):
- Plain Node.js: https://www.remotion.dev/docs/ssr.md, https://www.remotion.dev/docs/renderer.md, https://www.remotion.dev/docs/ssr-node.md
- **Remotion Lambda** (fastest/most scalable): overview https://www.remotion.dev/docs/lambda.md, API https://www.remotion.dev/docs/lambda/api.md. Setup checklist (walk the user through, keep https://www.remotion.dev/docs/lambda/setup.md open as canonical reference): confirm AWS account/region/project → `npx remotion add @remotion/lambda` → create Lambda role/policy/IAM user/access key per generated commands → store `REMOTION_AWS_ACCESS_KEY_ID`/`REMOTION_AWS_SECRET_ACCESS_KEY` in `.env` (never in chat) → optionally validate with `npx remotion lambda policies validate` → deploy the Lambda function (redeploy after Remotion upgrades) → deploy the site with a stable name (redeploy after source changes) → check quotas with `npx remotion lambda quotas` (new AWS accounts often need a concurrency increase) → trigger first render, wire up render/progress endpoints. Before production: handle rate limiting, auth, cost controls, output privacy, cleanup, progress/error reporting.
- Vercel: https://www.remotion.dev/docs/vercel-sandbox.md
- GitHub Actions / Azure Container Apps / Cloudflare Containers: only if specifically requested — https://www.remotion.dev/docs/ssr.md#render-using-github-actions, https://www.remotion.dev/docs/azure-container-apps.md, https://www.remotion.dev/docs/cloudflare-containers.md

Vue/Angular/Svelte integration: https://www.remotion.dev/docs/vue.md, https://www.remotion.dev/docs/angular.md, https://www.remotion.dev/docs/svelte.md

## Captions

Captions are processed as JSON using the `Caption` type from `@remotion/captions`:

```ts
type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};
```

Fetch the relevant deep-dive doc before implementing: transcribing audio/video into captions, displaying captions in a composition, or importing captions from a `.srt` file (see reference table).

## Multimedia (Mediabunny)

Mediabunny is a browser multimedia library for audio/video metadata and manipulation — compact overview: https://mediabunny.dev/llms.txt. Deep-dive docs cover getting audio duration, video dimensions, and video duration (see reference table).

## Looking up current Remotion docs

Don't rely solely on memorized API knowledge — Remotion evolves. Search via Algolia, then fetch the page as Markdown:

```
POST https://plsduol1ca-dsn.algolia.net/1/indexes/*/queries?x-algolia-api-key=3e42dbd4f895fe93ff5cf40d860c4a85&x-algolia-application-id=PLSDUOL1CA
Content-Type: application/x-www-form-urlencoded

{"requests":[{"query":"<search query>","indexName":"remotion","params":"attributesToRetrieve=[\"hierarchy.lvl0\",\"hierarchy.lvl1\",\"hierarchy.lvl2\",\"url\"]&hitsPerPage=10"}]}
```

Each hit has a `url`. Append `.md` to any `remotion.dev/docs/...` URL to fetch its Markdown source directly (cheaper than HTML), e.g. `https://www.remotion.dev/docs/use-video-config.md`.

## Upgrading Remotion

1. Identify the package manager/workspaces from the manifest and lockfile.
2. If `@remotion/cli` is available locally, just run `npx remotion upgrade` and skip manual steps.
3. Otherwise: get latest stable via `npm view remotion version`; bump every `remotion`/`@remotion/*` dependency to that exact version; check https://www.remotion.dev/docs/mediabunny/version for the compatible Mediabunny version and bump `mediabunny`/`@mediabunny/*` to match; update the lockfile.
4. Update installed Remotion skills: `npx remotion skills update`.
5. Verify one version across all Remotion packages and the correct Mediabunny version (`npx remotion versions` if available). Changelog: https://github.com/remotion-dev/remotion/releases.

## Deep-dive reference

This condensed skill omits the full text of narrower topics to stay manageable. Fetch any of these as plain Markdown from the source repo (`remotion-dev/skills`, MIT-style community skill pack) when a task actually needs that depth — base URL `https://raw.githubusercontent.com/remotion-dev/skills/main/skills/`:

- Compositions (stills, folders, nesting, default props): `remotion-markup/compositions.md`
- Sequencing patterns (delay/trim/limit): `remotion-markup/sequencing.md`
- Timing techniques for `interpolate()`: `remotion-markup/timing.md`
- Scene transitions: `remotion-markup/transitions.md`
- Visual/pixel effects presets & custom `createEffect()`: `remotion-markup/effects.md`
- Multi-scene videos: `remotion-markup/multi-scene-video.md`
- Parameterized videos (Zod schema): `remotion-markup/parameters.md`
- Dynamic duration/dimensions/data: `remotion-markup/calculate-metadata.md`
- Cropping visible rectangle: `remotion-markup/cropping.md`
- Video editing / editable timelines: `remotion-markup/video-editing.md`
- Embedding videos (trim/volume/speed/loop/pitch): `remotion-markup/embedding-videos.md`
- Advanced audio (trim/volume/speed/pitch): `remotion-markup/audio.md`
- Audio visualization (spectrum/waveform): `remotion-markup/audio-visualization.md`
- AI voiceover (ElevenLabs TTS): `remotion-markup/voiceover.md`
- Sound effects: `remotion-markup/sfx.md`
- Silence detection/trimming: `remotion-markup/silence-detection.md`
- FFmpeg operations: `remotion-markup/ffmpeg.md`
- Text highlights/underlines/annotations: `remotion-markup/text-highlights.md`
- Google Fonts: `remotion-markup/google-fonts.md`
- Local fonts: `remotion-markup/local-fonts.md`
- Advanced images (sizing/positioning/dynamic paths): `remotion-markup/images.md`
- GIFs synced to timeline: `remotion-markup/gifs.md`
- Lottie animations: `remotion-markup/lottie.md`
- HTML rendered into canvas: `remotion-markup/html-in-canvas.md`
- Measuring DOM nodes: `remotion-markup/measuring-dom-nodes.md`
- Measuring/fitting text: `remotion-markup/measuring-text.md`
- 3D content (Three.js/R3F): `remotion-markup/3d.md`
- Maps overview: `remotion-maps/REFERENCE.md`; techniques for Cesium, Mapbox, MapLibre, MapTiler, and static maps live under `remotion-maps/techniques/<name>/TECHNIQUE.md` (includes code assets/scripts — best fetched via `git clone https://github.com/remotion-dev/skills` if you need the actual asset files, not just the write-up)
- Transparent video export: `remotion-render/transparent-videos.md`
- Transcribing captions: `remotion-captions/transcribe-captions.md`
- Displaying captions: `remotion-captions/display-captions.md`
- Importing `.srt` captions: `remotion-captions/import-srt-captions.md`
- Mediabunny — audio duration: `remotion-multimedia/get-audio-duration.md`, video dimensions: `remotion-multimedia/get-video-dimensions.md`, video duration: `remotion-multimedia/get-video-duration.md`

If you need the full, always-current multi-file version of this skill pack (with all reference docs and code assets linked exactly as intended, e.g. for local Claude Code use), the source is `npx skills add remotion-dev/skills` run from a terminal in the project.

