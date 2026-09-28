#!/usr/bin/env python3
"""Trace a client's supplied logo artwork into a layered SVG. Trace, never redraw.

Each ink colour is traced as its own layer at 4x from the anti-aliased source, so
the SVG keeps the artwork's real shapes and colours.

  python3 trace_logo.py SRC OUT.svg [--box x0,y0,x1,y1] [--colors "#5C4D42,#C9815E"] [--inks 3]
  python3 trace_logo.py SRC OUT.svg --box ... --light "#FBF7EF"   # one-colour light version

--box      crop to one lockup (leave the tagline out: set taglines in live type).
--colors   the ink colours, sampled from the artwork. Omit to detect --inks colours.
--light    also write OUT-light.svg with every layer in this colour (for dark photos).
Needs: pip install potracer pillow numpy
"""
import argparse, sys
import numpy as np, potrace
from PIL import Image

S = 4
ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--box"); ap.add_argument("--colors"); ap.add_argument("--inks", type=int, default=3)
ap.add_argument("--light"); ap.add_argument("--turd", type=int, default=6)
a = ap.parse_args()

im = Image.open(a.src).convert("RGBA")
bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
rgb = bg.convert("RGB")
if a.box:
    x0, y0, x1, y1 = map(int, a.box.split(",")); rgb = rgb.crop((x0, y0, x1, y1))
w, h = rgb.size

hexs = lambda c: "#%02X%02X%02X" % tuple(int(v) for v in c)
if a.colors:
    cols = [tuple(int(c.strip().lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)) for c in a.colors.split(",")]
else:
    # detect: cluster only solid ink pixels (anti-aliased edges are blends, not inks)
    px = np.asarray(rgb).reshape(-1, 3).astype(float)
    dist = np.linalg.norm(255 - px, axis=1)
    solid = px[dist > 0.55 * dist.max()].astype(np.uint8)
    strip = Image.fromarray(solid[None, :, :], "RGB")
    q = strip.quantize(colors=a.inks + 6, method=Image.MEDIANCUT)
    pal = q.getpalette()
    cols = []
    for n, idx in sorted(q.getcolors(), reverse=True):
        c = tuple(pal[idx * 3: idx * 3 + 3])
        if any(np.linalg.norm(np.subtract(c, k)) < 30 for k in cols): continue
        cols.append(c)
        if len(cols) == a.inks: break
    print("detected inks:", ", ".join(hexs(c) for c in cols), "(pass --colors to fix them)")

big = np.asarray(rgb.resize((w * S, h * S), Image.BICUBIC)).astype(float)
white = np.array([255, 255, 255.])
ts, rs = [], []
for c in np.array(cols, float):
    d = white - c
    t = ((white - big) @ d) / (d @ d)            # coverage along the paper -> ink line
    resid = np.linalg.norm((white - big) - np.clip(t, 0, 1)[..., None] * d, axis=-1)
    ts.append(t); rs.append(resid)
ts, rs = np.stack(ts), np.stack(rs)
owner = rs.argmin(0)                              # the ink whose blend line explains the pixel best

def to_path(mask):
    bm = potrace.Bitmap(~mask)                    # potracer fills False pixels: invert
    plist = bm.trace(turdsize=a.turd, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                     alphamax=1.0, opticurve=True, opttolerance=0.2)
    f = lambda p: f"{p.x / S:.2f} {p.y / S:.2f}"
    d = []
    for curve in plist:
        d.append("M" + f(curve.start_point))
        for seg in curve.segments:
            if seg.is_corner: d.append("L" + f(seg.c) + "L" + f(seg.end_point))
            else: d.append("C" + f(seg.c1) + " " + f(seg.c2) + " " + f(seg.end_point))
        d.append("Z")
    return "".join(d)

layers = []
for i, c in enumerate(cols):
    m = (owner == i) & (ts[i] > 0.5)
    if m.any(): layers.append((hexs(c), to_path(m), int(m.sum())))
layers.sort(key=lambda L: -L[2])                  # biggest layer first, details on top

def write(path, fill=None):
    body = "".join(f'<path fill="{fill or c}" d="{d}"/>' for c, d, _ in layers)
    open(path, "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{body}</svg>')
    print("wrote", path, f"{w}x{h}", len(layers), "layers")

write(a.out)
if a.light: write(a.out.replace(".svg", "-light.svg"), a.light)
