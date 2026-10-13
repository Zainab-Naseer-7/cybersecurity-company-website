/**
 * NEXORA CYBER - Hero Cybersecurity Canvas Engine
 * Lightweight, 60fps hardware-accelerated interactive network & shield visualization
 */

(function () {
  'use strict';

  const canvas = document.getElementById('heroCyberCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let isVisible = true;
  let width, height;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Mouse interaction state
  const mouse = {
    x: null,
    y: null,
    radius: 120,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0
  };

  // Node network parameters
  const NODE_COUNT = 38;
  const nodes = [];
  let radarAngle = 0;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class CyberNode {
    constructor(w, h) {
      this.init(w, h);
    }

    init(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2.2 + 1.2;
      this.baseAlpha = Math.random() * 0.5 + 0.3;
      this.alpha = this.baseAlpha;
      this.isThreat = Math.random() < 0.08; // 8% chance of threat indicator node
    }

    update(w, h) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw(context, centerX, centerY) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      if (this.isThreat) {
        context.fillStyle = `rgba(244, 63, 94, ${this.alpha * 1.3})`;
        context.shadowColor = '#f43f5e';
        context.shadowBlur = 8;
      } else {
        context.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
        context.shadowColor = '#00f0ff';
        context.shadowBlur = 6;
      }
      context.fill();
      context.shadowBlur = 0; // reset
    }
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (nodes.length === 0) {
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(new CyberNode(width, height));
      }
    }
  }

  function drawCenterShield(cx, cy) {
    ctx.save();
    ctx.translate(cx + mouse.currentX * 18, cy + mouse.currentY * 18);

    // 1. Outer Radar Sweep Ring
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Secondary dashed circle
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
    ctx.setLineDash([4, 8]);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Rotating Radar Scanner Sweep
    if (!prefersReducedMotion) {
      radarAngle += 0.015;
    }
    const sweepRadius = 150;
    const sweepGradient = ctx.createRadialGradient(0, 0, 10, 0, 0, sweepRadius);
    sweepGradient.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    sweepGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, sweepRadius, radarAngle, radarAngle + 0.4);
    ctx.closePath();
    ctx.fillStyle = sweepGradient;
    ctx.fill();

    // Radar beam line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(radarAngle + 0.4) * sweepRadius, Math.sin(radarAngle + 0.4) * sweepRadius);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Central Hexagonal Shield
    const shieldSize = 52;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const hx = Math.cos(angle) * shieldSize;
      const hy = Math.sin(angle) * shieldSize;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(10, 18, 40, 0.85)';
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Shield Emblem Geometry
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(16, -10);
    ctx.lineTo(16, 12);
    ctx.lineTo(0, 24);
    ctx.lineTo(-16, 12);
    ctx.lineTo(-16, -10);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Core Security Check Dot
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Corner bracket reticles
    const bSize = 175;
    const bLen = 14;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 1.5;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(-bSize, -bSize + bLen); ctx.lineTo(-bSize, -bSize); ctx.lineTo(-bSize + bLen, -bSize);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(bSize - bLen, -bSize); ctx.lineTo(bSize, -bSize); ctx.lineTo(bSize, -bSize + bLen);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(-bSize, bSize - bLen); ctx.lineTo(-bSize, bSize); ctx.lineTo(-bSize + bLen, bSize);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(bSize - bLen, bSize); ctx.lineTo(bSize, bSize); ctx.lineTo(bSize, bSize - bLen);
    ctx.stroke();

    ctx.restore();
  }

  function drawConnections() {
    const maxDistance = 110;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          if (nodes[i].isThreat || nodes[j].isThreat) {
            ctx.strokeStyle = `rgba(244, 63, 94, ${alpha * 1.5})`;
          } else {
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          }
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Smooth mouse interpolation
    mouse.currentX += (mouse.targetX - mouse.currentX) * 0.05;
    mouse.currentY += (mouse.targetY - mouse.currentY) * 0.05;

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw central shield & scanning radar
    drawCenterShield(centerX, centerY);

    // Update & draw network nodes
    for (let i = 0; i < nodes.length; i++) {
      if (!prefersReducedMotion) {
        nodes[i].update(width, height);
      }
      nodes[i].draw(ctx, centerX, centerY);
    }

    // Connect nodes
    drawConnections();

    animationFrameId = requestAnimationFrame(render);
  }

  // Mouse move handler for canvas wrapper
  const wrapper = canvas.parentElement;
  wrapper.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    // Normalized coordinates (-0.5 to 0.5) for parallax tilt
    mouse.targetX = (mouse.x / width) - 0.5;
    mouse.targetY = (mouse.y / height) - 0.5;
  });

  wrapper.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
    mouse.targetX = 0;
    mouse.targetY = 0;
  });

  // IntersectionObserver: Pause when out of view to save battery & CPU
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(canvas);

  // Resize listener
  window.addEventListener('resize', debounce(resize, 150));

  function debounce(fn, ms) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  // Initial boot
  resize();
  animationFrameId = requestAnimationFrame(render);
})();
