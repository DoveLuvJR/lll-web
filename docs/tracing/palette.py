# Stock fills for Widget 3. Neighbours are separated by a seam drawn in the page
# background colour (WCAG 1.4.11: adjacent colours distinguished by a contrasting border).
# Every fill must reach 3:1 against BOTH seams: the light page and the dark page.
import json

LIGHT_BG, DARK_BG = '#ffffff', '#151a1e'

def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

PAL = {
 'na-dene': '#4f86b8', 'algonkian': '#c0577a', 'gulf': '#b5462f', 'tonkawa': '#8f7a4e',
 'siouan-yuchi': '#4d8f6a', 'iroquoian': '#8a5cb0', 'caddoan': '#a8862a',
 'hokan-coahuiltecan': '#6f8a3a', 'penutian': '#c06e3c', 'aztec-tanoan': '#a24f9a',
 'keres': '#9a8a18', 'yukian': '#3f6fd0', 'kutenai': '#3f8f8f', 'karankawa': '#5a9a40',
 'chimakuan': '#d0405a', 'salish': '#c7802a', 'wakashan': '#7d7a5a', 'timucua': '#c56a8a',
 'insufficient': '#8a8780',
}
bad = []
for f, c in PAL.items():
    rl, rd = ratio(c, LIGHT_BG), ratio(c, DARK_BG)
    print(f'{f:20s} {c} L={lum(c):.3f} vsLight={rl:.2f} vsDark={rd:.2f}')
    if rl < 3 or rd < 3:
        bad.append(f)
print('FAIL' if bad else 'ALL PASS', bad)
json.dump(PAL, open('palette.json', 'w'))
