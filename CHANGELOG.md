# Changelog — LLL Library

## Batch 9 — Tree Study, Second Revision Pass (2026-08-01)

Navigation, alignment, and the epigraph. The study stays **one page at one URL — permanently closed as a question.**

### Content source re-pulled

Card summaries trimmed (three of four had been repeating their own "accounts for" box); a forward link to the limits added inside "A different question"; `2 Trees` replaced by **`5 Limits`** in the stat bar, so the self-critique is advertised on arrival by a real count rather than a decorative one; reading time written into the source.

### The TOC persists (Task 1)

A map that exists only at the trailhead is not a map. Fourteen of fifteen screens had no navigation.

- **Wide screens (≥1140px):** a fixed rail beside the column, current section marked as the reader scrolls
- **Narrow screens:** a 46px sticky bar naming the current section, expanding to the full outline. Tapping an entry closes it; Escape closes it
- **h3 sub-sections included** — the ten under "A different question" and "After the crossing" were invisible to the old TOC
- **Deks shown in the nav**, which is where they earn the most: they were written to make opaque headings legible out of context

Both are **built from the document's own h2/h3 elements by `app.js`**, so the outline has one source of truth and no duplicated copy for Ctrl+F to trip over. Neither is content. The static hero TOC remains as the arrival view and the no-JS fallback. Recorded as **D-015**.

Nav chrome is `user-select: none`, so a group-chat paste stays clean, and is hidden from print.

### Epigraph restored (Task 2)

Genesis 2:9 is back, between the stat bar and the TOC. It is load-bearing: it establishes that there were **two** trees, both in the midst, before the reader meets a single argument, and the whole second half depends on that.

### Three deks added (Task 3)

"Word and sword", "Where this cuts back", "The sword is not the last word" — eight deks total.

### Card alignment (Task 4)

`align-items: start` → `stretch`, plus **subgrid** so the four cards share row tracks. "What it leaves open" now begins at the **identical pixel** across each pair — measured delta **0px**, against 452px vs 576px before. Cards in a row are equal height (524/524 and 526/526). Without subgrid support the cards still render and simply lose cross-card alignment.

### Footer (Task 6)

First-published date, and a pager to both sibling studies alongside "All collections".

### Verified by eye at 375px, not measured (Task 5)

Screenshots at a real 375px viewport, which caught **two bugs that measurement alone would have scored as passing:**

1. **The sticky bar never appeared.** `has-js` was set on `<html>` and `scrolled` on `<body>`, so the selector `.has-js.scrolled` could never match a single element. Both flags now live on `<html>`.
2. **Deep links left the bar hidden.** A hash jump happens after the script runs and fires no scroll event, so the first visibility pass ran against `scrollY: 0`. Added `load` and `hashchange` passes.

Confirmed visually: card grid collapses to one column; the long Genesis 2:16–17 quote wraps across five lines with no overflow; the sticky bar costs 46px of 820 (5.6%); the stat bar was wrapping 3-then-1 and orphaning "18 Min Read", now a 2×2 grid.

**Fold positions at 375px** (hero tightened to recover room lost to the epigraph):

| Element | Position | 375×820 | 375×667 (SE) |
|---|---|---|---|
| "5 Limits" stat | 335–376 | above fold | above fold |
| Epigraph | 405–499 | above fold | below fold |
| TOC "What this reading does not do" | 804–844 | top edge visible | below fold |

The limits link no longer fully clears the fold on any phone — the restored epigraph costs about 100px, and per Task 2 that trade is correct. The **"5 Limits" stat now carries the arrival disclosure instead**, and clears the fold on both.

### Acceptance verification (Batch 8 suite re-run)

- [x] Prose vs re-pulled source: **zero unexplained differences**
- [x] Scripture index: 20 entries, 20/20 linked
- [x] Five limits in full; stat bar reads 20 · 4 · 5 · 18
- [x] Heading ids: 9/9 h2, 14/14 h3; 16/16 in-page anchors resolve
- [x] Select-all captures all three drift states, both components, the forward note, and the date — **every probe confirmed unique in the source before testing**, per the rule added to GOTCHAS.md
- [x] Print: all three drift states `block`, cards 2-up, rail/bar/pager/TOC dropped, 7 limit paragraphs
- [x] Console: **0 errors, 0 warnings**
- [x] Copper still at exactly two placements; zero dependencies; zero API calls
- [ ] Print preview by eye — carried over, Hashem's with Ctrl+P
- [ ] Editorial Verification — **not self-certified**

---

## Batch 8 — Tree Study Revision Pass (2026-08-01)

Revision of the Batch 7 study after a second review. The study stays **one page at one URL** — a proposal to split it into four spoke pages plus a standalone index was rejected, on the grounds that moving the limits section to its own URL makes it *less* likely to be read, and the reader is a brother on a phone before dojo who wants one scroll, one link, one Print button, one Ctrl+F.

The problem underneath that proposal was real, though: 3,565 words with no map on entry. The fix is navigation, not fragmentation.

### Content source re-pulled

Three upstream edits: Scripture index cut from 24 to 20 (Genesis 3:6, Joshua 24:15, Romans 7:7, and 1 Corinthians 10:13 were indexed but cited nowhere in the body); the Genesis 2:17 point in "What the text gives us" trimmed to a clause ending "More on this below," so "But a reason is given" lands as a turn rather than a repeat; and section 6 renamed **"The guard moves" → "After the crossing"**, since three of its five sub-sections are about the arrangement that follows rather than the guard's movement.

### Navigation (Task 1)

- **Table of contents** in the hero, below the stat bar and above the epigraph. Eight top-level sections plus a Scripture-index link set apart as back matter
- **Reading time** in the stat bar: 18 min (3,565 words at 200 wpm)
- **Deks** — one-line grey subtitles under the five headings that say nothing out of context
- **Heading ids on all 23 headings** (9 h2, 14 h3), slugified. Was 4 of 20; the study is now fully deep-linkable and citable

The TOC is **compacted on mobile rather than collapsed.** Collapsing would defeat the reason it exists — a reader landing cold must *see* that "What this reading does not do" is coming. Header and stat bar were trimmed on phones to buy the room: all eight entries now sit above the fold on a 375×820 screen (last item ends at 787px, was 838px).

### Tabs became static cards (Task 2)

Section 5's rhetorical move is **comparison** — "all four would be satisfied by a tree behind a wall" only works if the reader can hold four readings at once, and a tab strip is the one layout that makes that impossible. The four-tab picker is now four static cards, 2×2 on desktop and stacked on mobile, each carrying name and attribution, the one-line summary, then both columns.

The prose block that restated all four beneath the tabs is deleted; its content is the summary line inside each card. The section no longer says everything twice.

This removes a whole class of problems at once: no `hidden` attributes, prints correctly, Ctrl+F finds everything, translation tools work, no-JS is moot. `app.js` dropped from 122 lines to 71 — all tab, arrow-key, and roving-tabindex code is gone. Recorded as **D-014**.

### Drift widget (Tasks 3, 5)

- **Moved** to immediately after "What the text gives us," before "Four older readings." It is a textual observation and belongs with the textual material, where it primes the reader instead of sending them from Revelation back to Genesis 3 after the argument has closed
- **Made static and stacked.** All three retellings now render at once. See below — this replaced the stepper entirely
- The reported "initializes on state 3" defect did not reproduce. Verified on fresh cache-busted loads before and after the rewrite: state 1, Previous disabled, showing "Of every tree of the garden thou mayest freely eat." The likely cause of the report is a page someone had already stepped through. The concern underneath it — that the sequence was not discoverable from unlabelled dots — is resolved by stacking, which shows all three without any control at all

### Section order

| # | Section |
|---|---|
| 1 | Header, stat bar, TOC, epigraph |
| 2 | The question |
| 3 | What the text gives us |
| 4 | How the command moved *(moved)* |
| 5 | Four older readings |
| 6 | A different question |
| 7 | After the crossing |
| 8 | What this reading does not do |
| 9 | Holding it together |
| 10 | Scripture index + sources |

### Acceptance verification (full Batch 7 suite re-run)

- [x] Prose vs re-pulled source: **zero unexplained differences.** The four reading lines now transfer verbatim — a Batch 7 capitalization slip ("An emphasis common in Jewish reading" for the source's lowercase "an") was caught and fixed by putting name and attribution on one line
- [x] Scripture index: 20 entries, **20/20 linked** to the section where the passage is discussed
- [x] All five limits render in full, in sequence, above the index
- [x] Proportions: spine 48.0% of the study, **4.00× section 5** (was 6.37× — section 5 grew from 7.8% to 12.0% because cards are taller than a tab strip). Still visibly dominant, still 19px against section 5's 16px
- [x] Copper still at exactly two placements
- [x] Print verified by forcing the `@media print` block through the live cascade via CSSOM: **all three drift states resolve to `display: block`**, cards print 2-up, TOC and controls drop out
- [x] No-JS: 3/3 drift states, 4/4 cards with both columns, TOC and links functional
- [x] 375px: no horizontal overflow, cards stack, both columns 286px at 15px, controls 44px
- [x] Console clean — only MetaMask extension messages, none from the page
- [x] Zero dependencies, zero API calls, zero external references
- [x] Tag balance, id uniqueness, 16/16 in-page anchors resolve, no tab remnants
- [x] **Select-all-copy captures all three drift states** — after the widget was made static. See below
- [ ] Editorial Verification — **not self-certified.** Flagged for Hashem

### The drift widget was made static too

Task 4 asked for select-all to be verified rather than assumed. It failed: selecting the whole page captured the "As given" state and nothing else, because `hidden` content is not selectable and Ctrl+F will not find it either. An earlier probe appeared to pass, but that was a false result — the string tested also appears in the Scripture index gloss. Re-testing with strings unique to each state showed states 2 and 3 both lost.

Ruled: stack them. All three retellings now render at once, the same call made for the four readings in Task 2 and for the same reason.

**What this removed, beyond the defect:**

- The `has-js` class and the inline `<script>` in `<head>` — nothing needs progressive enhancement now
- The Previous/Next and named step buttons added earlier in this batch
- The print stylesheet's `[hidden]` override — there is nothing left to un-hide
- `app.js` is now **41 lines**, down from 122 at the start of the batch. It contains the share row and nothing else. If it fails to load, three buttons stop working and the study is otherwise untouched

**It also reads better.** The section's observation is that the command was expanded and then inverted. Stacked, the addition and the negation sit on screen together, which is the comparison the prose is making. Stepping hid half of it at any moment.

Recorded as **D-014**, which now carries no live exceptions.

---

## Batch 7 — "Why Was the Tree Reachable?" Collection (2026-08-01)

Third collection. A Genesis 2–3 study asking not why the tree was forbidden but why it was placed within reach. Four traditional readings are presented as the ground the argument stands on; the study's own reading is advanced as the spine of the page and shipped with a full limits section.

### New collection

- `collections/why-was-the-tree-reachable/` — `index.html` + `styles.css` + `app.js`, matching the D-002 folder convention
- Third card added to `collections/index.html` (`Genesis 2–3`). This is the only edit outside the new folder — the two existing studies are untouched
- Ten sections in fixed order; sections 5 ("A different question") and 6 ("The guard moves") are wrapped in a shared `.spine` container with one continuous left rule so they read as one argument in two halves

### Proportions are the argument

Measured in the browser against the rendered page:

| Section | Height | Share of study |
|---|---|---|
| 4 — Four older readings (compressed) | 861px | 7.8% |
| 5 — A different question | 2811px | 25.5% |
| 6 — The guard moves | 2639px | 23.9% |
| **5 + 6 together (the spine)** | **5484px** | **49.7%** |

The spine is 6.37× section 4. Section 4 is set at 16px against the spine's 19px. A reader who only skims can see where the study points.

### Visual identity — pressed leaf under lamplight

Own palette per D-003: deep pine ink (`--ink #14291e`) on bone (`--paper #f7f5ee`), muted moss chrome (`--gold #5a6b4e`), and a single copper flame (`--flame #b4531c`) held in reserve.

**The copper is spent on exactly two selectors, and they rhyme:** `.moved` (the changed words in the drift panel) and `.sword-rule` (the blade in "Word and sword"). The same color marks the words that moved and the blade that followed. It appears on no heading, link, button, or chip. A third use on `.drift-tag` was caught during self-check and moved to chrome accent.

Contrast verified against both grounds: `--ink` 14.1:1, `--text2` 6.0:1, `--gold` 5.3:1, `--flame` 4.6:1, `--muted` 4.9:1 on parchment / 5.4:1 on bone. `--muted` was deliberately raised above the stars page's value rather than inheriting it — those labels render at 10–11px, so large-text thresholds do not apply.

### Two interactives — all states rendered in HTML

Both components depart from the stars page pattern, per D-012. Every state ships in the markup; JavaScript only toggles the `hidden` attribute. It never injects content.

**Lens picker (section 4)** — four traditional readings: Freedom, Maturity, Trust, Seizure. Two columns per lens, always visible together; "What it leaves open" is never collapsed or de-emphasized. The two column grounds are matched in luminance (0.847 vs 0.849) and border weight so neither reads as the more solid box. Default is Freedom. Arrow-key navigation added, expected of `role="tablist"`.

The hinge line — *All four would be satisfied by a tree behind a wall.* — sits outside every tab state and is always visible.

**Drift panel (section 7)** — three states: as given (Genesis 2:16–17), as retold (Genesis 3:3, `neither shall ye touch it` marked), as answered (Genesis 3:4, negation marked). Forward/back plus a clickable three-dot indicator, so no state is a dead end. *No one has eaten yet.* persists across all three. Framed as a plain observation about the text — no styling ties it to the spine.

### Accessibility

- `prefers-reduced-motion` block added. This is the first page in the repo to honor it; the existing studies are untouched and still do not
- Real `<button>` elements throughout, visible focus rings, roving tabindex on the lens tabs
- No horizontal overflow at 375px; lens columns stack to a single column with a 10px gap, both rendering identically at 153×324

### Acceptance verification

- [x] Prose diffed against source: 91/94 paragraphs verbatim; the 3 remaining are the drift states, restructured by Component Spec 2 into label/quote/reference (no words added or removed)
- [x] All 24 Scripture index references render; every inline KJV quotation checked against the text
- [x] All five limits in "What this reading does not do" render in full, in sequence, above the Scripture index
- [x] No-JS: 4/4 lens panels and 3/3 drift states visible and readable; chips and controls hidden rather than left dead; zero blank boxes
- [x] Console clean — the only messages are from a MetaMask extension content script, none from the page
- [x] Zero dependencies, zero API calls, zero external `src`/`href` (per D-013)
- [x] Tag balance, id uniqueness, and every JS/aria id target verified
- [ ] Print preview — deferred to manual check
- [ ] Editorial Verification — **not self-certified.** Flagged for Hashem per the batch contract

---

## Batch 6 — Study-Page Navigation (2026-05-24)

Added consistent upward navigation to both study pages. Before this batch the study pages were islands — built before the Library hub and `/collections/` landing existed, so a reader had no in-page path back up. This adds the same nav to both, harmonized to each page's palette.

### Breadcrumb at the top

A `<nav class="crumbs" aria-label="Breadcrumb">` is now the first element inside `<body>` on both study pages, sitting above the existing `<header>`. Markup is a semantic `<ol>` with three crumbs:

```
Growing Stone Library  ›  Collections  ›  [current page]
```

- Root-relative links (`/` and `/collections/`) so they work from the nested path
- The current crumb is plain text with `aria-current="page"`
- Separator chevron rendered via CSS `li + li::before { content: "›" }` — no separator before the first crumb or after the last
- Per page:
  - **TON** → `The Table of 70 Nations`
  - **Stars** → `What Are the Stars?`

### "‹ Back to all collections" above the footer

A small centered `<div class="foot-back">` link to `/collections/` sits just above each `<footer>`. The study pages are long; this saves scrolling back to the top.

### Palette harmonization (no shared-CSS edits)

Both nav elements use each page's own existing tokens — nothing new was introduced and `shared/styles.css` / `shared/site.css` were not touched:

- **TON** — crumbs sit on `--bg` (white) with a 1px `#eee` hairline; back-link sits on `#fafafa` (the existing footer surface). Links use `--gold`, hover/focus `--gold-light`, separators and current crumb `--muted`/`--text2`.
- **Stars** — crumbs sit on `--paper` (warm ivory) with a `#e8e4d8` hairline; back-link sits on `--paper-2`. Same gold-link / muted-separator treatment.

Inter for the chrome text, 12px, uppercase only for the back-link (matches each page's existing UI-label convention). Comfortable tap targets (`min-height: 32px` on crumb items, `padding: 6px` on links); `flex-wrap: wrap` handles narrow screens.

### Print

`.crumbs` and `.foot-back` are both `display: none !important` in each page's print stylesheet — navigation chrome doesn't belong on paper.

### Scope of edits

This is the first intentional edit to the **Table of Nations** collection since the Batch 1 restructure. The change is scoped to navigation only: nothing in TON's header, search/filter logic, card data, or footer text changed. Same for the Stars page — all four interactives (Two Lenses, Spectroscope, Canon Walk, Perspectives accordion, tappable Scripture index) remain untouched. `app.js` was not modified on either page.

### Acceptance verification

- [x] Breadcrumb added atop both study pages; Home (`/`) and Collections (`/collections/`) links work; current page marked `aria-current="page"`
- [x] "‹ Back to all collections" link added above both footers, linking to `/collections/`
- [x] Nav harmonizes with each page's palette; no shared stylesheet or other-collection edits; no `app.js` changes
- [x] Existing content, headers, footers, and all interactives untouched and working
- [x] Print hides the breadcrumb and back-link
- [x] CHANGELOG updated; pushed to `main` (no force-push); both live URLs verified

---

## Batch 5 — Stars Page: Tappable Scripture Index (2026-05-24)

Small enhancement to the existing what-are-the-stars Scripture index at the bottom of the page. Each of the 17 references is now interactive.

### What changed

- Every `<span class="ref">` in the Scripture index list is now a real `<button class="ref-pop">` with `data-ref` carrying the exact reference label and `aria-expanded` toggling on open/close
- A small intro line under the section heading: *Tap a reference to read the verse.*
- Tapping/clicking a reference opens a small popover positioned just below it, showing the verse text (ESV, kept concise) in the page's serif/italic with curly quotes, and the reference repeated above in small uppercase gold
- One popover open at a time — opening a second closes the first. Outside-click, `Escape`, and re-tapping the same reference all dismiss the open popover. Esc also returns focus to the trigger
- All 17 verse keys verified to resolve (the two en-dashed labels `Genesis 1:14–18` and `Job 38:31–32` use the same en-dash character in both the HTML `data-ref` attribute and the JS `VERSES` keys)
- Affordance: the trigger gets a subtle dotted gold-light underline + pointer cursor; on hover/focus and while open it shifts toward the ink color with a deeper gold underline

### Constraints honored

- Vanilla HTML/CSS/JS. No libraries, no build step, no localStorage/sessionStorage
- Verse object lives in the page's existing `app.js` — single source of truth, lookup by `data-ref`
- Two Lenses, the Spectroscope, the Canon Walk, and the Perspectives accordion are untouched and still work
- No edits to `shared/styles.css`, `shared/site.css`, or any other collection
- Mobile (≤560px): popover spans the list-item width (no horizontal overflow) and the trigger drops below the gloss in the existing stacked layout
- Print: popovers are hidden (`display: none`), the intro line is hidden, and triggers print as plain text (no underline, no pointer) — the static reference + gloss list carries print fidelity exactly as before

### Acceptance verification

- [x] All 17 index references are `<button class="ref-pop">` with matching `data-ref`; each opens the correct verse
- [x] Only one popover open at a time; outside-click, Esc, and re-tap all close it
- [x] `aria-expanded` toggles; keyboard-operable; intro line "Tap a reference to read the verse." added
- [x] Popover matches the page palette (gold ref label, serif italic verse); stays within width on mobile
- [x] Two Lenses, Spectroscope, Canon Walk, Perspectives accordion all still work
- [x] No edits to other collections, `shared/styles.css`, or `shared/site.css`
- [x] Print hides popovers; static index still reads cleanly
- [x] CHANGELOG updated; pushed to `main` (no force-push); live URL verified

---

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
