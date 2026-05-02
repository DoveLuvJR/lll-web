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
