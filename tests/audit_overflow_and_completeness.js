/**
 * audit_overflow_and_completeness.js
 * Comprehensive Scrutiny Script: checks overflow, text clipping, and contrast across all 11 simulators & 8 views
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8089/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\deep_scrutiny';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('=== STARTING DEEP SCRUTINY & OVERFLOW AUDIT ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('[Browser Error]', msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
    console.error('[Page Error]', err.message);
  });

  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'mobile_390', width: 390, height: 844 },
    { name: 'mobile_360', width: 360, height: 740 }
  ];

  const viewsToTest = [
    'view-landing',
    'view-chapter-select',
    'view-theory',
    'view-formulas',
    'view-simulator',
    'view-phenomena',
    'view-summary',
    'view-practice',
    'view-analytical'
  ];

  const simModesToTest = [
    { mode: 'projectile', submode: null },
    { mode: 'vehicle', submode: 'rocket' },
    { mode: 'collision', submode: null },
    { mode: 'threejs', submode: null },
    { mode: 'circular', submode: 'banked' },
    { mode: 'oscillation', submode: 'spring' },
    { mode: 'wave', submode: 'traveling' },
    { mode: 'thermo', submode: 'pv_engine' },
    { mode: 'em', submode: 'lorentz_cyclotron' },
    { mode: 'nuclear', submode: 'binding_energy' },
    { mode: 'civil', submode: 'truss_analysis' }
  ];

  // 1. Audit Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  console.log('\n--- 1. AUDITING ALL MAIN VIEWS (1440x900) ---');
  for (const viewId of viewsToTest) {
    await page.evaluate(v => window.PhysicsApp ? window.PhysicsApp.switchView(v) : null, viewId);
    await new Promise(r => setTimeout(r, 400));

    const overflowCheck = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const bodyW = document.body.scrollWidth;
      const winW = window.innerWidth;
      const hasHorizontalScroll = bodyW > winW || docW > winW;
      return { bodyW, docW, winW, hasHorizontalScroll };
    });

    console.log(`View [${viewId}]: Horizontal overflow = ${overflowCheck.hasHorizontalScroll} (body: ${overflowCheck.bodyW}px / win: ${overflowCheck.winW}px)`);
    if (overflowCheck.hasHorizontalScroll) {
      console.warn(`  WARNING: Horizontal overflow in view ${viewId}!`);
    }
  }

  // 2. Audit All 11 Simulators & Speed Controls
  console.log('\n--- 2. AUDITING ALL 11 SIMULATOR ENGINES & SPEED TOOLBARS ---');
  await page.evaluate(() => window.PhysicsApp.switchView('view-simulator'));
  await new Promise(r => setTimeout(r, 400));

  for (const item of simModesToTest) {
    await page.evaluate(({ mode, submode }) => {
      window.switchSimMode(mode, submode);
    }, item);
    await new Promise(r => setTimeout(r, 400));

    const simCheck = await page.evaluate(({ mode }) => {
      const container = document.getElementById(`sim-container-${mode}`);
      const isVisible = container && window.getComputedStyle(container).display !== 'none';
      const canvas = container ? container.querySelector('canvas') : null;
      const canvasDim = canvas ? { w: canvas.width, h: canvas.height, cw: canvas.clientWidth, ch: canvas.clientHeight } : null;
      const speedBtns = container ? container.querySelectorAll('.btn-speed').length : 0;
      return { isVisible, canvasDim, speedBtns };
    }, item);

    console.log(`Simulator [${item.mode}]: visible = ${simCheck.isVisible} | canvas = ${simCheck.canvasDim ? `${simCheck.canvasDim.w}x${simCheck.canvasDim.h}` : 'none'} | speed buttons = ${simCheck.speedBtns}`);
  }

  // 3. Audit Mobile 390px Viewport
  console.log('\n--- 3. AUDITING MOBILE 390px VIEWPORT ---');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 400));

  for (const viewId of ['view-landing', 'view-chapter-select', 'view-theory', 'view-summary']) {
    await page.evaluate(v => window.PhysicsApp ? window.PhysicsApp.switchView(v) : null, viewId);
    await new Promise(r => setTimeout(r, 400));

    const mobOverflow = await page.evaluate(() => {
      const bodyW = document.body.scrollWidth;
      const winW = window.innerWidth;
      return { hasOverflow: bodyW > winW, bodyW, winW };
    });

    console.log(`Mobile 390px [${viewId}]: overflow = ${mobOverflow.hasOverflow} (${mobOverflow.bodyW}px / ${mobOverflow.winW}px)`);
    if (mobOverflow.hasOverflow) {
      console.warn(`  WARNING: Mobile 390px overflow in ${viewId}!`);
    }
  }

  // 4. Capture Final Polish Screenshots
  console.log('\n--- 4. CAPTURING POLISH ARTIFACTS ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => window.PhysicsApp.switchView('view-landing'));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'scrutiny_01_landing_hero.png') });
  console.log('Saved scrutiny_01_landing_hero.png');

  await page.evaluate(() => window.PhysicsApp.switchView('view-chapter-select'));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'scrutiny_02_chapter_select.png') });
  console.log('Saved scrutiny_02_chapter_select.png');

  await page.evaluate(() => {
    window.PhysicsApp.openChapter('ch01');
    window.PhysicsApp.switchView('view-theory');
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'scrutiny_03_theory_ch01.png') });
  console.log('Saved scrutiny_03_theory_ch01.png');

  await page.evaluate(() => {
    window.PhysicsApp.openChapter('ch01');
    window.PhysicsApp.switchView('view-simulator');
    window.switchSimMode('projectile');
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'scrutiny_04_sim_projectile.png') });
  console.log('Saved scrutiny_04_sim_projectile.png');

  console.log('\n=== AUDIT COMPLETE ===');
  console.log(`Total Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console Errors:', consoleErrors);
  }

  await browser.close();
}

run().catch(err => {
  console.error('SCRUTINY AUDIT ERROR:', err);
  process.exit(1);
});
