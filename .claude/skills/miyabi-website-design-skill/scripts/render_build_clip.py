#!/usr/bin/env python3
"""Build the hero's scrub clip from still renders: empty site, then each build stage
rising over the last, bottom to top, under one continuous camera push-in.

  python3 render_build_clip.py OUT.mp4 FFMPEG stage1.png stage2.png [stage3.png ...]
      [--size 1274x1080] [--focus 0.5,0.7] [--frames 300] [--hold 0.13]

stage1 is the empty lot (it gets the push-in). Every later stage is wiped in from the
ground up with a feathered edge, like it is being built. Use renders that share one
camera position, or the wipe shows the seam.

Prints the schedule as JSON: paste it into HERO_CLIP in js/site.js so the page's datum
line rides the real wipe edge. Then encode for the web with scroll-craft's encode.sh:
  bash .claude/skills/scroll-craft/scripts/encode.sh OUT.mp4 site/media/hero.mp4 desktop 24
Phones: crop a portrait version first (ffmpeg -vf crop=560:1080:(iw-560)/2:0), then
encode.sh ... mobile. Needs: pillow, numpy, an ffmpeg with libx264.
"""
import argparse, json, subprocess
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("ffmpeg"); ap.add_argument("stages", nargs="+")
ap.add_argument("--size", default="1274x1080")
ap.add_argument("--focus", default="0.5,0.7", help="push-in target on the lot, as fractions of width,height")
ap.add_argument("--frames", type=int, default=300)       # 10 s at 30 fps: ~1 frame per 12px of scroll
ap.add_argument("--hold", type=float, default=0.13)      # lot holds while the page frames it
ap.add_argument("--feather", type=float, default=0.18)   # wipe edge softness, fraction of height
a = ap.parse_args()
W, H = map(int, a.size.split("x"))
FX, FY = map(float, a.focus.split(","))

def cover(img):
    """Scale and centre-crop to the clip's aspect, keeping full height where possible."""
    iw, ih = img.size; s = max(W / iw, H / ih)
    img = img.resize((round(iw * s), round(ih * s)), Image.LANCZOS)
    x0 = (img.width - W) // 2; y0 = (img.height - H) // 2
    return img.crop((x0, y0, x0 + W, y0 + H))

frames = [cover(Image.open(p).convert("RGB")) for p in a.stages]
n_rise = len(frames) - 1
# rises share the window after the hold, leaving the last ~40% as a settle on the finished building
start, end = a.hold + 0.09, 0.60
step = (end - start) / max(1, n_rise)
rises = [(round(start + i * step, 3), round(start + (i + 1) * step - 0.02, 3)) for i in range(n_rise)]

smooth = lambda x: (lambda y: y * y * (3 - 2 * y))(min(1, max(0, x)))
seg = lambda u, lo, hi: min(1, max(0, (u - lo) / (hi - lo)))

def zoom_about(img, z, ax, ay, lift=0.0):
    cw, ch = W / z, H / z
    x0 = ax * W - ax * cw; y0 = ay * H - ay * ch - lift * H
    return img.transform((W, H), Image.AFFINE, (cw / W, 0, x0, 0, ch / H, y0), Image.BICUBIC)

def lot_zoom(u):
    if u < a.hold: return 1 + 0.004 * u / a.hold          # near-still, never frozen
    k = (u - a.hold) / (1 - a.hold)
    return 1.004 * (1 + 0.45 * k ** 1.15)

yb = np.linspace(1, 0, H)[:, None]                         # height from the bottom
def alpha(level):
    x = np.clip(1 - (yb - level) / a.feather, 0, 1); x = x * x * (3 - 2 * x)
    return np.repeat(x, W, axis=1)[..., None]

ff = subprocess.Popen([a.ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo",
    "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-", "-c:v", "libx264",
    "-preset", "slow", "-crf", "12", "-pix_fmt", "yuv420p", a.out], stdin=subprocess.PIPE)

for i in range(a.frames):
    u = i / (a.frames - 1)
    f = np.asarray(zoom_about(frames[0], lot_zoom(u), FX, FY), np.float32)
    bz = 1 + 0.05 * seg(u, rises[0][0], 1) if rises else 1
    for k, (lo, hi) in enumerate(rises):
        if u <= lo: continue
        lvl = -a.feather + (1 + a.feather) * smooth(seg(u, lo, hi))
        lift = 0.02 * (1 - smooth(seg(u, lo, hi)))
        s = np.asarray(zoom_about(frames[k + 1], bz, 0.47, 0.3, -lift), np.float32)
        al = alpha(lvl); f = f * (1 - al) + s * al
    ff.stdin.write(np.clip(f, 0, 255).astype(np.uint8).tobytes())
    if i == 0: Image.fromarray(np.clip(f, 0, 255).astype(np.uint8)).save(a.out.replace(".mp4", "-poster.png"))
ff.stdin.close(); ff.wait()

print(json.dumps({"hold": a.hold, "feather": a.feather,
                  "rises": [{"from": lo, "to": hi, "ground": 0.92, "top": 0.1} for lo, hi in rises]}, indent=1))
print("rendered", a.out, "- set ground/top per rise to the frame-y of the ground line and roof (0 top, 1 bottom)")
