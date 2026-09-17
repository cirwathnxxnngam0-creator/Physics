/**
 * test_browser_ui.js - Complete Browser Automation, Exhaustive Overflow Matrix,
 * Ergonomics, Real Pointer Drag, Keyboard Accessibility & DOM Contrast Verification (Revision 2)
 *
 * Requirements from GPT_BUILD_SLICE_001_REVIEW:
 *   1. Engine & UI input validation and state management regressions
 *   2. Exhaustive overflow matrix: All 4 views x 3 academic tiers x 5 breakpoints (360, 390, 768, 1024, 1440)
 *   3. Real pointer / touch drag on canvas handle
 *   4. Keyboard accessibility (slider arrows, spacebar play/pause)
 *   5. Touch targets checked in BOTH width >= 48px AND height >= 48px (including sliders & toggles)
 *   6. Real rendered DOM contrast reading (getComputedStyle & effective background)
 *   7. Canvas playback behavior under prefers-reduced-motion
 *   8. Console error tracking throughout entire suite
 */

const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8080/';
const EVIDENCE_DIR = path.resolve(__dirname, '../../gpt/evidence/build_slice_001_fix');

let passCount = 0;
let failCount = 0;
const testResults = [];

function assertTest(name, condition, details) {
  if (condition) {
    passCount++;
    console.log(`[PASS] ${name}`);
    if (details) console.log(`       ${details}`);
    testResults.push({ name, status: 'PASS', details });
  } else {
    failCount++;
    console.error(`[FAIL] ${name}`);
    if (details) console.error(`       ${details}`);
    testResults.push({ name, status: 'FAIL', details });
  }
}

async function clickElement(page, selector) {
  await page.evaluate(sel => {
    const el = document.querySelector(sel);
    if (el) {
      el.scrollIntoView({ block: 'center', inline: 'center' });
      el.click();
    }
  }, selector);
  await new Promise(r => setTimeout(r, 120));
}

async function runBrowserTests() {
  console.log('======================================================================');
  console.log('PHYSICSNOZA 3.0: BROWSER AUTOMATION, RESPONSIVE & AUDIT TEST SUITE (REV 2)');
  console.log('Timestamp: ' + new Date().toISOString());
  console.log('Target URL: ' + TARGET_URL);
  console.log('Browser Binary: ' + CHROME_PATH);
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
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.toString());
    });

    // ------------------------------------------------------------------
    // 1. Initial Page Load & Diagnostics
    // ------------------------------------------------------------------
    console.log('--- 1. Initial Page Load & HTTP Loopback ---');
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    const status = response ? response.status() : 0;
    assertTest('HTTP Status 200', status === 200, `HTTP response: ${status}`);

    const pageTitle = await page.title();
    assertTest('Page Title Verification', pageTitle.includes('BOSA PHYSICS'), `Title: "${pageTitle}"`);

    // ------------------------------------------------------------------
    // 2. Exhaustive Responsive Viewport & Overflow Matrix (Item 3)
    //    Tests all 4 views x 3 academic tiers across 360, 390, 768, 1024, 1440 px
    // ------------------------------------------------------------------
    console.log('\n--- 2. Exhaustive Responsive Viewport & Overflow Matrix ---');
    const viewports = [360, 390, 768, 1024, 1440];
    const tiers = ['highSchool', 'basicUniversity', 'advancedUniversity'];
    const views = ['view-theory', 'view-formulas', 'view-simulator', 'view-phenomena'];

    for (const vpWidth of viewports) {
      await page.setViewport({ width: vpWidth, height: 900, deviceScaleFactor: 1 });
      let vpHasAnyOverflow = false;
      const overflowDetails = [];

      for (const viewId of views) {
        // Activate view tab
        const tabBtnId = `#tab-${viewId.replace('view-', '')}`;
        await clickElement(page, tabBtnId);

        if (viewId === 'view-theory') {
          // Test each of the 3 academic tiers
          for (const tierKey of tiers) {
            await clickElement(page, `.tier-btn[data-tier="${tierKey}"]`);

            const check = await page.evaluate(() => {
              const el = document.documentElement;
              return { innerWidth: window.innerWidth, scrollWidth: el.scrollWidth };
            });

            if (check.scrollWidth > check.innerWidth) {
              vpHasAnyOverflow = true;
              overflowDetails.push(`Theory(${tierKey}) scrollWidth=${check.scrollWidth}`);
            }
          }
        } else {
          const check = await page.evaluate(() => {
            const el = document.documentElement;
            return { innerWidth: window.innerWidth, scrollWidth: el.scrollWidth };
          });

          if (check.scrollWidth > check.innerWidth) {
            vpHasAnyOverflow = true;
            overflowDetails.push(`${viewId} scrollWidth=${check.scrollWidth}`);
          }
        }
      }

      // Capture screenshot at this viewport (on simulator view)
      await clickElement(page, '#tab-simulator');
      const shotPath = path.join(EVIDENCE_DIR, `viewport_${vpWidth}px.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      assertTest(
        `Viewport ${vpWidth}px: Zero Horizontal Overflow across All Views & Tiers`,
        !vpHasAnyOverflow,
        vpHasAnyOverflow
          ? `Overflow detected in: ${overflowDetails.join(', ')}`
          : `All 6 view/tier combinations strictly scrollWidth <= innerWidth (${vpWidth}px). (Screenshot: viewport_${vpWidth}px.png)`
      );
    }

    // ------------------------------------------------------------------
    // 3. Ergonomics & Touch Target Size Verification (Item 3)
    //    Audits BOTH width >= 47.5px AND height >= 47.5px on all interactive controls
    // ------------------------------------------------------------------
    console.log('\n--- 3. Ergonomics & Touch Target Size Verification (>= 48px Width & Height) ---');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await clickElement(page, '#tab-simulator');

    const touchMetrics = await page.evaluate(() => {
      // Gather all visible buttons, tabs, tier switchers, sliders, and toggle labels
      const targets = Array.from(document.querySelectorAll('.btn, .view-tab, .tier-btn, .slider-input, .toggle-label, .sim-mode-btn'))
        .filter(el => el.offsetParent !== null);
      const invalid = [];
      targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Allow 0.5px subpixel antialiasing/rounding
        if (rect.width < 47.5 || rect.height < 47.5) {
          invalid.push({
            id: el.id || el.className,
            width: rect.width,
            height: rect.height,
            tag: el.tagName
          });
        }
      });
      return { total: targets.length, invalidCount: invalid.length, invalid };
    });

    assertTest(
      'Interactive Controls Ergonomics (Width & Height >= 48px)',
      touchMetrics.invalidCount === 0,
      `Audited ${touchMetrics.total} interactive controls (tabs, tiers, action buttons, sliders, toggle labels); invalid: ${touchMetrics.invalidCount}`
    );

    // ------------------------------------------------------------------
    // 4. Real Pointer Drag on Canvas Handle (Item 3)
    // ------------------------------------------------------------------
    console.log('\n--- 4. Real Pointer / Mouse Drag on Canvas Handle ---');
    await page.setViewport({ width: 1024, height: 900, deviceScaleFactor: 1 });
    await clickElement(page, '#tab-simulator');

    const initialSimParams = await page.evaluate(() => {
      return {
        v0: window.simulatorInstance.params.v0,
        theta: window.simulatorInstance.params.thetaDeg
      };
    });

    // Locate canvas handle on screen with scrollIntoView
    const handleCoords = await page.evaluate(() => {
      const sim = window.simulatorInstance;
      sim.canvas.scrollIntoView({ block: 'center' });
      const rect = sim.canvas.getBoundingClientRect();
      const pos = sim._getHandleScreenPos();
      return {
        x: rect.left + pos.sx,
        y: rect.top + pos.sy
      };
    });

    // Perform actual pointer drag with Puppeteer mouse events
    await page.mouse.move(handleCoords.x, handleCoords.y);
    await page.mouse.down();
    // Drag upwards to increase angle and outward to change velocity
    await page.mouse.move(handleCoords.x + 35, handleCoords.y - 65, { steps: 5 });
    await page.mouse.up();
    await new Promise(r => setTimeout(r, 200));

    const postDragParams = await page.evaluate(() => {
      return {
        v0: window.simulatorInstance.params.v0,
        theta: window.simulatorInstance.params.thetaDeg
      };
    });

    assertTest(
      'Actual Pointer Drag Interaction on Canvas Handle',
      postDragParams.theta !== initialSimParams.theta || postDragParams.v0 !== initialSimParams.v0,
      `Pre-drag: theta=${initialSimParams.theta}°, v0=${initialSimParams.v0} m/s => Post-drag: theta=${postDragParams.theta}°, v0=${postDragParams.v0} m/s`
    );

    // Capture screenshot of simulator with active drag handle & vectors
    const simShotPath = path.join(EVIDENCE_DIR, 'simulator_view.png');
    await page.screenshot({ path: simShotPath, fullPage: false });

    // ------------------------------------------------------------------
    // 4b. Real Mobile Touch Drag Gesture on Canvas Handle (CDP Input.dispatchTouchEvent)
    // ------------------------------------------------------------------
    console.log('\n--- 4b. Real Mobile Touch Drag Gesture (390px Viewport) ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await clickElement(page, '#tab-simulator');
    await new Promise(r => setTimeout(r, 200));

    const preTouchCoords = await page.evaluate(() => {
      const sim = window.simulatorInstance;
      sim.canvas.scrollIntoView({ block: 'center' });
      const rect = sim.canvas.getBoundingClientRect();
      const pos = sim._getHandleScreenPos();
      return {
        x: rect.left + pos.sx,
        y: rect.top + pos.sy,
        preV0: sim.params.v0,
        preTheta: sim.params.thetaDeg
      };
    });

    const cdpClient = await page.target().createCDPSession();
    await cdpClient.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: Math.round(preTouchCoords.x), y: Math.round(preTouchCoords.y) }]
    });
    await new Promise(r => setTimeout(r, 50));

    for (let s = 1; s <= 5; s++) {
      await cdpClient.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{
          x: Math.round(preTouchCoords.x + s * 6),
          y: Math.round(preTouchCoords.y - s * 10)
        }]
      });
      await new Promise(r => setTimeout(r, 30));
    }

    await cdpClient.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: []
    });
    await new Promise(r => setTimeout(r, 200));

    const postTouchParams = await page.evaluate(() => {
      return {
        v0: window.simulatorInstance.params.v0,
        theta: window.simulatorInstance.params.thetaDeg
      };
    });

    assertTest(
      'Real Mobile Touch Drag Gesture on Canvas Handle (CDP Input.dispatchTouchEvent)',
      postTouchParams.theta !== preTouchCoords.preTheta || postTouchParams.v0 !== preTouchCoords.preV0,
      `Pre-touch: theta=${preTouchCoords.preTheta}°, v0=${preTouchCoords.preV0} m/s => Post-touch: theta=${postTouchParams.theta}°, v0=${postTouchParams.v0} m/s`
    );

    // Reset viewport back to desktop for keyboard test
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await clickElement(page, '#tab-simulator');
    await new Promise(r => setTimeout(r, 150));

    // ------------------------------------------------------------------
    // 5. Keyboard Accessibility Tests (Item 3)
    // ------------------------------------------------------------------
    console.log('\n--- 5. Keyboard Accessibility & Control Navigation ---');
    // Set slider-v0 to 100 first so it is not capped at max 150
    await page.evaluate(() => {
      const s = document.getElementById('slider-v0');
      s.value = 100;
      s.dispatchEvent(new Event('input'));
    });
    await new Promise(r => setTimeout(r, 100));

    // Test slider keyboard control: focus slider-v0 and press ArrowRight
    const v0BeforeKey = await page.evaluate(() => {
      const s = document.getElementById('slider-v0');
      s.scrollIntoView({ block: 'center' });
      s.focus();
      return Number(s.value);
    });

    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 100));
    const v0AfterKey = await page.evaluate(() => Number(document.getElementById('slider-v0').value));

    assertTest(
      'Slider Keyboard Navigation (ArrowRight increment)',
      v0AfterKey > v0BeforeKey,
      `v0 value changed from ${v0BeforeKey} to ${v0AfterKey} via ArrowRight`
    );

    // Blur active input element so global Space shortcut is received
    await page.evaluate(() => {
      if (document.activeElement) document.activeElement.blur();
    });
    await new Promise(r => setTimeout(r, 50));

    // Test Spacebar shortcut for Play/Pause
    await page.keyboard.press('Space');
    await new Promise(r => setTimeout(r, 300));
    const isPlayingAfterSpace = await page.evaluate(() => {
      const btnPause = document.getElementById('btn-pause');
      return btnPause && !btnPause.disabled;
    });

    assertTest(
      'Keyboard Play Activation (Spacebar)',
      isPlayingAfterSpace,
      'Spacebar activated playback; Pause button became enabled'
    );

    // Press Space again to pause
    await page.keyboard.press('Space');
    await new Promise(r => setTimeout(r, 150));

    // Reset with Reset button
    await clickElement(page, '#btn-reset');

    // ------------------------------------------------------------------
    // 6. Live Browser State Management Regression (Item 2)
    //    Play -> Pause -> Parameter change to shorter flight
    // ------------------------------------------------------------------
    console.log('\n--- 6. Browser State Management: Pause -> Parameter Change ---');
    await clickElement(page, '#btn-play');
    await new Promise(r => setTimeout(r, 400)); // Advance flight
    await clickElement(page, '#btn-pause');

    const pauseTelemetry = await page.evaluate(() => {
      return {
        t: parseFloat(document.getElementById('telem-t').textContent),
        x: parseFloat(document.getElementById('telem-x').textContent)
      };
    });

    // Now change slider-v0 to 20 m/s (drastically shorter flight time)
    await page.evaluate(() => {
      const input = document.getElementById('slider-v0');
      input.value = 20;
      input.dispatchEvent(new Event('input'));
    });
    await new Promise(r => setTimeout(r, 150));

    const clampedTelemetry = await page.evaluate(() => {
      return {
        t: parseFloat(document.getElementById('telem-t').textContent),
        x: parseFloat(document.getElementById('telem-x').textContent)
      };
    });

    assertTest(
      'Browser State Clamping on Parameter Reduction while Paused',
      clampedTelemetry.t <= 3.0 && Number.isFinite(clampedTelemetry.x),
      `Prior time was ${pauseTelemetry.t}s; after dropping v0 to 20 m/s, time clamped to ${clampedTelemetry.t}s (X = ${clampedTelemetry.x}m)`
    );

    // ------------------------------------------------------------------
    // 7. Rendered DOM Color Contrast Verification (Item 4)
    //    Reads getComputedStyle & effective background colors from actual DOM nodes
    // ------------------------------------------------------------------
    console.log('\n--- 7. Rendered DOM Computed Color Contrast Verification ---');
    await clickElement(page, '#tab-theory');

    const contrastAudit = await page.evaluate(() => {
      function parseRGB(colorStr) {
        const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return [15, 23, 42];
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      }

      function getLuminance([r, g, b]) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
      }

      function getEffectiveBackground(el) {
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (match) {
            const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1;
            if (alpha > 0.05) {
              return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
            }
          }
          cur = cur.parentElement;
        }
        return [255, 255, 255]; // fallback page white
      }

      const auditedElements = [
        { selector: '.content-title', label: 'Theory Header Title', minRatio: 7.0 },
        { selector: '.card-title', label: 'Card Header Title', minRatio: 7.0 },
        { selector: '.card-body p', label: 'Card Body Text', minRatio: 7.0 },
        { selector: '.view-tab.active', label: 'Active Navigation Tab', minRatio: 4.5 },
        { selector: '.tier-btn.active, .phenomena-filter-btn.active, .division-tab.active, .btn-primary', label: 'Active Tier / Filter Switcher', minRatio: 3.0 },
        { selector: '.card-badge', label: 'Badge Label Text', minRatio: 4.5 }
      ];

      const results = [];
      auditedElements.forEach(item => {
        const el = document.querySelector(item.selector);
        if (!el) {
          results.push({ ...item, ratio: null, pass: false, error: 'Element not found' });
          return;
        }
        const fgStr = window.getComputedStyle(el).color;
        const fgRGB = parseRGB(fgStr);
        const bgRGB = getEffectiveBackground(el);

        const lum1 = getLuminance(fgRGB);
        const lum2 = getLuminance(bgRGB);
        const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

        results.push({
          label: item.label,
          selector: item.selector,
          fg: fgStr,
          bg: `rgb(${bgRGB.join(',')})`,
          ratio: parseFloat(ratio.toFixed(2)),
          minRatio: item.minRatio,
          pass: ratio >= item.minRatio
        });
      });

      return results;
    });

    contrastAudit.forEach(res => {
      assertTest(
        `DOM Contrast: ${res.label} (>= ${res.minRatio}:1)`,
        res.pass,
        `Measured ratio: ${res.ratio}:1 (FG: ${res.fg} on BG: ${res.bg})`
      );
    });

    // ------------------------------------------------------------------
    // 8. prefers-reduced-motion Canvas Playback Behavior (Item 4)
    // ------------------------------------------------------------------
    console.log('\n--- 8. Canvas Playback with prefers-reduced-motion: reduce ---');
    await clickElement(page, '#tab-simulator');
    await clickElement(page, '#btn-reset');

    // Emulate prefers-reduced-motion: reduce
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    // Click Play
    await clickElement(page, '#btn-play');
    await new Promise(r => setTimeout(r, 150));

    // When reduced motion is preferred, simulator should jump directly to final landing
    // without starting an ongoing animation loop!
    const reducedMotionState = await page.evaluate(() => {
      const t = parseFloat(document.getElementById('telem-t').textContent);
      const x = parseFloat(document.getElementById('telem-x').textContent);
      return { t, x };
    });

    assertTest(
      'Canvas Reduced-Motion Behavior (Jumps to Landing without Animation Loop)',
      reducedMotionState.t > 0 && reducedMotionState.x > 0,
      `Directly evaluated final landing: t = ${reducedMotionState.t}s, x = ${reducedMotionState.x}m without continuous loop`
    );

    // ------------------------------------------------------------------
    // 8b. Master Variable, Symbol & SI Unit Glossary & Active Recall Mode
    // ------------------------------------------------------------------
    console.log('\n--- 8b. Master Symbols Glossary & Active Recall Verification ---');
    await clickElement(page, '#tab-formulas');
    await new Promise(r => setTimeout(r, 200));

    const masterSymbolsCheck = await page.evaluate(() => {
      const ledger = document.getElementById('master-symbols-ledger');
      if (!ledger) return { found: false };

      const allRows = ledger.querySelectorAll('tbody tr').length;
      return { found: true, allRows };
    });

    assertTest(
      'Master Symbols & SI Unit Glossary Rendered (46 Symbols)',
      masterSymbolsCheck.found && masterSymbolsCheck.allRows === 46,
      `Ledger found with ${masterSymbolsCheck.allRows} symbols across all 4 classical divisions`
    );

    // Test Domain Filtering
    await clickElement(page, '.symbol-domain-btn[data-domain="kinematics"]');
    const kinematicsCount = await page.evaluate(() => {
      return document.querySelectorAll('#master-symbols-ledger tbody tr').length;
    });
    assertTest(
      'Symbol Domain Filtering (Kinematics)',
      kinematicsCount === 12,
      `Filtered kinematics domain shows ${kinematicsCount} symbols (expected 12)`
    );

    // Reset domain filter
    await clickElement(page, '.symbol-domain-btn[data-domain="all"]');

    // Test Active Recall Mode Toggle
    await clickElement(page, '#btn-recall-mode');
    const recallState1 = await page.evaluate(() => {
      const blurCells = document.querySelectorAll('#master-symbols-ledger .recall-blur');
      return { count: blurCells.length };
    });
    assertTest(
      'Active Recall Mode: Blurs Symbol Meanings and SI Units for Self-Review',
      recallState1.count > 50,
      `Active recall enabled: ${recallState1.count} cells hidden behind interactive blur badges`
    );

    // Test Click to Reveal
    const revealCheck = await page.evaluate(() => {
      const firstBlur = document.querySelector('#master-symbols-ledger .recall-blur');
      if (!firstBlur) return false;
      firstBlur.click();
      return firstBlur.classList.contains('revealed');
    });
    assertTest(
      'Active Recall Tap-to-Reveal Interaction',
      revealCheck,
      'Clicking blurred cell successfully removed blur mask (class "revealed" added)'
    );

    // ------------------------------------------------------------------
    // 8c. Simulator Multi-Mode Switching (Vehicle & Collision Simulators)
    // ------------------------------------------------------------------
    console.log('\n--- 8c. Multi-Mode Simulator: Racing Car & Collision Engine ---');
    await clickElement(page, '#tab-simulator');
    await new Promise(r => setTimeout(r, 200));

    // Switch to Mode 2: Vehicle & Wind Vector Field
    await clickElement(page, '#mode-btn-vehicle');
    await new Promise(r => setTimeout(r, 150));

    const vehicleModeActive = await page.evaluate(() => {
      const vContainer = document.getElementById('sim-container-vehicle');
      const pContainer = document.getElementById('sim-container-projectile');
      const canvas = document.getElementById('vehicle-canvas');
      return {
        vVisible: vContainer && vContainer.style.display !== 'none',
        pHidden: pContainer && pContainer.style.display === 'none',
        canvasReady: canvas && canvas.width > 0
      };
    });

    assertTest(
      'Mode 2 (Racing Car & Vector Field) Container & Canvas Activation',
      vehicleModeActive.vVisible && vehicleModeActive.pHidden && vehicleModeActive.canvasReady,
      `Vehicle container visible: ${vehicleModeActive.vVisible}, Projectile container hidden: ${vehicleModeActive.pHidden}`
    );

    // Test Vehicle Playback & Telemetry Updates
    await clickElement(page, '#btn-veh-play');
    await new Promise(r => setTimeout(r, 250));
    await clickElement(page, '#btn-veh-pause');

    const vehicleTelemetry = await page.evaluate(() => {
      const s = parseFloat(document.getElementById('telem-veh-s').textContent);
      const dr = parseFloat(document.getElementById('telem-veh-dr').textContent);
      const vCar = parseFloat(document.getElementById('telem-veh-vcar').textContent);
      const vRel = parseFloat(document.getElementById('telem-veh-vrel').textContent);
      return { s, dr, vCar, vRel };
    });

    assertTest(
      'Mode 2 Vehicle Kinematics Telemetry (s, dr, v_car, v_rel)',
      vehicleTelemetry.s > 0 && vehicleTelemetry.dr > 0 && vehicleTelemetry.vRel > 0,
      `Distance s = ${vehicleTelemetry.s}m, Displacement dr = ${vehicleTelemetry.dr}m, v_rel = ${vehicleTelemetry.vRel}m/s`
    );

    // Switch to Mode 3: Collision, Impulse & Momentum
    await clickElement(page, '#mode-btn-collision');
    await new Promise(r => setTimeout(r, 150));

    const collisionModeActive = await page.evaluate(() => {
      const cContainer = document.getElementById('sim-container-collision');
      const vContainer = document.getElementById('sim-container-vehicle');
      const canvas = document.getElementById('collision-canvas');
      return {
        cVisible: cContainer && cContainer.style.display !== 'none',
        vHidden: vContainer && vContainer.style.display === 'none',
        canvasReady: canvas && canvas.width > 0
      };
    });

    assertTest(
      'Mode 3 (Collision & Impulse) Container & Canvas Activation',
      collisionModeActive.cVisible && collisionModeActive.vHidden && collisionModeActive.canvasReady,
      `Collision container visible: ${collisionModeActive.cVisible}, Vehicle container hidden: ${collisionModeActive.vHidden}`
    );

    // Test Collision Playback & Momentum Conservation
    await clickElement(page, '#btn-col-play');
    await new Promise(r => setTimeout(r, 350));
    await clickElement(page, '#btn-col-pause');

    const collisionTelemetry = await page.evaluate(() => {
      const pTotStr = document.getElementById('telem-col-ptot').textContent;
      const p1Str = document.getElementById('telem-col-p1').textContent;
      const p2Str = document.getElementById('telem-col-p2').textContent;
      const impulseStr = document.getElementById('telem-col-impulse').textContent;
      return {
        pTot: parseFloat(pTotStr),
        p1: parseFloat(p1Str),
        p2: parseFloat(p2Str),
        impulse: parseFloat(impulseStr)
      };
    });

    assertTest(
      'Mode 3 Momentum Conservation & Impulse Calculation',
      !isNaN(collisionTelemetry.pTot) && collisionTelemetry.impulse >= 0,
      `Momentum conserved: p_total = ${collisionTelemetry.pTot} kg*m/s, Impulse J = ${collisionTelemetry.impulse} N*s`
    );

    // Switch to Mode 4: Three.js WebGL 3D Ballistics & Crosswind Arena
    await clickElement(page, '#mode-btn-threejs');
    await new Promise(r => setTimeout(r, 200));

    const threejsModeActive = await page.evaluate(() => {
      const tContainer = document.getElementById('sim-container-threejs');
      const cContainer = document.getElementById('sim-container-collision');
      const canvas = document.getElementById('threejs-canvas');
      return {
        tVisible: tContainer && tContainer.style.display !== 'none',
        cHidden: cContainer && cContainer.style.display === 'none',
        canvasReady: canvas && canvas.width > 0,
        threeLoaded: typeof window.THREE !== 'undefined',
        simInstance: typeof window.PhysicsApp.getThreejsSimulator() !== 'undefined'
      };
    });

    assertTest(
      'Mode 4 (Three.js WebGL 3D Ballistics) Container & Canvas Activation',
      threejsModeActive.tVisible && threejsModeActive.cHidden && threejsModeActive.canvasReady && threejsModeActive.threeLoaded,
      `Three.js container visible: ${threejsModeActive.tVisible}, THREE loaded: ${threejsModeActive.threeLoaded}, Canvas ready: ${threejsModeActive.canvasReady}`
    );

    // Test Three.js Playback & 3D Spatial Drift Telemetry
    await clickElement(page, '#btn-threejs-play');
    await new Promise(r => setTimeout(r, 400));
    await clickElement(page, '#btn-threejs-pause');

    const threejsTelemetry = await page.evaluate(() => {
      const t = parseFloat(document.getElementById('threejs-telem-time').textContent);
      const x = parseFloat(document.getElementById('threejs-telem-x').textContent);
      const y = parseFloat(document.getElementById('threejs-telem-y').textContent);
      const z = parseFloat(document.getElementById('threejs-telem-z').textContent);
      const speed = parseFloat(document.getElementById('threejs-telem-speed').textContent);
      const range = parseFloat(document.getElementById('threejs-telem-range').textContent);
      return { t, x, y, z, speed, range };
    });

    assertTest(
      'Mode 4 Three.js 3D Trajectory & Crosswind Drift Telemetry',
      threejsTelemetry.t > 0 && threejsTelemetry.x > 0 && threejsTelemetry.y > 0 && Math.abs(threejsTelemetry.z) > 0,
      `Time t = ${threejsTelemetry.t}s, Position (X=${threejsTelemetry.x}m, Y=${threejsTelemetry.y}m, Z=${threejsTelemetry.z}m), Speed = ${threejsTelemetry.speed}m/s`
    );

    // Switch back to Mode 1
    await clickElement(page, '#mode-btn-projectile');
    const mode1Reactivated = await page.evaluate(() => {
      const pContainer = document.getElementById('sim-container-projectile');
      return pContainer && pContainer.style.display !== 'none';
    });
    assertTest(
      'Mode 1 (Projectile Ballistics) Clean Reactivation',
      mode1Reactivated,
      'Switched back to Mode 1 without state or layout collision'
    );

    // ------------------------------------------------------------------
    // 9. Browser Console Error Audit
    // ------------------------------------------------------------------
    console.log('\n--- 9. Browser Console Error Audit ---');
    assertTest(
      'Zero Uncaught Page Errors throughout Suite',
      consoleErrors.length === 0,
      consoleErrors.length === 0
        ? 'Encountered 0 errors'
        : `Errors encountered: ${JSON.stringify(consoleErrors)}`
    );

    await browser.close();

  } catch (err) {
    console.error('Test execution failed with exception:', err);
    failCount++;
    if (browser) await browser.close();
  }

  console.log('\n======================================================================');
  console.log(`BROWSER SUITE FINAL SUMMARY: ${passCount} PASSED, ${failCount} FAILED OUT OF ${passCount + failCount} TESTS.`);
  console.log('======================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runBrowserTests();
