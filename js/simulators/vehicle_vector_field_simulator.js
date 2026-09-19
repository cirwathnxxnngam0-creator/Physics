/**
 * vehicle_vector_field_simulator.js - Interactive Racing Car Kinematics & Wind Vector Field Simulator
 * Part of PhysicsNoza 3.0 Architecture
 *
 * Simulates 2D straight-line and steered vehicle kinematics subjected to
 * ambient wind vector fields.
 *
 * Core Physical Quantities:
 *   - Position vector: \vec{r}(t)
 *   - Traveled path distance (Odometer): s = \int \|\vec{v}_{\text{car}}\| dt
 *   - Displacement vector: \Delta\vec{r} = \vec{r}(t) - \vec{r}(0)
 *   - Ground velocity: \vec{v}_{\text{car}}
 *   - Wind vector field: \vec{v}_{\text{wind}}(x, y)
 *   - Relative airspeed velocity: \vec{v}_{\text{rel}} = \vec{v}_{\text{car}} - \vec{v}_{\text{wind}}
 *   - Aerodynamic drag force: \vec{F}_d = -\frac{1}{2}\rho C_d A \|\vec{v}_{\text{rel}}\|\vec{v}_{\text{rel}}
 *   - Dynamic trajectory rerouting through user-placed waypoints
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VehicleVectorFieldSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class VehicleVectorFieldSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for VehicleVectorFieldSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Parameters
      this.params = {
        speed: 25.0,           // Car speed magnitude (m/s) [0..60]
        steerAngleDeg: 0.0,    // Manual steering angle (deg) [-45..+45]
        windSpeed: 15.0,       // Ambient wind speed (m/s) [0..30]
        windDirDeg: 90.0,      // Wind direction in deg (0 = +x, 90 = +y / North, etc.)
        windPattern: 'cross',  // 'cross', 'head', 'vortex', 'tail'
        carMass: 1200.0,       // kg
        dragCd: 0.32,          // Aerodynamic drag coeff
        frontalArea: 2.2,      // m^2
        airDensity: 1.225,     // kg/m^3
        autoRoute: false       // Auto-steer towards waypoints
      };

      // Submode: 'vehicle_kinematics' (default) | 'vector_field_divergence'
      this.subMode = 'vehicle_kinematics';

      // 2D Vector Field & Gauss Divergence Theorem Parameters
      this.divergenceParams = {
        fieldType: 'source', // 'source' | 'sink' | 'vortex' | 'saddle' | 'dipole' | 'custom'
        fieldStrength: 2.0,
        customA: 1.0,
        customB: 0.0,
        customC: 0.0,
        customD: 1.0,
        contourShape: 'circle', // 'circle' | 'rectangle'
        contourCenterX: 200.0,  // world meters (center of inspection loop)
        contourCenterY: 150.0,  // world meters
        contourRadius: 65.0,    // world meters
        contourWidth: 130.0,
        contourHeight: 90.0,
        showFieldGrid: true,
        showFluxArrows: true,
        showTracers: true
      };

      this.divergenceState = {
        boundaryFluxLHS: 0.0,
        areaDivergenceRHS: 0.0,
        discrepancyErrorPct: 0.0,
        localDivAtCenter: 0.0,
        localCurlAtCenter: 0.0,
        isDraggingContour: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        flowTracers: []
      };

      // State
      this.state = {
        x: 60.0,               // World x (m)
        y: 120.0,              // World y (m)
        heading: 0.0,          // Car heading angle in radians (0 = facing East/+x)
        odometer: 0.0,         // Traveled path length s (m)
        startX: 60.0,
        startY: 120.0,
        simTime: 0.0,
        trail: [],             // Array of past positions [{x, y}]
        waypoints: []          // Array of target waypoints [{x, y}]
      };

      // Playback
      this.isPlaying = false;
      this.animId = null;
      this.lastTimestamp = 0;
      this.windParticles = [];
      this.initWindParticles();
      this.initFlowTracers();

      // Setup Canvas & Event Listeners
      this.setupPointerEvents();
      this.resize();
    }

    initWindParticles() {
      this.windParticles = [];
      const count = 45;
      for (let i = 0; i < count; i++) {
        this.windParticles.push({
          x: Math.random() * 400,
          y: Math.random() * 300,
          age: Math.random() * 2.0,
          maxAge: 1.5 + Math.random() * 1.5
        });
      }
    }

    initFlowTracers() {
      if (!this.divergenceState) return;
      this.divergenceState.flowTracers = [];
      const count = 60;
      for (let i = 0; i < count; i++) {
        this.divergenceState.flowTracers.push({
          x: Math.random() * 380 + 10,
          y: Math.random() * 280 + 10,
          age: Math.random() * 2.5,
          maxAge: 1.8 + Math.random() * 1.6
        });
      }
    }

    /**
     * Set active submode: 'vehicle_kinematics' | 'vector_field_divergence'
     */
    setSubMode(submode) {
      if (['vehicle_kinematics', 'vector_field_divergence'].includes(submode)) {
        this.subMode = submode;
        if (submode === 'vector_field_divergence') {
          this.calculateDivergenceIntegrals();
        }
        this.render();
        this.broadcastTelemetry();
      }
    }

    /**
     * Compute 2D Vector Field F(x, y) = P(x, y) i + Q(x, y) j,
     * analytical divergence div = dP/dx + dQ/dy, and curl = dQ/dx - dP/dy
     */
    getFieldAt(x, y) {
      const p = this.divergenceParams;
      const c = p.fieldStrength || 2.0;
      const cx = p.contourCenterX || 200;
      const cy = p.contourCenterY || 150;
      const dx = x - cx;
      const dy = y - cy;

      let Fx = 0, Fy = 0, div = 0, curl = 0;

      if (p.fieldType === 'source') {
        // Radial Source: F = c*(x - cx) i + c*(y - cy) j => div = 2c, curl = 0
        Fx = c * dx * 0.4;
        Fy = c * dy * 0.4;
        div = 0.8 * c;
        curl = 0;
      } else if (p.fieldType === 'sink') {
        // Radial Sink: F = -c*(x - cx) i - c*(y - cy) j => div = -2c, curl = 0
        Fx = -c * dx * 0.4;
        Fy = -c * dy * 0.4;
        div = -0.8 * c;
        curl = 0;
      } else if (p.fieldType === 'vortex') {
        // Rigid-body vortex: F = -c*(y - cy) i + c*(x - cx) j => div = 0, curl = 2c
        Fx = -c * dy * 0.4;
        Fy = c * dx * 0.4;
        div = 0;
        curl = 0.8 * c;
      } else if (p.fieldType === 'saddle') {
        // Hyperbolic saddle: F = c*(x - cx) i - c*(y - cy) j => div = 0, curl = 0
        Fx = c * dx * 0.4;
        Fy = -c * dy * 0.4;
        div = 0;
        curl = 0;
      } else if (p.fieldType === 'dipole') {
        // Dipole: source at (cx - 50, cy), sink at (cx + 50, cy)
        const d = 45;
        const dx1 = x - (cx - d), dy1 = y - cy;
        const r1Sq = dx1 * dx1 + dy1 * dy1 + 120;
        const r1 = Math.sqrt(r1Sq);

        const dx2 = x - (cx + d), dy2 = y - cy;
        const r2Sq = dx2 * dx2 + dy2 * dy2 + 120;
        const r2 = Math.sqrt(r2Sq);

        Fx = (c * 650 * dx1) / (r1Sq * r1) - (c * 650 * dx2) / (r2Sq * r2);
        Fy = (c * 650 * dy1) / (r1Sq * r1) - (c * 650 * dy2) / (r2Sq * r2);
        div = (r1 < 35 ? 2.5 : 0) - (r2 < 35 ? 2.5 : 0);
        curl = 0;
      } else if (p.fieldType === 'custom') {
        const a = p.customA !== undefined ? p.customA : 1.0;
        const b = p.customB !== undefined ? p.customB : 0.0;
        const cVal = p.customC !== undefined ? p.customC : 0.0;
        const dVal = p.customD !== undefined ? p.customD : 1.0;
        Fx = (a * dx + b * dy) * 0.35;
        Fy = (cVal * dx + dVal * dy) * 0.35;
        div = (a + dVal) * 0.35;
        curl = (cVal - b) * 0.35;
      }

      const mag = Math.sqrt(Fx * Fx + Fy * Fy);
      return { Fx, Fy, mag, div, curl };
    }

    /**
     * Compute boundary flux LHS = \oint (F \cdot \hat{n}) ds
     * and volume divergence RHS = \iint (\nabla \cdot F) dA
     */
    calculateDivergenceIntegrals() {
      const p = this.divergenceParams;
      const shape = p.contourShape || 'circle';
      const cx0 = p.contourCenterX || 200;
      const cy0 = p.contourCenterY || 150;

      let boundaryFluxLHS = 0;
      let areaDivergenceRHS = 0;
      const fluxSamplePoints = [];

      if (shape === 'circle') {
        const R = Math.max(10, p.contourRadius || 65);
        const K = 128; // integration intervals
        const dTheta = (2 * Math.PI) / K;
        const ds = R * dTheta;

        for (let i = 0; i < K; i++) {
          const theta = i * dTheta;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);
          const bx = cx0 + R * cosT;
          const by = cy0 + R * sinT;
          const field = this.getFieldAt(bx, by);

          // Outward normal is (cosT, sinT)
          const normalFlux = field.Fx * cosT + field.Fy * sinT;
          boundaryFluxLHS += normalFlux * ds;

          if (i % (K / 16) === 0) {
            fluxSamplePoints.push({
              x: bx,
              y: by,
              nx: cosT,
              ny: sinT,
              flux: normalFlux
            });
          }
        }

        // Area Divergence Integral (RHS)
        const M = 48;
        const step = (2 * R) / M;
        const dA = step * step;
        const RSq = R * R;

        for (let ix = 0; ix < M; ix++) {
          const gx = cx0 - R + (ix + 0.5) * step;
          for (let iy = 0; iy < M; iy++) {
            const gy = cy0 - R + (iy + 0.5) * step;
            const distSq = (gx - cx0) * (gx - cx0) + (gy - cy0) * (gy - cy0);
            if (distSq <= RSq) {
              const field = this.getFieldAt(gx, gy);
              areaDivergenceRHS += field.div * dA;
            }
          }
        }
      } else {
        // Rectangle
        const W = Math.max(20, p.contourWidth || 130);
        const H = Math.max(20, p.contourHeight || 90);
        const halfW = W / 2;
        const halfH = H / 2;
        const x1 = cx0 - halfW, x2 = cx0 + halfW;
        const y1 = cy0 - halfH, y2 = cy0 + halfH;
        const K = 32;

        // Right edge
        const dyStep = H / K;
        for (let i = 0; i < K; i++) {
          const by = y1 + (i + 0.5) * dyStep;
          const f = this.getFieldAt(x2, by);
          boundaryFluxLHS += f.Fx * dyStep;
          if (i % 8 === 0) fluxSamplePoints.push({ x: x2, y: by, nx: 1, ny: 0, flux: f.Fx });
        }
        // Top edge
        const dxStep = W / K;
        for (let i = 0; i < K; i++) {
          const bx = x2 - (i + 0.5) * dxStep;
          const f = this.getFieldAt(bx, y2);
          boundaryFluxLHS += f.Fy * dxStep;
          if (i % 8 === 0) fluxSamplePoints.push({ x: bx, y: y2, nx: 0, ny: 1, flux: f.Fy });
        }
        // Left edge
        for (let i = 0; i < K; i++) {
          const by = y2 - (i + 0.5) * dyStep;
          const f = this.getFieldAt(x1, by);
          boundaryFluxLHS += (-f.Fx) * dyStep;
          if (i % 8 === 0) fluxSamplePoints.push({ x: x1, y: by, nx: -1, ny: 0, flux: -f.Fx });
        }
        // Bottom edge
        for (let i = 0; i < K; i++) {
          const bx = x1 + (i + 0.5) * dxStep;
          const f = this.getFieldAt(bx, y1);
          boundaryFluxLHS += (-f.Fy) * dxStep;
          if (i % 8 === 0) fluxSamplePoints.push({ x: bx, y: y1, nx: 0, ny: -1, flux: -f.Fy });
        }

        // Area Divergence
        const M = 40;
        const cellW = W / M;
        const cellH = H / M;
        const dA = cellW * cellH;
        for (let ix = 0; ix < M; ix++) {
          const gx = x1 + (ix + 0.5) * cellW;
          for (let iy = 0; iy < M; iy++) {
            const gy = y1 + (iy + 0.5) * cellH;
            const field = this.getFieldAt(gx, gy);
            areaDivergenceRHS += field.div * dA;
          }
        }
      }

      boundaryFluxLHS *= 0.1;
      areaDivergenceRHS *= 0.1;

      const denom = Math.max(0.5, (Math.abs(boundaryFluxLHS) + Math.abs(areaDivergenceRHS)) * 0.5);
      const discrepancyErrorPct = Math.min(100, (Math.abs(boundaryFluxLHS - areaDivergenceRHS) / denom) * 100);

      const centerField = this.getFieldAt(cx0, cy0);
      this.divergenceState.boundaryFluxLHS = boundaryFluxLHS;
      this.divergenceState.areaDivergenceRHS = areaDivergenceRHS;
      this.divergenceState.discrepancyErrorPct = discrepancyErrorPct;
      this.divergenceState.localDivAtCenter = centerField.div;
      this.divergenceState.localCurlAtCenter = centerField.curl;
      this.divergenceState.fluxSamplePoints = fluxSamplePoints;

      return { boundaryFluxLHS, areaDivergenceRHS, discrepancyErrorPct, fluxSamplePoints };
    }

    /**
     * Compute wind vector at world position (x, y)
     */
    getWindAt(x, y) {
      const spd = this.params.windSpeed;
      if (spd <= 0.001) return { vx: 0, vy: 0, mag: 0 };

      if (this.params.windPattern === 'vortex') {
        // Swirling vortex around track center (200, 150)
        const cx = 200, cy = 150;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1e-4;
        const factor = spd / Math.max(dist, 40);
        return {
          vx: -dy * factor,
          vy: dx * factor,
          mag: spd
        };
      } else if (this.params.windPattern === 'head') {
        // Headwind against car's current heading
        const h = this.state.heading;
        return {
          vx: -spd * Math.cos(h),
          vy: -spd * Math.sin(h),
          mag: spd
        };
      } else if (this.params.windPattern === 'tail') {
        // Tailwind with car's heading
        const h = this.state.heading;
        return {
          vx: spd * Math.cos(h),
          vy: spd * Math.sin(h),
          mag: spd
        };
      } else {
        // Uniform Crosswind / Directed wind
        const rad = (this.params.windDirDeg * Math.PI) / 180.0;
        return {
          vx: spd * Math.cos(rad),
          vy: spd * Math.sin(rad),
          mag: spd
        };
      }
    }

    /**
     * Setup user interaction (clicking to add waypoints or dragging car)
     */
    setupPointerEvents() {
      let isDraggingCar = false;

      const getCanvasCoords = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const w = this.width || rect.width || 400;
        const h = this.height || rect.height || 300;
        const scaleX = w / rect.width;
        const scaleY = h / rect.height;
        const px = (clientX - rect.left) * scaleX;
        const py = (clientY - rect.top) * scaleY;
        return this.canvasToWorld(px, py);
      };

      const handleDown = (e) => {
        const pos = getCanvasCoords(e);

        if (this.subMode === 'vector_field_divergence') {
          const c = this.divergenceParams;
          const distToCenter = Math.hypot(pos.x - c.contourCenterX, pos.y - c.contourCenterY);
          const maxRadius = c.contourShape === 'circle' ? c.contourRadius + 15 : Math.max(c.contourWidth, c.contourHeight) * 0.6;
          if (distToCenter <= maxRadius) {
            this.divergenceState.isDraggingContour = true;
            this.divergenceState.dragOffsetX = pos.x - c.contourCenterX;
            this.divergenceState.dragOffsetY = pos.y - c.contourCenterY;
          } else {
            // Click outside relocates contour center
            this.divergenceParams.contourCenterX = Math.max(40, Math.min(360, pos.x));
            this.divergenceParams.contourCenterY = Math.max(40, Math.min(260, pos.y));
            this.render();
            this.broadcastTelemetry();
          }
          return;
        }

        const dx = pos.x - this.state.x;
        const dy = pos.y - this.state.y;
        if (Math.sqrt(dx * dx + dy * dy) < 18) {
          isDraggingCar = true;
        } else {
          // Add waypoint on click
          this.addWaypoint(pos.x, pos.y);
        }
      };

      const handleMove = (e) => {
        if (this.subMode === 'vector_field_divergence') {
          if (!this.divergenceState.isDraggingContour) return;
          const pos = getCanvasCoords(e);
          this.divergenceParams.contourCenterX = Math.max(40, Math.min(360, pos.x - this.divergenceState.dragOffsetX));
          this.divergenceParams.contourCenterY = Math.max(40, Math.min(260, pos.y - this.divergenceState.dragOffsetY));
          this.render();
          this.broadcastTelemetry();
          return;
        }

        if (!isDraggingCar) return;
        const pos = getCanvasCoords(e);
        this.state.x = Math.max(10, Math.min(390, pos.x));
        this.state.y = Math.max(10, Math.min(290, pos.y));
        this.render();
        this.broadcastTelemetry();
      };

      const handleUp = () => {
        isDraggingCar = false;
        if (this.divergenceState) {
          this.divergenceState.isDraggingContour = false;
        }
      };

      this.canvas.addEventListener('mousedown', handleDown);
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);

      this.canvas.addEventListener('touchstart', handleDown, { passive: true });
      window.addEventListener('touchmove', handleMove, { passive: true });
      window.addEventListener('touchend', handleUp);
    }

    worldToCanvas(wx, wy) {
      const w = this.width || 400;
      const h = this.height || 300;
      const scale = Math.min(w / 400, h / 300);
      const ox = (w - 400 * scale) / 2;
      const oy = (h - 300 * scale) / 2;
      return {
        cx: ox + wx * scale,
        cy: oy + wy * scale,
        scale
      };
    }

    canvasToWorld(cx, cy) {
      const w = this.width || 400;
      const h = this.height || 300;
      const scale = Math.min(w / 400, h / 300);
      const ox = (w - 400 * scale) / 2;
      const oy = (h - 300 * scale) / 2;
      return {
        x: (cx - ox) / scale,
        y: (cy - oy) / scale
      };
    }

    addWaypoint(x, y) {
      this.state.waypoints.push({ x, y });
      this.params.autoRoute = true;
      this.render();
      this.broadcastTelemetry();
    }

    clearWaypoints() {
      this.state.waypoints = [];
      this.params.autoRoute = false;
      this.render();
      this.broadcastTelemetry();
    }

    resize() {
      const parentW = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 0;
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      const width = parentW > 0 ? parentW : Math.max(rect.width || 400, 320);
      const height = Math.max(rect.height || 300, 240);

      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.canvas.style.width = '100%';
      this.canvas.style.maxWidth = '100%';
      this.canvas.style.height = 'auto';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.width = width;
      this.height = height;
      this.dpr = dpr;
      this.render();
    }

    setParams(newParams) {
      Object.assign(this.params, newParams);
      this.render();
      this.broadcastTelemetry();
    }

    setDivergenceParams(newParams) {
      Object.assign(this.divergenceParams, newParams);
      this.calculateDivergenceIntegrals();
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

    step(dt = 0.05) {
      this.pause();
      this.updatePhysics(dt);
      this.render();
      this.broadcastTelemetry();
    }

    reset() {
      this.pause();
      this.state.x = 60.0;
      this.state.y = 120.0;
      this.state.startX = 60.0;
      this.state.startY = 120.0;
      this.state.heading = 0.0;
      this.state.odometer = 0.0;
      this.state.simTime = 0.0;
      this.state.trail = [];
      this.state.waypoints = [];
      this.initWindParticles();
      this.render();
      this.broadcastTelemetry();
    }

    updatePhysics(dt) {
      this.state.simTime += dt;

      if (this.subMode === 'vector_field_divergence') {
        this.calculateDivergenceIntegrals();
        const tracers = this.divergenceState.flowTracers || [];
        tracers.forEach(t => {
          const f = this.getFieldAt(t.x, t.y);
          // RK2 advection
          const k1x = f.Fx * dt * 0.8;
          const k1y = f.Fy * dt * 0.8;
          const fMid = this.getFieldAt(t.x + 0.5 * k1x, t.y + 0.5 * k1y);
          t.x += fMid.Fx * dt * 0.8;
          t.y += fMid.Fy * dt * 0.8;
          t.age += dt;

          if (t.age > t.maxAge || t.x < 5 || t.x > 395 || t.y < 5 || t.y > 295) {
            t.x = Math.random() * 380 + 10;
            t.y = Math.random() * 280 + 10;
            t.age = 0;
          }
        });
        return;
      }

      const vCar = this.params.speed;

      // Steering logic
      if (this.params.autoRoute && this.state.waypoints.length > 0) {
        const target = this.state.waypoints[0];
        const dx = target.x - this.state.x;
        const dy = target.y - this.state.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 12.0) {
          // Reached waypoint
          this.state.waypoints.shift();
          if (this.state.waypoints.length === 0) {
            this.params.autoRoute = false;
          }
        } else {
          // Calculate target steering angle
          let targetAngle = Math.atan2(dy, dx);
          let angleDiff = targetAngle - this.state.heading;
          // Normalize to [-pi, pi]
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

          const turnRate = 2.4; // rad/s max turning rate
          const maxTurn = turnRate * dt;
          const turn = Math.max(-maxTurn, Math.min(maxTurn, angleDiff));
          this.state.heading += turn;
        }
      } else {
        // Manual steering input
        const steerRad = (this.params.steerAngleDeg * Math.PI) / 180.0;
        const turnRate = (vCar / 10.0) * Math.sin(steerRad);
        this.state.heading += turnRate * dt;
      }

      // Normalized heading
      while (this.state.heading > Math.PI) this.state.heading -= 2 * Math.PI;
      while (this.state.heading < -Math.PI) this.state.heading += 2 * Math.PI;

      // Ground velocity
      const vxCar = vCar * Math.cos(this.state.heading);
      const vyCar = vCar * Math.sin(this.state.heading);

      // Advance car position
      this.state.x += vxCar * dt;
      this.state.y += vyCar * dt;

      // Wrap-around bounds with margin
      if (this.state.x > 390) this.state.x = 10;
      if (this.state.x < 10) this.state.x = 390;
      if (this.state.y > 290) this.state.y = 10;
      if (this.state.y < 10) this.state.y = 290;

      // Update traveled distance s
      this.state.odometer += vCar * dt;

      // Record trail
      if (this.state.trail.length === 0 ||
          Math.hypot(this.state.x - this.state.trail[this.state.trail.length - 1].x,
                     this.state.y - this.state.trail[this.state.trail.length - 1].y) > 3.0) {
        this.state.trail.push({ x: this.state.x, y: this.state.y });
        if (this.state.trail.length > 250) this.state.trail.shift();
      }

      // Update wind particles animation
      this.windParticles.forEach(p => {
        const w = this.getWindAt(p.x, p.y);
        p.x += w.vx * dt * 0.8;
        p.y += w.vy * dt * 0.8;
        p.age += dt;
        if (p.age > p.maxAge || p.x < 0 || p.x > 400 || p.y < 0 || p.y > 300) {
          p.x = Math.random() * 400;
          p.y = Math.random() * 300;
          p.age = 0;
        }
      });
    }

    render() {
      const ctx = this.ctx;
      const w = this.width || 400;
      const h = this.height || 300;

      if (this.subMode === 'vector_field_divergence') {
        this.renderDivergenceTheorem(ctx, w, h);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Background track surface
      ctx.fillStyle = '#0F172A'; // Slate dark track background
      ctx.fillRect(0, 0, w, h);

      // Grid Lines
      const { scale } = this.worldToCanvas(0, 0);
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 400; x += 40) {
        const p1 = this.worldToCanvas(x, 0);
        const p2 = this.worldToCanvas(x, 300);
        ctx.beginPath();
        ctx.moveTo(p1.cx, p1.cy);
        ctx.lineTo(p2.cx, p2.cy);
        ctx.stroke();
      }
      for (let y = 0; y <= 300; y += 30) {
        const p1 = this.worldToCanvas(0, y);
        const p2 = this.worldToCanvas(400, y);
        ctx.beginPath();
        ctx.moveTo(p1.cx, p1.cy);
        ctx.lineTo(p2.cx, p2.cy);
        ctx.stroke();
      }

      // Render Wind Vector Field Arrows
      const gridStep = 40;
      for (let wx = 20; wx < 400; wx += gridStep) {
        for (let wy = 20; wy < 300; wy += gridStep) {
          const wind = this.getWindAt(wx, wy);
          const p = this.worldToCanvas(wx, wy);
          if (wind.mag > 0.5) {
            const arrowLen = Math.min(18, (wind.mag / 30.0) * 22) * scale;
            const angle = Math.atan2(wind.vy, wind.vx);
            const endX = p.cx + arrowLen * Math.cos(angle);
            const endY = p.cy + arrowLen * Math.sin(angle);

            ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'; // Sky blue
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(p.cx, p.cy);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Arrow head
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.beginPath();
            ctx.arc(endX, endY, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Render flowing wind particle streaks
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
      ctx.lineWidth = 1;
      this.windParticles.forEach(p => {
        const cp = this.worldToCanvas(p.x, p.y);
        const w = this.getWindAt(p.x, p.y);
        const len = Math.min(12, w.mag * 0.6) * scale;
        const ang = Math.atan2(w.vy, w.vx);
        ctx.beginPath();
        ctx.moveTo(cp.cx, cp.cy);
        ctx.lineTo(cp.cx + len * Math.cos(ang), cp.cy + len * Math.sin(ang));
        ctx.stroke();
      });

      // Render Waypoints & Planned Route
      if (this.state.waypoints.length > 0) {
        ctx.strokeStyle = '#F59E0B'; // Amber dashed route
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        const carPt = this.worldToCanvas(this.state.x, this.state.y);
        ctx.moveTo(carPt.cx, carPt.cy);
        this.state.waypoints.forEach(wp => {
          const cpt = this.worldToCanvas(wp.x, wp.y);
          ctx.lineTo(cpt.cx, cpt.cy);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Waypoint Flags / Circles
        this.state.waypoints.forEach((wp, idx) => {
          const cpt = this.worldToCanvas(wp.x, wp.y);
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(cpt.cx, cpt.cy, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((idx + 1).toString(), cpt.cx, cpt.cy - 12);
        });
      }

      // Render Traveled Path (Odometer curve s)
      if (this.state.trail.length > 1) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)'; // Emerald green trail
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const first = this.worldToCanvas(this.state.trail[0].x, this.state.trail[0].y);
        ctx.moveTo(first.cx, first.cy);
        for (let i = 1; i < this.state.trail.length; i++) {
          const pt = this.worldToCanvas(this.state.trail[i].x, this.state.trail[i].y);
          ctx.lineTo(pt.cx, pt.cy);
        }
        ctx.stroke();
      }

      // Render Displacement Vector \Delta\vec{r} from Start to Current
      const startPt = this.worldToCanvas(this.state.startX, this.state.startY);
      const currPt = this.worldToCanvas(this.state.x, this.state.y);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)'; // Purple displacement
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startPt.cx, startPt.cy);
      ctx.lineTo(currPt.cx, currPt.cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Start position marker
      ctx.fillStyle = '#A855F7';
      ctx.beginPath();
      ctx.arc(startPt.cx, startPt.cy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#C084FC';
      ctx.font = '10px sans-serif';
      ctx.fillText('จุดเริ่ม r(0)', startPt.cx + 6, startPt.cy - 6);

      // Render Racing Car
      this.renderCar(currPt.cx, currPt.cy, this.state.heading, scale);

      // Render Dynamic Vectors at Car Position
      this.renderCarVectors(currPt.cx, currPt.cy, scale);
    }

    renderCar(cx, cy, heading, scale) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(heading);

      const length = 24 * scale;
      const width = 12 * scale;

      // Car shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(-length / 2 + 2, -width / 2 + 2, length, width);

      // Car body (Sporty Red/Orange Racing Chassis)
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.roundRect(-length / 2, -width / 2, length, width, 4 * scale);
      ctx.fill();
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Cockpit / Windshield
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.roundRect(-length * 0.1, -width * 0.35, length * 0.4, width * 0.7, 2 * scale);
      ctx.fill();

      // Front Wheels
      const steerRad = (this.params.steerAngleDeg * Math.PI) / 180.0;
      ctx.fillStyle = '#334155';
      [-width / 2 - 1, width / 2 - 3].forEach(wheelY => {
        ctx.save();
        ctx.translate(length * 0.3, wheelY);
        ctx.rotate(steerRad);
        ctx.fillRect(-3 * scale, 0, 6 * scale, 3 * scale);
        ctx.restore();
      });

      // Rear Wheels
      [-width / 2 - 1, width / 2 - 3].forEach(wheelY => {
        ctx.fillRect(-length * 0.35, wheelY, 6 * scale, 3 * scale);
      });

      // Headlights
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(length / 2 - 2, -width / 2 + 1, 2, 2.5);
      ctx.fillRect(length / 2 - 2, width / 2 - 3.5, 2, 2.5);

      ctx.restore();
    }

    renderCarVectors(cx, cy, scale) {
      const ctx = this.ctx;
      const vCar = this.params.speed;
      const wind = this.getWindAt(this.state.x, this.state.y);

      // Car velocity vector \vec{v}_{\text{car}}
      const vxCar = vCar * Math.cos(this.state.heading);
      const vyCar = vCar * Math.sin(this.state.heading);

      // Relative airspeed velocity: \vec{v}_{\text{rel}} = \vec{v}_{\text{car}} - \vec{v}_{\text{wind}}
      const vxRel = vxCar - wind.vx;
      const vyRel = vyCar - wind.vy;
      const vRelMag = Math.sqrt(vxRel * vxRel + vyRel * vyRel);

      const drawArrow = (fromX, fromY, vecX, vecY, color, label, maxLen = 40) => {
        const mag = Math.sqrt(vecX * vecX + vecY * vecY);
        if (mag < 0.1) return;
        const normX = vecX / mag;
        const normY = vecY / mag;
        const len = Math.min(maxLen, mag * 1.4) * scale;
        const toX = fromX + normX * len;
        const toY = fromY + normY * len;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Arrow tip
        const headLen = 6 * scale;
        const angle = Math.atan2(normY, normX);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(label, toX + normX * 8, toY + normY * 8);
      };

      // 1. Car Velocity (Green)
      drawArrow(cx, cy, vxCar, vyCar, '#10B981', 'v_car', 45);

      // 2. Wind Velocity (Sky Blue)
      drawArrow(cx, cy, wind.vx, wind.vy, '#38BDF8', 'v_wind', 40);

      // 3. Relative Velocity (Amber)
      drawArrow(cx, cy, vxRel, vyRel, '#F59E0B', 'v_rel', 45);

      // 4. Aerodynamic Drag Force (Rose / Red)
      if (vRelMag > 0.5) {
        drawArrow(cx, cy, -vxRel, -vyRel, '#F43F5E', 'F_drag', 35);
      }
    }

    renderDivergenceTheorem(ctx, w, h) {
      const p = this.divergenceParams;
      const { scale } = this.worldToCanvas(0, 0);

      // 1. Dark Slate background
      ctx.fillStyle = '#0B1120';
      ctx.fillRect(0, 0, w, h);

      // 2. Coordinate Grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 400; x += 40) {
        const p1 = this.worldToCanvas(x, 0);
        const p2 = this.worldToCanvas(x, 300);
        ctx.beginPath();
        ctx.moveTo(p1.cx, p1.cy);
        ctx.lineTo(p2.cx, p2.cy);
        ctx.stroke();
      }
      for (let y = 0; y <= 300; y += 30) {
        const p1 = this.worldToCanvas(0, y);
        const p2 = this.worldToCanvas(400, y);
        ctx.beginPath();
        ctx.moveTo(p1.cx, p1.cy);
        ctx.lineTo(p2.cx, p2.cy);
        ctx.stroke();
      }

      // 3. Render 2D Vector Field Arrows
      if (p.showFieldGrid) {
        const step = 25;
        for (let wx = 15; wx <= 385; wx += step) {
          for (let wy = 15; wy <= 285; wy += step) {
            const f = this.getFieldAt(wx, wy);
            const cp = this.worldToCanvas(wx, wy);

            if (f.mag > 0.04) {
              const arrowLen = Math.min(22, Math.max(5, (f.mag / 3.0) * 18)) * scale;
              const angle = Math.atan2(f.Fy, f.Fx);
              const endX = cp.cx + arrowLen * Math.cos(angle);
              const endY = cp.cy + arrowLen * Math.sin(angle);

              let strokeColor = 'rgba(56, 189, 248, 0.45)';
              if (f.div > 0.15) strokeColor = 'rgba(16, 185, 129, 0.6)';
              else if (f.div < -0.15) strokeColor = 'rgba(244, 63, 94, 0.6)';
              else if (Math.abs(f.curl) > 0.15) strokeColor = 'rgba(168, 85, 247, 0.6)';

              ctx.strokeStyle = strokeColor;
              ctx.lineWidth = 1.3;
              ctx.beginPath();
              ctx.moveTo(cp.cx, cp.cy);
              ctx.lineTo(endX, endY);
              ctx.stroke();

              const headLen = 4 * scale;
              ctx.beginPath();
              ctx.moveTo(endX, endY);
              ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
              ctx.moveTo(endX, endY);
              ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
              ctx.stroke();
            }
          }
        }
      }

      // 4. Flow Tracers (Advecting Fluid Particles)
      if (p.showTracers) {
        const tracers = this.divergenceState.flowTracers || [];
        tracers.forEach(t => {
          const cp = this.worldToCanvas(t.x, t.y);
          const alpha = Math.sin((t.age / t.maxAge) * Math.PI);
          ctx.fillStyle = `rgba(56, 189, 248, ${Math.max(0.1, alpha * 0.75)})`;
          ctx.beginPath();
          ctx.arc(cp.cx, cp.cy, 2.5 * scale, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 5. Draw Inspection Boundary Contour \partial D
      const cCenter = this.worldToCanvas(p.contourCenterX, p.contourCenterY);
      const isCircle = p.contourShape === 'circle';

      ctx.save();
      if (isCircle) {
        const radiusPx = p.contourRadius * scale;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.beginPath();
        ctx.arc(cCenter.cx, cCenter.cy, radiusPx, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        const halfWPx = (p.contourWidth / 2) * scale;
        const halfHPx = (p.contourHeight / 2) * scale;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.fillRect(cCenter.cx - halfWPx, cCenter.cy - halfHPx, halfWPx * 2, halfHPx * 2);

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(cCenter.cx - halfWPx, cCenter.cy - halfHPx, halfWPx * 2, halfHPx * 2);
        ctx.setLineDash([]);
      }

      // Center Draggable Handle
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cCenter.cx, cCenter.cy, 6 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ลากเพื่อย้ายขอบเขต (Drag Contour)', cCenter.cx, cCenter.cy - 12);
      ctx.restore();

      // 6. Draw Normal Flux Arrows along \partial D
      if (p.showFluxArrows && this.divergenceState.fluxSamplePoints) {
        ctx.save();
        this.divergenceState.fluxSamplePoints.forEach(sp => {
          const cp = this.worldToCanvas(sp.x, sp.y);
          const fluxMag = Math.abs(sp.flux);
          const arrowLen = Math.min(26, Math.max(8, fluxMag * 4.5)) * scale;

          const isOutward = sp.flux >= 0;
          const dirX = isOutward ? sp.nx : -sp.nx;
          const dirY = isOutward ? sp.ny : -sp.ny;

          const toX = cp.cx + dirX * arrowLen;
          const toY = cp.cy + dirY * arrowLen;
          const color = isOutward ? '#10B981' : '#EF4444';

          ctx.strokeStyle = color;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(cp.cx, cp.cy);
          ctx.lineTo(toX, toY);
          ctx.stroke();

          const angle = Math.atan2(toY - cp.cy, toX - cp.cx);
          const headLen = 5 * scale;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(toX, toY);
          ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }

      // 7. Floating Gauss Divergence Theorem Telemetry Card
      ctx.save();
      const cardW = Math.min(320, w - 30);
      const cardH = 118;
      const cardX = 15;
      const cardY = 15;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📐 ทฤษฎีบทการลู่ออกของเกาส์ (Divergence Theorem)', cardX + 12, cardY + 20);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('∮_∂D (F · n̂) ds ≡ ∬_D (∇ · F) dA', cardX + 12, cardY + 36);

      const lhs = this.divergenceState.boundaryFluxLHS || 0;
      ctx.fillStyle = lhs >= 0 ? '#10B981' : '#EF4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`LHS (ฟลักซ์ขอบเขต ∮): ${lhs >= 0 ? '+' : ''}${lhs.toFixed(2)} Wb`, cardX + 12, cardY + 56);

      const rhs = this.divergenceState.areaDivergenceRHS || 0;
      ctx.fillStyle = rhs >= 0 ? '#10B981' : '#EF4444';
      ctx.fillText(`RHS (อินทิกรัลพื้นที่ ∬): ${rhs >= 0 ? '+' : ''}${rhs.toFixed(2)} Wb`, cardX + 12, cardY + 74);

      const err = this.divergenceState.discrepancyErrorPct || 0;
      ctx.fillStyle = err < 2.0 ? '#10B981' : '#F59E0B';
      ctx.font = 'bold 10px Inter, sans-serif';
      const statusText = err < 2.0 ? '✅ ตรงกันสมบูรณ์แบบ (Exact Match)' : '⚠️ อยู่ในเกณฑ์คลาดเคลื่อนจากการปัดเศษ';
      ctx.fillText(`ความคลาดเคลื่อน: ${err.toFixed(3)}% | ${statusText}`, cardX + 12, cardY + 92);

      const divC = this.divergenceState.localDivAtCenter || 0;
      const curlC = this.divergenceState.localCurlAtCenter || 0;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9.5px monospace';
      ctx.fillText(`ที่ศูนย์กลาง: ∇·F = ${divC.toFixed(2)} | (∇×F)_z = ${curlC.toFixed(2)}`, cardX + 12, cardY + 108);
      ctx.restore();
    }

    broadcastTelemetry() {
      if (!this.options.onTelemetryUpdate) return;

      if (this.subMode === 'vector_field_divergence') {
        this.options.onTelemetryUpdate({
          subMode: this.subMode,
          submode: this.subMode,
          fieldType: this.divergenceParams.fieldType,
          boundaryFluxLHS: this.divergenceState.boundaryFluxLHS,
          areaDivergenceRHS: this.divergenceState.areaDivergenceRHS,
          discrepancyErrorPct: this.divergenceState.discrepancyErrorPct,
          localDivAtCenter: this.divergenceState.localDivAtCenter,
          localCurlAtCenter: this.divergenceState.localCurlAtCenter,
          contourShape: this.divergenceParams.contourShape,
          contourCenterX: this.divergenceParams.contourCenterX,
          contourCenterY: this.divergenceParams.contourCenterY,
          isPlaying: this.isPlaying
        });
        return;
      }

      const vCar = this.params.speed;
      const wind = this.getWindAt(this.state.x, this.state.y);
      const vxCar = vCar * Math.cos(this.state.heading);
      const vyCar = vCar * Math.sin(this.state.heading);
      const vxRel = vxCar - wind.vx;
      const vyRel = vyCar - wind.vy;
      const vRelMag = Math.sqrt(vxRel * vxRel + vyRel * vyRel);

      const dx = this.state.x - this.state.startX;
      const dy = this.state.y - this.state.startY;
      const displacement = Math.sqrt(dx * dx + dy * dy);

      const dragMag = 0.5 * this.params.airDensity * this.params.dragCd * this.params.frontalArea * (vRelMag * vRelMag);
      const steerRad = (this.params.steerAngleDeg * Math.PI) / 180.0;
      const lateralAcc = (vCar * vCar) * Math.sin(Math.abs(steerRad)) / 10.0;

      this.options.onTelemetryUpdate({
        subMode: this.subMode,
        submode: this.subMode,
        simTime: this.state.simTime,
        odometer: this.state.odometer,
        displacement: displacement,
        vCar: vCar,
        vWind: wind.mag,
        vRel: vRelMag,
        dragForce: dragMag,
        headingDeg: ((this.state.heading * 180.0) / Math.PI + 360) % 360,
        lateralAcc: lateralAcc,
        waypointsCount: this.state.waypoints.length,
        isPlaying: this.isPlaying
      });
    }

    destroy() {
      this.pause();
    }
  }

  return VehicleVectorFieldSimulator;
}));
