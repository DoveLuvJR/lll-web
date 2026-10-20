# DECISIONS — LLL Library

Architectural decisions that shape this repo. Append, don't rewrite — the log of *why* matters more than the latest snapshot.

---

## D-001 (2026-05-01) Vanilla HTML/CSS/JS, no framework

**Decision:** The library is built in vanilla HTML, CSS, and JavaScript. No React, Next.js, build tooling, or bundlers.

**Why:**
- Anyone with basic HTML knowledge (including Growing Stone fellowship members) can contribute content without learning a framework
- Edit-and-deploy in minutes — no `npm install`, no build step, no node_modules
- Iteration with AI agents stays fast and predictable
- Static files deploy to Vercel zero-config

**Trade-off accepted:** Once the library passes ~10 collections, hand-authored HTML for each will become tedious. Migration to Next.js is then straightforward because content lives in JSON files per collection. We'll cross that bridge when we get there.

---

## D-002 (2026-05-02) Multi-collection folder structure

**Decision:** Each collection lives in its own self-contained folder under `collections/`. Each collection owns its own HTML, CSS, JS, and content.

**Why:**
- Claude Code (or any contributor) can work on one collection without breaking another
- Collections can be added or removed without touching siblings
- Each collection's "signature interactive" can have its own dependencies and assets without polluting a global namespace

**Counter-considered:** A flat structure with shared everything. Rejected because every collection has its own visual identity and signature feature; sharing too aggressively would force every interactive to fit a generic mold.

---

## D-003 (2026-05-02) Conservative shared-CSS extraction

**Decision:** `shared/styles.css` contains only:
1. Google Fonts import (Cinzel, EB Garamond, Inter)
2. CSS reset
3. Three font-family CSS variables (`--font-display`, `--font-body`, `--font-ui`)

Everything else — colors, spacing, components, layout — stays in each collection's own stylesheet, even when "it might be reused later."

**Why:**
- Premature sharing creates fake reuse. A token is only "shared" once two real collections use it the same way.
- The next two collections (Cellular Engineering, Drenchy Breakdown) will reveal what's actually shared. Until then, copy-paste between collections is fine — cheaper than wrong abstractions.
- Hashem's explicit directive: "don't over-extract."

**When to revisit:** After Batch 5 (Drenchy Breakdown). At that point we'll have three collections and can compare their stylesheets to spot real overlap.

---

## D-004 (2026-05-02) Split TON's monolithic index.html into HTML + CSS + JS files

**Decision:** The original Table of Nations was a single 28KB `index.html` with inline `<style>` and `<script>`. On move into `collections/table-of-nations/`, it was split into three files: `index.html`, `styles.css`, `app.js`.

**Why:**
- Aligns TON with the structure future collections will use
- Makes the shared-CSS extraction possible (you can't import a stylesheet that doesn't exist as a file)
- Easier diffing and editing per concern

**Behavior preserved:** All 70 nation entries verbatim, all filter/search/share logic verbatim, identical visual design. Only the file boundaries changed.

---

## D-005 (2026-05-02) No `vercel.json` (yet)

**Decision:** The repo deploys with Vercel's defaults. No `vercel.json` is checked in.

**Why:**
- Vercel's default static-file behavior serves a directory path from its `index.html` (so `/collections/table-of-nations/` resolves to the correct file)
- Adding configuration that isn't needed creates surface area for future drift
- "If needed" was the kickoff prompt's own framing

**Revisit if:** the deploy shows broken routing, missing trailing-slash handling, or 404s on directory paths. At that point a minimal `vercel.json` with `cleanUrls: true` is the likely fix.

---

## D-006 (2026-05-02) Root URL serves placeholder, TON moves to a sub-path

**Decision:** After Batch 1, the root URL `/` serves a "Coming Soon" placeholder linking to TON. Table of Nations is accessible at `/collections/table-of-nations/`.

**Why:**
- The library hub coming in Batch 2 needs to live at root
- The placeholder is an honest "this is becoming something" signal — better than redirecting people who expect the library
- TON readers who had `/` bookmarked get a one-click path to the same content

**Trade-off accepted:** Anyone with a deep link to specific TON behavior (filters, search states) at `/` will see the placeholder. TON's URL has no fragment-state for filters, so this loss is minimal in practice.

---

## D-007 (2026-05-24) "What Are the Stars?" — local palette + Two Lenses, phased build

**Decision:** The second collection, `what-are-the-stars/`, gets its own ivory/ink/gold palette (paper `#fbfaf6`, ink `#1e2a3a`, gold `#8B6914`, plus telescope-blue and scroll-parchment column backgrounds) defined entirely inside its own `styles.css`. None of these tokens are promoted to `shared/styles.css`. The signature interactive is "Two Lenses" — a side-by-side telescope/scroll reader for stars named in Scripture.

**Why:**
- Honors D-003: even though this is the second collection (the threshold where shared-CSS extraction was originally going to be revisited), there is still no token used the same way across TON and this page. TON's gold is the title color and brand chrome; this page's gold is the Scripture-voice accent. Same hex, different semantic role — extracting it now would falsely conflate the two.
- Each collection earning its own visual identity is the whole point of D-002. The "observatory study desk" identity (warm ivory + deep slate + library gold) is deliberately different from TON's parchment + tri-color lineage.
- The Two Lenses interactive embodies this page's thesis ("both/and") in its structure — science voice and Scripture voice presented as equals, side by side. It can't be generalized to other collections without losing the meaning.

**Decision (phasing):** The page ships in two batches. Batch 1 (this commit) is Two Lenses + the full written study + Scripture index. Batch 2 (a future commit) will add two more interactives — "The Spectroscope" (slot reserved at the end of the "Reading the light" section) and "The Canon Walk" (will replace or augment the Scripture index). Placeholder `<!-- Batch 2: ... -->` comments mark the exact insertion points.

**Why phase:**
- One signature interactive + tight prose is a complete, shippable study on its own. The reader is not blocked on the other two.
- Building all three interactives in one batch risks scope creep and would make the diff harder to review.
- Placeholder comments are explicit anchors for the next session — no ambiguity about where the new components land.

**When to revisit shared-CSS extraction:** After a third collection lands. With three palettes side by side, real overlap will be visible. Until then, copy-paste between collections remains the right move.

---

## D-008 (2026-05-24) Public library name is "Growing Stone Library"

**Decision:** The public-facing name of this site, on every page a visitor can see, is **Growing Stone Library**. The previous placeholder homepage framed the site as the theological foundation beneath an apparel brand. That framing is gone — the homepage, page titles, meta tags, and the README's top description now present the site purely as a Scripture study library for the Growing Stone Fellowship. No mention of apparel, clothing, garments, or a brand on any visitor-facing page.

**Why:**
- The site stands on its own as a study library. The original "library underneath the brand" framing made the studies feel like marketing for a clothing project they aren't part of.
- "Growing Stone" is already how the Fellowship refers to itself in the existing footer line — the name extends what is already there.
- The footer line `Compiled for the Growing Stone Fellowship · Jumpshots from The Bleachers Inc.` stays untouched on every page; the parent organization credit is preserved, only the framing changed.

**Scope (what is NOT changing):**
- GitHub repo name remains `DoveLuvJR/lll-web` (cosmetic-only renames of repos break inbound links and deploy hooks; the owner handles repo/Vercel renames manually if/when desired)
- The Vercel project name and current production URL (`table-of-nations.vercel.app`) are unchanged
- `about.html` is intentionally left untouched in this batch — it remains a placeholder out of scope

**Supersedes:** D-006 ("Root URL serves placeholder, TON moves to a sub-path"). The root URL now serves the real Library hub, not a placeholder. The sub-path for TON is unchanged.

---

## D-009 (2026-05-24) Site-level chrome lives in `shared/site.css`, distinct from `shared/styles.css`

**Decision:** Pages that are *not* study collections — currently the homepage (`/`) and the collections landing (`/collections/`) — get their site-level chrome (hero, doorways, landing cards, site footer, the "ivory study" palette) from a new shared stylesheet `shared/site.css`. Per-collection pages (TON, Stars, future studies) do *not* link this stylesheet and are unaffected. `shared/styles.css` remains fonts + reset + three font-family CSS variables only.

**Why:**
- D-003 forbids promoting collection tokens to `shared/styles.css` because each study earns its own visual identity. That rule is about *study* pages. Hub/landing pages are site chrome, not studies — their job is to look consistent with each other, not to invent a new identity per page.
- Splitting site chrome from the reset prevents accidental contamination: a future engineer can't change the homepage's gold and accidentally change every collection's gold, because no collection links `site.css`.
- Two pages already share a palette and a card pattern — that's two real uses, the threshold for actual extraction (vs. premature DRY).

**Trade-off accepted:** A new collection that wants to look like the library hub would have to either link `site.css` (and accept the chrome conventions) or duplicate what it needs. That's fine — no study has asked to look like a landing page.

---

## D-010 (2026-05-24) "Perspectives from the Fellowship" pattern for community voices on a study page

**Decision:** On any study page where the Fellowship has multiple in-progress takes on a question, present them as an accordion of expandable cards under the heading **Perspectives from the Fellowship**, with each card holding one brother's leaning. Cards start collapsed (`aria-expanded="false"`), expand on header click, and rotate a chevron. The pattern includes a closing line: *More perspectives may be added as the Fellowship continues to search the Scriptures together.*

**Why:**
- Studies aren't sermons. The Fellowship is genuinely searching things out together, and the page shouldn't pretend one brother's reading is settled doctrine.
- Collapsing the perspectives keeps the page's main argument primary; expand-on-demand puts the community voices one tap away without crowding the prose.
- "Perspectives" (plural) signals an open posture: more readings can be added later without restructuring.

**Implementation conventions:**
- Card header is a real `<button type="button">` with `aria-expanded` toggled on click — not a `<div>` with a click handler
- Each card has a short italic teaser line under the title (visible while collapsed) so the reader can decide what to open
- Card style on this page is "ivory" — white background, gold-light left border that deepens to gold when open. Other study pages may restyle the cards to fit their palette; the structure stays the same.
- Print styles expand all perspectives and hide chevrons so the printed copy carries every voice

**Reusable on:** any future study where the Fellowship has more than one earnest take on a question.

---

## D-011 (2026-05-24) "What Are the Stars?" is the library's deliberately most-interactive collection

**Decision:** The stars page carries three interactives — **Two Lenses**, **The Spectroscope**, and **The Canon Walk** — plus the **Perspectives from the Fellowship** accordion. This is an intentional exception to the otherwise-strong pattern of "one signature interactive per collection" implied by D-002.

**Why:**
- The subject carries three distinct jobs, and no single interactive can do all three:
  - **Frame the tension** between the science voice and the Scripture voice — Two Lenses does this by putting them side by side on one star
  - **Answer the science question on its own terms** — Spectroscope makes the "how does anyone know without traveling there?" question concrete by letting the reader read the light themselves
  - **Gather the whole testimony in one place** — Canon Walk steps through every star passage in canonical order, ending on Christ, so the reader leaves with the full biblical witness, not a single proof-text
- This study is also the brother-prompted one ("a brother in the Fellowship asked"). It is more dialog than reference, and dialog wants more handles to grab.
- The single gradient on the page (the Spectroscope band) is specifically scoped to a literal rainbow — the rest of the design stays flat. The exception is honest and local.

**Why this does not become the new norm:**
- Most collections will be reference-shaped (TON's "what settled where" is one example). They want one signature interactive, not three.
- A page that needs three interactives is making three teaching jobs do work that one couldn't. That should be a deliberate choice with a defensible reason, not a habit.

**Operational note:** The plain Scripture index list stays below the Canon Walk. The Walk is the experience; the index is the static quick-reference (and the print-friendly fallback). Don't let live interactives replace text that earns its place by being readable on paper and by screen readers without JS.

---

## D-012 (2026-08-01) Interactive study components render every state in HTML; JS toggles visibility, never injects

**Decision:** Any interactive component on a Library study page ships **all of its states in the HTML**. JavaScript's only job is to hide and show them — it never writes content into an empty container. Components must render stacked, labeled, and fully readable with JavaScript unavailable.

**Established by:** `collections/why-was-the-tree-reachable/` (Batch 7), whose lens picker and drift panel both follow it.

**Why:**
- **A brother on bad signal must never hit a blank box.** The Fellowship reads on phones, often on poor connections. A component whose content arrives only after a script executes is empty until it does — and stays empty if the script fails.
- **Print works for free.** The stars page's injected components print whatever single state happened to be on screen. When every state is already in the DOM, the print stylesheet just un-hides them (`.lens-panel[hidden] { display: block !important }`) and the whole study prints.
- **Screen readers and search engines get the full text**, not a shell.
- This is the operational form of the note already at the end of D-011: *don't let live interactives replace text that earns its place by being readable on paper and by screen readers without JS.* D-011 said it; D-012 makes it a build rule.

**Supersedes the stars-page pattern.** `collections/what-are-the-stars/app.js` does the opposite — `<p id="tel-body"></p>` is empty markup filled by `selectStar()`. **Future studies inherit D-012, not that pattern.** The stars page is left as-is (changing it was out of scope for Batch 7), so treat it as the older way, not the reference.

**How to implement:**
- Set a `has-js` class on `<html>` from a tiny inline script in `<head>`. Controls that would be dead without JS (`.chips`, `.drift-ctrls`) are `display: none` by default and shown only under `.has-js`
- Each state carries its own visible label in the markup, so the stacked no-JS view is still navigable
- JS hides inactive states with the `hidden` attribute; the print block overrides it

**Reusable on:** every future collection. This is the default, not an exception.

---

## D-013 (2026-08-01) No AI or API calls in public Library pages

**Decision:** Library pages make **no network calls of any kind** — no AI inference, no `fetch`, no third-party embeds, no CDN scripts or stylesheets. Everything a page needs ships in its own folder. This holds for the blog when it exists.

**Why:**
- **Client-side keys are not safe.** Any API key reachable from a public static page is public. There is no way to call a paid AI service from a page like this without exposing the credential or standing up a backend the Library deliberately does not have.
- **Deterministic pages are the correct form for Scripture reference material.** A study is a fixed text. A reader returning to it, or printing it for dojo, must get the same words every time. Generated prose cannot promise that, and a wrong verse in a Fellowship study is worse than a missing feature.
- **It keeps D-001 honest.** Vanilla, no build step, no dependencies — a network dependency is a dependency, whether or not it appears in a `package.json`.
- **It survives.** No key to rotate, no quota to exhaust, no vendor to outlive the study.

**Note:** the Batch 7 study's own reading is drawn from AI system architecture. That is subject matter, not implementation — the page itself is inert HTML, CSS, and 130 lines of vanilla JS.

**Verification:** grep any Library page for `fetch(`, `XMLHttpRequest`, and `src="http` before shipping. Batch 7 ships with zero of each.

**Companion:** vault `DECISIONS.md` DEC-022 records the same decision at program level.

**Amendment (2026-09-12, Batch 14).** A browser audit of the gate study found **five requests to `vercel.live`**, a third-party iframe, and two polling fetches on a page whose source contains none of them. That is the Vercel Toolbar, injected by the platform at deploy time. The rule as written overclaimed: it can only promise that **the page's own source** makes no network calls, not that the host doesn't add its own. D-013 now reads as a rule about what we author, plus an operational requirement: **the Vercel Toolbar must be disabled for Production** on this project, and the network tab must be checked on a live deploy — not only grepped in the repo — before a study is called clean.

---

## D-014 (2026-08-01) Components whose rhetorical move is comparison are static, never tabbed

**Decision:** If a study component exists so the reader can **hold several things side by side**, it renders as static cards. Not tabs, not an accordion, not a carousel. Tabs are permitted only where the states are genuinely sequential or alternative — never where the page's argument depends on seeing them together.

**Established by:** Batch 8, replacing the four-tab lens picker in "Why Was the Tree Reachable?" with four static cards.

**Why:**
- **The layout was fighting the argument.** Section 5 ends on "All four would be satisfied by a tree behind a wall." That line is a claim about all four readings at once. A reader who can only see one at a time cannot test it. A tab strip is the single layout that makes comparison impossible, and it had been specced for the one section built entirely on comparison.
- **It removes a class of defects rather than one defect.** Static cards mean no `hidden` attributes, which means print, Ctrl+F, select-all-copy, translation tools, screen readers, and no-JS all work with nothing extra written for any of them.
- **It is less code.** `app.js` went from 122 lines to 71 — the tab handlers, arrow-key navigation, and roving tabindex all deleted. Fewer states to get wrong.

**How to tell which you have.** Ask what breaks if the reader sees everything at once. If the answer is "nothing, it just takes more space," it is a comparison — use cards. If the answer is "the sequence stops meaning anything," it may legitimately step.

**No live exceptions.** The drift panel in the same study was the candidate — its three retellings are genuinely sequential — and it was built as a stepper first. It was then made static too, because verification showed a select-all copy captured only the visible state, and a brother pasting the passage into a group chat is a real use. Stacked, the three retellings also read *better*: the addition and the negation are visible at the same time, which is the observation the section is making. Nothing on the page is hidden from copy, find, translation, or print.

**What this cost, and why it was still right:** the stepper's named controls were deleted. The gain was that the entire `has-js` progressive-enhancement mechanism became unnecessary, `app.js` fell to the share row alone, and the print stylesheet no longer has anything to un-hide.

**Relationship to [[D-012]]:** D-012 says every state must render in the HTML and JS may only toggle visibility. D-014 goes further for the comparison case: do not toggle at all. D-012 remains the rule for anything that legitimately steps.

**Reusable on:** every future collection. Prefer static. Make a component stateful only when the sequence itself carries meaning, and expect to justify it.

---

## D-015 (2026-08-01) Long studies carry persistent navigation, derived from their own headings

**Decision:** Any Library study long enough that its table of contents scrolls out of view carries **persistent** navigation — a fixed rail on wide screens, a sticky collapsed bar on narrow ones. Both are **generated at runtime from the page's own `h2`/`h3` elements**, never authored as a second copy of the outline. The static in-page TOC stays as the arrival view and the no-JS fallback.

**Established by:** Batch 9 on `why-was-the-tree-reachable`, which ran ~15 screens with navigation on exactly one of them.

**Why:**
- **A map that exists only at the trailhead is not a map.** A reader fourteen screens deep had no outline, no sense of position, and no way back to the top.
- **One source of truth.** Deriving the outline from the headings means it cannot drift out of sync with the document, and there is no duplicated block of link text for Ctrl+F to return twice.
- **It stays honest about what is chrome.** The deks and sub-headings appear in the nav because they were written to make opaque headings legible out of context — which is exactly what a nav entry is.

**Rules that come with it:**
- Nav chrome is `user-select: none` and hidden from print, so a paste into a group chat and a printed copy both carry the study and not the furniture
- Headings get `scroll-margin-top` at least the height of the sticky bar, or deep links land underneath it
- Chrome appears only once the reader has left the hero, so the static TOC is never shadowed by a duplicate of itself
- Sub-headings are included. A 15-screen page mapped only by its `h2`s is a coarse map

**This does not relax [[D-012]] or [[D-014]].** Those govern *content*: every state renders in the HTML, and comparison components are static. Navigation derived from headings is not content — if the script never runs, the study is complete and every anchor still works.

**Two implementation traps, both found by looking at a real 375px screen rather than measuring:**
1. Put the `has-js` and `scrolled` flags on the **same element**. Split across `<html>` and `<body>`, a selector like `.has-js.scrolled` silently never matches and the chrome simply never appears.
2. A deep link scrolls **after** the script runs and fires **no scroll event**. Without a `load` and `hashchange` pass, the first visibility check runs against `scrollY: 0` and the chrome stays hidden for anyone arriving by shared link — which is most people.

---

## D-016 (2026-09-12) Interactives that reveal a *pattern* highlight; they never swap content

**Decision:** When a component's teaching job is to show that several texts share a structure, it renders **every text in full, all the time**, and the control applies a **highlight class** to spans already in the markup. It never swaps, replaces, or hides content to "focus" the reader.

**Established by:** the Inscription Stone in `collections/whose-name-is-on-the-gate/` (Batch 12), where six real dedicatory inscriptions are each marked into three spans — the name, the gift, the standing claimed — and the buttons tint one span type across all six at once.

**Why:**
- **The pattern is the lesson, and a pattern needs its instances visible together.** The whole point of that widget is that five inscriptions have all three elements and the sixth is missing one. A reader shown one inscription at a time can be *told* that; they cannot *see* it.
- **Highlighting is the only interaction that costs nothing.** Because no content is removed from the DOM or marked `hidden`, select-all-copy, Ctrl+F, translation tools, screen readers, print, and no-JS all get the complete text with no extra code written for any of them. This is [[D-012]]'s goal reached by deleting the problem instead of compensating for it.
- **It degrades to plain reading.** With JS off, the controls are `display: none` (they would be dead) and the component is six readable slabs. Nothing is lost but the tint.

**Relationship to the existing rules.** [[D-012]] says every state renders in HTML and JS may only toggle visibility. [[D-014]] says comparison components do not toggle at all. D-016 covers the third case: a component that is neither a sequence nor a two-way comparison, but a **set with a shared shape**. The answer there is additive emphasis, not alternation.

**How to tell you have one.** Ask what the reader is supposed to notice. If the answer names a relationship *across* the items ("they all do X"; "this one doesn't"), highlight. If it names one item at a time, you may have a sequence — see D-012.

**Print rule that comes with it:** strip the highlight backgrounds in `@media print`. A tint that is meaningful on screen becomes an unexplained grey box on paper, and the reader cannot press the button that would explain it.

**Also settled in Batch 12:** the Donor Wall on the same page was specced as a two-mode toggle (Herod's Temple / New Jerusalem) and was built **static** instead, straight off [[D-014]]. Recorded here only as confirmation that D-014 now has a second application and still no live exceptions.

---

## D-017 (2026-09-12) If a component's argument is simultaneity, its height is a requirement — and it gets measured

**Decision:** When a component exists so the reader can see several things *at the same time*, its rendered height must fit the usable viewport at **1280×800**, and that is verified with a number from a real browser before the component is called done. Components whose comparison runs **horizontally** carry no such requirement.

**Established by:** the two widgets on `whose-name-is-on-the-gate` (Batches 13–14), which were correct in structure, passed every alignment check, and still failed — because a browser audit measured the Inscription Stone at **1059px against 836px of usable height**, and the Donor Wall at 1026px.

**The distinction that matters.** These two components look alike and are not alike:
- The **Inscription Stone** tints one element across six inscriptions. Its whole claim is *five carry this and one does not.* A reader who must scroll cannot see the claim, so the scroll destroys the component even though nothing is broken. Height is functional.
- The **Donor Wall** sets two walls beside each other. That comparison is intact at any scroll position, because the columns are side by side. Reading it top to bottom is normal. Height is cosmetic — and forcing it under the fold would have meant shrinking tiles and gutting notes to buy a property the component does not need.

The same rule applied to both would have degraded the Wall to fix the Stone.

**Why card grids are the wrong shape for this.** A three-across grid of six cards stretches every cell to the tallest in its row — the audit found 121px of empty box in one slab and 96px in another, and two rows costing 343px and 413px. Six full-width rows cost about 90px each. **Cards pay for their tallest member; rows pay only for themselves.** Prefer rows for any set of more than four items that must be compared at once.

**Two traps this found:**
1. **A width-capped column hides the problem.** `.wrap` is 900px, so the widgets measured identically at 1440 and 1280. A bigger monitor never rescues a component inside a fixed measure — checking on one large screen proves nothing.
2. **Trimming words does not close a 200px gap.** It buys tens of pixels and costs substance. When the gap is that size the shape is wrong, not the copy.

**Verification is a number, not a judgment.** Report widget height against `window.innerHeight` minus the sticky nav, at 1440×900 and 1280×800. "Looks fine" is not a result.

---

## D-018 (2026-09-24) The Three Doors: an approved tabbed comparison, with the D-012 safety net

**Decision:** `#doorsWidget` on `collections/names-on-the-wall/` shows **one house at a time** behind three buttons, as its spec requires. That is a comparison component built as tabs, which [[D-014]] forbids. It is an **explicit exception approved by Hashem**, not a relaxation of D-014.

**Established by:** Batch 15. The spec asked for one-at-a-time panels, no static six-row table anywhere, and, with JavaScript off, only the Synagogue panel. The last part would also have broken [[D-012]], since the other two houses' details would be unreachable without a script.

**How it honours what it can:**
- **D-012 is kept in full.** All three panels are in the HTML. JS only sets `hidden`. With JS off the buttons are `display: none` and all three panels stack, each under its own label. The Synagogue is first, so the spec's "shows the Synagogue panel" still holds, and nothing is lost.
- **No jump.** With JS on, the three panels share one grid cell, and inactive ones are `visibility: hidden` rather than `display: none`. The box is always as tall as the tallest house, with no measuring script.
- **Print un-hides all three**, same as D-012's print rule.
- **The comparison still happens on the page.** The Names on the Wall widget in the same study is static, three columns side by side, per D-014.

**Why accept the exception here:** the Doors panel is a six-row reference card per house, not the page's argument. The page's argument, credit → rank → prayer, lives in the static Names widget.

**Scope: this page only.** D-018 covers `#doorsWidget` on `collections/names-on-the-wall/` and nothing else. [[D-014]] stays in force for every other page and every other component, including the other two widgets on this page. It does not set a precedent. A future tabbed comparison anywhere else needs its own ruling.

---

## D-019 (2026-09-27) The fit contract is 1440×900; 1280×800 is deferred

**Decision:** D-017's fit target changes. A simultaneity widget must fit the usable height at **1440×900**, which is **836px** under the 64px sticky nav. **1280×800 is not a gate for now.** Both widgets on `whose-name-is-on-the-gate` are held to it, the Donor Wall included.

**Ruled by:** Hashem, 2026-09-27, in the viewport-fit spec for the gate study (Batch 16).

**What changes from D-017:**
- **Target size.** D-017 named 1280×800. That needs about 100px more cut from each widget, and the chrome can't give that much. It would mean cutting study copy, which D-017 itself warns against ("trimming words does not close a 200px gap").
- **The Donor Wall is now in scope.** D-017 called its height cosmetic, since side-by-side columns survive scrolling. The owner ruled it must fit as well, so both widgets carry the requirement on this page.

**What does not change:** verification is still a number from a real browser at the stated size, and a width-capped column still hides the problem. Both widgets measure the same at 1440 and 1280.

**How the height was bought (and how not to buy it):** trim chrome only: widget padding, the eyebrow line, a one-line hint, and the caption moved *outside* the box as commentary. The Donor Wall's two bands are sized by Herod's wall (about 1px of slack each), so shrinking anything on the New Jerusalem side saves nothing. `.wall-hd` and `.wall-foot` are trimmed by padding only, never by a fixed row height on `.wall-pair`, which would break the subgrid.

**Known exposure:** at 1280×800 the Stone overflows by about 74px and the Wall by about 92px. Revisit if reader data shows laptop-height screens matter.

---

## D-020 (2026-10-19) Copy passes freeze Scripture; confirmed errors get their own batch

**Decision:** A copy pass, like Batch 17's Trust Check, **freezes** every Scripture quotation, verse reference, quoted source, name, date and number. A rewrite then can't change any of them by accident. When the pass finds a confirmed factual error in frozen text, the error is **flagged, not fixed**. It is then fixed in its own small batch, approved by Hashem, with its own commit. It is never folded silently into the rewrite.

**Ruled by:** Hashem, 2026-10-19. Batch 17b is the first case: Psalm 1:6, the Rev 8:5 cite, the Nabonidus credit, and the Gen 10:11 note.

**Why:**
- **A rewrite diff should be checkable by one rule:** no verse, quote, name or number moved. Mixing fact fixes into a copy pass breaks that rule. A reviewer can no longer tell an intended correction from an accidental one.
- **D-013 already says a wrong verse is worse than a clumsy sentence.** The fix for a wrong verse deserves the same weight: a named batch, a ruling, and a before → after record. A line buried in a style diff gets none of that.
- **A separate commit is revertible on its own.** If a "fix" turns out to be wrong, it can be undone without losing the copy work, or the other way round.

**How to apply:**
- The copy-pass report lists factual errors under honesty flags, marked HIGH, with the evidence. Its proposed rewrites never touch them.
- The fix batch lifts the freeze **for named items only** and lists them. Anything found in passing (as with Batch 17b's second `6:12`, and "ancestor" → "predecessor") needs an explicit ruling before it rides along.

---

## D-021 (2026-10-19) Fonts are self-hosted; amends D-003 item 1

**Decision:** D-003 item 1 changes from "Google Fonts import (Cinzel, EB Garamond, Inter)" to **self-hosted `@font-face` for Cinzel, EB Garamond and Inter, with the WOFF2 files in `shared/fonts/`**. The OFL license texts sit beside the files. D-003's other items, the reset and the three font-family variables, are unchanged.

**Ruled by:** Hashem, 2026-10-19: "self-host, no D-013 exception." Batch 18.

**Why:**
- **D-003 and D-013 contradicted each other.** D-003 required a stylesheet from Google's CDN, and D-013 forbids every network call. Each page broke D-013 on load (42 requests across 9 pages). D-013 is the rule with a reason that holds up: a study must load the same way on bad signal and outlive any vendor. So D-003 gives way.
- **It costs nothing visible.** The same font versions, the same fixed-weight declarations and the same `unicode-range` subsets produce pixel-identical text (0 differing pixels across 20 before/after pairs).

**How to apply:**
- **Ship only faces a page draws.** Measure computed family, weight and style across every page before adding or dropping a face. Cinzel 400 was dropped this way.
- **Keep fixed weights** (`font-weight: 600`), not ranges, unless a ruling accepts the visual change. Google's declarations are fixed, and Inter 700 text has always rendered at 600.
- **Add a subset** (for example Greek) only when a page uses that script. Files load lazily through `unicode-range`, so a shipped subset costs repo size, not page weight.

---

## D-022 (2026-10-19) `vercel.json` exists for one header: long-lived font caching

**Decision:** The repo carries a `vercel.json` with exactly one rule. Everything under `/shared/fonts/` is served with `Cache-Control: public, max-age=31536000, immutable`. This is an **explicit exception to [[D-005]]** ("no `vercel.json` yet"), not a repeal of it. `.vercelignore` allowlists `vercel.json` so Vercel is certain to read it.

**Ruled by:** Hashem, 2026-10-19. Batch 19.

**Why:**
- **D-021 moved the fonts off Google's CDN, and the cache lifetime went with them.** Vercel's default for static files is `max-age=0, must-revalidate`, so every page view re-checks 3–5 font files with the server. Each check is cheap, but on the poor phone signal D-012 is written for, that is 3–5 round trips per page with nothing to show for them.
- **Fonts are the one asset that never changes in place.** Pages and stylesheets do change. They keep Vercel's default revalidation, so an edited study is seen right away. Only the fonts get the long lifetime.
- **This is the "needed" D-005 waited for.** D-005 said to add config only once something requires it. A measured header problem on production qualifies, and the file holds only that.

**How to apply:**
- **Never replace a font file under the same name.** `immutable` means returning readers keep the old file for up to a year. A changed font gets a new filename (for example `inter-latin-v21.woff2`) and an updated `@font-face` `src`.
- **Anything else added to `vercel.json`** (redirects, `cleanUrls`, other headers) needs its own ruling and DECISIONS entry. D-005 still holds for everything this decision doesn't name.

---

## D-023 (2026-10-19) Sourcing standard for studies

**Decision:**
1. **Every study carries a sources line** in its footer that a reader can follow up: an author and title, an ancient work with its section, a museum number, or a named translation.
2. **A claim needs a citation** when a reader would repeat it as fact **and** it is not in Scripture or common reference.
3. **Mainstream facts may stand uncited once ruled,** and the ruling is recorded in the CHANGELOG. An unruled gap stays flagged.
4. **Pull-quote styling** (`class="pq"` with an attribution line) is reserved for **real quotations**. The page's own prose may use the box only if the attribution says it is a paraphrase.
5. **Scripture quotations match a published translation word for word,** and the sources line names every translation used.

**Ruled by:** Hashem, 2026-10-19. Batch 20, which accepted all 32 rulings.

**Why:**
- **The gaps were real, not cosmetic.** A search of only 16 flagged items turned up a false geography claim (Arwad), an unsupported island group (Dodecanese), a church dated 8 years early, a "quotation" that was never quoted, and four verse texts that matched no Bible. All of them failed silently. Nothing on the page told a reader which lines were firm.
- **The Gate study already promised this:** *"It is worth knowing which is which before anyone repeats it."* A sources line is how a page keeps that promise.
- **Ruling mainstream facts closed, instead of citing everything, keeps this from becoming a cathedral.** Citing every distance and date would make the pages more correct without making them more useful.

**How to apply:**
- **New studies** ship with a sources line, and with every quote checked against its named translation (biblegateway.com is enough).
- **Researched citations go through a ruling before they reach a page.** An agent may propose a source but never apply it unruled (Batch 17's honesty rule, carried forward).
- **Where a source is known only second-hand** (a search summary, a 403), the CHANGELOG says so until someone opens it.


---

## D-024 (2026-10-20) Origin accounts: the nation's own words, in their own lane, with marks for what is not ours to tell

**Decision:** When a study presents where a people came from, it follows these rules:
1. **Two lanes, never merged.** A nation's own account sits beside a scholarly reconstruction, such as a linguist's homeland. The two are never combined into one sentence.
2. **Lane A is a short paraphrase of what the nation itself has published,** linked to that page. Outside retellings are never used.
3. **Four marks, modeled on Local Contexts Traditional Knowledge labels, in our own wording:**
   - **Winter story:** told only in winter, so kept to an outline.
   - **Sacred place:** names a place the nation protects.
   - **Held by the Nation:** kept for the nation's own members. Never retold; the row says only that the nation holds it.
   - **Ask permission:** the nation asks to be contacted before its stories are used.
4. **When a nation asks for caution, the page says less than the draft did,** and the batch records what was cut.

**Ruled by:** Hashem, 2026-10-20: adopted as written, as a standing rule. Batch 21.

**Why:**
- **They are different kinds of claim.** Side by side, each keeps its standing, and the reader can compare them.
- **Several nations ask that their stories not circulate out of context** (the Hopi Cultural Preservation Office; the Delaware Nation's caution about publishing Lenape culture; seasonal telling for Diné and Ojibwe accounts; the Catawba archive's members-only access). Using only what a nation chose to publish respects that, and keeps the page defensible.
- **A mark is cheaper than a judgment call each time.** The reader sees why a row is short, and the next study inherits the rule.

**How to apply:**
- A Lane A row may claim only what its linked page says. Batch 21's review caught an outline that claimed more (Hopi), so check the page itself.
- Link the nation's own record, even when it is restricted (the Catawba archive). Never link a third-party retelling instead.
- The marks are additive tints and text, so D-016 holds: nothing hides.
