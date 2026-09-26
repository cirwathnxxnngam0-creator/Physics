/**
 * bg_crystals.js - Dynamic Crystalline Low-Poly Faceted Mesh Background
 * Renders a living, faceted low-poly triangle tessellation matching user specifications.
 * Smoothly shifts through deep slate/charcoal/graphite tones (Darkness up to 70%).
 * Optimized with high-efficiency vertex wave kinematics at 60 FPS.
 */
(function() {
  'use strict';

  function initCrystalBackground() {
    let canvas = document.getElementById('bg-crystal-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'bg-crystal-canvas';
      canvas.className = 'bg-crystal-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '1';

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let vertices = [];
    let triangles = [];
    let animId = null;
    let isRunning = true;
    let startTime = performance.now();

    // Spacing between grid points (creates balanced crystalline facets)
    const CELL_SIZE = 95;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap at 1.5 for buttery 60fps
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildMesh();
    }

    function buildMesh() {
      cols = Math.ceil(width / CELL_SIZE) + 3;
      rows = Math.ceil(height / CELL_SIZE) + 3;
      vertices = [];
      triangles = [];

      const startX = -CELL_SIZE;
      const startY = -CELL_SIZE;

      // 1. Generate jittered grid vertices
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = startX + c * CELL_SIZE;
          const baseY = startY + r * CELL_SIZE;

          // Randomized static jitter
          const jitterX = (Math.random() - 0.5) * CELL_SIZE * 0.75;
          const jitterY = (Math.random() - 0.5) * CELL_SIZE * 0.75;

          // Wave motion parameters for organic undulation
          const phase = Math.random() * Math.PI * 2;
          const freqX = 0.0006 + Math.random() * 0.0006;
          const freqY = 0.0006 + Math.random() * 0.0006;
          const ampX = 10 + Math.random() * 14;
          const ampY = 10 + Math.random() * 14;

          vertices.push({
            baseX: baseX + jitterX,
            baseY: baseY + jitterY,
            x: baseX + jitterX,
            y: baseY + jitterY,
            phase,
            freqX,
            freqY,
            ampX,
            ampY
          });
        }
      }

      // 2. Build triangle faces (quads split diagonally)
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const i0 = r * cols + c;
          const i1 = r * cols + (c + 1);
          const i2 = (r + 1) * cols + (c + 1);
          const i3 = (r + 1) * cols + c;

          // Diagonal split alternating to make crystalline appearance
          if ((r + c) % 2 === 0) {
            triangles.push({
              v: [i0, i1, i2],
              seed: Math.random(),
              facetShift: (Math.random() - 0.5) * 0.12
            });
            triangles.push({
              v: [i0, i2, i3],
              seed: Math.random(),
              facetShift: (Math.random() - 0.5) * 0.12
            });
          } else {
            triangles.push({
              v: [i0, i1, i3],
              seed: Math.random(),
              facetShift: (Math.random() - 0.5) * 0.12
            });
            triangles.push({
              v: [i1, i2, i3],
              seed: Math.random(),
              facetShift: (Math.random() - 0.5) * 0.12
            });
          }
        }
      }
    }

    function render(now) {
      if (!isRunning) return;
      const elapsed = now - startTime;

      // 1. Update vertex wave positions
      for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        v.x = v.baseX + Math.sin(elapsed * v.freqX + v.phase) * v.ampX;
        v.y = v.baseY + Math.cos(elapsed * v.freqY + v.phase * 1.3) * v.ampY;
      }

      // 2. Clear canvas with soft pearl backdrop base
      ctx.fillStyle = '#EEF2F7';
      ctx.fillRect(0, 0, width, height);

      // Color cycle base parameters (smooth transition matching user reference image: lavender, lilac, pearl white)
      // Lightness level ~80%: Lightness between 76% and 94%
      const colorCycle = Math.sin(elapsed * 0.00018); // slow, relaxing ~35s cycle
      const baseHue = 240 + colorCycle * 28; // oscillates between 212 (cool periwinkle) and 268 (soft lilac)
      const baseSat = 16 + Math.cos(elapsed * 0.00025) * 6; // 10% - 22% subtle pastel saturation

      // Virtual directional light source for facet shading (from upper-left)
      const lightDirX = 0.55;
      const lightDirY = 0.70;
      const lightDirZ = 0.45;

      // 3. Render each facet
      for (let i = 0; i < triangles.length; i++) {
        const tri = triangles[i];
        const p0 = vertices[tri.v[0]];
        const p1 = vertices[tri.v[1]];
        const p2 = vertices[tri.v[2]];

        // Triangle surface normal estimation (cross product in 2.5D)
        const ax = p1.x - p0.x;
        const ay = p1.y - p0.y;
        const bx = p2.x - p0.x;
        const by = p2.y - p0.y;

        // Pseudo 3D normal vector z component
        const crossZ = Math.abs(ax * by - ay * bx);
        const normFactor = Math.min(crossZ / (CELL_SIZE * CELL_SIZE * 0.8), 1.0);

        // Calculate illumination based on facet angle + position + seed
        const centroidX = (p0.x + p1.x + p2.x) / 3;
        const centroidY = (p0.y + p1.y + p2.y) / 3;
        const screenGrad = (centroidX / width) * 0.06 + (centroidY / height) * 0.05;

        // Light intensity: 0.0 to 1.0
        const facetWave = Math.sin(elapsed * 0.00035 + tri.seed * 6.28) * 0.05;
        let intensity = 0.5 + tri.facetShift + facetWave - screenGrad;
        intensity = Math.max(0.0, Math.min(1.0, intensity));

        // Light crystalline tone: lightness ranges from 76% (shaded lilac) to 94% (bright pearl facet)
        const lightness = 76 + intensity * 18; // 76% to 94% (average ~82%)
        const hue = baseHue + tri.facetShift * 24;
        const sat = baseSat + intensity * 5;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        ctx.fillStyle = `hsl(${hue.toFixed(1)}, ${sat.toFixed(1)}%, ${lightness.toFixed(1)}%)`;
        ctx.fill();

        // Crystalline facet border (crisp white translucent line matching reference image)
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.65 + intensity * 0.3).toFixed(3)})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        isRunning = true;
        startTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    });

    resize();
    animId = requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrystalBackground);
  } else {
    initCrystalBackground();
  }
})();
