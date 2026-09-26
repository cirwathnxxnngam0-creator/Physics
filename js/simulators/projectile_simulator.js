/**
 * projectile_simulator.js - Interactive HTML5 Canvas Projectile Simulator
 * Part of PhysicsNoza 3.0 Architecture
 *
 * Visualizes 2D projectile kinematics comparing Galileo vacuum parabola
 * with realistic quadratic fluid drag in real time.
 *
 * Features:
 *   - Device pixel ratio (HiDPI / Retina) sharp rendering
 *   - Fixed-timestep numerical sub-stepping decoupled from animation frame rate
 *   - Direct touch / pointer drag of launch vector on canvas
 *   - Live vector overlays (velocity, drag force, gravity, net acceleration)
 *   - Single animation loop guard (auto pause on inactive view, zero loop leak)
 *   - Dynamic coordinate framing matching active trajectory toggles
 *   - Strict state consistency: updates/clamps simTime and live state on parameter changes
 *   - Prefers-reduced-motion support
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['../engines/projectile_rk4'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../engines/projectile_rk4'));
  } else {
    root.ProjectileSimulator = factory(root.ProjectileRK4);
  }
}(typeof self !== 'undefined' ? self : this, function (RK4Engine) {
  'use strict';

  class ProjectileSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate, onParamsChanged, onPlaybackChange }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for ProjectileSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Simulation Parameters
      this.params = {
        v0: 100.0,
        thetaDeg: 30.0,
        m: 5.0,
        c: 0.05,
        g: 9.80665,
        y0: 0.0,
        yGround: 0.0,
        dt: 0.001
      };

      // Vector display toggles
      this.vectors = {
        showVelocity: true,
        showComponents: true,
        showDrag: true,
        showGravity: true,
        showAcceleration: false,
        showVacuum: true
      };

      // Sub-mode: 'trajectory' | 'rocket_equation'
      this.subMode = 'trajectory';
      this.rocketParams = {
        m0: 12000.0,       // kg initial mass
        mf: 1200.0,        // kg dry structural mass
        uex: 3000.0,       // m/s exhaust velocity
        burnRate: 200.0,   // kg/s burn rate
        gravity: 0.0       // m/s^2 (0 in deep space vacuum)
      };

      // Playback State
      this.isRunning = false;
      this.isPaused = false;
      this.timeScale = 1.0;
      this.simTime = 0.0;
      this.animFrameId = null;
      this.lastFrameTime = null;
      this.accumulator = 0.0;

      // Precomputed trajectories for instant visual inspection & live flight
      this.cachedSimulation = null;
      this.currentLiveState = null;

      // Handle Dragging State
      this.isDraggingHandle = false;
      this.dragPointerId = null;

      // Bound listeners for clean teardown
      this._boundOnPointerDown = this._onPointerDown.bind(this);
      this._boundOnPointerMove = this._onPointerMove.bind(this);
      this._boundOnPointerUp = this._onPointerUp.bind(this);
      this._boundOnResize = this._onResize.bind(this);
      this._boundStepLoop = this._stepLoop.bind(this);

      this._init();
    }

    _init() {
      this._setupCanvasResolution();
      this._recomputeSimulation();
      this._attachEventListeners();
      this.render();
    }

    _setupCanvasResolution() {
      const parentW = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 0;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2);

      let w = parentW > 0 ? parentW : (rect.width > 0 ? rect.width : Math.min(window.innerWidth - 32, 800));
      w = Math.max(w, 280);
      const aspect = 480 / 800;
      const h = Math.round(w * aspect);

      this.displayWidth = w;
      this.displayHeight = h;

      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.canvas.style.width = '100%';
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.height = 'auto';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }

    _onResize() {
      this._setupCanvasResolution();
      this.render();
    }

    _attachEventListeners() {
      this.canvas.addEventListener('pointerdown', this._boundOnPointerDown);
      window.addEventListener('pointermove', this._boundOnPointerMove);
      window.addEventListener('pointerup', this._boundOnPointerUp);
      window.addEventListener('pointercancel', this._boundOnPointerUp);
      window.addEventListener('resize', this._boundOnResize);
    }

    _detachEventListeners() {
      this.canvas.removeEventListener('pointerdown', this._boundOnPointerDown);
      window.removeEventListener('pointermove', this._boundOnPointerMove);
      window.removeEventListener('pointerup', this._boundOnPointerUp);
      window.removeEventListener('pointercancel', this._boundOnPointerUp);
      window.removeEventListener('resize', this._boundOnResize);
    }

    /**
     * Recomputes numerical simulation and consistently manages live playback state.
     * Fixes stale states when parameters change during pause or play.
     */
    _recomputeSimulation() {
      this.cachedSimulation = RK4Engine.simulateTrajectory({
        v0: this.params.v0,
        thetaDeg: this.params.thetaDeg,
        m: this.params.m,
        c: this.params.c,
        g: this.params.g,
        y0: this.params.y0,
        yGround: this.params.yGround,
        dt: this.params.dt,
        recordInterval: 0.005
      });

      const newFlightTime = this.cachedSimulation.landing.t;

      if (!this.isRunning && !this.isPaused) {
        // Idle state: reset to start
        this.simTime = 0.0;
        this.currentLiveState = this.cachedSimulation.trajectory[0];
      } else {
        // Paused or actively playing: clamp simTime to new flight time and re-interpolate
        if (this.simTime >= newFlightTime) {
          this.simTime = newFlightTime;
          if (this.isRunning && !this.isPaused) {
            this.pause();
          }
        }
        this._interpolateLiveStateAtTime(this.simTime);
      }

      if (typeof this.options.onTelemetryUpdate === 'function') {
        this.options.onTelemetryUpdate(this.currentLiveState, this.cachedSimulation);
      }
    }

    // World to Screen Coordinate Transformations
    _getScaleInfo() {
      const paddingLeft = 55;
      const paddingBottom = 45;
      const paddingTop = 30;
      const paddingRight = 30;

      const availWidth = Math.max(100, this.displayWidth - paddingLeft - paddingRight);
      const availHeight = Math.max(100, this.displayHeight - paddingBottom - paddingTop);

      // Max world coordinates to display:
      // When showVacuum is false, ONLY frame the drag trajectory!
      let maxSimX = this.cachedSimulation.landing.x;
      let maxSimY = this.cachedSimulation.apex.y;

      if (this.vectors.showVacuum && this.cachedSimulation.vacuum) {
        maxSimX = Math.max(maxSimX, this.cachedSimulation.vacuum.range);
        maxSimY = Math.max(maxSimY, this.cachedSimulation.vacuum.yApex);
      }

      maxSimX = Math.max(maxSimX, this.params.v0 * 0.5, 30.0);
      maxSimY = Math.max(maxSimY, this.params.y0 + 10.0, 20.0);

      const scaleX = availWidth / (maxSimX * 1.15);
      const scaleY = availHeight / (maxSimY * 1.25);
      // Keep uniform aspect ratio for true geometric fidelity
      const scale = Math.min(scaleX, scaleY);

      const originScreenX = paddingLeft;
      const originScreenY = this.displayHeight - paddingBottom;

      return {
        scale,
        originScreenX,
        originScreenY,
        maxSimX,
        maxSimY
      };
    }

    worldToScreen(wx, wy) {
      const { scale, originScreenX, originScreenY } = this._getScaleInfo();
      const sx = originScreenX + wx * scale;
      const sy = originScreenY - wy * scale;
      return { sx, sy };
    }

    screenToWorld(sx, sy) {
      const { scale, originScreenX, originScreenY } = this._getScaleInfo();
      const wx = (sx - originScreenX) / scale;
      const wy = (originScreenY - sy) / scale;
      return { wx, wy };
    }

    // Handle Drag Interactivity
    _getHandleScreenPos() {
      const thetaRad = (this.params.thetaDeg * Math.PI) / 180.0;
      const handleLen = Math.min(40.0, this.params.v0 * 0.4);
      const wx = handleLen * Math.cos(thetaRad);
      const wy = this.params.y0 + handleLen * Math.sin(thetaRad);
      return this.worldToScreen(wx, wy);
    }

    _onPointerDown(e) {
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      const handlePos = this._getHandleScreenPos();
      const dist = Math.hypot(sx - handlePos.sx, sy - handlePos.sy);

      // 36px hit radius for easy touch on mobile
      if (dist <= 36) {
        this.isDraggingHandle = true;
        this.dragPointerId = e.pointerId;
        this.canvas.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    }

    _onPointerMove(e) {
      if (!this.isDraggingHandle) return;
      const rect = this.canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      const originScreen = this.worldToScreen(0, this.params.y0);
      const dx = sx - originScreen.sx;
      const dy = originScreen.sy - sy; // inverted y

      let newAngleDeg = (Math.atan2(dy, dx) * 180.0) / Math.PI;
      if (newAngleDeg < 0) newAngleDeg = 0;
      if (newAngleDeg > 90) newAngleDeg = 90;

      // Drag distance adjusts initial velocity
      const pixelDist = Math.hypot(dx, dy);
      const { scale } = this._getScaleInfo();
      const worldDist = pixelDist / scale;
      let newV0 = Math.round(worldDist * 2.5);
      newV0 = Math.max(10, Math.min(150, newV0));

      this.params.thetaDeg = Math.round(newAngleDeg);
      this.params.v0 = newV0;

      this._recomputeSimulation();
      this.render();

      if (typeof this.options.onParamsChanged === 'function') {
        this.options.onParamsChanged(this.params);
      }
    }

    _onPointerUp(e) {
      if (this.isDraggingHandle && (this.dragPointerId === null || e.pointerId === this.dragPointerId)) {
        this.isDraggingHandle = false;
        this.dragPointerId = null;
      }
    }

    // Dispatch helper methods supporting both options and direct property handlers
    _dispatchTelemetry(state, sim) {
      if (typeof this.onTelemetry === 'function') {
        this.onTelemetry(state, sim);
      }
      if (this.options && typeof this.options.onTelemetryUpdate === 'function') {
        this.options.onTelemetryUpdate(state, sim);
      }
    }

    _dispatchStatus(status) {
      if (typeof this.onStatusChange === 'function') {
        this.onStatusChange(status);
      }
      if (this.options && typeof this.options.onPlaybackChange === 'function') {
        this.options.onPlaybackChange(status);
      }
    }

    // Playback Controls
    play() {
      // Check prefers-reduced-motion
      const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        this.stop();
        this.simTime = this.cachedSimulation.landing.t;
        this.currentLiveState = this.cachedSimulation.trajectory[this.cachedSimulation.trajectory.length - 1];
        this.render();
        this._dispatchTelemetry(this.currentLiveState, this.cachedSimulation);
        this._dispatchStatus('idle');
        return;
      }

      if (this.isRunning && !this.isPaused) return;

      // Stop any existing loop first to guard against duplicate loops
      this.stop();

      this.isRunning = true;
      this.isPaused = false;
      this.lastFrameTime = performance.now();
      this.accumulator = 0.0;
      this.animFrameId = requestAnimationFrame(this._boundStepLoop);

      this._dispatchStatus('playing');
    }

    pause() {
      if (!this.isRunning && !this.animFrameId) return;
      this.isPaused = true;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this._dispatchStatus('paused');
    }

    stop() {
      this.isRunning = false;
      this.isPaused = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.lastFrameTime = null;
      this.accumulator = 0.0;
    }

    reset() {
      this.stop();
      this.simTime = 0.0;
      if (this.subMode === 'rocket_equation') {
        this._updateRocketState();
        this.render();
        this._dispatchStatus('idle');
        return;
      }
      this.currentLiveState = this.cachedSimulation.trajectory[0];
      this.render();

      this._dispatchTelemetry(this.currentLiveState, this.cachedSimulation);
      this._dispatchStatus('idle');
    }

    stepForward(deltaSimSec = 0.05) {
      this.pause();
      if (this.subMode === 'rocket_equation') {
        const totalBurnTime = this.rocketParams.burnTime || 54.0;
        this.simTime = Math.min(totalBurnTime, this.simTime + deltaSimSec);
        this._updateRocketState();
        this.render();
        return;
      }
      const targetTime = Math.min(this.cachedSimulation.landing.t, this.simTime + deltaSimSec);
      this.simTime = targetTime;
      this._interpolateLiveStateAtTime(this.simTime);
      this.render();

      this._dispatchTelemetry(this.currentLiveState, this.cachedSimulation);
    }

    _updateRocketState() {
      const totalBurnTime = this.rocketParams.burnTime || 54.0;
      const animT = Math.min(this.simTime, totalBurnTime);
      const isBurning = (this.simTime < totalBurnTime) && (this.isRunning && !this.isPaused);

      const m0 = (this.rocketParams.m0 !== undefined) ? this.rocketParams.m0 : (this.rocketParams.initialMassM0 || 12000.0);
      const mf = (this.rocketParams.mf !== undefined) ? this.rocketParams.mf : (this.rocketParams.dryMassMf || 1200.0);
      const uex = (this.rocketParams.uex !== undefined) ? this.rocketParams.uex : (this.rocketParams.exhaustSpeedUex || 3000.0);
      const fuelTotal = Math.max(0, m0 - mf);
      const burnRate = totalBurnTime > 0 ? (fuelTotal / totalBurnTime) : 0;
      const curFuel = Math.max(0, fuelTotal - burnRate * animT);
      const curMass = mf + curFuel;
      const curV = (curMass > 0 && m0 > 0) ? (uex * Math.log(m0 / curMass)) : 0;
      const deltaVIdeal = (mf > 0 && m0 > 0) ? (uex * Math.log(m0 / mf)) : 0;

      this.state = {
        t: animT,
        mass: curMass,
        v: curV,
        deltaV: deltaVIdeal,
        fuel: curFuel,
        burnTime: totalBurnTime,
        isBurning
      };
      this._dispatchTelemetry(this.state, null);
    }

    setRocketParams(newParams) {
      if (!newParams || typeof newParams !== 'object') return;

      if (newParams.m0 !== undefined) {
        this.rocketParams.m0 = parseFloat(newParams.m0);
        this.rocketParams.initialMassM0 = this.rocketParams.m0;
      } else if (newParams.initialMassM0 !== undefined) {
        this.rocketParams.m0 = parseFloat(newParams.initialMassM0);
        this.rocketParams.initialMassM0 = this.rocketParams.m0;
      }

      if (newParams.mf !== undefined) {
        this.rocketParams.mf = parseFloat(newParams.mf);
        this.rocketParams.dryMassMf = this.rocketParams.mf;
      } else if (newParams.dryMassMf !== undefined) {
        this.rocketParams.mf = parseFloat(newParams.dryMassMf);
        this.rocketParams.dryMassMf = this.rocketParams.mf;
      }

      if (newParams.uex !== undefined) {
        this.rocketParams.uex = parseFloat(newParams.uex);
        this.rocketParams.exhaustSpeedUex = this.rocketParams.uex;
      } else if (newParams.exhaustSpeedUex !== undefined) {
        this.rocketParams.uex = parseFloat(newParams.exhaustSpeedUex);
        this.rocketParams.exhaustSpeedUex = this.rocketParams.uex;
      }

      if (newParams.burnRate !== undefined) {
        this.rocketParams.burnRate = parseFloat(newParams.burnRate);
      }
      if (newParams.burnTime !== undefined) {
        this.rocketParams.burnTime = parseFloat(newParams.burnTime);
      }
      if (newParams.gravity !== undefined) {
        this.rocketParams.gravity = parseFloat(newParams.gravity);
      }

      this._updateRocketState();
      this.render();
    }

    _interpolateLiveStateAtTime(tTarget) {
      const traj = this.cachedSimulation.trajectory;
      if (tTarget <= 0 || traj.length === 0) {
        this.currentLiveState = traj[0];
        return;
      }
      if (tTarget >= this.cachedSimulation.landing.t) {
        this.currentLiveState = traj[traj.length - 1];
        return;
      }

      // Binary search for enclosing timestep
      let low = 0;
      let high = traj.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (traj[mid].t < tTarget) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      const idx1 = Math.max(0, Math.min(traj.length - 1, low));
      const idx0 = Math.max(0, idx1 - 1);
      const s0 = traj[idx0];
      const s1 = traj[idx1];

      const dtSpan = s1.t - s0.t;
      const frac = dtSpan > 1e-12 ? (tTarget - s0.t) / dtSpan : 0.0;

      this.currentLiveState = {
        t: tTarget,
        x: s0.x + frac * (s1.x - s0.x),
        y: s0.y + frac * (s1.y - s0.y),
        vx: s0.vx + frac * (s1.vx - s0.vx),
        vy: s0.vy + frac * (s1.vy - s0.vy),
        ax: s0.ax + frac * (s1.ax - s0.ax),
        ay: s0.ay + frac * (s1.ay - s0.ay),
        speed: s0.speed + frac * (s1.speed - s0.speed),
        ek: s0.ek + frac * (s1.ek - s0.ek),
        ep: s0.ep + frac * (s1.ep - s0.ep),
        etotal: s0.etotal + frac * (s1.etotal - s0.etotal)
      };
    }

    _stepLoop(now) {
      if (!this.isRunning || this.isPaused) return;

      if (!this.lastFrameTime) this.lastFrameTime = now;
      const elapsedMs = Math.min(100.0, now - this.lastFrameTime);
      this.lastFrameTime = now;

      // Advance physics time
      this.simTime += (elapsedMs / 1000.0) * this.timeScale;

      if (this.subMode === 'rocket_equation') {
        const totalBurnTime = this.rocketParams.burnTime || 54.0;
        if (this.simTime >= totalBurnTime) {
          this.simTime = totalBurnTime;
          this._updateRocketState();
          this.render();
          this.pause();
          return;
        }
        this._updateRocketState();
        this.render();
        this.animFrameId = requestAnimationFrame(this._boundStepLoop);
        return;
      }

      if (this.simTime >= this.cachedSimulation.landing.t) {
        this.simTime = this.cachedSimulation.landing.t;
        this.currentLiveState = this.cachedSimulation.trajectory[this.cachedSimulation.trajectory.length - 1];
        this.render();
        this.pause();
        this._dispatchTelemetry(this.currentLiveState, this.cachedSimulation);
        return;
      }

      this._interpolateLiveStateAtTime(this.simTime);
      this.render();

      this._dispatchTelemetry(this.currentLiveState, this.cachedSimulation);

      this.animFrameId = requestAnimationFrame(this._boundStepLoop);
    }

    updateParams(newParams) {
      Object.assign(this.params, newParams);
      this._recomputeSimulation();
      this.render();
    }

    setVectors(newVectors) {
      Object.assign(this.vectors, newVectors);
      // Re-evaluate scale info since toggling vacuum changes display bounds
      this.render();
    }

    setSubMode(mode) {
      if (mode === 'rocket_equation' || mode === 'trajectory') {
        this.subMode = mode;
        this.simTime = 0.0;
        this.isRunning = false;
        this.isPaused = false;
        this._updateRocketState();
        this.render();
      }
    }

    // Canvas Rendering Pipeline
    render() {
      const ctx = this.ctx;
      const width = this.displayWidth;
      const height = this.displayHeight;

      if (this.subMode === 'rocket_equation') {
        this._renderRocketEquation(ctx, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      this._drawBackgroundGrid(ctx, width, height);
      this._drawGroundAndPlatforms(ctx);

      if (this.vectors.showVacuum && this.cachedSimulation.vacuum) {
        this._drawVacuumTrajectory(ctx);
      }

      this._drawDragTrajectory(ctx);
      this._drawLaunchHandle(ctx);

      if (this.currentLiveState) {
        this._drawProjectileObject(ctx, this.currentLiveState);
        this._drawDynamicVectors(ctx, this.currentLiveState);
      }

      this._drawVectorScalingLegend(ctx);
      this._drawInsetCanvas();
    }

    _drawInsetCanvas() {
      const insetCanvas = document.getElementById('simulator-inset-canvas');
      if (!insetCanvas) return;
      const ictx = insetCanvas.getContext('2d');
      if (!ictx) return;
      const w = insetCanvas.width;
      const h = insetCanvas.height;

      // Dark sleek slate background
      ictx.fillStyle = '#0F172A';
      ictx.fillRect(0, 0, w, h);

      // Fine grid
      ictx.strokeStyle = '#1E293B';
      ictx.lineWidth = 1;
      ictx.beginPath();
      for (let x = 20; x < w; x += 20) {
        ictx.moveTo(x, 0); ictx.lineTo(x, h);
      }
      for (let y = 20; y < h; y += 20) {
        ictx.moveTo(0, y); ictx.lineTo(w, y);
      }
      ictx.stroke();

      const apex = this.cachedSimulation ? this.cachedSimulation.apex : null;
      const cur = this.currentLiveState || (this.cachedSimulation && this.cachedSimulation.dragPoints ? this.cachedSimulation.dragPoints[0] : null);

      if (this.cachedSimulation && this.cachedSimulation.dragPoints && this.cachedSimulation.dragPoints.length > 1) {
        const pts = this.cachedSimulation.dragPoints;
        const maxRange = Math.max(this.cachedSimulation.range || 100, 50);
        const maxHeight = Math.max((apex ? apex.y : 50) || 50, 20);

        // Trajectory arc
        ictx.strokeStyle = '#EA580C';
        ictx.lineWidth = 2;
        ictx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const ix = 12 + (pts[i].x / (maxRange * 1.15)) * (w - 24);
          const iy = (h - 14) - (pts[i].y / (maxHeight * 1.35)) * (h - 26);
          if (i === 0) ictx.moveTo(ix, iy);
          else ictx.lineTo(ix, iy);
        }
        ictx.stroke();

        // Apex marker
        if (apex) {
          const ax = 12 + (apex.x / (maxRange * 1.15)) * (w - 24);
          const ay = (h - 14) - (apex.y / (maxHeight * 1.35)) * (h - 26);
          ictx.fillStyle = '#F59E0B';
          ictx.beginPath();
          ictx.arc(ax, ay, 3.5, 0, Math.PI * 2);
          ictx.fill();
          ictx.fillStyle = '#F8FAFC';
          ictx.font = '8.5px monospace';
          ictx.fillText(`H=${apex.y.toFixed(1)}m`, Math.max(4, ax - 24), Math.max(10, ay - 4));
        }

        // Current point marker
        if (cur) {
          const cx = 12 + (cur.x / (maxRange * 1.15)) * (w - 24);
          const cy = (h - 14) - (cur.y / (maxHeight * 1.35)) * (h - 26);
          ictx.fillStyle = '#38BDF8';
          ictx.beginPath();
          ictx.arc(cx, cy, 3, 0, Math.PI * 2);
          ictx.fill();
        }
      }

      if (cur) {
        ictx.fillStyle = '#94A3B8';
        ictx.font = '8px monospace';
        ictx.fillText(`v=${cur.speed ? cur.speed.toFixed(1) : cur.v ? cur.v.toFixed(1) : '0'}m/s t=${(cur.t || 0).toFixed(2)}s`, 6, h - 3);
      }
    }

    _drawBackgroundGrid(ctx, width, height) {
      const { scale, originScreenX, originScreenY, maxSimX, maxSimY } = this._getScaleInfo();

      // Determine nice world grid interval (e.g. 50m, 100m, 200m)
      const targetScreenStep = 70; // px
      const approxWorldStep = targetScreenStep / scale;
      const niceSteps = [5, 10, 25, 50, 100, 200, 500];
      let worldStep = niceSteps[0];
      for (const s of niceSteps) {
        if (s >= approxWorldStep) {
          worldStep = s;
          break;
        }
      }

      ctx.save();
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let wx = worldStep; wx <= maxSimX * 1.15; wx += worldStep) {
        const sx = originScreenX + wx * scale;
        if (sx > width) break;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, originScreenY);
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px -apple-system, sans-serif';
        ctx.fillText(`${wx}m`, sx - 10, originScreenY + 15);
      }

      // Horizontal lines
      for (let wy = worldStep; wy <= maxSimY * 1.25; wy += worldStep) {
        const sy = originScreenY - wy * scale;
        if (sy < 0) break;
        ctx.beginPath();
        ctx.moveTo(originScreenX, sy);
        ctx.lineTo(width, sy);
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px -apple-system, sans-serif';
        ctx.fillText(`${wy}m`, originScreenX - 35, sy + 3);
      }

      ctx.restore();
    }

    _drawGroundAndPlatforms(ctx) {
      const { originScreenX, originScreenY } = this._getScaleInfo();

      ctx.save();
      // Ground solid bar
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(originScreenX, originScreenY, this.displayWidth - originScreenX, 3);

      // Hatching below ground
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      for (let x = originScreenX; x < this.displayWidth; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, originScreenY + 3);
        ctx.lineTo(x - 8, originScreenY + 14);
        ctx.stroke();
      }

      // Launch Cliff / Platform if y0 > 0
      if (this.params.y0 > 0) {
        const cliffTop = this.worldToScreen(0, this.params.y0);
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(originScreenX - 16, cliffTop.sy, 16, originScreenY - cliffTop.sy);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(originScreenX - 16, cliffTop.sy, 16, originScreenY - cliffTop.sy);
      }

      ctx.restore();
    }

    _drawVacuumTrajectory(ctx) {
      const points = this.cachedSimulation.vacuum.points;
      if (!points || points.length === 0) return;

      ctx.save();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const pos = this.worldToScreen(points[i].x, points[i].y);
        if (i === 0) ctx.moveTo(pos.sx, pos.sy);
        else ctx.lineTo(pos.sx, pos.sy);
      }
      ctx.stroke();

      // Vacuum landing flag
      const landPos = this.worldToScreen(this.cachedSimulation.vacuum.range, this.params.yGround);
      ctx.fillStyle = '#64748B';
      ctx.font = '11px -apple-system, sans-serif';
      ctx.fillText(`สุญญากาศ: ${this.cachedSimulation.vacuum.range.toFixed(1)}m`, landPos.sx - 20, landPos.sy - 10);

      ctx.restore();
    }

    _drawDragTrajectory(ctx) {
      const traj = this.cachedSimulation.trajectory;
      if (!traj || traj.length === 0) return;

      ctx.save();
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 3;

      ctx.beginPath();
      for (let i = 0; i < traj.length; i++) {
        const pos = this.worldToScreen(traj[i].x, traj[i].y);
        if (i === 0) ctx.moveTo(pos.sx, pos.sy);
        else ctx.lineTo(pos.sx, pos.sy);
      }
      ctx.stroke();

      // Draw Apex Marker
      const apex = this.cachedSimulation.apex;
      const apexPos = this.worldToScreen(apex.x, apex.y);
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.arc(apexPos.sx, apexPos.sy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw Landing Marker
      const land = this.cachedSimulation.landing;
      const landPos = this.worldToScreen(land.x, land.y);
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(landPos.sx, landPos.sy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.fillText(`มีแรงต้าน: ${land.x.toFixed(1)}m (${land.t.toFixed(2)}s)`, landPos.sx - 35, landPos.sy + 25);

      ctx.restore();
    }

    _drawLaunchHandle(ctx) {
      const startPos = this.worldToScreen(0, this.params.y0);
      const handlePos = this._getHandleScreenPos();

      ctx.save();
      // Cannon / Launch line
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startPos.sx, startPos.sy);
      ctx.lineTo(handlePos.sx, handlePos.sy);
      ctx.stroke();

      // Drag Grip Circle
      ctx.fillStyle = this.isDraggingHandle ? '#DC2626' : '#EA580C';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(handlePos.sx, handlePos.sy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Angle indicator arc
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const arcRadius = 24;
      const thetaRad = (this.params.thetaDeg * Math.PI) / 180.0;
      ctx.arc(startPos.sx, startPos.sy, arcRadius, -thetaRad, 0, false);
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.fillText(`${this.params.thetaDeg}°`, startPos.sx + arcRadius + 4, startPos.sy - 6);

      ctx.restore();
    }

    _drawProjectileObject(ctx, state) {
      const pos = this.worldToScreen(state.x, state.y);

      ctx.save();
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(pos.sx, pos.sy, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }

    /**
     * Enhanced arrow drawing with custom line styles, open/closed heads, and backdrop pills
     */
    _drawArrow(ctx, fromX, fromY, toX, toY, color, label, options = {}) {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy);
      if (len < 4) return;

      const headLen = Math.min(10, Math.max(6, len * 0.35));
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = options.lineWidth || 2;

      if (options.dash) {
        ctx.setLineDash(options.dash);
      } else {
        ctx.setLineDash([]);
      }

      // Shaft
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Arrowhead
      ctx.setLineDash([]);
      ctx.beginPath();
      if (options.headStyle === 'open') {
        ctx.lineWidth = 2;
        ctx.moveTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX, toY);
        ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      } else {
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }

      // Backdrop pill and label for crisp readability on mobile
      if (label) {
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const metrics = ctx.measureText(label);
        let lx = options.labelX !== undefined ? options.labelX : toX + 6 * Math.cos(angle);
        let ly = options.labelY !== undefined ? options.labelY : toY + 6 * Math.sin(angle);

        // Prevent label clipping below canvas bottom and collision with scaling legend
        if (ly > this.displayHeight - 26) {
          ly = this.displayHeight - 26;
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
        ctx.fillRect(lx - 2, ly - 10, metrics.width + 5, 14);
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(lx - 2, ly - 10, metrics.width + 5, 14);

        ctx.fillStyle = color;
        ctx.fillText(label, lx, ly);
      }

      ctx.restore();
    }

    _drawDynamicVectors(ctx, state) {
      const pos = this.worldToScreen(state.x, state.y);

      // Distinct, documented scaling factors
      const vScale = 0.8; // px / (m/s)
      const fScale = 0.5; // px / N
      const aScale = 2.0; // px / (m/s^2)

      // 1. Velocity Vector: Slate 900 (#0F172A), Solid, Filled Head
      if (this.vectors.showVelocity && state.speed > 0.1) {
        const endVx = pos.sx + state.vx * vScale;
        const endVy = pos.sy - state.vy * vScale;
        this._drawArrow(ctx, pos.sx, pos.sy, endVx, endVy, '#0F172A', `v=${state.speed.toFixed(1)}m/s`, {
          lineWidth: 2.5,
          headStyle: 'filled'
        });

        // Components: Slate 600 (#475569), Dashed [3, 3]
        if (this.vectors.showComponents) {
          this._drawArrow(ctx, pos.sx, pos.sy, endVx, pos.sy, '#475569', `vx=${state.vx.toFixed(1)}`, {
            dash: [3, 3],
            lineWidth: 1.5,
            headStyle: 'open',
            labelX: (pos.sx + endVx) / 2 - 14,
            labelY: pos.sy - 8
          });
          this._drawArrow(ctx, endVx, pos.sy, endVx, endVy, '#475569', `vy=${state.vy.toFixed(1)}`, {
            dash: [3, 3],
            lineWidth: 1.5,
            headStyle: 'open',
            labelX: endVx + (state.vy >= 0 ? 8 : -50),
            labelY: (pos.sy + endVy) / 2
          });
        }
      }

      // 2. Drag Force Vector: Crimson Red (#C51E1E), Thick, Open Head, Capped at 80px
      if (this.vectors.showDrag && this.params.c > 0 && state.speed > 0.1) {
        const dragMag = this.params.c * state.speed * state.speed;
        const dragDirX = -state.vx / state.speed;
        const dragDirY = -state.vy / state.speed;
        const cappedLen = Math.min(80, dragMag * fScale);
        const endDx = pos.sx + dragDirX * cappedLen;
        const endDy = pos.sy - dragDirY * cappedLen;
        this._drawArrow(ctx, pos.sx, pos.sy, endDx, endDy, '#C51E1E', `Fd=${dragMag.toFixed(1)}N`, {
          lineWidth: 2.5,
          headStyle: 'open'
        });
      }

      // 3. Gravity Force Vector: Charcoal (#334155), Solid, Capped at 60px
      if (this.vectors.showGravity) {
        const fgMag = this.params.m * this.params.g;
        const cappedLen = Math.min(60, fgMag * fScale);
        const endGy = Math.min(this.displayHeight - 28, pos.sy + cappedLen);
        this._drawArrow(ctx, pos.sx, pos.sy, pos.sx, endGy, '#334155', `mg=${fgMag.toFixed(1)}N`, {
          lineWidth: 2,
          headStyle: 'filled',
          labelX: pos.sx + 8,
          labelY: (pos.sy + endGy) / 2 + 4
        });
      }

      // 4. Net Acceleration Vector: Vibrant Orange (#EA580C), Dash [5, 2], Capped at 80px
      if (this.vectors.showAcceleration) {
        const totalA = Math.hypot(state.ax, state.ay);
        if (totalA > 0.05) {
          const aDirX = state.ax / totalA;
          const aDirY = state.ay / totalA;
          const cappedLen = Math.min(80, totalA * aScale);
          const endAx = pos.sx + aDirX * cappedLen;
          const endAy = pos.sy - aDirY * cappedLen;
          this._drawArrow(ctx, pos.sx, pos.sy, endAx, endAy, '#EA580C', `a=${totalA.toFixed(1)}m/s²`, {
            dash: [5, 2],
            lineWidth: 2,
            headStyle: 'filled'
          });
        }
      }
    }

    _drawVectorScalingLegend(ctx) {
      ctx.save();
      const lx = 10;
      const ly = this.displayHeight - 12;
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('สเกลเวกเตอร์: v (0.8 px/mps) | Fd (แดง Capped 80px) | mg (เทา Capped 60px) | a (ส้ม Capped 80px)', lx, ly);
      ctx.restore();
    }

    _renderRocketEquation(ctx, w, h) {
      const isMobile = w < 600;
      const p = this.rocketParams;
      const m0 = p.initialMassM0 || p.m0 || 12000.0;
      const mf = p.dryMassMf || p.mf || 1200.0;
      const uex = p.exhaustSpeedUex || p.uex || 3000.0;
      const burnRate = p.burnRate || 200.0;
      const g = p.gravity || 0.0;

      const totalBurnTime = (m0 - mf) / burnRate; // 54s
      const deltaVIdeal = uex * Math.log(m0 / mf); // 6907.8 m/s = 6.91 km/s

      // Loop time cycle for visual animation
      const animT = (this.simTime || 0) % (totalBurnTime + 6.0);
      const isBurning = animT <= totalBurnTime;
      const curFuel = isBurning ? Math.max(0, (m0 - mf) - burnRate * animT) : 0;
      const curMass = mf + curFuel;
      const curV = isBurning ? (uex * Math.log(m0 / curMass) - g * animT) : (deltaVIdeal - g * totalBurnTime);
      const fuelFrac = (m0 > mf) ? (curFuel / (m0 - mf)) : 0;

      // Deep space starry canvas background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, w, h);

      // Distant stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5 + 43) % w);
        const sy = ((i * 269.3 + 71) % (h - 60));
        const sz = (i % 3 === 0) ? 1.8 : 1.0;
        ctx.fillRect(sx, sy, sz, sz);
      }

      // Title & Header
      const padX = isMobile ? 10 : 18;
      ctx.fillStyle = '#f8fafc';
      ctx.font = isMobile ? 'bold 11px sans-serif' : 'bold 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(isMobile ? '🚀 จรวดไซออลคอฟสกี (Rocket Equation)' : '🚀 สมการจรวดไซออลคอฟสกี (Tsiolkovsky Rocket Equation & Variable Mass)', padX, isMobile ? 6 : 14);

      ctx.fillStyle = '#94a3b8';
      ctx.font = isMobile ? '9px sans-serif' : '11px sans-serif';
      ctx.fillText(
        isMobile 
          ? `m₀=${m0.toLocaleString()}kg | mf=${mf.toLocaleString()}kg | u_ex=${uex.toLocaleString()}m/s`
          : `การขับดันในอวกาศลึก: m₀ = ${m0.toLocaleString()} kg | m_f = ${mf.toLocaleString()} kg | u_ex = ${uex.toLocaleString()} m/s | g = ${g.toFixed(1)} m/s²`,
        padX, isMobile ? 22 : 34
      );

      // Calculate vertical budget
      const headerH = isMobile ? 36 : 52;
      const hudH = isMobile ? 38 : 46;
      const hudY = h - hudH - (isMobile ? 4 : 8);
      const availH = hudY - headerH;

      // Left Column: Rocket Visualizer
      const rocketCenterX = isMobile ? (padX + 22) : w * 0.20;
      const rocketH = isMobile ? Math.min(85, availH * 0.58) : Math.min(190, availH * 0.65);
      const rocketW = isMobile ? Math.max(22, rocketH * 0.26) : 48;
      const tankH = rocketH * 0.65;
      const fairingH = rocketH * 0.22;
      const nozzleH = rocketH * 0.13;
      const rocketBaseY = headerH + 6 + rocketH; // bottom of engine nozzle

      // Rocket fairing (nosecone)
      ctx.beginPath();
      ctx.moveTo(rocketCenterX - rocketW / 2, rocketBaseY - rocketH + fairingH);
      ctx.quadraticCurveTo(rocketCenterX, rocketBaseY - rocketH - (isMobile ? 8 : 16), rocketCenterX + rocketW / 2, rocketBaseY - rocketH + fairingH);
      ctx.closePath();
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Payload label
      if (!isMobile) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Payload', rocketCenterX, rocketBaseY - rocketH + fairingH / 2);
      }

      // Fuel Tank Body (Glass/Cutaway view)
      const tankTopY = rocketBaseY - rocketH + fairingH;
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.fillRect(rocketCenterX - rocketW / 2, tankTopY, rocketW, tankH);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rocketCenterX - rocketW / 2, tankTopY, rocketW, tankH);

      // Liquid propellant inside tank
      const liquidH = tankH * fuelFrac;
      const liquidTopY = tankTopY + (tankH - liquidH);
      if (liquidH > 0) {
        const grad = ctx.createLinearGradient(0, liquidTopY, 0, tankTopY + tankH);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(1, '#0369a1');
        ctx.fillStyle = grad;
        ctx.fillRect(rocketCenterX - rocketW / 2 + 1.5, liquidTopY, rocketW - 3, liquidH);

        // Meniscus
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(rocketCenterX - rocketW / 2 + 1.5, liquidTopY, rocketW - 3, 2);
      }

      // Tank Fuel Percentage Text
      ctx.fillStyle = '#ffffff';
      ctx.font = isMobile ? 'bold 8px monospace' : 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${(fuelFrac * 100).toFixed(0)}%`, rocketCenterX, tankTopY + tankH / 2 + (isMobile ? 3 : 4));

      // Rocket Nozzle (Engine Bell)
      const nozzleTopY = tankTopY + tankH;
      ctx.beginPath();
      ctx.moveTo(rocketCenterX - rocketW / 4, nozzleTopY);
      ctx.lineTo(rocketCenterX - rocketW / 2.2, nozzleTopY + nozzleH);
      ctx.lineTo(rocketCenterX + rocketW / 2.2, nozzleTopY + nozzleH);
      ctx.lineTo(rocketCenterX + rocketW / 4, nozzleTopY);
      ctx.closePath();
      ctx.fillStyle = '#475569';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Exhaust Plume (Flames & Mach diamonds)
      if (isBurning) {
        const maxFlameSpace = Math.max(12, hudY - (nozzleTopY + nozzleH) - 3);
        const flameLen = Math.min(maxFlameSpace, (isMobile ? 30 : 70) * (0.8 + 0.2 * Math.sin(animT * 30)));
        const flameGrad = ctx.createLinearGradient(rocketCenterX, nozzleTopY + nozzleH, rocketCenterX, nozzleTopY + nozzleH + flameLen);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.2, '#38bdf8'); // shock cone / LOX rich
        flameGrad.addColorStop(0.6, '#f97316');
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.beginPath();
        ctx.moveTo(rocketCenterX - rocketW / 2.2, nozzleTopY + nozzleH);
        ctx.quadraticCurveTo(rocketCenterX, nozzleTopY + nozzleH + flameLen, rocketCenterX + rocketW / 2.2, nozzleTopY + nozzleH);
        ctx.closePath();
        ctx.fillStyle = flameGrad;
        ctx.fill();

        // Mach diamond dots
        ctx.fillStyle = '#ffffff';
        const numDiamonds = isMobile ? 2 : 3;
        for (let d = 1; d <= numDiamonds; d++) {
          const dy = nozzleTopY + nozzleH + (flameLen / (numDiamonds + 1)) * d;
          ctx.beginPath();
          ctx.arc(rocketCenterX, dy, isMobile ? 1.2 : (2.5 - d * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Right Column: Equations & Analytical Insights
      const rightX = isMobile ? (rocketCenterX + rocketW / 2 + 10) : (w * 0.40);
      const rightW = w - rightX - (isMobile ? 6 : 14);
      const eqTopY = headerH + (isMobile ? 2 : 8);
      const eqCardH = Math.min(isMobile ? 90 : 110, hudY - eqTopY - 4);

      // Governing Formula Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(rightX, eqTopY, rightW, eqCardH);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(rightX, eqTopY, rightW, eqCardH);

      if (isMobile) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📐 จรวดมวลแปรผัน', rightX + 6, eqTopY + 11);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 8.5px monospace';
        ctx.fillText('dv = -u_ex (dm/m)', rightX + 6, eqTopY + 26);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('Δv = u_ex·ln(m₀/m_f)', rightX + 6, eqTopY + 41);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '8px sans-serif';
        ctx.fillText(`R_m = ${(m0/mf).toFixed(1)} | ln=${Math.log(m0/mf).toFixed(2)}`, rightX + 6, eqTopY + 56);

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 8.5px monospace';
        ctx.fillText(`Δv ≈ ${(deltaVIdeal/1000).toFixed(2)} km/s`, rightX + 6, eqTopY + 71);
      } else {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 11.5px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📐 กฎการอนุรักษ์โมเมนตัมมวลแปรผัน (Variable Mass):', rightX + 12, eqTopY + 12);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('dp = 0  =>  m·dv = -u_ex·dm  =>  dv = -u_ex (dm/m)', rightX + 12, eqTopY + 34);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 12.5px monospace';
        ctx.fillText('Δv = u_ex · ln(m₀ / m_f)', rightX + 12, eqTopY + 56);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10.5px sans-serif';
        const massRatioText = `อัตราส่วนมวล R_m = ${m0.toLocaleString()} / ${mf.toLocaleString()} = ${(m0/mf).toFixed(1)} (ln ≈ ${Math.log(m0/mf).toFixed(4)})`;
        const deltaVText = `ผลลัพธ์ Δv = ${uex.toLocaleString()} × ${Math.log(m0/mf).toFixed(4)} = ${deltaVIdeal.toFixed(1)} m/s ≈ ${(deltaVIdeal/1000).toFixed(2)} km/s`;
        ctx.fillText(massRatioText, rightX + 12, eqTopY + 76);
        ctx.fillStyle = '#4ade80';
        ctx.fillText(deltaVText, rightX + 12, eqTopY + 94);
      }

      // Live Telemetry HUD Bar at Bottom
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(padX, hudY, w - padX * 2, hudH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(padX, hudY, w - padX * 2, hudH);

      ctx.fillStyle = '#38bdf8';
      ctx.font = isMobile ? 'bold 8px monospace' : 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      if (isMobile) {
        ctx.fillText(`เผาไหม้ t=${animT.toFixed(1)}s/${totalBurnTime.toFixed(0)}s | m(t)=${curMass.toFixed(0)} kg`, padX + 6, hudY + 11);
        ctx.fillText(`v(t)=${(curV / 1000).toFixed(2)} km/s | Δv สุทธิ=${(deltaVIdeal / 1000).toFixed(2)} km/s`, padX + 6, hudY + 26);
      } else {
        ctx.fillText(`สถานะการบิน: เวลาเผาไหม้ t = ${animT.toFixed(1)}s / ${totalBurnTime.toFixed(0)}s | มวลรวม m(t) = ${curMass.toFixed(0)} kg (เชื้อเพลิงคงเหลือ ${curFuel.toFixed(0)} kg)`, padX + 12, hudY + 14);
        ctx.fillText(`อัตราเร็วสะสมปัจจุบัน v(t) = ${(curV / 1000).toFixed(2)} km/s | อัตราเร็วสุทธิสุดท้าย Δv = ${(deltaVIdeal / 1000).toFixed(2)} km/s (${(deltaVIdeal/1000).toFixed(2)} km/s)`, padX + 12, hudY + 32);
      }
    }

    // Teardown / Destruction for Single Loop Guard
    destroy() {
      this.stop();
      this._detachEventListeners();
      this.cachedSimulation = null;
      this.currentLiveState = null;
    }
  }

  return ProjectileSimulator;
}));
