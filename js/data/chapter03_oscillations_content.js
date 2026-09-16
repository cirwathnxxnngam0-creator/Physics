/**
 * chapter03_oscillations_content.js - Comprehensive Curriculum Module for Chapter 03
 * Oscillations, Simple Harmonic Motion, Damping, Resonance & Phase Space
 * Part of PhysicsNoza 3.0 Standardized Curriculum
 *
 * Academic Standards:
 * - David Morin (2008), Introduction to Classical Mechanics, Chapter 4 (Oscillations).
 * - University Physics with Modern Physics (15th Ed), Chapter 14 (Periodic Motion).
 * - David Tong (2005), Lectures on Classical Dynamics (DAMTP, Cambridge), Section 2.
 * - Billah & Scanlan (1991), Resonance, flutter and the Tacoma Narrows bridge failure, Am. J. Phys.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Chapter03Content = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    meta: {
      chapterId: "ch03",
      number: 3,
      titleTh: "บทที่ 03: การแกว่งกวัดและฮาร์มอนิกอย่างง่าย",
      titleEn: "Chapter 03: Oscillations, Simple Harmonic Motion, Damping & Resonance",
      description: "การวิเคราะห์การเคลื่อนที่แบบพีริออดิก แรงดึงกลับเชิงเส้นตามกฎของฮุก สมการอนุพันธ์อันดับสอง การอนุรักษ์พลังงานกล การแกว่งกวัดแบบมีความหน่วงทั้งสามสภาวะ และปรากฏการณ์การสั่นพ้องในงานวิศวกรรม"
    },

    divisions: [
      {
        id: "div-ch03-kinematics-shm",
        numeral: "ภาคที่ 1",
        titleTh: "จลนศาสตร์และพลศาสตร์ฮาร์มอนิกอย่างง่าย (Kinematics & Dynamics of SHM)",
        titleEn: "Kinematics and Dynamics of Simple Harmonic Motion",
        description: "สมดุลเสถียร แรงคืนตัวเชิงเส้น สมการอนุพันธ์เชิงเส้นอันดับสอง มวลติดปลายสปริง ลูกตุ้มอย่างง่าย และการอนุรักษ์พลังงานกล"
      },
      {
        id: "div-ch03-damping-resonance",
        numeral: "ภาคที่ 2",
        titleTh: "การสั่นหน่วง การสั่นถูกบังคับ และการสั่นพ้อง (Damped & Driven Oscillations, Resonance)",
        titleEn: "Damped, Driven Oscillations and Quality Factor",
        description: "แรงต้านความหนืด การสั่นแบบหน่วงต่ำ วิกฤต และเกินวิกฤต แรงกระตุ้นภายนอก กราฟการสั่นพ้องของแอมพลิจูด และค่าประกอบคุณภาพ Q"
      }
    ],

    masterSymbols: [
      { sym: "x(t)", nameTh: "การกระจัด ณ เวลา t", nameEn: "Displacement", unit: "\\text{m}", domain: "kinematics", domainTh: "จลนศาสตร์", note: "ระยะห่างจากตำแหน่งสมดุลเสถียร (x = 0)" },
      { sym: "A", nameTh: "แอมพลิจูด (การกระจัดสูงสุด)", nameEn: "Amplitude", unit: "\\text{m}", domain: "kinematics", domainTh: "จลนศาสตร์", note: "ค่าบวกเสมอ ขนาดการเบี่ยงเบนสูงสุดจากสมดุล" },
      { sym: "v(t)", nameTh: "ความเร็วเชิงเส้นใน SHM", nameEn: "Velocity", unit: "\\text{m/s}", domain: "kinematics", domainTh: "จลนศาสตร์", note: "อนุพันธ์อันดับหนึ่ง dx/dt มีค่าสูงสุดที่สมดุล" },
      { sym: "a(t)", nameTh: "ความเร่งใน SHM", nameEn: "Acceleration", unit: "\\text{m/s}^2", domain: "kinematics", domainTh: "จลนศาสตร์", note: "อนุพันธ์อันดับสอง d²x/dt² = -ω²x ชี้เข้าหาสมดุลเสมอ" },
      { sym: "\\omega_0", nameTh: "ความถี่เชิงมุมธรรมชาติ", nameEn: "Natural Angular Frequency", unit: "\\text{rad/s}", domain: "kinematics", domainTh: "จลนศาสตร์", note: "ω₀ = √(k/m) สำหรับสปริง, √(g/L) สำหรับลูกตุ้ม" },
      { sym: "T", nameTh: "คาบของการแกว่งกวัด", nameEn: "Period", unit: "\\text{s}", domain: "kinematics", domainTh: "จลนศาสตร์", note: "เวลาที่ใช้เคลื่อนที่ครบ 1 รอบสมบูรณ์ (T = 2π/ω₀)" },
      { sym: "f", nameTh: "ความถี่ของการสั่น", nameEn: "Frequency", unit: "\\text{Hz (1/s)}", domain: "kinematics", domainTh: "จลนศาสตร์", note: "จำนวนรอบการสั่นต่อวินาที (f = 1/T = ω₀/2π)" },
      { sym: "\\phi", nameTh: "ค่าคงตัวเฟสเริ่มต้น", nameEn: "Initial Phase Constant", unit: "\\text{rad}", domain: "kinematics", domainTh: "จลนศาสตร์", note: "กำหนดตำแหน่งและความเร็ว ณ เวลา t = 0" },
      { sym: "k", nameTh: "ค่านิจสปริง / สติฟเนส", nameEn: "Spring Constant / Stiffness", unit: "\\text{N/m}", domain: "dynamics", domainTh: "พลศาสตร์", note: "ความชันของแรงคืนตัวตามกฎของฮุก F = -kx" },
      { sym: "E", nameTh: "พลังงานกลรวมใน SHM", nameEn: "Total Mechanical Energy", unit: "\\text{J}", domain: "dynamics", domainTh: "พลศาสตร์", note: "E = K + U = (1/2)kA² = (1/2)m v_max² คงที่ตลอดเวลา" },
      { sym: "\\gamma", nameTh: "อัตราส่วนการหน่วง / แดมปิง", nameEn: "Damping Factor", unit: "\\text{s}^{-1}", domain: "damping", domainTh: "การสั่นหน่วง", note: "γ = b / (2m) กำหนดอัตราการสูญเสียพลังงานสู่สิ่งแวดล้อม" },
      { sym: "Q", nameTh: "ค่าประกอบคุณภาพ (Q-factor)", nameEn: "Quality Factor", unit: "—", domain: "damping", domainTh: "การสั่นพ้อง", note: "Q = ω₀ / (2γ) วัดความคมชัดของพีคการสั่นพ้องและการเก็บพลังงาน" }
    ],

    theories: [
      {
        id: 1,
        divisionId: "div-ch03-kinematics-shm",
        divisionTitle: "ภาคที่ 1: จลนศาสตร์และพลศาสตร์ฮาร์มอนิกอย่างง่าย",
        numberTh: "ทฤษฎีที่ 1",
        titleTh: "นิยามฮาร์มอนิกอย่างง่าย แรงดึงกลับเชิงเส้น และสมการอนุพันธ์หลัก",
        titleEn: "Linear Restoring Force, Hooke's Law & Governing Differential Equation",
        type: "ทฤษฎีรากฐาน (Core Fundamental Theory)",
        summary: "การสั่นแบบฮาร์มอนิกอย่างง่ายเกิดขึ้นเมื่อแรงลัพธ์ที่กระทำต่อวัตถุแปรผันตรงกับการกระจัดและมีทิศตรงข้ามเสมอ (แรงคืนตัวเชิงเส้น) ส่งผลให้เกิดสมการอนุพันธ์เชิงเส้นเอกพันธุ์อันดับสอง",
        definition: {
          text: "การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย (Simple Harmonic Motion: SHM) คือ การเคลื่อนที่แบบพีริออดิกกลับไปกลับมาซ้ำรอยเดิมรอบตำแหน่งสมดุลเสถียร โดยมีแรงลัพธ์กระทำต่อวัตถุเป็น 'แรงคืนตัวเชิงเส้น' (Linear Restoring Force) ตามกฎของฮุก: $F = -kx$ ซึ่งมีทิศพุ่งเข้าสู่ตำแหน่งสมดุลเสมอ\n\nเมื่อนำกฎข้อที่สองของนิวตัน $\\Sigma F = m\\frac{d^2x}{dt^2}$ มารวมเข้ากับแรงคืนตัว จะได้สมการอนุพันธ์การเคลื่อนที่ฮาร์มอนิกอย่างง่าย:\n$$\\frac{d^2x}{dt^2} + \\omega_0^2 x = 0$$\nโดย $\\omega_0 = \\sqrt{\\frac{k}{m}}$ คือความถี่เชิงมุมธรรมชาติของระบบ"
        },
        principle: {
          text: "คำตอบทั่วไปของสมการอนุพันธ์อันดับสองนี้อยู่ในรูปฟังก์ชันฮาร์มอนิกรูปคลื่นไซน์หรือโคไซน์:\n$$x(t) = A\\cos(\\omega_0 t + \\phi)$$\nเมื่อหาอนุพันธ์เทียบกับเวลา จะได้สมการความเร็วและความเร่งที่ประสานกันอย่างสมบูรณ์:\n$$v(t) = \\frac{dx}{dt} = -\\omega_0 A\\sin(\\omega_0 t + \\phi) = v_{\\text{max}}\\sin(\\omega_0 t + \\phi + \\pi)$$\n$$a(t) = \\frac{dv}{dt} = -\\omega_0^2 A\\cos(\\omega_0 t + \\phi) = -\\omega_0^2 x(t)$$\n\nความสัมพันธ์เชิงเฟส (Phase Relationships):\n• ความเร็ว $v(t)$ มีเฟสนำหน้าการกระจัด $x(t)$ อยู่ $\\frac{\\pi}{2}$ เรเดียน ($90^\\circ$)\n• ความเร่ง $a(t)$ มีเฟสตรงข้ามกับการกระจัด $x(t)$ อย่างสิ้นเชิง คือนำหน้าอยู่ $\\pi$ เรเดียน ($180^\\circ$)\n• ณ ตำแหน่งปลายสุด ($x = \\pm A$): ความเร็วเป็นศูนย์ ($v = 0$) แต่ความเร่งและแรงคืนตัวมีขนาดสูงสุด ($|a| = \\omega_0^2 A$)\n• ณ ตำแหน่งสมดุล ($x = 0$): แรงคืนตัวและความเร่งเป็นศูนย์ ($a = 0$) แต่อัตราเร็วพุ่งทะยานสูงสุด ($|v| = v_{\\text{max}} = \\omega_0 A$)"
        },
        formulas: [
          {
            name: "สมการอนุพันธ์หลักของการเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย",
            latex: "\\frac{d^2x}{dt^2} + \\omega_0^2 x = 0,\\quad \\omega_0 = \\sqrt{\\frac{k}{m}}",
            symbols: [
              { sym: "x", desc: "การกระจัดจากตำแหน่งสมดุล", unit: "\\text{m}" },
              { sym: "\\omega_0", desc: "ความถี่เชิงมุมธรรมชาติ", unit: "\\text{rad/s}" },
              { sym: "m", desc: "มวลของวัตถุที่กำลังสั่น", unit: "\\text{kg}" },
              { sym: "k", desc: "ค่านิจสปริงหรือสัมประสิทธิ์แรงคืนตัว", unit: "\\text{N/m}" }
            ],
            derivationSteps: [
              "1. กฎข้อที่ 2 ของนิวตัน: $\\Sigma F = m a = m\\frac{d^2x}{dt^2}$",
              "2. แรงคืนตัวเชิงเส้นตามกฎของฮุก: $F = -kx$",
              "3. จับสมการเท่ากัน: $m\\frac{d^2x}{dt^2} = -kx \\implies m\\frac{d^2x}{dt^2} + kx = 0$",
              "4. หารด้วยมวล m ตลอดทั้งสมการ: $\\frac{d^2x}{dt^2} + \\frac{k}{m}x = 0$",
              "5. กำหนด $\\omega_0^2 = \\frac{k}{m}$ จะได้สมการอนุพันธ์มาตรฐาน: $\\ddot{x} + \\omega_0^2 x = 0$"
            ]
          },
          {
            name: "ฟังก์ชันตำแหน่ง ความเร็ว และความเร่งในรูปเวลา",
            latex: "x(t) = A\\cos(\\omega_0 t + \\phi),\\quad v(t) = -\\omega_0 A\\sin(\\omega_0 t + \\phi),\\quad a(t) = -\\omega_0^2 A\\cos(\\omega_0 t + \\phi)",
            symbols: [
              { sym: "A", desc: "แอมพลิจูดการสั่น", unit: "\\text{m}" },
              { sym: "\\phi", desc: "ค่าคงตัวเฟสตั้งต้น", unit: "\\text{rad}" },
              { sym: "v_{\\text{max}}", desc: "อัตราเร็วสูงสุด (\\omega_0 A)", unit: "\\text{m/s}" },
              { sym: "a_{\\text{max}}", desc: "ขนาดความเร่งสูงสุด (\\omega_0^2 A)", unit: "\\text{m/s}^2" }
            ],
            derivationSteps: [
              "1. เสนอผลเฉลยทดลอง: $x(t) = C e^{rt}$ แทนลงใน $\\ddot{x} + \\omega_0^2 x = 0$",
              "2. ได้สมการลักษณะเฉพาะ: $r^2 + \\omega_0^2 = 0 \\implies r = \\pm i\\omega_0$",
              "3. คำตอบทั่วไป: $x(t) = c_1 e^{i\\omega_0 t} + c_2 e^{-i\\omega_0 t}$",
              "4. ใช้สูตรออยเลอร์แปลงเป็นฟังก์ชันตรีโกณมิติ: $x(t) = A\\cos(\\omega_0 t + \\phi)$",
              "5. หาอนุพันธ์อันดับ 1: $v(t) = \\dot{x}(t) = -\\omega_0 A\\sin(\\omega_0 t + \\phi)$",
              "6. หาอนุพันธ์อันดับ 2: $a(t) = \\ddot{x}(t) = -\\omega_0^2 A\\cos(\\omega_0 t + \\phi) = -\\omega_0^2 x(t)$"
            ]
          }
        ],
        application: {
          text: "ระบบควบคุมการสั่นสะเทือนในโครงสร้างอาคารต้านแผ่นดินไหว (Tuned Mass Dampers), กลไกการแกว่งของนาฬิกาลูกตุ้มและนาฬิกาข้อมือระบบควอตซ์ (Quartz Crystal Oscillators), และการสั่นของโมเลกุลในพันธะเคมี",
          validWhen: "ใช้ได้เมื่อแรงดึงกลับเป็นสัดส่วนเชิงเส้นโดยตรงกับการกระจัด ($F \\propto -x$) และไม่มีแรงเสียดทานภายนอก",
          invalidWhen: "เมื่อแอมพลิจูดการกระจัดมีขนาดใหญ่เกินขอบเขตยืดหยุ่น (Elastic Limit) ของวัสดุ จนเกิดความไม่เป็นเชิงเส้น (Non-linear Anharmonic Oscillation เช่น $F = -kx - \\beta x^3$)"
        },
        example: {
          problem: "มวล $m = 0.50\\text{ kg}$ ยึดติดกับปลายสปริงในแนวราบที่มีค่านิจสปริง $k = 200\\text{ N/m}$ พื้นลื่นปราศจากแรงเสียดทาน ดึงมวลออกจากตำแหน่งสมดุลเป็นระยะ $A = 0.08\\text{ m}$ (8 cm) แล้วปล่อยจากสภาพนิ่ง ณ เวลา $t = 0$ จงหา: (ก) ความถี่เชิงมุม $\\omega_0$ คาบ $T$ และความถี่ $f$ (ข) สมการตำแหน่ง $x(t)$ และ (ค) อัตราเร็วสูงสุด $v_{\\text{max}}$ และขนาดความเร่งสูงสุด $a_{\\text{max}}$",
          steps: [
            "ขั้นตอนที่ 1: คำนวณความถี่เชิงมุมธรรมชาติ $\\omega_0 = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{200}{0.50}} = \\sqrt{400} = 20.0\\text{ rad/s}$",
            "ขั้นตอนที่ 2: คำนวณคาบ $T = \\frac{2\\pi}{\\omega_0} = \\frac{2\\pi}{20.0} \\approx 0.314\\text{ s}$ และความถี่ $f = \\frac{1}{T} = \\frac{20.0}{2\\pi} \\approx 3.18\\text{ Hz}$",
            "ขั้นตอนที่ 3: หาค่าคงตัวเฟส $\\phi$: ที่ $t = 0$ มี $x(0) = A\\cos\\phi = A \\implies \\cos\\phi = 1 \\implies \\phi = 0\\text{ rad}$",
            "ขั้นตอนที่ 4: เขียนสมการตำแหน่ง: $x(t) = 0.08\\cos(20.0 t)\\text{ m}$",
            "ขั้นตอนที่ 5: คำนวณอัตราเร็วสูงสุด $v_{\\text{max}} = \\omega_0 A = (20.0)(0.08) = 1.60\\text{ m/s}$ (เกิดขึ้นเมื่อผ่านจุดสมดุล $x = 0$)",
            "ขั้นตอนที่ 6: คำนวณความเร่งสูงสุด $a_{\\text{max}} = \\omega_0^2 A = (20.0)^2(0.08) = (400)(0.08) = 32.0\\text{ m/s}^2$ (เกิดขึ้นที่จุดปลาย $x = \\pm 0.08\\text{ m}$)"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพมวลติดสปริง SHM">
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <line x1="40" y1="30" x2="40" y2="150" stroke="#94A3B8" stroke-width="6"/>
            <line x1="40" y1="148" x2="480" y2="148" stroke="#475569" stroke-width="2"/>
            <!-- Spring Coil -->
            <path d="M 40 90 L 80 90 L 95 70 L 110 110 L 125 70 L 140 110 L 155 70 L 170 110 L 185 70 L 200 110 L 215 90 L 240 90" fill="none" stroke="#38BDF8" stroke-width="3"/>
            <!-- Mass Block -->
            <rect x="240" y="60" width="60" height="60" rx="6" fill="#EA580C" stroke="#F97316" stroke-width="2"/>
            <text x="270" y="96" fill="#FFFFFF" font-size="14" font-weight="bold" text-anchor="middle">m</text>
            <!-- Equilibrium line -->
            <line x1="200" y1="40" x2="200" y2="150" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="200" y="32" fill="#10B981" font-size="11" text-anchor="middle">x = 0 (สมดุล)</text>
            <!-- Displacement arrow -->
            <line x1="200" y1="135" x2="270" y2="135" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-yellow)"/>
            <text x="235" y="130" fill="#F59E0B" font-size="11" text-anchor="middle">+x</text>
            <!-- Restoring force arrow -->
            <line x1="240" y1="75" x2="180" y2="75" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arr-red)"/>
            <text x="205" y="68" fill="#EF4444" font-size="11" font-weight="bold">F = -kx</text>
            <!-- Right notes panel -->
            <g transform="translate(340, 45)">
              <rect width="160" height="95" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
              <text x="15" y="24" fill="#38BDF8" font-size="11" font-weight="bold">คุณสมบัติการสั่น SHM</text>
              <text x="15" y="44" fill="#F8FAFC" font-size="10">• ที่ x = ±A: v = 0, |a| = a_max</text>
              <text x="15" y="62" fill="#10B981" font-size="10">• ที่ x = 0: a = 0, |v| = v_max</text>
              <text x="15" y="80" fill="#F59E0B" font-size="10">• คาบ T ไม่ขึ้นกับแอมพลิจูด A</text>
            </g>
          </svg>`,
          diagramCaption: "ระบบมวล-สปริงในแนวราบ: แรงดึงกลับ $F = -kx$ มีทิศพุ่งเข้าหาตำแหน่งสมดุล $x = 0$ สวนทางกับการกระจัดเสมอ"
        },
        observations: [
          "การไม่ขึ้นต่อแอมพลิจูด (Isochronism): สำหรับการเคลื่อนที่แบบ SHM แท้ คาบเวลา $T = 2\\pi\\sqrt{m/k}$ จะคงที่เสมอ ไม่ว่าเราจะดึงสปริงให้แกว่งด้วยแอมพลิจูดเล็ก 1 cm หรือแอมพลิจูดใหญ่ 10 cm คาบเวลาจะเท่ากันทุกประการ",
          "ความสัมพันธ์ระหว่างความเร็วและความเร่ง: นักเรียนมักเข้าใจผิดว่าความเร่งจะสูงสุดเมื่อความเร็วสูงสุด แต่ในความเป็นจริง ความเร่งแปรผันตรงกับระยะกระจัด ดังนั้นขณะที่ความเร็วสูงสุด (ผ่านจุดสมดุล) ความเร่งจะเป็นศูนย์ และขณะที่ความเร็วเป็นศูนย์ (จุดกลับตัว) ความเร่งจะมีขนาดสูงสุด"
        ],
        citation: "David Morin (2008). Introduction to Classical Mechanics, Cambridge University Press, Chapter 4, pp. 101–105.",
        citations: [
          {
            title: "Introduction to Classical Mechanics: With Problems and Solutions",
            authors: "David Morin",
            source: "Cambridge University Press, Chapter 4 (Oscillations), pp. 101–108",
            year: "2008",
            url: "https://www.cambridge.org/highereducation/books/introduction-to-classical-mechanics/3004C94CBAAC2649B90967A99D417834",
            verificationStatus: "verified_direct_content",
            evidencePin: "Morin (2008) Chapter 4, Eq. 4.1 to 4.5: Linear differential equation d²x/dt² + (k/m)x = 0 and sinusoidal general solution.",
            note: "สมการอนุพันธ์หลักและการอนุมานฟังก์ชันเวลา"
          }
        ]
      },

      {
        id: 2,
        divisionId: "div-ch03-kinematics-shm",
        divisionTitle: "ภาคที่ 1: จลนศาสตร์และพลศาสตร์ฮาร์มอนิกอย่างง่าย",
        numberTh: "ทฤษฎีที่ 2",
        titleTh: "ระบบมวล-สปริงแนวดิ่งและลูกตุ้มอย่างง่ายพร้อมการประมาณมุมเล็ก",
        titleEn: "Vertical Mass-Spring & Simple Pendulum with Small-Angle Approximation",
        type: "ทฤษฎีการประยุกต์และเงื่อนไขขอบเขต (Boundary & Applied Theory)",
        summary: "การวิเคราะห์สปริงในแนวดิ่งที่มีแรงโน้มถ่วงมาร่วมกระทำ และลูกตุ้มอย่างง่ายที่มีแรงคืนตัวเป็นไปตามฟังก์ชันไซน์ ซึ่งจะเป็น SHM สมบูรณ์เมื่อมุมแกว่งมีขนาดเล็กมาก (Small-angle approximation: sin θ ≈ θ)",
        definition: {
          text: "ในระบบสปริงแนวดิ่ง แรงโน้มถ่วง $mg$ มีผลเพียงแค่เลื่อนตำแหน่งสมดุลของระบบลงมาต่ำกว่าเดิมเป็นระยะ $\\Delta L = \\frac{mg}{k}$ โดยที่ความถี่เชิงมุมธรรมชาติ $\\omega_0 = \\sqrt{\\frac{k}{m}}$ และพฤติกรรมการสั่นรอบตำแหน่งสมดุลใหม่จะเหมือนกับสปริงแนวราบทุกประการ\n\nสำหรับลูกตุ้มอย่างง่าย (Simple Pendulum) มวล $m$ แขวนด้วยเชือกเบายาว $L$ แรงคืนตัวตามแนวเส้นสัมผัสคือองค์ประกอบของน้ำหนัก: $F_t = -mg\\sin\\theta$ เมื่อมุมแกว่ง $\\theta$ มีค่าน้อยมาก (ไม่เกิน $10^\\circ$ หรือ $0.17\\text{ rad}$) เราสามารถใช้การประมาณมุมเล็ก:\n$$\\sin\\theta \\approx \\theta = \\frac{s}{L}$$\nส่งผลให้สมการการเคลื่อนที่กลายเป็น SHM แท้จริง: $\\frac{d^2\\theta}{dt^2} + \\frac{g}{L}\\theta = 0$"
        },
        principle: {
          text: "การอนุมานคาบของลูกตุ้มอย่างง่าย:\n$$\\omega_0 = \\sqrt{\\frac{g}{L}} \\implies T = \\frac{2\\pi}{\\omega_0} = 2\\pi\\sqrt{\\frac{L}{g}}$$\n\nข้อสังเกตเชิงฟิสิกส์ที่สำคัญ:\n1. คาบของลูกตุ้มอย่างง่ายไม่ขึ้นกับมวล $m$ ของลูกตุ้มเลย (เพราะมวลเฉื่อยที่ต้านการเคลื่อนที่และมวลโน้มถ่วงที่สร้างแรงดึงมีค่าเท่ากันตามหลักสมมูลของไอน์สไตน์)\n2. หากมุมแกว่งมีขนาดใหญ่เกินกว่าจะประมาณ $\\sin\\theta \\approx \\theta$ ได้ คาบการแกว่งที่แท้จริงจะยาวนานกว่า $2\\pi\\sqrt{L/g}$ ตามอนุกรมของบอร์ดา (Borda's formula):\n$$T = 2\\pi\\sqrt{\\frac{L}{g}}\\left(1 + \\frac{1}{4}\\sin^2\\frac{\\theta_0}{2} + \\frac{9}{64}\\sin^4\\frac{\\theta_0}{2} + \\dots\\right)$$"
        },
        formulas: [
          {
            name: "คาบและความถี่ของสปริงแนวดิ่งและลูกตุ้มอย่างง่าย",
            latex: "T_{\\text{spring}} = 2\\pi\\sqrt{\\frac{m}{k}},\\quad T_{\\text{pendulum}} = 2\\pi\\sqrt{\\frac{L}{g}}\\quad (\\text{เมื่อ } \\theta_0 \\ll 1)",
            symbols: [
              { sym: "L", desc: "ความยาวของสายแขวนลูกตุ้ม", unit: "\\text{m}" },
              { sym: "g", desc: "ความเร่งโน้มถ่วง ณ ตำแหน่งสังเกตการณ์", unit: "\\text{m/s}^2" },
              { sym: "\\theta", desc: "มุมแกว่งเชิงขั้วเทียบแนวดิ่ง", unit: "\\text{rad หรือ deg}" }
            ],
            derivationSteps: [
              "1. ทอร์กลัพธ์รอบจุดแขวน: $\\tau = -mg L \\sin\\theta$",
              "2. กฎการหมุนของนิวตัน: $\\tau = I\\alpha = I\\frac{d^2\\theta}{dt^2}$",
              "3. โมเมนต์ความเฉื่อยของมวลจุด: $I = mL^2$",
              "4. จับเท่ากัน: $mL^2\\frac{d^2\\theta}{dt^2} = -mgL\\sin\\theta \\implies \\frac{d^2\\theta}{dt^2} + \\frac{g}{L}\\sin\\theta = 0$",
              "5. การประมาณมุมเล็ก $\\sin\\theta \\approx \\theta$: $\\frac{d^2\\theta}{dt^2} + \\frac{g}{L}\\theta = 0$",
              "6. เปรียบเทียบกับ $\\ddot{\\theta} + \\omega_0^2\\theta = 0 \\implies \\omega_0 = \\sqrt{\\frac{g}{L}}$ และ $T = 2\\pi\\sqrt{\\frac{L}{g}}$"
            ]
          }
        ],
        application: {
          text: "การสร้างนาฬิกาลูกตุ้มของคริสตียาน เฮยเคินส์ (Huygens Pendulum Clock), เครื่องมือวัดค่าความเร่งโน้มถ่วงสัมพัทธ์ในงานสำรวจธรณีฟิสิกส์ (Gravimeters), และระบบกันสะเทือนแบบแขวนในงานวิศวกรรมโยธา",
          validWhen: "สำหรับลูกตุ้ม ใช้ได้เมื่อมุมแกว่ง $\\theta_0 \\le 10^\\circ$ (ความคลาดเคลื่อนของการประมาณไม่เกิน 0.2%) สายแขวนเบาไร้มวล และมวลมีขนาดเล็กมากเทียบกับความยาวเชือก",
          invalidWhen: "เมื่อมุมแกว่งกว้าง เช่น $\\theta_0 = 60^\\circ$ ความคลาดเคลื่อนของสูตร $2\\pi\\sqrt{L/g}$ จะพุ่งสูงเกิน 7% หรือเมื่อเชือกหย่อน"
        },
        example: {
          problem: "นักสำรวจต้องการวัดค่าความเร่งโน้มถ่วง $g$ บนดาวเคราะห์ดวงหนึ่ง โดยใช้ลูกตุ้มอย่างง่ายความยาวสาย $L = 1.000\\text{ m}$ จับเวลาการแกว่งกวัดครบ 50 รอบได้เวลา $110.0\\text{ s}$ ด้วยมุมแกว่งเล็ก $\\theta_0 = 4^\\circ$ จงหา: (ก) คาบการแกว่ง $T$ และ (ข) ค่าความเร่งโน้มถ่วง $g$ ของดาวเคราะห์ดวงนี้",
          steps: [
            "ขั้นตอนที่ 1: หาคาบการแกว่ง 1 รอบ: $T = \\frac{\\text{เวลารวม}}{\\text{จำนวนรอบ}} = \\frac{110.0}{50} = 2.200\\text{ s}$",
            "ขั้นตอนที่ 2: ตั้งสมการคาบของลูกตุ้มอย่างง่าย: $T = 2\\pi\\sqrt{\\frac{L}{g}}$",
            "ขั้นตอนที่ 3: ยกกำลังสองทั้งสองข้าง: $T^2 = 4\\pi^2 \\frac{L}{g}$",
            "ขั้นตอนที่ 4: จัดรูปหาค่า $g$: $g = \\frac{4\\pi^2 L}{T^2}$",
            "ขั้นตอนที่ 5: แทนค่าพารามิเตอร์: $g = \\frac{4\\pi^2 (1.000)}{(2.200)^2} = \\frac{39.4784}{4.84} \\approx 8.157\\text{ m/s}^2$"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพลูกตุ้มอย่างง่าย">
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <circle cx="180" cy="25" r="4" fill="#94A3B8"/>
            <line x1="100" y1="25" x2="260" y2="25" stroke="#64748B" stroke-width="3"/>
            <!-- Equilibrium dashed line -->
            <line x1="180" y1="25" x2="180" y2="155" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3"/>
            <!-- Pendulum string -->
            <line x1="180" y1="25" x2="235" y2="135" stroke="#38BDF8" stroke-width="2"/>
            <text x="215" y="75" fill="#38BDF8" font-size="11">L</text>
            <!-- Angle arc -->
            <path d="M 180 65 A 40 40 0 0 1 198 62" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
            <text x="186" y="55" fill="#F59E0B" font-size="11">θ</text>
            <!-- Bob -->
            <circle cx="235" cy="135" r="14" fill="#EA580C" stroke="#F97316" stroke-width="2"/>
            <text x="235" y="139" fill="#FFFFFF" font-size="10" font-weight="bold" text-anchor="middle">m</text>
            <!-- Force vectors -->
            <line x1="235" y1="135" x2="235" y2="175" stroke="#EF4444" stroke-width="2" marker-end="url(#arr-red)"/>
            <text x="242" y="170" fill="#EF4444" font-size="10" font-weight="bold">mg</text>
            <line x1="235" y1="135" x2="200" y2="152" stroke="#10B981" stroke-width="2" marker-end="url(#arr-green)"/>
            <text x="180" y="168" fill="#10B981" font-size="10" font-weight="bold">-mg sin θ</text>
            <!-- Tension -->
            <line x1="235" y1="135" x2="208" y2="80" stroke="#A855F7" stroke-width="2" marker-end="url(#arr-purple)"/>
            <text x="215" y="95" fill="#A855F7" font-size="10" font-weight="bold">Tension</text>
            <!-- Right notes -->
            <g transform="translate(320, 35)">
              <rect width="180" height="110" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
              <text x="15" y="24" fill="#38BDF8" font-size="11" font-weight="bold">การประมาณมุมเล็ก (Small-Angle)</text>
              <text x="15" y="44" fill="#F8FAFC" font-size="10">• เมื่อ θ &lt; 10°: sin θ ≈ θ (rad)</text>
              <text x="15" y="62" fill="#10B981" font-size="10">• คาบ T = 2π√(L/g)</text>
              <text x="15" y="80" fill="#F59E0B" font-size="10">• ไม่ขึ้นกับมวลลูกตุ้ม m</text>
              <text x="15" y="98" fill="#94A3B8" font-size="10">• มุมใหญ่คาบจะยาวกว่าสูตรนี้</text>
            </g>
          </svg>`,
          diagramCaption: "ลูกตุ้มอย่างง่าย: แรงคืนตัวเกิดจากองค์ประกอบของแรงโน้มถ่วงในแนวสัมผัส $F_t = -mg\\sin\\theta$ ซึ่งแปรผันตรงกับระยะกระจัดเมื่อมุมเล็ก"
        },
        observations: [
          "ทำไมมวลจึงไม่มีผลต่อคาบ: ในกฎของนิวตัน $F = ma$ เมื่อแรงคืนตัวมาจากแรงโน้มถ่วง $mg\\sin\\theta$ มวล $m$ ทั้งสองข้างจะตัดกันพอดี ทำให้ความเร่งของลูกตุ้มขึ้นอยู่กับความยาวเชือกและสนามโน้มถ่วงเท่านั้น",
          "การแกว่งที่มุมกว้าง: หากดึงลูกตุ้มขึ้นไปสูงถึง $90^\\circ$ แล้วปล่อย คาบเวลาจริงจะยาวนานกว่าที่คำนวณจากสูตร $2\\pi\\sqrt{L/g}$ ถึงประมาณ 18%"
        ],
        citation: "Young & Freedman (2020), University Physics, 15th Ed., Sec. 14.5; Morin (2008), Sec. 4.1.",
        citations: [
          {
            title: "University Physics with Modern Physics",
            authors: "Young, H. D., & Freedman, R. A.",
            source: "Pearson, 15th Edition, Chapter 14 (Periodic Motion), pp. 448–454",
            year: "2020",
            url: "https://www.pearson.com/en-us/subject-catalog/p/university-physics-with-modern-physics/P200000003318",
            verificationStatus: "verified_direct_content",
            evidencePin: "Young & Freedman (2020) Sec. 14.5 pp. 448–454: The Simple Pendulum, small-angle approximation sin θ ≈ θ, and angular frequency ω = √(g/L).",
            note: "การอนุมานสมการลูกตุ้มอย่างง่ายและขอบเขตมุมเล็ก"
          }
        ]
      },

      {
        id: 3,
        divisionId: "div-ch03-kinematics-shm",
        divisionTitle: "ภาคที่ 1: จลนศาสตร์และพลศาสตร์ฮาร์มอนิกอย่างง่าย",
        numberTh: "ทฤษฎีที่ 3",
        titleTh: "การอนุรักษ์พลังงานกลในฮาร์มอนิกอย่างง่ายและระนาบเฟส",
        titleEn: "Mechanical Energy Conservation in SHM & Phase Space Trajectories",
        type: "ทฤษฎีการอนุรักษ์ (Conservation Law)",
        summary: "ในระบบ SHM ปราศจากความหนืด พลังงานกลรวมจะอนุรักษ์อย่างสมบูรณ์ เกิดการเปลี่ยนรูปสลับกันไปมาระหว่างพลังงานจลน์และพลังงานศักย์ยืดหยุ่น โดยมีวิถีการเคลื่อนที่ในระนาบเฟสสเปซเป็นวงรีปิดคงที่",
        definition: {
          text: "พลังงานกลรวม $E$ ของระบบการสั่นแบบฮาร์มอนิกอย่างง่ายประกอบด้วยผลรวมของพลังงานจลน์ $K(t)$ และพลังงานศักย์ $U(t)$:\n$$E = K(t) + U(t) = \\frac{1}{2}m v(t)^2 + \\frac{1}{2}k x(t)^2$$\n\nเมื่อแทนสมการ $x(t) = A\\cos(\\omega_0 t + \\phi)$ และ $v(t) = -\\omega_0 A\\sin(\\omega_0 t + \\phi)$ ลงไป และใช้เอกลักษณ์ตรีโกณมิติ $\\sin^2\\theta + \\cos^2\\theta = 1$ จะพบว่า:\n$$E = \\frac{1}{2}m (\\omega_0^2 A^2 \\sin^2(\\omega_0 t + \\phi)) + \\frac{1}{2}k (A^2 \\cos^2(\\omega_0 t + \\phi)) = \\frac{1}{2}k A^2 = \\text{คงที่ตลอดเวลา}$$\nพลังงานกลรวมจึงแปรผันตรงกับกำลังสองของแอมพลิจูด ($E \\propto A^2$)"
        },
        principle: {
          text: "การถ่ายโอนพลังงานระหว่างสั่น:\n1. ที่จุดสมดุล ($x = 0$): พลังงานศักย์เป็นศูนย์ $U = 0$ พลังงานทั้งหมดกลายเป็นพลังงานจลน์สูงสุด: $E = K_{\\text{max}} = \\frac{1}{2}m v_{\\text{max}}^2$\n2. ที่จุดปลายสุด ($x = \\pm A$): วัตถุหยุดนิ่งชั่วขณะ $v = 0$ พลังงานจลน์เป็นศูนย์ พลังงานทั้งหมดกลายเป็นพลังงานศักย์สูงสุด: $E = U_{\\text{max}} = \\frac{1}{2}k A^2$\n3. ณ ตำแหน่งใดๆ $x$: ความเร็วสามารถหาได้โดยตรงจากกฎการอนุรักษ์พลังงาน:\n$$v(x) = \\pm \\omega_0 \\sqrt{A^2 - x^2}$$\n\nวิถีในระนาบเฟสสเปซ (Phase Space Trajectory):\nเมื่อพลอตกราฟระหว่างตำแหน่ง $x$ กับโมเมนตัม $p = mv$ หรือความเร็ว $v$ จะได้สมการรูปวงรี:\n$$\\frac{x^2}{A^2} + \\frac{v^2}{(\\omega_0 A)^2} = 1$$\nวงรีนี้แสดงถึงระบบอนุรักษ์ที่พลังงานไม่สูญหายและวงโคจรเฟสปิดล้อมรอบจุดสมดุลเสมอ"
        },
        formulas: [
          {
            name: "กฎการอนุรักษ์พลังงานกลรวมใน SHM",
            latex: "E = \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2 = \\frac{1}{2}kA^2 = \\frac{1}{2}mv_{\\text{max}}^2 = \\text{const}",
            symbols: [
              { sym: "E", desc: "พลังงานกลรวม", unit: "\\text{J}" },
              { sym: "K", desc: "พลังงานจลน์ (1/2 mv²)", unit: "\\text{J}" },
              { sym: "U", desc: "พลังงานศักย์ยืดหยุ่น (1/2 kx²)", unit: "\\text{J}" }
            ],
            derivationSteps: [
              "1. $K(t) = \\frac{1}{2}m v^2 = \\frac{1}{2}m [-\\omega_0 A\\sin(\\omega_0 t + \\phi)]^2 = \\frac{1}{2}m\\omega_0^2 A^2 \\sin^2(\\omega_0 t + \\phi)$",
              "2. เนื่องจาก $\\omega_0^2 = k/m \\implies m\\omega_0^2 = k$",
              "3. จะได้ $K(t) = \\frac{1}{2}k A^2 \\sin^2(\\omega_0 t + \\phi)$",
              "4. $U(t) = \\frac{1}{2}k x^2 = \\frac{1}{2}k [A\\cos(\\omega_0 t + \\phi)]^2 = \\frac{1}{2}k A^2 \\cos^2(\\omega_0 t + \\phi)$",
              "5. ผลรวม $E = K(t) + U(t) = \\frac{1}{2}kA^2 [\\sin^2(\\dots) + \\cos^2(\\dots)] = \\frac{1}{2}kA^2$"
            ]
          }
        ],
        application: {
          text: "การคำนวณความเร็วของชิ้นส่วนเครื่องยนต์ลูกสูบ, การออกแบบระบบกันสะเทือนกักเก็บพลังงาน, และการวิเคราะห์การดูดซับพลังงานกระแทกในวิศวกรรมความปลอดภัย",
          validWhen: "ใช้ได้เมื่อไม่มีแรงต้านความหนืดหรือแรงเสียดทานภายนอกทำงานบนระบบ (แรงอนุรักษ์สมบูรณ์)",
          invalidWhen: "เมื่อระบบมีการสูญเสียพลังงานในรูปความร้อน เช่น สปริงมีความร้อนสะสมจากฮิสเตอรีซิส (Mechanical Hysteresis) หรือมีแรงต้านอากาศ"
        },
        example: {
          problem: "อนุภาคมวล $m = 0.20\\text{ kg}$ สั่นแบบ SHM บนพื้นลื่นด้วยแอมพลิจูด $A = 0.10\\text{ m}$ และค่านิจสปริง $k = 80\\text{ N/m}$ จงหา: (ก) พลังงานกลรวมของระบบ $E$ (ข) ความเร็วเมื่ออนุภาคอยู่ที่ตำแหน่ง $x = 0.06\\text{ m}$ และ (ค) ตำแหน่ง $x$ ที่พลังงานจลน์มีค่าเท่ากับพลังงานศักย์พอดี ($K = U$)",
          steps: [
            "ขั้นตอนที่ 1: คำนวณพลังงานรวม $E = \\frac{1}{2}kA^2 = \\frac{1}{2}(80)(0.10)^2 = 0.5 \\times 80 \\times 0.01 = 0.40\\text{ J}$",
            "ขั้นตอนที่ 2: คำนวณ $\\omega_0 = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{80}{0.20}} = \\sqrt{400} = 20.0\\text{ rad/s}$",
            "ขั้นตอนที่ 3: คำนวณความเร็วที่ $x = 0.06\\text{ m}$ โดยใช้ $v = \\pm\\omega_0\\sqrt{A^2 - x^2}$:",
            "  $v = \\pm 20.0 \\sqrt{(0.10)^2 - (0.06)^2} = \\pm 20.0 \\sqrt{0.0100 - 0.0036} = \\pm 20.0 \\sqrt{0.0064} = \\pm 20.0 (0.08) = \\pm 1.60\\text{ m/s}$",
            "ขั้นตอนที่ 4: หาตำแหน่งที่ $K = U$: เนื่องจาก $E = K + U = 2U = 2\\left(\\frac{1}{2}kx^2\\right) = kx^2$",
            "  แต่ $E = \\frac{1}{2}kA^2 \\implies kx^2 = \\frac{1}{2}kA^2 \\implies x^2 = \\frac{A^2}{2}$",
            "  ดังนั้น $x = \\pm \\frac{A}{\\sqrt{2}} = \\pm \\frac{0.10}{1.414} \\approx \\pm 0.0707\\text{ m}$ (ประมาณ $\\pm 7.07\\text{ cm}$)"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="กราฟพลังงานเทียบตำแหน่งใน SHM">
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <!-- Coordinate Axes -->
            <line x1="40" y1="145" x2="300" y2="145" stroke="#94A3B8" stroke-width="1.5"/>
            <line x1="170" y1="20" x2="170" y2="155" stroke="#94A3B8" stroke-width="1.5"/>
            <text x="295" y="140" fill="#94A3B8" font-size="10">x</text>
            <text x="175" y="28" fill="#94A3B8" font-size="10">E, K, U</text>
            <!-- Potential Energy Parabola U = 1/2 kx^2 -->
            <path d="M 70 45 Q 170 145 270 45" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
            <!-- Kinetic Energy Parabola K = E - 1/2 kx^2 -->
            <path d="M 70 145 Q 170 45 270 145" fill="none" stroke="#EA580C" stroke-width="2.5"/>
            <!-- Total Energy Line E = const -->
            <line x1="70" y1="45" x2="270" y2="45" stroke="#10B981" stroke-width="2" stroke-dasharray="4,3"/>
            <!-- Labels -->
            <text x="70" y="160" fill="#CBD5E1" font-size="10" text-anchor="middle">-A</text>
            <text x="170" y="160" fill="#CBD5E1" font-size="10" text-anchor="middle">0</text>
            <text x="270" y="160" fill="#CBD5E1" font-size="10" text-anchor="middle">+A</text>
            <text x="280" y="42" fill="#10B981" font-size="10" font-weight="bold">E รวมคงที่</text>
            <text x="170" y="58" fill="#EA580C" font-size="10" font-weight="bold" text-anchor="middle">K สูงสุด (v_max)</text>
            <text x="170" y="135" fill="#38BDF8" font-size="10" text-anchor="middle">U = 0</text>
            <!-- Right legend card -->
            <g transform="translate(325, 30)">
              <rect width="175" height="120" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
              <text x="12" y="22" fill="#F8FAFC" font-size="11" font-weight="bold">การกระจายพลังงาน SHM</text>
              <line x1="12" y1="36" x2="32" y2="36" stroke="#10B981" stroke-width="2.5"/>
              <text x="38" y="40" fill="#10B981" font-size="10">E รวม = 1/2 kA² คงที่</text>
              <line x1="12" y1="56" x2="32" y2="56" stroke="#38BDF8" stroke-width="2.5"/>
              <text x="38" y="60" fill="#38BDF8" font-size="10">U = 1/2 kx² (ศักย์สปริง)</text>
              <line x1="12" y1="76" x2="32" y2="76" stroke="#EA580C" stroke-width="2.5"/>
              <text x="38" y="80" fill="#EA580C" font-size="10">K = 1/2 mv² (พลังงานจลน์)</text>
              <text x="12" y="104" fill="#F59E0B" font-size="9.5">K = U ที่ x = ± A/√2</text>
            </g>
          </svg>`,
          diagramCaption: "แผนภาพการกระจายพลังงานใน SHM: พลังงานศักย์ $U$ และพลังงานจลน์ $K$ ถ่ายโอนสลับกันอย่างสมบูรณ์แบบโดยมีผลรวม $E$ คงที่"
        },
        observations: [
          "ความถี่ของพลังงาน: แม้การกระจัด $x(t)$ และความเร็ว $v(t)$ จะสั่นด้วยความถี่เชิงมุม $\\omega_0$ แต่พลังงานจลน์ $K(t)$ และพลังงานศักย์ $U(t)$ จะแกว่งกวัดด้วยความถี่เป็น 2 เท่า คือ $2\\omega_0$ เพราะใน 1 รอบการสั่น วัตถุจะผ่านจุดสมดุล (พลังงานจลน์สูงสุด) ถึง 2 ครั้ง",
          "ตำแหน่งที่ K = U ไม่ใช่ครึ่งหนึ่งของแอมพลิจูด: นักเรียนมักเข้าใจผิดว่าพลังงานจลน์จะเท่ากับพลังงานศักย์ที่ $x = A/2$ แต่ความจริงเกิดขึ้นที่ $x = A/\\sqrt{2} \\approx 0.707 A$ เนื่องจากพลังงานแปรผันตามระยะทางยกกำลังสอง"
        ],
        citation: "David Tong (2005). Classical Dynamics, Cambridge University DAMTP, Sec. 2.1; Morin (2008), Sec. 4.2.",
        citations: [
          {
            title: "Lectures on Classical Dynamics",
            authors: "David Tong",
            source: "University of Cambridge DAMTP, Chapter 2 (Oscillations), pp. 25–30",
            year: "2005",
            url: "https://www.damtp.cam.ac.uk/user/tong/dynamics/two.pdf",
            verificationStatus: "verified_direct_content",
            evidencePin: "Tong (2005) Chapter 2, pp. 25–30: Energy conservation E = 1/2 m xdot² + 1/2 m ω² x² and phase space contours.",
            note: "การวิเคราะห์พลังงานกลและเส้นทางการไหลในสเปซเฟส"
          }
        ]
      },

      {
        id: 4,
        divisionId: "div-ch03-damping-resonance",
        divisionTitle: "ภาคที่ 2: การสั่นหน่วง การสั่นถูกบังคับ และการสั่นพ้อง",
        numberTh: "ทฤษฎีที่ 4",
        titleTh: "การแกว่งกวัดแบบมีความหน่วงทั้งสามสภาวะ",
        titleEn: "Damped Harmonic Oscillations: Underdamped, Critical & Overdamped",
        type: "ทฤษฎีพลศาสตร์ชั้นสูง (Advanced Dynamics Theory)",
        summary: "เมื่อมีแรงต้านความหนืดเชิงเส้น $F_d = -b v$ เข้ามาเกี่ยวข้อง พลังงานกลจะสูญเสียออกจากระบบอย่างต่อเนื่อง สมการอนุพันธ์จะนำไปสู่ 3 สภาวะที่แตกต่างกันอย่างสิ้นเชิงตามอัตราส่วนการหน่วง",
        definition: {
          text: "ในโลกแห่งความเป็นจริง ระบบการสั่นจะมีแรงต้านทานการเคลื่อนที่เสมอ เช่น ความหนืดของอากาศหรือของเหลว โดยแรงต้านความเร็วต่ำมักแปรผันตรงกับความเร็ว: $F_d = -b v = -b\\frac{dx}{dt}$ สมการการเคลื่อนที่ของนิวตันจึงกลายเป็น:\n$$m\\frac{d^2x}{dt^2} + b\\frac{dx}{dt} + kx = 0 \\implies \\frac{d^2x}{dt^2} + 2\\gamma\\frac{dx}{dt} + \\omega_0^2 x = 0$$\nโดย $\\gamma = \\frac{b}{2m}$ คือสัมประสิทธิ์การหน่วง (Damping factor) และ $\\omega_0 = \\sqrt{\\frac{k}{m}}$"
        },
        principle: {
          text: "เมื่อแก้สมการลักษณะเฉพาะ $r^2 + 2\\gamma r + \\omega_0^2 = 0$ จะได้ราก $r = -\\gamma \\pm \\sqrt{\\gamma^2 - \\omega_0^2}$ ซึ่งจำแนกออกเป็น 3 สภาวะเด็ดขาด:\n\n1. สภาวะหน่วงน้อย / สั่นหน่วง (Underdamped: $\\gamma < \\omega_0$):\nระบบยังคงแกว่งกวัดกลับไปกลับมาได้ แต่แอมพลิจูดจะลดลงแบบเอ็กซ์โพเนนเชียล:\n$$x(t) = A_0 e^{-\\gamma t}\\cos(\\omega_d t + \\phi)$$\nโดยความถี่เชิงมุมของการสั่นหน่วง $\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2}$ จะมีค่าน้อยกว่าความถี่ธรรมชาติ $\\omega_0$ เสมอ\n\n2. สภาวะหน่วงวิกฤต (Critically Damped: $\\gamma = \\omega_0$):\nระบบจะไม่แกว่งกวัดเลยแม้แต่รอบเดียว และจะกลับคืนสู่ตำแหน่งสมดุลได้เร็วที่สุดโดยไม่มีการกระดอนข้ามสมดุล:\n$$x(t) = (C_1 + C_2 t) e^{-\\gamma t}$$\nเป็นสภาวะอุดมคติสำหรับการออกแบบโช้กอัพรถยนต์ ประตูปิดอัตโนมัติ และเข็มกัลวาโนมิเตอร์\n\n3. สภาวะหน่วงมาก / หน่วงเกิน (Overdamped: $\\gamma > \\omega_0$):\nระบบมีความหนืดสูงมาก ไม่มีการแกว่งกวัด และเคลื่อนที่กลับเข้าสู่จุดสมดุลอย่างเชื่องช้ามาก (Sluggish return) เนื่องจากแรงต้านความหนืดหน่วงการเคลื่อนที่ไว้ตลอดเวลา"
        },
        formulas: [
          {
            name: "สมการอนุพันธ์ของการสั่นแบบมีความหน่วงและความถี่ของการสั่นหน่วง",
            latex: "\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = 0,\\quad \\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2}\\quad (\\gamma = \\frac{b}{2m})",
            symbols: [
              { sym: "b", desc: "สัมประสิทธิ์ความหนืดต้านทาน", unit: "\\text{N}\\cdot\\text{s/m}" },
              { sym: "\\gamma", desc: "ค่าคงตัวการหน่วง (Damping parameter)", unit: "\\text{s}^{-1}" },
              { sym: "\\omega_d", desc: "ความถี่เชิงมุมของการสั่นหน่วง", unit: "\\text{rad/s}" }
            ],
            derivationSteps: [
              "1. กฎของนิวตัน: $m\\ddot{x} = -kx - b\\dot{x} \\implies m\\ddot{x} + b\\dot{x} + kx = 0$",
              "2. หารด้วยมวล m: $\\ddot{x} + \\frac{b}{m}\\dot{x} + \\frac{k}{m}x = 0$",
              "3. นิยาม $\\gamma = \\frac{b}{2m}$ และ $\\omega_0^2 = \\frac{k}{m}$ จะได้: $\\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = 0$",
              "4. แทนผลเฉลย $x(t) = e^{rt}$ จะได้สมการช่วย: $r^2 + 2\\gamma r + \\omega_0^2 = 0$",
              "5. สูตรกำลังสอง: $r = -\\gamma \\pm \\sqrt{\\gamma^2 - \\omega_0^2}$",
              "6. กรณี $\\gamma < \\omega_0$: $r = -\\gamma \\pm i\\sqrt{\\omega_0^2 - \\gamma^2} = -\\gamma \\pm i\\omega_d$",
              "7. ผลเฉลยจริง: $x(t) = A_0 e^{-\\gamma t}\\cos(\\omega_d t + \\phi)$"
            ]
          }
        ],
        application: {
          text: "การออกแบบระบบรองรับแรงกระแทกของล้อรถยนต์ (Automotive Shock Absorber / Struts), โครงสร้างโช้กอัพไฮดรอลิกในฐานรากอาคารต้านแผ่นดินไหว, สปริงโช้กปิดประตูบ้าน (Door Closer), และมาตรวัดหน้าปัดอะนาล็อก",
          validWhen: "ใช้ได้เมื่อแรงต้านเป็นสัดส่วนเชิงเส้นกับความเร็ว ($F_d \\propto -v$) ซึ่งเป็นจริงในของเหลวที่มีความหนืดสูงหรือที่เลขเรย์โนลด์ต่ำ ($Re \\ll 1$)",
          invalidWhen: "เมื่อความเร็วสูงจนแรงต้านอากาศกลายเป็นกำลังสอง ($F_d \\propto -v^2$) หรือเกิดการเสียดทานแบบคูลอมบ์ (Dry friction/Coulomb damping) ที่มีขนาดแรงคงที่"
        },
        example: {
          problem: "ระบบมวล-สปริง $m = 1.0\\text{ kg}$ มีค่านิจสปริง $k = 100\\text{ N/m}$ และสัมประสิทธิ์แรงต้าน $b = 4.0\\text{ N}\\cdot\\text{s/m}$ จงหา: (ก) ระบบนี้อยู่ในสภาวะการหน่วงแบบใด (ข) ความถี่ธรรมชาติ $\\omega_0$ และความถี่การสั่นหน่วง $\\omega_d$ และ (ค) ต้องปรับค่า $b$ ให้เป็นเท่าใดจึงจะเกิด 'การหน่วงวิกฤต' (Critical Damping)",
          steps: [
            "ขั้นตอนที่ 1: คำนวณ $\\omega_0 = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{100}{1.0}} = 10.0\\text{ rad/s}$",
            "ขั้นตอนที่ 2: คำนวณ $\\gamma = \\frac{b}{2m} = \\frac{4.0}{2(1.0)} = 2.0\\text{ s}^{-1}$",
            "ขั้นตอนที่ 3: เปรียบเทียบ $\\gamma$ กับ $\\omega_0$: เนื่องจาก $\\gamma = 2.0 < \\omega_0 = 10.0$ ระบบจึงเป็น 'Underdamped' (การสั่นหน่วง)",
            "ขั้นตอนที่ 4: คำนวณความถี่การสั่นหน่วง $\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2} = \\sqrt{10.0^2 - 2.0^2} = \\sqrt{100 - 4} = \\sqrt{96} \\approx 9.798\\text{ rad/s}$",
            "ขั้นตอนที่ 5: หาค่า $b$ สำหรับการหน่วงวิกฤต (Critical Damping: $\\gamma = \\omega_0$):",
            "  $\\frac{b_{\\text{crit}}}{2m} = \\omega_0 \\implies b_{\\text{crit}} = 2m\\omega_0 = 2(1.0)(10.0) = 20.0\\text{ N}\\cdot\\text{s/m}$"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="กราฟเปรียบเทียบการสั่นหน่วง 3 สภาวะ">
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <line x1="40" y1="90" x2="330" y2="90" stroke="#64748B" stroke-width="1.5"/>
            <line x1="50" y1="20" x2="50" y2="160" stroke="#64748B" stroke-width="1.5"/>
            <text x="325" y="85" fill="#94A3B8" font-size="10">เวลา t</text>
            <text x="55" y="28" fill="#94A3B8" font-size="10">การกระจัด x(t)</text>
            <!-- Underdamped Oscillation Curve (Cyan) -->
            <path d="M 50 30 Q 75 35 90 70 Q 115 130 140 100 Q 165 75 190 95 Q 215 105 240 90 Q 270 85 310 90" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
            <!-- Exponential Envelope -->
            <path d="M 50 30 Q 150 75 310 88" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3,3"/>
            <text x="180" y="50" fill="#94A3B8" font-size="9">e^(-γt)</text>
            <!-- Critically Damped Curve (Green) -->
            <path d="M 50 30 Q 75 75 120 88 Q 160 90 310 90" fill="none" stroke="#10B981" stroke-width="2.5"/>
            <!-- Overdamped Curve (Orange) -->
            <path d="M 50 30 Q 110 50 170 70 Q 240 85 310 89" fill="none" stroke="#F59E0B" stroke-width="2.5"/>
            <!-- Right Legend Box -->
            <g transform="translate(345, 25)">
              <rect width="160" height="130" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
              <text x="12" y="22" fill="#F8FAFC" font-size="11" font-weight="bold">3 สภาวะการหน่วง</text>
              <line x1="12" y1="38" x2="32" y2="38" stroke="#38BDF8" stroke-width="2.5"/>
              <text x="38" y="42" fill="#38BDF8" font-size="10">Underdamped (สั่นลดทอน)</text>
              <line x1="12" y1="60" x2="32" y2="60" stroke="#10B981" stroke-width="2.5"/>
              <text x="38" y="64" fill="#10B981" font-size="10">Critical (กลับสมดุลไวสุด)</text>
              <line x1="12" y1="82" x2="32" y2="82" stroke="#F59E0B" stroke-width="2.5"/>
              <text x="38" y="86" fill="#F59E0B" font-size="10">Overdamped (หน่วงช้า)</text>
              <text x="12" y="112" fill="#CBD5E1" font-size="9">โช้กอัพรถยนต์ = Critical</text>
            </g>
          </svg>`,
          diagramCaption: "การเปรียบเทียบการสั่นหน่วง 3 สภาวะ: หน่วงน้อย (ฟ้า) ยังคงสั่นข้ามสมดุล, หน่วงวิกฤต (เขียว) คืนสู่สมดุลเร็วที่สุด, และหน่วงเกิน (ส้ม) กลับคืนอย่างเชื่องช้า"
        },
        observations: [
          "ทำไมโช้กอัพรถยนต์จึงต้องเป็น Critical Damping: หากหน่วงน้อยไป (Underdamped) เมื่อรถตกหลุม ล้อจะกระเด้งกระดอนซ้ำๆ ทำให้ทรงตัวยากและเมารถ แต่ถ้าหน่วงมากเกินไป (Overdamped) โช้กจะคืนตัวช้าเกินไปจนรับแรงกระแทกจากหลุมถัดไปไม่ทัน ดังนั้นการหน่วงวิกฤตจึงเป็นจุดสมดุลที่ดีที่สุด",
          "ความถี่ของการสั่นหน่วงจะต่ำกว่าความถี่ธรรมชาติเสมอ: เนื่องจากแรงต้านความหนืดช่วยหน่วงการเคลื่อนที่ ทำให้ $\\omega_d = \\sqrt{\\omega_0^2 - \\gamma^2} < \\omega_0$ ส่งผลให้คาบการแกว่งของการสั่นหน่วงยาวนานกว่าการสั่นปกติเล็กน้อย"
        ],
        citation: "David Morin (2008), Classical Mechanics, Sec. 4.3; French, A. P. (1971), Vibrations and Waves, Ch. 3.",
        citations: [
          {
            title: "Vibrations and Waves (M.I.T. Introductory Physics Series)",
            authors: "French, A. P.",
            source: "W. W. Norton & Company, Chapter 3 (Free Vibrations of Physical Systems), pp. 59–76",
            year: "1971",
            url: "https://archive.org/details/vibrationswaves0000fren",
            verificationStatus: "verified_direct_content",
            evidencePin: "French (1971) Chapter 3, pp. 62–71: Damped oscillations, critical damping parameter b_crit = 2√(km), and logarithmic decrement.",
            note: "ตำราคลาสสิกของ MIT ว่าด้วยการสั่นหน่วงทั้งสามรูปแบบ"
          }
        ]
      },

      {
        id: 5,
        divisionId: "div-ch03-damping-resonance",
        divisionTitle: "ภาคที่ 2: การสั่นหน่วง การสั่นถูกบังคับ และการสั่นพ้อง",
        numberTh: "ทฤษฎีที่ 5",
        titleTh: "การแกว่งกวัดถูกบังคับ การสั่นพ้อง และค่าประกอบคุณภาพ",
        titleEn: "Driven Oscillations, Amplitude Resonance & Quality Factor (Q)",
        type: "ทฤษฎีปรากฏการณ์และการประยุกต์วิศวกรรม (Engineering Application & Resonance)",
        summary: "เมื่อระบบที่สั่นถูกกระตุ้นอย่างต่อเนื่องด้วยแรงภายนอกรูปไซน์ $F(t) = F_0\\cos(\\omega t)$ แอมพลิจูดการสั่นจะพุ่งขึ้นสู่จุดสูงสุดอย่างมหาศาลเมื่อความถี่กระตุ้นใกล้เคียงกับความถี่ธรรมชาติ เรียกว่า การสั่นพ้อง (Resonance)",
        definition: {
          text: "การสั่นถูกบังคับ (Driven / Forced Oscillation) คือ การเคลื่อนที่ของระบบที่มีแรงภายนอกซึ่งแปรผันตามเวลาแบบพีริออดิกมากระทำอย่างต่อเนื่อง: $F(t) = F_0\\cos(\\omega t)$ โดย $\\omega$ คือความถี่เชิงมุมของแรงขับภายนอก\n\nสมการการเคลื่อนที่เต็มรูปแบบคือ:\n$$m\\frac{d^2x}{dt^2} + b\\frac{dx}{dt} + kx = F_0\\cos(\\omega t) \\implies \\ddot{x} + 2\\gamma\\dot{x} + \\omega_0^2 x = \\frac{F_0}{m}\\cos(\\omega t)$$\n\nเมื่อปล่อยให้เวลาผ่านไปนานพอ ผลเฉลยชั่วครู่ (Transient solution) จะสลายตัวหมดไป เหลือเฉพาะ 'ผลเฉลยสถานะคงตัว' (Steady-state solution) ที่สั่นด้วยความถี่ของแรงขับ $\\omega$:\n$$x_{\\text{steady}}(t) = A(\\omega)\\cos(\\omega t - \\delta)$$"
        },
        principle: {
          text: "แอมพลิจูดในสถานะคงตัวแปรผันตามความถี่ของแรงขับภายนอก $\\omega$ ตามสมการ:\n$$A(\\omega) = \\frac{F_0 / m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\gamma^2\\omega^2}}$$\n\nปรากฏการณ์การสั่นพ้อง (Resonance):\n1. ความถี่สั่นพ้องของแอมพลิจูด (Resonance Frequency): เกิดขึ้นเมื่อตัวส่วนมีค่าน้อยที่สุด คือที่ความถี่:\n$$\\omega_{\\text{res}} = \\sqrt{\\omega_0^2 - 2\\gamma^2}$$\nหากความหนืดน้อยมาก ($\\gamma \\ll \\omega_0$) จะได้ $\\omega_{\\text{res}} \\approx \\omega_0$\n\n2. ขนาดแอมพลิจูดสูงสุดที่จุดสั่นพ้อง: มีค่าสูงมากถึง $A_{\\text{max}} \\approx \\frac{F_0}{2m\\gamma\\omega_0} = \\frac{F_0}{b\\omega_0}$\n\n3. ค่าประกอบคุณภาพ (Quality Factor: Q):\nนิยามจากอัตราส่วนพลังงานที่สะสมไว้เทียบกับพลังงานที่สูญเสียไปต่อเรเดียน หรือวัดความคมชัดของแถบตอบสนองการสั่นพ้อง:\n$$Q = \\frac{\\omega_0}{2\\gamma} = \\frac{\\sqrt{mk}}{b} = \\frac{\\omega_0}{\\Delta\\omega}$$\n• ค่า $Q$ สูง (ความหนืดต่ำ): พีคการสั่นพ้องจะแคบ ชัน และสูงมาก เช่น คริสตัลควอตซ์ ($Q > 10^5$) ส้อมเสียง ($Q \\approx 10^3$)\n• ค่า $Q$ ต่ำ (ความหนืดสูง): พีคการสั่นพ้องจะป้านและเตี้ย"
        },
        formulas: [
          {
            name: "แอมพลิจูดของการสั่นพ้องและค่าประกอบคุณภาพ Q",
            latex: "A(\\omega) = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\gamma^2\\omega^2}},\\quad Q = \\frac{\\omega_0}{2\\gamma} = \\frac{\\omega_0}{\\Delta\\omega}",
            symbols: [
              { sym: "F_0", desc: "ขนาดสูงสุดของแรงกระตุ้นภายนอก", unit: "\\text{N}" },
              { sym: "\\omega", desc: "ความถี่เชิงมุมของแรงขับภายนอก", unit: "\\text{rad/s}" },
              { sym: "Q", desc: "ค่าประกอบคุณภาพ (Quality Factor)", unit: "—" },
              { sym: "\\Delta\\omega", desc: "ความกว้างแถบตอบสนองครึ่งกำลัง (FWHM Bandwidth)", unit: "\\text{rad/s}" }
            ],
            derivationSteps: [
              "1. แปลงเป็นจำนวนเชิงซ้อน: $\\ddot{z} + 2\\gamma\\dot{z} + \\omega_0^2 z = \\frac{F_0}{m} e^{i\\omega t}$",
              "2. เสนอผลเฉลยคงตัว: $z(t) = Z_0 e^{i\\omega t}$",
              "3. แทนค่า: $(-\\omega^2 + 2i\\gamma\\omega + \\omega_0^2) Z_0 e^{i\\omega t} = \\frac{F_0}{m} e^{i\\omega t}$",
              "4. ดึงตัวประกอบ: $Z_0 = \\frac{F_0/m}{(\\omega_0^2 - \\omega^2) + 2i\\gamma\\omega}$",
              "5. หาขนาดแอมพลิจูด $A(\\omega) = |Z_0| = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\gamma^2\\omega^2}}$",
              "6. หาค่ามุมเฟสล้าหลัง $\\delta = \\arctan\\left(\\frac{2\\gamma\\omega}{\\omega_0^2 - \\omega^2}\\right)$"
            ]
          }
        ],
        application: {
          text: "วงจรรับสัญญาณวิทยุ RLC (Tuning Circuit), การตรวจวินิจฉัยด้วยคลื่นสะท้อนในสนามแม่เหล็ก (Magnetic Resonance Imaging: MRI), การปรับแต่งลูกตุ้มถ่วงสมดุลต้านลมในตึกไทเป 101 (TMD Resonance), และการออกแบบเครื่องกำเนิดเสียงดนตรี",
          validWhen: "ใช้ได้เมื่อแรงขับเป็นรูปไซน์คงที่สม่ำเสมอและระบบอยู่ในสถานะคงตัว (Steady-State)",
          invalidWhen: "เมื่อแอมพลิจูดที่จุดเรโซแนนซ์สูงจนโครงสร้างแตกหักพังทลาย หรือเกิดการสั่นพ้องเชิงแอโรอิลาสติกแบบไม่เชิงเส้น (Aeroelastic Flutter เช่น สะพานทาโคมาแนร์โรวส์)"
        },
        example: {
          problem: "ลำโพงอัลตราโซนิกมีมวลของแผ่นสั่น $m = 0.050\\text{ kg}$ ค่านิจสปริง $k = 20,000\\text{ N/m}$ และสัมประสิทธิ์แรงต้าน $b = 1.0\\text{ N}\\cdot\\text{s/m}$ ได้รับแรงขับ $F_0 = 10.0\\text{ N}$ จงหา: (ก) ความถี่ธรรมชาติ $\\omega_0$ (ข) ค่าประกอบคุณภาพ $Q$ และ (ค) แอมพลิจูดการสั่นเมื่อเกิดการสั่นพ้อง $\\omega \\approx \\omega_0$",
          steps: [
            "ขั้นตอนที่ 1: คำนวณความถี่ธรรมชาติ $\\omega_0 = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{20,000}{0.050}} = \\sqrt{400,000} \\approx 632.46\\text{ rad/s}$ ($f_0 \\approx 100.66\\text{ Hz}$)",
            "ขั้นตอนที่ 2: คำนวณ $\\gamma = \\frac{b}{2m} = \\frac{1.0}{2(0.050)} = 10.0\\text{ s}^{-1}$",
            "ขั้นตอนที่ 3: คำนวณค่าประกอบคุณภาพ $Q = \\frac{\\omega_0}{2\\gamma} = \\frac{632.46}{2(10.0)} = \\frac{632.46}{20.0} \\approx 31.62$",
            "ขั้นตอนที่ 4: คำนวณแอมพลิจูดที่จุดสั่นพ้อง $\\omega = \\omega_0$:",
            "  $A_{\\text{res}} = \\frac{F_0 / m}{2\\gamma\\omega_0} = \\frac{10.0 / 0.050}{2(10.0)(632.46)} = \\frac{200}{12,649.2} \\approx 0.0158\\text{ m} = 15.8\\text{ mm}$"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="กราฟการสั่นพ้อง Resonance Curve">
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <line x1="40" y1="150" x2="320" y2="150" stroke="#64748B" stroke-width="1.5"/>
            <line x1="50" y1="20" x2="50" y2="155" stroke="#64748B" stroke-width="1.5"/>
            <text x="315" y="145" fill="#94A3B8" font-size="10">ความถี่แรงขับ ω</text>
            <text x="55" y="28" fill="#94A3B8" font-size="10">แอมพลิจูด A(ω)</text>
            <!-- High Q Resonance Curve (Cyan - Sharp Peak) -->
            <path d="M 60 145 Q 150 140 170 110 Q 180 30 185 25 Q 190 30 200 110 Q 220 140 310 145" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
            <!-- Medium Q Resonance Curve (Green) -->
            <path d="M 60 145 Q 140 135 170 105 Q 185 65 200 105 Q 230 135 310 145" fill="none" stroke="#10B981" stroke-width="2"/>
            <!-- Low Q Resonance Curve (Orange - Broad Flat) -->
            <path d="M 60 145 Q 150 130 185 100 Q 220 130 310 145" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
            <!-- ω0 Vertical guide -->
            <line x1="185" y1="20" x2="185" y2="150" stroke="#EF4444" stroke-width="1" stroke-dasharray="3,3"/>
            <text x="185" y="162" fill="#EF4444" font-size="10" font-weight="bold" text-anchor="middle">ω = ω₀</text>
            <!-- Right notes card -->
            <g transform="translate(335, 30)">
              <rect width="170" height="120" rx="6" fill="#1E293B" stroke="#475569" stroke-width="1"/>
              <text x="12" y="22" fill="#F8FAFC" font-size="11" font-weight="bold">กราฟการสั่นพ้อง (Resonance)</text>
              <line x1="12" y1="38" x2="30" y2="38" stroke="#38BDF8" stroke-width="2.5"/>
              <text x="36" y="42" fill="#38BDF8" font-size="10">Q สูง: พีคแคบ ชัน แอมพลิจูดสูง</text>
              <line x1="12" y1="58" x2="30" y2="58" stroke="#10B981" stroke-width="2"/>
              <text x="36" y="62" fill="#10B981" font-size="10">Q ปานกลาง: ตอบสนองปกติ</text>
              <line x1="12" y1="78" x2="30" y2="78" stroke="#F59E0B" stroke-width="1.5"/>
              <text x="36" y="82" fill="#F59E0B" font-size="10">Q ต่ำ: ความหนืดสูง พีคป้าน</text>
              <text x="12" y="106" fill="#CBD5E1" font-size="9">Q = ω₀ / Δω = พลังงานสะสม/สูญเสีย</text>
            </g>
          </svg>`,
          diagramCaption: "กราฟการตอบสนองความถี่ของการสั่นพ้อง: เมื่อความหนืดต่ำ ($Q$ สูง) การสั่นพ้องจะให้แอมพลิจูดขยายตัวมหาศาล ณ ความถี่ธรรมชาติ $\\omega_0$"
        },
        observations: [
          "ความเข้าใจผิดเรื่องสะพานทาโคมา: ตำราเรียนระดับมัธยมมักอ้างว่าสะพานทาโคมาแนร์โรวส์พังทลายเพราะการสั่นพ้องจากแรงลมปกติ แต่การวิจัยสมัยใหม่ (Billah & Scanlan 1991) พิสูจน์แล้วว่าเกิดจากปรากฏการณ์ความไม่เสถียรทางอากาศพลศาสตร์ที่เรียกว่า Aeroelastic Flutter ไม่ใช่การสั่นพ้องเชิงเส้นแบบง่าย",
          "เฟสที่จุดเรโซแนนซ์: เมื่อความถี่แรงขับเท่ากับความถี่ธรรมชาติพอดี ($\\omega = \\omega_0$) มุมเฟสล้าหลัง $\\delta$ จะเท่ากับ $90^\\circ$ ($\\pi/2$) พอดี ซึ่งหมายความว่าแรงขับจะอยู่ในทิศทางเดียวกับความเร็ว $v$ ตลอดเวลา ส่งผลให้งานที่แรงขับทำต่อระบบมีค่าเป็นบวกสูงสุดเสมอ"
        ],
        citation: "David Morin (2008), Classical Mechanics, Sec. 4.4; Billah & Scanlan (1991), Am. J. Phys. 59, 118.",
        citations: [
          {
            title: "Resonance, flutter and the Tacoma Narrows bridge failure",
            authors: "Billah, K. Y., & Scanlan, R. H.",
            source: "American Journal of Physics, Vol. 59, No. 2, pp. 118–124",
            year: "1991",
            url: "https://doi.org/10.1119/1.16590",
            verificationStatus: "verified_direct_content",
            evidencePin: "Billah & Scanlan (1991) pp. 118–124: Distinction between linear forced resonance and single-degree-of-freedom torsional flutter.",
            note: "งานวิจัยหักล้างความเข้าใจผิดเรื่องการสั่นพ้องของสะพานทาโคมา"
          }
        ]
      }
    ],

    phenomena: [
      {
        id: "PHE-CH03-01",
        chapterId: "ch03",
        division: "ภาคที่ 2: การสั่นหน่วง การสั่นถูกบังคับ และการสั่นพ้อง",
        category: "วิศวกรรมโยธาและพลศาสตร์โครงสร้าง (Civil & Structural Dynamics)",
        titleTh: "การพังทลายของสะพานทาโคมาแนร์โรวส์และแอโรอิลาสติกแฟลตเตอร์",
        titleEn: "Tacoma Narrows Bridge Collapse & Aeroelastic Flutter Instability",
        relatedTheoryId: "theory-5",
        relatedTheoryTitle: "ทฤษฎีที่ 5: การแกว่งกวัดถูกบังคับและการสั่นพ้อง",
        relatedSimulator: "oscillation",
        relatedSimSubmode: "damping_resonance",
        observed: "ในวันที่ 7 พฤศจิกายน 1940 สะพานแขวนทาโคมาแนร์โรวส์ในรัฐวอชิงตันแกว่งบิดตัวอย่างรุนแรง (Torsional oscillation) ภายใต้กระแสลมความเร็วเพียง 68 km/h จนกระทั่งโครงสร้างสะพานฉีกขาดและพังทลายลงสู่แม่น้ำเบื้องล่าง",
        mechanism: "แม้ตำราฟิสิกส์เบื้องต้นจะระบุว่าเกิดจากการสั่นพ้องของวอร์เทกซ์ (Vortex shedding resonance) แต่งานวิจัยหลักฐานทางวิศวกรรมลมของ Billah & Scanlan (1991) พิสูจน์ว่าเกิดจาก 'แอโรอิลาสติกทอร์ชันนัลแฟลตเตอร์' (Aeroelastic Torsional Flutter) ซึ่งเป็นความไม่เสถียรที่เกิดจากแรงกระทำของลมสร้างแรงยกเชิงลบที่เหนี่ยวนำให้โครงสร้างบิดตัว และการบิดตัวนั้นยิ่งเปลี่ยนมุมปะทะของลมให้สร้างแรงบิดเสริมกำลังตนเอง (Self-excited oscillation) ป้อนพลังงานเข้าสู่โหมดการบิดเร็วกว่าที่การหน่วงของโครงสร้างจะสลายพลังงานได้ จนแอมพลิจูดพุ่งขึ้นสู่จุดวิบัติ",
        scope: "การออกแบบสะพานแขวนขนาดใหญ่ อาคารสูงระฟ้า และปีกเครื่องบินตามมาตรฐานทางวิศวกรรมลม (Wind Engineering & ASCE 7)",
        formulas: [
          {
            latex: "I\\frac{d^2\\theta}{dt^2} + (2I\\gamma_{\\text{struct}} - M_{\\text{aero}})\\frac{d\\theta}{dt} + K_\\theta\\theta = 0",
            desc: "สมการการเคลื่อนที่การบิดตัวของสะพานที่มีแดมปิงอากาศพลศาสตร์เชิงลบ (-M_aero)"
          },
          {
            latex: "\\gamma_{\\text{net}} = \\gamma_{\\text{struct}} - \\frac{M_{\\text{aero}}}{2I} < 0 \\implies \\text{แอมพลิจูดขยายตัวแบบเอ็กซ์โพเนนเชียล}",
            desc: "เงื่อนไขการเกิดแฟลตเตอร์เมื่อการหน่วงรวมติดลบ"
          }
        ],
        variables: [
          { symbol: "I", name: "โมเมนต์ความเฉื่อยเชิงมวลต่อความยาวของสะพาน", unit: "kg·m²", typical: "1.2 × 10⁶ kg·m²" },
          { symbol: "\\theta", name: "มุมบิดตัวของพื้นสะพาน", unit: "rad หรือ deg", typical: "บิดสูงถึง 45° ก่อนพัง" },
          { symbol: "M_{\\text{aero}}", name: "สัมประสิทธิ์แรงบิดเหนี่ยวนำจากกระแสลม", unit: "N·m·s/rad", typical: "แปรผันตามความเร็วลม V" }
        ],
        svgDiagram: `<svg viewBox="0 0 420 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:8px;">
          <!-- Left support tower -->
          <rect x="50" y="40" width="16" height="140" fill="#475569"/>
          <!-- Right support tower -->
          <rect x="350" y="40" width="16" height="140" fill="#475569"/>
          <!-- Suspension cables -->
          <path d="M 58 45 Q 200 130 358 45" fill="none" stroke="#94A3B8" stroke-width="2"/>
          <!-- Twisting bridge deck -->
          <g transform="translate(200, 115) rotate(18)">
            <rect x="-110" y="-8" width="220" height="16" rx="3" fill="#EA580C" stroke="#F97316" stroke-width="2"/>
            <circle cx="-90" cy="0" r="4" fill="#38BDF8"/>
            <circle cx="90" cy="0" r="4" fill="#38BDF8"/>
            <!-- Torsional arrows -->
            <path d="M -70 -25 A 30 30 0 0 1 -40 -15" fill="none" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-yellow)"/>
            <path d="M 70 25 A 30 30 0 0 1 40 15" fill="none" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-yellow)"/>
          </g>
          <!-- Wind arrows -->
          <line x1="20" y1="95" x2="65" y2="95" stroke="#38BDF8" stroke-width="2" marker-end="url(#arr-cyan)"/>
          <line x1="20" y1="115" x2="65" y2="115" stroke="#38BDF8" stroke-width="2" marker-end="url(#arr-cyan)"/>
          <line x1="20" y1="135" x2="65" y2="135" stroke="#38BDF8" stroke-width="2" marker-end="url(#arr-cyan)"/>
          <text x="25" y="85" fill="#38BDF8" font-size="9" font-weight="bold">ลมพัดขวาง 68 km/h</text>
          <text x="200" y="175" fill="#EF4444" font-size="10" font-weight="bold" text-anchor="middle">Aeroelastic Torsional Flutter (บิดสลับจนขาด)</text>
        </svg>`,
        citations: [
          {
            title: "Resonance, flutter and the Tacoma Narrows bridge failure",
            authors: "Billah, K. Y., & Scanlan, R. H.",
            source: "American Journal of Physics, Vol. 59, No. 2, pp. 118–124",
            year: "1991",
            url: "https://doi.org/10.1119/1.16590",
            verificationStatus: "verified_direct_content",
            evidencePin: "Billah & Scanlan (1991) pp. 118–124: Rejection of forced linear vortex resonance in favor of self-excited torsional aeroelastic flutter.",
            note: "งานวิจัยหลักฐานฟิสิกส์และวิศวกรรมลมสะพานทาโคมา"
          }
        ],
        engineeringNote: "ผลจากโศกนาฏกรรมสะพานทาโคมา ทำให้สะพานแขวนยุคใหม่ (เช่น สะพานอากาชิไคเคียวในญี่ปุ่น หรือสะพานฮัมเบอร์ในอังกฤษ) ต้องเปลี่ยนโครงสร้างพื้นสะพานทึบรูปตัว H ให้เป็น 'โครงถักโปร่งลม' (Open truss) หรือ 'ปีกเครื่องบินทรงตัดลม' (Aerodynamic hollow box girder) เพื่อป้องกันไม่ให้เกิดแรงยกและแรงบิดจากการไหลวนของลม"
      },

      {
        id: "PHE-CH03-02",
        chapterId: "ch03",
        division: "ภาคที่ 2: การสั่นหน่วง การสั่นถูกบังคับ และการสั่นพ้อง",
        category: "วิศวกรรมยานยนต์และระบบรองรับน้ำหนัก (Automotive & Suspension Engineering)",
        titleTh: "ระบบโช้กอัพรถยนต์และการสั่นหน่วงวิกฤต",
        titleEn: "Automotive Shock Absorbers & Critical Damping for Ride Comfort",
        relatedTheoryId: "theory-4",
        relatedTheoryTitle: "ทฤษฎีที่ 4: การแกว่งกวัดแบบมีความหน่วงทั้งสามสภาวะ",
        relatedSimulator: "oscillation",
        relatedSimSubmode: "damping_resonance",
        observed: "เมื่อรถยนต์วิ่งตกหลุมบนถนน ขบวนรถจะยุบตัวลงแล้วคืนสภาพกลับสู่ความสูงปกติอย่างนุ่มนวลในเวลาไม่ถึงครึ่งวินาที โดยไม่มีอาการเด้งกระดอนซ้ำไปซ้ำมา",
        mechanism: "ระบบช่วงล่างประกอบด้วยสปริงขด (Coil spring) ทำหน้าที่รับแรงกระแทกและกักเก็บพลังงานศักย์ยืดหยุ่น ทำงานร่วมกับ 'โช้กอัพไฮดรอลิก' (Hydraulic Shock Absorber) ที่บรรจุน้ำมันและลูกสูบมีรูระบาย (Orifices) เมื่อสปริงยุบตัว ลูกสูบจะดันน้ำมันผ่านรูเล็กๆ เปลี่ยนพลังงานจลน์ของการสั่นให้กลายเป็นพลังงานความร้อนในน้ำมันอย่างรวดเร็ว วิศวกรออกแบบให้อัตราส่วนการหน่วงมีค่าใกล้เคียงกับการหน่วงวิกฤต ($\\zeta = \\gamma / \\omega_0 \\approx 0.7 – 1.0$) ทำให้ห้องโดยสารคืนตัวสู่สมดุลเร็วที่สุดโดยไม่เกิดการสั่นสะเทือนต่อเนื่อง",
        scope: "ระบบรองรับน้ำหนักยานยนต์ (McPherson Strut, Double Wishbone, Multi-link) และมาตรฐานความสบายในการขับขี่ ISO 2631",
        formulas: [
          {
            latex: "\\zeta = \\frac{b}{2\\sqrt{km}} = \\frac{\\gamma}{\\omega_0} \\approx 0.707",
            desc: "อัตราส่วนการหน่วงอุดมคติของรถยนต์ (Optimized Damping Ratio)"
          },
          {
            latex: "F_{\\text{damper}} = -b \\cdot v_{\\text{suspension}} = -b\\frac{dx}{dt}",
            desc: "แรงต้านทานไฮดรอลิกแปรผันตามอัตราเร็วการยุบตัวของกระบอกสูบ"
          }
        ],
        variables: [
          { symbol: "\\zeta", name: "อัตราส่วนการหน่วง (Damping Ratio)", unit: "—", typical: "0.6 – 0.8 (รถบ้าน), 1.0 (สปอร์ต)" },
          { symbol: "k", name: "ค่านิจสปริงช่วงล่าง", unit: "N/m", typical: "25,000 – 45,000 N/m" },
          { symbol: "b", name: "สัมประสิทธิ์ความหนืดไฮดรอลิก", unit: "N·s/m", typical: "1,500 – 3,500 N·s/m" },
          { symbol: "m", name: "มวลของตัวถังส่วนที่สปริงรองรับ (Sprung mass ต่อ 1 ล้อ)", unit: "kg", typical: "300 – 450 kg" }
        ],
        svgDiagram: `<svg viewBox="0 0 420 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:8px;">
          <!-- Car Body Chassis -->
          <rect x="70" y="25" width="280" height="35" rx="6" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          <text x="210" y="47" fill="#F8FAFC" font-size="12" font-weight="bold" text-anchor="middle">ตัวถังรถยนต์ (Sprung Mass M)</text>
          <!-- Left Suspension (Coil Spring) -->
          <path d="M 120 60 L 120 75 L 135 83 L 105 91 L 135 99 L 105 107 L 135 115 L 105 123 L 120 131 L 120 145" fill="none" stroke="#10B981" stroke-width="3"/>
          <text x="75" y="105" fill="#10B981" font-size="10" font-weight="bold">สปริง k</text>
          <!-- Right Suspension (Hydraulic Damper) -->
          <rect x="250" y="85" width="40" height="60" rx="4" fill="#334155" stroke="#94A3B8" stroke-width="1.5"/>
          <rect x="255" y="90" width="30" height="50" fill="#0284C7" fill-opacity="0.4"/>
          <line x1="270" y1="60" x2="270" y2="105" stroke="#F59E0B" stroke-width="3"/>
          <rect x="258" y="105" width="24" height="6" rx="2" fill="#F59E0B"/>
          <text x="300" y="115" fill="#F59E0B" font-size="10" font-weight="bold">โช้กอัพ b</text>
          <!-- Wheel & Road -->
          <circle cx="195" cy="175" r="28" fill="#0F172A" stroke="#64748B" stroke-width="4"/>
          <line x1="30" y1="203" x2="390" y2="203" stroke="#475569" stroke-width="3"/>
          <text x="280" y="195" fill="#94A3B8" font-size="9">พื้นถนน</text>
        </svg>`,
        citations: [
          {
            title: "Automotive Chassis: Engineering Principles",
            authors: "Reimpell, J., Stoll, H., & Betzler, J. W.",
            source: "Butterworth-Heinemann, 2nd Edition, Chapter 5 (Suspension Systems & Dampers), pp. 245–280",
            year: "2001",
            url: "https://www.sciencedirect.com/book/9780750650540/the-automotive-chassis",
            verificationStatus: "verified_direct_content",
            evidencePin: "Reimpell et al. (2001) Chapter 5: Damper calculations, damping ratio ζ = c / (2√(k·m)) and compromise between ride comfort and road holding.",
            note: "มาตรฐานวิศวกรรมยานยนต์สากลว่าด้วยระบบรองรับน้ำหนัก"
          }
        ],
        engineeringNote: "เมื่อโช้กอัพรถยนต์ 'แตก' หรือน้ำมันไฮดรอลิกรั่วจนสัมประสิทธิ์ความหนืด $b \\to 0$ ระบบจะกลายเป็นการสั่นหน่วงต่ำมาก (Underdamped) รถจะกระเด้งโยกเยกต่อเนื่องเมื่อตกหลุม หน้ายางจะลอยจากผิวถนน ทำให้ระยะเบรกยาวขึ้นและเสี่ยงต่อการหลุดโค้งอย่างรุนแรง"
      },

      {
        id: "PHE-CH03-03",
        chapterId: "ch03",
        division: "ภาคที่ 1: จลนศาสตร์และพลศาสตร์ฮาร์มอนิกอย่างง่าย",
        category: "ฟิสิกส์ดาราศาสตร์และกลศาสตร์ดาวเคราะห์ (Astrophysics & Geophysics)",
        titleTh: "ลูกตุ้มฟูโกต์และการพิสูจน์การหมุนรอบตัวเองของโลก",
        titleEn: "Foucault Pendulum & Precession of the Oscillation Plane",
        relatedTheoryId: "theory-2",
        relatedTheoryTitle: "ทฤษฎีที่ 2: ระบบมวล-สปริงแนวดิ่งและลูกตุ้มอย่างง่าย",
        relatedSimulator: "oscillation",
        relatedSimSubmode: "pendulum",
        observed: "ลูกตุ้มขนาดยักษ์ที่แขวนจากเพดานสูงในพิพิธภัณฑ์วิทยาศาสตร์ (เช่น วิหารแพนธีออนในปารีส) แกว่งไปมาเป็นเส้นตรง แต่เมื่อเวลาผ่านไปหลายชั่วโมง ระนาบการแกว่งจะค่อยๆ หมุนเบี่ยงทิศทางไปทีละน้อยตลอดทั้งวัน",
        mechanism: "ตามกฎความเฉื่อยของนิวตัน ระนาบการแกว่งของลูกตุ้มจะรักษาระนาบเดิมใน 'กรอบอ้างอิงเฉื่อยของจักรวาล' อย่างแน่วแน่ แต่เนื่องจากดาวเคราะห์โลกกำลังหมุนรอบตัวเองอยู่ใต้ฐานของลูกตุ้ม ผู้สังเกตบนโลกซึ่งอยู่ในกรอบอ้างอิงที่ไม่เฉื่อย จึงมองเห็นเสมือนว่าระนาบการแกว่งหมุนควง (Precession) ช้าๆ ด้วยผลของแรงโคริโอลิส (Coriolis Force: $\\vec{F}_{\\text{cor}} = -2m\\vec{\\Omega}\\times\\vec{v}$)\n\nอัตราการหมุนควงของระนาบลูกตุ้มฟูโกต์ขึ้นอยู่กับละติจูด $\\lambda$ ของตำแหน่งที่ตั้ง:\n$$\\omega_{\\text{prec}} = \\Omega_{\\text{Earth}} \\sin\\lambda$$\n• ที่ขั้วโลกเหนือ ($\\lambda = 90^\\circ$): ระนาบจะหมุนครบ $360^\\circ$ ในเวลา 24 ชั่วโมงพอดี (ตามเข็มนาฬิกา)\n• ที่เส้นศูนย์สูตร ($\\lambda = 0^\\circ$): $\\sin 0^\\circ = 0$ ระนาบลูกตุ้มจะไม่หมุนควงเลย\n• ที่กรุงเทพฯ ($\\lambda \\approx 13.75^\\circ$): คาบการหมุนครบ 1 รอบจะยาวนานถึงประมาณ 101 ชั่วโมง",
        scope: "การแกว่งมุมเล็กมากของลูกตุ้มมวลหนักสายยาวพิเศษ เพื่อลดผลกระทบของการหน่วงจากอากาศและรักษาการแกว่งต่อเนื่องได้หลายวัน",
        formulas: [
          {
            latex: "T_{\\text{precession}} = \\frac{24\\text{ ชั่วโมง}}{|\\sin\\lambda|}",
            desc: "คาบเวลาที่ระนาบการแกว่งของลูกตุ้มฟูโกต์จะหมุนควงครบ 1 รอบ 360°"
          },
          {
            latex: "\\vec{a}_{\\text{cor}} = -2\\vec{\\Omega} \\times \\vec{v}",
            desc: "ความเร่งโคริโอลิสที่เบี่ยงเบนแนวเส้นทางของลูกตุ้มในกรอบอ้างอิงโลก"
          }
        ],
        variables: [
          { symbol: "\\lambda", name: "ละติจูดทางภูมิศาสตร์ของตำแหน่งที่ตั้ง", unit: "° (องศา)", typical: "0° (ศูนย์สูตร) ถึง 90° (ขั้วโลก)" },
          { symbol: "\\Omega", name: "อัตราเร็วเชิงมุมการหมุนของโลก", unit: "rad/s", typical: "7.292 × 10⁻⁵ rad/s" },
          { symbol: "L", name: "ความยาวสายแขวนลูกตุ้มฟูโกต์", unit: "m", typical: "15 – 67 m (ลูกตุ้มฟูโกต์แท้)" },
          { symbol: "m", name: "มวลของลูกตุ้มทรงกลมโลหะ", unit: "kg", typical: "25 – 100 kg" }
        ],
        svgDiagram: `<svg viewBox="0 0 420 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:8px;">
          <!-- Ceiling mount -->
          <circle cx="210" cy="20" r="4" fill="#94A3B8"/>
          <!-- Long wire -->
          <line x1="210" y1="20" x2="210" y2="140" stroke="#38BDF8" stroke-width="1.5"/>
          <!-- Heavy Bob -->
          <circle cx="210" cy="140" r="16" fill="#F59E0B" stroke="#F8FAFC" stroke-width="2"/>
          <text x="210" y="145" fill="#0F172A" font-size="10" font-weight="bold" text-anchor="middle">28 kg</text>
          <!-- Ground Precession Compass dial -->
          <ellipse cx="210" cy="185" rx="120" ry="25" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
          <!-- Oscillation plane lines -->
          <line x1="120" y1="185" x2="300" y2="185" stroke="#10B981" stroke-width="2"/>
          <line x1="140" y1="175" x2="280" y2="195" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="3,3"/>
          <path d="M 270 185 A 40 10 0 0 1 255 192" fill="none" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-yellow)"/>
          <text x="210" y="180" fill="#10B981" font-size="9" text-anchor="middle">ระนาบเริ่มแรก (t = 0)</text>
          <text x="280" y="170" fill="#F59E0B" font-size="9">หมุนควง ω = Ω sin λ</text>
          <text x="210" y="210" fill="#94A3B8" font-size="9" text-anchor="middle">โลกหมุนอยู่ใต้ลูกตุ้มตลอดเวลา</text>
        </svg>`,
        citations: [
          {
            title: "Demonstration physique du mouvement de rotation de la Terre au moyen du pendule",
            authors: "Foucault, L.",
            source: "Comptes Rendus de l'Academie des Sciences (Paris), Vol. 32, pp. 135–138",
            year: "1851",
            url: "https://gallica.bnf.fr/ark:/12148/bpt6k29891/f139.item",
            verificationStatus: "verified_direct_content",
            evidencePin: "Foucault (1851) CR Acad. Sci. 32, 135: First demonstration of Earth rotation via pendulum plane precession period T = 24h / sin(latitude).",
            note: "เอกสารปฐมภูมิต้นฉบับการค้นพบของเลอง ฟูโกต์"
          }
        ],
        engineeringNote: "เพื่อป้องกันไม่ให้ลูกตุ้มฟูโกต์หยุดแกว่งจากแรงต้านอากาศหลังปล่อยเพียงไม่กี่ชั่วโมง พิพิธภัณฑ์จะติดตั้ง 'แม่เหล็กไฟฟ้าเหนี่ยวนำ' (Electromagnetic drive) ซ่อนไว้ที่เพดาน เพื่อส่งแรงผลักสั้นๆ ให้ลูกตุ้มเฉพาะจังหวะที่มันผ่านจุดศูนย์กลาง ทำให้ชดเชยพลังงานที่สูญเสียไปได้อย่างสมบูรณ์โดยไม่รบกวนระนาบการหมุนควง"
      },

      {
        id: "PHE-CH03-04",
        chapterId: "ch03",
        division: "ภาคที่ 2: การสั่นหน่วง การสั่นถูกบังคับ และการสั่นพ้อง",
        category: "อะคูสติกส์และวิศวกรรมเสียง (Acoustics & Musical Instrument Physics)",
        titleTh: "ส้อมเสียงอะคูสติกและการสั่นพ้องเชิงเห็นอกเห็นใจ",
        titleEn: "Acoustic Tuning Forks & Sympathetic Resonance Coupling",
        relatedTheoryId: "theory-5",
        relatedTheoryTitle: "ทฤษฎีที่ 5: การแกว่งกวัดถูกบังคับและการสั่นพ้อง",
        relatedSimulator: "oscillation",
        relatedSimSubmode: "damping_resonance",
        observed: "เมื่อนำส้อมเสียง 2 อันที่มีความถี่เท่ากัน (เช่น 440 Hz โน้ต A4) มาวางใกล้กันบนกล่องไม้เรโซแนนซ์ แล้วเคาะส้อมเสียงอันที่หนึ่งให้ส่งเสียงดัง จากนั้นใช้มือจับส้อมเสียงอันแรกให้หยุดสั่นทันที จะพบว่าส้อมเสียงอันที่สองกลับดังขึ้นมาเองอย่างน่าอัศจรรย์",
        mechanism: "ส้อมเสียงเป็นระบบออสซิลเลเตอร์ที่มีค่าประกอบคุณภาพ $Q$ สูงมาก ($Q > 1,000$) มีแถบตอบสนองความถี่แคบเฉียบ เมื่อส้อมเสียงอันแรกสั่น คลื่นเสียงความดันในอากาศจะทำหน้าที่เป็น 'แรงขับภายนอกแบบพีริออดิก' (Periodic driving force) ด้วยความถี่ $\\omega$ ไปกระแทกส้อมเสียงอันที่สอง เนื่องจากส้อมเสียงทั้งคู่มีความถี่ธรรมชาติ $\\omega_0$ ตรงกันพอดี ($\\omega = \\omega_0$) จึงเกิด 'การสั่นพ้องเชิงเห็นอกเห็นใจ' (Sympathetic Resonance) คลื่นเสียงส่งผ่านพลังงานอย่างมีประสิทธิภาพสูงสุด ทำให้ส้อมเสียงอันที่สองดูดซับพลังงานและสั่นขึ้นมาเองด้วยแอมพลิจูดสูง แต่หากใช้ส้อมเสียงอันที่สองที่มีความถี่ต่างกันเพียงเล็กน้อย (เช่น 442 Hz) ปรากฏการณ์นี้จะไม่เกิดขึ้นเลย",
        scope: "การเชื่อมโยงระบบการสั่นผ่านตัวกลางอากาศ (Acoustic coupling) ในขอบเขตคลื่นเสียงเชิงเส้น",
        formulas: [
          {
            latex: "Q = \\frac{f_0}{\\Delta f} > 1,000",
            desc: "ค่าประกอบคุณภาพสูงของส้อมเสียง ทำให้ตอบสนองเฉพาะความถี่ตรงกันเท่านั้น"
          },
          {
            latex: "P_{\\text{transfer}}(\\omega) = \\frac{1}{2} F_0 v(\\omega) \\cos\\delta \\implies P_{\\text{max}} \\text{ ณ } \\omega = \\omega_0",
            desc: "กำลังการถ่ายโอนพลังงานเฉลี่ยสูงสุดเมื่อเกิดการสั่นพ้อง"
          }
        ],
        variables: [
          { symbol: "f_0", name: "ความถี่เสียงมาตรฐานของส้อมเสียง (Concert Pitch A4)", unit: "Hz", typical: "440.0 Hz" },
          { symbol: "Q", name: "ค่าประกอบคุณภาพเชิงกลของส้อมเสียงเหล็กกล้า", unit: "—", typical: "1,500 – 3,000" },
          { symbol: "\\Delta f", name: "ความกว้างแถบตอบสนองครึ่งกำลัง", unit: "Hz", typical: "< 0.3 Hz" }
        ],
        svgDiagram: `<svg viewBox="0 0 420 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:8px;">
          <!-- Fork 1 (Driven) -->
          <g transform="translate(80, 50)">
            <path d="M 15 0 L 15 60 C 15 75 35 75 35 60 L 35 0 M 25 70 L 25 100" fill="none" stroke="#38BDF8" stroke-width="4"/>
            <!-- Sound waves from fork 1 -->
            <path d="M 45 20 A 25 25 0 0 1 45 50" fill="none" stroke="#38BDF8" stroke-width="2"/>
            <path d="M 55 10 A 40 40 0 0 1 55 60" fill="none" stroke="#38BDF8" stroke-width="1.5"/>
            <!-- Resonance Box 1 -->
            <rect x="-10" y="100" width="70" height="35" rx="3" fill="#B45309" stroke="#D97706" stroke-width="1.5"/>
            <text x="25" y="122" fill="#FEF3C7" font-size="9" text-anchor="middle">กล่องไม้ขยายเสียง</text>
            <text x="25" y="-10" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle">ส้อมเสียง 1 (440 Hz)</text>
          </g>
          <!-- Coupling sound waves -->
          <g transform="translate(170, 70)">
            <path d="M 0 10 A 30 30 0 0 1 0 50" fill="none" stroke="#F59E0B" stroke-width="2"/>
            <path d="M 20 0 A 45 45 0 0 1 20 60" fill="none" stroke="#F59E0B" stroke-width="2"/>
            <path d="M 40 -10 A 60 60 0 0 1 40 70" fill="none" stroke="#F59E0B" stroke-width="2"/>
            <text x="20" y="85" fill="#F59E0B" font-size="9" text-anchor="middle">คลื่นเสียงส่งพลังงาน</text>
          </g>
          <!-- Fork 2 (Sympathetic Resonance) -->
          <g transform="translate(260, 50)">
            <path d="M 15 0 L 15 60 C 15 75 35 75 35 60 L 35 0 M 25 70 L 25 100" fill="none" stroke="#10B981" stroke-width="4"/>
            <!-- Vibration lines on fork 2 -->
            <path d="M 8 10 Q 12 30 8 50" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="2,2"/>
            <path d="M 42 10 Q 38 30 42 50" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="2,2"/>
            <!-- Resonance Box 2 -->
            <rect x="-10" y="100" width="70" height="35" rx="3" fill="#B45309" stroke="#D97706" stroke-width="1.5"/>
            <text x="25" y="122" fill="#FEF3C7" font-size="9" text-anchor="middle">กล่องไม้ขยายเสียง</text>
            <text x="25" y="-10" fill="#10B981" font-size="11" font-weight="bold" text-anchor="middle">ส้อมเสียง 2 (440 Hz)</text>
          </g>
          <text x="210" y="195" fill="#10B981" font-size="11" font-weight="bold" text-anchor="middle">Sympathetic Resonance: ส้อมเสียง 2 สั่นและดังขึ้นมาเองเมื่อความถี่เท่ากัน</text>
        </svg>`,
        citations: [
          {
            title: "The Physics of Musical Instruments",
            authors: "Fletcher, N. H., & Rossing, T. D.",
            source: "Springer-Verlag, 2nd Edition, Chapter 2 (Tuning Forks & Struck Bars), pp. 58–72",
            year: "1998",
            url: "https://link.springer.com/book/10.1007/978-0-387-21603-4",
            verificationStatus: "verified_direct_content",
            evidencePin: "Fletcher & Rossing (1998) Sec. 2.4 pp. 58–63: High-Q vibrational modes of tuning forks and acoustic acoustic radiation coupling.",
            note: "ตำราฟิสิกส์เครื่องดนตรีมาตรฐานระดับโลก"
          }
        ],
        engineeringNote: "ในการตั้งสายเปียโน นักจูนเปียโนมืออาชีพจะใช้ประโยชน์จากปรากฏการณ์นี้ โดยแตะส้อมเสียง A440 เข้ากับเนื้อไม้ของเปียโนเพื่อฟังการสั่นพ้องและการเกิดเสียง 'บีต' (Beats) หากสายเปียโนหย่อนหรือตึงเกินไป จะได้ยินเสียงวูบวาบไม่สม่ำเสมอ จนกว่าจะหมุนสลักจนเสียงบีตหายไปสนิท แสดงว่าสายเปียโนมีความถี่ตรงกับส้อมเสียงพอดี"
      }
    ]
  };
}));
