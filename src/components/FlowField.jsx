import { useEffect, useRef } from "react";
import "./FlowField.css";

/**
 * A living light-trail field: particles drifting through a slow, swirling
 * flow field, gently orbiting the cursor, leaving soft glowing trails
 * instead of hard shapes. Plain Canvas 2D — no 3D library, no GPU model
 * loading, small and cheap.
 *
 * Respects prefers-reduced-motion (renders a few static frames and stops)
 * and pauses while the tab isn't visible.
 */
export default function FlowField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Site palette: muted gold + dusty sapphire.
    const palette = ["201, 162, 39", "233, 199, 101", "62, 124, 166", "124, 186, 223"];

    let width, height, dpr;
    const particles = [];
    const COUNT = 130;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    function makeParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: 0.8 + Math.random() * 1.8,
        color: palette[Math.floor(Math.random() * palette.length)],
        life: Math.random() * 200,
      };
    }
    for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

    const pointer = { x: width / 2, y: height / 2, active: false };
    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    let visible = document.visibilityState === "visible";
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible && !reducedMotion) loop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let t = 0;
    let frameId;
    let staticFramesLeft = reducedMotion ? 1 : Infinity;

    function step() {
      t += 1;
      // Fade previous frame slightly instead of clearing — creates trails.
      ctx.fillStyle = "rgba(7, 10, 16, 0.16)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        // A gentle swirling flow field made of layered sine waves —
        // smooth, organic motion without a full noise library.
        const angle =
          Math.sin(p.x * 0.0022 + t * 0.0018) +
          Math.cos(p.y * 0.0022 - t * 0.0013) +
          Math.sin((p.x + p.y) * 0.0016 + t * 0.002);
        const flowVx = Math.cos(angle * Math.PI) * 0.35;
        const flowVy = Math.sin(angle * Math.PI) * 0.35;

        p.vx += flowVx * 0.05;
        p.vy += flowVy * 0.05;

        // Orbit around the cursor: a perpendicular nudge near the pointer.
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          const radius = 220;
          if (dist < radius) {
            const force = (1 - dist / radius) * 0.9;
            p.vx += (-dy / dist) * force;
            p.vy += (dx / dist) * force;
            p.vx -= (dx / dist) * force * 0.15;
            p.vy -= (dy / dist) * force * 0.15;
          }
        }

        // Damping so particles settle into smooth motion, not chaos.
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.life <= 0) Object.assign(p, makeParticle(), { life: 200 + Math.random() * 200 });

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        glow.addColorStop(0, `rgba(${p.color}, 0.55)`);
        glow.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    }

    function loop() {
      if (!visible) return;
      step();
      if (reducedMotion) {
        staticFramesLeft -= 1;
        if (staticFramesLeft <= 0) return;
      }
      frameId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas className="flow-field" ref={canvasRef} aria-hidden="true" />;
}
