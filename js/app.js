/**
 * app.js - PhysicsNoza 3.0 Main Application Controller
 * Manages view routing, academic tier switching, KaTeX math rendering,
 * Division & Theory curriculum architecture, and simulator lifecycle.
 */

(function () {
  'use strict';

  // Global App State
  let currentView = 'view-theory';
  let currentTier = 'highSchool';
  let activeDivisionFilter = 'all';
  let activeFormulaDivisionFilter = 'all';
  let activeSymbolDomain = 'all';
  let activeRecallMode = false;

  let simulatorInstance = null;           // Mode 1: Projectile
  let vehicleSimulatorInstance = null;     // Mode 2: Racing Car & Vector Field
  let collisionSimulatorInstance = null;   // Mode 3: Collision & Impulse
  let threejsSimulatorInstance = null;     // Mode 4: Three.js 3D Ballistics
  let activeSimMode = 'projectile';        // 'projectile' | 'vehicle' | 'collision' | 'threejs'

  function init() {
    setupViewNavigation();
    setupTierSwitcher();
    renderTheoryContent();
    renderFormulasContent();
    renderPhenomenaContent();
    renderAnalyticalContent();
    initSimulator();
    initVehicleSimulator();
    initCollisionSimulator();
    initThreejsSimulator();
    setupSimulatorModeSwitcher();
    setupKeyboardShortcuts();
    setupMobileAccessModal();
    setupBackgroundExecution();

    // Render all initial math formulas
    if (window.MathRenderer) {
      window.MathRenderer.typeset(document.body);
    }
  }

  // View Navigation (Tab Switching)
  function setupViewNavigation() {
    const tabs = document.querySelectorAll('.view-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetViewId = tab.dataset.view;
        switchView(targetViewId);
      });
    });
  }

  function switchView(viewId) {
    if (currentView === viewId) return;

    // Lifecycle guard: pause all simulators only if background execution is NOT enabled
    const allowBackground = document.getElementById('sim-background-run')?.checked ?? true;
    if (currentView === 'view-simulator' && !allowBackground) {
      if (simulatorInstance) simulatorInstance.pause();
      if (vehicleSimulatorInstance) vehicleSimulatorInstance.pause();
      if (collisionSimulatorInstance) collisionSimulatorInstance.pause();
      if (threejsSimulatorInstance) threejsSimulatorInstance.pause();
    }

    // Update active tab buttons
    document.querySelectorAll('.view-tab').forEach(tab => {
      const isActive = tab.dataset.view === viewId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Toggle panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      const isActive = panel.id === viewId;
      panel.classList.toggle('active', isActive);
    });

    currentView = viewId;

    // If entering simulator, ensure active mode canvas is sized and rendered
    if (viewId === 'view-simulator') {
      if (activeSimMode === 'projectile' && simulatorInstance) {
        simulatorInstance._setupCanvasResolution();
        simulatorInstance.render();
      } else if (activeSimMode === 'vehicle' && vehicleSimulatorInstance) {
        vehicleSimulatorInstance.resize();
      } else if (activeSimMode === 'collision' && collisionSimulatorInstance) {
        collisionSimulatorInstance.resize();
      } else if (activeSimMode === 'threejs' && threejsSimulatorInstance) {
        setTimeout(() => {
          threejsSimulatorInstance.resize();
          threejsSimulatorInstance.render();
        }, 50);
      }
    }

    // Retypeset math if new content is visible
    if (window.MathRenderer) {
      const activePanel = document.getElementById(viewId);
      window.MathRenderer.typeset(activePanel);
    }
  }

  // Tier Switcher
  function setupTierSwitcher() {
    const tierButtons = document.querySelectorAll('.tier-btn');
    tierButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tierKey = btn.dataset.tier;
        currentTier = tierKey;

        tierButtons.forEach(b => {
          const isActive = b.dataset.tier === tierKey;
          b.classList.toggle('active', isActive);
        });

        renderTheoryContent();
      });
    });
  }

  /**
   * Render Master Curriculum: 4 Divisions & 10 Ordered Theories adhering to the
   * 6-point pedagogical structure:
   *  (1) นิยามและความหมาย
   *  (2) หลักการและคำอธิบาย
   *  (3) สูตร สัญลักษณ์ หน่วย และขั้นการอนุมาน
   *  (4) การใช้งานและเงื่อนไข (รวมถึงเมื่อใดที่ใช้ไม่ได้)
   *  (5) ตัวอย่างการคำนวณพร้อมภาพ/แบบจำลอง
   *  (6) ข้อสังเกตและประเด็นที่มักเข้าใจผิดเฉพาะเรื่องที่เกี่ยวข้อง (ถ้ามี)
   */
  function renderTheoryContent() {
    const container = document.getElementById('theory-content-target');
    if (!container) return;

    const data = window.PhysicsTheoriesContent;
    const projData = window.ProjectileContent;
    if (!data || !data.theories) return;

    const tierMeta = projData && projData.theory && projData.theory[currentTier]
      ? projData.theory[currentTier]
      : { tierName: 'ระดับการศึกษา', overview: '' };

    let html = `
      <div class="content-header">
        <h2 class="content-title">${tierMeta.tierName}: สารบัญภาคและทฤษฎีกลศาสตร์ (4 Divisions & ${data.theories.length} Theories)</h2>
        <p class="content-subtitle">โครงสร้างวิชาการมาตรฐาน: นิยาม, หลักการ, สูตรอนุมานตามระดับ, ขอบเขตการใช้งานจริง, ตัวอย่างคำนวณ และแบบจำลองเสมือนจริง</p>
      </div>

      <!-- Table of Contents & Quick Jump -->
      <div class="toc-container" role="region" aria-label="สารบัญและทางลัดทฤษฎี">
        <div class="toc-header">
          <div class="toc-title">
            <span>📚 สารบัญทฤษฎีเรียงเลข (Theory Catalog)</span>
          </div>
          <div class="division-filter-tabs" role="group" aria-label="กรองตามภาควิชา">
            <button class="division-filter-btn ${activeDivisionFilter === 'all' ? 'active' : ''}" data-division="all">
              ทั้งหมด (${data.theories.length} ทฤษฎี)
            </button>
            <button class="division-filter-btn ${activeDivisionFilter === 'div-kinematics' ? 'active' : ''}" data-division="div-kinematics">
              ภาคที่ 1: จลนศาสตร์ (${data.theories.filter(t => t.divisionId === 'div-kinematics').length})
            </button>
            <button class="division-filter-btn ${activeDivisionFilter === 'div-dynamics' ? 'active' : ''}" data-division="div-dynamics">
              ภาคที่ 2: พลศาสตร์ (${data.theories.filter(t => t.divisionId === 'div-dynamics').length})
            </button>
            <button class="division-filter-btn ${activeDivisionFilter === 'div-conservation' ? 'active' : ''}" data-division="div-conservation">
              ภาคที่ 3: กฎการอนุรักษ์ (${data.theories.filter(t => t.divisionId === 'div-conservation').length})
            </button>
            <button class="division-filter-btn ${activeDivisionFilter === 'div-computational' ? 'active' : ''}" data-division="div-computational">
              ภาคที่ 4: เชื่อมโยง & คำนวณ (${data.theories.filter(t => t.divisionId === 'div-computational').length})
            </button>
          </div>
        </div>

        <div class="toc-grid">
          ${data.theories.map(t => {
            const isVis = activeDivisionFilter === 'all' || activeDivisionFilter === t.divisionId;
            return `
            <a href="#theory-${t.id}" class="toc-item" data-division="${t.divisionId}" style="display: ${isVis ? 'flex' : 'none'};">
              <div class="toc-item-top">
                <span class="toc-item-number">${t.numberTh}</span>
                <span class="toc-item-type">${t.type.split(' ')[0]}</span>
              </div>
              <div class="toc-item-title">${t.titleTh}</div>
            </a>
          `;}).join('')}
        </div>
      </div>

      <!-- Master Divisions & Theories Container -->
      <div id="theories-master-list">
    `;

    // Render Divisions
    data.divisions.forEach(div => {
      const divTheories = data.theories.filter(t => t.divisionId === div.id);
      const isDivVisible = activeDivisionFilter === 'all' || activeDivisionFilter === div.id;

      html += `
        <section class="division-block" id="${div.id}" style="display: ${isDivVisible ? 'block' : 'none'};">
          <div class="division-banner">
            <div class="division-badge-row">
              <span class="division-numeral-badge">${div.numeral}</span>
              <span class="division-theories-count">${divTheories.length} ทฤษฎีหลัก</span>
            </div>
            <h3 class="division-title">${div.titleTh}</h3>
            <p class="division-desc">${div.description}</p>
          </div>

          <!-- Theory Cards within this Division -->
          <div class="division-theories-container">
            ${divTheories.map(t => renderSingleTheoryCard(t)).join('')}
          </div>
        </section>
      `;
    });

    html += `</div>`;

    container.innerHTML = html;

    // Attach Division Filter events
    const filterBtns = container.querySelectorAll('.division-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const divId = btn.dataset.division;
        activeDivisionFilter = divId;

        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.division === divId));

        // 1. Filter division blocks
        const blocks = container.querySelectorAll('.division-block');
        blocks.forEach(block => {
          if (divId === 'all' || block.id === divId) {
            block.style.display = 'block';
          } else {
            block.style.display = 'none';
          }
        });

        // 2. Filter TOC items
        const tocItems = container.querySelectorAll('.toc-item');
        tocItems.forEach(item => {
          if (divId === 'all' || item.dataset.division === divId) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Attach Simulator Preset deep link buttons
    const simBtns = container.querySelectorAll('.sim-deep-link-btn');
    simBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tId = parseInt(btn.dataset.theoryId, 10);
        launchSimulatorPreset(tId);
      });
    });

    // Retypeset KaTeX math
    if (window.MathRenderer) {
      window.MathRenderer.typeset(container);
    }
  }

  /**
   * Helper to format text with Markdown-style bold and lists
   */
  function formatTextProse(str) {
    if (!str) return '';
    const paragraphs = str.split('\n');
    return paragraphs.map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      // Convert markdown bold **text** to <strong>
      let formatted = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (formatted.startsWith('• ') || formatted.startsWith('- ')) {
        return `<p style="margin-left: 1.25rem; text-indent: -1rem;">${formatted}</p>`;
      }
      return `<p>${formatted}</p>`;
    }).join('');
  }

  /**
   * Render a Single Theory Card adhering strictly to the 6-point pedagogical structure
   */
  function renderSingleTheoryCard(t) {
    return `
      <article class="theory-card" id="theory-${t.id}">
        <header class="theory-card-header">
          <div class="theory-tag-row">
            <span class="tag-number">${t.numberTh}</span>
            <span class="tag-type">${t.type}</span>
            <span class="card-badge">${t.divisionTitle.split(':')[0]}</span>
          </div>
          <h4 class="theory-card-title-th">${t.titleTh}</h4>
          <div class="theory-card-title-en">${t.titleEn}</div>
          <p class="theory-card-summary">${t.summary}</p>
        </header>

        <div class="theory-card-body">
          <!-- (1) นิยามและความหมาย (Definition & Meaning) -->
          <div class="theory-section section-def">
            <div class="section-label">
              <span class="section-num">1</span>
              <span>นิยามและความหมาย (Definition & Meaning)</span>
            </div>
            <div class="theory-prose">
              ${formatTextProse(t.definition.text)}
            </div>
          </div>

          <!-- (2) หลักการและคำอธิบาย (Principle & Conceptual Foundation) -->
          <div class="theory-section section-principle">
            <div class="section-label">
              <span class="section-num">2</span>
              <span>หลักการและคำอธิบาย (Principle & Conceptual Foundation)</span>
            </div>
            <div class="theory-prose">
              ${formatTextProse(t.principle.text)}
            </div>
          </div>

          <!-- (3) สูตร สัญลักษณ์ หน่วย และขั้นการอนุมาน (Formulas & Derivations) -->
          <div class="theory-section section-formula">
            <div class="section-label">
              <span class="section-num">3</span>
              <span>สูตร สัญลักษณ์ หน่วย และขั้นการอนุมานตามระดับ (Formulas, Symbols & Derivations)</span>
            </div>
            
            ${t.formulas.map((f, fIdx) => `
              <div class="formula-subcard">
                <div class="formula-subcard-title">${f.name}</div>
                <div class="math-container display-math" style="margin: 0.75rem 0;">
                  $$${f.latex}$$
                </div>

                ${f.symbols && f.symbols.length > 0 ? `
                  <div class="symbols-table-wrapper">
                    <table class="symbols-table">
                      <thead>
                        <tr>
                          <th>สัญลักษณ์</th>
                          <th>ชื่อตัวแปร</th>
                          <th>หน่วย SI</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${f.symbols.map(s => `
                          <tr>
                            <td><strong>$${s.sym}$</strong></td>
                            <td>${s.desc}</td>
                            <td>$${s.unit}$</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                ` : ''}

                ${f.derivationSteps && f.derivationSteps.length > 0 ? `
                  <div style="margin-top: 0.75rem;">
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-orange-text); margin-bottom: 0.35rem;">
                      ลำดับขั้นตอนการอนุมาน (Derivation Steps):
                    </div>
                    <div style="font-size: 0.9rem; line-height: 1.6; color: var(--text-primary);">
                      ${f.derivationSteps.map(step => `<p style="margin-bottom: 0.35rem;">${step}</p>`).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <!-- (4) การใช้งานและเงื่อนไข (Applications, Scope & Validity Boundaries) -->
          <div class="theory-section section-app">
            <div class="section-label">
              <span class="section-num">4</span>
              <span>การใช้งานและเงื่อนไข (Applications, Scope & Validity Boundaries)</span>
            </div>
            <div class="theory-prose">
              ${formatTextProse(t.application.text)}
            </div>

            <div class="app-bounds-grid">
              <div class="app-bound-box valid">
                <div class="app-bound-title">
                  <span>✓ ขอบเขตที่ใช้ได้ (Valid Scope)</span>
                </div>
                <p>${t.application.validWhen}</p>
              </div>
              <div class="app-bound-box invalid">
                <div class="app-bound-title">
                  <span>✗ เมื่อใดที่ใช้ไม่ได้ / ข้อควรระวัง (Invalid Bounds)</span>
                </div>
                <p>${t.application.invalidWhen}</p>
              </div>
            </div>
          </div>

          <!-- (5) ตัวอย่างการคำนวณพร้อมภาพ/แบบจำลอง (Worked Example & Simulator) -->
          <div class="theory-section section-example">
            <div class="section-label">
              <span class="section-num">5</span>
              <span>ตัวอย่างการคำนวณพร้อมภาพ/แบบจำลอง (Worked Example & Interactive Simulator)</span>
            </div>
            <div class="example-box">
              ${t.example.diagramSvg ? `
                <div class="theory-diagram-wrapper" style="margin: 0.75rem 0; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; align-items: center; overflow-x: auto;">
                  ${t.example.diagramSvg}
                  ${t.example.diagramCaption ? `<div class="diagram-caption" style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.5rem; text-align: center; max-width: 90%;">${t.example.diagramCaption}</div>` : ''}
                </div>
              ` : ''}
              <div class="example-prob">
                <strong>โจทย์ตัวอย่าง:</strong> ${t.example.problem}
              </div>
              <div class="step-container" style="margin: 0.75rem 0;">
                ${t.example.steps.map((st, sIdx) => `
                  <div class="step-card" style="padding: 0.6rem 0.85rem;">
                    <p style="font-size: 0.9rem; margin: 0;">${st}</p>
                  </div>
                `).join('')}
              </div>
              <button class="sim-deep-link-btn" data-theory-id="${t.id}" aria-label="นำพารามิเตอร์ของทฤษฎีนี้ไปจำลองจริงในแบบจำลอง">
                🎯 ทดลองในแบบจำลอง (Launch in Simulator) &rarr;
              </button>
            </div>
          </div>

          <!-- (6) ข้อสังเกตและประเด็นที่มักเข้าใจผิดเฉพาะเรื่อง (Key Observations & Physical Nuances) -->
          ${t.observations && t.observations.length > 0 ? `
            <div class="observation-card">
              <div class="observation-header">
                <span>💡 ข้อสังเกตและประเด็นที่มักเข้าใจผิดเฉพาะเรื่อง (Key Physical Observations)</span>
              </div>
              <ul class="observation-list">
                ${t.observations.map(obs => `<li>${obs}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Academic Source References -->
          <footer style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px dashed var(--border-light); padding-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <span>📖 อ้างอิงตำราวิชาการ: <strong>${t.citation || 'David Morin (2008), David Tong (2004), Baker & Haynes (2020)'}</strong></span>
            <a href="#tab-formulas" class="view-tab-link" style="color: var(--accent-orange-text); text-decoration: none; font-weight: 600;" onclick="window.PhysicsApp.switchView('view-formulas');">
              เปิดตารางสูตรทั้งหมด ↗
            </a>
          </footer>
        </div>
      </article>
    `;
  }

  /**
   * Render Standalone Master Variable & SI Unit Matrix
   */
  function renderMasterSymbolsLedger() {
    const data = window.PhysicsTheoriesContent;
    if (!data || !data.masterSymbols) return '';

    const allSymbols = data.masterSymbols;
    const filtered = activeSymbolDomain === 'all'
      ? allSymbols
      : allSymbols.filter(s => s.domain === activeSymbolDomain);

    const domains = [
      { id: 'all', label: `ทั้งหมด (${allSymbols.length})` },
      { id: 'kinematics', label: 'จลนศาสตร์ (Kinematics)' },
      { id: 'dynamics', label: 'พลศาสตร์ (Dynamics)' },
      { id: 'conservation', label: 'กฎการอนุรักษ์ (Conservation)' },
      { id: 'computational', label: 'การหมุน & คำนวณ (Computational)' }
    ];

    return `
      <div class="master-symbols-box" id="master-symbols-ledger">
        <div class="master-symbols-header">
          <div class="master-symbols-title">
            <span>📐 กรอบรวมสัญลักษณ์ ตัวแปร และหน่วย SI สากล (Master Symbol Ledger)</span>
          </div>
          <div class="recall-mode-bar">
            <button class="recall-mode-btn ${activeRecallMode ? 'active' : ''}" id="btn-recall-mode" aria-pressed="${activeRecallMode ? 'true' : 'false'}">
              ${activeRecallMode ? '👁️ ปิดโหมดทบทวนตนเอง (Active Recall: ON)' : '🧠 เปิดโหมดทบทวนตนเอง (Active Recall: OFF)'}
            </button>
          </div>
        </div>

        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
          ตารางแม่แบบรวมสัญลักษณ์และหน่วย SI สากลทุกตัวแปรในทั้ง 4 ภาค พร้อมโหมดทบทวนความจำ (คลิกช่องที่เบลอเพื่อทดสอบการจำความหมายและหน่วย)
        </p>

        <!-- Domain Filter Tabs -->
        <div class="symbol-domain-tabs" role="tablist" aria-label="กรองสัญลักษณ์ตามหมวดฟิสิกส์">
          ${domains.map(d => `
            <button class="symbol-domain-btn ${activeSymbolDomain === d.id ? 'active' : ''}" data-domain="${d.id}" role="tab" aria-selected="${activeSymbolDomain === d.id ? 'true' : 'false'}">
              ${d.label}
            </button>
          `).join('')}
        </div>

        <!-- Master Symbols Table -->
        <div class="master-symbols-table-wrapper">
          <table class="master-symbols-table">
            <thead>
              <tr>
                <th style="width: 14%;">สัญลักษณ์</th>
                <th style="width: 26%;">ชื่อตัวแปร & ความหมาย</th>
                <th style="width: 18%; text-align: center;">หน่วย SI สากล</th>
                <th style="width: 14%; text-align: center;">หมวดวิชา</th>
                <th style="width: 28%;">คำอธิบายทางฟิสิกส์</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                // Group consecutive items in filtered sharing the same unit and domain
                const groups = [];
                let currentGroup = null;

                for (const s of filtered) {
                  if (currentGroup && currentGroup.unit === s.unit && currentGroup.domain === s.domain) {
                    currentGroup.items.push(s);
                  } else {
                    currentGroup = {
                      unit: s.unit,
                      domain: s.domain,
                      domainTh: s.domainTh,
                      items: [s]
                    };
                    groups.push(currentGroup);
                  }
                }

                return groups.map(group => {
                  const rowSpan = group.items.length;
                  return group.items.map((s, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === rowSpan - 1;
                    const trClass = rowSpan === 1
                      ? 'unit-group-single'
                      : (isFirst ? 'unit-group-first' : (isLast ? 'unit-group-last' : 'unit-group-mid'));

                    return `
                      <tr class="${trClass}">
                        <td class="cell-sym"><strong>$${s.sym}$</strong></td>
                        <td class="cell-name">
                          <span class="${activeRecallMode ? 'recall-blur' : ''}">
                            <strong>${s.nameTh}</strong><br>
                            <small style="color: var(--text-secondary);">${s.nameEn}</small>
                          </span>
                        </td>
                        ${isFirst ? `
                          <td rowspan="${rowSpan}" class="cell-unit-merged ${rowSpan > 1 ? 'is-merged' : ''}">
                            <span class="${activeRecallMode ? 'recall-blur' : ''}">
                              $${group.unit}$
                            </span>
                          </td>
                          <td rowspan="${rowSpan}" class="cell-domain-merged ${rowSpan > 1 ? 'is-merged' : ''}">
                            <span class="card-badge">${group.domainTh}</span>
                          </td>
                        ` : ''}
                        <td class="cell-note" style="font-size: 0.82rem; color: var(--text-secondary);">
                          ${s.note}
                        </td>
                      </tr>
                    `;
                  }).join('');
                }).join('');
              })()}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /**
   * Render Formula Ledger across all 10 theories in a streamlined, continuous summary flow
   */
  function renderFormulasContent() {
    const container = document.getElementById('formulas-content-target');
    if (!container) return;

    const data = window.PhysicsTheoriesContent;
    const projData = window.ProjectileContent;
    if (!data || !data.theories) return;

    let html = `
      <div class="content-header">
        <h2 class="content-title">สารบัญสูตร สรุปกระชับ และการอนุมานรวดเดียวทั้ง ${data.theories.length} ทฤษฎี</h2>
        <p class="content-subtitle">สรุปสูตรกระชับประจำบท อ่านและจดจำได้ในหน้าเดียว พร้อมการอนุมานทีละขั้น กรอบรวมสัญลักษณ์ และเชื่อมโยงแบบจำลอง</p>
      </div>
    `;

    // (1) Render Standalone Master Variable & Unit Matrix
    html += renderMasterSymbolsLedger();

    // (2) Render Formula Division Filter Bar
    html += `
      <div class="formula-filter-bar">
        <div class="toc-header" style="margin-bottom: 1.25rem;">
          <div class="toc-title">
            <span>📐 กรองสูตรตามภาควิชา (Formula Division Filter)</span>
          </div>
          <div class="division-filter-tabs" id="formula-division-tabs" role="group" aria-label="กรองสูตรตามภาควิชา">
            <button class="formula-division-filter-btn ${activeFormulaDivisionFilter === 'all' ? 'active' : ''}" data-division="all">
              ทั้งหมด (${data.theories.length} ทฤษฎี)
            </button>
            <button class="formula-division-filter-btn ${activeFormulaDivisionFilter === 'div-kinematics' ? 'active' : ''}" data-division="div-kinematics">
              ภาคที่ 1: จลนศาสตร์
            </button>
            <button class="formula-division-filter-btn ${activeFormulaDivisionFilter === 'div-dynamics' ? 'active' : ''}" data-division="div-dynamics">
              ภาคที่ 2: พลศาสตร์
            </button>
            <button class="formula-division-filter-btn ${activeFormulaDivisionFilter === 'div-conservation' ? 'active' : ''}" data-division="div-conservation">
              ภาคที่ 3: กฎการอนุรักษ์
            </button>
            <button class="formula-division-filter-btn ${activeFormulaDivisionFilter === 'div-computational' ? 'active' : ''}" data-division="div-computational">
              ภาคที่ 4: เชื่อมโยง & คำนวณ
            </button>
          </div>
        </div>
      </div>
    `;

    // (3) Render Compact Continuous Formula Summary Flow grouped by Division
    data.divisions.forEach(div => {
      const divTheories = data.theories.filter(t => t.divisionId === div.id);
      if (divTheories.length === 0) return;
      const isDivVisible = activeFormulaDivisionFilter === 'all' || activeFormulaDivisionFilter === div.id;

      html += `
        <div class="formula-division-block" id="formula-block-${div.id}" style="display: ${isDivVisible ? 'block' : 'none'};">
          <div class="formula-division-header">
            <div class="formula-division-title">
              <span class="division-numeral-badge">${div.numeral}</span>
              <span>${div.titleTh}</span>
            </div>
            <span class="card-badge" style="background: var(--bg-card);">${divTheories.length} ทฤษฎีหลัก</span>
          </div>

          <div class="formula-continuous-flow">
            ${divTheories.map(t => `
              <div class="formula-summary-card" id="formula-summary-${t.id}">
                <div class="formula-summary-header">
                  <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <span class="card-badge" style="background: var(--text-primary); color: #FFF;">${t.numberTh}</span>
                    <span class="formula-summary-title">${t.titleTh} (${t.titleEn})</span>
                  </div>
                  <button class="read-theory-btn" onclick="window.PhysicsApp.switchView('view-theory'); setTimeout(() => { const el = document.getElementById('theory-${t.id}'); if(el) el.scrollIntoView({behavior: 'smooth'}); }, 100);">
                    อ่านทฤษฎีเต็ม ↗
                  </button>
                </div>

                <!-- Display Formulas -->
                ${t.formulas.map(f => `
                  <div style="margin-bottom: 0.75rem;">
                    <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.25rem;">
                      ${f.name}
                    </div>
                    <div class="formula-box-highlight">
                      $$${f.latex}$$
                    </div>

                    ${f.derivationSteps && f.derivationSteps.length > 0 ? `
                      <div class="formula-derivation-compact">
                        <div class="formula-derivation-title">ขั้นตอนการอนุมาน (Derivation Steps):</div>
                        ${f.derivationSteps.map(step => `<p style="margin: 0.2rem 0;">${step}</p>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}

                <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-light); font-size: 0.85rem;">
                  <span class="formula-scope-tag">
                    <strong>ขอบเขต:</strong> ${t.application.validWhen}
                  </span>
                  <button class="sim-deep-link-btn" data-theory-id="${t.id}" style="margin: 0; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                    🎯 จำลองสูตรนี้ในแบบจำลอง &rarr;
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    // (4) Numerical Benchmark Worked Example
    if (projData && projData.workedExample) {
      const example = projData.workedExample;
      html += `
        <div class="info-card highlight-orange benchmark-worked-card" style="margin-top: 2.5rem;">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <h3 class="card-title">${example.title}</h3>
              <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.25rem;">${example.subtitle || ''}</p>
            </div>
            <button id="btn-launch-worked-example" class="btn btn-primary" style="padding: 0.55rem 1.1rem; font-size: 0.88rem;">
              🎯 จำลองโจทย์นี้ใน Simulator &rarr;
            </button>
          </div>
          <div class="card-body">
            <!-- Benchmark Input Parameters Chips -->
            <div class="benchmark-inputs-grid">
              <div class="benchmark-chip"><span class="chip-label">ความเร็วต้น $v_0$</span><span class="chip-val">${example.inputs.v0} m/s</span></div>
              <div class="benchmark-chip"><span class="chip-label">มุมยิง $\theta$</span><span class="chip-val">${example.inputs.thetaDeg}°</span></div>
              <div class="benchmark-chip"><span class="chip-label">มวลลูกปืน $m$</span><span class="chip-val">${example.inputs.m} kg</span></div>
              <div class="benchmark-chip"><span class="chip-label">สปส. ต้าน $c$</span><span class="chip-val">${example.inputs.c} kg/m</span></div>
              <div class="benchmark-chip"><span class="chip-label">แรงโน้มถ่วง $g$</span><span class="chip-val">${example.inputs.g} m/s²</span></div>
            </div>

            <!-- Comparative Matrix Table -->
            <div class="benchmark-table-wrapper">
              <table class="benchmark-comparison-table">
                <thead>
                  <tr>
                    <th>ดัชนีชี้วัด (Metric)</th>
                    <th>สุญญากาศ (Vacuum, $c=0$)</th>
                    <th>แรงต้านอากาศจริง (RK4 Drag)</th>
                    <th>ส่วนต่าง (Delta)</th>
                    <th>ผลกระทบทางฟิสิกส์ (Physical Effect)</th>
                  </tr>
                </thead>
                <tbody>
                  ${(example.comparisonMetrics || []).map(m => `
                    <tr>
                      <td><strong>${m.label}</strong></td>
                      <td class="metric-vac">${m.vacuum}</td>
                      <td class="metric-drag"><strong>${m.drag}</strong></td>
                      <td><span class="delta-badge ${m.delta.startsWith('-') ? 'delta-neg' : 'delta-pos'}">${m.delta}</span></td>
                      <td class="metric-effect">${m.effect}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Step-by-Step Derivation Cards -->
            <div class="step-container" style="margin-top: 1.5rem;">
              ${example.steps.map(s => `
                <div class="step-card" style="border-left: 4px solid var(--accent-orange); margin-bottom: 1rem; padding: 1.25rem;">
                  <div class="step-header" style="font-weight: 800; font-size: 1rem; color: var(--text-primary); margin-bottom: 0.5rem;">
                    ขั้นตอนที่ ${s.step}: ${s.name}
                  </div>
                  ${s.formula ? `<div class="formula-box-highlight" style="margin: 0.5rem 0;">$$${s.formula}$$</div>` : ''}
                  <div class="step-calc-body" style="line-height: 1.7; color: var(--text-primary);">
                    ${formatTextProse(s.calc)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    // Attach Formula Division Filter Tabs
    const formulaDivBtns = container.querySelectorAll('.formula-division-filter-btn');
    formulaDivBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const divId = btn.dataset.division;
        activeFormulaDivisionFilter = divId;

        formulaDivBtns.forEach(b => b.classList.toggle('active', b.dataset.division === divId));

        const blocks = container.querySelectorAll('.formula-division-block');
        blocks.forEach(block => {
          if (divId === 'all' || block.id === `formula-block-${divId}`) {
            block.style.display = 'block';
          } else {
            block.style.display = 'none';
          }
        });
      });
    });

    // Attach Benchmark Worked Example Launch Button
    const launchExBtn = container.querySelector('#btn-launch-worked-example');
    if (launchExBtn) {
      launchExBtn.addEventListener('click', () => {
        const sliderV0 = document.getElementById('slider-v0');
        const sliderTheta = document.getElementById('slider-theta');
        const sliderMass = document.getElementById('slider-mass');
        const sliderCd = document.getElementById('slider-cd');

        if (sliderV0) { sliderV0.value = 100; sliderV0.dispatchEvent(new Event('input')); }
        if (sliderTheta) { sliderTheta.value = 30; sliderTheta.dispatchEvent(new Event('input')); }
        if (sliderMass) { sliderMass.value = 5.0; sliderMass.dispatchEvent(new Event('input')); }
        if (sliderCd) { sliderCd.value = 0.05; sliderCd.dispatchEvent(new Event('input')); }

        switchView('view-simulator');
        const modeBtn = document.getElementById('mode-btn-projectile');
        if (modeBtn) modeBtn.click();

        if (simulatorInstance) {
          simulatorInstance.reset();
          setTimeout(() => simulatorInstance.play(), 150);
        }
      });
    }

    // Attach Domain Filter Tabs
    const domainBtns = container.querySelectorAll('.symbol-domain-btn');
    domainBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeSymbolDomain = btn.dataset.domain;
        renderFormulasContent();
      });
    });

    // Attach Recall Mode Toggle
    const recallBtn = container.querySelector('#btn-recall-mode');
    if (recallBtn) {
      recallBtn.addEventListener('click', () => {
        activeRecallMode = !activeRecallMode;
        renderFormulasContent();
      });
    }

    // Attach Tap-to-Reveal on blurred cells
    const blurCells = container.querySelectorAll('.recall-blur');
    blurCells.forEach(cell => {
      cell.addEventListener('click', () => {
        cell.classList.toggle('revealed');
      });
    });

    // Attach Simulator Preset deep link buttons
    const simBtns = container.querySelectorAll('.sim-deep-link-btn');
    simBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tId = parseInt(btn.dataset.theoryId, 10);
        launchSimulatorPreset(tId);
      });
    });

    if (window.MathRenderer) {
      window.MathRenderer.typeset(container);
    }
  }

  function renderPhenomenaContent() {
    const container = document.getElementById('phenomena-content-target');
    if (!container || !window.ProjectileContent) return;

    const phenomena = window.ProjectileContent.phenomena;

    let html = `
      <div class="content-header">
        <h2 class="content-title">ปรากฏการณ์ในธรรมชาติและงานวิศวกรรมจริง</h2>
        <p class="content-subtitle">การเชื่อมโยงทฤษฎีแรงต้านอากาศสู่สิ่งที่พบเห็นในชีวิตประจำวันและเทคโนโลยีระดับสูง</p>
      </div>
      <div class="phenomena-list">
    `;

    phenomena.forEach(p => {
      html += `
        <div class="phenomena-card">
          <div>
            <span class="card-badge" style="margin-bottom: 0.5rem; display: inline-block;">${p.category}</span>
            <h3 class="card-title" style="margin-bottom: 0.75rem;">${p.titleTh}</h3>
            <p style="margin-bottom: 0.75rem; color: var(--text-primary); font-size: 0.95rem;"><strong>กลไกทางฟิสิกส์:</strong> ${p.mechanism}</p>
            <p style="color: var(--text-secondary); font-size: 0.9rem;"><strong>การประยุกต์ใช้งาน:</strong> ${p.application}</p>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    if (window.MathRenderer) {
      window.MathRenderer.typeset(container);
    }
  }

  /**
   * VIEW 5: Analytical Formalisms Renderer
   * Covers Action Principle, Lagrangian, Noether's Theorem, Hamiltonian, and Phase Space
   */
  function renderAnalyticalContent() {
    const container = document.getElementById('analytical-content-target');
    if (!container) return;

    const afData = window.AnalyticalFormalismsContent;
    if (!afData) return;

    let html = `
      <div class="content-header">
        <h2 class="content-title">${afData.meta.titleTh}</h2>
        <p class="content-subtitle">${afData.meta.subtitleTh} &mdash; ${afData.meta.description}</p>
      </div>

      <!-- Formalisms Comparative Matrix -->
      <div class="info-card" style="margin-bottom: 2rem;">
        <div class="card-header">
          <h3 class="card-title">ตารางเปรียบเทียบกระบวนทัศน์กลศาสตร์ (Newtonian vs Lagrangian vs Hamiltonian)</h3>
          <span class="card-badge">Comparative Mechanics Formalisms</span>
        </div>
        <div class="card-body">
          <div class="table-responsive" style="overflow-x: auto;">
            <table class="data-table" style="width: 100%; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr>
                  ${afData.comparisonTable.headers.map(h => `<th>${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${afData.comparisonTable.rows.map(r => `
                  <tr>
                    <td><strong>${r.aspect}</strong></td>
                    <td>${r.newton}</td>
                    <td><span style="color: var(--accent-orange-text); font-weight: 600;">${r.lagrange}</span></td>
                    <td><span style="color: #2563EB; font-weight: 600;">${r.hamilton}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 5 Deep Analytical Formalisms Topics -->
      <div class="analytical-topics-container">
        ${afData.topics.map(topic => `
          <article class="analytical-topic-card" id="topic-${topic.id}">
            <div class="topic-header-bar">
              <div class="topic-title-group">
                <span class="topic-num-badge">${topic.numeral}</span>
                <div>
                  <h3 class="topic-title">${topic.titleTh}</h3>
                  <div class="topic-subtitle-en">${topic.titleEn}</div>
                </div>
              </div>
              <span class="card-badge" style="background: var(--bg-main);">${topic.badge}</span>
            </div>

            <div class="topic-body">
              <div class="topic-core-concept">
                <strong>หลักการสำคัญ (Core Principle):</strong> ${topic.coreConcept}
              </div>

              <div class="formula-box-highlight" style="margin: 1rem 0; font-size: 1.15rem; background: #FFFFFF; border-left: 4px solid #7C3AED;">
                $$${topic.displayFormula}$$
              </div>

              <div class="topic-derivation-section">
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">
                  ขั้นตอนการอนุมานและพิสูจน์ (Rigorous Variational Derivation):
                </h4>
                <div class="step-container">
                  ${topic.derivation.map(step => `
                    <div class="step-card" style="margin-bottom: 0.5rem; background: var(--bg-card); padding: 0.75rem 1rem;">
                      ${formatTextProse(step)}
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="topic-takeaways" style="margin-top: 1rem; padding: 0.75rem 1rem; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: var(--radius-sm);">
                <div style="font-weight: 700; color: #166534; margin-bottom: 0.35rem; font-size: 0.88rem;">💡 นัยสำคัญทางฟิสิกส์ (Physical Insights & Takeaways):</div>
                <ul style="margin-left: 1.25rem; font-size: 0.9rem; color: #15803D;">
                  ${topic.takeaways.map(t => `<li style="margin-bottom: 0.25rem;">${t}</li>`).join('')}
                </ul>
              </div>
            </div>
          </article>
        `).join('')}
      </div>

      <!-- Phase Space Interactive Visualizer -->
      <div class="info-card highlight-orange" style="margin-top: 2rem;">
        <div class="card-header">
          <h3 class="card-title">แบบจำลองสเปซเฟสปฏิสัมพันธ์ (Interactive Phase Space Portrait)</h3>
          <span class="card-badge">$(q, p)$ Phase Flow</span>
        </div>
        <div class="card-body">
          <p style="margin-bottom: 1rem; font-size: 0.92rem; color: var(--text-secondary);">
            เปรียบเทียบการไหลของสถานะในสเปซเฟส: เส้นทางวงรีปิดคงที่ตามทฤษฎีบทลียูวีลล์ (ระบบอนุรักษ์ $c=0$) ปะทะ เส้นทางวงก้นหอยดูดพลังงานเข้าสู่จุดสมดุล (ระบบที่มีแรงต้านอากาศ $\\mathcal{R}$)
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <canvas id="phase-space-canvas" width="620" height="340" style="background: #0F172A; border-radius: var(--radius-md); max-width: 100%; height: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.25);"></canvas>
          </div>
          <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 0.75rem; flex-wrap: wrap;">
            <button id="btn-phase-trace" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;">
              🌀 วาดการไหลในสเปซเฟส (Trace Phase Trajectories)
            </button>
            <button id="btn-phase-clear" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;">
              ล้างกระดาน (Clear)
            </button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    initPhaseSpaceCanvas();

    if (window.MathRenderer) {
      window.MathRenderer.typeset(container);
    }
  }

  function initPhaseSpaceCanvas() {
    const canvas = document.getElementById('phase-space-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function drawPhaseGrid() {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Center Axes
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      // Axis q
      ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(w - 20, cy); ctx.stroke();
      // Arrowhead q
      ctx.beginPath(); ctx.moveTo(w - 20, cy); ctx.lineTo(w - 28, cy - 4); ctx.lineTo(w - 28, cy + 4); ctx.fill();
      // Axis p
      ctx.beginPath(); ctx.moveTo(cx, h - 20); ctx.lineTo(cx, 20); ctx.stroke();
      // Arrowhead p
      ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx - 4, 28); ctx.lineTo(cx + 4, 28); ctx.fill();

      // Labels
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('พิกัดวางนัยทั่วไป q (m)', w - 160, cy - 10);
      ctx.fillText('โมเมนตัมสังยุค p (kg·m/s)', cx + 10, 25);
      ctx.fillText('(0, 0)', cx + 6, cy + 16);

      // Legend
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(20, 20, 14, 3);
      ctx.fillText('ระบบอนุรักษ์ (Hamiltonian Flow, δS=0)', 40, 24);

      ctx.fillStyle = '#F97316';
      ctx.fillRect(20, 36, 14, 3);
      ctx.fillText('ระบบมีแรงต้าน (Rayleigh Dissipation R)', 40, 40);
    }

    function tracePhaseFlow() {
      drawPhaseGrid();
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // 1. Conservative orbits (nested concentric ellipses)
      const energies = [35, 70, 110, 150];
      energies.forEach(E => {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let th = 0; th <= Math.PI * 2; th += 0.05) {
          const q = E * Math.cos(th);
          const p = (E * 0.65) * Math.sin(th);
          const x = cx + q;
          const y = cy - p;
          if (th === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        // Direction arrow dot
        const arrowAngle = Math.PI / 4;
        const ax = cx + E * Math.cos(arrowAngle);
        const ay = cy - (E * 0.65) * Math.sin(arrowAngle);
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(ax, ay, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Damped spiral trajectory (inward convergence due to Rayleigh dissipation)
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let r = 160;
      let angle = 0;
      let isStart = true;
      while (r > 4) {
        const q = r * Math.cos(angle);
        const p = (r * 0.65) * Math.sin(angle);
        const x = cx + q;
        const y = cy - p;
        if (isStart) {
          ctx.moveTo(x, y);
          isStart = false;
        } else {
          ctx.lineTo(x, y);
        }
        angle += 0.08;
        r *= 0.988; // exponential decay
      }
      ctx.stroke();

      // Equilibrium attractor dot
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    drawPhaseGrid();
    tracePhaseFlow();

    const traceBtn = document.getElementById('btn-phase-trace');
    if (traceBtn) traceBtn.addEventListener('click', tracePhaseFlow);

    const clearBtn = document.getElementById('btn-phase-clear');
    if (clearBtn) clearBtn.addEventListener('click', drawPhaseGrid);
  }

  function setupMobileAccessModal() {
    const triggerBtn = document.getElementById('btn-mobile-access');
    const modal = document.getElementById('mobile-access-modal');
    const closeBtn = document.getElementById('btn-close-mobile-modal');
    const copyBtn = document.getElementById('btn-copy-mobile-url');
    const urlInput = document.getElementById('mobile-target-url');
    const qrContainer = document.getElementById('mobile-qr-container');
    const copyFeedback = document.getElementById('copy-feedback-msg');

    if (!triggerBtn || !modal) return;

    function fetchAndRenderNetworkInfo() {
      fetch('/api/network-info')
        .then(res => res.json())
        .then(data => {
          if (data && data.targetUrl) {
            if (urlInput) urlInput.value = data.targetUrl;
            if (qrContainer && data.qrSvg) {
              qrContainer.innerHTML = data.qrSvg;
            }
          }
        })
        .catch(err => {
          console.warn('Network info fetch error:', err);
        });
    }

    function openModal() {
      modal.style.display = 'flex';
      fetchAndRenderNetworkInfo();
    }

    function closeModal() {
      modal.style.display = 'none';
      if (copyFeedback) copyFeedback.textContent = '';
    }

    triggerBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (copyBtn && urlInput) {
      copyBtn.addEventListener('click', () => {
        urlInput.select();
        navigator.clipboard.writeText(urlInput.value).then(() => {
          if (copyFeedback) {
            copyFeedback.textContent = '✓ คัดลอกที่อยู่เว็บเรียบร้อยแล้ว!';
            setTimeout(() => { if (copyFeedback) copyFeedback.textContent = ''; }, 3000);
          }
        }).catch(() => {
          document.execCommand('copy');
          if (copyFeedback) {
            copyFeedback.textContent = '✓ คัดลอกแล้ว!';
            setTimeout(() => { if (copyFeedback) copyFeedback.textContent = ''; }, 3000);
          }
        });
      });
    }

    // Prefetch once
    fetchAndRenderNetworkInfo();
  }

  let backgroundInterval = null;
  function setupBackgroundExecution() {
    document.addEventListener('visibilitychange', () => {
      const allowBackground = document.getElementById('sim-background-run')?.checked ?? true;
      if (!allowBackground) return;

      if (document.hidden) {
        if (!backgroundInterval) {
          backgroundInterval = setInterval(() => {
            if (activeSimMode === 'projectile' && simulatorInstance && (simulatorInstance.isRunning && !simulatorInstance.isPaused)) {
              simulatorInstance.step(0.04);
            } else if (activeSimMode === 'vehicle' && vehicleSimulatorInstance && vehicleSimulatorInstance.isRunning) {
              vehicleSimulatorInstance.step(0.04);
            } else if (activeSimMode === 'collision' && collisionSimulatorInstance && collisionSimulatorInstance.isRunning) {
              collisionSimulatorInstance.step(0.04);
            }
          }, 40);
        }
      } else {
        if (backgroundInterval) {
          clearInterval(backgroundInterval);
          backgroundInterval = null;
        }
      }
    });
  }

  // Simulator preset launcher
  function launchSimulatorPreset(theoryId) {
    switchView('view-simulator');

    if (theoryId === 1 || theoryId === 2) {
      // 1D & Straight-line Kinematics -> Switch to Mode 2 (Vehicle & Vector field)
      switchSimMode('vehicle');
      if (vehicleSimulatorInstance) {
        vehicleSimulatorInstance.reset();
        vehicleSimulatorInstance.setParams({ speed: 30.0, windSpeed: 10.0, windDirDeg: 90.0 });
      }
    } else if (theoryId === 7 || theoryId === 8) {
      // Conservation of Momentum & Collision -> Switch to Mode 3 (Collision)
      switchSimMode('collision');
      if (collisionSimulatorInstance) {
        collisionSimulatorInstance.reset();
      }
    } else if (theoryId === 13) {
      // Coriolis & 3D Spatial Trajectory -> Switch to Mode 4 (Three.js WebGL)
      switchSimMode('threejs');
      if (threejsSimulatorInstance) {
        threejsSimulatorInstance.setParams({ v0: 85, elevationDeg: 45, azimuthDeg: 0, windSpeed: 18.0, windAzimuthDeg: 90.0, c: 0.04 });
        syncThreejsSliders();
        threejsSimulatorInstance.reset();
      }
    } else {
      // Mode 1: Projectile Ballistics & Drag
      switchSimMode('projectile');
      if (simulatorInstance) {
        if (theoryId === 3 || theoryId === 4) {
          simulatorInstance.updateParams({ v0: 80, thetaDeg: 45, y0: 0, c: 0.0 });
        } else if (theoryId === 5 || theoryId === 6) {
          simulatorInstance.updateParams({ v0: 100, thetaDeg: 45, y0: 0, c: 0.08, m: 2.0 });
        } else if (theoryId === 9) {
          simulatorInstance.updateParams({ v0: 75, thetaDeg: 40, y0: 10, c: 0.04, m: 4.0 });
        } else if (theoryId === 10) {
          simulatorInstance.updateParams({ v0: 90, thetaDeg: 35, y0: 0, c: 0.12, m: 3.0 });
        }
        syncSlidersFromSimulator(simulatorInstance.params);
        simulatorInstance.reset();
        simulatorInstance.render();
      }
    }
  }

  // ======================================================================
  // SIMULATOR MULTI-MODE CONTROLLERS
  // ======================================================================

  function setupSimulatorModeSwitcher() {
    const modeBtns = document.querySelectorAll('.sim-mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.simMode;
        switchSimMode(mode);
      });
    });
  }

  function switchSimMode(mode) {
    if (activeSimMode === mode) return;

    // Pause current active simulator
    if (activeSimMode === 'projectile' && simulatorInstance) simulatorInstance.pause();
    if (activeSimMode === 'vehicle' && vehicleSimulatorInstance) vehicleSimulatorInstance.pause();
    if (activeSimMode === 'collision' && collisionSimulatorInstance) collisionSimulatorInstance.pause();
    if (activeSimMode === 'threejs' && threejsSimulatorInstance) threejsSimulatorInstance.pause();

    // Update buttons
    document.querySelectorAll('.sim-mode-btn').forEach(btn => {
      const isActive = btn.dataset.simMode === mode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Toggle container views
    const containers = {
      projectile: document.getElementById('sim-container-projectile'),
      vehicle: document.getElementById('sim-container-vehicle'),
      collision: document.getElementById('sim-container-collision'),
      threejs: document.getElementById('sim-container-threejs')
    };

    Object.keys(containers).forEach(k => {
      if (containers[k]) {
        containers[k].style.display = (k === mode) ? 'block' : 'none';
        containers[k].classList.toggle('active', k === mode);
      }
    });

    activeSimMode = mode;

    // Trigger canvas resize and initial render
    if (mode === 'projectile' && simulatorInstance) {
      simulatorInstance._setupCanvasResolution();
      simulatorInstance.render();
    } else if (mode === 'vehicle' && vehicleSimulatorInstance) {
      vehicleSimulatorInstance.resize();
      vehicleSimulatorInstance.render();
    } else if (mode === 'collision' && collisionSimulatorInstance) {
      collisionSimulatorInstance.resize();
      collisionSimulatorInstance.render();
    } else if (mode === 'threejs' && threejsSimulatorInstance) {
      setTimeout(() => {
        threejsSimulatorInstance.resize();
        threejsSimulatorInstance.render();
      }, 50);
    }
  }

  // Interactive Simulator Bridge (Mode 1: Projectile)
  function initSimulator() {
    const canvas = document.getElementById('simulator-canvas');
    if (!canvas || !window.ProjectileSimulator) return;

    simulatorInstance = new window.ProjectileSimulator(canvas, {
      v0: 100,
      thetaDeg: 30,
      m: 5.0,
      c: 0.05,
      g: 9.80665,
      y0: 0,
      dt: 0.02,
      onTelemetryUpdate: updateTelemetryUI,
      onPlaybackChange: updatePlaybackUI
    });

    window.simulatorInstance = simulatorInstance;
    simulatorInstance.onTelemetry = updateTelemetryUI;
    simulatorInstance.onStatusChange = updatePlaybackUI;

    setupSimulatorControls();
    simulatorInstance.render();
  }

  function setupSimulatorControls() {
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    const btnStep = document.getElementById('btn-step');
    const btnReset = document.getElementById('btn-reset');

    if (btnPlay) btnPlay.addEventListener('click', () => simulatorInstance.play());
    if (btnPause) btnPause.addEventListener('click', () => simulatorInstance.pause());
    if (btnStep) btnStep.addEventListener('click', () => simulatorInstance.stepForward(0.05));
    if (btnReset) btnReset.addEventListener('click', () => simulatorInstance.reset());

    bindSlider('slider-v0', 'val-v0', 'v0', ' m/s', parseFloat);
    bindSlider('slider-theta', 'val-theta', 'thetaDeg', '°', parseFloat);
    bindSlider('slider-m', 'val-m', 'm', ' kg', parseFloat);
    bindSlider('slider-c', 'val-c', 'c', ' kg/m', parseFloat);
    bindSlider('slider-g', 'val-g', 'g', ' m/s²', parseFloat);
    bindSlider('slider-y0', 'val-y0', 'y0', ' m', parseFloat);

    const toggles = [
      { id: 'chk-vel', key: 'velocity' },
      { id: 'chk-comp', key: 'components' },
      { id: 'chk-drag', key: 'dragForce' },
      { id: 'chk-grav', key: 'gravityForce' },
      { id: 'chk-acc', key: 'acceleration' },
      { id: 'chk-vac', key: 'vacuumTrajectory' }
    ];

    toggles.forEach(t => {
      const chk = document.getElementById(t.id);
      if (chk) {
        chk.addEventListener('change', (e) => {
          simulatorInstance.setVectors({ [t.key]: e.target.checked });
        });
      }
    });
  }

  function bindSlider(sliderId, labelId, paramKey, unit, parser) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    if (!slider || !label) return;

    slider.addEventListener('input', (e) => {
      const val = parser(e.target.value);
      label.textContent = val + unit;
      if (simulatorInstance) {
        simulatorInstance.updateParams({ [paramKey]: val });
      }
    });
  }

  function updateTelemetryUI(state, simData) {
    if (!state) return;

    setText('telem-x', state.x.toFixed(2) + ' m');
    setText('telem-y', state.y.toFixed(2) + ' m');
    setText('telem-v', state.speed.toFixed(2) + ' m/s');
    setText('telem-t', state.t.toFixed(3) + ' s');
    setText('telem-ek', state.ek.toFixed(1) + ' J');
    setText('telem-etotal', state.etotal.toFixed(1) + ' J');

    if (simData && simData.landing) {
      setText('telem-range', simData.landing.x.toFixed(2) + ' m');
      if (simData.vacuum) {
        setText('telem-vac-range', simData.vacuum.range.toFixed(2) + ' m');
      }
    }
  }

  function updatePlaybackUI(status) {
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');

    if (status === 'playing') {
      if (btnPlay) btnPlay.disabled = true;
      if (btnPause) btnPause.disabled = false;
    } else {
      if (btnPlay) btnPlay.disabled = false;
      if (btnPause) btnPause.disabled = true;
    }
  }

  function syncSlidersFromSimulator(params) {
    setValue('slider-v0', 'val-v0', params.v0, ' m/s');
    setValue('slider-theta', 'val-theta', params.thetaDeg, '°');
    setValue('slider-m', 'val-m', params.m, ' kg');
    setValue('slider-c', 'val-c', params.c, ' kg/m');
    setValue('slider-g', 'val-g', params.g, ' m/s²');
    setValue('slider-y0', 'val-y0', params.y0, ' m');
  }

  function setValue(inputId, valId, value, unit) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(valId);
    if (input) input.value = value;
    if (label) label.textContent = value + unit;
  }

  // ======================================================================
  // MODE 2: VEHICLE & WIND VECTOR FIELD SIMULATOR BRIDGE
  // ======================================================================

  function initVehicleSimulator() {
    const canvas = document.getElementById('vehicle-canvas');
    if (!canvas || !window.VehicleVectorFieldSimulator) return;

    vehicleSimulatorInstance = new window.VehicleVectorFieldSimulator(canvas, {
      onTelemetryUpdate: updateVehicleTelemetryUI
    });
    window.vehicleSimulatorInstance = vehicleSimulatorInstance;

    // Action buttons
    const btnPlay = document.getElementById('btn-veh-play');
    const btnPause = document.getElementById('btn-veh-pause');
    const btnStep = document.getElementById('btn-veh-step');
    const btnReset = document.getElementById('btn-veh-reset');
    const btnClearWp = document.getElementById('btn-veh-clear-wp');

    if (btnPlay) btnPlay.addEventListener('click', () => {
      vehicleSimulatorInstance.play();
      btnPlay.disabled = true;
      if (btnPause) btnPause.disabled = false;
    });
    if (btnPause) btnPause.addEventListener('click', () => {
      vehicleSimulatorInstance.pause();
      if (btnPlay) btnPlay.disabled = false;
      btnPause.disabled = true;
    });
    if (btnStep) btnStep.addEventListener('click', () => {
      vehicleSimulatorInstance.step(0.05);
      if (btnPlay) btnPlay.disabled = false;
      if (btnPause) btnPause.disabled = true;
    });
    if (btnReset) btnReset.addEventListener('click', () => {
      vehicleSimulatorInstance.reset();
      if (btnPlay) btnPlay.disabled = false;
      if (btnPause) btnPause.disabled = true;
    });
    if (btnClearWp) btnClearWp.addEventListener('click', () => {
      vehicleSimulatorInstance.clearWaypoints();
    });

    // Sliders
    const sSpeed = document.getElementById('slider-veh-speed');
    const lSpeed = document.getElementById('val-veh-speed');
    if (sSpeed) sSpeed.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (lSpeed) lSpeed.textContent = val.toFixed(1) + ' m/s';
      vehicleSimulatorInstance.setParams({ speed: val });
    });

    const sSteer = document.getElementById('slider-veh-steer');
    const lSteer = document.getElementById('val-veh-steer');
    if (sSteer) sSteer.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (lSteer) lSteer.textContent = val.toFixed(1) + '°';
      vehicleSimulatorInstance.setParams({ steerAngleDeg: val });
    });

    const sWindSpd = document.getElementById('slider-veh-wind-speed');
    const lWindSpd = document.getElementById('val-veh-wind-speed');
    if (sWindSpd) sWindSpd.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (lWindSpd) lWindSpd.textContent = val.toFixed(1) + ' m/s';
      vehicleSimulatorInstance.setParams({ windSpeed: val });
    });

    const sWindDir = document.getElementById('slider-veh-wind-dir');
    const lWindDir = document.getElementById('val-veh-wind-dir');
    if (sWindDir) sWindDir.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (lWindDir) lWindDir.textContent = val + '°';
      vehicleSimulatorInstance.setParams({ windDirDeg: val });
    });

    const selPattern = document.getElementById('select-veh-pattern');
    if (selPattern) selPattern.addEventListener('change', (e) => {
      vehicleSimulatorInstance.setParams({ windPattern: e.target.value });
    });
  }

  function updateVehicleTelemetryUI(telem) {
    if (!telem) return;
    setText('telem-veh-s', telem.odometer.toFixed(2) + ' m');
    setText('telem-veh-dr', telem.displacement.toFixed(2) + ' m');
    setText('telem-veh-vcar', telem.vCar.toFixed(1) + ' m/s');
    setText('telem-veh-vwind', telem.vWind.toFixed(1) + ' m/s');
    setText('telem-veh-vrel', telem.vRel.toFixed(2) + ' m/s');
    setText('telem-veh-drag', telem.dragForce.toFixed(1) + ' N');
    setText('telem-veh-heading', telem.headingDeg.toFixed(1) + '°');
    setText('telem-veh-alat', telem.lateralAcc.toFixed(2) + ' m/s²');
  }

  // ======================================================================
  // MODE 3: COLLISION & IMPULSE SIMULATOR BRIDGE
  // ======================================================================

  function initCollisionSimulator() {
    const canvas = document.getElementById('collision-canvas');
    if (!canvas || !window.CollisionImpulseSimulator) return;

    collisionSimulatorInstance = new window.CollisionImpulseSimulator(canvas, {
      onTelemetryUpdate: updateCollisionTelemetryUI
    });
    window.collisionSimulatorInstance = collisionSimulatorInstance;

    // Action buttons
    const btnPlay = document.getElementById('btn-col-play');
    const btnPause = document.getElementById('btn-col-pause');
    const btnStep = document.getElementById('btn-col-step');
    const btnReset = document.getElementById('btn-col-reset');

    if (btnPlay) btnPlay.addEventListener('click', () => {
      collisionSimulatorInstance.play();
      btnPlay.disabled = true;
      if (btnPause) btnPause.disabled = false;
    });
    if (btnPause) btnPause.addEventListener('click', () => {
      collisionSimulatorInstance.pause();
      if (btnPlay) btnPlay.disabled = false;
      btnPause.disabled = true;
    });
    if (btnStep) btnStep.addEventListener('click', () => {
      collisionSimulatorInstance.step(0.02);
      if (btnPlay) btnPlay.disabled = false;
      if (btnPause) btnPause.disabled = true;
    });
    if (btnReset) btnReset.addEventListener('click', () => {
      collisionSimulatorInstance.reset();
      if (btnPlay) btnPlay.disabled = false;
      if (btnPause) btnPause.disabled = true;
    });

    // Preset buttons
    const presets = document.querySelectorAll('.btn-col-preset');
    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.dataset.preset;
        if (p === 'elastic') {
          collisionSimulatorInstance.setParams({ e: 1.0 });
          setValue('slider-col-e', 'val-col-e', 1.0, '');
        } else if (p === 'inelastic') {
          collisionSimulatorInstance.setParams({ e: 0.8 });
          setValue('slider-col-e', 'val-col-e', 0.8, '');
        } else if (p === 'sticky') {
          collisionSimulatorInstance.setParams({ e: 0.0 });
          setValue('slider-col-e', 'val-col-e', 0.0, '');
        }
        collisionSimulatorInstance.reset();
      });
    });

    // Sliders
    const bindColSlider = (sliderId, labelId, paramKey, unit) => {
      const slider = document.getElementById(sliderId);
      const label = document.getElementById(labelId);
      if (!slider) return;
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (label) label.textContent = val.toFixed(1) + unit;
        collisionSimulatorInstance.setParams({ [paramKey]: val });
      });
    };

    bindColSlider('slider-col-m1', 'val-col-m1', 'm1', ' kg');
    bindColSlider('slider-col-m2', 'val-col-m2', 'm2', ' kg');
    bindColSlider('slider-col-u1', 'val-col-u1', 'u1', ' m/s');
    bindColSlider('slider-col-u2', 'val-col-u2', 'u2', ' m/s');
    bindColSlider('slider-col-e', 'val-col-e', 'e', '');
  }

  function updateCollisionTelemetryUI(telem) {
    if (!telem) return;
    setText('telem-col-p1', (telem.p1 >= 0 ? '+' : '') + telem.p1.toFixed(1) + ' kg·m/s');
    setText('telem-col-p2', (telem.p2 >= 0 ? '+' : '') + telem.p2.toFixed(1) + ' kg·m/s');
    setText('telem-col-ptot', (telem.pTotal >= 0 ? '+' : '') + telem.pTotal.toFixed(1) + ' kg·m/s');
    setText('telem-col-impulse', telem.impulse.toFixed(2) + ' N·s');
    setText('telem-col-fpeak', telem.peakForce.toFixed(0) + ' N');
    setText('telem-col-ki', telem.keInitial.toFixed(1) + ' J');
    setText('telem-col-kcurr', telem.keCurrent.toFixed(1) + ' J');
    setText('telem-col-kloss', (telem.keLoss >= 0 ? '+' : '') + telem.keLoss.toFixed(1) + ' J');

    const statusEl = document.getElementById('telem-col-status');
    if (statusEl) {
      if (telem.inCollision) {
        statusEl.textContent = '⚡ กำลังปะทะ (Impact!)';
        statusEl.style.color = '#EF4444';
      } else if (telem.collisionCompleted) {
        statusEl.textContent = '✓ ชนเสร็จสิ้น (Post-impact)';
        statusEl.style.color = '#10B981';
      } else {
        statusEl.textContent = 'ก่อนชน (Pre-impact)';
        statusEl.style.color = 'var(--text-primary)';
      }
    }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // Keyboard accessibility
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger if focus is inside input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (activeSimMode === 'projectile' && simulatorInstance) {
          if (simulatorInstance.isRunning && !simulatorInstance.isPaused) {
            simulatorInstance.pause();
          } else {
            simulatorInstance.play();
          }
        } else if (activeSimMode === 'vehicle' && vehicleSimulatorInstance) {
          if (vehicleSimulatorInstance.isPlaying) {
            vehicleSimulatorInstance.pause();
          } else {
            vehicleSimulatorInstance.play();
          }
        } else if (activeSimMode === 'collision' && collisionSimulatorInstance) {
          if (collisionSimulatorInstance.isPlaying) {
            collisionSimulatorInstance.pause();
          } else {
            collisionSimulatorInstance.play();
          }
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        if (activeSimMode === 'projectile' && simulatorInstance) simulatorInstance.reset();
        if (activeSimMode === 'vehicle' && vehicleSimulatorInstance) vehicleSimulatorInstance.reset();
        if (activeSimMode === 'collision' && collisionSimulatorInstance) collisionSimulatorInstance.reset();
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        if (activeSimMode === 'projectile' && simulatorInstance) simulatorInstance.stepForward(0.05);
        if (activeSimMode === 'vehicle' && vehicleSimulatorInstance) vehicleSimulatorInstance.step(0.05);
        if (activeSimMode === 'collision' && collisionSimulatorInstance) collisionSimulatorInstance.step(0.02);
        if (activeSimMode === 'threejs' && threejsSimulatorInstance) threejsSimulatorInstance.step(0.05);
      } else if (e.code === 'Space') {
        if (activeSimMode === 'threejs' && threejsSimulatorInstance) {
          e.preventDefault();
          if (threejsSimulatorInstance.isPlaying) threejsSimulatorInstance.pause();
          else threejsSimulatorInstance.play();
        }
      } else if (e.code === 'KeyR') {
        if (activeSimMode === 'threejs' && threejsSimulatorInstance) {
          threejsSimulatorInstance.reset();
        }
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowRight') {
        if (activeSimMode === 'projectile' && simulatorInstance) {
          const newAngle = Math.min(90, simulatorInstance.params.thetaDeg + 1);
          simulatorInstance.updateParams({ thetaDeg: newAngle });
          syncSlidersFromSimulator(simulatorInstance.params);
        } else if (activeSimMode === 'threejs' && threejsSimulatorInstance) {
          const newAngle = Math.min(85, threejsSimulatorInstance.params.elevationDeg + 1);
          threejsSimulatorInstance.setParams({ elevationDeg: newAngle });
          syncThreejsSliders();
        }
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowLeft') {
        if (activeSimMode === 'projectile' && simulatorInstance) {
          const newAngle = Math.max(0, simulatorInstance.params.thetaDeg - 1);
          simulatorInstance.updateParams({ thetaDeg: newAngle });
          syncSlidersFromSimulator(simulatorInstance.params);
        } else if (activeSimMode === 'threejs' && threejsSimulatorInstance) {
          const newAngle = Math.max(10, threejsSimulatorInstance.params.elevationDeg - 1);
          threejsSimulatorInstance.setParams({ elevationDeg: newAngle });
          syncThreejsSliders();
        }
      }
    });
  }

  // ======================================================================
  // MODE 4: THREE.JS 3D BALLISTICS SIMULATOR
  // ======================================================================

  function initThreejsSimulator() {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas || !window.ThreejsBallisticsSimulator) return;

    threejsSimulatorInstance = new window.ThreejsBallisticsSimulator(canvas, {
      params: {
        v0: 80.0,
        elevationDeg: 45.0,
        azimuthDeg: 0.0,
        windSpeed: 15.0,
        windAzimuthDeg: 90.0,
        c: 0.04,
        m: 5.0
      },
      onTelemetry: updateThreejsTelemetryUI,
      onStatusChange: (status) => {
        const btnPlay = document.getElementById('btn-threejs-play');
        const btnPause = document.getElementById('btn-threejs-pause');
        if (btnPlay && btnPause) {
          if (status === 'playing') {
            btnPlay.disabled = true;
            btnPause.disabled = false;
          } else {
            btnPlay.disabled = false;
            btnPause.disabled = true;
          }
        }
      }
    });

    window.threejsSimulatorInstance = threejsSimulatorInstance;

    // Action Buttons
    const btnPlay = document.getElementById('btn-threejs-play');
    const btnPause = document.getElementById('btn-threejs-pause');
    const btnStep = document.getElementById('btn-threejs-step');
    const btnReset = document.getElementById('btn-threejs-reset');

    if (btnPlay) btnPlay.addEventListener('click', () => {
      threejsSimulatorInstance.play();
      btnPlay.disabled = true;
      if (btnPause) btnPause.disabled = false;
    });
    if (btnPause) btnPause.addEventListener('click', () => {
      threejsSimulatorInstance.pause();
      if (btnPlay) btnPlay.disabled = false;
      btnPause.disabled = true;
    });
    if (btnStep) btnStep.addEventListener('click', () => {
      threejsSimulatorInstance.step(0.05);
      if (btnPlay) btnPlay.disabled = false;
      if (btnPause) btnPause.disabled = true;
    });
    if (btnReset) btnReset.addEventListener('click', () => {
      threejsSimulatorInstance.reset();
      if (btnPlay) btnPlay.disabled = false;
      if (btnPause) btnPause.disabled = true;
    });

    // Preset Buttons
    const btnPresetCrosswind = document.getElementById('btn-threejs-preset-crosswind');
    if (btnPresetCrosswind) btnPresetCrosswind.addEventListener('click', () => {
      threejsSimulatorInstance.setParams({ v0: 80, elevationDeg: 45, azimuthDeg: 0, windSpeed: 25, windAzimuthDeg: 90, c: 0.06 });
      syncThreejsSliders();
    });
    const btnPresetMortar = document.getElementById('btn-threejs-preset-mortar');
    if (btnPresetMortar) btnPresetMortar.addEventListener('click', () => {
      threejsSimulatorInstance.setParams({ v0: 95, elevationDeg: 70, azimuthDeg: 15, windSpeed: 10, windAzimuthDeg: 45, c: 0.03 });
      syncThreejsSliders();
    });
    const btnPresetVacuum = document.getElementById('btn-threejs-preset-vacuum');
    if (btnPresetVacuum) btnPresetVacuum.addEventListener('click', () => {
      threejsSimulatorInstance.setParams({ v0: 70, elevationDeg: 45, azimuthDeg: 0, windSpeed: 0, windAzimuthDeg: 90, c: 0.0 });
      syncThreejsSliders();
    });

    // Parameter Sliders
    bindThreejsSlider('threejs-slider-v0', 'threejs-val-v0', ' m/s', 1, (val) => {
      threejsSimulatorInstance.setParams({ v0: val });
    });
    bindThreejsSlider('threejs-slider-elev', 'threejs-val-elev', '°', 1, (val) => {
      threejsSimulatorInstance.setParams({ elevationDeg: val });
    });
    bindThreejsSlider('threejs-slider-azim', 'threejs-val-azim', '°', 1, (val) => {
      threejsSimulatorInstance.setParams({ azimuthDeg: val });
    });
    bindThreejsSlider('threejs-slider-wind', 'threejs-val-wind', ' m/s', 1, (val) => {
      threejsSimulatorInstance.setParams({ windSpeed: val });
    });
    bindThreejsSlider('threejs-slider-drag', 'threejs-val-drag', ' kg/m', 2, (val) => {
      threejsSimulatorInstance.setParams({ c: val });
    });
    bindThreejsSlider('threejs-slider-mass', 'threejs-val-mass', ' kg', 1, (val) => {
      threejsSimulatorInstance.setParams({ m: val });
    });

    syncThreejsSliders();
  }

  function bindThreejsSlider(sliderId, labelId, unit, decimals, onChange) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    if (!slider) return;
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (label) label.textContent = val.toFixed(decimals) + unit;
      onChange(val);
    });
  }

  function syncThreejsSliders() {
    if (!threejsSimulatorInstance) return;
    const p = threejsSimulatorInstance.params;
    const setVal = (id, labelId, val, unit, dec) => {
      const s = document.getElementById(id);
      const l = document.getElementById(labelId);
      if (s) s.value = val;
      if (l) l.textContent = val.toFixed(dec) + unit;
    };
    setVal('threejs-slider-v0', 'threejs-val-v0', p.v0, ' m/s', 1);
    setVal('threejs-slider-elev', 'threejs-val-elev', p.elevationDeg, '°', 1);
    setVal('threejs-slider-azim', 'threejs-val-azim', p.azimuthDeg, '°', 1);
    setVal('threejs-slider-wind', 'threejs-val-wind', p.windSpeed, ' m/s', 1);
    setVal('threejs-slider-drag', 'threejs-val-drag', p.c, ' kg/m', 2);
    setVal('threejs-slider-mass', 'threejs-val-mass', p.m, ' kg', 1);
  }

  function updateThreejsTelemetryUI(telem) {
    if (!telem) return;
    setText('threejs-telem-time', telem.t.toFixed(2) + ' s');
    setText('threejs-telem-x', telem.x.toFixed(1) + ' m');
    setText('threejs-telem-y', telem.y.toFixed(1) + ' m');
    setText('threejs-telem-z', telem.driftZ.toFixed(1) + ' m');
    setText('threejs-telem-speed', telem.speed.toFixed(1) + ' m/s');
    setText('threejs-telem-range', telem.rangeXY.toFixed(1) + ' m');
    setText('threejs-telem-loss', telem.energyDissipatedPct.toFixed(1) + ' %');
  }

  // Teardown hook for clean testing
  window.PhysicsApp = {
    init,
    switchView,
    switchSimMode,
    launchSimulatorPreset,
    getSimulator: () => simulatorInstance,
    getVehicleSimulator: () => vehicleSimulatorInstance,
    getCollisionSimulator: () => collisionSimulatorInstance,
    getThreejsSimulator: () => threejsSimulatorInstance,
    renderAnalyticalContent
  };

  document.addEventListener('DOMContentLoaded', init);
})();

