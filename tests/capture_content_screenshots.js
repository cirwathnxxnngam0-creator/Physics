/**
 * capture_content_screenshots.js
 * Captures full-page screenshots of both Theory (view-theory) and Formulas (view-formulas)
 * across 360, 390, 768, 1024, and 1440 px CSS viewports for submission evidence.
 */

const path = require('path');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8080/';
const EVIDENCE_DIR = path.resolve(__dirname, '../../gpt/evidence/content_rebuild_001');

const viewports = [360, 390, 768, 1024, 1440];

(async () => {
  console.log('Launching Puppeteer for Full-Page Screenshot Evidence Capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

  // Wait for KaTeX to finish rendering
  await new Promise(r => setTimeout(r, 800));

  for (const vp of viewports) {
    console.log(`Capturing viewports at ${vp}px...`);
    await page.setViewport({ width: vp, height: 900, deviceScaleFactor: 1 });

    // 1. Capture View-Theory
    await page.evaluate(() => {
      window.PhysicsApp.switchView('view-theory');
    });
    await new Promise(r => setTimeout(r, 400));
    const theoryPath = path.join(EVIDENCE_DIR, `theory_${vp}px_fullpage.png`);
    await page.screenshot({ path: theoryPath, fullPage: true });
    console.log(`Saved: theory_${vp}px_fullpage.png`);

    // 2. Capture View-Formulas
    await page.evaluate(() => {
      window.PhysicsApp.switchView('view-formulas');
    });
    await new Promise(r => setTimeout(r, 400));
    const formulaPath = path.join(EVIDENCE_DIR, `formulas_${vp}px_fullpage.png`);
    await page.screenshot({ path: formulaPath, fullPage: true });
    console.log(`Saved: formulas_${vp}px_fullpage.png`);
  }

  // Also capture Simulator View at 1440px
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.evaluate(() => {
    window.PhysicsApp.switchView('view-simulator');
  });
  await new Promise(r => setTimeout(r, 400));
  const simPath = path.join(EVIDENCE_DIR, `simulator_1440px.png`);
  await page.screenshot({ path: simPath, fullPage: false });
  console.log(`Saved: simulator_1440px.png`);

  await browser.close();
  console.log('All full-page evidence screenshots captured successfully!');
})();
