# BATCH 21 CONTRACT
**Project:** Growing Stone Library (LLL-Web) | **Title:** The Nations Before the Map | **Created:** 2026-10-20 | **Status:** 🟡 BUILT, IN REVIEW (Hashem's review list blocks the merge)
**Spec:** `docs/specs/SPEC_2026-10-20_nations-before-the-map.html` · **Branch:** `batch-21-nations-before-the-map`

## Ceremony tier (ship-over-harden)
**Tier 2 + content gates**, ruled by Hashem 2026-10-20.
- **Loud or silent:** silent. A misnamed nation, a published restricted story or a wrong fact raises no error.
- **Promise protected:** D-023's sourcing standard, and the Library's own line: *"Search the Scriptures, and see what is written."*
- **Effort card:** no number moves. The main path is already within budget (1 to 2 taps to the first answer).
- **Proposed by:** Hashem (spec), not an agent.
- **Does NOT do:** the Moving Map timeline, Alaska and Hawaii, new origin accounts beyond the 13 seeded, audio, or claims beyond the linguistic record (spec §15).

## SHIPS ONE OUTCOME
A reader can open `/collections/nations-before-the-map/`, tap a region or a name, and see whose name it is and where the nation's own account says they came from. Hashem can confirm this on the live page.

## SAFE ASSUMPTIONS & STOP-AND-ASK
**May decide without asking (each one is listed in the ship report):** follow the Names on the Wall and Gate file and naming patterns; simplify the region tracings; pick palette values that pass the contrast checks; word the chrome and captions.
**Must stop and ask:** anything that changes what the page says about a nation; a source for the map other than the LOC; any push or merge to `main`; the same failure after 2 fixes and one rethink.

## Rulings made during the batch
| # | Ruling | By |
|---|---|---|
| R1 | Tier 2 + content gates | Hashem |
| R2 | The map scan comes from the LOC IIIF service (`ct003648r`), downloaded by Hashem to `C:\Users\irwar\loc-scan\`. Never committed at full size | Hashem |
| R3 | "On the map" prints what the map prints: 6 labels respelled to the printed form, and 4 not printed as a single label (Sioux, Apache, Huron, Seminole), shown with a `map_note` | Hashem |
| R4 | The 1967-vs-today table is rebuilt from the 18 stocks printed in the legend; each "today" row is drafted and needs a ruling before publish | Hashem |
| R5 | Nine culture areas, not ten: the main sheet prints 9 (no Subarctic or Arctic) | Builder (followed the map; recorded as a spec difference) |

## STEP CLASSIFICATION
| Step | Type |
|---|---|
| Web copy of the scan (WebP + JPEG) | [DETERMINISTIC] |
| Check map labels against the scan | [AGENT] (done: 32/32) |
| Trace culture areas and family zones | [AGENT] |
| Widget markup from the seed files; highlight JS | [DETERMINISTIC] |
| Study prose and questions | [AGENT], then trust-check |
| Fit, overflow, contrast, weight and network checks | [DETERMINISTIC] |

## ACCEPTANCE CRITERIA (spec §13; content rows are blocking gates)
| Check | Passes when | Status |
|---|---|---|
| Widget fit | Widgets 1 and 3 are each ≤ 836px tall at 1440×900 (getBoundingClientRect, real browser) | ⬜ |
| Phone width | `scrollWidth` ≤ 375 at 375px | ⬜ |
| **Data integrity (gate)** | 31 name rows and 13 Lane A rows on the page, each with a source link | ⬜ |
| **Map labels (gate)** | Every published entry has `map_label_checked: true` | ✅ 32/32 |
| Links | Every source link checked; failures logged, not removed | ⬜ |
| Keyboard | Every region, chip and row reachable by Tab and opened by Enter | ⬜ |
| Contrast | Neighboring regions ≥ 3:1 and text ≥ 4.5:1, in light and dark | ⬜ |
| Page weight | Page plus images < 2 MB on first load | ⬜ |
| No network calls (D-013) | 0 matches for `fetch(`, `XMLHttpRequest` and `src="http` in the study folder | ⬜ |
| Nothing hidden | No `hidden` attribute inside the four widgets | ⬜ |
| **Restricted content (gate)** | No Catawba creation-story text; no Walam Olum citation | ⬜ |
| **Trust-check (gate)** | All reader prose passes trust-check before Hashem's review | ⬜ |
| No-JS read | With JS off, every widget reads as labeled, stacked content | ⬜ |

## Runtime Verification Gate
Required (new UI, highlight state, responsive layout). Run with Playwright against a local static server, and report observed values.

## Docs
| File | Update | Status |
|---|---|---|
| CHANGELOG.md | Batch 21 entry and ship report | ⬜ |
| DECISIONS.md | D-024 (origins badge rule) if adopted | ⬜ |
| README.md | Tree and collections table | ⬜ |
| collections/index.html | Study card | ⬜ |

## Hashem's review list (before merge to main)
1. Self-names whose spelling came only from Wikipedia (flagged per entry).
2. Hopi: a one-line outline plus a link (ruled 2026-10-20).
3. The region tracings, on screen.
4. Kickapoo stays hidden until its self-name is confirmed.
5. The 18 drafted "today" rows (R4).
6. The `map_note` wording for the 4 unprinted labels (R3).

## Rollback
The page is new and lives on its own branch. Rollback is `git revert` of the merge commit. No data or schema changes.

## PROOF GATE — Batch 21 (2026-10-20)

Evidence is in CHANGELOG.md, Batch 21. The scripts are `docs/build/shot.js` and `docs/build/interact.js` (Playwright, Chromium 156).

| Criterion | Evidence | Status |
|---|---|---|
| Widget fit | Explorer 822, Lenses map+tree 827, nav 64 (≤ 836) | ✅ |
| Phone width | `scrollWidth` 375 at 375 | ✅ |
| Data integrity (gate) | 31 name rows, 13 Lane A rows, every one with a source link; Kickapoo absent | ✅ |
| Map labels (gate) | 32/32 `map_label_checked` | ✅ |
| Links | 60 checked one at a time: 55 OK, 3 redirect, 1 403, 1 refused; all logged, none removed | ✅ |
| Keyboard | 50 controls + 19 fills by Tab; Enter/Space on SVG regions and fills | ✅ |
| Contrast | text ≥ 4.72 light / 6.11 dark; every fill ≥ 3:1 against both seams (spec difference, see CHANGELOG) | ✅ |
| Page weight | 806 KB | ✅ |
| No network calls | 0 / 0 / 0 greps; 0 off-site requests | ✅ |
| Nothing hidden | 0 `hidden`; select-all 44/44 | ✅ |
| Restricted content (gate) | no Catawba story text; Walam Olum only as a fabrication | ✅ |
| Trust-check (gate) | 5 honesty flags, 4 AI tells, all fixed; Scripture checked against KJV and NIV | ✅ |
| No-JS read | 9 cards, 31 names, 13 accounts; chips hidden | ✅ |
| Adversarial review | Codex gpt-5.6-sol: 7 HIGH fixed and re-tested; 3 MED logged; 2 LOW fixed | ✅ |
| Docs | CHANGELOG entry; D-024 proposed; README, collections card | ✅ |
| **Hashem's review list** | 8 ruled 2026-10-20 (CHANGELOG, Batch 21); item 6 is under research | 🟡 |
| Stocks table ruled | all 18 `ruled: true` (Hashem, 2026-10-20); built without `--draft` | ✅ |
