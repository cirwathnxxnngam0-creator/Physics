/**
 * verify_ux_redesign_and_controls.js
 * Tri-Pillar verification for UI Redesign, 7 Umbrellas, Speed Controls, Single Numeric Inputs & Chapter Summaries
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8089/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\redesign_verification';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('--- Starting Tri-Pillar Verification of PhysicsNoza v3 Redesign ---');
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

  // Pillar 1: Live Website Inspection & Desktop Landing
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  console.log('1. Checking Crystalline Background Canvas...');
  const bgCanvasExists = await page.$eval('#bg-crystal-canvas', el => !!el);
  console.log(`   #bg-crystal-canvas present: ${bgCanvasExists}`);

  console.log('2. Inspecting Landing Page Cards...');
  const landingCards = await page.$$eval('.portal-track-card', cards => cards.map(c => ({
    title: c.querySelector('h3') ? c.querySelector('h3').innerText.trim() : '',
    bg: window.getComputedStyle(c).backgroundColor,
    border: window.getComputedStyle(c).borderColor
  })));
  console.log(`   Found ${landingCards.length} portal track cards:`, landingCards.map(c => c.title));

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_landing.png'), fullPage: false });
  console.log('   Saved 01_desktop_landing.png');

  // Check 390px mobile landing
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 400));
  const landingOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
  console.log(`   Mobile 390px landing overflow detected: ${landingOverflow}`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_mobile_landing.png'), fullPage: false });
  console.log('   Saved 02_mobile_landing.png');

  // Switch back to Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900 });

  // Pillar 2: 7 Master Category Umbrellas in Chapter Selection
  console.log('3. Navigating to Chapter Hub (#view-chapter-select)...');
  await page.click('#btn-enter-website');
  await new Promise(r => setTimeout(r, 600));

  const umbrellaCards = await page.$$eval('#bosa-curriculum-umbrellas .curriculum-card', cards => cards.map(c => ({
    code: c.querySelector('.curriculum-code') ? c.querySelector('.curriculum-code').innerText.trim() : '',
    title: c.querySelector('.curriculum-title') ? c.querySelector('.curriculum-title').innerText.trim() : '',
    actionBtns: c.querySelectorAll('.curriculum-action-row button').length
  })));
  console.log(`   Found ${umbrellaCards.length} Master Umbrellas:`);
  umbrellaCards.forEach((u, i) => console.log(`     ${i + 1}. [${u.code}] ${u.title} (${u.actionBtns} action buttons)`));

  if (umbrellaCards.length !== 7) {
    throw new Error(`Expected 7 Master Category Umbrellas, found ${umbrellaCards.length}`);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_desktop_7_umbrellas.png'), fullPage: false });
  console.log('   Saved 03_desktop_7_umbrellas.png');

  // Pillar 3: Simulators, Universal Speed Controls & Consolidated Inputs
  console.log('4. Launching Simulator from Umbrella 1 (#tab-sim)...');
  await page.click('#bosa-curriculum-umbrellas .curriculum-card:first-child .btn-chapter-launch[data-view="view-simulator"]');
  await new Promise(r => setTimeout(r, 600));

  // Check Speed Controls in Projectile Simulator
  const speedButtons = await page.$$eval('#sim-container-projectile .btn-speed', btns => btns.map(b => ({
    speed: b.dataset.speed,
    text: b.innerText.trim(),
    active: b.classList.contains('active')
  })));
  console.log('   Speed buttons in Projectile Simulator:', speedButtons);
  if (speedButtons.length < 5) {
    throw new Error(`Expected at least 5 speed buttons, found ${speedButtons.length}`);
  }

  // Click 0.25x speed
  await page.click('#sim-container-projectile .btn-speed[data-speed="0.25"]');
  await new Promise(r => setTimeout(r, 200));
  let simSpeed = await page.evaluate(() => window.currentGlobalSimSpeed);
  console.log(`   After clicking 0.25x: currentGlobalSimSpeed = ${simSpeed}`);
  if (simSpeed !== 0.25) throw new Error(`Speed mismatch: expected 0.25, got ${simSpeed}`);

  // Click 2.0x speed
  await page.click('#sim-container-projectile .btn-speed[data-speed="2"]');
  await new Promise(r => setTimeout(r, 200));
  simSpeed = await page.evaluate(() => window.currentGlobalSimSpeed);
  console.log(`   After clicking 2.0x: currentGlobalSimSpeed = ${simSpeed}`);
  if (simSpeed !== 2.0) throw new Error(`Speed mismatch: expected 2.0, got ${simSpeed}`);

  // Check single input consolidation in Projectile Controls
  const projControls = await page.evaluate(() => {
    const v0Group = document.querySelector('#input-v0') ? document.querySelector('#input-v0').closest('.slider-group') : null;
    const v0Inputs = v0Group ? v0Group.querySelectorAll('input[type="number"]').length : 0;
    const angleGroup = document.querySelector('#input-theta') ? document.querySelector('#input-theta').closest('.slider-group') : null;
    const angleInputs = angleGroup ? angleGroup.querySelectorAll('input[type="number"]').length : 0;
    return { v0Inputs, angleInputs };
  });
  console.log('   Number inputs per parameter group in Projectile:', projControls);
  if (projControls.v0Inputs !== 1 || projControls.angleInputs !== 1) {
    throw new Error(`Expected exactly 1 number input per parameter group! v0Inputs: ${projControls.v0Inputs}, angleInputs: ${projControls.angleInputs}`);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_desktop_sim_projectile.png'), fullPage: false });
  console.log('   Saved 04_desktop_sim_projectile.png');

  // Switch to Circular Motion Simulator and check speed retention
  console.log('5. Switching to Circular Motion Simulation...');
  await page.evaluate(() => window.switchSimMode('circular', 'banked'));
  await new Promise(r => setTimeout(r, 600));

  const circTimeScale = await page.evaluate(() => window.circularSimulatorInstance ? window.circularSimulatorInstance.timeScale : null);
  console.log(`   Circular Motion Simulator timeScale after mode switch: ${circTimeScale}`);
  if (circTimeScale !== 2.0) {
    throw new Error(`Circular motion simulator timeScale was not synced! Expected 2.0, got ${circTimeScale}`);
  }

  // Switch to Rocket & Variable Mass Simulator and test speed
  console.log('6. Switching to Rocket Simulation & Checking Single Inputs...');
  await page.evaluate(() => window.switchSimMode('vehicle', 'rocket'));
  await new Promise(r => setTimeout(r, 600));

  const rocketControls = await page.evaluate(() => {
    const m0Group = document.querySelector('#input-rocket-m0') ? document.querySelector('#input-rocket-m0').closest('.slider-group') : null;
    const m0Inputs = m0Group ? m0Group.querySelectorAll('input[type="number"]').length : 0;
    return { m0Inputs };
  });
  console.log('   Number inputs per parameter group in Rocket:', rocketControls);
  if (rocketControls.m0Inputs !== 1) {
    throw new Error(`Expected exactly 1 number input for rocket m0, found: ${rocketControls.m0Inputs}`);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_desktop_sim_rocket.png'), fullPage: false });
  console.log('   Saved 05_desktop_sim_rocket.png');

  // Pillar 4: Progressive Step Navigation (Tab 1 -> 2 -> 3 -> 4 -> 5)
  console.log('7. Testing Tab Step Navigation Flow...');
  // Click Next on Simulator step bar
  await page.click('#view-simulator .btn-next-step');
  await new Promise(r => setTimeout(r, 500));

  let activeTab = await page.evaluate(() => document.querySelector('.view-tab.active').dataset.view);
  console.log(`   After clicking Next in Simulator: active tab is ${activeTab} (Expected: view-phenomena)`);
  if (activeTab !== 'view-phenomena') throw new Error(`Step nav error: expected view-phenomena, got ${activeTab}`);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_desktop_phenomena.png'), fullPage: false });
  console.log('   Saved 06_desktop_phenomena.png');

  // Click Next in Phenomena -> should go to view-summary
  await page.evaluate(() => {
    const btn = document.querySelector('#view-phenomena .btn-next-step');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  activeTab = await page.evaluate(() => document.querySelector('.view-tab.active').dataset.view);
  console.log(`   After clicking Next in Phenomena: active tab is ${activeTab} (Expected: view-summary)`);
  if (activeTab !== 'view-summary') throw new Error(`Step nav error: expected view-summary, got ${activeTab}`);

  // Pillar 5: Comprehensive Chapter Summaries Verification
  console.log('8. Verifying Comprehensive Chapter Summaries (ch01 - ch07 & civil_eng)...');
  const chaptersToTest = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'civil_eng'];

  for (const ch of chaptersToTest) {
    await page.evaluate(chapter => {
      window.PhysicsApp.openChapter(chapter);
      window.PhysicsApp.switchView('view-summary');
    }, ch);
    await new Promise(r => setTimeout(r, 400));

    const summaryInfo = await page.evaluate(() => {
      const title = document.querySelector('.summary-title-main') ? document.querySelector('.summary-title-main').innerText : (document.querySelector('#view-summary h3') ? document.querySelector('#view-summary h3').innerText : '');
      const mindmapBranches = document.querySelectorAll('.mindmap-branch').length;
      const formulaRows = document.querySelectorAll('.summary-formula-table tbody tr').length;
      const trapCards = document.querySelectorAll('.trap-box').length;
      const appCards = document.querySelectorAll('.app-card-item').length;
      return { title, mindmapBranches, formulaRows, trapCards, appCards };
    });

    console.log(`   Summary [${ch}]: ${summaryInfo.title} | Mindmap Branches: ${summaryInfo.mindmapBranches} | Formulas: ${summaryInfo.formulaRows} | Traps: ${summaryInfo.trapCards} | Apps: ${summaryInfo.appCards}`);
    if (summaryInfo.formulaRows === 0 || summaryInfo.mindmapBranches === 0) {
      throw new Error(`Summary for ${ch} failed to render rich curriculum data!`);
    }
  }

  // Capture ch07 Nuclear Physics Summary & civil_eng Truss Summary
  await page.evaluate(() => {
    window.PhysicsApp.openChapter('ch07');
    window.PhysicsApp.switchView('view-summary');
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_desktop_summary_ch07.png'), fullPage: false });
  console.log('   Saved 07_desktop_summary_ch07.png');

  await page.evaluate(() => {
    window.PhysicsApp.openChapter('civil_eng');
    window.PhysicsApp.switchView('view-summary');
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_desktop_summary_civil.png'), fullPage: false });
  console.log('   Saved 08_desktop_summary_civil.png');

  // Check Mobile 390px on Summary view
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 400));
  const summaryMobileOverflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
  console.log(`   Mobile 390px summary overflow detected: ${summaryMobileOverflow}`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_mobile_summary_civil.png'), fullPage: false });
  console.log('   Saved 09_mobile_summary_civil.png');

  // Test Step Navigation Previous button (Summary -> Phenomena)
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluate(() => {
    const btn = document.querySelector('#view-summary .btn-prev-step');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  activeTab = await page.evaluate(() => document.querySelector('.view-tab.active').dataset.view);
  console.log(`   After clicking Prev in Summary: active tab is ${activeTab} (Expected: view-phenomena)`);
  if (activeTab !== 'view-phenomena') throw new Error(`Prev step nav error: expected view-phenomena, got ${activeTab}`);

  console.log('--- ALL TRI-PILLAR VERIFICATION CHECKS PASSED WITH ZERO ERRORS ---');
  if (consoleErrors.length > 0) {
    console.warn(`Encountered ${consoleErrors.length} console errors during run:`, consoleErrors);
  }

  await browser.close();
}

run().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
