const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,1100']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    window.openChapter('ch01');
    window.switchView('view-simulator');
  });
  await new Promise(r => setTimeout(r, 600));

  // Scroll to inspector card so it's fully in view
  await page.evaluate(() => {
    const card = document.querySelector('.sim-calc-inspector-card');
    if (card) {
      card.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 300));

  const cardEl = await page.$('.sim-calc-inspector-card');
  if (cardEl) {
    const outPath = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\calc_inspector\\08_card_horizontal_closeup.png';
    await cardEl.screenshot({ path: outPath });
    console.log('Saved card closeup screenshot to: ' + outPath);
  }

  const fullpagePath = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\calc_inspector\\09_viewport_with_card.png';
  await page.screenshot({ path: fullpagePath });
  console.log('Saved viewport screenshot to: ' + fullpagePath);

  await browser.close();
})();
