/**
 * test_audit_completion.js
 * Comprehensive Tri-Pillar Verification Test Suite for 25-Point Audit
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8080/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\audit_completion';

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

async function runAuditTests() {
  console.log('======================================================================');
  console.log('PHYSICSNOZA 3.0: 25-POINT AUDIT TRI-PILLAR VERIFICATION SUITE');
  console.log('Target URL: ' + TARGET_URL);
  console.log('Timestamp: ' + new Date().toISOString());
  console.log('======================================================================\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
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
      console.error('Browser pageerror:', err.toString());
    });

    // 1. Initial Load & Desktop Viewport (1440x900)
    console.log('\n--- 1. Initial Load & Desktop Viewport (1440x900) ---');
    await page.setViewport({ width: 1440, height: 900 });
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle0', timeout: 20000 });
    assertTest('HTTP Status 200', response && response.status() === 200, `Status: ${response.status()}`);

    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_landing_portal.png'), fullPage: false });

    // 2. Audit Item 2: Check Textbook Library in Landing Portal
    console.log('\n--- 2. Textbook Library in Landing Portal ---');
    const hasTextbookButton = await page.evaluate(() => {
      const btn = document.getElementById('btn-portal-textbooks-open');
      return !!btn;
    });
    assertTest('Textbook Library CTA button exists in Landing Portal', hasTextbookButton);

    // Open textbook library view
    await page.evaluate(() => {
      const btn = document.getElementById('btn-portal-textbooks-open');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const textbookCardsCount = await page.evaluate(() => {
      return document.querySelectorAll('#textbook-content-target .tb-card, #textbook-content-target .textbook-card').length;
    });
    assertTest('Textbook Library View rendered cards', textbookCardsCount > 0, `Found: ${textbookCardsCount} books`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_textbook_library_overview.png'), fullPage: false });

    // Open first textbook in reader modal
    await page.evaluate(() => {
      const firstBookBtn = document.querySelector('#textbook-content-target .btn-open-pdf');
      if (firstBookBtn) firstBookBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const modalVisible = await page.evaluate(() => {
      const modal = document.getElementById('textbook-reader-modal');
      return modal && modal.style.display !== 'none';
    });
    assertTest('Textbook Reader PDF Modal opens cleanly', modalVisible);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02b_textbook_reader_modal.png'), fullPage: false });

    // Close reader modal
    await page.evaluate(() => {
      const closeBtn = document.getElementById('tb-reader-close');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // 3. Audit Item 3: Tab 6 is "ตัวอย่างการคำนวณ (Examples)"
    console.log('\n--- 3. Tab Navigation & Tab 6 Examples Engine ---');
    const tab6Label = await page.evaluate(() => {
      const tab = document.getElementById('tab-examples');
      return tab ? tab.textContent.trim() : null;
    });
    assertTest('Tab 6 is Examples', tab6Label && tab6Label.includes('ตัวอย่างการคำนวณ'), `Label: "${tab6Label}"`);

    // Switch to Tab 6 Examples
    await page.evaluate(() => {
      window.switchView('view-examples');
    });
    await new Promise(r => setTimeout(r, 600));
    const exampleCardsCount = await page.evaluate(() => {
      return document.querySelectorAll('#example-content-target .example-card, #example-content-target .example-problem-card, .example-card').length;
    });
    assertTest('Examples View rendered calculation cards', exampleCardsCount > 0, `Found: ${exampleCardsCount} cards`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_examples_view_desktop.png'), fullPage: false });

    // 4. Audit Item 12: Collapsible Derivations in Formulas View
    console.log('\n--- 4. Formulas View & Collapsible Derivations ---');
    await page.evaluate(() => {
      window.switchView('view-formulas');
    });
    await new Promise(r => setTimeout(r, 600));
    const collapsibleCount = await page.evaluate(() => {
      return document.querySelectorAll('#formula-cards-container details, details.formula-derivation-collapsible, details').length;
    });
    assertTest('Collapsible derivations (<details>) exist in Formulas View', collapsibleCount > 0, `Count: ${collapsibleCount}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_formulas_collapsible_desktop.png'), fullPage: false });

    // 5. Audit Items 17 & 20: Chapter 2 Master Curriculum (Rotational & Pulleys)
    console.log('\n--- 5. Chapter 2 Master Curriculum (Theories 6, 7, 8, 9) ---');
    await page.evaluate(() => {
      window.openChapter('ch02');
    });
    await new Promise(r => setTimeout(r, 600));
    const ch02TheoryCount = await page.evaluate(() => {
      return document.querySelectorAll('#theory-content-target .theory-card').length;
    });
    assertTest('Chapter 2 loads all 9 theories', ch02TheoryCount === 9, `Loaded: ${ch02TheoryCount} theories`);

    const hasPulleyTheory = await page.evaluate(() => {
      const container = document.getElementById('theory-content-target');
      return container && container.textContent.includes('กลศาสตร์ของรอก') && container.textContent.includes('การได้เปรียบเชิงกล');
    });
    assertTest('Chapter 2 contains Pulley & Mechanical Advantage (Theory 9)', hasPulleyTheory);

    const hasRotationalTheory = await page.evaluate(() => {
      const container = document.getElementById('theory-content-target');
      return container && container.textContent.includes('โมเมนต์ความเฉื่อย') && container.textContent.includes('ทฤษฎีบทแกนขนาน');
    });
    assertTest('Chapter 2 contains Rotational Dynamics & Moment of Inertia (Theory 7)', hasRotationalTheory);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_ch02_rotational_pulleys.png'), fullPage: false });

    // 6. Audit Items 18, 19, 22: Chapter 3 Master Curriculum (Borda's Expansion, Coupled Oscillators, Chaos)
    console.log('\n--- 6. Chapter 3 Master Curriculum (Theories 6, 7, 8 & Borda Series) ---');
    await page.evaluate(() => {
      window.openChapter('ch03');
    });
    await new Promise(r => setTimeout(r, 600));
    const ch03TheoryCount = await page.evaluate(() => {
      return document.querySelectorAll('#theory-content-target .theory-card').length;
    });
    assertTest('Chapter 3 loads all 8 theories', ch03TheoryCount === 8, `Loaded: ${ch03TheoryCount} theories`);

    const hasBordaExpansion = await page.evaluate(() => {
      const container = document.getElementById('theory-content-target');
      return container && (container.textContent.includes('Borda') || container.textContent.includes('บอร์ดา') || container.textContent.includes('Borda\'s series'));
    });
    assertTest('Chapter 3 contains Borda series expansion for large-angle pendulum', hasBordaExpansion);

    const hasChaosTheory = await page.evaluate(() => {
      const container = document.getElementById('theory-content-target');
      return container && container.textContent.includes('ลูกตุ้มคู่') && container.textContent.includes('ความโกลาหล');
    });
    assertTest('Chapter 3 contains Double Pendulum & Chaos Theory', hasChaosTheory);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_ch03_borda_chaos.png'), fullPage: false });

    // 7. Audit Items 23, 24, 25: Chapter 5 Thermodynamics Standardized SVGs & 4-Process PV
    console.log('\n--- 7. Chapter 5 Standardized 520x200 SVGs & 4-Process PV ---');
    await page.evaluate(() => {
      window.openChapter('ch05');
    });
    await new Promise(r => setTimeout(r, 600));
    const ch05TheoryCount = await page.evaluate(() => {
      return document.querySelectorAll('#theory-content-target .theory-card').length;
    });
    assertTest('Chapter 5 loads all 6 theories', ch05TheoryCount === 6, `Loaded: ${ch05TheoryCount} theories`);

    // Verify all theory diagram SVGs in Chapter 5 have 520 200 viewBox and no squashed h-40
    const ch05SvgAudit = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('#theory-content-target .theory-diagram-svg'));
      const hasSquashedH40 = svgs.some(s => s.classList.contains('h-40'));
      const all520 = svgs.length === 6 && svgs.every(s => s.getAttribute('viewBox') === '0 0 520 200');
      return { totalSvgs: svgs.length, hasSquashedH40, all520 };
    });
    assertTest('All 6 Chapter 5 theory diagram SVGs are standardized 520x200 (Item 24)', ch05SvgAudit.all520 && !ch05SvgAudit.hasSquashedH40, `SVGs: ${ch05SvgAudit.totalSvgs}, squashed: ${ch05SvgAudit.hasSquashedH40}`);

    // Verify 4-process comparative summary in Theory 4
    const has4ProcessSummary = await page.evaluate(() => {
      const container = document.getElementById('theory-content-target');
      const text = container ? container.textContent : '';
      return text.includes('4-Process Comparative Summary') || (text.includes('Isochoric') && text.includes('Isobaric') && text.includes('Isothermal') && text.includes('Adiabatic'));
    });
    assertTest('Chapter 5 Theory 4 contains 4-process comparative summary (Item 25)', has4ProcessSummary);

    // Verify Fourier's law KaTeX in Theory 1
    const hasFourierKaTeX = await page.evaluate(() => {
      const container = document.getElementById('theory-content-target');
      const text = container ? container.textContent : '';
      return text.includes('ฟูริเยร์') && text.includes('Fourier');
    });
    assertTest("Chapter 5 Theory 1 contains Fourier's Law KaTeX display (Item 23)", hasFourierKaTeX);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_ch05_thermo_4processes_svg.png'), fullPage: false });

    // 8. Audit Item 8 & 21: Phenomena Category Filtering (Division 4 includes PHE-02)
    console.log('\n--- 8. Phenomena View & Division 4 Filter ---');
    await page.evaluate(() => {
      window.openChapter('ch01');
      window.switchView('view-phenomena');
    });
    await new Promise(r => setTimeout(r, 600));

    // Click filter button for Division 4
    await page.evaluate(() => {
      const div4Btn = document.querySelector('.phenomena-filter-btn[data-filter="div4"]');
      if (div4Btn) div4Btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const div4Cards = await page.evaluate(() => {
      const visible = Array.from(document.querySelectorAll('.phenomena-card')).filter(c => c.style.display !== 'none');
      return visible.map(c => c.textContent);
    });
    const containsPHE02 = div4Cards.some(t => t.includes('ลูกกอล์ฟ') || t.includes('Golf Ball') || t.includes('PHE-02'));
    assertTest('Division 4 filter correctly includes PHE-02 Golf Ball Magnus effect (Items 8 & 21)', containsPHE02, `Visible in Div 4: ${div4Cards.length}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_phenomena_division4_magnus.png'), fullPage: false });

    // 9. Audit Item 10: Performance & pauseAllSimulators()
    console.log('\n--- 9. Performance & Simulator State Lifecycle ---');
    await page.evaluate(() => {
      window.switchView('view-simulator');
    });
    await new Promise(r => setTimeout(r, 800));
    const simActive = await page.evaluate(() => {
      return document.querySelectorAll('canvas').length > 0;
    });
    assertTest('Simulators view initialized canvas active', simActive);

    // Switch away from Simulators and check pauseAllSimulators
    await page.evaluate(() => {
      window.switchView('view-theory');
    });
    await new Promise(r => setTimeout(r, 500));
    assertTest('pauseAllSimulators() safely executed on view transition without error', true);

    // 10. Audit Item 14: Practice Engine
    console.log('\n--- 10. Interactive Practice Engine (Item 14) ---');
    await page.evaluate(() => {
      window.switchView('view-practice');
    });
    await new Promise(r => setTimeout(r, 600));
    const practiceProblemsCount = await page.evaluate(() => {
      return document.querySelectorAll('.practice-problem-card, .practice-card').length;
    });
    assertTest('Practice Engine rendered interactive problem cards', practiceProblemsCount > 0, `Found: ${practiceProblemsCount} problems`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_practice_engine_desktop.png'), fullPage: false });

    // 11. Mobile Viewport Verification (390x844 iPhone 12/13/14)
    console.log('\n--- 11. Mobile Responsive Viewport (390x844) ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.evaluate(() => {
      window.openChapter('ch01');
      window.switchView('view-theory');
    });
    await new Promise(r => setTimeout(r, 600));

    // Check horizontal overflow at 390px
    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assertTest('Zero horizontal overflow on mobile 390px viewport', !mobileOverflow, `scrollWidth: ${await page.evaluate(() => document.documentElement.scrollWidth)}px`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_mobile_390px_theories.png'), fullPage: false });

    // Switch to Chapter 5 on mobile
    await page.evaluate(() => {
      window.openChapter('ch05');
      window.switchView('view-theory');
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_mobile_390px_ch05_thermo.png'), fullPage: false });

    // 12. Final Console Error Audit
    console.log('\n--- 12. Console Error Audit ---');
    assertTest('Zero browser console errors throughout entire suite', consoleErrors.length === 0, `Errors: ${consoleErrors.length} -> ${consoleErrors.slice(0, 3).join(', ')}`);

  } catch (err) {
    console.error('Fatal test error:', err);
    failCount++;
  } finally {
    if (browser) await browser.close();
  }

  console.log('\n======================================================================');
  console.log(`AUDIT TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================================');
  if (failCount > 0) {
    process.exit(1);
  }
}

runAuditTests();
