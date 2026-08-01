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
