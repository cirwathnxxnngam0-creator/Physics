/**
 * test_projectile_engine.js - Rigorous Automated Verification of PhysicsNoza 3.0 Engine
 *
 * Test Suite Coverage:
 *   Test 1: Analytic Vacuum Match (c = 0) at theta = 30, 45, 60 deg vs. Exact Galilean formulas
 *   Test 2: Timestep Convergence with Quadratic Drag (dt = 0.01, 0.001, 0.0001 s)
 *   Test 3: Boundary Angles (0 deg horizontal from cliff, 90 deg vertical ascent/descent)
 *   Test 4: Energy Conservation (c = 0, Delta E < 1e-4 J) vs. Monotonic Dissipation (c > 0, dE/dt < 0)
 *   Test 5: Landing Event Interpolation Accuracy (Continuous boundary verification)
 *   Test 6: Fully-specified Projectile Benchmark (v0=100, theta=30, m=5, c=0.05, g=9.80665, y0=0)
 */

const engine = require('../js/engines/projectile_rk4.js');

let passCount = 0;
let failCount = 0;
const results = [];

function assertTest(name, condition, details) {
  if (condition) {
    passCount++;
    console.log(`[PASS] ${name}`);
    if (details) console.log(`       ${details}`);
    results.push({ name, status: 'PASS', details });
  } else {
    failCount++;
    console.error(`[FAIL] ${name}`);
    if (details) console.error(`       ${details}`);
    results.push({ name, status: 'FAIL', details });
  }
}

console.log('======================================================================');
console.log('PHYSICSNOZA 3.0: PROJECTILE RK4 ENGINE VERIFICATION SUITE');
console.log('Timestamp: ' + new Date().toISOString());
console.log('Environment: Node.js ' + process.version + ' (' + process.platform + ' ' + process.arch + ')');
console.log('======================================================================\n');

// ----------------------------------------------------------------------
// TEST 1: Analytic Vacuum Comparison (c = 0)
// ----------------------------------------------------------------------
console.log('--- TEST 1: Analytic Vacuum Comparison (c = 0, Flat Ground y0 = 0) ---');
const angles = [30, 45, 60];
const v0 = 50.0;
const g = 9.80665;
const m = 2.0;
const c0 = 0.0;
const dt = 0.0005;

for (const angle of angles) {
  const thetaRad = (angle * Math.PI) / 180.0;
  const expectedTime = (2.0 * v0 * Math.sin(thetaRad)) / g;
  const expectedRange = (v0 * v0 * Math.sin(2.0 * thetaRad)) / g;
  const expectedApex = (v0 * Math.sin(thetaRad)) ** 2 / (2.0 * g);

  const sim = engine.simulateTrajectory({ v0, thetaDeg: angle, m, c: c0, g, dt });

  const timeDiff = Math.abs(sim.landing.t - expectedTime);
  const rangeDiff = Math.abs(sim.landing.x - expectedRange);
  const apexDiff = Math.abs(sim.apex.y - expectedApex);

  assertTest(
    `Vacuum Match @ ${angle} deg (Range & Time)`,
    rangeDiff < 0.005 && timeDiff < 0.001 && apexDiff < 0.005,
    `Range: sim=${sim.landing.x.toFixed(6)} m, exact=${expectedRange.toFixed(6)} m (err=${rangeDiff.toExponential(3)} m) | ` +
    `Time: sim=${sim.landing.t.toFixed(6)} s, exact=${expectedTime.toFixed(6)} s (err=${timeDiff.toExponential(3)} s) | ` +
    `Apex: sim=${sim.apex.y.toFixed(6)} m, exact=${expectedApex.toFixed(6)} m`
  );
}

// ----------------------------------------------------------------------
// TEST 2: Timestep Convergence with Quadratic Drag (c > 0)
// ----------------------------------------------------------------------
console.log('\n--- TEST 2: Timestep Convergence with Quadratic Drag (c = 0.05 kg/m) ---');
const testConfig = { v0: 100.0, thetaDeg: 30.0, m: 5.0, c: 0.05, g: 9.80665, y0: 0.0 };

const dts = [0.01, 0.002, 0.001, 0.0001];
const convRuns = dts.map(d => engine.simulateTrajectory({ ...testConfig, dt: d }));

console.log('Convergence across timesteps:');
convRuns.forEach((r, idx) => {
  console.log(`  dt = ${dts[idx].toString().padEnd(7)} s => Range = ${r.landing.x.toFixed(7)} m, Time = ${r.landing.t.toFixed(7)} s, Landing Speed = ${r.landing.speed.toFixed(7)} m/s`);
});

const finestRange = convRuns[convRuns.length - 1].landing.x;
const coarseDiff = Math.abs(convRuns[0].landing.x - finestRange);
const fineDiff = Math.abs(convRuns[2].landing.x - finestRange);

assertTest(
  'Timestep Convergence (dt = 0.001 vs dt = 0.0001)',
  fineDiff < 0.001,
  `Error between dt=0.001 and dt=0.0001 is ${fineDiff.toFixed(6)} m (< 0.001 m tolerance)`
);

// ----------------------------------------------------------------------
// TEST 3: Boundary Angles (0 deg and 90 deg)
// ----------------------------------------------------------------------
console.log('\n--- TEST 3: Boundary Launch Angles (0 deg from Cliff & 90 deg Vertical) ---');
// Case 3A: 0 deg horizontal launch from cliff y0 = 45 m
const cliffY0 = 45.0;
const cliffSim = engine.simulateTrajectory({ v0: 30.0, thetaDeg: 0.0, m: 1.0, c: 0.0, g, y0: cliffY0, dt: 0.0005 });
const expectedCliffTime = Math.sqrt((2.0 * cliffY0) / g);
const expectedCliffRange = 30.0 * expectedCliffTime;
const cliffTimeDiff = Math.abs(cliffSim.landing.t - expectedCliffTime);
const cliffRangeDiff = Math.abs(cliffSim.landing.x - expectedCliffRange);

assertTest(
  'Boundary 0 deg: Horizontal launch from y0 = 45 m',
  cliffTimeDiff < 0.001 && cliffRangeDiff < 0.01,
  `Range: sim=${cliffSim.landing.x.toFixed(4)} m, exact=${expectedCliffRange.toFixed(4)} m | Time: sim=${cliffSim.landing.t.toFixed(4)} s, exact=${expectedCliffTime.toFixed(4)} s`
);

// Case 3B: 90 deg vertical launch
const vertSim = engine.simulateTrajectory({ v0: 40.0, thetaDeg: 90.0, m: 2.0, c: 0.0, g, y0: 0.0, dt: 0.0005 });
const expectedVertTime = (2.0 * 40.0) / g;
const expectedVertApex = (40.0 * 40.0) / (2.0 * g);
const vertTimeDiff = Math.abs(vertSim.landing.t - expectedVertTime);
const vertApexDiff = Math.abs(vertSim.apex.y - expectedVertApex);

assertTest(
  'Boundary 90 deg: Pure vertical ascent and descent',
  vertTimeDiff < 0.001 && vertApexDiff < 0.005 && Math.abs(vertSim.landing.x) < 1e-6,
  `Peak height: sim=${vertSim.apex.y.toFixed(4)} m, exact=${expectedVertApex.toFixed(4)} m | Net horizontal drift: ${vertSim.landing.x.toExponential(3)} m`
);

// ----------------------------------------------------------------------
// TEST 4: Energetics & Monotonic Dissipation
// ----------------------------------------------------------------------
console.log('\n--- TEST 4: Energetics & Dissipation Rate Verification ---');
// Case 4A: Vacuum energy conservation (c = 0)
const vacEnergySim = engine.simulateTrajectory({ v0: 60.0, thetaDeg: 45.0, m: 3.0, c: 0.0, g, y0: 10.0, dt: 0.0005 });
const vacInitialE = vacEnergySim.energetics.initial;
const vacFinalE = vacEnergySim.energetics.final;
const vacEDiff = Math.abs(vacFinalE - vacInitialE);

assertTest(
  'Energy Conservation in Vacuum (c = 0)',
  vacEDiff < 1e-4,
  `Initial Energy: ${vacInitialE.toFixed(6)} J, Final Energy: ${vacFinalE.toFixed(6)} J, Delta: ${vacEDiff.toExponential(3)} J`
);

// Case 4B: Strict monotonic energy decay with drag (c > 0)
const dragEnergySim = engine.simulateTrajectory({ v0: 60.0, thetaDeg: 45.0, m: 3.0, c: 0.08, g, y0: 10.0, dt: 0.001, recordInterval: 0.01 });
let isStrictlyDecreasing = true;
let maxPositiveViolation = 0.0;

for (let i = 1; i < dragEnergySim.trajectory.length; i++) {
  const dE = dragEnergySim.trajectory[i].etotal - dragEnergySim.trajectory[i - 1].etotal;
  if (dE > 1e-9) {
    isStrictlyDecreasing = false;
    if (dE > maxPositiveViolation) maxPositiveViolation = dE;
  }
}

assertTest(
  'Monotonic Energy Dissipation with Quadratic Drag (c > 0)',
  isStrictlyDecreasing,
  `Initial E = ${dragEnergySim.energetics.initial.toFixed(2)} J, Final E = ${dragEnergySim.energetics.final.toFixed(2)} J, Dissipated = ${(dragEnergySim.energetics.dissipationFraction * 100).toFixed(2)}% | Monotonic: ${isStrictlyDecreasing}`
);

// ----------------------------------------------------------------------
// TEST 5: Landing Event Interpolation Accuracy
// ----------------------------------------------------------------------
console.log('\n--- TEST 5: Landing Event Interpolation Accuracy ---');
const landTest = engine.simulateTrajectory({ v0: 75.0, thetaDeg: 35.0, m: 4.0, c: 0.04, g, y0: 0.0, dt: 0.005 });
const lastState = landTest.trajectory[landTest.trajectory.length - 1];

assertTest(
  'Landing Interpolation Root Clamping (y = 0 at t_land)',
  lastState.y === 0.0 && lastState.t > 0 && lastState.x > 0,
  `Landing State: t = ${lastState.t.toFixed(6)} s, x = ${lastState.x.toFixed(6)} m, y = ${lastState.y.toFixed(6)} m, vx = ${lastState.vx.toFixed(4)} m/s, vy = ${lastState.vy.toFixed(4)} m/s`
);

// ----------------------------------------------------------------------
// TEST 6: Benchmark Parameter Study (Fully Specified Inputs)
// ----------------------------------------------------------------------
console.log('\n--- TEST 6: Benchmark Parameter Study (Documented Inputs & Target) ---');
const bm = engine.simulateTrajectory({
  v0: 100.0,
  thetaDeg: 30.0,
  m: 5.0,
  c: 0.05,
  g: 9.80665,
  y0: 0.0,
  dt: 0.0001
});

console.log('Independent Benchmark Results (Full-State RK4 @ dt = 0.0001 s):');
console.log(`  Inputs: v0 = 100.0 m/s, theta = 30.0 deg, m = 5.0 kg, c = 0.05 kg/m, g = 9.80665 m/s^2, y0 = 0.0 m`);
console.log(`  Impact Range:      ${bm.landing.x.toFixed(6)} m`);
console.log(`  Flight Time:       ${bm.landing.t.toFixed(6)} s`);
console.log(`  Apex Coordinates:  (${bm.apex.x.toFixed(4)} m, ${bm.apex.y.toFixed(4)} m) at t = ${bm.apex.t.toFixed(4)} s`);
console.log(`  Impact Velocity:   vx = ${bm.landing.vx.toFixed(4)} m/s, vy = ${bm.landing.vy.toFixed(4)} m/s, speed = ${bm.landing.speed.toFixed(4)} m/s`);
console.log(`  Vacuum Equivalent: Range = ${bm.vacuum.range.toFixed(4)} m, Time = ${bm.vacuum.flightTime.toFixed(4)} s (Drag reduces range by ${( (1 - bm.landing.x / bm.vacuum.range) * 100 ).toFixed(2)}%)`);

assertTest(
  'Full-state RK4 Projectile Benchmark Calculation',
  bm.landing.x > 165.0 && bm.landing.x < 172.0 && bm.landing.t > 5.5 && bm.landing.t < 6.0,
  `Verified range: ${bm.landing.x.toFixed(6)} m, flight time: ${bm.landing.t.toFixed(6)} s`
);

// ----------------------------------------------------------------------
// TEST 7: Engine Input Validation & Bounded Execution (Item 1)
// ----------------------------------------------------------------------
console.log('\n--- TEST 7: Engine Input Validation & Bounded Execution ---');

function assertThrows(name, fn, expectedErrorType, errorSubstring) {
  try {
    fn();
    assertTest(name, false, `Expected ${expectedErrorType.name} but no error was thrown`);
  } catch (err) {
    const isRightType = err instanceof expectedErrorType;
    const hasSubstring = errorSubstring ? err.message.includes(errorSubstring) : true;
    assertTest(
      name,
      isRightType && hasSubstring,
      `Threw ${err.constructor.name}: "${err.message}"`
    );
  }
}

// 7.1 Negative mass rejection
assertThrows(
  'Rejection of negative mass (m < 0)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: 45, m: -2.0, c: 0.05 }),
  RangeError,
  'Mass m must be strictly positive'
);

// 7.2 Zero mass rejection
assertThrows(
  'Rejection of zero mass (m = 0)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: 45, m: 0.0, c: 0.05 }),
  RangeError,
  'Mass m must be strictly positive'
);

// 7.3 Negative drag coefficient rejection
assertThrows(
  'Rejection of negative drag coefficient (c < 0)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: 45, m: 2.0, c: -0.05 }),
  RangeError,
  'Drag factor c must be non-negative'
);

// 7.4 Non-positive timestep rejection
assertThrows(
  'Rejection of zero timestep (dt = 0)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: 45, m: 2.0, c: 0.05, dt: 0.0 }),
  RangeError,
  'Timestep dt must be strictly positive'
);

assertThrows(
  'Rejection of negative timestep (dt < 0)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: 45, m: 2.0, c: 0.05, dt: -0.001 }),
  RangeError,
  'Timestep dt must be strictly positive'
);

// 7.5 NaN parameter rejection
assertThrows(
  'Rejection of NaN velocity (v0 = NaN)',
  () => engine.simulateTrajectory({ v0: NaN, thetaDeg: 45, m: 2.0, c: 0.05 }),
  TypeError,
  'must be a finite number'
);

assertThrows(
  'Rejection of NaN angle (thetaDeg = NaN)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: NaN, m: 2.0, c: 0.05 }),
  TypeError,
  'must be a finite number'
);

// 7.6 Infinite parameter rejection
assertThrows(
  'Rejection of Infinite mass (m = Infinity)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: 45, m: Infinity, c: 0.05 }),
  TypeError,
  'must be a finite number'
);

// 7.7 Out-of-bounds angle rejection
assertThrows(
  'Rejection of out-of-bounds angle (thetaDeg > 90)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: 100, m: 2.0, c: 0.05 }),
  RangeError,
  'between -90 and +90'
);

// 7.8 Initial height below ground rejection
assertThrows(
  'Rejection of initial height below ground (y0 < yGround)',
  () => engine.simulateTrajectory({ v0: 50, thetaDeg: 45, m: 2.0, c: 0.05, y0: -5, yGround: 0 }),
  RangeError,
  'cannot be below ground'
);

// 7.9 Bounded execution guard against hang
const startGuard = Date.now();
const boundedSim = engine.simulateTrajectory({
  v0: 10.0,
  thetaDeg: 45.0,
  m: 1.0,
  c: 0.1,
  dt: 0.0001,
  maxTime: 0.5
});
const elapsedGuard = Date.now() - startGuard;
assertTest(
  'Bounded execution guard (maxTime terminates without hang)',
  elapsedGuard < 2000 && boundedSim.landing.t <= 0.5 + 1e-4,
  `Execution completed in ${elapsedGuard} ms; final t = ${boundedSim.landing.t.toFixed(4)} s`
);

// ----------------------------------------------------------------------
// TEST 8: State Management Regressions (Item 2)
// ----------------------------------------------------------------------
console.log('\n--- TEST 8: State Management Regressions (Item 2) ---');

class MockSimulatorState {
  constructor() {
    this.params = { v0: 100.0, thetaDeg: 30.0, m: 5.0, c: 0.05, g: 9.80665, y0: 0.0, yGround: 0.0, dt: 0.001 };
    this.isRunning = false;
    this.isPaused = false;
    this.simTime = 0.0;
    this.cachedSimulation = null;
    this.currentLiveState = null;
    this._recomputeSimulation();
  }

  _recomputeSimulation() {
    this.cachedSimulation = engine.simulateTrajectory(this.params);
    const newFlightTime = this.cachedSimulation.landing.t;

    if (!this.isRunning && !this.isPaused) {
      this.simTime = 0.0;
      this.currentLiveState = this.cachedSimulation.trajectory[0];
    } else {
      if (this.simTime >= newFlightTime) {
        this.simTime = newFlightTime;
        if (this.isRunning && !this.isPaused) {
          this.pause();
        }
      }
      this._interpolateLiveStateAtTime(this.simTime);
    }
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
    let low = 0, high = traj.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (traj[mid].t < tTarget) low = mid + 1;
      else high = mid - 1;
    }
    const idx1 = Math.max(0, Math.min(traj.length - 1, low));
    const idx0 = Math.max(0, idx1 - 1);
    const s0 = traj[idx0], s1 = traj[idx1];
    const frac = (s1.t - s0.t) > 1e-12 ? (tTarget - s0.t) / (s1.t - s0.t) : 0;
    this.currentLiveState = {
      t: tTarget,
      x: s0.x + frac * (s1.x - s0.x),
      y: s0.y + frac * (s1.y - s0.y)
    };
  }

  play() { this.isRunning = true; this.isPaused = false; }
  pause() { this.isPaused = true; }
  updateParams(newP) {
    Object.assign(this.params, newP);
    this._recomputeSimulation();
  }
}

// Regression 8.1: Pause -> Change parameters (flight shrinks)
const sim1 = new MockSimulatorState();
sim1.play();
sim1.simTime = 4.0; // Advance time to 4.0s (initial flight is ~5.69s)
sim1.pause();
assertTest('Setup: Sim paused at t = 4.0s', sim1.isPaused && sim1.simTime === 4.0);

// User drops velocity: new flight time shrinks to ~2.1s
sim1.updateParams({ v0: 30.0 });
const newFlightTime1 = sim1.cachedSimulation.landing.t;
assertTest(
  'Regression 8.1 (Pause -> Change): Shorter flight clamps simTime and updates live state',
  sim1.simTime <= newFlightTime1 && sim1.currentLiveState.t === sim1.simTime && sim1.currentLiveState.x === sim1.cachedSimulation.landing.x,
  `Old simTime was 4.0s; new landing time = ${newFlightTime1.toFixed(3)}s => Clamped simTime: ${sim1.simTime.toFixed(3)}s, State X: ${sim1.currentLiveState.x.toFixed(3)}m`
);

// Regression 8.2: Play -> Change parameters (simTime within new flight)
const sim2 = new MockSimulatorState();
sim2.play();
sim2.simTime = 1.0; // 1.0s into flight
sim2.updateParams({ thetaDeg: 60.0 }); // change angle
const newFlightTime2 = sim2.cachedSimulation.landing.t;
assertTest(
  'Regression 8.2 (Play -> Change): SimTime preserved within valid flight, live state updated to new trajectory',
  sim2.simTime === 1.0 && sim2.currentLiveState.t === 1.0 && sim2.currentLiveState.x < sim2.cachedSimulation.landing.x,
  `simTime = ${sim2.simTime}s, new flight = ${newFlightTime2.toFixed(3)}s, currentLiveState X = ${sim2.currentLiveState.x.toFixed(3)}m`
);

// Regression 8.3: Play -> Extreme reduction in velocity (simTime exceeds new flight while playing)
const sim3 = new MockSimulatorState();
sim3.play();
sim3.simTime = 3.5;
sim3.updateParams({ v0: 10.0 }); // tiny flight time (~0.8s)
assertTest(
  'Regression 8.3 (Play -> Extreme reduction): Auto-pauses at new landing without stale overrun',
  sim3.isPaused && sim3.simTime === sim3.cachedSimulation.landing.t,
  `Sim paused at new landing: ${sim3.simTime.toFixed(3)}s (was 3.5s)`
);

console.log('\n======================================================================');
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED OUT OF ${passCount + failCount} TESTS.`);
console.log('======================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
