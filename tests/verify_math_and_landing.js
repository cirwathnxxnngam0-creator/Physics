/**
 * verify_math_and_landing.js - Puppeteer Verification Script for Landing Page & Math Content
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://127.0.0.1:8080/';
const SCREENSHOT_DIR = 'C:\\Users\\ACER PREDATOR\\.gemini\\antigravity\\brain\\7214674d-608a-48f6-8f8d-7a378bbed4eb\\screenshots\\math_and_landing';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('Starting verification of Landing Page & Math Content...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.error('[Browser Error]', msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('[Page Error]', err.message);
  });

  // 1. Desktop Landing Page (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_landing_hero.png'), fullPage: false });
  console.log('Saved 01_desktop_landing_hero.png');

  // 2. Mobile Landing Page (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_mobile_landing_hero.png'), fullPage: false });
  console.log('Saved 02_mobile_landing_hero.png');

  // Back to Desktop (1440x900)
  await page.setViewport({ width: 1440, height: 900 });

  // 3. Click Hero Math Button -> navigate to view-analytical
  await page.click('#btn-hero-math-suite');
  await new Promise(r => setTimeout(r, 600));

  // Check how many topics are rendered in view-analytical
  const topicCount = await page.$$eval('.analytical-topic-card', els => els.length);
  console.log(`Rendered topics in view-analytical: ${topicCount}`);
  if (topicCount !== 20) {
    throw new Error(`Expected 20 topics, but found ${topicCount}`);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_desktop_math_view_all_20_topics.png'), fullPage: false });
  console.log('Saved 03_desktop_math_view_all_20_topics.png');

  // Scroll down to view the new vector calculus and PDE topics
  await page.evaluate(() => {
    const el = document.getElementById('topic-AF-10');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_desktop_topic_AF10_vector_calculus.png'), fullPage: false });
  console.log('Saved 04_desktop_topic_AF10_vector_calculus.png');

  // Scroll to topic 12 PDE
  await page.evaluate(() => {
    const el = document.getElementById('topic-AF-12');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_desktop_topic_AF12_canonical_pdes.png'), fullPage: false });
  console.log('Saved 05_desktop_topic_AF12_canonical_pdes.png');

  // Test Topic Category Filter Tab: Click "📐 เวกเตอร์แคลคูลัส & ทฤษฎีบทปริพันธ์"
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 300));
  await page.click('.math-filter-btn[data-filter="vector"]');
  await new Promise(r => setTimeout(r, 400));

  const visibleCards = await page.$$eval('.analytical-topic-card', els => 
    els.filter(e => window.getComputedStyle(e).display !== 'none').length
  );
  console.log(`Visible topics after 'vector' filter: ${visibleCards}`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_desktop_math_filtered_vector.png'), fullPage: false });
  console.log('Saved 06_desktop_math_filtered_vector.png');

  // 4. Return to Chapter Selection and test clicking Card 08 (คณิตสำหรับฟิสิกส์)
  await page.click('#btn-analytical-back-chapter');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_desktop_chapter_select_24grid.png'), fullPage: false });
  console.log('Saved 07_desktop_chapter_select_24grid.png');

  // Click card 08
  await page.click('.bosa-topic-card[data-code="TH-08"]');
  await new Promise(r => setTimeout(r, 500));
  const currentView = await page.evaluate(() => window.PhysicsApp.getCurrentView());
  console.log(`View after clicking Card 08: ${currentView}`);
  if (currentView !== 'view-analytical') {
    throw new Error(`Expected view-analytical, got ${currentView}`);
  }

  // Mobile 390px view of Math Content
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_mobile_math_view_390px.png'), fullPage: false });
  console.log('Saved 08_mobile_math_view_390px.png');

  await browser.close();

  if (errors.length > 0) {
    console.error('Errors encountered:', errors);
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('ALL VERIFICATIONS SUCCESSFUL! 0 ERRORS');
  console.log('======================================================');
}

run().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
