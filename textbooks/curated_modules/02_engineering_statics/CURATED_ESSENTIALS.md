# Curated Essentials: Engineering Statics & Structural Mechanics (สถิตยศาสตร์วิศวกรรมและโครงสร้าง)

This directory contains standalone, extracted PDF textbook modules and curated theoretical and practical knowledge for **Engineering Statics and Structural Mechanics** from Daniel W. Baker & William Haynes (*Engineering Statics: Open and Interactive*).

---

## Module Index & Extracted Textbook PDFs

| Module ID | Module Title | Extracted PDF File | Source Chapters | Page Count | File Size |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **STAT-MOD-01** | Forces, Vectors, and Particle Equilibrium | [`01_Forces_and_Particle_Equilibrium.pdf`](./01_Forces_and_Particle_Equilibrium.pdf) | Baker Ch. 1–3 | 120 | 6.78 MB |
| **STAT-MOD-02** | Moments, Static Equivalence & Rigid Body Equilibrium | [`02_Moments_and_Rigid_Body_Equilibrium.pdf`](./02_Moments_and_Rigid_Body_Equilibrium.pdf) | Baker Ch. 4–5 | 79 | 4.41 MB |
| **STAT-MOD-03** | Structural Equilibrium: Trusses, Frames & Machines | [`03_Trusses_Frames_and_Machines.pdf`](./03_Trusses_Frames_and_Machines.pdf) | Baker Ch. 6 | 32 | 1.83 MB |
| **STAT-MOD-04** | Centroids, Centers of Gravity & Distributed Loads | [`04_Centroids_and_Distributed_Loads.pdf`](./04_Centroids_and_Distributed_Loads.pdf) | Baker Ch. 7 | 62 | 3.52 MB |
| **STAT-MOD-05** | Internal Forces & Beam Shear/Moment Diagrams (SFD/BMD) | [`05_Internal_Forces_SFD_BMD.pdf`](./05_Internal_Forces_SFD_BMD.pdf) | Baker Ch. 8 | 45 | 2.61 MB |
| **STAT-MOD-06** | Dry Friction, Wedges, Belts, and Screws | [`06_Dry_Friction_and_Machines.pdf`](./06_Dry_Friction_and_Machines.pdf) | Baker Ch. 9 | 38 | 2.19 MB |
| **STAT-MOD-07** | Area and Mass Moments of Inertia | [`07_Moments_of_Inertia.pdf`](./07_Moments_of_Inertia.pdf) | Baker Ch. 10 | 50 | 2.87 MB |

---

## 1. STAT-MOD-01: Forces, Vectors & Particle Equilibrium

### Core Concepts & Intuition
- **Particle Equilibrium**: A particle is in static equilibrium if and only if the vector resultant of all concurrent forces acting on it is identically zero:
  $$\sum \mathbf{F} = \mathbf{0} \iff \sum F_x = 0, \quad \sum F_y = 0, \quad \sum F_z = 0$$
- **Unit Direction Vectors**: In 3D space, a force with magnitude $F$ directed from point $A(x_A, y_A, z_A)$ to $B(x_B, y_B, z_B)$ is represented as:
  $$\mathbf{F} = F \hat{\mathbf{u}}_{AB} = F \frac{(x_B - x_A)\hat{\mathbf{i}} + (y_B - y_A)\hat{\mathbf{j}} + (z_B - z_A)\hat{\mathbf{k}}}{\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}}$$

### Essential Solved Archetype
- **3D Concurrent Cable Tension System**:
  - Given a ring suspended by three non-coplanar cables supporting a load $W$.
  - Express each cable tension $\mathbf{T}_A, \mathbf{T}_B, \mathbf{T}_C$ via unit direction vectors.
  - Formulate linear system:
    $$\begin{pmatrix} u_{Ax} & u_{Bx} & u_{Cx} \\ u_{Ay} & u_{By} & u_{Cy} \\ u_{Az} & u_{Bz} & u_{Cz} \end{pmatrix} \begin{pmatrix} T_A \\ T_B \\ T_C \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ W \end{pmatrix}$$
  - Invert matrix via Cramer's rule or Gaussian elimination to determine cable tensions.

---

## 2. STAT-MOD-02: Moments, Static Equivalence & Rigid Body Equilibrium

### Core Concepts & Intuition
- **Moment of a Force**: The rotational tendency caused by a force about a point: $\mathbf{M}_O = \mathbf{r} \times \mathbf{F}$.
- **Varignon's Theorem**: The moment of a force about any point is equal to the sum of the moments of the components of the force about that point:
  $$\mathbf{r} \times (\mathbf{F}_1 + \mathbf{F}_2) = (\mathbf{r} \times \mathbf{F}_1) + (\mathbf{r} \times \mathbf{F}_2)$$
- **Equivalent Force-Couple System**: Any arbitrary 3D system of forces and couples can be reduced to an equivalent single resultant force $\mathbf{F}_R = \sum \mathbf{F}$ acting at point $O$ plus a resultant couple moment $\mathbf{M}_{RO} = \sum \mathbf{M}_O$.
- **Rigid Body Equilibrium Conditions**:
  $$\sum \mathbf{F} = \mathbf{0}, \quad \sum \mathbf{M}_O = \mathbf{0} \quad (\text{for any point } O)$$

### 2D Support Reactions Reference
- **Roller / Rocker**: 1 unknown (reaction normal to surface).
- **Smooth Pin / Hinge**: 2 unknowns ($R_x, R_y$).
- **Fixed (Clamped) Support**: 3 unknowns ($R_x, R_y, M_z$).

---

## 3. STAT-MOD-03: Structural Equilibrium: Trusses, Frames & Machines

### Core Concepts & Intuition
- **Truss Assumptions**: All members are straight two-force members connected at pin joints; loads are applied only at joints; member weights are negligible.
- **Method of Joints**: Isolate individual pin joints and solve $\sum F_x = 0, \sum F_y = 0$ (ideal for finding forces in all members).
- **Method of Sections**: Pass an imaginary cutting plane through no more than 3 non-concurrent members of interest, isolate one side, and solve $\sum F_x = 0, \sum F_y = 0, \sum M_P = 0$ (ideal for rapid single-member analysis).
- **Zero-Force Members Inspection Rules**:
  1. *Rule 1*: If two non-collinear members form an unloaded joint, both members carry zero force.
  2. *Rule 2*: If three members meet at an unloaded joint where two are collinear, the third member is a zero-force member.
- **Frames vs. Machines**: Frames are rigid structures intended to remain stationary under load; machines contain moving parts intended to alter or transmit forces. Both contain multi-force members (members subject to 3 or more forces/moments).

---

## 4. STAT-MOD-04: Centroids, Centers of Gravity & Distributed Loads

### Core Concepts & Intuition
- The **Centroid** represents the geometric center of a shape. For a uniform material, the center of gravity coincides with the centroid.
- **Distributed Beam Loadings**: A distributed load $w(x)$ [N/m] can be replaced by a single concentrated equivalent force $F_R$:
  $$F_R = \int_0^L w(x) \, dx = \text{Area under load curve}$$
  The line of action of $F_R$ passes through the centroid $\bar{x}$ of the load diagram:
  $$\bar{x} = \frac{\int_0^L x \, w(x) \, dx}{\int_0^L w(x) \, dx}$$

### Composite Shape Centroid Formulas
$$\bar{X} = \frac{\sum \bar{x}_i A_i}{\sum A_i}, \quad \bar{Y} = \frac{\sum \bar{y}_i A_i}{\sum A_i}$$

---

## 5. STAT-MOD-05: Internal Forces & Beam Shear/Moment Diagrams (SFD/BMD)

### Core Concepts & Intuition
- To design beams against structural failure, internal shear forces $V(x)$ and bending moments $M(x)$ along the span must be mapped.
- **Standard Beam Sign Convention**:
  - Positive Normal Force $N$: Puts section in tension.
  - Positive Shear Force $V$: Tends to rotate the element clockwise (up on left face, down on right face).
  - Positive Bending Moment $M$: Causes compression on the top fibers and tension on bottom fibers ("smiles" / holds water).

### Differential Relations Governing Beams
$$\frac{dV}{dx} = w(x) \implies \Delta V = \int_{x_1}^{x_2} w(x) \, dx$$
$$\frac{dM}{dx} = V(x) \implies \Delta M = \int_{x_1}^{x_2} V(x) \, dx$$

### Key Construction Rules for SFD/BMD
1. The slope of the shear curve at any point equals the value of the distributed load $w(x)$ at that point.
2. The change in shear $\Delta V$ between two points equals the area under the distributed load curve.
3. A point downward concentrated load causes an instantaneous downward jump in shear equal to the magnitude of the force.
4. The slope of the moment diagram equals the shear force $V(x)$ at that point.
5. Points of **maximum or minimum bending moment** occur where the shear force passes through zero ($\frac{dM}{dx} = V = 0$) or at concentrated load discontinuities.
6. A concentrated clockwise couple moment causes an instantaneous upward step in the bending moment diagram.

---

## 6. STAT-MOD-06: Dry Friction, Wedges, Belts, and Screws

### Core Concepts & Intuition
- **Coulomb Dry Friction**:
  - Impending slip: $F_{\text{max}} = \mu_s N$.
  - Dynamic sliding: $F_k = \mu_k N$ (where $\mu_k < \mu_s$).
  - Friction angle: $\tan \phi_s = \mu_s$.
- **Slipping vs. Tipping of Blocks**:
  - A block of width $b$ and height $h$ subjected to horizontal pull $P$ at height $y$:
    - Condition for Slip: $P = \mu_s W$.
    - Condition for Tip: Taking moments about the bottom corner gives $P_{\text{tip}} = W \frac{b}{2y}$.
    - If $P_{\text{slip}} < P_{\text{tip}}$, the block **slips** first. If $P_{\text{tip}} < P_{\text{slip}}$, it **tips** first.

### Machine Elements Formulas
1. **Flat Belt Friction (Eytelwein's / Capstan Equation)**:
   $$T_2 = T_1 e^{\mu \beta}$$
   where $T_2 > T_1$ and $\beta$ is the contact angle in **radians**.
2. **Square-Threaded Power Screws**:
   $$M = W r_m \tan(\theta \pm \phi_s)$$
   ($+$ to raise load, $-$ to lower load; where $\tan\theta = \frac{L}{2\pi r_m}$ is the lead angle).
   - Self-locking condition: $\phi_s \ge \theta \iff \mu_s \ge \tan\theta$.

---

## 7. STAT-MOD-07: Area and Mass Moments of Inertia

### Core Concepts & Intuition
- **Second Moment of Area**: Quantifies a structural cross-section's resistance to bending and deflection:
  $$I_x = \int_A y^2 \, dA, \quad I_y = \int_A x^2 \, dA$$
- **Polar Moment of Area**: Quantifies resistance to torsional twisting:
  $$J_O = \int_A r^2 \, dA = I_x + I_y$$

### Parallel Axis Theorem (Steiner's Theorem)
$$I_x = \bar{I}_{x'} + A d_y^2, \quad I_y = \bar{I}_{y'} + A d_x^2$$
where $\bar{I}$ is the moment of inertia about the centroidal axis, and $d$ is the perpendicular distance between parallel axes.

### Standard Cross-Section Reference Values
- **Rectangle ($b \times h$)**:
  $$\bar{I}_x = \frac{1}{12} b h^3, \quad I_{\text{base}} = \frac{1}{3} b h^3$$
- **Solid Circle (Radius $R$)**:
  $$\bar{I}_x = \bar{I}_y = \frac{\pi}{4} R^4, \quad J_O = \frac{\pi}{2} R^4$$
- **Radius of Gyration**:
  $$k = \sqrt{\frac{I}{A}}$$
