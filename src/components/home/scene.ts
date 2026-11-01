import * as THREE from "three";

/**
 * The home's 3D scene: a black wall with a real surface, lit by one moving
 * light, with the brand mark hanging in front of it and casting a shadow.
 * Loaded on demand after first paint so the text never waits for it.
 */

export interface SceneState {
  /** A drawer is open: the mark moves aside and opens up behind it. */
  open: boolean;
  /** Width of the open drawer, so the mark can centre in the space left. */
  drawerWidth: number;
}

const PHONE_WIDTH = 820;
/** Touch screens have no cursor to follow, so the mark performs on its own. */
const FOLD_EVERY = 9;
const FOLD_LENGTH = 3.2;

const easeInOut = (q: number) => (q < 0.5 ? 4 * q * q * q : 1 - (-2 * q + 2) ** 3 / 2);

function buildSurface(size: number) {
  const n = size * size;
  const height = new Float32Array(n);
  const blur = (src: Float32Array, r: number) => {
    const a = new Float32Array(n);
    const out = new Float32Array(n);
    const w = 2 * r + 1;
    for (let y = 0; y < size; y++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) sum += src[y * size + ((k + size) % size)];
      for (let x = 0; x < size; x++) {
        a[y * size + x] = sum / w;
        sum += src[y * size + ((x + r + 1) % size)] - src[y * size + ((x - r + size) % size)];
      }
    }
    for (let x = 0; x < size; x++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) sum += a[((k + size) % size) * size + x];
      for (let y = 0; y < size; y++) {
        out[y * size + x] = sum / w;
        sum += a[((y + r + 1) % size) * size + x] - a[((y - r + size) % size) * size + x];
      }
    }
    return out;
  };
  for (const [r, gain] of [[1, 1.3], [2, 2], [5, 3], [18, 7]]) {
    const raw = new Float32Array(n);
    for (let i = 0; i < n; i++) raw[i] = Math.random() - 0.5;
    const b = blur(raw, r);
    for (let i = 0; i < n; i++) height[i] += b[i] * gain;
  }
  const make = () => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    return c;
  };
  const normal = make();
  const rough = make();
  const nCtx = normal.getContext("2d")!;
  const rCtx = rough.getContext("2d")!;
  const nImg = nCtx.createImageData(size, size);
  const rImg = rCtx.createImageData(size, size);
  const strength = 3.4;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const dx = (height[y * size + (x + 1) % size] - height[y * size + (x - 1 + size) % size]) * strength;
      const dy = (height[((y + 1) % size) * size + x] - height[((y - 1 + size) % size) * size + x]) * strength;
      const len = Math.hypot(dx, dy, 1);
      nImg.data.set([(-dx / len + 1) * 127.5, (-dy / len + 1) * 127.5, (1 / len + 1) * 127.5, 255], i * 4);
      const v = Math.max(175, Math.min(255, 218 + height[i] * 220));
      rImg.data.set([v, v, v, 255], i * 4);
    }
  }
  nCtx.putImageData(nImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);
  return { normal, rough };
}

/** Starts the scene. Returns a stop function, or null when WebGL is unavailable. */
export function startScene(
  canvas: HTMLCanvasElement,
  state: SceneState,
  onFirstFrame: () => void,
): (() => void) | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = innerWidth < 820;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const world = new THREE.Scene();
  world.background = new THREE.Color(0x050607);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.z = 12;

  // Studio reflections for the logo: a dark room with long light strips.
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x020203);
  const strip = (w: number, h: number, x: number, y: number, z: number, power: number, tint: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(power), side: THREE.DoubleSide }),
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  strip(9, 2, -4, 7, 6, 9, 0xffffff);
  strip(2, 9, 8, 1, 5, 5, 0xc9ceff);
  strip(10, 1.2, 0, -7, 5, 2.5, 0x8a7cff);
  const pmrem = new THREE.PMREMGenerator(renderer);
  world.environment = pmrem.fromScene(room, 0.035).texture;
  pmrem.dispose();

  // Wall
  const surface = buildSurface(512);
  const tex = (c: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(14, 14);
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  };
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({
      color: 0x24262c,
      normalMap: tex(surface.normal),
      normalScale: new THREE.Vector2(0.6, 0.6),
      roughnessMap: tex(surface.rough),
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0.08,
    }),
  );
  wall.receiveShadow = true;
  world.add(wall);

  // Light
  const light = new THREE.SpotLight(0xffffff, small ? 110 : 150, 0, 0.85, 1, 1.9);
  light.position.set(2, 2.5, 7);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  light.shadow.radius = 7;
  light.shadow.bias = -0.0006;
  light.shadow.normalBias = 0.02;
  world.add(light, light.target);

  // Logo: the four facets from the brand mark, one mesh each so they can open.
  const facets = [
    { pts: [[26, 30], [56, 30], [42, 54], [12, 54]], color: 0x4450f0, metal: 0.35, rough: 0.46 },
    { pts: [[56, 30], [86, 30], [72, 54], [42, 54]], color: 0xaeb4c2, metal: 0.85, rough: 0.4 },
    { pts: [[42, 54], [72, 54], [58, 78], [28, 78]], color: 0xe6e9ef, metal: 0.1, rough: 0.5 },
    { pts: [[58, 78], [72, 54], [86, 54], [72, 78]], color: 0x7d5cf5, metal: 0.35, rough: 0.46 },
  ];
  const MARK_CENTER = [49, 54];
  const logo = new THREE.Group();
  const meshes = facets.map((f, i) => {
    const cx = f.pts.reduce((s, p) => s + p[0], 0) / 4;
    const cy = f.pts.reduce((s, p) => s + p[1], 0) / 4;
    const shape = new THREE.Shape(f.pts.map((p) => new THREE.Vector2(p[0] - cx, cy - p[1])));
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 6,
      bevelEnabled: true,
      bevelThickness: 0.7,
      bevelSize: 0.7,
      bevelOffset: -1.3,
      bevelSegments: 5,
      curveSegments: 1,
    });
    geo.translate(0, 0, -3);
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: f.color, metalness: f.metal, roughness: f.rough, envMapIntensity: 1.25 }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const home = new THREE.Vector2(cx - MARK_CENTER[0], MARK_CENTER[1] - cy);
    logo.add(mesh);
    return { mesh, home, dir: home.clone().normalize(), spin: i % 2 ? 1 : -1, lift: i - 1.5 };
  });
  world.add(logo);

  const pointer = { x: 0, y: 0, active: false };
  let explode = reduced ? 0 : 1.9;
  let last = performance.now();
  const start = last;
  let visW = 1;
  let visH = 1;

  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    visH = 2 * (camera.position.z - 1.2) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    visW = visH * camera.aspect;
  }
  function target() {
    // On phones the drawer covers everything, so the scene behind it stays put.
    if (innerWidth <= PHONE_WIDTH) {
      return { x: 0, y: (0.5 - 0.18) * visH, s: Math.min(visW * 0.62, visH * 0.3) / 74, explode: 0 };
    }
    const open = state.open;
    const free = 1 - state.drawerWidth / innerWidth;
    const fx = open ? free / 2 : 0.74;
    const fy = open ? 0.46 : 0.32;
    const logoW = open ? Math.min(visW * free * 0.62, visH * 0.66) : Math.min(visW * 0.34, visH * 0.55);
    return { x: (fx - 0.5) * visW, y: (0.5 - fy) * visH, s: logoW / 74, explode: open ? 0.2 : 0 };
  }
  resize();
  const place = target();

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = (e.clientY / innerHeight) * 2 - 1;
    pointer.active = true;
  };
  // A tap on the bare wall makes the mark fold right away.
  const onTap = (e: PointerEvent) => {
    if (e.pointerType === "mouse" || state.open) return;
    if ((e.target as Element | null)?.closest?.("a, button, input, textarea, dialog")) return;
    wantFold = true;
  };
  addEventListener("resize", resize);
  addEventListener("pointermove", onPointer, { passive: true });
  addEventListener("pointerdown", onTap, { passive: true });

  const touch = matchMedia("(hover: none)").matches;
  let wantFold = false;
  let foldStart = -1;
  let nextFold = 3;
  let baseY = 0;
  let coveredSince = -1;
  let raf = 0;
  let first = true;
  function frame(now: number) {
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    const t = (now - start) / 1000;

    // Nothing of the scene shows behind a full-screen drawer: stop drawing it.
    if (state.open && innerWidth <= PHONE_WIDTH) {
      if (coveredSince < 0) coveredSince = t;
      if (t - coveredSince > 0.9 && !reduced) {
        raf = requestAnimationFrame(frame);
        return;
      }
    } else {
      coveredSince = -1;
    }

    const auto = touch && !pointer.active && !reduced;
    const foldDone = foldStart < 0 || t - foldStart >= FOLD_LENGTH;
    if (foldDone && !state.open && (wantFold || (auto && t >= nextFold))) {
      foldStart = t;
      nextFold = t + FOLD_EVERY;
    }
    wantFold = false;
    const q = foldStart < 0 ? 1 : Math.min(1, (t - foldStart) / FOLD_LENGTH);
    const spin = q < 1 ? easeInOut(q) * Math.PI * 2 : 0;

    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);
    const tg = target();
    place.x += (tg.x - place.x) * k;
    place.y += (tg.y - place.y) * k;
    place.s += (tg.s - place.s) * k;
    explode += (tg.explode - explode) * (reduced ? 1 : 1 - Math.exp(-dt * 3.6));

    logo.position.set(place.x, place.y, 1.2);
    logo.scale.setScalar(place.s);
    const px = pointer.active ? pointer.x : auto ? Math.sin(t * 0.5) * 0.9 : Math.sin(t * 0.35) * 0.55;
    const py = pointer.active ? pointer.y : auto ? Math.cos(t * 0.37) * 0.6 : Math.cos(t * 0.27) * 0.4;
    baseY += (px * 0.42 - 0.2 - baseY) * k;
    logo.rotation.y = baseY + spin;
    logo.rotation.x += (py * 0.28 + 0.1 - logo.rotation.x) * k;

    meshes.forEach((f, i) => {
      // During a fold the facets part and come back in a wave, one after another.
      const wave = Math.min(1, Math.max(0, (q - i * 0.06) / 0.82));
      const e = explode + Math.sin(Math.PI * wave) ** 2 * 0.55;
      f.mesh.position.set(f.home.x + f.dir.x * e * 14, f.home.y + f.dir.y * e * 14, f.lift * e * 9);
      f.mesh.rotation.z = f.spin * e * 0.3;
      f.mesh.rotation.y = f.spin * e * 0.35;
    });

    light.position.x += (px * visW * 0.5 - light.position.x) * k;
    light.position.y += (-py * visH * 0.5 - light.position.y) * k;
    light.target.position.set(light.position.x * 0.25, light.position.y * 0.25, 0);

    renderer.render(world, camera);
    if (first) {
      first = false;
      onFirstFrame();
    }
    if (!reduced) raf = requestAnimationFrame(frame);
  }

  const once = () => frame(performance.now());
  // The drawer state updates just after the hash does.
  const onceSoon = () => setTimeout(once, 50);
  const onVisibility = () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  if (reduced) {
    // No motion: draw the settled scene, and again whenever the layout changes.
    once();
    addEventListener("resize", once);
    addEventListener("hashchange", onceSoon);
  } else {
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", onVisibility);
  }

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("resize", resize);
    removeEventListener("resize", once);
    removeEventListener("hashchange", onceSoon);
    removeEventListener("pointermove", onPointer);
    removeEventListener("pointerdown", onTap);
    document.removeEventListener("visibilitychange", onVisibility);
    world.environment?.dispose();
    wall.geometry.dispose();
    wall.material.normalMap?.dispose();
    wall.material.roughnessMap?.dispose();
    wall.material.dispose();
    for (const f of meshes) {
      f.mesh.geometry.dispose();
      f.mesh.material.dispose();
    }
    renderer.dispose();
  };
}
