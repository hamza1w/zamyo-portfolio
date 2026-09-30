import { useEffect, useRef } from "react";
import "./DepthIcons.css";

/**
 * A restrained field of 3D line-art icons — camera, clapperboard, film
 * reel, play button, microphone, lens, waveform — floating at different
 * depths using real CSS perspective. The whole scene tilts gently toward
 * the cursor; icons further back move less and blur slightly (depth of
 * field), icons closer move more and stay sharp. Each icon also has its
 * own slow, independent float/rotate so the scene feels alive even with
 * the cursor still.
 *
 * No canvas, no WebGL, no per-frame simulation — just CSS 3D transforms
 * updated on pointer move.
 */

const icons = [
  {
    id: "camera",
    x: "14%", y: "22%", z: -60, size: 64, tone: "gold", dur: "16s", delay: "0s",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="14" width="28" height="20" rx="3" />
        <path d="M32 20l10-6v20l-10-6z" />
        <circle cx="16" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: "clapper",
    x: "78%", y: "16%", z: 40, size: 74, tone: "blue", dur: "19s", delay: "0.4s",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="6" y="18" width="36" height="24" rx="2" />
        <path d="M6 18l4-9 8 4-4 5z" />
        <path d="M18 18l4-9 8 4-4 5z" />
        <path d="M30 18l4-9 8 4-4 5z" />
      </svg>
    ),
  },
  {
    id: "reel",
    x: "8%", y: "68%", z: -130, size: 56, tone: "blue", dur: "24s", delay: "0.8s",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="12" r="4" />
        <circle cx="14" cy="30" r="4" />
        <circle cx="34" cy="30" r="4" />
        <circle cx="24" cy="24" r="3" />
      </svg>
    ),
  },
  {
    id: "play",
    x: "50%", y: "12%", z: -180, size: 46, tone: "gold", dur: "14s", delay: "1.1s",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="24" cy="24" r="18" />
        <path d="M20 16l12 8-12 8z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "mic",
    x: "85%", y: "62%", z: 90, size: 60, tone: "gold", dur: "18s", delay: "0.6s",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="18" y="6" width="12" height="22" rx="6" />
        <path d="M12 22a12 12 0 0 0 24 0" />
        <path d="M24 34v8" />
        <path d="M17 42h14" />
      </svg>
    ),
  },
  {
    id: "lens",
    x: "34%", y: "80%", z: -90, size: 52, tone: "blue", dur: "21s", delay: "1.4s",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="24" cy="24" r="17" />
        <circle cx="24" cy="24" r="9" />
        <path d="M24 7v6M24 35v6M7 24h6M35 24h6M12 12l4.2 4.2M31.8 31.8l4.2 4.2M12 36l4.2-4.2M31.8 16.2l4.2-4.2" />
      </svg>
    ),
  },
  {
    id: "waveform",
    x: "62%", y: "40%", z: 20, size: 58, tone: "blue", dur: "13s", delay: "0.2s",
    svg: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M6 24v0M13 18v12M20 10v28M27 16v16M34 22v4M41 12v24" />
      </svg>
    ),
  },
];

export default function DepthIcons() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return; // icons still float gently via CSS; skip tilt-on-cursor

    let targetX = 0;
    let targetY = 0;
    let rx = 0;
    let ry = 0;
    let frameId;

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
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
      rx += (-targetY * 8 - rx) * 0.045;
      ry += (targetX * 10 - ry) * 0.045;
      stage.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
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
    <div className="depth-icons" aria-hidden="true">
      <div className="depth-icons__stage" ref={stageRef}>
        {icons.map((icon) => (
          <div
            key={icon.id}
            className={`depth-icons__item depth-icons__item--${icon.tone}`}
            style={{
              left: icon.x,
              top: icon.y,
              "--z": `${icon.z}px`,
              "--size": `${icon.size}px`,
              "--dur": icon.dur,
              "--delay": icon.delay,
              filter: icon.z < -100 ? "blur(2px)" : icon.z < -30 ? "blur(0.5px)" : "none",
              opacity: icon.z < -100 ? 0.35 : icon.z < -30 ? 0.5 : 0.65,
            }}
          >
            {icon.svg}
          </div>
        ))}
      </div>
    </div>
  );
}
