/* Names on the Wall — collection script
 *
 * Deliberately small. Per D-012 every state already renders in index.html;
 * this file never injects content. Per D-013 there are no network calls.
 * Names on the Wall (Widget 2) needs no JS at all — it is a static
 * comparison per D-014, so nothing here touches it.
 *
 * Four jobs only:
 *   1. The Three Doors — show one house's panel (D-018)
 *   2. The Rampart — toggle the embankment
 *   3. Nav active-on-scroll
 *   4. Share / copy / print
 */

/* Mark exactly one button in a group pressed. */
function pressOnly(btns, key, attr) {
  btns.forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset[attr] === key));
  });
}

/* ---------- Widget 1: The Three Doors ---------- */
(function () {
  var widget = document.getElementById('doorsWidget');
  if (!widget) return;
  var btns = [].slice.call(widget.querySelectorAll('[data-door]'));

  function show(key) {
    btns.forEach(function (b) {
      var panel = document.getElementById(b.getAttribute('aria-controls'));
      if (panel) panel.hidden = b.dataset.door !== key;
    });
    pressOnly(btns, key, 'door');
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () { show(b.dataset.door); });
  });
  show('syn');
})();

/* ---------- Widget 3: The Rampart ---------- */
(function () {
  var widget = document.getElementById('rampartWidget');
  if (!widget) return;
  var btns = [].slice.call(widget.querySelectorAll('[data-ramp]'));

  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      widget.classList.toggle('is-after', b.dataset.ramp === 'after');
      pressOnly(btns, b.dataset.ramp, 'ramp');
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
      title: 'Names on the Wall',
      text: 'Three faiths, one street at Dura-Europos.',
      url: window.location.href
    }).catch(function () { /* user dismissed the sheet */ });
  } else {
    copyLink();
  }
}
