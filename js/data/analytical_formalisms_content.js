/**
 * analytical_formalisms_content.js - Advanced Analytical Mechanics Formalisms
 * Covers: Principle of Stationary Action, Lagrangian, Euler-Lagrange,
 * Noether's Theorem, Hamiltonian, Phase Space, and Poisson Brackets.
 * Academic References: David Morin (2008) Ch. 6, 15; David Tong (2004) Ch. 1-2;
 * Goldstein, Poole & Safko (2002) Classical Mechanics 3rd ed.
 */

(function () {
  'use strict';

  const AnalyticalFormalismsContent = {
    meta: {
      titleTh: "กลศาสตร์วิเคราะห์ขั้นสูง (Advanced Analytical Mechanics Formalisms)",
      subtitleTh: "การเปลี่ยนกระบวนทัศน์จากเวกเตอร์แรงสู่วิธีการแปรผัน ลากรานเจียน ฮามิลโทเนียน และสเปซเฟส",
      description: "รากฐานเชิงทฤษฎีระดับมหาวิทยาลัยขั้นสูงและฟิสิกส์ทฤษฎี ที่เชื่อมโยงกลศาสตร์คลาสสิกเข้าสู่ทฤษฎีสนามควอนตัมและทฤษฎีสัมพัทธภาพ"
    },

    comparisonTable: {
      headers: ["มิติเปรียบเทียบ", "กลศาสตร์นิวตัน (Newtonian)", "กลศาสตร์ลากรานจ์ (Lagrangian)", "กลศาสตร์ฮามิลตัน (Hamiltonian)"],
      rows: [
        {
          aspect: "ตัวแปรพื้นฐาน",
          newton: "เวกเตอร์ตำแหน่งและแรง $\\mathbf{r}, \\mathbf{F}$",
          lagrange: "พิกัดและอัตราเร็ววางนัยทั่วไป $q_i, \\dot{q}_i$",
          hamilton: "พิกัดและโมเมนตัมสังยุค $q_i, p_i$"
        },
        {
          aspect: "ฟังก์ชันสเกลาร์หลัก",
          newton: "ไม่มี (ใช้เวกเตอร์แรง)",
          lagrange: "ลากรานเจียน $\\mathcal{L} = T - V$",
          hamilton: "ฮามิลโทเนียน $\\mathcal{H} = \\sum p_i \\dot{q}_i - \\mathcal{L}$"
        },
        {
          aspect: "รูปทรงเรขาคณิต",
          newton: "ปริภูมิแบบยุคลิด 3 มิติ ($\\mathbb{R}^3$)",
          lagrange: "แมนิโฟลด์โครงแบบและแทนเจนต์บันเดิล ($TQ$)",
          hamilton: "สเปซเฟสซิมเพล็กติก $2N$ มิติ ($T^*Q$)"
        },
        {
          aspect: "สมการการเคลื่อนที่",
          newton: "$N$ สมการอนุพันธ์อันดับ 2: $\\mathbf{F} = m\\ddot{\\mathbf{r}}$",
          lagrange: "$N$ สมการอนุพันธ์อันดับ 2: $\\frac{d}{dt}\\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i} - \\frac{\\partial \\mathcal{L}}{\\partial q_i} = 0$",
          hamilton: "$2N$ สมการอนุพันธ์อันดับ 1: $\\dot{q}_i = \\frac{\\partial \\mathcal{H}}{\\partial p_i}, \\, \\dot{p}_i = -\\frac{\\partial \\mathcal{H}}{\\partial q_i}$"
        },
        {
          aspect: "การจัดการแรงยึดเหนี่ยว (Constraints)",
          newton: "ต้องคำนวณแรงปฏิกิริยาและแรงยึดเหนี่ยวทุกจุด",
          lagrange: "กำจัดแรงยึดเหนี่ยวอัตโนมัติด้วยพิกัดวางนัยทั่วไป",
          hamilton: "กำจัดแรงยึดเหนี่ยวสมบูรณ์และศึกษาการแปลงคาโนนิคัล"
        },
        {
          aspect: "สะพานเชื่อมสู่ฟิสิกส์สมัยใหม่",
          newton: "จำกัดเฉพาะของไหลและวิศวกรรมคลาสสิก",
          lagrange: "Feynman Path Integral, ทฤษฎีสนามควอนตัม (QFT)",
          hamilton: "กลศาสตร์ควอนตัม (Schrödinger/Heisenberg), กลศาสตร์สถิติ"
        }
      ]
    },

    topics: [
      {
        id: "AF-01",
        numeral: "1",
        titleTh: "หลักการกระทำนิ่งและแคลคูลัสของการแปรผัน (Hamilton's Principle of Stationary Action)",
        titleEn: "Principle of Stationary Action & Variational Calculus",
        badge: "รากฐานลึกซึ้งที่สุดของฟิสิกส์",
        coreConcept: "ในบรรดาเส้นทางที่เป็นไปได้ทั้งหมดที่อนุภาคสามารถเคลื่อนที่จากจุดเริ่มต้น $(q_1, t_1)$ ไปยังจุดปลาย $(q_2, t_2)$ ธรรมชาติจะเลือกเส้นทางจริงที่ทำให้ 'ฟังก์ชันนัลของการกระทำ' (Action Functional $S$) มีค่านิ่ง (Stationary Value) นั่นคือ การแปรผันอันดับที่หนึ่งเป็นศูนย์ ($\\delta S = 0$)",
        displayFormula: "S[\\mathbf{q}(t)] = \\int_{t_1}^{t_2} \\mathcal{L}(\\mathbf{q}, \\dot{\\mathbf{q}}, t) \\, dt, \\quad \\delta S = 0",
        derivation: [
          "1. กำหนดให้ $q(t)$ เป็นเส้นทางจริง และพิจารณาเส้นทางแปรผัน $q(t) + \\alpha \\eta(t)$ โดยที่ $\\eta(t_1) = \\eta(t_2) = 0$ (จุดตรึงปลายทั้งสองข้าง)",
          "2. หาการแปรผันของแอ็กชัน: $\\delta S = \\int_{t_1}^{t_2} \\left( \\frac{\\partial \\mathcal{L}}{\\partial q} \\delta q + \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}} \\delta \\dot{q} \\right) dt$",
          "3. สังเกตว่า $\\delta \\dot{q} = \\frac{d}{dt}(\\delta q)$ จึงสามารถอินทิเกรตทีละส่วน (Integration by parts) ในพจน์ที่สองได้:",
          "   $$\\int_{t_1}^{t_2} \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}} \\frac{d}{dt}(\\delta q) \\, dt = \\left[ \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}} \\delta q \\right]_{t_1}^{t_2} - \\int_{t_1}^{t_2} \\frac{d}{dt}\\left( \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}} \\right) \\delta q \\, dt$$",
          "4. เนื่องจากจุดปลายถูกตรึง $\\delta q(t_1) = \\delta q(t_2) = 0$ พจน์ขอบจึงสลายตัวเป็นศูนย์:",
          "   $$\\delta S = \\int_{t_1}^{t_2} \\left[ \\frac{\\partial \\mathcal{L}}{\\partial q} - \\frac{d}{dt}\\left( \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}} \\right) \\right] \\delta q(t) \\, dt = 0$$",
          "5. เพื่อให้ $\\delta S = 0$ สำหรับทุกการแปรผันอิสระ $\\delta q(t)$ ใดๆ ตาม Fundamental Lemma of Calculus of Variations นิพจน์ภายในวงเล็บต้องเป็นศูนย์อย่างสัมบูรณ์ตลอดเส้นทาง เกิดเป็นสมการออยเลอร์-ลากรานจ์"
        ],
        takeaways: [
          "วิถีโค้งพาราโบลาของโปรเจกไทล์คือเส้นทางที่ปรับสมดุลระหว่างพลังงานจลน์เฉลี่ยและพลังงานศักย์เฉลี่ยจนแอ็กชัน $S$ ต่ำสุด",
          "หลักการนี้ไม่ขึ้นกับระบบพิกัด สามารถใช้ได้ในพิกัดเชิงขั้ว ทรงกระบอก ทรงกลม หรือปริภูมิโค้งของสัมพัทธภาพทั่วไป"
        ]
      },
      {
        id: "AF-02",
        numeral: "2",
        titleTh: "สมการออยเลอร์-ลากรานจ์และแรงไม่อนุรักษ์ (Euler-Lagrange Equations & Dissipation)",
        titleEn: "Euler-Lagrange Formalism with Generalized Forces",
        badge: "การแก้โจทย์กลศาสตร์โดยไม่ต้องเขียนเวกเตอร์แรง",
        coreConcept: "การใช้ลากรานเจียน $\\mathcal{L} = T - V$ ช่วยแปลงปัญหาการเคลื่อนที่ในระบบพิกัดใดๆ ให้เหลือเพียงการหาอนุพันธ์ย่อย โดยสามารถผนวกแรงไม่อนุรักษ์ภายนอก เช่น แรงต้านอากาศ ผ่านทางฟังก์ชันการสูญสลายเรย์ลี (Rayleigh Dissipation Function $\\mathcal{R}$)",
        displayFormula: "\\frac{d}{dt}\\left( \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i} \\right) - \\frac{\\partial \\mathcal{L}}{\\partial q_i} = Q_i^{\\text{nc}} = -\\frac{\\partial \\mathcal{R}}{\\partial \\dot{q}_i}",
        derivation: [
          "1. พลังงานจลน์ของวัตถุ 2 มิติ: $T = \\frac{1}{2}m(\\dot{x}^2 + \\dot{y}^2)$",
          "2. พลังงานศักย์โน้มถ่วงสม่ำเสมอ: $V = mgy$",
          "3. ลากรานเจียนของระบบโปรเจกไทล์: $\\mathcal{L} = T - V = \\frac{1}{2}m(\\dot{x}^2 + \\dot{y}^2) - mgy$",
          "4. กรณีสุญญากาศ (ไม่มีแรงต้าน):",
          "   - พิกัด $x$: $\\frac{\\partial \\mathcal{L}}{\\partial x} = 0$, $\\frac{\\partial \\mathcal{L}}{\\partial \\dot{x}} = m\\dot{x} \\implies \\frac{d}{dt}(m\\dot{x}) = 0 \\implies m\\ddot{x} = 0$",
          "   - พิกัด $y$: $\\frac{\\partial \\mathcal{L}}{\\partial y} = -mg$, $\\frac{\\partial \\mathcal{L}}{\\partial \\dot{y}} = m\\dot{y} \\implies \\frac{d}{dt}(m\\dot{y}) - (-mg) = 0 \\implies m\\ddot{y} = -mg$",
          "5. กรณีมีแรงต้านอากาศกำลังสอง $F_d = -c v \\mathbf{v}$:",
          "   - ฟังก์ชันสูญสลายเรย์ลี: $\\mathcal{R} = \\frac{1}{3}c (\\dot{x}^2 + \\dot{y}^2)^{3/2} = \\frac{1}{3}c v^3$",
          "   - แรงวางนัยทั่วไปไม่อนุรักษ์: $Q_x^{\\text{nc}} = -\\frac{\\partial \\mathcal{R}}{\\partial \\dot{x}} = -c v \\dot{x}$ และ $Q_y^{\\text{nc}} = -c v \\dot{y}$",
          "   - สมการการเคลื่อนที่ลากรานจ์พร้อมแรงต้าน: $m\\ddot{x} = -c v \\dot{x}$ และ $m\\ddot{y} = -mg - c v \\dot{y}$ ซึ่งตรงกับสมการนิวตันทุกประการ"
        ],
        takeaways: [
          "พิกัดวัฏจักร (Cyclic Coordinate): เนื่องจาก $\\mathcal{L}$ ไม่มีพจน์ $x$ ปรากฏโดยตรง ($\\frac{\\partial \\mathcal{L}}{\\partial x} = 0$) ดังนั้นโมเมนตัมวางนัยทั่วไป $p_x = \\frac{\\partial \\mathcal{L}}{\\partial \\dot{x}}$ จะเป็นค่าคงที่ในสุญญากาศเสมอ",
          "ช่วยลดความซับซ้อนในการคำนวณระบบที่ติดเงื่อนไขการเคลื่อนที่ เช่น ลูกตุ้มคู่ ล้อกลิ้งโดยไม่ไถล หรือแขนหุ่นยนต์หลายข้อต่อ"
        ]
      },
      {
        id: "AF-03",
        numeral: "3",
        titleTh: "ทฤษฎีบทของเนอเทอร์: สมมาตรสู่กฎการอนุรักษ์ (Noether's Theorem)",
        titleEn: "Noether's Theorem: Symmetries & Conservation Laws",
        badge: "ความงามทางคณิตศาสตร์สูงสุดของฟิสิกส์",
        coreConcept: "เอ็มมี เนอเทอร์ (Emmy Noether, ค.ศ. 1918) พิสูจน์ว่า 'ทุกๆ สมมาตรต่อเนื่องแบบหาอนุพันธ์ได้ของฟังก์ชันนัลแอ็กชัน จะนำไปสู่ปริมาณที่อนุรักษ์ (ค่าคงตัวของการเคลื่อนที่) หนึ่งค่าเสมอ' กฎการอนุรักษ์พลังงาน โมเมนตัม และโมเมนตัมเชิงมุม ไม่ใช่กฎลอยๆ แต่เกิดจากสมมาตรของกาล-อวกาศ (Spacetime Symmetries)",
        displayFormula: "\\sum_i \\left[ \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i} \\delta q_i \\right] - \\mathcal{H} \\, \\delta t = \\text{const}",
        derivation: [
          "1. สมมาตรการเลื่อนตำแหน่งในเวลา (Time Translation Symmetry, $t \\to t + \\epsilon$):",
          "   - ถ้าลากรานเจียนไม่ขึ้นกับเวลาชัดแจ้ง ($\\frac{\\partial \\mathcal{L}}{\\partial t} = 0$):",
          "   - $\\frac{d\\mathcal{L}}{dt} = \\sum_i \\left( \\frac{\\partial \\mathcal{L}}{\\partial q_i}\\dot{q}_i + \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i}\\ddot{q}_i \\right) = \\sum_i \\left( \\frac{d}{dt}\\left(\\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i}\\right)\\dot{q}_i + \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i}\\ddot{q}_i \\right) = \\frac{d}{dt}\\left( \\sum_i \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i} \\dot{q}_i \\right)$",
          "   - จัดรูปใหม่: $\\frac{d}{dt}\\left( \\sum_i p_i \\dot{q}_i - \\mathcal{L} \\right) = 0 \\implies \\mathcal{H} = E = \\text{const}$ (อนุรักษ์พลังงานกลรวม!)",
          "2. สมมาตรการเลื่อนตำแหน่งในอวกาศ (Spatial Translation Symmetry, $q_k \\to q_k + \\epsilon$):",
          "   - ความเป็นเอกภาพของอวกาศ (Homogeneity of space) $\\implies \\frac{\\partial \\mathcal{L}}{\\partial q_k} = 0$",
          "   - จากสมการออยเลอร์-ลากรานจ์: $\\frac{d}{dt}\\left( \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_k} \\right) = 0 \\implies p_k = \\text{const}$ (อนุรักษ์โมเมนตัมเชิงเส้น!)",
          "3. สมมาตรการหมุนในอวกาศ (Rotational Isotropy, $\\theta \\to \\theta + \\epsilon$):",
          "   - ความไม่แปรเปลี่ยนต่อการหมุน $\\implies \\frac{\\partial \\mathcal{L}}{\\partial \\theta} = 0 \\implies p_\\theta = L_z = \\text{const}$ (อนุรักษ์โมเมนตัมเชิงมุม!)"
        ],
        takeaways: [
          "การอนุรักษ์พลังงานไม่ใช่เรื่องบังเอิญ แต่เป็นผลโดยตรงจากการที่กฎฟิสิกส์วันนี้เหมือนกับกฎฟิสิกส์เมื่อวานและวันพรุ่งนี้",
          "ในโปรเจกไทล์ที่มีแรงต้านอากาศ พลังงานไม่คงตัวเพราะแรงต้านทำลายสมมาตรการย้อนกลับของเวลา (Time-reversal symmetry breaking)"
        ]
      },
      {
        id: "AF-04",
        numeral: "4",
        titleTh: "กลศาสตร์ฮามิลตันและการแปลงเลอฌ็องดร์ (Hamiltonian Mechanics & Legendre Transform)",
        titleEn: "Hamiltonian Formalism & Canonical Equations",
        badge: "สมการอนุพันธ์อันดับ 1 ที่สมมาตรที่สุด",
        coreConcept: "กลศาสตร์ฮามิลตันเปลี่ยนตัวแปรอิสระจาก $(q, \\dot{q})$ ในปริภูมิแทนเจนต์ ไปเป็น $(q, p)$ ในสเปซเฟส โดยใช้การแปลงเลอฌ็องดร์ (Legendre Transformation) ทำให้สมการอนุพันธ์อันดับ 2 จำนวน $N$ สมการ กลายเป็นสมการอนุพันธ์อันดับ 1 จำนวน $2N$ สมการที่มีความสมมาตรทางคณิตศาสตร์อย่างยิ่ง",
        displayFormula: "\\mathcal{H}(\\mathbf{q}, \\mathbf{p}, t) = \\sum_{i=1}^N p_i \\dot{q}_i - \\mathcal{L}(\\mathbf{q}, \\dot{\\mathbf{q}}, t), \\quad \\dot{q}_i = \\frac{\\partial \\mathcal{H}}{\\partial p_i}, \\quad \\dot{p}_i = -\\frac{\\partial \\mathcal{H}}{\\partial q_i}",
        derivation: [
          "1. นิยามโมเมนตัมสังยุค (Canonical Conjugate Momentum): $p_i = \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i}$",
          "2. สำหรับโปรเจกไทล์ในสุญญากาศ: $p_x = m\\dot{x} \\implies \\dot{x} = \\frac{p_x}{m}$, และ $p_y = m\\dot{y} \\implies \\dot{y} = \\frac{p_y}{m}$",
          "3. แปลงเลอฌ็องดร์เพื่อสร้างฮามิลโทเนียน $\\mathcal{H}$:",
          "   $$\\mathcal{H} = p_x \\dot{x} + p_y \\dot{y} - \\left[ \\frac{1}{2}m(\\dot{x}^2 + \\dot{y}^2) - mgy \\right] = \\frac{p_x^2}{m} + \\frac{p_y^2}{m} - \\frac{p_x^2 + p_y^2}{2m} + mgy$$",
          "   $$\\mathcal{H}(x, y, p_x, p_y) = \\frac{p_x^2 + p_y^2}{2m} + mgy = T + V$$",
          "4. ตรวจสอบสมการคาโนนิคัลของฮามิลตัน (Hamilton's Canonical Equations):",
          "   - $\\dot{x} = \\frac{\\partial \\mathcal{H}}{\\partial p_x} = \\frac{p_x}{m}, \\quad \\dot{p}_x = -\\frac{\\partial \\mathcal{H}}{\\partial x} = 0 \\implies p_x = \\text{const}$",
          "   - $\\dot{y} = \\frac{\\partial \\mathcal{H}}{\\partial p_y} = \\frac{p_y}{m}, \\quad \\dot{p}_y = -\\frac{\\partial \\mathcal{H}}{\\partial y} = -mg \\implies p_y(t) = p_{0y} - mgt$"
        ],
        takeaways: [
          "สมการฮามิลตันมีโครงสร้างซิมเพล็กติก (Symplectic geometry) ซึ่งเป็นหัวใจสำคัญของการสร้างตัวจำลองเชิงตัวเลขแบบอนุรักษ์พลังงาน (Symplectic Integrators)",
          "ฮามิลโทเนียน $\\mathcal{H}$ เป็นตัวแทนของพลังงานรวมในระบบอิสระทางเวลาทุกชนิด และถูกนำไปเป็นตัวดำเนินการแฮมิลโทเนียน $\\hat{H}$ ในสมการชเรอดิงเงอร์ของกลศาสตร์ควอนตัม"
        ]
      },
      {
        id: "AF-05",
        numeral: "5",
        titleTh: "สเปซเฟส ทฤษฎีบทลียูวีลล์ และวงเล็บปัวซง (Phase Space, Liouville & Poisson Brackets)",
        titleEn: "Phase Space Flow, Liouville's Theorem & Poisson Brackets",
        badge: "สะพานเชื่อมสู่กลศาสตร์สถิติและกลศาสตร์ควอนตัม",
        coreConcept: "ในสเปซเฟส $2N$ มิติ สถานะของระบบคือจุดจุดเดียว $(\\mathbf{q}(t), \\mathbf{p}(t))$ การเคลื่อนที่ตามเวลาคือกระแสการไหลของของไหลในสเปซเฟส ทฤษฎีบทของลียูวีลล์ระบุว่าปริมาตรของสเปซเฟสจะไม่บีบอัดตัว (Incompressible flow) และวงเล็บปัวซง (Poisson Bracket) ทำหน้าที่บอกวิวัฒนาการตามเวลาของปริมาณทางกายภาพทุกชนิด",
        displayFormula: "\\{f, g\\} = \\sum_{i=1}^N \\left( \\frac{\\partial f}{\\partial q_i}\\frac{\\partial g}{\\partial p_i} - \\frac{\\partial f}{\\partial p_i}\\frac{\\partial g}{\\partial q_i} \\right), \\quad \\frac{df}{dt} = \\{f, \\mathcal{H}\\} + \\frac{\\partial f}{\\partial t}",
        derivation: [
          "1. อัตราการเปลี่ยนแปลงตามเวลาของฟังก์ชันสถานะใดๆ $f(q, p, t)$:",
          "   $$\\frac{df}{dt} = \\sum_i \\left( \\frac{\\partial f}{\\partial q_i}\\dot{q}_i + \\frac{\\partial f}{\\partial p_i}\\dot{p}_i \\right) + \\frac{\\partial f}{\\partial t}$$",
          "2. แทนสมการฮามิลตัน $\\dot{q}_i = \\frac{\\partial \\mathcal{H}}{\\partial p_i}$ และ $\\dot{p}_i = -\\frac{\\partial \\mathcal{H}}{\\partial q_i}$ ลงไป:",
          "   $$\\frac{df}{dt} = \\sum_i \\left( \\frac{\\partial f}{\\partial q_i}\\frac{\\partial \\mathcal{H}}{\\partial p_i} - \\frac{\\partial f}{\\partial p_i}\\frac{\\partial \\mathcal{H}}{\\partial q_i} \\right) + \\frac{\\partial f}{\\partial t} = \\{f, \\mathcal{H}\\} + \\frac{\\partial f}{\\partial t}$$",
          "3. วงเล็บปัวซงพื้นฐาน (Fundamental Poisson Brackets):",
          "   $$\\{q_i, q_j\\} = 0, \\quad \\{p_i, p_j\\} = 0, \\quad \\{q_i, p_j\\} = \\delta_{ij}$$",
          "4. ทฤษฎีบทลียูวีลล์ (Liouville's Incompressibility Theorem):",
          "   - สนามความเร็วในสเปซเฟส $\\mathbf{v}_{\\text{phase}} = (\\dot{\\mathbf{q}}, \\dot{\\mathbf{p}})$ มีไดเวอร์เจนซ์เป็นศูนย์:",
          "   $$\\nabla_{\\text{phase}} \\cdot \\mathbf{v}_{\\text{phase}} = \\sum_i \\left( \\frac{\\partial \\dot{q}_i}{\\partial q_i} + \\frac{\\partial \\dot{p}_i}{\\partial p_i} \\right) = \\sum_i \\left( \\frac{\\partial^2 \\mathcal{H}}{\\partial q_i \\partial p_i} - \\frac{\\partial^2 \\mathcal{H}}{\\partial p_i \\partial q_i} \\right) = 0$$",
          "5. การแปลงสู่ควอนตัม (Canonical Quantization): ปอล ดิแรก (Paul Dirac) ค้นพบว่าวงเล็บปัวซงคลาสสิกจะถูกแทนที่ด้วยคอมมิวเทเตอร์ควอนตัมโดยตรง:",
          "   $$\\{f, g\\} \\longrightarrow \\frac{1}{i\\hbar}[\\hat{f}, \\hat{g}] = \\frac{1}{i\\hbar}(\\hat{f}\\hat{g} - \\hat{g}\\hat{f})$$"
        ],
        takeaways: [
          "ถ้า ${f, \\mathcal{H}} = 0$ และ $f$ ไม่ขึ้นกับเวลาชัดแจ้ง แล้ว $f$ จะเป็นค่าคงที่ของการเคลื่อนที่ (Constant of Motion) ทันที",
          "วงเล็บปัวซงเป็นโครงสร้างพีชคณิตแบบลี (Lie Algebra) ที่รักษาความเป็นอิสระต่อระบบพิกัดและเป็นประตูสู่กลศาสตร์ควอนตัม"
        ]
      }
    ]
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticalFormalismsContent;
  } else {
    window.AnalyticalFormalismsContent = AnalyticalFormalismsContent;
  }
})();
