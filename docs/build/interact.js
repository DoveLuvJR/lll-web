// Behaviour checks for Batch 21: highlights, keyboard, no-JS, nothing hidden, deep link.
const { chromium } = require('playwright');
const EXE = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const BASE = 'http://127.0.0.1:8790/collections/nations-before-the-map/';
const out = (k, v) => console.log(k.padEnd(44), typeof v === 'string' ? v : JSON.stringify(v));

(async () => {
  const b = await chromium.launch({ executablePath: EXE });

  // ---- JS on ----
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '?v=' + Date.now(), { waitUntil: 'networkidle' });

  await p.locator('#explorer .area[data-area="plains"]').click({ force: true });
  out('W1 click Plains: region on / card on', await p.evaluate(() => [
    document.querySelector('.area[data-area="plains"]').classList.contains('is-on'),
    document.querySelector('.ex-card[data-area="plains"]').classList.contains('is-on'),
    document.querySelectorAll('#explorer .is-on').length]));
  await p.locator('#explorer .ex-card[data-area="desert"]').click();
  out('W1 click Desert card: region on, total on', await p.evaluate(() => [
    document.querySelector('.area[data-area="desert"]').getAttribute('aria-pressed'),
    document.querySelectorAll('#explorer .is-on').length]));
  await p.locator('#explorer [data-hl="nc"]').click();
  out('W1 NC chip: widget class, NC people', await p.evaluate(() => [
    document.getElementById('explorer').classList.contains('hl-nc'),
    document.querySelectorAll('#explorer li.nc').length]));
  await p.locator('#explorer [data-hl="clear"]').click();
  out('W1 Clear: anything still on', await p.evaluate(() =>
    document.querySelectorAll('#explorer .is-on').length + (document.getElementById('explorer').classList.contains('hl-nc') ? 1 : 0)));

  // keyboard: focus a region and press Enter, then a card button and Space
  await p.focus('#explorer .area[data-area="southwest"]');
  await p.keyboard.press('Enter');
  await p.focus('#explorer .ex-name[data-area="northeast"]');
  await p.keyboard.press('Space');
  out('W1 keyboard Enter region, Space card', await p.evaluate(() =>
    [...document.querySelectorAll('#explorer .area.is-on')].map(a => a.dataset.area)));
  const tabbables = await p.evaluate(() => [...document.querySelectorAll('#explorer .area, #explorer .ex-name, .chip, .stock')]
    .filter(el => el.tabIndex >= 0).length);
  out('Tab-reachable regions+cards+chips+stocks', tabbables);

  for (const [w, k] of [['names', 'outsider'], ['names', 'respelled'], ['names', 'nc'], ['origins', 'nc'], ['origins', 'winter'], ['origins', 'migration']]) {
    await p.locator(`#${w} [data-hl="${k}"]`).click(); await p.waitForTimeout(400);
    const r = await p.evaluate(([w, k]) => {
      const rows = [...document.querySelectorAll(`#${w} [data-tags~="${k}"]`)];
      const tinted = rows.filter(r => { const c = getComputedStyle(r.querySelector('td') || r).backgroundColor; return c !== 'rgba(0, 0, 0, 0)'; });
      return [rows.length, tinted.length];
    }, [w, k]);
    out(`${w} chip ${k}: rows, tinted`, r);
  }
  await p.locator('#lenses .stock[data-fam="na-dene"]').click();
  await p.waitForTimeout(400);
  out('W3 pick Na-Dene: fam on, faded others', await p.evaluate(() => [
    document.querySelector('.fam[data-fam="na-dene"]').classList.contains('is-on'),
    getComputedStyle(document.querySelector('.fam[data-fam="gulf"]')).opacity]));
  await p.locator('#lenses [data-mode="culture"]').click();
  await p.waitForTimeout(400);
  out('W3 Culture lens: ca stroke, fill opacity', await p.evaluate(() => [
    getComputedStyle(document.querySelector('.ca')).strokeWidth, getComputedStyle(document.querySelector('.fam[data-fam="gulf"]')).opacity]));
  await p.screenshot({ path: 'state_lenses.png', clip: await p.locator('#lenses .ln-grid').boundingBox() });

  out('hidden attrs inside widgets', await p.evaluate(() =>
    document.querySelectorAll('#explorer [hidden], #names [hidden], #lenses [hidden], #origins [hidden]').length));

  // select-all copy carries every row: probe each self-name / nation, count must be >= 1 in the copied text
  const copy = await p.evaluate(() => { const s = getSelection(); s.selectAllChildren(document.body); const t = s.toString(); s.removeAllRanges(); return t; });
  const probes = await p.evaluate(() => [...document.querySelectorAll('#names .self, #origins .lane-a .org-nation')].map(e => e.textContent.trim()));
  out('select-all: rows probed / found', [probes.length, probes.filter(t => copy.includes(t)).length]);

  // ---- deep link, fresh load ----
  const d = await ctx.newPage();
  await d.goto(BASE + '?v=' + Date.now() + '#m4', { waitUntil: 'networkidle' });
  await d.waitForTimeout(400);
  out('deep link #m4: scrollY, h2 top, nav active', await d.evaluate(() => [
    Math.round(scrollY), Math.round(document.querySelector('#m4 h2').getBoundingClientRect().top),
    (document.querySelector('.nav a.active') || {}).textContent || 'none']));
  await d.screenshot({ path: 'deeplink_m4.png' });

  // ---- JS off ----
  const nj = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const q = await nj.newPage();
  await q.goto(BASE + '?v=' + Date.now(), { waitUntil: 'networkidle' });
  out('no-JS: chips visible / cards / rows / accounts', await q.evaluate(() => [
    [...document.querySelectorAll('.chips')].filter(c => getComputedStyle(c).display !== 'none').length,
    document.querySelectorAll('.ex-card').length, document.querySelectorAll('.nm-row').length,
    document.querySelectorAll('.org-row').length]));
  await q.locator('#explorer').screenshot({ path: 'nojs_explorer.png' });

  // ---- print media ----
  await p.emulateMedia({ media: 'print' });
  out('print: chips / nav displayed', await p.evaluate(() => [
    getComputedStyle(document.querySelector('.chips')).display, getComputedStyle(document.getElementById('nav')).display]));
  await b.close();
})();
