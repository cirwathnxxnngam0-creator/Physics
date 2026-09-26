/**
 * civil_beam_simulator.js - Interactive Beam Statics (SFD/BMD/Deflection) & Mohr's Stress Circle Simulator
 * Part of PhysicsNoza 3.0 Architecture (Track 3: Civil Engineering Module)
 *
 * Simulates:
 *   Mode 1: Simply Supported Beam under Point & Uniform Distributed Loads (SFD, BMD, Elastic Deflection)
 *   Mode 2: Cantilever Fixed-Wall Beam (Internal Shear, Hogging Moment, Tip Deflection)
 *   Mode 3: Mohr's Stress Circle & Plane Stress Transformation (Principal Stresses & Rotated Stress Element)
 *
 * Academic Standards:
 *   - Hibbeler, R.C. (2016). Engineering Mechanics: Statics (14th Ed), Pearson.
 *   - Hibbeler, R.C. (2017). Mechanics of Materials (10th Ed), Pearson.
 *   - Beer, F.P., Johnston, E.R. et al. (2020). Mechanics of Materials (8th Ed), McGraw-Hill.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CivilBeamSimulator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class CivilBeamSimulator {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} options - Callbacks: { onTelemetryUpdate }
     */
    constructor(canvas, options = {}) {
      if (!canvas) throw new Error('Canvas element required for CivilBeamSimulator');
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = options;

      // Sub-modes: 'simply_supported' | 'cantilever' | 'mohr_circle'
      this.subMode = 'simply_supported';

      // Simulation parameters
      this.params = {
        // Beam parameters
        length: 6.0,          // meters (L)
        pointLoadP: 30.0,     // kN (P)
        loadPosA: 2.0,        // meters from left support (a)
        distLoadW: 10.0,      // kN/m (w)
        flexRigidityEI: 20000,// kN.m^2 (E * I)

        // Mohr's circle parameters
        sigmaX: 80.0,         // MPa
        sigmaY: 20.0,         // MPa
        tauXY: 40.0,          // MPa
        rotThetaDeg: 25.0,    // degrees

        // Truss parameters (prob-civ-01: Pin A, Roller C, Joint B apex)
        trussSpanL: 4.0,       // meters (L)
        trussHeightH: 3.0,     // meters (h)
        trussLoadPx: 40.0,     // kN (horizontal load at joint B, rightward)
        trussLoadPy: 0.0       // kN (vertical load at joint B, downward)
      };

      // Hover / Inspect state
      this.hoverState = {
        active: false,
        xMeters: 0,
        mouseX: 0,
        mouseY: 0
      };

      // Playback / animation dummy state (for parity with standard simulator lifecycle)
      this.isPlaying = false;
      this.animId = null;

      this._setupCanvasResolution();
      this._bindMouseEvents();
      window.addEventListener('resize', () => this.resize());
    }

    _setupCanvasResolution() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width || 850;
      const height = rect.height || 520;

      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = width;
      this.height = height;
    }

    _bindMouseEvents() {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.hoverState.mouseX = e.clientX - rect.left;
        this.hoverState.mouseY = e.clientY - rect.top;

        if (this.subMode === 'simply_supported' || this.subMode === 'cantilever') {
          const padL = 75;
          const padR = 40;
          const plotW = this.width - padL - padR;
          const clampedX = Math.max(padL, Math.min(padL + plotW, this.hoverState.mouseX));
          const frac = (clampedX - padL) / plotW;
          this.hoverState.xMeters = frac * this.params.length;
          this.hoverState.active = true;
        } else {
          this.hoverState.active = false;
        }
        this.render();
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.hoverState.active = false;
        this.render();
      });
    }

    resize() {
      this._setupCanvasResolution();
      this.render();
    }

    setSubMode(mode) {
      if (['simply_supported', 'cantilever', 'mohr_circle', 'truss_analysis'].includes(mode)) {
        this.subMode = mode;
        this.hoverState.active = false;
        this.render();
        this._emitTelemetry();
      }
    }

    setParam(key, value) {
      if (key in this.params) {
        this.params[key] = parseFloat(value);
        if (key === 'length' && this.params.loadPosA > this.params.length) {
          this.params.loadPosA = this.params.length;
        }
        this.render();
        this._emitTelemetry();
      }
    }

    play() {
      this.isPlaying = true;
      this.render();
    }

    pause() {
      this.isPlaying = false;
    }

    step() {
      this.render();
    }

    reset() {
      this.pause();
      if (this.subMode === 'simply_supported') {
        this.params.length = 6.0;
        this.params.pointLoadP = 30.0;
        this.params.loadPosA = 2.0;
        this.params.distLoadW = 10.0;
        this.params.flexRigidityEI = 20000;
      } else if (this.subMode === 'cantilever') {
        this.params.length = 4.0;
        this.params.pointLoadP = 20.0;
        this.params.loadPosA = 4.0;
        this.params.distLoadW = 8.0;
        this.params.flexRigidityEI = 20000;
      } else if (this.subMode === 'mohr_circle') {
        this.params.sigmaX = 80.0;
        this.params.sigmaY = 20.0;
        this.params.tauXY = 40.0;
        this.params.rotThetaDeg = 25.0;
      } else if (this.subMode === 'truss_analysis') {
        this.params.trussSpanL = 4.0;
        this.params.trussHeightH = 3.0;
        this.params.trussLoadPx = 40.0;
        this.params.trussLoadPy = 0.0;
      }
      this.hoverState.active = false;
      this.render();
      this._emitTelemetry();
    }

    // =========================================================================
    // BEAM STATICS COMPUTATIONS
    // =========================================================================
    _calcSimplySupported() {
      const L = Math.max(0.5, this.params.length);
      const P = this.params.pointLoadP;
      const a = Math.max(0, Math.min(L, this.params.loadPosA));
      const b = L - a;
      const w = this.params.distLoadW;
      const EI = Math.max(100, this.params.flexRigidityEI);

      // Support reactions
      const Ra = (P * b + 0.5 * w * L * L) / L;
      const Rb = (P * a + 0.5 * w * L * L) / L;

      // Sample points along beam span
      const numSamples = 300;
      const samples = [];
      let maxV = 0;
      let minV = 0;
      let maxM = 0;
      let minM = 0;
      let maxDeflection = 0;

      for (let i = 0; i <= numSamples; i++) {
        const x = (i / numSamples) * L;
        
        // Shear Force V(x)
        let V = Ra - w * x;
        if (x >= a) V -= P;

        // Bending Moment M(x)
        let M = Ra * x - 0.5 * w * x * x;
        if (x >= a) M -= P * (x - a);

        // Euler-Bernoulli Deflection v(x) (downward positive for plotting)
        let defP = 0;
        if (x <= a) {
          defP = (P * b * x) / (6 * EI * L) * (L * L - b * b - x * x);
        } else {
          defP = (P * a * (L - x)) / (6 * EI * L) * (2 * L * x - x * x - a * a);
        }

        const defW = (w * x) / (24 * EI) * (Math.pow(L, 3) - 2 * L * x * x + Math.pow(x, 3));
        const totalDefMeters = defP + defW;
        const totalDefMm = totalDefMeters * 1000.0; // mm

        if (V > maxV) maxV = V;
        if (V < minV) minV = V;
        if (M > maxM) maxM = M;
        if (M < minM) minM = M;
        if (totalDefMm > maxDeflection) maxDeflection = totalDefMm;

        samples.push({ x, V, M, defMm: totalDefMm });
      }

      return {
        L, a, b, P, w, EI,
        Ra, Rb,
        maxV, minV, maxM, minM,
        maxDeflection,
        samples
      };
    }

    _calcCantilever() {
      const L = Math.max(0.5, this.params.length);
      const P = this.params.pointLoadP;
      const a = Math.max(0, Math.min(L, this.params.loadPosA));
      const w = this.params.distLoadW;
      const EI = Math.max(100, this.params.flexRigidityEI);

      // Support reactions at fixed wall (x = 0)
      const Ra = P + w * L;
      const Ma = P * a + 0.5 * w * L * L; // Counter-clockwise fixing moment

      const numSamples = 300;
      const samples = [];
      let maxV = 0;
      let minV = 0;
      let maxM = 0;
      let minM = 0;
      let maxDeflection = 0;

      for (let i = 0; i <= numSamples; i++) {
        const x = (i / numSamples) * L;

        // Shear force V(x)
        let V = Ra - w * x;
        if (x >= a) V -= P;

        // Bending moment M(x) (Hogging / negative moment)
        let M = -Ma + Ra * x - 0.5 * w * x * x;
        if (x >= a) M -= P * (x - a);

        // Euler-Bernoulli Deflection for Cantilever
        let defP = 0;
        if (x <= a) {
          defP = (P * x * x) / (6 * EI) * (3 * a - x);
        } else {
          defP = (P * a * a) / (6 * EI) * (3 * x - a);
        }

        const defW = (w * x * x) / (24 * EI) * (6 * L * L - 4 * L * x + x * x);
        const totalDefMm = (defP + defW) * 1000.0;

        if (V > maxV) maxV = V;
        if (V < minV) minV = V;
        if (M > maxM) maxM = M;
        if (M < minM) minM = M;
        if (totalDefMm > maxDeflection) maxDeflection = totalDefMm;

        samples.push({ x, V, M, defMm: totalDefMm });
      }

      return {
        L, a, P, w, EI,
        Ra, Ma,
        maxV, minV, maxM, minM,
        maxDeflection,
        samples
      };
    }

    // =========================================================================
    // MOHR'S CIRCLE COMPUTATIONS
    // =========================================================================
    _calcMohr() {
      const sx = this.params.sigmaX;
      const sy = this.params.sigmaY;
      const txy = this.params.tauXY;
      const thetaDeg = this.params.rotThetaDeg;
      const thetaRad = (thetaDeg * Math.PI) / 180.0;

      const sigmaAvg = (sx + sy) / 2.0;
      const diffHalf = (sx - sy) / 2.0;
      const R = Math.sqrt(diffHalf * diffHalf + txy * txy);

      const sigma1 = sigmaAvg + R;
      const sigma2 = sigmaAvg - R;
      const tauMax = R;

      // Principal angle theta_p1
      const thetaP1Rad = 0.5 * Math.atan2(2 * txy, sx - sy);
      const thetaP1Deg = (thetaP1Rad * 180.0) / Math.PI;
      const thetaSDeg = thetaP1Deg - 45.0;

      // Transformed stresses at theta
      const cos2t = Math.cos(2 * thetaRad);
      const sin2t = Math.sin(2 * thetaRad);
      const sxPrime = sigmaAvg + diffHalf * cos2t + txy * sin2t;
      const syPrime = sigmaAvg - diffHalf * cos2t - txy * sin2t;
      const txyPrime = -diffHalf * sin2t + txy * cos2t;

      return {
        sx, sy, txy, thetaDeg, thetaRad,
        sigmaAvg, R,
        sigma1, sigma2, tauMax,
        thetaP1Deg, thetaSDeg,
        sxPrime, syPrime, txyPrime
      };
    }

    _calcTruss() {
      const L = Math.max(1.0, this.params.trussSpanL || 4.0);
      const h = Math.max(0.5, this.params.trussHeightH || 3.0);
      const Px = this.params.trussLoadPx !== undefined ? this.params.trussLoadPx : 40.0;
      const Py = this.params.trussLoadPy !== undefined ? this.params.trussLoadPy : 0.0;

      // Reactions:
      // Moment equilibrium about C (L, 0): -Ay * L - Px * h + Py * (L/2) = 0
      const Ay = (-Px * h + Py * (L / 2)) / L;
      const Cy = Py - Ay;
      const Ax = -Px;

      const halfL = L / 2;
      const Lab = Math.sqrt(halfL * halfL + h * h);
      const sinTheta = h / Lab;
      const cosTheta = halfL / Lab;

      // Joint A: Ay + Fab * sinTheta = 0 => Fab = -Ay / sinTheta (Tension > 0)
      const Fab = -Ay / sinTheta;
      // Ax + Fac + Fab * cosTheta = 0 => Fac = -Ax - Fab * cosTheta
      const Fac = -Ax - Fab * cosTheta;
      // Joint C: Cy + Fbc * sinTheta = 0 => Fbc = -Cy / sinTheta
      const Fbc = -Cy / sinTheta;

      return {
        L, h, Px, Py,
        Ax, Ay, Cy,
        Fab, Fbc, Fac,
        thetaDeg: (Math.atan2(h, halfL) * 180 / Math.PI)
      };
    }

    _emitTelemetry() {
      if (typeof this.options.onTelemetryUpdate !== 'function') return;

      if (this.subMode === 'simply_supported') {
        const data = this._calcSimplySupported();
        this.options.onTelemetryUpdate({
          subMode: 'simply_supported',
          ra: data.Ra.toFixed(2) + ' kN',
          rb: data.Rb.toFixed(2) + ' kN',
          maxV: Math.max(Math.abs(data.maxV), Math.abs(data.minV)).toFixed(2) + ' kN',
          maxM: data.maxM.toFixed(2) + ' kN·m',
          maxDef: data.maxDeflection.toFixed(2) + ' mm'
        });
      } else if (this.subMode === 'cantilever') {
        const data = this._calcCantilever();
        this.options.onTelemetryUpdate({
          subMode: 'cantilever',
          ra: data.Ra.toFixed(2) + ' kN',
          ma: data.Ma.toFixed(2) + ' kN·m',
          maxV: Math.max(Math.abs(data.maxV), Math.abs(data.minV)).toFixed(2) + ' kN',
          maxM: Math.abs(data.minM).toFixed(2) + ' kN·m',
          maxDef: data.maxDeflection.toFixed(2) + ' mm'
        });
      } else if (this.subMode === 'mohr_circle') {
        const data = this._calcMohr();
        this.options.onTelemetryUpdate({
          subMode: 'mohr_circle',
          sigma1: data.sigma1.toFixed(1) + ' MPa',
          sigma2: data.sigma2.toFixed(1) + ' MPa',
          tauMax: data.tauMax.toFixed(1) + ' MPa',
          thetaP: data.thetaP1Deg.toFixed(1) + '°',
          sxPrime: data.sxPrime.toFixed(1) + ' MPa',
          txyPrime: data.txyPrime.toFixed(1) + ' MPa'
        });
      } else if (this.subMode === 'truss_analysis') {
        const data = this._calcTruss();
        this.options.onTelemetryUpdate({
          subMode: 'truss_analysis',
          ay: `${Math.abs(data.Ay).toFixed(1)} kN (${data.Ay < 0 ? 'Down' : 'Up'})`,
          cy: `${data.Cy.toFixed(1)} kN (Up)`,
          ax: `${Math.abs(data.Ax).toFixed(1)} kN (Left)`,
          fab: `${Math.abs(data.Fab).toFixed(1)} kN (${data.Fab >= 0 ? 'Tension' : 'Compression'})`,
          fbc: `${Math.abs(data.Fbc).toFixed(1)} kN (${data.Fbc >= 0 ? 'Tension' : 'Compression'})`,
          fac: `${Math.abs(data.Fac).toFixed(1)} kN (${data.Fac >= 0 ? 'Tension' : 'Compression'})`
        });
      }
    }

    // =========================================================================
    // RENDERING PIPELINE
    // =========================================================================
    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      // Dark background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      if (this.subMode === 'simply_supported' || this.subMode === 'cantilever') {
        this._renderBeamAnalysis(ctx, w, h);
      } else if (this.subMode === 'mohr_circle') {
        this._renderMohrCircle(ctx, w, h);
      } else if (this.subMode === 'truss_analysis') {
        this._renderTrussAnalysis(ctx, w, h);
      }
    }

    _renderBeamAnalysis(ctx, w, h) {
      const isCantilever = (this.subMode === 'cantilever');
      const data = isCantilever ? this._calcCantilever() : this._calcSimplySupported();

      // Layout bands
      const padL = 75;
      const padR = 40;
      const plotW = w - padL - padR;

      const yBand1 = 20;  // Physical Beam diagram
      const hBand1 = 120;

      const yBand2 = 150; // SFD (Shear Force Diagram)
      const hBand2 = 100;

      const yBand3 = 265; // BMD (Bending Moment Diagram)
      const hBand3 = 105;

      const yBand4 = 385; // Deflection Elastic Curve
      const hBand4 = 95;

      // 1. Draw Physical Beam
      this._drawBeamDiagram(ctx, data, padL, plotW, yBand1, hBand1, isCantilever);

      // 2. Draw Shear Force Diagram (SFD)
      this._drawSFD(ctx, data, padL, plotW, yBand2, hBand2);

      // 3. Draw Bending Moment Diagram (BMD)
      this._drawBMD(ctx, data, padL, plotW, yBand3, hBand3);

      // 4. Draw Elastic Deflection Curve
      this._drawDeflection(ctx, data, padL, plotW, yBand4, hBand4);

      // 5. Hover inspection line & banner
      if (this.hoverState.active) {
        this._drawInspectionCursor(ctx, data, padL, plotW, yBand1, h - 35);
      }
    }

    _drawBeamDiagram(ctx, data, padL, plotW, topY, height, isCantilever) {
      const beamY = topY + 65;
      const L = data.L;
      const toX = (x) => padL + (x / L) * plotW;

      // Distributed Load (UDL) Hatching / Arrows
      if (data.w > 0) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        const udlHeight = Math.min(30, 10 + (data.w / 50) * 20);
        ctx.fillRect(padL, beamY - udlHeight, plotW, udlHeight);
        ctx.strokeRect(padL, beamY - udlHeight, plotW, udlHeight);

        // Arrows along UDL
        const numArrows = Math.max(4, Math.floor(plotW / 35));
        for (let i = 0; i <= numArrows; i++) {
          const ax = padL + (i / numArrows) * plotW;
          this._drawArrow(ctx, ax, beamY - udlHeight, ax, beamY - 2, '#F59E0B', 5);
        }

        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('w = ' + data.w.toFixed(1) + ' kN/m', padL + plotW / 2, beamY - udlHeight - 5);
      }

      // Point Load P
      if (data.P > 0) {
        const px = toX(data.a);
        const pLen = Math.min(48, 20 + (data.P / 100) * 28);
        this._drawArrow(ctx, px, beamY - pLen, px, beamY - 4, '#EF4444', 8);
        ctx.fillStyle = '#F87171';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('P = ' + data.P.toFixed(1) + ' kN', px, beamY - pLen - 6);
      }

      // Beam Body
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2;
      ctx.fillRect(padL, beamY - 4, plotW, 8);
      ctx.strokeRect(padL, beamY - 4, plotW, 8);

      // Supports
      if (!isCantilever) {
        // Pin support at A (x = 0)
        ctx.fillStyle = '#38BDF8';
        ctx.strokeStyle = '#0284C7';
        ctx.beginPath();
        ctx.moveTo(padL, beamY + 4);
        ctx.lineTo(padL - 10, beamY + 24);
        ctx.lineTo(padL + 10, beamY + 24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pin ground hatching
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(padL - 14, beamY + 24);
        ctx.lineTo(padL + 14, beamY + 24);
        ctx.stroke();

        // Roller support at B (x = L)
        const bx = padL + plotW;
        ctx.fillStyle = '#38BDF8';
        ctx.strokeStyle = '#0284C7';
        ctx.beginPath();
        ctx.moveTo(bx, beamY + 4);
        ctx.lineTo(bx - 10, beamY + 18);
        ctx.lineTo(bx + 10, beamY + 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rollers circles
        ctx.beginPath();
        ctx.arc(bx - 5, beamY + 22, 3, 0, Math.PI * 2);
        ctx.arc(bx + 5, beamY + 22, 3, 0, Math.PI * 2);
        ctx.fill();

        // Reactions text
        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('R_A = ' + data.Ra.toFixed(1) + ' kN', padL, beamY + 38);
        ctx.fillText('R_B = ' + data.Rb.toFixed(1) + ' kN', bx, beamY + 38);
        this._drawArrow(ctx, padL, beamY + 34, padL, beamY + 26, '#34D399', 4);
        this._drawArrow(ctx, bx, beamY + 34, bx, beamY + 26, '#34D399', 4);
      } else {
        // Cantilever fixed wall at left
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.fillRect(padL - 12, beamY - 24, 12, 48);
        ctx.strokeRect(padL - 12, beamY - 24, 12, 48);

        // Wall hatching
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        for (let y = beamY - 22; y <= beamY + 22; y += 6) {
          ctx.beginPath();
          ctx.moveTo(padL - 12, y);
          ctx.lineTo(padL - 2, y - 6);
          ctx.stroke();
        }

        // Reactions text
        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('R_A = ' + data.Ra.toFixed(1) + ' kN', padL + 6, beamY + 26);
        ctx.fillText('M_A = ' + data.Ma.toFixed(1) + ' kN·m', padL + 6, beamY + 38);
      }

      // Span dimension line
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      const dimY = topY + height - 5;
      ctx.beginPath();
      ctx.moveTo(padL, dimY);
      ctx.lineTo(padL + plotW, dimY);
      ctx.moveTo(padL, dimY - 4);
      ctx.lineTo(padL, dimY + 4);
      ctx.moveTo(padL + plotW, dimY - 4);
      ctx.lineTo(padL + plotW, dimY + 4);
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('L = ' + data.L.toFixed(1) + ' m', padL + plotW / 2, dimY - 4);
    }

    _drawSFD(ctx, data, padL, plotW, topY, height) {
      const midY = topY + height / 2;
      const toX = (x) => padL + (x / data.L) * plotW;

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('SFD V(x)', padL - 10, midY - 15);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('[kN]', padL - 10, midY);

      // Baseline
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, midY);
      ctx.lineTo(padL + plotW, midY);
      ctx.stroke();

      const peakV = Math.max(1, Math.abs(data.maxV), Math.abs(data.minV));
      const scaleV = (height / 2 - 12) / peakV;
      const toY = (v) => midY - v * scaleV;

      // Draw filled shear diagram
      ctx.beginPath();
      ctx.moveTo(toX(0), midY);
      data.samples.forEach(s => {
        ctx.lineTo(toX(s.x), toY(s.V));
      });
      ctx.lineTo(toX(data.L), midY);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, topY, 0, topY + height);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.35)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.samples.forEach((s, idx) => {
        if (idx === 0) ctx.moveTo(toX(s.x), toY(s.V));
        else ctx.lineTo(toX(s.x), toY(s.V));
      });
      ctx.stroke();

      // Annotate peak values
      ctx.fillStyle = '#7DD3FC';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('+' + data.maxV.toFixed(1) + ' kN', padL + 4, toY(data.maxV) - 4);
      if (data.minV < 0) {
        ctx.textAlign = 'right';
        ctx.fillText(data.minV.toFixed(1) + ' kN', padL + plotW - 4, toY(data.minV) + 12);
      }
    }

    _drawBMD(ctx, data, padL, plotW, topY, height) {
      const midY = topY + height / 2;
      const toX = (x) => padL + (x / data.L) * plotW;

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('BMD M(x)', padL - 10, midY - 15);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('[kN·m]', padL - 10, midY);

      // Baseline
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, midY);
      ctx.lineTo(padL + plotW, midY);
      ctx.stroke();

      const peakM = Math.max(1, Math.abs(data.maxM), Math.abs(data.minM));
      const scaleM = (height / 2 - 12) / peakM;
      const toY = (m) => midY - m * scaleM;

      // Filled moment diagram
      ctx.beginPath();
      ctx.moveTo(toX(0), midY);
      data.samples.forEach(s => {
        ctx.lineTo(toX(s.x), toY(s.M));
      });
      ctx.lineTo(toX(data.L), midY);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, topY, 0, topY + height);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.05)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0.35)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.samples.forEach((s, idx) => {
        if (idx === 0) ctx.moveTo(toX(s.x), toY(s.M));
        else ctx.lineTo(toX(s.x), toY(s.M));
      });
      ctx.stroke();

      // Annotate Max Moment
      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 10px monospace';
      if (data.maxM > 0) {
        ctx.textAlign = 'center';
        const maxSample = data.samples.reduce((prev, curr) => (curr.M > prev.M ? curr : prev), data.samples[0]);
        ctx.fillText('M_max = +' + data.maxM.toFixed(1) + ' kN·m', toX(maxSample.x), toY(data.maxM) - 5);
      } else if (data.minM < 0) {
        ctx.textAlign = 'left';
        ctx.fillText('M_wall = ' + data.minM.toFixed(1) + ' kN·m', padL + 4, toY(data.minM) + 12);
      }
    }

    _drawDeflection(ctx, data, padL, plotW, topY, height) {
      const midY = topY + 18;
      const toX = (x) => padL + (x / data.L) * plotW;

      ctx.fillStyle = '#A855F7';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('โก่งตัว ν(x)', padL - 10, midY + 4);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('[mm]', padL - 10, midY + 18);

      // Neutral dashed line
      ctx.strokeStyle = '#475569';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, midY);
      ctx.lineTo(padL + plotW, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      const peakDef = Math.max(0.1, data.maxDeflection);
      const scaleDef = (height - 35) / peakDef;
      const toY = (defMm) => midY + defMm * scaleDef;

      // Deflection curve
      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      data.samples.forEach((s, idx) => {
        if (idx === 0) ctx.moveTo(toX(s.x), toY(s.defMm));
        else ctx.lineTo(toX(s.x), toY(s.defMm));
      });
      ctx.stroke();

      // Peak deflection callout
      const maxSample = data.samples.reduce((prev, curr) => (curr.defMm > prev.defMm ? curr : prev), data.samples[0]);
      const peakX = toX(maxSample.x);
      const peakY = toY(maxSample.defMm);

      ctx.fillStyle = '#A855F7';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E9D5FF';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ν_max = ' + data.maxDeflection.toFixed(2) + ' mm (ที่ x = ' + maxSample.x.toFixed(2) + ' m)', peakX, peakY + 14);
    }

    _drawInspectionCursor(ctx, data, padL, plotW, topY, bottomY) {
      const xMeters = this.hoverState.xMeters;
      const toX = padL + (xMeters / data.L) * plotW;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(toX, topY);
      ctx.lineTo(toX, bottomY);
      ctx.stroke();
      ctx.setLineDash([]);

      const s = data.samples.reduce((prev, curr) => 
        Math.abs(curr.x - xMeters) < Math.abs(prev.x - xMeters) ? curr : prev, data.samples[0]);

      const boxW = 270;
      const boxH = 24;
      let boxX = toX - boxW / 2;
      if (boxX < padL) boxX = padL;
      if (boxX + boxW > padL + plotW) boxX = padL + plotW - boxW;
      const boxY = bottomY + 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        'x=' + s.x.toFixed(2) + 'm | V=' + s.V.toFixed(1) + 'kN | M=' + s.M.toFixed(1) + 'kN·m | ν=' + s.defMm.toFixed(2) + 'mm',
        boxX + boxW / 2,
        boxY + 16
      );
    }

    // =========================================================================
    // MOHR'S CIRCLE RENDERING
    // =========================================================================
    _renderMohrCircle(ctx, w, h) {
      const data = this._calcMohr();

      const circleW = w * 0.58;
      const circleCenterX = circleW * 0.5;
      const circleCenterY = h * 0.5;

      const radiusPx = (Math.min(circleW, h) * 0.38);
      const pxPerMpa = radiusPx / Math.max(40, data.R || 40);

      const toCanvasX = (sigma) => circleCenterX + (sigma - data.sigmaAvg) * pxPerMpa;
      const toCanvasY = (tau) => circleCenterY - tau * pxPerMpa;

      // Sigma axis
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(25, circleCenterY);
      ctx.lineTo(circleW - 15, circleCenterY);
      ctx.stroke();
      this._drawArrow(ctx, circleW - 25, circleCenterY, circleW - 10, circleCenterY, '#64748B', 4);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('σ (Normal Stress, MPa)', circleW - 15, circleCenterY - 8);

      // Tau axis
      const tauAxisX = circleCenterX - data.sigmaAvg * pxPerMpa;
      ctx.beginPath();
      ctx.moveTo(tauAxisX, h - 25);
      ctx.lineTo(tauAxisX, 25);
      ctx.stroke();
      this._drawArrow(ctx, tauAxisX, 35, tauAxisX, 20, '#64748B', 4);

      ctx.textAlign = 'left';
      ctx.fillText('τ (Shear Stress, MPa)', tauAxisX + 8, 30);

      // Mohr's Circle
      const cPxX = circleCenterX;
      const cPxY = circleCenterY;
      const rPx = data.R * pxPerMpa;

      const circleGrad = ctx.createRadialGradient(cPxX, cPxY, 0, cPxX, cPxY, rPx);
      circleGrad.addColorStop(0, 'rgba(56, 189, 248, 0.04)');
      circleGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.12)');
      circleGrad.addColorStop(1, 'rgba(56, 189, 248, 0.25)');
      ctx.fillStyle = circleGrad;
      ctx.beginPath();
      ctx.arc(cPxX, cPxY, rPx, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cPxX, cPxY, rPx, 0, Math.PI * 2);
      ctx.stroke();

      // Center C
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cPxX, cPxY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('C(' + data.sigmaAvg.toFixed(1) + ', 0)', cPxX, cPxY + 16);

      // Reference State Line: X(sx, -txy) to Y(sy, txy)
      const ptXx = toCanvasX(data.sx);
      const ptXy = toCanvasY(-data.txy);
      const ptYx = toCanvasX(data.sy);
      const ptYy = toCanvasY(data.txy);

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ptXx, ptXy);
      ctx.lineTo(ptYx, ptYy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point X
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(ptXx, ptXy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('X(' + data.sx.toFixed(1) + ', ' + (-data.txy).toFixed(1) + ')', ptXx + 6, ptXy - 4);

      // Point Y
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(ptYx, ptYy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.textAlign = 'right';
      ctx.fillText('Y(' + data.sy.toFixed(1) + ', ' + data.txy.toFixed(1) + ')', ptYx - 6, ptYy + 12);

      // Rotated State Line: X'(sx', -txy')
      const ptXPrimeX = toCanvasX(data.sxPrime);
      const ptXPrimeY = toCanvasY(-data.txyPrime);
      const ptYPrimeX = toCanvasX(data.syPrime);
      const ptYPrimeY = toCanvasY(data.txyPrime);

      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ptXPrimeX, ptXPrimeY);
      ctx.lineTo(ptYPrimeX, ptYPrimeY);
      ctx.stroke();

      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(ptXPrimeX, ptXPrimeY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("X'(" + data.sxPrime.toFixed(1) + ', ' + (-data.txyPrime).toFixed(1) + ')', ptXPrimeX + 8, ptXPrimeY - 6);

      // Principal stresses marks on axis
      const ptS1X = toCanvasX(data.sigma1);
      const ptS2X = toCanvasX(data.sigma2);

      ctx.fillStyle = '#A855F7';
      ctx.beginPath();
      ctx.arc(ptS1X, circleCenterY, 5, 0, Math.PI * 2);
      ctx.arc(ptS2X, circleCenterY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('σ_1 = ' + data.sigma1.toFixed(1), ptS1X, circleCenterY - 10);
      ctx.fillText('σ_2 = ' + data.sigma2.toFixed(1), ptS2X, circleCenterY - 10);

      // Right 42%: Rotated Stress Element
      this._drawStressElement(ctx, data, circleW + 20, w - 20, h);
    }

    _drawStressElement(ctx, data, leftX, rightX, h) {
      const elemCenterX = (leftX + rightX) / 2;
      const elemCenterY = h * 0.48;
      const size = 90;

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ชิ้นส่วนความเค้นที่หมุนทำมุม (Rotated Element)', elemCenterX, 35);
      ctx.font = '11px monospace';
      ctx.fillStyle = '#10B981';
      ctx.fillText('θ = ' + data.thetaDeg.toFixed(1) + '° | 2θ = ' + (data.thetaDeg * 2).toFixed(1) + '°', elemCenterX, 55);

      ctx.save();
      ctx.translate(elemCenterX, elemCenterY);
      ctx.rotate(-data.thetaRad);

      // Element Square
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.strokeRect(-size / 2, -size / 2, size, size);

      // Normal stress sigma_x'
      const arrowLenSx = Math.min(32, 10 + (Math.abs(data.sxPrime) / 150) * 22);
      const colorSx = data.sxPrime >= 0 ? '#10B981' : '#EF4444';

      if (data.sxPrime >= 0) {
        this._drawArrow(ctx, size / 2, 0, size / 2 + arrowLenSx, 0, colorSx, 5);
        this._drawArrow(ctx, -size / 2, 0, -size / 2 - arrowLenSx, 0, colorSx, 5);
      } else {
        this._drawArrow(ctx, size / 2 + arrowLenSx, 0, size / 2, 0, colorSx, 5);
        this._drawArrow(ctx, -size / 2 - arrowLenSx, 0, -size / 2, 0, colorSx, 5);
      }

      // Normal stress sigma_y'
      const arrowLenSy = Math.min(32, 10 + (Math.abs(data.syPrime) / 150) * 22);
      const colorSy = data.syPrime >= 0 ? '#10B981' : '#EF4444';

      if (data.syPrime >= 0) {
        this._drawArrow(ctx, 0, -size / 2, 0, -size / 2 - arrowLenSy, colorSy, 5);
        this._drawArrow(ctx, 0, size / 2, 0, size / 2 + arrowLenSy, colorSy, 5);
      } else {
        this._drawArrow(ctx, 0, -size / 2 - arrowLenSy, 0, -size / 2, colorSy, 5);
        this._drawArrow(ctx, 0, size / 2 + arrowLenSy, 0, size / 2, colorSy, 5);
      }

      // Shear stress tau_x'y'
      if (Math.abs(data.txyPrime) > 1.0) {
        const shearDir = data.txyPrime >= 0 ? 1 : -1;
        const colorT = '#F59E0B';
        this._drawArrow(ctx, size / 2 + 5, -shearDir * 20, size / 2 + 5, shearDir * 20, colorT, 4);
        this._drawArrow(ctx, -size / 2 - 5, shearDir * 20, -size / 2 - 5, -shearDir * 20, colorT, 4);
        this._drawArrow(ctx, -shearDir * 20, -size / 2 - 5, shearDir * 20, -size / 2 - 5, colorT, 4);
        this._drawArrow(ctx, shearDir * 20, size / 2 + 5, -shearDir * 20, size / 2 + 5, colorT, 4);
      }

      ctx.restore();

      const sumY = elemCenterY + size / 2 + 35;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("σ_x' = " + data.sxPrime.toFixed(1) + ' MPa', elemCenterX, sumY);
      ctx.fillText("σ_y' = " + data.syPrime.toFixed(1) + ' MPa', elemCenterX, sumY + 16);
      ctx.fillText("τ_x'y' = " + data.txyPrime.toFixed(1) + ' MPa', elemCenterX, sumY + 32);
      ctx.fillText('τ_max = ' + data.tauMax.toFixed(1) + ' MPa | θ_p = ' + data.thetaP1Deg.toFixed(1) + '°', elemCenterX, sumY + 48);
    }

    _renderTrussAnalysis(ctx, w, h) {
      const data = this._calcTruss();
      const isMobile = w < 600;

      // Header Banner
      const padX = isMobile ? 10 : 16;
      ctx.fillStyle = '#f8fafc';
      ctx.font = isMobile ? 'bold 11px sans-serif' : 'bold 15px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(isMobile ? '🏗️ วิเคราะห์โครงถัก 2D (Method of Joints)' : '🏗️ การวิเคราะห์โครงถักระนาบ 2D (Method of Joints & Equilibrium)', padX, isMobile ? 12 : 20);

      ctx.fillStyle = '#94a3b8';
      ctx.font = isMobile ? '9px sans-serif' : '11px sans-serif';
      ctx.fillText(isMobile ? `L = ${data.L.toFixed(1)}m | h = ${data.h.toFixed(1)}m | θ = ${data.thetaDeg.toFixed(1)}°` : `ช่วงสแปน L = ${data.L.toFixed(1)} m | ความสูง h = ${data.h.toFixed(1)} m | มุมเอียง θ = ${data.thetaDeg.toFixed(1)}°`, padX, isMobile ? 28 : 40);

      // Usable vertical layout space
      const headerH = isMobile ? 40 : 54;
      const cardH = isMobile ? 44 : 46;
      const cardY = h - cardH - (isMobile ? 4 : 8);

      // Dedicated vertical space reserved for reaction arrows & labels under baseline
      const reactionSpaceBelow = isMobile ? 38 : 50;
      const ay = cardY - reactionSpaceBelow;
      const cy = ay;

      // Space available for truss height
      const availTrussH = Math.max(50, ay - headerH - (isMobile ? 18 : 28));
      const availW = Math.max(120, w - (isMobile ? 70 : 130));

      // Scale truss to comfortably fit within available dimensions
      const scale = Math.min(availW / data.L, availTrussH / data.h);
      const trussPixelW = data.L * scale;
      const trussPixelH = data.h * scale;

      const ax = (w - trussPixelW) / 2;
      const cx = ax + trussPixelW;
      const bx = ax + trussPixelW / 2;
      const by = ay - trussPixelH;

      // Ground hatching under supports
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ax - 16, ay + 9); ctx.lineTo(ax + 16, ay + 9);
      ctx.moveTo(cx - 16, cy + 9); ctx.lineTo(cx + 16, cy + 9);
      ctx.stroke();

      for (let i = -12; i <= 12; i += 6) {
        ctx.beginPath();
        ctx.moveTo(ax + i, ay + 9); ctx.lineTo(ax + i - 4, ay + 14);
        ctx.moveTo(cx + i, cy + 9); ctx.lineTo(cx + i - 4, cy + 14);
        ctx.stroke();
      }

      // Support fixtures: Pin at A (Triangle)
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ax, ay); ctx.lineTo(ax - 9, ay + 9); ctx.lineTo(ax + 9, ay + 9); ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Support fixtures: Roller at C (Triangle + circles)
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(cx - 9, cy + 6); ctx.lineTo(cx + 9, cy + 6); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 4.5, cy + 8, 1.5, 0, Math.PI * 2);
      ctx.arc(cx + 4.5, cy + 8, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // Draw Members: AB, BC, AC with separated badge placements
      const drawMember = (x1, y1, x2, y2, force, name, placement) => {
        const isTension = force >= 0;
        const color = isTension ? '#38bdf8' : '#ef4444'; // blue for tension, red for compression
        ctx.strokeStyle = color;
        ctx.lineWidth = isMobile ? 4 : 5.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Inner core
        ctx.strokeStyle = isTension ? '#bae6fd' : '#fca5a5';
        ctx.lineWidth = isMobile ? 1.5 : 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Calculate member midpoint
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const tagText = isMobile 
          ? `${name}=${Math.abs(force).toFixed(1)}k(${isTension ? 'T' : 'C'})`
          : `${name} = ${Math.abs(force).toFixed(1)} kN (${isTension ? 'ดึง (T)' : 'อัด (C)'})`;
        ctx.font = isMobile ? 'bold 8px sans-serif' : 'bold 10px sans-serif';
        const tw = ctx.measureText(tagText).width + (isMobile ? 6 : 10);
        const th = isMobile ? 13 : 18;

        let badgeX = midX;
        let badgeY = midY;

        if (placement === 'left_outer') {
          // Member AB: shift outward to the left of the slanted member
          const dx = x2 - x1, dy = y2 - y1;
          const len = Math.hypot(dx, dy) || 1;
          const nx = dy / len;  // negative -> points left
          const ny = -dx / len; // negative -> points up
          const offset = isMobile ? 18 : 22;
          badgeX = midX + nx * offset - (isMobile ? 10 : 12);
          badgeY = midY + ny * offset;
        } else if (placement === 'right_outer') {
          // Member BC: shift outward to the right of the slanted member
          const dx = x2 - x1, dy = y2 - y1;
          const len = Math.hypot(dx, dy) || 1;
          const nx = dy / len;  // positive -> points right
          const ny = -dx / len; // negative -> points up
          const offset = isMobile ? 18 : 22;
          badgeX = midX + nx * offset + (isMobile ? 10 : 12);
          badgeY = midY + ny * offset;
        } else if (placement === 'bottom_inner') {
          // Member AC: horizontal bottom chord, place badge above member inside truss triangle
          badgeX = midX;
          badgeY = midY - (isMobile ? 9 : 13);
        }

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(badgeX - tw / 2, badgeY - th / 2, tw, th);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(badgeX - tw / 2, badgeY - th / 2, tw, th);

        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tagText, badgeX, badgeY);
      };

      // Draw 3 Members with separated badge placements to eliminate overlap
      drawMember(ax, ay, cx, cy, data.Fac, 'F_AC', 'bottom_inner');
      drawMember(ax, ay, bx, by, data.Fab, 'F_AB', 'left_outer');
      drawMember(bx, by, cx, cy, data.Fbc, 'F_BC', 'right_outer');

      // Draw Joints (Pin hinges A, B, C)
      const drawJoint = (x, y, label) => {
        ctx.beginPath();
        ctx.arc(x, y, isMobile ? 5 : 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = isMobile ? 'bold 9px sans-serif' : 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(label, x, y - (isMobile ? 5 : 8));
      };

      drawJoint(ax, ay, isMobile ? 'A' : 'A (Pin)');
      drawJoint(bx, by, isMobile ? 'B' : 'B (Apex)');
      drawJoint(cx, cy, isMobile ? 'C' : 'C (Roller)');

      // Draw Applied Load at B (Px pointing right)
      if (Math.abs(data.Px) > 0) {
        const arrLen = isMobile ? 22 : 45;
        this._drawArrow(ctx, bx + 6, by, bx + 6 + arrLen, by, '#f97316', 5);
        ctx.fillStyle = '#f97316';
        ctx.font = isMobile ? 'bold 8.5px sans-serif' : 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(isMobile ? `P=${data.Px.toFixed(0)}kN→` : `P = ${data.Px.toFixed(1)} kN →`, bx + 9 + arrLen, by);
      }

      // Draw Support Reactions with clean clearance above the bottom card:
      // At A: Ay (downwards = 30 kN), Ax (leftwards = 40 kN)
      if (data.Ay < 0) {
        const arrH = isMobile ? 12 : 20;
        this._drawArrow(ctx, ax, ay + 11, ax, ay + 11 + arrH, '#a855f7', 5);
        ctx.fillStyle = '#c084fc';
        ctx.font = isMobile ? 'bold 8px sans-serif' : 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(isMobile ? `Ay=${Math.abs(data.Ay).toFixed(0)}k↓` : `A_y = ${Math.abs(data.Ay).toFixed(1)} kN (ลง)`, ax, ay + 13 + arrH);
      }
      if (Math.abs(data.Ax) > 0) {
        const arrW = isMobile ? 18 : 32;
        this._drawArrow(ctx, ax - 7, ay, ax - 7 - arrW, ay, '#a855f7', 5);
        ctx.fillStyle = '#c084fc';
        ctx.font = isMobile ? 'bold 8px sans-serif' : 'bold 10px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(isMobile ? `Ax=${Math.abs(data.Ax).toFixed(0)}k←` : `A_x = ${Math.abs(data.Ax).toFixed(1)} kN (ซ้าย)`, ax - 9 - arrW, ay);
      }

      // At C: Cy (upwards = 30 kN)
      const cyArrH = isMobile ? 12 : 20;
      this._drawArrow(ctx, cx, cy + 11 + cyArrH, cx, cy + 11, '#10b981', 5);
      ctx.fillStyle = '#34d399';
      ctx.font = isMobile ? 'bold 8px sans-serif' : 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(isMobile ? `Cy=${data.Cy.toFixed(0)}k↑` : `C_y = ${data.Cy.toFixed(1)} kN (ขึ้น)`, cx, cy + 13 + cyArrH);

      // Bottom Telemetry Summary Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(8, cardY, w - 16, cardH);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, cardY, w - 16, cardH);

      ctx.fillStyle = '#38bdf8';
      ctx.font = isMobile ? 'bold 8px monospace' : 'bold 10.5px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      if (isMobile) {
        ctx.fillText(`แรงปฏิกิริยา: Ay=${Math.abs(data.Ay).toFixed(0)}kN(ลง) | Cy=${data.Cy.toFixed(0)}kN(ขึ้น) | Ax=${Math.abs(data.Ax).toFixed(0)}kN`, 12, cardY + 13);
        ctx.fillText(`แรงในก้าน: FAB=+${Math.abs(data.Fab).toFixed(1)}k(T) | FBC=-${Math.abs(data.Fbc).toFixed(1)}k(C) | FAC=+${data.Fac.toFixed(1)}k(T)`, 12, cardY + 31);
      } else {
        ctx.fillText(`สมดุลแรงภายนอก: ΣF_x=0 (A_x=-${Math.abs(data.Ax).toFixed(1)} kN) | ΣM_C=0 (A_y=-${Math.abs(data.Ay).toFixed(1)} kN ลง) | ΣF_y=0 (C_y=+${data.Cy.toFixed(1)} kN ขึ้น)`, 16, cardY + 15);
        ctx.fillText(`วิธีรอยต่อ (Method of Joints): ชิ้นส่วน AB = +${Math.abs(data.Fab).toFixed(1)} kN (Tension) | BC = -${Math.abs(data.Fbc).toFixed(1)} kN (Compression) | AC = +${data.Fac.toFixed(1)} kN`, 16, cardY + 33);
      }
    }

    _drawArrow(ctx, fromX, fromY, toX, toY, color = '#38BDF8', headLen = 6) {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }
  }

  return CivilBeamSimulator;
}));
