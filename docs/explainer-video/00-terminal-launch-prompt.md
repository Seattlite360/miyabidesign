# Terminal launch prompt (paste into Claude Code when ready)

```
Produce the Miyabi Design explainer video. Planning is done; execute it.

1. Read the spec without switching branches:
   git fetch origin claude/project-thread-2scxva
   git show origin/claude/project-thread-2scxva:docs/explainer-video/03-production-prompt.md
   git show origin/claude/project-thread-2scxva:docs/explainer-video/02-storyboard-and-script.md
   git show origin/claude/project-thread-2scxva:docs/explainer-video/01-campaign-plan.md
   (Repo: https://github.com/Seattlite360/miyabidesign, PR #3, folder docs/explainer-video/)
   Follow 03-production-prompt.md as the master instruction. Where it says /mnt/project-files/explainer-video/, use ./explainer-video-work/ locally instead (progress.md, reference-notes.md, exports/).

2. Before any generation, do the two local jobs:
   a. Watch both reference videos and write ./explainer-video-work/reference-notes.md: for each, timecode, the technique (transition, kinetic type move, UI motion, pacing), and which storyboard scene (1 to 9) it maps to.
      https://www.youtube.com/watch?v=luoDI5Bo0w0
      https://www.youtube.com/watch?v=FtNWrBUOJ24
      Match techniques only. Never reuse their footage.
   b. Collect from my Miyabi folder (Documents/Downloads): the Sabdia logo and brand colours, the MIYABI DESIGN lockup, the 雅 mark, and any Sabdia photos. List what was found. If anything is missing, stop and ask; never redraw a logo.

3. Use the miyabi-design:miyabi-brand skill for every brand decision. Studio voice, never "I". Locked claims only: 24 hours or free, free first pack. Miyabi Red #AC3235 only on the 雅 mark and the final button. Poppins Light only.

4. Voice: ElevenLabs voice ID Dslrhjl3ZpzrctukrQSN, one generation per scene, never retry a call that already spent credits. Build in Raylight (Raylight editor tab must be open and connected; 2.5D tilt and parallax is fine). Log each finished step to progress.md so a usage-limit cutoff resumes cleanly.

5. Deliver: 75s master 16:9, 30s (9:16 and 1:1), 15s (9:16), thumbnail, in ./explainer-video-work/exports/. Then report links, credits spent, and any script line that changed. Do not publish anything.
```
