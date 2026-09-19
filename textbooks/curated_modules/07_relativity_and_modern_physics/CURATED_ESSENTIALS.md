# Curated Essentials: Special Relativity & Modern Physics (สัมพัทธภาพพิเศษและฟิสิกส์สมัยใหม่)

This directory contains standalone, extracted PDF textbook modules and curated theoretical and practical knowledge for **Special Relativity and Modern Dynamics** from David Morin (*Introduction to Classical Mechanics*, Harvard University / Cambridge University Press).

---

## Module Index & Extracted Textbook PDFs

| Module ID | Module Title | Extracted PDF File | Source Chapters | Page Count | File Size |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **REL-MOD-01** | Relativistic Kinematics & Lorentz Transformations | [`01_Relativity_Kinematics.pdf`](./01_Relativity_Kinematics.pdf) | Morin Ch. 11 | 83 | 917 KB |
| **REL-MOD-02** | Relativistic Dynamics, Energy-Momentum & Collisions | [`02_Relativity_Dynamics.pdf`](./02_Relativity_Dynamics.pdf) | Morin Ch. 12 | 50 | 512 KB |
| **REL-MOD-03** | Four-Vectors & General Relativity Foundations | [`03_Four_Vectors_and_General_Relativity.pdf`](./03_Four_Vectors_and_General_Relativity.pdf) | Morin Ch. 13–14 | 41 | 414 KB |

---

## 1. REL-MOD-01: Relativistic Kinematics & Lorentz Transformations

### Core Concepts & Postulates
1. **The Postulate of Relativity**: The laws of physics are identical in all inertial reference frames.
2. **The Constancy of the Speed of Light**: The speed of light in vacuum $c \approx 2.998 \times 10^8\text{ m/s}$ is constant in all inertial reference frames, independent of the motion of the source or observer.
3. **Lorentz Factor**:
   $$\gamma \equiv \frac{1}{\sqrt{1 - v^2/c^2}} = \frac{1}{\sqrt{1 - \beta^2}} \ge 1, \quad \beta \equiv \frac{v}{c}$$

### Fundamental Relativistic Kinematics Effects
1. **Relativity of Simultaneity**:
   Two spatially separated events that are simultaneous in frame $S$ are **not** simultaneous in a moving frame $S'$:
   $$\Delta t' = -\gamma \frac{v \Delta x}{c^2} \implies \text{rear clock reads ahead by } \frac{L_0 v}{c^2}$$
2. **Time Dilation**:
   A moving clock runs slower relative to stationary observers:
   $$\Delta t = \gamma \Delta \tau = \frac{\Delta \tau}{\sqrt{1 - v^2/c^2}} \ge \Delta \tau$$
   where $\Delta \tau$ is proper time (measured in the clock's rest frame).
3. **Length Contraction**:
   An object moves with speed $v$ contracts along its direction of motion:
   $$L = \frac{L_0}{\gamma} = L_0 \sqrt{1 - \frac{v^2}{c^2}} \le L_0$$
   (Transverse dimensions perpendicular to velocity remain unchanged: $y' = y, z' = z$).

### The Standard Lorentz Transformation (boost along $x$)
$$\begin{pmatrix} c t' \\ x' \\ y' \\ z' \end{pmatrix} = \begin{pmatrix} \gamma & -\gamma\beta & 0 & 0 \\ -\gamma\beta & \gamma & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix} \begin{pmatrix} c t \\ x \\ y \\ z \end{pmatrix}$$
- **Relativistic Velocity Addition (Einstein Velocity Addition Formula)**:
  $$u_x' = \frac{u_x - v}{1 - \frac{u_x v}{c^2}}, \quad u_y' = \frac{u_y}{\gamma \left(1 - \frac{u_x v}{c^2}\right)}$$
  (If $u_x = c$, then $u_x' = \frac{c - v}{1 - v/c} = c$, verifying that light travels at $c$ for all observers!).

---

## 2. REL-MOD-02: Relativistic Dynamics & Energy-Momentum

### Core Formulations
1. **Relativistic Momentum**:
   $$\mathbf{p} = \gamma m \mathbf{v} = \frac{m\mathbf{v}}{\sqrt{1 - v^2/c^2}}$$
2. **Total Relativistic Energy**:
   $$E = \gamma m c^2 = \frac{m c^2}{\sqrt{1 - v^2/c^2}} = E_0 + K$$
   - Rest mass energy: $E_0 = m c^2$
   - Relativistic kinetic energy: $K = (\gamma - 1) m c^2 \approx \frac{1}{2} m v^2 + \frac{3}{8} m \frac{v^4}{c^2} + \dots$
3. **Energy-Momentum Invariant Relation**:
   $$E^2 - p^2 c^2 = m^2 c^4 \iff E = \sqrt{p^2 c^2 + m^2 c^4}$$
   - For massless particles (e.g. photons, $m = 0$): $E = p c$.

### Relativistic Collisions & Decay
- In any collision or nuclear decay, total four-momentum is conserved:
  $$\sum E_{\text{initial}} = \sum E_{\text{final}}, \quad \sum \mathbf{p}_{\text{initial}} = \sum \mathbf{p}_{\text{final}}$$
- **Threshold Energy for Particle Creation ($A + B \to C_1 + C_2 + \dots$)**:
  $$E_{\text{cm}}^2 = (P_A + P_B)^2 = m_A^2 c^4 + m_B^2 c^4 + 2 E_A m_B c^2 \ge \left(\sum m_{\text{products}} c^2\right)^2$$

---

## 3. REL-MOD-03: Four-Vectors & Foundations of General Relativity

### Four-Vector Formalism
- Metric signature: $\eta_{\mu\nu} = \text{diag}(1, -1, -1, -1)$ (or $(-1, 1, 1, 1)$).
- **Four-Position**: $X^\mu = (ct, \mathbf{r})$.
- **Invariant Spacetime Interval**:
  $$ds^2 = \eta_{\mu\nu} dX^\mu dX^\nu = c^2 dt^2 - dx^2 - dy^2 - dz^2 = c^2 d\tau^2$$
  - $ds^2 > 0$: Timelike (causally connectable by physical massive particles).
  - $ds^2 = 0$: Lightlike / Null (traveled by light rays).
  - $ds^2 < 0$: Spacelike (events cannot influence each other).
- **Four-Velocity**:
  $$U^\mu \equiv \frac{dX^\mu}{d\tau} = \gamma (c, \mathbf{v}), \quad U_\mu U^\mu = c^2$$
- **Four-Momentum**:
  $$P^\mu = m U^\mu = (E/c, \mathbf{p}), \quad P_\mu P^\mu = m^2 c^2$$

### Foundations of General Relativity
1. **The Equivalence Principle**:
   - The effects of a uniform gravitational field $\mathbf{g}$ are locally indistinguishable from those of an accelerated reference frame with acceleration $\mathbf{a} = -\mathbf{g}$.
   - Inertial mass equals gravitational mass: $m_i \equiv m_g$.
2. **Gravitational Time Dilation**:
   A clock at a lower gravitational potential (closer to a massive body) ticks slower than a clock at higher altitude:
   $$\frac{\Delta t_2}{\Delta t_1} = 1 + \frac{\Delta \Phi}{c^2} = 1 + \frac{gh}{c^2}$$
   - Crucial correction applied in GPS satellite constellations ($+45.9\ \mu\text{s/day}$ gravitational gain minus $-7.2\ \mu\text{s/day}$ special relativistic kinematic loss = net $+38.7\ \mu\text{s/day}$).
3. **Curvature of Spacetime**:
   Mass-energy curves spacetime, and free-falling bodies follow **geodesics** (paths of extremal proper time) through the curved Riemannian manifold:
   $$G_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}$$
