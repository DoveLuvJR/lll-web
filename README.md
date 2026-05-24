# LLL Library (`lll-web`)

The theological and intellectual foundation of the LLL apparel brand. A multi-collection interactive study site, built in vanilla HTML/CSS/JS, deployed to Vercel.

> *"LLL is a covenant community before it is a clothing brand. The garments are the most visible expression of something deeper."* — LLL Manifesto

## Structure

```
LLL-Web/
├── index.html              ← library hub (placeholder, real homepage in Batch 2)
├── about.html              ← LLL identity (placeholder)
├── collections/
│   └── table-of-nations/   ← interactive Genesis 10–11 study tool
├── shared/
│   ├── styles.css          ← fonts + reset + font-family tokens (kept minimal)
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
| Cellular Engineering | Planned (Batch 3) | `/collections/cellular-engineering/` |
| Drenchy Breakdown | Planned (Batch 5) | `/collections/drenchy-breakdown/` |

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
