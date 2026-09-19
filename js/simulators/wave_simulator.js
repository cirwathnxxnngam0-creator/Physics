/**
 * wave_simulator.js - Interactive Mechanical Waves, Standing Waves & Acoustic Beats Simulator
 * Part of PhysicsNoza 3.0 Architecture (Chapter 04 Module)
 *
 * Simulates:
 *   Submode 1: Traveling Wave (Transverse propagation, particle SHM, energy flow & wavelength calipers)
 *   Submode 2: Standing Waves (Harmonics n=1..6, Fixed/Free boundaries, Nodes & Antinodes decomposition)
 *   Submode 3: Interference & Acoustic Beats (Two-frequency superposition, pulsating envelope & Web Audio)
 *
 * Academic Standards:
 *   - University Physics 15th Ed., Ch. 15 (Mechanical Waves) & Ch. 16 (Sound).
 *   - A. P. French (1971), Vibrations and Waves, MIT Physics Series.
 *   - David Morin (2008), Classical Mechanics, Waves chapter.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WaveSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class WaveSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for WaveSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Sub-modes: 'traveling' | 'standing' | 'interference_beats' | 'water_waves' | 'light_waves' | 'polarization'
      this.subMode = 'traveling';

      // Simulation Physical Parameters
      this.params = {
        // String & Traveling Wave
        amplitude: 0.8,         // meters (A)
        frequency: 1.2,         // Hz (f)
        tension: 80.0,          // N (T_s)
        linearDensity: 0.05,    // kg/m (\mu)

        // Geometric Optics (Curved Mirrors & Thin Lenses)
        opticsType: 'convex_lens', // 'concave_mirror' | 'convex_mirror' | 'convex_lens' | 'concave_lens'
        opticsFocal: 15.0,         // cm (|f|)
        opticsS: 30.0,             // cm (s)
        opticsH: 6.0,              // cm (y)
        direction: 1,           // +1 for right, -1 for left

        // Standing Waves
        harmonicN: 2,           // n = 1, 2, 3, 4, 5, 6
        stringLength: 3.0,      // meters (L)
        boundaryType: 'fixed-fixed', // 'fixed-fixed' | 'fixed-free'

        // Beats & Superposition
        freq1: 2.0,             // Hz (f_1)
        freq2: 2.4,             // Hz (f_2)
        amp1: 0.6,              // m (A_1)
        amp2: 0.6,              // m (A_2)

        // Water Waves (Surface Gravity Waves)
        waterDepth: 20.0,       // meters (d)
        waterWaveHeight: 1.2,   // meters (H = 2A)
        waterWavelength: 20.0,  // meters (\lambda)
        showWaterTracers: true,

        // Light Waves (Electromagnetic Spectrum)
        wavelengthNm: 400.0,    // nanometers (\lambda, 380 - 750 nm)
        lightAmplitude: 1.0,

        // Wave Polarization (Malus's Law)
        polarizerAngleDeg: 0.0, // degrees (\theta_1)
        analyzerAngleDeg: 45.0, // degrees (\theta_2)
        polarizationType: 'linear', // 'linear' | 'circular'

        // Fourier Series Synthesis & Harmonic Decomposition
        fourierWaveType: 'square', // 'square' | 'sawtooth' | 'triangle' | 'rectified'
        fourierHarmonics: 5,       // N = 1 .. 25
        fourierFundFreq: 0.8,      // Hz (f_0)
        fourierAmplitude: 1.0,     // A
        fourierSpeed: 1.0,         // Time speed multiplier
        showEpicycles: true,
        showSpectrum: true,

        // Audio synthesizer toggle
        enableAudio: false
      };

      // State variables
      this.state = {
        simTime: 0.0,
        waveSpeed: 0.0,
        wavelength: 0.0,
        wavenumber: 0.0,
        omega: 0.0,
        powerAvg: 0.0,
        beatFreq: 0.0,
        frequency: 1.2,
        particles: [],           // beads along string
        waterParticles: [],      // 2D grid of orbital water tracer beads
        photonEnergyEv: 3.10,
        lightFreqThz: 750.0,
        spectralColor: { r: 120, g: 0, b: 240, hex: '#7800f0', css: 'rgb(120, 0, 240)' },
        malusTransmissionPct: 50.0,
        // Fourier synthesis live states
        fourierTime: 0.0,
        fourierWaveHistory: [],
        fourierCoeffs: null,
        fourierGibbsPct: '8.95',
        fourierPowerPct: '98.5'
      };

      // Display toggles
      this.toggles = {
        showParticles: true,
        showVelocityVectors: true,
        showDecomposition: true,
        showEnvelope: true,
        showNodesAntinodes: true,
        showCalipers: true
      };

      // Web Audio API context for audible beats
      this.audioCtx = null;
      this.osc1 = null;
      this.osc2 = null;
      this.audioGain = null;

      // Playback & Animation
      this.isPlaying = false;
      this.animId = null;
      this.lastTimestamp = 0;

      this._initParticles();
      this._setupCanvasResolution();
      this._recalculatePhysics();

      window.addEventListener('resize', () => this.resize());
    }

    _initParticles() {
      // 14 equally spaced particles to show pure vertical SHM
      this.state.particles = [];
      const count = 14;
      for (let i = 0; i <= count; i++) {
        this.state.particles.push({
          relX: i / count,
          y: 0.0,
          vy: 0.0
        });
      }

      // Water tracer particles grid (8 columns x 4 depth rows)
      this.state.waterParticles = [];
      const cols = 8;
      const rows = 4;
      for (let c = 0; c < cols; c++) {
        const relX = 0.12 + (c / (cols - 1)) * 0.76;
        for (let r = 0; r < rows; r++) {
          const depthFrac = r / (rows - 1); // 0 = surface, 1 = deep
          this.state.waterParticles.push({
            relX: relX,
            depthFrac: depthFrac,
            curX: 0,
            curY: 0,
            aOrb: 0,
            bOrb: 0
          });
        }
      }
    }

    _recalculatePhysics() {
      const p = this.params;
      const Ts = Math.max(1.0, p.tension);
      const mu = Math.max(0.001, p.linearDensity);
      this.state.waveSpeed = Math.sqrt(Ts / mu); // v = \sqrt{T_s / \mu}

      if (this.subMode === 'traveling') {
        const f = Math.max(0.1, p.frequency);
        this.state.omega = 2 * Math.PI * f;
        this.state.wavelength = this.state.waveSpeed / f;
        this.state.wavenumber = 2 * Math.PI / this.state.wavelength;
        this.state.powerAvg = 0.5 * mu * this.state.waveSpeed * Math.pow(this.state.omega, 2) * Math.pow(p.amplitude, 2);
        this.state.frequency = f;

      } else if (this.subMode === 'standing') {
        const L = Math.max(0.5, p.stringLength);
        const n = Math.max(1, p.harmonicN);
        if (p.boundaryType === 'fixed-fixed') {
          this.state.wavelength = (2 * L) / n;
          const f = n * this.state.waveSpeed / (2 * L);
          this.state.omega = 2 * Math.PI * f;
          this.state.wavenumber = 2 * Math.PI / this.state.wavelength;
          this.state.frequency = f;
        } else {
          this.state.wavelength = (4 * L) / (2 * n - 1);
          const f = (2 * n - 1) * this.state.waveSpeed / (4 * L);
          this.state.omega = 2 * Math.PI * f;
          this.state.wavenumber = 2 * Math.PI / this.state.wavelength;
          this.state.frequency = f;
        }

      } else if (this.subMode === 'interference_beats') {
        this.state.beatFreq = Math.abs(p.freq1 - p.freq2);
        this.state.frequency = (p.freq1 + p.freq2) / 2;

      } else if (this.subMode === 'water_waves') {
        const g = 9.80665;
        const d = Math.max(0.5, p.waterDepth);
        const wl = Math.max(2.0, p.waterWavelength);
        const k = 2 * Math.PI / wl;
        const c = Math.sqrt((g / k) * Math.tanh(k * d));
        const omega = c * k;
        const f = omega / (2 * Math.PI);
        const H = Math.max(0.1, p.waterWaveHeight);
        const rho = 1025.0; // seawater density kg/m^3
        const sinh2kd = Math.sinh(2 * k * d);
        const n = 0.5 * (1 + (2 * k * d) / (sinh2kd > 1e-4 ? sinh2kd : 1));
        const cg = n * c;
        const powerAvg = (1 / 8) * rho * g * H * H * cg;

        this.state.waveSpeed = c;
        this.state.wavelength = wl;
        this.state.wavenumber = k;
        this.state.omega = omega;
        this.state.frequency = f;
        this.state.powerAvg = powerAvg;

      } else if (this.subMode === 'geometric_optics') {
        const isMirror = p.opticsType.includes('mirror');
        const isDiverging = p.opticsType.includes('convex_mirror') || p.opticsType.includes('concave_lens');
        const f = (isDiverging ? -1 : 1) * Math.abs(p.opticsFocal || 15.0);
        const s = Math.max(1.0, p.opticsS || 30.0);
        const y = p.opticsH || 6.0;

        let sPrime = 0;
        let m = 0;
        let yPrime = 0;
        const isAtInfinity = Math.abs(s - f) < 0.05;

        if (!isAtInfinity) {
          sPrime = (s * f) / (s - f);
          m = -sPrime / s;
          yPrime = m * y;
        }

        this.state.opticsF = f;
        this.state.opticsS = s;
        this.state.opticsSPrime = sPrime;
        this.state.opticsM = m;
        this.state.opticsY = y;
        this.state.opticsYPrime = yPrime;
        this.state.opticsIsAtInfinity = isAtInfinity;
        this.state.opticsIsReal = sPrime > 0;
        this.state.opticsIsInverted = m < 0;

      } else if (this.subMode === 'light_waves') {
        const c = 299792458; // m/s
        const wlNm = Math.max(380, Math.min(750, p.wavelengthNm));
        const wlMeters = wlNm * 1e-9;
        const f = c / wlMeters;
        const ev = 1239.84193 / wlNm;
        const joules = 6.62607015e-34 * f;

        this.state.waveSpeed = c;
        this.state.wavelength = wlNm;
        this.state.frequency = f;
        this.state.photonEnergyEv = ev;
        this.state.lightFreqThz = f / 1e12;
        this.state.wavenumber = 2 * Math.PI / wlMeters;
        this.state.omega = 2 * Math.PI * f;
        this.state.powerAvg = joules;
        this.state.spectralColor = this._nmToRGB(wlNm);

      } else if (this.subMode === 'polarization') {
        const dDeg = (p.analyzerAngleDeg - p.polarizerAngleDeg);
        const dRad = dDeg * Math.PI / 180.0;
        const transFrac = Math.pow(Math.cos(dRad), 2);
        this.state.malusTransmissionPct = transFrac * 100.0;
        this.state.waveSpeed = 299792458;
        this.state.wavelength = p.wavelengthNm || 550;
        this.state.spectralColor = this._nmToRGB(this.state.wavelength);
      } else if (this.subMode === 'fourier_synthesis') {
        const f0 = p.fourierFundFreq || 0.8;
        const v = 40.0;
        this.state.frequency = f0;
        this.state.waveSpeed = v;
        this.state.wavelength = v / f0;
        this.state.wavenumber = (2 * Math.PI) / (v / f0);
        this.state.omega = 2 * Math.PI * f0;
        const N = Math.max(1, Math.min(25, Math.round(p.fourierHarmonics || 5)));
        const coeffs = this._calculateFourierCoeffs(p.fourierWaveType || 'square', N, p.fourierAmplitude || 1.0);
        this.state.fourierCoeffs = coeffs;
        this.state.fourierGibbsPct = coeffs.gibbsPct;
        this.state.fourierPowerPct = coeffs.powerPct;
      }
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
      if (['traveling', 'standing', 'interference_beats', 'water_waves', 'light_waves', 'polarization', 'geometric_optics', 'fourier_synthesis'].includes(mode)) {
        this.subMode = mode;
        this._stopAudio();
        this.reset();
      }
    }

    setParam(key, value) {
      const aliases = {
        lightWavelength: 'wavelengthNm',
        waterHeight: 'waterWaveHeight',
        polTheta1: 'polarizerAngleDeg',
        polTheta2: 'analyzerAngleDeg'
      };
      if (aliases[key]) key = aliases[key];

      if (key in this.params) {
        this.params[key] = (typeof this.params[key] === 'boolean' || typeof this.params[key] === 'string')
          ? value
          : parseFloat(value);

        this._recalculatePhysics();
        this._updateAudioFrequencies();
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
      if (this.params.enableAudio && this.subMode === 'interference_beats') {
        this._startAudio();
      }
      this._loop();
    }

    pause() {
      this.isPlaying = false;
      this._stopAudio();
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    step(dt = 0.03) {
      this.pause();
      this.state.simTime += dt;
      this._updatePhysics();
      this.render();
      this._emitTelemetry();
    }

    reset() {
      this.pause();
      this.state.simTime = 0.0;
      this._recalculatePhysics();
      this._updatePhysics();
      this.render();
      this._emitTelemetry();
    }

    _loop() {
      if (!this.isPlaying) return;
      const now = performance.now();
      let dt = (now - this.lastTimestamp) / 1000;
      this.lastTimestamp = now;

      if (dt > 0.05) dt = 0.05;
      this.state.simTime += dt;

      this._updatePhysics();
      this.render();
      this._emitTelemetry();

      this.animId = requestAnimationFrame(() => this._loop());
    }

    _updatePhysics() {
      const t = this.state.simTime;
      const p = this.params;
      const w = this.width;

      if (this.subMode === 'traveling') {
        const k = this.state.wavenumber;
        const omega = this.state.omega;
        const A = p.amplitude;
        const dir = p.direction;

        this.state.particles.forEach(pt => {
          // Convert relative x to physical meters across string
          const xPhys = pt.relX * (p.stringLength || 3.0);
          // y(x,t) = A * sin(kx - omega*t)
          pt.y = A * Math.sin(k * xPhys - dir * omega * t);
          // v_y = \partial y / \partial t = -dir * omega * A * cos(kx - dir * omega * t)
          pt.vy = -dir * omega * A * Math.cos(k * xPhys - dir * omega * t);
        });

      } else if (this.subMode === 'standing') {
        const k = this.state.wavenumber;
        const omega = this.state.omega;
        const A = p.amplitude;

        this.state.particles.forEach(pt => {
          const xPhys = pt.relX * p.stringLength;
          // y(x,t) = 2A * sin(kx) * cos(omega * t)
          pt.y = 2 * A * Math.sin(k * xPhys) * Math.cos(omega * t);
          pt.vy = -2 * A * omega * Math.sin(k * xPhys) * Math.sin(omega * t);
        });

      } else if (this.subMode === 'water_waves') {
        const k = this.state.wavenumber;
        const omega = this.state.omega;
        const H = this.params.waterWaveHeight;
        const A = H / 2;
        const d = this.params.waterDepth;
        const L_phys = this.params.waterWavelength * 2.5;

        this.state.waterParticles.forEach(pt => {
          const x0 = pt.relX * L_phys;
          const y0 = -pt.depthFrac * (d * 0.85); // depth below surface (m)
          const sinhKd = Math.sinh(k * d);
          const denom = sinhKd > 1e-4 ? sinhKd : 1;

          const aOrb = A * Math.cosh(k * (y0 + d)) / denom;
          const bOrb = A * Math.sinh(k * (y0 + d)) / denom;

          const phase = k * x0 - omega * t;
          pt.curX = -aOrb * Math.sin(phase);
          pt.curY = bOrb * Math.cos(phase);
          pt.aOrb = aOrb;
          pt.bOrb = bOrb;
        });
      } else if (this.subMode === 'fourier_synthesis') {
        const p = this.params;
        const f0 = p.fourierFundFreq || 0.8;
        const omega0 = 2 * Math.PI * f0;
        const N = Math.max(1, Math.min(25, Math.round(p.fourierHarmonics || 5)));
        const speed = (p.fourierSpeed !== undefined) ? p.fourierSpeed : 1.0;
        
        const dt = 0.016;
        this.state.fourierTime = (this.state.fourierTime || 0) + dt * speed;
        const curT = this.state.fourierTime;

        const coeffs = this._calculateFourierCoeffs(p.fourierWaveType || 'square', N, p.fourierAmplitude || 1.0);
        this.state.fourierCoeffs = coeffs;
        this.state.fourierGibbsPct = coeffs.gibbsPct;
        this.state.fourierPowerPct = coeffs.powerPct;

        let sumVal = coeffs.a0 || 0;
        coeffs.harmonics.forEach(h => {
          sumVal += h.an * Math.cos(h.n * omega0 * curT) + h.bn * Math.sin(h.n * omega0 * curT);
        });
        this.state.currentFourierVal = sumVal;

        if (!this.state.fourierWaveHistory) this.state.fourierWaveHistory = [];
        this.state.fourierWaveHistory.push({ t: curT, val: sumVal });
        if (this.state.fourierWaveHistory.length > 240) {
          this.state.fourierWaveHistory.shift();
        }
      }
    }

    // ==========================================
    // RENDER ENGINE
    // ==========================================
    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      // Dark background
      ctx.fillStyle = '#0B1120';
      ctx.fillRect(0, 0, w, h);

      // Grid backdrop
      this._drawGrid(ctx, w, h);

      if (this.subMode === 'traveling') {
        this._renderTravelingMode(ctx, w, h);
      } else if (this.subMode === 'standing') {
        this._renderStandingMode(ctx, w, h);
      } else if (this.subMode === 'interference_beats') {
        this._renderBeatsMode(ctx, w, h);
      } else if (this.subMode === 'water_waves') {
        this._renderWaterWavesMode(ctx, w, h);
      } else if (this.subMode === 'light_waves') {
        this._renderLightWavesMode(ctx, w, h);
      } else if (this.subMode === 'polarization') {
        this._renderPolarizationMode(ctx, w, h);
      } else if (this.subMode === 'geometric_optics') {
        this._renderGeometricOpticsMode(ctx, w, h);
      } else if (this.subMode === 'fourier_synthesis') {
        this._renderFourierMode(ctx, w, h);
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
    // 1. TRAVELING WAVE RENDERING
    // ==========================================
    _renderTravelingMode(ctx, w, h) {
      const centerY = h * 0.52;
      const padX = 70;
      const stringWidth = w - padX * 2;
      const t = this.state.simTime;
      const k = this.state.wavenumber;
      const omega = this.state.omega;
      const A = this.params.amplitude;
      const dir = this.params.direction;
      const L = this.params.stringLength || 3.0;

      // Scale: 1 meter amplitude = 80 pixels
      const scaleY = 85;

      // Draw Equilibrium Centerline
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padX - 10, centerY);
      ctx.lineTo(w - padX + 10, centerY);
      ctx.stroke();
      ctx.restore();

      // Left Driver Source (Oscillating Piston)
      const driverY = centerY - A * Math.sin(-dir * omega * t) * scaleY;
      ctx.save();
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3;
      // Driver base mount
      ctx.strokeRect(padX - 35, centerY - 60, 25, 120);
      ctx.fillStyle = '#334155';
      ctx.fillRect(padX - 35, centerY - 60, 25, 120);

      // Moving driver rod & clamp
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(padX - 20, driverY - 8, 20, 16);
      ctx.beginPath();
      ctx.arc(padX, driverY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();

      // Draw Continuous Waveform (String)
      ctx.save();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#38BDF8';
      ctx.beginPath();

      const numSamples = 240;
      for (let i = 0; i <= numSamples; i++) {
        const frac = i / numSamples;
        const px = padX + frac * stringWidth;
        const xPhys = frac * L;
        const yPhys = A * Math.sin(k * xPhys - dir * omega * t);
        const py = centerY - yPhys * scaleY;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // String glow effect
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.stroke();
      ctx.restore();

      // Draw Tracking Particle Beads & Velocity Vectors
      if (this.toggles.showParticles) {
        this.state.particles.forEach(pt => {
          const px = padX + pt.relX * stringWidth;
          const py = centerY - pt.y * scaleY;

          // Particle bead
          ctx.save();
          ctx.fillStyle = '#FDE047';
          ctx.strokeStyle = '#CA8A04';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();

          // Transverse velocity vector
          if (this.toggles.showVelocityVectors && Math.abs(pt.vy) > 0.05) {
            const vLen = -pt.vy * 18; // inverted for screen coords
            this._drawArrow(ctx, px, py, px, py + vLen, '#10B981');
          }
          ctx.restore();
        });
      }

      // Wavelength Caliper Overlay
      if (this.toggles.showCalipers && this.state.wavelength > 0) {
        const lambdaPx = (this.state.wavelength / L) * stringWidth;
        if (lambdaPx < stringWidth - 40) {
          const cX1 = padX + 30;
          const cX2 = cX1 + lambdaPx;
          const cY = centerY + A * scaleY + 35;

          ctx.save();
          ctx.strokeStyle = '#A855F7';
          ctx.fillStyle = '#A855F7';
          ctx.lineWidth = 1.8;

          // Dimension Line
          ctx.beginPath();
          ctx.moveTo(cX1, cY);
          ctx.lineTo(cX2, cY);
          // End tick marks
          ctx.moveTo(cX1, cY - 8);
          ctx.lineTo(cX1, cY + 8);
          ctx.moveTo(cX2, cY - 8);
          ctx.lineTo(cX2, cY + 8);
          ctx.stroke();

          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`ความยาวคลื่น λ = ${this.state.wavelength.toFixed(2)} m`, (cX1 + cX2) / 2, cY + 18);
          ctx.restore();
        }
      }

      // Title & Telemetry Header
      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🌊 คลื่นกลเคลื่อนที่ตามขวาง (Transverse Traveling Wave)', 45, 32);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`อัตราเร็วเฟส: v = √(T_s/μ) = ${this.state.waveSpeed.toFixed(2)} m/s | ความยาวคลื่น: λ = ${this.state.wavelength.toFixed(2)} m | กำลังงานเฉลี่ย: P_avg = ${this.state.powerAvg.toFixed(2)} W`, 45, 50);
      ctx.restore();

      // Right Side Mini HUD: Energy Density & Direction
      this._renderTravelingHUD(ctx, w, h);
    }

    _renderTravelingHUD(ctx, w, h) {
      const pW = 180;
      const pH = 110;
      const pX = w - pW - 16;
      const pY = 16;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(pX, pY, pW, pH);
      ctx.strokeRect(pX, pY, pW, pH);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('⚡ พลศาสตร์การส่งผ่านคลื่น', pX + 12, pY + 20);

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(`• ทิศทางการแผ่: ${this.params.direction > 0 ? '→ ไปทางขวา (+x)' : '← ไปทางซ้าย (-x)'}`, pX + 12, pY + 44);
      ctx.fillText(`• เลขคลื่น k: ${this.state.wavenumber.toFixed(2)} rad/m`, pX + 12, pY + 64);
      ctx.fillText(`• ความถี่เชิงมุม ω: ${this.state.omega.toFixed(2)} rad/s`, pX + 12, pY + 84);
      ctx.fillText(`• อัตราเร็ว v: ${this.state.waveSpeed.toFixed(2)} m/s`, pX + 12, pY + 100);
      ctx.restore();
    }

    // ==========================================
    // 2. STANDING WAVES & HARMONICS RENDERING
    // ==========================================
    _renderStandingMode(ctx, w, h) {
      const centerY = h * 0.52;
      const padX = 70;
      const stringWidth = w - padX * 2;
      const t = this.state.simTime;
      const k = this.state.wavenumber;
      const omega = this.state.omega;
      const A = this.params.amplitude;
      const L = this.params.stringLength;
      const n = this.params.harmonicN;
      const scaleY = 65;

      // Draw Support Pillars at ends
      ctx.save();
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 3;

      // Left Pillar (Fixed)
      ctx.fillRect(padX - 25, centerY - 80, 25, 160);
      ctx.strokeRect(padX - 25, centerY - 80, 25, 160);

      // Right Pillar
      ctx.fillRect(w - padX, centerY - 80, 25, 160);
      ctx.strokeRect(w - padX, centerY - 80, 25, 160);
      ctx.restore();

      // Envelope Curves (+/- 2A sin(kx))
      if (this.toggles.showEnvelope) {
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1.5;

        // Upper envelope
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const frac = i / 200;
          const px = padX + frac * stringWidth;
          const xPhys = frac * L;
          const py = centerY - (2 * A * Math.sin(k * xPhys)) * scaleY;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Lower envelope
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const frac = i / 200;
          const px = padX + frac * stringWidth;
          const xPhys = frac * L;
          const py = centerY + (2 * A * Math.sin(k * xPhys)) * scaleY;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Incident & Reflected Components (Decomposition)
      if (this.toggles.showDecomposition) {
        ctx.save();
        ctx.lineWidth = 1.4;

        // Incident (y1 = A sin(kx - omega*t)) - Blue dashed
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const frac = i / 200;
          const px = padX + frac * stringWidth;
          const xPhys = frac * L;
          const py = centerY - (A * Math.sin(k * xPhys - omega * t)) * scaleY;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Reflected (y2 = -A sin(kx + omega*t)) - Orange dashed
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const frac = i / 200;
          const px = padX + frac * stringWidth;
          const xPhys = frac * L;
          const py = centerY - (-A * Math.sin(k * xPhys + omega * t)) * scaleY;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Main Standing Waveform: y(x,t) = 2A sin(kx) cos(omega*t)
      ctx.save();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#10B981';
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const frac = i / 200;
        const px = padX + frac * stringWidth;
        const xPhys = frac * L;
        const yPhys = 2 * A * Math.sin(k * xPhys) * Math.cos(omega * t);
        const py = centerY - yPhys * scaleY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Glow
      ctx.lineWidth = 7;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.stroke();
      ctx.restore();

      // Highlight Nodes & Antinodes
      if (this.toggles.showNodesAntinodes) {
        // Nodes: where sin(kx) = 0 -> x = m * (L/n)
        for (let m = 0; m <= n; m++) {
          const frac = m / n;
          const nx = padX + frac * stringWidth;

          ctx.save();
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(nx, centerY, 5, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#FCA5A5';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`N${m+1}`, nx, centerY - 10);
          ctx.restore();
        }

        // Antinodes: midpoint between nodes
        for (let m = 0; m < n; m++) {
          const frac = (m + 0.5) / n;
          const ax = padX + frac * stringWidth;

          ctx.save();
          ctx.fillStyle = '#38BDF8';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`A${m+1}`, ax, centerY + 25);
          ctx.restore();
        }
      }

      // Title & Harmonic Info
      const f_n = (n * this.state.waveSpeed) / (2 * L);
      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(`🎸 คลื่นนิ่งในเส้นเชือก ฮาร์มอนิกที่ n = ${n} (Standing Wave Mode)`, 45, 32);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`ความถี่ฮาร์มอนิก f_${n} = ${f_n.toFixed(2)} Hz | ความยาวคลื่น λ_${n} = ${this.state.wavelength.toFixed(2)} m | จำนวนบัพ: ${n+1}, จำนวนปฏิบัพ: ${n}`, 45, 50);
      ctx.restore();
    }

    // ==========================================
    // 3. INTERFERENCE & BEATS RENDERING
    // ==========================================
    _renderBeatsMode(ctx, w, h) {
      const p = this.params;
      const t = this.state.simTime;
      const padX = 60;
      const plotW = w - padX * 2;

      const f1 = p.freq1;
      const f2 = p.freq2;
      const A1 = p.amp1;
      const A2 = p.amp2;
      const fBeat = Math.abs(f1 - f2);

      // 3 Tracks Layout:
      // Track 1 (Top): Wave 1 y1(t)
      // Track 2 (Middle): Wave 2 y2(t)
      // Track 3 (Bottom): Resultant Beats y_net(t)
      const track1Y = 85;
      const track2Y = 180;
      const track3Y = 325;
      const timeSpan = 3.0; // show 3 seconds window

      // Draw Track 1: Wave 1
      this._drawSingleWaveTrack(ctx, padX, track1Y, plotW, 35, t, timeSpan, f1, A1, '#38BDF8', `คลื่นที่ 1: f₁ = ${f1.toFixed(2)} Hz`);

      // Draw Track 2: Wave 2
      this._drawSingleWaveTrack(ctx, padX, track2Y, plotW, 35, t, timeSpan, f2, A2, '#F59E0B', `คลื่นที่ 2: f₂ = ${f2.toFixed(2)} Hz`);

      // Draw Track 3: Net Beats Waveform & Envelope
      ctx.save();
      // Track 3 frame
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(padX, track3Y - 60, plotW, 120);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(padX, track3Y - 60, plotW, 120);

      // Centerline
      ctx.strokeStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(padX, track3Y);
      ctx.lineTo(padX + plotW, track3Y);
      ctx.stroke();

      // Envelope Curve: \pm 2A \cos(2\pi \frac{f1-f2}{2} t)
      const scaleBeatY = 48;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      for (let i = 0; i <= 240; i++) {
        const frac = i / 240;
        const currT = t + frac * timeSpan;
        const env = (A1 + A2) * Math.abs(Math.cos(Math.PI * (f1 - f2) * currT));
        const px = padX + frac * plotW;
        const py = track3Y - env * scaleBeatY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= 240; i++) {
        const frac = i / 240;
        const currT = t + frac * timeSpan;
        const env = (A1 + A2) * Math.abs(Math.cos(Math.PI * (f1 - f2) * currT));
        const px = padX + frac * plotW;
        const py = track3Y + env * scaleBeatY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Net waveform: y_net(t) = y1(t) + y2(t)
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 300; i++) {
        const frac = i / 300;
        const currT = t + frac * timeSpan;
        const yNet = A1 * Math.sin(2 * Math.PI * f1 * currT) + A2 * Math.sin(2 * Math.PI * f2 * currT);
        const px = padX + frac * plotW;
        const py = track3Y - yNet * scaleBeatY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Track 3 Label
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`🔊 คลื่นรวมและการเกิดบีตส์: f_beat = |f₁ - f₂| = ${fBeat.toFixed(2)} Hz`, padX + 12, track3Y - 42);
      ctx.fillStyle = '#EC4899';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('เส้นประสีชมพู: ซองหุ้มแอมพลิจูด (Modulation Envelope)', padX + plotW - 255, track3Y - 42);

      // Pulsing Beat Heartbeat Circle
      const beatPhase = 2 * Math.PI * fBeat * t;
      const beatIntensity = 0.5 + 0.5 * Math.cos(beatPhase);
      const pulseRadius = 8 + 12 * beatIntensity;

      ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + 0.7 * beatIntensity})`;
      ctx.beginPath();
      ctx.arc(padX + plotW - 25, track3Y + 35, pulseRadius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText('จังหวะความดัง', padX + plotW - 65, track3Y + 38);
      ctx.restore();

      // Heading
      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🎵 การแทรกสอดทางเวลาและปรากฏการณ์บีตส์ (Acoustic Beats)', 45, 28);
      ctx.restore();
    }

    _drawSingleWaveTrack(ctx, x, y, width, height, t0, timeSpan, freq, amp, color, label) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(x, y - height, width, height * 2);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(x, y - height, width, height * 2);

      // Zero line
      ctx.strokeStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.stroke();

      // Waveform
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const frac = i / 200;
        const currT = t0 + frac * timeSpan;
        const yVal = amp * Math.sin(2 * Math.PI * freq * currT);
        const px = x + frac * width;
        const py = y - yVal * height * 0.85;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(label, x + 10, y - height + 14);
      ctx.restore();
    }

    _drawArrow(ctx, x1, y1, x2, y2, color) {
      const headLen = 6;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;

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
      ctx.restore();
    }

    // ==========================================
    // SPECTRAL COLOR UTILITY (CIE 1931 MODEL)
    // ==========================================
    _nmToRGB(wl) {
      let r = 0, g = 0, b = 0;
      if (wl >= 380 && wl < 440) {
        r = -(wl - 440) / (440 - 380);
        g = 0.0;
        b = 1.0;
      } else if (wl >= 440 && wl < 490) {
        r = 0.0;
        g = (wl - 440) / (490 - 440);
        b = 1.0;
      } else if (wl >= 490 && wl < 510) {
        r = 0.0;
        g = 1.0;
        b = -(wl - 510) / (510 - 490);
      } else if (wl >= 510 && wl < 580) {
        r = (wl - 510) / (580 - 510);
        g = 1.0;
        b = 0.0;
      } else if (wl >= 580 && wl < 645) {
        r = 1.0;
        g = -(wl - 645) / (645 - 580);
        b = 0.0;
      } else if (wl >= 645 && wl <= 750) {
        r = 1.0;
        g = 0.0;
        b = 0.0;
      }

      let factor = 0.0;
      if (wl >= 380 && wl < 420) {
        factor = 0.3 + 0.7 * (wl - 380) / (420 - 380);
      } else if (wl >= 420 && wl <= 700) {
        factor = 1.0;
      } else if (wl >= 700 && wl <= 750) {
        factor = 0.3 + 0.7 * (750 - wl) / (750 - 700);
      }

      const gamma = 0.8;
      const R = Math.round(255 * Math.pow(Math.max(0, r * factor), gamma));
      const G = Math.round(255 * Math.pow(Math.max(0, g * factor), gamma));
      const B = Math.round(255 * Math.pow(Math.max(0, b * factor), gamma));
      const hex = '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
      return { r: R, g: G, b: B, hex, css: `rgb(${R}, ${G}, ${B})` };
    }

    // ==========================================
    // 4. WATER & OCEAN WAVES RENDERING
    // ==========================================
    _renderWaterWavesMode(ctx, w, h) {
      const surfaceY = h * 0.38;
      const bedY = h * 0.84;
      const pxDepth = bedY - surfaceY;
      const t = this.state.simTime;

      const d = Math.max(0.5, this.params.waterDepth);
      const wl = Math.max(2.0, this.params.waterWavelength);
      const H = Math.max(0.1, this.params.waterWaveHeight);
      const A = H / 2;
      const k = this.state.wavenumber;
      const omega = this.state.omega;

      const scaleAmp = Math.min(45, (A / 1.5) * 40);
      const pxPerMeterX = (w - 140) / (wl * 2.2);

      // 1. Draw Ocean Water Body (Filled Gradient)
      ctx.save();
      const waterGrad = ctx.createLinearGradient(0, surfaceY - scaleAmp, 0, bedY);
      waterGrad.addColorStop(0, 'rgba(2, 132, 199, 0.65)');
      waterGrad.addColorStop(0.5, 'rgba(14, 116, 144, 0.75)');
      waterGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');

      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.moveTo(70, bedY);

      const numPts = 120;
      for (let i = 0; i <= numPts; i++) {
        const frac = i / numPts;
        const px = 70 + frac * (w - 140);
        const xPhys = (px - 70) / pxPerMeterX;
        // Non-linear Stokes/Trochoid surface elevation: sharper crests, flatter troughs
        const phase = k * xPhys - omega * t;
        const eta = scaleAmp * (Math.cos(phase) + 0.3 * (H / wl) * Math.cos(2 * phase));
        const py = surfaceY - eta;
        ctx.lineTo(px, py);
      }
      ctx.lineTo(w - 70, bedY);
      ctx.closePath();
      ctx.fill();

      // 2. Draw Ocean Surface Wave Crest Line with Foam
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let i = 0; i <= numPts; i++) {
        const frac = i / numPts;
        const px = 70 + frac * (w - 140);
        const xPhys = (px - 70) / pxPerMeterX;
        const phase = k * xPhys - omega * t;
        const eta = scaleAmp * (Math.cos(phase) + 0.3 * (H / wl) * Math.cos(2 * phase));
        const py = surfaceY - eta;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Foamy white highlight on wave peaks
      ctx.strokeStyle = '#F8FAFC';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 3. Draw Seabed / Floor
      ctx.save();
      ctx.strokeStyle = '#78716C';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, bedY);
      ctx.lineTo(w - 60, bedY);
      ctx.stroke();

      // Floor hatch marks
      ctx.strokeStyle = '#44403C';
      ctx.lineWidth = 1.2;
      for (let x = 65; x < w - 65; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, bedY);
        ctx.lineTo(x - 8, bedY + 12);
        ctx.stroke();
      }

      ctx.fillStyle = '#A8A29E';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('พื้นท้องทะเล / พื้นผิวแข็งใต้น้ำ (Impermeable Seabed)', 75, bedY + 22);
      ctx.restore();

      // 4. Draw Subsurface Particle Orbits & Tracer Beads
      if (this.params.showWaterTracers !== false) {
        const sinhKd = Math.sinh(k * d);
        const denom = sinhKd > 1e-4 ? sinhKd : 1;

        this.state.waterParticles.forEach((pt, idx) => {
          const px0 = 70 + pt.relX * (w - 140);
          const py0 = surfaceY + pt.depthFrac * (pxDepth - 10);
          const y0Phys = -pt.depthFrac * (d * 0.85);

          // Horizontal and vertical semi-axes in pixels
          const aPx = scaleAmp * Math.cosh(k * (y0Phys + d)) / denom;
          const bPx = scaleAmp * Math.sinh(k * (y0Phys + d)) / denom;

          // Draw orbital ellipse trajectory
          ctx.save();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
          ctx.setLineDash([2, 3]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(px0, py0, Math.max(1, aPx), Math.max(1, bPx), 0, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.restore();

          // Instantaneous particle position
          const xPhys = (px0 - 70) / pxPerMeterX;
          const phase = k * xPhys - omega * t;
          const dispX = -aPx * Math.sin(phase);
          const dispY = bPx * Math.cos(phase);
          const curPx = px0 + dispX;
          const curPy = py0 + dispY;

          // Tracer bead
          ctx.save();
          const beadGrad = ctx.createRadialGradient(curPx - 1, curPy - 1, 1, curPx, curPy, 4.5);
          beadGrad.addColorStop(0, '#FEF08A');
          beadGrad.addColorStop(1, '#EAB308');
          ctx.fillStyle = beadGrad;
          ctx.shadowColor = 'rgba(234, 179, 8, 0.7)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(curPx, curPy, 4, 0, 2 * Math.PI);
          ctx.fill();

          // Velocity vector on surface layer particles
          if (this.toggles.showVelocityVectors && pt.depthFrac === 0) {
            const vx = aPx * omega * Math.cos(phase) * 0.15;
            const vy = bPx * omega * Math.sin(phase) * 0.15;
            this._drawArrow(ctx, curPx, curPy, curPx + vx, curPy + vy, '#F59E0B');
          }
          ctx.restore();
        });
      }

      // 5. Water Depth Caliper (Vertical Ruler on Left)
      ctx.save();
      const rulerX = 50;
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rulerX, surfaceY);
      ctx.lineTo(rulerX, bedY);
      ctx.moveTo(rulerX - 6, surfaceY);
      ctx.lineTo(rulerX + 6, surfaceY);
      ctx.moveTo(rulerX - 6, bedY);
      ctx.lineTo(rulerX + 6, bedY);
      ctx.stroke();

      ctx.save();
      ctx.translate(rulerX - 12, (surfaceY + bedY) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`ความลึกน้ำ d = ${d.toFixed(1)} m`, 0, 0);
      ctx.restore();
      ctx.restore();

      // 6. Regime Classification Badge & Header
      const dOverL = d / wl;
      let regimeText = '';
      let regimeColor = '#10B981';
      if (dOverL >= 0.5) {
        regimeText = `🌊 คลื่นน้ำลึก (Deep Water Wave: d/λ = ${dOverL.toFixed(2)} ≥ 0.5) | อนุภาควนเป็นวงกลมแท้ รัศมีลดลงแบบเอกซ์โพเนนเชียล r = A·e^(ky)`;
        regimeColor = '#38BDF8';
      } else if (dOverL <= 0.05) {
        regimeText = `🌊 คลื่นน้ำตื้น (Shallow Water Wave: d/λ = ${dOverL.toFixed(2)} ≤ 0.05) | อนุภาควนเป็นวงรีแบนชิดท้องน้ำ c ≈ √(gd) = ${(Math.sqrt(9.80665*d)).toFixed(1)} m/s`;
        regimeColor = '#F59E0B';
      } else {
        regimeText = `🌊 คลื่นน้ำลึกปานกลาง (Intermediate: 0.05 < d/λ = ${dOverL.toFixed(2)} < 0.5) | สัมพันธ์ความถี่-ความยาวคลื่น c = √[(g/k)·tanh(kd)]`;
        regimeColor = '#A855F7';
      }

      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🌊 คลื่นน้ำและคลื่นทะเล (Surface Gravity Waves & Orbital Motion)', 50, 32);
      ctx.fillStyle = regimeColor;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(regimeText, 50, 50);
      ctx.restore();
    }

    // ==========================================
    // 5. LIGHT WAVES & SPECTRUM RENDERING
    // ==========================================
    _renderLightWavesMode(ctx, w, h) {
      const centerY = h * 0.52;
      const padX = 70;
      const spanX = w - padX * 2;
      const t = this.state.simTime;

      const wlNm = Math.max(380, Math.min(750, this.params.wavelengthNm));
      const col = this._nmToRGB(wlNm);
      const amp = Math.min(65, this.params.lightAmplitude * 55);

      // Perspective projection parameters
      const numWaves = 2.5;
      const kSim = (numWaves * 2 * Math.PI) / spanX;
      const omegaSim = 3.5; // visual animation speed

      // 1. Draw 3D Axes
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      // Propagation X-axis (k vector)
      ctx.beginPath();
      ctx.moveTo(padX - 20, centerY);
      ctx.lineTo(w - padX + 20, centerY);
      ctx.stroke();

      // Axis label k
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('ทิศทางการแผ่คลื่น k̂ (+x)', w - padX - 10, centerY - 10);

      // 2. Draw Magnetic Field B-wave (Horizontal/Diagonal projected in cyan)
      // Projection vector: 30 degrees, dx = cos(30)*z, dy = sin(30)*z
      const projCos = 0.866;
      const projSin = 0.500;
      const bScale = amp * 0.75;

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let x = padX; x <= w - padX; x += 3) {
        const phase = kSim * (x - padX) - omegaSim * t;
        const bVal = bScale * Math.sin(phase);
        const px = x - bVal * projCos * 0.7;
        const py = centerY + bVal * projSin;
        if (x === padX) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Magnetic field vectors from axis to B-wave
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      for (let x = padX; x <= w - padX; x += 28) {
        const phase = kSim * (x - padX) - omegaSim * t;
        const bVal = bScale * Math.sin(phase);
        if (Math.abs(bVal) > 3) {
          const px = x - bVal * projCos * 0.7;
          const py = centerY + bVal * projSin;
          ctx.beginPath();
          ctx.moveTo(x, centerY);
          ctx.lineTo(px, py);
          ctx.stroke();
          this._drawArrow(ctx, x, centerY, px, py, 'rgba(56, 189, 248, 0.6)');
        }
      }

      // 3. Draw Electric Field E-wave (Vertical in actual spectral color)
      ctx.save();
      ctx.strokeStyle = col.css;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = col.hex;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      for (let x = padX; x <= w - padX; x += 2) {
        const phase = kSim * (x - padX) - omegaSim * t;
        const eVal = amp * Math.sin(phase);
        const py = centerY - eVal;
        if (x === padX) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();
      ctx.restore();

      // Electric field vectors from axis to E-wave
      ctx.save();
      ctx.strokeStyle = col.css;
      ctx.lineWidth = 1.5;
      for (let x = padX; x <= w - padX; x += 24) {
        const phase = kSim * (x - padX) - omegaSim * t;
        const eVal = amp * Math.sin(phase);
        if (Math.abs(eVal) > 4) {
          const py = centerY - eVal;
          this._drawArrow(ctx, x, centerY, x, py, col.css);
        }
      }
      ctx.restore();

      // 4. Poynting Vector S = (E x B) / mu_0 at crest
      const crestPhase = Math.PI / 2;
      const crestX = padX + ((crestPhase + omegaSim * t) % (2 * Math.PI)) / kSim;
      if (crestX >= padX && crestX <= w - padX) {
        ctx.save();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.5;
        this._drawArrow(ctx, crestX, centerY, crestX + 45, centerY, '#F59E0B');
        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText('S⃗ = (E⃗ × B⃗)/μ₀', crestX + 10, centerY + 18);
        ctx.restore();
      }

      // 5. Caliper marking wavelength lambda
      const wavePx = (2 * Math.PI) / kSim;
      const calY = centerY + amp + 28;
      ctx.save();
      ctx.strokeStyle = col.css;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padX + 20, calY);
      ctx.lineTo(padX + 20 + wavePx, calY);
      ctx.moveTo(padX + 20, calY - 6);
      ctx.lineTo(padX + 20, calY + 6);
      ctx.moveTo(padX + 20 + wavePx, calY - 6);
      ctx.lineTo(padX + 20 + wavePx, calY + 6);
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`ความยาวคลื่น λ = ${wlNm.toFixed(0)} nm`, padX + 20 + wavePx / 2, calY + 16);
      ctx.restore();

      // 6. Header Badge & Live Readout Pill
      const fThz = (300000 / wlNm).toFixed(1);
      const evVal = (1239.84 / wlNm).toFixed(2);
      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('🌈 คลื่นแสงและสเปกตรัมแม่เหล็กไฟฟ้า (Electromagnetic Light Waves)', 50, 32);

      // Color Swatch Badge
      ctx.fillStyle = col.hex;
      ctx.beginPath();
      ctx.roundRect(50, 42, 14, 14, 3);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`λ = ${wlNm.toFixed(0)} nm | ความถี่ f = ${fThz} THz | พลังงานโฟตอน E = ${evVal} eV | E⃗ ⟂ B⃗ ⟂ k̂`, 72, 53);
      ctx.restore();
    }

    // ==========================================
    // 6. WAVE POLARIZATION & MALUS'S LAW
    // ==========================================
    _renderPolarizationMode(ctx, w, h) {
      const centerY = h * 0.52;
      const t = this.state.simTime;
      const p = this.params;

      const th1Deg = p.polarizerAngleDeg;
      const th2Deg = p.analyzerAngleDeg;
      const deltaDeg = Math.abs(th2Deg - th1Deg);
      const deltaRad = deltaDeg * Math.PI / 180.0;
      const transFrac = Math.pow(Math.cos(deltaRad), 2);

      const pol1X = w * 0.35;
      const pol2X = w * 0.68;
      const kSim = 0.04;
      const omegaSim = 3.5;
      const amp0 = 45.0;

      // 1. Center Optical Bench Axis
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, centerY);
      ctx.lineTo(w - 50, centerY);
      ctx.stroke();

      // 2. Incident Unpolarized Wave (x < pol1X)
      // Visualized by multi-directional oscillating electric field rays
      ctx.save();
      for (let x = 60; x < pol1X - 10; x += 32) {
        const phase = kSim * x - omegaSim * t;
        const numRays = 4;
        for (let r = 0; r < numRays; r++) {
          const rayAngle = (r * Math.PI) / numRays + Math.sin(t * 2 + r) * 0.2;
          const rAmp = amp0 * 0.7 * Math.sin(phase + r);
          const dx = rAmp * Math.sin(rayAngle) * 0.3;
          const dy = rAmp * Math.cos(rayAngle);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, centerY);
          ctx.lineTo(x + dx, centerY - dy);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. Polarizer 1 (Disk at pol1X)
      this._drawPolarizerDisk(ctx, pol1X, centerY, 60, th1Deg, 'แผ่นโพลาไรเซอร์ (Polarizer)', '#38BDF8');

      // 4. Linearly Polarized Wave (pol1X < x < pol2X)
      // Oscillates along theta1 angle
      const th1Rad = th1Deg * Math.PI / 180.0;
      ctx.save();
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.8;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let x = pol1X + 12; x < pol2X - 12; x += 2) {
        const phase = kSim * x - omegaSim * t;
        const eVal = amp0 * Math.sin(phase);
        const px = x - eVal * Math.sin(th1Rad) * 0.25;
        const py = centerY - eVal * Math.cos(th1Rad);
        if (x === pol1X + 12) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Vectors for Section 1
      for (let x = pol1X + 25; x < pol2X - 25; x += 30) {
        const phase = kSim * x - omegaSim * t;
        const eVal = amp0 * Math.sin(phase);
        if (Math.abs(eVal) > 4) {
          const px = x - eVal * Math.sin(th1Rad) * 0.25;
          const py = centerY - eVal * Math.cos(th1Rad);
          this._drawArrow(ctx, x, centerY, px, py, '#38BDF8');
        }
      }

      // 5. Analyzer 2 (Disk at pol2X)
      this._drawPolarizerDisk(ctx, pol2X, centerY, 60, th2Deg, 'แผ่นวิเคราะห์ (Analyzer)', '#EC4899');

      // 6. Transmitted Wave (x > pol2X)
      // Amplitude = amp0 * cos(delta), Intensity = I0 * cos^2(delta)
      const th2Rad = th2Deg * Math.PI / 180.0;
      const transAmp = amp0 * Math.abs(Math.cos(deltaRad));

      if (transAmp > 1.5) {
        ctx.save();
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.8;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let x = pol2X + 12; x <= w - 60; x += 2) {
          const phase = kSim * x - omegaSim * t;
          const eVal = transAmp * Math.sin(phase);
          const px = x - eVal * Math.sin(th2Rad) * 0.25;
          const py = centerY - eVal * Math.cos(th2Rad);
          if (x === pol2X + 12) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();

        // Vectors for Section 2
        for (let x = pol2X + 25; x <= w - 65; x += 30) {
          const phase = kSim * x - omegaSim * t;
          const eVal = transAmp * Math.sin(phase);
          if (Math.abs(eVal) > 3) {
            const px = x - eVal * Math.sin(th2Rad) * 0.25;
            const py = centerY - eVal * Math.cos(th2Rad);
            this._drawArrow(ctx, x, centerY, px, py, '#10B981');
          }
        }
      } else {
        // Complete Extinction indicator
        ctx.save();
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('🚫 มืดสนิท (Complete Extinction: Δθ = 90°)', pol2X + 30, centerY - 15);
        ctx.restore();
      }

      // 7. Malus's Law Gauge & HUD Panel (Top Right)
      ctx.save();
      const hudW = 230;
      const hudH = 80;
      const hudX = w - hudW - 20;
      const hudY = 20;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(hudX, hudY, hudW, hudH);
      ctx.strokeRect(hudX, hudY, hudW, hudH);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('กฎของมาลุส (Malus\'s Law)', hudX + 10, hudY + 18);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`I = I₀ · cos²(θ₂ - θ₁) = I₀ · cos²(${deltaDeg.toFixed(0)}°)`, hudX + 10, hudY + 34);

      // Transmission Progress Bar
      const barX = hudX + 10;
      const barY = hudY + 44;
      const barW = hudW - 20;
      const barH = 12;

      ctx.fillStyle = '#1E293B';
      ctx.fillRect(barX, barY, barW, barH);

      const fillW = (transFrac) * barW;
      const barCol = transFrac > 0.5 ? '#10B981' : (transFrac > 0.1 ? '#F59E0B' : '#EF4444');
      ctx.fillStyle = barCol;
      ctx.fillRect(barX, barY, fillW, barH);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.fillText(`ความเข้มส่งผ่าน: ${(transFrac * 100).toFixed(1)} %`, barX + 5, barY + 10);
      ctx.restore();

      // 8. Header Badge
      ctx.save();
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('👓 การโพลาไรซ์ของคลื่นและกฎของมาลุส (Wave Polarization & Malus\'s Law)', 50, 32);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`มุมโพลาไรเซอร์ θ₁ = ${th1Deg.toFixed(0)}° | มุมแอนาไลเซอร์ θ₂ = ${th2Deg.toFixed(0)}° | ผลต่างมุม Δθ = ${deltaDeg.toFixed(0)}°`, 50, 50);
      ctx.restore();
    }

    _drawPolarizerDisk(ctx, x, y, radius, angleDeg, label, color) {
      ctx.save();
      const rRad = (angleDeg * Math.PI) / 180.0;

      // Outer Ring
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Slits / Transmission Axis Lines
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      const step = 10;
      for (let offset = -radius + 8; offset <= radius - 8; offset += step) {
        const chordHalf = Math.sqrt(Math.max(0, radius * radius - offset * offset)) - 4;
        const x1 = x + offset * Math.sin(rRad) - chordHalf * Math.cos(rRad);
        const y1 = y - offset * Math.cos(rRad) - chordHalf * Math.sin(rRad);
        const x2 = x + offset * Math.sin(rRad) + chordHalf * Math.cos(rRad);
        const y2 = y - offset * Math.cos(rRad) + chordHalf * Math.sin(rRad);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Angle indicator label
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${label}`, x, y + radius + 16);
      ctx.fillStyle = color;
      ctx.fillText(`θ = ${angleDeg.toFixed(0)}°`, x, y + radius + 30);
      ctx.restore();
    }

    // ==========================================
    // 7. GEOMETRIC OPTICS (MIRRORS & LENSES) RENDERER
    // ==========================================
    _renderGeometricOpticsMode(ctx, w, h) {
      const p = this.params;
      const optType = p.opticsType || 'convex_lens';
      const isMirror = optType.includes('mirror');
      const isDiverging = optType.includes('convex_mirror') || optType.includes('concave_lens');
      const fAbs = Math.abs(p.opticsFocal || 15.0);
      const fSign = isDiverging ? -1 : 1;
      const f = fSign * fAbs;
      const s = Math.max(2.0, p.opticsS || 30.0);
      const y = p.opticsH || 6.0;

      // Dark background
      ctx.fillStyle = '#0B1120';
      ctx.fillRect(0, 0, w, h);

      // Coordinate System
      const X0 = Math.round(w / 2);
      const Y0 = Math.round(h / 2);

      // Dynamic scale: fit ±60cm horizontally, ±18cm vertically
      const scaleX = (w * 0.44) / 55.0;
      const scaleY = (h * 0.38) / 16.0;
      const scale = Math.min(scaleX, scaleY);

      // Draw Grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
      ctx.lineWidth = 1;
      const stepGrid = 5.0 * scale;
      for (let gx = X0 % stepGrid; gx < w; gx += stepGrid) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = Y0 % stepGrid; gy < h; gy += stepGrid) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Principal Axis (Optical Axis)
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, Y0);
      ctx.lineTo(w, Y0);
      ctx.stroke();

      // Optical Axis Arrow & Label
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('แกนมุขสำคัญ (Principal Axis)', w - 16, Y0 - 8);

      // Focal Points Positions
      const fPx = fAbs * scale;
      const f2Px = 2 * fPx;

      // Draw Focal and 2F Markers
      const drawPoint = (px, py, label, sub) => {
        ctx.save();
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, px, py + 16);
        if (sub) {
          ctx.font = '9px Inter, sans-serif';
          ctx.fillStyle = '#94A3B8';
          ctx.fillText(sub, px, py + 27);
        }
        ctx.restore();
      };

      if (!isMirror) {
        // Lens has foci on both sides
        drawPoint(X0 - fPx, Y0, isDiverging ? "F'" : "F", `-${fAbs}cm`);
        drawPoint(X0 + fPx, Y0, isDiverging ? "F" : "F'", `+${fAbs}cm`);
        drawPoint(X0 - f2Px, Y0, "2F", `-${2 * fAbs}cm`);
        drawPoint(X0 + f2Px, Y0, "2F'", `+${2 * fAbs}cm`);
      } else {
        // Mirror: concave has F in front (left), convex has F behind (right)
        if (optType === 'concave_mirror') {
          drawPoint(X0 - fPx, Y0, "F", `-${fAbs}cm`);
          drawPoint(X0 - f2Px, Y0, "C (2F)", `-${2 * fAbs}cm`);
        } else {
          drawPoint(X0 + fPx, Y0, "F (เสมือน)", `+${fAbs}cm`);
          drawPoint(X0 + f2Px, Y0, "C (2F)", `+${2 * fAbs}cm`);
        }
      }

      // Draw Optical Element at X0
      ctx.save();
      if (optType === 'convex_lens') {
        // Double convex lens shape
        ctx.strokeStyle = '#38BDF8';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(X0, Y0, 10, h * 0.38, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Arrow heads at top/bottom indicating converging lens
        const drawArrowHead = (x, y, up) => {
          ctx.beginPath();
          ctx.moveTo(x - 8, y + (up ? 8 : -8));
          ctx.lineTo(x, y);
          ctx.lineTo(x + 8, y + (up ? 8 : -8));
          ctx.stroke();
        };
        drawArrowHead(X0, Y0 - h * 0.38, true);
        drawArrowHead(X0, Y0 + h * 0.38, false);

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('เลนส์นูน (Convex Lens, f > 0)', X0, 24);
      } else if (optType === 'concave_lens') {
        // Diverging lens shape
        ctx.strokeStyle = '#A78BFA';
        ctx.fillStyle = 'rgba(167, 139, 250, 0.15)';
        ctx.lineWidth = 2.5;
        const topY = Y0 - h * 0.38;
        const botY = Y0 + h * 0.38;
        ctx.beginPath();
        ctx.moveTo(X0 - 10, topY);
        ctx.quadraticCurveTo(X0 - 2, Y0, X0 - 10, botY);
        ctx.lineTo(X0 + 10, botY);
        ctx.quadraticCurveTo(X0 + 2, Y0, X0 + 10, topY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#A78BFA';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('เลนส์เว้า (Concave Lens, f < 0)', X0, 24);
      } else if (optType === 'concave_mirror') {
        // Concave mirror arc curving toward left
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(X0 + 140, Y0, 150, Math.PI - 0.75, Math.PI + 0.75);
        ctx.stroke();

        // Hatching marks on rear (right side)
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        for (let a = Math.PI - 0.7; a <= Math.PI + 0.7; a += 0.12) {
          const mx = X0 + 140 + 150 * Math.cos(a);
          const my = Y0 + 150 * Math.sin(a);
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(mx + 8, my - 6);
          ctx.stroke();
        }

        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('กระจกเว้า (Concave Mirror, f > 0)', X0, 24);
      } else if (optType === 'convex_mirror') {
        // Convex mirror arc curving toward right
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(X0 - 140, Y0, 150, -0.75, 0.75);
        ctx.stroke();

        // Hatching marks on rear (right side inside curve)
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
        ctx.lineWidth = 1.5;
        for (let a = -0.7; a <= 0.7; a += 0.12) {
          const mx = X0 - 140 + 150 * Math.cos(a);
          const my = Y0 + 150 * Math.sin(a);
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(mx + 8, my + 6);
          ctx.stroke();
        }

        ctx.fillStyle = '#EC4899';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('กระจกนูน (Convex Mirror, f < 0)', X0, 24);
      }
      ctx.restore();

      // Object Coordinates
      const objX = X0 - s * scale;
      const objTipY = Y0 - y * scale;

      // Draw Object Arrow (Emerald Green)
      const drawArrow = (fromX, fromY, toX, toY, color, isDashed = false) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3.0;
        if (isDashed) ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Arrow head at (toX, toY)
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headLen = 10;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      drawArrow(objX, Y0, objX, objTipY, '#10B981', false);

      // Object label
      ctx.save();
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`วัตถุ (Object)`, objX, objTipY - 12);
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#A7F3D0';
      ctx.fillText(`s = ${s.toFixed(1)} cm, y = ${y.toFixed(1)} cm`, objX, objTipY - 1);
      ctx.restore();

      // Calculate Image Properties
      const isAtInfinity = Math.abs(s - f) < 0.05;
      let sPrime = 0;
      let m = 0;
      let yPrime = 0;
      let imgX = 0;
      let imgTipY = 0;
      let isReal = false;

      if (!isAtInfinity) {
        sPrime = (s * f) / (s - f);
        m = -sPrime / s;
        yPrime = m * y;

        if (!isMirror) {
          // Lens: s' > 0 -> image at right (X0 + s' * scale)
          // s' < 0 -> image at left (X0 + s' * scale)
          imgX = X0 + sPrime * scale;
          isReal = sPrime > 0;
        } else {
          // Mirror: s' > 0 -> image in front (left, X0 - s' * scale)
          // s' < 0 -> image behind (right, X0 - s' * scale)
          imgX = X0 - sPrime * scale;
          isReal = sPrime > 0;
        }
        imgTipY = Y0 - yPrime * scale;

        // Draw Image Arrow
        const imgColor = isReal ? '#F59E0B' : '#EC4899';
        drawArrow(imgX, Y0, imgX, imgTipY, imgColor, !isReal);

        // Image label
        ctx.save();
        ctx.fillStyle = imgColor;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        const natureTh = isReal ? 'ภาพจริง (หัวกลับ)' : 'ภาพเสมือน (หัวตั้ง)';
        const labelY = m < 0 ? imgTipY + 16 : imgTipY - 12;
        ctx.fillText(`${natureTh}`, imgX, labelY);
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`s' = ${sPrime > 0 ? '+' : ''}${sPrime.toFixed(1)} cm, m = ${m.toFixed(2)}×`, imgX, labelY + (m < 0 ? 12 : -11));
        ctx.restore();
      }

      // Ray Tracing Helper
      const drawRaySegment = (x1, y1, x2, y2, color, dashed = false) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        if (dashed) ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Direction arrow along segment
        if (!dashed) {
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          const angle = Math.atan2(y2 - y1, x2 - x1);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(midX - 7 * Math.cos(angle - 0.4), midY - 7 * Math.sin(angle - 0.4));
          ctx.lineTo(midX - 7 * Math.cos(angle + 0.4), midY - 7 * Math.sin(angle + 0.4));
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      };

      // ==========================================
      // PRINCIPAL RAYS RENDERING
      // ==========================================
      const ray1Col = '#FACC15'; // Ray 1: Parallel
      const ray2Col = '#38BDF8'; // Ray 2: Chief / Center
      const ray3Col = '#C084FC'; // Ray 3: Focal

      if (optType === 'convex_lens') {
        // Ray 1: Parallel to axis, then through F2 (+f)
        drawRaySegment(objX, objTipY, X0, objTipY, ray1Col, false);
        const f2X = X0 + fPx;
        const slope1 = (Y0 - objTipY) / (f2X - X0);
        const endX1 = w;
        const endY1 = objTipY + slope1 * (endX1 - X0);
        drawRaySegment(X0, objTipY, endX1, endY1, ray1Col, false);
        if (sPrime < 0) {
          // Virtual backward extension to imgX
          drawRaySegment(X0, objTipY, imgX, imgTipY, ray1Col, true);
        }

        // Ray 2: Through optical center undeviated
        const slope2 = (Y0 - objTipY) / (X0 - objX);
        const endX2 = w;
        const endY2 = objTipY + slope2 * (endX2 - objX);
        drawRaySegment(objX, objTipY, endX2, endY2, ray2Col, false);
        if (sPrime < 0) {
          drawRaySegment(objX, objTipY, imgX, imgTipY, ray2Col, true);
        }

        // Ray 3: Through F1 (-f), then parallel
        if (s > fAbs + 1.0) {
          const f1X = X0 - fPx;
          const slope3 = (Y0 - objTipY) / (f1X - objX);
          const yAtLens = objTipY + slope3 * (X0 - objX);
          drawRaySegment(objX, objTipY, X0, yAtLens, ray3Col, false);
          drawRaySegment(X0, yAtLens, w, yAtLens, ray3Col, false);
        } else if (s < fAbs - 1.0) {
          // Apparent from F1
          const f1X = X0 - fPx;
          const slope3 = (objTipY - Y0) / (objX - f1X);
          const yAtLens = objTipY + slope3 * (X0 - objX);
          drawRaySegment(objX, objTipY, X0, yAtLens, ray3Col, false);
          drawRaySegment(X0, yAtLens, w, yAtLens, ray3Col, false);
          drawRaySegment(X0, yAtLens, imgX, imgTipY, ray3Col, true);
        }

      } else if (optType === 'concave_lens') {
        // Ray 1: Parallel to axis, refracts diverging away from F1 (-f)
        drawRaySegment(objX, objTipY, X0, objTipY, ray1Col, false);
        const f1X = X0 - fPx;
        const slope1 = (objTipY - Y0) / (X0 - f1X);
        const endX1 = w;
        const endY1 = objTipY + slope1 * (endX1 - X0);
        drawRaySegment(X0, objTipY, endX1, endY1, ray1Col, false);
        drawRaySegment(X0, objTipY, f1X, Y0, ray1Col, true);

        // Ray 2: Through optical center undeviated
        const slope2 = (Y0 - objTipY) / (X0 - objX);
        drawRaySegment(objX, objTipY, X0, Y0, ray2Col, false);
        drawRaySegment(X0, Y0, w, Y0 + slope2 * (w - X0), ray2Col, false);

      } else if (optType === 'concave_mirror') {
        // Ray 1: Parallel to axis, reflects through F (left)
        drawRaySegment(objX, objTipY, X0, objTipY, ray1Col, false);
        const fX = X0 - fPx;
        const slope1 = (Y0 - objTipY) / (fX - X0);
        const endX1 = 0;
        const endY1 = objTipY + slope1 * (endX1 - X0);
        drawRaySegment(X0, objTipY, endX1, endY1, ray1Col, false);
        if (sPrime < 0) {
          // Virtual image behind mirror
          drawRaySegment(X0, objTipY, imgX, imgTipY, ray1Col, true);
        }

        // Ray 2: Strikes vertex (X0, Y0) and reflects at equal angle
        drawRaySegment(objX, objTipY, X0, Y0, ray2Col, false);
        const slope2 = -(Y0 - objTipY) / (X0 - objX);
        const endX2 = 0;
        const endY2 = Y0 + slope2 * (endX2 - X0);
        drawRaySegment(X0, Y0, endX2, endY2, ray2Col, false);
        if (sPrime < 0) {
          drawRaySegment(X0, Y0, imgX, imgTipY, ray2Col, true);
        }

      } else if (optType === 'convex_mirror') {
        // Ray 1: Parallel to axis, reflects as if coming from F (right, virtual)
        drawRaySegment(objX, objTipY, X0, objTipY, ray1Col, false);
        const fX = X0 + fPx;
        const slope1 = (objTipY - Y0) / (X0 - fX);
        const endX1 = 0;
        const endY1 = objTipY + slope1 * (endX1 - X0);
        drawRaySegment(X0, objTipY, endX1, endY1, ray1Col, false);
        drawRaySegment(X0, objTipY, fX, Y0, ray1Col, true);

        // Ray 2: Toward vertex (X0, Y0) reflects at equal angle
        drawRaySegment(objX, objTipY, X0, Y0, ray2Col, false);
        const slope2 = -(Y0 - objTipY) / (X0 - objX);
        drawRaySegment(X0, Y0, 0, Y0 + slope2 * (0 - X0), ray2Col, false);
        drawRaySegment(X0, Y0, imgX, imgTipY, ray2Col, true);
      }

      // Distance Dimension Indicator Lines
      const drawDimLine = (x1, x2, py, label, color) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, py);
        ctx.lineTo(x2, py);
        ctx.stroke();

        // Ticks
        ctx.beginPath();
        ctx.moveTo(x1, py - 4);
        ctx.lineTo(x1, py + 4);
        ctx.moveTo(x2, py - 4);
        ctx.lineTo(x2, py + 4);
        ctx.stroke();

        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, (x1 + x2) / 2, py - 3);
        ctx.restore();
      };

      const dimY = h - 22;
      drawDimLine(objX, X0, dimY, `s = ${s.toFixed(1)} cm`, '#10B981');
      if (!isAtInfinity) {
        const imgDimColor = isReal ? '#F59E0B' : '#EC4899';
        drawDimLine(X0, imgX, dimY - 14, `s' = ${sPrime.toFixed(1)} cm`, imgDimColor);
      }

      // Compact Telemetry Card overlay at top-left
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      const cardW = 240;
      const cardH = 88;
      const cardX = 14;
      const cardY = 14;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📐 การคำนวณรังสี (Ray Equations)', cardX + 10, cardY + 18);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '11px monospace';
      ctx.fillText(`1/s + 1/s' = 1/f  |  m = -s'/s`, cardX + 10, cardY + 36);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`f = ${f > 0 ? '+' : ''}${f.toFixed(1)} cm | s = ${s.toFixed(1)} cm`, cardX + 10, cardY + 52);

      if (isAtInfinity) {
        ctx.fillStyle = '#EF4444';
        ctx.fillText(`s' = ∞ (ขนาน ไม่เกิดภาพในระยะอนันต์)`, cardX + 10, cardY + 68);
      } else {
        const natureShort = isReal ? 'ภาพจริง (หัวกลับ)' : 'ภาพเสมือน (หัวตั้ง)';
        ctx.fillStyle = isReal ? '#34D399' : '#F472B6';
        ctx.fillText(`s' = ${sPrime > 0 ? '+' : ''}${sPrime.toFixed(1)} cm | m = ${m.toFixed(2)}×`, cardX + 10, cardY + 68);
        ctx.fillStyle = '#CBD5E1';
        ctx.fillText(`ลักษณะ: ${natureShort}`, cardX + 10, cardY + 80);
      }
      ctx.restore();
    }

    // ==========================================
    // 8. FOURIER SERIES SYNTHESIS & HARMONIC DECOMPOSITION
    // ==========================================
    _calculateFourierCoeffs(type, N, A = 1.0) {
      const harmonics = [];
      let a0 = 0;
      let hasGibbs = false;
      let idealPower = 1.0;

      if (type === 'square') {
        hasGibbs = true;
        idealPower = A * A;
        for (let k = 1; k <= N; k++) {
          const n = 2 * k - 1;
          const bn = (4 * A) / (n * Math.PI);
          harmonics.push({ n, an: 0, bn, amp: bn, phase: 0 });
        }
      } else if (type === 'sawtooth') {
        hasGibbs = true;
        idealPower = (A * A) / 3;
        for (let n = 1; n <= N; n++) {
          const bn = (2 * A * Math.pow(-1, n + 1)) / (n * Math.PI);
          harmonics.push({ n, an: 0, bn, amp: Math.abs(bn), phase: bn < 0 ? Math.PI : 0 });
        }
      } else if (type === 'triangle') {
        hasGibbs = false;
        idealPower = (A * A) / 3;
        for (let k = 1; k <= N; k++) {
          const n = 2 * k - 1;
          const bn = (8 * A * Math.pow(-1, k - 1)) / (n * n * Math.PI * Math.PI);
          harmonics.push({ n, an: 0, bn, amp: Math.abs(bn), phase: bn < 0 ? Math.PI : 0 });
        }
      } else if (type === 'rectified') {
        hasGibbs = false;
        a0 = A / Math.PI;
        idealPower = (A * A) / 4;
        harmonics.push({ n: 1, an: 0, bn: A * 0.5, amp: A * 0.5, phase: 0 });
        for (let k = 1; k <= Math.min(N, 12); k++) {
          const n = 2 * k;
          const an = (-2 * A) / (Math.PI * (4 * k * k - 1));
          harmonics.push({ n, an, bn: 0, amp: Math.abs(an), phase: Math.PI });
        }
      }

      // Parseval energy summation: P = a0^2 + 1/2 sum(an^2 + bn^2)
      let reconPower = a0 * a0;
      harmonics.forEach(h => {
        reconPower += 0.5 * (h.an * h.an + h.bn * h.bn);
      });
      const powerPct = Math.min(100, (reconPower / Math.max(1e-4, idealPower)) * 100).toFixed(1);

      // Gibbs overshoot: approaches 8.948987% as N -> infty for square / sawtooth
      let gibbsPct = '0.00';
      if (hasGibbs) {
        const factor = type === 'square' ? (1 - 0.22 / N) : (1 - 0.35 / N);
        gibbsPct = (8.95 * Math.max(0.5, factor)).toFixed(2);
      }

      return { a0, harmonics, powerPct, gibbsPct, hasGibbs };
    }

    _renderFourierMode(ctx, w, h) {
      const p = this.params;
      const f0 = p.fourierFundFreq || 0.8;
      const omega0 = 2 * Math.PI * f0;
      const T0 = 1 / f0;
      const N = Math.max(1, Math.min(25, Math.round(p.fourierHarmonics || 5)));
      const curT = this.state.fourierTime || 0;
      const coeffs = this.state.fourierCoeffs || this._calculateFourierCoeffs(p.fourierWaveType || 'square', N, p.fourierAmplitude || 1.0);
      const isCompact = w < 720;

      // Layout partition
      const epicycleW = isCompact ? w * 0.38 : Math.min(270, w * 0.3);
      const epiCenterX = isCompact ? epicycleW * 0.5 : 130;
      const epiCenterY = isCompact ? h * 0.28 : h * 0.36;
      const graphX = epicycleW + 15;
      const graphY = 38;
      const graphW = w - graphX - 20;
      const graphH = isCompact ? h * 0.42 : h * 0.52;
      const scaleY = isCompact ? 48 : 70;

      // --- SECTION 1: EPICYCLE PHASOR CIRCLES (LEFT) ---
      ctx.save();
      // Epicycles bounding card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(10, 30, epicycleW - 5, isCompact ? h * 0.52 : h * 0.62, 8);
      ctx.fill();
      ctx.stroke();

      // Card Title
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('🔄 วงล้ออีพิไซเคิล (Epicycles / Phasors)', 18, 48);

      // Draw Center Crosshair
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(epiCenterX - 50, epiCenterY);
      ctx.lineTo(epiCenterX + 50, epiCenterY);
      ctx.moveTo(epiCenterX, epiCenterY - 50);
      ctx.lineTo(epiCenterX, epiCenterY + 50);
      ctx.stroke();
      ctx.setLineDash([]);

      // Chain epicycles
      let currentX = epiCenterX;
      let currentY = epiCenterY - (coeffs.a0 || 0) * scaleY;
      const harmonicColors = ['#F59E0B', '#06B6D4', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F97316'];

      coeffs.harmonics.forEach((hItem, idx) => {
        const radius = hItem.amp * scaleY;
        if (radius > 1.2) {
          const color = harmonicColors[idx % harmonicColors.length];

          // Circle outline
          ctx.strokeStyle = color;
          ctx.globalAlpha = Math.max(0.18, 0.55 - idx * 0.04);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(currentX, currentY, radius, 0, 2 * Math.PI);
          ctx.stroke();

          // Vector arm
          const angle = -(hItem.n * omega0 * curT + hItem.phase);
          const nextX = currentX + radius * Math.cos(angle);
          const nextY = currentY + radius * Math.sin(angle);

          ctx.globalAlpha = 0.9;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();

          // Small tip bead
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(nextX, nextY, 2.5, 0, 2 * Math.PI);
          ctx.fill();

          currentX = nextX;
          currentY = nextY;
        }
      });
      ctx.globalAlpha = 1.0;

      // Tracer bead at current tip
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 4.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#F8FAFC';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Horizontal Laser Guide Line to Waveform Graph
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(graphX, currentY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // --- SECTION 2: SYNTHESIZED TIME-DOMAIN WAVEFORM (RIGHT) ---
      ctx.save();
      // Graph background card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(graphX, 30, graphW, isCompact ? h * 0.52 : h * 0.62, 8);
      ctx.fill();
      ctx.stroke();

      // Graph Title & Type Badge
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 12px Inter, sans-serif';
      const waveNames = {
        square: 'คลื่นสี่เหลี่ยม (Square Wave)',
        sawtooth: 'คลื่นฟันเลื่อย (Sawtooth Wave)',
        triangle: 'คลื่นสามเหลี่ยม (Triangle Wave)',
        rectified: 'คลื่นเรียงกระแสครึ่งคลื่น (Half-Wave Rectified)'
      };
      ctx.fillText(`📈 สังเคราะห์อนุกรม: ${waveNames[p.fourierWaveType] || 'Square Wave'}`, graphX + 12, 48);

      const graphZeroY = 30 + (isCompact ? h * 0.52 : h * 0.62) * 0.5;

      // Zero & Amplitude Reference Gridlines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(graphX + 10, graphZeroY);
      ctx.lineTo(graphX + graphW - 10, graphZeroY);
      ctx.moveTo(graphX + 10, graphZeroY - scaleY);
      ctx.lineTo(graphX + graphW - 10, graphZeroY - scaleY);
      ctx.moveTo(graphX + 10, graphZeroY + scaleY);
      ctx.lineTo(graphX + graphW - 10, graphZeroY + scaleY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Axis Labels
      ctx.fillStyle = '#64748B';
      ctx.font = '10px monospace';
      ctx.fillText('+1.0', graphX + 8, graphZeroY - scaleY - 3);
      ctx.fillText(' 0.0', graphX + 8, graphZeroY - 3);
      ctx.fillText('-1.0', graphX + 8, graphZeroY + scaleY - 3);

      // Ideal Waveform (Faint Dashed Line)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      const plotTimeSpan = 2.0 * T0; // Show 2 periods
      const stepPx = 2;
      for (let px = 0; px <= graphW - 40; px += stepPx) {
        const tOffset = (px / (graphW - 40)) * plotTimeSpan;
        const evalT = curT + tOffset;
        const phaseFrac = ((evalT % T0) + T0) % T0 / T0; // 0 .. 1
        let idealVal = 0;

        if (p.fourierWaveType === 'square') {
          idealVal = phaseFrac < 0.5 ? 1.0 : -1.0;
        } else if (p.fourierWaveType === 'sawtooth') {
          idealVal = 2 * phaseFrac - 1.0;
        } else if (p.fourierWaveType === 'triangle') {
          idealVal = phaseFrac < 0.5 ? (4 * phaseFrac - 1.0) : (3.0 - 4 * phaseFrac);
        } else if (p.fourierWaveType === 'rectified') {
          idealVal = Math.sin(2 * Math.PI * phaseFrac) > 0 ? Math.sin(2 * Math.PI * phaseFrac) : 0;
        }

        const py = graphZeroY - idealVal * scaleY;
        if (px === 0) ctx.moveTo(graphX + 25 + px, py);
        else ctx.lineTo(graphX + 25 + px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Synthesized Fourier Waveform S_N(t) (Vibrant Emerald)
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let maxOvershootY = 0;
      let maxOvershootX = 0;
      let maxOvershootVal = -999;

      for (let px = 0; px <= graphW - 40; px += stepPx) {
        const tOffset = (px / (graphW - 40)) * plotTimeSpan;
        const evalT = curT + tOffset;
        let sumVal = coeffs.a0 || 0;
        coeffs.harmonics.forEach(h => {
          sumVal += h.an * Math.cos(h.n * omega0 * evalT) + h.bn * Math.sin(h.n * omega0 * evalT);
        });

        const py = graphZeroY - sumVal * scaleY;
        if (px === 0) ctx.moveTo(graphX + 25 + px, py);
        else ctx.lineTo(graphX + 25 + px, py);

        if (sumVal > maxOvershootVal) {
          maxOvershootVal = sumVal;
          maxOvershootX = graphX + 25 + px;
          maxOvershootY = py;
        }
      }
      ctx.stroke();

      // Gibbs Phenomenon Peak Callout
      if (coeffs.hasGibbs && maxOvershootX > graphX + 30 && maxOvershootX < graphX + graphW - 50) {
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(maxOvershootX, maxOvershootY, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Callout Badge
        const badgeW = isCompact ? 130 : 165;
        const badgeX = Math.min(graphX + graphW - badgeW - 10, maxOvershootX - 20);
        const badgeY = Math.max(40, maxOvershootY - 24);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, 20, 4);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9.5px Inter, sans-serif';
        ctx.fillText(`🎯 Gibbs Peak: +${coeffs.gibbsPct}%`, badgeX + 6, badgeY + 14);
      }
      ctx.restore();

      // --- SECTION 3: HARMONIC FREQUENCY SPECTRUM BAR CHART (BOTTOM) ---
      ctx.save();
      const specBoxY = isCompact ? h - 90 : h - 100;
      const specBoxH = isCompact ? 80 : 88;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(10, specBoxY, w - 20, specBoxH, 8);
      ctx.fill();
      ctx.stroke();

      // Spectrum Title & Telemetry summary
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('📊 สเปกตรัมความถี่ฮาร์มอนิก (Frequency Spectrum: |c_n| vs n·f₀)', 20, specBoxY + 18);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`พจน์ N = ${N} | พลังงานพาร์เซวาล (Parseval): ${coeffs.powerPct}% | f₀ = ${f0.toFixed(1)} Hz`, w - 25, specBoxY + 18);
      ctx.textAlign = 'left';

      // Draw Bars
      const barStartY = specBoxY + specBoxH - 18;
      const totalBars = Math.min(coeffs.harmonics.length, 16);
      const availW = w - 60;
      const barSlotW = availW / Math.max(1, totalBars);
      const barMaxH = specBoxH - 36;
      const maxAmp = Math.max(...coeffs.harmonics.map(h => h.amp), 1.0);

      coeffs.harmonics.slice(0, totalBars).forEach((hItem, idx) => {
        const barH = (hItem.amp / maxAmp) * barMaxH;
        const bx = 30 + idx * barSlotW;
        const color = harmonicColors[idx % harmonicColors.length];

        // Bar fill
        ctx.fillStyle = color;
        ctx.fillRect(bx + 4, barStartY - barH, Math.max(6, barSlotW - 12), barH);

        // Harmonic label (1f₀, 3f₀...)
        ctx.fillStyle = '#94A3B8';
        ctx.font = '9px monospace';
        ctx.fillText(`${hItem.n}f₀`, bx + 4, barStartY + 12);

        // Value on bar top
        if (barSlotW > 28 && barH > 14) {
          ctx.fillStyle = '#F8FAFC';
          ctx.font = '8.5px monospace';
          ctx.fillText(hItem.amp.toFixed(2), bx + 4, barStartY - barH - 3);
        }
      });
      ctx.restore();
    }


    // ==========================================
    // WEB AUDIO API SYNTHESIZER
    // ==========================================
    _startAudio() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) {
          this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        // Base audio frequency around 220Hz (A3) scaled by simulation frequencies
        const baseTone = 220.0;
        this.osc1 = this.audioCtx.createOscillator();
        this.osc2 = this.audioCtx.createOscillator();
        this.audioGain = this.audioCtx.createGain();

        this.osc1.type = 'sine';
        this.osc2.type = 'sine';
        this.osc1.frequency.setValueAtTime(baseTone, this.audioCtx.currentTime);
        this.osc2.frequency.setValueAtTime(baseTone + Math.abs(this.params.freq1 - this.params.freq2) * 5, this.audioCtx.currentTime);

        this.audioGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

        this.osc1.connect(this.audioGain);
        this.osc2.connect(this.audioGain);
        this.audioGain.connect(this.audioCtx.destination);

        this.osc1.start();
        this.osc2.start();
      } catch (err) {
        console.warn('AudioContext autoplay policy prevented audio start:', err);
      }
    }

    _stopAudio() {
      if (this.osc1) {
        try { this.osc1.stop(); this.osc1.disconnect(); } catch (e) {}
        this.osc1 = null;
      }
      if (this.osc2) {
        try { this.osc2.stop(); this.osc2.disconnect(); } catch (e) {}
        this.osc2 = null;
      }
    }

    _updateAudioFrequencies() {
      if (!this.audioCtx || !this.osc1 || !this.osc2) return;
      const baseTone = 220.0;
      this.osc1.frequency.setValueAtTime(baseTone, this.audioCtx.currentTime);
      this.osc2.frequency.setValueAtTime(baseTone + Math.abs(this.params.freq1 - this.params.freq2) * 5, this.audioCtx.currentTime);
    }

    _emitTelemetry() {
      if (typeof this.options.onTelemetryUpdate !== 'function') return;

      let freqVal = this.params.frequency;
      let periodVal = 0;
      let ampVal = this.params.amplitude;

      if (this.subMode === 'standing') {
        freqVal = (this.params.harmonicN * this.state.waveSpeed) / (2 * this.params.stringLength);
        periodVal = freqVal > 0 ? 1 / freqVal : 0;
      } else if (this.subMode === 'interference_beats') {
        freqVal = (this.params.freq1 + this.params.freq2) / 2;
        periodVal = freqVal > 0 ? 1 / freqVal : 0;
      } else if (this.subMode === 'water_waves') {
        freqVal = this.state.frequency;
        periodVal = freqVal > 0 ? 1 / freqVal : 0;
        ampVal = this.params.waterWaveHeight / 2;
      } else if (this.subMode === 'light_waves') {
        freqVal = this.state.frequency;
        periodVal = freqVal > 0 ? 1 / freqVal : 0;
        ampVal = this.params.lightAmplitude;
      } else if (this.subMode === 'polarization') {
        freqVal = 5.45e14;
        periodVal = 1 / freqVal;
        ampVal = Math.sqrt(this.state.malusTransmissionPct / 100);
      } else {
        periodVal = (this.params.frequency > 0) ? (1 / this.params.frequency) : 0;
      }

      const deltaDeg = Math.abs(this.params.analyzerAngleDeg - this.params.polarizerAngleDeg);
      this.options.onTelemetryUpdate({
        subMode: this.subMode,
        submode: this.subMode,
        time: this.state.simTime,
        waveSpeed: this.state.waveSpeed,
        wavelength: this.state.wavelength,
        frequency: freqVal,
        period: periodVal,
        amplitude: ampVal,
        wavenumber: this.state.wavenumber,
        omega: this.state.omega,
        powerAvg: this.state.powerAvg,
        harmonicN: this.params.harmonicN,
        beatFreq: Math.abs(this.params.freq1 - this.params.freq2),
        photonEnergyEv: this.state.photonEnergyEv,
        lightFreqThz: this.state.lightFreqThz,
        spectralColor: this.state.spectralColor,
        malusTransmissionPct: this.state.malusTransmissionPct,
        transmissionPct: this.state.malusTransmissionPct,
        deltaThetaDeg: deltaDeg,
        opticsType: this.params.opticsType,
        opticsFocal: this.params.opticsFocal,
        opticsS: this.state.opticsS,
        opticsSPrime: this.state.opticsSPrime,
        opticsF: this.state.opticsF,
        opticsM: this.state.opticsM,
        opticsY: this.state.opticsY,
        opticsYPrime: this.state.opticsYPrime,
        opticsIsReal: this.state.opticsIsReal,
        opticsIsInverted: this.state.opticsIsInverted,
        opticsIsAtInfinity: this.state.opticsIsAtInfinity,
        energy_eV: this.state.photonEnergyEv,
        freq_THz: this.state.lightFreqThz,
        wl_nm: this.subMode === 'light_waves' ? this.params.wavelengthNm : undefined,
        fourierWaveType: this.params.fourierWaveType,
        fourierHarmonics: this.params.fourierHarmonics,
        fourierFundFreq: this.params.fourierFundFreq,
        fourierGibbsPct: this.state.fourierGibbsPct,
        fourierPowerPct: this.state.fourierPowerPct
      });
    }
  }

  return WaveSimulator;
}));
