#!/usr/bin/env bash
# Verification lab: copy the site, add VP9 copies of the hero clips (headless Chromium
# ships without H.264, so the MP4s would never play there), and serve it.
#   bash lab.sh <site-dir> <lab-dir> [port=4501] [ffmpeg=ffmpeg]
# Then: node pageshots.mjs http://localhost:4501 shots/desktop 1440 900
#       node pageshots.mjs http://localhost:4501 shots/mobile 390 844
#       node pageshots.mjs http://localhost:4501 shots/reduced 1440 900 reduced
set -euo pipefail
site="${1:?site dir}"; lab="${2:?lab dir}"; port="${3:-4501}"; ff="${4:-ffmpeg}"
mkdir -p "$lab"; rm -rf "$lab/site"; cp -R "$site" "$lab/site"
for v in "$lab"/site/media/*.mp4; do
  [ -e "$v" ] || continue
  "$ff" -y -hide_banner -loglevel error -i "$v" -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -an -f mp4 "$v.vp9"
  mv "$v.vp9" "$v"                    # same name, VP9 in MP4: the page needs no change
done
serve="$(cd "$(dirname "$0")/../.." && pwd)/scroll-craft/scripts/serve.mjs"
if [ -f "$serve" ]; then node "$serve" --root "$lab/site" --port "$port" &
else (cd "$lab/site" && python3 -m http.server "$port") & fi
echo "lab serving $lab/site on http://localhost:$port (pid $!)"
