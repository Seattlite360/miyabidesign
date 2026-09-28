#!/usr/bin/env bash
# Scaffold a new property landing page from the Miyabi template.
#   bash new-site.sh <dest-dir>          e.g. bash new-site.sh ~/repo/aria
# Copies the page, styles, motion code, vendor libraries and OFL fonts. No images:
# add the client's renders, interiors and logo artwork, then run check-leftovers.sh.
set -euo pipefail
dest="${1:?usage: new-site.sh <dest-dir>}"
here="$(cd "$(dirname "$0")/.." && pwd)"
[ -e "$dest/index.html" ] && { echo "refusing: $dest/index.html exists"; exit 1; }
mkdir -p "$dest"
cp -R "$here/template/." "$dest/"
mkdir -p "$dest/img/logo" "$dest/media"
cat > "$dest/.gitignore" <<'IGN'
# Licensed fonts and third-party photos never go in a public repo. Deploy them from
# the local folder instead (Netlify deploys the folder, not the repo).
fonts/licensed/
img/private/
IGN
echo "Scaffolded $dest"
echo "Next: logo (trace_logo.py), hero clip (render_build_clip.py), copy, then check-leftovers.sh $dest"
