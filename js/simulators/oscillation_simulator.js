/**
 * oscillation_simulator.js - Interactive Oscillations, SHM, Damping & Resonance Simulator
 * Part of PhysicsNoza 3.0 Architecture (Chapter 03 Module)
 *
 * Simulates:
 *   Submode 1: Mass-Spring System (Horizontal & Vertical SHM, Phase Portrait & Energy Conservation)
 *   Submode 2: Simple Pendulum (Linearized Small-Angle vs Exact Nonlinear Large-Angle Dynamics)
 *   Submode 3: Damped & Driven Oscillations (Underdamped, Critical, Overdamped & Resonance Curve)
 *
 * Academic Standards:
 *   - Morin (2008), Intro to Classical Mechanics, Ch. 4 (Oscillations).
 *   - University Physics 15th Ed., Ch. 14 (Periodic Motion).
 *   - Symon (1971), Mechanics 3rd Ed., Ch. 2.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OscillationSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class OscillationSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for OscillationSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Sub-modes: 'spring' | 'pendulum' | 'damping_resonance' | 'double_pendulum'
      this.subMode = 'spring';

      // Simulation physical parameters
      this.params = {
        // Mass-spring
        mass: 2.0,            // kg (m)
        springK: 50.0,        // N/m (k)
        amplitude: 1.2,       // m (A)
        phaseRad: 0.0,        // rad (\phi)
        gravity: 9.80665,     // m/s^2 (g)
        springOrientation: 'horizontal', // 'horizontal' | 'vertical'

        // Pendulum
        length: 1.5,          // m (L)
        pendulumMass: 1.0,    // kg
        initialAngleDeg: 25.0,// degrees (\theta_0)

        // Damping & Driven Resonance
        dampingB: 0.8,        // N*s/m (damping coefficient b)
        drivingForceF0: 10.0, // N (F_0)
        drivingOmega: 5.0,    // rad/s (\omega)
        isDriven: true,       // whether external harmonic driver is active

        // Double Pendulum (Chaos)
        dpL1: 1.0,            // m (L1)
        dpL2: 1.0,            // m (L2)
        dpM1: 1.0,            // kg (m1)
        dpM2: 1.0,            // kg (m2)
        dpTheta1Deg: 90.0,    // degrees (\theta_1)
        dpTheta2Deg: 90.0,    // degrees (\theta_2)
        dpShowTrail: true
      };

      // State variables
      this.state = {
        simTime: 0.0,
        // Spring state
        x: 1.2,               // displacement (m)
        v: 0.0,               // velocity (m/s)
        a: 0.0,               // acceleration (m/s^2)

        // Pendulum exact state (numerical integration)
        thetaRad: 25.0 * Math.PI / 180.0,
        omegaRadS: 0.0,
        alphaRadS2: 0.0,

        // Linearized pendulum comparison state
        thetaLinearRad: 25.0 * Math.PI / 180.0,

        // Damping state
        xDamped: 1.2,
        vDamped: 0.0,
        aDamped: 0.0,

        // Double pendulum state
        dpTheta1: 90.0 * Math.PI / 180.0,
        dpTheta2: 90.0 * Math.PI / 180.0,
        dpOmega1: 0.0,
        dpOmega2: 0.0,
        dpAlpha1: 0.0,
        dpAlpha2: 0.0,
        dpTrail: [],
        dpMaxTrail: 350,

        // Rolling history for graphs (time-domain strip chart & phase orbit)
        timeHistory: [],      // array of { t, x, v, k, u }
        maxHistoryLength: 400
      };

      // Display toggles
      this.toggles = {
        showVelocity: true,
        showAcceleration: true,
        showForces: true,
        showEnergy: true,
        showPhaseSpace: true,
        showNonlinearGhost: true,
        showEnvelope: true
      };

      // Playback & Animation
      this.isPlaying = false;
      this.animId = null;
      this.lastTimestamp = 0;

      this._setupCanvasResolution();
      window.addEventListener('resize', () => this.resize());
    }

    _setupCanvasResolution() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width || 800;
      const height = rect.height || 480;

      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = width;
      this.height = height;
    }

    resize() {
      this._setupCanvasResolution();
      this.render();
    }

    setSubMode(mode) {
      if (['spring', 'pendulum', 'damping_resonance', 'double_pendulum'].includes(mode)) {
        this.subMode = mode;
        this.reset();
      }
    }

    setParam(key, value) {
      if (key in this.params) {
        this.params[key] = (typeof this.params[key] === 'boolean' || typeof this.params[key] === 'string')
          ? value
          : parseFloat(value);

        if (key === 'amplitude' && this.subMode === 'spring') {
          this.state.x = this.params.amplitude;
          this.state.v = 0.0;
        } else if (key === 'initialAngleDeg' && this.subMode === 'pendulum') {
          const rad = this.params.initialAngleDeg * Math.PI / 180.0;
          this.state.thetaRad = rad;
          this.state.thetaLinearRad = rad;
          this.state.omegaRadS = 0.0;
        } else if (this.subMode === 'double_pendulum' && (key === 'dpTheta1Deg' || key === 'dpTheta2Deg')) {
          this.state.dpTheta1 = this.params.dpTheta1Deg * Math.PI / 180.0;
          this.state.dpTheta2 = this.params.dpTheta2Deg * Math.PI / 180.0;
          this.state.dpOmega1 = 0.0;
          this.state.dpOmega2 = 0.0;
          this.state.dpTrail = [];
        }

        this.render();
        this._emitTelemetry();
      }
    }

    setToggle(key, value) {
      if (key in this.toggles) {
        this.toggles[key] = Boolean(value);
        this.render();
      }
    }

    play() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.lastTimestamp = performance.now();
      this._loop();
    }

    pause() {
      this.isPlaying = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    step(dt = 0.02) {
      this.pause();
      this._updatePhysics(dt);
      this.render();
      this._emitTelemetry();
    }

    reset() {
      this.pause();
      this.state.simTime = 0.0;
      this.state.x = this.params.amplitude;
      this.state.v = 0.0;
      this.state.a = - (this.params.springK / this.params.mass) * this.state.x;

      const theta0 = this.params.initialAngleDeg * Math.PI / 180.0;
      this.state.thetaRad = theta0;
      this.state.thetaLinearRad = theta0;
      this.state.omegaRadS = 0.0;
      this.state.alphaRadS2 = - (this.params.gravity / this.params.length) * Math.sin(theta0);

      this.state.xDamped = this.params.amplitude;
      this.state.vDamped = 0.0;
      this.state.aDamped = 0.0;

      this.state.dpTheta1 = this.params.dpTheta1Deg * Math.PI / 180.0;
      this.state.dpTheta2 = this.params.dpTheta2Deg * Math.PI / 180.0;
      this.state.dpOmega1 = 0.0;
      this.state.dpOmega2 = 0.0;
      this.state.dpAlpha1 = 0.0;
      this.state.dpAlpha2 = 0.0;
      this.state.dpTrail = [];

      this.state.timeHistory = [];
      this.render();
      this._emitTelemetry();
    }

    _loop() {
      if (!this.isPlaying) return;
      const now = performance.now();
      let dt = (now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;

      // Cap delta time to prevent physics instability
      if (dt > 0.05) dt = 0.05;

      // Sub-step RK4 integration for stability
      const subSteps = 4;
      const subDt = dt / subSteps;
      for (let s = 0; s < subSteps; s++) {
        this._updatePhysics(subDt);
      }

      this.render();
      this._emitTelemetry();

      this.animId = requestAnimationFrame(() => this._loop());
    }

    _updatePhysics(dt) {
      this.state.simTime += dt;
      const t = this.state.simTime;

      if (this.subMode === 'spring') {
        const k = Math.max(0.1, this.params.springK);
        const m = Math.max(0.1, this.params.mass);
        const omega0 = Math.sqrt(k / m);
        const A = this.params.amplitude;
        const phi = this.params.phaseRad;

        // Exact analytical solution for undamped SHM
        this.state.x = A * Math.cos(omega0 * t + phi);
        this.state.v = -A * omega0 * Math.sin(omega0 * t + phi);
        this.state.a = -omega0 * omega0 * this.state.x;

        // Push to history
        this._recordHistory(t, this.state.x, this.state.v, 0.5 * m * this.state.v * this.state.v, 0.5 * k * this.state.x * this.state.x);

      } else if (this.subMode === 'pendulum') {
        const g = this.params.gravity;
        const L = Math.max(0.2, this.params.length);
        const m = Math.max(0.1, this.params.pendulumMass);
        const omega0 = Math.sqrt(g / L);

        // Exact nonlinear pendulum integration using 4th-Order Runge-Kutta
        const f = (theta, omega) => - (g / L) * Math.sin(theta);

        const th = this.state.thetaRad;
        const om = this.state.omegaRadS;

        const k1_th = om;
        const k1_om = f(th, om);

        const k2_th = om + 0.5 * dt * k1_om;
        const k2_om = f(th + 0.5 * dt * k1_th, om + 0.5 * dt * k1_om);

        const k3_th = om + 0.5 * dt * k2_om;
        const k3_om = f(th + 0.5 * dt * k2_th, om + 0.5 * dt * k2_om);

        const k4_th = om + dt * k3_om;
        const k4_om = f(th + dt * k3_th, om + dt * k3_om);

        this.state.thetaRad += (dt / 6) * (k1_th + 2 * k2_th + 2 * k3_th + k4_th);
        this.state.omegaRadS += (dt / 6) * (k1_om + 2 * k2_om + 2 * k3_om + k4_om);
        this.state.alphaRadS2 = f(this.state.thetaRad, this.state.omegaRadS);

        // Analytical linearized comparison: \theta_lin(t) = \theta_0 \cos(\omega_0 t)
        const theta0 = this.params.initialAngleDeg * Math.PI / 180.0;
        this.state.thetaLinearRad = theta0 * Math.cos(omega0 * t);

        // Energy
        const vBob = L * this.state.omegaRadS;
        const K = 0.5 * m * vBob * vBob;
        const U = m * g * L * (1.0 - Math.cos(this.state.thetaRad));
        this._recordHistory(t, this.state.thetaRad * L, vBob, K, U);

      } else if (this.subMode === 'damping_resonance') {
        const m = Math.max(0.1, this.params.mass);
        const k = Math.max(0.1, this.params.springK);
        const b = Math.max(0.0, this.params.dampingB);
        const F0 = this.params.isDriven ? this.params.drivingForceF0 : 0.0;
        const omegaDrive = this.params.drivingOmega;

        // Differential equation: m \ddot{x} + b \dot{x} + k x = F0 \cos(\omega t)
        // \ddot{x} = (F0 \cos(\omega t) - b \dot{x} - k x) / m
        const accelFunc = (x, v, currT) => {
          const driveForce = F0 * Math.cos(omegaDrive * currT);
          return (driveForce - b * v - k * x) / m;
        };

        // RK4 Integration for Damped/Driven Oscillator
        const x = this.state.xDamped;
        const v = this.state.vDamped;

        const k1_x = v;
        const k1_v = accelFunc(x, v, t);

        const k2_x = v + 0.5 * dt * k1_v;
        const k2_v = accelFunc(x + 0.5 * dt * k1_x, v + 0.5 * dt * k1_v, t + 0.5 * dt);

        const k3_x = v + 0.5 * dt * k2_v;
        const k3_v = accelFunc(x + 0.5 * dt * k2_x, v + 0.5 * dt * k2_v, t + 0.5 * dt);

        const k4_x = v + dt * k3_v;
        const k4_v = accelFunc(x + dt * k3_x, v + dt * k3_v, t + dt);

        this.state.xDamped += (dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
        this.state.vDamped += (dt / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);
        this.state.aDamped = accelFunc(this.state.xDamped, this.state.vDamped, t + dt);

        const K = 0.5 * m * this.state.vDamped * this.state.vDamped;
        const U = 0.5 * k * this.state.xDamped * this.state.xDamped;
        this._recordHistory(t, this.state.xDamped, this.state.vDamped, K, U);
      } else if (this.subMode === 'double_pendulum') {
        const g = this.params.gravity;
        const m1 = Math.max(0.1, this.params.dpM1);
        const m2 = Math.max(0.1, this.params.dpM2);
        const l1 = Math.max(0.2, this.params.dpL1);
        const l2 = Math.max(0.2, this.params.dpL2);

        // Equations of motion for double pendulum (Lagrangian mechanics)
        const dpDerivs = (th1, om1, th2, om2) => {
          const dTh = th1 - th2;
          const cosD = Math.cos(dTh);
          const sinD = Math.sin(dTh);

          const den = 2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2);

          const num1 = -g * (2 * m1 + m2) * Math.sin(th1)
                     - m2 * g * Math.sin(th1 - 2 * th2)
                     - 2 * sinD * m2 * (om2 * om2 * l2 + om1 * om1 * l1 * cosD);
          const alpha1 = num1 / (l1 * den);

          const num2 = 2 * sinD * (
            om1 * om1 * l1 * (m1 + m2)
            + g * (m1 + m2) * Math.cos(th1)
            + om2 * om2 * l2 * m2 * cosD
          );
          const alpha2 = num2 / (l2 * den);

          return { dTh1: om1, dOm1: alpha1, dTh2: om2, dOm2: alpha2 };
        };

        const th1 = this.state.dpTheta1;
        const om1 = this.state.dpOmega1;
        const th2 = this.state.dpTheta2;
        const om2 = this.state.dpOmega2;

        const k1 = dpDerivs(th1, om1, th2, om2);
        const k2 = dpDerivs(th1 + 0.5 * dt * k1.dTh1, om1 + 0.5 * dt * k1.dOm1,
                            th2 + 0.5 * dt * k1.dTh2, om2 + 0.5 * dt * k1.dOm2);
        const k3 = dpDerivs(th1 + 0.5 * dt * k2.dTh1, om1 + 0.5 * dt * k2.dOm1,
                            th2 + 0.5 * dt * k2.dTh2, om2 + 0.5 * dt * k2.dOm2);
        const k4 = dpDerivs(th1 + dt * k3.dTh1, om1 + dt * k3.dOm1,
                            th2 + dt * k3.dTh2, om2 + dt * k3.dOm2);

        this.state.dpTheta1 += (dt / 6) * (k1.dTh1 + 2 * k2.dTh1 + 2 * k3.dTh1 + k4.dTh1);
        this.state.dpOmega1 += (dt / 6) * (k1.dOm1 + 2 * k2.dOm1 + 2 * k3.dOm1 + k4.dOm1);
        this.state.dpTheta2 += (dt / 6) * (k1.dTh2 + 2 * k2.dTh2 + 2 * k3.dTh2 + k4.dTh2);
        this.state.dpOmega2 += (dt / 6) * (k1.dOm2 + 2 * k2.dOm2 + 2 * k3.dOm2 + k4.dOm2);
        this.state.dpAlpha1 = k1.dOm1;
        this.state.dpAlpha2 = k1.dOm2;

        // Trace tip of bob 2
        const pivotX = this.width * 0.42;
        const pivotY = 110;
        const pxScale = 100;
        const x1 = pivotX + l1 * pxScale * Math.sin(this.state.dpTheta1);
        const y1 = pivotY + l1 * pxScale * Math.cos(this.state.dpTheta1);
        const x2 = x1 + l2 * pxScale * Math.sin(this.state.dpTheta2);
        const y2 = y1 + l2 * pxScale * Math.cos(this.state.dpTheta2);

        this.state.dpTrail.push({ x: x2, y: y2 });
        if (this.state.dpTrail.length > this.state.dpMaxTrail) {
          this.state.dpTrail.shift();
        }

        const w1 = this.state.dpOmega1;
        const w2 = this.state.dpOmega2;
        const t1 = this.state.dpTheta1;
        const t2 = this.state.dpTheta2;
        const K = 0.5 * (m1 + m2) * l1 * l1 * w1 * w1 + 0.5 * m2 * l2 * l2 * w2 * w2 + m2 * l1 * l2 * w1 * w2 * Math.cos(t1 - t2);
        const U = (m1 + m2) * g * l1 * (1 - Math.cos(t1)) + m2 * g * l2 * (1 - Math.cos(t2));
        this._recordHistory(t, (x2 - pivotX) / pxScale, (w1 * l1 + w2 * l2) / 2, K, U);
      }
    }

    _recordHistory(t, x, v, k, u) {
      this.state.timeHistory.push({ t, x, v, k, u });
      if (this.state.timeHistory.length > this.state.maxHistoryLength) {
        this.state.timeHistory.shift();
      }
    }

    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      // Dark theme background
      ctx.fillStyle = '#0B1120';
      ctx.fillRect(0, 0, w, h);

      // Grid backdrop
      this._drawGrid(ctx, w, h);

      // Submode specific rendering
      if (this.subMode === 'spring') {
        this._renderSpringMode(ctx, w, h);
      } else if (this.subMode === 'pendulum') {
        this._renderPendulumMode(ctx, w, h);
      } else if (this.subMode === 'damping_resonance') {
        this._renderDampingResonanceMode(ctx, w, h);
      } else if (this.subMode === 'double_pendulum') {
        this._renderDoublePendulumMode(ctx, w, h);
      }

      // Shared HUD telemetry overlays
      if (this.toggles.showEnergy) {
        this._renderEnergyBarHUD(ctx, w, h);
      }
      if (this.toggles.showPhaseSpace) {
        this._renderPhaseSpaceHUD(ctx, w, h);
      }
    }

    _drawGrid(ctx, w, h) {
      ctx.save();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      const step = 40;

      ctx.beginPath();
      for (let x = 0; x <= w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // ==========================================
    // 1. MASS-SPRING SHM RENDERING
    // ==========================================
    _renderSpringMode(ctx, w, h) {
      const centerX = w * 0.42;
      const centerY = h * 0.52;
      const wallX = 50;
      const blockWidth = 70;
      const blockHeight = 50;

      // Scale: 1 meter = 100 pixels
      const scale = 110;
      const equilibriumX = centerX;
      const blockX = equilibriumX + this.state.x * scale;
      const blockY = centerY;

      // Draw Wall & Ground
      ctx.save();
      ctx.strokeStyle = '#64748B';
      ctx.fillStyle = '#1E293B';
      ctx.lineWidth = 4;

      // Vertical Wall on Left
      ctx.beginPath();
      ctx.moveTo(wallX, centerY - 80);
      ctx.lineTo(wallX, centerY + 80);
      ctx.stroke();

      // Wall hatch marks
      ctx.lineWidth = 1.5;
      for (let y = centerY - 75; y <= centerY + 75; y += 12) {
        ctx.beginPath();
        ctx.moveTo(wallX, y);
        ctx.lineTo(wallX - 14, y + 8);
        ctx.stroke();
      }

      // Frictionless horizontal floor
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(wallX, centerY + blockHeight / 2 + 1);
      ctx.lineTo(w - 20, centerY + blockHeight / 2 + 1);
      ctx.stroke();

      // Floor hatch marks
      ctx.lineWidth = 1;
      for (let x = wallX + 15; x < w - 20; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, centerY + blockHeight / 2 + 2);
        ctx.lineTo(x - 10, centerY + blockHeight / 2 + 12);
        ctx.stroke();
      }
      ctx.restore();

      // Draw Equilibrium Guideline (x = 0)
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(equilibriumX, centerY - 110);
      ctx.lineTo(equilibriumX, centerY + 100);
      ctx.stroke();

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('ตำแหน่งสมดุล x = 0', equilibriumX - 45, centerY - 116);
      ctx.fillText(`แอมพลิจูด A = ±${this.params.amplitude.toFixed(2)} m`, equilibriumX - 52, centerY + 95);
      ctx.restore();

      // Draw Coiled Spring from wallX to blockX
      this._drawCoiledSpring(ctx, wallX, centerY, blockX - blockWidth / 2, centerY, 14, 16, '#F59E0B');

      // Draw Mass Block
      ctx.save();
      const grad = ctx.createLinearGradient(blockX - blockWidth / 2, blockY - blockHeight / 2, blockX + blockWidth / 2, blockY + blockHeight / 2);
      grad.addColorStop(0, '#38BDF8');
      grad.addColorStop(1, '#0284C7');

      ctx.fillStyle = grad;
      ctx.strokeStyle = '#BAE6FD';
      ctx.lineWidth = 2;

      // Rounded rect block
      const r = 6;
      const bx = blockX - blockWidth / 2;
      const by = blockY - blockHeight / 2;
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.lineTo(bx + blockWidth - r, by);
      ctx.quadraticCurveTo(bx + blockWidth, by, bx + blockWidth, by + r);
      ctx.lineTo(bx + blockWidth, by + blockHeight - r);
      ctx.quadraticCurveTo(bx + blockWidth, by + blockHeight, bx + blockWidth - r, by + blockHeight);
      ctx.lineTo(bx + r, by + blockHeight);
      ctx.quadraticCurveTo(bx, by + blockHeight, bx, by + blockHeight - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Label on block
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${this.params.mass.toFixed(1)} kg`, blockX, blockY);
      ctx.restore();

      // Vector Overlays
      if (this.toggles.showVelocity && Math.abs(this.state.v) > 0.02) {
        const vLen = this.state.v * 28;
        this._drawArrow(ctx, blockX, blockY - blockHeight / 2 - 15, blockX + vLen, blockY - blockHeight / 2 - 15, '#10B981', `v = ${this.state.v.toFixed(2)} m/s`);
      }

      if (this.toggles.showAcceleration && Math.abs(this.state.a) > 0.05) {
        const aLen = this.state.a * 3.5;
        this._drawArrow(ctx, blockX, blockY + blockHeight / 2 + 25, blockX + aLen, blockY + blockHeight / 2 + 25, '#EC4899', `a = ${this.state.a.toFixed(2)} m/s²`);
      }

      if (this.toggles.showForces && Math.abs(this.state.x) > 0.02) {
        const Fs = -this.params.springK * this.state.x;
        const fLen = Fs * 0.9;
        this._drawArrow(ctx, blockX, blockY, blockX + fLen, blockY, '#EF4444', `Fs = ${Fs.toFixed(1)} N`);
      }

      // Title & Subtitle Badge
      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🌀 ฮาร์มอนิกอย่างง่าย มวลติดสปริง (SHM Mass-Spring)', 50, 32);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`สมการอนุพันธ์: m d²x/dt² + kx = 0 | ω₀ = √(k/m) = ${(Math.sqrt(this.params.springK/this.params.mass)).toFixed(2)} rad/s | T = ${(2*Math.PI*Math.sqrt(this.params.mass/this.params.springK)).toFixed(2)} s`, 50, 50);
      ctx.restore();
    }

    _drawCoiledSpring(ctx, x1, y1, x2, y2, coils, radius, color) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(x1, y1);
      ctx.rotate(angle);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(0, 0);

      // Lead-in wire
      const leadLen = 18;
      ctx.lineTo(leadLen, 0);

      const springBodyLen = dist - 2 * leadLen;
      if (springBodyLen > 10) {
        const step = springBodyLen / (coils * 2);
        for (let i = 0; i < coils * 2; i++) {
          const sx = leadLen + (i + 0.5) * step;
          const sy = (i % 2 === 0 ? -1 : 1) * radius;
          ctx.lineTo(sx, sy);
        }
      }

      // Lead-out wire
      ctx.lineTo(dist - leadLen, 0);
      ctx.lineTo(dist, 0);
      ctx.stroke();
      ctx.restore();
    }

    // ==========================================
    // 2. SIMPLE PENDULUM RENDERING
    // ==========================================
    _renderPendulumMode(ctx, w, h) {
      const pivotX = w * 0.42;
      const pivotY = 90;
      const L_px = Math.min(220, this.params.length * 130);

      // Current nonlinear position
      const th = this.state.thetaRad;
      const bobX = pivotX + L_px * Math.sin(th);
      const bobY = pivotY + L_px * Math.cos(th);

      // Linearized approximation ghost position
      const thLin = this.state.thetaLinearRad;
      const bobLinX = pivotX + L_px * Math.sin(thLin);
      const bobLinY = pivotY + L_px * Math.cos(thLin);

      // Draw Ceiling & Pivot
      ctx.save();
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pivotX - 60, pivotY);
      ctx.lineTo(pivotX + 60, pivotY);
      ctx.stroke();

      // Ceiling hatch marks
      ctx.lineWidth = 1;
      for (let x = pivotX - 55; x <= pivotX + 55; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, pivotY);
        ctx.lineTo(x + 8, pivotY - 8);
        ctx.stroke();
      }

      // Pivot bearing
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Vertical reference line (\theta = 0)
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX, pivotY + L_px + 45);
      ctx.stroke();
      ctx.restore();

      // Draw Arc Guideway
      ctx.save();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      const maxTh = Math.max(Math.abs(th), Math.abs(this.params.initialAngleDeg * Math.PI / 180)) + 0.1;
      ctx.arc(pivotX, pivotY, L_px, Math.PI / 2 - maxTh, Math.PI / 2 + maxTh);
      ctx.stroke();
      ctx.restore();

      // Angle indicator arc
      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const startA = Math.PI / 2;
      const endA = Math.PI / 2 - th;
      ctx.arc(pivotX, pivotY, 40, Math.min(startA, endA), Math.max(startA, endA));
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 11px Inter, sans-serif';
      const degText = `${(th * 180 / Math.PI).toFixed(1)}°`;
      ctx.fillText(`θ = ${degText}`, pivotX + (th >= 0 ? 46 : -85), pivotY + 36);
      ctx.restore();

      // Linearized Ghost Bob (Shows deviation for large angles)
      if (this.toggles.showNonlinearGhost && Math.abs(this.params.initialAngleDeg) > 5) {
        ctx.save();
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobLinX, bobLinY);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.beginPath();
        ctx.arc(bobLinX, bobLinY, 14, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('SHM เชิงเส้น (sin θ ≈ θ)', bobLinX + 16, bobLinY - 6);
        ctx.restore();
      }

      // Pendulum Rod (Nonlinear real)
      ctx.save();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Bob
      const bobRadius = 18;
      const bobGrad = ctx.createRadialGradient(bobX - 4, bobY - 4, 3, bobX, bobY, bobRadius);
      bobGrad.addColorStop(0, '#F59E0B');
      bobGrad.addColorStop(1, '#D97706');

      ctx.fillStyle = bobGrad;
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${this.params.pendulumMass.toFixed(1)}kg`, bobX, bobY);
      ctx.restore();

      // Vectors on Bob
      const g = this.params.gravity;
      const m = this.params.pendulumMass;
      const vTangential = this.params.length * this.state.omegaRadS;

      if (this.toggles.showVelocity && Math.abs(vTangential) > 0.05) {
        // Velocity vector perpendicular to rod
        const vx = -Math.cos(th) * vTangential * 25;
        const vy = Math.sin(th) * vTangential * 25;
        this._drawArrow(ctx, bobX, bobY, bobX + vx, bobY + vy, '#10B981', `v = ${vTangential.toFixed(2)} m/s`);
      }

      if (this.toggles.showForces) {
        // Gravity vector downwards
        this._drawArrow(ctx, bobX, bobY, bobX, bobY + 45, '#EF4444', `W = ${(m * g).toFixed(1)} N`);

        // Tension vector along rod towards pivot
        const tension = m * g * Math.cos(th) + m * (vTangential * vTangential) / this.params.length;
        const tLen = Math.min(65, tension * 3.5);
        const tx = -Math.sin(th) * tLen;
        const ty = -Math.cos(th) * tLen;
        this._drawArrow(ctx, bobX, bobY, bobX + tx, bobY + ty, '#38BDF8', `T = ${tension.toFixed(1)} N`);
      }

      // Period comparison card
      const omega0 = Math.sqrt(g / this.params.length);
      const T0 = 2 * Math.PI / omega0;
      const theta0Rad = this.params.initialAngleDeg * Math.PI / 180.0;
      const Texact = T0 * (1.0 + (1.0/16.0) * (theta0Rad * theta0Rad));
      const errorPct = ((Texact - T0) / T0) * 100.0;

      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🕰️ ลูกตุ้มนาฬิกาอย่างง่าย (Simple Pendulum)', 50, 32);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`สมการไม่เป็นเชิงเส้น: d²θ/dt² + (g/L) sin θ = 0 | คาบเชิงเส้น T₀ = ${T0.toFixed(3)} s | คาบไม่เป็นเชิงเส้น T ≈ ${Texact.toFixed(3)} s (คลาดเคลื่อน +${errorPct.toFixed(2)}%)`, 50, 50);
      ctx.restore();
    }

    // ==========================================
    // 3. DAMPING & RESONANCE RENDERING
    // ==========================================
    _renderDampingResonanceMode(ctx, w, h) {
      const m = Math.max(0.1, this.params.mass);
      const k = Math.max(0.1, this.params.springK);
      const b = Math.max(0.0, this.params.dampingB);
      const omega0 = Math.sqrt(k / m);
      const gamma = b / m;
      const zeta = gamma / (2 * omega0);
      const Q = (gamma > 0) ? (omega0 / gamma) : Infinity;

      // Regime classification
      let regimeText = '';
      let regimeColor = '#10B981';
      if (zeta < 0.98) {
        regimeText = `หน่วงต่ำ (Underdamped, ζ = ${zeta.toFixed(2)} < 1)`;
        regimeColor = '#38BDF8';
      } else if (Math.abs(zeta - 1.0) <= 0.05) {
        regimeText = `หน่วงวิกฤต (Critically Damped, ζ ≈ 1.00)`;
        regimeColor = '#F59E0B';
      } else {
        regimeText = `หน่วงเกิน (Overdamped, ζ = ${zeta.toFixed(2)} > 1)`;
        regimeColor = '#EF4444';
      }

      // Visual Layout: Left stage is mechanical oscillator with dashpot, Right is dynamic resonance / strip chart
      const centerX = w * 0.35;
      const centerY = h * 0.50;
      const wallX = 40;
      const blockW = 60;
      const blockH = 46;
      const scale = 80;
      const blockX = centerX + this.state.xDamped * scale;

      // Base driver shaker if driven
      let driverOffset = 0;
      if (this.params.isDriven) {
        driverOffset = 12 * Math.cos(this.params.drivingOmega * this.state.simTime);
      }
      const actualWallX = wallX + driverOffset;

      // Draw Driver Piston Base
      ctx.save();
      ctx.fillStyle = '#334155';
      ctx.fillRect(actualWallX - 12, centerY - 65, 12, 130);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2;
      ctx.strokeRect(actualWallX - 12, centerY - 65, 12, 130);

      // Shaker arm
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(0, centerY - 8, actualWallX - 12, 16);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(this.params.isDriven ? 'แรงกระตุ้น F₀ cos(ωt)' : 'ฐานยึดนิ่ง', 35, centerY - 72);
      ctx.restore();

      // Draw Spring on top half
      this._drawCoiledSpring(ctx, actualWallX, centerY - 25, blockX - blockW / 2, centerY - 25, 10, 12, '#38BDF8');

      // Draw Viscous Dashpot Damper on bottom half
      this._drawDashpotDamper(ctx, actualWallX, centerY + 25, blockX - blockW / 2, centerY + 25, b);

      // Mass Block
      ctx.save();
      const grad = ctx.createLinearGradient(blockX - blockW/2, centerY - blockH/2, blockX + blockW/2, centerY + blockH/2);
      grad.addColorStop(0, '#8B5CF6');
      grad.addColorStop(1, '#6D28D9');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#DDD6FE';
      ctx.lineWidth = 2;
      ctx.fillRect(blockX - blockW/2, centerY - blockH/2, blockW, blockH);
      ctx.strokeRect(blockX - blockW/2, centerY - blockH/2, blockW, blockH);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${m.toFixed(1)}kg`, blockX, centerY);
      ctx.restore();

      // Heading
      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🌊 การสั่นแบบมีความหน่วงและการสั่นพ้อง (Damped & Driven Resonance)', 40, 30);
      ctx.fillStyle = regimeColor;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`สภาวะ: ${regimeText} | Q-Factor = ${isFinite(Q) ? Q.toFixed(1) : '∞'} | ω₀ = ${omega0.toFixed(2)} rad/s`, 40, 48);
      ctx.restore();

      // Right Side: Dynamic Resonance Curve Plot
      this._renderResonanceCurvePlot(ctx, w * 0.62, 70, w * 0.35, 170, omega0, gamma);

      // Bottom Right: Rolling Time-History Strip Chart x(t)
      this._renderTimeStripChart(ctx, w * 0.62, 265, w * 0.35, 185);
    }

    _drawDashpotDamper(ctx, x1, y1, x2, y2, b) {
      const cylinderLen = 45;
      const cylinderH = 22;

      ctx.save();
      // Outer cylinder (connected to wall)
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.strokeRect(x1 + 15, y1 - cylinderH / 2, cylinderLen, cylinderH);

      // Fluid shading
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(x1 + 16, y1 - cylinderH / 2 + 1, cylinderLen - 2, cylinderH - 2);

      // Shaft from wall to cylinder
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + 15, y1);
      ctx.stroke();

      // Piston and rod (connected to mass)
      const pistonX = Math.min(x1 + 15 + cylinderLen - 6, Math.max(x1 + 18, (x1 + 15 + x2) / 2));
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(pistonX, y1 - cylinderH / 2 + 3, 5, cylinderH - 6);

      ctx.beginPath();
      ctx.moveTo(pistonX + 5, y1);
      ctx.lineTo(x2, y1);
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(`b = ${b.toFixed(1)}`, x1 + 20, y1 + cylinderH / 2 + 12);
      ctx.restore();
    }

    _renderResonanceCurvePlot(ctx, x, y, width, height, omega0, gamma) {
      ctx.save();
      // Panel frame
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // Title
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('📊 เส้นโค้งการสั่นพ้อง A(ω) vs ความถี่เร้า ω', x + 10, y + 16);

      const plotPad = 32;
      const pX = x + plotPad;
      const pY = y + 26;
      const pW = width - plotPad - 12;
      const pH = height - 42;

      // Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pX, pY);
      ctx.lineTo(pX, pY + pH);
      ctx.lineTo(pX + pW, pY + pH);
      ctx.stroke();

      // Plot curve: A(\omega) = (F0 / m) / \sqrt{(\omega_0^2 - \omega^2)^2 + (\gamma \omega)^2}
      const m = Math.max(0.1, this.params.mass);
      const F0 = this.params.isDriven ? this.params.drivingForceF0 : 10.0;
      const maxOmegaPlot = omega0 * 2.2;

      let maxA = 0;
      const points = [];
      const steps = 80;
      for (let i = 0; i <= steps; i++) {
        const wVal = (i / steps) * maxOmegaPlot;
        const denom = Math.sqrt(Math.pow(omega0 * omega0 - wVal * wVal, 2) + Math.pow(gamma * wVal, 2));
        const amp = (denom > 1e-4) ? (F0 / m) / denom : 0;
        if (amp > maxA) maxA = amp;
        points.push({ w: wVal, a: amp });
      }

      if (maxA <= 0) maxA = 1;

      // Draw Curve
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((pt, idx) => {
        const px = pX + (pt.w / maxOmegaPlot) * pW;
        const py = pY + pH - (pt.a / (maxA * 1.15)) * pH;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Mark current driving frequency
      const curW = this.params.drivingOmega;
      const curPx = pX + (curW / maxOmegaPlot) * pW;
      const curDenom = Math.sqrt(Math.pow(omega0 * omega0 - curW * curW, 2) + Math.pow(gamma * curW, 2));
      const curAmp = (curDenom > 1e-4) ? (F0 / m) / curDenom : 0;
      const curPy = pY + pH - (curAmp / (maxA * 1.15)) * pH;

      if (curPx >= pX && curPx <= pX + pW) {
        // Vertical dashed line
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(curPx, pY);
        ctx.lineTo(curPx, pY + pH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cursor Dot
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(curPx, curPy, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`ω = ${curW.toFixed(1)}`, curPx - 18, pY + pH - 6);
      }

      // Mark omega_0 peak guideline
      const w0Px = pX + (omega0 / maxOmegaPlot) * pW;
      ctx.fillStyle = '#38BDF8';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(`ω₀ = ${omega0.toFixed(1)}`, w0Px - 15, pY + 12);
      ctx.restore();
    }

    // ==========================================
    // 4. DOUBLE PENDULUM (CHAOS) RENDERING
    // ==========================================
    _renderDoublePendulumMode(ctx, w, h) {
      const pivotX = w * 0.42;
      const pivotY = 95;
      const pxScale = 105;

      const l1 = Math.max(0.2, this.params.dpL1);
      const l2 = Math.max(0.2, this.params.dpL2);
      const m1 = Math.max(0.1, this.params.dpM1);
      const m2 = Math.max(0.1, this.params.dpM2);

      const th1 = this.state.dpTheta1;
      const th2 = this.state.dpTheta2;

      const x1 = pivotX + l1 * pxScale * Math.sin(th1);
      const y1 = pivotY + l1 * pxScale * Math.cos(th1);
      const x2 = x1 + l2 * pxScale * Math.sin(th2);
      const y2 = y1 + l2 * pxScale * Math.cos(th2);

      // 1. Draw Trajectory Trail of Bob 2
      if (this.params.dpShowTrail !== false && this.state.dpTrail.length > 1) {
        const trail = this.state.dpTrail;
        const total = trail.length;

        for (let i = 1; i < total; i++) {
          const pPrev = trail[i - 1];
          const pCurr = trail[i];
          const frac = i / total;
          const alpha = Math.pow(frac, 1.8) * 0.85;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(pPrev.x, pPrev.y);
          ctx.lineTo(pCurr.x, pCurr.y);
          if (frac < 0.5) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          } else if (frac < 0.8) {
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
          }
          ctx.lineWidth = 1.2 + frac * 1.8;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }
      }

      // 2. Ceiling & Pivot Bracket
      ctx.save();
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pivotX - 60, pivotY);
      ctx.lineTo(pivotX + 60, pivotY);
      ctx.stroke();

      ctx.lineWidth = 1;
      for (let x = pivotX - 55; x <= pivotX + 55; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, pivotY);
        ctx.lineTo(x + 8, pivotY - 8);
        ctx.stroke();
      }

      // Pivot Bearing
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // 3. Rod 1 (Pivot to Bob 1)
      ctx.save();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Rod 1 midpoint label
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`L₁ = ${l1.toFixed(1)} m`, (pivotX + x1) / 2 + 8, (pivotY + y1) / 2);
      ctx.restore();

      // 4. Bob 1
      const r1 = Math.min(22, Math.max(9, 10 + m1 * 3));
      ctx.save();
      const grad1 = ctx.createRadialGradient(x1 - r1 * 0.3, y1 - r1 * 0.3, 2, x1, y1, r1);
      grad1.addColorStop(0, '#BAE6FD');
      grad1.addColorStop(0.6, '#0284C7');
      grad1.addColorStop(1, '#0369A1');
      ctx.fillStyle = grad1;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x1, y1, r1, 0, 2 * Math.PI);
      ctx.fill();

      // Bob 1 Joint Pin
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(x1, y1, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Bob 1 Label
      const th1Deg = (th1 * 180 / Math.PI) % 360;
      ctx.fillStyle = '#E0F2FE';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(`m₁=${m1.toFixed(1)}kg (θ₁=${th1Deg.toFixed(0)}°)`, x1 + r1 + 4, y1 - 4);
      ctx.restore();

      // 5. Rod 2 (Bob 1 to Bob 2)
      ctx.save();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Rod 2 midpoint label
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`L₂ = ${l2.toFixed(1)} m`, (x1 + x2) / 2 + 8, (y1 + y2) / 2);
      ctx.restore();

      // 6. Bob 2
      const r2 = Math.min(22, Math.max(9, 10 + m2 * 3));
      ctx.save();
      const grad2 = ctx.createRadialGradient(x2 - r2 * 0.3, y2 - r2 * 0.3, 2, x2, y2, r2);
      grad2.addColorStop(0, '#FCE7F3');
      grad2.addColorStop(0.6, '#DB2777');
      grad2.addColorStop(1, '#9D174D');
      ctx.fillStyle = grad2;
      ctx.shadowColor = 'rgba(236, 72, 153, 0.7)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x2, y2, r2, 0, 2 * Math.PI);
      ctx.fill();

      // Bob 2 Center dot
      ctx.fillStyle = '#FDF2F8';
      ctx.beginPath();
      ctx.arc(x2, y2, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Bob 2 Label
      const th2Deg = (th2 * 180 / Math.PI) % 360;
      ctx.fillStyle = '#FCE7F3';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(`m₂=${m2.toFixed(1)}kg (θ₂=${th2Deg.toFixed(0)}°)`, x2 + r2 + 4, y2 + 10);
      ctx.restore();

      // 7. Velocity Vectors (if enabled)
      if (this.toggles.showVelocity) {
        // v1
        const v1_mag = l1 * this.state.dpOmega1;
        const v1_x = -v1_mag * Math.cos(th1);
        const v1_y = v1_mag * Math.sin(th1);
        this._drawArrow(ctx, x1, y1, x1 + v1_x * 8, y1 + v1_y * 8, '#10B981', `v₁ = ${v1_mag.toFixed(1)} m/s`);

        // v2
        const v2_x = v1_x - l2 * this.state.dpOmega2 * Math.cos(th2);
        const v2_y = v1_y + l2 * this.state.dpOmega2 * Math.sin(th2);
        const v2_mag = Math.sqrt(v2_x * v2_x + v2_y * v2_y);
        this._drawArrow(ctx, x2, y2, x2 + v2_x * 8, y2 + v2_y * 8, '#F59E0B', `v₂ = ${v2_mag.toFixed(1)} m/s`);
      }

      // 8. Title Header Badge
      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🔀 ลูกตุ้มคู่โกลาหล (Double Pendulum Chaos)', 50, 32);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('สมการลากรองจ์ (Euler-Lagrange RK4) | ไวต่อสภาวะเริ่มต้นอย่างยิ่งยวด (Sensitive Dependence on Initial Conditions)', 50, 50);
      ctx.restore();
    }

    _renderTimeStripChart(ctx, x, y, width, height) {
      ctx.save();
      // Panel frame
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // Title
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('📈 กราฟการกระจัดตามเวลา x(t) [Real-Time Waveform]', x + 10, y + 16);

      const pX = x + 15;
      const pY = y + 25;
      const pW = width - 25;
      const pH = height - 35;
      const midY = pY + pH / 2;

      // Center zero line
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(pX, midY);
      ctx.lineTo(pX + pW, midY);
      ctx.stroke();

      const hist = this.state.timeHistory;
      if (hist.length > 2) {
        const maxAmp = 1.8;
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();

        hist.forEach((pt, idx) => {
          const px = pX + (idx / this.state.maxHistoryLength) * pW;
          const py = midY - (pt.x / maxAmp) * (pH / 2 - 6);
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
      ctx.restore();
    }

    // ==========================================
    // 4. SHARED HUD: ENERGY & PHASE SPACE
    // ==========================================
    _renderEnergyBarHUD(ctx, w, h) {
      if (this.subMode === 'damping_resonance') return; // Has its own graphs

      const panelW = 190;
      const panelH = 145;
      const pX = w - panelW - 16;
      const pY = 16;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(pX, pY, panelW, panelH);
      ctx.strokeRect(pX, pY, panelW, panelH);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('⚡ พลังงานกลรวม (Mechanical Energy)', pX + 12, pY + 18);

      let K = 0;
      let U = 0;
      if (this.subMode === 'spring') {
        K = 0.5 * this.params.mass * this.state.v * this.state.v;
        U = 0.5 * this.params.springK * this.state.x * this.state.x;
      } else if (this.subMode === 'pendulum') {
        const vBob = this.params.length * this.state.omegaRadS;
        K = 0.5 * this.params.pendulumMass * vBob * vBob;
        U = this.params.pendulumMass * this.params.gravity * this.params.length * (1 - Math.cos(this.state.thetaRad));
      }
      const E = K + U;
      const maxE = Math.max(0.1, E * 1.25);

      // Kinetic Energy Bar
      this._drawSingleBar(ctx, pX + 12, pY + 36, panelW - 24, 18, K / maxE, '#10B981', `K (จลน์): ${K.toFixed(2)} J`);

      // Potential Energy Bar
      this._drawSingleBar(ctx, pX + 12, pY + 70, panelW - 24, 18, U / maxE, '#F59E0B', `U (ศักย์): ${U.toFixed(2)} J`);

      // Total Energy Bar
      this._drawSingleBar(ctx, pX + 12, pY + 104, panelW - 24, 18, E / maxE, '#38BDF8', `E_tot (รวม): ${E.toFixed(2)} J`);

      ctx.restore();
    }

    _drawSingleBar(ctx, x, y, width, height, fraction, color, label) {
      ctx.save();
      // Bg track
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(x, y, width, height);

      // Filled bar
      const fillW = Math.max(0, Math.min(width, width * fraction));
      ctx.fillStyle = color;
      ctx.fillRect(x, y, fillW, height);

      // Border
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(x, y, width, height);

      // Label text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(label, x + 6, y + 13);
      ctx.restore();
    }

    _renderPhaseSpaceHUD(ctx, w, h) {
      if (this.subMode === 'damping_resonance') return;

      const pW = 190;
      const pH = 175;
      const pX = w - pW - 16;
      const pY = h - pH - 16;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(pX, pY, pW, pH);
      ctx.strokeRect(pX, pY, pW, pH);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('🌀 ปริภูมิสถานะ (Phase Space x-v)', pX + 10, pY + 18);

      const cX = pX + pW / 2;
      const cY = pY + 28 + (pH - 36) / 2;

      // Axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pX + 10, cY);
      ctx.lineTo(pX + pW - 10, cY);
      ctx.moveTo(cX, pY + 26);
      ctx.lineTo(cX, pY + pH - 10);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText('+x', pX + pW - 20, cY - 4);
      ctx.fillText('+v', cX + 4, pY + 36);

      // Plot orbit trail from history
      const hist = this.state.timeHistory;
      if (hist.length > 2) {
        ctx.strokeStyle = '#A855F7';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const scaleX = 42;
        const scaleV = 11;
        hist.forEach((pt, idx) => {
          const px = cX + pt.x * scaleX;
          const py = cY - pt.v * scaleV;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Current point
        const latest = hist[hist.length - 1];
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(cX + latest.x * scaleX, cY - latest.v * scaleV, 4, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.restore();
    }

    _drawArrow(ctx, x1, y1, x2, y2, color, label = '') {
      const headLen = 8;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      if (label) {
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(label, x2 + 6 * Math.cos(angle), y2 + 6 * Math.sin(angle));
      }
      ctx.restore();
    }

    _emitTelemetry() {
      if (typeof this.options.onTelemetryUpdate !== 'function') return;

      let pos = 0;
      let vel = 0;
      let acc = 0;
      let omega0 = 0;
      let period = 0;
      let freq = 0;
      let K = 0;
      let U = 0;
      let E = 0;
      let Q = 0;
      let zeta = 0;
      let regime = 'SHM (Undamped)';

      if (this.subMode === 'spring') {
        const k = this.params.springK;
        const m = this.params.mass;
        omega0 = Math.sqrt(k / m);
        period = 2 * Math.PI / omega0;
        freq = 1 / period;
        pos = this.state.x;
        vel = this.state.v;
        acc = this.state.a;
        K = 0.5 * m * vel * vel;
        U = 0.5 * k * pos * pos;
        E = K + U;
        Q = Infinity;
        zeta = 0;

      } else if (this.subMode === 'pendulum') {
        const g = this.params.gravity;
        const L = this.params.length;
        const m = this.params.pendulumMass;
        omega0 = Math.sqrt(g / L);
        period = 2 * Math.PI / omega0;
        freq = 1 / period;
        pos = this.state.thetaRad * 180 / Math.PI; // degrees for readout
        vel = L * this.state.omegaRadS;
        acc = L * this.state.alphaRadS2;
        K = 0.5 * m * vel * vel;
        U = m * g * L * (1 - Math.cos(this.state.thetaRad));
        E = K + U;
        Q = Infinity;
        zeta = 0;
        regime = 'Simple Pendulum';

      } else if (this.subMode === 'damping_resonance') {
        const m = this.params.mass;
        const k = this.params.springK;
        const b = this.params.dampingB;
        omega0 = Math.sqrt(k / m);
        const gamma = b / m;
        zeta = gamma / (2 * omega0);
        Q = (gamma > 0) ? (omega0 / gamma) : Infinity;

        pos = this.state.xDamped;
        vel = this.state.vDamped;
        acc = this.state.aDamped;
        K = 0.5 * m * vel * vel;
        U = 0.5 * k * pos * pos;
        E = K + U;

        if (zeta < 0.98) {
          regime = 'Underdamped (หน่วงต่ำ)';
          const omegaD = Math.sqrt(Math.max(0, omega0 * omega0 - (gamma/2) * (gamma/2)));
          period = (omegaD > 0) ? (2 * Math.PI / omegaD) : 0;
          freq = (period > 0) ? 1 / period : 0;
        } else if (Math.abs(zeta - 1.0) <= 0.05) {
          regime = 'Critically Damped (หน่วงวิกฤต)';
          period = 0;
          freq = 0;
        } else {
          regime = 'Overdamped (หน่วงเกิน)';
          period = 0;
          freq = 0;
        }
      } else if (this.subMode === 'double_pendulum') {
        const th1Deg = (this.state.dpTheta1 * 180 / Math.PI) % 360;
        const th2Deg = (this.state.dpTheta2 * 180 / Math.PI) % 360;
        pos = `${th1Deg.toFixed(1)}° / ${th2Deg.toFixed(1)}°`;
        vel = `${this.state.dpOmega1.toFixed(2)} / ${this.state.dpOmega2.toFixed(2)} rad/s`;
        acc = `${this.state.dpAlpha1.toFixed(1)} / ${this.state.dpAlpha2.toFixed(1)} rad/s²`;
        omega0 = Math.sqrt(this.params.gravity / Math.max(0.1, this.params.dpL1));
        period = 2 * Math.PI / omega0;
        freq = 1 / period;

        const m1 = this.params.dpM1;
        const m2 = this.params.dpM2;
        const l1 = this.params.dpL1;
        const l2 = this.params.dpL2;
        const g = this.params.gravity;
        const w1 = this.state.dpOmega1;
        const w2 = this.state.dpOmega2;
        const t1 = this.state.dpTheta1;
        const t2 = this.state.dpTheta2;

        K = 0.5 * (m1 + m2) * l1 * l1 * w1 * w1 + 0.5 * m2 * l2 * l2 * w2 * w2 + m2 * l1 * l2 * w1 * w2 * Math.cos(t1 - t2);
        U = (m1 + m2) * g * l1 * (1 - Math.cos(t1)) + m2 * g * l2 * (1 - Math.cos(t2));
        E = K + U;
        Q = Infinity;
        zeta = 0;
        regime = 'Double Pendulum Chaos (ความโกลาหลแบบไม่เชิงเส้น)';
      }

      this.options.onTelemetryUpdate({
        subMode: this.subMode,
        time: this.state.simTime,
        position: pos,
        velocity: vel,
        acceleration: acc,
        omega0: omega0,
        period: period,
        frequency: freq,
        kineticEnergy: K,
        potentialEnergy: U,
        totalEnergy: E,
        qualityFactor: Q,
        dampingRatio: zeta,
        regime: regime
      });
    }
  }

  return OscillationSimulator;
}));
