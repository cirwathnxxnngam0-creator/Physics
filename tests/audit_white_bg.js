const puppeteer = require('../node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots', 'live_verification');
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('Navigating to http://127.0.0.1:8089/ ...');
  await page.goto('http://127.0.0.1:8089/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // --- 1. AUDIT IMAGE 1: THEORY TRACK (24 SUBJECTS FRAMED) ---
  console.log('Verifying Image 1 (Theory Track framed on whiter background)...');
  await page.evaluate(() => {
    document.getElementById('btn-master-theory').click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'white_bg_01_theory_framed.png') });

  // --- 2. AUDIT IMAGE 2: VOCATIONAL TRACK (FRAMED) ---
  console.log('Verifying Image 2 (Vocational Track framed)...');
  await page.evaluate(() => {
    document.getElementById('btn-master-vocational').click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'white_bg_02_vocational_top.png') });

  // Scroll to bottom of vocational
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'white_bg_03_vocational_bottom.png') });

  // --- 3. AUDIT TAB 5: CHAPTER SUMMARY ---
  console.log('Verifying Tab 5 (Chapter Summary)...');
  await page.evaluate(() => {
    window.openChapter('ch01');
    window.switchView('view-summary');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'white_bg_04_summary_top.png') });

  await page.evaluate(() => {
    window.scrollTo(0, 750);
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'white_bg_05_summary_middle.png') });

  // --- 4. AUDIT MOBILE VIEWPORT ---
  console.log('Verifying Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    window.switchView('view-chapter-select');
    document.getElementById('btn-master-theory').click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'white_bg_06_mobile.png') });

  console.log('\nTotal Console Errors:', consoleErrors.length, consoleErrors);

  await browser.close();
  console.log('Verification with whiter background complete!');
})();
