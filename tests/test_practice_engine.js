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
  console.log('STARTING TRI-PILLAR VERIFICATION: PRACTICE PROBLEMS & SOLUTIONS');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('[Console Error] ' + msg.text());
    }
  });
  page.on('pageerror', err => errors.push('[Page Error] ' + err.message));

  // 1. Desktop Viewport
  console.log('\n--- 1. Testing Desktop Viewport (1440x900) & Initial Practice View ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Switch to practice view
  await page.evaluate(() => {
    window.switchView('view-practice');
  });
  await new Promise(r => setTimeout(r, 500));

  // Check view status and problem count
  const initialStatus = await page.evaluate(() => {
    const view = document.getElementById('view-practice');
    const tab = document.getElementById('tab-practice');
    const cards = document.querySelectorAll('.practice-card');
    const scoreEl = document.getElementById('practice-score-display');
    const totalEl = document.getElementById('practice-total-display');
    return {
      viewActive: view ? view.classList.contains('active') : false,
      tabActive: tab ? tab.classList.contains('active') : false,
      totalCards: cards.length,
      score: scoreEl ? scoreEl.textContent : null,
      total: totalEl ? totalEl.textContent : null
    };
  });
  console.log('Initial Practice Status:', JSON.stringify(initialStatus));

  // 2. Answer Question 1 Correctly (prob-ch01-01 -> Option 0)
  console.log('\n--- 2. Answering Question 1 (Correct choice: Option 0) ---');
  const q1Result = await page.evaluate(() => {
    const opt0 = document.querySelector('#prob-card-prob-ch01-01 .practice-option-item[data-opt-idx="0"]');
    if (!opt0) return { error: 'Option 0 not found' };
    opt0.click();

    const freshCard = document.getElementById('prob-card-prob-ch01-01');
    const freshOpt0 = freshCard ? freshCard.querySelector('.practice-option-item[data-opt-idx="0"]') : null;
    const solBox = document.getElementById('sol-box-prob-ch01-01');
    return {
      cardHasCorrectClass: freshCard ? freshCard.classList.contains('answered-correct') : false,
      opt0HasCorrectClass: freshOpt0 ? freshOpt0.classList.contains('correct') : false,
      solBoxDisplay: solBox ? solBox.style.display : null,
      scoreNow: document.getElementById('practice-score-display')?.textContent
    };
  });
  console.log('Question 1 Answer Result:', JSON.stringify(q1Result));

  // 3. Answer Question 2 Incorrectly (prob-ch02-01 -> Option 0 is wrong, correct is Option 1)
  console.log('\n--- 3. Answering Question 2 Incorrectly to test error detection & feedback ---');
  const q2Result = await page.evaluate(() => {
    const opt0 = document.querySelector('#prob-card-prob-ch02-01 .practice-option-item[data-opt-idx="0"]'); // Incorrect
    if (!opt0) return { error: 'Option 0 not found' };
    opt0.click();

    const freshCard = document.getElementById('prob-card-prob-ch02-01');
    const freshOpt0 = freshCard ? freshCard.querySelector('.practice-option-item[data-opt-idx="0"]') : null;
    const freshOpt1 = freshCard ? freshCard.querySelector('.practice-option-item[data-opt-idx="1"]') : null;
    const solBox = document.getElementById('sol-box-prob-ch02-01');
    return {
      cardHasIncorrectClass: freshCard ? freshCard.classList.contains('answered-incorrect') : false,
      opt0HasIncorrectClass: freshOpt0 ? freshOpt0.classList.contains('incorrect') : false,
      opt1HasCorrectClass: freshOpt1 ? freshOpt1.classList.contains('correct') : false,
      solBoxDisplay: solBox ? solBox.style.display : null,
      scoreNow: document.getElementById('practice-score-display')?.textContent
    };
  });
  console.log('Question 2 Answer Result:', JSON.stringify(q2Result));

  // 4. Answer Question 3 Correctly (prob-ch03-01 -> Option 2)
  console.log('\n--- 4. Answering Question 3 (Correct choice: Option 2) ---');
  const q3Result = await page.evaluate(() => {
    const opt2 = document.querySelector('#prob-card-prob-ch03-01 .practice-option-item[data-opt-idx="2"]');
    if (!opt2) return { error: 'Option 2 not found' };
    opt2.click();

    const freshCard = document.getElementById('prob-card-prob-ch03-01');
    const freshOpt2 = freshCard ? freshCard.querySelector('.practice-option-item[data-opt-idx="2"]') : null;
    return {
      cardHasCorrectClass: freshCard ? freshCard.classList.contains('answered-correct') : false,
      opt2HasCorrectClass: freshOpt2 ? freshOpt2.classList.contains('correct') : false,
      scoreNow: document.getElementById('practice-score-display')?.textContent
    };
  });
  console.log('Question 3 Answer Result:', JSON.stringify(q3Result));

  // 5. Test Solution Toggle Button on Question 1
  console.log('\n--- 5. Testing Solution Toggle (Show/Hide) on Question 1 ---');
  const toggleResult = await page.evaluate(() => {
    const toggleBtn = document.querySelector('.btn-toggle-solution[data-prob-id="prob-ch01-01"]');
    const solBox = document.getElementById('sol-box-prob-ch01-01');
    if (!toggleBtn || !solBox) return { error: 'Toggle button or sol box not found' };

    // Currently open, click to hide
    toggleBtn.click();
    const hiddenDisplay = solBox.style.display;
    const btnText1 = toggleBtn.textContent.trim();

    // Click again to show
    toggleBtn.click();
    const visibleDisplay = solBox.style.display;
    const btnText2 = toggleBtn.textContent.trim();

    return { hiddenDisplay, btnText1, visibleDisplay, btnText2 };
  });
  console.log('Solution Toggle Result:', JSON.stringify(toggleResult));

  // 6. Test Track Filtering (Civil Engineering track)
  console.log('\n--- 6. Testing Track Filter Tabs & Civil Engineering Problems ---');
  await page.click('.practice-tab-btn[data-track="civil"]');
  await new Promise(r => setTimeout(r, 300));

  const civilTrackResult = await page.evaluate(() => {
    const cards = document.querySelectorAll('.practice-card');
    const totalEl = document.getElementById('practice-total-display');

    // Answer Problem 9 (prob-civ-01 -> Option 1: Tension 36.1 kN)
    const opt1 = document.querySelector('#prob-card-prob-civ-01 .practice-option-item[data-opt-idx="1"]');
    if (opt1) opt1.click();

    const freshCardCiv1 = document.getElementById('prob-card-prob-civ-01');
    return {
      visibleCards: cards.length,
      totalEl: totalEl ? totalEl.textContent : null,
      probCiv1AnsweredCorrect: freshCardCiv1 ? freshCardCiv1.classList.contains('answered-correct') : false,
      scoreNow: document.getElementById('practice-score-display')?.textContent
    };
  });
  console.log('Civil Track Filter & Answer Result:', JSON.stringify(civilTrackResult));

  // 6.1 Test Advanced Track & Answer Tsiolkovsky Rocket Question (prob-adv-02 -> Option 1)
  console.log('\n--- 6.1 Testing Advanced Track & University Problems (Rocket Eq) ---');
  await page.click('.practice-tab-btn[data-track="advanced"]');
  await new Promise(r => setTimeout(r, 300));

  const advTrackResult = await page.evaluate(() => {
    const cards = document.querySelectorAll('.practice-card');
    const opt1 = document.querySelector('#prob-card-prob-adv-02 .practice-option-item[data-opt-idx="1"]');
    if (opt1) opt1.click();

    const freshCardAdv2 = document.getElementById('prob-card-prob-adv-02');
    const solBoxAdv2 = document.getElementById('sol-box-prob-adv-02');
    return {
      visibleAdvancedCards: cards.length,
      adv2AnsweredCorrect: freshCardAdv2 ? freshCardAdv2.classList.contains('answered-correct') : false,
      solBoxDisplayed: solBoxAdv2 ? solBoxAdv2.style.display : null,
      scoreNow: document.getElementById('practice-score-display')?.textContent
    };
  });
  console.log('Advanced Track & Rocket Eq Result:', JSON.stringify(advTrackResult));

  // Switch back to all tracks
  await page.click('.practice-tab-btn[data-track="all"]');
  await new Promise(r => setTimeout(r, 400));

  // Capture Screenshot 1: Desktop Practice Answering & Solutions
  const p1 = path.join(SCREENSHOT_DIR, '19_desktop_practice_engine_answering_1440px.png');
  await page.screenshot({ path: p1, fullPage: false });
  console.log('Saved screenshot:', p1);

  // 7. Mobile Viewport Test (390x844)
  console.log('\n--- 7. Testing Mobile Viewport (390x844) ---');
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 500));

  // Capture Screenshot 2: Mobile Practice Engine
  const p2 = path.join(SCREENSHOT_DIR, '20_mobile_practice_engine_390px.png');
  await page.screenshot({ path: p2, fullPage: false });
  console.log('Saved screenshot:', p2);

  // 8. Test Simulator Jump from Problem
  console.log('\n--- 8. Testing Simulator Jump from Problem ---');
  await page.setViewport({ width: 1440, height: 900 });
  const jumpResult = await page.evaluate(() => {
    const jumpBtn = document.querySelector('.btn-jump-sim-practice[data-chapter="ch01"]');
    if (!jumpBtn) return { error: 'Jump button not found' };
    jumpBtn.click();
    return { clicked: true };
  });
  console.log('Jump Clicked:', JSON.stringify(jumpResult));
  await new Promise(r => setTimeout(r, 500));

  const viewAfterJump = await page.evaluate(() => {
    const simView = document.getElementById('view-simulator');
    return {
      simViewActive: simView ? simView.classList.contains('active') : false
    };
  });
  console.log('View after Simulator Jump:', JSON.stringify(viewAfterJump));

  // Switch back to practice view
  await page.evaluate(() => {
    window.switchView('view-practice');
  });
  await new Promise(r => setTimeout(r, 400));

  // 9. Final Score & Errors Verification
  const finalSummary = await page.evaluate(() => {
    const score = document.getElementById('practice-score-display')?.textContent;
    const total = document.getElementById('practice-total-display')?.textContent;
    return { score, total };
  });
  console.log('\nFinal Verified Practice Summary:', JSON.stringify(finalSummary));

  console.log('\n================================================================');
  console.log('TOTAL CONSOLE ERRORS: ' + errors.length);
  if (errors.length > 0) {
    errors.forEach(e => console.error('  ->', e));
  } else {
    console.log('>> ALL CONSOLE AND RUNTIME CHECKS PASSED WITH ZERO ERRORS (0)! <<');
  }
  console.log('================================================================');

  await browser.close();
  process.exit(errors.length === 0 ? 0 : 1);
})();
