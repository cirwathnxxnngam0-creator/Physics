/**
 * threejs_ballistics_simulator.js - 3D Ballistics & Aerodynamic Crosswind Simulator
 * Built using local Three.js (no CDN dependency)
 *
 * Simulates 3D projectile trajectory with 4th-Order Runge-Kutta (RK4) integration
 * under gravity and 3D quadratic aerodynamic drag relative to crosswind vector:
 *   d r / dt = v
 *   d v / dt = g - (c / m) * ||v - w|| * (v - w)
 * where w = (wx, 0, wz) is the atmospheric wind vector.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ThreejsBallisticsSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function getTHREE() {
    if (typeof window !== 'undefined' && window.THREE) return window.THREE;
    if (typeof global !== 'undefined' && global.THREE) return global.THREE;
    return null;
  }

  function ThreejsBallisticsSimulator(canvasElement, options) {
    this.canvas = canvasElement;
    this.options = options || {};

    const THREE = getTHREE();
    if (!THREE) {
      console.error('Three.js is not loaded! Please include vendor/three/three.min.js before threejs_ballistics_simulator.js');
      return;
    }

    // Physics parameters
    this.params = {
      v0: 80.0,            // Initial speed (m/s)
      elevationDeg: 45.0,  // Launch pitch angle (deg)
      azimuthDeg: 0.0,     // Launch yaw angle (deg, 0 = along +X axis)
      m: 5.0,              // Mass (kg)
      c: 0.04,             // Lumped quadratic drag factor (kg/m)
      g: 9.80665,          // Gravity (m/s^2)
      windSpeed: 15.0,     // Crosswind speed (m/s)
      windAzimuthDeg: 90.0,// Wind direction (deg, 90 = along +Z axis, pure crosswind)
      dt: 0.02             // Timestep (s)
    };

    if (this.options.params) {
      Object.assign(this.params, this.options.params);
    }

    // Callbacks
    this.onTelemetry = this.options.onTelemetry || null;
    this.onStatusChange = this.options.onStatusChange || null;

    // Simulation states
    this.isPlaying = false;
    this.simTime = 0.0;
    this.fullTrajectory = [];
    this.currentPointIndex = 0;
    this.maxLandingDistance = 0;

    // Three.js instances
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.projectileMesh = null;
    this.shadowMesh = null;
    this.trajectoryLine = null;
    this.fullGhostLine = null;
    this.cannonGroup = null;
    this.barrelPivot = null;
    this.windArrowsGroup = null;
    this.targetMarker = null;

    // Camera orbit controls state
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.cameraSpherical = {
      radius: 200,
      theta: 0.6,          // Azimuthal angle around Y
      phi: 1.1             // Polar angle from +Y
    };
    this.cameraTarget = new THREE.Vector3(70, 10, 0);

    // Animation frame handle
    this.animationFrameId = null;

    this._init();
  }

  ThreejsBallisticsSimulator.prototype._init = function () {
    const THREE = getTHREE();
    if (!THREE) return;

    const width = this.canvas.clientWidth || 800;
    const height = this.canvas.clientHeight || 500;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0A0F1D); // Deep dark navy slate

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 3000);
    this._updateCameraPosition();

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.4);
    sunLight.position.set(120, 250, 100);
    this.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38BDF8, 0.6);
    rimLight.position.set(-100, 80, -120);
    this.scene.add(rimLight);

    // 5. Ground Grid & Launch Pad
    this._buildGround();

    // 6. Cannon / Launcher Mesh
    this._buildCannon();

    // 7. Projectile Mesh
    this._buildProjectile();

    // 8. Trajectory Lines
    this._buildTrajectoryObjects();

    // 9. Wind Vectors Visualizer
    this._buildWindIndicators();

    // 10. Mouse / Touch Controls
    this._bindControls();

    // Compute initial physics trajectory
    this.recomputeTrajectory();

    // Animation callback binding
    this._animate = this._animate.bind(this);
    this.render();
  };

  ThreejsBallisticsSimulator.prototype._updateCameraPosition = function () {
    const THREE = getTHREE();
    if (!THREE || !this.camera) return;

    const r = this.cameraSpherical.radius;
    const phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.05, this.cameraSpherical.phi));
    const theta = this.cameraSpherical.theta;

    const x = this.cameraTarget.x + r * Math.sin(phi) * Math.cos(theta);
    const y = this.cameraTarget.y + r * Math.cos(phi);
    const z = this.cameraTarget.z + r * Math.sin(phi) * Math.sin(theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.cameraTarget);
  };

  ThreejsBallisticsSimulator.prototype._buildGround = function () {
    const THREE = getTHREE();

    // 3D Ground Grid (450m x 450m with 45 subdivisions = 10m per box)
    const gridHelper = new THREE.GridHelper(450, 45, 0x0284C7, 0x1E293B);
    gridHelper.position.set(120, 0, 0);
    this.scene.add(gridHelper);

    // Dark backdrop plane
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.95,
      metalness: 0.05
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(120, -0.1, 0);
    this.scene.add(groundMesh);

    // Launch Pad
    const padGeo = new THREE.CylinderGeometry(5, 6, 0.4, 32);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.6 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(0, 0.2, 0);
    this.scene.add(pad);

    // Target Landing Marker Group
    this.targetMarker = new THREE.Group();
    const ringGeo1 = new THREE.RingGeometry(2.5, 3.5, 32);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x10B981, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.08;
    this.targetMarker.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(7.0, 8.0, 32);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x059669, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.08;
    this.targetMarker.add(ring2);

    this.scene.add(this.targetMarker);
  };

  ThreejsBallisticsSimulator.prototype._buildCannon = function () {
    const THREE = getTHREE();
    this.cannonGroup = new THREE.Group();

    // Base turret
    const baseGeo = new THREE.CylinderGeometry(2, 2.8, 1.2, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.6;
    this.cannonGroup.add(base);

    // Barrel Pivot
    this.barrelPivot = new THREE.Group();
    this.barrelPivot.position.set(0, 1.2, 0);

    const barrelGeo = new THREE.CylinderGeometry(0.75, 1.05, 6.5, 24);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0xEA580C, metalness: 0.6, roughness: 0.2 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.y = 3.25;
    this.barrelPivot.add(barrel);

    // Barrel Muzzle Ring
    const muzzleGeo = new THREE.TorusGeometry(0.85, 0.15, 16, 32);
    const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xF97316, metalness: 0.8 });
    const muzzle = new THREE.Mesh(muzzleGeo, muzzleMat);
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.y = 6.5;
    this.barrelPivot.add(muzzle);

    this.cannonGroup.add(this.barrelPivot);
    this.scene.add(this.cannonGroup);

    this._updateCannonOrientation();
  };

  ThreejsBallisticsSimulator.prototype._updateCannonOrientation = function () {
    if (!this.cannonGroup || !this.barrelPivot) return;
    const elevRad = (this.params.elevationDeg * Math.PI) / 180;
    const azimRad = (this.params.azimuthDeg * Math.PI) / 180;

    this.cannonGroup.rotation.y = -azimRad;
    this.barrelPivot.rotation.z = -(Math.PI / 2 - elevRad);
  };

  ThreejsBallisticsSimulator.prototype._buildProjectile = function () {
    const THREE = getTHREE();

    const sphereGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xFB923C,
      emissive: 0xEA580C,
      emissiveIntensity: 0.45,
      metalness: 0.6,
      roughness: 0.2
    });
    this.projectileMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this.projectileMesh.position.set(0, 0, 0);
    this.scene.add(this.projectileMesh);

    // Ground Shadow projection circle
    const shadowGeo = new THREE.CircleGeometry(1.2, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = 0.05;
    this.scene.add(this.shadowMesh);
  };

  ThreejsBallisticsSimulator.prototype._buildTrajectoryObjects = function () {
    const THREE = getTHREE();
    const maxPoints = 2500;

    // 1. Dynamic active flight line (Bright Cyan)
    const activePositions = new Float32Array(maxPoints * 3);
    const activeGeo = new THREE.BufferGeometry();
    activeGeo.setAttribute('position', new THREE.BufferAttribute(activePositions, 3));
    activeGeo.setDrawRange(0, 0);

    const activeMat = new THREE.LineBasicMaterial({
      color: 0x38BDF8,
      linewidth: 3
    });
    this.trajectoryLine = new THREE.Line(activeGeo, activeMat);
    this.scene.add(this.trajectoryLine);

    // 2. Full theoretical path ghost line (Slate / Dim Cyan)
    const fullPositions = new Float32Array(maxPoints * 3);
    const fullGeo = new THREE.BufferGeometry();
    fullGeo.setAttribute('position', new THREE.BufferAttribute(fullPositions, 3));

    const fullMat = new THREE.LineBasicMaterial({
      color: 0x64748B,
      transparent: true,
      opacity: 0.4
    });
    this.fullGhostLine = new THREE.Line(fullGeo, fullMat);
    this.scene.add(this.fullGhostLine);
  };

  ThreejsBallisticsSimulator.prototype._buildWindIndicators = function () {
    const THREE = getTHREE();
    this.windArrowsGroup = new THREE.Group();

    const numArrows = 7;
    for (let i = 0; i < numArrows; i++) {
      const dir = new THREE.Vector3(0, 0, 1);
      const origin = new THREE.Vector3(25 + i * 28, 14 + (i % 3) * 6, -35 + (i % 4) * 22);
      const arrow = new THREE.ArrowHelper(dir, origin, 12, 0x06B6D4, 3, 1.5);
      this.windArrowsGroup.add(arrow);
    }
    this.scene.add(this.windArrowsGroup);
    this._updateWindArrows();
  };

  ThreejsBallisticsSimulator.prototype._updateWindArrows = function () {
    const THREE = getTHREE();
    if (!this.windArrowsGroup || !THREE) return;

    const windAzimRad = (this.params.windAzimuthDeg * Math.PI) / 180;
    const wx = Math.cos(windAzimRad);
    const wz = Math.sin(windAzimRad);
    const dir = new THREE.Vector3(wx, 0, wz).normalize();

    const len = Math.max(5, Math.min(26, this.params.windSpeed * 0.9));

    this.windArrowsGroup.children.forEach(arrow => {
      arrow.setDirection(dir);
      arrow.setLength(len, Math.min(len * 0.35, 4), Math.min(len * 0.2, 2));
    });
  };

  ThreejsBallisticsSimulator.prototype._bindControls = function () {
    const self = this;
    const el = this.canvas;

    el.addEventListener('mousedown', function (e) {
      self.isDragging = true;
      self.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', function (e) {
      if (!self.isDragging) return;
      const deltaX = e.clientX - self.previousMousePosition.x;
      const deltaY = e.clientY - self.previousMousePosition.y;

      self.cameraSpherical.theta -= deltaX * 0.007;
      self.cameraSpherical.phi -= deltaY * 0.007;

      self._updateCameraPosition();
      self.previousMousePosition = { x: e.clientX, y: e.clientY };
      if (!self.isPlaying) self.render();
    });

    window.addEventListener('mouseup', function () {
      self.isDragging = false;
    });

    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      self.cameraSpherical.radius = Math.max(25, Math.min(600, self.cameraSpherical.radius * zoomFactor));
      self._updateCameraPosition();
      if (!self.isPlaying) self.render();
    }, { passive: false });

    // Touch support for mobile devices
    let touchStart = null;
    el.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    el.addEventListener('touchmove', function (e) {
      if (!touchStart || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;

      self.cameraSpherical.theta -= deltaX * 0.008;
      self.cameraSpherical.phi -= deltaY * 0.008;
      self._updateCameraPosition();
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (!self.isPlaying) self.render();
    });

    el.addEventListener('touchend', function () {
      touchStart = null;
    });
  };

  /**
   * 3D Full-State Runge-Kutta 4th Order (RK4) Engine
   * Calculates (x, y, z) trajectory under gravity and 3D aerodynamic crosswind drag
   */
  ThreejsBallisticsSimulator.prototype.recomputeTrajectory = function () {
    const p = this.params;
    const elevRad = (p.elevationDeg * Math.PI) / 180;
    const azimRad = (p.azimuthDeg * Math.PI) / 180;
    const windRad = (p.windAzimuthDeg * Math.PI) / 180;

    // Initial velocity components
    const vx0 = p.v0 * Math.cos(elevRad) * Math.cos(azimRad);
    const vy0 = p.v0 * Math.sin(elevRad);
    const vz0 = p.v0 * Math.cos(elevRad) * Math.sin(azimRad);

    // Wind components
    const wx = p.windSpeed * Math.cos(windRad);
    const wz = p.windSpeed * Math.sin(windRad);

    // State vector u = [x, y, z, vx, vy, vz]
    let state = [0, 0.5, 0, vx0, vy0, vz0];
    const dt = p.dt || 0.02;
    const m = Math.max(0.01, p.m);
    const c = Math.max(0, p.c);
    const g = p.g;

    const traj = [];
    traj.push({
      t: 0,
      x: state[0],
      y: state[1],
      z: state[2],
      vx: state[3],
      vy: state[4],
      vz: state[5],
      speed: p.v0
    });

    function derivatives(s) {
      const vx = s[3];
      const vy = s[4];
      const vz = s[5];

      // Relative wind velocity
      const vrel_x = vx - wx;
      const vrel_y = vy;
      const vrel_z = vz - wz;
      const vrel = Math.sqrt(vrel_x * vrel_x + vrel_y * vrel_y + vrel_z * vrel_z);

      // Drag acceleration: - (c / m) * vrel * vrel_vec
      const dragFactor = (c / m) * vrel;
      const ax = -dragFactor * vrel_x;
      const ay = -g - dragFactor * vrel_y;
      const az = -dragFactor * vrel_z;

      return [vx, vy, vz, ax, ay, az];
    }

    let t = 0;
    const maxTime = 60.0;

    while (t < maxTime) {
      const k1 = derivatives(state);

      const s2 = [
        state[0] + 0.5 * dt * k1[0],
        state[1] + 0.5 * dt * k1[1],
        state[2] + 0.5 * dt * k1[2],
        state[3] + 0.5 * dt * k1[3],
        state[4] + 0.5 * dt * k1[4],
        state[5] + 0.5 * dt * k1[5]
      ];
      const k2 = derivatives(s2);

      const s3 = [
        state[0] + 0.5 * dt * k2[0],
        state[1] + 0.5 * dt * k2[1],
        state[2] + 0.5 * dt * k2[2],
        state[3] + 0.5 * dt * k2[3],
        state[4] + 0.5 * dt * k2[4],
        state[5] + 0.5 * dt * k2[5]
      ];
      const k3 = derivatives(s3);

      const s4 = [
        state[0] + dt * k3[0],
        state[1] + dt * k3[1],
        state[2] + dt * k3[2],
        state[3] + dt * k3[3],
        state[4] + dt * k3[4],
        state[5] + dt * k3[5]
      ];
      const k4 = derivatives(s4);

      const nextX = state[0] + (dt / 6.0) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
      const nextY = state[1] + (dt / 6.0) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      const nextZ = state[2] + (dt / 6.0) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
      const nextVx = state[3] + (dt / 6.0) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
      const nextVy = state[4] + (dt / 6.0) * (k1[4] + 2 * k2[4] + 2 * k3[4] + k4[4]);
      const nextVz = state[5] + (dt / 6.0) * (k1[5] + 2 * k2[5] + 2 * k3[5] + k4[5]);

      t += dt;

      // Ground impact detection (y <= 0)
      if (nextY <= 0) {
        const r = (0 - state[1]) / (nextY - state[1]);
        const landT = (t - dt) + r * dt;
        const landX = state[0] + r * (nextX - state[0]);
        const landZ = state[2] + r * (nextZ - state[2]);
        const landVx = state[3] + r * (nextVx - state[3]);
        const landVy = state[4] + r * (nextVy - state[4]);
        const landVz = state[5] + r * (nextVz - state[5]);

        traj.push({
          t: landT,
          x: landX,
          y: 0,
          z: landZ,
          vx: landVx,
          vy: landVy,
          vz: landVz,
          speed: Math.sqrt(landVx * landVx + landVy * landVy + landVz * landVz)
        });
        break;
      }

      state = [nextX, nextY, nextZ, nextVx, nextVy, nextVz];
      traj.push({
        t: t,
        x: nextX,
        y: nextY,
        z: nextZ,
        vx: nextVx,
        vy: nextVy,
        vz: nextVz,
        speed: Math.sqrt(nextVx * nextVx + nextVy * nextVy + nextVz * nextVz)
      });
    }

    this.fullTrajectory = traj;
    const lastPoint = traj[traj.length - 1];
    this.maxLandingDistance = Math.sqrt(lastPoint.x * lastPoint.x + lastPoint.z * lastPoint.z);

    // Update target marker position
    if (this.targetMarker) {
      this.targetMarker.position.set(lastPoint.x, 0.08, lastPoint.z);
    }

    // Update theoretical ghost line
    if (this.fullGhostLine) {
      const positions = this.fullGhostLine.geometry.attributes.position.array;
      const count = Math.min(traj.length, positions.length / 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = traj[i].x;
        positions[i * 3 + 1] = traj[i].y;
        positions[i * 3 + 2] = traj[i].z;
      }
      this.fullGhostLine.geometry.attributes.position.needsUpdate = true;
      this.fullGhostLine.geometry.setDrawRange(0, count);
    }

    this._updateCannonOrientation();
    this._updateWindArrows();
    this.reset();
  };

  ThreejsBallisticsSimulator.prototype.reset = function () {
    this.pause();
    this.simTime = 0.0;
    this.currentPointIndex = 0;

    const startPt = this.fullTrajectory[0] || { x: 0, y: 0.5, z: 0, vx: 0, vy: 0, vz: 0, speed: 0 };
    if (this.projectileMesh) {
      this.projectileMesh.position.set(startPt.x, startPt.y, startPt.z);
    }
    if (this.shadowMesh) {
      this.shadowMesh.position.set(startPt.x, 0.05, startPt.z);
    }
    if (this.trajectoryLine) {
      this.trajectoryLine.geometry.setDrawRange(0, 0);
    }

    this._broadcastTelemetry(startPt);
    this.render();
  };

  ThreejsBallisticsSimulator.prototype.play = function () {
    if (this.isPlaying) return;
    if (this.currentPointIndex >= this.fullTrajectory.length - 1) {
      this.reset();
    }
    this.isPlaying = true;
    if (this.onStatusChange) this.onStatusChange('playing');
    this.lastFrameTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this._animate);
  };

  ThreejsBallisticsSimulator.prototype.pause = function () {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.onStatusChange) this.onStatusChange('paused');
  };

  ThreejsBallisticsSimulator.prototype.step = function (stepDt) {
    this.pause();
    const dt = stepDt || 0.05;
    this.simTime += dt;
    this._advanceToTime(this.simTime);
    this.render();
  };

  ThreejsBallisticsSimulator.prototype._advanceToTime = function (targetTime) {
    const traj = this.fullTrajectory;
    if (!traj || traj.length === 0) return;

    while (this.currentPointIndex < traj.length - 1 && traj[this.currentPointIndex].t < targetTime) {
      this.currentPointIndex++;
    }

    const currentPt = traj[this.currentPointIndex];
    if (this.projectileMesh) {
      this.projectileMesh.position.set(currentPt.x, currentPt.y, currentPt.z);
    }
    if (this.shadowMesh) {
      this.shadowMesh.position.set(currentPt.x, 0.05, currentPt.z);
      // Scale shadow based on altitude
      const altitudeScale = Math.max(0.4, 1.2 - currentPt.y * 0.015);
      this.shadowMesh.scale.set(altitudeScale, altitudeScale, 1);
    }

    // Update visible trajectory line up to current point
    if (this.trajectoryLine) {
      const positions = this.trajectoryLine.geometry.attributes.position.array;
      const count = Math.min(this.currentPointIndex + 1, positions.length / 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = traj[i].x;
        positions[i * 3 + 1] = traj[i].y;
        positions[i * 3 + 2] = traj[i].z;
      }
      this.trajectoryLine.geometry.attributes.position.needsUpdate = true;
      this.trajectoryLine.geometry.setDrawRange(0, count);
    }

    this._broadcastTelemetry(currentPt);

    if (this.currentPointIndex >= traj.length - 1) {
      this.pause();
    }
  };

  ThreejsBallisticsSimulator.prototype._animate = function (now) {
    if (!this.isPlaying) return;
    const deltaMs = now - (this.lastFrameTime || now);
    this.lastFrameTime = now;

    // Simulation speed factor
    const dtSim = (deltaMs / 1000.0);
    this.simTime += dtSim;

    this._advanceToTime(this.simTime);
    this.render();

    if (this.isPlaying) {
      this.animationFrameId = requestAnimationFrame(this._animate);
    }
  };

  ThreejsBallisticsSimulator.prototype.render = function () {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  ThreejsBallisticsSimulator.prototype.resize = function () {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : (this.canvas.clientWidth || 800);
    const height = parent ? parent.clientHeight : (this.canvas.clientHeight || 500);

    if (width > 0 && height > 0) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
      this.render();
    }
  };

  ThreejsBallisticsSimulator.prototype.setParams = function (newParams) {
    Object.assign(this.params, newParams);
    this.recomputeTrajectory();
  };

  ThreejsBallisticsSimulator.prototype._broadcastTelemetry = function (pt) {
    if (!this.onTelemetry) return;
    const lastPt = this.fullTrajectory[this.fullTrajectory.length - 1] || pt;
    const initialSpeed = this.params.v0;
    const currentSpeed = pt.speed || 0;
    const initKE = 0.5 * this.params.m * initialSpeed * initialSpeed;
    const currentKE = 0.5 * this.params.m * currentSpeed * currentSpeed;
    const currentPE = this.params.m * this.params.g * pt.y;
    const currentTotalE = currentKE + currentPE;
    const dissipated = Math.max(0, initKE - currentTotalE);

    this.onTelemetry({
      t: pt.t,
      x: pt.x,
      y: pt.y,
      z: pt.z,
      vx: pt.vx,
      vy: pt.vy,
      vz: pt.vz,
      speed: currentSpeed,
      driftZ: pt.z,
      rangeXY: Math.sqrt(pt.x * pt.x + pt.z * pt.z),
      totalFlightTime: lastPt.t,
      finalRange: Math.sqrt(lastPt.x * lastPt.x + lastPt.z * lastPt.z),
      finalDrift: lastPt.z,
      energyDissipatedPct: initKE > 0 ? (dissipated / initKE) * 100 : 0
    });
  };

  ThreejsBallisticsSimulator.prototype.destroy = function () {
    this.pause();
    if (this.renderer) {
      this.renderer.dispose();
    }
  };

  return ThreejsBallisticsSimulator;
}));
