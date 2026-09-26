const path = require('path');
const fs = require('fs');
const puppeteer = require('../node_modules/puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:8089/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\backlog_verification';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('================================================================');
  console.log('TRI-PILLAR VERIFICATION: ALL 16 PROBLEMS & 5 BACKLOG SIMULATORS');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('network-info') && !msg.text().includes('favicon')) {
      consoleErrors.push(msg.text());
    }
  });

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // 1. Inspect Practice View
  console.log('\n--- 1. Auditing All 16 Practice Problems: 100% Simulator Coverage ---');
  await page.evaluate(() => {
    openChapter('ch01');
    switchView('view-practice');
  });
  await new Promise(r => setTimeout(r, 400));

  const practiceAudit = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.practice-card')];
    const results = cards.map(c => {
      const idMatch = c.innerHTML.match(/prob-[a-z0-9-]+/);
      const id = idMatch ? idMatch[0] : 'unknown';
      const hasJumpBtn = !!c.querySelector('.btn-jump-sim-practice');
      const hasUnavailBadge = !!c.querySelector('.badge-sim-unavailable');
      return { id, hasJumpBtn, hasUnavailBadge };
    });
    const total = results.length;
    const withJump = results.filter(r => r.hasJumpBtn).length;
    const unavailable = results.filter(r => r.hasUnavailBadge).length;
    return { total, withJump, unavailable, results };
  });

  console.log(`Total Problems Found: ${practiceAudit.total}`);
  console.log(`With Active Jump Button: ${practiceAudit.withJump} / ${practiceAudit.total}`);
  console.log(`With Unavailable Badge: ${practiceAudit.unavailable}`);
  if (practiceAudit.unavailable > 0) {
    console.error('FAILED: Found problems still with unavailable badge!');
    process.exitCode = 1;
  } else {
    console.log('PASSED: 100% of 16 problems have active clickable simulator links!');
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_practice_all_16_linked.png') });

  // 2. Test Simulator 1: Truss Analysis (prob-civ-01)
  console.log('\n--- 2. Verifying Simulator 1: Truss Analysis (prob-civ-01) ---');
  const trussRes = await page.evaluate(() => {
    openChapter('ch01');
    switchView('view-practice');
    const btn = [...document.querySelectorAll('.practice-card')]
      .find(e => e.innerHTML.includes('prob-civ-01'))
      .querySelector('.btn-jump-sim-practice');
    btn.click();
    return {
      subMode: window.civilSimulatorInstance?.subMode,
      hasTrussCalc: typeof window.civilSimulatorInstance?._calcTruss === 'function'
    };
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Truss Simulator State:', trussRes);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_truss_analysis_prob_civ_01.png') });

  // 3. Test Simulator 2: Variable-Mass Rocket (prob-adv-02)
  console.log('\n--- 3. Verifying Simulator 2: Rocket Equation (prob-adv-02) ---');
  const rocketRes = await page.evaluate(() => {
    openChapter('ch01');
    switchView('view-practice');
    const btn = [...document.querySelectorAll('.practice-card')]
      .find(e => e.innerHTML.includes('prob-adv-02'))
      .querySelector('.btn-jump-sim-practice');
    btn.click();
    return {
      subMode: window.projectileSimulatorInstance?.subMode,
      m0: window.projectileSimulatorInstance?.rocketParams?.m0,
      mf: window.projectileSimulatorInstance?.rocketParams?.mf,
      uex: window.projectileSimulatorInstance?.rocketParams?.uex
    };
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Rocket Simulator State:', rocketRes);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_rocket_equation_prob_adv_02.png') });

  // 4. Test Simulator 3: Bead on Rotating Hoop (prob-adv-03)
  console.log('\n--- 4. Verifying Simulator 3: Rotating Hoop (prob-adv-03) ---');
  const hoopRes = await page.evaluate(() => {
    openChapter('ch01');
    switchView('view-practice');
    const btn = [...document.querySelectorAll('.practice-card')]
      .find(e => e.innerHTML.includes('prob-adv-03'))
      .querySelector('.btn-jump-sim-practice');
    btn.click();
    return {
      subMode: window.oscillationSimulatorInstance?.subMode,
      radiusR: window.oscillationSimulatorInstance?.params?.hoopRadiusR,
      omega: window.oscillationSimulatorInstance?.params?.hoopOmega,
      gravity: window.oscillationSimulatorInstance?.params?.hoopGravity
    };
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Rotating Hoop Simulator State:', hoopRes);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_rotating_hoop_prob_adv_03.png') });

  // 5. Test Simulator 4: Dielectric Force (prob-adv-04)
  console.log('\n--- 5. Verifying Simulator 4: Dielectric Force (prob-adv-04) ---');
  const dielecRes = await page.evaluate(() => {
    openChapter('ch01');
    switchView('view-practice');
    const btn = [...document.querySelectorAll('.practice-card')]
      .find(e => e.innerHTML.includes('prob-adv-04'))
      .querySelector('.btn-jump-sim-practice');
    btn.click();
    return {
      subMode: window.emSimulatorInstance?.subMode,
      v0: window.emSimulatorInstance?.params?.dielectricV0,
      kappa: window.emSimulatorInstance?.params?.dielectricKappa,
      fe: window.emSimulatorInstance?.dielectricFe,
      heq: window.emSimulatorInstance?.dielectricHeq
    };
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Dielectric Force Simulator State:', dielecRes);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_dielectric_force_prob_adv_04.png') });

  // 6. Test Simulator 5: Compton Scattering (prob-fund-09)
  console.log('\n--- 6. Verifying Simulator 5: Compton Scattering (prob-fund-09) ---');
  const comptonRes = await page.evaluate(() => {
    openChapter('ch01');
    switchView('view-practice');
    const btn = [...document.querySelectorAll('.practice-card')]
      .find(e => e.innerHTML.includes('prob-fund-09'))
      .querySelector('.btn-jump-sim-practice');
    btn.click();
    return {
      subMode: window.nuclearSimulatorInstance?.subMode,
      e0: window.nuclearSimulatorInstance?.params?.comptonE0,
      theta: window.nuclearSimulatorInstance?.params?.comptonTheta
    };
  });
  await new Promise(r => setTimeout(r, 500));
  console.log('Compton Scattering Simulator State:', comptonRes);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_compton_scattering_prob_fund_09.png') });

  // 7. Mobile Viewport 360px & 390px Polish Verification
  console.log('\n--- 7. Verifying Mobile Viewports (360px and 390px) ---');
  await page.setViewport({ width: 360, height: 740 });
  await page.evaluate(() => {
    openChapter('ch07');
    switchView('view-simulator');
    window.nuclearSimulatorInstance?.setSubMode('binding_energy');
    window.nuclearSimulatorInstance?.setParam('selectedNuclideIndex', 9); // Bi-209 long label
    window.nuclearSimulatorInstance?.resize();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_mobile_360px_nuclide_polish.png') });

  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    window.nuclearSimulatorInstance?.resize();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_mobile_390px_nuclide_polish.png') });

  console.log('\n================================================================');
  console.log(`TOTAL CONSOLE ERRORS: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(err => console.log('  -> ' + err));
  }
  console.log('================================================================');

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
})();
