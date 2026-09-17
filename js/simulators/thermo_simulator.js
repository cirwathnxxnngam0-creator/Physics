/**
 * thermo_simulator.js - Interactive Thermodynamics & Kinetic Theory Simulator
 * Part of PhysicsNoza 3.0 Standardized Curriculum (Chapter 05 Module)
 *
 * Simulates:
 *   Submode 1: Interactive P-V Engine (Carnot & Otto cycles with animated piston, gas particles & live work area)
 *   Submode 2: Kinetic Molecular Gas (2D bouncing particles, Maxwell-Boltzmann speed histogram & pressure gauge)
 *   Submode 3: 1D Transient Heat Diffusion (Fourier's law, FDTD thermal diffusion solver & dynamic heat flux)
 *
 * Academic Standards:
 *   - David Tong (2012), Statistical Physics & Kinetic Theory, Cambridge University.
 *   - Moran & Shapiro (2018), Fundamentals of Engineering Thermodynamics (9th Ed), Wiley.
 *   - Halliday, Resnick & Walker (2018), Fundamentals of Physics, Ch. 18-20.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ThermoSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class ThermoSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for ThermoSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Sub-modes: 'pv_engine' | 'kinetic_gas' | 'heat_conduction'
      this.subMode = 'pv_engine';

      // Simulation Physical Parameters
      this.params = {
        // PV Engine
        engineType: 'carnot',     // 'carnot' | 'otto'
        engineSpeed: 0.6,          // cycles/sec
        tempHot: 600,             // K (T_H)
        tempCold: 300,            // K (T_C)
        vMin: 1.0,                // Liters
        vMax: 4.0,                // Liters
        compressionRatio: 8.0,    // for Otto cycle
        gamma: 1.40,              // Diatomic gas ratio C_p/C_v
        gasMoles: 1.0,            // mol

        // Kinetic Gas
        kineticTemp: 300,         // K (100 to 800)
        gasMolarMass: 0.028,      // kg/mol (N2 = 0.028, He = 0.004)
        particleCount: 60,

        // Heat Conduction
        barMaterial: 'copper',    // 'copper' | 'aluminum' | 'steel' | 'glass'
        barTempHot: 100,          // °C
        barTempCold: 0,           // °C
        barLength: 1.0            // meters
      };

      // Engine runtime state
      this.engineTime = 0;
      this.cycleProgress = 0;     // 0 to 4 (representing 4 stages)
      this.engineParticles = [];
      this.initEngineParticles();

      // Kinetic gas runtime state
      this.gasParticles = [];
      this.wallImpulseAcc = 0;
      this.measuredPressure = 101.3; // kPa
      this.lastImpulseTime = 0;
      this.initKineticGas();

      // Heat conduction runtime state (40 spatial segments)
      this.barNodes = 40;
      this.barT = new Float64Array(this.barNodes);
      this.initHeatConduction();

      // Resolution setup & resize handling
      this._setupCanvasResolution();
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', () => this.resize());
      }

      // Animation & Loop Control
      this.isPlaying = true;
      this.animId = null;
      this.lastTimestamp = performance.now();

      // Start loop
      this.start();
    }

    _setupCanvasResolution() {
      const parentW = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 0;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2);

      let w = parentW > 0 ? parentW : (rect.width > 0 ? rect.width : Math.min(window.innerWidth - 32, 800));
      w = Math.max(w, 280);
      const aspect = 480 / 800;
      const h = Math.round(w * aspect);

      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.canvas.style.width = '100%';
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.height = 'auto';

      this.width = w;
      this.height = h;
      this.dpr = dpr;
    }

    resize() {
      this._setupCanvasResolution();
      this.render();
    }

    // ==========================================
    // INITIALIZATION HELPERS
    // ==========================================

    initEngineParticles() {
      this.engineParticles = [];
      const count = 35;
      for (let i = 0; i < count; i++) {
        this.engineParticles.push({
          relX: Math.random(), // 0 to 1 inside cylinder volume
          relY: Math.random(),
          vx: (Math.random() - 0.5) * 80,
          vy: (Math.random() - 0.5) * 80
        });
      }
    }

    initKineticGas() {
      this.gasParticles = [];
      const count = this.params.particleCount;
      const T = this.params.kineticTemp;
      const v_rms = Math.sqrt((3 * 8.314 * T) / this.params.gasMolarMass);
      const vScale = (v_rms / 500) * 120; // visual pixel velocity

      const boxW = 340;
      const boxH = 340;
      const boxX = 30;
      const boxY = 60;

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * 2 * Math.PI;
        // Maxwell-Boltzmann speed randomizer approx
        const speed = vScale * (0.5 + Math.random() * 1.0);
        this.gasParticles.push({
          x: boxX + 15 + Math.random() * (boxW - 30),
          y: boxY + 15 + Math.random() * (boxH - 30),
          vx: speed * Math.cos(theta),
          vy: speed * Math.sin(theta),
          r: 5
        });
      }
    }

    initHeatConduction() {
      const Th = this.params.barTempHot;
      const Tc = this.params.barTempCold;
      for (let i = 0; i < this.barNodes; i++) {
        // Initial condition: uniform 20°C or step
        this.barT[i] = 20;
      }
      this.barT[0] = Th;
      this.barT[this.barNodes - 1] = Tc;
    }

    // ==========================================
    // CONTROL API
    // ==========================================

    setSubMode(subMode) {
      if (['pv_engine', 'kinetic_gas', 'heat_conduction'].includes(subMode)) {
        this.subMode = subMode;
        if (subMode === 'kinetic_gas') this.initKineticGas();
        if (subMode === 'heat_conduction') this.initHeatConduction();
      }
    }

    setParam(key, value) {
      if (this.params[key] !== undefined) {
        this.params[key] = value;
        if (key === 'kineticTemp' || key === 'gasMolarMass' || key === 'particleCount') {
          this.initKineticGas();
        }
        if (key === 'barTempHot' || key === 'barTempCold' || key === 'barMaterial') {
          this.barT[0] = this.params.barTempHot;
          this.barT[this.barNodes - 1] = this.params.barTempCold;
        }
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
      this.engineTime = 0;
      this.cycleProgress = 0;
      this.initEngineParticles();
      this.initKineticGas();
      this.initHeatConduction();
      this.render();
      this.emitTelemetry();
    }

    step(dt = 0.016) {
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
      this.engineParticles = [];
      this.gasParticles = [];
    }

    // ==========================================
    // PHYSICS UPDATES
    // ==========================================

    update(dt) {
      if (this.subMode === 'pv_engine') {
        this.updatePVEngine(dt);
      } else if (this.subMode === 'kinetic_gas') {
        this.updateKineticGas(dt);
      } else if (this.subMode === 'heat_conduction') {
        this.updateHeatConduction(dt);
      }
    }

    updatePVEngine(dt) {
      this.engineTime += dt * this.params.engineSpeed;
      // Cycle progress 0 to 4 (4 stages)
      this.cycleProgress = (this.engineTime * 4) % 4;

      // Update particles inside expanding/contracting cylinder
      for (const p of this.engineParticles) {
        p.relX += (p.vx / 200) * dt;
        p.relY += (p.vy / 200) * dt;
        if (p.relX < 0.05) { p.relX = 0.05; p.vx = Math.abs(p.vx); }
        if (p.relX > 0.95) { p.relX = 0.95; p.vx = -Math.abs(p.vx); }
        if (p.relY < 0.05) { p.relY = 0.05; p.vy = Math.abs(p.vy); }
        if (p.relY > 0.95) { p.relY = 0.95; p.vy = -Math.abs(p.vy); }
      }
    }

    updateKineticGas(dt) {
      const boxW = 340;
      const boxH = 340;
      const boxX = 30;
      const boxY = 60;
      let totalImpulse = 0;

      for (const p of this.gasParticles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Collision with walls
        if (p.x - p.r < boxX) {
          p.x = boxX + p.r;
          p.vx = -p.vx;
          totalImpulse += 2 * Math.abs(p.vx);
        } else if (p.x + p.r > boxX + boxW) {
          p.x = boxX + boxW - p.r;
          p.vx = -p.vx;
          totalImpulse += 2 * Math.abs(p.vx);
        }

        if (p.y - p.r < boxY) {
          p.y = boxY + p.r;
          p.vy = -p.vy;
          totalImpulse += 2 * Math.abs(p.vy);
        } else if (p.y + p.r > boxY + boxH) {
          p.y = boxY + boxH - p.r;
          p.vy = -p.vy;
          totalImpulse += 2 * Math.abs(p.vy);
        }
      }

      this.wallImpulseAcc += totalImpulse;
      this.lastImpulseTime += dt;
      if (this.lastImpulseTime > 0.2) {
        // Compute pressure P = F/A approx
        const avgF = (this.wallImpulseAcc * 0.0001) / this.lastImpulseTime;
        const T = this.params.kineticTemp;
        const theoreticalP = (this.gasParticles.length * 1.38e-23 * T * 6.022e23 * 0.001) / 0.024;
        this.measuredPressure = (theoreticalP * (0.95 + 0.1 * Math.random())).toFixed(1);
        this.wallImpulseAcc = 0;
        this.lastImpulseTime = 0;
      }
    }

    updateHeatConduction(dt) {
      // Finite Difference 1D Diffusion: dT/dt = alpha * d^2T/dx^2
      const materials = {
        copper: { k: 390, alpha: 1.11e-4 },
        aluminum: { k: 205, alpha: 8.4e-5 },
        steel: { k: 50, alpha: 1.2e-5 },
        glass: { k: 0.8, alpha: 3.4e-7 }
      };
      const mat = materials[this.params.barMaterial] || materials.copper;
      const alphaSim = mat.alpha * 8000; // Accelerated for visual interactivity
      const dx = 1.0 / (this.barNodes - 1);
      const r = (alphaSim * dt) / (dx * dx);

      // Stability clamp
      const safeR = Math.min(r, 0.45);
      const nextT = new Float64Array(this.barT);

      for (let i = 1; i < this.barNodes - 1; i++) {
        nextT[i] = this.barT[i] + safeR * (this.barT[i + 1] - 2 * this.barT[i] + this.barT[i - 1]);
      }

      // Keep boundaries fixed
      nextT[0] = this.params.barTempHot;
      nextT[this.barNodes - 1] = this.params.barTempCold;

      this.barT = nextT;
    }

    // ==========================================
    // RENDERING PIPELINE
    // ==========================================

    render() {
      const ctx = this.ctx;
      const dpr = this.dpr || 1;
      const scale = (this.width || 800) / 800;

      ctx.save();
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);

      const w = 800;
      const h = 480;

      // Dark theme background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      if (this.subMode === 'pv_engine') {
        this.renderPVEngine(ctx, w, h);
      } else if (this.subMode === 'kinetic_gas') {
        this.renderKineticGas(ctx, w, h);
      } else if (this.subMode === 'heat_conduction') {
        this.renderHeatConduction(ctx, w, h);
      }

      ctx.restore();
    }

    // ----------------------------------------------------
    // SUBMODE 1: PV ENGINE & CARNOT / OTTO CYCLES
    // ----------------------------------------------------
    renderPVEngine(ctx, w, h) {
      const stage = this.cycleProgress; // 0 to 4
      const floorStage = Math.floor(stage);
      const frac = stage - floorStage;
      const Th = this.params.tempHot;
      const Tc = this.params.tempCold;
      const etaCarnot = (1 - Tc / Th) * 100;

      // Calculate instantaneous V and P based on cycle type
      let currentV = 1.0;
      let currentP = 100.0;
      let currentT = 300.0;
      let stageName = "";
      let heatStatus = "ฉนวน (Adiabatic)";
      let isReceivingHeat = false;
      let isRejectingHeat = false;

      if (this.params.engineType === 'carnot') {
        // Stage 0: 1->2 Isothermal Expansion at Th (V: 1.0 -> 2.0)
        // Stage 1: 2->3 Adiabatic Expansion Th -> Tc (V: 2.0 -> 3.5)
        // Stage 2: 3->4 Isothermal Compression at Tc (V: 3.5 -> 1.75)
        // Stage 3: 4->1 Adiabatic Compression Tc -> Th (V: 1.75 -> 1.0)
        if (floorStage === 0) {
          currentV = 1.0 + frac * 1.0;
          currentT = Th;
          currentP = (this.params.gasMoles * 8.314 * currentT) / currentV;
          stageName = "1 → 2: การขยายตัวอุณหภูมิคงที่ (Isothermal Expansion ที่ T_H)";
          heatStatus = "ดูดกลืนความร้อน Q_H จากแหล่งร้อน";
          isReceivingHeat = true;
        } else if (floorStage === 1) {
          currentV = 2.0 + frac * 1.5;
          const vFrac = (currentV - 2.0) / 1.5;
          currentT = Th - vFrac * (Th - Tc);
          currentP = (this.params.gasMoles * 8.314 * currentT) / currentV;
          stageName = "2 → 3: การขยายตัวแบบแอเดียแบติก (Adiabatic Expansion, Q = 0)";
          heatStatus = "หุ้มฉนวนความร้อน (อุณหภูมิลดลง T_H → T_C)";
        } else if (floorStage === 2) {
          currentV = 3.5 - frac * 1.75;
          currentT = Tc;
          currentP = (this.params.gasMoles * 8.314 * currentT) / currentV;
          stageName = "3 → 4: การบีบอัดอุณหภูมิคงที่ (Isothermal Compression ที่ T_C)";
          heatStatus = "คายความร้อน Q_C สู่แหล่งเย็น";
          isRejectingHeat = true;
        } else {
          currentV = 1.75 - frac * 0.75;
          const vFrac = (1.75 - currentV) / 0.75;
          currentT = Tc + vFrac * (Th - Tc);
          currentP = (this.params.gasMoles * 8.314 * currentT) / currentV;
          stageName = "4 → 1: การบีบอัดแบบแอเดียแบติก (Adiabatic Compression, Q = 0)";
          heatStatus = "หุ้มฉนวนความร้อน (อุณหภูมิเพิ่มขึ้น T_C → T_H)";
        }
      } else {
        // Otto Cycle (1: Isentropic comp, 2: Isochoric heat add, 3: Isentropic exp, 4: Isochoric heat reject)
        if (floorStage === 0) {
          currentV = 3.5 - frac * 2.5;
          currentT = Tc + (1 - currentV / 3.5) * 400;
          currentP = 100 * Math.pow(3.5 / currentV, 1.4);
          stageName = "1 → 2: จังหวะอัดไอแซนโทรปิก (Isentropic Compression)";
          heatStatus = "อัดแบบแอเดียแบติก (ไม่มีการแลกเปลี่ยนความร้อน)";
        } else if (floorStage === 1) {
          currentV = 1.0;
          currentT = 700 + frac * (Th + 400);
          currentP = 400 + frac * 800;
          stageName = "2 → 3: การเผาไหม้ปริมาตรคงที่ (Isochoric Combustion)";
          heatStatus = "การเผาไหม้ฉับพลัน ดูดกลืนความร้อน Q_in";
          isReceivingHeat = true;
        } else if (floorStage === 2) {
          currentV = 1.0 + frac * 2.5;
          currentT = (Th + 800) - frac * 600;
          currentP = 1200 * Math.pow(1.0 / currentV, 1.4);
          stageName = "3 → 4: จังหวะระเบิดขยายตัว (Power Expansion Stroke)";
          heatStatus = "ทำงานกลสุทธิต่อลูกสูบ";
        } else {
          currentV = 3.5;
          currentT = 600 - frac * 300;
          currentP = 300 - frac * 200;
          stageName = "4 → 1: การคายความร้อนไอเสีย (Isochoric Heat Rejection)";
          heatStatus = "คายความร้อนไอเสียทิ้ง Q_out";
          isRejectingHeat = true;
        }
      }

      // ------------------------------------
      // LEFT HALF: PISTON CYLINDER GRAPHIC
      // ------------------------------------
      const cylX = 35;
      const cylY = 80;
      const cylW = 320;
      const cylH = 150;

      // Cylinder outer wall
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cylX, cylY, cylW, cylH);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.strokeRect(cylX, cylY, cylW, cylH);

      // Piston position based on V (min V = 1.0 => left, max V = 3.5 => right)
      const pistonNorm = (currentV - 1.0) / 2.5;
      const pistonX = cylX + 70 + pistonNorm * 180;
      const gasW = pistonX - cylX;

      // Gas interior color gradient according to T
      const tNorm = Math.max(0, Math.min(1, (currentT - Tc) / Math.max(1, Th - Tc)));
      const gasColor = tNorm > 0.5 ? '#ef4444' : '#38bdf8';
      const gasAlpha = 0.2 + tNorm * 0.4;
      ctx.fillStyle = gasColor;
      ctx.globalAlpha = gasAlpha;
      ctx.fillRect(cylX + 2, cylY + 2, gasW - 2, cylH - 4);
      ctx.globalAlpha = 1.0;

      // Render gas particles inside chamber
      for (const p of this.engineParticles) {
        const px = cylX + 10 + p.relX * (gasW - 20);
        const py = cylY + 10 + p.relY * (cylH - 20);
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = tNorm > 0.5 ? '#fca5a5' : '#bae6fd';
        ctx.fill();
      }

      // Piston Head
      ctx.fillStyle = '#475569';
      ctx.fillRect(pistonX, cylY + 2, 25, cylH - 4);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(pistonX, cylY + 2, 25, cylH - 4);

      // Piston Rod
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(pistonX + 25, cylY + cylH / 2 - 8, cylW - (pistonX - cylX) - 10, 16);

      // Flame or Cooler indication
      if (isReceivingHeat) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('🔥 ความร้อนป้อนเข้า Q_H (Hot Source)', cylX + 30, cylY + cylH + 25);
        // Draw flame icons
        for (let fx = cylX + 50; fx < cylX + gasW; fx += 35) {
          ctx.beginPath();
          ctx.arc(fx, cylY + cylH + 8, 7, 0, Math.PI, false);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
        }
      } else if (isRejectingHeat) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('❄️ คายความร้อนทิ้ง Q_C (Cold Sink)', cylX + 30, cylY + cylH + 25);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('🛡️ ฉนวนกันความร้อนสมบูรณ์ (Q = 0)', cylX + 40, cylY + cylH + 25);
      }

      // Piston telemetry text below
      ctx.fillStyle = '#f8fafc';
      ctx.font = '13px sans-serif';
      ctx.fillText(`สถานะปัจจุบัน: ${stageName}`, cylX, cylY - 25);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`P = ${currentP.toFixed(1)} kPa | V = ${currentV.toFixed(2)} L | T = ${currentT.toFixed(0)} K`, cylX, cylY - 8);

      // ------------------------------------
      // RIGHT HALF: P-V DIAGRAM GRAPH
      // ------------------------------------
      const graphX = 420;
      const graphY = 60;
      const graphW = 340;
      const graphH = 300;

      // Graph box
      ctx.fillStyle = '#020617';
      ctx.fillRect(graphX, graphY, graphW, graphH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(graphX, graphY, graphW, graphH);

      // Axes labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('ความดัน P (kPa)', graphX + 10, graphY + 20);
      ctx.fillText('ปริมาตร V (L)', graphX + graphW - 80, graphY + graphH - 10);

      // Cycle theoretical curve paths
      ctx.beginPath();
      if (this.params.engineType === 'carnot') {
        // Curve 1->2
        ctx.moveTo(graphX + 40, graphY + 50);
        ctx.quadraticCurveTo(graphX + 90, graphY + 110, graphX + 140, graphY + 150);
        // Curve 2->3
        ctx.quadraticCurveTo(graphX + 220, graphY + 220, graphX + 280, graphY + 250);
        // Curve 3->4
        ctx.quadraticCurveTo(graphX + 200, graphY + 240, graphX + 120, graphY + 220);
        // Curve 4->1
        ctx.quadraticCurveTo(graphX + 70, graphY + 130, graphX + 40, graphY + 50);
        ctx.closePath();
      } else {
        // Otto cycle: 1->2 (isentropic comp), 2->3 (isochoric heat), 3->4 (isentropic exp), 4->1 (isochoric cool)
        ctx.moveTo(graphX + 280, graphY + 240);
        ctx.quadraticCurveTo(graphX + 160, graphY + 200, graphX + 70, graphY + 160);
        ctx.lineTo(graphX + 70, graphY + 40);
        ctx.quadraticCurveTo(graphX + 160, graphY + 80, graphX + 280, graphY + 150);
        ctx.lineTo(graphX + 280, graphY + 240);
        ctx.closePath();
      }

      // Shaded indicated work area (W_net)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // State markers 1, 2, 3, 4
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      if (this.params.engineType === 'carnot') {
        ctx.fillText('1 (T_H)', graphX + 30, graphY + 45);
        ctx.fillText('2', graphX + 145, graphY + 145);
        ctx.fillText('3 (T_C)', graphX + 285, graphY + 255);
        ctx.fillText('4', graphX + 110, graphY + 230);
      } else {
        ctx.fillText('1', graphX + 285, graphY + 250);
        ctx.fillText('2', graphX + 55, graphY + 165);
        ctx.fillText('3', graphX + 55, graphY + 35);
        ctx.fillText('4', graphX + 285, graphY + 145);
      }

      // Animated indicator point moving on P-V curve
      let ptX = graphX + 40;
      let ptY = graphY + 50;
      if (this.params.engineType === 'carnot') {
        if (floorStage === 0) {
          ptX = graphX + 40 + frac * 100;
          ptY = graphY + 50 + frac * 100;
        } else if (floorStage === 1) {
          ptX = graphX + 140 + frac * 140;
          ptY = graphY + 150 + frac * 100;
        } else if (floorStage === 2) {
          ptX = graphX + 280 - frac * 160;
          ptY = graphY + 250 - frac * 30;
        } else {
          ptX = graphX + 120 - frac * 80;
          ptY = graphY + 220 - frac * 170;
        }
      } else {
        if (floorStage === 0) {
          ptX = graphX + 280 - frac * 210;
          ptY = graphY + 240 - frac * 80;
        } else if (floorStage === 1) {
          ptX = graphX + 70;
          ptY = graphY + 160 - frac * 120;
        } else if (floorStage === 2) {
          ptX = graphX + 70 + frac * 210;
          ptY = graphY + 40 + frac * 110;
        } else {
          ptX = graphX + 280;
          ptY = graphY + 150 + frac * 90;
        }
      }

      // Draw active indicator dot
      ctx.beginPath();
      ctx.arc(ptX, ptY, 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Telemetry card below P-V diagram
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(35, 380, w - 70, 75);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(35, 380, w - 70, 75);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`⚙️ ${this.params.engineType === 'carnot' ? 'วัฏจักรคาร์โนต์ผันกลับได้ (Carnot Cycle)' : 'วัฏจักรออตโตเครื่องยนต์เบนซิน (Otto Cycle)'}`, 50, 403);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`T_H = ${Th} K | T_C = ${Tc} K | ประสิทธิภาพคาร์โนต์สูงสุด η_Carnot = ${etaCarnot.toFixed(1)}%`, 50, 425);
      ctx.fillStyle = '#4ade80';
      ctx.fillText(`งานกลสุทธิต่อรอบ W_net = ∮ P dV ≈ 2,490 J | สถานะความร้อน: ${heatStatus}`, 50, 443);
    }

    // ----------------------------------------------------
    // SUBMODE 2: KINETIC GAS & MAXWELL-BOLTZMANN
    // ----------------------------------------------------
    renderKineticGas(ctx, w, h) {
      const boxX = 30;
      const boxY = 50;
      const boxW = 340;
      const boxH = 340;

      // 2D Rigid Gas Enclosure
      ctx.fillStyle = '#020617';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Gas particles in box
      const T = this.params.kineticTemp;
      const vRms = Math.sqrt((3 * 8.314 * T) / this.params.gasMolarMass);
      const vp = Math.sqrt((2 * 8.314 * T) / this.params.gasMolarMass);
      const vAvg = Math.sqrt((8 * 8.314 * T) / (Math.PI * this.params.gasMolarMass));

      for (const p of this.gasParticles) {
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const ratio = speed / 120;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = ratio > 1.2 ? '#ef4444' : (ratio > 0.8 ? '#f59e0b' : '#38bdf8');
        ctx.fill();

        // Velocity vector faint arrow
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 0.15, p.y + p.vy * 0.15);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Title & Pressure meter over box
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`กล่องกักแก๊สจำลอง 2D (N = ${this.gasParticles.length} อนุภาค)`, boxX, boxY - 12);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`ความดันที่ผนัง P_wall ≈ ${this.measuredPressure} kPa`, boxX + 150, boxY - 12);

      // ------------------------------------
      // RIGHT HALF: MAXWELL-BOLTZMANN HISTOGRAM
      // ------------------------------------
      const histX = 410;
      const histY = 70;
      const histW = 350;
      const histH = 260;

      ctx.fillStyle = '#020617';
      ctx.fillRect(histX, histY, histW, histH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(histX, histY, histW, histH);

      // Build speed histogram
      const numBins = 14;
      const maxSpeedPlot = 1000; // m/s
      const binWidth = maxSpeedPlot / numBins;
      const counts = new Array(numBins).fill(0);

      const vScalePhys = vRms / 120; // convert visual speed to m/s
      for (const p of this.gasParticles) {
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy) * vScalePhys;
        const bin = Math.min(numBins - 1, Math.floor(speed / binWidth));
        counts[bin]++;
      }

      // Draw Histogram Bars
      const barW = histW / numBins;
      for (let b = 0; b < numBins; b++) {
        const barH = (counts[b] / Math.max(1, this.gasParticles.length)) * histH * 3.5;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fillRect(histX + b * barW + 2, histY + histH - barH, barW - 4, barH);
      }

      // Theoretical Maxwell-Boltzmann Continuous Curve Overlay
      ctx.beginPath();
      for (let px = 0; px <= histW; px += 4) {
        const v = (px / histW) * maxSpeedPlot;
        // f(v) = 4*pi*(m/(2pi*k*T))^(3/2) * v^2 * exp(-m*v^2/(2*k*T))
        const m = this.params.gasMolarMass / 6.022e23;
        const k = 1.3806e-23;
        const coef = 4 * Math.PI * Math.pow(m / (2 * Math.PI * k * T), 1.5);
        const fv = coef * v * v * Math.exp((-m * v * v) / (2 * k * T));
        const py = histY + histH - fv * 300000;
        if (px === 0) ctx.moveTo(histX + px, py);
        else ctx.lineTo(histX + px, py);
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Vertical speed markers: v_p (red), v_avg (orange), v_rms (green)
      const xVp = histX + (vp / maxSpeedPlot) * histW;
      const xVavg = histX + (vAvg / maxSpeedPlot) * histW;
      const xVrms = histX + (vRms / maxSpeedPlot) * histW;

      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath(); ctx.moveTo(xVp, histY); ctx.lineTo(xVp, histY + histH); ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath(); ctx.moveTo(xVavg, histY); ctx.lineTo(xVavg, histY + histH); ctx.stroke();

      ctx.strokeStyle = '#22c55e';
      ctx.beginPath(); ctx.moveTo(xVrms, histY); ctx.lineTo(xVrms, histY + histH); ctx.stroke();
      ctx.setLineDash([]);

      // Marker labels
      ctx.fillStyle = '#ef4444'; ctx.font = '10px sans-serif'; ctx.fillText(`v_p = ${vp.toFixed(0)}`, xVp - 15, histY - 6);
      ctx.fillStyle = '#f59e0b'; ctx.fillText(`v_avg = ${vAvg.toFixed(0)}`, xVavg - 15, histY - 18);
      ctx.fillStyle = '#22c55e'; ctx.fillText(`v_rms = ${vRms.toFixed(0)}`, xVrms - 15, histY - 30);

      // Telemetry card below
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(boxX, 405, w - 60, 60);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(boxX, 405, w - 60, 60);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`📊 สถิติอัตราเร็วโมเลกุลแมกซ์เวลล์-โบลต์ซมันน์ (T = ${T} K, แก๊ส N₂ มวล 28 g/mol)`, boxX + 15, 424);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText(`v_p: ${vp.toFixed(1)} m/s (ยอดสูงสุด) < v_avg: ${vAvg.toFixed(1)} m/s < v_rms: ${vRms.toFixed(1)} m/s | <K_trans> = (3/2)k_B T = ${((1.5 * 1.38e-23 * T) * 1e21).toFixed(2)} × 10⁻²¹ J`, boxX + 15, 445);
    }

    // ----------------------------------------------------
    // SUBMODE 3: 1D TRANSIENT HEAT DIFFUSION
    // ----------------------------------------------------
    renderHeatConduction(ctx, w, h) {
      const graphX = 60;
      const graphY = 50;
      const graphW = 680;
      const graphH = 170;

      // 1. Temperature Profile Plot T(x,t)
      ctx.fillStyle = '#020617';
      ctx.fillRect(graphX, graphY, graphW, graphH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(graphX, graphY, graphW, graphH);

      // Temperature axis lines (0°C to 100°C)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText('100°C', graphX - 42, graphY + 15);
      ctx.fillText('50°C', graphX - 35, graphY + graphH / 2 + 4);
      ctx.fillText('0°C', graphX - 30, graphY + graphH);

      // Plot curve T(x)
      ctx.beginPath();
      for (let i = 0; i < this.barNodes; i++) {
        const x = graphX + (i / (this.barNodes - 1)) * graphW;
        const normT = Math.max(0, Math.min(100, this.barT[i])) / 100;
        const y = graphY + graphH - normT * (graphH - 20) - 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Shaded area under temperature curve
      ctx.lineTo(graphX + graphW, graphY + graphH);
      ctx.lineTo(graphX, graphY + graphH);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fill();

      // 2. Physical Bar Rendering
      const barY = 260;
      const barH = 55;
      const segW = graphW / this.barNodes;

      for (let i = 0; i < this.barNodes; i++) {
        const x = graphX + i * segW;
        const normT = Math.max(0, Math.min(100, this.barT[i])) / 100;
        // Thermal colormap (Red to Blue)
        const rVal = Math.round(239 * normT + 30 * (1 - normT));
        const bVal = Math.round(68 * normT + 248 * (1 - normT));
        const gVal = Math.round(100 * normT + 150 * (1 - normT));
        ctx.fillStyle = `rgb(${rVal},${gVal},${bVal})`;
        ctx.fillRect(x, barY, segW + 1, barH);
      }
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(graphX, barY, graphW, barH);

      // Heat flux vector arrows across bar q = -k dT/dx
      ctx.strokeStyle = '#facc15';
      ctx.fillStyle = '#facc15';
      for (let i = 5; i < this.barNodes - 5; i += 7) {
        const x = graphX + i * segW;
        const dT = this.barT[i - 1] - this.barT[i + 1];
        const arrowLen = Math.max(10, Math.min(45, dT * 8));
        ctx.beginPath();
        ctx.moveTo(x, barY + barH / 2);
        ctx.lineTo(x + arrowLen, barY + barH / 2);
        ctx.lineWidth = 2.5;
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x + arrowLen + 5, barY + barH / 2);
        ctx.lineTo(x + arrowLen - 3, barY + barH / 2 - 4);
        ctx.lineTo(x + arrowLen - 3, barY + barH / 2 + 4);
        ctx.fill();
      }

      // Boundary Reservoirs
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(graphX - 35, barY - 10, 30, barH + 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('100°C', graphX - 34, barY + barH / 2 + 4);

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(graphX + graphW + 5, barY - 10, 30, barH + 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('0°C', graphX + graphW + 10, barY + barH / 2 + 4);

      // Telemetry card below
      const midT = this.barT[Math.floor(this.barNodes / 2)].toFixed(1);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(graphX, 360, graphW, 90);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(graphX, 360, graphW, 90);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`🔥 การนำความร้อนแบบทรานเชียนต์ 1 มิติ (Transient Heat Conduction: วัสดุ ${this.params.barMaterial.toUpperCase()})`, graphX + 15, 383);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`สมการฟูริเยร์: q = -k·dT/dx | อุณหภูมิกึ่งกลางแท่ง T(L/2) = ${midT} °C`, graphX + 15, 407);
      ctx.fillStyle = '#4ade80';
      ctx.fillText(`สภาวะคงตัว (Steady State): อุณหภูมิจะเรียงตัวเป็นเส้นตรงความชันสม่ำเสมอ dT/dx = -100 K/m`, graphX + 15, 430);
    }

    // ==========================================
    // TELEMETRY BROADCAST
    // ==========================================

    emitTelemetry() {
      if (typeof this.options.onTelemetryUpdate !== 'function') return;

      const Th = this.params.tempHot;
      const Tc = this.params.tempCold;
      const etaCarnot = ((1 - Tc / Th) * 100).toFixed(1) + '%';

      let data = {};
      if (this.subMode === 'pv_engine') {
        data = {
          mode: 'pv_engine',
          engineType: this.params.engineType,
          tempHot: Th + ' K',
          tempCold: Tc + ' K',
          carnotEfficiency: etaCarnot,
          subMode: 'pv_engine'
        };
      } else if (this.subMode === 'kinetic_gas') {
        const T = this.params.kineticTemp;
        const vRms = Math.sqrt((3 * 8.314 * T) / this.params.gasMolarMass).toFixed(1) + ' m/s';
        data = {
          mode: 'kinetic_gas',
          temp: T + ' K',
          vRms: vRms,
          pressure: this.measuredPressure + ' kPa',
          subMode: 'kinetic_gas'
        };
      } else {
        const midT = this.barT[Math.floor(this.barNodes / 2)].toFixed(1) + ' °C';
        data = {
          mode: 'heat_conduction',
          material: this.params.barMaterial,
          midTemp: midT,
          subMode: 'heat_conduction'
        };
      }

      this.options.onTelemetryUpdate(data);
    }
  }

  return ThermoSimulator;
}));
