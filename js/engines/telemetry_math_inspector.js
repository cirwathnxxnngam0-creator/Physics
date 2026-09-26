/**
 * telemetry_math_inspector.js - Live Mathematical Calculation & Step-by-Step Substitution Inspector
 * Part of PhysicsNoza 3.0 Architecture
 *
 * Enables interactive inspection of any simulator telemetry variable:
 * 1. Physical definition & SI units
 * 2. Master governing equation (จากสูตรนี้)
 * 3. Live parameter values from active simulation sliders
 * 4. Step-by-step numerical substitution (แทนตัวเลข)
 * 5. Final computed output matching live HUD (จะได้ออกมาเป็นนี้)
 * 6. Physical insight & pedagogical context
 *
 * Fully reactive: updates live as simulation ticks or user moves sliders.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TelemetryMathInspector = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Active state
  let currentActiveVarId = 'telem-vac-range';
  let currentMode = 'projectile';
  let currentParams = {};
  let currentState = {};
  let isExpanded = true;
  let hasInitialized = false;

  /**
   * Universal Mathematical Catalog of Physical Telemetry Variables
   */
  const VARIABLE_CATALOG = {
    // =========================================================================
    // 1. PROJECTILE MOTION SIMULATOR
    // =========================================================================
    'telem-vac-range': {
      symbol: 'R_{\\text{vac}}',
      nameTh: 'ระยะตกไกลสุดในสุญญากาศ (Vacuum Range)',
      nameEn: 'Ideal Vacuum Projectile Range',
      unit: 'm',
      category: 'Kinematics',
      formulaLatex: 'R_{\\text{vac}} = \\frac{v_0 \\cos\\theta}{g} \\left( v_0 \\sin\\theta + \\sqrt{(v_0 \\sin\\theta)^2 + 2gy_0} \\right)',
      diagramSvg: `<svg viewBox="0 0 240 65" style="width: 100%; max-width: 220px; height: 55px;" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="52" x2="228" y2="52" stroke="#475569" stroke-width="1.5"/>
        <path d="M 20 52 Q 120 4 220 52" fill="none" stroke="#38BDF8" stroke-width="2" stroke-dasharray="3,3"/>
        <line x1="20" y1="52" x2="55" y2="24" stroke="#EA580C" stroke-width="2"/>
        <polygon points="55,24 46,27 50,33" fill="#EA580C"/>
        <text x="64" y="27" fill="#EA580C" font-size="9.5" font-weight="bold">v₀, θ</text>
        <line x1="20" y1="58" x2="220" y2="58" stroke="#10B981" stroke-width="1.5"/>
        <text x="120" y="58" fill="#10B981" font-size="9" text-anchor="middle" font-weight="bold">R_vac</text>
      </svg>`,
      description: 'ระยะทางแนวนอนที่วัตถุเคลื่อนที่ได้เมื่อไม่มีแรงต้านอากาศ โดยอาศัยการอนุรักษ์โมเมนตัมแนวราบและความเร่งโน้มถ่วงคงที่ $g$',
      insight: 'เมื่อยิงจากระดับพื้นราบ ($y_0 = 0$) สูตรจะลดรูปเหลือสูตรคลาสสิก $R = \\frac{v_0^2 \\sin(2\\theta)}{g}$ ซึ่งให้ระยะไกลสุดที่มุม $\\theta = 45^\\circ$',
      evaluate: function (params, state) {
        const v0 = Number(params.v0 !== undefined ? params.v0 : 25.0);
        const thetaDeg = Number(params.thetaDeg !== undefined ? params.thetaDeg : 45.0);
        const g = Number(params.g !== undefined ? params.g : 9.81);
        const y0 = Number(params.y0 !== undefined ? params.y0 : 0.0);
        const thetaRad = (thetaDeg * Math.PI) / 180;

        const vx = v0 * Math.cos(thetaRad);
        const vy = v0 * Math.sin(thetaRad);
        const disc = Math.sqrt(vy * vy + 2 * g * y0);
        const tFlight = (vy + disc) / g;
        const R = vx * tFlight;

        const paramsList = [
          { symbol: 'v_0', name: 'ความเร็วต้น', val: v0.toFixed(1) + ' m/s' },
          { symbol: '\\theta', name: 'มุมยิง', val: thetaDeg.toFixed(1) + '°' },
          { symbol: 'g', name: 'ความเร่งโน้มถ่วง', val: g.toFixed(2) + ' m/s²' },
          { symbol: 'y_0', name: 'ความสูงฐานยิง', val: y0.toFixed(1) + ' m' }
        ];

        let stepsLatex = [];
        if (y0 === 0) {
          const sin2theta = Math.sin(2 * thetaRad);
          const v0Sq = v0 * v0;
          stepsLatex = [
            `\\text{ที่พื้น } y_0 = 0\\text{ m: } R = \\frac{v_0^2 \\sin(2\\theta)}{g}`,
            `R = \\frac{(${v0.toFixed(1)})^2 \\times \\sin(${ (2 * thetaDeg).toFixed(0) }^\\circ)}{${g.toFixed(2)}} = \\frac{${v0Sq.toFixed(1)} \\times ${sin2theta.toFixed(3)}}{${g.toFixed(2)}}`,
            `\\mathbf{R_{\\text{vac}} = ${R.toFixed(2)}\\text{ m}}`
          ];
        } else {
          stepsLatex = [
            `v_{0x} = ${v0.toFixed(1)} \\cos(${thetaDeg.toFixed(0)}^\\circ) = ${vx.toFixed(2)}\\text{ m/s}, \\; v_{0y} = ${v0.toFixed(1)} \\sin(${thetaDeg.toFixed(0)}^\\circ) = ${vy.toFixed(2)}\\text{ m/s}`,
            `t_{\\text{flight}} = \\frac{${vy.toFixed(2)} + \\sqrt{${(vy * vy).toFixed(1)} + ${(2 * g * y0).toFixed(1)}}}{${g.toFixed(2)}} = ${tFlight.toFixed(2)}\\text{ s}`,
            `R = v_{0x} \\times t_{\\text{flight}} = \\mathbf{${R.toFixed(2)}\\text{ m}}`
          ];
        }

        return {
          paramsList,
          stepsLatex,
          resultValue: R.toFixed(2) + ' m'
        };
      }
    },

    'telem-range': {
      symbol: 'R_{\\text{actual}}',
      nameTh: 'ระยะตกจริงพร้อมแรงต้านอากาศ (Actual Range with Drag)',
      nameEn: 'Realistic Aerodynamic Range',
      unit: 'm',
      category: 'Dynamics & Drag',
      formulaLatex: 'm \\frac{d\\vec{v}}{dt} = m\\vec{g} - \\frac{1}{2} \\rho C_d A |\\vec{v}| \\vec{v}, \\quad R = \\int_0^{t_{\\text{land}}} v_x(t) \\, dt',
      description: 'ระยะตกจริงเมื่อรวมผลของแรงต้านอากาศกำลังสอง ($F_d = cv^2$) ผ่านการอินทิเกรตเชิงตัวเลขด้วยวิธี Runge-Kutta ชั้นที่ 4 (RK4)',
      insight: 'แรงต้านอากาศจะทำให้มุมยิงที่ให้ระยะไกลสุดลดลงต่ำกว่า $45^\\circ$ เสมอ (โดยทั่วไปจะอยู่ที่ $38^\\circ - 42^\\circ$ ขึ้นอยู่กับค่า $C_d$ และมวลวัตถุ)',
      evaluate: function (params, state) {
        const v0 = Number(params.v0 !== undefined ? params.v0 : 25.0);
        const thetaDeg = Number(params.thetaDeg !== undefined ? params.thetaDeg : 45.0);
        const m = Number(params.m !== undefined ? params.m : 1.0);
        const c = Number(params.c !== undefined ? params.c : 0.002);
        const g = Number(params.g !== undefined ? params.g : 9.81);

        const telemRangeText = document.getElementById('telem-range') ? document.getElementById('telem-range').textContent : '';
        const parsedVal = parseFloat(telemRangeText) || 0.0;

        const paramsList = [
          { symbol: 'v_0', name: 'ความเร็วต้น', val: v0.toFixed(1) + ' m/s' },
          { symbol: 'm', name: 'มวลวัตถุ', val: m.toFixed(2) + ' kg' },
          { symbol: 'c', name: 'สัมประสิทธิ์แรงต้าน', val: c.toFixed(4) + ' kg/m' },
          { symbol: 'g', name: 'แรงโน้มถ่วง', val: g.toFixed(2) + ' m/s²' }
        ];

        const stepsLatex = [
          `\\text{สมการการเคลื่อนที่ 2 มิติพร้อมแรงต้านกำลังสอง: } \\begin{cases} a_x = -\\frac{c}{m} v \\, v_x \\\\ a_y = -g - \\frac{c}{m} v \\, v_y \\end{cases}`,
          `\\text{แรงต้านที่จุดเริ่มต้น: } F_{d,0} = c \\cdot v_0^2 = (${c.toFixed(4)}) \\times (${v0.toFixed(1)})^2 = ${(c * v0 * v0).toFixed(2)}\\text{ N}`,
          `\\text{คำนวณวิถีด้วยตัวแก้เชิงอนุพันธ์ RK4 (ความแม่นยำอันดับ 4, } \\Delta t = 0.005\\text{ s)}`,
          `\\text{ผลการอินทิเกรตระยะตกกระทบพื้นจริง: } \\mathbf{R_{\\text{actual}} = ${parsedVal.toFixed(2)}\\text{ m}}`
        ];

        return {
          paramsList,
          stepsLatex,
          resultValue: parsedVal.toFixed(2) + ' m'
        };
      }
    },

    'telem-ek': {
      symbol: 'E_k',
      nameTh: 'พลังงานจลน์ขณะใดขณะหนึ่ง (Kinetic Energy)',
      nameEn: 'Instantaneous Kinetic Energy',
      unit: 'J',
      category: 'Energy',
      formulaLatex: 'E_k = \\frac{1}{2} m v^2 = \\frac{1}{2} m (v_x^2 + v_y^2)',
      description: 'พลังงานที่สะสมในวัตถุเนื่องจากอัตราเร็วของการเคลื่อนที่ แปรผันตรงกับมวลและกำลังสองของอัตราเร็วสัมบูรณ์',
      insight: 'พลังงานจลน์จะมีค่าน้อยที่สุดที่จุดสูงสุดของวิถี ($v_y = 0 \\implies E_{k,\\text{min}} = \\frac{1}{2}mv_x^2$) และมีค่ามากที่สุดขณะปล่อยหรือตกถึงพื้น',
      evaluate: function (params, state) {
        const m = Number(params.m !== undefined ? params.m : 1.0);
        const speed = Number(state.speed !== undefined ? state.speed : (params.v0 || 25.0));
        const ek = 0.5 * m * speed * speed;

        const paramsList = [
          { symbol: 'm', name: 'มวลของวัตถุ', val: m.toFixed(2) + ' kg' },
          { symbol: 'v', name: 'อัตราเร็วขณะนี้', val: speed.toFixed(2) + ' m/s' }
        ];

        const stepsLatex = [
          `\\text{จากนิยามพลังงานจลน์: } E_k = \\frac{1}{2} m v^2`,
          `\\text{แทนค่าตัวเลขสด: } E_k = \\frac{1}{2} \\times (${m.toFixed(2)}\\text{ kg}) \\times (${speed.toFixed(2)}\\text{ m/s})^2`,
          `= 0.5 \\times ${m.toFixed(2)} \\times ${(speed * speed).toFixed(2)} = ${(0.5 * m * speed * speed).toFixed(2)}\\text{ J}`,
          `\\mathbf{E_k = ${ek.toFixed(1)}\\text{ J}}`
        ];

        return {
          paramsList,
          stepsLatex,
          resultValue: ek.toFixed(1) + ' J'
        };
      }
    },

    'telem-etotal': {
      symbol: 'E_{\\text{total}}',
      nameTh: 'พลังงานกลรวม (Total Mechanical Energy)',
      nameEn: 'Total Mechanical Energy',
      unit: 'J',
      category: 'Energy',
      formulaLatex: 'E = E_k + E_p = \\frac{1}{2} m v^2 + m g y',
      description: 'ผลรวมของพลังงานจลน์และพลังงานศักย์โน้มถ่วง หากไม่มีแรงต้านอากาศ พลังงานนี้จะอนุรักษ์คงที่ตลอดการบิน',
      insight: 'เมื่อมีแรงต้านอากาศ พลังงานรวมจะลดลงอย่างต่อเนื่องตามงานของแรงต้าน: $\\Delta E = \\int \\vec{F}_{\\text{drag}} \\cdot d\\vec{r} < 0$',
      evaluate: function (params, state) {
        const m = Number(params.m !== undefined ? params.m : 1.0);
        const g = Number(params.g !== undefined ? params.g : 9.81);
        const speed = Number(state.speed !== undefined ? state.speed : (params.v0 || 25.0));
        const y = Math.max(0, Number(state.y !== undefined ? state.y : (params.y0 || 0.0)));

        const ek = 0.5 * m * speed * speed;
        const ep = m * g * y;
        const eTotal = ek + ep;

        const paramsList = [
          { symbol: 'm', name: 'มวล', val: m.toFixed(2) + ' kg' },
          { symbol: 'v', name: 'อัตราเร็ว', val: speed.toFixed(2) + ' m/s' },
          { symbol: 'y', name: 'ระดับความสูง', val: y.toFixed(2) + ' m' },
          { symbol: 'g', name: 'ความเร่งโน้มถ่วง', val: g.toFixed(2) + ' m/s²' }
        ];

        const stepsLatex = [
          `\\text{พลังงานจลน์: } E_k = \\frac{1}{2}(${m.toFixed(2)})(${speed.toFixed(2)})^2 = ${ek.toFixed(1)}\\text{ J}`,
          `\\text{พลังงานศักย์: } E_p = (${m.toFixed(2)})(${g.toFixed(2)})(${y.toFixed(2)}) = ${ep.toFixed(1)}\\text{ J}`,
          `\\text{รวมพลังงานกล: } E = E_k + E_p = ${ek.toFixed(1)} + ${ep.toFixed(1)} = ${eTotal.toFixed(1)}\\text{ J}`,
          `\\mathbf{E_{\\text{total}} = ${eTotal.toFixed(1)}\\text{ J}}`
        ];

        return {
          paramsList,
          stepsLatex,
          resultValue: eTotal.toFixed(1) + ' J'
        };
      }
    },

    'telem-v': {
      symbol: 'v(t)',
      nameTh: 'อัตราเร็วตามวิถีขณะใดขณะหนึ่ง (Instantaneous Speed)',
      nameEn: 'Instantaneous Trajectory Speed',
      unit: 'm/s',
      category: 'Kinematics',
      formulaLatex: 'v(t) = |\\vec{v}(t)| = \\sqrt{v_x(t)^2 + v_y(t)^2}',
      description: 'ขนาดของเวกเตอร์ความเร็วรวม ณ จุดใดๆ บนเส้นทางวิถีโค้ง',
      insight: 'ทิศทางของเวกเตอร์ความเร็วจะเป็นเส้นสัมผัส (Tangent) กับเส้นทางวิถีการเคลื่อนที่เสมอ: $\\tan\\theta = v_y / v_x$',
      evaluate: function (params, state) {
        const vx = Number(state.vx !== undefined ? state.vx : 17.68);
        const vy = Number(state.vy !== undefined ? state.vy : 17.68);
        const v = Math.sqrt(vx * vx + vy * vy);

        const paramsList = [
          { symbol: 'v_x', name: 'ความเร็วแนวราบ', val: vx.toFixed(2) + ' m/s' },
          { symbol: 'v_y', name: 'ความเร็วแนวดิ่ง', val: vy.toFixed(2) + ' m/s' }
        ];

        const stepsLatex = [
          `\\text{จากทฤษฎีบทพีทาโกรัสบนเวกเตอร์ความเร็วตั้งฉาก: } v = \\sqrt{v_x^2 + v_y^2}`,
          `\\text{แทนค่าความเร็วองค์ประกอบ: } v = \\sqrt{(${vx.toFixed(2)})^2 + (${vy.toFixed(2)})^2}`,
          `= \\sqrt{${(vx * vx).toFixed(2)} + ${(vy * vy).toFixed(2)}} = \\sqrt{${(vx * vx + vy * vy).toFixed(2)}}`,
          `\\mathbf{v = ${v.toFixed(2)}\\text{ m/s}}`
        ];

        return {
          paramsList,
          stepsLatex,
          resultValue: v.toFixed(2) + ' m/s'
        };
      }
    },

    'telem-x': {
      symbol: 'x(t)',
      nameTh: 'พิกัดตำแหน่งแนวราบ (Horizontal Position)',
      nameEn: 'Horizontal Coordinate',
      unit: 'm',
      category: 'Kinematics',
      formulaLatex: 'x(t) = x_0 + \\int_0^t v_x(\\tau) \\, d\\tau \\quad \\xrightarrow{\\text{Vacuum}} \\quad x(t) = v_0 \\cos(\\theta) \\cdot t',
      description: 'ระยะการกระจัดในแนวแกนราบวัดจากจุดเริ่มต้นปล่อยวัตถุ',
      insight: 'ในสุญญากาศ ความเร่งแนวราบ $a_x = 0$ ทำให้วัตถุเคลื่อนที่ด้วยความเร็วคงตัว $v_x = v_0\\cos\\theta$',
      evaluate: function (params, state) {
        const x = Number(state.x !== undefined ? state.x : 0.0);
        const t = Number(state.t !== undefined ? state.t : 0.0);
        const v0 = Number(params.v0 || 25.0);
        const thetaDeg = Number(params.thetaDeg || 45.0);
        const vx0 = v0 * Math.cos((thetaDeg * Math.PI) / 180);

        const paramsList = [
          { symbol: 'v_{0x}', name: 'ความเร็วต้นแนวราบ', val: vx0.toFixed(2) + ' m/s' },
          { symbol: 't', name: 'เวลาที่ผ่านไป', val: t.toFixed(3) + ' s' }
        ];

        const stepsLatex = [
          `\\text{สมการการเคลื่อนที่แกนราบ: } x(t) = v_{0x} \\cdot t - \\text{การหน่วงจากแรงต้าน}`,
          `\\text{แทนค่าเวลาปัจจุบัน: } x(${t.toFixed(2)}) \\approx ${vx0.toFixed(2)} \\times ${t.toFixed(2)} = ${(vx0 * t).toFixed(2)}\\text{ m (ก่อนหักแรงต้าน)}`,
          `\\mathbf{x = ${x.toFixed(2)}\\text{ m}}`
        ];

        return {
          paramsList,
          stepsLatex,
          resultValue: x.toFixed(2) + ' m'
        };
      }
    },

    'telem-y': {
      symbol: 'y(t)',
      nameTh: 'พิกัดความสูงแนวดิ่ง (Vertical Altitude)',
      nameEn: 'Vertical Coordinate',
      unit: 'm',
      category: 'Kinematics',
      formulaLatex: 'y(t) = y_0 + v_0 \\sin(\\theta) \\cdot t - \\frac{1}{2} g t^2 - \\Delta y_{\\text{drag}}',
      description: 'ระดับความสูงของวัตถุเหนือพื้นดิน ณ ขณะเวลา $t$',
      insight: 'ความเร่งแนวดิ่งมีค่าคงตัวและชี้ลงสู่ศูนย์กลางโลก $a_y = -g$ (เมื่อไม่มีแรงต้าน)',
      evaluate: function (params, state) {
        const y = Math.max(0, Number(state.y !== undefined ? state.y : 0.0));
        const t = Number(state.t !== undefined ? state.t : 0.0);
        const v0 = Number(params.v0 || 25.0);
        const thetaDeg = Number(params.thetaDeg || 45.0);
        const g = Number(params.g || 9.81);
        const y0 = Number(params.y0 || 0.0);
        const vy0 = v0 * Math.sin((thetaDeg * Math.PI) / 180);

        const paramsList = [
          { symbol: 'y_0', name: 'ความสูงเริ่มต้น', val: y0.toFixed(1) + ' m' },
          { symbol: 'v_{0y}', name: 'ความเร็วต้นแนวดิ่ง', val: vy0.toFixed(2) + ' m/s' },
          { symbol: 'g', name: 'ความเร่งโน้มถ่วง', val: g.toFixed(2) + ' m/s²' },
          { symbol: 't', name: 'เวลา', val: t.toFixed(3) + ' s' }
        ];

        const vacY = y0 + vy0 * t - 0.5 * g * t * t;

        const stepsLatex = [
          `\\text{สมการการเคลื่อนที่แกนดิ่ง: } y(t) = y_0 + v_{0y} t - \\frac{1}{2} g t^2`,
          `\\text{แทนค่าตัวเลข: } y(${t.toFixed(2)}) = ${y0.toFixed(1)} + (${vy0.toFixed(2)})(${t.toFixed(2)}) - 0.5(${g.toFixed(2)})(${t.toFixed(2)})^2`,
          `= ${y0.toFixed(1)} + ${(vy0 * t).toFixed(2)} - ${(0.5 * g * t * t).toFixed(2)} = ${Math.max(0, vacY).toFixed(2)}\\text{ m}`,
          `\\mathbf{y = ${y.toFixed(2)}\\text{ m}}`
        ];

        return {
          paramsList,
          stepsLatex,
          resultValue: y.toFixed(2) + ' m'
        };
      }
    },

    'telem-t': {
      symbol: 't',
      nameTh: 'เวลาบินสะสม (Flight Time)',
      nameEn: 'Elapsed Simulation Time',
      unit: 's',
      category: 'Time',
      formulaLatex: 't = \\int_0^t dt = N \\cdot \\Delta t',
      description: 'ระยะเวลาทั้งหมดที่วัตถุใช้เคลื่อนที่นับจากวินาทีที่เริ่มยิงจนถึงสภาวะปัจจุบัน',
      insight: 'เวลาบินสูงสุดในสุญญากาศคือ $T_{\\text{total}} = \\frac{2v_0\\sin\\theta}{g}$',
      evaluate: function (params, state) {
        const t = Number(state.t !== undefined ? state.t : 0.0);
        const paramsList = [
          { symbol: '\\Delta t', name: 'ขั้นตอนเวลา RK4', val: '0.005 s' }
        ];
        const stepsLatex = [
          `\\text{เวลาถูกสะสมอย่างแม่นยำในแต่ละรอบการคำนวณ: } t_{n+1} = t_n + \\Delta t`,
          `\\mathbf{t = ${t.toFixed(3)}\\text{ s}}`
        ];
        return { paramsList, stepsLatex, resultValue: t.toFixed(3) + ' s' };
      }
    },

    // =========================================================================
    // 2. VEHICLE & GAUSS DIVERGENCE THEOREM
    // =========================================================================
    'telem-veh-vrel': {
      symbol: 'v_{\\text{rel}}',
      nameTh: 'อัตราเร็วลมสัมพัทธ์ต่อตัวรถ (Relative Airspeed)',
      nameEn: 'Relative Wind Speed',
      unit: 'm/s',
      category: 'Relative Motion',
      formulaLatex: '\\vec{v}_{\\text{rel}} = \\vec{v}_{\\text{car}} - \\vec{v}_{\\text{wind}}, \\quad |\\vec{v}_{\\text{rel}}| = \\sqrt{(v_{cx} - v_{wx})^2 + (v_{cy} - v_{wy})^2}',
      description: 'ความเร็วที่มวลอากาศเคลื่อนที่ผ่านผิวตัวถังรถยนต์ ซึ่งเป็นตัวแปรแท้จริงที่ก่อให้เกิดแรงต้านและแรงกดแอโรไดนามิก',
      insight: 'หากขับตามลม อัตราเร็วสัมพัทธ์จะลดลงทำให้ประหยัดเชื้อเพลิง แต่หากขับต้านลม หรือเจอลมขวาง แรงต้านอากาศจะพุ่งสูงขึ้นอย่างมหาศาล',
      evaluate: function (params, state) {
        const vCar = Number(params.vCar !== undefined ? params.vCar : 25.0);
        const vWind = Number(params.vWind !== undefined ? params.vWind : 15.0);
        const windAngleDeg = Number(params.windAngleDeg !== undefined ? params.windAngleDeg : 180.0);
        const thetaRad = (windAngleDeg * Math.PI) / 180;

        const vwx = vWind * Math.cos(thetaRad);
        const vwy = vWind * Math.sin(thetaRad);
        const relX = vCar - vwx;
        const relY = 0 - vwy;
        const vRel = Math.sqrt(relX * relX + relY * relY);

        const paramsList = [
          { symbol: 'v_{\\text{car}}', name: 'ความเร็วรถ', val: vCar.toFixed(1) + ' m/s' },
          { symbol: 'v_{\\text{wind}}', name: 'ความเร็วลม', val: vWind.toFixed(1) + ' m/s' },
          { symbol: '\\theta_{\\text{wind}}', name: 'ทิศทางลม', val: windAngleDeg.toFixed(0) + '°' }
        ];

        const stepsLatex = [
          `\\text{เวกเตอร์ความเร็วรถ: } \\vec{v}_{\\text{car}} = (${vCar.toFixed(1)}, 0)\\text{ m/s}`,
          `\\text{เวกเตอร์ความเร็วลม: } \\vec{v}_{\\text{wind}} = (${vwx.toFixed(1)}, ${vwy.toFixed(1)})\\text{ m/s}`,
          `\\text{เวกเตอร์สัมพัทธ์ } \\vec{v}_{\\text{rel}} = (${relX.toFixed(1)}, ${relY.toFixed(1)})\\text{ m/s}`,
          `|\\vec{v}_{\\text{rel}}| = \\sqrt{(${relX.toFixed(1)})^2 + (${relY.toFixed(1)})^2} = \\sqrt{${(relX * relX + relY * relY).toFixed(1)}}`,
          `\\mathbf{v_{\\text{rel}} = ${vRel.toFixed(2)}\\text{ m/s}}`
        ];

        return { paramsList, stepsLatex, resultValue: vRel.toFixed(2) + ' m/s' };
      }
    },

    'telem-veh-drag': {
      symbol: 'F_d',
      nameTh: 'แรงต้านอากาศพลศาสตร์ (Aerodynamic Drag Force)',
      nameEn: 'Aerodynamic Drag Force',
      unit: 'N',
      category: 'Fluid Dynamics',
      formulaLatex: 'F_d = \\frac{1}{2} \\rho C_d A v_{\\text{rel}}^2',
      description: 'แรงต้านทานที่กระทำต่อรถเนื่องจากความดันอากาศที่ปะทะด้านหน้าและการปั่นป่วนของกระแสลมวนด้านท้าย',
      insight: 'เนื่องจากแรงต้านแปรผันตามกำลังสองของความเร็ว ($v^2$) กำลังงานที่ต้องใช้เพื่อเอาชนะแรงต้านจึงแปรผันตามกำลังสาม ($P = F_d \\cdot v \\propto v^3$)',
      evaluate: function (params, state) {
        const rho = 1.225; // kg/m3 air density
        const cd = 0.32;   // Drag coefficient
        const a = 2.2;     // Frontal area m2
        const vRel = Number(params.vRel !== undefined ? params.vRel : 29.15);
        const fd = 0.5 * rho * cd * a * vRel * vRel;

        const paramsList = [
          { symbol: '\\rho', name: 'ความหนาแน่นอากาศ', val: rho.toFixed(3) + ' kg/m³' },
          { symbol: 'C_d', name: 'สัมประสิทธิ์แรงต้าน', val: cd.toFixed(2) },
          { symbol: 'A', name: 'พื้นที่หน้าตัดรับลม', val: a.toFixed(1) + ' m²' },
          { symbol: 'v_{\\text{rel}}', name: 'ความเร็วสัมพัทธ์', val: vRel.toFixed(2) + ' m/s' }
        ];

        const stepsLatex = [
          `\\text{จากสมการแรงต้านของของไหล: } F_d = \\frac{1}{2} \\rho C_d A v_{\\text{rel}}^2`,
          `\\text{แทนค่าตัวเลขสด: } F_d = 0.5 \\times (${rho}) \\times (${cd}) \\times (${a}) \\times (${vRel.toFixed(2)})^2`,
          `= ${(0.5 * rho * cd * a).toFixed(4)} \\times ${(vRel * vRel).toFixed(2)} = ${fd.toFixed(1)}\\text{ N}`,
          `\\mathbf{F_d = ${fd.toFixed(1)}\\text{ N}}`
        ];

        return { paramsList, stepsLatex, resultValue: fd.toFixed(1) + ' N' };
      }
    },

    'div-readout-lhs': {
      symbol: '\\oint_{\\partial D} (\\mathbf{F} \\cdot \\hat{\\mathbf{n}}) \\, ds',
      nameTh: 'ฟลักซ์รวมผ่านเส้นขอบเขตปิด (Boundary Line Flux - LHS)',
      nameEn: 'Closed Boundary Normal Flux',
      unit: 'Wb',
      category: 'Vector Calculus',
      formulaLatex: '\\Phi = \\oint_{\\partial D} (\\mathbf{F} \\cdot \\hat{\\mathbf{n}}) \\, ds \\approx \\sum_{i=1}^K (\\mathbf{F}_i \\cdot \\hat{\\mathbf{n}}_i) \\Delta s_i',
      description: 'ปริมาณสนามเวกเตอร์สุทธิที่พุ่งทะลุผ่านเส้นรอบวงปิด $\\partial D$ ออกสู่ภายนอก',
      insight: 'หากผลลัพธ์เป็นบวก แสดงว่ามีแหล่งกำเนิด (Source) อยู่ภายใน หากเป็นลบแสดงว่าเป็นหลุมดูด (Sink) และหากเป็นศูนย์แสดงว่าไม่มีจุดกำเนิดสุทธิ',
      evaluate: function (params, state) {
        const lhsText = document.getElementById('div-readout-lhs') ? document.getElementById('div-readout-lhs').textContent : '+12.56 Wb';
        const val = parseFloat(lhsText) || 12.56;
        const paramsList = [
          { symbol: 'K', name: 'จำนวนส่วนแบ่งขอบเขต', val: '128 segments' },
          { symbol: '\\hat{\\mathbf{n}}', name: 'เวกเตอร์หนึ่งหน่วยแนวฉาก', val: 'Outward Normal' }
        ];
        const stepsLatex = [
          `\\text{แบ่งเส้นขอบปิด } \\partial D \\text{ ออกเป็น } 128\\text{ ส่วนย่อย } \\Delta s_i`,
          `\\text{คำนวณผลคูณสเกลาร์ } \\mathbf{F}_i \\cdot \\hat{\\mathbf{n}}_i \\text{ ที่กึ่งกลางแต่ละส่วน}`,
          `\\text{รวมฟลักซ์ทุกส่วน: } \\Phi = \\sum_{i=1}^{128} (\\mathbf{F}_i \\cdot \\hat{\\mathbf{n}}_i) \\Delta s_i`,
          `\\mathbf{\\Phi_{\\text{LHS}} = ${val >= 0 ? '+' : ''}${val.toFixed(2)}\\text{ Wb}}`
        ];
        return { paramsList, stepsLatex, resultValue: (val >= 0 ? '+' : '') + val.toFixed(2) + ' Wb' };
      }
    },

    'div-readout-rhs': {
      symbol: '\\iint_D (\\nabla \\cdot \\mathbf{F}) \\, dA',
      nameTh: 'อินทิกรัลการลู่ออกทั่วพื้นที่ปิด (Area Divergence Integral - RHS)',
      nameEn: 'Total Enclosed Divergence',
      unit: 'Wb',
      category: 'Vector Calculus',
      formulaLatex: '\\iint_D (\\nabla \\cdot \\mathbf{F}) \\, dA = \\iint_D \\left(\\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y}\\right) dx \\, dy',
      description: 'ผลรวมของความหนาแน่นไดเวอร์เจนซ์ (แหล่งกำเนิด/หลุมดูดต่อหน่วยพื้นที่) ทั่วบริเวณพื้นที่ $D$',
      insight: 'ทฤษฎีบทของเกาส์ (Gauss Divergence Theorem) พิสูจน์ว่า ฟลักซ์ที่ไหลทะลุขอบเขต (LHS) จะเท่ากับสิ่งที่ถูกสร้างขึ้นภายในพื้นที่ (RHS) เสมออย่างสมบูรณ์แบบ',
      evaluate: function (params, state) {
        const rhsText = document.getElementById('div-readout-rhs') ? document.getElementById('div-readout-rhs').textContent : '+12.56 Wb';
        const val = parseFloat(rhsText) || 12.56;
        const paramsList = [
          { symbol: '\\nabla\\cdot\\mathbf{F}', name: 'ความหนาแน่นไดเวอร์เจนซ์', val: '\\partial F_x/\\partial x + \\partial F_y/\\partial y' },
          { symbol: 'M \\times M', name: 'กริดอินทิเกรตพื้นที่', val: '64 × 64 cells' }
        ];
        const stepsLatex = [
          `\\text{คำนวณไดเวอร์เจนซ์ ณ แต่ละจุดกริด: } \\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y}`,
          `\\text{รวมปริพันธ์เชิงพื้นที่สองชั้นแบบ Midpoint Rule บนโดเมน } D`,
          `\\text{คำนวณค่ารวม: } \\iint_D (\\nabla \\cdot \\mathbf{F}) \\, dA`,
          `\\mathbf{I_{\\text{RHS}} = ${val >= 0 ? '+' : ''}${val.toFixed(2)}\\text{ Wb}}`
        ];
        return { paramsList, stepsLatex, resultValue: (val >= 0 ? '+' : '') + val.toFixed(2) + ' Wb' };
      }
    },

    // =========================================================================
    // 3. COLLISION & IMPULSE SIMULATOR
    // =========================================================================
    'telem-col-p1': {
      symbol: 'p_1',
      nameTh: 'โมเมนตัมของวัตถุก้อนที่ 1 (Momentum of Cart 1)',
      nameEn: 'Linear Momentum of Body 1',
      unit: 'kg·m/s',
      category: 'Momentum',
      formulaLatex: 'p_1 = m_1 v_1',
      description: 'ปริมาณการเคลื่อนที่ของวัตถุก้อนที่ 1 เป็นปริมาณเวกเตอร์ที่มีทิศทางเดียวกับความเร็ว',
      insight: 'ในระบบโดดเดี่ยวที่ไม่มีแรงภายนอกกระทำ โมเมนตัมรวมของระบบ $p_1 + p_2$ จะคงที่เสมอ ไม่ว่าการชนจะเป็นแบบยืดหยุ่นหรือไม่ยืดหยุ่น',
      evaluate: function (params, state) {
        const p1Text = document.getElementById('telem-col-p1') ? document.getElementById('telem-col-p1').textContent : '+15.0 kg·m/s';
        const p1 = parseFloat(p1Text) || 15.0;
        const m1 = Number(params.m1 || 3.0);
        const v1 = p1 / m1;

        const paramsList = [
          { symbol: 'm_1', name: 'มวลรถคันที่ 1', val: m1.toFixed(1) + ' kg' },
          { symbol: 'v_1', name: 'ความเร็วรถคันที่ 1', val: v1.toFixed(2) + ' m/s' }
        ];

        const stepsLatex = [
          `\\text{จากนิยามโมเมนตัมเชิงเส้น: } p_1 = m_1 v_1`,
          `\\text{แทนค่าตัวเลขสด: } p_1 = (${m1.toFixed(1)}\\text{ kg}) \\times (${v1.toFixed(2)}\\text{ m/s}) = ${(m1 * v1).toFixed(1)}\\text{ kg}\\cdot\\text{m/s}`,
          `\\mathbf{p_1 = ${p1 >= 0 ? '+' : ''}${p1.toFixed(1)}\\text{ kg}\\cdot\\text{m/s}}`
        ];

        return { paramsList, stepsLatex, resultValue: (p1 >= 0 ? '+' : '') + p1.toFixed(1) + ' kg·m/s' };
      }
    },

    'telem-col-impulse': {
      symbol: 'J',
      nameTh: 'การดลที่ถ่ายทอดระหว่างการชน (Impulse Transfer)',
      nameEn: 'Impulse Transfer',
      unit: 'N·s',
      category: 'Momentum',
      formulaLatex: 'J = \\Delta p_1 = \\int_{t_1}^{t_2} F(t) \\, dt = m_1 (v_1\' - v_1)',
      description: 'การเปลี่ยนแปลงโมเมนตัมของวัตถุ มีค่าเท่ากับพื้นที่ใต้กราฟระหว่างแรงกระทบกับเวลา ($F$-$t$ Curve)',
      insight: 'หากยืดเวลาการชนให้ยาวนานขึ้น (เช่น ถุงลมนิรภัย หรือโซนยุบตัวหน้ารถ) แรงปะทะเฉลี่ย $F_{\\text{avg}} = J / \\Delta t$ จะลดลงอย่างมาก ช่วยลดอันตรายต่อชีวิต',
      evaluate: function (params, state) {
        const impText = document.getElementById('telem-col-impulse') ? document.getElementById('telem-col-impulse').textContent : '12.50 N·s';
        const j = parseFloat(impText) || 12.50;
        const paramsList = [
          { symbol: 'J', name: 'การดล', val: j.toFixed(2) + ' N·s' },
          { symbol: '\\Delta t_{\\text{col}}', name: 'ระยะเวลาปะทะ', val: '~0.08 s' }
        ];
        const stepsLatex = [
          `\\text{การดลเท่ากับการเปลี่ยนแปลงโมเมนตัม: } J = |p_{1,\\text{หลัง}} - p_{1,\\text{ก่อน}}|`,
          `\\text{อินทิเกรตพื้นที่ใต้เส้นโค้งแรงปะทะ: } J = \\int F_{\\text{contact}}(t) \\, dt`,
          `\\mathbf{J = ${j.toFixed(2)}\\text{ N}\\cdot\\text{s}}`
        ];
        return { paramsList, stepsLatex, resultValue: j.toFixed(2) + ' N·s' };
      }
    },

    // =========================================================================
    // 4. CIRCULAR MOTION & BANKED TURN
    // =========================================================================
    'circ-telem-ac': {
      symbol: 'a_c',
      nameTh: 'ความเร่งสู่ศูนย์กลาง (Centripetal Acceleration)',
      nameEn: 'Centripetal Acceleration',
      unit: 'm/s²',
      category: 'Circular Dynamics',
      formulaLatex: 'a_c = \\frac{v^2}{r} = \\omega^2 r',
      description: 'อัตราการเปลี่ยนแปลงทิศทางของเวกเตอร์ความเร็ว ชี้เข้าหาจุดศูนย์กลางของวงกลมเสมอ',
      insight: 'แม้ว่าอัตราเร็วเชิงสเกลาร์ $v$ จะคงที่ แต่วัตถุยังคงมีความเร่งตลอดเวลา เพราะทิศทางของเวกเตอร์ความเร็วเปลี่ยนไปตลอดเวลา',
      evaluate: function (params, state) {
        const v = Number(params.v !== undefined ? params.v : 20.0);
        const r = Number(params.r !== undefined ? params.r : 50.0);
        const ac = (v * v) / r;

        const paramsList = [
          { symbol: 'v', name: 'อัตราเร็วเชิงเส้น', val: v.toFixed(1) + ' m/s' },
          { symbol: 'r', name: 'รัศมีความโค้ง', val: r.toFixed(1) + ' m' }
        ];

        const stepsLatex = [
          `\\text{จากสูตรความเร่งสู่ศูนย์กลาง: } a_c = \\frac{v^2}{r}`,
          `\\text{แทนค่าตัวเลขสด: } a_c = \\frac{(${v.toFixed(1)}\\text{ m/s})^2}{${r.toFixed(1)}\\text{ m}} = \\frac{${(v * v).toFixed(1)}}{${r.toFixed(1)}}`,
          `\\mathbf{a_c = ${ac.toFixed(2)}\\text{ m/s}^2}`
        ];

        return { paramsList, stepsLatex, resultValue: ac.toFixed(2) + ' m/s²' };
      }
    },

    'circ-telem-fc': {
      symbol: 'F_c',
      nameTh: 'แรงสู่ศูนย์กลางลัพธ์ (Net Centripetal Force)',
      nameEn: 'Net Centripetal Force',
      unit: 'N',
      category: 'Circular Dynamics',
      formulaLatex: '\\Sigma F_r = m a_c = \\frac{m v^2}{r}',
      description: 'แรงลัพธ์ในแนวรัศมีที่บังคับให้วัตถุเบี่ยงเบนจากแนวเส้นตรงเข้ามาเคลื่อนที่เป็นแนวโค้งวงกลม',
      insight: 'แรงสู่ศูนย์กลางไม่ใช่แรงชนิดใหม่ แต่เป็นบทบาทของแรงจริงที่มีอยู่ เช่น แรงเสียดทานระหว่างยางกับถนน หรือแรงปฏิกิริยาตั้งฉากจากพื้นเอียง ($N\\sin\\theta$)',
      evaluate: function (params, state) {
        const m = Number(params.m !== undefined ? params.m : 1000.0);
        const v = Number(params.v !== undefined ? params.v : 20.0);
        const r = Number(params.r !== undefined ? params.r : 50.0);
        const fc = (m * v * v) / r;

        const paramsList = [
          { symbol: 'm', name: 'มวลของยานพาหนะ', val: m.toFixed(0) + ' kg' },
          { symbol: 'v', name: 'อัตราเร็ว', val: v.toFixed(1) + ' m/s' },
          { symbol: 'r', name: 'รัศมีวงโค้ง', val: r.toFixed(1) + ' m' }
        ];

        const stepsLatex = [
          `\\text{ตามกฎข้อที่ 2 ของนิวตันในแนวรัศมี: } \\Sigma F_r = m \\frac{v^2}{r}`,
          `\\text{แทนค่าตัวเลข: } F_c = (${m.toFixed(0)}\\text{ kg}) \\times \\frac{(${v.toFixed(1)})^2}{${r.toFixed(1)}} = (${m.toFixed(0)}) \\times \\frac{${(v * v).toFixed(1)}}{${r.toFixed(1)}}`,
          `= (${m.toFixed(0)}) \\times ${((v * v) / r).toFixed(2)} = ${fc.toFixed(0)}\\text{ N}`,
          `\\mathbf{F_c = ${fc.toLocaleString('en-US', { maximumFractionDigits: 0 })}\\text{ N}}`
        ];

        return { paramsList, stepsLatex, resultValue: fc.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' N' };
      }
    },

    'circ-telem-period': {
      symbol: 'T',
      nameTh: 'คาบเวลาการโคจรครบ 1 รอบ (Orbital Period)',
      nameEn: 'Rotational Period',
      unit: 's',
      category: 'Circular Dynamics',
      formulaLatex: 'T = \\frac{2\\pi r}{v} = \\frac{2\\pi}{\\omega}',
      description: 'ช่วงเวลาที่วัตถุใช้ในการเคลื่อนที่ครบหนึ่งรอบวงกลมสมบูรณ์',
      insight: 'ความสัมพันธ์ระหว่างคาบและความถี่คือส่วนกลับของกันและกัน: $f = 1/T$',
      evaluate: function (params, state) {
        const v = Number(params.v !== undefined ? params.v : 20.0);
        const r = Number(params.r !== undefined ? params.r : 50.0);
        const T = (2 * Math.PI * r) / v;

        const paramsList = [
          { symbol: 'r', name: 'รัศมีวงกลม', val: r.toFixed(1) + ' m' },
          { symbol: 'v', name: 'อัตราเร็วเชิงเส้น', val: v.toFixed(1) + ' m/s' }
        ];

        const stepsLatex = [
          `\\text{ความยาวรอบวง: } C = 2\\pi r = 2 \\times 3.1416 \\times ${r.toFixed(1)} = ${(2 * Math.PI * r).toFixed(2)}\\text{ m}`,
          `\\text{คำนวณคาบเวลา: } T = \\frac{C}{v} = \\frac{${(2 * Math.PI * r).toFixed(2)}}{${v.toFixed(1)}} = ${T.toFixed(2)}\\text{ s}`,
          `\\mathbf{T = ${T.toFixed(2)}\\text{ s}}`
        ];

        return { paramsList, stepsLatex, resultValue: T.toFixed(2) + ' s' };
      }
    },

    // =========================================================================
    // 5. OSCILLATIONS & SIMPLE HARMONIC MOTION
    // =========================================================================
    'osc-telem-omega0': {
      symbol: '\\omega_0',
      nameTh: 'ความถี่เชิงมุมธรรมชาติ (Natural Angular Frequency)',
      nameEn: 'Natural Angular Frequency',
      unit: 'rad/s',
      category: 'Oscillations',
      formulaLatex: '\\omega_0 = \\sqrt{\\frac{k}{m}} \\quad (\\text{มวลติดสปริง}) \\quad \\text{หรือ} \\quad \\omega_0 = \\sqrt{\\frac{g}{L}} \\quad (\\text{ลูกตุ้มนาฬิกา})',
      diagramSvg: `<svg viewBox="0 0 240 65" style="width: 100%; max-width: 220px; height: 55px;" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="12" x2="12" y2="52" stroke="#94A3B8" stroke-width="3"/>
        <line x1="12" y1="52" x2="228" y2="52" stroke="#475569" stroke-width="1.5"/>
        <path d="M 12 32 L 32 32 L 42 20 L 52 44 L 62 20 L 72 44 L 82 20 L 92 44 L 102 32 L 115 32" fill="none" stroke="#38BDF8" stroke-width="2"/>
        <rect x="115" y="18" width="34" height="28" rx="4" fill="#EA580C"/>
        <text x="132" y="36" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle">m</text>
        <text x="65" y="14" fill="#38BDF8" font-size="9" font-weight="bold">สปริง k</text>
        <text x="185" y="35" fill="#F59E0B" font-size="11" font-weight="bold">ω₀=√(k/m)</text>
      </svg>`,
      description: 'อัตราการแกว่งกวัดตามธรรมชาติของระบบเมื่อปราศจากแรงหน่วงและแรงขับภายนอก',
      insight: 'ความถี่ธรรมชาตินี้ถูกกำหนดโดยคุณสมบัติภายในของระบบเท่านั้น (ความแข็งตึง $k$ และความเฉื่อย $m$) โดยไม่ขึ้นกับแอมพลิจูดในการแกว่ง (เมื่อมุมเล็ก)',
      evaluate: function (params, state) {
        const k = Number(params.k !== undefined ? params.k : 25.0);
        const m = Number(params.m !== undefined ? params.m : 1.0);
        const omega0 = Math.sqrt(k / m);

        const paramsList = [
          { symbol: 'k', name: 'ค่านิจสปริง', val: k.toFixed(1) + ' N/m' },
          { symbol: 'm', name: 'มวลวัตถุ', val: m.toFixed(2) + ' kg' }
        ];

        const stepsLatex = [
          `\\text{จากสมการการสั่นแบบ SHM: } \\omega_0 = \\sqrt{\\frac{k}{m}}`,
          `\\text{แทนค่าตัวเลขสด: } \\omega_0 = \\sqrt{\\frac{${k.toFixed(1)}\\text{ N/m}}{${m.toFixed(2)}\\text{ kg}}} = \\sqrt{${(k / m).toFixed(2)}}`,
          `\\mathbf{\\omega_0 = ${omega0.toFixed(2)}\\text{ rad/s}}`
        ];

        return { paramsList, stepsLatex, resultValue: omega0.toFixed(2) + ' rad/s' };
      }
    },

    'osc-telem-period': {
      symbol: 'T',
      nameTh: 'คาบการแกว่งกวัด (Oscillation Period)',
      nameEn: 'Oscillation Period',
      unit: 's',
      category: 'Oscillations',
      formulaLatex: 'T = \\frac{2\\pi}{\\omega_0} = 2\\pi \\sqrt{\\frac{m}{k}} \\quad \\text{หรือ} \\quad T \\approx 2\\pi \\sqrt{\\frac{L}{g}} \\left(1 + \\frac{1}{4}\\sin^2\\frac{\\theta_0}{2}\\right)',
      description: 'เวลาที่ใช้ในการแกว่งกวัดกลับไปกลับมาครบ 1 รอบสมบูรณ์',
      insight: 'สำหรับลูกตุ้มมุมกว้าง อนุกรมของบอร์ดา (Borda Series) แสดงให้เห็นว่าคาบจะยาวขึ้นเมื่อมุมเริ่มต้น $\\theta_0$ มีค่ามากขึ้น',
      evaluate: function (params, state) {
        const k = Number(params.k !== undefined ? params.k : 25.0);
        const m = Number(params.m !== undefined ? params.m : 1.0);
        const omega0 = Math.sqrt(k / m);
        const T = (2 * Math.PI) / omega0;

        const paramsList = [
          { symbol: '\\omega_0', name: 'ความถี่เชิงมุม', val: omega0.toFixed(2) + ' rad/s' },
          { symbol: 'm', name: 'มวล', val: m.toFixed(2) + ' kg' },
          { symbol: 'k', name: 'ค่านิจสปริง', val: k.toFixed(1) + ' N/m' }
        ];

        const stepsLatex = [
          `\\text{จากความสัมพันธ์ } T = \\frac{2\\pi}{\\omega_0} = 2\\pi \\sqrt{\\frac{m}{k}}`,
          `\\text{แทนค่า: } T = \\frac{2 \\times 3.1416}{${omega0.toFixed(2)}} = \\frac{6.2832}{${omega0.toFixed(2)}}`,
          `\\mathbf{T = ${T.toFixed(2)}\\text{ s}}`
        ];

        return { paramsList, stepsLatex, resultValue: T.toFixed(2) + ' s' };
      }
    },

    // =========================================================================
    // 6. MECHANICAL WAVES & FOURIER
    // =========================================================================
    'wave-telem-speed': {
      symbol: 'v',
      nameTh: 'อัตราเร็วการแผ่ของคลื่น (Wave Propagation Speed)',
      nameEn: 'Wave Phase Speed',
      unit: 'm/s',
      category: 'Waves',
      formulaLatex: 'v = f \\lambda = \\frac{\\omega}{k} = \\sqrt{\\frac{T_{\\text{tension}}}{\\mu}}',
      description: 'อัตราเร็วที่รูปคลื่นและพลังงานเดินทางผ่านตัวกลาง ขึ้นอยู่กับแรงตึงเชือกและความหนาแน่นเชิงเส้น',
      insight: 'อัตราเร็วคลื่นถูกกำหนดโดยคุณสมบัติของตัวกลางเท่านั้น การเพิ่มความถี่ $f$ จะทำให้ความยาวคลื่น $\\lambda$ หดสั้นลงโดยที่ผลคูณ $f\\lambda$ ยังคงเท่าเดิม',
      evaluate: function (params, state) {
        const f = Number(params.f !== undefined ? params.f : 1.20);
        const lambda = Number(params.lambda !== undefined ? params.lambda : 33.33);
        const v = f * lambda;

        const paramsList = [
          { symbol: 'f', name: 'ความถี่คลื่น', val: f.toFixed(2) + ' Hz' },
          { symbol: '\\lambda', name: 'ความยาวคลื่น', val: lambda.toFixed(2) + ' m' }
        ];

        const stepsLatex = [
          `\\text{จากสมการพื้นฐานของคลื่น: } v = f \\lambda`,
          `\\text{แทนค่าตัวเลข: } v = (${f.toFixed(2)}\\text{ Hz}) \\times (${lambda.toFixed(2)}\\text{ m})`,
          `= ${(f * lambda).toFixed(2)}\\text{ m/s}`,
          `\\mathbf{v = ${v.toFixed(2)}\\text{ m/s}}`
        ];

        return { paramsList, stepsLatex, resultValue: v.toFixed(2) + ' m/s' };
      }
    },

    'wave-telem-lambda': {
      symbol: '\\lambda',
      nameTh: 'ความยาวคลื่น (Wavelength)',
      nameEn: 'Wavelength',
      unit: 'm',
      category: 'Waves',
      formulaLatex: '\\lambda = \\frac{v}{f} = \\frac{2\\pi}{k}',
      description: 'ระยะทางเชิงพื้นที่ระหว่างจุดสองจุดที่มีเฟสตรงกัน (เช่น สันคลื่นถึงสันคลื่นถัดไป)',
      insight: 'เป็นระยะคาบในมิติของตำแหน่ง ($x$) เทียบเคียงได้กับคาบเวลา $T$ ซึ่งเป็นระยะคาบในมิติของเวลา ($t$)',
      evaluate: function (params, state) {
        const v = Number(params.v !== undefined ? params.v : 40.0);
        const f = Number(params.f !== undefined ? params.f : 1.20);
        const lambda = v / f;

        const paramsList = [
          { symbol: 'v', name: 'อัตราเร็วคลื่น', val: v.toFixed(2) + ' m/s' },
          { symbol: 'f', name: 'ความถี่คลื่น', val: f.toFixed(2) + ' Hz' }
        ];

        const stepsLatex = [
          `\\text{จากสมการคลื่น: } \\lambda = \\frac{v}{f}`,
          `\\text{แทนค่า: } \\lambda = \\frac{${v.toFixed(2)}\\text{ m/s}}{${f.toFixed(2)}\\text{ Hz}} = ${lambda.toFixed(2)}\\text{ m}`,
          `\\mathbf{\\lambda = ${lambda.toFixed(2)}\\text{ m}}`
        ];

        return { paramsList, stepsLatex, resultValue: lambda.toFixed(2) + ' m' };
      }
    }
  };

  /**
   * Helper to format KaTeX math
   */
  function renderKaTeX(latex, isDisplay = true) {
    if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
      try {
        return window.katex.renderToString(latex, { displayMode: isDisplay, throwOnError: false });
      } catch (e) {
        return `<code class="math-fallback">${latex}</code>`;
      }
    }
    if (typeof root.MathRenderer !== 'undefined' && typeof root.MathRenderer.renderLatex === 'function') {
      return root.MathRenderer.renderLatex(latex, isDisplay);
    }
    return `<code class="math-fallback">${latex}</code>`;
  }

  /**
   * Helper to format text containing inline math expressions like $x$
   */
  function formatTextWithMath(text) {
    if (!text) return '';
    return text.replace(/\$([^\$]+)\$/g, (match, math) => {
      return renderKaTeX(math, false);
    });
  }

  /**
   * Main Inspector Component Renderer
   */
  function renderInspectorCard(varId) {
    const item = VARIABLE_CATALOG[varId];
    if (!item) return '';

    const evalData = item.evaluate(currentParams, currentState);

    const paramBadges = evalData.paramsList.map(p => `
      <div class="calc-param-chip">
        <span class="param-sym">${renderKaTeX(p.symbol, false)}</span>
        <span class="param-name">${p.name}:</span>
        <strong class="param-val">${p.val}</strong>
      </div>
    `).join('');

    const stepRows = evalData.stepsLatex.map((step, idx) => `
      <div class="calc-step-row">
        <div class="step-badge">ขั้นที่ ${idx + 1}</div>
        <div class="step-math">${renderKaTeX(step, true)}</div>
      </div>
    `).join('');

    return `
      <div class="sim-calc-inspector-card" data-var="${varId}">
        <div class="calc-inspector-header">
          <div class="calc-header-title">
            <span class="fx-icon-pill">𝑓(𝑥)</span>
            <div class="calc-header-meta">
              <div class="var-main-title">
                <span class="var-symbol-badge">${renderKaTeX(item.symbol, false)}</span>
                <span class="var-title-th">${item.nameTh}</span>
              </div>
              <div class="var-subtitle">${item.nameEn} • หน่วย SI: <strong>${item.unit}</strong></div>
            </div>
          </div>
          <div class="calc-header-actions">
            <button type="button" class="btn-toggle-inspector" id="btn-toggle-calc-inspector" aria-label="ย่อหรือขยายแผงคำนวณ" title="ย่อ / ขยาย">
              ${isExpanded ? '▲ ซ่อนวิธีคำนวณ' : '▼ ขยายวิธีคำนวณ'}
            </button>
          </div>
        </div>

        <div class="calc-inspector-body" style="display: ${isExpanded ? 'grid' : 'none'};">
          <!-- 1. Master Formula Card -->
          <div class="calc-section-box formula-governing-box">
            <div class="calc-box-label">📐 1. จากสูตรนี้ (Governing Equation)</div>
            <div class="math-display-wrap">
              ${renderKaTeX(item.formulaLatex, true)}
            </div>
            ${item.diagramSvg ? `<div class="inspector-formula-diagram-wrap" style="margin: 0.5rem 0; text-align: center; border-radius: 6px; background: rgba(2, 6, 23, 0.45); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.35rem 0.5rem;">${item.diagramSvg}</div>` : ''}
            <div class="formula-desc-text">${formatTextWithMath(item.description)}</div>
          </div>

          <!-- 2. Live Parameters Input -->
          <div class="calc-section-box params-live-box">
            <div class="calc-box-label">🔢 2. ตัวแปรต้น ณ ค่าปัจจุบัน (Live Input Parameters)</div>
            <div class="params-chips-grid">
              ${paramBadges}
            </div>
          </div>

          <!-- 3. Step-by-Step Numerical Substitution -->
          <div class="calc-section-box substitution-steps-box">
            <div class="calc-box-label">⚡ 3. แทนค่าตัวเลขจริงทีละขั้นตอน (Step-by-Step Substitution)</div>
            <div class="steps-flow-container">
              ${stepRows}
            </div>
          </div>

          <!-- 4. Result & Physical Meaning -->
          <div class="calc-section-box result-summary-box">
            <div class="result-header-row">
              <span class="calc-box-label">🎯 4. จะได้ออกมาเป็นค่านี้ (Computed Output)</span>
              <span class="live-sync-indicator">● อัปเดตสดแบบเรียลไทม์ 100%</span>
            </div>
            <div class="final-output-display">
              <span class="output-sym">${renderKaTeX(item.symbol, false)} = </span>
              <strong class="output-value-badge">${evalData.resultValue}</strong>
            </div>
            <div class="physical-insight-callout">
              <span class="insight-icon">💡</span>
              <span class="insight-text"><strong>ข้อสังเกตทางกายภาพ:</strong> ${formatTextWithMath(item.insight)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Update active inspector in-place if open
   */
  function refreshActiveInspector() {
    const containers = document.querySelectorAll('.sim-telemetry-calc-target');
    containers.forEach(container => {
      if (container) {
        container.innerHTML = renderInspectorCard(currentActiveVarId);
        bindInspectorControls(container);
      }
    });

    // Update active highlight on telemetry boxes
    document.querySelectorAll('.telem-box, .telemetry-item').forEach(box => {
      const isSelected = box.id === currentActiveVarId || box.dataset.var === currentActiveVarId;
      box.classList.toggle('telem-box-selected', isSelected);
    });
  }

  /**
   * Bind inspector UI interactions (e.g. collapse/expand)
   */
  function bindInspectorControls(container) {
    const toggleBtn = container.querySelector('#btn-toggle-calc-inspector');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        const body = container.querySelector('.calc-inspector-body');
        if (body) body.style.display = isExpanded ? 'grid' : 'none';
        toggleBtn.textContent = isExpanded ? '▲ ซ่อนวิธีคำนวณ' : '▼ ขยายวิธีคำนวณ';
      });
    }
  }

  /**
   * Attach click listener to telemetry boxes across the DOM
   */
  function attachTelemetryClickListeners() {
    const allTelemBoxes = document.querySelectorAll('.telem-box, .telemetry-item');

    allTelemBoxes.forEach(box => {
      // Avoid attaching duplicate listeners
      if (box.dataset.hasCalcListener) return;
      box.dataset.hasCalcListener = 'true';

      // Find the ID of the telemetry value element or container
      const valEl = box.querySelector('.telem-val, .telemetry-value') || box;
      const targetId = valEl.id || box.id;

      // Add clickable affordance badge if variable is in catalog
      if (VARIABLE_CATALOG[targetId]) {
        box.classList.add('telem-box-interactive');
        box.setAttribute('title', 'คลิกเพื่อดูสูตรและการแทนค่าตัวเลขสด (Click to view live formula & step-by-step substitution)');

        if (!box.querySelector('.telem-fx-badge')) {
          const badge = document.createElement('span');
          badge.className = 'telem-fx-badge';
          badge.textContent = '𝑓(𝑥)';
          badge.title = 'ดูสูตรและวิธีคิด';
          box.appendChild(badge);
        }
      }

      box.addEventListener('click', () => {
        const varKey = targetId;
        if (VARIABLE_CATALOG[varKey]) {
          currentActiveVarId = varKey;
          isExpanded = true;
          refreshActiveInspector();

          // Smooth scroll into view on mobile if needed
          const target = document.querySelector('.sim-telemetry-calc-target');
          if (target && window.innerWidth <= 768) {
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    });
  }

  /**
   * Inject inspector placeholder containers into simulator telemetry panels
   */
  function injectInspectorContainers() {
    // 1. Remove any legacy targets inside aside
    document.querySelectorAll('aside .sim-telemetry-calc-target').forEach(el => el.remove());

    // 2. Ensure each active simulation container has a full-width target below sim-layout
    const simContainers = document.querySelectorAll('.sim-mode-container');
    simContainers.forEach(container => {
      if (!container.querySelector('.sim-telemetry-calc-target')) {
        const simLayout = container.querySelector('.sim-layout');
        const targetDiv = document.createElement('div');
        targetDiv.className = 'sim-telemetry-calc-target sim-calc-fullwidth-container';
        if (simLayout && simLayout.nextElementSibling) {
          container.insertBefore(targetDiv, simLayout.nextElementSibling);
        } else {
          container.appendChild(targetDiv);
        }
      }
    });
  }

  /**
   * Public API: Initialize the Inspector
   */
  function init() {
    injectInspectorContainers();
    attachTelemetryClickListeners();
    refreshActiveInspector();
    hasInitialized = true;
  }

  /**
   * Public API: Update live simulation parameters & state
   */
  function updateLiveTelemetry(mode, state = {}, params = {}) {
    currentMode = mode || currentMode;
    currentState = Object.assign(currentState, state);
    currentParams = Object.assign(currentParams, params);

    // Re-render open card so substituted numbers move with the simulation
    refreshActiveInspector();
  }

  /**
   * Public API: Select a specific variable programmatically
   */
  function selectVariable(varId) {
    if (VARIABLE_CATALOG[varId]) {
      currentActiveVarId = varId;
      isExpanded = true;
      refreshActiveInspector();
    }
  }

  return {
    init,
    updateLiveTelemetry,
    selectVariable,
    attachTelemetryClickListeners,
    VARIABLE_CATALOG,
    renderInspectorCard
  };
}));
