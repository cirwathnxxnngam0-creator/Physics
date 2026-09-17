/**
 * circular_motion_simulator.js - Interactive Circular Dynamics, Banked Curves & Vertical Loops Simulator
 * Part of PhysicsNoza 3.0 Architecture (Chapter 02 Module)
 *
 * Simulates:
 *   Mode 1: Uniform Circular Motion (UCM) & Superelevated Banked Turns (AASHTO highway physics)
 *   Mode 2: Vertical Circular Motion & Roller Coaster Clothoid Loops (Energy conservation & critical G-forces)
 *   Mode 3: Gravitational Circular Orbits (LEO & Geostationary Equatorial Orbit)
 *
 * Physical Quantities:
 *   - Angular velocity: \omega = d\theta/dt
 *   - Tangential speed: v = \omega r
 *   - Centripetal acceleration: \vec{a}_c = -(v^2/r)\hat{r}
 *   - Resultant radial net force: \Sigma F_r = m v^2 / r
 *   - Banked curve design speed: v_0 = \sqrt{r g \tan\theta}
 *   - Vertical circle critical speed: v_{\text{top}} \ge \sqrt{gr}
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CircularMotionSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class CircularMotionSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for CircularMotionSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Sub-modes: 'banked' | 'vertical' | 'orbit'
      this.subMode = 'banked';

      // Simulation parameters
      this.params = {
        radius: 40.0,          // meters (or scaled)
        speed: 18.0,           // m/s
        bankAngleDeg: 12.0,    // degrees
        muStatic: 0.35,        // static friction coeff
        mass: 1000.0,          // kg (vehicle)
        gravity: 9.80,         // m/s^2
        loopType: 'clothoid',  // 'circle' or 'clothoid'
        orbitAltitudeKm: 35786 // km (for orbit mode)
      };

      // State
      this.state = {
        angleRad: 0.0,         // current angular position \theta
        simTime: 0.0,          // elapsed sim time (s)
        currentV: 18.0,        // instantaneous speed
        currentR: 40.0,        // instantaneous radius of curvature
        trail: [],             // array of past positions
        isStalled: false       // if vertical loop dropped
      };

      // Display toggles
      this.toggles = {
        showVelocity: true,
        showCentripetalAcc: true,
        showForces: true,
        showTrail: true,
        showDecomposition: true
      };

      // Animation & Playback
      this.isPlaying = false;
      this.animId = null;
      this.lastTimestamp = 0;

      this._setupCanvasResolution();
      window.addEventListener('resize', () => this.resize());
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
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.width = w;
      this.height = h;
    }

    resize() {
      this._setupCanvasResolution();
      this.render();
    }

    setSubMode(mode) {
      if (['banked', 'vertical', 'orbit'].includes(mode)) {
        this.subMode = mode;
        this.reset();
      }
    }

    setParam(key, value) {
      if (key in this.params) {
        this.params[key] = parseFloat(value);
        if (key === 'speed') this.state.currentV = this.params.speed;
        if (key === 'radius') this.state.currentR = this.params.radius;
        if (key === 'orbitAltitudeKm') {
          const G = 6.6743e-11, ME = 5.972e24, RE = 6371e3;
          const r = RE + this.params.orbitAltitudeKm * 1000;
          this.state.currentR = r;
          this.state.currentV = Math.sqrt(G * ME / r) * (this.params.orbitSpeedMultiplier || 1.0);
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

    step(dt = 0.05) {
      this.pause();
      this._updatePhysics(dt);
      this.render();
      this._emitTelemetry();
    }

    reset() {
      this.pause();
      this.state.angleRad = 0.0;
      this.state.simTime = 0.0;
      this.state.currentV = this.params.speed;
      this.state.currentR = this.params.radius;
      this.state.trail = [];
      this.state.isStalled = false;
      this.render();
      this._emitTelemetry();
    }

    _loop() {
      if (!this.isPlaying) return;
      const now = performance.now();
      let dt = (now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;

      // Cap delta time to prevent physics explosions on background tab sleep
      if (dt > 0.1) dt = 0.1;

      this._updatePhysics(dt);
      this.render();
      this._emitTelemetry();

      this.animId = requestAnimationFrame(() => this._loop());
    }

    _updatePhysics(dt) {
      this.state.simTime += dt;

      if (this.subMode === 'banked') {
        const r = Math.max(10.0, this.params.radius);
        const v = this.params.speed;
        const omega = v / r;
        this.state.currentV = v;
        this.state.currentR = r;
        this.state.angleRad = (this.state.angleRad + omega * dt) % (2 * Math.PI);

      } else if (this.subMode === 'vertical') {
        const r0 = Math.max(8.0, this.params.radius);
        const g = this.params.gravity;
        const theta = this.state.angleRad; // 0 = bottom, pi = top

        // Radius for clothoid vs circle:
        // In teardrop clothoid, radius at top is smaller than at base
        let r = r0;
        if (this.params.loopType === 'clothoid') {
          // Teardrop: r(top) = 0.5 * r0, r(bottom) = 1.3 * r0
          r = r0 * (0.9 - 0.4 * Math.cos(theta));
        }
        this.state.currentR = r;

        // Height from bottom: h = r0 * (1 - Math.cos(theta))
        const h = r * (1 - Math.cos(theta));
        const v0 = this.params.speed;
        const vSq = v0 * v0 - 2 * g * h;

        if (vSq <= 0.5) {
          // Stalled / not enough kinetic energy to reach this height
          this.state.isStalled = true;
          this.state.currentV = 0.0;
        } else {
          this.state.isStalled = false;
          const v = Math.sqrt(vSq);
          this.state.currentV = v;
          const omega = v / r;
          this.state.angleRad = (this.state.angleRad + omega * dt) % (2 * Math.PI);
        }

      } else if (this.subMode === 'orbit') {
        const G = 6.6743e-11;
        const ME = 5.972e24;
        const RE = 6371e3; // Earth radius in meters
        const altM = this.params.orbitAltitudeKm * 1000;
        const r = RE + altM;
        const v = Math.sqrt(G * ME / r); // Kepler orbital velocity
        const omega = v / r;
        this.state.currentV = v;
        this.state.currentR = r;
        // Visual speed multiplier for animation visibility
        const simSpeedFactor = (this.params.orbitAltitudeKm > 20000) ? 2400.0 : 600.0;
        this.state.angleRad = (this.state.angleRad + omega * dt * simSpeedFactor) % (2 * Math.PI);
      }

      // Record trail
      if (this.toggles.showTrail) {
        this.state.trail.push({
          angle: this.state.angleRad,
          time: this.state.simTime
        });
        if (this.state.trail.length > 120) {
          this.state.trail.shift();
        }
      }
    }

    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      // Dark background with gradient
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, w, h);

      // Grid pattern
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      if (this.subMode === 'banked') {
        this._renderBankedMode(ctx, w, h);
      } else if (this.subMode === 'vertical') {
        this._renderVerticalMode(ctx, w, h);
      } else if (this.subMode === 'orbit') {
        this._renderOrbitMode(ctx, w, h);
      }
    }

    _renderBankedMode(ctx, w, h) {
      // Split display: Left = Top-down track view, Right = Banked cross-section FBD
      const splitX = Math.floor(w * 0.52);

      // -------------------------------------------------------------
      // Left Panel: Top-down Circular Track
      // -------------------------------------------------------------
      const cx = splitX * 0.5;
      const cy = h * 0.5;
      const scale = Math.min(splitX, h) * 0.38 / Math.max(10, this.params.radius);
      const pixelR = this.params.radius * scale;

      // Track ring
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.arc(cx, cy, pixelR, 0, 2 * Math.PI);
      ctx.stroke();

      // Road lane center line
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, pixelR, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center point O
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#64748B';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('ศูนย์กลาง O', cx - 24, cy + 16);

      // Past Trail
      if (this.toggles.showTrail && this.state.trail.length > 1) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = 0; i < this.state.trail.length; i++) {
          const ptAngle = this.state.trail[i].angle;
          const px = cx + pixelR * Math.cos(ptAngle);
          const py = cy + pixelR * Math.sin(ptAngle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Vehicle Position on circle
      const th = this.state.angleRad;
      const carX = cx + pixelR * Math.cos(th);
      const carY = cy + pixelR * Math.sin(th);

      // Draw Vehicle Body (orient along tangent)
      ctx.save();
      ctx.translate(carX, carY);
      ctx.rotate(th + Math.PI / 2);

      ctx.fillStyle = '#38BDF8';
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-10, -18, 20, 36, 4);
      ctx.fill();
      ctx.stroke();

      // Windshield
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-7, -8, 14, 8);

      // Headlights
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(-8, 14, 4, 3);
      ctx.fillRect(4, 14, 4, 3);
      ctx.restore();

      // Vectors on Top-down view
      if (this.toggles.showVelocity) {
        // Tangential velocity (orange)
        const vLen = Math.min(80, this.params.speed * 2.2);
        const vx = -vLen * Math.sin(th);
        const vy = vLen * Math.cos(th);
        this._drawArrow(ctx, carX, carY, carX + vx, carY + vy, '#EA580C', 'v');
      }

      if (this.toggles.showCentripetalAcc) {
        // Centripetal acceleration (cyan, towards center)
        const ac = (this.params.speed * this.params.speed) / this.params.radius;
        const acLen = Math.min(90, ac * 4.5);
        const ax = -acLen * Math.cos(th);
        const ay = -acLen * Math.sin(th);
        this._drawArrow(ctx, carX, carY, carX + ax, carY + ay, '#38BDF8', 'a_c');
      }

      // Title on left
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('1. มุมมองจากด้านบน (Top-down Track Plan)', 16, 26);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`รัศมี r = ${this.params.radius.toFixed(1)} m | v = ${this.params.speed.toFixed(1)} m/s (${(this.params.speed * 3.6).toFixed(1)} km/h)`, 16, 44);
      ctx.restore();

      // -------------------------------------------------------------
      // Divider line
      // -------------------------------------------------------------
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(splitX, 10);
      ctx.lineTo(splitX, h - 10);
      ctx.stroke();

      // -------------------------------------------------------------
      // Right Panel: Banked Road Cross-Section & Free-Body Diagram
      // -------------------------------------------------------------
      ctx.save();
      const rcX = splitX + (w - splitX) * 0.5;
      const rcY = h * 0.55;

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('2. ภาคตัดขวาง & แผนภาพวัตถุอิสระ (FBD on Banked Curve)', splitX + 16, 26);

      const bankRad = this.params.bankAngleDeg * Math.PI / 180;
      const slopeW = 220;
      const slopeH = slopeW * Math.tan(bankRad);

      // Draw Road Slope Triangle
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(rcX - 110, rcY + 40);
      ctx.lineTo(rcX + 110, rcY + 40);
      ctx.lineTo(rcX + 110, rcY + 40 - slopeH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Angle indicator
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(rcX - 110, rcY + 40, 45, 0, -bankRad, true);
      ctx.stroke();
      ctx.fillStyle = '#F59E0B';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`θ = ${this.params.bankAngleDeg.toFixed(1)}°`, rcX - 60, rcY + 34);

      // Car box on slope
      const carMidX = rcX;
      const carMidY = rcY + 40 - slopeH * 0.5 - 12;

      ctx.save();
      ctx.translate(carMidX, carMidY);
      ctx.rotate(-bankRad);

      ctx.fillStyle = '#38BDF8';
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-24, -14, 48, 24, 4);
      ctx.fill();
      ctx.stroke();

      // Wheels
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-20, 10, 8, 4);
      ctx.fillRect(12, 10, 8, 4);

      // FBD Vectors
      if (this.toggles.showForces) {
        // Normal force N (perpendicular to slope, upwards)
        this._drawArrow(ctx, 0, -14, 0, -75, '#10B981', 'N');

        // Friction f_s on slope
        const vDesign = Math.sqrt(this.params.radius * this.params.gravity * Math.tan(bankRad));
        const diffV = this.params.speed - vDesign;

        if (Math.abs(diffV) > 0.4) {
          if (diffV > 0) {
            // Speed higher than design speed -> friction pulls DOWN the slope
            this._drawArrow(ctx, 0, 10, -45, 10, '#EF4444', 'f_s');
          } else {
            // Speed lower than design speed -> friction pushes UP the slope
            this._drawArrow(ctx, 0, 10, 45, 10, '#F59E0B', 'f_s');
          }
        }
      }
      ctx.restore();

      // Weight mg (straight down)
      if (this.toggles.showForces) {
        this._drawArrow(ctx, carMidX, carMidY, carMidX, carMidY + 65, '#EF4444', 'mg');
      }

      // Stability status badge
      const vDesign = Math.sqrt(this.params.radius * this.params.gravity * Math.tan(bankRad));
      const mu = this.params.muStatic;
      const tanTh = Math.tan(bankRad);
      const vMax = (1 - mu * tanTh > 0)
        ? Math.sqrt(this.params.radius * this.params.gravity * (tanTh + mu) / (1 - mu * tanTh))
        : 999.0;
      const vMin = (tanTh - mu > 0)
        ? Math.sqrt(this.params.radius * this.params.gravity * (tanTh - mu) / (1 + mu * tanTh))
        : 0.0;

      let statusColor = '#10B981';
      let statusText = '🟢 เสถียรภาพสมบูรณ์ (Safe & Stable)';
      if (this.params.speed > vMax) {
        statusColor = '#EF4444';
        statusText = '🔴 รถหลุดโค้ง (Skidding Outward)';
      } else if (this.params.speed < vMin && vMin > 0) {
        statusColor = '#EF4444';
        statusText = '⚠️ รถลื่นตกโค้งด้านใน (Sliding Down Inward)';
      } else if (Math.abs(this.params.speed - vDesign) < 0.6) {
        statusColor = '#38BDF8';
        statusText = '⭐ ความเร็วออกแบบพอดี (Zero Friction Needed)';
      } else if (this.params.speed > vDesign) {
        statusColor = '#F59E0B';
        statusText = '🟡 พึ่งพาแรงเสียดทานดึงลง (Friction active down-bank)';
      }

      // Status Box at Bottom of right panel
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(splitX + 16, h - 90, w - splitX - 32, 74, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = statusColor;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(statusText, splitX + 28, h - 68);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`• Design Speed (f_s=0): ${vDesign.toFixed(1)} m/s (${(vDesign * 3.6).toFixed(1)} km/h)`, splitX + 28, h - 48);
      ctx.fillText(`• Safe Speed Range: ${vMin.toFixed(1)} – ${vMax > 300 ? '∞' : vMax.toFixed(1)} m/s (μ_s = ${mu.toFixed(2)})`, splitX + 28, h - 30);

      ctx.restore();
    }

    _renderVerticalMode(ctx, w, h) {
      const cx = w * 0.42;
      const cy = h * 0.52;
      const r0 = this.params.radius;
      const scale = Math.min(w * 0.35, h * 0.38) / Math.max(8, r0);

      // Title
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`วงกลมแนวดิ่ง & ลูปคลอธอยด์ (${this.params.loopType === 'clothoid' ? 'Teardrop Clothoid' : 'True Circle'})`, 16, 26);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`ความเร็วเริ่มต้นจุดล่างสุด v₀ = ${this.params.speed.toFixed(1)} m/s | รัศมี r₀ = ${r0.toFixed(1)} m`, 16, 44);

      // Draw Track Loop
      ctx.save();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();

      const numPoints = 180;
      for (let i = 0; i <= numPoints; i++) {
        const phi = (i / numPoints) * 2 * Math.PI;
        let r = r0;
        if (this.params.loopType === 'clothoid') {
          r = r0 * (0.9 - 0.4 * Math.cos(phi));
        }
        const px = cx + r * scale * Math.sin(phi);
        const py = cy + r * scale * Math.cos(phi);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Apex and Base markers
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      const topR = (this.params.loopType === 'clothoid') ? r0 * 0.5 : r0;
      ctx.arc(cx, cy - topR * scale, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('ยอดลูป (Apex)', cx + 10, cy - topR * scale + 3);

      // Current Cart Position
      const th = this.state.angleRad; // 0 = bottom, pi = top
      const curR = this.state.currentR;
      const cartX = cx + curR * scale * Math.sin(th);
      const cartY = cy + curR * scale * Math.cos(th);

      // Cart
      ctx.fillStyle = this.state.isStalled ? '#EF4444' : '#F59E0B';
      ctx.strokeStyle = '#F8FAFC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cartX, cartY, 9, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Vectors at cart
      const v = this.state.currentV;
      if (this.toggles.showVelocity && v > 0) {
        // Tangent vector
        const vx = -v * 2.5 * Math.cos(th);
        const vy = v * 2.5 * Math.sin(th);
        this._drawArrow(ctx, cartX, cartY, cartX + vx, cartY + vy, '#EA580C', 'v');
      }

      if (this.toggles.showForces && !this.state.isStalled) {
        // Weight mg straight down
        this._drawArrow(ctx, cartX, cartY, cartX, cartY + 45, '#EF4444', 'mg');

        // Normal force N (towards center of curvature)
        const ac = (v * v) / curR;
        const gEff = this.params.gravity * Math.cos(th);
        const nMag = Math.max(0, ac - gEff);
        const nLen = Math.min(80, nMag * 2.5);
        const nx = -nLen * Math.sin(th);
        const ny = -nLen * Math.cos(th);
        this._drawArrow(ctx, cartX, cartY, cartX + nx, cartY + ny, '#10B981', 'N');
      }
      ctx.restore();

      // Right Side Info Panel
      const pX = w * 0.68;
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(pX, 20, w - pX - 20, h - 40, 8);
      ctx.fill();
      ctx.stroke();

      const vCritTop = Math.sqrt(this.params.gravity * topR);
      const vCritBot = Math.sqrt(5 * this.params.gravity * r0);
      const gForce = (v * v / curR) / this.params.gravity + Math.cos(th);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('📊 วิเคราะห์วงกลมแนวดิ่ง', pX + 16, 46);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`• อัตราเร็วขณะนี้: ${v.toFixed(2)} m/s`, pX + 16, 76);
      ctx.fillText(`• รัศมีความโค้ง r: ${curR.toFixed(1)} m`, pX + 16, 98);
      ctx.fillText(`• ความเร่งสู่ศูนย์กลาง: ${(v * v / curR).toFixed(1)} m/s²`, pX + 16, 120);

      ctx.fillStyle = (gForce > 4.5) ? '#EF4444' : '#10B981';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`• สัมผัสแรง G: ${gForce.toFixed(2)} G`, pX + 16, 144);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`• เกณฑ์วิกฤตยอด: v_top ≥ ${vCritTop.toFixed(1)} m/s`, pX + 16, 172);
      ctx.fillText(`• เกณฑ์วิกฤตฐาน: v_bot ≥ ${vCritBot.toFixed(1)} m/s`, pX + 16, 194);

      // Warning if stalled or too high G
      if (this.state.isStalled) {
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('⚠️ พลังงานไม่พอผ่านยอดลูป!', pX + 16, 230);
      } else if (v < vCritTop && Math.cos(th) < -0.8) {
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('⚠️ ต่ำกว่าความเร็ววิกฤต: เสี่ยงหลุดราง', pX + 16, 230);
      } else {
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('✓ ผ่านลูปได้ปลอดภัยสมบูรณ์', pX + 16, 230);
      }

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('ข้อสังเกต: คลอธอยด์ช่วยลด G-force', pX + 16, 260);
      ctx.fillText('ที่ฐานลูปเหลือ 3G แทนที่จะพุ่งถึง 6G', pX + 16, 276);
    }

    _renderOrbitMode(ctx, w, h) {
      const cx = w * 0.45;
      const cy = h * 0.5;

      // Earth at Center
      const earthRadiusPx = 28;
      ctx.fillStyle = '#0284C7';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadiusPx, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('โลก (Earth)', cx - 26, cy + 3);

      // Orbit Circle
      const altKm = this.params.orbitAltitudeKm;
      // Continuous dynamic scaling: 400 km -> 46px, 20,200 km -> 118px, 35,786 km -> 160px
      const orbitRadiusPx = Math.min(cx - 20, Math.max(42, earthRadiusPx + 14 + Math.pow(altKm / 40000, 0.65) * 125));

      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, orbitRadiusPx, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellite Position
      const th = this.state.angleRad;
      const satX = cx + orbitRadiusPx * Math.cos(th);
      const satY = cy + orbitRadiusPx * Math.sin(th);

      // Draw Satellite
      ctx.save();
      ctx.translate(satX, satY);
      ctx.rotate(th + Math.PI / 2);

      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-6, -5, 12, 10);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(-16, -3, 8, 6);
      ctx.fillRect(8, -3, 8, 6);
      ctx.restore();

      // Gravity force vector towards Earth
      if (this.toggles.showForces) {
        const fgX = -35 * Math.cos(th);
        const fgY = -35 * Math.sin(th);
        this._drawArrow(ctx, satX, satY, satX + fgX, satY + fgY, '#EF4444', 'F_g');
      }

      // Orbital Velocity Vector
      if (this.toggles.showVelocity) {
        const vx = -40 * Math.sin(th);
        const vy = 40 * Math.cos(th);
        this._drawArrow(ctx, satX, satY, satX + vx, satY + vy, '#10B981', 'v_orb');
      }

      // Header on left
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('วงโคจรดาวเทียมและความโน้มถ่วง (Keplerian Orbit)', 16, 26);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`ความสูง h = ${altKm.toLocaleString()} km เหนือพื้นโลก`, 16, 44);

      // Info Box on Right
      const pX = w * 0.72;
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(pX, 20, w - pX - 16, h - 40, 8);
      ctx.fill();
      ctx.stroke();

      const vOrbKmS = this.state.currentV / 1000;
      const periodSec = (vOrbKmS > 0) ? (2 * Math.PI * this.state.currentR / this.state.currentV) : 0;
      const periodHours = periodSec / 3600;

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('🛰️ ข้อมูลวงโคจร', pX + 16, 46);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`• ความเร็วโคจร: ${vOrbKmS.toFixed(2)} km/s`, pX + 16, 76);
      ctx.fillText(`• คาบการโคจร T: ${periodHours.toFixed(2)} ชม.`, pX + 16, 98);
      ctx.fillText(`  (${Math.round(periodSec / 60)} นาที)`, pX + 16, 114);

      if (Math.abs(altKm - 35786) < 600) {
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('⭐ วงโคจรค้างฟ้า GEO!', pX + 16, 145);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('คาบเท่าการหมุนของโลก (~24 ชม.)', pX + 16, 162);
        ctx.fillText('จานดาวเทียมไม่ต้องหันตาม', pX + 16, 178);
      } else if (Math.abs(altKm - 20200) < 1000) {
        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('🛰️ วงโคจรดาวเทียม GPS (MEO)', pX + 16, 145);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('คาบเวลาโคจรประมาณ 11.97 ชม.', pX + 16, 162);
        ctx.fillText('กลุ่มดาวเทียม 24 ดวงครอบคลุมโลก', pX + 16, 178);
      } else if (altKm <= 2000) {
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('🚀 วงโคจรระดับต่ำ (LEO / ISS)', pX + 16, 145);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('เช่น สถานีอวกาศนานาชาติ ISS', pX + 16, 162);
        ctx.fillText('โคจรรอบโลกทุกๆ ~92 นาที', pX + 16, 178);
      } else {
        ctx.fillStyle = '#A855F7';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('🌐 วงโคจรกำหนดเอง (Custom Orbit)', pX + 16, 145);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`รัศมีรวม r = ${(6371 + altKm).toLocaleString()} km`, pX + 16, 162);
        ctx.fillText(`ความเร็วหลุดพ้น: ${(vOrbKmS * Math.sqrt(2)).toFixed(2)} km/s`, pX + 16, 178);
      }
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

      const r = this.state.currentR;
      const v = this.state.currentV;
      const omega = (r > 0) ? v / r : 0.0;
      const ac = (r > 0) ? (v * v) / r : 0.0;
      const fc = this.params.mass * ac;
      const period = (omega > 0) ? (2 * Math.PI / omega) : 0.0;
      const freq = (period > 0) ? (1 / period) : 0.0;

      this.options.onTelemetryUpdate({
        subMode: this.subMode,
        time: this.state.simTime,
        radius: r,
        speed: v,
        speedKmh: v * 3.6,
        omega: omega,
        centripetalAcc: ac,
        centripetalForce: fc,
        gForce: ac / this.params.gravity,
        period: period,
        frequency: freq
      });
    }
  }

  return CircularMotionSimulator;
}));
