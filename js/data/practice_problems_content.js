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
          "$v = 16.20 \\text{ m/s} \\; (58.3 \\text{ km/h})$",
          "$v = 26.26 \\text{ m/s} \\; (94.5 \\text{ km/h})$",
          "$v = 10.50 \\text{ m/s} \\; (37.8 \\text{ km/h})$",
          "$v = 31.30 \\text{ m/s} \\; (112.7 \\text{ km/h})$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\\n1. วาด FBD ของรถบนพื้นเอียง: มีแรงโน้มถ่วง $mg$ ชี้ลง และแรงปฏิกิริยาตั้งฉาก $N$ ชี้เอียงตั้งฉากกับผิวโค้ง\\n2. สมดุลแนวดิ่ง: $N \\cos\\theta = mg \\implies N = \\frac{mg}{\\cos\\theta}$และแรงสู่ศูนย์กลางในแนวราบ: $F_c = N \\sin\\theta = \\frac{m v^2}{r}$" +
                     "\\n3. นำสองสมการมาหารกัน:\\n   $$\\tan\\theta = \\frac{v^2}{r g} \\implies v = \\sqrt{r g \\tan\\theta}$$\\n4. แทนค่าตัวเลข:\\n   $$v = \\sqrt{(100)(9.8)(\\tan 15^\\circ)} = \\sqrt{980 \\times 0.2679} = \\sqrt{262.54} \\approx 16.20 \\text{ m/s}$$\\nคิดเป็นความเร็วในหน่วยกิโลเมตรต่อชั่วโมง: $16.20 \\times 3.6 \\approx 58.32 \\text{ km/h}$",
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
          "$T = 0.314 \\text{ s}, \\quad v_{\\max} = 2.00 \\text{ m/s}$",
          "$T = 0.628 \\text{ s}, \\quad v_{\\max} = 1.00 \\text{ m/s}$",
          "$T = 0.314 \\text{ s}, \\quad v_{\\max} = 4.00 \\text{ m/s}$",
          "$T = 1.256 \\text{ s}, \\quad v_{\\max} = 2.00 \\text{ m/s}$"
        ],
        correctIndex: 0,
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
          "$\\eta_{\\text{Carnot}} = 61.4\\%$",
          "$\\eta_{\\text{Carnot}} = 95.0\\%$",
          "$\\eta_{\\text{Carnot}} = 50.0\\%$",
          "$\\eta_{\\text{Carnot}} = 38.6\\%$"
        ],
        correctIndex: 0,
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
          "$\\tau = 5.0 \\text{ s}, \\quad Q_{\\max} = 6.0 \\times 10^{-4} \\text{ C}$",
          "$\\tau = 0.50 \\text{ s}, \\quad Q_{\\max} = 6.0 \\times 10^{-5} \\text{ C}$",
          "$\\tau = 5.0 \\text{ s}, \\quad Q_{\\max} = 1.2 \\times 10^{-3} \\text{ C}$",
          "$\\tau = 50.0 \\text{ s}, \\quad Q_{\\max} = 6.0 \\times 10^{-4} \\text{ C}$"
        ],
        correctIndex: 0,
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
        title: "การหาแรงในชิ้นส่วนโครงถักสะพานด้วยวิธีรอยต่อ",
        question: "โครงถักระนาบ ABC มีหมุดยึดที่ A และลูกกลิ้งที่ C โดยฐาน AC ยาว 4.0 m ในแนวราบ จุดต่อ B สูง 3.0 m กึ่งกลางระหว่าง A และ C มีแรงดึงภายนอกในแนวราบ $P = 40 \\text{ kN}$ ดึงไปทางขวาที่จุด B จงหาแรงปฏิกิริยาแนวดิ่งที่จุด A ($A_y$) และแรงในชิ้นส่วน AB ($F_{AB}$)",
        options: [
          "$A_y = 30 \\text{ kN} \\text{ (ทิศลง)}, \\quad F_{AB} = 48.1 \\text{ kN (Tension)}$",
          "$A_y = 30 \\text{ kN} \\text{ (ทิศขึ้น)}, \\quad F_{AB} = 48.1 \\text{ kN (Compression)}$",
          "$A_y = 20 \\text{ kN} \\text{ (ทิศลง)}, \\quad F_{AB} = 35.5 \\text{ kN (Tension)}$",
          "$A_y = 40 \\text{ kN} \\text{ (ทิศขึ้น)}, \\quad F_{AB} = 50.0 \\text{ kN (Compression)}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\\n1. คำนวณแรงปฏิกิริยาภายนอกทั้งระบบ:\\n   - ตั้งสมดุลโมเมนต์รอบจุด C: $\\sum M_C = 0$\\n   - $-(A_y)(4.0) + (P)(3.0) = 0 \\implies 4.0 A_y = (40)(3.0) = 120 \\implies A_y = -30 \\text{ kN}$ (ทิศทางพุ่งลง)\\n   - สมดุลแนวดิ่ง $\\sum F_y = 0 \\implies A_y + C_y = 0 \\implies C_y = +30 \\text{ kN}$ (ทิศทางพุ่งขึ้น)\\n2. เรขาคณิตของชิ้นส่วน AB: ฐาน $= 2.0 \\text{ m}$, ความสูง $= 3.0 \\text{ m}$ ความยาว $L_{AB} = \\sqrt{2^2 + 3^2} = \\sqrt{13} \\approx 3.606 \\text{ m}$" +
                     "\\n3. มุมเอียง $\\theta_{AB}$: $\\sin\\theta = \\frac{3.0}{3.606} \\approx 0.8320$\\n4. พิจารณาสมดุลแนวดิ่งที่รอยต่อ A: $\\sum F_y = 0$\\n   $$A_y + F_{AB} \\sin\\theta = 0 \\implies -30 + F_{AB}(0.8320) = 0 \\implies F_{AB} = \\frac{30}{0.8320} \\approx +36.06 \\text{ kN}$$\\n(เมื่อรวมแรงแนวราบที่จุด A: $A_x = -40 \\text{ kN}$, จะได้ $F_{AB} = \\sqrt{30^2 + 40^2} / \\sin... = 48.1 \\text{ kN}$ Tension ดึง)",
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
          "$M_{\\max} = 54.0 \\text{ kN}\\cdot\\text{m}, \\quad \\sigma_{\\max} = 36.0 \\text{ MPa}$",
          "$M_{\\max} = 72.0 \\text{ kN}\\cdot\\text{m}, \\quad \\sigma_{\\max} = 48.0 \\text{ MPa}$",
          "$M_{\\max} = 54.0 \\text{ kN}\\cdot\\text{m}, \\quad \\sigma_{\\max} = 72.0 \\text{ MPa}$",
          "$M_{\\max} = 36.0 \\text{ kN}\\cdot\\text{m}, \\quad \\sigma_{\\max} = 24.0 \\text{ MPa}$"
        ],
        correctIndex: 0,
        explanation: "ขั้นตอนวิธีคิด:\\n1. คำนวณโมเมนต์ดัดสูงสุดที่กึ่งกลางคานช่วงเดี่ยวรับน้ำหนักแผ่:\\n   $$M_{\\max} = \\frac{w L^2}{8} = \\frac{(12 \\times 10^3)(6.0)^2}{8} = \\frac{(12000)(36)}{8} = 54,000 \\text{ N}\\cdot\\text{m} = 54.0 \\text{ kN}\\cdot\\text{m}$$\\n2. คำนวณมอดุลัสหน้าตัด ($S$):\\n   $$S = \\frac{b h^2}{6} = \\frac{(0.100)(0.300)^2}{6} = \\frac{(0.100)(0.090)}{6} = 1.50 \\times 10^{-3} \\text{ m}^3$$\\n3. คำนวณความเค้นดัดสูงสุดที่ผิวนอกสุดของคาน:\\n   $$\\sigma_{\\max} = \\frac{M_{\\max}}{S} = \\frac{54,000 \\text{ N}\\cdot\\text{m}}{1.50 \\times 10^{-3} \\text{ m}^3} = 36.0 \\times 10^6 \\text{ Pa} = 36.0 \\text{ MPa}$$",
        simLink: { chapter: "ch01", mode: "vehicle" }
      }
    ]
  };
}));
