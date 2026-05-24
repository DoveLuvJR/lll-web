# Changelog — LLL Library

## Batch 4 — Stars Page Batch 2: Spectroscope + Canon Walk (2026-05-24)

Closes out the "What Are the Stars?" collection by filling in the two interactives that were scoped and placeholder-commented in the original Batch 1 plan. Both elements live in the page's own files; no other collection or shared stylesheet is touched. Both `<!-- Batch 2: ... -->` placeholder comments have been removed.

### The Spectroscope

- Inserted at the end of the "How do they know? — Reading the light" section, replacing the placeholder comment
- A 64px spectrum band rendered as a left-to-right visible-light CSS `linear-gradient` (~380nm violet → ~700nm red), with thin dark vertical absorption lines positioned by the formula `left = (nm - 380) / 320 * 100` (percent across the band)
- Five element chips: **Hydrogen** (default), **Helium**, **Sodium**, **Iron**, **The Sun**. Real `<button>`s with `role="tab"` and `aria-selected`
- ~588nm line gets a subtle gold tint when **Helium** or **The Sun** is selected — the "1868" line that put helium in the periodic table from the sun's light first
- Readout `<p>` below the band, wired as the band's `aria-describedby`
- The page's gradient ban is intentionally broken **only here** — the band is literally a rainbow, every other surface stays flat
- Mobile: chips wrap, band shortens to 52px

### The Canon Walk

- Inserted above the Scripture index, replacing the placeholder comment. The plain Scripture index list stays in place beneath it as the static quick-reference (also important for print and accessibility)
- A thin deep-navy (`#0a1026`) sky strip spans the section, with one dot per passage joined by a faint connecting line — a constellation forming as the reader steps through
- Dots up to and including the current step are "lit"; the current dot is brightest; later dots are dim. Dots are clickable `<button>`s for jumping. The final dot (Revelation 22:16) renders larger and in `--gold-light` — Christ as the bright morning star
- Verse panel below the sky: gold reference label, italicized verse text (curly quotes), one-line gloss. Panel is wrapped in `aria-live="polite"` so screen readers announce the current verse on step
- Controls: `← Previous`, position label (`n of 17`), `Next →`. Previous is disabled at step 1; Next is disabled at step 17 and the closing note appears: *From the fourth day of creation to the last page of Revelation, the testimony lands on a Person: Christ, the bright morning star.*
- Linear walk — does **not** auto-advance
- All 17 passages, in canonical order: Gen 1:14 · Deut 4:19 · Judg 5:20 · Job 38:7 · Job 38:31–32 · Ps 19:1 · Ps 147:4 · Isa 14:12 · Isa 40:26 · Ezek 1:16 · Dan 8:10 · Luke 10:18 · Jude 1:13 · Rev 1:20 · Rev 9:1 · Rev 12:4 · Rev 22:16

### Page now carries four interactive elements by design

This is the library's deliberately most-interactive collection: **Two Lenses** (frame the tension), **The Spectroscope** (answer the science), **The Canon Walk** (gather the whole testimony), plus the **Perspectives from the Fellowship** accordion (community voices). See DECISIONS.md D-011 for the rationale on why this page is an intentional exception to the usual one-signature-per-collection pattern.

### Acceptance verification

- [x] Spectroscope added in the "Reading the light" section; five elements; default Hydrogen; 588nm line gold-tinted for Helium/Sun; gradient band only here
- [x] Canon Walk added above the index; all 17 passages in canonical order; Prev/Next + clickable dots + position label; progressive dot lighting; Revelation 22:16 finale with closing note; Prev disabled at start, Next disabled at end
- [x] Plain Scripture index list still present below the Canon Walk; stats bar still reads 17
- [x] Both `<!-- Batch 2: ... -->` placeholder comments removed; Two Lenses + Perspectives accordion still working
- [x] No edits to other collections, `shared/styles.css`, or `shared/site.css`
- [x] CHANGELOG + DECISIONS updated
- [x] Page works on mobile (chips wrap, dots stay in a row, controls stack); print styles hide live controls and keep the static index clean
- [x] Pushed to `main` (no force-push); live URL verified

---

## Batch 3 — Library Hub + Fellowship Perspectives (2026-05-24)

Three things in one commit: the homepage stops being a placeholder, a real `/collections/` landing page joins it, and the Stars page gains a "Perspectives from the Fellowship" accordion (plus two new Scripture index entries).

### Rebrand — "Growing Stone Library"

The public-facing name is now **Growing Stone Library**. The previous placeholder homepage framed this site as "a covenant community before it is a clothing brand" and named the apparel project; all apparel/clothing/brand language is removed from the homepage and from the README's top description. The GitHub repo (`DoveLuvJR/lll-web`) and the Vercel project name are unchanged — only on-page text and docs were updated. The footer line `Compiled for the Growing Stone Fellowship · Jumpshots from The Bleachers Inc.` is preserved everywhere it appears.

### Homepage (`/`)

- Replaced the placeholder `index.html` entirely with a real hub: hero (eyebrow + Cinzel title + italic tagline + lede) and two doorway cards
- **Collections** (live, full `<a>` to `/collections/`) — Tabler-style books icon, description, gold meta line `Table of Nations · What Are the Stars?`, CTA `Enter the collections →`
- **The Vault** (coming-soon, non-clickable, dashed border, muted text) — headphones-style icon, `Recorded teachings from the Fellowship's Sabbath classes.`, small `Coming soon` pill
- Cards stack vertically at ≤560px

### Collections landing (`/collections/`)

- New `collections/index.html` — Vercel's default static routing serves it at `/collections/` without a `vercel.json` (per D-005)
- Header: back-link `← Growing Stone Library` to `/`, Cinzel H1 `Collections`, italic lede `Interactive studies and reference guides. Tap one to begin.`
- Responsive grid `repeat(auto-fit, minmax(260px, 1fr))` with two live cards (TON, What Are the Stars?) — each a full `<a>` with hover lift

### Shared site chrome (`shared/site.css`)

- New site-level stylesheet, used by the homepage and the collections landing only
- Holds the "ivory study" tokens (`--ink`, `--gold`, `--paper`, `--paper-2`, `--line`, etc.) and components (`.hero`, `.doors`, `.door`, `.coll-hdr`, `.coll-grid`, `.coll-card`, `.site-footer`)
- `shared/styles.css` is **untouched** — still fonts + reset + three font-family vars only (D-003 stands; per-collection palettes are still local)

### Stars page additions (`collections/what-are-the-stars/`)

- New section **Perspectives from the Fellowship** inserted after "Holding it together — both/and" and before the Scripture index
- Accordion of two expandable cards, each with a `<button>` header (title + italic teaser + chevron), `aria-expanded` toggled on click, max-height transition for body
  - Card 1: *Stars as lights, signs, and spiritual markers* — reads first through Scripture, with a fair question for the science
  - Card 2: *Stars as the faithful host; planets as wandering stars* — `planētēs` / `planaō` / Jude 1:13 / Ezekiel 1:16
- Closing line under the cards: *More perspectives may be added as the Fellowship continues to search the Scriptures together.*
- Stats bar passages stat updated **15 → 17**
- Scripture index gains two entries in canonical order:
  - `Ezekiel 1:16` — a wheel within a wheel (between Isaiah 40:26 and Daniel 8:10)
  - `Jude 1:13` — wandering stars, reserved for the gloom of darkness (between Luke 10:18 and Revelation 1:20)
- Accordion JS appended to existing `app.js`; Two Lenses still works untouched
- Print styles updated: perspectives expand for print, chevrons hidden

### Acceptance verification

- [x] Root `index.html` is the Growing Stone Library hub; zero apparel/clothing/brand references; two doorways (Collections live → `/collections/`, Vault coming-soon non-link)
- [x] `collections/index.html` created; serves at `/collections/`; exactly two live collection cards, each linking correctly
- [x] `shared/site.css` created; `shared/styles.css` untouched; no per-collection styles changed
- [x] Stars page: Perspectives accordion added between both/and and the index; two cards expand/collapse with `aria-expanded`; Two Lenses still works
- [x] Scripture index includes Ezekiel 1:16 and Jude 1:13 in canonical order; stats bar reads 17 Passages
- [x] README, CHANGELOG, DECISIONS updated
- [x] All four routes (`/`, `/collections/`, `/collections/table-of-nations/`, `/collections/what-are-the-stars/`) return 200; mobile stacking verified
- [x] Pushed to `main` (no force-push); live URLs verified

---

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
