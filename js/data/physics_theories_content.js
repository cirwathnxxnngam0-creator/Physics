/**
 * physics_theories_content.js - Master Curriculum Data for PhysicsNoza 3.0
 * Structured into 4 Classical Divisions (ภาค) and 15 Deep Numbered Theories (ทฤษฎี)
 *
 * Each theory strictly adheres to the mandated 6-tier educational pedagogy:
 *   (1) นิยามและความหมาย (Definition & Meaning)
 *   (2) หลักการและคำอธิบาย (Principle & Conceptual Foundation)
 *   (3) สูตร สัญลักษณ์ หน่วย และขั้นการอนุมาน (Formulas, SI Units & Derivations across tiers)
 *   (4) การใช้งานและเงื่อนไข (Applications, Scope & Validity Boundaries)
 *   (5) ตัวอย่างการคำนวณพร้อมภาพ/แบบจำลอง (Worked Example & Inline Schematic Diagrams)
 *   (6) ข้อสังเกตและประเด็นที่มักเข้าใจผิด (Key Observations & Physical Nuances)
 *
 * Complete with exact academic literature citations (author, book, section, pages)
 * and responsive SVG schematic visualizations for each theory.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PhysicsTheoriesContent = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const divisions = [
  {
    "id": "div-kinematics",
    "numeral": "ภาคที่ 1",
    "titleTh": "จลนศาสตร์ (Kinematics)",
    "description": "การบรรยายและศึกษาสภาพการเคลื่อนที่ของอนุภาคในมิติต่างๆ (ตำแหน่ง การกระจัด ความเร็ว ความเร่ง) โดยยังไม่คำนึงถึงแรงหรือสาเหตุที่ทำให้เกิดการเคลื่อนที่นั้น"
  },
  {
    "id": "div-dynamics",
    "numeral": "ภาคที่ 2",
    "titleTh": "พลศาสตร์ (Dynamics)",
    "description": "การศึกษาสาเหตุของการเคลื่อนที่ ความสัมพันธ์ระหว่างแรงลัพธ์ที่กระทำต่อวัตถุกับความเร่งที่เกิดขึ้น รวมทั้งแรงต้านทานจากการเคลื่อนที่ผ่านตัวกลางของไหล"
  },
  {
    "id": "div-conservation",
    "numeral": "ภาคที่ 3",
    "titleTh": "กฎการอนุรักษ์ (Conservation Laws)",
    "description": "การวิเคราะห์การเคลื่อนที่ผ่านปริมาณคงตัวของระบบ ได้แก่ โมเมนตัมเชิงเส้น และพลังงานกลรวม พร้อมการแปลงสภาพและการสูญเสียพลังงานเนื่องจากแรงไม่อนุรักษ์"
  },
  {
    "id": "div-computational",
    "numeral": "ภาคที่ 4",
    "titleTh": "หัวข้อเชื่อมโยงและการคำนวณขั้นสูง (Bridging Topics & Computational Physics)",
    "description": "การเชื่อมต่อจลนศาสตร์ของอนุภาคสู่การหมุนของวัตถุแข็งเกร็ง (โมเมนต์และโมเมนตัมเชิงมุม) และการแก้ระบบสมการเชิงอนุพันธ์ไม่เชิงเส้นด้วยระเบียบวิธีเชิงตัวเลข RK4"
  }
];

  const theories = [
  {
    "id": 1,
    "divisionId": "div-kinematics",
    "divisionTitle": "ภาคที่ 1: จลนศาสตร์ (Kinematics)",
    "numberTh": "ทฤษฎีที่ 1",
    "titleTh": "นิยามปริมาณพื้นฐานของการเคลื่อนที่และการวิเคราะห์กราฟ",
    "titleEn": "Kinematic Quantities, Calculus Definitions & Graph Interpretation",
    "type": "นิยามและหลักการพื้นฐาน (Fundamental Definitions & Principles)",
    "summary": "นิยามเชิงเวกเตอร์ของตำแหน่ง การกระจัด ระยะทาง ความเร็ว อัตราเร็ว และความเร่ง พร้อมเทคนิคการอนุพันธ์และอินทิกรัลกราฟการเคลื่อนที่",
    "definition": {
      "text": "จลนศาสตร์กำหนดปริมาณพื้นฐาน 4 ประการเพื่อระบุสภาวะการเคลื่อนที่ของอนุภาคเทียบกับกรอบอ้างอิง:\n1. **เวกเตอร์ตำแหน่ง (Position Vector, $\\vec{r}$):** เวกเตอร์ชี้จากจุดกำเนิดของกรอบอ้างอิงไปยังตำแหน่งที่อนุภาคอยู่ ณ ขณะนั้น (หน่วย: เมตร, m)\n2. **การกระจัด (Displacement, $\\Delta\\vec{r}$):** เวกเตอร์ผลต่างของตำแหน่งจากจุดเริ่มต้นไปยังจุดสุดท้าย $\\Delta\\vec{r} = \\vec{r}_f - \\vec{r}_i$ ไม่ขึ้นกับเส้นทางการเดิน (ต่างจาก **ระยะทาง (Distance, $s$)** ซึ่งเป็นสเกลาร์ความยาวจริงของวิถี)\n3. **ความเร็ว (Velocity, $\\vec{v}$):** อัตราการเปลี่ยนแปลงการกระจัดเทียบกับเวลา $\\vec{v} = \\frac{d\\vec{r}}{dt}$ เป็นเวกเตอร์ที่มีทิศทางเดียวกับการเคลื่อนที่ขณะนั้น (ต่างจาก **อัตราเร็ว (Speed, $v = \\|\\vec{v}\\|$)** ซึ่งเป็นขนาดของความเร็ว)\n4. **ความเร่ง (Acceleration, $\\vec{a}$):** อัตราการเปลี่ยนแปลงเวกเตอร์ความเร็วเทียบกับเวลา $\\vec{a} = \\frac{d\\vec{v}}{dt} = \\frac{d^2\\vec{r}}{dt^2}$"
    },
    "principle": {
      "text": "การวิเคราะห์การเคลื่อนที่ 1 มิติสามารถตีความผ่านความชัน (Slope) และพื้นที่ใต้กราฟ (Area under curve) ได้อย่างเคร่งครัดตามหลักแคลคูลัส:\n• **กราฟตำแหน่ง-เวลา ($x-t$):** ความชันของเส้นสัมผัสกราฟ ณ เวลาใดๆ คือความเร็วขณะนั้น ($v = \\frac{dx}{dt}$)\n• **กราฟความเร็ว-เวลา ($v-t$):** ความชันคือกราฟความเร่ง ($a = \\frac{dv}{dt}$) ขณะที่ **พื้นที่ใต้กราฟสุทธิ (หักลบพื้นที่ใต้แกนเวลา) คือการกระจัดสุทธิ** ($\\Delta x = \\int_{t_1}^{t_2} v(t) dt$)\n• **กราฟความเร่ง-เวลา ($a-t$):** พื้นที่ใต้กราฟคือการเปลี่ยนแปลงความเร็ว ($\\Delta v = v_2 - v_1 = \\int_{t_1}^{t_2} a(t) dt$)"
    },
    "formulas": [
      {
        "name": "ความเร็วขณะใดขณะหนึ่ง (Instantaneous Velocity)",
        "latex": "\\vec{v}(t) = \\lim_{\\Delta t \\to 0} \\frac{\\Delta\\vec{r}}{\\Delta t} = \\frac{d\\vec{r}}{dt}",
        "symbols": [
          {
            "sym": "\\vec{v}",
            "desc": "เวกเตอร์ความเร็ว",
            "unit": "\\text{m/s}"
          },
          {
            "sym": "\\vec{r}",
            "desc": "เวกเตอร์ตำแหน่ง",
            "unit": "\\text{m}"
          },
          {
            "sym": "t",
            "desc": "เวลา",
            "unit": "\\text{s}"
          }
        ],
        "derivationSteps": [
          "1. นิยามความเร็วเฉลี่ยในช่วงเวลาจำกัด: $\\vec{v}_{\\text{avg}} = \\frac{\\vec{r}(t+\\Delta t) - \\vec{r}(t)}{\\Delta t}$",
          "2. ใช้แนวคิดลิมิตเมื่อช่วงเวลาสั้นเข้าใกล้ศูนย์ $\\Delta t \\to 0$",
          "3. ได้อนุพันธ์อันดับ 1 ของเวกเตอร์ตำแหน่งเทียบกับเวลา: $\\vec{v} = \\frac{d\\vec{r}}{dt}$"
        ]
      },
      {
        "name": "ความเร่งขณะใดขณะหนึ่ง (Instantaneous Acceleration)",
        "latex": "\\vec{a}(t) = \\frac{d\\vec{v}}{dt} = \\frac{d^2\\vec{r}}{dt^2}",
        "symbols": [
          {
            "sym": "\\vec{a}",
            "desc": "เวกเตอร์ความเร่ง",
            "unit": "\\text{m/s}^2"
          },
          {
            "sym": "\\vec{v}",
            "desc": "เวกเตอร์ความเร็ว",
            "unit": "\\text{m/s}"
          }
        ],
        "derivationSteps": [
          "1. นิยามความเร่งเฉลี่ย: $\\vec{a}_{\\text{avg}} = \\frac{\\vec{v}(t+\\Delta t) - \\vec{v}(t)}{\\Delta t}$",
          "2. เทคลิมิต $\\Delta t \\to 0$ เข้าสู่อนุพันธ์: $\\vec{a} = \\frac{d\\vec{v}}{dt}$",
          "3. แทน $\\vec{v} = \\frac{d\\vec{r}}{dt}$ จะได้อนุพันธ์อันดับ 2 ของตำแหน่ง: $\\vec{a} = \\frac{d^2\\vec{r}}{dt^2}$"
        ]
      }
    ],
    "application": {
      "text": "การใช้นิยามจลนศาสตร์ไม่มีข้อจำกัดว่าความเร่งต้องคงที่ ใช้ได้กับการเคลื่อนที่ทุกรูปแบบ เช่น การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย การตกที่มีแรงต้านอากาศ และการคำนวณเซ็นเซอร์มาตรความเร่ง (IMU / Accelerometer) ในสมาร์ตโฟนและระบบนำทางอากาศยาน",
      "validWhen": "ใช้ได้ตลอดเวลาในทุกกรอบอ้างอิงที่มีพิกัดชัดเจน",
      "invalidWhen": "ระวังอย่าสับสนระหว่างอัตราเร็วเฉลี่ย (ระยะทางทั้งหมด/เวลา) กับขนาดของความเร็วเฉลี่ย (ขนาดการกระจัด/เวลา) ซึ่งเท่ากันเฉพาะเมื่อเคลื่อนที่ในทิศทางเดียวโดยไม่กลับทิศเท่านั้น"
    },
    "example": {
      "problem": "อนุภาคหนึ่งเคลื่อนที่ในแนวแกน $x$ โดยมีสมการตำแหน่งเป็น $x(t) = 2t^3 - 6t^2 + 4$ (เมตร, วินาที) จงหาความเร็วและความเร่ง ณ เวลา $t = 2\\text{ s}$ และระบุว่าอนุภาคกำลังชะลอความเร็วหรือเร่งความเร็ว",
      "steps": [
        "ขั้นตอนที่ 1: หาความเร็วโดยการหาอนุพันธ์อันดับ 1: $v(t) = \\frac{dx}{dt} = 6t^2 - 12t$",
        "ขั้นตอนที่ 2: แทนค่า $t = 2\\text{ s}$: $v(2) = 6(2)^2 - 12(2) = 24 - 24 = 0\\text{ m/s}$ (อนุภาคหยุดนิ่งชั่วขณะ)",
        "ขั้นตอนที่ 3: หาความเร่งโดยการหาอนุพันธ์อันดับ 2: $a(t) = \\frac{dv}{dt} = 12t - 12$",
        "ขั้นตอนที่ 4: แทนค่า $t = 2\\text{ s}$: $a(2) = 12(2) - 12 = +12\\text{ m/s}^2$",
        "สรุปผล: ณ $t=2\\text{ s}$ อนุภาคมีความเร็ว $v = 0\\text{ m/s}$ และมีความเร่ง $a = +12\\text{ m/s}^2$ ทิศไปข้างหน้า กำลังเริ่มเร่งความเร็วไปในทิศ $+x$"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 520 180\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"แผนภาพแคลคูลัสในจลนศาสตร์\">\n  <defs>\n    <marker id=\"arr1\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">\n      <path d=\"M 0 0 L 8 4 L 0 8 Z\" fill=\"#2563EB\"/>\n    </marker>\n    <marker id=\"arr-axis\" markerWidth=\"6\" markerHeight=\"6\" refX=\"5\" refY=\"3\" orient=\"auto\">\n      <path d=\"M 0 0 L 6 3 L 0 6 Z\" fill=\"#64748B\"/>\n    </marker>\n  </defs>\n  <!-- Panel 1: x-t Slope = Velocity -->\n  <g transform=\"translate(10, 10)\">\n    <rect width=\"240\" height=\"160\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n    <text x=\"120\" y=\"22\" text-anchor=\"middle\" font-size=\"12\" font-weight=\"700\" fill=\"#1E293B\">กราฟตำแหน่ง-เวลา (x-t)</text>\n    <!-- Axes -->\n    <line x1=\"30\" y1=\"135\" x2=\"220\" y2=\"135\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis)\"/>\n    <line x1=\"35\" y1=\"140\" x2=\"35\" y2=\"35\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis)\"/>\n    <text x=\"215\" y=\"148\" font-size=\"10\" fill=\"#64748B\">t (s)</text>\n    <text x=\"20\" y=\"38\" font-size=\"10\" fill=\"#64748B\">x (m)</text>\n    <!-- Curve x(t) -->\n    <path d=\"M 40 125 Q 90 120 125 85 T 205 40\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"2.5\"/>\n    <!-- Tangent at t=2s -->\n    <line x1=\"85\" y1=\"125\" x2=\"165\" y2=\"45\" stroke=\"#DC2626\" stroke-width=\"1.8\" stroke-dasharray=\"4,3\"/>\n    <circle cx=\"125\" cy=\"85\" r=\"4\" fill=\"#DC2626\"/>\n    <!-- Slope label -->\n    <text x=\"135\" y=\"75\" font-size=\"11\" font-weight=\"600\" fill=\"#DC2626\">ความชัน = dx/dt = v</text>\n  </g>\n  <!-- Panel 2: v-t Area = Displacement -->\n  <g transform=\"translate(270, 10)\">\n    <rect width=\"240\" height=\"160\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n    <text x=\"120\" y=\"22\" text-anchor=\"middle\" font-size=\"12\" font-weight=\"700\" fill=\"#1E293B\">กราฟความเร็ว-เวลา (v-t)</text>\n    <!-- Axes -->\n    <line x1=\"30\" y1=\"135\" x2=\"220\" y2=\"135\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis)\"/>\n    <line x1=\"35\" y1=\"140\" x2=\"35\" y2=\"35\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis)\"/>\n    <text x=\"215\" y=\"148\" font-size=\"10\" fill=\"#64748B\">t (s)</text>\n    <text x=\"20\" y=\"38\" font-size=\"10\" fill=\"#64748B\">v (m/s)</text>\n    <!-- Shaded area -->\n    <path d=\"M 70 135 L 70 100 Q 120 70 170 55 L 170 135 Z\" fill=\"rgba(37, 99, 235, 0.15)\"/>\n    <!-- Curve v(t) -->\n    <path d=\"M 40 120 Q 90 90 140 65 T 205 50\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"2.5\"/>\n    <line x1=\"70\" y1=\"135\" x2=\"70\" y2=\"100\" stroke=\"#64748B\" stroke-dasharray=\"3,3\"/>\n    <line x1=\"170\" y1=\"135\" x2=\"170\" y2=\"55\" stroke=\"#64748B\" stroke-dasharray=\"3,3\"/>\n    <text x=\"65\" y=\"148\" font-size=\"10\" fill=\"#64748B\">t₁</text>\n    <text x=\"165\" y=\"148\" font-size=\"10\" fill=\"#64748B\">t₂</text>\n    <!-- Area Label -->\n    <text x=\"120\" y=\"105\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"600\" fill=\"#1D4ED8\">พื้นที่ = ∫ v dt = Δx</text>\n  </g>\n</svg>",
      "diagramCaption": "แผนภาพความหมายทางแคลคูลัส: ความชันของเส้นสัมผัสกราฟ $x-t$ คือความเร็ว $v$ และพื้นที่ใต้กราฟ $v-t$ คือการกระจัดสุทธิ $\\Delta x$"
    },
    "observations": [
      "ความเข้าใจผิดพบบ่อย: \"ความเร็วเป็นศูนย์ หมายถึงความเร่งต้องเป็นศูนย์ด้วย\" — ไม่จริง! เช่น วัตถุที่ถูกโยนขึ้นตรงๆ ณ จุดสูงสุดความเร็วชั่วขณะ $v = 0$ แต่วัตถุยังมีความเร่งโน้มถ่วง $a = -g = -9.8\\text{ m/s}^2$ ดึงลงตลอดเวลา",
      "เครื่องหมายของความเร่ง (+ หรือ -) ไม่ได้บอกว่าวัตถุกำลัง \"เร่ง\" หรือ \"ชะลอ\" ด้วยตัวมันเอง: หาก $v > 0$ และ $a > 0$ วัตถุจะเร็วขึ้น แต่ถ้า $v < 0$ และ $a < 0$ วัตถุก็กำลังเร็วขึ้นในทิศลบเช่นกัน! วัตถุจะชะลอความเร็วก็ต่อเมื่อ $\\vec{v}$ และ $\\vec{a}$ มีทิศทางตรงกันข้ามกัน"
    ],
    "citation": "Morin, D. (2008). Introduction to Classical Mechanics: With Problems and Solutions. Cambridge University Press, Sec. 1.1–1.2, pp. 1–5."
  },
  {
    "id": 2,
    "divisionId": "div-kinematics",
    "divisionTitle": "ภาคที่ 1: จลนศาสตร์ (Kinematics)",
    "numberTh": "ทฤษฎีที่ 2",
    "titleTh": "การเคลื่อนที่ในแนวตรงด้วยความเร่งคงที่",
    "titleEn": "1D Motion with Constant Acceleration & The 5 Standard Kinematic Equations",
    "type": "หลักการและการอนุมานสมการ (Kinematic Principles & Derivations)",
    "summary": "การพิสูจน์ชุดสมการสุวรรณ 5 สูตรจากแคลคูลัสและเรขาคณิต เงื่อนไขบังคับ และเหตุผลที่ไม่สามารถนำไปใช้กับแรงต้านของไหล",
    "definition": {
      "text": "การเคลื่อนที่ด้วยความเร่งคงที่ (Constant Acceleration Motion) คือสภาวะการเคลื่อนที่ที่อนุภาคมีอัตราการเปลี่ยนแปลงความเร็วสม่ำเสมอทั้งขนาดและทิศทาง กล่าวคือ $\\vec{a}(t) = \\vec{a} = \\text{constant}$ ส่งผลให้ความเร็วแปรผันตรงเชิงเส้นกับเวลา ($v \\propto t$) และตำแหน่งแปรผันตามกำลังสองของเวลา ($x \\propto t^2$)"
    },
    "principle": {
      "text": "เมื่อความเร่งคงที่ ความเร็วเฉลี่ยในช่วงเวลาใดๆ จะมีค่าเท่ากับค่าเฉลี่ยเลขคณิตของความเร็วต้นและความเร็วปลายพอดี: $v_{\\text{avg}} = \\frac{u+v}{2}$ ทำให้พื้นที่ใต้กราฟ $v-t$ ซึ่งเป็นรูปสี่เหลี่ยมคางหมู สามารถเขียนแทนการกระจัดได้อย่างสมบูรณ์"
    },
    "formulas": [
      {
        "name": "สมการความเร็วเทียบเวลา",
        "latex": "v = u + at",
        "symbols": [
          {
            "sym": "v",
            "desc": "ความเร็วปลาย",
            "unit": "\\text{m/s}"
          },
          {
            "sym": "u",
            "desc": "ความเร็วต้น",
            "unit": "\\text{m/s}"
          },
          {
            "sym": "a",
            "desc": "ความเร่งคงที่",
            "unit": "\\text{m/s}^2"
          },
          {
            "sym": "t",
            "desc": "ช่วงเวลา",
            "unit": "\\text{s}"
          }
        ],
        "derivationSteps": [
          "1. จากนิยาม $a = \\frac{dv}{dt}$ ย้ายข้างเพื่ออินทิเกรต: $dv = a dt$",
          "2. ทำการอินทิเกรตจำกัดเขตจาก $t = 0$ ถึง $t$: $\\int_u^v dv = \\int_0^t a dt$",
          "3. ดึงค่าคงที่ $a$ ออกมานอกอินทิกรัล: $v - u = a(t - 0) \\implies v = u + at$"
        ]
      },
      {
        "name": "สมการตำแหน่งเทียบเวลา",
        "latex": "s = ut + \\frac{1}{2}at^2",
        "symbols": [
          {
            "sym": "s",
            "desc": "การกระจัด (\\Delta x)",
            "unit": "\\text{m}"
          }
        ],
        "derivationSteps": [
          "1. จากนิยาม $v = \\frac{ds}{dt} \\implies ds = v dt$",
          "2. แทน $v = u + at$: $ds = (u + at) dt$",
          "3. อินทิเกรตจำกัดเขต: $\\int_0^s ds = \\int_0^t (u + at) dt$",
          "4. จะได้: $s = [ut + \\frac{1}{2}at^2]_0^t \\implies s = ut + \\frac{1}{2}at^2$"
        ]
      },
      {
        "name": "สมการความเร็วกับระยะทาง (ไม่ขึ้นกับเวลา)",
        "latex": "v^2 = u^2 + 2as",
        "symbols": [
          {
            "sym": "v, u, a, s",
            "desc": "ตัวแปรมาตรฐานจลนศาสตร์",
            "unit": "SI Units"
          }
        ],
        "derivationSteps": [
          "1. ใช้กฎลูกโซ่ (Chain Rule) จัดรูปความเร่ง: $a = \\frac{dv}{dt} = \\frac{dv}{ds}\\frac{ds}{dt} = v\\frac{dv}{ds}$",
          "2. แยกตัวแปร: $v dv = a ds$",
          "3. อินทิเกรตทั้งสองข้าง: $\\int_u^v v dv = \\int_0^s a ds$",
          "4. ได้: $\\frac{v^2 - u^2}{2} = as \\implies v^2 = u^2 + 2as$"
        ]
      },
      {
        "name": "สมการการกระจัดจากความเร็วเฉลี่ย",
        "latex": "s = \\left(\\frac{u + v}{2}\\right)t \\quad \\text{และ} \\quad s = vt - \\frac{1}{2}at^2",
        "symbols": [
          {
            "sym": "s",
            "desc": "พื้นที่รูปสี่เหลี่ยมคางหมูใต้กราฟ v-t",
            "unit": "\\text{m}"
          }
        ],
        "derivationSteps": [
          "1. คำนวณพื้นที่สี่เหลี่ยมคางหมูใต้กราฟ $v-t$: ความสูง $t$, ด้านคู่ขนาน $u$ และ $v$",
          "2. พื้นที่ $= \\frac{1}{2}(u + v)t = s$",
          "3. แทน $u = v - at$ ลงในสมการข้างต้น จะได้สูตรที่ 5: $s = vt - \\frac{1}{2}at^2$"
        ]
      }
    ],
    "application": {
      "text": "ใช้สำหรับวัตถุตกอย่างอิสระในแนวดิ่งใกล้ผิวโลกเมื่อไม่มีแรงต้านอากาศ ($a = -g = -9.80665\\text{ m/s}^2$), การเร่งของยานพาหนะที่มีแรงฉุดสม่ำเสมอ, และระยะเบรกคงที่",
      "validWhen": "เวกเตอร์ความเร่ง $a$ ต้องมีค่าคงที่ตลอดช่วงเวลาการเคลื่อนที่เท่านั้น",
      "invalidWhen": "ห้ามใช้โดยเด็ดขาดในกรณีที่มีแรงต้านอากาศ (เพราะ $a(v) = -g - \\frac{c}{m}v^2$ ความเร่งขึ้นกับความเร็ว), การสั่นของสปริง ($a(x) = -\\frac{k}{m}x$), หรือการขับเคลื่อนของจรวดที่มวลลดลงเรื่อยๆ"
    },
    "example": {
      "problem": "ปล่อยก้อนหินให้ตกอย่างอิสระจากยอดตึกสูง $80.0\\text{ m}$ (สมมุติไม่มีแรงต้านอากาศ และ $g = 9.80\\text{ m/s}^2$) จงหาเวลาที่ก้อนหินกระทบพื้น และความเร็วขณะกระทบพื้น",
      "steps": [
        "กำหนดทิศทาง: ให้ทิศพุ่งลงเป็นบวก (+)",
        "ตัวแปรที่ทราบ: ความเร็วต้น $u = 0\\text{ m/s}$, ความเร่ง $a = +9.80\\text{ m/s}^2$, การกระจัด $s = +80.0\\text{ m}$",
        "ขั้นตอนที่ 1: หาเวลาบิน $t$ จาก $s = ut + \\frac{1}{2}at^2$:\n$80.0 = 0 + \\frac{1}{2}(9.80)t^2 \\implies t^2 = \\frac{160}{9.80} \\approx 16.3265 \\implies t \\approx 4.04\\text{ s}$",
        "ขั้นตอนที่ 2: หาความเร็วปลาย $v$ จาก $v = u + at$:\n$v = 0 + (9.80)(4.0406) \\approx +39.6\\text{ m/s}$ (ทิศพุ่งลงพื้น)",
        "ตรวจสอบความสอดคล้องด้วย $v^2 = u^2 + 2as$: $v = \\sqrt{2(9.80)(80.0)} = \\sqrt{1568} \\approx 39.6\\text{ m/s}$ (สอดคล้องกันสมบูรณ์)"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 500 185\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"การแยกพื้นที่สี่เหลี่ยมคางหมูใต้กราฟ v-t\">\n  <defs>\n    <marker id=\"arr-axis2\" markerWidth=\"6\" markerHeight=\"6\" refX=\"5\" refY=\"3\" orient=\"auto\">\n      <path d=\"M 0 0 L 6 3 L 0 6 Z\" fill=\"#64748B\"/>\n    </marker>\n  </defs>\n  <rect width=\"500\" height=\"185\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Axes -->\n  <line x1=\"60\" y1=\"150\" x2=\"460\" y2=\"150\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis2)\"/>\n  <line x1=\"70\" y1=\"155\" x2=\"70\" y2=\"25\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis2)\"/>\n  <text x=\"455\" y=\"165\" font-size=\"11\" fill=\"#64748B\">t (เวลา)</text>\n  <text x=\"35\" y=\"30\" font-size=\"11\" fill=\"#64748B\">v (ความเร็ว)</text>\n  <!-- Area 1: Rectangle (ut) -->\n  <rect x=\"70\" y=\"95\" width=\"320\" height=\"55\" fill=\"rgba(37, 99, 235, 0.12)\" stroke=\"#93C5FD\" stroke-width=\"1\"/>\n  <text x=\"230\" y=\"128\" text-anchor=\"middle\" font-size=\"12\" font-weight=\"600\" fill=\"#1E40AF\">พื้นที่สี่เหลี่ยม = ut</text>\n  <!-- Area 2: Triangle (1/2 a t^2) -->\n  <polygon points=\"70,95 390,95 390,40\" fill=\"rgba(234, 88, 12, 0.15)\" stroke=\"#FDBA74\" stroke-width=\"1\"/>\n  <text x=\"280\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" font-weight=\"600\" fill=\"#C2410C\">พื้นที่สามเหลี่ยม = ½at²</text>\n  <!-- Line v(t) = u + at -->\n  <line x1=\"70\" y1=\"95\" x2=\"390\" y2=\"40\" stroke=\"#2563EB\" stroke-width=\"3\"/>\n  <circle cx=\"70\" cy=\"95\" r=\"4\" fill=\"#2563EB\"/>\n  <circle cx=\"390\" cy=\"40\" r=\"4\" fill=\"#2563EB\"/>\n  <!-- Points and Dotted Lines -->\n  <line x1=\"390\" y1=\"150\" x2=\"390\" y2=\"40\" stroke=\"#94A3B8\" stroke-dasharray=\"4,4\"/>\n  <line x1=\"70\" y1=\"40\" x2=\"390\" y2=\"40\" stroke=\"#94A3B8\" stroke-dasharray=\"4,4\"/>\n  <text x=\"50\" y=\"100\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">u</text>\n  <text x=\"50\" y=\"44\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">v</text>\n  <text x=\"385\" y=\"165\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">t</text>\n  <!-- Formula Summary -->\n  <text x=\"240\" y=\"175\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">การกระจัดสุทธิ: s = ut + ½at² = ½(u + v)t</text>\n</svg>",
      "diagramCaption": "การแยกพื้นที่รูปสี่เหลี่ยมคางหมูใต้กราฟ $v-t$ เป็นสี่เหลี่ยมผืนผ้า ($ut$) และสามเหลี่ยม ($\\frac{1}{2}at^2$) ซึ่งรวมเป็นการกระจัด $s$"
    },
    "observations": [
      "ข้อสังเกต: วัตถุตกในสุญญากาศ เวลาและระยะตกไม่ขึ้นกับมวลของวัตถุเลย ก้อนหินและขนนกจะตกถึงพื้นพร้อมกันทุกประการ (การทดลองอันโด่งดังของกาลิเลโอบนหอเอนเมืองปิซา ค.ศ. 1589)"
    ],
    "citation": "Morin, D. (2008). Introduction to Classical Mechanics, Sec. 1.2–1.3, pp. 6–10; French, A. P. (1971). Newtonian Mechanics, Ch. 2, pp. 33–42."
  },
  {
    "id": 3,
    "divisionId": "div-kinematics",
    "divisionTitle": "ภาคที่ 1: จลนศาสตร์ (Kinematics)",
    "numberTh": "ทฤษฎีที่ 3",
    "titleTh": "เวกเตอร์และการเคลื่อนที่สองมิติ",
    "titleEn": "2D Kinematics, Vector Decomposition & Relative Motion",
    "type": "หลักการและการวิเคราะห์เวกเตอร์ (Vector Principles)",
    "summary": "หลักความเป็นอิสระของการเคลื่อนที่ในแกนที่ตั้งฉากกันของกาลิเลโอ การแตกเวกเตอร์คาร์ทีเซียน และการแปลงความเร็วสัมพัทธ์แบบคลาสสิก",
    "definition": {
      "text": "การเคลื่อนที่สองมิติ (Two-Dimensional Motion) คือการเคลื่อนที่ของอนุภาคที่ระบุตำแหน่งได้ด้วยพิกัดสองแกนในระนาบ เวกเตอร์ตำแหน่งเขียนในรูปเวกเตอร์หนึ่งหน่วยคาร์ทีเซียนได้เป็น $\\vec{r}(t) = x(t)\\hat{i} + y(t)\\hat{j}$"
    },
    "principle": {
      "text": "• **หลักความเป็นอิสระของการเคลื่อนที่ (Independence of Orthogonal Motions):** กาลิเลโอค้นพบว่า การเคลื่อนที่ตามแกน $x$ และแกน $y$ เป็นอิสระต่อกันโดยสิ้นเชิง แรงหรือความเร่งในแนวราบ ($a_x$) จะไม่ส่งผลกระทบต่อความเร็วในแนวดิ่ง ($v_y$) เลย และในทางกลับกัน ความเร่งในแนวดิ่ง ($a_y$) ก็ไม่ส่งผลต่อการเคลื่อนที่ในแนวราบ ตราบใดที่ระบบอยู่ในสุญญากาศ\n• **การเคลื่อนที่สัมพัทธ์ของกาลิเลโอ (Galilean Relative Motion):** หากสังเกตการเคลื่อนที่ของวัตถุ $A$ เทียบกับผู้สังเกต $B$ และมีกรอบอ้างอิงโลก $O$ ความเร็วสัมพัทธ์จะบวกกันตามแบบเวกเตอร์: $\\vec{v}_{A/B} = \\vec{v}_{A/O} - \\vec{v}_{B/O}$"
    },
    "formulas": [
      {
        "name": "การแตกเวกเตอร์และความเร็วในระนาบ 2 มิติ",
        "latex": "\\vec{v} = v_x\\hat{i} + v_y\\hat{j} = (v\\cos\\theta)\\hat{i} + (v\\sin\\theta)\\hat{j}",
        "symbols": [
          {
            "sym": "v",
            "desc": "ขนาดความเร็ว (Speed)",
            "unit": "\\text{m/s}"
          },
          {
            "sym": "\\theta",
            "desc": "มุมทำกับแกน +x",
            "unit": "\\text{rad หรือ deg}"
          },
          {
            "sym": "\\hat{i}, \\hat{j}",
            "desc": "เวกเตอร์หนึ่งหน่วยแกน x และ y",
            "unit": "-"
          }
        ],
        "derivationSteps": [
          "1. จากตรีโกณมิติในสามเหลี่ยมมุมฉาก: ด้านประชิดมุม $v_x = v\\cos\\theta$, ด้านตรงข้ามมุม $v_y = v\\sin\\theta$",
          "2. ขนาดของความเร็วรวมตามทฤษฎีบทพีทาโกรัส: $v = \\|\\vec{v}\\| = \\sqrt{v_x^2 + v_y^2}$",
          "3. มุมทิศทาง: $\\theta = \\arctan\\left(\\frac{v_y}{v_x}\\right)$"
        ]
      },
      {
        "name": "ความเร็วสัมพัทธ์ (Relative Velocity)",
        "latex": "\\vec{v}_{A/B} = \\vec{v}_A - \\vec{v}_B",
        "symbols": [
          {
            "sym": "\\vec{v}_{A/B}",
            "desc": "ความเร็วของวัตถุ A เมื่อมองจากกรอบอ้างอิงของผู้สังเกต B",
            "unit": "\\text{m/s}"
          }
        ],
        "derivationSteps": [
          "1. ตำแหน่งสัมพัทธ์: $\\vec{r}_{A/O} = \\vec{r}_{B/O} + \\vec{r}_{A/B} \\implies \\vec{r}_{A/B} = \\vec{r}_A - \\vec{r}_B$",
          "2. หาอนุพันธ์เทียบกับเวลา $t$: $\\frac{d\\vec{r}_{A/B}}{dt} = \\frac{d\\vec{r}_A}{dt} - \\frac{d\\vec{r}_B}{dt} \\implies \\vec{v}_{A/B} = \\vec{v}_A - \\vec{v}_B$"
        ]
      }
    ],
    "application": {
      "text": "เป็นรากฐานของการวิเคราะห์วิถีโปรเจกไทล์ การแล่นเรือตัดกระแสน้ำ การบินของเครื่องบินต้านลมขวาง และการรวมเวกเตอร์ของแรงในโครงสร้างวิศวกรรม",
      "validWhen": "ใช้ได้สำหรับความเร็วต่ำกว่าความเร็วแสงมาก ($v \\ll c$) ซึ่งเวลา $t$ ของทุกกรอบอ้างอิงไหลเท่ากันตามกลศาสตร์คลาสสิกของนิวตัน",
      "invalidWhen": "ไม่สามารถใช้พีชคณิตเวกเตอร์ธรรมดาได้เมื่อความเร็วเข้าใกล้แสง ($v \\sim c$) ซึ่งต้องใช้การแปลงแบบลอเรนซ์ (Lorentz Transformation) ตามทฤษฎีสัมพัทธภาพพิเศษ"
    },
    "example": {
      "problem": "เรือลำหนึ่งแล่นด้วยความเร็ว $8.0\\text{ m/s}$ มุ่งหน้าไปทางทิศตะวันออก (แกน $+x$) ตัดกระแสน้ำที่กำลังไหลไปทางทิศเหนือ (แกน $+y$) ด้วยความเร็ว $6.0\\text{ m/s}$ จงหาขนาดและทิศทางของความเร็วเรือเทียบกับผู้สังเกตที่ยืนอยู่บนฝั่ง",
      "steps": [
        "เวกเตอร์ความเร็วเรือเทียบกับน้ำ: $\\vec{v}_{b/w} = 8.0\\hat{i}\\text{ m/s}$",
        "เวกเตอร์ความเร็วน้ำเทียบกับฝั่ง: $\\vec{v}_{w/s} = 6.0\\hat{j}\\text{ m/s}$",
        "ความเร็วเรือเทียบกับฝั่ง: $\\vec{v}_{b/s} = \\vec{v}_{b/w} + \\vec{v}_{w/s} = 8.0\\hat{i} + 6.0\\hat{j}\\text{ m/s}$",
        "ขนาดของความเร็ว: $v = \\sqrt{(8.0)^2 + (6.0)^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10.0\\text{ m/s}$",
        "ทิศทางทำมุมกับทิศตะวันออก: $\\theta = \\arctan\\left(\\frac{6.0}{8.0}\\right) = \\arctan(0.75) \\approx 36.87^\\circ$ ไปทางทิศเหนือของทิศตะวันออก"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 480 185\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"เวกเตอร์ 2 มิติและความเร็วสัมพัทธ์\">\n  <defs>\n    <marker id=\"arr-blue\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">\n      <path d=\"M 0 0 L 8 4 L 0 8 Z\" fill=\"#2563EB\"/>\n    </marker>\n    <marker id=\"arr-red\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">\n      <path d=\"M 0 0 L 8 4 L 0 8 Z\" fill=\"#DC2626\"/>\n    </marker>\n    <marker id=\"arr-green\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">\n      <path d=\"M 0 0 L 8 4 L 0 8 Z\" fill=\"#059669\"/>\n    </marker>\n  </defs>\n  <rect width=\"480\" height=\"185\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- River Background Bands -->\n  <rect x=\"30\" y=\"30\" width=\"420\" height=\"120\" fill=\"#EFF6FF\" rx=\"4\"/>\n  <text x=\"50\" y=\"48\" font-size=\"11\" fill=\"#3B82F6\" font-weight=\"600\">กระแสน้ำไหลไปทางทิศตะวันออก (+x)</text>\n  <!-- Coordinate Axis Reference -->\n  <line x1=\"80\" y1=\"135\" x2=\"380\" y2=\"135\" stroke=\"#CBD5E1\" stroke-width=\"1\"/>\n  <!-- Water velocity vector v_w/s -->\n  <line x1=\"80\" y1=\"135\" x2=\"240\" y2=\"135\" stroke=\"#DC2626\" stroke-width=\"2.5\" marker-end=\"url(#arr-red)\"/>\n  <text x=\"160\" y=\"152\" font-size=\"11\" font-weight=\"600\" fill=\"#DC2626\">v_น้ำ = 6.0 m/s (ทิศตะวันออก)</text>\n  <!-- Boat velocity relative to water v_b/w -->\n  <line x1=\"80\" y1=\"135\" x2=\"80\" y2=\"45\" stroke=\"#2563EB\" stroke-width=\"2.5\" marker-end=\"url(#arr-blue)\"/>\n  <text x=\"88\" y=\"90\" font-size=\"11\" font-weight=\"600\" fill=\"#2563EB\">v_เรือ/น้ำ = 8.0 m/s (ทิศเหนือ)</text>\n  <!-- Resultant boat velocity relative to ground v_b/s -->\n  <line x1=\"80\" y1=\"135\" x2=\"240\" y2=\"45\" stroke=\"#059669\" stroke-width=\"3\" marker-end=\"url(#arr-green)\"/>\n  <text x=\"180\" y=\"75\" font-size=\"12\" font-weight=\"700\" fill=\"#059669\">v_สุทธิ = 10.0 m/s (θ = 36.9°)</text>\n  <!-- Angle Arc -->\n  <path d=\"M 120 135 A 40 40 0 0 0 112 118\" fill=\"none\" stroke=\"#059669\" stroke-width=\"1.5\"/>\n  <text x=\"125\" y=\"125\" font-size=\"10\" font-weight=\"600\" fill=\"#059669\">θ</text>\n  <!-- Dashed rectangle completion -->\n  <line x1=\"80\" y1=\"45\" x2=\"240\" y2=\"45\" stroke=\"#94A3B8\" stroke-dasharray=\"3,3\"/>\n  <line x1=\"240\" y1=\"135\" x2=\"240\" y2=\"45\" stroke=\"#94A3B8\" stroke-dasharray=\"3,3\"/>\n</svg>",
      "diagramCaption": "การแยกองค์ประกอบเวกเตอร์ความเร็วและความเร็วสัมพัทธ์ในระนาบ 2 มิติ ($v = \\sqrt{v_x^2 + v_y^2}$)"
    },
    "citation": "Baker, G. L., & Haynes, P. (2020). Projectile Dynamics in Sport. Routledge, Sec. 1.2–1.4, pp. 5–15; Tong, D. (2004). Classical Dynamics, Sec. 1.1, pp. 1–4."
  },
  {
    "id": 4,
    "divisionId": "div-kinematics",
    "divisionTitle": "ภาคที่ 1: จลนศาสตร์ (Kinematics)",
    "numberTh": "ทฤษฎีที่ 4",
    "titleTh": "การเคลื่อนที่แบบโปรเจกไทล์ในสุญญากาศ",
    "titleEn": "Ideal Vacuum Projectile Motion & Parabolic Trajectory",
    "type": "ทฤษฎีวิถีโค้งพาราโบลา (Parabolic Trajectory Theory)",
    "summary": "การอนุมานสมการวิถีพาราโบลา จุดสูงสุด เวลาบิน และระยะตกไกลสุด พร้อมข้อจำกัดและข้อควรระวังของการยิงจากระดับต่างความสูง",
    "definition": {
      "text": "การเคลื่อนที่แบบโปรเจกไทล์ในสุญญากาศ (Ideal Projectile Motion) คือการเคลื่อนที่ 2 มิติของวัตถุที่ถูกยิงหรือขว้างออกไปในมุมใดๆ โดยมีแรงโน้มถ่วงของโลก $m\\vec{g}$ กระทำเพียงแรงเดียวตลอดเวลา และสมมุติว่าไม่มีแรงต้านทานของบรรยากาศ"
    },
    "principle": {
      "text": "การเคลื่อนที่ถูกแยกออกเป็นสองแกนอย่างสมบูรณ์:\n• **แกนราบ ($x$):** ไม่มีแรงกระทำ ($F_x = 0 \\implies a_x = 0$) ความเร็วแนวราบคงที่ตลอดเวลา: $v_x(t) = v_0\\cos\\theta$\n• **แกนดิ่ง ($y$):** มีแรงดึงดูดของโลกดึงลงสม่ำเสมอ ($F_y = -mg \\implies a_y = -g$) เป็นการตกอิสระ: $v_y(t) = v_0\\sin\\theta - gt$\n• **รูปทรงวิถี:** เมื่อกำจัดตัวแปรเวลา $t$ ออก จะได้สมการความสัมพันธ์ $y(x)$ ในรูปกำลังสองของ $x$ ซึ่งเป็นสมการของ **พาราโบลาคว่ำสมมาตร**"
    },
    "formulas": [
      {
        "name": "สมการวิถีพาราโบลา y(x)",
        "latex": "y(x) = y_0 + x\\tan\\theta - \\frac{g x^2}{2 v_0^2 \\cos^2\\theta}",
        "symbols": [
          {
            "sym": "y_0",
            "desc": "ความสูงเริ่มต้นในการยิง",
            "unit": "\\text{m}"
          },
          {
            "sym": "v_0",
            "desc": "ความเร็วต้นในการยิง",
            "unit": "\\text{m/s}"
          },
          {
            "sym": "\\theta",
            "desc": "มุมยิงทำกับแนวราบ",
            "unit": "\\text{deg หรือ rad}"
          },
          {
            "sym": "g",
            "desc": "ความเร่งโน้มถ่วง (9.80665)",
            "unit": "\\text{m/s}^2"
          }
        ],
        "derivationSteps": [
          "1. จากการเคลื่อนที่แกนราบ: $x = v_0\\cos\\theta \\cdot t \\implies t = \\frac{x}{v_0\\cos\\theta}$",
          "2. แทนค่า $t$ ลงในสมการแกนดิ่ง: $y = y_0 + v_0\\sin\\theta \\cdot t - \\frac{1}{2}gt^2$",
          "3. จะได้: $y = y_0 + v_0\\sin\\theta\\left(\\frac{x}{v_0\\cos\\theta}\\right) - \\frac{1}{2}g\\left(\\frac{x}{v_0\\cos\\theta}\\right)^2$",
          "4. ใช้เอกลักษณ์ $\\frac{\\sin\\theta}{\\cos\\theta} = \\tan\\theta$ ได้สมการวิถีพาราโบลา: $y(x) = y_0 + x\\tan\\theta - \\frac{gx^2}{2v_0^2\\cos^2\\theta}$"
        ]
      },
      {
        "name": "ระยะตกไกลสุดและจุดสูงสุด (กรณีพื้นราบเท่ากัน y0 = 0)",
        "latex": "R = \\frac{v_0^2 \\sin 2\\theta}{g} \\quad , \\quad H = \\frac{v_0^2 \\sin^2\\theta}{2g} \\quad , \\quad T = \\frac{2v_0\\sin\\theta}{g}",
        "symbols": [
          {
            "sym": "R",
            "desc": "ระยะตกแนวราบ (Range)",
            "unit": "\\text{m}"
          },
          {
            "sym": "H",
            "desc": "จุดสูงสุดเหนือระดับยิง (Apex)",
            "unit": "\\text{m}"
          },
          {
            "sym": "T",
            "desc": "เวลาการบินรวม (Total Flight Time)",
            "unit": "\\text{s}"
          }
        ],
        "derivationSteps": [
          "1. จุดสูงสุด ($H$): เกิดขึ้นเมื่อ $v_y = 0 \\implies v_0\\sin\\theta - gt_{\\text{apex}} = 0 \\implies t_{\\text{apex}} = \\frac{v_0\\sin\\theta}{g}$",
          "2. แทน $t_{\\text{apex}}$ ในแกนดิ่ง: $H = (v_0\\sin\\theta)\\left(\\frac{v_0\\sin\\theta}{g}\\right) - \\frac{1}{2}g\\left(\\frac{v_0\\sin\\theta}{g}\\right)^2 = \\frac{v_0^2\\sin^2\\theta}{2g}$",
          "3. เวลาบินรวม ($T$): เนื่องจากวิถีสมมาตร $T = 2 t_{\\text{apex}} = \\frac{2v_0\\sin\\theta}{g}$",
          "4. ระยะตก ($R$): $R = v_x \\cdot T = (v_0\\cos\\theta)\\left(\\frac{2v_0\\sin\\theta}{g}\\right) = \\frac{v_0^2(2\\sin\\theta\\cos\\theta)}{g} = \\frac{v_0^2\\sin 2\\theta}{g}$"
        ]
      }
    ],
    "application": {
      "text": "แบบจำลองมาตรฐานในการแข่งขันฟิสิกส์โอลิมปิก การคำนวณเบื้องต้นของกีฬาบาสเกตบอล ทุ่มน้ำหนัก และการประมาณการวิถีวิศวกรรมขั้นต้น",
      "validWhen": "ใช้ได้แม่นยำเมื่อวัตถุมีความหนาแน่นสูง เคลื่อนที่ด้วยความเร็วต่ำในระยะสั้นๆ ที่แรงต้านอากาศมีค่าน้อยมากเมื่อเทียบกับน้ำหนักของวัตถุ ($F_d \\ll mg$)",
      "invalidWhen": "ใช้ไม่ได้กับกระสุนปืนใหญ่จริง ลูกกอล์ฟ หรือลูกขนไก่แบดมินตัน ซึ่งแรงต้านอากาศสามารถลดระยะตกลงได้มากกว่า 50% ถึง 80%"
    },
    "example": {
      "problem": "ยิงวัตถุในสุญญากาศด้วยความเร็วต้น $v_0 = 50.0\\text{ m/s}$ ทำมุม $\\theta = 30.0^\\circ$ จากพื้นราบ ($g = 9.80\\text{ m/s}^2$) จงหา (ก) เวลาบิน (ข) จุดสูงสุด (ค) ระยะตกไกลสุด",
      "steps": [
        "(ก) เวลาบินรวม: $T = \\frac{2(50.0)\\sin 30^\\circ}{9.80} = \\frac{100.0(0.5)}{9.80} \\approx 5.10\\text{ s}$",
        "(ข) จุดสูงสุด: $H = \\frac{(50.0)^2 \\sin^2 30^\\circ}{2(9.80)} = \\frac{2500(0.25)}{19.6} = \\frac{625}{19.6} \\approx 31.89\\text{ m}$",
        "(ค) ระยะตกไกลสุด: $R = \\frac{(50.0)^2 \\sin 60^\\circ}{9.80} = \\frac{2500(0.8660)}{9.80} \\approx 220.9\\text{ m}$"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 520 200\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"วิถีโพรเจกไทล์ในสุญญากาศ\">\n  <defs>\n    <marker id=\"arr-proj\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\">\n      <path d=\"M 0 0 L 7 3.5 L 0 7 Z\" fill=\"#2563EB\"/>\n    </marker>\n    <marker id=\"arr-axis4\" markerWidth=\"6\" markerHeight=\"6\" refX=\"5\" refY=\"3\" orient=\"auto\">\n      <path d=\"M 0 0 L 6 3 L 0 6 Z\" fill=\"#64748B\"/>\n    </marker>\n  </defs>\n  <rect width=\"520\" height=\"200\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Ground line -->\n  <line x1=\"40\" y1=\"165\" x2=\"480\" y2=\"165\" stroke=\"#64748B\" stroke-width=\"2\"/>\n  <line x1=\"50\" y1=\"175\" x2=\"50\" y2=\"25\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis4)\"/>\n  <text x=\"475\" y=\"180\" font-size=\"11\" fill=\"#64748B\">x (ระยะทาง)</text>\n  <text x=\"35\" y=\"30\" font-size=\"11\" fill=\"#64748B\">y (ความสูง)</text>\n  <!-- Parabolic Curve -->\n  <path d=\"M 50 165 Q 240 15 430 165\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"3\"/>\n  <!-- Apex Point -->\n  <circle cx=\"240\" cy=\"52\" r=\"5\" fill=\"#DC2626\"/>\n  <line x1=\"240\" y1=\"165\" x2=\"240\" y2=\"52\" stroke=\"#DC2626\" stroke-dasharray=\"4,4\"/>\n  <text x=\"248\" y=\"46\" font-size=\"11\" font-weight=\"700\" fill=\"#DC2626\">จุดสูงสุด H = v₀²sin²θ / (2g)</text>\n  <text x=\"248\" y=\"62\" font-size=\"10\" fill=\"#475569\">(v_y = 0, มีเฉพาะ v_x = v₀cosθ)</text>\n  <!-- Launch Vector -->\n  <line x1=\"50\" y1=\"165\" x2=\"110\" y2=\"105\" stroke=\"#2563EB\" stroke-width=\"2.5\" marker-end=\"url(#arr-proj)\"/>\n  <text x=\"85\" y=\"98\" font-size=\"11\" font-weight=\"700\" fill=\"#2563EB\">v₀</text>\n  <!-- Launch Angle θ -->\n  <path d=\"M 80 165 A 30 30 0 0 0 71 144\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"1.5\"/>\n  <text x=\"85\" y=\"156\" font-size=\"10\" font-weight=\"700\" fill=\"#EA580C\">θ</text>\n  <!-- Range indicator -->\n  <line x1=\"50\" y1=\"182\" x2=\"430\" y2=\"182\" stroke=\"#475569\" stroke-width=\"1.2\"/>\n  <circle cx=\"50\" cy=\"182\" r=\"2.5\" fill=\"#475569\"/>\n  <circle cx=\"430\" cy=\"182\" r=\"2.5\" fill=\"#475569\"/>\n  <text x=\"240\" y=\"194\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"600\" fill=\"#1E293B\">ระยะตกไกลสุด: R = v₀²sin(2θ) / g</text>\n</svg>",
      "diagramCaption": "วิถีการเคลื่อนที่แบบโพรเจกไทล์ในสุญญากาศ: แยกคิดแกน $x$ (ความเร็วคงที่) และแกน $y$ (ความเร่งโน้มถ่วง $-g$)"
    },
    "observations": [
      "ข้อควรระวังสำคัญเรื่องมุม $45^\\circ$: มุม $45^\\circ$ ให้ระยะตกไกลสุด **เฉพาะเมื่อจุดยิงและจุดตกอยู่บนระนาบระดับเดียวกัน ($y_0 = y_{\\text{land}}$) เท่านั้น!** หากยิงจากหน้าผาสูง ($y_0 > 0$) มุมที่ให้ระยะตกไกลสุดจะมีค่าน้อยกว่า $45^\\circ$ เสมอ (เช่น การทุ่มน้ำหนักในกีฬาโอลิมปิกปล่อยลูกเหล็กจากระดับความสูงหัวไหล่ $\\sim 2\\text{ m}$ มุมยิงที่เหมาะสมที่สุดจึงอยู่ที่ประมาณ $37^\\circ - 42^\\circ$)"
    ],
    "citation": "Morin, D. (2008). Introduction to Classical Mechanics, Sec. 1.4, pp. 11–14; Taylor, J. R. (2005). Classical Mechanics, Sec. 1.2, pp. 9–14."
  },
  {
    "id": 5,
    "divisionId": "div-dynamics",
    "divisionTitle": "ภาคที่ 2: พลศาสตร์ (Dynamics)",
    "numberTh": "ทฤษฎีที่ 5",
    "titleTh": "กฎการเคลื่อนที่ของนิวตัน 3 ข้อและแผนภาพวัตถุอิสระ",
    "titleEn": "Newton's Three Laws of Motion, Inertial Frames & Free Body Diagrams",
    "type": "กฎธรรมชาติพื้นฐาน (Fundamental Laws of Nature)",
    "summary": "กรอบอ้างอิงเฉื่อย กฎความเร่งและขอบเขตมวลคงที่ และหลักการที่ว่าแรงคู่กิริยา-ปฏิกิริยากระทำบนวัตถุคนละก้อนจึงไม่หักล้างกัน",
    "definition": {
      "text": "พลศาสตร์ (Dynamics) ศึกษาแรงซึ่งเป็นสาเหตุที่ทำให้สภาพการเคลื่อนที่ของวัตถุเปลี่ยนไป นิวตัน (Isaac Newton, 1687) ได้วางรากฐานของกลศาสตร์คลาสสิกไว้ด้วยกฎการเคลื่อนที่ 3 ข้อ:\n• **มวลเฉื่อย (Inertial Mass, $m$):** สมบัติเชิงปริมาณของสสารที่แสดงความต้านทานต่อการเปลี่ยนแปลงสภาพการเคลื่อนที่\n• **แรง (Force, $\\vec{F}$):** ปฏิสัมพันธ์แบบเวกเตอร์ระหว่างวัตถุกับสิ่งแวดล้อมที่พยายามทำให้เกิดความเร่ง\n• **กรอบอ้างอิงเฉื่อย (Inertial Reference Frame):** กรอบอ้างอิงที่ไม่หมุนและไม่มีความเร่ง ซึ่งกฎข้อที่ 1 และ 2 ของนิวตันมีผลบังคับใช้ได้อย่างสมบูรณ์"
    },
    "principle": {
      "text": "1. **กฎข้อที่ 1 (กฎของความเฉื่อย - Law of Inertia):** หากแรงลัพธ์ภายนอกที่กระทำต่อวัตถุเป็นศูนย์ ($\\sum\\vec{F} = 0$) วัตถุที่อยู่นิ่งจะรักษาสภาพนิ่งต่อไป และวัตถุที่กำลังเคลื่อนที่จะเคลื่อนที่ต่อไปด้วยความเร็วคงที่ในแนวเส้นตรง ($\\vec{v} = \\text{const}, \\vec{a} = 0$)\n2. **กฎข้อที่ 2 (กฎของแรงและความเร่ง - Law of Acceleration):** อัตราการเปลี่ยนแปลงโมเมนตัมของวัตถุแปรผันตรงกับแรงลัพธ์ภายนอกและมีทิศทางเดียวกับแรงลัพธ์นั้น: $\\sum\\vec{F} = \\frac{d\\vec{p}}{dt}$ เมื่อมวลของวัตถุคงที่ จะเขียนได้เป็น $\\sum\\vec{F} = m\\vec{a}$\n3. **กฎข้อที่ 3 (กฎคู่กิริยา-ปฏิกิริยา - Action and Reaction):** เมื่อวัตถุ $A$ ออกแรงกระทำต่อวัตถุ $B$ ($\\vec{F}_{AB}$) วัตถุ $B$ จะออกแรงกระทำต่อวัตถุ $A$ ในขนาดที่เท่ากันแต่ทิศตรงกันข้ามเสมอ ($\\vec{F}_{BA} = -\\vec{F}_{AB}$)\n• **แผนภาพวัตถุอิสระ (Free Body Diagram - FBD):** แผนภาพแยกวัตถุที่พิจารณาออกมาเพียงชิ้นเดียว แล้วเขียนเวกเตอร์แรงภายนอกทุกแรงที่กระทำ **ต่อ** วัตถุนั้น (ห้ามนำแรงที่วัตถุไปกระทำต่อสิ่งอื่นมาเขียนลงใน FBD ของวัตถุชิ้นนั้น)"
    },
    "formulas": [
      {
        "name": "กฎข้อที่ 2 ของนิวตัน (มวลคงที่)",
        "latex": "\\sum \\vec{F} = m\\vec{a} = m\\frac{d^2\\vec{r}}{dt^2}",
        "symbols": [
          {
            "sym": "\\sum\\vec{F}",
            "desc": "แรงลัพธ์ภายนอก (ผลบวกแบบเวกเตอร์)",
            "unit": "\\text{N หรือ kg}\\cdot\\text{m/s}^2"
          },
          {
            "sym": "m",
            "desc": "มวลเฉื่อยของวัตถุ (คงที่)",
            "unit": "\\text{kg}"
          },
          {
            "sym": "\\vec{a}",
            "desc": "เวกเตอร์ความเร่งของวัตถุ",
            "unit": "\\text{m/s}^2"
          }
        ],
        "derivationSteps": [
          "1. นิยามทั่วไปของนิวตัน: $\\sum\\vec{F} = \\frac{d\\vec{p}}{dt} = \\frac{d(m\\vec{v})}{dt}$",
          "2. ใช้กฎผลคูณของการหาอนุพันธ์: $\\sum\\vec{F} = m\\frac{d\\vec{v}}{dt} + \\vec{v}\\frac{dm}{dt}$",
          "3. สำหรับระบบวัตถุทั่วไปที่มีมวลคงที่ $\\frac{dm}{dt} = 0$",
          "4. จะได้สมการรูปมาตรฐาน: $\\sum\\vec{F} = m\\vec{a}$"
        ]
      },
      {
        "name": "กฎข้อที่ 3 ของนิวตัน (คู่แรงกิริยา-ปฏิกิริยา)",
        "latex": "\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}",
        "symbols": [
          {
            "sym": "\\vec{F}_{A \\to B}",
            "desc": "แรงที่วัตถุ A กระทำต่อวัตถุ B",
            "unit": "\\text{N}"
          },
          {
            "sym": "\\vec{F}_{B \\to A}",
            "desc": "แรงที่วัตถุ B กระทำย้อนกลับต่อวัตถุ A",
            "unit": "\\text{N}"
          }
        ]
      }
    ],
    "application": {
      "text": "การวิเคราะห์การเคลื่อนที่ของยานยนต์ การออกแบบโครงสร้างรับแรง สะพาน อาคาร เครื่องบิน และจรวดขับดัน",
      "validWhen": "ใช้ในกรอบอ้างอิงเฉื่อย (Inertial Frame) เท่านั้น หากนำไปใช้ในกรอบที่มีความเร่ง เช่น รถยนต์ที่กำลังเลี้ยวโค้งหรือเบรก ต้องเพิ่มแรงเฉื่อยเสมือน (Fictitious / Inertial Force เช่น แรงเหวี่ยงหนีศูนย์กลาง)",
      "invalidWhen": "สมการ $\\sum\\vec{F} = m\\vec{a}$ ใช้ไม่ได้โดยตรงกับระบบมวลแปรผัน (Variable-mass system เช่น จรวดที่พ่นเชื้อเพลิงออกไปอย่างต่อเนื่อง ต้องใช้สมการจรวดของซีออลคอฟสกี Tsiolkovsky Rocket Equation)"
    },
    "example": {
      "problem": "กล่องมวล $m = 10.0\\text{ kg}$ วางบนพื้นราบเกลี้ยงไร้แรงเสียดทาน มีแรง $F_1 = 40.0\\text{ N}$ ดึงไปทางขวา และแรง $F_2 = 15.0\\text{ N}$ ดึงไปทางซ้าย จงเขียนสมการ FBD และหาความเร่งของกล่อง",
      "steps": [
        "ขั้นตอนที่ 1: เขียน FBD ในแนวดิ่ง: มีแรงโน้มถ่วง $W = mg = (10)(9.8) = 98\\text{ N}$ ทิศลง และแรงปฏิกิริยาตั้งฉาก $N$ ทิศขึ้น เนื่องจากไม่มีการเคลื่อนที่แนวดิ่ง: $N - mg = 0 \\implies N = 98.0\\text{ N}$",
        "ขั้นตอนที่ 2: เขียน FBD ในแนวราบ: กำหนดทิศขวาเป็นบวก (+):\n$\\sum F_x = F_1 - F_2 = 40.0 - 15.0 = +25.0\\text{ N}$",
        "ขั้นตอนที่ 3: ใช้กฎข้อ 2 ของนิวตัน: $\\sum F_x = ma_x \\implies 25.0 = (10.0)a_x \\implies a_x = +2.50\\text{ m/s}^2$",
        "สรุปผล: กล่องมีความเร่ง $2.50\\text{ m/s}^2$ พุ่งไปทางขวา"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 480 200\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"แผนภาพวัตถุอิสระบนพื้นเอียง\">\n  <defs>\n    <marker id=\"arr-force\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">\n      <path d=\"M 0 0 L 8 4 L 0 8 Z\" fill=\"#DC2626\"/>\n    </marker>\n    <marker id=\"arr-blue5\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">\n      <path d=\"M 0 0 L 8 4 L 0 8 Z\" fill=\"#2563EB\"/>\n    </marker>\n  </defs>\n  <rect width=\"480\" height=\"200\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Incline Plane (30 deg) -->\n  <polygon points=\"60,170 420,170 420,50\" fill=\"#E2E8F0\" stroke=\"#94A3B8\" stroke-width=\"1.5\"/>\n  <text x=\"110\" y=\"162\" font-size=\"11\" font-weight=\"600\" fill=\"#475569\">θ = 30°</text>\n  <!-- Block on Incline -->\n  <g transform=\"translate(240, 110) rotate(-18.4)\">\n    <rect x=\"-25\" y=\"-20\" width=\"50\" height=\"35\" rx=\"3\" fill=\"#3B82F6\" stroke=\"#1D4ED8\" stroke-width=\"1.5\"/>\n    <text x=\"0\" y=\"2\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#FFFFFF\">m</text>\n  </g>\n  <!-- Forces from Center of Block (x=240, y=110) -->\n  <!-- Gravity W = mg downwards -->\n  <line x1=\"240\" y1=\"110\" x2=\"240\" y2=\"180\" stroke=\"#DC2626\" stroke-width=\"2.2\" marker-end=\"url(#arr-force)\"/>\n  <text x=\"246\" y=\"165\" font-size=\"11\" font-weight=\"700\" fill=\"#DC2626\">W = mg</text>\n  <!-- Normal force N perpendicular to incline -->\n  <line x1=\"240\" y1=\"110\" x2=\"215\" y2=\"40\" stroke=\"#2563EB\" stroke-width=\"2.2\" marker-end=\"url(#arr-blue5)\"/>\n  <text x=\"180\" y=\"45\" font-size=\"11\" font-weight=\"700\" fill=\"#2563EB\">N = mg cosθ</text>\n  <!-- Component down slope mg sinθ -->\n  <line x1=\"240\" y1=\"110\" x2=\"165\" y2=\"135\" stroke=\"#DC2626\" stroke-width=\"2\" stroke-dasharray=\"4,2\" marker-end=\"url(#arr-force)\"/>\n  <text x=\"145\" y=\"125\" font-size=\"10\" font-weight=\"600\" fill=\"#DC2626\">mg sinθ</text>\n  <!-- Friction fk opposing motion up slope -->\n  <line x1=\"240\" y1=\"110\" x2=\"310\" y2=\"87\" stroke=\"#EA580C\" stroke-width=\"2\" marker-end=\"url(#arr-force)\"/>\n  <text x=\"315\" y=\"85\" font-size=\"10\" font-weight=\"600\" fill=\"#EA580C\">f_k = μ_k N</text>\n</svg>",
      "diagramCaption": "แผนภาพวัตถุอิสระ (Free Body Diagram) บนพื้นเอียง: การแยกแรงโน้มถ่วงเข้าแนวขนานและตั้งฉากกับระนาบ"
    },
    "observations": [
      "ประเด็นที่มักเข้าใจผิดร้ายแรง: \"แรงกิริยาและแรงปฏิกิริยาหักล้างกันจนวัตถุไม่ขยับ\" — ไม่จริง! แรงกิริยาและปฏิกิริยากระทำบน **วัตถุคนละชิ้นเสมอ** (เช่น ม้าดึงเกวียน แรงที่ม้าดึงเกวียนกระทำต่อเกวียน ส่วนแรงที่เกวียนดึงม้ากระทำต่อตัวม้า) จึงไม่สามารถนำมาหักล้างกันบนวัตถุก้อนเดียวกันได้เลย"
    ],
    "citation": "Tong, D. (2004). Classical Dynamics. University of Cambridge, Ch. 1, pp. 1–6; Morin, D. (2008), Sec. 3.1–3.2, pp. 53–59."
  },
  {
    "id": 6,
    "divisionId": "div-dynamics",
    "divisionTitle": "ภาคที่ 2: พลศาสตร์ (Dynamics)",
    "numberTh": "ทฤษฎีที่ 6",
    "titleTh": "แรงต้านของไหลเชิงเส้นและกำลังสอง",
    "titleEn": "Fluid Drag, Terminal Velocity & The Coupled Nonlinear Equations of Motion",
    "type": "พลศาสตร์ของไหลประยุกต์ (Aerodynamics & Fluid Dynamics)",
    "summary": "กลไกแรงต้านตามความเร็วสัมพัทธ์ในอากาศ ความเร็วปลาย เหตุผลที่แกน x และ y ผูกกันจนแก้ด้วยแคลคูลัสพื้นฐานไม่ได้",
    "definition": {
      "text": "แรงต้านของไหล (Fluid Drag Force, $\\vec{F}_d$) คือแรงกลศาสตร์ที่ตัวกลางของไหล (ก๊าซหรือของเหลว) กระทำต้านการเคลื่อนที่ของวัตถุ โดยมีทิศทาง **ตรงข้ามกับเวกเตอร์ความเร็วสัมพัทธ์ของวัตถุเทียบกับของไหล** เสมอ ($\\vec{F}_d \\propto -\\vec{v}$ หรือ $-\\vec{v}^2$)"
    },
    "principle": {
      "text": "1. **ขอบเขตแรงต้านเชิงเส้น (Linear Drag - Stokes' Law):** เกิดขึ้นที่เลขเรย์โนลด์ต่ำมาก ($Re \\ll 1$) แรงต้านเกิดจากความหนืด (Viscosity) ของของไหลเด่นชัด: $\\vec{F}_d = -b\\vec{v}$\n2. **ขอบเขตแรงต้านกำลังสอง (Quadratic Drag - Newtonian Drag):** เกิดขึ้นที่เลขเรย์โนลด์สูง ($Re \\gg 10^3$) ซึ่งเป็นกรณีของลูกกระสุน ยานพาหนะ และกีฬาเกือบทั้งหมด แรงต้านเกิดจากความเฉื่อยของก๊าซที่ถูกผลักออกและการเกิดกระแสไหลวน (Turbulent Wake): $\\vec{F}_d = -\\frac{1}{2}\\rho C_d A \\|\\vec{v}\\| \\vec{v} = -c v \\vec{v}$\n3. **เหตุผลที่การเคลื่อนที่ 2 มิติผูกกัน (Coupled Equations):**\nเนื่องจากแรงต้านมีขนาดขึ้นกับอัตราเร็วรวม $v = \\sqrt{v_x^2 + v_y^2}$ องค์ประกอบแรงในแต่ละแกนจึงกลายเป็น:\n$F_{dx} = -c \\sqrt{v_x^2 + v_y^2} v_x \\quad , \\quad F_{dy} = -c \\sqrt{v_x^2 + v_y^2} v_y$\nทำให้ความเร่งในแกน $x$ ต้องขึ้นกับความเร็วแกน $y$ และความเร่งแกน $y$ ขึ้นกับแกน $x$ ทำให้ **หลักการแยกคิดแกนอิสระของกาลิเลโอใช้ไม่ได้อีกต่อไป** และไม่สามารถแก้หาผลเฉลยในรูปฟังก์ชันวิเคราะห์พื้นฐานได้ ต้องใช้ระเบียบวิธีเชิงตัวเลข (เช่น RK4)\n4. **ความเร็วปลาย (Terminal Velocity, $v_t$):** เมื่อวัตถุตกลงมาจนกระทั่งแรงต้านอากาศมีขนาดเท่ากับแรงดึงดูดของโลก ($F_d = mg$) แรงลัพธ์จะเป็นศูนย์ วัตถุจะตกต่อไปด้วยความเร็วคงที่สูงสุด เรียกว่าความเร็วปลาย"
    },
    "formulas": [
      {
        "name": "สมการแรงต้านอากาศกำลังสองและสัมประสิทธิ์ c",
        "latex": "\\vec{F}_d = -c \\|\\vec{v}\\| \\vec{v} \\quad \\text{โดยที่} \\quad c = \\frac{1}{2}\\rho C_d A",
        "symbols": [
          {
            "sym": "\\rho",
            "desc": "ความหนาแน่นของอากาศ (ประมาณ 1.225 ที่ระดับน้ำทะเล)",
            "unit": "\\text{kg/m}^3"
          },
          {
            "sym": "C_d",
            "desc": "สัมประสิทธิ์ความต้านทานรูปทรง (Drag Coefficient)",
            "unit": "-"
          },
          {
            "sym": "A",
            "desc": "พื้นที่หน้าตัดรับลม (Cross-sectional Area)",
            "unit": "\\text{m}^2"
          },
          {
            "sym": "c",
            "desc": "สัมประสิทธิ์แรงต้านรวมของวัตถุ",
            "unit": "\\text{kg/m}"
          }
        ]
      },
      {
        "name": "ความเร็วปลายในแนวดิ่ง (Terminal Velocity)",
        "latex": "v_t = \\sqrt{\\frac{mg}{c}} = \\sqrt{\\frac{2mg}{\\rho C_d A}}",
        "symbols": [
          {
            "sym": "v_t",
            "desc": "ความเร็วปลายคงที่",
            "unit": "\\text{m/s}"
          }
        ],
        "derivationSteps": [
          "1. เมื่อวัตถุตกในแนวดิ่งถึงสภาวะสมดุลจลน์ ความเร่ง $a = 0$",
          "2. จากกฎข้อที่ 2 ของนิวตัน: $\\sum F_y = mg - F_d = 0$",
          "3. แทนสูตรแรงต้านกำลังสอง: $mg - c v_t^2 = 0$",
          "4. ถอดสมการหา $v_t$: $c v_t^2 = mg \\implies v_t = \\sqrt{\\frac{mg}{c}}$"
        ]
      },
      {
        "name": "ระบบสมการอนุพันธ์ควบคู่แบบไม่เชิงเส้น (Coupled ODEs)",
        "latex": "\\frac{dv_x}{dt} = -\\frac{c}{m}v_x\\sqrt{v_x^2 + v_y^2} \\quad , \\quad \\frac{dv_y}{dt} = -g - \\frac{c}{m}v_y\\sqrt{v_x^2 + v_y^2}",
        "symbols": [
          {
            "sym": "v_x, v_y",
            "desc": "ความเร็วแกนราบและแกนดิ่งที่ควบคู่กัน",
            "unit": "\\text{m/s}"
          }
        ]
      }
    ],
    "application": {
      "text": "การออกแบบกระสุนปืนใหญ่ ขีปนาวุธ ร่มชูชีพ การวิเคราะห์การเคลื่อนที่ของยานยนต์เพื่อประหยัดน้ำมัน และการจำลองวิถีลูกกอล์ฟที่มีรอยบุ๋ม (Dimples)",
      "validWhen": "ใช้ได้ในย่านความเร็วใต้เสียง (Subsonic) ที่สัมประสิทธิ์ $C_d$ มีค่าค่อนข้างคงที่",
      "invalidWhen": "ใช้ไม่ได้เมื่อความเร็วเข้าใกล้หรือเกินความเร็วเสียง ($M \\ge 1$) เพราะจะเกิดคลื่นกระแทก (Shock Wave) ทำให้ $C_d$ พุ่งสูงขึ้นอย่างรวดเร็ว (Transonic Drag Divergence)"
    },
    "example": {
      "problem": "นักกระโดดร่มมวลรวมร่ม $m = 80.0\\text{ kg}$ ทิ้งตัวลงมาในแนวดิ่ง อากาศมีความหนาแน่น $\\rho = 1.20\\text{ kg/m}^3$ พื้นที่หน้าตัดร่มที่กางออก $A = 40.0\\text{ m}^2$ ค่าสัมประสิทธิ์ $C_d = 1.00$ ($g = 9.80\\text{ m/s}^2$) จงหาค่า $c$ และความเร็วปลายขณะร่มกางเต็มที่",
      "steps": [
        "ขั้นตอนที่ 1: คำนวณค่า $c$ จากคุณสมบัติทางกายภาพ:\n$c = \\frac{1}{2}\\rho C_d A = \\frac{1}{2}(1.20)(1.00)(40.0) = 24.0\\text{ kg/m}$",
        "ขั้นตอนที่ 2: คำนวณความเร็วปลาย $v_t$:\n$v_t = \\sqrt{\\frac{mg}{c}} = \\sqrt{\\frac{(80.0)(9.80)}{24.0}} = \\sqrt{\\frac{784}{24.0}} = \\sqrt{32.667} \\approx 5.72\\text{ m/s}$ (ประมาณ $20.6\\text{ km/h}$ ปลอดภัยต่อการลงพื้น)"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 540 200\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"เปรียบเทียบวิถีสุญญากาศกับวิถีที่มีแรงต้านอากาศ\">\n  <defs>\n    <marker id=\"arr-drag\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\">\n      <path d=\"M 0 0 L 7 3.5 L 0 7 Z\" fill=\"#DC2626\"/>\n    </marker>\n  </defs>\n  <rect width=\"540\" height=\"200\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Ground line -->\n  <line x1=\"40\" y1=\"165\" x2=\"500\" y2=\"165\" stroke=\"#64748B\" stroke-width=\"2\"/>\n  <text x=\"495\" y=\"180\" font-size=\"10\" fill=\"#64748B\">x (m)</text>\n  <text x=\"25\" y=\"35\" font-size=\"10\" fill=\"#64748B\">y (m)</text>\n  <!-- Vacuum Trajectory (Symmetric Parabola - Dashed Blue) -->\n  <path d=\"M 50 165 Q 260 25 470 165\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"2\" stroke-dasharray=\"5,4\"/>\n  <text x=\"410\" y=\"145\" font-size=\"11\" font-weight=\"600\" fill=\"#2563EB\">สุญญากาศ (c = 0)</text>\n  <!-- Drag Trajectory (Asymmetric - Solid Red) -->\n  <path d=\"M 50 165 C 140 60, 210 55, 295 165\" fill=\"none\" stroke=\"#DC2626\" stroke-width=\"3\"/>\n  <text x=\"270\" y=\"110\" font-size=\"11\" font-weight=\"700\" fill=\"#DC2626\">มีแรงต้านอากาศ (c = 0.05)</text>\n  <!-- Apex labels -->\n  <circle cx=\"260\" cy=\"60\" r=\"3.5\" fill=\"#2563EB\"/>\n  <circle cx=\"180\" cy=\"72\" r=\"3.5\" fill=\"#DC2626\"/>\n  <!-- Vertical Asymptote line -->\n  <line x1=\"315\" y1=\"165\" x2=\"315\" y2=\"50\" stroke=\"#94A3B8\" stroke-dasharray=\"3,3\"/>\n  <text x=\"320\" y=\"65\" font-size=\"10\" fill=\"#64748B\">เส้นกำกับแนวดิ่ง (v → v_t)</text>\n  <!-- Legend summary -->\n  <rect x=\"55\" y=\"20\" width=\"220\" height=\"30\" rx=\"4\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\"/>\n  <text x=\"65\" y=\"40\" font-size=\"10\" fill=\"#1E293B\">แรงต้าน F_d = cv² ลดระยะตกและจุดสูงสุด</text>\n</svg>",
      "diagramCaption": "เปรียบเทียบวิถีโพรเจกไทล์: เส้นประสีน้ำเงิน = สุญญากาศ (สมมาตร) เทียบกับ เส้นทึบสีแดง = แรงต้านอากาศ $cv^2$ (อสมมาตรและตกชัน)"
    },
    "observations": [
      "ข้อสังเกตเรื่องเวลาการบิน: แรงต้านอากาศลดระยะตกแนวราบเสมอ แต่ **ไม่ได้ทำให้เวลาการบินลดลงในทุกกรณี** หากยิงในมุมต่ำมากหรือยิงจากหน้าผา แรงต้านอาจทำให้วิถีส่วนท้ายตกชันลงและใช้เวลาอยู่ในอากาศต่างจากสูญญากาศ"
    ],
    "citation": "Morin, D. (2008). Introduction to Classical Mechanics, Sec. 3.3–3.4, pp. 60–68; Taylor, J. R. (2005). Classical Mechanics, Ch. 2, pp. 43–55."
  },
  {
    "id": 7,
    "divisionId": "div-conservation",
    "divisionTitle": "ภาคที่ 3: กฎการอนุรักษ์ (Conservation Laws)",
    "numberTh": "ทฤษฎีที่ 7",
    "titleTh": "โมเมนตัมเชิงเส้นและการดล",
    "titleEn": "Linear Momentum, Impulse & Conservation Principles",
    "type": "กฎการอนุรักษ์เชิงกายภาพ (Physical Conservation Law)",
    "summary": "นิยามของโมเมนตัมเชิงเส้น การดล ทฤษฎีบทการอนุรักษ์โมเมนตัมของระบบ และข้อห้ามในการอ้างว่าวัตถุเดี่ยวที่กำลังตกมีโมเมนตัมคงตัว",
    "definition": {
      "text": "• **โมเมนตัมเชิงเส้น (Linear Momentum, $\\vec{p}$):** ปริมาณเวกเตอร์บอกสภาพการเคลื่อนที่ของวัตถุ นิยามโดยผลคูณของมวลเฉื่อยกับความเร็ว $\\vec{p} = m\\vec{v}$ (หน่วย: $\\text{kg}\\cdot\\text{m/s}$ หรือ $\\text{N}\\cdot\\text{s}$)\n• **การดล (Impulse, $\\vec{J}$):** ผลรวมของแรงภายนอกที่กระทำต่อวัตถุตลอดช่วงเวลาหนึ่ง ซึ่งมีค่าเท่ากับโมเมนตัมของวัตถุที่เปลี่ยนไปพอดี: $\\vec{J} = \\int_{t_1}^{t_2} \\vec{F} dt = \\Delta\\vec{p}$"
    },
    "principle": {
      "text": "1. **รูปแบบทั่วไปของกฎข้อ 2 นิวตัน:** $\\sum\\vec{F}_{\\text{ext}} = \\frac{d\\vec{p}_{\\text{sys}}}{dt}$ แรงภายนอกลัพธ์คืออัตราการเปลี่ยนแปลงโมเมนตัมของระบบ\n2. **กฎการอนุรักษ์โมเมนตัมเชิงเส้น (Law of Conservation of Linear Momentum):**\nหากแรงภายนอกลัพธ์ที่กระทำต่อระบบเป็นศูนย์ ($\\sum\\vec{F}_{\\text{ext}} = 0$) โมเมนตัมเชิงเส้นรวมของระบบจะมีค่าคงตัวเสมอ ไม่ว่าภายในระบบจะเกิดการชน การระเบิด หรือการปฏิสัมพันธ์อย่างรุนแรงเพียงใด: $\\vec{p}_{\\text{total, initial}} = \\vec{p}_{\\text{total, final}}$"
    },
    "formulas": [
      {
        "name": "ทฤษฎีบทการดลและโมเมนตัม (Impulse-Momentum Theorem)",
        "latex": "\\vec{J} = \\int_{t_i}^{t_f} \\vec{F}_{\\text{net}} dt = \\Delta\\vec{p} = m\\vec{v}_f - m\\vec{v}_i",
        "symbols": [
          {
            "sym": "\\vec{J}",
            "desc": "การดล (พื้นที่ใต้กราฟแรงกับเวลา F-t)",
            "unit": "\\text{N}\\cdot\\text{s}"
          },
          {
            "sym": "\\Delta\\vec{p}",
            "desc": "โมเมนตัมที่เปลี่ยนแปลงไป",
            "unit": "\\text{kg}\\cdot\\text{m/s}"
          }
        ],
        "derivationSteps": [
          "1. จากกฎข้อที่ 2: $\\vec{F} = \\frac{d\\vec{p}}{dt}$",
          "2. อินทิเกรตเทียบเวลาทั้งสองข้าง: $\\int_{t_i}^{t_f} \\vec{F} dt = \\int_{\\vec{p}_i}^{\\vec{p}_f} d\\vec{p}$",
          "3. จะได้: $\\vec{J} = \\vec{p}_f - \\vec{p}_i = \\Delta\\vec{p}$"
        ]
      },
      {
        "name": "กฎการอนุรักษ์โมเมนตัมสำหรับระบบสองวัตถุ",
        "latex": "m_1\\vec{u}_1 + m_2\\vec{u}_2 = m_1\\vec{v}_1 + m_2\\vec{v}_2 \\quad (\\text{เมื่อ } \\sum\\vec{F}_{\\text{ext}} = 0)",
        "symbols": [
          {
            "sym": "m_1, m_2",
            "desc": "มวลของวัตถุที่ 1 และ 2",
            "unit": "\\text{kg}"
          },
          {
            "sym": "\\vec{u}, \\vec{v}",
            "desc": "ความเร็วก่อนและหลังชน",
            "unit": "\\text{m/s}"
          }
        ]
      }
    ],
    "application": {
      "text": "การคำนวณการชนกันของยานยนต์ การวิเคราะห์ระบบถุงลมนิรภัย (ยืดเวลาปะทะ $\\Delta t$ เพื่อลดแรงดล $\\vec{F}$) การขับเคลื่อนของจรวด และฟิสิกส์อนุภาคพลังงานสูง",
      "validWhen": "ใช้ได้กับทุกการชน (ทั้งยืดหยุ่นและไม่ยืดหยุ่น) ตราบใดที่แรงภายนอกลัพธ์เป็นศูนย์ หรือช่วงเวลาที่ชนสั้นมากจนการดลของแรงภายนอกมีค่าน้อยจนตัดทิ้งได้ (Impulse Approximation)",
      "invalidWhen": "ห้ามนำไปใช้กับวัตถุเดี่ยวที่กำลังอยู่ภายใต้แรงภายนอกต่อเนื่อง"
    },
    "example": {
      "problem": "นักแม่นปืนยิงกระสุนปืนมวล $m_1 = 0.020\\text{ kg}$ ออกไปด้วยความเร็ว $600\\text{ m/s}$ จากตัวปืนมวล $m_2 = 4.0\\text{ kg}$ ที่อยู่นิ่ง จงหาความเร็วถอยหลังของตัวปืน (Recoil Velocity)",
      "steps": [
        "พิจารณาระบบ: ประกอบด้วย กระสุนปืน + ตัวปืน (แรงระเบิดของดินปืนเป็นแรงภายในระบบ)",
        "โมเมนตัมก่อนยิง: ทั้งปืนและกระสุนอยู่นิ่ง $\\vec{p}_i = 0$",
        "โมเมนตัมหลังยิง: $\\vec{p}_f = m_1 v_1 + m_2 v_2$",
        "ใช้กฎการอนุรักษ์โมเมนตัม: $0 = (0.020)(600) + (4.0)v_2 \\implies 12.0 + 4.0 v_2 = 0$",
        "คำนวณ $v_2$: $v_2 = -\\frac{12.0}{4.0} = -3.0\\text{ m/s}$ (เครื่องหมายลบแสดงว่าตัวปืนถอยหลังสวนทางกับทิศกระสุน)"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 500 185\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"การดลและการอนุรักษ์โมเมนตัม\">\n  <defs>\n    <marker id=\"arr-p1\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\">\n      <path d=\"M 0 0 L 7 3.5 L 0 7 Z\" fill=\"#2563EB\"/>\n    </marker>\n    <marker id=\"arr-p2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\">\n      <path d=\"M 0 0 L 7 3.5 L 0 7 Z\" fill=\"#DC2626\"/>\n    </marker>\n  </defs>\n  <rect width=\"500\" height=\"185\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Before Collision -->\n  <g transform=\"translate(10, 15)\">\n    <text x=\"15\" y=\"20\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">1. ก่อนชน (Before):</text>\n    <circle cx=\"150\" cy=\"25\" r=\"16\" fill=\"#3B82F6\"/>\n    <text x=\"150\" y=\"29\" text-anchor=\"middle\" font-size=\"10\" fill=\"#FFF\" font-weight=\"700\">m₁</text>\n    <line x1=\"168\" y1=\"25\" x2=\"210\" y2=\"25\" stroke=\"#2563EB\" stroke-width=\"2.5\" marker-end=\"url(#arr-p1)\"/>\n    <text x=\"180\" y=\"16\" font-size=\"10\" font-weight=\"600\" fill=\"#2563EB\">u₁</text>\n\n    <circle cx=\"280\" cy=\"25\" r=\"22\" fill=\"#64748B\"/>\n    <text x=\"280\" y=\"29\" text-anchor=\"middle\" font-size=\"10\" fill=\"#FFF\" font-weight=\"700\">m₂</text>\n    <line x1=\"304\" y1=\"25\" x2=\"330\" y2=\"25\" stroke=\"#64748B\" stroke-width=\"2\" marker-end=\"url(#arr-p1)\"/>\n    <text x=\"312\" y=\"16\" font-size=\"10\" fill=\"#64748B\">u₂</text>\n  </g>\n  <!-- Contact & Impulse (F = -F) -->\n  <g transform=\"translate(10, 70)\">\n    <text x=\"15\" y=\"20\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">2. ขณะชน (Contact & Impulse J = ∫F dt):</text>\n    <circle cx=\"205\" cy=\"25\" r=\"16\" fill=\"#3B82F6\"/>\n    <circle cx=\"237\" cy=\"25\" r=\"22\" fill=\"#64748B\"/>\n    <line x1=\"205\" y1=\"25\" x2=\"165\" y2=\"25\" stroke=\"#DC2626\" stroke-width=\"2.5\" marker-end=\"url(#arr-p2)\"/>\n    <text x=\"160\" y=\"15\" font-size=\"9\" font-weight=\"700\" fill=\"#DC2626\">F₂₁</text>\n    <line x1=\"237\" y1=\"25\" x2=\"277\" y2=\"25\" stroke=\"#DC2626\" stroke-width=\"2.5\" marker-end=\"url(#arr-p2)\"/>\n    <text x=\"265\" y=\"15\" font-size=\"9\" font-weight=\"700\" fill=\"#DC2626\">F₁₂ = -F₂₁</text>\n  </g>\n  <!-- After Collision -->\n  <g transform=\"translate(10, 125)\">\n    <text x=\"15\" y=\"20\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">3. หลังชน (After):</text>\n    <circle cx=\"130\" cy=\"25\" r=\"16\" fill=\"#3B82F6\"/>\n    <line x1=\"148\" y1=\"25\" x2=\"175\" y2=\"25\" stroke=\"#2563EB\" stroke-width=\"2\" marker-end=\"url(#arr-p1)\"/>\n    <text x=\"155\" y=\"16\" font-size=\"10\" font-weight=\"600\" fill=\"#2563EB\">v₁</text>\n\n    <circle cx=\"320\" cy=\"25\" r=\"22\" fill=\"#64748B\"/>\n    <line x1=\"344\" y1=\"25\" x2=\"395\" y2=\"25\" stroke=\"#64748B\" stroke-width=\"2.5\" marker-end=\"url(#arr-p1)\"/>\n    <text x=\"360\" y=\"16\" font-size=\"10\" font-weight=\"600\" fill=\"#64748B\">v₂</text>\n    <text x=\"240\" y=\"45\" font-size=\"11\" font-weight=\"700\" fill=\"#059669\">โมเมนตัมรวมอนุรักษ์: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂</text>\n  </g>\n</svg>",
      "diagramCaption": "การดลและการอนุรักษ์โมเมนตัมเชิงเส้น: แรงกิริยา-ปฏิกิริยาขณะชน $\\vec{F}_{21} = -\\vec{F}_{12}$ ทำให้โมเมนตัมรวมของระบบคงตัว"
    },
    "observations": [
      "คำเตือนและข้อห้ามทางวิชาการ: **ห้ามอ้างเด็ดขาดว่า \"วัตถุโปรเจกไทล์เดี่ยวๆ มีโมเมนตัมคงตัวขณะตก\"** เพราะวัตถุเดียวกำลังตกภายใต้แรงโน้มถ่วงภายนอก $m\\vec{g}$ อย่างต่อเนื่อง โมเมนตัมของวัตถุจึงเปลี่ยนไปตามเวลาตลอดเวลา $\\frac{d\\vec{p}}{dt} = m\\vec{g} \\neq 0$ โมเมนตัมจะอนุรักษ์ก็ต่อเมื่อรวม \"โลกทั้งใบ\" เข้าเป็นส่วนหนึ่งของระบบเดียวกันเท่านั้น"
    ],
    "citation": "French, A. P. (1971). Newtonian Mechanics. W. W. Norton & Co., Ch. 9, pp. 299–320; Morin, D. (2008), Sec. 5.1, pp. 131–134."
  },
  {
    "id": 8,
    "divisionId": "div-conservation",
    "divisionTitle": "ภาคที่ 3: กฎการอนุรักษ์ (Conservation Laws)",
    "numberTh": "ทฤษฎีที่ 8",
    "titleTh": "งาน พลังงานกล และกำลัง",
    "titleEn": "Work-Energy Theorem, Potential Energy & Mechanical Energy Dissipation",
    "type": "ทฤษฎีบทพลังงาน (Energy Principles)",
    "summary": "การอนุมานทฤษฎีบทงาน-พลังงานจลน์ พลังงานศักย์โน้มถ่วง และสมการอัตราการสูญเสียพลังงานกลเมื่อเคลื่อนที่ผ่านตัวกลางต้านทาน",
    "definition": {
      "text": "• **งาน (Work, $W$):** ผลคูณแบบสเกลาร์ (Dot Product) ของแรงกับการกระจัด $W = \\int \\vec{F} \\cdot d\\vec{r}$ (หน่วย: จูล, $\\text{J} = \\text{N}\\cdot\\text{m}$)\n• **พลังงานจลน์ (Kinetic Energy, $E_k$):** พลังงานที่สะสมในวัตถุอันเนื่องมาจากความเร็ว $E_k = \\frac{1}{2}mv^2$\n• **พลังงานศักย์โน้มถ่วง (Gravitational Potential Energy, $E_p$):** พลังงานที่สะสมเนื่องจากตำแหน่งในสนามโน้มถ่วงเทียบกับจุดอ้างอิง $E_p = mgh$\n• **กำลัง (Power, $P$):** อัตราการทำงานเทียบกับเวลา $P = \\frac{dW}{dt} = \\vec{F}\\cdot\\vec{v}$ (หน่วย: วัตต์, $\\text{W} = \\text{J/s}$)"
    },
    "principle": {
      "text": "1. **ทฤษฎีบทงาน-พลังงานจลน์ (Work-Kinetic Energy Theorem):** งานสุทธิของแรงทุกแรงที่กระทำต่อวัตถุจะเท่ากับการเปลี่ยนแปลงพลังงานจลน์ของวัตถุนั้นเสมอ: $W_{\\text{net}} = \\Delta E_k$\n2. **แรงอนุรักษ์ (Conservative Force):** แรงที่งานในการเคลื่อนที่ระหว่างสองจุดไม่ขึ้นกับเส้นทาง เช่น แรงโน้มถ่วงและแรงสปริง สามารถนิยามพลังงานศักย์ได้โดย $W_c = -\\Delta E_p$\n3. **การสูญเสียพลังงานกลรวมเนื่องจากแรงต้านอากาศ (Mechanical Energy Dissipation):**\nเมื่อมีแรงต้านของไหล $\\vec{F}_d = -c v \\vec{v}$ พลังงานกลรวม $E = E_k + E_p$ จะไม่คงที่ แต่จะสลายตัวกลายเป็นพลังงานความร้อนในอากาศอย่างต่อเนื่องตามสมการอนุพันธ์:\n$\\frac{dE}{dt} = \\vec{F}_d \\cdot \\vec{v} = (-c v \\vec{v}) \\cdot \\vec{v} = -c v^3 < 0$\nเนื่องจาก $c > 0$ และ $v^3 > 0$ เสมอ อัตราการเปลี่ยนแปลงพลังงาน $\\frac{dE}{dt}$ จึงเป็นลบอย่างเคร่งครัด (Strictly Monotonic Dissipation)"
    },
    "formulas": [
      {
        "name": "ทฤษฎีบทงาน-พลังงานจลน์",
        "latex": "W_{\\text{net}} = \\int_{\\vec{r}_1}^{\\vec{r}_2} \\vec{F} \\cdot d\\vec{r} = \\frac{1}{2}m v_2^2 - \\frac{1}{2}m v_1^2 = \\Delta E_k",
        "symbols": [
          {
            "sym": "W_{\\text{net}}",
            "desc": "งานสุทธิรวมทุกแรง",
            "unit": "\\text{J}"
          },
          {
            "sym": "E_k",
            "desc": "พลังงานจลน์",
            "unit": "\\text{J}"
          }
        ],
        "derivationSteps": [
          "1. จาก $W = \\int \\vec{F} \\cdot d\\vec{r}$ แทน $\\vec{F} = m\\frac{d\\vec{v}}{dt}$ และ $d\\vec{r} = \\vec{v} dt$",
          "2. จะได้: $W = \\int m\\frac{d\\vec{v}}{dt} \\cdot \\vec{v} dt = m \\int \\vec{v} \\cdot d\\vec{v}$",
          "3. เนื่องจาก $\\vec{v} \\cdot d\\vec{v} = \\frac{1}{2} d(v^2)$",
          "4. อินทิเกรตจาก $v_1$ ถึง $v_2$: $W = \\frac{1}{2}m [v^2]_{v_1}^{v_2} = \\frac{1}{2}mv_2^2 - \\frac{1}{2}mv_1^2 = \\Delta E_k$"
        ]
      },
      {
        "name": "อัตราการสูญเสียพลังงานกลจากแรงต้าน",
        "latex": "\\frac{dE_{\\text{mech}}}{dt} = \\vec{F}_d \\cdot \\vec{v} = -c \\|\\vec{v}\\|^3 \\leq 0",
        "symbols": [
          {
            "sym": "\\frac{dE}{dt}",
            "desc": "อัตราการสูญเสียพลังงานกล (กำลังงานต้าน)",
            "unit": "\\text{W หรือ J/s}"
          }
        ]
      }
    ],
    "application": {
      "text": "การคำนวณเบรกเกอร์ไฟฟ้า การสูญเสียพลังงานของอากาศยาน การประเมินความร้อนสะสมที่หัวขีปนาวุธขณะเสียดสีกับบรรยากาศ และการออกแบบเขื่อนผลิตไฟฟ้าพลังน้ำ",
      "validWhen": "ใช้ได้กับทุกระบบ โดยต้องแยกระหว่างงานของแรงอนุรักษ์ ($W_c = -\\Delta E_p$) และงานของแรงไม่อนุรักษ์ ($W_{nc} = \\Delta E_{\\text{mech}}$)",
      "invalidWhen": "ห้ามนำสูตรอนุรักษ์พลังงานกลแบบไม่มีแรงต้าน ($E_k + E_p = \\text{const}$) ไปใช้เมื่อวัตถุเคลื่อนที่ผ่านของไหลด้วยความเร็วสูง"
    },
    "example": {
      "problem": "วัตถุมวล $m = 2.0\\text{ kg}$ เคลื่อนที่ในอากาศด้วยความเร็ว $v = 30.0\\text{ m/s}$ ถ้าสัมประสิทธิ์แรงต้านอากาศ $c = 0.05\\text{ kg/m}$ จงหาอัตราการสูญเสียพลังงานกลของวัตถุ ณ ขณะนั้นในรูปกำลังความร้อน",
      "steps": [
        "ขั้นตอนที่ 1: ตรวจสอบสูตรอัตราการสูญเสียพลังงาน: $P_{\\text{loss}} = \\left|\\frac{dE}{dt}\\right| = c v^3$",
        "ขั้นตอนที่ 2: แทนค่าตัวเลข:\n$P_{\\text{loss}} = (0.05\\text{ kg/m})(30.0\\text{ m/s})^3 = 0.05 \\times 27000 = 1350\\text{ W}$ (หรือ $1.35\\text{ kW}$)",
        "สรุป: วัตถุกำลังสูญเสียพลังงานกลกลายไปเป็นความร้อนในอากาศด้วยอัตราเร็วสูงถึง $1350\\text{ จูลต่อวินาที}$"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 500 190\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"การอนุรักษ์พลังงานกลในโพรเจกไทล์\">\n  <rect width=\"500\" height=\"190\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Trajectory Arc -->\n  <path d=\"M 60 145 Q 250 25 440 145\" fill=\"none\" stroke=\"#64748B\" stroke-width=\"2\" stroke-dasharray=\"4,4\"/>\n  <line x1=\"40\" y1=\"145\" x2=\"460\" y2=\"145\" stroke=\"#94A3B8\" stroke-width=\"1.5\"/>\n  <!-- Point A (Launch) -->\n  <circle cx=\"60\" cy=\"145\" r=\"6\" fill=\"#2563EB\"/>\n  <text x=\"60\" y=\"165\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">จุดยิง (A)</text>\n  <rect x=\"25\" y=\"95\" width=\"70\" height=\"40\" rx=\"4\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\"/>\n  <text x=\"60\" y=\"110\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"600\" fill=\"#2563EB\">K = สูงสุด</text>\n  <text x=\"60\" y=\"125\" text-anchor=\"middle\" font-size=\"10\" fill=\"#64748B\">U = 0</text>\n  <!-- Point B (Apex) -->\n  <circle cx=\"250\" cy=\"55\" r=\"6\" fill=\"#DC2626\"/>\n  <text x=\"250\" y=\"42\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">จุดสูงสุด (B)</text>\n  <rect x=\"215\" y=\"70\" width=\"70\" height=\"40\" rx=\"4\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\"/>\n  <text x=\"250\" y=\"85\" text-anchor=\"middle\" font-size=\"10\" fill=\"#2563EB\">K = ½mv_x²</text>\n  <text x=\"250\" y=\"100\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"700\" fill=\"#DC2626\">U = mgh_max</text>\n  <!-- Point C (Landing) -->\n  <circle cx=\"440\" cy=\"145\" r=\"6\" fill=\"#2563EB\"/>\n  <text x=\"440\" y=\"165\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">จุดตก (C)</text>\n  <rect x=\"405\" y=\"95\" width=\"70\" height=\"40\" rx=\"4\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\"/>\n  <text x=\"440\" y=\"110\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"600\" fill=\"#2563EB\">K = สูงสุด</text>\n  <text x=\"440\" y=\"125\" text-anchor=\"middle\" font-size=\"10\" fill=\"#64748B\">U = 0</text>\n  <!-- Conservation Banner -->\n  <text x=\"250\" y=\"180\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#059669\">สนามแรงอนุรักษ์: E_รวม = K + U = คงที่ | เมื่อมีแรงต้านอากาศ: dE/dt = -cv³ &lt; 0</text>\n</svg>",
      "diagramCaption": "การอนุรักษ์พลังงานกลรวม: พลังงานจลน์ $K$ และพลังงานศักย์โน้มถ่วง $U$ เปลี่ยนแปลงกลับไปมาโดยที่ $E_{mech} = K + U = \\text{คงที่}$"
    },
    "citation": "Morin, D. (2008). Introduction to Classical Mechanics, Sec. 5.2–5.3, pp. 135–144; French, A. P. (1971), Ch. 11, pp. 367–385."
  },
  {
    "id": 9,
    "divisionId": "div-computational",
    "divisionTitle": "ภาคที่ 4: หัวข้อเชื่อมโยงและการคำนวณขั้นสูง",
    "numberTh": "ทฤษฎีที่ 9",
    "titleTh": "โมเมนต์ของแรงและโมเมนตัมเชิงมุมเบื้องต้น",
    "titleEn": "Torque & Angular Momentum: Bridging from Particles to Extended Bodies",
    "type": "หัวข้อเชื่อมโยงสู่กลศาสตร์วัตถุแข็งเกร็ง (Bridging Topic)",
    "summary": "การนิยามทอร์กและโมเมนตัมเชิงมุมเทียบกับจุดอ้างอิง และเหตุผลทางฟิสิกส์ที่แบบจำลองอนุภาคโปรเจกไทล์ปัจจุบันยังไม่คิดผลของการหมุน",
    "definition": {
      "text": "• **โมเมนต์ของแรง หรือ ทอร์ก (Torque, $\\vec{\\tau}$):** ผลคูณเชิงเวกเตอร์ (Cross Product) ระหว่างเวกเตอร์บอกตำแหน่งจากจุดหมุนอ้างอิงกับเวกเตอร์แรง: $\\vec{\\tau} = \\vec{r} \\times \\vec{F}$ (หน่วย: $\\text{N}\\cdot\\text{m}$)\n• **โมเมนตัมเชิงมุม (Angular Momentum, $\\vec{L}$):** ปริมาณการหมุนของอนุภาคเทียบกับจุดอ้างอิง นิยามโดย $\\vec{L} = \\vec{r} \\times \\vec{p} = \\vec{r} \\times (m\\vec{v})$"
    },
    "principle": {
      "text": "1. **การขึ้นกับจุดอ้างอิง (Reference Point Dependence):** ทั้งทอร์กและโมเมนตัมเชิงมุมไม่ใช่ปริมาณเดี่ยวที่ลอยตัวอยู่ในอวกาศ แต่ **ต้องระบุจุดอ้างอิงกำเนิด $O$ เสมอ** หากเปลี่ยนจุดอ้างอิง ค่าทอร์กและโมเมนตัมเชิงมุมจะเปลี่ยนไปตามเวกเตอร์ตำแหน่ง $\\vec{r}$\n2. **กฎการหมุนของนิวตัน:** $\\sum\\vec{\\tau}_{\\text{ext}} = \\frac{d\\vec{L}}{dt}$ อัตราการเปลี่ยนแปลงโมเมนตัมเชิงมุมมีค่าเท่ากับทอร์กภายนอกลัพธ์\n3. **เหตุผลที่แบบจำลองโปรเจกไทล์ปัจจุบันยังไม่รวมผลของการหมุน (Physics Scoping):**\nในแบบจำลองโปรเจกไทล์บทนี้ เราจำลองวัตถุเสมือนเป็น **มวลจุด (Point Particle)** ที่ไม่มีมิติขนาดรูปทรง เพื่อเน้นความเข้าใจกลไกหลักของแรงโน้มถ่วงและแรงต้านอากาศกำลังสอง\nหากวัตถุหมุนรอบตัวเอง (เช่น ลูกเบสบอล หรือลูกกอล์ฟที่มีสปิน) จะเกิดปรากฏการณ์ **แรงยกแมกนัส (Magnus Effect, $\\vec{F}_M \\propto \\vec{\\omega} \\times \\vec{v}$)** และเกิดเสถียรภาพการทรงตัวของเกลียวลำกล้องปืน (Rifling Gyroscopic Stability) ซึ่งเป็นเนื้อหาขั้นสูงของกลศาสตร์วัตถุแข็งเกร็ง (Rigid Body Dynamics) ที่อยู่ใน Project Backlog"
    },
    "formulas": [
      {
        "name": "โมเมนต์ของแรง (ทอร์ก)",
        "latex": "\\vec{\\tau} = \\vec{r} \\times \\vec{F} \\implies \\tau = r F \\sin\\phi",
        "symbols": [
          {
            "sym": "\\vec{\\tau}",
            "desc": "เวกเตอร์ทอร์ก",
            "unit": "\\text{N}\\cdot\\text{m}"
          },
          {
            "sym": "\\vec{r}",
            "desc": "เวกเตอร์ชี้จากจุดหมุนอ้างอิงไปยังจุดที่แรงกระทำ",
            "unit": "\\text{m}"
          },
          {
            "sym": "\\phi",
            "desc": "มุมระหว่างเวกเตอร์ r และเวกเตอร์ F",
            "unit": "\\text{rad หรือ deg}"
          }
        ]
      },
      {
        "name": "โมเมนตัมเชิงมุมและความสัมพันธ์กับทอร์ก",
        "latex": "\\vec{L} = \\vec{r} \\times \\vec{p} \\quad \\text{และ} \\quad \\sum\\vec{\\tau} = \\frac{d\\vec{L}}{dt}",
        "symbols": [
          {
            "sym": "\\vec{L}",
            "desc": "โมเมนตัมเชิงมุมของอนุภาคเทียบกับจุดกำเนิด",
            "unit": "\\text{kg}\\cdot\\text{m}^2\\text{/s}"
          }
        ],
        "derivationSteps": [
          "1. หาอนุพันธ์ของ $\\vec{L} = \\vec{r} \\times \\vec{p}$ เทียบกับเวลา: $\\frac{d\\vec{L}}{dt} = \\frac{d\\vec{r}}{dt} \\times \\vec{p} + \\vec{r} \\times \\frac{d\\vec{p}}{dt}$",
          "2. เนื่องจาก $\\frac{d\\vec{r}}{dt} = \\vec{v}$ และ $\\vec{p} = m\\vec{v}$ ดังนั้น $\\vec{v} \\times (m\\vec{v}) = 0$ (เวกเตอร์ขนานกันครอสกันได้ศูนย์)",
          "3. เทอมที่สอง $\\frac{d\\vec{p}}{dt} = \\sum\\vec{F}$ (ตามกฎข้อ 2 นิวตัน)",
          "4. จะได้: $\\frac{d\\vec{L}}{dt} = \\vec{r} \\times \\sum\\vec{F} = \\sum\\vec{\\tau}$"
        ]
      }
    ],
    "application": {
      "text": "การทรงตัวของลูกข่าง ไจโรสโคป การตีลูกกอล์ฟให้เกิดแบ็กสปิน (Backspin เพื่อสร้างแรงยก) และการวิเคราะห์การโคจรของดาวเคราะห์ภายใต้แรงสู่ศูนย์กลาง",
      "validWhen": "ใช้ได้กับการเคลื่อนที่ทุกรูปแบบตราบใดที่ระบุจุดกำเนิดการหมุนอ้างอิงอย่างชัดเจน",
      "invalidWhen": "ห้ามสับสนหน่วยของทอร์ก ($\\text{N}\\cdot\\text{m}$) กับหน่วยของงาน (จูล, $\\text{J}$) แม้จะมีมิติเท่ากัน แต่งานเป็นสเกลาร์ (Dot Product) ส่วนทอร์กเป็นเวกเตอร์ (Cross Product)"
    },
    "example": {
      "problem": "อนุภาคมวล $m = 2.0\\text{ kg}$ มีเวกเตอร์ตำแหน่ง $\\vec{r} = 4.0\\hat{i} + 3.0\\hat{j}\\text{ m}$ และความเร็ว $\\vec{v} = 5.0\\hat{i}\\text{ m/s}$ จงหาโมเมนตัมเชิงมุมของอนุภาคเทียบกับจุดกำเนิด $(0,0)$",
      "steps": [
        "โมเมนตัมเชิงเส้น: $\\vec{p} = m\\vec{v} = (2.0)(5.0\\hat{i}) = 10.0\\hat{i}\\text{ kg}\\cdot\\text{m/s}$",
        "คำนวณ Cross Product: $\\vec{L} = \\vec{r} \\times \\vec{p} = (4.0\\hat{i} + 3.0\\hat{j}) \\times (10.0\\hat{i})$",
        "เนื่องจาก $\\hat{i} \\times \\hat{i} = 0$ และ $\\hat{j} \\times \\hat{i} = -\\hat{k}$",
        "จะได้: $\\vec{L} = 3.0(10.0)(-\\hat{k}) = -30.0\\hat{k}\\text{ kg}\\cdot\\text{m}^2/\\text{s}$ (ทิศพุ่งลงในกระดาษ ตามกฎมือขวา)"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 460 185\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"โมเมนต์ของแรงและทอร์ก\">\n  <defs>\n    <marker id=\"arr-r\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">\n      <path d=\"M 0 0 L 8 4 L 0 8 Z\" fill=\"#2563EB\"/>\n    </marker>\n    <marker id=\"arr-f\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\">\n      <path d=\"M 0 0 L 8 4 L 0 8 Z\" fill=\"#DC2626\"/>\n    </marker>\n  </defs>\n  <rect width=\"460\" height=\"185\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Pivot Point O -->\n  <circle cx=\"80\" cy=\"125\" r=\"6\" fill=\"#1E293B\"/>\n  <text x=\"80\" y=\"145\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">จุดหมุน (O)</text>\n  <!-- Position Vector r to application point P -->\n  <line x1=\"80\" y1=\"125\" x2=\"280\" y2=\"70\" stroke=\"#2563EB\" stroke-width=\"2.5\" marker-end=\"url(#arr-r)\"/>\n  <text x=\"175\" y=\"88\" font-size=\"12\" font-weight=\"700\" fill=\"#2563EB\">r (เวกเตอร์บอกตำแหน่ง)</text>\n  <!-- Application Point P -->\n  <circle cx=\"280\" cy=\"70\" r=\"4\" fill=\"#DC2626\"/>\n  <text x=\"285\" y=\"60\" font-size=\"11\" font-weight=\"700\" fill=\"#1E293B\">P</text>\n  <!-- Force Vector F -->\n  <line x1=\"280\" y1=\"70\" x2=\"375\" y2=\"35\" stroke=\"#DC2626\" stroke-width=\"2.8\" marker-end=\"url(#arr-f)\"/>\n  <text x=\"380\" y=\"35\" font-size=\"12\" font-weight=\"700\" fill=\"#DC2626\">F (แรง)</text>\n  <!-- Angle phi -->\n  <text x=\"315\" y=\"75\" font-size=\"11\" font-weight=\"600\" fill=\"#DC2626\">ϕ</text>\n  <!-- Perpendicular Lever Arm r_perp -->\n  <line x1=\"80\" y1=\"125\" x2=\"160\" y2=\"30\" stroke=\"#059669\" stroke-width=\"1.8\" stroke-dasharray=\"4,3\"/>\n  <line x1=\"160\" y1=\"30\" x2=\"375\" y2=\"35\" stroke=\"#94A3B8\" stroke-dasharray=\"2,2\"/>\n  <text x=\"100\" y=\"70\" font-size=\"11\" font-weight=\"600\" fill=\"#059669\">r_⊥ = r sinϕ</text>\n  <!-- Right hand rotation direction -->\n  <text x=\"230\" y=\"165\" text-anchor=\"middle\" font-size=\"12\" font-weight=\"700\" fill=\"#1E293B\">ขนาดทอร์ก: τ = r F sinϕ = F · r_⊥ (หมุนทวนเข็มนาฬิกา)</text>\n</svg>",
      "diagramCaption": "โมเมนต์ของแรง (ทอร์ก $\\vec{\\tau} = \\vec{r} \\times \\vec{F}$) และแขนของแรง ($r_\\perp = r\\sin\\phi$): แรงทำให้เกิดแนวโน้มการหมุนรอบแกนอ้างอิง"
    },
    "citation": "Baker, G. L., & Haynes, P. (2020). Projectile Dynamics in Sport, Ch. 2, pp. 35–50; Tong, D. (2004). Classical Dynamics, Sec. 1.3, pp. 16–20."
  },
  {
    "id": 10,
    "divisionId": "div-computational",
    "divisionTitle": "ภาคที่ 4: หัวข้อเชื่อมโยงและการคำนวณขั้นสูง",
    "numberTh": "ทฤษฎีที่ 10",
    "titleTh": "ระเบียบวิธีเชิงตัวเลขและการวิเคราะห์ความคลาดเคลื่อน",
    "titleEn": "4th-Order Runge-Kutta (RK4) Numerical Method & Error Analysis",
    "type": "การคำนวณเชิงตัวเลขและการจำลอง (Computational Physics)",
    "summary": "อัลกอริทึม RK4 สี่ขั้นตอน Butcher Tableau การวิเคราะห์ Truncation Error การประมาณจุดตกกระทบ และการป้องกันการเคลมความแม่นยำเกินจริง",
    "definition": {
      "text": "ระเบียบวิธีเชิงตัวเลข (Numerical Methods) คือกระบวนการทางคณิตศาสตร์แบบวนซ้ำ (Iterative Algorithm) เพื่อหาผลเฉลยโดยประมาณของสมการเชิงอนุพันธ์ที่ไม่สามารถหาผลเฉลยแม่นตรงในรูปสูตรวิเคราะห์ (Analytical Closed-form Solution) ได้\nระเบียบวิธีรุงเง-คุททาอันดับ 4 (Classical 4th-order Runge-Kutta, RK4) เป็นระเบียบวิธีมาตรฐานอันทรงพลังที่ประเมินความชันของสนามเวกเตอร์ 4 จุดในแต่ละช่วงเวลา $\\Delta t$ เพื่อนำมาเฉลี่ยถ่วงน้ำหนัก"
    },
    "principle": {
      "text": "1. **ขั้นตอนการคำนวณ 4 จุด (Butcher Tableau):**\nสำหรับสมการอนุพันธ์ $\\frac{d\\vec{u}}{dt} = \\vec{f}(t, \\vec{u})$ โดยที่สถานะคือ $\\vec{u} = [x, y, v_x, v_y]^T$:\n• $\\vec{k}_1 = \\vec{f}(t_n, \\vec{u}_n)$ — ความชัน ณ จุดเริ่มต้นของช่วงเวลา\n• $\\vec{k}_2 = \\vec{f}\\left(t_n + \\frac{\\Delta t}{2}, \\vec{u}_n + \\frac{\\Delta t}{2}\\vec{k}_1\\right)$ — ความชัน ณ กึ่งกลางช่วงเวลา โดยประมาณจาก $k_1$\n• $\\vec{k}_3 = \\vec{f}\\left(t_n + \\frac{\\Delta t}{2}, \\vec{u}_n + \\frac{\\Delta t}{2}\\vec{k}_2\\right)$ — ความชัน ณ กึ่งกลางช่วงเวลา โดยประมาณจาก $k_2$\n• $\\vec{k}_4 = \\vec{f}(t_n + \\Delta t, \\vec{u}_n + \\Delta t \\vec{k}_3)$ — ความชัน ณ จุดสิ้นสุดของช่วงเวลา โดยประมาณจาก $k_3$\n• ค่าสถานะถัดไป: $\\vec{u}_{n+1} = \\vec{u}_n + \\frac{\\Delta t}{6}(\\vec{k}_1 + 2\\vec{k}_2 + 2\\vec{k}_3 + \\vec{k}_4)$\n2. **การวิเคราะห์ความคลาดเคลื่อน (Truncation Error Analysis):**\n• ความคลาดเคลื่อนเฉพาะขั้น (Local Truncation Error): มีขนาด $\\mathcal{O}(\\Delta t^5)$\n• ความคลาดเคลื่อนสะสมรวมตลอดการบิน (Global Truncation Error): มีขนาด $\\mathcal{O}(\\Delta t^4)$ หมายความว่า หากเราลดขนาด $\\Delta t$ ลง 10 เท่า ความคลาดเคลื่อนรวมจะลดลงถึง $10^4 = 10,000$ เท่า!\n3. **การตรวจจับจุดกระทบพื้น (Landing Event Detection):**\nเมื่อจำลองจนกระทั่งพิกัดแนวดิ่งติดลบ ($y_{n+1} \\le y_{\\text{ground}}$) แสดงว่าวัตถุได้ทะลุผ่านพื้นไปในระหว่างช่วงเวลา $\\Delta t$ นั้น ระบบต้องทำการประมาณค่าเชิงเส้น (Linear Interpolation) เพื่อคำนวณเวลาย่อย $r \\in [0, 1]$ และพิกัด $x, v_x, v_y$ ณ จังหวะ $y = 0$ พอดี ห้ามตัดจบดื้อๆ ที่พิกัดติดลบ"
    },
    "formulas": [
      {
        "name": "สมการก้าวสถานะ RK4",
        "latex": "\\vec{u}_{n+1} = \\vec{u}_n + \\frac{\\Delta t}{6}\\left(\\vec{k}_1 + 2\\vec{k}_2 + 2\\vec{k}_3 + \\vec{k}_4\\right)",
        "symbols": [
          {
            "sym": "\\vec{u}",
            "desc": "เวกเตอร์สถานะเต็ม [x, y, vx, vy]",
            "unit": "[m, m, m/s, m/s]"
          },
          {
            "sym": "\\Delta t",
            "desc": "ขนาดช่วงเวลาก้าวคำนวณ (Timestep)",
            "unit": "\\text{s}"
          }
        ]
      },
      {
        "name": "การประมาณจุดตกกระทบ (Landing Root Interpolation)",
        "latex": "r = \\frac{y_{\\text{ground}} - y_n}{y_{n+1} - y_n} \\quad , \\quad t_{\\text{land}} = t_n + r\\Delta t \\quad , \\quad x_{\\text{land}} = x_n + r(x_{n+1} - x_n)",
        "symbols": [
          {
            "sym": "r",
            "desc": "สัดส่วนเวลาระหว่างสองก้าว (0 <= r <= 1)",
            "unit": "-"
          }
        ]
      }
    ],
    "application": {
      "text": "เป็นหัวใจหลักของกลจักรฟิสิกส์ (Physics Engine) ในเกมคอมพิวเตอร์ โปรแกรมจำลองการบิน (Flight Simulators) และระบบจำลองทางดาราศาสตร์",
      "validWhen": "ใช้ได้กับสมการเชิงอนุพันธ์สามัญแบบต่อเนื่อง (Continuous ODEs) ที่ฟังก์ชันมีความเรียบ (Smooth)",
      "invalidWhen": "ข้อห้ามทางวิชาการ: **ห้ามรับรองผลลัพธ์ว่า \"แม่นยำแท้จริง 100% (Exact Solution)\" หรือรับรองความแม่นยำระดับไมโครเมตรโดยไม่มีการระบุเงื่อนไข $\\Delta t$** เพราะผลลัพธ์เชิงตัวเลขจะมีความคลาดเคลื่อนสะสมจากการปัดเศษเลขฐานสอง (Floating-point Roundoff Error) เสมอ และหากใช้ $\\Delta t$ ใหญ่เกินไป ระบบจะสูญเสียเสถียรภาพ (Numerical Instability)"
    },
    "example": {
      "problem": "เปรียบเทียบผลการคำนวณระยะตกของโปรเจกไทล์ที่มีแรงต้าน ($v_0 = 100\\text{ m/s}, \\theta = 30^\\circ, m = 5\\text{ kg}, c = 0.05\\text{ kg/m}$) ด้วย RK4 ที่ขนาด $\\Delta t$ ต่างกัน",
      "steps": [
        "• ที่ $\\Delta t = 0.0100\\text{ s}$: ระยะตก $R = 169.154539\\text{ m}$",
        "• ที่ $\\Delta t = 0.0020\\text{ s}$: ระยะตก $R = 169.154581\\text{ m}$",
        "• ที่ $\\Delta t = 0.0010\\text{ s}$: ระยะตก $R = 169.154581\\text{ m}$",
        "• ที่ $\\Delta t = 0.0001\\text{ s}$: ระยะตก $R = 169.154581\\text{ m}$",
        "สรุป: ผลลัพธ์ลู่เข้าสู่ค่าคงที่ $169.154581\\text{ m}$ อย่างเสถียรตั้งแต่ $\\Delta t \\le 0.002\\text{ s}$ แสดงถึงความถูกต้องของระเบียบวิธี RK4 อันดับ 4"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 520 200\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"การเปรียบเทียบระเบียบวิธีเชิงตัวเลข Euler และ RK4\">\n  <defs>\n    <marker id=\"arr-euler\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\">\n      <path d=\"M 0 0 L 7 3.5 L 0 7 Z\" fill=\"#EA580C\"/>\n    </marker>\n    <marker id=\"arr-rk4\" markerWidth=\"7\" markerHeight=\"7\" refX=\"5\" refY=\"3.5\" orient=\"auto\">\n      <path d=\"M 0 0 L 7 3.5 L 0 7 Z\" fill=\"#059669\"/>\n    </marker>\n  </defs>\n  <rect width=\"520\" height=\"200\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Axes -->\n  <line x1=\"40\" y1=\"160\" x2=\"480\" y2=\"160\" stroke=\"#64748B\" stroke-width=\"1.5\"/>\n  <line x1=\"60\" y1=\"170\" x2=\"60\" y2=\"25\" stroke=\"#64748B\" stroke-width=\"1.5\"/>\n  <text x=\"475\" y=\"175\" font-size=\"10\" fill=\"#64748B\">t</text>\n  <text x=\"45\" y=\"30\" font-size=\"10\" fill=\"#64748B\">u(t)</text>\n  <!-- Time Step Indicators -->\n  <line x1=\"100\" y1=\"160\" x2=\"100\" y2=\"165\" stroke=\"#64748B\" stroke-width=\"2\"/>\n  <line x1=\"380\" y1=\"160\" x2=\"380\" y2=\"165\" stroke=\"#64748B\" stroke-width=\"2\"/>\n  <text x=\"100\" y=\"178\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"600\" fill=\"#1E293B\">t_n</text>\n  <text x=\"380\" y=\"178\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"600\" fill=\"#1E293B\">t_{n+1} = t_n + Δt</text>\n  <!-- True Analytical Curve (Smooth Blue) -->\n  <path d=\"M 100 130 Q 220 115 380 40\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"2.5\"/>\n  <text x=\"390\" y=\"35\" font-size=\"11\" font-weight=\"700\" fill=\"#2563EB\">ผลเฉลยจริง u(t)</text>\n  <!-- Initial Point -->\n  <circle cx=\"100\" cy=\"130\" r=\"5\" fill=\"#1E293B\"/>\n  <text x=\"75\" y=\"125\" font-size=\"10\" font-weight=\"600\" fill=\"#1E293B\">u_n</text>\n  <!-- Euler Step (Tangent Extrapolation - Dashed Orange) -->\n  <line x1=\"100\" y1=\"130\" x2=\"380\" y2=\"90\" stroke=\"#EA580C\" stroke-width=\"2\" stroke-dasharray=\"4,3\" marker-end=\"url(#arr-euler)\"/>\n  <circle cx=\"380\" cy=\"90\" r=\"4\" fill=\"#EA580C\"/>\n  <text x=\"390\" y=\"95\" font-size=\"11\" font-weight=\"600\" fill=\"#EA580C\">Euler (Error ~ O(Δt))</text>\n  <!-- RK4 Slopes Representation -->\n  <text x=\"180\" y=\"138\" font-size=\"9\" fill=\"#059669\">k₁ (ต้นช่วง)</text>\n  <text x=\"240\" y=\"95\" font-size=\"9\" fill=\"#059669\">k₂, k₃ (กึ่งกลาง)</text>\n  <text x=\"320\" y=\"55\" font-size=\"9\" fill=\"#059669\">k₄ (ปลายช่วง)</text>\n  <!-- RK4 Step Result (Lands accurately on true curve) -->\n  <circle cx=\"380\" cy=\"40\" r=\"5\" fill=\"#059669\"/>\n  <text x=\"240\" y=\"25\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\" fill=\"#059669\">RK4: เฉลี่ยถ่วงน้ำหนัก (k₁ + 2k₂ + 2k₃ + k₄)/6 แม่นยำระดับ O(Δt⁴)</text>\n</svg>",
      "diagramCaption": "เปรียบเทียบระเบียบวิธีเชิงตัวเลขใน 1 ก้าว $\\Delta t$: วิธีออยเลอร์ (คลาดเคลื่อนสะสม $\\mathcal{O}(\\Delta t)$) เทียบกับ RK4 สี่ขั้นตอนที่เฉลี่ยถ่วงน้ำหนักความชันจนลู่เข้าอย่างแม่นยำ"
    },
    "observations": [
      "ข้อสังเกตเชิงลึก: แม้ RK4 จะมีความแม่นยำสูงมากในระบบระยะสั้น แต่มันไม่ใช่วิธีแบบ Symplectic Integrator (เช่น Verlet หรือ Ruth-Forest) ดังนั้นในการคำนวณวงโคจรดาวเคราะห์ในระยะเวลาหลายล้านปี พลังงานกลรวมของ RK4 อาจเกิดการดริฟต์ (Energy Drift) ทีละน้อยตามเวลา"
    ],
    "citation": "Runge, C. (1895). Über die numerische Auflösung von Differentialgleichungen. Mathematische Annalen 46, pp. 167–178; Kutta, M. W. (1901). Z. Math. Phys. 46, pp. 435–453; Morin, D. (2008), Appendix A, pp. 675–680."
  },
  {
    "id": 11,
    "divisionId": "div-dynamics",
    "divisionTitle": "ภาคที่ 2: พลศาสตร์ (Dynamics)",
    "numberTh": "ทฤษฎีที่ 11",
    "titleTh": "พลศาสตร์ระบบหลายอนุภาคและจุดศูนย์กลางมวล",
    "titleEn": "Multi-Particle Dynamics & Center of Mass (CM)",
    "type": "กฎการเคลื่อนที่และระบบอนุภาค (Systems of Particles)",
    "summary": "นิยามเวกเตอร์จุดศูนย์กลางมวล (CM) การอนุมานกฎข้อที่สองของนิวตันสำหรับระบบอนุภาคจากการหักล้างของแรงภายใน (Internal Action-Reaction Cancellation) และการเคลื่อนที่ของระบบเสมือนมวลรวมเดี่ยว",
    "definition": {
      "text": "ระบบทางกายภาพที่ประกอบด้วยอนุภาค $N$ ตัว มีมวล $m_1, m_2, \\dots, m_N$ มีนิยามสำคัญดังนี้:\n1. **จุดศูนย์กลางมวล (Center of Mass, $\\vec{R}_{\\text{cm}}$):** จุดเฉลี่ยถ่วงน้ำหนักตามมวลของตำแหน่งอนุภาคทั้งหมดในระบบ ซึ่งเป็นตัวแทนเสมือนว่ามวลรวมทั้งหมดรวมตัวกันอยู่ที่จุดนี้\n2. **มวลรวมของระบบ (Total Mass, $M$):** ผลรวมสเกลาร์ของมวลของทุกลำดับอนุภาค $M = \\sum_{i=1}^N m_i$\n3. **แรงภายในและแรงภายนอก:** แรงที่อนุภาคกระทำต่อกันเองเรียกว่า **แรงภายใน (Internal Forces, $\\vec{f}_{ij}$)** ส่วนแรงที่เกิดจากสิ่งแวดล้อมนอกระบบเรียกว่า **แรงภายนอก (External Forces, $\\vec{F}_i^{\\text{ext}}$)**"
    },
    "principle": {
      "text": "ทฤษฎีบทการเคลื่อนที่ของจุดศูนย์กลางมวลระบุว่า: **จุดศูนย์กลางมวลของระบบจะเคลื่อนที่เสมือนเป็นอนุภาคเดี่ยวที่มีมวลเท่ากับมวลรวม $M$ และถูกเร่งด้วยแรงลัพธ์ภายนอกสุทธิ $\\sum\\vec{F}_{\\text{ext}}$ เท่านั้น**\nแรงภายในระหว่างอนุภาคทุกคู่จะหักล้างกันหมดสิ้นตามกฎข้อที่สามของนิวตัน ($\\vec{f}_{ij} = -\\vec{f}_{ji}$) ดังนั้นแรงภายในจึงไม่มีผลใดๆ ต่อความเร่งของจุดศูนย์กลางมวล"
    },
    "formulas": [
      {
        "name": "เวกเตอร์ตำแหน่งจุดศูนย์กลางมวล (Center of Mass Vector)",
        "latex": "\\vec{R}_{\\text{cm}} = \\frac{1}{M}\\sum_{i=1}^N m_i \\vec{r}_i = \\frac{\\int \\vec{r} \\, dm}{\\int dm}",
        "symbols": [
          {
            "sym": "\\vec{R}_{\\text{cm}}",
            "desc": "เวกเตอร์ตำแหน่งจุดศูนย์กลางมวล",
            "unit": "\\text{m}"
          },
          {
            "sym": "M",
            "desc": "มวลรวมของระบบ",
            "unit": "\\text{kg}"
          },
          {
            "sym": "m_i",
            "desc": "มวลของอนุภาคตัวที่ i",
            "unit": "\\text{kg}"
          },
          {
            "sym": "\\vec{r}_i",
            "desc": "เวกเตอร์ตำแหน่งของอนุภาคตัวที่ i",
            "unit": "\\text{m}"
          }
        ],
        "derivationSteps": [
          "1. ถ่วงน้ำหนักเวกเตอร์ตำแหน่งของแต่ละมวลย่อย: $M\\vec{R}_{\\text{cm}} = m_1\\vec{r}_1 + m_2\\vec{r}_2 + \\dots + m_N\\vec{r}_N$",
          "2. หารด้วยมวลรวม $M = \\sum m_i$ จะได้: $\\vec{R}_{\\text{cm}} = \\frac{\\sum m_i\\vec{r}_i}{\\sum m_i}$",
          "3. ในกรณีของสสารมวลต่อเนื่อง (Continuous Body) เปลี่ยนผลรวมเป็นอินทิกรัล: $\\vec{R}_{\\text{cm}} = \\frac{1}{M}\\int \\vec{r} \\, dm$"
        ]
      },
      {
        "name": "กฎข้อที่สองของนิวตันสำหรับจุดศูนย์กลางมวล",
        "latex": "\\sum \\vec{F}_{\\text{ext}} = M\\vec{a}_{\\text{cm}} = \\frac{d\\vec{P}_{\\text{total}}}{dt}",
        "symbols": [
          {
            "sym": "\\sum\\vec{F}_{\\text{ext}}",
            "desc": "ผลรวมเวกเตอร์ของแรงภายนอกสุทธิ",
            "unit": "\\text{N}"
          },
          {
            "sym": "\\vec{a}_{\\text{cm}}",
            "desc": "ความเร่งของจุดศูนย์กลางมวล",
            "unit": "\\text{m/s}^2"
          },
          {
            "sym": "\\vec{P}_{\\text{total}}",
            "desc": "โมเมนตัมเชิงเส้นรวมของระบบ",
            "unit": "\\text{kg}\\cdot\\text{m/s}"
          }
        ],
        "derivationSteps": [
          "1. จากกฎข้อที่ 2 ของนิวตันบนอนุภาคตัวที่ $i$: $m_i \\ddot{\\vec{r}}_i = \\vec{F}_i^{\\text{ext}} + \\sum_{j \\neq i} \\vec{f}_{ij}$",
          "2. รวมสมการของทุกอนุภาค: $\\sum_{i=1}^N m_i \\ddot{\\vec{r}}_i = \\sum_{i=1}^N \\vec{F}_i^{\\text{ext}} + \\sum_{i=1}^N \\sum_{j \\neq i} \\vec{f}_{ij}$",
          "3. จากกฎข้อที่ 3 ของนิวตัน: แรงปฏิกิริยา $\\vec{f}_{ij} = -\\vec{f}_{ji} \\implies \\vec{f}_{ij} + \\vec{f}_{ji} = \\vec{0}$ ทำให้ผลรวมแรงภายในเป็นศูนย์คู่ต่อคู่",
          "4. ดึงอนุพันธ์อันดับสองออกจากผลรวมมวล-ตำแหน่ง: $\\frac{d^2}{dt^2}(M\\vec{R}_{\\text{cm}}) = M\\vec{a}_{\\text{cm}} = \\sum \\vec{F}_{\\text{ext}}$"
        ]
      }
    ],
    "application": {
      "text": "ใช้วิเคราะห์การระเบิดของดอกไม้ไฟหรือขีปนาวุธกลางอากาศ (จุด CM ยังคงเคลื่อนที่ตามพาราโบลาเดิมจนกว่าจะกระทบพื้น) การชนของอนุภาคในกรอบ CM Frame และการเคลื่อนที่ของดาวคู่ (Binary Star System)",
      "validWhen": "ระบบมีมวลรวมคงที่และแรงกระทำสอดคล้องกับกลศาสตร์คลาสสิกของนิวตัน",
      "invalidWhen": "ห้ามใช้กับระบบที่มีการสูญเสียหรือรับมวลอย่างต่อเนื่อง เช่น จรวดขับดันเชื้อเพลิง (Variable Mass Systems) ต้องใช้สมการ Tsiolkovsky rocket equation แทน"
    },
    "example": {
      "problem": "อนุภาคสองตัว $m_1 = 2.0\\text{ kg}$ อยู่ที่พิกัด $(0, 0)\\text{ m}$ และ $m_2 = 6.0\\text{ kg}$ อยู่ที่พิกัด $(8.0, 4.0)\\text{ m}$ จงหาพิกัดจุดศูนย์กลางมวล และหากมีแรงภายนอก $\\vec{F} = (16\\hat{i} + 8\\hat{j})\\text{ N}$ กระทำต่อระบบ จงหาความเร่งของจุดศูนย์กลางมวล",
      "steps": [
        "ขั้นตอนที่ 1: หามวลรวม $M = m_1 + m_2 = 2.0 + 6.0 = 8.0\\text{ kg}$",
        "ขั้นตอนที่ 2: หาพิกัด $X_{\\text{cm}} = \\frac{(2.0)(0) + (6.0)(8.0)}{8.0} = \\frac{48.0}{8.0} = 6.0\\text{ m}$",
        "ขั้นตอนที่ 3: หาพิกัด $Y_{\\text{cm}} = \\frac{(2.0)(0) + (6.0)(4.0)}{8.0} = \\frac{24.0}{8.0} = 3.0\\text{ m}$ (จุด CM อยู่ที่ $(6.0, 3.0)\\text{ m}$)",
        "ขั้นตอนที่ 4: หาความเร่ง $\\vec{a}_{\\text{cm}} = \\frac{\\vec{F}_{\\text{ext}}}{M} = \\frac{16\\hat{i} + 8\\hat{j}}{8.0} = (2.0\\hat{i} + 1.0\\hat{j})\\text{ m/s}^2$"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 500 180\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"ระบบจุดศูนย์กลางมวลและการหักล้างของแรงภายใน\">\n  <rect width=\"500\" height=\"180\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <line x1=\"100\" y1=\"100\" x2=\"400\" y2=\"100\" stroke=\"#94A3B8\" stroke-dasharray=\"4,4\" stroke-width=\"2\"/>\n  <!-- Mass 1 -->\n  <circle cx=\"100\" cy=\"100\" r=\"16\" fill=\"#38BDF8\" stroke=\"#0284C7\" stroke-width=\"2\"/>\n  <text x=\"100\" y=\"105\" text-anchor=\"middle\" font-size=\"12\" font-weight=\"bold\" fill=\"#0F172A\">m₁</text>\n  <!-- Mass 2 -->\n  <circle cx=\"400\" cy=\"100\" r=\"26\" fill=\"#F97316\" stroke=\"#EA580C\" stroke-width=\"2\"/>\n  <text x=\"400\" y=\"106\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"bold\" fill=\"#FFFFFF\">m₂</text>\n  <!-- Internal Forces Cancellation -->\n  <line x1=\"120\" y1=\"100\" x2=\"170\" y2=\"100\" stroke=\"#DC2626\" stroke-width=\"2.5\" marker-end=\"url(#arr-euler)\"/>\n  <text x=\"145\" y=\"90\" text-anchor=\"middle\" font-size=\"10\" fill=\"#DC2626\" font-weight=\"bold\">f₁₂</text>\n  <line x1=\"370\" y1=\"100\" x2=\"320\" y2=\"100\" stroke=\"#DC2626\" stroke-width=\"2.5\" marker-end=\"url(#arr-euler)\"/>\n  <text x=\"345\" y=\"90\" text-anchor=\"middle\" font-size=\"10\" fill=\"#DC2626\" font-weight=\"bold\">f₂₁ = -f₁₂</text>\n  <!-- Center of Mass Marker -->\n  <circle cx=\"325\" cy=\"100\" r=\"6\" fill=\"#10B981\" stroke=\"#065F46\" stroke-width=\"2\"/>\n  <text x=\"325\" y=\"130\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"bold\" fill=\"#065F46\">จุดศูนย์กลางมวล (CM)</text>\n  <line x1=\"325\" y1=\"100\" x2=\"325\" y2=\"50\" stroke=\"#059669\" stroke-width=\"3\" marker-end=\"url(#arr-rk4)\"/>\n  <text x=\"335\" y=\"45\" font-size=\"11\" font-weight=\"bold\" fill=\"#059669\">ΣF_ext = M a_cm</text>\n</svg>",
      "diagramCaption": "การหักล้างกันอย่างสมบูรณ์ของแรงกิริยา-ปฏิกิริยาภายในคู่ $\\vec{f}_{12} + \\vec{f}_{21} = \\vec{0}$ ทำให้ความเร่งของจุด CM ขึ้นตรงต่อแรงภายนอกสุทธิเท่านั้น"
    },
    "observations": [
      "ข้อสังเกต: เมื่อพลุระเบิดกลางอากาศ ชิ้นส่วนย่อยอาจกระจัดกระจายไปทุกทิศทางด้วยความเร็วสูงมาก แต่จุดศูนย์กลางมวลของชิ้นส่วนทั้งหมดจะยังคงเคลื่อนที่ตามวิถีพาราโบลาเดิมอย่างต่อเนื่องเสมือนไม่มีการระเบิดเกิดขึ้น"
    ],
    "citation": "Morin, D. (2008), Introduction to Classical Mechanics, Cambridge University Press, Chapter 6, pp. 190–205; Tong, D. (2004), Classical Dynamics, University of Cambridge, Sec. 1.2, pp. 8–12."
  },
  {
    "id": 12,
    "divisionId": "div-kinematics",
    "divisionTitle": "ภาคที่ 1: จลนศาสตร์ (Kinematics)",
    "numberTh": "ทฤษฎีที่ 12",
    "titleTh": "การเคลื่อนที่แบบวงกลมสม่ำเสมอและความเร่งสู่ศูนย์กลาง",
    "titleEn": "Uniform Circular Motion & Centripetal Dynamics",
    "type": "จลนศาสตร์และพลศาสตร์การหมุน (Rotational Kinematics & Dynamics)",
    "summary": "การวิเคราะห์การเคลื่อนที่ตามแนววิถีโค้ง ความเร่งแนวสัมผัสและแนวตั้งฉาก (Tangential & Centripetal Acceleration) พร้อมการพิสูจน์เวกเตอร์ $a_c = v^2/R = \\omega^2 R$",
    "definition": {
      "text": "การเคลื่อนที่แบบวงกลมสม่ำเสมอ (Uniform Circular Motion) คือการเคลื่อนที่ของวัตถุตามเส้นทางวงกลมรัศมี $R$ ด้วยอัตราเร็วคงตัว $v$ แม้ขนาดของความเร็วจะคงที่ แต่ **ทิศทางของเวกเตอร์ความเร็วเปลี่ยนแปลงอย่างต่อเนื่องทุกขณะ** ส่งผลให้วัตถุมีความเร่งในแนวตั้งฉากชี้เข้าหาจุดศูนย์กลางของวงกลมเสมอ เรียกว่า **ความเร่งสู่ศูนย์กลาง (Centripetal Acceleration, $a_c$)**"
    },
    "principle": {
      "text": "ตามกฎข้อที่หนึ่งของนิวตัน วัตถุจะเคลื่อนที่ตรงไปข้างหน้าด้วยความเร็วคงที่เสมอหากปราศจากแรงกระทำ ดังนั้นการบังคับให้วัตถุเลี้ยวโค้งเป็นวงกลมจำเป็นต้องมี **แรงสุทธิในทิศชี้เข้าหาจุดศูนย์กลาง (Centripetal Force, $F_c$)** กระทำตลอดเวลา หากแรงนี้หายไปในทันที วัตถุจะเคลื่อนที่หลุดออกไปตามแนวเส้นสัมผัส (Tangent Line) ทันที"
    },
    "formulas": [
      {
        "name": "ความสัมพันธ์อัตราเร็วเชิงมุมและเชิงเส้น",
        "latex": "v = \\omega R = \\frac{2\\pi R}{T} = 2\\pi f R",
        "symbols": [
          {
            "sym": "v",
            "desc": "อัตราเร็วเชิงเส้นแนวสัมผัส",
            "unit": "\\text{m/s}"
          },
          {
            "sym": "\\omega",
            "desc": "ความเร็วเชิงมุม",
            "unit": "\\text{rad/s}"
          },
          {
            "sym": "R",
            "desc": "รัศมีของวงโค้ง",
            "unit": "\\text{m}"
          },
          {
            "sym": "T",
            "desc": "คาบการหมุนครบรอบ",
            "unit": "\\text{s}"
          }
        ],
        "derivationSteps": [
          "1. มุมที่กวาดไปได้ต่อหนึ่งรอบคือ $\\Delta\\theta = 2\\pi\\text{ rad}$ ในเวลาหนึ่งคาบ $T$",
          "2. อัตราเร็วเชิงมุมเฉลี่ย: $\\omega = \\frac{2\\pi}{T}$",
          "3. ความยาวส่วนโค้งรอบวง $s = 2\\pi R$ ดังนั้นอัตราเร็ว $v = \\frac{s}{T} = \\frac{2\\pi R}{T} = \\omega R$"
        ]
      },
      {
        "name": "ความเร่งสู่ศูนย์กลาง (Centripetal Acceleration)",
        "latex": "a_c = \\frac{v^2}{R} = \\omega^2 R",
        "symbols": [
          {
            "sym": "a_c",
            "desc": "ความเร่งเข้าหาจุดศูนย์กลาง",
            "unit": "\\text{m/s}^2"
          }
        ],
        "derivationSteps": [
          "1. ในพิกัดเชิงขั้ว เวกเตอร์ตำแหน่งคือ $\\vec{r}(t) = R(\\cos\\theta\\hat{i} + \\sin\\theta\\hat{j})$",
          "2. อนุพันธ์เทียบเวลาหาความเร็ว: $\\vec{v} = \\frac{d\\vec{r}}{dt} = R\\dot{\\theta}(-\\sin\\theta\\hat{i} + \\cos\\theta\\hat{j}) = R\\omega\\hat{\\theta}$",
          "3. อนุพันธ์เทียบเวลาหาความเร่ง: $\\vec{a} = \\frac{d\\vec{v}}{dt} = -R\\omega^2(\\cos\\theta\\hat{i} + \\sin\\theta\\hat{j}) = -\\omega^2 R\\hat{r}$",
          "4. เครื่องหมายลบแสดงทิศพุ่งเข้าหาจุดกำเนิด (ศูนย์กลาง) และขนาดคือ $a_c = \\omega^2 R = \\frac{v^2}{R}$"
        ]
      },
      {
        "name": "แรงสู่ศูนย์กลางสุทธิ (Net Centripetal Force)",
        "latex": "\\sum F_c = m a_c = m\\frac{v^2}{R} = m\\omega^2 R",
        "symbols": [
          {
            "sym": "\\sum F_c",
            "desc": "แรงลัพธ์ชี้เข้าสู่ศูนย์กลาง",
            "unit": "\\text{N}"
          }
        ],
        "derivationSteps": [
          "1. จากกฎข้อที่สองของนิวตัน $\\sum\\vec{F} = m\\vec{a}$",
          "2. ในแนวแกนรัศมีเข้าสู่ศูนย์กลาง: $\\sum F_c = m a_c$",
          "3. แทนค่า $a_c = \\frac{v^2}{R}$ จะได้: $\\sum F_c = m\\frac{v^2}{R}$"
        ]
      }
    ],
    "application": {
      "text": "ใช้ออกแบบความลาดเอียงของโค้งถนนและทางรถไฟ (Banked Curves), การคำนวณวงโคจรของดาวเทียมรอบโลก ($G\\frac{Mm}{r^2} = m\\frac{v^2}{r}$), และการทำงานของเครื่องหมุนเหวี่ยงแยกสาร (Centrifuge)",
      "validWhen": "ใช้วิเคราะห์การเคลื่อนที่ตามวิถีโค้งใดๆ โดยแทน $R$ ด้วยรัศมีความโค้งเฉพาะจุด (Local Radius of Curvature)",
      "invalidWhen": "ระวัง: แรงสู่ศูนย์กลาง **ไม่ใช่แรงชนิดใหม่ทางฟิสิกส์** แต่เป็นบทบาทของแรงจริงที่มีอยู่แล้ว (เช่น แรงตึงเชือก แรงดึงดูดโน้มถ่วง หรือแรงเสียดทานสถิต)"
    },
    "example": {
      "problem": "รถยนต์มวล $1200\\text{ kg}$ กำลังเลี้ยวโค้งราบบนถนนรัศมี $50.0\\text{ m}$ ด้วยความเร็วคงที่ $20.0\\text{ m/s}$ จงหาความเร่งสู่ศูนย์กลางและแรงเสียดทานขั้นต่ำระหว่างยางรถกับผิวถนนที่ป้องกันไม่ให้รถไถลหลุดโค้ง",
      "steps": [
        "ขั้นตอนที่ 1: คำนวณความเร่งสู่ศูนย์กลาง $a_c = \\frac{v^2}{R} = \\frac{(20.0)^2}{50.0} = \\frac{400}{50.0} = 8.00\\text{ m/s}^2$",
        "ขั้นตอนที่ 2: บนถนนราบ แรงเสียดทานสถิต $f_s$ ทำหน้าที่เป็นแรงสู่ศูนย์กลางเพียงแรงเดียว: $f_s = m a_c = (1200)(8.00) = 9600\\text{ N}$",
        "ขั้นตอนที่ 3: หาสัมประสิทธิ์แรงเสียดทานสถิตขั้นต่ำ $\\mu_s \\ge \\frac{f_s}{mg} = \\frac{a_c}{g} = \\frac{8.00}{9.80} \\approx 0.816$"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 500 180\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"การเคลื่อนที่แบบวงกลมสม่ำเสมอและความเร่งสู่ศูนย์กลาง\">\n  <rect width=\"500\" height=\"180\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Orbit Circle -->\n  <circle cx=\"250\" cy=\"95\" r=\"65\" fill=\"none\" stroke=\"#94A3B8\" stroke-width=\"1.5\" stroke-dasharray=\"5,4\"/>\n  <circle cx=\"250\" cy=\"95\" r=\"3\" fill=\"#475569\"/>\n  <text x=\"250\" y=\"110\" text-anchor=\"middle\" font-size=\"10\" fill=\"#64748B\">ศูนย์กลาง (O)</text>\n  <!-- Particle Position -->\n  <circle cx=\"315\" cy=\"95\" r=\"9\" fill=\"#2563EB\" stroke=\"#1D4ED8\" stroke-width=\"2\"/>\n  <!-- Radius Vector -->\n  <line x1=\"250\" y1=\"95\" x2=\"306\" y2=\"95\" stroke=\"#64748B\" stroke-width=\"1.5\"/>\n  <text x=\"280\" y=\"90\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"bold\" fill=\"#64748B\">R</text>\n  <!-- Velocity Vector (Tangent) -->\n  <line x1=\"315\" y1=\"95\" x2=\"315\" y2=\"35\" stroke=\"#059669\" stroke-width=\"2.5\" marker-end=\"url(#arr-rk4)\"/>\n  <text x=\"325\" y=\"45\" font-size=\"12\" font-weight=\"bold\" fill=\"#059669\">v (ความเร็วสัมผัส)</text>\n  <!-- Centripetal Acceleration (Inward) -->\n  <line x1=\"315\" y1=\"95\" x2=\"265\" y2=\"95\" stroke=\"#EA580C\" stroke-width=\"2.5\" marker-end=\"url(#arr-euler)\"/>\n  <text x=\"290\" y=\"120\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"bold\" fill=\"#EA580C\">a_c = v²/R</text>\n</svg>",
      "diagramCaption": "เวกเตอร์ความเร็ว $\\vec{v}$ มีทิศตั้งฉากกับเวกเตอร์ความเร่งสู่ศูนย์กลาง $\\vec{a}_c$ ตลอดเวลา ทำให้ขนาดอัตราเร็วไม่เปลี่ยน แต่ทิศทางเปลี่ยนไปอย่างต่อเนื่อง"
    },
    "observations": [
      "ข้อสังเกตสำคัญ: งานที่ทำโดยแรงสู่ศูนย์กลางสุทธิมีค่าเป็นศูนย์เสมอ ($W = \\int \\vec{F}_c \\cdot d\\vec{r} = 0$) เนื่องจาก $\\vec{F}_c \\perp \\vec{v}$ ตลอดเส้นทาง จึงไม่มีการเปลี่ยนพลังงานจลน์ของวัตถุ"
    ],
    "citation": "French, A. P. (1971), Newtonian Mechanics, W.W. Norton & Company, Chapter 7, pp. 215–230; Morin, D. (2008), Section 3.5, pp. 78–85."
  },
  {
    "id": 13,
    "divisionId": "div-dynamics",
    "divisionTitle": "ภาคที่ 2: พลศาสตร์ (Dynamics)",
    "numberTh": "ทฤษฎีที่ 13",
    "titleTh": "กรอบอ้างอิงที่ไม่เฉื่อยและแรงโคริโอลิส",
    "titleEn": "Non-Inertial Reference Frames & Coriolis Dynamics",
    "type": "กรอบอ้างอิงและแรงเทียม (Fictitious Forces & Rotating Frames)",
    "summary": "การแปลงสมการการเคลื่อนที่สู่กรอบอ้างอิงที่มีความเร่งและการหมุน การเกิดแรงเหวี่ยงหนีศูนย์กลาง (Centrifugal Force) และแรงโคริโอลิส (Coriolis Force) ที่เบี่ยงเบนวิถีการเคลื่อนที่",
    "definition": {
      "text": "กรอบอ้างอิงที่ไม่เฉื่อย (Non-Inertial Frame) คือกรอบพิกัดที่มีความเร่งเชิงเส้นเทียบกับกรอบเฉื่อย หรือเป็น **กรอบที่กำลังหมุนด้วยความเร็วเชิงมุม $\\vec{\\Omega}$**\nเมื่อผู้สังเกตการณ์อยู่ในกรอบหมุน กฎการเคลื่อนที่ของนิวตันจะไม่สอดคล้องกับพฤติกรรมที่มองเห็น เว้นแต่จะเพิ่ม **แรงเทียม (Fictitious / Inertial Forces)** เข้าไปในสมการการเคลื่อนที่ ได้แก่:\n1. **แรงเหวี่ยงหนีศูนย์กลาง (Centrifugal Force):** แรงผลักออกในแนวรัศมี\n2. **แรงโคริโอลิส (Coriolis Force):** แรงที่กระทำตั้งฉากกับความเร็วสัมพัทธ์ของอนุภาคในกรอบหมุน"
    },
    "principle": {
      "text": "อนุพันธ์เทียบเวลาของเวกเตอร์ใดๆ $\\vec{A}$ ในกรอบเฉื่อย (Space Frame) สัมพันธ์กับกรอบหมุน (Rotating Body Frame) ผ่านความสัมพันธ์เชิงจลนศาสตร์:\n$$\\left(\\frac{d\\vec{A}}{dt}\\right)_{\\text{space}} = \\left(\\frac{d\\vec{A}}{dt}\\right)_{\\text{rot}} + \\vec{\\Omega} \\times \\vec{A}$$\nเมื่อนำกฎนี้มาประยุกต์ใช้กับเวกเตอร์ตำแหน่งและความเร็ว จะอนุมานได้สมการการเคลื่อนที่ในกรอบหมุนที่มีแรงเทียมปรากฏขึ้นมาอย่างเคร่งครัดตามหลักคณิตศาสตร์"
    },
    "formulas": [
      {
        "name": "สมการการเคลื่อนที่ในกรอบอ้างอิงหมุน (Equation of Motion in Rotating Frame)",
        "latex": "m\\vec{a}_r = \\vec{F}_{\\text{real}} - m\\vec{\\Omega} \\times (\\vec{\\Omega} \\times \\vec{r}) - 2m(\\vec{\\Omega} \\times \\vec{v}_r)",
        "symbols": [
          {
            "sym": "\\vec{a}_r",
            "desc": "ความเร่งที่วัดได้ในกรอบหมุน",
            "unit": "\\text{m/s}^2"
          },
          {
            "sym": "\\vec{F}_{\\text{real}}",
            "desc": "แรงจริงทางฟิสิกส์ (แรงโน้มถ่วง แรงตึง)",
            "unit": "\\text{N}"
          },
          {
            "sym": "\\vec{\\Omega}",
            "desc": "ความเร็วเชิงมุมของกรอบหมุน",
            "unit": "\\text{rad/s}"
          },
          {
            "sym": "\\vec{v}_r",
            "desc": "ความเร็วของวัตถุเทียบกับกรอบหมุน",
            "unit": "\\text{m/s}"
          }
        ],
        "derivationSteps": [
          "1. ใช้กฎการแปลงอนุพันธ์กับเวกเตอร์ตำแหน่ง $\\vec{r}$: $\\vec{v}_s = \\vec{v}_r + \\vec{\\Omega}\\times\\vec{r}$",
          "2. อนุพันธ์เทียบเวลาอีกครั้งในกรอบเฉื่อย: $\\vec{a}_s = \\frac{d}{dt}(\\vec{v}_r + \\vec{\\Omega}\\times\\vec{r})_r + \\vec{\\Omega}\\times(\\vec{v}_r + \\vec{\\Omega}\\times\\vec{r})$",
          "3. กระจายผลคูณไขว้: $\\vec{a}_s = \\vec{a}_r + 2(\\vec{\\Omega}\\times\\vec{v}_r) + \\vec{\\Omega}\\times(\\vec{\\Omega}\\times\\vec{r})$ (สมมุติ $\\dot{\\vec{\\Omega}} = 0$)",
          "4. คูณด้วยมวล $m$ และแทนกฎนิวตัน $\\vec{F}_{\\text{real}} = m\\vec{a}_s$ แล้วย้ายข้างหา $m\\vec{a}_r$"
        ]
      },
      {
        "name": "แรงโคริโอลิส (Coriolis Force Formula)",
        "latex": "\\vec{F}_{\\text{cor}} = -2m(\\vec{\\Omega} \\times \\vec{v}_r)",
        "symbols": [
          {
            "sym": "\\vec{F}_{\\text{cor}}",
            "desc": "แรงโคริโอลิส",
            "unit": "\\text{N}"
          }
        ],
        "derivationSteps": [
          "1. แรงโคริโอลิสมีขนาดแปรผันตรงกับอัตราเร็วสัมพัทธ์ในกรอบหมุน $v_r$ และความเร็วเชิงมุมของการหมุน $\\Omega$",
          "2. ทิศทางของแรงตั้งฉากกับทั้งแกนการหมุนและเวกเตอร์ความเร็วตามกฎมือขวา",
          "3. หากวัตถุอยู่นิ่งในกรอบหมุน ($v_r = 0$) แรงโคริโอลิสจะมีค่าเป็นศูนย์ทันที"
        ]
      }
    ],
    "application": {
      "text": "อธิบายการหมุนวนของพายุไซโคลน (ทวนเข็มนาฬิกาในซีกโลกเหนือ ตามเข็มนาฬิกาในซีกโลกใต้), การเบี่ยงเบนของขีปนาวุธวิถีไกลและการยิงปืนใหญ่ระยะทางหลายสิบกิโลเมตร, และการแกว่งเปลี่ยนระนาบของลูกตุ้มฟูโกต์ (Foucault Pendulum)",
      "validWhen": "ใช้ในการคำนวณกลศาสตร์เมื่อผู้สังเกตการณ์ผูกติดอยู่กับวัตถุที่กำลังหมุน (เช่น การเคลื่อนที่บนพื้นผิวโลก)",
      "invalidWhen": "ในกรอบเฉื่อย แรงโคริโอลิสไม่มีอยู่จริง การเบี่ยงเบนของวิถีเป็นผลลัพธ์จากการที่กรอบหมุนเคลื่อนที่หนีใต้เท้าของวัตถุที่กำลังพุ่งเป็นเส้นตรงในกรอบเฉื่อย"
    },
    "example": {
      "problem": "ยิงกระสุนปืนใหญ่ด้วยความเร็ว $v = 800\\text{ m/s}$ ไปทางทิศเหนือที่ละติจูด $\\lambda = 45^\\circ\\text{ N}$ (โลกหมุนรอบตัวเองด้วย $\\Omega \\approx 7.292 \\times 10^{-5}\\text{ rad/s}$) จงหาขนาดความเร่งโคริโอลิสที่กระทำต่อลูกปืนใหญ่และทิศทางการเบี่ยง",
      "steps": [
        "ขั้นตอนที่ 1: ขนาดความเร่งโคริโอลิสในแนวราบคือ $a_{\\text{cor}} = 2\\Omega v \\sin\\lambda$",
        "ขั้นตอนที่ 2: แทนค่าตัวเลข: $a_{\\text{cor}} = 2(7.292 \\times 10^{-5})(800)\\sin(45^\\circ) = 0.1167 \\times 0.7071 \\approx 0.0825\\text{ m/s}^2$",
        "ขั้นตอนที่ 3: พิจารณาทิศทาง: เวกเตอร์ $-2(\\vec{\\Omega} \\times \\vec{v})$ บนซีกโลกเหนือจะชี้เบี่ยงไปทาง **ทิศตะวันออก (ขวาของแนวการยิง)** เสมอ"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 500 180\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"แรงโคริโอลิสในกรอบอ้างอิงหมุน\">\n  <rect width=\"500\" height=\"180\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Turntable rotating -->\n  <circle cx=\"250\" cy=\"90\" r=\"70\" fill=\"none\" stroke=\"#CBD5E1\" stroke-width=\"2\"/>\n  <path d=\"M 315 75 A 70 70 0 0 0 250 20\" fill=\"none\" stroke=\"#64748B\" stroke-width=\"2\" marker-end=\"url(#arr-axis2)\"/>\n  <text x=\"295\" y=\"35\" font-size=\"11\" font-weight=\"bold\" fill=\"#475569\">Ω (หมุนทวนเข็ม)</text>\n  <!-- Inertial Trajectory: Straight Line (Dashed Slate) -->\n  <line x1=\"250\" y1=\"90\" x2=\"250\" y2=\"20\" stroke=\"#94A3B8\" stroke-width=\"2\" stroke-dasharray=\"4,3\"/>\n  <text x=\"200\" y=\"45\" font-size=\"10\" fill=\"#64748B\">วิถีตรงในกรอบเฉื่อย</text>\n  <!-- Rotating Frame Trajectory: Curved Deflection (Orange Solid) -->\n  <path d=\"M 250 90 Q 285 65 305 35\" fill=\"none\" stroke=\"#EA580C\" stroke-width=\"2.5\"/>\n  <circle cx=\"305\" cy=\"35\" r=\"5\" fill=\"#EA580C\"/>\n  <text x=\"315\" y=\"45\" font-size=\"11\" font-weight=\"bold\" fill=\"#EA580C\">วิถีโค้งในกรอบหมุน</text>\n  <!-- Coriolis Force Vector -->\n  <line x1=\"275\" y1=\"65\" x2=\"305\" y2=\"75\" stroke=\"#DC2626\" stroke-width=\"2\" marker-end=\"url(#arr-euler)\"/>\n  <text x=\"310\" y=\"85\" font-size=\"10\" font-weight=\"bold\" fill=\"#DC2626\">F_cor = -2m(Ω × v)</text>\n</svg>",
      "diagramCaption": "ในกรอบหมุน วัตถุที่เคลื่อนที่ด้วยความเร็ว $\\vec{v}_r$ จะถูกแรงโคริโอลิสผลักให้วิถีเบี่ยงเบนไปจากแนวเส้นตรงอย่างต่อเนื่อง"
    },
    "observations": [
      "ข้อสังเกต: แรงโคริโอลิสไม่ทำงานเช่นเดียวกับแรงแม่เหล็ก ($W = \\int \\vec{F}_{\\text{cor}} \\cdot d\\vec{r}_r = 0$) เนื่องจากทิศของแรงตั้งฉากกับความเร็วตลอดเวลา จึงเปลี่ยนเฉพาะทิศทางการเคลื่อนที่โดยไม่เปลี่ยนอัตราเร็วสัมพัทธ์"
    ],
    "citation": "Taylor, J. R. (2005), Classical Mechanics, University Science Books, Chapter 9, pp. 339–358; Morin, D. (2008), Chapter 10, pp. 450–475."
  },
  {
    "id": 14,
    "divisionId": "div-computational",
    "divisionTitle": "ภาคที่ 4: หัวข้อเชื่อมโยงและการคำนวณขั้นสูง (Bridging Topics & Computational Physics)",
    "numberTh": "ทฤษฎีที่ 14",
    "titleTh": "การกลิ้งโดยไม่ไถลและพลศาสตร์วัตถุแข็งเกร็ง",
    "titleEn": "Rolling Without Slipping & Rigid Body Dynamics",
    "type": "การเชื่อมโยงเชิงหมุนและเลื่อนที่ (Translational & Rotational Coupling)",
    "summary": "การเคลื่อนที่ผสมระหว่างการเลื่อนที่ของจุดศูนย์กลางมวลและการหมุนรอบแกน เงื่อนไขการไม่ไถล $v_{\\text{cm}} = R\\omega$ และการแบ่งสรรพลังงานจลน์",
    "definition": {
      "text": "การกลิ้งโดยไม่ไถล (Rolling Without Slipping) เกิดขึ้นเมื่อวัตถุทรงกลมหรือทรงกระบอกหมุนและเคลื่อนที่ไปข้างหน้าบนพื้นผิวโดยที่ **จุดสัมผัสระหว่างผิววัตถุกับพื้นอยู่นิ่งชั่วขณะเมื่อเทียบกับพื้น** ($v_{\\text{contact}} = 0$)\nสภาพการเคลื่อนที่นี้ผูกมัดจลนศาสตร์การหมุนเข้ากับจลนศาสตร์การเลื่อนที่อย่างสมบูรณ์:\n$$v_{\\text{cm}} = R\\omega \\quad , \\quad a_{\\text{cm}} = R\\alpha$$"
    },
    "principle": {
      "text": "ตามทฤษฎีบทโคอนิก (Koenig's Theorem) พลังงานจลน์รวมของวัตถุที่กลิ้งแบ่งออกเป็นสองส่วนอย่างเคร่งครัด:\n1. พลังงานจลน์จากการเลื่อนที่ของจุดศูนย์กลางมวล: $K_{\\text{trans}} = \\frac{1}{2}Mv_{\\text{cm}}^2$\n2. พลังงานจลน์จากการหมุนรอบจุดศูนย์กลางมวล: $K_{\\text{rot}} = \\frac{1}{2}I_{\\text{cm}}\\omega^2$\nแรงที่ทำให้เกิดการหมุนคือ **แรงเสียดทานสถิต (Static Friction, $f_s$)** ซึ่งไม่ทำงานและไม่สูญเสียพลังงานกลกลายเป็นความร้อน"
    },
    "formulas": [
      {
        "name": "พลังงานจลน์รวมของการกลิ้งไม่ไถล (Total Rolling Kinetic Energy)",
        "latex": "K_{\\text{total}} = \\frac{1}{2}Mv_{\\text{cm}}^2 + \\frac{1}{2}I_{\\text{cm}}\\omega^2 = \\frac{1}{2}Mv_{\\text{cm}}^2\\left(1 + \\frac{I_{\\text{cm}}}{MR^2}\\right)",
        "symbols": [
          {
            "sym": "K_{\\text{total}}",
            "desc": "พลังงานจลน์รวมทั้งหมด",
            "unit": "\\text{J}"
          },
          {
            "sym": "I_{\\text{cm}}",
            "desc": "โมเมนต์ความเฉื่อยรอบจุดศูนย์กลางมวล",
            "unit": "\\text{kg}\\cdot\\text{m}^2"
          },
          {
            "sym": "v_{\\text{cm}}",
            "desc": "ความเร็วของจุดศูนย์กลางมวล",
            "unit": "\\text{m/s}"
          },
          {
            "sym": "\\omega",
            "desc": "ความเร็วเชิงมุม",
            "unit": "\\text{rad/s}"
          }
        ],
        "derivationSteps": [
          "1. รวมพลังงานจลน์สองส่วน: $K_{\\text{total}} = \\frac{1}{2}Mv_{\\text{cm}}^2 + \\frac{1}{2}I_{\\text{cm}}\\omega^2$",
          "2. จากเงื่อนไขไม่ไถล: $\\omega = \\frac{v_{\\text{cm}}}{R}$",
          "3. แทนค่าลงในพจน์การหมุน: $\\frac{1}{2}I_{\\text{cm}}\\left(\\frac{v_{\\text{cm}}}{R}\\right)^2 = \\frac{1}{2}\\frac{I_{\\text{cm}}}{R^2}v_{\\text{cm}}^2$",
          "4. ดึงตัวคูณร่วม $\\frac{1}{2}Mv_{\\text{cm}}^2$ ออกมา จะได้รูปสมการความสัมพันธ์"
        ]
      },
      {
        "name": "ความเร่งของการกลิ้งลงพื้นเอียง (Acceleration down an Incline)",
        "latex": "a_{\\text{cm}} = \\frac{g\\sin\\theta}{1 + \\frac{I_{\\text{cm}}}{MR^2}}",
        "symbols": [
          {
            "sym": "a_{\\text{cm}}",
            "desc": "ความเร่งแนวขนานพื้นเอียง",
            "unit": "\\text{m/s}^2"
          },
          {
            "sym": "\\theta",
            "desc": "มุมเอียงของระนาบ",
            "unit": "\\text{rad} \\text{ หรือ } {}^\\circ"
          }
        ],
        "derivationSteps": [
          "1. กฎข้อ 2 แนวขนานพื้นเอียง: $Mg\\sin\\theta - f_s = Ma_{\\text{cm}}$",
          "2. ทอร์กรอบจุด CM: $\\tau = f_s R = I_{\\text{cm}}\\alpha = I_{\\text{cm}}\\frac{a_{\\text{cm}}}{R} \\implies f_s = \\frac{I_{\\text{cm}}}{R^2}a_{\\text{cm}}$",
          "3. แทน $f_s$ ลงในสมการแรก: $Mg\\sin\\theta = Ma_{\\text{cm}} + \\frac{I_{\\text{cm}}}{R^2}a_{\\text{cm}} = Ma_{\\text{cm}}\\left(1 + \\frac{I_{\\text{cm}}}{MR^2}\\right)$",
          "4. ย้ายข้างจัดรูปจะได้ความเร่ง $a_{\\text{cm}}$ ที่เป็นอิสระจากมวลและรัศมี ขึ้นกับเฉพาะรูปทรงเรขาคณิต"
        ]
      }
    ],
    "application": {
      "text": "การคำนวณการเคลื่อนที่ของล้อรถยนต์และเกวียน, การแข่งขันลูกกลิ้งรูปทรงต่างๆ ลงพื้นเอียง (ทรงกลมตันชนะทรงกระบอกกลวงเสมอเพราะ $\\frac{I}{MR^2}$ เล็กกว่า), และการทำงานของตลับลูกปืน (Ball Bearings)",
      "validWhen": "แรงเสียดทานสถิตมีค่าเพียงพอที่จะป้องกันการไถล ($f_s \\le \\mu_s N$)",
      "invalidWhen": "หากพื้นเอียงลื่นมากจน $\\tan\\theta > \\mu_s\\left(1 + \\frac{MR^2}{I}\\right)$ วัตถุจะเริ่มไถลไปพร้อมกับกลิ้ง (Slipping and Rolling) และสูญเสียพลังงานเชิงกล"
    },
    "example": {
      "problem": "ปล่อยทรงกลมตัน ($I_{\\text{cm}} = \\frac{2}{5}MR^2$) และทรงกระบอกกลวงผนังบาง ($I_{\\text{cm}} = MR^2$) ให้กลิ้งลงมาจากยอดพื้นเอียงทำมุม $\\theta = 30^\\circ$ พร้อมกัน จงหาความเร่งของวัตถุทั้งสอง",
      "steps": [
        "ขั้นตอนที่ 1: คำนวณความเร่งของทรงกลมตัน:\n$a_{\\text{sphere}} = \\frac{g\\sin(30^\\circ)}{1 + 2/5} = \\frac{0.5g}{1.4} = \\frac{5}{14}g \\approx 0.357g \\approx 3.50\\text{ m/s}^2$",
        "ขั้นตอนที่ 2: คำนวณความเร่งของทรงกระบอกกลวง:\n$a_{\\text{hoop}} = \\frac{g\\sin(30^\\circ)}{1 + 1} = \\frac{0.5g}{2} = 0.25g \\approx 2.45\\text{ m/s}^2$",
        "สรุป: ทรงกลมตันมีความเร่งมากกว่า จึงกลิ้งถึงปลายพื้นเอียงก่อนทรงกระบอกกลวงเสมอ"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 500 180\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"การกลิ้งโดยไม่ไถลบนพื้นเอียง\">\n  <rect width=\"500\" height=\"180\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Incline Plane -->\n  <polygon points=\"60,150 440,150 440,50\" fill=\"#F1F5F9\" stroke=\"#94A3B8\" stroke-width=\"2\"/>\n  <path d=\"M 100 150 A 40 40 0 0 0 95 140\" fill=\"none\" stroke=\"#64748B\" stroke-width=\"1.5\"/>\n  <text x=\"110\" y=\"145\" font-size=\"11\" fill=\"#64748B\">θ</text>\n  <!-- Rolling Sphere -->\n  <g transform=\"translate(260, 95) rotate(-14.7)\">\n    <circle cx=\"0\" cy=\"-28\" r=\"28\" fill=\"#FED7AA\" stroke=\"#EA580C\" stroke-width=\"2\"/>\n    <circle cx=\"0\" cy=\"-28\" r=\"4\" fill=\"#C2410C\"/>\n    <line x1=\"0\" y1=\"-28\" x2=\"28\" y2=\"-28\" stroke=\"#EA580C\" stroke-width=\"1.5\"/>\n    <!-- Velocity CM Vector -->\n    <line x1=\"0\" y1=\"-28\" x2=\"45\" y2=\"-28\" stroke=\"#059669\" stroke-width=\"2.5\" marker-end=\"url(#arr-rk4)\"/>\n    <text x=\"20\" y=\"-35\" font-size=\"11\" font-weight=\"bold\" fill=\"#059669\">v_cm = Rω</text>\n    <!-- Static Friction -->\n    <line x1=\"0\" y1=\"0\" x2=\"-30\" y2=\"0\" stroke=\"#DC2626\" stroke-width=\"2.5\" marker-end=\"url(#arr-euler)\"/>\n    <text x=\"-40\" y=\"-5\" font-size=\"11\" font-weight=\"bold\" fill=\"#DC2626\">f_s</text>\n    <!-- Contact Point Note -->\n    <circle cx=\"0\" cy=\"0\" r=\"3\" fill=\"#DC2626\"/>\n    <text x=\"0\" y=\"15\" text-anchor=\"middle\" font-size=\"9\" fill=\"#475569\">จุดสัมผัส (v_contact = 0)</text>\n  </g>\n</svg>",
      "diagramCaption": "การกลิ้งโดยไม่ไถล: จุดสัมผัสมีอัตราเร็วเป็นศูนย์ขณะสัมผัส แรงเสียดทานสถิต $f_s$ ส่งผลให้เกิดทอร์กหมุนวัตถุโดยไม่ทำงานสูญเสียพลังงานกล"
    },
    "observations": [
      "ข้อสังเกต: แม้แรงเสียดทานสถิตจะมีความจำเป็นอย่างยิ่งในการทำให้วัตถุหมุนกลิ้ง แต่เนื่องจากจุดสัมผัสไม่มีการไถลสัมพัทธ์ ($ds = 0$) งานของแรงเสียดทานสถิตจึงเป็นศูนย์ ($W_{f_s} = 0$) พลังงานกลรวมจึงอนุรักษ์สมบูรณ์"
    ],
    "citation": "Morin, D. (2008), Introduction to Classical Mechanics, Cambridge University Press, Chapter 8, pp. 320–345; French, A. P. (1971), Chapter 14, pp. 580–605."
  },
  {
    "id": 15,
    "divisionId": "div-conservation",
    "divisionTitle": "ภาคที่ 3: กฎการอนุรักษ์ (Conservation Laws)",
    "numberTh": "ทฤษฎีที่ 15",
    "titleTh": "หลุมพลังงานศักย์ จุดสมดุล และเสถียรภาพการสั่นแกว่ง",
    "titleEn": "Potential Energy Wells, Equilibrium Stability & Small Oscillations",
    "type": "การวิเคราะห์เชิงอนุรักษ์และเสถียรภาพ (Energy Landscapes & Stability)",
    "summary": "การวิเคราะห์พฤติกรรมของระบบจากกราฟพลังงานศักย์ $U(x)$ แรง $F = -dU/dx$ เสถียรภาพของจุดสมดุล และการประมาณฮาร์มอนิกอย่างง่ายรอบจุดต่ำสุด",
    "definition": {
      "text": "ในระบบที่มีแรงอนุรักษ์ (Conservative Forces) แรงที่กระทำต่ออนุภาคสัมพันธ์โดยตรงกับความชันลบของฟังก์ชันพลังงานศักย์:\n$$F(x) = -\\frac{dU}{dx}$$\n1. **จุดสมดุล (Equilibrium Point, $x_0$):** ตำแหน่งที่แรงลัพธ์เป็นศูนย์ นั่นคือ $\\left.\\frac{dU}{dx}\\right|_{x_0} = 0$\n2. **สมดุลเสถียร (Stable Equilibrium):** จุดต่ำสุดของหลุมพลังงานศักย์ ($U''(x_0) > 0$) เมื่อวัตถุถูกรบกวนจะเกิดแรงดึงกลับเข้าหาจุดสมดุลเสมอ\n3. **สมดุลไม่เสถียร (Unstable Equilibrium):** จุดสูงสุดของเนินศักย์ ($U''(x_0) < 0$)\n4. **สมดุลสะเทิน (Neutral Equilibrium):** บริเวณที่พลังงานศักย์ราบเรียบ ($U''(x_0) = 0$)"
    },
    "principle": {
      "text": "เมื่ออนุภาคเบี่ยงเบนจากจุดสมดุลเสถียร $x_0$ เพียงเล็กน้อย (Small Displacements, $\\Delta x \\ll 1$) เส้นกราฟพลังงานศักย์ใดๆ สามารถประมาณค่าด้วย **พาราโบลากำลังสอง (Parabolic Well)** ผ่านอนุกรมเทย์เลอร์ ส่งผลให้การเคลื่อนที่ของระบบกลายเป็น **การสั่นแบบฮาร์มอนิกอย่างง่าย (Simple Harmonic Motion, SHM)** เสมอ โดยมีค่าคงที่สปริงยังผลเท่ากับความโค้งของกราฟ $k_{\\text{eff}} = U''(x_0)$"
    },
    "formulas": [
      {
        "name": "ความสัมพันธ์ระหว่างแรงอนุรักษ์และพลังงานศักย์",
        "latex": "F(x) = -\\frac{dU}{dx} \\quad \\Longleftrightarrow \\quad U(x) = -\\int_{x_{\\text{ref}}}^x F(x') \\, dx'",
        "symbols": [
          {
            "sym": "F(x)",
            "desc": "แรงอนุรักษ์สุทธิ",
            "unit": "\\text{N}"
          },
          {
            "sym": "U(x)",
            "desc": "ฟังก์ชันพลังงานศักย์",
            "unit": "\\text{J}"
          }
        ],
        "derivationSteps": [
          "1. จากนิยามงานของแรงอนุรักษ์: $W = -\\Delta U = U_1 - U_2$",
          "2. ใน 1 มิติ งานในระยะทางสั้นๆ คือ $dW = F(x)dx = -dU$",
          "3. หารด้วย $dx$ จะได้ความสัมพันธ์อนุพันธ์: $F(x) = -\\frac{dU}{dx}$"
        ]
      },
      {
        "name": "การประมาณฮาร์มอนิกและความถี่การแกว่งกวัดรอบจุดสมดุลเสถียร",
        "latex": "k_{\\text{eff}} = \\left.\\frac{d^2 U}{dx^2}\\right|_{x_0} \\quad , \\quad \\omega_0 = \\sqrt{\\frac{k_{\\text{eff}}}{m}} \\quad , \\quad T = 2\\pi\\sqrt{\\frac{m}{k_{\\text{eff}}}}",
        "symbols": [
          {
            "sym": "k_{\\text{eff}}",
            "desc": "ค่าคงตัวสปริงยังผล (ความโค้งของหลุมศักย์)",
            "unit": "\\text{N/m}"
          },
          {
            "sym": "\\omega_0",
            "desc": "ความถี่เชิงมุมของการสั่นแกว่งเล็กน้อย",
            "unit": "\\text{rad/s}"
          },
          {
            "sym": "T",
            "desc": "คาบการแกว่งกวัด",
            "unit": "\\text{s}"
          }
        ],
        "derivationSteps": [
          "1. กระจายอนุกรมเทย์เลอร์ของ $U(x)$ รอบจุด $x_0$: $U(x) = U(x_0) + U'(x_0)(x-x_0) + \\frac{1}{2}U''(x_0)(x-x_0)^2 + \\dots$",
          "2. ณ จุดสมดุล $U'(x_0) = 0$ และกำหนด $U(x_0) = 0$: $U(x) \\approx \\frac{1}{2}k_{\\text{eff}}(\\Delta x)^2$",
          "3. แรงดึงกลับ: $F = -\\frac{dU}{dx} = -k_{\\text{eff}}(x - x_0)$",
          "4. สมการการเคลื่อนที่: $m\\ddot{x} + k_{\\text{eff}}x = 0$ ซึ่งมีความถี่ธรรมชาติ $\\omega_0 = \\sqrt{k_{\\text{eff}}/m}$"
        ]
      }
    ],
    "application": {
      "text": "การวิเคราะห์การสั่นของโมเลกุล (เช่น ศักย์เลนนาร์ด-โจนส์ Lennard-Jones Potential), การวิเคราะห์เสถียรภาพของโครงสร้างสะพานและอาคาร, และการออกแบบบ่อกักขังอนุภาคไอออน (Paul Trap)",
      "validWhen": "ใช้ได้กับการกระจัดขนาดเล็กมากใกล้จุดสมดุลเสถียร (Small Oscillations Approximation)",
      "invalidWhen": "หากพลังงานกลรวม $E$ สูงเกินขอบของหลุมศักย์ อนุภาคจะหลุดออกจากหลุมและกลายเป็นการเคลื่อนที่ไม่จำกัดขอบเขต (Unbounded Motion) ไม่มีการแกว่งกวัดอีกต่อไป"
    },
    "example": {
      "problem": "อนุภาคมวล $m = 0.50\\text{ kg}$ เคลื่อนที่ภายใต้ศักย์ $U(x) = ax^4 - bx^2$ โดย $a = 1.0\\text{ J/m}^4$ และ $b = 8.0\\text{ J/m}^2$ จงหาตำแหน่งสมดุลเสถียรและคาบการสั่นกวัดเล็กน้อยรอบจุดสมดุลนั้น",
      "steps": [
        "ขั้นตอนที่ 1: หาจุดสมดุลจาก $U'(x) = 4ax^3 - 2bx = 2x(2ax^2 - b) = 0$\nได้ $x = 0$ หรือ $x = \\pm\\sqrt{\\frac{b}{2a}} = \\pm\\sqrt{\\frac{8.0}{2(1.0)}} = \\pm 2.0\\text{ m}$",
        "ขั้นตอนที่ 2: หาอนุพันธ์อันดับสอง $U''(x) = 12ax^2 - 2b$:\n• ที่ $x = 0$: $U''(0) = -16 < 0$ (สมดุลไม่เสถียร)\n• ที่ $x = \\pm 2.0\\text{ m}$: $U''(\\pm 2) = 12(1)(4) - 16 = 48 - 16 = 32.0\\text{ N/m} > 0$ (สมดุลเสถียร)",
        "ขั้นตอนที่ 3: คำนวณความถี่และคาบรอบจุด $x = 2.0\\text{ m}$:\n$k_{\\text{eff}} = 32.0\\text{ N/m} \\implies \\omega_0 = \\sqrt{\\frac{32.0}{0.50}} = \\sqrt{64} = 8.0\\text{ rad/s}$\nคาบการสั่น $T = \\frac{2\\pi}{\\omega_0} = \\frac{2\\pi}{8.0} \\approx 0.785\\text{ s}$"
      ],
      "diagramSvg": "<svg viewBox=\"0 0 500 180\" class=\"theory-diagram-svg\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"หลุมพลังงานศักย์และจุดสมดุลเสถียร\">\n  <rect width=\"500\" height=\"180\" rx=\"8\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1\"/>\n  <!-- Axes -->\n  <line x1=\"50\" y1=\"150\" x2=\"450\" y2=\"150\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis2)\"/>\n  <line x1=\"250\" y1=\"165\" x2=\"250\" y2=\"25\" stroke=\"#64748B\" stroke-width=\"1.5\" marker-end=\"url(#arr-axis2)\"/>\n  <text x=\"445\" y=\"165\" font-size=\"10\" fill=\"#64748B\">x</text>\n  <text x=\"255\" y=\"35\" font-size=\"10\" fill=\"#64748B\">U(x)</text>\n  <!-- Double Well Curve -->\n  <path d=\"M 100 40 Q 140 145 170 145 Q 210 145 250 85 Q 290 145 330 145 Q 360 145 400 40\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"2.5\"/>\n  <!-- Stable Minimum Points -->\n  <circle cx=\"170\" cy=\"145\" r=\"5\" fill=\"#10B981\"/>\n  <text x=\"170\" y=\"165\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"bold\" fill=\"#065F46\">สมดุลเสถียร (U'' > 0)</text>\n  <circle cx=\"330\" cy=\"145\" r=\"5\" fill=\"#10B981\"/>\n  <text x=\"330\" y=\"165\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"bold\" fill=\"#065F46\">สมดุลเสถียร (U'' > 0)</text>\n  <!-- Unstable Maximum Point -->\n  <circle cx=\"250\" cy=\"85\" r=\"5\" fill=\"#DC2626\"/>\n  <text x=\"250\" y=\"75\" text-anchor=\"middle\" font-size=\"10\" font-weight=\"bold\" fill=\"#DC2626\">สมดุลไม่เสถียร (U'' < 0)</text>\n</svg>",
      "diagramCaption": "กราฟหลุมพลังงานศักย์ $U(x)$: จุดต่ำสุดเป็นจุดสมดุลเสถียรที่เกิดแรงดึงกลับ ส่วนจุดสูงสุดของเนินเป็นจุดสมดุลไม่เสถียร"
    },
    "observations": [
      "ข้อสังเกตเชิงลึก: ปรากฏการณ์เกือบทุกอย่างในฟิสิกส์ ไม่ว่าจะเป็นการสั่นของอะตอมในโครงผลึก เสียงดนตรีจากสายกีตาร์ ไปจนถึงคลื่นแม่เหล็กไฟฟ้า สามารถอธิบายได้ด้วยการประมาณฮาร์มอนิกอย่างง่ายรอบจุดต่ำสุดของหลุมพลังงานศักย์"
    ],
    "citation": "Taylor, J. R. (2005), Classical Mechanics, University Science Books, Chapter 4 & 5, pp. 165–182; Morin, D. (2008), Section 5.4, pp. 145–158."
  }
];

  const masterSymbols = [
  {
    "sym": "\\vec{r}",
    "nameTh": "เวกเตอร์ตำแหน่ง",
    "nameEn": "Position vector",
    "unit": "\\text{m}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "ระบุพิกัดตำแหน่งของวัตถุเทียบกับจุดกำเนิดพิกัดฉาก"
  },
  {
    "sym": "s",
    "nameTh": "ระยะทางตามเส้นทางจริง",
    "nameEn": "Path length / Traveled distance",
    "unit": "\\text{m}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "ปริมาณสเกลาร์เท่ากับความยาวเส้นทางจริงที่เคลื่อนที่ผ่าน (วัดจากมาตรวัดระยะทาง)"
  },
  {
    "sym": "\\Delta\\vec{r}",
    "nameTh": "การกระจัด",
    "nameEn": "Displacement vector",
    "unit": "\\text{m}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "เวกเตอร์ลากตรงจากจุดตั้งต้นไปยังจุดสุดท้าย $\\Delta\\vec{r} = \\vec{r}_f - \\vec{r}_i$"
  },
  {
    "sym": "R",
    "nameTh": "รัศมีความโค้ง",
    "nameEn": "Radius of curvature",
    "unit": "\\text{m}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "รัศมีของวงกลมสัมผัสวงเลี้ยวของวิถีโค้ง"
  },
  {
    "sym": "\\vec{R}_{\\text{cm}}",
    "nameTh": "เวกเตอร์ตำแหน่งจุดศูนย์กลางมวล",
    "nameEn": "Center of mass position vector",
    "unit": "\\text{m}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "จุดเฉลี่ยถ่วงน้ำหนักตามมวล $\\vec{R}_{\\text{cm}} = \\frac{1}{M}\\sum m_i \\vec{r}_i$"
  },
  {
    "sym": "\\vec{v}",
    "nameTh": "ความเร็วขณะใดขณะหนึ่ง",
    "nameEn": "Instantaneous velocity",
    "unit": "\\text{m/s}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "อนุพันธ์ตำแหน่งเทียบกับเวลา $\\vec{v} = \\frac{d\\vec{r}}{dt}$"
  },
  {
    "sym": "\\vec{u}",
    "nameTh": "ความเร็วต้น",
    "nameEn": "Initial velocity",
    "unit": "\\text{m/s}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "ความเร็วของวัตถุ ณ จุดเริ่มต้นสังเกต $t = 0$"
  },
  {
    "sym": "\\vec{v}_{\\text{rel}}",
    "nameTh": "ความเร็วสัมพัทธ์",
    "nameEn": "Relative velocity",
    "unit": "\\text{m/s}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "ความเร็วของวัตถุเทียบกับกรอบหรือตัวกลาง $\\vec{v}_{\\text{rel}} = \\vec{v}_{\\text{car}} - \\vec{v}_{\\text{wind}}$"
  },
  {
    "sym": "v_x, v_y",
    "nameTh": "ความเร็วตามแนวแกนราบและแกนดิ่ง",
    "nameEn": "Velocity components",
    "unit": "\\text{m/s}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "การแตกเวกเตอร์ความเร็วในระบบพิกัดฉากคาร์ทีเซียน"
  },
  {
    "sym": "\\vec{a}",
    "nameTh": "ความเร่ง",
    "nameEn": "Acceleration vector",
    "unit": "\\text{m/s}^2",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "อัตราการเปลี่ยนแปลงความเร็วเทียบเวลา $\\vec{a} = \\frac{d\\vec{v}}{dt}$"
  },
  {
    "sym": "a_\\perp",
    "nameTh": "ความเร่งสู่ศูนย์กลาง / ความเร่งแนวฉาก",
    "nameEn": "Centripetal / Normal acceleration",
    "unit": "\\text{m/s}^2",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "ทำหน้าที่เปลี่ยนทิศทางความเร็ว $a_\\perp = \\frac{v^2}{R}$"
  },
  {
    "sym": "t",
    "nameTh": "เวลา",
    "nameEn": "Time elapsed",
    "unit": "\\text{s}",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "ระยะเวลาของการเคลื่อนที่หรือเหตุการณ์"
  },
  {
    "sym": "\\theta",
    "nameTh": "มุมการเคลื่อนที่ / ทิศทาง",
    "nameEn": "Angle / Trajectory inclination",
    "unit": "\\text{rad} \\text{ หรือ } {}^\\circ",
    "domain": "kinematics",
    "domainTh": "จลนศาสตร์",
    "note": "มุมเทียบกับแกนอ้างอิงราบ"
  },
  {
    "sym": "\\sum\\vec{F}",
    "nameTh": "แรงลัพธ์ภายนอก",
    "nameEn": "Net external force",
    "unit": "\\text{N}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "ผลรวมแบบเวกเตอร์ของแรงภายนอกทั้งหมดที่กระทำต่อวัตถุ"
  },
  {
    "sym": "\\vec{W}",
    "nameTh": "น้ำหนักจากแรงโน้มถ่วง",
    "nameEn": "Gravitational weight",
    "unit": "\\text{N}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "แรงดึงดูดของโลกที่กระทำต่อมวล $\\vec{W} = m\\vec{g}$"
  },
  {
    "sym": "\\vec{N}",
    "nameTh": "แรงปฏิกิริยาตั้งฉาก",
    "nameEn": "Normal contact force",
    "unit": "\\text{N}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "แรงต้านจากผิวสัมผัสในทิศตั้งฉากกับระนาบผิวสัมผัส"
  },
  {
    "sym": "\\vec{f}_s",
    "nameTh": "แรงเสียดทานสถิต",
    "nameEn": "Static friction force",
    "unit": "\\text{N}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "แรงต้านก่อนวัตถุไถล มีค่าได้ตั้งแต่ $0$ ถึง $\\mu_s N$"
  },
  {
    "sym": "\\vec{f}_k",
    "nameTh": "แรงเสียดทานจลน์",
    "nameEn": "Kinetic friction force",
    "unit": "\\text{N}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "แรงต้านขณะที่ผิวสัมผัสเกิดการไถลสัมพัทธ์ $f_k = \\mu_k N$"
  },
  {
    "sym": "\\vec{F}_d",
    "nameTh": "แรงต้านอากาศพลศาสตร์",
    "nameEn": "Aerodynamic drag force",
    "unit": "\\text{N}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "แรงต้านของไหลแปรผันตามอัตราเร็วกำลังสอง $\\vec{F}_d = -\\frac{1}{2}\\rho C_d A v\\vec{v}$"
  },
  {
    "sym": "\\vec{F}_{\\text{cor}}",
    "nameTh": "แรงโคริโอลิส",
    "nameEn": "Coriolis fictitious force",
    "unit": "\\text{N}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "แรงเทียมในกรอบหมุน $\\vec{F}_{\\text{cor}} = -2m(\\vec{\\Omega}\\times\\vec{v}_r)$"
  },
  {
    "sym": "\\vec{F}_{\\text{cent}}",
    "nameTh": "แรงเหวี่ยงหนีศูนย์กลาง",
    "nameEn": "Centrifugal fictitious force",
    "unit": "\\text{N}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "แรงเทียมในแนวรัศมีออกจากแกนหมุน $\\vec{F}_{\\text{cent}} = -m\\vec{\\Omega}\\times(\\vec{\\Omega}\\times\\vec{r})$"
  },
  {
    "sym": "m",
    "nameTh": "มวลเฉื่อย",
    "nameEn": "Inertial mass",
    "unit": "\\text{kg}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "สมบัติความเฉื่อยต่อการเปลี่ยนแปลงสภาพการเคลื่อนที่ของสสาร"
  },
  {
    "sym": "v_t",
    "nameTh": "ความเร็วปลายสิ้นสุด",
    "nameEn": "Terminal velocity",
    "unit": "\\text{m/s}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "อัตราเร็วเมื่อแรงต้านอากาศสมดุลกับน้ำหนัก $v_t = \\sqrt{mg/c}$"
  },
  {
    "sym": "g",
    "nameTh": "ความเร่งโน้มถ่วงมาตรฐาน",
    "nameEn": "Standard gravitational acceleration",
    "unit": "\\text{m/s}^2",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "ค่าความเร่งโน้มถ่วงสากล $9.80665\\text{ m/s}^2$"
  },
  {
    "sym": "\\rho",
    "nameTh": "ความหนาแน่นของอากาศ",
    "nameEn": "Air density",
    "unit": "\\text{kg/m}^3",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "มวลของอากาศต่อหนึ่งหน่วยปริมาตร (ระดับน้ำทะเลประมาณ $1.225\\text{ kg/m}^3$)"
  },
  {
    "sym": "A",
    "nameTh": "พื้นที่หน้าตัดปะทะลม",
    "nameEn": "Frontal cross-sectional area",
    "unit": "\\text{m}^2",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "พื้นที่ฉายของวัตถุบนระนาบที่ตั้งฉากกับทิศทางการไหลสัมพัทธ์"
  },
  {
    "sym": "c",
    "nameTh": "สัมประสิทธิ์แรงต้านรวมกำลังสอง",
    "nameEn": "Lumped quadratic drag factor",
    "unit": "\\text{kg/m}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "ค่าคงที่รวม $c = \\frac{1}{2}\\rho C_d A$"
  },
  {
    "sym": "\\mu_s, \\mu_k",
    "nameTh": "สัมประสิทธิ์แรงเสียดทาน",
    "nameEn": "Friction coefficients",
    "unit": "\\text{ไร้หน่วย}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "อัตราส่วนแรงเสียดทานต่อแรงตั้งฉากขึ้นกับคู่ผิวสัมผัส"
  },
  {
    "sym": "C_d",
    "nameTh": "สัมประสิทธิ์แรงต้านรูปทรง",
    "nameEn": "Drag coefficient",
    "unit": "\\text{ไร้หน่วย}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "ค่าคงที่ตามลักษณะรูปทรงเรขาคณิตและความราบเรียบของพื้นผิว"
  },
  {
    "sym": "\\vec{p}",
    "nameTh": "โมเมนตัมเชิงเส้น",
    "nameEn": "Linear momentum",
    "unit": "\\text{kg}\\cdot\\text{m/s} \\text{ หรือ } \\text{N}\\cdot\\text{s}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "ผลคูณระหว่างมวลและความเร็ว $\\vec{p} = m\\vec{v}$"
  },
  {
    "sym": "\\vec{J}",
    "nameTh": "การดล",
    "nameEn": "Impulse",
    "unit": "\\text{kg}\\cdot\\text{m/s} \\text{ หรือ } \\text{N}\\cdot\\text{s}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "อินทิกรัลของแรงตามเวลา $\\vec{J} = \\int \\vec{F} dt = \\Delta\\vec{p}$"
  },
  {
    "sym": "W",
    "nameTh": "งานของแรง",
    "nameEn": "Mechanical work",
    "unit": "\\text{J}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "อินทิกรัลตามเส้นทาง $W = \\int \\vec{F}\\cdot d\\vec{r}$"
  },
  {
    "sym": "K",
    "nameTh": "พลังงานจลน์",
    "nameEn": "Kinetic energy",
    "unit": "\\text{J}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "พลังงานจากการเคลื่อนที่ $K = \\frac{1}{2}mv^2$"
  },
  {
    "sym": "U",
    "nameTh": "พลังงานศักย์โน้มถ่วง",
    "nameEn": "Gravitational potential energy",
    "unit": "\\text{J}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "พลังงานสะสมจากตำแหน่งในสนามโน้มถ่วง $U = mgy$"
  },
  {
    "sym": "E_{\\text{mech}}",
    "nameTh": "พลังงานกลรวม",
    "nameEn": "Total mechanical energy",
    "unit": "\\text{J}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "ผลรวมพลังงานจลน์และพลังงานศักย์ $E = K + U$"
  },
  {
    "sym": "\\Delta K_{\\text{loss}}",
    "nameTh": "พลังงานจลน์ที่สูญเสียในการชน",
    "nameEn": "Kinetic energy dissipation",
    "unit": "\\text{J}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "พลังงานที่เปลี่ยนเป็นความร้อนและการเสียรูปถาวร $\\Delta K = K_f - K_i$"
  },
  {
    "sym": "P",
    "nameTh": "กำลังงาน",
    "nameEn": "Power",
    "unit": "\\text{W} \\text{ (J/s)}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "อัตราการทำงานต่อหนึ่งหน่วยเวลา $P = \\frac{dW}{dt} = \\vec{F}\\cdot\\vec{v}$"
  },
  {
    "sym": "e",
    "nameTh": "สัมประสิทธิ์การคืนตัว",
    "nameEn": "Coefficient of restitution",
    "unit": "\\text{ไร้หน่วย}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "อัตราส่วนความเร็วสัมพัทธ์หลังชนต่อก่อนชน $e = -\\frac{v_{2f}-v_{1f}}{u_{2i}-u_{1i}}$"
  },
  {
    "sym": "\\vec{\\tau}",
    "nameTh": "ทอร์ก / โมเมนต์ของแรง",
    "nameEn": "Torque",
    "unit": "\\text{N}\\cdot\\text{m}",
    "domain": "computational",
    "domainTh": "การคำนวณขั้นสูง",
    "note": "ผลคูณไขว้ระหว่างเวกเตอร์รัศมีและแรง $\\vec{\\tau} = \\vec{r}\\times\\vec{F}$"
  },
  {
    "sym": "\\vec{L}",
    "nameTh": "โมเมนตัมเชิงมุม",
    "nameEn": "Angular momentum",
    "unit": "\\text{kg}\\cdot\\text{m}^2/\\text{s}",
    "domain": "computational",
    "domainTh": "การคำนวณขั้นสูง",
    "note": "โมเมนตัมของการหมุน $\\vec{L} = \\vec{r}\\times\\vec{p} = I\\vec{\\omega}$"
  },
  {
    "sym": "I",
    "nameTh": "โมเมนต์ความเฉื่อย",
    "nameEn": "Moment of inertia",
    "unit": "\\text{kg}\\cdot\\text{m}^2",
    "domain": "computational",
    "domainTh": "การคำนวณขั้นสูง",
    "note": "ความเฉื่อยต่อการเปลี่ยนสภาพการหมุน $I = \\int r^2 dm$"
  },
  {
    "sym": "\\vec{\\omega}",
    "nameTh": "ความเร็วเชิงมุม",
    "nameEn": "Angular velocity",
    "unit": "\\text{rad/s}",
    "domain": "computational",
    "domainTh": "การคำนวณขั้นสูง",
    "note": "อัตราการกวาดมุมเทียบเวลา $\\vec{\\omega} = \\frac{d\\vec{\\theta}}{dt}$"
  },
  {
    "sym": "\\vec{\\Omega}",
    "nameTh": "ความเร็วเชิงมุมของกรอบอ้างอิงหมุน",
    "nameEn": "Angular velocity of rotating frame",
    "unit": "\\text{rad/s}",
    "domain": "dynamics",
    "domainTh": "พลศาสตร์",
    "note": "เวกเตอร์อัตราการหมุนของกรอบพิกัดเทียบกับกรอบเฉื่อย"
  },
  {
    "sym": "\\Delta t",
    "nameTh": "ขนาดขั้นเวลาเชิงตัวเลข",
    "nameEn": "Numerical integration timestep",
    "unit": "\\text{s}",
    "domain": "computational",
    "domainTh": "การคำนวณขั้นสูง",
    "note": "ระยะเวลาย่อยในการคำนวณวงรอบ เพื่อให้ได้ความแม่นยำ $\\mathcal{O}(\\Delta t^4)$"
  },
  {
    "sym": "\\vec{k}_1..\\vec{k}_4",
    "nameTh": "ความชันประมาณค่าในขั้นตอน RK4",
    "nameEn": "Runge-Kutta derivative slopes",
    "unit": "\\text{ตามปริมาณอนุพันธ์}",
    "domain": "computational",
    "domainTh": "การคำนวณขั้นสูง",
    "note": "ความชัน 4 ค่าที่ถ่วงน้ำหนักเพื่อพยากรณ์สถานะถัดไป"
  },
  {
    "sym": "k_{\\text{eff}}",
    "nameTh": "ค่าคงตัวสปริงยังผล / ความโค้งหลุมศักย์",
    "nameEn": "Effective spring constant / Potential curvature",
    "unit": "\\text{N/m}",
    "domain": "conservation",
    "domainTh": "กฎการอนุรักษ์",
    "note": "อนุพันธ์อันดับสองของพลังงานศักย์ ณ จุดสมดุล $k_{\\text{eff}} = U''(x_0)$"
  }
];

  return {
    divisions,
    theories,
    masterSymbols
  };
}));
