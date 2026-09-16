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
        shieldThickness: 20      // mm
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
        { name: 'Lead-208', sym: '²⁰⁸Pb', a: 208, z: 82, ebPerA: 7.87, color: '#94a3b8' },
        { name: 'Uranium-235', sym: '²³⁵U', a: 235, z: 92, ebPerA: 7.59, color: '#f43f5e' },
        { name: 'Uranium-238', sym: '²³⁸U', a: 238, z: 92, ebPerA: 7.57, color: '#fb923c' }
      ];

      // Submode 2: Stochastic Atoms (200 atoms)
      this.totalAtoms = 180;
      this.atoms = [];
      this.decayHistory = [];
      this.simTime = 0;
      this.initAtoms();

      // Submode 3: Radiation particles
      this.radiationParticles = [];
      this.sourceEmissionTimer = 0;

      // Mouse drag / hover interaction
      this.setupInteraction();

      // Loop Control
      this.isPlaying = true;
      this.animId = null;
      this.lastTimestamp = performance.now();

      this.start();
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
      const startX = 60;
      const startY = 110;
      const spacingX = 22;
      const spacingY = 22;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          this.atoms.push({
            id: r * cols + c,
            x: startX + c * spacingX + (Math.random() - 0.5) * 4,
            y: startY + r * spacingY + (Math.random() - 0.5) * 4,
            decayed: false,
            decayTime: 0,
            flashTimer: 0
          });
        }
      }
      this.decayHistory.push({ t: 0, count: this.atoms.length });
    }

    setupInteraction() {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
      };

      this.canvas.addEventListener('click', (e) => {
        if (this.subMode === 'binding_energy') {
          const pos = getPos(e);
          // Check click on any nuclide point
          const originX = 70;
          const originY = 380;
          const plotW = this.canvas.width - 120;
          const plotH = 280;

          for (let i = 0; i < this.nuclides.length; i++) {
            const n = this.nuclides[i];
            const px = originX + (n.a / 240) * plotW;
            const py = originY - (n.ebPerA / 10) * plotH;
            if (Math.hypot(pos.x - px, pos.y - py) < 14) {
              this.params.selectedNuclideIndex = i;
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
      if (['binding_energy', 'decay_stochastic', 'shielding_dosimetry'].includes(subMode)) {
        this.subMode = subMode;
        if (subMode === 'decay_stochastic') {
          this.initAtoms();
        } else if (subMode === 'shielding_dosimetry') {
          this.radiationParticles = [];
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

        this.update(dt);
        this.render();
        this.emitTelemetry();

        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
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
        if (this.sourceEmissionTimer > 0.06) {
          this.sourceEmissionTimer = 0;
          this.emitRadiationParticle();
        }

        // Update active radiation particles
        const shieldX = 280;
        const shieldW = Math.max(10, this.params.shieldThickness * 2.2);

        for (let i = this.radiationParticles.length - 1; i >= 0; i--) {
          const p = this.radiationParticles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Check interaction with shield barrier
          if (p.x >= shieldX && p.x <= shieldX + shieldW) {
            let absorbProb = 0;
            if (this.params.radiationType === 'alpha') {
              absorbProb = 0.95; // Alpha stopped by paper or almost any barrier
            } else if (this.params.radiationType === 'beta') {
              if (this.params.shieldMaterial === 'paper') absorbProb = 0.08;
              else if (this.params.shieldMaterial === 'aluminum') absorbProb = 0.65;
              else absorbProb = 0.92;
            } else if (this.params.radiationType === 'gamma') {
              // Exponential attenuation I = I0 * exp(-mu * x)
              if (this.params.shieldMaterial === 'paper') absorbProb = 0.005;
              else if (this.params.shieldMaterial === 'aluminum') absorbProb = 0.04;
              else if (this.params.shieldMaterial === 'lead') absorbProb = 0.40;
              else if (this.params.shieldMaterial === 'concrete') absorbProb = 0.15;
            }

            if (Math.random() < absorbProb) {
              p.absorbed = true;
              this.radiationParticles.splice(i, 1);
              continue;
            }
          }

          // Offscreen removal
          if (p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
            this.radiationParticles.splice(i, 1);
          }
        }
      }
    }

    emitRadiationParticle() {
      const srcX = 60;
      const srcY = 220;
      let color = '#38bdf8';
      let r = 4;
      let speed = 320;

      if (this.params.radiationType === 'alpha') {
        color = '#ef4444'; // Heavy He-4
        r = 6;
        speed = 220;
      } else if (this.params.radiationType === 'beta') {
        color = '#f59e0b'; // Light electron
        r = 3;
        speed = 400;
      } else if (this.params.radiationType === 'gamma') {
        color = '#a855f7'; // High freq photon
        r = 2.5;
        speed = 480;
      }

      this.radiationParticles.push({
        x: srcX,
        y: srcY + (Math.random() - 0.5) * 40,
        vx: speed,
        vy: (Math.random() - 0.5) * 25,
        type: this.params.radiationType,
        color: color,
        r: r
      });
    }

    // ==========================================
    // RENDERING
    // ==========================================

    render() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Dark background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      if (this.subMode === 'binding_energy') {
        this.renderBindingEnergyCurve();
      } else if (this.subMode === 'decay_stochastic') {
        this.renderDecayStochastic();
      } else if (this.subMode === 'shielding_dosimetry') {
        this.renderShieldingDosimetry();
      }
    }

    // --- Submode 1: Binding Energy per Nucleon ---
    renderBindingEnergyCurve() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      const originX = 70;
      const originY = 380;
      const plotW = w - 120;
      const plotH = 290;

      // Header Banner
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('⚛️ เส้นโค้งพลังงานยึดเหนี่ยวต่อนิวคลีออน (Binding Energy per Nucleon Curve E_b/A vs A)', originX, 35);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('พีคสูงสุดที่ ⁵⁶Fe (~8.79 MeV) | ซ้าย: นิวเคลียร์ฟิวชัน (Fusion) | ขวา: นิวเคลียร์ฟิชชัน (Fission)', originX, 55);

      // Shaded Regions: Fusion (left) & Fission (right)
      const ironX = originX + (56 / 240) * plotW;
      // Fusion zone
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fillRect(originX, originY - plotH, ironX - originX, plotH);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⚡ เขตปฏิกิริยาฟิวชัน (Fusion Region: A < 56)', originX + 15, originY - plotH + 25);

      // Fission zone
      ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
      ctx.fillRect(ironX, originY - plotH, plotW - (ironX - originX), plotH);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('💥 เขตปฏิกิริยาฟิชชัน (Fission Region: A > 56)', ironX + 25, originY - plotH + 25);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let e = 2; e <= 10; e += 2) {
        const y = originY - (e / 10) * plotH;
        ctx.beginPath(); ctx.moveTo(originX, y); ctx.lineTo(originX + plotW, y); ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(e + ' MeV', originX - 45, y + 4);
      }
      for (let a = 40; a <= 240; a += 40) {
        const x = originX + (a / 240) * plotW;
        ctx.beginPath(); ctx.moveTo(x, originY); ctx.lineTo(x, originY - plotH); ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText('A=' + a, x - 15, originY + 18);
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
          // SEMF: av*A - as*A^(2/3) - ac*Z^2/A^(1/3) - aa*(A-2Z)^2/A
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

      // Draw Nuclide Points
      const selIdx = this.params.selectedNuclideIndex;
      this.nuclides.forEach((n, idx) => {
        const px = originX + (n.a / 240) * plotW;
        const py = originY - (n.ebPerA / 10) * plotH;
        const isSel = idx === selIdx;

        ctx.beginPath();
        ctx.arc(px, py, isSel ? 9 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? '#fbbf24' : n.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSel ? 2.5 : 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = isSel ? '#fbbf24' : '#e2e8f0';
        ctx.font = isSel ? 'bold 12px sans-serif' : '10px sans-serif';
        ctx.fillText(n.sym, px - 10, py - (isSel ? 14 : 9));
      });

      // Selected Nuclide Detail Card at Bottom
      const sel = this.nuclides[selIdx];
      const deltaM = (sel.ebPerA * sel.a / 931.494).toFixed(4);
      const totalEb = (sel.ebPerA * sel.a).toFixed(1);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(originX, 400, plotW, 65);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(originX, 400, plotW, 65);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`📌 นิวไคลด์ที่เลือก: ${sel.name} (${sel.sym}) | เลขมวล A = ${sel.a}, เลขอะตอม Z = ${sel.z}, นิวตรอน N = ${sel.a - sel.z}`, originX + 15, 422);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`พลังงานยึดเหนี่ยวเฉลี่ย E_b/A = ${sel.ebPerA.toFixed(2)} MeV/นิวคลีออน | E_b รวม = ${totalEb} MeV | มวลพร่อง Δm = ${deltaM} u`, originX + 15, 448);
    }

    // --- Submode 2: Stochastic Radioactive Decay ---
    renderDecayStochastic() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Header
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('🎲 กฎการสลายกัมมันตรังสีเชิงสถิติ (Stochastic Decay & Exponential Half-Life Law)', 30, 35);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText(`ไอโซโทป: ${this.params.isotope} | ครึ่งชีวิต T_1/2 = ${this.params.halfLife.toFixed(1)} s | เวลาจำลอง: ${this.simTime.toFixed(2)} s`, 30, 55);

      // Left Box: 2D Atom Cloud
      const boxX = 30;
      const boxY = 75;
      const boxW = 440;
      const boxH = 260;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.fillText('กลุ่มนิวเคลียสกัมมันตรังสี (ส้ม = นิวเคลียสแม่ N(t) | น้ำเงิน = นิวเคลียสลูกสลายแล้ว)', boxX + 10, boxY + 20);

      // Draw Atoms
      this.atoms.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, 6, 0, Math.PI * 2);
        if (a.decayed) {
          ctx.fillStyle = '#3b82f6'; // Decayed daughter
        } else {
          ctx.fillStyle = '#f59e0b'; // Parent active
        }
        ctx.fill();

        // Flash burst on decay
        if (a.flashTimer > 0) {
          ctx.beginPath();
          ctx.arc(a.x, a.y, 14, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, ' + (a.flashTimer * 2) + ')';
          ctx.fill();
        }
      });

      // Right: Live Decay Curve Graph
      const chartX = 500;
      const chartY = 75;
      const chartW = w - 530;
      const chartH = 260;

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
        const py = chartY + chartH - (nTheory / this.totalAtoms) * (chartH - 40) - 20;
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
          const py = chartY + chartH - (pt.count / this.totalAtoms) * (chartH - 40) - 20;
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

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(boxX, 360, w - 60, 85);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(boxX, 360, w - 60, 85);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`⏱️ สมการการสลาย: N(t) = N_0 e^(-λt) = N_0 (1/2)^(t/T_1/2) | กัมมันตภาพ A = λN = ${(this.params.decayConstant * activeCount).toFixed(2)} Bq`, boxX + 15, 385);

      ctx.fillStyle = '#4ade80';
      ctx.font = '12px monospace';
      ctx.fillText(`นิวเคลียสแม่คงเหลือ: ${activeCount} ตัว (${percentLeft}%) | นิวเคลียสลูกที่สลายแล้ว: ${decayedCount} ตัว | ผ่านแล้ว: ${(this.simTime / this.params.halfLife).toFixed(2)} ครึ่งชีวิต`, boxX + 15, 415);
    }

    // --- Submode 3: Radiation Shielding & Dosimetry ---
    renderShieldingDosimetry() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Header
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('🛡️ การกำบังรังสีและมาตรวิทยารังสีวิทยา (Radiation Shielding, HVL & Dosimetry)', 30, 35);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('จำลองอำนาจทะลุทะลวงของรังสี แอลฟา (α) / บีตา (β) / แกมมา (γ) ผ่านวัสดุกำบังตามกฎ I = I_0 e^(-μx)', 30, 55);

      // Radiation Source Emitter
      const srcX = 60;
      const srcY = 220;
      ctx.fillStyle = '#334155';
      ctx.fillRect(20, srcY - 45, 55, 90);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, srcY - 45, 55, 90);

      // Trefoil radiation symbol
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(47, srcY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(47, srcY, 4, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('ต้นกำเนิด', 25, srcY + 35);

      // Shielding Barrier
      const shieldX = 280;
      const shieldW = Math.max(12, this.params.shieldThickness * 2.2);
      let shieldColor = '#94a3b8'; // default
      if (this.params.shieldMaterial === 'paper') shieldColor = '#f8fafc';
      else if (this.params.shieldMaterial === 'aluminum') shieldColor = '#38bdf8';
      else if (this.params.shieldMaterial === 'lead') shieldColor = '#475569';
      else if (this.params.shieldMaterial === 'concrete') shieldColor = '#78716c';

      ctx.fillStyle = shieldColor;
      ctx.fillRect(shieldX, 100, shieldW, 240);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(shieldX, 100, shieldW, 240);

      // Shield Label
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`กำบัง: ${this.params.shieldMaterial.toUpperCase()} (${this.params.shieldThickness} mm)`, shieldX - 20, 90);

      // Detector Target
      const detX = w - 80;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(detX, 120, 50, 200);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(detX, 120, 50, 200);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('หัววัด', detX + 10, 145);
      ctx.fillText('Geiger', detX + 5, 165);

      // Render Particles
      this.radiationParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Attenuation calculation
      let mu = 0.05; // cm^-1
      let wR = 1;
      if (this.params.radiationType === 'alpha') {
        wR = 20; // High biological harm
        mu = 999;
      } else if (this.params.radiationType === 'beta') {
        wR = 1;
        mu = 2.5;
      } else if (this.params.radiationType === 'gamma') {
        wR = 1;
        if (this.params.shieldMaterial === 'lead') mu = 0.77;
        else if (this.params.shieldMaterial === 'concrete') mu = 0.14;
        else if (this.params.shieldMaterial === 'aluminum') mu = 0.20;
        else mu = 0.01;
      }

      const xCm = this.params.shieldThickness / 10;
      const transFrac = (this.params.radiationType === 'alpha') ? 0 : Math.exp(-mu * xCm);
      const doseRateGy = (transFrac * 10).toFixed(2);
      const doseRateSv = (transFrac * 10 * wR).toFixed(2);

      // Bottom Telemetry card
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(30, 360, w - 60, 85);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(30, 360, w - 60, 85);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`☢️ ชนิดรังสี: ${this.params.radiationType.toUpperCase()} (ค่าน้ำหนักรังสี w_R = ${wR}) | ความเข้มทะลุผ่าน I/I_0 = ${(transFrac * 100).toFixed(1)}%`, 45, 385);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`ปริมาณรังสีดูดกลืน D = ${doseRateGy} mGy/h | ปริมาณรังสีสมมูลต่อเนื้อเยื่อ H = D·w_R = ${doseRateSv} mSv/h`, 45, 415);
    }

    // ==========================================
    // TELEMETRY BROADCAST
    // ==========================================

    emitTelemetry() {
      if (typeof this.options.onTelemetryUpdate !== 'function') return;

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
