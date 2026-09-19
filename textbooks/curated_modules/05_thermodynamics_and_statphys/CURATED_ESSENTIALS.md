# Curated Essentials: Thermodynamics & Statistical Physics (อุณหพลศาสตร์และฟิสิกส์เชิงสถิติ)

This directory contains standalone, extracted PDF textbook modules and curated theoretical and practical knowledge for **Thermodynamics, Kinetic Theory, and Statistical Mechanics** from David Tong (*Statistical Physics* & *Kinetic Theory*, Cambridge University DAMTP).

---

## Module Index & Extracted Textbook PDFs

| Module ID | Module Title | Extracted PDF File | Source Chapters | Page Count | File Size |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **THERMO-MOD-01** | Classical Thermodynamics, Carnot Cycle & Entropy | [`01_Classical_Thermodynamics_and_Entropy.pdf`](./01_Classical_Thermodynamics_and_Entropy.pdf) | Tong SP Ch. 4 | 27 | 388 KB |
| **THERMO-MOD-02** | Statistical Ensembles & Partition Functions | [`02_Statistical_Ensembles_and_Partition_Functions.pdf`](./02_Statistical_Ensembles_and_Partition_Functions.pdf) | Tong SP Ch. 1 | 31 | 813 KB |
| **THERMO-MOD-03** | Classical Gases, Maxwell-Boltzmann & Real Gases | [`03_Classical_Gases_and_Interactions.pdf`](./03_Classical_Gases_and_Interactions.pdf) | Tong SP Ch. 2 | 30 | 522 KB |
| **THERMO-MOD-04** | Quantum Gases (Bose-Einstein & Fermi-Dirac) | [`04_Quantum_Gases_Bose_Fermi.pdf`](./04_Quantum_Gases_Bose_Fermi.pdf) | Tong SP Ch. 3 | 46 | 811 KB |
| **THERMO-MOD-05** | Kinetic Theory, Boltzmann Equation & Hydrodynamics | [`05_Kinetic_Theory_and_Transport.pdf`](./05_Kinetic_Theory_and_Transport.pdf) | Tong KT Ch. 1–2 | 52 | 591 KB |
| **THERMO-MOD-06** | Stochastic Processes & Linear Response Theory | [`06_Stochastic_Processes_and_Linear_Response.pdf`](./06_Stochastic_Processes_and_Linear_Response.pdf) | Tong KT Ch. 3–4 | 50 | 508 KB |

---

## 1. THERMO-MOD-01: Classical Thermodynamics & The Carnot Cycle

### Core Concepts & Intuition
- **First Law**: Energy conservation: $dE = \delta Q - \delta W$ (or $dE = \delta Q + \delta W_{\text{on}}$). For reversible work: $dE = T dS - P dV$.
- **Second Law**:
  - *Clausius Statement*: No process is possible whose sole result is the transfer of heat from a cooler to a hotter body.
  - *Kelvin Statement*: No process is possible whose sole result is the complete conversion of heat into work.
  - *Clausius Inequality*: $\oint \frac{\delta Q}{T} \le 0$ ($= 0$ for reversible cycles, $< 0$ for irreversible).
- **Carnot Engine**: Operates reversibly between hot reservoir $T_H$ and cold reservoir $T_C$ via two isotherms and two adiabats:
  $$\eta_{\text{carnot}} = 1 - \frac{T_C}{T_H} = \frac{W_{\text{net}}}{Q_H}$$

### Thermodynamic Potentials & Maxwell Relations
| Potential | Definition | Differential Form | Natural Variables |
| :--- | :--- | :--- | :---: |
| **Internal Energy ($E$)** | Fundamental | $dE = T dS - P dV$ | $(S, V)$ |
| **Helmholtz Free Energy ($F$)** | $F = E - TS$ | $dF = -S dT - P dV$ | $(T, V)$ |
| **Enthalpy ($H$)** | $H = E + PV$ | $dH = T dS + V dP$ | $(S, P)$ |
| **Gibbs Free Energy ($G$)** | $G = E - TS + PV$ | $dG = -S dT + V dP$ | $(T, P)$ |

- **Maxwell Relations** (by equality of mixed partial derivatives):
  $$\left(\frac{\partial T}{\partial V}\right)_S = -\left(\frac{\partial P}{\partial S}\right)_V, \quad \left(\frac{\partial S}{\partial V}\right)_T = \left(\frac{\partial P}{\partial T}\right)_V$$
  $$\left(\frac{\partial T}{\partial P}\right)_S = \left(\frac{\partial V}{\partial S}\right)_P, \quad \left(\frac{\partial S}{\partial P}\right)_T = -\left(\frac{\partial V}{\partial T}\right)_P$$

---

## 2. THERMO-MOD-02: Statistical Ensembles & Partition Functions

### Core Concepts & Intuition
- **Statistical Mechanics** provides the microscopic statistical foundation for macroscopic thermodynamics.
- **Three Core Ensembles**:
  1. **Microcanonical Ensemble**: Isolated system with fixed $(E, V, N)$.
     - Microstates count: $\Omega(E)$
     - Fundamental postulate: all accessible microstates are equally probable.
     - **Boltzmann's Entropy**:
       $$S = k_B \ln \Omega(E), \quad \frac{1}{T} \equiv \left(\frac{\partial S}{\partial E}\right)_{V, N}$$
  2. **Canonical Ensemble**: System in thermal contact with heat reservoir at fixed $(T, V, N)$.
     - Probability of microstate $|n\rangle$: $p_n = \frac{e^{-\beta E_n}}{Z}$, where $\beta \equiv \frac{1}{k_B T}$.
     - **Canonical Partition Function**:
       $$Z = \sum_n e^{-\beta E_n}$$
     - Macroscopic thermodynamic links:
       $$F = -k_B T \ln Z, \quad \langle E \rangle = -\frac{\partial \ln Z}{\partial \beta}, \quad S = -\left(\frac{\partial F}{\partial T}\right)_{V, N}$$
  3. **Grand Canonical Ensemble**: System exchanging energy and particles with reservoir at fixed $(T, V, \mu)$.
     - **Grand Partition Function**:
       $$\mathcal{Z} = \sum_{N=0}^\infty e^{\beta \mu N} Z_N = \sum_n e^{-\beta(E_n - \mu N_n)}$$
     - Grand Potential: $\Phi_G = -k_B T \ln \mathcal{Z} = -PV$.

---

## 3. THERMO-MOD-03: Classical Gases & Maxwell-Boltzmann Statistics

### Key Governing Equations
1. **Ideal Gas Partition Function**:
   $$Z_1 = V \left(\frac{2\pi m k_B T}{h^2}\right)^{3/2} = \frac{V}{\lambda_{\text{th}}^3}, \quad \lambda_{\text{th}} = \sqrt{\frac{2\pi \hbar^2}{m k_B T}} \text{ (thermal de Broglie wavelength)}$$
   For $N$ indistinguishable particles (Gibbs factor $1/N!$):
   $$Z_N = \frac{Z_1^N}{N!} \implies F \approx -N k_B T \left[ \ln\left(\frac{V}{N \lambda_{\text{th}}^3}\right) + 1 \right]$$
   - Equation of State: $P = -\left(\frac{\partial F}{\partial V}\right)_T = \frac{N k_B T}{V}$.
   - **Equipartition Theorem**: Each quadratic degree of freedom in the Hamiltonian contributes $\frac{1}{2} k_B T$ to the internal energy.
2. **Maxwell-Boltzmann Speed Distribution**:
   $$f(v) = 4\pi \left(\frac{m}{2\pi k_B T}\right)^{3/2} v^2 \exp\left(-\frac{m v^2}{2 k_B T}\right)$$
   - Most probable speed: $v_p = \sqrt{\frac{2k_B T}{m}}$
   - Mean speed: $\langle v \rangle = \sqrt{\frac{8k_B T}{\pi m}}$
   - Root-mean-square speed: $v_{\text{rms}} = \sqrt{\langle v^2 \rangle} = \sqrt{\frac{3k_B T}{m}}$

---

## 4. THERMO-MOD-04: Quantum Gases (Bose-Einstein & Fermi-Dirac)

### Core Distributions
For non-interacting particles with single-particle energy states $\varepsilon$:
1. **Fermi-Dirac Distribution (Fermions, half-integer spin, Pauli Exclusion)**:
   $$\bar{n}_{\text{FD}}(\varepsilon) = \frac{1}{e^{\beta(\varepsilon - \mu)} + 1}, \quad 0 \le \bar{n} \le 1$$
   - At $T = 0$: $\bar{n} = 1$ for $\varepsilon < E_F$, and $\bar{n} = 0$ for $\varepsilon > E_F$.
   - Fermi Energy: $E_F = \frac{\hbar^2}{2m} (3\pi^2 n)^{2/3}$.
   - High degeneracy pressure prevents white dwarf collapse (Chandrasekhar limit).
2. **Bose-Einstein Distribution (Bosons, integer spin)**:
   $$\bar{n}_{\text{BE}}(\varepsilon) = \frac{1}{e^{\beta(\varepsilon - \mu)} - 1}, \quad \mu \le 0$$
   - **Bose-Einstein Condensation (BEC)**: Below critical temperature $T_{\text{BEC}}$, a macroscopic fraction of particles condenses into the single ground state $\varepsilon_0 = 0$:
     $$T_{\text{BEC}} = \frac{2\pi \hbar^2}{m k_B} \left(\frac{n}{\zeta(3/2)}\right)^{2/3} \approx 3.31 \frac{\hbar^2 n^{2/3}}{m k_B}$$
3. **Blackbody Radiation (Photons, $\mu = 0$)**:
   - Planck distribution: $u(\omega) d\omega = \frac{\hbar}{\pi^2 c^3} \frac{\omega^3}{e^{\hbar\omega/k_B T} - 1} d\omega$
   - Stefan-Boltzmann Law: $j^* = \sigma T^4$, where $\sigma = \frac{\pi^2 k_B^4}{60 \hbar^3 c^2}$.

---

## 5. THERMO-MOD-05: Kinetic Theory, Boltzmann Equation & Hydrodynamics

### Core Concepts & Equations
1. **Mean Free Path & Transport Coefficients**:
   - Collision frequency: $\nu = n \sigma v_{\text{rel}}$, mean free path: $\ell = \frac{1}{\sqrt{2} n \sigma}$.
   - Dynamic Viscosity: $\eta \approx \frac{1}{3} \rho \bar{v} \ell$ (independent of pressure/density for ideal gas!).
   - Thermal Conductivity: $\kappa \approx \frac{1}{3} c_v \rho \bar{v} \ell$.
2. **Boltzmann Transport Equation**:
   $$\frac{\partial f}{\partial t} + \mathbf{v} \cdot \nabla_{\mathbf{r}} f + \frac{\mathbf{F}}{m} \cdot \nabla_{\mathbf{v}} f = \left(\frac{\partial f}{\partial t}\right)_{\text{coll}}$$
3. **Boltzmann's H-Theorem**:
   Defining $H(t) \equiv \int f \ln f \, d^3 v \, d^3 r$, collisions strictly guarantee $\frac{dH}{dt} \le 0$.
   - Provides the microscopic statistical proof of thermodynamic irreversibility ($S = -k_B H$).
4. **Navier-Stokes Derivation**:
   Moments of the Boltzmann equation yield macroscopic conservation of mass, momentum, and energy:
   $$\rho \left( \frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla)\mathbf{u} \right) = -\nabla P + \eta \nabla^2 \mathbf{u} + \left(\zeta + \frac{1}{3}\eta\right)\nabla(\nabla \cdot \mathbf{u}) + \mathbf{f}_{\text{ext}}$$

---

## 6. THERMO-MOD-06: Stochastic Processes & Linear Response Theory

### Core Concepts & Equations
1. **Langevin Equation (Brownian Motion)**:
   $$m \frac{dv}{dt} = -\gamma v + \xi(t), \quad \langle \xi(t) \rangle = 0, \quad \langle \xi(t)\xi(t') \rangle = 2 k_B T \gamma \, \delta(t - t')$$
2. **Einstein Diffusion Relation**:
   $$D = \frac{k_B T}{\gamma} = \frac{k_B T}{6\pi \eta r}$$
   Connects microscopic thermal fluctuations ($k_B T$) to macroscopic dissipative friction ($\gamma$).
3. **Fokker-Planck Equation**:
   $$\frac{\partial P(x, t)}{\partial t} = -\frac{\partial}{\partial x}[A(x) P(x, t)] + \frac{1}{2}\frac{\partial^2}{\partial x^2}[B(x) P(x, t)]$$
4. **Kramers-Kronig Relations (Causality & Analyticity)**:
   $$\text{Re}[\chi(\omega)] = \frac{1}{\pi} \mathcal{P}\int_{-\infty}^\infty \frac{\text{Im}[\chi(\omega')]}{\omega' - \omega} d\omega'$$
   $$\text{Im}[\chi(\omega)] = -\frac{1}{\pi} \mathcal{P}\int_{-\infty}^\infty \frac{\text{Re}[\chi(\omega')]}{\omega' - \omega} d\omega'$$
   Guarantees that absorption and dispersion in matter are fundamentally linked by causality.
