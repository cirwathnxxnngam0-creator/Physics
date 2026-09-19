/**
 * textbook_library_content.js - Comprehensive University Textbooks & Modular Learning Units Registry
 * Part of PhysicsNoza 3.0 Architecture
 *
 * Provides structured metadata and dynamic rendering for:
 *  - 8 Master Global Physics & Engineering Textbooks (1,626+ pages)
 *  - 39 Focused Modular Chapter Units (Split PDFs with exact page ranges)
 *  - Interactive In-App PDF Reader Modal
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TextbookLibrary = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MASTER_TEXTBOOKS = [
    {
      id: 'morin-mechanics',
      title: 'Introduction to Classical Mechanics: With Problems and Solutions',
      shortTitle: 'Classical Mechanics',
      author: 'David Morin',
      institution: 'Harvard University / Cambridge University Press',
      year: '2008',
      pages: 739,
      sizeBytes: 7133538,
      sizeMb: '7.13 MB',
      category: 'mechanics',
      categoryLabel: 'กลศาสตร์และพลศาสตร์',
      license: 'Educational Reference',
      pdfPath: 'textbooks/morin_classical_mechanics.pdf',
      badgeColor: '#38BDF8',
      description: 'ตำรากลศาสตร์ระดับปริญญาตรีที่เป็นมาตรฐานสากล ครอบคลุมการแกว่งกวัดไม่เชิงเส้น พิกัดลากรานจ์ เวกเตอร์ 2D/3D พร้อมแรงต้านอากาศ และการแก้สมการเชิงอนุพันธ์เชิงตัวเลข',
      keyChapters: [
        'Ch. 1: Strategies for solving problems (Numerical ODEs, pp. 11–14)',
        'Ch. 3: Using F=ma & Drag Forces (Linear vs Quadratic, pp. 60–68)',
        'Ch. 4: Oscillations & Normal Modes (pp. 121–157)',
        'Ch. 6: The Lagrangian Method (Euler-Lagrange, pp. 238–300)',
        'Ch. 8–9: Angular Momentum & Inertia Tensor'
      ]
    },
    {
      id: 'tong-dynamics',
      title: 'Classical Dynamics (Cambridge Tripos Lecture Notes)',
      shortTitle: 'Classical Dynamics',
      author: 'Prof. David Tong',
      institution: 'University of Cambridge DAMTP',
      year: '2005 (Rev. 2015)',
      pages: 143,
      sizeBytes: 1093743,
      sizeMb: '1.09 MB',
      category: 'mechanics',
      categoryLabel: 'กลศาสตร์และพลศาสตร์',
      license: 'Open Academic Access',
      pdfPath: 'textbooks/tong_classical_dynamics.pdf',
      badgeColor: '#10B981',
      description: 'บันทึกคำบรรยายหลักสูตร Cambridge Tripos DAMTP กลศาสตร์คลาสสิกขั้นสูง รูปนัยลากรานเจียน (Lagrangian) และฮามิลโทเนียน (Hamiltonian) พร้อมเรขาคณิตเฟสสเปซ',
      keyChapters: [
        'Ch. 1: Newtonian Mechanics & Energy Dissipation (pp. 1–15)',
        'Ch. 2: Lagrangian Formalism & Noether Theorem (pp. 16–50)',
        'Ch. 3: Motion of Rigid Bodies & Euler Equations (pp. 51–85)',
        'Ch. 4: Hamiltonian Formalism, Poisson Brackets & Phase Space (pp. 86–139)'
      ]
    },
    {
      id: 'baker-statics',
      title: 'Engineering Statics: Open and Interactive',
      shortTitle: 'Engineering Statics',
      author: 'Daniel W. Baker & William Haynes',
      institution: 'Colorado State University / UMN Open Textbook Library',
      year: '2020 (Ed. 1)',
      pages: 457,
      sizeBytes: 25039253,
      sizeMb: '25.04 MB',
      category: 'statics_materials',
      categoryLabel: 'สถิตยศาสตร์วิศวกรรม',
      license: 'CC BY-NC-SA 4.0',
      pdfPath: 'textbooks/engineering_statics_baker.pdf',
      badgeColor: '#F59E0B',
      description: 'ตำราสถิตยศาสตร์วิศวกรรมเปิดมาตรฐานสากล เวกเตอร์แรงใน 2 มิติและ 3 มิติ สมดุลอนุภาคและโครงสร้าง ทรัส โครงข้อแข็ง แผนภาพแรงเฉือนและโมเมนต์ดัด (SFD/BMD)',
      keyChapters: [
        'Ch. 1–2: Introduction & Vectors in 2D/3D (pp. 13–68)',
        'Ch. 3: Equilibrium of Particles (pp. 69–132)',
        'Ch. 4–5: Moments & Rigid Body Equilibrium (pp. 133–211)',
        'Ch. 6: Equilibrium of Structures (Trusses & Frames, pp. 212–243)',
        'Ch. 8: Internal Forces in Beams (Shear & Bending Moment Diagrams)'
      ]
    },
    {
      id: 'roylance-materials',
      title: 'Modules in Mechanics of Materials',
      shortTitle: 'Mechanics of Materials',
      author: 'Prof. David Roylance',
      institution: 'MIT Department of Materials Science and Engineering (OCW 3.11)',
      year: '2000 (Ed. 1)',
      pages: 359,
      sizeBytes: 7347626,
      sizeMb: '7.35 MB',
      category: 'statics_materials',
      categoryLabel: 'กำลังวัสดุ & ความเค้น',
      license: 'CC BY-NC-SA 4.0',
      pdfPath: 'textbooks/mit_mechanics_of_materials_roylance.pdf',
      badgeColor: '#A855F7',
      description: 'ชุดโมดูลวิชากำลังวัสดุและกลศาสตร์วัสดุของ MIT ครอบคลุมเทนเซอร์ความเค้น (Stress Tensor) ความเครียด กฎของฮุก วงกลมมอร์ (Mohr\'s Circle) และการดัดคาน',
      keyChapters: [
        'Modules 1–4: Uniaxial Stress, Strain & Elastic Constitutive Laws',
        'Module 8: Transformation of Stress & Mohr\'s Circle (pp. 112–126)',
        'Modules 10–12: Bending Stresses & Deflections in Beams (pp. 137–178)',
        'Modules 18–22: Yield Criteria (Tresca & von Mises), Fracture & Fatigue'
      ]
    },
    {
      id: 'tong-em',
      title: 'Electromagnetism (Cambridge Tripos Lecture Notes)',
      shortTitle: 'Electromagnetism',
      author: 'Prof. David Tong',
      institution: 'University of Cambridge DAMTP',
      year: '2015',
      pages: 236,
      sizeBytes: 1882451,
      sizeMb: '1.88 MB',
      category: 'electromagnetism',
      categoryLabel: 'ไฟฟ้าและแม่เหล็ก',
      license: 'Open Academic Access',
      pdfPath: 'textbooks/tong_electromagnetism.pdf',
      badgeColor: '#38BDF8',
      description: 'ไฟฟ้าสถิต สนามแม่เหล็ก สมการแมกซ์เวลล์ (Maxwell\'s Equations) กฎการเหนี่ยวนำของฟาราเดย์ คลื่นแม่เหล็กไฟฟ้า และทฤษฎีสัมพัทธภาพพิเศษของแม่เหล็กไฟฟ้า',
      keyChapters: [
        'Ch. 1–2: Electrostatics & Gauss\'s Law (pp. 9–48)',
        'Ch. 3: Magnetostatics & Ampère\'s Law (pp. 49–74)',
        'Ch. 4: Electrodynamics & Maxwell Equations (pp. 75–102)',
        'Ch. 5: Electromagnetism & Special Relativity (pp. 103–141)',
        'Ch. 6: Electromagnetic Waves & Polarization (pp. 142–180)'
      ]
    },
    {
      id: 'tong-vector',
      title: 'Vector Calculus (Cambridge Tripos Lecture Notes)',
      shortTitle: 'Vector Calculus',
      author: 'Prof. David Tong',
      institution: 'University of Cambridge DAMTP',
      year: '2018',
      pages: 137,
      sizeBytes: 6766206,
      sizeMb: '6.77 MB',
      category: 'math_methods',
      categoryLabel: 'คณิตศาสตร์และเวกเตอร์',
      license: 'Open Academic Access',
      pdfPath: 'textbooks/tong_vector_calculus.pdf',
      badgeColor: '#EC4899',
      description: 'รากฐานแคลคูลัสเวกเตอร์ สนามสเกลาร์และเวกเตอร์ เกรเดียนต์ ไดเวอร์เจนซ์ เคิร์ล และการพิสูจน์ทฤษฎีบทการลู่ออกของเกาส์ (Gauss\'s Divergence Theorem) และสโตกส์',
      keyChapters: [
        'Ch. 1: Curves and Surfaces in 3D Space (Tangent, Normal, Arc length)',
        'Ch. 2: Gradient, Divergence, and Curl (Operator identities)',
        'Ch. 3: Line, Surface, and Volume Integrals',
        'Ch. 4: Fundamental Theorems: Gauss\'s Divergence & Stokes\' Theorems',
        'Ch. 5: Curvilinear Coordinates (Cylindrical & Spherical Polar)'
      ]
    },
    {
      id: 'tong-kinetic',
      title: 'Kinetic Theory (Cambridge Tripos Lecture Notes)',
      shortTitle: 'Kinetic Theory',
      author: 'Prof. David Tong',
      institution: 'University of Cambridge DAMTP',
      year: '2012',
      pages: 107,
      sizeBytes: 771160,
      sizeMb: '0.77 MB',
      category: 'thermo',
      categoryLabel: 'ทฤษฎีจลน์ & อุณหพลศาสตร์',
      license: 'Open Academic Access',
      pdfPath: 'textbooks/tong_kinetic_theory.pdf',
      badgeColor: '#EF4444',
      description: 'ทฤษฎีจลน์ของแก๊ส การแจกแจงความเร็วแมกซ์เวลล์-โบลต์ซมันน์ (Maxwell-Boltzmann Distribution) สมมติฐานความถี่ชน การนำความร้อน และสมการพาความร้อน',
      keyChapters: [
        'Ch. 1: The Maxwell-Boltzmann Distribution (pp. 7–35)',
        'Ch. 2: Transport Phenomena: Diffusion, Viscosity & Heat Conduction',
        'Ch. 3: The Boltzmann Equation & H-Theorem (pp. 55–85)'
      ]
    },
    {
      id: 'tong-statphys',
      title: 'Statistical Physics (Cambridge Tripos Lecture Notes)',
      shortTitle: 'Statistical Physics',
      author: 'Prof. David Tong',
      institution: 'University of Cambridge DAMTP',
      year: '2011',
      pages: 191,
      sizeBytes: 1951403,
      sizeMb: '1.95 MB',
      category: 'thermo',
      categoryLabel: 'ฟิสิกส์เชิงสถิติ',
      license: 'Open Academic Access',
      pdfPath: 'textbooks/tong_statistical_physics.pdf',
      badgeColor: '#F97316',
      description: 'เอนโทรปีทางสถิติ ($S = k_B \\ln \\Omega$) อองซอมเบิลแบบไมโครคาโนนิคอล คาโนนิคอล และแกรนด์คาโนนิคอล การเปลี่ยนเฟส สถิติควอนตัมโบส-ไอน์สไตน์และแฟร์มี-ดิแรก',
      keyChapters: [
        'Ch. 1: Fundamentals of Statistical Mechanics & Partition Functions',
        'Ch. 2: Classical Gases & Equipartition Theorem (pp. 38–67)',
        'Ch. 4: Classical Thermodynamics & Carnot Cycle Limits (pp. 114–140)',
        'Ch. 7: Quantum Gases (Bose-Einstein Condensation & Fermi Surface)'
      ]
    }
  ];

  // 39 Modular learning units extracted from source textbooks
  const MODULAR_UNITS = [
    // 01 Mechanics & Dynamics
    { id: 'MECH-MOD-01', cat: 'mechanics', title: 'Newtonian Mechanics & Equations of Motion', file: 'curated_modules/01_mechanics_and_dynamics/01_Newtonian_Mechanics_and_F_ma.pdf', pages: 80, source: 'Morin Ch. 1 & 3, Tong Ch. 1' },
    { id: 'MECH-MOD-02', cat: 'mechanics', title: 'Oscillations & Coupled Normal Modes', file: 'curated_modules/01_mechanics_and_dynamics/02_Oscillations_and_Coupled_Modes.pdf', pages: 37, source: 'Morin Ch. 4' },
    { id: 'MECH-MOD-03', cat: 'mechanics', title: 'Conservation of Energy and Momentum', file: 'curated_modules/01_mechanics_and_dynamics/03_Conservation_Energy_Momentum.pdf', pages: 80, source: 'Morin Ch. 5' },
    { id: 'MECH-MOD-04', cat: 'mechanics', title: 'Lagrangian Formalism & Generalized Coordinates', file: 'curated_modules/01_mechanics_and_dynamics/04_Lagrangian_Formalism.pdf', pages: 98, source: 'Tong Ch. 2, Morin Ch. 6' },
    { id: 'MECH-MOD-05', cat: 'mechanics', title: 'Central Forces, Gravity, and Keplerian Orbits', file: 'curated_modules/01_mechanics_and_dynamics/05_Central_Forces_and_Orbits.pdf', pages: 28, source: 'Morin Ch. 7' },
    { id: 'MECH-MOD-06', cat: 'mechanics', title: 'Rigid Body Dynamics & Inertia Tensors', file: 'curated_modules/01_mechanics_and_dynamics/06_Rigid_Body_Dynamics_and_Tops.pdf', pages: 183, source: 'Tong Ch. 3, Morin Ch. 8-9' },
    { id: 'MECH-MOD-07', cat: 'mechanics', title: 'Accelerating Frames & Coriolis Forces', file: 'curated_modules/01_mechanics_and_dynamics/07_Accelerating_Frames_Coriolis.pdf', pages: 44, source: 'Morin Ch. 10' },
    { id: 'MECH-MOD-08', cat: 'mechanics', title: 'Hamiltonian Formalism & Phase Space', file: 'curated_modules/01_mechanics_and_dynamics/08_Hamiltonian_Formalism_Phase_Space.pdf', pages: 54, source: 'Tong Ch. 4' },

    // 02 Engineering Statics
    { id: 'STAT-MOD-01', cat: 'statics_materials', title: 'Forces, Vectors & Particle Equilibrium', file: 'curated_modules/02_engineering_statics/01_Forces_and_Particle_Equilibrium.pdf', pages: 120, source: 'Baker Ch. 1-3' },
    { id: 'STAT-MOD-02', cat: 'statics_materials', title: 'Moments & Rigid Body Equilibrium', file: 'curated_modules/02_engineering_statics/02_Moments_and_Rigid_Body_Equilibrium.pdf', pages: 79, source: 'Baker Ch. 4-5' },
    { id: 'STAT-MOD-03', cat: 'statics_materials', title: 'Trusses, Frames & Machine Structures', file: 'curated_modules/02_engineering_statics/03_Trusses_Frames_and_Machines.pdf', pages: 32, source: 'Baker Ch. 6' },
    { id: 'STAT-MOD-04', cat: 'statics_materials', title: 'Centroids & Distributed Loadings', file: 'curated_modules/02_engineering_statics/04_Centroids_and_Distributed_Loads.pdf', pages: 62, source: 'Baker Ch. 7' },
    { id: 'STAT-MOD-05', cat: 'statics_materials', title: 'Internal Forces & Beam SFD / BMD Diagrams', file: 'curated_modules/02_engineering_statics/05_Internal_Forces_SFD_BMD.pdf', pages: 45, source: 'Baker Ch. 8' },
    { id: 'STAT-MOD-06', cat: 'statics_materials', title: 'Dry Friction, Wedges & Screws', file: 'curated_modules/02_engineering_statics/06_Dry_Friction_and_Machines.pdf', pages: 38, source: 'Baker Ch. 9' },
    { id: 'STAT-MOD-07', cat: 'statics_materials', title: 'Area & Mass Moments of Inertia', file: 'curated_modules/02_engineering_statics/07_Moments_of_Inertia.pdf', pages: 50, source: 'Baker Ch. 10' },

    // 03 Mechanics of Materials
    { id: 'MAT-MOD-01', cat: 'statics_materials', title: 'Stress, Strain & Elastic Constitutive Laws', file: 'curated_modules/03_mechanics_of_materials/01_Stress_Strain_Elasticity.pdf', pages: 89, source: 'Roylance Modules 1-4, 7-9' },
    { id: 'MAT-MOD-02', cat: 'statics_materials', title: 'Stress Transformations & Mohr\'s Circle', file: 'curated_modules/03_mechanics_of_materials/02_Stress_Transformations_Mohr_Circle.pdf', pages: 15, source: 'Roylance Module 8' },
    { id: 'MAT-MOD-03', cat: 'statics_materials', title: 'Beam Bending Stresses & Deflections', file: 'curated_modules/03_mechanics_of_materials/03_Beam_Bending_Stresses_Deflections.pdf', pages: 42, source: 'Roylance Modules 10-12' },
    { id: 'MAT-MOD-04', cat: 'statics_materials', title: 'Torsion, Buckling & Thin Pressure Vessels', file: 'curated_modules/03_mechanics_of_materials/04_Torsion_Buckling_Pressure_Vessels.pdf', pages: 61, source: 'Roylance Modules 5-6, 17' },
    { id: 'MAT-MOD-05', cat: 'statics_materials', title: 'Yield Criteria, Fracture & Fatigue', file: 'curated_modules/03_mechanics_of_materials/05_Yield_Criteria_Fracture_Fatigue.pdf', pages: 79, source: 'Roylance Modules 18-22' },

    // 04 Electromagnetism
    { id: 'EM-MOD-01', cat: 'electromagnetism', title: 'Electrostatics, Potentials & Gauss\'s Law', file: 'curated_modules/04_electromagnetism/01_Electrostatics_and_Gauss_Law.pdf', pages: 40, source: 'Tong EM Ch. 1-2' },
    { id: 'EM-MOD-02', cat: 'electromagnetism', title: 'Magnetostatics & Vector Potential', file: 'curated_modules/04_electromagnetism/02_Magnetostatics_and_Vector_Potential.pdf', pages: 26, source: 'Tong EM Ch. 3' },
    { id: 'EM-MOD-03', cat: 'electromagnetism', title: 'Electrodynamics & Maxwell\'s Equations', file: 'curated_modules/04_electromagnetism/03_Electrodynamics_and_Maxwell_Equations.pdf', pages: 28, source: 'Tong EM Ch. 4' },
    { id: 'EM-MOD-04', cat: 'electromagnetism', title: 'Radiation & Electromagnetic Fields in Matter', file: 'curated_modules/04_electromagnetism/04_Radiation_and_Fields_in_Matter.pdf', pages: 95, source: 'Tong EM Ch. 6-7' },
    { id: 'EM-MOD-05', cat: 'electromagnetism', title: 'Relativistic Electrodynamics & Field Tensor', file: 'curated_modules/04_electromagnetism/05_Relativistic_Electrodynamics.pdf', pages: 39, source: 'Tong EM Ch. 5' },

    // 05 Thermodynamics & Statistical Physics
    { id: 'THERMO-MOD-01', cat: 'thermo', title: 'Classical Thermodynamics & Carnot Cycle', file: 'curated_modules/05_thermodynamics_and_statphys/01_Classical_Thermodynamics_and_Entropy.pdf', pages: 27, source: 'Tong SP Ch. 4' },
    { id: 'THERMO-MOD-02', cat: 'thermo', title: 'Statistical Ensembles & Partition Functions', file: 'curated_modules/05_thermodynamics_and_statphys/02_Statistical_Ensembles_and_Partition_Functions.pdf', pages: 31, source: 'Tong SP Ch. 1' },
    { id: 'THERMO-MOD-03', cat: 'thermo', title: 'Classical Gases & Maxwell-Boltzmann Distribution', file: 'curated_modules/05_thermodynamics_and_statphys/03_Classical_Gases_and_Interactions.pdf', pages: 30, source: 'Tong SP Ch. 2' },
    { id: 'THERMO-MOD-04', cat: 'thermo', title: 'Quantum Statistics (Fermi & Bose Gases)', file: 'curated_modules/05_thermodynamics_and_statphys/04_Quantum_Gases_Bose_Fermi.pdf', pages: 38, source: 'Tong SP Ch. 7' },
    { id: 'THERMO-MOD-05', cat: 'thermo', title: 'Phase Transitions & Mean Field Theory', file: 'curated_modules/05_thermodynamics_and_statphys/05_Phase_Transitions_and_Ising_Model.pdf', pages: 48, source: 'Tong SP Ch. 5-6' },
    { id: 'THERMO-MOD-06', cat: 'thermo', title: 'Kinetic Theory of Gases & Transport Equations', file: 'curated_modules/05_thermodynamics_and_statphys/06_Kinetic_Theory_and_Transport.pdf', pages: 85, source: 'Tong Kinetic Theory' },

    // 06 Vector Calculus
    { id: 'VEC-MOD-01', cat: 'math_methods', title: 'Curves, Arc Length & Frenet-Serret Apparatus', file: 'curated_modules/06_vector_calculus/01_Curves_and_Surfaces_in_Space.pdf', pages: 31, source: 'Tong Vector Calc Ch. 1' },
    { id: 'VEC-MOD-02', cat: 'math_methods', title: 'Vector Differential Operators: Grad, Div & Curl', file: 'curated_modules/06_vector_calculus/02_Grad_Div_Curl_Operators.pdf', pages: 25, source: 'Tong Vector Calc Ch. 2' },
    { id: 'VEC-MOD-03', cat: 'math_methods', title: 'Line, Surface & Volume Integrals', file: 'curated_modules/06_vector_calculus/03_Line_Surface_Volume_Integrals.pdf', pages: 24, source: 'Tong Vector Calc Ch. 3' },
    { id: 'VEC-MOD-04', cat: 'math_methods', title: 'Gauss\'s Divergence & Stokes\' Theorems', file: 'curated_modules/06_vector_calculus/04_Gauss_Divergence_Stokes_Theorems.pdf', pages: 31, source: 'Tong Vector Calc Ch. 4' },
    { id: 'VEC-MOD-05', cat: 'math_methods', title: 'Curvilinear & Polar Coordinate Systems', file: 'curated_modules/06_vector_calculus/05_Curvilinear_Coordinates.pdf', pages: 26, source: 'Tong Vector Calc Ch. 5' },

    // 07 Relativity & Modern Physics
    { id: 'REL-MOD-01', cat: 'mechanics', title: 'Special Relativity: Kinematics & Lorentz Boosts', file: 'curated_modules/07_relativity_and_modern_physics/01_Special_Relativity_Kinematics.pdf', pages: 71, source: 'Morin Ch. 11' },
    { id: 'REL-MOD-02', cat: 'mechanics', title: 'Relativistic Dynamics: Energy & Momentum 4-Vectors', file: 'curated_modules/07_relativity_and_modern_physics/02_Relativistic_Dynamics_Energy_Momentum.pdf', pages: 62, source: 'Morin Ch. 12' },
    { id: 'REL-MOD-03', cat: 'mechanics', title: '4-Vectors and Minkowski Spacetime Geometry', file: 'curated_modules/07_relativity_and_modern_physics/03_4Vectors_and_Relativity.pdf', pages: 56, source: 'Morin Ch. 13' }
  ];

  /**
   * Render the Textbook Library into #view-textbooks target container
   */
  function renderTextbookLibrary(filterCat = 'all', searchStr = '') {
    const container = document.getElementById('textbook-content-target');
    if (!container) return;

    searchStr = (searchStr || '').trim().toLowerCase();

    // Filter master books
    const filteredMaster = MASTER_TEXTBOOKS.filter(b => {
      const matchCat = (filterCat === 'all' || b.category === filterCat || filterCat === 'master');
      const matchSearch = !searchStr || (
        b.title.toLowerCase().includes(searchStr) ||
        b.author.toLowerCase().includes(searchStr) ||
        b.description.toLowerCase().includes(searchStr) ||
        b.institution.toLowerCase().includes(searchStr)
      );
      return matchCat && matchSearch;
    });

    // Filter modules
    const filteredModules = MODULAR_UNITS.filter(m => {
      const matchCat = (filterCat === 'all' || m.cat === filterCat || filterCat === 'modules');
      const matchSearch = !searchStr || (
        m.title.toLowerCase().includes(searchStr) ||
        m.id.toLowerCase().includes(searchStr) ||
        m.source.toLowerCase().includes(searchStr)
      );
      return matchCat && matchSearch;
    });

    let html = `
      <div class="textbook-library-wrapper">
        <!-- Search & Category Filter Toolbar -->
        <div class="textbook-toolbar">
          <div class="textbook-search-box">
            <span class="search-icon">🔍</span>
            <input type="text" id="textbook-search-input" placeholder="ค้นหาตำรา, ผู้แต่ง (เช่น Morin, Tong, Baker), หรือหัวข้อ..." value="${escapeHtml(searchStr)}">
            ${searchStr ? `<button id="btn-clear-textbook-search" class="btn-clear-search">✕</button>` : ''}
          </div>

          <div class="textbook-category-chips" role="tablist">
            <button class="tb-chip ${filterCat === 'all' ? 'active' : ''}" data-cat="all">🌐 ทั้งหมด (${MASTER_TEXTBOOKS.length + MODULAR_UNITS.length})</button>
            <button class="tb-chip ${filterCat === 'master' ? 'active' : ''}" data-cat="master">📚 ตำราหลัก 8 เล่ม</button>
            <button class="tb-chip ${filterCat === 'modules' ? 'active' : ''}" data-cat="modules">📄 39 โมดูลเฉพาะบท</button>
            <button class="tb-chip ${filterCat === 'mechanics' ? 'active' : ''}" data-cat="mechanics">🏎️ กลศาสตร์ & พลศาสตร์</button>
            <button class="tb-chip ${filterCat === 'statics_materials' ? 'active' : ''}" data-cat="statics_materials">🏗️ สถิตยศาสตร์ & กำลังวัสดุ</button>
            <button class="tb-chip ${filterCat === 'electromagnetism' ? 'active' : ''}" data-cat="electromagnetism">⚡ ไฟฟ้า & แม่เหล็ก</button>
            <button class="tb-chip ${filterCat === 'thermo' ? 'active' : ''}" data-cat="thermo">🔥 อุณหพลศาสตร์ & จลน์</button>
            <button class="tb-chip ${filterCat === 'math_methods' ? 'active' : ''}" data-cat="math_methods">📐 แคลคูลัสเวกเตอร์</button>
          </div>
        </div>

        <!-- Section 1: Master Textbooks -->
        ${(filterCat !== 'modules' && filteredMaster.length > 0) ? `
          <div class="textbook-section">
            <div class="textbook-section-header">
              <h3 class="section-title">📚 ตำราหลักมหาวิทยาลัยฉบับสมบูรณ์ (Master Textbooks: 8 Volumes)</h3>
              <span class="section-badge">${filteredMaster.length} เล่ม</span>
            </div>
            <div class="textbook-cards-grid">
              ${filteredMaster.map(b => renderMasterBookCard(b)).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Section 2: Modular Learning Units -->
        ${(filterCat !== 'master' && filteredModules.length > 0) ? `
          <div class="textbook-section" style="margin-top: 2rem;">
            <div class="textbook-section-header">
              <h3 class="section-title">📄 โมดูลแยกเฉพาะบทพร้อมอ่าน (39 Modular Chapter Units)</h3>
              <span class="section-badge">${filteredModules.length} โมดูล</span>
            </div>
            <div class="modules-cards-grid">
              ${filteredModules.map(m => renderModuleCard(m)).join('')}
            </div>
          </div>
        ` : ''}

        ${(filteredMaster.length === 0 && filteredModules.length === 0) ? `
          <div class="textbook-empty-state">
            <div class="empty-icon">📭</div>
            <h4>ไม่พบเอกสารหรือตำราที่ตรงกับการค้นหา</h4>
            <p>ลองปรับคำค้นหา หรือคลิกปุ่ม "ทั้งหมด" ด้านบนเพื่อดูรายการทั้งหมด</p>
          </div>
        ` : ''}
      </div>
    `;

    container.innerHTML = html;
    bindTextbookEvents(container);
  }

  function renderMasterBookCard(b) {
    return `
      <div class="textbook-card master-textbook-card" data-book-id="${b.id}">
        <div class="textbook-card-header">
          <div class="tb-badge" style="background: ${b.badgeColor}20; color: ${b.badgeColor}; border: 1px solid ${b.badgeColor}40;">
            ${b.categoryLabel}
          </div>
          <div class="tb-meta-pill">${b.pages} หน้า | ${b.sizeMb}</div>
        </div>
        <h4 class="textbook-title">${escapeHtml(b.title)}</h4>
        <div class="textbook-author">👤 ${escapeHtml(b.author)}</div>
        <div class="textbook-institution">🏛️ ${escapeHtml(b.institution)} (${b.year})</div>
        <p class="textbook-desc">${escapeHtml(b.description)}</p>

        <div class="textbook-chapters-preview">
          <strong>สารบัญและบทอ้างอิงสำคัญ:</strong>
          <ul>
            ${b.keyChapters.map(ch => `<li>${escapeHtml(ch)}</li>`).join('')}
          </ul>
        </div>

        <div class="textbook-card-footer">
          <button class="btn btn-primary btn-open-pdf" data-url="${b.pdfPath}" data-title="${escapeHtml(b.title)}" data-author="${escapeHtml(b.author)}" data-pages="${b.pages}">
            📖 เปิดอ่านในเบราว์เซอร์
          </button>
          <a href="${b.pdfPath}" download class="btn btn-secondary btn-download-pdf" title="ดาวน์โหลดเก็บไว้บนเครื่อง">
            ⬇️ ดาวน์โหลด
          </a>
        </div>
      </div>
    `;
  }

  function renderModuleCard(m) {
    const pdfUrl = `textbooks/${m.file}`;
    return `
      <div class="module-card">
        <div class="module-header">
          <span class="module-id-badge">${m.id}</span>
          <span class="module-pages-badge">${m.pages} หน้า</span>
        </div>
        <h5 class="module-title">${escapeHtml(m.title)}</h5>
        <div class="module-source">📖 แหล่งที่มา: ${escapeHtml(m.source)}</div>
        <div class="module-actions">
          <button class="btn-module-open btn-open-pdf" data-url="${pdfUrl}" data-title="${escapeHtml(m.title)}" data-author="${escapeHtml(m.source)}" data-pages="${m.pages}">
            📖 อ่านโมดูลนี้
          </button>
          <a href="${pdfUrl}" download class="btn-module-dl" title="ดาวน์โหลด PDF">⬇️</a>
        </div>
      </div>
    `;
  }

  function bindTextbookEvents(container) {
    // Search input
    const searchInput = container.querySelector('#textbook-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        const activeChip = container.querySelector('.tb-chip.active');
        const cat = activeChip ? activeChip.dataset.cat : 'all';
        renderTextbookLibrary(cat, e.target.value);
      }, 250));
    }

    // Clear search button
    const clearBtn = container.querySelector('#btn-clear-textbook-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const activeChip = container.querySelector('.tb-chip.active');
        const cat = activeChip ? activeChip.dataset.cat : 'all';
        renderTextbookLibrary(cat, '');
      });
    }

    // Category chips
    const chips = container.querySelectorAll('.tb-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.toggle('active', c === chip));
        const cat = chip.dataset.cat;
        const searchVal = searchInput ? searchInput.value : '';
        renderTextbookLibrary(cat, searchVal);
      });
    });

    // Open PDF reader buttons
    const openBtns = container.querySelectorAll('.btn-open-pdf');
    openBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        const title = btn.dataset.title;
        const author = btn.dataset.author;
        const pages = btn.dataset.pages;
        openTextbookReader(url, title, author, pages);
      });
    });
  }

  /**
   * Open the In-App PDF Reader Modal
   */
  function openTextbookReader(url, title, author, pages) {
    const modal = document.getElementById('textbook-reader-modal');
    if (!modal) return;

    const frame = document.getElementById('textbook-pdf-frame');
    const titleEl = document.getElementById('tb-reader-title');
    const metaEl = document.getElementById('tb-reader-meta');
    const newTabLink = document.getElementById('tb-reader-newtab');

    if (titleEl) titleEl.textContent = title || 'เปิดอ่านตำรา PDF';
    if (metaEl) metaEl.textContent = `${author || ''} • ${pages ? pages + ' หน้า' : ''}`;
    if (newTabLink) newTabLink.href = url;

    if (frame) {
      frame.src = url;
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the In-App PDF Reader Modal
   */
  function closeTextbookReader() {
    const modal = document.getElementById('textbook-reader-modal');
    if (!modal) return;
    const frame = document.getElementById('textbook-pdf-frame');
    if (frame) frame.src = 'about:blank';
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  return {
    MASTER_TEXTBOOKS,
    MODULAR_UNITS,
    renderTextbookLibrary,
    openTextbookReader,
    closeTextbookReader
  };
}));
