# Step 3: culture areas by seeded watershed over the gray culture lines.
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage import morphology
from skimage.segmentation import watershed

im = Image.open('C:/Users/irwar/loc-scan/ct003648r-50.jpg')
im = im.resize((im.width // 2, im.height // 2), Image.LANCZOS)
a = np.asarray(im).astype(np.int32)
s = a.max(-1) - a.min(-1); m = a.mean(-1)
gray = (s < 24) & (m > 112) & (m < 163)
line = ndi.binary_opening(gray, morphology.disk(1))
line = morphology.remove_small_objects(line, max_size=40)

lab = np.load('lab.npy')
land = (lab != 19) & (lab != 20)
land[:, :60] = False; land[:, 2010:] = False; land[:70, :] = False; land[1300:, :] = False
land[960:1290, 1690:2010] = False
land = morphology.remove_small_objects(land, max_size=400)
land = ndi.binary_fill_holes(land)

AREAS = ['northwest-coast', 'plateau', 'california', 'great-basin', 'southwest',
         'plains', 'northeast', 'southeast', 'desert']
# seed points in display coords of the 2000px previews (x1.05 -> grid)
SEEDS = {
 'northwest-coast': [(205, 170), (160, 300), (130, 430)],
 'plateau': [(380, 220), (300, 270)],
 'california': [(190, 560), (175, 500), (230, 700)],
 'great-basin': [(450, 450), (600, 560)],
 'southwest': [(600, 820), (650, 760), (420, 830)],
 'plains': [(850, 450), (700, 450), (900, 800), (650, 230)],
 'northeast': [(1350, 400), (1700, 300), (1300, 620), (1100, 300)],
 'southeast': [(1350, 880), (1500, 700), (1550, 1050), (1100, 900)],
 'desert': [(900, 1120)],
}
markers = np.zeros(lab.shape, np.int32)
for i, n in enumerate(AREAS, 1):
    for x, y in SEEDS[n]:
        X, Y = int(x * 1.05), int(y * 1.05)
        assert land[Y, X], (n, x, y)
        markers[Y - 3:Y + 4, X - 3:X + 4] = i
elev = -ndi.distance_transform_edt(~line)  # valleys far from lines, ridges on lines
ws = watershed(elev, markers, mask=land)
np.save('ws.npy', ws)
pal = np.array([(255, 255, 255), (31, 119, 180), (255, 127, 14), (44, 160, 44), (214, 39, 40),
                (148, 103, 189), (140, 86, 75), (227, 119, 194), (127, 127, 127), (188, 189, 34)], np.uint8)
vis = pal[ws]; vis[line] = (0, 0, 0)
Image.fromarray(vis).save('ws_preview.png')
print({n: int((ws == i).sum()) for i, n in enumerate(AREAS, 1)})
