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
      titleTh: "กลศาสตร์วิเคราะห์ขั้นสูงและฟิสิกส์คณิตศาสตร์ (Analytical Mechanics & Mathematical Physics)",
      subtitleTh: "วิธีการแปรผัน ฮามิลโทเนียน กฎของเกาส์ในสสาร อนุกรมฟูเรียร์ และสมการฮามิลตัน-จาโคบี",
      description: "รากฐานเชิงทฤษฎีระดับมหาวิทยาลัยขั้นสูงและฟิสิกส์ทฤษฎี (Math of Physics 1, 2, 3) ที่เชื่อมโยงกลศาสตร์คลาสสิกเข้าสู่ทฤษฎีสนามแม่เหล็กไฟฟ้าและควอนตัม"
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
      },
{
    "id": "AF-06",
    "numeral": "6",
    "titleTh": "กฎของเกาส์สำหรับไฟฟ้าในตัวกลางและเวกเตอร์การกระจัด (Gauss's Law in Dielectric Matter)",
    "titleEn": "Rigorous Gauss's Law in Matter, Bound Charges & Displacement Field (\\nabla \\cdot \\mathbf{D} = \\rho_f)",
    "badge": "ฟิสิกส์คณิตศาสตร์ขั้นสูง: ทฤษฎีสนามคลาสสิก",
    "coreConcept": "เมื่อมีสสารไดอิเล็กทริกอยู่ สนามไฟฟ้า $\\mathbf{E}$ จะทำให้เกิดการโพลาไรซ์ระดับโมเลกุล เกิดความหนาแน่นโพลาไรเซชัน $\\mathbf{P}$ นำไปสู่การเกิดประจุผูกพัน (Bound Charges) $\\rho_b = -\\nabla \\cdot \\mathbf{P}$ กฎของเกาส์ในสุญญากาศ $\\varepsilon_0 \\nabla \\cdot \\mathbf{E} = \\rho = \\rho_f + \\rho_b$ จึงสามารถจัดรูปใหม่เป็นคณิตศาสตร์ล้วนๆ ได้เป็น $\\nabla \\cdot \\mathbf{D} = \\rho_f$ โดยที่ $\\mathbf{D} \\equiv \\varepsilon_0 \\mathbf{E} + \\mathbf{P}$ คือเวกเตอร์การกระจัดไฟฟ้า (Electric Displacement Field) ซึ่งขึ้นอยู่กับประจุอิสระ (Free Charges $\\rho_f$) เท่านั้น",
    "displayFormula": "\\nabla \\cdot \\mathbf{D} = \\rho_f \\iff \\oint_{\\partial V} \\mathbf{D} \\cdot d\\mathbf{A} = Q_{f,\\text{enc}}, \\quad \\mathbf{D} = \\varepsilon_0 \\mathbf{E} + \\mathbf{P} = \\hat{\\boldsymbol{\\varepsilon}} \\mathbf{E}",
    "derivation": [
      "1. นิยามไดโพลโมเมนต์ไฟฟ้าสุทธิต่อหน่วยปริมาตร: $\\mathbf{P}(\\mathbf{r}) = \\lim_{\\Delta V \\to 0} \\frac{1}{\\Delta V}\\sum_i \\mathbf{p}_i$ ศักย์ไฟฟ้าที่เกิดจากไดโพลกระจายตัวในปริมาตร $V$:\n   $$\\Phi(\\mathbf{r}) = \\frac{1}{4\\pi\\varepsilon_0} \\int_V \\frac{\\mathbf{P}(\\mathbf{r}') \\cdot (\\mathbf{r} - \\mathbf{r}')}{|\\mathbf{r} - \\mathbf{r}'|^3} \\, d^3r'$$",
      "2. ใช้เอกลักษณ์เวกเตอร์แคลคูลัส $\\nabla' \\left(\\frac{1}{|\\mathbf{r} - \\mathbf{r}'|}\\right) = \\frac{\\mathbf{r} - \\mathbf{r}'}{|\\mathbf{r} - \\mathbf{r}'|^3}$ และอินทิเกรตทีละส่วน (Integration by parts / Divergence theorem):\n   $$\\Phi(\\mathbf{r}) = \\frac{1}{4\\pi\\varepsilon_0} \\left[ \\oint_{\\partial V} \\frac{\\mathbf{P}(\\mathbf{r}') \\cdot \\hat{\\mathbf{n}}'}{|\\mathbf{r} - \\mathbf{r}'|} \\, dA' - \\int_V \\frac{\\nabla' \\cdot \\mathbf{P}(\\mathbf{r}')}{|\\mathbf{r} - \\mathbf{r}'|} \\, d^3r' \\right]$$",
      "3. เทียบเคียงกับศักย์ไฟฟ้าจากประจุพื้นผิวและประจุปริมาตร จะได้ประจุผูกพัน (Bound Charges) ชัดเจน:\n   $$\\sigma_b = \\mathbf{P} \\cdot \\hat{\\mathbf{n}}, \\quad \\rho_b = -\\nabla \\cdot \\mathbf{P}$$",
      "4. แทนประจุรวม $\\rho = \\rho_f + \\rho_b$ ลงในกฎของเกาส์ดั้งเดิม $\\varepsilon_0 \\nabla \\cdot \\mathbf{E} = \\rho$:\n   $$\\varepsilon_0 \\nabla \\cdot \\mathbf{E} = \\rho_f - \\nabla \\cdot \\mathbf{P} \\implies \\nabla \\cdot (\\varepsilon_0 \\mathbf{E} + \\mathbf{P}) = \\rho_f$$",
      "5. นิยามเวกเตอร์การกระจัด $\\mathbf{D} \\equiv \\varepsilon_0 \\mathbf{E} + \\mathbf{P}$ จะได้กฎของเกาส์ในสสารอย่างเข้มงวด:\n   $$\\nabla \\cdot \\mathbf{D} = \\rho_f$$",
      "6. ในตัวกลางเชิงเส้น สมมาตร และเนื้อเดียว (Linear Isotropic Homogeneous - LIH): $\\mathbf{P} = \\varepsilon_0 \\chi_e \\mathbf{E}$ ทำให้ $\\mathbf{D} = \\varepsilon_0(1 + \\chi_e)\\mathbf{E} = \\varepsilon_r \\varepsilon_0 \\mathbf{E} = \\varepsilon \\mathbf{E}$ และในผลึกแอนไอโซทรอปิก (Anisotropic Crystals) จะอยู่ในรูปเทนเซอร์สภาพยอมรับได้อันดับสอง: $D_i = \\sum_{j=1}^3 \\varepsilon_{ij} E_j$",
      "7. เงื่อนไขขอบเขตที่รอยต่อตัวกลางสองชนิด (Dielectric Boundary Conditions) โดยใช้กฎของเกาส์บนกล่องยาเม็ดเกาส์เซียน (Pillbox):\n   $$\\Delta D_n = (\\mathbf{D}_2 - \\mathbf{D}_1) \\cdot \\hat{\\mathbf{n}}_{12} = \\sigma_f, \\quad \\Delta E_t = (\\mathbf{E}_2 - \\mathbf{E}_1) \\times \\hat{\\mathbf{n}}_{12} = \\mathbf{0}$$"
    ],
    "takeaways": [
      "กฎของเกาส์ $\\nabla \\cdot \\mathbf{D} = \\rho_f$ ช่วยขจัดความจำเป็นในการรู้ตำแหน่งของประจุระดับอะตอมนับพันล้านล้านตัว โดยรวมผลทั้งหมดเข้าไปในเวกเตอร์ $\\mathbf{D}$ และ $\\mathbf{P}$",
      "สมการปัวซงในไดอิเล็กทริก: $\\nabla \\cdot (\\varepsilon(\\mathbf{r}) \\nabla \\Phi) = -\\rho_f$ ซึ่งลดรูปเป็น $\\nabla^2 \\Phi = -\\rho_f / \\varepsilon$ เมื่อ $\\varepsilon$ คงที่"
    ]
  },
  {
    "id": "AF-07",
    "numeral": "7",
    "titleTh": "อนุกรมฟูเรียร์ การแปลงอินทิกรัล และทฤษฎีบทสเติร์ม-ลียูวีลล์ (Fourier Analysis & Sturm-Liouville)",
    "titleEn": "Fourier Series, Spectral Analysis & Sturm-Liouville Boundary Value Problems",
    "badge": "คณิตศาสตร์ฟิสิกส์ 1 & 2 (Math Methods 1 & 2)",
    "coreConcept": "การวิเคราะห์สเปกตรัม (Spectral Decomposition) เป็นแก่นของฟิสิกส์คณิตศาสตร์: ฟังก์ชันที่เป็นไปได้ทางฟิสิกส์เกือบทุกชนิดสามารถกระจายเป็นผลรวมเชิงเส้นของไอฟังก์ชันมูลฐาน (Orthogonal Eigenfunctions) ของตัวดำเนินการเชิงอนุพันธ์แบบเชื่อมโยงตัวเอง (Self-Adjoint Sturm-Liouville Operator) อนุกรมฟูเรียร์ทำหน้าที่แปลงระบบสมการเชิงอนุพันธ์ย่อย (PDE) เช่น สมการคลื่นและสมการความร้อน ให้กลายเป็นสมการพีชคณิตที่แก้ได้โดยตรง",
    "displayFormula": "f(x) = \\sum_{n=-\\infty}^\\infty c_n e^{i n \\pi x / L}, \\quad c_n = \\frac{1}{2L} \\int_{-L}^L f(x) e^{-i n \\pi x / L} dx, \\quad \\lim_{L \\to \\infty} \\implies \\tilde{f}(k) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^\\infty f(x) e^{-ikx} dx",
    "derivation": [
      "1. สมบัติภาวะตั้งฉากกัน (Orthogonality Relation) ของฐานตรีโกณมิติบนช่วง $[-L, L]$:\n   $$\\frac{1}{2L} \\int_{-L}^L e^{i n \\pi x / L} e^{-i m \\pi x / L} dx = \\delta_{nm} = \\begin{cases} 1 & n = m \\\\ 0 & n \\neq m \\end{cases}$$",
      "2. เงื่อนไขของดิริชเลต (Dirichlet Conditions): ถ้า $f(x)$ มีความต่อเนื่องเป็นช่วงๆ และมีอนุพันธ์จำกัด การกระจายอนุกรมจะลู่เข้าสู่ค่าเฉลี่ยของลิมิตซ้ายและขวาเสมอ:\n   $$\\lim_{N \\to \\infty} S_N(x) = \\frac{f(x^+) + f(x^-)}{2}$$",
      "3. เอกลักษณ์พาร์เซวาล (Parseval's Identity & Completeness Relation): การอนุรักษ์พลังงานในสเปซฮิลเบิร์ต $L^2$:\n   $$\\frac{1}{2L} \\int_{-L}^L |f(x)|^2 dx = \\sum_{n=-\\infty}^\\infty |c_n|^2$$",
      "4. ระบบสเติร์ม-ลียูวีลล์ทั่วไป (Sturm-Liouville Eigenvalue Problem):\n   $$\\mathcal{L}[y] = -\\frac{d}{dx}\\left[p(x) \\frac{dy}{dx}\\right] + q(x)y = \\lambda w(x)y$$\n   โดยที่ $\\mathcal{L}$ เป็นตัวดำเนินการแบบแอร์มีเชียน (Hermitian/Self-adjoint) ทำให้ค่าเฉพาะ $\\lambda_n$ เป็นจำนวนจริงเสมอ และไอฟังก์ชัน $y_n(x)$ ตั้งฉากกันด้วยฟังก์ชันน้ำหนัก $w(x)$: $\\int_a^b y_n(x) y_m(x) w(x) dx = \\delta_{nm}$",
      "5. การขยายสู่อินทิกรัลการแปลงฟูเรียร์ (Fourier Transform) เมื่อ $L \\to \\infty$:\n   $$\\mathcal{F}\\{f(t)\\} = \\tilde{f}(\\omega) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^\\infty f(t) e^{-i\\omega t} dt, \\quad \\mathcal{F}^{-1}\\{\\tilde{f}(\\omega)\\} = f(t) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^\\infty \\tilde{f}(\\omega) e^{i\\omega t} d\\omega$$",
      "6. ทฤษฎีบทสังวัตนาการ (Convolution Theorem): แปลงการอินทิเกรตที่ซับซ้อนให้กลายเป็นการคูณสเปกตรัม:\n   $$\\mathcal{F}\\{f * g\\} = \\sqrt{2\\pi} \\, \\tilde{f}(\\omega) \\tilde{g}(\\omega)$$\n   ซึ่งใช้คำนวณการตอบสนองของวงจร RLC, ทัศนศาสตร์การเลี้ยวเบน, และฟังก์ชันกรีนของสมการคลื่น"
    ],
    "takeaways": [
      "ปรากฏการณ์กิบบส์ (Gibbs Phenomenon): บริเวณรอยต่อที่ไม่ต่อเนื่อง อนุกรมฟูเรียร์จะมียอด overshoot ราว 8.95% เสมอ ไม่ว่าจะบวกพจน์ไปมากเพียงใด",
      "หลักความไม่แน่นอนของไฮเซนเบิร์ก $\\Delta x \\Delta p \\ge \\hbar / 2$ เป็นสมบัติทางคณิตศาสตร์แท้จริงของคู่ผลการแปลงฟูเรียร์ $\\Delta t \\Delta \\omega \\ge 1/2$"
    ]
  },
  {
    "id": "AF-08",
    "numeral": "8",
    "titleTh": "การแปลงคาโนนิคัลและสมการฮามิลตัน-จาโคบี (Canonical Transformations & Hamilton-Jacobi)",
    "titleEn": "Canonical Transformations, Generating Functions & Hamilton-Jacobi Mechanics",
    "badge": "กลศาสตร์วิเคราะห์ระดับสูง (Advanced Analytical Mechanics)",
    "coreConcept": "จุดยอดสูงสุดของกลศาสตร์ดั้งเดิมคือการแปลงพิกัดและโมเมนตัม $(q, p) \\to (Q, P)$ ไปสู่ระบบใหม่ที่ทำให้ฮามิลโทเนียนใหม่ $\\mathcal{K} \\equiv 0$ ส่งผลให้พิกัดและโมเมนตัมใหม่เป็นค่าคงที่ตลอดกาล สมการฮามิลตัน-จาโคบี (Hamilton-Jacobi Equation) แปลงปัญหากลศาสตร์พลวัตไปสู่สมการเชิงอนุพันธ์ย่อยอันดับหนึ่งของฟังก์ชันลักษณะเฉพาะของฮามิลตัน (Hamilton's Principal Function $S$) ซึ่งเป็นรากฐานโดยตรงของการค้นพบกลศาสตร์คลื่นของชเรอดิงเงอร์",
    "displayFormula": "\\mathcal{H}\\left(q_1, \\dots, q_n, \\, \\frac{\\partial S}{\\partial q_1}, \\dots, \\frac{\\partial S}{\\partial q_n}, \\, t\\right) + \\frac{\\partial S}{\\partial t} = 0",
    "derivation": [
      "1. เงื่อนไขที่ทำให้การแปลง $(q, p) \\to (Q, P)$ เป็นคาโนนิคัล (Symplectic condition): รักษาวงเล็บปัวซงพื้นฐาน $\\{Q_i, Q_j\\} = 0$, $\\{P_i, P_j\\} = 0$, $\\{Q_i, P_j\\} = \\delta_{ij}$",
      "2. ฟังก์ชันก่อกำเนิด 4 ชนิด (Generating Functions $F_1, F_2, F_3, F_4$):\n   - ชนิดที่ 1 $F_1(q, Q, t)$: $p_i = \\frac{\\partial F_1}{\\partial q_i}, \\quad P_i = -\\frac{\\partial F_1}{\\partial Q_i}$\n   - ชนิดที่ 2 $F_2(q, P, t)$: $p_i = \\frac{\\partial F_2}{\\partial q_i}, \\quad Q_i = \\frac{\\partial F_2}{\\partial P_i}$\n   - ฮามิลโทเนียนใหม่: $\\mathcal{K}(Q, P, t) = \\mathcal{H}(q, p, t) + \\frac{\\partial F}{\\partial t}$",
      "3. สมการฮามิลตัน-จาโคบี: เลือกฟังก์ชันก่อกำเนิดชนิดที่ 2 $F_2 = S(q, P, t)$ ที่บังคับให้ $\\mathcal{K} = 0$:\n   $$\\mathcal{H}\\left(q, \\frac{\\partial S}{\\partial q}, t\\right) + \\frac{\\partial S}{\\partial t} = 0$$",
      "4. การแยกตัวแปรในระบบอนุรักษ์ (Separation of Variables): $S(q, \\alpha, t) = W(q, \\alpha) - E t$ โดยที่ $W$ คือฟังก์ชันลักษณะเฉพาะของฮามิลตัน (Hamilton's Characteristic Function):\n   $$\\mathcal{H}\\left(q_i, \\frac{\\partial W}{\\partial q_i}\\right) = E$$",
      "5. ตัวแปรแอ็กชัน-มุม (Action-Angle Variables $(J_k, \\theta_k)$): สำหรับการเคลื่อนที่แบบคาบ (Periodic & Multiply-periodic orbits เช่น วงโคจรเคปเลอร์หรือฮาร์โมนิกออสซิลเลเตอร์):\n   $$J_k = \\frac{1}{2\\pi} \\oint p_k \\, dq_k = \\frac{1}{2\\pi} \\oint \\frac{\\partial W}{\\partial q_k} dq_k, \\quad \\omega_k = \\frac{\\partial \\mathcal{H}(J)}{\\partial J_k}, \\quad \\theta_k(t) = \\omega_k t + \\beta_k$$",
      "6. การเชื่อมโยงสู่ฟิสิกส์ควอนตัม: ชเรอดิงเงอร์สังเกตว่าถ้าแทน $S = \\hbar \\frac{1}{i} \\ln \\psi$ หรือ $\\psi = A e^{i S / \\hbar}$ (WKB Approximation) สมการฮามิลตัน-จาโคบีจะกลายเป็นสมการคลื่นของชเรอดิงเงอร์ $\\hat{H}\\psi = E\\psi$ ในลิมิตคลาสสิก $\\hbar \\to 0$"
    ],
    "takeaways": [
      "ตัวแปรแอ็กชัน $J_k$ เป็นค่าไม่แปรเปลี่ยนแบบอะเดียแบติก (Adiabatic Invariant) ที่คงที่แม้พารามิเตอร์ของระบบจะค่อยๆ เปลี่ยนแปลงอย่างช้าๆ",
      "กฎการควอนไทซ์ของบอร์-ซอมเมอร์เฟลด์ (Bohr-Sommerfeld Quantization) $J = n\\hbar$ เกิดขึ้นโดยตรงจากตัวแปรแอ็กชัน-มุมในสมการฮามิลตัน-จาโคบีนี้"
    ]
  },
  {
    "id": "AF-09",
    "numeral": "9",
    "titleTh": "ระบบพิกัดเชิงเส้นโค้งเชิงตั้งฉากและตัวดำเนินการเวกเตอร์แคลคูลัส (Curvilinear Coordinates)",
    "titleEn": "Orthogonal Curvilinear Coordinates, Scale Factors & Vector Field Operators",
    "badge": "คณิตศาสตร์ฟิสิกส์ 1 (Math Methods of Physics 1)",
    "coreConcept": "ระบบพิกัดเชิงเส้นโค้งเชิงตั้งฉาก $(u_1, u_2, u_3)$ เช่น พิกัดทรงกระบอก $(\\rho, \\phi, z)$ และพิกัดทรงกลม $(r, \\theta, \\phi)$ เป็นเครื่องมือจำเป็นในการแก้สมการคลื่น สมการความร้อน และสมการสนามแม่เหล็กไฟฟ้า ตัวประกอบสเกล (Scale Factors $h_i$) ช่วยเชื่อมโยงระยะการขจัดจริง $ds^2 = h_1^2 du_1^2 + h_2^2 du_2^2 + h_3^2 du_3^2$ นำไปสู่สูตรทั่วไปอันทรงพลังของเกรเดียนต์ ไดเวอร์เจนซ์ เคิร์ล และลาปลาเซียน",
    "displayFormula": "ds^2 = \\sum_{i=1}^3 h_i^2 du_i^2, \\quad h_i = \\left|\\frac{\\partial \\mathbf{r}}{\\partial u_i}\\right|, \\quad \\nabla^2 \\psi = \\frac{1}{h_1 h_2 h_3} \\sum_{i=1}^3 \\frac{\\partial}{\\partial u_i}\\left( \\frac{h_1 h_2 h_3}{h_i^2} \\frac{\\partial \\psi}{\\partial u_i} \\right)",
    "derivation": [
      "1. นิยามตัวประกอบสเกล (Scale Factors $h_i$) และเวกเตอร์หนึ่งหน่วยสัมผัส (Unit vectors):\n   $$\\hat{\\mathbf{e}}_i = \\frac{1}{h_i}\\frac{\\partial \\mathbf{r}}{\\partial u_i}, \\quad h_i = \\sqrt{g_{ii}} = \\left| \\frac{\\partial \\mathbf{r}}{\\partial u_i} \\right|$$",
      "2. ตัวประกอบสเกลของระบบพิกัดหลักในฟิสิกส์:\n   - คาร์ทีเซียน $(x, y, z)$: $h_x = 1, \\quad h_y = 1, \\quad h_z = 1$\n   - ทรงกระบอก $(\\rho, \\phi, z)$: $h_\\rho = 1, \\quad h_\\phi = \\rho, \\quad h_z = 1$\n   - ทรงกลม $(r, \\theta, \\phi)$: $h_r = 1, \\quad h_\\theta = r, \\quad h_\\phi = r\\sin\\theta$",
      "3. เกรเดียนต์ (Gradient $\\nabla \\psi$):\n   $$\\nabla \\psi = \\sum_{i=1}^3 \\frac{1}{h_i} \\frac{\\partial \\psi}{\\partial u_i} \\hat{\\mathbf{e}}_i$$",
      "4. ไดเวอร์เจนซ์ (Divergence $\\nabla \\cdot \\mathbf{A}$): จากทฤษฎีบทการลู่ออกบนกล่องปริมาตรอนันต์จำลอง $dV = h_1 h_2 h_3 \\, du_1 du_2 du_3$:\n   $$\\nabla \\cdot \\mathbf{A} = \\frac{1}{h_1 h_2 h_3} \\left[ \\frac{\\partial}{\\partial u_1}(h_2 h_3 A_1) + \\frac{\\partial}{\\partial u_2}(h_1 h_3 A_2) + \\frac{\\partial}{\\partial u_3}(h_1 h_2 A_3) \\right]$$",
      "5. เคิร์ล (Curl $\\nabla \\times \\mathbf{A}$): จากทฤษฎีบทของสโตกส์บนวงปิดระนาบพิกัด:\n   $$\\nabla \\times \\mathbf{A} = \\frac{1}{h_1 h_2 h_3} \\begin{vmatrix} h_1\\hat{\\mathbf{e}}_1 & h_2\\hat{\\mathbf{e}}_2 & h_3\\hat{\\mathbf{e}}_3 \\\\ \\frac{\\partial}{\\partial u_1} & \\frac{\\partial}{\\partial u_2} & \\frac{\\partial}{\\partial u_3} \\\\ h_1 A_1 & h_2 A_2 & h_3 A_3 \\end{vmatrix}$$",
      "6. ลาปลาเซียน (Laplacian $\\nabla^2 \\psi = \\nabla \\cdot (\\nabla \\psi)$) ในพิกัดทรงกลม:\n   $$\\nabla^2 \\psi = \\frac{1}{r^2} \\frac{\\partial}{\\partial r}\\left( r^2 \\frac{\\partial \\psi}{\\partial r} \\right) + \\frac{1}{r^2 \\sin\\theta} \\frac{\\partial}{\\partial \\theta}\\left( \\sin\\theta \\frac{\\partial \\psi}{\\partial \\theta} \\right) + \\frac{1}{r^2 \\sin^2\\theta} \\frac{\\partial^2 \\psi}{\\partial \\phi^2}$$\n   ซึ่งเป็นสูตรที่ใช้แก้สมการคลื่นของอะตอมไฮโดรเจน ฮาร์โมนิกส์ทรงกลม (Spherical Harmonics $Y_l^m$) และสนามไฟฟ้าทรงกลม"
    ],
    "takeaways": [
      "สูตร $h_i$ เพียง 3 ค่า สามารถสร้างตัวดำเนินการเวกเตอร์ทั้งหมดได้โดยอัตโนมัติ ช่วยลดความผิดพลาดในการท่องจำสูตรพิกัดทรงกลมและทรงกระบอก",
      "สมการลาปลาส $\\nabla^2 \\Phi = 0$ เมื่อแยกตัวแปรในพิกัดทรงกลม จะนำไปสู่พหุนามเลอฌ็องดร์ (Legendre Polynomials $P_l(\\cos\\theta)$) ซึ่งเป็นวิธีแก้ศักย์ไฟฟ้าสถิตคลาสสิก"
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
