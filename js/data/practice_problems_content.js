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
        explanation: "ขั้นตอนวิธีคิด:\\n1. ความเร็วต้นในแต่ละแกน:\\n   $$u_x = u \\cos(45^\\circ) = 20 \\times \\frac{\\sqrt{2}}{2} = 10\\sqrt{2} \\approx 14.14 \\text{ m/s}$$\\n   $$u_y = u \\sin(45^\\circ) = 20 \\times \\frac{\\sqrt{2}}{2} = 10\\sqrt{2} \\approx 14.14 \\text{ m/s}$$\\n2. เวลาทั้งหมดในการลอยตัว ($T$):\\n   $$T = \\frac{2 u_y}{g} = \\frac{2(14.142)}{9.8} \\approx 2.886 \\text{ s}$$\\n3. ระยะตกไกลในแนวราบ ($R$):\\n   $$R = \\frac{u^2 \\sin(2\\theta)}{g} = \\frac{20^2 \\sin(90^\\circ)}{9.8} = \\frac{400(1)}{9.8} \\approx 40.82 \\text{ m}$$\\n4. ความสูงสูงสุด ($H$):\\n   $$H = \\frac{u_y^2}{2g} = \\frac{(14.142)^2}{2(9.8)} = \\frac{200}{19.6} \\approx 10.20 \\text{ m}$$",
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
        explanation: "ขั้นตอนวิธีคิด:\\n1. วาด FBD ของรถบนพื้นเอียง: มีแรงโน้มถ่วง $mg$ ชี้ลง และแรงปฏิกิริยาตั้งฉาก $N$ ชี้เอียงตั้งฉากกับผิวโค้ง\\n2. สมดุลแนวดิ่ง: $N \\cos\\theta = mg \\implies N = \\frac{mg}{\\cos\\theta}$ และแรงสู่ศูนย์กลางในแนวราบ: $F_c = N \\sin\\theta = \\frac{m v^2}{r}$\\n3. นำสองสมการมาหารกัน:\\n   $$\\tan\\theta = \\frac{v^2}{r g} \\implies v = \\sqrt{r g \\tan\\theta}$$\\n4. แทนค่าตัวเลข:\\n   $$v = \\sqrt{(100)(9.8)(\\tan 15^\\circ)} = \\sqrt{980 \\times 0.2679} = \\sqrt{262.54} \\approx 16.20 \\text{ m/s}$$\\nคิดเป็นความเร็วในหน่วยกิโลเมตรต่อชั่วโมง: $16.20 \\times 3.6 \\approx 58.32 \\text{ km/h}$",
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
        explanation: "ขั้นตอนวิธีคิด:\\n1. ความถี่เชิงมุมธรรมชาติ ($\\omega_0$):\\n   $$\\omega_0 = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{200}{0.50}} = \\sqrt{400} = 20 \\text{ rad/s}$$\\n2. คาบการสั่น ($T$):\\n   $$T = \\frac{2\\pi}{\\omega_0} = \\frac{2(3.1416)}{20} \\approx 0.314 \\text{ s}$$\\n3. อัตราเร็วสูงสุดที่ตำแหน่งสมดุล ($v_{\\max}$):\\n   $$v_{\\max} = \\omega_0 A = (20 \\text{ rad/s})(0.10 \\text{ m}) = 2.00 \\text{ m/s}$$",
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
        simLink: { chapter: "ch06", mode: "em" }
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
        simLink: { chapter: "ch07", mode: "nuclear" }
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
        simLink: { chapter: "ch03", mode: "oscillation" }
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
        simLink: { chapter: "ch01", mode: "collision" }
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
        simLink: { chapter: "ch01", mode: "vehicle" }
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
        simLink: { chapter: "ch01", mode: "cannon" }
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
        simLink: { chapter: "ch01", mode: "roller" }
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
        simLink: { chapter: "ch03", mode: "coulomb" }
      },

      // FUNDAMENTAL / UNIVERSITY THERMODYNAMICS: Otto Cycle
      {
        id: "prob-fund-08",
        track: "fundamental",
        chapterId: "ch02",
        chapterTitle: "บทที่ 2: อุณหพลศาสตร์และทฤษฎีจลน์ของก๊าซ",
        difficulty: "ระดับมหาวิทยาลัย (Moran & Shapiro / Thermodynamics)",
        title: "วัฏจักรเครื่องยนต์ออตโตมาตรฐานอากาศ (Air-Standard Otto Cycle)",
        question: "เครื่องยนต์สันดาปภายใน 4 จังหวะทำงานตามวัฏจักรออตโตมาตรฐานอากาศในอุดมคติ มีอัตราส่วนการอัด (Compression Ratio) $r = \\frac{V_1}{V_2} = 8.50$ สภาวะเริ่มต้นก่อนเริ่มจังหวะอัดคืออากาศที่อุณหภูมิ $T_1 = 300 \\text{ K}$ ($27^\\circ\\text{C}$) กำหนดให้อากาศเป็นก๊าซในอุดมคติที่มีอัตราส่วนความจุความร้อน $\\gamma = 1.40$ จงหาประสิทธิภาพเชิงความร้อนตามทฤษฎี ($\\eta_{\\text{Otto}}$) และอุณหภูมิของอากาศเมื่อสิ้นสุดจังหวะอัดแบบแอเดียแบติก ($T_2$)",
        options: [
          "$\\eta_{\\text{Otto}} \\approx 57.5\\%, \\quad T_2 \\approx 706.5 \\text{ K} \\text{ (433.5}^\\circ\\text{C)}$",
          "$\\eta_{\\text{Otto}} \\approx 45.0\\%, \\quad T_2 \\approx 550.0 \\text{ K} \\text{ (277.0}^\\circ\\text{C)}$",
          "$\\eta_{\\text{Otto}} \\approx 62.8\\%, \\quad T_2 \\approx 850.0 \\text{ K} \\text{ (577.0}^\\circ\\text{C)}$",
          "$\\eta_{\\text{Otto}} \\approx 50.0\\%, \\quad T_2 \\approx 600.0 \\text{ K} \\text{ (327.0}^\\circ\\text{C)}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\\n1. ในวัฏจักรออตโตในอุดมคติ ประกอบด้วย 4 กระบวนการ:\\n   - $1 \\to 2$: การอัดแบบไอเซนโทรปิก (Reversible Adiabatic Compression, $s = \\text{const}$)\\n   - $2 \\to 3$: การรับความร้อนที่ปริมาตรคงที่ (Isochoric Heat Addition, $v = \\text{const}$)\\n   - $3 \\to 4$: การขยายตัวทำงานแบบไอเซนโทรปิก (Isentropic Expansion, $s = \\text{const}$)\\n   - $4 \\to 1$: การคายความร้อนที่ปริมาตรคงที่ (Isochoric Heat Rejection, $v = \\text{const}$)\\n2. คำนวณอุณหภูมิ $T_2$ หลังกระบวนการอัดแอเดียแบติก:\\n   $$T_1 V_1^{\\gamma-1} = T_2 V_2^{\\gamma-1} \\implies T_2 = T_1 \\left(\\frac{V_1}{V_2}\\right)^{\\gamma-1} = T_1 \\cdot r^{\\gamma-1}$$\\n   แทนค่า $r = 8.50$, $\\gamma - 1 = 0.40$:\\n   $$r^{0.40} = (8.50)^{0.40} \\approx 2.3548$$\\n   $$T_2 = 300 \\times 2.3548 \\approx 706.45 \\text{ K} \\approx 706.5 \\text{ K} \\text{ (หรือ } 433.5^\\circ\\text{C)}$$\\n3. คำนวณประสิทธิภาพเชิงความร้อนของวัฏจักรออตโต:\\n   $$\\eta_{\\text{Otto}} = 1 - \\frac{Q_{\\text{out}}}{Q_{\\text{in}}} = 1 - \\frac{m c_v (T_4 - T_1)}{m c_v (T_3 - T_2)} = 1 - \\frac{1}{r^{\\gamma-1}}$$\\n   $$\\eta_{\\text{Otto}} = 1 - \\frac{1}{2.3548} \\approx 1 - 0.42466 = 0.57534 \\approx 57.5\\%$$",
        simLink: { chapter: "ch02", mode: "kinetic" }
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
        simLink: { chapter: "ch01", mode: "vehicle" }
      },

      // FUNDAMENTAL / MODERN PHYSICS: Compton Scattering
      {
        id: "prob-fund-09",
        track: "fundamental",
        chapterId: "ch04",
        chapterTitle: "บทที่ 4: ฟิสิกส์นิวเคลียร์และควอนตัมเบื้องต้น",
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
        simLink: { chapter: "ch04", mode: "stochastic" }
      }
    ]
  };
}));
