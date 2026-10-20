# Step 4: raster labels -> simplified SVG path data for culture areas and language stocks.
import json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from skimage import measure, morphology

lab = np.load('lab.npy'); ws = np.load('ws.npy')
H, W = lab.shape
FAMS = ['na-dene', 'algonkian', 'gulf', 'tonkawa', 'siouan-yuchi', 'iroquoian', 'caddoan',
        'hokan-coahuiltecan', 'penutian', 'aztec-tanoan', 'keres', 'yukian', 'kutenai',
        'karankawa', 'chimakuan', 'salish', 'wakashan', 'timucua', 'insufficient']
AREAS = ['northwest-coast', 'plateau', 'california', 'great-basin', 'southwest',
         'plains', 'northeast', 'southeast', 'desert']

land = ws > 0
# remove the scan crease running into the Gulf of Mexico (display 1090-1340 x, below the delta)
cut = np.zeros_like(land)
cut[int(1048 * 1.05):int(1180 * 1.05), int(1085 * 1.05):int(1345 * 1.05)] = True
land &= ~cut
land = ndi.binary_opening(land, morphology.disk(3))
land = morphology.remove_small_objects(land, max_size=300)
ws = np.where(land, ws, 0)

def paths(mask, tol=1.6, min_area=120):
    mask = morphology.remove_small_objects(mask, max_size=min_area)
    mask = ndi.binary_fill_holes(mask) if mask.sum() < 4000 else mask
    pad = np.pad(mask, 1).astype(float)
    out = []
    for c in measure.find_contours(pad, 0.5):
        c = measure.approximate_polygon(c, tol)
        if len(c) < 4:
            continue
        ys, xs = c[:, 0] - 1, c[:, 1] - 1
        area = 0.5 * abs(np.dot(xs, np.roll(ys, 1)) - np.dot(ys, np.roll(xs, 1)))
        if area < min_area:
            continue
        pts = ' '.join(f'{x:.0f} {y:.0f}' for x, y in zip(xs, ys))
        out.append((area, 'M' + pts.replace(' ', ',', 0) + 'Z', list(zip(xs, ys))))
    return out

res = {'viewBox': [W, H], 'areas': {}, 'families': {}}
for i, n in enumerate(AREAS, 1):
    res['areas'][n] = paths(ws == i, min_area=400)
# drop specks: components under 350 px are refilled from their neighbours,
# except the stocks that are genuinely tiny on this sheet
fl = np.where(land, lab, -1)
KEEP_SMALL = {'na-dene', 'keres', 'yukian', 'chimakuan', 'wakashan', 'kutenai', 'karankawa'}
for i, n in enumerate(FAMS):
    if n in KEEP_SMALL:
        continue
    cc, k = ndi.label(fl == i)
    if not k:
        continue
    sz = ndi.sum(np.ones_like(cc), cc, range(1, k + 1))
    bad = np.isin(cc, [j + 1 for j, z in enumerate(sz) if z < 350])
    fl[bad] = -2
for n in ('ocean', 'outland'):
    pass
fl[(fl >= len(FAMS))] = -2  # background classes inside land are linework residue
known = fl >= 0
idx = ndi.distance_transform_edt(~known, return_distances=False, return_indices=True)
fl = np.where(land, fl[idx[0], idx[1]], -1)
# majority-smooth family labels inside land once more so slivers along tribe lines vanish
for i, n in enumerate(FAMS):
    m = fl == i
    if n == 'kutenai':
        m[300:, :] = False  # only the Idaho/Montana panhandle carries Kutenai on this sheet
    res['families'][n] = paths(m, min_area=150)

# render check image in the legend's own colours
import importlib.util
LEG = {'na-dene': (179, 199, 219), 'algonkian': (218, 151, 171), 'gulf': (203, 97, 120), 'tonkawa': (222, 214, 201), 'siouan-yuchi': (203, 213, 211), 'iroquoian': (149, 86, 125), 'caddoan': (239, 230, 189), 'hokan-coahuiltecan': (209, 213, 180), 'penutian': (229, 197, 169), 'aztec-tanoan': (205, 147, 171), 'keres': (238, 225, 145), 'yukian': (121, 165, 204), 'kutenai': (144, 175, 174), 'karankawa': (174, 190, 146), 'chimakuan': (191, 55, 95), 'salish': (213, 146, 101), 'wakashan': (169, 164, 136), 'timucua': (215, 148, 159), 'insufficient': (176, 174, 172)}
img = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(img)
rng = np.random.default_rng(7)
for n, ps in res['families'].items():
    col = LEG[n]
    for _, _, pts in ps:
        d.polygon(pts, fill=col)
for n, ps in res['areas'].items():
    for _, _, pts in ps:
        d.line(pts + [pts[0]], fill='black', width=3)
img.save('paths_preview.png')
json.dump({k: ({n: [p[1] for p in v] for n, v in res[k].items()} if k != 'viewBox' else res[k]) for k in res},
          open('paths.json', 'w'))
print({n: len(v) for n, v in res['areas'].items()})
print({n: len(v) for n, v in res['families'].items()})
import os; print(os.path.getsize('paths.json'))
