# Step 1: per-pixel classification of the LOC scan into legend colors + background + linework.
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = 'C:/Users/irwar/loc-scan/ct003648r-50.jpg'
S = 0.5  # work at 25% of full (half of the 50% file) for speed
im = Image.open(SRC)
im = im.resize((int(im.width * S), int(im.height * S)), Image.LANCZOS)
a = np.asarray(im).astype(np.float32)
H, W, _ = a.shape

FAM = {
 'na-dene': (179, 199, 219), 'algonkian': (218, 151, 171), 'gulf': (203, 97, 120),
 'tonkawa': (222, 214, 201), 'siouan-yuchi': (203, 213, 211), 'iroquoian': (149, 86, 125),
 'caddoan': (239, 230, 189), 'hokan-coahuiltecan': (209, 213, 180), 'penutian': (229, 197, 169),
 'aztec-tanoan': (205, 147, 171), 'keres': (238, 225, 145), 'yukian': (121, 165, 204),
 'kutenai': (144, 175, 174), 'karankawa': (174, 190, 146), 'chimakuan': (191, 55, 95),
 'salish': (213, 146, 101), 'wakashan': (169, 164, 136), 'timucua': (215, 148, 159),
 'insufficient': (176, 174, 172),
}
BG = {'ocean': (219, 224, 227), 'outland': (222, 219, 216)}
names = list(FAM) + list(BG)
cols = np.array([FAM.get(n, BG.get(n)) for n in names], np.float32)

# smooth first so JPEG noise and thin text matter less
b = np.stack([ndi.median_filter(a[..., c], size=5) for c in range(3)], -1)
d = ((b[:, :, None, :] - cols[None, None]) ** 2).sum(-1)
lab = d.argmin(-1)
dist = np.sqrt(d.min(-1))

# linework: white tribal lines, dark text, blue rivers, gray culture lines -> unknown (-1)
mx, mn = a.max(-1), a.min(-1)
white = (mn > 236)
dark = (mx < 110)
mnf = a.min(-1)
tribal = (mnf - ndi.median_filter(mnf, size=9)) > 14
unknown = white | dark | tribal | (dist > 28)
lab = lab.astype(np.int32)
lab[unknown] = -1

# fill unknown from nearest known pixel
idx = ndi.distance_transform_edt(lab < 0, return_distances=False, return_indices=True)
lab = lab[idx[0], idx[1]]
# majority clean-up: repeat a small mode filter via per-class box counts
K = len(names)
for _ in range(2):
    counts = np.stack([ndi.uniform_filter((lab == k).astype(np.float32), size=9) for k in range(K)], 0)
    lab = counts.argmax(0)

np.save('lab.npy', lab)
pal = np.array([FAM.get(n, BG.get(n)) for n in names], np.uint8)
Image.fromarray(pal[lab]).save('lab_preview.png')
print(W, H, {n: int((lab == i).sum()) for i, n in enumerate(names)})
