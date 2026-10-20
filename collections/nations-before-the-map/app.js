/* The Nations Before the Map — collection script
 *
 * Deliberately small. Per D-012 every state already renders in index.html;
 * this file never injects content and never hides anything (D-016): it only
 * adds and removes highlight classes. Per D-013 there are no network calls.
 *
 * Six jobs only:
 *   1. Map Explorer — light a culture area and its card together
 *   2. Names Then & Now — tint rows by kind
 *   3. Three Lenses — strengthen one layer; light one stock
 *   4. Origins & Homelands — tint rows by mark
 *   5. Nav active-on-scroll
 *   6. Share / copy / print
 */

/* Mark the pressed chip in a group; "clear" never stays pressed. */
function pressChip(chips, key, attr) {
  chips.forEach(function (c) {
    if (c.dataset[attr] === 'clear') return;
    c.setAttribute('aria-pressed', String(c.dataset[attr] === key));
  });
}

/* A chip group that sets one hl-<key> class on its widget. Pressing the live
 * chip again, or Clear, turns tinting off (same as the Inscription Stone). */
function tintGroup(widgetId, keys) {
  var w = document.getElementById(widgetId);
  if (!w) return null;
  var chips = [].slice.call(w.querySelectorAll('.chips [data-hl]'));
  var active = null;
  function apply(key) {
    keys.forEach(function (k) { w.classList.toggle('hl-' + k, k === key); });
    pressChip(chips, key, 'hl');
    active = key;
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var want = c.dataset.hl;
      apply(want === 'clear' || want === active ? null : want);
    });
  });
  return apply;
}

/* SVG paths with role="button" need Enter and Space by hand. */
function onActivate(el, fn) {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fn(); }
  });
}

/* ---------- Widget 1: Map Explorer ---------- */
(function () {
  var w = document.getElementById('explorer');
  if (!w) return;
  var areas = [].slice.call(w.querySelectorAll('.area'));
  var cards = [].slice.call(w.querySelectorAll('.ex-card'));
  var names = [].slice.call(w.querySelectorAll('.ex-name'));
  var current = null;
  var tintNc = tintGroup('explorer', ['nc']);

  function pick(key) {
    current = key === current ? null : key;
    areas.forEach(function (a) {
      var on = a.dataset.area === current;
      a.classList.toggle('is-on', on);
      a.setAttribute('aria-pressed', String(on));
    });
    cards.forEach(function (c) { c.classList.toggle('is-on', c.dataset.area === current); });
    names.forEach(function (n) { n.setAttribute('aria-pressed', String(n.dataset.area === current)); });
  }

  areas.forEach(function (a) { onActivate(a, function () { pick(a.dataset.area); }); });
  // The whole card is a target for a tap; its name button carries keyboard focus.
  cards.forEach(function (c) {
    c.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) return;
      pick(c.dataset.area);
    });
  });
  w.querySelector('.chips [data-hl="clear"]').addEventListener('click', function () {
    if (current) pick(current);
    if (tintNc) tintNc(null);
  });
})();

/* ---------- Widget 2: Names Then & Now ---------- */
tintGroup('names', ['outsider', 'respelled', 'nc']);

/* ---------- Widget 3: Three Lenses ---------- */
(function () {
  var w = document.getElementById('lenses');
  if (!w) return;
  var modes = [].slice.call(w.querySelectorAll('.chips [data-mode]'));
  var stocks = [].slice.call(w.querySelectorAll('.stock'));
  var fams = [].slice.call(w.querySelectorAll('.fam'));
  var mode = null, picked = null;

  function setMode(m) {
    mode = (m === 'clear' || m === mode) ? null : m;
    w.classList.toggle('mode-culture', mode === 'culture');
    w.classList.toggle('mode-language', mode === 'language');
    pressChip(modes, mode, 'mode');
    if (m === 'clear') pick(null);
  }
  function pick(f) {
    picked = (f === null || f === picked) ? null : f;
    w.classList.toggle('has-pick', picked !== null);
    fams.forEach(function (p) {
      var on = p.dataset.fam === picked;
      p.classList.toggle('is-on', on);
      p.setAttribute('aria-pressed', String(on));
    });
    stocks.forEach(function (s) { s.setAttribute('aria-pressed', String(s.dataset.fam === picked)); });
  }

  modes.forEach(function (c) { c.addEventListener('click', function () { setMode(c.dataset.mode); }); });
  stocks.forEach(function (s) { s.addEventListener('click', function () { pick(s.dataset.fam); }); });
  // The fills are targets too, by mouse and by keyboard (spec §13: every region by Tab).
  fams.forEach(function (p) { onActivate(p, function () { pick(p.dataset.fam); }); });
})();

/* ---------- Widget 4: Origins & Homelands ---------- */
tintGroup('origins', ['nc', 'winter', 'migration']);

/* ---------- Nav active-on-scroll ---------- */
(function () {
  var links = [].slice.call(document.querySelectorAll('.nav a'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var secs = links.map(function (a) { return document.getElementById(a.dataset.t); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      links.forEach(function (a) { a.classList.toggle('active', a.dataset.t === id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(function (s) { if (s) io.observe(s); });
})();

/* ---------- Share / print ---------- */
function showToast(m) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = m;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2500);
}

function copyLink() {
  if (!navigator.clipboard) { showToast("Couldn't copy — try manually"); return; }
  navigator.clipboard.writeText(window.location.href)
    .then(function () { showToast('Link copied to clipboard'); })
    .catch(function () { showToast("Couldn't copy — try manually"); });
}

function shareNative() {
  if (navigator.share) {
    navigator.share({
      title: 'The Nations Before the Map',
      text: 'Whose names are written on a 1967 map of the nations, and what the nations call themselves.',
      url: window.location.href
    }).catch(function () { /* user dismissed the sheet */ });
  } else {
    copyLink();
  }
}
