// Render checks for /collections/nations-before-the-map/ (Batch 21).
const { chromium } = require('playwright');
const EXE = process.env.LOCALAPPDATA + '/ms-playwright/chromium-1248/chrome-win64/chrome.exe';
const URL = 'http://127.0.0.1:8790/collections/nations-before-the-map/?v=' + Date.now();
const scheme = process.argv[2] || 'light';

(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme });
  const p = await ctx.newPage();
  const errs = [], offsite = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push(String(e)));
  p.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:8790')) offsite.push(r.url()); });
  await p.goto(URL, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const h = id => Math.round(document.getElementById(id).getBoundingClientRect().height);
    const nav = Math.round(document.getElementById('nav').getBoundingClientRect().height);
    return { nav, explorer: h('explorer'), lenses: h('lenses'), names: h('names'), origins: h('origins'),
             lensesFitPart: Math.round(document.querySelector('#lenses .ln-grid').getBoundingClientRect().bottom - document.getElementById('lenses').getBoundingClientRect().top),
             scrollW: document.documentElement.scrollWidth };
  });
  console.log(scheme, JSON.stringify(m));
  for (const id of ['explorer', 'lenses', 'names', 'origins']) {
    await p.locator('#' + id).screenshot({ path: `w_${id}_${scheme}.png` });
  }
  await p.screenshot({ path: `top_${scheme}.png` });
  const ph = await b.newContext({ viewport: { width: 375, height: 800 }, colorScheme: scheme, deviceScaleFactor: 1 });
  const q = await ph.newPage();
  await q.goto(URL, { waitUntil: 'networkidle' });
  console.log('375 scrollWidth', await q.evaluate(() => document.documentElement.scrollWidth));
  await q.locator('#explorer').screenshot({ path: `p_explorer_${scheme}.png` });
  await q.locator('#names').screenshot({ path: `p_names_${scheme}.png` });
  console.log('errors', errs.length ? errs : 'none');
  console.log('offsite requests', offsite.length ? offsite : 'none');
  await b.close();
})();
