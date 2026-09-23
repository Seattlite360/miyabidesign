"""Trace the supplied Sylva logo artwork (not redraw) into layered SVGs.
Each colour layer is traced separately at 4x from the anti-aliased source."""
import numpy as np, potrace, sys
from PIL import Image

COLS = {"wordmark": (92, 77, 66), "face": (201, 129, 94), "side": (136, 85, 63)}
S = 4

def layers(path, box):
    im = Image.open(path).convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
    x0, y0, x1, y1 = box
    crop = bg.crop((x0, y0, x1, y1)).convert("RGB")
    big = np.asarray(crop.resize((crop.width * S, crop.height * S), Image.BICUBIC)).astype(float)
    out = {}
    # nearest ink colour per pixel, coverage from distance to white along that colour
    names = list(COLS); cols = np.array([COLS[n] for n in names], float)
    white = np.array([255, 255, 255.])
    ts, rs = [], []
    for c in cols:
        d = white - c
        t = ((white - big) @ d) / (d @ d)          # coverage: projection onto the white->colour line
        resid = np.linalg.norm((white - big) - np.clip(t, 0, 1)[..., None] * d, axis=-1)
        ts.append(t); rs.append(resid)
    ts, rs = np.stack(ts), np.stack(rs)
    owner = rs.argmin(0)                            # the colour whose blend line explains the pixel best
    for i, n in enumerate(names):
        out[n] = (owner == i) & (ts[i] > 0.5)
    return out

def to_path(mask, ox, oy):
    bm = potrace.Bitmap(~mask)   # potracer fills dark (False) pixels
    plist = bm.trace(turdsize=6, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
    f = lambda p: f"{p.x / S + ox:.2f} {p.y / S + oy:.2f}"
    d = []
    for curve in plist:
        d.append("M" + f(curve.start_point))
        for seg in curve.segments:
            if seg.is_corner: d.append("L" + f(seg.c) + "L" + f(seg.end_point))
            else: d.append("C" + f(seg.c1) + " " + f(seg.c2) + " " + f(seg.end_point))
        d.append("Z")
    return "".join(d)

def build(src, box, name, pad=6):
    L = layers(src, box)
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    paths = {n: to_path(m, 0, 0) for n, m in L.items() if m.any()}
    vb = f"0 0 {w} {h}"
    fills = {"side": "#88553F", "face": "#C9815E", "wordmark": "#5C4D42"}
    svg_file = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">' + "".join(
        f'<path fill="{fills[n]}" d="{paths[n]}"/>' for n in ("side", "face", "wordmark") if n in paths) + "</svg>" 
    open(f"/home/user/miyabidesign/sylva/img/logo/{name}.svg", "w").write(svg_file)
    return vb, paths

out = {}
# horizontal lockup (supplied image 2): mark + SYLVA, tagline excluded (y > 880)
out["h"] = build("images/8.webp", (470, 624, 1532, 875), "sylva-logo-horizontal")
# stacked lockup (supplied image 1): mark over SYLVA, tagline excluded (y > 930)
out["s"] = build("images/7.webp", (730, 480, 1300, 896), "sylva-logo-stacked")
# mark only, from the stacked artwork
out["m"] = build("images/7.webp", (924, 480, 1106, 712), "sylva-mark")
import json; json.dump({k: {"vb": v[0], "paths": v[1]} for k, v in out.items()}, open("scratchpad/logo_paths.json", "w"))
print({k: (v[0], {n: len(p) for n, p in v[1].items()}) for k, v in out.items()})
