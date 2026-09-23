"""Build the Sylva hero scrub clip from the three supplied renders.

One continuous push-in. The lot holds, then pushes; the structure rises from the
ground up through a feathered wipe; the finished residence rises over it; the
camera keeps easing in through the exit slide so the clip never freezes.

The schedule constants below are mirrored in sylva/js/sylva.js (HERO_CLIP) so
the page's datum line can ride the wipe edge. Change both together.
"""
import subprocess, sys, numpy as np
from PIL import Image

SRC = sys.argv[1]          # folder with a.png, b_wide.png, c_wide.png
OUT = sys.argv[2]          # intermediate mp4
W, H = 1274, 1080          # 1000:848 aspect at 1080 lines
FPS, N = 30, 300           # 10 s, one frame per ~12px of scroll on a 900px screen

# --- schedule (normalised clip time u in 0..1) ---------------------------------
LOT_Z0 = 1.0               # frame 0 = full-height lot crop centred on x=1000 (page wide layer matches it)
LOT_FOCUS = (1000, 600)    # the push-in closes on the centre of the cleared site
LOT_HOLD = 0.13            # held while the page narrows the panorama onto the frame
S_RISE = (0.22, 0.40)      # structure wipe
R_RISE = (0.42, 0.60)      # residence wipe
FEATHER = 0.18             # wipe feather, fraction of frame height
BLD_Z = (1.0, 1.05)        # building camera zoom from S_RISE start to u=1

lot = Image.open(f"{SRC}/a.png").convert("RGB")
bst = Image.open(f"{SRC}/b_wide.png").convert("RGB")
res = Image.open(f"{SRC}/c_wide.png").convert("RGB")

def smooth(x): x = min(1, max(0, x)); return x * x * (3 - 2 * x)
def seg(u, a, b): return min(1, max(0, (u - a) / (b - a)))

def lot_zoom(u):
    # near-still during the hold, then a steady push that keeps going
    if u < LOT_HOLD: return LOT_Z0 * (1 + 0.004 * u / LOT_HOLD)
    k = (u - LOT_HOLD) / (1 - LOT_HOLD)
    return LOT_Z0 * 1.004 * (1 + 0.45 * (k ** 1.15))

def render_lot(z):
    # crop of height 848/z closing on LOT_FOCUS, clamped inside the render
    ch = 848 / z; cw = ch * W / H
    fx, fy = LOT_FOCUS
    base_x0 = 1000 - (848 * W / H) / 2          # frame-0 left edge
    x0 = fx + (base_x0 - fx) / z
    y0 = fy + (0 - fy) / z
    x0 = min(max(x0, 0), 2000 - cw); y0 = min(max(y0, 0), 848 - ch)
    sx, sy = cw / W, ch / H
    return lot.transform((W, H), Image.AFFINE, (sx, 0, x0, 0, sy, y0), Image.BICUBIC)

def render_bld(img, z, lift):
    # full frame, zoomed about centre, lifted by `lift` of height
    iw, ih = img.size
    cw, ch = iw / z, ih / z
    ax, ay = 0.47, 0.3                           # zoom anchor keeps the roof in frame
    x0 = ax * iw - ax * cw; y0 = ay * ih - ay * ch - lift * ih
    return img.transform((W, H), Image.AFFINE, (cw / W, 0, x0, 0, ch / H, y0), Image.BICUBIC)

yb = np.linspace(1, 0, H)[:, None]  # 1 at top row, 0 at bottom row (height from bottom)
def rise_alpha(r):
    a = np.clip(1 - (yb - r) / FEATHER, 0, 1)
    a = a * a * (3 - 2 * a)
    return np.repeat(a, W, axis=1)[..., None]

def rise_level(u, span):
    return -FEATHER + (1 + FEATHER) * smooth(seg(u, *span))

ff = subprocess.Popen([sys.argv[3], "-y", "-hide_banner", "-loglevel", "error",
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "12", "-pix_fmt", "yuv420p", OUT],
    stdin=subprocess.PIPE)

for i in range(N):
    u = i / (N - 1)
    frame = np.asarray(render_lot(lot_zoom(u)), dtype=np.float32)
    bz = BLD_Z[0] + (BLD_Z[1] - BLD_Z[0]) * seg(u, S_RISE[0], 1)
    if u > S_RISE[0]:
        r = rise_level(u, S_RISE)
        lift = 0.025 * (1 - smooth(seg(u, *S_RISE)))
        s = np.asarray(render_bld(bst, bz, -lift), dtype=np.float32)
        a = rise_alpha(r)
        frame = frame * (1 - a) + s * a
    if u > R_RISE[0]:
        r = rise_level(u, R_RISE)
        lift = 0.015 * (1 - smooth(seg(u, *R_RISE)))
        c = np.asarray(render_bld(res, bz, -lift), dtype=np.float32)
        a = rise_alpha(r)
        frame = frame * (1 - a) + c * a
    ff.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())
    if i == 0: Image.fromarray(np.clip(frame, 0, 255).astype(np.uint8)).save(OUT.replace('.mp4', '-f000.png'))
ff.stdin.close(); ff.wait()
print("rendered", OUT, N, "frames")
