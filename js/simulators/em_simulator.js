/**
 * em_simulator.js - Interactive Electromagnetism, Lorentz Dynamics, RC Transients,
 * Faraday Induction, Biot-Savart Field Sources & AC Series RLC Resonance Simulator
 * Part of PhysicsNoza 3.0 Standardized Curriculum (Chapter 06 Module)
 *
 * 6 Interactive Submodes:
 *   Submode 1: Electrostatic Field & Equipotential Mapper ('field_charges')
 *   Submode 2: Lorentz Force, Helical/Cyclotron Orbit & Velocity Selector ('lorentz_cyclotron')
 *   Submode 3: Transient RC Circuit Workbench ('rc_circuit')
 *   Submode 4: Faraday's Law & Lenz's Induction Workbench ('faraday_induction')
 *   Submode 5: Biot-Savart & Magnetic Field Sources Workbench ('biot_savart')
 *   Submode 6: AC Series RLC Circuit, Phasor Diagram & Resonance ('ac_rlc_resonance')
 *
 * Academic Standards:
 *   - David Tong (2015), Lectures on Electromagnetism, Cambridge University DAMTP.
 *   - Purcell & Morin (2013), Electricity and Magnetism (3rd Ed), Cambridge University Press.
 *   - Griffiths, D. J. (2017), Introduction to Electrodynamics (4th Ed), Pearson / Cambridge.
 *   - Halliday, Resnick & Walker (2018), Fundamentals of Physics (11th Ed), Chapters 21-33.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EMSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class EMSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for EMSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Sub-modes: 'field_charges' | 'lorentz_cyclotron' | 'rc_circuit' | 'faraday_induction' | 'biot_savart' | 'ac_rlc_resonance'
      this.subMode = 'field_charges';

      // Physical Constants (Normalized SI for numerical stability)
      this.MU0 = 4 * Math.PI * 1e-7;
      this.EPS0 = 8.8541878e-12;
      this.LORENTZ_PX_PER_METER = 1.0; // Graphic rendering scale: 1.0 meter (SI) = 1.0 canvas pixel

      // Simulation Parameters
      this.params = {
        // Submode 1: Field & Charges
        testChargeSign: 1,        // +1 or -1
        showFieldLines: true,
        showEquipotentials: true,
        chargeConfig: 'dipole',   // 'dipole' | 'two_pos' | 'single_pos' | 'quadrupole'
        chargeQ1: 5.0,            // uC
        chargeQ2: -5.0,           // uC

        // Submode 2: Lorentz & Cyclotron
        particleType: 'proton',   // 'proton' | 'electron' | 'alpha'
        magFieldB: 0.8,           // Tesla (into screen if positive)
        elecFieldE: 0,            // V/m (downward)
        particleCharge: 1.0,      // rel e
        particleMass: 1.0,        // rel m
        particleVelocity: 240,    // m/s
        gunMode: 'continuous',    // 'single' | 'continuous'

        // Submode 3: RC Circuit
        batteryVolt: 12.0,        // V
        resistanceR: 100.0,       // kOhms
        capacitanceC: 20.0,       // uF
        switchState: 'charge',    // 'charge' | 'discharge' | 'open'

        // Submode 4: Faraday & Lenz Induction
        faradayTurns: 200,        // Turns N (50 - 500)
        faradayOscillate: true,   // Automatic oscillation
        faradaySpeed: 2.5,        // Speed factor
        faradayMagnetStrength: 1.2, // Magnet B0 (Tesla)

        // Submode 5: Biot-Savart & Sources
        biotType: 'straight',     // 'straight' | 'parallel' | 'loop' | 'solenoid'
        wireCurrent1: 15.0,       // Amperes (Wire 1)
        wireCurrent2: 15.0,       // Amperes (Wire 2)
        wireDistance: 0.25,       // Meters
        wireDirection: 1,         // +1 (parallel), -1 (antiparallel)
        solenoidTurns: 400,       // Turns
        solenoidLength: 0.35,     // Meters

        // Submode 6: AC Series RLC
        acFreq: 60.0,             // Hz (10 - 300)
        acVolt: 120.0,            // V_rms
        acR: 40.0,                // Ohms
        acL: 0.20,                // Henry
        acC: 10.0,                // microFarad
        acSpeed: 0.15             // Visual animation speed factor (0.02 - 0.50)
      };

      // Resolution and interaction (Setup resolution first so cx/cy use true width/height)
      this._setupCanvasResolution();

      // Submode 1 State: Point Charges in 2D
      this.charges = [];
      this.initCharges();
      this.draggedCharge = null;
      this.testParticles = [];

      // Submode 2 State: Particles in Lorentz Field
      this.lorentzParticles = [];
      this.gunTimer = 0;

      // Submode 3 State: RC Circuit Runtime State
      this.rcTime = 0;
      this.capVoltage = 0;
      this.resCurrent = 0;
      this.rcHistory = [];        // { t, vc, i }
      this.electronDots = [];
      this.initRCElectrons();

      // Submode 4 State: Faraday Induction State
      this.magnetX = 160;
      this.magnetY = 170;
      this.magnetVx = 0;
      this.magnetPrevX = 160;
      this.faradayTime = 0;
      this.faradayFlux = 0;
      this.faradayEmf = 0;
      this.galvanometerTheta = 0; // needle deflection in radians
      this.faradayHistory = [];   // { t, flux, emf }
      this.faradayDots = [];
      this.isDraggingMagnet = false;
      this.initFaradayDots();

      // Submode 5 State: Biot-Savart Compass & Cursor
      this.compassX = 400;
      this.compassY = 240;
      this.compassAngle = 0;
      this.calculatedB = 0;
      this.calculatedForce = 0;

      // Submode 6 State: AC RLC Resonance
      this.acTime = 0;
      this.acPhasorAngle = 0;
      this.acWaveHistory = [];    // { t, v, i }
      this.acZ = 0;
      this.acPhi = 0;
      this.acIrms = 0;
      this.acF0 = 0;
      this.acQ = 0;
      this.recalcACParameters();

      window.addEventListener('resize', () => this.resize());
      this.setupInteraction();

      // Loop Control
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

      let w = parentW > 0 ? parentW : (rect.width > 0 ? rect.width : Math.min(window.innerWidth - 32, 850));
      w = Math.max(w, 280);
      const aspect = 480 / 850;
      const h = Math.round(w * aspect);

      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.canvas.style.width = '100%';
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.height = 'auto';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.width = w;
      this.height = h;
      this.dpr = dpr;
    }

    resize() {
      const oldW = this.width || 850;
      const oldH = this.height || 480;
      this._setupCanvasResolution();
      const newW = this.width;
      const newH = this.height;

      if (this.charges && this.charges.length > 0) {
        if (this.charges[0] && (this.charges[0].x < 70 || this.charges[0].x > newW - 70)) {
          this.initCharges(true);
        } else if (oldW > 0 && oldH > 0 && (oldW !== newW || oldH !== newH)) {
          const scaleX = newW / oldW;
          const scaleY = newH / oldH;
          for (const c of this.charges) {
            c.x = Math.max(75, Math.min(newW - 75, c.x * scaleX));
            c.y = Math.max(60, Math.min(newH - 60, c.y * scaleY));
          }
        }
      }
      this.render();
    }

    // ==========================================
    // INITIALIZATION HELPERS
    // ==========================================

    initCharges(resetPositions = true) {
      const w = this.width || 850;
      const h = this.height || 480;
      const cx = w / 2;
      const cy = h / 2;

      const q1 = this.params.chargeQ1 !== undefined ? this.params.chargeQ1 : 5.0;
      const q2 = this.params.chargeQ2 !== undefined ? this.params.chargeQ2 : -5.0;
      const config = this.params.chargeConfig || 'dipole';

      const getColor = (val) => val > 0 ? '#ef4444' : (val < 0 ? '#38bdf8' : '#64748b');

      // Helper to validate and clamp existing charge positions to avoid edge clipping or stuck corrupted values
      const clampPos = (pt, defaultX, defaultY) => {
        if (!pt || typeof pt.x !== 'number' || isNaN(pt.x) || typeof pt.y !== 'number' || isNaN(pt.y)) {
          return { x: defaultX, y: defaultY };
        }
        // If coordinate was stuck at edge (< 65px or > w - 65px) from prior hidden/fallback canvas, restore clean default
        if (pt.x < 65 || pt.x > w - 65 || pt.y < 50 || pt.y > h - 55) {
          return { x: defaultX, y: defaultY };
        }
        return {
          x: Math.max(65, Math.min(w - 65, pt.x)),
          y: Math.max(50, Math.min(h - 55, pt.y))
        };
      };

      if (config === 'dipole') {
        const p1 = (!resetPositions && this.charges[0]) ? clampPos(this.charges[0], cx - 140, cy) : { x: cx - 140, y: cy };
        const p2 = (!resetPositions && this.charges[1]) ? clampPos(this.charges[1], cx + 140, cy) : { x: cx + 140, y: cy };
        this.charges = [
          { id: 'q1', x: p1.x, y: p1.y, q: q1, r: 16, color: getColor(q1), label: 'q1' },
          { id: 'q2', x: p2.x, y: p2.y, q: q2, r: 16, color: getColor(q2), label: 'q2' }
        ];
      } else if (config === 'two_pos') {
        const val1 = Math.abs(q1) || 5.0;
        const val2 = Math.abs(q2) || 5.0;
        const p1 = (!resetPositions && this.charges[0]) ? clampPos(this.charges[0], cx - 140, cy) : { x: cx - 140, y: cy };
        const p2 = (!resetPositions && this.charges[1]) ? clampPos(this.charges[1], cx + 140, cy) : { x: cx + 140, y: cy };
        this.charges = [
          { id: 'q1', x: p1.x, y: p1.y, q: val1, r: 16, color: '#ef4444', label: 'q1' },
          { id: 'q2', x: p2.x, y: p2.y, q: val2, r: 16, color: '#ef4444', label: 'q2' }
        ];
      } else if (config === 'single_pos') {
        const val1 = q1 !== 0 ? q1 : 5.0;
        const p1 = (!resetPositions && this.charges[0]) ? clampPos(this.charges[0], cx, cy) : { x: cx, y: cy };
        this.charges = [
          { id: 'q1', x: p1.x, y: p1.y, q: val1, r: 18, color: getColor(val1), label: 'q1' }
        ];
      } else if (config === 'quadrupole') {
        const val = Math.abs(q1) || 5.0;
        const d = Math.min(95, Math.min(w, h) * 0.22);
        this.charges = [
          { id: 'q1', x: cx - d, y: cy - d, q: val, r: 14, color: '#ef4444', label: '+q' },
          { id: 'q2', x: cx + d, y: cy - d, q: -val, r: 14, color: '#38bdf8', label: '-q' },
          { id: 'q3', x: cx + d, y: cy + d, q: val, r: 14, color: '#ef4444', label: '+q' },
          { id: 'q4', x: cx - d, y: cy + d, q: -val, r: 14, color: '#38bdf8', label: '-q' }
        ];
      }
    }

    initRCElectrons() {
      this.electronDots = [];
      for (let i = 0; i < 24; i++) {
        this.electronDots.push({ pos: i / 24 });
      }
    }

    initFaradayDots() {
      this.faradayDots = [];
      for (let i = 0; i < 16; i++) {
        this.faradayDots.push({ angle: (i / 16) * Math.PI * 2 });
      }
    }

    recalcACParameters() {
      const f = Math.max(1, this.params.acFreq);
      const w = 2 * Math.PI * f;
      const R = Math.max(0.1, this.params.acR);
      const L = Math.max(0.001, this.params.acL);
      const C = Math.max(0.1, this.params.acC) * 1e-6; // uF to F

      const XL = w * L;
      const XC = 1 / (w * C);
      const Z = Math.sqrt(R * R + (XL - XC) * (XL - XC));
      const phi = Math.atan2(XL - XC, R); // radians
      const Vrms = this.params.acVolt;
      const Irms = Vrms / Z;

      const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
      const w0 = 1 / Math.sqrt(L * C);
      const Q = (w0 * L) / R;

      this.acZ = Z;
      this.acPhi = phi;
      this.acIrms = Irms;
      this.acF0 = f0;
      this.acQ = Q;
    }

    setupInteraction() {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = (this.width || 850) / rect.width;
        const scaleY = (this.height || 480) / rect.height;
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
      };

      this.canvas.addEventListener('mousedown', (e) => {
        const pos = getPos(e);
        if (this.subMode === 'field_charges') {
          for (const c of this.charges) {
            const dx = pos.x - c.x;
            const dy = pos.y - c.y;
            if (Math.hypot(dx, dy) < c.r + 8) {
              this.draggedCharge = c;
              break;
            }
          }
        } else if (this.subMode === 'faraday_induction') {
          // Magnet bounding box: [this.magnetX - 60, this.magnetY - 20, 120, 40]
          if (pos.x >= this.magnetX - 65 && pos.x <= this.magnetX + 65 &&
              pos.y >= this.magnetY - 25 && pos.y <= this.magnetY + 25) {
            this.isDraggingMagnet = true;
            this.params.faradayOscillate = false;
          }
        }
      });

      window.addEventListener('mousemove', (e) => {
        const pos = getPos(e);
        const w = this.width || 850;
        const h = this.height || 480;
        if (this.draggedCharge && this.subMode === 'field_charges') {
          this.draggedCharge.x = Math.max(65, Math.min(w - 65, pos.x));
          this.draggedCharge.y = Math.max(50, Math.min(h - 55, pos.y));
        } else if (this.isDraggingMagnet && this.subMode === 'faraday_induction') {
          const newX = Math.max(80, Math.min(w - 120, pos.x));
          this.magnetVx = (newX - this.magnetX) / 0.016;
          this.magnetX = newX;
        } else if (this.subMode === 'biot_savart') {
          this.compassX = Math.max(30, Math.min(w - 30, pos.x));
          this.compassY = Math.max(30, Math.min(h - 30, pos.y));
        }
      });

      window.addEventListener('mouseup', () => {
        this.draggedCharge = null;
        if (this.isDraggingMagnet) {
          this.isDraggingMagnet = false;
        }
      });

      // Click to spawn test charge in field mode
      this.canvas.addEventListener('click', (e) => {
        if (this.subMode === 'field_charges' && !this.draggedCharge) {
          const pos = getPos(e);
          const hit = this.charges.some(c => Math.hypot(pos.x - c.x, pos.y - c.y) < c.r + 10);
          if (!hit) {
            this.testParticles.push({
              x: pos.x,
              y: pos.y,
              vx: 0,
              vy: 0,
              q: this.params.testChargeSign * 0.5,
              trail: []
            });
          }
        }
      });
    }

    // ==========================================
    // CONTROL API
    // ==========================================

    setSubMode(subMode) {
      const valid = ['field_charges', 'lorentz_cyclotron', 'rc_circuit', 'faraday_induction', 'biot_savart', 'ac_rlc_resonance'];
      if (valid.includes(subMode)) {
        this.subMode = subMode;
        if (subMode === 'field_charges') {
          this.testParticles = [];
        } else if (subMode === 'lorentz_cyclotron') {
          this.lorentzParticles = [];
        } else if (subMode === 'rc_circuit') {
          this.rcTime = 0;
          this.capVoltage = 0;
          this.rcHistory = [];
        } else if (subMode === 'faraday_induction') {
          this.faradayTime = 0;
          this.faradayHistory = [];
          this.magnetX = 160;
        } else if (subMode === 'ac_rlc_resonance') {
          this.acTime = 0;
          this.acWaveHistory = [];
          this.recalcACParameters();
        }
        this.render();
        this.emitTelemetry();
      }
    }

    setParticleType(type) {
      this.params.particleType = type;
      if (type === 'proton') {
        this.params.particleCharge = 1.0;
        this.params.particleMass = 1.0;
      } else if (type === 'electron') {
        this.params.particleCharge = -1.0;
        this.params.particleMass = 0.2; // Normalized light mass for clear pedagogical trajectory
      } else if (type === 'alpha') {
        this.params.particleCharge = 2.0;
        this.params.particleMass = 4.0;
      }
      this.render();
      this.emitTelemetry();
    }

    setParam(key, value) {
      if (this.params[key] !== undefined) {
        this.params[key] = value;
        if (['acFreq', 'acVolt', 'acR', 'acL', 'acC', 'acSpeed'].includes(key)) {
          this.recalcACParameters();
        } else if (key === 'chargeConfig') {
          this.initCharges(true);
        } else if (key === 'chargeQ1' || key === 'chargeQ2') {
          this.initCharges(false);
        } else if (key === 'particleType') {
          this.setParticleType(value);
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
      if (this.subMode === 'field_charges') {
        this.initCharges(true);
        this.testParticles = [];
      } else if (this.subMode === 'lorentz_cyclotron') {
        this.lorentzParticles = [];
      } else if (this.subMode === 'rc_circuit') {
        this.rcTime = 0;
        this.capVoltage = 0;
        this.rcHistory = [];
      } else if (this.subMode === 'faraday_induction') {
        this.faradayTime = 0;
        this.faradayHistory = [];
        this.magnetX = 160;
        this.params.faradayOscillate = true;
      } else if (this.subMode === 'biot_savart') {
        this.compassX = 400;
        this.compassY = 240;
      } else if (this.subMode === 'ac_rlc_resonance') {
        this.acTime = 0;
        this.acWaveHistory = [];
        this.recalcACParameters();
      }
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
      this.testParticles = [];
      this.lorentzParticles = [];
      this.faradayHistory = [];
      this.acWaveHistory = [];
    }

    // ==========================================
    // PHYSICS UPDATES
    // ==========================================

    update(dt) {
      if (this.subMode === 'field_charges') {
        this.updateFieldCharges(dt);
      } else if (this.subMode === 'lorentz_cyclotron') {
        this.updateLorentz(dt);
      } else if (this.subMode === 'rc_circuit') {
        this.updateRCCircuit(dt);
      } else if (this.subMode === 'faraday_induction') {
        this.updateFaraday(dt);
      } else if (this.subMode === 'biot_savart') {
        this.updateBiotSavart(dt);
      } else if (this.subMode === 'ac_rlc_resonance') {
        this.updateACRLC(dt);
      }
    }

    updateFieldCharges(dt) {
      const w = this.width || 850;
      const h = this.height || 480;

      for (let i = this.testParticles.length - 1; i >= 0; i--) {
        const p = this.testParticles[i];
        let Ex = 0;
        let Ey = 0;
        for (const c of this.charges) {
          const dx = p.x - c.x;
          const dy = p.y - c.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          if (dist < c.r) {
            this.testParticles.splice(i, 1);
            continue;
          }
          const k = 150000;
          const dE = (k * c.q) / (distSq + 100);
          Ex += dE * (dx / dist);
          Ey += dE * (dy / dist);
        }

        const ax = p.q * Ex;
        const ay = p.q * Ey;

        p.vx = (p.vx + ax * dt) * 0.96;
        p.vy = (p.vy + ay * dt) * 0.96;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 25) p.trail.shift();

        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          this.testParticles.splice(i, 1);
        }
      }
    }

    updateLorentz(dt) {
      const w = this.width || 850;
      const h = this.height || 480;
      const isMobile = w < 600;
      const magX = Math.round(Math.max(75, w * 0.14));
      const magY = isMobile ? 45 : 55;
      const magH = Math.round(Math.min(360, h - (isMobile ? 60 : 75)));
      const gunW = Math.max(55, magX - 15);
      const gunMuzzleX = 10 + gunW;
      const gunCenterY = Math.round(magY + magH * 0.5);

      this.gunTimer = (this.gunTimer || 0) + dt;
      if (this.gunTimer > 0.4) {
        this.gunTimer = 0;
        const type = this.params.particleType || 'proton';
        this.lorentzParticles.push({
          x_m: 0,
          y_m: 0,
          x: gunMuzzleX,
          y: gunCenterY,
          vx: this.params.particleVelocity,
          vy: 0,
          q: this.params.particleCharge,
          m: Math.max(1e-6, this.params.particleMass),
          type: type,
          trail: []
        });
      }

      const B = this.params.magFieldB; // Tesla (SI)
      const E = this.params.elecFieldE; // V/m (SI)

      // Energy-conserving Boris pusher with 4 sub-steps per frame for precision and work=0 in pure B-field
      const subSteps = 4;
      const hStep = dt / subSteps;

      for (let i = this.lorentzParticles.length - 1; i >= 0; i--) {
        const p = this.lorentzParticles[i];
        const q = p.q !== undefined ? p.q : this.params.particleCharge;
        const m = Math.max(1e-6, p.m !== undefined ? p.m : this.params.particleMass);
        const q_over_m = q / m;

        for (let step = 0; step < subSteps; step++) {
          // 1. Half electric acceleration (E is along y downward):
          const v_minus_x = p.vx;
          const v_minus_y = p.vy + 0.5 * q_over_m * E * hStep;

          // 2. Boris magnetic rotation (B is into screen +z):
          // In 2D: (v x B)_x = v_y * B, (v x B)_y = -v_x * B
          const t_z = 0.5 * q_over_m * B * hStep;
          const s_z = (2 * t_z) / (1 + t_z * t_z);

          const v_prime_x = v_minus_x + v_minus_y * t_z;
          const v_prime_y = v_minus_y - v_minus_x * t_z;

          const v_plus_x = v_minus_x + v_prime_y * s_z;
          const v_plus_y = v_minus_y - v_prime_x * s_z;

          // 3. Second half electric acceleration:
          p.vx = v_plus_x;
          p.vy = v_plus_y + 0.5 * q_over_m * E * hStep;

          // 4. Update SI position in meters:
          p.x_m += p.vx * hStep;
          p.y_m += p.vy * hStep;

          // 5. Update canvas pixel coordinates via explicit graphic scale (Rule #4):
          p.x = gunMuzzleX + p.x_m * this.LORENTZ_PX_PER_METER;
          p.y = gunCenterY + p.y_m * this.LORENTZ_PX_PER_METER;
        }

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 100) p.trail.shift();

        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          this.lorentzParticles.splice(i, 1);
        }
      }
    }

    updateRCCircuit(dt) {
      const R_ohms = this.params.resistanceR * 1000;
      const C_farads = this.params.capacitanceC * 1e-6;
      const tau = R_ohms * C_farads;
      const V_batt = this.params.batteryVolt;

      this.rcTime += dt;

      if (this.params.switchState === 'charge') {
        const targetV = V_batt;
        const dV = (targetV - this.capVoltage) * (1 - Math.exp(-dt / tau));
        this.capVoltage += dV;
        this.resCurrent = (targetV - this.capVoltage) / R_ohms;
      } else if (this.params.switchState === 'discharge') {
        const dV = this.capVoltage * (1 - Math.exp(-dt / tau));
        this.capVoltage -= dV;
        this.resCurrent = -this.capVoltage / R_ohms;
      } else {
        this.resCurrent = 0;
      }

      const driftSpeed = Math.abs(this.resCurrent) * 1000 * 0.08;
      for (const dot of this.electronDots) {
        if (this.params.switchState === 'charge') {
          dot.pos = (dot.pos + driftSpeed * dt) % 1.0;
        } else if (this.params.switchState === 'discharge') {
          dot.pos = (dot.pos - driftSpeed * dt + 1.0) % 1.0;
        }
      }

      this.rcHistory.push({
        t: this.rcTime,
        vc: this.capVoltage,
        i: this.resCurrent * 1000
      });
      if (this.rcHistory.length > 250) this.rcHistory.shift();
    }

    updateFaraday(dt) {
      this.faradayTime += dt;
      const coilCenterX = 450;
      const coilY = 170;

      // Update magnet position (oscillate or follow drag)
      if (this.params.faradayOscillate && !this.isDraggingMagnet) {
        const freq = this.params.faradaySpeed * 0.6;
        const amplitude = 170;
        const prev = this.magnetX;
        this.magnetX = coilCenterX - 80 + amplitude * Math.sin(2 * Math.PI * freq * this.faradayTime);
        this.magnetVx = (this.magnetX - prev) / dt;
      } else if (!this.isDraggingMagnet) {
        this.magnetVx = 0;
      }

      // Calculate Magnetic Flux Phi_B through coil of radius R = 50px
      // Simple dipole model on axis: B(x) = B0 * M / ((x - xc)^2 + a^2)^(1.5)
      const dx = this.magnetX - coilCenterX;
      const a = 60; // coil characteristic radius
      const B0 = this.params.faradayMagnetStrength;
      const fluxSign = dx < 0 ? 1 : -1;
      // Flux peaks when magnet center is inside the coil dx = 0
      const fluxMag = (B0 * 0.05) / Math.pow(1 + (dx * dx) / (a * a), 1.5);
      this.faradayFlux = fluxMag; // in Weber (scaled)

      // Induced EMF E = -N * dPhi/dt = -N * (dPhi/dx) * (dx/dt)
      // dPhi/dx = -3 * B0 * 0.05 * (2*dx / a^2) / [2 * (1 + dx^2/a^2)^2.5]
      const dPhidx = - (3 * B0 * 0.05 * dx) / (a * a * Math.pow(1 + (dx * dx) / (a * a), 2.5));
      const N = this.params.faradayTurns;
      const inducedEmf = -N * dPhidx * this.magnetVx * 0.01; // Scale factor for realistic volts
      this.faradayEmf = inducedEmf;

      // Update analog galvanometer needle deflection angle (-45 deg to +45 deg)
      const targetTheta = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, (inducedEmf / 12.0) * (Math.PI / 4)));
      this.galvanometerTheta += (targetTheta - this.galvanometerTheta) * 0.25;

      // Animate current dots in the coil winding
      const dotSpeed = inducedEmf * 1.5;
      for (const dot of this.faradayDots) {
        dot.angle = (dot.angle + dotSpeed * dt + Math.PI * 2) % (Math.PI * 2);
      }

      // Record strip chart history
      this.faradayHistory.push({
        t: this.faradayTime,
        flux: this.faradayFlux * 100, // scaled for display
        emf: this.faradayEmf
      });
      if (this.faradayHistory.length > 220) this.faradayHistory.shift();
    }

    updateBiotSavart(dt) {
      // Calculate B field vector at (compassX, compassY)
      const cx = this.compassX;
      const cy = this.compassY;

      let Bx = 0;
      let By = 0;

      if (this.params.biotType === 'straight') {
        // Wire at center (x=400, y=240), current out of screen (+z)
        const wx = 400;
        const wy = 240;
        const dx = cx - wx;
        const dy = cy - wy;
        const r = Math.max(15, Math.hypot(dx, dy));
        const I = this.params.wireCurrent1;
        // B = mu0 * I / (2 * pi * r) tangential: (-dy/r, dx/r)
        const Bmag = (this.MU0 * I * 2e5) / r;
        Bx = -Bmag * (dy / r);
        By = Bmag * (dx / r);
        this.calculatedB = (this.MU0 * I) / (2 * Math.PI * Math.max(0.01, r * 0.001)); // Tesla
        this.calculatedForce = 0;
      } else if (this.params.biotType === 'parallel') {
        const d_px = this.params.wireDistance * 800; // visual pixel spacing
        const w1x = 400 - d_px / 2;
        const w2x = 400 + d_px / 2;
        const wy = 240;

        const I1 = this.params.wireCurrent1;
        const I2 = this.params.wireCurrent2 * this.params.wireDirection;

        // Field from Wire 1
        const dx1 = cx - w1x;
        const dy1 = cy - wy;
        const r1 = Math.max(15, Math.hypot(dx1, dy1));
        const B1 = (this.MU0 * I1 * 2e5) / r1;
        Bx += -B1 * (dy1 / r1);
        By += B1 * (dx1 / r1);

        // Field from Wire 2
        const dx2 = cx - w2x;
        const dy2 = cy - wy;
        const r2 = Math.max(15, Math.hypot(dx2, dy2));
        const B2 = (this.MU0 * I2 * 2e5) / r2;
        Bx += -B2 * (dy2 / r2);
        By += B2 * (dx2 / r2);

        // Force per length between wires: F/L = mu0 * I1 * I2 / (2 * pi * d)
        this.calculatedForce = (this.MU0 * Math.abs(I1 * I2)) / (2 * Math.PI * Math.max(0.01, this.params.wireDistance));
        this.calculatedB = Math.hypot(Bx, By) * 1e-5;
      } else if (this.params.biotType === 'loop') {
        // Circular loop in YZ plane viewed from side (current at top x=350, bottom x=450)
        const lx = 400;
        const ly = 240;
        const R = 70;
        const I = this.params.wireCurrent1;
        // On-axis and dipole approximation
        const dx = cx - lx;
        const dy = cy - ly;
        const r = Math.max(20, Math.hypot(dx, dy));
        const Bmag = (this.MU0 * I * 3e5 * R * R) / Math.pow(r * r + R * R, 1.5);
        // Field points predominantly along x-axis at center
        Bx = Bmag * (1 - (dy * dy) / (2 * r * r));
        By = -Bmag * (dx * dy) / (r * r);
        this.calculatedB = (this.MU0 * I * R * R * 1e-4) / (2 * Math.pow(Math.max(0.05, Math.abs(dx * 0.001)), 3));
        this.calculatedForce = 0;
      } else if (this.params.biotType === 'solenoid') {
        // Solenoid of length L = 260px, width 100px
        const sx1 = 270;
        const sx2 = 530;
        const sy1 = 190;
        const sy2 = 290;
        const I = this.params.wireCurrent1;
        const n = this.params.solenoidTurns / Math.max(0.05, this.params.solenoidLength);

        if (cx >= sx1 && cx <= sx2 && cy >= sy1 && cy <= sy2) {
          // Inside: Uniform field pointing in +x
          Bx = 100;
          By = 0;
        } else {
          // Outside: Fringing dipole field
          const dx = cx - 400;
          const dy = cy - 240;
          const r = Math.max(40, Math.hypot(dx, dy));
          Bx = -40 * (1 - 2 * (dx * dx) / (r * r));
          By = -40 * (2 * dx * dy) / (r * r);
        }
        this.calculatedB = this.MU0 * n * I; // Tesla
        this.calculatedForce = 0;
      }

      this.compassAngle = Math.atan2(By, Bx);
    }

    updateACRLC(dt) {
      const speed = (this.params.acSpeed !== undefined) ? this.params.acSpeed : 0.15;
      this.acTime += dt * speed;
      const w = 2 * Math.PI * this.params.acFreq;
      this.acPhasorAngle = (w * this.acTime) % (2 * Math.PI);

      const V0 = this.params.acVolt * Math.SQRT2;
      const I0 = (this.params.acVolt / Math.max(0.1, this.acZ)) * Math.SQRT2;

      // Instantaneous voltage and current
      const v_t = V0 * Math.cos(this.acPhasorAngle);
      const i_t = I0 * Math.cos(this.acPhasorAngle - this.acPhi);

      this.acWaveHistory.push({
        t: this.acTime,
        v: v_t,
        i: i_t
      });
      if (this.acWaveHistory.length > 200) this.acWaveHistory.shift();
    }

    // ==========================================
    // RENDERING
    // ==========================================

    render() {
      if (!this.width || this.width <= 300) {
        this._setupCanvasResolution();
      }
      const ctx = this.ctx;
      const w = this.width || 850;
      const h = this.height || 480;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      if (this.subMode === 'field_charges') {
        this.renderFieldCharges(ctx, w, h);
      } else if (this.subMode === 'lorentz_cyclotron') {
        this.renderLorentz(ctx, w, h);
      } else if (this.subMode === 'rc_circuit') {
        this.renderRCCircuit(ctx, w, h);
      } else if (this.subMode === 'faraday_induction') {
        this.renderFaraday(ctx, w, h);
      } else if (this.subMode === 'biot_savart') {
        this.renderBiotSavart(ctx, w, h);
      } else if (this.subMode === 'ac_rlc_resonance') {
        this.renderACRLC(ctx, w, h);
      }
    }

    // ----------------------------------------------------
    // SUBMODE 1: ELECTROSTATIC FIELD & EQUIPOTENTIALS
    // ----------------------------------------------------
    renderFieldCharges(ctx, w, h) {
      const step = 32;
      for (let x = step / 2; x < w; x += step) {
        for (let y = step / 2; y < h; y += step) {
          let Ex = 0;
          let Ey = 0;
          for (const c of this.charges) {
            const dx = x - c.x;
            const dy = y - c.y;
            const dSq = dx * dx + dy * dy;
            const dist = Math.sqrt(dSq);
            if (dist < c.r + 6) continue;
            const dE = (c.q * 3500) / (dSq + 100);
            Ex += dE * (dx / dist);
            Ey += dE * (dy / dist);
          }
          const mag = Math.hypot(Ex, Ey);
          if (mag > 0.1) {
            const angle = Math.atan2(Ey, Ex);
            const len = Math.min(18, Math.max(6, mag * 2.5));
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.65, mag * 0.1 + 0.15)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-len / 2, 0);
            ctx.lineTo(len / 2, 0);
            ctx.lineTo(len / 2 - 3, -2.5);
            ctx.moveTo(len / 2, 0);
            ctx.lineTo(len / 2 - 3, 2.5);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Equipotential Rings
      for (const c of this.charges) {
        if (Math.abs(c.q) < 0.1) continue;
        ctx.strokeStyle = c.q > 0 ? 'rgba(239, 68, 68, 0.28)' : 'rgba(56, 189, 248, 0.28)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        for (let rad = 35; rad <= 140; rad += 35) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, rad, 0, 2 * Math.PI);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // Charges
      for (const c of this.charges) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Sign inside circle
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.q > 0 ? '+' : (c.q < 0 ? '−' : '0'), c.x, c.y);

        // Numeric label badge below charge
        const sign = c.q > 0 ? '+' : '';
        const badgeText = `${sign}${c.q.toFixed(1)} μC`;
        ctx.font = 'bold 11px monospace';
        const badgeWidth = ctx.measureText(badgeText).width + 10;
        const badgeY = c.y + c.r + 14;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(c.x - badgeWidth / 2, badgeY - 8, badgeWidth, 16);
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(c.x - badgeWidth / 2, badgeY - 8, badgeWidth, 16);

        ctx.fillStyle = '#f8fafc';
        ctx.fillText(badgeText, c.x, badgeY + 1);
      }

      // Test Particles
      for (const p of this.testParticles) {
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#facc15';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('💡 ลากเพื่อย้ายประจุ (+q / -q) | คลิกพื้นที่ว่างเพื่อยิงประจุทดสอบตามเส้นสนามไฟฟ้า', 25, 20);
    }

    // ----------------------------------------------------
    // SUBMODE 2: LORENTZ FORCE & CYCLOTRON
    // ----------------------------------------------------
    renderLorentz(ctx, w, h) {
      const isMobile = w < 600;
      const magX = Math.round(Math.max(75, w * 0.14));
      const magW = Math.round(w - magX - 15);
      const magY = isMobile ? 45 : 55;
      const magH = Math.round(Math.min(360, h - (isMobile ? 60 : 75)));

      ctx.fillStyle = '#020617';
      ctx.fillRect(magX, magY, magW, magH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(magX, magY, magW, magH);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      for (let x = magX + 30; x < magX + magW; x += 55) {
        for (let y = magY + 30; y < magY + magH; y += 45) {
          ctx.fillText(this.params.magFieldB >= 0 ? '⊗' : '⊙', x, y);
        }
      }

      if (Math.abs(this.params.elecFieldE) > 1) {
        const plateW = Math.min(220, magW - 40);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(magX + 20, magY + 30, plateW, 8);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(magX + 20, magY + magH - 40, plateW, 8);
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px sans-serif';
        ctx.fillText('+ + + E_plate + + +', magX + 20 + plateW / 2, magY + 24);
        ctx.fillText('- - - E_plate - - -', magX + 20 + plateW / 2, magY + magH - 22);
      }

      const gunW = Math.max(55, magX - 15);
      const gunY = Math.round(magY + magH * 0.5 - 14);
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, gunY, gunW, 28);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(10, gunY, gunW, 28);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isMobile ? 'ปืน' : 'ปืนประจุ', 10 + gunW / 2, gunY + 18);

      for (const p of this.lorentzParticles) {
        const isNeg = (p.q < 0);
        const isAlpha = (p.type === 'alpha');
        const pColor = isNeg ? '#38bdf8' : (isAlpha ? '#f59e0b' : '#ef4444');
        const trailColor = isNeg ? 'rgba(56, 189, 248, 0.7)' : (isAlpha ? 'rgba(245, 158, 11, 0.7)' : 'rgba(239, 68, 68, 0.7)');
        const pRadius = isAlpha ? 7 : (isNeg ? 3.5 : 5.5);

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = trailColor;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, pRadius, 0, 2 * Math.PI);
        ctx.fillStyle = pColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 0.15, p.y + p.vy * 0.15);
        ctx.stroke();
      }

      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const r_calc = (this.params.particleMass * this.params.particleVelocity) / Math.max(0.01, Math.abs(this.params.particleCharge * this.params.magFieldB));
      if (isMobile) {
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`B = ${this.params.magFieldB.toFixed(2)} T | E = ${this.params.elecFieldE.toFixed(0)} V/m | R_norm = ${r_calc.toFixed(1)} m`, 15, 8);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px sans-serif';
        ctx.fillText(`* สเกลจำลองการศึกษา (m_norm) | มวลธรรมชาติจริง m_e/m_p ≈ 1/1836.15`, 15, 24);
      } else {
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`สนามแม่เหล็ก B = ${this.params.magFieldB.toFixed(2)} T | สนามไฟฟ้า E = ${this.params.elecFieldE.toFixed(1)} V/m | รัศมีไซโคลตรอน R_norm = ${r_calc.toFixed(1)} m`, 20, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10.5px sans-serif';
        ctx.fillText(`* สเกลการศึกษามาตรฐาน (Normalized Educational Scale m_norm) | อัตราส่วนมวลธรรมชาติจริง m_e / m_p ≈ 1 / 1836.15`, 20, 30);
      }
    }

    // ----------------------------------------------------
    // SUBMODE 3: RC TRANSIENT CIRCUIT
    // ----------------------------------------------------
    renderRCCircuit(ctx, w, h) {
      const cx = 50;
      const cy = 60;
      const cw = 320;
      const ch = 280;

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + cw, cy);
      ctx.lineTo(cx + cw, cy + ch);
      ctx.lineTo(cx, cy + ch);
      ctx.closePath();
      ctx.stroke();

      // Battery
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 15, cy + ch / 2 - 25, 30, 50);
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx - 20, cy + ch / 2 - 12); ctx.lineTo(cx + 20, cy + ch / 2 - 12); ctx.stroke();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 10, cy + ch / 2 + 12); ctx.lineTo(cx + 10, cy + ch / 2 + 12); ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.font = 'bold 12px sans-serif'; ctx.fillText(`+`, cx - 30, cy + ch / 2 - 10);
      ctx.fillStyle = '#38bdf8'; ctx.fillText(`-`, cx - 30, cy + ch / 2 + 15);
      ctx.fillStyle = '#f8fafc'; ctx.fillText(`${this.params.batteryVolt} V`, cx - 55, cy + ch / 2 + 3);

      // Resistor
      const rx = cx + cw / 2 - 40;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rx, cy - 15, 80, 30);
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(rx, cy - 12, 80, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`R = ${this.params.resistanceR} kΩ`, rx + 10, cy + 4);

      // Capacitor
      const capY = cy + ch / 2 - 20;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx + cw - 25, capY, 50, 40);
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(cx + cw - 20, capY + 5); ctx.lineTo(cx + cw + 20, capY + 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + cw - 20, capY + 30); ctx.lineTo(cx + cw + 20, capY + 30); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`C = ${this.params.capacitanceC} μF`, cx + cw + 25, capY + 22);

      // Switch
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx + 40, cy + ch - 15, 60, 30);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`สวิตช์: ${this.params.switchState.toUpperCase()}`, cx + 45, cy + ch + 5);

      // Electron dots
      for (const dot of this.electronDots) {
        let px = cx;
        let py = cy;
        const p = dot.pos;
        if (p < 0.25) {
          px = cx + (p / 0.25) * cw;
          py = cy;
        } else if (p < 0.5) {
          px = cx + cw;
          py = cy + ((p - 0.25) / 0.25) * ch;
        } else if (p < 0.75) {
          px = cx + cw - ((p - 0.5) / 0.25) * cw;
          py = cy + ch;
        } else {
          px = cx;
          py = cy + ch - ((p - 0.75) / 0.25) * ch;
        }
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#facc15';
        ctx.fill();
      }

      // Oscilloscope Strip-chart
      const oscX = 420;
      const oscY = 60;
      const oscW = 340;
      const oscH = 280;

      ctx.fillStyle = '#020617';
      ctx.fillRect(oscX, oscY, oscW, oscH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(oscX, oscY, oscW, oscH);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = oscY + 40; y < oscY + oscH; y += 40) {
        ctx.beginPath(); ctx.moveTo(oscX, y); ctx.lineTo(oscX + oscW, y); ctx.stroke();
      }

      if (this.rcHistory.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < this.rcHistory.length; i++) {
          const pt = this.rcHistory[i];
          const px = oscX + (i / 250) * oscW;
          const py = oscY + oscH - (pt.vc / Math.max(1, this.params.batteryVolt)) * (oscH - 40) - 20;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < this.rcHistory.length; i++) {
          const pt = this.rcHistory[i];
          const px = oscX + (i / 250) * oscW;
          const py = oscY + oscH - (pt.i / 0.15) * (oscH - 40) - 20;
          if (i === 0) ctx.moveTo(px, Math.max(oscY + 10, py));
          else ctx.lineTo(px, Math.max(oscY + 10, py));
        }
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`แรงดันตัวเก็บประจุ V_C(t) = ${this.capVoltage.toFixed(2)} V`, oscX + 15, oscY + 22);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`กระแส I(t) = ${Math.abs(this.resCurrent * 1000).toFixed(3)} mA`, oscX + 15, oscY + 40);

      const tau = (this.params.resistanceR * this.params.capacitanceC * 0.001).toFixed(2);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx, 360, w - 100, 80);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(cx, 360, w - 100, 80);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`⚡ วงจรทรานเชียนต์ RC: ค่าคงตัวเวลา τ = RC = (${this.params.resistanceR} kΩ)(${this.params.capacitanceC} μF) = ${tau} วินาที`, cx + 15, 385);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`สมการชาร์จ: V_C = E(1 - e^(-t/τ)) | พลังงานสะสม U_C = (1/2)CV² = ${(0.5 * this.params.capacitanceC * 1e-6 * this.capVoltage * this.capVoltage * 1000).toFixed(2)} mJ`, cx + 15, 410);
    }

    // ----------------------------------------------------
    // SUBMODE 4: FARADAY & LENZ INDUCTION WORKBENCH (NEW)
    // ----------------------------------------------------
    renderFaraday(ctx, w, h) {
      // 1. Top Section: Moving Bar Magnet & Solenoid Coil
      const coilCenterX = 450;
      const coilCenterY = 140;
      const coilW = 140;
      const coilH = 80;

      // Draw Magnetic Field Lines from Magnet
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 1.2;
      for (let r = 25; r <= 80; r += 25) {
        ctx.beginPath();
        ctx.ellipse(this.magnetX, this.magnetY, r * 1.6, r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Solenoid Coil Body (Back arcs)
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      const numTurns = 8;
      for (let i = 0; i < numTurns; i++) {
        const cx = coilCenterX - coilW / 2 + (i / (numTurns - 1)) * coilW;
        ctx.beginPath();
        ctx.ellipse(cx, coilCenterY, 10, coilH / 2, 0, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }

      // Bar Magnet (Draggable)
      const magW = 120;
      const magH = 36;
      const mx = this.magnetX;
      const my = this.magnetY;

      // North Pole (Red, right)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(mx, my - magH / 2, magW / 2, magH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(mx, my - magH / 2, magW / 2, magH);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', mx + magW / 4, my);

      // South Pole (Blue, left)
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(mx - magW / 2, my - magH / 2, magW / 2, magH);
      ctx.strokeRect(mx - magW / 2, my - magH / 2, magW / 2, magH);
      ctx.fillStyle = '#0f172a';
      ctx.fillText('S', mx - magW / 4, my);

      // Solenoid Coil Body (Front arcs, overlapping magnet when inside)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      for (let i = 0; i < numTurns; i++) {
        const cx = coilCenterX - coilW / 2 + (i / (numTurns - 1)) * coilW;
        ctx.beginPath();
        ctx.ellipse(cx, coilCenterY, 10, coilH / 2, 0, Math.PI / 2, 1.5 * Math.PI);
        ctx.stroke();
      }

      // Moving induced current dots on coil (Lenz direction)
      if (Math.abs(this.faradayEmf) > 0.05) {
        ctx.fillStyle = '#4ade80';
        for (const dot of this.faradayDots) {
          const cy = coilCenterY + Math.sin(dot.angle) * (coilH / 2);
          const cx = coilCenterX + Math.cos(dot.angle) * (coilW / 2 - 10);
          ctx.beginPath();
          ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Coil label & turns
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`ขดลวด N = ${this.params.faradayTurns} รอบ`, coilCenterX, coilCenterY + 60);

      // 2. Analog Galvanometer Dial (Top Right)
      const galvX = 690;
      const galvY = 140;
      const galvR = 60;

      // Outer bezel
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(galvX, galvY, galvR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Face scale
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(galvX, galvY, galvR - 8, 0, Math.PI * 2);
      ctx.fill();

      // Scale tick marks
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      for (let angle = -Math.PI / 4; angle <= Math.PI / 4; angle += Math.PI / 16) {
        const x1 = galvX + Math.sin(angle) * (galvR - 18);
        const y1 = galvY - Math.cos(angle) * (galvR - 18);
        const x2 = galvX + Math.sin(angle) * (galvR - 10);
        const y2 = galvY - Math.cos(angle) * (galvR - 10);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }

      // Zero & G marks
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('0', galvX, galvY - galvR + 25);
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('G', galvX, galvY + 25);

      // Deflecting Needle
      ctx.save();
      ctx.translate(galvX, galvY);
      ctx.rotate(this.galvanometerTheta);
      ctx.strokeStyle = this.galvanometerTheta > 0.02 ? '#ef4444' : (this.galvanometerTheta < -0.02 ? '#38bdf8' : '#10b981');
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, -galvR + 15);
      ctx.stroke();
      ctx.restore();

      // Center pivot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(galvX, galvY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Connect wires from coil to galvanometer
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(coilCenterX - 40, coilCenterY + coilH / 2);
      ctx.lineTo(coilCenterX - 40, 220);
      ctx.lineTo(galvX - 20, 220);
      ctx.lineTo(galvX - 20, galvY + galvR - 8);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(coilCenterX + 40, coilCenterY + coilH / 2);
      ctx.lineTo(coilCenterX + 40, 230);
      ctx.lineTo(galvX + 20, 230);
      ctx.lineTo(galvX + 20, galvY + galvR - 8);
      ctx.stroke();

      // 3. Bottom Strip Chart: Live Flux Phi_B(t) and Induced EMF E(t)
      const chartX = 50;
      const chartY = 270;
      const chartW = 700;
      const chartH = 150;

      ctx.fillStyle = '#020617';
      ctx.fillRect(chartX, chartY, chartW, chartH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(chartX, chartY, chartW, chartH);

      // Center Zero line
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartX, chartY + chartH / 2);
      ctx.lineTo(chartX + chartW, chartY + chartH / 2);
      ctx.stroke();

      // Plot Farady curves
      if (this.faradayHistory.length > 1) {
        // Curve 1: Flux Phi_B(t) (Cyan)
        ctx.beginPath();
        for (let i = 0; i < this.faradayHistory.length; i++) {
          const pt = this.faradayHistory[i];
          const px = chartX + (i / 220) * chartW;
          const py = chartY + chartH / 2 - pt.flux * 7;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Curve 2: Induced EMF E(t) (Lime Green)
        ctx.beginPath();
        for (let i = 0; i < this.faradayHistory.length; i++) {
          const pt = this.faradayHistory[i];
          const px = chartX + (i / 220) * chartW;
          const py = chartY + chartH / 2 - (pt.emf / 15.0) * (chartH / 2 - 10);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Live Readouts & Formula Legend
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🌀 กฎของฟาราเดย์: E = -N (dΦ_B/dt) | กฎของเลนซ์: ทิศกระแสเหนี่ยวนำต้านการเปลี่ยนแปลงของฟลักซ์แม่เหล็ก', chartX + 15, chartY + 20);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px sans-serif';
      ctx.fillText(`ฟลักซ์แม่เหล็ก Φ_B = ${(this.faradayFlux * 1000).toFixed(2)} mWb`, chartX + 15, chartY + 40);

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`แรงเคลื่อนไฟฟ้าเหนี่ยวนำ E = ${this.faradayEmf.toFixed(2)} V`, chartX + 220, chartY + 40);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px sans-serif';
      ctx.fillText(`ความเร็วแท่งแม่เหล็ก v_x = ${this.magnetVx.toFixed(0)} px/s (ลากเมาส์ขยับแม่เหล็กได้)`, chartX + 460, chartY + 40);
    }

    // ----------------------------------------------------
    // SUBMODE 5: BIOT-SAVART & FIELD SOURCES (NEW)
    // ----------------------------------------------------
    renderBiotSavart(ctx, w, h) {
      const type = this.params.biotType;

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`🧲 แหล่งกำเนิดสนามแม่เหล็ก: ${type === 'straight' ? 'ลวดตัวนำเส้นตรงเดี่ยว (B = μ₀I/2πr)' : (type === 'parallel' ? 'ลวดตัวนำขนานสองเส้น (แรงระหว่างตัวนำ F/L)' : (type === 'loop' ? 'ห่วงลวดวงกลมระนาบ (B_center = μ₀I/2R)' : 'ขดลวดโซเลนอยด์ (B = μ₀nI)'))}`, 25, 25);

      if (type === 'straight') {
        // Single wire at center (400, 240)
        const wx = 400;
        const wy = 240;

        // Concentric circular field lines
        ctx.lineWidth = 1.5;
        for (let r = 40; r <= 220; r += 35) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.beginPath();
          ctx.arc(wx, wy, r, 0, Math.PI * 2);
          ctx.stroke();

          // Arrowheads on circles (Counter-clockwise for out-of-screen current)
          const angle = Math.PI / 4;
          const ax = wx + r * Math.cos(angle);
          const ay = wy - r * Math.sin(angle);
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(-angle - Math.PI / 2);
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(-4, -8); ctx.lineTo(4, -8); ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Central Wire Cross-section
        ctx.beginPath();
        ctx.arc(wx, wy, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(wx, wy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`I = ${this.params.wireCurrent1} A (⊙ พุ่งออก)`, wx, wy + 32);

      } else if (type === 'parallel') {
        const d_px = this.params.wireDistance * 800;
        const w1x = 400 - d_px / 2;
        const w2x = 400 + d_px / 2;
        const wy = 240;

        // Two wires
        // Wire 1
        ctx.beginPath();
        ctx.arc(w1x, wy, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(w1x, wy, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(`I₁ = ${this.params.wireCurrent1} A (⊙)`, w1x, wy + 28);

        // Wire 2
        ctx.beginPath();
        ctx.arc(w2x, wy, 14, 0, Math.PI * 2);
        ctx.fillStyle = this.params.wireDirection > 0 ? '#38bdf8' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.params.wireDirection > 0 ? '⊙' : '⊗', w2x, wy);
        ctx.fillStyle = this.params.wireDirection > 0 ? '#38bdf8' : '#ef4444';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`I₂ = ${this.params.wireCurrent2} A (${this.params.wireDirection > 0 ? '⊙ พุ่งออก' : '⊗ พุ่งเข้า'})`, w2x, wy + 28);

        // Force arrows between wires
        const isAttract = this.params.wireDirection > 0;
        ctx.strokeStyle = isAttract ? '#10b981' : '#ec4899';
        ctx.lineWidth = 3;
        // Arrow on wire 1
        ctx.beginPath();
        ctx.moveTo(w1x, wy);
        ctx.lineTo(w1x + (isAttract ? 45 : -45), wy);
        ctx.stroke();
        // Arrow on wire 2
        ctx.beginPath();
        ctx.moveTo(w2x, wy);
        ctx.lineTo(w2x + (isAttract ? -45 : 45), wy);
        ctx.stroke();

        ctx.fillStyle = isAttract ? '#10b981' : '#ec4899';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(isAttract ? 'แรงดึงดูดเข้าหากัน (Attraction)' : 'แรงผลักออกจากกัน (Repulsion)', 400, wy - 30);
        ctx.font = '12px monospace';
        ctx.fillText(`F/L = ${(this.calculatedForce * 1000).toFixed(2)} mN/m | d = ${this.params.wireDistance.toFixed(2)} m`, 400, wy - 10);

      } else if (type === 'loop') {
        const lx = 400;
        const ly = 240;
        const R = 70;

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        // Looping dipole field curves
        for (let rad = 90; rad <= 200; rad += 35) {
          ctx.beginPath();
          ctx.ellipse(lx, ly, rad * 1.4, rad * 0.8, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Loop wire cross-section
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(lx, ly, 15, R, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`ห่วงวงกลม R = 0.10 m | I = ${this.params.wireCurrent1} A`, lx, ly + R + 25);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`B_center = ${(this.calculatedB * 1e6).toFixed(1)} μT (พุ่งไปทางขวา)`, lx, ly - R - 15);

      } else if (type === 'solenoid') {
        const sx1 = 270;
        const sx2 = 530;
        const sy1 = 190;
        const sy2 = 290;

        // Interior field vectors
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 2;
        for (let y = sy1 + 18; y < sy2; y += 22) {
          ctx.beginPath();
          ctx.moveTo(sx1 + 10, y);
          ctx.lineTo(sx2 - 10, y);
          ctx.stroke();
          // arrow
          ctx.beginPath();
          ctx.moveTo(sx2 - 10, y); ctx.lineTo(sx2 - 18, y - 4); ctx.lineTo(sx2 - 18, y + 4); ctx.closePath();
          ctx.fillStyle = '#38bdf8'; ctx.fill();
        }

        // Windings
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        for (let x = sx1; x <= sx2; x += 16) {
          ctx.beginPath();
          ctx.moveTo(x, sy1 - 8); ctx.lineTo(x + 8, sy2 + 8);
          ctx.stroke();
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`B_interior = μ₀nI = ${(this.calculatedB * 1000).toFixed(2)} mT (สนามสม่ำเสมอ)`, 400, sy1 - 25);
      }

      // Interactive Compass Needle at (compassX, compassY)
      const cx = this.compassX;
      const cy = this.compassY;
      const cRadius = 22;

      ctx.save();
      ctx.translate(cx, cy);

      // Compass dial base
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.arc(0, 0, cRadius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();

      // Needle rotated by compassAngle
      ctx.rotate(this.compassAngle);

      // North end (Red)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -3); ctx.lineTo(cRadius - 4, 0); ctx.lineTo(0, 3); ctx.closePath();
      ctx.fill();

      // South end (White)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, -3); ctx.lineTo(-cRadius + 4, 0); ctx.lineTo(0, 3); ctx.closePath();
      ctx.fill();

      // Pivot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Help banner
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🧭 เลื่อนเมาส์บนผืนผ้าใบเพื่อย้ายตำแหน่งเข็มทิศสำรวจเวกเตอร์สนามแม่เหล็ก B(x,y)', 25, h - 20);
    }

    // ----------------------------------------------------
    // SUBMODE 6: AC SERIES RLC RESONANCE (ENHANCED & OBSERVABLE)
    // ----------------------------------------------------
    renderACRLC(ctx, w, h) {
      const R = Math.max(0.1, this.params.acR);
      const L = Math.max(0.001, this.params.acL);
      const C = Math.max(0.1, this.params.acC) * 1e-6;
      const f = Math.max(1, this.params.acFreq);
      const w_elec = 2 * Math.PI * f;
      const XL = w_elec * L;
      const XC = 1 / (w_elec * C);
      const Vrms = this.params.acVolt;
      const V0 = Vrms * Math.SQRT2;
      const Irms = this.acIrms;
      const I0 = Irms * Math.SQRT2;
      const phi = this.acPhi;
      const phiDeg = phi * 180 / Math.PI;
      const angle = this.acPhasorAngle;
      const periodMs = 1000 / f;
      const timeShiftMs = (Math.abs(phi) / (2 * Math.PI)) * periodMs;

      // Half-power frequencies and bandwidth
      const Q = this.acQ;
      const f0 = this.acF0;
      const deltaF = Q > 0.01 ? f0 / Q : 0;
      const term = Math.sqrt(1 + 1 / (4 * Q * Q));
      const f1 = Math.max(0, f0 * (term - 1 / (2 * Q)));
      const f2 = f0 * (term + 1 / (2 * Q));
      const Imax = Vrms / R;

      // ----------------------------------------------------
      // Left: Rotating Phasor Diagram in Complex Plane
      // ----------------------------------------------------
      const pBoxX = 25;
      const pBoxY = 50;
      const pBoxW = 310;
      const pBoxH = 370;
      const pCenterX = pBoxX + pBoxW / 2;
      const pCenterY = 190;

      // Complex Plane Box
      ctx.fillStyle = '#020617';
      ctx.fillRect(pBoxX, pBoxY, pBoxW, pBoxH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pBoxX, pBoxY, pBoxW, pBoxH);

      // Title & Rotation Angle
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      const rotDeg = ((angle * 180 / Math.PI) % 360 + 360) % 360;
      ctx.fillText(`แผนภาพเฟสเซอร์หมุน • ωt = ${rotDeg.toFixed(0)}°`, pCenterX, pBoxY + 20);

      // Real and Imag Axes
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pBoxX + 10, pCenterY); ctx.lineTo(pBoxX + pBoxW - 10, pCenterY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pCenterX, pBoxY + 30); ctx.lineTo(pCenterX, pBoxY + 250); ctx.stroke();

      // Dashed reference circle
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.arc(pCenterX, pCenterY, 80, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right'; ctx.fillText('Real (แกนจริง)', pBoxX + pBoxW - 14, pCenterY - 6);
      ctx.textAlign = 'left'; ctx.fillText('+Imag (จินตภาพ)', pCenterX + 6, pBoxY + 42);

      // Scaled voltages for phasor drawing
      const maxV = Math.max(Vrms, Irms * R, Irms * XL, Irms * XC, 1);
      const baseScale = Math.min(1.2, 95 / maxV);
      const lenVR = Math.max(16, Math.min(105, (Irms * R) * baseScale));
      const lenVL = Math.max(12, Math.min(105, (Irms * XL) * baseScale));
      const lenVC = Math.max(12, Math.min(105, (Irms * XC) * baseScale));
      const lenVtot = Math.max(18, Math.min(105, Vrms * baseScale));

      const getPhasorTip = (len, offsetAngle) => {
        const theta = angle + offsetAngle;
        return {
          x: pCenterX + len * Math.cos(theta),
          y: pCenterY - len * Math.sin(theta),
          theta: theta
        };
      };

      const tipVR = getPhasorTip(lenVR, 0);
      const tipVL = getPhasorTip(lenVL, Math.PI / 2);
      const tipVC = getPhasorTip(lenVC, -Math.PI / 2);
      const tipVtot = getPhasorTip(lenVtot, phi);

      // Phasor summation dashed guides: V_tot = V_R + (V_L + V_C)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(tipVR.x, tipVR.y);
      ctx.lineTo(tipVtot.x, tipVtot.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const drawArrow = (fromX, fromY, toX, toY, color, width = 2.5) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(toX, toY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw Phasor Vectors
      drawArrow(pCenterX, pCenterY, tipVR.x, tipVR.y, '#38bdf8', 2.5);
      drawArrow(pCenterX, pCenterY, tipVL.x, tipVL.y, '#ef4444', 2.5);
      drawArrow(pCenterX, pCenterY, tipVC.x, tipVC.y, '#a855f7', 2.5);
      drawArrow(pCenterX, pCenterY, tipVtot.x, tipVtot.y, '#f59e0b', 3.0);

      // Labels on vector tips with collision avoidance
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';

      // Avoid collision between V_R and V_tot near resonance
      const vrYOffset = Math.abs(phi) < 0.25 ? 12 : -3;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`V_R (${(Irms * R).toFixed(0)}V)`, tipVR.x + 5, tipVR.y + vrYOffset);

      ctx.fillStyle = '#ef4444';
      ctx.fillText(`V_L (${(Irms * XL).toFixed(0)}V)`, tipVL.x + 5, tipVL.y - 3);

      ctx.fillStyle = '#a855f7';
      ctx.fillText(`V_C (${(Irms * XC).toFixed(0)}V)`, tipVC.x + 5, tipVC.y + 11);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`V_tot (${Vrms.toFixed(0)}V)`, tipVtot.x + 6, tipVtot.y - 5);

      // Phase Angle Arc phi between V_R and V_tot
      if (Math.abs(phi) > 0.05) {
        ctx.beginPath();
        const arcR = 30;
        const startA = -angle;
        const endA = -(angle + phi);
        ctx.arc(pCenterX, pCenterY, arcR, startA, endA, phi > 0);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = '#fcd34d';
        ctx.font = 'bold 9.5px monospace';
        const midA = -(angle + phi * 0.5);
        const arcTextX = pCenterX + (arcR + 14) * Math.cos(midA);
        const arcTextY = pCenterY + (arcR + 14) * Math.sin(midA);
        ctx.fillText(`φ=${phiDeg.toFixed(1)}°`, arcTextX - 12, arcTextY);
      }

      // Bottom Card in Phasor Box: Circuit Numbers & Live Values (Enhanced Readability & PF)
      const cardY = pBoxY + 242;
      const cardH = 120;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(pBoxX + 6, cardY, pBoxW - 12, cardH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(pBoxX + 6, cardY, pBoxW - 12, cardH);

      ctx.textAlign = 'left';

      // Row 1: Reactances
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('รีแอกแทนซ์:', pBoxX + 12, cardY + 18);
      ctx.font = 'bold 11.5px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`R=${R.toFixed(0)}Ω`, pBoxX + 80, cardY + 18);
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`XL=${XL.toFixed(1)}Ω`, pBoxX + 145, cardY + 18);
      ctx.fillStyle = '#a855f7';
      ctx.fillText(`XC=${XC.toFixed(1)}Ω`, pBoxX + 225, cardY + 18);

      // Row 2: Total Impedance & Nature Badge
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('อิมพีแดนซ์:', pBoxX + 12, cardY + 40);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Z = ${this.acZ.toFixed(1)} Ω`, pBoxX + 80, cardY + 40);

      const stateBadge = Math.abs(XL - XC) < 1.0 ? '🎯 เรโซแนนซ์ (XL ≈ XC)' : (XL > XC ? '🧲 V นำ I (Lagging)' : '⚡ I นำ V (Leading)');
      const badgeColor = Math.abs(XL - XC) < 1.0 ? '#10b981' : (XL > XC ? '#ef4444' : '#a855f7');
      ctx.font = 'bold 10.5px sans-serif';
      ctx.fillStyle = badgeColor;
      ctx.fillText(stateBadge, pBoxX + 172, cardY + 40);

      // Row 3: Instantaneous live v(t) and i(t)
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('ขณะใดขณะหนึ่ง:', pBoxX + 12, cardY + 63);
      const v_inst = V0 * Math.cos(angle);
      const i_inst = I0 * Math.cos(angle - phi);
      ctx.font = 'bold 11.5px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`v(t)=${(v_inst >= 0 ? '+' : '') + v_inst.toFixed(1)}V`, pBoxX + 100, cardY + 63);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`i(t)=${(i_inst >= 0 ? '+' : '') + i_inst.toFixed(2)}A`, pBoxX + 205, cardY + 63);

      // Row 4: Power Factor (PF) & Power Components (Requested by User)
      const pf = Math.cos(phi);
      const realP = Vrms * Irms * pf;
      const apparentS = Vrms * Irms;
      const reactiveQ = Vrms * Irms * Math.sin(phi);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('เพาเวอร์แฟกเตอร์:', pBoxX + 12, cardY + 86);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`PF = ${Math.abs(pf).toFixed(3)} (cos φ)`, pBoxX + 115, cardY + 86);

      // Row 5: Power Breakdown (P, S, Q)
      ctx.font = 'bold 10.5px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`P=${realP.toFixed(1)}W`, pBoxX + 12, cardY + 107);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`| S=${apparentS.toFixed(1)}VA`, pBoxX + 85, cardY + 107);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`| Q=${Math.abs(reactiveQ).toFixed(1)}VAR`, pBoxX + 165, cardY + 107);

      // ----------------------------------------------------
      // Right Top: Dual-Trace Oscilloscope (2 Full Cycles)
      // ----------------------------------------------------
      const oscX = 350;
      const oscY = pBoxY;
      const oscW = Math.max(380, w - oscX - 25);
      const oscH = 175;

      ctx.fillStyle = '#020617';
      ctx.fillRect(oscX, oscY, oscW, oscH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(oscX, oscY, oscW, oscH);

      // Grid Lines in Oscilloscope
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let gy = 1; gy < 4; gy++) {
        const yLine = oscY + (gy / 4) * oscH;
        ctx.beginPath(); ctx.moveTo(oscX, yLine); ctx.lineTo(oscX + oscW, yLine); ctx.stroke();
      }
      for (let gx = 1; gx < 8; gx++) {
        const xLine = oscX + (gx / 8) * oscW;
        ctx.beginPath(); ctx.moveTo(xLine, oscY); ctx.lineTo(xLine, oscY + oscH); ctx.stroke();
      }

      // Zero Center Line
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(oscX, oscY + oscH / 2);
      ctx.lineTo(oscX + oscW, oscY + oscH / 2);
      ctx.stroke();

      // Top Title Bar of Scope
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`v(t) แหล่งจ่าย: V_rms = ${Vrms.toFixed(0)} V (V₀ = ${V0.toFixed(0)} V)`, oscX + 10, oscY + 18);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`i(t) กระแสรวม: I_rms = ${Irms.toFixed(2)} A (I₀ = ${I0.toFixed(2)} A)`, oscX + 225, oscY + 18);

      // Left Axis Scales (Voltage)
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`+${V0.toFixed(0)}V`, oscX + 4, oscY + 30);
      ctx.fillText(`0V`, oscX + 4, oscY + oscH / 2 - 3);
      ctx.fillText(`-${V0.toFixed(0)}V`, oscX + 4, oscY + oscH - 6);

      // Right Axis Scales (Current)
      ctx.textAlign = 'right';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`+${I0.toFixed(2)}A`, oscX + oscW - 4, oscY + 30);
      ctx.fillText(`0A`, oscX + oscW - 4, oscY + oscH / 2 - 3);
      ctx.fillText(`-${I0.toFixed(2)}A`, oscX + oscW - 4, oscY + oscH - 6);

      // Draw 2 Smooth Sinusoidal Periods
      const wavePointsV = [];
      const wavePointsI = [];
      const steps = 140;

      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const px = oscX + u * oscW;
        const theta_s = angle - (1 - u) * (4 * Math.PI);
        const v_val = V0 * Math.cos(theta_s);
        const i_val = I0 * Math.cos(theta_s - phi);

        const py_v = oscY + oscH / 2 - (v_val / Math.max(1, V0)) * (oscH * 0.38);
        const py_i = oscY + oscH / 2 - (i_val / Math.max(0.01, I0)) * (oscH * 0.38);

        wavePointsV.push({ x: px, y: py_v });
        wavePointsI.push({ x: px, y: py_i });
      }

      // Trace v(t) - Amber
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      wavePointsV.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
      ctx.stroke();

      // Trace i(t) - Cyan
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      wavePointsI.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
      ctx.stroke();

      // Live Instantaneous Dots at right edge (u = 1)
      const curVPoint = wavePointsV[wavePointsV.length - 1];
      const curIPoint = wavePointsI[wavePointsI.length - 1];

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(curVPoint.x, curVPoint.y, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(curIPoint.x, curIPoint.y, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke();

      // Horizontal dashed projection line from Phasor tip to Scope right edge
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(tipVtot.x, tipVtot.y); ctx.lineTo(curVPoint.x, curVPoint.y); ctx.stroke();
      ctx.setLineDash([]);

      // Oscilloscope Period & Phase Delay Indicators
      const halfW = oscW / 2;
      const bracketY = oscY + oscH - 12;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(oscX + 40, bracketY);
      ctx.lineTo(oscX + 40 + halfW, bracketY);
      ctx.moveTo(oscX + 40, bracketY - 4); ctx.lineTo(oscX + 40, bracketY + 4);
      ctx.moveTo(oscX + 40 + halfW, bracketY - 4); ctx.lineTo(oscX + 40 + halfW, bracketY + 4);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`คาบ 1 Cycle: T = ${periodMs.toFixed(1)} ms`, oscX + 40 + halfW / 2, bracketY - 5);

      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'right';
      ctx.fillText(`φ = ${phiDeg.toFixed(1)}° (หน่วงเวลา Δt = ${timeShiftMs.toFixed(2)} ms)`, oscX + oscW - 12, bracketY - 5);

      // ----------------------------------------------------
      // Right Bottom: Resonance Curve Graph I_rms(f)
      // ----------------------------------------------------
      const resX = 350;
      const resY = 240;
      const resW = Math.max(380, w - resX - 25);
      const resH = 180;

      ctx.fillStyle = '#020617';
      ctx.fillRect(resX, resY, resW, resH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(resX, resY, resW, resH);

      // Graph Title
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 11.5px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`กราฟการสั่นพ้อง (Resonance): f₀ = 1/(2π√LC) = ${f0.toFixed(1)} Hz | Q = ${Q.toFixed(2)} | I_max = ${Imax.toFixed(2)} A`, resX + 12, resY + 18);

      const fMin = 10;
      const fMax = 300;
      const plotX0 = resX + 45;
      const plotW = resW - 65;
      const plotY0 = resY + 30;
      const plotH = resH - 58;

      // Frequency Grid & Ticks (x-axis)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const fTicks = [10, 50, 100, 150, 200, 250, 300];
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';

      fTicks.forEach(ft => {
        const tx = plotX0 + ((ft - fMin) / (fMax - fMin)) * plotW;
        ctx.beginPath(); ctx.moveTo(tx, plotY0); ctx.lineTo(tx, plotY0 + plotH); ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${ft}`, tx, plotY0 + plotH + 13);
      });
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('ความถี่ f (Hz)', plotX0 + plotW / 2, plotY0 + plotH + 24);

      // Current Ticks (y-axis)
      ctx.textAlign = 'right';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${Imax.toFixed(1)}A`, plotX0 - 6, plotY0 + 6);
      ctx.fillText(`${(Imax * 0.5).toFixed(1)}A`, plotX0 - 6, plotY0 + plotH / 2 + 4);
      ctx.fillText('0A', plotX0 - 6, plotY0 + plotH + 2);

      // Draw Resonance Curve I(f)
      ctx.beginPath();
      for (let px = 0; px <= plotW; px += 2) {
        const curF = fMin + (px / plotW) * (fMax - fMin);
        const w_f = 2 * Math.PI * curF;
        const Z_f = Math.sqrt(R * R + Math.pow(w_f * L - 1 / (w_f * C), 2));
        const I_f = Vrms / Z_f;
        const py = plotY0 + plotH - (I_f / Imax) * plotH;
        if (px === 0) ctx.moveTo(plotX0 + px, py);
        else ctx.lineTo(plotX0 + px, py);
      }
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Half-Power Bandwidth Line (I = 0.707 * I_max)
      const halfPowerY = plotY0 + plotH - 0.7071 * plotH;
      const pxF1 = plotX0 + ((f1 - fMin) / (fMax - fMin)) * plotW;
      const pxF2 = plotX0 + ((f2 - fMin) / (fMax - fMin)) * plotW;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(Math.max(plotX0, pxF1), halfPowerY);
      ctx.lineTo(Math.min(plotX0 + plotW, pxF2), halfPowerY);
      ctx.stroke();

      if (pxF1 >= plotX0 && pxF1 <= plotX0 + plotW) {
        ctx.beginPath(); ctx.moveTo(pxF1, halfPowerY); ctx.lineTo(pxF1, plotY0 + plotH); ctx.stroke();
      }
      if (pxF2 >= plotX0 && pxF2 <= plotX0 + plotW) {
        ctx.beginPath(); ctx.moveTo(pxF2, halfPowerY); ctx.lineTo(pxF2, plotY0 + plotH); ctx.stroke();
      }
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '9.5px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`แบนด์วิดท์ Δf = ${deltaF.toFixed(1)} Hz (f₁ = ${f1.toFixed(1)}, f₂ = ${f2.toFixed(1)})`, plotX0 + plotW - 6, plotY0 + 12);

      // Resonant frequency vertical dashed line (f0)
      const resPx = plotX0 + ((f0 - fMin) / (fMax - fMin)) * plotW;
      if (resPx >= plotX0 && resPx <= plotX0 + plotW) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(resPx, plotY0); ctx.lineTo(resPx, plotY0 + plotH); ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`f₀ = ${f0.toFixed(1)} Hz`, resPx, plotY0 - 4);
      }

      // Current Operating Point Marker (Dot + Coordinates)
      const curPx = plotX0 + ((f - fMin) / (fMax - fMin)) * plotW;
      const curPy = plotY0 + plotH - (Irms / Imax) * plotH;

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(plotX0, curPy); ctx.lineTo(curPx, curPy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(curPx, curPy); ctx.lineTo(curPx, plotY0 + plotH); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(curPx, curPy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.8; ctx.stroke();

      // Operating point tooltip badge
      const tooltipX = curPx < plotX0 + plotW - 140 ? curPx + 10 : curPx - 145;
      const tooltipY = Math.max(plotY0 + 12, curPy - 12);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(tooltipX, tooltipY, 138, 28);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.strokeRect(tooltipX, tooltipY, 138, 28);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 9.5px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`f = ${f.toFixed(1)} Hz | I = ${Irms.toFixed(2)} A`, tooltipX + 6, tooltipY + 12);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Z = ${this.acZ.toFixed(1)} Ω | φ = ${phiDeg.toFixed(1)}°`, tooltipX + 6, tooltipY + 23);
    }

    // ==========================================
    // TELEMETRY BROADCAST
    // ==========================================

    emitTelemetry() {
      if (typeof this.options.onTelemetryUpdate !== 'function') return;

      const tau = (this.params.resistanceR * this.params.capacitanceC * 0.001).toFixed(2) + ' s';
      const data = {
        mode: this.subMode,
        subMode: this.subMode,
        // Field & Charges
        chargeConfig: this.params.chargeConfig,
        chargeQ1: this.params.chargeQ1,
        chargeQ2: this.params.chargeQ2,
        numCharges: this.charges.length,
        // Common / RC
        capVoltage: this.capVoltage.toFixed(2) + ' V',
        resCurrent: (this.resCurrent * 1000).toFixed(3) + ' mA',
        tau: tau,
        magB: this.params.magFieldB + ' T',
        // Lorentz
        lorentzR: ((this.params.particleMass * this.params.particleVelocity) / Math.max(0.01, Math.abs(this.params.particleCharge * this.params.magFieldB))).toFixed(1) + ' m (norm)',
        particleType: this.params.particleType || 'proton',
        // Faraday
        faradayFlux: (this.faradayFlux * 1000).toFixed(2) + ' mWb',
        faradayEmf: this.faradayEmf.toFixed(2) + ' V',
        faradayTurns: this.params.faradayTurns,
        faradaySpeed: this.magnetVx.toFixed(0) + ' px/s',
        // Biot-Savart
        biotB: (this.calculatedB >= 0.001 ? (this.calculatedB * 1000).toFixed(2) + ' mT' : (this.calculatedB * 1e6).toFixed(1) + ' μT'),
        biotForce: (this.calculatedForce * 1000).toFixed(2) + ' mN/m',
        biotI1: this.params.wireCurrent1.toFixed(1) + ' A',
        biotI2: this.params.wireCurrent2.toFixed(1) + ' A',
        // AC RLC
        acFreq: this.params.acFreq.toFixed(1) + ' Hz',
        acZ: this.acZ.toFixed(1) + ' Ω',
        acPhi: (this.acPhi * 180 / Math.PI).toFixed(1) + '°',
        acIrms: this.acIrms.toFixed(2) + ' A',
        acF0: this.acF0.toFixed(1) + ' Hz',
        acQ: this.acQ.toFixed(2)
      };
      this.options.onTelemetryUpdate(data);
    }
  }

  return EMSimulator;
}));
