# Changelog — LLL Library

## Batch 2 — "What Are the Stars?" Collection, Phase 1 (2026-05-24)

New collection `what-are-the-stars/` added under the multi-collection structure laid down in Batch 1. This is Phase 1 of the page: the signature interactive ("Two Lenses") plus the full written study. Two additional interactives ("The Spectroscope" and "The Canon Walk") are scoped for Batch 2 of this page (a future commit) and are marked in place with `<!-- Batch 2: ... -->` placeholder comments.

### New collection

```
collections/what-are-the-stars/
├── index.html   ← semantic markup
├── styles.css   ← collection-local ivory/ink/gold palette
└── app.js       ← Two Lenses data + chip handlers, share/toast
```

### Visual identity

Distinct from Table of Nations' parchment + tri-color lineage. Identity is "observatory study desk":

- `--paper` `#fbfaf6` (warm ivory) — page background
- `--ink` `#1e2a3a` (deep slate) — page headings, telescope / science voice
- `--gold` `#8B6914` (library gold) — Scripture / scroll voice, ties this collection to TON's gold without copying it
- `--tel-bg` `#eef3f9` (cool blue) — telescope column
- `--scr-bg` `#faf6ed` (parchment) — scroll column

Headings remain `var(--font-display)` (Cinzel); science-voice column body in `var(--font-ui)` (Inter); Scripture-voice column body and all prose in `var(--font-body)` (EB Garamond). All palette tokens live in this collection's own `styles.css` — none promoted to `shared/styles.css` (per D-003).

### Signature interactive — "Two Lenses"

Reader picks a star the Bible names from four chips (The Pleiades, Orion, The Bear, The Morning Star) and sees two columns update simultaneously:

- **Through the telescope** — sans-serif, ink-soft, blue background. What spectroscopy can read from the light.
- **Through the scroll** — serif, gold accent with uppercase reference line, parchment background. What Scripture says.

Default selection on load: The Pleiades. Mobile (≤560px): columns stack vertically. Chips are real `<button>` elements with `role="tab"` and `aria-selected` toggled.

### Written study

Seven prose sections in the order: intro lede, How do they know? — Reading the light, What the Scriptures say the stars are for, Named and numbered by God, The host of heaven, The star that fell — Revelation 9:1, Holding it together — both/and. Followed by a 15-entry Scripture index list (reference + short gloss). All Scripture quotations are short, single-verse, ESV-consistent.

### Stats bar (thematic)

- 15 — Passages
- 4 — Named in Job
- 1 — Maker

### Header / footer

Same shape as TON: H1 + italic subtitle + verse + share row (Copy Link / Share / Print). Footer credits Growing Stone Fellowship and Jumpshots from The Bleachers Inc., plus the source note on ESV + spectroscopy / 1868 helium discovery.

### Print + mobile

Print styles hide chips and share row, force white backgrounds, and prevent break-inside on columns and study sections. Mobile breakpoint at 560px stacks the Two Lenses columns and reflows the Scripture index.

### Deferred to Batch 2 of this page (not in this commit)

- "The Spectroscope" interactive — placeholder comment at end of `<h2>How do they know? — Reading the light</h2>` section
- "The Canon Walk" interactive — placeholder comment above the Scripture index list

### Acceptance verification

- [x] `collections/what-are-the-stars/` created with `index.html`, `styles.css`, `app.js`
- [x] Header (title, subtitle, Psalm 147:4 verse, share row), stats bar, footer present and styled
- [x] Page has its own ivory/ink/gold identity; headings in Cinzel; no `shared/styles.css` changes
- [x] Two Lenses works: 4 chips, two columns (sans telescope / serif scroll), reference line, default Pleiades, mobile stacks
- [x] Full written study present verbatim in correct order; Scripture index list present
- [x] Batch 2 placeholder comments left for The Spectroscope and The Canon Walk
- [x] Print + mobile styles working
- [x] README, CHANGELOG, DECISIONS updated
- [x] Pushed to `main` (no force-push); live URL verified

---

## Batch 1 — Foundation Restructure (2026-05-02)

Reorganized the existing Table of Nations repo into the LLL Library multi-collection structure. No new content. The Table of Nations interactive itself is unchanged in behavior — same data, same filters, same visual design — but it now lives at a new path and pulls fonts/reset from a shared stylesheet.

### Repo & hosting

- GitHub repo renamed: `DoveLuvJR/table-of-nations` → `DoveLuvJR/lll-web` (manual rename via GitHub UI)
- Local repo cloned to `C:\Users\irwar\Documents\LLL-Web\`
- Vercel project unchanged; will continue auto-deploying from `main`. Live URL `table-of-nations.vercel.app` still resolves and now serves the new placeholder at root, with TON accessible at `/collections/table-of-nations/`

### Folder structure

```
LLL-Web/
├── index.html              ← placeholder ("LLL Library — Coming Soon" + link to TON)
├── about.html              ← placeholder for Batch 2
├── collections/
│   └── table-of-nations/   ← TON moved here
│       ├── index.html      ← split out from monolith
│       ├── styles.css      ← TON-specific styles
│       └── app.js          ← TON data + render functions
├── shared/
│   ├── styles.css          ← shared design tokens (fonts, reset, font-family vars)
│   ├── header.js           ← placeholder for Batch 2
│   ├── footer.js           ← placeholder for Batch 2
│   └── assets/             ← placeholder folder for Batch 2
├── CHANGELOG.md
├── DECISIONS.md
└── README.md
```

### Table of Nations migration

- The original 28KB monolithic `index.html` (CSS + JS inline) was split into three files for maintainability:
  - `index.html` — semantic markup only
  - `styles.css` — TON-specific CSS (color palette, components, layout)
  - `app.js` — `N` data array + filter/render/share functions
- All 70 nation entries preserved exactly
- All TON-specific colors (`--gold`, `--j`, `--h`, `--s`, etc.) stayed in TON's stylesheet — not promoted to shared. Hashem's directive: don't over-extract; the next two collections will reveal what is actually shared.
- TON now imports `../../shared/styles.css` first for fonts + reset, then its own `./styles.css` for collection styling.

### Shared design tokens (conservative extraction)

Only three things were promoted to `shared/styles.css`:
1. Google Fonts import (Cinzel, EB Garamond, Inter)
2. CSS reset (`*{margin:0;padding:0;box-sizing:border-box}`)
3. Three font-family CSS variables: `--font-display`, `--font-body`, `--font-ui`

Colors, spacing, components — left alone. Premature sharing creates fake reuse.

### Vercel routing

- No `vercel.json` added. Vercel's default static-file routing serves `/collections/table-of-nations/` from the directory's `index.html` automatically. If the deploy reveals routing issues, a `vercel.json` will be added in a follow-up.

### Acceptance verification

- [x] Repo cloned to `C:\Users\irwar\Documents\LLL-Web\`
- [x] GitHub repo renamed to `DoveLuvJR/lll-web` (Hashem did this manually)
- [x] Folder structure matches spec
- [x] TON files moved to `collections/table-of-nations/`
- [x] Internal paths updated (relative `./` and `../../` references)
- [x] Shared CSS extracted conservatively (fonts, reset, font-family vars only)
- [x] Placeholder `index.html` and `about.html` created
- [x] Empty `shared/header.js` and `shared/footer.js` created
- [x] CHANGELOG.md created
- [x] DECISIONS.md created
- [x] Local verification — static server probe, all 6 paths returned 200 with matching byte counts
- [x] Push to `main` (commit `89b639a`), Vercel auto-deploy succeeded
- [x] Live URL verification — `https://table-of-nations.vercel.app/` serves placeholder, `/collections/table-of-nations/` serves TON, all asset paths resolve

### Carry-forward to Batch 2

- Real homepage with collections grid replaces the placeholder
- Real `about.html` content from LLL Manifesto + Drenchy Theme
- Wire up shared header / footer
- Decide on the LLL custom domain and convert from `table-of-nations.vercel.app`
