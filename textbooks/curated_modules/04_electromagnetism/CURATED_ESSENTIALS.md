# Curated Essentials: Electromagnetism & Electrodynamics (แม่เหล็กไฟฟ้าและไฟฟ้าพลศาสตร์)

This directory contains standalone, extracted PDF textbook modules and curated theoretical and practical knowledge for **Electromagnetism and Classical Electrodynamics** from David Tong (*Electromagnetism*, Cambridge University DAMTP).

---

## Module Index & Extracted Textbook PDFs

| Module ID | Module Title | Extracted PDF File | Source Chapters | Page Count | File Size |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **EM-MOD-01** | Electrostatics, Gauss's Law & Potentials | [`01_Electrostatics_and_Gauss_Law.pdf`](./01_Electrostatics_and_Gauss_Law.pdf) | Tong EM Ch. 1–2 | 40 | 545 KB |
| **EM-MOD-02** | Magnetostatics, Ampère's Law & Vector Potential | [`02_Magnetostatics_and_Vector_Potential.pdf`](./02_Magnetostatics_and_Vector_Potential.pdf) | Tong EM Ch. 3 | 26 | 499 KB |
| **EM-MOD-03** | Electrodynamics, Faraday Induction & Maxwell's Equations | [`03_Electrodynamics_and_Maxwell_Equations.pdf`](./03_Electrodynamics_and_Maxwell_Equations.pdf) | Tong EM Ch. 4 | 28 | 684 KB |
| **EM-MOD-04** | Electromagnetic Radiation & Waves in Matter | [`04_Radiation_and_Fields_in_Matter.pdf`](./04_Radiation_and_Fields_in_Matter.pdf) | Tong EM Ch. 6–7 | 95 | 1.05 MB |
| **EM-MOD-05** | Relativistic Electrodynamics & Field Tensor | [`05_Relativistic_Electrodynamics.pdf`](./05_Relativistic_Electrodynamics.pdf) | Tong EM Ch. 5 | 39 | 417 KB |

---

## 1. EM-MOD-01: Electrostatics, Gauss's Law & Potentials

### Core Concepts & Intuition
- **Electrostatic Field**: Force per unit test charge: $\mathbf{E}(\mathbf{r}) = \frac{\mathbf{F}}{q}$.
- **Gauss's Law**: The net electric flux through any closed Gaussian surface equals the total enclosed charge divided by the permittivity of free space $\varepsilon_0$:
  $$\oint_S \mathbf{E} \cdot d\mathbf{A} = \frac{Q_{\text{enclosed}}}{\varepsilon_0} \iff \nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}$$
- **Electrostatic Potential**: Because $\nabla \times \mathbf{E} = \mathbf{0}$, $\mathbf{E} = -\nabla V$.
  Substituting into Gauss's law yields **Poisson's Equation**:
  $$\nabla^2 V = -\frac{\rho}{\varepsilon_0} \quad (\text{or Laplace's Equation } \nabla^2 V = 0 \text{ in charge-free regions})$$

### Classic Problem Archetypes
1. **Conductors & Boundary Conditions**:
   - Inside an ideal conductor in electrostatic equilibrium, $\mathbf{E} = \mathbf{0}$, and $V = \text{constant}$.
   - At the conductor surface, $\mathbf{E} = \frac{\sigma}{\varepsilon_0} \hat{\mathbf{n}}$.
2. **Method of Images**:
   - A point charge $+q$ at distance $d$ above an infinite grounded conducting plane ($V=0$ at $z=0$) produces an identical potential for $z>0$ as a pair consisting of $+q$ at $(0,0,d)$ and an image charge $-q$ at $(0,0,-d)$.

---

## 2. EM-MOD-02: Magnetostatics, Biot-Savart & Ampère's Law

### Core Concepts & Intuition
- **Lorentz Force**: $\mathbf{F} = q(\mathbf{E} + \mathbf{v} \times \mathbf{B})$.
- **No Magnetic Monopoles**: $\nabla \cdot \mathbf{B} = 0 \implies \oint_S \mathbf{B} \cdot d\mathbf{A} = 0$.
- **Magnetic Vector Potential**: Because $\nabla \cdot \mathbf{B} = 0$, we can express $\mathbf{B} = \nabla \times \mathbf{A}$.

### Key Governing Equations
1. **Biot-Savart Law**:
   $$\mathbf{B}(\mathbf{r}) = \frac{\mu_0 I}{4\pi} \int \frac{d\mathbf{l}' \times (\mathbf{r} - \mathbf{r}')}{|\mathbf{r} - \mathbf{r}'|^3}$$
2. **Ampère's Circuital Law (Static Form)**:
   $$\oint_C \mathbf{B} \cdot d\mathbf{l} = \mu_0 I_{\text{enclosed}} \iff \nabla \times \mathbf{B} = \mu_0 \mathbf{J}$$
3. **Coulomb Gauge & Poisson Equation for A**:
   Under gauge choice $\nabla \cdot \mathbf{A} = 0$:
   $$\nabla^2 \mathbf{A} = -\mu_0 \mathbf{J} \implies \mathbf{A}(\mathbf{r}) = \frac{\mu_0}{4\pi} \int \frac{\mathbf{J}(\mathbf{r}')}{|\mathbf{r} - \mathbf{r}'|} d^3 r'$$

---

## 3. EM-MOD-03: Electrodynamics & Maxwell's Equations

### The Four Maxwell Equations (in Vacuum)
| Differential Form | Integral Form | Physical Name |
| :--- | :--- | :--- |
| $\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}$ | $\oint_S \mathbf{E} \cdot d\mathbf{A} = \frac{Q_{\text{enc}}}{\varepsilon_0}$ | Gauss's Law |
| $\nabla \cdot \mathbf{B} = 0$ | $\oint_S \mathbf{B} \cdot d\mathbf{A} = 0$ | Gauss's Law for Magnetism |
| $\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}$ | $\oint_C \mathbf{E} \cdot d\mathbf{l} = -\frac{d\Phi_B}{dt}$ | Faraday's Law of Induction |
| $\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}$ | $\oint_C \mathbf{B} \cdot d\mathbf{l} = \mu_0 I_{\text{enc}} + \mu_0 \varepsilon_0 \frac{d\Phi_E}{dt}$ | Ampère-Maxwell Law |

### Maxwell's Displacement Current
- Maxwell recognized that $\nabla \cdot (\nabla \times \mathbf{B}) \equiv 0$, but $\nabla \cdot (\mu_0 \mathbf{J}) = -\mu_0 \frac{\partial \rho}{\partial t} \ne 0$ from charge continuity $\nabla \cdot \mathbf{J} + \frac{\partial \rho}{\partial t} = 0$.
- Adding the **displacement current density** $\mathbf{J}_D = \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}$ resolved the contradiction and predicted electromagnetic wave propagation at $c = \frac{1}{\sqrt{\mu_0 \varepsilon_0}} \approx 3 \times 10^8\text{ m/s}$.

### Energy Flow & Poynting's Theorem
$$\frac{\partial u_{\text{em}}}{\partial t} + \nabla \cdot \mathbf{S} = -\mathbf{J} \cdot \mathbf{E}$$
where:
- Energy Density: $u_{\text{em}} = \frac{1}{2} \varepsilon_0 E^2 + \frac{1}{2\mu_0} B^2$
- **Poynting Vector**: $\mathbf{S} = \frac{1}{\mu_0} (\mathbf{E} \times \mathbf{B})$ (energy flux in $\text{W/m}^2$).

---

## 4. EM-MOD-04: Electromagnetic Radiation & Waves in Matter

### Key Formulations
1. **Electromagnetic Waves in Vacuum**:
   $$\nabla^2 \mathbf{E} - \frac{1}{c^2}\frac{\partial^2 \mathbf{E}}{\partial t^2} = \mathbf{0}, \quad \nabla^2 \mathbf{B} - \frac{1}{c^2}\frac{\partial^2 \mathbf{B}}{\partial t^2} = \mathbf{0}$$
   For a plane wave propagating in direction $\hat{\mathbf{k}}$: $\mathbf{B} = \frac{1}{c}(\hat{\mathbf{k}} \times \mathbf{E})$.
2. **Retarded Potentials (Lorenz Gauge $\nabla \cdot \mathbf{A} + \frac{1}{c^2}\frac{\partial V}{\partial t} = 0$)**:
   $$V(\mathbf{r}, t) = \frac{1}{4\pi\varepsilon_0} \int \frac{\rho(\mathbf{r}', t_r)}{|\mathbf{r} - \mathbf{r}'|} d^3 r', \quad \mathbf{A}(\mathbf{r}, t) = \frac{\mu_0}{4\pi} \int \frac{\mathbf{J}(\mathbf{r}', t_r)}{|\mathbf{r} - \mathbf{r}'|} d^3 r'$$
   where the retarded time is $t_r = t - \frac{|\mathbf{r} - \mathbf{r}'|}{c}$.
3. **Larmor Formula (Accelerating Point Charge Radiation)**:
   $$P = \frac{q^2 a^2}{6\pi \varepsilon_0 c^3}$$
   - Energy radiated per unit time is proportional to the square of acceleration $a^2$.

---

## 5. EM-MOD-05: Relativistic Electrodynamics & Field Tensor

### Covariant Formulation
- **Four-Vector Potential**: $A^\mu = \left(\frac{V}{c}, \mathbf{A}\right)$
- **Four-Current Density**: $J^\mu = (c\rho, \mathbf{J})$
- **Electromagnetic Field Tensor $F^{\mu\nu}$**:
  $$F^{\mu\nu} = \partial^\mu A^\nu - \partial^\nu A^\mu = \begin{pmatrix} 0 & -E_x/c & -E_y/c & -E_z/c \\ E_x/c & 0 & -B_z & B_y \\ E_y/c & B_z & 0 & -B_x \\ E_z/c & -B_y & B_x & 0 \end{pmatrix}$$
- **Covariant Maxwell Equations**:
  $$\partial_\mu F^{\mu\nu} = \mu_0 J^\nu \quad (\text{Gauss + Ampère-Maxwell})$$
  $$\partial_{[\mu} F_{\nu\rho]} = 0 \quad (\text{No monopoles + Faraday})$$
- **Lorentz Invariants**:
  $$F^{\mu\nu} F_{\mu\nu} = 2\left(B^2 - \frac{E^2}{c^2}\right) = \text{inv}, \quad \epsilon_{\mu\nu\rho\sigma} F^{\mu\nu} F^{\rho\sigma} = -\frac{8}{c} (\mathbf{E} \cdot \mathbf{B}) = \text{inv}$$
