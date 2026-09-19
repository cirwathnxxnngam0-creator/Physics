# Curated Essentials: Mechanics of Materials & Continuum Mechanics (กลศาสตร์ของแข็งและวัสดุ)

This directory contains standalone, extracted PDF textbook modules and curated theoretical and practical knowledge for **Mechanics of Materials and Continuum Mechanics** from Prof. David Roylance (*Modules in Mechanics of Materials*, MIT Department of Materials Science & Engineering).

---

## Module Index & Extracted Textbook PDFs

| Module ID | Module Title | Extracted PDF File | Source Modules | Page Count | File Size |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **MAT-MOD-01** | Stress, Strain, and Elastic Constitutive Laws | [`01_Stress_Strain_Elasticity.pdf`](./01_Stress_Strain_Elasticity.pdf) | Roylance Mod. 1–4, 7–9 | 89 | 1.83 MB |
| **MAT-MOD-02** | Transformation of Stresses and Mohr's Circle | [`02_Stress_Transformations_Mohr_Circle.pdf`](./02_Stress_Transformations_Mohr_Circle.pdf) | Roylance Mod. 8 | 15 | 321 KB |
| **MAT-MOD-03** | Stresses and Deflections in Beams | [`03_Beam_Bending_Stresses_Deflections.pdf`](./03_Beam_Bending_Stresses_Deflections.pdf) | Roylance Mod. 10–12 | 42 | 873 KB |
| **MAT-MOD-04** | Torsion, Pressure Vessels, and Column Buckling | [`04_Torsion_Buckling_Pressure_Vessels.pdf`](./04_Torsion_Buckling_Pressure_Vessels.pdf) | Roylance Mod. 5–6, 17 | 61 | 1.30 MB |
| **MAT-MOD-05** | Yield Criteria, Fracture Mechanics, and Fatigue | [`05_Yield_Criteria_Fracture_Fatigue.pdf`](./05_Yield_Criteria_Fracture_Fatigue.pdf) | Roylance Mod. 18–22 | 79 | 1.70 MB |

---

## 1. MAT-MOD-01: Stress, Strain & Elastic Constitutive Laws

### Core Concepts & Intuition
- **Stress Tensor ($\boldsymbol{\sigma}$)**: Internal force intensity per unit area. In 3D continuum:
  $$\boldsymbol{\sigma} = \begin{pmatrix} \sigma_x & \tau_{xy} & \tau_{xz} \\ \tau_{yx} & \sigma_y & \tau_{yz} \\ \tau_{zx} & \tau_{zy} & \sigma_z \end{pmatrix}, \quad \tau_{ij} = \tau_{ji} \text{ (due to moment equilibrium)}$$
- **Strain Tensor ($\boldsymbol{\varepsilon}$)**: Geometric deformation per unit length:
  $$\varepsilon_x = \frac{\partial u}{\partial x}, \quad \gamma_{xy} = \frac{\partial u}{\partial y} + \frac{\partial v}{\partial x}$$
- **Generalized Hooke's Law for Isotropic Solids**:
  $$\varepsilon_x = \frac{1}{E} \left[ \sigma_x - \nu (\sigma_y + \sigma_z) \right], \quad \gamma_{xy} = \frac{\tau_{xy}}{G}$$
  - Elastic Moduli Interrelations:
    $$G = \frac{E}{2(1 + \nu)}, \quad K = \frac{E}{3(1 - 2\nu)}$$
    where $E$ is Young's modulus, $G$ is shear modulus, $K$ is bulk modulus, and $\nu$ is Poisson's ratio ($-1 < \nu \le 0.5$). For incompressible materials, $\nu = 0.5$.

---

## 2. MAT-MOD-02: Transformation of Stresses and Mohr's Circle

### Core Concepts & Intuition
- Stresses acting on an element change depending on the orientation angle $\theta$ of the cutting plane.
- **Mohr's Circle**: A graphical representation of 2D stress transformation equations where normal stress $\sigma$ is plotted on the horizontal axis and shear stress $\tau$ on the vertical axis.

### Analytical Transformation Equations
$$\sigma_{x'} = \frac{\sigma_x + \sigma_y}{2} + \frac{\sigma_x - \sigma_y}{2}\cos 2\theta + \tau_{xy}\sin 2\theta$$
$$\tau_{x'y'} = -\frac{\sigma_x - \sigma_y}{2}\sin 2\theta + \tau_{xy}\cos 2\theta$$

### Principal Stresses & Maximum In-Plane Shear
1. **Principal Angles**:
   $$\tan 2\theta_p = \frac{2\tau_{xy}}{\sigma_x - \sigma_y}$$
   (On principal planes, shear stress is identically zero: $\tau = 0$).
2. **Principal Stress Magnitudes**:
   $$\sigma_{1, 2} = \frac{\sigma_x + \sigma_y}{2} \pm \sqrt{\left(\frac{\sigma_x - \sigma_y}{2}\right)^2 + \tau_{xy}^2}$$
3. **Maximum In-Plane Shear Stress**:
   $$\tau_{\text{max, in-plane}} = R = \sqrt{\left(\frac{\sigma_x - \sigma_y}{2}\right)^2 + \tau_{xy}^2} = \frac{\sigma_1 - \sigma_2}{2}$$
   - Occurs at an angle $45^\circ$ from the principal planes.

---

## 3. MAT-MOD-03: Stresses and Deflections in Beams

### Core Concepts & Intuition
- **Euler-Bernoulli Beam Theory Assumptions**: Plane cross-sections remain plane and perpendicular to the neutral axis after bending ("no shear deformation").

### Key Governing Equations
1. **Flexure Formula (Normal Bending Stress)**:
   $$\sigma(x, y) = -\frac{M(x) y}{I}$$
   where $y$ is the perpendicular distance from the neutral axis, $M(x)$ is the bending moment, and $I$ is the second moment of area about the neutral axis.
2. **Transverse Shear Stress Formula (Jourawski's Formula)**:
   $$\tau(x, y) = \frac{V(x) Q(y)}{I t}$$
   where $Q(y) = \int_y^{c} y' dA$ is the first moment of area of the portion above level $y$, and $t$ is the beam thickness at that cut.
   - For a solid rectangular beam of dimensions $b \times h$:
     $$\tau_{\text{max}} = \frac{3}{2} \frac{V}{A} \quad (\text{at the neutral axis } y = 0)$$
3. **Beam Deflection Differential Equations**:
   $$EI \frac{d^4 v}{dx^4} = w(x), \quad EI \frac{d^3 v}{dx^3} = -V(x), \quad EI \frac{d^2 v}{dx^2} = M(x)$$

---

## 4. MAT-MOD-04: Torsion, Pressure Vessels, and Column Buckling

### Key Governing Equations
1. **Torsion of Circular Shafts**:
   - Shear stress: $\tau(r) = \frac{T r}{J}$ (maximum at outer radius $R$: $\tau_{\text{max}} = \frac{TR}{J}$).
   - Angle of twist: $\phi = \frac{T L}{G J}$, where $J = \frac{\pi R^4}{2} = \frac{\pi D^4}{32}$.
2. **Thin-Walled Pressure Vessels ($t \ll r$)**:
   - **Cylindrical Vessel**:
     $$\text{Hoop (Circumferential) Stress: } \sigma_h = \frac{Pr}{t}, \quad \text{Longitudinal (Axial) Stress: } \sigma_L = \frac{Pr}{2t}$$
     (Note that $\sigma_h = 2\sigma_L$, explaining why pipes burst along longitudinal seams!).
   - **Spherical Vessel**:
     $$\sigma = \frac{Pr}{2t}$$
3. **Euler's Column Buckling Load**:
   $$P_{\text{cr}} = \frac{\pi^2 E I}{(K L)^2} = \frac{\pi^2 E I}{L_e^2}$$
   - Effective length factor $K$:
     - Pinned-Pinned: $K = 1.0$
     - Fixed-Free (Cantilever): $K = 2.0$
     - Fixed-Pinned: $K \approx 0.7$
     - Fixed-Fixed: $K = 0.5$

---

## 5. MAT-MOD-05: Yield Criteria, Fracture Mechanics, and Fatigue

### Core Concepts & Intuition
- **Yield Criteria**: Predict the onset of permanent plastic deformation under multi-axial stress states.
- **Fracture Mechanics**: Analyzes the stability of preexisting cracks under tensile loads.

### Key Equations & Criteria
1. **Tresca Yield Criterion (Maximum Shear Stress)**:
   $$\max\left( |\sigma_1 - \sigma_2|, |\sigma_2 - \sigma_3|, |\sigma_3 - \sigma_1| \right) \ge \sigma_Y$$
2. **Von Mises Yield Criterion (Distortion Energy Theory)**:
   $$\sigma_{\text{vm}} = \sqrt{\frac{1}{2}\left[(\sigma_1 - \sigma_2)^2 + (\sigma_2 - \sigma_3)^2 + (\sigma_3 - \sigma_1)^2\right]} \ge \sigma_Y$$
   In 2D plane stress ($\sigma_3 = 0$):
   $$\sigma_{\text{vm}} = \sqrt{\sigma_x^2 - \sigma_x \sigma_y + \sigma_y^2 + 3\tau_{xy}^2} \ge \sigma_Y$$
3. **Linear Elastic Fracture Mechanics (LEFM)**:
   - Stress Intensity Factor (Mode I Opening):
     $$K_I = Y \sigma \sqrt{\pi a}$$
   - Fast fracture occurs when $K_I \ge K_{Ic}$ (the fracture toughness of the material).
4. **Fatigue & Paris Law**:
   $$\frac{da}{dN} = C (\Delta K)^m$$
   predicts fatigue crack growth per cycle under cyclic stress amplitude $\Delta \sigma$.
