/**
 * collision_impulse_simulator.js - Interactive 1D/2D Collision, Impulse & Momentum Simulator
 * Part of PhysicsNoza 3.0 Architecture
 *
 * Simulates collision dynamics between two rigid bodies, illustrating:
 *   - Linear momentum conservation: \vec{p}_1 + \vec{p}_2 = \text{constant}
 *   - Contact impulse: \vec{J} = \int \vec{F}(t) dt = \Delta\vec{p}_1 = -\Delta\vec{p}_2
 *   - Coefficient of restitution: e = -\frac{v_{2f} - v_{1f}}{u_{2i} - u_{1i}} \in [0, 1]
 *   - Mechanical kinetic energy loss / dissipation: \Delta K = K_f - K_i
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CollisionImpulseSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class CollisionImpulseSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for CollisionImpulseSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Simulation Parameters
      this.params = {
        m1: 3.0,          // Mass 1 (kg) [1..10]
        m2: 5.0,          // Mass 2 (kg) [1..10]
        u1: 15.0,         // Initial velocity 1 (m/s) [-25..+25]
        u2: -10.0,        // Initial velocity 2 (m/s) [-25..+25]
        e: 0.80,          // Coefficient of restitution [0..1]
        contactDuration: 0.08 // Seconds of contact deformation
      };

      // State
      this.state = {
        simTime: 0.0,
        x1: 20.0,         // World x1 (m)
        x2: 70.0,         // World x2 (m)
        v1: 15.0,         // Live velocity 1 (m/s)
        v2: -10.0,        // Live velocity 2 (m/s)
        cartWidth: 8.0,   // World meters
        inCollision: false,
        collisionProgress: 0.0, // 0..1 during contact
        collisionCompleted: false,
        contactForce: 0.0,      // Live contact force (N)
        peakForce: 0.0,         // Peak impact force (N)
        impulse: 0.0,           // Total impulse J (N*s)
        keInitial: 0.0,
        keCurrent: 0.0,
        keFinal: 0.0,
        sparks: []
      };

      this.isPlaying = false;
      this.animId = null;
      this.lastTimestamp = 0;

      this.calculatePreCollisionTheoretical();
      this.setupPointerEvents();
      this.resize();
    }

    calculatePreCollisionTheoretical() {
      const m1 = this.params.m1;
      const m2 = this.params.m2;
      const u1 = this.params.u1;
      const u2 = this.params.u2;
      const e = this.params.e;

      // Final theoretical velocities
      const v1f = ((m1 - e * m2) * u1 + (1 + e) * m2 * u2) / (m1 + m2);
      const v2f = ((1 + e) * m1 * u1 + (m2 - e * m1) * u2) / (m1 + m2);

      // Impulse J = m1 * (v1f - u1)
      const impulse = Math.abs(m1 * (v1f - u1));
      // Peak force from J = (2/pi) * F_peak * dt => F_peak = (pi * J) / (2 * dt)
      const dt = this.params.contactDuration;
      const peakForce = (Math.PI * impulse) / (2 * dt);

      const keInitial = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
      const keFinal = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;

      this.theoretical = {
        v1f,
        v2f,
        impulse,
        peakForce,
        keInitial,
        keFinal,
        keLoss: keFinal - keInitial
      };

      this.state.keInitial = keInitial;
      this.state.keCurrent = keInitial;
      this.state.keFinal = keFinal;
      this.state.peakForce = peakForce;
      this.state.impulse = impulse;
    }

    setupPointerEvents() {
      let isDraggingCart = null;

      const getCanvasCoords = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const scaleX = this.canvas.width / (rect.width * (window.devicePixelRatio || 1));
        const px = (clientX - rect.left) * scaleX;
        const w = this.canvas.width / (window.devicePixelRatio || 1);
        return (px / w) * 100.0; // World x (0..100)
      };

      const handleDown = (e) => {
        const wx = getCanvasCoords(e);
        if (Math.abs(wx - this.state.x1) < this.state.cartWidth) {
          isDraggingCart = 'cart1';
        } else if (Math.abs(wx - this.state.x2) < this.state.cartWidth) {
          isDraggingCart = 'cart2';
        }
      };

      const handleMove = (e) => {
        if (!isDraggingCart) return;
        const wx = getCanvasCoords(e);
        if (isDraggingCart === 'cart1') {
          this.state.x1 = Math.max(5, Math.min(this.state.x2 - this.state.cartWidth, wx));
        } else if (isDraggingCart === 'cart2') {
          this.state.x2 = Math.max(this.state.x1 + this.state.cartWidth, Math.min(95, wx));
        }
        this.render();
        this.broadcastTelemetry();
      };

      const handleUp = () => {
        isDraggingCart = null;
      };

      this.canvas.addEventListener('mousedown', handleDown);
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);

      this.canvas.addEventListener('touchstart', handleDown, { passive: true });
      window.addEventListener('touchmove', handleMove, { passive: true });
      window.addEventListener('touchend', handleUp);
    }

    resize() {
      const parentW = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 0;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      const width = parentW > 0 ? parentW : Math.max(rect.width || 400, 320);
      const height = Math.max(rect.height || 280, 240);

      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.canvas.style.width = '100%';
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.height = 'auto';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.render();
    }

    setParams(newParams) {
      Object.assign(this.params, newParams);
      this.calculatePreCollisionTheoretical();
      if (!this.state.collisionCompleted) {
        this.state.v1 = this.params.u1;
        this.state.v2 = this.params.u2;
      }
      this.render();
      this.broadcastTelemetry();
    }

    play() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.lastTimestamp = performance.now();
      const loop = (now) => {
        if (!this.isPlaying) return;
        const dtSec = Math.min((now - this.lastTimestamp) / 1000.0, 0.05);
        this.lastTimestamp = now;
        this.updatePhysics(dtSec);
        this.render();
        this.broadcastTelemetry();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    pause() {
      this.isPlaying = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      this.broadcastTelemetry();
    }

    step(dt = 0.02) {
      this.pause();
      this.updatePhysics(dt);
      this.render();
      this.broadcastTelemetry();
    }

    reset() {
      this.pause();
      this.state.simTime = 0.0;
      this.state.x1 = 20.0;
      this.state.x2 = 70.0;
      this.state.v1 = this.params.u1;
      this.state.v2 = this.params.u2;
      this.state.inCollision = false;
      this.state.collisionProgress = 0.0;
      this.state.collisionCompleted = false;
      this.state.contactForce = 0.0;
      this.state.sparks = [];
      this.calculatePreCollisionTheoretical();
      this.render();
      this.broadcastTelemetry();
    }

    updatePhysics(dt) {
      this.state.simTime += dt;
      const m1 = this.params.m1;
      const m2 = this.params.m2;
      const cw = this.state.cartWidth;

      if (!this.state.inCollision && !this.state.collisionCompleted) {
        // Move carts linearly
        this.state.x1 += this.state.v1 * dt;
        this.state.x2 += this.state.v2 * dt;

        // Check contact: cart1 right edge >= cart2 left edge
        if (this.state.x1 + cw >= this.state.x2) {
          // Clamp to contact position and trigger impact phase
          const overlap = (this.state.x1 + cw) - this.state.x2;
          this.state.x1 -= overlap / 2;
          this.state.x2 += overlap / 2;
          this.state.inCollision = true;
          this.state.collisionProgress = 0.0;

          // Spawn collision sparks for inelastic collisions
          if (this.params.e < 0.99) {
            this.spawnSparks((this.state.x1 + this.state.x2) / 2);
          }
        }
      } else if (this.state.inCollision) {
        // Deformation phase over contactDuration
        this.state.collisionProgress += dt / this.params.contactDuration;
        const progress = Math.min(1.0, this.state.collisionProgress);

        // Sinusoidal contact force curve
        const force = this.state.peakForce * Math.sin(Math.PI * progress);
        this.state.contactForce = force;

        // Dynamic velocity interpolation during contact
        const u1 = this.params.u1;
        const u2 = this.params.u2;
        const v1f = this.theoretical.v1f;
        const v2f = this.theoretical.v2f;

        // Velocity transitions monotonically through contact
        const smoothProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
        this.state.v1 = u1 + (v1f - u1) * smoothProgress;
        this.state.v2 = u2 + (v2f - u2) * smoothProgress;

        // Slight displacement during contact
        const avgV = (this.state.v1 + this.state.v2) / 2.0;
        this.state.x1 += avgV * dt;
        this.state.x2 = this.state.x1 + cw;

        if (progress >= 1.0) {
          this.state.inCollision = false;
          this.state.collisionCompleted = true;
          this.state.contactForce = 0.0;
          this.state.v1 = v1f;
          this.state.v2 = v2f;
        }
      } else {
        // Post-collision motion
        this.state.x1 += this.state.v1 * dt;
        this.state.x2 += this.state.v2 * dt;

        // Boundary rebound off track ends
        if (this.state.x1 < 2) {
          this.state.x1 = 2;
          this.state.v1 = -this.state.v1 * 0.9;
        }
        if (this.state.x2 > 98 - cw) {
          this.state.x2 = 98 - cw;
          this.state.v2 = -this.state.v2 * 0.9;
        }
      }

      // Live Kinetic Energy
      this.state.keCurrent = 0.5 * m1 * this.state.v1 * this.state.v1 + 0.5 * m2 * this.state.v2 * this.state.v2;

      // Update sparks
      for (let i = this.state.sparks.length - 1; i >= 0; i--) {
        const s = this.state.sparks[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.life -= dt;
        if (s.life <= 0) {
          this.state.sparks.splice(i, 1);
        }
      }
    }

    spawnSparks(worldX) {
      const sparkCount = Math.floor((1.0 - this.params.e) * 35) + 10;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.random() - 0.5) * Math.PI;
        const spd = 5 + Math.random() * 20;
        this.state.sparks.push({
          x: worldX,
          y: 0,
          vx: Math.cos(angle) * spd * (Math.random() > 0.5 ? 1 : -1),
          vy: -Math.abs(Math.sin(angle) * spd) - 5,
          life: 0.3 + Math.random() * 0.4,
          maxLife: 0.7
        });
      }
    }

    render() {
      const ctx = this.ctx;
      const w = this.canvas.width / (window.devicePixelRatio || 1);
      const h = this.canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, w, h);

      // Linear Track parameters
      const trackY = h * 0.65;
      const trackHeight = 12;
      const trackLeft = 30;
      const trackRight = w - 30;
      const trackWidthPx = trackRight - trackLeft;

      const worldToPx = (wx) => trackLeft + (wx / 100.0) * trackWidthPx;

      // Draw Top Live Momentum Conservation Bar
      this.renderMomentumGauge(ctx, w, 25);

      // Draw Track
      ctx.fillStyle = '#334155';
      ctx.fillRect(trackLeft, trackY, trackWidthPx, trackHeight);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(trackLeft, trackY, trackWidthPx, trackHeight);

      // Track Distance Ruler Tick Marks
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      for (let m = 0; m <= 100; m += 10) {
        const px = worldToPx(m);
        ctx.beginPath();
        ctx.moveTo(px, trackY + trackHeight);
        ctx.lineTo(px, trackY + trackHeight + 6);
        ctx.stroke();
        ctx.fillText(`${m}m`, px, trackY + trackHeight + 16);
      }

      // Render Carts
      const px1 = worldToPx(this.state.x1);
      const px2 = worldToPx(this.state.x2);
      const cartWidthPx = (this.state.cartWidth / 100.0) * trackWidthPx;
      const cartHeightPx = 36;

      // Cart 1 (Blue)
      this.renderCart(
        ctx,
        px1,
        trackY - cartHeightPx,
        cartWidthPx,
        cartHeightPx,
        '#2563EB',
        '#60A5FA',
        `m₁ = ${this.params.m1.toFixed(1)} kg`,
        this.state.v1,
        this.params.m1 * this.state.v1,
        'left'
      );

      // Cart 2 (Orange)
      this.renderCart(
        ctx,
        px2,
        trackY - cartHeightPx,
        cartWidthPx,
        cartHeightPx,
        '#EA580C',
        '#FB923C',
        `m₂ = ${this.params.m2.toFixed(1)} kg`,
        this.state.v2,
        this.params.m2 * this.state.v2,
        'right'
      );

      // Contact Force / Impact Springs
      if (this.state.inCollision) {
        const contactPx = (px1 + cartWidthPx + px2) / 2;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(contactPx, trackY - cartHeightPx / 2, 8 + (this.state.contactForce / this.state.peakForce) * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`แรงปะทะ F = ${Math.round(this.state.contactForce)} N`, contactPx, trackY - cartHeightPx - 20);
      }

      // Render Sparks
      this.state.sparks.forEach(s => {
        const spx = worldToPx(s.x);
        const spy = trackY - cartHeightPx / 2 + s.y;
        ctx.fillStyle = `rgba(251, 191, 36, ${s.life / s.maxLife})`;
        ctx.beginPath();
        ctx.arc(spx, spy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bottom Legend / Info
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`สัมประสิทธิ์การคืนตัว e = ${this.params.e.toFixed(2)} (${this.getRestitutionLabel()})`, trackLeft, h - 15);
      ctx.textAlign = 'right';
      ctx.fillText(`การดลแลกเปลี่ยน J = ${this.state.impulse.toFixed(2)} N·s | พลังงานกลสูญเสีย ΔK = ${Math.abs(this.theoretical.keLoss).toFixed(1)} J`, trackRight, h - 15);
    }

    renderCart(ctx, x, y, width, height, color, strokeColor, label, v, p, side) {
      // Cart Body
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 4);
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bumper Spring
      ctx.fillStyle = '#94A3B8';
      if (side === 'left') {
        ctx.fillRect(x + width - 3, y + height * 0.3, 3, height * 0.4);
      } else {
        ctx.fillRect(x, y + height * 0.3, 3, height * 0.4);
      }

      // Wheels
      ctx.fillStyle = '#1E293B';
      const wheelR = 4;
      [x + width * 0.25, x + width * 0.75].forEach(wx => {
        ctx.beginPath();
        ctx.arc(wx, y + height + wheelR - 1, wheelR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#64748B';
        ctx.stroke();
      });

      // Cart Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + width / 2, y + height / 2 + 3);

      // Velocity & Momentum Vector Arrow
      const arrowY = y - 10;
      const vMag = Math.abs(v);
      if (vMag > 0.2) {
        const arrowLen = Math.min(width * 0.9, (vMag / 25.0) * width * 1.1) * (v > 0 ? 1 : -1);
        const startX = x + width / 2;
        const endX = startX + arrowLen;

        ctx.strokeStyle = '#10B981'; // Green for velocity
        ctx.fillStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, arrowY);
        ctx.lineTo(endX, arrowY);
        ctx.stroke();

        // Tip
        const tipSign = v > 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(endX, arrowY);
        ctx.lineTo(endX - 5 * tipSign, arrowY - 3);
        ctx.lineTo(endX - 5 * tipSign, arrowY + 3);
        ctx.closePath();
        ctx.fill();

        ctx.font = '9px sans-serif';
        ctx.fillText(`v = ${v.toFixed(1)} m/s`, startX, arrowY - 6);
      }
    }

    renderMomentumGauge(ctx, w, topY) {
      const gaugeWidth = Math.min(w - 60, 420);
      const gaugeX = (w - gaugeWidth) / 2;
      const p1 = this.params.m1 * this.state.v1;
      const p2 = this.params.m2 * this.state.v2;
      const pTot = p1 + p2;

      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.beginPath();
      ctx.roundRect(gaugeX, topY, gaugeWidth, 34, 6);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`กฎการอนุรักษ์โมเมนตัม: p_รวม = ${pTot.toFixed(1)} kg·m/s (คงที่ตลอดเวลา)`, gaugeX + 10, topY + 14);

      // Mini split bar
      const barY = topY + 20;
      const barH = 7;
      const barW = gaugeWidth - 20;

      ctx.fillStyle = '#334155';
      ctx.fillRect(gaugeX + 10, barY, barW, barH);

      // Normalize p1 and p2 relative to scale
      const maxP = Math.max(80, Math.abs(pTot) * 1.5, Math.abs(p1) + Math.abs(p2));
      const mid = gaugeX + 10 + barW / 2;

      // P1 bar (Blue)
      const p1Px = (p1 / maxP) * (barW / 2);
      ctx.fillStyle = '#3B82F6';
      if (p1Px >= 0) {
        ctx.fillRect(mid, barY, p1Px, barH);
      } else {
        ctx.fillRect(mid + p1Px, barY, -p1Px, barH);
      }

      // P2 bar (Orange)
      const p2Px = (p2 / maxP) * (barW / 2);
      ctx.fillStyle = '#EA580C';
      if (p2Px >= 0) {
        ctx.fillRect(mid, barY, p2Px, barH);
      } else {
        ctx.fillRect(mid + p2Px, barY, -p2Px, barH);
      }

      // Center tick
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(mid - 0.5, barY - 2, 1, barH + 4);
    }

    getRestitutionLabel() {
      if (this.params.e >= 0.99) return 'ชนแบบยืดหยุ่นสมบูรณ์ (Elastic)';
      if (this.params.e <= 0.01) return 'ชนแล้วติดไปด้วยกัน (Completely Inelastic)';
      return 'ชนแบบไม่ยืดหยุ่นทั่วไป (Inelastic)';
    }

    broadcastTelemetry() {
      if (!this.options.onTelemetryUpdate) return;

      const p1 = this.params.m1 * this.state.v1;
      const p2 = this.params.m2 * this.state.v2;
      const pTotal = p1 + p2;

      this.options.onTelemetryUpdate({
        simTime: this.state.simTime,
        v1: this.state.v1,
        v2: this.state.v2,
        p1: p1,
        p2: p2,
        pTotal: pTotal,
        impulse: this.state.impulse,
        peakForce: this.state.peakForce,
        contactForce: this.state.contactForce,
        keCurrent: this.state.keCurrent,
        keInitial: this.state.keInitial,
        keFinal: this.state.keFinal,
        keLoss: this.theoretical.keLoss,
        e: this.params.e,
        inCollision: this.state.inCollision,
        collisionCompleted: this.state.collisionCompleted,
        isPlaying: this.isPlaying
      });
    }

    destroy() {
      this.pause();
    }
  }

  return CollisionImpulseSimulator;
}));
