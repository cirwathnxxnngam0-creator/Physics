# Curated Essentials: Vector Calculus & Mathematical Physics (แคลคูลัสเวกเตอร์และฟิสิกส์เชิงคณิตศาสตร์)

This directory contains standalone, extracted PDF textbook modules and curated theoretical and practical knowledge for **Vector Calculus and Mathematical Physics** from David Tong (*Vector Calculus*, Cambridge University DAMTP).

---

## Module Index & Extracted Textbook PDFs

| Module ID | Module Title | Extracted PDF File | Source Chapters | Page Count | File Size |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **MATH-MOD-01** | Curves, Frenet-Serret Frame & Line Integrals | [`01_Curves_Frenet_Serret_Line_Integrals.pdf`](./01_Curves_Frenet_Serret_Line_Integrals.pdf) | Tong VC Ch. 1 | 21 | 544 KB |
| **MATH-MOD-02** | Surfaces, Volumes, Coordinate Systems & Flux | [`02_Surfaces_Volumes_Flux_Integrals.pdf`](./02_Surfaces_Volumes_Flux_Integrals.pdf) | Tong VC Ch. 2 | 25 | 2.84 MB |
| **MATH-MOD-03** | Grad, Div, Curl & Orthogonal Curvilinear Coordinates | [`03_Grad_Div_Curl_Curvilinear.pdf`](./03_Grad_Div_Curl_Curvilinear.pdf) | Tong VC Ch. 3 | 15 | 495 KB |
| **MATH-MOD-04** | Integral Theorems: Divergence, Green & Stokes | [`04_Integral_Theorems_Gauss_Stokes.pdf`](./04_Integral_Theorems_Gauss_Stokes.pdf) | Tong VC Ch. 4 | 25 | 2.36 MB |
| **MATH-MOD-05** | Potential Theory, Laplace/Poisson & Tensors | [`05_Poisson_Laplace_and_Tensors.pdf`](./05_Poisson_Laplace_and_Tensors.pdf) | Tong VC Ch. 5–6 | 42 | 1.01 MB |

---

## 1. MATH-MOD-01: Curves, Frenet-Serret Frame & Line Integrals

### Core Concepts & Intuition
- **Parameterized Curve**: Trajectory in 3D: $\mathbf{r}(t) = x(t)\hat{\mathbf{i}} + y(t)\hat{\mathbf{j}} + z(t)\hat{\mathbf{k}}$.
- **Arc Length Parameter ($s$)**: $s(t) = \int_{t_0}^t \|\dot{\mathbf{r}}(t')\| dt' \implies \frac{ds}{dt} = v(t)$.
- **Frenet-Serret Orthonormal Frame ($\mathbf{T}, \mathbf{N}, \mathbf{B}$)**:
  - Unit Tangent: $\mathbf{T} = \frac{d\mathbf{r}}{ds}$.
  - Unit Principal Normal: $\mathbf{N} = \frac{1}{\kappa} \frac{d\mathbf{T}}{ds}$, where $\kappa = \left\|\frac{d\mathbf{T}}{ds}\right\|$ is the **curvature**.
  - Unit Binormal: $\mathbf{B} = \mathbf{T} \times \mathbf{N}$.

### Frenet-Serret Equations
$$\frac{d\mathbf{T}}{ds} = \kappa \mathbf{N}$$
$$\frac{d\mathbf{N}}{ds} = -\kappa \mathbf{T} + \tau \mathbf{B}$$
$$\frac{d\mathbf{B}}{ds} = -\tau \mathbf{N}$$
where $\tau$ is the **torsion** (measures how sharply the curve twists out of the osculating plane).

### Line Integrals & Conservative Fields
- Work done along curve $C$: $W = \int_C \mathbf{F} \cdot d\mathbf{r}$.
- A field $\mathbf{F}$ is **conservative** if and only if any of the following equivalent conditions hold:
  1. $\int_C \mathbf{F} \cdot d\mathbf{r}$ depends only on endpoints $A$ and $B$, not on the path.
  2. $\oint \mathbf{F} \cdot d\mathbf{r} = 0$ for every closed loop.
  3. $\mathbf{F} = \nabla \phi$ for some single-valued scalar potential $\phi$.
  4. $\nabla \times \mathbf{F} = \mathbf{0}$ (in a simply connected domain).

---

## 2. MATH-MOD-02: Surfaces, Volumes & Flux Integrals

### Core Concepts & Equations
1. **Coordinate Transformations & The Jacobian Determinant**:
   $$dx \, dy \, dz = |J| \, du \, dv \, dw, \quad \text{where } J = \det \begin{pmatrix} \frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} & \frac{\partial x}{\partial w} \\ \frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} & \frac{\partial y}{\partial w} \\ \frac{\partial z}{\partial u} & \frac{\partial z}{\partial v} & \frac{\partial z}{\partial w} \end{pmatrix}$$
2. **Standard Curvilinear Volume Elements**:
   - **Cylindrical Coordinates** $(r, \theta, z)$:
     $$x = r\cos\theta, \, y = r\sin\theta, \, z = z \implies dV = r \, dr \, d\theta \, dz$$
   - **Spherical Polar Coordinates** $(r, \theta, \phi)$ [Physics convention: $\theta = \text{polar}, \phi = \text{azimuthal}$]:
     $$x = r\sin\theta\cos\phi, \, y = r\sin\theta\sin\phi, \, z = r\cos\theta \implies dV = r^2 \sin\theta \, dr \, d\theta \, d\phi$$
3. **Surface Flux Integral**:
   $$\Phi = \iint_S \mathbf{F} \cdot d\mathbf{A} = \iint_S (\mathbf{F} \cdot \hat{\mathbf{n}}) \, dA$$
   For a surface parameterized by $\mathbf{r}(u, v)$:
   $$d\mathbf{A} = \left(\frac{\partial \mathbf{r}}{\partial u} \times \frac{\partial \mathbf{r}}{\partial v}\right) du \, dv$$

---

## 3. MATH-MOD-03: Differential Vector Operators & Curvilinear Systems

### Key Differential Identities
1. **Curl of a Gradient is Identically Zero**:
   $$\nabla \times (\nabla \phi) = \mathbf{0}$$
2. **Divergence of a Curl is Identically Zero**:
   $$\nabla \cdot (\nabla \times \mathbf{F}) = 0$$
3. **Vector Laplacian**:
   $$\nabla \times (\nabla \times \mathbf{F}) = \nabla(\nabla \cdot \mathbf{F}) - \nabla^2 \mathbf{F}$$

### General Orthogonal Curvilinear Coordinates $(u_1, u_2, u_3)$
Metric scale factors: $h_i = \left\|\frac{\partial \mathbf{r}}{\partial u_i}\right\| \implies ds^2 = h_1^2 du_1^2 + h_2^2 du_2^2 + h_3^2 du_3^2$.
- **Gradient**:
  $$\nabla \phi = \frac{1}{h_1}\frac{\partial \phi}{\partial u_1}\hat{\mathbf{e}}_1 + \frac{1}{h_2}\frac{\partial \phi}{\partial u_2}\hat{\mathbf{e}}_2 + \frac{1}{h_3}\frac{\partial \phi}{\partial u_3}\hat{\mathbf{e}}_3$$
- **Divergence**:
  $$\nabla \cdot \mathbf{F} = \frac{1}{h_1 h_2 h_3} \left[ \frac{\partial}{\partial u_1}(h_2 h_3 F_1) + \frac{\partial}{\partial u_2}(h_1 h_3 F_2) + \frac{\partial}{\partial u_3}(h_1 h_2 F_3) \right]$$
- **Curl**:
  $$\nabla \times \mathbf{F} = \frac{1}{h_1 h_2 h_3} \det \begin{pmatrix} h_1 \hat{\mathbf{e}}_1 & h_2 \hat{\mathbf{e}}_2 & h_3 \hat{\mathbf{e}}_3 \\ \frac{\partial}{\partial u_1} & \frac{\partial}{\partial u_2} & \frac{\partial}{\partial u_3} \\ h_1 F_1 & h_2 F_2 & h_3 F_3 \end{pmatrix}$$
- **Laplacian**:
  $$\nabla^2 \phi = \frac{1}{h_1 h_2 h_3} \sum_{i=1}^3 \frac{\partial}{\partial u_i}\left(\frac{h_1 h_2 h_3}{h_i^2}\frac{\partial \phi}{\partial u_i}\right)$$

---

## 4. MATH-MOD-04: The Great Integral Theorems

### 1. Divergence Theorem (Gauss-Ostrogradsky)
The outward flux of a vector field through a closed surface $S$ equals the volume integral of its divergence throughout the enclosed volume $V$:
$$\oiint_S \mathbf{F} \cdot d\mathbf{A} = \iiint_V (\nabla \cdot \mathbf{F}) \, dV$$
- *Physical Meaning*: Directly expresses local source density. If $\nabla \cdot \mathbf{F} = 0$ everywhere inside $V$, the net outward flux through any surrounding closed surface is zero.

### 2. Stokes' Theorem (Kelvin-Stokes)
The circulation of a vector field around a closed boundary curve $C = \partial S$ equals the surface flux of its curl across any open surface $S$ capping $C$:
$$\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{A}$$
- *Physical Meaning*: Macro-circulation is the sum of microscopic vortex swirls.

### 3. Green's Theorem in the Plane
For a planar region $D$ bounded by curve $C = \partial D$:
$$\oint_C (P \, dx + Q \, dy) = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dx \, dy$$
- *Area Formula*: $\text{Area}(D) = \frac{1}{2} \oint_C (x \, dy - y \, dx)$.

---

## 5. MATH-MOD-05: Potential Theory, PDEs & Tensors

### Harmonic Functions & Laplace Equation
- Solutions to $\nabla^2 \phi = 0$ are **harmonic functions**.
- **Mean Value Theorem**: The value of a harmonic function at the center of a sphere equals its average value over the spherical surface:
  $$\phi(\mathbf{r}_0) = \frac{1}{4\pi R^2} \oiint \phi \, dA$$
- **Maximum Principle**: A non-constant harmonic function cannot attain an isolated local maximum or minimum in the interior of its domain.

### Cartesian Tensors
- A rank-$k$ tensor transforms under orthogonal rotation matrix $R_{ij}$ as:
  $$T'_{i_1 i_2 \dots i_k} = R_{i_1 j_1} R_{i_2 j_2} \dots R_{i_k j_k} T_{j_1 j_2 \dots j_k}$$
- Invariant Tensors: Kronecker delta $\delta_{ij}$ and Levi-Civita permutation symbol $\epsilon_{ijk}$.
- The Contracted Epsilon-Delta Identity:
  $$\epsilon_{ijk} \epsilon_{imn} = \delta_{jm}\delta_{kn} - \delta_{jn}\delta_{km}$$
  (The master engine for proving all vector cross-product identities!).
