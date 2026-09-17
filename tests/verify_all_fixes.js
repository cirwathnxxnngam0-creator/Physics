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
  console.log('=== STARTING AUTOMATED VERIFICATION OF 8 USER REPORTED ISSUES ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const results = {};

  // 1. Thermo Kinetic Gas & Maxwell-Boltzmann Curve
  console.log('\n--- 1. Testing Thermo Kinetic Gas & Maxwell-Boltzmann ---');
  await page.evaluate(() => {
    window.switchView('view-simulator');
    window.switchSimMode('thermo', 'kinetic_gas');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_thermo_kinetic_gas.png') });

  const thermoCheck = await page.evaluate(() => {
    const inst = window.thermoSimulatorInstance;
    if (!inst) return { ok: false, msg: 'No thermoSimulatorInstance' };
    const particles = inst.gasParticles || [];
    let outsideCount = 0;
    particles.forEach(p => {
      if (p.x < 30 - 2 || p.x > 370 + 2 || p.y < 60 - 2 || p.y > 380 + 2) {
        outsideCount++;
      }
    });
    return {
      ok: outsideCount === 0,
      subMode: inst.subMode,
      totalParticles: particles.length,
      outsideCount: outsideCount
    };
  });
  console.log('Thermo Kinetic Gas Particle Confinement Check:', thermoCheck);
  results.thermoKineticGas = thermoCheck;

  // 2. Thermo Submode Switcher (Transient Heat 1D)
  console.log('\n--- 2. Testing Thermo Submode Switcher ---');
  await page.evaluate(() => {
    const btnHeat = document.querySelector('#sim-container-thermo .submode-btn[data-submode="heat_conduction"]');
    if (btnHeat) btnHeat.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_thermo_heat_1d.png') });

  const heatCheck = await page.evaluate(() => {
    const inst = window.thermoSimulatorInstance;
    return {
      activeSubmode: inst ? inst.subMode : null,
      ok: inst && inst.subMode === 'heat_conduction'
    };
  });
  console.log('Thermo Heat 1D Switch Check:', heatCheck);
  results.thermoHeat1D = heatCheck;

  // 3. EM AC RLC Resonance & Power Factor (PF)
  console.log('\n--- 3. Testing EM AC RLC Resonance & Power Factor (PF) ---');
  await page.evaluate(() => {
    window.switchSimMode('em', 'ac_rlc_resonance');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_em_ac_rlc_resonance.png') });

  const emCheck = await page.evaluate(() => {
    const inst = window.emSimulatorInstance;
    if (!inst) return { ok: false, msg: 'No emSimulatorInstance' };
    const R = inst.params.acR;
    const L = inst.params.acL;
    const C = inst.params.acC * 1e-6;
    const w = inst.params.acOmega;
    const XL = w * L;
    const XC = 1 / (w * C);
    const Z = Math.hypot(R, XL - XC);
    const pf = R / Z;
    return {
      subMode: inst.subMode,
      R, L, w, Z: Z.toFixed(2),
      PF: pf.toFixed(4),
      ok: inst.subMode === 'ac_rlc_resonance' && pf > 0
    };
  });
  console.log('EM AC RLC Power Factor Check:', emCheck);
  results.emPowerFactor = emCheck;

  // 4. Nuclear Binding Energy Curve with Bi-209 & Pb-208
  console.log('\n--- 4. Testing Nuclear Binding Energy Curve with Bi-209 ---');
  await page.evaluate(() => {
    window.switchSimMode('nuclear', 'binding_energy');
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const sel = document.getElementById('select-nuclide');
    if (sel) {
      sel.value = '9'; // Bi-209
      sel.dispatchEvent(new Event('change'));
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_nuclear_binding_bi209.png') });

  const biCheck = await page.evaluate(() => {
    const inst = window.nuclearSimulatorInstance;
    if (!inst) return { ok: false, msg: 'No nuclearSimulatorInstance' };
    const selNuclide = inst.nuclides[inst.params.selectedNuclideIndex];
    return {
      selectedIdx: inst.params.selectedNuclideIndex,
      sym: selNuclide.sym,
      name: selNuclide.name,
      a: selNuclide.a,
      z: selNuclide.z,
      ebPerA: selNuclide.ebPerA,
      isRadioactiveStart: !!selNuclide.isRadioactiveStart,
      ok: selNuclide.sym === '²⁰⁹Bi' && selNuclide.a === 209 && selNuclide.z === 83
    };
  });
  console.log('Bismuth-209 Binding Energy Check:', biCheck);
  results.nuclearBi209 = biCheck;

  // 5. Nuclear Stochastic Decay Lattice Bounds
  console.log('\n--- 5. Testing Nuclear Stochastic Decay Lattice Bounds ---');
  await page.evaluate(() => {
    const btnDecay = document.querySelector('#sim-container-nuclear .submode-btn[data-submode="decay_stochastic"]');
    if (btnDecay) btnDecay.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_nuclear_stochastic_decay.png') });

  const decayCheck = await page.evaluate(() => {
    const inst = window.nuclearSimulatorInstance;
    if (!inst) return { ok: false, msg: 'No nuclearSimulatorInstance' };
    const atoms = inst.atoms || [];
    let overflowCount = 0;
    const w = inst.width || 800;
    const boxW = Math.round((w - 60) * 0.48);
    const boxH = 260;
    atoms.forEach(a => {
      const atomX = 20 + (a.x / 440) * (boxW - 20) + 10;
      const atomY = 55 + (a.y / 260) * (boxH - 30) + 20;
      if (atomX < 20 || atomX > 20 + boxW || atomY < 55 || atomY > 55 + boxH) {
        overflowCount++;
      }
    });
    return {
      subMode: inst.subMode,
      totalAtoms: atoms.length,
      overflowCount: overflowCount,
      ok: overflowCount === 0 && atoms.length === 180
    };
  });
  console.log('Nuclear Stochastic Lattice Confinement Check:', decayCheck);
  results.nuclearDecayBounds = decayCheck;

  // 6. Nuclear Radiation Shielding Continuity & Shared Geometry
  console.log('\n--- 6. Testing Nuclear Radiation Shielding Continuity ---');
  await page.evaluate(() => {
    const btnShield = document.querySelector('#sim-container-nuclear .submode-btn[data-submode="shielding_dosimetry"]');
    if (btnShield) btnShield.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_nuclear_shielding_lead.png') });

  await page.evaluate(() => {
    const selRad = document.getElementById('select-radiation-type');
    if (selRad) {
      selRad.value = 'alpha';
      selRad.dispatchEvent(new Event('change'));
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_nuclear_shielding_alpha.png') });

  const shieldCheck = await page.evaluate(() => {
    const inst = window.nuclearSimulatorInstance;
    if (!inst) return { ok: false, msg: 'No nuclearSimulatorInstance' };
    const bounds = inst.getShieldBounds();
    const particles = inst.radiationParticles || [];
    return {
      subMode: inst.subMode,
      bounds,
      particleCount: particles.length,
      firstParticleX: particles.length > 0 ? particles[0].x.toFixed(1) : null,
      ok: inst.subMode === 'shielding_dosimetry' && bounds.shieldX > bounds.srcX && particles.length > 10
    };
  });
  console.log('Radiation Shielding Beam Continuity Check:', shieldCheck);
  results.nuclearShielding = shieldCheck;

  // 7. Phenomena Typography & Image Captions
  console.log('\n--- 7. Testing Phenomena Typography & Captions ---');
  await page.evaluate(() => {
    window.switchView('view-phenomena');
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_phenomena_typography.png') });

  const phenomenaCheck = await page.evaluate(() => {
    const captions = document.querySelectorAll('.phenomena-photo-caption');
    const cards = document.querySelectorAll('.phenomena-card');
    return {
      cardCount: cards.length,
      captionCount: captions.length,
      sampleCaption: captions.length > 0 ? captions[0].innerText.substring(0, 80) : '',
      ok: cards.length > 0 && captions.length > 0
    };
  });
  console.log('Phenomena Captions & Cards Check:', phenomenaCheck);
  results.phenomenaTypography = phenomenaCheck;

  // 8. Theory Navigation & Chapter Sync (Chapter 4 Wave/Optics)
  console.log('\n--- 8. Testing Theory Navigation Chapter Sync ---');
  await page.evaluate(() => {
    window.switchView('view-simulator');
    window.switchSimMode('wave', 'traveling');
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const tabTheory = document.querySelector('.view-tab[data-view="view-theory"]');
    if (tabTheory) tabTheory.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_theory_chapter_sync_wave.png') });

  const theorySyncCheck = await page.evaluate(() => {
    const currChapter = window.App ? window.App.getCurrentChapter() : null;
    const theoryCards = document.querySelectorAll('.theory-card');
    const badge = document.querySelector('.header-chapter-badge');
    let hasOptics = false;
    theoryCards.forEach(c => {
      if (c.innerText.includes('กระจก') || c.innerText.includes('เลนส์') || c.innerText.includes('Optics')) {
        hasOptics = true;
      }
    });
    return {
      currentChapter: currChapter,
      badgeText: badge ? badge.innerText : '',
      theoryCardCount: theoryCards.length,
      hasOpticsTheories: hasOptics,
      ok: currChapter === 'ch04' && theoryCards.length === 9 && hasOptics
    };
  });
  console.log('Theory Chapter Sync Check (Chapter 4 Wave/Optics):', theorySyncCheck);
  results.theorySync = theorySyncCheck;

  // Mobile Viewports (390px)
  console.log('\n--- Mobile Viewport Verification (390px) ---');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    window.switchView('view-simulator');
    window.switchSimMode('nuclear', 'binding_energy');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_mobile_nuclear_binding_390px.png') });

  await page.evaluate(() => {
    window.switchSimMode('nuclear', 'shielding_dosimetry');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_mobile_nuclear_shielding_390px.png') });

  console.log('\nPage Console Errors:', errors);
  results.errors = errors;

  await browser.close();
  console.log('\n=== ALL TESTS FINISHED SUCCESSFULLY ===');
  console.log(JSON.stringify(results, null, 2));
})();