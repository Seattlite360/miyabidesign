#!/usr/bin/env bash
# Pre-flight text checks for a Miyabi page. Exit 1 if anything needs fixing.
#   bash check-leftovers.sh <site-dir> [extra-term ...]
# Finds: template leftovers (Sylva's facts), em/en dashes, AI-slop phrases,
# banned default fonts, missing alt text, and images the page references but lacks.
set -uo pipefail
dir="${1:?usage: check-leftovers.sh <site-dir>}"; shift || true
fail=0
hit() { echo; echo "== $1"; fail=1; }
files=$(find "$dir" -maxdepth 2 \( -name '*.html' -o -name '*.css' -o -name '*.js' \) ! -path '*/vendor/*')

terms='Sylva|Sylvan|Toowong|Immerse|Kearney|Greyburn|Regatta|BDA Architecture|Landsborough|Kirra|Robina|Kaiya'
for t in "$@"; do terms="$terms|$t"; done
out=$(grep -n -E "$terms" $files) && { hit "Template leftovers (replace with this client's facts)"; echo "$out"; }

out=$(grep -n "—\|–\|&mdash;\|&ndash;" $dir/*.html) && { hit "Em/en dashes in page copy (rewrite the sentence)"; echo "$out"; }

slop='nestled|boasts|elevate your|unparalleled|world-class|a testament to|seamless(ly)?|curated lifestyle|luxurious oasis|redefin(e|ing) luxury|in the heart of|breathtaking|state-of-the-art|unlock|embark|discover the art of'
out=$(grep -n -i -E "$slop" $dir/*.html) && { hit "Stock AI/real-estate phrases (say the specific fact instead)"; echo "$out"; }

out=$(grep -n -i -E 'font-family:[^;]*"?(Inter|Poppins|Manrope|Fraunces|Instrument Serif)"?[^;]*;' $files | grep -v -E '"Site Inter"') && { hit "Default AI fonts as a main face"; echo "$out"; }

out=$(python3 -c 'import re,sys
for f in sys.argv[1:]:
    s=open(f).read()
    for m in re.finditer(r"<img\b[^>]*>", s):
        if not re.search(r"\balt=", m.group(0)): print(f"{f}:{s.count(chr(10),0,m.start())+1}")' $dir/*.html) && [ -n "$out" ] && { hit "<img> without alt"; echo "$out"; }

missing=$(grep -o -h -E '(src|srcset|href|data-sc-src(-mobile)?)="[^"#:]+\.(webp|jpg|jpeg|png|svg|mp4|webm|woff2)"' $dir/*.html | sed -E 's/^[^"]*"//; s/"$//' | sort -u | while read -r f; do [ -e "$dir/$f" ] || echo "$f"; done)
[ -n "$missing" ] && { hit "Referenced files that do not exist yet"; echo "$missing"; }

[ $fail = 0 ] && echo "Clean." 
exit $fail
