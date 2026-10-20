# Map tracing (Batch 21)

Reproduces the inline SVG outlines from the LOC scan (item 95682185, `ct003648r`, 50% IIIF copy saved to `C:\Users\irwar\loc-scan\`). Run in order: `trace1.py` (classify legend colours), `trace3.py` (culture areas by seeded watershed over the gray lines), `trace4.py` (simplify to paths). Output: `paths.json`, in a 2093x1421 grid (25% of full size). Three false Na-Dene specks (min x > 1100) were dropped by hand after `trace4.py`. Docs only; never served.
