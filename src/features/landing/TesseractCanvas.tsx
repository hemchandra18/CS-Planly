import { useEffect, useRef } from 'react';

type Point = { x: number; y: number; z: number; w: number };
const vertices: Point[] = Array.from({ length: 16 }, (_, index) => ({ x: index & 1 ? 1 : -1, y: index & 2 ? 1 : -1, z: index & 4 ? 1 : -1, w: index & 8 ? 1 : -1 }));
const edges = vertices.flatMap((_, index) => [1, 2, 4, 8].filter((bit) => (index & bit) === 0).map((bit) => [index, index | bit] as const));

function rotate(point: Point, angle: number, axisA: keyof Point, axisB: keyof Point): Point {
  const next = { ...point }; const a = point[axisA]; const b = point[axisB];
  next[axisA] = a * Math.cos(angle) - b * Math.sin(angle); next[axisB] = a * Math.sin(angle) + b * Math.cos(angle); return next;
}

export function TesseractCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null); const pointerRef = useRef({ x: 0, y: 0 }); const frameRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current; const context = canvas?.getContext('2d'); if (!canvas || !context) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; const start = performance.now();
    const resize = () => { const dpr = window.devicePixelRatio || 1; canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; context.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener('resize', resize);
    const draw = (time: number) => {
      const width = canvas.clientWidth; const height = canvas.clientHeight; context.clearRect(0, 0, width, height); const elapsed = time - start;
      const drop = reducedMotion ? 0 : Math.min(1, elapsed / 900); const bounce = reducedMotion ? 0 : Math.sin(Math.min(1, Math.max(0, (elapsed - 900) / 950)) * Math.PI) * 22; const yOffset = (1 - drop) * -Math.min(260, height * 0.35) - bounce;
      const pointer = pointerRef.current; const rotation = reducedMotion ? 0.35 : elapsed * 0.00035; const scale = Math.min(width, height) * 0.17;
      const projected = vertices.map((vertex) => { let point = rotate(vertex, rotation, 'x', 'w'); point = rotate(point, rotation * 0.75 + pointer.x * 0.45, 'y', 'z'); point = rotate(point, rotation * 0.55 + pointer.y * 0.35, 'z', 'w'); const fourD = 4.5 / (4.5 - point.w); const z = point.z * fourD; const perspective = 4 / (4 + z); return { x: width / 2 + point.x * scale * perspective, y: height * 0.36 + yOffset + point.y * scale * perspective, depth: perspective }; });
      context.save(); context.shadowBlur = 28; context.shadowColor = 'rgba(115, 150, 240, 0.35)';
      for (const [from, to] of edges) { const a = projected[from]; const b = projected[to]; const depth = (a.depth + b.depth) / 2; context.strokeStyle = `rgba(142, 172, 238, ${0.22 + depth * 0.25})`; context.lineWidth = 1.25 + depth * 0.7; context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke(); }
      for (const point of projected) { context.fillStyle = 'rgba(190, 210, 255, 0.9)'; context.beginPath(); context.arc(point.x, point.y, 2.2 * point.depth, 0, Math.PI * 2); context.fill(); }
      context.restore(); frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw); return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} aria-label="Interactive rotating tesseract" className="absolute inset-0 h-full w-full cursor-grab" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); pointerRef.current.x = (event.clientX - rect.left) / rect.width - 0.5; pointerRef.current.y = (event.clientY - rect.top) / rect.height - 0.5; }} />;
}
