const path = require('path');
const fs = require('fs');
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  try {
    puppeteer = require('./node_modules/puppeteer-core');
  } catch (e2) {
    puppeteer = require('../node_modules/puppeteer-core');
  }
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8089/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\live_verification';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('=== STARTING TRI-PILLAR LIVE VERIFICATION ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  console.log(`Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  const report = {
    url: TARGET_URL,
    timestamp: new Date().toISOString(),
    consoleErrors: consoleErrors,
    checks: {}
  };

  // 1. Dynamic Crystalline Background Check
  console.log('\n--- 1. Dynamic Crystalline Mesh Background ---');
  const bgCheck = await page.evaluate(() => {
    const canvas = document.getElementById('bg-crystal-canvas');
    if (!canvas) return { ok: false, error: 'Canvas not found' };
    const rect = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(canvas);
    return {
      ok: rect.width > 0 && rect.height > 0 && style.display !== 'none',
      width: rect.width,
      height: rect.height,
      opacity: style.opacity,
      hasEngine: typeof window.DynamicCrystals !== 'undefined'
    };
  });
  report.checks.dynamicBackground = bgCheck;
  console.log('Background Canvas:', bgCheck);

  // 2. Top Header & Hamburger Menu
  console.log('\n--- 2. Top Header & Hamburger Menu ---');
  const headerCheck = await page.evaluate(() => {
    const hamburger = document.getElementById('btn-hamburger-menu');
    const header = document.querySelector('.app-header');
    const mobileBtn = document.getElementById('btn-mobile-access');
    const mobileModal = document.getElementById('mobile-access-modal');
    
    // Check bars widths
    const barTop = document.querySelector('.hamburger-bars .bar-top');
    const barMid = document.querySelector('.hamburger-bars .bar-mid');
    const barBot = document.querySelector('.hamburger-bars .bar-bot');
    
    const topW = barTop ? window.getComputedStyle(barTop).width : null;
    const midW = barMid ? window.getComputedStyle(barMid).width : null;
    const botW = barBot ? window.getComputedStyle(barBot).width : null;

    // Check for any remaining "พร้อมใช้งาน" or "Active" text
    const textAll = document.body.innerText;
    const hasActiveText = textAll.includes('พร้อมใช้งาน') || textAll.includes('(Active)');

    return {
      hamburgerExists: !!hamburger,
      hamburgerInHeader: !!(header && header.contains(hamburger)),
      mobileBtnExists: !!mobileBtn,
      mobileModalExists: !!mobileModal,
      barTopWidth: topW,
      barMidWidth: midW,
      barBotWidth: botW,
      midIsLongest: (parseFloat(midW) > parseFloat(topW)) && (parseFloat(midW) > parseFloat(botW)),
      hasActiveText: hasActiveText
    };
  });
  report.checks.headerAndMenu = headerCheck;
  console.log('Header & Menu:', headerCheck);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_header_landing.png') });

  // 3. Step Navigation Button Styling in View 3 (Simulator)
  console.log('\n--- 3. Step Navigation Button (.btn-prev-step) ---');
  await page.evaluate(() => {
    window.openChapter('ch01');
    window.switchView('view-simulator');
  });
  await new Promise(r => setTimeout(r, 600));

  const stepNavCheck = await page.evaluate(() => {
    const prevBtn = document.querySelector('.tab-step-nav-bar .btn-prev-step');
    if (!prevBtn) return { ok: false, error: 'btn-prev-step not found' };
    const style = window.getComputedStyle(prevBtn);
    return {
      ok: true,
      text: prevBtn.innerText.trim(),
      color: style.color,
      backgroundColor: style.backgroundColor,
      borderRadius: style.borderRadius,
      border: style.border
    };
  });
  report.checks.stepNavButton = stepNavCheck;
  console.log('Step Nav Button:', stepNavCheck);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_simulator_step_nav_prev_btn.png') });

  // 4. Chapter 5 1D Heat Conduction Diagram Layout
  console.log('\n--- 4. Chapter 5 Heat Conduction Diagram ---');
  await page.evaluate(() => {
    window.openChapter('ch05');
    window.switchView('view-theory');
  });
  await new Promise(r => setTimeout(r, 600));

  const thermoDiagramCheck = await page.evaluate(() => {
    const svg = document.querySelector('svg.theory-diagram-svg') || document.querySelector('.theory-diagram-box svg');
    if (!svg) return { ok: false, error: 'SVG conduction diagram not found' };
    const texts = Array.from(svg.querySelectorAll('text')).map(t => ({
      text: t.textContent.trim(),
      x: t.getAttribute('x'),
      y: t.getAttribute('y')
    }));
    return {
      ok: true,
      viewBox: svg.getAttribute('viewBox'),
      textCount: texts.length,
      sampleTexts: texts.slice(0, 5)
    };
  });
  report.checks.thermoDiagram = thermoDiagramCheck;
  console.log('Thermo Conduction Diagram:', thermoDiagramCheck);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_ch05_heat_conduction_diagram.png') });

  // 5. Chapter Summary & Synthesis Cards in View 5
  console.log('\n--- 5. Chapter Summary & Synthesis Matrix ---');
  await page.evaluate(() => {
    window.switchView('view-summary');
  });
  await new Promise(r => setTimeout(r, 600));

  const summaryCheck = await page.evaluate(() => {
    const toolbar = document.querySelector('.summary-filter-toolbar');
    const filterBtns = toolbar ? Array.from(toolbar.querySelectorAll('.summary-filter-btn')).map(b => b.textContent.trim()) : [];
    const cards = Array.from(document.querySelectorAll('.summary-card')).map(c => ({
      type: c.dataset.summaryType,
      title: c.querySelector('.summary-card-title')?.textContent.trim()
    }));
    return {
      ok: cards.length >= 6,
      cardCount: cards.length,
      filters: filterBtns,
      cards: cards
    };
  });
  report.checks.chapterSummary = summaryCheck;
  console.log('Chapter Summary:', summaryCheck);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_summary_synthesis_cards.png') });

  // 6. Practice Problem Bank & Dual Methodology Tabs
  console.log('\n--- 6. Practice Problem Bank & Dual Methodology ---');
  await page.evaluate(() => {
    window.switchView('view-practice');
  });
  await new Promise(r => setTimeout(r, 600));

  const practiceCheck = await page.evaluate(() => {
    const cards = document.querySelectorAll('.practice-card');
    const dualCards = [];
    cards.forEach(c => {
      const probId = c.dataset.probId;
      const tabs = c.querySelectorAll('.method-tab-btn');
      if (tabs.length === 2) {
        dualCards.push(probId);
      }
    });

    // Expand solution on first dual-method card
    const firstDualId = dualCards[0] || 'prob-ch01-01';
    const toggleBtn = document.querySelector(`.btn-toggle-solution[data-prob-id="${firstDualId}"]`);
    if (toggleBtn) toggleBtn.click();

    return {
      totalProblems: cards.length,
      dualMethodCount: dualCards.length,
      dualCardIds: dualCards
    };
  });
  await new Promise(r => setTimeout(r, 400));
  report.checks.practiceBank = practiceCheck;
  console.log('Practice Problem Bank:', practiceCheck);

  // Click Method 2 tab to verify alternative toggle
  await page.evaluate(() => {
    const m2Btn = document.querySelector('.method-tab-btn[data-method="2"]');
    if (m2Btn) m2Btn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_practice_dual_method_tabs.png') });

  // 7. Mobile Viewport (390 x 844) Inspection
  console.log('\n--- 7. Mobile Viewport Inspection ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    window.switchView('view-landing');
  });
  await new Promise(r => setTimeout(r, 500));

  const mobileCheck = await page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const winWidth = window.innerWidth;
    const hamburger = document.getElementById('btn-hamburger-menu');
    return {
      ok: docWidth <= winWidth + 2, // no significant horizontal overflow
      scrollWidth: docWidth,
      viewportWidth: winWidth,
      hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== 'none' : false
    };
  });
  report.checks.mobileLayout = mobileCheck;
  console.log('Mobile Layout:', mobileCheck);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_mobile_landing_header.png') });

  await browser.close();

  // Write verification report
  const reportPath = path.join(SCREENSHOT_DIR, 'verification_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('\n=== VERIFICATION COMPLETE. Report saved to:', reportPath);
  console.log('Total Console Errors:', consoleErrors.length);
})();
