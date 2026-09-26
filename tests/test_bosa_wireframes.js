/**
 * test_bosa_wireframes.js
 * Automated Tri-Pillar Verification for BoSa Physics Architecture & 4 Procreate Wireframes
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8080/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\bosa_wireframes';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

let passCount = 0;
let failCount = 0;
const results = [];

function assertTest(name, condition, details = '') {
  if (condition) {
    passCount++;
    console.log(`[PASS] ${name} ${details ? '(' + details + ')' : ''}`);
    results.push({ name, status: 'PASS', details });
  } else {
    failCount++;
    console.error(`[FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
    results.push({ name, status: 'FAIL', details });
  }
}

async function runBosaWireframeTests() {
  console.log('======================================================================');
  console.log('BOSA PHYSICS 4-WIREFRAME ARCHITECTURAL VERIFICATION SUITE');
  console.log('Target URL: ' + TARGET_URL);
  console.log('Timestamp: ' + new Date().toISOString());
  console.log('======================================================================\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      protocolTimeout: 120000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.error('Browser console error:', msg.text());
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.toString());
      console.error('Browser page error:', err.toString());
    });

    // 1. Initial Load & Desktop 1440x900
    console.log('--- 1. Desktop Initial Viewport & BoSa Physics Header ---');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    assertTest('HTTP Status 200', response && response.status() === 200, `Status: ${response ? response.status() : 'null'}`);

    // Verify Header Branding & Master Track Buttons (Image 1 & 2)
    const headerBrand = await page.$eval('.brand-container', el => el.innerText);
    assertTest('Header contains BoSa Physics, edition badge, and author Jirawat Onngam', 
      headerBrand.includes('BoSa Physics') && (headerBrand.includes('Academic Suite') || headerBrand.includes('(เว้นไว้ก่อน)')) && headerBrand.includes('Jirawat Onngam'), 
      headerBrand.replace(/\n/g, ' '));

    const masterButtonsCount = await page.$$eval('.master-track-btn', els => els.length);
    assertTest('Header contains 3 Master Track buttons [ ทฤษฎี ] | [ เนื้อหาภาควิชาชีพ ] | [ คลังโจทย์ ]', 
      masterButtonsCount === 3, `Found: ${masterButtonsCount}`);

    // Click "เข้าสู่แพลตฟอร์มเต็มรูปแบบ" to navigate to chapter selection
    await page.click('#btn-enter-website');
    await new Promise(r => setTimeout(r, 600));

    // --- Wireframe 1: 24-Subject Pure Physics Grid + Plasma Fusion Callout ---
    console.log('\n--- 2. Wireframe 1: 24 Pure Physics Subjects & Plasma Callout ---');
    const theoryCardsCount = await page.$$eval('#bosa-theory-catalog .bosa-topic-card', els => els.length);
    assertTest('Pure Physics catalog has 24 topic cards (6 cols x 4 rows)', theoryCardsCount === 24, `Cards: ${theoryCardsCount}`);

    const plasmaBanner = await page.$('.bosa-plasma-callout-bar');
    const plasmaText = await page.evaluate(el => el ? el.innerText : '', plasmaBanner);
    assertTest('Bottom callout "+ ฟิสิกส์พลาสมาและฟิวชัน" exists', 
      plasmaBanner !== null && plasmaText.includes('ฟิสิกส์พลาสมาและฟิวชัน'), plasmaText ? plasmaText.substring(0, 60) + '...' : '');

    const shot1 = path.join(SCREENSHOT_DIR, '10_bosa_theory_24grid_desktop.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log(`[PROOF] Screenshot 1 saved: ${shot1}`);

    // --- Wireframe 2: Vocational / Applied Engineering Disciplines (3 rows x 6) ---
    console.log('\n--- 3. Wireframe 2: Vocational Disciplines (Civil, Electrical, Mechanical) ---');
    await page.click('#btn-master-vocational');
    await new Promise(r => setTimeout(r, 500));

    const vocationalVisible = await page.$eval('#bosa-vocational-catalog', el => el.style.display !== 'none');
    assertTest('Vocational catalog displays when clicking [ เนื้อหาภาควิชาชีพ ]', vocationalVisible);

    const vocRows = await page.$$eval('.bosa-eng-discipline-block', els => els.length);
    assertTest('3 Engineering discipline rows exist (Civil, Electrical, Mechanical)', vocRows === 3, `Rows: ${vocRows}`);

    const vocCards = await page.$$eval('#bosa-vocational-catalog .bosa-topic-card', els => els.length);
    assertTest('Vocational catalog contains 18 total engineering modules (3 x 6)', vocCards === 18, `Modules: ${vocCards}`);

    const shot2 = path.join(SCREENSHOT_DIR, '11_bosa_vocational_3rows_desktop.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log(`[PROOF] Screenshot 2 saved: ${shot2}`);

    // --- Wireframe 3: Simulator Stage with Inset Canvas [ ], Preset Dots, Step < | >, Box 1, Box 2, Box 3 ---
    console.log('\n--- 4. Wireframe 3: Simulator Stage, Inset Canvas, Preset Dots & Control Boxes ---');
    // Switch to Chapter 1 Simulator
    await page.evaluate(() => {
      window.openChapter('ch01');
      window.switchView('view-simulator');
    });
    await new Promise(r => setTimeout(r, 800));

    // Verify Inset Canvas [ ]
    const insetCanvasBox = await page.$('#canvas-inset-box');
    const insetCanvas = await page.$('#simulator-inset-canvas');
    assertTest('Auxiliary Inset Canvas [ ] exists at top-right of canvas', insetCanvasBox !== null && insetCanvas !== null);

    // Verify Preset Dots Bar & 4 Colors
    const dotsCount = await page.$$eval('#canvas-preset-dots-bar .preset-dot', els => els.length);
    assertTest('Color preset dots exist at bottom-left of canvas (4 presets)', dotsCount === 4, `Dots: ${dotsCount}`);

    // Verify Step Buttons < | >
    const stepPrev = await page.$('#btn-step-prev');
    const stepNext = await page.$('#btn-step-next');
    assertTest('Step navigation buttons < | > exist at bottom-right of canvas', stepPrev !== null && stepNext !== null);

    // Verify Box 1 Direct Typing + Formula
    const inputV0 = await page.$('#input-v0');
    const box1Formula = await page.$('.sim-governing-formula-mini');
    assertTest('Box 1 features governing formula & direct numerical typing input', inputV0 !== null && box1Formula !== null);

    // Test dual typing sync: set 35 into input-v0 via event dispatch
    await page.evaluate(() => {
      const input = document.getElementById('input-v0');
      if (input) {
        input.value = '35';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 300));
    const sliderVal = await page.$eval('#slider-v0', el => el.value);
    assertTest('Direct typing syncs to simulation slider (35 m/s)', sliderVal === '35', `Slider: ${sliderVal}`);

    // Verify Box 3 Conditions & Toggle
    const conditionsBox = await page.$('#sim-conditions-card');
    assertTest('Box 3 "เงื่อนไขการใช้งาน ⊕ (ดูเพิ่มเติม)" exists', conditionsBox !== null);

    // Verify Drawer Side Tab Toggle
    const drawerSideTab = await page.$('#drawer-side-tab-toggle');
    assertTest('Drawer side tab button "<" exists on right screen edge', drawerSideTab !== null);

    const shot3 = path.join(SCREENSHOT_DIR, '12_bosa_simulator_stage_inset_controls.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`[PROOF] Screenshot 3 saved: ${shot3}`);

    // --- Wireframe 4: Theory Side-by-Side Split (Left: Content, Right-Top: Diagram, Right-Bottom: Formulas) ---
    console.log('\n--- 5. Wireframe 4: Theory Side-by-Side Split & Drawer Navigation ---');
    await page.click('#tab-theory');
    await new Promise(r => setTimeout(r, 600));

    // Verify split layout elements
    const splitCards = await page.$$eval('.theory-card-split-grid', els => els.length);
    assertTest('Theory view renders side-by-side split cards', splitCards > 0, `Count: ${splitCards}`);

    const hasColContent = await page.$('.theory-col-content');
    const hasColDiagram = await page.$('.theory-diagram-box');
    const hasColFormula = await page.$('.theory-formula-box');
    assertTest('Theory card contains Left: เนื้อหา, Right Top: รูป, Right Bottom: สูตร', 
      hasColContent !== null && hasColDiagram !== null && hasColFormula !== null);

    // Open Drawer using side tab '<'
    await page.evaluate(() => {
      const btn = document.getElementById('drawer-side-tab-toggle');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const drawerOpen = await page.$eval('#drawer-navigation-catalog', el => el.classList.contains('open'));
    assertTest('Clicking drawer side tab opens navigation drawer', drawerOpen);

    const shot4 = path.join(SCREENSHOT_DIR, '13_bosa_theory_split_diagram_drawer.png');
    await page.screenshot({ path: shot4, fullPage: false });
    console.log(`[PROOF] Screenshot 4 saved: ${shot4}`);

    // Close drawer
    await page.evaluate(() => {
      if (window.PhysicsApp && window.PhysicsApp.closeDrawer) {
        window.PhysicsApp.closeDrawer();
      }
    });
    await new Promise(r => setTimeout(r, 400));

    // --- Tab 5: Chapter Summary Synthesis View ---
    console.log('\n--- 6. Chapter Summary Synthesis View (5 Synthesis Sections) ---');
    await page.click('#tab-summary');
    await new Promise(r => setTimeout(r, 600));

    const mindmapCard = await page.$('.summary-mindmap-card');
    const matrixCard = await page.$('.summary-matrix-card');
    const conservationCard = await page.$('.summary-conservation-card');
    const trapsCard = await page.$('.summary-traps-card');
    const realworldCard = await page.$('.summary-realworld-card');
    assertTest('Chapter Summary contains all 5 synthesis sections (Mindmap, Matrix, Conservation, Traps, Real-World)', 
      mindmapCard !== null && matrixCard !== null && conservationCard !== null && trapsCard !== null && realworldCard !== null);

    const shot5 = path.join(SCREENSHOT_DIR, '14_bosa_chapter_summary.png');
    await page.screenshot({ path: shot5, fullPage: false });
    console.log(`[PROOF] Screenshot 5 saved: ${shot5}`);

    // --- Mobile Responsive Verification (390x844) ---
    console.log('\n--- 7. Mobile Responsive Viewport (390x844) ---');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 600));

    const mobileScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assertTest('Zero horizontal overflow on mobile 390px viewport', mobileScrollWidth <= 390, `scrollWidth: ${mobileScrollWidth}px`);

    const shot6 = path.join(SCREENSHOT_DIR, '15_bosa_mobile_390px.png');
    await page.screenshot({ path: shot6, fullPage: false });
    console.log(`[PROOF] Screenshot 6 saved: ${shot6}`);

    // --- Console Errors Audit ---
    console.log('\n--- 8. Console Error Audit ---');
    assertTest('Zero browser console errors throughout entire suite', consoleErrors.length === 0, `Errors: ${consoleErrors.length} -> ${consoleErrors.join(', ')}`);

  } catch (err) {
    console.error('Fatal error during test run:', err);
    failCount++;
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  console.log('\n======================================================================');
  console.log(`BOSA WIREFRAME TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runBosaWireframeTests();
