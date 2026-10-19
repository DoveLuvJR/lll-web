# Changelog — LLL Library

## Batch 19 — Font Caching + Production Check (2026-10-19)

The production check after the Batch 18 merge passed: 0 third-party requests on all 8 pages. It also found that Vercel serves the self-hosted fonts with `cache-control: public, max-age=0, must-revalidate`, so a returning reader's browser re-checks every font on every page load. Google's CDN used to let browsers keep them for a year. Hashem ruled to fix it with a minimal `vercel.json`. That is an explicit exception to D-005, recorded as **D-022**.

### What changed

- **`vercel.json`** (new) holds one `headers` rule: `/shared/fonts/(.*)` gets `Cache-Control: public, max-age=31536000, immutable`. There is nothing else in the file.
- **`.vercelignore`** now allowlists `vercel.json`. The ignore file excludes everything at the root by default, and the Vercel docs don't say whether an ignored `vercel.json` is still read. Allowlisting it removes the doubt. Whether the file itself gets served is checked below.
- **The CHANGELOG's open items were ticked** from the production check: Batch 16 Vercel Toolbar (×2), Batch 15 preview and network tab, Batch 17b live deploy, Batch 18 live deploy and caching. Batch 16's "heights on a Mac" stays open; the live heights part is done.

### Verified on production (`table-of-nations.vercel.app`, merge `9451aff`, before this batch)

- **External requests: 0 on all 8 pages.** No `vercel.live` request, so the Vercel Toolbar is off in Production. That closes D-013's operational requirement, open since Batch 14.
- **Fonts load from `/shared/fonts/`** with status 200, 3–5 files per page.
- **Gate widgets at 1440×900:** Stone **810**, Wall **828**.
- **Batch 17/17b text is live:** "Nabonidus records", "a predecessor", "leads to destruction", `(8:5; 11:19; 16:18)` in the table and `(Rev 8:5; …)` in the note. The Movement VI `6:12` is intact, and a Nineveh search shows Nimrod and Asshur with `Gen 10:11, 22`.

### To verify on this branch's preview (after Hashem pushes)

- [ ] A font file returns `cache-control: public, max-age=31536000, immutable`.
- [ ] `/vercel.json` is **not** served (expect 404).
- [ ] Pages still load, and there are still 0 external requests.

---

## Batch 18 — Self-Host the Fonts (2026-10-19)

D-003 put a Google Fonts `@import` in `shared/styles.css`. D-013 says a page makes no network calls of any kind. So every page broke D-013 on load: Batch 17 counted 42 requests to Google's font CDN across the 9 pages. Hashem ruled to keep D-013 absolute, with no exception, and move the fonts into the repo. **D-021** amends D-003 item 1 to match. The branch is cut from `batch-17-trust-check` (ruled by Hashem), since 17/17b are not merged yet.

### What changed

- **`shared/fonts/`** (new) holds 8 WOFF2 files, plus the three OFL license texts from the google/fonts repo.
- **`shared/styles.css`:** the `@import` line is replaced by 18 local `@font-face` rules, all `font-display: swap`. Nothing else in the file changed. The reset and the three `--font-*` variables are untouched.

### Which files, and why these

- **Weights were measured, not guessed.** Every text node on all 9 pages, hidden ones included, was checked for its computed family, weight and style. Faces actually drawn: Cinzel 700/900; EB Garamond 400/600/700 and 400 italic; Inter 400/500/600. **Cinzel 400 was in the import and is never used, so its rule is dropped.**
- **Fixed weights, copied exactly.** Google serves each family as one variable file, but declares fixed weights. Text styled Inter 700/900 has always rendered at 600, the heaviest Inter weight declared. The local rules copy the same fixed declarations rather than a `100 900` range. A range would have made every bold Inter label visibly heavier, and could have moved the Gate widgets.
- **Subsets: latin + latin-ext only.** EB Garamond needs latin-ext for ē and ō ("euergetēs", "planētēs"). The Cinzel and Inter latin-ext files aren't needed by today's text. They are shipped anyway so a future accented letter doesn't silently fall back. Because of `unicode-range`, a browser only downloads them if a page uses one of those characters. No page uses Cyrillic, Greek or Vietnamese script, so those subsets are not shipped. The arrows and emoji render in system fonts, as they did before.
- **Same versions as live:** Cinzel v26, EB Garamond v33, Inter v20, matching the "before" request log.

| File | Bytes |
|---|---|
| `cinzel-latin.woff2` | 25,904 |
| `cinzel-latin-ext.woff2` | 14,540 |
| `ebgaramond-latin.woff2` | 44,336 |
| `ebgaramond-latin-ext.woff2` | 113,928 |
| `ebgaramond-italic-latin.woff2` | 25,388 |
| `ebgaramond-italic-latin-ext.woff2` | 45,468 |
| `inter-latin.woff2` | 48,256 |
| `inter-latin-ext.woff2` | 85,068 |
| **Fonts total** | **402,888 (393 KB)** |
| `OFL-cinzel.txt`, `OFL-ebgaramond.txt`, `OFL-inter.txt` | 13,158 |
| **`shared/fonts/` total** | **416,046 (406 KB)** |

A typical page fetches 3–5 of these files (about 140–255 KB). That is the same files it used to fetch from Google.

### Verified (Playwright, Chromium 156, local server, all 9 pages)

- **Grep:** the two Google Fonts domains (the stylesheet API and the static file host) return **0** hits in the whole repo, docs included. Batch 17's open item that named the two domains was reworded when it was ticked off.
- **Network:** external requests went from **42 to 0**. The local font files return 200: `cinzel-latin`, `ebgaramond-latin`, `ebgaramond-latin-ext`, `ebgaramond-italic-latin`, `ebgaramond-italic-latin-ext`, `inter-latin`.
- **Rendering:** there are 20 before/after screenshot pairs: one heading, one EB Garamond paragraph and one Inter paragraph per page, where the page has them. **0 differing pixels** across all 20, with a pixelmatch threshold of 0. The loaded FontFace set is identical before and after: Cinzel 700/900, EB Garamond 400/600/700 and 400 italic, Inter 400/500/600.
- **Gate widgets at 1440×900 (D-019, ≤ 836):** `#stoneWidget` **810**, `#wallWidget` **828**, unchanged.
- **No page errors.** `fetch(` / `XMLHttpRequest` / `src="http` are still 0.

### Not verified / open

- [x] *(verified on production 2026-10-19, Batch 19: 0 third-party requests on all 8 pages)* **The live deploy.** `.vercelignore` already publishes `shared/`, so `shared/fonts/` will deploy. Check the network tab on the real site, top-level page and not inside an iframe, for 0 third-party requests (the Vercel Toolbar is covered by D-013's amendment).
- [x] *(addressed in 19: `vercel.json` cache header, D-022)* **Caching.** Google's CDN served these with long cache lifetimes. Vercel's default caching for `/shared/fonts/*` hasn't been checked. A `vercel.json` cache header would be a separate ruling (D-005 says no config until it's needed).
- `about.html` is an empty placeholder. It still links `shared/styles.css` but draws no text, so it requests no font files.
- The scan reads text nodes, not CSS `::before`/`::after` content. No page draws pseudo-element text in Cinzel 400, but that was not machine-checked.

---

## Batch 17b — Verse and Attribution Fixes (2026-10-19)

The Batch 17 audit found four factual errors that were already live. Batch 17's rules froze every verse and reference, so it could only flag them. Hashem approved fixing them here, as their own commit (**D-020**). The freeze was lifted for these items only. No other verse, quote, reference, `id` or `href` changed.

### Fixes

| # | Where | Before → after | Why |
|---|---|---|---|
| 1 | Spiral `app.js`, Toolbox "Antithetic" card | "The LORD watches over the righteous, but the way of the wicked He frustrates." → "For the LORD watches over the way of the righteous, but the way of the wicked leads to destruction." (still labeled Psalm 1:6) | The old line spliced Psalm 1:6's first half onto Psalm 146:9's second half. The new text is NIV, to match the page's other quotes. |
| 2a | Spiral `index.html`, comparison table "Best evidence" row | `(6:12; 11:19; 16:18)` → `(8:5; 11:19; 16:18)` | The claim is that all three series end in thunder, lightning and a great earthquake. 6:12 (sixth seal) has only an earthquake. The seals end at 8:5. |
| 2b | Spiral `app.js`, Timeline Flipper "Final Judgment" note | `(Rev 6:12; 11:19; 16:18)` → `(Rev 8:5; 11:19; 16:18)` | The same claim, with the same error. It was not in the 17b spec. **Ruled in by Hashem** so the page doesn't contradict itself. |
| 3 | Gate `index.html`, Movement II | "Nebuchadnezzar II records cutting a trench…" → "Nabonidus records cutting a trench…"; also "an ancestor separated from him" → "a predecessor separated from him" | The find of Naram-Sin's foundation deposit is credited to Nabonidus, the last king of Babylon. "Ancestor" was loose for either king, since Naram-Sin was a royal predecessor, not a forebear. **The second change was ruled in by Hashem** (one word beyond the spec). "Well over a thousand years" still holds (about 1,700). |
| 4 | Table of Nations `app.js`, Nimrod and Asshur | Nimrod: "Built Babel, Erech, Akkad, Nineveh." → "Built Babel, Erech and Akkad, and in most modern translations Nineveh too (Gen 10:11 can be read either way)." Asshur `sg`: "Founded Assyria and built Nineveh." → "Founded Assyria. The KJV reading of Genesis 10:11 credits him with building Nineveh; most modern translations give it to Nimrod." Asshur `sc`: "Gen 10:22; Num 24:22" → "Gen 10:11, 22; Num 24:22" | This one was a silent split, not an error. Gen 10:11 reads both ways, and the page gave Nineveh to both men without saying why. |

### Verified (Playwright, Chromium 156, local server)

- **The word-level diff has exactly 11 changed runs**, all listed above and nothing else. No `id` or `href` is in any changed run.
- **The Movement VI `6:12`** ("links the 7th-bowl earthquake (16:18) back to the 6th-seal earthquake (6:12)") is present and unchanged. It is the only `6:12` left in the Spiral HTML.
- **Spiral:** the Antithetic card was opened in the browser and screenshotted. The curly quotes and em dash render correctly. The Best-evidence cell and the Final Judgment note both read `8:5; 11:19; 16:18`.
- **Table of Nations:** a search for "Nineveh" returns exactly two cards, Nimrod and Asshur. Both were expanded, and the new Significance text and the Asshur Scripture line read correctly.
- **Gate:** the edited sentence was read back from the rendered page.
- **No page errors on the three edited pages.** The only console error was a 404 for `/favicon.ico`, which the browser requests by itself; the repo has no favicon. That is not a page defect.
- **D-013 grep:** `fetch(` 0, `XMLHttpRequest` 0, `src="http` 0.

### Not verified / open

- [x] *(verified on production 2026-10-19: Nabonidus, Psalm 1:6, both Rev 8:5 cites and the Nineveh notes all live; Movement VI 6:12 intact)* The live deploy (local server only).
- [ ] Nimrod's "Uniquely, a Hamite who dominated Semitic territory" is still `[NEEDS SOURCE]`. It was not in 17b's scope.

---

## Batch 17 — Trust Check: Humanize the Study Pages (2026-10-19)

Readers said the study pages read like AI wrote them. A Trust Check pass (honesty first, then AI tells, then voice) ran over all seven pages under `/collections/`. Phase A wrote an audit report outside the repo (`claude-code-prompts/LLL-Web-Batch-17-REPORT.md`, 35 honesty flags, 55 proposed rewrites). Hashem approved every rewrite that sits outside a widget and outside a Fellowship card, and those are applied here. No verse, quote, inscription, name, date, number, `id`, `href`, Fellowship card or footer credit changed. The branch starts from `gate-viewport-fit` rather than `main`, because `main` does not yet have Batches 15–16 (ruled by Hashem).

### Per page

| Page | Rewrites applied | Words before → after |
|---|---|---|
| `/collections/` | 1 | 137 → 135 |
| Table of 70 Nations (`app.js`) | 4 | 2598 → 2601 |
| What Are the Stars? | 13 | 1969 → 1914 |
| Why Was the Tree Reachable? | 12 | 4060 → 4010 |
| The Spiral and the Line | 12 | 2528 → 2495 |
| Whose Name Is On the Gate? | 9 | 2826 → 2810 |
| Names on the Wall | 3 | 1599 → 1585 |
| **Total** | **54** | **15717 → 15550** |

Words are counted on the rendered page (body text with JS run, scripts and styles removed), so the counts include nav and chrome. Only the change between before and after is meaningful.

### What changed

- **Signposting removed:** "Now the payoff", "Read that again slowly", "Here is the sobering part", "Sit with what that phrase does", "One more line, because…".
- **"It's not X — it's Y" setups** rewritten where they were habit, not argument. The Tree study keeps its own aphorisms ("They explain the fence. They do not explain the gate in it."). Only its transitions were touched.
- **Sermon and hype voice flattened:** "Let us be honest… That is simply true", "beautiful tension", "only detonate", "blew them up to book scale".
- **Overclaims about readers removed:** "Here's what almost no reader realizes", "something no one expected".
- **One accuracy fix made through wording only:** the Spiral page called chiasmus, envelope and staircase "the last three" toolbox cards. They are cards 4, 5 and 8 of 10. The sentence now says "Keep three of these in mind." The names are unchanged.
- **Flagged claims kept verbatim inside rewritten sentences:** "everywhere, for three thousand years" (Gate) and "both defended by the earliest church" (Spiral).
- **Not applied (by ruling):** the `#danWidget` caption (W) and the two suggestions for the Stars page's second Fellowship card (F). Pass those to the brother who wrote the card.

### Verified (Playwright, Chromium 156, local server)

- **Diff check, word-level:** the changed text has 0 `id=`, 0 `href=`, and 0 hits on `persp`, `class="pq"`, `class="verse"`, `drift-text`, `epigraph`, curly quotes, or the footer credit. There are 4 `\d+:\d+` hits, in two matched pairs: `Rev 20:8` (Magog) and `Gen 11:14-15` (Shelah). Each appears the same on both sides. Word-diff attaches them to the note text because the TON data has no space between the `sc` and `sg` fields. Neither reference changed.
- **Exact-text guard:** each of the 55 find strings (54 rewrites; Spiral's Movement V edit has two parts) matched exactly once before it was replaced. The script would have aborted without writing anything otherwise.
- **Widgets at 1440×900 (D-019, ≤ 836):** `#stoneWidget` 810, `#wallWidget` 828. Both are unchanged from Batch 16, and no widget text was edited. Also unchanged: `#danWidget` 705, `#doorsWidget` 406, `#namesWidget` 379.
- **375×812:** `scrollWidth` = `clientWidth` = 375 on six of the seven pages. The Spiral page is 377/375 **before and after** (see open items).
- **D-013 grep across `collections/`:** `fetch(` 0, `XMLHttpRequest` 0, `src="http` 0. No page errors.

### Not verified / open

**Four HIGH items for Hashem's own hand. The batch rules barred touching them:**
- [x] *(fixed in 17b)* **Spiral `app.js`, Antithetic example:** the quote labeled Psalm 1:6 is not Psalm 1:6. The wording is close to Psalm 146:9 (NIV).
- [x] *(fixed in 17b, both places)* **Spiral, row 7 note and comparison table:** `Rev 6:12` is cited as the seventh-seal earthquake. 6:12 is the sixth seal; the seventh-seal thunder, lightning and earthquake are at Rev 8:5.
- [x] *(fixed in 17b)* **Gate, Movement II:** Nebuchadnezzar II is credited with finding Naram-Sin's foundation deposit. The usual attribution is Nabonidus.
- [x] *(fixed in 17b; both readings now stated)* **Table of Nations:** Nimrod and Asshur are each said to have built Nineveh (Gen 10:11 reads either way depending on translation). Pick one reading.

**Open `[NEEDS SOURCE]` flags:**
- [ ] TON: Nimrod "Uniquely, a Hamite who dominated Semitic territory".
- [ ] TON: Arvadites "the only inhabited island on the eastern Mediterranean". Cyprus contradicts it; probably means "off the Syrian coast".
- [ ] TON: Meshech → Moscow, Tubal → Tbilisi.
- [ ] TON: "Most scholars" for Tarshish = Tartessus and Dodanim = Rhodes.
- [ ] TON: Arkites "about 12 miles NE of Tripoli" (usually given as about 13–14 mi).
- [ ] Stars: footer "drawn from the standard history of astronomy" is too vague to count as a source.
- [ ] Stars: Pleiades "roughly 440 light-years", Arcturus "about 37 light-years".
- [ ] Stars: "the host of heaven" used for both stars and angels. No verse is given for the angelic sense (1 Kings 22:19 is the usual one).
- [ ] Tree: "Every generation has read Scripture through its most impressive technology — clockwork, then steam, then the telephone exchange, then the computer."
- [ ] Tree: "Trust without leverage — an emphasis common in Jewish reading."
- [ ] Tree: "Augustine, and most of the West after him" / "Irenaeus, and much of the East". The footer source is only "the standard history of Christian interpretation".
- [ ] Spiral: "The spiral and the line are both ancient, both defended by the earliest church."
- [ ] Spiral: no sources line, and no translation named. Quotes mix ESV and NIV-style wording.
- [ ] Gate: "how the ancient world built sacred architecture, everywhere, for three thousand years".
- [ ] Gate: "a thousand priests as masons and carpenters" and "another eighty years". These come from Josephus, who is not cited.
- [ ] Gate: "the largest benefaction project in the Jewish world".
- [ ] Gate: golden eagle "the youths were executed" (inside `#wallWidget`; Josephus, uncited).
- [ ] Gate: no sources line on the page with the most archaeology in the library.
- [ ] Names: no sources line at all. The dates (244–245, 232–233, 168–171 / 240 CE), "about seven meters", the museum locations and "oldest known house church" are all unsourced.

**Report-only items (not source gaps):**
- Gate: the Nicanor pull-quote (`class="pq"`, attributed "On the Nicanor ossuary, now in the British Museum") reads as a quotation but appears to be our own prose. Either cite it or restyle it as commentary.
- Spiral `app.js`: row notes 1–2 state interpretations as fact ("All three open by striking the land itself"; "The seal's war is what churns it"). The "Seals ¼ … Bowls 100%" strip is partly interpretive.
- Stars: Fellowship card 2's second paragraph reads as the compiler's assessment inside a brother's card (D-010). Ask him.

**Pre-existing, not caused by this batch (out of scope):**
- [ ] Spiral page overflows at 375px: `scrollWidth` 377 vs `clientWidth` 375, the same before and after.
- [x] *(fixed in 18: fonts self-hosted, D-021)* Every page loads Google Fonts (from Google's font CDN) through `shared/styles.css`. D-003 calls for that import, but D-013 says "no CDN scripts or stylesheets". The two decisions conflict and need a ruling.
- [ ] The `main` branch does not have Batches 15–16. Merging this branch brings them in.

---

## Batch 16 — Gate Study: Widget Viewport Fit (2026-09-27)

Both widgets on `/collections/whose-name-is-on-the-gate/` were still taller than the screen, so a reader had to scroll to compare all six inscriptions or both walls. This was a chrome-only trim, built from the viewport-fit spec. No study copy, slab content, wall card or subgrid structure changed. The fit contract is now **1440×900 (836px usable)**, recorded as **D-019**.

### Heights at 1440×900 (usable 836px)

| Widget | Before | After | Headroom |
|---|---|---|---|
| `#stoneWidget` | 955 | **810** | 26px |
| `#wallWidget` | 1012 | **828** | 8px |

Gates band delta **0**, foundations band delta **0**, same as before.

### Changes

- **Both widgets:** the "Interactive · Widget N of 2" eyebrow is removed. The hint is one line and the title has a tighter line height. `.widget-top` went from 99 to 50px. Widget padding went from 18/20 to 12px.
- **Captions moved outside the box.** Both `.widget-foot` captions are now siblings of their widget, not children. Their text is unchanged, and they sit 14px below the box through a negative margin that collapses with the widget's own. Print keeps each caption with its widget (`break-before: avoid`).
- **Stone:** the `.hl-ctrls` and `.slabs` top margins are now 10px.
- **Wall:** the `.wall-pair` gap and top margin are now 10px. The `.wall-hd` padding went from 12/11 to 8/6, which cut the row by 9px. The `.wall-foot` padding went from 12 to 6, which cut the row by 12px. Both were done through padding, never a fixed row height.
- **Mobile (≤640px):** `.hl-btn` gets `min-height: 44px`, up from 31. It is mobile-only so the desktop Stone keeps its headroom. The gate and foundation tile grids are now `repeat(3, minmax(0,1fr))`. The spec asked for `repeat(3,1fr)`, but that was already the rule. Plain `1fr` lets the longest word ("Chrysoprase") widen its column, which is what made the columns ragged. At 375px they are now 88.33px × 3 with no tile overflow.

### Spec notes

- **The wall landed at 828, not the spec's estimated 821.** Item 2.5, the gap from 14 to 10, saves no height. Each wall's own rows use `row-gap: 0` in the subgrid, so the parent's gap never separated them vertically. Every other item hit its number. Pulling the "The Lamb…" footer onto one line would save 18px, but it only fits with 1–2px to spare, so it was not taken.
- **Print audit:** the stale `.slabs { repeat(3,1fr) }` rule the spec expected is **already gone**. It was removed with the Batch 14 row rebuild, and `.slabs` prints as a single 830px column. Confirmed with print emulation: `.nav`, `.share-row`, `.hl-ctrls`, `.crumbs` and `.foot-back` are `display:none`. The tint-strip `!important` rules are present. `break-inside: avoid` lands on `.widget`, `.slab`, `.wall` and `.uitem`, which all still exist.
- **The `.widget-kicker` rule is deleted.** It is no longer used on this page, and the style is page-local.

### Verified (Playwright, headless Chromium, local server)

- 1440×900: the heights above, and both band deltas 0.
- "The gift": slabs 1–5 HAS, slab 6 NO. `aria-pressed` is true only on the active button. Pressing it again clears, and Clear clears with all four false. No console errors.
- 375×812: `scrollWidth` 375 = `clientWidth` 375, all four `.hl-btn` are 44px, and `.found-grid` has 3 equal columns.
- For the record (out of scope): at 1280×800 the usable height is 736, the stone 810 and the wall 828.

### Not verified / open

- [x] *(verified 2026-10-19, Batch 19: no `vercel.live` request on any production page)* **Vercel Live on production.** This is a dashboard setting, and no repo file controls it. Turn off the Vercel Toolbar for Production, then re-check `vercel.live` on the **top-level** page, never inside an iframe.
- [ ] *(live deploy verified 2026-10-19: Stone 810, Wall 828 on production, Windows Chromium. Mac still open.)* Heights on the live deploy and on a Mac. The Wall's 8px headroom is thin enough that font metrics could matter.
- **Pre-existing defect, not fixed (out of scope):** `.m-body p` (specificity 0,1,1) overrides `.band-note` (0,1,0). The two New Jerusalem band notes therefore render at 17.5px with a 16px bottom margin instead of 11.5px, and have since Batch 12. Fixing it cannot change the wall's height, since Herod's wall sets the rows.

---

## Batch 15 — New Study: Names on the Wall (2026-09-24)

A new study, **"Names on the Wall: Three Faiths, One Street at Dura-Europos,"** at `/collections/names-on-the-wall/`, built from `SPEC_names-on-the-wall.md`. It pairs with "Whose Name Is On the Gate?". It covers three houses of worship on one street (synagogue, house church, Mithraeum), buried by the same rampart around 256 CE, and asks who signed each wall. The page text is the spec's text, word for word, checked by script (34/34 lines).

### New page — `collections/names-on-the-wall/` (index.html, styles.css, app.js)

Same file set, chrome, and palette as the gate study: breadcrumb, sticky section nav, numbered movements, widget shell, back link, footer. The Copy Link / Share / Print row was added by owner ruling (see below). One new colour token, `--sand`, is the rampart fill.

- **The Three Doors** (`#doorsWidget`): three `aria-pressed` buttons, one house's six-row panel at a time, fixed height. This is a tabbed comparison, approved as an exception to D-014 and recorded as **D-018**. With JS off, all three panels stack (D-012).
- **Names on the Wall** (`#namesWidget`): static, three columns (Synagogue, Mithraeum, House Church), rows aligned by subgrid as in `#wallWidget`. The columns stay side by side on a 390px phone, with smaller type. The House Church column is the widget's highlight in library gold. This replaced the original "quieter" treatment; see the spec reversal below.
- **The Rampart** (`#rampartWidget`): an inline SVG side view with Before/After buttons. The embankment is in the markup and fades in over 0.3s, with no fade under `prefers-reduced-motion`. With JS off it reads as "Before". The SVG has a `<title>` and a `<desc>` covering both states.

### Spec reversal — House Church column becomes the highlight (owner-approved)

**This reverses spec rule 4 for Widget 2** ("the House Church column has a visibly quieter treatment … to show 'unsigned'"). The owner ruled the opposite after seeing the first build: the unsigned column is the one the study wants the reader to notice.

- **Colour:** `--gold`, the same token as the section-number badge (`.m-num`). No new colour.
- **Header band:** solid gold with white text, mirroring the jasper and bronze headers.
- **Subheader band:** first built as `--gold-bg`, which read too close to the Mithraeum's cream band. Deepened on owner request to a tint built from the token, `color-mix(--gold 20%, white)`. At that depth plain `--gold` text measured under 4.5:1, so the label is a deeper gold from the same token, `color-mix(--gold 78%, black)`. Measured **5.64:1**.
- **Rows:** normal text colours, same as the other columns (the muted override is removed).
- **Border:** still dashed, now gold.
- **Lift:** a soft gold glow (`box-shadow`, `--gold-light` at 50%). **No transform, translate, or scale.** Moving the column would break subgrid row alignment, and scaling could push a phone into sideways scroll.
- **Contrast (new test `house_church_contrast`):** header 5.09:1 (white on `#8B6914`), subheader 5.64:1 (deep gold on the gold tint). Both clear 4.5:1 at 390×844 and 1440×900.
- **Dark mode:** the site has none (no `prefers-color-scheme` anywhere). Forcing a dark colour scheme renders the page identically, with the same ratios.
- Re-run after all changes: **38/38 checks**, `names_rows_align` 0.00px on every row at both sizes, phone `scrollWidth` 390/390.

### Spec reversal — Copy Link / Share / Print row added (owner-approved)

The spec lists "sharing buttons" as out of scope, so the first build left the row off. The owner ruled to add it. It is the gate study's row verbatim (markup, styles, toast, `copyLink` / `shareNative`), hidden in print. The share sheet text is "Three faiths, one street at Dura-Europos."

### Docs

- README: Names on the Wall added to the folder tree and the collections table.
- D-018 tightened: **scope is this page's `#doorsWidget` only**, and D-014 stays in force everywhere else, including this page's other two widgets.

### Existing pages

- Gate study: one line at the end, "Related study: Names on the Wall", plus a 2-rule `.related` style. Nothing else changed.
- Collections index: a sixth card.

### Verified (Playwright, headless Chromium, 390×844 and 1440×900)

All ten spec tests pass at both sizes, along with extras: D-017 fit under the sticky nav, JS-off fallback, reduced motion, no console errors, and verbatim text. **33/33 checks.** Tallest widget: 585px of 844px on the phone (615px usable under the nav), 529px of 900px on desktop. Row alignment delta 0.00px. Phone `scrollWidth` 390px. The source makes no network calls (D-013 grep).

### Not verified / open

- [x] *(moot: the study is on production, verified 2026-10-19)* Vercel preview URL. The branch `names-on-the-wall` needs pushing to get one
- [x] *(verified on production 2026-10-19: 0 external requests)* Network tab on the live preview (D-013 amendment: the Vercel Toolbar is still an open item)
- On a 390px phone the sticky nav wraps to 229px, the same behaviour as the gate study. The Doors widget still fits under it, with 30px to spare
- The Rampart prints whichever state is on screen

---

## Batch 14 — Gate Study: Inscription Stone Rebuilt as Rows (2026-09-12)

Acting on a browser audit of the live page (graded C). The audit confirmed the Batch 13 **alignment** work landed perfectly — subgrid supported, gates-band delta 0px, foundations-band delta 0px, slab heights matched to the pixel per row — and confirmed the **fit** work failed: Inscription Stone 1059px against 836px usable at 1440×900, and 323px over at 1280×800. Both widgets measured identically at both widths, because the content column is capped at 900px. A larger monitor was never going to help.

### The Inscription Stone — card grid → six full-width rows

Trimming copy could not close a 223–323px gap; the shape was wrong. A three-across grid of six cards stretches every cell to the tallest in its row — the audit measured 121px of empty box in slab 4 and 96px in slab 6, with rows costing 343px and 413px.

- Each inscription is now **one full-width row**: a 200px identity rail (place · date, then the artifact name) beside the inscription text. Rows cost roughly 90px each instead of ~380px per row of three.
- The per-slab provenance note is now an **inline continuation of the inscription** rather than a separate bordered block — same words, no divider, no extra vertical box.
- Widget chrome tightened: padding 22/20/24 → 18/18/20, control row and hint margins reduced, footer sentence cut.
- The `.slab-hd` / `.slab-name` pair became `.slab-id` > `.slab-meta` + `.slab-name`.
- Mobile: the rail stacks above the text below 560px.

The highlight mechanism is untouched and still tints spans without hiding anything. `app.js` unchanged — nothing about this was a scripting problem.

### The Donor Wall — void filled, height accepted

**Ruled not to chase the fold.** The Wall's comparison runs horizontally — both columns are on screen together at any scroll position — so its total height is cosmetic, not functional. Forcing it under 836px would have meant shrinking tiles and gutting the band notes to buy a property the component does not need. See **D-017**.

The 157px void under Herod's single foundation card was a real defect either way, and is fixed by stretching the dashed "Unnamed ashlars" card to fill its band. An empty dashed course now reads as the finding — no names were cut here — instead of as an accidental gap.

### D-013 amended — the page is clean, the deploy is not

The audit found **five requests to `vercel.live`**, a third-party iframe, and two polling fetches on a page whose source contains none of them. That is the Vercel Toolbar, injected at deploy time — the floating button bottom-right.

D-013 as written promised zero network calls and could not deliver that, because the platform adds its own. Amended to cover **what we author**, plus a standing operational requirement: disable the Vercel Toolbar for Production, and check the network tab on a **live deploy**, not just grep the repo.

**Action outside the repo, still open:** disable the Toolbar in the Vercel project settings.

### D-017 added

If a component's argument is simultaneity, its height is a requirement and gets measured at 1280×800. If the comparison runs horizontally, it does not. Also records the two traps this batch found: a width-capped column hides the problem on any monitor size, and trimming words never closes a 200px gap.

### Carried clean from the audit (no action needed)

- Slabs 1–5 report HAS gift, slab 6 reports NO gift — verified in the DOM and by eye. The argument survives.
- Every button behaviour correct: toggle-off, Clear, `aria-pressed`, distinct tints.
- Mobile: no horizontal overflow; walls stack without interleaving.
- Print: tints correctly stripped, no slab or wall split across a page break.

### Not verified

- [ ] Re-measure both widgets at 1440×900 and 1280×800 — regression run against this batch
- [ ] Confirm the Herod foundations card fills its band with no gap remaining
- [x] *(verified 2026-10-19, Batch 19)* Confirm `vercel.live` requests are gone once the Toolbar is disabled

---

## Batch 13 — Gate Study: Widget Layout Pass (2026-09-12)

Both interactives on `whose-name-is-on-the-gate` were correct in structure and wrong in proportion. Reported after first render: the widgets were unbalanced and would not fit on screen without scrolling, which **cost them their function** — the Inscription Stone exists so a reader can see one element highlighted across six inscriptions at once, and a pattern that needs scrolling is not a pattern.

### The Inscription Stone — two column → three

- Grid is now `repeat(3, 1fr)`, so all six slabs land in two rows instead of three-plus-a-stranded-cell. The full-width `grid-column: 1 / -1` on the Revelation slab is **removed**: all six are now the same size, which is the honest presentation — the point is that six inscriptions share one grammar and one breaks it, not that one is bigger.
- Slabs are `display:flex; flex-direction:column` with `margin-top:auto` on the note, so the provenance lines sit on a common baseline regardless of how long the inscription above them runs.
- Text trimmed throughout — the Theodotus inscription (the tallest by far) lost its repeated office titles and the long "reading of the Law and teaching of the commandments" clause. The "rendered from published translations" caveat moved out of the Gudea slab into the widget footer, where it covers all six at once instead of padding one.
- Type down from 15.5px to 14.5px, padding tightened.
- Breakpoints: 3 columns to 860px, 2 columns to 560px, 1 below.

### The Donor Wall — aligned bands via subgrid

The original used `margin-top: auto` on the foundations band to push it to the bottom of each wall. The two columns carry very different content volumes, so that never aligned anything — it just opened a large hole in the middle of Herod's column.

- `.wall-pair` now declares four explicit rows; each `.wall` spans all four with `grid-template-rows: subgrid`. **Gates align with gates and foundations with foundations**, which is the comparison the section is making. Same technique as the Batch 9 card alignment.
- `@supports not (grid-template-rows: subgrid)` falls back to the previous flex column — the walls still render, they simply lose cross-wall alignment. No hole either way, because `margin-top: auto` is gone.
- Gate and foundation tiles now 4-across instead of 3, cutting a row off each grid; 3-across below 640px.
- Both band notes on the New Jerusalem side trimmed to one line; Herod's stone descriptions shortened.
- Mobile and print both reset `grid-row` and drop subgrid explicitly.

### Not verified

- [ ] Whether either widget now fits a viewport without scrolling — this is a measurement, not a judgment, and is being checked in a browser session next
- [ ] Mobile (375px) and print preview by eye

---

## Batch 12 — "Whose Name Is On the Gate?" Collection (2026-09-12)

Fifth collection. A study of **benefaction** — the ancient practice of cutting a donor's name into sacred architecture — and what it means that Jesus forbade the Twelve the benefactor's title and then gave them names on the foundations of the New Jerusalem. It runs from Sumerian foundation cones through Herod's donor-funded Temple to Revelation 21, and lands on Daniel 2's stone cut without hands.

### New collection

- `collections/whose-name-is-on-the-gate/` — `index.html` + `styles.css` + `app.js`, per the D-002 folder convention.
- Imports `../../shared/styles.css` for fonts + reset; all palette and components local (D-003). Own accent tokens layered over the shared gold: `--bronze #8a5b2a` (the bought economy), `--jasper #2a6b7c` (the given economy), `--stone #1a7a4a` (the unbought building — deliberately the same hex as the Spiral study's `--stone`, since both pages land on the Growing Stone).
- Breadcrumb + "‹ Back to all collections" per the Batch 6 nav convention; both hidden in print.
- Fifth card added to `collections/index.html` (`Luke 22 · Revelation 21`).

### Six movements, plus two back-matter sections

I The Named Gate (Nicanor's bronze doors and his ossuary) · II The Honor Economy (euergetism, *D.S.P.F.*, Gudea's buried cones, Nebuchadnezzar laying his inscription beside Naram-Sin's) · III A Donor Building (Herod as *Euergetes*; the Paris-of-Rhodes pavement plaque; the Theodotus stone) · IV The Wrong Men (why the Twelve were never candidates) · V The Inversion (Luke 22:25–30; gates/tribes vs foundations/apostles; the *styloi* thread; the Temple Scroll's twelve tribal gates) · VI Not Made With Hands (Mark 14:58 into Daniel 2).

Then **Where the Ground Is Uncertain** — six named scholarly disputes the study does not settle — and a 17-entry **Scripture Index**.

### Two interactives — both compliant with D-012 and D-014

- **The Inscription Stone** — six real inscriptions rendered as slabs, each marked into three spans: the name, the gift, the standing claimed. The controls apply a **highlight class only**; nothing is ever hidden, so select-all, Ctrl+F, translation, print and no-JS all capture the full text. Five slabs carry all three elements; the sixth (Revelation 21:14) has a name and a belonging and no gift — the widget exists to make that absence visible.
- **The Donor Wall** — a **fully static** side-by-side comparison (new **D-016**). Herod's Temple wall (named gates and surfaces above, unnamed foundation ashlars below) beside the New Jerusalem's (twelve tribal gates above, twelve apostolic foundations below). No JS touches it at all.

### Two house rules applied against the obvious design

The Donor Wall was specced as a two-mode toggle. **D-014 forbids it** — the page's argument is that the two walls share an architecture and differ in economy, which a reader cannot test one panel at a time. Built static instead. Likewise the Inscription Stone was specced to swap slab content; **D-012** requires every state in the HTML, so it highlights rather than swaps. Both changes made the components simpler, not more complex: `app.js` is 71 lines and does highlighting, nav, and the share row.

### Editorial posture

The study makes a real historical argument and flags its own soft ground in a dedicated section rather than in footnotes: the Beautiful Gate is **not** confidently identified with Nicanor's; the Klein/Schwartz dispute over the ossuary is named; the mid-first-century dating of the doors (possibly post-ministry) is stated plainly; no apostle is matched to any gemstone, because Scripture does not do it.

### Verified

- [x] Structure/paths: folder + three files per D-002; links `../../shared/styles.css` then `./styles.css`; `<script src="./app.js">`; breadcrumb + foot-back present
- [x] Zero dependencies, zero API calls, zero external `src`/`href` (D-013)
- [x] `app.js` injects no content; the Donor Wall renders with JS disabled; highlight controls hidden until `has-js`
- [x] Discoverability: card added to `/collections/`; README collections table and structure tree updated (structure tree also back-filled — it had been missing the Tree and Spiral studies)
- [x] Print block hides nav, share row and highlight controls, and strips highlight backgrounds — **verified in the CSS, not yet by eye**
- [ ] Browser render + mobile (375px) + print preview **by eye** — Hashem, on first load after deploy
- [ ] Editorial / theological verification — **not self-certified.** Flagged for Hashem

### Deploy

Push to `main`; Vercel auto-deploys to `/collections/whose-name-is-on-the-gate/`.

---

## Batch 11 — "The Spiral and the Line" Collection (2026-08-15)

Fourth collection. A study of biblical **recapitulation** — the Hebrew habit of retelling the same stretch of history more than once ("the spiral") rather than only marching straight through it ("the line"). It runs from Pharaoh's double dream through Daniel, Ezekiel, and the Olivet Discourse to the seals/trumpets/bowls of Revelation. The page is **spiral-featured but even-handed**: the telescopic (line) reading is presented as a faithful reading throughout, never as an error.

### New collection

- `collections/the-spiral-and-the-line/` — `index.html` + `styles.css` + `app.js`, matching the D-002 folder convention. Authored first as a self-contained page, then split into the three-file shape.
- Imports `../../shared/styles.css` for fonts + reset; all palette and components stay local (D-003). Own accent tokens layered over the shared gold: `--spiral #1a6fa0` (parallel / recapitulation), `--line #a03a2a` (telescopic / consecutive), `--stone #1a7a4a` (the finish line).
- Breadcrumb + "‹ Back to all collections" per the Batch 6 nav convention; both hidden in print.
- Fourth card added to `collections/index.html` (`Daniel 2–Revelation 16`). That card is the only edit outside the new folder besides docs.

### Six movements

I The Hook (Pharaoh's two dreams as a *signature of certainty*, Gen 41:32) · II The Toolbox (ten parallelism devices) · III The Master Pattern (recapitulation; a spiral-vs-line SVG pair) · IV The Blueprints (Daniel 2/7, Ezekiel's envelope, the Olivet Discourse) · V The Great Debate (Revelation's three sevens) · VI The Twist (how chapter titles, *kai* vs. *meta tauta*, and cross-reference margins quietly argue for one reading before the reader has decided).

### Two interactives — every state rendered in HTML; JS only toggles classes

- **Daniel's Double Vision** — five flip cards (four empires + a centered "Finish Line"). One toggle flips the whole set from the Daniel 2 statue (human view) to the Daniel 7 beasts (divine view); any single card also flips on tap.
- **The Timeline Flipper** — one set of judgments shown two ways: a **Parallel** table (the same target struck across seals/trumpets/bowls; tap a row for why they line up) and a **Telescopic** nest (each series' 7th judgment opening into the next).

### Verified

- [x] Byte-fidelity: all three files written to the repo, re-read, and SHA-256 matched to source exactly (`index` cdf770a0…, `styles` df5b38fa…, `app` 6b7975bd…)
- [x] `app.js` passes `node --check`; zero dependencies, zero API calls, zero external `src`/`href`
- [x] Structure/paths: folder + three files per D-002; links `../../shared/styles.css` then `./styles.css`; `<script src="./app.js">`; breadcrumb + foot-back present
- [x] Discoverability: card added to `/collections/`; README collections table updated (and the missing Tree-study row back-filled)
- [x] Print stylesheet hides nav, share row, breadcrumb, back-link, and telescope controls, and forces the toolbox/telescope open for paper — **verified in the CSS, not yet by eye**
- [ ] Browser render + mobile (375px) + print preview **by eye** — Hashem, on first load after deploy
- [ ] Editorial / theological verification — **not self-certified.** Flagged for Hashem

### Deploy

Push to `main`; Vercel auto-deploys to `/collections/the-spiral-and-the-line/`.

---

## Batch 10 — Tree Study, Final Pass (2026-08-01)

One defect, three placements, a source correction. **After this batch the study's shape is final.** Splitting it across multiple URLs is closed permanently and is not to be revisited.

### Content source re-pulled

The drift section **moved in the source** to sit after "What the text gives us," matching where it has rendered since Batch 8 — source order and page order had disagreed for two batches, which was a maintenance trap for whoever touched this next. It now carries its own heading and dek in the source.

"As given" gained a commentary line: *The command as it was spoken. Nothing has moved yet.* With all three panels annotated, the count now reads explicitly down the column — **nothing moved, one addition, one reversal.** The claim of that section is a count, so the count is visible without the reader assembling it.

### Scripture index gloss alignment (Task 1 — the defect)

On phones the reference and gloss stack, but the gloss was centering while the reference sat flush left, producing a staircase: measured left edges of 77, 34, 85, 56, 55, 18 against references all at 18.

Cause: the desktop rule `.gloss { align-self: center }` vertically centers the gloss against its reference in a row. In the stacked column that same declaration centers it *horizontally*. Fixed with `align-items: flex-start` on the row plus an explicit override. **All twenty rows now share one left edge at 18px.** A reference table exists to be scanned.

### Entry TOC brought up to standard (Task 2)

Deks added to the entry TOC. **Subsections deliberately left to the sticky panel** — reported as a judgment call:

- Only three of the eight top-level sections carry deks, and that asymmetry is correct rather than arbitrary: those three are the headings that say nothing out of context. The other five explain themselves, which is why they never got one.
- The entry TOC is consulted while deciding whether to spend eighteen minutes; eight sections is the right grain for that decision. The sticky panel is consulted while reading, which is where the twenty-entry map belongs.
- Adding ten subsections plus their deks would roughly triple the hero on a phone and push the study's first words far down.

### Epigraph moved below the TOC (Task 3)

Genesis 2:9 now sits at the top of the prose column, directly above "The question" — the section that asks about it, which is where a text under discussion belongs. It is out from between two pieces of navigation furniture, and the hero is title, subtitle, stats, TOC.

Nothing above the fold moved, and the change **recovered** fold room: the TOC's "What this reading does not do" link went from 804–844 (top edge only) to **770–810, fully above the 820 fold.**

### Verified

- [x] Prose vs re-pulled source: **zero unexplained differences**; page section order matches the source's new order exactly
- [x] 20 index entries, 20/20 linked; 5 limits; stat bar `20 · 4 · 5 · 18`
- [x] Index gloss alignment: all rows ref-left = gloss-left = 18px
- [x] "5 Limits" stat clears the fold on both 375×820 and 375×667
- [x] Select-all captures the new commentary line, the epigraph in its new home, and every component
- [x] Print: all three drift states `block`, epigraph prints, all four nav elements dropped, 7 limit paragraphs
- [x] Console **0 errors, 0 warnings**; copper still at exactly two placements; zero dependencies, zero API calls
- [ ] Print preview by eye — Hashem, Ctrl+P
- [ ] Editorial Verification — **not self-certified**

### Standing practice adopted

Two Batch 9 bugs — the `has-js`/`scrolled` split across `<html>` and `<body>`, and deep-link arrival firing no scroll event — both passed every DOM assertion worth writing. **Class application is not evidence of effect.** Sticky, scroll-linked, and deep-link-entry behavior is now verified visually on a fresh load as standing practice, not as an occasional instruction. Logged to `GOTCHAS.md` and project memory alongside the probe-uniqueness rule from Batch 8.

---

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
