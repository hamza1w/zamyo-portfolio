import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Scene3D.css";

/**
 * Real 3D objects built entirely from video-editing / filming shapes —
 * cameras, clapperboards, film reels, play buttons, mics, and lenses —
 * repeated and varied, spread across the FULL page height (measured from
 * document.scrollHeight) so new ones keep scrolling into view the whole
 * way down. Placement uses simple rejection sampling so instances don't
 * clip through each other. Distance fog fades the further-back, smaller
 * objects toward near-black for a depth cue — a true post-process blur
 * (BokehPass) was tried here but it forces the canvas fully opaque and
 * wipes out the transparent background behind it, so fog is the fix that
 * keeps transparency intact while still reading as "further = less
 * distinct."
 *
 * All one steel-blue tone, with a procedural brushed-metal bump texture
 * plus purpose-made canvas textures (clapperboard stripes, mic grille)
 * for recognizable surface detail — no external image assets.
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
  return new THREE.CanvasTexture(canvas);
}

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

  // Hot-shoe mount on top — a small raised block, the detail that reads
  // unmistakably as "camera" from above.
  const hotshoe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.3), accentMaterial);
  hotshoe.position.set(0.5, 0.58, 0);
  g.add(hotshoe);

  // Shutter button — a small raised cylinder near the grip.
  const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 14), accentMaterial);
  shutter.position.set(-0.5, 0.56, -0.3);
  g.add(shutter);

  // LCD screen on the back face — a flat dark panel, distinct from the body.
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.55, 0.75), accentMaterial);
  screen.position.set(-0.86, 0, 0);
  g.add(screen);

  // Strap lugs on either side.
  [-1, 1].forEach((side) => {
    const lug = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 16), accentMaterial);
    lug.rotation.y = Math.PI / 2;
    lug.position.set(0.78, 0.3, side * 0.5);
    g.add(lug);
  });

  return g;
}

// Fixed properly this time: the previous version still had the body and
// the fixed strip touching at their shared edge, and the tilted arm's
// rotated bounding box still reached down far enough to clip the fixed
// strip — a rotated box's footprint is bigger than its own height. These
// three pieces now have real, checked gaps between them (verified against
// the arm's actual rotated extent, not just its unrotated size), plus a
// generous z offset on the arm as a second line of defense.
function makeClapper(material, clapperTex) {
  const clapperMat = new THREE.MeshStandardMaterial({ map: clapperTex, metalness: 0.2, roughness: 0.55 });
  const g = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.8, 0.18), material);
  body.position.set(0, -0.4, 0);
  g.add(body); // top edge at y = 0.0

  const fixedStrip = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.22, 0.18), clapperMat);
  fixedStrip.position.set(0, 0.21, 0);
  g.add(fixedStrip); // spans y = 0.10 to 0.32 — clear 0.10 gap under the body

  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.22, 0.18), clapperMat);
  arm.position.set(-0.75, 0.85, 0.15);
  arm.rotation.z = 0.3;
  g.add(arm); // rotated extent bottoms out around y ≈ 0.49 — clear 0.17 gap above the strip

  return g;
}

// Fixed: three thin rods crossing a ring is exactly a steering wheel.
// Real film reels are a flat plate with a raised rim and a center hub —
// no spokes crossing the diameter. Sprocket holes near the rim are what
// actually reads as "film reel".
function makeReel(material, accentMaterial) {
  const g = new THREE.Group();

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.1, 48), material);
  plate.rotation.x = Math.PI / 2;
  g.add(plate);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.07, 12, 48), accentMaterial);
  g.add(rim);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 24), accentMaterial);
  hub.rotation.x = Math.PI / 2;
  g.add(hub);

  const holeCount = 12;
  for (let i = 0; i < holeCount; i++) {
    const angle = (i / holeCount) * Math.PI * 2;
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 10), accentMaterial);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(Math.cos(angle) * 0.78, Math.sin(angle) * 0.78, 0);
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
  tri.position.set(-0.12, 0, 0.2);
  g.add(tri);
  return g;
}

// Fixed: a plain capsule read as a generic pill, not a mic. Real mics
// have a distinct bulbous grille head sitting on top of a narrower
// straight body — that silhouette, plus the grille texture confined to
// just the head, is what actually reads as "microphone".
function makeMic(material, grilleTex) {
  const grilleMat = new THREE.MeshStandardMaterial({ map: grilleTex, metalness: 0.6, roughness: 0.5 });
  const g = new THREE.Group();

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 20), grilleMat);
  head.scale.set(1, 1.3, 1);
  head.position.set(0, 0.55, 0);
  g.add(head);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 10, 24), material);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.18, 0);
  g.add(collar);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.85, 20), material);
  body.position.set(0, -0.3, 0);
  g.add(body);

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.95, 14), material);
  stand.position.set(0, -1.2, 0);
  g.add(stand);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 20), material);
  base.position.set(0, -1.7, 0);
  g.add(base);

  return g;
}

// This only reads as "lens" if it's unmistakably a barrel from the side
// too, not just face-on — a longer barrel with a raised ridged grip band
// (the focus ring every real lens has) sells that from any rotation.
function makeLens(material, glassMaterial, accentMaterial) {
  const g = new THREE.Group();

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.78, 1.3, 32), material);
  barrel.rotation.x = Math.PI / 2;
  g.add(barrel);

  // Ridged focus-ring grip band — several thin raised rings close together.
  for (let i = 0; i < 5; i++) {
    const grip = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.02, 8, 28), accentMaterial);
    grip.position.set(0, 0, -0.15 + i * 0.07);
    g.add(grip);
  }

  const frontRim = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.68, 0.15, 32), accentMaterial);
  frontRim.rotation.x = Math.PI / 2;
  frontRim.position.set(0, 0, 0.68);
  g.add(frontRim);

  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.08, 32), glassMaterial);
  glass.rotation.x = Math.PI / 2;
  glass.position.set(0, 0, 0.77);
  g.add(glass);

  [0.3, 0.42].forEach((r) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 8, 32), accentMaterial);
    ring.position.set(0, 0, 0.78);
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
    // Fades far objects toward the page's own near-black as a depth cue —
    // works with a transparent canvas, unlike a post-process blur pass.
    scene.fog = new THREE.Fog(0x070a10, 9, 24);
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

    const scrollMultiplier = 0.0028;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const travelRange = maxScroll * scrollMultiplier;

    const INSTANCE_COUNT = 18;
    const minZ = -9;
    const maxZ = 7;
    const objects = [];
    const placed = []; // for rejection-sampling spacing
    const group = new THREE.Group();

    // Sampled scroll fractions (0 = top of page, 1 = fully scrolled) used
    // to check spacing. Each object's actual y at scroll s is
    // baseY + s*scrollMultiplier*depthFactor, and objects at different
    // depths move at different rates — so two instances spaced apart at
    // scroll=0 can still drift into each other later. Checking only the
    // start position (the old bug) missed that entirely. Since the drift
    // is linear in scroll position, sampling across the full range catches
    // the convergence wherever it happens, not just at the two ends.
    const SCROLL_SAMPLES = [0, 0.25, 0.5, 0.75, 1];

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const build = shapeTypes[i % shapeTypes.length];
      const mesh = build();

      const z = minZ + Math.random() * (maxZ - minZ);
      const closeness = (z - minZ) / (maxZ - minZ); // 0 = far, 1 = close
      const baseScale = (0.7 + closeness * 1.5) * 1.3;
      const depthFactor = 0.3 + closeness * 0.9;

      // Reject-sample a position that doesn't overlap existing objects at
      // ANY point in the scroll journey — scaled by the size of both
      // objects involved, since two large close-up shapes need more room
      // than two small distant ones.
      let x, spreadY;
      let attempt = 0;
      let bestCandidate = null;
      let bestScore = -Infinity;
      do {
        x = (Math.random() - 0.5) * 15;
        spreadY = 4 - (i / INSTANCE_COUNT) * (travelRange + 10) + (Math.random() - 0.5) * 4;
        let minDist = Infinity;
        for (const p of placed) {
          const requiredGap = (baseScale + p.scale) * 1.1;
          for (const t of SCROLL_SAMPLES) {
            const s = t * maxScroll;
            const yNew = spreadY + s * scrollMultiplier * depthFactor;
            const yExisting = p.y + s * scrollMultiplier * p.depthFactor;
            const d = Math.hypot(x - p.x, yNew - yExisting, (z - p.z) * 0.6) - requiredGap;
            if (d < minDist) minDist = d;
          }
        }
        if (placed.length === 0 || minDist > bestScore) {
          bestScore = placed.length === 0 ? 0 : minDist;
          bestCandidate = { x, spreadY };
        }
        attempt++;
      } while (bestScore < 0 && attempt < 40);
      x = bestCandidate.x;
      spreadY = bestCandidate.spreadY;

      mesh.position.set(x, spreadY, z);
      mesh.scale.setScalar(baseScale);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      placed.push({ x, y: spreadY, z, scale: baseScale, depthFactor });
      objects.push({
        mesh,
        baseY: spreadY,
        // Slower, gentler spin than before.
        spin: (Math.random() - 0.5) * 0.0022 + 0.0009,
        depthFactor,
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
