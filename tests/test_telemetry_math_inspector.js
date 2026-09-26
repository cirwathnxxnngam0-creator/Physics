/**
 * test_telemetry_math_inspector.js
 * Automated Tri-Pillar Verification for Live Telemetry Mathematical Calculation & Numerical Substitution Inspector
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8080/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\calc_inspector';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

let passed = 0;
let failed = 0;

function assertTest(name, condition, extraInfo = '') {
  if (condition) {
    console.log(`[PASS] ${name} ${extraInfo ? '(' + extraInfo + ')' : ''}`);
    passed++;
  } else {
    console.error(`[FAIL] ${name} ${extraInfo ? '(' + extraInfo + ')' : ''}`);
    failed++;
  }
}

(async () => {
  console.log('======================================================================');
  console.log('LIVE TELEMETRY MATH INSPECTOR VERIFICATION SUITE');
  console.log('Target URL: ' + TARGET_URL);
  console.log('Timestamp: ' + new Date().toISOString());
  console.log('======================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  try {
    // 1. Initial Load & Desktop Viewport
    console.log('--- 1. Initial Load & Desktop Viewport (1440x900) ---');
    await page.setViewport({ width: 1440, height: 900 });
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle0', timeout: 20000 });
    assertTest('HTTP Status 200', response && response.status() === 200, `Status: ${response.status()}`);
    await new Promise(r => setTimeout(r, 600));

    // Open Chapter 01 Simulators
    await page.evaluate(() => {
      window.openChapter('ch01');
      window.switchView('view-simulator');
    });
    await new Promise(r => setTimeout(r, 800));

    // 2. Verify Inspector Presence & Interactive Badges
    console.log('\n--- 2. Telemetry Inspector Elements & Interactive Badges ---');
    const hasInspector = await page.evaluate(() => {
      const card = document.querySelector('.sim-calc-inspector-card');
      const badges = document.querySelectorAll('.telem-fx-badge');
      return { hasCard: !!card, badgeCount: badges.length };
    });
    assertTest('Calculation Inspector Card rendered in DOM', hasInspector.hasCard);
    assertTest('Telemetry boxes have interactive fx badges', hasInspector.badgeCount > 0, `Count: ${hasInspector.badgeCount}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_projectile_inspector_default.png'), fullPage: false });

    // 3. Verify Default Active Variable Content (Vacuum Range)
    console.log('\n--- 3. Verify 4-Step Mathematical Structure (From Formula -> Substituted Numbers -> Result) ---');
    const defaultContent = await page.evaluate(() => {
      const card = document.querySelector('.sim-calc-inspector-card');
      if (!card) return null;
      const title = card.querySelector('.var-title-th') ? card.querySelector('.var-title-th').textContent : '';
      const formulaBox = card.querySelector('.formula-governing-box');
      const paramsBox = card.querySelector('.params-live-box');
      const stepsBox = card.querySelector('.substitution-steps-box');
      const resultBox = card.querySelector('.result-summary-box');
      const outputVal = card.querySelector('.output-value-badge') ? card.querySelector('.output-value-badge').textContent : '';
      const katexCount = card.querySelectorAll('.katex').length;

      return {
        title,
        hasFormula: !!formulaBox,
        hasParams: !!paramsBox,
        hasSteps: !!stepsBox,
        hasResult: !!resultBox,
        outputVal,
        katexCount
      };
    });

    assertTest('Inspector displays Vacuum Range by default', defaultContent && defaultContent.title.includes('ระยะตก'));
    assertTest('Inspector has Section 1 (Governing Formula)', defaultContent && defaultContent.hasFormula);
    assertTest('Inspector has Section 2 (Live Parameters Chips)', defaultContent && defaultContent.hasParams);
    assertTest('Inspector has Section 3 (Step-by-Step Substitution)', defaultContent && defaultContent.hasSteps);
    assertTest('Inspector has Section 4 (Computed Output)', defaultContent && defaultContent.hasResult);
    assertTest('Formulas and steps are rendered using KaTeX', defaultContent && defaultContent.katexCount > 0, `KaTeX elements: ${defaultContent ? defaultContent.katexCount : 0}`);

    // 4. Click Selection: Select Kinetic Energy ($E_k$)
    console.log('\n--- 4. Interactive Click: Select Kinetic Energy (Ek) ---');
    await page.evaluate(() => {
      const ekBox = document.getElementById('telem-ek');
      if (ekBox) {
        (ekBox.closest('.telem-box') || ekBox).click();
      }
    });
    await new Promise(r => setTimeout(r, 400));

    const ekCardContent = await page.evaluate(() => {
      const card = document.querySelector('.sim-calc-inspector-card');
      if (!card) return null;
      const symbolText = card.querySelector('.var-symbol-badge') ? card.querySelector('.var-symbol-badge').textContent : '';
      const titleText = card.querySelector('.var-title-th') ? card.querySelector('.var-title-th').textContent : '';
      const stepMath = card.querySelector('.calc-step-row .step-math') ? card.querySelector('.calc-step-row .step-math').textContent : '';
      return { symbolText, titleText, stepMath };
    });

    assertTest('Clicking Ek box updates inspector to Kinetic Energy', ekCardContent && ekCardContent.titleText.includes('พลังงานจลน์'));
    assertTest('Ek inspector shows substitution of mass and velocity', ekCardContent && ekCardContent.stepMath.includes('E_k') || (ekCardContent && ekCardContent.stepMath.includes('0.5')));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_desktop_ek_substitution_selected.png'), fullPage: false });

    // 5. Live Reactivity: Adjust Slider and Verify Real-time Recalculation
    console.log('\n--- 5. Dynamic Reactivity: Slider Drag Updates Substituted Numbers in Real Time ---');
    const preChangeVal = await page.evaluate(() => {
      const badge = document.querySelector('.output-value-badge');
      return badge ? badge.textContent : '';
    });

    await page.evaluate(() => {
      const v0Slider = document.getElementById('slider-v0');
      if (v0Slider) {
        v0Slider.value = '40.0';
        v0Slider.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 400));

    const postChange = await page.evaluate(() => {
      const card = document.querySelector('.sim-calc-inspector-card');
      const badge = document.querySelector('.output-value-badge');
      const stepText = card ? card.textContent : '';
      return {
        val: badge ? badge.textContent : '',
        contains40: stepText.includes('40')
      };
    });

    assertTest('Changing v0 slider updates computed Ek in inspector', postChange.contains40, `New output: ${postChange.val}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_desktop_live_slider_recalculation.png'), fullPage: false });

    // 6. Mode Switch: Vehicle & Gauss Divergence Theorem
    console.log('\n--- 6. Vehicle & Divergence Mode Telemetry Inspection ---');
    await page.evaluate(() => {
      window.switchSimMode('vehicle', 'vehicle_kinematics');
    });
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const vrelBox = document.getElementById('telem-veh-vrel');
      if (vrelBox) {
        (vrelBox.closest('.telem-box') || vrelBox).click();
      }
    });
    await new Promise(r => setTimeout(r, 400));

    const vehCard = await page.evaluate(() => {
      const card = document.querySelector('#sim-container-vehicle .sim-calc-inspector-card');
      return card ? card.textContent : '';
    });
    assertTest('Vehicle mode displays Relative Airspeed inspection', vehCard.includes('ลมสัมพัทธ์') || vehCard.includes('v_rel') || vehCard.includes('Relative'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_desktop_vehicle_mode_inspector.png'), fullPage: false });

    // 7. Mode Switch: Circular Motion (Centripetal Acceleration ac)
    console.log('\n--- 7. Circular Motion Mode Telemetry Inspection ---');
    await page.evaluate(() => {
      window.openChapter('ch02');
      window.switchSimMode('circular', 'banked');
    });
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const acBox = document.getElementById('circ-telem-ac');
      if (acBox) {
        (acBox.closest('.telem-box') || acBox).click();
      }
    });
    await new Promise(r => setTimeout(r, 400));

    const circCard = await page.evaluate(() => {
      const card = document.querySelector('#sim-container-circular .sim-calc-inspector-card');
      return card ? card.textContent : '';
    });
    assertTest('Circular mode displays Centripetal Acceleration formula & steps', circCard.includes('สู่ศูนย์กลาง') && circCard.includes('a_c'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_desktop_circular_ac_inspector.png'), fullPage: false });

    // 8. Mode Switch: Oscillations (Natural Frequency omega0)
    console.log('\n--- 8. Oscillation Mode Telemetry Inspection ---');
    await page.evaluate(() => {
      window.openChapter('ch03');
      window.switchSimMode('oscillation', 'spring');
    });
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const w0Box = document.getElementById('osc-telem-omega0');
      if (w0Box) {
        (w0Box.closest('.telem-box') || w0Box).click();
      }
    });
    await new Promise(r => setTimeout(r, 400));

    const oscCard = await page.evaluate(() => {
      const card = document.querySelector('#sim-container-oscillation .sim-calc-inspector-card');
      return card ? card.textContent : '';
    });
    assertTest('Oscillation mode displays Natural Frequency formula & steps', oscCard.includes('ความถี่เชิงมุมธรรมชาติ') || oscCard.includes('omega_0') || oscCard.includes('rad/s'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_desktop_oscillation_omega0_inspector.png'), fullPage: false });

    // 9. Mobile Responsiveness (390px Viewport)
    console.log('\n--- 9. Mobile Responsive Viewport (390x844) ---');
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 400));

    const mobileCheck = await page.evaluate(() => {
      const card = document.querySelector('.sim-calc-inspector-card');
      const bodyWidth = document.body.scrollWidth;
      const viewportWidth = window.innerWidth;
      const cardWidth = card ? card.offsetWidth : 0;
      return {
        noOverflow: bodyWidth <= viewportWidth,
        bodyWidth,
        viewportWidth,
        cardWidth
      };
    });

    assertTest('Zero horizontal overflow on 390px viewport with active calculation inspector', mobileCheck.noOverflow, `Body width: ${mobileCheck.bodyWidth}px`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_mobile_390px_calculation_inspector.png'), fullPage: false });

    // 10. Expand / Collapse Button Test
    console.log('\n--- 10. Expand / Collapse Toggle ---');
    await page.evaluate(() => {
      const btn = document.getElementById('btn-toggle-calc-inspector');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    const isCollapsed = await page.evaluate(() => {
      const body = document.querySelector('.calc-inspector-body');
      return body && body.style.display === 'none';
    });
    assertTest('Inspector collapses cleanly when toggle button clicked', isCollapsed);

    // Expand back
    await page.evaluate(() => {
      const btn = document.getElementById('btn-toggle-calc-inspector');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // 11. Console Error Audit
    console.log('\n--- 11. Console Error Audit ---');
    assertTest('Zero browser console errors throughout entire suite', consoleErrors.length === 0, `Errors: ${consoleErrors.length} -> ${consoleErrors.join(', ')}`);

    console.log('\n======================================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================================\n');

  } catch (err) {
    console.error('Fatal error during test run:', err);
    failed++;
  } finally {
    await browser.close();
    process.exit(failed > 0 ? 1 : 0);
  }
})();
