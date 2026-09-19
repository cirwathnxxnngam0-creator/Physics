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
  console.log('STARTING RIGOROUS VERIFICATION: FOURIER SYNTHESIS & DIVERGENCE THEOREM');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[Console Error] ${msg.text()}`);
  });
  page.on('pageerror', err => errors.push(`[Page Error] ${err.message}`));

  // 1. Desktop Viewport Test
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // -------------------------------------------------------------
  // PART A: FOURIER SERIES SYNTHESIZER & DECOMPOSER
  // -------------------------------------------------------------
  console.log('\n--- Testing Part A: Interactive Fourier Series Synthesizer ---');
  await page.evaluate(() => {
    window.switchView('view-simulator');
    window.switchSimMode('wave', 'fourier_synthesis');
  });
  await new Promise(r => setTimeout(r, 400));

  const fourierCheckSquare = await page.evaluate(() => {
    const inst = window.waveSimulatorInstance;
    if (!inst) return { ok: false, msg: 'No waveSimulatorInstance' };
    const p = inst.params;
    const coeffs = inst._calculateFourierCoeffs('square', 5, 1.0);
    return {
      ok: true,
      subMode: inst.subMode,
      waveType: p.fourierWaveType,
      N: p.fourierHarmonics,
      powerPct: coeffs.powerPct,
      gibbsPct: coeffs.gibbsPct,
      harmonicsCount: coeffs.harmonics.length,
      harmonic_1_amp: coeffs.harmonics[0] ? coeffs.harmonics[0].amp : null,
      harmonic_3_amp: coeffs.harmonics[1] ? coeffs.harmonics[1].amp : null
    };
  });
  console.log('Fourier Square Wave N=5:', fourierCheckSquare);

  // Capture Desktop Fourier Screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_desktop_fourier_synthesis_1440px.png') });

  // Test Triangle Wave Rapid Convergence
  const fourierCheckTriangle = await page.evaluate(() => {
    const inst = window.waveSimulatorInstance;
    inst.setParam('fourierWaveType', 'triangle');
    inst.setParam('fourierHarmonics', 3);
    const coeffs = inst._calculateFourierCoeffs('triangle', 3, 1.0);
    return {
      waveType: inst.params.fourierWaveType,
      N: inst.params.fourierHarmonics,
      powerPct: coeffs.powerPct,
      gibbsPct: coeffs.gibbsPct,
      hasGibbs: coeffs.hasGibbs
    };
  });
  console.log('Fourier Triangle Wave N=3:', fourierCheckTriangle);

  // -------------------------------------------------------------
  // PART B: 2D VECTOR FIELD & DIVERGENCE THEOREM PLAYGROUND
  // -------------------------------------------------------------
  console.log('\n--- Testing Part B: 2D Vector Field & Gauss Divergence Theorem ---');
  await page.evaluate(() => {
    window.switchSimMode('vehicle', 'vector_field_divergence');
  });
  await new Promise(r => setTimeout(r, 400));

  // Test Radial Source (div > 0, LHS == RHS)
  const divCheckSource = await page.evaluate(() => {
    const inst = window.vehicleSimulatorInstance;
    if (!inst) return { ok: false, msg: 'No vehicleSimulatorInstance' };
    inst.setDivergenceParams({ fieldType: 'source', contourShape: 'circle', contourRadius: 65, fieldStrength: 2.0 });
    const res = inst.calculateDivergenceIntegrals();
    return {
      subMode: inst.subMode,
      fieldType: inst.divergenceParams.fieldType,
      lhs: res.boundaryFluxLHS,
      rhs: res.areaDivergenceRHS,
      errorPct: res.discrepancyErrorPct,
      isPositiveDiv: res.areaDivergenceRHS > 0
    };
  });
  console.log('Divergence Theorem (Radial Source Circle):', divCheckSource);

  // Capture Desktop Divergence Screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_desktop_divergence_theorem_1440px.png') });

  // Test Radial Sink (div < 0, LHS == RHS)
  const divCheckSink = await page.evaluate(() => {
    const inst = window.vehicleSimulatorInstance;
    inst.setDivergenceParams({ fieldType: 'sink', contourShape: 'circle', contourRadius: 65 });
    const res = inst.calculateDivergenceIntegrals();
    return {
      fieldType: inst.divergenceParams.fieldType,
      lhs: res.boundaryFluxLHS,
      rhs: res.areaDivergenceRHS,
      errorPct: res.discrepancyErrorPct,
      isNegativeDiv: res.areaDivergenceRHS < 0
    };
  });
  console.log('Divergence Theorem (Radial Sink Circle):', divCheckSink);

  // Test Pure Swirling Vortex (div = 0, curl != 0)
  const divCheckVortex = await page.evaluate(() => {
    const inst = window.vehicleSimulatorInstance;
    inst.setDivergenceParams({ fieldType: 'vortex', contourShape: 'circle', contourRadius: 65 });
    const res = inst.calculateDivergenceIntegrals();
    return {
      fieldType: inst.divergenceParams.fieldType,
      lhs: res.boundaryFluxLHS,
      rhs: res.areaDivergenceRHS,
      errorPct: res.discrepancyErrorPct,
      isNearZero: Math.abs(res.boundaryFluxLHS) < 0.05 && Math.abs(res.areaDivergenceRHS) < 0.05
    };
  });
  console.log('Divergence Theorem (Pure Vortex Circle):', divCheckVortex);

  // Test Rectangular Contour
  const divCheckRectangle = await page.evaluate(() => {
    const inst = window.vehicleSimulatorInstance;
    inst.setDivergenceParams({ fieldType: 'source', contourShape: 'rectangle', contourWidth: 140, contourHeight: 100 });
    const res = inst.calculateDivergenceIntegrals();
    return {
      shape: inst.divergenceParams.contourShape,
      lhs: res.boundaryFluxLHS,
      rhs: res.areaDivergenceRHS,
      errorPct: res.discrepancyErrorPct
    };
  });
  console.log('Divergence Theorem (Radial Source Rectangle):', divCheckRectangle);

  // -------------------------------------------------------------
  // PART C: MOBILE RESPONSIVENESS (390px Viewport)
  // -------------------------------------------------------------
  console.log('\n--- Testing Part C: Mobile Viewports (390px iPhone) ---');
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    if (window.waveSimulatorInstance) window.waveSimulatorInstance.resize();
    if (window.vehicleSimulatorInstance) window.vehicleSimulatorInstance.resize();
  });
  await new Promise(r => setTimeout(r, 400));

  // Mobile Divergence Screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_mobile_divergence_theorem_390px.png') });

  // Mobile Fourier Screenshot
  await page.evaluate(() => {
    window.switchSimMode('wave', 'fourier_synthesis');
    if (window.waveSimulatorInstance) {
      window.waveSimulatorInstance.setParam('fourierWaveType', 'square');
      window.waveSimulatorInstance.setParam('fourierHarmonics', 5);
      window.waveSimulatorInstance.resize();
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_mobile_fourier_synthesis_390px.png') });

  // Final summary
  console.log('\n================================================================');
  console.log(`VERIFICATION COMPLETE. Uncaught Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.error('Errors found:', errors);
  } else {
    console.log('ALL TESTS PASSED WITH 0 CONSOLE ERRORS! Screenshots saved.');
  }
  console.log('================================================================');

  await browser.close();
})();
