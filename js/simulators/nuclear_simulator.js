/**
 * nuclear_simulator.js - Interactive Nuclear Physics, Binding Energy, Decay & Dosimetry Simulator
 * Part of PhysicsNoza 3.0 Standardized Curriculum (Chapter 07 Module)
 *
 * Simulates:
 *   Submode 1: Nuclear Binding Energy Curve & Liquid Drop Model (Eb/A vs A, Fusion/Fission energy yields, SEMF formula)
 *   Submode 2: Stochastic Radioactive Decay & Half-life Workbench (Monte Carlo discrete atom decay, live exponential plot)
 *   Submode 3: Radiation Shielding & Dosimetry (Alpha, Beta, Gamma attenuation, Bragg peak, HVL, Bq/Gy/Sv)
 *
 * Academic Standards:
 *   - Krane, K. S. (1988), Introductory Nuclear Physics (3rd Ed), John Wiley & Sons.
 *   - Lilley, J. S. (2001), Nuclear Physics: Principles and Applications, John Wiley & Sons.
 *   - ICRP (2007), Recommendations of the International Commission on Radiological Protection (Pub 103).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NuclearSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class NuclearSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for NuclearSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Sub-modes: 'binding_energy' | 'decay_stochastic' | 'shielding_dosimetry'
      this.subMode = 'binding_energy';

      // Physical Parameters
      this.params = {
        // Submode 1: Binding energy
        selectedNuclideIndex: 4, // 56Fe default
        showSemfCurve: true,

        // Submode 2: Decay
        isotope: 'C14',          // 'C14' | 'I131' | 'Rn222'
        halfLife: 5.0,           // sim seconds
        decayConstant: Math.LN2 / 5.0,

        // Submode 3: Shielding
        radiationType: 'gamma',  // 'alpha' | 'beta' | 'gamma'
        shieldMaterial: 'lead',  // 'paper' | 'aluminum' | 'lead' | 'concrete'
        shieldThickness: 20,     // mm

        // Submode 4: Compton Scattering
        comptonTheta: 90.0,      // Scattering angle in degrees (0 to 180)
        comptonE0: 100.0         // Incident photon energy (keV)
      };

      // Submode 1 Benchmark Nuclides (A, Z, Symbol, Eb/A in MeV)
      this.nuclides = [
        { name: 'Deuterium', sym: '²H', a: 2, z: 1, ebPerA: 1.11, color: '#38bdf8' },
        { name: 'Helium-4', sym: '⁴He', a: 4, z: 2, ebPerA: 7.07, color: '#4ade80' },
        { name: 'Lithium-6', sym: '⁶Li', a: 6, z: 3, ebPerA: 5.33, color: '#a855f7' },
        { name: 'Carbon-12', sym: '¹²C', a: 12, z: 6, ebPerA: 7.68, color: '#38bdf8' },
        { name: 'Oxygen-16', sym: '¹⁶O', a: 16, z: 8, ebPerA: 7.98, color: '#4ade80' },
        { name: 'Iron-56', sym: '⁵⁶Fe', a: 56, z: 26, ebPerA: 8.79, color: '#ef4444' }, // Peak
        { name: 'Nickel-62', sym: '⁶²Ni', a: 62, z: 28, ebPerA: 8.79, color: '#f59e0b' },
        { name: 'Tin-120', sym: '¹²⁰Sn', a: 120, z: 50, ebPerA: 8.50, color: '#38bdf8' },
        { name: 'Lead-208', sym: '²⁰⁸Pb', a: 208, z: 82, ebPerA: 7.87, color: '#94a3b8' }, // Heaviest truly stable
        { name: 'Bismuth-209', sym: '²⁰⁹Bi', a: 209, z: 83, ebPerA: 7.84, color: '#ec4899', isRadioactiveStart: true }, // Heaviest primordial alpha-decay
        { name: 'Polonium-210', sym: '²¹⁰Po', a: 210, z: 84, ebPerA: 7.83, color: '#d946ef' },
        { name: 'Uranium-235', sym: '²³⁵U', a: 235, z: 92, ebPerA: 7.59, color: '#f43f5e' },
        { name: 'Uranium-238', sym: '²³⁸U', a: 238, z: 92, ebPerA: 7.57, color: '#fb923c' }
      ];

      // Submode 2: Stochastic Atoms (180 atoms)
      this.totalAtoms = 180;
      this.atoms = [];
      this.decayHistory = [];
      this.simTime = 0;
      this.initAtoms();

      // Submode 3: Radiation particles
      this.radiationParticles = [];
      this.absorptionSparks = [];
      this.sourceEmissionTimer = 0;

      // Submode 4: Compton Scattering
      this.comptonTime = 0;
      this.comptonPhotonProgress = 0;

      // Resolution and interaction
      this._setupCanvasResolution();
      window.addEventListener('resize', () => this.resize());
      this.setupInteraction();

      // Loop Control
      this.isPlaying = true;
      this.animId = null;
      this.lastTimestamp = performance.now();

      this.start();
    }

    _setupCanvasResolution() {
      const parentW = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 0;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      const width = parentW > 0 ? Math.round(parentW) : (rect.width > 0 ? Math.round(rect.width) : Math.min(window.innerWidth - 32, 850));
      const height = width < 600 ? 520 : 480;

      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.canvas.style.width = '100%';
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.height = 'auto';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = width;
      this.height = height;
      this.dpr = dpr;
    }

    resize() {
      this._setupCanvasResolution();
      this.render();
    }

    // Shared geometry for shielding barrier
    getShieldBounds() {
      const w = this.width || 800;
      const srcX = 25;
      const detX = w - 70;
      const thickness = Math.max(0, this.params.shieldThickness || 0);
      const shieldW = thickness <= 0 ? 0 : Math.max(16, Math.min(75, thickness * 2.0));
      const visualW = shieldW > 0 ? shieldW : 16;
      const shieldX = Math.round(srcX + 75 + (detX - srcX - 75 - visualW) * 0.45);
      return { srcX, detX, shieldX, shieldW };
    }

    getAttenuationCoeff() {
      if (this.params.radiationType === 'alpha') return 999;
      if (this.params.radiationType === 'beta') {
        if (this.params.shieldMaterial === 'paper') return 8.0;
        if (this.params.shieldMaterial === 'aluminum') return 2.5;
        if (this.params.shieldMaterial === 'concrete') return 5.0;
        if (this.params.shieldMaterial === 'lead') return 45.0;
        return 2.5;
      }
      if (this.params.radiationType === 'gamma') {
        if (this.params.shieldMaterial === 'paper') return 0.01;
        if (this.params.shieldMaterial === 'aluminum') return 0.20;
        if (this.params.shieldMaterial === 'concrete') return 0.14;
        if (this.params.shieldMaterial === 'lead') return 0.77;
      }
      return 0.77;
    }

    // ==========================================
    // INITIALIZATION HELPERS
    // ==========================================

    initAtoms() {
      this.atoms = [];
      this.decayHistory = [];
      this.simTime = 0;
      const cols = 18;
      const rows = 10;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          this.atoms.push({
            id: r * cols + c,
            col: c,
            row: r,
            jitterX: (Math.random() - 0.5) * 0.35,
            jitterY: (Math.random() - 0.5) * 0.35,
            decayed: false,
            decayTime: 0,
            flashTimer: 0
          });
        }
      }
      this.decayHistory.push({ t: 0, count: this.atoms.length });
    }

    initRadiationStream() {
      this.radiationParticles = [];
      this.absorptionSparks = [];
      const { srcX, detX, shieldX, shieldW } = this.getShieldBounds();
      const isMobile = (this.width || 800) < 600;
      const srcY = isMobile ? 180 : 210;

      let color = '#38bdf8';
      let r = 4;
      let speed = 320;
      if (this.params.radiationType === 'alpha') {
        color = '#ef4444';
        r = 5.5;
        speed = 220;
      } else if (this.params.radiationType === 'beta') {
        color = '#f59e0b';
        r = 3;
        speed = 390;
      } else if (this.params.radiationType === 'gamma') {
        color = '#a855f7';
        r = 2.5;
        speed = 480;
      }

      // Pre-populate particles along beam so there is never a blank gap or interruption
      const count = 36;
      for (let i = 0; i < count; i++) {
        const xPos = srcX + 48 + (i / count) * (detX - srcX - 48);
        if (xPos > shieldX) {
          let transProb = 1.0;
          if (this.params.radiationType === 'alpha') transProb = 0.0;
          else if (this.params.radiationType === 'beta') {
            if (this.params.shieldMaterial === 'paper') transProb = 0.90;
            else if (this.params.shieldMaterial === 'aluminum') transProb = 0.25;
            else transProb = 0.03;
          } else if (this.params.radiationType === 'gamma') {
            if (this.params.shieldMaterial === 'paper') transProb = 0.98;
            else if (this.params.shieldMaterial === 'aluminum') transProb = 0.70;
            else if (this.params.shieldMaterial === 'concrete') transProb = 0.50;
            else if (this.params.shieldMaterial === 'lead') transProb = 0.20;
          }
          if (Math.random() > transProb) continue;
        }

        this.radiationParticles.push({
          x: xPos,
          y: srcY + (Math.random() - 0.5) * 36,
          vx: speed,
          vy: (Math.random() - 0.5) * 16,
          type: this.params.radiationType,
          color: color,
          r: r
        });
      }
    }

    setupInteraction() {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = (this.width || 800) / rect.width;
        const scaleY = (this.height || 480) / rect.height;
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
      };

      this.canvas.addEventListener('click', (e) => {
        if (this.subMode === 'binding_energy') {
          const pos = getPos(e);
          const w = this.width || 800;
          const h = this.height || 480;
          const isSmallScreen = w < 600;
          const originX = w < 500 ? 45 : 70;
          const originY = Math.min(370, h - (isSmallScreen ? 110 : 85));
          const plotW = Math.max(220, w - originX - (w < 500 ? 20 : 50));
          const plotH = Math.min(270, originY - 75);

          for (let i = 0; i < this.nuclides.length; i++) {
            const n = this.nuclides[i];
            const px = originX + (n.a / 240) * plotW;
            const py = originY - (n.ebPerA / 10) * plotH;
            if (Math.hypot(pos.x - px, pos.y - py) < 14) {
              this.params.selectedNuclideIndex = i;
              const selElem = document.getElementById('select-nuclide');
              if (selElem) selElem.value = i;
              this.render();
              this.emitTelemetry();
              break;
            }
          }
        }
      });
    }

    // ==========================================
    // CONTROL API
    // ==========================================

    setSubMode(subMode) {
      if (['binding_energy', 'decay_stochastic', 'shielding_dosimetry', 'compton_scattering'].includes(subMode)) {
        this.subMode = subMode;
        if (subMode === 'decay_stochastic') {
          this.initAtoms();
        } else if (subMode === 'shielding_dosimetry') {
          this.initRadiationStream();
        } else if (subMode === 'compton_scattering') {
          this.comptonTime = 0;
          this.comptonPhotonProgress = 0;
        }
        this.render();
        this.emitTelemetry();
      }
    }

    setParam(key, value) {
      if (this.params[key] !== undefined) {
        this.params[key] = value;
        if (key === 'halfLife') {
          this.params.decayConstant = Math.LN2 / Math.max(0.5, value);
        } else if (key === 'radiationType' || key === 'shieldMaterial' || key === 'shieldThickness') {
          if (this.subMode === 'shielding_dosimetry') {
            this.initRadiationStream();
          }
        }
        this.render();
        this.emitTelemetry();
      }
    }

    play() {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.lastTimestamp = performance.now();
        this.start();
      }
    }

    pause() {
      this.isPlaying = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    togglePlay() {
      if (this.isPlaying) this.pause();
      else this.play();
    }

    reset() {
      if (this.subMode === 'binding_energy') {
        this.params.selectedNuclideIndex = 5; // 56Fe
      } else if (this.subMode === 'decay_stochastic') {
        this.initAtoms();
      } else if (this.subMode === 'shielding_dosimetry') {
        this.radiationParticles = [];
      }
      this.render();
      this.emitTelemetry();
    }

    step(dt = 0.02) {
      this.update(dt);
      this.render();
      this.emitTelemetry();
    }

    start() {
      const loop = (timestamp) => {
        if (!this.isPlaying) return;
        const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.05);
        this.lastTimestamp = timestamp;

        const effectiveDt = dt * (this.timeScale !== undefined ? this.timeScale : 1.0);
        this.update(effectiveDt);
        this.render();
        this.emitTelemetry();

        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    setTimeScale(scale) {
      this.timeScale = (typeof scale === 'number' && scale > 0) ? scale : 1.0;
    }

    destroy() {
      this.pause();
      this.atoms = [];
      this.radiationParticles = [];
    }

    // ==========================================
    // PHYSICS UPDATES
    // ==========================================

    update(dt) {
      if (this.subMode === 'decay_stochastic') {
        this.simTime += dt;
        const lambda = this.params.decayConstant;
        const pDecay = 1 - Math.exp(-lambda * dt);

        let newlyDecayed = 0;
        this.atoms.forEach(atom => {
          if (!atom.decayed) {
            if (Math.random() < pDecay) {
              atom.decayed = true;
              atom.decayTime = this.simTime;
              atom.flashTimer = 0.4;
              newlyDecayed++;
            }
          } else if (atom.flashTimer > 0) {
            atom.flashTimer -= dt;
          }
        });

        const undecayedCount = this.atoms.filter(a => !a.decayed).length;
        if (this.decayHistory.length === 0 || this.simTime - this.decayHistory[this.decayHistory.length - 1].t >= 0.1) {
          this.decayHistory.push({ t: this.simTime, count: undecayedCount });
          if (this.decayHistory.length > 250) this.decayHistory.shift();
        }
      } else if (this.subMode === 'shielding_dosimetry') {
        this.sourceEmissionTimer += dt;
        if (this.sourceEmissionTimer > 0.055) {
          this.sourceEmissionTimer = 0;
          this.emitRadiationParticle();
        }

        // Shared geometry ensures 100% collision alignment with visual barrier
        const { shieldX, shieldW, detX } = this.getShieldBounds();
        const thickness = Math.max(0, this.params.shieldThickness || 0);
        const xCm = thickness / 10;
        const muVal = this.getAttenuationCoeff();
        const transFrac = (thickness <= 0) ? 1.0 : (this.params.radiationType === 'alpha') ? 0 : Math.exp(-muVal * xCm);

        for (let i = this.radiationParticles.length - 1; i >= 0; i--) {
          const p = this.radiationParticles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Check interaction with shield barrier once upon entry (Beer-Lambert exponential attenuation)
          if (shieldW > 0 && !p.shieldChecked && p.x >= shieldX) {
            p.shieldChecked = true;
            if (Math.random() > transFrac) {
              // Particle absorbed by shield! Trigger visible spark on shield face
              this.absorptionSparks = this.absorptionSparks || [];
              this.absorptionSparks.push({ x: p.x, y: p.y, timer: 0.35, color: p.color });
              this.radiationParticles.splice(i, 1);
              continue;
            }
          }

          // Absorbed by detector or offscreen removal
          if (p.x >= detX) {
            this.radiationParticles.splice(i, 1);
            continue;
          }
          if (p.x > (this.width || 800) || p.y < 0 || p.y > (this.height || 480)) {
            this.radiationParticles.splice(i, 1);
          }
        }

        // Update absorption sparks
        if (this.absorptionSparks && this.absorptionSparks.length > 0) {
          for (let s = this.absorptionSparks.length - 1; s >= 0; s--) {
            this.absorptionSparks[s].timer -= dt;
            if (this.absorptionSparks[s].timer <= 0) {
              this.absorptionSparks.splice(s, 1);
            }
          }
        }
      } else if (this.subMode === 'compton_scattering') {
        this.updateComptonScattering(dt);
      }
    }

    emitRadiationParticle() {
      const { srcX } = this.getShieldBounds();
      const isMobile = (this.width || 800) < 600;
      const srcY = isMobile ? 180 : 210;
      let color = '#38bdf8';
      let r = 4;
      let speed = 320;

      if (this.params.radiationType === 'alpha') {
        color = '#ef4444'; // Heavy He-4 (Alpha)
        r = 5.5;
        speed = 220;
      } else if (this.params.radiationType === 'beta') {
        color = '#f59e0b'; // Light electron (Beta)
        r = 3;
        speed = 390;
      } else if (this.params.radiationType === 'gamma') {
        color = '#a855f7'; // High freq photon (Gamma)
        r = 2.5;
        speed = 480;
      }

      this.radiationParticles.push({
        x: srcX + 48,
        y: srcY + (Math.random() - 0.5) * 36,
        vx: speed,
        vy: (Math.random() - 0.5) * 18,
        type: this.params.radiationType,
        color: color,
        r: r
      });
    }

    // ==========================================
    // RENDERING
    // ==========================================

    render() {
      if (!this.width || this.width <= 300) {
        this._setupCanvasResolution();
      }
      const ctx = this.ctx;
      const w = this.width || 800;
      const h = this.height || 480;

      // Dark background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      if (this.subMode === 'binding_energy') {
        this.renderBindingEnergyCurve();
      } else if (this.subMode === 'decay_stochastic') {
        this.renderDecayStochastic();
      } else if (this.subMode === 'shielding_dosimetry') {
        this.renderShieldingDosimetry();
      } else if (this.subMode === 'compton_scattering') {
        this.renderComptonScattering();
      }
    }

    // --- Submode 1: Binding Energy per Nucleon ---
    renderBindingEnergyCurve() {
      const ctx = this.ctx;
      const w = this.width || 800;
      const h = this.height || 480;

      const isSmallScreen = w < 600;
      const originX = w < 500 ? 45 : 70;
      const originY = Math.min(370, h - (isSmallScreen ? 110 : 85));
      const plotW = Math.max(220, w - originX - (w < 500 ? 20 : 50));
      const plotH = Math.min(270, originY - 75);

      // Header Banner - responsive and clean
      ctx.fillStyle = '#f8fafc';
      ctx.font = w < 760 ? 'bold 12px sans-serif' : 'bold 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const titleText = w < 760
        ? '⚛️ พลังงานยึดเหนี่ยวต่อนิวคลีออน (E_b/A vs A)'
        : '⚛️ เส้นโค้งพลังงานยึดเหนี่ยวต่อนิวคลีออน (Binding Energy per Nucleon Curve E_b/A vs A)';
      ctx.fillText(titleText, originX, 15);

      ctx.fillStyle = '#94a3b8';
      ctx.font = w < 760 ? '10px sans-serif' : '11.5px sans-serif';
      let subTitleText = 'เสถียรสูงสุด: ⁶²Ni (E_b/A = 8.795 MeV สูงสุด) & ⁵⁶Fe (มวล/A ต่ำสุด) | ซ้าย: Fusion | ขวา: Fission';
      if (w < 480) {
        subTitleText = '⁵⁶Fe & ⁶²Ni เสถียรสูงสุด | ซ้าย: ฟิวชัน | ขวา: ฟิชชัน';
      } else if (w < 760) {
        subTitleText = '⁵⁶Fe (เสถียรสูงสุด) | ⁶²Ni (~8.8 MeV) | ซ้าย: ฟิวชัน | ขวา: ฟิชชัน';
      }
      ctx.fillText(subTitleText, originX, 36);

      // Shaded Regions: Fusion (left of Fe-56) & Fission (right of Fe-56)
      const ironX = originX + (56 / 240) * plotW;
      const fusionW = ironX - originX;
      const fissionW = plotW - fusionW;

      // Fusion zone background
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fillRect(originX, originY - plotH, fusionW, plotH);

      // Fusion zone badge - placed neatly at top-left
      const isNarrowMobile = w < 500;
      const fusionBadgeW = isNarrowMobile ? Math.min(52, Math.max(32, fusionW - 28)) : Math.min(185, fusionW - 14);
      if (fusionBadgeW >= 32) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.fillRect(originX + 6, originY - plotH + 8, fusionBadgeW, 20);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(originX + 6, originY - plotH + 8, fusionBadgeW, 20);

        ctx.fillStyle = '#34d399';
        ctx.font = isNarrowMobile ? 'bold 9px sans-serif' : 'bold 10.5px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const badgeLabel = isNarrowMobile
          ? (fusionBadgeW < 45 ? 'ฟิวชัน' : '⚡ฟิวชัน')
          : (fusionBadgeW < 120 ? '⚡ ฟิวชัน (A < 56)' : '⚡ เขตฟิวชัน (Fusion: A < 56)');
        ctx.fillText(badgeLabel, originX + (isNarrowMobile ? 8 : 13), originY - plotH + 18);
      }

      // Fission zone background
      ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
      ctx.fillRect(ironX, originY - plotH, fissionW, plotH);

      // Fission zone badge - placed in open gap between Sn-120 and Pb-208 to prevent any overlap
      const fissionMidX = originX + (160 / 240) * plotW;
      const fissionBadgeW = isNarrowMobile ? 70 : (w < 760 ? 110 : 160);
      const fissionBadgeX = Math.min(originX + plotW - fissionBadgeW - 8, Math.max(originX + (135 / 240) * plotW, fissionMidX - fissionBadgeW / 2));
      const fissionBadgeLabel = isNarrowMobile
        ? '💥ฟิชชัน'
        : (fissionBadgeW < 125 ? '💥 ฟิชชัน (A > 56)' : '💥 เขตฟิชชัน (Fission: A > 56)');

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(fissionBadgeX, originY - plotH + 6, fissionBadgeW, 20);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(fissionBadgeX, originY - plotH + 6, fissionBadgeW, 20);

      ctx.fillStyle = '#f87171';
      ctx.font = isNarrowMobile ? 'bold 9px sans-serif' : 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fissionBadgeLabel, fissionBadgeX + fissionBadgeW / 2, originY - plotH + 16);

      // Peak Fe-56 stability marker (subtle dashed vertical guide line)
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ironX, originY);
      ctx.lineTo(ironX, originY - plotH + 32);
      ctx.stroke();
      ctx.setLineDash([]);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let e = 2; e <= 10; e += 2) {
        const y = originY - (e / 10) * plotH;
        ctx.beginPath(); ctx.moveTo(originX, y); ctx.lineTo(originX + plotW, y); ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(e + ' MeV', originX - 10, y);
      }
      ctx.textAlign = 'center';
      for (let a = 40; a <= 240; a += 40) {
        const x = originX + (a / 240) * plotW;
        ctx.beginPath(); ctx.moveTo(x, originY); ctx.lineTo(x, originY - plotH); ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText('A=' + a, x, originY + 16);
      }

      // Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX, originY - plotH);
      ctx.lineTo(originX, originY);
      ctx.lineTo(originX + plotW, originY);
      ctx.stroke();

      // Theoretical SEMF (Semi-Empirical Mass Formula) line
      if (this.params.showSemfCurve) {
        ctx.beginPath();
        for (let a = 12; a <= 240; a += 2) {
          const z = a / (2 + 0.015 * Math.pow(a, 2/3)); // Stability line estimate
          const av = 15.75, as_ = 17.8, ac = 0.711, aa = 23.7;
          const eb = av * a - as_ * Math.pow(a, 2/3) - ac * (z * z) / Math.pow(a, 1/3) - aa * Math.pow(a - 2 * z, 2) / a;
          const ebPerA = Math.max(0, eb / a);
          const px = originX + (a / 240) * plotW;
          const py = originY - (ebPerA / 10) * plotH;
          if (a === 12) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Connect nuclides with curve
      ctx.beginPath();
      for (let i = 0; i < this.nuclides.length; i++) {
        const n = this.nuclides[i];
        const px = originX + (n.a / 240) * plotW;
        const py = originY - (n.ebPerA / 10) * plotH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Nuclide Points & Non-overlapping Labels
      const selIdx = this.params.selectedNuclideIndex;
      this.nuclides.forEach((n, idx) => {
        const px = originX + (n.a / 240) * plotW;
        const py = originY - (n.ebPerA / 10) * plotH;
        const isSel = idx === selIdx;

        ctx.beginPath();
        ctx.arc(px, py, isSel ? 8 : (n.a === 56 ? 6 : 4.5), 0, Math.PI * 2);
        ctx.fillStyle = isSel ? '#fbbf24' : n.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSel ? 2.5 : 1.2;
        ctx.stroke();

        ctx.font = isSel ? 'bold 12px sans-serif' : 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Intelligent Label positioning to prevent any adjacent overlaps:
        let labelX = px;
        let labelY = py - 13;

        if (n.sym === '⁵⁶Fe') {
          labelX = px;
          labelY = py - 14;
          ctx.fillStyle = isSel ? '#fbbf24' : '#ef4444';
        } else if (n.sym === '⁶²Ni') {
          labelX = px + 18;
          labelY = py + 12; // Placed below and right to avoid collision with 56Fe
          ctx.fillStyle = isSel ? '#fbbf24' : '#f59e0b';
        } else if (n.sym === '²H') {
          labelX = px + 12;
          labelY = py - 6;
          ctx.fillStyle = isSel ? '#fbbf24' : '#e2e8f0';
        } else if (n.sym === '⁴He') {
          labelX = px - 2;
          labelY = py - 13;
          ctx.fillStyle = isSel ? '#fbbf24' : '#e2e8f0';
        } else if (n.sym === '⁶Li') {
          labelX = px + 14;
          labelY = py + 4;
          ctx.fillStyle = isSel ? '#fbbf24' : '#e2e8f0';
        } else if (n.sym === '¹⁶O') {
          labelX = px - 12;
          labelY = py - 13;
          ctx.fillStyle = isSel ? '#fbbf24' : '#e2e8f0';
        } else if (n.sym === '¹²⁰Sn') {
          labelX = px;
          labelY = py + 14; // Below point to prevent collision with upper fission badge
          ctx.fillStyle = isSel ? '#fbbf24' : '#38bdf8';
        } else if (n.sym === '²⁰⁸Pb') {
          labelX = px - 16;
          labelY = py - 14;
          ctx.fillStyle = isSel ? '#fbbf24' : '#94a3b8';
        } else if (n.sym === '²⁰⁹Bi') {
          labelX = px;
          labelY = py + 16; // Placed below point to avoid colliding with Pb-208 and Po-210
          ctx.fillStyle = isSel ? '#fbbf24' : '#ec4899';
        } else if (n.sym === '²¹⁰Po') {
          labelX = px + 16;
          labelY = py - 14;
          ctx.fillStyle = isSel ? '#fbbf24' : '#d946ef';
        } else if (n.sym === '²³⁵U') {
          labelX = px - 14;
          labelY = py - 14;
          ctx.fillStyle = isSel ? '#fbbf24' : '#f43f5e';
        } else if (n.sym === '²³⁸U') {
          labelX = px - 6;
          labelY = py + 14;
          ctx.fillStyle = isSel ? '#fbbf24' : '#fb923c';
        } else {
          ctx.fillStyle = isSel ? '#fbbf24' : '#e2e8f0';
        }

        if (isSel) {
          const tw = ctx.measureText(n.sym).width + 8;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(labelX - tw / 2, labelY - 7, tw, 14);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1;
          ctx.strokeRect(labelX - tw / 2, labelY - 7, tw, 14);
          ctx.fillStyle = '#fbbf24';
        }

        ctx.fillText(n.sym, labelX, labelY);
      });

      // Selected Nuclide Detail Card at Bottom
      const sel = this.nuclides[selIdx];
      const deltaM = (sel.ebPerA * sel.a / 931.494).toFixed(4);
      const totalEb = (sel.ebPerA * sel.a).toFixed(1);
      const cardY = originY + 20;
      const isMobile = w < 600;
      const isNarrow = w < 420;
      const cardH = isNarrow ? 90 : (isMobile ? 80 : 60);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(originX, cardY, plotW, cardH);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(originX, cardY, plotW, cardH);

      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      if (isMobile) {
        ctx.font = isNarrow ? 'bold 10px sans-serif' : 'bold 11px sans-serif';
        if (sel.sym === '²⁰⁹Bi') {
          if (isNarrow) {
            ctx.fillText(`📌 นิวไคลด์: ${sel.name} (${sel.sym})`, originX + 8, cardY + 7);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '9.5px sans-serif';
            ctx.fillText(`กัมมันตรังสีปฐมภูมิหนักสุด (A=${sel.a}, Z=${sel.z})`, originX + 8, cardY + 24);
          } else {
            ctx.fillText(`📌 นิวไคลด์: ${sel.name} (${sel.sym}) | กัมมันตรังสีปฐมภูมิหนักสุด (A=${sel.a}, Z=${sel.z})`, originX + 10, cardY + 8);
          }
        } else if (sel.sym === '²⁰⁸Pb') {
          if (isNarrow) {
            ctx.fillText(`📌 นิวไคลด์: ${sel.name} (${sel.sym})`, originX + 8, cardY + 7);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '9.5px sans-serif';
            ctx.fillText(`ธาตุเสถียรตัวสุดท้ายหนักสุด (A=${sel.a}, Z=${sel.z})`, originX + 8, cardY + 24);
          } else {
            ctx.fillText(`📌 นิวไคลด์: ${sel.name} (${sel.sym}) | ธาตุเสถียรตัวสุดท้ายหนักสุด (A=${sel.a}, Z=${sel.z})`, originX + 10, cardY + 8);
          }
        } else {
          ctx.fillText(`📌 นิวไคลด์: ${sel.name} (${sel.sym}) | A=${sel.a}, Z=${sel.z}, N=${sel.a - sel.z}`, originX + (isNarrow ? 8 : 10), cardY + (isNarrow ? 7 : 8));
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = isNarrow ? '9px monospace' : '10px monospace';
        const y2 = (isNarrow && (sel.sym === '²⁰⁹Bi' || sel.sym === '²⁰⁸Pb')) ? cardY + 44 : cardY + (isNarrow ? 29 : 32);
        const y3 = (isNarrow && (sel.sym === '²⁰⁹Bi' || sel.sym === '²⁰⁸Pb')) ? cardY + 65 : cardY + (isNarrow ? 51 : 54);
        ctx.fillText(`E_b/A = ${sel.ebPerA.toFixed(2)} MeV/u | E_b = ${totalEb} MeV`, originX + (isNarrow ? 8 : 10), y2);
        ctx.fillText(`มวลพร่อง Δm = ${deltaM} u`, originX + (isNarrow ? 8 : 10), y3);
      } else {
        ctx.font = 'bold 12.5px sans-serif';
        if (sel.sym === '²⁰⁹Bi') {
          ctx.fillText(`📌 นิวไคลด์ที่เลือก: ${sel.name} (${sel.sym}) | ธาตุกัมมันตรังสีปฐมภูมิที่หนักที่สุด (Heaviest Primordial Nuclide, T_1/2 = 2.01×10¹⁹ ปี, สลายแอลฟา α)`, originX + 15, cardY + 12);
        } else if (sel.sym === '²⁰⁸Pb') {
          ctx.fillText(`📌 นิวไคลด์ที่เลือก: ${sel.name} (${sel.sym}) | ธาตุเสถียรตัวสุดท้ายที่หนักที่สุดในเอกภพ (Heaviest Stable Nuclide, Z=82, N=126)`, originX + 15, cardY + 12);
        } else {
          ctx.fillText(`📌 นิวไคลด์ที่เลือก: ${sel.name} (${sel.sym}) | เลขมวล A = ${sel.a}, เลขอะตอม Z = ${sel.z}, นิวตรอน N = ${sel.a - sel.z}`, originX + 15, cardY + 12);
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = '11.5px monospace';
        ctx.fillText(`พลังงานยึดเหนี่ยวเฉลี่ย E_b/A = ${sel.ebPerA.toFixed(2)} MeV/นิวคลีออน | E_b รวม = ${totalEb} MeV | มวลพร่อง Δm = ${deltaM} u`, originX + 15, cardY + 36);
      }
    }

    // --- Submode 2: Stochastic Radioactive Decay ---
    renderDecayStochastic() {
      const ctx = this.ctx;
      const w = this.width || 800;
      const h = this.height || 480;
      const isMobile = w < 760;

      // Header
      ctx.fillStyle = '#f8fafc';
      ctx.font = isMobile ? 'bold 12px sans-serif' : 'bold 15px sans-serif';
      ctx.fillText('🎲 กฎการสลายกัมมันตรังสีเชิงสถิติ (Stochastic Decay & Half-Life)', 20, 25);
      ctx.fillStyle = '#94a3b8';
      ctx.font = isMobile ? '10px sans-serif' : '12px sans-serif';
      ctx.fillText(`ไอโซโทป: ${this.params.isotope} | T_1/2 = ${this.params.halfLife.toFixed(1)} s | เวลา: ${this.simTime.toFixed(2)} s`, 20, 44);

      // Left Box: 2D Atom Cloud
      const boxX = 20;
      const boxY = 55;
      const boxW = isMobile ? w - 40 : Math.round((w - 60) * 0.48);
      const boxH = isMobile ? 150 : 260;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('กลุ่มนิวเคลียส (ส้ม = N(t) | น้ำเงิน = สลายแล้ว)', boxX + 10, boxY + 16);

      // Draw Atoms
      this.atoms.forEach(a => {
        const atomX = boxX + (a.x / 440) * (boxW - 20) + 10;
        const atomY = boxY + (a.y / 260) * (boxH - 30) + 20;
        ctx.beginPath();
        ctx.arc(atomX, atomY, isMobile ? 4 : 6, 0, Math.PI * 2);
        if (a.decayed) {
          ctx.fillStyle = '#3b82f6'; // Decayed daughter
        } else {
          ctx.fillStyle = '#f59e0b'; // Parent active
        }
        ctx.fill();

        // Flash burst on decay
        if (a.flashTimer > 0) {
          ctx.beginPath();
          ctx.arc(atomX, atomY, isMobile ? 9 : 14, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, ' + (a.flashTimer * 2) + ')';
          ctx.fill();
        }
      });

      // Right/Bottom: Live Decay Curve Graph
      const chartX = isMobile ? 20 : boxX + boxW + 15;
      const chartY = isMobile ? boxY + boxH + 12 : 55;
      const chartW = isMobile ? w - 40 : w - chartX - 20;
      const chartH = isMobile ? 140 : 260;

      ctx.fillStyle = '#111827';
      ctx.fillRect(chartX, chartY, chartW, chartH);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(chartX, chartY, chartW, chartH);

      // Grid & Half-life vertical lines
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      for (let t = 1; t <= 4; t++) {
        const hx = chartX + (t * this.params.halfLife / 25) * chartW;
        if (hx <= chartX + chartW) {
          ctx.beginPath(); ctx.moveTo(hx, chartY); ctx.lineTo(hx, chartY + chartH); ctx.stroke();
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px sans-serif';
          ctx.fillText(t + ' T_1/2', hx - 12, chartY + 15);
        }
      }

      // Theoretical curve N(t) = N0 * exp(-lambda * t)
      ctx.beginPath();
      for (let px = 0; px < chartW; px += 2) {
        const t = (px / chartW) * 25;
        const nTheory = this.totalAtoms * Math.exp(-this.params.decayConstant * t);
        const py = chartY + chartH - (nTheory / this.totalAtoms) * (chartH - 35) - 15;
        if (px === 0) ctx.moveTo(chartX + px, py);
        else ctx.lineTo(chartX + px, py);
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Step function of actual atoms remaining
      if (this.decayHistory.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < this.decayHistory.length; i++) {
          const pt = this.decayHistory[i];
          const px = chartX + (pt.t / 25) * chartW;
          const py = chartY + chartH - (pt.count / this.totalAtoms) * (chartH - 35) - 15;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Bottom Telemetry card
      const activeCount = this.atoms.filter(a => !a.decayed).length;
      const decayedCount = this.atoms.length - activeCount;
      const percentLeft = ((activeCount / this.atoms.length) * 100).toFixed(1);
      const telemY = isMobile ? chartY + chartH + 10 : 340;
      const telemH = isMobile ? 68 : 85;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(boxX, telemY, w - 40, telemH);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(boxX, telemY, w - 40, telemH);

      ctx.fillStyle = '#f8fafc';
      ctx.font = isMobile ? 'bold 10.5px sans-serif' : 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`⏱️ N(t) = N_0 e^(-λt) | กัมมันตภาพ A = λN = ${(this.params.decayConstant * activeCount).toFixed(2)} Bq`, boxX + 10, telemY + 10);

      ctx.fillStyle = '#4ade80';
      ctx.font = isMobile ? '10px monospace' : '12px monospace';
      ctx.fillText(`แม่: ${activeCount} (${percentLeft}%) | ลูก: ${decayedCount} | t: ${(this.simTime / this.params.halfLife).toFixed(2)} T_1/2`, boxX + 10, telemY + (isMobile ? 36 : 45));
    }

    // --- Submode 3: Radiation Shielding & Dosimetry ---
    renderShieldingDosimetry() {
      const ctx = this.ctx;
      const w = this.width || 800;
      const h = this.height || 480;
      const isMobile = w < 600;

      // Shared geometry from getShieldBounds for 100% collision-visual consistency
      const { srcX, detX, shieldX, shieldW } = this.getShieldBounds();
      const srcY = isMobile ? 180 : 210;

      // Header Banner
      ctx.fillStyle = '#f8fafc';
      ctx.font = isMobile ? 'bold 12px sans-serif' : 'bold 15px sans-serif';
      ctx.fillText('🛡️ การลดทอนรังสีและโดสิเมทรีรังสีวิทยา (Radiation Attenuation & Medical Dosimetry)', 20, 25);
      ctx.fillStyle = '#94a3b8';
      ctx.font = isMobile ? '10px sans-serif' : '12px sans-serif';
      ctx.fillText('กฎการลดทอนเบียร์-แลมเบิร์ต I(x) = I₀ e^(-μx) | ชั้นความหนาครึ่งค่า HVL = ln(2)/μ', 20, 44);

      // Collimated Source Emitter Box
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(srcX, srcY - 42, 52, 84);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(srcX, srcY - 42, 52, 84);

      // Trefoil radiation symbol
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(srcX + 26, srcY - 4, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(srcX + 26, srcY - 4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Collimator aperture slot
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(srcX + 48, srcY - 14, 4, 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('คอลลิเมเตอร์', srcX + 26, srcY + 24);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText('ไอโซโทป', srcX + 26, srcY + 36);

      // Shielding Barrier Material Styling
      let shieldColor = '#475569';
      let matName = '';
      let hvlText = '';
      const muVal = this.getAttenuationCoeff();
      const wR = (this.params.radiationType === 'alpha') ? 20 : 1;

      if (this.params.shieldMaterial === 'paper') {
        shieldColor = '#f1f5f9';
        matName = 'กระดาษ / ผิวหนังชั้นนอก (Epidermis, ~0.1 mm)';
        hvlText = '0.05 mm';
      } else if (this.params.shieldMaterial === 'aluminum') {
        shieldColor = '#38bdf8';
        matName = 'แผ่นอะลูมิเนียมเกรดวิศวกรรม (Al-6061)';
        hvlText = '3.5 cm (γ)';
      } else if (this.params.shieldMaterial === 'lead') {
        shieldColor = '#64748b';
        matName = 'แผ่นตะกั่วบริสุทธิ์ชีลด์รังสี (Pb-208)';
        hvlText = '9.0 mm (γ)';
      } else if (this.params.shieldMaterial === 'concrete') {
        shieldColor = '#78716c';
        matName = 'คอนกรีตมวลหนักสำหรับเตาปฏิกรณ์ (Heavy Concrete)';
        hvlText = '5.0 cm (γ)';
      }

      const shieldH = isMobile ? 170 : 220;
      const shieldY = srcY - Math.round(shieldH * 0.5);
      if (shieldW > 0) {
        ctx.fillStyle = shieldColor;
        ctx.fillRect(shieldX, shieldY, shieldW, shieldH);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(shieldX, shieldY, shieldW, shieldH);

        // Shield Top Label & Bottom Specs
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${matName} (${this.params.shieldThickness} mm)`, shieldX + shieldW / 2, shieldY - 12);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px monospace';
        ctx.fillText(`HVL ≈ ${hvlText} | μ ≈ ${muVal.toFixed(2)} cm⁻¹`, shieldX + shieldW / 2, shieldY + shieldH + 16);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ไม่มีฉากกั้น (No Shield: 0 mm)', shieldX, shieldY - 12);
      }

      // Geiger-Müller Detector Target
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(detX, srcY - 50, 48, 120);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(detX, srcY - 50, 48, 120);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GM Tube', detX + 24, srcY - 6);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '9px monospace';
      ctx.fillText('หัววัดไกเกอร์', detX + 24, srcY + 12);

      // Render Radiation Particles
      this.radiationParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Render Dynamic Absorption Sparks on Shield Face
      if (this.absorptionSparks && this.absorptionSparks.length > 0) {
        this.absorptionSparks.forEach(s => {
          const progress = Math.max(0, s.timer / 0.35);
          ctx.save();
          ctx.beginPath();
          ctx.arc(s.x, s.y, (1 - progress) * 14 + 3, 0, Math.PI * 2);
          ctx.strokeStyle = s.color || '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = progress;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();
        });
      }

      // Attenuation calculation
      const thickness = Math.max(0, this.params.shieldThickness || 0);
      const xCm = thickness / 10;
      const transFrac = (thickness <= 0) ? 1.0 : (this.params.radiationType === 'alpha') ? 0 : Math.exp(-muVal * xCm);
      const doseRateGy = (transFrac * 10).toFixed(2);
      const doseRateSv = (transFrac * 10 * wR).toFixed(2);

      // Bottom Telemetry card
      const telemY = isMobile ? 320 : 360;
      const telemH = isMobile ? 78 : 88;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, telemY, w - 40, telemH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, telemY, w - 40, telemH);

      ctx.fillStyle = '#f8fafc';
      ctx.font = isMobile ? 'bold 11px sans-serif' : 'bold 12.5px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      let radName = '';
      if (this.params.radiationType === 'alpha') radName = 'แอลฟา α (ฮีเลียม ⁴He²⁺)';
      else if (this.params.radiationType === 'beta') radName = 'บีตาลบ β⁻ (อิเล็กตรอนความเร็วสูง e⁻)';
      else radName = 'แกมมา γ (โฟตอนความถี่สูง hν)';

      if (isMobile) {
        ctx.fillText(`☢️ รังสี: ${radName} | w_R = ${wR}`, 28, telemY + 8);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px monospace';
        ctx.fillText(`ชีลด์ x = ${this.params.shieldThickness} mm | ทะลุผ่าน I/I₀ = ${(transFrac * 100).toFixed(1)}%`, 28, telemY + 28);
        ctx.fillStyle = '#4ade80';
        ctx.fillText(`D = ${doseRateGy} mGy/h | H = ${doseRateSv} mSv/h`, 28, telemY + 48);
      } else {
        ctx.fillText(`☢️ ชนิดรังสี: ${radName} | ค่าน้ำหนักรังสีทางชีววิทยา w_R = ${wR}`, 32, telemY + 12);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '11.5px monospace';
        ctx.fillText(`ความหนาชีลด์ x = ${this.params.shieldThickness} mm | สัมประสิทธิ์ μ = ${muVal.toFixed(2)} cm⁻¹ | สัดส่วนความเข้มทะลุผ่าน I/I₀ = ${(transFrac * 100).toFixed(1)}%`, 32, telemY + 36);
        ctx.fillStyle = '#4ade80';
        ctx.fillText(`อัตราปริมาณรังสีดูดกลืน D = ${doseRateGy} mGy/h | อัตราปริมาณรังสีสมมูลต่อเนื้อเยื่อ H = D·w_R = ${doseRateSv} mSv/h (ICRP-103)`, 32, telemY + 60);
      }
    }

    // ----------------------------------------------------
    // SUBMODE 4: COMPTON SCATTERING & RELATIVISTIC CONSERVATION
    // ----------------------------------------------------
    updateComptonScattering(dt) {
      this.comptonTime += dt;
      // Loop photon collision animation progress every 2.4 seconds
      this.comptonPhotonProgress = (this.comptonPhotonProgress + dt * 0.8) % 2.0;
    }

    renderComptonScattering() {
      const ctx = this.ctx;
      const w = this.width || 800;
      const h = this.height || 480;
      const isMobile = w < 680;
      const isNarrow = w < 420;

      const E0 = Math.max(10, this.params.comptonE0 || 100.0); // keV
      const thetaDeg = this.params.comptonTheta !== undefined ? this.params.comptonTheta : 90.0;
      const thetaRad = (thetaDeg * Math.PI) / 180.0;
      const mec2 = 511.0; // keV
      const lambdaC = 2.42631; // pm

      // Scattered photon energy E' = E0 / (1 + (E0/mec2)*(1 - cos(theta)))
      const denom = 1.0 + (E0 / mec2) * (1.0 - Math.cos(thetaRad));
      const E_prime = E0 / denom;

      // Recoil electron kinetic energy Ke = E0 - E'
      const Ke = E0 - E_prime;

      // Recoil electron angle phi: tan(phi) = (E' * sin(theta)) / (E0 - E' * cos(theta))
      const sinTh = Math.sin(thetaRad);
      const cosTh = Math.cos(thetaRad);
      const phiRad = Math.atan2(E_prime * sinTh, E0 - E_prime * cosTh);
      const phiDeg = (phiRad * 180.0) / Math.PI;

      // Wavelengths: hc = 1239.8419 keV * pm
      const lambda0 = 1239.8419 / E0; // pm
      const deltaLambda = lambdaC * (1.0 - Math.cos(thetaRad));
      const lambda_prime = lambda0 + deltaLambda;

      // Header Banner
      ctx.fillStyle = '#f8fafc';
      ctx.font = isMobile ? 'bold 12px sans-serif' : 'bold 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(isMobile ? '🎯 การกระเจิงคอมป์ตัน (Compton)' : '🎯 การกระเจิงคอมป์ตัน (Compton Scattering & Relativistic Conservation)', 14, isMobile ? 18 : 24);

      ctx.fillStyle = '#94a3b8';
      ctx.font = isMobile ? '9px sans-serif' : '11px sans-serif';
      ctx.fillText(isMobile ? 'อนุรักษ์พลังงาน & โมเมนตัมสัมพัทธภาพ 2 มิติ (Arthur H. Compton 1923)' : 'ทฤษฎีควอนตัม: โฟตอนชนอิเล็กตรอนอิสระ อนุรักษ์พลังงานสัมพัทธภาพและโมเมนตัม 2 มิติ (Arthur H. Compton 1923)', 14, isMobile ? 32 : 42);

      // Geometry of Collision Apparatus
      const bottomCardY = h - (isMobile ? 86 : 225);
      const cx = isMobile ? w * 0.38 : w * 0.35;
      const cy = isMobile ? 40 + (bottomCardY - 40) * 0.50 : h * 0.48;
      const maxVertRay = isMobile ? Math.max(35, (cy - 48)) : 160;
      const rayLen = isMobile ? Math.min(65, maxVertRay) : 160;

      // Reference horizontal axis
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(15, cy);
      ctx.lineTo(cx + rayLen * 1.15, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // 1. Angular Arcs
      if (thetaDeg > 1) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const arcR = isMobile ? 30 : 45;
        ctx.arc(cx, cy, arcR, 0, -thetaRad, true);
        ctx.stroke();

        const midTh = -thetaRad * 0.5;
        ctx.fillStyle = '#d8b4fe';
        ctx.font = isMobile ? 'bold 9.5px Inter, sans-serif' : 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`θ = ${thetaDeg.toFixed(0)}°`, cx + (arcR + (isMobile ? 12 : 18)) * Math.cos(midTh), cy + (arcR + (isMobile ? 12 : 18)) * Math.sin(midTh));
      }

      if (phiDeg > 1) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const arcR2 = isMobile ? 26 : 38;
        ctx.arc(cx, cy, arcR2, 0, phiRad, false);
        ctx.stroke();

        const midPhi = phiRad * 0.5;
        ctx.fillStyle = '#7dd3fc';
        ctx.font = isMobile ? 'bold 9.5px Inter, sans-serif' : 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`φ = ${phiDeg.toFixed(0)}°`, cx + (arcR2 + (isMobile ? 12 : 18)) * Math.cos(midPhi), cy + (arcR2 + (isMobile ? 12 : 18)) * Math.sin(midPhi));
      }

      // 2. Incident Photon Path & Animated Wave Packet
      const prog = this.comptonPhotonProgress; // 0 to 2.0
      const isPreCollision = prog < 1.0;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      if (isPreCollision) {
        const curPx = 20 + prog * (cx - 20);
        this._drawPhotonWavePacket(ctx, curPx, cy, 0, '#818cf8', '#38bdf8', isMobile ? 4.5 : 6);
      }

      // 3. Post-Collision Particles (prog >= 1.0)
      const postProg = prog - 1.0; // 0 to 1.0

      const scX = cx + rayLen * Math.cos(thetaRad);
      const scY = cy - rayLen * Math.sin(thetaRad);

      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(scX, scY);
      ctx.stroke();

      const elX = cx + rayLen * Math.cos(phiRad);
      const elY = cy + rayLen * Math.sin(phiRad);

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(elX, elY);
      ctx.stroke();

      if (!isPreCollision) {
        const curScX = cx + postProg * (scX - cx);
        const curScY = cy + postProg * (scY - cy);
        this._drawPhotonWavePacket(ctx, curScX, curScY, -thetaRad, '#fb7185', '#f59e0b', isMobile ? 6 : 8.5);

        const curElX = cx + postProg * (elX - cx);
        const curElY = cy + postProg * (elY - cy);

        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(curElX, curElY, isMobile ? 5.5 : 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 8.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('e⁻', curElX, curElY + 3);
      }

      // 4. Central Target Electron (at cx, cy)
      const targetOpacity = isPreCollision ? 1.0 : Math.max(0.15, 1.0 - postProg * 1.5);
      ctx.save();
      ctx.fillStyle = `rgba(56, 189, 248, ${targetOpacity})`;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = isPreCollision ? 10 : 3;
      ctx.beginPath();
      ctx.arc(cx, cy, isMobile ? 7 : 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = `rgba(255, 255, 255, ${targetOpacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = `rgba(15, 23, 42, ${targetOpacity})`;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('e⁻', cx, cy + 3);

      if (isPreCollision) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = isMobile ? '8.5px Inter, sans-serif' : '10px Inter, sans-serif';
        ctx.fillText('e⁻ นิ่ง', cx, cy + (isMobile ? 16 : 22));
      } else if (postProg < 0.3) {
        const flashR = postProg * 40;
        ctx.strokeStyle = `rgba(254, 240, 138, ${1.0 - postProg / 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 5. Labels on Beams
      if (isMobile) {
        ctx.fillStyle = '#818cf8';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`E₀=${E0.toFixed(0)}keV`, Math.max(35, cx - 45), cy - 10);

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`E'=${E_prime.toFixed(1)}k`, Math.min(w - 65, scX + 4), scY);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`e⁻ K=${Ke.toFixed(1)}k`, Math.min(w - 75, elX + 4), Math.min(bottomCardY - 8, elY + 4));
      } else {
        ctx.fillStyle = '#818cf8';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`โฟตอนตกกระทบ E₀ = ${E0.toFixed(1)} keV`, 110, cy - 14);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(`λ₀ = ${lambda0.toFixed(2)} pm`, 110, cy + 16);

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`โฟตอนกระเจิง E' = ${E_prime.toFixed(1)} keV`, scX + 8, scY);
        ctx.fillStyle = '#fda4af';
        ctx.font = '10px monospace';
        ctx.fillText(`λ' = ${lambda_prime.toFixed(2)} pm (Δλ = +${deltaLambda.toFixed(2)} pm)`, scX + 8, scY + 16);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`อิเล็กตรอนสะท้อน K_e = ${Ke.toFixed(1)} keV`, elX + 8, elY + 6);
        ctx.fillStyle = '#a7f3d0';
        ctx.font = '10px monospace';
        ctx.fillText(`มุมสะท้อน φ = ${phiDeg.toFixed(1)}°`, elX + 8, elY + 22);
      }

      // 6. HUD Theory & Calculation Card
      ctx.save();
      if (isMobile) {
        const cardX = 8;
        const cardY = bottomCardY;
        const cardW = w - 16;
        const cardH = 80;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = '#F8FAFC';
        ctx.textAlign = 'left';
        ctx.fillText(`📐 Compton: E' = ${E_prime.toFixed(1)} keV (${((E_prime/E0)*100).toFixed(0)}%) | K_e = ${Ke.toFixed(1)} keV`, cardX + 8, cardY + 18);

        ctx.font = '9.5px monospace';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(`θ = ${thetaDeg.toFixed(0)}° ⟹ φ = ${phiDeg.toFixed(1)}° | Δλ = +${deltaLambda.toFixed(2)} pm`, cardX + 8, cardY + 38);

        ctx.fillStyle = '#34D399';
        ctx.fillText(`E₀ = E' + K_e = ${E0.toFixed(1)} keV (อนุรักษ์พลังงาน 100%)`, cardX + 8, cardY + 58);
      } else {
        const cardX = w - 305;
        const cardY = 55;
        const cardW = 290;
        const cardH = 215;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = '#F8FAFC';
        ctx.textAlign = 'left';
        ctx.fillText('📐 การคำนวณการเลื่อนคอมป์ตัน', cardX + 12, cardY + 20);

        ctx.font = '10.5px Inter, monospace';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(`พลังงานตกกระทบ E₀ = ${E0.toFixed(1)} keV`, cardX + 12, cardY + 40);
        ctx.fillText(`พลังงานนิ่ง m_e c² = ${mec2.toFixed(1)} keV`, cardX + 12, cardY + 56);
        ctx.fillText(`ความยาวคลื่นคอมป์ตัน λ_C = ${lambdaC.toFixed(4)} pm`, cardX + 12, cardY + 72);
        ctx.fillText(`มุมกระเจิง θ = ${thetaDeg.toFixed(1)}° | cos θ = ${cosTh.toFixed(3)}`, cardX + 12, cardY + 88);

        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fillRect(cardX + 8, cardY + 96, cardW - 16, 56);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.strokeRect(cardX + 8, cardY + 96, cardW - 16, 56);

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(`E' = E₀ / [1 + (E₀/m_e c²)(1 - cos θ)]`, cardX + 12, cardY + 112);
        ctx.fillStyle = '#F43F5E';
        ctx.fillText(`โฟตอนกระเจิง E' = ${E_prime.toFixed(1)} keV (${((E_prime/E0)*100).toFixed(1)}%)`, cardX + 12, cardY + 128);
        ctx.fillStyle = '#34D399';
        ctx.fillText(`พลังงานจลน์อิเล็กตรอน K_e = ${Ke.toFixed(1)} keV`, cardX + 12, cardY + 144);

        ctx.font = '10px Inter, monospace';
        ctx.fillStyle = '#CBD5E1';
        ctx.fillText(`อนุรักษ์พลังงาน: ${E0.toFixed(1)} = ${E_prime.toFixed(1)} + ${Ke.toFixed(1)} keV`, cardX + 12, cardY + 172);
        ctx.fillText(`มุมสะท้อนกลับอิเล็กตรอน φ = ${phiDeg.toFixed(1)}°`, cardX + 12, cardY + 190);
      }
      ctx.restore();
    }

    _drawPhotonWavePacket(ctx, x, y, angle, col1, col2, wavLen) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const packetLen = 32;
      ctx.beginPath();
      for (let s = -packetLen / 2; s <= packetLen / 2; s += 1.5) {
        const env = Math.exp(- (s * s) / (2 * 7 * 7));
        const wave = Math.sin((s / wavLen) * Math.PI * 2) * 6 * env;
        if (s === -packetLen / 2) ctx.moveTo(s, wave);
        else ctx.lineTo(s, wave);
      }
      ctx.strokeStyle = col1;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = col2;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // ==========================================
    // TELEMETRY BROADCAST
    // ==========================================

    emitTelemetry() {
      if (typeof this.options.onTelemetryUpdate !== 'function') return;

      if (this.subMode === 'compton_scattering') {
        const E0 = Math.max(10, this.params.comptonE0 || 100.0);
        const thetaDeg = this.params.comptonTheta !== undefined ? this.params.comptonTheta : 90.0;
        const thetaRad = (thetaDeg * Math.PI) / 180.0;
        const denom = 1.0 + (E0 / 511.0) * (1.0 - Math.cos(thetaRad));
        const E_prime = E0 / denom;
        const Ke = E0 - E_prime;
        const phiDeg = (Math.atan2(E_prime * Math.sin(thetaRad), E0 - E_prime * Math.cos(thetaRad)) * 180.0) / Math.PI;

        const data = {
          mode: this.subMode,
          subMode: this.subMode,
          ebPerA: E_prime.toFixed(1) + ' keV',
          activityBq: Ke.toFixed(1) + ' keV',
          halfLife: thetaDeg.toFixed(1) + '°',
          radiationType: 'gamma',
          comptonE0: E0.toFixed(1) + ' keV',
          comptonTheta: thetaDeg.toFixed(1) + '°',
          comptonEPrime: E_prime.toFixed(1) + ' keV',
          comptonKe: Ke.toFixed(1) + ' keV',
          comptonPhi: phiDeg.toFixed(1) + '°'
        };
        this.options.onTelemetryUpdate(data);
        return;
      }

      let ebPerA = '8.79 MeV';
      if (this.nuclides[this.params.selectedNuclideIndex]) {
        ebPerA = this.nuclides[this.params.selectedNuclideIndex].ebPerA.toFixed(2) + ' MeV';
      }

      const activeAtoms = this.atoms.filter(a => !a.decayed).length;
      const activityBq = (this.params.decayConstant * activeAtoms).toFixed(1) + ' Bq';

      const data = {
        mode: this.subMode,
        ebPerA: ebPerA,
        activityBq: activityBq,
        halfLife: this.params.halfLife.toFixed(1) + ' s',
        radiationType: this.params.radiationType,
        subMode: this.subMode
      };
      this.options.onTelemetryUpdate(data);
    }
  }

  return NuclearSimulator;
}));
