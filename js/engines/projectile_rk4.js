/**
 * projectile_rk4.js - Full-State 4th-Order Runge-Kutta 2D Projectile Engine
 * Part of PhysicsNoza 3.0 Architecture
 *
 * State Vector: u = [x, y, vx, vy]
 * Coordinate System:
 *   - Origin: (0, 0)
 *   - +x: Horizontal range forward (meters)
 *   - +y: Vertical height upward (meters)
 *   - Gravity: g > 0 downward (a_y = -g in vacuum)
 *   - Fluid: Calm air (no wind)
 *   - Aerodynamic Drag: F_drag = -c * ||v|| * v (quadratic drag, c >= 0 kg/m)
 *
 * Discretization:
 *   - Full-state 4th-order Runge-Kutta (Butcher Tableau)
 *   - Decoupled from display/frame rate
 *   - Exact landing event detection via root-finding / linear interpolation
 *   - Strict input validation rejecting NaN, Inf, non-positive dt/g/m, negative v0/c
 *
 * Compatible with Node.js (CommonJS / ES) and Browser global/ES module.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ProjectileRK4 = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Standard gravitational acceleration (CODATA 2018 / ISO standard)
  const DEFAULT_G = 9.80665;

  /**
   * Strictly validates simulation configuration parameters.
   * Throws TypeError or RangeError on any non-finite, negative, or out-of-range value.
   *
   * @param {Object} config
   * @returns {Object} Clean validated parameters
   */
  function validateParameters(config) {
    if (!config || typeof config !== 'object') {
      throw new TypeError('Configuration must be a non-null object');
    }

    const checkFinite = (val, name) => {
      if (typeof val !== 'number' || !Number.isFinite(val)) {
        throw new TypeError(`Parameter ${name} must be a finite number, received: ${val}`);
      }
    };

    // 1. Initial speed v0 >= 0
    checkFinite(config.v0, 'v0');
    if (config.v0 < 0) {
      throw new RangeError(`Initial speed v0 must be non-negative (v0 >= 0), received: ${config.v0}`);
    }

    // 2. Launch angle thetaDeg in [-90, 90]
    checkFinite(config.thetaDeg, 'thetaDeg');
    if (config.thetaDeg < -90 || config.thetaDeg > 90) {
      throw new RangeError(`Launch angle thetaDeg must be between -90 and +90 degrees, received: ${config.thetaDeg}`);
    }

    // 3. Mass m > 0 (strictly positive)
    checkFinite(config.m, 'm');
    if (config.m <= 0) {
      throw new RangeError(`Mass m must be strictly positive (m > 0), received: ${config.m}`);
    }

    // 4. Drag coefficient c >= 0
    checkFinite(config.c, 'c');
    if (config.c < 0) {
      throw new RangeError(`Drag factor c must be non-negative (c >= 0), received: ${config.c}`);
    }

    // 5. Gravity g > 0
    const g = config.g !== undefined ? config.g : DEFAULT_G;
    checkFinite(g, 'g');
    if (g <= 0) {
      throw new RangeError(`Gravitational acceleration g must be strictly positive (g > 0), received: ${g}`);
    }

    // 6. Coordinates and elevation: y0 >= yGround
    const x0 = config.x0 !== undefined ? config.x0 : 0.0;
    const y0 = config.y0 !== undefined ? config.y0 : 0.0;
    const yGround = config.yGround !== undefined ? config.yGround : 0.0;
    checkFinite(x0, 'x0');
    checkFinite(y0, 'y0');
    checkFinite(yGround, 'yGround');
    if (y0 < yGround) {
      throw new RangeError(`Initial height y0 (${y0}) cannot be below ground level yGround (${yGround})`);
    }
    if (y0 === yGround && config.thetaDeg < 0) {
      throw new RangeError(`Cannot launch downward (thetaDeg = ${config.thetaDeg}) from ground level (y0 = yGround)`);
    }

    // 7. Timestep dt > 0
    const dt = config.dt !== undefined ? config.dt : 0.001;
    checkFinite(dt, 'dt');
    if (dt <= 0) {
      throw new RangeError(`Timestep dt must be strictly positive (dt > 0), received: ${dt}`);
    }

    // 8. maxTime > 0
    const maxTime = config.maxTime !== undefined ? config.maxTime : 100.0;
    checkFinite(maxTime, 'maxTime');
    if (maxTime <= 0) {
      throw new RangeError(`maxTime must be strictly positive (maxTime > 0), received: ${maxTime}`);
    }

    // 9. recordInterval > 0
    const recordInterval = config.recordInterval !== undefined ? config.recordInterval : dt;
    checkFinite(recordInterval, 'recordInterval');
    if (recordInterval <= 0) {
      throw new RangeError(`recordInterval must be strictly positive (recordInterval > 0), received: ${recordInterval}`);
    }

    return {
      v0: config.v0,
      thetaDeg: config.thetaDeg,
      m: config.m,
      c: config.c,
      g,
      x0,
      y0,
      yGround,
      dt,
      maxTime,
      recordInterval
    };
  }

  /**
   * Evaluates system of 1st-order ODEs:
   *   dx/dt  = vx
   *   dy/dt  = vy
   *   dvx/dt = -(c/m) * sqrt(vx^2 + vy^2) * vx
   *   dvy/dt = -g - (c/m) * sqrt(vx^2 + vy^2) * vy
   *
   * @param {Array<number>} u - State vector [x, y, vx, vy]
   * @param {number} m - Mass (kg, > 0)
   * @param {number} c - Drag factor (kg/m, >= 0)
   * @param {number} g - Gravity (m/s^2, > 0)
   * @returns {Array<number>} du/dt = [vx, vy, ax, ay]
   */
  function derivatives(u, m, c, g) {
    const vx = u[2];
    const vy = u[3];
    const speed = Math.hypot(vx, vy);

    let ax = 0;
    let ay = -g;

    if (c > 0 && m > 0 && speed > 0) {
      const dragFactor = (c / m) * speed;
      ax -= dragFactor * vx;
      ay -= dragFactor * vy;
    }

    return [vx, vy, ax, ay];
  }

  /**
   * Advances the full 4D state vector by fixed timestep dt using 4th-order Runge-Kutta
   *
   * @param {Array<number>} u - Current state [x, y, vx, vy]
   * @param {number} dt - Timestep (seconds)
   * @param {number} m - Mass (kg)
   * @param {number} c - Drag factor (kg/m)
   * @param {number} g - Gravity (m/s^2)
   * @returns {Array<number>} Next state u_next = [x, y, vx, vy]
   */
  function rk4Step(u, dt, m, c, g) {
    // k1 = f(u)
    const k1 = derivatives(u, m, c, g);

    // k2 = f(u + 0.5 * dt * k1)
    const u2 = [
      u[0] + 0.5 * dt * k1[0],
      u[1] + 0.5 * dt * k1[1],
      u[2] + 0.5 * dt * k1[2],
      u[3] + 0.5 * dt * k1[3]
    ];
    const k2 = derivatives(u2, m, c, g);

    // k3 = f(u + 0.5 * dt * k2)
    const u3 = [
      u[0] + 0.5 * dt * k2[0],
      u[1] + 0.5 * dt * k2[1],
      u[2] + 0.5 * dt * k2[2],
      u[3] + 0.5 * dt * k2[3]
    ];
    const k3 = derivatives(u3, m, c, g);

    // k4 = f(u + dt * k3)
    const u4 = [
      u[0] + dt * k3[0],
      u[1] + dt * k3[1],
      u[2] + dt * k3[2],
      u[3] + dt * k3[3]
    ];
    const k4 = derivatives(u4, m, c, g);

    // Weighted average: u_next = u + (dt / 6) * (k1 + 2*k2 + 2*k3 + k4)
    return [
      u[0] + (dt / 6.0) * (k1[0] + 2.0 * k2[0] + 2.0 * k3[0] + k4[0]),
      u[1] + (dt / 6.0) * (k1[1] + 2.0 * k2[1] + 2.0 * k3[1] + k4[1]),
      u[2] + (dt / 6.0) * (k1[2] + 2.0 * k2[2] + 2.0 * k3[2] + k4[2]),
      u[3] + (dt / 6.0) * (k1[3] + 2.0 * k2[3] + 2.0 * k3[3] + k4[3])
    ];
  }

  /**
   * Computes exact landing event by linear interpolation between last positive height and sub-ground state
   */
  function interpolateLanding(uPrev, uNext, tPrev, dt, yGround) {
    const y0 = uPrev[1];
    const y1 = uNext[1];
    const denom = y1 - y0;
    const r = (Math.abs(denom) > 1e-14) ? (yGround - y0) / denom : 0.0;
    const clampR = Math.max(0.0, Math.min(1.0, r));

    const tLand = tPrev + clampR * dt;
    const xLand = uPrev[0] + clampR * (uNext[0] - uPrev[0]);
    const vxLand = uPrev[2] + clampR * (uNext[2] - uPrev[2]);
    const vyLand = uPrev[3] + clampR * (uNext[3] - uPrev[3]);

    return {
      t: tLand,
      x: xLand,
      y: yGround,
      vx: vxLand,
      vy: vyLand,
      speed: Math.hypot(vxLand, vyLand)
    };
  }

  /**
   * Calculates closed-form analytic vacuum trajectory (Galileo baseline)
   */
  function calculateVacuumTrajectory(params) {
    if (!params || typeof params !== 'object') {
      throw new TypeError('Configuration must be a non-null object');
    }
    const checkFinite = (val, name) => {
      if (typeof val !== 'number' || !Number.isFinite(val)) {
        throw new TypeError(`Parameter ${name} must be a finite number, received: ${val}`);
      }
    };
    checkFinite(params.v0, 'v0');
    if (params.v0 < 0) throw new RangeError('v0 must be non-negative');
    checkFinite(params.thetaDeg, 'thetaDeg');
    if (params.thetaDeg < -90 || params.thetaDeg > 90) throw new RangeError('thetaDeg must be in [-90, 90]');

    const v0 = params.v0;
    const thetaRad = (params.thetaDeg * Math.PI) / 180.0;
    const x0 = params.x0 !== undefined ? params.x0 : 0.0;
    const y0 = params.y0 !== undefined ? params.y0 : 0.0;
    const g = params.g !== undefined ? params.g : DEFAULT_G;
    const yGround = params.yGround !== undefined ? params.yGround : 0.0;
    checkFinite(x0, 'x0');
    checkFinite(y0, 'y0');
    checkFinite(g, 'g');
    checkFinite(yGround, 'yGround');
    if (g <= 0) throw new RangeError('g must be positive');
    if (y0 < yGround) throw new RangeError('y0 cannot be below yGround');

    const vx0 = v0 * Math.cos(thetaRad);
    const vy0 = v0 * Math.sin(thetaRad);

    // Discriminant for flight time: y(t) = y0 + vy0*t - 0.5*g*t^2 = yGround
    // 0.5*g*t^2 - vy0*t - (y0 - yGround) = 0
    const disc = vy0 * vy0 + 2.0 * g * (y0 - yGround);
    let flightTime = 0.0;
    if (disc >= 0) {
      flightTime = (vy0 + Math.sqrt(disc)) / g;
    }
    const range = x0 + vx0 * flightTime;

    // Apex
    let tApex = 0.0;
    let yApex = y0;
    let xApex = x0;
    if (vy0 > 0) {
      tApex = vy0 / g;
      yApex = y0 + (vy0 * vy0) / (2.0 * g);
      xApex = x0 + vx0 * tApex;
    }

    // Generate discrete curve points for overlay
    const points = [];
    const stepCount = 200;
    const dtVac = flightTime > 0 ? flightTime / stepCount : 0.01;
    for (let i = 0; i <= stepCount; i++) {
      const t = i * dtVac;
      const x = x0 + vx0 * t;
      const y = y0 + vy0 * t - 0.5 * g * t * t;
      const vx = vx0;
      const vy = vy0 - g * t;
      points.push({ t, x, y: Math.max(yGround, y), vx, vy, speed: Math.hypot(vx, vy) });
    }

    return {
      flightTime,
      range,
      tApex,
      xApex,
      yApex,
      impactSpeed: Math.hypot(vx0, vy0 - g * flightTime),
      points
    };
  }

  /**
   * Simulates full trajectory using RK4 until ground contact or timeout
   *
   * @param {Object} config
   * @returns {Object} Full simulation report with telemetry and path
   */
  function simulateTrajectory(config) {
    const valid = validateParameters(config);

    const v0 = valid.v0;
    const thetaDeg = valid.thetaDeg;
    const m = valid.m;
    const c = valid.c;
    const g = valid.g;
    const x0 = valid.x0;
    const y0 = valid.y0;
    const yGround = valid.yGround;
    const dt = valid.dt;
    const maxTime = valid.maxTime;
    const recordInterval = valid.recordInterval;

    const thetaRad = (thetaDeg * Math.PI) / 180.0;
    let vx = v0 * Math.cos(thetaRad);
    let vy = v0 * Math.sin(thetaRad);
    let u = [x0, y0, vx, vy];
    let t = 0.0;

    const trajectory = [];
    let nextRecordTime = 0.0;

    let yMax = y0;
    let tMax = 0.0;
    let xAtYMax = x0;

    // Helper for telemetry state
    function makeState(tNow, state) {
      const spd = Math.hypot(state[2], state[3]);
      const derivs = derivatives(state, m, c, g);
      const ek = 0.5 * m * spd * spd;
      const ep = m * g * (state[1] - yGround);
      return {
        t: tNow,
        x: state[0],
        y: state[1],
        vx: state[2],
        vy: state[3],
        ax: derivs[2],
        ay: derivs[3],
        speed: spd,
        ek,
        ep,
        etotal: ek + ep
      };
    }

    trajectory.push(makeState(t, u));

    let landed = false;
    let landingInfo = null;

    // Guard against any infinite execution loop
    const maxSteps = Math.min(1000000, Math.ceil(maxTime / dt) + 100);
    let stepCount = 0;

    while (t < maxTime && stepCount++ < maxSteps) {
      const uNext = rk4Step(u, dt, m, c, g);
      const tNext = t + dt;

      // Check apex
      if (uNext[1] > yMax) {
        yMax = uNext[1];
        tMax = tNext;
        xAtYMax = uNext[0];
      }

      // Check landing event
      if (uNext[1] <= yGround) {
        landingInfo = interpolateLanding(u, uNext, t, dt, yGround);
        const finalDerivs = derivatives([landingInfo.x, landingInfo.y, landingInfo.vx, landingInfo.vy], m, c, g);
        const ekFinal = 0.5 * m * landingInfo.speed * landingInfo.speed;
        trajectory.push({
          t: landingInfo.t,
          x: landingInfo.x,
          y: yGround,
          vx: landingInfo.vx,
          vy: landingInfo.vy,
          ax: finalDerivs[2],
          ay: finalDerivs[3],
          speed: landingInfo.speed,
          ek: ekFinal,
          ep: 0.0,
          etotal: ekFinal
        });
        landed = true;
        break;
      }

      u = uNext;
      t = tNext;

      if (t >= nextRecordTime) {
        trajectory.push(makeState(t, u));
        nextRecordTime += recordInterval;
      }
    }

    if (!landed) {
      landingInfo = {
        t,
        x: u[0],
        y: u[1],
        vx: u[2],
        vy: u[3],
        speed: Math.hypot(u[2], u[3]),
        timedOut: true
      };
    }

    // Analytic vacuum baseline
    const vacuum = calculateVacuumTrajectory({
      v0,
      thetaDeg,
      x0,
      y0,
      g,
      yGround
    });

    // Terminal velocity: vt = sqrt(m * g / c)
    const terminalVelocity = c > 0 ? Math.sqrt((m * g) / c) : Infinity;

    const initialE = trajectory[0].etotal;
    const finalE = trajectory[trajectory.length - 1].etotal;
    const dissipationFraction = initialE > 0 ? (initialE - finalE) / initialE : 0.0;

    return {
      params: {
        v0,
        thetaDeg,
        m,
        c,
        g,
        x0,
        y0,
        yGround,
        dt,
        maxTime,
        recordInterval
      },
      trajectory,
      landing: landingInfo,
      apex: {
        t: tMax,
        x: xAtYMax,
        y: yMax
      },
      energetics: {
        initial: initialE,
        final: finalE,
        dissipated: initialE - finalE,
        dissipationFraction
      },
      vacuum,
      terminalVelocity,
      totalStepsComputed: trajectory.length
    };
  }

  return {
    DEFAULT_G,
    validateParameters,
    derivatives,
    rk4Step,
    interpolateLanding,
    calculateVacuumTrajectory,
    simulateTrajectory
  };
}));
