/**
 * chapter05_thermo_content.js - Standardized 6-Point Pedagogical Curriculum for Chapter 05
 * Thermodynamics, Kinetic Theory of Gases & Thermodynamic Cycles
 * Part of PhysicsNoza 3.0 Standardized Curriculum
 *
 * Academic Standards:
 * - David Tong (2012), Lectures on Statistical Physics, Cambridge University DAMTP.
 * - David Tong (2012), Lectures on Kinetic Theory, Cambridge University DAMTP.
 * - Halliday, Resnick, & Walker (2018), Fundamentals of Physics (11th Ed), Chapters 18, 19, 20.
 * - Moran, M. J., Shapiro, H. N., Boettner, D. D., & Bailey, M. B. (2018), Fundamentals of Engineering Thermodynamics (9th Ed), Wiley.
 * - Heywood, J. B. (1988), Internal Combustion Engine Fundamentals, McGraw-Hill.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Chapter05Content = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    meta: {
      chapterId: "ch05",
      number: 5,
      titleTh: "บทที่ 05: อุณหพลศาสตร์และทฤษฎีจลน์ของแก๊ส",
      titleEn: "Chapter 05: Thermodynamics, Kinetic Theory of Gases & Thermodynamic Cycles",
      description: "อุณหภูมิ สมดุลความร้อนและกฎข้อศูนย์ ทฤษฎีจลน์ระดับโมเลกุล การแจกแจงอัตราเร็วแมกซ์เวลล์-โบลต์ซมันน์ กฎข้อที่หนึ่งของอุณหพลศาสตร์ งานจากการขยายตัว สี่กระบวนการทางอุณหพลศาสตร์หลัก เครื่องยนต์ความร้อน วัฏจักรคาร์โนต์ ประสิทธิภาพสูงสุด กฎข้อที่สอง และนิยามเอนโทรปีเชิงสถิติและคลาสสิก"
    },

    divisions: [
      {
        id: "div-ch05-fundamentals",
        numeral: "ภาคที่ 1",
        titleTh: "อุณหภูมิ ทฤษฎีจลน์ระดับโมเลกุล และกฎข้อที่หนึ่ง (Fundamentals of Thermodynamics, Kinetic Theory & First Law)",
        titleEn: "Temperature, Molecular Kinetic Theory & First Law of Thermodynamics",
        description: "นิยามอุณหภูมิ กฎข้อศูนย์ การถ่ายเทความร้อน กฎแก๊สอุดมคติ การอนุมานความดันระดับจุลภาค หลักการแบ่งเท่าของพลังงาน (Equipartition) กฎข้อที่หนึ่งของอุณหพลศาสตร์ และงานกลของการขยายตัวของแก๊ส"
      },
      {
        id: "div-ch05-cycles-entropy",
        numeral: "ภาคที่ 2",
        titleTh: "กระบวนการเทอร์โมไดนามิกส์ เครื่องยนต์ความร้อน และกฎข้อที่สอง (Thermodynamic Processes, Heat Engines & Second Law)",
        titleEn: "Thermodynamic Processes, Heat Engines & Second Law of Thermodynamics",
        description: "สี่กระบวนการพื้นฐาน (ไอโซโครอยด์ ไอโซบาริก ไอโซเทอร์มอล และแอเดียแบติก) เครื่องยนต์ความร้อน วัฏจักรคาร์โนต์ ประสิทธิภาพเชิงความร้อน ตู้เย็นและปั๊มความร้อน กฎข้อที่สอง และนิยามเอนโทรปี"
      }
    ],

    masterSymbols: [
      {
        symbol: "P",
        nameTh: "ความดันของระบบ (สัมบูรณ์)",
        nameEn: "Absolute Pressure",
        unitSI: "\\text{Pa} \\; (\\text{N/m}^2)",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "แรงเฉลี่ยตั้งฉากต่อหนึ่งหน่วยพื้นที่อันเกิดจากการชนของโมเลกุลแก๊ส (1 atm = 101,325 Pa)"
      },
      {
        symbol: "V",
        nameTh: "ปริมาตรของระบบ",
        nameEn: "System Volume",
        unitSI: "\\text{m}^3",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "ปริมาตรเรขาคณิตที่บรรจุแก๊สอยู่ (1 m³ = 1,000 L)"
      },
      {
        symbol: "T",
        nameTh: "อุณหภูมิสัมบูรณ์",
        nameEn: "Absolute Thermodynamic Temperature",
        unitSI: "\\text{K}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "การวัดพลังงานจลน์เฉลี่ยของการเคลื่อนที่เชิงสุ่มระดับโมเลกุล (T(K) = T(°C) + 273.15)"
      },
      {
        symbol: "n",
        nameTh: "จำนวนโมลของสาร",
        nameEn: "Amount of Substance",
        unitSI: "\\text{mol}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "จำนวนอนุภาคเทียบเท่าค่าคงตัวอะโวกาโดร (N_A = 6.022 \\times 10^{23} \\text{ mol}^{-1})"
      },
      {
        symbol: "U",
        nameTh: "พลังงานภายในระบบ",
        nameEn: "Internal Energy",
        unitSI: "\\text{J}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "ผลรวมพลังงานจลน์ระดับจุลภาคและพลังงานศักย์อันตรกิริยาระหว่างโมเลกุล เป็นฟังก์ชันสภาวะ (State Function)"
      },
      {
        symbol: "Q",
        nameTh: "ปริมาณความร้อนที่ถ่ายเทข้ามขอบเขตระบบ",
        nameEn: "Heat Transferred",
        unitSI: "\\text{J}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "พลังงานที่ถ่ายเทอันเนื่องมาจากความแตกต่างของอุณหภูมิ (Q > 0 เมื่อความร้อนไหลเข้าสู่ระบบ)"
      },
      {
        symbol: "W",
        nameTh: "งานที่ระบบกระทำต่อสิ่งแวดล้อม",
        nameEn: "Thermodynamic Work (by system)",
        unitSI: "\\text{J}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "งานกลจากการเปลี่ยนปริมาตร W = \\int P dV (W > 0 เมื่อระบบขยายตัวดันลูกสูบ)"
      },
      {
        symbol: "C_V",
        nameTh: "ความจุความร้อนโมลาร์ที่ปริมาตรคงตัว",
        nameEn: "Molar Heat Capacity at Constant Volume",
        unitSI: "\\text{J/(mol}\\cdot\\text{K)}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "สำหรับแก๊สอุดมคติอะตอมเดี่ยว C_V = \\frac{3}{2}R, แก๊สอะตอมคู่ C_V = \\frac{5}{2}R"
      },
      {
        symbol: "C_P",
        nameTh: "ความจุความร้อนโมลาร์ที่ความดันคงตัว",
        nameEn: "Molar Heat Capacity at Constant Pressure",
        unitSI: "\\text{J/(mol}\\cdot\\text{K)}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "ความสัมพันธ์ของไมเยอร์: C_P - C_V = R (สำหรับแก๊สอุดมคติทุกชนิด)"
      },
      {
        symbol: "\\gamma",
        nameTh: "อัตราส่วนความจุความร้อน (ดัชนีแอเดียแบติก)",
        nameEn: "Heat Capacity Ratio (Adiabatic Index)",
        unitSI: "\\text{dimensionless}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "\\gamma = C_P / C_V (แก๊สอะตอมเดี่ยว \\approx 1.67, แก๊สอะตอมคู่ \\approx 1.40)"
      },
      {
        symbol: "v_{\\text{rms}}",
        nameTh: "อัตราเร็วรากกำลังสองเฉลี่ยของโมเลกุล",
        nameEn: "Root-Mean-Square Speed",
        unitSI: "\\text{m/s}",
        domain: "kinetic-theory",
        domainTh: "ทฤษฎีจลน์ของแก๊ส",
        note: "v_{\\text{rms}} = \\sqrt{\\langle v^2 \\rangle} = \\sqrt{3 k_B T / m} = \\sqrt{3 R T / M}"
      },
      {
        symbol: "\\eta",
        nameTh: "ประสิทธิภาพเชิงความร้อนของเครื่องยนต์ความร้อน",
        nameEn: "Thermal Efficiency",
        unitSI: "\\text{dimensionless}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "\\eta = W_{\\text{net}} / Q_H = 1 - Q_C / Q_H (ประสิทธิภาพคาร์โนต์ \\eta_{\\text{Carnot}} = 1 - T_C / T_H)"
      },
      {
        symbol: "S",
        nameTh: "เอนโทรปีของระบบ",
        nameEn: "Thermodynamic Entropy",
        unitSI: "\\text{J/K}",
        domain: "thermodynamics",
        domainTh: "อุณหพลศาสตร์",
        note: "ฟังก์ชันสภาวะที่วัดความไม่สามารถนำพลังงานมาทำงานได้ นิยามคลาสสิก dS = dQ_{\\text{rev}}/T, นิยามสถิติ S = k_B \\ln \\Omega"
      },
      {
        symbol: "k",
        nameTh: "สภาพนำความร้อนของวัสดุ",
        nameEn: "Thermal Conductivity",
        unitSI: "\\text{W/(m}\\cdot\\text{K)}",
        domain: "heat-transfer",
        domainTh: "การถ่ายเทความร้อน",
        note: "ค่าคงตัวของฟูริเยร์ที่กำหนดฟลักซ์ความร้อน q = -k \\nabla T"
      }
    ],

    theories: [
      {
        id: "ch05-th01",
        divisionId: "div-ch05-fundamentals",
        divisionTitle: "ภาคที่ 1: อุณหภูมิ ทฤษฎีจลน์ระดับโมเลกุล และกฎข้อที่หนึ่ง",
        numberTh: "ทฤษฎีที่ 1",
        type: "fundament",
        titleTh: "อุณหภูมิ สมดุลความร้อน และกลไกการถ่ายเทความร้อน",
        titleEn: "Temperature, Zeroth Law & Heat Transfer Mechanisms",
        summary: "นิยามอุณหภูมิผ่านกฎข้อศูนย์แห่งอุณหพลศาสตร์ การขยายตัวเชิงความร้อนของสสาร และกลไกหลักสามประการในการถ่ายเทความร้อน ได้แก่ การนำความร้อนตามกฎของฟูริเยร์ การพาความร้อน และการแผ่รังสีความร้อนตามกฎสเตฟาน-โบลต์ซมันน์",
        definition: {
          text: "อุณหภูมิ (Temperature, T) คือสมบัติทางกายภาพระดับมหภาคที่เป็นตัวกำหนดทิศทางการไหลของพลังงานความร้อนระหว่างระบบสองระบบที่สัมผัสทางความร้อนกัน โดยระบบจะอยู่ใน 'สมดุลความร้อน' (Thermal Equilibrium) เมื่อไม่มีการถ่ายเทความร้อนสุทธิระหว่างกัน กฎข้อศูนย์แห่งอุณหพลศาสตร์ (Zeroth Law of Thermodynamics) ระบุว่า หากระบบ A อยู่ในสมดุลความร้อนกับระบบ B และระบบ B อยู่ในสมดุลความร้อนกับระบบ C แล้ว ระบบ A ย่อมอยู่ในสมดุลความร้อนกับระบบ C ด้วย ซึ่งเป็นรากฐานทางตรรกะของการสร้าง 'เทอร์โมมิเตอร์' ในการวัดระดับอุณหภูมิมาตรฐาน"
        },
        principle: {
          text: "การถ่ายเทความร้อนเกิดขึ้นผ่าน 3 กลไกพื้นฐาน:\n1. การนำความร้อน (Conduction): การถ่ายทอดพลังงานจลน์ผ่านการสั่นของแลตทิซและอิเล็กตรอนอิสระในของแข็ง โดยไม่มีการเคลื่อนที่ตามระดับมหภาคของเนื้อสสาร สอดคล้องกับกฎของฟูริเยร์ (Fourier's Law): q = -k dT/dx\n2. การพาความร้อน (Convection): การถ่ายเทความร้อนโดยการเคลื่อนที่จริงของกลุ่มมวลของไหล (Fluid parcels) อันเนื่องมาจากความต่างของความหนาแน่น (Natural convection) หรือแรงขับภายนอก เช่น พัดลมหรือปั๊ม (Forced convection)\n3. การแผ่รังสีความร้อน (Thermal Radiation): การปลดปล่อยคลื่นแม่เหล็กไฟฟ้าจากวัตถุที่มีอุณหภูมิสูงกว่าศูนย์สัมบูรณ์ โดยไม่ต้องอาศัยตัวกลาง สอดคล้องกับกฎของสเตฟาน-โบลต์ซมันน์ (Stefan-Boltzmann Law): P_rad = e \\sigma A (T^4 - T_0^4)"
        },
        formulas: [
          {
            name: "กฎการนำความร้อนของฟูริเยร์ (Fourier's Law of Thermal Conduction)",
            latex: "\\frac{dQ}{dt} = -k A \\frac{dT}{dx}",
            symbols: [
              { sym: "dQ/dt", desc: "อัตราการถ่ายเทความร้อนผ่านระนาบ", unit: "\\text{W} \\; (\\text{J/s})" },
              { sym: "k", desc: "สภาพนำความร้อนของเนื้อวัสดุ", unit: "\\text{W/(m}\\cdot\\text{K)}" },
              { sym: "A", desc: "พื้นที่หน้าตัดตั้งฉากกับทิศทางการไหล", unit: "\\text{m}^2" },
              { sym: "dT/dx", desc: "เกรเดียนต์อุณหภูมิ (Temperature Gradient)", unit: "\\text{K/m}" }
            ],
            derivationSteps: [
              "พิจารณาแท่งวัสดุเนื้อเดียวความยาว L พื้นที่หน้าตัด A ที่ปลายทั้งสองข้างรักษาอุณหภูมิคงที่ T_H และ T_C (โดย T_H > T_C)",
              "จากการทดลองเชิงประจักษ์ อัตราการไหลของความร้อนแปรผันตรงกับพื้นที่หน้าตัด A และผลต่างอุณหภูมิ \\Delta T = T_H - T_C และแปรผกผันกับความยาว L: \\dot{Q} \\propto A \\frac{\\Delta T}{L}",
              "กำหนดค่าคงตัวการแปรผันเป็นสภาพนำความร้อน k และใส่เครื่องหมายลบเนื่องจากความร้อนไหลจากอุณหภูมิสูงไปสู่อุณหภูมิต่ำ (เกรเดียนต์เป็นลบ)",
              "ในลิมิตความหนาบางมาก dx จะได้รูปอนุพันธ์ทั่วไป: \\dot{Q} = -k A \\frac{dT}{dx}",
              "ในสภาวะคงตัว 1 มิติ (Steady State): \\dot{Q} = k A \\frac{T_H - T_C}{L} = \\frac{\\Delta T}{R_{\\text{th}}} โดยที่ R_{\\text{th}} = L/(kA) คือความต้านทานความร้อน (Thermal Resistance)"
            ]
          },
          {
            name: "กฎการแผ่รังสีความร้อนของสเตฟาน-โบลต์ซมันน์ (Stefan-Boltzmann Law)",
            latex: "P_{\\text{net}} = e \\sigma A (T^4 - T_0^4)",
            symbols: [
              { sym: "P_{\\text{net}}", desc: "กำลังสุทธิของการแผ่รังสีความร้อน", unit: "\\text{W}" },
              { sym: "e", desc: "สภาพเปล่งรังสีของผิววัตถุ (Emissivity, 0 \\le e \\le 1)", unit: "\\text{dimensionless}" },
              { sym: "\\sigma", desc: "ค่าคงตัวสเตฟาน-โบลต์ซมันน์ (5.670 \\times 10^{-8})", unit: "\\text{W/(m}^2\\cdot\\text{K}^4)" },
              { sym: "A", desc: "พื้นที่ผิวของวัตถุที่แผ่รังสี", unit: "\\text{m}^2" },
              { sym: "T", desc: "อุณหภูมิสัมบูรณ์ของวัตถุ", unit: "\\text{K}" },
              { sym: "T_0", desc: "อุณหภูมิสัมบูรณ์ของสิ่งแวดล้อมรอบข้าง", unit: "\\text{K}" }
            ],
            derivationSteps: [
              "พิจารณาวัตถุดำสมบูรณ์ (Blackbody, e = 1) ในสมดุลความร้อนกับโพรงโฟตอน",
              "จากทฤษฎีควอนตัมของพลังค์ อินทิเกรตความหนาแน่นพลังงานคลื่นแม่เหล็กไฟฟ้า u(\\omega) ตลอดทุกช่วงความถี่ \\omega จาก 0 ถึง \\infty",
              "ผลลัพธ์การอินทิเกรตนำไปสู่ฟลักซ์พลังงานต่อหน่วยพื้นที่: j^* = \\frac{c}{4} u = \\sigma T^4 โดยที่ \\sigma = \\frac{2\\pi^5 k_B^4}{15 c^2 h^3} \\approx 5.6704 \\times 10^{-8} \\text{ W/(m}^2\\text{K}^4)",
              "สำหรับวัตถุจริงที่มีสภาพเปล่ง e กำลังที่แผ่ออกคือ P_{\\text{emit}} = e \\sigma A T^4 และกำลังที่ดูดกลืนจากสิ่งแวดล้อมคือ P_{\\text{absorb}} = e \\sigma A T_0^4",
              "กำลังสุทธิที่ถ่ายเทคือ P_{\\text{net}} = P_{\\text{emit}} - P_{\\text{absorb}} = e \\sigma A (T^4 - T_0^4)"
            ]
          }
        ],
        application: {
          text: "การออกแบบฉนวนกันความร้อนในอาคาร ท่อส่งไอน้ำอุณหภูมิสูง อุปกรณ์ระบายความร้อนซีพียูคอมพิวเตอร์ (Heat Sink & Heat Pipes) และเกราะป้องกันความร้อนของยานอวกาศขณะกลับเข้าสู่ชั้นบรรยากาศ",
          validWhen: "วัสดุมีความต่อเนื่องระดับมหภาค และช่วงอุณหภูมิไม่ทำให้เกิดการเปลี่ยนเฟสหรือการแปรผันรุนแรงของค่าสภาพนำความร้อน k",
          invalidWhen: "ระบบระดับนาโนเมตรที่ระยะทางสั้นกว่า Mean Free Path ของโฟนอน หรือในสุญญากาศยิ่งยวดที่ไม่มีตัวกลางสำหรับการนำและการพา"
        },
        example: {
          problem: "แผ่นกระจกหน้าต่างบานเดี่ยวหนา L = 4.0 mm มีพื้นที่ A = 1.5 m² ค่าสภาพนำความร้อน k = 0.80 W/(m·K) ถ้าอุณหภูมิผิวด้านในเท่ากับ T_H = 20°C และอุณหภูมิผิวด้านนอกเท่ากับ T_C = 0°C ในสภาวะคงตัว จงหาอัตราการสูญเสียความร้อนผ่านหน้าต่างนี้",
          steps: [
            "แปลงอุณหภูมิเป็นสเกลสัมบูรณ์: T_H = 20 + 273.15 = 293.15 K, T_C = 0 + 273.15 = 273.15 K, ผลต่าง \\Delta T = 20 K",
            "แปลงความหนาเป็นหน่วยเมตร: L = 4.0 \\times 10^{-3} \\text{ m}",
            "คำนวณความต้านทานความร้อนของกระจก: R_{\\text{th}} = \\frac{L}{k A} = \\frac{4.0 \\times 10^{-3}}{0.80 \\times 1.5} = \\frac{4.0 \\times 10^{-3}}{1.2} \\approx 3.333 \\times 10^{-3} \\text{ K/W}",
            "คำนวณอัตราการถ่ายเทความร้อนจากกฎของฟูริเยร์: \\dot{Q} = \\frac{\\Delta T}{R_{\\text{th}}} = \\frac{20}{3.333 \\times 10^{-3}} = 6,000 \\text{ W} = 6.0 \\text{ kW}",
            "สรุป: พลังงานความร้อนรั่วไหลผ่านกระจกด้วยอัตรา 6,000 จูลต่อวินาที (6.0 กิโลวัตต์) สะท้อนให้เห็นถึงความจำเป็นในการใช้กระจกฉนวนสุญญากาศสองชั้น (Double-glazed window) เพื่อลดค่า k และเพิ่ม R_th"
          ],
          diagramSvg: '<svg viewBox="0 0 400 160" class="w-full h-40 bg-slate-900 rounded"><rect x="170" y="20" width="60" height="120" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8" stroke-width="2"/><text x="200" y="85" fill="#e2e8f0" font-size="12" text-anchor="middle">กระจก (k=0.8)</text><path d="M 60 80 L 160 80" stroke="#ef4444" stroke-width="4" marker-end="url(#arrow-red)"/><text x="100" y="70" fill="#ef4444" font-size="14" font-weight="bold">T_H = 20°C</text><text x="100" y="110" fill="#f87171" font-size="11">ความร้อนไหลเข้า</text><path d="M 240 80 L 340 80" stroke="#38bdf8" stroke-width="4"/><text x="290" y="70" fill="#38bdf8" font-size="14" font-weight="bold">T_C = 0°C</text><text x="290" y="110" fill="#93c5fd" font-size="11">ความร้อนไหลออก</text><text x="200" y="150" fill="#94a3b8" font-size="11" text-anchor="middle">L = 4 mm | Q_dot = 6.0 kW</text></svg>',
          diagramCaption: "แผนภาพแสดงการนำความร้อน 1 มิติในสภาวะคงตัวผ่านแผ่นกระจกหน้าต่าง"
        },
        observations: [
          "อุณหภูมิเป็นปริมาณสเกลาร์และเป็นตัวแปรแบบอินเทนซีฟ (Intensive Variable) ซึ่งไม่ขึ้นกับขนาดหรือมวลของระบบ",
          "ความร้อนไม่ใช่ 'สาร' (ไม่ใช่ Caloric fluid ตามความเข้าใจในอดีต) แต่เป็น 'พลังงานที่อยู่ในระหว่างการถ่ายเท' ข้ามขอบเขตของระบบ",
          "การแผ่รังสีความร้อนขึ้นอยู่กับอุณหภูมิยกกำลังสี่ (T⁴) ดังนั้นเมื่ออุณหภูมิสูงขึ้นเล็กน้อย การแผ่รังสีจะทวีความรุนแรงอย่างมหาศาลและกลายเป็นกลไกหลักในการสูญเสียพลังงาน"
        ],
        citations: [
          { text: "Halliday, D., Resnick, R., & Walker, J. (2018). Fundamentals of Physics (11th Ed.), Chapter 18: Temperature, Heat, and the First Law of Thermodynamics, pp. 509-535. Wiley." },
          { text: "Incropera, F. P., DeWitt, D. P., Bergman, T. L., & Lavine, A. S. (2007). Fundamentals of Heat and Mass Transfer (6th Ed.), Chapters 1-3. John Wiley & Sons." }
        ]
      },
      {
        id: "ch05-th02",
        divisionId: "div-ch05-fundamentals",
        divisionTitle: "ภาคที่ 1: อุณหภูมิ ทฤษฎีจลน์ระดับโมเลกุล และกฎข้อที่หนึ่ง",
        numberTh: "ทฤษฎีที่ 2",
        type: "fundament",
        titleTh: "กฎแก๊สอุดมคติและทฤษฎีจลน์ระดับโมเลกุล",
        titleEn: "Ideal Gas Law & Molecular Kinetic Theory of Gases",
        summary: "สมการสภาวะของแก๊สอุดมคติ PV = nRT การพิสูจน์ที่มาของความดันระดับจุลภาคจากการถ่ายโอนโมเมนตัมของโมเลกุลที่ชนผนัง อัตราเร็วรากกำลังสองเฉลี่ย v_rms และหลักการแบ่งเท่าของพลังงาน (Equipartition Theorem)",
        definition: {
          text: "แก๊สอุดมคติ (Ideal Gas) คือแบบจำลองทางกายภาพเชิงทฤษฎีของแก๊สที่ถือว่า: (1) โมเลกุลมีขนาดเป็นจุดศูนย์มิติ (Point particles) โดยมีปริมาตรรวมของโมเลกุลน้อยมากจนตัดทิ้งได้เมื่อเทียบกับปริมาตรภาชนะ (2) ไม่มีแรงดึงดูดหรือผลักระหว่างโมเลกุล ยกเว้นเมื่อเกิดการชน (3) การชนกันระหว่างโมเลกุลและผนังภาชนะเป็นการชนแบบยืดหยุ่นสมบูรณ์ (Elastic collisions) และเป็นไปตามกฎของนิวตัน โดยมีสมการสภาวะ macroscopic คือ PV = nRT = N k_B T"
        },
        principle: {
          text: "ทฤษฎีจลน์ของแก๊ส (Kinetic Theory) เชื่อมโยงตัวแปรมหภาค (ความดัน P, ปริมาตร V, อุณหภูมิ T) เข้ากับพฤติกรรมสถิติระดับจุลภาคของอนุภาค:\n1. ความดันเกิดจากอัตราการถ่ายโอนโมเมนตัมเฉลี่ยของโมเลกุลที่พุ่งเข้าชนผนังภาชนะ: P = \\frac{1}{3} \\frac{N}{V} m \\langle v^2 \\rangle = \\frac{1}{3} \\rho v_{\\text{rms}}^2\n2. อุณหภูมิสัมบูรณ์ T มีความสัมพันธ์โดยตรงกับพลังงานจลน์เฉลี่ยของการเลื่อนตำแหน่งต่อโมเลกุล: \\langle K_{\\text{trans}} \\rangle = \\frac{1}{2} m v_{\\text{rms}}^2 = \\frac{3}{2} k_B T\n3. หลักการแบ่งเท่าของพลังงาน (Equipartition Theorem): ในสมดุลความร้อน แต่ละระดับขั้นความเสรี (Degree of freedom, f) ที่เป็นเทอมกำลังสองในฮามิลโทเนียน จะสะสมพลังงานเฉลี่ยเท่ากับ \\frac{1}{2} k_B T ต่อโมเลกุล ดังนั้น พลังงานภายในรวมของแก๊สอุดมคติคือ U = \\frac{f}{2} N k_B T = \\frac{f}{2} n R T"
        },
        formulas: [
          {
            name: "สมการสภาวะแก๊สอุดมคติ (Ideal Gas Equation of State)",
            latex: "P V = n R T = N k_B T",
            symbols: [
              { sym: "P", desc: "ความดันสัมบูรณ์", unit: "\\text{Pa}" },
              { sym: "V", desc: "ปริมาตรภาชนะ", unit: "\\text{m}^3" },
              { sym: "n", desc: "จำนวนโมลของแก๊ส", unit: "\\text{mol}" },
              { sym: "R", desc: "ค่าคงตัวสากลของแก๊ส (8.314462)", unit: "\\text{J/(mol}\\cdot\\text{K)}" },
              { sym: "N", desc: "จำนวนโมเลกุลทั้งหมด", unit: "\\text{dimensionless}" },
              { sym: "k_B", desc: "ค่าคงตัวโบลต์ซมันน์ (1.380649 \\times 10^{-23})", unit: "\\text{J/K}" },
              { sym: "T", desc: "อุณหภูมิสัมบูรณ์", unit: "\\text{K}" }
            ],
            derivationSteps: [
              "รวมกฎการทดลองในอดีต: กฎของบอยล์ (P \\propto 1/V เมื่อ T คงที่), กฎของชาร์ล (V \\propto T เมื่อ P คงที่), และกฎของอาโวกาโดร (V \\propto n เมื่อ P, T คงที่)",
              "จะได้ความสัมพันธ์รวม: V \\propto \\frac{n T}{P} \\implies P V = n R T",
              "เนื่องจากจำนวนโมเลกุล N = n N_A และนิยามค่าคงตัวโบลต์ซมันน์ k_B \\equiv R / N_A",
              "แทนค่า n R = (N / N_A) (k_B N_A) = N k_B",
              "ได้รูปสมการระดับอนุภาค: P V = N k_B T"
            ]
          },
          {
            name: "การอนุมานความดันระดับจุลภาคและอัตราเร็ว rms",
            latex: "P = \\frac{1}{3} \\rho v_{\\text{rms}}^2 \\implies v_{\\text{rms}} = \\sqrt{\\frac{3 k_B T}{m}} = \\sqrt{\\frac{3 R T}{M}}",
            symbols: [
              { sym: "P", desc: "ความดันที่ผนัง", unit: "\\text{Pa}" },
              { sym: "\\rho", desc: "ความหนาแน่นมวลของแก๊ส (Nm/V)", unit: "\\text{kg/m}^3" },
              { sym: "v_{\\text{rms}}", desc: "อัตราเร็วรากกำลังสองเฉลี่ย", unit: "\\text{m/s}" },
              { sym: "m", desc: "มวลของโมเลกุลเดี่ยว", unit: "\\text{kg}" },
              { sym: "M", desc: "มวลโมลาร์ของแก๊ส (m N_A)", unit: "\\text{kg/mol}" }
            ],
            derivationSteps: [
              "พิจารณากล่องรูปลูกบาศก์ด้านยาว L บรรจุโมเลกุลมวล m จำนวน N ตัว",
              "โมเลกุลหนึ่งตัววิ่งด้วยความเร็ว v_x ชนผนังตั้งฉากแกน x แบบยืดหยุ่น การเปลี่ยนโมเมนตัม \\Delta p_x = m(-v_x) - m(v_x) = -2mv_x",
              "โมเมนตัมที่ถ่ายทอดให้ผนังในการชนหนึ่งครั้งคือ 2mv_x และช่วงเวลาระหว่างการชนผนังเดิมซ้ำคือ \\Delta t = 2L / v_x",
              "แรงเฉลี่ยจากโมเลกุลตัวเดียวคือ F_x = \\frac{\\Delta p}{\\Delta t} = \\frac{2mv_x}{2L/v_x} = \\frac{m v_x^2}{L}",
              "แรงรวมจากโมเลกุลทั้งหมด N ตัว: F_{\\text{total}} = \\frac{m}{L} \\sum_{i=1}^N v_{xi}^2 = \\frac{N m}{L} \\langle v_x^2 \\rangle",
              "เนื่องจากการเคลื่อนที่สมมาตรทุกทิศทาง (Isotropic): \\langle v^2 \\rangle = \\langle v_x^2 \\rangle + \\langle v_y^2 \\rangle + \\langle v_z^2 \\rangle = 3\\langle v_x^2 \\rangle \\implies \\langle v_x^2 \\rangle = \\frac{1}{3}\\langle v^2 \\rangle",
              "ความดัน P = \\frac{F_{\\text{total}}}{L^2} = \\frac{N m \\langle v^2 \\rangle}{3 L^3} = \\frac{1}{3} \\frac{N m}{V} \\langle v^2 \\rangle = \\frac{1}{3} \\rho v_{\\text{rms}}^2",
              "เทียบกับ PV = N k_B T จะได้: \\frac{1}{3} N m v_{\\text{rms}}^2 = N k_B T \\implies \\frac{1}{2} m v_{\\text{rms}}^2 = \\frac{3}{2} k_B T",
              "ถอดสแควรูทได้: v_{\\text{rms}} = \\sqrt{\\frac{3 k_B T}{m}} = \\sqrt{\\frac{3 R T}{M}}"
            ]
          }
        ],
        application: {
          text: "การคำนวณการกระจายตัวของโมเลกุลแก๊สในบรรยากาศโลก การแพร่ของก๊าซในกระบวนการแยกไอโซโทปยูเรเนียม (Gaseous Diffusion) และการคำนวณความเร็วหลุดพ้นของโมเลกุลแก๊สเบา (ไฮโดรเจนและฮีเลียม) ออกจากชั้นบรรยากาศดาวเคราะห์",
          validWhen: "ความหนาแน่นของแก๊สต่ำพอ (ความดันต่ำ อุณหภูมิสูงกว่าจุดเดือดมาก) จนปริมาตรโมเลกุลและแรงระหว่างโมเลกุลมีผลน้อยมาก",
          invalidWhen: "แก๊สที่ความดันสูงมากหรืออุณหภูมิต่ำใกล้จุดควบแน่น ซึ่งต้องใช้สมการแวนเดอร์วาลส์ (van der Waals equation): (P + a/V_m^2)(V_m - b) = RT"
        },
        example: {
          problem: "จงคำนวณอัตราเร็ว rms ของโมเลกุลก๊าซไนโตรเจน (N₂) ในอากาศที่อุณหภูมิห้อง T = 300 K กำหนดให้มวลโมลาร์ของไนโตรเจน M = 0.028 kg/mol และค่า R = 8.314 J/(mol·K)",
          steps: [
            "ระบุตัวแปรที่โจทย์กำหนด: T = 300 K, M = 0.028 kg/mol, R = 8.314 J/(mol·K)",
            "เลือกสูตรอัตราเร็ว rms: v_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}",
            "แทนค่าตัวเลขลงในสูตร: v_{\\text{rms}} = \\sqrt{\\frac{3 \\times 8.314 \\times 300}{0.028}} = \\sqrt{\\frac{7482.6}{0.028}}",
            "คำนวณค่าในสแควรูท: \\frac{7482.6}{0.028} \\approx 267,235.7 \\text{ m}^2/\\text{s}^2",
            "ถอดรากที่สอง: v_{\\text{rms}} \\approx 516.95 \\text{ m/s} \\approx 517 \\text{ m/s}",
            "สรุป: โมเลกุลก๊าซไนโตรเจนในห้องวิ่งด้วยอัตราเร็วเฉลี่ยระดับ rms สูงถึงประมาณ 517 เมตรต่อวินาที (เร็วกว่าอัตราเร็วเสียงในอากาศซึ่งอยู่ที่ประมาณ 343 m/s)"
          ],
          diagramSvg: '<svg viewBox="0 0 400 160" class="w-full h-40 bg-slate-900 rounded"><rect x="50" y="20" width="300" height="120" fill="none" stroke="#38bdf8" stroke-width="2" rx="6"/><circle cx="100" cy="60" r="5" fill="#f59e0b"/><line x1="100" y1="60" x2="135" y2="45" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/><circle cx="220" cy="100" r="5" fill="#f59e0b"/><line x1="220" y1="100" x2="180" y2="120" stroke="#ef4444" stroke-width="2"/><circle cx="310" cy="70" r="5" fill="#f59e0b"/><line x1="310" y1="70" x2="340" y2="70" stroke="#ef4444" stroke-width="2"/><text x="345" y="65" fill="#38bdf8" font-size="10">ผนังภาชนะ (Area A)</text><text x="200" y="40" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">PV = N k_B T</text><text x="200" y="150" fill="#94a3b8" font-size="11" text-anchor="middle">v_rms(N2, 300K) = 517 m/s | &lt;K_trans&gt; = (3/2) k_B T</text></svg>',
          diagramCaption: "แบบจำลองทฤษฎีจลน์ของแก๊ส: การชนแบบยืดหยุ่นของอนุภาคจุดกับผนังสร้างแรงดันระดับมหภาค"
        },
        observations: [
          "ที่อุณหภูมิเดียวกัน แก๊สที่มีมวลโมลาร์น้อยกว่า (เช่น ไฮโดรเจน H₂ หรือฮีเลียม He) จะมีอัตราเร็วเฉลี่ย v_rms สูงกว่าแก๊สหนักอย่างเห็นได้ชัด",
          "อัตราเร็วเสียงในแก๊ส v_s = \\sqrt{\\gamma R T / M} แปรผันตรงกับ v_rms (v_s = v_{\\text{rms}} \\sqrt{\\gamma/3}) แสดงว่าคลื่นเสียงแพร่กระจายผ่านการถ่ายทอดการชนของโมเลกุลเหล่านี้",
          "พลังงานภายในของแก๊สอุดมคติขึ้นอยู่กับ 'อุณหภูมิ T เพียงอย่างเดียว' (Joule's Law) ไม่ขึ้นกับปริมาตร V หรือความดัน P"
        ],
        citations: [
          { text: "Tong, D. (2012). Lectures on Kinetic Theory, Chapter 1: The Boltzmann Equation and Equilibrium, Cambridge University DAMTP." },
          { text: "Morin, D. (2008). Introduction to Classical Mechanics, Chapter on Heat & Kinetic Theory. Cambridge University Press." }
        ]
      },
      {
        id: "ch05-th03",
        divisionId: "div-ch05-fundamentals",
        divisionTitle: "ภาคที่ 1: อุณหภูมิ ทฤษฎีจลน์ระดับโมเลกุล และกฎข้อที่หนึ่ง",
        numberTh: "ทฤษฎีที่ 3",
        type: "law",
        titleTh: "กฎข้อที่หนึ่งของอุณหพลศาสตร์และงานจากการเปลี่ยนปริมาตร",
        titleEn: "First Law of Thermodynamics & Boundary Work",
        summary: "กฎการอนุรักษ์พลังงานในระบบเทอร์โมไดนามิกส์ dU = dQ - dW ข้อตกลงเครื่องหมายสากล งานขยายตัวเชิงกล W = \\int P dV และความแตกต่างเชิงพื้นฐานระหว่างฟังก์ชันสภาวะ (State Function) กับฟังก์ชันวิถี (Path Function)",
        definition: {
          text: "กฎข้อที่หนึ่งของอุณหพลศาสตร์ (First Law of Thermodynamics) คือการแถลงหลักการอนุรักษ์พลังงานสำหรับระบบที่สามารถแลกเปลี่ยนความร้อนและงานกับสิ่งแวดล้อมได้ โดยระบุว่า: 'การเปลี่ยนแปลงพลังงานภายในสุทธิ (\\Delta U) ของระบบ ย่อมเท่ากับปริมาณความร้อนสุทธิ (Q) ที่ไหลเข้าสู่ระบบ ลบด้วยงานสุทธิ (W) ที่ระบบกระทำต่อสิ่งแวดล้อม' นั่นคือ \\Delta U = Q - W โดยที่ U เป็นฟังก์ชันสภาวะ แต่ Q และ W ขึ้นอยู่กับวิถีของกระบวนการ"
        },
        principle: {
          text: "ข้อตกลงเครื่องหมายมาตรฐานทางฟิสิกส์และวิศวกรรม:\n- ความร้อน Q: Q > 0 เมื่อระบบดูดกลืนความร้อนเข้าสู่ตนเอง (Endothermic), Q < 0 เมื่อระบบคายความร้อนออกสู่สิ่งแวดล้อม (Exothermic)\n- งาน W (กระทำโดยระบบ): W > 0 เมื่อระบบขยายตัวดันสิ่งแวดล้อม (dV > 0, ระบบสูญเสียพลังงานเพื่อทำงาน), W < 0 เมื่อสิ่งแวดล้อมทำงานกดอัดระบบ (dV < 0)\n- งานการเปลี่ยนขอบเขตแบบกึ่งคงที่ (Quasi-static boundary work): W = \\int_{V_i}^{V_f} P(V) dV ซึ่งมีค่าเท่ากับ 'พื้นที่ใต้กราฟบนแผนภาพ P-V'\n- พลังงานภายใน U เป็นผลรวมสภาวะของระบบ: ในวัฏจักรปิดที่หมุนวนกลับมาจุดเริ่มต้น \\oint dU = 0 ดังนั้น W_{\\text{net}} = Q_{\\text{net}}"
        },
        formulas: [
          {
            name: "กฎข้อที่หนึ่งของอุณหพลศาสตร์ (First Law of Thermodynamics)",
            latex: "\\Delta U = Q - W \\quad \\iff \\quad dU = \\delta Q - \\delta W",
            symbols: [
              { sym: "\\Delta U", desc: "การเปลี่ยนแปลงพลังงานภายใน (U_f - U_i)", unit: "\\text{J}" },
              { sym: "Q", desc: "ความร้อนสุทธิที่ถ่ายเทเข้าสู่ระบบ", unit: "\\text{J}" },
              { sym: "W", desc: "งานสุทธิที่ระบบกระทำต่อสิ่งแวดล้อม", unit: "\\text{J}" }
            ],
            derivationSteps: [
              "พิจารณาระบบปิด (Closed system) ที่ไม่มีการถ่ายเทมวลสารข้ามขอบเขต",
              "ให้พลังงานทั้งหมดของระบบประกอบด้วยพลังงานภายใน U (ไม่พิจารณาการเคลื่อนที่และแรงโน้มถ่วงระดับมหภาค)",
              "พลังงานสามารถเข้าหรือออกจากระบบได้เพียง 2 รูปแบบเท่านั้น: ในรูปของงานกล (W) หรือในรูปของความร้อน (Q)",
              "จากกฎการอนุรักษ์พลังงาน: พลังงานสะสมที่เปลี่ยนไป = พลังงานที่รับเข้า - พลังงานที่ส่งออก",
              "เมื่อกำหนดให้ Q คือความร้อนไหลเข้า และ W คืองานที่ระบบทำงานออกไปภายนอก:",
              "\\Delta U = U_{\\text{final}} - U_{\\text{initial}} = Q - W",
              "ในรูปอนุพันธ์ย่อย: dU = \\delta Q - \\delta W (ใช้สัญลักษณ์ \\delta หรือ d-slash เพื่อเน้นย้ำว่าความร้อนและงานเป็น Inexact Differentials ไม่ใช่ฟังก์ชันสภาวะ)"
            ]
          },
          {
            name: "งานกลจากการเปลี่ยนปริมาตรแบบกึ่งคงที่ (Quasi-Static Boundary Work)",
            latex: "W = \\int_{V_i}^{V_f} P dV",
            symbols: [
              { sym: "W", desc: "งานที่ระบบกระทำ", unit: "\\text{J}" },
              { sym: "P", desc: "ความดันของแก๊สที่ดันผิวลูกสูบ", unit: "\\text{Pa}" },
              { sym: "V_i, V_f", desc: "ปริมาตรเริ่มต้นและสุดท้าย", unit: "\\text{m}^3" }
            ],
            derivationSteps: [
              "พิจารณาลูกสูบพื้นที่หน้าตัด A บรรจุแก๊สความดัน P",
              "แรงที่แก๊สดันลูกสูบคือ F = P A",
              "เมื่องานขยายตัวดันลูกสูบให้เคลื่อนที่ออกไปเป็นระยะทางสั้นๆ dx:",
              "dW = F dx = (P A) dx = P (A dx) = P dV",
              "อินทิเกรตตลอดการเปลี่ยนปริมาตรจากสภาวะเริ่มต้น V_i ไปยังสภาวะสุดท้าย V_f:",
              "W = \\int_{V_i}^{V_f} P dV",
              "บนกราฟ P-V งาน W คือพื้นที่ใต้เส้นทางกระบวนการ (ถ้า V_f > V_i งานเป็นบวก, ถ้า V_f < V_i งานเป็นลบ)"
            ]
          }
        ],
        application: {
          text: "การวิเคราะห์กำลังงานของกระบอกสูบในเครื่องยนต์สันดาปภายใน คอมเพรสเซอร์อัดอากาศ กังหันไอน้ำในโรงไฟฟ้า และการคำนวณการใช้พลังงานในกระบวนการทางเคมีอุตสาหกรรม",
          validWhen: "กระบวนการเกิดขึ้นอย่างช้าๆ พอที่จะรักษาสภาวะกึ่งสมดุล (Quasi-equilibrium / Quasi-static) ทั่วทั้งเนื้อสาร",
          invalidWhen: "การขยายตัวอย่างอิสระในสุญญากาศ (Free expansion / Joule expansion) ซึ่งเกิดความปั่นป่วนรุนแรง P ภายนอกเป็นศูนย์ ทำให้ W = 0 แม้ว่าปริมาตรจะเพิ่มขึ้น"
        },
        example: {
          problem: "แก๊สอุดมคติ 1.0 โมลขยายตัวจากปริมาตร V_1 = 0.010 m³ ไปเป็น V_2 = 0.025 m³ ภายใต้ความดันคงที่ P = 2.0 × 10⁵ Pa ระหว่างกระบวนการนี้แก๊สดูดกลืนความร้อนเข้ามา Q = 4,500 J จงหางาน W ที่แก๊สกระทำ และการเปลี่ยนแปลงพลังงานภายใน ΔU",
          steps: [
            "คำนวณงานที่ความดันคงที่ (Isobaric process): W = \\int P dV = P (V_2 - V_1)",
            "แทนค่าความดันและการเปลี่ยนปริมาตร: W = (2.0 \\times 10^5 \\text{ Pa})(0.025 - 0.010 \\text{ m}^3) = (2.0 \\times 10^5)(0.015) = 3,000 \\text{ J}",
            "นำค่าความร้อน Q = 4,500 J และงาน W = 3,000 J เข้าแทนในกฎข้อที่หนึ่ง:",
            "\\Delta U = Q - W = 4,500 \\text{ J} - 3,000 \\text{ J} = 1,500 \\text{ J}",
            "สรุป: แก๊สทำงานกลออกไป 3,000 จูล และพลังงานภายในเพิ่มขึ้น 1,500 จูล (ซึ่งทำให้อุณหภูมิของแก๊สสูงขึ้นตามความสัมพันธ์ \\Delta U = n C_V \\Delta T)"
          ],
          diagramSvg: '<svg viewBox="0 0 400 160" class="w-full h-40 bg-slate-900 rounded"><line x1="60" y1="130" x2="360" y2="130" stroke="#94a3b8" stroke-width="1.5"/><line x1="60" y1="130" x2="60" y2="20" stroke="#94a3b8" stroke-width="1.5"/><text x="350" y="145" fill="#94a3b8" font-size="11">V</text><text x="45" y="30" fill="#94a3b8" font-size="11">P</text><rect x="110" y="60" width="180" height="70" fill="#3b82f6" fill-opacity="0.2"/><line x1="110" y1="60" x2="290" y2="60" stroke="#38bdf8" stroke-width="3"/><polygon points="205,57 215,60 205,63" fill="#38bdf8"/><circle cx="110" cy="60" r="4" fill="#f59e0b"/><circle cx="290" cy="60" r="4" fill="#ef4444"/><text x="105" y="50" fill="#f59e0b" font-size="11">1</text><text x="295" y="50" fill="#ef4444" font-size="11">2</text><text x="200" y="95" fill="#60a5fa" font-size="12" font-weight="bold" text-anchor="middle">งาน W = P·ΔV = 3,000 J</text><text x="200" y="150" fill="#cbd5e1" font-size="11" text-anchor="middle">กระบวนการความดันคงที่ (Isobaric) | ΔU = Q - W = 1,500 J</text></svg>',
          diagramCaption: "แผนภาพ P-V แสดงงานจากการขยายตัวความดันคงที่ (พื้นที่แรเงาใต้กราฟ)"
        },
        observations: [
          "พลังงานภายใน U เป็นฟังก์ชันสภาวะ (State Function): ค่า \\Delta U ระหว่างจุดสองจุดใดๆ จะมีค่าเท่าเดิมเสมอไม่ว่าจะเดินทางด้วยเส้นทางใด",
          "งาน W และความร้อน Q เป็นฟังก์ชันวิถี (Path Functions): ค่าของทั้งสองตัวขึ้นอยู่กับรายละเอียดของเส้นทางบนแผนภาพ P-V อย่างยิ่ง",
          "สำหรับกระบวนการแบบวัฏจักร (Cyclic process) ที่ระบบกลับคืนสู่สภาวะตั้งต้น \\Delta U_{\\text{cycle}} = 0 เสมอ ทำให้งานสุทธิเท่ากับความร้อนสุทธิ: W_{\\text{net}} = Q_{\\text{net}}"
        ],
        citations: [
          { text: "Moran, M. J., et al. (2018). Fundamentals of Engineering Thermodynamics (9th Ed.), Chapter 2: Energy and the First Law of Thermodynamics. Wiley." },
          { text: "Halliday, D., Resnick, R., & Walker, J. (2018). Fundamentals of Physics (11th Ed.), Chapter 19: The Kinetic Theory of Gases. Wiley." }
        ]
      },
      {
        id: "ch05-th04",
        divisionId: "div-ch05-cycles-entropy",
        divisionTitle: "ภาคที่ 2: กระบวนการเทอร์โมไดนามิกส์ เครื่องยนต์ความร้อน และกฎข้อที่สอง",
        numberTh: "ทฤษฎีที่ 4",
        type: "law",
        titleTh: "สี่กระบวนการพื้นฐานทางอุณหพลศาสตร์ในแก๊สอุดมคติ",
        titleEn: "Four Core Thermodynamic Processes in Ideal Gases",
        summary: "การวิเคราะห์เชิงลึกของ 4 กระบวนการกึ่งคงที่: ปริมาตรคงที่ (Isochoric), ความดันคงที่ (Isobaric), อุณหภูมิคงที่ (Isothermal) และไม่มีการถ่ายเทความร้อน (Adiabatic) พร้อมความสัมพันธ์ PV^gamma = const",
        definition: {
          text: "กระบวนการทางอุณหพลศาสตร์ (Thermodynamic Process) คือการเปลี่ยนแปลงสภาวะของระบบจากสภาวะสมดุลเริ่มต้นไปยังสภาวะสมดุลสุดท้าย โดยในแก๊สอุดมคติมีกระบวนการอ้างอิงมาตรฐาน 4 แบบหลัก ได้แก่: (1) ปริมาตรคงที่ (Isochoric / Isovolumetric, dV = 0) (2) ความดันคงที่ (Isobaric, dP = 0) (3) อุณหภูมิคงที่ (Isothermal, dT = 0) และ (4) แอเดียแบติก (Adiabatic, dQ = 0)"
        },
        principle: {
          text: "การวิเคราะห์คุณลักษณะและงานในแต่ละกระบวนการ:\n1. Isochoric (V = คงที่): dV = 0 \\implies W = 0, Q = \\Delta U = n C_V \\Delta T (พลังงานความร้อนทั้งหมดเปลี่ยนเป็นพลังงานภายใน)\n2. Isobaric (P = คงที่): W = P \\Delta V = n R \\Delta T, Q = n C_P \\Delta T, \\Delta U = n C_V \\Delta T (สังเกตความสัมพันธ์ไมเยอร์ C_P = C_V + R)\n3. Isothermal (T = คงที่): \\Delta U = 0 \\implies Q = W = n R T \\ln(V_f / V_i) (ความร้อนที่ไหลเข้าถูกเปลี่ยนเป็นงานกล 100% เพื่อรักษาอุณหภูมิ)\n4. Adiabatic (Q = 0): หุ้มฉนวนสมบูรณ์ \\Delta U = -W \\implies W = -n C_V \\Delta T = \\frac{P_i V_i - P_f V_f}{\\gamma - 1} โดยมีความสัมพันธ์เส้นโค้งควอซิสแตติกคือ P V^\\gamma = \\text{const}, T V^{\\gamma-1} = \\text{const}, T^\\gamma P^{1-\\gamma} = \\text{const}"
        },
        formulas: [
          {
            name: "งานในกระบวนการอุณหภูมิคงที่ (Isothermal Work)",
            latex: "W_{\\text{iso}} = n R T \\ln\\left(\\frac{V_f}{V_i}\\right) = P_i V_i \\ln\\left(\\frac{V_f}{V_i}\\right)",
            symbols: [
              { sym: "W_{\\text{iso}}", desc: "งานในกระบวนการไอโซเทอร์มอล", unit: "\\text{J}" },
              { sym: "T", desc: "อุณหภูมิคงที่ของแหล่งกักเก็บความร้อน", unit: "\\text{K}" },
              { sym: "V_i, V_f", desc: "ปริมาตรเริ่มต้นและสุดท้าย", unit: "\\text{m}^3" }
            ],
            derivationSteps: [
              "จากกฎแก๊สอุดมคติ P = \\frac{n R T}{V}",
              "เนื่องจากอุณหภูมิ T คงที่ ตัวประกอบ n R T สามารถดึงออกนอกอินทิกรัลได้:",
              "W = \\int_{V_i}^{V_f} P dV = \\int_{V_i}^{V_f} \\frac{n R T}{V} dV = n R T \\int_{V_i}^{V_f} \\frac{1}{V} dV",
              "อินทิเกรตฟังก์ชัน 1/V ได้ลอการิทึมธรรมชาติ: W = n R T [\\ln V]_{V_i}^{V_f} = n R T (\\ln V_f - \\ln V_i) = n R T \\ln\\left(\\frac{V_f}{V_i}\\right)",
              "เนื่องจาก T คงที่ \\Delta U = 0 ดังนั้นจากกฎข้อที่หนึ่ง Q = W = n R T \\ln(V_f / V_i)"
            ]
          },
          {
            name: "สมการกระบวนการแอเดียแบติก (Adiabatic Process Equation)",
            latex: "P V^\\gamma = \\text{const} \\quad \\text{and} \\quad T V^{\\gamma-1} = \\text{const}",
            symbols: [
              { sym: "\\gamma", desc: "อัตราส่วนความจุความร้อน C_P / C_V", unit: "\\text{dimensionless}" },
              { sym: "P, V, T", desc: "ตัวแปรสภาวะความดัน ปริมาตร และอุณหภูมิ", unit: "\\text{Pa, m}^3\\text{, K}" }
            ],
            derivationSteps: [
              "จากเงื่อนไขแอเดียแบติก \\delta Q = 0 กฎข้อที่หนึ่งให้: dU = -\\delta W \\implies n C_V dT = -P dV",
              "จากอนุพันธ์รวมของกฎแก๊สอุดมคติ P V = n R T: P dV + V dP = n R dT",
              "แทนค่า dT = \\frac{-P dV}{n C_V} ลงไป: P dV + V dP = n R \\left(\\frac{-P dV}{n C_V}\\right) = -\\frac{R}{C_V} P dV",
              "จัดรูปโดยใช้ความสัมพันธ์ไมเยอร์ R = C_P - C_V: V dP = -\\left(1 + \\frac{C_P - C_V}{C_V}\\right) P dV = -\\frac{C_P}{C_V} P dV = -\\gamma P dV",
              "หารทั้งสองข้างด้วย P V เพื่อแยกตัวแปร: \\frac{dP}{P} + \\gamma \\frac{dV}{V} = 0",
              "อินทิเกรตทั้งสองข้าง: \\ln P + \\gamma \\ln V = \\text{const} \\implies \\ln(P V^\\gamma) = \\text{const} \\implies P V^\\gamma = \\text{const}",
              "แทน P = nRT/V จะได้ความสัมพันธ์ระหว่างอุณหภูมิและปริมาตร: T V^{\\gamma-1} = \\text{const}"
            ]
          }
        ],
        application: {
          text: "การอัดอากาศในคอมเพรสเซอร์เครื่องยนต์เทอร์โบ การขยายตัวของแก๊สในกระบอกสูบเครื่องยนต์ การเดินทางของคลื่นเสียงในอากาศ (ซึ่งเกิดเร็วมากจนเป็นกระบวนการแอเดียแบติก) และการคำนวณการขยายตัวของก๊าซในกระบอกสูบนิวแมติก",
          validWhen: "กระบวนการแอเดียแบติกต้องเกิดขึ้นอย่างรวดเร็วพอที่ความร้อนถ่ายเทเข้าออกจากขอบเขตไม่ทัน หรือระบบถูกหุ้มด้วยฉนวนกันความร้อนที่สมบูรณ์แบบ",
          invalidWhen: "กระบวนการที่ระบบสัมผัสกับแหล่งความร้อนขนาดใหญ่และดำเนินไปช้ามากจนอุณหภูมิคงที่ (ซึ่งจะกลายเป็นไอโซเทอร์มอล)"
        },
        example: {
          problem: "แก๊สอุดมคติอะตอมคู่ (γ = 1.40) ปริมาตรเริ่มต้น V_1 = 2.0 L ที่อุณหภูมิ T_1 = 300 K ถูกบีบอัดอย่างรวดเร็วแบบแอเดียแบติกกึ่งคงที่จนเหลือปริมาตร V_2 = 0.50 L จงหาอุณหภูมิสุดท้าย T_2 ของแก๊ส",
          steps: [
            "ระบุความสัมพันธ์สำหรับกระบวนการแอเดียแบติกในรูปตัวแปร T และ V: T_1 V_1^{\\gamma-1} = T_2 V_2^{\\gamma-1}",
            "จัดรูปหาอุณหภูมิสุดท้าย T_2: T_2 = T_1 \\left(\\frac{V_1}{V_2}\\right)^{\\gamma - 1}",
            "แทนค่าอัตราส่วนการอัด V_1 / V_2 = 2.0 / 0.50 = 4.0 และ \\gamma - 1 = 1.40 - 1 = 0.40:",
            "T_2 = 300 \\times (4.0)^{0.40}",
            "คำนวณค่า (4.0)^{0.40}: เนื่องจาก 4^{0.4} \\approx 1.7411",
            "T_2 = 300 \\times 1.7411 \\approx 522.3 \\text{ K}",
            "แปลงเป็นองศาเซลเซียส: T_2 \\approx 522.3 - 273.15 \\approx 249.2^\\circ\\text{C}",
            "สรุป: การอัดแบบแอเดียแบติกทำให้อุณหภูมิพุ่งสูงขึ้นอย่างมากจาก 27°C เป็น 249°C ซึ่งเป็นหลักการทางฟิสิกส์พื้นฐานของการจุดระเบิดในเครื่องยนต์ดีเซล"
          ],
          diagramSvg: '<svg viewBox="0 0 400 160" class="w-full h-40 bg-slate-900 rounded"><line x1="50" y1="140" x2="370" y2="140" stroke="#94a3b8" stroke-width="1.5"/><line x1="50" y1="140" x2="50" y2="20" stroke="#94a3b8" stroke-width="1.5"/><text x="360" y="155" fill="#94a3b8" font-size="11">V</text><text x="35" y="30" fill="#94a3b8" font-size="11">P</text><path d="M 90 30 Q 140 85 320 110" stroke="#38bdf8" stroke-width="2.5" fill="none"/><text x="280" y="100" fill="#38bdf8" font-size="11">Isothermal (PV=C)</text><path d="M 90 30 Q 130 115 320 135" stroke="#ef4444" stroke-width="2.5" fill="none"/><text x="240" y="130" fill="#ef4444" font-size="11">Adiabatic (PV^γ=C)</text><circle cx="90" cy="30" r="4" fill="#f59e0b"/><text x="95" y="25" fill="#f59e0b" font-size="11">State 1</text><text x="210" y="15" fill="#cbd5e1" font-size="12" font-weight="bold" text-anchor="middle">เปรียบเทียบความชัน: กราฟแอเดียแบติกชันกว่าไอโซเทอร์มอล γ เท่า</text></svg>',
          diagramCaption: "เปรียบเทียบเส้นโค้งไอโซเทอร์มอลและแอเดียแบติกบนแผนภาพ P-V: ความชันแอเดียแบติกชันกว่าด้วยตัวคูณ γ"
        },
        observations: [
          "ความชันของเส้นกราฟแอเดียแบติกบนระนาบ P-V คือ \\left(\\frac{dP}{dV}\\right)_{\\text{ad}} = -\\gamma \\frac{P}{V} ซึ่งมีความชันมากกว่าความชันของเส้นไอโซเทอร์มอล \\left(\\frac{dP}{dV}\\right)_{\\text{iso}} = -\\frac{P}{V} เสมอเป็นอัตราส่วน \\gamma เท่า",
          "ในกระบวนการแอเดียแบติก เมื่อแก๊สขยายตัวและทำงานต่อสิ่งแวดล้อม (W > 0) พลังงานภายในจะลดลง (\\Delta U < 0) ทำให้อุณหภูมิต้องลดลงเสมอ",
          "ความร้อนจำเพาะโมลาร์ในกระบวนการแอเดียแบติกมีค่าเป็นศูนย์ (C = \\delta Q / n dT = 0) ในขณะที่กระบวนการไอโซเทอร์มอลมีค่าเป็นอนันต์ (C = \\infty)"
        ],
        citations: [
          { text: "Tong, D. (2012). Lectures on Statistical Physics, Chapter 4: Classical Thermodynamics, Section 4.2: Thermodynamic Potentials and Processes. Cambridge University." },
          { text: "Halliday, D., Resnick, R., & Walker, J. (2018). Fundamentals of Physics (11th Ed.), Chapter 20: Entropy and the Second Law of Thermodynamics. Wiley." }
        ]
      },
      {
        id: "ch05-th05",
        divisionId: "div-ch05-cycles-entropy",
        divisionTitle: "ภาคที่ 2: กระบวนการเทอร์โมไดนามิกส์ เครื่องยนต์ความร้อน และกฎข้อที่สอง",
        numberTh: "ทฤษฎีที่ 5",
        type: "fundament",
        titleTh: "เครื่องยนต์ความร้อน วัฏจักรคาร์โนต์ และประสิทธิภาพสูงสุด",
        titleEn: "Heat Engines, Carnot Cycle & Maximum Efficiency",
        summary: "หลักการทำงานของเครื่องยนต์ความร้อนแบบวัฏจักร วัฏจักรคาร์โนต์ที่ประกอบด้วย 2 กระบวนการไอโซเทอร์มอลและ 2 กระบวนการแอเดียแบติกแบบผันกลับได้ ทฤษฎีบทของคาร์โนต์ ประสิทธิภาพสูงสุด eta_Carnot = 1 - T_C/T_H และสัมประสิทธิ์สมรรถนะ (COP) ของเครื่องทำความเย็นและปั๊มความร้อน",
        definition: {
          text: "เครื่องยนต์ความร้อน (Heat Engine) คืออุปกรณ์ที่ทำงานเป็นวัฏจักรเพื่อเปลี่ยนพลังงานความร้อนจากแหล่งอุณหภูมิสูง (Hot Reservoir, T_H) ไปเป็นงานกลสุทธิ (Net Work, W_net) โดยต้องมีการคายความร้อนส่วนหนึ่งทิ้งไปยังแหล่งกักเก็บอุณหภูมิต่ำ (Cold Reservoir, T_C) เสมอ วัฏจักรคาร์โนต์ (Carnot Cycle) เสนอโดย ซาดี คาร์โนต์ ในปี 1824 เป็นวัฏจักรเชิงอุดมคติที่ผันกลับได้สมบูรณ์ (Reversible) ซึ่งให้ค่าประสิทธิภาพเชิงความร้อนสูงสุดในทางทฤษฎีระหว่างสองระดับอุณหภูมิใดๆ"
        },
        principle: {
          text: "ขั้นตอนทั้งสี่ของวัฏจักรคาร์โนต์:\n1. กระบวนการ 1 -> 2: การขยายตัวแบบอุณหภูมิคงที่ (Reversible Isothermal Expansion) ที่ T_H ดูดกลืนความร้อน Q_H\n2. กระบวนการ 2 -> 3: การขยายตัวแบบแอเดียแบติก (Reversible Adiabatic Expansion) อุณหภูมิลดลงจาก T_H สู่ T_C โดย Q = 0\n3. กระบวนการ 3 -> 4: การบีบอัดแบบอุณหภูมิคงที่ (Reversible Isothermal Compression) ที่ T_C ปลดปล่อยความร้อน Q_C ออกสู่แหล่งอุณหภูมิต่ำ\n4. กระบวนการ 4 -> 1: การบีบอัดแบบแอเดียแบติก (Reversible Adiabatic Compression) อุณหภูมิเพิ่มขึ้นจาก T_C กลับสู่ T_H โดย Q = 0\n\nทฤษฎีบทของคาร์โนต์ (Carnot's Theorem):\nไม่มีเครื่องยนต์ความร้อนใดที่ทำงานระหว่างสองแหล่งอุณหภูมิ T_H และ T_C จะมีประสิทธิภาพสูงกว่าเครื่องยนต์คาร์โนต์ที่ผันกลับได้ และเครื่องยนต์ผันกลับได้ทุกเครื่องที่ทำงานระหว่างสองอุณหภูมินี้จะมีประสิทธิภาพเท่ากันหมดเสมอ โดยไม่ขึ้นกับชนิดของสารทำงาน (Working fluid)"
        },
        formulas: [
          {
            name: "ประสิทธิภาพเชิงความร้อนของเครื่องยนต์ความร้อน (Thermal Efficiency)",
            latex: "\\eta = \\frac{W_{\\text{net}}}{Q_H} = 1 - \\frac{Q_C}{Q_H}",
            symbols: [
              { sym: "\\eta", desc: "ประสิทธิภาพเชิงความร้อน", unit: "\\text{dimensionless} \\; (0 \\le \\eta < 1)" },
              { sym: "W_{\\text{net}}", desc: "งานกลสุทธิที่ผลิตได้ต่อหนึ่งรอบวัฏจักร", unit: "\\text{J}" },
              { sym: "Q_H", desc: "ความร้อนที่ดูดกลืนจากแหล่งความร้อนอุณหภูมิสูง", unit: "\\text{J}" },
              { sym: "Q_C", desc: "ความร้อนที่คายทิ้งสู่แหล่งความร้อนอุณหภูมิต่ำ", unit: "\\text{J}" }
            ],
            derivationSteps: [
              "จากกฎข้อที่หนึ่งของอุณหพลศาสตร์ ตลอดหนึ่งรอบวัฏจักรระบบกลับคืนสู่สภาวะเดิม: \\Delta U_{\\text{cycle}} = 0",
              "งานสุทธิที่ทำได้เท่ากับความร้อนสุทธิ: W_{\\text{net}} = Q_{\\text{net}} = Q_H - Q_C",
              "นิยามประสิทธิภาพ \\eta คืออัตราส่วนระหว่าง 'สิ่งที่เป็นประโยชน์ (งานสุทธิ W_net)' ต่อ 'สิ่งที่เราต้องจ่าย (ความร้อนป้อนเข้า Q_H)':",
              "\\eta = \\frac{W_{\\text{net}}}{Q_H} = \\frac{Q_H - Q_C}{Q_H} = 1 - \\frac{Q_C}{Q_H}"
            ]
          },
          {
            name: "ประสิทธิภาพเครื่องยนต์คาร์โนต์ (Carnot Efficiency)",
            latex: "\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}",
            symbols: [
              { sym: "\\eta_{\\text{Carnot}}", desc: "ประสิทธิภาพสูงสุดตามทฤษฎีของคาร์โนต์", unit: "\\text{dimensionless}" },
              { sym: "T_C", desc: "อุณหภูมิสัมบูรณ์ของแหล่งอุณหภูมิต่ำ (Sink)", unit: "\\text{K}" },
              { sym: "T_H", desc: "อุณหภูมิสัมบูรณ์ของแหล่งอุณหภูมิสูง (Source)", unit: "\\text{K}" }
            ],
            derivationSteps: [
              "ในวัฏจักรคาร์โนต์ กระบวนการรับความร้อน 1->2 เป็นไอโซเทอร์มอล: Q_H = n R T_H \\ln(V_2 / V_1)",
              "กระบวนการคายความร้อน 3->4 เป็นไอโซเทอร์มอล: Q_C = n R T_C \\ln(V_3 / V_4)",
              "สำหรับกระบวนการแอเดียแบติก 2->3 และ 4->1: T_H V_2^{\\gamma-1} = T_C V_3^{\\gamma-1} และ T_H V_1^{\\gamma-1} = T_C V_4^{\\gamma-1}",
              "หารสมการทั้งสอง: \\left(\\frac{V_2}{V_1}\\right)^{\\gamma-1} = \\left(\\frac{V_3}{V_4}\\right)^{\\gamma-1} \\implies \\frac{V_2}{V_1} = \\frac{V_3}{V_4}",
              "ดังนั้น \\ln(V_2 / V_1) = \\ln(V_3 / V_4)",
              "อัตราส่วนความร้อน: \\frac{Q_C}{Q_H} = \\frac{n R T_C \\ln(V_3/V_4)}{n R T_H \\ln(V_2/V_1)} = \\frac{T_C}{T_H}",
              "แทนลงในสูตรประสิทธิภาพ: \\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}"
            ]
          }
        ],
        application: {
          text: "การประเมินขีดจำกัดสูงสุดของประสิทธิภาพโรงไฟฟ้าพลังความร้อน (ถ่านหิน ก๊าซธรรมชาติ นิวเคลียร์ กังหันร่วม CCGT) การวิเคราะห์วัฏจักรออตโตและดีเซลในยานยนต์ และการคำนวณค่า COP ของปั๊มความร้อนและระบบทำความเย็น",
          validWhen: "ใช้อุณหภูมิในหน่วยเคลวิน (K) เท่านั้น และกระบวนการดำเนินไปอย่างผันกลับได้โดยไม่มีแรงเสียดทานหรือความสูญเสียทางความร้อนแบบไม่ผันกลับได้",
          invalidWhen: "การใช้สเกลเซลเซียสในการคำนวณประสิทธิภาพ หรือการสมมุติว่าเครื่องยนต์จริงสามารถทำประสิทธิภาพแตะระดับคาร์โนต์ได้โดยไม่มีการสูญเสีย"
        },
        example: {
          problem: "โรงไฟฟ้าพลังความร้อนทำงานระหว่างหม้อต้มไอน้ำอุณหภูมิ T_H = 550°C และหอหล่อเย็นอุณหภูมิ T_C = 25°C จงหา: (ก) ประสิทธิภาพเชิงความร้อนสูงสุดตามทฤษฎีคาร์โนต์ (ข) ถ้าโรงงานจริงผลิตกำลังไฟฟ้าได้ 800 MW และมีประสิทธิภาพจริงเพียง 60% ของค่าคาร์โนต์ จงหาอัตราความร้อนที่ต้องจ่ายเข้าสู่หม้อต้ม",
          steps: [
            "แปลงอุณหภูมิเป็นเคลวิน: T_H = 550 + 273.15 = 823.15 K, T_C = 25 + 273.15 = 298.15 K",
            "คำนวณประสิทธิภาพคาร์โนต์: \\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H} = 1 - \\frac{298.15}{823.15} = 1 - 0.3622 = 0.6378 \\; (63.78\\%)",
            "คำนวณประสิทธิภาพจริงของโรงงาน: \\eta_{\\text{real}} = 0.60 \\times 0.6378 \\approx 0.3827 \\; (38.27\\%)",
            "คำนวณอัตราความร้อนป้อนเข้าหม้อต้ม (Q_dot_H) จากกำลังงานกลที่ผลิตได้: P_{\\text{out}} = \\eta_{\\text{real}} \\dot{Q}_H",
            "\\dot{Q}_H = \\frac{P_{\\text{out}}}{\\eta_{\\text{real}}} = \\frac{800 \\text{ MW}}{0.3827} \\approx 2,090 \\text{ MW} \\approx 2.09 \\text{ GW}",
            "สรุป: โรงไฟฟ้ามีขีดจำกัดประสิทธิภาพสูงสุดตามธรรมชาติ 63.8% ในทางปฏิบัติทำได้ 38.3% และต้องเผาไหม้เชื้อเพลิงเพื่อจ่ายความร้อน 2,090 เมกะวัตต์ โดยมีความร้อนสูญเสียคายทิ้งสู่สิ่งแวดล้อมถึง 1,290 เมกะวัตต์"
          ],
          diagramSvg: '<svg viewBox="0 0 400 160" class="w-full h-40 bg-slate-900 rounded"><rect x="130" y="10" width="140" height="35" fill="#ef4444" rx="4"/><text x="200" y="32" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Hot Reservoir (T_H)</text><circle cx="200" cy="80" r="25" fill="#334155" stroke="#38bdf8" stroke-width="2"/><text x="200" y="85" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">ENGINE</text><rect x="130" y="115" width="140" height="35" fill="#3b82f6" rx="4"/><text x="200" y="137" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">Cold Sink (T_C)</text><line x1="200" y1="45" x2="200" y2="55" stroke="#ef4444" stroke-width="3" marker-end="url(#arrow-red)"/><text x="215" y="52" fill="#f87171" font-size="10">Q_H</text><line x1="200" y1="105" x2="200" y2="115" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow-blue)"/><text x="215" y="112" fill="#93c5fd" font-size="10">Q_C</text><line x1="225" y1="80" x2="320" y2="80" stroke="#22c55e" stroke-width="3" marker-end="url(#arrow-green)"/><text x="270" y="72" fill="#4ade80" font-size="11" font-weight="bold">W_net</text><text x="70" y="85" fill="#fbbf24" font-size="11" text-anchor="middle">η = 1 - T_C/T_H</text></svg>',
          diagramCaption: "แผนผังการไหลของพลังงานในเครื่องยนต์ความร้อน: ความร้อน Q_H จากแหล่งอุณหภูมิสูงถูกเปลี่ยนเป็นงานกล W และคายความร้อนเหลือทิ้ง Q_C"
        },
        observations: [
          "ประสิทธิภาพคาร์โนต์จะเข้าใกล้ 100% (\\eta = 1) ได้ก็ต่อเมื่อแหล่งอุณหภูมิต่ำอยู่ที่ศูนย์สัมบูรณ์ (T_C = 0 K) ซึ่งเป็นไปไม่ได้ตามกฎข้อที่สามแห่งอุณหพลศาสตร์",
          "ในการปรับปรุงประสิทธิภาพเครื่องยนต์ความร้อน วิธีที่มีประสิทธิผลมากที่สุดคือการเพิ่มอุณหภูมิแหล่งความร้อนสูง T_H (เช่น พัฒนาวัสดุใบพัดเซรามิกที่ทนอุณหภูมิสูงในกังหันก๊าซ)",
          "สำหรับเครื่องทำความเย็นและปั๊มความร้อน สัมประสิทธิ์สมรรถนะ (COP) มีค่าเกิน 1.0 เสมอเนื่องจากพลังงานความร้อนที่ถ่ายเทไม่ใช่พลังงานที่ 'สร้างขึ้นใหม่' แต่เป็นพลังงานที่ 'สูบ' มาจากที่อื่น"
        ],
        citations: [
          { text: "Carnot, S. (1824). Réflexions sur la puissance motrice du feu et sur les machines propres à développer cette puissance. Bachelier, Paris." },
          { text: "Moran, M. J., et al. (2018). Fundamentals of Engineering Thermodynamics (9th Ed.), Chapter 5: The Second Law of Thermodynamics. Wiley." }
        ]
      },
      {
        id: "ch05-th06",
        divisionId: "div-ch05-cycles-entropy",
        divisionTitle: "ภาคที่ 2: กระบวนการเทอร์โมไดนามิกส์ เครื่องยนต์ความร้อน และกฎข้อที่สอง",
        numberTh: "ทฤษฎีที่ 6",
        type: "law",
        titleTh: "กฎข้อที่สองของอุณหพลศาสตร์ เอนโทรปี และการแจกแจงแมกซ์เวลล์-โบลต์ซมันน์",
        titleEn: "Second Law of Thermodynamics, Entropy & Maxwell-Boltzmann Distribution",
        summary: "คำแถลงของเคลาซิอุสและเคลวิน-พลังค์ ความไม่ผันกลับได้ตามธรรมชาติ นิยามเอนโทรปีทางคลาสสิก dS = dQ_rev/T และเชิงสถิติ S = k_B ln Omega พร้อมการกระจายตัวของอัตราเร็วโมเลกุลตามสถิติของแมกซ์เวลล์-โบลต์ซมันน์",
        definition: {
          text: "กฎข้อที่สองของอุณหพลศาสตร์ (Second Law of Thermodynamics) กำหนดทิศทางการเปลี่ยนแปลงตามธรรมชาติของกระบวนการทางกายภาพ โดยระบุว่า: 'ในระบบโดดเดี่ยวใดๆ เอนโทรปีรวมของระบบย่อมมีแต่จะเพิ่มขึ้นหรือไม่เปลี่ยนแปลงในกระบวนการผันกลับได้ (\\Delta S_{\\text{universe}} \\ge 0)' โดยความร้อนไม่สามารถถ่ายเทจากวัตถุอุณหภูมิต่ำไปยังวัตถุอุณหภูมิสูงได้เองโดยปราศจากการทำงานจากภายนอก (Clausius Statement) และไม่สามารถสร้างเครื่องยนต์ความร้อนที่แปลงความร้อนเป็นงานกลได้สมบูรณ์ 100% โดยไม่มีการสูญเสียความร้อนสู่สิ่งแวดล้อม (Kelvin-Planck Statement)"
        },
        principle: {
          text: "มิติเชิงคลาสสิกและเชิงสถิติของเอนโทรปี:\n1. นิยามคลาสสิกของเคลาซิอุส (Clausius Entropy): dS = \\frac{\\delta Q_{\\text{rev}}}{T} เป็นฟังก์ชันสภาวะ สำหรับกระบวนการใดๆ \\Delta S = \\int_i^f \\frac{\\delta Q_{\\text{rev}}}{T}\n2. ความไม่เท่ากันของเคลาซิอุส (Clausius Inequality): สำหรับวัฏจักรใดๆ \\oint \\frac{\\delta Q}{T} \\le 0 (เท่ากับศูนย์เฉพาะวัฏจักรผันกลับได้)\n3. นิยามเชิงสถิติของโบลต์ซมันน์ (Boltzmann Entropy): S = k_B \\ln \\Omega โดยที่ \\Omega คือจำนวนสถานะจุลภาค (Microstates) ที่สอดคล้องกับสถานะมหภาค แสดงถึงความน่าจะเป็นทางสถิติและระดับความไร้ระเบียบของระบบ\n4. การแจกแจงอัตราเร็วของแมกซ์เวลล์-โบลต์ซมันน์ (Maxwell-Boltzmann Distribution): สัดส่วนโมเลกุลที่มีอัตราเร็ว v ในช่วง dv:\n   f(v) = 4\\pi \\left(\\frac{m}{2\\pi k_B T}\\right)^{3/2} v^2 \\exp\\left(-\\frac{m v^2}{2 k_B T}\\right)\n   โดยมีลำดับอัตราเร็ว: v_p = \\sqrt{2k_B T/m} < \\bar{v} = \\sqrt{8k_B T/(\\pi m)} < v_{\\text{rms}} = \\sqrt{3k_B T/m}"
        },
        formulas: [
          {
            name: "นิยามการเปลี่ยนแปลงเอนโทรปี (Thermodynamic Entropy Change)",
            latex: "\\Delta S = \\int_{i}^{f} \\frac{\\delta Q_{\\text{rev}}}{T} \\quad \\text{and} \\quad \\Delta S_{\\text{univ}} = \\Delta S_{\\text{sys}} + \\Delta S_{\\text{surr}} \\ge 0",
            symbols: [
              { sym: "\\Delta S", desc: "การเปลี่ยนแปลงเอนโทรปีของระบบ", unit: "\\text{J/K}" },
              { sym: "\\delta Q_{\\text{rev}}", desc: "ความร้อนที่ถ่ายเทผ่านเส้นทางผันกลับได้", unit: "\\text{J}" },
              { sym: "T", desc: "อุณหภูมิสัมบูรณ์ ณ ขอบเขตที่เกิดการถ่ายเท", unit: "\\text{K}" },
              { sym: "\\Delta S_{\\text{univ}}", desc: "การเปลี่ยนแปลงเอนโทรปีรวมของเอกภพ", unit: "\\text{J/K}" }
            ],
            derivationSteps: [
              "พิจารณาวัฏจักรคาร์โนต์ผันกลับได้: \\frac{Q_H}{T_H} = \\frac{Q_C}{T_C} \\implies \\frac{Q_H}{T_H} - \\frac{Q_C}{T_C} = 0",
              "เขียนในรูปอินทิกรัลรอบวัฏจักร: \\oint \\frac{\\delta Q_{\\text{rev}}}{T} = 0",
              "ตามหลักคณิตศาสตร์ อินทิกรัลรอบวงปิดของปริมาณใดๆ ที่เท่ากับศูนย์ ย่อมแสดงว่าปริมาณนั้นเป็นอนุพันธ์แท้ของ 'ฟังก์ชันสภาวะ' (State function)",
              "นิยามฟังก์ชันสภาวะใหม่นี้ว่า เอนโทรปี S: dS \\equiv \\frac{\\delta Q_{\\text{rev}}}{T}",
              "สำหรับการเปลี่ยนแปลงจากสภาวะเริ่มต้น i สู่สภาวะสุดท้าย f: \\Delta S = S_f - S_i = \\int_i^f \\frac{\\delta Q_{\\text{rev}}}{T}",
              "ในกระบวนการจริงที่ไม่ผันกลับได้ (Irreversible) ย่อมเกิดการสร้างเอนโทรปีภายใน (Entropy generation, S_gen > 0) ทำให้ \\Delta S_{\\text{univ}} > 0 เสมอ"
            ]
          },
          {
            name: "ฟังก์ชันการแจกแจงอัตราเร็วแมกซ์เวลล์-โบลต์ซมันน์",
            latex: "f(v) = 4\\pi \\left(\\frac{m}{2\\pi k_B T}\\right)^{3/2} v^2 \\exp\\left(-\\frac{m v^2}{2 k_B T}\\right)",
            symbols: [
              { sym: "f(v)", desc: "ฟังก์ชันความหนาแน่นความน่าจะเป็นของอัตราเร็ว", unit: "\\text{(m/s)}^{-1}" },
              { sym: "v", desc: "อัตราเร็วของโมเลกุลแก๊ส", unit: "\\text{m/s}" },
              { sym: "m", desc: "มวลของโมเลกุลเดี่ยว", unit: "\\text{kg}" },
              { sym: "k_B", desc: "ค่าคงตัวโบลต์ซมันน์", unit: "\\text{J/K}" },
              { sym: "T", desc: "อุณหภูมิสัมบูรณ์", unit: "\\text{K}" }
            ],
            derivationSteps: [
              "จากสถิติแบบแคนอนิคัล ความน่าจะเป็นที่โมเลกุลจะมีความเร็ว \\vec{v} แปรผันตรงกับตัวประกอบโบลต์ซมันน์: P(\\vec{v}) d^3v \\propto \\exp\\left(-\\frac{m v^2}{2 k_B T}\\right) dv_x dv_y dv_z",
              "แปลงพิกัดความเร็วแบบคาร์ทีเซียนสู่พิกัดทรงกลมในปริภูมิความเร็ว: d^3v = 4\\pi v^2 dv (เนื่องจากทิศทางสมมาตรแบบไอโซโทรปิก)",
              "นำตัวประกอบพื้นที่ทรงกลม 4\\pi v^2 คูณเข้ากับฟังก์ชันความน่าจะเป็น:",
              "f(v) dv = C \\cdot 4\\pi v^2 \\exp\\left(-\\frac{m v^2}{2 k_B T}\\right) dv",
              "หาค่าคงตัวการนอร์แมลไลซ์ C จากเงื่อนไข \\int_0^\\infty f(v) dv = 1",
              "ผลลัพธ์นำไปสู่: C = \\left(\\frac{m}{2\\pi k_B T}\\right)^{3/2}",
              "หาอัตราเร็วที่มีโอกาสพบสูงสุด (Most Probable Speed, v_p) โดยการหาอนุพันธ์ df/dv = 0 จะได้: v_p = \\sqrt{\\frac{2 k_B T}{m}}"
            ]
          }
        ],
        application: {
          text: "การกำหนดทิศทางของลูกศรแห่งเวลา (Arrow of Time) การวิเคราะห์ปฏิกิริยาเคมีและการกระตุ้นพลังงาน (Arrhenius Law) การแยกโมเลกุลไอระเหยในการกลั่นลำดับส่วน และการทำความเข้าใจความไร้ระเบียบในระบบสารสนเทศและการสื่อสาร (Information Entropy)",
          validWhen: "ระบบอยู่ในสมดุลความร้อนระดับมหภาค และจำนวนอนุภาค N มีขนาดใหญ่มาก (N >> 1) ตามเงื่อนไขของกฎจำนวนมากในกลศาสตร์สถิติ",
          invalidWhen: "ระบบที่มีอนุภาคจำนวนน้อยมาก (เกิด Fluctuations รุนแรง) หรือระบบที่อยู่นอกสมดุลความร้อนอย่างยิ่งยวด เช่น พลาสมาในพัลส์เลเซอร์ความเข้มสูง"
        },
        example: {
          problem: "ก้อนน้ำแข็งมวล m = 0.50 kg ที่อุณหภูมิ 0°C (273.15 K) หลอมเหลวกลายเป็นน้ำที่อุณหภูมิ 0°C ในห้องที่มีอุณหภูมิคงที่ 20°C (293.15 K) กำหนดให้ความร้อนแฝงจำเพาะของการหลอมเหลวของน้ำแข็ง L_f = 3.34 × 10⁵ J/kg จงหา: (ก) การเปลี่ยนแปลงเอนโทรปีของน้ำแข็ง (ข) การเปลี่ยนแปลงเอนโทรปีของห้อง (ค) การเปลี่ยนแปลงเอนโทรปีรวมของเอกภพ",
          steps: [
            "คำนวณความร้อนที่น้ำแข็งดูดกลืนเพื่อหลอมเหลว: Q = m L_f = (0.50 \\text{ kg})(3.34 \\times 10^5 \\text{ J/kg}) = 1.67 \\times 10^5 \\text{ J}",
            "คำนวณการเปลี่ยนแปลงเอนโทรปีของน้ำแข็ง (ระบบ) ที่ T_ice = 273.15 K: \\Delta S_{\\text{ice}} = \\frac{+Q}{T_{\\text{ice}}} = \\frac{+1.67 \\times 10^5}{273.15} \\approx +611.38 \\text{ J/K}",
            "คำนวณการเปลี่ยนแปลงเอนโทรปีของห้อง (สิ่งแวดล้อม) ซึ่งคายความร้อน Q ออกที่ T_room = 293.15 K: \\Delta S_{\\text{room}} = \\frac{-Q}{T_{\\text{room}}} = \\frac{-1.67 \\times 10^5}{293.15} \\approx -569.67 \\text{ J/K}",
            "คำนวณเอนโทรปีรวมของเอกภพ: \\Delta S_{\\text{universe}} = \\Delta S_{\\text{ice}} + \\Delta S_{\\text{room}} = +611.38 - 569.67 = +41.71 \\text{ J/K}",
            "สรุป: \\Delta S_{\\text{universe}} > 0 ยืนยันว่ากระบวนการหลอมเหลวนี้เกิดขึ้นได้เองตามธรรมชาติและเป็นกระบวนการที่ไม่ผันกลับได้ตามกฎข้อที่สอง"
          ],
          diagramSvg: '<svg viewBox="0 0 400 160" class="w-full h-40 bg-slate-900 rounded"><line x1="50" y1="140" x2="370" y2="140" stroke="#94a3b8" stroke-width="1.5"/><line x1="50" y1="140" x2="50" y2="20" stroke="#94a3b8" stroke-width="1.5"/><text x="360" y="155" fill="#94a3b8" font-size="11">v (m/s)</text><text x="35" y="30" fill="#94a3b8" font-size="11">f(v)</text><path d="M 50 140 C 90 140 100 40 140 40 C 180 40 220 130 350 140" stroke="#38bdf8" stroke-width="2.5" fill="#38bdf8" fill-opacity="0.15"/><line x1="130" y1="140" x2="130" y2="42" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4"/><line x1="150" y1="140" x2="150" y2="46" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4"/><line x1="170" y1="140" x2="170" y2="55" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4"/><text x="115" y="35" fill="#ef4444" font-size="10">v_p</text><text x="150" y="35" fill="#f59e0b" font-size="10">v_avg</text><text x="180" y="35" fill="#22c55e" font-size="10">v_rms</text><text x="240" y="50" fill="#e2e8f0" font-size="12" font-weight="bold">Maxwell-Boltzmann</text><text x="240" y="70" fill="#94a3b8" font-size="10">v_p &lt; v_avg &lt; v_rms</text><text x="210" y="155" fill="#60a5fa" font-size="11" text-anchor="middle">dS = dQ_rev/T | ΔS_univ ≥ 0</text></svg>',
          diagramCaption: "เส้นโค้งการแจกแจงอัตราเร็วแมกซ์เวลล์-โบลต์ซมันน์ แสดงตำแหน่งสัมพัทธ์ของ v_p, v_avg และ v_rms"
        },
        observations: [
          "เอนโทรปีของระบบย่อยหนึ่งๆ สามารถลดลงได้ (\\Delta S_{\\text{system}} < 0) เช่น น้ำแข็งก่อตัวในตู้เย็น แต่จะเกิดขึ้นได้ก็ต่อเมื่อเอนโทรปีของสิ่งแวดล้อมเพิ่มขึ้นมากกว่า ทำให้ผลรวม \\Delta S_{\\text{universe}} เป็นบวกเสมอ",
          "อัตราเร็วสามค่าสำคัญในสถิติแมกซ์เวลล์-โบลต์ซมันน์มีความสัมพันธ์: v_p : \\bar{v} : v_{\\text{rms}} = \\sqrt{2} : \\sqrt{8/\\pi} : \\sqrt{3} \\approx 1 : 1.128 : 1.225",
          "เมื่ออุณหภูมิสูงขึ้น ยอดกราฟ f(v) จะลดต่ำลงและผายกว้างขึ้นไปทางขวา แสดงว่าโมเลกุลมีสัดส่วนที่มีพลังงานจลน์สูงเพิ่มมากขึ้นอย่างมีนัยสำคัญ"
        ],
        citations: [
          { text: "Tong, D. (2012). Lectures on Statistical Physics, Chapter 1: Fundamentals of Statistical Mechanics & Chapter 2: Classical Gases. Cambridge University." },
          { text: "Moran, M. J., et al. (2018). Fundamentals of Engineering Thermodynamics (9th Ed.), Chapter 6: Using Entropy. Wiley." }
        ]
      }
    ],

    phenomena: [
  {
    "id": "PHE-CH05-01",
    "chapterId": "ch05",
    "division": "ภาคที่ 1: พื้นฐาน & กฎข้อที่ 1",
    "category": "วิศวกรรมยานยนต์และพลังงาน",
    "titleTh": "การจุดระเบิดด้วยการอัดแบบแอเดียแบติกในเครื่องยนต์ดีเซล",
    "titleEn": "Diesel Engine Compression Ignition & Adiabatic Heating",
    "observed": "เครื่องยนต์ดีเซลอาศัยหลักการอัดอากาศแบบแอเดียแบติกด้วยอัตราส่วนกำลังอัดสูงยิ่งยวด ทำให้อุณหภูมิอากาศในห้องเผาไหม้พุ่งสูงเกินจุดวาบไฟและติดไฟได้เองโดยไม่ต้องพึ่งพาหัวเทียน",
    "mechanism": "ในเครื่องยนต์ดีเซล ลูกสูบดูดเฉพาะอากาศบริสุทธิ์เข้าสู่กระบอกสูบ จากนั้นเคลื่อนที่ขึ้นบีบอัดอากาศอย่างรวดเร็วด้วยอัตราส่วนกำลังอัด r = V_max / V_min สูงถึง 16:1 ถึง 22:1 เนื่องจากกระบวนการอัดเกิดขึ้นในเสี้ยววินาที ความร้อนจึงแทบไม่สามารถถ่ายเทผ่านผนังกระบอกสูบออกสู่ภายนอกได้ทัน (Adiabatic, Q ≈ 0) ส่งผลให้งานกลจากการอัดถูกเปลี่ยนไปเป็นพลังงานภายในของอากาศทั้งหมด (ΔU = -W > 0) อุณหภูมิอากาศจึงพุ่งสูงเกิน 700°C ถึง 900°C และความดันสูงกว่า 40 bar เมื่อหัวฉีดพ่นละอองน้ำมันดีเซลเข้าไป น้ำมันจะระเหยและลุกไหม้ได้เองในทันที (Self-Ignition)",
    "scope": "อัตราส่วนกำลังอัด r = 16:1 ถึง 22:1, ความดันหลังการอัด 35 - 50 bar, อุณหภูมิหลังการอัด 700°C - 900°C สูงกว่าจุดวาบไฟน้ำมันดีเซล (~210°C)",
    "formulas": [
      {
        "latex": "T_2 = T_1 \\cdot \\left(\\frac{V_1}{V_2}\\right)^{\\gamma - 1} = T_1 \\cdot r^{\\gamma - 1}",
        "desc": "ความสัมพันธ์อุณหภูมิและอัตราส่วนกำลังอัดในกระบวนการแอเดียแบติกย้อนกลับได้"
      },
      {
        "latex": "P_1 V_1^\\gamma = P_2 V_2^\\gamma,\\quad \\Delta U = -W = n C_v (T_2 - T_1)",
        "desc": "กฎข้อที่หนึ่งของอุณหพลศาสตร์เมื่อไม่มีการถ่ายเทความร้อน (Q = 0)"
      }
    ],
    "variables": [
      {
        "symbol": "r",
        "name": "อัตราส่วนกำลังอัด (Compression Ratio)",
        "unit": "—",
        "typical": "16 - 22"
      },
      {
        "symbol": "\\gamma",
        "name": "ดัชนีแอเดียแบติกของอากาศ (C_p / C_v)",
        "unit": "—",
        "typical": "1.35 - 1.40"
      },
      {
        "symbol": "T_1, T_2",
        "name": "อุณหภูมิอากาศก่อนและหลังการอัด",
        "unit": "\\text{K}",
        "typical": "300 K → 1000 K"
      },
      {
        "symbol": "P_2",
        "name": "ความดันอากาศสูงสุดหลังการอัด",
        "unit": "\\text{bar}",
        "typical": "40 - 50 bar"
      }
    ],
    "citations": [
      {
        "title": "Internal Combustion Engine Fundamentals",
        "year": 1988,
        "authors": "Heywood, J. B.",
        "source": "McGraw-Hill, Ch. 1 & 9, pp. 1-41, 491-566",
        "verificationStatus": "verified_direct_content",
        "evidencePin": "Heywood (1988), pp. 491-505: ทฤษฎีการลุกไหม้ด้วยกำลังอัดและเทอร์โมไดนามิกส์กระบอกสูบ"
      }
    ],
    "svgDiagram": "<svg viewBox=\"0 0 500 240\" class=\"w-full h-56 bg-slate-900 rounded-lg\"><rect x=\"170\" y=\"30\" width=\"160\" height=\"160\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"4\" rx=\"4\"/><rect x=\"175\" y=\"60\" width=\"150\" height=\"60\" fill=\"#475569\" stroke=\"#94a3b8\" stroke-width=\"2\"/><rect x=\"175\" y=\"120\" width=\"150\" height=\"65\" fill=\"#ef4444\" fill-opacity=\"0.3\" stroke=\"none\"/><path d=\"M 250 120 L 250 200\" stroke=\"#94a3b8\" stroke-width=\"8\"/><circle cx=\"250\" cy=\"200\" r=\"8\" fill=\"#38bdf8\"/><polygon points=\"250,5 245,30 255,30\" fill=\"#f59e0b\" stroke=\"#b45309\"/><path d=\"M 247 30 L 240 55 M 253 30 L 260 55 M 250 30 L 250 58\" stroke=\"#ef4444\" stroke-width=\"2\" stroke-dasharray=\"2\"/><text x=\"250\" y=\"20\" fill=\"#f59e0b\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">หัวฉีดดีเซล (Fuel Injector)</text><text x=\"250\" y=\"95\" fill=\"#f8fafc\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">ลูกสูบเคลื่อนที่ขึ้น (อัดเร็ว)</text><text x=\"250\" y=\"150\" fill=\"#fca5a5\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">T &gt; 700°C | P &gt; 40 bar</text><text x=\"80\" y=\"90\" fill=\"#38bdf8\" font-size=\"12\" text-anchor=\"middle\">อัดแบบแอเดียแบติก</text><text x=\"80\" y=\"110\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">Q ≈ 0, ΔU = -W</text><text x=\"250\" y=\"230\" fill=\"#cbd5e1\" font-size=\"11\" text-anchor=\"middle\">หลักการจุดระเบิดด้วยการอัด (Compression Ignition) ในเครื่องยนต์ดีเซล</text></svg>",
    "imageCaption": "การจุดระเบิดในกระบอกสูบดีเซลด้วยอุณหภูมิการอัดแอเดียแบติกสูงยิ่งยวด"
  },
  {
    "id": "PHE-CH05-02",
    "chapterId": "ch05",
    "division": "ภาคที่ 2: วัฏจักร & กฎข้อที่ 2",
    "category": "วิศวกรรมปรับอากาศและพลังงาน",
    "titleTh": "ระบบทำความเย็นแบบอัดไอและปั๊มความร้อน",
    "titleEn": "Vapor-Compression Refrigeration Cycle & Heat Pump",
    "observed": "ตู้เย็นและเครื่องปรับอากาศสามารถดึงความร้อนจากพื้นที่อุณหภูมิต่ำ (ภายในห้อง/ตู้เย็น) ไประบายทิ้งยังสิ่งแวดล้อมที่มีอุณหภูมิสูงกว่าได้อย่างต่อเนื่อง โดยอาศัยงานกลจากคอมเพรสเซอร์",
    "mechanism": "สอดคล้องกับข้อความเคลวิน-พลังค์และเคลาซิอุสของกฎข้อที่สองของอุณหพลศาสตร์ ความร้อนไม่สามารถถ่ายเทจากแหล่งความเย็นไปยังแหล่งความร้อนได้เองโดยธรรมชาติ แต่สามารถทำได้หากมีงานภายนอก (W_in) เข้ามาขับเคลื่อน โดยสารทำความเย็นจะระเหยรับความร้อนที่ความดันต่ำในคอยล์เย็น (Evaporator) ถูกคอมเพรสเซอร์อัดเป็นไอความดันสูงอุณหภูมิสูง ไประบายความร้อนควบแน่นที่คอยล์ร้อน (Condenser) แล้วลดความดันผ่านวาล์วขยายตัว",
    "scope": "สัมประสิทธิ์สมรรถนะ COP_R = Q_L / W_in โดยทั่วไปอยู่ในช่วง 2.5 - 4.5 สำหรับเครื่องปรับอากาศในบ้าน",
    "formulas": [
      {
        "latex": "\\text{COP}_R = \\frac{Q_L}{W_{\\text{in}}} = \\frac{h_1 - h_4}{h_2 - h_1},\\quad \\text{COP}_{\\text{Carnot}} = \\frac{T_L}{T_H - T_L}",
        "desc": "สัมประสิทธิ์สมรรถนะของตู้เย็นและขีดจำกัดสูงสุดตามวัฏจักรคาร์โนต์ย้อนกลับ"
      }
    ],
    "variables": [
      {
        "symbol": "Q_L",
        "name": "ปริมาณความร้อนที่ดึงออกจากบริเวณทำความเย็น",
        "unit": "\\text{kJ/kg}",
        "typical": "150 - 200 kJ/kg"
      },
      {
        "symbol": "W_{\\text{in}}",
        "name": "งานกลสุทธิที่คอมเพรสเซอร์ป้อนเข้าสู่วัฏจักร",
        "unit": "\\text{kJ/kg}",
        "typical": "30 - 60 kJ/kg"
      },
      {
        "symbol": "T_L, T_H",
        "name": "อุณหภูมิคอยล์เย็นและคอยล์ร้อนสัมบูรณ์",
        "unit": "\\text{K}",
        "typical": "270 K, 315 K"
      }
    ],
    "citations": [
      {
        "title": "Thermodynamics: An Engineering Approach",
        "year": 2019,
        "authors": "Cengel, Y. A., & Boles, M. A.",
        "source": "McGraw-Hill (9th Ed.), Chapter 11: Refrigeration Cycles, pp. 607-640",
        "verificationStatus": "verified_direct_content",
        "evidencePin": "Cengel & Boles (2019), pp. 609-620: วัฏจักรการทำความเย็นแบบอัดไอมาตรฐาน"
      }
    ],
    "svgDiagram": "<svg viewBox=\"0 0 500 240\" class=\"w-full h-56 bg-slate-900 rounded-lg\"><rect width=\"500\" height=\"240\" fill=\"#0F172A\"/><rect x=\"60\" y=\"30\" width=\"100\" height=\"50\" fill=\"#ef4444\" fill-opacity=\"0.3\" stroke=\"#ef4444\" stroke-width=\"2\" rx=\"4\"/><text x=\"110\" y=\"60\" fill=\"#fca5a5\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">Condenser</text><rect x=\"340\" y=\"30\" width=\"100\" height=\"50\" fill=\"#334155\" stroke=\"#94a3b8\" stroke-width=\"2\" rx=\"4\"/><text x=\"390\" y=\"60\" fill=\"#f8fafc\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">Compressor</text><rect x=\"60\" y=\"150\" width=\"100\" height=\"50\" fill=\"#f59e0b\" fill-opacity=\"0.3\" stroke=\"#f59e0b\" stroke-width=\"2\" rx=\"4\"/><text x=\"110\" y=\"180\" fill=\"#fde68a\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">Expansion Valve</text><rect x=\"340\" y=\"150\" width=\"100\" height=\"50\" fill=\"#0284c7\" fill-opacity=\"0.3\" stroke=\"#38bdf8\" stroke-width=\"2\" rx=\"4\"/><text x=\"390\" y=\"180\" fill=\"#bae6fd\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">Evaporator</text><path d=\"M 390 80 L 390 150\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-dasharray=\"3\"/><path d=\"M 160 55 L 340 55\" stroke=\"#ef4444\" stroke-width=\"2\"/><path d=\"M 110 80 L 110 150\" stroke=\"#f59e0b\" stroke-width=\"2\"/><path d=\"M 340 175 L 160 175\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"250\" y=\"230\" fill=\"#cbd5e1\" font-size=\"11\" text-anchor=\"middle\">วัฏจักรทำความเย็นแบบอัดไอ (Vapor-Compression Refrigeration)</text></svg>",
    "imageCaption": "แผนผังวัฏจักรการทำความเย็นและปั๊มความร้อนแบบอัดไอ 4 อุปกรณ์หลัก"
  },
  {
    "id": "PHE-CH05-03",
    "chapterId": "ch05",
    "division": "ภาคที่ 1: พื้นฐาน & กฎข้อที่ 1",
    "category": "อุตุนิยมวิทยาและฟิสิกส์บรรยากาศ",
    "titleTh": "อัตราการลดลงของอุณหภูมิตามระดับความสูงในบรรยากาศและลมเฟิน",
    "titleEn": "Atmospheric Lapse Rate & Foehn Wind Effect",
    "observed": "เมื่อขึ้นสู่ยอดเขาสูง อากาศจะเย็นลงเฉลี่ย 9.8°C ต่อทุกๆ 1 กิโลเมตรในอากาศแห้ง และเมื่อมวลอากาศชื้นพัดข้ามแนวเทือกเขา อากาศที่พัดลงอีกฝั่งจะกลายเป็นลมร้อนและแห้งแล้งอย่างรวดเร็ว (ลมเฟิน/ลมชินุก)",
    "mechanism": "เมื่อมวลอากาศลอยสูงขึ้น ความดันบรรยากาศภายนอกจะลดลงตามระดับความสูง มวลอากาศจึงขยายตัวดันสิ่งแวดล้อม การขยายตัวเกิดขึ้นเร็วโดยแทบไม่มีการแลกเปลี่ยนความร้อนกับมวลอากาศข้างเคียง (Adiabatic Expansion) ส่งผลให้อุณหภูมิดิ่งลงตาม Dry Adiabatic Lapse Rate (DALR, Γ_d = g/C_p ≈ 9.8 K/km) แต่เมื่อไอน้ำควบแน่นเป็นเมฆ ความร้อนแฝงจะถูกปล่อยออกมา ชะลออัตราการลดอุณหภูมิลงเหลือ ~5 K/km (MALR) เมื่อฝนตกหมดแล้วข้ามสันเขา มวลอากาศแห้งจะจมตัวลงและถูกบีบอัดด้วยอัตรา DALR ทำให้อุณหภูมิที่ตีนเขาฝั่งปลายลมพุ่งสูงขึ้นกว่าฝั่งต้นลม",
    "scope": "DALR = 9.8 K/km (อากาศแห้ง), MALR = 4 - 7 K/km (อากาศอิ่มตัวไอน้ำ)",
    "formulas": [
      {
        "latex": "\\Gamma_d = -\\frac{dT}{dz} = \\frac{g}{C_p} \\approx 9.8\\text{ K/km}",
        "desc": "อัตราลดอุณหภูมิแบบแอเดียแบติกแห้งในบรรยากาศภายใต้สมดุลไฮโดรสแตติก"
      }
    ],
    "variables": [
      {
        "symbol": "g",
        "name": "ความเร่งโน้มถ่วงของโลก",
        "unit": "\\text{m/s}^2",
        "typical": "9.81 m/s²"
      },
      {
        "symbol": "C_p",
        "name": "ความจุความร้อนจำเพาะของอากาศที่ความดันคงที่",
        "unit": "\\text{J/(kg\\cdot K)}",
        "typical": "1005 J/(kg·K)"
      },
      {
        "symbol": "z",
        "name": "ระดับความสูงเหนือระดับน้ำทะเล",
        "unit": "\\text{m}",
        "typical": "0 - 10,000 m"
      }
    ],
    "citations": [
      {
        "title": "Atmospheric Science: An Introductory Survey",
        "year": 2006,
        "authors": "Wallace, J. M., & Hobbs, P. V.",
        "source": "Academic Press (2nd Ed.), Chapter 3: Atmospheric Thermodynamics, pp. 63-108",
        "verificationStatus": "verified_direct_content",
        "evidencePin": "Wallace & Hobbs (2006), pp. 75-82: การอนุพัทธ์อัตราลดอุณหภูมิแอเดียแบติกแห้งและชื้น"
      }
    ],
    "svgDiagram": "<svg viewBox=\"0 0 500 240\" class=\"w-full h-56 bg-slate-900 rounded-lg\"><path d=\"M 40 200 L 220 50 L 320 50 L 460 200 Z\" fill=\"#334155\" stroke=\"#64748b\" stroke-width=\"2\"/><path d=\"M 50 180 Q 150 170 200 60\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"3\"/><text x=\"90\" y=\"140\" fill=\"#38bdf8\" font-size=\"11\">อากาศชื้นลอยตัว (MALR ~5 K/km)</text><path d=\"M 320 60 Q 360 140 440 180\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"3\"/><text x=\"350\" y=\"140\" fill=\"#fca5a5\" font-size=\"11\">ลมเฟินร้อนแห้ง (DALR ~9.8 K/km)</text><text x=\"250\" y=\"230\" fill=\"#cbd5e1\" font-size=\"11\" text-anchor=\"middle\">การเกิดลมเฟิน (Foehn Effect) จากกระบวนการแอเดียแบติกข้ามเทือกเขา</text></svg>",
    "imageCaption": "การยกตัวและจมตัวของมวลอากาศข้ามแนวเขาและการเกิดลมเฟิน"
  },
  {
    "id": "PHE-CH05-04",
    "chapterId": "ch05",
    "division": "ภาคที่ 2: วัฏจักร & กฎข้อที่ 2",
    "category": "ฟิสิกส์อุณหภูมิต่ำยิ่งยวด (Cryogenics)",
    "titleTh": "การผลิตก๊าซเหลวอุณหภูมิต่ำยิ่งยวดด้วยกระบวนการลินเดอและปรากฏการณ์จูล-ทอมสัน",
    "titleEn": "Cryogenic Gas Liquefaction & Joule-Thomson Effect",
    "observed": "การเปลี่ยนก๊าซจริงให้กลายเป็นของเหลวอุณหภูมิต่ำยิ่งยวด (ไนโตรเจนเหลว ออกซิเจนเหลว) โดยการขยายตัวผ่านวาล์วหรี่ต่ำกว่าอุณหภูมิผกผัน (Inversion Temperature) ในวัฏจักรลินเดอ",
    "mechanism": "สำหรับแก๊สจริงซึ่งมีแรงดึงดูดระหว่างโมเลกุลแบบแวนเดอร์วาลส์ เมื่อแก๊สขยายตัวผ่านรูพรุนหรือวาล์วหรี่ (Throttling, H = คงที่) โดยไม่มีการถ่ายเทความร้อน โมเลกุลจะต้องสูญเสียพลังงานจลน์เพื่อเอาชนะแรงดึงดูดระหว่างกัน ส่งผลให้อุณหภูมิของแก๊สลดลง ปรากฏการณ์นี้เรียกว่า ปรากฏการณ์จูล-ทอมสัน (Joule-Thomson Effect) โดยสัมประสิทธิ์ μ_JT = (∂T/∂P)_H จะมีค่าเป็นบวก (แก๊สเย็นตัวเมื่อลดความดัน) เมื่ออุณหภูมิเริ่มต้นต่ำกว่าอุณหภูมิผกผัน (T_inv)",
    "scope": "จุดเดือดไนโตรเจนเหลว -195.8°C (77.4 K), Max T_inv ของไนโตรเจน = 621 K (348°C), ความดันใช้งานในกระบวนการลินเดอ 150 - 200 bar",
    "formulas": [
      {
        "latex": "\\mu_{\\text{JT}} = \\left(\\frac{\\partial T}{\\partial P}\\right)_H = \\frac{1}{C_p}\\left[ T\\left(\\frac{\\partial V}{\\partial T}\\right)_P - V \\right]",
        "desc": "สัมประสิทธิ์จูล-ทอมสันสำหรับการขยายตัวแบบไอแซนแธลปิกของแก๊สจริง"
      }
    ],
    "variables": [
      {
        "symbol": "\\mu_{\\text{JT}}",
        "name": "สัมประสิทธิ์จูล-ทอมสัน (Joule-Thomson Coefficient)",
        "unit": "\\text{K/bar}",
        "typical": "> 0 (ทำความเย็น)"
      },
      {
        "symbol": "H",
        "name": "เอนทัลปีของระบบ (คงที่ระหว่างขยายตัวผ่านวาล์วหรี่)",
        "unit": "\\text{kJ/kg}",
        "typical": "\\Delta H = 0"
      },
      {
        "symbol": "T_{\\text{inv}}",
        "name": "อุณหภูมิผกผันสูงสุดของแก๊ส",
        "unit": "\\text{K}",
        "typical": "621 K (N₂), 51 K (He)"
      }
    ],
    "citations": [
      {
        "title": "Cryogenic Systems",
        "year": 1985,
        "authors": "Barron, R. F.",
        "source": "Oxford University Press (2nd Ed.), Chapter 3: Gas-Liquefaction Systems, pp. 63-88",
        "verificationStatus": "verified_direct_content",
        "evidencePin": "Barron (1985), pp. 63-75: ระบบลินเดอ-แฮมป์สันและการคำนวณสัดส่วนของเหลวควบแน่น"
      }
    ],
    "svgDiagram": "<svg viewBox=\"0 0 500 240\" class=\"w-full h-56 bg-slate-900 rounded-lg\"><rect x=\"40\" y=\"30\" width=\"90\" height=\"50\" fill=\"#334155\" stroke=\"#94a3b8\" stroke-width=\"2\" rx=\"4\"/><text x=\"85\" y=\"55\" fill=\"#f8fafc\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">Compressor</text><text x=\"85\" y=\"70\" fill=\"#cbd5e1\" font-size=\"9\" text-anchor=\"middle\">P = 200 bar</text><rect x=\"170\" y=\"30\" width=\"80\" height=\"50\" fill=\"#ef4444\" fill-opacity=\"0.3\" stroke=\"#ef4444\" stroke-width=\"2\" rx=\"4\"/><text x=\"210\" y=\"60\" fill=\"#fca5a5\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">Aftercooler</text><rect x=\"290\" y=\"30\" width=\"100\" height=\"120\" fill=\"#1e293b\" stroke=\"#38bdf8\" stroke-width=\"2\" stroke-dasharray=\"3\" rx=\"4\"/><text x=\"340\" y=\"50\" fill=\"#38bdf8\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Counter-flow HX</text><path d=\"M 340 70 L 340 130\" stroke=\"#38bdf8\" stroke-width=\"3\"/><polygon points=\"336,100 340,110 344,100\" fill=\"#38bdf8\"/><polygon points=\"410,135 430,130 430,140\" fill=\"#fbbf24\" stroke=\"#f59e0b\"/><text x=\"440\" y=\"125\" fill=\"#fbbf24\" font-size=\"10\" font-weight=\"bold\">วาล์วหรี่ J-T</text><rect x=\"390\" y=\"160\" width=\"80\" height=\"60\" fill=\"#0284c7\" fill-opacity=\"0.4\" stroke=\"#38bdf8\" stroke-width=\"2\" rx=\"4\"/><text x=\"430\" y=\"185\" fill=\"#bae6fd\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Liquid N₂</text><text x=\"430\" y=\"205\" fill=\"#ffffff\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">-196°C</text><text x=\"250\" y=\"230\" fill=\"#cbd5e1\" font-size=\"11\" text-anchor=\"middle\">กระบวนการลินเดอผลิตก๊าซเหลวด้วยปรากฏการณ์จูล-ทอมสัน (Joule-Thomson Cryogenics)</text></svg>",
    "imageCaption": "กระบวนการลินเดอผลิตไนโตรเจนเหลวอุณหภูมิต่ำยิ่งยวด (-196°C)"
  }
]
  };
}));
