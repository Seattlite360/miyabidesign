# Production prompt (paste into a session with Raylight open and ElevenLabs connected)

You are producing the Miyabi Design 75-second explainer. Read `/mnt/project-files/explainer-video/02-storyboard-and-script.md` and `01-campaign-plan.md` first; they are the spec. Load the `miyabi-design:miyabi-brand` skill and follow it for all copy and visuals. Miyabi speaks as a studio, never "I".

## Ground rules
- Locked claims only: 24 hours or free, free first pack, headcount pricing (no prices on screen), QLD/NSW compliance. Do not add "hand crafted", "expert", "instant", "automatic", "sell faster", ROI or any number not in the script.
- Miyabi Red `#AC3235` only on the 雅 mark and the final button.
- Never repeat a generation call to retry: each call spends credits. Generate once, inspect, then decide.
- After every completed step, append one line to `/mnt/project-files/explainer-video/progress.md` (step, result, ids/urls). On start, read that file and resume at the first unfinished step.
- Do not publish or send anything externally. Deliver files and links only.

## Step 0: Preflight
1. `get_editor_status` (Raylight). If no tab is connected, stop and ask for the project link.
2. Check ElevenLabs and Raylight credit balances if visible; report them.
3. Sample client = Sabdia. Collect from the local Miyabi folder: Sabdia logo/wordmark, brand colours, any listing or project photos, and the MIYABI DESIGN lockup and 雅 mark. List what was found in progress.md. Missing files: stop and ask; never redraw a logo.
4. Read `reference-notes.md` if present and map each noted technique to a storyboard scene. Match techniques, never reuse footage.

## Step 1: Voice (ElevenLabs)
1. `creative_get_model_guide` for the speech model. Use voice_id `Dslrhjl3ZpzrctukrQSN`. Do not substitute a voice.
2. `creative_create_flow` once; pass its flow_id to every later call.
3. `creative_generate_speech` once per scene (9 calls), text exactly as in the storyboard. Calm, even pace, no exclamation marks. Set generations_count to default.
4. `creative_get_flow_run_status` until complete. Transcribe each with `creative_transcribe_audio` and confirm the words match the script exactly. Record each clip's duration in progress.md.
5. If a clip misreads a word, regenerate that one scene only.

## Step 2: Build in Raylight
1. `get_design_guide` topics: `craft-rules`, `measured-craft`, then `apple-news`, `linear-hero`, `revolut-app`, `liquid-glass`, `prompt-button-press`, `fey` for the scene recipes in the storyboard.
2. `list_templates` and use `start_from_template` on the closest dark SaaS template (e.g. "SAAS Demo Video" or "Macbook pro around Linear") as the base for scenes 4 to 7. Build scenes 1 to 3, 8, 9 as kinetic type / logo sting on white.
3. Fonts: Poppins Light 300 only. Upload the MIYABI DESIGN lockup and 雅 mark as images with `upload_media` (if the files are not available, stop and ask; never retype the wordmark).
4. Scene durations follow the voice clip lengths from Step 1, with 300ms of air after each line and the first 150ms of every shot quiet.
5. Follow the craft rules: one text idea per scene, no all-caps eyebrow over headline stack, hard cuts on motion, tilted hero mockups 36 to 48 degrees with z-separation, no bounce, 2 to 3 snap moments total (scene 5 re-skin, scene 3 sting, scene 8 counter).
6. `add_sound` for each voice clip on its scene start. Add a licensed or generated sparse music bed and duck it 12 dB under voice. If music rights cannot be confirmed, leave the bed out and say so.

## Step 3: Review gates (after every scene)
- `render_stills` at start, middle and end of the scene. Check: text inside frame, no lint findings, no red outside the allowed places, no price range, printing caveat present in scene 7, "Contact agent" in scene 4.
- `render_filmstrip` per scene; fix anything that drags past 4.7s or looks like a flat zoom wobble.
- `check_sync` between audio and captions for the full edit at the end.

## Step 4: Deliverables
1. Master 16:9 1920x1080 30fps, burned-in captions (English, Poppins Light, bottom-safe).
2. 30s at 9:16 and 1:1; 15s at 9:16, per the cut-downs in the storyboard.
3. A 1920x1080 thumbnail (scene 6 hero frame).
4. Save exports and the Raylight project link into `/mnt/project-files/explainer-video/exports/` and list them in progress.md.

## Step 5: Report
Reply in the project thread with: links to the master and cut-downs, credits spent, any script line changed, and anything that could not be verified. If any claim in the finished video differs from the script, flag it before anyone publishes.
