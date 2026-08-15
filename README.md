# Growing Stone Library (`lll-web`)

A study library for the Growing Stone Fellowship — interactive Scripture studies and reference guides, built in vanilla HTML/CSS/JS and deployed to Vercel. The repo is named `lll-web` for historical reasons; the public-facing library is the **Growing Stone Library**.

> *"Search the Scriptures, and see what is written."*

## Structure

```
LLL-Web/
├── index.html              ← Growing Stone Library hub (real homepage)
├── about.html              ← placeholder (out of scope for current batch)
├── collections/
│   ├── index.html          ← /collections/ landing page (live)
│   ├── table-of-nations/   ← interactive Genesis 10–11 study tool
│   └── what-are-the-stars/ ← lights, signs, and the host of heaven
├── shared/
│   ├── styles.css          ← fonts + reset + font-family tokens (kept minimal)
│   ├── site.css            ← site-level chrome for the hub + collections landing
│   ├── header.js           ← shared nav (placeholder)
│   ├── footer.js           ← shared footer (placeholder)
│   └── assets/
├── CHANGELOG.md
├── DECISIONS.md
└── README.md
```

## Collections

| Collection | Status | Path |
|---|---|---|
| Table of Nations | Live | `/collections/table-of-nations/` |
| What Are the Stars? | Live | `/collections/what-are-the-stars/` |
| Why Was the Tree Reachable? | Live | `/collections/why-was-the-tree-reachable/` |
| The Spiral and the Line | Live | `/collections/the-spiral-and-the-line/` |
| Cellular Engineering | Planned | `/collections/cellular-engineering/` |
| Drenchy Breakdown | Planned | `/collections/drenchy-breakdown/` |

## Develop locally

No build step. Open `index.html` in a browser, or serve the folder statically:

```
python -m http.server 8000
# then visit http://localhost:8000/
```

## Deploy

Push to `main`. Vercel auto-deploys.

## Reference

- Platform plan: `C:\Users\irwar\Documents\Hashem-Brain\01-Projects\LLL\Library\PLATFORM-PLAN.md`
- Batch 1 kickoff: `C:\Users\irwar\Documents\Hashem-Brain\01-Projects\LLL\Library\BATCH-001-KICKOFF.md`
