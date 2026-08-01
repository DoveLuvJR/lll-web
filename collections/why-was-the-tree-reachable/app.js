/* Why Was the Tree Reachable? — page behavior
 *
 * NO CONTENT IS EVER HIDDEN OR INJECTED BY THIS FILE.
 *
 * Both of the study's components are static: the four older readings are
 * cards, not tabs, because the section's move is comparison (D-014), and all
 * three drift retellings are stacked so select-all, Ctrl+F, translation, and
 * print reach every word. That property is not negotiable and nothing below
 * touches it.
 *
 * What this file adds is navigation chrome, derived from the document's own
 * headings rather than authored twice:
 *   1. a persistent rail on wide screens, with the current section marked
 *   2. a collapsed sticky bar on narrow screens, expandable to the full list
 *
 * Both are built from the h2/h3 elements already on the page, so there is one
 * source of truth for the outline and no duplicate copy for Ctrl+F to trip on.
 * Neither is content. If this file never runs, the static table of contents in
 * the hero remains, every anchor still works, and the study is unaffected.
 */

document.documentElement.classList.add("has-js");

/* ---------- Read the outline out of the document ---------- */
function readOutline() {
  const dekOf = el => {
    const n = el.nextElementSibling;
    return n && n.classList.contains("dek") ? n.textContent.trim() : "";
  };
  return [...document.querySelectorAll("main.prose h2[id]")].map(h2 => {
    const section = h2.closest("section");
    return {
      id: h2.id,
      text: h2.textContent.trim(),
      dek: dekOf(h2),
      /* .lens-name h3s are the four reading cards, not outline entries */
      kids: section
        ? [...section.querySelectorAll("h3[id]:not(.lens-name)")].map(h3 => ({
            id: h3.id, text: h3.textContent.trim(), dek: dekOf(h3)
          }))
        : []
    };
  });
}

const OUTLINE = readOutline();

function outlineList(className) {
  const ol = document.createElement("ol");
  ol.className = className;
  OUTLINE.forEach(s => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + s.id;
    a.textContent = s.text;
    a.dataset.target = s.id;
    li.appendChild(a);
    if (s.dek) {
      const d = document.createElement("span");
      d.className = "nav-dek";
      d.textContent = s.dek;
      li.appendChild(d);
    }
    if (s.kids.length) {
      const sub = document.createElement("ol");
      sub.className = "nav-sub";
      s.kids.forEach(k => {
        const kli = document.createElement("li");
        const ka = document.createElement("a");
        ka.href = "#" + k.id;
        ka.textContent = k.text;
        ka.dataset.target = k.id;
        kli.appendChild(ka);
        if (k.dek) {
          const kd = document.createElement("span");
          kd.className = "nav-dek";
          kd.textContent = k.dek;
          kli.appendChild(kd);
        }
        sub.appendChild(kli);
      });
      li.appendChild(sub);
    }
    ol.appendChild(li);
  });
  return ol;
}

/* ---------- The rail (wide screens) ---------- */
const rail = document.createElement("nav");
rail.className = "rail";
rail.setAttribute("aria-label", "Study contents");
const railTitle = document.createElement("p");
railTitle.className = "rail-title";
railTitle.textContent = "Contents";
rail.appendChild(railTitle);
rail.appendChild(outlineList("rail-list"));
const railTop = document.createElement("a");
railTop.className = "rail-top";
railTop.href = "#top";
railTop.textContent = "↑ Back to top";
rail.appendChild(railTop);
document.body.appendChild(rail);

/* ---------- The sticky bar (narrow screens) ---------- */
const bar = document.createElement("div");
bar.className = "tocbar";
bar.innerHTML =
  '<button class="tocbar-btn" type="button" aria-expanded="false" aria-controls="tocbar-panel">' +
    '<span class="tocbar-meta"><span class="tocbar-kicker">Contents</span>' +
    '<span class="tocbar-current"></span></span>' +
    '<span class="tocbar-chev" aria-hidden="true">▾</span>' +
  '</button>' +
  '<div class="tocbar-panel" id="tocbar-panel" hidden></div>';
const panel = bar.querySelector(".tocbar-panel");
panel.appendChild(outlineList("bar-list"));
const barTop = document.createElement("a");
barTop.className = "rail-top";
barTop.href = "#top";
barTop.textContent = "↑ Back to top";
panel.appendChild(barTop);
document.body.appendChild(bar);

const barBtn = bar.querySelector(".tocbar-btn");
const barCurrent = bar.querySelector(".tocbar-current");

function closeBar() {
  panel.hidden = true;
  barBtn.setAttribute("aria-expanded", "false");
  bar.classList.remove("open");
}
barBtn.addEventListener("click", () => {
  const open = panel.hidden;
  panel.hidden = !open;
  barBtn.setAttribute("aria-expanded", open ? "true" : "false");
  bar.classList.toggle("open", open);
});
panel.addEventListener("click", e => { if (e.target.tagName === "A") closeBar(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeBar(); });

/* ---------- Which section am I in ---------- */
const TARGETS = OUTLINE.flatMap(s => [s.id, ...s.kids.map(k => k.id)])
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navLinks = [...document.querySelectorAll(".rail-list a, .bar-list a")];
let currentId = null;

function markCurrent() {
  const line = window.scrollY + 90;
  let active = TARGETS[0];
  for (const t of TARGETS) {
    if (t.getBoundingClientRect().top + window.scrollY <= line) active = t;
    else break;
  }
  if (!active || active.id === currentId) return;
  currentId = active.id;
  navLinks.forEach(a => {
    const on = a.dataset.target === currentId;
    a.classList.toggle("current", on);
    if (on) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  /* the bar shows the nearest top-level section, not the sub-heading */
  const top = OUTLINE.find(s => s.id === currentId)
    || OUTLINE.find(s => s.kids.some(k => k.id === currentId));
  barCurrent.textContent = top ? top.text : "";
}

/* Chrome appears only once the reader has left the hero, so the static TOC
   is not shadowed by a duplicate of itself on arrival. */
const heroTOC = document.querySelector(".toc");
function toggleChrome() {
  const past = heroTOC
    ? heroTOC.getBoundingClientRect().bottom < 0
    : window.scrollY > 400;
  /* Both flags live on <html> so `.has-js.scrolled` matches one element. */
  document.documentElement.classList.toggle("scrolled", past);
  if (!past) closeBar();
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { markCurrent(); toggleChrome(); ticking = false; });
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
/* A deep link jumps after this script runs and fires no scroll event, so the
   first pass has to happen again once the browser has settled on a position. */
window.addEventListener("load", onScroll);
window.addEventListener("hashchange", onScroll);
markCurrent();
toggleChrome();

/* ---------- Share row ---------- */
function copyLink() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => showToast("Link copied to clipboard"))
    .catch(() => showToast("Couldn't copy — try manually"));
}

function shareNative() {
  if (navigator.share) {
    navigator.share({
      title: "Why Was the Tree Reachable?",
      text: "A question the older answers mostly skip — a study for the Growing Stone Fellowship",
      url: window.location.href
    });
  } else {
    copyLink();
  }
}

function showToast(m) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = m;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}
