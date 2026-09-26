/**
 * practice_problems_content.js - Comprehensive Practice Problem Bank for PhysicsNoza 3.0
 * Covers: Fundamental Physics (Ch 01-07), Advanced Physics/Olympiad, and Civil Engineering
 * Academic standard with interactive multiple choice, KaTeX step-by-step solutions, and simulator links.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PracticeProblemsContent = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    categories: [
      { id: "all", nameTh: "ทั้งหมดทุกหมวด", icon: "🌐" },
      { id: "fundamental", nameTh: "ฟิสิกส์พื้นฐาน (บทที่ 01-07)", icon: "⚛️" },
      { id: "advanced", nameTh: "ฟิสิกส์ขั้นสูง & สอวน.", icon: "🌌" },
      { id: "civil", nameTh: "วิศวกรรมโยธา (สถิตยศาสตร์ & วัสดุ)", icon: "🏗️" }
    ],

    problems: [
      // FUNDAMENTAL CH 01: Kinematics & Projectile
      {
        id: "prob-ch01-01",
        track: "fundamental",
        chapterId: "ch01",
        chapterTitle: "บทที่ 01: การเคลื่อนที่สองมิติและโปรเจกไทล์",
        difficulty: "ปานกลาง (Intermediate)",
        title: "การยิงโปรเจกไทล์ทำมุม 45 องศาบนพื้นราบ",
        question: "ยิงอนุภาคจากพื้นราบด้วยอัตราเร็วต้น $u = 20 \\text{ m/s}$ ทำมุม $\\theta = 45^\\circ$ กับแนวราบ ในสภาวะสุญญากาศที่ความเร่งโน้มถ่วง $g = 9.8 \\text{ m/s}^2$ จงหาระยะตกไกลในแนวราบ ($R$) และจุดสูงสุดของวิถี ($H$)",
        options: [
          "$R = 40.82 \\text{ m}, \\quad H = 10.20 \\text{ m}$",
          "$R = 20.41 \\text{ m}, \\quad H = 5.10 \\text{ m}$",
          "$R = 40.82 \\text{ m}, \\quad H = 20.41 \\text{ m}$",
          "$R = 81.63 \\text{ m}, \\quad H = 10.20 \\text{ m}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\n1. ความเร็วต้นในแต่ละแกน:\n   $$u_x = u \\cos(45^\\circ) = 20 \\times \\frac{\\sqrt{2}}{2} = 10\\sqrt{2} \\approx 14.14 \\text{ m/s}$$\n   $$u_y = u \\sin(45^\\circ) = 20 \\times \\frac{\\sqrt{2}}{2} = 10\\sqrt{2} \\approx 14.14 \\text{ m/s}$$\n2. เวลาทั้งหมดในการลอยตัว ($T$):\n   $$T = \\frac{2 u_y}{g} = \\frac{2(14.142)}{9.8} \\approx 2.886 \\text{ s}$$\n3. ระยะตกไกลในแนวราบ ($R$):\n   $$R = \\frac{u^2 \\sin(2\\theta)}{g} = \\frac{20^2 \\sin(90^\\circ)}{9.8} = \\frac{400(1)}{9.8} \\approx 40.82 \\text{ m}$$\n4. ความสูงสูงสุด ($H$):\n   $$H = \\frac{u_y^2}{2g} = \\frac{(14.142)^2}{2(9.8)} = \\frac{200}{19.6} \\approx 10.20 \\text{ m}$$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Novel Alternative Method - Energy & Hodograph Symmetry):\n1. การอนุรักษ์พลังงานกล (Mechanical Energy Conservation):\n   ที่จุดสูงสุด ความเร็วแนวดิ่ง $v_y = 0$ เหลือเฉพาะ $v_x = u\\cos 45^\\circ = 10\\sqrt{2}\\text{ m/s}$\n   จาก $\\Delta E_k + \\Delta E_p = 0 \\implies \\frac{1}{2}m u^2 = \\frac{1}{2}m v_x^2 + m g H$\n   $$H = \\frac{u^2 - v_x^2}{2g} = \\frac{400 - 200}{2(9.8)} = \\frac{200}{19.6} \\approx 10.20\\text{ m}$$\n2. ปริภูมิความเร็วเชิงเรขาคณิต (Velocity Hodograph):\n   เวกเตอร์ความเร็วเฉลี่ยตลอดวิถี $\\vec{v}_{\\text{avg}} = \\frac{\\vec{u} + \\vec{v}_f}{2}$\n   เนื่องจากวิถีสมมาตร $\\vec{v}_f = (u_x, -u_y)$ ดังนั้น $\\vec{v}_{\\text{avg}} = (u_x, 0) = (14.142, 0)\\text{ m/s}$\n   เวลาลอยตัว $T = \\frac{\\Delta v_y}{g} = \\frac{2 u_y}{g} = \\frac{2(14.142)}{9.8} \\approx 2.886\\text{ s}$\n   ระยะตกไกล $R = |\\vec{v}_{\\text{avg}}| T = (14.142)(2.886) \\approx 40.82\\text{ m}$\n(ได้คำตอบ $R = 40.82\\text{ m}, H = 10.20\\text{ m}$ ตรงกันทุกประการ โดยไม่ต้องใช้สมการพาราโบลาหรือเอกลักษณ์ตรีโกณมิติมุมสองเท่า)",
        simLink: { chapter: "ch01", mode: "projectile" }
      },

      // FUNDAMENTAL CH 02: Circular Motion
      {
        id: "prob-ch02-01",
        track: "fundamental",
        chapterId: "ch02",
        chapterTitle: "บทที่ 02: การเคลื่อนที่แบบวงกลมและแรงสู่ศูนย์กลาง",
        difficulty: "ปานกลาง (Intermediate)",
        title: "อัตราเร็วปลอดภัยสูงสุดบนทางโค้งยกมุมเอียง",
        question: "ถนนโค้งรัศมีความโค้ง $r = 100 \\text{ m}$ ถูกออกแบบยกมุมเอียง $\\theta = 15^\\circ$ หากไม่คิดแรงเสียดทานระหว่างยางกับผิวถนน ($\\mu = 0$) จงหาอัตราเร็วปลอดภัยที่รถยนต์สามารถเลี้ยวผ่านโค้งนี้ได้โดยไม่ลื่นไถลออกนอกโค้ง กำหนด $g = 9.8 \\text{ m/s}^2$ และ $\\tan(15^\\circ) \\approx 0.2679$",
        options: [
          "$v = 26.26 \\text{ m/s} \\; (94.5 \\text{ km/h})$",
          "$v = 16.20 \\text{ m/s} \\; (58.3 \\text{ km/h})$",
          "$v = 10.50 \\text{ m/s} \\; (37.8 \\text{ km/h})$",
          "$v = 31.30 \\text{ m/s} \\; (112.7 \\text{ km/h})$"
        ],
        correctIndex: 1,
        explanation: "ขั้นตอนวิธีคิด:\n1. วาด FBD ของรถบนพื้นเอียง: มีแรงโน้มถ่วง $mg$ ชี้ลง และแรงปฏิกิริยาตั้งฉาก $N$ ชี้เอียงตั้งฉากกับผิวโค้ง\n2. สมดุลแนวดิ่ง: $N \\cos\\theta = mg \\implies N = \\frac{mg}{\\cos\\theta}$ และแรงสู่ศูนย์กลางในแนวราบ: $F_c = N \\sin\\theta = \\frac{m v^2}{r}$\n3. นำสองสมการมาหารกัน:\n   $$\\tan\\theta = \\frac{v^2}{r g} \\implies v = \\sqrt{r g \\tan\\theta}$$\n4. แทนค่าตัวเลข:\n   $$v = \\sqrt{(100)(9.8)(\\tan 15^\\circ)} = \\sqrt{980 \\times 0.2679} = \\sqrt{262.54} \\approx 16.20 \\text{ m/s}$$\nคิดเป็นความเร็วในหน่วยกิโลเมตรต่อชั่วโมง: $16.20 \\times 3.6 \\approx 58.32 \\text{ km/h}$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Novel Alternative Method - Rotating Frame & Effective Gravity Vector):\n1. ในกรอบอ้างอิงของรถยนต์ที่กำลังเลี้ยวโค้ง (Rotating Frame of Reference):\n   รถยนต์จะสัมผัสกับ 'สนามโน้มถ่วงยังผล' (Effective Gravitational Field) ที่เป็นผลรวมของความเร่งโน้มถ่วง $\\vec{g}$ ชี้ลง และความเร่งหนีศูนย์กลางเทียม $\\vec{a}_{\\text{cf}} = \\frac{v^2}{r}\\hat{r}$ ชี้ออกนอกโค้ง:\n   $$\\vec{g}_{\\text{eff}} = \\vec{g} - \\frac{v^2}{r}\\hat{r}$$\n2. เงื่อนไขการไม่ลื่นไถลบนพื้นเอียงไร้แรงเสียดทาน:\n   เวกเตอร์ $\\vec{g}_{\\text{eff}}$ จะต้อง 'ตั้งฉากกับแนวผิวพื้นเอียงพอดี' เพื่อไม่ให้มีองค์ประกอบแรงลัพธ์ขนานกับผิวทางลาด:\n   $$\\tan\\theta = \\frac{a_{\\text{cf}}}{g} = \\frac{v^2/r}{g} = \\frac{v^2}{rg}$$\n3. คำนวณความเร็วโดยตรง:\n   $$v = \\sqrt{rg\\tan\\theta} = \\sqrt{(100)(9.8)(0.2679)} \\approx 16.20\\text{ m/s} = 58.32\\text{ km/h}$$\n(ได้คำตอบเท่ากันอย่างงดงาม โดยมองการเลี้ยวโค้งเป็นการปรับทิศทางของเวกเตอร์แรงโน้มถ่วงเทียม)",
        simLink: { chapter: "ch02", mode: "circular" }
      },

      // FUNDAMENTAL CH 03: Oscillations & SHM
      {
        id: "prob-ch03-01",
        track: "fundamental",
        chapterId: "ch03",
        chapterTitle: "บทที่ 03: การแกว่งกวัดและฮาร์มอนิกอย่างง่าย",
        difficulty: "พื้นฐาน (Basic)",
        title: "คาบและความถี่ของการสั่นระบบมวล-สปริง",
        question: "มวล $m = 0.50 \\text{ kg}$ ติดอยู่ที่ปลายสปริงในแนวราบที่มีค่านิจสปริง $k = 200 \\text{ N/m}$ บนพื้นผิวลื่นไร้แรงเสียดทาน หากดึงมวลให้ยืดออกจากตำแหน่งสมดุล $A = 0.10 \\text{ m}$ แล้วปล่อยมือ จงหาคาบการสั่น ($T$) และอัตราเร็วสูงสุด ($v_{\\max}$)",
        options: [
          "$T = 0.628 \\text{ s}, \\quad v_{\\max} = 1.00 \\text{ m/s}$",
          "$T = 0.314 \\text{ s}, \\quad v_{\\max} = 4.00 \\text{ m/s}$",
          "$T = 0.314 \\text{ s}, \\quad v_{\\max} = 2.00 \\text{ m/s}$",
          "$T = 1.256 \\text{ s}, \\quad v_{\\max} = 2.00 \\text{ m/s}$"
        ],
        correctIndex: 2,
        explanation: "ขั้นตอนวิธีคิด:\n1. ความถี่เชิงมุมธรรมชาติ ($\\omega_0$):\n   $$\\omega_0 = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{200}{0.50}} = \\sqrt{400} = 20 \\text{ rad/s}$$\n2. คาบการสั่น ($T$):\n   $$T = \\frac{2\\pi}{\\omega_0} = \\frac{2(3.1416)}{20} \\approx 0.314 \\text{ s}$$\n3. อัตราเร็วสูงสุดที่ตำแหน่งสมดุล ($v_{\\max}$):\n   $$v_{\\max} = \\omega_0 A = (20 \\text{ rad/s})(0.10 \\text{ m}) = 2.00 \\text{ m/s}$$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Novel Alternative Method - Total Energy Conservation):\n1. ในระบบ SHM พลังงานกลรวมคงที่ตลอดการเคลื่อนที่:\n   $$E_{\\text{total}} = \\frac{1}{2} k A^2 = \\frac{1}{2}(200)(0.10)^2 = 1.00\\text{ J}$$\n2. ที่ตำแหน่งสมดุล ($x = 0$) พลังงานศักย์เป็นศูนย์ พลังงานกลทั้งหมดเปลี่ยนเป็นพลังงานจลน์สูงสุด:\n   $$E_k = \\frac{1}{2} m v_{\\max}^2 = E_{\\text{total}} \\implies v_{\\max} = \\sqrt{\\frac{2 E_{\\text{total}}}{m}} = \\sqrt{\\frac{2(1.00)}{0.50}} = \\sqrt{4.00} = 2.00\\text{ m/s}$$\n3. หาคาบจากนิยามการอนุรักษ์พลังงานในระนาบเฟส (Phase Space Integral):\n   $$T = 2\\pi \\frac{A}{v_{\\max}} = 2(3.1416) \\frac{0.10}{2.00} = 0.314\\text{ s}$$\n(ได้คำตอบ $T = 0.314\\text{ s}, v_{\\max} = 2.00\\text{ m/s}$ ตรงกัน โดยไม่ต้องตั้งสมการอนุพันธ์อันดับสอง)",
        simLink: { chapter: "ch03", mode: "oscillation" }
      },

      // FUNDAMENTAL CH 04: Waves & Acoustics
      {
        id: "prob-ch04-01",
        track: "fundamental",
        chapterId: "ch04",
        chapterTitle: "บทที่ 04: คลื่นกลและเสียง",
        difficulty: "ปานกลาง (Intermediate)",
        title: "ระดับความเข้มเสียงของแหล่งกำเนิดหลายตัว",
        question: "เครื่องจักรหนึ่งเครื่องส่งเสียงที่มีระดับความเข้มเสียง $\\beta_1 = 70 \\text{ dB}$ ถ้านำเครื่องจักรชนิดเดียวกันและทำงานเท่ากันทุกประการมาเปิดพร้อมกัน 10 เครื่อง ระดับความเข้มเสียงรวม ($\\beta_{10}$) จะมีค่าเท่าใด",
        options: [
          "$\\beta_{10} = 80 \\text{ dB}$",
          "$\\beta_{10} = 700 \\text{ dB}$",
          "$\\beta_{10} = 140 \\text{ dB}$",
          "$\\beta_{10} = 75 \\text{ dB}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\\n1. นิยามระดับความเข้มเสียงในหน่วยเดซิเบล: $\\beta = 10 \\log_{10}\\left(\\frac{I}{I_0}\\right)$\\n2. เมื่อเครื่องจักรทำงานพร้อมกัน 10 เครื่อง ความเข้มเสียงรวมเชิงกายภาพจะเพิ่มเป็น 10 เท่า: $I_{\\text{total}} = 10 I_1$\\n3. คำนวณระดับความเข้มเสียงรวม:\\n   $$\\beta_{10} = 10 \\log_{10}\\left(\\frac{10 I_1}{I_0}\\right) = 10 \\left[ \\log_{10}(10) + \\log_{10}\\left(\\frac{I_1}{I_0}\\right) \\right]$$\\n   $$\\beta_{10} = 10(1) + \\beta_1 = 10 + 70 = 80 \\text{ dB}$$\\n(หลักการสำคัญ: เมื่อกำลังเสียงเพิ่มเป็น 10 เท่า ระดับเดซิเบลจะเพิ่มขึ้น 10 dB เสมอ)",
        simLink: { chapter: "ch04", mode: "wave" }
      },

      // FUNDAMENTAL CH 05: Thermodynamics
      {
        id: "prob-ch05-01",
        track: "fundamental",
        chapterId: "ch05",
        chapterTitle: "บทที่ 05: อุณหพลศาสตร์และทฤษฎีจลน์ของแก๊ส",
        difficulty: "ปานกลาง (Intermediate)",
        title: "ประสิทธิภาพสูงสุดของเครื่องยนต์คาร์โนต์",
        question: "เครื่องยนต์ความร้อนทำงานตามวัฏจักรคาร์โนต์ระหว่างแหล่งกักเก็บความร้อนอุณหภูมิสูง $T_H = 500^\\circ\\text{C}$ และแหล่งคายความร้อนอุณหภูมิต่ำ $T_C = 25^\\circ\\text{C}$ จงหาประสิทธิภาพทางความร้อนสูงสุดในเชิงทฤษฎี ($\\eta_{\\text{Carnot}}$)",
        options: [
          "$\\eta_{\\text{Carnot}} = 95.0\\%$",
          "$\\eta_{\\text{Carnot}} = 50.0\\%$",
          "$\\eta_{\\text{Carnot}} = 38.6\\%$",
          "$\\eta_{\\text{Carnot}} = 61.4\\%$"
        ],
        correctIndex: 3,
        explanation: "ขั้นตอนวิธีคิด:\\n1. แปลงอุณหภูมิเป็นหน่วยเคลวิน (Kelvin, K) เสมอ:\\n   $$T_H = 500 + 273.15 = 773.15 \\text{ K}$$\\n   $$T_C = 25 + 273.15 = 298.15 \\text{ K}$$\\n2. คำนวณประสิทธิภาพตามสูตรคาร์โนต์:\\n   $$\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H} = 1 - \\frac{298.15}{773.15} = 1 - 0.3856 = 0.6144 = 61.44\\%$$\\nข้อควรระวัง: ห้ามใช้อุณหภูมิในหน่วยองศาเซลเซียสคำนวณอัตราส่วนโดยตรงเด็ดขาด",
        simLink: { chapter: "ch05", mode: "thermo" }
      },

      // FUNDAMENTAL CH 06: Electromagnetism
      {
        id: "prob-ch06-01",
        track: "fundamental",
        chapterId: "ch06",
        chapterTitle: "บทที่ 06: ไฟฟ้าและแม่เหล็ก",
        difficulty: "ปานกลาง (Intermediate)",
        title: "แรงคูลอมบ์และค่าคงตัวเวลาในวงจร RC",
        question: "วงจร RC อนุกรมประกอบด้วยตัวต้านทาน $R = 100 \\text{ k}\\Omega$ และตัวเก็บประจุ $C = 50 \\mu\\text{F}$ ต่อเข้ากับแหล่งจ่ายไฟฟ้ากระแสตรง $V_0 = 12 \\text{ V}$ จงหาค่าคงตัวเวลาของวงจร ($\\tau$) และประจุสะสมสูงสุดเมื่อประจุเต็ม ($Q_{\\max}$)",
        options: [
          "$\\tau = 0.50 \\text{ s}, \\quad Q_{\\max} = 6.0 \\times 10^{-5} \\text{ C}$",
          "$\\tau = 5.0 \\text{ s}, \\quad Q_{\\max} = 6.0 \\times 10^{-4} \\text{ C}$",
          "$\\tau = 5.0 \\text{ s}, \\quad Q_{\\max} = 1.2 \\times 10^{-3} \\text{ C}$",
          "$\\tau = 50.0 \\text{ s}, \\quad Q_{\\max} = 6.0 \\times 10^{-4} \\text{ C}$"
        ],
        correctIndex: 1,
        explanation: "ขั้นตอนวิธีคิด:\\n1. คำนวณค่าคงตัวเวลาของวงจร RC ($\\tau$):\\n   $$\\tau = R C = (100 \\times 10^3 \\; \\Omega)(50 \\times 10^{-6} \\text{ F}) = 5.0 \\text{ s}$$\\n2. ประจุไฟฟ้าสะสมสูงสุดเมื่อต่อทิ้งไว้เป็นเวลานาน ($t \\gg \\tau$):\\n   $$Q_{\\max} = C V_0 = (50 \\times 10^{-6} \\text{ F})(12 \\text{ V}) = 600 \\times 10^{-6} \\text{ C} = 6.0 \\times 10^{-4} \\text{ C}$$\\n3. ณ เวลา $t = \\tau = 5.0$ วินาที ประจุจะสะสมได้ $63.2\\%$ ของ $Q_{\\max}$",
        simLink: { chapter: "ch06", mode: "em", submode: "rc_circuit" }
      },

      // FUNDAMENTAL CH 07: Nuclear Physics
      {
        id: "prob-ch07-01",
        track: "fundamental",
        chapterId: "ch07",
        chapterTitle: "บทที่ 07: ฟิสิกส์นิวเคลียร์และอนุภาค",
        difficulty: "ปานกลาง (Intermediate)",
        title: "การสลายตัวของไอโซโทปกัมมันตรังสีและครึ่งชีวิต",
        question: "ไอโซโทปรังสีมีครึ่งชีวิต $T_{1/2} = 8.0$ วัน หากเริ่มต้นมีสารนี้อยู่ $N_0 = 1.60 \\times 10^{20}$ นิวเคลียส เมื่อเวลาผ่านไป $t = 24.0$ วัน จะเหลือนิวเคลียสที่ยังไม่สลายตัวอยู่กี่นิวเคลียส",
        options: [
          "$N = 2.00 \\times 10^{19} \\text{ นิวเคลียส}$",
          "$N = 4.00 \\times 10^{19} \\text{ นิวเคลียส}$",
          "$N = 1.00 \\times 10^{19} \\text{ นิวเคลียส}$",
          "$N = 8.00 \\times 10^{19} \\text{ นิวเคลียส}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\\n1. คำนวณจำนวนรอบของครึ่งชีวิตที่ผ่านไป ($n$):\\n   $$n = \\frac{t}{T_{1/2}} = \\frac{24.0}{8.0} = 3 \\text{ รอบ}$$\\n2. ปริมาณที่เหลืออยู่ตามกฎการสลายตัว:\\n   $$N(t) = N_0 \\left(\\frac{1}{2}\\right)^n = (1.60 \\times 10^{20}) \\left(\\frac{1}{2}\\right)^3 = \\frac{1.60 \\times 10^{20}}{8} = 2.00 \\times 10^{19} \\text{ นิวเคลียส}$$\\n(จำนวนนิวเคลียสที่สลายตัวไปแล้ว $= 1.60 \\times 10^{20} - 0.20 \\times 10^{20} = 1.40 \\times 10^{20}$ นิวเคลียส)",
        simLink: { chapter: "ch07", mode: "nuclear", submode: "decay_stochastic" }
      },

      // ADVANCED / OLYMPIAD: Analytical Mechanics
      {
        id: "prob-adv-01",
        track: "advanced",
        chapterId: "analytical",
        chapterTitle: "กลศาสตร์วิเคราะห์ (Analytical Mechanics) & สอวน.",
        difficulty: "โอลิมปิก (Olympiad)",
        title: "สมการลากรางจ์ของลูกตุ้มนาฬิกาเชิงเดี่ยว",
        question: "พิจารณาลูกตุ้มนาฬิกามวล $m$ แขวนด้วยเชือกเบายาว $l$ ในระนาบดิ่ง ภายใต้สนามโน้มถ่วง $g$ หากใช้มุมแกว่ง $\\theta$ เป็นพิกัดนัยทั่วไป (Generalized Coordinate) ฟังก์ชันลากรานเจียน ($L = T - V$) และสมการการเคลื่อนที่ของออยเลอร์-ลากรางจ์คือข้อใด",
        options: [
          "$L = \\frac{1}{2} m l^2 \\dot{\\theta}^2 + m g l \\cos\\theta, \\quad \\ddot{\\theta} + \\frac{g}{l} \\sin\\theta = 0$",
          "$L = \\frac{1}{2} m l^2 \\dot{\\theta}^2 - m g l \\sin\\theta, \\quad \\ddot{\\theta} + \\frac{g}{l} \\cos\\theta = 0$",
          "$L = \\frac{1}{2} m \\dot{\\theta}^2 - m g l \\cos\\theta, \\quad \\ddot{\\theta} + g l \\sin\\theta = 0$",
          "$L = m l^2 \\dot{\\theta}^2 + 2 m g l \\cos\\theta, \\quad \\ddot{\\theta} + \\frac{2g}{l} \\sin\\theta = 0$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\\n1. กำหนดตำแหน่งในพิกัดคาร์ทีเซียน: $x = l \\sin\\theta, \\; y = -l \\cos\\theta$\\n2. อนุพันธ์หาความเร็ว: $\\dot{x} = l \\dot{\\theta} \\cos\\theta, \\; \\dot{y} = l \\dot{\\theta} \\sin\\theta$\\n   $$v^2 = \\dot{x}^2 + \\dot{y}^2 = l^2 \\dot{\\theta}^2 (\\cos^2\\theta + \\sin^2\\theta) = l^2 \\dot{\\theta}^2$$\\n3. พลังงานจลน์ $T = \\frac{1}{2} m v^2 = \\frac{1}{2} m l^2 \\dot{\\theta}^2$\\n4. พลังงานศักย์ $V = m g y = -m g l \\cos\\theta$\\n5. ลากรานเจียน $L = T - V = \\frac{1}{2} m l^2 \\dot{\\theta}^2 - (-m g l \\cos\\theta) = \\frac{1}{2} m l^2 \\dot{\\theta}^2 + m g l \\cos\\theta$\\n6. สมการออยเลอร์-ลากรางจ์ $\\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{\\theta}}\\right) - \\frac{\\partial L}{\\partial \\theta} = 0$:\\n   $$\\frac{\\partial L}{\\partial \\dot{\\theta}} = m l^2 \\dot{\\theta} \\implies \\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{\\theta}}\\right) = m l^2 \\ddot{\\theta}$$\\n   $$\\frac{\\partial L}{\\partial \\theta} = -m g l \\sin\\theta$$\\n   $$m l^2 \\ddot{\\theta} - (-m g l \\sin\\theta) = 0 \\implies m l^2 \\ddot{\\theta} + m g l \\sin\\theta = 0 \\implies \\ddot{\\theta} + \\frac{g}{l} \\sin\\theta = 0$$",
        simLink: { chapter: "ch03", mode: "oscillation", submode: "pendulum" }
      },

      // CIVIL ENGINEERING: Statics & Trusses
      {
        id: "prob-civ-01",
        track: "civil",
        chapterId: "civil_eng",
        chapterTitle: "วิศวกรรมโยธา: สถิตยศาสตร์วิศวกรรม",
        difficulty: "ท้าทาย (Challenging)",
        title: "การหาแรงในชิ้นส่วนโครงถักสะพานด้วยวิธีรอยต่อ (Method of Joints)",
        question: "โครงถักระนาบ ABC มีหมุดยึดที่ A และลูกกลิ้งที่ C โดยฐาน AC ยาว 4.0 m ในแนวราบ จุดต่อ B สูง 3.0 m กึ่งกลางระหว่าง A และ C มีแรงดึงภายนอกในแนวราบ $P = 40 \\text{ kN}$ ดึงไปทางขวาที่จุด B จงหาแรงปฏิกิริยาแนวดิ่งที่จุด A ($A_y$) และแรงในชิ้นส่วน AB ($F_{AB}$)",
        options: [
          "$A_y = 30 \\text{ kN} \\text{ (ทิศขึ้น)}, \\quad F_{AB} = 36.1 \\text{ kN (Compression)}$",
          "$A_y = 30 \\text{ kN} \\text{ (ทิศลง)}, \\quad F_{AB} = 36.1 \\text{ kN (Tension)}$",
          "$A_y = 20 \\text{ kN} \\text{ (ทิศลง)}, \\quad F_{AB} = 24.0 \\text{ kN (Tension)}$",
          "$A_y = 40 \\text{ kN} \\text{ (ทิศขึ้น)}, \\quad F_{AB} = 50.0 \\text{ kN (Compression)}$"
        ],
        correctIndex: 1,
        explanation: "ขั้นตอนวิธีคิด:\\n1. คำนวณแรงปฏิกิริยาภายนอกทั้งระบบ:\\n   - ตั้งสมดุลโมเมนต์รอบจุด C: $\\sum M_C = 0$\\n   - $-(A_y)(4.0) + (P)(3.0) = 0 \\implies 4.0 A_y = (40)(3.0) = 120 \\implies A_y = -30 \\text{ kN}$ (ทิศทางพุ่งลง)\\n   - สมดุลแนวดิ่ง $\\sum F_y = 0 \\implies A_y + C_y = 0 \\implies C_y = +30 \\text{ kN}$ (ทิศทางพุ่งขึ้น)\\n2. เรขาคณิตของชิ้นส่วน AB: ฐาน $= 2.0 \\text{ m}$, ความสูง $= 3.0 \\text{ m}$ ความยาว $L_{AB} = \\sqrt{2^2 + 3^2} = \\sqrt{13} \\approx 3.606 \\text{ m}$\\n3. มุมเอียง $\\theta_{AB}$ กับแนวราบ: $\\sin\\theta = \\frac{3.0}{3.606} \\approx 0.83205$\\n4. พิจารณาสมดุลแนวดิ่งที่รอยต่อ A: $\\sum F_y = 0$\\n   $$A_y + F_{AB} \\sin\\theta = 0 \\implies -30 + F_{AB}(0.83205) = 0 \\implies F_{AB} = \\frac{30}{0.83205} = 10\\sqrt{13} \\approx +36.06 \\text{ kN}$$\\nเนื่องจากค่าเป็นบวก ชิ้นส่วน AB จึงรับแรงดึง (Tension) ขนาด $36.1 \\text{ kN}$ (และชิ้นส่วน AC รับแรงดึง $20 \\text{ kN}$)",
        simLink: { chapter: "civil_eng", mode: "civil", submode: "truss_analysis" }
      },

      // CIVIL ENGINEERING: Mechanics of Materials
      {
        id: "prob-civ-02",
        track: "civil",
        chapterId: "civil_eng",
        chapterTitle: "วิศวกรรมโยธา: ความแข็งแรงของวัสดุ",
        difficulty: "ท้าทาย (Challenging)",
        title: "การคำนวณความเค้นดัดสูงสุดและขนาดหน้าตัดคาน",
        question: "คานเหล็กช่วงเดี่ยวยาว $L = 6.0 \\text{ m}$ รับน้ำหนักแผ่สม่ำเสมอ $w = 12 \\text{ kN/m}$ ตลอดความยาว หน้าตัดคานเป็นรูปสี่เหลี่ยมผืนผ้ากว้าง $b = 100 \\text{ mm}$ และลึก $h = 300 \\text{ mm}$ จงหาโมเมนต์ดัดสูงสุด ($M_{\\max}$) และความเค้นดัดสูงสุด ($\\sigma_{\\max}$)",
        options: [
          "$M_{\\max} = 72.0 \\text{ kN}\\cdot\\text{m}, \\quad \\sigma_{\\max} = 48.0 \\text{ MPa}$",
          "$M_{\\max} = 54.0 \\text{ kN}\\cdot\\text{m}, \\quad \\sigma_{\\max} = 72.0 \\text{ MPa}$",
          "$M_{\\max} = 54.0 \\text{ kN}\\cdot\\text{m}, \\quad \\sigma_{\\max} = 36.0 \\text{ MPa}$",
          "$M_{\\max} = 36.0 \\text{ kN}\\cdot\\text{m}, \\quad \\sigma_{\\max} = 24.0 \\text{ MPa}$"
        ],
        correctIndex: 2,
        explanation: "ขั้นตอนวิธีคิด:\\n1. คำนวณโมเมนต์ดัดสูงสุดที่กึ่งกลางคานช่วงเดี่ยวรับน้ำหนักแผ่:\\n   $$M_{\\max} = \\frac{w L^2}{8} = \\frac{(12 \\times 10^3)(6.0)^2}{8} = \\frac{(12000)(36)}{8} = 54,000 \\text{ N}\\cdot\\text{m} = 54.0 \\text{ kN}\\cdot\\text{m}$$\\n2. คำนวณมอดุลัสหน้าตัด ($S$):\\n   $$S = \\frac{b h^2}{6} = \\frac{(0.100)(0.300)^2}{6} = \\frac{(0.100)(0.090)}{6} = 1.50 \\times 10^{-3} \\text{ m}^3$$\\n3. คำนวณความเค้นดัดสูงสุดที่ผิวนอกสุดของคาน:\\n   $$\\sigma_{\\max} = \\frac{M_{\\max}}{S} = \\frac{54,000 \\text{ N}\\cdot\\text{m}}{1.50 \\times 10^{-3} \\text{ m}^3} = 36.0 \\times 10^6 \\text{ Pa} = 36.0 \\text{ MPa}$$",
        simLink: { chapter: "civil_eng", mode: "civil", submode: "simply_supported" }
      },

      // ADVANCED MECHANICS: Variable Mass & Deep Space
      {
        id: "prob-adv-02",
        track: "advanced",
        chapterId: "adv_mechanics",
        chapterTitle: "ฟิสิกส์ขั้นสูง: กลศาสตร์ระบบมวลแปรผัน",
        difficulty: "ระดับมหาวิทยาลัย (MIT / Olympiad)",
        title: "สมการจรวดไซออลคอฟสกีและการเผาไหม้ในอวกาศลึก (Tsiolkovsky Rocket Equation)",
        question: "ยานสำรวจอวกาศมวลเริ่มต้นรวม $m_0 = 12,000 \\text{ kg}$ (รวมเชื้อเพลิง) ใช้เครื่องยนต์ไอพ่นเคมีที่มีอัตราเร็วขับไอพ่นสัมพัทธ์ $u_{\\text{ex}} = 3,000 \\text{ m/s}$ ยานจุดระเบิดขับเคลื่อนในอวกาศลึกที่ปราศจากแรงโน้มถ่วงภายนอกและแรงต้านอากาศ จนกระทั่งมวลสุทธิสุดท้ายเหลือเพียงตัวยาน $m_f = 1,200 \\text{ kg}$ จงหาอัตราเร็วสุทธิที่เพิ่มขึ้น ($\\Delta v$) ของยานอวกาศลำนี้",
        options: [
          "$\\Delta v = 3.00 \\text{ km/s}$",
          "$\\Delta v = 6.91 \\text{ km/s}$",
          "$\\Delta v = 9.81 \\text{ km/s}$",
          "$\\Delta v = 13.82 \\text{ km/s}$"
        ],
        correctIndex: 1,
        explanation: "ขั้นตอนวิธีคิด:\\n1. จากกฎการอนุรักษ์โมเมนตัมสำหรับระบบมวลแปรผัน (Variable Mass System):\\n   ที่เวลา $t$: $p(t) = m v$\\n   ที่เวลา $t + dt$: มวลยานเหลือ $m - |dm|$ เคลื่อนที่ด้วยความเร็ว $v + dv$ และไอพ่นมวล $|dm| = -dm$ ถูกพ่นออกไปด้วยความเร็ว $v - u_{\\text{ex}}$ สัมพัทธ์กับผู้สังเกต\\n   $$p(t+dt) = (m + dm)(v + dv) + (-dm)(v - u_{\\text{ex}}) = mv + m\\,dv + u_{\\text{ex}}\\,dm + \\mathcal{O}(dt^2)$$\\n2. เนื่องจากไม่มีแรงภายนอกกระทำ ($\\sum F_{\\text{ext}} = 0$):\\n   $$dp = 0 \\implies m\\,dv = -u_{\\text{ex}}\\,dm \\implies dv = -u_{\\text{ex}} \\frac{dm}{m}$$\\n3. อินทิเกรตจากมวลเริ่มต้น $m_0$ ไปยังมวลสุดท้าย $m_f$:\\n   $$\\Delta v = \\int_{v_0}^{v_f} dv = -u_{\\text{ex}} \\int_{m_0}^{m_f} \\frac{dm}{m} = u_{\\text{ex}} \\ln\\left(\\frac{m_0}{m_f}\\right)$$\\n4. แทนค่าตัวเลขเชิงวิศวกรรมการบินอวกาศ:\\n   - อัตราส่วนมวล (Mass Ratio) $\\frac{m_0}{m_f} = \\frac{12,000}{1,200} = 10$\\n   - $\\ln(10) \\approx 2.302585$\\n   $$\\Delta v = 3,000 \\times \\ln(10) \\approx 3,000 \\times 2.302585 = 6,907.8 \\text{ m/s} \\approx 6.91 \\text{ km/s}$$",
        simLink: { chapter: "ch01", mode: "projectile", submode: "rocket_equation" }
      },

      // ADVANCED MECHANICS: Lagrangian & Symmetry Breaking
      {
        id: "prob-adv-03",
        track: "advanced",
        chapterId: "adv_mechanics",
        chapterTitle: "ฟิสิกส์ขั้นสูง: กลศาสตร์ลากรานจ์และความสมมาตรแตกสลาย",
        difficulty: "ระดับมหาวิทยาลัย (Cambridge Tripos / Pitchfork Bifurcation)",
        title: "ลูกปัดบนห่วงวงกลมหมุนรอบแกนดิ่งและจุดสมดุลเสถียร (Bead on a Rotating Hoop)",
        question: "ห่วงลวดวงกลมรัศมี $R = 0.50 \\text{ m}$ วางตัวในแนวดิ่งและหมุนรอบแกนดิ่งที่ผ่านเส้นผ่านศูนย์กลางด้วยอัตราเร็วเชิงมุมคงที่ $\\Omega = 6.0 \\text{ rad/s}$ ลูกปัดมวล $m$ เคลื่อนที่ได้โดยปราศจากแรงเสียดทานบนห่วง กำหนดให้ $\\theta$ คือมุมที่ลูกปัดกวาดไปจากแนวดิ่งด้านล่างสุด ($0^\\circ \\le \\theta < 90^\\circ$) และความเร่งโน้มถ่วง $g = 9.80 \\text{ m/s}^2$ จงหามุมสมดุลเสถียร $\\theta^*$ ที่ลูกปัดจะอยู่นิ่งสัมพัทธ์กับห่วง",
        options: [
          "$\\theta^* = 0^\\circ \\text{ (คงตัวที่ก้นห่วงตลอดเวลา)}$",
          "$\\theta^* \\approx 57.0^\\circ$",
          "$\\theta^* \\approx 45.0^\\circ$",
          "$\\theta^* \\approx 72.5^\\circ$"
        ],
        correctIndex: 1,
        explanation: "ขั้นตอนวิธีคิด:\\n1. พิจารณาในกรอบอ้างอิงหมุน (Rotating Frame) ที่หมุนด้วยความเร็วเชิงมุม $\\Omega$:\\n   ลูกปัดอยู่ภายใต้แรง 3 แรง ได้แก่ แรงโน้มถ่วง $mg$ (แนวดิ่งลง), แรงหนีศูนย์กลางเทียม $F_{\\text{cf}} = m \\Omega^2 r$ (แนวราบออกนอกแกนหมุน โดย $r = R\\sin\\theta$), และแรงปฏิกิริยาตั้งฉากจากลวด $N$\\n2. ฉายแรงเข้าสู่แนวสัมผัสกับเส้นลวด (Tangential component):\\n   - แรงโน้มถ่วงในแนวสัมผัสพยายามดึงลูกปัดกลับก้นห่วง: $F_{g,\\tau} = -mg\\sin\\theta$\\n   - แรงหนีศูนย์กลางในแนวสัมผัสพยายามดันลูกปัดขึ้น: $F_{\\text{cf},\\tau} = +(m \\Omega^2 R \\sin\\theta)\\cos\\theta$\\n3. เงื่อนไขสมดุลในแนวสัมผัส ($\\sum F_\\tau = 0$):\\n   $$m R \\Omega^2 \\sin\\theta \\cos\\theta - mg \\sin\\theta = 0 \\implies m \\sin\\theta (R \\Omega^2 \\cos\\theta - g) = 0$$\\n   - คำตอบที่ 1: $\\sin\\theta = 0 \\implies \\theta = 0$ (ตำแหน่งก้นห่วง)\\n   - คำตอบที่ 2: $\\cos\\theta^* = \\frac{g}{R\\Omega^2}$\\n4. วิเคราะห์การแตกกิ่ง (Pitchfork Bifurcation) และเสถียรภาพ:\\n   - อัตราเร็วเชิงมุมวิกฤต: $\\Omega_c = \\sqrt{\\frac{g}{R}} = \\sqrt{\\frac{9.80}{0.50}} = \\sqrt{19.6} \\approx 4.427 \\text{ rad/s}$\\n   - เมื่อ $\\Omega = 6.0 \\text{ rad/s} > \\Omega_c$ ตำแหน่ง $\\theta = 0$ จะกลายเป็นจุดสมดุลไม่เสถียร (Unstable Equilibrium) และเกิดสมดุลเสถียรคู่ใหม่ที่:\\n   $$\\cos\\theta^* = \\frac{9.80}{(0.50)(6.0)^2} = \\frac{9.80}{18.0} \\approx 0.5444 \\implies \\theta^* = \\arccos(0.5444) \\approx 57.0^\\circ$$",
        simLink: { chapter: "ch03", mode: "oscillation", submode: "rotating_hoop" }
      },

      // ADVANCED ELECTROMAGNETISM: Dielectric Forces & Virtual Work
      {
        id: "prob-adv-04",
        track: "advanced",
        chapterId: "adv_electromagnetism",
        chapterTitle: "ฟิสิกส์ขั้นสูง: ทฤษฎีสนามแม่เหล็กไฟฟ้าและพลังงาน",
        difficulty: "ระดับมหาวิทยาลัย (Tong / Jackson Electrodynamics)",
        title: "แรงดึงดูดไดอิเล็กทริกและแรงลอยตัวไฟฟ้าสถิต (Kelvin Polarization Force)",
        question: "ตัวเก็บประจุทรงกระบอกร่วมแกน (Coaxial Cylinders) ยาวในแนวดิ่ง รัศมีทรงกระบอกใน $a = 2.0 \\text{ mm}$ รัศมีทรงกระบอกนอก $b = 6.0 \\text{ mm}$ ปลายล่างจุ่มลงในอ่างของเหลวไดอิเล็กทริกที่มีค่าคงที่ไดอิเล็กทริกสัมพัทธ์ $\\kappa = 4.0$ ตัวนำทั้งสองถูกต่อไว้กับแหล่งกำเนิดศักย์ไฟฟ้าคงที่ $V_0 = 3,000 \\text{ V}$ จงหาขนาดของแรงดึงดูดทางไฟฟ้าในแนวดิ่ง ($F_e$) ที่กระทำต่อลำของเหลวไดอิเล็กทริกที่ถูกดึงดูดให้ยกตัวสูงขึ้นมาในช่องว่างระหว่างทรงกระบอก",
        options: [
          "$F_e = 1.25 \\times 10^{-4} \\text{ N}$",
          "$F_e = 3.42 \\times 10^{-4} \\text{ N}$",
          "$F_e = 2.05 \\times 10^{-3} \\text{ N}$",
          "$F_e \\approx 6.84 \\times 10^{-4} \\text{ N}$"
        ],
        correctIndex: 3,
        explanation: "ขั้นตอนวิธีคิด:\\n1. พิจารณาความจุไฟฟ้าต่อหน่วยความยาวของทรงกระบอกร่วมแกน:\\n   - ช่วงที่มีอากาศ/สุญญากาศ: $C'_0 = \\frac{2\\pi\\epsilon_0}{\\ln(b/a)}$\\n   - ช่วงที่มีของเหลวไดอิเล็กทริก: $C'_\\kappa = \\frac{2\\pi\\kappa\\epsilon_0}{\\ln(b/a)}$\\n2. เมื่อของเหลวยกตัวสูงขึ้นเป็นระยะ $h$ ความจุไฟฟ้ารวมของระบบคือ:\\n   $$C(h) = C'_\\kappa h + C'_0 (L - h) = C'_0 L + (C'_\\kappa - C'_0)h = C'_0 L + \\frac{2\\pi\\epsilon_0(\\kappa - 1)}{\\ln(b/a)} h$$\\n3. เนื่องจากระบบต่อกับแหล่งจ่ายศักย์ไฟฟ้าคงที่ $V_0$ (Constant Voltage / Battery connected):\\n   งานจากแบตเตอรี่คือ $dW_{\\text{batt}} = V_0 dq = V_0^2 dC$\\n   พลังงานไฟฟ้าสถิตสะสม $U_e = \\frac{1}{2} C V_0^2 \\implies dU_e = \\frac{1}{2} V_0^2 dC$\\n   จากหลักการงานเสมือน (Principle of Virtual Work):\\n   $$F_e = +\\left(\\frac{\\partial U_e}{\\partial h}\\right)_{V} = +\\frac{1}{2} V_0^2 \\frac{dC}{dh} = \\frac{1}{2} V_0^2 \\frac{2\\pi\\epsilon_0(\\kappa - 1)}{\\ln(b/a)} = \\frac{\\pi\\epsilon_0(\\kappa - 1)V_0^2}{\\ln(b/a)}$$\\n4. แทนค่าตัวเลขเชิงปริมาณทางกายภาพ:\\n   - $\\epsilon_0 \\approx 8.854 \\times 10^{-12} \\text{ F/m}$\\n   - $\\kappa - 1 = 4.0 - 1 = 3.0$\\n   - $\\ln(b/a) = \\ln(6.0/2.0) = \\ln(3) \\approx 1.0986$\\n   - $V_0^2 = (3,000)^2 = 9.0 \\times 10^6 \\text{ V}^2$$\\n   $$F_e = \\frac{\\pi (8.854 \\times 10^{-12})(3.0)(9.0 \\times 10^6)}{1.0986} \\approx \\frac{7.5097 \\times 10^{-4}}{1.0986} \\approx 6.836 \\times 10^{-4} \\text{ N} \\approx 6.84 \\times 10^{-4} \\text{ N}$$",
        simLink: { chapter: "ch06", mode: "em", submode: "dielectric_force" }
      },

      // FUNDAMENTAL / UNIVERSITY THERMODYNAMICS: Otto Cycle
      {
        id: "prob-fund-08",
        track: "fundamental",
        chapterId: "ch05",
        chapterTitle: "บทที่ 5: อุณหพลศาสตร์และทฤษฎีจลน์ของก๊าซ",
        difficulty: "ระดับมหาวิทยาลัย (Moran & Shapiro / Thermodynamics)",
        title: "วัฏจักรเครื่องยนต์ออตโตมาตรฐานอากาศ (Air-Standard Otto Cycle)",
        question: "เครื่องยนต์สันดาปภายใน 4 จังหวะทำงานตามวัฏจักรออตโตมาตรฐานอากาศในอุดมคติ มีอัตราส่วนการอัด (Compression Ratio) $r = \\frac{V_1}{V_2} = 8.50$ สภาวะเริ่มต้นก่อนเริ่มจังหวะอัดคืออากาศที่อุณหภูมิ $T_1 = 300 \\text{ K}$ ($27^\\circ\\text{C}$) กำหนดให้อากาศเป็นก๊าซในอุดมคติที่มีอัตราส่วนความจุความร้อน $\\gamma = 1.40$ จงหาประสิทธิภาพเชิงความร้อนตามทฤษฎี ($\\eta_{\\text{Otto}}$) และอุณหภูมิของอากาศเมื่อสิ้นสุดจังหวะอัดแบบแอเดียแบติก ($T_2$)",
        options: [
          "$\\eta_{\\text{Otto}} \\approx 57.5\\%, \\quad T_2 \\approx 706.1 \\text{ K} \\text{ (433.0}^\\circ\\text{C)}$",
          "$\\eta_{\\text{Otto}} \\approx 45.0\\%, \\quad T_2 \\approx 550.0 \\text{ K} \\text{ (277.0}^\\circ\\text{C)}$",
          "$\\eta_{\\text{Otto}} \\approx 62.8\\%, \\quad T_2 \\approx 850.0 \\text{ K} \\text{ (577.0}^\\circ\\text{C)}$",
          "$\\eta_{\\text{Otto}} \\approx 50.0\\%, \\quad T_2 \\approx 600.0 \\text{ K} \\text{ (327.0}^\\circ\\text{C)}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\\n1. ในวัฏจักรออตโตในอุดมคติ ประกอบด้วย 4 กระบวนการ:\\n   - $1 \\to 2$: การอัดแบบไอเซนโทรปิก (Reversible Adiabatic Compression, $s = \\text{const}$)\\n   - $2 \\to 3$: การรับความร้อนที่ปริมาตรคงที่ (Isochoric Heat Addition, $v = \\text{const}$)\\n   - $3 \\to 4$: การขยายตัวทำงานแบบไอเซนโทรปิก (Isentropic Expansion, $s = \\text{const}$)\\n   - $4 \\to 1$: การคายความร้อนที่ปริมาตรคงที่ (Isochoric Heat Rejection, $v = \\text{const}$)\\n2. คำนวณอุณหภูมิ $T_2$ หลังกระบวนการอัดแอเดียแบติก:\\n   $$T_1 V_1^{\\gamma-1} = T_2 V_2^{\\gamma-1} \\implies T_2 = T_1 \\left(\\frac{V_1}{V_2}\\right)^{\\gamma-1} = T_1 \\cdot r^{\\gamma-1}$$\\n   แทนค่า $r = 8.50$, $\\gamma - 1 = 0.40$:\\n   $$r^{0.40} = (8.50)^{0.40} \\approx 2.35379$$\\n   $$T_2 = 300 \\times 2.35379 \\approx 706.137 \\text{ K} \\approx 706.1 \\text{ K} \\text{ (หรือ } 433.0^\\circ\\text{C)}$$\\n3. คำนวณประสิทธิภาพเชิงความร้อนของวัฏจักรออตโต:\\n   $$\\eta_{\\text{Otto}} = 1 - \\frac{Q_{\\text{out}}}{Q_{\\text{in}}} = 1 - \\frac{m c_v (T_4 - T_1)}{m c_v (T_3 - T_2)} = 1 - \\frac{1}{r^{\\gamma-1}}$$\\n   $$\\eta_{\\text{Otto}} = 1 - \\frac{1}{2.35379} \\approx 1 - 0.42485 = 0.57515 \\approx 57.5\\%$$",
        simLink: { chapter: "ch05", mode: "thermo", submode: "pv_engine", engineType: "otto" }
      },

      // CIVIL & MECHANICAL: Combined Stress & von Mises
      {
        id: "prob-civ-03",
        track: "civil",
        chapterId: "civil_eng",
        chapterTitle: "วิศวกรรมโยธาและเครื่องกล: ทฤษฎีความเสียหายและความแข็งแรง",
        difficulty: "ระดับสอบ กว. วิศวกรรม (Licensure / von Mises)",
        title: "สภาวะความเค้นรวมดัดและบิดร่วมตามเกณฑ์ฟอนมิเซส (Combined Bending and Torsion under von Mises Criterion)",
        question: "เพลาเหล็กกลมตันส่งกำลังมีเส้นผ่านศูนย์กลาง $d = 50 \\text{ mm}$ ต้องรับแรงผสมพร้อมกัน ประกอบด้วยโมเมนต์ดัด $M = 1.20 \\text{ kN}\\cdot\\text{m}$ และโมเมนต์บิด $T = 1.60 \\text{ kN}\\cdot\\text{m}$ จงหาความเค้นดัดสูงสุด ($\\sigma_x$), ความเค้นเฉือนบิดสูงสุด ($\\tau_{xy}$), และความเค้นเทียบเท่าฟอนมิเซส ($\\sigma_v$) ที่ผิวนอกสุดของเพลา",
        options: [
          "$\\sigma_x = 48.9 \\text{ MPa}, \\quad \\tau_{xy} = 32.6 \\text{ MPa}, \\quad \\sigma_v = 74.7 \\text{ MPa}$",
          "$\\sigma_x = 97.8 \\text{ MPa}, \\quad \\tau_{xy} = 65.2 \\text{ MPa}, \\quad \\sigma_v \\approx 149.4 \\text{ MPa}$",
          "$\\sigma_x = 120.0 \\text{ MPa}, \\quad \\tau_{xy} = 80.0 \\text{ MPa}, \\quad \\sigma_v = 183.3 \\text{ MPa}$",
          "$\\sigma_x = 97.8 \\text{ MPa}, \\quad \\tau_{xy} = 65.2 \\text{ MPa}, \\quad \\sigma_v = 117.5 \\text{ MPa}$"
        ],
        correctIndex: 1,
        explanation: "ขั้นตอนวิธีคิด:\\n1. สมบัติทางเรขาคณิตของหน้าตัดเพลากลมตัน ($d = 0.050 \\text{ m}$, รัศมี $c = 0.025 \\text{ m}$):\\n   - โมเมนต์ความเฉื่อยของพื้นที่: $I = \\frac{\\pi d^4}{64} = \\frac{\\pi (0.050)^4}{64} \\approx 3.06796 \\times 10^{-7} \\text{ m}^4$\\n   - มอดุลัสหน้าตัดดัด: $S = \\frac{I}{c} = \\frac{\\pi d^3}{32} \\approx 1.22718 \\times 10^{-5} \\text{ m}^3$\\n   - โมเมนต์ความเฉื่อยเชิงขั้ว: $J = 2I = \\frac{\\pi d^4}{32} \\approx 6.13592 \\times 10^{-7} \\text{ m}^4$\\n2. คำนวณความเค้นดัดสูงสุดที่ผิวนอกสุด:\\n   $$\\sigma_x = \\frac{M}{S} = \\frac{1,200 \\text{ N}\\cdot\\text{m}}{1.22718 \\times 10^{-5} \\text{ m}^3} \\approx 97.785 \\times 10^6 \\text{ Pa} \\approx 97.8 \\text{ MPa}$$\\n3. คำนวณความเค้นเฉือนบิดสูงสุดที่ผิวนอกสุด:\\n   $$\\tau_{xy} = \\frac{T c}{J} = \\frac{1,600 \\times 0.025}{6.13592 \\times 10^{-7}} \\approx 65.19 \\times 10^6 \\text{ Pa} \\approx 65.2 \\text{ MPa}$$\\n4. คำนวณความเค้นเทียบเท่าฟอนมิเซส (von Mises Equivalent Stress) ในสภาวะระนาบความเค้น ($\\sigma_y = 0$):\\n   $$\\sigma_v = \\sqrt{\\sigma_x^2 - \\sigma_x \\sigma_y + \\sigma_y^2 + 3\\tau_{xy}^2} = \\sqrt{\\sigma_x^2 + 3\\tau_{xy}^2}$$\\n   $$\\sigma_v = \\sqrt{(97.785)^2 + 3(65.19)^2} = \\sqrt{9561.9 + 3(4249.7)} = \\sqrt{9561.9 + 12749.1} = \\sqrt{22311} \\approx 149.37 \\text{ MPa} \\approx 149.4 \\text{ MPa}$$",
        simLink: { chapter: "civil_eng", mode: "civil", submode: "mohr_circle" }
      },

      // FUNDAMENTAL / MODERN PHYSICS: Compton Scattering
      {
        id: "prob-fund-09",
        track: "fundamental",
        chapterId: "ch07",
        chapterTitle: "บทที่ 7: ฟิสิกส์นิวเคลียร์และควอนตัมเบื้องต้น",
        difficulty: "ระดับมหาวิทยาลัย (IPhO / Modern Physics)",
        title: "การกระเจิงคอมป์ตันของโฟตอนรังสีเอกซ์พลังงานสูง (Compton Scattering)",
        question: "โฟตอนของรังสีเอกซ์ที่มีพลังงานตกกระทบ $E_0 = 100.0 \\text{ keV}$ ชนกับอิเล็กตรอนอิสระที่อยู่นิ่ง เกิดการกระเจิงคอมป์ตันโดยโฟตอนกระเจิงทำมุม $\\theta = 90.0^\\circ$ เทียบกับแนวตกกระทบเดิม กำหนดให้พลังงานนิ่งของอิเล็กตรอน $m_e c^2 \\approx 511.0 \\text{ keV}$ จงหาพลังงานของโฟตอนหลังการกระเจิง ($E'$) และพลังงานจลน์ที่ถ่ายทอดให้อิเล็กตรอนตัวสะท้อนกลับ ($K_e$)",
        options: [
          "$E' = 100.0 \\text{ keV}, \\quad K_e = 0.0 \\text{ keV}$",
          "$E' = 50.0 \\text{ keV}, \\quad K_e = 50.0 \\text{ keV}$",
          "$E' \\approx 83.6 \\text{ keV}, \\quad K_e \\approx 16.4 \\text{ keV}$",
          "$E' \\approx 91.2 \\text{ keV}, \\quad K_e \\approx 8.8 \\text{ keV}$"
        ],
        correctIndex: 2,
        explanation: "ขั้นตอนวิธีคิด:\\n1. จากสูตรการเลื่อนความยาวคลื่นคอมป์ตัน (Compton Shift Formula):\\n   $$\\lambda' - \\lambda_0 = \\frac{h}{m_e c}(1 - \\cos\\theta) = \\lambda_C (1 - \\cos\\theta)$$\\n   โดยที่ $\\lambda_C = \\frac{h}{m_e c} \\approx 2.426 \\times 10^{-12} \\text{ m}$ คือความยาวคลื่นคอมป์ตัน\\n2. เขียนความสัมพันธ์ในรูปพลังงานโฟตอน ($E = \\frac{hc}{\\lambda} \\implies \\lambda = \\frac{hc}{E}$):\\n   $$\\frac{hc}{E'} - \\frac{hc}{E_0} = \\frac{h}{m_e c}(1 - \\cos\\theta) \\implies \\frac{1}{E'} - \\frac{1}{E_0} = \\frac{1 - \\cos\\theta}{m_e c^2}$$\\n   $$\\frac{1}{E'} = \\frac{1}{E_0} + \\frac{1 - \\cos\\theta}{m_e c^2} = \\frac{m_e c^2 + E_0(1 - \\cos\\theta)}{E_0 \\cdot m_e c^2}$$\\n   $$E' = \\frac{E_0}{1 + \\frac{E_0}{m_e c^2}(1 - \\cos\\theta)}$$\\n3. แทนค่าที่มุม $\\theta = 90.0^\\circ$ ($\\cos 90^\\circ = 0$):\\n   $$E' = \\frac{100.0 \\text{ keV}}{1 + \\frac{100.0}{511.0}(1 - 0)} = \\frac{100.0}{1 + 0.19569} = \\frac{100.0}{1.19569} \\approx 83.634 \\text{ keV} \\approx 83.6 \\text{ keV}$$\\n4. จากกฎอนุรักษ์พลังงานเชิงสัมพัทธภาพ พลังงานจลน์ของอิเล็กตรอนที่สะท้อนกลับ ($K_e$) คือ:\\n   $$K_e = E_0 - E' = 100.0 - 83.634 \\approx 16.37 \\text{ keV} \\approx 16.4 \\text{ keV}$$",
        simLink: { chapter: "ch07", mode: "nuclear", submode: "compton_scattering" }
      },

      // ADVANCED OLYMPIAD: Velocity Hodograph Alternative Method
      {
        id: "prob-alt-031",
        track: "advanced",
        chapterId: "ch01",
        chapterTitle: "ฟิสิกส์ขั้นสูง & สอวน.: จลนศาสตร์ปริภูมิความเร็ว (Velocity Hodograph)",
        difficulty: "โอลิมปิกวิชาการ (IPhO / POSN Camp 2)",
        title: "การยิงโปรเจกไทล์บนพื้นเอียงด้วยวิธีเรขาคณิตฮอดอกราฟ (Velocity Hodograph)",
        question: "ยิงโปรเจกไทล์จากโคนเนินเอียงที่ทำมุม $\\alpha = 30.0^\\circ$ กับแนวราบ ด้วยอัตราเร็วต้น $u = 20.0 \\text{ m/s}$ ในสนามโน้มถ่วงสม่ำเสมอ $g = 9.80 \\text{ m/s}^2$ โดยไม่คิดแรงต้านอากาศ จงหามุมยิงเหมาะสมที่สุด ($\\theta_{\\text{opt}}$ วัดเทียบแนวราบ) ที่ทำให้ระยะตกไกลบนแนวลาดเอียงสูงสุด ($R_{\\max}$) และหาค่า $R_{\\max}$ นั้น",
        options: [
          "$\\theta_{\\text{opt}} = 45.0^\\circ, \\quad R_{\\max} = 40.82 \\text{ m}$",
          "$\\theta_{\\text{opt}} = 60.0^\\circ, \\quad R_{\\max} \\approx 27.21 \\text{ m}$",
          "$\\theta_{\\text{opt}} = 55.0^\\circ, \\quad R_{\\max} \\approx 24.50 \\text{ m}$",
          "$\\theta_{\\text{opt}} = 75.0^\\circ, \\quad R_{\\max} \\approx 18.15 \\text{ m}$"
        ],
        correctIndex: 1,
        explanation: "ขั้นตอนวิธีคิดแบบมาตรฐาน (Method 1: Standard Cartesian on Incline):\n1. ตั้งสมการพิกัดตามแนวราบและแนวดิ่ง:\n   $$x(t) = (u \\cos\\theta) t, \\quad y(t) = (u \\sin\\theta) t - \\frac{1}{2}gt^2$$\n2. สมการเส้นตรงของเนินเอียงคือ $y = x\\tan\\alpha$\n3. จุดตัดที่ตกกระทบเนิน ($t = T$):\n   $$(u \\sin\\theta) T - \\frac{1}{2}g T^2 = (u \\cos\\theta T) \\tan\\alpha \\implies T = \\frac{2u \\sin(\\theta - \\alpha)}{g \\cos\\alpha}$$\n4. ระยะตกบนเนิน $R = x / \\cos\\alpha = \\frac{u^2 [ \\sin(2\\theta - \\alpha) - \\sin\\alpha ]}{g \\cos^2\\alpha}$\n5. ค่า $R$ สูงสุดเมื่อ $\\sin(2\\theta - \\alpha) = 1 \\implies 2\\theta - 30^\\circ = 90^\\circ \\implies \\theta_{\\text{opt}} = 60.0^\\circ$\n   $$R_{\\max} = \\frac{u^2 (1 - \\sin 30^\\circ)}{g \\cos^2 30^\\circ} = \\frac{2 u^2}{3 g} = \\frac{2(20.0)^2}{3(9.80)} = \\frac{800}{29.4} \\approx 27.21 \\text{ m}$$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Method 2: Velocity Space Hodograph Geometry):\n1. ในปริภูมิความเร็ว (Velocity Space): เนื่องจาก $\\frac{d\\vec{v}}{dt} = \\vec{g} = \\text{คงที่}$ เส้นทางของเวกเตอร์ความเร็ว $\\vec{v}(t) = \\vec{u} + \\vec{g}t$ จึงเป็น 'เส้นตรงดิ่ง' ที่ลากลงมาจากจุดยอด $\\vec{u}$\n2. เวกเตอร์ความเร็วเฉลี่ย $\\vec{v}_{\\text{avg}} = \\frac{\\vec{u} + \\vec{v}_f}{2}$ ต้องชี้ไปในทิศทางการกระจัด ซึ่งขนานกับแนวเนินเอียงทำมุม $\\alpha = 30.0^\\circ$ เหนือแนวราบ\n3. การหาค่าสูงสุดทางเรขาคณิต (Geometric Optimization):\n   เพื่อให้เวกเตอร์ $\\vec{v}_{\\text{avg}}$ ยาวที่สุดสำหรับอัตราเร็ว $u = |\\vec{u}|$ ที่คงที่ เวกเตอร์ $\\vec{u}$ จะต้องเป็น 'เส้นแบ่งครึ่งมุม' (Angle Bisector) ระหว่างแนวดิ่ง $+\\hat{y}$ (มุม $90^\\circ$) และแนวเส้นตั้งฉากกับเนินเอียง (มุม $30^\\circ$):\n   $$\\theta_{\\text{opt}} = \\frac{90^\\circ + 30^\\circ}{2} = 60.0^\\circ$$\n4. คำนวณความเร็วและเวลาลอยตัวโดยไม่ต้องกระจายตรีโกณมิติ:\n   ที่ $\\theta = 60.0^\\circ$: $u_x = 20\\cos 60^\\circ = 10.0\\text{ m/s}, u_y = 20\\sin 60^\\circ = 10\\sqrt{3}\\text{ m/s}$\n   ความเร็วเฉลี่ยในแนวดิ่ง $v_{\\text{avg},y} = u_x \\tan 30^\\circ = 10 / \\sqrt{3}\\text{ m/s}$\n   ดังนั้น $v_{fy} = 2v_{\\text{avg},y} - u_y = \\frac{20}{\\sqrt{3}} - 10\\sqrt{3} = -\\frac{10}{\\sqrt{3}}\\text{ m/s}$\n   เวลาลอยตัว $T = \\frac{u_y - v_{fy}}{g} = \\frac{10\\sqrt{3} - (-10/\\sqrt{3})}{9.80} = \\frac{40/\\sqrt{3}}{9.80} \\approx 2.357\\text{ s}$\n   ระยะตกบนเนิน: $R = \\frac{u_x T}{\\cos 30^\\circ} = \\frac{10.0 \\times 2.3565}{\\sqrt{3}/2} \\approx 27.21\\text{ m}$\n(ได้ผลลัพธ์ $\\theta_{\\text{opt}} = 60.0^\\circ$ และ $R_{\\max} = 27.21\\text{ m}$ ตรงกันโดยสมบูรณ์)",
        simLink: { chapter: "ch01", mode: "projectile" }
      },

      // ADVANCED OLYMPIAD: Lagrangian & Effective Potential (Bertrand's Theorem)
      {
        id: "prob-alt-032",
        track: "advanced",
        chapterId: "ch02",
        chapterTitle: "ฟิสิกส์ขั้นสูง: กลศาสตร์วิเคราะห์ & ศักย์ยังผล (Lagrangian & Effective Potential)",
        difficulty: "ระดับมหาวิทยาลัย (Advanced Analytical / MIT 8.223)",
        title: "วงโคจรกลมและความถี่การแกว่งในแนวรัศมีด้วยศักย์ยังผล (Bertrand's Theorem via Effective Potential)",
        question: "อนุภาคมวล $m$ โคจรภายใต้แรงดึงดูดสู่ศูนย์กลางแบบนิวโตเนียน $V(r) = -\\frac{k}{r}$ (โดยที่ $k = GMm$) ด้วยโมเมนตัมเชิงมุม $L$ คงตัว จงหารัศมีวงโคจรกลมสมดุล ($r_0$) และอัตราส่วนระหว่างความถี่เชิงมุมของการแกว่งในแนวรัศมีเมื่อถูกรบกวนเล็กน้อย ($\\omega_r$) ต่อความถี่เชิงมุมของวงโคจร ($\\omega_\\theta$) เพื่อพิสูจน์ทฤษฎีบทของเบอร์ทรานด์ (Bertrand's Theorem)",
        options: [
          "$r_0 = \\frac{L^2}{mk}, \\quad \\frac{\\omega_r}{\\omega_\\theta} = 1.0$ (วงโคจรปิดสมบูรณ์ ไม่มี Precession)",
          "$r_0 = \\frac{2L^2}{mk}, \\quad \\frac{\\omega_r}{\\omega_\\theta} = \\sqrt{2}$",
          "$r_0 = \\frac{L^2}{2mk}, \\quad \\frac{\\omega_r}{\\omega_\\theta} = 2.0$",
          "$r_0 = \\frac{L}{mk}, \\quad \\frac{\\omega_r}{\\omega_\\theta} = 0.5$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิดแบบมาตรฐาน (Method 1: Standard Newtonian F = ma):\n1. ตั้งสมการแรงสู่ศูนย์กลางในระนาบขั้ว:\n   $$a_r = \\ddot{r} - r\\dot{\\theta}^2 = -\\frac{k}{mr^2}$$\n2. สำหรับวงโคจรกลม รัศมีคงที่ ($r = r_0, \\ddot{r} = 0$):\n   $$m r_0 \\dot{\\theta}^2 = \\frac{k}{r_0^2}$$\n3. อนุรักษ์โมเมนตัมเชิงมุม $L = m r_0^2 \\dot{\\theta} \\implies \\dot{\\theta} = \\frac{L}{m r_0^2}$:\n   $$m r_0 \\left(\\frac{L}{m r_0^2}\\right)^2 = \\frac{k}{r_0^2} \\implies \\frac{L^2}{m r_0^3} = \\frac{k}{r_0^2} \\implies r_0 = \\frac{L^2}{mk}$$\n4. ความถี่เชิงมุมของวงโคจร: $\\omega_\\theta = \\dot{\\theta}_0 = \\frac{L}{m r_0^2} = \\frac{mk^2}{L^3}$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Method 2: 1D Effective Potential & Analytical Mechanics):\n1. พลังงานยังผลมิติเดียว (Effective Potential $V_{\\text{eff}}(r)$):\n   จากลากรานเจียน $\\mathcal{L} = \\frac{1}{2}m(\\dot{r}^2 + r^2\\dot{\\theta}^2) + \\frac{k}{r}$ โมเมนตัมสังยุค $p_\\theta = L = \\text{คงที่}$\n   พลังงานรวม $E = \\frac{1}{2}m\\dot{r}^2 + V_{\\text{eff}}(r)$ โดยที่:\n   $$V_{\\text{eff}}(r) = \\frac{L^2}{2mr^2} - \\frac{k}{r}$$\n2. จุดสมดุลของรัศมีวงโคจรกลม ($r_0$):\n   $$\\left.\\frac{dV_{\\text{eff}}}{dr}\\right|_{r_0} = -\\frac{L^2}{m r_0^3} + \\frac{k}{r_0^2} = 0 \\implies r_0 = \\frac{L^2}{mk}$$\n3. ความถี่การแกว่งในแนวรัศมีเมื่อถูกรบกวนเล็กน้อย ($r(t) = r_0 + \\eta(t)$):\n   $$\\frac{d^2 V_{\\text{eff}}}{dr^2} = \\frac{3L^2}{m r^4} - \\frac{2k}{r^3}$$\n   แทนค่า $r_0 = \\frac{L^2}{mk} \\implies \\left.\\frac{d^2 V_{\\text{eff}}}{dr^2}\\right|_{r_0} = \\frac{3L^2}{m r_0^4} - \\frac{2L^2}{m r_0^4} = \\frac{L^2}{m r_0^4} > 0$$\n   ความถี่เชิงมุมของการแกว่ง:\n   $$\\omega_r = \\sqrt{\\frac{V_{\\text{eff}}''(r_0)}{m}} = \\sqrt{\\frac{L^2 / (m r_0^4)}{m}} = \\frac{L}{m r_0^2}$$\n4. เปรียบเทียบกับความถี่การโคจร:\n   $$\\frac{\\omega_r}{\\omega_\\theta} = \\frac{L / (m r_0^2)}{L / (m r_0^2)} = 1.0$$\n(พิสูจน์ทฤษฎีบทของเบอร์ทรานด์: คาบการแกว่งในแนวรัศมีเท่ากับคาบการโคจรพอดี วงโคจรจึงปิดตัวเองเป็นวงรีสมบูรณ์โดยไม่มีการส่าย)",
        simLink: { chapter: "ch02", mode: "circular" }
      },

      // ADVANCED OLYMPIAD: Thomson's Principle of Minimum Dissipation
      {
        id: "prob-alt-033",
        track: "advanced",
        chapterId: "ch04",
        chapterTitle: "ฟิสิกส์ขั้นสูง: หลักการกระจายกำลังไฟฟ้าต่ำสุด (Thomson's Minimum Dissipation Principle)",
        difficulty: "ระดับมหาวิทยาลัย (MIT 6.002 / Energy Variational)",
        title: "การแก้โครงข่ายบริดจ์ไม่สมดุลด้วยหลักการสูญเสียกำลังไฟฟ้าต่ำสุด (Thomson Minimum Dissipation)",
        question: "โครงข่ายสะพานวีตสโตนไม่สมดุลต่อระหว่างขั้ว A และ B โดยมีกระแสรวม $I_0 = 3.00\\text{ A}$ ไหลเข้า:\n- กิ่งซ้ายบน $R_1 = 2.0\\,\\Omega$, กิ่งขวาบน $R_2 = 4.0\\,\\Omega$\n- กิ่งซ้ายล่าง $R_3 = 4.0\\,\\Omega$, กิ่งขวาล่าง $R_4 = 2.0\\,\\Omega$\n- สะพานกลาง $R_5 = 1.0\\,\\Omega$ ต่อระหว่างจุดเชื่อมบน (C) กับจุดเชื่อมล่าง (D)\nจงหากระแสในกิ่งสะพานกลาง ($I_5$), ความต่างศักย์รวม ($V_{AB}$), และความต้านทานสมมูลรวม ($R_{AB}$)",
        options: [
          "$I_5 = 0.750 \\text{ A (ไหลลง)}, \\quad V_{AB} = 8.25 \\text{ V}, \\quad R_{AB} = 2.75 \\,\\Omega$",
          "$I_5 = 0.500 \\text{ A (ไหลลง)}, \\quad V_{AB} = 9.00 \\text{ V}, \\quad R_{AB} = 3.00 \\,\\Omega$",
          "$I_5 = 0.000 \\text{ A (บริดจ์สมดุล)}, \\quad V_{AB} = 8.00 \\text{ V}, \\quad R_{AB} = 2.67 \\,\\Omega$",
          "$I_5 = 1.250 \\text{ A (ไหลลง)}, \\quad V_{AB} = 7.50 \\text{ V}, \\quad R_{AB} = 2.50 \\,\\Omega$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิดแบบมาตรฐาน (Method 1: Standard Mesh Equations):\n1. กำหนดกระแสลูปหรือกระแสกิ่งตาม KCL:\n   ให้ $I_1$ ไหลผ่าน $R_1$, ดังนั้นกิ่งล่างซ้าย $I_3 = 3.0 - I_1$\n   กระแสผ่านบริดจ์ $I_5$ ไหลจาก C ลง D, ดังนั้น $I_2 = I_1 - I_5$ และ $I_4 = (3.0 - I_1) + I_5$\n2. ตั้งสมการกฎของเคอร์ชฮอฟฟ์แรงดัน (KVL) รอบลูป A-C-D-A:\n   $$I_1 R_1 + I_5 R_5 - I_3 R_3 = 0 \\implies 2 I_1 + 1 I_5 - 4(3.0 - I_1) = 0 \\implies 6 I_1 + I_5 = 12.0$$\n3. ตั้งสมการ KVL รอบลูป C-B-D-C:\n   $$I_2 R_2 - I_4 R_4 - I_5 R_5 = 0 \\implies 4(I_1 - I_5) - 2(3.0 - I_1 + I_5) - 1 I_5 = 0 \\implies 6 I_1 - 7 I_5 = 6.0$$\n4. นำสมการลบกัน:\n   $$(6 I_1 + I_5) - (6 I_1 - 7 I_5) = 12.0 - 6.0 \\implies 8 I_5 = 6.0 \\implies I_5 = 0.750 \\text{ A}$$\n   $$I_1 = \\frac{12.0 - 0.75}{6} = 1.875 \\text{ A}$$\n5. ความต่างศักย์รวม $V_{AB} = I_1 R_1 + I_2 R_2 = (1.875)(2.0) + (1.875 - 0.75)(4.0) = 3.75 + 4.50 = 8.25 \\text{ V}$\n6. ความต้านทานสมมูล $R_{AB} = \\frac{V_{AB}}{I_0} = \\frac{8.25}{3.00} = 2.75 \\,\\Omega$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Method 2: Thomson's Principle of Minimum Power Dissipation):\n1. ทฤษฎีของทอมสัน (Thomson's Principle): กระแสในวงจรเชิงเส้นจะกระจายตัวเพื่อทำให้ 'กำลังไฟฟ้ารวมที่สูญเสียเป็นความร้อน' (Total Power Dissipation $P = \\sum I_k^2 R_k$) มีค่าน้อยที่สุดเสมอ!\n2. เขียนฟังก์ชันกำลังไฟฟ้ารวมในรูปตัวแปรอิสระเพียงสองตัว $(I_1, I_5)$:\n   $$P(I_1, I_5) = 2.0 I_1^2 + 4.0(I_1 - I_5)^2 + 4.0(3 - I_1)^2 + 2.0(3 - I_1 + I_5)^2 + 1.0 I_5^2$$\n3. หาจุดต่ำสุดสัมบูรณ์โดยเทียบอนุพันธ์ย่อยเป็นศูนย์:\n   $$\\frac{\\partial P}{\\partial I_1} = 24 I_1 - 12 I_5 - 36 = 0 \\implies 2 I_1 - I_5 = 3.0$$\n   $$\\frac{\\partial P}{\\partial I_5} = -12 I_1 + 14 I_5 + 12 = 0 \\implies -6 I_1 + 7 I_5 = -6.0$$\n4. แก้ระบบสมการอย่างง่าย:\n   แทน $I_5 = 2I_1 - 3.0$ ลงในสมการที่สอง: $-6I_1 + 7(2I_1 - 3.0) = -6.0 \\implies 8 I_1 = 15.0 \\implies I_1 = 1.875\\text{ A}$\n   $$I_5 = 2(1.875) - 3.0 = 0.750\\text{ A}$$\n   กำลังสูญเสียต่ำสุด: $P_{\\min} = I_0^2 R_{AB} = 24.75\\text{ W} \\implies R_{AB} = \\frac{24.75}{3^2} = 2.75\\,\\Omega$\n(ยืนยันความงามของหลักการแปรผันทางฟิสิกส์ ที่ให้ผลลัพธ์ตรงกับกฎของเคอร์ชฮอฟฟ์ทุกประการ)",
        simLink: { chapter: "ch04", mode: "circuits" }
      },

      // ADVANCED OLYMPIAD: Guiding Center Drift Theory
      {
        id: "prob-alt-034",
        track: "advanced",
        chapterId: "ch04",
        chapterTitle: "ฟิสิกส์ขั้นสูง: ทฤษฎีจุดชี้นำและอนุภาคในสนามตัดข้าม (Guiding Center Drift Theory)",
        difficulty: "ระดับมหาวิทยาลัย (Plasma Physics / IPhO)",
        title: "การเคลื่อนที่ของอนุภาคประจุในสนามไฟฟ้าและแม่เหล็กตั้งฉาก (E x B Drift & Cycloid)",
        question: "โปรตอน ($q = 1.60 \\times 10^{-19}\\text{ C}, m = 1.67 \\times 10^{-27}\\text{ kg}$) ถูกปล่อยจากจุดหยุดนิ่งในสนามตั้งฉาก $\\vec{E} = E_0\\hat{y}$ ($E_0 = 1.00 \\times 10^4\\text{ V/m}$) และ $\\vec{B} = B_0\\hat{z}$ ($B_0 = 0.500\\text{ T}$) จงหาความเร็วลอยเลื่อนเฉลี่ย ($v_D$) และความสูงสูงสุดในแนวดิ่ง ($y_{\\max}$) ที่โปรตอนขึ้นไปถึง",
        options: [
          "$v_D = 2.00 \\times 10^4 \\text{ m/s}, \\quad y_{\\max} \\approx 0.835 \\text{ mm}$",
          "$v_D = 5.00 \\times 10^3 \\text{ m/s}, \\quad y_{\\max} \\approx 1.670 \\text{ mm}$",
          "$v_D = 2.00 \\times 10^4 \\text{ m/s}, \\quad y_{\\max} \\approx 0.418 \\text{ mm}$",
          "$v_D = 4.00 \\times 10^4 \\text{ m/s}, \\quad y_{\\max} \\approx 0.835 \\text{ mm}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิดแบบมาตรฐาน (Method 1: Standard Coupled Differential Equations):\n1. สมการการเคลื่อนที่จากแรงลอเรนตซ์:\n   $$m \\ddot{x} = q B_0 \\dot{y}, \\quad m \\ddot{y} = q E_0 - q B_0 \\dot{x}$$\n2. อินทิเกรตสมการแรกโดยเงื่อนไขต้น $\\dot{x}(0) = 0, y(0) = 0$:\n   $$\\dot{x}(t) = \\omega_c y(t) \\quad \\text{เมื่อ } \\omega_c = \\frac{q B_0}{m}$$\n3. แทนในสมการที่สองได้สมการการสั่นฮาร์มอนิกอย่างง่าย:\n   $$\\ddot{y} + \\omega_c^2 y = \\frac{q E_0}{m}$$\n   ผลเฉลยคือ $y(t) = \\frac{q E_0}{m \\omega_c^2}(1 - \\cos(\\omega_c t)) = \\frac{E_0}{\\omega_c B_0}(1 - \\cos(\\omega_c t))$\n4. ค่าสูงสุดเกิดขึ้นเมื่อ $\\cos(\\omega_c t) = -1$:\n   $$y_{\\max} = \\frac{2 E_0}{\\omega_c B_0} = \\frac{2 m E_0}{q B_0^2} = \\frac{2(1.67 \\times 10^{-27})(1.00 \\times 10^4)}{(1.60 \\times 10^{-19})(0.500)^2} \\approx 8.35 \\times 10^{-4}\\text{ m} = 0.835\\text{ mm}$$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Method 2: Guiding Center Frame Transformation):\n1. แปลงกรอบอ้างอิงไปยังกรอบที่เคลื่อนที่ด้วยความเร็วลอยเลื่อน (Drift Velocity $\\vec{v}_D$):\n   $$\\vec{v}_D = \\frac{\\vec{E} \\times \\vec{B}}{B_0^2} = \\frac{(E_0\\hat{y}) \\times (B_0\\hat{z})}{B_0^2} = \\frac{E_0}{B_0}\\hat{x} = \\frac{1.00 \\times 10^4}{0.500}\\hat{x} = 2.00 \\times 10^4\\hat{x}\\text{ m/s}$$\n2. ในกรอบอ้างอิงที่วิ่งตามด้วยความเร็ว $\\vec{v}_D$ สนามไฟฟ้าสุทธิจะกลายเป็นศูนย์ ($\\vec{E}' = \\vec{E} + \\vec{v}_D \\times \\vec{B} = 0$)!\n   ดังนั้นในกรอบนี้ อนุภาคจะเคลื่อนที่เป็น 'วงกลมไซโคลตรอนล้วน' ด้วยความเร็วสัมพัทธ์ต้น:\n   $$v'_{\\text{gyr}} = |\\vec{v}(0) - \\vec{v}_D| = v_D = 2.00 \\times 10^4\\text{ m/s}$$\n3. รัศมีไจเรชัน (Larmor Radius):\n   $$r_L = \\frac{v_D}{\\omega_c} = \\frac{2.00 \\times 10^4}{4.7904 \\times 10^7} \\approx 4.175 \\times 10^{-4}\\text{ m} = 0.4175\\text{ mm}$$\n4. การเคลื่อนที่จริงในห้องปฏิบัติการคือ 'จุดศูนย์กลางไจเรชันเคลื่อนที่ไปข้างหน้า พร้อมกับอนุภาคหมุนรอบจุดนั้น':\n   ความสูงสูงสุดคือจุดสูงสุดของวงกลมหมุนวน:\n   $$y_{\\max} = 2 r_L = 2(0.4175\\text{ mm}) = 0.835\\text{ mm}$$\n(แก้ได้ใน 3 บรรทัดโดยไม่ต้องแก้สมการอนุพันธ์อันดับสอง)",
        simLink: { chapter: "ch04", mode: "circuits" }
      },

      // CIVIL & THERMAL: Thermal-Electrical Analogy (MIT 4.42J)
      {
        id: "prob-alt-035",
        track: "civil",
        chapterId: "civil_eng",
        chapterTitle: "วิศวกรรมอาคารและการถ่ายเทความร้อน (Building Physics & MIT 4.42J)",
        difficulty: "ระดับวิศวกรรมศาสตร์ (MIT 4.42J / Licensure)",
        title: "การวิเคราะห์โครงข่ายความต้านทานความร้อนของผนังอาคารประหยัดพลังงาน (Thermal-Electrical Analogy)",
        question: "ผนังอาคารพื้นที่ $A = 20.0\\text{ m}^2$ ประกอบด้วยยิปซัม ($d_1 = 12\\text{ mm}, k_1 = 0.16\\text{ W/m}\\cdot\\text{K}$), ฉนวนใยแก้ว ($d_2 = 100\\text{ mm}, k_2 = 0.04\\text{ W/m}\\cdot\\text{K}$), และอิฐภายนอก ($d_3 = 100\\text{ mm}, k_3 = 0.80\\text{ W/m}\\cdot\\text{K}$) มี $h_{\\text{in}} = 8.0\\text{ W/m}^2\\cdot\\text{K}, h_{\\text{out}} = 25.0\\text{ W/m}^2\\cdot\\text{K}$ อุณหภูมิภายใน $T_{\\text{in}} = 22.0^\\circ\\text{C}$ และภายนอก $T_{\\text{out}} = -8.0^\\circ\\text{C}$ จงหาความต้านทานความร้อนรวม ($R_{\\text{th,total}}$) และอัตราสูญเสียความร้อนคงตัวรวม ($q$)",
        options: [
          "$R_{\\text{th,total}} \\approx 0.143 \\text{ K/W}, \\quad q \\approx 209.4 \\text{ W}$",
          "$R_{\\text{th,total}} \\approx 0.286 \\text{ K/W}, \\quad q \\approx 104.7 \\text{ W}$",
          "$R_{\\text{th,total}} \\approx 0.072 \\text{ K/W}, \\quad q \\approx 418.8 \\text{ W}$",
          "$R_{\\text{th,total}} \\approx 0.500 \\text{ K/W}, \\quad q \\approx 60.0 \\text{ W}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิดแบบมาตรฐาน (Method 1: Classical 1D Conduction & Convection):\n1. คำนวณความต้านทานความร้อนต่อหน่วยพื้นที่แต่ละชั้น ($R'' = d/k$ หรือ $1/h$):\n   - พาความร้อนผิวใน: $R''_{\\text{in}} = 1/8.0 = 0.125\\text{ m}^2\\text{K/W}$\n   - ยิปซัม: $R''_{1} = 0.012/0.16 = 0.075\\text{ m}^2\\text{K/W}$\n   - ฉนวนใยแก้ว: $R''_{2} = 0.100/0.04 = 2.500\\text{ m}^2\\text{K/W}$\n   - อิฐภายนอก: $R''_{3} = 0.100/0.80 = 0.125\\text{ m}^2\\text{K/W}$\n   - พาความร้อนผิวนอก: $R''_{\\text{out}} = 1/25.0 = 0.040\\text{ m}^2\\text{K/W}$\n2. รวมความต้านทานต่อหนึ่งหน่วยพื้นที่:\n   $$R''_{\\text{total}} = 0.125 + 0.075 + 2.500 + 0.125 + 0.040 = 2.865\\text{ m}^2\\text{K/W}$$\n3. ความต้านทานความร้อนรวมทั้งผนัง ($A = 20.0\\text{ m}^2$):\n   $$R_{\\text{th,total}} = \\frac{R''_{\\text{total}}}{A} = \\frac{2.865}{20.0} = 0.14325\\text{ K/W} \\approx 0.143\\text{ K/W}$$\n4. อัตราการสูญเสียความร้อนรวม:\n   $$q = \\frac{T_{\\text{in}} - T_{\\text{out}}}{R_{\\text{th,total}}} = \\frac{22.0 - (-8.0)}{0.14325} = \\frac{30.0}{0.14325} \\approx 209.42\\text{ W}$$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Method 2: Thermal-Electrical Network Analogy & Condensation Diagnostics):\n1. แบบจำลองวงจรสมมูลไฟฟ้า (Ohm's Law Analogy):\n   เทียบ $\\Delta T \\leftrightarrow V$ (แรงดัน), ฟลักซ์ความร้อน $q \\leftrightarrow I$ (กระแส), ความต้านทานความร้อน $R_{\\text{th}} \\leftrightarrow R$\n   ค่าสัมประสิทธิ์การถ่ายเทความร้อนรวม $U = 1/R''_{\\text{total}} = 1/2.865 = 0.349\\text{ W/(m}^2\\cdot\\text{K)}$\n   $$q = U A \\Delta T = (0.349)(20.0)(30.0) = 209.4\\text{ W}$$\n2. การวิเคราะห์อุณหภูมิรอยต่อเพื่อป้องกันเชื้อราและการควบแน่น (Vapor Condensation Check):\n   - อุณหภูมิผิวใน $T_{s1} = 22.0 - (q/A)(R''_{\\text{in}}) = 22.0 - (10.47)(0.125) = 20.69^\\circ\\text{C}$\n   - อุณหภูมิหน้ารอยต่อฉนวน/อิฐ: $T_{23} = 20.69 - (10.47)(0.075 + 2.500) = -6.27^\\circ\\text{C}$!\n(ข้อค้นพบทางวิศวกรรมอาคาร: อุณหภูมิรอยต่อด้านหลังฉนวนลดฮวบลงต่ำกว่าจุดเยือกแข็ง จึงจำเป็นอย่างยิ่งที่จะต้องติดตั้งแผ่นกั้นไอน้ำ Vapor Barrier ไว้ที่ฝั่งอุ่นด้านในเพื่อป้องกันความชื้นในห้องซึมเข้าไปควบแน่นเป็นน้ำแข็งในฉนวน)",
        simLink: { chapter: "ch05", mode: "thermo" }
      },

      // FUNDAMENTAL & TCAS 68 EXAM EXCEPTION: Vector Decomposition Ambiguity
      {
        id: "prob-alt-036",
        track: "fundamental",
        chapterId: "ch01",
        chapterTitle: "ฟิสิกส์พื้นฐาน & เฉลยข้อยกเว้นทางการ: การแตกเวกเตอร์และมุมอ้างอิง (TCAS 68 Dual Answer)",
        difficulty: "ระดับข้อสอบเข้ามหาวิทยาลัย (TCAS 68 A-Level ข้อ 28)",
        title: "การวิเคราะห์ฟิสิกส์สองคำตอบที่ทางการเฉลยให้ทั้งคู่ (TCAS 68 Official Dual-Answer Analysis: 60.00 vs 80.00)",
        question: "ในการวิเคราะห์โจทย์ทางการฟิสิกส์ A-Level 2568 (ข้อ 28) วัตถุมวล $10.0\\text{ kg}$ วางบนพื้นเอียงที่มีความลาดชันตามอัตราส่วนสามเหลี่ยม 3-4-5 ($\\sin\\theta = 0.60, \\cos\\theta = 0.80$) ภายใต้แรงโน้มถ่วง $g = 10.0\\text{ m/s}^2$ หากพิจารณาการแตกเวกเตอร์แรงน้ำหนักของวัตถุ ($W = 100.0\\text{ N}$) จงวิเคราะห์ว่าเพราะเหตุใดคณะกรรมการตรวจข้อสอบทางการจึงประกาศเฉลยให้คะแนนทั้งสองค่าคือ **60.00** และ **80.00**",
        options: [
          "เกิดจากความคลุมเครือของภาษาโจทย์ว่าวัดมุมเทียบกับแนวระนาบเอียง ($W_\\parallel = 60.00\\text{ N}$) หรือแนวระนาบราบ ($W_\\perp = 80.00\\text{ N}$) ซึ่งถูกต้องตามหลักฟิสิกส์ทั้งสองกรณี",
          "เกิดจากการคิดเลขนัยสำคัญผิดพลาดของผู้ออกข้อสอบ",
          "เกิดจากการคิดแรงเสียดทานจลน์แทนแรงเสียดทานสถิต",
          "เกิดจากการใช้ค่า g = 9.8 แทน g = 10.0"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด (Interpretation A: แรงตามแนวระนาบเอียง):\n1. เมื่อพิจารณาแรงตามแนวระนาบเอียง (Component parallel to incline):\n   $$W_\\parallel = W \\sin\\theta = (m g) \\sin\\theta$$\n2. แทนค่าตัวเลข:\n   $$W_\\parallel = (10.0\\text{ kg})(10.0\\text{ m/s}^2)(0.60) = 60.00\\text{ N}$$\n3. ค่า $60.00$ จึงเป็นขนาดของแรงดึงลงตามความลาดเอียงของเนิน",
        alternativeExplanation: "⚡ วิธีวิเคราะห์เชิงลึก (Interpretation B: แรงตามแนวตั้งฉากกับระนาบเอียง / แรงเทียบระนาบราบ):\n1. ข้อความในโจทย์ต้นฉบับใช้คำว่า 'แรงที่กระทำตามแนวระนาบ' ซึ่งในภาษาไทยสามารถตีความได้สองแง่:\n   - แง่ที่ 1: ระนาบเอียง $\\implies W_\\parallel = 100 \\times 0.60 = 60.00\\text{ N}$\n   - แง่ที่ 2: ระนาบอ้างอิงราบ หรือแรงปฏิกิริยาตั้งฉากที่ระนาบทำต่อวัตถุ $\\implies W_\\perp = 100 \\times 0.80 = 80.00\\text{ N}$\n2. ตรวจสอบความถูกต้องทางเวกเตอร์ (Orthogonal Completeness):\n   $$(60.00)^2 + (80.00)^2 = 3600 + 6400 = 10000 = (100.00)^2$$\n   ทั้งสองค่าคือองค์ประกอบที่ตั้งฉากกันของเวกเตอร์น้ำหนัก $100\\text{ N}$ ตัวเดียวกันพอดี!\n(การที่คณะกรรมการเฉลยทางการ MyTCAS ยอมรับทั้ง 60.00 และ 80.00 จึงเป็นการตัดสินทางวิชาการที่ถูกต้องและยุติธรรมต่อนักเรียนที่สุด)",
        simLink: { chapter: "ch01", mode: "projectile" }
      },

      // CIVIL & MECHANICAL: Principle of Virtual Work (MIT 2.001)
      {
        id: "prob-alt-037",
        track: "civil",
        chapterId: "civil_eng",
        chapterTitle: "วิศวกรรมเครื่องกลและโยธา: กลศาสตร์วิเคราะห์และงานเสมือน (Principle of Virtual Work & MIT 2.001)",
        difficulty: "ระดับปริญญาตรีวิศวกรรม (MIT 2.001 / Advanced Statics)",
        title: "กลไกข้อต่อขยายแรงและอัตราทดแรงอนันต์ด้วยงานเสมือน (Toggle Mechanism via Virtual Work)",
        question: "กลไกขยายแรง (Toggle Clamp) ประกอบด้วยก้านต่อยาวเท่ากัน $L = 200\\text{ mm}$ สองท่อนต่อหมุนกันที่จุด C ปลาย A ยึดหมุนกับที่ ปลาย B เลื่อนได้ในแนวราบ เมื่อออกแรงกดในแนวดิ่ง $F_{\\text{in}} = 100.0\\text{ N}$ ที่จุดเชื่อมตรงกลาง C ขณะที่ก้านทำมุมเอียง $\\theta = 5.0^\\circ$ กับแนวราบ จงหาขนาดของแรงอัดที่ปลาย B ($F_{\\text{clamp}}$) และอัตราการได้เปรียบเชิงกล ($MA$)",
        options: [
          "$F_{\\text{clamp}} \\approx 571.5 \\text{ N}, \\quad MA \\approx 5.715$",
          "$F_{\\text{clamp}} \\approx 285.8 \\text{ N}, \\quad MA \\approx 2.858$",
          "$F_{\\text{clamp}} \\approx 1143.0 \\text{ N}, \\quad MA \\approx 11.43$",
          "$F_{\\text{clamp}} \\approx 100.0 \\text{ N}, \\quad MA \\approx 1.000$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิดแบบมาตรฐาน (Method 1: Free Body Diagram Dissection):\n1. พิจารณาสมดุลแรงที่สลัก C:\n   แรงกด $F_{\\text{in}}$ ถูกรับโดยแรงอัดตามแนวก้าน $T$ ทั้งสองฝั่ง:\n   $$\\Sigma F_y = 0 \\implies 2 T \\sin\\theta = F_{\\text{in}} \\implies T = \\frac{F_{\\text{in}}}{2 \\sin\\theta}$$\n2. พิจารณาสมดุลแรงที่ปลายเลื่อน B ในแนวราบ:\n   แรงอัดตามแนวก้าน $T$ ดันปลาย B ไปทางขวา และต้องสมดุลกับแรงต้าน $F_{\\text{clamp}}$:\n   $$F_{\\text{clamp}} = T \\cos\\theta = \\left(\\frac{F_{\\text{in}}}{2 \\sin\\theta}\\right) \\cos\\theta = \\frac{F_{\\text{in}}}{2 \\tan\\theta}$$\n3. แทนค่าที่ $\\theta = 5.0^\\circ$ ($\\tan 5^\\circ \\approx 0.087489$):\n   $$F_{\\text{clamp}} = \\frac{100.0}{2(0.087489)} = \\frac{100.0}{0.17498} \\approx 571.50 \\text{ N}$$\n4. อัตราการได้เปรียบเชิงกล $MA = \\frac{F_{\\text{clamp}}}{F_{\\text{in}}} = \\frac{571.5}{100.0} = 5.715$ เท่า",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Method 2: Principle of Virtual Work):\n1. กำหนดพิกัดเรขาคณิตของการเคลื่อนที่เสมือน:\n   ความสูงของจุด C: $y_C = L \\sin\\theta$\n   ตำแหน่งของปลาย B: $x_B = 2 L \\cos\\theta$\n2. หาความสัมพันธ์ของการกระจัดเสมือน (Virtual Displacements):\n   $$\\delta y_C = (L \\cos\\theta) \\delta\\theta, \\quad \\delta x_B = (-2 L \\sin\\theta) \\delta\\theta$$\n3. ตั้งสมการงานเสมือนรวมเป็นศูนย์ ($\\delta W = 0$):\n   $$\\delta W = \\vec{F}_{\\text{in}} \\cdot \\delta \\vec{r}_C + \\vec{F}_{\\text{clamp}} \\cdot \\delta \\vec{r}_B = 0$$\n   $$-F_{\\text{in}} \\delta y_C - F_{\\text{clamp}} \\delta x_B = 0$$\n   $$-F_{\\text{in}} (L \\cos\\theta \\delta\\theta) - F_{\\text{clamp}} (-2 L \\sin\\theta \\delta\\theta) = 0$$\n   $$2 F_{\\text{clamp}} \\sin\\theta = F_{\\text{in}} \\cos\\theta \\implies F_{\\text{clamp}} = \\frac{F_{\\text{in}}}{2 \\tan\\theta}$$\n(จุดเด่น: ได้สูตรสำเร็จใน 3 บรรทัดโดยไม่ต้องแยกชิ้นส่วน FBD หรือคำนวณแรงภายในสลักแม้แต่ตัวเดียว! และแสดงให้เห็นชัดเจนว่าเมื่อ $\\theta \\to 0^\\circ$ ก้านเหยียดตรง ค่า $MA \\to \\infty$ ซึ่งเป็นหัวใจของเครื่องบดหินและเครื่องตัดโลหะ)",
        simLink: { chapter: "civil_eng", mode: "civil", submode: "truss" }
      },

      // ADVANCED & QUANTUM: Relativistic 4-Momentum Invariant (Benchmark FC11)
      {
        id: "prob-alt-038",
        track: "advanced",
        chapterId: "ch07",
        chapterTitle: "ฟิสิกส์ขั้นสูง & ควอนตัม: เวกเตอร์ 4 มิติและการกระเจิงคอมป์ตัน (Minkowski 4-Momentum Invariant)",
        difficulty: "ระดับโอลิมปิก & มหาวิทยาลัย (IPhO / Benchmark FC11)",
        title: "การพิสูจน์สมการคอมป์ตันผ่าน 4-โมเมนตัมแบบมินคอฟสกี (Compton Derivation via 4-Momentum Invariant)",
        question: "โฟตอนรังสีเอกซ์พลังงาน $E = 100.0\\text{ keV}$ พุ่งชนอิเล็กตรอนอิสระที่อยู่นิ่ง ($m_e c^2 = 511.0\\text{ keV}$) แล้วกระเจิงออกไปทำมุม $\\theta = 90.0^\\circ$ จงหาพลังงานของโฟตอนกระเจิง ($E'$), พลังงานจลน์ของอิเล็กตรอนสะท้อน ($K_e$), และความยาวคลื่นที่เปลี่ยนไป ($\\Delta \\lambda$)",
        options: [
          "$E' \\approx 83.633 \\text{ keV}, \\quad K_e \\approx 16.367 \\text{ keV}, \\quad \\Delta \\lambda = 2.426 \\text{ pm}$",
          "$E' \\approx 90.500 \\text{ keV}, \\quad K_e \\approx 9.500 \\text{ keV}, \\quad \\Delta \\lambda = 1.213 \\text{ pm}$",
          "$E' \\approx 75.000 \\text{ keV}, \\quad K_e \\approx 25.000 \\text{ keV}, \\quad \\Delta \\lambda = 4.852 \\text{ pm}$",
          "$E' \\approx 83.633 \\text{ keV}, \\quad K_e \\approx 83.633 \\text{ keV}, \\quad \\Delta \\lambda = 2.426 \\text{ pm}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิดแบบมาตรฐาน (Method 1: 2D Relativistic Conservation):\n1. อนุรักษ์พลังงานสัมพัทธภาพ:\n   $$E + m_e c^2 = E' + E_e \\implies E_e = E - E' + m_e c^2$$\n2. อนุรักษ์โมเมนตัม 2 มิติ:\n   $$p_x = p'_x + p_{ex} \\implies p = p' \\cos\\theta + p_e \\cos\\phi$$\n   $$p_y = p'_y + p_{ey} \\implies 0 = p' \\sin\\theta - p_e \\sin\\phi$$\n3. กำจัดมุม $\\phi$ ของอิเล็กตรอนโดยยกกำลังสองแล้วบวกกัน จากนั้นใช้ความสัมพันธ์สัมพัทธภาพ $E_e^2 = p_e^2 c^2 + m_e^2 c^4$:\n   หลังจากจัดรูปพีชคณิตยาว 1 หน้ากระดาษ จะได้สูตรคอมป์ตัน:\n   $$E' = \\frac{E}{1 + \\frac{E}{m_e c^2}(1 - \\cos\\theta)}$$\n4. แทนค่าที่ $\\theta = 90.0^\\circ$:\n   $$E' = \\frac{100.0}{1 + \\frac{100.0}{511.0}(1)} = \\frac{100.0}{1.19569} \\approx 83.63339\\text{ keV}$$\n   $$K_e = E - E' = 100.0 - 83.63339 = 16.36661\\text{ keV}$$",
        alternativeExplanation: "⚡ วิธีทางเลือกใหม่ (Method 2: Minkowski 4-Momentum Invariant - Benchmark FC11):\n1. กำหนด 4-โมเมนตัมในปริภูมิมินคอฟสกี (Signature $+ - - -$):\n   $P_\\gamma = (E/c, \\vec{p})$ (โฟตอน norm เป็นศูนย์ $P_\\gamma^2 = 0$)\n   $P_e = (m_e c, \\vec{0})$ (อิเล็กตรอนอยู่นิ่ง $P_e^2 = m_e^2 c^2$)\n   $P'_\\gamma = (E'/c, \\vec{p}'), \\quad P'_e$ (อนุภาคหลังชน)\n2. จากการอนุรักษ์ 4-โมเมนตัม: $P_\\gamma + P_e - P'_\\gamma = P'_e$\n3. ยกกำลังสองสเกลาร์มินคอฟสกีทั้งสองข้าง ($(P'_e)^2 = m_e^2 c^2$):\n   $$m_e^2 c^2 = (P_\\gamma - P'_\\gamma + P_e)^2 = (P_\\gamma - P'_\\gamma)^2 + P_e^2 + 2(P_\\gamma - P'_\\gamma)\\cdot P_e$$\n   $$0 = -2 P_\\gamma \\cdot P'_\\gamma + 2(P_\\gamma - P'_\\gamma)\\cdot P_e$$\n   $$P_\\gamma \\cdot P'_\\gamma = (P_\\gamma - P'_\\gamma)\\cdot P_e$$\n4. กระจายผลคูณสเกลาร์ 4 มิติ:\n   $$\\frac{E E'}{c^2}(1 - \\cos\\theta) = m_e (E - E') \\implies \\frac{1}{E'} - \\frac{1}{E} = \\frac{1 - \\cos\\theta}{m_e c^2}$$\n(พิสูจน์จบใน 4 บรรทัดโดยไม่ต้องกำจัดมุมทวิภาคี ผลลัพธ์ $E' = 83.633\\text{ keV}, K_e = 16.367\\text{ keV}$ ตรงกับจุดตรวจ FC11 ทุกทศนิยม)",
        simLink: { chapter: "ch07", mode: "nuclear", submode: "compton_scattering" }
      }
    ]
  };
}));
