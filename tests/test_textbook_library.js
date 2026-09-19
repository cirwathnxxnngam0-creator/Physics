const path = require('path');
const fs = require('fs');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8080/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\fix_verification';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('================================================================');
  console.log('STARTING TRI-PILLAR VERIFICATION: TEXTBOOK LIBRARY & PDF VIEWER');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('[Console Error] ' + msg.text());
    }
  });
  page.on('pageerror', err => errors.push('[Page Error] ' + err.message));

  // 1. Desktop Viewport Test
  console.log('\n--- 1. Testing Desktop Viewport (1440x900) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Switch to theory first, then click Textbook tab
  await page.evaluate(() => {
    window.switchView('view-theory');
  });
  await new Promise(r => setTimeout(r, 400));

  // Click #tab-textbooks
  const tabExists = await page.$('#tab-textbooks');
  console.log('Textbook Nav Tab Present:', !!tabExists);

  await page.click('#tab-textbooks');
  await new Promise(r => setTimeout(r, 600));

  // Verify view-textbooks is active
  const isViewActive = await page.evaluate(() => {
    const view = document.getElementById('view-textbooks');
    const tab = document.getElementById('tab-textbooks');
    return {
      viewActive: view ? view.classList.contains('active') : false,
      tabActive: tab ? tab.classList.contains('active') : false,
      tierBarDisplay: document.getElementById('app-tier-bar')?.style.display
    };
  });
  console.log('View & Tab Active Status:', JSON.stringify(isViewActive));

  // Check catalog counts
  const catalogStats = await page.evaluate(() => {
    const masterCards = document.querySelectorAll('.master-textbook-card');
    const moduleCards = document.querySelectorAll('.module-card');
    const chips = document.querySelectorAll('.tb-chip');
    return {
      masterCount: masterCards.length,
      moduleCount: moduleCards.length,
      chipsCount: chips.length
    };
  });
  console.log('Rendered Catalog Stats:', JSON.stringify(catalogStats));

  // Capture Screenshot 1: Desktop Library Overview
  const p1 = path.join(SCREENSHOT_DIR, '15_desktop_textbook_library_overview_1440px.png');
  await page.screenshot({ path: p1, fullPage: false });
  console.log('Saved screenshot:', p1);

  // 2. Test Category Filtering
  console.log('\n--- 2. Testing Category Filter & Search ---');
  await page.click('.tb-chip[data-cat=mechanics]');
  await new Promise(r => setTimeout(r, 300));
  const mechanicsStats = await page.evaluate(() => {
    return {
      masterCount: document.querySelectorAll('.master-textbook-card').length,
      moduleCount: document.querySelectorAll('.module-card').length
    };
  });
  console.log('Mechanics Category Stats:', JSON.stringify(mechanicsStats));

  // Search filter
  await page.type('#textbook-search-input', 'Morin');
  await new Promise(r => setTimeout(r, 400));
  const searchStats = await page.evaluate(() => {
    const moduleTitles = Array.from(document.querySelectorAll('.module-card .module-title')).map(el => el.textContent);
    return {
      visibleModules: moduleTitles.length,
      sampleTitles: moduleTitles.slice(0, 3)
    };
  });
  console.log('Search Results for Morin:', JSON.stringify(searchStats));

  // Clear search
  await page.click('#btn-clear-textbook-search');
  await new Promise(r => setTimeout(r, 300));
  await page.click('.tb-chip[data-cat=all]');
  await new Promise(r => setTimeout(r, 300));

  // 3. Test In-App PDF Reader Modal
  console.log('\n--- 3. Testing In-App PDF Reader Modal ---');
  const openResult = await page.evaluate(() => {
    const firstModuleBtn = document.querySelector('.btn-module-open');
    if (!firstModuleBtn) return { error: 'No module open button found' };
    const title = firstModuleBtn.dataset.title;
    const url = firstModuleBtn.dataset.url;
    firstModuleBtn.click();
    return { clicked: true, title, url };
  });
  console.log('Module Clicked:', JSON.stringify(openResult));
  await new Promise(r => setTimeout(r, 600));

  const modalState = await page.evaluate(async () => {
    const modal = document.getElementById('textbook-reader-modal');
    const frame = document.getElementById('textbook-pdf-frame');
    const titleEl = document.getElementById('tb-reader-title');
    const metaEl = document.getElementById('tb-reader-meta');
    const newTab = document.getElementById('tb-reader-newtab');

    let pdfHttpStatus = null;
    let pdfContentType = null;
    if (frame && frame.src) {
      try {
        const res = await fetch(frame.src);
        pdfHttpStatus = res.status;
        pdfContentType = res.headers.get('content-type');
      } catch (e) {
        pdfHttpStatus = e.message;
      }
    }

    return {
      display: modal ? modal.style.display : null,
      frameSrc: frame ? frame.src : null,
      titleText: titleEl ? titleEl.textContent : null,
      metaText: metaEl ? metaEl.textContent : null,
      newTabHref: newTab ? newTab.href : null,
      pdfHttpStatus,
      pdfContentType
    };
  });
  console.log('PDF Modal State:', JSON.stringify(modalState));

  // Capture Screenshot 2: Desktop PDF Reader Modal
  const p2 = path.join(SCREENSHOT_DIR, '16_desktop_textbook_pdf_reader_modal_1440px.png');
  await page.screenshot({ path: p2, fullPage: false });
  console.log('Saved screenshot:', p2);

  // Close modal via close button
  await page.click('#tb-reader-close');
  await new Promise(r => setTimeout(r, 300));

  const isClosed = await page.evaluate(() => {
    const modal = document.getElementById('textbook-reader-modal');
    return modal ? modal.style.display === 'none' : true;
  });
  console.log('Modal Closed Successfully:', isClosed);

  // 4. Mobile Viewport Test (390x844)
  console.log('\n--- 4. Testing Mobile Viewport (390x844) ---');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 500));

  // Capture Screenshot 3: Mobile Library Overview
  const p3 = path.join(SCREENSHOT_DIR, '17_mobile_textbook_library_overview_390px.png');
  await page.screenshot({ path: p3, fullPage: false });
  console.log('Saved screenshot:', p3);

  // Open modal on mobile
  await page.evaluate(() => {
    const firstBtn = document.querySelector('.btn-module-open');
    if (firstBtn) firstBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Capture Screenshot 4: Mobile PDF Reader Modal
  const p4 = path.join(SCREENSHOT_DIR, '18_mobile_textbook_pdf_reader_modal_390px.png');
  await page.screenshot({ path: p4, fullPage: false });
  console.log('Saved screenshot:', p4);

  // Close modal with Esc key
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 300));

  // 5. Test Integration from Chapter Select & Drawer
  console.log('\n--- 5. Testing Chapter Select & Drawer Gateways ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    window.switchView('view-chapter-select');
  });
  await new Promise(r => setTimeout(r, 400));

  const selectBtnExists = await page.$('#btn-open-textbook-library-from-select');
  console.log('Chapter Select Textbook Gateway Button Present:', !!selectBtnExists);

  if (selectBtnExists) {
    await page.click('#btn-open-textbook-library-from-select');
    await new Promise(r => setTimeout(r, 400));
    const isNowTextbooks = await page.evaluate(() => document.getElementById('view-textbooks')?.classList.contains('active'));
    console.log('Successfully navigated to textbooks from chapter select:', isNowTextbooks);
  }

  // Drawer test
  await page.evaluate(() => {
    window.PhysicsApp.openDrawer();
  });
  await new Promise(r => setTimeout(r, 400));
  const drawerTextbookLink = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.drawer-theory-link'));
    return links.some(l => l.getAttribute('href') === '#view-textbooks');
  });
  console.log('Drawer has #view-textbooks link:', drawerTextbookLink);
  await page.evaluate(() => {
    window.PhysicsApp.closeDrawer();
  });

  // Final check on console errors
  console.log('\n================================================================');
  console.log('TOTAL CONSOLE ERRORS: ' + errors.length);
  if (errors.length > 0) {
    errors.forEach(e => console.error('  ->', e));
  } else {
    console.log('>> ALL CONSOLE AND RUNTIME CHECKS PASSED WITH ZERO ERRORS (0)! <<');
  }
  console.log('================================================================');

  await browser.close();
  process.exit(errors.length === 0 ? 0 : 1);
})();
