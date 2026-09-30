import { useEffect, useRef } from "react";
import "./BlobField.css";

/**
 * A slow liquid gradient mesh: a handful of large blurred color blobs
 * merged with an SVG "goo" filter so they melt into each other like a
 * lava lamp, instead of just fading independently. One extra blob follows
 * the cursor at a soft lag and blends into the same mix.
 *
 * No particles, no 3D — just color and light moving. Pure CSS animation
 * for the ambient blobs (cheap); only the cursor blob is updated via JS,
 * and only a transform, so there's no per-frame simulation cost.
 */
export default function BlobField() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return; // ambient blobs still drift via CSS; skip cursor-follow JS

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frameId;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = document.visibilityState === "visible";
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) loop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    function loop() {
      if (!visible) return;
      x += (targetX - x) * 0.045;
      y += (targetY - y) * 0.045;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frameId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="blob-field" aria-hidden="true">
      <svg width="0" height="0">
        <filter id="blob-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </svg>

      <div className="blob-field__canvas">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <span className="blob blob--3" />
        <span className="blob blob--4" />
        <span className="blob blob--5" />
        <span className="blob blob--cursor" ref={cursorRef} />
      </div>
    </div>
  );
}
