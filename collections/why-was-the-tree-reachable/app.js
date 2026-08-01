/* Why Was the Tree Reachable? — page behavior
 *
 * Both components on this page follow the same rule, and it is a deliberate
 * departure from the stars page: every state is already rendered in the HTML.
 * JavaScript only toggles visibility. It never injects content.
 *
 * That means with JS off, or before it loads on a bad connection, all four
 * lens panels and all three drift states are visible, stacked, and readable.
 * Never a blank box. It also makes print correct for free — see the print
 * block in styles.css, which un-hides every state.
 */

/* ---------- Section 4: the lens picker ---------- */
const LENSES = ["freedom", "maturity", "trust", "seizure"];

function selectLens(key) {
  if (LENSES.indexOf(key) === -1) return;
  document.querySelectorAll(".lens-panel").forEach(p => {
    p.hidden = (p.dataset.lens !== key);
  });
  document.querySelectorAll(".chip").forEach(c => {
    const on = c.dataset.lens === key;
    c.classList.toggle("active", on);
    c.setAttribute("aria-selected", on ? "true" : "false");
    c.tabIndex = on ? 0 : -1;
  });
}

document.querySelectorAll(".chip").forEach(c => {
  c.addEventListener("click", () => selectLens(c.dataset.lens));
});

/* Arrow-key navigation, expected of anything using role="tablist". */
const chipRow = document.querySelector(".chips");
if (chipRow) {
  chipRow.addEventListener("keydown", e => {
    const keys = { ArrowLeft: -1, ArrowRight: 1, Home: "first", End: "last" };
    if (!(e.key in keys)) return;
    const current = document.querySelector(".chip.active");
    if (!current) return;
    const i = LENSES.indexOf(current.dataset.lens);
    let next;
    if (keys[e.key] === "first") next = 0;
    else if (keys[e.key] === "last") next = LENSES.length - 1;
    else next = (i + keys[e.key] + LENSES.length) % LENSES.length;
    e.preventDefault();
    selectLens(LENSES[next]);
    const btn = document.querySelector('.chip[data-lens="' + LENSES[next] + '"]');
    if (btn) btn.focus();
  });
}

/* Default state, per the contract: Freedom. */
selectLens("freedom");

/* ---------- Section 7: the drift panel ---------- */
const DRIFT_COUNT = 3;
let driftStep = 0;

function buildDriftDots() {
  const dots = document.getElementById("drift-dots");
  if (!dots) return;
  dots.innerHTML = "";
  for (let i = 0; i < DRIFT_COUNT; i++) {
    const dot = document.createElement("button");
    dot.className = "drift-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", "Go to state " + (i + 1) + " of " + DRIFT_COUNT);
    dot.addEventListener("click", () => { driftStep = i; renderDrift(); });
    dots.appendChild(dot);
  }
}

function renderDrift() {
  for (let i = 0; i < DRIFT_COUNT; i++) {
    const state = document.getElementById("drift-" + (i + 1));
    if (state) state.hidden = (i !== driftStep);
  }
  const prev = document.getElementById("drift-prev");
  const next = document.getElementById("drift-next");
  if (prev) prev.disabled = (driftStep === 0);
  if (next) next.disabled = (driftStep === DRIFT_COUNT - 1);
  document.querySelectorAll(".drift-dot").forEach((d, i) => {
    d.classList.toggle("current", i === driftStep);
    d.setAttribute("aria-current", i === driftStep ? "true" : "false");
  });
}

const driftPrev = document.getElementById("drift-prev");
const driftNext = document.getElementById("drift-next");
if (driftPrev) driftPrev.addEventListener("click", () => { if (driftStep > 0) { driftStep--; renderDrift(); } });
if (driftNext) driftNext.addEventListener("click", () => { if (driftStep < DRIFT_COUNT - 1) { driftStep++; renderDrift(); } });

buildDriftDots();
renderDrift();

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
