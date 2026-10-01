import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Scene3D.css";

/**
 * Real 3D objects built entirely from video-editing / filming shapes —
 * cameras, clapperboards, film reels, play buttons, mics, lenses, and
 * waveforms — repeated and varied, spread across the FULL page height
 * (measured from document.scrollHeight) so new ones keep scrolling into
 * view the whole way down instead of a small cluster emptying out after
 * one screen's worth of scrolling.
 *
 * All one steel-blue tone, with a procedural brushed-metal bump texture
 * plus a couple of purpose-made canvas textures (clapperboard stripes,
 * mic grille) for recognizable surface detail — no external image assets.
 */

const GOLD_LIGHT = 0xc9a227;
const SAPPHIRE_LIGHT = 0x7cbadf;
const OBJECT_TONE = 0x3e6e86;

function makeNoiseTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = 120 + Math.random() * 135;
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 5);
  return tex;
}

// Classic diagonal clapperboard stripes — this is the detail that makes a
// plain box actually read as a clapperboard.
function makeClapperTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e9e9e9";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#14161a";
  const stripeWidth = 32;
  for (let x = -size; x < size * 2; x += stripeWidth * 2) {
    ctx.save();
    ctx.translate(x, 0);
    ctx.transform(1, 0, -0.6, 1, 0, 0);
    ctx.fillRect(0, 0, stripeWidth, size);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// A grid of small dark dots — reads as a mic grille at a glance.
function makeGrilleTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#333d47";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#11161b";
  const step = 14;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      ctx.beginPath();
      ctx.arc(x + (y % (step * 2) === 0 ? step / 2 : 0), y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

function makeCamera(material, accentMaterial) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.05, 1.05), material));
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.46, 0.7, 28), material);
  lens.rotation.z = Math.PI / 2;
  lens.position.set(1.15, 0, 0);
  g.add(lens);
  const lensRim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.045, 12, 28), accentMaterial);
  lensRim.rotation.y = Math.PI / 2;
  lensRim.position.set(1.47, 0, 0);
  g.add(lensRim);
  const viewfinder = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), material);
  viewfinder.position.set(-0.2, 0.68, 0);
  g.add(viewfinder);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.55, 0.35), material);
  grip.position.set(-0.55, -0.7, 0);
  g.add(grip);
  for (let i = 0; i < 2; i++) {
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16), accentMaterial);
    dial.rotation.x = Math.PI / 2;
    dial.position.set(-0.35 + i * 0.35, 0.56, 0.5);
    g.add(dial);
  }
  return g;
}

function makeClapper(material, clapperTex) {
  const clapperMat = new THREE.MeshStandardMaterial({ map: clapperTex, metalness: 0.2, roughness: 0.55 });
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.1, 0.18), material));
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.32, 0.18), clapperMat);
  top.position.set(0, 0.68, 0.05);
  top.rotation.z = -0.3;
  g.add(top);
  const topBase = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.32, 0.18), clapperMat);
  topBase.position.set(0, 0.42, 0.05);
  g.add(topBase);
  return g;
}

function makeReel(material, accentMaterial) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.13, 16, 48), material));
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.22, 24), material);
  hub.rotation.x = Math.PI / 2;
  g.add(hub);
  for (let i = 0; i < 3; i++) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.7, 10), material);
    spoke.rotation.z = (i / 3) * Math.PI;
    g.add(spoke);
  }
  // Sprocket holes around the rim — the detail that reads as "film reel"
  // rather than just "ring".
  const holeCount = 10;
  for (let i = 0; i < holeCount; i++) {
    const angle = (i / holeCount) * Math.PI * 2;
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.3, 8), accentMaterial);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(Math.cos(angle) * 0.95, Math.sin(angle) * 0.95, 0);
    g.add(hole);
  }
  return g;
}

function makePlay(material, accentMaterial) {
  const g = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.16, 40), material);
  disc.rotation.x = Math.PI / 2;
  g.add(disc);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.04, 10, 40), accentMaterial);
  g.add(rim);
  const triShape = new THREE.Shape();
  triShape.moveTo(-0.28, -0.38);
  triShape.lineTo(-0.28, 0.38);
  triShape.lineTo(0.38, 0);
  triShape.lineTo(-0.28, -0.38);
  const tri = new THREE.Mesh(new THREE.ExtrudeGeometry(triShape, { depth: 0.22, bevelEnabled: false }), accentMaterial);
  tri.position.set(-0.12, 0, 0.12);
  g.add(tri);
  return g;
}

function makeMic(material, grilleTex) {
  const grilleMat = new THREE.MeshStandardMaterial({ map: grilleTex, metalness: 0.6, roughness: 0.5 });
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.6, 8, 18), grilleMat));
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.05, 14), material);
  stand.position.set(0, -0.95, 0);
  g.add(stand);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 20), material);
  base.position.set(0, -1.5, 0);
  g.add(base);
  return g;
}

function makeLens(material, glassMaterial, accentMaterial) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.2, 18, 40), material));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.56, 28, 28), glassMaterial));
  // Concentric aperture rings — the detail that reads as a lens barrel.
  [0.85, 0.98].forEach((r) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 8, 36), accentMaterial);
    g.add(ring);
  });
  return g;
}

function makeWaveform(material) {
  const g = new THREE.Group();
  const heights = [0.6, 1.3, 0.4, 1.7, 0.9, 0.35, 1.15];
  heights.forEach((h, i) => {
    const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, h, 4, 8), material);
    bar.position.x = (i - heights.length / 2) * 0.32;
    g.add(bar);
  });
  return g;
}

export default function Scene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 13);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x30373f, 1.1));
    const key = new THREE.PointLight(GOLD_LIGHT, 20, 45);
    key.position.set(-7, 5, 9);
    scene.add(key);
    const rim = new THREE.PointLight(SAPPHIRE_LIGHT, 22, 45);
    rim.position.set(7, -4, 8);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 6, 45);
    fill.position.set(0, 0, 12);
    scene.add(fill);

    const bumpTex = makeNoiseTexture();
    const material = new THREE.MeshStandardMaterial({
      color: OBJECT_TONE,
      metalness: 0.8,
      roughness: 0.38,
      bumpMap: bumpTex,
      bumpScale: 0.03,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b222c,
      metalness: 0.9,
      roughness: 0.22,
      bumpMap: bumpTex,
      bumpScale: 0.02,
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d1016,
      metalness: 0.15,
      roughness: 0.06,
      emissive: SAPPHIRE_LIGHT,
      emissiveIntensity: 0.18,
    });
    const clapperTex = makeClapperTexture();
    const grilleTex = makeGrilleTexture();

    const shapeTypes = [
      () => makeCamera(material, accentMaterial),
      () => makeClapper(material, clapperTex),
      () => makeReel(material, accentMaterial),
      () => makePlay(material, accentMaterial),
      () => makeMic(material, grilleTex),
      () => makeLens(material, glassMaterial, accentMaterial),
      () => makeWaveform(material),
    ];

    // ---- Spread objects across the FULL page height, not just one
    // screen's worth, so the background stays populated the whole way
    // down instead of emptying out after a bit of scrolling. ----
    const scrollMultiplier = 0.0028;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const travelRange = maxScroll * scrollMultiplier; // world units the view will drift by full page scroll

    const INSTANCE_COUNT = 18;
    const minZ = -9;
    const maxZ = 7;
    const objects = [];
    const group = new THREE.Group();

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const build = shapeTypes[i % shapeTypes.length];
      const mesh = build();

      const z = minZ + Math.random() * (maxZ - minZ);
      const closeness = (z - minZ) / (maxZ - minZ); // 0 = far, 1 = close
      const baseScale = 0.7 + closeness * 1.5;

      // Spread from just above the first screen down past the full scroll
      // range, with jitter so instances of the same type don't line up.
      const spreadY = 4 - (i / INSTANCE_COUNT) * (travelRange + 10) + (Math.random() - 0.5) * 3;

      mesh.position.set((Math.random() - 0.5) * 13, spreadY, z);
      mesh.scale.setScalar(baseScale * 1.3);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      objects.push({
        mesh,
        baseY: spreadY,
        spin: (Math.random() - 0.5) * 0.006 + 0.002,
        depthFactor: 0.3 + closeness * 0.9,
      });
      group.add(mesh);
    }
    scene.add(group);

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
      targetRotation.y = pointer.x * 0.3;
      targetRotation.x = pointer.y * 0.18;
      group.rotation.y += (targetRotation.y - group.rotation.y) * 0.04;
      group.rotation.x += (targetRotation.x - group.rotation.x) * 0.04;

      objects.forEach(({ mesh, baseY, spin, depthFactor }) => {
        mesh.rotation.y += spin;
        mesh.rotation.x += spin * 0.6;
        mesh.position.y = baseY + scrollY * scrollMultiplier * depthFactor;
      });

      renderer.render(scene, camera);
    }

    function loop() {
      if (!visible) return;
      render();
      frameId = requestAnimationFrame(loop);
    }

    if (reducedMotion) {
      render();
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      objects.forEach(({ mesh }) => {
        mesh.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
        });
      });
      material.dispose();
      accentMaterial.dispose();
      glassMaterial.dispose();
      bumpTex.dispose();
      clapperTex.dispose();
      grilleTex.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="scene3d" ref={mountRef} aria-hidden="true" />;
}
