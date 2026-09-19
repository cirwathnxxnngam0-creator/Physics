# Curated Essentials: Classical Mechanics & Dynamics (พลศาสตร์และกลศาสตร์ดั้งเดิม)

This directory contains standalone, extracted PDF textbook modules and curated theoretical and practical knowledge for **Classical Mechanics and Analytical Dynamics**.

---

## Module Index & Extracted Textbook PDFs

| Module ID | Module Title | Extracted PDF File | Source Textbooks | Page Count | File Size |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **MECH-MOD-01** | Newtonian Mechanics & Differential Equations | [`01_Newtonian_Mechanics_and_F_ma.pdf`](./01_Newtonian_Mechanics_and_F_ma.pdf) | Morin Ch. 1 & 3; Tong Ch. 1 | 80 | 1.13 MB |
| **MECH-MOD-02** | Oscillations & Coupled Normal Modes | [`02_Oscillations_and_Coupled_Modes.pdf`](./02_Oscillations_and_Coupled_Modes.pdf) | Morin Ch. 4 | 37 | 457 KB |
| **MECH-MOD-03** | Conservation of Energy and Momentum | [`03_Conservation_Energy_Momentum.pdf`](./03_Conservation_Energy_Momentum.pdf) | Morin Ch. 5 | 80 | 1.05 MB |
| **MECH-MOD-04** | Lagrangian Mechanics & Stationary Action | [`04_Lagrangian_Formalism.pdf`](./04_Lagrangian_Formalism.pdf) | Tong Ch. 2; Morin Ch. 6 | 98 | 1.17 MB |
| **MECH-MOD-05** | Central Forces & Keplerian Orbits | [`05_Central_Forces_and_Orbits.pdf`](./05_Central_Forces_and_Orbits.pdf) | Morin Ch. 7 | 28 | 363 KB |
| **MECH-MOD-06** | Rigid Body Dynamics & Inertia Tensors | [`06_Rigid_Body_Dynamics_and_Tops.pdf`](./06_Rigid_Body_Dynamics_and_Tops.pdf) | Tong Ch. 3; Morin Ch. 8–9 | 183 | 2.14 MB |
| **MECH-MOD-07** | Accelerating Frames & Fictitious Forces | [`07_Accelerating_Frames_Coriolis.pdf`](./07_Accelerating_Frames_Coriolis.pdf) | Morin Ch. 10 | 44 | 569 KB |
| **MECH-MOD-08** | Hamiltonian Formalism & Phase Space | [`08_Hamiltonian_Formalism_Phase_Space.pdf`](./08_Hamiltonian_Formalism_Phase_Space.pdf) | Tong Ch. 4 | 54 | 390 KB |

---

## 1. MECH-MOD-01: Newtonian Mechanics & Equations of Motion

### Core Concepts & Intuition
- **Newton's Three Laws**:
  1. *Inertia*: In an inertial frame, an object maintains its velocity $\mathbf{v}$ unless acted on by an external net force $\sum \mathbf{F} \ne 0$.
  2. *Momentum Rate*: $\mathbf{F} = \frac{d\mathbf{p}}{dt} = m\mathbf{a}$ (for constant mass $m$).
  3. *Action-Reaction*: Mutual forces between two bodies are equal in magnitude, opposite in direction, and act along the collinear line of centers: $\mathbf{F}_{12} = -\mathbf{F}_{21}$.
- **Dimensional Analysis & Limiting Cases**: Before solving complex ODEs, check scaling (e.g. $[c] = \text{kg/m}$ for quadratic drag) and test asymptotic limits ($t \to 0$, $t \to \infty$, $m \to \infty$, $c \to 0$).

### Key Governing Equations
1. **Quadratic Air Resistance (Nonlinear Ballistics)**:
   $$\mathbf{F}_{\text{drag}} = -c \|\mathbf{v}\| \mathbf{v} = -c v (v_x \hat{\mathbf{i}} + v_y \hat{\mathbf{j}})$$
   - Horizontal component:
     $$m \frac{dv_x}{dt} = -c \sqrt{v_x^2 + v_y^2} \, v_x$$
   - Vertical component:
     $$m \frac{dv_y}{dt} = -mg - c \sqrt{v_x^2 + v_y^2} \, v_y$$
2. **Terminal Velocity**:
   Setting $\Sigma F_y = 0 \implies mg = c v_t^2 \implies v_t = \sqrt{\frac{mg}{c}}$

### Classic Solved Problem Archetype
- **Vertical Drop with Quadratic Drag**:
  $$\frac{dv}{dt} = -g \left(1 - \frac{v^2}{v_t^2}\right) \implies \int \frac{dv}{1 - (v/v_t)^2} = -g \int dt \implies v(t) = -v_t \tanh\left(\frac{gt}{v_t}\right)$$
  Integrating once more yields position:
  $$y(t) = y_0 - \frac{v_t^2}{g} \ln\left[\cosh\left(\frac{gt}{v_t}\right)\right]$$

### Common Pitfalls
- Uncoupling $x$ and $y$ motions when air drag depends on total speed $v = \sqrt{v_x^2 + v_y^2}$. In vacuum, $x$ and $y$ decouple; under nonlinear drag, they are strictly coupled!

---

## 2. MECH-MOD-02: Oscillations & Coupled Normal Modes

### Core Concepts & Intuition
- **Simple Harmonic Motion (SHM)**: Restoring force proportional to displacement: $F = -kx$.
- **Damping & Driving**: Damping energy loss $F_d = -b\dot{x}$; harmonic external driving force $F(t) = F_0 \cos(\omega t)$.
- **Coupled Oscillators & Normal Modes**: In an $N$-degree-of-freedom system, normal modes are coordinates where every component oscillates at the same single characteristic frequency $\omega_k$.

### Key Governing Equations
1. **Damped Driven Harmonic Oscillator**:
   $$\ddot{x} + 2\gamma \dot{x} + \omega_0^2 x = \frac{F_0}{m} \cos(\omega t), \quad \text{where } \gamma = \frac{b}{2m}, \, \omega_0 = \sqrt{\frac{k}{m}}$$
2. **Resonant Amplitude & Phase Lag**:
   $$A(\omega) = \frac{F_0 / m}{\sqrt{(\omega_0^2 - \omega^2)^2 + 4\gamma^2 \omega^2}}, \quad \tan\delta = \frac{2\gamma \omega}{\omega_0^2 - \omega^2}$$
3. **Coupled Matrix Eigenvalue Problem**:
   $$\mathbf{M} \ddot{\mathbf{x}} + \mathbf{K} \mathbf{x} = \mathbf{0} \implies \det(\mathbf{K} - \omega^2 \mathbf{M}) = 0$$

### Classic Problem Model: 2-Mass 3-Spring Coupled System
- Masses $m_1 = m_2 = m$, spring constants $k_1 = k_2 = k_3 = k$.
- Normal mode 1 (Symmetric, in-phase): $\omega_1 = \sqrt{\frac{k}{m}}, \, \mathbf{v}_1 = \begin{pmatrix} 1 \\ 1 \end{pmatrix}$ (center spring unextended).
- Normal mode 2 (Antisymmetric, out-of-phase): $\omega_2 = \sqrt{\frac{3k}{m}}, \, \mathbf{v}_2 = \begin{pmatrix} 1 \\ -1 \end{pmatrix}$.

---

## 3. MECH-MOD-03: Conservation of Energy and Momentum

### Core Concepts & Intuition
- **Work-Energy Theorem**: $W_{\text{net}} = \Delta K = \frac{1}{2} m v_f^2 - \frac{1}{2} m v_i^2$.
- **Conservative Forces & Potential Energy**: A force is conservative if $\oint \mathbf{F} \cdot d\mathbf{r} = 0 \iff \nabla \times \mathbf{F} = \mathbf{0} \iff \mathbf{F} = -\nabla V$.
- **Center of Mass (CM) Frame**: In elastic collisions, the total momentum in the CM frame is identically zero ($\mathbf{P}_{\text{cm}} = \mathbf{0}$), making collision analysis symmetric and straightforward.

### Key Governing Equations
1. **Center of Mass Position & Velocity**:
   $$\mathbf{R}_{\text{cm}} = \frac{\sum m_i \mathbf{r}_i}{\sum m_i}, \quad \mathbf{V}_{\text{cm}} = \frac{\sum m_i \mathbf{v}_i}{M_{\text{total}}}$$
2. **Variable Mass System (Tsiolkovsky Rocket Equation)**:
   $$m \frac{dv}{dt} = -v_{\text{rel}} \left(-\frac{dm}{dt}\right) - mg \implies \Delta v = v_{\text{rel}} \ln\left(\frac{m_0}{m_f}\right) - gt$$
3. **1D Elastic Collision Velocities**:
   $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} + \frac{2m_2}{m_1 + m_2} v_{2i}, \quad v_{2f} = \frac{2m_1}{m_1 + m_2} v_{1i} + \frac{m_2 - m_1}{m_1 + m_2} v_{2i}$$

---

## 4. MECH-MOD-04: Lagrangian Mechanics & Principle of Stationary Action

### Core Concepts & Intuition
- **Generalized Coordinates**: Any set of variables $\{q_1, q_2, \dots, q_n\}$ that completely describe the configuration of the system, respecting holonomic constraints automatically.
- **Hamilton's Principle**: The true physical path $\mathbf{q}(t)$ is the one that extremizes (makes stationary) the action integral:
  $$S[\mathbf{q}] = \int_{t_1}^{t_2} L(q_i, \dot{q}_i, t) \, dt, \quad \delta S = 0$$
- **Lagrangian**: $L = T - V$ (Kinetic minus Potential Energy).
- **Noether's Theorem**: Every continuous symmetry of the Lagrangian corresponds to a conservation law (Time translation $\to$ Energy; Spatial translation $\to$ Linear momentum; Rotational symmetry $\to$ Angular momentum).

### Key Governing Equations
1. **Euler-Lagrange Equations**:
   $$\frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}_i}\right) - \frac{\partial L}{\partial q_i} = 0, \quad i = 1, \dots, n$$
2. **Generalized Momentum & Cyclic Coordinates**:
   $$p_i \equiv \frac{\partial L}{\partial \dot{q}_i}. \quad \text{If } \frac{\partial L}{\partial q_i} = 0 \implies \dot{p}_i = 0 \implies p_i = \text{constant}$$

### Classic Model: Spherical Pendulum / Double Pendulum
- For Double Pendulum with angles $\theta_1, \theta_2$:
  $$T = \frac{1}{2}(m_1+m_2) l_1^2 \dot{\theta}_1^2 + \frac{1}{2}m_2 l_2^2 \dot{\theta}_2^2 + m_2 l_1 l_2 \dot{\theta}_1 \dot{\theta}_2 \cos(\theta_1 - \theta_2)$$
  $$V = -(m_1+m_2)gl_1 \cos\theta_1 - m_2 g l_2 \cos\theta_2$$
  Equations of motion yield the coupled nonlinear matrix system $\mathbf{M}(\boldsymbol{\theta})\ddot{\boldsymbol{\theta}} = \mathbf{F}(\boldsymbol{\theta}, \dot{\boldsymbol{\theta}})$.

---

## 5. MECH-MOD-05: Central Forces & Keplerian Orbits

### Core Concepts & Intuition
- **Conservation of Angular Momentum**: Because $\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F} = \mathbf{0}$, $\mathbf{L} = \mathbf{r} \times m\mathbf{v} = \text{constant}$. Motion is strictly planar.
- **Effective Potential**: The angular motion contributes a repulsive "centrifugal barrier" term $\frac{L^2}{2mr^2}$ to the radial 1D equation of motion.

### Key Governing Equations
1. **Effective Potential**:
   $$V_{\text{eff}}(r) = V(r) + \frac{L^2}{2mr^2} = -\frac{GMm}{r} + \frac{L^2}{2mr^2}$$
2. **Orbit Equation (Binet Formula)**:
   $$\frac{d^2 u}{d\theta^2} + u = -\frac{m}{L^2 u^2} F(1/u), \quad u \equiv \frac{1}{r}$$
   For Newtonian gravity $F(r) = -k/r^2$:
   $$r(\theta) = \frac{r_0}{1 + \varepsilon \cos\theta}, \quad r_0 = \frac{L^2}{mk}, \quad \varepsilon = \sqrt{1 + \frac{2EL^2}{mk^2}}$$
   - $\varepsilon = 0$: Circular, $0 < \varepsilon < 1$: Ellipse, $\varepsilon = 1$: Parabola, $\varepsilon > 1$: Hyperbola.
3. **Kepler's Third Law**:
   $$T^2 = \frac{4\pi^2}{G(M + m)} a^3$$

---

## 6. MECH-MOD-06: Rigid Body Dynamics & Inertia Tensors

### Core Concepts & Intuition
- A rigid body consists of particles whose pairwise distances are fixed. Any motion is a translation of the center of mass plus a rotation about an instantaneous axis through the CM.
- **Inertia Tensor $\mathbf{I}$**: Relates angular velocity $\boldsymbol{\omega}$ to angular momentum $\mathbf{L} = \mathbf{I}\boldsymbol{\omega}$. Unlike scalars, $\mathbf{L}$ and $\boldsymbol{\omega}$ are generally **not parallel**!

### Key Governing Equations
1. **Inertia Tensor Components**:
   $$I_{xx} = \int (y^2 + z^2) dm, \quad I_{xy} = -\int xy \, dm, \quad \mathbf{I} = \begin{pmatrix} I_{xx} & I_{xy} & I_{xz} \\ I_{yx} & I_{yy} & I_{yz} \\ I_{zx} & I_{zy} & I_{zz} \end{pmatrix}$$
2. **Parallel Axis Theorem (Steiner's Theorem)**:
   $$I_{ij} = I_{ij}^{\text{cm}} + M (R^2 \delta_{ij} - R_i R_j)$$
3. **Euler's Equations of Motion in Body-Fixed Principal Frame**:
   $$I_1 \dot{\omega}_1 - (I_2 - I_3) \omega_2 \omega_3 = \tau_1$$
   $$I_2 \dot{\omega}_2 - (I_3 - I_1) \omega_3 \omega_1 = \tau_2$$
   $$I_3 \dot{\omega}_3 - (I_1 - I_2) \omega_1 \omega_2 = \tau_3$$
4. **Intermediate Axis Theorem (Tennis Racket / Dzhanibekov Effect)**:
   Rotation about principal axis with intermediate moment ($I_1 < I_2 < I_3$) is unstable, while rotation about maximum ($I_3$) and minimum ($I_1$) axes is Lyapunov stable.

---

## 7. MECH-MOD-07: Accelerating Reference Frames & Fictitious Forces

### Core Concepts & Intuition
- In a non-inertial reference frame rotating at angular velocity $\boldsymbol{\omega}$ with origin acceleration $\mathbf{a}_0$, Newton's second law holds only if fictitious (inertial) forces are added.

### Key Governing Equations
1. **Kinematics Transformation**:
   $$\left(\frac{d\mathbf{A}}{dt}\right)_{\text{inertial}} = \left(\frac{d\mathbf{A}}{dt}\right)_{\text{rotating}} + \boldsymbol{\omega} \times \mathbf{A}$$
2. **Effective Equation of Motion**:
   $$m \mathbf{a}_r = \mathbf{F}_{\text{real}} - m\mathbf{a}_0 - m \dot{\boldsymbol{\omega}} \times \mathbf{r} - 2m (\boldsymbol{\omega} \times \mathbf{v}_r) - m \boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r})$$
   - **Translational Fictitious Force**: $\mathbf{F}_{\text{trans}} = -m\mathbf{a}_0$
   - **Coriolis Force**: $\mathbf{F}_{\text{coriolis}} = -2m (\boldsymbol{\omega} \times \mathbf{v}_r)$
   - **Centrifugal Force**: $\mathbf{F}_{\text{centrifugal}} = -m \boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r}) = m \omega^2 \mathbf{r}_\perp$
   - **Euler Force**: $\mathbf{F}_{\text{euler}} = -m \dot{\boldsymbol{\omega}} \times \mathbf{r}$

---

## 8. MECH-MOD-08: Hamiltonian Formalism & Phase Space

### Core Concepts & Intuition
- While Lagrangian mechanics lives on the $n$-dimensional configuration space $q_i$ with second-order ODEs, Hamiltonian mechanics operates on the $2n$-dimensional **phase space** $(q_i, p_i)$ with first-order, highly symmetric ODEs.
- **Liouville's Theorem**: The phase-space volume of a Hamiltonian system is strictly conserved under time evolution: $\frac{d\rho}{dt} = 0$.

### Key Governing Equations
1. **Legendre Transformation**:
   $$H(q_i, p_i, t) = \sum_{i=1}^n p_i \dot{q}_i - L(q_i, \dot{q}_i, t), \quad \text{where } p_i \equiv \frac{\partial L}{\partial \dot{q}_i}$$
2. **Hamilton's Canonical Equations**:
   $$\dot{q}_i = \frac{\partial H}{\partial p_i}, \quad \dot{p}_i = -\frac{\partial H}{\partial q_i}$$
3. **Poisson Brackets**:
   $$\{f, g\} \equiv \sum_{i=1}^n \left( \frac{\partial f}{\partial q_i} \frac{\partial g}{\partial p_i} - \frac{\partial f}{\partial p_i} \frac{\partial g}{\partial q_i} \right)$$
   $$\frac{df}{dt} = \{f, H\} + \frac{\partial f}{\partial t}$$
   - Direct correspondence to quantum commutators: $\{f, g\} \longleftrightarrow \frac{1}{i\hbar}[\hat{f}, \hat{g}]$.
