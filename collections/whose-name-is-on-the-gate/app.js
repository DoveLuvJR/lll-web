/* Whose Name Is On the Gate? — collection script
 *
 * Deliberately small. Per D-012 every state already renders in index.html;
 * this file never injects content. Per D-013 there are no network calls.
 * The Donor Wall (Widget 2) needs no JS at all — it is a static comparison
 * per D-014, so nothing here touches it.
 *
 * Three jobs only:
 *   1. Inscription Stone — toggle a highlight class (never hides anything)
 *   2. Nav active-on-scroll
 *   3. Share / copy / print
 */

/* ---------- Widget 1: Inscription Stone highlighting ---------- */
(function () {
  var slabs = document.getElementById('slabs');
  var btns = document.querySelectorAll('.hl-btn');
  if (!slabs || !btns.length) return;

  var MODES = ['who', 'what', 'why'];
  var active = null;

  function apply(mode) {
    MODES.forEach(function (m) {
      slabs.classList.toggle('hl-' + m, m === mode);
    });
    btns.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.hl === mode));
    });
    active = mode;
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var want = b.dataset.hl;
      // "Clear", or pressing the live button again, turns highlighting off.
      apply(want === 'clear' || want === active ? null : want);
    });
  });
})();

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
      title: 'Whose Name Is On the Gate?',
      text: 'Ancient temples named whoever paid. Revelation puts twelve names with no money on the foundations.',
      url: window.location.href
    }).catch(function () { /* user dismissed the sheet */ });
  } else {
    copyLink();
  }
}
