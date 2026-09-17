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
        if (!isDraggingCar) return;
        const pos = getCanvasCoords(e);
        this.state.x = Math.max(10, Math.min(390, pos.x));
        this.state.y = Math.max(10, Math.min(290, pos.y));
        this.render();
        this.broadcastTelemetry();
      };

      const handleUp = () => {
        isDraggingCar = false;
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

    broadcastTelemetry() {
      if (!this.options.onTelemetryUpdate) return;

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
