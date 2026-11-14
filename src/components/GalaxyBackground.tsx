/* ═══════════════════════════════════════════════════════
   CS-Planly — Global Interactive Galaxy Background
   • Authentic Framer Milky Way galaxy image base
   • Astra-6 style pointer interactivity (3D parallax, star displacement, cursor glow, stardust trail)
   • Cinematic hover-in reveal on page open
   • Global fixed background behind all pages
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;            // 0 (far) to 1 (near)
  baseSize: number;
  size: number;
  baseBrightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  glowColor: string;
  vx: number;
  vy: number;
  originX: number;
  originY: number;
}

interface StardustSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

const STAR_COUNT = 380;
const PARALLAX_IMG_STRENGTH = 20;     // px shift for galaxy image
const PARALLAX_STAR_STRENGTH = 35;    // px shift for nearest stars
const POINTER_INFLUENCE_RADIUS = 140; // px radius for pointer repulsion

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(true);

  // Smooth pointer tracking (normalized -1 to 1)
  const pointer = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    screenX: -1000,
    screenY: -1000,
    targetScreenX: -1000,
    targetScreenY: -1000,
    vx: 0,
    vy: 0,
    isHovering: false,
  });

  const starsRef = useRef<Star[]>([]);
  const stardustRef = useRef<StardustSpark[]>([]);
  const animationFrameId = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Initialize stars once
  useEffect(() => {
    const stars: Star[] = [];
    const colors = [
      { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' },
      { fill: '#dbeafe', glow: 'rgba(147, 197, 253, 0.4)' },
      { fill: '#fef08a', glow: 'rgba(254, 240, 138, 0.35)' },
      { fill: '#e0e7ff', glow: 'rgba(199, 210, 254, 0.35)' },
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random();
      const colorScheme = colors[Math.floor(Math.random() * colors.length)];
      const baseSize = 0.5 + z * 1.6 + (Math.random() > 0.95 ? 1.2 : 0);
      const x = Math.random();
      const y = Math.random();

      stars.push({
        x,
        y,
        originX: x,
        originY: y,
        z,
        baseSize,
        size: baseSize,
        baseBrightness: 0.3 + z * 0.65,
        twinkleSpeed: 0.002 + Math.random() * 0.007,
        twinklePhase: Math.random() * Math.PI * 2,
        color: colorScheme.fill,
        glowColor: colorScheme.glow,
        vx: 0,
        vy: 0,
      });
    }
    starsRef.current = stars;
    setIsLoaded(true);
  }, []);

  // Global pointer move listener
  useEffect(() => {
    let lastEventX = 0;
    let lastEventY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Normalized coordinates (-1 to 1)
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;

      pointer.current.targetX = nx;
      pointer.current.targetY = ny;
      pointer.current.targetScreenX = e.clientX;
      pointer.current.targetScreenY = e.clientY;
      pointer.current.isHovering = true;

      // Calculate pointer speed for stardust spawn
      const dx = e.clientX - lastEventX;
      const dy = e.clientY - lastEventY;
      const dist = Math.hypot(dx, dy);

      if (dist > 6 && stardustRef.current.length < 80) {
        // Spawn subtle stardust trail
        const count = Math.min(3, Math.floor(dist / 12));
        for (let k = 0; k < count; k++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5;
          stardustRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 16,
            y: e.clientY + (Math.random() - 0.5) * 16,
            vx: Math.cos(angle) * speed - dx * 0.05,
            vy: Math.sin(angle) * speed - dy * 0.05,
            size: Math.random() * 1.6 + 0.6,
            alpha: 0.8,
            color: Math.random() > 0.5 ? '#93c5fd' : '#fef08a',
            life: 0,
            maxLife: 25 + Math.random() * 25,
          });
        }
      }

      lastEventX = e.clientX;
      lastEventY = e.clientY;
    };

    const onPointerLeave = () => {
      pointer.current.targetX = 0;
      pointer.current.targetY = 0;
      pointer.current.isHovering = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      lastTimeRef.current = time;

      // Smooth pointer lerp (inertia / spring feel)
      const p = pointer.current;
      p.currentX += (p.targetX - p.currentX) * 0.045;
      p.currentY += (p.targetY - p.currentY) * 0.045;
      p.screenX += (p.targetScreenX - p.screenX) * 0.08;
      p.screenY += (p.targetScreenY - p.screenY) * 0.08;

      // Update galaxy image parallax & 3D tilt
      if (imageRef.current) {
        const imgTiltX = -p.currentY * 2.5; // degrees
        const imgTiltY = p.currentX * 2.5;  // degrees
        const imgShiftX = -p.currentX * PARALLAX_IMG_STRENGTH;
        const imgShiftY = -p.currentY * PARALLAX_IMG_STRENGTH;

        imageRef.current.style.transform = `perspective(1000px) rotateX(${imgTiltX}deg) rotateY(${imgTiltY}deg) translate3d(${imgShiftX}px, ${imgShiftY}px, 0) scale(1.06)`;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw pointer celestial glow aura
      if (p.isHovering && p.screenX > 0 && p.screenY > 0) {
        const auraGradient = ctx.createRadialGradient(
          p.screenX,
          p.screenY,
          0,
          p.screenX,
          p.screenY,
          260
        );
        auraGradient.addColorStop(0, 'rgba(100, 160, 255, 0.09)');
        auraGradient.addColorStop(0.35, 'rgba(180, 140, 255, 0.04)');
        auraGradient.addColorStop(0.7, 'rgba(255, 200, 120, 0.015)');
        auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, 260, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render stars with 3D parallax & pointer interaction
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Parallax offset proportional to depth z
        const parallaxX = -p.currentX * PARALLAX_STAR_STRENGTH * star.z;
        const parallaxY = -p.currentY * PARALLAX_STAR_STRENGTH * star.z;

        // Base screen position
        let sx = star.originX * width + parallaxX;
        let sy = star.originY * height + parallaxY;

        // Pointer repulsion / magnetic displacement (Astra-6 feel)
        if (p.isHovering) {
          const dx = sx - p.screenX;
          const dy = sy - p.screenY;
          const dist = Math.hypot(dx, dy);

          if (dist < POINTER_INFLUENCE_RADIUS && dist > 1) {
            const force = (1 - dist / POINTER_INFLUENCE_RADIUS) * 18 * star.z;
            const angle = Math.atan2(dy, dx);
            star.vx += Math.cos(angle) * force * 0.15;
            star.vy += Math.sin(angle) * force * 0.15;
          }
        }

        // Apply velocities with damping (spring return)
        star.vx *= 0.88;
        star.vy *= 0.88;
        sx += star.vx;
        sy += star.vy;

        // Skip offscreen
        if (sx < -10 || sx > width + 10 || sy < -10 || sy > height + 10) continue;

        // Twinkle calculation
        const twinkle =
          star.baseBrightness *
          (0.7 + 0.3 * Math.sin(time * star.twinkleSpeed + star.twinklePhase));

        // Draw star core
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, twinkle));
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw soft glow for bright or large stars
        if (star.size > 1.4 && twinkle > 0.6) {
          ctx.fillStyle = star.glowColor;
          ctx.globalAlpha = twinkle * 0.35;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Render stardust sparks from cursor trail
      const stardust = stardustRef.current;
      for (let i = stardust.length - 1; i >= 0; i--) {
        const spark = stardust[i];
        spark.life++;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.94;
        spark.vy *= 0.94;

        const progress = spark.life / spark.maxLife;
        const alpha = (1 - progress) * 0.7;

        if (progress >= 1) {
          stardust.splice(i, 1);
          continue;
        }

        ctx.fillStyle = spark.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      className={`galaxy-viewport ${isLoaded ? 'galaxy-hover-in' : ''}`}
      aria-hidden="true"
    >
      {/* Base Layer: Authentic Framer Milky Way Galaxy Backdrop */}
      <div
        ref={imageRef}
        className="galaxy-image-layer"
        style={{
          backgroundImage: 'url(/galaxy-bg.png)',
        }}
      />

      {/* Atmospheric depth & dark cosmic vignette layers */}
      <div className="galaxy-depth-vignette" />

      {/* Vibrant cosmic nebula radiance */}
      <div className="galaxy-nebula-glow" />

      {/* Interactive Astra-6 Starfield & Cursor Glow Canvas */}
      <canvas
        ref={canvasRef}
        className="galaxy-canvas-layer"
      />
    </div>
  );
}
