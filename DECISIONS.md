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
