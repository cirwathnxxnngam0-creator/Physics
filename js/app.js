/**
 * app.js - PhysicsNoza 3.0 Main Application Controller
 * Manages view routing, academic tier switching, KaTeX math rendering,
 * Division & Theory curriculum architecture, navigation drawer, and simulator lifecycle.
 */

(function () {
  'use strict';

  // Global App State
  let currentChapter = 'ch01';            // 'ch01' | 'ch02' | ...
  let currentView = 'view-landing';
  let lastLessonView = 'view-theory';
  let currentTier = 'highSchool';
  let activeDivisionFilter = 'all';
  let activeFormulaDivisionFilter = 'all';
  let activeSymbolDomain = 'all';
  let activeRecallMode = false;

  let simulatorInstance = null;           // Mode 1: Projectile
  let vehicleSimulatorInstance = null;     // Mode 2: Racing Car & Vector Field
  let collisionSimulatorInstance = null;   // Mode 3: Collision & Impulse
  let threejsSimulatorInstance = null;     // Mode 4: Three.js 3D Ballistics
  let circularSimulatorInstance = null;   // Chapter 02: Circular Dynamics
  let oscillationSimulatorInstance = null; // Chapter 03: Oscillations & Resonance
  let waveSimulatorInstance = null;        // Chapter 04: Mechanical Waves & Acoustics
  let thermoSimulatorInstance = null;      // Chapter 05: Thermodynamics & Kinetic Theory
  let emSimulatorInstance = null;          // Chapter 06: Electromagnetism & Circuits
  let nuclearSimulatorInstance = null;     // Chapter 07: Nuclear & Modern Physics
  let civilSimulatorInstance = null;       // Track 3: Civil Engineering Statics & Mechanics
  let activeSimMode = 'projectile';        // 'projectile' | 'vehicle' | 'collision' | 'threejs' | 'circular'

  // Performance & Lazy Rendering State
  const viewNeedsUpdate = {
    'view-theory': true,
    'view-formulas': true,
    'view-phenomena': true,
    'view-summary': true,
    'view-examples': true
  };

  /**
   * Centralized Simulator Lifecycle Guard
   * Pauses all background requestAnimationFrame loops across all 11 simulators
   */
  function pauseAllSimulators() {
    if (simulatorInstance && typeof simulatorInstance.pause === 'function') simulatorInstance.pause();
    if (vehicleSimulatorInstance && typeof vehicleSimulatorInstance.pause === 'function') vehicleSimulatorInstance.pause();
    if (collisionSimulatorInstance && typeof collisionSimulatorInstance.pause === 'function') collisionSimulatorInstance.pause();
    if (threejsSimulatorInstance && typeof threejsSimulatorInstance.pause === 'function') threejsSimulatorInstance.pause();
    if (circularSimulatorInstance && typeof circularSimulatorInstance.pause === 'function') circularSimulatorInstance.pause();
    if (oscillationSimulatorInstance && typeof oscillationSimulatorInstance.pause === 'function') oscillationSimulatorInstance.pause();
    if (waveSimulatorInstance && typeof waveSimulatorInstance.pause === 'function') waveSimulatorInstance.pause();
    if (thermoSimulatorInstance && typeof thermoSimulatorInstance.pause === 'function') thermoSimulatorInstance.pause();
    if (emSimulatorInstance && typeof emSimulatorInstance.pause === 'function') emSimulatorInstance.pause();
    if (nuclearSimulatorInstance && typeof nuclearSimulatorInstance.pause === 'function') nuclearSimulatorInstance.pause();
    if (civilSimulatorInstance && typeof civilSimulatorInstance.pause === 'function') civilSimulatorInstance.pause();
  }

  // ======================================================================
  // PRACTICE PROBLEM ENGINE & LEARNING PORTAL CONTROLLERS
  // ======================================================================

  let currentPracticeTrack = 'all';
  const practiceAnswersState = {};

  function setupPracticeEngine() {
    const trackBtns = document.querySelectorAll('.practice-tab-btn');
    trackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        trackBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPracticeTrack = btn.dataset.track;
        renderPracticeProblems();
      });
    });

    // Wire Landing 3-Track Portal Buttons
    const btnPortalFundTheory = document.getElementById('btn-portal-fund-theory');
    if (btnPortalFundTheory) {
      btnPortalFundTheory.addEventListener('click', () => {
        openChapter('ch01');
        switchView('view-theory');
      });
    }

    const btnPortalFundSim = document.getElementById('btn-portal-fund-sim');
    if (btnPortalFundSim) {
      btnPortalFundSim.addEventListener('click', () => {
        openChapter('ch01');
        switchView('view-simulator');
        switchSimMode('projectile');
      });
    }

    const btnPortalFundPractice = document.getElementById('btn-portal-fund-practice');
    if (btnPortalFundPractice) {
      btnPortalFundPractice.addEventListener('click', () => {
        currentPracticeTrack = 'fundamental';
        document.querySelectorAll('.practice-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.track === 'fundamental'));
        switchView('view-practice');
        renderPracticeProblems();
      });
    }

    const btnPortalAdvTheory = document.getElementById('btn-portal-adv-theory');
    if (btnPortalAdvTheory) {
      btnPortalAdvTheory.addEventListener('click', () => {
        switchView('view-analytical');
      });
    }

    const btnPortalAdvSim = document.getElementById('btn-portal-adv-sim');
    if (btnPortalAdvSim) {
      btnPortalAdvSim.addEventListener('click', () => {
        switchView('view-analytical');
      });
    }

    const btnPortalAdvPractice = document.getElementById('btn-portal-adv-practice');
    if (btnPortalAdvPractice) {
      btnPortalAdvPractice.addEventListener('click', () => {
        currentPracticeTrack = 'advanced';
        document.querySelectorAll('.practice-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.track === 'advanced'));
        switchView('view-practice');
        renderPracticeProblems();
      });
    }

    const btnPortalCivTheory = document.getElementById('btn-portal-civ-theory');
    if (btnPortalCivTheory) {
      btnPortalCivTheory.addEventListener('click', () => {
        openChapter('civil_eng');
        switchView('view-theory');
      });
    }

    const btnPortalCivSim = document.getElementById('btn-portal-civ-sim');
    if (btnPortalCivSim) {
      btnPortalCivSim.addEventListener('click', () => {
        openChapter('civil_eng');
        switchView('view-simulator');
        switchSimMode('civil', 'simply_supported');
      });
    }

    const btnPortalCivPractice = document.getElementById('btn-portal-civ-practice');
    if (btnPortalCivPractice) {
      btnPortalCivPractice.addEventListener('click', () => {
        currentPracticeTrack = 'civil';
        document.querySelectorAll('.practice-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.track === 'civil'));
        switchView('view-practice');
        renderPracticeProblems();
      });
    }

    renderPracticeProblems();
  }

  function renderPracticeProblems() {
    const container = document.getElementById('practice-problems-target');
    if (!container || !window.PracticeProblemsContent) return;

    let problems = window.PracticeProblemsContent.problems || [];
    if (currentPracticeTrack !== 'all') {
      problems = problems.filter(p => p.track === currentPracticeTrack);
    }

    const totalEl = document.getElementById('practice-total-display');
    if (totalEl) totalEl.textContent = problems.length;

    updatePracticeScore();

    const letters = ['ก', 'ข', 'ค', 'ง'];

    container.innerHTML = problems.map((prob, idx) => {
      const state = practiceAnswersState[prob.id] || { answered: false, selectedIdx: -1, isCorrect: false, showSolution: false };
      const cardClass = state.answered ? (state.isCorrect ? 'answered-correct' : 'answered-incorrect') : '';

      return `
        <div class="practice-card ${cardClass}" id="prob-card-${prob.id}" data-prob-id="${prob.id}">
          <div class="practice-card-header">
            <span class="practice-card-chapter">${prob.chapterTitle}</span>
            <span class="practice-card-difficulty">${prob.difficulty}</span>
          </div>
          <h3 class="practice-card-title">ข้อที่ ${idx + 1}: ${prob.title}</h3>
          <div class="practice-question-text">
            ${prob.question}
          </div>

          <div class="practice-options-list">
            ${prob.options.map((opt, optIdx) => {
              let optClass = '';
              if (state.answered) {
                if (optIdx === prob.correctIndex) {
                  optClass = 'correct';
                } else if (optIdx === state.selectedIdx) {
                  optClass = 'incorrect';
                }
              }
              return `
                <div class="practice-option-item ${optClass}" data-prob-id="${prob.id}" data-opt-idx="${optIdx}">
                  <span class="practice-option-label">${letters[optIdx]}</span>
                  <span class="practice-option-text">${opt}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div class="practice-action-row">
            <button class="btn-toggle-solution" data-prob-id="${prob.id}">
              ${state.showSolution ? '▲ ซ่อนวิธีทำละเอียด' : '▼ แสดงเฉลยวิธีทำละเอียด'}
            </button>
            ${prob.simLink && prob.simLink.available !== false ? `
              <button class="btn-jump-sim-practice" data-chapter="${prob.simLink.chapter}" data-sim-mode="${prob.simLink.mode}" data-submode="${prob.simLink.submode || ''}" data-engine-type="${prob.simLink.engineType || ''}">
                🎯 เปิดแบบจำลองเพื่อทดสอบสถานการณ์นี้ →
              </button>
            ` : `
              <span class="badge-sim-unavailable" style="display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.78rem; font-weight: 600; padding: 0.4rem 0.75rem; border-radius: 6px; background: rgba(148, 163, 184, 0.08); color: #94a3b8; border: 1px dashed rgba(148, 163, 184, 0.28);">
                ⏳ ${prob.simLink?.label || 'แบบจำลองเฉพาะเรื่องนี้อยู่ระหว่างการพัฒนา'}
              </span>
            `}
          </div>

          <div class="practice-solution-box" id="sol-box-${prob.id}" style="display: ${state.showSolution ? 'block' : 'none'};">
            <div class="solution-box-title">
              💡 เฉลยละเอียดและขั้นตอนวิธีคิด (Step-by-step Solution):
            </div>
            ${prob.alternativeExplanation ? `
              <div class="practice-method-tabs">
                <button class="method-tab-btn active" data-prob-id="${prob.id}" data-method="1">📘 วิธีที่ 1: วิธีมาตรฐานตามตำรา (Standard)</button>
                <button class="method-tab-btn" data-prob-id="${prob.id}" data-method="2">⚡ วิธีที่ 2: วิธีทางเลือกใหม่ (Novel Alternative)</button>
              </div>
              <div class="method-content method-content-1 active" id="method-1-${prob.id}">
                ${prob.explanation.replace(/\\n/g, '<br>')}
              </div>
              <div class="method-content method-content-2" id="method-2-${prob.id}" style="display: none;">
                ${prob.alternativeExplanation.replace(/\\n/g, '<br>')}
              </div>
            ` : `
              <div class="solution-prose">
                ${prob.explanation.replace(/\\n/g, '<br>')}
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Attach option click handlers
    container.querySelectorAll('.practice-option-item').forEach(optEl => {
      optEl.addEventListener('click', () => {
        const probId = optEl.dataset.probId;
        const optIdx = parseInt(optEl.dataset.optIdx, 10);
        handlePracticeOptionSelect(probId, optIdx);
      });
    });

    // Attach solution toggle handlers
    container.querySelectorAll('.btn-toggle-solution').forEach(btn => {
      btn.addEventListener('click', () => {
        const probId = btn.dataset.probId;
        togglePracticeSolution(probId);
      });
    });

    // Attach dual-methodology tab switch handlers
    container.querySelectorAll('.method-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const probId = btn.dataset.probId;
        const method = btn.dataset.method;
        const parentCard = document.getElementById(`prob-card-${probId}`);
        if (!parentCard) return;
        parentCard.querySelectorAll('.method-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        const m1 = parentCard.querySelector(`#method-1-${probId}`);
        const m2 = parentCard.querySelector(`#method-2-${probId}`);
        if (m1 && m2) {
          if (method === '1') {
            m1.style.display = 'block';
            m2.style.display = 'none';
          } else {
            m1.style.display = 'none';
            m2.style.display = 'block';
          }
          if (window.MathRenderer) window.MathRenderer.typeset(parentCard);
        }
      });
    });

    // Attach simulator jump handlers
    container.querySelectorAll('.btn-jump-sim-practice').forEach(btn => {
      btn.addEventListener('click', () => {
        const chapter = btn.dataset.chapter;
        const mode = btn.dataset.simMode;
        const submode = btn.dataset.submode || null;
        const engineType = btn.dataset.engineType;
        openChapter(chapter);
        switchView('view-simulator');
        switchSimMode(mode, submode);
        if (engineType && typeof window.thermoSimulatorInstance?.setEngineType === 'function') {
          window.thermoSimulatorInstance.setEngineType(engineType);
        }
        const selEngineType = document.getElementById('thermo-engine-type');
        if (selEngineType && engineType) {
          selEngineType.value = engineType;
        }
      });
    });

    if (window.MathRenderer) {
      window.MathRenderer.typeset(container);
    }
  }

  function handlePracticeOptionSelect(probId, selectedIdx) {
    const prob = (window.PracticeProblemsContent.problems || []).find(p => p.id === probId);
    if (!prob) return;

    const isCorrect = (selectedIdx === prob.correctIndex);
    practiceAnswersState[probId] = {
      answered: true,
      selectedIdx: selectedIdx,
      isCorrect: isCorrect,
      showSolution: true
    };

    renderPracticeProblems();
  }

  function togglePracticeSolution(probId) {
    if (!practiceAnswersState[probId]) {
      practiceAnswersState[probId] = { answered: false, selectedIdx: -1, isCorrect: false, showSolution: true };
    } else {
      practiceAnswersState[probId].showSolution = !practiceAnswersState[probId].showSolution;
    }
    const solBox = document.getElementById(`sol-box-${probId}`);
    const btn = document.querySelector(`.btn-toggle-solution[data-prob-id="${probId}"]`);
    if (solBox) {
      const isVisible = practiceAnswersState[probId].showSolution;
      solBox.style.display = isVisible ? 'block' : 'none';
      if (btn) btn.textContent = isVisible ? '▲ ซ่อนวิธีทำละเอียด' : '▼ แสดงเฉลยวิธีทำละเอียด';
      if (isVisible && window.MathRenderer) {
        window.MathRenderer.typeset(solBox);
      }
    }
  }

  function updatePracticeScore() {
    let score = 0;
    Object.values(practiceAnswersState).forEach(st => {
      if (st.isCorrect) score++;
    });
    const scoreEl = document.getElementById('practice-score-display');
    if (scoreEl) scoreEl.textContent = score;
  }

  function init() {
    setupViewNavigation();
    setupDrawerNavigation();
    renderDrawerCatalog();
    setupActionButtons();
    setupTierSwitcher();
    renderTheoryContent();
    renderFormulasContent();
    renderPhenomenaContent();
    renderAnalyticalContent();
    initSimulator();
    initVehicleSimulator();
    initCollisionSimulator();
    initThreejsSimulator();
    initCircularSimulator();
    initOscillationSimulator();
    initWaveSimulator();
    initThermoSimulator();
    initEMSimulator();
    initNuclearSimulator();
    initCivilSimulator();
    setupSimulatorModeSwitcher();
    setupUniversalNumericInputs();
    setupUniversalSpeedControls();
    setupPracticeEngine();
    renderSimulatorEduContext(activeSimMode);
    setupKeyboardShortcuts();
    setupMobileAccessModal();
    setupTextbookLibraryModal();
    setupBackgroundExecution();

    if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.init === 'function') {
      window.TelemetryMathInspector.init();
    }

    // Global window resize handler for active simulator canvas
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (currentView === 'view-simulator') {
          if (activeSimMode === 'projectile' && simulatorInstance) {
            simulatorInstance._setupCanvasResolution();
            simulatorInstance.render();
          } else if (activeSimMode === 'vehicle' && vehicleSimulatorInstance) {
            vehicleSimulatorInstance.resize();
            vehicleSimulatorInstance.render();
          } else if (activeSimMode === 'collision' && collisionSimulatorInstance) {
            collisionSimulatorInstance.resize();
            collisionSimulatorInstance.render();
          } else if (activeSimMode === 'threejs' && threejsSimulatorInstance) {
            threejsSimulatorInstance.resize();
            threejsSimulatorInstance.render();
          } else if (activeSimMode === 'circular' && circularSimulatorInstance) {
            circularSimulatorInstance.resize();
            circularSimulatorInstance.render();
          } else if (activeSimMode === 'oscillation' && oscillationSimulatorInstance) {
            oscillationSimulatorInstance.resize();
            oscillationSimulatorInstance.render();
          } else if (activeSimMode === 'wave' && waveSimulatorInstance) {
            waveSimulatorInstance.resize();
            waveSimulatorInstance.render();
          } else if (activeSimMode === 'thermo' && thermoSimulatorInstance) {
            thermoSimulatorInstance.resize();
            thermoSimulatorInstance.render();
          } else if (activeSimMode === 'em' && emSimulatorInstance) {
            emSimulatorInstance.resize();
            emSimulatorInstance.render();
          } else if (activeSimMode === 'nuclear' && nuclearSimulatorInstance) {
            nuclearSimulatorInstance.resize();
            nuclearSimulatorInstance.render();
          } else if (activeSimMode === 'civil' && civilSimulatorInstance) {
            civilSimulatorInstance.resize();
            civilSimulatorInstance.render();
          }
        }
      }, 100);
    });

    // Determine initial view based on URL hash or default to Landing Page
    const validViews = ['view-landing', 'view-chapter-select', 'view-theory', 'view-formulas', 'view-simulator', 'view-phenomena', 'view-summary', 'view-analytical', 'view-practice', 'view-textbooks', 'view-examples'];
    const initialHash = window.location.hash.replace(/^#/, '');
    const startView = validViews.includes(initialHash) ? initialHash : 'view-landing';
    switchView(startView, true);

    // Export helpers on window for deep linking and testing
    window.openChapter = openChapter;
    window.switchSimMode = switchSimMode;
    window.switchView = switchView;
    window.launchSimulatorForTheory = launchSimulatorForTheory;
    window.launchSimulatorPreset = launchSimulatorPreset;

    // Scoped math rendering for initial view only (eliminates full-DOM lockup)
    if (window.MathRenderer) {
      const activePanel = document.getElementById(startView);
      if (activePanel) window.MathRenderer.typeset(activePanel);
    }

    // Visibility Guard: pause physics engines if user minimizes or switches tabs
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseAllSimulators();
      }
    });
  }

  // View Navigation (Tab & Page Switching & Master Tracks)
  function setupViewNavigation() {
    const tabs = document.querySelectorAll('.view-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetViewId = tab.dataset.view;
        switchView(targetViewId);
      });
    });

    // Master Curriculum Track Switching (Image 1 & 2: ทฤษฎี, เนื้อหาภาควิชาชีพ, คลังโจทย์)
    const btnMasterTheory = document.getElementById('btn-master-theory');
    const btnMasterVocational = document.getElementById('btn-master-vocational');
    const btnMasterPractice = document.getElementById('btn-master-practice');
    const theoryCatalog = document.getElementById('bosa-theory-catalog');
    const vocationalCatalog = document.getElementById('bosa-vocational-catalog');
    const extendedCurriculum = document.getElementById('bosa-extended-curriculum');

    function setActiveMasterTrack(btnActive) {
      [btnMasterTheory, btnMasterVocational, btnMasterPractice].forEach(btn => {
        if (!btn) return;
        const isActive = (btn === btnActive);
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    if (btnMasterTheory) {
      btnMasterTheory.addEventListener('click', () => {
        setActiveMasterTrack(btnMasterTheory);
        if (theoryCatalog) theoryCatalog.style.display = 'block';
        if (vocationalCatalog) vocationalCatalog.style.display = 'none';
        if (extendedCurriculum) extendedCurriculum.style.display = 'block';
        switchView('view-chapter-select', true);
        document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      });
    }

    if (btnMasterVocational) {
      btnMasterVocational.addEventListener('click', () => {
        setActiveMasterTrack(btnMasterVocational);
        if (theoryCatalog) theoryCatalog.style.display = 'none';
        if (vocationalCatalog) vocationalCatalog.style.display = 'block';
        if (extendedCurriculum) extendedCurriculum.style.display = 'none';
        switchView('view-chapter-select', true);
        document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      });
    }

    if (btnMasterPractice) {
      btnMasterPractice.addEventListener('click', () => {
        setActiveMasterTrack(btnMasterPractice);
        switchView('view-practice', true);
        document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      });
    }

    // Wire all 24 Subject cards + Vocational cards for 1-click navigation
    document.querySelectorAll('.bosa-topic-card').forEach(card => {
      card.addEventListener('click', () => {
        const ch = card.dataset.chapter;
        const targetView = card.dataset.view || 'view-theory';
        if (ch === 'view-analytical') {
          switchView('view-analytical');
        } else if (ch) {
          openChapter(ch);
          switchView(targetView);
        }
      });
    });

    // Wire Plasma Fusion callout button
    const btnPlasmaSim = document.querySelector('.btn-plasma-sim-jump');
    if (btnPlasmaSim) {
      btnPlasmaSim.addEventListener('click', () => {
        openChapter('ch06');
        switchView('view-simulator');
        switchSimMode('em', 'lorentz_cyclotron');
      });
    }

    // Wire Quick Drawer Toggle Tab (< on right edge as drawn in Image 3 & 4)
    const btnDrawerSideTab = document.getElementById('drawer-side-tab-toggle');
    if (btnDrawerSideTab) {
      btnDrawerSideTab.addEventListener('click', () => {
        if (window.PhysicsApp && window.PhysicsApp.openDrawer) {
          const drawer = document.getElementById('drawer-navigation-catalog');
          if (drawer && drawer.classList.contains('open')) {
            window.PhysicsApp.closeDrawer();
          } else {
            window.PhysicsApp.openDrawer();
          }
        }
      });
    }
  }

  function switchView(viewId, force = false) {
    if (!force && currentView === viewId) return;

    // Reset scroll to top smoothly when switching between views
    document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    window.scrollTo(0, 0);

    // Track previous lesson view before switching to analytical or chapter selection
    if (currentView && currentView !== 'view-analytical' && currentView !== 'view-chapter-select' && currentView !== 'view-landing') {
      lastLessonView = currentView;
    }

    if (viewId === 'view-practice' && typeof renderPracticeProblems === 'function') {
      renderPracticeProblems();
    }

    // Strict Simulator Lifecycle: pause all background loops when leaving simulator view
    if (viewId !== 'view-simulator') {
      pauseAllSimulators();
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

    // Control visibility of header elements & tier bar based on view
    const backBtn = document.getElementById('btn-back-to-chapters');
    const chapterWrapper = document.getElementById('header-chapter-wrapper');
    const lessonBreadcrumb = document.getElementById('header-lesson-breadcrumb');
    const chapterSubnav = document.getElementById('chapter-subnav-bar');
    const mainViewNav = document.getElementById('main-view-nav');
    const tierBar = document.getElementById('app-tier-bar');

    const isLanding = (viewId === 'view-landing');
    const isChapterSelect = (viewId === 'view-chapter-select');
    const isAnalytical = (viewId === 'view-analytical');
    const isLesson = !isLanding && !isChapterSelect;

    if (backBtn) backBtn.style.display = isLesson ? 'inline-flex' : 'none';
    if (chapterWrapper) chapterWrapper.style.display = isLesson ? 'inline-flex' : 'none';
    if (lessonBreadcrumb) lessonBreadcrumb.style.display = isLesson ? 'flex' : 'none';
    if (mainViewNav) mainViewNav.style.display = isLesson ? 'flex' : 'none';
    if (chapterSubnav) chapterSubnav.style.display = isLesson ? 'block' : 'none';
    if (tierBar) tierBar.style.display = (isLesson && viewId !== 'view-simulator' && !isAnalytical && viewId !== 'view-textbooks') ? 'block' : 'none';

    currentView = viewId;

    // High-Performance Lazy Rendering: only render the active tab on-demand
    if (viewId === 'view-theory') {
      if (force || viewNeedsUpdate['view-theory']) {
        renderTheoryContent(currentChapter);
        viewNeedsUpdate['view-theory'] = false;
      }
    } else if (viewId === 'view-formulas') {
      if (force || viewNeedsUpdate['view-formulas']) {
        renderFormulasContent(currentChapter);
        viewNeedsUpdate['view-formulas'] = false;
      }
    } else if (viewId === 'view-phenomena') {
      if (force || viewNeedsUpdate['view-phenomena']) {
        renderPhenomenaContent(currentChapter);
        viewNeedsUpdate['view-phenomena'] = false;
      }
    } else if (viewId === 'view-summary') {
      if (force || viewNeedsUpdate['view-summary']) {
        renderSummaryContent(currentChapter);
        viewNeedsUpdate['view-summary'] = false;
      }
    } else if (viewId === 'view-examples') {
      if (force || viewNeedsUpdate['view-examples']) {
        renderExamplesContent(currentChapter);
        viewNeedsUpdate['view-examples'] = false;
      }
    } else if (viewId === 'view-textbooks') {
      if (window.TextbookLibrary && typeof window.TextbookLibrary.renderTextbookLibrary === 'function') {
        window.TextbookLibrary.renderTextbookLibrary();
      }
    }

    // If entering simulator, ensure active mode canvas is sized and rendered
    if (viewId === 'view-simulator') {
      renderSimulatorEduContext(activeSimMode);
      if (activeSimMode === 'projectile' && simulatorInstance) {
        simulatorInstance._setupCanvasResolution();
        simulatorInstance.render();
      } else if (activeSimMode === 'vehicle' && vehicleSimulatorInstance) {
        vehicleSimulatorInstance.resize();
        vehicleSimulatorInstance.render();
      } else if (activeSimMode === 'collision' && collisionSimulatorInstance) {
        collisionSimulatorInstance.resize();
        collisionSimulatorInstance.render();
      } else if (activeSimMode === 'threejs' && threejsSimulatorInstance) {
        setTimeout(() => {
          threejsSimulatorInstance.resize();
          threejsSimulatorInstance.render();
        }, 50);
      } else if (activeSimMode === 'circular' && circularSimulatorInstance) {
        circularSimulatorInstance.resize();
        circularSimulatorInstance.render();
      } else if (activeSimMode === 'oscillation' && oscillationSimulatorInstance) {
        oscillationSimulatorInstance.resize();
        oscillationSimulatorInstance.render();
      } else if (activeSimMode === 'wave' && waveSimulatorInstance) {
        waveSimulatorInstance.resize();
        waveSimulatorInstance.render();
      } else if (activeSimMode === 'thermo' && thermoSimulatorInstance) {
        thermoSimulatorInstance.resize();
        thermoSimulatorInstance.render();
      } else if (activeSimMode === 'em' && emSimulatorInstance) {
        emSimulatorInstance.resize();
        emSimulatorInstance.render();
      } else if (activeSimMode === 'nuclear' && nuclearSimulatorInstance) {
        nuclearSimulatorInstance.resize();
        nuclearSimulatorInstance.render();
      } else if (activeSimMode === 'civil' && civilSimulatorInstance) {
        civilSimulatorInstance.resize();
        civilSimulatorInstance.render();
      }
    }
  }

  // Navigation Drawer Management
  function setupDrawerNavigation() {
    const btnHamburger = document.getElementById('btn-hamburger-menu');
    const drawer = document.getElementById('drawer-navigation-catalog');
    const backdrop = document.getElementById('drawer-backdrop');
    const btnClose = document.getElementById('btn-close-drawer');

    if (!btnHamburger || !drawer || !backdrop) return;

    function openDrawer() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      btnHamburger.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
      if (btnClose) btnClose.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      btnHamburger.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
      backdrop.setAttribute('aria-hidden', 'true');
      btnHamburger.focus();
    }

    btnHamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) closeDrawer();
      else openDrawer();
    });

    const sideTabToggle = document.getElementById('drawer-side-tab-toggle');
    if (sideTabToggle) {
      sideTabToggle.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        if (isOpen) closeDrawer();
        else openDrawer();
      });
    }

    if (btnClose) btnClose.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    // Keyboard accessibility: Escape key closes drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    window.PhysicsApp = window.PhysicsApp || {};
    window.PhysicsApp.openDrawer = openDrawer;
    window.PhysicsApp.closeDrawer = closeDrawer;
    window.PhysicsApp.switchView = switchView;
  }

  // Render Theory Catalog & Chapter Switcher inside Drawer
  function renderDrawerCatalog(chapterId = currentChapter) {
    const target = document.getElementById('drawer-catalog-target');
    if (!target) return;

    let data = window.PhysicsTheoriesContent;
    let chapTitle = 'บทที่ 01: การเคลื่อนที่สองมิติและโปรเจกไทล์';

    if (chapterId === 'ch02') {
      data = window.Chapter02Content;
      chapTitle = 'บทที่ 02: การเคลื่อนที่แบบวงกลมและแรงสู่ศูนย์กลาง';
    } else if (chapterId === 'ch03') {
      data = window.Chapter03Content;
      chapTitle = 'บทที่ 03: การแกว่งกวัดและฮาร์มอนิกอย่างง่าย';
    } else if (chapterId === 'ch04') {
      data = window.Chapter04Content;
      chapTitle = 'บทที่ 04: คลื่นกลและเสียง';
    } else if (chapterId === 'ch05') {
      data = window.Chapter05Content;
      chapTitle = 'บทที่ 05: อุณหพลศาสตร์และทฤษฎีจลน์ของแก๊ส';
    } else if (chapterId === 'ch06') {
      data = window.Chapter06Content;
      chapTitle = 'บทที่ 06: ไฟฟ้าและแม่เหล็ก';
    } else if (chapterId === 'ch07') {
      data = window.Chapter07Content;
      chapTitle = 'บทที่ 07: ฟิสิกส์นิวเคลียร์และอนุภาค';
    }

    if (!data || !data.theories) return;

    let html = `
      <!-- Active Chapter Indicator Card -->
      <div class="drawer-current-chapter-card">
        <div class="drawer-cur-chap-label">บทเรียนปัจจุบัน (Active Chapter)</div>
        <div class="drawer-cur-chap-name">${chapTitle}</div>
      </div>

      <!-- Quick Back to Chapter Select Button -->
      <div style="margin-bottom: 1.25rem;">
        <button class="btn-back-nav" style="width: 100%; justify-content: center;" onclick="window.PhysicsApp.switchView('view-chapter-select'); window.PhysicsApp.closeDrawer();">
          ← กลับหน้าเลือกบทและสาขาวิชา
        </button>
      </div>

      <!-- Section Label -->
      <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.6rem;">
        สารบัญ ${data.divisions ? data.divisions.length : 0} ภาควิชา & ${data.theories.length} ทฤษฎีหลัก
      </div>
    `;

    // Render 4 Divisions with collapsible accordion
    data.divisions.forEach((div, idx) => {
      const divTheories = data.theories.filter(t => t.divisionId === div.id);
      const isFirst = (idx === 0);

      html += `
        <div class="drawer-division-group">
          <button class="drawer-division-header" aria-expanded="${isFirst ? 'true' : 'false'}" data-division-target="drawer-div-${div.id}">
            <span>${div.numeral}. ${div.titleTh}</span>
            <span class="drawer-acc-indicator">${isFirst ? '▾' : '▸'}</span>
          </button>
          <div class="drawer-division-theories" id="drawer-div-${div.id}" style="display: ${isFirst ? 'flex' : 'none'};">
            ${divTheories.map(t => `
              <a href="#theory-${t.id}" class="drawer-theory-link" data-theory-id="${t.id}">
                <span class="drawer-theory-num">${t.numberTh}</span>
                <span class="drawer-theory-title">${t.titleTh}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `
      <!-- Additional Gateway Links -->
      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
        <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
          สาขาวิชาการและหมวดอื่น ๆ
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
          <a href="#view-textbooks" class="drawer-theory-link" onclick="window.PhysicsApp.switchView('view-textbooks'); window.PhysicsApp.closeDrawer();">
            📚 คลังตำราและ PDF ฉบับเต็ม (Textbook Library & PDF Viewer)
          </a>
          <a href="#view-analytical" class="drawer-theory-link" onclick="window.PhysicsApp.switchView('view-analytical'); window.PhysicsApp.closeDrawer();">
            📐 คณิตศาสตร์สำหรับฟิสิกส์ 15 มิติ & กลศาสตร์วิเคราะห์ (Mathematics for Physics)
          </a>
          <div style="font-size: 0.78rem; color: var(--text-muted); padding: 0.4rem 0.6rem;">
            วิศวกรรมโยธา, ไฟฟ้า, เครื่องกล, ข้อสอบ สอวน., ก.ว. [ดูที่หน้าเลือกบท]
          </div>
        </div>
      </div>
    `;

    target.innerHTML = html;

    // Accordion Toggle Handlers
    target.querySelectorAll('.drawer-division-header').forEach(header => {
      header.addEventListener('click', () => {
        const divTargetId = header.dataset.divisionTarget;
        const panel = document.getElementById(divTargetId);
        const indicator = header.querySelector('.drawer-acc-indicator');
        if (panel) {
          const isExpanded = panel.style.display === 'flex';
          panel.style.display = isExpanded ? 'none' : 'flex';
          header.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
          if (indicator) indicator.textContent = isExpanded ? '▸' : '▾';
        }
      });
    });

    // Theory Link Click Handlers
    target.querySelectorAll('.drawer-theory-link[data-theory-id]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tId = link.dataset.theoryId;
        switchView('view-theory');
        if (window.PhysicsApp.closeDrawer) window.PhysicsApp.closeDrawer();
        setTimeout(() => {
          const targetEl = document.getElementById('theory-' + tId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetEl.style.transition = 'box-shadow 0.5s ease';
            targetEl.style.boxShadow = '0 0 0 3px #EA580C';
            setTimeout(() => { targetEl.style.boxShadow = ''; }, 2200);
          }
        }, 120);
      });
    });
  }

  // Setup Global Action Buttons
  function setupActionButtons() {
    // 1. Enter Website from Hero
    const btnEnter = document.getElementById('btn-enter-website');
    if (btnEnter) {
      btnEnter.addEventListener('click', () => {
        switchView('view-chapter-select');
      });
    }

    // 1-B. Hero Secondary Actions (Math, Textbooks, Practice)
    const btnHeroMath = document.getElementById('btn-hero-math-suite');
    if (btnHeroMath) {
      btnHeroMath.addEventListener('click', () => {
        lastLessonView = 'view-landing';
        switchView('view-analytical');
      });
    }
    const btnHeroTextbooks = document.getElementById('btn-hero-textbooks');
    if (btnHeroTextbooks) {
      btnHeroTextbooks.addEventListener('click', () => {
        lastLessonView = 'view-landing';
        switchView('view-textbooks');
      });
    }
    const btnHeroPractice = document.getElementById('btn-hero-practice');
    if (btnHeroPractice) {
      btnHeroPractice.addEventListener('click', () => {
        lastLessonView = 'view-landing';
        currentPracticeTrack = 'fund';
        document.querySelectorAll('.practice-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.track === 'fund'));
        switchView('view-practice');
        renderPracticeProblems();
      });
    }

    // 1-C. Landing Portal Track 1: Fundamental Physics Actions
    const btnPortFundTheory = document.getElementById('btn-portal-fund-theory');
    if (btnPortFundTheory) {
      btnPortFundTheory.addEventListener('click', () => {
        openChapter('ch01');
        switchView('view-theory');
      });
    }
    const btnPortFundSim = document.getElementById('btn-portal-fund-sim');
    if (btnPortFundSim) {
      btnPortFundSim.addEventListener('click', () => {
        openChapter('ch01');
        switchView('view-simulator');
        switchSimMode('projectile');
      });
    }
    const btnPortFundPractice = document.getElementById('btn-portal-fund-practice');
    if (btnPortFundPractice) {
      btnPortFundPractice.addEventListener('click', () => {
        currentPracticeTrack = 'fund';
        document.querySelectorAll('.practice-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.track === 'fund'));
        switchView('view-practice');
        renderPracticeProblems();
      });
    }

    // 1-D. Landing Portal Track 2: Mathematics for Physics & Analytical Mechanics
    const btnPortAdvTheory = document.getElementById('btn-portal-adv-theory');
    if (btnPortAdvTheory) {
      btnPortAdvTheory.addEventListener('click', () => {
        lastLessonView = 'view-landing';
        switchView('view-analytical');
      });
    }
    const btnPortAdvSim = document.getElementById('btn-portal-adv-sim');
    if (btnPortAdvSim) {
      btnPortAdvSim.addEventListener('click', () => {
        openChapter('ch01');
        switchView('view-simulator');
        switchSimMode('projectile');
      });
    }
    const btnPortAdvPractice = document.getElementById('btn-portal-adv-practice');
    if (btnPortAdvPractice) {
      btnPortAdvPractice.addEventListener('click', () => {
        currentPracticeTrack = 'adv';
        document.querySelectorAll('.practice-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.track === 'adv'));
        switchView('view-practice');
        renderPracticeProblems();
      });
    }

    // 1-E. Landing Portal Track 3: Civil Engineering Actions
    const btnPortCivTheory = document.getElementById('btn-portal-civ-theory');
    if (btnPortCivTheory) {
      btnPortCivTheory.addEventListener('click', () => {
        openChapter('civil_eng');
        switchView('view-theory');
      });
    }
    const btnPortCivSim = document.getElementById('btn-portal-civ-sim');
    if (btnPortCivSim) {
      btnPortCivSim.addEventListener('click', () => {
        openChapter('civil_eng');
        switchView('view-simulator');
        switchSimMode('civil', 'simply_supported');
      });
    }
    const btnPortCivPractice = document.getElementById('btn-portal-civ-practice');
    if (btnPortCivPractice) {
      btnPortCivPractice.addEventListener('click', () => {
        openChapter('civil_eng');
        currentPracticeTrack = 'civil';
        document.querySelectorAll('.practice-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.track === 'civil'));
        switchView('view-practice');
        renderPracticeProblems();
      });
    }

    // 1-F. Landing Portal Track 4: Textbook Library
    const btnPortTb = document.getElementById('btn-portal-textbooks-open');
    if (btnPortTb) {
      btnPortTb.addEventListener('click', () => {
        lastLessonView = 'view-landing';
        switchView('view-textbooks');
      });
    }

    // 2. Quick Ch1 from Hero
    const btnQuickCh1 = document.getElementById('btn-landing-quick-ch1');
    if (btnQuickCh1) {
      btnQuickCh1.addEventListener('click', () => {
        openChapter('ch01');
      });
    }

    // 3. Logo click -> Landing
    const logo = document.getElementById('header-brand-logo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('view-landing');
      });
    }

    // 4. Open Chapters from selection page
    document.querySelectorAll('.btn-open-chapter, .chapter-item[data-chapter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chap = btn.dataset.chapter || 'ch01';
        openChapter(chap);
      });
    });

    // 4-B. Chapter Launch Buttons (Civil Engineering & Custom Tracks)
    document.querySelectorAll('.btn-chapter-launch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chap = btn.dataset.chapter || 'ch01';
        const targetView = btn.dataset.view || 'view-theory';
        if (chap === 'civil_eng') {
          openChapter('civil_eng');
          if (targetView === 'view-simulator') {
            switchView('view-simulator');
            switchSimMode('civil', 'simply_supported');
          } else if (targetView === 'view-practice') {
            currentPracticeTrack = 'civil';
            document.querySelectorAll('.practice-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.track === 'civil'));
            switchView('view-practice');
            renderPracticeProblems();
          } else {
            switchView('view-theory');
          }
        } else {
          openChapter(chap);
          switchView(targetView);
        }
      });
    });

    // 4-C. Direct Card Clicks for 24 Pure Physics Subjects & Vocational Modules
    document.querySelectorAll('.bosa-topic-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const chap = card.dataset.chapter;
        const view = card.dataset.view || 'view-theory';
        if (chap === 'view-analytical') {
          lastLessonView = 'view-chapter-select';
          switchView('view-analytical');
        } else if (chap === 'civil_eng') {
          openChapter('civil_eng');
          switchView(view);
        } else if (chap) {
          openChapter(chap);
          switchView(view);
        }
      });
    });

    // 4-D. Direct Card Clicks for Civil Engineering Portal
    document.querySelectorAll('.card-civil-portal').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        openChapter('civil_eng');
        switchView('view-theory');
      });
    });

    // 5. Open Analytical Mechanics from selection page
    const btnOpenAnalytical = document.getElementById('btn-open-analytical-from-select');
    if (btnOpenAnalytical) {
      btnOpenAnalytical.addEventListener('click', () => {
        lastLessonView = 'view-chapter-select';
        switchView('view-analytical');
      });
    }

    // 6. Back to Chapter Select button in header
    const btnBack = document.getElementById('btn-back-to-chapters');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        switchView('view-chapter-select');
      });
    }
  }

  function openChapter(chapterId) {
    if (typeof chapterId === 'number') {
      chapterId = chapterId < 10 ? 'ch0' + chapterId : 'ch' + chapterId;
    }
    currentChapter = chapterId;

    // Update Header Chapter Badge
    const badge = document.querySelector('.header-chapter-badge');
    if (badge) {
      if (chapterId === 'ch01') {
        badge.innerHTML = '<span>บทที่ 01 / 2D KINEMATICS & DYNAMICS</span> ▾';
      } else if (chapterId === 'ch02') {
        badge.innerHTML = '<span>บทที่ 02 / CIRCULAR MOTION & GRAVITATION</span> ▾';
      } else if (chapterId === 'ch03') {
        badge.innerHTML = '<span>บทที่ 03 / OSCILLATIONS & SIMPLE HARMONIC MOTION</span> ▾';
      } else if (chapterId === 'ch04') {
        badge.innerHTML = '<span>บทที่ 04 / MECHANICAL WAVES & ACOUSTICS</span> ▾';
      } else if (chapterId === 'ch05') {
        badge.innerHTML = '<span>บทที่ 05 / THERMODYNAMICS & KINETIC THEORY</span> ▾';
      } else if (chapterId === 'ch06') {
        badge.innerHTML = '<span>บทที่ 06 / ELECTROMAGNETISM & CIRCUITS</span> ▾';
      } else if (chapterId === 'ch07') {
        badge.innerHTML = '<span>บทที่ 07 / NUCLEAR & MODERN PHYSICS</span> ▾';
      } else if (chapterId === 'civil_eng') {
        badge.innerHTML = '<span>สาขาวิศวกรรมโยธา / CIVIL ENGINEERING</span> ▾';
      }
    }

    // Toggle simulator buttons in navbar
    const ch1Btns = document.querySelectorAll('.sim-mode-btn[data-chapter="ch01"]');
    const ch2Btns = document.querySelectorAll('.sim-mode-btn[data-chapter="ch02"]');
    const ch3Btns = document.querySelectorAll('.sim-mode-btn[data-chapter="ch03"]');
    const ch4Btns = document.querySelectorAll('.sim-mode-btn[data-chapter="ch04"]');
    const ch5Btns = document.querySelectorAll('.sim-mode-btn[data-chapter="ch05"]');
    const ch6Btns = document.querySelectorAll('.sim-mode-btn[data-chapter="ch06"]');
    const ch7Btns = document.querySelectorAll('.sim-mode-btn[data-chapter="ch07"]');
    const civBtns = document.querySelectorAll('.sim-mode-btn[data-chapter="civil_eng"]');
    if (chapterId === 'ch01') {
      ch1Btns.forEach(b => b.style.display = 'inline-flex');
      ch2Btns.forEach(b => b.style.display = 'none');
      ch3Btns.forEach(b => b.style.display = 'none');
      ch4Btns.forEach(b => b.style.display = 'none');
      ch5Btns.forEach(b => b.style.display = 'none');
      ch6Btns.forEach(b => b.style.display = 'none');
      ch7Btns.forEach(b => b.style.display = 'none');
      civBtns.forEach(b => b.style.display = 'none');
      if (activeSimMode === 'circular' || activeSimMode === 'oscillation' || activeSimMode === 'wave' || activeSimMode === 'thermo' || activeSimMode === 'em' || activeSimMode === 'nuclear' || activeSimMode === 'civil') switchSimMode('projectile');
    } else if (chapterId === 'ch02') {
      ch1Btns.forEach(b => b.style.display = 'none');
      ch2Btns.forEach(b => b.style.display = 'inline-flex');
      ch3Btns.forEach(b => b.style.display = 'none');
      ch4Btns.forEach(b => b.style.display = 'none');
      ch5Btns.forEach(b => b.style.display = 'none');
      ch6Btns.forEach(b => b.style.display = 'none');
      ch7Btns.forEach(b => b.style.display = 'none');
      civBtns.forEach(b => b.style.display = 'none');
      switchSimMode('circular', 'banked');
    } else if (chapterId === 'ch03') {
      ch1Btns.forEach(b => b.style.display = 'none');
      ch2Btns.forEach(b => b.style.display = 'none');
      ch3Btns.forEach(b => b.style.display = 'inline-flex');
      ch4Btns.forEach(b => b.style.display = 'none');
      ch5Btns.forEach(b => b.style.display = 'none');
      ch6Btns.forEach(b => b.style.display = 'none');
      ch7Btns.forEach(b => b.style.display = 'none');
      civBtns.forEach(b => b.style.display = 'none');
      switchSimMode('oscillation', 'spring');
    } else if (chapterId === 'ch04') {
      ch1Btns.forEach(b => b.style.display = 'none');
      ch2Btns.forEach(b => b.style.display = 'none');
      ch3Btns.forEach(b => b.style.display = 'none');
      ch4Btns.forEach(b => b.style.display = 'inline-flex');
      ch5Btns.forEach(b => b.style.display = 'none');
      ch6Btns.forEach(b => b.style.display = 'none');
      ch7Btns.forEach(b => b.style.display = 'none');
      civBtns.forEach(b => b.style.display = 'none');
      switchSimMode('wave', 'traveling');
    } else if (chapterId === 'ch05') {
      ch1Btns.forEach(b => b.style.display = 'none');
      ch2Btns.forEach(b => b.style.display = 'none');
      ch3Btns.forEach(b => b.style.display = 'none');
      ch4Btns.forEach(b => b.style.display = 'none');
      ch5Btns.forEach(b => b.style.display = 'inline-flex');
      ch6Btns.forEach(b => b.style.display = 'none');
      ch7Btns.forEach(b => b.style.display = 'none');
      civBtns.forEach(b => b.style.display = 'none');
      switchSimMode('thermo', 'pv_engine');
    } else if (chapterId === 'ch06') {
      ch1Btns.forEach(b => b.style.display = 'none');
      ch2Btns.forEach(b => b.style.display = 'none');
      ch3Btns.forEach(b => b.style.display = 'none');
      ch4Btns.forEach(b => b.style.display = 'none');
      ch5Btns.forEach(b => b.style.display = 'none');
      ch6Btns.forEach(b => b.style.display = 'inline-flex');
      ch7Btns.forEach(b => b.style.display = 'none');
      civBtns.forEach(b => b.style.display = 'none');
      switchSimMode('em', 'field_charges');
    } else if (chapterId === 'ch07') {
      ch1Btns.forEach(b => b.style.display = 'none');
      ch2Btns.forEach(b => b.style.display = 'none');
      ch3Btns.forEach(b => b.style.display = 'none');
      ch4Btns.forEach(b => b.style.display = 'none');
      ch5Btns.forEach(b => b.style.display = 'none');
      ch6Btns.forEach(b => b.style.display = 'none');
      ch7Btns.forEach(b => b.style.display = 'inline-flex');
      civBtns.forEach(b => b.style.display = 'none');
      switchSimMode('nuclear', 'binding_energy');
    } else if (chapterId === 'civil_eng') {
      ch1Btns.forEach(b => b.style.display = 'none');
      ch2Btns.forEach(b => b.style.display = 'none');
      ch3Btns.forEach(b => b.style.display = 'none');
      ch4Btns.forEach(b => b.style.display = 'none');
      ch5Btns.forEach(b => b.style.display = 'none');
      ch6Btns.forEach(b => b.style.display = 'none');
      ch7Btns.forEach(b => b.style.display = 'none');
      civBtns.forEach(b => b.style.display = 'inline-flex');
      switchSimMode('civil', 'simply_supported');
    }

    activeDivisionFilter = 'all';
    activeFormulaDivisionFilter = 'all';

    // Mark tabs as needing lazy re-render for the new chapter
    viewNeedsUpdate['view-theory'] = true;
    viewNeedsUpdate['view-formulas'] = true;
    viewNeedsUpdate['view-phenomena'] = true;
    viewNeedsUpdate['view-summary'] = true;
    viewNeedsUpdate['view-examples'] = true;

    renderDrawerCatalog(currentChapter);
    switchView('view-theory', true);
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
   * Render Master Curriculum: 4 Divisions & 15 Theories
   * Incorporates concise quick-jump bar and delegating full catalog to drawer
   */
  function renderTheoryContent(chapterId = currentChapter) {
    const container = document.getElementById('theory-content-target');
    if (!container) return;

    let data = window.PhysicsTheoriesContent;
    let projData = window.ProjectileContent;
    let titleMain = 'สารบัญภาคและทฤษฎีกลศาสตร์สองมิติ';
    let subTitleMain = 'โครงสร้างวิชาการมาตรฐาน: นิยาม, หลักการ, สูตรอนุมานตามระดับ, ขอบเขตการใช้งานจริง, ตัวอย่างคำนวณ และแบบจำลองเสมือนจริง';

    if (chapterId === 'ch02') {
      data = window.Chapter02Content;
      titleMain = 'บทที่ 02: สารบัญภาคและทฤษฎีการเคลื่อนที่แบบวงกลม';
      subTitleMain = 'พิกัดเชิงขั้ว, ความเร่งสู่ศูนย์กลาง, แรงลัพธ์แนวรัศมี, ทางโค้งราบ/ยกมุมเอียง และวงกลมแนวดิ่ง';
    } else if (chapterId === 'ch03') {
      data = window.Chapter03Content;
      titleMain = 'บทที่ 03: สารบัญภาคและทฤษฎีการแกว่งกวัดและฮาร์มอนิกอย่างง่าย';
      subTitleMain = 'แรงคืนตัวเชิงเส้น, มวลติดสปริง, ลูกตุ้มอย่างง่าย, การอนุรักษ์พลังงาน, การสั่นหน่วง 3 สภาวะ และการสั่นพ้อง';
    } else if (chapterId === 'ch04') {
      data = window.Chapter04Content;
      titleMain = 'บทที่ 04: สารบัญภาคและทฤษฎีคลื่นกลและเสียง';
      subTitleMain = 'สมการคลื่น 1 มิติ, อัตราเร็วคลื่น, การสะท้อนที่รอยต่อ, คลื่นนิ่ง, การแทรกสอด บีตส์ และดอปเปลอร์';
    } else if (chapterId === 'ch05') {
      data = window.Chapter05Content;
      titleMain = 'บทที่ 05: สารบัญภาคและทฤษฎีอุณหพลศาสตร์และทฤษฎีจลน์ของแก๊ส';
      subTitleMain = 'กฎข้อศูนย์ อุณหภูมิ ทฤษฎีจลน์โมเลกุล กฎข้อที่หนึ่ง สี่กระบวนการเทอร์โมไดนามิกส์ เครื่องยนต์คาร์โนต์ และกฎข้อที่สองเอนโทรปี';
    } else if (chapterId === 'ch06') {
      data = window.Chapter06Content;
      titleMain = 'บทที่ 06: สารบัญภาคและทฤษฎีไฟฟ้าและแม่เหล็ก';
      subTitleMain = 'แรงคูลอมบ์ กฎเกาส์ ศักย์ไฟฟ้า ตัวเก็บประจุ กฎโอห์ม วงจร RC สนามแม่เหล็ก แรงลอเรนซ์ กฎแอมแปร์ และการเหนี่ยวนำฟาราเดย์';
    } else if (chapterId === 'ch07') {
      data = window.Chapter07Content;
      titleMain = 'บทที่ 07: สารบัญภาคและทฤษฎีฟิสิกส์นิวเคลียร์และอนุภาค';
      subTitleMain = 'โครงสร้างนิวเคลียส มวลพร่อง พลังงานยึดเหนี่ยว เสถียรภาพ การสลายแอลฟา/บีตา/แกมมา ครึ่งชีวิต ฟิชชัน ฟิวชัน และมาตรวิทยารังสี';
    } else if (chapterId === 'civil_eng') {
      data = window.CivilEngineeringContent;
      titleMain = 'สาขาวิศวกรรมโยธา: สถิตยศาสตร์ & ความแข็งแรงของวัสดุ';
      subTitleMain = 'สมดุลของวัตถุเกร็ง, โครงถักสะพาน, แผนภาพแรงเฉือนและโมเมนต์ดัดในคาน (SFD/BMD), ความเค้น-ความเครียด และวงกลมของมอร์';
    }

    if (!data || !data.theories) return;

    const tierMeta = projData && projData.theory && projData.theory[currentTier]
      ? projData.theory[currentTier]
      : { tierName: 'ระดับการศึกษา', overview: '' };

    let html = `
      <div class="content-header">
        <h2 class="content-title">${titleMain} (${data.divisions ? data.divisions.length : 0} Divisions & ${data.theories.length} Theories)</h2>
        <p class="content-subtitle">${subTitleMain}</p>
      </div>

      <!-- Streamlined Quick Jump & Division Filter Bar (Catalog moved to drawer per requirements) -->
      <div class="lesson-quick-jump-bar" style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <span style="font-weight: 800; font-size: 0.88rem; color: var(--text-primary);">📚 เลือกแสดงภาควิชา:</span>
          <div class="division-filter-tabs" role="group" aria-label="กรองตามภาควิชา">
            <button class="division-filter-btn ${activeDivisionFilter === 'all' ? 'active' : ''}" data-division="all">
              ทั้งหมด (${data.theories.length})
            </button>
            ${(data.divisions || []).map(div => {
              const numeralStr = div.numeral || (div.number ? 'ภาคที่ ' + div.number : 'ภาควิชา');
              return `
              <button class="division-filter-btn ${activeDivisionFilter === div.id ? 'active' : ''}" data-division="${div.id}">
                ${numeralStr}: ${div.titleTh.split('(')[0].trim()}
              </button>
              `;
            }).join('')}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          ${(chapterId === 'ch01' || chapterId === 'ch02') ? `
            <button id="btn-open-analytical-expl" class="btn-outline-analytical" title="เปิดคำอธิบายหน้า: การวิเคราะห์กลศาสตร์ (Lagrangian & Hamiltonian)">
              🏛️ การวิเคราะห์กลศาสตร์ (คำอธิบายขั้นสูง)
            </button>
          ` : ''}
          <button id="btn-open-drawer-catalog" class="btn-outline-catalog" title="เปิดสารบัญทฤษฎีเรียงเลข">
            ☰ สารบัญทฤษฎีเรียงเลข (${data.theories.length} ทฤษฎี)
          </button>
        </div>
      </div>

      <!-- Master Divisions & Theories Container -->
      <div id="theories-master-list">
    `;

    // Render Divisions
    data.divisions.forEach(div => {
      const divTheories = data.theories.filter(t => t.divisionId === div.id);
      const isDivVisible = activeDivisionFilter === 'all' || activeDivisionFilter === div.id;
      const numeralStr = div.numeral || (div.number ? 'ภาคที่ ' + div.number : 'ภาควิชา');
      const descStr = div.description || div.descriptionTh || '';

      html += `
        <section class="division-block" id="${div.id}" style="display: ${isDivVisible ? 'block' : 'none'};">
          <div class="division-banner">
            <div class="division-badge-row">
              <span class="division-numeral-badge">${numeralStr}</span>
              <span class="division-theories-count">${divTheories.length} ทฤษฎีหลัก</span>
            </div>
            <h3 class="division-title">${div.titleTh}</h3>
            <p class="division-desc">${descStr}</p>
          </div>

          <!-- Theory Cards within this Division -->
          <div class="division-theories-container">
            ${divTheories.map(t => renderSingleTheoryCard(t)).join('')}
          </div>
        </section>
      `;
    });

    html += renderTabStepNavBar(1, null, { view: 'view-formulas', label: 'ขั้นต่อไป: 📐 2. สูตร & การคำนวณ →' });
    html += `</div>`;

    container.innerHTML = html;

    // Attach Division Filter events
    const filterBtns = container.querySelectorAll('.division-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const divId = btn.dataset.division;
        activeDivisionFilter = divId;

        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.division === divId));

        const blocks = container.querySelectorAll('.division-block');
        blocks.forEach(block => {
          if (divId === 'all' || block.id === divId) {
            block.style.display = 'block';
          } else {
            block.style.display = 'none';
          }
        });
      });
    });

    // Attach Open Drawer Catalog button
    const btnOpenDrawer = container.querySelector('#btn-open-drawer-catalog');
    if (btnOpenDrawer) {
      btnOpenDrawer.addEventListener('click', () => {
        if (window.PhysicsApp && window.PhysicsApp.openDrawer) {
          window.PhysicsApp.openDrawer();
        }
      });
    }

    // Attach Open Analytical Mechanics Explanations button
    const btnOpenAnalyticalExpl = container.querySelector('#btn-open-analytical-expl');
    if (btnOpenAnalyticalExpl) {
      btnOpenAnalyticalExpl.addEventListener('click', () => {
        lastLessonView = currentView || 'view-theory';
        switchView('view-analytical');
      });
    }

    container.querySelectorAll('.btn-open-analytical-inline').forEach(btn => {
      btn.addEventListener('click', () => {
        lastLessonView = currentView || 'view-theory';
        switchView('view-analytical');
      });
    });

    // Attach Direct Jump to Formula buttons on Theory Cards
    container.querySelectorAll('.btn-jump-to-formula').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tId = btn.dataset.theoryId;
        switchView('view-formulas');
        setTimeout(() => {
          const el = document.getElementById('formula-summary-' + tId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.style.transition = 'box-shadow 0.5s ease';
            el.style.boxShadow = '0 0 0 3px #EA580C';
            setTimeout(() => { el.style.boxShadow = ''; }, 2000);
          }
        }, 120);
      });
    });

    // Attach Simulator Preset deep link buttons
    const simBtns = container.querySelectorAll('.sim-deep-link-btn');
    simBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const rawTheoryId = btn.dataset.theoryId;
        launchSimulatorForTheory(currentChapter, rawTheoryId);
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
   * Render a Single Theory Card adhering strictly to Image 4 Wireframe & 6-point pedagogical structure
   * Side-by-Side Split: Left column: เนื้อหา (Content) | Right column: รูป (Top) + สูตร (Bottom)
   */
  function renderSingleTheoryCard(t) {
    return `
      <article class="theory-card bosa-split-card" id="theory-${t.id}">
        <header class="theory-card-header">
          <div class="theory-tag-row">
            <span class="tag-number">${t.numberTh || 'ทฤษฎีที่ ' + t.id}</span>
            <span class="tag-type">${t.type || 'ทฤษฎีรากฐาน'}</span>
            <span class="card-badge">${(t.divisionTitle || '').split(':')[0] || 'ทฤษฎี'}</span>
          </div>
          <h4 class="theory-card-title-th">ทฤษฎีที่ ${t.id} : ${t.titleTh || ''}</h4>
          <div class="theory-card-title-en">${t.titleEn || ''}</div>
          <p class="theory-card-summary">${t.summary || ''}</p>
        </header>

        <div class="theory-card-body">
          <!-- Side-by-Side Split Grid (Image 4 Wireframe Proportions) -->
          <div class="theory-card-split-grid">
            <!-- LEFT COLUMN: เนื้อหา (Content) -->
            <div class="theory-col-content">
              <!-- (1) นิยามและความหมาย (Definition & Meaning) -->
              <div class="theory-section section-def">
                <div class="section-label">
                  <span class="section-num">1</span>
                  <span>นิยามและความหมาย (Definition &amp; Meaning)</span>
                </div>
                <div class="theory-prose">
                  ${formatTextProse(t.definition ? (t.definition.text || t.definition) : (t.overviewTh || t.summary || ''))}
                </div>
              </div>

              <!-- (2) หลักการและคำอธิบาย (Principle & Conceptual Foundation) -->
              <div class="theory-section section-principle">
                <div class="section-label">
                  <span class="section-num">2</span>
                  <span>หลักการและคำอธิบาย (Principle &amp; Conceptual Foundation)</span>
                </div>
                <div class="theory-prose">
                  ${formatTextProse(t.principle ? (t.principle.text || t.principle) : (Array.isArray(t.pedagogicalPoints) ? t.pedagogicalPoints.join('\n\n') : ''))}
                </div>
              </div>

              <!-- (3) การใช้งานและเงื่อนไข (Applications, Scope & Validity Boundaries) -->
              <div class="theory-section section-app">
                <div class="section-label">
                  <span class="section-num">3</span>
                  <span>การใช้งานและเงื่อนไข (Applications, Scope &amp; Validity Boundaries)</span>
                </div>
                <div class="theory-prose">
                  ${formatTextProse(t.application ? (t.application.text || t.application) : '')}
                </div>
                <div class="app-bounds-grid">
                  <div class="app-bound-box valid">
                    <div class="app-bound-title">
                      <span>✓ ขอบเขตที่ใช้ได้ (Valid Scope)</span>
                    </div>
                    <p>${t.application ? (t.application.validWhen || 'การประมาณรังสีใกล้แกน (Paraxial rays)') : 'การประมาณมาตรฐาน'}</p>
                  </div>
                  <div class="app-bound-box invalid">
                    <div class="app-bound-title">
                      <span>✗ เมื่อใดที่ใช้ไม่ได้ / ข้อควรระวัง (Invalid Bounds)</span>
                    </div>
                    <p>${t.application ? (t.application.invalidWhen || 'เมื่อมุมตกกระทบกว้างเกินขอบเขต') : 'เมื่ออยู่นอกเงื่อนไข'}</p>
                  </div>
                </div>
              </div>

              <!-- (4) ข้อสังเกตและประเด็นที่มักเข้าใจผิดเฉพาะเรื่อง -->
              ${t.observations && t.observations.length > 0 ? `
                <div class="observation-card">
                  <div class="observation-header">
                    <span>💡 ข้อสังเกตและประเด็นที่มักเข้าใจผิดเฉพาะเรื่อง (Key Observations)</span>
                  </div>
                  <ul class="observation-list">
                    ${t.observations.map(obs => `<li>${obs}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              <!-- Bridging to Analytical Mechanics (Explanatory Callout Card) -->
              ${t.id === 15 ? `
                <div class="analytical-callout-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                    <div>
                      <div style="font-weight: 800; font-size: 0.95rem; color: #7C3AED; margin-bottom: 0.25rem;">
                        🏛️ คำอธิบายหน้าเพิ่มเติม: การวิเคราะห์กลศาสตร์ (Lagrangian &amp; Hamiltonian Mechanics)
                      </div>
                      <div style="font-size: 0.85rem; color: var(--text-secondary);">
                        กระบวนทัศน์กลศาสตร์วิเคราะห์ขั้นสูง กฎการกระทำน้อยที่สุด การแปลงเลอฌ็องดร์ วงเล็บปัวซง และระนาบเฟสสเปซเชิงพลศาสตร์
                      </div>
                    </div>
                    <button class="btn-open-analytical-inline" data-theory-id="15" aria-label="เปิดคำอธิบายหน้าการวิเคราะห์กลศาสตร์">
                      🏛️ ปุ่มอธิบายหน้า: การวิเคราะห์กลศาสตร์ &rarr;
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- RIGHT COLUMN: รูป (Top) + สูตร (Bottom) -->
            <div class="theory-col-media-formula">
              <!-- RIGHT TOP: รูป (Diagram / Visual Illustration) -->
              <div class="theory-diagram-box">
                <div class="theory-box-heading">
                  <span>🖼️ รูปประกอบ &amp; แผนภาพเวกเตอร์ (Diagram)</span>
                </div>
                ${t.example && t.example.diagramSvg ? `
                  <div class="theory-diagram-wrapper">
                    ${t.example.diagramSvg}
                    ${t.example.diagramCaption ? `<div class="diagram-caption">${t.example.diagramCaption}</div>` : ''}
                  </div>
                ` : `
                  <div class="theory-diagram-wrapper">
                    <svg viewBox="0 0 520 180" width="100%" height="180" style="background: #0B1329; border-radius: 6px;">
                      <defs>
                        <marker id="arrow-th-${t.id}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#38BDF8"/>
                        </marker>
                      </defs>
                      <line x1="50" y1="140" x2="470" y2="140" stroke="#334155" stroke-width="2"/>
                      <line x1="50" y1="140" x2="50" y2="30" stroke="#334155" stroke-width="2"/>
                      <path d="M 50 140 Q 240 20 440 140" fill="none" stroke="#EA580C" stroke-width="3" stroke-dasharray="6,4"/>
                      <line x1="50" y1="140" x2="150" y2="60" stroke="#38BDF8" stroke-width="2.5" marker-end="url(#arrow-th-${t.id})"/>
                      <circle cx="240" cy="50" r="6" fill="#F59E0B"/>
                      <text x="160" y="55" fill="#38BDF8" font-size="12" font-family="sans-serif">v₀ เวกเตอร์ความเร็วต้น</text>
                      <text x="255" y="45" fill="#F59E0B" font-size="12" font-family="sans-serif">จุดสูงสุด (Apex)</text>
                      <text x="230" y="165" fill="#94A3B8" font-size="11" font-family="sans-serif">แผนภาพเวกเตอร์ทฤษฎีที่ ${t.id} (${t.titleTh || ''})</text>
                    </svg>
                  </div>
                `}
              </div>

              <!-- RIGHT BOTTOM: สูตร (Formulas, Variables & Worked Example) -->
              <div class="theory-formula-box">
                <div class="theory-box-heading">
                  <span>📐 สูตร สัญลักษณ์ และการอนุมาน (Formula &amp; Derivations)</span>
                </div>
                ${(t.formulas || []).map((f) => {
                  const symList = f.symbols || f.variables || [];
                  return `
                    <div class="formula-subcard">
                      <div class="formula-subcard-title">${f.name || f.desc || 'สูตรคำนวณและสมการหลัก'}</div>
                      <div class="math-container display-math" style="margin: 0.5rem 0;">
                        $$${f.latex}$$
                      </div>
                      ${symList.length > 0 ? `
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
                              ${symList.map(s => {
                                const rawSym = (s.sym || s.latex || '').replace(/^\$+|\$+$/g, '').trim();
                                const rawUnit = (s.unit || s.unitLatex || '').replace(/^\$+|\$+$/g, '').trim();
                                return `
                                  <tr>
                                    <td><strong>$${rawSym}$</strong></td>
                                    <td>${s.desc || s.name || ''}</td>
                                    <td>$${rawUnit}$</td>
                                  </tr>
                                `;
                              }).join('')}
                            </tbody>
                          </table>
                        </div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}

                <!-- Worked Example -->
                ${t.example ? `
                  <div class="example-box" style="margin-top: 0.75rem;">
                    <div class="example-prob">
                      <strong>ตัวอย่างการคำนวณ:</strong> ${t.example.problem || ''}
                    </div>
                    <div class="step-container" style="margin: 0.5rem 0;">
                      ${Array.isArray(t.example.steps) ? t.example.steps.map(st => `
                        <div class="step-card" style="padding: 0.5rem 0.75rem;">
                          <p style="font-size: 0.88rem; margin: 0;">${st}</p>
                        </div>
                      `).join('') : ''}
                    </div>
                  </div>
                ` : ''}

                <div class="theory-formula-nav-row" style="margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-light); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                  <button class="btn-action-primary btn-jump-to-formula" data-theory-id="${t.id}" aria-label="ดูสูตรและการอนุมานของทฤษฎีที่ ${t.id}">
                    📐 ดูสูตรและการอนุมาน
                  </button>
                  <button class="sim-deep-link-btn" data-theory-id="${t.id}" aria-label="นำพารามิเตอร์ของทฤษฎีนี้ไปจำลองจริงในแบบจำลอง">
                    🎯 ทดลองในแบบจำลอง &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Academic Source References -->
          <footer style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px dashed var(--border-light); padding-top: 0.75rem; margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <span>📖 อ้างอิงตำราวิชาการ: <strong>${t.citation || 'David Morin (2008), David Tong (2004), Baker &amp; Haynes (2020)'}</strong></span>
            <a href="#tab-formulas" class="view-tab-link" style="color: var(--accent-orange-text); text-decoration: none; font-weight: 600;" onclick="window.PhysicsApp.switchView('view-formulas');">
              เปิดตารางสูตรทั้งหมด ↗
            </a>
          </footer>
        </div>
      </article>
    `;
  }

  /**
   * Render Chapter Summary & Synthesis View (Tab 5)
   * High-Level University Standard Synthesis Matrix:
   * 1. Executive Conceptual Mindmap
   * 2. Rigorous Master Formula Matrix with SI Units & Governing Conditions
   * 3. Real-World Empirical Benchmarks & Physical Reference Anchors
   * 4. Conservation Laws, Symmetries & Noether Principles
   * 5. Common Exam Traps, Fallacies & Root Causes
   * 6. State-of-the-Art Engineering Systems & Industrial Case Studies
   */
  let activeSummarySectionFilter = 'all';

  function renderSummaryContent(chapterId = currentChapter) {
    const target = document.getElementById('summary-content-target');
    if (!target) return;

    const summaryData = {
      ch01: {
        num: '01',
        titleTh: 'บทที่ 01: การเคลื่อนที่สองมิติและโปรเจกไทล์ (2D Kinematics & Projectiles)',
        subtitle: 'สรุปสังเคราะห์แก่นวิชา: วิถีสุญญากาศของกาลิเลโอ vs อากาศจริงกำลังสอง พลศาสตร์นิวตัน และการอนุรักษ์โมเมนตัม',
        mindmap: [
          { branch: 'จลนศาสตร์ 1D/2D (Kinematics)', items: ['เวกเตอร์ตำแหน่ง $\\vec{r}(t)$, ความเร็ว $\\vec{v} = d\\vec{r}/dt$, ความเร่ง $\\vec{a} = d\\vec{v}/dt$', 'สมการการเคลื่อนที่ความเร่งคงที่ (SUVAT ในระบบ 2 แกนอิสระ)', 'หลักการซ้อนทับการเคลื่อนที่อิสระ (Superposition Principle: $x \\perp y$)'] },
          { branch: 'โปรเจกไทล์สุญญากาศ (Ideal Ballistics)', items: ['แนวราบความเร็วคงตัว $v_x = v_0\\cos\\theta$', 'แนวดิ่งความเร่งคงที่ $a_y = -g$', 'สมการวิถีพาราโบลา $y(x) = x\\tan\\theta - \\frac{g x^2}{2v_0^2\\cos^2\\theta}$', 'ระยะตกไกลสุดบนพื้นระดับ $R_{\\max}$ เกิดที่ $\\theta = 45^\\circ$'] },
          { branch: 'แรงต้านอากาศจริง (Quadratic Drag)', items: ['แรงต้านพลศาสตร์ของไหล $\\vec{F}_d = -\\frac{1}{2}\\rho C_D A |\\vec{v}|\\vec{v} = -c v \\vec{v}$', 'อัตราเร็วปลายสุดท้าย $v_t = \\sqrt{2mg / (\\rho C_D A)}$', 'วิถีวิถีโค้งอสมมาตร (Asymmetric Ballistic Trajectory, ขาลงชันกว่าขาขึ้น)', 'ตัวแก้เชิงตัวเลข 4th-Order Runge-Kutta (RK4)'] },
          { branch: 'งาน-พลังงาน & โมเมนตัม (Energy & Momentum)', items: ['ทฤษฎีบทงาน-พลังงานจลน์ $W_{\\text{net}} = \\Delta E_k$', 'กฎการอนุรักษ์พลังงานกล $\\Delta E_{\\text{mech}} = W_{\\text{nc}}$ (งานแรงต้านอากาศทำให้สูญเสีย $E$)', 'การดลและโมเมนตัม $\\vec{J} = \\int \\vec{F}\\,dt = \\Delta\\vec{p}$', 'การชนใน 2 มิติและการอนุรักษ์โมเมนตัม $\\sum \\vec{p}_i = \\sum \\vec{p}_f$'] }
        ],
        formulas: [
          { name: 'ระยะตกไกลในสุญญากาศ', latex: 'R = \\frac{v_0^2 \\sin 2\\theta}{g}', units: 'm', condition: 'ยิงและตกที่ระดับความสูงเดียวกัน ไร้แรงต้านอากาศ', desc: 'ระยะทางในแนวราบสูงสุดเมื่อมุมยิง $\\theta = 45^\\circ$' },
          { name: 'ความสูงสูงสุดในสุญญากาศ', latex: 'H = \\frac{v_0^2 \\sin^2\\theta}{2g}', units: 'm', condition: 'จุดสูงสุดของวิถี ($v_y = 0$)', desc: 'พลังงานจลน์แนวดิ่งแปลงเป็นพลังงานศักย์โน้มถ่วงทั้งหมด' },
          { name: 'เวลาบินรวมในสุญญากาศ', latex: 'T_{\\text{flight}} = \\frac{2 v_0 \\sin\\theta}{g}', units: 's', condition: 'ระดับพื้นยิงเท่ากับพื้นตก ($y_f = y_0$)', desc: 'เวลาขาขึ้นเท่ากับเวลาขาลง ($t_{\\text{up}} = t_{\\text{down}} = T/2$)' },
          { name: 'สมการวิถีพาราโบลา $y(x)$', latex: 'y = y_0 + x\\tan\\theta - \\frac{g x^2}{2v_0^2\\cos^2\\theta}', units: 'm', condition: 'ขจัดตัวแปรเวลา $t$ ออกจากสมการพิกัด', desc: 'ความสัมพันธ์เชิงเรขาคณิตระหว่างพิกัด $y$ และ $x$' },
          { name: 'แรงต้านอากาศของไหลกำลังสอง', latex: '\\vec{F}_d = -\\frac{1}{2}\\rho C_D A v \\vec{v}', units: 'N', condition: 'การไหลแบบปั่นป่วน ($Re > 10^3$)', desc: '$\\rho$: ความหนาแน่นอากาศ, $C_D$: สัมประสิทธิ์แรงต้าน, $A$: พื้นที่หน้าตัด' },
          { name: 'อัตราเร็วปลายสุดท้าย (Terminal Speed)', latex: 'v_t = \\sqrt{\\frac{2mg}{\\rho C_D A}} = \\sqrt{\\frac{mg}{c}}', units: 'm/s', condition: 'แรงต้านอากาศสมดุลกับน้ำหนัก ($F_d = mg, a = 0$)', desc: 'อัตราเร็วสูงสุดที่วัตถุตกอิสระในของไหลสามารถทำได้' },
          { name: 'ทฤษฎีบทงาน-พลังงานจลน์', latex: 'W_{\\text{net}} = \\int \\vec{F}_{\\text{net}} \\cdot d\\vec{r} = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2', units: 'J', condition: 'ใช้ได้กับแรงทุกชนิด (อนุรักษ์และไม่อนุรักษ์)', desc: 'งานของแรงลัพธ์เท่ากับการเปลี่ยนแปลงพลังงานจลน์ของระบบ' }
        ],
        benchmarks: [
          { name: 'ความเร่งโน้มถ่วงมาตรฐานโลก', value: 'g_0 = 9.80665 m/s²', ref: 'ระดับน้ำทะเล ละติจูด 45° (เกณฑ์คำนวณมาตรฐาน SI)' },
          { name: 'ความหนาแน่นของอากาศที่ระดับน้ำทะเล', value: 'ρ_air ≈ 1.225 kg/m³', ref: 'สภาวะบรรยากาศมาตรฐาน ISA (15°C, 101.325 kPa)' },
          { name: 'อัตราเร็วปลายของนักกระโดดร่ม (Skydiver)', value: 'v_t ≈ 54 m/s (194 km/h)', ref: 'กางแขนขาขนานพื้น (Belly-to-earth, A ≈ 0.7 m²); ท่าพุ่งดิ่ง (Head-down) สูงถึง 90 m/s' },
          { name: 'สัมประสิทธิ์แรงต้านอากาศทรงกลม', value: 'C_D ≈ 0.47 (ผิวเรียบ)', ref: 'ลูกกอล์ฟที่มีรอยบุ๋ม (Dimples) ลดเหลือ C_D ≈ 0.25 จากการเหนี่ยวนำ Turbulent Boundary Layer' },
          { name: 'มุมยิงระยะไกลสุดในอากาศจริง', value: 'θ_opt ≈ 35° - 39°', ref: 'ต่ำกว่า 45° ในสุญญากาศเสมอ เนื่องจากต้องลดเวลาที่กระสุนสัมผัสแรงต้านอากาศ' }
        ],
        laws: [
          'หลักการซ้อนทับเชิงจลนศาสตร์ (Kinematic Superposition): การเคลื่อนที่ในแนวแกนราบ ($x$) และแนวดิ่ง ($y$) เป็นอิสระต่อกันโดยสมบูรณ์ในสุญญากาศ',
          'กฎข้อที่หนึ่งของนิวตัน (Law of Inertia): วัตถุรักษาสภาพนิ่งหรือความเร็วคงตัวเมื่อแรงลัพธ์ภายนอกเป็นศูนย์ $\\sum \\vec{F} = 0$',
          'กฎข้อที่สองของนิวตัน (Fundamental Equation of Dynamics): $\\sum \\vec{F} = \\frac{d\\vec{p}}{dt} = m\\vec{a}$ (สำหรับระบบมวลคงตัว)',
          'กฎการอนุรักษ์โมเมนตัมเชิงเส้น (Linear Momentum Conservation): โมเมนตัมรวมของระบบปิดคงที่เสมอ $\\sum \\vec{p}_i = \\sum \\vec{p}_f$ สอดคล้องกับสมมาตรการเลื่อนตำแหน่งตามทฤษฎีบทเนอเธอร์'
        ],
        traps: [
          'มุมยิง $45^\\circ$ เป็นจริงเฉพาะในสุญญากาศ: หากมีแรงต้านอากาศ มุมยิงไกลสุดจะลดลงเหลือราว $35^\\circ - 40^\\circ$',
          'เวลาขาขึ้น vs เวลาขาลงในอากาศจริง: ในสุญญากาศ $t_{\\text{up}} = t_{\\text{down}}$ แต่ในอากาศจริง $t_{\\text{up}} < t_{\\text{down}}$ เสมอ เพราะขาขึ้นแรงโน้มถ่วงและแรงต้านอากาศร่วมกันชะลอวัตถุ ($a_y = -(g + F_d/m)$) แต่ขาลงแรงต้านหักล้างกับแรงโน้มถ่วง ($a_y = -(g - F_d/m)$)',
          'ที่จุดสูงสุด อัตราเร็วไม่เป็นศูนย์: ที่ยอดวิถี $v_y = 0$ แต่อัตราเร็วแนวราบ $v_x = v_0\\cos\\theta \\neq 0$ ดังนั้น $v_{\\text{top}} = v_x$',
          'งานของแรงตั้งฉากและแรงสู่ศูนย์กลางเป็นศูนย์เสมอ: $W = \\int \\vec{F} \\cdot d\\vec{r} = 0$ เพราะทิศทางแรงตั้งฉากกับการกระจัดตลอดเวลา'
        ],
        applications: [
          'วิศวกรรมการบินและขีปนาวุธ (Ballistics & Aerospace): การคำนวณวิถีกระสุนปืนใหญ่และจรวดส่งดาวเทียมด้วยระเบียบวิธีเชิงตัวเลข RK4 ผสานแรงคอริออลิส',
          'การออกแบบรูปทรงอากาศพลศาสตร์ (Aerodynamics): การปรับปรุงตัวถังรถยนต์ความเร็วสูงให้ได้ค่าสัมประสิทธิ์แรงต้าน $C_D < 0.24$ เพื่อประหยัดพลังงาน',
          'ฟิสิกส์การกีฬาความแม่นยำ (Sports Dynamics): การวิเคราะห์วิถีลูกฟุตบอล บาสเกตบอล และลูกกอล์ฟ พร้อมอิทธิพลแมกนัส (Magnus Effect) จากการหมุนปั่น'
        ]
      },
      ch02: {
        num: '02',
        titleTh: 'บทที่ 02: การเคลื่อนที่แบบวงกลมและแรงสู่ศูนย์กลาง (Circular Motion & Centripetal Dynamics)',
        subtitle: 'สรุปสังเคราะห์แก่นวิชา: ความเร่งสู่ศูนย์กลาง ทางโค้งยกมุมเอียง วงกลมแนวดิ่ง และกลศาสตร์วงโคจรของเคปเลอร์',
        mindmap: [
          { branch: 'จลนศาสตร์การหมุน', items: ['การกระจัดเชิงมุม $\\theta$, อัตราเร็วเชิงมุม $\\omega = d\\theta/dt$, ความเร่งเชิงมุม $\\alpha = d\\omega/dt$', 'ความสัมพันธ์เชิงเส้น: $s = r\\theta, v = r\\omega, a_t = r\\alpha$'] },
          { branch: 'ความเร่ง & แรงสู่ศูนย์กลาง', items: ['ความเร่งสู่ศูนย์กลาง $a_c = \\frac{v^2}{r} = \\omega^2 r = \\frac{4\\pi^2 r}{T^2}$ (พุ่งสู่ศูนย์กลางเสมอ)', 'แรงสู่ศูนย์กลาง $F_c = m a_c$ (ไม่ใช่แรงชนิดใหม่ แต่เป็นหน้าที่ของแรงจริง)'] },
          { branch: 'ทางโค้งและยานยนต์', items: ['ทางโค้งราบ: ยึดเกาะด้วยแรงเสียดทานสถิต $f_s \\le \\mu_s mg \\implies v_{\\max} = \\sqrt{\\mu_s g r}$', 'ทางโค้งยกมุมเอียง (Superelevation): $\\tan\\theta = \\frac{v^2}{rg}$ ปลอดภัยแม้ไร้แรงเสียดทาน'] },
          { branch: 'วงกลมแนวดิ่ง & วงโคจร', items: ['เงื่อนไขครบลูปแนวดิ่ง: จุดสูงสุด $v_{\\text{top}} \\ge \\sqrt{gr}$, จุดต่ำสุด $v_{\\text{bottom}} \\ge \\sqrt{5gr}$', 'กฎโน้มถ่วงสากล $F_G = G\\frac{Mm}{r^2}$, อัตราเร็วโคจร $v = \\sqrt{\\frac{GM}{r}}$, กฎเคปเลอร์ $T^2 \\propto r^3$'] }
        ],
        formulas: [
          { name: 'ความเร่งสู่ศูนย์กลาง', latex: 'a_c = \\frac{v^2}{r} = \\omega^2 r = \\frac{4\\pi^2 r}{T^2}', units: 'm/s²', condition: 'การเคลื่อนที่เป็นแนวโค้งรัศมี $r$', desc: 'เกิดจากการเปลี่ยนทิศทางของเวกเตอร์ความเร็ว แม้อัตราเร็วสเกลาร์จะคงตัว' },
          { name: 'มุมยกของทางโค้งเอียง', latex: '\\tan\\theta = \\frac{v^2}{rg}', units: 'rad หรือ deg', condition: 'พื้นเอียงไร้แรงเสียดทาน (Design Speed)', desc: 'แรงปฏิกิริยาแนวตั้งฉาก $N\\sin\\theta$ ทำหน้าที่เป็นแรงสู่ศูนย์กลางทั้งหมด' },
          { name: 'อัตราเร็วต่ำสุดครบลูปแนวดิ่ง', latex: 'v_{\\text{top}} = \\sqrt{gr}, \\quad v_{\\text{bottom}} = \\sqrt{5gr}', units: 'm/s', condition: 'เชือกตึงหรือรางสัมผัสที่จุดยอด ($T \\ge 0$)', desc: 'เกณฑ์อนุรักษ์พลังงานกลในวงกลมแนวดิ่งภายใต้แรงโน้มถ่วง' },
          { name: 'อัตราเร็วโคจรของดาวเทียม', latex: 'v_{\\text{orbit}} = \\sqrt{\\frac{GM}{r}}', units: 'm/s', condition: 'วงโคจรวงกลมรอบดาวเคราะห์มวล $M$', desc: 'แรงดึงดูดระหว่างมวลทำหน้าที่เป็นแรงสู่ศูนย์กลาง $F_G = F_c$' },
          { name: 'กฎข้อที่สามของเคปเลอร์', latex: '\\frac{T^2}{r^3} = \\frac{4\\pi^2}{GM} = \\text{const}', units: 's²/m³', condition: 'วัตถุโคจรภายใต้แรงโน้มถ่วงศูนย์กลาง', desc: 'คาบการโคจรกำลังสองแปรผันตรงกับรัศมีเฉลี่ยยกกำลังสาม' }
        ],
        benchmarks: [
          { name: 'อัตราเร็วโคจรผิวโลก (First Cosmic Speed)', value: 'v₁ ≈ 7.91 km/s (28,476 km/h)', ref: 'วงโคจรต่ำรอบโลก (LEO) ที่ r = R_Earth ≈ 6,371 km' },
          { name: 'อัตราเร็วหลุดพ้นจากโลก (Escape Velocity)', value: 'v_e = √2 · v₁ ≈ 11.19 km/s', ref: 'อัตราเร็วขั้นต่ำในการหลุดพ้นจากหลุมความโน้มถ่วงโลกสู่อวกาศ' },
          { name: 'รัศมีวงโคจรค้างฟ้า (Geostationary Orbit)', value: 'r_geo = 42,164 km (h ≈ 35,786 km)', ref: 'คาบโคจรเท่ากับคาบการหมุนรอบตัวเองของโลกพอดี (T = 23h 56m 04s)' },
          { name: 'ความเร่งในเครื่องหมุนเหวี่ยงแยกสาร (Centrifuge)', value: 'a_c ≈ 3,000g - 1,000,000g', ref: 'เครื่องหมุนเหวี่ยงความเร็วสูงในห้องปฏิบัติการและกระบวนการสกัดไอโซโทป' },
          { name: 'ขีดจำกัดความเร่งทนทานของร่างกายมนุษย์', value: '+G_z ≈ 5g - 9g', ref: 'นักบินขับไล่พร้อมชุด G-suit; เกิน 9g เลือดไม่สามารถขึ้นไปเลี้ยงสมอง (Blackout)' }
        ],
        laws: [
          'แรงสู่ศูนย์กลางไม่ใช่แรงชนิดใหม่: แต่เป็นผลรวมของแรงจริงทางกายภาพในแนวรัศมี $\\sum F_r = m a_c$',
          'งานของแรงสู่ศูนย์กลางเท่ากับศูนย์เสมอ ($W_c = 0$): เพราะ $\\vec{F}_c \\perp d\\vec{r}$ ตลอดเวลา จึงไม่เปลี่ยนแปลงพลังงานจลน์ของวัตถุ',
          'การอนุรักษ์โมเมนตัมเชิงมุมในสนามแรงสู่ศูนย์กลาง: เนื่องจากทอร์กภายนอก $\\vec{\\tau} = \\vec{r} \\times \\vec{F} = 0$ ส่งผลให้ $\\vec{L} = \\text{คงที่}$'
        ],
        traps: [
          'แรงหนีศูนย์กลาง (Centrifugal Force) เป็นแรงเทียม (Fictitious Force): ห้ามใส่ใน Free Body Diagram เมื่อวิเคราะห์ในกรอบอ้างอิงเฉื่อย (Inertial Frame)',
          'วัตถุที่เคลื่อนที่เป็นวงกลมด้วยอัตราเร็วคงตัว "ยังคงมีความเร่งเสมอ" เพราะทิศทางของเวกเตอร์ความเร็วเปลี่ยนตลอดเวลา',
          'แรงตึงเชือกในวงกลมแนวดิ่งไม่คงที่: $T_{\\text{bottom}} = T_{\\text{top}} + 6mg$ เสมอเมื่อคิดการอนุรักษ์พลังงานกล'
        ],
        applications: [
          'วิศวกรรมทางหลวงและรางรถไฟความเร็วสูง: การคำนวณโค้งเปลี่ยนผ่าน (Clothoid Transition Curves) และมุมยกผิวทาง',
          'การจำลองแรงโน้มถ่วงเทียมในสถานีอวกาศ: หมุนโครงสร้างรูปวงแหวนด้วยความเร็วรอบ $\\omega = \\sqrt{g/r}$',
          'เครื่องดักจับอนุภาคไซโคลน (Cyclone Separator) ในโรงงานอุตสาหกรรมเพื่อแยกฝุ่นละอองออกจากอากาศ'
        ]
      },
      ch03: {
        num: '03',
        titleTh: 'บทที่ 03: การแกว่งกวัดและฮาร์มอนิกอย่างง่าย (Oscillations, SHM & Resonance)',
        subtitle: 'สรุปสังเคราะห์แก่นวิชา: สมการอนุพันธ์ฮาร์มอนิก การสั่นหน่วง 3 ระดับ และการสั่นพ้องเรโซแนนซ์',
        mindmap: [
          { branch: 'ฮาร์มอนิกเชิงเดี่ยว (SHM)', items: ['สมการอนุพันธ์ $\\ddot{x} + \\omega_0^2 x = 0$', 'ผลเฉลย $x(t) = A\\cos(\\omega_0 t + \\phi)$', 'ความเร็ว $v(t) = -\\omega_0 A\\sin(\\omega_0 t + \\phi)$', 'ความเร่ง $a(t) = -\\omega_0^2 x(t)$'] },
          { branch: 'ระบบกายภาพ SHM', items: ['มวลติดสปริง $\\omega_0 = \\sqrt{k/m}$', 'ลูกตุ้มอย่างง่าย $\\omega_0 = \\sqrt{g/L}$', 'ลูกตุ้มกายภาพ $\\omega_0 = \\sqrt{mgd/I}$', 'ลูกตุ้มบิด $\\omega_0 = \\sqrt{\\kappa/I}$'] },
          { branch: 'พลังงานใน SHM', items: ['พลังงานรวม $E = \\frac{1}{2}kA^2 = \\frac{1}{2}m v_{\\max}^2 = \\text{คงที่}$', 'การเปลี่ยนรูประหว่าง $E_k \\leftrightarrow E_p$', 'ค่าเฉลี่ยตามเวลา $\\langle E_k \\rangle = \\langle E_p \\rangle = \\frac{1}{4}kA^2$'] },
          { branch: 'การสั่นหน่วง & เรโซแนนซ์', items: ['$\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = 0$', 'Underdamped ($\\gamma < \\omega_0$), Critically Damped ($\\gamma = \\omega_0$), Overdamped ($\\gamma > \\omega_0$)', 'เรโซแนนซ์แอมพลิจูดพุ่งสูงเมื่อ $\\omega \\approx \\omega_0$', 'ค่าประกอบคุณภาพ $Q = \\omega_0 / (2\\gamma)$'] }
        ],
        formulas: [
          { name: 'ความถี่เชิงมุมธรรมชาติ SHM', latex: '\\omega_0 = \\sqrt{\\frac{k}{m}} \\; (\\text{สปริง}), \\quad \\omega_0 = \\sqrt{\\frac{g}{L}} \\; (\\text{ลูกตุ้ม})', units: 'rad/s', condition: 'แอมพลิจูดเล็ก (ลูกตุ้ม $\\theta < 10^\\circ$)', desc: 'กำหนดคาบการสั่น $T = 2\\pi/\\omega_0$ โดยไม่ขึ้นกับแอมพลิจูด (Isochronism)' },
          { name: 'พลังงานรวมในระบบ SHM', latex: 'E_{\\text{tot}} = \\frac{1}{2} k A^2 = \\frac{1}{2} m v_{\\max}^2', units: 'J', condition: 'ระบบอนุรักษ์ไร้แรงต้าน', desc: 'พลังงานกลรวมแปรผันตามแอมพลิจูดยกกำลังสอง ($E \\propto A^2$)' },
          { name: 'การสั่นหน่วง (Underdamped)', latex: 'x(t) = A e^{-\\gamma t}\\cos(\\omega_d t + \\phi), \\quad \\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2}', units: 'm', condition: '$\\gamma < \\omega_0$ (แรงต้านหน่วงน้อย)', desc: 'แอมพลิจูดลดลงแบบเอกซ์โพเนนเชียลตามเวลาด้วยอัตรา $\\gamma = b/(2m)$' },
          { name: 'แอมพลิจูดการสั่นถูกเร้า', latex: 'A(\\omega) = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\gamma\\omega)^2}}', units: 'm', condition: 'แรงขับภายนอก $F(t) = F_0\\cos\\omega t$', desc: 'แอมพลิจูดพุ่งสูงสุด ณ ความถี่เรโซแนนซ์ $\\omega_r = \\sqrt{\\omega_0^2 - 2\\gamma^2}$' },
          { name: 'ค่าประกอบคุณภาพ (Quality Factor Q)', latex: 'Q = \\frac{\\omega_0}{2\\gamma} = 2\\pi \\frac{E_{\\text{stored}}}{E_{\\text{loss/cycle}}}', units: 'ไร้หน่วย', condition: 'ระบบกวัดแกว่งเรโซแนนซ์', desc: 'ดัชนีชี้วัดความคมชัดของพีคเรโซแนนซ์และการสูญเสียพลังงานใน 1 รอบ' }
        ],
        benchmarks: [
          { name: 'ความถี่ผลึกควอตซ์สร้างสัญญาณนาฬิกา', value: 'f = 32,768 Hz = 2¹⁵ Hz', ref: 'มาตรฐานวงจรหารความถี่ไบนารีในนาฬิกาข้อมือและไมโครคอนโทรลเลอร์' },
          { name: 'ลูกตุ้มหน่วงอาคารต้านแผ่นดินไหวไทเป 101', value: 'Mass = 660 ตัน, T ≈ 7.0 s', ref: 'ลูกตุ้มยักษ์เส้นผ่านศูนย์กลาง 5.5 m แขวนระหว่างชั้น 87-92 ดูดซับแรงลมไต้ฝุ่น' },
          { name: 'ค่า Q-Factor ของระบบต่างๆ', value: 'โช้ครถยนต์ Q ≈ 0.7; ผลึกควอตซ์ Q ≈ 10⁵; คาวิตียิ่งยวด Q ≈ 10¹⁰', ref: 'สะท้อนอัตราการสูญเสียพลังงานต่อรอบการสั่น' },
          { name: 'ความถี่การเดินข้ามสะพานมิลเลนเนียมลอนดอน', value: 'f_walk ≈ 0.8 Hz - 1.0 Hz', ref: 'ตรงกับความถี่ธรรมชาติในแนวราบของสะพาน นำไปสู่การแกว่งรุนแรงจนต้องปิดซ่อม' }
        ],
        laws: [
          'กฎของฮุก (Hooke\'s Law): $F = -kx$ เป็นเงื่อนไขที่จำเป็นและเพียงพอสำหรับการเกิด SHM แอมพลิจูดเล็ก',
          'ทฤษฎีบทการแบ่งเท่าของพลังงาน (Equipartition of Energy): ค่าเฉลี่ยตามเวลาของพลังงานจลน์เท่ากับพลังงานศักย์ $\\langle E_k \\rangle = \\langle E_p \\rangle = \\frac{1}{4}kA^2$',
          'หลักการสั่นพ้อง (Resonance Principle): การถ่ายทอดพลังงานเข้าสู่ระบบมีประสิทธิภาพสูงสุดเมื่อความถี่กระตุ้นตรงกับความถี่ธรรมชาติ'
        ],
        traps: [
          'ลูกตุ้มนาฬิกาอย่างง่ายเป็น SHM เฉพาะเมื่อมุมแกว่ง $\\theta < 10^\\circ$ เท่านั้น หากมุมกว้าง คาบจะยาวขึ้นตามอนุกรมเลอฌ็องดร์',
          'ที่จุดสมดุล $x=0$: ความเร็วสูงสุด $v_{\\max} = \\omega A$ แต่ความเร่งเป็นศูนย์ ($a = 0$)',
          'ที่จุดปลาย $x = \\pm A$: ความเร็วเป็นศูนย์ ($v = 0$) แต่ความเร่งสูงสุด ($|a_{\\max}| = \\omega^2 A$)',
          'การสั่นหน่วงวิกฤต (Critical Damping) ไม่ใช่การแกว่งเร็ว แต่เป็นสภาวะที่ระบบคืนตัวสู่จุดสมดุลเร็วที่สุดโดยไม่เกิดการแกว่งเลย'
        ],
        applications: [
          'ระบบกันสะเทือนยานยนต์ (Automotive Shock Absorbers): ปรับจูนค่า $\\gamma$ สู่ระดับ Critical Damping เพื่อเสถียรภาพและความนุ่มนวล',
          'เครื่องตรวจคลื่นแผ่นดินไหว (Seismograph): ใช้หลักการเฉื่อยของลูกตุ้มตรวจจับการเคลื่อนที่สัมพัทธ์ของเปลือกโลก',
          'วงจรกรองสัญญาณเรโซแนนซ์ LC และ RLC ในระบบรับ-ส่งวิทยุไร้สาย'
        ]
      },
      ch04: {
        num: '04',
        titleTh: 'บทที่ 04: คลื่นกล เสียง และทัศนศาสตร์ (Waves, Acoustics & Optics)',
        subtitle: 'สรุปสังเคราะห์แก่นวิชา: สมการคลื่น 1D คลื่นนิ่ง บีตส์ ดอปเปลอร์ กฎสเนลล์ และทัศนศาสตร์เรขาคณิต',
        mindmap: [
          { branch: 'สมการคลื่น & กำลังงาน', items: ['สมการคลื่น $\\frac{\\partial^2 y}{\\partial x^2} = \\frac{1}{v^2}\\frac{\\partial^2 y}{\\partial t^2}$', 'ฟังก์ชันคลื่นรูปไซน์ $y(x,t) = A\\sin(kx \\mp \\omega t)$', 'อัตราเร็วคลื่นในเชือก $v = \\sqrt{T/\\mu}$, ในก๊าซ $v = \\sqrt{\\gamma RT/M}$'] },
          { branch: 'การแทรกสอด & คลื่นนิ่ง', items: ['หลักการซ้อนทับ (Superposition)', 'คลื่นนิ่งในเชือกและท่อลม (บัพ Node และ ปฏิบัพ Antinode)', 'ปรากฏการณ์บีตส์ $f_b = |f_1 - f_2|$'] },
          { branch: 'สวนศาสตร์ & ดอปเปลอร์', items: ['ระดับความเข้มเสียง $\\beta = 10\\log_{10}(I/I_0)$ dB', 'ปรากฏการณ์ดอปเปลอร์ $f\' = f\\frac{v \\pm v_o}{v \\mp v_s}$', 'คลื่นกระแทกช็อกเวฟ $\\sin\\theta_M = 1/M$'] },
          { branch: 'ทัศนศาสตร์เรขาคณิต', items: ['กฎสเนลล์ $n_1\\sin\\theta_1 = n_2\\sin\\theta_2$', 'การสะท้อนกลับหมดและมุมวิกฤต $\\sin\\theta_c = n_2/n_1$', 'สมการเลนส์บาง $\\frac{1}{f} = \\frac{1}{s} + \\frac{1}{s\'}$'] }
        ],
        formulas: [
          { name: 'สมการคลื่นฮาร์มอนิกเดินทาง', latex: 'y(x,t) = A\\sin(kx \\mp \\omega t + \\phi)', units: 'm', condition: '$k = 2\\pi/\\lambda, \\omega = 2\\pi f$', desc: 'เครื่องหมายลบแสดงคลื่นเคลื่อนที่ไปทาง $+x$ เครื่องหมายบวกไปทาง $-x$' },
          { name: 'อัตราเร็วเสียงในก๊าซอุดมคติ', latex: 'v = \\sqrt{\\frac{\\gamma R T}{M}} = \\sqrt{\\frac{\\gamma P}{\\rho}}', units: 'm/s', condition: 'ก๊าซอุดมคติในกระบวนการแอเดียแบติก', desc: 'อัตราเร็วแปรผันตามรากที่สองของอุณหภูมิสัมบูรณ์ ($v \\propto \\sqrt{T}$)' },
          { name: 'ระดับความเข้มเสียง (Decibels)', latex: '\\beta = 10 \\log_{10}\\left(\\frac{I}{I_0}\\right), \\quad I_0 = 10^{-12}\\text{ W/m}^2', units: 'dB', condition: '$I_0$: ขีดเริ่มได้ยินของมนุษย์ที่ 1 kHz', desc: 'สเกลลอการิทึม ฐาน 10 สอดคล้องกับพฤติกรรมการรับรู้ของหูมนุษย์' },
          { name: 'ปรากฏการณ์ดอปเปลอร์ของเสียง', latex: 'f\' = f \\left( \\frac{v \\pm v_O}{v \\mp v_S} \\right)', units: 'Hz', condition: 'ผู้ฟัง ($O$) และแหล่งกำเนิด ($S$) เคลื่อนที่ตามแนวเชื่อมต่อ', desc: 'เครื่องหมายบน: เคลื่อนที่เข้าหากัน (ความถี่สูงขึ้น); เครื่องหมายล่าง: แยกออกจากกัน' },
          { name: 'กฎสเนลล์และการสะท้อนกลับหมด', latex: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2, \\quad \\sin\\theta_c = \\frac{n_2}{n_1} \\; (n_1 > n_2)', units: 'rad หรือ deg', condition: 'รังสีตกกระทบผ่านรอยต่อตัวกลางสองชนิด', desc: 'สะท้อนกลับหมดเมื่อมุมตกกระทบโตกว่ามุมวิกฤต $\\theta_1 > \\theta_c$' }
        ],
        benchmarks: [
          { name: 'อัตราเร็วเสียงในตัวกลางต่างๆ (20°C)', value: 'อากาศ: 343 m/s; น้ำทะเล: 1,530 m/s; รางเหล็ก: 5,960 m/s', ref: 'อัตราเร็วเพิ่มขึ้นตามค่ามอดุลัสความยืดหยุ่นของตัวกลาง' },
          { name: 'ขีดเริ่มได้ยินและขีดอันตรายต่อหู', value: 'ได้ยินเริ่มแรก: 0 dB (10⁻¹² W/m²); ปวดแก้วหู: 120 dB (1 W/m²)', ref: 'เครื่องบินเจ็ตทะยานขึ้นที่ระยะ 30 m ให้ระดับเสียงสูงถึง 140 dB' },
          { name: 'เส้นใยนำแสงสื่อสาร (Fiber Optics)', value: 'n_core ≈ 1.48, n_cladding ≈ 1.46, θ_c ≈ 80.6°', ref: 'ส่งผ่านแสงอินฟราเรด λ = 1550 nm ข้ามทวีปด้วยการสะท้อนกลับหมด 100%' },
          { name: 'ความถี่อัลตราซาวด์ทางการแพทย์', value: 'f = 2 MHz - 15 MHz (λ ≈ 0.1 - 0.7 mm ในเนื้อเยื่อ)', ref: 'ความยาวคลื่นสั้นช่วยให้ภาพตัดขวางมีรายละเอียดเชิงพื้นที่สูง (Spatial Resolution)' }
        ],
        laws: [
          'หลักการของฮอยเกนส์ (Huygens\' Principle): ทุกจุดบนหน้าคลื่นทำหน้าที่เป็นแหล่งกำเนิดคลื่นทุติยภูมิใหม่ที่แผ่ออกไปด้วยอัตราเร็วเท่ากัน',
          'หลักการของแฟร์มาต์ (Fermat\'s Principle): แสงเดินทางระหว่างสองจุดผ่านเส้นทางที่ใช้เวลาน้อยที่สุด นำไปสู่กฎการสะท้อนและการหักเห',
          'การซ้อนทับเชิงเส้น (Superposition Principle): แอมพลิจูดรวมของคลื่นที่ซ้อนทับกันเท่ากับผลรวมทางพีชคณิตของการกระจัดแต่ละคลื่น'
        ],
        traps: [
          'อัตราเร็วคลื่นขึ้นอยู่กับสมบัติของตัวกลางเท่านั้น (ความตึง ความหนาแน่น ความดัน อุณหภูมิ) ไม่ขึ้นกับความถี่หรือแอมพลิจูด',
          'ระดับเสียงเพิ่มขึ้น 3 dB หมายถึงความเข้มเสียงเพิ่มขึ้นเป็น 2 เท่า ($2I$), แต่ระดับเสียงเพิ่มขึ้น 10 dB หมายถึงความเข้มเพิ่มขึ้นเป็น 10 เท่า ($10I$)',
          'อนุภาคของตัวกลางไม่ได้เดินทางไปข้างหน้าพร้อมคลื่น แต่สั่นกวัดแกว่งรอบตำแหน่งสมดุลเดิม'
        ],
        applications: [
          'ระบบตัดเสียงรบกวนแบบแอกทีฟ (Active Noise Cancellation - ANC): สร้างคลื่นเสียงเฟสตรงข้าม ($180^\\circ$) เพื่อหักล้างเสียงรบกวน',
          'การสำรวจธรณีฟิสิกส์ด้วยคลื่นไหวสะเทือน (Seismic Reflection Survey) เพื่อค้นหาแหล่งกักเก็บปิโตรเลียม',
          'กล้องโทรทรรศน์อวกาศเจมส์เว็บบ์ (JWST) และเครื่องมือทัศนศาสตร์เลเซอร์ขั้นสูง'
        ]
      },
      ch05: {
        num: '05',
        titleTh: 'บทที่ 05: อุณหพลศาสตร์และทฤษฎีจลน์ของแก๊ส (Thermodynamics & Kinetic Theory)',
        subtitle: 'สรุปสังเคราะห์แก่นวิชา: ทฤษฎีจลน์โมเลกุล กฎข้อ 1 และ 2 ของเทอร์โมไดนามิกส์ เครื่องยนต์คาร์โนต์ และเอนโทรปี',
        mindmap: [
          { branch: 'ทฤษฎีจลน์ของแก๊ส', items: ['กฎแก๊สอุดมคติ $PV = nRT = Nk_BT$', 'ความดันจากโมเมนตัมโมเลกุล $P = \\frac{1}{3}\\rho v_{\\text{rms}}^2$', 'พลังงานจลน์เฉลี่ย $\\langle K \\rangle = \\frac{3}{2}k_BT$', 'การแจกแจงความเร็วแมกซ์เวลล์-โบลต์ซมันน์'] },
          { branch: 'กฎข้อที่ 1 เทอร์โมไดนามิกส์', items: ['$\\Delta U = Q - W$ (การอนุรักษ์พลังงานในระบบความร้อน)', 'พลังงานภายใน $U = \\frac{f}{2}nRT$', 'งานการขยายตัวเชิงกล $W = \\int P\\,dV$'] },
          { branch: '4 กระบวนการพื้นฐาน', items: ['Isobaric ($P=\\text{คงที่}, W=P\\Delta V$)', 'Isochoric ($V=\\text{คงที่}, W=0$)', 'Isothermal ($T=\\text{คงที่}, \\Delta U=0, W=nRT\\ln(V_f/V_i)$)', 'Adiabatic ($Q=0, PV^\\gamma=\\text{คงที่}, W=-\\Delta U$)'] },
          { branch: 'กฎข้อที่ 2 & เอนโทรปี', items: ['นิยามเอนโทรปี $dS = dQ_{\\text{rev}}/T$', 'กฎการเพิ่มขึ้นของเอนโทรปี $\\Delta S_{\\text{universe}} \\ge 0$', 'ประสิทธิภาพเครื่องยนต์คาร์โนต์ $\\eta_{\\text{Carnot}} = 1 - T_C/T_H$'] }
        ],
        formulas: [
          { name: 'กฎแก๊สอุดมคติและอัตราเร็ว RMS', latex: 'PV = N k_B T, \\quad v_{\\text{rms}} = \\sqrt{\\frac{3 k_B T}{m}} = \\sqrt{\\frac{3 R T}{M}}', units: 'm/s', condition: 'แก๊สอุดมคติ อนุภาคเป็นจุด ไร้แรงดึงดูดระหว่างโมเลกุล', desc: 'เชื่อมโยงอุณหภูมิมหภาคเข้ากับพลังงานจลน์ของโมเลกุลระดับจุลภาค' },
          { name: 'กฎข้อที่หนึ่งของอุณหพลศาสตร์', latex: '\\Delta U = Q - W, \\quad W = \\int_{V_i}^{V_f} P \\, dV', units: 'J', condition: 'ระบบปิด (Closed System)', desc: '$\\Delta U$: พลังงานภายในเปลี่ยน, $Q$: ความร้อนเข้าสู่ระบบ, $W$: งานที่ระบบกระทำต่อภายนอก' },
          { name: 'กระบวนการแอเดียแบติก (Adiabatic)', latex: 'P V^\\gamma = \\text{const}, \\quad T V^{\\gamma-1} = \\text{const}, \\quad \\gamma = \\frac{C_p}{C_v}', units: 'Pa, m³, K', condition: 'ฉนวนสมบูรณ์หรือกระบวนการเกิดขึ้นเร็วมาก ($Q = 0$)', desc: '$\\gamma$: อัตราส่วนความจุความร้อนจำเพาะ ($5/3$ สำหรับก๊าซอะตอมเดี่ยว, $7/5$ สำหรับอะตอมคู่)' },
          { name: 'ประสิทธิภาพเครื่องยนต์คาร์โนต์', latex: '\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H} = \\frac{W_{\\text{net}}}{Q_H}', units: 'ไร้หน่วย (0 ถึง 1)', condition: 'วัฏจักรผันกลับได้สมบูรณ์ระหว่างสองแหล่งอุณหภูมิ', desc: 'ประสิทธิภาพทางทฤษฎีสูงสุดที่เป็นไปได้ตามกฎข้อที่ 2 ของเทอร์โมไดนามิกส์' },
          { name: 'การนำความร้อน 1 มิติ (Fourier\'s Law)', latex: '\\dot{Q} = -k A \\frac{dT}{dx} = \\frac{\\Delta T}{R_{\\text{th}}}, \\quad R_{\\text{th}} = \\frac{L}{kA}', units: 'W', condition: 'สภาวะคงตัว 1 มิติ (Steady-State 1D Conduction)', desc: 'อัตราการสูญเสียความร้อนผ่านผนังหรือแผ่นกระจกหนา $L$ พื้นที่ $A$' }
        ],
        benchmarks: [
          { name: 'ศูนย์สัมบูรณ์ (Absolute Zero)', value: '0 K = -273.15°C', ref: 'พลังงานจลน์ต่ำสุดระดับควอนตัม (Zero-Point Energy); กฎข้อที่ 3 ของเทอร์โมไดนามิกส์' },
          { name: 'ความจุความร้อนจำเพาะของน้ำเหลว', value: 'c = 4,184 J/(kg·K)', ref: 'สูงที่สุดในบรรดาของเหลวธรรมชาติ ช่วยควบคุมและรักษาอุณหภูมิชีวมณฑลของโลก' },
          { name: 'อัตราเร็ว RMS ของโมเลกุลไนโตรเจน (N₂ at 300 K)', value: 'v_rms ≈ 517 m/s (1,861 km/h)', ref: 'เร็วกว่ากระสุนปืนพก โมเลกุลชนกันเฉลี่ย 5 พันล้านครั้งต่อวินาที' },
          { name: 'ความร้อนแฝงจำเพาะของการกลายเป็นไอของน้ำ', value: 'L_v ≈ 2.26 × 10⁶ J/kg', ref: 'พลังงานมหาศาลที่ต้องใช้ในการระเหยน้ำ จึงทำให้เหงื่อเป็นกลไกระบายความร้อนทรงพลัง' },
          { name: 'ประสิทธิภาพโรงไฟฟ้าพลังความร้อนจริง', value: 'η_real ≈ 38% - 42% (Carnot Limit ≈ 65%)', ref: 'สูญเสียจากความเสียดทาน การพาความร้อน และการถ่ายเทเอนโทรปีที่ไม่ผันกลับได้' }
        ],
        laws: [
          'กฎข้อที่หนึ่งของเทอร์โมไดนามิกส์ (First Law): การอนุรักษ์พลังงาน พลังงานไม่สูญหายแต่เปลี่ยนรูประหว่างความร้อน งาน และพลังงานภายใน',
          'กฎข้อที่สองของเทอร์โมไดนามิกส์ (Second Law): เอนโทรปีของเอกภพไม่เคยลดลง $\\Delta S_{\\text{univ}} \\ge 0$; ความร้อนไม่ไหลจากเย็นไปร้อนเองตามธรรมชาติ',
          'ทฤษฎีบทคาร์โนต์ (Carnot\'s Theorem): ไม่มีเครื่องยนต์ความร้อนใดระหว่างสองแหล่งอุณหภูมิที่มีประสิทธิภาพสูงกว่าเครื่องยนต์คาร์โนต์'
        ],
        traps: [
          'อุณหภูมิในสูตรเทอร์โมไดนามิกส์ทุกสูตรต้องใช้หน่วยเคลวิน ($K$) เสมอ ห้ามใช้เซลเซียสเด็ดขาด',
          'งาน $W = \\int P\\,dV$ เป็นฟังก์ชันเส้นทาง (Path Function) ไม่ใช่ฟังก์ชันสภาวะ (State Function)',
          'กระบวนการแอเดียแบติก ($Q=0$) อุณหภูมิไม่ได้คงที่: เมื่อก๊าซขยายตัวแบบแอเดียแบติก อุณหภูมิจะลดลงฮวบ ($T_f < T_i$) เพราะระบบดึงพลังงานภายในมาทำงาน'
        ],
        applications: [
          'โรงไฟฟ้าพลังงานความร้อนและนิวเคลียร์: การออกแบบวัฏจักรแรงคิน (Rankine Cycle) ไอน้ำยิ่งยวด',
          'ระบบปรับอากาศและตู้เย็น: วัฏจักรอัดไอ (Vapor Compression Cycle) เพื่อสูบความร้อนย้อนทิศทางธรรมชาติ',
          'เครื่องยนต์สันดาปภายในและกังหันก๊าซไอพ่นเครื่องบิน (Brayton Cycle)'
        ]
      },
      ch06: {
        num: '06',
        titleTh: 'บทที่ 06: ไฟฟ้า แม่เหล็ก และทรานเชียนต์ (Electricity, Magnetism & Transients)',
        subtitle: 'สรุปสังเคราะห์แก่นวิชา: สนามไฟฟ้า ตัวเก็บประจุ วงจร RC ทรานเชียนต์ แรงลอเรนซ์ และสมการแมกซ์เวลล์',
        mindmap: [
          { branch: 'ไฟฟ้าสถิต & ศักย์ไฟฟ้า', items: ['กฎคูลอมบ์ $\\vec{F} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r^2}\\hat{r}$', 'สนามไฟฟ้าและเกรเดียนต์ศักย์ $\\vec{E} = -\\nabla V$', 'กฎของเกาส์ $\\oint \\vec{E} \\cdot d\\vec{A} = Q_{\\text{encl}}/\\varepsilon_0$'] },
          { branch: 'ตัวเก็บประจุ & ไดอิเล็กทริก', items: ['ความจุ $C = \\kappa \\varepsilon_0 A / d$', 'พลังงานสะสม $U_E = \\frac{1}{2}CV^2$', 'ความหนาแน่นพลังงานสนามไฟฟ้า $u_E = \\frac{1}{2}\\varepsilon_0 E^2$', 'แรงดูดแผ่นไดอิเล็กทริก'] },
          { branch: 'วงจรไฟฟ้า & RC ทรานเชียนต์', items: ['กฎของโอห์ม $V = IR$, กฎเคอร์ชอฟฟ์ (KCL & KVL)', 'การอัดประจุ $V_C(t) = V_0(1 - e^{-t/RC})$', 'การคายประจุ $V_C(t) = V_0 e^{-t/RC}$', 'ค่าคงตัวเวลา $\\tau = RC$'] },
          { branch: 'แม่เหล็ก & แรงลอเรนซ์', items: ['แรงลอเรนซ์ $\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})$', 'สนามแม่เหล็กไม่ทำงานต่อประจุ ($W_B = 0$)', 'รัศมีไซโคลตรอน $r = \\frac{mv_{\\perp}}{qB}$', 'กฎฟาราเดย์และกฎเลนซ์ $\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$'] }
        ],
        formulas: [
          { name: 'กฎคูลอมบ์และสนามไฟฟ้าสถิต', latex: '\\vec{F} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r^2}\\hat{r}, \\quad \\vec{E} = -\\nabla V', units: 'N, V/m', condition: 'ประจุไฟฟ้าอยู่นิ่งในสุญญากาศ', desc: 'แรงดึงดูด/ผลักระหว่างประจุ และสนามไฟฟ้าในฐานะเกรเดียนต์ของศักย์สเกลาร์' },
          { name: 'ความจุและพลังงานตัวเก็บประจุ', latex: 'C = \\frac{\\kappa \\varepsilon_0 A}{d}, \\quad U_E = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C}', units: 'F, J', condition: 'ตัวเก็บประจุแผ่นขนานที่มีสารไดอิเล็กทริก $\\kappa$', desc: 'พลังงานถูกเก็บสะสมไว้ในรูปความเครียดของสนามไฟฟ้าระหว่างแผ่น' },
          { name: 'การอัดประจุในวงจร RC ทรานเชียนต์', latex: 'V_C(t) = V_0 \\left(1 - e^{-t/RC}\\right), \\quad I(t) = \\frac{V_0}{R} e^{-t/RC}', units: 'V, A', condition: 'สับสวิตช์เริ่มอัดประจุที่เวลา $t = 0$', desc: 'แรงดันตกคร่อมตัวเก็บประจุเพิ่มขึ้นอย่างต่อเนื่องตามค่าคงตัวเวลา $\\tau = RC$' },
          { name: 'แรงลอเรนซ์และรัศมีไซโคลตรอน', latex: '\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B}), \\quad r = \\frac{m v_{\\perp}}{q B}', units: 'N, m', condition: 'อนุภาคมีประจุเคลื่อนที่ในสนามไฟฟ้าและแม่เหล็ก', desc: 'แรงแม่เหล็กตั้งฉากกับเวกเตอร์ความเร็วเสมอ บังคับให้อนุภาคโค้งเป็นวงกลม' },
          { name: 'กฎการเหนี่ยวนำแม่เหล็กไฟฟ้าฟาราเดย์', latex: '\\mathcal{E} = -\\frac{d\\Phi_B}{dt} = -\\frac{d}{dt} \\int \\vec{B} \\cdot d\\vec{A}', units: 'V', condition: 'ฟลักซ์แม่เหล็กผ่านระนาบขดลวดเปลี่ยนแปลงตามเวลา', desc: 'เครื่องหมายลบตามกฎของเลนซ์ (Lenz\'s Law) เพื่อรักษาการอนุรักษ์พลังงาน' }
        ],
        benchmarks: [
          { name: 'สนามไฟฟ้าข้ามเยื่อหุ้มเซลล์ชีวภาพ', value: 'E ≈ 1.4 × 10⁷ V/m (140 kV/cm)', ref: 'ศักย์พักเซลล์ประสาท ΔV ≈ 70 mV ข้ามเยื่อไขมันหนาเพียง d ≈ 5 nm!' },
          { name: 'ความเข้มสนามไฟฟ้าที่อากาศเกิดการเบรกดาวน์', value: 'E_breakdown ≈ 30 kV/cm (3 × 10⁶ V/m)', ref: 'อากาศแตกตัวเป็นพลาสมานำไฟฟ้า เกิดประกายไฟหรือฟ้าผ่าเมื่อสนามเกินค่านี้' },
          { name: 'สนามแม่เหล็กของโลกที่ผิวโลก', value: 'B_Earth ≈ 25 - 65 μT (0.25 - 0.65 Gauss)', ref: 'ปกป้องสิ่งมีชีวิตบนโลกจากลมสุริยะและรังสีคอสมิกพลังงานสูง' },
          { name: 'สนามแม่เหล็กในเครื่องสแกน MRI ทางการแพทย์', value: 'B = 1.5 - 3.0 Tesla (~60,000 เท่าของสนามแม่เหล็กโลก)', ref: 'ขดลวดตัวนำยิ่งยวด NbTi หล่อเย็นด้วยฮีเลียมเหลวที่ 4.2 K' },
          { name: 'ความต้านทานคลื่นในสุญญากาศ (Vacuum Impedance)', value: 'Z₀ = √(μ₀/ε₀) ≈ 376.73 Ω', ref: 'อัตราส่วนระหว่างแอมพลิจูดสนามไฟฟ้าต่อสนามแม่เหล็กของคลื่นแม่เหล็กไฟฟ้า' }
        ],
        laws: [
          'สนามแม่เหล็กสถิตไม่ทำงานต่ออนุภาคมีประจุ: เนื่องจาก $\\vec{F}_B \\perp \\vec{v}$ ตลอดเวลา ทำให้พลังงานจลน์และอัตราเร็วคงตัว เปลี่ยนเฉพาะทิศทางการเคลื่อนที่',
          'กฎของเลนซ์ (Lenz\'s Law): กระแสเหนี่ยวนำมีทิศทางสร้างฟลักซ์แม่เหล็กต่อต้านการเปลี่ยนแปลงของฟลักซ์เดิม เพื่อรักษาการอนุรักษ์พลังงาน',
          'ความต่อเนื่องของสภาวะในวงจร RC: แรงดันตกคร่อมตัวเก็บประจุไม่สามารถเปลี่ยนแปลงแบบก้าวกระโดดได้ ($V_C(0^+) = V_C(0^-)$)'
        ],
        traps: [
          'แรงลอเรนซ์ในสนามแม่เหล็ก: ประจุบวกและประจุลบจะเลี้ยวเบนไปในทิศตรงข้ามกันตามกฎมือขวา',
          'สนามไฟฟ้าเหนี่ยวนำที่เกิดจากการเปลี่ยนแปลงสนามแม่เหล็ก $\\partial \\vec{B}/\\partial t$ "ไม่ใช่สนามอนุรักษ์" จึงไม่มีฟังก์ชันศักย์สเกลาร์',
          'ตัวเก็บประจุเมื่อต่อแหล่งจ่ายไฟ ($V=\\text{const}$) พลังงานคือ $U = \\frac{1}{2}CV^2$; แต่เมื่อตัดวงจร ($Q=\\text{const}$) พลังงานคือ $U = \\frac{Q^2}{2C}$'
        ],
        applications: [
          'เครื่องเร่งอนุภาคไซโคลตรอนและซินโครตรอน: บังคับอนุภาคพลังงานสูงด้วยสนามแม่เหล็กและเร่งด้วยสนามไฟฟ้าความถี่สูง',
          'เครื่องสร้างภาพด้วยสนามแม่เหล็กไฟฟ้า (MRI) และการตรวจวินิจฉัยทางการแพทย์',
          'ระบบส่งจ่ายไฟฟ้าแรงสูง หม้อแปลงไฟฟ้า และวงจรกรองสัญญาณ RC/RLC ในระบบโทรคมนาคม'
        ]
      },
      ch07: {
        num: '07',
        titleTh: 'บทที่ 07: ฟิสิกส์นิวเคลียร์ อนุภาค และควอนตัม (Nuclear, Particle & Modern Physics)',
        subtitle: 'สรุปสังเคราะห์แก่นวิชา: มวลพร่อง พลังงานยึดเหนี่ยว การสลายกัมมันตรังสี โฟโตอิเล็กทริก และแบบจำลองมาตรฐาน',
        mindmap: [
          { branch: 'ฟิสิกส์นิวเคลียร์', items: ['โครงสร้างนิวเคลียส $(Z, N, A)$', 'มวลพร่อง $\\Delta m$ และพลังงานยึดเหนี่ยว $E_b = \\Delta mc^2$', 'กราฟพลังงานยึดเหนี่ยวต่อนิวคลีออน (Peak ที่ Iron-56)'] },
          { branch: 'การสลายกัมมันตรังสี', items: ['กฎการสลาย $N(t) = N_0 e^{-\\lambda t}$, ครึ่งชีวิต $T_{1/2} = \\frac{\\ln 2}{\\lambda}$', 'การสลาย $\\alpha, \\beta^-, \\beta^+, \\gamma$'] },
          { branch: 'ปฏิกิริยานิวเคลียร์', items: ['นิวเคลียร์ฟิชชัน (Fission, U-235)', 'นิวเคลียร์ฟิวชัน (Fusion, D-T)', 'มวลวิกฤต (Critical Mass) และเตาปฏิกรณ์โทคาแมค'] },
          { branch: 'กำเนิดควอนตัม & ทวิภาวะ', items: ['สมมติฐานพลังก์ $E = hf$', 'โฟโตอิเล็กทริก $hf = \\Phi + K_{\\max}$', 'การกระเจิงคอมปตัน $\\Delta\\lambda = \\lambda_C(1-\\cos\\theta)$', 'คลื่นสสารเดอบรอยล์ $\\lambda = h/p$'] }
        ],
        formulas: [
          { name: 'มวลพร่องและพลังงานยึดเหนี่ยว', latex: '\\Delta m = Z m_p + (A - Z) m_n - M, \\quad E_b = \\Delta m c^2', units: 'u, MeV', condition: '1 u = 931.5 MeV/c²', desc: 'มวลที่หายไปเมื่อนิวคลีออนรวมกันกลายเป็นพลังงานยึดเหนี่ยวนิวเคลียส' },
          { name: 'กฎการสลายกัมมันตรังสีและครึ่งชีวิต', latex: 'N(t) = N_0 e^{-\\lambda t}, \\quad T_{1/2} = \\frac{\\ln 2}{\\lambda} \\approx \\frac{0.693}{\\lambda}', units: 'นิวเคลียส, s', condition: 'กระบวนการสุ่มทางสถิติของนิวเคลียสไม่เสถียร', desc: 'จำนวนนิวเคลียสที่เหลืออยู่ลดลงแบบเอกซ์โพเนนเชียลตามเวลา' },
          { name: 'สมการโฟโตอิเล็กทริกของไอน์สไตน์', latex: 'K_{\\max} = e V_s = h f - \\Phi = h(f - f_0)', units: 'eV หรือ J', condition: 'โฟตอน 1 ตัวทำอันตรกิริยากับอิเล็กตรอน 1 ตัว', desc: 'พลังงานจลน์สูงสุดขึ้นกับความถี่แสงตกกระทบและฟังก์ชันงานของโลหะ' },
          { name: 'ความยาวคลื่นสสารของเดอบรอยล์', latex: '\\lambda = \\frac{h}{p} = \\frac{h}{mv} = \\frac{h}{\\sqrt{2m E_k}}', units: 'm', condition: 'ทวิภาวะคลื่น-อนุภาคของสสาร', desc: 'อนุภาคทุกชนิดที่มีโมเมนตัมประพฤติตนเป็นคลื่นควอนตัม' },
          { name: 'การกระเจิงคอมปตัน (Compton Scattering)', latex: '\\Delta\\lambda = \\lambda\' - \\lambda = \\lambda_C(1 - \\cos\\theta), \\quad \\lambda_C = \\frac{h}{m_e c} \\approx 2.426\\text{ pm}', units: 'm', condition: 'การชนแบบยืดหยุ่นระหว่างโฟตอนกับอิเล็กตรอนอิสระ', desc: 'ความยาวคลื่นโฟตอนเพิ่มขึ้นหลังการกระเจิง พิสูจน์ว่าโฟตอนมีโมเมนตัม' }
        ],
        benchmarks: [
          { name: 'อะเมริเซียม-241 ในเครื่องตรวจจับควันตามบ้าน', value: 'Activity ≈ 0.9 μCi = 33.3 kBq, T₁/₂ = 432.2 ปี', ref: 'แผ่อนุภาคแอลฟา 5.49 MeV ทำให้อากาศแตกตัวเป็นไอออน เมื่อมีควันกระแสจะตกและส่งสัญญาณเตือน' },
          { name: 'ความหนาแน่นพลังงานนิวเคลียร์ฟิชชัน U-235', value: '1 kg U-235 ≈ 8 × 10¹³ J (เท่ากับถ่านหิน 2,700 ตัน!)', ref: 'อัตราส่วนความหนาแน่นพลังงานต่อน้ำหนักสูงกว่าเชื้อเพลิงฟอสซิลเกือบ 3 ล้านเท่า' },
          { name: 'การประลัยคู่อิเล็กตรอน-โพซิตรอนในเครื่อง PET Scan', value: 'E = m_e c² = 511 keV (ปล่อยรังสีแกมมา 2 ลำพุ่งตรงข้ามกัน 180°)', ref: 'ใช้ไอโซโทปโพซิตรอน F-18 ตรวจจับเซลล์มะเร็งด้วยความแม่นยำสูง' },
          { name: 'พลังงานยึดเหนี่ยวต่อนิวคลีออนสูงสุด', value: 'Peak at ⁵⁶Fe / ⁶²Ni ≈ 8.79 MeV/nucleon', ref: 'นิวเคลียสเบากว่าเหล็กฟิวชันปล่อยพลังงาน แต่นิวเคลียสหนักกว่าเหล็กฟิชชันปล่อยพลังงาน' }
        ],
        laws: [
          'กฎการอนุรักษ์ในปฏิกิริยานิวเคลียร์: อนุรักษ์เลขมวลรวม $A$, อนุรักษ์ประจุรวม $Z$, อนุรักษ์โมเมนตัม และอนุรักษ์มวล-พลังงานรวม',
          'หลักความไม่แน่นอนของไฮเซนเบิร์ก: $\\Delta x \\Delta p_x \\ge \\frac{\\hbar}{2}$ และ $\\Delta E \\Delta t \\ge \\frac{\\hbar}{2}$',
          'ทวิภาวะคลื่น-อนุภาค (Wave-Particle Duality): แสงและสสารแสดงคุณสมบัติเป็นคลื่นในการแพร่กระจาย และเป็นอนุภาคในการเกิดอันตรกิริยา'
        ],
        traps: [
          'ในโฟโตอิเล็กทริก: ความเข้มแสง (Intensity) ส่งผลเฉพาะ "จำนวนโฟโตอิเล็กตรอน" (กระแส) แต่ไม่เพิ่ม "พลังงานจลน์สูงสุด" $K_{\\max}$',
          'อัตราการสลายกัมมันตรังสี $\\lambda$ เป็นสมบัติทางสถิติระดับนิวเคลียส ไม่สามารถเร่งหรือชะลอด้วยความร้อน ความดัน หรือปฏิกิริยาเคมี',
          'การสลายบีตาลบ ($\\beta^-$) จะปลดปล่อยอิเล็กตรอนคู่กับ "อิเล็กตรอนแอนตินิวทริโน" ($\\bar{\\nu}_e$) เสมอเพื่อรักษาการอนุรักษ์สปินและพลังงาน'
        ],
        applications: [
          'โรงไฟฟ้านิวเคลียร์ฟิชชันและการวิจัยเตาปฏิกรณ์ฟิวชัน ITER / Tokamak เพื่อพลังงานสะอาดไร้คาร์บอน',
          'เวชศาสตร์นิวเคลียร์: การรักษาโรคมะเร็งด้วยรังสีโปรตอน และการตรวจวินิจฉัยความผิดปกติของอวัยวะด้วยไอโซโทป',
          'การหาอายุของซากโบราณคดีด้วยคาร์บอน-14 (Radiocarbon Dating: $T_{1/2} = 5,730\\text{ ปี}$)'
        ]
      },
      civil_eng: {
        num: 'CE',
        titleTh: 'วิศวกรรมโยธา: สถิตยศาสตร์ กลศาสตร์วัสดุ และโครงถัก (Civil Engineering)',
        subtitle: 'สรุปสังเคราะห์แก่นวิศวกรรม: สมดุลวัตถุเกร็ง โครงถัก 2D แผนภาพ SFD & BMD วงกลมของมอร์ และการโก่งเดาะออยเลอร์',
        mindmap: [
          { branch: 'สถิตยศาสตร์วิศวกรรม', items: ['สมดุลวัตถุเกร็ง $\\sum \\vec{F} = 0, \\sum \\vec{M} = 0$', 'แผนภาพวัตถุอิสระ (FBD)', 'จุดรองรับ: หมุด Pin, ลูกกลิ้ง Roller, ยึดแน่น Fixed'] },
          { branch: 'การวิเคราะห์โครงถัก (Truss)', items: ['สมมติฐานจุดต่อหมุดไร้แรงเสียดทาน รับเฉพาะแรงแนวแกน', 'แรงดึง (Tension: +) vs แรงอัด (Compression: -)', 'Method of Joints และ Method of Sections', 'ชิ้นส่วนแรงศูนย์ (Zero-Force Members)'] },
          { branch: 'กลศาสตร์วัสดุ (Mechanics of Materials)', items: ['ความเค้น $\\sigma = P/A$, ความเครียด $\\varepsilon = \\Delta L/L$, กฎฮุก $\\sigma = E\\varepsilon$', 'อัตราส่วนปัวซง $\\nu = -\\varepsilon_{\\text{lat}}/\\varepsilon_{\\text{long}}$', 'วงกลมของมอร์ (Mohr\'s Circle) และความเค้นหลัก $\\sigma_1, \\sigma_2$'] },
          { branch: 'คาน & การโก่งเดาะ (Beams & Columns)', items: ['ความสัมพันธ์อนุพันธ์ $\\frac{dV}{dx} = -w(x), \\frac{dM}{dx} = V(x)$', 'แผนภาพ SFD และ BMD', 'ความเค้นดัด $\\sigma = -My/I$, ความเค้นเฉือน $\\tau = VQ/(Ib)$', 'แรงโก่งเดาะออยเลอร์ $P_{\\text{cr}} = \\frac{\\pi^2 EI}{(KL)^2}$'] }
        ],
        formulas: [
          { name: 'สมการสมดุลสถิต 2 มิติ', latex: '\\sum F_x = 0, \\quad \\sum F_y = 0, \\quad \\sum M_O = 0', units: 'N, N·m', condition: 'วัตถุเกร็งในระนาบอยู่นิ่งสมบูรณ์', desc: 'ระบบสมการ 3 ตัวแปรสำหรับหาแรงปฏิกิริยาที่จุดรองรับ' },
          { name: 'ความเค้นหลักและวงกลมมอร์', latex: '\\sigma_{1,2} = \\frac{\\sigma_x + \\sigma_y}{2} \\pm \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}', units: 'Pa (MPa)', condition: 'สถานะความเค้นในระนาบ 2 มิติ (Plane Stress)', desc: 'ความเค้นตั้งฉากสูงสุดและต่ำสุดที่ระนาบซึ่งความเค้นเฉือนเป็นศูนย์' },
          { name: 'ความเค้นดัดงอในคาน (Flexure Formula)', latex: '\\sigma = -\\frac{M y}{I}, \\quad \\sigma_{\\max} = \\frac{M}{S}, \\quad S = \\frac{I}{c}', units: 'Pa (MPa)', condition: 'คานยืดหยุ่นเชิงเส้นตามกฎของฮุก เกิดการดัดแท้', desc: 'ความเค้นดัดแปรผันตามระยะห่างจากแกนสะเทิน (Neutral Axis)' },
          { name: 'ความเค้นเฉือนตามขวางในคาน', latex: '\\tau = \\frac{V Q}{I b}, \\quad Q = \\int y\\,dA', units: 'Pa (MPa)', condition: 'คานรับแรงเฉือน $V$', desc: 'ความเค้นเฉือนสูงสุดที่แนวแกนสะเทิน และเป็นศูนย์ที่ผิวนอกสุดของคาน' },
          { name: 'แรงโก่งเดาะวิกฤตของเสาออยเลอร์', latex: 'P_{\\text{cr}} = \\frac{\\pi^2 E I}{(K L)^2}', units: 'N (kN)', condition: 'เสายาวเรียวรับแรงอัดตามแนวแกน ($L/r > 100$)', desc: 'น้ำหนักบรรทุกสูงสุดก่อนเสาสูญเสียเสถียรภาพและโก่งเดาะฉับพลัน' }
        ],
        benchmarks: [
          { name: 'มอดุลัสความยืดหยุ่นของเหล็กโครงสร้าง (Steel)', value: 'E_steel ≈ 200 GPa (200,000 MPa)', ref: 'เหล็กรูปพรรณ มอก. / ASTM A36 กำลังคราก f_y ≈ 250 MPa' },
          { name: 'มอดุลัสความยืดหยุ่นของคอนกรีต (Concrete)', value: 'E_c ≈ 20 - 30 GPa', ref: 'คอนกรีตรับแรงอัดได้ดี f\'c ≈ 24 - 40 MPa แต่รับแรงดึงได้เพียง ~10% จึงต้องเสริมเหล็ก' },
          { name: 'อัตราส่วนปัวซงของวัสดุวิศวกรรม', value: 'เหล็ก ν ≈ 0.30; คอนกรีต ν ≈ 0.15 - 0.20; ไม้ก๊อก ν ≈ 0.0', ref: 'สัดส่วนการหดตัวตามแนวขวางเมื่อถูกยืดตามแนวยาว' },
          { name: 'ตัวประกอบความยาวประสิทธิผลของเสา (K-factor)', value: 'หมุด-หมุด: K = 1.0; แน่น-อิสระ: K = 2.0; แน่น-แน่น: K = 0.5', ref: 'จุดยึดแน่นทั้งสองข้างทำให้เสารับแรงอัดได้มากกว่าเสาปลายหมุดถึง 4 เท่า!' }
        ],
        laws: [
          'สมดุลสถิตสมบูรณ์: โครงสร้างไม่เคลื่อนที่เชิงเส้นและไม่หมุนเมื่อแรงลัพธ์และโมเมนต์ลัพธ์รอบทุกจุดเป็นศูนย์',
          'ความสัมพันธ์ระหว่างแรงเฉือนและโมเมนต์ดัด: ตำแหน่งที่แรงเฉือนผ่านศูนย์ ($V(x) = 0$) คือตำแหน่งที่เกิดโมเมนต์ดัดสูงสุด ($M_{\\max}$) เสมอ',
          'หลักการของแซงต์-เวอนองต์ (Saint-Venant\'s Principle): ความเค้นที่ระยะห่างจากจุดกระทำของแรงจะกระจายตัวสม่ำเสมอตามสมการวิศวกรรมพื้นฐาน'
        ],
        traps: [
          'ชิ้นส่วนรับแรงอัด (Compression Members) มักพังทลายจากการโก่งเดาะ (Euler Buckling) ที่ระดับแรงต่ำกว่ากำลังครากของวัสดุอย่างมาก',
          'มุมบนวงกลมของมอร์เท่ากับ $2\\theta$ (สองเท่าของมุมการหมุนระนาบจริง $\\theta$ ในโครงสร้าง)',
          'แบบแผนเครื่องหมาย (Sign Convention): แรงเฉือนดันซ้ายขึ้นขวาลงเป็นบวก โมเมนต์ดัดทำให้คานแอ่นหงาย (Sagging) เป็นบวก'
        ],
        applications: [
          'การออกแบบสะพานโครงถักเหล็ก (Warren, Pratt, Howe Truss Bridges)',
          'การออกแบบโครงสร้างอาคารต้านแรงลมและแผ่นดินไหวตามมาตรฐานสภาวิศวกร (ก.ว.) และ วสท.',
          'การคำนวณคานสะพานทางยกระดับคอนกรีตอัดแรง (Prestressed Concrete Girders)'
        ]
      }
    };

    const cur = summaryData[chapterId] || summaryData['ch01'];

    target.innerHTML = `
      <div class="summary-page-container">
        <!-- Top Banner -->
        <div class="summary-hero-banner">
          <div class="summary-badge">📋 บทสรุปมโนทัศน์ &amp; เมทริกซ์แก่นวิชา (University Synthesis Matrix)</div>
          <h2 class="summary-hero-title">${cur.titleTh}</h2>
          <p class="summary-hero-subtitle">${cur.subtitle}</p>
        </div>

        <!-- Interactive Category Switcher Toolbar -->
        <div class="summary-filter-toolbar" role="toolbar" aria-label="กรองมุมมองการสรุปบทเรียน">
          <button class="summary-filter-btn ${activeSummarySectionFilter === 'all' ? 'active' : ''}" data-sfilter="all">
            🏛️ สรุปครบทุกมิติ (All)
          </button>
          <button class="summary-filter-btn ${activeSummarySectionFilter === 'mindmap' ? 'active' : ''}" data-sfilter="mindmap">
            🗺️ ผังมโนทัศน์
          </button>
          <button class="summary-filter-btn ${activeSummarySectionFilter === 'formulas' ? 'active' : ''}" data-sfilter="formulas">
            📐 เมทริกซ์สูตร &amp; หน่วย SI
          </button>
          <button class="summary-filter-btn ${activeSummarySectionFilter === 'benchmarks' ? 'active' : ''}" data-sfilter="benchmarks">
            🌍 ตัวเลขอ้างอิงโลกจริง
          </button>
          <button class="summary-filter-btn ${activeSummarySectionFilter === 'laws' ? 'active' : ''}" data-sfilter="laws">
            ⚖️ กฎการอนุรักษ์
          </button>
          <button class="summary-filter-btn ${activeSummarySectionFilter === 'traps' ? 'active' : ''}" data-sfilter="traps">
            ⚠️ จุดตายข้อสอบ
          </button>
          <button class="summary-filter-btn ${activeSummarySectionFilter === 'apps' ? 'active' : ''}" data-sfilter="apps">
            🏗️ วิศวกรรมศาสตร์
          </button>
        </div>

        <!-- Master Synthesis Cards Grid -->
        <div class="summary-grid">
          <!-- CARD 1: CONCEPT MINDMAP -->
          <div class="summary-card mindmap-card summary-mindmap-card" data-section="mindmap" style="${activeSummarySectionFilter !== 'all' && activeSummarySectionFilter !== 'mindmap' ? 'display:none;' : ''}">
            <div class="summary-card-header">
              <span class="summary-card-icon">🗺️</span>
              <div>
                <h3 class="summary-card-title">1. ผังมโนทัศน์และแกนหลักวิชา (Executive Conceptual Mindmap)</h3>
                <div class="summary-card-sub">การจัดหมวดหมู่ความสัมพันธ์และโครงสร้างองค์ความรู้เชิงระบบ</div>
              </div>
            </div>
            <div class="summary-card-body">
              <div class="mindmap-tree">
                ${cur.mindmap.map((b, bIdx) => `
                  <div class="mindmap-branch">
                    <div class="branch-title">📌 แกนที่ ${bIdx + 1}: <strong>${b.branch}</strong></div>
                    <ul class="branch-list">
                      ${b.items.map(it => `<li>${it}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- CARD 2: MASTER FORMULAS MATRIX WITH SI UNITS -->
          <div class="summary-card formulas-card summary-matrix-card" data-section="formulas" style="${activeSummarySectionFilter !== 'all' && activeSummarySectionFilter !== 'formulas' ? 'display:none;' : ''}">
            <div class="summary-card-header">
              <span class="summary-card-icon">📐</span>
              <div>
                <h3 class="summary-card-title">2. เมทริกซ์สูตรหลัก ตัวแปร และหน่วย SI (Master Formula &amp; SI Unit Matrix)</h3>
                <div class="summary-card-sub">สมการกำกับหลัก นิยามความหมาย เงื่อนไขการใช้งาน และหน่วยมาตรฐานสากล</div>
              </div>
            </div>
            <div class="summary-card-body">
              <div class="summary-table-wrap">
                <table class="summary-formula-table">
                  <thead>
                    <tr>
                      <th style="width: 22%;">ชื่อสมการ / หลักการ</th>
                      <th style="width: 32%;">รูปสูตรคณิตศาสตร์ (KaTeX)</th>
                      <th style="width: 14%;">หน่วย SI</th>
                      <th style="width: 32%;">คำอธิบายเชิงกายภาพ &amp; เงื่อนไข</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cur.formulas.map(f => `
                      <tr>
                        <td><strong>${f.name}</strong></td>
                        <td class="table-math-cell">$$${f.latex}$$</td>
                        <td><span class="si-unit-badge">${f.units}</span></td>
                        <td class="table-desc-cell">
                          <div>${f.desc}</div>
                          <div style="font-size: 0.78rem; color: #38BDF8; margin-top: 0.25rem;">⚡ เงื่อนไข: ${f.condition}</div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- CARD 3: REAL-WORLD EMPIRICAL BENCHMARKS -->
          <div class="summary-card benchmarks-card summary-benchmarks-card" data-section="benchmarks" style="${activeSummarySectionFilter !== 'all' && activeSummarySectionFilter !== 'benchmarks' ? 'display:none;' : ''}">
            <div class="summary-card-header">
              <span class="summary-card-icon">🌍</span>
              <div>
                <h3 class="summary-card-title">3. ตัวเลขอ้างอิงและหมุดหมายในโลกจริง (Real-World Empirical Benchmarks)</h3>
                <div class="summary-card-sub">เชื่อมโยงคณิตศาสตร์สู่ขนาดอันดับ (Orders of Magnitude) ในธรรมชาติและเทคโนโลยี</div>
              </div>
            </div>
            <div class="summary-card-body">
              <div class="benchmarks-grid">
                ${cur.benchmarks.map(bm => `
                  <div class="benchmark-item">
                    <div class="benchmark-val">${bm.value}</div>
                    <div class="benchmark-name">${bm.name}</div>
                    <div class="benchmark-ref">${bm.ref}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- CARD 4: CONSERVATION LAWS & SYMMETRIES -->
          <div class="summary-card laws-card summary-conservation-card" data-section="laws" style="${activeSummarySectionFilter !== 'all' && activeSummarySectionFilter !== 'laws' ? 'display:none;' : ''}">
            <div class="summary-card-header">
              <span class="summary-card-icon">⚖️</span>
              <div>
                <h3 class="summary-card-title">4. กฎการอนุรักษ์และความสมมาตร (Conservation Laws &amp; Symmetries)</h3>
                <div class="summary-card-sub">สัจพจน์รากฐานที่ไม่แปรเปลี่ยนตามกาลเวลาตามทฤษฎีบทของเนอเธอร์</div>
              </div>
            </div>
            <div class="summary-card-body">
              <ul class="summary-check-list">
                ${cur.laws.map(l => `
                  <li class="check-item">
                    <span class="check-icon">✓</span>
                    <span>${l}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- CARD 5: COMMON PITFALLS & EXAM TRAPS -->
          <div class="summary-card traps-card summary-traps-card" data-section="traps" style="${activeSummarySectionFilter !== 'all' && activeSummarySectionFilter !== 'traps' ? 'display:none;' : ''}">
            <div class="summary-card-header">
              <span class="summary-card-icon">⚠️</span>
              <div>
                <h3 class="summary-card-title">5. กับดักและข้อผิดพลาดยอดฮิต (Common Pitfalls &amp; High-Yield Exam Traps)</h3>
                <div class="summary-card-sub">จุดที่มักเข้าใจผิดบ่อยในการสอบคัดเลือกโอลิมปิกและวิศวกรรมศาสตร์</div>
              </div>
            </div>
            <div class="summary-card-body">
              <div class="traps-grid">
                ${cur.traps.map(tr => `
                  <div class="trap-box">
                    <div class="trap-badge">⚠️ จุดควรระวัง</div>
                    <p class="trap-text">${tr}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- CARD 6: REAL-WORLD ENGINEERING SYNTHESIS -->
          <div class="summary-card apps-card summary-realworld-card" data-section="apps" style="${activeSummarySectionFilter !== 'all' && activeSummarySectionFilter !== 'apps' ? 'display:none;' : ''}">
            <div class="summary-card-header">
              <span class="summary-card-icon">🏗️</span>
              <div>
                <h3 class="summary-card-title">6. การประยุกต์ใช้งานในระบบวิศวกรรมจริง (State-of-the-Art Engineering Systems)</h3>
                <div class="summary-card-sub">กรณีศึกษาการต่อยอดทฤษฎีสู่อุตสาหกรรมอวกาศ ยานยนต์ และการแพทย์</div>
              </div>
            </div>
            <div class="summary-card-body">
              <div class="apps-grid">
                ${cur.applications.map(app => `
                  <div class="app-card-item">
                    <div class="app-icon">🚀</div>
                    <div class="app-desc">${app}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        ${renderTabStepNavBar(5, { view: 'view-phenomena', label: '← ย้อนกลับ: 🌍 4. รูปภาพ & ปรากฏการณ์' }, { view: 'view-practice', label: '🚀 สู่คลังข้อสอบและทำโจทย์คำนวณ →' })}
      </div>
    `;

    // Bind Summary Section Filter Buttons
    target.querySelectorAll('.summary-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSummarySectionFilter = btn.dataset.sfilter;
        target.querySelectorAll('.summary-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        target.querySelectorAll('.summary-card').forEach(card => {
          const sec = card.dataset.section;
          if (activeSummarySectionFilter === 'all' || sec === activeSummarySectionFilter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Typeset KaTeX inside summary container
    if (window.MathRenderer) {
      window.MathRenderer.typeset(target);
    }
  }

  /**
   * Render Standalone Master Variable & SI Unit Matrix
   */
  function renderMasterSymbolsLedger(chapterId = currentChapter) {
    let data = window.PhysicsTheoriesContent;
    if (chapterId === 'ch02') {
      data = window.Chapter02Content;
    } else if (chapterId === 'ch03') {
      data = window.Chapter03Content;
    } else if (chapterId === 'ch04') {
      data = window.Chapter04Content;
    } else if (chapterId === 'ch05') {
      data = window.Chapter05Content;
    } else if (chapterId === 'ch06') {
      data = window.Chapter06Content;
    } else if (chapterId === 'ch07') {
      data = window.Chapter07Content;
    } else if (chapterId === 'civil_eng') {
      data = window.CivilEngineeringContent;
    } else if (chapterId === 'civil_eng') {
      data = window.CivilEngineeringContent;
    }
    if (!data || !data.masterSymbols) return '';

    const allSymbols = data.masterSymbols;
    const filtered = activeSymbolDomain === 'all'
      ? allSymbols
      : allSymbols.filter(s => s.domain === activeSymbolDomain);

    const domainMap = new Map();
    allSymbols.forEach(s => {
      if (s.domain && !domainMap.has(s.domain)) {
        domainMap.set(s.domain, s.domainTh || s.domain);
      }
    });

    const domains = [
      { id: 'all', label: `ทั้งหมด (${allSymbols.length})` }
    ];
    domainMap.forEach((label, id) => {
      domains.push({ id, label });
    });

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
                  const sSym = (s.sym || s.symbol || s.latex || '').replace(/^\$+|\$+$/g, '').trim();
                  let sUnit = (s.unit || s.unitSI || s.unitLatex || '').replace(/^\$+|\$+$/g, '').trim();
                  if (!sUnit || sUnit.includes('ไร้หน่วย') || sUnit.toLowerCase().includes('dimensionless')) {
                    sUnit = '—';
                  }
                  const sDomain = s.domain || '';
                  const sDomainTh = s.domainTh || s.domain || '';

                  s._normSym = sSym;
                  s._normUnit = sUnit;

                  if (currentGroup && currentGroup.unit === sUnit && currentGroup.domain === sDomain) {
                    currentGroup.items.push(s);
                  } else {
                    currentGroup = {
                      unit: sUnit,
                      domain: sDomain,
                      domainTh: sDomainTh,
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

                    const displaySym = s._normSym ? `$${s._normSym}$` : '—';
                    const isUnitless = !group.unit || group.unit === '—' || group.unit.includes('ไร้หน่วย') || group.unit.toLowerCase().includes('dimensionless');
                    const displayUnit = isUnitless ? '<span style="color: var(--text-muted); font-size: 0.95rem; font-weight: bold;">—</span>' : `$${group.unit}$`;
                    const displayNote = s.note || s.desc || s.description || '';

                    return `
                      <tr class="${trClass}">
                        <td class="cell-sym"><strong>${displaySym}</strong></td>
                        <td class="cell-name">
                          <span class="${activeRecallMode ? 'recall-blur' : ''}">
                            <strong>${s.nameTh || s.name || ''}</strong><br>
                            <small style="color: var(--text-secondary);">${s.nameEn || ''}</small>
                          </span>
                        </td>
                        ${isFirst ? `
                          <td rowspan="${rowSpan}" class="cell-unit-merged ${rowSpan > 1 ? 'is-merged' : ''}">
                            <span class="${activeRecallMode ? 'recall-blur' : ''}">
                              ${displayUnit}
                            </span>
                          </td>
                          <td rowspan="${rowSpan}" class="cell-domain-merged ${rowSpan > 1 ? 'is-merged' : ''}">
                            <span class="card-badge">${group.domainTh || 'ทั่วไป'}</span>
                          </td>
                        ` : ''}
                        <td class="cell-note" style="font-size: 0.82rem; color: var(--text-secondary);">
                          ${displayNote}
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
  function renderFormulasContent(chapterId = currentChapter) {
    const container = document.getElementById('formulas-content-target');
    if (!container) return;

    let data = window.PhysicsTheoriesContent;
    let projData = window.ProjectileContent;
    let titleMain = 'สารบัญสูตร สรุปกระชับ และการอนุมานรวดเดียว';
    let subtitleMain = 'สรุปสูตรกระชับประจำบท อ่านและจดจำได้ในหน้าเดียว พร้อมการอนุมานทีละขั้น กรอบรวมสัญลักษณ์ และเชื่อมโยงแบบจำลอง';

    if (chapterId === 'ch02') {
      data = window.Chapter02Content;
      projData = null;
      titleMain = 'บทที่ 02: สารบัญสูตร สรุปกระชับ และการอนุมานการเคลื่อนที่แบบวงกลม';
      subtitleMain = 'ความเร่งสู่ศูนย์กลาง, แรงสู่ศูนย์กลาง, ทางโค้งยกมุมเอียง, วงกลมแนวดิ่ง และวงโคจรดาวเทียม';
    } else if (chapterId === 'ch03') {
      data = window.Chapter03Content;
      projData = null;
      titleMain = 'บทที่ 03: สารบัญสูตร สรุปกระชับ และการอนุมานการแกว่งกวัด';
      subtitleMain = 'กฎของฮุก, พลังงานกล SHM, ลูกตุ้มอย่างง่าย, การสั่นหน่วง 3 สภาวะ และสูตรแอมพลิจูดเรโซแนนซ์';
    } else if (chapterId === 'ch04') {
      data = window.Chapter04Content;
      projData = null;
      titleMain = 'บทที่ 04: สารบัญสูตร สรุปกระชับ และการอนุมานคลื่นกลและเสียง';
      subtitleMain = 'สมการคลื่น, อัตราเร็วคลื่น, กำลังงานเฉลี่ย, คลื่นนิ่ง, ความถี่บีตส์, เดซิเบล และดอปเปลอร์';
    } else if (chapterId === 'ch05') {
      data = window.Chapter05Content;
      projData = null;
      titleMain = 'บทที่ 05: สารบัญสูตร สรุปกระชับ และการอนุมานอุณหพลศาสตร์';
      subtitleMain = 'กฎแก๊สอุดมคติ, งานขยายตัว W = ∫PdV, กระบวนการแอเดียแบติก PV^γ, ประสิทธิภาพคาร์โนต์ และสถิติแมกซ์เวลล์-โบลต์ซมันน์';
    } else if (chapterId === 'ch06') {
      data = window.Chapter06Content;
      projData = null;
      titleMain = 'บทที่ 06: สารบัญสูตร สรุปกระชับ และการอนุมานไฟฟ้าและแม่เหล็ก';
      subtitleMain = 'กฎคูลอมบ์ F = kq1q2/r², กฎเกาส์ ∮E·dA = Q/ε0, วงจร RC τ = RC, แรงลอเรนซ์ F = q(E + v×B) และกฎฟาราเดย์ ε = -dΦB/dt';
    } else if (chapterId === 'ch07') {
      data = window.Chapter07Content;
      projData = null;
      titleMain = 'บทที่ 07: สารบัญสูตร สรุปกระชับ และการอนุมานฟิสิกส์นิวเคลียร์';
      subtitleMain = 'พลังงานยึดเหนี่ยว Eb = Δm·c², กฎการสลาย N(t) = N0 e^(-λt), ครึ่งชีวิต T1/2 = ln 2 / λ, ค่า Q และปริมาณรังสี H = D·wR';
    }

    if (!data || !data.theories) return;

    let html = `
      <div class="content-header">
        <h2 class="content-title">${titleMain} ทั้ง ${data.theories.length} ทฤษฎี</h2>
        <p class="content-subtitle">${subtitleMain}</p>
      </div>
    `;

    // (1) Render Standalone Master Variable & Unit Matrix
    html += renderMasterSymbolsLedger(chapterId);

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
            ${(data.divisions || []).map(div => `
              <button class="formula-division-filter-btn ${activeFormulaDivisionFilter === div.id ? 'active' : ''}" data-division="${div.id}">
                ${div.numeral}: ${div.titleTh.split('(')[0].trim()}
              </button>
            `).join('')}
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
                      <details class="formula-derivation-collapsible" style="margin-top: 0.5rem; border: 1px solid var(--border-light); border-radius: 6px; background: rgba(15, 23, 42, 0.4); overflow: hidden;">
                        <summary style="cursor: pointer; padding: 0.45rem 0.75rem; font-size: 0.82rem; font-weight: 700; color: #38bdf8; outline: none; user-select: none;">
                          🔍 ดูขั้นตอนการอนุมานละเอียด (Step-by-step Derivation) ▼
                        </summary>
                        <div class="formula-derivation-compact" style="padding: 0.6rem 0.85rem; border-top: 1px dashed var(--border-light); font-size: 0.85rem; background: rgba(30, 41, 59, 0.5);">
                          <div class="formula-derivation-title" style="font-weight: 700; color: var(--accent-orange); margin-bottom: 0.35rem;">ขั้นตอนการพิสูจน์อนุมานทีละขั้น:</div>
                          ${f.derivationSteps.map(step => `<p style="margin: 0.25rem 0; line-height: 1.55;">${step}</p>`).join('')}
                        </div>
                      </details>
                    ` : ''}
                  </div>
                `).join('')}

                <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-light); font-size: 0.85rem;">
                  <span class="formula-scope-tag">
                    <strong>ขอบเขต:</strong> ${t.application.validWhen}
                  </span>
                  ${(() => {
                    if (chapterId === 'ch02') {
                      return `
                        <button class="btn-action-primary btn-jump-to-sim" data-chapter="ch02" data-theory-id="${t.id}" aria-label="ดูแบบจำลองวงกลมของทฤษฎีนี้">
                          🎯 ดูแบบจำลองวงกลมตรงเรื่อง
                        </button>
                      `;
                    } else if (chapterId === 'ch03') {
                      return `
                        <button class="btn-action-primary btn-jump-to-sim" data-chapter="ch03" data-theory-id="${t.id}" aria-label="ดูแบบจำลองการแกว่งกวัดของทฤษฎีนี้">
                          🌀 ดูแบบจำลองการแกว่งกวัดตรงเรื่อง
                        </button>
                      `;
                    } else if (chapterId === 'ch04') {
                      return `
                        <button class="btn-action-primary btn-jump-to-sim" data-chapter="ch04" data-theory-id="${t.id}" aria-label="ดูแบบจำลองคลื่นกลของทฤษฎีนี้">
                          🌊 ดูแบบจำลองคลื่นกลตรงเรื่อง
                        </button>
                      `;
                    } else if (chapterId === 'ch05') {
                      return `
                        <button class="btn-action-primary btn-jump-to-sim" data-chapter="ch05" data-theory-id="${t.id}" aria-label="ดูแบบจำลองอุณหพลศาสตร์ของทฤษฎีนี้">
                          🔥 ดูแบบจำลองอุณหพลศาสตร์ตรงเรื่อง
                        </button>
                      `;
                    } else if (chapterId === 'ch06') {
                      return `
                        <button class="btn-action-primary btn-jump-to-sim" data-chapter="ch06" data-theory-id="${t.id}" aria-label="ดูแบบจำลองแม่เหล็กไฟฟ้าของทฤษฎีนี้">
                          ⚡ ดูแบบจำลองแม่เหล็กไฟฟ้าตรงเรื่อง
                        </button>
                      `;
                    } else if (chapterId === 'ch07') {
                      return `
                        <button class="btn-action-primary btn-jump-to-sim" data-chapter="ch07" data-theory-id="${t.id}" aria-label="ดูแบบจำลองนิวเคลียร์ของทฤษฎีนี้">
                          ☢️ ดูแบบจำลองนิวเคลียร์ตรงเรื่อง
                        </button>
                      `;
                    }
                    const hasSim = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13].includes(t.id);
                    if (hasSim) {
                      return `
                        <button class="btn-action-primary btn-jump-to-sim" data-chapter="ch01" data-theory-id="${t.id}" aria-label="ดูแบบจำลองที่เกี่ยวข้องกับทฤษฎีที่ ${t.id}">
                          🎯 ดูแบบจำลองที่เกี่ยวข้อง
                        </button>
                      `;
                    } else {
                      let statusNote = '📐 แผนภาพเวกเตอร์ / ยังไม่มีแบบจำลองพลศาสตร์ตรงเรื่อง';
                      if (t.id === 11) statusNote = '📐 กลศาสตร์การหมุน / ยังไม่มีแบบจำลองพลศาสตร์ตรงเรื่อง';
                      if (t.id === 12) statusNote = '📐 แผนภาพเวกเตอร์ / อยู่ในแผนพัฒนาบทที่ 02';
                      if (t.id === 14) statusNote = '📐 การวิเคราะห์สมการ / ยังไม่มีแบบจำลองพลศาสตร์ตรงเรื่อง';
                      if (t.id === 15) statusNote = '📐 กลศาสตร์ของไหล / อยู่ในแผนพัฒนาวิศวกรรมเฉพาะทาง';
                      return `
                        <span class="sim-status-tag-truthful">
                          ${statusNote}
                        </span>
                      `;
                    }
                  })()}
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

    html += renderTabStepNavBar(2, { view: 'view-theory', label: '← ย้อนกลับ: 📖 1. ทฤษฎี' }, { view: 'view-simulator', label: 'ขั้นต่อไป: 🎯 3. แบบจำลอง →' });

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
    const simBtns = container.querySelectorAll('.btn-jump-to-sim, .sim-deep-link-btn');
    simBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chap = btn.dataset.chapter || currentChapter;
        const rawTheoryId = btn.dataset.theoryId;
        launchSimulatorForTheory(chap, rawTheoryId);
      });
    });

    if (window.MathRenderer) {
      window.MathRenderer.typeset(container);
    }
  }

  // ========================================================================
  // VIEW 6: Dedicated Worked Calculation Examples Renderer (ตัวอย่างการคำนวณ)
  // ========================================================================
  let activeExampleDivisionFilter = 'all';

  function renderExamplesContent(chapterId = currentChapter) {
    const container = document.getElementById('examples-content-target');
    if (!container) return;
    container.innerHTML = '';

    let data = window.PhysicsTheoriesContent;
    let chapTitle = 'บทที่ 01: การเคลื่อนที่สองมิติและโปรเจกไทล์';

    if (chapterId === 'ch02') {
      data = window.Chapter02Content;
      chapTitle = 'บทที่ 02: การเคลื่อนที่แบบวงกลมและแรงสู่ศูนย์กลาง';
    } else if (chapterId === 'ch03') {
      data = window.Chapter03Content;
      chapTitle = 'บทที่ 03: การแกว่งกวัดและฮาร์มอนิกอย่างง่าย';
    } else if (chapterId === 'ch04') {
      data = window.Chapter04Content;
      chapTitle = 'บทที่ 04: คลื่นกลและเสียง';
    } else if (chapterId === 'ch05') {
      data = window.Chapter05Content;
      chapTitle = 'บทที่ 05: อุณหพลศาสตร์และทฤษฎีจลน์ของแก๊ส';
    } else if (chapterId === 'ch06') {
      data = window.Chapter06Content;
      chapTitle = 'บทที่ 06: ไฟฟ้าและแม่เหล็ก';
    } else if (chapterId === 'ch07') {
      data = window.Chapter07Content;
      chapTitle = 'บทที่ 07: ฟิสิกส์นิวเคลียร์และอนุภาค';
    } else if (chapterId === 'civil_eng') {
      data = window.CivilEngineeringContent;
      chapTitle = 'สาขาวิศวกรรมโยธา: สถิตยศาสตร์ & กำลังวัสดุ';
    }

    if (!data || !data.theories) return;

    // Filter theories that have worked examples
    const theoriesWithExamples = data.theories.filter(t => t.example && (t.example.problem || (t.example.steps && t.example.steps.length > 0)));

    let html = `
      <div class="content-header">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
          <span class="card-badge" style="background: linear-gradient(135deg, #059669, #047857); color: #FFF; font-size: 0.85rem; padding: 0.35rem 0.75rem;">
            🧮 คลังตัวอย่างการคำนวณมาตรฐาน (Worked Examples Laboratory)
          </span>
          <span class="card-badge" style="background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-light);">
            ${theoriesWithExamples.length} ตัวอย่างโจทย์ละเอียด
          </span>
        </div>
        <h2 class="content-title">ตัวอย่างการคำนวณและเฉลยละเอียด: ${chapTitle}</h2>
        <p class="content-subtitle">
          ฝึกฝนกระบวนการคิดวิเคราะห์ฟิสิกส์ทีละขั้นตอน (Step-by-Step Derivation) การแทนค่าตัวเลขในหน่วย SI และเชื่อมโยงเข้าสู่แบบจำลองเสมือนจริงเพื่อตรวจสอบผลลัพธ์
        </p>
      </div>

      <!-- Division Filter Tabs -->
      <div class="example-filter-bar" style="margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">กรองตามภาควิชา:</span>
          <div class="division-filter-tabs" role="group" aria-label="กรองตัวอย่างตามภาควิชา">
            <button class="division-filter-btn ${activeExampleDivisionFilter === 'all' ? 'active' : ''}" data-example-div="all">
              ทั้งหมด (${theoriesWithExamples.length})
            </button>
            ${(data.divisions || []).map(div => `
              <button class="division-filter-btn ${activeExampleDivisionFilter === div.id ? 'active' : ''}" data-example-div="${div.id}">
                ${div.numeral || 'ภาค'}: ${div.titleTh.split('(')[0].trim()}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Examples List -->
      <div class="examples-grid" style="display: flex; flex-direction: column; gap: 1.75rem;">
    `;

    // Render each example card
    theoriesWithExamples.forEach((t, idx) => {
      const isVisible = (activeExampleDivisionFilter === 'all' || t.divisionId === activeExampleDivisionFilter);
      const ex = t.example;

      html += `
        <article class="theory-card example-card" id="example-card-${t.id}" data-div="${t.divisionId}" style="display: ${isVisible ? 'block' : 'none'}; border-left: 4px solid #10b981;">
          <header class="theory-card-header" style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
            <div class="theory-tag-row">
              <span class="tag-number" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">
                ตัวอย่างที่ ${idx + 1}
              </span>
              <span class="tag-type">${t.numberTh}: ${t.titleTh}</span>
              <span class="card-badge">${(t.divisionTitle || '').split(':')[0] || 'ภาควิชา'}</span>
            </div>
            <h3 class="theory-card-title-th" style="font-size: 1.15rem; margin-top: 0.5rem; color: #f8fafc;">
              ${t.titleTh} &mdash; ${t.titleEn || ''}
            </h3>
          </header>

          <div class="theory-card-body" style="padding-top: 1rem;">
            <!-- Problem Statement -->
            <div class="example-prob-box" style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 1.15rem 1.25rem; margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: 700; color: #38bdf8; font-size: 0.95rem;">
                <span>📋 โจทย์และสถานการณ์ปัญหา:</span>
              </div>
              <p style="font-size: 1rem; line-height: 1.7; color: #f1f5f9; margin: 0;">
                ${ex.problem || ''}
              </p>
            </div>

            <!-- Schematic Diagram if present -->
            ${ex.diagramSvg ? `
              <div class="theory-diagram-wrapper" style="margin: 1rem 0; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; overflow-x: auto;">
                ${ex.diagramSvg}
                ${ex.diagramCaption ? `<div class="diagram-caption" style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; text-align: center; max-width: 90%;">${ex.diagramCaption}</div>` : ''}
              </div>
            ` : ''}

            <!-- Step-by-Step Derivation Steps -->
            <div class="step-container" style="margin-top: 1rem;">
              <div style="font-weight: 700; font-size: 0.92rem; color: #f59e0b; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>📐 ขั้นตอนการคำนวณและแสดงวิธีทำทีละขั้น (Step-by-Step Mathematical Solution):</span>
              </div>
              ${Array.isArray(ex.steps) ? ex.steps.map((st) => `
                <div class="step-card" style="border-left: 3px solid #10b981; margin-bottom: 0.65rem; padding: 0.85rem 1.15rem; background: rgba(15, 23, 42, 0.45); border-radius: 6px;">
                  <div style="font-size: 0.94rem; line-height: 1.7; color: #e2e8f0;">
                    ${formatTextProse(st)}
                  </div>
                </div>
              `).join('') : ''}
            </div>

            <!-- Action footer: Jump to Theory & Launch Simulator -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px dashed var(--border-light);">
              <button class="btn-action-outline" onclick="window.PhysicsApp.switchView('view-theory'); setTimeout(() => { const el = document.getElementById('theory-${t.id}'); if(el) el.scrollIntoView({behavior: 'smooth'}); }, 100);" style="padding: 0.5rem 1rem; font-size: 0.88rem; border-radius: 6px; border: 1px solid var(--border-light); color: var(--text-secondary); background: transparent; cursor: pointer;">
                📖 อ่านทฤษฎีบทนี้เต็ม ↗
              </button>
              <button class="sim-deep-link-btn" data-theory-id="${t.id}" data-chapter="${chapterId}" style="padding: 0.5rem 1.15rem; font-size: 0.88rem; border-radius: 6px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border: 1px solid #3b82f6; color: #ffffff; cursor: pointer; font-weight: 700;">
                🎯 นำพารามิเตอร์ไปจำลองจริงใน Simulator &rarr;
              </button>
            </div>
          </div>
        </article>
      `;
    });

    html += `
      </div>
    `;

    container.innerHTML = html;

    // Attach Division Filter Buttons
    const filterBtns = container.querySelectorAll('.division-filter-btn[data-example-div]');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const divId = btn.dataset.exampleDiv;
        activeExampleDivisionFilter = divId;

        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.exampleDiv === divId));

        const cards = container.querySelectorAll('.example-card');
        cards.forEach(card => {
          if (divId === 'all' || card.dataset.div === divId) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Attach Simulator Preset deep link buttons
    container.querySelectorAll('.sim-deep-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const chap = btn.dataset.chapter || currentChapter;
        const rawTheoryId = btn.dataset.theoryId;
        launchSimulatorForTheory(chap, rawTheoryId);
      });
    });

    // Typeset KaTeX
    if (window.MathRenderer) {
      window.MathRenderer.typeset(container);
    }
  }

  // ========================================================================
  // VIEW 4: Real-World Engineering & Natural Phenomena Renderer
  // ========================================================================
  let activePhenomenaFilter = 'all';
  let activePhenomenaSearch = '';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderPhenomenaContent(chapterId = currentChapter) {
    const container = document.getElementById('phenomena-content-target');
    if (!container) return;
    container.innerHTML = '';

    let allPhenomena = [];
    let meta = {
      titleTh: "ปรากฏการณ์ในธรรมชาติและงานวิศวกรรมจริง",
      titleEn: "Physical Phenomena & Real-World Engineering Applications",
      descriptionTh: "การเชื่อมโยงทฤษฎีสู่สิ่งที่สังเกตได้ในโลกจริง"
    };
    let filterTabs = [
      { id: 'all', label: 'ทั้งหมด' },
      { id: 'div1', label: 'ภาคที่ 1: จลนศาสตร์' },
      { id: 'div2', label: 'ภาคที่ 2: พลศาสตร์' },
      { id: 'div3', label: 'ภาคที่ 3: กฎการอนุรักษ์' },
      { id: 'div4', label: 'ภาคที่ 4: การหมุน & ของไหล' },
      { id: 'div5', label: 'ภาคที่ 5: ทัศนศาสตร์ & ควอนตัม' }
    ];

    if (chapterId === 'ch02') {
      const dataModule = window.Chapter02Content;
      if (dataModule && dataModule.phenomena) {
        allPhenomena = dataModule.phenomena;
        meta = {
          titleTh: "บทที่ 02: ปรากฏการณ์การเคลื่อนที่แบบวงกลมในวิศวกรรมและธรรมชาติ",
          titleEn: "Circular Motion Phenomena in Engineering & Nature",
          descriptionTh: "ทางโค้งยกมุมเอียงมาตรฐาน AASHTO, รถไฟเหาะตีลังกาคลอธอยด์, ดาวเทียมค้างฟ้า GEO และการปั่นเหวี่ยงความเร็วสูง"
        };
        filterTabs = [
          { id: 'all', label: `ทั้งหมด (${allPhenomena.length} รายการ)` },
          { id: 'div-ch02-kinematics', label: 'ภาคที่ 1: จลนศาสตร์วงกลม' },
          { id: 'div-ch02-dynamics', label: 'ภาคที่ 2: พลศาสตร์วงกลม' }
        ];
      }
    } else if (chapterId === 'ch03') {
      const dataModule = window.Chapter03Content;
      if (dataModule && dataModule.phenomena) {
        allPhenomena = dataModule.phenomena;
        meta = {
          titleTh: "บทที่ 03: ปรากฏการณ์การแกว่งกวัดและสั่นพ้องในวิศวกรรมและธรรมชาติ",
          titleEn: "Oscillations & Resonance Phenomena in Engineering & Nature",
          descriptionTh: "การพังทลายของสะพานทาโคมาแนร์โรวส์ (Aeroelastic Flutter), โช้กอัพรถยนต์และความหน่วงวิกฤต, ลูกตุ้มฟูโกต์พิสูจน์การหมุนของโลก และการสั่นพ้องของส้อมเสียง"
        };
        filterTabs = [
          { id: 'all', label: `ทั้งหมด (${allPhenomena.length} รายการ)` },
          { id: 'div-ch03-kinematics-shm', label: 'ภาคที่ 1: SHM & พลศาสตร์' },
          { id: 'div-ch03-damping-resonance', label: 'ภาคที่ 2: ความหน่วง & สั่นพ้อง' }
        ];
      }
    } else if (chapterId === 'ch04') {
      const dataModule = window.Chapter04Content;
      if (dataModule && dataModule.phenomena) {
        allPhenomena = dataModule.phenomena;
        meta = {
          titleTh: "บทที่ 04: ปรากฏการณ์คลื่นกล เสียง และทัศนศาสตร์เชิงเรขาคณิต",
          titleEn: "Mechanical Waves, Acoustics & Geometric Optics Phenomena in Engineering & Nature",
          descriptionTh: "โซนิกบูม, ท่อคุนด์, อัลตราซาวด์ดอปเปลอร์, เส้นใยแก้วนำแสง TIR และเลนส์อรงค์แก้ความคลาดรงค์"
        };
        filterTabs = [
          { id: 'all', label: `ทั้งหมด (${allPhenomena.length} รายการ)` },
          { id: 'div-ch04-wave-mechanics', label: 'ภาคที่ 1: กลศาสตร์คลื่น' },
          { id: 'div-ch04-acoustics-interference', label: 'ภาคที่ 2: สวนศาสตร์ & ดอปเปลอร์' },
          { id: 'div-ch04-geometric-optics', label: 'ภาคที่ 3: กระจก & เลนส์' }
        ];
      }
    } else if (chapterId === 'ch05') {
      const dataModule = window.Chapter05Content;
      if (dataModule && dataModule.phenomena) {
        allPhenomena = dataModule.phenomena;
        meta = {
          titleTh: "บทที่ 05: ปรากฏการณ์อุณหพลศาสตร์และทฤษฎีจลน์ในวิศวกรรมและธรรมชาติ",
          titleEn: "Thermodynamics & Kinetic Theory Phenomena in Engineering & Nature",
          descriptionTh: "การจุดระเบิดด้วยการอัดในเครื่องยนต์ดีเซล, ระบบทำความเย็นแบบอัดไอและปั๊มความร้อน, อัตราลดอุณหภูมิบรรยากาศและลมเฟิน, และการผลิตก๊าซเหลวไครโอเจนิกส์ด้วยกระบวนการลินเดอ"
        };
        filterTabs = [
          { id: 'all', label: `ทั้งหมด (${allPhenomena.length} รายการ)` },
          { id: 'div-ch05-fundamentals', label: 'ภาคที่ 1: พื้นฐาน & กฎข้อที่ 1' },
          { id: 'div-ch05-cycles-entropy', label: 'ภาคที่ 2: วัฏจักร & กฎข้อที่ 2' }
        ];
      }
    } else if (chapterId === 'ch06') {
      const dataModule = window.Chapter06Content;
      if (dataModule && dataModule.phenomena) {
        allPhenomena = dataModule.phenomena;
        meta = {
          titleTh: "บทที่ 06: ปรากฏการณ์ไฟฟ้าและแม่เหล็กในวิศวกรรมและธรรมชาติ",
          titleEn: "Electromagnetism & Circuit Phenomena in Engineering & Nature",
          descriptionTh: "ฟ้าผ่าและการคายประจุโคโรนา, เครื่องเร่งอนุภาคไซโคลตรอนและแถบรังสีแวนอัลเลน, ระบบเบรกกระแสไหลวน (Eddy Current Brakes), และการส่งกำลังไฟฟ้าไร้สายแบบเรโซแนนซ์"
        };
        filterTabs = [
          { id: 'all', label: `ทั้งหมด (${allPhenomena.length} รายการ)` },
          { id: 'div-ch06-electrostatics-circuits', label: 'ภาคที่ 1: ไฟฟ้าสถิต & วงจรไฟฟ้า' },
          { id: 'div-ch06-magnetism-induction', label: 'ภาคที่ 2: แม่เหล็กสถิต & การเหนี่ยวนำ' }
        ];
      }
    } else if (chapterId === 'ch07') {
      const dataModule = window.Chapter07Content;
      if (dataModule && dataModule.phenomena) {
        allPhenomena = dataModule.phenomena;
        meta = {
          titleTh: "บทที่ 07: ปรากฏการณ์ฟิสิกส์นิวเคลียร์ในวิศวกรรมและการแพทย์",
          titleEn: "Nuclear Physics Phenomena in Engineering, Cosmology & Medicine",
          descriptionTh: "การหาอายุทางโบราณคดีด้วยคาร์บอน-14, เตาปฏิกรณ์นิวเคลียร์ฟิชชันแบบน้ำอัดความดัน (PWR), เทอร์โมนิวเคลียร์ฟิวชันในแกนดวงอาทิตย์และโทคาแมก, และการตรวจเพทสแกน (PET) พร้อมมาตรวิทยาโดสิมิเตอร์"
        };
        filterTabs = [
          { id: 'all', label: `ทั้งหมด (${allPhenomena.length} รายการ)` },
          { id: 'div-ch07-nuclear-structure', label: 'ภาคที่ 1: โครงสร้าง & พลังงานยึดเหนี่ยว' },
          { id: 'div-ch07-radioactivity-reactions', label: 'ภาคที่ 2: กัมมันตรังสี & การตรวจวัด' }
        ];
      }
    } else {
      const dataModule = window.PhenomenaData || (window.ProjectileContent && window.ProjectileContent.phenomena ? { phenomena: window.ProjectileContent.phenomena } : null);
      if (dataModule && dataModule.phenomena) {
        allPhenomena = dataModule.phenomena;
        meta = dataModule.meta || meta;
        filterTabs[0].label = `ทั้งหมด (${allPhenomena.length} รายการ)`;
      }
    }

    if (!allPhenomena || allPhenomena.length === 0) {
      container.innerHTML = `
        <div class="phenomena-empty-state" style="padding: 3rem; text-align: center; color: #94A3B8;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔬</div>
          <h3 style="color: #F8FAFC; margin-bottom: 0.5rem;">อยู่ระหว่างรวบรวมปรากฏการณ์สำหรับบทนี้</h3>
          <p>ข้อมูลสำหรับบทที่ ${chapterId} กำลังได้รับการจัดเตรียมตามมาตรฐานวิชาการ 6 มิติ</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="content-header">
        <h2 class="content-title">${meta.titleTh}</h2>
        <p class="content-subtitle">${meta.titleEn} &mdash; ${meta.descriptionTh}</p>
      </div>

      <!-- Phenomena Control Toolbar -->
      <div class="phenomena-toolbar" role="region" aria-label="แถบควบคุมและค้นหาปรากฏการณ์">
        <div class="phenomena-filter-group" role="group" aria-label="กรองตามภาควิชา">
          ${filterTabs.map(tab => `
            <button class="phenomena-filter-btn ${activePhenomenaFilter === tab.id ? 'active' : ''}" data-filter="${tab.id}">
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <div class="phenomena-search-box">
          <span class="phenomena-search-icon">🔍</span>
          <input type="text" id="phenomena-search-input" class="phenomena-search-input" placeholder="ค้นหาปรากฏการณ์, ทฤษฎี, คำสำคัญ..." value="${activePhenomenaSearch}">
        </div>

        <div id="phenomena-count-display" class="phenomena-count-badge">
          แสดง ${allPhenomena.length} / ${allPhenomena.length} รายการ
        </div>
      </div>

      <!-- Phenomena Cards Container -->
      <div id="phenomena-cards-list" class="phenomena-list">
    `;

    allPhenomena.forEach((p) => {
      const pId = p.id || 'PHE-GENERIC';
      const pDiv = p.division || 'ภาควิชาทั่วไป';
      const pCat = p.category || p.categoryTh || 'ฟิสิกส์ประยุกต์';
      const pTitleTh = p.titleTh || p.title || 'ปรากฏการณ์ทางฟิสิกส์';
      const pTitleEn = p.titleEn || p.subtitle || '';
      const pObserved = p.observed || p.summary || p.application || '-';
      const pMechanism = p.mechanism || p.description || '-';
      const pScope = p.scope || p.scientificSignificance || '-';
      const pFormulas = p.formulas || (p.mathProof ? [{ latex: p.mathProof, desc: 'สมการและบทพิสูจน์ทางคณิตศาสตร์' }] : []);
      const pVariables = p.variables || (p.parameters ? p.parameters.map(param => ({
        symbol: param.symbol || '—',
        name: param.name || 'พารามิเตอร์',
        unit: param.unit || '—',
        typical: param.value || param.typical || param.note || '—'
      })) : []);
      const pCitations = p.citations || (p.citation ? [{
        title: typeof p.citation === 'string' ? p.citation : (p.citation.title || 'ตำราวิชาการ'),
        year: p.citation.year || '',
        authors: p.citation.authors || '',
        source: p.citation.source || '',
        verificationStatus: 'verified_direct_content',
        evidencePin: typeof p.citation === 'string' ? p.citation : (p.citation.evidencePin || '')
      }] : []);
      const pSvgDiagram = p.svgDiagram || p.svgSchematic || '';
      const pImagePath = p.imagePath || '';
      const pImageCaption = p.imageCaption || '';

      // Determine all matching division keys for multi-division cards
      const divisionKeys = [];
      const divStr = (pDiv + ' ' + (p.id || '')).toLowerCase();
      if (divStr.includes('1') || divStr.includes('จลนศาสตร์') || divStr.includes('kinematics') || divStr.includes('กลศาสตร์คลื่น') || divStr.includes('พื้นฐาน') || divStr.includes('ไฟฟ้าสถิต') || divStr.includes('โครงสร้าง') || divStr.includes('ch02-01') || divStr.includes('ch02-02') || divStr.includes('ch03-01') || divStr.includes('ch03-02') || divStr.includes('ch04-01') || divStr.includes('ch04-02') || divStr.includes('ch05-01') || divStr.includes('ch05-03') || divStr.includes('ch06-01') || divStr.includes('ch06-04') || divStr.includes('ch07-01') || divStr.includes('ch07-02')) {
        divisionKeys.push('div1', 'div-ch02-kinematics', 'div-ch03-kinematics-shm', 'div-ch04-wave-mechanics', 'div-ch05-fundamentals', 'div-ch06-electrostatics-circuits', 'div-ch07-nuclear-structure');
      }
      if (divStr.includes('2') || divStr.includes('พลศาสตร์') || divStr.includes('dynamics') || divStr.includes('ความหน่วง') || divStr.includes('สั่นพ้อง') || divStr.includes('สวนศาสตร์') || divStr.includes('ดอปเปลอร์') || divStr.includes('วัฏจักร') || divStr.includes('แม่เหล็ก') || divStr.includes('กัมมันตรังสี') || divStr.includes('ch02-03') || divStr.includes('ch02-04') || divStr.includes('ch03-03') || divStr.includes('ch03-04') || divStr.includes('ch04-03') || divStr.includes('ch04-04') || divStr.includes('ch05-02') || divStr.includes('ch05-04') || divStr.includes('ch06-02') || divStr.includes('ch06-03') || divStr.includes('ch07-03') || divStr.includes('ch07-04')) {
        divisionKeys.push('div2', 'div-ch02-dynamics', 'div-ch03-damping-resonance', 'div-ch04-acoustics-interference', 'div-ch05-cycles-entropy', 'div-ch06-magnetism-induction', 'div-ch07-radioactivity-reactions');
      }
      if (divStr.includes('3') || divStr.includes('อนุรักษ์') || divStr.includes('conservation') || divStr.includes('เรขาคณิต') || divStr.includes('กระจก') || divStr.includes('เลนส์') || divStr.includes('optics') || divStr.includes('ch04-05') || divStr.includes('ch04-06') || divStr.includes('ch07-05') || divStr.includes('ch07-06') || divStr.includes('ch07-07')) {
        divisionKeys.push('div3', 'div-ch04-geometric-optics');
      }
      if (divStr.includes('4') || divStr.includes('ของไหล') || divStr.includes('หมุน') || divStr.includes('rotation') || divStr.includes('fluids')) {
        divisionKeys.push('div4');
      }
      if (divStr.includes('5') || divStr.includes('ทัศนศาสตร์') || divStr.includes('ควอนตัม') || divStr.includes('quantum') || divStr.includes('แสง')) {
        divisionKeys.push('div5');
      }
      if (divisionKeys.length === 0) divisionKeys.push('div1', 'div2');
      const divAttr = divisionKeys.join(' ');

      const simNameMap = {
        projectile: 'โหมดที่ 1: โปรเจกไทล์ & แรงต้าน',
        vehicle: 'โหมดที่ 2: รถแข่ง & เวกเตอร์ลม',
        collision: 'โหมดที่ 3: การชน & การดล 1D',
        threejs: 'โหมดที่ 4: วิถี 3 มิติ Three.js',
        circular: 'โหมดที่ 5: แบบจำลองวงกลมและทางโค้งเอียง',
        wave: 'แบบจำลองคลื่น & คลื่นแสง'
      };
      const simLabel = p.relatedSimulator ? simNameMap[p.relatedSimulator] || 'เปิดแบบจำลอง' : null;

      html += `
        <article class="phenomena-card" id="${pId}" data-id="${pId}" data-division="${divisionKeys[0]}" data-divisions="${divAttr}" data-keywords="${(pTitleTh + ' ' + pTitleEn + ' ' + pCat + ' ' + pId + ' ' + pObserved).toLowerCase()}">
          <!-- Left Column: Academic Content & Formulas -->
          <div class="phenomena-info-col">
            <div class="phenomena-badge-row">
              <span class="phenomena-id-chip">${pId}</span>
              <span class="phenomena-div-chip">${pDiv}</span>
              <span class="phenomena-cat-chip">${pCat}</span>
            </div>

            <h3 class="phenomena-card-title-th">${pTitleTh}</h3>
            <div class="phenomena-card-title-en">${pTitleEn}</div>

            <!-- 1. What is Observed -->
            <div class="phenomena-section-item">
              <span class="phenomena-section-label">👀 สิ่งที่สังเกตเห็นในโลกจริง (Observation)</span>
              <div>${pObserved}</div>
            </div>

            <!-- 2. Physical Mechanism -->
            <div class="phenomena-section-item">
              <span class="phenomena-section-label">⚙️ กลไกทางฟิสิกส์เชิงลึก (Physical Mechanism)</span>
              <div>${pMechanism ? pMechanism.replace(/\\n/g, '<br/><br/>') : ''}</div>
            </div>

            <!-- 3. Scope & Boundary Conditions -->
            <div class="phenomena-section-item">
              <span class="phenomena-section-label">📏 ขอบเขตและเงื่อนไขการบังคับใช้ (Boundary Conditions & Validity)</span>
              <div style="color: #CBD5E1;">${pScope || '-'}</div>
            </div>

            <!-- 4. Mathematical Formulas with KaTeX -->
            <div class="phenomena-section-item">
              <span class="phenomena-section-label">📐 สมการคณิตศาสตร์และกฎที่เกี่ยวข้อง (Governing Equations)</span>
              ${(pFormulas || []).map(f => `
                <div class="phenomena-formula-container">
                  <div class="math-display">$$${f.latex}$$</div>
                  <div class="phenomena-formula-desc">&bull; ${f.desc}</div>
                </div>
              `).join('')}
            </div>

            <!-- 5. Variables & SI Units Table -->
            ${pVariables && pVariables.length > 0 ? `
              <div class="phenomena-section-item">
                <span class="phenomena-section-label">📊 ตัวแปรและหน่วย SI สากล (Variables & Dimensions)</span>
                <div class="phenomena-table-wrapper">
                  <table class="phenomena-table">
                    <thead>
                      <tr>
                        <th>สัญลักษณ์</th>
                        <th>ความหมายทางกายภาพ</th>
                        <th>หน่วย SI</th>
                        <th>ค่าพิกัดมาตรฐาน / ค่าทั่วไป</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${pVariables.map(v => `
                        <tr>
                          <td class="phenomena-symbol">$${v.symbol}$</td>
                          <td>${v.name}</td>
                          <td class="phenomena-unit">${(!v.unit || v.unit.includes('ไร้หน่วย') || v.unit.toLowerCase().includes('dimensionless') || v.unit === '—') ? '—' : v.unit}</td>
                          <td style="color: #94A3B8;">${v.typical || '-'}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- 6. Academic Citations -->
            <div class="phenomena-section-item">
              <span class="phenomena-section-label">📚 แหล่งอ้างอิงวิชาการเปิดและหน้าตำรา (Academic Citations)</span>
              <div class="phenomena-citations-list">
                ${(pCitations || []).map(c => `
                  <div class="phenomena-citation-card">
                    <div class="phenomena-citation-title">📖 ${c.title} (${c.year || ''})</div>
                    <div class="phenomena-citation-meta">${c.authors || ''} &mdash; <em>${c.source || ''}</em></div>
                    ${c.url ? `<div class="phenomena-citation-url" style="margin: 0.25rem 0;"><a href="${c.url}" target="_blank" rel="noopener noreferrer" style="color: #38BDF8; font-size: 0.8rem; text-decoration: underline; word-break: break-all;">🔗 ลิงก์เอกสารต้นฉบับ: ${c.url}</a></div>` : ''}
                    ${c.verificationStatus === 'verified_direct_content' ? `
                      <div style="margin-top: 0.35rem;">
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: bold; background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid #059669;">🟢 ตรวจเทียบเนื้อหาตรงต้นฉบับแล้ว (Direct Content Verified)</span>
                        ${c.evidencePin ? `<div style="font-size: 0.78rem; color: #E2E8F0; margin-top: 0.25rem; line-height: 1.4;"><strong>หลักฐานอ้างอิง:</strong> ${c.evidencePin}</div>` : ''}
                        ${c.pendingClaims ? `<div style="font-size: 0.75rem; color: #FBBF24; margin-top: 0.2rem; background: rgba(245, 158, 11, 0.1); padding: 3px 6px; border-radius: 3px; border-left: 2px solid #F59E0B;">⚠️ <em>ข้อสังเกต:</em> ${c.pendingClaims}</div>` : ''}
                      </div>
                    ` : c.verificationStatus === 'pending_content_verification' ? `
                      <div style="margin-top: 0.35rem;">
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: bold; background: rgba(245, 158, 11, 0.15); color: #FBBF24; border: 1px solid #D97706;">🟡 รอดำเนินการเทียบหน้า/ตารางต้นฉบับ (Pending Content Inspection)</span>
                        <div style="font-size: 0.78rem; color: #94A3B8; margin-top: 0.25rem; line-height: 1.4;"><strong>เหตุผล:</strong> ${c.pendingReason || 'ลิงก์รายการหนังสือทางวิชาการ — รอการตรวจเทียบเลขหน้าและตารางต้นฉบับทางกายภาพ'}</div>
                      </div>
                    ` : `
                      <div class="phenomena-citation-note">${c.note ? `หมายเหตุ: ${c.note}` : ''}</div>
                    `}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 7. Engineering & Safety Note -->
            ${p.engineeringNote ? `
              <div class="phenomena-note-box">
                <strong>💡 ข้อคิดและข้อควรระวังทางวิศวกรรม:</strong> ${p.engineeringNote}
              </div>
            ` : ''}
          </div>

          <!-- Right Column: Visual SVG Diagram, Realistic Photo & Navigation Actions -->
          <div class="phenomena-visual-column">
            ${pImagePath ? `
              <div class="phenomena-photo-frame">
                <div class="phenomena-photo-wrapper" style="position: relative; overflow: hidden; border-radius: 6px;">
                  <img src="${pImagePath}" alt="${escapeHtml(pTitleEn)}" class="phenomena-photo-img" loading="lazy"
                    data-full-src="${pImagePath}"
                    data-full-title="${escapeHtml(pTitleTh + ' — ' + pTitleEn)}"
                    data-full-caption="${escapeHtml(`
                      <div style="margin-bottom: 0.75rem;">
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; background: rgba(56, 189, 248, 0.15); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4); margin-bottom: 0.4rem;">
                          ${pDiv} &bull; ${pCat}
                        </span>
                        <h4 style="color: #F8FAFC; font-size: 1.05rem; margin: 0 0 0.4rem 0;">${pTitleTh}</h4>
                        <div style="color: #94A3B8; font-size: 0.85rem; font-style: italic; margin-bottom: 0.6rem;">${pTitleEn}</div>
                      </div>
                      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 6px; padding: 0.75rem; margin-bottom: 0.75rem;">
                        <strong style="color: #38BDF8;">📷 คำอธิบายภาพกายภาพจริง:</strong>
                        <p style="margin: 0.35rem 0 0 0; color: #E2E8F0; line-height: 1.55;">${pImageCaption}</p>
                      </div>
                      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 6px; padding: 0.75rem;">
                        <strong style="color: #10B981;">⚙️ กลไกและแรงที่กระทำตามหลักฟิสิกส์:</strong>
                        <p style="margin: 0.35rem 0 0 0; color: #CBD5E1; line-height: 1.55;">${(pMechanism || '').split('\n\n')[0]}</p>
                      </div>
                    `)}"
                  />
                  <button type="button" class="phenomena-photo-btn-full"
                    data-full-src="${pImagePath}"
                    data-full-title="${escapeHtml(pTitleTh + ' — ' + pTitleEn)}"
                    data-full-caption="${escapeHtml(`
                      <div style="margin-bottom: 0.75rem;">
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; background: rgba(56, 189, 248, 0.15); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4); margin-bottom: 0.4rem;">
                          ${pDiv} &bull; ${pCat}
                        </span>
                        <h4 style="color: #F8FAFC; font-size: 1.05rem; margin: 0 0 0.4rem 0;">${pTitleTh}</h4>
                        <div style="color: #94A3B8; font-size: 0.85rem; font-style: italic; margin-bottom: 0.6rem;">${pTitleEn}</div>
                      </div>
                      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 6px; padding: 0.75rem; margin-bottom: 0.75rem;">
                        <strong style="color: #38BDF8;">📷 คำอธิบายภาพกายภาพจริง:</strong>
                        <p style="margin: 0.35rem 0 0 0; color: #E2E8F0; line-height: 1.55;">${pImageCaption}</p>
                      </div>
                      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #334155; border-radius: 6px; padding: 0.75rem;">
                        <strong style="color: #10B981;">⚙️ กลไกและแรงที่กระทำตามหลักฟิสิกส์:</strong>
                        <p style="margin: 0.35rem 0 0 0; color: #CBD5E1; line-height: 1.55;">${(pMechanism || '').split('\n\n')[0]}</p>
                      </div>
                    `)}"
                    title="คลิกเพื่อดูภาพขนาดเต็มพร้อมคำอธิบายกายภาพ">
                    🔍 ดูภาพเต็ม
                  </button>
                </div>
                ${pImageCaption ? `<div class="phenomena-photo-caption">📷 <strong>ภาพกายภาพจริง:</strong> ${pImageCaption}</div>` : ''}
              </div>
            ` : ''}
            <div class="phenomena-diagram-frame">
              ${pSvgDiagram}
            </div>

            <div class="phenomena-actions-group">
              ${p.relatedTheoryId ? `
                <button class="phenomena-action-btn phenomena-btn-theory btn-jump-theory" data-theory-id="${p.relatedTheoryId}" title="ไปยังเนื้อหา ${p.relatedTheoryTitle}">
                  📖 อ่านทฤษฎี: ${(p.relatedTheoryTitle || '').split(':')[0]}
                </button>
              ` : (p.theoryStatus === 'in_development' ? `
                <div style="font-size: 0.72rem; color: #94a3b8; padding: 0.45rem 0.6rem; background: rgba(30, 41, 59, 0.7); border-radius: var(--radius-sm); border: 1px dashed rgba(56, 189, 248, 0.35); line-height: 1.4;">
                  📚 <strong>ภาคทฤษฎีเฉพาะทาง:</strong> ทัศนศาสตร์ &amp; ควอนตัม อยู่ระหว่างการจัดเตรียมหลักสูตรฉบับสมบูรณ์ &mdash; ศึกษาทฤษฎีและสมการอย่างละเอียดได้ในการ์ดนี้
                </div>
              ` : '')}

              ${p.relatedSimulator ? `
                <button class="phenomena-action-btn phenomena-btn-sim btn-jump-sim" data-sim-mode="${p.relatedSimulator}" ${p.relatedSimSubmode ? `data-submode="${p.relatedSimSubmode}"` : ''} title="เปิดแบบจำลองเสมือนจริง ${simLabel}">
                  🎯 เปิดแบบจำลอง: ${simLabel}
                </button>
              ` : `
                <div style="text-align: center; font-size: 0.75rem; color: #64748B; padding: 0.4rem; background: var(--bg-alt); border-radius: var(--radius-sm); border: 1px dashed var(--border-dark);">
                  📐 แผนภาพเวกเตอร์และการคำนวณสถิตยศาสตร์
                </div>
              `}
            </div>
          </div>
        </article>
      `;
    });

    html += `
        <div id="phenomena-no-results" class="phenomena-empty-state" style="display: none;">
          <h3>ไม่พบปรากฏการณ์ที่ตรงกับคำค้นหา</h3>
          <p>กรุณาลองเปลี่ยนคำค้นหา หรือคลิกเลือก "ทั้งหมด" เพื่อดูรายการปรากฏการณ์ทั้งหมด ${allPhenomena.length} รายการ</p>
        </div>
      </div>
    `;

    html += renderTabStepNavBar(4, { view: 'view-simulator', label: '← ย้อนกลับ: 🎯 3. แบบจำลอง' }, { view: 'view-summary', label: 'ขั้นต่อไป: 📋 5. สรุปบทเรียน →' });

    container.innerHTML = html;

    // Attach Event Listeners
    setupPhenomenaInteractions();

    // Initial Filter Apply
    filterPhenomenaCards();

    // KaTeX Typesetting
    if (window.MathRenderer) {
      window.MathRenderer.typeset(container);
    }
  }

  function setupPhenomenaInteractions() {
    const filterBtns = document.querySelectorAll('.phenomena-filter-btn');
    const searchInput = document.getElementById('phenomena-search-input');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activePhenomenaFilter = btn.dataset.filter;
        filterPhenomenaCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        activePhenomenaSearch = e.target.value.trim().toLowerCase();
        filterPhenomenaCards();
      });
    }

    // Theory jump buttons
    document.querySelectorAll('.btn-jump-theory').forEach(btn => {
      btn.addEventListener('click', () => {
        const theoryId = btn.dataset.theoryId;
        activeDivisionFilter = 'all';
        renderTheoryContent();
        switchView('view-theory');
        setTimeout(() => {
          const targetEl = document.getElementById(theoryId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetEl.style.transition = 'box-shadow 0.5s ease';
            targetEl.style.boxShadow = '0 0 0 3px #38BDF8';
            setTimeout(() => { targetEl.style.boxShadow = ''; }, 2000);
          }
        }, 120);
      });
    });

    // Simulator jump buttons
    document.querySelectorAll('.btn-jump-sim').forEach(btn => {
      btn.addEventListener('click', () => {
        const simMode = btn.dataset.simMode;
        const subMode = btn.dataset.submode;
        let chap = 'ch01';
        if (simMode === 'circular') chap = 'ch02';
        else if (simMode === 'oscillation') chap = 'ch03';
        else if (simMode === 'wave') chap = 'ch04';
        else if (simMode === 'thermo') chap = 'ch05';
        else if (simMode === 'em') chap = 'ch06';
        else if (simMode === 'nuclear') chap = 'ch07';
        else if (simMode === 'civil') chap = 'civil_eng';

        if (typeof openChapter === 'function') openChapter(chap);
        switchView('view-simulator');
        switchSimMode(simMode, subMode);
      });
    });

    // Lightbox modal handlers for phenomena photos
    const lightboxModal = document.getElementById('photo-lightbox-modal');
    const lightboxHeading = document.getElementById('photo-lightbox-heading');
    const lightboxImg = document.getElementById('photo-lightbox-img');
    const lightboxCaption = document.getElementById('photo-lightbox-caption');
    const btnCloseLightbox = document.getElementById('btn-close-photo-lightbox');

    function openLightbox(src, title, captionHtml) {
      if (!lightboxModal) return;
      if (lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = title || 'ภาพถ่ายปรากฏการณ์';
      }
      if (lightboxHeading) {
        lightboxHeading.textContent = title || 'ภาพกายภาพจริงและรายละเอียดปรากฏการณ์';
      }
      if (lightboxCaption) {
        lightboxCaption.innerHTML = captionHtml || '';
        if (window.MathRenderer) {
          window.MathRenderer.typeset(lightboxCaption);
        }
      }
      lightboxModal.classList.add('active');
      lightboxModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightboxModal) return;
      lightboxModal.classList.remove('active');
      lightboxModal.style.display = 'none';
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    }

    if (btnCloseLightbox) {
      btnCloseLightbox.onclick = closeLightbox;
    }
    if (lightboxModal) {
      lightboxModal.onclick = (e) => {
        if (e.target === lightboxModal) closeLightbox();
      };
    }

    // Attach click listener to all photo images and "ดูภาพเต็ม" buttons
    document.querySelectorAll('.phenomena-photo-img, .phenomena-photo-btn-full').forEach(target => {
      target.addEventListener('click', (e) => {
        e.stopPropagation();
        const src = target.dataset.fullSrc || target.getAttribute('src');
        const title = target.dataset.fullTitle || '';
        const caption = target.dataset.fullCaption || '';
        openLightbox(src, title, caption);
      });
    });

    // Handle ESC key to close modal
    if (!window._lightboxEscAttached) {
      window._lightboxEscAttached = true;
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
  }

  function filterPhenomenaCards() {
    const cards = document.querySelectorAll('.phenomena-card');
    const noResults = document.getElementById('phenomena-no-results');
    const countDisplay = document.getElementById('phenomena-count-display');
    let visibleCount = 0;

    cards.forEach(card => {
      const cardDivs = (card.dataset.divisions || card.dataset.division || '').split(/\s+/);
      const divMatch = activePhenomenaFilter === 'all' || cardDivs.includes(activePhenomenaFilter);
      const kw = card.dataset.keywords || '';
      const searchMatch = !activePhenomenaSearch || kw.includes(activePhenomenaSearch);

      if (divMatch && searchMatch) {
        card.style.display = 'grid';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (countDisplay) {
      countDisplay.textContent = `แสดง ${visibleCount} / ${cards.length} รายการ`;
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
      <!-- Analytical Return & Explanatory Navigation Header -->
      <div class="analytical-return-header">
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <button id="btn-analytical-back-lesson" class="btn-analytical-back-primary" aria-label="ย้อนกลับไปหน้าบทเรียน">
            ← ย้อนกลับไปหน้าบทเรียน (Back to Lesson)
          </button>
          <button id="btn-analytical-back-chapter" class="btn-analytical-back-secondary" aria-label="กลับไปหน้าเลือกบท">
            📚 กลับไปหน้าเลือกบท (Chapter Selection)
          </button>
        </div>
        <div class="analytical-badge-group">
          <span class="badge-analytical-tag">📐 คณิตศาสตร์สำหรับฟิสิกส์ &amp; กลศาสตร์วิเคราะห์ (${afData.topics.length} Master Topics)</span>
        </div>
      </div>

      <div class="content-header">
        <h2 class="content-title">${afData.meta.titleTh}</h2>
        <p class="content-subtitle">${afData.meta.subtitleTh} &mdash; ${afData.meta.description}</p>
      </div>

      <!-- Topic Category Filter Tabs -->
      <div class="math-filter-bar" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-right: 0.25rem;">หมวดหมู่:</span>
        <button class="math-filter-btn active" data-filter="all" style="padding: 0.4rem 0.85rem; border-radius: 999px; border: 1px solid var(--border-dark); background: var(--accent-blue); color: #fff; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
          📌 ทั้งหมด (${afData.topics.length} หัวข้อ)
        </button>
        <button class="math-filter-btn" data-filter="vector" style="padding: 0.4rem 0.85rem; border-radius: 999px; border: 1px solid var(--border-dark); background: var(--bg-card); color: var(--text-secondary); font-size: 0.82rem; font-weight: 600; cursor: pointer;">
          📐 เวกเตอร์แคลคูลัส &amp; ทฤษฎีบทปริพันธ์
        </button>
        <button class="math-filter-btn" data-filter="analytical" style="padding: 0.4rem 0.85rem; border-radius: 999px; border: 1px solid var(--border-dark); background: var(--bg-card); color: var(--text-secondary); font-size: 0.82rem; font-weight: 600; cursor: pointer;">
          🏛️ กลศาสตร์วิเคราะห์ &amp; กรุปของลี
        </button>
        <button class="math-filter-btn" data-filter="pde" style="padding: 0.4rem 0.85rem; border-radius: 999px; border: 1px solid var(--border-dark); background: var(--bg-card); color: var(--text-secondary); font-size: 0.82rem; font-weight: 600; cursor: pointer;">
          🌊 สมการอนุพันธ์ย่อย &amp; ฟังก์ชันกรีน
        </button>
        <button class="math-filter-btn" data-filter="tensor" style="padding: 0.4rem 0.85rem; border-radius: 999px; border: 1px solid var(--border-dark); background: var(--bg-card); color: var(--text-secondary); font-size: 0.82rem; font-weight: 600; cursor: pointer;">
          📊 เทนเซอร์ &amp; รูปแบบเชิงอนุพันธ์
        </button>
        <button class="math-filter-btn" data-filter="quantum_math" style="padding: 0.4rem 0.85rem; border-radius: 999px; border: 1px solid var(--border-dark); background: var(--bg-card); color: var(--text-secondary); font-size: 0.82rem; font-weight: 600; cursor: pointer;">
          🔮 การวิเคราะห์เชิงซ้อน &amp; ปริพันธ์ตามวิถี
        </button>
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

      <!-- 15 Deep Analytical Formalisms & Mathematical Physics Topics -->
      <div class="analytical-topics-container">
        ${afData.topics.map(topic => {
          const category = topic.category || (
            ['AF-06', 'AF-09', 'AF-10', 'AF-11'].includes(topic.id) ? 'vector' :
            ['AF-07', 'AF-12', 'AF-13'].includes(topic.id) ? 'pde' :
            ['AF-14', 'AF-15'].includes(topic.id) ? 'tensor' : 'analytical'
          );
          return `
          <article class="analytical-topic-card" id="topic-${topic.id}" data-category="${category}">
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
        `;
        }).join('')}
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

    // Attach Return & Navigation Button Listeners
    const btnBackLesson = container.querySelector('#btn-analytical-back-lesson');
    if (btnBackLesson) {
      btnBackLesson.addEventListener('click', () => {
        switchView(lastLessonView || 'view-theory');
      });
    }

    const btnBackChapter = container.querySelector('#btn-analytical-back-chapter');
    if (btnBackChapter) {
      btnBackChapter.addEventListener('click', () => {
        switchView('view-chapter-select');
      });
    }

    // Category Filtering for 15 Topics
    container.querySelectorAll('.math-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.math-filter-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = 'var(--bg-card)';
          b.style.color = 'var(--text-secondary)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--accent-blue)';
        btn.style.color = '#fff';

        const filter = btn.dataset.filter;
        container.querySelectorAll('.analytical-topic-card').forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

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

  function setupTextbookLibraryModal() {
    const modal = document.getElementById('textbook-reader-modal');
    const closeBtn = document.getElementById('tb-reader-close');
    if (!modal) return;

    function closeReader() {
      if (window.TextbookLibrary && typeof window.TextbookLibrary.closeTextbookReader === 'function') {
        window.TextbookLibrary.closeTextbookReader();
      } else {
        const frame = document.getElementById('textbook-pdf-frame');
        if (frame) frame.src = 'about:blank';
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeReader);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeReader();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeReader();
      }
    });
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

  // ======================================================================
  // SIMULATOR EDUCATIONAL CONTEXT RENDERER (PHYSICS-NAVIGATION-001 REQ 2)
  // ======================================================================

  function renderSimulatorEduContext(mode) {
    const frame = document.getElementById('sim-edu-context-frame');
    if (!frame) return;

    let title = '';
    let badge = '';
    let equationsLatex = [];
    let varsRows = [];
    let boundsText = '';
    let controlMapText = '';

    if (mode === 'projectile') {
      title = 'โหมดที่ 1: วิถีโปรเจกไทล์ & แรงต้านอากาศกำลังสอง (4th-Order Runge-Kutta)';
      badge = 'RK4 Numerical Engine';
      equationsLatex = [
        'm\\frac{d^2\\vec{r}}{dt^2} = m\\vec{g} - c|\\vec{v}|\\vec{v}',
        '\\frac{dv_x}{dt} = -\\frac{c}{m}v\\cdot v_x,\\quad \\frac{dv_y}{dt} = -g -\\frac{c}{m}v\\cdot v_y'
      ];
      varsRows = [
        { sym: 'v_0', name: 'ความเร็วต้น', unit: '\\text{m/s}' },
        { sym: '\\theta', name: 'มุมยิงเทียบแนวระดับ', unit: '^\\circ\\text{ (deg)}' },
        { sym: 'c', name: 'สัมประสิทธิ์แรงต้าน \\frac{1}{2}\\rho C_D A', unit: '\\text{kg/m}' },
        { sym: 'm', name: 'มวลวัตถุ', unit: '\\text{kg}' },
        { sym: 'g', name: 'ความเร่งโน้มถ่วง', unit: '\\text{m/s}^2' },
        { sym: 'y_0', name: 'ความสูงฐานยิงเริ่มต้น', unit: '\\text{m}' }
      ];
      boundsText = 'จำลองอนุภาค 2 มิติในแนวดิ่ง-ราบภายใต้สนามโน้มถ่วงสม่ำเสมอ แรงต้านอากาศแปรผันตามอัตราเร็วกำลังสอง ($v^2$) ทิศทางต้านเวกเตอร์ความเร็วเสมอ สิ้นสุดการจำลองเมื่อวัตถุตกลงสู่ระดับพื้นดิน ($y \\le 0$)';
      controlMapText = '• ลากปลายลูกศรเวกเตอร์บนกระดานเพื่อปรับมุม ($\\theta$) และความเร็ว ($v_0$) แบบเรียลไทม์<br>• ปรับสไลเดอร์ $c$ เพื่อดูผลกระทบของความหนืดอากาศต่อระยะตกเทียบกับวิถีสุญญากาศของกาลิเลโอ (เส้นประสีเทา)';
    } else if (mode === 'vehicle') {
      title = 'โหมดที่ 2: รถแข่ง จลนศาสตร์ 2 มิติ & สนามเวกเตอร์ลมพัดขวาง';
      badge = 'Kinematics & Vector Field';
      equationsLatex = [
        '\\vec{v}_{\\text{eff}} = \\vec{v}_{\\text{car}} - \\vec{v}_{\\text{wind}}',
        '\\vec{F}_{\\text{net}} = \\vec{F}_{\\text{engine}} - c_{\\text{aero}}|\\vec{v}_{\\text{eff}}|\\vec{v}_{\\text{eff}}'
      ];
      varsRows = [
        { sym: 'v_{\\text{car}}', name: 'ความเร็วรถแข่ง', unit: '\\text{m/s หรือ km/h}' },
        { sym: 'v_{\\text{wind}}', name: 'อัตราเร็วลม', unit: '\\text{m/s}' },
        { sym: '\\phi_{\\text{wind}}', name: 'ทิศทางเวกเตอร์ลม', unit: '^\\circ\\text{ (deg)}' },
        { sym: 'c_{\\text{aero}}', name: 'สัมประสิทธิ์ต้านแอโรไดนามิก', unit: '\\text{kg/m}' }
      ];
      boundsText = 'การเคลื่อนที่ 2 มิติบนระนาบราบ สมมติฐานพื้นผิวราบเรียบ สัมประสิทธิ์การยึดเกาะยางสม่ำเสมอ เวกเตอร์ความเร็วลมสม่ำเสมอทั่วบริเวณการแข่งขัน';
      controlMapText = '• สไลเดอร์ความเร็วรถและทิศทางลมจะปรับเวกเตอร์ความเร็วประสาน (Resultant Velocity) ทันที<br>• สังเกตการเบี่ยงเบนของเวกเตอร์แรงต้านสัมพัทธ์ในกริดสนามเวกเตอร์';
    } else if (mode === 'collision') {
      title = 'โหมดที่ 3: การชน โมเมนตัม & การดล (Impulse & Momentum Conservation)';
      badge = 'Impulse & Conservation';
      equationsLatex = [
        'm_1\\vec{u}_1 + m_2\\vec{u}_2 = m_1\\vec{v}_1 + m_2\\vec{v}_2',
        'e = \\frac{v_2 - v_1}{u_1 - u_2},\\quad \\vec{J} = \\int \\vec{F}\\,dt = \\Delta\\vec{p}'
      ];
      varsRows = [
        { sym: 'm_1, m_2', name: 'มวลของวัตถุที่ 1 และ 2', unit: '\\text{kg}' },
        { sym: 'u_1, u_2', name: 'ความเร็วก่อนชน', unit: '\\text{m/s}' },
        { sym: 'v_1, v_2', name: 'ความเร็วหลังชน', unit: '\\text{m/s}' },
        { sym: 'e', name: 'สัมประสิทธิ์การคืนสภาพ (COR)', unit: '—' }
      ];
      boundsText = 'ระบบโดดเดี่ยว (Isolated System) ปราศจากแรงลัพธ์ภายนอกในแนวราบ การชนเป็นเส้นตรง 1 มิติตามแนวเชื่อมศูนย์กลางมวล อนุรักษ์โมเมนตัมเสมอ พลังงานจลน์อนุรักษ์เฉพาะเมื่อ $e = 1$';
      controlMapText = '• ปรับมวลและความเร็วเริ่มต้นของลูกทรงกลมทั้งสอง<br>• ปรับค่า $e$ จาก $1.0$ (ยืดหยุ่นสมบูรณ์) ไปยัง $0.0$ (ไม่ยืดหยุ่นสมบูรณ์ วัตถุติดกันไป) เพื่อตรวจสอบการสูญเสียพลังงานจลน์';
    } else if (mode === 'threejs') {
      title = 'โหมดที่ 4: วิถีโปรเจกไทล์ 3 มิติ & ลมพัดขวาง (WebGL 3D Engine)';
      badge = '3D Spatial Ballistics';
      equationsLatex = [
        '\\ddot{x} = -\\frac{c}{m}v(v_x - w_x),\\quad \\ddot{y} = -g -\\frac{c}{m}v\\,v_y,\\quad \\ddot{z} = -\\frac{c}{m}v(v_z - w_z)'
      ];
      varsRows = [
        { sym: 'v_0', name: 'ความเร็วต้นใน 3 มิติ', unit: '\\text{m/s}' },
        { sym: '\\theta', name: 'มุมเงย (Elevation)', unit: '^\\circ\\text{ (deg)}' },
        { sym: '\\psi', name: 'มุมกวาดราบ (Azimuth)', unit: '^\\circ\\text{ (deg)}' },
        { sym: '\\vec{w}', name: 'เวกเตอร์ลมพัดขวาง (w_x, w_z)', unit: '\\text{m/s}' }
      ];
      boundsText = 'ปริภูมิยุคลิด 3 มิติ (x, y, z) แรงต้านอากาศแปรผันตามกำลังสองของความเร็วสัมพัทธ์ 3 มิติ มีการเบี่ยงเบนแนวข้าง (Drift) จากลมพัดขวาง';
      controlMapText = '• ใช้เมาส์/ทัชคลิกลากหมุนมุมมอง 3 มิติรอบวิถีการยิง<br>• ปรับมุมกวาดและแรงลมขวางเพื่อดูการเลี้ยวโค้งของวิถีในระนาบ 3 มิติ';
    } else if (mode === 'circular') {
      title = 'โหมดที่ 5: แบบจำลองพลศาสตร์การเคลื่อนที่แบบวงกลม ทางโค้งเอียง และลูปแนวดิ่ง (Centripetal Dynamics)';
      badge = 'AASHTO & Orbital Mechanics Engine';
      equationsLatex = [
        'a_c = \\frac{v^2}{r} = \\omega^2 r,\\quad \\Sigma F_r = m a_c = \\frac{m v^2}{r}',
        '\\tan\\theta = \\frac{v_{\\text{design}}^2}{g r},\\quad v_{\\text{max}} = \\sqrt{g r \\frac{\\tan\\theta + \\mu_s}{1 - \\mu_s\\tan\\theta}}',
        'N_{\\text{top}} = m\\left(\\frac{v_{\\text{top}}^2}{r} - g\\right) \\ge 0 \\implies v_{\\text{top}} \\ge \\sqrt{g r}'
      ];
      varsRows = [
        { sym: 'v', name: 'อัตราเร็วเชิงเส้น (Linear Speed)', unit: '\\text{m/s}' },
        { sym: 'r', name: 'รัศมีความโค้ง (Radius of Curvature)', unit: '\\text{m}' },
        { sym: '\\omega', name: 'อัตราเร็วเชิงมุม (Angular Velocity)', unit: '\\text{rad/s}' },
        { sym: 'a_c', name: 'ความเร่งสู่ศูนย์กลาง (Centripetal Accel)', unit: '\\text{m/s}^2' },
        { sym: '\\Sigma F_r', name: 'แรงลัพธ์สู่ศูนย์กลาง (Net Centripetal Force)', unit: '\\text{N}' },
        { sym: '\\theta', name: 'มุมยกเอียงทางโค้ง (Bank Angle)', unit: '^\\circ\\text{ (deg)}' },
        { sym: '\\mu_s', name: 'สัมประสิทธิ์แรงเสียดทานสถิต (Static Friction)', unit: '—' }
      ];
      boundsText = 'ครอบคลุม 3 สภาพแวดล้อม: (1) ทางโค้งราบและทางโค้งยกมุมเอียงมาตรฐาน AASHTO ปลอดการไถล (2) ลูปแนวดิ่งแบบวงกลมแท้เทียบกับคลอธอยด์รูปหยดน้ำ (3) วงโคจรดาวเทียมเคปเลอร์ (LEO และ GEO)';
      controlMapText = '• สลับ 3 โหมดย่อย (Banked Turn / Vertical Loop / Keplerian Orbit)<br>• ปรับสไลเดอร์ความเร็ว v, รัศมี r, มุมยก bank, และแรงเสียดทาน เพื่อดูเวกเตอร์แรง N, mg, fs และขีดจำกัดความเร็วหลุดโค้ง';
    } else if (mode === 'oscillation') {
      title = 'โหมดที่ 5 (บทที่ 3): การแกว่งกวัด ฮาร์มอนิกอย่างง่าย ลูกตุ้ม และการสั่นพ้อง';
      badge = 'Harmonic Dynamics & Resonance';
      equationsLatex = [
        'm\\frac{d^2x}{dt^2} + b\\frac{dx}{dt} + kx = F_0\\cos(\\omega t)',
        '\\omega_0 = \\sqrt{\\frac{k}{m}},\\quad T_0 = 2\\pi\\sqrt{\\frac{m}{k}},\\quad A(\\omega) = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (\\gamma\\omega)^2}}',
        '\\frac{d^2\\theta}{dt^2} + \\frac{g}{L}\\sin\\theta = 0\\quad\\xrightarrow{\\theta \\ll 1}\\quad T \\approx 2\\pi\\sqrt{\\frac{L}{g}}\\left(1 + \\frac{1}{16}\\theta_0^2\\right)'
      ];
      varsRows = [
        { sym: 'x', name: 'การกระจัดจากสมดุล', unit: '\\text{m}' },
        { sym: 'A', name: 'แอมพลิจูดสูงสุด', unit: '\\text{m}' },
        { sym: 'k', name: 'ค่านิจสปริง (Stiffness)', unit: '\\text{N/m}' },
        { sym: 'm', name: 'มวลของวัตถุแกว่งกวัด', unit: '\\text{kg}' },
        { sym: 'L', name: 'ความยาวเชือกลูกตุ้ม', unit: '\\text{m}' },
        { sym: 'b', name: 'สัมประสิทธิ์ความหน่วงหนืด', unit: '\\text{N}\\cdot\\text{s/m}' },
        { sym: '\\omega_0', name: 'ความถี่เชิงมุมธรรมชาติ', unit: '\\text{rad/s}' },
        { sym: 'Q', name: 'ค่าประกอบคุณภาพ (Quality Factor)', unit: '—' }
      ];
      boundsText = 'จำลอง 3 ระบบหลัก: (1) มวลติดสปริงในแนวราบ/ดิ่ง พร้อมการอนุรักษ์พลังงานกล E = K + U และวงโคจรพรีคอนดิชันใน Phase Space (2) ลูกตุ้มนาฬิกาอย่างง่าย เปรียบเทียบมุมเล็กเชิงเส้นกับผลเฉลยจริงเชิงตัวเลข RK4 (3) การสั่นหน่วง 3 สภาวะ (Underdamped, Critical, Overdamped) และการสั่นพ้องเรโซแนนซ์';
      controlMapText = '• สลับ 3 โหมดย่อย (มวลติดสปริง / ลูกตุ้มอย่างง่าย / การสั่นหน่วงและเรโซแนนซ์)<br>• ปรับค่ามวล m, สปริง k, ความยาวลูกตุ้ม L, ความหน่วง b และความถี่เร้า ω เพื่อสังเกตจุดยอดเรโซแนนซ์บนเส้นโค้ง A(ω) และแผนภาพเฟสสเปซ';
    } else if (mode === 'wave') {
      title = 'โหมดที่ 6 (บทที่ 4): คลื่นกล เสียง และทัศนศาสตร์เชิงเรขาคณิต';
      badge = 'Waves, Acoustics & Optics Engine';
      equationsLatex = [
        '\\frac{\\partial^2 y}{\\partial x^2} = \\frac{1}{v^2}\\frac{\\partial^2 y}{\\partial t^2},\\quad v = \\sqrt{\\frac{T_s}{\\mu}} = f\\lambda,\\quad y(x,t) = 2A\\sin(kx)\\cos(\\omega t)',
        'n_1\\sin\\theta_1 = n_2\\sin\\theta_2,\\quad \\frac{1}{f} = \\frac{1}{s} + \\frac{1}{s\'},\\quad \\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)',
        'I = I_0\\cos^2\\theta,\\quad f_{\\text{beat}} = |f_1 - f_2|,\\quad f\' = f\\left(\\frac{v \\pm v_O}{v \\mp v_S}\\right)'
      ];
      varsRows = [
        { sym: 'y(x,t)', name: 'การกระจัดของอนุภาคตัวกลาง', unit: '\\text{m}' },
        { sym: 'A', name: 'แอมพลิจูดคลื่น', unit: '\\text{m}' },
        { sym: '\\lambda', name: 'ความยาวคลื่น', unit: '\\text{m}' },
        { sym: 'v', name: 'อัตราเร็วเฟสของคลื่น', unit: '\\text{m/s}' },
        { sym: 'T_s', name: 'แรงตึงในเส้นเชือก', unit: '\\text{N}' },
        { sym: '\\mu', name: 'ความหนาแน่นมวลเชิงเส้น', unit: '\\text{kg/m}' },
        { sym: 'f', name: 'ความถี่คลื่น', unit: '\\text{Hz}' },
        { sym: 'n', name: 'ดัชนีหักเหของตัวกลางโปร่งใส', unit: '—' },
        { sym: 's, s\'', name: 'ระยะวัตถุ และระยะภาพ', unit: '\\text{cm}' },
        { sym: 'f_{\\text{lens}}', name: 'ความยาวโฟกัสของเลนส์หรือกระจกเงา', unit: '\\text{cm}' },
        { sym: 'I(\\theta)', name: 'ความเข้มแสงหลังผ่านแผ่นโพลาไรเซอร์ (กฎมาลุส)', unit: '\\text{W/m}^2' }
      ];
      boundsText = 'ครอบคลุม 6 ระบบหลักของคลื่นและทัศนศาสตร์: (1) คลื่นเคลื่อนที่ตามขวางบนเส้นเชือก (2) คลื่นนิ่งและฮาร์มอนิก n=1..6 ในเส้นเชือกปลายตรึง (3) การแทรกสอดเกิดบีตส์พร้อมเสียง Web Audio (4) คลื่นผิวน้ำและการเคลื่อนที่แบบวงรี (5) คลื่นแสง สเปกตรัม การสะท้อน-หักเห และการรวมภาพของเลนส์บาง/กระจกโค้ง (6) โพลาไรเซชันของคลื่นแสงตามกฎของมาลุส I = I0 cos²(θ)';
      controlMapText = '• สลับ 6 โหมดย่อย (คลื่นเคลื่อนที่ / คลื่นนิ่ง / บีตส์ / คลื่นผิวน้ำ / คลื่นแสง & สเปกตรัม / โพลาไรเซชัน)<br>• ปรับค่าความตึง Ts, ความถี่ f, ดัชนีหักเห n, มุมโพลาไรเซอร์ θ และความยาวโฟกัส เพื่อสังเกตการหักเห การแทรกสอด และความเข้มแสง';
    } else if (mode === 'thermo') {
      title = 'โหมดที่ 7 (บทที่ 5): อุณหพลศาสตร์ วัฏจักรความร้อน และทฤษฎีจลน์ของแก๊ส';
      badge = 'Thermodynamics & Kinetic Theory';
      equationsLatex = [
        '\\Delta U = Q - W,\\quad W = \\int P dV,\\quad P V^\\gamma = \\text{const}',
        '\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H},\\quad v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}},\\quad dS = \\frac{dQ_{\\text{rev}}}{T}'
      ];
      varsRows = [
        { sym: 'P', name: 'ความดันสัมบูรณ์ของแก๊ส', unit: '\\text{kPa}' },
        { sym: 'V', name: 'ปริมาตรของกระบอกสูบ', unit: '\\text{L}' },
        { sym: 'T_H', name: 'อุณหภูมิแหล่งความร้อนสูง', unit: '\\text{K}' },
        { sym: 'T_C', name: 'อุณหภูมิแหล่งความร้อนต่ำ', unit: '\\text{K}' },
        { sym: '\\eta', name: 'ประสิทธิภาพเชิงความร้อน', unit: '\\text{\\%}' },
        { sym: 'W_{\\text{net}}', name: 'งานกลสุทธิต่อรอบวัฏจักร', unit: '\\text{J}' },
        { sym: 'v_{\\text{rms}}', name: 'อัตราเร็วรากกำลังสองเฉลี่ย', unit: '\\text{m/s}' },
        { sym: 'k', name: 'สภาพนำความร้อนของวัสดุ', unit: '\\text{W/(m}\\cdot\\text{K)}' }
      ];
      boundsText = 'ครอบคลุม 3 แกนหลักของอุณหพลศาสตร์: (1) วัฏจักรเครื่องยนต์ความร้อน (Carnot & Otto cycles) พร้อมการเคลื่อนที่ของลูกสูบจริง การให้ความร้อน Q_H และพื้นที่งานสุทธิ W_net = ∮PdV (2) กล่องอนุภาคแก๊สจลน์ 2D และฮิสโตแกรมการแจกแจงอัตราเร็วแมกซ์เวลล์-โบลต์ซมันน์เปรียบเทียบกับเส้นโค้งทฤษฎี (3) การนำความร้อนแบบทรานเชียนต์ 1 มิติตามกฎของฟูริเยร์';
      controlMapText = '• สลับ 3 โหมดย่อย (วัฏจักรเครื่องยนต์ P-V / กล่องแก๊สจลน์ / การนำความร้อน 1 มิติ)<br>• ปรับค่าอุณหภูมิ TH, TC, ชนิดแก๊ส และวัสดุแท่งนำความร้อน เพื่อสังเกตประสิทธิภาพ ความดัน และเกรเดียนต์อุณหภูมิ';
    } else if (mode === 'em') {
      title = 'โหมดที่ 8 (บทที่ 6): แบบจำลองสนามไฟฟ้า แรงลอเรนซ์ และวงจรไฟฟ้ากระแสตรง RC';
      badge = 'Electromagnetism & Circuits';
      equationsLatex = [
        '\\vec{F}_E = \\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1 q_2}{r^2}\\hat{r},\\quad \\vec{F} = q(\\vec{E} + \\vec{v}\\times\\vec{B}),\\quad r_c = \\frac{mv}{qB}',
        'V_C(t) = \\mathcal{E}\\left(1 - e^{-t/RC}\\right),\\quad I(t) = \\frac{\\mathcal{E}}{R}e^{-t/RC},\\quad \\tau = RC,\\quad U_C = \\frac{1}{2}CV^2'
      ];
      varsRows = [
        { sym: 'q', name: 'ประจุไฟฟ้าของอนุภาค', unit: '\\text{C}' },
        { sym: '\\vec{E}', name: 'เวกเตอร์สนามไฟฟ้า', unit: '\\text{V/m}' },
        { sym: '\\vec{B}', name: 'เวกเตอร์สนามแม่เหล็ก', unit: '\\text{T}' },
        { sym: 'v', name: 'ความเร็วของอนุภาค', unit: '\\text{m/s}' },
        { sym: 'r_c', name: 'รัศมีความโค้งไซโคลตรอน', unit: '\\text{m}' },
        { sym: 'R', name: 'ความต้านทานไฟฟ้า', unit: '\\text{k}\\Omega' },
        { sym: 'C', name: 'ความจุไฟฟ้า', unit: '\\mu\\text{F}' },
        { sym: '\\tau', name: 'ค่าคงตัวเวลาของวงจร RC', unit: '\\text{s}' },
        { sym: 'V_C', name: 'ความต่างศักย์ตกคร่อมตัวเก็บประจุ', unit: '\\text{V}' },
        { sym: 'I', name: 'กระแสไฟฟ้าในวงจร', unit: '\\text{mA}' }
      ];
      boundsText = 'ครอบคลุม 3 แกนหลักของแม่เหล็กไฟฟ้า: (1) สนามไฟฟ้าและเส้นสมศักย์ 2 มิติจากระบบจุดประจุหลายตัว พร้อมการเคลื่อนที่ของประจุทดสอบตามกฎคูลอมบ์ (2) การเคลื่อนที่ของอนุภาคประจุภายใต้แรงลอเรนซ์ F = q(E + v x B) พร้อมการเลือกความเร็ว (Velocity Selector) และวงโคจรไซโคลตรอน (3) วงจรทรานเชียนต์ RC แสดงการไหลของอิเล็กตรอนจริง และกราฟออสซิลโลสโคปสดของแรงดัน V_C(t) และกระแส I(t)';
      controlMapText = '• สลับ 3 โหมดย่อย (สนามและเส้นสมศักย์ / แรงลอเรนซ์ & ไซโคลตรอน / วงจรทรานเชียนต์ RC)<br>• ปรับค่าสนาม B, สนาม E, ความเร็ว v, ตัวต้านทาน R, ตัวเก็บประจุ C และสถานะสวิตช์ เพื่อสังเกตรัศมีความโค้งและค่าคงตัวเวลา tau = RC';
    } else if (mode === 'nuclear') {
      title = 'โหมดที่ 9 (บทที่ 7): แบบจำลองฟิสิกส์นิวเคลียร์ พลังงานยึดเหนี่ยว และการสลายกัมมันตรังสี';
      badge = 'Nuclear & Modern Physics';
      equationsLatex = [
        'E_b = \\Delta m\\cdot c^2 = \\left[Z m_p + N m_n - M_{\\text{nuc}}\\right]c^2,\\quad N(t) = N_0 e^{-\\lambda t},\\quad T_{1/2} = \\frac{\\ln 2}{\\lambda}',
        'A(t) = \\lambda N(t),\\quad Q = (\\sum m_{\\text{in}} - \\sum m_{\\text{out}})c^2,\\quad H = D\\times w_R,\\quad I = I_0 e^{-\\mu x}'
      ];
      varsRows = [
        { sym: 'A', name: 'เลขมวล (จำนวนนิวคลีออนรวม)', unit: '—' },
        { sym: 'Z', name: 'เลขอะตอม (จำนวนโปรตอน)', unit: '—' },
        { sym: 'E_b/A', name: 'พลังงานยึดเหนี่ยวเฉลี่ยต่อนิวคลีออน', unit: '\\text{MeV/nucleon}' },
        { sym: '\\Delta m', name: 'มวลพร่องของนิวเคลียส', unit: '\\text{u}' },
        { sym: '\\lambda', name: 'ค่าคงตัวการสลายตัวของนิวเคลียส', unit: '\\text{s}^{-1}' },
        { sym: 'T_{1/2}', name: 'ครึ่งชีวิตของสารกัมมันตรังสี', unit: '\\text{s}' },
        { sym: 'A(t)', name: 'กัมมันตภาพของสารตัวอย่าง', unit: '\\text{Bq}' },
        { sym: 'D', name: 'ปริมาณรังสีดูดกลืน', unit: '\\text{Gy = J/kg}' },
        { sym: 'H', name: 'ปริมาณรังสีสมมูลต่อเนื้อเยื่อ', unit: '\\text{Sv = J/kg}' },
        { sym: '\\mu', name: 'สัมประสิทธิ์การลดทอนเชิงเส้นของวัสดุ', unit: '\\text{cm}^{-1}' }
      ];
      boundsText = 'ครอบคลุม 3 แกนหลักของฟิสิกส์นิวเคลียร์: (1) เส้นโค้งพลังงานยึดเหนี่ยวต่อนิวคลีออน Eb/A vs A แสดงจุดเสถียรสูงสุดที่เหล็ก-56 และการจำลองสมการมวลกึ่งเชิงประจักษ์ SEMF สำหรับทำนายพลังงานฟิวชันและฟิชชัน (2) กฎการสลายกัมมันตรังสีเชิงสถิติแบบมอนเตคาร์โลสำหรับกลุ่มอนุภาค 180 ตัว พร้อมกราฟเปรียบเทียบกับฟังก์ชันเอกซ์โพเนนเชียลทฤษฎีและเส้นแบ่งครึ่งชีวิต (3) การทดลองกำบังรังสีแอลฟา บีตา แกมมา พร้อมการคำนวณการลดทอนแบบเอกซ์โพเนนเชียล I = I0 exp(-mu x) และการแปลงหน่วยวัดทางรังสีวิทยา Bq, Gy, Sv';
      controlMapText = '• สลับ 3 โหมดย่อย (เส้นโค้ง Eb/A / กฎการสลายเชิงสถิติ / การกำบังรังสี & โดสิมิเตอร์)<br>• ปรับเลือกนิวไคลด์, ครึ่งชีวิต T1/2, ชนิดรังสี (Alpha, Beta, Gamma) และวัสดุกำบัง (กระดาษ, อะลูมิเนียม, ตะกั่ว, คอนกรีต) เพื่อสังเกตผลกระทบเชิงกายภาพและชีวภาพ';
    } else if (mode === 'civil') {
      title = 'แบบจำลองวิศวกรรมโยธา: แผนภาพแรงเฉือน โมเมนต์ดัด การโก่งตัว และวงกลมของมอร์';
      badge = 'Structural Statics & Mechanics of Materials Engine';
      equationsLatex = [
        '\\frac{dV}{dx} = -w(x),\\quad \\frac{dM}{dx} = V(x),\\quad EI\\frac{d^2\\nu}{dx^2} = M(x)',
        '\\sigma_{x\'} = \\frac{\\sigma_x + \\sigma_y}{2} + \\frac{\\sigma_x - \\sigma_y}{2}\\cos 2\\theta + \\tau_{xy}\\sin 2\\theta',
        'R = \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2},\\quad \\sigma_{1,2} = \\sigma_{\\text{avg}} \\pm R,\\quad \\tau_{\\max} = R'
      ];
      varsRows = [
        { sym: 'L', name: 'ความยาวช่วงคาน (Beam Span)', unit: '\\text{m}' },
        { sym: 'P', name: 'แรงจุดกระทำภายนอก (Concentrated Load)', unit: '\\text{kN}' },
        { sym: 'a', name: 'ระยะตำแหน่งแรงจุดจากจุดรองรับซ้าย', unit: '\\text{m}' },
        { sym: 'w', name: 'แรงแผ่กระจายสม่ำเสมอ (Uniform Distributed Load)', unit: '\\text{kN/m}' },
        { sym: 'EI', name: 'สภาพต้านทานการดัดงอของหน้าตัดคาน (Flexural Rigidity)', unit: '\\text{kN}\\cdot\\text{m}^2' },
        { sym: '\\sigma_x, \\sigma_y', name: 'ความเค้นตั้งฉากในระนาบ (In-plane Normal Stresses)', unit: '\\text{MPa}' },
        { sym: '\\tau_{xy}', name: 'ความเค้นเฉือนในระนาบ (In-plane Shear Stress)', unit: '\\text{MPa}' },
        { sym: '\\theta', name: 'มุมหมุนระนาบของชิ้นส่วนความเค้น (Element Rotation)', unit: '^\\circ\\text{ (deg)}' }
      ];
      boundsText = 'ทฤษฎีคานออยเลอร์-แบร์นูลลี (Euler-Bernoulli Beam Theory) สมมติฐานหน้าตัดระนาบยังคงเป็นระนาบหลังการดัด การโก่งตัวขนาดเล็ก (Small Deflection) และวัสดุยืดหยุ่นเชิงเส้นสม่ำเสมอ (Linear Elastic & Isotropic) ตามกฎของฮุก (Hooke\'s Law)';
      controlMapText = '• ลากเมาส์บนกระดานคานเพื่อตรวจสอบค่า $x$, $V(x)$, $M(x)$ และ $\\nu(x)$ แบบเรียลไทม์<br>• พิมพ์ตัวเลขโดยตรงในกล่องข้อความเพื่อจำลองคานช่วงเดี่ยว คานยื่น หรือวงกลมของมอร์ได้ทันที';
    }
    let html = `
      <details class="sim-edu-collapsible">
        <summary class="sim-edu-summary">
          <div class="sim-edu-title">
            <span class="sim-edu-icon">📖</span>
            <span>ข้อมูลวิชาการและสมการกำกับแบบจำลอง: ${title}</span>
          </div>
          <div class="sim-edu-badge-group">
            <span class="sim-edu-badge">${badge}</span>
            <span class="sim-edu-toggle-hint">คลิกเพื่อดูสมการและพารามิเตอร์ ▾</span>
          </div>
        </summary>

        <div class="sim-edu-body">
          <div class="sim-edu-grid">
            <!-- Section 1: Governing Equations -->
            <div class="sim-edu-section">
              <div class="sim-edu-sec-title">📐 สมการเชิงอนุพันธ์กำกับแบบจำลอง (Governing Equations)</div>
              <div class="sim-edu-equations">
                ${equationsLatex.map(eq => `<div class="math-display">$$${eq}$$</div>`).join('')}
              </div>
            </div>

            <!-- Section 2: Parameters & SI Units -->
            <div class="sim-edu-section">
              <div class="sim-edu-sec-title">📊 ตัวแปร พารามิเตอร์ และหน่วย SI สากล</div>
              <table class="sim-edu-vars-table">
                <thead>
                  <tr>
                    <th style="width: 25%;">ตัวแปร</th>
                    <th style="width: 50%;">ความหมายทางฟิสิกส์</th>
                    <th style="width: 25%;">หน่วย SI</th>
                  </tr>
                </thead>
                <tbody>
                  ${varsRows.map(r => {
                    const uStr = (r.unit || '').trim();
                    const isUnitless = !uStr || uStr.includes('ไร้หน่วย') || uStr.toLowerCase().includes('dimensionless') || uStr === '—' || uStr === '-' || uStr === '\\text{—}';
                    const formattedUnit = isUnitless ? '—' : `$${uStr}$`;
                    return `
                    <tr>
                      <td><strong>$${r.sym}$</strong></td>
                      <td>${r.name}</td>
                      <td>${formattedUnit}</td>
                    </tr>
                  `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Section 3: Boundary Conditions & Controls -->
            <div class="sim-edu-section">
              <div class="sim-edu-sec-title">📏 เงื่อนไขขอบเขต & ความสัมพันธ์กับค่าควบคุม</div>
              <p style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.5rem; line-height: 1.5;">
                <strong>ขอบเขตการใช้งานจริง:</strong> ${boundsText}
              </p>
              <div class="sim-edu-control-map">
                ${controlMapText}
              </div>
            </div>
          </div>
        </div>
      </details>
    `;

    frame.innerHTML = html;

    if (window.MathRenderer) {
      window.MathRenderer.typeset(frame);
    }
  }

  /**
   * Unified Theory -> Simulator deep link launcher (R1 & R4)
   * Resolves chapter and theoryId without destructive parseInt truncation.
   * Guarantees exact mode/submode routing and never falls back to projectile across chapters.
   */
  function launchSimulatorForTheory(chapterId, theoryId) {
    let chap = chapterId || currentChapter || 'ch01';
    const rawId = String(theoryId || '');

    // Auto-detect chapter from rawId prefix if applicable
    if (rawId.startsWith('ch01') || rawId.startsWith('1-')) chap = 'ch01';
    else if (rawId.startsWith('ch02')) chap = 'ch02';
    else if (rawId.startsWith('ch03')) chap = 'ch03';
    else if (rawId.startsWith('ch04')) chap = 'ch04';
    else if (rawId.startsWith('ch05')) chap = 'ch05';
    else if (rawId.startsWith('ch06')) chap = 'ch06';
    else if (rawId.startsWith('ch07')) chap = 'ch07';
    else if (rawId.startsWith('civ')) chap = 'civil_eng';

    // Synchronize chapter state (updates chapter badge, navbar button filters)
    if (typeof openChapter === 'function') {
      openChapter(chap);
    }

    // Switch view to simulator
    switchView('view-simulator');

    // Extract numerical index within the chapter
    let num = 1;
    const match = rawId.match(/\d+$/);
    if (match) {
      num = parseInt(match[0], 10);
    } else if (/^\d+$/.test(rawId)) {
      num = parseInt(rawId, 10);
    }

    if (chap === 'ch01') {
      launchSimulatorPreset(num);
    } else if (chap === 'ch02') {
      launchCircularSimulatorPreset(num);
    } else if (chap === 'ch03') {
      launchOscillationSimulatorPreset(num);
    } else if (chap === 'ch04') {
      launchWaveSimulatorPreset(num);
    } else if (chap === 'ch05') {
      launchThermoSimulatorPreset(num);
    } else if (chap === 'ch06') {
      launchEMSimulatorPreset(num);
    } else if (chap === 'ch07') {
      launchNuclearSimulatorPreset(num);
    } else if (chap === 'civil_eng') {
      launchCivilSimulatorPreset(num);
    } else {
      switchSimMode(chap === 'ch01' ? 'projectile' : 'em');
    }

    setTimeout(() => {
      const activeContainer = document.querySelector('.sim-mode-container.active');
      if (activeContainer) {
        activeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  }

  // Simulator preset launcher
  function launchSimulatorPreset(theoryId) {
    switchView('view-simulator');

    let num = 1;
    if (typeof theoryId === 'number') num = theoryId;
    else if (typeof theoryId === 'string') {
      const m = theoryId.match(/\d+$/);
      if (m) num = parseInt(m[0], 10);
    }

    if (num === 1 || num === 2) {
      // 1D & Straight-line Kinematics -> Switch to Mode 2 (Vehicle & Vector field)
      switchSimMode('vehicle');
      if (vehicleSimulatorInstance) {
        vehicleSimulatorInstance.reset();
        vehicleSimulatorInstance.setParams({ speed: 30.0, windSpeed: 10.0, windDirDeg: 90.0 });
      }
    } else if (num === 7 || num === 8) {
      // Conservation of Momentum & Collision -> Switch to Mode 3 (Collision)
      switchSimMode('collision');
      if (collisionSimulatorInstance) {
        collisionSimulatorInstance.reset();
      }
    } else if (num === 13) {
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
        if (num === 3 || num === 4) {
          simulatorInstance.updateParams({ v0: 80, thetaDeg: 45, y0: 0, c: 0.0 });
        } else if (num === 5 || num === 6) {
          simulatorInstance.updateParams({ v0: 100, thetaDeg: 45, y0: 0, c: 0.08, m: 2.0 });
        } else if (num === 9) {
          simulatorInstance.updateParams({ v0: 75, thetaDeg: 40, y0: 10, c: 0.04, m: 4.0 });
        } else if (num === 10) {
          simulatorInstance.updateParams({ v0: 90, thetaDeg: 35, y0: 0, c: 0.12, m: 3.0 });
        }
        syncSlidersFromSimulator(simulatorInstance.params);
        simulatorInstance.reset();
        simulatorInstance.render();
      }
    }

    renderSimulatorEduContext(activeSimMode);

    setTimeout(() => {
      const activeContainer = document.querySelector('.sim-mode-container.active');
      if (activeContainer) {
        activeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  }

  // ======================================================================
  // SIMULATOR MULTI-MODE CONTROLLERS
  // ======================================================================

  function setupSimulatorModeSwitcher() {
    const modeBtns = document.querySelectorAll('.sim-mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.simMode;
        const submode = btn.dataset.submode;
        switchView('view-simulator');
        switchSimMode(mode, submode);
      });
    });
  }

  function switchSimMode(mode, submode = null) {
    if (activeSimMode !== mode) {
      pauseAllSimulators();
      activeSimMode = mode;
    }

    if (!submode) {
      if (mode === 'circular') submode = 'banked';
      else if (mode === 'oscillation') submode = 'spring';
      else if (mode === 'wave') submode = 'traveling';
      else if (mode === 'thermo') submode = 'pv_engine';
      else if (mode === 'em') submode = 'field_charges';
      else if (mode === 'nuclear') submode = 'binding_energy';
      else if (mode === 'civil') submode = 'simply_supported';
      else if (mode === 'projectile') submode = 'trajectory';
    }

    // Map simulator mode to chapter and show corresponding pills
    let targetChapter = 'ch01';
    if (mode === 'circular') targetChapter = 'ch02';
    else if (mode === 'oscillation') targetChapter = 'ch03';
    else if (mode === 'wave') targetChapter = 'ch04';
    else if (mode === 'thermo') targetChapter = 'ch05';
    else if (mode === 'em') targetChapter = 'ch06';
    else if (mode === 'nuclear') targetChapter = 'ch07';
    else if (mode === 'civil') targetChapter = 'civil_eng';

    // Synchronize currentChapter with simulator mode's chapter
    if (currentChapter !== targetChapter) {
      currentChapter = targetChapter;
      const badge = document.querySelector('.header-chapter-badge');
      if (badge) {
        if (currentChapter === 'ch01') badge.innerHTML = '<span>บทที่ 01 / 2D KINEMATICS & DYNAMICS</span> ▾';
        else if (currentChapter === 'ch02') badge.innerHTML = '<span>บทที่ 02 / CIRCULAR MOTION & GRAVITATION</span> ▾';
        else if (currentChapter === 'ch03') badge.innerHTML = '<span>บทที่ 03 / OSCILLATIONS & SIMPLE HARMONIC MOTION</span> ▾';
        else if (currentChapter === 'ch04') badge.innerHTML = '<span>บทที่ 04 / WAVES, ACOUSTICS & OPTICS</span> ▾';
        else if (currentChapter === 'ch05') badge.innerHTML = '<span>บทที่ 05 / THERMODYNAMICS & KINETIC THEORY</span> ▾';
        else if (currentChapter === 'ch06') badge.innerHTML = '<span>บทที่ 06 / ELECTROMAGNETISM & CIRCUITS</span> ▾';
        else if (currentChapter === 'ch07') badge.innerHTML = '<span>บทที่ 07 / NUCLEAR & MODERN PHYSICS</span> ▾';
        else if (currentChapter === 'civil_eng') badge.innerHTML = '<span>สาขาวิศวกรรมโยธา / CIVIL ENGINEERING</span> ▾';
      }
      activeDivisionFilter = 'all';
      activeFormulaDivisionFilter = 'all';
      viewNeedsUpdate['view-theory'] = true;
      viewNeedsUpdate['view-formulas'] = true;
      viewNeedsUpdate['view-phenomena'] = true;
      renderDrawerCatalog(currentChapter);
      if (currentView === 'view-theory') {
        renderTheoryContent(currentChapter);
        viewNeedsUpdate['view-theory'] = false;
      } else if (currentView === 'view-formulas') {
        renderFormulasContent(currentChapter);
        viewNeedsUpdate['view-formulas'] = false;
      } else if (currentView === 'view-phenomena') {
        renderPhenomenaContent(currentChapter);
        viewNeedsUpdate['view-phenomena'] = false;
      }
    }

    const allChaps = ['ch01', 'ch02', 'ch03', 'ch04', 'ch05', 'ch06', 'ch07', 'civil_eng'];
    allChaps.forEach(ch => {
      document.querySelectorAll(`.sim-mode-btn[data-chapter="${ch}"]`).forEach(b => {
        b.style.display = (ch === targetChapter) ? 'inline-flex' : 'none';
      });
    });

    // Update buttons in navbar
    document.querySelectorAll('.sim-mode-btn').forEach(btn => {
      let isActive = false;
      if (submode && btn.dataset.submode) {
        isActive = (btn.dataset.simMode === mode && btn.dataset.submode === submode);
      } else {
        isActive = (btn.dataset.simMode === mode && !btn.dataset.submode);
      }
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Invoke submode on engine & synchronize UI controls
    if (submode) {
      const callSub = (inst, s) => {
        if (!inst) return;
        if (typeof inst.setSubMode === 'function') inst.setSubMode(s);
        else if (typeof inst.setSubmode === 'function') inst.setSubmode(s);
      };

      if (mode === 'projectile') {
        callSub(simulatorInstance, submode);
        const grpTraj = document.getElementById('controls-projectile-trajectory');
        const grpRocket = document.getElementById('controls-projectile-rocket');
        const telemTraj = document.getElementById('telem-projectile-trajectory');
        const telemRocket = document.getElementById('telem-projectile-rocket');
        const isRocket = (submode === 'rocket_equation');
        if (grpTraj) grpTraj.style.display = isRocket ? 'none' : 'block';
        if (grpRocket) grpRocket.style.display = isRocket ? 'block' : 'none';
        if (telemTraj) telemTraj.style.display = isRocket ? 'none' : 'grid';
        if (telemRocket) telemRocket.style.display = isRocket ? 'grid' : 'none';
        const insetBox = document.getElementById('canvas-inset-box');
        if (insetBox) insetBox.style.display = isRocket ? 'none' : 'block';
        const dotsBar = document.querySelector('#sim-container-projectile .canvas-footer-dock');
        if (dotsBar) dotsBar.style.display = isRocket ? 'none' : 'flex';
        const legend = document.querySelector('#sim-container-projectile .canvas-legend');
        if (legend) legend.style.display = isRocket ? 'none' : 'block';
        if (isRocket && typeof syncRocketUIInputs === 'function') {
          syncRocketUIInputs();
        }
        if (simulatorInstance) {
          simulatorInstance.render();
          if (typeof simulatorInstance._dispatchTelemetry === 'function') {
            if (isRocket) {
              simulatorInstance._dispatchTelemetry(simulatorInstance.state, null);
            } else {
              simulatorInstance._dispatchTelemetry(simulatorInstance.currentLiveState, simulatorInstance.cachedSimulation);
            }
          }
        }
      }
      if (mode === 'circular') {
        callSub(circularSimulatorInstance, submode);
        const bankGroup = document.getElementById('circ-group-bank');
        const frictionGroup = document.getElementById('circ-group-friction');
        const loopGroup = document.getElementById('circ-group-looptype');
        const orbitGroup = document.getElementById('circ-group-orbit');
        if (bankGroup) bankGroup.style.display = (submode === 'banked') ? 'block' : 'none';
        if (frictionGroup) frictionGroup.style.display = (submode === 'banked') ? 'block' : 'none';
        if (loopGroup) loopGroup.style.display = (submode === 'vertical') ? 'block' : 'none';
        if (orbitGroup) orbitGroup.style.display = (submode === 'orbit') ? 'block' : 'none';
      }
      if (mode === 'oscillation') {
        callSub(oscillationSimulatorInstance, submode);
        const kGroup = document.getElementById('group-osc-k');
        const ampGroup = document.getElementById('group-osc-amp');
        const lenGroup = document.getElementById('group-osc-length');
        const angGroup = document.getElementById('group-osc-angle');
        const dampGroup = document.getElementById('group-osc-damping');
        const wGroup = document.getElementById('group-osc-omega');
        const f0Group = document.getElementById('group-osc-f0');
        const dpGroup = document.getElementById('group-osc-double-pendulum');
        const massGroup = document.getElementById('group-osc-shared-mass');
        const hoopGroup = document.getElementById('group-osc-rotating-hoop');

        const isHoop = (submode === 'rotating_hoop');
        if (massGroup) massGroup.style.display = isHoop ? 'none' : 'block';
        if (hoopGroup) hoopGroup.style.display = isHoop ? 'block' : 'none';

        if (submode === 'spring') {
          if (kGroup) kGroup.style.display = 'block';
          if (ampGroup) ampGroup.style.display = 'block';
          if (lenGroup) lenGroup.style.display = 'none';
          if (angGroup) angGroup.style.display = 'none';
          if (dampGroup) dampGroup.style.display = 'none';
          if (wGroup) wGroup.style.display = 'none';
          if (f0Group) f0Group.style.display = 'none';
          if (dpGroup) dpGroup.style.display = 'none';
        } else if (submode === 'pendulum') {
          if (kGroup) kGroup.style.display = 'none';
          if (ampGroup) ampGroup.style.display = 'none';
          if (lenGroup) lenGroup.style.display = 'block';
          if (angGroup) angGroup.style.display = 'block';
          if (dampGroup) dampGroup.style.display = 'none';
          if (wGroup) wGroup.style.display = 'none';
          if (f0Group) f0Group.style.display = 'none';
          if (dpGroup) dpGroup.style.display = 'none';
        } else if (submode === 'damping_resonance') {
          if (kGroup) kGroup.style.display = 'block';
          if (ampGroup) ampGroup.style.display = 'none';
          if (lenGroup) lenGroup.style.display = 'none';
          if (angGroup) angGroup.style.display = 'none';
          if (dampGroup) dampGroup.style.display = 'block';
          if (wGroup) wGroup.style.display = 'block';
          if (f0Group) f0Group.style.display = 'block';
          if (dpGroup) dpGroup.style.display = 'none';
        } else if (submode === 'double_pendulum') {
          if (kGroup) kGroup.style.display = 'none';
          if (ampGroup) ampGroup.style.display = 'none';
          if (lenGroup) lenGroup.style.display = 'none';
          if (angGroup) angGroup.style.display = 'none';
          if (dampGroup) dampGroup.style.display = 'none';
          if (wGroup) wGroup.style.display = 'none';
          if (f0Group) f0Group.style.display = 'none';
          if (dpGroup) dpGroup.style.display = 'block';
        } else if (submode === 'rotating_hoop') {
          if (kGroup) kGroup.style.display = 'none';
          if (ampGroup) ampGroup.style.display = 'none';
          if (lenGroup) lenGroup.style.display = 'none';
          if (angGroup) angGroup.style.display = 'none';
          if (dampGroup) dampGroup.style.display = 'none';
          if (wGroup) wGroup.style.display = 'none';
          if (f0Group) f0Group.style.display = 'none';
          if (dpGroup) dpGroup.style.display = 'none';
        }
        if (oscillationSimulatorInstance) {
          oscillationSimulatorInstance.render();
          if (typeof oscillationSimulatorInstance._emitTelemetry === 'function') {
            oscillationSimulatorInstance._emitTelemetry();
          }
        }
      }
      if (mode === 'vehicle') {
        callSub(vehicleSimulatorInstance, submode);
        const kControls = document.getElementById('group-veh-kinematics-controls');
        const dControls = document.getElementById('group-veh-divergence-controls');
        const panelTitle = document.getElementById('title-veh-panel');
        if (submode === 'vector_field_divergence') {
          if (kControls) kControls.style.display = 'none';
          if (dControls) dControls.style.display = 'block';
          if (panelTitle) panelTitle.textContent = 'พารามิเตอร์สนามเวกเตอร์และทฤษฎีบทการลู่ออก';
        } else {
          if (kControls) kControls.style.display = 'block';
          if (dControls) dControls.style.display = 'none';
          if (panelTitle) panelTitle.textContent = 'พารามิเตอร์การขับขี่และสนามลม';
        }
      }
      if (mode === 'wave') {
        callSub(waveSimulatorInstance, submode);
        const nGroup = document.getElementById('group-wave-n');
        const f1Group = document.getElementById('group-wave-f1');
        const f2Group = document.getElementById('group-wave-f2');
        const freqGroup = document.getElementById('group-wave-freq');
        const tenGroup = document.getElementById('group-wave-tension');
        const denGroup = document.getElementById('group-wave-density');
        const ampGroup = document.getElementById('group-wave-amp');
        const waterGroup = document.getElementById('group-wave-water');
        const lightGroup = document.getElementById('group-wave-light');
        const polGroup = document.getElementById('group-wave-polarization');
        const opticsGroup = document.getElementById('group-wave-optics');
        const fourierGroup = document.getElementById('group-wave-fourier');

        const isTraveling = (submode === 'traveling');
        const isStanding = (submode === 'standing');
        const isBeats = (submode === 'interference_beats');
        const isWater = (submode === 'water_waves');
        const isLight = (submode === 'light_waves');
        const isPol = (submode === 'polarization');
        const isOptics = (submode === 'geometric_optics');
        const isFourier = (submode === 'fourier_synthesis');

        if (ampGroup) ampGroup.style.display = (isTraveling || isStanding) ? 'block' : 'none';
        if (freqGroup) freqGroup.style.display = isTraveling ? 'block' : 'none';
        if (tenGroup) tenGroup.style.display = (isTraveling || isStanding) ? 'block' : 'none';
        if (denGroup) denGroup.style.display = (isTraveling || isStanding) ? 'block' : 'none';
        if (nGroup) nGroup.style.display = isStanding ? 'block' : 'none';
        if (f1Group) f1Group.style.display = isBeats ? 'block' : 'none';
        if (f2Group) f2Group.style.display = isBeats ? 'block' : 'none';
        if (waterGroup) waterGroup.style.display = isWater ? 'block' : 'none';
        if (lightGroup) lightGroup.style.display = isLight ? 'block' : 'none';
        if (polGroup) polGroup.style.display = isPol ? 'block' : 'none';
        if (opticsGroup) opticsGroup.style.display = isOptics ? 'block' : 'none';
        if (fourierGroup) fourierGroup.style.display = isFourier ? 'block' : 'none';
      }
      if (mode === 'thermo') {
        callSub(thermoSimulatorInstance, submode);
        const grpPV = document.getElementById('controls-pv-engine');
        const grpKinetic = document.getElementById('controls-kinetic-gas');
        const grpHeat = document.getElementById('controls-heat-conduction');
        if (grpPV) grpPV.style.display = (submode === 'pv_engine') ? 'block' : 'none';
        if (grpKinetic) grpKinetic.style.display = (submode === 'kinetic_gas') ? 'block' : 'none';
        if (grpHeat) grpHeat.style.display = (submode === 'heat_conduction') ? 'block' : 'none';
      }
      if (mode === 'em') {
        callSub(emSimulatorInstance, submode);
        const groups = {
          'field_charges': 'controls-field-charges',
          'lorentz_cyclotron': 'controls-lorentz',
          'rc_circuit': 'controls-rc-circuit',
          'faraday_induction': 'controls-faraday',
          'biot_savart': 'controls-biot-savart',
          'ac_rlc_resonance': 'controls-ac-rlc',
          'dielectric_force': 'controls-dielectric-force'
        };
        Object.keys(groups).forEach(sm => {
          const el = document.getElementById(groups[sm]);
          if (el) el.style.display = (sm === submode) ? 'block' : 'none';
        });
        if (emSimulatorInstance) emSimulatorInstance.emitTelemetry();
      }
      if (mode === 'nuclear') {
        callSub(nuclearSimulatorInstance, submode);
        const grpBinding = document.getElementById('controls-binding-energy');
        const grpDecay = document.getElementById('controls-decay-stochastic');
        const grpShield = document.getElementById('controls-shielding');
        const grpCompton = document.getElementById('controls-compton-scattering');
        if (grpBinding) grpBinding.style.display = (submode === 'binding_energy') ? 'block' : 'none';
        if (grpDecay) grpDecay.style.display = (submode === 'decay_stochastic') ? 'block' : 'none';
        if (grpShield) grpShield.style.display = (submode === 'shielding_dosimetry') ? 'block' : 'none';
        if (grpCompton) grpCompton.style.display = (submode === 'compton_scattering') ? 'block' : 'none';
        if (nuclearSimulatorInstance) nuclearSimulatorInstance.emitTelemetry();
      }
      if (mode === 'civil') {
        callSub(civilSimulatorInstance, submode);
        const grpBeam = document.getElementById('controls-civil-beam');
        const grpMohr = document.getElementById('controls-civil-mohr');
        const grpTruss = document.getElementById('controls-civil-truss');
        const telemBeam = document.getElementById('telem-civil-beam');
        const telemMohr = document.getElementById('telem-civil-mohr');
        const telemTruss = document.getElementById('telem-civil-truss');
        const presetsBeam = document.getElementById('presets-civil-beam');
        const presetsTruss = document.getElementById('presets-civil-truss');

        const isMohr = (submode === 'mohr_circle');
        const isTruss = (submode === 'truss_analysis');
        const isBeam = (!isMohr && !isTruss);

        if (grpBeam) grpBeam.style.display = isBeam ? 'block' : 'none';
        if (grpMohr) grpMohr.style.display = isMohr ? 'block' : 'none';
        if (grpTruss) grpTruss.style.display = isTruss ? 'block' : 'none';

        if (telemBeam) telemBeam.style.display = isBeam ? 'grid' : 'none';
        if (telemMohr) telemMohr.style.display = isMohr ? 'grid' : 'none';
        if (telemTruss) telemTruss.style.display = isTruss ? 'grid' : 'none';

        if (presetsBeam) presetsBeam.style.display = isTruss ? 'none' : 'flex';
        if (presetsTruss) presetsTruss.style.display = isTruss ? 'flex' : 'none';

        if (civilSimulatorInstance) {
          civilSimulatorInstance.render();
          if (typeof civilSimulatorInstance._emitTelemetry === 'function') {
            civilSimulatorInstance._emitTelemetry();
          }
        }
      }

      // Sync internal submode button
      const internalSubmodeBtn = document.querySelector(`#sim-container-${mode} .submode-btn[data-submode="${submode}"]`);
      if (internalSubmodeBtn) {
        document.querySelectorAll(`#sim-container-${mode} .submode-btn`).forEach(b => b.classList.toggle('active', b === internalSubmodeBtn));
      }
    }

    // Toggle container views
    const containers = {
      projectile: document.getElementById('sim-container-projectile'),
      vehicle: document.getElementById('sim-container-vehicle'),
      collision: document.getElementById('sim-container-collision'),
      threejs: document.getElementById('sim-container-threejs'),
      circular: document.getElementById('sim-container-circular'),
      oscillation: document.getElementById('sim-container-oscillation'),
      wave: document.getElementById('sim-container-wave'),
      thermo: document.getElementById('sim-container-thermo'),
      em: document.getElementById('sim-container-em'),
      nuclear: document.getElementById('sim-container-nuclear'),
      civil: document.getElementById('sim-container-civil')
    };

    Object.keys(containers).forEach(k => {
      if (containers[k]) {
        containers[k].style.display = (k === mode) ? 'block' : 'none';
        containers[k].classList.toggle('active', k === mode);
      }
    });

    activeSimMode = mode;
    renderSimulatorEduContext(mode);

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
    } else if (mode === 'circular' && circularSimulatorInstance) {
      circularSimulatorInstance.resize();
      circularSimulatorInstance.render();
    } else if (mode === 'oscillation' && oscillationSimulatorInstance) {
      oscillationSimulatorInstance.resize();
      oscillationSimulatorInstance.render();
    } else if (mode === 'wave' && waveSimulatorInstance) {
      waveSimulatorInstance.resize();
      waveSimulatorInstance.render();
    } else if (mode === 'thermo' && thermoSimulatorInstance) {
      thermoSimulatorInstance.resize();
      thermoSimulatorInstance.render();
    } else if (mode === 'em' && emSimulatorInstance) {
      emSimulatorInstance.resize();
      emSimulatorInstance.render();
    } else if (mode === 'nuclear' && nuclearSimulatorInstance) {
      nuclearSimulatorInstance.resize();
      nuclearSimulatorInstance.render();
    } else if (mode === 'civil' && civilSimulatorInstance) {
      civilSimulatorInstance.resize();
      civilSimulatorInstance.render();
    }

    if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.attachTelemetryClickListeners === 'function') {
      window.TelemetryMathInspector.attachTelemetryClickListeners();
      const defaultVars = {
        projectile: 'telem-vac-range',
        vehicle: 'telem-veh-vrel',
        collision: 'telem-col-p1',
        circular: 'circ-telem-ac',
        oscillation: 'osc-telem-omega0',
        wave: 'wave-telem-speed'
      };
      if (defaultVars[mode]) {
        window.TelemetryMathInspector.selectVariable(defaultVars[mode]);
      }
    }

    setupUniversalSpeedControls();
    setUniversalSimulationSpeed(window.currentGlobalSimSpeed || 1.0);
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
    window.projectileSimulatorInstance = simulatorInstance;
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
    if (btnReset) btnReset.addEventListener('click', () => {
      simulatorInstance.reset();
      if (simulatorInstance.subMode === 'rocket_equation') {
        syncRocketUIInputs();
      }
    });

    bindSlider('slider-v0', 'val-v0', 'v0', ' m/s', parseFloat);
    bindSlider('slider-theta', 'val-theta', 'thetaDeg', '°', parseFloat);
    bindSlider('slider-m', 'val-m', 'm', ' kg', parseFloat);
    bindSlider('slider-c', 'val-c', 'c', ' kg/m', parseFloat);
    bindSlider('slider-g', 'val-g', 'g', ' m/s²', parseFloat);
    bindSlider('slider-y0', 'val-y0', 'y0', ' m', parseFloat);

    // Rocket Equation Sliders
    const bindRocketSlider = (sliderId, labelId, paramKey, unit, parser, fmt) => {
      const slider = document.getElementById(sliderId);
      const label = document.getElementById(labelId);
      const numInput = document.getElementById(sliderId.replace('slider-', 'input-'));
      if (!slider || !label) return;

      const update = (val) => {
        label.textContent = fmt ? fmt(val) : (val + unit);
        if (numInput && numInput !== document.activeElement) numInput.value = val;
        if (slider && slider !== document.activeElement) slider.value = val;
        if (simulatorInstance) {
          if (typeof simulatorInstance.setRocketParams === 'function') {
            simulatorInstance.setRocketParams({ [paramKey]: val });
          } else {
            if (!simulatorInstance.rocketParams) simulatorInstance.rocketParams = {};
            simulatorInstance.rocketParams[paramKey] = val;
            if (typeof simulatorInstance._updateRocketState === 'function') {
              simulatorInstance._updateRocketState();
            }
            simulatorInstance.render();
          }
        }
      };

      slider.addEventListener('input', (e) => update(parser(e.target.value)));
      if (numInput) {
        numInput.addEventListener('input', (e) => {
          const val = parser(e.target.value);
          if (!isNaN(val)) update(val);
        });
        numInput.addEventListener('change', (e) => {
          const val = parser(e.target.value);
          if (!isNaN(val)) update(val);
        });
      }
    };

    bindRocketSlider('slider-rocket-m0', 'val-rocket-m0', 'm0', ' kg', parseFloat, v => Math.round(v).toLocaleString() + ' kg');
    bindRocketSlider('slider-rocket-mf', 'val-rocket-mf', 'mf', ' kg', parseFloat, v => Math.round(v).toLocaleString() + ' kg');
    bindRocketSlider('slider-rocket-uex', 'val-rocket-uex', 'uex', ' m/s', parseFloat, v => Math.round(v).toLocaleString() + ' m/s');
    bindRocketSlider('slider-rocket-time', 'val-rocket-time', 'burnTime', ' s', parseFloat, v => Math.round(v) + ' s');

    function syncRocketUIInputs() {
      if (!simulatorInstance || !simulatorInstance.rocketParams) return;
      const p = simulatorInstance.rocketParams;
      const m0 = (p.m0 !== undefined) ? p.m0 : (p.initialMassM0 || 12000);
      const mf = (p.mf !== undefined) ? p.mf : (p.dryMassMf || 1200);
      const uex = (p.uex !== undefined) ? p.uex : (p.exhaustSpeedUex || 3000);
      const time = p.burnTime || 54;

      const setVal = (id, val, fmt) => {
        const slider = document.getElementById(id);
        const numInput = document.getElementById(id.replace('slider-', 'input-'));
        const label = document.getElementById(id.replace('slider-', 'val-'));
        if (slider && slider !== document.activeElement) slider.value = val;
        if (numInput && numInput !== document.activeElement) numInput.value = val;
        if (label && fmt) label.textContent = fmt(val);
      };

      setVal('slider-rocket-m0', m0, v => Math.round(v).toLocaleString() + ' kg');
      setVal('slider-rocket-mf', mf, v => Math.round(v).toLocaleString() + ' kg');
      setVal('slider-rocket-uex', uex, v => Math.round(v).toLocaleString() + ' m/s');
      setVal('slider-rocket-time', time, v => Math.round(v) + ' s');
    }

    // Wire Preset Color Dots (Image 3: Black, Pink, Green, Blue)
    const presetDots = document.querySelectorAll('#canvas-preset-dots-bar .preset-dot');
    presetDots.forEach((dot, dIdx) => {
      dot.addEventListener('click', () => {
        presetDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const p = dot.dataset.preset;
        if (!simulatorInstance) return;
        if (p === 'standard') {
          simulatorInstance.updateParams({ v0: 100, thetaDeg: 30, c: 0.05 });
        } else if (p === 'high-angle') {
          simulatorInstance.updateParams({ v0: 100, thetaDeg: 65, c: 0.05 });
        } else if (p === 'heavy-drag') {
          simulatorInstance.updateParams({ v0: 100, thetaDeg: 45, c: 0.25 });
        } else if (p === 'high-speed') {
          simulatorInstance.updateParams({ v0: 150, thetaDeg: 45, c: 0.05 });
        }
        syncSlidersFromSimulator(simulatorInstance.params);
        simulatorInstance.render();

        const stepInd = document.getElementById('step-nav-indicator');
        if (stepInd) stepInd.textContent = `ขั้นตอน ${dIdx + 1} / ${presetDots.length}`;
      });
    });

    // Wire Step Buttons (< | >)
    let currentStepIdx = 0;
    const btnStepPrev = document.getElementById('btn-step-prev');
    const btnStepNext = document.getElementById('btn-step-next');
    const stepInd = document.getElementById('step-nav-indicator');

    if (btnStepPrev) {
      btnStepPrev.addEventListener('click', () => {
        if (currentStepIdx > 0) {
          currentStepIdx--;
          const dot = presetDots[currentStepIdx];
          if (dot) dot.click();
        }
      });
    }
    if (btnStepNext) {
      btnStepNext.addEventListener('click', () => {
        if (currentStepIdx < presetDots.length - 1) {
          currentStepIdx++;
          const dot = presetDots[currentStepIdx];
          if (dot) dot.click();
        }
      });
    }

    // Wire Conditions Toggle (Image 3 Box 3)
    const btnConditionsToggle = document.getElementById('btn-conditions-toggle');
    const conditionsExp = document.getElementById('conditions-expanded-content');
    if (btnConditionsToggle && conditionsExp) {
      btnConditionsToggle.addEventListener('click', () => {
        const isExp = conditionsExp.style.display !== 'none';
        conditionsExp.style.display = isExp ? 'none' : 'block';
        btnConditionsToggle.setAttribute('aria-expanded', isExp ? 'false' : 'true');
        btnConditionsToggle.textContent = isExp ? '⊕ ดูเพิ่มเติม' : '⊖ ย่อข้อมูล';
      });
    }

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
    const numInput = document.getElementById(sliderId.replace('slider-', 'input-'));
    if (!slider || !label) return;

    slider.addEventListener('input', (e) => {
      const val = parser(e.target.value);
      label.textContent = val + unit;
      if (numInput) numInput.value = val;
      if (simulatorInstance) {
        simulatorInstance.updateParams({ [paramKey]: val });
        if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.updateLiveTelemetry === 'function') {
          window.TelemetryMathInspector.updateLiveTelemetry('projectile', simulatorInstance.state || {}, simulatorInstance.params || {});
        }
      }
    });

    if (numInput) {
      numInput.addEventListener('input', (e) => {
        const val = parser(e.target.value);
        if (!isNaN(val)) {
          slider.value = val;
          label.textContent = val + unit;
          if (simulatorInstance) {
            simulatorInstance.updateParams({ [paramKey]: val });
            if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.updateLiveTelemetry === 'function') {
              window.TelemetryMathInspector.updateLiveTelemetry('projectile', simulatorInstance.state || {}, simulatorInstance.params || {});
            }
          }
        }
      });
    }
  }

  function updateTelemetryUI(state, simData) {
    if (!state) return;

    if (simulatorInstance && simulatorInstance.subMode === 'rocket_equation') {
      const s = simulatorInstance.state || state;
      if (s) {
        setText('telem-rocket-m', Math.round(s.mass || 0).toLocaleString() + ' kg');
        setText('telem-rocket-v', ((s.v || 0) / 1000).toFixed(2) + ' km/s');
        setText('telem-rocket-deltav', ((s.deltaV || 0) / 1000).toFixed(2) + ' km/s');
        setText('telem-rocket-t', (s.t || 0).toFixed(1) + ' s');
        setText('telem-rocket-fuel', Math.round(s.fuel || 0).toLocaleString() + ' kg');
        const m0 = (simulatorInstance.rocketParams && (simulatorInstance.rocketParams.initialMassM0 || simulatorInstance.rocketParams.m0)) || 12000;
        const mf = (simulatorInstance.rocketParams && (simulatorInstance.rocketParams.dryMassMf || simulatorInstance.rocketParams.mf)) || 1200;
        const rm = m0 / mf;
        setText('telem-rocket-rm', rm.toFixed(1));
      }
      return;
    }

    if (state.speed !== undefined) {
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

    if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.updateLiveTelemetry === 'function') {
      const params = simulatorInstance ? (simulatorInstance.params || {}) : {};
      window.TelemetryMathInspector.updateLiveTelemetry('projectile', state, params);
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
    const numInput = document.getElementById(inputId.replace('slider-', 'input-'));
    if (input) input.value = value;
    if (label) label.textContent = value + unit;
    if (numInput) numInput.value = value;
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

    // Submode switching: Kinematics vs Divergence Theorem
    const submodeContainer = document.querySelector('#sim-container-vehicle .submode-selector-bar');
    if (submodeContainer) {
      const subBtns = submodeContainer.querySelectorAll('.submode-btn');
      subBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const sm = btn.dataset.submode;
          subBtns.forEach(b => b.classList.toggle('active', b === btn));
          if (vehicleSimulatorInstance) {
            vehicleSimulatorInstance.setSubMode(sm);
          }
          const kControls = document.getElementById('group-veh-kinematics-controls');
          const dControls = document.getElementById('group-veh-divergence-controls');
          const panelTitle = document.getElementById('title-veh-panel');
          if (sm === 'vector_field_divergence') {
            if (kControls) kControls.style.display = 'none';
            if (dControls) dControls.style.display = 'block';
            if (panelTitle) panelTitle.textContent = 'พารามิเตอร์สนามเวกเตอร์และทฤษฎีบทการลู่ออก';
          } else {
            if (kControls) kControls.style.display = 'block';
            if (dControls) dControls.style.display = 'none';
            if (panelTitle) panelTitle.textContent = 'พารามิเตอร์การขับขี่และสนามลม';
          }
        });
      });
    }

    // Divergence Controls
    const selDivField = document.getElementById('div-field-type');
    if (selDivField) {
      selDivField.addEventListener('change', (e) => {
        if (vehicleSimulatorInstance) {
          vehicleSimulatorInstance.setDivergenceParams({ fieldType: e.target.value });
        }
      });
    }

    const sDivStrength = document.getElementById('div-slider-strength');
    const nDivStrength = document.getElementById('div-num-strength');
    if (sDivStrength && nDivStrength) {
      const syncStrength = (val) => {
        val = parseFloat(val);
        sDivStrength.value = val;
        nDivStrength.value = val;
        if (vehicleSimulatorInstance) {
          vehicleSimulatorInstance.setDivergenceParams({ fieldStrength: val });
        }
      };
      sDivStrength.addEventListener('input', (e) => syncStrength(e.target.value));
      nDivStrength.addEventListener('input', (e) => syncStrength(e.target.value));
    }

    const selDivShape = document.getElementById('div-contour-shape');
    if (selDivShape) {
      selDivShape.addEventListener('change', (e) => {
        if (vehicleSimulatorInstance) {
          vehicleSimulatorInstance.setDivergenceParams({ contourShape: e.target.value });
        }
      });
    }

    const sDivSize = document.getElementById('div-slider-size');
    const nDivSize = document.getElementById('div-num-size');
    if (sDivSize && nDivSize) {
      const syncSize = (val) => {
        val = parseFloat(val);
        sDivSize.value = val;
        nDivSize.value = val;
        if (vehicleSimulatorInstance) {
          vehicleSimulatorInstance.setDivergenceParams({
            contourRadius: val,
            contourWidth: val * 2,
            contourHeight: val * 1.4
          });
        }
      };
      sDivSize.addEventListener('input', (e) => syncSize(e.target.value));
      nDivSize.addEventListener('input', (e) => syncSize(e.target.value));
    }

    // Divergence field preset chips
    const divChips = document.querySelectorAll('#group-veh-divergence-controls .btn-preset-chip');
    divChips.forEach(chip => {
      chip.addEventListener('click', () => {
        divChips.forEach(c => c.classList.toggle('active', c === chip));
        const fType = chip.dataset.type;
        if (selDivField) selDivField.value = fType;
        if (vehicleSimulatorInstance) {
          vehicleSimulatorInstance.setDivergenceParams({ fieldType: fType });
        }
      });
    });
  }

  function updateVehicleTelemetryUI(telem) {
    if (!telem) return;
    if (telem.subMode === 'vector_field_divergence') {
      const lhs = (telem.boundaryFluxLHS !== undefined) ? telem.boundaryFluxLHS : 0;
      const rhs = (telem.areaDivergenceRHS !== undefined) ? telem.areaDivergenceRHS : 0;
      const err = (telem.discrepancyErrorPct !== undefined) ? telem.discrepancyErrorPct : 0;
      const divC = (telem.localDivAtCenter !== undefined) ? telem.localDivAtCenter : 0;
      const curlC = (telem.localCurlAtCenter !== undefined) ? telem.localCurlAtCenter : 0;

      // Update dedicated divergence readouts
      setText('div-readout-lhs', (lhs >= 0 ? '+' : '') + lhs.toFixed(2) + ' Wb');
      setText('div-readout-rhs', (rhs >= 0 ? '+' : '') + rhs.toFixed(2) + ' Wb');
      setText('div-readout-error', err.toFixed(3) + '% (' + (err < 2.0 ? 'ตรงกันสมบูรณ์' : 'คลาดเคลื่อนน้อย') + ')');

      // Update grid telemetry boxes
      setText('telem-veh-s', '∮ (F·n̂)ds = ' + lhs.toFixed(2));
      setText('telem-veh-dr', '∬ (∇·F)dA = ' + rhs.toFixed(2));
      setText('telem-veh-vcar', '∇·F(c) = ' + divC.toFixed(2));
      setText('telem-veh-vwind', '(∇×F)_z = ' + curlC.toFixed(2));
      setText('telem-veh-vrel', 'Err: ' + err.toFixed(2) + '%');
      setText('telem-veh-drag', 'ขอบเขต: ' + (telem.contourShape === 'circle' ? 'วงกลม' : 'สี่เหลี่ยม'));
      const cx = telem.contourCenterX !== undefined ? Math.round(telem.contourCenterX) : 200;
      const cy = telem.contourCenterY !== undefined ? Math.round(telem.contourCenterY) : 150;
      setText('telem-veh-heading', 'จุดศูนย์กลาง (' + cx + ', ' + cy + ')');
      setText('telem-veh-alat', err < 1.0 ? 'Exact Match ✅' : 'Normal');
      return;
    }

    setText('telem-veh-s', telem.odometer.toFixed(2) + ' m');
    setText('telem-veh-dr', telem.displacement.toFixed(2) + ' m');
    setText('telem-veh-vcar', telem.vCar.toFixed(1) + ' m/s');
    setText('telem-veh-vwind', telem.vWind.toFixed(1) + ' m/s');
    setText('telem-veh-vrel', telem.vRel.toFixed(2) + ' m/s');
    setText('telem-veh-drag', telem.dragForce.toFixed(1) + ' N');
    setText('telem-veh-heading', telem.headingDeg.toFixed(1) + '°');
    setText('telem-veh-alat', telem.lateralAcc.toFixed(2) + ' m/s²');

    if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.updateLiveTelemetry === 'function') {
      window.TelemetryMathInspector.updateLiveTelemetry('vehicle', telem, {
        vCar: telem.vCar,
        vWind: telem.vWind,
        vRel: telem.vRel,
        windAngleDeg: telem.windAngleDeg
      });
    }
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

    if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.updateLiveTelemetry === 'function') {
      window.TelemetryMathInspector.updateLiveTelemetry('collision', telem, {
        m1: collisionSimulatorInstance ? collisionSimulatorInstance.params.m1 : 3.0,
        m2: collisionSimulatorInstance ? collisionSimulatorInstance.params.m2 : 5.0
      });
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

  // ======================================================================
  // CHAPTER 02 CIRCULAR SIMULATOR CONTROLLER
  // ======================================================================
  function initCircularSimulator() {
    const canvas = document.getElementById('circular-canvas');
    if (!canvas || !window.CircularMotionSimulator) return;

    circularSimulatorInstance = new window.CircularMotionSimulator(canvas, {
      onTelemetryUpdate: updateCircularTelemetryUI
    });

    window.circularSimulatorInstance = circularSimulatorInstance;
    setupCircularSimulatorControls();
    circularSimulatorInstance.render();
  }

  function setupCircularSimulatorControls() {
    const btnPlay = document.getElementById('btn-circ-play');
    const btnPause = document.getElementById('btn-circ-pause');
    const btnStep = document.getElementById('btn-circ-step');
    const btnReset = document.getElementById('btn-circ-reset');

    if (btnPlay) btnPlay.addEventListener('click', () => {
      if (circularSimulatorInstance) {
        circularSimulatorInstance.play();
        btnPlay.disabled = true;
        if (btnPause) btnPause.disabled = false;
      }
    });

    if (btnPause) btnPause.addEventListener('click', () => {
      if (circularSimulatorInstance) {
        circularSimulatorInstance.pause();
        if (btnPlay) btnPlay.disabled = false;
        btnPause.disabled = true;
      }
    });

    if (btnStep) btnStep.addEventListener('click', () => {
      if (circularSimulatorInstance) {
        circularSimulatorInstance.step(0.05);
        if (btnPlay) btnPlay.disabled = false;
        if (btnPause) btnPause.disabled = true;
      }
    });

    if (btnReset) btnReset.addEventListener('click', () => {
      if (circularSimulatorInstance) {
        circularSimulatorInstance.reset();
        if (btnPlay) btnPlay.disabled = false;
        if (btnPause) btnPause.disabled = true;
      }
    });

    // Submode Buttons
    const submodeBtns = document.querySelectorAll('#sim-container-circular .submode-btn');
    submodeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sm = btn.dataset.submode;
        submodeBtns.forEach(b => b.classList.toggle('active', b === btn));
        if (circularSimulatorInstance) {
          circularSimulatorInstance.setSubMode(sm);
        }

        const bankGroup = document.getElementById('circ-group-bank');
        const frictionGroup = document.getElementById('circ-group-friction');
        const loopGroup = document.getElementById('circ-group-looptype');
        const orbitGroup = document.getElementById('circ-group-orbit');

        if (bankGroup) bankGroup.style.display = (sm === 'banked') ? 'block' : 'none';
        if (frictionGroup) frictionGroup.style.display = (sm === 'banked') ? 'block' : 'none';
        if (loopGroup) loopGroup.style.display = (sm === 'vertical') ? 'block' : 'none';
        if (orbitGroup) orbitGroup.style.display = (sm === 'orbit') ? 'block' : 'none';
      });
    });

    // Vector Toggles
    const toggleMap = [
      { id: 'chk-circ-vel', key: 'showVelocity' },
      { id: 'chk-circ-acc', key: 'showCentripetalAcc' },
      { id: 'chk-circ-forces', key: 'showForces' },
      { id: 'chk-circ-trail', key: 'showTrail' }
    ];
    toggleMap.forEach(t => {
      const chk = document.getElementById(t.id);
      if (chk) {
        chk.addEventListener('change', (e) => {
          if (circularSimulatorInstance) {
            circularSimulatorInstance.setToggle(t.key, e.target.checked);
          }
        });
      }
    });

    // Sliders
    bindCircSlider('circ-slider-radius', 'circ-val-radius', ' m', 1, (val) => {
      if (circularSimulatorInstance) circularSimulatorInstance.setParam('radius', val);
    });

    bindCircSlider('circ-slider-speed', 'circ-val-speed', ' m/s', 1, (val) => {
      if (circularSimulatorInstance) {
        circularSimulatorInstance.setParam('speed', val);
        const label = document.getElementById('circ-val-speed');
        if (label) label.textContent = `${val.toFixed(1)} m/s (${(val * 3.6).toFixed(1)} km/h)`;
      }
    });

    bindCircSlider('circ-slider-bank', 'circ-val-bank', '°', 1, (val) => {
      if (circularSimulatorInstance) circularSimulatorInstance.setParam('bankAngleDeg', val);
    });

    bindCircSlider('circ-slider-friction', 'circ-val-friction', '', 2, (val) => {
      if (circularSimulatorInstance) circularSimulatorInstance.setParam('muStatic', val);
    });

    bindCircSlider('circ-slider-orbit-alt', 'circ-val-orbit-alt', ' km', 0, (val) => {
      if (circularSimulatorInstance) circularSimulatorInstance.setParam('orbitAltitudeKm', val);
      const label = document.getElementById('circ-val-orbit-alt');
      if (label) label.textContent = `${Math.round(val).toLocaleString()} km`;
    });

    // Orbit Preset Chips
    const orbitChips = document.querySelectorAll('#circ-group-orbit .btn-preset-chip');
    orbitChips.forEach(chip => {
      chip.addEventListener('click', () => {
        orbitChips.forEach(c => c.classList.toggle('active', c === chip));
        const alt = parseFloat(chip.dataset.alt);
        const slider = document.getElementById('circ-slider-orbit-alt');
        const label = document.getElementById('circ-val-orbit-alt');
        if (slider) slider.value = alt;
        if (label) label.textContent = `${Math.round(alt).toLocaleString()} km`;
        if (circularSimulatorInstance) circularSimulatorInstance.setParam('orbitAltitudeKm', alt);
      });
    });

    const loopSelect = document.getElementById('circ-select-looptype');
    if (loopSelect) {
      loopSelect.addEventListener('change', (e) => {
        if (circularSimulatorInstance) {
          circularSimulatorInstance.setParam('loopType', e.target.value);
        }
      });
    }
  }

  function bindCircSlider(sliderId, labelId, unit, decimals, onChange) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    if (!slider) return;
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (label) label.textContent = val.toFixed(decimals) + unit;
      onChange(val);
    });
  }

  function updateCircularTelemetryUI(telem) {
    if (!telem) return;
    setText('circ-telem-omega', telem.omega.toFixed(2) + ' rad/s');
    setText('circ-telem-ac', telem.centripetalAcc.toFixed(2) + ' m/s²');
    setText('circ-telem-fc', Math.round(telem.centripetalForce).toLocaleString() + ' N');
    setText('circ-telem-gforce', telem.gForce.toFixed(2) + ' G');
    setText('circ-telem-period', telem.period.toFixed(2) + ' s');
    setText('circ-telem-freq', telem.frequency.toFixed(3) + ' Hz');

    if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.updateLiveTelemetry === 'function') {
      window.TelemetryMathInspector.updateLiveTelemetry('circular', telem, {
        v: circularSimulatorInstance ? circularSimulatorInstance.params.speed : 20.0,
        r: circularSimulatorInstance ? circularSimulatorInstance.params.radius : 50.0,
        m: circularSimulatorInstance ? circularSimulatorInstance.params.mass : 1000.0
      });
    }
  }

  function launchCircularSimulatorPreset(theoryId) {
    switchView('view-simulator');
    if (!circularSimulatorInstance) return;

    let num = 1;
    if (typeof theoryId === 'number') num = theoryId;
    else if (typeof theoryId === 'string') {
      const m = theoryId.match(/\d+$/);
      if (m) num = parseInt(m[0], 10);
    }

    let targetSubMode = 'banked';
    if (num === 1) {
      targetSubMode = 'banked';
      circularSimulatorInstance.setParam('bankAngleDeg', 0);
      circularSimulatorInstance.setParam('radius', 35);
      circularSimulatorInstance.setParam('speed', 15);
    } else if (num === 2) {
      targetSubMode = 'banked';
      circularSimulatorInstance.setParam('bankAngleDeg', 10);
      circularSimulatorInstance.setParam('radius', 40);
      circularSimulatorInstance.setParam('speed', 20);
    } else if (num === 3) {
      targetSubMode = 'banked';
      circularSimulatorInstance.setParam('bankAngleDeg', 14);
      circularSimulatorInstance.setParam('radius', 60);
      circularSimulatorInstance.setParam('speed', 22);
      circularSimulatorInstance.setParam('muStatic', 0.35);
    } else if (num === 4) {
      targetSubMode = 'vertical';
      circularSimulatorInstance.setParam('radius', 20);
      circularSimulatorInstance.setParam('speed', 24);
      circularSimulatorInstance.setParam('loopType', 'clothoid');
    } else if (num === 5) {
      targetSubMode = 'orbit';
      circularSimulatorInstance.setParam('orbitAltitudeKm', 35786);
    }

    circularSimulatorInstance.reset();
    switchSimMode('circular', targetSubMode);
  }

  // ======================================================================
  // CHAPTER 03 OSCILLATION SIMULATOR CONTROLLER
  // ======================================================================
  function initOscillationSimulator() {
    const canvas = document.getElementById('oscillation-canvas');
    if (!canvas || !window.OscillationSimulator) return;

    oscillationSimulatorInstance = new window.OscillationSimulator(canvas, {
      onTelemetryUpdate: updateOscillationTelemetryUI
    });

    window.oscillationSimulatorInstance = oscillationSimulatorInstance;
    setupOscillationSimulatorControls();
    oscillationSimulatorInstance.render();
  }

  function setupOscillationSimulatorControls() {
    const btnPlay = document.getElementById('btn-osc-play');
    const btnPause = document.getElementById('btn-osc-pause');
    const btnStep = document.getElementById('btn-osc-step');
    const btnReset = document.getElementById('btn-osc-reset');

    if (btnPlay) btnPlay.addEventListener('click', () => {
      if (oscillationSimulatorInstance) {
        oscillationSimulatorInstance.play();
        btnPlay.disabled = true;
        if (btnPause) btnPause.disabled = false;
      }
    });

    if (btnPause) btnPause.addEventListener('click', () => {
      if (oscillationSimulatorInstance) {
        oscillationSimulatorInstance.pause();
        if (btnPlay) btnPlay.disabled = false;
        btnPause.disabled = true;
      }
    });

    if (btnStep) btnStep.addEventListener('click', () => {
      if (oscillationSimulatorInstance) {
        oscillationSimulatorInstance.step(0.02);
        if (btnPlay) btnPlay.disabled = false;
        if (btnPause) btnPause.disabled = true;
      }
    });

    if (btnReset) btnReset.addEventListener('click', () => {
      if (oscillationSimulatorInstance) {
        oscillationSimulatorInstance.reset();
        if (btnPlay) btnPlay.disabled = false;
        if (btnPause) btnPause.disabled = true;
      }
    });

    // Submode Buttons
    const submodeContainer = document.querySelector('#sim-container-oscillation .submode-selector-bar');
    if (submodeContainer) {
      const subBtns = submodeContainer.querySelectorAll('.submode-btn');
      subBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const sm = btn.dataset.submode;
          subBtns.forEach(b => b.classList.toggle('active', b === btn));
          if (oscillationSimulatorInstance) {
            oscillationSimulatorInstance.setSubMode(sm);
          }

          // Toggle parameter slider groups based on submode
          const kGroup = document.getElementById('group-osc-k');
          const ampGroup = document.getElementById('group-osc-amp');
          const lenGroup = document.getElementById('group-osc-length');
          const angGroup = document.getElementById('group-osc-angle');
          const dampGroup = document.getElementById('group-osc-damping');
          const wGroup = document.getElementById('group-osc-omega');
          const f0Group = document.getElementById('group-osc-f0');
          const dpGroup = document.getElementById('group-osc-double-pendulum');

          if (sm === 'spring') {
            if (kGroup) kGroup.style.display = 'block';
            if (ampGroup) ampGroup.style.display = 'block';
            if (lenGroup) lenGroup.style.display = 'none';
            if (angGroup) angGroup.style.display = 'none';
            if (dampGroup) dampGroup.style.display = 'none';
            if (wGroup) wGroup.style.display = 'none';
            if (f0Group) f0Group.style.display = 'none';
            if (dpGroup) dpGroup.style.display = 'none';
          } else if (sm === 'pendulum') {
            if (kGroup) kGroup.style.display = 'none';
            if (ampGroup) ampGroup.style.display = 'none';
            if (lenGroup) lenGroup.style.display = 'block';
            if (angGroup) angGroup.style.display = 'block';
            if (dampGroup) dampGroup.style.display = 'none';
            if (wGroup) wGroup.style.display = 'none';
            if (f0Group) f0Group.style.display = 'none';
            if (dpGroup) dpGroup.style.display = 'none';
          } else if (sm === 'damping_resonance') {
            if (kGroup) kGroup.style.display = 'block';
            if (ampGroup) ampGroup.style.display = 'none';
            if (lenGroup) lenGroup.style.display = 'none';
            if (angGroup) angGroup.style.display = 'none';
            if (dampGroup) dampGroup.style.display = 'block';
            if (wGroup) wGroup.style.display = 'block';
            if (f0Group) f0Group.style.display = 'block';
            if (dpGroup) dpGroup.style.display = 'none';
          } else if (sm === 'double_pendulum') {
            if (kGroup) kGroup.style.display = 'none';
            if (ampGroup) ampGroup.style.display = 'none';
            if (lenGroup) lenGroup.style.display = 'none';
            if (angGroup) angGroup.style.display = 'none';
            if (dampGroup) dampGroup.style.display = 'none';
            if (wGroup) wGroup.style.display = 'none';
            if (f0Group) f0Group.style.display = 'none';
            if (dpGroup) dpGroup.style.display = 'block';
          } else if (sm === 'rotating_hoop') {
            if (kGroup) kGroup.style.display = 'none';
            if (ampGroup) ampGroup.style.display = 'none';
            if (lenGroup) lenGroup.style.display = 'none';
            if (angGroup) angGroup.style.display = 'none';
            if (dampGroup) dampGroup.style.display = 'none';
            if (wGroup) wGroup.style.display = 'none';
            if (f0Group) f0Group.style.display = 'none';
            if (dpGroup) dpGroup.style.display = 'none';
          }

          const massGroup = document.getElementById('group-osc-shared-mass');
          const hoopGroup = document.getElementById('group-osc-rotating-hoop');
          const isHoop = (sm === 'rotating_hoop');
          if (massGroup) massGroup.style.display = isHoop ? 'none' : 'block';
          if (hoopGroup) hoopGroup.style.display = isHoop ? 'block' : 'none';
        });
      });
    }

    // Visual Toggles
    const toggleMap = [
      { id: 'chk-osc-vel', key: 'showVelocity' },
      { id: 'chk-osc-acc', key: 'showAcceleration' },
      { id: 'chk-osc-forces', key: 'showForces' },
      { id: 'chk-osc-energy', key: 'showEnergy' },
      { id: 'chk-osc-phase', key: 'showPhaseSpace' },
      { id: 'chk-osc-ghost', key: 'showNonlinearGhost' }
    ];
    toggleMap.forEach(t => {
      const chk = document.getElementById(t.id);
      if (chk) {
        chk.addEventListener('change', (e) => {
          if (oscillationSimulatorInstance) {
            oscillationSimulatorInstance.setToggle(t.key, e.target.checked);
          }
        });
      }
    });

    // Sliders
    bindOscSlider('osc-slider-mass', 'osc-val-mass', ' kg', 1, (val) => {
      if (oscillationSimulatorInstance) {
        oscillationSimulatorInstance.setParam('mass', val);
        oscillationSimulatorInstance.setParam('pendulumMass', val);
      }
    });

    bindOscSlider('osc-slider-k', 'osc-val-k', ' N/m', 0, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('springK', val);
    });

    bindOscSlider('osc-slider-amp', 'osc-val-amp', ' m', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('amplitude', val);
    });

    bindOscSlider('osc-slider-length', 'osc-val-length', ' m', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('length', val);
    });

    bindOscSlider('osc-slider-angle', 'osc-val-angle', '°', 1, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('initialAngleDeg', val);
    });

    bindOscSlider('osc-slider-damping', 'osc-val-damping', ' N·s/m', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('dampingB', val);
    });

    bindOscSlider('osc-slider-omega', 'osc-val-omega', ' rad/s', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('drivingOmega', val);
    });

    bindOscSlider('osc-slider-f0', 'osc-val-f0', ' N', 1, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('drivingForceF0', val);
    });

    // Double Pendulum Sliders
    bindOscSlider('osc-slider-dp-th1', 'osc-val-dp-th1', '°', 1, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('dpTheta1Deg', val);
    });

    bindOscSlider('osc-slider-dp-th2', 'osc-val-dp-th2', '°', 1, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('dpTheta2Deg', val);
    });

    bindOscSlider('osc-slider-dp-l1', 'osc-val-dp-l1', ' m', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('dpL1', val);
    });

    bindOscSlider('osc-slider-dp-l2', 'osc-val-dp-l2', ' m', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('dpL2', val);
    });

    bindOscSlider('osc-slider-dp-m1', 'osc-val-dp-m1', ' kg', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('dpM1', val);
    });

    bindOscSlider('osc-slider-dp-m2', 'osc-val-dp-m2', ' kg', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('dpM2', val);
    });

    // Rotating Hoop Sliders
    bindOscSlider('osc-slider-hoop-r', 'osc-val-hoop-r', ' m', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('hoopRadiusR', val);
    });
    bindOscSlider('osc-slider-hoop-omega', 'osc-val-hoop-omega', ' rad/s', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('hoopOmega', val);
    });
    bindOscSlider('osc-slider-hoop-g', 'osc-val-hoop-g', ' m/s²', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('hoopGravity', val);
    });
    bindOscSlider('osc-slider-hoop-gamma', 'osc-val-hoop-gamma', '', 2, (val) => {
      if (oscillationSimulatorInstance) oscillationSimulatorInstance.setParam('hoopDamping', val);
    });
    bindOscSlider('osc-slider-hoop-th0', 'osc-val-hoop-th0', '°', 1, (val) => {
      if (oscillationSimulatorInstance) {
        oscillationSimulatorInstance.setParam('hoopTheta0Deg', val);
        oscillationSimulatorInstance.setParam('hoopTheta0', val * Math.PI / 180);
      }
    });

    // Double Pendulum Preset Chips
    const dpChips = document.querySelectorAll('#group-osc-double-pendulum .btn-preset-chip');
    dpChips.forEach(chip => {
      chip.addEventListener('click', () => {
        dpChips.forEach(c => c.classList.toggle('active', c === chip));
        const th1 = parseFloat(chip.dataset.dpTh1);
        const th2 = parseFloat(chip.dataset.dpTh2);
        const s1 = document.getElementById('osc-slider-dp-th1');
        const s2 = document.getElementById('osc-slider-dp-th2');
        const l1 = document.getElementById('osc-val-dp-th1');
        const l2 = document.getElementById('osc-val-dp-th2');
        if (s1) s1.value = th1;
        if (s2) s2.value = th2;
        if (l1) l1.textContent = `${th1.toFixed(1)}°`;
        if (l2) l2.textContent = `${th2.toFixed(1)}°`;
        if (oscillationSimulatorInstance) {
          oscillationSimulatorInstance.setParam('dpTheta1Deg', th1);
          oscillationSimulatorInstance.setParam('dpTheta2Deg', th2);
        }
      });
    });
  }

  function bindOscSlider(sliderId, labelId, unit, decimals, onChange) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    if (!slider) return;
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (label) label.textContent = val.toFixed(decimals) + unit;
      onChange(val);
    });
  }

  function updateOscillationTelemetryUI(telem) {
    if (!telem) return;
    const isPendulum = (telem.subMode === 'pendulum');
    const isDoublePendulum = (telem.subMode === 'double_pendulum');
    if (isDoublePendulum) {
      setText('osc-telem-pos', telem.position);
      setText('osc-telem-vel', telem.velocity);
      setText('osc-telem-acc', telem.acceleration);
    } else {
      setText('osc-telem-pos', (typeof telem.position === 'number' ? ((telem.position >= 0 ? '+' : '') + telem.position.toFixed(2) + (isPendulum ? '°' : ' m')) : telem.position));
      setText('osc-telem-vel', typeof telem.velocity === 'number' ? (telem.velocity.toFixed(2) + ' m/s') : telem.velocity);
      setText('osc-telem-acc', typeof telem.acceleration === 'number' ? (telem.acceleration.toFixed(2) + ' m/s²') : telem.acceleration);
    }
    setText('osc-telem-omega0', telem.omega0.toFixed(2) + ' rad/s');
    setText('osc-telem-period', telem.period > 0 ? telem.period.toFixed(2) + ' s' : '—');
    setText('osc-telem-freq', telem.frequency > 0 ? telem.frequency.toFixed(3) + ' Hz' : '—');
    setText('osc-telem-energy', telem.totalEnergy.toFixed(2) + ' J');
    setText('osc-telem-q', isFinite(telem.qualityFactor) ? `Q = ${telem.qualityFactor.toFixed(1)}` : 'Q = ∞');
    setText('osc-telem-regime', telem.regime);

    if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.updateLiveTelemetry === 'function') {
      window.TelemetryMathInspector.updateLiveTelemetry('oscillation', telem, {
        k: oscillationSimulatorInstance ? oscillationSimulatorInstance.params.springK : 25.0,
        m: oscillationSimulatorInstance ? oscillationSimulatorInstance.params.mass : 1.0,
        omega0: telem.omega0
      });
    }
  }

  function launchOscillationSimulatorPreset(theoryId) {
    switchView('view-simulator');
    if (!oscillationSimulatorInstance) return;

    let num = 1;
    if (typeof theoryId === 'number') num = theoryId;
    else if (typeof theoryId === 'string') {
      const match = theoryId.match(/\d+$/);
      if (match) num = parseInt(match[0], 10);
    }

    let targetSubMode = 'spring';
    if (num === 1) {
      // Hooke's Law & Horizontal Spring
      targetSubMode = 'spring';
      oscillationSimulatorInstance.setParam('mass', 2.0);
      oscillationSimulatorInstance.setParam('springK', 50.0);
      oscillationSimulatorInstance.setParam('amplitude', 1.0);
    } else if (num === 2) {
      // Simple Pendulum
      targetSubMode = 'pendulum';
      oscillationSimulatorInstance.setParam('length', 1.5);
      oscillationSimulatorInstance.setParam('initialAngleDeg', 20.0);
    } else if (num === 3) {
      // Energy Conservation
      targetSubMode = 'spring';
      oscillationSimulatorInstance.setParam('mass', 1.5);
      oscillationSimulatorInstance.setParam('springK', 80.0);
      oscillationSimulatorInstance.setParam('amplitude', 1.4);
    } else if (num === 4) {
      // Damped Oscillation
      targetSubMode = 'damping_resonance';
      oscillationSimulatorInstance.setParam('mass', 2.0);
      oscillationSimulatorInstance.setParam('springK', 50.0);
      oscillationSimulatorInstance.setParam('dampingB', 0.8);
      oscillationSimulatorInstance.setParam('isDriven', false);
    } else if (num === 5) {
      // Driven Resonance
      targetSubMode = 'damping_resonance';
      oscillationSimulatorInstance.setParam('mass', 2.0);
      oscillationSimulatorInstance.setParam('springK', 50.0);
      oscillationSimulatorInstance.setParam('dampingB', 0.5);
      oscillationSimulatorInstance.setParam('isDriven', true);
      oscillationSimulatorInstance.setParam('drivingOmega', 5.0);
      oscillationSimulatorInstance.setParam('drivingForceF0', 12.0);
    }

    oscillationSimulatorInstance.reset();
    switchSimMode('oscillation', targetSubMode);
  }

  // ======================================================================
  // CHAPTER 04 WAVE SIMULATOR CONTROLLER
  // ======================================================================
  function initWaveSimulator() {
    const canvas = document.getElementById('wave-canvas');
    if (!canvas || !window.WaveSimulator) return;

    waveSimulatorInstance = new window.WaveSimulator(canvas, {
      onTelemetryUpdate: updateWaveTelemetryUI
    });

    window.waveSimulatorInstance = waveSimulatorInstance;
    setupWaveSimulatorControls();
    waveSimulatorInstance.render();
  }

  function setupWaveSimulatorControls() {
    const btnPlay = document.getElementById('btn-wave-play');
    const btnPause = document.getElementById('btn-wave-pause');
    const btnStep = document.getElementById('btn-wave-step');
    const btnReset = document.getElementById('btn-wave-reset');

    if (btnPlay) btnPlay.addEventListener('click', () => {
      if (waveSimulatorInstance) {
        waveSimulatorInstance.play();
        btnPlay.disabled = true;
        if (btnPause) btnPause.disabled = false;
      }
    });

    if (btnPause) btnPause.addEventListener('click', () => {
      if (waveSimulatorInstance) {
        waveSimulatorInstance.pause();
        if (btnPlay) btnPlay.disabled = false;
        btnPause.disabled = true;
      }
    });

    if (btnStep) btnStep.addEventListener('click', () => {
      if (waveSimulatorInstance) {
        waveSimulatorInstance.step(0.03);
        if (btnPlay) btnPlay.disabled = false;
        if (btnPause) btnPause.disabled = true;
      }
    });

    if (btnReset) btnReset.addEventListener('click', () => {
      if (waveSimulatorInstance) {
        waveSimulatorInstance.reset();
        if (btnPlay) btnPlay.disabled = false;
        if (btnPause) btnPause.disabled = true;
      }
    });

    // Submode Buttons
    const submodeContainer = document.querySelector('#sim-container-wave .submode-selector-bar');
    if (submodeContainer) {
      const subBtns = submodeContainer.querySelectorAll('.submode-btn');
      subBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const sm = btn.dataset.submode;
          subBtns.forEach(b => b.classList.toggle('active', b === btn));
          if (waveSimulatorInstance) {
            waveSimulatorInstance.setSubMode(sm);
          }

          // Toggle controls visibility
          const nGroup = document.getElementById('group-wave-n');
          const f1Group = document.getElementById('group-wave-f1');
          const f2Group = document.getElementById('group-wave-f2');
          const freqGroup = document.getElementById('group-wave-freq');
          const tenGroup = document.getElementById('group-wave-tension');
          const denGroup = document.getElementById('group-wave-density');
          const ampGroup = document.getElementById('group-wave-amp');
          const waterGroup = document.getElementById('group-wave-water');
          const lightGroup = document.getElementById('group-wave-light');
          const polGroup = document.getElementById('group-wave-polarization');
          const opticsGroup = document.getElementById('group-wave-optics');
          const fourierGroup = document.getElementById('group-wave-fourier');

          const isTraveling = (sm === 'traveling');
          const isStanding = (sm === 'standing');
          const isBeats = (sm === 'interference_beats');
          const isWater = (sm === 'water_waves');
          const isLight = (sm === 'light_waves');
          const isPol = (sm === 'polarization');
          const isOptics = (sm === 'geometric_optics');
          const isFourier = (sm === 'fourier_synthesis');

          if (ampGroup) ampGroup.style.display = (isTraveling || isStanding) ? 'block' : 'none';
          if (freqGroup) freqGroup.style.display = isTraveling ? 'block' : 'none';
          if (tenGroup) tenGroup.style.display = (isTraveling || isStanding) ? 'block' : 'none';
          if (denGroup) denGroup.style.display = (isTraveling || isStanding) ? 'block' : 'none';
          if (nGroup) nGroup.style.display = isStanding ? 'block' : 'none';
          if (f1Group) f1Group.style.display = isBeats ? 'block' : 'none';
          if (f2Group) f2Group.style.display = isBeats ? 'block' : 'none';
          if (waterGroup) waterGroup.style.display = isWater ? 'block' : 'none';
          if (lightGroup) lightGroup.style.display = isLight ? 'block' : 'none';
          if (polGroup) polGroup.style.display = isPol ? 'block' : 'none';
          if (opticsGroup) opticsGroup.style.display = isOptics ? 'block' : 'none';
          if (fourierGroup) fourierGroup.style.display = isFourier ? 'block' : 'none';
        });
      });
    }

    // Toggles
    const toggleMap = [
      { id: 'chk-wave-particles', key: 'showParticles' },
      { id: 'chk-wave-vel', key: 'showVelocityVectors' },
      { id: 'chk-wave-decomp', key: 'showDecomposition' },
      { id: 'chk-wave-env', key: 'showEnvelope' },
      { id: 'chk-wave-nodes', key: 'showNodesAntinodes' },
      { id: 'chk-wave-calipers', key: 'showCalipers' }
    ];
    toggleMap.forEach(t => {
      const chk = document.getElementById(t.id);
      if (chk) {
        chk.addEventListener('change', (e) => {
          if (waveSimulatorInstance) {
            waveSimulatorInstance.setToggle(t.key, e.target.checked);
          }
        });
      }
    });

    // Sliders
    bindWaveSlider('wave-slider-amp', 'wave-val-amp', ' m', 2, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('amplitude', val);
    });

    bindWaveSlider('wave-slider-freq', 'wave-val-freq', ' Hz', 2, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('frequency', val);
    });

    bindWaveSlider('wave-slider-tension', 'wave-val-tension', ' N', 0, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('tension', val);
    });

    bindWaveSlider('wave-slider-density', 'wave-val-density', ' kg/m', 2, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('linearDensity', val);
    });

    bindWaveSlider('wave-slider-n', 'wave-val-n', '', 0, (val) => {
      const label = document.getElementById('wave-val-n');
      if (label) label.textContent = 'n = ' + Math.round(val);
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('harmonicN', Math.round(val));
    });

    bindWaveSlider('wave-slider-f1', 'wave-val-f1', ' Hz', 2, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('freq1', val);
    });

    bindWaveSlider('wave-slider-f2', 'wave-val-f2', ' Hz', 2, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('freq2', val);
    });

    // 4. Water Wave Controls
    bindWaveSlider('wave-slider-water-depth', 'wave-val-water-depth', ' m', 1, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('waterDepth', val);
    });
    bindWaveSlider('wave-slider-water-height', 'wave-val-water-height', ' m', 2, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('waterHeight', val);
    });
    bindWaveSlider('wave-slider-water-wl', 'wave-val-water-wl', ' m', 1, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('waterWavelength', val);
    });

    const waterChips = document.querySelectorAll('.water-presets-row .btn-preset-chip');
    waterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        waterChips.forEach(c => c.classList.toggle('active', c === chip));
        const depth = parseFloat(chip.dataset.depth);
        const wl = parseFloat(chip.dataset.wl);
        const h = parseFloat(chip.dataset.h);

        const sDepth = document.getElementById('wave-slider-water-depth');
        const sWl = document.getElementById('wave-slider-water-wl');
        const sH = document.getElementById('wave-slider-water-height');
        const lDepth = document.getElementById('wave-val-water-depth');
        const lWl = document.getElementById('wave-val-water-wl');
        const lH = document.getElementById('wave-val-water-height');

        if (sDepth) sDepth.value = depth;
        if (sWl) sWl.value = wl;
        if (sH) sH.value = h;
        if (lDepth) lDepth.textContent = depth.toFixed(1) + ' m';
        if (lWl) lWl.textContent = wl.toFixed(1) + ' m';
        if (lH) lH.textContent = h.toFixed(2) + ' m';

        if (waveSimulatorInstance) {
          waveSimulatorInstance.setParam('waterDepth', depth);
          waveSimulatorInstance.setParam('waterWavelength', wl);
          waveSimulatorInstance.setParam('waterHeight', h);
        }
      });
    });

    // 5. Light Waves & Spectrum Controls
    function getLightInfo(wl) {
      let r = 0, g = 0, b = 0;
      if (wl >= 380 && wl < 440) {
        r = -(wl - 440) / (440 - 380);
        g = 0;
        b = 1;
      } else if (wl >= 440 && wl < 490) {
        r = 0;
        g = (wl - 440) / (490 - 440);
        b = 1;
      } else if (wl >= 490 && wl < 510) {
        r = 0;
        g = 1;
        b = -(wl - 510) / (510 - 490);
      } else if (wl >= 510 && wl < 580) {
        r = (wl - 510) / (580 - 510);
        g = 1;
        b = 0;
      } else if (wl >= 580 && wl < 645) {
        r = 1;
        g = -(wl - 645) / (645 - 580);
        b = 0;
      } else if (wl >= 645 && wl <= 750) {
        r = 1;
        g = 0;
        b = 0;
      }
      let factor = 1.0;
      if (wl < 420) factor = 0.3 + 0.7 * (wl - 380) / (420 - 380);
      else if (wl > 700) factor = 0.3 + 0.7 * (750 - wl) / (750 - 700);

      const gamma = 0.8;
      const R = Math.round(255 * Math.pow(Math.max(0, r * factor), gamma));
      const G = Math.round(255 * Math.pow(Math.max(0, g * factor), gamma));
      const B = Math.round(255 * Math.pow(Math.max(0, b * factor), gamma));
      const hex = '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);

      let name = 'สีม่วง (Violet)';
      if (wl >= 440 && wl < 485) name = 'สีน้ำเงิน (Blue)';
      else if (wl >= 485 && wl < 500) name = 'สีฟ้า/คราม (Cyan)';
      else if (wl >= 500 && wl < 565) name = 'สีเขียว (Green)';
      else if (wl >= 565 && wl < 590) name = 'สีเหลือง (Yellow)';
      else if (wl >= 590 && wl < 625) name = 'สีส้ม (Orange)';
      else if (wl >= 625) name = 'สีแดง (Red)';

      const c = 299792458;
      const h_eV = 4.135667696e-15;
      const h_J = 6.62607015e-34;
      const freq_Hz = c / (wl * 1e-9);
      const freq_THz = freq_Hz * 1e-12;
      const energy_eV = h_eV * freq_Hz;
      const energy_J = h_J * freq_Hz;

      return { hex, name, freq_THz, energy_eV, energy_J };
    }

    function syncLightColorDisplay(wl) {
      const info = getLightInfo(wl);
      const valLabel = document.getElementById('wave-val-light-wl');
      const swatch = document.getElementById('light-color-swatch');
      const name = document.getElementById('light-color-name');
      const fReadout = document.getElementById('light-readout-freq');
      const eReadout = document.getElementById('light-readout-energy');

      if (valLabel) valLabel.textContent = `${Math.round(wl)} nm (${info.name})`;
      if (swatch) swatch.style.background = info.hex;
      if (name) {
        name.textContent = `${info.name} (${Math.round(wl)} nm)`;
        name.style.color = info.hex;
      }
      if (fReadout) fReadout.textContent = `${info.freq_THz.toFixed(1)} THz`;
      if (eReadout) eReadout.textContent = `${info.energy_eV.toFixed(2)} eV (${info.energy_J.toExponential(2)} J)`;
    }

    const sLightWl = document.getElementById('wave-slider-light-wl');
    if (sLightWl) {
      sLightWl.addEventListener('input', (e) => {
        const wl = parseFloat(e.target.value);
        syncLightColorDisplay(wl);
        if (waveSimulatorInstance) waveSimulatorInstance.setParam('lightWavelength', wl);
      });
    }

    const lightChips = document.querySelectorAll('.light-presets-row .btn-preset-chip');
    lightChips.forEach(chip => {
      chip.addEventListener('click', () => {
        lightChips.forEach(c => c.classList.toggle('active', c === chip));
        const wl = parseFloat(chip.dataset.wl);
        if (sLightWl) {
          sLightWl.value = wl;
          sLightWl.dispatchEvent(new Event('input', { bubbles: true }));
        }
        syncLightColorDisplay(wl);
        if (waveSimulatorInstance) waveSimulatorInstance.setParam('lightWavelength', wl);
      });
    });

    const btnCrosslinkEM = document.getElementById('btn-crosslink-em');
    if (btnCrosslinkEM) {
      btnCrosslinkEM.addEventListener('click', () => {
        switchSimMode('em', 'field_charges');
        const emTab = document.querySelector(`.sim-mode-btn[data-sim-mode="em"]`);
        if (emTab) emTab.click();
      });
    }

    // 6. Wave Polarization Controls
    bindWaveSlider('wave-slider-pol-th1', 'wave-val-pol-th1', '°', 1, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('polTheta1', val);
    });
    bindWaveSlider('wave-slider-pol-th2', 'wave-val-pol-th2', '°', 1, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('polTheta2', val);
    });

    const polChips = document.querySelectorAll('.pol-presets-row .btn-preset-chip');
    polChips.forEach(chip => {
      chip.addEventListener('click', () => {
        polChips.forEach(c => c.classList.toggle('active', c === chip));
        const th1 = parseFloat(chip.dataset.th1);
        const th2 = parseFloat(chip.dataset.th2);

        const sTh1 = document.getElementById('wave-slider-pol-th1');
        const sTh2 = document.getElementById('wave-slider-pol-th2');
        const lTh1 = document.getElementById('wave-val-pol-th1');
        const lTh2 = document.getElementById('wave-val-pol-th2');

        if (sTh1) {
          sTh1.value = th1;
          sTh1.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (sTh2) {
          sTh2.value = th2;
          sTh2.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (lTh1) lTh1.textContent = th1.toFixed(1) + '°';
        if (lTh2) lTh2.textContent = th2.toFixed(1) + '°';

        if (waveSimulatorInstance) {
          waveSimulatorInstance.setParam('polTheta1', th1);
          waveSimulatorInstance.setParam('polTheta2', th2);
        }
      });
    });

    // 7. Geometric Optics Controls (Curved Mirrors & Thin Lenses)
    const opticsElemSelect = document.getElementById('optics-element-type');
    if (opticsElemSelect) {
      opticsElemSelect.addEventListener('change', (e) => {
        if (waveSimulatorInstance) {
          waveSimulatorInstance.setParam('opticsType', e.target.value);
        }
      });
    }

    bindWaveSlider('optics-slider-focal', 'optics-val-focal', ' cm', 1, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('opticsFocal', val);
    });
    bindWaveSlider('optics-slider-s', 'optics-val-s', ' cm', 1, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('opticsS', val);
    });
    bindWaveSlider('optics-slider-h', 'optics-val-h', ' cm', 1, (val) => {
      if (waveSimulatorInstance) waveSimulatorInstance.setParam('opticsH', val);
    });

    const opticsChips = document.querySelectorAll('.optics-presets-row .btn-preset-chip');
    opticsChips.forEach(chip => {
      chip.addEventListener('click', () => {
        opticsChips.forEach(c => c.classList.toggle('active', c === chip));
        const sVal = parseFloat(chip.dataset.s);
        const sSlider = document.getElementById('optics-slider-s');
        const sValDisplay = document.getElementById('optics-val-s');
        if (sSlider) {
          sSlider.value = sVal;
          sSlider.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (sValDisplay) sValDisplay.textContent = sVal.toFixed(1) + ' cm';
        if (waveSimulatorInstance) {
          waveSimulatorInstance.setParam('opticsS', sVal);
        }
      });
    });

    // 8. Fourier Series Synthesis Controls
    const fourierWaveSelect = document.getElementById('fourier-wave-type');
    if (fourierWaveSelect) {
      fourierWaveSelect.addEventListener('change', (e) => {
        if (waveSimulatorInstance) {
          waveSimulatorInstance.setParam('fourierWaveType', e.target.value);
        }
      });
    }

    const sFourierN = document.getElementById('fourier-slider-n');
    const nFourierN = document.getElementById('fourier-num-n');
    const lFourierN = document.getElementById('fourier-val-n');
    if (sFourierN && nFourierN) {
      const syncN = (val) => {
        val = Math.max(1, Math.min(25, Math.round(parseFloat(val) || 1)));
        sFourierN.value = val;
        nFourierN.value = val;
        if (lFourierN) lFourierN.textContent = val + ' พจน์';
        if (waveSimulatorInstance) {
          waveSimulatorInstance.setParam('fourierHarmonics', val);
        }
      };
      sFourierN.addEventListener('input', (e) => syncN(e.target.value));
      nFourierN.addEventListener('input', (e) => syncN(e.target.value));
    }

    const sFourierF0 = document.getElementById('fourier-slider-f0');
    const nFourierF0 = document.getElementById('fourier-num-f0');
    const lFourierF0 = document.getElementById('fourier-val-f0');
    if (sFourierF0 && nFourierF0) {
      const syncF0 = (val) => {
        val = parseFloat(val) || 0.8;
        sFourierF0.value = val;
        nFourierF0.value = val;
        if (lFourierF0) lFourierF0.textContent = val.toFixed(1) + ' Hz';
        if (waveSimulatorInstance) {
          waveSimulatorInstance.setParam('fourierFundFreq', val);
        }
      };
      sFourierF0.addEventListener('input', (e) => syncF0(e.target.value));
      nFourierF0.addEventListener('input', (e) => syncF0(e.target.value));
    }

    const fourierChips = document.querySelectorAll('.fourier-presets-row .btn-preset-chip');
    fourierChips.forEach(chip => {
      chip.addEventListener('click', () => {
        fourierChips.forEach(c => c.classList.toggle('active', c === chip));
        const wType = chip.dataset.type;
        const nVal = parseInt(chip.dataset.n, 10);
        if (fourierWaveSelect && wType) fourierWaveSelect.value = wType;
        if (sFourierN && nVal) {
          sFourierN.value = nVal;
          if (nFourierN) nFourierN.value = nVal;
          if (lFourierN) lFourierN.textContent = nVal + ' พจน์';
        }
        if (waveSimulatorInstance) {
          if (wType) waveSimulatorInstance.setParam('fourierWaveType', wType);
          if (nVal) waveSimulatorInstance.setParam('fourierHarmonics', nVal);
        }
      });
    });
  }

  function bindWaveSlider(sliderId, labelId, unit, decimals, onChange) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    if (!slider) return;
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (label && unit) label.textContent = val.toFixed(decimals) + unit;
      onChange(val);
    });
  }

  function updateWaveTelemetryUI(telem) {
    if (!telem) return;
    const sm = telem.submode || telem.subMode;
    if (sm === 'light_waves') {
      setText('wave-telem-speed', 'c = 3.00 × 10⁸ m/s');
      setText('wave-telem-lambda', (telem.wl_nm ? telem.wl_nm.toFixed(0) : (telem.wavelength * 1e9).toFixed(0)) + ' nm');
      setText('wave-telem-freq', (telem.freq_THz ? telem.freq_THz.toFixed(1) : (telem.frequency * 1e-12).toFixed(1)) + ' THz');
      setText('wave-telem-period', (telem.period * 1e15).toFixed(2) + ' fs');
      setText('wave-telem-k', (telem.wavenumber * 1e-6).toFixed(2) + ' × 10⁶ rad/m');
      setText('wave-telem-omega', (telem.omega * 1e-15).toFixed(2) + ' × 10¹⁵ rad/s');
      setText('wave-telem-power', (telem.energy_eV ? telem.energy_eV.toFixed(2) : '3.10') + ' eV');
      setText('wave-telem-beat', '— (Monochromatic)');
    } else if (sm === 'polarization') {
      setText('wave-telem-speed', 'c = 3.00 × 10⁸ m/s');
      setText('wave-telem-lambda', '550 nm (Green Ref)');
      setText('wave-telem-freq', '545.0 THz');
      setText('wave-telem-period', '1.83 fs');
      setText('wave-telem-k', '11.42 × 10⁶ rad/m');
      setText('wave-telem-omega', '3.42 × 10¹⁵ rad/s');
      const pct = (telem.transmissionPct !== undefined) ? telem.transmissionPct : (telem.malusTransmissionPct !== undefined ? telem.malusTransmissionPct : 50.0);
      setText('wave-telem-power', pct.toFixed(1) + '% (I/I₀)');
      setText('wave-telem-beat', 'Δθ = ' + (telem.deltaThetaDeg !== undefined ? telem.deltaThetaDeg.toFixed(0) : '0') + '°');
    } else if (sm === 'water_waves') {
      setText('wave-telem-speed', telem.waveSpeed.toFixed(2) + ' m/s (' + (telem.regime || 'Intermediate') + ')');
      setText('wave-telem-lambda', telem.wavelength.toFixed(1) + ' m');
      setText('wave-telem-freq', telem.frequency.toFixed(3) + ' Hz');
      setText('wave-telem-period', telem.period > 0 ? telem.period.toFixed(2) + ' s' : '—');
      setText('wave-telem-k', telem.wavenumber.toFixed(3) + ' rad/m');
      setText('wave-telem-omega', telem.omega.toFixed(3) + ' rad/s');
      setText('wave-telem-power', telem.powerAvg.toFixed(1) + ' J/m²');
      setText('wave-telem-beat', '—');
    } else if (sm === 'geometric_optics') {
      const s = telem.opticsS !== undefined ? telem.opticsS : 30;
      const sPrime = telem.opticsSPrime !== undefined ? telem.opticsSPrime : 30;
      const f = telem.opticsF !== undefined ? telem.opticsF : 15;
      const m = telem.opticsM !== undefined ? telem.opticsM : -1.0;
      const isReal = telem.opticsIsReal;
      const isInf = telem.opticsIsAtInfinity;

      setText('wave-telem-speed', 's = ' + s.toFixed(1) + ' cm');
      setText('wave-telem-lambda', isInf ? "s' → ∞ (อนันต์)" : ("s' = " + (sPrime > 0 ? '+' : '') + sPrime.toFixed(1) + ' cm'));
      setText('wave-telem-freq', 'f = ' + (f > 0 ? '+' : '') + f.toFixed(1) + ' cm');
      setText('wave-telem-period', isInf ? 'm → ∞' : ('m = ' + m.toFixed(2) + '×'));
      setText('wave-telem-k', '1/f = ' + (100 / f).toFixed(2) + ' D');
      setText('wave-telem-omega', isInf ? 'รังสีขนาน' : (isReal ? 'ตัดจริง (Convergent)' : 'เสมือน (Divergent)'));
      setText('wave-telem-power', isInf ? 'ที่ระยะอนันต์' : (isReal ? 'ภาพจริง (Real)' : 'ภาพเสมือน (Virtual)'));
      setText('wave-telem-beat', isInf ? 'แสงขนาน' : (m < 0 ? 'หัวกลับ (Inverted)' : 'หัวตั้ง (Upright)'));

      // Also update optics badge readouts
      setText('optics-readout-sprime', isInf ? '∞ (ระยะอนันต์)' : ((sPrime > 0 ? '+' : '') + sPrime.toFixed(1) + ' cm'));
      setText('optics-readout-m', isInf ? '∞' : (m.toFixed(2) + '×'));
      let natureStr = '';
      if (isInf) {
        natureStr = 'รังสีขนาน ไม่ตัดกัน (ภาพอยู่ที่ระยะอนันต์)';
      } else {
        const typeStr = isReal ? 'ภาพจริง' : 'ภาพเสมือน';
        const orientStr = m < 0 ? 'หัวกลับ' : 'หัวตั้ง';
        const sizeStr = Math.abs(Math.abs(m) - 1.0) < 0.05 ? 'ขนาดเท่าวัตถุพอดี' : (Math.abs(m) > 1.0 ? 'ขนาดขยายใหญ่' : 'ขนาดย่อส่วน');
        natureStr = `${typeStr} ${orientStr} ${sizeStr}`;
      }
      setText('optics-readout-nature', natureStr);
    } else if (sm === 'fourier_synthesis') {
      const f0 = telem.fourierFundFreq || 0.8;
      const v = telem.waveSpeed || 40.0;
      const lambda0 = v / f0;
      const powerPct = (telem.fourierPowerPct !== undefined) ? parseFloat(telem.fourierPowerPct) : 98.5;
      const gibbsPct = (telem.fourierGibbsPct !== undefined) ? parseFloat(telem.fourierGibbsPct) : 8.95;
      const nHarmonics = telem.fourierHarmonics || 5;
      const wType = telem.fourierWaveType || 'square';

      setText('wave-telem-speed', 'v = ' + v.toFixed(1) + ' m/s (Phase speed)');
      setText('wave-telem-lambda', 'λ₀ = ' + lambda0.toFixed(2) + ' m');
      setText('wave-telem-freq', 'f₀ = ' + f0.toFixed(2) + ' Hz');
      setText('wave-telem-period', 'T₀ = ' + (1 / f0).toFixed(2) + ' s');
      setText('wave-telem-k', 'k₀ = ' + ((2 * Math.PI) / lambda0).toFixed(2) + ' rad/m');
      setText('wave-telem-omega', 'ω₀ = ' + (2 * Math.PI * f0).toFixed(2) + ' rad/s');
      setText('wave-telem-power', powerPct.toFixed(1) + '% (Parseval)');
      setText('wave-telem-beat', 'N = ' + nHarmonics + ' พจน์');

      // Update dedicated Fourier math readouts
      const formulas = {
        square: 'f(t) = 4/π · Σ sin((2k-1)ωt)/(2k-1)',
        sawtooth: 'f(t) = 2/π · Σ (-1)^(n+1)·sin(nωt)/n',
        triangle: 'f(t) = 8/π² · Σ (-1)^((k-1)/2)·sin(kωt)/k²',
        rectified: 'f(t) = 1/π + 1/2 sin(ωt) - 2/π · Σ cos(2nωt)/(4n²-1)'
      };
      setText('fourier-readout-formula', formulas[wType] || formulas.square);
      setText('fourier-readout-power', powerPct.toFixed(1) + '% (สัดส่วนกำลังงานสมบูรณ์)');
      setText('fourier-readout-gibbs', (wType === 'triangle' ? '— (ไม่มีขอบกระโดด)' : ('+' + gibbsPct.toFixed(2) + '% (ขอบไม่ต่อเนื่อง Overshoot limit ~8.95%)')));
    } else {
      setText('wave-telem-speed', telem.waveSpeed.toFixed(2) + ' m/s');
      setText('wave-telem-lambda', telem.wavelength.toFixed(2) + ' m');
      setText('wave-telem-freq', telem.frequency.toFixed(2) + ' Hz');
      setText('wave-telem-period', telem.period > 0 ? telem.period.toFixed(2) + ' s' : '—');
      setText('wave-telem-k', telem.wavenumber.toFixed(2) + ' rad/m');
      setText('wave-telem-omega', telem.omega.toFixed(2) + ' rad/s');
      setText('wave-telem-power', telem.powerAvg.toFixed(2) + ' W');
      setText('wave-telem-beat', telem.beatFreq.toFixed(2) + ' Hz');
    }

    if (window.TelemetryMathInspector && typeof window.TelemetryMathInspector.updateLiveTelemetry === 'function') {
      window.TelemetryMathInspector.updateLiveTelemetry('wave', telem, {
        v: telem.waveSpeed,
        lambda: telem.wavelength,
        f: telem.frequency
      });
    }
  }

  function launchWaveSimulatorPreset(theoryId) {
    switchView('view-simulator');
    if (!waveSimulatorInstance) return;

    let num = 1;
    if (typeof theoryId === 'number') num = theoryId;
    else if (typeof theoryId === 'string') {
      const match = theoryId.match(/\d+$/);
      if (match) num = parseInt(match[0], 10);
    }

    let targetSubMode = 'traveling';
    if (num === 1 || num === 2) {
      // Traveling wave & Energy transport
      targetSubMode = 'traveling';
      waveSimulatorInstance.setParam('amplitude', 0.8);
      waveSimulatorInstance.setParam('frequency', 1.2);
      waveSimulatorInstance.setParam('tension', 80);
      waveSimulatorInstance.setParam('linearDensity', 0.05);
    } else if (num === 3 || num === 4) {
      // Standing waves & Harmonics
      targetSubMode = 'standing';
      waveSimulatorInstance.setParam('harmonicN', (num === 4) ? 3 : 2);
      waveSimulatorInstance.setParam('tension', 100);
      waveSimulatorInstance.setParam('linearDensity', 0.04);
    } else if (num === 5 || num === 6) {
      // Beats & Superposition
      targetSubMode = 'interference_beats';
      waveSimulatorInstance.setParam('freq1', 2.0);
      waveSimulatorInstance.setParam('freq2', 2.4);
    } else if (num === 7 || num === 8 || num === 9) {
      // Geometric Optics: Curved Mirrors & Thin Lenses
      targetSubMode = 'geometric_optics';
      if (num === 7) {
        waveSimulatorInstance.setParam('opticsType', 'concave_mirror');
        waveSimulatorInstance.setParam('opticsFocal', 15.0);
        waveSimulatorInstance.setParam('opticsS', 30.0);
        waveSimulatorInstance.setParam('opticsH', 6.0);
      } else if (num === 8) {
        waveSimulatorInstance.setParam('opticsType', 'convex_lens');
        waveSimulatorInstance.setParam('opticsFocal', 15.0);
        waveSimulatorInstance.setParam('opticsS', 22.0);
        waveSimulatorInstance.setParam('opticsH', 6.0);
      } else {
        waveSimulatorInstance.setParam('opticsType', 'convex_lens');
        waveSimulatorInstance.setParam('opticsFocal', 10.0);
        waveSimulatorInstance.setParam('opticsS', 18.0);
        waveSimulatorInstance.setParam('opticsH', 5.0);
      }
    }

    waveSimulatorInstance.reset();
    switchSimMode('wave', targetSubMode);
  }

  // ======================================================================
  // CHAPTER 05 THERMODYNAMICS & KINETIC SIMULATOR CONTROLLER
  // ======================================================================
  function initThermoSimulator() {
    const canvas = document.getElementById('thermo-canvas');
    if (!canvas || !window.ThermoSimulator) return;

    thermoSimulatorInstance = new window.ThermoSimulator(canvas, {
      onTelemetryUpdate: updateThermoTelemetryUI
    });

    window.thermoSimulatorInstance = thermoSimulatorInstance;
    setupThermoSimulatorControls();
    thermoSimulatorInstance.render();
  }

  function setupThermoSimulatorControls() {
    const btnPlay = document.getElementById('btn-thermo-play');
    const btnPause = document.getElementById('btn-thermo-pause');
    const btnStep = document.getElementById('btn-thermo-step');
    const btnReset = document.getElementById('btn-thermo-reset');

    if (btnPlay) btnPlay.addEventListener('click', () => {
      if (thermoSimulatorInstance) {
        thermoSimulatorInstance.play();
        btnPlay.disabled = true;
        if (btnPause) btnPause.disabled = false;
      }
    });

    if (btnPause) btnPause.addEventListener('click', () => {
      if (thermoSimulatorInstance) {
        thermoSimulatorInstance.pause();
        btnPause.disabled = true;
        if (btnPlay) btnPlay.disabled = false;
      }
    });

    if (btnStep) btnStep.addEventListener('click', () => {
      if (thermoSimulatorInstance) {
        thermoSimulatorInstance.pause();
        thermoSimulatorInstance.step(0.02);
        if (btnPause) btnPause.disabled = true;
        if (btnPlay) btnPlay.disabled = false;
      }
    });

    if (btnReset) btnReset.addEventListener('click', () => {
      if (thermoSimulatorInstance) {
        thermoSimulatorInstance.reset();
      }
    });

    // Submode switching buttons
    const submodeBtns = document.querySelectorAll('#sim-container-thermo .submode-btn');
    submodeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.submode;
        if (thermoSimulatorInstance) thermoSimulatorInstance.setSubMode(mode);

        submodeBtns.forEach(b => b.classList.toggle('active', b === btn));

        // Toggle control visibility
        const grpPV = document.getElementById('controls-pv-engine');
        const grpKinetic = document.getElementById('controls-kinetic-gas');
        const grpHeat = document.getElementById('controls-heat-conduction');

        if (grpPV) grpPV.style.display = (mode === 'pv_engine') ? 'block' : 'none';
        if (grpKinetic) grpKinetic.style.display = (mode === 'kinetic_gas') ? 'block' : 'none';
        if (grpHeat) grpHeat.style.display = (mode === 'heat_conduction') ? 'block' : 'none';
      });
    });

    // Control bindings
    const selEngineType = document.getElementById('thermo-engine-type');
    if (selEngineType) selEngineType.addEventListener('change', (e) => {
      if (thermoSimulatorInstance) thermoSimulatorInstance.setParam('engineType', e.target.value);
    });

    const sliderTh = document.getElementById('slider-thermo-th');
    const labelTh = document.getElementById('label-thermo-th');
    if (sliderTh) sliderTh.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (labelTh) labelTh.textContent = val + ' K';
      if (thermoSimulatorInstance) thermoSimulatorInstance.setParam('tempHot', val);
    });

    const sliderTc = document.getElementById('slider-thermo-tc');
    const labelTc = document.getElementById('label-thermo-tc');
    if (sliderTc) sliderTc.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (labelTc) labelTc.textContent = val + ' K';
      if (thermoSimulatorInstance) thermoSimulatorInstance.setParam('tempCold', val);
    });

    const sliderKineticT = document.getElementById('slider-kinetic-temp');
    const labelKineticT = document.getElementById('label-kinetic-temp');
    if (sliderKineticT) sliderKineticT.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (labelKineticT) labelKineticT.textContent = val + ' K';
      if (thermoSimulatorInstance) thermoSimulatorInstance.setParam('kineticTemp', val);
    });

    const selGas = document.getElementById('select-gas-molar-mass');
    if (selGas) selGas.addEventListener('change', (e) => {
      if (thermoSimulatorInstance) thermoSimulatorInstance.setParam('gasMolarMass', parseFloat(e.target.value));
    });

    const selMat = document.getElementById('select-bar-material');
    if (selMat) selMat.addEventListener('change', (e) => {
      if (thermoSimulatorInstance) thermoSimulatorInstance.setParam('barMaterial', e.target.value);
    });
  }

  function updateThermoTelemetryUI(telem) {
    if (!telem) return;
    if (telem.carnotEfficiency) setText('thermo-telem-eta', telem.carnotEfficiency);
    if (telem.tempHot) setText('thermo-telem-th', telem.tempHot);
    if (telem.tempCold) setText('thermo-telem-tc', telem.tempCold);
    if (telem.vRms) setText('thermo-telem-vrms', telem.vRms);
  }

  function launchThermoSimulatorPreset(theoryId) {
    switchView('view-simulator');
    if (!thermoSimulatorInstance) return;

    let num = 1;
    if (typeof theoryId === 'number') {
      num = theoryId;
    } else if (typeof theoryId === 'string') {
      const match = theoryId.match(/\d+$/);
      if (match) num = parseInt(match[0], 10);
    }

    let targetSubMode = 'pv_engine';
    if (num === 1) {
      // Conduction & Heat transfer
      targetSubMode = 'heat_conduction';
      thermoSimulatorInstance.setParam('barMaterial', 'copper');
    } else if (num === 2 || num === 6) {
      // Kinetic Theory & Maxwell-Boltzmann
      targetSubMode = 'kinetic_gas';
      thermoSimulatorInstance.setParam('kineticTemp', 300);
      thermoSimulatorInstance.setParam('gasMolarMass', 0.028);
    } else {
      // Heat Engines & P-V Cycles (3, 4, 5)
      targetSubMode = 'pv_engine';
      thermoSimulatorInstance.setParam('engineType', (num === 4) ? 'otto' : 'carnot');
      thermoSimulatorInstance.setParam('tempHot', 650);
      thermoSimulatorInstance.setParam('tempCold', 300);
    }

    thermoSimulatorInstance.reset();
    switchSimMode('thermo', targetSubMode);
  }

  // Teardown hook for clean testing

  // ========================================================================
  // CHAPTER 06 ELECTROMAGNETISM & CIRCUITS SIMULATOR CONTROLLER
  // ========================================================================
  function initEMSimulator() {
    const canvas = document.getElementById('em-canvas');
    if (!canvas || !window.EMSimulator) return;

    emSimulatorInstance = new window.EMSimulator(canvas, {
      onTelemetryUpdate: updateEMTelemetryUI
    });
    window.emSimulatorInstance = emSimulatorInstance;
    setupEMSimulatorControls();
    emSimulatorInstance.render();
  }

  function setupEMSimulatorControls() {
    const btnPlay = document.getElementById('btn-em-play');
    const btnPause = document.getElementById('btn-em-pause');
    const btnStep = document.getElementById('btn-em-step');
    const btnReset = document.getElementById('btn-em-reset');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (emSimulatorInstance) {
          emSimulatorInstance.play();
          btnPlay.disabled = true;
          if (btnPause) btnPause.disabled = false;
        }
      });
    }

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        if (emSimulatorInstance) {
          emSimulatorInstance.pause();
          btnPlay.disabled = false;
          btnPause.disabled = true;
        }
      });
    }

    if (btnStep) {
      btnStep.addEventListener('click', () => {
        if (emSimulatorInstance) {
          emSimulatorInstance.pause();
          emSimulatorInstance.step(0.02);
          if (btnPlay) btnPlay.disabled = false;
          if (btnPause) btnPause.disabled = true;
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (emSimulatorInstance) {
          emSimulatorInstance.reset();
        }
      });
    }

    // Submode Buttons (6 submodes) - unified routing through switchSimMode
    const submodeBtns = document.querySelectorAll('#sim-container-em .submode-btn');
    submodeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.submode;
        switchSimMode('em', mode);
      });
    });

    // Submode 1: Field controls
    const selTestSign = document.getElementById('select-em-test-sign');
    if (selTestSign) {
      selTestSign.addEventListener('change', (e) => {
        if (emSimulatorInstance) emSimulatorInstance.setParam('testChargeSign', parseInt(e.target.value, 10));
      });
    }
    const btnClearP = document.getElementById('btn-em-clear-particles');
    if (btnClearP) {
      btnClearP.addEventListener('click', () => {
        if (emSimulatorInstance) {
          emSimulatorInstance.testParticles = [];
          emSimulatorInstance.render();
        }
      });
    }

    // Submode 1: Field & Charges controls
    const selectChargeConfig = document.getElementById('select-charge-config');
    const sliderChargeQ1 = document.getElementById('slider-charge-q1');
    const labelChargeQ1 = document.getElementById('label-charge-q1');
    const sliderChargeQ2 = document.getElementById('slider-charge-q2');
    const labelChargeQ2 = document.getElementById('label-charge-q2');

    const updateChargeLabels = () => {
      if (sliderChargeQ1 && labelChargeQ1) {
        const v1 = parseFloat(sliderChargeQ1.value);
        labelChargeQ1.textContent = (v1 >= 0 ? '+' : '') + v1.toFixed(1) + ' μC';
        labelChargeQ1.style.color = v1 > 0 ? '#EF4444' : (v1 < 0 ? '#38BDF8' : '#94A3B8');
      }
      if (sliderChargeQ2 && labelChargeQ2) {
        const v2 = parseFloat(sliderChargeQ2.value);
        labelChargeQ2.textContent = (v2 >= 0 ? '+' : '') + v2.toFixed(1) + ' μC';
        labelChargeQ2.style.color = v2 > 0 ? '#EF4444' : (v2 < 0 ? '#38BDF8' : '#94A3B8');
      }
    };

    if (selectChargeConfig) {
      selectChargeConfig.addEventListener('change', (e) => {
        const cfg = e.target.value;
        if (emSimulatorInstance) {
          emSimulatorInstance.setParam('chargeConfig', cfg);
        }
        if (cfg === 'two_pos') {
          if (sliderChargeQ1 && parseFloat(sliderChargeQ1.value) < 0) {
            sliderChargeQ1.value = Math.abs(parseFloat(sliderChargeQ1.value)) || 5;
            sliderChargeQ1.dispatchEvent(new Event('input'));
          }
          if (sliderChargeQ2 && parseFloat(sliderChargeQ2.value) < 0) {
            sliderChargeQ2.value = Math.abs(parseFloat(sliderChargeQ2.value)) || 5;
            sliderChargeQ2.dispatchEvent(new Event('input'));
          }
        }
        if (sliderChargeQ2) {
          const q2Container = sliderChargeQ2.closest('.slider-control');
          if (q2Container) {
            q2Container.style.display = (cfg === 'single_pos') ? 'none' : 'block';
          }
        }
        updateChargeLabels();
      });
    }

    if (sliderChargeQ1 && labelChargeQ1) {
      sliderChargeQ1.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelChargeQ1.textContent = (val >= 0 ? '+' : '') + val.toFixed(1) + ' μC';
        labelChargeQ1.style.color = val > 0 ? '#EF4444' : (val < 0 ? '#38BDF8' : '#94A3B8');
        if (emSimulatorInstance) emSimulatorInstance.setParam('chargeQ1', val);
      });
    }

    if (sliderChargeQ2 && labelChargeQ2) {
      sliderChargeQ2.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelChargeQ2.textContent = (val >= 0 ? '+' : '') + val.toFixed(1) + ' μC';
        labelChargeQ2.style.color = val > 0 ? '#EF4444' : (val < 0 ? '#38BDF8' : '#94A3B8');
        if (emSimulatorInstance) emSimulatorInstance.setParam('chargeQ2', val);
      });
    }

    // Submode 2: Lorentz controls
    const sliderB = document.getElementById('slider-lorentz-b');
    const labelB = document.getElementById('label-lorentz-b');
    if (sliderB && labelB) {
      sliderB.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelB.textContent = val.toFixed(2) + ' T';
        if (emSimulatorInstance) emSimulatorInstance.setParam('magFieldB', val);
      });
    }

    const sliderE = document.getElementById('slider-lorentz-e');
    const labelE = document.getElementById('label-lorentz-e');
    if (sliderE && labelE) {
      sliderE.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelE.textContent = val.toFixed(0) + ' V/m';
        if (emSimulatorInstance) emSimulatorInstance.setParam('elecFieldE', val);
      });
    }

    const sliderV = document.getElementById('slider-lorentz-v');
    const labelV = document.getElementById('label-lorentz-v');
    if (sliderV && labelV) {
      sliderV.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelV.textContent = val.toFixed(0) + ' m/s';
        if (emSimulatorInstance) emSimulatorInstance.setParam('particleVelocity', val);
      });
    }

    const selectParticle = document.getElementById('select-particle-type');
    if (selectParticle) {
      selectParticle.addEventListener('change', (e) => {
        if (emSimulatorInstance) emSimulatorInstance.setParticleType(e.target.value);
      });
    }

    // Submode 3: RC controls
    const selSwitch = document.getElementById('select-rc-switch');
    if (selSwitch) {
      selSwitch.addEventListener('change', (e) => {
        if (emSimulatorInstance) emSimulatorInstance.setParam('switchState', e.target.value);
      });
    }

    const sliderR = document.getElementById('slider-rc-r');
    const labelR = document.getElementById('label-rc-r');
    if (sliderR && labelR) {
      sliderR.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelR.textContent = val.toFixed(0) + ' kΩ';
        if (emSimulatorInstance) emSimulatorInstance.setParam('resistanceR', val);
      });
    }

    const sliderC = document.getElementById('slider-rc-c');
    const labelC = document.getElementById('label-rc-c');
    if (sliderC && labelC) {
      sliderC.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelC.textContent = val.toFixed(0) + ' μF';
        if (emSimulatorInstance) emSimulatorInstance.setParam('capacitanceC', val);
      });
    }

    // Submode 4: Faraday controls
    const sliderFaradayTurns = document.getElementById('slider-faraday-turns');
    const labelFaradayTurns = document.getElementById('label-faraday-turns');
    if (sliderFaradayTurns && labelFaradayTurns) {
      sliderFaradayTurns.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        labelFaradayTurns.textContent = val + ' รอบ';
        if (emSimulatorInstance) emSimulatorInstance.setParam('faradayTurns', val);
      });
    }

    const sliderFaradaySpeed = document.getElementById('slider-faraday-speed');
    const labelFaradaySpeed = document.getElementById('label-faraday-speed');
    if (sliderFaradaySpeed && labelFaradaySpeed) {
      sliderFaradaySpeed.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelFaradaySpeed.textContent = val.toFixed(1) + 'x';
        if (emSimulatorInstance) emSimulatorInstance.setParam('faradaySpeed', val);
      });
    }

    const sliderFaradayStrength = document.getElementById('slider-faraday-strength');
    const labelFaradayStrength = document.getElementById('label-faraday-strength');
    if (sliderFaradayStrength && labelFaradayStrength) {
      sliderFaradayStrength.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelFaradayStrength.textContent = val.toFixed(2) + ' T';
        if (emSimulatorInstance) emSimulatorInstance.setParam('faradayMagnetStrength', val);
      });
    }

    const btnToggleFaradayOsc = document.getElementById('btn-toggle-faraday-osc');
    if (btnToggleFaradayOsc) {
      btnToggleFaradayOsc.addEventListener('click', () => {
        if (emSimulatorInstance) {
          emSimulatorInstance.params.faradayOscillate = !emSimulatorInstance.params.faradayOscillate;
          btnToggleFaradayOsc.textContent = emSimulatorInstance.params.faradayOscillate
            ? '⏯️ หยุดการแกว่งแม่เหล็ก (ลากด้วยเมาส์)'
            : '▶️ เปิดการแกว่งแม่เหล็กอัตโนมัติ';
        }
      });
    }

    // Submode 5: Biot-Savart controls
    const selectBiotType = document.getElementById('select-biot-type');
    const biotParallelExtras = document.getElementById('biot-parallel-extras');
    if (selectBiotType) {
      selectBiotType.addEventListener('change', (e) => {
        const val = e.target.value;
        if (emSimulatorInstance) emSimulatorInstance.setParam('biotType', val);
        if (biotParallelExtras) {
          biotParallelExtras.style.display = (val === 'parallel') ? 'block' : 'none';
        }
      });
    }

    const sliderBiotI1 = document.getElementById('slider-biot-i1');
    const labelBiotI1 = document.getElementById('label-biot-i1');
    if (sliderBiotI1 && labelBiotI1) {
      sliderBiotI1.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelBiotI1.textContent = val.toFixed(1) + ' A';
        if (emSimulatorInstance) emSimulatorInstance.setParam('wireCurrent1', val);
      });
    }

    const sliderBiotI2 = document.getElementById('slider-biot-i2');
    const labelBiotI2 = document.getElementById('label-biot-i2');
    if (sliderBiotI2 && labelBiotI2) {
      sliderBiotI2.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelBiotI2.textContent = val.toFixed(1) + ' A';
        if (emSimulatorInstance) emSimulatorInstance.setParam('wireCurrent2', val);
      });
    }

    const sliderBiotDist = document.getElementById('slider-biot-dist');
    const labelBiotDist = document.getElementById('label-biot-dist');
    if (sliderBiotDist && labelBiotDist) {
      sliderBiotDist.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelBiotDist.textContent = val.toFixed(2) + ' m';
        if (emSimulatorInstance) emSimulatorInstance.setParam('wireDistance', val);
      });
    }

    const selectBiotDir = document.getElementById('select-biot-dir');
    if (selectBiotDir) {
      selectBiotDir.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (emSimulatorInstance) emSimulatorInstance.setParam('wireDirection', val);
      });
    }

    // Submode 6: AC RLC controls
    const sliderAcSpeed = document.getElementById('slider-ac-speed');
    const labelAcSpeed = document.getElementById('label-ac-speed');
    if (sliderAcSpeed && labelAcSpeed) {
      sliderAcSpeed.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelAcSpeed.textContent = val.toFixed(2) + 'x';
        if (emSimulatorInstance) emSimulatorInstance.setParam('acSpeed', val);
      });
    }

    const sliderAcVolt = document.getElementById('slider-ac-volt');
    const labelAcVolt = document.getElementById('label-ac-volt');
    if (sliderAcVolt && labelAcVolt) {
      sliderAcVolt.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelAcVolt.textContent = val.toFixed(0) + ' V';
        if (emSimulatorInstance) emSimulatorInstance.setParam('acVolt', val);
      });
    }

    const sliderAcFreq = document.getElementById('slider-ac-freq');
    const labelAcFreq = document.getElementById('label-ac-freq');
    if (sliderAcFreq && labelAcFreq) {
      sliderAcFreq.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelAcFreq.textContent = val.toFixed(1) + ' Hz';
        if (emSimulatorInstance) emSimulatorInstance.setParam('acFreq', val);
      });
    }

    const sliderAcR = document.getElementById('slider-ac-r');
    const labelAcR = document.getElementById('label-ac-r');
    if (sliderAcR && labelAcR) {
      sliderAcR.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelAcR.textContent = val.toFixed(0) + ' Ω';
        if (emSimulatorInstance) emSimulatorInstance.setParam('acR', val);
      });
    }

    const sliderAcL = document.getElementById('slider-ac-l');
    const labelAcL = document.getElementById('label-ac-l');
    if (sliderAcL && labelAcL) {
      sliderAcL.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelAcL.textContent = val.toFixed(2) + ' H';
        if (emSimulatorInstance) emSimulatorInstance.setParam('acL', val);
      });
    }

    const sliderAcC = document.getElementById('slider-ac-c');
    const labelAcC = document.getElementById('label-ac-c');
    if (sliderAcC && labelAcC) {
      sliderAcC.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelAcC.textContent = val.toFixed(0) + ' μF';
        if (emSimulatorInstance) emSimulatorInstance.setParam('acC', val);
      });
    }

    // Quick Observation Presets
    const setACSliderAndDispatch = (slider, val, label, unit, decimals = 0) => {
      if (!slider) return;
      slider.value = val;
      if (label) label.textContent = (decimals > 0 ? val.toFixed(decimals) : val.toFixed(0)) + ' ' + unit;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const btnAcRes = document.getElementById('btn-ac-preset-res');
    if (btnAcRes) {
      btnAcRes.addEventListener('click', () => {
        if (!emSimulatorInstance) return;
        const L = emSimulatorInstance.params.acL;
        const C = emSimulatorInstance.params.acC * 1e-6;
        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
        setACSliderAndDispatch(sliderAcFreq, Math.max(10, Math.min(300, Math.round(f0))), labelAcFreq, 'Hz', 1);
        if (window.syncAllNumericInputs) window.syncAllNumericInputs();
      });
    }

    const btnAcCap = document.getElementById('btn-ac-preset-cap');
    if (btnAcCap) {
      btnAcCap.addEventListener('click', () => {
        if (!emSimulatorInstance) return;
        const L = emSimulatorInstance.params.acL;
        const C = emSimulatorInstance.params.acC * 1e-6;
        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
        const targetF = Math.max(10, Math.round(f0 * 0.45));
        setACSliderAndDispatch(sliderAcFreq, targetF, labelAcFreq, 'Hz', 1);
        if (window.syncAllNumericInputs) window.syncAllNumericInputs();
      });
    }

    const btnAcInd = document.getElementById('btn-ac-preset-ind');
    if (btnAcInd) {
      btnAcInd.addEventListener('click', () => {
        if (!emSimulatorInstance) return;
        const L = emSimulatorInstance.params.acL;
        const C = emSimulatorInstance.params.acC * 1e-6;
        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
        const targetF = Math.min(300, Math.round(f0 * 1.8));
        setACSliderAndDispatch(sliderAcFreq, targetF, labelAcFreq, 'Hz', 1);
        if (window.syncAllNumericInputs) window.syncAllNumericInputs();
      });
    }

    const btnAcHiQ = document.getElementById('btn-ac-preset-hiq');
    if (btnAcHiQ) {
      btnAcHiQ.addEventListener('click', () => {
        setACSliderAndDispatch(sliderAcR, 10, labelAcR, 'Ω', 0);
        setACSliderAndDispatch(sliderAcL, 0.40, labelAcL, 'H', 2);
        setACSliderAndDispatch(sliderAcC, 5, labelAcC, 'μF', 0);
        setTimeout(() => {
          if (!emSimulatorInstance) return;
          const L = emSimulatorInstance.params.acL;
          const C = emSimulatorInstance.params.acC * 1e-6;
          const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
          setACSliderAndDispatch(sliderAcFreq, Math.max(10, Math.min(300, Math.round(f0))), labelAcFreq, 'Hz', 1);
          if (window.syncAllNumericInputs) window.syncAllNumericInputs();
        }, 30);
      });
    }

    // Submode 7: Dielectric Force Controls
    const sliderDielecV0 = document.getElementById('slider-dielectric-v0');
    const labelDielecV0 = document.getElementById('label-dielectric-v0');
    if (sliderDielecV0 && labelDielecV0) {
      sliderDielecV0.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelDielecV0.textContent = val.toFixed(0) + ' V';
        if (emSimulatorInstance) emSimulatorInstance.setParam('dielectricV0', val);
      });
    }

    const sliderDielecKappa = document.getElementById('slider-dielectric-kappa');
    const labelDielecKappa = document.getElementById('label-dielectric-kappa');
    if (sliderDielecKappa && labelDielecKappa) {
      sliderDielecKappa.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelDielecKappa.textContent = val.toFixed(1);
        if (emSimulatorInstance) emSimulatorInstance.setParam('dielectricKappa', val);
      });
    }

    const sliderDielecA = document.getElementById('slider-dielectric-a');
    const labelDielecA = document.getElementById('label-dielectric-a');
    if (sliderDielecA && labelDielecA) {
      sliderDielecA.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelDielecA.textContent = val.toFixed(1) + ' mm';
        if (emSimulatorInstance) emSimulatorInstance.setParam('dielectricA', val);
      });
    }

    const sliderDielecB = document.getElementById('slider-dielectric-b');
    const labelDielecB = document.getElementById('label-dielectric-b');
    if (sliderDielecB && labelDielecB) {
      sliderDielecB.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelDielecB.textContent = val.toFixed(1) + ' mm';
        if (emSimulatorInstance) emSimulatorInstance.setParam('dielectricB', val);
      });
    }

    const btnDielecProb = document.getElementById('btn-dielectric-preset-prob');
    if (btnDielecProb) {
      btnDielecProb.addEventListener('click', () => {
        if (!emSimulatorInstance) return;
        emSimulatorInstance.setParam('dielectricV0', 3000);
        emSimulatorInstance.setParam('dielectricKappa', 4.0);
        emSimulatorInstance.setParam('dielectricA', 2.0);
        emSimulatorInstance.setParam('dielectricB', 6.0);
        if (sliderDielecV0) sliderDielecV0.value = 3000;
        if (labelDielecV0) labelDielecV0.textContent = '3000 V';
        if (sliderDielecKappa) sliderDielecKappa.value = 4.0;
        if (labelDielecKappa) labelDielecKappa.textContent = '4.0';
        if (sliderDielecA) sliderDielecA.value = 2.0;
        if (labelDielecA) labelDielecA.textContent = '2.0 mm';
        if (sliderDielecB) sliderDielecB.value = 6.0;
        if (labelDielecB) labelDielecB.textContent = '6.0 mm';
        emSimulatorInstance.reset();
        if (window.syncAllNumericInputs) window.syncAllNumericInputs();
      });
    }

    const btnDielecHighV = document.getElementById('btn-dielectric-preset-highv');
    if (btnDielecHighV) {
      btnDielecHighV.addEventListener('click', () => {
        if (!emSimulatorInstance) return;
        emSimulatorInstance.setParam('dielectricV0', 5000);
        if (sliderDielecV0) sliderDielecV0.value = 5000;
        if (labelDielecV0) labelDielecV0.textContent = '5000 V';
        emSimulatorInstance.reset();
        if (window.syncAllNumericInputs) window.syncAllNumericInputs();
      });
    }
  }

  function updateEMTelemetryUI(telem) {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };
    const setBoth = (idx, lblHtml, valText) => {
      setHtml(`em-telem-lbl-${idx}`, lblHtml);
      setHtml(`label-em-tele-${idx}`, lblHtml);
      setText(`em-telem-val-${idx}`, valText);
      setText(`val-em-tele-${idx}`, valText);
    };

    const sub = telem.subMode || (emSimulatorInstance ? emSimulatorInstance.subMode : 'field_charges');

    if (sub === 'rc_circuit') {
      setBoth(1, 'ค่าคงตัวเวลา \\(\\tau = RC\\)', telem.tau || '2.00 s');
      setBoth(2, 'แรงดันตัวเก็บประจุ \\(V_C\\)', telem.capVoltage || '0.00 V');
      setBoth(3, 'กระแสไฟฟ้าในวงจร \\(I\\)', telem.resCurrent || '0.000 mA');
      setBoth(4, 'สนามแม่เหล็ก \\(B\\)', telem.magB || '0.80 T');
    } else if (sub === 'lorentz_cyclotron') {
      const bVal = emSimulatorInstance ? emSimulatorInstance.params.magFieldB.toFixed(2) : '0.80';
      const eVal = emSimulatorInstance ? emSimulatorInstance.params.elecFieldE.toFixed(1) : '0.0';
      const vVal = emSimulatorInstance ? emSimulatorInstance.params.particleVelocity.toFixed(1) : '240.0';
      const rVal = emSimulatorInstance ? ((emSimulatorInstance.params.particleMass * emSimulatorInstance.params.particleVelocity) / Math.max(0.01, Math.abs(emSimulatorInstance.params.particleCharge * emSimulatorInstance.params.magFieldB))).toFixed(1) : '300.0';
      setBoth(1, 'สนามแม่เหล็ก \\(B\\)', bVal + ' T');
      setBoth(2, 'สนามไฟฟ้า \\(E\\)', eVal + ' V/m');
      setBoth(3, 'ความเร็วต้น \\(v_0\\)', vVal + ' m/s');
      setBoth(4, 'รัศมีไซโคลตรอน \\(r\\)', rVal + ' m');
    } else if (sub === 'faraday_induction') {
      setBoth(1, 'แรงเคลื่อนไฟฟ้า \\(\\mathcal{E}\\)', telem.faradayEmf || '0.00 V');
      setBoth(2, 'ฟลักซ์แม่เหล็ก \\(\\Phi_B\\)', telem.faradayFlux || '0.00 mWb');
      setBoth(3, 'ความเร็วแท่งแม่เหล็ก \\(v\\)', telem.faradaySpeed || '0 px/s');
      setBoth(4, 'จำนวนรอบขดลวด \\(N\\)', (telem.faradayTurns || 200) + ' รอบ');
    } else if (sub === 'biot_savart') {
      setBoth(1, 'สนามแม่เหล็ก \\(B\\)', telem.biotB || '0.00 μT');
      setBoth(2, 'แรงต่อความยาว \\(F/L\\)', telem.biotForce || '0.00 mN/m');
      setBoth(3, 'กระแส \\(I_1\\)', telem.biotI1 || '15.0 A');
      setBoth(4, 'กระแส \\(I_2\\)', telem.biotI2 || '15.0 A');
    } else if (sub === 'ac_rlc_resonance') {
      setBoth(1, 'ความถี่สั่นพ้อง \\(f_0\\)', telem.acF0 || '112.5 Hz');
      setBoth(2, 'อิมพีแดนซ์ \\(Z\\)', telem.acZ || '40.0 Ω');
      setBoth(3, 'กระแสประสิทธิผล \\(I_{\\text{rms}}\\)', telem.acIrms || '3.00 A');
      setBoth(4, 'มุมต่างเฟส \\(\\phi\\)', telem.acPhi || '0.0°');
    } else if (sub === 'field_charges') {
      const q1 = (emSimulatorInstance && emSimulatorInstance.params.chargeQ1 !== undefined) ? emSimulatorInstance.params.chargeQ1 : (telem.chargeQ1 !== undefined ? telem.chargeQ1 : 5.0);
      const q2 = (emSimulatorInstance && emSimulatorInstance.params.chargeQ2 !== undefined) ? emSimulatorInstance.params.chargeQ2 : (telem.chargeQ2 !== undefined ? telem.chargeQ2 : -5.0);
      const cfg = (emSimulatorInstance && emSimulatorInstance.params.chargeConfig) ? emSimulatorInstance.params.chargeConfig : (telem.chargeConfig || 'dipole');
      const q1Text = (q1 >= 0 ? '+' : '') + q1.toFixed(1) + ' μC';
      const q2Text = (cfg === 'single_pos') ? '—' : ((q2 >= 0 ? '+' : '') + q2.toFixed(1) + ' μC');
      const cfgNames = {
        'dipole': 'ไดโพล (+q, -q)',
        'two_pos': 'ประจุบวกคู่ (+q, +q)',
        'single_pos': 'ประจุเดี่ยว (+q)',
        'quadrupole': 'ควอดรูโพล (4 ขั้ว)'
      };
      setBoth(1, 'ประจุไฟฟ้า \\(q_1\\)', q1Text);
      setBoth(2, 'ประจุไฟฟ้า \\(q_2\\)', q2Text);
      setBoth(3, 'อนุภาคทดสอบปล่อย', (emSimulatorInstance ? emSimulatorInstance.testParticles.length : 0) + ' ตัว');
      setBoth(4, 'โครงแบบประจุ', cfgNames[cfg] || cfg);
    } else if (sub === 'dielectric_force') {
      setBoth(1, 'แรงดึงดูดไฟฟ้า \\(F_e\\)', telem.dielectricFe || '6.84 × 10⁻⁴ N');
      setBoth(2, 'ระดับสมดุล \\(h_{\\text{eq}}\\)', telem.dielectricHeq || '0.771 mm');
      setBoth(3, 'แรงดันไฟฟ้า \\(V_0\\)', telem.dielectricV0 || '3000 V');
      setBoth(4, 'ไดอิเล็กทริก \\(\\kappa\\)', telem.dielectricKappa || '4.0');
    }

    setText('em-telem-tau', telem.tau || '2.00 s');
    setText('em-telem-vc', telem.capVoltage || '0.00 V');
    setText('em-telem-i', telem.resCurrent || '0.000 mA');
    setText('em-telem-b', telem.magB || '0.80 T');

    if (window.MathRenderer) {
      const card = document.querySelector('.telemetry-card');
      if (card) window.MathRenderer.typeset(card);
    }
  }

  function launchEMSimulatorPreset(theoryId) {
    switchView('view-simulator');
    if (!emSimulatorInstance) return;

    let num = 1;
    if (typeof theoryId === 'number') {
      num = theoryId;
    } else if (typeof theoryId === 'string') {
      const match = theoryId.match(/\d+$/);
      if (match) num = parseInt(match[0], 10);
    }

    let targetSubMode = 'field_charges';
    if (num >= 1 && num <= 7) {
      targetSubMode = 'field_charges';
      emSimulatorInstance.reset();
    } else if (num >= 8 && num <= 15) {
      targetSubMode = 'rc_circuit';
      emSimulatorInstance.setParam('switchState', 'charge');
      emSimulatorInstance.setParam('resistanceR', 100);
      emSimulatorInstance.setParam('capacitanceC', 20);
      emSimulatorInstance.reset();
    } else if (num >= 16 && num <= 20) {
      targetSubMode = 'lorentz_cyclotron';
      const partType = (num === 18) ? 'electron' : ((num === 19) ? 'alpha' : 'proton');
      emSimulatorInstance.setParticleType(partType);
      emSimulatorInstance.setParam('magFieldB', 0.8);
      emSimulatorInstance.setParam('elecFieldE', (num === 17) ? 20 : 0);
      emSimulatorInstance.setParam('particleVelocity', 240);
      const selPart = document.getElementById('select-particle-type');
      if (selPart) selPart.value = partType;
      const sB = document.getElementById('slider-lorentz-b');
      const lB = document.getElementById('label-lorentz-b');
      if (sB) sB.value = 0.8;
      if (lB) lB.textContent = '0.80 T';
      const sE = document.getElementById('slider-lorentz-e');
      const lE = document.getElementById('label-lorentz-e');
      if (sE) sE.value = (num === 17) ? 20 : 0;
      if (lE) lE.textContent = (num === 17 ? '20' : '0') + ' V/m';
      const sV = document.getElementById('slider-lorentz-v');
      const lV = document.getElementById('label-lorentz-v');
      if (sV) sV.value = 240;
      if (lV) lV.textContent = '240 m/s';
      emSimulatorInstance.reset();
      if (window.syncAllNumericInputs) window.syncAllNumericInputs();
    } else if (num >= 21 && num <= 23) {
      targetSubMode = 'biot_savart';
      const biotType = (num === 21) ? 'loop' : (num === 22 ? 'solenoid' : 'parallel');
      emSimulatorInstance.setParam('biotType', biotType);
      const sel = document.getElementById('select-biot-type');
      if (sel) sel.value = biotType;
      const extras = document.getElementById('biot-parallel-extras');
      if (extras) extras.style.display = (biotType === 'parallel') ? 'block' : 'none';
      emSimulatorInstance.reset();
    } else if (num >= 24 && num <= 26) {
      targetSubMode = 'faraday_induction';
      emSimulatorInstance.setParam('faradayTurns', 200);
      emSimulatorInstance.setParam('faradaySpeed', 2.5);
      emSimulatorInstance.reset();
    } else {
      targetSubMode = 'ac_rlc_resonance';
      emSimulatorInstance.setParam('acFreq', 60.0);
      emSimulatorInstance.setParam('acR', 40.0);
      emSimulatorInstance.setParam('acL', 0.20);
      emSimulatorInstance.setParam('acC', 10.0);
      emSimulatorInstance.reset();
    }

    switchSimMode('em', targetSubMode);
  }

  // ========================================================================
  // CHAPTER 07 NUCLEAR & MODERN PHYSICS SIMULATOR CONTROLLER
  // ========================================================================
  function initNuclearSimulator() {
    const canvas = document.getElementById('nuclear-canvas');
    if (!canvas || !window.NuclearSimulator) return;

    nuclearSimulatorInstance = new window.NuclearSimulator(canvas, {
      onTelemetryUpdate: updateNuclearTelemetryUI
    });
    window.nuclearSimulatorInstance = nuclearSimulatorInstance;
    setupNuclearSimulatorControls();
    nuclearSimulatorInstance.render();
  }

  function setupNuclearSimulatorControls() {
    const btnPlay = document.getElementById('btn-nuclear-play');
    const btnPause = document.getElementById('btn-nuclear-pause');
    const btnStep = document.getElementById('btn-nuclear-step');
    const btnReset = document.getElementById('btn-nuclear-reset');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (nuclearSimulatorInstance) {
          nuclearSimulatorInstance.play();
          btnPlay.disabled = true;
          if (btnPause) btnPause.disabled = false;
        }
      });
    }

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        if (nuclearSimulatorInstance) {
          nuclearSimulatorInstance.pause();
          btnPlay.disabled = false;
          btnPause.disabled = true;
        }
      });
    }

    if (btnStep) {
      btnStep.addEventListener('click', () => {
        if (nuclearSimulatorInstance) {
          nuclearSimulatorInstance.pause();
          nuclearSimulatorInstance.step(0.05);
          if (btnPlay) btnPlay.disabled = false;
          if (btnPause) btnPause.disabled = true;
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (nuclearSimulatorInstance) {
          nuclearSimulatorInstance.reset();
        }
      });
    }

    // Submode Buttons
    const submodeBtns = document.querySelectorAll('#sim-container-nuclear .submode-btn');
    submodeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.submode;
        if (nuclearSimulatorInstance) nuclearSimulatorInstance.setSubMode(mode);

        submodeBtns.forEach(b => b.classList.toggle('active', b === btn));

        const grpBinding = document.getElementById('controls-binding-energy');
        const grpDecay = document.getElementById('controls-decay-stochastic');
        const grpShield = document.getElementById('controls-shielding');

        if (grpBinding) grpBinding.style.display = (mode === 'binding_energy') ? 'block' : 'none';
        if (grpDecay) grpDecay.style.display = (mode === 'decay_stochastic') ? 'block' : 'none';
        if (grpShield) grpShield.style.display = (mode === 'shielding_dosimetry') ? 'block' : 'none';

        if (nuclearSimulatorInstance) nuclearSimulatorInstance.render();
      });
    });

    // Submode 1: Binding energy nuclide select
    const selNuclide = document.getElementById('select-nuclide');
    if (selNuclide) {
      selNuclide.addEventListener('change', (e) => {
        if (nuclearSimulatorInstance) {
          nuclearSimulatorInstance.setParam('selectedNuclideIndex', parseInt(e.target.value, 10));
        }
      });
    }

    // Submode 2: Decay controls
    const selIsotope = document.getElementById('select-decay-isotope');
    if (selIsotope) {
      selIsotope.addEventListener('change', (e) => {
        if (nuclearSimulatorInstance) {
          nuclearSimulatorInstance.setParam('isotope', e.target.value);
        }
      });
    }

    const sliderHalflife = document.getElementById('slider-nuclear-halflife');
    const labelHalflife = document.getElementById('label-nuclear-halflife');
    if (sliderHalflife && labelHalflife) {
      sliderHalflife.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelHalflife.textContent = val.toFixed(1) + ' s';
        if (nuclearSimulatorInstance) nuclearSimulatorInstance.setParam('halfLife', val);
      });
    }

    // Submode 3: Shielding controls
    const selRad = document.getElementById('select-radiation-type');
    if (selRad) {
      selRad.addEventListener('change', (e) => {
        if (nuclearSimulatorInstance) {
          nuclearSimulatorInstance.setParam('radiationType', e.target.value);
        }
      });
    }

    const selMaterial = document.getElementById('select-shield-material');
    if (selMaterial) {
      selMaterial.addEventListener('change', (e) => {
        if (nuclearSimulatorInstance) {
          nuclearSimulatorInstance.setParam('shieldMaterial', e.target.value);
        }
      });
    }

    const sliderThickness = document.getElementById('slider-shield-thickness');
    const labelThickness = document.getElementById('label-shield-thickness');
    if (sliderThickness && labelThickness) {
      sliderThickness.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelThickness.textContent = val.toFixed(0) + ' mm';
        if (nuclearSimulatorInstance) nuclearSimulatorInstance.setParam('shieldThickness', val);
      });
    }

    // Submode 4: Compton Scattering Controls
    const sliderComptonE0 = document.getElementById('slider-compton-e0');
    const labelComptonE0 = document.getElementById('label-compton-e0');
    if (sliderComptonE0 && labelComptonE0) {
      sliderComptonE0.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelComptonE0.textContent = val.toFixed(1) + ' keV';
        if (nuclearSimulatorInstance) nuclearSimulatorInstance.setParam('comptonE0', val);
      });
    }

    const sliderComptonTheta = document.getElementById('slider-compton-theta');
    const labelComptonTheta = document.getElementById('label-compton-theta');
    if (sliderComptonTheta && labelComptonTheta) {
      sliderComptonTheta.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        labelComptonTheta.textContent = val.toFixed(1) + '°';
        if (nuclearSimulatorInstance) nuclearSimulatorInstance.setParam('comptonTheta', val);
      });
    }

    const setComptonParams = (e0, th) => {
      if (!nuclearSimulatorInstance) return;
      nuclearSimulatorInstance.setParam('comptonE0', e0);
      nuclearSimulatorInstance.setParam('comptonTheta', th);
      if (sliderComptonE0) sliderComptonE0.value = e0;
      if (labelComptonE0) labelComptonE0.textContent = e0.toFixed(1) + ' keV';
      if (sliderComptonTheta) sliderComptonTheta.value = th;
      if (labelComptonTheta) labelComptonTheta.textContent = th.toFixed(1) + '°';
      nuclearSimulatorInstance.render();
      if (window.syncAllNumericInputs) window.syncAllNumericInputs();
    };

    const btnComptonProb = document.getElementById('btn-compton-preset-prob');
    if (btnComptonProb) btnComptonProb.addEventListener('click', () => setComptonParams(100.0, 90.0));

    const btnComptonBack = document.getElementById('btn-compton-preset-back');
    if (btnComptonBack) btnComptonBack.addEventListener('click', () => setComptonParams(100.0, 180.0));

    const btnComptonGraze = document.getElementById('btn-compton-preset-graze');
    if (btnComptonGraze) btnComptonGraze.addEventListener('click', () => setComptonParams(100.0, 45.0));
  }

  function updateNuclearTelemetryUI(telem) {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    if (telem.subMode === 'compton_scattering') {
      if (telem.comptonEPrime) setText('nuclear-telem-eb', telem.comptonEPrime);
      if (telem.comptonKe) setText('nuclear-telem-activity', telem.comptonKe);
      if (telem.comptonTheta) setText('nuclear-telem-halflife', telem.comptonTheta);
      if (telem.comptonPhi) setText('nuclear-telem-radiation', 'φ = ' + telem.comptonPhi);
      return;
    }
    if (telem.ebPerA) setText('nuclear-telem-eb', telem.ebPerA);
    if (telem.activityBq) setText('nuclear-telem-activity', telem.activityBq);
    if (telem.halfLife) setText('nuclear-telem-halflife', telem.halfLife);
    if (telem.radiationType) setText('nuclear-telem-radiation', telem.radiationType.toUpperCase());
  }

  function launchNuclearSimulatorPreset(theoryId) {
    switchView('view-simulator');
    if (!nuclearSimulatorInstance) return;

    let num = 1;
    if (typeof theoryId === 'number') {
      num = theoryId;
    } else if (typeof theoryId === 'string') {
      const match = theoryId.match(/\d+$/);
      if (match) num = parseInt(match[0], 10);
    }

    let targetSubMode = 'binding_energy';
    if (num === 1 || num === 2 || num === 3) {
      // Binding Energy & Stability Curve
      targetSubMode = 'binding_energy';
      nuclearSimulatorInstance.setParam('selectedNuclideIndex', (num === 2) ? 5 : 4);
      nuclearSimulatorInstance.reset();
    } else if (num === 4 || num === 6) {
      // Radiation Shielding & Dosimetry
      targetSubMode = 'shielding_dosimetry';
      nuclearSimulatorInstance.setParam('radiationType', (num === 4) ? 'alpha' : 'gamma');
      nuclearSimulatorInstance.setParam('shieldMaterial', 'lead');
      nuclearSimulatorInstance.reset();
    } else {
      // Stochastic Decay & Half-Life
      targetSubMode = 'decay_stochastic';
      nuclearSimulatorInstance.setParam('halfLife', 5.0);
      nuclearSimulatorInstance.reset();
    }

    switchSimMode('nuclear', targetSubMode);
  }

  // ========================================================================
  // TRACK 3: CIVIL ENGINEERING STATICS & MECHANICS SIMULATOR CONTROLLER
  // ========================================================================
  function initCivilSimulator() {
    const canvas = document.getElementById('civil-canvas');
    if (!canvas || !window.CivilBeamSimulator) return;

    civilSimulatorInstance = new window.CivilBeamSimulator(canvas, {
      onTelemetryUpdate: updateCivilTelemetryUI
    });
    window.civilSimulatorInstance = civilSimulatorInstance;
    setupCivilSimulatorControls();
    civilSimulatorInstance.render();
  }

  function setupCivilSimulatorControls() {
    // Submode Buttons
    const submodeBtns = document.querySelectorAll('#sim-container-civil .submode-btn');
    submodeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.submode;
        if (civilSimulatorInstance) civilSimulatorInstance.setSubMode(mode);

        submodeBtns.forEach(b => b.classList.toggle('active', b === btn));

        const grpBeam = document.getElementById('controls-civil-beam');
        const grpMohr = document.getElementById('controls-civil-mohr');
        const grpTruss = document.getElementById('controls-civil-truss');
        const telemBeam = document.getElementById('telem-civil-beam');
        const telemMohr = document.getElementById('telem-civil-mohr');
        const telemTruss = document.getElementById('telem-civil-truss');
        const presetsBeam = document.getElementById('presets-civil-beam');
        const presetsTruss = document.getElementById('presets-civil-truss');

        const isMohr = (mode === 'mohr_circle');
        const isTruss = (mode === 'truss_analysis');
        const isBeam = (!isMohr && !isTruss);

        if (grpBeam) grpBeam.style.display = isBeam ? 'block' : 'none';
        if (grpMohr) grpMohr.style.display = isMohr ? 'block' : 'none';
        if (grpTruss) grpTruss.style.display = isTruss ? 'block' : 'none';
        if (telemBeam) telemBeam.style.display = isBeam ? 'grid' : 'none';
        if (telemMohr) telemMohr.style.display = isMohr ? 'grid' : 'none';
        if (telemTruss) telemTruss.style.display = isTruss ? 'grid' : 'none';
        if (presetsBeam) presetsBeam.style.display = isTruss ? 'none' : 'flex';
        if (presetsTruss) presetsTruss.style.display = isTruss ? 'flex' : 'none';

        // Sync mode buttons in nav bar
        document.querySelectorAll('.sim-mode-btn[data-sim-mode="civil"]').forEach(b => {
          const isActive = (b.dataset.submode === mode);
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      });
    });

    // Preset Buttons
    const bindClick = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    bindClick('btn-civ-preset-center', () => {
      if (!civilSimulatorInstance) return;
      civilSimulatorInstance.setSubMode('simply_supported');
      civilSimulatorInstance.setParam('length', 6.0);
      civilSimulatorInstance.setParam('pointLoadP', 40.0);
      civilSimulatorInstance.setParam('loadPosA', 3.0);
      civilSimulatorInstance.setParam('distLoadW', 0.0);
      syncCivilUIInputs();
    });

    bindClick('btn-civ-preset-udl', () => {
      if (!civilSimulatorInstance) return;
      civilSimulatorInstance.setSubMode('simply_supported');
      civilSimulatorInstance.setParam('length', 8.0);
      civilSimulatorInstance.setParam('pointLoadP', 0.0);
      civilSimulatorInstance.setParam('distLoadW', 15.0);
      syncCivilUIInputs();
    });

    bindClick('btn-civ-preset-combined', () => {
      if (!civilSimulatorInstance) return;
      civilSimulatorInstance.setSubMode('simply_supported');
      civilSimulatorInstance.setParam('length', 6.0);
      civilSimulatorInstance.setParam('pointLoadP', 30.0);
      civilSimulatorInstance.setParam('loadPosA', 2.0);
      civilSimulatorInstance.setParam('distLoadW', 10.0);
      syncCivilUIInputs();
    });

    bindClick('btn-civ-preset-cantilever-tip', () => {
      if (!civilSimulatorInstance) return;
      civilSimulatorInstance.setSubMode('cantilever');
      civilSimulatorInstance.setParam('length', 4.0);
      civilSimulatorInstance.setParam('pointLoadP', 25.0);
      civilSimulatorInstance.setParam('loadPosA', 4.0);
      civilSimulatorInstance.setParam('distLoadW', 5.0);
      syncCivilUIInputs();
    });

    bindClick('btn-civ-preset-pure-shear', () => {
      if (!civilSimulatorInstance) return;
      civilSimulatorInstance.setSubMode('mohr_circle');
      civilSimulatorInstance.setParam('sigmaX', 0.0);
      civilSimulatorInstance.setParam('sigmaY', 0.0);
      civilSimulatorInstance.setParam('tauXY', 50.0);
      civilSimulatorInstance.setParam('rotThetaDeg', 45.0);
      syncCivilUIInputs();
    });

    bindClick('btn-civ-reset', () => {
      if (civilSimulatorInstance) {
        civilSimulatorInstance.reset();
        syncCivilUIInputs();
      }
    });

    // Truss Presets
    bindClick('btn-civ-preset-truss-sym', () => {
      if (!civilSimulatorInstance) return;
      civilSimulatorInstance.setSubMode('truss_analysis');
      civilSimulatorInstance.setParam('trussSpanL', 4.0);
      civilSimulatorInstance.setParam('trussHeightH', 3.0);
      civilSimulatorInstance.setParam('trussLoadPx', 40.0);
      civilSimulatorInstance.setParam('trussLoadPy', 0.0);
      syncCivilUIInputs();
    });

    bindClick('btn-civ-preset-truss-tall', () => {
      if (!civilSimulatorInstance) return;
      civilSimulatorInstance.setSubMode('truss_analysis');
      civilSimulatorInstance.setParam('trussSpanL', 3.0);
      civilSimulatorInstance.setParam('trussHeightH', 5.0);
      civilSimulatorInstance.setParam('trussLoadPx', 60.0);
      civilSimulatorInstance.setParam('trussLoadPy', 0.0);
      syncCivilUIInputs();
    });

    bindClick('btn-civ-preset-truss-lateral', () => {
      if (!civilSimulatorInstance) return;
      civilSimulatorInstance.setSubMode('truss_analysis');
      civilSimulatorInstance.setParam('trussSpanL', 4.0);
      civilSimulatorInstance.setParam('trussHeightH', 3.0);
      civilSimulatorInstance.setParam('trussLoadPx', 50.0);
      civilSimulatorInstance.setParam('trussLoadPy', 0.0);
      syncCivilUIInputs();
    });

    bindClick('btn-civ-reset-truss', () => {
      if (civilSimulatorInstance) {
        civilSimulatorInstance.reset();
        syncCivilUIInputs();
      }
    });

    // Sliders
    const bindSlider = (id, paramKey, labelId, formatFn) => {
      const slider = document.getElementById(id);
      const label = document.getElementById(labelId);
      if (slider && label) {
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          label.textContent = formatFn(val);
          if (civilSimulatorInstance) civilSimulatorInstance.setParam(paramKey, val);
        });
      }
    };

    bindSlider('slider-civ-len', 'length', 'label-civ-len', v => v.toFixed(1) + ' m');
    bindSlider('slider-civ-p', 'pointLoadP', 'label-civ-p', v => v.toFixed(1) + ' kN');
    bindSlider('slider-civ-a', 'loadPosA', 'label-civ-a', v => v.toFixed(1) + ' m');
    bindSlider('slider-civ-w', 'distLoadW', 'label-civ-w', v => v.toFixed(1) + ' kN/m');
    bindSlider('slider-civ-ei', 'flexRigidityEI', 'label-civ-ei', v => v.toLocaleString() + ' kN·m²');
    bindSlider('slider-civ-sx', 'sigmaX', 'label-civ-sx', v => v.toFixed(1) + ' MPa');
    bindSlider('slider-civ-sy', 'sigmaY', 'label-civ-sy', v => v.toFixed(1) + ' MPa');
    bindSlider('slider-civ-txy', 'tauXY', 'label-civ-txy', v => v.toFixed(1) + ' MPa');
    bindSlider('slider-civ-theta', 'rotThetaDeg', 'label-civ-theta', v => v.toFixed(1) + '°');

    // Truss Sliders
    bindSlider('slider-civ-truss-l', 'trussSpanL', 'label-civ-truss-l', v => v.toFixed(1) + ' m');
    bindSlider('slider-civ-truss-h', 'trussHeightH', 'label-civ-truss-h', v => v.toFixed(1) + ' m');
    bindSlider('slider-civ-truss-px', 'trussLoadPx', 'label-civ-truss-px', v => v.toFixed(1) + ' kN');
    bindSlider('slider-civ-truss-py', 'trussLoadPy', 'label-civ-truss-py', v => v.toFixed(1) + ' kN');
  }

  function syncCivilUIInputs() {
    if (!civilSimulatorInstance) return;
    const p = civilSimulatorInstance.params;
    const sub = civilSimulatorInstance.subMode;

    const subBtns = document.querySelectorAll('#sim-container-civil .submode-btn');
    subBtns.forEach(b => b.classList.toggle('active', b.dataset.submode === sub));

    const grpBeam = document.getElementById('controls-civil-beam');
    const grpMohr = document.getElementById('controls-civil-mohr');
    const grpTruss = document.getElementById('controls-civil-truss');
    const telemBeam = document.getElementById('telem-civil-beam');
    const telemMohr = document.getElementById('telem-civil-mohr');
    const telemTruss = document.getElementById('telem-civil-truss');
    const presetsBeam = document.getElementById('presets-civil-beam');
    const presetsTruss = document.getElementById('presets-civil-truss');

    const isMohr = (sub === 'mohr_circle');
    const isTruss = (sub === 'truss_analysis');
    const isBeam = (!isMohr && !isTruss);

    if (grpBeam) grpBeam.style.display = isBeam ? 'block' : 'none';
    if (grpMohr) grpMohr.style.display = isMohr ? 'block' : 'none';
    if (grpTruss) grpTruss.style.display = isTruss ? 'block' : 'none';
    if (telemBeam) telemBeam.style.display = isBeam ? 'grid' : 'none';
    if (telemMohr) telemMohr.style.display = isMohr ? 'grid' : 'none';
    if (telemTruss) telemTruss.style.display = isTruss ? 'grid' : 'none';
    if (presetsBeam) presetsBeam.style.display = isTruss ? 'none' : 'flex';
    if (presetsTruss) presetsTruss.style.display = isTruss ? 'flex' : 'none';

    const setSlider = (id, lblId, val, fmt) => {
      const s = document.getElementById(id);
      const l = document.getElementById(lblId);
      if (s) { s.value = val; s.dispatchEvent(new Event('input')); }
      if (l) l.textContent = fmt(val);
    };

    setSlider('slider-civ-len', 'label-civ-len', p.length, v => v.toFixed(1) + ' m');
    setSlider('slider-civ-p', 'label-civ-p', p.pointLoadP, v => v.toFixed(1) + ' kN');
    setSlider('slider-civ-a', 'label-civ-a', p.loadPosA, v => v.toFixed(1) + ' m');
    setSlider('slider-civ-w', 'label-civ-w', p.distLoadW, v => v.toFixed(1) + ' kN/m');
    setSlider('slider-civ-ei', 'label-civ-ei', p.flexRigidityEI, v => v.toLocaleString() + ' kN·m²');
    setSlider('slider-civ-sx', 'label-civ-sx', p.sigmaX, v => v.toFixed(1) + ' MPa');
    setSlider('slider-civ-sy', 'label-civ-sy', p.sigmaY, v => v.toFixed(1) + ' MPa');
    setSlider('slider-civ-txy', 'label-civ-txy', p.tauXY, v => v.toFixed(1) + ' MPa');
    setSlider('slider-civ-theta', 'label-civ-theta', p.rotThetaDeg, v => v.toFixed(1) + '°');

    // Truss Sliders sync
    setSlider('slider-civ-truss-l', 'label-civ-truss-l', p.trussSpanL || 4.0, v => v.toFixed(1) + ' m');
    setSlider('slider-civ-truss-h', 'label-civ-truss-h', p.trussHeightH || 3.0, v => v.toFixed(1) + ' m');
    setSlider('slider-civ-truss-px', 'label-civ-truss-px', p.trussLoadPx !== undefined ? p.trussLoadPx : 40.0, v => v.toFixed(1) + ' kN');
    setSlider('slider-civ-truss-py', 'label-civ-truss-py', p.trussLoadPy !== undefined ? p.trussLoadPy : 0.0, v => v.toFixed(1) + ' kN');

    if (window.syncAllNumericInputs) window.syncAllNumericInputs();
  }

  function updateCivilTelemetryUI(telem) {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    if (telem.subMode === 'simply_supported') {
      const lblRb = document.getElementById('civ-telem-rb-label');
      if (lblRb) lblRb.textContent = 'แรงปฏิกิริยา R_B';
      setText('civ-telem-ra', telem.ra);
      setText('civ-telem-rb', telem.rb);
      setText('civ-telem-maxv', telem.maxV);
      setText('civ-telem-maxm', telem.maxM);
      setText('civ-telem-maxdef', telem.maxDef);
    } else if (telem.subMode === 'cantilever') {
      const lblRb = document.getElementById('civ-telem-rb-label');
      if (lblRb) lblRb.textContent = 'โมเมนต์ยึดแน่น M_A';
      setText('civ-telem-ra', telem.ra);
      setText('civ-telem-rb', telem.ma);
      setText('civ-telem-maxv', telem.maxV);
      setText('civ-telem-maxm', telem.maxM);
      setText('civ-telem-maxdef', telem.maxDef);
    } else if (telem.subMode === 'mohr_circle') {
      setText('civ-telem-s1', telem.sigma1);
      setText('civ-telem-s2', telem.sigma2);
      setText('civ-telem-taumax', telem.tauMax);
      setText('civ-telem-thetap', telem.thetaP);
      setText('civ-telem-sxprime', telem.sxPrime);
      setText('civ-telem-txyprime', telem.txyPrime);
    } else if (telem.subMode === 'truss_analysis') {
      setText('civ-telem-ax', telem.ax);
      setText('civ-telem-ay', telem.ay);
      setText('civ-telem-cy', telem.cy);
      setText('civ-telem-fab', telem.fab);
      setText('civ-telem-fbc', telem.fbc);
      setText('civ-telem-fac', telem.fac);
    }
  }

  function launchCivilSimulatorPreset(theoryId) {
    switchView('view-simulator');
    switchSimMode('civil', 'simply_supported');
    if (!civilSimulatorInstance) return;

    if (theoryId === 'civ-th03') {
      civilSimulatorInstance.setSubMode('simply_supported');
      syncCivilUIInputs();
    } else if (theoryId === 'civ-th06') {
      civilSimulatorInstance.setSubMode('mohr_circle');
      syncCivilUIInputs();
    }
  }

  // ========================================================================
  // UNIVERSAL DIRECT NUMERIC TYPING INPUTS & BIDIRECTIONAL SYNC
  // ========================================================================
  function setupUniversalNumericInputs() {
    if (!window.__hasNumInputFallback) {
      window.__hasNumInputFallback = true;
      const origGetElementById = document.getElementById.bind(document);
      document.getElementById = function (id) {
        let el = origGetElementById(id);
        if (!el && typeof id === 'string' && id.startsWith('num-')) {
          el = origGetElementById(id.replace(/^num-/, 'input-'));
        }
        return el;
      };
    }

    const sliders = document.querySelectorAll('input[type="range"]');

    sliders.forEach(slider => {
      // Avoid duplicate wrap
      if (slider.parentElement && slider.parentElement.classList.contains('slider-control-row')) {
        return;
      }

      // Check if this slider's control group already has an explicit direct number input (e.g. input-v0, input-rocket-m0)
      const matchingInput = slider.id ? document.getElementById(slider.id.replace(/^slider-/, 'input-')) : null;
      const group = slider.closest('.slider-group, .control-group, .sim-control-group, .param-group');
      const groupInput = group ? group.querySelector('.direct-number-input') : null;
      if (matchingInput || groupInput) {
        // Already has direct number input in this group! Do not inject a duplicate number input.
        return;
      }

      const parent = slider.parentElement;
      if (!parent) return;

      const row = document.createElement('div');
      row.className = 'slider-control-row';

      parent.insertBefore(row, slider);
      row.appendChild(slider);

      const numInput = document.createElement('input');
      numInput.type = 'number';
      numInput.className = 'param-num-input';
      if (slider.id) {
        numInput.id = 'num-' + slider.id.replace(/^slider-/, '');
      }
      numInput.min = slider.min;
      numInput.max = slider.max;
      numInput.step = slider.step || 'any';
      numInput.value = slider.value;
      numInput.title = 'พิมพ์ตัวเลขเพื่อกำหนดค่าโดยตรง (Type direct numeric value)';
      numInput.setAttribute('aria-label', 'พิมพ์ตัวเลขโดยตรงสำหรับ ' + (slider.id || 'parameter'));

      // 1. Slider -> Number input synchronization
      slider.addEventListener('input', () => {
        numInput.value = slider.value;
      });
      slider.addEventListener('change', () => {
        numInput.value = slider.value;
      });

      // 2. Number input -> Slider bidirectional synchronization
      numInput.addEventListener('input', () => {
        const raw = numInput.value.trim();
        if (raw === '' || raw === '-' || raw === '.') return; // User is in the middle of typing
        let val = parseFloat(raw);
        if (!isNaN(val)) {
          const min = slider.min !== '' ? parseFloat(slider.min) : -Infinity;
          const max = slider.max !== '' ? parseFloat(slider.max) : Infinity;
          if (val >= min && val <= max) {
            slider.value = val;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            slider.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });

      const commitNumberInput = () => {
        let val = parseFloat(numInput.value);
        if (isNaN(val)) {
          numInput.value = slider.value;
        } else {
          const min = slider.min !== '' ? parseFloat(slider.min) : -Infinity;
          const max = slider.max !== '' ? parseFloat(slider.max) : Infinity;
          if (val < min) val = min;
          if (val > max) val = max;
          numInput.value = val;
          slider.value = val;
          slider.dispatchEvent(new Event('input', { bubbles: true }));
          slider.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };

      numInput.addEventListener('blur', commitNumberInput);
      numInput.addEventListener('change', commitNumberInput);
      numInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          commitNumberInput();
          numInput.blur();
        }
      });

      row.appendChild(numInput);
    });

    // Bidirectional sync for direct-number-input elements in slider headers (e.g. input-v0 <-> slider-v0)
    document.querySelectorAll('.direct-number-input').forEach(input => {
      const sliderId = input.id.replace(/^input-/, 'slider-');
      const slider = document.getElementById(sliderId);
      if (!slider) return;

      slider.addEventListener('input', () => { input.value = slider.value; });
      slider.addEventListener('change', () => { input.value = slider.value; });

      const commit = () => {
        let val = parseFloat(input.value);
        if (isNaN(val)) {
          input.value = slider.value;
        } else {
          const min = slider.min !== '' ? parseFloat(slider.min) : -Infinity;
          const max = slider.max !== '' ? parseFloat(slider.max) : Infinity;
          if (val < min) val = min;
          if (val > max) val = max;
          input.value = val;
          slider.value = val;
          slider.dispatchEvent(new Event('input', { bubbles: true }));
          slider.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };
      input.addEventListener('input', () => {
        const raw = input.value.trim();
        if (raw === '' || raw === '-' || raw === '.') return;
        let val = parseFloat(raw);
        if (!isNaN(val)) {
          slider.value = val;
          slider.dispatchEvent(new Event('input', { bubbles: true }));
          slider.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      input.addEventListener('blur', commit);
      input.addEventListener('change', commit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { commit(); input.blur(); }
      });
    });

    // Global synchronizer helper for presets and resets
    window.syncAllNumericInputs = () => {
      document.querySelectorAll('.slider-control-row').forEach(row => {
        const slider = row.querySelector('input[type="range"]');
        const numInput = row.querySelector('.param-num-input');
        if (slider && numInput) {
          numInput.value = slider.value;
        }
      });
      document.querySelectorAll('.direct-number-input').forEach(input => {
        const sliderId = input.id.replace(/^input-/, 'slider-');
        const slider = document.getElementById(sliderId);
        if (slider) {
          input.value = slider.value;
        }
      });
    };
  }

  // ========================================================================
  // UNIVERSAL SIMULATION ANIMATION SPEED CONTROLS (0.25x, 0.5x, 1.0x, 2.0x, 4.0x)
  // ========================================================================
  window.currentGlobalSimSpeed = 1.0;

  function setUniversalSimulationSpeed(speed) {
    const s = parseFloat(speed);
    if (isNaN(s) || s <= 0) return;
    window.currentGlobalSimSpeed = s;

    // 1. Update all simulator instances
    const simInstances = [
      window.simulatorInstance,
      window.projectileSimulatorInstance,
      window.vehicleSimulatorInstance,
      window.collisionSimulatorInstance,
      window.threejsSimulatorInstance,
      window.circularSimulatorInstance,
      window.oscillationSimulatorInstance,
      window.waveSimulatorInstance,
      window.thermoSimulatorInstance,
      window.emSimulatorInstance,
      window.nuclearSimulatorInstance,
      window.civilSimulatorInstance
    ];

    simInstances.forEach(sim => {
      if (!sim) return;
      if (typeof sim.setTimeScale === 'function') {
        sim.setTimeScale(s);
      } else {
        sim.timeScale = s;
      }
    });

    // 2. Sync all speed buttons active class across the page
    document.querySelectorAll('.btn-speed').forEach(btn => {
      const btnSpeed = parseFloat(btn.dataset.speed);
      if (Math.abs(btnSpeed - s) < 0.01) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  function setupUniversalSpeedControls() {
    // Find all simulator controls bars
    const controlBars = document.querySelectorAll(
      '.sim-controls-bar, .canvas-controls-bar, .vehicle-controls-bar, #sim-container-civil .sim-controls-bar'
    );

    const speeds = [
      { label: '0.25x', val: 0.25 },
      { label: '0.5x', val: 0.5 },
      { label: '1.0x', val: 1.0 },
      { label: '2.0x', val: 2.0 },
      { label: '4.0x', val: 4.0 }
    ];

    controlBars.forEach(bar => {
      // Don't add if already exists in this bar
      if (bar.querySelector('.sim-speed-control-group')) return;

      const group = document.createElement('div');
      group.className = 'sim-speed-control-group';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'ความเร็วแอนิเมชัน (Animation Speed)');

      const label = document.createElement('span');
      label.className = 'sim-speed-label';
      label.textContent = '⏱️';
      label.title = 'ปรับความเร็วแอนิเมชัน (Animation Speed)';
      group.appendChild(label);

      speeds.forEach(sp => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-speed' + (Math.abs(sp.val - window.currentGlobalSimSpeed) < 0.01 ? ' active' : '');
        btn.dataset.speed = sp.val.toString();
        btn.textContent = sp.label;
        btn.setAttribute('aria-label', `ความเร็วแอนิเมชัน ${sp.label}`);
        btn.setAttribute('aria-pressed', Math.abs(sp.val - window.currentGlobalSimSpeed) < 0.01 ? 'true' : 'false');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          setUniversalSimulationSpeed(sp.val);
        });
        group.appendChild(btn);
      });

      // Append to the control bar
      bar.appendChild(group);
    });
  }

  // ========================================================================
  // PROGRESSIVE TAB STEP NAVIGATION BAR GENERATOR
  // ========================================================================
  function renderTabStepNavBar(stepNum, prevInfo, nextInfo) {
    let prevBtn = prevInfo ? `<button class="btn-prev-step" onclick="window.PhysicsApp.switchView('${prevInfo.view}');">${prevInfo.label}</button>` : `<button class="btn-prev-step" onclick="window.PhysicsApp.switchView('view-chapter-select');">← กลับหน้าเลือกบท</button>`;
    let nextBtn = nextInfo ? `<button class="btn-next-step" onclick="window.PhysicsApp.switchView('${nextInfo.view}');">${nextInfo.label}</button>` : '';

    return `
      <div class="tab-step-nav-bar">
        ${prevBtn}
        <div class="step-status-indicator">
          <span class="step-dot"></span>
          <span>ลำดับการเรียนรู้ ขั้นที่ ${stepNum} จาก 5</span>
        </div>
        ${nextBtn}
      </div>
    `;
  }

  window.PhysicsApp = {
    init,
    switchView,
    switchSimMode,
    openChapter,
    getCurrentChapter: () => currentChapter,
    openDrawer: () => {
      const drawer = document.getElementById('drawer-navigation-catalog');
      const backdrop = document.getElementById('drawer-backdrop');
      const btnHamburger = document.getElementById('btn-hamburger-menu');
      const btnClose = document.getElementById('btn-close-drawer');
      if (drawer && backdrop) {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        if (btnHamburger) btnHamburger.setAttribute('aria-expanded', 'true');
        backdrop.classList.add('active');
        backdrop.setAttribute('aria-hidden', 'false');
        if (btnClose) btnClose.focus();
      }
    },
    closeDrawer: () => {
      const drawer = document.getElementById('drawer-navigation-catalog');
      const backdrop = document.getElementById('drawer-backdrop');
      const btnHamburger = document.getElementById('btn-hamburger-menu');
      if (drawer && backdrop) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        if (btnHamburger) {
          btnHamburger.setAttribute('aria-expanded', 'false');
          btnHamburger.focus();
        }
        backdrop.classList.remove('active');
        backdrop.setAttribute('aria-hidden', 'true');
      }
    },
    launchSimulatorForTheory,
    launchSimulatorPreset,
    launchCircularSimulatorPreset,
    getSimulator: () => simulatorInstance,
    getVehicleSimulator: () => vehicleSimulatorInstance,
    getCollisionSimulator: () => collisionSimulatorInstance,
    getThreejsSimulator: () => threejsSimulatorInstance,
    getCircularSimulator: () => circularSimulatorInstance,
    getOscillationSimulator: () => oscillationSimulatorInstance,
    launchOscillationSimulatorPreset,
    getWaveSimulator: () => waveSimulatorInstance,
    launchWaveSimulatorPreset,
    getThermoSimulator: () => thermoSimulatorInstance,
    launchThermoSimulatorPreset,
    getCurrentChapter: () => currentChapter,
    getCurrentView: () => currentView,
    getEMSimulator: () => emSimulatorInstance,
    launchEMSimulatorPreset,
    getNuclearSimulator: () => nuclearSimulatorInstance,
    launchNuclearSimulatorPreset,
    getCivilSimulator: () => civilSimulatorInstance,
    launchCivilSimulatorPreset,
    syncAllNumericInputs: () => { if (window.syncAllNumericInputs) window.syncAllNumericInputs(); },
    renderAnalyticalContent
  };

  window.getEMSimulator = () => emSimulatorInstance;
  window.switchSimMode = switchSimMode;
  window.switchView = switchView;
  window.App = window.PhysicsApp;

  document.addEventListener('DOMContentLoaded', init);
})();
