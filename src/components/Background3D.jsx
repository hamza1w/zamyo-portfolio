import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Background3D.css";

/**
 * A quiet, slowly-turning field of metallic cylinders behind the site —
 * a nod to film reels / lens barrels. Tilts gently toward the cursor and
 * drifts on scroll. Sits above the flat gradient/grain background (.app-bg)
 * and below all real page content.
 *
 * Respects prefers-reduced-motion (renders one static frame, no loop) and
 * pauses the render loop while the tab isn't visible.
 */
export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL unavailable — the flat gradient background still shows.
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 11);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // ---- Lights: gold + sapphire, matching the site's palette ----
    scene.add(new THREE.AmbientLight(0x2a3038, 1.4));
    const goldLight = new THREE.PointLight(0xe9c765, 14, 30);
    goldLight.position.set(-6, 4, 6);
    scene.add(goldLight);
    const blueLight = new THREE.PointLight(0x7cbadf, 14, 30);
    blueLight.position.set(6, -3, 5);
    scene.add(blueLight);

    // ---- Cylinders: varied sizes, positions, and tilts ----
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0x1c2430,
      metalness: 0.85,
      roughness: 0.3,
    });

    const cylinders = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const radius = 0.6 + Math.random() * 1.1;
      const height = 1.6 + Math.random() * 2.4;
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false);
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 8 - 3
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      const spin = (Math.random() - 0.5) * 0.15;
      cylinders.push({ mesh, spin });
      group.add(mesh);
    }
    scene.add(group);

    // ---- Interaction state ----
    const pointer = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    let scrollY = window.scrollY;

    const onPointerMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    let frameId;
    let visible = document.visibilityState === "visible";
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible && !reducedMotion) loop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    function render() {
      targetRotation.y = pointer.x * 0.35;
      targetRotation.x = pointer.y * 0.2;
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.04;
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.04;
      group.position.y = -scrollY * 0.0025;

      cylinders.forEach(({ mesh, spin }) => {
        mesh.rotation.z += spin * 0.01;
      });

      renderer.render(scene, camera);
    }

    function loop() {
      if (!visible) return;
      render();
      frameId = requestAnimationFrame(loop);
    }

    if (reducedMotion) {
      render(); // one static frame, no animation loop
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      cylinders.forEach(({ mesh }) => mesh.geometry.dispose());
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="bg3d" ref={mountRef} aria-hidden="true" />;
}
