/**
 * chapter02_circular_content.js - Master Curriculum Data for Chapter 02
 * Module ID: PHYSICS-CHAPTERS-002-007-001 (Chapter 02)
 * Scope: Circular Motion, Centripetal Acceleration, Banked Turns, Vertical Loops & Gravitational Orbits
 * Verification: Pinned to Cambridge DAMTP (David Tong), Morin Classical Mechanics, Halliday & Resnick, and AASHTO Standards.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Chapter02Content = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    meta: {
      chapterId: "ch02",
      chapterNumber: 2,
      titleTh: "การเคลื่อนที่แบบวงกลมและแรงสู่ศูนย์กลาง",
      titleEn: "Circular Motion, Centripetal Dynamics & Gravitational Orbits",
      descriptionTh: "ศึกษาพารามิเตอร์เชิงมุม ความเร่งสู่ศูนย์กลางและความเร่งแนวสัมผัส พลศาสตร์ของแรงสู่ศูนย์กลางในฐานะแรงลัพธ์แนวรัศมี ทางโค้งราบและทางโค้งยกมุมเอียง วงกลมแนวดิ่ง และวงโคจรดาวเทียม",
      prerequisitesTh: "จลนศาสตร์ 1 มิติและ 2 มิติ (เวกเตอร์ ความเร็ว ความเร่ง), กฎการเคลื่อนที่ของนิวตัน, งานและพลังงานกล",
      scopeAndPendingTh: "ขอบเขตในบทนี้จำกัดที่การเคลื่อนที่ในระนาบ 2 มิติ รัศมีความโค้งคงที่หรือระบุชัดเจน และแบบจำลองมวลจุด (ยังไม่รวมเทนเซอร์ความเฉื่อยของวัตถุแข็งเกร็ง 3 มิติและการหมุนรอบแกนอิสระ ซึ่งจัดอยู่ในบทถัดไป)"
    },

    divisions: [
      {
        id: "div-ch02-kinematics",
        numeral: "ภาคที่ 1",
        titleTh: "จลนศาสตร์ของการเคลื่อนที่แบบวงกลม (Kinematics of Circular Motion)",
        description: "การบรรยายตำแหน่ง ความเร็วเชิงมุม และความเร่งในระบบพิกัดเชิงขั้ว ทั้งกรณีอัตราเร็วคงตัวและไม่คงตัว"
      },
      {
        id: "div-ch02-dynamics",
        numeral: "ภาคที่ 2",
        titleTh: "พลศาสตร์และวิศวกรรมแรงสู่ศูนย์กลาง (Centripetal Dynamics & Engineering Applications)",
        description: "การวิเคราะห์แรงลัพธ์แนวรัศมีตามกฎข้อ 2 ของนิวตัน ทางโค้งยกมุมเอียง วงกลมแนวดิ่ง และวงโคจรแรงโน้มถ่วง"
      }
    ],

    masterSymbols: [
      {
        symbol: "\\theta",
        name: "การกระจัดเชิงมุม (Angular Displacement)",
        unit: "\\text{rad}",
        domain: "kinematics",
        desc: "มุมที่กวาดไปรอบแกนหมุนหรือจุดศูนย์กลาง นิยามจากอัตราส่วนความยาวส่วนโค้งต่อรัศมี s/r (มิติตัวเลขบริสุทธิ์)"
      },
      {
        symbol: "\\omega",
        name: "ความเร็วเชิงมุม (Angular Velocity)",
        unit: "\\text{rad/s}",
        domain: "kinematics",
        desc: "อัตราการเปลี่ยนแปลงการกระจัดเชิงมุมเทียบกับเวลา dθ/dt สัมพันธ์กับอัตราเร็วแนวสัมผัส v = ωr"
      },
      {
        symbol: "\\alpha",
        name: "ความเร่งเชิงมุม (Angular Acceleration)",
        unit: "\\text{rad/s}^2",
        domain: "kinematics",
        desc: "อัตราการเปลี่ยนแปลงความเร็วเชิงมุม dω/dt สัมพันธ์กับความเร่งแนวสัมผัส a_t = rα"
      },
      {
        symbol: "a_c",
        name: "ความเร่งสู่ศูนย์กลาง (Centripetal Acceleration)",
        unit: "\\text{m/s}^2",
        domain: "kinematics",
        desc: "องค์ประกอบความเร่งที่ชี้เข้าหาจุดศูนย์กลางความโค้ง เกิดจากการเปลี่ยนทิศทางของเวกเตอร์ความเร็ว a_c = v²/r = ω²r"
      },
      {
        symbol: "a_t",
        name: "ความเร่งแนวสัมผัส (Tangential Acceleration)",
        unit: "\\text{m/s}^2",
        domain: "kinematics",
        desc: "องค์ประกอบความเร่งในแนวขนานกับเวกเตอร์ความเร็ว เกิดจากการเปลี่ยนแปลงขนาดของอัตราเร็ว a_t = dv/dt"
      },
      {
        symbol: "T",
        name: "คาบเวลาของการเคลื่อนที่ (Period)",
        unit: "\\text{s}",
        domain: "kinematics",
        desc: "ช่วงเวลาที่อนุภาคใช้ในการเคลื่อนที่ครบรอบ 1 รอบ T = 2π/ω = 1/f"
      },
      {
        symbol: "f",
        name: "ความถี่ของการหมุน (Frequency)",
        unit: "\\text{Hz} = \\text{s}^{-1}",
        domain: "kinematics",
        desc: "จำนวนรอบการเคลื่อนที่ต่อหนึ่งหน่วยวินาที f = 1/T = ω/(2π)"
      },
      {
        symbol: "F_c",
        name: "แรงสู่ศูนย์กลาง (Centripetal Force)",
        unit: "\\text{N}",
        domain: "dynamics",
        desc: "แรงลัพธ์สุทธิในแนวรัศมีที่ชี้เข้าหาศูนย์กลางความโค้ง ΣF_r = m a_c = m v²/r ไม่ใช่แรงใหม่ที่งอกขึ้นมาเอง"
      },
      {
        symbol: "\\theta_{\\text{bank}}",
        name: "มุมเอียงของทางโค้ง (Bank Angle)",
        unit: "\\text{rad} \\text{ หรือ } ^\\circ",
        domain: "dynamics",
        desc: "มุมที่ผิวถนนหรือรางรถไฟยกตัวขึ้นจากแนวระนาบ เพื่อให้องค์ประกอบแรงตั้งฉากช่วยสร้างแรงสู่ศูนย์กลาง"
      },
      {
        symbol: "\\mu_s",
        name: "สัมประสิทธิ์แรงเสียดทานสถิต (Static Friction Coeff.)",
        unit: "—",
        domain: "dynamics",
        desc: "อัตราส่วนแรงเสียดทานสถิตสูงสุดต่อแรงปฏิกิริยาตั้งฉาก f_s,max / N ป้องกันการลื่นไถลออกนอกโค้ง"
      },
      {
        symbol: "N",
        name: "แรงปฏิกิริยาตั้งฉาก (Normal Force)",
        unit: "\\text{N}",
        domain: "dynamics",
        desc: "แรงที่พื้นผิวสัมผัสกระทำต่อวัตถุในแนวตั้งฉากกับผิวสัมผัส แปรผันตามตำแหน่งในวงกลมแนวดิ่ง"
      },
      {
        symbol: "v_{\\text{crit}}",
        name: "อัตราเร็ววิกฤตที่จุดสูงสุด (Critical Speed at Apex)",
        unit: "\\text{m/s}",
        domain: "dynamics",
        desc: "อัตราเร็วขั้นต่ำสุดที่จุดสูงสุดของวงกลมแนวดิ่งที่ทำให้เชือกยังตึงหรือวัตถุไม่ตกจากราง v_crit = √(gr)"
      }
    ],

    theories: [
      // ----------------------------------------------------------------------
      // Theory 1: Polar Coordinates & Angular Kinematics
      // ----------------------------------------------------------------------
      {
        id: "ch02-th01",
        chapterId: "ch02",
        divisionId: "div-ch02-kinematics",
        divisionTitle: "ภาคที่ 1: จลนศาสตร์ของการเคลื่อนที่แบบวงกลม",
        numberTh: "ทฤษฎีที่ 1",
        type: "นิยามและระบบพิกัด (Definitions & Coordinate Systems)",
        titleTh: "พิกัดเชิงขั้ว การกระจัดเชิงมุม คาบ และความถี่",
        titleEn: "Polar Coordinates, Angular Displacement, Period & Frequency",
        summary: "การระบุตำแหน่งด้วยระยะรัศมีและมุมเรเดียน เวกเตอร์หนึ่งหน่วยที่หมุนตามเวลา และความสัมพันธ์ระหว่างตัวแปรเชิงมุมกับตัวแปรเชิงเส้น",
        definition: {
          text: "การเคลื่อนที่แบบวงกลม (Circular Motion) คือการเคลื่อนที่ของอนุภาคบนแนววิถีระนาบ 2 มิติที่มีระยะห่าง $r$ จากจุดศูนย์กลางตรึงแน่นคงที่ โดยตำแหน่งของอนุภาค ณ ขณะเวลา $t$ ถูกระบุด้วยระบบพิกัดเชิงขั้ว (Polar Coordinates) ผ่านระยะ $r$ และมุม $\\theta(t)$ (หน่วยเรเดียน: $\\text{rad}$) เทียบกับแกนอ้างอิง:\n1. **การกระจัดเชิงมุม (Angular Displacement, $\\Delta\\theta$):** ผลต่างของมุม $\\Delta\\theta = \\theta_f - \\theta_i$ โดย $1\\text{ rad}$ คือมุมที่รองรับส่วนโค้งยาวเท่ากับรัศมี ($s = r\\theta$)\n2. **ความเร็วเชิงมุมขณะใดขณะหนึ่ง (Instantaneous Angular Velocity, $\\omega$):** อัตราการเปลี่ยนแปลงมุมเทียบกับเวลา $\\omega = \\frac{d\\theta}{dt}$\n3. **คาบ (Period, $T$):** เวลาที่ใช้ในการเคลื่อนที่ครบหนึ่งรอบบริบูรณ์ ($2\\pi\\text{ rad}$)\n4. **ความถี่ (Frequency, $f$):** จำนวนรอบการหมุนในหนึ่งหน่วยเวลา มีความสัมพันธ์พื้นฐาน $T = \\frac{1}{f} = \\frac{2\\pi}{\\omega}$"
        },
        principle: {
          text: "ในระบบพิกัดเชิงขั้ว เวกเตอร์หนึ่งหน่วย $\\hat{r}$ (ชี้ออกจากจุดศูนย์กลาง) และ $\\hat{\\theta}$ (ชี้ในทิศมุมเพิ่มขึ้นตามแนวสัมผัส) ไม่คงที่ แต่หมุนไปตามการเคลื่อนที่ของอนุภาค:\n• $\\frac{d\\hat{r}}{dt} = \\dot{\\theta}\\hat{\\theta} = \\omega\\hat{\\theta}$\n• $\\frac{d\\hat{\\theta}}{dt} = -\\dot{\\theta}\\hat{r} = -\\omega\\hat{r}$\nเวกเตอร์ตำแหน่งคือ $\\vec{r} = r\\hat{r}$ ดังนั้นอนุพันธ์เทียบกับเวลา (ความเร็ว) จึงเป็น $\\vec{v} = \\frac{d\\vec{r}}{dt} = \\dot{r}\\hat{r} + r\\dot{\\hat{r}}$ สำหรับวงกลมรัศมีคงที่ ($\\dot{r} = 0$) จะได้ $\\vec{v} = r\\omega\\hat{\\theta}$ ซึ่งชี้ในแนวสัมผัสเสมอ โดยมีขนาดอัตราเร็วเชิงเส้นสัมพันธ์โดยตรงกับอัตราเร็วเชิงมุม $v = \\omega r$"
        },
        formulas: [
          {
            name: "นิยามมุมเรเดียนและความเร็วเชิงมุมขณะใดขณะหนึ่ง",
            latex: "\\theta = \\frac{s}{r}, \\quad \\omega(t) = \\lim_{\\Delta t \\to 0}\\frac{\\Delta\\theta}{\\Delta t} = \\frac{d\\theta}{dt}, \\quad v = \\omega r",
            symbols: [
              { sym: "s", desc: "ความยาวส่วนโค้งที่อนุภาคเคลื่อนที่ผ่าน", unit: "\\text{m}" },
              { sym: "r", desc: "รัศมีความโค้งของแนวทางเดินวงกลม", unit: "\\text{m}" },
              { sym: "\\theta", desc: "การกระจัดเชิงมุม", unit: "\\text{rad}" },
              { sym: "\\omega", desc: "ความเร็วเชิงมุมขณะใดขณะหนึ่ง", unit: "\\text{rad/s}" },
              { sym: "v", desc: "อัตราเร็วเชิงเส้นในแนวสัมผัส", unit: "\\text{m/s}" }
            ],
            derivationSteps: [
              "1. จากนิยามเรเดียน: $s = r\\theta$",
              "2. หาอนุพันธ์เทียบกับเวลาทั้งสองข้าง: $\\frac{ds}{dt} = \\frac{d}{dt}(r\\theta)$",
              "3. เนื่องจากรัศมี $r$ คงที่ ดึง $r$ ออกมานอกอนุพันธ์: $v = r\\frac{d\\theta}{dt} = r\\omega$"
            ]
          },
          {
            name: "ความสัมพันธ์ของคาบ ความถี่ และอัตราเร็วเชิงมุม",
            latex: "T = \\frac{2\\pi r}{v} = \\frac{2\\pi}{\\omega} = \\frac{1}{f}, \\quad \\omega = 2\\pi f = \\frac{2\\pi}{T}",
            symbols: [
              { sym: "T", desc: "คาบของการเคลื่อนที่ครบ 1 รอบ", unit: "\\text{s}" },
              { sym: "f", desc: "ความถี่ของการหมุนต่อวินาที", unit: "\\text{Hz}" },
              { sym: "\\omega", desc: "อัตราเร็วเชิงมุม", unit: "\\text{rad/s}" }
            ],
            derivationSteps: [
              "1. ในการเคลื่อนที่ครบ 1 รอบ อนุภาคเดินทางได้ระยะทาง $s = 2\\pi r$ ด้วยอัตราเร็วคงตัว $v$",
              "2. คาบเวลา $T = \\frac{s}{v} = \\frac{2\\pi r}{\\omega r} = \\frac{2\\pi}{\\omega}$",
              "3. นิยามความถี่ $f = \\frac{1}{T}$ ทำให้ได้ $\\omega = 2\\pi f$"
            ]
          }
        ],
        application: {
          text: "การแปลงหน่วยรอบต่อนาที (RPM: Revolutions per Minute) สู่หน่วยมาตรฐาน SI (rad/s) เพื่อคำนวณในระบบควบคุมเครื่องกล เช่น กังหันไอน้ำ มอเตอร์ไฟฟ้า เพลาขับยานยนต์ การอ่านค่าเกียร์ส่งกำลัง และจานหมุนฮาร์ดดิสก์",
          validWhen: "ใช้ได้เมื่อแนวทางการเคลื่อนที่มีจุดหมุนหรือจุดศูนย์กลางตรึงแน่นและรัศมีคงที่ในระนาบ",
          invalidWhen: "ห้ามนำมุมในหน่วยองศา (°/s) ไปคูณกับรัศมีเพื่อหาความเร็วเชิงเส้นโดยตรง ต้องแปลงเป็นเรเดียนก่อนเสมอ (1 รอบ = 360° = 2π rad)"
        },
        example: {
          problem: "ใบพัดระบายความร้อนของเครื่องยนต์หมุนด้วยอัตราคงตัว 2,400 rpm โดยปลายใบพัดอยู่ห่างจากแกนหมุนกึ่งกลาง $r = 25.0\\text{ cm}$ จงหา: (ก) ความถี่และคาบการหมุน (ข) ความเร็วเชิงมุมในหน่วย rad/s และ (ค) อัตราเร็วเชิงเส้นที่ปลายใบพัด",
          steps: [
            "ขั้นตอนที่ 1: หาความถี่จากการแปลงหน่วย rpm สู่รอบต่อวินาที (Hz): $f = \\frac{2,400}{60\\text{ s}} = 40.0\\text{ Hz}$",
            "ขั้นตอนที่ 2: หาคาบเวลา: $T = \\frac{1}{f} = \\frac{1}{40.0} = 0.0250\\text{ s} = 25.0\\text{ ms}$",
            "ขั้นตอนที่ 3: หาความเร็วเชิงมุม: $\\omega = 2\\pi f = 2\\pi(40.0) = 80\\pi \\approx 251.33\\text{ rad/s}$",
            "ขั้นตอนที่ 4: แปลงรัศมีเป็นหน่วย SI: $r = 25.0\\text{ cm} = 0.250\\text{ m}$",
            "ขั้นตอนที่ 5: หาอัตราเร็วเชิงเส้นที่ปลายใบพัด: $v = \\omega r = (251.33)(0.250) \\approx 62.83\\text{ m/s}$ (ประมาณ $226.2\\text{ km/h}$)"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพความสัมพันธ์เชิงมุมและเชิงเส้น">
            <defs>
              <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#38BDF8"/></marker>
              <marker id="arr-orange" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#EA580C"/></marker>
            </defs>
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <circle cx="160" cy="90" r="6" fill="#94A3B8"/>
            <text x="160" y="115" fill="#94A3B8" font-size="11" text-anchor="middle">จุดศูนย์กลาง (O)</text>
            <circle cx="160" cy="90" r="60" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,4"/>
            <line x1="160" y1="90" x2="202" y2="48" stroke="#38BDF8" stroke-width="2" marker-end="url(#arr-blue)"/>
            <text x="180" y="65" fill="#38BDF8" font-size="12" font-weight="bold">r</text>
            <circle cx="202" cy="48" r="6" fill="#F8FAFC"/>
            <line x1="202" y1="48" x2="244" y2="90" stroke="#EA580C" stroke-width="2.5" marker-end="url(#arr-orange)"/>
            <text x="248" y="85" fill="#EA580C" font-size="12" font-weight="bold">v = ωr</text>
            <path d="M 160 50 A 40 40 0 0 1 200 90" fill="none" stroke="#10B981" stroke-width="2" marker-end="url(#arr-blue)"/>
            <text x="185" y="45" fill="#10B981" font-size="12" font-weight="bold">ω (rad/s)</text>
            <g transform="translate(310, 25)">
              <rect width="190" height="130" rx="6" fill="#1E293B" stroke="#38BDF8" stroke-width="1"/>
              <text x="95" y="25" fill="#38BDF8" font-size="12" font-weight="bold" text-anchor="middle">สูตรการแปลงพื้นฐาน</text>
              <text x="15" y="52" fill="#F8FAFC" font-size="11">• 1 rev = 2π rad</text>
              <text x="15" y="74" fill="#F8FAFC" font-size="11">• ω = 2π × (rpm / 60)</text>
              <text x="15" y="96" fill="#F8FAFC" font-size="11">• v = ωr (m/s)</text>
              <text x="15" y="118" fill="#F8FAFC" font-size="11">• T = 2π / ω = 1 / f</text>
            </g>
          </svg>`,
          diagramCaption: "แผนภาพพิกัดเชิงขั้ว: อนุภาคที่ตำแหน่งรัศมี $r$ มีเวกเตอร์ความเร็วแนวสัมผัส $v = \\omega r$ ตั้งฉากกับเวกเตอร์รัศมีเสมอ"
        },
        observations: [
          "ความเข้าใจผิดที่พบบ่อย: การนำอัตราเร็วเชิงมุมในหน่วยองศาต่อวินาที (°/s) ไปคูณกับรัศมีโดยตรง จะทำให้หน่วยผิดพลาดเป็น เมตร·องศา/วินาที ซึ่งไม่ตรงกับหน่วย SI! เรเดียนเป็นอัตราส่วนความยาวต่อความยาว (m/m) จึงไม่มีมิติ ทำให้ผลลัพธ์มีหน่วยเป็น m/s อย่างแท้จริง",
          "จุดสองจุดบนแผ่นดิสก์เดียวกันที่กำลังหมุน จะมีความเร็วเชิงมุม ω เท่ากันทุกประการ แต่อัตราเร็วเชิงเส้น v จะแปรผันตรงตามระยะห่างจากแกนหมุน r (จุดที่ขอบนอกสุดจะวิ่งเร็วกว่าจุดที่อยู่ใกล้แกน)"
        ],
        citation: "David Tong (2005). Classical Dynamics. University of Cambridge DAMTP, Chapter 1, pp. 8–12; Halliday & Resnick (2014), Sec. 4.7.",
        citations: [
          {
            title: "Classical Dynamics (Cambridge Tripos Lecture Notes)",
            authors: "David Tong",
            source: "University of Cambridge DAMTP, Chapter 1, pp. 8–12",
            year: "2005",
            url: "https://www.damtp.cam.ac.uk/user/tong/dynamics.html",
            verificationStatus: "verified_direct_content",
            evidencePin: "DAMTP Classical Dynamics Ch. 1 pp. 8–12: Polar coordinates unit vectors differentiation d(r̂)/dt = θ̇θ̂ and d(θ̂)/dt = -θ̇r̂",
            note: "การอนุพันธ์เวกเตอร์หนึ่งหน่วยในพิกัดเชิงขั้ว"
          },
          {
            title: "Fundamentals of Physics (10th Edition)",
            authors: "Halliday, D., Resnick, R., Walker, J.",
            source: "John Wiley & Sons, Chapter 4 (Motion in Two and Three Dimensions: Uniform Circular Motion), pp. 78–82",
            year: "2014",
            url: "https://www.wiley.com/en-us/Fundamentals+of+Physics%2C+10th+Edition-p-9781118230718",
            verificationStatus: "pending_content_verification",
            pendingReason: "ลิงก์สำนักพิมพ์ Wiley — ตรวจสอบสูตรทางคณิตศาสตร์แล้ว รอเทียบเลขหน้าฉบับพิมพ์จริง",
            note: "นิยามอัตราเร็วเชิงมุม คาบ และความถี่"
          }
        ]
      },

      // ----------------------------------------------------------------------
      // Theory 2: Centripetal & Tangential Acceleration
      // ----------------------------------------------------------------------
      {
        id: "ch02-th02",
        chapterId: "ch02",
        divisionId: "div-ch02-kinematics",
        divisionTitle: "ภาคที่ 1: จลนศาสตร์ของการเคลื่อนที่แบบวงกลม",
        numberTh: "ทฤษฎีที่ 2",
        type: "หลักการและการอนุมาน (Principles & Derivations)",
        titleTh: "ความเร่งสู่ศูนย์กลางและความเร่งแนวสัมผัส",
        titleEn: "Centripetal & Tangential Acceleration in Circular Paths",
        summary: "การแยกองค์ประกอบความเร่งเป็นแนวรัศมี (เปลี่ยนทิศทางความเร็ว) และแนวสัมผัส (เปลี่ยนขนาดความเร็ว) พร้อมการหาขนาดความเร่งลัพธ์",
        definition: {
          text: "เวกเตอร์ความเร่งของการเคลื่อนที่บนแนววิถีโค้งระนาบใดๆ $\\vec{a} = \\frac{d\\vec{v}}{dt}$ สามารถแยกเป็นสององค์ประกอบที่ตั้งฉากซึ่งกันและกันอย่างสมบูรณ์:\n1. **ความเร่งสู่ศูนย์กลาง (Centripetal Acceleration, $\\vec{a}_c$ หรือ $\\vec{a}_r$):** องค์ประกอบในแนวรัศมีที่ชี้เข้าหาจุดศูนย์กลางความโค้ง เกิดจากการเปลี่ยนแปลงทิศทางของเวกเตอร์ความเร็ว มีขนาด $a_c = \\frac{v^2}{r} = \\omega^2 r$\n2. **ความเร่งแนวสัมผัส (Tangential Acceleration, $\\vec{a}_t$):** องค์ประกอบในแนวสัมผัสกับเส้นทางเดิน เกิดจากการเปลี่ยนแปลงขนาดของอัตราเร็ว มีขนาด $a_t = \\frac{dv}{dt} = r\\alpha$"
        },
        principle: {
          text: "การอนุพันธ์เวกเตอร์ความเร็ว $\\vec{v} = r\\omega\\hat{\\theta}$ เทียบกับเวลา โดยใช้กฎผลคูณและอนุพันธ์เวกเตอร์หนึ่งหน่วย:\n$$\\vec{a} = \\frac{d\\vec{v}}{dt} = \\frac{d}{dt}(r\\dot{\\theta}\\hat{\\theta}) = \\ddot{r}\\hat{r} + \\dot{r}\\dot{\\hat{r}} + r\\ddot{\\theta}\\hat{\\theta} + r\\dot{\\theta}\\dot{\\hat{\\theta}}$$\nสำหรับวงกลมรัศมีคงตัว ($r = \\text{const}$, $\\dot{r} = \\ddot{r} = 0$):\n$$\\vec{a} = r\\alpha\\hat{\\theta} + r\\omega(-\\omega\\hat{r}) = -\\omega^2 r\\hat{r} + r\\alpha\\hat{\\theta} = -\\frac{v^2}{r}\\hat{r} + a_t\\hat{\\theta}$$\nเครื่องหมายลบหน้า $\\hat{r}$ ยืนยันทางคณิตศาสตร์ว่าความเร่งสู่ศูนย์กลางต้องชี้เข้าหาจุดกำเนิดเสมอ สำหรับการเคลื่อนที่แบบวงกลมสม่ำเสมอ (Uniform Circular Motion: UCM) อัตราเร็วคงตัวทำให้ $a_t = 0$ เหลือเฉพาะ $a_c$ แต่ถ้าอัตราเร็วไม่คงตัว ความเร่งรวมจะมีขนาด $a = \\sqrt{a_c^2 + a_t^2}$"
        },
        formulas: [
          {
            name: "สมการเวกเตอร์ความเร่งรวมในพิกัดเชิงขั้ว",
            latex: "\\vec{a} = \\vec{a}_c + \\vec{a}_t = -\\frac{v^2}{r}\\hat{r} + \\frac{dv}{dt}\\hat{\\theta} = -\\omega^2 r\\hat{r} + r\\alpha\\hat{\\theta}",
            symbols: [
              { sym: "\\vec{a}", desc: "เวกเตอร์ความเร่งรวม", unit: "\\text{m/s}^2" },
              { sym: "a_c", desc: "ขนาดความเร่งสู่ศูนย์กลาง (ชี้เข้าจุดศูนย์กลาง)", unit: "\\text{m/s}^2" },
              { sym: "a_t", desc: "ขนาดความเร่งแนวสัมผัส (ทิศเดียวหรือตรงข้ามกับความเร็ว)", unit: "\\text{m/s}^2" },
              { sym: "\\alpha", desc: "ความเร่งเชิงมุม dω/dt", unit: "\\text{rad/s}^2" }
            ],
            derivationSteps: [
              "1. เวกเตอร์ความเร็ว: $\\vec{v} = v\\hat{\\theta} = r\\omega\\hat{\\theta}$",
              "2. หาอนุพันธ์เทียบกับเวลา: $\\vec{a} = \\frac{dv}{dt}\\hat{\\theta} + v\\frac{d\\hat{\\theta}}{dt}$",
              "3. แทนค่าอนุพันธ์เวกเตอร์หนึ่งหน่วย $\\frac{d\\hat{\\theta}}{dt} = -\\omega\\hat{r}$",
              "4. ได้: $\\vec{a} = a_t\\hat{\\theta} - v\\omega\\hat{r} = -\\frac{v^2}{r}\\hat{r} + a_t\\hat{\\theta}$"
            ]
          },
          {
            name: "ขนาดความเร่งรวมและมุมทิศทาง",
            latex: "a_{\\text{total}} = \\sqrt{a_c^2 + a_t^2} = \\sqrt{\\left(\\frac{v^2}{r}\\right)^2 + a_t^2}, \\quad \\tan\\phi = \\frac{a_c}{a_t}",
            symbols: [
              { sym: "a_{\\text{total}}", desc: "ขนาดของความเร่งรวมสุทธิ", unit: "\\text{m/s}^2" },
              { sym: "\\phi", desc: "มุมระหว่างเวกเตอร์ความเร่งรวมกับแนวสัมผัส", unit: "\\text{rad}" }
            ],
            derivationSteps: [
              "1. เนื่องจากเวกเตอร์ $\\hat{r}$ และ $\\hat{\\theta}$ ตั้งฉากกันเสมอ (Orthogonal basis: $\\hat{r} \\cdot \\hat{\\theta} = 0$)",
              "2. ใช้ทฤษฎีบทพีทาโกรัสหาขนาดเวกเตอร์ผลบวก: $a_{\\text{total}} = \\sqrt{a_c^2 + a_t^2}$"
            ]
          }
        ],
        application: {
          text: "การวิเคราะห์แรงกระทำต่อตัวนักบินขับไล่ (G-suit / G-LOC) ขณะบินเลี้ยวหักศอก, การคำนวณอัตราเร่งของรถแข่ง Formula 1 บนโค้ง Chicane ที่ต้องเบรกขณะเข้าโค้งและเร่งเครื่องขณะออกจากโค้ง",
          validWhen: "ใช้ได้กับการเคลื่อนที่บนระนาบโค้งทุกชนิด โดย $r$ คือรัศมีความโค้ง ณ จุดนั้นๆ (Radius of Curvature)",
          invalidWhen: "ไม่สามารถละเลยความเร่งสู่ศูนย์กลางได้แม้อัตราเร็วคงที่ เพราะทิศทางของเวกเตอร์ความเร็วหมุนเปลี่ยนตลอดเวลา"
        },
        example: {
          problem: "รถแข่งวิ่งบนลู่โค้งรัศมี $r = 80.0\\text{ m}$ ขณะผ่านจุดหนึ่งมีความเร็ว $v = 20.0\\text{ m/s}$ และคนขับเหยียบคันเร่งทำให้ความเร็วเพิ่มขึ้นด้วยอัตราเร่งแนวสัมผัสคงที่ $a_t = 3.00\\text{ m/s}^2$ จงหาขนาดของความเร่งรวมและมุมที่ทำกับแนวสัมผัส",
          steps: [
            "ขั้นตอนที่ 1: คำนวณความเร่งสู่ศูนย์กลาง: $a_c = \\frac{v^2}{r} = \\frac{(20.0)^2}{80.0} = \\frac{400}{80.0} = 5.00\\text{ m/s}^2$",
            "ขั้นตอนที่ 2: ความเร่งแนวสัมผัสระบุมาโดยตรง: $a_t = 3.00\\text{ m/s}^2$",
            "ขั้นตอนที่ 3: คำนวณขนาดความเร่งรวม: $a_{\\text{total}} = \\sqrt{a_c^2 + a_t^2} = \\sqrt{5.00^2 + 3.00^2} = \\sqrt{25 + 9} = \\sqrt{34} \\approx 5.83\\text{ m/s}^2$",
            "ขั้นตอนที่ 4: หามุมเทียบกับแนวสัมผัส: $\\phi = \\arctan\\left(\\frac{a_c}{a_t}\\right) = \\arctan\\left(\\frac{5.00}{3.00}\\right) \\approx 59.04^\\circ$"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพความเร่งสู่ศูนย์กลางและความเร่งแนวสัมผัส">
            <defs>
              <marker id="arr-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#EF4444"/></marker>
              <marker id="arr-green" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#10B981"/></marker>
              <marker id="arr-purple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#A855F7"/></marker>
            </defs>
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <path d="M 80 160 A 120 120 0 0 1 240 40" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="4,4"/>
            <circle cx="80" cy="40" r="4" fill="#64748B"/>
            <text x="75" y="30" fill="#64748B" font-size="10">ศูนย์กลาง O</text>
            <circle cx="180" cy="80" r="7" fill="#F8FAFC"/>
            <line x1="180" y1="80" x2="110" y2="52" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arr-red)"/>
            <text x="130" y="80" fill="#EF4444" font-size="11" font-weight="bold">a_c = v²/r</text>
            <line x1="180" y1="80" x2="225" y2="40" stroke="#10B981" stroke-width="2.5" marker-end="url(#arr-green)"/>
            <text x="215" y="32" fill="#10B981" font-size="11" font-weight="bold">a_t = dv/dt</text>
            <line x1="180" y1="80" x2="155" y2="12" stroke="#A855F7" stroke-width="2.5" marker-end="url(#arr-purple)"/>
            <text x="155" y="8" fill="#A855F7" font-size="12" font-weight="bold">a_total</text>
            <g transform="translate(300, 25)">
              <rect width="200" height="130" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
              <text x="100" y="25" fill="#38BDF8" font-size="12" font-weight="bold" text-anchor="middle">การจำแนกองค์ประกอบความเร่ง</text>
              <text x="15" y="52" fill="#EF4444" font-size="11">• a_c: เปลี่ยนทิศทาง (ชี้เข้าหา O เสมอ)</text>
              <text x="15" y="74" fill="#10B981" font-size="11">• a_t: เปลี่ยนขนาดอัตราเร็ว (แนวสัมผัส)</text>
              <text x="15" y="96" fill="#F8FAFC" font-size="11">• หาก v คงที่: a_t = 0 แต่ a_c ≠ 0</text>
              <text x="15" y="118" fill="#A855F7" font-size="11">• a_total = √(ac² + at²)</text>
            </g>
          </svg>`,
          diagramCaption: "แผนภาพความเร่ง 2 องค์ประกอบ: $\\vec{a}_c$ ตั้งฉากกับ $\\vec{a}_t$ เสมอ เวกเตอร์ความเร่งลัพธ์ $\\vec{a}_{\\text{total}}$ ชี้เอียงเข้าด้านในวงโค้ง"
        },
        observations: [
          "ความเข้าใจผิดร้ายแรง: \"ถ้าวัตถุเคลื่อนที่ด้วยอัตราเร็วคงตัว ความเร่งต้องเป็นศูนย์\" — ผิด! แม้อัตราเร็วคงที่ (v = const) แต่เวกเตอร์ความเร็วหมุนเปลี่ยนทิศทางตลอดเวลา ดังนั้นจึงมีความเร่งสู่ศูนย์กลาง a_c = v²/r อยู่ตลอดเวลา ตราบใดที่ยังเลี้ยวโค้ง",
          "หากวัตถุกำลังชะลอความเร็วขณะเข้าโค้ง เวกเตอร์ a_t จะมีทิศตรงข้ามกับ v ส่งผลให้เวกเตอร์ความเร่งรวมชี้ทำมุมป้านกับความเร็ว"
        ],
        citation: "David Morin (2008). Introduction to Classical Mechanics. Cambridge University Press, Chapter 3, pp. 68–72.",
        citations: [
          {
            title: "Introduction to Classical Mechanics: With Problems and Solutions",
            authors: "David Morin",
            source: "Cambridge University Press, Chapter 3, pp. 68–72",
            year: "2008",
            url: "https://www.cambridge.org/highereducation/books/introduction-to-classical-mechanics/3004C94CBAAC2649B90967A99D417834",
            verificationStatus: "verified_direct_content",
            evidencePin: "Morin (2008) Chapter 3 pp. 68–72: Orthogonal acceleration components in 2D plane polar coordinates a = (r̈ - rθ̇²)r̂ + (rθ̈ + 2ṙθ̇)θ̂.",
            note: "การแยกองค์ประกอบความเร่งแนวรัศมีและแนวสัมผัส"
          }
        ]
      },

      // ----------------------------------------------------------------------
      // Theory 3: Centripetal Dynamics & Resultant Force
      // ----------------------------------------------------------------------
      {
        id: "ch02-th03",
        chapterId: "ch02",
        divisionId: "div-ch02-dynamics",
        divisionTitle: "ภาคที่ 2: พลศาสตร์และวิศวกรรมแรงสู่ศูนย์กลาง",
        numberTh: "ทฤษฎีที่ 3",
        type: "กฎทางพลศาสตร์ (Dynamical Laws)",
        titleTh: "พลศาสตร์ของแรงสู่ศูนย์กลางในฐานะแรงลัพธ์แนวรัศมี",
        titleEn: "Centripetal Force as the Resultant Radial Net Force",
        summary: "หลักการนิวตันข้อที่ 2 ในแนวรัศมี ย้ำชัดว่าแรงสู่ศูนย์กลางไม่ใช่แรงชนิดใหม่ แต่คือผลรวมเวกเตอร์ของแรงจริงทางกายภาพ",
        definition: {
          text: "ตามกฎการเคลื่อนที่ข้อที่ 2 ของนิวตัน (Newton's Second Law of Motion) อนุภาคที่มีความเร่ง $\\vec{a}$ ย่อมต้องมีแรงลัพธ์สุทธิกระทำ $\\Sigma\\vec{F} = m\\vec{a}$ ดังนั้นสำหรับการเคลื่อนที่แบบวงกลม ผลรวมของแรงจริงทางกายภาพทั้งหมดในแนวแกนรัศมี (Radial Axis) ต้องเท่ากับมวลคูณความเร่งสู่ศูนย์กลาง:\n$$\\Sigma F_r = m a_c = m\\frac{v^2}{r} = m\\omega^2 r$$\n**ข้อตกลงสำคัญยิ่ง:** 'แรงสู่ศูนย์กลาง' (Centripetal Force, $F_c$) ไม่ใช่แรงใหม่ที่เกิดขึ้นมาลอยๆ หรือแรงประเภทที่ 5 ในธรรมชาติ แต่เป็น **บทบาทหน้าที่ (Role)** ที่เกิดจากแรงจริงชนิดใดชนิดหนึ่งหรือผลรวมของแรงจริง (เช่น แรงตึงเชือก, แรงเสียดทาน, แรงดึงดูดโน้มถ่วง, แรงปฏิกิริยาตั้งฉาก, หรือแรงแม่เหล็กลอเรนซ์)"
        },
        principle: {
          text: "เมื่อเขียนแผนภาพวัตถุอิสระ (Free-Body Diagram: FBD) ในกรอบอ้างอิงเฉื่อย (Inertial Reference Frame):\n1. ห้ามเขียนเวกเตอร์ 'แรงสู่ศูนย์กลาง' เพิ่มเข้าไปใน FBD เพราะจะกลายเป็นการนับแรงซ้ำสอง (Double-counting)\n2. ให้เขียนเฉพาะแรงจริงทางกายภาพที่มีผู้กระทำชัดเจน ได้แก่ แรงดึงดูดของโลก ($m\\vec{g}$), แรงตั้งฉาก ($\\vec{N}$), แรงตึงเชือก ($\\vec{T}$), แรงเสียดทาน ($\\vec{f}_s$)\n3. กำหนดให้ทิศชี้เข้าหาศูนย์กลางความโค้งเป็นทิศบวก (+r) แล้วตั้งสมการผลรวมแรง $\\Sigma F_r = m\\frac{v^2}{r}$\nหากผลรวมแรงจริงในแนวรัศมีไม่เพียงพอที่จะสร้าง $m\\frac{v^2}{r}$ วัตถุจะไม่สามารถรักษาวิถีโค้งวงกลมรัศมีนั้นได้ และจะไถลหรือหลุดออกจากวงโคจรไปตามแนวเส้นสัมผัสตามกฎความเฉื่อยข้อที่ 1"
        },
        formulas: [
          {
            name: "สมการพลศาสตร์ของนิวตันในแนวแกนรัศมี",
            latex: "\\Sigma F_r = m a_c = m\\frac{v^2}{r} = m\\omega^2 r",
            symbols: [
              { sym: "\\Sigma F_r", desc: "ผลรวมของแรงจริงทางกายภาพในแนวรัศมี (ทิศเข้าศูนย์กลางเป็น +)", unit: "\\text{N}" },
              { sym: "m", desc: "มวลของวัตถุ", unit: "\\text{kg}" },
              { sym: "v", desc: "อัตราเร็วเชิงเส้นแนวสัมผัส", unit: "\\text{m/s}" },
              { sym: "r", desc: "รัศมีความโค้ง", unit: "\\text{m}" }
            ],
            derivationSteps: [
              "1. กฎข้อ 2 ของนิวตันในรูปเวกเตอร์: $\\Sigma\\vec{F} = m\\vec{a}$",
              "2. ฉายสมการลงบนแกนรัศมี $\\hat{r}$ โดยใช้ $\\vec{a}_c = -\\frac{v^2}{r}\\hat{r}$",
              "3. กำหนดทิศชี้เข้าหาศูนย์กลาง (ทิศ $-\\hat{r}$) เป็นบวก: $\\Sigma F_r = m\\frac{v^2}{r}$"
            ]
          }
        ],
        application: {
          text: "การวิเคราะห์แรงดึงในสายสลิงของเครื่องเล่นเก้าอี้หมุนเหวี่ยง (Wave Swinger), แรงเสียดทานระหว่างยางรถยนต์กับถนนเพื่อกันรถหลุดโค้ง, และแรงโน้มถ่วงที่ทำหน้าที่เป็นแรงสู่ศูนย์กลางตรึงดาวเทียมให้อยู่ในวงโคจร",
          validWhen: "ใช้ได้ในกรอบอ้างอิงเฉื่อย (Inertial Frame) ที่ไม่มีแรงหนีศูนย์กลางเทียม (Centrifugal force)",
          invalidWhen: "ห้ามเขียนแรง Centripetal และ Centrifugal คู่กันใน FBD เดียวกันในกรอบเฉื่อย เพราะแรงเหวี่ยงหนีศูนย์กลางเป็นแรงเทียม (Fictitious force) ที่ปรากฏเฉพาะเมื่อสังเกตจากกรอบอ้างอิงที่กำลังหมุนเท่านั้น"
        },
        example: {
          problem: "ลูกตุ้มมวล $m = 0.50\\text{ kg}$ ผูกด้วยเชือกเบายาว $L = 1.20\\text{ m}$ แกว่งเป็นวงกลมในระนาบระดับ (Conical Pendulum) โดยเส้นเชือกทำมุม $\\beta = 30.0^\\circ$ กับแนวดิ่ง จงหา: (ก) แรงตึงในเส้นเชือก $T$ และ (ข) อัตราเร็วเชิงเส้นของลูกตุ้ม $v$",
          steps: [
            "ขั้นตอนที่ 1: วิเคราะห์แรงในแนวดิ่ง (วัตถุไม่มีความเร่งในแนวดิ่ง): $\\Sigma F_y = T\\cos\\beta - mg = 0 \\implies T = \\frac{mg}{\\cos\\beta}$",
            "ขั้นตอนที่ 2: แทนค่าแรงตึงเชือก: $T = \\frac{(0.50\\text{ kg})(9.80\\text{ m/s}^2)}{\\cos 30.0^\\circ} = \\frac{4.90}{0.8660} \\approx 5.66\\text{ N}$",
            "ขั้นตอนที่ 3: หายืนยันรัศมีวงกลมในแนวราบ: $r = L\\sin\\beta = (1.20\\text{ m})(\\sin 30.0^\\circ) = 0.60\\text{ m}$",
            "ขั้นตอนที่ 4: ตั้งสมการแรงสู่ศูนย์กลางในแนวราบ: $\\Sigma F_r = T\\sin\\beta = m\\frac{v^2}{r}$",
            "ขั้นตอนที่ 5: นำสมการหารกัน: $\\tan\\beta = \\frac{v^2}{rg} \\implies v = \\sqrt{rg\\tan\\beta}$",
            "ขั้นตอนที่ 6: คำนวณค่า $v$: $v = \\sqrt{(0.60\\text{ m})(9.80\\text{ m/s}^2)(\\tan 30.0^\\circ)} = \\sqrt{(5.88)(0.5774)} = \\sqrt{3.395} \\approx 1.84\\text{ m/s}$"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพลูกตุ้มรูปกรวย Conical Pendulum">
            <defs>
              <marker id="arr-cyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#38BDF8"/></marker>
              <marker id="arr-yellow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#F59E0B"/></marker>
            </defs>
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <line x1="120" y1="20" x2="200" y2="20" stroke="#94A3B8" stroke-width="3"/>
            <line x1="160" y1="20" x2="160" y2="150" stroke="#64748B" stroke-dasharray="3,3"/>
            <line x1="160" y1="20" x2="220" y2="124" stroke="#CBD5E1" stroke-width="1.8"/>
            <text x="180" y="60" fill="#CBD5E1" font-size="11">เชือก L</text>
            <path d="M 160 50 A 30 30 0 0 1 175 46" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
            <text x="166" y="62" fill="#F59E0B" font-size="10">β</text>
            <ellipse cx="160" cy="124" rx="60" ry="16" fill="none" stroke="#475569" stroke-dasharray="3,3"/>
            <circle cx="220" cy="124" r="8" fill="#38BDF8"/>
            <line x1="220" y1="124" x2="185" y2="65" stroke="#38BDF8" stroke-width="2" marker-end="url(#arr-cyan)"/>
            <text x="195" y="80" fill="#38BDF8" font-size="10" font-weight="bold">T</text>
            <line x1="220" y1="124" x2="220" y2="165" stroke="#EF4444" stroke-width="2" marker-end="url(#arr-red)"/>
            <text x="226" y="160" fill="#EF4444" font-size="10" font-weight="bold">mg</text>
            <line x1="220" y1="124" x2="165" y2="124" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-yellow)"/>
            <text x="175" y="116" fill="#F59E0B" font-size="10" font-weight="bold">T sin β</text>
            <g transform="translate(310, 25)">
              <rect width="190" height="130" rx="6" fill="#1E293B" stroke="#38BDF8" stroke-width="1"/>
              <text x="95" y="25" fill="#38BDF8" font-size="12" font-weight="bold" text-anchor="middle">การแตกแรงเข้าแกน</text>
              <text x="15" y="52" fill="#F8FAFC" font-size="11">• แนวดิ่ง: T cos β = mg</text>
              <text x="15" y="74" fill="#F8FAFC" font-size="11">• แนวรัศมี: T sin β = m v² / r</text>
              <text x="15" y="96" fill="#F59E0B" font-size="11">• tan β = v² / (rg)</text>
              <text x="15" y="118" fill="#10B981" font-size="11">• v = √(rg tan β)</text>
            </g>
          </svg>`,
          diagramCaption: "ลูกตุ้มรูปกรวย (Conical Pendulum): องค์ประกอบแนวนอนของแรงตึงเชือก $T\\sin\\beta$ ทำหน้าที่เป็นแรงสู่ศูนย์กลางสุทธิโดยลำพัง"
        },
        observations: [
          "ความเข้าใจผิดยอดฮิต: ผู้เรียนมักวาดเวกเตอร์ 3 ตัวใน FBD ได้แก่ แรงตึงเชือก, น้ำหนัก และแรงสู่ศูนย์กลาง ซึ่งผิดหลักฟิสิกส์! แรงสู่ศูนย์กลางเป็น 'ผลลัพธ์สุทธิ' (Net force) ไม่ใช่แรงกระทำภายนอก",
          "หากเชือกขาดทันที แรงตึงเชือก T จะหายไปเป็นศูนย์ แรงลัพธ์แนวรัศมีจึงเป็นศูนย์ วัตถุจะพุ่งออกไปตามแนวเส้นสัมผัสของวงกลม ไม่ใช่พุ่งหนีศูนย์ออกไปในแนวรัศมี"
        ],
        citation: "David Tong (2005). Classical Dynamics. DAMTP Cambridge, Sec. 1.2; Halliday, Resnick, Walker (2014), Ch. 6, pp. 128–132.",
        citations: [
          {
            title: "Fundamentals of Physics (10th Edition)",
            authors: "Halliday, D., Resnick, R., Walker, J.",
            source: "John Wiley & Sons, Chapter 6 (Force and Motion—II: Uniform Circular Motion), pp. 128–132",
            year: "2014",
            url: "https://www.wiley.com/en-us/Fundamentals+of+Physics%2C+10th+Edition-p-9781118230718",
            verificationStatus: "pending_content_verification",
            pendingReason: "ตรวจสอบสูตรฟิสิกส์ถูกต้องตามหลักสูตรสากล รอยืนยันหน้าฉบับพิมพ์จริง",
            note: "การวิเคราะห์แรงแนวรัศมีและลูกตุ้มรูปกรวย"
          }
        ]
      },

      // ----------------------------------------------------------------------
      // Theory 4: Banked Turns & Highway Engineering
      // ----------------------------------------------------------------------
      {
        id: "ch02-th04",
        chapterId: "ch02",
        divisionId: "div-ch02-dynamics",
        divisionTitle: "ภาคที่ 2: พลศาสตร์และวิศวกรรมแรงสู่ศูนย์กลาง",
        numberTh: "ทฤษฎีที่ 4",
        type: "การประยุกต์เชิงวิศวกรรม (Engineering Applications)",
        titleTh: "พลศาสตร์ของทางโค้งยกมุมเอียงและการเลี้ยวบนถนน",
        titleEn: "Dynamics of Banked Turns & Curve Negotiation",
        summary: "การวิเคราะห์แรงบนทางโค้งราบและทางโค้งเอียง ความเร็วออกแบบที่ปราศจากแรงเสียดทาน (Design Speed) และขอบเขตความเร็วปลอดภัยสูงสุด/ต่ำสุด",
        definition: {
          text: "การเลี้ยวของยานพาหนะบนทางโค้งแบ่งออกเป็น 2 กรณีหลัก:\n1. **ทางโค้งราบ (Unbanked Flat Curve):** แรงสู่ศูนย์กลางเกิดจากแรงเสียดทานสถิตระหว่างหน้ายางกับผิวถนนเพียงอย่างเดียว ($f_s = m\\frac{v^2}{r}$) ความเร็วสูงสุดก่อนลื่นไถลคือ $v_{\\text{max}} = \\sqrt{\\mu_s g r}$\n2. **ทางโค้งยกมุมเอียง (Superelevated Banked Curve):** ผิวถนนถูกยกเอียงทำมุม $\\theta$ กับแนวราบ เพื่อให้องค์ประกอบในแนวราบของแรงปฏิกิริยาตั้งฉาก ($N\\sin\\theta$) ช่วยสร้างแรงสู่ศูนย์กลาง ลดการพึ่งพาแรงเสียดทานจนเหลือศูนย์ ณ **ความเร็วออกแบบ (Design Speed, $v_0 = \\sqrt{rg\\tan\\theta}$)**"
        },
        principle: {
          text: "การวิเคราะห์แรงในกรอบอ้างอิงเฉื่อยบนทางโค้งยกมุมเอียง $\\theta$:\n• **กรณีไม่มีแรงเสียดทาน (Frictionless / Ideal Design Speed $v_0$):**\n  - แนวดิ่ง: $N\\cos\\theta = mg$\n  - แนวรัศมี: $N\\sin\\theta = m\\frac{v_0^2}{r}$\n  - นำสมการหารกันได้: $\\tan\\theta = \\frac{v_0^2}{rg} \\implies v_0 = \\sqrt{rg\\tan\\theta}$\n• **กรณีขับเร็วกว่าความเร็วออกแบบ ($v > v_0$):** รถมีแนวโน้มจะไถลออกนอกโค้ง (Slide up the bank) ทำให้เกิดแรงเสียดทานสถิต $\\vec{f}_s$ ชี้เฉียงลงตามแนวผิวถนน:\n  $$v_{\\text{max}} = \\sqrt{rg\\frac{\\tan\\theta + \\mu_s}{1 - \\mu_s\\tan\\theta}}$$\n• **กรณีขับช้ากว่าความเร็วออกแบบ ($v < v_0$):** รถมีแนวโน้มจะลื่นไถลลงด้านในโค้ง ทำให้แรงเสียดทานสถิตชี้เฉียงขึ้นตามแนวผิวถนน:\n  $$v_{\\text{min}} = \\sqrt{rg\\frac{\\tan\\theta - \\mu_s}{1 + \\mu_s\\tan\\theta}}$$"
        },
        formulas: [
          {
            name: "ความเร็วออกแบบที่ปราศจากแรงเสียดทาน (Ideal Banked Speed)",
            latex: "\\tan\\theta = \\frac{v_0^2}{rg} \\iff v_0 = \\sqrt{rg\\tan\\theta}",
            symbols: [
              { sym: "v_0", desc: "ความเร็วออกแบบที่รถไม่จำเป็นต้องอาศัยแรงเสียดทาน", unit: "\\text{m/s}" },
              { sym: "\\theta", desc: "มุมเอียงของพื้นผิวถนนเทียบกับแนวราบ", unit: "\\text{rad} \\text{ หรือ } ^\\circ" },
              { sym: "r", desc: "รัศมีความโค้งของถนน", unit: "\\text{m}" },
              { sym: "g", desc: "ความเร่งโน้มถ่วงของโลก (9.80 m/s²)", unit: "\\text{m/s}^2" }
            ],
            derivationSteps: [
              "1. แยกองค์ประกอบแรงปฏิกิริยาตั้งฉาก $N$: $N_y = N\\cos\\theta$, $N_x = N\\sin\\theta$",
              "2. สมดุลในแนวดิ่ง: $N\\cos\\theta = mg \\implies N = \\frac{mg}{\\cos\\theta}$",
              "3. กฎข้อ 2 ของนิวตันในแนวรัศมี: $N\\sin\\theta = m\\frac{v^2}{r}$",
              "4. แทนค่า $N$: $\\left(\\frac{mg}{\\cos\\theta}\\right)\\sin\\theta = m\\frac{v^2}{r} \\implies g\\tan\\theta = \\frac{v^2}{r}$",
              "5. ได้: $v = \\sqrt{rg\\tan\\theta}$"
            ]
          },
          {
            name: "ความเร็วสูงสุดบนทางโค้งเอียงโดยคำนึงถึงแรงเสียดทานสถิต",
            latex: "v_{\\text{max}} = \\sqrt{rg\\left(\\frac{\\tan\\theta + \\mu_s}{1 - \\mu_s\\tan\\theta}\\right)}",
            symbols: [
              { sym: "v_{\\text{max}}", desc: "อัตราเร็วสูงสุดที่รถสามารถวิ่งผ่านโค้งได้โดยไม่ไถลออกนอกโค้ง", unit: "\\text{m/s}" },
              { sym: "\\mu_s", desc: "สัมประสิทธิ์แรงเสียดทานสถิตระหว่างยางกับผิวถนน", unit: "—" }
            ],
            derivationSteps: [
              "1. ตั้งสมการแนวดิ่งเมื่อ $f_s = \\mu_s N$ ชี้ลง: $N\\cos\\theta - f_s\\sin\\theta = mg \\implies N(\\cos\\theta - \\mu_s\\sin\\theta) = mg$",
              "2. ตั้งสมการแนวรัศมี: $N\\sin\\theta + f_s\\cos\\theta = m\\frac{v^2}{r} \\implies N(\\sin\\theta + \\mu_s\\cos\\theta) = m\\frac{v^2}{r}$",
              "3. นำสมการที่ 2 หารด้วยสมการที่ 1: $\\frac{\\sin\\theta + \\mu_s\\cos\\theta}{\\cos\\theta - \\mu_s\\sin\\theta} = \\frac{v^2}{rg}$",
              "4. นำ $\\cos\\theta$ หารทั้งเศษและส่วนในฝั่งซ้าย: $\\frac{\\tan\\theta + \\mu_s}{1 - \\mu_s\\tan\\theta} = \\frac{v^2}{rg}$"
            ]
          }
        ],
        application: {
          text: "มาตรฐานการออกแบบทางหลวงพิเศษระหว่างเมือง (AASHTO Geometric Design / Motorways), สนามแข่งรถ NASCAR / Daytona International Speedway ที่ยกเอียงถึง 31°, และรางรถไฟความเร็วสูง (Superelevation / Cant)",
          validWhen: "ใช้ได้กับยานพาหนะล้อเลื่อนที่ไม่เกิดการพลิกคว่ำ (Roll-over threshold สูงกว่าการลื่นไถล)",
          invalidWhen: "หากมุมเอียงชันเกินไปจน tan θ > μ_s รถที่จอดนิ่งบนทางโค้งจะลื่นไถลลงด้านล่าง ดังนั้นในการออกแบบทางหลวงสาธารณะ ค่า superelevation จึงถูกจำกัดไม่เกิน 6% – 10%"
        },
        example: {
          problem: "ทางเลี้ยวขึ้นทางด่วนมีรัศมีความโค้ง $r = 120\\text{ m}$ ได้รับการออกแบบให้ยกมุมเอียง $\\theta = 12.0^\\circ$ จงหา: (ก) ความเร็วออกแบบ $v_0$ ในหน่วย km/h และ (ข) หากวันฝนตกถนนลื่นมี $\\mu_s = 0.20$ จงหาความเร็วสูงสุดที่รถยังคงเกาะถนนได้โดยไม่ไถลออกนอกโค้ง",
          steps: [
            "ขั้นตอนที่ 1: คำนวณความเร็วออกแบบปราศจากแรงเสียดทาน: $v_0 = \\sqrt{rg\\tan\\theta} = \\sqrt{(120)(9.80)(\\tan 12.0^\\circ)}$",
            "ขั้นตอนที่ 2: $\\tan 12.0^\\circ \\approx 0.2126 \\implies v_0 = \\sqrt{1176 \\times 0.2126} = \\sqrt{250.0} \\approx 15.81\\text{ m/s}$",
            "ขั้นตอนที่ 3: แปลงเป็น km/h: $v_0 = 15.81 \\times 3.6 \\approx 56.9\\text{ km/h}$",
            "ขั้นตอนที่ 4: คำนวณความเร็วสูงสุดเมื่อมีแรงเสียดทาน $\\mu_s = 0.20$:",
            "  เศษ: $\\tan 12^\\circ + \\mu_s = 0.2126 + 0.20 = 0.4126$",
            "  ส่วน: $1 - \\mu_s\\tan 12^\\circ = 1 - (0.20)(0.2126) = 1 - 0.0425 = 0.9575$",
            "  อัตราส่วน: $\\frac{0.4126}{0.9575} \\approx 0.4309$",
            "ขั้นตอนที่ 5: $v_{\\text{max}} = \\sqrt{(120)(9.80)(0.4309)} = \\sqrt{506.7} \\approx 22.51\\text{ m/s}$ ($81.0\\text{ km/h}$)"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพทางโค้งยกมุมเอียง Banked Turn">
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <polygon points="60,150 240,150 240,90" fill="#1E293B" stroke="#475569" stroke-width="2"/>
            <path d="M 100 150 A 40 40 0 0 0 98 138" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
            <text x="108" y="144" fill="#F59E0B" font-size="11">θ</text>
            <g transform="translate(140, 108) rotate(-18.4)">
              <rect x="-24" y="-14" width="48" height="24" rx="4" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5"/>
              <circle cx="-16" cy="12" r="5" fill="#0F172A"/>
              <circle cx="16" cy="12" r="5" fill="#0F172A"/>
              <line x1="0" y1="-14" x2="0" y2="-65" stroke="#10B981" stroke-width="2.5" marker-end="url(#arr-green)"/>
              <text x="6" y="-55" fill="#10B981" font-size="11" font-weight="bold">N</text>
            </g>
            <line x1="148" y1="110" x2="148" y2="165" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arr-red)"/>
            <text x="156" y="160" fill="#EF4444" font-size="11" font-weight="bold">mg</text>
            <line x1="148" y1="110" x2="80" y2="110" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-yellow)"/>
            <text x="82" y="102" fill="#F59E0B" font-size="10" font-weight="bold">N sin θ</text>
            <g transform="translate(280, 25)">
              <rect width="220" height="130" rx="6" fill="#1E293B" stroke="#38BDF8" stroke-width="1"/>
              <text x="110" y="25" fill="#38BDF8" font-size="12" font-weight="bold" text-anchor="middle">AASHTO Highway Design</text>
              <text x="15" y="50" fill="#F8FAFC" font-size="11">• Design speed: v₀ = √(rg tan θ)</text>
              <text x="15" y="72" fill="#10B981" font-size="11">• At v = v₀: f_s = 0 (ยางไม่สึกหรอ)</text>
              <text x="15" y="94" fill="#EF4444" font-size="11">• v &gt; v₀: f_s ดึงลงด้านในกันหลุดโค้ง</text>
              <text x="15" y="116" fill="#F59E0B" font-size="11">• v &lt; v₀: f_s ดันขึ้นกันลื่นตกโค้ง</text>
            </g>
          </svg>`,
          diagramCaption: "แผนภาพทางโค้งยกมุมเอียง: องค์ประกอบแนวนอน $N\\sin\\theta$ ทำหน้าที่เป็นแรงสู่ศูนย์กลางโดยตรง ลดการพึ่งพาแรงเสียดทานของยางรถยนต์"
        },
        observations: [
          "ความปลอดภัยในสภาวะน้ำแข็ง/ถนนเปียก: หากเกิดน้ำแข็งเกาะผิวถนนจน μ_s -> 0 รถที่วิ่งด้วยความเร็ว v = v_0 พอดีจะยังคงเลี้ยวผ่านโค้งได้อย่างปลอดภัยสมบูรณ์แบบโดยไม่ลื่นไถล แต่ถ้าขับช้ากว่าหรือเร็วกว่า v_0 รถจะลื่นไถลทันที",
          "รางรถไฟ: การยกรางด้านนอกให้สูงกว่ารางด้านใน (Cant หรือ Superelevation) มีเป้าหมายเดียวกับทางหลวง เพื่อลดการสึกหรอของครีบล้อและป้องกันการตกรางจากแรงกระแทกด้านข้าง"
        ],
        citation: "AASHTO (2018). A Policy on Geometric Design of Highways and Streets (Green Book), 7th Edition; Morin (2008), Sec. 3.2.",
        citations: [
          {
            title: "A Policy on Geometric Design of Highways and Streets (The Green Book)",
            authors: "American Association of State Highway and Transportation Officials (AASHTO)",
            source: "AASHTO, 7th Edition, Chapter 3 (Elements of Design: Superelevation), pp. 3-31 to 3-72",
            year: "2018",
            url: "https://bookstore.transportation.org/collection_detail.aspx?ID=110",
            verificationStatus: "verified_direct_content",
            evidencePin: "AASHTO Green Book 7th Ed, Sec 3.3.2, Eq. 3-6: e + f = v² / (127 R), where e = tan θ is superelevation rate.",
            note: "มาตรฐานการคำนวณอัตราการยกมุมเอียงของทางหลวงสากล"
          }
        ]
      },

      // ----------------------------------------------------------------------
      // Theory 5: Vertical Circular Motion & Critical Conditions
      // ----------------------------------------------------------------------
      {
        id: "ch02-th05",
        chapterId: "ch02",
        divisionId: "div-ch02-dynamics",
        divisionTitle: "ภาคที่ 2: พลศาสตร์และวิศวกรรมแรงสู่ศูนย์กลาง",
        numberTh: "ทฤษฎีที่ 5",
        type: "การอนุรักษ์พลังงานและเงื่อนไขวิกฤต (Energy & Critical Dynamics)",
        titleTh: "วงกลมแนวดิ่ง แรงดึงในเส้นเชือก และเงื่อนไขวิกฤต",
        titleEn: "Vertical Circular Motion, Tension & Critical Conditions",
        summary: "การรวมกฎนิวตันเข้ากับการอนุรักษ์พลังงานกล การแปรผันของแรงตึงเชือก/แรงปฏิกิริยาตั้งฉากตามตำแหน่ง และเงื่อนไขความเร็ววิกฤตที่จุดสูงสุด",
        definition: {
          text: "การเคลื่อนที่แบบวงกลมในแนวดิ่ง (Vertical Circular Motion) ภายใต้อิทธิพลของสนามความโน้มถ่วงโลก $g$ จัดเป็นการเคลื่อนที่แบบวงกลมไม่สม่ำเสมอ (Non-uniform Circular Motion) เนื่องจากแรงโน้มถ่วงจะเร่งความเร็วของวัตถุขณะเคลื่อนที่ลง และชะลอความเร็วขณะเคลื่อนที่ขึ้น ส่งผลให้อัตราเร็ว $v(\\theta)$ และแรงปฏิกิริยาแนวรัศมี ($T$ หรือ $N$) มีค่าแปรผันตลอดเวลาตามมุมของตำแหน่ง"
        },
        principle: {
          text: "การวิเคราะห์ด้วยกฎการอนุรักษ์พลังงานกล (Mechanical Energy Conservation) ร่วมกับกฎข้อ 2 ของนิวตัน:\n1. **ที่จุดต่ำสุด (Bottom / Lowest point):**\n   - แรงตึงเชือกและน้ำหนักอยู่ในแนวตรงข้ามกัน: $T_{\\text{bot}} - mg = m\\frac{v_{\\text{bot}}^2}{r} \\implies T_{\\text{bot}} = mg + m\\frac{v_{\\text{bot}}^2}{r}$\n   - แรงตึงเชือกมีค่า **สูงสุดเสมอ** ณ จุดนี้\n2. **ที่จุดสูงสุด (Top / Highest point):**\n   - แรงตึงเชือกและน้ำหนักชี้ลงในทิศเดียวกันทั้งคู่: $T_{\\text{top}} + mg = m\\frac{v_{\\text{top}}^2}{r} \\implies T_{\\text{top}} = m\\frac{v_{\\text{top}}^2}{r} - mg$\n   - **เงื่อนไขวิกฤต (Critical Boundary):** เพื่อให้เชือกยังคงตึง (หรือวัตถุไม่หลุดจากราง) ต้องมี $T_{\\text{top}} \\ge 0$ นั่นคือ:\n     $$v_{\\text{top}} \\ge \\sqrt{gr} \\quad (v_{\\text{crit}} = \\sqrt{gr})$$\n3. **ความเร็วขั้นต่ำที่จุดต่ำสุด:** จากการอนุรักษ์พลังงาน $E_{\\text{bot}} = E_{\\text{top}} \\implies \\frac{1}{2}mv_{\\text{bot}}^2 = \\frac{1}{2}mv_{\\text{top}}^2 + mg(2r)$\n   เมื่อแทน $v_{\\text{top}} = \\sqrt{gr}$ จะได้ความเร็วต่ำสุดที่จุดล่างสุดคือ:\n   $$v_{\\text{bot, min}} = \\sqrt{5gr}$$\n   และแรงตึงเชือก ณ จุดต่ำสุดจะมีค่าอย่างน้อย $T_{\\text{bot}} = 6mg$"
        },
        formulas: [
          {
            name: "ความเร็ววิกฤตต่ำสุด ณ จุดสูงสุดของวงกลมแนวดิ่ง",
            latex: "v_{\\text{crit, top}} = \\sqrt{gr}, \\quad v_{\\text{crit, bot}} = \\sqrt{5gr}",
            symbols: [
              { sym: "v_{\\text{crit, top}}", desc: "ความเร็วขั้นต่ำสุดที่จุดสูงสุดเพื่อไม่ให้เชือกหย่อนหรือตกจากราง", unit: "\\text{m/s}" },
              { sym: "v_{\\text{crit, bot}}", desc: "ความเร็วขั้นต่ำสุดที่จุดต่ำสุดเพื่อให้สามารถวนครบรอบวงกลมได้", unit: "\\text{m/s}" },
              { sym: "r", desc: "รัศมีของวงกลมแนวดิ่ง", unit: "\\text{m}" },
              { sym: "g", desc: "ความเร่งโน้มถ่วง (9.80 m/s²)", unit: "\\text{m/s}^2" }
            ],
            derivationSteps: [
              "1. ที่จุดสูงสุด แรงสู่ศูนย์กลางคือ $T + mg = m\\frac{v_{\\text{top}}^2}{r}$",
              "2. เงื่อนไขที่เชือกยังคงตึงพอดี: $T \\to 0$",
              "3. จะได้ $mg = m\\frac{v^2}{r} \\implies v_{\\text{top}} = \\sqrt{gr}$",
              "4. กฎอนุรักษ์พลังงานระหว่างจุดต่ำสุดกับสูงสุด: $\\frac{1}{2}mv_{\\text{bot}}^2 = \\frac{1}{2}mv_{\\text{top}}^2 + mg(2r)$",
              "5. แทน $v_{\\text{top}}^2 = gr$: $\\frac{1}{2}v_{\\text{bot}}^2 = \\frac{1}{2}(gr) + 2gr = \\frac{5}{2}gr \\implies v_{\\text{bot}} = \\sqrt{5gr}$"
            ]
          },
          {
            name: "ผลต่างแรงตึงเชือกระหว่างจุดต่ำสุดและจุดสูงสุด",
            latex: "\\Delta T = T_{\\text{bot}} - T_{\\text{top}} = 6mg \\quad (\\text{คงที่เสมอไม่ว่าอัตราเร็วจะมากเพียงใด})",
            symbols: [
              { sym: "\\Delta T", desc: "ผลต่างของแรงตึงเชือกที่จุดต่ำสุดลบจุดสูงสุด", unit: "\\text{N}" },
              { sym: "m", desc: "มวลของวัตถุ", unit: "\\text{kg}" }
            ],
            derivationSteps: [
              "1. $T_{\\text{bot}} = mg + m\\frac{v_{\\text{bot}}^2}{r}$ และ $T_{\\text{top}} = m\\frac{v_{\\text{top}}^2}{r} - mg$",
              "2. นำสมการลบกัน: $T_{\\text{bot}} - T_{\\text{top}} = 2mg + \\frac{m}{r}(v_{\\text{bot}}^2 - v_{\\text{top}}^2)$",
              "3. จากการอนุรักษ์พลังงาน: $v_{\\text{bot}}^2 - v_{\\text{top}}^2 = 4gr$",
              "4. แทนค่า: $T_{\\text{bot}} - T_{\\text{top}} = 2mg + \\frac{m}{r}(4gr) = 2mg + 4mg = 6mg$"
            ]
          }
        ],
        application: {
          text: "การออกแบบรางรถไฟเหาะตีลังกา (Roller Coaster Loops), การควงถังน้ำเป็นวงกลมโดยน้ำไม่หก, ท่าบินผาดแผลงลูปแนวดิ่งของเครื่องบินรบ (Inside Loop / Pull-up)",
          validWhen: "ใช้ได้กับวัตถุที่เชื่อมด้วยเส้นเชือกเบา ยึดด้วยรางด้านนอกด้านเดียว หรือวัตถุในของเหลว",
          invalidWhen: "หากวัตถุถูกยึดด้วย 'แท่งก้านแข็งเบา' (Light rigid rod) ที่จุดสูงสุดแท่งก้านสามารถรับแรงค้ำยัน (Compression) ได้ ความเร็วที่จุดสูงสุดจึงไม่จำเป็นต้องถึง √(gr) แต่เพียงแค่ v_top > 0 ก็สามารถผ่านจุดสูงสุดได้"
        },
        example: {
          problem: "รถไฟเหาะมวล $m = 800\\text{ kg}$ เคลื่อนที่ผ่านห่วงวงกลมแนวดิ่งรัศมี $r = 10.0\\text{ m}$ โดยขณะอยู่ที่จุดต่ำสุดมีอัตราเร็ว $v_{\\text{bot}} = 25.0\\text{ m/s}$ จงหา: (ก) แรงปฏิกิริยาตั้งฉาก $N_{\\text{bot}}$ และ (ข) อัตราเร็วและแรงปฏิกิริยาตั้งฉาก $N_{\\text{top}}$ ที่จุดสูงสุด",
          steps: [
            "ขั้นตอนที่ 1: หาแรงปฏิกิริยาตั้งฉากที่จุดต่ำสุด: $N_{\\text{bot}} = mg + m\\frac{v_{\\text{bot}}^2}{r}$",
            "  $N_{\\text{bot}} = (800)(9.80) + 800\\frac{(25.0)^2}{10.0} = 7,840 + 800(62.5) = 7,840 + 50,000 = 57,840\\text{ N}$ (ประมาณ $7.38g$)",
            "ขั้นตอนที่ 2: หาอัตราเร็วที่จุดสูงสุดจากการอนุรักษ์พลังงาน: $v_{\\text{top}}^2 = v_{\\text{bot}}^2 - 4gr$",
            "  $v_{\\text{top}}^2 = 25.0^2 - 4(9.80)(10.0) = 625 - 392 = 233\\text{ m}^2/\\text{s}^2$",
            "  $v_{\\text{top}} = \\sqrt{233} \\approx 15.26\\text{ m/s}$",
            "ขั้นตอนที่ 3: ตรวจสอบเงื่อนไขวิกฤต: $v_{\\text{crit}} = \\sqrt{gr} = \\sqrt{(9.80)(10.0)} = 9.90\\text{ m/s}$ -> รถมีความเร็ว $15.26\\text{ m/s} > 9.90\\text{ m/s}$ จึงผ่านได้ปลอดภัย",
            "ขั้นตอนที่ 4: หาแรงปฏิกิริยาตั้งฉากที่จุดสูงสุด: $N_{\\text{top}} = m\\frac{v_{\\text{top}}^2}{r} - mg$",
            "  $N_{\\text{top}} = 800\\left(\\frac{233}{10.0}\\right) - 7,840 = 800(23.3) - 7,840 = 18,640 - 7,840 = 10,800\\text{ N}$",
            "ขั้นตอนที่ 5: ตรวจสอบผลต่างแรง: $N_{\\text{bot}} - N_{\\text{top}} = 57,840 - 10,800 = 47,040\\text{ N}$",
            "  เทียบกับ $6mg = 6(800)(9.80) = 47,040\\text{ N}$ (ถูกต้องตรงตามทฤษฎีบริสุทธิ์)"
          ],
          diagramSvg: `<svg viewBox="0 0 520 180" class="theory-diagram-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพวงกลมแนวดิ่ง Vertical Circular Motion">
            <rect width="520" height="180" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <circle cx="160" cy="90" r="65" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="4,4"/>
            <line x1="160" y1="25" x2="160" y2="155" stroke="#334155" stroke-dasharray="2,2"/>
            <circle cx="160" cy="25" r="7" fill="#EF4444"/>
            <text x="160" y="15" fill="#EF4444" font-size="11" font-weight="bold" text-anchor="middle">จุดสูงสุด (Top)</text>
            <line x1="160" y1="25" x2="160" y2="55" stroke="#EF4444" stroke-width="2" marker-end="url(#arr-top)"/>
            <text x="175" y="45" fill="#EF4444" font-size="10">N_top + mg</text>
            <circle cx="160" cy="155" r="7" fill="#10B981"/>
            <text x="160" y="175" fill="#10B981" font-size="11" font-weight="bold" text-anchor="middle">จุดต่ำสุด (Bottom)</text>
            <line x1="160" y1="155" x2="160" y2="105" stroke="#10B981" stroke-width="2.5" marker-end="url(#arr-bot)"/>
            <text x="175" y="125" fill="#10B981" font-size="10">N_bot (มากสุด)</text>
            <line x1="160" y1="155" x2="160" y2="175" stroke="#EF4444" stroke-width="2"/>
            <g transform="translate(290, 25)">
              <rect width="210" height="130" rx="6" fill="#1E293B" stroke="#38BDF8" stroke-width="1"/>
              <text x="105" y="25" fill="#38BDF8" font-size="12" font-weight="bold" text-anchor="middle">เกณฑ์วิกฤตวงกลมแนวดิ่ง</text>
              <text x="15" y="52" fill="#EF4444" font-size="11">• จุดสูงสุด: v_top ≥ √(gr)</text>
              <text x="15" y="74" fill="#10B981" font-size="11">• จุดต่ำสุด: v_bot ≥ √(5gr)</text>
              <text x="15" y="96" fill="#F8FAFC" font-size="11">• N_bot - N_top = 6mg (เสมอ)</text>
              <text x="15" y="118" fill="#F59E0B" font-size="11">• ถ้า v_top &lt; √(gr): วัตถุตกหลุดราง</text>
            </g>
          </svg>`,
          diagramCaption: "แผนภาพวงกลมแนวดิ่ง: ที่จุดสูงสุดแรงโน้มถ่วงช่วยสร้างแรงสู่ศูนย์กลาง ทำให้ต้องการแรงภายนอกน้อยที่สุด แต่ที่จุดต่ำสุดแรงภายนอกต้องแบกรับทั้งน้ำหนักและแรงเหวี่ยง"
        },
        observations: [
          "ความเข้าใจผิดเรื่องผลต่าง 6mg: ผลต่าง T_bot - T_top = 6mg เป็นจริงเสมอไม่ว่าความเร็วตั้งต้นจะเป็นเท่าใด และไม่ว่ารัศมีจะใหญ่หรือเล็กเพียงใด ตราบใดที่ยังอนุรักษ์พลังงานกลสมบูรณ์",
          "ทำไมรถไฟเหาะจึงไม่ใช้วงกลมสมบูรณ์: ในทางปฏิบัติ หากทำลูปเป็นวงกลมรัศมีคงที่ ผู้เล่นจะต้องรับแรงกระแทกที่จุดต่ำสุดสูงถึง 6g ซึ่งอันตรายต่อร่างกาย วิศวกรจึงเปลี่ยนไปใช้ ห่วงรูปคลอธอยด์ (Clothoid Loop) ที่มีรัศมีค่อยๆ เล็กลงที่ยอดแทน"
        ],
        citation: "David Morin (2008). Introduction to Classical Mechanics. Cambridge University Press, Sec. 3.3, pp. 75–78.",
        citations: [
          {
            title: "Introduction to Classical Mechanics: With Problems and Solutions",
            authors: "David Morin",
            source: "Cambridge University Press, Chapter 3, pp. 75–78",
            year: "2008",
            url: "https://www.cambridge.org/highereducation/books/introduction-to-classical-mechanics/3004C94CBAAC2649B90967A99D417834",
            verificationStatus: "verified_direct_content",
            evidencePin: "Morin (2008) Chapter 3 pp. 75–78: Motion in a vertical circle, critical apex velocity v = √(gr) and tension difference ΔT = 6mg.",
            note: "การอนุมานสมการวงกลมแนวดิ่งและเงื่อนไขวิกฤต"
          }
        ]
      }
    ],

    // ------------------------------------------------------------------------
    // Real-World Engineering & Natural Phenomena for Chapter 02
    // ------------------------------------------------------------------------
    phenomena: [
      {
        id: "PHE-CH02-01",
        chapterId: "ch02",
        division: "ภาคที่ 2: พลศาสตร์และวิศวกรรมแรงสู่ศูนย์กลาง",
        category: "วิศวกรรมขนส่งและทางหลวง (Transportation Engineering)",
        titleTh: "การออกแบบทางโค้งยกมุมเอียงบนทางหลวงพิเศษ",
        titleEn: "Superelevated Highway Curves & AASHTO Geometric Standards",
        relatedTheoryId: "theory-4",
        relatedTheoryTitle: "ทฤษฎีที่ 4: ทางโค้งยกมุมเอียงและการเลี้ยวบนถนน",
        relatedSimulator: "circular",
        relatedSimSubmode: "banked",
        observed: "เมื่อขับรถเลี้ยวโค้งบนทางหลวงพิเศษ (Motorway) หรือทางยกระดับ ผู้ขับขี่แทบไม่รู้สึกว่าถูกเหวี่ยงออกด้านข้าง พวงมาลัยไม่ฝืน และรถเกาะถนนอย่างมั่นคงแม้ผิวถนนจะเปียกลื่น",
        mechanism: "วิศวกรโยธาออกแบบให้ผิวถนนยกทำมุมเอียง $\\theta$ (Superelevation, $e = \\tan\\theta$) เพื่อให้องค์ประกอบในแนวราบของแรงปฏิกิริยาตั้งฉากจากพื้นถนน $N\\sin\\theta$ ทำหน้าที่เป็นแรงสู่ศูนย์กลาง $\\Sigma F_r = m\\frac{v^2}{r}$ โดยไม่ต้องพึ่งพาแรงเสียดทานด้านข้าง ($f_s = 0$) ณ ความเร็วออกแบบ $v_0 = \\sqrt{rg\\tan\\theta}$ ตามมาตรฐาน AASHTO Green Book",
        scope: "ใช้ได้กับรัศมีความโค้งตั้งแต่ 50 m ถึงมากกว่า 1,000 m โดยมีข้อจำกัดอัตราการยกมุมเอียงสูงสุด e_max ≤ 0.08 (8%) ในเขตชนบท และไม่เกิน 4% – 6% ในเขตเมือง เพื่อป้องกันรถชะลอตัวลื่นไถลลงด้านล่าง",
        formulas: [
          {
            latex: "e + f_{\\text{side}} = \\frac{v^2}{gR} = \\frac{V^2}{127 R}",
            desc: "สมการมาตรฐาน AASHTO เชื่อมโยงอัตราเอียง e สัมประสิทธิ์แรงเสียดทานด้านข้าง f ความเร็ว V (km/h) และรัศมี R (m)"
          },
          {
            latex: "v_{\\text{design}} = \\sqrt{R g \\tan\\theta}",
            desc: "ความเร็วออกแบบที่ปราศจากแรงเสียดทาน (Zero Lateral Acceleration Felt by Passengers)"
          }
        ],
        variables: [
          { symbol: "e", name: "อัตราการยกความเอียงของผิวทาง (Superelevation rate)", unit: "m/m (หรือ %)", typical: "0.04 – 0.08" },
          { symbol: "f_{\\text{side}}", name: "ค่าสัมประสิทธิ์แรงเสียดทานด้านข้าง (Side Friction Factor)", unit: "—", typical: "0.10 – 0.16" },
          { symbol: "R", name: "รัศมีความโค้งของแนวทางสายทางหลวง", unit: "m", typical: "150 – 800 m" },
          { symbol: "V", name: "ความเร็วออกแบบของยวดยาน", unit: "km/h", typical: "80 – 120 km/h" }
        ],
        svgDiagram: `<svg viewBox="0 0 420 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:8px;">
          <polygon points="40,170 320,170 320,110" fill="#1E293B" stroke="#475569" stroke-width="2"/>
          <path d="M 90 170 A 50 50 0 0 0 88 156" fill="none" stroke="#F59E0B" stroke-width="2"/>
          <text x="98" y="164" fill="#F59E0B" font-size="11" font-weight="bold">θ = 6%</text>
          <g transform="translate(180, 134) rotate(-12)">
            <rect x="-35" y="-18" width="70" height="30" rx="6" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
            <circle cx="-22" cy="14" r="7" fill="#0F172A" stroke="#94A3B8" stroke-width="1.5"/>
            <circle cx="22" cy="14" r="7" fill="#0F172A" stroke="#94A3B8" stroke-width="1.5"/>
            <line x1="0" y1="-18" x2="0" y2="-65" stroke="#10B981" stroke-width="2.5" marker-end="url(#arr-green)"/>
            <text x="6" y="-55" fill="#10B981" font-size="11" font-weight="bold">N</text>
          </g>
          <line x1="180" y1="134" x2="180" y2="190" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arr-red)"/>
          <text x="188" y="185" fill="#EF4444" font-size="11" font-weight="bold">mg</text>
          <line x1="180" y1="134" x2="110" y2="134" stroke="#F59E0B" stroke-width="2.5" marker-end="url(#arr-yellow)"/>
          <text x="115" y="125" fill="#F59E0B" font-size="10" font-weight="bold">N sin θ (แรงสู่ศูนย์กลาง)</text>
          <line x1="180" y1="134" x2="180" y2="80" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="185" y="90" fill="#94A3B8" font-size="9">N cos θ</text>
        </svg>`,
        citations: [
          {
            title: "A Policy on Geometric Design of Highways and Streets",
            authors: "American Association of State Highway and Transportation Officials (AASHTO)",
            source: "AASHTO, 7th Edition (Green Book), Chapter 3: Superelevation, pp. 3-31 to 3-64",
            year: "2018",
            url: "https://bookstore.transportation.org/collection_detail.aspx?ID=110",
            verificationStatus: "verified_direct_content",
            evidencePin: "AASHTO 7th Ed, Sec 3.3.2, Eq. 3-6: e + f = V² / (127 R). Derivation of minimum curve radius for 120 km/h design speed.",
            note: "ข้อกำหนดและมาตรฐานวิศวกรรมทางหลวงระดับสากล"
          }
        ],
        engineeringNote: "ในประเทศไทย มาตรฐานกรมทางหลวงและทางหลวงพิเศษระหว่างเมือง กำหนดค่าอัตราการยกความลาดเอียงสูงสุด (e_max) ไว้ที่ 8% สำหรับทางหลวงนอกเมือง และ 6% สำหรับทางพิเศษในเขตเมือง โดยใช้เส้นโค้งเชื่อมต่อแบบคลอธอยด์ (Spiral transition curve) เพื่อค่อยๆ ปรับระดับมุมยกอย่างราบรื่น ไม่กระตุก"
      },

      {
        id: "PHE-CH02-02",
        chapterId: "ch02",
        division: "ภาคที่ 2: พลศาสตร์และวิศวกรรมแรงสู่ศูนย์กลาง",
        category: "วิศวกรรมสวนสนุกและไบโอเมคานิกส์ (Amusement Park Dynamics)",
        titleTh: "ห่วงตีลังการถไฟเหาะรูปคลอธอยด์",
        titleEn: "Clothoid Loop Roller Coasters & Biodynamic G-Force Attenuation",
        relatedTheoryId: "theory-5",
        relatedTheoryTitle: "ทฤษฎีที่ 5: วงกลมแนวดิ่งและเงื่อนไขวิกฤต",
        relatedSimulator: "circular",
        relatedSimSubmode: "vertical",
        observed: "ห่วงตีลังกาของรถไฟเหาะสมัยใหม่จะไม่เป็นรูปวงกลมกลมดิก แต่เป็นรูปหยดน้ำหัวกลับ (Tear-drop shape) ผู้เล่นที่นั่งในขบวนรถจะรู้สึกถึงแรงกดที่นุ่มนวล ไม่กระแทกหรือหน้ามืดหมดสติ (G-LOC)",
        mechanism: "หากสร้างลูปเป็นวงกลมรัศมีคงที่ $r$ เพื่อให้ที่จุดสูงสุดมีความเร็วพ้นวิกฤต $v_{\\text{top}} \\ge \\sqrt{gr}$ การอนุรักษ์พลังงานจะบีบให้ความเร็วที่จุดต่ำสุดพุ่งสูงถึง $v_{\\text{bot}} = \\sqrt{5gr}$ ทำให้เกิดความเร่งสู่ศูนย์กลางที่จุดล่างสุด $a_c = \\frac{v^2}{r} = 5g$ เมื่อรวมกับน้ำหนักตัวเอง $1g$ ผู้เล่นต้องรับแรงกดสูงถึง $6g$ ซึ่งอาจทำให้เส้นเลือดในสมองแตกหรือหมดสติ วิศวกรจึงใช้ 'เส้นโค้งคลอธอยด์' (Clothoid Loop) ที่มีรัศมีความโค้ง $r$ ใหญ่มากที่จุดเริ่มต้น แล้วค่อยๆ บีบแคบลงที่จุดยอด ทำให้ $a_c = v^2/r$ แทบจะคงที่สม่ำเสมอ ผู้เล่นรับแรงกดเพียง $3g – 3.5g$ ตลอดทั้งลูป",
        scope: "วิศวกรรมสวนสนุกระดับสากลตามมาตรฐาน ASTM F2291 Standard Practice for Design of Amusement Rides",
        formulas: [
          {
            latex: "r(s) = \\frac{A^2}{s} \\implies \\kappa(s) = \\frac{1}{r(s)} = \\frac{s}{A^2}",
            desc: "สมการคลอธอยด์ (Euler Spiral): ส่วนกลับของรัศมีความโค้ง (ความโค้ง κ) แปรผันตรงกับระยะทางตามแนวเส้นทาง s"
          },
          {
            latex: "a_c(s) = \\frac{v(s)^2}{r(s)} \\approx \\text{const}",
            desc: "การรักษาระดับความเร่งสู่ศูนย์กลางให้คงที่สม่ำเสมอตลอดการเคลื่อนที่ผ่านลูป"
          }
        ],
        variables: [
          { symbol: "r(s)", name: "รัศมีความโค้ง ณ ระยะทางใดๆ บนลูป", unit: "m", typical: "10 m (ที่ยอด) ถึง 40 m (ที่ฐาน)" },
          { symbol: "a_{\\text{net}}", name: "ความเร่งสุทธิที่กระทำต่อร่างกายมนุษย์", unit: "g (9.80 m/s²)", typical: "2.5 – 3.8 g" },
          { symbol: "A", name: "พารามิเตอร์มาตราส่วนของเส้นโค้งคลอธอยด์", unit: "m", typical: "15 – 35 m" }
        ],
        svgDiagram: `<svg viewBox="0 0 420 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:8px;">
          <circle cx="120" cy="110" r="60" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="120" y="40" fill="#EF4444" font-size="9" text-anchor="middle">ลูปวงกลมเดิม (อันตราย 6G!)</text>
          <path d="M 230 180 C 270 180 320 150 320 100 C 320 60 305 35 285 35 C 265 35 250 60 250 100 C 250 150 300 180 340 180" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
          <text x="285" y="25" fill="#38BDF8" font-size="10" font-weight="bold" text-anchor="middle">คลอธอยด์ (ยอด r เล็ก, ฐาน r ใหญ่)</text>
          <circle cx="285" cy="35" r="6" fill="#F59E0B"/>
          <line x1="285" y1="35" x2="285" y2="60" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-yellow)"/>
          <text x="295" y="55" fill="#F59E0B" font-size="9">ปลอดภัย 2.5G</text>
          <text x="285" y="165" fill="#10B981" font-size="9" text-anchor="middle">ฐานลูป: r ใหญ่ ชะลอความเร่งล่างสุด</text>
        </svg>`,
        citations: [
          {
            title: "Physics of loop-the-loop: A historical and educational perspective",
            authors: "Pendrill, A. M.",
            source: "Physics Education, Vol. 40, No. 6, pp. 517–521",
            year: "2005",
            url: "https://iopscience.iop.org/article/10.1088/0031-9120/40/6/001",
            verificationStatus: "verified_direct_content",
            evidencePin: "Pendrill (2005) Phys. Educ. 40 517: Equations for clothoid transition curves in roller coasters to avoid extreme g-forces.",
            note: "การวิเคราะห์กลศาสตร์ฟิสิกส์เปรียบเทียบระหว่างลูปวงกลมและคลอธอยด์"
          }
        ],
        engineeringNote: "Anton Schwarzkopf และ Werner Stengel เป็นผู้ปฏิวัติวงการสวนสนุกในปี 1976 โดยเปิดตัวรถไฟเหาะ 'The Revolution' ที่ Six Flags Magic Mountain ซึ่งเป็นรถไฟเหาะเครื่องแรกของโลกที่ใช้ลูปคลอธอยด์รูปหยดน้ำ ช่วยลด G-force ที่จุดล่างสุดจาก 6G เหลือเพียง 3.5G ทำให้ปลอดภัยต่อสรีระมนุษย์อย่างสมบูรณ์แบบ"
      },

      {
        id: "PHE-CH02-03",
        chapterId: "ch02",
        division: "ภาคที่ 2: พลศาสตร์และวิศวกรรมแรงสู่ศูนย์กลาง",
        category: "ฟิสิกส์อวกาศและวงโคจร (Orbital Mechanics & Astronautics)",
        titleTh: "วงโคจรค้างฟ้าของดาวเทียมสื่อสาร",
        titleEn: "Geostationary Equatorial Orbit & Keplerian Balance",
        relatedTheoryId: "theory-3",
        relatedTheoryTitle: "ทฤษฎีที่ 3: พลศาสตร์ของแรงสู่ศูนย์กลาง",
        relatedSimulator: "circular",
        relatedSimSubmode: "orbit",
        observed: "จานรับสัญญาณดาวเทียมตามบ้านเรือน (เช่น จานรับสัญญาณโทรทัศน์หรืออินเทอร์เน็ตผ่านดาวเทียม) ถูกติดตั้งตรึงแน่นชี้ไปที่มุมเดียวบนท้องฟ้าตลอด 24 ชั่วโมง โดยไม่ต้องติดตั้งมอเตอร์หมุนหันตามดาวเทียม",
        mechanism: "เมื่อดาวเทียมโคจรเป็นวงกลมในระนาบศูนย์สูตรของโลก แรงดึงดูดระหว่างมวลของนิวตัน $F_g = G\\frac{M_E m}{r^2}$ จะทำหน้าที่เป็นแรงสู่ศูนย์กลางเพียงหนึ่งเดียว: $G\\frac{M_E m}{r^2} = m\\omega^2 r = m\\left(\\frac{2\\pi}{T}\\right)^2 r$ เพื่อให้ดาวเทียมลอยอยู่เหนือตำแหน่งเดิมบนพื้นโลกตลอดเวลา คาบการโคจร $T$ ต้องเท่ากับคาบการหมุนรอบตัวเองของโลกพอดี (1 วันดาราคติ: $86,164.1\\text{ s}$) เมื่อแก้สมการจะได้รัศมีวงโคจรเจาะจงค่าเดียวคือ $r = 42,164\\text{ km}$ (ความสูงจากผิวดินประมาณ $35,786\\text{ km}$)",
        scope: "วงโคจรระนาบศูนย์สูตร (Inclination i = 0°), ความเยื้องศูนย์กลางเป็นศูนย์ (e = 0), แบบจำลองมวลจุดโลกทรงกลมสมบูรณ์",
        formulas: [
          {
            latex: "r_{\\text{GEO}} = \\sqrt[3]{\\frac{G M_E T_{\\text{sidereal}}^2}{4\\pi^2}} \\approx 42,164\\text{ km}",
            desc: "สมการรัศมีวงโคจรค้างฟ้าอนุมานจากกฎการดลและกฎข้อที่ 3 ของเคปเลอร์"
          },
          {
            latex: "v_{\\text{orb}} = \\sqrt{\\frac{G M_E}{r_{\\text{GEO}}}} \\approx 3.075\\text{ km/s} = 11,070\\text{ km/h}",
            desc: "อัตราเร็วเชิงเส้นในวงโคจรค้างฟ้า"
          }
        ],
        variables: [
          { symbol: "M_E", name: "มวลของดาวเคราะห์โลก", unit: "kg", typical: "5.972 × 10²⁴ kg" },
          { symbol: "G", name: "ค่าคงตัวความโน้มถ่วงสากล", unit: "N·m²/kg²", typical: "6.6743 × 10⁻¹¹" },
          { symbol: "T_{\\text{sidereal}}", name: "คาบวันดาราคติของโลก (Sidereal day)", unit: "s", typical: "86,164.1 s (23 ชม. 56 นาที 4.1 วิ)" },
          { symbol: "h_{\\text{GEO}}", name: "ความสูงเหนือระดับน้ำทะเลเฉลี่ย", unit: "km", typical: "35,786 km" }
        ],
        svgDiagram: `<svg viewBox="0 0 420 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:8px;">
          <circle cx="210" cy="110" r="32" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
          <text x="210" y="114" fill="#F8FAFC" font-size="10" font-weight="bold" text-anchor="middle">โลก</text>
          <circle cx="210" cy="110" r="90" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4,4"/>
          <text x="210" y="16" fill="#94A3B8" font-size="10" text-anchor="middle">วงโคจรค้างฟ้า r = 42,164 km</text>
          <g transform="translate(300, 110)">
            <rect x="-8" y="-6" width="16" height="12" fill="#F59E0B" stroke="#F8FAFC" stroke-width="1"/>
            <line x1="-18" y1="0" x2="-8" y2="0" stroke="#38BDF8" stroke-width="3"/>
            <line x1="8" y1="0" x2="18" y2="0" stroke="#38BDF8" stroke-width="3"/>
            <line x1="-8" y1="0" x2="-45" y2="0" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arr-red)"/>
            <text x="-40" y="-8" fill="#EF4444" font-size="10" font-weight="bold">F_g = GMm/r²</text>
            <line x1="0" y1="6" x2="0" y2="40" stroke="#10B981" stroke-width="2" marker-end="url(#arr-green)"/>
            <text x="6" y="32" fill="#10B981" font-size="10">v = 3.07 km/s</text>
          </g>
          <line x1="210" y1="110" x2="300" y2="110" stroke="#F59E0B" stroke-width="1" stroke-dasharray="2,2"/>
        </svg>`,
        citations: [
          {
            title: "Fundamentals of Astrodynamics",
            authors: "Bate, R. R., Mueller, D. D., & White, J. E.",
            source: "Dover Publications, Chapter 2: Two-Body Orbital Mechanics, pp. 49–54",
            year: "1971",
            url: "https://store.doverpublications.com/products/9780486600611",
            verificationStatus: "verified_direct_content",
            evidencePin: "Bate et al. (1971) Sec 2.6 pp. 49–54: Geosynchronous satellite radius derivation r = (μ / ω²)^(1/3) yielding 42,164 km.",
            note: "ตำรากลศาสตร์วงโคจรคลาสสิกของกองทัพอากาศสหรัฐฯ"
          }
        ],
        engineeringNote: "Arthur C. Clarke นักเขียนนิยายวิทยาศาสตร์และวิศวกร เป็นคนแรกที่เสนอแนวคิดวงโคจรค้างฟ้าเพื่อการถ่ายทอดสัญญาณวิทยุสื่อสารทั่วโลกในปี 1945 ทำให้วงโคจรนี้ได้รับเกียรติเรียกว่า 'The Clarke Orbit'"
      },

      {
        id: "PHE-CH02-04",
        chapterId: "ch02",
        division: "ภาคที่ 2: พลศาสตร์และวิศวกรรมแรงสู่ศูนย์กลาง",
        category: "ชีวการแพทย์และเคมีวิเคราะห์ (Biomedical & Laboratory Engineering)",
        titleTh: "การแยกชั้นชีวโมเลกุลด้วยเครื่องปั่นเหวี่ยงความเร็วสูงพิเศษ",
        titleEn: "Ultracentrifugation & High-g Separation of Biomolecules",
        relatedTheoryId: "theory-2",
        relatedTheoryTitle: "ทฤษฎีที่ 2: ความเร่งสู่ศูนย์กลาง",
        relatedSimulator: "circular",
        relatedSimSubmode: "banked",
        observed: "ในห้องปฏิบัติการทางการแพทย์ เลือดที่ถูกเจาะจากคนไข้เป็นของเหลวสีแดงขุ่นสม่ำเสมอ แต่เมื่อนำไปใส่หลอดแล้วปั่นในเครื่องปั่นเหวี่ยงเพียง 10 นาที เลือดจะแยกชั้นออกเป็นเซลล์เม็ดเลือดแดงที่ก้นหลอด และพลาสมาสีเหลืองใสอยู่ด้านบนอย่างเด็ดขาด",
        mechanism: "ภายใต้แรงโน้มถ่วงปกติของโลก ($1g$) อนุภาคขนาดเล็กเช่นโปรตีน ดีเอ็นเอ หรือเซลล์เม็ดเลือดแดงจะตกตะกอนช้ามากเพราะการเคลื่อนที่แบบบราวน์ (Brownian motion) ต้านการตกตะกอน เครื่องปั่นเหวี่ยง (Centrifuge) หมุนหลอดทดลองด้วยอัตราเร็วเชิงมุมมหาศาล (หมุนหลายพันถึงนับแสนรอบต่อนาที: RPM) สร้างความเร่งสู่ศูนย์กลาง $a_c = \\omega^2 r$ สูงกว่าแรงโน้มถ่วงโลกนับหมื่นถึงนับแสนเท่า ($RCF > 100,000g$) หลอดทดลองต้องออกแรงปฏิกิริยาผลักของเหลวเข้าสู่ศูนย์กลาง ในขณะที่อนุภาคที่มีความหนาแน่นสูงกว่าของเหลวแวดล้อมจะเคลื่อนที่ไปยังก้นหลอดด้วยอัตราเร็วตกตะกอน (Sedimentation velocity)",
        scope: "ชีวโมเลกุลและคอลลอยด์ในตัวกลางของเหลวหนืด (กฎของสโตกส์สำหรับอนุภาคทรงกลม)",
        formulas: [
          {
            latex: "RCF = \\frac{\\omega^2 r}{g} = 1.118 \\times 10^{-5} \\times r_{\\text{cm}} \\times (\\text{RPM})^2",
            desc: "สูตรคำนวณแรงเหวี่ยงสัมพัทธ์ (Relative Centrifugal Force / g-force) ที่นิยมใช้ในห้องปฏิบัติการ"
          },
          {
            latex: "v_{\\text{sed}} = \\frac{m(1 - \\bar{v}\\rho)\\omega^2 r}{f_{\\text{frictional}}} = s \\omega^2 r",
            desc: "สมการการตกตะกอนของสเวดเบิร์ก (Svedberg Equation) สำหรับการแยกชั้นโปรตีนและกรดนิวคลีอิก"
          }
        ],
        variables: [
          { symbol: "RCF", name: "แรงเหวี่ยงสัมพัทธ์เทียบกับแรงโน้มถ่วงโลก", unit: "× g", typical: "1,000 – 500,000 g" },
          { symbol: "\\text{RPM}", name: "ความเร็วรอบการหมุนของโรเตอร์ต่อนาที", unit: "rpm", typical: "3,000 – 100,000 rpm" },
          { symbol: "s", name: "สัมประสิทธิ์การตกตะกอน (Sedimentation Coefficient)", unit: "S (1 S = 10⁻¹³ s)", typical: "70S, 80S (ไรโบโซม)" }
        ],
        svgDiagram: `<svg viewBox="0 0 420 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#0F172A; border-radius:8px;">
          <circle cx="80" cy="110" r="14" fill="#64748B" stroke="#94A3B8" stroke-width="2"/>
          <text x="80" y="114" fill="#F8FAFC" font-size="9" text-anchor="middle">แกน</text>
          <path d="M 60 70 A 45 45 0 0 1 110 70" fill="none" stroke="#F59E0B" stroke-width="2" marker-end="url(#arr-yellow)"/>
          <text x="80" y="55" fill="#F59E0B" font-size="10" text-anchor="middle">ω (หมุนนับหมื่น RPM)</text>
          <line x1="94" y1="110" x2="230" y2="110" stroke="#475569" stroke-width="3"/>
          <text x="160" y="100" fill="#94A3B8" font-size="9">รัศมี r</text>
          <g transform="translate(230, 95)">
            <rect x="0" y="0" width="120" height="30" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
            <rect x="5" y="5" width="55" height="20" fill="#FDE047" fill-opacity="0.6"/>
            <text x="32" y="18" fill="#FDE047" font-size="8" text-anchor="middle">พลาสมา (เบา)</text>
            <rect x="60" y="5" width="55" height="20" rx="4" fill="#EF4444" fill-opacity="0.8"/>
            <text x="87" y="18" fill="#F8FAFC" font-size="8" text-anchor="middle">เม็ดเลือดแดง (หนัก)</text>
            <line x1="60" y1="35" x2="135" y2="35" stroke="#10B981" stroke-width="2.5" marker-end="url(#arr-green)"/>
            <text x="75" y="50" fill="#10B981" font-size="10" font-weight="bold">RCF &gt; 10,000g (แยกชั้นทันที)</text>
          </g>
        </svg>`,
        citations: [
          {
            title: "The Ultracentrifuge",
            authors: "Svedberg, T., & Pedersen, K. O.",
            source: "Oxford University Press, Clarendon Press",
            year: "1940",
            url: "https://archive.org/details/ultracentrifuge00sved",
            verificationStatus: "verified_direct_content",
            evidencePin: "Svedberg (1940), Part 1, pp. 5–28: Derivation of the Svedberg sedimentation coefficient and centrifugal acceleration equation.",
            note: "งานวิจัยรางวัลโนเบลผู้บุกเบิกเครื่องปั่นเหวี่ยงระดับโมเลกุล"
          }
        ],
        engineeringNote: "ในการใช้งานเครื่องปั่นเหวี่ยงความเร็วสูง (Ultracentrifuge) กฎความปลอดภัยที่เคร่งครัดที่สุดคือการ 'ถ่วงดุลน้ำหนักหลอดทดลอง' (Balancing) โดยหลอดที่อยู่ตรงข้ามกันต้องมีมวลเท่ากันในระดับทศนิยมมิลลิกรัม หากไม่สมดุล แรงเหวี่ยงไม่สมมาตรที่ 50,000 rpm จะสร้างแรงกระแทกหลายหมื่นนิวตันจนโรเตอร์แตกกระจายและทำลายห้องปฏิบัติการได้"
      }
    ]
  };
}));
