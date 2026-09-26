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
      titleTh: "คณิตศาสตร์สำหรับฟิสิกส์ & กลศาสตร์วิเคราะห์ (Mathematics for Physics & Analytical Mechanics)",
      subtitleTh: "เวกเตอร์แคลคูลัส วิธีการแปรผัน ลากรานเจียน ฮามิลโทเนียน ทฤษฎีบทปริพันธ์ สมการ PDE ฟังก์ชันพิเศษ และเทนเซอร์",
      description: "รากฐานฟิสิกส์คณิตศาสตร์ระดับมหาวิทยาลัยและโอลิมปิกวิชาการ 15 มิติหลัก (Math Methods of Physics 1, 2, 3) ครอบคลุมตั้งแต่แคลคูลัสเวกเตอร์ พิกัดโค้ง สมการ PDE ฟูเรียร์ จนถึงทฤษฎีเทนเซอร์และการประมาณค่า WKB"
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
    "category": "vector",
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
    "category": "pde",
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
    "category": "analytical",
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
    "category": "vector",
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
  },
  {
    "id": "AF-10",
    "numeral": "10",
    "category": "vector",
    "titleTh": "เวกเตอร์แคลคูลัสและการวิเคราะห์สนาม (Vector Calculus & Field Operators)",
    "titleEn": "Gradient, Divergence, Curl & Fundamental Vector Field Identities",
    "badge": "คณิตศาสตร์ฟิสิกส์ 1 (Math Methods 1)",
    "coreConcept": "สนามสเกลาร์และสนามเวกเตอร์ในฟิสิกส์ถูกควบคุมด้วยตัวดำเนินการเดล (Del Operator $\\nabla$) เกรเดียนต์ ($\\nabla\\phi$) วัดอัตราการเปลี่ยนแปลงสูงสุดและทิศทางลาดชัน, ไดเวอร์เจนซ์ ($\\nabla\\cdot\\mathbf{A}$) วัดความหนาแน่นฟลักซ์สุทธิที่พุ่งออกจากจุด (แหล่งกำเนิด/บ่อรับ), และเคิร์ล ($\\nabla\\times\\mathbf{A}$) วัดการหมุนวนรอบจุด การที่ $\\nabla\\times(\\nabla\\phi) = \\mathbf{0}$ เสมอหมายความว่าสนามอนุรักษ์จะไม่มีการหมุนวน และ $\\nabla\\cdot(\\nabla\\times\\mathbf{A}) = 0$ หมายความว่าสนามแม่เหล็กไม่มีประจุขั้วเดี่ยว (No Magnetic Monopoles)",
    "displayFormula": "\\nabla\\phi = \\sum_{i=1}^3 \\frac{\\partial \\phi}{\\partial x_i} \\hat{\\mathbf{e}}_i, \\quad \\nabla\\cdot\\mathbf{A} = \\sum_{i=1}^3 \\frac{\\partial A_i}{\\partial x_i}, \\quad \\nabla\\times\\mathbf{A} = \\epsilon_{ijk} \\frac{\\partial A_k}{\\partial x_j} \\hat{\\mathbf{e}}_i, \\quad \\nabla\\times(\\nabla\\times\\mathbf{A}) = \\nabla(\\nabla\\cdot\\mathbf{A}) - \\nabla^2\\mathbf{A}",
    "derivation": [
      "1. ตัวดำเนินการเดลในพิกัดคาร์ทีเซียน: $\\nabla = \\hat{\\mathbf{i}}\\frac{\\partial}{\\partial x} + \\hat{\\mathbf{j}}\\frac{\\partial}{\\partial y} + \\hat{\\mathbf{k}}\\frac{\\partial}{\\partial z}$",
      "2. การพิสูจน์เอกลักษณ์ $\\nabla \\times (\\nabla \\phi) = \\mathbf{0}$:\n   - องค์ประกอบแกน $x$:\n   $$[\\nabla \\times (\\nabla \\phi)]_x = \\frac{\\partial}{\\partial y}\\left(\\frac{\\partial \\phi}{\\partial z}\\right) - \\frac{\\partial}{\\partial z}\\left(\\frac{\\partial \\phi}{\\partial y}\\right) = \\frac{\\partial^2 \\phi}{\\partial y \\partial z} - \\frac{\\partial^2 \\phi}{\\partial z \\partial y} = 0$$\n   - ตามทฤษฎีบทของชวาร์ซ (Clairaut's theorem) ลำดับการหาอนุพันธ์ย่อยสลับที่ได้ ผลลัพธ์จึงเป็นเวกเตอร์ศูนย์ $\\mathbf{0}$ อย่างสัมบูรณ์",
      "3. การพิสูจน์เอกลักษณ์ $\\nabla \\cdot (\\nabla \\times \\mathbf{A}) = 0$:\n   $$\\nabla \\cdot (\\nabla \\times \\mathbf{A}) = \\frac{\\partial}{\\partial x}\\left( \\frac{\\partial A_z}{\\partial y} - \\frac{\\partial A_y}{\\partial z} \\right) + \\frac{\\partial}{\\partial y}\\left( \\frac{\\partial A_x}{\\partial z} - \\frac{\\partial A_z}{\\partial x} \\right) + \\frac{\\partial}{\\partial z}\\left( \\frac{\\partial A_y}{\\partial x} - \\frac{\\partial A_x}{\\partial y} \\right) = 0$$",
      "4. การพิสูจน์เอกลักษณ์เวกเตอร์ลาปลาเซียน $\\nabla \\times (\\nabla \\times \\mathbf{A}) = \\nabla(\\nabla \\cdot \\mathbf{A}) - \\nabla^2 \\mathbf{A}$ โดยใช้สัญกรณ์เลวี-ชีวีตา (Levi-Civita):\n   $$[\\nabla \\times (\\nabla \\times \\mathbf{A})]_i = \\epsilon_{ijk} \\partial_j (\\epsilon_{kmn} \\partial_m A_n) = (\\delta_{im}\\delta_{jn} - \\delta_{in}\\delta_{jm}) \\partial_j \\partial_m A_n = \\partial_i (\\partial_j A_j) - \\partial_j \\partial_j A_i = [\\nabla(\\nabla \\cdot \\mathbf{A}) - \\nabla^2 \\mathbf{A}]_i$$",
      "5. ทฤษฎีบทการแยกของเฮล์มโฮลทซ์ (Helmholtz Decomposition Theorem):\n   - สนามเวกเตอร์ที่มีขอบเขตและลดลงสู่ศูนย์ที่ระยะอนันต์ สามารถแยกเป็นผลรวมของสนามที่ไม่หมุนวน (Irrotational / Curl-free) และสนามที่ไม่ลู่ออก (Solenoidal / Divergence-free) ได้เสมอ:\n   $$\\mathbf{A}(\\mathbf{r}) = -\\nabla \\Phi(\\mathbf{r}) + \\nabla \\times \\mathbf{C}(\\mathbf{r})$$"
    ],
    "takeaways": [
      "ในวิชาพลศาสตร์ของไหล: ฟังก์ชันศักย์ความเร็ว $\\mathbf{v} = \\nabla\\phi$ ใช้ได้เฉพาะเมื่อการไหลไร้ความฝืดและไร้วอร์เทกซ์ ($\\nabla\\times\\mathbf{v} = \\mathbf{0}$)",
      "ในทฤษฎีแม่เหล็กไฟฟ้า: ศักย์เวกเตอร์แม่เหล็ก $\\mathbf{B} = \\nabla\\times\\mathbf{A}$ ตอบสนองสมการ $\\nabla\\cdot\\mathbf{B} = 0$ อัตโนมัติในทุกระบบพิกัด"
    ]
  },
  {
    "id": "AF-11",
    "numeral": "11",
    "category": "vector",
    "titleTh": "ทฤษฎีบทปริพันธ์และกฎการอนุรักษ์ (Integral Theorems & Conservation Laws)",
    "titleEn": "Divergence Theorem of Gauss, Stokes' Theorem & Green's Identities",
    "badge": "คณิตศาสตร์ฟิสิกส์ 1 (Math Methods 1)",
    "coreConcept": "ทฤษฎีบทปริพันธ์เชื่อมโยงพฤติกรรมจุลภาค (อนุพันธ์ย่อยภายในโดเมน) เข้ากับพฤติกรรมมหภาค (ฟลักซ์และการไหลเวียนตามขอบเขต) ทฤษฎีบทการลู่ออกของเกาส์ (Gauss-Ostrogradsky Theorem) แปลงปริพันธ์ปริมาตรเป็นปริพันธ์ฟลักซ์ผิวปิด ทฤษฎีบทของสโตกส์ (Stokes' Theorem) แปลงปริพันธ์ตามแนวเส้นรอบวงปิดเป็นปริพันธ์พื้นที่ของเคิร์ล ทั้งหมดนี้นำไปสู่กฎการอนุรักษ์มวล ประจุ และพลังงาน ในรูปสมการความต่อเนื่อง (Continuity Equation)",
    "displayFormula": "\\iiint_V (\\nabla \\cdot \\mathbf{F}) \\, dV = \\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S}, \\quad \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r}, \\quad \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\mathbf{J} = 0",
    "derivation": [
      "1. ทฤษฎีบทการลู่ออกของเกาส์ (Gauss's Divergence Theorem):\n   - พิจารณาฟลักซ์รวมผ่านผิวปิดกล่องลูกบาศก์ขนาดจิ๋ว $dV = dx\\,dy\\,dz$:\n   $$d\\Phi_x = [F_x(x+dx, y, z) - F_x(x, y, z)]\\,dy\\,dz = \\frac{\\partial F_x}{\\partial x}\\,dx\\,dy\\,dz$$\n   - เมื่อรวมฟลักซ์ 3 แกนและรวมปริมาตรทั้งหมดเข้าด้วยกัน ผิวร่วมภายในจะหักล้างกันหมด เหลือเฉพาะฟลักซ์ที่ผิวขอบภายนอก:\n   $$\\oiint_{\\partial V} \\mathbf{F} \\cdot d\\mathbf{S} = \\iiint_V \\left( \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z} \\right) dV = \\iiint_V (\\nabla \\cdot \\mathbf{F}) \\, dV$$",
      "2. การอนุมานสมการความต่อเนื่อง (Continuity Equation):\n   - มวลรวมหรือประจุรวมในปริมาตร $V$: $Q(t) = \\iiint_V \\rho(\\mathbf{r}, t)\\,dV$\n   - อัตราการลดลงของประจุภายในปริมาตร ย่อมเท่ากับฟลักซ์กระแสที่ไหลทะลุออกทางผิวรอบนอก:\n   $$-\\frac{dQ}{dt} = -\\iiint_V \\frac{\\partial \\rho}{\\partial t}\\,dV = \\oiint_{\\partial V} \\mathbf{J} \\cdot d\\mathbf{S}$$\n   - ใช้ทฤษฎีบทเกาส์แปลงผิวปิดเป็นปริมาตร:\n   $$\\iiint_V \\left( \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\mathbf{J} \\right) dV = 0 \\implies \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\mathbf{J} = 0$$",
      "3. ทฤษฎีบทของสโตกส์ (Stokes' Theorem):\n   - พิจารณาการไหลเวียนตามวงปิดขอบระนาบ $dS = dx\\,dy$:\n   $$\\oint F_x\\,dx + F_y\\,dy = \\left( \\frac{\\partial F_y}{\\partial x} - \\frac{\\partial F_x}{\\partial y} \\right) dx\\,dy = (\\nabla \\times \\mathbf{F})_z\\,dS$$\n   - รวมพื้นที่ผิว $S$ ทั้งหมด: $\\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S}$",
      "4. เอกลักษณ์ของกรีน (Green's Identities):\n   - จากทฤษฎีบทเกาส์ แทน $\\mathbf{F} = \\phi \\nabla \\psi$:\n   $$\\nabla \\cdot (\\phi \\nabla \\psi) = \\phi \\nabla^2 \\psi + \\nabla \\phi \\cdot \\nabla \\psi \\implies \\iiint_V (\\phi \\nabla^2 \\psi + \\nabla \\phi \\cdot \\nabla \\psi)\\,dV = \\oiint_{\\partial V} \\phi \\frac{\\partial \\psi}{\\partial n}\\,dS \\quad \\text{(Green's 1st)}$$\n   - สลับ $\\phi$ กับ $\\psi$ แล้วลบกัน ได้เอกลักษณ์ที่สองของกรีน:\n   $$\\iiint_V (\\phi \\nabla^2 \\psi - \\psi \\nabla^2 \\phi)\\,dV = \\oiint_{\\partial V} \\left( \\phi \\frac{\\partial \\psi}{\\partial n} - \\psi \\frac{\\partial \\phi}{\\partial n} \\right) dS \\quad \\text{(Green's 2nd)}$$"
    ],
    "takeaways": [
      "สมการแมกซ์เวลล์รูปอนุพันธ์และรูปปริพันธ์เชื่อมโยงถึงกัน 100% ผ่านทฤษฎีบทของเกาส์และสโตกส์นี้",
      "เอกลักษณ์ที่สองของกรีนเป็นเครื่องมือสำคัญที่สุดในการหาวิธีแก้แบบฟังก์ชันกรีน (Green's Function Method) สำหรับสมการคลื่นและสมการศักย์ไฟฟ้าสถิต"
    ]
  },
  {
    "id": "AF-12",
    "numeral": "12",
    "category": "pde",
    "titleTh": "สมการเชิงอนุพันธ์ย่อยในฟิสิกส์ (Canonical PDEs of Mathematical Physics)",
    "titleEn": "Wave Equation, Diffusion/Heat Equation, Poisson & Laplace Equations",
    "badge": "คณิตศาสตร์ฟิสิกส์ 2 (Math Methods 2)",
    "coreConcept": "ปรากฏการณ์ทางฟิสิกส์ส่วนใหญ่ถูกอธิบายด้วยสมการเชิงอนุพันธ์ย่อยอันดับสองเชิงเส้น (Linear 2nd-order PDEs) ซึ่งจำแนกออกเป็น 3 ตระกูลหลักตามคุณสมบัติทางเรขาคณิต: (1) ไฮเพอร์โบลิก (Hyperbolic) เช่น สมการคลื่น ที่อธิบายการแพร่กระจายด้วยความเร็วจำกัด $v$, (2) พาราโบลิก (Parabolic) เช่น สมการความร้อน/การแพร่ ที่อธิบายกระบวนการสูญสลายแบบย้อนกลับไม่ได้, และ (3) เอลลิปติก (Elliptic) เช่น สมการลาปลาสและปัวซง ที่อธิบายสถานะสมดุลสถิตและศักย์ไฟฟ้า",
    "displayFormula": "\\nabla^2 u - \\frac{1}{v^2}\\frac{\\partial^2 u}{\\partial t^2} = 0 \\, \\text{(Wave)}, \\quad \\nabla^2 T - \\frac{1}{\\alpha}\\frac{\\partial T}{\\partial t} = 0 \\, \\text{(Heat)}, \\quad \\nabla^2 \\Phi = -\\frac{\\rho}{\\varepsilon_0} \\, \\text{(Poisson)}",
    "derivation": [
      "1. สมการคลื่น 1 มิติ และวิธีของดาล็องแบร์ (D'Alembert's Solution):\n   - กำหนดตัวแปรคุณลักษณะ (Characteristic variables): $\\xi = x - vt, \\, \\eta = x + vt$\n   - สมการคลื่นแปลงรูปเป็น: $\\frac{\\partial^2 u}{\\partial \\xi \\partial \\eta} = 0$\n   - อินทิเกรตสองครั้งจะได้ผลเฉลยทั่วไปเป็นผลรวมของคลื่นวิ่งไปข้างหน้าและวิ่งถอยหลัง:\n   $$u(x, t) = f(x - vt) + g(x + vt)$$",
      "2. สมการการแพร่และความร้อน (Heat / Diffusion Equation):\n   - กฎของฟูเรียร์ $\\mathbf{q} = -k \\nabla T$ รวมกับกฎการอนุรักษ์พลังงานความร้อน $\\rho c_p \\frac{\\partial T}{\\partial t} + \\nabla \\cdot \\mathbf{q} = 0$:\n   $$\\frac{\\partial T}{\\partial t} = \\alpha \\nabla^2 T, \\quad \\alpha = \\frac{k}{\\rho c_p}$$\n   - ผลเฉลยพื้นฐาน (Fundamental Solution / Heat Kernel) สำหรับแหล่งความร้อนจุดเริ่มต้นในปริภูมิ 1 มิติ:\n   $$G(x, t) = \\frac{1}{\\sqrt{4\\pi \\alpha t}} \\exp\\left( -\\frac{x^2}{4\\alpha t} \\right)$$\n   ซึ่งแสดงให้เห็นการกระจายตัวแบบเกาส์เซียนที่มีความกว้างเพิ่มขึ้นตาม $\\sigma = \\sqrt{2\\alpha t}$",
      "3. สมการลาปลาสและสมการปัวซง (Laplace & Poisson Equations):\n   - ศักย์ไฟฟ้าสถิต $\\mathbf{E} = -\\nabla \\Phi$ รวมกับกฎเกาส์ $\\nabla \\cdot \\mathbf{E} = \\rho / \\varepsilon_0$:\n   $$\\nabla^2 \\Phi = -\\frac{\\rho(\\mathbf{r})}{\\varepsilon_0}$$\n   - ฟังก์ชันฮาร์มอนิก (Harmonic Functions $\\nabla^2 \\Phi = 0$) มีสมบัติค่าเฉลี่ย (Mean Value Property): ค่าศักย์ที่จุดศูนย์กลางทรงกลมจะเท่ากับค่าเฉลี่ยของศักย์บนผิวทรงกลมเสมอ ส่งผลให้ไม่มีจุดต่ำสุดหรือสูงสุดสัมพัทธ์ในบริเวณที่ไร้ประจุ (Earnshaw's Theorem - ห้ามวัตถุประจุลอยตัวนิ่งในสนามไฟฟ้าสถิตล้วนๆ)",
      "4. เทคนิคการแยกตัวแปร (Separation of Variables):\n   - สมมติ $u(x, y, t) = X(x)Y(y)T(t)$ เพื่อแปลง PDE อันดับ 2 ให้กลายเป็นระบบสมการ ODE อันดับ 2 ที่แก้ได้ด้วยไอฟังก์ชันมูลฐาน"
    ],
    "takeaways": [
      "สมการคลื่นมีสมมาตรการย้อนกลับของเวลา ($t \\to -t$) แต่สมการความร้อนไม่มีสมมาตรนี้ สอดคล้องกับกฎข้อที่สองของอุณหพลศาสตร์",
      "ทฤษฎีบทความเป็นหนึ่งเดียว (Uniqueness Theorem): เมื่อระบุเงื่อนไขขอบเขตดิริชเลต (Dirichlet, ค่าบนขอบ) หรือนอยมันน์ (Neumann, อนุพันธ์ตั้งฉากบนขอบ) ครบถ้วน ผลเฉลยของสมการปัวซงจะมีเพียงหนึ่งเดียวเสมอ"
    ]
  },
  {
    "id": "AF-13",
    "numeral": "13",
    "category": "pde",
    "titleTh": "ฟังก์ชันพิเศษในฟิสิกส์คณิตศาสตร์ (Special Functions of Mathematical Physics)",
    "titleEn": "Bessel Functions, Legendre Polynomials, Hermite & Spherical Harmonics",
    "badge": "คณิตศาสตร์ฟิสิกส์ 2 (Math Methods 2)",
    "coreConcept": "เมื่อแก้สมการคลื่น สมการความร้อน หรือสมการชเรอดิงเงอร์ในระบบพิกัดที่มีความสมมาตร (เช่น ทรงกระบอก ทรงกลม หรือการสั่นฮาร์โมนิก) วิธีแยกตัวแปรจะสร้างสมการเชิงอนุพันธ์สามัญเฉพาะที่มีผลเฉลยเป็น 'ฟังก์ชันพิเศษ' (Special Functions) ได้แก่ ฟังก์ชันเบสเซล (Bessel Functions) ในพิกัดทรงกระบอก, พหุนามเลอฌ็องดร์และฮาร์โมนิกส์ทรงกลม (Spherical Harmonics) ในพิกัดทรงกลม, และพหุนามแอร์มีต (Hermite) ในควอนตัมฮาร์มอนิกออสซิลเลเตอร์",
    "displayFormula": "J_n(x) = \\sum_{m=0}^\\infty \\frac{(-1)^m}{m! \\, \\Gamma(m+n+1)} \\left(\\frac{x}{2}\\right)^{2m+n}, \\quad P_l(x) = \\frac{1}{2^l l!} \\frac{d^l}{dx^l}(x^2 - 1)^l, \\quad Y_l^m(\\theta, \\phi) \\propto P_l^m(\\cos\\theta) e^{im\\phi}",
    "derivation": [
      "1. สมการเบสเซลและฟังก์ชันเบสเซล (Bessel Differential Equation):\n   $$x^2 \\frac{d^2 y}{dx^2} + x \\frac{dy}{dx} + (x^2 - \\nu^2)y = 0$$\n   - ฟังก์ชันเบสเซลชนิดที่ 1 $J_\\nu(x)$ สม่ำเสมอที่จุดกำเนิด $x=0$, ชนิดที่ 2 (Neumann function) $Y_\\nu(x)$ มีค่าพุ่งสู่อนันต์ที่ $x=0$\n   - พฤติกรรมเมื่อ $x \\to \\infty$: $J_\\nu(x) \\sim \\sqrt{\\frac{2}{\\pi x}} \\cos\\left(x - \\frac{\\nu\\pi}{2} - \\frac{\\pi}{4}\\right)$ แสดงลักษณะคลื่นลดทอน\n   - รากของฟังก์ชันเบสเซล $J_n(\\alpha_{nm}) = 0$ กำหนดความถี่การสั่นของเยื่อกลองกลมและท่อนำคลื่นทรงกระบอก",
      "2. พหุนามเลอฌ็องดร์ (Legendre Polynomials $P_l(x)$):\n   $$(1 - x^2) \\frac{d^2 y}{dx^2} - 2x \\frac{dy}{dx} + l(l+1)y = 0, \\quad x = \\cos\\theta$$\n   - สูตรของโรดริกส์ (Rodrigues' Formula): $P_l(x) = \\frac{1}{2^l l!} \\frac{d^l}{dx^l}(x^2 - 1)^l$\n   - ตัวอย่างพหุนามแรกๆ: $P_0(x) = 1, \\, P_1(x) = x, \\, P_2(x) = \\frac{1}{2}(3x^2 - 1), \\, P_3(x) = \\frac{1}{2}(5x^3 - 3x)$\n   - การกระจายหลายขั้ว (Multipole Expansion): $\\frac{1}{|\\mathbf{r} - \\mathbf{r}'|} = \\sum_{l=0}^\\infty \\frac{r_{<}^l}{r_{>}^{l+1}} P_l(\\cos\\gamma)$",
      "3. ฮาร์โมนิกส์ทรงกลม (Spherical Harmonics $Y_l^m(\\theta, \\phi)$):\n   - ไอฟังก์ชันของตัวดำเนินการโมเมนตัมเชิงมุมยกกำลังสอง $\\hat{L}^2$ และแกน $z$ $\\hat{L}_z$:\n   $$\\hat{L}^2 Y_l^m = \\hbar^2 l(l+1) Y_l^m, \\quad \\hat{L}_z Y_l^m = \\hbar m Y_l^m$$\n   - สมบัติการตั้งฉากกันสมบูรณ์บนผิวทรงกลมหนึ่งหน่วย:\n   $$\\int_0^{2\\pi} d\\phi \\int_0^\\pi \\sin\\theta \\, d\\theta \\, [Y_l^m(\\theta, \\phi)]^* Y_{l'}^{m'}(\\theta, \\phi) = \\delta_{ll'} \\delta_{mm'}$$",
      "4. พหุนามแอร์มีต (Hermite Polynomials $H_n(x)$):\n   $$y'' - 2x y' + 2n y = 0 \\implies H_n(x) = (-1)^n e^{x^2} \\frac{d^n}{dx^n}(e^{-x^2})$$\n   - ฟังก์ชันคลื่นควอนตัมของฮาร์มอนิกออสซิลเลเตอร์: $\\psi_n(x) = \\frac{1}{\\sqrt{2^n n!}} \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4} e^{-\\frac{m\\omega x^2}{2\\hbar}} H_n\\left(\\sqrt{\\frac{m\\omega}{\\hbar}} x\\right)$"
    ],
    "takeaways": [
      "ฟังก์ชันพิเศษทุกตระกูลเป็นเซตฐานสมบูรณ์ (Complete Orthogonal Basis Set) ในสเปซฟังก์ชัน สามารถใช้กระจายฟังก์ชันทางกายภาพใดๆ ได้เหมือนอนุกรมฟูเรียร์",
      "ออร์บิทัล $s, p, d, f$ ในวิชาฟิสิกส์อะตอมและเคมีควอนตัมมีรูปร่างตรงตามฟังก์ชันฮาร์โมนิกส์ทรงกลม $Y_l^m$ เหล่านี้ทุกประการ"
    ]
  },
  {
    "id": "AF-14",
    "numeral": "14",
    "category": "tensor",
    "titleTh": "พีชคณิตเชิงเส้น สัญกรณ์ดัชนี และทฤษฎีเทนเซอร์ (Linear Algebra, Index Notation & Tensors)",
    "titleEn": "Einstein Summation, Levi-Civita Symbol, Metric & Inertia Tensors",
    "badge": "คณิตศาสตร์ฟิสิกส์ 3 (Math Methods 3)",
    "coreConcept": "กฎทางฟิสิกส์ต้องเป็นจริงโดยไม่ขึ้นกับผู้สังเกตหรือระบบพิกัดที่เลือกใช้ (Principle of General Covariance) พีชคณิตเทนเซอร์ (Tensor Calculus) และสัญกรณ์ไอน์สไตน์ (Einstein Summation Convention) ช่วยเขียนสมการพลศาสตร์อันซับซ้อนให้กระชับและแสดงความสมมาตรทางเรขาคณิต เช่น เทนเซอร์ความเฉื่อย $\\mathbf{I}$ ในวัตถุเกร็งหมุน 3 มิติ, เทนเซอร์ความเค้น $\\boldsymbol{\\sigma}$ ในกลศาสตร์ของแข็งและของไหล, และเทนเซอร์เมตริก $g_{\\mu\\nu}$ ในทฤษฎีสัมพัทธภาพ",
    "displayFormula": "A_i B_i \\equiv \\sum_{i=1}^3 A_i B_i, \\quad \\epsilon_{ijk}\\epsilon_{imn} = \\delta_{jm}\\delta_{kn} - \\delta_{jn}\\delta_{km}, \\quad I_{ij} = \\int_V \\rho(\\mathbf{r}) (r^2 \\delta_{ij} - x_i x_j) dV, \\quad ds^2 = g_{\\mu\\nu} dx^\\mu dx^\\nu",
    "derivation": [
      "1. สัญกรณ์ผลบวกของไอน์สไตน์ (Einstein Summation Convention):\n   - ดัชนีที่ปรากฏซ้ำ 2 ครั้งในพจน์เดียวกันถือว่ามีเครื่องหมายซิกมาผลบวกเสมอ:\n   $$\\mathbf{A} \\cdot \\mathbf{B} = A_i B_i, \\quad [\\mathbf{M} \\mathbf{v}]_i = M_{ij} v_j, \\quad \\text{tr}(\\mathbf{M}) = M_{ii}$$",
      "2. โครเนกเกอร์เดลตา (Kronecker Delta $\\delta_{ij}$) และสัญลักษณ์เลวี-ชีวีตา (Levi-Civita Symbol $\\epsilon_{ijk}$):\n   $$\\delta_{ij} = \\begin{cases} 1 & i = j \\\\ 0 & i \\neq j \\end{cases}, \\quad \\epsilon_{ijk} = \\begin{cases} +1 & (i,j,k) \\in \\text{even perm. of } (1,2,3) \\\\ -1 & (i,j,k) \\in \\text{odd perm.} \\\\ 0 & \\text{repeated index} \\end{cases}$$\n   - ผลคูณไขว้เวกเตอร์: $[\\mathbf{A} \\times \\mathbf{B}]_i = \\epsilon_{ijk} A_j B_k$\n   - กฎการหดตัวของดัชนี (Contraction Identity):\n   $$\\epsilon_{ijk} \\epsilon_{imn} = \\delta_{jm}\\delta_{kn} - \\delta_{jn}\\delta_{km}$$\n   ซึ่งพิสูจน์เอกลักษณ์เวกเตอร์ $\\mathbf{A} \\times (\\mathbf{B} \\times \\mathbf{C}) = (\\mathbf{A} \\cdot \\mathbf{C})\\mathbf{B} - (\\mathbf{A} \\cdot \\mathbf{B})\\mathbf{C}$ ได้ใน 2 บรรทัด",
      "3. เทนเซอร์โมเมนต์ความเฉื่อย (Moment of Inertia Tensor $I_{ij}$):\n   - โมเมนตัมเชิงมุมของวัตถุเกร็ง $\\mathbf{L} = \\int \\mathbf{r} \\times (\\boldsymbol{\\omega} \\times \\mathbf{r}) \\, dm$:\n   $$L_i = \\int \\epsilon_{ijk} x_j (\\epsilon_{kmn} \\omega_m x_n) dm = \\int (x^2 \\delta_{im} - x_i x_m) \\omega_m dm = I_{im} \\omega_m$$\n   - เมทริกซ์สมมาตร 3x3:\n   $$\\mathbf{I} = \\begin{bmatrix} \\int (y^2+z^2)dm & -\\int xy\\,dm & -\\int xz\\,dm \\\\ -\\int yx\\,dm & \\int (x^2+z^2)dm & -\\int yz\\,dm \\\\ -\\int zx\\,dm & -\\int zy\\,dm & \\int (x^2+y^2)dm \\end{bmatrix}$$\n   - เนื่องจากเป็นเมทริกซ์แอร์มีเชียน/สมมาตร จึงสามารถแปลงทแยงมุม (Diagonalize) เพื่อหาแกนหลักความเฉื่อย (Principal Axes) ได้เสมอ",
      "4. เทนเซอร์ในสัมพัทธภาพพิเศษ (Minkowski 4-vectors):\n   - เวกเตอร์ 4 มิติ: $x^\\mu = (ct, x, y, z)$\n   - เทนเซอร์เมตริกมินคอฟสกี: $\\eta_{\\mu\\nu} = \\text{diag}(1, -1, -1, -1)$\n   - ช่วงว่างกาล-อวกาศไม่แปรเปลี่ยน (Invariant Interval): $ds^2 = \\eta_{\\mu\\nu} dx^\\mu dx^\\nu = c^2 dt^2 - (dx^2 + dy^2 + dz^2)$"
    ],
    "takeaways": [
      "เทนเซอร์คือปริมาณทางเรขาคณิตที่แท้จริง: สเกลาร์คือเทนเซอร์อันดับ 0, เวกเตอร์คือเทนเซอร์อันดับ 1, เมทริกซ์ความเค้นคือเทนเซอร์อันดับ 2",
      "การแปลงพิกัดของเทนเซอร์โคแวเรียนต์และคอนทราแวเรียนต์เป็นหัวใจสำคัญของทฤษฎีสัมพัทธภาพทั่วไปของไอน์สไตน์"
    ]
  },
  {
    "id": "AF-15",
    "numeral": "15",
    "category": "tensor",
    "titleTh": "วิธีการรบกวนและประมาณค่าเชิงฟิสิกส์ (Perturbation Theory & Asymptotic Methods)",
    "titleEn": "Regular Perturbation, Poincaré-Lindstedt, WKB Approximation & Steepest Descent",
    "badge": "คณิตศาสตร์ฟิสิกส์ 3 (Math Methods 3)",
    "coreConcept": "ในโลกฟิสิกส์จริง ระบบส่วนใหญ่ไม่มีผลเฉลยแม่นตรงในรูปปิด (Closed-form Analytical Solution) นักฟิสิกส์จึงต้องพึ่งพาระเบียบวิธีการรบกวน (Perturbation Theory) และการกระจายเชิงเส้นกำกับ (Asymptotic Expansions) โดยแบ่งปัญหาออกเป็น 'ส่วนที่แก้ได้แม่นตรง' บวกกับ 'พจน์รบกวนขนาดเล็ก' $\\epsilon$ เช่น วิธีปวงกาเร-ลินด์สเตดท์สำหรับขจัดพจน์เซคิวลาร์ในออสซิลเลเตอร์ไม่เชิงเส้น, วิธี WKB สำหรับคลื่นกึ่งคลาสสิกและการลอดอุโมงค์ควอนตัม, และวิธีเฟสคงที่สำหรับแพ็กเก็ตคลื่นกระจายตัว",
    "displayFormula": "x(t) = \\sum_{n=0}^\\infty \\epsilon^n x_n(t), \\quad \\omega(\\epsilon) = \\omega_0 + \\epsilon \\omega_1 + \\dots, \\quad \\psi_{\\text{WKB}}(x) \\sim \\frac{C}{\\sqrt{p(x)}} \\exp\\left( \\pm \\frac{i}{\\hbar}\\int^x p(x') dx' \\right)",
    "derivation": [
      "1. วิธีการรบกวนสม่ำเสมอและปัญหาพจน์เซคิวลาร์ (Secular Terms in Duffing Equation):\n   - พิจารณา $\\ddot{x} + x + \\epsilon x^3 = 0$ พร้อมเงื่อนไข $x(0) = A, \\, \\dot{x}(0) = 0$\n   - สมมติการกระจาย $x(t) = x_0(t) + \\epsilon x_1(t) + \\dots$\n   - อันดับที่ศูนย์ $O(1)$: $\\ddot{x}_0 + x_0 = 0 \\implies x_0(t) = A\\cos t$\n   - อันดับที่หนึ่ง $O(\\epsilon)$: $\\ddot{x}_1 + x_1 = -x_0^3 = -A^3 \\cos^3 t = -\\frac{3}{4}A^3 \\cos t - \\frac{1}{4}A^3 \\cos 3t$\n   - พจน์ $\\cos t$ ด้านขวามือมีสัญญาณความถี่ตรงกับความถี่ธรรมชาติของระบบ ทำให้เกิดพจน์เรโซแนนซ์ $x_1(t) \\propto t\\sin t$ (พจน์เซคิวลาร์) ซึ่งโตสู่อนันต์เมื่อ $t \\to \\infty$ ทำลายความถูกต้องของการประมาณค่า",
      "2. ระเบียบวิธีปวงกาเร-ลินด์สเตดท์ (Poincaré-Lindstedt Method):\n   - ปรับสเกลเวลา $\\tau = \\omega t$ โดยให้ความถี่ขึ้นกับ $\\epsilon$: $\\omega = 1 + \\epsilon \\omega_1 + \\epsilon^2 \\omega_2 + \\dots$\n   - สมการกลายเป็น: $\\omega^2 x''(\\tau) + x(\\tau) + \\epsilon x^3(\\tau) = 0$\n   - แทน $\\omega$ และจัดพจน์ $O(\\epsilon)$:\n   $$x_1'' + x_1 = -2\\omega_1 x_0'' - x_0^3 = (2\\omega_1 A - \\frac{3}{4}A^3)\\cos\\tau - \\frac{1}{4}A^3 \\cos 3\\tau$$\n   - ขจัดพจน์เซคิวลาร์โดยบังคับให้สัมประสิทธิ์ของ $\\cos\\tau$ เป็นศูนย์:\n   $$2\\omega_1 A - \\frac{3}{4}A^3 = 0 \\implies \\omega_1 = \\frac{3}{8}A^2$$\n   - สรุปความถี่ที่ปรับแก้ตามแอมพลิจูด: $\\omega = 1 + \\frac{3}{8}\\epsilon A^2 + O(\\epsilon^2)$ (ความถี่เปลี่ยนตามแอมพลิจูดในระบบไม่เป็นเชิงเส้น!)",
      "3. การประมาณค่า WKB (Wentzel-Kramers-Brillouin Semiclassical Approximation):\n   - สำหรับสมการชเรอดิงเงอร์ $-\\frac{\\hbar^2}{2m}\\psi'' + V(x)\\psi = E\\psi$\n   - สมมติ $\\psi(x) = \\exp\\left(\\frac{i}{\\hbar} S(x)\\right)$ และกระจาย $S(x) = S_0 + \\frac{\\hbar}{i}S_1 + \\dots$\n   - อันดับ $O(1)$: $S_0'(x) = \\pm \\sqrt{2m(E - V(x))} = \\pm p(x)$\n   - อันดับ $O(\\hbar)$: $S_1(x) = -\\frac{1}{2}\\ln p(x)$\n   - รวมผลลัพธ์:\n   $$\\psi_{\\text{WKB}}(x) = \\frac{C_+}{\\sqrt{p(x)}} e^{+\\frac{i}{\\hbar}\\int p\\,dx} + \\frac{C_-}{\\sqrt{p(x)}} e^{-\\frac{i}{\\hbar}\\int p\\,dx}$$\n   - ความน่าจะเป็นในการลอดอุโมงค์ควอนตัมผ่านกำแพงศักย์ (Gamow Factor for Alpha Decay):\n   $$T \\approx \\exp\\left( -\\frac{2}{\\hbar}\\int_{x_1}^{x_2} \\sqrt{2m(V(x) - E)} \\, dx \\right)$$"
    ],
    "takeaways": [
      "ในฟิสิกส์ชั้นสูง ปรากฏการณ์กว่า 99% (รวมทั้งอันตรกิริยาของอนุภาคใน QED) ถูกคำนวณผ่านทฤษฎีการรบกวน",
      "สูตรอัตราการสลายตัวให้อนุภาคแอลฟาของกามอฟ (Gamow Alpha Decay) อธิบายความสัมพันธ์ระหว่างพลังงานกับครึ่งชีวิตของนิวเคลียสได้แม่นยำอย่างอัศจรรย์ด้วยการประมาณค่า WKB นี้"
    ]
  },
  {
    "id": "AF-16",
    "numeral": "16",
    "category": "quantum_math",
    "titleTh": "การวิเคราะห์เชิงซ้อน ทฤษฎีบทเรซิดิว และปริพันธ์คอนทัวร์ในฟิสิกส์ (Complex Analysis & Residue Theorem)",
    "titleEn": "Cauchy-Riemann Equations, Cauchy's Integral Formula, Residue Theorem & Kramers-Kronig Relations",
    "badge": "คณิตศาสตร์ฟิสิกส์ 2 & 3 (Math Methods 2 & 3)",
    "coreConcept": "ฟังก์ชันตัวแปรเชิงซ้อนที่มีสมบัติวิเคราะห์ (Analytic Functions) ปฏิบัติตามสมการโคชี-รีมันน์ (Cauchy-Riemann Conditions) ทำให้ปริพันธ์ตามเส้นปิดในระนาบเชิงซ้อนขึ้นอยู่กับจุดเอกฐาน (Singularities/Poles) ภายในวิถีเท่านั้น ทฤษฎีบทเรซิดิว (Residue Theorem) และบทตั้งของจอร์แดน (Jordan's Lemma) ช่วยคำนวณปริพันธ์จริงที่แก้ยากในกลศาสตร์ควอนตัม ทฤษฎีการกระเจิง (S-matrix) และความสัมพันธ์คราเมอส์-โครนิก (Kramers-Kronig Relations) ที่เชื่อมโยงการดูดกลืนแสงกับการหักเหผ่านหลักความเป็นเหตุเป็นผล (Causality)",
    "displayFormula": "\\oint_C f(z)\\,dz = 2\\pi i \\sum_{k=1}^n \\text{Res}(f, z_k), \\quad \\text{Res}(f, z_0) = \\lim_{z \\to z_0} \\frac{1}{(m-1)!} \\frac{d^{m-1}}{dz^{m-1}}\\left[(z-z_0)^m f(z)\\right], \\quad \\chi_1(\\omega) = \\frac{2}{\\pi} \\mathcal{P} \\int_0^\\infty \\frac{\\omega' \\chi_2(\\omega')}{\\omega'^2 - \\omega^2} d\\omega'",
    "derivation": [
      "1. สมการโคชี-รีมันน์ (Cauchy-Riemann Equations): สำหรับ $f(z) = u(x,y) + i v(x,y)$ การที่อนุพันธ์ $f'(z)$ มีค่าเพียงหนึ่งเดียวไม่ขึ้นกับทิศทางการเข้าใกล้ บังคับให้:\n   $$\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\quad \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}$$\n   ส่งผลให้ทั้ง $u$ และ $v$ เป็นฟังก์ชันฮาร์มอนิกสอดคล้องกับสมการลาปลาซ $\\nabla^2 u = \\nabla^2 v = 0$ (ใช้แก้ศักย์ไฟฟ้าสถิตและพลศาสตร์ของไหล 2 มิติ)",
      "2. ทฤษฎีบทปริพันธ์ของโคชี (Cauchy's Integral Theorem & Formula):\n   - ถ้า $f(z)$ วิเคราะห์ได้ตลอดอาณาบริเวณปิด $D$ ที่ล้อมรอบด้วยวิถีปิด $C$:\n   $$\\oint_C f(z)\\,dz = 0$$\n   - ค่าของฟังก์ชัน ณ จุด $z_0$ ภายในวิถีถูกกำหนดโดยค่าขอบทั้งหมดอย่างสมบูรณ์:\n   $$f(z_0) = \\frac{1}{2\\pi i} \\oint_C \\frac{f(z)}{z - z_0}\\,dz, \\quad f^{(n)}(z_0) = \\frac{n!}{2\\pi i} \\oint_C \\frac{f(z)}{(z - z_0)^{n+1}}\\,dz$$",
      "3. อนุกรมโลรองต์และทฤษฎีบทเรซิดิว (Laurent Series & Residue Theorem):\n   - รอบจุดเอกฐาน $z_0$ ฟังก์ชันสามารถกระจายอนุกรมโลรองต์ $f(z) = \\sum_{n=-\\infty}^\\infty a_n (z-z_0)^n$\n   - สัมประสิทธิ์พจน์ $a_{-1}$ เรียกว่า เรซิดิว (Residue): $\\text{Res}(f, z_0) = a_{-1} = \\frac{1}{2\\pi i}\\oint f(z)\\,dz$\n   - ผลรวมปริพันธ์รอบเส้นปิดใดๆ:\n   $$\\oint_C f(z)\\,dz = 2\\pi i \\sum_{k=1}^N \\text{Res}(f, z_k)$$",
      "4. ตัวอย่างการประยุกต์: การหาปริพันธ์จริง $\\int_{-\\infty}^\\infty \\frac{\\cos(kx)}{x^2 + a^2}\\,dx$:\n   - พิจารณา $f(z) = \\frac{e^{ikz}}{z^2 + a^2}$ บนวิถีครึ่งวงกลมระนาบบน (Upper Half Plane) รัศมี $R \\to \\infty$\n   - โพลแบบเชิงเดียวอยู่ที่ $z = +ia$ ในระนาบบน (สำหรับ $a > 0, k > 0$)\n   - คำนวณเรซิดิว: $\\text{Res}(f, ia) = \\lim_{z \\to ia} (z - ia) \\frac{e^{ikz}}{(z-ia)(z+ia)} = \\frac{e^{-ka}}{2ia}$\n   - ตามบทตั้งของจอร์แดน (Jordan's Lemma) ส่วนโค้งที่ $R \\to \\infty$ มีค่าเป็นศูนย์:\n   $$\\int_{-\\infty}^\\infty \\frac{e^{ikx}}{x^2 + a^2}\\,dx = 2\\pi i \\left(\\frac{e^{-ka}}{2ia}\\right) = \\frac{\\pi}{a} e^{-ka} \\implies \\int_{-\\infty}^\\infty \\frac{\\cos(kx)}{x^2 + a^2}\\,dx = \\frac{\\pi}{a} e^{-ka}$$"
    ],
    "takeaways": [
      "หลักความเป็นเหตุเป็นผล (Causality) กำหนดให้การตอบสนองเกิดขึ้นหลังสิ่งเร้าเสมอ ซึ่งทางคณิตศาสตร์หมายถึงฟังก์ชันการตอบสนองวิเคราะห์ได้ในครึ่งระนาบบน นำไปสู่ความสัมพันธ์คราเมอส์-โครนิก",
      "การอินทิเกรตคอนทัวร์ในระนาบเชิงซ้อนเป็นหัวใจในการหาฟังก์ชันโพรพากาเตอร์ (Feynman Propagator) และการแปลงลาปลาซผกผันผ่านวิถีโบรอมวิช (Bromwich Contour)"
    ]
  },
  {
    "id": "AF-17",
    "numeral": "17",
    "category": "pde",
    "titleTh": "ฟังก์ชันกรีนและปัญหาค่าขอบเขตสำหรับสมการเชิงอนุพันธ์ย่อย (Green's Functions & Inhomogeneous PDEs)",
    "titleEn": "Dirac Delta Impulse Response, Poisson, Helmholtz, and Retarded Wave Propagators",
    "badge": "คณิตศาสตร์ฟิสิกส์ 2 & 3 (Math Methods 2 & 3)",
    "coreConcept": "ฟังก์ชันกรีน (Green's Function $G(\\mathbf{r}, \\mathbf{r}'))$ คือผลตอบสนองของระบบเชิงเส้นต่อสิ่งกระตุ้นแบบจุดเดลตาของดิแรก (Point Impulse $\\delta(\\mathbf{r} - \\mathbf{r}')$) เมื่อทราบฟังก์ชันกรีนของตัวดำเนินการเชิงอนุพันธ์ $\\mathcal{L}$ จะสามารถหาผลเฉลยของสมการไม่เอกพันธ์ $\\mathcal{L} \\Phi = f(\\mathbf{r})$ สำหรับแหล่งกำเนิดใดๆ ได้ทันทีผ่านการสังวัตนาการ (Convolution) รวมทั้งการแก้ปัญหาขอบเขตด้วยวิธีภาพสะท้อน (Method of Images)",
    "displayFormula": "\\mathcal{L} G(\\mathbf{r}, \\mathbf{r}') = \\delta^3(\\mathbf{r} - \\mathbf{r}'), \\quad \\Phi(\\mathbf{r}) = \\int_V G(\\mathbf{r}, \\mathbf{r}') f(\\mathbf{r}')\\, d^3r' + \\oint_{\\partial V} \\left[ G \\nabla' \\Phi - \\Phi \\nabla' G \\right] \\cdot d\\mathbf{S}'",
    "derivation": [
      "1. นิยามสมการไม่เอกพันธ์สำหรับตัวดำเนินการ $\\mathcal{L}$ เชิงเส้น:\n   $$\\mathcal{L} u(\\mathbf{x}) = f(\\mathbf{x})$$\n   สมมติให้ $G(\\mathbf{x}, \\mathbf{x}')$ เป็นผลเฉลยเมื่อแหล่งกำเนิดเป็นจุดเดลตา $\\mathcal{L} G(\\mathbf{x}, \\mathbf{x}') = \\delta(\\mathbf{x} - \\mathbf{x}')$",
      "2. โดยหลักการซ้อนทับ (Superposition Principle):\n   $$u(\\mathbf{x}) = \\int G(\\mathbf{x}, \\mathbf{x}') f(\\mathbf{x}')\\, d\\mathbf{x}'$$\n   ตรวจสอบโดยใช้ $\\mathcal{L}$ กระทำต่อ $u$:\n   $$\\mathcal{L} u(\\mathbf{x}) = \\int [\\mathcal{L} G(\\mathbf{x}, \\mathbf{x}')] f(\\mathbf{x}')\\, d\\mathbf{x}' = \\int \\delta(\\mathbf{x} - \\mathbf{x}') f(\\mathbf{x}')\\, d\\mathbf{x}' = f(\\mathbf{x})$$",
      "3. ฟังก์ชันกรีนของสมการปัวซง 3 มิติ ($\\nabla^2 G = \\delta^3(\\mathbf{r} - \\mathbf{r}')$):\n   - จากความสมมาตรทรงกลมรอบจุด $\\mathbf{r}'$: สำหรับ $R = |\\mathbf{r} - \\mathbf{r}'| > 0$, $\\frac{1}{R^2}\\frac{d}{dR}(R^2 \\frac{dG}{dR}) = 0 \\implies G(R) = -\\frac{C}{R}$\n   - หาค่าคงที่ $C$ ด้วยทฤษฎีบทการลู่ออกของเกาส์รอบทรงกลมรัศมี $\\epsilon \\to 0$:\n   $$\\int_V \\nabla^2 G \\, d^3r = \\oint_S \\nabla G \\cdot d\\mathbf{a} = \\left(\\frac{C}{\\epsilon^2}\\right) (4\\pi \\epsilon^2) = 4\\pi C = 1 \\implies C = \\frac{1}{4\\pi}$$\n   $$\\therefore G(\\mathbf{r}, \\mathbf{r}') = -\\frac{1}{4\\pi |\\mathbf{r} - \\mathbf{r}'|}$$\n   นำไปสู่สูตรศักย์ไฟฟ้าสถิตคลาสสิก: $\\Phi(\\mathbf{r}) = \\frac{1}{4\\pi\\varepsilon_0} \\int \\frac{\\rho(\\mathbf{r}')}{|\\mathbf{r} - \\mathbf{r}'|}\\, d^3r'$",
      "4. ฟังก์ชันกรีนหน่วงเวลาของสมการคลื่น (Retarded Green's Function):\n   - สำหรับตัวดำเนินการดาล็องแบร์ $\\square = \\nabla^2 - \\frac{1}{c^2}\\frac{\\partial^2}{\\partial t^2}$:\n   $$G^{(+)}(\\mathbf{r}, t; \\mathbf{r}', t') = -\\frac{\\delta\\left(t - t' - \\frac{|\\mathbf{r} - \\mathbf{r}'|}{c}\\right)}{4\\pi |\\mathbf{r} - \\mathbf{r}'|}$$\n   - สัญญาณเดินทางด้วยอัตราเร็วแสง $c$ ไปข้างหน้าในเวลา (Retarded Time $t_r = t - R/c$) ซึ่งให้กำเนิดศักย์ลีเออนาร์ด-วีเคิร์ต (Liénard-Wiechert Potentials) ของประจุเคลื่อนที่เร่งความเร็ว"
    ],
    "takeaways": [
      "ฟังก์ชันกรีนคือการสร้าง 'บล็อกตัวต่อพื้นฐาน' ทางฟิสิกส์: ทุกปรากฏการณ์ที่ซับซ้อนคือผลรวมเชิงเส้นของผลตอบสนองต่อจุดเดลตา",
      "ในทฤษฎีสนามควอนตัม (QFT) ฟังก์ชันกรีนสองจุด (Two-point Green's function) คือตัวแทนของโพรพากาเตอร์ (Feynman Propagator) ที่อนุภาคเสมือนแลกเปลี่ยนกันระหว่างอันตรกิริยา"
    ]
  },
  {
    "id": "AF-18",
    "numeral": "18",
    "category": "tensor",
    "titleTh": "รูปแบบเชิงอนุพันธ์และการรวมสมการแมกซ์เวลล์ด้วยเรขาคณิต (Differential Forms & Exterior Calculus)",
    "titleEn": "Wedge Product, Exterior Derivative, Hodge Star & Geometrized Maxwell's Equations",
    "badge": "คณิตศาสตร์ฟิสิกส์ 3 (Math Methods 3)",
    "coreConcept": "แคลคูลัสภายนอก (Exterior Calculus) แปลงกฎทางฟิสิกส์คลาสสิกที่เขียนด้วยเกรเดียนต์ ไดเวอร์เจนซ์ และเคิร์ลในพิกัดเฉพาะ ให้กลายเป็นภาษาเรขาคณิตอิสระเชิงแมนิโฟลด์ (Coordinate-Free Geometry) โดยใช้รูปแบบเชิงอนุพันธ์ (Differential Forms), ผลคูณลิ่ม (Wedge Product $\\wedge$), ตัวดำเนินการภายนอก $d$, และฮอดจ์สตาร์ $\\star$ สมการแมกซ์เวลล์ทั้ง 4 สมการที่ซับซ้อนจะยุบรวมเหลือเพียง 2 สมการเรขาคณิตอันงดงาม: $dF = 0$ และ $d\\star F = \\mu_0 J$",
    "displayFormula": "F = dA, \\quad dF = 0, \\quad d\\star F = \\mu_0 J, \\quad \\int_{\\partial M} \\omega = \\int_M d\\omega",
    "derivation": [
      "1. พื้นฐานของรูปแบบเชิงอนุพันธ์ (Differential $p$-forms):\n   - สเกลาร์คือ $0$-form, เวกเตอร์ศักย์คือ $1$-form: $A = -\\phi\\,dt + A_x\\,dx + A_y\\,dy + A_z\\,dz$\n   - ผลคูณลิ่ม (Wedge Product) มีสมบัติสลับที่ต่อต้าน (Antisymmetric): $dx^\\mu \\wedge dx^\\nu = -dx^\\nu \\wedge dx^\\mu$ และ $dx^\\mu \\wedge dx^\\mu = 0$",
      "2. อนุพันธ์ภายนอก (Exterior Derivative $d$):\n   - สำหรับ $p$-form $\\omega$, $d\\omega$ เป็น $(p+1)$-form โดยมีสมบัติพื้นฐานที่สุดคือ $d^2 = d(d\\omega) \\equiv 0$ (ขอบของขอบเป็นศูนย์เสมอ: $\\partial(\\partial M) = 0$)\n   - $d$ บน 0-form ให้เวกเตอร์เกรเดียนต์, $d$ บน 1-form ให้เวกเตอร์เคิร์ล, $d\\star$ ให้เวกเตอร์ไดเวอร์เจนซ์",
      "3. เทนเซอร์สนามแม่เหล็กไฟฟ้าในรูป $2$-form ($F = dA$):\n   - กระจาย $F = dA = d(-\\phi dt + A_i dx^i)$:\n   $$F = E_x\\, dx \\wedge dt + E_y\\, dy \\wedge dt + E_z\\, dz \\wedge dt + B_x\\, dy \\wedge dz + B_y\\, dz \\wedge dx + B_z\\, dx \\wedge dy$$",
      "4. สมการแมกซ์เวลล์ชุดเอกพันธ์ (Homogeneous Maxwell Equations):\n   - หาอนุพันธ์ภายนอกของ $F$:\n   $$dF = d(dA) = d^2 A \\equiv 0$$\n   - สมการ $dF = 0$ เทียบเท่ากับสมการเวกเตอร์ 2 สมการพร้อมกัน:\n   $$\\nabla \\cdot \\mathbf{B} = 0 \\quad \\text{และ} \\quad \\nabla \\times \\mathbf{E} + \\frac{\\partial \\mathbf{B}}{\\partial t} = 0$$\n   พิสูจน์ได้ว่าการไม่มีขั้วเดี่ยวแม่เหล็กและกฎการเหนี่ยวนำของฟาราเดย์เป็นผลพลอยได้เชิงเรขาคณิตแท้จริงจาก $d^2 = 0$!",
      "5. สมการแมกซ์เวลล์ชุดไม่เอกพันธ์ (Inhomogeneous Equations):\n   - ฮอดจ์สตาร์ดูอัล $\\star F$ แปลง 2-form ไปเป็น $(4-2)=2$-form ในกาล-อวกาศ 4 มิติ:\n   $$d\\star F = \\mu_0 J$$\n   - ให้สมการกฎของเกาส์ $\\nabla \\cdot \\mathbf{E} = \\rho/\\varepsilon_0$ และกฎแอมแปร์-แมกซ์เวลล์ $\\nabla \\times \\mathbf{B} - \\frac{1}{c^2}\\frac{\\partial \\mathbf{E}}{\\partial t} = \\mu_0 \\mathbf{J}$ ครบถ้วน",
      "6. ทฤษฎีบทสโตกส์นัยทั่วไป (Generalized Stokes' Theorem):\n   $$\\int_{\\partial M} \\omega = \\int_M d\\omega$$\n   สูตรบรรทัดเดียวนี้รวมทั้ง Fundamental Theorem of Calculus, Green's Theorem, Divergence Theorem, และ Stokes' Curl Theorem เข้าเป็นหนึ่งเดียวอย่างสมบูรณ์แบบ"
    ],
    "takeaways": [
      "อนุรักษ์ประจุไฟฟ้าเกิดขึ้นโดยอัตโนมัติ: $d(d\\star F) = d(\\mu_0 J) = 0 \\implies dJ = 0$ (สมการความต่อเนื่อง $\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\mathbf{J} = 0$)",
      "ภาษา differential forms เป็นเครื่องมือหลักในการสร้างทฤษฎีเกจ (Yang-Mills gauge theory) และเรขาคณิตของสัมพัทธภาพทั่วไป"
    ]
  },
  {
    "id": "AF-19",
    "numeral": "19",
    "category": "analytical",
    "titleTh": "กรุปของลี พีชคณิตของลี และความสมมาตรต่อเนื่องในฟิสิกส์ (Lie Groups, Lie Algebras & Symmetries)",
    "titleEn": "Generators of Continuous Transformations, Commutators, SO(3), SU(2) & Quantum Spin",
    "badge": "คณิตศาสตร์ฟิสิกส์ 3 (Math Methods 3)",
    "coreConcept": "ความสมมาตรคือหัวใจนำทางของฟิสิกส์สมัยใหม่: กรุปของลี (Lie Groups) คือกรุปการแปลงแบบต่อเนื่องที่เป็นแมนิโฟลด์เชิงเรขาคณิต พีชคณิตของลี (Lie Algebra) อธิบายพฤติกรรมเฉพาะที่ (Infinitesimal Transformations) ผ่านตัวก่อกำเนิด (Generators) และความสัมพันธ์การสลับที่ (Commutation Relations) เช่น กรุปการหมุน 3 มิติ $SO(3)$ และกรุปควอนตัมยูนิทารี $SU(2)$ ที่ไขปริศนาสปินของอิเล็กตรอนและการหมุน $720^\\circ$",
    "displayFormula": "U(\\boldsymbol{\\theta}) = \\exp\\left( -\\frac{i}{\\hbar} \\boldsymbol{\\theta} \\cdot \\mathbf{J} \\right), \\quad [J_i, J_j] = i \\hbar \\epsilon_{ijk} J_k, \\quad \\left[ \\frac{\\sigma_i}{2}, \\frac{\\sigma_j}{2} \\right] = i \\epsilon_{ijk} \\frac{\\sigma_k}{2}",
    "derivation": [
      "1. การแปลงต่อเนื่องขนาดเล็กยิ่งยวด (Infinitesimal Transformation):\n   - พิจารณาการเลื่อนตำแหน่งตามเวลา $t$: ตัวดำเนินการก่อกำเนิดคือฮามิลโทเนียน $\\hat{H}$:\n   $$\\psi(t) = e^{-i \\hat{H} t / \\hbar} \\psi(0)$$\n   - พิจารณาการเลื่อนตำแหน่งในปริภูมิ $x$: ตัวดำเนินการก่อกำเนิดคือโมเมนตัมเชิงเส้น $\\hat{p}_x = -i\\hbar \\frac{\\partial}{\\partial x}$",
      "2. ตัวก่อกำเนิดการหมุนใน 3 มิติ (Generators of $SO(3)$):\n   - หมุนรอบแกน $z$ ด้วยมุมเล็ก $\\delta\\theta$: $x' = x - y\\,\\delta\\theta, \\; y' = y + x\\,\\delta\\theta, \\; z' = z$\n   - ตัวดำเนินการโมเมนตัมเชิงมุม $J_z = -i\\hbar (x \\partial_y - y \\partial_x) = x p_y - y p_x$\n   - เมื่อคำนวณการสลับที่ (Commutator) ระหว่างแกนต่างๆ:\n   $$[J_x, J_y] = J_x J_y - J_y J_x = i\\hbar J_z, \\quad [J_i, J_j] = i\\hbar \\epsilon_{ijk} J_k$$\n   นี่คือพีชคณิตของลี $\\mathfrak{so}(3)$",
      "3. กรุปหุ้มสากล $SU(2)$ และสปิน-1/2 (Universal Covering Group & Pauli Matrices):\n   - เมทริกซ์เพาลี (Pauli Matrices):\n   $$\\sigma_x = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\quad \\sigma_y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}, \\quad \\sigma_z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$$\n   - ตัวดำเนินการสปิน $S_i = \\frac{\\hbar}{2}\\sigma_i$ สอดคล้องกับพีชคณิตเดียวกัน: $[S_i, S_j] = i\\hbar \\epsilon_{ijk} S_k$\n   - การหมุนสปินเนอร์ด้วยมุม $\\theta$ รอบแกน $\\hat{\\mathbf{n}}$:\n   $$U(\\theta) = \\exp\\left( -i \\frac{\\theta}{2} \\hat{\\mathbf{n}} \\cdot \\boldsymbol{\\sigma} \\right) = I \\cos\\left(\\frac{\\theta}{2}\\right) - i (\\hat{\\mathbf{n}} \\cdot \\boldsymbol{\\sigma}) \\sin\\left(\\frac{\\theta}{2}\\right)$$",
      "4. ปริศนาการหมุน $360^\\circ$ ปะทะ $720^\\circ$ ($4\\pi$ Periodicity):\n   - เมื่อหมุนครบ 1 รอบเต็ม $\\theta = 2\\pi$:\n   $$U(2\\pi) = \\cos(\\pi) I - i \\sin(\\pi) = -I$$\n   ฟังก์ชันคลื่นของเฟอร์มิออนจะกลับเครื่องหมายเป็นลบ! ($|\\psi\\rangle \\to -|\\psi\\rangle$)\n   - ต้องหมุน $\\theta = 4\\pi$ ($720^\\circ$) จึงจะได้ $U(4\\pi) = +I$ นำสปินเนอร์กลับสู่สถานะเดิมอย่างแท้จริง ซึ่งผ่านการทดลองยืนยันด้วยนิวตรอนอินเตอร์เฟอโรเมทรี (Neutron Interferometry)"
    ],
    "takeaways": [
      "ทฤษฎีบทเนอเธอร์ในรูปแบบกรุปของลี: ทุกพารามิเตอร์ต่อเนื่องของกรุปความสมมาตรทำให้เกิดปริมาณอนุรักษ์ 1 ชนิด (สมมาตรการเลื่อนเวลา $\\to$ พลังงาน, เลื่อนปริภูมิ $\\to$ โมเมนตัม, การหมุน $\\to$ โมเมนตัมเชิงมุม)",
      "แบบจำลองมาตรฐานของฟิสิกส์อนุภาค (Standard Model) ถูกสร้างขึ้นบนโครงสร้างกรุปเกจของลี $SU(3)_C \\times SU(2)_L \\times U(1)_Y$"
    ]
  },
  {
    "id": "AF-20",
    "numeral": "20",
    "category": "quantum_math",
    "titleTh": "ปริพันธ์ตามวิถีในกลศาสตร์ควอนตัมของไฟน์แมน (Feynman Path Integral Formulation)",
    "titleEn": "Sum Over Histories, Propagator, Classical Limit via Stationary Phase & Quantum Fluctuations",
    "badge": "คณิตศาสตร์ฟิสิกส์ 3 (Math Methods 3)",
    "coreConcept": "ริชาร์ด ไฟน์แมน ได้ปฏิวัติมุมมองกลศาสตร์ควอนตัม: แทนที่อนุภาคจะเคลื่อนที่ตามวิถีคลาสสิกวิถีเดียว อนุภาคควอนตัมจะ 'สุ่มสำรวจทุกเส้นทางที่เป็นไปได้พร้อมๆ กัน' (Sum Over Histories) โดยแต่ละเส้นทางจะมีแอมพลิจูดความน่าจะเป็นถ่วงน้ำหนักด้วยเฟสเชิงซ้อน $e^{i S[x(t)] / \\hbar}$ ซึ่งแอ็กชันคลาสสิก $S$ คือตัวกำหนดเฟส ในลิมิต $\\hbar \\to 0$ วิถีที่อยู่ห่างจากวิถีจริงจะหักล้างกันเองด้วยการแทรกสอดแบบทำลายล้าง เหลือเพียงวิถีที่แปรผันเป็นศูนย์ $\\delta S = 0$ ตามหลักการกระทำนิ่งของแฮมิลตัน",
    "displayFormula": "K(x_f, t_f; x_i, t_i) = \\int \\mathcal{D}x(t) \\exp\\left( \\frac{i}{\\hbar} \\int_{t_i}^{t_f} \\mathcal{L}(x, \\dot{x}, t) \\, dt \\right), \\quad \\lim_{\\hbar \\to 0} \\implies \\delta S = 0",
    "derivation": [
      "1. ตัวแผ่คลื่นควอนตัม (Quantum Propagator / Kernel $K$):\n   - แอมพลิจูดความน่าจะเป็นที่อนุภาคเริ่มต้นที่ $x_i$ ณ เวลา $t_i$ จะไปปรากฏที่ $x_f$ ณ เวลา $t_f$:\n   $$K(x_f, t_f; x_i, t_i) = \\langle x_f | e^{-i \\hat{H}(t_f - t_i)/\\hbar} | x_i \\rangle$$",
      "2. การแบ่งช่วงเวลาย่อยเป็นอนันต์ (Time-slicing Discretization):\n   - แบ่งช่วงเวลา $(t_f - t_i)$ ออกเป็น $N$ ช่วงสั้นๆ $\\epsilon = \\Delta t = (t_f - t_i)/N$ และแทรกความสมบูรณ์ของสถานะ $\\int |x_k\\rangle\\langle x_k| dx_k = I$ ในทุกช่วงย่อย:\n   $$K = \\lim_{N\\to\\infty} \\int dx_1 \\dots dx_{N-1} \\prod_{k=0}^{N-1} \\langle x_{k+1} | e^{-i \\hat{H}\\epsilon/\\hbar} | x_k \\rangle$$",
      "3. การประเมินเมทริกซ์เอลิเมนต์สั้นๆ:\n   - สำหรับ $\\hat{H} = \\frac{\\hat{p}^2}{2m} + V(\\hat{x})$ โดยใช้ Baker-Campbell-Hausdorff / Trotter product formula:\n   $$\\langle x_{k+1} | e^{-i \\hat{H}\\epsilon/\\hbar} | x_k \\rangle \\approx \\left(\\frac{m}{2\\pi i \\hbar \\epsilon}\\right)^{1/2} \\exp\\left( \\frac{i}{\\hbar} \\epsilon \\left[ \\frac{1}{2}m\\left(\\frac{x_{k+1}-x_k}{\\epsilon}\\right)^2 - V\\left(\\frac{x_{k+1}+x_k}{2}\\right) \\right] \\right)$$\n   - สังเกตว่าพจน์ในวงเล็บใหญ่คือ $\\mathcal{L} = T - V$ ลากรานเจียนคลาสสิก!",
      "4. การรวมลิมิตสู่ฟังก์ชันนัลอินทิกรัล (Path Integral Measure):\n   - เมื่อ $\\epsilon \\to 0, N \\to \\infty$ ผลรวม $\\sum_{k} \\epsilon \\mathcal{L}_k \\to \\int_{t_i}^{t_f} \\mathcal{L}\\,dt = S[x(t)]$ แอ็กชันคลาสสิก:\n   $$K(x_f, t_f; x_i, t_i) = \\int \\mathcal{D}x(t) \\exp\\left( \\frac{i}{\\hbar} S[x(t)] \\right)$$\n   โดยที่ $\\mathcal{D}x(t) = \\lim_{N\\to\\infty} \\left(\\frac{m}{2\\pi i \\hbar \\epsilon}\\right)^{N/2} \\prod_{k=1}^{N-1} dx_k$",
      "5. การฟื้นคืนกลศาสตร์คลาสสิก (Classical Limit & Stationary Phase):\n   - ในสเกลมาโครสโคปิก ค่า $S \\gg \\hbar$ อย่างมหาศาล ทำให้เฟส $\\frac{S}{\\hbar}$ หมุนวนหลายพันล้านรอบแม้เส้นทางจะขยับเพียงเล็กน้อย\n   - วิถีที่ใกล้เคียงจะมีการแทรกสอดแบบทำลายล้าง (Destructive Interference) หักล้างกันจนเหลือศูนย์อย่างสมบูรณ์\n   - ยกเว้นเฉพาะบริเวณรอบ 'เส้นทางวิกฤต' $x_{\\text{cl}}(t)$ ที่ซึ่ง $\\frac{\\delta S}{\\delta x} = 0$ (จุดที่การแปรผันของเฟสหยุดนิ่ง Stationary Phase):\n   $$\\delta S[x_{\\text{cl}}] = 0 \\iff \\frac{d}{dt}\\left(\\frac{\\partial \\mathcal{L}}{\\partial \\dot{x}}\\right) - \\frac{\\partial \\mathcal{L}}{\\partial x} = 0$$\n   กลศาสตร์ลากรานจ์ดั้งเดิมของนิวตันจึงเป็นเพียงภาพสะท้อนของการแทรกสอดคลื่นควอนตัมในระดับมหภาค!"
    ],
    "takeaways": [
      "การทดลองช่องคู่ (Double-slit Experiment) คือตัวอย่างที่ง่ายที่สุดของ path integral: ผลรวมวิถีผ่านรูซ้ายบวกรูขวา $K = K_1 + K_2$",
      "การแปลงวิค (Wick Rotation $t \\to -i\\tau$) แปลงตัวแผ่คลื่นควอนตัม $e^{iS/\\hbar}$ ให้กลายเป็นปัจจัยโบลต์ซมันน์ $e^{-H/k_B T}$ ในกลศาสตร์สถิติ เชื่อมโยงฟิสิกส์ควอนตัมและอุณหพลศาสตร์เข้าด้วยกันอย่างลึกซึ้ง"
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
