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
      },
      {
        id: "div-ch02-rotational",
        numeral: "ภาคที่ 3",
        titleTh: "พลศาสตร์การหมุนและวัตถุแข็งเกร็ง (Rotational Dynamics & Rigid Bodies)",
        description: "ทอร์ก โมเมนต์ความเฉื่อย ทฤษฎีบทแกนขนาน พลังงานจลน์การหมุน และการอนุรักษ์โมเมนตัมเชิงมุม"
      },
      {
        id: "div-ch02-pulleys",
        numeral: "ภาคที่ 4",
        titleTh: "กลศาสตร์รอกและการได้เปรียบเชิงกล (Pulley Mechanics & Mechanical Advantage)",
        description: "การวิเคราะห์แรงตึงเชือก รอกเดี่ยวตายตัว รอกเดี่ยวเคลื่อนที่ รอกพวง การได้เปรียบเชิงกล และประสิทธิภาพเชิงกล"
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
      },
      {
        symbol: "\\tau",
        name: "ทอร์กหรือโมเมนต์ของแรง (Torque)",
        unit: "\\text{N}\\cdot\\text{m}",
        domain: "rotational",
        desc: "ผลคูณเชิงเวกเตอร์ของเวกเตอร์ตำแหน่งและแรง τ = r × F = Iα ทำให้วัตถุเกิดความเร่งเชิงมุม"
      },
      {
        symbol: "I",
        name: "โมเมนต์ความเฉื่อย (Moment of Inertia)",
        unit: "\\text{kg}\\cdot\\text{m}^2",
        domain: "rotational",
        desc: "ปริมาณที่ต้านการเปลี่ยนแปลงสภาพการหมุน I = ∫ r² dm หรือ I = Σ m_i r_i²"
      },
      {
        symbol: "L",
        name: "โมเมนตัมเชิงมุม (Angular Momentum)",
        unit: "\\text{kg}\\cdot\\text{m}^2/\\text{s} = \\text{J}\\cdot\\text{s}",
        domain: "rotational",
        desc: "ผลคูณของโมเมนต์ความเฉื่อยกับความเร็วเชิงมุม L = Iω = r × p อนุรักษ์เมื่อทอร์กภายนอกสุทธิเป็นศูนย์"
      },
      {
        symbol: "K_{\\text{rot}}",
        name: "พลังงานจลน์การหมุน (Rotational Kinetic Energy)",
        unit: "\\text{J}",
        domain: "rotational",
        desc: "พลังงานจลน์สะสมในวัตถุที่กำลังหมุน K_rot = (1/2) I ω²"
      },
      {
        symbol: "\\text{MA}",
        name: "การได้เปรียบเชิงกล (Mechanical Advantage)",
        unit: "—",
        domain: "pulleys",
        desc: "อัตราส่วนระหว่างแรงต้าน (น้ำหนักวัตถุ) ต่อแรงพยายาม MA = F_out / F_in"
      },
      {
        symbol: "\\text{VR}",
        name: "อัตราส่วนความเร็ว (Velocity Ratio / IMA)",
        unit: "—",
        domain: "pulleys",
        desc: "อัตราส่วนระหว่างระยะทางที่แรงพยายามเคลื่อนที่ต่อระยะทางที่วัตถุเคลื่อนที่ VR = d_in / d_out"
      },
      {
        symbol: "\\eta",
        name: "ประสิทธิภาพเชิงกลของเครื่องกล (Mechanical Efficiency)",
        unit: "\\%",
        domain: "pulleys",
        desc: "อัตราส่วนงานที่ได้ต่องานที่ให้ η = (MA / VR) × 100% หรือ (W_out / W_in) × 100%"
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
      },

      // ----------------------------------------------------------------------
      // Theory 6: Torque, Rotational Equilibrium & Newton's Second Law for Rotation
      // ----------------------------------------------------------------------
      {
        id: "ch02-th06",
        chapterId: "ch02",
        divisionId: "div-ch02-rotational",
        divisionTitle: "ภาคที่ 3: พลศาสตร์การหมุนและวัตถุแข็งเกร็ง",
        numberTh: "ทฤษฎีที่ 6",
        type: "ทฤษฎีพลศาสตร์ (Rotational Dynamics Theory)",
        titleTh: "ทอร์ก สมดุลการหมุน และกฎการเคลื่อนที่ของการหมุน",
        titleEn: "Torque, Rotational Equilibrium & Newton's Second Law for Rotation",
        summary: "นิยามทอร์กในฐานะผลคูณเชิงเวกเตอร์ แขนของแรง กฎข้อที่สองของนิวตันสำหรับการหมุนรอบแกนตรึง และเงื่อนไขสมดุลสัมบูรณ์ของวัตถุแข็งเกร็ง",
        definition: {
          text: "ทอร์ก (Torque, $\\vec{\\tau}$) หรือโมเมนต์ของแรง (Moment of Force) คือ ปริมาณเวกเตอร์ที่วัดประสิทธิผลของแรงในการทำให้วัตถุแข็งเกร็งเกิดการหมุนรอบแกนหมุนหรือจุดหมุนอ้างอิง นิยามจากผลคูณเชิงเวกเตอร์ (Cross Product) ระหว่างเวกเตอร์บอกตำแหน่ง $\\vec{r}$ จากจุดหมุนไปยังจุดที่แรงกระทำ กับเวกเตอร์แรง $\\vec{F}$:\n$$\\vec{\\tau} = \\vec{r} \\times \\vec{F}$$\nขนาดของทอร์กคือ $\\tau = r F \\sin\\theta = F r_\\perp$ โดย $r_\\perp = r\\sin\\theta$ เรียกว่า 'แขนของแรง' (Lever Arm หรือ Moment Arm) ซึ่งคือระยะทางตั้งฉากสั้นที่สุดจากจุดหมุนไปยังแนวแรง\n\nวัตถุแข็งเกร็งจะอยู่ใน 'สมดุลสัมบูรณ์' (Complete Mechanical Equilibrium) ก็ต่อเมื่อเป็นไปตาม 2 เงื่อนไขพร้อมกัน:\n1. สมดุลการเลื่อนที่ (Translational Equilibrium): $\\Sigma \\vec{F} = 0$\n2. สมดุลการหมุน (Rotational Equilibrium): $\\Sigma \\vec{\\tau} = 0$"
        },
        principle: {
          text: "การเชื่อมโยงสู่กฎการเคลื่อนที่ของการหมุน (Newton's Second Law for Rotation):\nสำหรับอนุภาคเดี่ยวมวล $m$ ที่หมุนเป็นวงกลมรัศมี $r$ ด้วยแรงแนวสัมผัส $F_t = m a_t = m(r\\alpha)$ เมื่อคูณด้วยรัศมี $r$ ทั้งสองข้าง:\n$$\\tau = r F_t = r(m r \\alpha) = (m r^2) \\alpha = I \\alpha$$\nสำหรับวัตถุแข็งเกร็งใดๆ ที่ประกอบด้วยมวลย่อยจำนวนมากหมุนรอบแกนตรึง ทุกจุดในเนื้อวัตถุจะมีความเร่งเชิงมุม $\\alpha$ ร่วมกัน ผลรวมของทอร์กภายนอกสุทธิจึงเท่ากับผลคูณระหว่างโมเมนต์ความเฉื่อย $I$ กับความเร่งเชิงมุม $\\vec{\\alpha}$:\n$$\\Sigma \\vec{\\tau}_{\\text{ext}} = I \\vec{\\alpha} = \\frac{d\\vec{L}}{dt}$$\nทิศทางของเวกเตอร์ทอร์กกำหนดโดยกฎมือขวา (Right-Hand Rule) พุ่งตามแนวแกนหมุน"
        },
        formulas: [
          {
            name: "นิยามทอร์กเชิงเวกเตอร์และขนาดตามแขนของแรง",
            latex: "\\vec{\\tau} = \\vec{r} \\times \\vec{F}, \\quad \\tau = r F \\sin\\theta = F r_\\perp",
            symbols: [
              { sym: "\\vec{\\tau}", desc: "เวกเตอร์ทอร์กหรือโมเมนต์ของแรง", unit: "\\text{N}\\cdot\\text{m}" },
              { sym: "\\vec{r}", desc: "เวกเตอร์ตำแหน่งจากจุดหมุนไปยังจุดกระทำของแรง", unit: "\\text{m}" },
              { sym: "\\vec{F}", desc: "เวกเตอร์แรงที่กระทำต่อวัตถุ", unit: "\\text{N}" },
              { sym: "\\theta", desc: "มุมระหว่างเวกเตอร์ r และเวกเตอร์ F", unit: "\\text{rad หรือ } ^\\circ" },
              { sym: "r_\\perp", desc: "แขนของแรง (ระยะตั้งฉากจากจุดหมุนไปยังแนวแรง)", unit: "\\text{m}" }
            ],
            derivationSteps: [
              "1. พิจารณาแรง F กระทำที่ตำแหน่ง r เทียบกับจุดหมุน",
              "2. แตกแรง F ออกเป็นสององค์ประกอบตั้งฉาก: แนวรัศมี F_r = F cos θ (ผ่านจุดหมุน) และแนวตั้งฉาก F_t = F sin θ",
              "3. แรงแนวรัศมี F_r พุ่งผ่านจุดหมุนโดยตรง ไม่ทำให้เกิดการหมุน (ทอร์กเป็นศูนย์)",
              "4. มีเพียงแรงแนวสัมผัส F_t เท่านั้นที่ก่อให้เกิดการหมุน: τ = r F_t = r (F sin θ)",
              "5. จัดรูปใหม่เป็น τ = F (r sin θ) = F r_perp ซึ่ง r_perp คือแขนของแรง"
            ]
          },
          {
            name: "กฎข้อที่สองของนิวตันสำหรับการหมุนรอบแกนตรึง",
            latex: "\\Sigma \\vec{\\tau}_{\\text{ext}} = I \\vec{\\alpha} = I \\frac{d^2\\theta}{dt^2}",
            symbols: [
              { sym: "\\Sigma \\tau", desc: "ผลรวมทอร์กภายนอกสุทธิรอบแกนหมุน", unit: "\\text{N}\\cdot\\text{m}" },
              { sym: "I", desc: "โมเมนต์ความเฉื่อยของวัตถุรอบแกนหมุน", unit: "\\text{kg}\\cdot\\text{m}^2" },
              { sym: "\\vec{\\alpha}", desc: "เวกเตอร์ความเร่งเชิงมุม", unit: "\\text{rad/s}^2" }
            ],
            derivationSteps: [
              "1. พิจารณาส่วนย่อยมวล dm_i ที่ตำแหน่ง r_i หมุนรอบแกนด้วยความเร่งแนวสัมผัส a_{t,i} = r_i α",
              "2. แรงสัมผัสย่อย dF_{t,i} = dm_i a_{t,i} = dm_i r_i α",
              "3. ทอร์กย่อย dτ_i = r_i dF_{t,i} = (dm_i r_i^2) α",
              "4. รวมทอร์กทุกส่วนย่อยในวัตถุ: Σ τ = (Σ m_i r_i^2) α",
              "5. นิยาม I = Σ m_i r_i^2 จะได้สมการหลัก: Σ τ = I α"
            ]
          }
        ],
        application: {
          text: "การออกแบบด้ามจับประแจและคานผ่อนแรง, ระบบส่งกำลังเพลาและเฟืองเกียร์ในรถยนต์, สมดุลของปั้นจั่นและสะพานแขวน, การทำงานของบานพับประตูและหน้าต่าง",
          validWhen: "วัตถุเป็นวัตถุแข็งเกร็ง (Rigid Body) ที่ระยะห่างระหว่างจุดย่อยไม่เปลี่ยนแปลง และแกนหมุนตรึงแน่นหรือผ่านจุดศูนย์กลางมวลในแนวแกนสมมาตร",
          invalidWhen: "วัตถุอ่อนยวบเสียรูปได้ขณะหมุน หรือระบบพิกัดที่แกนหมุนเอียงส่ายไปมาโดยไม่มีการคำนวณเทนเซอร์ความเฉื่อยแบบ 3 มิติเต็มรูปแบบ"
        },
        example: {
          problem: "ช่างเครื่องใช้ประแจยาว $L = 0.30\\text{ m}$ ขันน็อตล้อรถ โดยออกแรง $F = 80\\text{ N}$ ที่ปลายประแจทำมุม $\\theta = 60^\\circ$ เทียบกับแกนของด้ามประแจ ถ้าโมเมนต์ความเฉื่อยของชุดล้อและเพลาเท่ากับ $I = 2.4\\text{ kg}\\cdot\\text{m}^2$ และไม่มีแรงต้านการหมุน จงหา: (ก) ขนาดของทอร์กที่กระทำต่อน็อต และ (ข) ความเร่งเชิงมุม $\\alpha$ ของชุดล้อ",
          steps: [
            "ขั้นตอนที่ 1: วิเคราะห์ข้อมูลที่โจทย์กำหนด: $r = L = 0.30\\text{ m}$, $F = 80\\text{ N}$, $\\theta = 60^\\circ$, $I = 2.4\\text{ kg}\\cdot\\text{m}^2$",
            "ขั้นตอนที่ 2: คำนวณแขนของแรง: $r_\\perp = r\\sin\\theta = (0.30)\\sin(60^\\circ) = (0.30)(0.8660) \\approx 0.2598\\text{ m}$",
            "ขั้นตอนที่ 3: คำนวณขนาดของทอร์ก: $\\tau = r F \\sin\\theta = (0.30\\text{ m})(80\\text{ N})\\sin(60^\\circ) = 24.0 \\times 0.8660 \\approx 20.78\\text{ N}\\cdot\\text{m}$",
            "ขั้นตอนที่ 4: คำนวณความเร่งเชิงมุมจากกฎข้อที่สองของการหมุน: $\\alpha = \\frac{\\tau}{I} = \\frac{20.78}{2.4} \\approx 8.66\\text{ rad/s}^2$",
            "สรุป: ทอร์กที่กระทำมีขนาด $20.8\\text{ N}\\cdot\\text{m}$ และสร้างความเร่งเชิงมุมให้ชุดล้อเท่ากับ $8.66\\text{ rad/s}^2$"
          ],
          diagramSvg: `<svg viewBox="0 0 520 200" class="theory-diagram-svg w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพทอร์กและแขนของแรง">
            <rect width="520" height="200" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <!-- Pivot Nut -->
            <polygon points="100,100 115,74 145,74 160,100 145,126 115,126" fill="#475569" stroke="#94A3B8" stroke-width="2"/>
            <circle cx="130" cy="100" r="10" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
            <text x="130" y="104" fill="#38BDF8" font-size="9" text-anchor="middle">จุดหมุน</text>
            <!-- Wrench Handle -->
            <rect x="145" y="93" width="220" height="14" rx="3" fill="#334155" stroke="#64748B" stroke-width="1.5"/>
            <circle cx="365" cy="100" r="12" fill="#475569" stroke="#94A3B8" stroke-width="1.5"/>
            <!-- Length r -->
            <line x1="130" y1="135" x2="365" y2="135" stroke="#94A3B8" stroke-width="1.5" marker-start="url(#arr-cyan)" marker-end="url(#arr-cyan)"/>
            <text x="247" y="152" fill="#94A3B8" font-size="11" text-anchor="middle">ระยะ r = 0.30 m</text>
            <!-- Applied Force F -->
            <line x1="365" y1="100" x2="435" y2="30" stroke="#EF4444" stroke-width="2.5" marker-end="url(#arr-red)"/>
            <text x="445" y="32" fill="#EF4444" font-size="12" font-weight="bold">F = 80 N</text>
            <!-- Angle Arc -->
            <path d="M 405 100 A 40 40 0 0 0 395 70" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
            <line x1="365" y1="100" x2="425" y2="100" stroke="#64748B" stroke-width="1" stroke-dasharray="3,3"/>
            <text x="415" y="85" fill="#F59E0B" font-size="11">θ = 60°</text>
            <!-- Lever Arm r_perp -->
            <line x1="130" y1="100" x2="200" y2="35" stroke="#10B981" stroke-width="2" stroke-dasharray="4,3"/>
            <text x="140" y="55" fill="#10B981" font-size="11" font-weight="bold">r_⊥ = r sin θ</text>
            <!-- Torque arrow -->
            <path d="M 105 60 A 35 35 0 0 1 155 60" fill="none" stroke="#38BDF8" stroke-width="2" marker-end="url(#arr-cyan)"/>
            <text x="130" y="45" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle">τ = r × F (ทวนเข็มนาฬิกา)</text>
          </svg>`,
          diagramCaption: "การวิเคราะห์ทอร์ก: มีเพียงองค์ประกอบแรงที่ตั้งฉากกับก้านประแจ F sin θ เท่านั้นที่ทำให้เกิดทอร์กหมุนน็อต"
        },
        observations: [
          "ทอร์กขึ้นกับจุดหมุนที่เลือก: ในระบบที่ไม่สมดุล ค่าทอร์กสุทธิจะเปลี่ยนไปหากเปลี่ยนจุดอ้างอิง แต่ในระบบที่สมดุลการเลื่อนที่ (ΣF = 0) ค่าทอร์กสุทธิจะมีค่าเท่ากันทุกจุดหมุนอ้างอิง",
          "แรงคู่ควบ (Couple): แรงสองแรงที่มีขนาดเท่ากันแต่ทิศตรงกันข้ามและแนวแรงขนานกัน จะสร้างทอร์กคู่ควบ τ = F d (โดย d คือระยะห่างระหว่างแนวแรง) ซึ่งไม่ขึ้นกับจุดหมุนเลย"
        ],
        citation: "Morin, D. (2008). Introduction to Classical Mechanics, Chapter 8: Angular Momentum Part I, Cambridge University Press.",
        citations: [
          {
            title: "Introduction to Classical Mechanics: With Problems and Solutions",
            authors: "David Morin",
            source: "Cambridge University Press, Chapter 8, pp. 289–310",
            year: "2008",
            url: "https://www.cambridge.org/highereducation/books/introduction-to-classical-mechanics/3004C94CBAAC2649B90967A99D417834",
            verificationStatus: "verified_direct_content",
            evidencePin: "Morin (2008) Chapter 8 pp. 289–310: Torque definition, cross product, and rigid body rotational second law.",
            note: "รากฐานกลศาสตร์การหมุนและทอร์ก"
          }
        ]
      },

      // ----------------------------------------------------------------------
      // Theory 7: Moment of Inertia, Parallel Axis Theorem & Rotational Kinetic Energy
      // ----------------------------------------------------------------------
      {
        id: "ch02-th07",
        chapterId: "ch02",
        divisionId: "div-ch02-rotational",
        divisionTitle: "ภาคที่ 3: พลศาสตร์การหมุนและวัตถุแข็งเกร็ง",
        numberTh: "ทฤษฎีที่ 7",
        type: "ทฤษฎีรากฐาน (Fundamental Inertia Theory)",
        titleTh: "โมเมนต์ความเฉื่อย ทฤษฎีบทแกนขนาน และพลังงานจลน์การหมุน",
        titleEn: "Moment of Inertia, Parallel Axis Theorem & Rotational Kinetic Energy",
        summary: "การคำนวณโมเมนต์ความเฉื่อยแบบไม่ต่อเนื่องและอินทิกรัล ทฤษฎีบทแกนขนานของสไตเนอร์ พลังงานจลน์การหมุน และการกลิ้งโดยไม่ไถล",
        definition: {
          text: "โมเมนต์ความเฉื่อย (Moment of Inertia, $I$) คือ ปริมาณสเกลาร์ที่บอกถึงความเฉื่อยในการหมุน (Rotational Inertia) หรือความสามารถในการต้านทานการเปลี่ยนแปลงสภาพการหมุนรอบแกนหนึ่งๆ ของวัตถุ โดยขึ้นอยู่กับมวลของวัตถุและ 'ลักษณะการกระจายตัวของมวลรอบแกนหมุน':\n1. ระบบมวลจุดไม่ต่อเนื่อง: $I = \\sum_{i} m_i r_i^2$\n2. วัตถุเนื้อแน่นต่อเนื่อง: $I = \\int r^2 dm = \\int \\rho(\\vec{r}) r_\\perp^2 dV$\n\nทฤษฎีบทแกนขนาน (Parallel Axis Theorem หรือ Steiner's Theorem) ระบุว่า หากทราบโมเมนต์ความเฉื่อยรอบแกนที่ผ่านจุดศูนย์กลางมวล ($I_{\\text{cm}}$) แล้ว โมเมนต์ความเฉื่อยรอบแกนหมุนใดๆ ที่ขนานกับแกนเดิมและอยู่ห่างเป็นระยะ $d$ จะมีค่าเท่ากับ:\n$$I = I_{\\text{cm}} + M d^2$$"
        },
        principle: {
          text: "พลังงานจลน์การหมุนและการกลิ้งโดยไม่ไถล (Rolling Without Slipping):\nเมื่อวัตถุหมุนรอบแกนตรึงด้วยความเร็วเชิงมุม $\\omega$ อนุภาคแต่ละจุดมีความเร็ว $v_i = \\omega r_i$ พลังงานจลน์รวมคือ:\n$$K_{\\text{rot}} = \\sum \\frac{1}{2} m_i v_i^2 = \\frac{1}{2}\\left(\\sum m_i r_i^2\\right)\\omega^2 = \\frac{1}{2} I \\omega^2$$\nหากวัตถุหมุนพร้อมกับเลื่อนตำแหน่งไปด้วย (เช่น ล้อรถยนต์ หรือลูกบอลกลิ้งบนพื้น) พลังงานจลน์รวมสามารถแยกออกเป็น 2 ส่วนตามทฤษฎีบทของโคนิก (Koenig's Theorem):\n$$K_{\\text{tot}} = K_{\\text{trans}} + K_{\\text{rot}} = \\frac{1}{2}M v_{\\text{cm}}^2 + \\frac{1}{2}I_{\\text{cm}}\\omega^2$$\nในเงื่อนไขการกลิ้งโดยไม่ไถล (Rolling without slipping): $v_{\\text{cm}} = \\omega R$ ส่งผลให้พลังงานจลน์รวมสามารถจัดรูปเป็น $K_{\\text{tot}} = \\frac{1}{2} M v_{\\text{cm}}^2\\left(1 + \\frac{I_{\\text{cm}}}{M R^2}\\right)$ ซึ่งตัวแปรไร้มิติ $c = \\frac{I_{\\text{cm}}}{M R^2}$ กำหนดอัตราส่วนการแบ่งสรรพลังงานระหว่างการเลื่อนที่กับการหมุน"
        },
        formulas: [
          {
            name: "นิยามโมเมนต์ความเฉื่อยและการอินทิเกรตมวลต่อเนื่อง",
            latex: "I = \\sum_{i=1}^N m_i r_i^2 \\quad \\iff \\quad I = \\int r^2 dm",
            symbols: [
              { sym: "I", desc: "โมเมนต์ความเฉื่อยรอบแกนหมุนที่กำหนด", unit: "\\text{kg}\\cdot\\text{m}^2" },
              { sym: "m_i, dm", desc: "มวลของอนุภาคย่อยหรือชิ้นส่วนมวลเชิงอนุพันธ์", unit: "\\text{kg}" },
              { sym: "r_i, r", desc: "ระยะห่างตั้งฉากจากแกนหมุนไปยังชิ้นมวล", unit: "\\text{m}" }
            ],
            derivationSteps: [
              "1. แท่งวัตถุสม่ำเสมอความยาว L มวล M หมุนรอบแกนตั้งฉากผ่านปลาย: dm = (M/L) dx",
              "2. I_end = ∫_0^L x^2 dm = (M/L) ∫_0^L x^2 dx = (M/L) [x^3/3]_0^L = (1/3) M L^2",
              "3. ทรงกระบอกตันรัศมี R มวล M: แบ่งเป็นเปลือกทรงกระบอกบาง dm = 2π r L ρ dr",
              "4. I_cyl = ∫_0^R r^2 (2π r L ρ dr) = 2π ρ L [r^4/4]_0^R = (1/2) M R^2",
              "5. ทรงกลมตันรัศมี R มวล M: I_sphere = (2/5) M R^2"
            ]
          },
          {
            name: "ทฤษฎีบทแกนขนานของสไตเนอร์ (Parallel Axis Theorem)",
            latex: "I = I_{\\text{cm}} + M d^2",
            symbols: [
              { sym: "I", desc: "โมเมนต์ความเฉื่อยรอบแกนหมุนเป้าหมาย", unit: "\\text{kg}\\cdot\\text{m}^2" },
              { sym: "I_{\\text{cm}}", desc: "โมเมนต์ความเฉื่อยรอบแกนขนานที่ผ่านจุดศูนย์กลางมวล", unit: "\\text{kg}\\cdot\\text{m}^2" },
              { sym: "M", desc: "มวลรวมทั้งหมดของวัตถุ", unit: "\\text{kg}" },
              { sym: "d", desc: "ระยะห่างตั้งฉากระหว่างแกนหมุนทั้งสอง", unit: "\\text{m}" }
            ],
            derivationSteps: [
              "1. ตั้งพิกัดโดยให้จุด CM อยู่ที่จุดกำเนิด (0,0,0) ดังนั้น r_i = r'_i + d",
              "2. I = Σ m_i (r'_i + d)^2 = Σ m_i (r'^2_i + 2 r'_i · d + d^2)",
              "3. แยกพจน์: I = Σ m_i r'^2_i + 2 d · (Σ m_i r'_i) + d^2 Σ m_i",
              "4. พจน์แรกคือ I_cm, พจน์สุดท้ายคือ M d^2",
              "5. เนื่องจาก CM อยู่ที่จุดกำเนิด Σ m_i r'_i = 0 พจน์กลางจึงหายไป: I = I_cm + M d^2"
            ]
          },
          {
            name: "พลังงานจลน์รวมของการกลิ้งโดยไม่ไถล",
            latex: "K_{\\text{tot}} = \\frac{1}{2} M v_{\\text{cm}}^2 + \\frac{1}{2} I_{\\text{cm}} \\omega^2 = \\frac{1}{2} M v_{\\text{cm}}^2\\left(1 + \\frac{I_{\\text{cm}}}{M R^2}\\right)",
            symbols: [
              { sym: "K_{\\text{tot}}", desc: "พลังงานจลน์รวมทั้งหมด", unit: "\\text{J}" },
              { sym: "v_{\\text{cm}}", desc: "ความเร็วเชิงเส้นของจุดศูนย์กลางมวล", unit: "\\text{m/s}" },
              { sym: "\\omega", desc: "ความเร็วเชิงมุมของการหมุน", unit: "\\text{rad/s}" }
            ],
            derivationSteps: [
              "1. พลังงานจลน์ของการเคลื่อนที่เลื่อนตำแหน่ง CM: K_trans = (1/2) M v_cm^2",
              "2. พลังงานจลน์ของการหมุนรอบ CM: K_rot = (1/2) I_cm ω^2",
              "3. เงื่อนไขการกลิ้งโดยไม่ไถล: v_cm = ω R => ω = v_cm / R",
              "4. แทนค่า ω: K_rot = (1/2) I_cm (v_cm / R)^2 = (1/2) (I_cm / R^2) v_cm^2",
              "5. รวมพลังงาน: K_tot = (1/2) M v_cm^2 [1 + I_cm / (M R^2)]"
            ]
          }
        ],
        application: {
          text: "การออกแบบล้อตุนกำลัง (Flywheel) เพื่อกักเก็บพลังงานกลในระบบไฮบริด, การวิเคราะห์ความเร็วของวัตถุกลิ้งลงพื้นเอียง (ลูกบอล ทรงกระบอก ห่วง), การทรงตัวของล้อรถจักรยานยนต์และเพลาข้อเหวี่ยง",
          validWhen: "การกลิ้งเกิดขึ้นบนพื้นผิวโดยไม่มีการลื่นไถลสัมพัทธ์ ณ จุดสัมผัส ($v_{\\text{contact}} = 0$) และวัสดุไม่เกิดการเสียรูปแบบไม่ยืดหยุ่น",
          invalidWhen: "การลื่นไถล (Slipping or Skidding) เช่น ขณะเบรกกะทันหันบนพื้นเปียก ซึ่งต้องคิดแรงเสียดทานจลน์และงานความร้อนสูญเสีย"
        },
        example: {
          problem: "ปล่อยวัตถุทรงเรขาคณิต 3 ชนิดที่มีมวล $M$ และรัศมี $R$ เท่ากัน ได้แก่: (1) ทรงกลมตัน ($I = \\frac{2}{5}MR^2$) (2) ทรงกระบอกตัน ($I = \\frac{1}{2}MR^2$) และ (3) ห่วงกลมบาง ($I = MR^2$) ให้กลิ้งโดยไม่ไถลลงมาจากยอดพื้นเอียงสูง $h = 2.0\\text{ m}$ จากสภาพนิ่ง จงหา: (ก) ความเร็วเชิงเส้น $v_{\\text{cm}}$ ที่ปลายพื้นเอียงของแต่ละวัตถุ และ (ข) วัตถุใดถึงปลายพื้นเอียงก่อนกัน",
          steps: [
            "ขั้นตอนที่ 1: ใช้กฎการอนุรักษ์พลังงานกล: $M g h = K_{\\text{tot}} = \\frac{1}{2} M v_{\\text{cm}}^2\\left(1 + \\frac{I_{\\text{cm}}}{M R^2}\\right)$",
            "ขั้นตอนที่ 2: จัดรูปหาความเร็วปลาย: $v_{\\text{cm}} = \\sqrt{\\frac{2gh}{1 + c}}$ โดย $c = \\frac{I_{\\text{cm}}}{M R^2}$",
            "ขั้นตอนที่ 3: คำนวณทรงกลมตัน ($c = 2/5 = 0.40$):\n$v = \\sqrt{\\frac{2(9.81)(2.0)}{1 + 0.40}} = \\sqrt{\\frac{39.24}{1.40}} = \\sqrt{28.03} \\approx 5.29\\text{ m/s}$",
            "ขั้นตอนที่ 4: คำนวณทรงกระบอกตัน ($c = 1/2 = 0.50$):\n$v = \\sqrt{\\frac{2(9.81)(2.0)}{1 + 0.50}} = \\sqrt{\\frac{39.24}{1.50}} = \\sqrt{26.16} \\approx 5.11\\text{ m/s}$",
            "ขั้นตอนที่ 5: คำนวณห่วงกลมบาง ($c = 1.0$):\n$v = \\sqrt{\\frac{2(9.81)(2.0)}{1 + 1.0}} = \\sqrt{\\frac{39.24}{2.00}} = \\sqrt{19.62} \\approx 4.43\\text{ m/s}$",
            "สรุป: ทรงกลมตันวิ่งเร็วที่สุด ($5.29\\text{ m/s}$) และถึงปลายทางก่อนใคร ตามด้วยทรงกระบอกตัน ($5.11\\text{ m/s}$) และห่วงกลมบางถึงช้าที่สุด ($4.43\\text{ m/s}$) เนื่องจากทรงกลมตันมีสัดส่วนความเฉื่อยการหมุนต่ำที่สุด จึงแบ่งพลังงานศักย์ไปใช้ในการหมุนน้อยที่สุด เหลือให้พลังงานจลน์เลื่อนที่มากที่สุด"
          ],
          diagramSvg: `<svg viewBox="0 0 520 200" class="theory-diagram-svg w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="การกลิ้งลงพื้นเอียงเปรียบเทียบโมเมนต์ความเฉื่อย">
            <rect width="520" height="200" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <!-- Incline Plane -->
            <polygon points="40,170 420,170 40,50" fill="#1E293B" stroke="#475569" stroke-width="2"/>
            <text x="50" y="110" fill="#94A3B8" font-size="11">h = 2.0 m</text>
            <line x1="30" y1="50" x2="30" y2="170" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="3,3"/>
            <!-- Sphere (Fastest) -->
            <g transform="translate(140, 82)">
              <circle cx="0" cy="0" r="18" fill="#3B82F6" stroke="#60A5FA" stroke-width="2"/>
              <circle cx="0" cy="0" r="4" fill="#F8FAFC"/>
              <text x="24" y="-8" fill="#60A5FA" font-size="10" font-weight="bold">1. ทรงกลมตัน (c = 0.4)</text>
              <text x="24" y="6" fill="#10B981" font-size="9">v = 5.29 m/s (เร็วสุด!)</text>
            </g>
            <!-- Cylinder (Mid) -->
            <g transform="translate(230, 110)">
              <circle cx="0" cy="0" r="18" fill="#F59E0B" stroke="#FBBF24" stroke-width="2"/>
              <circle cx="0" cy="0" r="7" fill="#1E293B" stroke="#FBBF24" stroke-width="1.5"/>
              <text x="24" y="-8" fill="#FBBF24" font-size="10" font-weight="bold">2. ทรงกระบอกตัน (c = 0.5)</text>
              <text x="24" y="6" fill="#F59E0B" font-size="9">v = 5.11 m/s</text>
            </g>
            <!-- Hoop (Slowest) -->
            <g transform="translate(320, 138)">
              <circle cx="0" cy="0" r="18" fill="none" stroke="#EF4444" stroke-width="4"/>
              <text x="24" y="-8" fill="#EF4444" font-size="10" font-weight="bold">3. ห่วงกลมบาง (c = 1.0)</text>
              <text x="24" y="6" fill="#F87171" font-size="9">v = 4.43 m/s (ช้าสุด)</text>
            </g>
          </svg>`,
          diagramCaption: "การกลิ้งลงพื้นเอียง: วัตถุที่มีค่าอัตราส่วนโมเมนต์ความเฉื่อย c = I/(MR²) น้อยที่สุด จะถึงเส้นชัยก่อนเสมอโดยไม่ขึ้นกับมวลและรัศมี"
        },
        observations: [
          "ความเป็นอิสระจากมวลและรัศมี: อัตราเร่งเชิงเส้น $a = \\frac{g\\sin\\theta}{1 + c}$ และความเร็วปลาย $v = \\sqrt{\\frac{2gh}{1+c}}$ ไม่ขึ้นกับมวล $M$ หรือรัศมี $R$ ของวัตถุเลย แต่ขึ้นอยู่กับ 'รูปทรงเรขาคณิต' ผ่านตัวแปร $c$ เท่านั้น",
          "บทบาทของแรงเสียดทานสถิต: ในการกลิ้งโดยไม่ไถล แรงเสียดทานสถิต $f_s$ ทำหน้าที่สร้างทอร์กหมุนวัตถุ แต่ 'ไม่ทำงานสุทธิ' (Zero Work) เพราะจุดสัมผัสหยุดนิ่งชั่วขณะ จึงไม่มีการสูญเสียพลังงานกลเป็นความร้อน"
        ],
        citation: "Halliday, D., Resnick, R., & Walker, J. (2018). Fundamentals of Physics (11th Ed.), Chapter 11: Rolling, Torque, and Angular Momentum. Wiley.",
        citations: [
          {
            title: "Fundamentals of Physics",
            authors: "Halliday, D., Resnick, R., & Walker, J.",
            source: "Wiley, 11th Edition, Chapter 11: Rolling and Angular Momentum, pp. 295–320",
            year: "2018",
            url: "https://www.wiley.com/en-us/Fundamentals+of+Physics%2C+11th+Edition-p-9781119460138",
            verificationStatus: "verified_direct_content",
            evidencePin: "Halliday & Resnick (2018) Ch 11 pp. 295–320: Derivation of kinetic energy of rolling without slipping and parallel-axis theorem.",
            note: "ตำราฟิสิกส์มาตรฐานระดับมหาวิทยาลัย"
          }
        ]
      },

      // ----------------------------------------------------------------------
      // Theory 8: Angular Momentum & Conservation Law
      // ----------------------------------------------------------------------
      {
        id: "ch02-th08",
        chapterId: "ch02",
        divisionId: "div-ch02-rotational",
        divisionTitle: "ภาคที่ 3: พลศาสตร์การหมุนและวัตถุแข็งเกร็ง",
        numberTh: "ทฤษฎีที่ 8",
        type: "กฎการอนุรักษ์ (Conservation Law)",
        titleTh: "โมเมนตัมเชิงมุมและกฎการอนุรักษ์โมเมนตัมเชิงมุม",
        titleEn: "Angular Momentum & Law of Conservation of Angular Momentum",
        summary: "นิยามโมเมนตัมเชิงมุมของอนุภาคและวัตถุแข็งเกร็ง ความสัมพันธ์กับทอร์กสุทธิ กฎการอนุรักษ์โมเมนตัมเชิงมุม กฎข้อที่สองของเคปเลอร์ และการควงของไจโรสโคป",
        definition: {
          text: "โมเมนตัมเชิงมุม (Angular Momentum, $\\vec{L}$) คือ ปริมาณเวกเตอร์ที่วัดปริมาณการหมุนของวัตถุเทียบกับจุดอ้างอิง:\n1. สำหรับอนุภาคเดี่ยวมวล $m$ มีความเร็ว $\\vec{v}$ และเวกเตอร์ตำแหน่ง $\\vec{r}$: $\\vec{L} = \\vec{r} \\times \\vec{p} = m(\\vec{r} \\times \\vec{v})$\n2. สำหรับวัตถุแข็งเกร็งหมุนรอบแกนสมมาตรตรึง: $\\vec{L} = I \\vec{\\omega}$\n\nกฎการอนุรักษ์โมเมนตัมเชิงมุม (Conservation of Angular Momentum) แถลงว่า: 'หากทอร์กภายนอกสุทธิที่กระทำต่อระบบรอบแกนหมุนหนึ่งๆ เป็นศูนย์ ($\\Sigma\\vec{\\tau}_{\\text{ext}} = 0$) แล้ว เวกเตอร์โมเมนตัมเชิงมุมรวมของระบบรอบแกนนั้นย่อมคงตัวตลอดกาล':\n$$\\frac{d\\vec{L}}{dt} = \\Sigma\\vec{\\tau}_{\\text{ext}} = 0 \\implies \\vec{L}_{\\text{initial}} = \\vec{L}_{\\text{final}} \\implies I_1 \\omega_1 = I_2 \\omega_2$$"
        },
        principle: {
          text: "ผลลัพธ์สำคัญจากกฎการอนุรักษ์โมเมนตัมเชิงมุม:\n1. การเปลี่ยนแปลงรูปร่างของวัตถุ: หากวัตถุดึงมวลเข้าใกล้แกนหมุน โมเมนต์ความเฉื่อย $I$ จะลดลง ส่งผลให้อัตราเร็วเชิงมุม $\\omega$ เพิ่มขึ้นโดยอัตโนมัติ เช่น นักสเก็ตลีลาหุบแขนเข้าหาลำตัว หรือดาวฤกษ์ที่ยุบตัวเป็นดาวนิวตรอน (Pulsar)\n2. กฎข้อที่สองของเคปเลอร์ (Kepler's Second Law): แรงโน้มถ่วงเป็นแรงสู่ศูนย์กลาง (Central Force) ซึ่งแนวแรงพุ่งผ่านจุดศูนย์กลางมวลดวงอาทิตย์เสมอ ทำให้ทอร์ก $\\vec{\\tau} = \\vec{r} \\times \\vec{F}_g = 0$ ดังนั้นโมเมนตัมเชิงมุมของดาวเคราะห์จึงอนุรักษ์ ส่งผลให้อัตราเร็วการกวาดพื้นที่คงที่:\n$$\\frac{dA}{dt} = \\frac{1}{2} r^2 \\frac{d\\theta}{dt} = \\frac{L}{2m} = \\text{คงที่}$$\n3. เสถียรภาพของไจโรสโคปและการควง (Gyroscopic Precession): เมื่อวัตถุที่หมุนรอบตัวเองด้วยโมเมนตัมเชิงมุมขนาดใหญ่ถูกทอร์กภายนอกกระทำ เวกเตอร์ $\\vec{L}$ จะเปลี่ยนทิศทางตามสมการ $\\Delta\\vec{L} = \\vec{\\tau}\\Delta t$ ทำให้แกนหมุนเคลื่อนที่ส่ายเป็นวงกลมด้วยอัตราเร็วเชิงมุมการควง $\\Omega_p = \\frac{\\tau}{L} = \\frac{M g d}{I \\omega}$"
        },
        formulas: [
          {
            name: "นิยามโมเมนตัมเชิงมุมและความสัมพันธ์กับทอร์กสุทธิ",
            latex: "\\vec{L} = \\vec{r} \\times \\vec{p} = I \\vec{\\omega}, \\quad \\Sigma\\vec{\\tau}_{\\text{ext}} = \\frac{d\\vec{L}}{dt}",
            symbols: [
              { sym: "\\vec{L}", desc: "เวกเตอร์โมเมนตัมเชิงมุม", unit: "\\text{kg}\\cdot\\text{m}^2/\\text{s} = \\text{J}\\cdot\\text{s}" },
              { sym: "\\vec{p}", desc: "เวกเตอร์โมเมนตัมเชิงเส้น (m v)", unit: "\\text{kg}\\cdot\\text{m/s}" },
              { sym: "I", desc: "โมเมนต์ความเฉื่อยรอบแกนหมุน", unit: "\\text{kg}\\cdot\\text{m}^2" },
              { sym: "\\vec{\\omega}", desc: "เวกเตอร์ความเร็วเชิงมุม", unit: "\\text{rad/s}" }
            ],
            derivationSteps: [
              "1. หาอนุพันธ์ของ L = r × p เทียบกับเวลา: dL/dt = (dr/dt × p) + (r × dp/dt)",
              "2. เนื่องจาก dr/dt = v และ p = m v ผลคูณ v × (m v) = 0 เพราะเวกเตอร์ขนานกัน",
              "3. จากกฎข้อ 2 ของนิวตัน dp/dt = F_ext",
              "4. แทนค่ากลับ: dL/dt = r × F_ext = τ_ext",
              "5. สำหรับวัตถุแข็งเกร็ง I คงที่: dL/dt = I (dω/dt) = I α = τ_ext"
            ]
          },
          {
            name: "กฎการอนุรักษ์โมเมนตัมเชิงมุม",
            latex: "I_1 \\omega_1 = I_2 \\omega_2 \\quad (\\text{เมื่อ } \\Sigma\\tau_{\\text{ext}} = 0)",
            symbols: [
              { sym: "I_1, I_2", desc: "โมเมนต์ความเฉื่อยสภาวะเริ่มต้นและสุดท้าย", unit: "\\text{kg}\\cdot\\text{m}^2" },
              { sym: "\\omega_1, \\omega_2", desc: "ความเร็วเชิงมุมเริ่มต้นและสุดท้าย", unit: "\\text{rad/s}" }
            ],
            derivationSteps: [
              "1. เมื่อทอร์กภายนอกสุทธิ Στ_ext = 0",
              "2. dL/dt = 0 => เวกเตอร์ L เป็นค่าคงตัว",
              "3. L_initial = L_final",
              "4. I_1 ω_1 = I_2 ω_2",
              "5. สังเกตพลังงานจลน์การหมุน K_rot = L^2 / (2 I): เมื่อ I ลดลง K_rot จะเพิ่มขึ้นเพราะนักกีฬาทำงานกลดึงแขนเข้ามา"
            ]
          }
        ],
        application: {
          text: "การควบคุมท่าทางการหมุนตัวของนักยิมนาสติกและนักกระโดดน้ำ, การหมุนรอบตัวเองของดาวนิวตรอน (Pulsars), ล้อควบคุมปฏิกิริยา (Reaction Wheels) บนกล้องโทรทรรศน์อวกาศฮับเบิลเพื่อปรับทิศทางโดยไม่ต้องใช้เชื้อเพลิงจรวด, ไจโรสโคปในระบบนำทางอากาศยาน",
          validWhen: "ทอร์กภายนอกสุทธิรอบแกนหมุนที่พิจารณามีค่าเป็นศูนย์ หรือช่วงเวลาชน/ระเบิดสั้นมากจนการดลของทอร์กภายนอกเข้าใกล้ศูนย์",
          invalidWhen: "มีแรงต้านภายนอกที่มีแขนของแรงกระทำต่อเนื่อง เช่น แรงเสียดทานลูกปืนที่แกนหมุน หรือลมพัดต้านการหมุน"
        },
        example: {
          problem: "นักสเก็ตน้ำแข็งยืนกางแขนหมุนรอบตัวเองบนลานน้ำแข็งลื่น ด้วยอัตราเร็วเชิงมุมเริ่มต้น $\\omega_1 = 2.0\\text{ rad/s}$ โดยมีโมเมนต์ความเฉื่อยขณะกางแขน $I_1 = 3.6\\text{ kg}\\cdot\\text{m}^2$ เมื่อเธอหุบแขนแนบลำตัว โมเมนต์ความเฉื่อยลดลงเหลือ $I_2 = 1.2\\text{ kg}\\cdot\\text{m}^2$ จงหา: (ก) ความเร็วเชิงมุมใหม่ $\\omega_2$ และ (ข) พลังงานจลน์การหมุนที่เปลี่ยนแปลงไป $\\Delta K_{\\text{rot}}$",
          steps: [
            "ขั้นตอนที่ 1: เนื่องจากพื้นน้ำแข็งลื่น ทอร์กภายนอกสุทธิในแนวดิ่ง $\\Sigma\\tau_z = 0$ ใช้กฎการอนุรักษ์โมเมนตัมเชิงมุม: $I_1 \\omega_1 = I_2 \\omega_2$",
            "ขั้นตอนที่ 2: คำนวณความเร็วเชิงมุมใหม่: $\\omega_2 = \\frac{I_1}{I_2}\\omega_1 = \\left(\\frac{3.6}{1.2}\\right)(2.0) = 3 \\times 2.0 = 6.0\\text{ rad/s}$",
            "ขั้นตอนที่ 3: คำนวณพลังงานจลน์เริ่มต้น: $K_1 = \\frac{1}{2} I_1 \\omega_1^2 = \\frac{1}{2}(3.6)(2.0)^2 = \\frac{1}{2}(3.6)(4) = 7.2\\text{ J}$",
            "ขั้นตอนที่ 4: คำนวณพลังงานจลน์สุดท้าย: $K_2 = \\frac{1}{2} I_2 \\omega_2^2 = \\frac{1}{2}(1.2)(6.0)^2 = \\frac{1}{2}(1.2)(36) = 21.6\\text{ J}$",
            "ขั้นตอนที่ 5: ผลต่างพลังงานจลน์: $\\Delta K = K_2 - K_1 = 21.6 - 7.2 = +14.4\\text{ J}$",
            "สรุป: ความเร็วเชิงมุมพุ่งสูงขึ้น 3 เท่าเป็น $6.0\\text{ rad/s}$ และพลังงานจลน์เพิ่มขึ้น $14.4\\text{ J}$ โดยพลังงานส่วนเกินนี้มาจากงานกลที่กล้ามเนื้อแขนของนักสเก็ตออกแรงดึงแขนเข้ามาต้านแรงหนีศูนย์กลาง"
          ],
          diagramSvg: `<svg viewBox="0 0 520 200" class="theory-diagram-svg w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="การอนุรักษ์โมเมนตัมเชิงมุมของนักสเก็ต">
            <rect width="520" height="200" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <!-- State 1: Arms Extended -->
            <g transform="translate(130, 20)">
              <text x="0" y="20" fill="#94A3B8" font-size="12" font-weight="bold" text-anchor="middle">สภาวะเริ่มต้น: กางแขน</text>
              <line x1="0" y1="35" x2="0" y2="160" stroke="#475569" stroke-width="1" stroke-dasharray="3,3"/>
              <!-- Body -->
              <circle cx="0" cy="55" r="10" fill="#F59E0B"/>
              <rect x="-8" y="65" width="16" height="50" rx="4" fill="#3B82F6"/>
              <!-- Extended Arms -->
              <line x1="-55" y1="80" x2="55" y2="80" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
              <circle cx="-55" cy="80" r="5" fill="#EF4444"/>
              <circle cx="55" cy="80" r="5" fill="#EF4444"/>
              <!-- Rotation Arrow -->
              <path d="M -30 140 A 30 15 0 1 0 30 140" fill="none" stroke="#38BDF8" stroke-width="2" marker-end="url(#arr-cyan)"/>
              <text x="0" y="170" fill="#38BDF8" font-size="10" text-anchor="middle">I₁ = 3.6 kg·m², ω₁ = 2.0 rad/s</text>
            </g>
            <!-- Arrow Transition -->
            <line x1="230" y1="100" x2="290" y2="100" stroke="#10B981" stroke-width="3" marker-end="url(#arr-green)"/>
            <text x="260" y="85" fill="#10B981" font-size="10" font-weight="bold" text-anchor="middle">หุบแขน</text>
            <!-- State 2: Arms In -->
            <g transform="translate(390, 20)">
              <text x="0" y="20" fill="#10B981" font-size="12" font-weight="bold" text-anchor="middle">สภาวะสุดท้าย: หุบแขน</text>
              <line x1="0" y1="35" x2="0" y2="160" stroke="#475569" stroke-width="1" stroke-dasharray="3,3"/>
              <!-- Body -->
              <circle cx="0" cy="55" r="10" fill="#F59E0B"/>
              <rect x="-8" y="65" width="16" height="50" rx="4" fill="#3B82F6"/>
              <!-- Tucked Arms -->
              <line x1="-15" y1="80" x2="15" y2="80" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
              <circle cx="-15" cy="80" r="4" fill="#EF4444"/>
              <circle cx="15" cy="80" r="4" fill="#EF4444"/>
              <!-- Fast Rotation Arrow -->
              <path d="M -20 140 A 20 10 0 1 0 20 140" fill="none" stroke="#F59E0B" stroke-width="3" marker-end="url(#arr-yellow)"/>
              <text x="0" y="170" fill="#F59E0B" font-size="10" text-anchor="middle">I₂ = 1.2 kg·m², ω₂ = 6.0 rad/s (3 เท่า!)</text>
            </g>
          </svg>`,
          diagramCaption: "การอนุรักษ์โมเมนตัมเชิงมุม: เมื่อหุบแขน ระยะ r ลดลง ทำให้ I ลดลงเหลือ 1/3 ส่งผลให้ความเร็วรอบการหมุน ω พุ่งสูงขึ้น 3 เท่าทันที"
        },
        observations: [
          "เวกเตอร์โมเมนตัมเชิงมุมต้องอนุรักษ์ทั้งขนาดและทิศทาง: หากระบบเดิมไม่มีการหมุน (L = 0) การที่ส่วนหนึ่งหมุนตามเข็มนาฬิกา อีกส่วนหนึ่งจะต้องหมุนทวนเข็มนาฬิกาเพื่อหักล้างกันเสมอ เช่น หางเสือของเฮลิคอปเตอร์ที่ต้องมีใบพัดท้ายเพื่อต้านทอร์กปฏิกิริยาของตัวลำ",
          "ดาวนิวตรอนและการหมุนยิ่งยวด: ดาวฤกษ์ที่มีรัศมีระดับล้านกิโลเมตรเมื่อยุบตัวเหลือรัศมีเพียง 10-20 กิโลเมตร จะหมุนรอบตัวเองเร็วขึ้นนับแสนเท่า จนหมุนได้หลายร้อยรอบต่อวินาที กลายเป็นสัญญาณพัลซาร์"
        ],
        citation: "Morin, D. (2008). Introduction to Classical Mechanics, Chapter 9: Angular Momentum Part II, Cambridge University Press.",
        citations: [
          {
            title: "Introduction to Classical Mechanics: With Problems and Solutions",
            authors: "David Morin",
            source: "Cambridge University Press, Chapter 9, pp. 340–375",
            year: "2008",
            url: "https://www.cambridge.org/highereducation/books/introduction-to-classical-mechanics/3004C94CBAAC2649B90967A99D417834",
            verificationStatus: "verified_direct_content",
            evidencePin: "Morin (2008) Chapter 9 pp. 340–375: Conservation of angular momentum, gyroscopic motion, and central force areal velocity.",
            note: "การอนุมานการอนุรักษ์โมเมนตัมเชิงมุมและไจโรสโคป"
          }
        ]
      },

      // ----------------------------------------------------------------------
      // Theory 9: Pulley Mechanics, Mechanical Advantage & Efficiency
      // ----------------------------------------------------------------------
      {
        id: "ch02-th09",
        chapterId: "ch02",
        divisionId: "div-ch02-pulleys",
        divisionTitle: "ภาคที่ 4: กลศาสตร์รอกและการได้เปรียบเชิงกล",
        numberTh: "ทฤษฎีที่ 9",
        type: "กลศาสตร์เครื่องกลและการประยุกต์ (Pulley Mechanics & Engineering)",
        titleTh: "กลศาสตร์ของรอก การได้เปรียบเชิงกล และประสิทธิภาพ",
        titleEn: "Pulley Mechanics, Mechanical Advantage & Efficiency",
        summary: "การวิเคราะห์แรงตึงเชือก รอกเดี่ยวตายตัว รอกเดี่ยวเคลื่อนที่ รอกพวง การได้เปรียบเชิงกลจริงและอุดมคติ ประสิทธิภาพเชิงกล และเครื่องกลแอทวูดพร้อมโมเมนต์ความเฉื่อย",
        definition: {
          text: "รอก (Pulley) คือ เครื่องกลผ่อนแรงอย่างง่ายที่ประกอบด้วยล้อที่มีร่องรอบขอบสำหรับพาดเชือกหรือสลิง ใช้สำหรับเปลี่ยนทิศทางของแรงหรือผ่อนแรงในการยกของหนัก:\n1. รอกเดี่ยวตายตัว (Fixed Pulley): แกนรอกถูกตรึงแน่น ไม่ผ่อนแรง ($\\text{MA} = 1$) แต่ช่วยเปลี่ยนทิศทางของแรงให้ออกแรงดึงลงสะดวกตามแรงโน้มถ่วง\n2. รอกเดี่ยวเคลื่อนที่ (Movable Pulley): แกนรอกเคลื่อนที่ไปพร้อมกับวัตถุ ช่วยผ่อนแรงลงครึ่งหนึ่ง ($\\text{MA} = 2$) โดยต้องดึงเชือกเป็นระยะทางเป็น 2 เท่าของระยะที่วัตถุลอยขึ้น\n3. รอกพวง (Block and Tackle / Compound Pulley): การผสมผสานระหว่างรอกตายตัวและรอกเคลื่อนที่หลายตัว การได้เปรียบเชิงกลอุดมคติจะเท่ากับจำนวนเส้นเชือกที่ช่วยพยุงวัตถุ ($n$)\n\nพารามิเตอร์เชิงวิศวกรรมหลัก:\n• การได้เปรียบเชิงกลจริง (Actual Mechanical Advantage, $\\text{AMA}$): อัตราส่วนระหว่างแรงต้าน (น้ำหนักวัตถุ $F_{\\text{load}}$) ต่อแรงพยายามที่ออกจริง ($F_{\\text{effort}}$): $\\text{AMA} = \\frac{F_{\\text{load}}}{F_{\\text{effort}}}$\n• อัตราส่วนความเร็วหรือการได้เปรียบเชิงกลอุดมคติ (Ideal Mechanical Advantage, $\\text{IMA} = \\text{VR}$): อัตราส่วนระยะทาง: $\\text{VR} = \\frac{d_{\\text{effort}}}{d_{\\text{load}}} = n$\n• ประสิทธิภาพเชิงกล (Mechanical Efficiency, $\\eta$): $\\eta = \\frac{\\text{AMA}}{\\text{VR}} \\times 100\\% = \\frac{W_{\\text{out}}}{W_{\\text{in}}} \\times 100\\%$"
        },
        principle: {
          text: "การวิเคราะห์แรงตึงเชือกและกฎการอนุรักษ์งาน:\nในระบบรอกอุดมคติ (เชือกเบา รอกไม่มีมวลและปราศจากแรงเสียดทาน): งานที่ให้กับระบบย่อมเท่ากับงานที่ระบบกระทำต่อวัตถุ (ไม่มีการสูญเสียพลังงาน):\n$$W_{\\text{in}} = F_{\\text{effort}} \\cdot d_{\\text{effort}} = W_{\\text{out}} = F_{\\text{load}} \\cdot d_{\\text{load}}$$\nทำให้ได้ความสัมพันธ์แบบผกผันระหว่างแรงกับระยะทาง: 'หากผ่อนแรงลง $n$ เท่า จะต้องดึงเชือกเป็นระยะทางเพิ่มขึ้น $n$ เท่าเสมอ' (ไม่มีเครื่องกลใดสร้างพลังงานขึ้นมาเองได้)\n\nพลศาสตร์ของเครื่องกลแอทวูด (Atwood Machine with Massive Pulley):\nเมื่อคำนึงถึงมวลและโมเมนต์ความเฉื่อยของรอก $I = \\frac{1}{2} M_p R^2$ แรงตึงเชือกสองข้างจะไม่เท่ากัน ($T_1 \\neq T_2$) ทอร์กสุทธิจากผลต่างแรงตึงเชือกจะเร่งการหมุนของรอก:\n$$(T_1 - T_2) R = I \\alpha = I \\left(\\frac{a}{R}\\right) \\implies T_1 - T_2 = \\frac{I}{R^2} a$$\nเมื่อรวมเข้ากับกฎข้อ 2 ของนิวตันสำหรับมวลทั้งสอง จะได้ความเร่งเชิงเส้นของระบบแอทวูด:\n$$a = \\frac{(m_1 - m_2)g}{m_1 + m_2 + \\frac{I}{R^2}}$$"
        },
        formulas: [
          {
            name: "การได้เปรียบเชิงกล อัตราส่วนความเร็ว และประสิทธิภาพเชิงกล",
            latex: "\\text{AMA} = \\frac{F_{\\text{load}}}{F_{\\text{effort}}}, \\quad \\text{VR} = \\frac{d_{\\text{effort}}}{d_{\\text{load}}} = n, \\quad \\eta = \\frac{\\text{AMA}}{\\text{VR}} \\times 100\\%",
            symbols: [
              { sym: "\\text{AMA}", desc: "การได้เปรียบเชิงกลจริง (วัดจากการทดลอง)", unit: "—" },
              { sym: "\\text{VR} \\; (\\text{IMA})", desc: "อัตราส่วนความเร็วหรือการได้เปรียบเชิงกลอุดมคติ", unit: "—" },
              { sym: "n", desc: "จำนวนเส้นเชือกที่ช่วยรองรับน้ำหนักวัตถุโดยตรง", unit: "—" },
              { sym: "\\eta", desc: "ประสิทธิภาพเชิงกลของระบบเครื่องกล", unit: "\\%" }
            ],
            derivationSteps: [
              "1. งานที่ให้กับระบบ: W_in = F_effort · d_effort",
              "2. งานที่มีประโยชน์ที่ได้: W_out = F_load · d_load",
              "3. นิยามประสิทธิภาพ: η = W_out / W_in = (F_load · d_load) / (F_effort · d_effort)",
              "4. จัดรูป: η = (F_load / F_effort) / (d_effort / d_load) = AMA / VR",
              "5. ในระบบอุดมคติปราศจากแรงเสียดทาน: η = 100% => AMA = VR = n"
            ]
          },
          {
            name: "สมการความเร่งเครื่องกลแอทวูดพร้อมโมเมนต์ความเฉื่อยของรอก",
            latex: "a = \\frac{(m_1 - m_2)g}{m_1 + m_2 + \\frac{I}{R^2}}",
            symbols: [
              { sym: "a", desc: "ความเร่งเชิงเส้นของมวลและเชือก", unit: "\\text{m/s}^2" },
              { sym: "m_1, m_2", desc: "มวลของวัตถุทั้งสองข้าง (กำหนด m_1 > m_2)", unit: "\\text{kg}" },
              { sym: "I", desc: "โมเมนต์ความเฉื่อยของรอกรอบแกนหมุน", unit: "\\text{kg}\\cdot\\text{m}^2" },
              { sym: "R", desc: "รัศมีของร่องรอก", unit: "\\text{m}" }
            ],
            derivationSteps: [
              "1. สมการการเคลื่อนที่ของมวล m_1 (เคลื่อนที่ลง): m_1 g - T_1 = m_1 a",
              "2. สมการการเคลื่อนที่ของมวล m_2 (เคลื่อนที่ขึ้น): T_2 - m_2 g = m_2 a",
              "3. สมการการหมุนของรอก: (T_1 - T_2) R = I α = I (a / R) => T_1 - T_2 = (I / R^2) a",
              "4. บวกสมการข้อ 1 และข้อ 2: (m_1 - m_2)g - (T_1 - T_2) = (m_1 + m_2) a",
              "5. แทนค่า (T_1 - T_2): (m_1 - m_2)g - (I / R^2) a = (m_1 + m_2) a",
              "6. ย้ายข้างจัดรูป: a = [(m_1 - m_2)g] / [m_1 + m_2 + I / R^2]"
            ]
          }
        ],
        application: {
          text: "เครนก่อสร้างขนาดใหญ่ (Tower Crane) ที่ใช้รอกพวงยกคานคอนกรีตนับสิบตัน, ลิฟต์โดยสารในอาคารสูงพร้อมชุดน้ำหนักถ่วง (Counterweight), รอกทดแรงในระบบชักใบเรือใบแข่ง (Sailing Rigging), รอกกู้ภัยในงานดับเพลิงและที่สูง",
          validWhen: "เชือกไม่ยืดหยุ่น (Inextensible string) และเชือกไม่ลื่นไถลไปบนร่องรอก ($a = \\alpha R$)",
          invalidWhen: "เชือกหย่อนหรือเกิดการสะบัดกระตุกอย่างรุนแรง (Snatch Loading) ซึ่งทำให้แรงดลชั่วขณะสูงเกินขีดจำกัดปลอดภัยหลายเท่า"
        },
        example: {
          problem: "ระบบรอกพวง (Block and Tackle) มีเส้นเชือกรองรับน้ำหนัก $n = 4$ เส้น ใช้ยกวัตถุมวล $M = 200\\text{ kg}$ ขึ้นสูง $h = 3.0\\text{ m}$ หากระบบมีประสิทธิภาพเชิงกล $\\eta = 80\\%$ จงหา: (ก) แรงพยายาม $F_{\\text{effort}}$ ที่ต้องใช้ออกแรงดึงเชือกจริง (ข) ความยาวเชือกที่ต้องสาวออกไป $d_{\\text{effort}}$ และ (ค) งานที่สูญเสียไปกับแรงเสียดทาน $W_{\\text{loss}}$",
          steps: [
            "ขั้นตอนที่ 1: คำนวณน้ำหนักวัตถุ: $F_{\\text{load}} = M g = (200\\text{ kg})(9.81\\text{ m/s}^2) = 1,962\\text{ N}$",
            "ขั้นตอนที่ 2: ระบุอัตราส่วนความเร็วของรอก 4 เส้น: $\\text{VR} = n = 4$",
            "ขั้นตอนที่ 3: คำนวณระยะทางที่ต้องดึงเชือก: $d_{\\text{effort}} = \\text{VR} \\times h = 4 \\times 3.0\\text{ m} = 12.0\\text{ m}$",
            "ขั้นตอนที่ 4: หาการได้เปรียบเชิงกลจริงจากประสิทธิภาพ:\n$\\text{AMA} = \\eta \\times \\text{VR} = (0.80)(4) = 3.20$",
            "ขั้นตอนที่ 5: คำนวณแรงพยายามที่ต้องออกจริง:\n$F_{\\text{effort}} = \\frac{F_{\\text{load}}}{\\text{AMA}} = \\frac{1,962\\text{ N}}{3.20} \\approx 613.1\\text{ N}$ (หากเป็นรอกอุดมคติจะใช้เพียง $1,962 / 4 = 490.5\\text{ N}$)",
            "ขั้นตอนที่ 6: คำนวณงานที่ให้แก่งานที่ได้:\n$W_{\\text{in}} = F_{\\text{effort}} \\cdot d_{\\text{effort}} = (613.1)(12.0) \\approx 7,357.2\\text{ J}$\n$W_{\\text{out}} = F_{\\text{load}} \\cdot h = (1,962)(3.0) = 5,886.0\\text{ J}$",
            "ขั้นตอนที่ 7: คำนวณงานที่สูญเสีย: $W_{\\text{loss}} = W_{\\text{in}} - W_{\\text{out}} = 7,357.2 - 5,886.0 = 1,471.2\\text{ J}$",
            "สรุป: ต้องออกแรงดึงจริง $613.1\\text{ N}$ สาวเชือกยาว $12.0\\text{ m}$ และมีพลังงานสูญเสียไปกับความเสียดทาน $1,471.2\\text{ J}$"
          ],
          diagramSvg: `<svg viewBox="0 0 520 200" class="theory-diagram-svg w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนภาพรอกเดี่ยวตายตัว รอกเคลื่อนที่ และรอกพวง">
            <rect width="520" height="200" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <!-- 1. Fixed Pulley (MA = 1) -->
            <g transform="translate(60, 20)">
              <text x="35" y="16" fill="#94A3B8" font-size="10" font-weight="bold" text-anchor="middle">1. รอกเดี่ยวตายตัว (MA=1)</text>
              <line x1="0" y1="25" x2="70" y2="25" stroke="#64748B" stroke-width="4"/>
              <line x1="35" y1="25" x2="35" y2="45" stroke="#94A3B8" stroke-width="2"/>
              <circle cx="35" cy="55" r="14" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
              <!-- Rope -->
              <line x1="21" y1="55" x2="21" y2="120" stroke="#F59E0B" stroke-width="2"/>
              <line x1="49" y1="55" x2="49" y2="100" stroke="#F59E0B" stroke-width="2"/>
              <line x1="49" y1="100" x2="49" y2="135" stroke="#EF4444" stroke-width="2" marker-end="url(#arr-red)"/>
              <text x="65" y="130" fill="#EF4444" font-size="9">F = W</text>
              <!-- Load -->
              <rect x="11" y="120" width="20" height="20" rx="2" fill="#0284C7"/>
              <text x="21" y="134" fill="#FFFFFF" font-size="8" text-anchor="middle">W</text>
            </g>
            <!-- 2. Movable Pulley (MA = 2) -->
            <g transform="translate(200, 20)">
              <text x="45" y="16" fill="#38BDF8" font-size="10" font-weight="bold" text-anchor="middle">2. รอกเดี่ยวเคลื่อนที่ (MA=2)</text>
              <line x1="10" y1="25" x2="80" y2="25" stroke="#64748B" stroke-width="4"/>
              <!-- Fixed end -->
              <circle cx="25" cy="25" r="3" fill="#94A3B8"/>
              <!-- Rope -->
              <line x1="25" y1="25" x2="25" y2="90" stroke="#F59E0B" stroke-width="2"/>
              <!-- Movable Pulley -->
              <circle cx="39" cy="90" r="14" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
              <line x1="53" y1="90" x2="53" y2="40" stroke="#10B981" stroke-width="2" marker-end="url(#arr-green)"/>
              <text x="70" y="45" fill="#10B981" font-size="9">F = W/2</text>
              <!-- Load -->
              <line x1="39" y1="104" x2="39" y2="120" stroke="#94A3B8" stroke-width="2"/>
              <rect x="29" y="120" width="20" height="20" rx="2" fill="#0284C7"/>
              <text x="39" y="134" fill="#FFFFFF" font-size="8" text-anchor="middle">W</text>
            </g>
            <!-- 3. Block and Tackle (MA = 4) -->
            <g transform="translate(360, 20)">
              <text x="50" y="16" fill="#F59E0B" font-size="10" font-weight="bold" text-anchor="middle">3. รอกพวง (Block & Tackle, n=4)</text>
              <line x1="10" y1="25" x2="90" y2="25" stroke="#64748B" stroke-width="4"/>
              <!-- Upper fixed pulleys -->
              <circle cx="40" cy="45" r="12" fill="#334155" stroke="#F59E0B" stroke-width="2"/>
              <circle cx="60" cy="45" r="12" fill="#334155" stroke="#F59E0B" stroke-width="2"/>
              <!-- Lower movable pulleys -->
              <circle cx="40" cy="110" r="12" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
              <circle cx="60" cy="110" r="12" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
              <!-- 4 Strands -->
              <line x1="30" y1="45" x2="30" y2="110" stroke="#F59E0B" stroke-width="1.5"/>
              <line x1="48" y1="45" x2="48" y2="110" stroke="#F59E0B" stroke-width="1.5"/>
              <line x1="52" y1="45" x2="52" y2="110" stroke="#F59E0B" stroke-width="1.5"/>
              <line x1="70" y1="45" x2="70" y2="110" stroke="#F59E0B" stroke-width="1.5"/>
              <text x="50" y="80" fill="#FDE047" font-size="10" font-weight="bold" text-anchor="middle">4 เส้นพยุง</text>
              <!-- Effort Pull -->
              <line x1="72" y1="45" x2="88" y2="140" stroke="#10B981" stroke-width="2" marker-end="url(#arr-green)"/>
              <text x="96" y="145" fill="#10B981" font-size="9" font-weight="bold">F = W/4</text>
              <!-- Load -->
              <rect x="35" y="135" width="30" height="20" rx="2" fill="#EA580C"/>
              <text x="50" y="149" fill="#FFFFFF" font-size="9" text-anchor="middle">Load W</text>
            </g>
          </svg>`,
          diagramCaption: "เปรียบเทียบระบบรอก 3 ชนิด: รอกเดี่ยวตายตัวเปลี่ยนทิศทาง (MA=1), รอกเดี่ยวเคลื่อนที่ผ่อนแรง 2 เท่า (MA=2), และรอกพวง 4 เส้นเชือกผ่อนแรง 4 เท่า (MA=4)"
        },
        observations: [
          "ทฤษฎีทองคำของกลศาสตร์ (The Golden Rule of Mechanics): ไม่ว่าเครื่องกลจะซับซ้อนเพียงใด สิ่งที่ได้เปรียบในเรื่องแรง ย่อมต้องเสียเปรียบในเรื่องระยะทางเสมอ ($F \\propto 1/d$) งานที่ได้ไม่สามารถเกินงานที่ป้อนเข้า",
          "ทำไมประสิทธิภาพจริงจึงไม่ถึง 100%: ในการใช้งานจริง มีแรงเสียดทานระหว่างแกนเพลากับลูกปืนรอก (Bearing friction), แรงต้านการงอตัวของลวดสลิง (Bending stiffness of wire rope) และน้ำหนักตัวเรือนรอกเคลื่อนที่เอง ทำให้ประสิทธิภาพรอกก่อสร้างทั่วไปอยู่ที่ประมาณ 75% – 90%"
        ],
        citation: "Serway, R. A., & Jewett, J. W. (2018). Physics for Scientists and Engineers (10th Ed.), Chapter 12: Static Equilibrium and Elasticity. Cengage Learning.",
        citations: [
          {
            title: "Physics for Scientists and Engineers with Modern Physics",
            authors: "Serway, R. A., & Jewett, J. W.",
            source: "Cengage Learning, 10th Edition, Chapter 5 & 12: Newton's Laws and Static Machines",
            year: "2018",
            url: "https://www.cengage.com/c/physics-for-scientists-and-engineers-10e-serway/",
            verificationStatus: "verified_direct_content",
            evidencePin: "Serway & Jewett (2018) Chapter 5 & 12: Machine efficiency, mechanical advantage, velocity ratio, and Atwood machine dynamics.",
            note: "การวิเคราะห์เครื่องกลผ่อนแรงและรอก"
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
