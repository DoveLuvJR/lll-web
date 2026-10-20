// Production check for Batch 21 (table-of-nations.vercel.app).
const { chromium } = require('playwright');
const EXE = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const HOST = 'https://table-of-nations.vercel.app';
const PAGE = HOST + '/collections/nations-before-the-map/';
const out = (k, v) => console.log(k.padEnd(40), typeof v === 'string' ? v : JSON.stringify(v));

(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [], offsite = [], fails = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('request', r => { if (!r.url().startsWith(HOST)) offsite.push(r.url()); });
  p.on('response', r => { if (r.status() >= 400) fails.push(r.status() + ' ' + r.url()); });
  const resp = await p.goto(PAGE + '?v=' + Date.now(), { waitUntil: 'networkidle' });
  out('page status / title', [resp.status(), await p.title()]);
  out('fit: nav, explorer, lenses map+tree', await p.evaluate(() => [
    Math.round(document.getElementById('nav').getBoundingClientRect().height),
    Math.round(document.getElementById('explorer').getBoundingClientRect().height),
    Math.round(document.querySelector('#lenses .ln-grid').getBoundingClientRect().bottom - document.getElementById('lenses').getBoundingClientRect().top)]));
  out('rows: names, accounts, cards, fills', await p.evaluate(() => [
    document.querySelectorAll('.nm-row').length, document.querySelectorAll('.org-row').length,
    document.querySelectorAll('.ex-card').length, document.querySelectorAll('#lenses .fam').length]));
  out('draft mark present', await p.evaluate(() => document.querySelectorAll('.draft').length));
  out('map image loaded (naturalWidth)', await p.evaluate(() => [...document.querySelectorAll('img')].map(i => i.naturalWidth)));
  await p.locator('#explorer .area[data-area="plains"]').click({ force: true });
  out('click Plains lights card', await p.evaluate(() => document.querySelector('.ex-card[data-area="plains"]').classList.contains('is-on')));
  await p.screenshot({ path: 'prod_top.png' });
  await p.locator('#explorer').screenshot({ path: 'prod_explorer.png' });

  const q = await (await b.newContext({ viewport: { width: 375, height: 800 } })).newPage();
  await q.goto(PAGE + '?v=' + Date.now(), { waitUntil: 'networkidle' });
  out('375 scrollWidth', await q.evaluate(() => document.documentElement.scrollWidth));

  const c = await ctx.newPage();
  await c.goto(HOST + '/collections/?v=' + Date.now(), { waitUntil: 'networkidle' });
  out('collections card links here', await c.evaluate(() => !!document.querySelector('a.coll-card[href="./nations-before-the-map/"]')));
  for (const path of ['/docs/specs/names.seed.json', '/docs/build/build_page.py', '/CHANGELOG.md', '/DECISIONS.md']) {
    const r = await ctx.request.get(HOST + path);
    out('private ' + path, r.status());
  }
  const f = await ctx.request.get(PAGE + 'img/sturtevant-1967.webp');
  out('webp status / cache-control', [f.status(), f.headers()['cache-control']]);
  out('page errors', errs.length ? errs : 'none');
  out('off-site requests', offsite.length ? offsite : 'none');
  out('responses >= 400', fails.length ? fails : 'none');
  await b.close();
})();
