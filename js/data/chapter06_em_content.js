/**
 * chapter06_em_content.js - Standardized 6-Point Pedagogical Curriculum for Chapter 06
 * Electricity, Magnetism & Circuits (แม่เหล็กไฟฟ้าและวงจรไฟฟ้า - 27 ทฤษฎีหลัก 4 ภาควิชา)
 * Part of PhysicsNoza 3.0 Standardized Curriculum
 *
 * Academic Standards:
 * - David Tong (2015), Lectures on Electromagnetism, Cambridge University DAMTP.
 * - Halliday, Resnick, & Walker (2018), Fundamentals of Physics (11th Ed), Chapters 21-34.
 * - Purcell, E. M., & Morin, D. J. (2013), Electricity and Magnetism (3rd Ed), Cambridge University Press.
 * - Griffiths, D. J. (2017), Introduction to Electrodynamics (4th Ed), Cambridge University Press.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Chapter06Content = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
  "meta": {
    "chapterId": "ch06",
    "number": 6,
    "titleTh": "บทที่ 06: ไฟฟ้าและแม่เหล็ก",
    "titleEn": "Chapter 06: Electromagnetism, Electric Fields, DC/RC Circuits, Magnetostatics, Induction & AC Circuits",
    "description": "เนื้อหาฟิสิกส์ระดับมหาวิทยาลัยครอบคลุม 27 ทฤษฎีหลัก 4 ภาควิชา: ไฟฟ้าสถิตและศักย์ไฟฟ้า, ตัวเก็บประจุและวงจรไฟฟ้ากระแสตรง, แม่เหล็กสถิตและแหล่งกำเนิดสนามแม่เหล็ก, และการเหนี่ยวนำแม่เหล็กไฟฟ้า วงจรกระแสสลับ RLC เรโซแนนซ์ จนถึงสมการของแมกซ์เวลล์"
  },
  "divisions": [
    {
      "id": "div-ch06-electrostatics-potentials",
      "numeral": "ภาคที่ 1",
      "titleTh": "ไฟฟ้าสถิต ศักย์ไฟฟ้า และกฎของเกาส์ (Electrostatics & Electric Potentials)",
      "titleEn": "Electrostatics, Electric Potentials & Gauss's Law",
      "description": "ประจุและการอนุรักษ์ประจุ กฎคูลอมบ์ สนามไฟฟ้าและเส้นแรงไฟฟ้า ขั้วคู่ไฟฟ้า ฟลักซ์ไฟฟ้าและกฎของเกาส์ ศักย์ไฟฟ้า เกรเดียนต์ศักย์ไฟฟ้า และพลังงานไฟฟ้าสถิต"
    },
    {
      "id": "div-ch06-capacitors-dc-circuits",
      "numeral": "ภาคที่ 2",
      "titleTh": "ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง (Capacitors, Resistance & DC Circuits)",
      "titleEn": "Capacitance, Resistivity & DC Circuit Transients",
      "description": "ความจุไฟฟ้า ตัวเก็บประจุแผ่นคู่ขนาน ไดอิเล็กทริกและโพลาไรเซชัน วงจรตัวเก็บประจุ กระแสไฟฟ้า ความเร็วลอยเลื่อน กฎของโอห์ม แรงเคลื่อนไฟฟ้า กฎเคอร์ชอฟฟ์ และวงจรทรานเชียนต์ RC"
    },
    {
      "id": "div-ch06-magnetostatics-forces",
      "numeral": "ภาคที่ 3",
      "titleTh": "แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก (Magnetostatics & Magnetic Sources)",
      "titleEn": "Magnetostatics, Lorentz Forces & Magnetic Field Sources",
      "description": "แรงลอเรนซ์ การเคลื่อนที่แบบไซโคลตรอน เครื่องคัดแยกความเร็ว แรงแม่เหล็กบนลวดตัวนำ โมเมนต์ขั้วคู่แม่เหล็ก ปรากฏการณ์ฮอลล์ กฎของบีโอต์-ซาวารต์ กฎของแอมแปร์ และแรงระหว่างลวดตัวนำขนาน"
    },
    {
      "id": "div-ch06-induction-ac-maxwell",
      "numeral": "ภาคที่ 4",
      "titleTh": "การเหนี่ยวนำแม่เหล็กไฟฟ้า วงจรไฟฟ้ากระแสสลับ และสมการแมกซ์เวลล์ (Induction, AC & Maxwell)",
      "titleEn": "Electromagnetic Induction, AC Circuits & Maxwell's Equations",
      "description": "ฟลักซ์แม่เหล็ก กฎการเหนี่ยวนำของฟาราเดย์ กฎของเลนซ์ แรงเคลื่อนไฟฟ้าจากการเคลื่อนที่ กระแสวน ความเหนี่ยวนำตนเอง พลังงานในสนามแม่เหล็ก วงจรไฟฟ้ากระแสสลับ RLC เรโซแนนซ์ และสมการของแมกซ์เวลล์ 4 ข้อ"
    }
  ],
  "masterSymbols": [
    {
      "symbol": "q, Q",
      "nameTh": "ประจุไฟฟ้า",
      "nameEn": "Electric Charge",
      "unitSI": "\\text{C}",
      "domain": "electrostatics",
      "domainTh": "ไฟฟ้าสถิต",
      "note": "ปริมาณสเกลาร์อนุรักษ์ e = 1.602 × 10⁻¹⁹ C"
    },
    {
      "symbol": "\\mathbf{E}",
      "nameTh": "ความเข้มสนามไฟฟ้า",
      "nameEn": "Electric Field Vector",
      "unitSI": "\\text{N/C} \\; (\\text{V/m})",
      "domain": "electrostatics",
      "domainTh": "ไฟฟ้าสถิต",
      "note": "แรงไฟฟ้าสถิตต่อหนึ่งหน่วยประจุทดสอบบวก E = F/q"
    },
    {
      "symbol": "\\mathbf{p}",
      "nameTh": "โมเมนต์ขั้วคู่ไฟฟ้า",
      "nameEn": "Electric Dipole Moment",
      "unitSI": "\\text{C}\\cdot\\text{m}",
      "domain": "electrostatics",
      "domainTh": "ไฟฟ้าสถิต",
      "note": "เวกเตอร์ชี้จากขั้วลบไปขั้วบวก p = qd"
    },
    {
      "symbol": "\\Phi_E",
      "nameTh": "ฟลักซ์ไฟฟ้า",
      "nameEn": "Electric Flux",
      "unitSI": "\\text{N}\\cdot\\text{m}^2/\\text{C}",
      "domain": "electrostatics",
      "domainTh": "ไฟฟ้าสถิต",
      "note": "ฟลักซ์ของสนามไฟฟ้าพุ่งผ่านผิวใดๆ Φ_E = ∫ E · dA"
    },
    {
      "symbol": "V",
      "nameTh": "ศักย์ไฟฟ้า",
      "nameEn": "Electric Potential",
      "unitSI": "\\text{V} \\; (\\text{J/C})",
      "domain": "electrostatics",
      "domainTh": "ไฟฟ้าสถิต",
      "note": "พลังงานศักย์ไฟฟ้าต่อหนึ่งหน่วยประจุ E = -∇V"
    },
    {
      "symbol": "U_E",
      "nameTh": "พลังงานไฟฟ้าสถิตสะสม",
      "nameEn": "Electrostatic Potential Energy",
      "unitSI": "\\text{J}",
      "domain": "electrostatics",
      "domainTh": "ไฟฟ้าสถิต",
      "note": "งานที่ใช้ในการนำประจุจากระยะอนันต์มารวมตัวกัน"
    },
    {
      "symbol": "C",
      "nameTh": "ความจุไฟฟ้า",
      "nameEn": "Capacitance",
      "unitSI": "\\text{F} \\; (\\text{C/V})",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "อัตราส่วนประจุต่อผลต่างศักย์ C = Q/V = κε₀A/d"
    },
    {
      "symbol": "\\kappa",
      "nameTh": "ค่าคงที่ไดอิเล็กทริก",
      "nameEn": "Dielectric Constant",
      "unitSI": "—",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "อัตราส่วนสภาพยอมของสารต่อสุญญากาศ κ = ε/ε₀"
    },
    {
      "symbol": "I",
      "nameTh": "กระแสไฟฟ้า",
      "nameEn": "Electric Current",
      "unitSI": "\\text{A} \\; (\\text{C/s})",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "อัตราการไหลสุทธิของประจุ I = dQ/dt = n q A v_d"
    },
    {
      "symbol": "\\mathbf{J}",
      "nameTh": "ความหนาแน่นกระแสไฟฟ้า",
      "nameEn": "Current Density Vector",
      "unitSI": "\\text{A/m}^2",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "กระแสต่อหนึ่งหน่วยพื้นที่หน้าตัด J = σE = I/A"
    },
    {
      "symbol": "v_d",
      "nameTh": "ความเร็วลอยเลื่อน",
      "nameEn": "Drift Velocity",
      "unitSI": "\\text{m/s}",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "ความเร็วเฉลี่ยสุทธิของอิเล็กตรอนนำไฟฟ้าในสนามไฟฟ้า"
    },
    {
      "symbol": "R",
      "nameTh": "ความต้านทานไฟฟ้า",
      "nameEn": "Electrical Resistance",
      "unitSI": "\\Omega \\; (\\text{V/A})",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "อัตราส่วนความต่างศักย์ต่อกระแส R = V/I = ρL/A"
    },
    {
      "symbol": "\\rho",
      "nameTh": "สภาพต้านทานไฟฟ้า",
      "nameEn": "Resistivity",
      "unitSI": "\\Omega\\cdot\\text{m}",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "สมบัติเฉพาะของเนื้อสาร (สภาพนำไฟฟ้า σ = 1/ρ)"
    },
    {
      "symbol": "\\mathcal{E}",
      "nameTh": "แรงเคลื่อนไฟฟ้า (EMF)",
      "nameEn": "Electromotive Force",
      "unitSI": "\\text{V}",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "พลังงานที่แหล่งจ่ายถ่ายโอนต่อหนึ่งหน่วยประจุ"
    },
    {
      "symbol": "\\tau",
      "nameTh": "ค่าคงตัวเวลา",
      "nameEn": "Time Constant",
      "unitSI": "\\text{s}",
      "domain": "circuits",
      "domainTh": "วงจรไฟฟ้า",
      "note": "สำหรับวงจร RC คือ τ = RC, สำหรับวงจร RL คือ τ = L/R"
    },
    {
      "symbol": "\\mathbf{B}",
      "nameTh": "ความเข้มสนามแม่เหล็ก",
      "nameEn": "Magnetic Field (Flux Density)",
      "unitSI": "\\text{T} \\; (\\text{N}/(\\text{A}\\cdot\\text{m}))",
      "domain": "magnetism",
      "domainTh": "แม่เหล็กสถิต",
      "note": "สนามเวกเตอร์กระทำแรงต่อประจุเคลื่อนที่ F = q(v × B)"
    },
    {
      "symbol": "\\mathbf{\\mu}",
      "nameTh": "โมเมนต์ขั้วคู่แม่เหล็ก",
      "nameEn": "Magnetic Dipole Moment",
      "unitSI": "\\text{A}\\cdot\\text{m}^2",
      "domain": "magnetism",
      "domainTh": "แม่เหล็กสถิต",
      "note": "สำหรับขดลวด μ = N I A n̂ โดย τ = μ × B"
    },
    {
      "symbol": "V_H",
      "nameTh": "แรงดันฮอลล์",
      "nameEn": "Hall Voltage",
      "unitSI": "\\text{V}",
      "domain": "magnetism",
      "domainTh": "แม่เหล็กสถิต",
      "note": "ความต่างศักย์ขวางที่เกิดจากแรงลอเรนซ์ในสนามแม่เหล็ก"
    },
    {
      "symbol": "\\Phi_B",
      "nameTh": "ฟลักซ์แม่เหล็ก",
      "nameEn": "Magnetic Flux",
      "unitSI": "\\text{Wb} \\; (\\text{T}\\cdot\\text{m}^2)",
      "domain": "induction",
      "domainTh": "การเหนี่ยวนำ",
      "note": "อินทิกรัลพื้นผิวของสนามแม่เหล็ก Φ_B = ∫ B · dA"
    },
    {
      "symbol": "L",
      "nameTh": "ความเหนี่ยวนำตนเอง",
      "nameEn": "Self-Inductance",
      "unitSI": "\\text{H} \\; (\\text{V}\\cdot\\text{s}/\\text{A})",
      "domain": "induction",
      "domainTh": "การเหนี่ยวนำ",
      "note": "อัตราส่วนฟลักซ์แม่เหล็กต่อกระแส L = NΦ_B/I"
    },
    {
      "symbol": "U_B",
      "nameTh": "พลังงานสะสมในสนามแม่เหล็ก",
      "nameEn": "Magnetic Field Energy",
      "unitSI": "\\text{J}",
      "domain": "induction",
      "domainTh": "การเหนี่ยวนำ",
      "note": "พลังงานที่สะสมในขดลวดเหนี่ยวนำ U_B = (1/2) L I²"
    },
    {
      "symbol": "X_L, X_C",
      "nameTh": "รีแอกแตนซ์เหนี่ยวนำและความจุ",
      "nameEn": "Inductive & Capacitive Reactance",
      "unitSI": "\\Omega",
      "domain": "ac",
      "domainTh": "ไฟฟ้ากระแสสลับ",
      "note": "X_L = ωL, X_C = 1/(ωC)"
    },
    {
      "symbol": "Z",
      "nameTh": "อิมพีแดนซ์เชิงซ้อน",
      "nameEn": "Impedance",
      "unitSI": "\\Omega",
      "domain": "ac",
      "domainTh": "ไฟฟ้ากระแสสลับ",
      "note": "ความต้านทานปรากฏรวมในวงจรกระแสสลับ Z = √(R² + (X_L - X_C)²)"
    },
    {
      "symbol": "f_0",
      "nameTh": "ความถี่เรโซแนนซ์",
      "nameEn": "Resonance Frequency",
      "unitSI": "\\text{Hz}",
      "domain": "ac",
      "domainTh": "ไฟฟ้ากระแสสลับ",
      "note": "f₀ = 1 / (2π√(LC)) เมื่อ X_L = X_C"
    },
    {
      "symbol": "\\varepsilon_0",
      "nameTh": "สภาพยอมของสุญญากาศ",
      "nameEn": "Vacuum Permittivity",
      "unitSI": "\\text{F/m}",
      "domain": "constants",
      "domainTh": "ค่าคงตัว",
      "note": "ε₀ ≈ 8.854 × 10⁻¹² F/m"
    },
    {
      "symbol": "\\mu_0",
      "nameTh": "สภาพให้ซึมผ่านได้ของสุญญากาศ",
      "nameEn": "Vacuum Permeability",
      "unitSI": "\\text{T}\\cdot\\text{m/A}",
      "domain": "constants",
      "domainTh": "ค่าคงตัว",
      "note": "μ₀ = 4π × 10⁻⁷ T·m/A"
    }
  ],
  "theories": [
    {
      "id": "ch06-th01",
      "divisionId": "div-ch06-electrostatics-potentials",
      "divisionTitle": "ภาคที่ 1: ไฟฟ้าสถิต ศักย์ไฟฟ้า และกฎของเกาส์",
      "numberTh": "ทฤษฎีที่ 1",
      "type": "law",
      "titleTh": "กฎของคูลอมบ์ การควอนไทซ์ และการอนุรักษ์ประจุไฟฟ้า",
      "titleEn": "Coulomb's Law, Charge Quantization & Conservation",
      "summary": "แรงดึงดูดและผลักระหว่างประจุจุดตามกฎกำลังสองผกผัน สมบัติควอนไทเซชันของประจุ q = Ne และกฎการอนุรักษ์ประจุสุทธิในระบบปิด",
      "definition": {
        "text": "กฎของคูลอมบ์ (Coulomb's Law, 1785) ระบุว่า แรงไฟฟ้าระหว่างประจุจุดสองจุดแปรผันตรงกับผลคูณของขนาดประจุทั้งสอง และแปรผกผันกับกำลังสองของระยะห่างระหว่างประจุ โดยมีทิศทางตามแนวเส้นตรงเชื่อมประจุทั้งสอง นอกจากนี้ ประจุไฟฟ้ายังมีสมบัติควอนไทซ์ (Charge Quantization) คือมีค่าเป็นจำนวนเต็มเท่าของประจุมูลฐาน e = 1.602 × 10⁻¹⁹ C เสมอ และประจุสุทธิของระบบโดดเดี่ยวย่อมคงที่ตามกฎการอนุรักษ์ประจุ (Conservation of Charge)"
      },
      "principle": {
        "text": "หลักการสำคัญของแรงไฟฟ้าสถิตและธรรมชาติของประจุ:\n1. กฎของคูลอมบ์ในรูปเวกเตอร์: $\\mathbf{F}_{12} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2} \\hat{\\mathbf{r}}_{12}$ โดย $\\hat{\\mathbf{r}}_{12}$ ชี้จาก $q_1$ ไปยัง $q_2$\n2. แรงปฏิกิริยาคู่ควบ: $\\mathbf{F}_{21} = -\\mathbf{F}_{12}$ สอดคล้องกับกฎข้อที่สามของนิวตันอย่างเคร่งครัด\n3. การเปรียบเทียบกับแรงโน้มถ่วง: แรงคูลอมบ์มีสมการรูปกำลังสองผกผันเหมือนแรงโน้มถ่วงของนิวตัน แต่แรงไฟฟ้ามีความเข้มสูงกว่าแรงโน้มถ่วงระหว่างโปรตอนกับอิเล็กตรอนถึงประมาณ $10^{39}$ เท่า และแรงไฟฟ้ามีทั้งแรงผลักและแรงดึงดูด"
      },
      "formulas": [
        {
          "name": "กฎของคูลอมบ์ (Coulomb's Law)",
          "latex": "\\mathbf{F}_{12} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r^2} \\hat{\\mathbf{r}}_{12}",
          "symbols": [
            {
              "sym": "\\mathbf{F}_{12}",
              "desc": "แรงที่ประจุ 1 กระทำต่อประจุ 2",
              "unit": "\\text{N}"
            },
            {
              "sym": "q_1, q_2",
              "desc": "ขนาดประจุจุดทั้งสอง",
              "unit": "\\text{C}"
            },
            {
              "sym": "r",
              "desc": "ระยะห่างระหว่างประจุ",
              "unit": "\\text{m}"
            },
            {
              "sym": "\\varepsilon_0",
              "desc": "สภาพยอมของสุญญากาศ (8.854 × 10⁻¹²)",
              "unit": "\\text{C}^2/(\\text{N}\\cdot\\text{m}^2)"
            }
          ],
          "derivationSteps": [
            "พิจารณาประจุจุดสองตัว q1 และ q2 ในสุญญากาศที่ระยะห่าง r",
            "การทดลองของชาร์ล-โอกุสแต็ง เดอ คูลอมบ์ ด้วยเครื่องชั่งบิด (Torsion Balance) พบว่า F แปรผันตรงกับ q1*q2 และ 1/r²",
            "กำหนดค่าคงตัว k_e = 1/(4πε₀) ≈ 8.98755 × 10⁹ N·m²/C²",
            "เขียนในรูปเวกเตอร์ด้วยเวกเตอร์หนึ่งหน่วย r̂₁₂ = (r₂ - r₁) / |r₂ - r₁|",
            "หาก q1 และ q2 มีเครื่องหมายเหมือนกัน แรงเป็นบวก (ผลักกัน); หากต่างเครื่องหมาย แรงเป็นลบ (ดึงดูดกัน)"
          ]
        }
      ],
      "application": {
        "text": "การยึดเหนี่ยวของอิเล็กตรอนกับนิวเคลียสในอะตอม โครงสร้างโมเลกุล พันธะไอออนิก และเทคโนโลยีเครื่องถ่ายเอกสารระบบซีรอกราฟี (Xerography)",
        "validWhen": "ประจุเป็นประจุจุดที่อยู่นิ่งสัมพัทธ์ในกรอบอ้างอิงเฉื่อย (Electrostatic approximation)",
        "invalidWhen": "ประจุเคลื่อนที่ด้วยความเร็วสัมพัทธ์สูง (ต้องรวมสนามแม่เหล็กและศักย์ Liénard-Wiechert)"
      },
      "example": {
        "problem": "ประจุบวกสองตัว q₁ = +3.0 μC และ q₂ = +12.0 μC วางห่างกัน d = 60 cm จงหาตำแหน่งบนเส้นตรงระหว่างประจุทั้งสองที่แรงไฟฟ้ารวมต่อประจุทดสอบ q₀ มีค่าเป็นศูนย์",
        "steps": [
          "กำหนดให้ q₁ อยู่ที่ตำแหน่ง x = 0 และ q₂ อยู่ที่ x = 0.60 m",
          "สมมุติให้ประจุทดสอบ q₀ วางอยู่ที่ระยะ x จาก q₁ (โดย 0 < x < 0.60)",
          "แรงจาก q₁ กระทำต่อ q₀ คือ F₁ = k |q₁ q₀| / x² ชี้ไปทาง +x",
          "แรงจาก q₂ กระทำต่อ q₀ คือ F₂ = k |q₂ q₀| / (d - x)² ชี้ไปทาง -x",
          "เงื่อนไขแรงลัพธ์เป็นศูนย์: F₁ = F₂ ⇒ k |q₁ q₀| / x² = k |q₂ q₀| / (d - x)²",
          "ตัด k และ |q₀| ออก: q₁ / x² = q₂ / (d - x)² ⇒ (d - x) / x = √(q₂ / q₁) = √(12/3) = √4 = 2",
          "แก้สมการ: d - x = 2x ⇒ 3x = d = 0.60 m ⇒ x = 0.20 m = 20 cm",
          "ตอบ: จุดที่แรงรวมเป็นศูนย์อยู่ห่างจากประจุ q₁ = +3.0 μC ไปทาง q₂ เป็นระยะ 20 cm"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 120\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"60\" y1=\"60\" x2=\"340\" y2=\"60\" stroke=\"#475569\" stroke-width=\"2\"/><circle cx=\"80\" cy=\"60\" r=\"16\" fill=\"#ef4444\"/><text x=\"80\" y=\"65\" fill=\"#ffffff\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">+q₁</text><circle cx=\"320\" cy=\"60\" r=\"22\" fill=\"#ef4444\"/><text x=\"320\" y=\"66\" fill=\"#ffffff\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">+q₂</text><circle cx=\"160\" cy=\"60\" r=\"8\" fill=\"#10b981\"/><text x=\"160\" y=\"42\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\">F_net = 0</text><line x1=\"80\" y1=\"90\" x2=\"160\" y2=\"90\" stroke=\"#38bdf8\" stroke-width=\"1.5\"/><text x=\"120\" y=\"105\" fill=\"#38bdf8\" font-size=\"10\" text-anchor=\"middle\">x = 20 cm</text><line x1=\"80\" y1=\"112\" x2=\"320\" y2=\"112\" stroke=\"#94a3b8\" stroke-width=\"1.5\"/><text x=\"200\" y=\"110\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">d = 60 cm</text></svg>",
        "diagramCaption": "ตำแหน่งสมดุลของแรงไฟฟ้าสถิตระหว่างสองประจุบวกต่างขนาด"
      },
      "observations": [
        "แรงไฟฟ้าสถิตเป็นไปตามหลักการซ้อนทับเชิงเส้น (Linear Superposition)",
        "จุดสะเทิน (Neutral point) ของประจุชนิดเดียวกันจะอยู่ระหว่างประจุเสมอ และค่อนไปทางประจุที่มีขนาดเล็กกว่า"
      ]
    },
    {
      "id": "ch06-th02",
      "divisionId": "div-ch06-electrostatics-potentials",
      "divisionTitle": "ภาคที่ 1: ไฟฟ้าสถิต ศักย์ไฟฟ้า และกฎของเกาส์",
      "numberTh": "ทฤษฎีที่ 2",
      "type": "concept",
      "titleTh": "สนามไฟฟ้า หลักการซ้อนทับ และเส้นแรงไฟฟ้า",
      "titleEn": "Electric Field, Superposition & Field Lines",
      "summary": "นิยามสนามไฟฟ้า E = F/q หลักการรวมเวกเตอร์ของสนามไฟฟ้า และสมบัติของเส้นแรงไฟฟ้าไมเคิล ฟาราเดย์",
      "definition": {
        "text": "สนามไฟฟ้า (Electric Field, E) คือคุณสมบัติของปริภูมิรอบประจุไฟฟ้า นิยามเป็นแรงไฟฟ้าที่กระทำต่อหนึ่งหน่วยประจุทดสอบบวกที่วางอยู่ ณ ตำแหน่งนั้น: E = F/q₀ เส้นแรงไฟฟ้า (Electric Field Lines) คือเส้นโค้งในจินตนาการที่เวกเตอร์สนามไฟฟ้ามีทิศสัมผัสกับเส้นเสมอ พุ่งออกจากประจุบวกและพุ่งเข้าหาประจุลบ โดยความหนาแน่นของเส้นแทนขนาดความเข้มสนามไฟฟ้า"
      },
      "principle": {
        "text": "หลักการสำคัญ:\n1. สนามไฟฟ้าของประจุจุด: $\\mathbf{E} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r^2} \\hat{\\mathbf{r}}$\n2. หลักการซ้อนทับ (Superposition Principle): สนามไฟฟ้ารวมที่ตำแหน่งใดๆ เกิดจากผลรวมเวกเตอร์ของสนามไฟฟ้าจากทุกประจุย่อย $\\mathbf{E}_{\\text{tot}} = \\sum_i \\mathbf{E}_i$\n3. คุณสมบัติของเส้นแรงไฟฟ้า: เส้นแรงไฟฟ้าไม่มีวันตัดกัน, พุ่งออกจากประจุบวกเข้าหาประจุลบ (หรืออนันต์), และเส้นตั้งฉากกับผิวของตัวนำในสมดุลไฟฟ้าสถิตเสมอ"
      },
      "formulas": [
        {
          "name": "สนามไฟฟ้าของระบบประจุจุด (Electric Field Superposition)",
          "latex": "\\mathbf{E}(\\mathbf{r}) = \\frac{1}{4\\pi\\varepsilon_0} \\sum_{i=1}^N \\frac{q_i}{|\\mathbf{r} - \\mathbf{r}_i|^3} (\\mathbf{r} - \\mathbf{r}_i)",
          "symbols": [
            {
              "sym": "\\mathbf{E}(\\mathbf{r})",
              "desc": "สนามไฟฟ้ารวมที่เวกเตอร์ตำแหน่ง r",
              "unit": "\\text{N/C}"
            },
            {
              "sym": "q_i",
              "desc": "ขนาดของประจุตัวที่ i",
              "unit": "\\text{C}"
            },
            {
              "sym": "\\mathbf{r}_i",
              "desc": "เวกเตอร์ตำแหน่งของประจุตัวที่ i",
              "unit": "\\text{m}"
            }
          ],
          "derivationSteps": [
            "วางประจุทดสอบบวก q₀ ที่ตำแหน่ง r",
            "แรงรวมที่กระทำต่อ q₀ ตามกฎคูลอมบ์และหลักการซ้อนทับคือ F_tot = ∑ F_i",
            "แทน F_i = (1/(4πε₀)) * (q_i * q₀ / |r - r_i|²) * ((r - r_i) / |r - r_i|)",
            "นิยามสนามไฟฟ้า E = F_tot / q₀ จะได้สูตรเวกเตอร์รวมที่สมบูรณ์"
          ]
        }
      ],
      "application": {
        "text": "การออกแบบหลอดภาพรังสีแคโทด (CRT), เครื่องเร่งอนุภาคเชิงเส้น (LINAC), และการวิเคราะห์การสะสมประจุในระบบส่งจ่ายไฟฟ้ากำลัง",
        "validWhen": "ประจุทดสอบ q₀ มีขนาดเล็กมากจนไม่รบกวนการกระจายตัวของประจุต้นกำเนิดเดิม (q₀ → 0)",
        "invalidWhen": "สนามไฟฟ้าสูงเกินขีดจำกัดไดอิเล็กทริกเบรกดาวน์ของตัวกลาง (อากาศจะแตกตัวเป็นพลาสมาที่ ~3 MV/m)"
      },
      "example": {
        "problem": "ประจุจุด +4.0 nC วางอยู่ที่ (0, 3) cm และประจุ -4.0 nC วางอยู่ที่ (0, -3) cm จงหาสนามไฟฟ้ารวมที่จุด (4, 0) cm",
        "steps": [
          "ระยะทางจากแต่ละประจุไปยังจุดสังเกต P(4,0): r = √(4² + 3²) = √25 = 5 cm = 0.05 m",
          "ขนาดสนามไฟฟ้าจากแต่ละประจุ: E₁ = E₂ = k |q| / r² = (8.99 × 10⁹)(4.0 × 10⁻⁹) / (0.05)² = 35.96 / 0.0025 = 14,384 N/C",
          "มุม θ ที่เวกเตอร์ทำกับแกน x: cos θ = 4/5 = 0.8, sin θ = 3/5 = 0.6",
          "สนามจากประจุบวก E₁ ชี้ออกจาก (0,3): E₁x = E₁ cos θ, E₁y = -E₁ sin θ",
          "สนามจากประจุลบ E₂ ชี้เข้าหา (0,-3): E₂x = -E₂ cos θ ??? ไม่ใช่! ทิศชี้เข้าหา (0,-3) ดังนั้น E₂x มีทิศไปทาง -x หรือไม่? จากจุด (4,0) ไป (0,-3) เวกเตอร์ชี้เฉียงลงซ้าย: dx = -4, dy = -3",
          "ดังนั้น องค์ประกอบตามแกน x: E₁x = +E cos θ (เฉียงขวาลง), แต่เวกเตอร์จาก (0,3) ไป (4,0) คือ (+4, -3) ดังนั้น E₁x = +E (4/5), E₁y = -E (3/5)",
          "เวกเตอร์จากจุด (4,0) เข้าหา (0,-3) คือ (-4, -3) ดังนั้น E₂x = -E (4/5), E₂y = -E (3/5)",
          "รวมองค์ประกอบ: E_tot,x = E₁x + E₂x = E(4/5) - E(4/5) = 0 N/C",
          "E_tot,y = E₁y + E₂y = -E(3/5) - E(3/5) = -2E(0.6) = -2(14,384)(0.6) = -17,260 N/C = -1.73 × 10⁴ N/C ĵ",
          "ตอบ: สนามไฟฟ้ารวมมีขนาด 1.73 × 10⁴ N/C มีทิศชี้ลงตามแนวแกน -y"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 140\" class=\"w-full h-36 bg-slate-900 rounded\"><line x1=\"200\" y1=\"10\" x2=\"200\" y2=\"130\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"50\" y1=\"70\" x2=\"350\" y2=\"70\" stroke=\"#334155\" stroke-width=\"1.5\"/><circle cx=\"200\" cy=\"30\" r=\"10\" fill=\"#ef4444\"/><text x=\"180\" y=\"34\" fill=\"#ef4444\" font-size=\"11\">+q</text><circle cx=\"200\" cy=\"110\" r=\"10\" fill=\"#38bdf8\"/><text x=\"180\" y=\"114\" fill=\"#38bdf8\" font-size=\"11\">-q</text><circle cx=\"300\" cy=\"70\" r=\"6\" fill=\"#f59e0b\"/><text x=\"315\" y=\"65\" fill=\"#f59e0b\" font-size=\"11\">P(4,0)</text><line x1=\"300\" y1=\"70\" x2=\"300\" y2=\"115\" stroke=\"#ec4899\" stroke-width=\"2.5\" marker-end=\"url(#arrow-pink)\"/><text x=\"310\" y=\"100\" fill=\"#ec4899\" font-size=\"11\" font-weight=\"bold\">E_net (ชี้ลง)</text></svg>",
        "diagramCaption": "สนามไฟฟ้ารวมบนเส้นแบ่งครึ่งตั้งฉากของขั้วคู่ไฟฟ้า"
      },
      "observations": [
        "บนระนาบแบ่งครึ่งตั้งฉากของไดโพล สนามไฟฟ้ารวมจะมีทิศขนานกับแกนไดโพลแต่ตรงข้ามกับเวกเตอร์โมเมนต์ขั้วคู่เสมอ",
        "เส้นแรงไฟฟ้าออกจากประจุบวกและสิ้นสุดที่ประจุลบ"
      ]
    },
    {
      "id": "ch06-th03",
      "divisionId": "div-ch06-electrostatics-potentials",
      "divisionTitle": "ภาคที่ 1: ไฟฟ้าสถิต ศักย์ไฟฟ้า และกฎของเกาส์",
      "numberTh": "ทฤษฎีที่ 3",
      "type": "concept",
      "titleTh": "ขั้วคู่ไฟฟ้า โมเมนต์ขั้วคู่ และทอร์กในสนามไฟฟ้าสม่ำเสมอ",
      "titleEn": "Electric Dipole, Dipole Moment & Torque in Uniform Fields",
      "summary": "ระบบประจุคู่ตรงข้ามโมเมนต์ p = qd ทอร์ก τ = p × E พลังงานศักย์ U = -p · E และการหมุนปรับแนวของโมเลกุลมีขั้ว",
      "definition": {
        "text": "ขั้วคู่ไฟฟ้า (Electric Dipole) ประกอบด้วยประจุสองตัวที่มีขนาดเท่ากันแต่มีชนิดตรงข้าม (+q และ -q) คั่นด้วยระยะห่าง d โดยมีโมเมนต์ขั้วคู่ไฟฟ้าเป็นเวกเตอร์ p = qd ชี้จากประจุลบไปยังประจุบวก เมื่อขั้วคู่อยู่ในสนามไฟฟ้าสม่ำเสมอ แรงลัพธ์เป็นศูนย์ แต่เกิดโมเมนต์แรงบิด (Torque) τ = p × E ที่พยายามหมุนให้ขั้วคู่ขนานกับสนามไฟฟ้า มีพลังงานศักย์ U = -p · E"
      },
      "principle": {
        "text": "หลักการสำคัญของไดโพล:\n1. เวกเตอร์โมเมนต์ขั้วคู่: $\\mathbf{p} = q\\mathbf{d}$ ทิศชี้จาก $-q$ ไปยัง $+q$\n2. ทอร์กในสนามไฟฟ้าสม่ำเสมอ: $\\boldsymbol{\\tau} = \\mathbf{p} \\times \\mathbf{E}$ (ขนาด $\\tau = p E \\sin\\theta$)\n3. พลังงานศักย์: $U = -\\mathbf{p} \\cdot \\mathbf{E} = -p E \\cos\\theta$ จุดต่ำสุด $U_{\\min} = -pE$ เกิดขึ้นเมื่อ $\\theta = 0^\\circ$ (สมดุลเสถียร)\n4. ในสนามไฟฟ้าไม่สม่ำเสมอ: แรงสุทธิไม่เป็นศูนย์ $\\mathbf{F} = (\\mathbf{p} \\cdot \\nabla)\\mathbf{E}$ ทำให้ไดโพลถูกดูดเข้าหาบริเวณที่สนามเข้มกว่า"
      },
      "formulas": [
        {
          "name": "ทอร์กและพลังงานศักย์ของขั้วคู่ไฟฟ้า (Dipole Torque & Potential Energy)",
          "latex": "\\boldsymbol{\\tau} = \\mathbf{p} \\times \\mathbf{E}, \\quad U = -\\mathbf{p} \\cdot \\mathbf{E}",
          "symbols": [
            {
              "sym": "\\boldsymbol{\\tau}",
              "desc": "ทอร์กหรือโมเมนต์แรงบิดหมุน",
              "unit": "\\text{N}\\cdot\\text{m}"
            },
            {
              "sym": "\\mathbf{p}",
              "desc": "โมเมนต์ขั้วคู่ไฟฟ้า",
              "unit": "\\text{C}\\cdot\\text{m}"
            },
            {
              "sym": "\\mathbf{E}",
              "desc": "สนามไฟฟ้าภายนอก",
              "unit": "\\text{N/C}"
            },
            {
              "sym": "U",
              "desc": "พลังงานศักย์ของไดโพล",
              "unit": "\\text{J}"
            }
          ],
          "derivationSteps": [
            "แรงกระทำต่อประจุบวกคือ F+ = +qE, แรงกระทำต่อประจุลบคือ F- = -qE แรงลัพธ์ F_net = 0",
            "จุดหมุนที่กึ่งกลาง: แขนของแรงประจุบวกคือ d/2 sin θ, ประจุลบคือ d/2 sin θ",
            "ทอร์กรวมรอบจุดศูนย์กลางคือ τ = F+(d/2 sin θ) + F-(d/2 sin θ) = q E d sin θ = p E sin θ",
            "ในรูปผลคูณเชิงเวกเตอร์: τ = p × E",
            "งานในการหมุนไดโพล: dW = τ dθ = p E sin θ dθ ⇒ U(θ) - U(90°) = -∫ p E sin θ dθ = -p E cos θ = -p · E"
          ]
        }
      ],
      "application": {
        "text": "เตาอบไมโครเวฟ (คลื่นความถี่ 2.45 GHz หมุนโมเลกุลน้ำมีขั้วกลับไปมาจนเกิดความร้อน), การวิเคราะห์โครงสร้างโมเลกุลโปรตีน, และการทำงานของผลึกเหลว (Liquid Crystal Displays - LCD)",
        "validWhen": "ระยะห่าง d มีค่าน้อยมากเมื่อเทียบกับระยะสังเกตการณ์ r (Dipole approximation d ≪ r)",
        "invalidWhen": "สนามไฟฟ้ามีความถี่สูงมากจนโมเลกุลหมุนตามไม่ทัน (Dielectric relaxation frequency)"
      },
      "example": {
        "problem": "โมเลกุลน้ำมีโมเมนต์ขั้วคู่ p = 6.2 × 10⁻³⁰ C·m วางตัวทำมุม 30° กับสนามไฟฟ้าสม่ำเสมอขนาด E = 5.0 × 10⁵ V/m จงหา: (ก) ทอร์กที่กระทำต่อโมเลกุล (ข) งานภายนอกที่ต้องใช้ในการหมุนโมเลกุลจากมุม 30° ไปยัง 180°",
        "steps": [
          "ข้อ (ก) ขนาดของทอร์ก: τ = p E sin θ",
          "แทนค่า: τ = (6.2 × 10⁻³⁰)(5.0 × 10⁵)(sin 30°) = (3.1 × 10⁻²⁴)(0.5) = 1.55 × 10⁻²⁴ N·m",
          "ข้อ (ข) งานภายนอก W_ext = ΔU = U_f - U_i",
          "พลังงานที่มุมเริ่มต้น 30°: U_i = -p E cos(30°) = -(6.2 × 10⁻³⁰)(5.0 × 10⁵)(0.866) = -2.685 × 10⁻²⁴ J",
          "พลังงานที่มุมสุดท้าย 180°: U_f = -p E cos(180°) = -p E (-1) = +p E = +(6.2 × 10⁻³⁰)(5.0 × 10⁵) = +3.10 × 10⁻²⁴ J",
          "งานภายนอก W_ext = U_f - U_i = 3.10 × 10⁻²⁴ - (-2.685 × 10⁻²⁴) = 5.785 × 10⁻²⁴ J",
          "ตอบ: ทอร์กเท่ากับ 1.55 × 10⁻²⁴ N·m และงานที่ต้องใช้เท่ากับ 5.79 × 10⁻²⁴ J"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><defs><marker id=\"arrow-blue\" viewBox=\"0 0 10 10\" refX=\"5\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><path d=\"M 0 0 L 10 5 L 0 10 z\" fill=\"#38bdf8\"/></marker></defs><line x1=\"50\" y1=\"40\" x2=\"350\" y2=\"40\" stroke=\"#38bdf8\" stroke-width=\"1.5\" marker-end=\"url(#arrow-blue)\"/><line x1=\"50\" y1=\"90\" x2=\"350\" y2=\"90\" stroke=\"#38bdf8\" stroke-width=\"1.5\" marker-end=\"url(#arrow-blue)\"/><text x=\"360\" y=\"65\" fill=\"#38bdf8\" font-size=\"12\">E</text><line x1=\"150\" y1=\"95\" x2=\"250\" y2=\"35\" stroke=\"#cbd5e1\" stroke-width=\"2.5\"/><circle cx=\"150\" cy=\"95\" r=\"9\" fill=\"#38bdf8\"/><text x=\"150\" y=\"99\" fill=\"#000\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">-</text><circle cx=\"250\" cy=\"35\" r=\"9\" fill=\"#ef4444\"/><text x=\"250\" y=\"39\" fill=\"#fff\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">+</text><path d=\"M 230 65 A 30 30 0 0 0 215 50\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><text x=\"235\" y=\"55\" fill=\"#f59e0b\" font-size=\"11\">θ</text></svg>",
        "diagramCaption": "ขั้วคู่ไฟฟ้าทำมุม θ ในสนามไฟฟ้าสม่ำเสมอได้รับทอร์กหมุน"
      },
      "observations": [
        "ขั้วคู่ไฟฟ้ามีเสถียรภาพสูงสุดเมื่อเวกเตอร์โมเมนต์ p ขนานกับสนาม E (θ = 0°)",
        "ที่ θ = 180° ขั้วคู่อยู่ในสมดุลไม่เสถียร (Unstable Equilibrium)"
      ]
    },
    {
      "id": "ch06-th04",
      "divisionId": "div-ch06-electrostatics-potentials",
      "divisionTitle": "ภาคที่ 1: ไฟฟ้าสถิต ศักย์ไฟฟ้า และกฎของเกาส์",
      "numberTh": "ทฤษฎีที่ 4",
      "type": "law",
      "titleTh": "กฎของเกาส์ ฟลักซ์ไฟฟ้า และการประยุกต์ความสมมาตร",
      "titleEn": "Gauss's Law, Electric Flux & High-Symmetry Applications",
      "summary": "ฟลักซ์ไฟฟ้าสุทธิผ่านผิวปิดสมมุติเท่ากับประจุสุทธิภายในหารด้วย ε₀ การคำนวณสนามของทรงกลม ทรงกระบอก และแผ่นราบ",
      "definition": {
        "text": "กฎของเกาส์ (Gauss's Law) ระบุว่า ฟลักซ์ไฟฟ้าสุทธิ (Net Electric Flux) ที่พุ่งทะลุผ่านผิวปิดสมมุติใดๆ (Gaussian Surface) ย่อมแปรผันตรงกับประจุไฟฟ้าสุทธิทั้งหมดที่ถูกโอบล้อมอยู่ภายในผิวปิดนั้น: ∮ E · dA = Q_enc / ε₀ กฎนี้เป็นหนึ่งในสี่สมการมูลฐานของแมกซ์เวลล์ ใช้คำนวณสนามไฟฟ้าอย่างง่ายดายในระบบที่มีความสมมาตรทางเรขาคณิตสูง"
      },
      "principle": {
        "text": "การประยุกต์กฎของเกาส์ตามความสมมาตร 3 รูปแบบหลัก:\n1. สมมาตรทรงกลม (Spherical Symmetry): ผิวเกาส์เซียนเป็นทรงกลมรัศมี r ⇒ $E(4\\pi r^2) = Q_{\\text{enc}}/\\varepsilon_0$\n2. สมมาตรทรงกระบอก (Cylindrical Symmetry): เส้นลวดยาวอนันต์หนาแน่น $\\lambda$ ⇒ $E(2\\pi r L) = \\lambda L /\\varepsilon_0 \\Rightarrow E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}$\n3. สมมาตรแผ่นราบ (Planar Symmetry): แผ่นฉนวนแบนราบอนันต์หนาแน่นประจุผิว $\\sigma$ ⇒ $2 E A = \\sigma A / \\varepsilon_0 \\Rightarrow E = \\frac{\\sigma}{2\\varepsilon_0}$ (สำหรับผิวตัวนำ $E = \\frac{\\sigma}{\\varepsilon_0}$)"
      },
      "formulas": [
        {
          "name": "กฎของเกาส์ในรูปอินทิกรัลและเชิงอนุพันธ์ (Integral & Differential Gauss's Law)",
          "latex": "\\oint_S \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0} \\iff \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}",
          "symbols": [
            {
              "sym": "\\oint_S \\mathbf{E} \\cdot d\\mathbf{A}",
              "desc": "ฟลักซ์ไฟฟ้าสุทธิผ่านผิวปิด",
              "unit": "\\text{N}\\cdot\\text{m}^2/\\text{C}"
            },
            {
              "sym": "Q_{\\text{enc}}",
              "desc": "ประจุรวมภายในผิวปิดเกาส์เซียน",
              "unit": "\\text{C}"
            },
            {
              "sym": "\\nabla \\cdot \\mathbf{E}",
              "desc": "ไดเวอร์เจนซ์ของสนามไฟฟ้า",
              "unit": "\\text{V/m}^2"
            },
            {
              "sym": "\\rho",
              "desc": "ความหนาแน่นประจุเชิงปริมาตร",
              "unit": "\\text{C/m}^3"
            }
          ],
          "derivationSteps": [
            "พิจารณาประจุจุดเดี่ยว +q อยู่ที่ศูนย์กลางผิวทรงกลมรัศมี r",
            "จากกฎคูลอมบ์ E = q / (4πε₀ r²) ตั้งฉากกับผิวทรงกลมทุกจุด",
            "ฟลักซ์ Φ_E = ∮ E dA = E ∮ dA = E (4π r²) = (q / 4πε₀ r²) (4π r²) = q / ε₀",
            "ใช้ทฤษฎีบทการลู่ออก (Divergence Theorem): ∮_S E · dA = ∫_V (∇ · E) dV = (1/ε₀) ∫_V ρ dV",
            "เทียบอินทิแกรนด์ทั้งสองข้าง จะได้รูปอนุพันธ์ ∇ · E = ρ / ε₀"
          ]
        },
        {
          "name": "กฎของเกาส์สำหรับไฟฟ้าในสสารและสนามการกระจัด (Gauss's Law in Dielectric Matter: ∇ · D = ρ_f)",
          "latex": "\\nabla \\cdot \\mathbf{D} = \\rho_f \\iff \\oint_S \\mathbf{D} \\cdot d\\mathbf{A} = Q_{f,\\text{enc}}, \\quad \\mathbf{D} = \\varepsilon_0 \\mathbf{E} + \\mathbf{P} = \\varepsilon \\mathbf{E}",
          "symbols": [
            {
              "sym": "\\mathbf{D}",
              "desc": "เวกเตอร์การกระจัดไฟฟ้า (Electric Displacement)",
              "unit": "\\text{C/m}^2"
            },
            {
              "sym": "\\rho_f",
              "desc": "ความหนาแน่นประจุอิสระเชิงปริมาตร (Free charge density)",
              "unit": "\\text{C/m}^3"
            },
            {
              "sym": "\\mathbf{P}",
              "desc": "ความหนาแน่นโพลาไรเซชัน (Polarisation density)",
              "unit": "\\text{C/m}^2"
            },
            {
              "sym": "\\varepsilon",
              "desc": "สภาพยอมทางไฟฟ้าของตัวกลางไดอิเล็กทริก (\\varepsilon = \\varepsilon_r \\varepsilon_0)",
              "unit": "\\text{F/m}"
            }
          ],
          "derivationSteps": [
            "ประจุในสสารแบ่งเป็นประจุอิสระและประจุผูกพันจากการโพลาไรซ์: ρ = ρ_f + ρ_b",
            "ความหนาแน่นประจุผูกพันระดับโมเลกุล: ρ_b = -∇ · P",
            "แทนลงในกฎของเกาส์ดั้งเดิม: ε₀ ∇ · E = ρ_f - ∇ · P ⇒ ∇ · (ε₀ E + P) = ρ_f",
            "นิยามเวกเตอร์การกระจัดไฟฟ้า: D ≡ ε₀ E + P",
            "นำไปสู่รูปคณิตศาสตร์บริสุทธิ์: ∇ · D = ρ_f (ดูบทพิสูจน์เชิงลึกในแท็บกลศาสตร์วิเคราะห์ หัวข้อ AF-06)"
          ]
        }
      ],
      "application": {
        "text": "เกราะกำบังไฟฟ้าสถิต (Faraday Cage), การคำนวณสนามในสายโคแอกเชียล (Coaxial Cable), ตัวเก็บประจุความดันสูง, และความปลอดภัยในห้องปฏิบัติการแรงดันสูง",
        "validWhen": "ผิวที่เลือกเป็นผิวปิดทางเรขาคณิต (Closed surface) และระบบมีความสมมาตรสูง",
        "invalidWhen": "ระบบไร้ความสมมาตรทางเรขาคณิต (การอินทิเกรตจะไม่สามารถดึงขนาด E ออกนอกเครื่องหมายอินทิกรัลได้)"
      },
      "example": {
        "problem": "เส้นลวดตัวนำยาวมากในแนวดิ่ง มีความหนาแน่นประจุเชิงเส้นสม่ำเสมอ λ = +5.0 μC/m จงหาสนามไฟฟ้าที่จุดห่างจากแกนลวด r = 10 cm",
        "steps": [
          "เลือกระบบพิกัดทรงกระบอกที่มีแกนร่วมกับเส้นลวด",
          "สร้างผิวเกาส์เซียนทรงกระบอกรัศมี r = 0.10 m ยาว L ล้อมรอบเส้นลวด",
          "ฟลักซ์ไฟฟ้าที่ผ่านฝาปิดหัวและท้ายของทรงกระบอกเป็นศูนย์ เนื่องจากเส้นแรงไฟฟ้าพุ่งในแนวรัศมีขนานกับฝาปิด",
          "ฟลักซ์พุ่งผ่านเฉพาะผิวด้านข้าง: Φ_E = E · (2π r L)",
          "ประจุภายในผิวทรงกระบอก: Q_enc = λ L",
          "จากกฎของเกาส์: E (2π r L) = λ L / ε₀ ⇒ E = λ / (2π ε₀ r)",
          "แทนค่า: E = (2 * k_e * λ) / r = (2 × 8.99 × 10⁹ × 5.0 × 10⁻⁶) / 0.10",
          "E = (89,900) / 0.10 = 8.99 × 10⁵ N/C",
          "ตอบ: ขนาดสนามไฟฟ้าเท่ากับ 8.99 × 10⁵ N/C พุ่งในแนวรัศมีออกจากเส้นลวด"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"200\" y1=\"10\" x2=\"200\" y2=\"120\" stroke=\"#f59e0b\" stroke-width=\"4\"/><text x=\"215\" y=\"25\" fill=\"#f59e0b\" font-size=\"11\">+λ</text><rect x=\"130\" y=\"30\" width=\"140\" height=\"70\" rx=\"20\" fill=\"none\" stroke=\"#38bdf8\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><line x1=\"200\" y1=\"65\" x2=\"270\" y2=\"65\" stroke=\"#94a3b8\" stroke-width=\"1\"/><text x=\"235\" y=\"60\" fill=\"#94a3b8\" font-size=\"10\">r</text><line x1=\"270\" y1=\"65\" x2=\"330\" y2=\"65\" stroke=\"#ec4899\" stroke-width=\"2\" marker-end=\"url(#arrow-pink)\"/><text x=\"295\" y=\"55\" fill=\"#ec4899\" font-size=\"10\">E</text></svg>",
        "diagramCaption": "ผิวเกาส์เซียนทรงกระบอกล้อมรอบเส้นลวดประจุยาวอนันต์"
      },
      "observations": [
        "สนามไฟฟ้าจากเส้นลวดแปรผกผันกับระยะทางกำลังหนึ่ง (1/r) ต่างจากประจุจุดที่แปรผกผันกับกำลังสอง (1/r²)",
        "ภายในตัวนำในสมดุลไฟฟ้าสถิต ฟลักซ์สุทธิและสนามไฟฟ้าเป็นศูนย์อย่างแน่นอน"
      ]
    },
    {
      "id": "ch06-th05",
      "divisionId": "div-ch06-electrostatics-potentials",
      "divisionTitle": "ภาคที่ 1: ไฟฟ้าสถิต ศักย์ไฟฟ้า และกฎของเกาส์",
      "numberTh": "ทฤษฎีที่ 5",
      "type": "concept",
      "titleTh": "ศักย์ไฟฟ้า ผลต่างศักย์ งานในการย้ายประจุ และผิวสมศักย์",
      "titleEn": "Electric Potential, Potential Difference, Work & Equipotentials",
      "summary": "ปริมาณสเกลาร์ศักย์ไฟฟ้า V = U/q งาน W = -qΔV ผิวสมศักย์ตั้งฉากกับเส้นสนามไฟฟ้า และศักย์ไฟฟ้าของประจุจุด",
      "definition": {
        "text": "ศักย์ไฟฟ้า (Electric Potential, V) คือพลังงานศักย์ไฟฟ้าต่อหนึ่งหน่วยประจุ ณ จุดใดๆ ในสนามไฟฟ้า โดยนิยามผ่านงานในการเคลื่อนย้ายประจุทดสอบบวกจากจุดอ้างอิง (มักกำหนดที่ระยะอนันต์ V(∞) = 0) มายังจุดนั้นโดยไม่เกิดความเร่ง: V = U/q = -∫ E · dl ผิวสมศักย์ (Equipotential Surface) คือผิวที่ทุกจุดบนผิวนั้นมีศักย์ไฟฟ้าเท่ากัน งานในการเลื่อนประจุบนผิวสมศักย์มีค่าเป็นศูนย์เสมอ และเส้นสนามไฟฟ้าจะตั้งฉากกับผิวสมศักย์ทุกจุด"
      },
      "principle": {
        "text": "หลักการสำคัญ:\n1. ศักย์ไฟฟ้าของประจุจุด: $V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}$\n2. ผลรวมสเกลาร์: ศักย์ไฟฟ้ารวมเป็นผลบวกเชิงพีชคณิตสเกลาร์ธรรมดา ไม่ต้องแยกเวกเตอร์ $V_{\\text{tot}} = \\sum_i \\frac{k q_i}{r_i}$\n3. ความสัมพันธ์กับงานภายนอก: $W_{\\text{ext}} = q \\Delta V = q(V_B - V_A)$\n4. ผิวสมศักย์ (Equipotential): ตัวนำในสมดุลไฟฟ้าสถิตคือปริมาตรสมศักย์ (Equipotential volume) และผิวของตัวนำคือผิวสมศักย์"
      },
      "formulas": [
        {
          "name": "ศักย์ไฟฟ้าและผลต่างศักย์ (Electric Potential & Potential Difference)",
          "latex": "V_B - V_A = -\\int_A^B \\mathbf{E} \\cdot d\\mathbf{l}, \\quad V(\\mathbf{r}) = \\frac{1}{4\\pi\\varepsilon_0} \\int \\frac{dq}{r}",
          "symbols": [
            {
              "sym": "V_B - V_A",
              "desc": "ผลต่างศักย์ไฟฟ้าระหว่างจุด B และ A",
              "unit": "\\text{V}"
            },
            {
              "sym": "\\mathbf{E}",
              "desc": "สนามไฟฟ้าตลอดเส้นทางการเคลื่อนที่",
              "unit": "\\text{N/C}"
            },
            {
              "sym": "d\\mathbf{l}",
              "desc": "เวกเตอร์การกระจัดย่อยตามเส้นทาง",
              "unit": "\\text{m}"
            }
          ],
          "derivationSteps": [
            "สนามไฟฟ้าสถิตเป็นแรงอนุรักษ์ (Conservative force) ซึ่ง ∇ × E = 0",
            "แรงไฟฟ้า F = qE งานที่แรงไฟฟ้าทำในการย้ายประจุจาก A ไป B คือ W_elec = ∫ F · dl = q ∫ E · dl",
            "การเปลี่ยนแปลงพลังงานศักย์ ΔU = -W_elec = -q ∫ E · dl",
            "หารด้วยประจุ q จะได้ผลต่างศักย์ ΔV = ΔU / q = -∫_A^B E · dl",
            "สำหรับประจุจุดเดี่ยว ให้จุดอ้างอิง A อยู่ที่อนันต์ r_A → ∞ และ V(∞) = 0: V(r) = -∫_∞^r (k q / r'²) dr' = k q / r"
          ]
        }
      ],
      "application": {
        "text": "แบตเตอรี่และเซลล์เคมีไฟฟ้า, เครื่องเร่งอนุภาคแวนเดอกราฟฟ์ (Van de Graaff Generator), และการตรวจคลื่นไฟฟ้าหัวใจ (Electrocardiogram - ECG)",
        "validWhen": "สนามไฟฟ้าสถิตไม่เปลี่ยนแปลงตามเวลา (Electrostatic regime)",
        "invalidWhen": "สนามแม่เหล็กเปลี่ยนแปลงตามเวลา (สนามไฟฟ้าเหนี่ยวนำไม่ใช่สนามอนุรักษ์ ∇ × E = -∂B/∂t ≠ 0 ศักย์ไฟฟ้าแบบสเกลาร์เดี่ยวจะไม่นิยามสมบูรณ์)"
      },
      "example": {
        "problem": "ทรงกลมตัวนำมีประจุรัศมี R = 15 cm มีศักย์ไฟฟ้าที่ผิว V = 300 V จงหาศักย์ไฟฟ้าที่: (ก) จุดศูนย์กลางทรงกลม (ข) จุดห่างจากศูนย์กลาง r = 45 cm",
        "steps": [
          "ข้อ (ก) ภายในเนื้อตัวนำในสมดุลไฟฟ้าสถิต สนามไฟฟ้า E = 0 N/C ทุกจุด",
          "จากความสัมพันธ์ ΔV = -∫ E · dl = 0 แสดงว่าศักย์ไฟฟ้าภายในตัวนำมีค่าคงที่เท่ากันทุกจุดตั้งแต่ศูนย์กลางจนถึงผิว",
          "ดังนั้น ศักย์ที่จุดศูนย์กลาง V_center = V_surface = 300 V",
          "ข้อ (ข) สำหรับจุดภายนอกตัวนำ (r ≥ R) ประจุประพฤติตัวเสมือนรวมกันที่จุดศูนย์กลาง V(r) = kQ / r",
          "ที่ผิว V(R) = kQ / R = 300 V ⇒ kQ = 300 * 0.15 = 45 V·m",
          "ที่ระยะ r = 45 cm = 0.45 m: V(0.45) = kQ / r = 45 / 0.45 = 100 V",
          "ตอบ: (ก) ศักย์ที่ศูนย์กลางเท่ากับ 300 V, (ข) ศักย์ที่ r = 45 cm เท่ากับ 100 V"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><circle cx=\"150\" cy=\"65\" r=\"40\" fill=\"#334155\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"150\" y=\"70\" fill=\"#38bdf8\" font-size=\"11\" text-anchor=\"middle\">V = 300 V</text><circle cx=\"150\" cy=\"65\" r=\"70\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3\"/><circle cx=\"150\" cy=\"65\" r=\"100\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1\" stroke-dasharray=\"3\"/><text x=\"260\" y=\"65\" fill=\"#f59e0b\" font-size=\"10\">V = 100 V (45 cm)</text></svg>",
        "diagramCaption": "ผิวสมศักย์รอบทรงกลมตัวนำที่มีศักย์คงที่ภายใน"
      },
      "observations": [
        "ศักย์ไฟฟ้าภายในเนื้อตัวนำตันและกลวงมีค่าเท่ากับศักย์ที่ผิวเสมอ ไม่ได้เป็นศูนย์เหมือนสนามไฟฟ้า",
        "การเคลื่อนที่ตามทิศทางสนามไฟฟ้า ศักย์ไฟฟ้าจะลดลงเสมอ"
      ]
    },
    {
      "id": "ch06-th06",
      "divisionId": "div-ch06-electrostatics-potentials",
      "divisionTitle": "ภาคที่ 1: ไฟฟ้าสถิต ศักย์ไฟฟ้า และกฎของเกาส์",
      "numberTh": "ทฤษฎีที่ 6",
      "type": "concept",
      "titleTh": "ความสัมพันธ์ระหว่างสนามไฟฟ้าและเกรเดียนต์ศักย์ไฟฟ้า (E = -∇V)",
      "titleEn": "Electric Field as Potential Gradient (E = -grad V)",
      "summary": "สนามไฟฟ้าคือลบของความชันศักย์ไฟฟ้า E = -dV/dx ใน 1 มิติ และ E = -∇V ใน 3 มิติ เส้นสนามไฟฟ้าพุ่งจากศักย์สูงไปศักย์ต่ำ",
      "definition": {
        "text": "สนามไฟฟ้าและศักย์ไฟฟ้ามีความสัมพันธ์กันอย่างลึกซึ้ง: สนามไฟฟ้าเป็นเวกเตอร์ที่ชี้ไปในทิศทางที่ศักย์ไฟฟ้าลดลงเร็วที่สุด โดยมีขนาดเท่ากับอัตราการเปลี่ยนแปลงของศักย์ไฟฟ้าเทียบกับระยะทาง (ลบของเกรเดียนต์ศักย์ไฟฟ้า): E = -∇V ในระบบพิกัดคาร์ทีเซียน E_x = -∂V/∂x, E_y = -∂V/∂y, E_z = -∂V/∂z ในสนามไฟฟ้าสม่ำเสมอ E = ΔV / d"
      },
      "principle": {
        "text": "หลักการสำคัญ:\n1. ใน 1 มิติ: $E_x = -\\frac{dV}{dx}$\n2. ใน 3 มิติ: $\\mathbf{E} = -\\nabla V = -\\left(\\frac{\\partial V}{\\partial x}\\hat{\\mathbf{i}} + \\frac{\\partial V}{\\partial y}\\hat{\\mathbf{j}} + \\frac{\\partial V}{\\partial z}\\hat{\\mathbf{k}}\\right)$\n3. สนามไฟฟ้าสม่ำเสมอระหว่างแผ่นคู่ขนาน: $E = \\frac{\\Delta V}{d}$\n4. หน่วยของสนามไฟฟ้า: $1\\text{ N/C} \\equiv 1\\text{ V/m}$ แสดงว่าความเข้มสนามไฟฟ้าคือความลาดชันของศักย์ต่อเมตร"
      },
      "formulas": [
        {
          "name": "สนามไฟฟ้าจากเกรเดียนต์ศักย์ (Electric Field from Potential Gradient)",
          "latex": "\\mathbf{E} = -\\nabla V = -\\left(\\frac{\\partial V}{\\partial x}\\hat{\\mathbf{i}} + \\frac{\\partial V}{\\partial y}\\hat{\\mathbf{j}} + \\frac{\\partial V}{\\partial z}\\hat{\\mathbf{k}}\\right)",
          "symbols": [
            {
              "sym": "\\mathbf{E}",
              "desc": "เวกเตอร์สนามไฟฟ้า",
              "unit": "\\text{V/m}"
            },
            {
              "sym": "\\nabla V",
              "desc": "เกรเดียนต์ของฟังก์ชันสเกลาร์ศักย์ไฟฟ้า",
              "unit": "\\text{V/m}"
            },
            {
              "sym": "\\partial V/\\partial x",
              "desc": "อนุพันธ์ย่อยของศักย์เทียบกับแกน x",
              "unit": "\\text{V/m}"
            }
          ],
          "derivationSteps": [
            "พิจารณาผลต่างศักย์ระหว่างจุดสองจุดที่อยู่ใกล้กันมาก dl = dx î + dy ĵ + dz k̂",
            "จากนิยาม: dV = -E · dl = -(E_x dx + E_y dy + E_z dz)",
            "จากกฎลูกโซ่ของแคลคูลัสหลายตัวแปร: dV = (∂V/∂x) dx + (∂V/∂y) dy + (∂V/∂z) dz",
            "เทียบสัมประสิทธิ์ของ dx, dy, dz จะได้ E_x = -∂V/∂x, E_y = -∂V/∂y, E_z = -∂V/∂z",
            "รวมเป็นเวกเตอร์: E = -∇V"
          ]
        }
      ],
      "application": {
        "text": "การวิเคราะห์โครงข่ายไฟฟ้าในสนามแผ่นคู่ขนาน, การออกแบบปืนอิเล็กตรอน (Electron Gun), หลอดสเปกโตรมิเตอร์มวล, และการจำลองศักย์ชีวภาพในเยื่อหุ้มเซลล์ประสาท",
        "validWhen": "ศักย์ไฟฟ้า V เป็นฟังก์ชันที่หาอนุพันธ์ได้ต่อเนื่องในปริภูมิ",
        "invalidWhen": "สนามแม่เหล็กเปลี่ยนแปลงตามเวลา (ต้องมีศักย์เวกเตอร์ A เสริมเป็น E = -∇V - ∂A/∂t)"
      },
      "example": {
        "problem": "ศักย์ไฟฟ้าในบริเวณหนึ่งกำหนดโดย V(x, y, z) = 3x²y - yz² (หน่วยโวลต์ เมื่อ x,y,z เป็นเมตร) จงหาสนามไฟฟ้า E ที่จุด (1, -2, 2) m",
        "steps": [
          "หาอนุพันธ์ย่อยตามแต่ละแกน:",
          "E_x = -∂V/∂x = -∂/∂x (3x²y - yz²) = -(6xy) = -6xy",
          "E_y = -∂V/∂y = -∂/∂y (3x²y - yz²) = -(3x² - z²) = -3x² + z²",
          "E_z = -∂V/∂z = -∂/∂z (3x²y - yz²) = -(-2yz) = +2yz",
          "แทนพิกัด x = 1, y = -2, z = 2:",
          "E_x = -6(1)(-2) = +12 V/m",
          "E_y = -3(1)² + (2)² = -3 + 4 = +1 V/m",
          "E_z = +2(-2)(2) = -8 V/m",
          "เวกเตอร์สนามไฟฟ้า: E = 12 î + 1 ĵ - 8 k̂ V/m",
          "ขนาดของสนามไฟฟ้า: |E| = √(12² + 1² + (-8)²) = √(144 + 1 + 64) = √209 ≈ 14.46 V/m",
          "ตอบ: สนามไฟฟ้าที่จุดดังกล่าวคือ E = 12î + ĵ - 8k̂ V/m มีขนาดประมาณ 14.5 V/m"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"50\" y1=\"100\" x2=\"150\" y2=\"30\" stroke=\"#38bdf8\" stroke-width=\"2\"/><line x1=\"120\" y1=\"110\" x2=\"220\" y2=\"40\" stroke=\"#38bdf8\" stroke-width=\"2\"/><line x1=\"190\" y1=\"120\" x2=\"290\" y2=\"50\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"140\" y=\"25\" fill=\"#38bdf8\" font-size=\"10\">V = 30 V</text><text x=\"210\" y=\"35\" fill=\"#38bdf8\" font-size=\"10\">V = 20 V</text><text x=\"280\" y=\"45\" fill=\"#38bdf8\" font-size=\"10\">V = 10 V</text><line x1=\"100\" y1=\"65\" x2=\"240\" y2=\"85\" stroke=\"#ef4444\" stroke-width=\"2.5\" marker-end=\"url(#arrow-red)\"/><text x=\"170\" y=\"105\" fill=\"#ef4444\" font-size=\"11\" font-weight=\"bold\">E = -∇V</text></svg>",
        "diagramCaption": "เวกเตอร์สนามไฟฟ้าชี้ตั้งฉากกับผิวสมศักย์จากศักย์สูงไปศักย์ต่ำ"
      },
      "observations": [
        "เครื่องหมายลบมีความสำคัญยิ่งทางฟิสิกส์ บ่งบอกว่าประจุบวกจะถูกเร่งจากบริเวณศักย์สูงไปยังบริเวณศักย์ต่ำ",
        "หากผิวสมศักย์อยู่ชิดกันมาก แสดงว่าสนามไฟฟ้าบริเวณนั้นมีความเข้มสูง"
      ]
    },
    {
      "id": "ch06-th07",
      "divisionId": "div-ch06-electrostatics-potentials",
      "divisionTitle": "ภาคที่ 1: ไฟฟ้าสถิต ศักย์ไฟฟ้า และกฎของเกาส์",
      "numberTh": "ทฤษฎีที่ 7",
      "type": "concept",
      "titleTh": "พลังงานไฟฟ้าสถิตสะสมและพลังงานการรวมประจุ",
      "titleEn": "Electrostatic Potential Energy & Energy of Charge Assembly",
      "summary": "งานภายนอกในการนำประจุจากอนันต์มารวมกัน U = (1/2)∑ q_i V_i และความหนาแน่นพลังงานในสนามไฟฟ้า u_E = (1/2)ε₀E²",
      "definition": {
        "text": "พลังงานไฟฟ้าสถิตสะสม (Electrostatic Potential Energy) ของระบบประจุ คือปริมาณงานสุทธิที่แรงภายนอกต้องทำในการนำประจุไฟฟ้าแต่ละตัวจากระยะอนันต์ (ซึ่งไม่มีแรงอันตรกิริยา) เข้ามาจัดเรียงตัวยังตำแหน่งที่กำหนดโดยไม่มีความเร่ง พลังงานนี้สามารถมองว่าสะสมอยู่ในตัวประจุ หรือสะสมอยู่ในสนามไฟฟ้าด้วยความหนาแน่นพลังงาน u_E = (1/2) ε₀ E²"
      },
      "principle": {
        "text": "หลักการคำนวณพลังงานไฟฟ้าสถิต:\n1. สำหรับคู่ประจุสองตัว: $U = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_1 q_2}{r_{12}}$\n2. สำหรับระบบกลุ่มประจุจุด N ตัว: $U = \\frac{1}{2} \\sum_{i=1}^N q_i V(\\mathbf{r}_i) = \\sum_{i < j} \\frac{k q_i q_j}{r_{ij}}$\n3. พลังงานสะสมในตัวนำทรงกลมรัศมี R: $U = \\frac{1}{2} \\frac{Q^2}{4\\pi\\varepsilon_0 R} = \\frac{1}{2} Q V$\n4. ในรูปอินทิกรัลความหนาแน่นพลังงานสนาม: $U = \\frac{1}{2} \\varepsilon_0 \\int_{\\text{all space}} E^2 dV$"
      },
      "formulas": [
        {
          "name": "พลังงานศักย์ไฟฟ้าสถิตและความหนาแน่นพลังงาน (Electrostatic Energy & Density)",
          "latex": "U = \\sum_{i < j} \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_i q_j}{r_{ij}}, \\quad u_E = \\frac{1}{2} \\varepsilon_0 E^2",
          "symbols": [
            {
              "sym": "U",
              "desc": "พลังงานศักย์ไฟฟ้าสถิตรวมของระบบ",
              "unit": "\\text{J}"
            },
            {
              "sym": "u_E",
              "desc": "ความหนาแน่นพลังงานต่อหนึ่งหน่วยปริมาตร",
              "unit": "\\text{J/m}^3"
            },
            {
              "sym": "E",
              "desc": "ขนาดสนามไฟฟ้าในบริเวณนั้น",
              "unit": "\\text{V/m}"
            }
          ],
          "derivationSteps": [
            "นำประจุ q₁ มาวางที่ r₁: ไม่ต้องทำงานเพราะยังไม่มีสนาม W₁ = 0",
            "นำประจุ q₂ มาที่ r₂: ทำงานต้านสนามของ q₁: W₂ = q₂ V₁(r₂) = k q₁ q₂ / r₁₂",
            "นำประจุ q₃ มาที่ r₃: ทำงานต้านสนามของทั้ง q₁ และ q₂: W₃ = k q₁ q₃ / r₁₃ + k q₂ q₃ / r₂₃",
            "รวมงานทั้งหมด: U = W₁ + W₂ + W₃ = ∑_{i < j} (k q_i q_j / r_{ij})",
            "เมื่อแปลงเป็นตัวนำต่อเนื่องและใช้ทฤษฎีบทการลู่ออก จะได้รูปแบบบูรณาการเชิงสนาม U = (1/2) ε₀ ∫ E² dV"
          ]
        }
      ],
      "application": {
        "text": "พลังงานยึดเหนี่ยวในผลึกเกลือโซเดียมคลอไรด์ (Madelung constant), การเก็บกักพลังงานในแฟลชกล้องถ่ายรูป, พลังงานในปรากฏการณ์ฟ้าผ่า, และขีดจำกัดพลังงานของซูเปอร์คาปาซิเตอร์",
        "validWhen": "ประจุอยู่ในสมดุลสถิตและไม่มีการสูญเสียพลังงานจากการแผ่รังสีแม่เหล็กไฟฟ้า",
        "invalidWhen": "การจำลองประจุจุดคลาสสิกที่ r → 0 ซึ่งจะให้พลังงานในตัวเองเป็นอนันต์ (Classical self-energy catastrophe)"
      },
      "example": {
        "problem": "ประจุสามตัวขนาด +2.0 μC แต่ละตัว วางอยู่ที่จุดยอดของรูปสามเหลี่ยมด้านเท่าที่มีความยาวด้านละ a = 30 cm จงหาพลังงานไฟฟ้าสถิตรวมของระบบนี้",
        "steps": [
          "จำนวนคู่ของประจุในระบบ 3 ตัว: N(N-1)/2 = 3(2)/2 = 3 คู่",
          "เนื่องจากสามเหลี่ยมด้านเท่า ระยะห่างระหว่างทุกคู่มีค่าเท่ากันคือ r₁₂ = r₂₃ = r₁₃ = a = 0.30 m",
          "ขนาดประจุเท่ากันทุกตัว: q₁ = q₂ = q₃ = 2.0 × 10⁻⁶ C",
          "พลังงานรวม: U = k (q₁q₂/a + q₂q₃/a + q₁q₃/a) = 3 * k * q² / a",
          "แทนค่าตัวเลข: U = 3 × (8.99 × 10⁹) × (2.0 × 10⁻⁶)² / 0.30",
          "U = 3 × (8.99 × 10⁹) × (4.0 × 10⁻¹²) / 0.30",
          "U = (107.88 × 10⁻³) / 0.30 = 0.10788 / 0.30 = 0.3596 J ≈ 0.36 J",
          "ตอบ: พลังงานไฟฟ้าสถิตสะสมรวมของระบบนี้เท่ากับ 0.36 จูล"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><polygon points=\"200,20 130,110 270,110\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><circle cx=\"200\" cy=\"20\" r=\"10\" fill=\"#ef4444\"/><text x=\"200\" y=\"24\" fill=\"#fff\" font-size=\"10\" text-anchor=\"middle\">+q</text><circle cx=\"130\" cy=\"110\" r=\"10\" fill=\"#ef4444\"/><text x=\"130\" y=\"114\" fill=\"#fff\" font-size=\"10\" text-anchor=\"middle\">+q</text><circle cx=\"270\" cy=\"110\" r=\"10\" fill=\"#ef4444\"/><text x=\"270\" y=\"114\" fill=\"#fff\" font-size=\"10\" text-anchor=\"middle\">+q</text><text x=\"200\" y=\"80\" fill=\"#f59e0b\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">U = 3kq²/a = +0.36 J</text></svg>",
        "diagramCaption": "พลังงานรวมประจุไฟฟ้าบวก 3 ตัวบนยอดสามเหลี่ยมด้านเท่า"
      },
      "observations": [
        "เครื่องหมายบวกของพลังงานแสดงว่าต้องใช้แรงภายนอกทำงานต้านแรงผลักในการนำประจุเข้ามารวมกัน",
        "หากปล่อยประจุให้เป็นอิสระ พลังงานศักย์นี้จะเปลี่ยนรูปไปเป็นพลังงานจลน์ของประจุที่วิ่งแยกย้ายกันออกไป"
      ]
    },
    {
      "id": "ch06-th08",
      "divisionId": "div-ch06-capacitors-dc-circuits",
      "divisionTitle": "ภาคที่ 2: ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง",
      "numberTh": "ทฤษฎีที่ 8",
      "type": "concept",
      "titleTh": "ความจุไฟฟ้าและตัวเก็บประจุแผ่นคู่ขนาน",
      "titleEn": "Capacitance & Parallel-Plate Capacitors",
      "summary": "นิยามความจุ C = Q/V ตัวเก็บประจุแผ่นคู่ขนาน C = ε₀A/d และการกระจายสนามไฟฟ้าสม่ำเสมอระหว่างแผ่น",
      "definition": {
        "text": "ความจุไฟฟ้า (Capacitance, C) คือความสามารถของระบบตัวนำในการเก็บสะสมประจุไฟฟ้าต่อหนึ่งหน่วยผลต่างศักย์ไฟฟ้าระหว่างตัวนำ: C = Q / V มีหน่วยเป็นฟารัด (Farad, F = C/V) สำหรับตัวเก็บประจุแผ่นคู่ขนานที่มีพื้นที่แผ่น A และระยะห่าง d ในสุญญากาศ ความจุขึ้นอยู่กับมิติทางเรขาคณิตล้วนๆ: C = ε₀ A / d"
      },
      "principle": {
        "text": "หลักการสำคัญของตัวเก็บประจุ:\n1. นิยามทั่วไป: $C = \\frac{Q}{\\Delta V}$ เมื่อ $Q$ คือขนาดประจุบนแผ่นใดแผ่นหนึ่ง\n2. ตัวเก็บประจุแผ่นคู่ขนาน (Parallel-Plate): $C = \\frac{\\varepsilon_0 A}{d}$\n3. สนามไฟฟ้าระหว่างแผ่น: $E = \\frac{\\sigma}{\\varepsilon_0} = \\frac{Q}{\\varepsilon_0 A} = \\frac{V}{d}$\n4. ความจุของทรงกลมตัวนำเดี่ยวรัศมี R: $C = 4\\pi\\varepsilon_0 R$ (เทียบกับตัวนำอนันต์ที่ V=0)"
      },
      "formulas": [
        {
          "name": "ความจุไฟฟ้าของแผ่นคู่ขนาน (Parallel-Plate Capacitance)",
          "latex": "C = \\frac{\\varepsilon_0 A}{d}, \\quad E = \\frac{V}{d}",
          "symbols": [
            {
              "sym": "C",
              "desc": "ความจุไฟฟ้า",
              "unit": "\\text{F}"
            },
            {
              "sym": "\\varepsilon_0",
              "desc": "สภาพยอมสุญญากาศ",
              "unit": "\\text{F/m}"
            },
            {
              "sym": "A",
              "desc": "พื้นที่หน้าตัดของแต่ละแผ่น",
              "unit": "\\text{m}^2"
            },
            {
              "sym": "d",
              "desc": "ระยะห่างระหว่างแผ่นตัวนำ",
              "unit": "\\text{m}"
            }
          ],
          "derivationSteps": [
            "กำหนดให้แผ่นตัวนำมีประจุ +Q และ -Q กระจายสม่ำเสมอด้วยความหนาแน่นผิว σ = Q/A",
            "จากกฎของเกาส์ สนามไฟฟ้าระหว่างแผ่นคู่ขนานคือ E = σ/ε₀ = Q / (ε₀ A)",
            "ผลต่างศักย์ไฟฟ้าระหว่างแผ่นคือ V = ∫ E dl = E * d = (Q d) / (ε₀ A)",
            "จากนิยาม C = Q / V: แทนค่า V ลงไป จะได้ C = Q / [Q d / (ε₀ A)] = ε₀ A / d"
          ]
        }
      ],
      "application": {
        "text": "หน้าจอสัมผัสแบบเก็บประจุ (Capacitive Touchscreen), แป้นพิมพ์คอมพิวเตอร์, เซนเซอร์วัดแรงดันและการเคลื่อนที่ระดับไมครอน (MEMS Accelerometer)",
        "validWhen": "มิติความกว้างยาวของแผ่นมีขนาดใหญ่กว่าระยะห่าง d มาก (ละเว้นขอบสนาม Fringing field)",
        "invalidWhen": "ระยะห่าง d ใกล้เคียงกับขนาดแผ่น (ขอบสนามจะส่งผลให้ความจุจริงสูงกว่าสูตรอุดมคติประมาณ 5-10%)"
      },
      "example": {
        "problem": "ตัวเก็บประจุแผ่นคู่ขนานมีพื้นที่แผ่น A = 40 cm² ห่างกัน d = 1.0 mm ต่อเข้ากับแบตเตอรี่ 12 V จงหา: (ก) ความจุไฟฟ้า C (ข) ประจุสะสม Q (ค) สนามไฟฟ้าระหว่างแผ่น E",
        "steps": [
          "แปลงหน่วย: A = 40 × 10⁻⁴ m² = 4.0 × 10⁻³ m², d = 1.0 × 10⁻³ m",
          "ข้อ (ก) ความจุไฟฟ้า: C = ε₀ A / d = (8.854 × 10⁻¹²)(4.0 × 10⁻³) / (1.0 × 10⁻³) = 3.54 × 10⁻¹¹ F = 35.4 pF",
          "ข้อ (ข) ประจุสะสม: Q = C V = (35.4 × 10⁻¹² F)(12 V) = 4.25 × 10⁻¹⁰ C = 0.425 nC",
          "ข้อ (ค) สนามไฟฟ้า: E = V / d = 12 / (1.0 × 10⁻³) = 1.2 × 10⁴ V/m = 12 kV/m",
          "ตอบ: (ก) ความจุ 35.4 pF, (ข) ประจุสะสม 0.425 nC, (ค) สนามไฟฟ้า 12 kV/m"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><rect x=\"120\" y=\"20\" width=\"12\" height=\"90\" fill=\"#ef4444\" rx=\"2\"/><rect x=\"220\" y=\"20\" width=\"12\" height=\"90\" fill=\"#38bdf8\" rx=\"2\"/><line x1=\"140\" y1=\"45\" x2=\"210\" y2=\"45\" stroke=\"#f59e0b\" stroke-width=\"1.5\" marker-end=\"url(#arrow-orange)\"/><line x1=\"140\" y1=\"65\" x2=\"210\" y2=\"65\" stroke=\"#f59e0b\" stroke-width=\"1.5\" marker-end=\"url(#arrow-orange)\"/><line x1=\"140\" y1=\"85\" x2=\"210\" y2=\"85\" stroke=\"#f59e0b\" stroke-width=\"1.5\" marker-end=\"url(#arrow-orange)\"/><text x=\"175\" y=\"60\" fill=\"#f59e0b\" font-size=\"11\">E</text><text x=\"90\" y=\"65\" fill=\"#ef4444\" font-size=\"12\" font-weight=\"bold\">+Q</text><text x=\"245\" y=\"65\" fill=\"#38bdf8\" font-size=\"12\" font-weight=\"bold\">-Q</text></svg>",
        "diagramCaption": "ตัวเก็บประจุแผ่นคู่ขนานแสดงประจุและสนามไฟฟ้าสม่ำเสมอระหว่างแผ่น"
      },
      "observations": [
        "ความจุขึ้นอยู่กับเรขาคณิต (ขนาด รูปทรง ระยะห่าง) และชนิดตัวกลางระหว่างแผ่นเท่านั้น ไม่ได้ขึ้นกับ V หรือ Q",
        "การลดระยะห่าง d ลงครึ่งหนึ่งจะทำให้ความจุเพิ่มขึ้นเป็น 2 เท่า"
      ]
    },
    {
      "id": "ch06-th09",
      "divisionId": "div-ch06-capacitors-dc-circuits",
      "divisionTitle": "ภาคที่ 2: ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง",
      "numberTh": "ทฤษฎีที่ 9",
      "type": "concept",
      "titleTh": "ไดอิเล็กทริก โพลาไรเซชัน และความเข้มเบรกดาวน์",
      "titleEn": "Dielectrics, Polarization & Dielectric Breakdown",
      "summary": "การใส่ฉนวนไดอิเล็กทริกเพิ่มความจุ C = κC₀ การเกิดประจุเหนี่ยวนำผูกพัน และขีดจำกัดความเข้มสนามเบรกดาวน์",
      "definition": {
        "text": "สารไดอิเล็กทริก (Dielectric) คือสารฉนวนไฟฟ้าที่เมื่อนำไปวางในสนามไฟฟ้า โมเลกุลจะเกิดการจัดเรียงขั้วคู่ใหม่ (Electric Polarization) ทำให้เกิดประจุเหนี่ยวนำผูกพัน (Bound charge) บนผิวฉนวน ซึ่งสร้างสนามไฟฟ้าย่อยต้านสนามภายนอก ส่งผลให้สนามไฟฟ้ารวมภายในลดลงเหลือ E = E₀ / κ และเพิ่มความจุไฟฟ้าของระบบขึ้นเป็น C = κ C₀ โดยที่ κ คือค่าคงที่ไดอิเล็กทริก (Dielectric Constant)"
      },
      "principle": {
        "text": "พฤติกรรมของไดอิเล็กทริกแบ่งเป็น 2 กรณีสำคัญ:\n1. กรณีต่อกับแบตเตอรี่ค้างไว้ ($V = \\text{const}$): ความต่างศักย์คงที่, ความจุเพิ่มเป็น $\\kappa C_0$, ประจุเพิ่มเป็น $Q = \\kappa Q_0$, พลังงานเพิ่มขึ้น\n2. กรณีตัดแบตเตอรี่ออกก่อนสอดแผ่น ($Q = \\text{const}$): ประจุคงที่, ความจุเพิ่มเป็น $\\kappa C_0$, ความต่างศักย์ลดลงเหลือ $V = V_0 / \\kappa$, พลังงานลดลง\n3. สภาพทนไดอิเล็กทริก (Dielectric Strength): ค่าสนามไฟฟ้าสูงสุดที่ฉนวนทนได้ก่อนจะเกิดการเบรกดาวน์ (Breakdown) กลายเป็นตัวนำ (อากาศแห้ง ≈ 3 MV/m, ไมกา ≈ 100 MV/m)"
      },
      "formulas": [
        {
          "name": "ความจุและสนามเมื่อมีสารไดอิเล็กทริก (Dielectric Capacitance & Field)",
          "latex": "C = \\kappa C_0 = \\varepsilon A / d, \\quad E = \\frac{E_0}{\\kappa}, \\quad \\sigma_{\\text{ind}} = \\sigma\\left(1 - \\frac{1}{\\kappa}\\right)",
          "symbols": [
            {
              "sym": "\\kappa",
              "desc": "ค่าคงที่ไดอิเล็กทริกของฉนวน (κ ≥ 1)",
              "unit": "—"
            },
            {
              "sym": "C_0",
              "desc": "ความจุเมื่อเป็นสุญญากาศ",
              "unit": "\\text{F}"
            },
            {
              "sym": "E_0",
              "desc": "สนามไฟฟ้าเดิมก่อนใส่ไดอิเล็กทริก",
              "unit": "\\text{V/m}"
            },
            {
              "sym": "\\sigma_{\\text{ind}}",
              "desc": "ความหนาแน่นประจุเหนี่ยวนำผูกพันบนผิวฉนวน",
              "unit": "\\text{C/m}^2"
            }
          ],
          "derivationSteps": [
            "เมื่อใส่ฉนวน สนามภายนอก E₀ ทำให้เกิดการโพลาไรซ์ P สร้างสนามต้าน E_ind = σ_ind / ε₀",
            "สนามรวมภายในเนื้อฉนวน: E = E₀ - E_ind = E₀ / κ",
            "จัดรูป: σ_ind / ε₀ = E₀ (1 - 1/κ) = (σ / ε₀) (1 - 1/κ) ⇒ σ_ind = σ(1 - 1/κ)",
            "ผลต่างศักย์ลดลง V = E d = (E₀/κ) d = V₀ / κ",
            "ความจุใหม่ C = Q / V = Q / (V₀/κ) = κ (Q/V₀) = κ C₀"
          ]
        }
      ],
      "application": {
        "text": "การผลิตตัวเก็บประจุเซรามิกและอิเล็กโทรไลต์ขนาดกะทัดรัด, ฉนวนในหม้อแปลงไฟฟ้าแรงสูง (น้ำมันหม้อแปลง), และไมโครอิเล็กทรอนิกส์ไฮเทค (High-k Dielectrics ในทรานซิสเตอร์)",
        "validWhen": "สนามไฟฟ้าไม่เกินค่า Dielectric Strength ของวัสดุ และเป็นไดอิเล็กทริกเชิงเส้นสม่ำเสมอ (Linear Isotropic Dielectric)",
        "invalidWhen": "สนามไฟฟ้าเกินค่าวิกฤต เกิดการสปาร์กอาร์กทำลายเนื้อสารอย่างถาวร"
      },
      "example": {
        "problem": "ตัวเก็บประจุแผ่นคู่ขนานต่อกับแบตเตอรี่ 24 V จนประจุเต็ม ได้ประจุ Q₀ = 120 nC จากนั้น 'ปลดแบตเตอรี่ออก' แล้วสอดแผ่นไดอิเล็กทริกที่มีค่า κ = 3.0 เข้าไปจนเต็มช่องว่าง จงหา: (ก) ประจุใหม่ Q (ข) ความต่างศักย์ใหม่ V (ค) อัตราส่วนพลังงานใหม่ต่อเดิม U/U₀",
        "steps": [
          "เนื่องจาก 'ปลดแบตเตอรี่ออกแล้ว' ประจุบนแผ่นตัวนำจึงไม่มีทางหนีไปไหนได้: Q = Q₀ = 120 nC",
          "ความจุใหม่เพิ่มขึ้นเป็น: C = κ C₀ = 3.0 C₀",
          "ความต่างศักย์ใหม่: V = Q / C = Q₀ / (3.0 C₀) = V₀ / 3.0 = 24 / 3.0 = 8.0 V",
          "พลังงานเดิม: U₀ = (1/2) Q₀ V₀",
          "พลังงานใหม่: U = (1/2) Q V = (1/2) Q₀ (V₀ / κ) = U₀ / κ = U₀ / 3.0",
          "ดังนั้น อัตราส่วน U / U₀ = 1/3 ≈ 0.333",
          "ตอบ: (ก) ประจุคงที่ 120 nC, (ข) ความต่างศักย์ลดเหลือ 8.0 V, (ค) พลังงานลดเหลือ 1/3 ของเดิม (พลังงานที่หายไปถูกใช้ไปในการดูดแผ่นไดอิเล็กทริกเข้าไป)"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><rect x=\"120\" y=\"20\" width=\"10\" height=\"90\" fill=\"#ef4444\"/><rect x=\"230\" y=\"20\" width=\"10\" height=\"90\" fill=\"#38bdf8\"/><rect x=\"135\" y=\"25\" width=\"90\" height=\"80\" fill=\"#4ade80\" opacity=\"0.6\"/><text x=\"180\" y=\"70\" fill=\"#ffffff\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">κ = 3.0</text><text x=\"90\" y=\"65\" fill=\"#ef4444\" font-size=\"11\">Q=120nC</text><text x=\"290\" y=\"65\" fill=\"#38bdf8\" font-size=\"11\">V=8V</text></svg>",
        "diagramCaption": "แผ่นไดอิเล็กทริกสอดคั่นกลางลดความต่างศักย์และลดพลังงานสะสม (เมื่อ Q คงที่)"
      },
      "observations": [
        "ถ้าต่อแบตเตอรี่ค้างไว้ พลังงานจะเพิ่มขึ้นเป็น κ เท่า (แบตเตอรี่ทำงานจ่ายประจุเพิ่ม)",
        "ถ้าตัดแบตเตอรี่ออก พลังงานจะลดลงเหลือ 1/κ เท่า (แรงไฟฟ้าดึงดูดแผ่นไดอิเล็กทริกเข้าหาตัวเก็บประจุ)"
      ]
    },
    {
      "id": "ch06-th10",
      "divisionId": "div-ch06-capacitors-dc-circuits",
      "divisionTitle": "ภาคที่ 2: ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง",
      "numberTh": "ทฤษฎีที่ 10",
      "type": "concept",
      "titleTh": "การต่อตัวเก็บประจุแบบอนุกรม/ขนาน และพลังงานสะสม",
      "titleEn": "Capacitor Combinations & Stored Electrostatic Energy",
      "summary": "กฎการรวมความจุแบบขนาน C_eq = ∑C_i แบบอนุกรม 1/C_eq = ∑1/C_i และพลังงาน U = (1/2)CV²",
      "definition": {
        "text": "การต่อตัวเก็บประจุสามารถทำได้สองรูปแบบพื้นฐาน: การต่อแบบขนาน (Parallel) ซึ่งตัวเก็บประจุทุกตัวรับความต่างศักย์ร่วมกัน V เท่ากัน ความจุสมมูลเกิดจากผลบวก C_eq = C₁ + C₂ + ... ส่วนการต่อแบบอนุกรม (Series) ทุกตัวเก็บประจุมีประจุ Q เท่ากัน ความจุสมมูลหาจาก 1/C_eq = 1/C₁ + 1/C₂ + ... พลังงานไฟฟ้าสถิตสะสมคำนวณได้จาก U = (1/2) Q V = (1/2) C V² = Q² / (2C)"
      },
      "principle": {
        "text": "การเปรียบเทียบระหว่างอนุกรมและขนาน:\n1. แบบขนาน: $V_1 = V_2 = V$, $Q_{\\text{tot}} = Q_1 + Q_2$, $C_{\\text{eq}} = C_1 + C_2$ (ความจุสมมูลมีค่ามากกว่าตัวที่มากที่สุดเสมอ)\n2. แบบอนุกรม: $Q_1 = Q_2 = Q$, $V_{\\text{tot}} = V_1 + V_2$, $\\frac{1}{C_{\\text{eq}}} = \\frac{1}{C_1} + \\frac{1}{C_2}$ (ความจุสมมูลน้อยกว่าตัวที่น้อยที่สุดเสมอ)\n3. พลังงานสะสมรวม: $U_{\\text{tot}} = \\sum U_i$ เสมอ ไม่ว่าจะต่อแบบอนุกรมหรือขนาน"
      },
      "formulas": [
        {
          "name": "ความจุสมมูลและพลังงานสะสม (Equivalent Capacitance & Stored Energy)",
          "latex": "C_{\\text{p}} = \\sum_{i} C_i, \\quad \\frac{1}{C_{\\text{s}}} = \\sum_{i} \\frac{1}{C_i}, \\quad U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C}",
          "symbols": [
            {
              "sym": "C_{\\text{p}}",
              "desc": "ความจุสมมูลแบบขนาน",
              "unit": "\\text{F}"
            },
            {
              "sym": "C_{\\text{s}}",
              "desc": "ความจุสมมูลแบบอนุกรม",
              "unit": "\\text{F}"
            },
            {
              "sym": "U",
              "desc": "พลังงานศักย์ไฟฟ้าสถิตสะสม",
              "unit": "\\text{J}"
            }
          ],
          "derivationSteps": [
            "พิจารณาการประจุตัวเก็บประจุจาก q = 0 ถึง Q",
            "งานย่อยในการเพิ่มประจุ dq เมื่อมีความต่างศักย์ v = q/C คือ dW = v dq = (q/C) dq",
            "อินทิเกรตงานทั้งหมด: W = ∫₀^Q (q/C) dq = [q² / 2C]₀^Q = Q² / (2C)",
            "แทน Q = C V: U = (1/2) C V² = (1/2) Q V",
            "ความหนาแน่นพลังงาน u_E = U / (Ad) = (1/2)(ε₀A/d)(Ed)² / (Ad) = (1/2) ε₀ E²"
          ]
        }
      ],
      "application": {
        "text": "เครื่องกระตุกหัวใจด้วยไฟฟ้า (Defibrillator จ่ายพลังงานสะสม ~360 J ภายในเสี้ยววินาที), หลอดไฟแฟลชสตูดิโอ, และวงจรจ่ายพลังงานสำรองฉุกเฉิน (UPS)",
        "validWhen": "ความต่างศักย์ไม่เกินขีดจำกัดพิกัดทนแรงดัน (Voltage rating) ของตัวเก็บประจุแต่ละตัว",
        "invalidWhen": "ความต่างศักย์เกินพิกัด จะทำให้ตัวเก็บประจุทะลุเสียหาย"
      },
      "example": {
        "problem": "ตัวเก็บประจุสองตัว C₁ = 6.0 μF และ C₂ = 12.0 μF ต่ออนุกรมกัน แล้วต่อเข้ากับความต่างศักย์ 18 V จงหา: (ก) ความจุสมมูล (ข) ประจุบนตัวเก็บประจุแต่ละตัว (ค) พลังงานรวมที่สะสมในระบบ",
        "steps": [
          "ข้อ (ก) หาความจุสมมูลแบบอนุกรม: 1/C_s = 1/C₁ + 1/C₂ = 1/6 + 1/12 = 3/12 = 1/4 ⇒ C_s = 4.0 μF",
          "ข้อ (ข) หาประจุรวม: Q_tot = C_s * V = (4.0 μF)(18 V) = 72 μC",
          "ในการต่อแบบอนุกรม ประจุบนแต่ละตัวมีค่าเท่ากัน: Q₁ = Q₂ = Q_tot = 72 μC",
          "หาความต่างศักย์ตกคร่อมแต่ละตัวเพื่อตรวจสอบ: V₁ = Q/C₁ = 72/6 = 12 V, V₂ = Q/C₂ = 72/12 = 6 V (ผลรวม 12+6 = 18 V ถูกต้อง)",
          "ข้อ (ค) พลังงานสะสมรวม: U_tot = (1/2) C_s V² = (1/2) (4.0 × 10⁻⁶)(18)² = (2.0 × 10⁻⁶)(324) = 6.48 × 10⁻⁴ J = 0.648 mJ",
          "ตอบ: (ก) ความจุสมมูล 4.0 μF, (ข) ประจุบนแต่ละตัว 72 μC, (ค) พลังงานสะสมรวม 0.648 mJ"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 120\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"50\" y1=\"60\" x2=\"130\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"130\" y1=\"40\" x2=\"130\" y2=\"80\" stroke=\"#38bdf8\" stroke-width=\"3\"/><line x1=\"145\" y1=\"40\" x2=\"145\" y2=\"80\" stroke=\"#38bdf8\" stroke-width=\"3\"/><line x1=\"145\" y1=\"60\" x2=\"230\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"230\" y1=\"40\" x2=\"230\" y2=\"80\" stroke=\"#38bdf8\" stroke-width=\"3\"/><line x1=\"245\" y1=\"40\" x2=\"245\" y2=\"80\" stroke=\"#38bdf8\" stroke-width=\"3\"/><line x1=\"245\" y1=\"60\" x2=\"330\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/><text x=\"137\" y=\"100\" fill=\"#38bdf8\" font-size=\"11\" text-anchor=\"middle\">C₁=6μF</text><text x=\"237\" y=\"100\" fill=\"#38bdf8\" font-size=\"11\" text-anchor=\"middle\">C₂=12μF</text><text x=\"200\" y=\"30\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\">C_eq = 4.0 μF</text></svg>",
        "diagramCaption": "ตัวเก็บประจุต่อแบบอนุกรม ประจุเท่ากันแต่ความต่างศักย์แบ่งตาม 1/C"
      },
      "observations": [
        "ในการต่อแบบอนุกรม ตัวเก็บประจุที่มีความจุน้อยที่สุดจะรับความต่างศักย์ตกคร่อมมากที่สุด เสี่ยงต่อการเบรกดาวน์มากที่สุด",
        "ในการต่อแบบขนาน ตัวเก็บประจุที่มีความจุมากที่สุดจะเก็บประจุและพลังงานไว้มากที่สุด"
      ]
    },
    {
      "id": "ch06-th11",
      "divisionId": "div-ch06-capacitors-dc-circuits",
      "divisionTitle": "ภาคที่ 2: ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง",
      "numberTh": "ทฤษฎีที่ 11",
      "type": "concept",
      "titleTh": "กระแสไฟฟ้า ความหนาแน่นกระแส และความเร็วลอยเลื่อน",
      "titleEn": "Electric Current, Current Density & Drift Velocity",
      "summary": "อัตราการไหลของประจุ I = dQ/dt ความหนาแน่นกระแส J = I/A = n q v_d และการเคลื่อนที่ลอยเลื่อนของอิเล็กตรอนอิสระ",
      "definition": {
        "text": "กระแสไฟฟ้า (Electric Current, I) คืออัตราการไหลสุทธิของประจุไฟฟ้าผ่านพื้นที่หน้าตัดของตัวนำในหนึ่งหน่วยเวลา: I = dQ / dt มีหน่วยเป็นแอมแปร์ (Ampere, A = C/s) ในระดับจุลภาค กระแสไฟฟ้าเกิดจากการเคลื่อนที่ลอยเลื่อนเฉลี่ย (Drift Velocity, v_d) ของอิเล็กตรอนอิสระนับล้านล้านตัวภายใต้อิทธิพลของสนามไฟฟ้า แม้ความเร็วลอยเลื่อนจะมีค่าน้อยมากระดับมิลลิเมตรต่อวินาที แต่สัญญาณคลื่นไฟฟ้าเคลื่อนที่ด้วยความเร็วใกล้เคียงความเร็วแสง"
      },
      "principle": {
        "text": "หลักการสำคัญในระดับมหภาคและจุลภาค:\n1. นิยามกระแสไฟฟ้า: $I = \\frac{dQ}{dt}$\n2. ความหนาแน่นกระแสเวกเตอร์: $\\mathbf{J} = n q \\mathbf{v}_d$ โดยที่ $I = \\int \\mathbf{J} \\cdot d\\mathbf{A}$\n3. สมการเชื่อมโยงกระแสกับความเร็วลอยเลื่อน: $I = n q A v_d$\n4. ทิศทางกระแสสมมติ (Conventional Current): ไหลจากขั้วบวกไปขั้วลบ (ทิศทางของประจุบวกสมมติ) ซึ่งตรงข้ามกับทิศการเคลื่อนที่จริงของอิเล็กตรอนอิสระ"
      },
      "formulas": [
        {
          "name": "สมการกระแสไฟฟ้าและความเร็วลอยเลื่อน (Drift Velocity Equation)",
          "latex": "I = n q A v_d, \\quad \\mathbf{J} = \\sigma \\mathbf{E}",
          "symbols": [
            {
              "sym": "I",
              "desc": "กระแสไฟฟ้า",
              "unit": "\\text{A}"
            },
            {
              "sym": "n",
              "desc": "ความหนาแน่นจำนวนประจุพาหะต่อหน่วยปริมาตร",
              "unit": "\\text{m}^{-3}"
            },
            {
              "sym": "q",
              "desc": "ประจุของพาหะ (สำหรับอิเล็กตรอน e = 1.602 × 10⁻¹⁹)",
              "unit": "\\text{C}"
            },
            {
              "sym": "A",
              "desc": "พื้นที่หน้าตัดของลวดตัวนำ",
              "unit": "\\text{m}^2"
            },
            {
              "sym": "v_d",
              "desc": "ขนาดความเร็วลอยเลื่อนเฉลี่ย",
              "unit": "\\text{m/s}"
            }
          ],
          "derivationSteps": [
            "พิจารณาส่วนของลวดตัวนำยาว Δx = v_d Δt ที่มีพื้นที่หน้าตัด A",
            "ปริมาตรของส่วนนี้คือ ΔV_vol = A Δx = A v_d Δt",
            "จำนวนพาหะประจุในส่วนนี้คือ N = n ΔV_vol = n A v_d Δt",
            "ประจุรวมที่ไหลผ่านพื้นที่หน้าตัดในเวลา Δt คือ ΔQ = N q = (n q A v_d) Δt",
            "จากนิยาม I = ΔQ / Δt: จะได้ I = n q A v_d",
            "ความหนาแน่นกระแส J = I / A = n q v_d ในรูปเวกเตอร์คือ J = σ E"
          ]
        }
      ],
      "application": {
        "text": "การคำนวณขนาดสายไฟฟ้าเพื่อป้องกันความร้อนสะสมเกินพิกัด (Ampacity), การวิเคราะห์สารกึ่งตัวนำในทรานซิสเตอร์, และเซลล์สุริยะ (Solar Cell carrier transport)",
        "validWhen": "สนามไฟฟ้าไม่สูงเกินไปจนเกิดผลกระทบของอิเล็กตรอนร้อน (Hot carrier effect)",
        "invalidWhen": "สภาวะตัวนำยิ่งยวด (Superconductivity) ซึ่งอิเล็กตรอนจับคู่เป็นคูเปอร์แพร์ (Cooper pairs) ไร้ความต้านทานและไร้การชน"
      },
      "example": {
        "problem": "ลวดทองแดงรัศมี r = 1.0 mm มีกระแสไฟฟ้าไหลสม่ำเสมอ I = 5.0 A ถ้าทองแดงมีความหนาแน่นอิเล็กตรอนอิสระ n = 8.5 × 10²⁸ m⁻³ จงหาขนาดความเร็วลอยเลื่อน v_d ของอิเล็กตรอน",
        "steps": [
          "หาพื้นที่หน้าตัดของลวดตัวนำ: A = π r² = π (1.0 × 10⁻³)² = 3.1416 × 10⁻⁶ m²",
          "จากสมการ I = n e A v_d จัดรูปหา v_d:",
          "v_d = I / (n e A)",
          "แทนค่าตัวเลข: v_d = 5.0 / [(8.5 × 10²⁸)(1.602 × 10⁻¹⁹)(3.1416 × 10⁻⁶)]",
          "คำนวณตัวส่วน: 8.5 × 1.602 × 3.1416 = 42.78",
          "เลขชี้กำลัง: 10²⁸ × 10⁻¹⁹ × 10⁻⁶ = 10³ = 1000",
          "ดังนั้น ตัวส่วน = 42.78 × 1000 = 42,780",
          "v_d = 5.0 / 42,780 = 1.17 × 10⁻⁴ m/s ≈ 0.117 mm/s",
          "ตอบ: ความเร็วลอยเลื่อนของอิเล็กตรอนมีค่าเพียงประมาณ 0.12 มิลลิเมตรต่อวินาทีเท่านั้น"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 120\" class=\"w-full h-32 bg-slate-900 rounded\"><rect x=\"60\" y=\"30\" width=\"280\" height=\"60\" fill=\"#334155\" stroke=\"#94a3b8\" rx=\"5\"/><line x1=\"80\" y1=\"60\" x2=\"320\" y2=\"60\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"4\"/><circle cx=\"140\" cy=\"50\" r=\"5\" fill=\"#38bdf8\"/><line x1=\"140\" y1=\"50\" x2=\"110\" y2=\"50\" stroke=\"#38bdf8\" stroke-width=\"1.5\" marker-end=\"url(#arrow-cyan)\"/><circle cx=\"220\" cy=\"70\" r=\"5\" fill=\"#38bdf8\"/><line x1=\"220\" y1=\"70\" x2=\"190\" y2=\"70\" stroke=\"#38bdf8\" stroke-width=\"1.5\" marker-end=\"url(#arrow-cyan)\"/><line x1=\"150\" y1=\"15\" x2=\"250\" y2=\"15\" stroke=\"#ef4444\" stroke-width=\"2\" marker-end=\"url(#arrow-red)\"/><text x=\"200\" y=\"12\" fill=\"#ef4444\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">ทิศกระแสสมมติ I (→)</text><text x=\"200\" y=\"110\" fill=\"#38bdf8\" font-size=\"11\" text-anchor=\"middle\">ทิศความเร็วลอยเลื่อนอิเล็กตรอน v_d (←)</text></svg>",
        "diagramCaption": "การเคลื่อนที่ลอยเลื่อนของอิเล็กตรอนสวนทางกับทิศทางกระแสสมมติ"
      },
      "observations": [
        "แม้ความเร็วลอยเลื่อน v_d จะช้ามาก (~0.1 mm/s) แต่เมื่อเปิดสวิตช์ไฟ หลอดไฟจะติดทันทีเพราะสนามไฟฟ้าเดินทางในสายด้วยความเร็วเกือบเท่าแสง c",
        "ความเร็วการเคลื่อนที่แบบสุ่มเนื่องจากความร้อน (Thermal speed) ของอิเล็กตรอนอยู่ที่ ~10⁶ m/s ซึ่งสูงกว่า v_d มาก"
      ]
    },
    {
      "id": "ch06-th12",
      "divisionId": "div-ch06-capacitors-dc-circuits",
      "divisionTitle": "ภาคที่ 2: ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง",
      "numberTh": "ทฤษฎีที่ 12",
      "type": "law",
      "titleTh": "กฎของโอห์ม สภาพต้านทาน และอิทธิพลของอุณหภูมิ",
      "titleEn": "Ohm's Law, Resistivity & Temperature Coefficient",
      "summary": "กฎของโอห์ม V = IR สภาพต้านทาน R = ρL/A และการเปลี่ยนแปลงสภาพต้านทานตามอุณหภูมิ ρ(T) = ρ₀[1 + α(T - T₀)]",
      "definition": {
        "text": "กฎของโอห์ม (Ohm's Law, เกออร์ก ซีมอน โอห์ม, 1827) ระบุว่า สำหรับตัวนำโอห์มิกหลายชนิดที่อุณหภูมิคงที่ อัตราส่วนระหว่างความต่างศักย์ไฟฟ้า V ที่ตกคร่อมตัวนำ ต่อกระแสไฟฟ้า I ที่ไหลผ่าน ย่อมเป็นค่าคงที่ เรียกว่า ความต้านทานไฟฟ้า (Resistance, R = V/I) โดยความต้านทานขึ้นอยู่กับสภาพต้านทานของเนื้อสาร ρ ความยาว L และพื้นที่หน้าตัด A: R = ρ L / A"
      },
      "principle": {
        "text": "หลักการสำคัญทางวิศวกรรมไฟฟ้า:\n1. กฎของโอห์มในระดับมหภาค: $V = I R$\n2. กฎของโอห์มในรูปจุลภาค: $\\mathbf{J} = \\sigma \\mathbf{E} = \\frac{1}{\\rho} \\mathbf{E}$\n3. ความต้านทานของลวดสม่ำเสมอ: $R = \\frac{\\rho L}{A}$\n4. การแปรผันตามอุณหภูมิ: $\\rho(T) = \\rho_0 [1 + \\alpha (T - T_0)]$ และ $R(T) = R_0 [1 + \\alpha (T - T_0)]$ โดยที่ $\\alpha$ คือสัมประสิทธิ์อุณหภูมิของความต้านทาน (โลหะส่วนใหญ่ $\\alpha > 0$, สารกึ่งตัวนำ $\\alpha < 0$)"
      },
      "formulas": [
        {
          "name": "กฎของโอห์มและความต้านทาน (Ohm's Law & Resistivity Formula)",
          "latex": "V = I R, \\quad R = \\frac{\\rho L}{A}, \\quad R(T) = R_0 [1 + \\alpha (T - T_0)]",
          "symbols": [
            {
              "sym": "V",
              "desc": "ความต่างศักย์ตกคร่อม",
              "unit": "\\text{V}"
            },
            {
              "sym": "R",
              "desc": "ความต้านทานไฟฟ้า",
              "unit": "\\Omega"
            },
            {
              "sym": "\\rho",
              "desc": "สภาพต้านทานของสาร",
              "unit": "\\Omega\\cdot\\text{m}"
            },
            {
              "sym": "L",
              "desc": "ความยาวของตัวนำ",
              "unit": "\\text{m}"
            },
            {
              "sym": "A",
              "desc": "พื้นที่หน้าตัด",
              "unit": "\\text{m}^2"
            },
            {
              "sym": "\\alpha",
              "desc": "สัมประสิทธิ์อุณหภูมิความต้านทาน",
              "unit": "^\\circ\\text{C}^{-1}"
            }
          ],
          "derivationSteps": [
            "จากกฎของโอห์มเชิงจุลภาค J = σ E = E / ρ",
            "แทน J = I / A และในสนามสม่ำเสมอ E = V / L",
            "จะได้ I / A = (V / L) / ρ ⇒ V = I * (ρ L / A)",
            "เทียบกับรูปแบบ V = I R จะได้ R = ρ L / A",
            "การสั่นของแลตทิซผลึกเมื่ออุณหภูมิสูงขึ้นทำให้อิเล็กตรอนชนบ่อยขึ้น เวลาอิสระเฉลี่ย τ ลดลง ทำให้ ρ เพิ่มขึ้นเชิงเส้นรอบอุณหภูมิห้อง"
          ]
        }
      ],
      "application": {
        "text": "เซนเซอร์วัดอุณหภูมิ RTD (Resistance Temperature Detector, เช่น PT100), ลวดทำความร้อนนิโครมในเตารีด, สเตรนเกจ (Strain Gauge) วัดความเค้นเชิงกล",
        "validWhen": "วัสดุเป็นตัวนำประเภทโอห์มิก (Ohmic conductor) ภายใต้อุณหภูมิและการระบายความร้อนที่เสถียร",
        "invalidWhen": "อุปกรณ์สารกึ่งตัวนำนอนโอห์มิก (Non-ohmic) เช่น ไดโอด (Diode), ทรานซิสเตอร์, หรือหลอดสูญญากาศ"
      },
      "example": {
        "problem": "ขดลวดทำความร้อนทำจากโลหะนิโครมมีความต้านทาน R₀ = 50.0 Ω ที่อุณหภูมิ 20°C เมื่อนำไปใช้งานจนร้อนจัด วัดกระแสได้ 4.0 A จากแหล่งจ่าย 230 V ถ้าสัมประสิทธิ์ α ของนิโครมคือ 4.0 × 10⁻⁴ °C⁻¹ จงหาอุณหภูมิขณะทำงาน T",
        "steps": [
          "หาความต้านทานขณะทำงานที่อุณหภูมิ T: R = V / I = 230 / 4.0 = 57.5 Ω",
          "จากสูตรการแปรผันตามอุณหภูมิ: R = R₀ [1 + α (T - T₀)]",
          "จัดรูปหา (T - T₀):",
          "R / R₀ = 1 + α (T - T₀) ⇒ α (T - T₀) = (R / R₀) - 1",
          "T - T₀ = [(R / R₀) - 1] / α",
          "แทนค่าตัวเลข: R / R₀ = 57.5 / 50.0 = 1.15",
          "T - 20°C = (1.15 - 1) / (4.0 × 10⁻⁴) = 0.15 / (4.0 × 10⁻⁴) = 375 °C",
          "T = 20°C + 375°C = 395 °C",
          "ตอบ: อุณหภูมิของขดลวดขณะทำงานร้อนจัดเท่ากับ 395 องศาเซลเซียส"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 120\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"50\" y1=\"100\" x2=\"350\" y2=\"100\" stroke=\"#475569\" stroke-width=\"1.5\"/><line x1=\"50\" y1=\"100\" x2=\"50\" y2=\"20\" stroke=\"#475569\" stroke-width=\"1.5\"/><text x=\"40\" y=\"20\" fill=\"#94a3b8\" font-size=\"10\">R</text><text x=\"350\" y=\"115\" fill=\"#94a3b8\" font-size=\"10\">T</text><line x1=\"50\" y1=\"80\" x2=\"320\" y2=\"35\" stroke=\"#ef4444\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"80\" r=\"4\" fill=\"#ef4444\"/><text x=\"65\" y=\"75\" fill=\"#ef4444\" font-size=\"10\">R₀ (20°C)</text><circle cx=\"280\" cy=\"41\" r=\"4\" fill=\"#f59e0b\"/><text x=\"270\" y=\"30\" fill=\"#f59e0b\" font-size=\"10\">R = 57.5 Ω (395°C)</text></svg>",
        "diagramCaption": "กราฟความต้านทานของโลหะที่เพิ่มขึ้นเชิงเส้นตามอุณหภูมิ"
      },
      "observations": [
        "กฎของโอห์มไม่ใช่กฎมูลฐานสากลของธรรมชาติ (เหมือนกฎคูลอมบ์) แต่เป็นสมบัติเชิงประจักษ์ของวัสดุบางกลุ่มเท่านั้น",
        "กำลังไฟฟ้าสูญเสียในรูปความร้อนจูล (Joule Heating) คือ P = I²R = V²/R"
      ]
    },
    {
      "id": "ch06-th13",
      "divisionId": "div-ch06-capacitors-dc-circuits",
      "divisionTitle": "ภาคที่ 2: ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง",
      "numberTh": "ทฤษฎีที่ 13",
      "type": "concept",
      "titleTh": "แรงเคลื่อนไฟฟ้า (emf) ความต้านทานภายใน และความต่างศักย์ขั้ว",
      "titleEn": "Electromotive Force (EMF), Internal Resistance & Terminal Voltage",
      "summary": "แรงเคลื่อนไฟฟ้า E งานต่อหนึ่งหน่วยประจุ ความต้านทานภายใน r ความต่างศักย์ขั้ว V = E - Ir และการส่งผ่านกำลังสูงสุด",
      "definition": {
        "text": "แรงเคลื่อนไฟฟ้า (Electromotive Force, emf หรือ E) คือพลังงานต่อหนึ่งหน่วยประจุที่แหล่งกำเนิดไฟฟ้า (เช่น แบตเตอรี่ หรือเครื่องกำเนิดไฟฟ้า) ถ่ายโอนให้แก่ประจุเพื่อขับเคลื่อนให้เคลื่อนที่ครบวงจร แหล่งจ่ายจริงมักมีความต้านทานภายใน (Internal Resistance, r) อยู่เสมอ ส่งผลให้ความต่างศักย์ที่ขั้วแบตเตอรี่ (Terminal Voltage, V) ลดลงเมื่อมีกระแสไหล: V = E - I r"
      },
      "principle": {
        "text": "หลักการสำคัญของแหล่งจ่ายไฟฟ้ากระแสตรง:\n1. ความต่างศักย์ที่ขั้วขณะจ่ายกระแส: $V = \\mathcal{E} - I r$\n2. กระแสไฟฟ้าในวงจรปิดที่มีโหลดภายนอก R: $I = \\frac{\\mathcal{E}}{R + r}$\n3. ความต่างศักย์ขั้วขณะถูกชาร์จประจุ (Charging): $V = \\mathcal{E} + I r$\n4. ทฤษฎีบทการส่งผ่านกำลังสูงสุด (Maximum Power Transfer Theorem): แหล่งจ่ายจะส่งผ่านกำลังไฟฟ้าไปยังโหลด $R$ ได้สูงสุดเมื่อ $R = r$ โดยกำลังสูงสุดคือ $P_{\\max} = \\frac{\\mathcal{E}^2}{4r}$"
      },
      "formulas": [
        {
          "name": "ความต่างศักย์ขั้วและการส่งผ่านกำลัง (Terminal Voltage & Max Power)",
          "latex": "V_{\\text{term}} = \\mathcal{E} - I r, \\quad P_{\\text{load}} = I^2 R = \\frac{\\mathcal{E}^2 R}{(R + r)^2}",
          "symbols": [
            {
              "sym": "\\mathcal{E}",
              "desc": "แรงเคลื่อนไฟฟ้าของแหล่งจ่าย",
              "unit": "\\text{V}"
            },
            {
              "sym": "r",
              "desc": "ความต้านทานภายใน",
              "unit": "\\Omega"
            },
            {
              "sym": "R",
              "desc": "ความต้านทานโหลดภายนอก",
              "unit": "\\Omega"
            },
            {
              "sym": "V_{\\text{term}}",
              "desc": "ความต่างศักย์ที่วัดได้ที่ขั้วทั้งสอง",
              "unit": "\\text{V}"
            }
          ],
          "derivationSteps": [
            "จากกฎการอนุรักษ์พลังงานในหนึ่งวงรอบ: งานที่แบตเตอรี่ทำ = พลังงานที่กระจายใน r + พลังงานที่กระจายใน R",
            "E * I = I² r + I² R ⇒ E = I (R + r)",
            "กระแสรวมในวงจร: I = E / (R + r)",
            "ความต่างศักย์ตกคร่อมโหลดภายนอก V = I R = E - I r",
            "หากำลังบนโหลด: P(R) = I² R = E² R / (R + r)²",
            "หาจุดสูงสุดโดย dP/dR = 0: จะได้เงื่อนไข R = r และ P_max = E² / (4r)"
          ]
        }
      ],
      "application": {
        "text": "การทดสอบสุขภาพแบตเตอรี่รถยนต์ (State of Health - SOH จากค่าความต้านทานภายในที่เพิ่มขึ้นตามอายุ), การออกแบบระบบเครื่องเสียงและสายอากาศให้แมตช์อิมพีแดนซ์ (Impedance Matching)",
        "validWhen": "ความต้านทานภายใน r มีค่าคงที่ในช่วงกระแสทำงานปกติ",
        "invalidWhen": "การลัดวงจรขั้วแบตเตอรี่อย่างรุนแรง (I = E/r) ความร้อนภายในจะทำให้สารเคมีเดือดและระเบิดได้"
      },
      "example": {
        "problem": "แบตเตอรี่มีแรงเคลื่อนไฟฟ้า E = 12.0 V ต่อเข้ากับตัวต้านทานโหลด R = 5.6 Ω วัดความต่างศักย์ที่ขั้วได้ V = 11.2 V จงหา: (ก) ความต้านทานภายใน r ของแบตเตอรี่ (ข) กำลังไฟฟ้าที่สูญเสียภายในแบตเตอรี่",
        "steps": [
          "หากระแสที่ไหลในวงจรจากตัวต้านทานโหลด: I = V / R = 11.2 / 5.6 = 2.0 A",
          "หาความต่างศักย์ที่ตกคร่อมความต้านทานภายใน: V_internal = E - V = 12.0 - 11.2 = 0.8 V",
          "ข้อ (ก) ความต้านทานภายใน: r = V_internal / I = 0.8 V / 2.0 A = 0.40 Ω",
          "ข้อ (ข) กำลังไฟฟ้าที่สูญเสียในความต้านทานภายใน: P_internal = I² r = (2.0)² × 0.40 = 4.0 × 0.40 = 1.60 W",
          "ตรวจสอบกำลังที่โหลดรับ: P_load = I² R = (2.0)² × 5.6 = 22.4 W",
          "กำลังรวมที่ผลิตจากเซลล์เคมี: P_total = E * I = 12.0 × 2.0 = 24.0 W (เท่ากับ 22.4 + 1.6 = 24.0 W พอดี)",
          "ตอบ: (ก) ความต้านทานภายใน r = 0.40 Ω, (ข) กำลังสูญเสียภายในเซลล์เท่ากับ 1.60 วัตต์"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 120\" class=\"w-full h-32 bg-slate-900 rounded\"><rect x=\"80\" y=\"30\" width=\"100\" height=\"60\" fill=\"none\" stroke=\"#38bdf8\" stroke-dasharray=\"3\" rx=\"4\"/><text x=\"130\" y=\"25\" fill=\"#38bdf8\" font-size=\"10\" text-anchor=\"middle\">แบตเตอรี่จริง</text><text x=\"100\" y=\"65\" fill=\"#ef4444\" font-size=\"11\" font-weight=\"bold\">E=12V</text><text x=\"150\" y=\"65\" fill=\"#f59e0b\" font-size=\"11\">r=0.4Ω</text><line x1=\"180\" y1=\"60\" x2=\"280\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/><rect x=\"280\" y=\"45\" width=\"40\" height=\"30\" fill=\"#334155\" stroke=\"#10b981\" stroke-width=\"2\"/><text x=\"300\" y=\"65\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\">R=5.6Ω</text><line x1=\"320\" y1=\"60\" x2=\"360\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"360\" y1=\"60\" x2=\"360\" y2=\"105\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"360\" y1=\"105\" x2=\"60\" y2=\"105\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"60\" y1=\"105\" x2=\"60\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"60\" y1=\"60\" x2=\"80\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"2\"/></svg>",
        "diagramCaption": "วงจรเทียบเท่าของแบตเตอรี่จริงประกอบด้วยแรงเคลื่อนไฟฟ้า E อนุกรมกับ r"
      },
      "observations": [
        "เมื่อไม่มีกระแสไหลออกจากแบตเตอรี่ (Open circuit, I = 0) ความต่างศักย์ขั้วจะเท่ากับแรงเคลื่อนไฟฟ้า V = E",
        "ยิ่งดึงกระแสมาก ความต่างศักย์ขั้วยิ่งตกต่ำลงเนื่องจากผลคูณ Ir"
      ]
    },
    {
      "id": "ch06-th14",
      "divisionId": "div-ch06-capacitors-dc-circuits",
      "divisionTitle": "ภาคที่ 2: ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง",
      "numberTh": "ทฤษฎีที่ 14",
      "type": "law",
      "titleTh": "กฎของเคอร์ชอฟฟ์: กฎจุดต่อและกฎวงรอบลูป",
      "titleEn": "Kirchhoff's Junction & Loop Rules",
      "summary": "กฎจุดต่ออนุรักษ์ประจุ ∑I_in = ∑I_out และกฎวงรอบลูปอนุรักษ์พลังงาน ∑ΔV = 0 สำหรับการวิเคราะห์วงจรซับซ้อนหลายลูป",
      "definition": {
        "text": "กฎของเคอร์ชอฟฟ์ (Kirchhoff's Circuit Laws, กุสทัฟ เคอร์ชอฟฟ์, 1845) เป็นหลักการพื้นฐานที่สุดสองข้อในการวิเคราะห์วงจรไฟฟ้าหลายลูปที่ไม่สามารถยุบอนุกรม-ขนานธรรมดาได้ ประกอบด้วย: 1. กฎจุดต่อ (Junction Rule หรือ KCL): ผลรวมกระแสที่ไหลเข้าจุดต่อใดๆ ต้องเท่ากับผลรวมกระแสที่ไหลออกจากจุดต่อนั้น (อนุรักษ์ประจุ) 2. กฎลูป (Loop Rule หรือ KVL): ผลรวมพีชคณิตของการเปลี่ยนแปลงศักย์ไฟฟ้ารอบลูปปิดใดๆ ในวงจรต้องมีค่าเป็นศูนย์ (อนุรักษ์พลังงาน)"
      },
      "principle": {
        "text": "ขั้นตอนการวิเคราะห์วงจรด้วยกฎเคอร์ชอฟฟ์:\n1. กฎจุดต่อ (KCL): $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$ หรือ $\\sum I = 0$\n2. กฎลูป (KVL): $\\sum \\Delta V = 0$\n3. กฎเครื่องหมายในการท่องลูป:\n   - ผ่านตัวต้านทานตามทิศสมมติของกระแส: ศักย์ลดลง $\\Delta V = -I R$\n   - ผ่านตัวต้านทานสวนทิศสมมติของกระแส: ศักย์เพิ่มขึ้น $\\Delta V = +I R$\n   - ผ่านแบตเตอรี่จากขั้วลบไปขั้วบวก: ศักย์เพิ่มขึ้น $\\Delta V = +\\mathcal{E}$\n   - ผ่านแบตเตอรี่จากขั้วบวกไปขั้วลบ: ศักย์ลดลง $\\Delta V = -\\mathcal{E}$"
      },
      "formulas": [
        {
          "name": "กฎจุดต่อและกฎลูปเคอร์ชอฟฟ์ (Kirchhoff's KCL & KVL)",
          "latex": "\\sum_{\\text{node}} I_k = 0, \\quad \\sum_{\\text{loop}} \\Delta V_k = 0",
          "symbols": [
            {
              "sym": "I_k",
              "desc": "กระแสในแต่ละกิ่งที่เชื่อมกับจุดแยก",
              "unit": "\\text{A}"
            },
            {
              "sym": "\\Delta V_k",
              "desc": "การเปลี่ยนแปลงศักย์ไฟฟ้าข้ามแต่ละอุปกรณ์",
              "unit": "\\text{V}"
            }
          ],
          "derivationSteps": [
            "KCL มาจากกฎการอนุรักษ์ประจุไฟฟ้า: ในสถานะคงตัว ประจุไม่สามารถสะสมหรือหายไปอย่างไร้ร่องรอยที่จุดเชื่อมต่อตัวนำได้ dq/dt = 0",
            "KVL มาจากกฎการอนุรักษ์พลังงานและสมบัติความเป็นสนามอนุรักษ์ของไฟฟ้าสถิต: ∮ E · dl = 0",
            "เมื่อท่องลูปกลับมายังจุดเริ่มต้น การเปลี่ยนแปลงพลังงานศักย์สุทธิของประจุต้องเป็นศูนย์ ΔU = q ∮ dV = 0"
          ]
        }
      ],
      "application": {
        "text": "การวิเคราะห์โครงข่ายวงจรไฟฟ้า (Circuit Analysis), สะพานวีตสโตน (Wheatstone Bridge) วัดความต้านทานความแม่นยำสูง, และการออกแบบแผงวงจรพิมพ์ (PCB)",
        "validWhen": "ความถี่ของสัญญาณต่ำพอที่มิติทางกายภาพของวงจรเล็กกว่าความยาวคลื่นมาก (Lumped element model)",
        "invalidWhen": "ความถี่สูงระดับไมโครเวฟ/คลื่นวิทยุ (ต้องใช้ทฤษฎีสายส่ง Transmission line theory และสมการคลื่น)"
      },
      "example": {
        "problem": "วงจรสองลูปมีแหล่งจ่ายสองตัว E₁ = 9.0 V, E₂ = 6.0 V ต่อกับตัวต้านทานสามตัว R₁ = 4.0 Ω, R₂ = 2.0 Ω, R₃ = 3.0 Ω จงหากระแสในแต่ละกิ่ง",
        "steps": [
          "กำหนดทิศทางกระแส: I₁ ไหลผ่านกิ่งซ้ายลงล่าง, I₂ ไหลผ่านกิ่งกลางลงล่าง, I₃ ไหลผ่านกิ่งขวาลงล่าง",
          "ที่จุดแยกด้านบน: I_in = 0 ⇒ I₁ + I₂ + I₃ = 0 หรือกำหนดให้ I₁ และ I₂ ไหลเข้า แล้ว I₃ ไหลออก: I₁ + I₂ = I₃",
          "ตั้งสมการลูปซ้าย (ตามเข็มนาฬิกา): +E₁ - I₁ R₁ - I₃ R₃ = 0 ⇒ 9.0 - 4 I₁ - 3 I₃ = 0",
          "ตั้งสมการลูปขวา (ตามเข็มนาฬิกา): +E₂ - I₂ R₂ - I₃ R₃ = 0 ⇒ 6.0 - 2 I₂ - 3 I₃ = 0",
          "แทน I₃ = I₁ + I₂ ลงในทั้งสองสมการ:",
          "ลูปซ้าย: 9.0 - 4 I₁ - 3(I₁ + I₂) = 0 ⇒ 7 I₁ + 3 I₂ = 9.0  --- (1)",
          "ลูปขวา: 6.0 - 2 I₂ - 3(I₁ + I₂) = 0 ⇒ 3 I₁ + 5 I₂ = 6.0  --- (2)",
          "แก้ระบบสมการเชิงเส้นสองตัวแปร: คูณ (1) ด้วย 5 ได้ 35 I₁ + 15 I₂ = 45; คูณ (2) ด้วย 3 ได้ 9 I₁ + 15 I₂ = 18",
          "ลบกัน: 26 I₁ = 27 ⇒ I₁ = 27/26 ≈ 1.038 A",
          "แทนใน (2): 3(1.038) + 5 I₂ = 6.0 ⇒ 5 I₂ = 6.0 - 3.115 = 2.885 ⇒ I₂ ≈ 0.577 A",
          "หากระแสรวม I₃: I₃ = I₁ + I₂ = 1.038 + 0.577 = 1.615 A",
          "ตอบ: I₁ = 1.04 A, I₂ = 0.58 A, I₃ = 1.62 A"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><rect x=\"60\" y=\"25\" width=\"130\" height=\"80\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"1.5\"/><rect x=\"190\" y=\"25\" width=\"130\" height=\"80\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"1.5\"/><text x=\"125\" y=\"70\" fill=\"#38bdf8\" font-size=\"11\" text-anchor=\"middle\">ลูป 1</text><text x=\"255\" y=\"70\" fill=\"#10b981\" font-size=\"11\" text-anchor=\"middle\">ลูป 2</text><text x=\"45\" y=\"65\" fill=\"#ef4444\" font-size=\"10\">E₁=9V</text><text x=\"335\" y=\"65\" fill=\"#ef4444\" font-size=\"10\">E₂=6V</text><text x=\"190\" y=\"15\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\">Node A</text></svg>",
        "diagramCaption": "วงจรไฟฟ้าสองลูปที่มีจุดแยกและลูปปิดอิสระ"
      },
      "observations": [
        "หากแก้สมการแล้วได้กระแสติดลบ หมายความว่าทิศทางการไหลจริงตรงข้ามกับทิศทางสมมติเริ่มต้น",
        "จำนวนสมการอิสระของกฎลูปจะเท่ากับจำนวนลูปย่อย (Branches - Nodes + 1)"
      ]
    },
    {
      "id": "ch06-th15",
      "divisionId": "div-ch06-capacitors-dc-circuits",
      "divisionTitle": "ภาคที่ 2: ตัวเก็บประจุ ความต้านทาน และวงจรไฟฟ้ากระแสตรง",
      "numberTh": "ทฤษฎีที่ 15",
      "type": "phenomenon",
      "titleTh": "วงจรไฟฟ้าทรานเชียนต์ RC การประจุและการคายประจุ",
      "titleEn": "RC Circuit Transients, Charging & Discharging",
      "summary": "พฤติกรรมพลวัตตามเวลา ประจุ q(t) = Q_max(1 - e^{-t/RC}) กระแสเอกซ์โพเนนเชียล และค่าคงตัวเวลาทรานเชียนต์ τ = RC",
      "definition": {
        "text": "วงจร RC ทรานเชียนต์ (RC Transient Circuit) ประกอบด้วยตัวต้านทาน R และตัวเก็บประจุ C ต่อกับแหล่งกำเนิดไฟฟ้า พฤติกรรมของแรงดันและกระแสไม่ได้เปลี่ยนแปลงในทันทีทันใด แต่เปลี่ยนแปลงอย่างต่อเนื่องตามฟังก์ชันเอกซ์โพเนนเชียลโดยมีช่วงเวลาปรับตัวเรียกว่า ทรานเชียนต์ (Transient) ควบคุมโดยค่าคงตัวเวลา (Time Constant, τ = RC) ซึ่งบ่งบอกอัตราความเร็วในการชาร์จหรือคายประจุ"
      },
      "principle": {
        "text": "พฤติกรรมการประจุและคายประจุ:\n1. การประจุ (Charging): ประจุเริ่มต้น $q(0)=0$ สับสวิตช์เข้าแบตเตอรี่ $\\mathcal{E}$:\n   - $q(t) = C\\mathcal{E} (1 - e^{-t/RC})$\n   - $V_C(t) = \\mathcal{E} (1 - e^{-t/RC})$\n   - $I(t) = \\frac{\\mathcal{E}}{R} e^{-t/RC}$\n2. การคายประจุ (Discharging): มีประจุเดิม $Q_0$ ลัดวงจรผ่านตัวต้านทาน $R$:\n   - $q(t) = Q_0 e^{-t/RC}$\n   - $V_C(t) = V_0 e^{-t/RC}$\n   - $I(t) = -\\frac{V_0}{R} e^{-t/RC}$\n3. ความหมายของค่าคงตัวเวลา $\\tau = RC$: ที่เวลา $t = \\tau$ ประจุจะเพิ่มขึ้นถึง $63.2\\%$ ขณะชาร์จ หรือลดลงเหลือ $36.8\\%$ ขณะคายประจุ และถือว่าเข้าสู่สถานะคงตัวหลังเวลา $5\\tau$ ($>99.3\\%$)"
      },
      "formulas": [
        {
          "name": "สมการทรานเชียนต์วงจร RC (RC Transient Differential Equations)",
          "latex": "V_C(t) = \\mathcal{E}\\left(1 - e^{-t/\\tau}\\right), \\quad I(t) = \\frac{\\mathcal{E}}{R} e^{-t/\\tau}, \\quad \\tau = RC",
          "symbols": [
            {
              "sym": "\\tau",
              "desc": "ค่าคงตัวเวลาของวงจร (Time constant)",
              "unit": "\\text{s}"
            },
            {
              "sym": "V_C(t)",
              "desc": "ความต่างศักย์ตกคร่อมตัวเก็บประจุ ณ เวลา t",
              "unit": "\\text{V}"
            },
            {
              "sym": "I(t)",
              "desc": "กระแสไฟฟ้าชั่วขณะ ณ เวลา t",
              "unit": "\\text{A}"
            },
            {
              "sym": "\\mathcal{E}",
              "desc": "แรงเคลื่อนไฟฟ้าของแบตเตอรี่",
              "unit": "\\text{V}"
            }
          ],
          "derivationSteps": [
            "จากกฎลูปเคอร์ชอฟฟ์ขณะชาร์จ: E - I R - q/C = 0",
            "แทน I = dq/dt: E - R (dq/dt) - q/C = 0 ⇒ R (dq/dt) = E - q/C = (CE - q) / C",
            "แยกตัวแปรอินทิเกรต: dq / (q - CE) = - dt / (RC)",
            "อินทิเกรตจาก q=0 ถึง q(t): ln[(q - CE) / (-CE)] = -t / (RC)",
            "(q - CE) / (-CE) = e^{-t/RC} ⇒ q(t) = CE (1 - e^{-t/RC})",
            "หาความต่างศักย์ V_C(t) = q(t)/C = E(1 - e^{-t/RC}) และ I(t) = dq/dt = (E/R) e^{-t/RC}"
          ]
        }
      ],
      "application": {
        "text": "วงจรจับเวลา (555 Timer IC), ตัวกรองความถี่ต่ำผ่าน (Low-Pass Filter) ในระบบเสียง, ไฟกะพริบรถยนต์, และระบบหน่วงเวลาเปิดปิดอัตโนมัติ",
        "validWhen": "ตัวเก็บประจุและตัวต้านทานเป็นอุปกรณ์เชิงเส้น และไม่มีการเหนี่ยวนำแม่เหล็กแฝง (Stray inductance)",
        "invalidWhen": "ความต้านทานเป็นศูนย์อุดมคติ R → 0 ซึ่งค่าคงตัวเวลาเป็นศูนย์และขัดกับทฤษฎีสัมพัทธภาพและการแผ่รังสี"
      },
      "example": {
        "problem": "วงจร RC ประกอบด้วยตัวต้านทาน R = 100 kΩ และตัวเก็บประจุ C = 20 μF ต่อกับแบตเตอรี่ 12 V จงหา: (ก) ค่าคงตัวเวลา τ (ข) ประจุสูงสุด Q_max (ค) ความต่างศักย์ตกคร่อมตัวเก็บประจุที่เวลา t = 2.0 s (ง) กระแสในวงจรที่เวลา t = 2.0 s",
        "steps": [
          "แปลงหน่วย: R = 100 × 10³ Ω, C = 20 × 10⁻⁶ F",
          "ข้อ (ก) ค่าคงตัวเวลา: τ = R * C = (100 × 10³)(20 × 10⁻⁶) = 2.0 s",
          "ข้อ (ข) ประจุสูงสุด: Q_max = C * E = (20 × 10⁻⁶ F)(12 V) = 2.4 × 10⁻⁴ C = 240 μC",
          "ข้อ (ค) ที่เวลา t = 2.0 s (ซึ่งเท่ากับ 1τ พอดี):",
          "V_C(2.0) = E (1 - e^{-2.0 / 2.0}) = 12 (1 - e⁻¹) = 12 (1 - 0.3679) = 12 (0.6321) = 7.585 V ≈ 7.59 V",
          "ข้อ (ง) กระแสในวงจรที่ t = 2.0 s:",
          "กระแสเริ่มต้น I₀ = E / R = 12 / 100,000 = 1.2 × 10⁻⁴ A = 0.12 mA = 120 μA",
          "I(2.0) = I₀ e⁻¹ = (120 μA)(0.3679) ≈ 44.1 μA",
          "ตอบ: (ก) τ = 2.0 วินาที, (ข) Q_max = 240 μC, (ค) V_C = 7.59 V, (ง) I = 44.1 μA"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"50\" y1=\"100\" x2=\"350\" y2=\"100\" stroke=\"#475569\" stroke-width=\"1.5\"/><line x1=\"50\" y1=\"100\" x2=\"50\" y2=\"20\" stroke=\"#475569\" stroke-width=\"1.5\"/><path d=\"M 50 100 Q 150 45 350 40\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2.5\"/><text x=\"355\" y=\"45\" fill=\"#38bdf8\" font-size=\"10\">V_C(t)</text><line x1=\"50\" y1=\"40\" x2=\"350\" y2=\"40\" stroke=\"#64748b\" stroke-dasharray=\"3\"/><text x=\"40\" y=\"43\" fill=\"#64748b\" font-size=\"10\">E</text><line x1=\"150\" y1=\"100\" x2=\"150\" y2=\"62\" stroke=\"#f59e0b\" stroke-dasharray=\"2\"/><circle cx=\"150\" cy=\"62\" r=\"4\" fill=\"#f59e0b\"/><text x=\"150\" y=\"115\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\">t = τ (63.2%)</text></svg>",
        "diagramCaption": "กราฟการชาร์จประจุของวงจร RC แสดงค่าศักย์ไฟฟ้าพุ่งเข้าหา E แบบเอกซ์โพเนนเชียล"
      },
      "observations": [
        "ในทันทีที่สับสวิตช์ชาร์จ (t=0) ตัวเก็บประจุประพฤติตัวเสมือนเป็น 'สายไฟลัดวงจร' (Short circuit, V_C = 0, I = E/R)",
        "เมื่อเวลาผ่านไปนานมาก (t → ∞) ตัวเก็บประจุประพฤติตัวเสมือนเป็น 'สวิตช์เปิดวงจร' (Open circuit, V_C = E, I = 0)"
      ]
    },
    {
      "id": "ch06-th16",
      "divisionId": "div-ch06-magnetostatics-forces",
      "divisionTitle": "ภาคที่ 3: แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก",
      "numberTh": "ทฤษฎีที่ 16",
      "type": "law",
      "titleTh": "แรงแม่เหล็กกระทำต่อประจุเคลื่อนที่และแรงลอเรนซ์",
      "titleEn": "Magnetic Force on Moving Charge & Lorentz Force",
      "summary": "แรงแม่เหล็ก F = q(v × B) ทิศทางตามกฎมือขวา สมบัติไม่ทำงาน W = 0 และสมการแรงลอเรนซ์รวม F = q(E + v × B)",
      "definition": {
        "text": "เมื่ออนุภาคมีประจุไฟฟ้า q เคลื่อนที่ด้วยความเร็ว v ในบริเวณที่มีสนามแม่เหล็ก B อนุภาคจะได้รับแรงแม่เหล็ก (Magnetic Force) ซึ่งได้จากผลคูณเชิงเวกเตอร์: F_B = q (v × B) แรงนี้จะตั้งฉากกับทั้งความเร็ว v และสนามแม่เหล็ก B เสมอตามกฎมือขวา (Right-Hand Rule) เมื่อมีทั้งสนามไฟฟ้าและสนามแม่เหล็ก แรงรวมที่กระทำต่ออนุภาคเรียกว่า แรงลอเรนซ์ (Lorentz Force, เฮนดริก ลอเรนซ์, 1895): F = q(E + v × B)"
      },
      "principle": {
        "text": "คุณลักษณะทางฟิสิกส์ที่สำคัญของแรงแม่เหล็ก:\n1. ขนาดของแรง: $F_B = |q| v B \\sin\\theta$ เมื่อ $\\theta$ คือมุมระหว่างเวกเตอร์ $\\mathbf{v}$ และ $\\mathbf{B}$\n2. ทิศทางตามกฎมือขวา: ชี้สี่นิ้วตาม $\\mathbf{v}$ วนเข้าหา $\\mathbf{B}$ นิ้วหัวแม่มือจะชี้ทิศของ $\\mathbf{F}_B$ (สำหรับประจุลบ ทิศทางจะกลับตรงกันข้าม $180^\\circ$)\n3. แรงแม่เหล็กไม่ทำงาน ($W = 0$): เนื่องจาก $\\mathbf{F}_B \\perp \\mathbf{v}$ ตลอดเวลา ทำให้กำลังงาน $P = \\mathbf{F}_B \\cdot \\mathbf{v} = 0$ แรงแม่เหล็กจึงเปลี่ยนเฉพาะทิศทางของความเร็ว แต่ไม่สามารถเปลี่ยนขนาดอัตราเร็วหรือพลังงานจลน์ของอนุภาคได้"
      },
      "formulas": [
        {
          "name": "สมการแรงลอเรนซ์ (Lorentz Force Equation)",
          "latex": "\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B}), \\quad F_B = |q| v B \\sin\\theta",
          "symbols": [
            {
              "sym": "\\mathbf{F}",
              "desc": "แรงลอเรนซ์รวม",
              "unit": "\\text{N}"
            },
            {
              "sym": "q",
              "desc": "ประจุไฟฟ้าของอนุภาค",
              "unit": "\\text{C}"
            },
            {
              "sym": "\\mathbf{E}",
              "desc": "เวกเตอร์สนามไฟฟ้า",
              "unit": "\\text{V/m}"
            },
            {
              "sym": "\\mathbf{v}",
              "desc": "เวกเตอร์ความเร็วของอนุภาค",
              "unit": "\\text{m/s}"
            },
            {
              "sym": "\\mathbf{B}",
              "desc": "เวกเตอร์สนามแม่เหล็ก",
              "unit": "\\text{T}"
            }
          ],
          "derivationSteps": [
            "สังเกตจากการทดลองของลอเรนซ์: ประจุที่อยู่นิ่ง (v = 0) ในสนามแม่เหล็กจะไม่ได้รับแรงแม่เหล็กใดๆ เลย",
            "เมื่อประจุเคลื่อนที่ แรงแม่เหล็กแปรผันตรงกับขนาดประจุ q, อัตราเร็ว v และขนาดสนามแม่เหล็ก B",
            "แรงมีค่าสูงสุดเมื่อความเร็วตั้งฉากกับสนาม (θ = 90°) และเป็นศูนย์เมื่อความเร็วขนานกับสนาม (θ = 0° หรือ 180°)",
            "ในรูปคณิตศาสตร์เวกเตอร์ สอดคล้องกับผลคูณไขว้ F_B = q (v × B)",
            "รวมกับแรงไฟฟ้าสถิต F_E = q E ตามหลักการซ้อนทับ ได้แรงลอเรนซ์สมบูรณ์"
          ]
        }
      ],
      "application": {
        "text": "หลอดโทรทัศน์รังสีแคโทด (CRT เบี่ยงเบนลำอิเล็กตรอนด้วยสนามแม่เหล็ก), มวลสเปกโตรมิเตอร์ (Mass Spectrometer), และการกักขังพลาสมาในเตาปฏิกรณ์นิวเคลียร์ฟิวชัน (Tokamak magnetic confinement)",
        "validWhen": "ความเร็ว v ต่ำกว่าความเร็วแสงมาก (Classical mechanics regime)",
        "invalidWhen": "ความเร็วใกล้แสง ซึ่งต้องใช้รูปเทนเซอร์แรงสัมพัทธภาพพิเศษ F^μ = q F^{μν} u_ν"
      },
      "example": {
        "problem": "โปรตอน (ประจุ q = +1.60 × 10⁻¹⁹ C, มวล m = 1.67 × 10⁻²⁷ kg) เคลื่อนที่ด้วยความเร็ว v = 4.0 × 10⁶ m/s ไปทางทิศตะวันออก เข้าสู่สนามแม่เหล็กสม่ำเสมอ B = 1.2 T ที่ชี้ขึ้นในแนวดิ่ง จงหา: (ก) ขนาดและทิศทางของแรงแม่เหล็ก (ข) ความเร่งของโปรตอน",
        "steps": [
          "มุมระหว่างความเร็ว v (ทิศตะวันออก) และสนาม B (ชี้ขึ้น) คือ θ = 90°",
          "ข้อ (ก) ขนาดของแรงแม่เหล็ก: F_B = q v B sin(90°) = (1.60 × 10⁻¹⁹ C)(4.0 × 10⁶ m/s)(1.2 T)(1)",
          "F_B = 7.68 × 10⁻¹³ N",
          "หาทิศทางด้วยกฎมือขวา: สี่นิ้วชี้ไปทางทิศตะวันออก วนขึ้นด้านบน นิ้วหัวแม่มือจะชี้ไปทาง 'ทิศใต้'",
          "ข้อ (ข) หาความเร่งตามกฎข้อที่สองของนิวตัน: a = F / m = (7.68 × 10⁻¹³ N) / (1.67 × 10⁻²⁷ kg)",
          "a = 4.60 × 10¹⁴ m/s² ในทิศใต้",
          "ตอบ: แรงแม่เหล็กมีขนาด 7.68 × 10⁻¹³ N ชี้ไปทางทิศใต้ และความเร่งเท่ากับ 4.60 × 10¹⁴ m/s²"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><circle cx=\"200\" cy=\"70\" r=\"10\" fill=\"#ef4444\"/><text x=\"200\" y=\"74\" fill=\"#fff\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">+p</text><line x1=\"200\" y1=\"70\" x2=\"300\" y2=\"70\" stroke=\"#f59e0b\" stroke-width=\"2.5\" marker-end=\"url(#arrow-orange)\"/><text x=\"260\" y=\"60\" fill=\"#f59e0b\" font-size=\"11\">v (ตะวันออก)</text><line x1=\"200\" y1=\"70\" x2=\"200\" y2=\"15\" stroke=\"#10b981\" stroke-width=\"2.5\" marker-end=\"url(#arrow-green)\"/><text x=\"210\" y=\"30\" fill=\"#10b981\" font-size=\"11\">B (ชี้ขึ้น)</text><line x1=\"200\" y1=\"70\" x2=\"200\" y2=\"120\" stroke=\"#ec4899\" stroke-width=\"2.5\" marker-end=\"url(#arrow-pink)\"/><text x=\"210\" y=\"110\" fill=\"#ec4899\" font-size=\"11\" font-weight=\"bold\">F_B (ทิศใต้)</text></svg>",
        "diagramCaption": "เวกเตอร์ความเร็ว สนามแม่เหล็ก และแรงแม่เหล็กตั้งฉากซึ่งกันและกันตามกฎมือขวา"
      },
      "observations": [
        "แรงแม่เหล็กไม่สามารถทำงานได้ ไม่สามารถเพิ่มหรือลดความเร็วเชิงขนาดของอนุภาคได้",
        "ถ้าประจุเคลื่อนที่ขนานกับสนามแม่เหล็ก (θ = 0° หรือ 180°) แรงแม่เหล็กจะเป็นศูนย์อย่างแท้จริง"
      ]
    },
    {
      "id": "ch06-th17",
      "divisionId": "div-ch06-magnetostatics-forces",
      "divisionTitle": "ภาคที่ 3: แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก",
      "numberTh": "ทฤษฎีที่ 17",
      "type": "concept",
      "titleTh": "การเคลื่อนที่แบบไซโคลตรอนและเครื่องคัดแยกความเร็ว",
      "titleEn": "Cyclotron Motion, Radius & Velocity Selector",
      "summary": "การเคลื่อนที่วงกลมในสนามแม่เหล็ก รัศมี r = mv/qB ความถี่ไซโคลตรอน f = qB/2πm และเครื่องคัดแยกความเร็ว v = E/B",
      "definition": {
        "text": "เมื่ออนุภาคมีประจุเคลื่อนที่เข้าสู่สนามแม่เหล็กสม่ำเสมอในแนวตั้งฉาก (v ⊥ B) แรงแม่เหล็กที่มีขนาดคงที่และตั้งฉากกับความเร็วตลอดเวลาจะทำหน้าที่เป็นแรงสู่ศูนย์กลาง (Centripetal Force) ทำให้อนุภาคโคจรเป็นรูปวงกลมด้วยรัศมีไซโคลตรอน r = mv/(qB) โดยมีความถี่ไซโคลตรอนที่เป็นอิสระจากความเร็ว ส่วนเครื่องคัดแยกความเร็ว (Velocity Selector) ใช้สนามไฟฟ้าและสนามแม่เหล็กตั้งฉากกันเพื่อให้เฉพาะอนุภาคที่มีอัตราเร็ว v = E/B พุ่งเป็นเส้นตรงผ่านไปได้"
      },
      "principle": {
        "text": "หลักการสำคัญ:\n1. รัศมีวงโคจรไซโคลตรอน: $r = \\frac{m v}{q B} = \\frac{p}{q B}$\n2. ความถี่เชิงมุมไซโคลตรอน: $\\omega = \\frac{v}{r} = \\frac{q B}{m}$ (ขึ้นอยู่กับชนิดอนุภาคและ B เท่านั้น ไม่ขึ้นกับ v!)\n3. ความถี่ไซโคลตรอน: $f = \\frac{\\omega}{2\\pi} = \\frac{q B}{2\\pi m}$\n4. การเคลื่อนที่แบบเกลียว (Helical motion): ถ้า $\\mathbf{v}$ ทำมุมกับ $\\mathbf{B}$ อนุภาคจะวิ่งวนเป็นวงกลมในระนาบตั้งฉากพร้อมกับเคลื่อนที่เป็นเส้นตรงด้วยความเร็วคงที่ $v_\\parallel = v\\cos\\theta$ ขนานกับสนาม เกิดเป็นทางเดินรูปเกลียวสปริง (Pitch $p = v_\\parallel T$)\n5. เครื่องคัดแยกความเร็ว: $qE = qvB \\Rightarrow v = \\frac{E}{B}$"
      },
      "formulas": [
        {
          "name": "รัศมีและความถี่ไซโคลตรอน (Cyclotron Radius & Frequency)",
          "latex": "r = \\frac{m v}{q B}, \\quad f = \\frac{q B}{2\\pi m}, \\quad v_{\\text{select}} = \\frac{E}{B}",
          "symbols": [
            {
              "sym": "r",
              "desc": "รัศมีความโค้งของวงโคจร",
              "unit": "\\text{m}"
            },
            {
              "sym": "f",
              "desc": "ความถี่ไซโคลตรอน",
              "unit": "\\text{Hz}"
            },
            {
              "sym": "m",
              "desc": "มวลของอนุภาค",
              "unit": "\\text{kg}"
            },
            {
              "sym": "v_{\\text{select}}",
              "desc": "ความเร็วที่ผ่านเครื่องคัดแยกได้ตรง",
              "unit": "\\text{m/s}"
            }
          ],
          "derivationSteps": [
            "เทียบแรงแม่เหล็กกับแรงสู่ศูนย์กลาง: F_B = F_c",
            "q v B = m v² / r",
            "ตัดทอน v หนึ่งตัว: q B = m v / r ⇒ r = (m v) / (q B)",
            "หาความเร็วเชิงมุม ω = v / r = (q B) / m",
            "หาความถี่ f = ω / (2π) = (q B) / (2π m)",
            "ในเครื่องคัดแยกความเร็ว แรงไฟฟ้า F_E = qE และแรงแม่เหล็ก F_B = qvB ต้องมีขนาดเท่ากันและหักล้างกัน: q E = q v B ⇒ v = E / B"
          ]
        }
      ],
      "application": {
        "text": "เครื่องเร่งอนุภาคไซโคลตรอน (Cyclotron ผลิตไอโซโทปรังสีทางการแพทย์เช่น FDG สำหรับ PET scan), มวลสเปกโตรมิเตอร์ของเบนบริดจ์ (Bainbridge Mass Spectrometer), และแสงเหนือ-แสงใต้ (Aurora Borealis จากอิเล็กตรอนวิ่งเกลียวตามเส้นแรงแม่เหล็กโลก)",
        "validWhen": "ความเร็วอนุภาคต่ำพอที่มวลนิ่งไม่เพิ่มขึ้นตามผลสัมพัทธภาพ (v < 0.1c)",
        "invalidWhen": "ความเร็วเข้าใกล้แสง มวลสัมพัทธภาพจะเพิ่มขึ้นทำให้ความถี่ไซโคลตรอนเพี้ยน (ต้องใช้ Synchrocyclotron หรือ Synchrotron)"
      },
      "example": {
        "problem": "ในเครื่องคัดแยกความเร็ว สนามไฟฟ้ามีขนาด E = 2.4 × 10⁴ V/m และสนามแม่เหล็ก B = 0.080 T (ก) อนุภาคต้องมีความเร็วเท่าใดจึงจะเคลื่อนที่เป็นเส้นตรงผ่านไปได้ (ข) หากอนุภาคนี้คืออิเล็กตรอน (m = 9.11 × 10⁻³¹ kg, q = -1.60 × 10⁻¹⁹ C) เมื่อหลุดเข้าสู่บริเวณที่มีเฉพาะสนามแม่เหล็ก B = 0.080 T รัศมีวงโคจรจะเป็นเท่าใด",
        "steps": [
          "ข้อ (ก) อนุภาคไม่เบี่ยงเบนเมื่อแรงไฟฟ้าหักล้างกับแรงแม่เหล็กพอดี: v = E / B",
          "แทนค่า: v = (2.4 × 10⁴ V/m) / (0.080 T) = 3.0 × 10⁵ m/s",
          "ข้อ (ข) รัศมีไซโคลตรอนของอิเล็กตรอน: r = (m v) / (|q| B)",
          "แทนค่า: r = [(9.11 × 10⁻³¹ kg)(3.0 × 10⁵ m/s)] / [(1.60 × 10⁻¹⁹ C)(0.080 T)]",
          "ตัวเศษ = 2.733 × 10⁻²⁵, ตัวส่วน = 1.28 × 10⁻²⁰",
          "r = 2.733 × 10⁻²⁵ / 1.28 × 10⁻²⁰ = 2.135 × 10⁻⁵ m ≈ 2.14 × 10⁻² mm = 21.4 μm",
          "ตอบ: (ก) ความเร็วที่คัดแยกได้คือ 3.0 × 10⁵ m/s, (ข) รัศมีวงโคจรของอิเล็กตรอนเท่ากับ 21.4 ไมโครเมตร"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><rect x=\"50\" y=\"30\" width=\"120\" height=\"70\" fill=\"#1e293b\" stroke=\"#64748b\"/><text x=\"110\" y=\"20\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">Velocity Selector (E/B)</text><line x1=\"20\" y1=\"65\" x2=\"170\" y2=\"65\" stroke=\"#f59e0b\" stroke-width=\"2\"/><text x=\"80\" y=\"55\" fill=\"#38bdf8\" font-size=\"10\">E (↓)</text><text x=\"130\" y=\"55\" fill=\"#10b981\" font-size=\"10\">B (⊗)</text><circle cx=\"230\" cy=\"65\" r=\"35\" fill=\"none\" stroke=\"#ec4899\" stroke-width=\"2\" stroke-dasharray=\"3\"/><circle cx=\"170\" cy=\"65\" r=\"4\" fill=\"#f59e0b\"/><text x=\"230\" y=\"65\" fill=\"#ec4899\" font-size=\"10\" text-anchor=\"middle\">r = mv/qB</text></svg>",
        "diagramCaption": "เครื่องคัดแยกความเร็วร่วมกับห้องเบี่ยงเบนแม่เหล็กไซโคลตรอน"
      },
      "observations": [
        "ความถี่ไซโคลตรอนไม่ขึ้นกับความเร็วหรือรัศมี หมายความว่าอนุภาคที่วิ่งเร็วกว่าจะโคจรเป็นวงกลมวงใหญ่ขึ้นแต่ใช้เวลาครบรอบเท่าเดิมเสมอ",
        "นี่คือหัวใจของเครื่องเร่งไซโคลตรอนที่สามารถใช้ความถี่กระแสสลับคงที่ในการเร่งอนุภาคทุกรอบได้"
      ]
    },
    {
      "id": "ch06-th18",
      "divisionId": "div-ch06-magnetostatics-forces",
      "divisionTitle": "ภาคที่ 3: แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก",
      "numberTh": "ทฤษฎีที่ 18",
      "type": "law",
      "titleTh": "แรงแม่เหล็กกระทำต่อลวดตัวนำที่มีกระแสไหล (F = I L × B)",
      "titleEn": "Magnetic Force on Current-Carrying Wire (F = I L x B)",
      "summary": "แรงรวมต่ออิเล็กตรอนนำไฟฟ้าในเส้นลวด F = I(L × B) กฎมือขวา และแรงดันต่อลำโพงไฟฟ้าและมอเตอร์กระแสตรง",
      "definition": {
        "text": "เมื่อวางเส้นลวดตัวนำที่มีกระแสไฟฟ้า I ไหลผ่านไว้ในสนามแม่เหล็ก B อิเล็กตรอนอิสระที่กำลังลอยเลื่อนภายในเนื้อโลหะแต่ละตัวจะได้รับแรงแม่เหล็กขนาดเล็ก ผลรวมของแรงระดับจุลภาคทั้งหมดเหล่านี้จะถ่ายทอดผ่านโครงสร้างผลึกโลหะกลายเป็นแรงทางกลในระดับมหภาคกระทำต่อเส้นลวดทั้งเส้น: F = I (L × B) โดย L เป็นเวกเตอร์ความยาวของลวดชี้ตามทิศทางกระแสไฟฟ้า"
      },
      "principle": {
        "text": "หลักการสำคัญ:\n1. ลวดตรงยาว L ในสนามสม่ำเสมอ: $\\mathbf{F} = I (\\mathbf{L} \\times \\mathbf{B})$ (ขนาด $F = I L B \\sin\\theta$)\n2. ลวดโค้งรูปทรงใดๆ ในสนามไม่สม่ำเสมอ: $\\mathbf{F} = \\int I (d\\mathbf{l} \\times \\mathbf{B})$\n3. สำหรับวงลูปปิดใดๆ ในสนามแม่เหล็กสม่ำเสมอ แรงสุทธิมีค่าเป็นศูนย์เสมอ: $\\mathbf{F}_{\\text{net}} = I \\left(\\oint d\\mathbf{l}\\right) \\times \\mathbf{B} = 0$ (เพราะผลรวมเวกเตอร์การกระจัดปิดเป็นศูนย์)\n4. กฎมือขวา: สี่นิ้วชี้ตามทิศกระแส I วนเข้าหาสนาม B นิ้วโป้งจะชี้ทิศของแรง F ที่กระทำต่อลวด"
      },
      "formulas": [
        {
          "name": "แรงแม่เหล็กบนลวดตัวนำ (Magnetic Force on Wire)",
          "latex": "\\mathbf{F} = I (\\mathbf{L} \\times \\mathbf{B}), \\quad d\\mathbf{F} = I (d\\mathbf{l} \\times \\mathbf{B})",
          "symbols": [
            {
              "sym": "\\mathbf{F}",
              "desc": "แรงแม่เหล็กลัพธ์บนลวด",
              "unit": "\\text{N}"
            },
            {
              "sym": "I",
              "desc": "กระแสไฟฟ้าในลวด",
              "unit": "\\text{A}"
            },
            {
              "sym": "\\mathbf{L}",
              "desc": "เวกเตอร์ความยาวลวดชี้ตามทิศกระแส",
              "unit": "\\text{m}"
            },
            {
              "sym": "\\mathbf{B}",
              "desc": "สนามแม่เหล็กภายนอก",
              "unit": "\\text{T}"
            }
          ],
          "derivationSteps": [
            "พิจารณาลวดยาว L พื้นที่หน้าตัด A บรรจุอิเล็กตรอนจำนวน N = n A L",
            "แต่ละอิเล็กตรอนได้รับแรง F_i = -e (v_d × B)",
            "แรงรวมบนอิเล็กตรอนทั้งหมด: F_tot = N F_i = (n A L) [-e (v_d × B)]",
            "เนื่องจากกระแสไฟฟ้า I = n e A v_d และทิศของ I ชี้ตรงข้ามกับ v_d",
            "ดังนั้น (n e A v_d) L = I L โดยเวกเตอร์ L มีทิศตามกระแส",
            "จะได้สมการมหภาค: F = I (L × B)"
          ]
        }
      ],
      "application": {
        "text": "ลำโพงเสียง (Voice Coil ในสนามแม่เหล็กถาวรผลักกรวยลำโพงสั่น), มอเตอร์ไฟฟ้ากระแสตรง (DC Motor), ปืนแม่เหล็กไฟฟ้ารางคู่ขนาน (Railgun), และรางรถไฟความเร็วสูง Maglev",
        "validWhen": "กระแสไหลต่อเนื่องสม่ำเสมอในลวดตัวนำ",
        "invalidWhen": "สนามแม่เหล็กมีความเข้มสูงจนแรงแม่เหล็กทำให้โครงสร้างผลึกโลหะยืดตัวเสียรูปทรงอย่างถาวร"
      },
      "example": {
        "problem": "ลวดทองแดงตรงยาว L = 40 cm มวล m = 30 g วางตัวในแนวนอนทอดข้ามรางตัวนำสองข้าง ต่อเข้ากับแหล่งจ่ายไฟจนมีกระแส I = 5.0 A ไหลผ่าน ถ้ามีสนามแม่เหล็กสม่ำเสมอ B ในแนวนอนตั้งฉากกับลวด จงหาขนาดของ B ที่น้อยที่สุดที่สามารถพยุงลวดให้ลอยต้านแรงโน้มถ่วงได้ (g = 9.8 m/s²)",
        "steps": [
          "เพื่อให้ลวดลอยตัวได้ แรงแม่เหล็ก F_B ต้องมีทิศชี้ขึ้นในแนวดิ่ง และมีขนาดเท่ากับน้ำหนักของลวด: F_B = m g",
          "น้ำหนักของลวด: W = m g = (0.030 kg)(9.8 m/s²) = 0.294 N",
          "แรงแม่เหล็ก F_B = I L B sin θ (เนื่องจาก B ต้านฉากกับลวดและเลือกทิศให้ได้แรงสูงสุด sin θ = 1): F_B = I L B",
          "สมดุลแรง: I L B = m g ⇒ B = (m g) / (I L)",
          "แทนค่าตัวเลข: B = 0.294 / (5.0 A × 0.40 m) = 0.294 / 2.0 = 0.147 T",
          "ตอบ: ขนาดสนามแม่เหล็กที่น้อยที่สุดที่พยุงลวดได้คือ 0.147 เทสลา (หรือ 147 mT)"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"80\" y1=\"65\" x2=\"320\" y2=\"65\" stroke=\"#f59e0b\" stroke-width=\"6\"/><circle cx=\"80\" cy=\"65\" r=\"6\" fill=\"#f59e0b\"/><circle cx=\"320\" cy=\"65\" r=\"6\" fill=\"#f59e0b\"/><text x=\"100\" y=\"55\" fill=\"#f59e0b\" font-size=\"11\">I →</text><line x1=\"200\" y1=\"65\" x2=\"200\" y2=\"15\" stroke=\"#10b981\" stroke-width=\"2.5\" marker-end=\"url(#arrow-green)\"/><text x=\"210\" y=\"30\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\">F_B = ILB (พยุงขึ้น)</text><line x1=\"200\" y1=\"65\" x2=\"200\" y2=\"115\" stroke=\"#ef4444\" stroke-width=\"2.5\" marker-end=\"url(#arrow-red)\"/><text x=\"210\" y=\"105\" fill=\"#ef4444\" font-size=\"11\" font-weight=\"bold\">W = mg (ดิ่งลง)</text></svg>",
        "diagramCaption": "แรงแม่เหล็กพยุงน้ำหนักเส้นลวดตัวนำต้านแรงโน้มถ่วงโลก"
      },
      "observations": [
        "หากสลับทิศทางของกระแสไฟฟ้า แรงแม่เหล็กจะกลับทิศทางเป็นดึงลงทันที",
        "ลวดตัวนำรูปวงกลมปิดในสนามสม่ำเสมอจะมีแรงลัพธ์สุทธิเป็นศูนย์เสมอ แต่มีทอร์กหมุน"
      ]
    },
    {
      "id": "ch06-th19",
      "divisionId": "div-ch06-magnetostatics-forces",
      "divisionTitle": "ภาคที่ 3: แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก",
      "numberTh": "ทฤษฎีที่ 19",
      "type": "concept",
      "titleTh": "โมเมนต์ขั้วคู่แม่เหล็กและทอร์กกระทำต่อขดลวด",
      "titleEn": "Magnetic Dipole Moment & Torque on Current Loop",
      "summary": "โมเมนต์แม่เหล็ก μ = NIA n̂ ทอร์กหมุน τ = μ × B พลังงานศักย์ U = -μ · B และหลักการทำงานของมอเตอร์ไฟฟ้า",
      "definition": {
        "text": "ขดลวดตัวนำระนาบจำนวน N รอบ มีพื้นที่หน้าตัด A และมีกระแสไฟฟ้า I ไหลวน จะประพฤติตนเป็นขั้วคู่แม่เหล็ก (Magnetic Dipole) โดยมีเวกเตอร์โมเมนต์ขั้วคู่แม่เหล็ก μ = N I A n̂ ทิศทางของเวกเตอร์พื้นที่ n̂ เป็นไปตามกฎมือขวา เมื่อขดลวดนี้วางในสนามแม่เหล็กภายนอก B แรงลัพธ์เป็นศูนย์แต่จะเกิดโมเมนต์แรงบิด (Torque) τ = μ × B หมุนขดลวดให้เวกเตอร์โมเมนต์ขนานกับสนามแม่เหล็ก"
      },
      "principle": {
        "text": "หลักการสำคัญของขดลวดแม่เหล็ก:\n1. โมเมนต์ขั้วคู่แม่เหล็ก: $\\boldsymbol{\\mu} = N I \\mathbf{A}$ (มีหน่วยเป็น $\\text{A}\\cdot\\text{m}^2$ หรือ $\\text{J/T}$)\n2. ทอร์กหมุน: $\\boldsymbol{\\tau} = \\boldsymbol{\\mu} \\times \\mathbf{B}$ (ขนาด $\\tau = N I A B \\sin\\theta$ เมื่อ $\\theta$ คือมุมระหว่าง $\\boldsymbol{\\mu}$ กับ $\\mathbf{B}$)\n3. พลังงานศักย์แม่เหล็ก: $U = -\\boldsymbol{\\mu} \\cdot \\mathbf{B} = -\\mu B \\cos\\theta$\n4. ตำแหน่งสมดุลเสถียร: $\\theta = 0^\\circ$ ($\\,U = -\\mu B$ ต่ำสุด, ทอร์กเป็นศูนย์)\n5. การหมุนต่อเนื่องในมอเตอร์ DC: ต้องใช้คอมมิวเทเตอร์ (Commutator) สลับทิศกระแสทุกครึ่งรอบ เพื่อให้ทอร์กหมุนไปในทิศทางเดิมตลอดเวลา"
      },
      "formulas": [
        {
          "name": "ทอร์กและพลังงานของขั้วคู่แม่เหล็ก (Magnetic Torque & Energy)",
          "latex": "\\boldsymbol{\\tau} = \\boldsymbol{\\mu} \\times \\mathbf{B}, \\quad U = -\\boldsymbol{\\mu} \\cdot \\mathbf{B}, \\quad \\boldsymbol{\\mu} = N I \\mathbf{A}",
          "symbols": [
            {
              "sym": "\\boldsymbol{\\tau}",
              "desc": "โมเมนต์แรงบิดหมุนลวด",
              "unit": "\\text{N}\\cdot\\text{m}"
            },
            {
              "sym": "\\boldsymbol{\\mu}",
              "desc": "เวกเตอร์โมเมนต์ขั้วคู่แม่เหล็ก",
              "unit": "\\text{A}\\cdot\\text{m}^2"
            },
            {
              "sym": "\\mathbf{B}",
              "desc": "สนามแม่เหล็กภายนอก",
              "unit": "\\text{T}"
            },
            {
              "sym": "N",
              "desc": "จำนวนรอบของขดลวด",
              "unit": "\\text{รอบ}"
            }
          ],
          "derivationSteps": [
            "พิจารณาขดลวดสี่เหลี่ยมผืนผ้ากว้าง a ยาว b วางทำมุม θ กับสนามแม่เหล็ก B",
            "ด้านยาว b มีกระแสไหล แรงกระทำคือ F = I b B อยู่คนละข้างของแกนหมุน",
            "แขนของแรงแต่ละข้างมีค่าเท่ากับ (a/2) sin θ",
            "ทอร์กรวมรอบแกนหมุนคือ τ = 2 * [F * (a/2) sin θ] = (I b B) * a sin θ = I (a b) B sin θ",
            "แทนพื้นที่ A = a b และขดลวด N รอบ: τ = N I A B sin θ",
            "เขียนในรูปเวกเตอร์: τ = μ × B และอินทิเกรตงาน dW = τ dθ จะได้ U = -μ · B"
          ]
        }
      ],
      "application": {
        "text": "มอเตอร์ไฟฟ้ากระแสตรง (DC Motor), กัลวาโนมิเตอร์แบบขดลวดเคลื่อนที่ (D'Arsonval Galvanometer), เข็มทิศแม่เหล็ก, และการตรวจด้วยคลื่นแม่เหล็กไฟฟ้า (MRI Spin alignment)",
        "validWhen": "ขดลวดเป็นขดลวดแบนระนาบและสนามแม่เหล็กสม่ำเสมอทั่วพื้นที่ขดลวด",
        "invalidWhen": "สนามแม่เหล็กมีความชันสูงมาก ซึ่งจะเกิดแรงสุทธิ F = ∇(μ · B) นอกเหนือจากทอร์ก"
      },
      "example": {
        "problem": "ขดลวดสี่เหลี่ยมผืนผ้ามีจำนวนรอบ N = 100 รอบ กว้าง 5.0 cm ยาว 8.0 cm มีกระแสไหล I = 2.0 A วางในสนามแม่เหล็กสม่ำเสมอ B = 0.50 T ถ้าเวกเตอร์ระนาบขดลวดทำมุม 60° กับสนามแม่เหล็ก จงหา: (ก) โมเมนต์ขั้วคู่แม่เหล็ก μ (ข) ขนาดของทอร์กหมุน τ",
        "steps": [
          "หาพื้นที่ของขดลวด: A = (0.050 m)(0.080 m) = 4.0 × 10⁻³ m²",
          "ข้อ (ก) ขนาดโมเมนต์ขั้วคู่แม่เหล็ก: μ = N I A = (100)(2.0 A)(4.0 × 10⁻³ m²) = 0.80 A·m²",
          "มุม θ คือมุมระหว่างเวกเตอร์ตั้งฉากระนาบ (μ) กับสนาม B: θ = 60°",
          "ข้อ (ข) ขนาดของทอร์ก: τ = μ B sin θ = (0.80 A·m²)(0.50 T) sin(60°)",
          "τ = 0.40 × 0.8660 = 0.3464 N·m ≈ 0.35 N·m",
          "ตอบ: (ก) โมเมนต์แม่เหล็ก 0.80 A·m², (ข) ทอร์กหมุนเท่ากับ 0.35 N·m"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><polygon points=\"120,90 240,90 280,40 160,40\" fill=\"#334155\" stroke=\"#f59e0b\" stroke-width=\"2\"/><line x1=\"200\" y1=\"65\" x2=\"200\" y2=\"15\" stroke=\"#ec4899\" stroke-width=\"2.5\" marker-end=\"url(#arrow-pink)\"/><text x=\"205\" y=\"25\" fill=\"#ec4899\" font-size=\"10\">μ = NIA n̂</text><line x1=\"50\" y1=\"65\" x2=\"350\" y2=\"65\" stroke=\"#10b981\" stroke-width=\"1.5\" marker-end=\"url(#arrow-green)\"/><text x=\"360\" y=\"70\" fill=\"#10b981\" font-size=\"11\">B</text><path d=\"M 230 65 A 30 30 0 0 0 210 35\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"235\" y=\"45\" fill=\"#38bdf8\" font-size=\"10\">θ</text></svg>",
        "diagramCaption": "ขดลวดระนาบที่มีกระแสไหลได้รับทอร์กหมุนในสนามแม่เหล็กภายนอก"
      },
      "observations": [
        "ทอร์กมีค่าสูงสุดเมื่อระนาบขดลวดขนานกับสนามแม่เหล็ก (θ = 90° เวกเตอร์พื้นที่ตั้งฉากกับ B)",
        "ทอร์กเป็นศูนย์เมื่อระนาบขดลวดตั้งฉากกับสนามแม่เหล็ก (θ = 0° เวกเตอร์พื้นที่ขนานกับ B)"
      ]
    },
    {
      "id": "ch06-th20",
      "divisionId": "div-ch06-magnetostatics-forces",
      "divisionTitle": "ภาคที่ 3: แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก",
      "numberTh": "ทฤษฎีที่ 20",
      "type": "phenomenon",
      "titleTh": "ปรากฏการณ์ฮอลล์และแรงดันฮอลล์ (The Hall Effect)",
      "titleEn": "The Hall Effect & Hall Voltage",
      "summary": "แรงดันตกคร่อมขวาง V_H = IB/(nqd) การพิสูจน์ชนิดของพาหะประจุในโลหะและสารกึ่งตัวนำ และการวัดสนามแม่เหล็ก",
      "definition": {
        "text": "ปรากฏการณ์ฮอลล์ (The Hall Effect, เอ็ดวิน ฮอลล์, 1879) เกิดขึ้นเมื่อกระแสไฟฟ้า I ไหลผ่านแผ่นตัวนำบางๆ ภายใต้สนามแม่เหล็กตั้งฉาก B แรงแม่เหล็กจะผลักประจุพาหะให้เบี่ยงเบนไปสะสมอยู่ที่ขอบข้างด้านหนึ่งของแผ่นตัวนำ การสะสมประจุนี้ทำให้เกิดสนามไฟฟ้าตามแนวขวาง (Hall Electric Field, E_H) และความต่างศักย์ขวาง เรียกว่า แรงดันฮอลล์ (Hall Voltage, V_H) ซึ่งมีเครื่องหมายบอกชนิดของพาหะประจุ (+ หรือ -)"
      },
      "principle": {
        "text": "หลักการสำคัญและสมดุลแรง:\n1. สมดุลของแรงไฟฟ้าขวางและแรงแม่เหล็ก: $q E_H = q v_d B \\Rightarrow E_H = v_d B$\n2. แรงดันฮอลล์: $V_H = E_H w = v_d B w$ เมื่อ $w$ คือความกว้างแผ่น\n3. แทนความเร็วลอยเลื่อน $v_d = \\frac{I}{n q A} = \\frac{I}{n q (w d)}$ จะได้: $V_H = \\frac{I B}{n q d}$\n4. สัมประสิทธิ์ฮอลล์ (Hall Coefficient): $R_H = \\frac{1}{n q}$ บ่งบอกความหนาแน่นและชนิดของพาหะประจุ (ในสารกึ่งตัวนำชนิด p ค่า $R_H > 0$, ชนิด n และโลหะส่วนใหญ่ $R_H < 0$)"
      },
      "formulas": [
        {
          "name": "แรงดันฮอลล์และสัมประสิทธิ์ฮอลล์ (Hall Voltage & Coefficient)",
          "latex": "V_H = \\frac{I B}{n q d} = R_H \\frac{I B}{d}, \\quad R_H = \\frac{1}{n q}",
          "symbols": [
            {
              "sym": "V_H",
              "desc": "แรงดันฮอลล์ตามแนวขวาง",
              "unit": "\\text{V}"
            },
            {
              "sym": "I",
              "desc": "กระแสไฟฟ้าที่ไหลตามยาว",
              "unit": "\\text{A}"
            },
            {
              "sym": "B",
              "desc": "สนามแม่เหล็กที่ตั้งฉากกับแผ่น",
              "unit": "\\text{T}"
            },
            {
              "sym": "d",
              "desc": "ความหนาของแผ่นตัวนำในแนวสนาม B",
              "unit": "\\text{m}"
            },
            {
              "sym": "n",
              "desc": "ความหนาแน่นของพาหะประจุ",
              "unit": "\\text{m}^{-3}"
            },
            {
              "sym": "q",
              "desc": "ประจุของพาหะ (±e)",
              "unit": "\\text{C}"
            }
          ],
          "derivationSteps": [
            "พาหะประจุมีความเร็วลอยเลื่อน v_d ในสนามแม่เหล็ก B ได้รับแรงแม่เหล็ก F_B = q v_d B",
            "ประจุถูกผลักไปกองที่ขอบข้าง ทำให้ขอบข้างข้างหนึ่งสะสมประจุบวกและอีกข้างสะสมประจุลบ",
            "สนามไฟฟ้าขวาง E_H ก่อตัวขึ้น สร้างแรงไฟฟ้า F_E = q E_H สวนทางกับแรงแม่เหล็ก",
            "เมื่อถึงสมดุลสถิต: F_E = F_B ⇒ q E_H = q v_d B ⇒ E_H = v_d B",
            "ความต่างศักย์ฮอลล์ V_H = E_H w = v_d B w",
            "แทน v_d = I / (n q w d): V_H = [I / (n q w d)] * B w = (I B) / (n q d)"
          ]
        }
      ],
      "application": {
        "text": "โพรบวัดความเข้มสนามแม่เหล็กแบบฮอลล์ (Hall Probe / Gaussmeter), เซนเซอร์จับตำแหน่งและรอบการหมุนของล้อรถยนต์ (ABS Wheel Speed Sensor), และเซนเซอร์วัดกระแสไฟฟ้าแบบไม่สัมผัส (Hall Current Sensor)",
        "validWhen": "ความหนาแน่นกระแสสม่ำเสมอทั่วแผ่นและสนามแม่เหล็กตั้งฉาก",
        "invalidWhen": "สนามแม่เหล็กสูงยิ่งยวดที่อุณหภูมิต่ำใกล้ศูนย์สัมบูรณ์ (จะเกิด Quantum Hall Effect ความต้านทานควอนไทซ์ h/e²)"
      },
      "example": {
        "problem": "แผ่นตัวนำเงินบางมีความกว้าง w = 1.5 cm หนา d = 0.10 mm มีกระแสไหล I = 6.0 A วางในสนามแม่เหล็ก B = 1.2 T ตั้งฉากกับแผ่น วัดแรงดันฮอลล์ได้ V_H = 4.5 μV จงหา: (ก) ความหนาแน่นของอิเล็กตรอนอิสระ n ของโลหะเงิน (ข) สัมประสิทธิ์ฮอลล์ R_H",
        "steps": [
          "แปลงหน่วย: d = 0.10 × 10⁻³ m, V_H = 4.5 × 10⁻⁶ V, q = e = 1.602 × 10⁻¹⁹ C",
          "จากสูตร V_H = (I B) / (n e d) จัดรูปหา n:",
          "n = (I B) / (e d V_H)",
          "แทนค่าตัวเลข: n = (6.0 A × 1.2 T) / [(1.602 × 10⁻¹⁹ C)(0.10 × 10⁻³ m)(4.5 × 10⁻⁶ V)]",
          "ตัวเศษ = 7.2",
          "ตัวส่วน = 1.602 × 10⁻¹⁹ × 10⁻⁴ × 4.5 × 10⁻⁶ = 7.209 × 10⁻²⁹",
          "n = 7.2 / (7.209 × 10⁻²⁹) ≈ 9.99 × 10²⁷ m⁻³ ≈ 1.0 × 10²⁸ m⁻³",
          "ข้อ (ข) หาค่า R_H: R_H = 1 / (n q) = -1 / [(1.0 × 10²⁸)(1.602 × 10⁻¹⁹)] = -6.24 × 10⁻¹⁰ m³/C",
          "ตอบ: (ก) ความหนาแน่นอิเล็กตรอน n = 1.0 × 10²⁸ m⁻³, (ข) สัมประสิทธิ์ฮอลล์ -6.24 × 10⁻¹⁰ m³/C (เครื่องหมายลบยืนยันว่าพาหะคืออิเล็กตรอน)"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><polygon points=\"60,40 320,40 340,90 80,90\" fill=\"#334155\" stroke=\"#94a3b8\"/><text x=\"40\" y=\"70\" fill=\"#f59e0b\" font-size=\"11\">I →</text><circle cx=\"200\" cy=\"65\" r=\"4\" fill=\"#38bdf8\"/><text x=\"200\" y=\"55\" fill=\"#38bdf8\" font-size=\"9\">e⁻</text><line x1=\"200\" y1=\"65\" x2=\"250\" y2=\"78\" stroke=\"#ef4444\" stroke-width=\"2\" marker-end=\"url(#arrow-red)\"/><text x=\"250\" y=\"95\" fill=\"#ef4444\" font-size=\"9\">F_B</text><text x=\"320\" y=\"110\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\">+ V_H -</text></svg>",
        "diagramCaption": "แรงแม่เหล็กผลักอิเล็กตรอนไปกองที่ขอบข้างทำให้เกิดแรงดันฮอลล์ขวาง"
      },
      "observations": [
        "หากพาหะเป็นประจุบวก (โฮลในสารกึ่งตัวนำ p) ประจุบวกจะถูกผลักไปขอบข้างเดิม ทำให้ขั้วไฟฟ้าของ V_H สลับกัน!",
        "ปรากฏการณ์ฮอลล์คือการทดลองแรกในประวัติศาสตร์ที่พิสูจน์โดยตรงว่าพาหะประจุในโลหะมีประจุเป็นลบ"
      ]
    },
    {
      "id": "ch06-th21",
      "divisionId": "div-ch06-magnetostatics-forces",
      "divisionTitle": "ภาคที่ 3: แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก",
      "numberTh": "ทฤษฎีที่ 21",
      "type": "law",
      "titleTh": "กฎของบีโอต์-ซาวารต์ สำหรับลวดตรงและห่วงวงกลม",
      "titleEn": "Biot-Savart Law for Current Elements & Circular Loops",
      "summary": "สนามแม่เหล็กย่อย dB = (μ₀/4π)(I dl × r̂)/r² การอินทิเกรตลวดตรงยาว B = μ₀I/2πr และแกนห่วงวงกลม B = μ₀IR²/2(R²+z²)^{3/2}",
      "definition": {
        "text": "กฎของบีโอต์-ซาวารต์ (Biot-Savart Law, ฌ็อง-บาติสต์ บีโอต์ และ เฟลิกซ์ ซาวารต์, 1820) เป็นกฎมูลฐานที่อธิบายว่า กระแสไฟฟ้าคือแหล่งกำเนิดของสนามแม่เหล็ก โดยแต่ละชิ้นส่วนกระแสย่อย I dl จะสร้างสนามแม่เหล็กย่อย dB ที่จุดสังเกตตามสมการ: dB = (μ₀ / 4π) * (I dl × r̂) / r² เมื่ออินทิเกรตตลอดเส้นลวดจะได้สนามแม่เหล็กลัพธ์ของรูปทรงใดๆ เช่น ลวดตรงยาวอนันต์ หรือห่วงวงกลมมีกระแส"
      },
      "principle": {
        "text": "ผลลัพธ์สำคัญจากกฎของบีโอต์-ซาวารต์:\n1. ลวดตรงยาวอนันต์: $B = \\frac{\\mu_0 I}{2\\pi r}$ (เส้นสนามเป็นวงกลมล้อมรอบลวด ทิศทางตามกฎมือขวาหัวแม่มือกำรอบลวด)\n2. จุดศูนย์กลางของห่วงวงกลมรัศมี R: $B = \\frac{\\mu_0 I}{2R}$\n3. บนแกนของห่วงวงกลมที่ระยะห่าง z: $B_z = \\frac{\\mu_0 I R^2}{2(R^2 + z^2)^{3/2}}$ (เมื่อ $z \\gg R$ จะได้ $B_z \\approx \\frac{\\mu_0 \\mu}{2\\pi z^3}$ ซึ่งมีพฤติกรรมเป็นไดโพลแม่เหล็ก)\n4. ค่าคงที่สภาพให้ซึมผ่านได้ของสุญญากาศ: $\\mu_0 = 4\\pi \\times 10^{-7} \\text{ T}\\cdot\\text{m/A} \\approx 1.257 \\times 10^{-6} \\text{ H/m}$"
      },
      "formulas": [
        {
          "name": "กฎของบีโอต์-ซาวารต์ (Biot-Savart Law)",
          "latex": "d\\mathbf{B} = \\frac{\\mu_0}{4\\pi} \\frac{I d\\mathbf{l} \\times \\hat{\\mathbf{r}}}{r^2}, \\quad B_{\\text{wire}} = \\frac{\\mu_0 I}{2\\pi r}, \\quad B_{\\text{loop-center}} = \\frac{\\mu_0 I}{2R}",
          "symbols": [
            {
              "sym": "d\\mathbf{B}",
              "desc": "สนามแม่เหล็กย่อยจากชิ้นส่วนกระแส",
              "unit": "\\text{T}"
            },
            {
              "sym": "I d\\mathbf{l}",
              "desc": "เวกเตอร์ชิ้นส่วนกระแสย่อย",
              "unit": "\\text{A}\\cdot\\text{m}"
            },
            {
              "sym": "\\mu_0",
              "desc": "สภาพยอมซึมผ่านได้ของสุญญากาศ (4π × 10⁻⁷)",
              "unit": "\\text{T}\\cdot\\text{m/A}"
            },
            {
              "sym": "r",
              "desc": "ระยะห่างจากชิ้นส่วนกระแสไปยังจุดสังเกต",
              "unit": "\\text{m}"
            }
          ],
          "derivationSteps": [
            "พิจารณาลวดตรงยาวอนันต์วางตามแกน x จุดสังเกต P อยู่ห่างจากลวดเป็นระยะ r บนแกน y",
            "ชิ้นส่วนกระแสย่อย I dx ทำมุม θ กับเวกเตอร์บอกทิศ r̂: |dx × r̂| = dx sin θ",
            "dB = (μ₀ I / 4π) (dx sin θ / s²) โดย s = √(x² + r²) และ sin θ = r / s",
            "อินทิเกรตตลอดลวดจาก x = -∞ ถึง +∞: B = (μ₀ I r / 4π) ∫_{-∞}^∞ dx / (x² + r²)^{3/2}",
            "ใช้วิธีเปลี่ยนตัวแปรตรีโกณมิติ x = r tan φ จะได้อินทิกรัลเท่ากับ 2 / r²",
            "แทนค่ากลับ: B = (μ₀ I r / 4π) * (2 / r²) = μ₀ I / (2π r)"
          ]
        }
      ],
      "application": {
        "text": "การคำนวณสนามแม่เหล็กของขดลวดเฮล์มโฮลทซ์ (Helmholtz Coils สร้างสนามสม่ำเสมอ), แม่เหล็กไฟฟ้ายกของหนักในโรงงานรีไซเคิล, และระบบเหนี่ยวนำไร้สาย",
        "validWhen": "กระแสไฟฟ้าคงตัวสถิต (Steady currents, Magnetostatic approximation)",
        "invalidWhen": "กระแสเปลี่ยนแปลงเร็วมากตามเวลา (ต้องรวมผลของกระแสกระจัดและศักย์หน่วงเวลา Jefimenko's equations)"
      },
      "example": {
        "problem": "ห่วงลวดวงกลมรัศมี R = 10 cm มีกระแสไฟฟ้าไหลวน I = 8.0 A จงหาสนามแม่เหล็กที่: (ก) จุดศูนย์กลางของห่วง (ข) จุดบนแกนกลางห่วงที่อยู่ห่างจากระนาบห่วง z = 20 cm",
        "steps": [
          "แปลงหน่วย: R = 0.10 m, z = 0.20 m, I = 8.0 A, μ₀ = 4π × 10⁻⁷ T·m/A",
          "ข้อ (ก) สนามที่จุดศูนย์กลาง (z = 0): B = (μ₀ I) / (2 R)",
          "แทนค่า: B = (4π × 10⁻⁷ × 8.0) / (2 × 0.10) = (3.2 × 10⁻⁵ π) / 0.20 = 1.6 × 10⁻⁴ π ≈ 5.03 × 10⁻⁵ T = 50.3 μT",
          "ข้อ (ข) สนามบนแกนที่ระยะ z: B_z = (μ₀ I R²) / [2 (R² + z²)^{3/2}]",
          "R² = (0.10)² = 0.01 m², z² = (0.20)² = 0.04 m² ⇒ R² + z² = 0.05 m²",
          "(R² + z²)^{3/2} = (0.05)^{1.5} = √(0.05³) = √(0.000125) ≈ 0.01118 m³",
          "แทนค่าตัวเศษ: μ₀ I R² = (4π × 10⁻⁷)(8.0)(0.01) = 3.2π × 10⁻⁸ ≈ 1.005 × 10⁻⁷ T·m³",
          "แทนค่าตัวส่วน: 2 × 0.01118 = 0.02236",
          "B_z = (1.005 × 10⁻⁷) / 0.02236 ≈ 4.50 × 10⁻⁶ T = 4.50 μT",
          "ตอบ: (ก) ที่ศูนย์กลาง B = 50.3 μT, (ข) บนแกน z = 20 cm ค่า B = 4.50 μT"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><ellipse cx=\"120\" cy=\"65\" rx=\"25\" ry=\"50\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"3\"/><text x=\"80\" y=\"40\" fill=\"#f59e0b\" font-size=\"11\">I</text><line x1=\"120\" y1=\"65\" x2=\"350\" y2=\"65\" stroke=\"#475569\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"120\" y1=\"65\" x2=\"220\" y2=\"65\" stroke=\"#38bdf8\" stroke-width=\"2.5\" marker-end=\"url(#arrow-blue)\"/><circle cx=\"120\" cy=\"65\" r=\"4\" fill=\"#38bdf8\"/><text x=\"120\" y=\"85\" fill=\"#38bdf8\" font-size=\"10\" text-anchor=\"middle\">B_center</text><circle cx=\"280\" cy=\"65\" r=\"4\" fill=\"#10b981\"/><line x1=\"280\" y1=\"65\" x2=\"330\" y2=\"65\" stroke=\"#10b981\" stroke-width=\"2\" marker-end=\"url(#arrow-green)\"/><text x=\"280\" y=\"85\" fill=\"#10b981\" font-size=\"10\" text-anchor=\"middle\">B(z)</text></svg>",
        "diagramCaption": "เส้นสนามแม่เหล็กบนแกนห่วงลวดวงกลมมีทิศพุ่งตามกฎมือขวา"
      },
      "observations": [
        "สนามแม่เหล็กของห่วงกระแสที่ระยะไกล z ≫ R มีพฤติกรรมเหมือนขั้วคู่แม่เหล็กและแปรผกผันกับระยะทางยกกำลังสาม (1/z³)",
        "เส้นสนามแม่เหล็กเป็นเส้นโค้งปิดต่อเนื่องเสมอ ไม่มีจุดเริ่มต้นหรือจุดสิ้นสุด (สอดคล้องกับ ∇ · B = 0)"
      ]
    },
    {
      "id": "ch06-th22",
      "divisionId": "div-ch06-magnetostatics-forces",
      "divisionTitle": "ภาคที่ 3: แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก",
      "numberTh": "ทฤษฎีที่ 22",
      "type": "law",
      "titleTh": "กฎวงรอบของแอมแปร์ โซเลนอยด์ และทอรอยด์",
      "titleEn": "Ampère's Circuital Law, Solenoids & Toroids",
      "summary": "อินทิกรัลตามเส้นปิด ∮ B · dl = μ₀ I_enc การคำนวณสนามในโซเลนอยด์ B = μ₀ n I และทอรอยด์ B = μ₀ N I / (2π r)",
      "definition": {
        "text": "กฎวงรอบของแอมแปร์ (Ampère's Circuital Law, อ็องเดร-มารี อ็องแปร์, 1826) ระบุว่า อินทิกรัลตามแนวเส้นปิด (Line integral) ของสนามแม่เหล็ก B รอบวงปิดสมมุติใดๆ (Amperian loop) ย่อมมีค่าเท่ากับผลคูณของค่าสภาพให้ซึมผ่านได้ของสุญญากาศ μ₀ กับกระแสไฟฟ้าสุทธิทั้งหมดที่พุ่งทะลุผ่านพื้นที่ที่วงปิดนั้นล้อมรอบ: ∮ B · dl = μ₀ I_enc กฎนี้ใช้หาขนาดสนามแม่เหล็กในระบบที่มีความสมมาตรสูงได้อย่างรวดเร็ว เช่น โซเลนอยด์และทอรอยด์"
      },
      "principle": {
        "text": "การประยุกต์กฎแอมแปร์กับโครงสร้างสมมาตรสูง:\n1. กฎแอมแปร์ในรูปอินทิกรัล: $\\oint_C \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{\\text{enc}}$\n2. โซเลนอยด์อุดมคติ (Ideal Solenoid): สนามภายนอกเป็นศูนย์ สนามภายในสม่ำเสมอ $B = \\mu_0 n I = \\mu_0 \\frac{N}{L} I$\n3. ทอรอยด์ (Toroid): ขดลวดพันบนแกนรูปวงแหวนโดนัทรัศมี r: $B = \\frac{\\mu_0 N I}{2\\pi r}$ (สนามถูกกักขังอยู่ภายในแกนวงแหวนทั้งหมด)\n4. กฎแอมแปร์ในรูปอนุพันธ์: $\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J}$"
      },
      "formulas": [
        {
          "name": "กฎวงรอบของแอมแปร์และสนามโซเลนอยด์ (Ampère's Law & Solenoid Formula)",
          "latex": "\\oint_C \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{\\text{enc}}, \\quad B_{\\text{solenoid}} = \\mu_0 n I, \\quad B_{\\text{toroid}} = \\frac{\\mu_0 N I}{2\\pi r}",
          "symbols": [
            {
              "sym": "\\oint_C \\mathbf{B} \\cdot d\\mathbf{l}",
              "desc": "อินทิกรัลเส้นปิดของสนามแม่เหล็ก",
              "unit": "\\text{T}\\cdot\\text{m}"
            },
            {
              "sym": "I_{\\text{enc}}",
              "desc": "กระแสสุทธิที่ถูกโอบล้อมในวงปิดแอมแปร์",
              "unit": "\\text{A}"
            },
            {
              "sym": "n",
              "desc": "จำนวนรอบต่อหน่วยความยาว (N/L)",
              "unit": "\\text{m}^{-1}"
            },
            {
              "sym": "N",
              "desc": "จำนวนรอบขดลวดทั้งหมด",
              "unit": "\\text{รอบ}"
            }
          ],
          "derivationSteps": [
            "สร้างวงปิดแอมแปร์สี่เหลี่ยมผืนผ้า กว้าง h ในโซเลนอยด์: ด้านหนึ่งอยู่ข้างในแกน อีกด้านอยู่นอกแกน",
            "อินทิกรัลตามด้านนอกเป็นศูนย์ (B_out ≈ 0) และด้านข้างตั้งฉากกับสนาม (B · dl = 0)",
            "เหลือเฉพาะด้านในแกนที่ขนานกับสนาม: ∮ B · dl = B * h",
            "จำนวนรอบขดลวดที่ถูกวงปิดโอบล้อมคือ N_enc = n * h",
            "กระแสรวมที่โอบล้อม: I_enc = N_enc * I = n h I",
            "จากกฎแอมแปร์: B * h = μ₀ (n h I) ⇒ B = μ₀ n I"
          ]
        }
      ],
      "application": {
        "text": "แม่เหล็กไฟฟ้าในเครื่อง MRI (สนาม 1.5 T - 3.0 T จากโซเลนอยด์ตัวนำยิ่งยวด), วาล์วไฟฟ้าโซเลนอยด์ (Solenoid Valve ในระบบควบคุมอัตโนมัติ), และหม้อแปลงแกนทอรอยด์สัญญาณรบกวนต่ำ",
        "validWhen": "กระแสไฟฟ้าคงตัวและมีความสมมาตรสูงตลอดแนวปิด",
        "invalidWhen": "สนามไฟฟ้าเปลี่ยนแปลงตามเวลา (แมกซ์เวลล์แก้ไขโดยเพิ่มพจน์กระแสกระจัด Displacement current μ₀ ε₀ ∂E/∂t)"
      },
      "example": {
        "problem": "โซเลนอยด์ยาว L = 50 cm มีจำนวนรอบทั้งหมด N = 1000 รอบ พันสม่ำเสมอ ต้องการสร้างสนามแม่เหล็กภายในแกนขนาด B = 10.0 mT จะต้องป้อนกระแสไฟฟ้า I เท่าใด",
        "steps": [
          "หาจำนวนรอบต่อหนึ่งหน่วยความยาว: n = N / L = 1000 / 0.50 m = 2000 รอบ/เมตร",
          "แปลงหน่วยสนามแม่เหล็ก: B = 10.0 × 10⁻³ T = 0.010 T",
          "จากสูตรสนามภายในโซเลนอยด์: B = μ₀ n I",
          "จัดรูปหากระแส I: I = B / (μ₀ n)",
          "แทนค่าตัวเลข: I = 0.010 / [(4π × 10⁻⁷)(2000)]",
          "คำนวณตัวส่วน: 4π × 10⁻⁷ × 2000 = 8π × 10⁻⁴ ≈ 2.5133 × 10⁻³",
          "I = 0.010 / (2.5133 × 10⁻³) ≈ 3.979 A ≈ 3.98 A",
          "ตอบ: จะต้องป้อนกระแสไฟฟ้าประมาณ 3.98 แอมแปร์"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><rect x=\"60\" y=\"35\" width=\"280\" height=\"60\" fill=\"none\" stroke=\"#64748b\" rx=\"6\"/><path d=\"M 70 35 Q 80 95 90 35 Q 100 95 110 35 Q 120 95 130 35 Q 140 95 150 35 Q 160 95 170 35 Q 180 95 190 35 Q 200 95 210 35 Q 220 95 230 35 Q 240 95 250 35 Q 260 95 270 35 Q 280 95 290 35 Q 300 95 310 35 Q 320 95 330 35\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2.5\"/><line x1=\"80\" y1=\"65\" x2=\"320\" y2=\"65\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-dasharray=\"4\"/><text x=\"200\" y=\"60\" fill=\"#38bdf8\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">B = μ₀ n I</text></svg>",
        "diagramCaption": "สนามแม่เหล็กสม่ำเสมอหนาแน่นภายในแกนของโซเลนอยด์"
      },
      "observations": [
        "สนามแม่เหล็กภายในโซเลนอยด์ไม่ขึ้นกับรัศมีหรือพื้นที่หน้าตัดของขดลวด แต่ขึ้นกับความหนาแน่นรอบ n และกระแส I เท่านั้น",
        "การใส่แกนสารแม่เหล็กเฟร์โร (เช่น เหล็กอ่อน μ_r ≈ 5000) จะเพิ่มความเข้มสนามแม่เหล็กได้หลายพันเท่า"
      ]
    },
    {
      "id": "ch06-th23",
      "divisionId": "div-ch06-magnetostatics-forces",
      "divisionTitle": "ภาคที่ 3: แม่เหล็กสถิต แรงแม่เหล็ก และแหล่งกำเนิดสนามแม่เหล็ก",
      "numberTh": "ทฤษฎีที่ 23",
      "type": "phenomenon",
      "titleTh": "แรงแม่เหล็กระหว่างลวดตัวนำขนานสองเส้นและนิยามแอมแปร์",
      "titleEn": "Magnetic Force Between Parallel Conductors & Ampere Definition",
      "summary": "กระแสทิศเดียวกันดึงดูดกัน กระแสสวนทางกันผลักกัน แรงต่อหน่วยความยาว F/L = μ₀I₁I₂/(2πd) และประวัติศาสตร์นิยามหน่วยแอมแปร์ SI",
      "definition": {
        "text": "เมื่อวางลวดตัวนำตรงยาวสองเส้นขนานกันที่ระยะห่าง d โดยมีกระแสไฟฟ้า I₁ และ I₂ ไหลผ่าน กระแสในลวดเส้นแรกจะสร้างสนามแม่เหล็ก B₁ ไปกระทำต่อลวดเส้นที่สอง ทำให้เกิดแรงแม่เหล็กกระทำต่อกัน: 'กระแสไหลในทิศทางเดียวกันจะดูดกัน และกระแสไหลสวนทางกันจะผลักกัน' โดยขนาดของแรงแม่เหล็กต่อหนึ่งหน่วยความยาวคือ F/L = (μ₀ I₁ I₂) / (2π d) ปรากฏการณ์นี้เคยถูกใช้เป็นนิยามมาตรฐานสากลของหน่วยแอมแปร์ (SI Base Unit Ampere) ก่อนปี 2019"
      },
      "principle": {
        "text": "หลักการฟิสิกส์ของแรงระหว่างลวดขนาน:\n1. สนามจากลวดเส้นที่ 1 ณ ตำแหน่งลวดเส้นที่ 2: $B_1 = \\frac{\\mu_0 I_1}{2\\pi d}$\n2. แรงกระทำต่อลวดยาว L ของเส้นที่ 2: $F_{12} = I_2 L B_1 = \\frac{\\mu_0 I_1 I_2 L}{2\\pi d}$\n3. แรงต่อหน่วยความยาว: $\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}$\n4. กฎข้อสามของนิวตัน: $\\mathbf{F}_{21} = -\\mathbf{F}_{12}$ เสมอ\n5. นิยามแอมแปร์เดิม (ก่อน 2019): กระแสคงตัว 1 A คือกระแสที่ไหลในลวดขนานยาวอนันต์สองเส้นในสุญญากาศ ห่างกัน 1 เมตร แล้วทำให้เกิดแรงระหว่างลวดเท่ากับ $2 \\times 10^{-7} \\text{ N/m}$ พอดี"
      },
      "formulas": [
        {
          "name": "แรงแม่เหล็กระหว่างลวดตัวนำขนาน (Parallel Wire Force per Length)",
          "latex": "\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}",
          "symbols": [
            {
              "sym": "F/L",
              "desc": "แรงแม่เหล็กต่อหนึ่งหน่วยความยาว",
              "unit": "\\text{N/m}"
            },
            {
              "sym": "I_1, I_2",
              "desc": "กระแสไฟฟ้าในลวดทั้งสองเส้น",
              "unit": "\\text{A}"
            },
            {
              "sym": "d",
              "desc": "ระยะห่างระหว่างแกนลวดทั้งสอง",
              "unit": "\\text{m}"
            },
            {
              "sym": "\\mu_0",
              "desc": "สภาพให้ซึมผ่านได้สุญญากาศ",
              "unit": "\\text{T}\\cdot\\text{m/A}"
            }
          ],
          "derivationSteps": [
            "จากกฎบีโอต์-ซาวารต์ ลวดเส้นที่ 1 สร้างสนาม B₁ = μ₀ I₁ / (2π d) พุ่งตั้งฉากกับลวดเส้นที่ 2",
            "จากสมการแรงบนลวด F = I (L × B): ลวดเส้นที่ 2 ได้รับแรง F₂ = I₂ L B₁ sin(90°)",
            "แทนค่า B₁ ลงไป: F₂ = I₂ L * [μ₀ I₁ / (2π d)]",
            "หารด้วยความยาว L: F/L = (μ₀ I₁ I₂) / (2π d)",
            "ทิศทางตามกฎมือขวา: เมื่อกระแสทิศเดียวกัน เวกเตอร์แรงชี้เข้าหากัน (แรงดึงดูด); เมื่อกระแสสวนทางกัน ชี้ออกจากกัน (แรงผลัก)"
          ]
        }
      ],
      "application": {
        "text": "เครื่องชั่งกระแสแอมแปร์ (Current Balance), การป้องกันแรงดันกลไกในบัสบาร์สถานีไฟฟ้าย่อยขณะเกิดการลัดวงจร (Short circuit busbar bracing), และสายสัญญาณคู่บิดเกลียว (Twisted Pair)",
        "validWhen": "ความยาวของเส้นลวด L มีค่ามากกว่าระยะห่าง d มาก (L ≫ d)",
        "invalidWhen": "ระยะห่าง d น้อยมากจนต้องคำนึงถึงขนาดเส้นผ่านศูนย์กลางของสายและความหนาแน่นกระแสไม่สมมาตร (Proximity effect)"
      },
      "example": {
        "problem": "สายไฟแรงสูงสองเส้นขนานกันในแนวราบ ห่างกัน d = 30 cm มีกระแสไฟฟ้า I₁ = 400 A และ I₂ = 400 A ไหลไปในทิศทางเดียวกัน จงหา: (ก) ขนาดและลักษณะของแรงแม่เหล็กต่อความยาว 1 เมตร (ข) แรงรวมที่กระทำต่อสายไฟยาว L = 50 เมตร",
        "steps": [
          "แปลงหน่วย: d = 0.30 m, I₁ = I₂ = 400 A",
          "เนื่องจากกระแสไหลไปในทิศทางเดียวกัน แรงระหว่างสายไฟทั้งสองจะเป็น 'แรงดึงดูดเข้าหากัน'",
          "ข้อ (ก) ขนาดแรงต่อหน่วยความยาว: F/L = (μ₀ I₁ I₂) / (2π d)",
          "แทนค่า: F/L = (4π × 10⁻⁷ × 400 × 400) / (2π × 0.30) = (2 × 10⁻⁷ × 160,000) / 0.30",
          "F/L = 0.032 / 0.30 ≈ 0.1067 N/m ≈ 0.107 N/m",
          "ข้อ (ข) แรงรวมบนสายไฟยาว L = 50 m: F = (F/L) * L = (0.1067 N/m) * 50 m = 5.333 N ≈ 5.33 N",
          "ตอบ: (ก) แรงดึงดูดขนาด 0.107 นิวตันต่อเมตร, (ข) แรงรวมบนความยาว 50 เมตรเท่ากับ 5.33 นิวตัน"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"50\" y1=\"45\" x2=\"350\" y2=\"45\" stroke=\"#38bdf8\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"45\" r=\"4\" fill=\"#38bdf8\"/><text x=\"60\" y=\"35\" fill=\"#38bdf8\" font-size=\"11\">I₁ →</text><line x1=\"50\" y1=\"85\" x2=\"350\" y2=\"85\" stroke=\"#38bdf8\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"85\" r=\"4\" fill=\"#38bdf8\"/><text x=\"60\" y=\"105\" fill=\"#38bdf8\" font-size=\"11\">I₂ →</text><line x1=\"200\" y1=\"45\" x2=\"200\" y2=\"60\" stroke=\"#ef4444\" stroke-width=\"2\" marker-end=\"url(#arrow-red)\"/><line x1=\"200\" y1=\"85\" x2=\"200\" y2=\"70\" stroke=\"#ef4444\" stroke-width=\"2\" marker-end=\"url(#arrow-red)\"/><text x=\"210\" y=\"68\" fill=\"#ef4444\" font-size=\"10\" font-weight=\"bold\">แรงดึงดูด</text><line x1=\"330\" y1=\"45\" x2=\"330\" y2=\"85\" stroke=\"#94a3b8\" stroke-width=\"1.5\"/><text x=\"340\" y=\"68\" fill=\"#94a3b8\" font-size=\"10\">d</text></svg>",
        "diagramCaption": "ลวดตัวนำขนานสองเส้นมีกระแสทิศเดียวกันส่งแรงดึงดูดเข้าหากัน"
      },
      "observations": [
        "จำง่าย: ประจุเหมือนกันผลักกัน แต่กระแสเหมือนกัน (ทิศเดียวกัน) ดึงดูดกัน!",
        "ในการลัดวงจรขนาดใหญ่ กระแสระดับกิโลแอมแปร์สามารถสร้างแรงมหาศาลจนฉีกบัสบาร์ทองแดงขาดกระเด็นได้"
      ]
    },
    {
      "id": "ch06-th24",
      "divisionId": "div-ch06-induction-ac-maxwell",
      "divisionTitle": "ภาคที่ 4: การเหนี่ยวนำแม่เหล็กไฟฟ้า วงจรไฟฟ้ากระแสสลับ และสมการแมกซ์เวลล์",
      "numberTh": "ทฤษฎีที่ 24",
      "type": "law",
      "titleTh": "ฟลักซ์แม่เหล็กและกฎการเหนี่ยวนำของฟาราเดย์",
      "titleEn": "Magnetic Flux & Faraday's Law of Induction",
      "summary": "ฟลักซ์แม่เหล็ก Φ_B = ∫ B · dA แรงเคลื่อนไฟฟ้าเหนี่ยวนำ E = -N dΦ_B/dt และการแปลงพลังงานกลเป็นพลังงานไฟฟ้า",
      "definition": {
        "text": "กฎการเหนี่ยวนำของฟาราเดย์ (Faraday's Law of Induction, ไมเคิล ฟาราเดย์, 1831) เป็นหนึ่งในกฎพื้นฐานที่สำคัญที่สุดของแม่เหล็กไฟฟ้า ระบุว่า เมื่อใดก็ตามที่ฟลักซ์แม่เหล็ก (Magnetic Flux, Φ_B) ที่พุ่งทะลุผ่านวงจรปิดมีค่าเปลี่ยนแปลงไปตามเวลา จะเกิดแรงเคลื่อนไฟฟ้าเหนี่ยวนำ (Induced EMF, E) ขึ้นในวงจรนั้น โดยขนาดของแรงเคลื่อนไฟฟ้าแปรผันตรงกับอัตราการเปลี่ยนแปลงของฟลักซ์แม่เหล็กเทียบกับเวลา: E = -N dΦ_B/dt"
      },
      "principle": {
        "text": "หลักการสำคัญของฟาราเดย์:\n1. ฟลักซ์แม่เหล็ก: $\\Phi_B = \\int \\mathbf{B} \\cdot d\\mathbf{A} = B A \\cos\\theta$ (หน่วยเวเบอร์, $\\text{Wb} = \\text{T}\\cdot\\text{m}^2$)\n2. กฎของฟาราเดย์: $\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$\n3. วิธีการสร้างแรงเคลื่อนไฟฟ้าเหนี่ยวนำ 3 รูปแบบ:\n   - เปลี่ยนขนาดสนามแม่เหล็ก $B(t)$ (เช่น การเคลื่อนแท่งแม่เหล็กเข้า-ออกจากขดลวด หรือหม้อแปลงไฟฟ้า)\n   - เปลี่ยนพื้นที่ของขดลวด $A(t)$ (เช่น การดึงขยายหรือหดลวดในสนามแม่เหล็ก)\n   - เปลี่ยนมุมเอียง $\\theta(t) = \\omega t$ ระหว่างระนาบขดลวดกับสนาม (หลักการของเครื่องกำเนิดไฟฟ้ากระแสสลับ AC Generator $\\mathcal{E}(t) = N B A \\omega \\sin(\\omega t)$)"
      },
      "formulas": [
        {
          "name": "กฎการเหนี่ยวนำของฟาราเดย์ (Faraday's Induction Law)",
          "latex": "\\mathcal{E} = -N \\frac{d\\Phi_B}{dt} = -N \\frac{d}{dt} \\int_S \\mathbf{B} \\cdot d\\mathbf{A}",
          "symbols": [
            {
              "sym": "\\mathcal{E}",
              "desc": "แรงเคลื่อนไฟฟ้าเหนี่ยวนำ",
              "unit": "\\text{V}"
            },
            {
              "sym": "N",
              "desc": "จำนวนรอบของขดลวด",
              "unit": "\\text{รอบ}"
            },
            {
              "sym": "\\Phi_B",
              "desc": "ฟลักซ์แม่เหล็กที่ผ่านหนึ่งรอบ",
              "unit": "\\text{Wb}"
            },
            {
              "sym": "t",
              "desc": "เวลา",
              "unit": "\\text{s}"
            }
          ],
          "derivationSteps": [
            "ไมเคิล ฟาราเดย์ ค้นพบว่า สนามแม่เหล็กที่อยู่นิ่งไม่สามารถสร้างกระแสไฟฟ้าได้ แต่สนามแม่เหล็กที่กำลังเปลี่ยนแปลงค่าจะสร้างกระแสไฟฟ้าได้",
            "นิยามฟลักซ์แม่เหล็กผ่านระนาบ Φ_B = B · A = B A cos θ",
            "จากผลการทดลอง: แรงเคลื่อนไฟฟ้า E แปรผันตรงกับจำนวนรอบ N และอัตราอนุพันธ์เทียบเวลา dΦ_B/dt",
            "ใส่เครื่องหมายลบตามกฎของเลนซ์ (Lenz's Law) เพื่อแสดงการต้านการเปลี่ยนแปลงฟลักซ์เดิม",
            "ในรูปสนามไฟฟ้าเชิงอนุพันธ์: ∮ E · dl = -d/dt ∫ B · dA หรือในรูปอนุพันธ์ย่อย ∇ × E = -∂B/∂t"
          ]
        }
      ],
      "application": {
        "text": "เครื่องกำเนิดไฟฟ้าพลังน้ำและพลังไอน้ำ (Electric Generator/Alternator), หม้อแปลงไฟฟ้า (Power Transformer), เตาแม่เหล็กไฟฟ้าอินดักชัน (Induction Cooker), และหัวอ่านฮาร์ดดิสก์แบบแม่เหล็ก",
        "validWhen": "กรอบอ้างอิงเฉื่อยและขดลวดปิดเชื่อมโยงกับฟลักซ์แม่เหล็ก",
        "invalidWhen": "วงจรเปิดที่ไม่มีประจุเคลื่อนที่ครบวงจร (ยังคงมี EMF เหนี่ยวนำที่ขั้วเปิด แต่กระแสเหนี่ยวนำเป็นศูนย์)"
      },
      "example": {
        "problem": "ขดลวดวงกลมแบนมีรัศมี r = 5.0 cm จำนวนรอบ N = 200 รอบ วางตัวตั้งฉากกับสนามแม่เหล็กสม่ำเสมอ B ถ้าสนามแม่เหล็กลดลงจาก 0.60 T สู่ 0.10 T ภายในเวลา Δt = 0.20 วินาที อย่างสม่ำเสมอ จงหาขนาดของแรงเคลื่อนไฟฟ้าเหนี่ยวนำ E ในขดลวด",
        "steps": [
          "หาพื้นที่ของขดลวด: A = π r² = π (0.050 m)² = 2.5 × 10⁻³ π m² ≈ 7.854 × 10⁻³ m²",
          "เนื่องจากขดลวดวางตั้งฉากกับสนาม เวกเตอร์พื้นที่ขนานกับ B (θ = 0°, cos θ = 1)",
          "การเปลี่ยนแปลงสนามแม่เหล็ก: ΔB = B_f - B_i = 0.10 T - 0.60 T = -0.50 T",
          "การเปลี่ยนแปลงฟลักซ์แม่เหล็ก: ΔΦ_B = ΔB * A = (-0.50 T)(7.854 × 10⁻³ m²) = -3.927 × 10⁻³ Wb",
          "อัตราการเปลี่ยนแปลงฟลักซ์: ΔΦ_B / Δt = (-3.927 × 10⁻³ Wb) / (0.20 s) = -0.019635 Wb/s",
          "คำนวณแรงเคลื่อนไฟฟ้าเหนี่ยวนำ: E = -N (ΔΦ_B / Δt) = -200 × (-0.019635 V) = +3.927 V ≈ 3.93 V",
          "ตอบ: แรงเคลื่อนไฟฟ้าเหนี่ยวนำมีขนาดประมาณ 3.93 โวลต์"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><circle cx=\"200\" cy=\"65\" r=\"45\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"3\"/><text x=\"200\" y=\"45\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\">N = 200 รอบ</text><line x1=\"200\" y1=\"20\" x2=\"200\" y2=\"110\" stroke=\"#38bdf8\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><text x=\"175\" y=\"65\" fill=\"#38bdf8\" font-size=\"12\">⊗ B(t)</text><path d=\"M 235 45 A 40 40 0 0 1 245 80\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2.5\" marker-end=\"url(#arrow-green)\"/><text x=\"260\" y=\"68\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\">I_ind</text></svg>",
        "diagramCaption": "ฟลักซ์แม่เหล็กพุ่งเข้าลดลง เหนี่ยวนำให้เกิดกระแสไหลวนตามเข็มนาฬิกาเพื่อสร้างสนามเสริม"
      },
      "observations": [
        "เครื่องหมายลบเป็นไปตามกฎของเลนซ์ หากไม่มีเครื่องหมายลบ จะขัดกับกฎการอนุรักษ์พลังงานอย่างร้ายแรง (สร้างพลังงานฟรีไม่สิ้นสุด)",
        "แม้สนามแม่เหล็กจะมีขนาดคงที่ แต่หากหมุนขดลวดด้วยความเร็วเชิงมุมคงที่ ก็จะเกิดแรงเคลื่อนไฟฟ้าเหนี่ยวนำรูปไซน์ได้"
      ]
    },
    {
      "id": "ch06-th25",
      "divisionId": "div-ch06-induction-ac-maxwell",
      "divisionTitle": "ภาคที่ 4: การเหนี่ยวนำแม่เหล็กไฟฟ้า วงจรไฟฟ้ากระแสสลับ และสมการแมกซ์เวลล์",
      "numberTh": "ทฤษฎีที่ 25",
      "type": "law",
      "titleTh": "กฎของเลนซ์ แรงเคลื่อนไฟฟ้าจากการเคลื่อนที่ และกระแสวน",
      "titleEn": "Lenz's Law, Motional EMF & Eddy Currents",
      "summary": "กฎของเลนซ์ต้านการเปลี่ยนแปลงฟลักซ์เดิม แรงเคลื่อนไฟฟ้าจากการเคลื่อนที่ E = BLv และการเบรกแม่เหล็กไฟฟ้าด้วยกระแสวน Eddy Currents",
      "definition": {
        "text": "กฎของเลนซ์ (Lenz's Law, ไฮน์ริช เลนซ์, 1834) ระบุว่า กระแสไฟฟ้าเหนี่ยวนำจะมีทิศทางการไหลที่สร้างสนามแม่เหล็กเหนี่ยวนำขึ้นมา 'ต่อต้านการเปลี่ยนแปลงของฟลักซ์แม่เหล็กเดิม' ที่ทำให้เกิดมันขึ้นมาเสมอ กฎนี้เป็นผลโดยตรงจากกฎการอนุรักษ์พลังงาน สำหรับแท่งตัวนำยาว L เคลื่อนที่ด้วยความเร็ว v ตัดสนามแม่เหล็ก B จะเกิดแรงเคลื่อนไฟฟ้าจากการเคลื่อนที่ (Motional EMF) ขนาด E = B L v และในแผ่นโลหะตันจะเกิดกระแสวนวงกลม (Eddy Currents) ที่ทำให้เกิดแรงต้านการเคลื่อนที่ (Magnetic Braking)"
      },
      "principle": {
        "text": "การวิเคราะห์กฎของเลนซ์และแรงเคลื่อนไฟฟ้าจากการเคลื่อนที่:\n1. กฎของเลนซ์กับการอนุรักษ์พลังงาน: ถ้าฟลักซ์เพิ่มขึ้น กระแสเหนี่ยวนำจะสร้างสนามต้าน; ถ้าฟลักซ์ลดลง กระแสเหนี่ยวนำจะสร้างสนามเสริม\n2. แรงเคลื่อนไฟฟ้าจากการเคลื่อนที่ของแท่งตัวนำบนรางขนาน: $\\mathcal{E} = B L v$\n3. กำลังกลเทียบกับกำลังไฟฟ้า: แรงต้านแม่เหล็กบนแท่งตัวนำคือ $F_{\\text{mag}} = I L B = \\frac{B L v}{R} L B = \\frac{B^2 L^2 v}{R}$ กำลังกลที่ต้องใช้ดึงแท่งตัวนำคือ $P_{\\text{mech}} = F_{\\text{mag}} v = \\frac{B^2 L^2 v^2}{R}$ ซึ่งเท่ากับกำลังไฟฟ้าที่สูญเสียในตัวต้านทาน $P_{\\text{elec}} = I^2 R$ พอดี 100%\n4. กระแสวน (Eddy Currents): กระแสไหลวนอิสระในเนื้อโลหะตันหนา สร้างความร้อนและการเบรกแม่เหล็กอย่างนุ่มนวลโดยไร้การสัมผัสเสียดสี"
      },
      "formulas": [
        {
          "name": "แรงเคลื่อนไฟฟ้าจากการเคลื่อนที่และกำลังกล (Motional EMF & Power)",
          "latex": "\\mathcal{E} = B L v, \\quad I = \\frac{B L v}{R}, \\quad F_{\\text{ext}} = \\frac{B^2 L^2 v}{R}, \\quad P = \\frac{B^2 L^2 v^2}{R}",
          "symbols": [
            {
              "sym": "\\mathcal{E}",
              "desc": "แรงเคลื่อนไฟฟ้าเหนี่ยวนำข้ามแท่งตัวนำ",
              "unit": "\\text{V}"
            },
            {
              "sym": "B",
              "desc": "สนามแม่เหล็กตั้งฉาก",
              "unit": "\\text{T}"
            },
            {
              "sym": "L",
              "desc": "ความยาวของแท่งตัวนำที่พาดราง",
              "unit": "\\text{m}"
            },
            {
              "sym": "v",
              "desc": "ความเร็วในการเคลื่อนที่ของแท่งลวด",
              "unit": "\\text{m/s}"
            },
            {
              "sym": "R",
              "desc": "ความต้านทานรวมของวงจร",
              "unit": "\\Omega"
            }
          ],
          "derivationSteps": [
            "พิจารณาแท่งตัวนำยาว L เคลื่อนที่ด้วยความเร็ว v ไปทางขวาบนรางคู่ขนาน ในสนามแม่เหล็ก B พุ่งเข้ากระดาษ",
            "อิเล็กตรอนในแท่งได้รับแรงแม่เหล็ก F_B = -e (v × B) ผลักไปปลายด้านล่าง ทำให้ปลายบนเป็นขั้วบวกและปลายล่างเป็นขั้วลบ",
            "เกิดสนามไฟฟ้า E ภายในแท่งจนถึงสมดุลแรง: e E = e v B ⇒ E = v B",
            "ผลต่างศักย์ข้ามแท่งคือ E = ∫ E dl = E * L = B L v",
            "กระแสไหลในวงจร: I = E / R = (B L v) / R",
            "แท่งตัวนำมีกระแสไหลจึงได้รับแรงแม่เหล็กต้าน: F_B = I L B = (B² L² v) / R ชี้ไปทางซ้าย (ต้านการดึงตามกฎเลนซ์)"
          ]
        }
      ],
      "application": {
        "text": "ระบบเบรกแม่เหล็กไฟฟ้าของรถไฟความเร็วสูงชินคันเซ็น (Eddy Current Brake ไม่มีการสึกหรอของผ้าเบรก), รถไฟเหาะตีลังกา, เครื่องคัดแยกขยะอะลูมิเนียมอัตโนมัติ, และมิเตอร์ไฟฟ้าจานหมุน",
        "validWhen": "แท่งตัวนำเคลื่อนที่บนรางระนาบที่มีสนามแม่เหล็กตั้งฉาก",
        "invalidWhen": "สนามแม่เหล็กขนานกับความเร็ว v (v × B = 0 จะไม่มีแรงแม่เหล็กและไม่มี EMF เหนี่ยวนำ)"
      },
      "example": {
        "problem": "แท่งตัวนำยาว L = 0.50 m เคลื่อนที่ด้วยความเร็วคงที่ v = 4.0 m/s บนรางตัวนำแนวนอนไร้ความเสียดทานที่มีความต้านทาน R = 2.0 Ω ในสนามแม่เหล็กสม่ำเสมอ B = 0.80 T พุ่งลงในแนวดิ่ง จงหา: (ก) แรงเคลื่อนไฟฟ้าเหนี่ยวนำ E (ข) กระแสไฟฟ้าในวงจร (ค) แรงภายนอก F_ext ที่ต้องใช้ดึงแท่งลวดเพื่อให้รักษาความเร็วคงที่ (ง) กำลังกลที่ใส่เข้าไปเทียบกับกำลังความร้อนที่เกิดขึ้นใน R",
        "steps": [
          "ข้อ (ก) แรงเคลื่อนไฟฟ้าเหนี่ยวนำ: E = B L v = (0.80 T)(0.50 m)(4.0 m/s) = 1.60 V",
          "ข้อ (ข) กระแสไฟฟ้าในวงจร: I = E / R = 1.60 V / 2.0 Ω = 0.80 A",
          "ข้อ (ค) แรงแม่เหล็กต้าน: F_B = I L B = (0.80 A)(0.50 m)(0.80 T) = 0.32 N ในทิศตรงข้ามกับความเร็ว",
          "เพื่อให้แท่งลวดเคลื่อนที่ด้วยความเร็วคงที่ แรงดึงภายนอกต้องสมดุลกับแรงแม่เหล็กต้าน: F_ext = F_B = 0.32 N",
          "ข้อ (ง) คำนวณกำลังกลภายนอก: P_mech = F_ext * v = (0.32 N)(4.0 m/s) = 1.28 W",
          "คำนวณกำลังความร้อนในตัวต้านทาน: P_elec = I² R = (0.80 A)² × 2.0 Ω = 0.64 × 2.0 = 1.28 W",
          "ตอบ: กำลังกลที่ใส่เข้าไป 1.28 วัตต์ เปลี่ยนรูปเป็นพลังงานความร้อนในตัวต้านทาน 1.28 วัตต์ พอดีทุกประการ (อนุรักษ์พลังงานสมบูรณ์แบบ)"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"60\" y1=\"35\" x2=\"340\" y2=\"35\" stroke=\"#94a3b8\" stroke-width=\"2\"/><line x1=\"60\" y1=\"95\" x2=\"340\" y2=\"95\" stroke=\"#94a3b8\" stroke-width=\"2\"/><rect x=\"50\" y=\"45\" width=\"20\" height=\"40\" fill=\"#334155\" stroke=\"#f59e0b\" stroke-width=\"2\"/><text x=\"60\" y=\"70\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\">R</text><line x1=\"220\" y1=\"25\" x2=\"220\" y2=\"105\" stroke=\"#38bdf8\" stroke-width=\"6\"/><line x1=\"220\" y1=\"65\" x2=\"280\" y2=\"65\" stroke=\"#10b981\" stroke-width=\"2.5\" marker-end=\"url(#arrow-green)\"/><text x=\"285\" y=\"60\" fill=\"#10b981\" font-size=\"11\">v →</text><line x1=\"220\" y1=\"65\" x2=\"170\" y2=\"65\" stroke=\"#ef4444\" stroke-width=\"2\" marker-end=\"url(#arrow-red)\"/><text x=\"160\" y=\"60\" fill=\"#ef4444\" font-size=\"10\">F_mag (←)</text></svg>",
        "diagramCaption": "แท่งตัวนำเคลื่อนที่บนรางตัดสนามแม่เหล็ก เกิดแรงต้านทางกลตามกฎของเลนซ์"
      },
      "observations": [
        "กระแสวนในหม้อแปลงไฟฟ้าทำให้เกิดการสูญเสียพลังงานในรูปความร้อน วิศวกรจึงต้องแก้ไขโดยใช้ 'แผ่นเหล็กซิลิคอนเคลือบฉนวนซ้อนทับกันเป็นชั้นๆ' (Laminated core)",
        "แต่ในระบบเบรกของรถไฟ กระแสวนเป็นประโยชน์อย่างยิ่งเพราะไม่มีการเสียดสีและไม่สึกหรอ"
      ]
    },
    {
      "id": "ch06-th26",
      "divisionId": "div-ch06-induction-ac-maxwell",
      "divisionTitle": "ภาคที่ 4: การเหนี่ยวนำแม่เหล็กไฟฟ้า วงจรไฟฟ้ากระแสสลับ และสมการแมกซ์เวลล์",
      "numberTh": "ทฤษฎีที่ 26",
      "type": "concept",
      "titleTh": "ความเหนี่ยวนำตนเอง ขดลวดเหนี่ยวนำ และพลังงานในสนามแม่เหล็ก",
      "titleEn": "Self-Inductance, RL Circuits & Magnetic Energy Density",
      "summary": "นิยามความเหนี่ยวนำ L = NΦ_B/I แรงเคลื่อนไฟฟ้าต้านกลับ E_L = -L dI/dt พลังงาน U_B = (1/2)LI² และความหนาแน่นพลังงาน u_B = B²/(2μ₀)",
      "definition": {
        "text": "เมื่อกระแสไฟฟ้า I ในขดลวดเปลี่ยนแปลง ฟลักซ์แม่เหล็กที่ผ่านขดลวดของตัวเองย่อมเปลี่ยนแปลงไปด้วย ทำให้เกิดแรงเคลื่อนไฟฟ้าเหนี่ยวนำตนเอง (Self-Induced EMF, E_L) ขึ้นในขดลวดเดิมเพื่อต่อต้านการเปลี่ยนแปลงของกระแสตามกฎของเลนซ์: E_L = -L dI/dt โดยค่าคงตัว L เรียกว่า ความเหนี่ยวนำตนเอง (Self-Inductance) มีหน่วยเป็นเฮนรี (Henry, H) และขดลวดจะเก็บกักพลังงานไว้ในสนามแม่เหล็กด้วยปริมาณ U_B = (1/2) L I²"
      },
      "principle": {
        "text": "หลักการสำคัญของความเหนี่ยวนำ:\n1. นิยามความเหนี่ยวนำตนเอง: $L = \\frac{N \\Phi_B}{I}$\n2. สำหรับโซเลนอยด์ยาว L พื้นที่ A จำนวนรอบ N: $L = \\mu_0 n^2 A l = \\frac{\\mu_0 N^2 A}{l}$\n3. แรงเคลื่อนไฟฟ้าต้านกลับ (Back EMF): $\\mathcal{E}_L = -L \\frac{dI}{dt}$\n4. พลังงานสะสมในสนามแม่เหล็ก: $U_B = \\frac{1}{2} L I^2$\n5. ความหนาแน่นพลังงานของสนามแม่เหล็ก: $u_B = \\frac{B^2}{2\\mu_0}$ (เทียบกับสนามไฟฟ้า $u_E = \\frac{1}{2}\\varepsilon_0 E^2$)\n6. วงจร RL ทรานเชียนต์: มีค่าคงตัวเวลา $\\tau_L = \\frac{L}{R}$ โดยกระแสเพิ่มขึ้นตาม $I(t) = \\frac{\\mathcal{E}}{R}(1 - e^{-t/\\tau_L})$"
      },
      "formulas": [
        {
          "name": "ความเหนี่ยวนำ พลังงานแม่เหล็ก และความหนาแน่นพลังงาน (Inductance & Magnetic Energy)",
          "latex": "L = \\frac{N \\Phi_B}{I}, \\quad \\mathcal{E}_L = -L \\frac{dI}{dt}, \\quad U_B = \\frac{1}{2} L I^2, \\quad u_B = \\frac{B^2}{2\\mu_0}",
          "symbols": [
            {
              "sym": "L",
              "desc": "ความเหนี่ยวนำตนเองของขดลวด",
              "unit": "\\text{H}"
            },
            {
              "sym": "\\mathcal{E}_L",
              "desc": "แรงเคลื่อนไฟฟ้าเหนี่ยวนำต้านกลับ",
              "unit": "\\text{V}"
            },
            {
              "sym": "U_B",
              "desc": "พลังงานศักย์สะสมในสนามแม่เหล็ก",
              "unit": "\\text{J}"
            },
            {
              "sym": "u_B",
              "desc": "ความหนาแน่นพลังงานต่อหน่วยปริมาตร",
              "unit": "\\text{J/m}^3"
            }
          ],
          "derivationSteps": [
            "กำลังงานที่แหล่งจ่ายต้องทำเพื่อป้อนกระแสฝ่าแรงต้านกลับ: P = dW/dt = -E_L * I = I * (L dI/dt)",
            "งานทั้งหมดในการเพิ่มกระแสจาก 0 ถึง I: W = ∫ P dt = ∫₀^I L I' dI' = (1/2) L I²",
            "พลังงานนี้ถูกเก็บสะสมอยู่ในรูปสนามแม่เหล็ก: U_B = (1/2) L I²",
            "แทนค่าสำหรับโซเลนอยด์ L = μ₀ n² A l และ B = μ₀ n I ⇒ I = B / (μ₀ n)",
            "U_B = (1/2) (μ₀ n² A l) [B / (μ₀ n)]² = (1/2) (B² / μ₀) (A l)",
            "หารด้วยปริมาตรแกนโซเลนอยด์ V = A l: จะได้ความหนาแน่นพลังงาน u_B = B² / (2μ₀)"
          ]
        }
      ],
      "application": {
        "text": "ขดลวดโช้ก (Choke Coil) ป้องกันกระแสกระชากในพาวเวอร์ซัพพลาย, หัวเทียนรถยนต์ (Induction Ignition Coil จุดระเบิดด้วยไฟแรงสูง 20-30 kV), และบัลลาสต์อิเล็กทรอนิกส์",
        "validWhen": "แกนขดลวดไม่มีความอิ่มตัวของสารแม่เหล็ก (Magnetic saturation)",
        "invalidWhen": "สนามแม่เหล็กสูงจนแกนเฟอร์ไรต์อิ่มตัว (L จะตกลงฮวบฮาบจนเกิดกระแสเกินพิกัด)"
      },
      "example": {
        "problem": "โซเลนอยด์แกนอากาศยาว l = 40 cm มีพื้นที่หน้าตัด A = 10 cm² มีจำนวนรอบ N = 800 รอบ มีกระแสไหลผ่าน I = 3.0 A จงหา: (ก) ความเหนี่ยวนำตนเอง L (ข) พลังงานที่สะสมในสนามแม่เหล็ก U_B (ค) ถ้าตัดวงจรให้กระแสลดลงเหลือศูนย์ในเวลา Δt = 5.0 ms จะเกิดแรงเคลื่อนไฟฟ้าต้านกลับเฉลี่ยเท่าใด",
        "steps": [
          "แปลงหน่วย: l = 0.40 m, A = 10 × 10⁻⁴ m² = 1.0 × 10⁻³ m², N = 800, μ₀ = 4π × 10⁻⁷ T·m/A",
          "ข้อ (ก) ความเหนี่ยวนำตนเอง: L = (μ₀ N² A) / l",
          "แทนค่า: L = (4π × 10⁻⁷ × 800² × 1.0 × 10⁻³) / 0.40",
          "800² = 640,000",
          "L = (4π × 10⁻⁷ × 6.4 × 10⁵ × 1.0 × 10⁻³) / 0.40 = (2.56π × 10⁻³ × 10⁻¹) / 0.40",
          "L = (8.0425 × 10⁻⁴) / 0.40 ≈ 2.01 × 10⁻³ H = 2.01 mH",
          "ข้อ (ข) พลังงานสะสมในสนามแม่เหล็ก: U_B = (1/2) L I²",
          "U_B = (1/2) (2.01 × 10⁻³ H)(3.0 A)² = (1.005 × 10⁻³)(9.0) = 9.045 × 10⁻³ J ≈ 9.05 mJ",
          "ข้อ (ค) แรงเคลื่อนไฟฟ้าเหนี่ยวนำตนเองเฉลี่ย: E_L = -L (ΔI / Δt)",
          "ΔI = 0 - 3.0 = -3.0 A, Δt = 5.0 × 10⁻³ s",
          "E_L = -(2.01 × 10⁻³ H) * [(-3.0 A) / (5.0 × 10⁻³ s)] = +(2.01)(3.0 / 5.0) = +1.206 V ≈ 1.21 V",
          "ตอบ: (ก) L = 2.01 mH, (ข) พลังงานสะสม 9.05 mJ, (ค) แรงเคลื่อนไฟฟ้าต้านกลับ 1.21 โวลต์"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><path d=\"M 80 65 Q 95 30 110 65 Q 125 100 140 65 Q 155 30 170 65 Q 185 100 200 65 Q 215 30 230 65 Q 245 100 260 65 Q 275 30 290 65 Q 305 100 320 65\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"3\"/><text x=\"200\" y=\"25\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\">ขดลวดเหนี่ยวนำ L</text><line x1=\"120\" y1=\"65\" x2=\"280\" y2=\"65\" stroke=\"#38bdf8\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><text x=\"200\" y=\"115\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">U_B = ½ L I²</text></svg>",
        "diagramCaption": "ขดลวดเหนี่ยวนำกักเก็บพลังงานไว้ในสนามแม่เหล็กภายในแกน"
      },
      "observations": [
        "กระแสในขดลวดเหนี่ยวนำไม่สามารถเปลี่ยนแปลงแบบก้าวกระโดดในทันทีทันใดได้ (Instantaneous jump requires infinite voltage)",
        "เมื่อตัดสวิตช์วงจรที่มีตัวเหนี่ยวนำอย่างรวดเร็ว จะเกิดแรงดันต้านกลับสูงมากจนเกิดการสปาร์ก (Arcing) ที่หน้าสัมผัสสวิตช์"
      ]
    },
    {
      "id": "ch06-th27",
      "divisionId": "div-ch06-induction-ac-maxwell",
      "divisionTitle": "ภาคที่ 4: การเหนี่ยวนำแม่เหล็กไฟฟ้า วงจรไฟฟ้ากระแสสลับ และสมการแมกซ์เวลล์",
      "numberTh": "ทฤษฎีที่ 27",
      "type": "law",
      "titleTh": "วงจรกระแสสลับ RLC เรโซแนนซ์ เฟสเซอร์ และสมการของแมกซ์เวลล์",
      "titleEn": "AC Series RLC Circuits, Resonance, Phasors & Maxwell's Equations",
      "summary": "วงจรอนุกรม RLC อิมพีแดนซ์เชิงซ้อน Z = √(R² + (X_L - X_C)²) มุมเฟส φ เรโซแนนซ์ f₀ = 1/(2π√(LC)) และบทสรุปสมการแมกซ์เวลล์ 4 ข้อ",
      "definition": {
        "text": "วงจรไฟฟ้ากระแสสลับ RLC แบบอนุกรม (AC Series RLC Circuit) ต่อเข้ากับแหล่งจ่ายแรงดันสลับ v(t) = V₀ cos(ωt) ความต้านทานรวมในวงจรเรียกว่า อิมพีแดนซ์ (Impedance, Z) ซึ่งรวมผลของความต้านทาน R, รีแอกแตนซ์เหนี่ยวนำ X_L = ωL, และรีแอกแตนซ์ความจุ X_C = 1/(ωC) มุมเฟสระหว่างแรงดันกับกระแสคือ tan φ = (X_L - X_C)/R เมื่อ X_L = X_C วงจรจะเกิด ปรากฏการณ์เรโซแนนซ์ (Resonance) ทำให้กระแสไฟฟ้ามีค่าสูงสุด และเนื้อหาทั้งบทนี้ถูกสรุปอย่างสมบูรณ์แบบด้วย สมการของแมกซ์เวลล์ 4 ข้อ (Maxwell's Equations) ซึ่งทำนายการมีอยู่ของคลื่นแม่เหล็กไฟฟ้าและแสง"
      },
      "principle": {
        "text": "หลักการสำคัญของวงจร RLC และสมการแมกซ์เวลล์:\n1. รีแอกแตนซ์: $X_L = \\omega L$ (แรงดันนำหน้ากระแส $90^\\circ$), $X_C = \\frac{1}{\\omega C}$ (กระแสนำหน้าแรงดัน $90^\\circ$)\n2. อิมพีแดนซ์เชิงซ้อน: $Z = \\sqrt{R^2 + (X_L - X_C)^2}$\n3. ความถี่เรโซแนนซ์ (Resonance Frequency): $\\omega_0 = \\frac{1}{\\sqrt{LC}} \\Rightarrow f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$ (ที่เรโซแนนซ์ $Z = R$ ต่ำสุด, กระแส $I_{\\text{rms}}$ สูงสุด)\n4. ตัวประกอบคุณภาพ (Quality Factor): $Q = \\frac{\\omega_0 L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}$\n5. สรุปสมการแมกซ์เวลล์ 4 ข้อ:\n   - กฎของเกาส์สำหรับไฟฟ้า: $\\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}$\n   - กฎของเกาส์สำหรับแม่เหล็ก: $\\oint \\mathbf{B} \\cdot d\\mathbf{A} = 0$ (ไม่มีขั้วเดี่ยวแม่เหล็ก)\n   - กฎการเหนี่ยวนำของฟาราเดย์: $\\oint \\mathbf{E} \\cdot d\\mathbf{l} = -\\frac{d\\Phi_B}{dt}$\n   - กฎของแอมแปร์-แมกซ์เวลล์: $\\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{\\text{enc}} + \\mu_0 \\varepsilon_0 \\frac{d\\Phi_E}{dt}$\n6. ความเร็วแสงในสุญญากาศ: $c = \\frac{1}{\\sqrt{\\varepsilon_0 \\mu_0}} \\approx 2.998 \\times 10^8 \\text{ m/s}$"
      },
      "formulas": [
        {
          "name": "อิมพีแดนซ์ RLC และความถี่เรโซแนนซ์ (RLC Impedance & Resonance)",
          "latex": "Z = \\sqrt{R^2 + \\left(\\omega L - \\frac{1}{\\omega C}\\right)^2}, \\quad \\tan\\phi = \\frac{X_L - X_C}{R}, \\quad f_0 = \\frac{1}{2\\pi\\sqrt{LC}}",
          "symbols": [
            {
              "sym": "Z",
              "desc": "อิมพีแดนซ์ปรากฏของวงจร",
              "unit": "\\Omega"
            },
            {
              "sym": "X_L, X_C",
              "desc": "รีแอกแตนซ์เหนี่ยวนำและความจุ",
              "unit": "\\Omega"
            },
            {
              "sym": "\\phi",
              "desc": "มุมเฟสระหว่างแรงดันรวมกับกระแส",
              "unit": "\\text{rad หรือ } ^\\circ"
            },
            {
              "sym": "f_0",
              "desc": "ความถี่ธรรมชาติของการสั่นพ้อง",
              "unit": "\\text{Hz}"
            }
          ],
          "derivationSteps": [
            "เขียนสมการตามกฎลูปเคอร์ชอฟฟ์: v(t) = v_R(t) + v_L(t) + v_C(t)",
            "แทน v_R = i R, v_L = L (di/dt), v_C = (1/C) ∫ i dt",
            "ใช้การวิเคราะห์เวกเตอร์เฟสเซอร์ (Phasors): V_R อยู่ในเฟสเดียวกับ I, V_L นำหน้า 90°, V_C ล้าหลัง 90°",
            "ผลรวมเวกเตอร์แรงดัน: V² = V_R² + (V_L - V_C)² = (I R)² + [I (X_L - X_C)]²",
            "ดึง I ออกมา: V = I √[R² + (X_L - X_C)²] = I Z",
            "ที่เรโซแนนซ์ X_L = X_C ⇒ ω₀ L = 1 / (ω₀ C) ⇒ ω₀² = 1 / (LC) ⇒ f₀ = 1 / (2π√LC)"
          ]
        },
        {
          "name": "สมการของแมกซ์เวลล์ 4 ข้อรวมสมบูรณ์ (Maxwell's Unified Equations)",
          "latex": "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}, \\quad \\nabla \\cdot \\mathbf{B} = 0, \\quad \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}, \\quad \\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}",
          "symbols": [
            {
              "sym": "\\nabla \\cdot \\mathbf{E}",
              "desc": "ไดเวอร์เจนซ์สนามไฟฟ้า (ประจุเป็นแหล่งกำเนิด)",
              "unit": "\\text{V/m}^2"
            },
            {
              "sym": "\\nabla \\cdot \\mathbf{B}",
              "desc": "ไม่มีขั้วแม่เหล็กเดี่ยว (เส้นสนามเป็นวงปิดเสมอ)",
              "unit": "\\text{T/m}"
            },
            {
              "sym": "\\nabla \\times \\mathbf{E}",
              "desc": "สนามแม่เหล็กเปลี่ยนแปรรูปสร้างสนามไฟฟ้าวน",
              "unit": "\\text{V/m}^2"
            },
            {
              "sym": "\\nabla \\times \\mathbf{B}",
              "desc": "กระแสนำและสนามไฟฟ้าเปลี่ยนแปรรูปสร้างสนามแม่เหล็ก",
              "unit": "\\text{T/m}"
            }
          ],
          "derivationSteps": [
            "เจมส์ เคลิร์ก แมกซ์เวลล์ สังเกตเห็นความไม่สมบูรณ์ของกฎแอมแปร์เดิม ∇ × B = μ₀ J ซึ่งขัดกับสมการความต่อเนื่องของประจุ ∇ · J + ∂ρ/∂t = 0",
            "แมกซ์เวลล์เพิ่มพจน์กระแสกระจัด (Displacement current) J_D = ε₀ ∂E/∂t เข้าไปในกฎแอมแปร์",
            "เมื่อนำเคิร์ลของเคิร์ล (∇ × (∇ × E)) ในสุญญากาศ จะได้สมการคลื่น ∇² E = μ₀ ε₀ ∂²E/∂t²",
            "ความเร็วคลื่นคือ 1 / √(μ₀ ε₀) ซึ่งมีค่าเท่ากับความเร็วแสง 3 × 10⁸ m/s พอดี นำไปสู่การค้นพบว่า 'แสงคือคลื่นแม่เหล็กไฟฟ้าชนิดหนึ่ง'"
          ]
        }
      ],
      "application": {
        "text": "เครื่องรับวิทยุ AM/FM (การหมุนจูนคลื่นคือการปรับค่า C เพื่อให้ f₀ ตรงกับสถานี), เครื่องรับส่งสัญญาณ Wi-Fi และ 5G, และการสื่อสารโทรคมนาคมผ่านคลื่นแม่เหล็กไฟฟ้า",
        "validWhen": "อุปกรณ์ในวงจรมีพฤติกรรมเชิงเส้น (Linear R, L, C) และทำงานในย่านความถี่คลาสสิก",
        "invalidWhen": "ระดับพลังงานโฟตอนเดี่ยวในย่านรังสีแกมมาหรือเอ็กซ์เรย์ (ต้องใช้ Quantum Electrodynamics - QED)"
      },
      "example": {
        "problem": "วงจรอนุกรม RLC ประกอบด้วยตัวต้านทาน R = 40 Ω, ตัวเหนี่ยวนำ L = 0.20 H และตัวเก็บประจุ C = 5.0 μF ต่อเข้ากับแหล่งจ่ายกระแสสลับ V_rms = 120 V จงหา: (ก) ความถี่เรโซแนนซ์ f₀ (ข) อิมพีแดนซ์ Z และกระแส I_rms ที่ความถี่เรโซแนนซ์ (ค) ค่าตัวประกอบคุณภาพ Q ของวงจร",
        "steps": [
          "แปลงหน่วย: R = 40 Ω, L = 0.20 H, C = 5.0 × 10⁻⁶ F",
          "ข้อ (ก) ความถี่เรโซแนนซ์: f₀ = 1 / [2π √(L C)]",
          "คำนวณ LC: LC = (0.20)(5.0 × 10⁻⁶) = 1.0 × 10⁻⁶ s²",
          "√(LC) = √(1.0 × 10⁻⁶) = 1.0 × 10⁻³ s",
          "f₀ = 1 / [2π (1.0 × 10⁻³)] = 1000 / (2π) ≈ 159.15 Hz ≈ 159 Hz",
          "ข้อ (ข) ที่ความถี่เรโซแนนซ์: X_L = X_C ดังนั้น อิมพีแดนซ์มีค่าต่ำสุดเท่ากับความต้านทานโอห์มิก: Z = R = 40 Ω",
          "กระแสยังผลสูงสุดที่เรโซแนนซ์: I_rms = V_rms / Z = 120 V / 40 Ω = 3.0 A",
          "ข้อ (ค) ตัวประกอบคุณภาพ Q: Q = (ω₀ L) / R",
          "ω₀ = 2π f₀ = 1 / √(LC) = 1 / 10⁻³ = 1000 rad/s",
          "Q = (1000 rad/s × 0.20 H) / 40 Ω = 200 / 40 = 5.0",
          "ตอบ: (ก) ความถี่เรโซแนนซ์ 159 Hz, (ข) อิมพีแดนซ์ 40 Ω และกระแส 3.0 A, (ค) ค่าตัวประกอบคุณภาพ Q = 5.0"
        ],
        "diagramSvg": "<svg viewBox=\"0 0 400 130\" class=\"w-full h-32 bg-slate-900 rounded\"><line x1=\"50\" y1=\"100\" x2=\"350\" y2=\"100\" stroke=\"#475569\" stroke-width=\"1.5\"/><line x1=\"50\" y1=\"100\" x2=\"50\" y2=\"20\" stroke=\"#475569\" stroke-width=\"1.5\"/><path d=\"M 50 95 Q 180 90 200 30 Q 220 90 350 95\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2.5\"/><circle cx=\"200\" cy=\"30\" r=\"4\" fill=\"#ef4444\"/><text x=\"200\" y=\"20\" fill=\"#ef4444\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">I_max (Resonance f₀)</text><text x=\"200\" y=\"115\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\">f₀ = 1/(2π√LC)</text></svg>",
        "diagramCaption": "กราฟเรโซแนนซ์ของวงจร RLC แสดงกระแสพุ่งแตะจุดสูงสุดที่ความถี่สั่นพ้อง f₀"
      },
      "observations": [
        "ที่จุดเรโซแนนซ์ แรงดันตกคร่อมตัวเหนี่ยวนำ V_L และตัวเก็บประจุ V_C สามารถสูงกว่าแรงดันแหล่งจ่ายได้หลายเท่า (V_L = Q * V_source) หาก Q สูงมาก",
        "สมการแมกซ์เวลล์รวมปรากฏการณ์ไฟฟ้าและแม่เหล็กเข้าด้วยกันเป็นทฤษฎีเดียวกัน เรียกว่า 'ทฤษฎีแม่เหล็กไฟฟ้าดั้งเดิม' (Classical Electromagnetism)"
      ]
    }
  ]
};
}));
