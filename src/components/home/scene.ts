import * as THREE from "three";
import { bakeMaps, type BakedMap, type MapJob } from "./maps";

/**
 * The home's 3D scene: a black wall with a real surface, lit by one moving
 * light, with the brand mark hanging in front of it and casting a shadow.
 * Loaded on demand after first paint so the text never waits for it.
 */

export interface SceneState {
  /** A drawer is open: the blurred scene behind it holds still. */
  open: boolean;
  /** The entrance is on screen: the scene draws one frame and waits, the logo at an angle,
   *  so the GPU is free for the cover. It settles once the wipe has passed. */
  entering: boolean;
}

const PHONE_WIDTH = 820;

// The surfaces: the wall's grit, the logo's brushed metal and its blasted ceramic.
const WALL: MapJob = { size: 512, layers: [[1, 1.3], [2, 2], [5, 3], [18, 7]], alongX: false, strength: 3.4, rough: [218, 220, 175, 255] };
const BRUSHED: MapJob = { size: 512, layers: [[90, 9], [24, 4]], alongX: true, strength: 2.2, rough: [158, 160, 138, 178] };
const BEAD: MapJob = { size: 512, layers: [[1, 1.1], [2, 1]], alongX: false, strength: 1.5, rough: [190, 260, 130, 255] };

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
  const gl = renderer;
  let stop: (() => void) | null = null;
  let cancelled = false;
  bakeMaps([WALL, BRUSHED, BEAD]).then(([wallMaps, brushedMaps, beadMaps]) => {
    if (!cancelled) stop = build(gl, state, onFirstFrame, wallMaps, brushedMaps, beadMaps);
  });
  return () => {
    cancelled = true;
    if (stop) stop();
    else gl.dispose();
  };
}

function build(
  renderer: THREE.WebGLRenderer,
  state: SceneState,
  onFirstFrame: () => void,
  wallMaps: BakedMap,
  brushedMaps: BakedMap,
  beadMaps: BakedMap,
): () => void {
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

  // Studio reflections for the logo: a dark room with soft boxes and a rim.
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x07080c);
  const strip = (w: number, h: number, x: number, y: number, z: number, power: number, tint: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(power), side: THREE.DoubleSide }),
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    room.add(m);
  };
  strip(12, 5, -3, 8, 6, 5.5, 0xffffff);
  strip(1.6, 11, 9, 1, 4, 7, 0xdfe3ff);
  strip(1, 9, -9, -1, 5, 3, 0xaab2ff);
  strip(12, 1.4, 1, -8, 5, 2.2, 0x7f78ff);
  strip(6, 6, 0, 1, 12, 0.45, 0xffffff);
  const pmrem = new THREE.PMREMGenerator(renderer);
  world.environment = pmrem.fromScene(room, 0.035).texture;
  pmrem.dispose();

  const textures: THREE.Texture[] = [];
  const dataTex = (data: Uint8Array<ArrayBuffer>, size: number) => {
    const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    t.needsUpdate = true;
    textures.push(t);
    return t;
  };

  // Wall
  const tex = (data: Uint8Array<ArrayBuffer>) => {
    const t = dataTex(data, wallMaps.size);
    t.repeat.set(14, 14);
    return t;
  };
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({
      color: 0x24262c,
      normalMap: tex(wallMaps.normal),
      normalScale: new THREE.Vector2(0.6, 0.6),
      roughnessMap: tex(wallMaps.rough),
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

  // The logo's finish: brushed anodized metal, with the grain following the mark's
  // own slanted edge, and one blasted white ceramic facet.
  // One upload per map: every facet's copy shares it, with its own scale and grain direction.
  const shared = new Map<Uint8Array<ArrayBuffer>, THREE.DataTexture>();
  const finishTex = (data: Uint8Array<ArrayBuffer>, repeat: number, rotation: number) => {
    if (!shared.has(data)) shared.set(data, dataTex(data, 512));
    const t = shared.get(data)!.clone();
    t.repeat.set(repeat, repeat);
    t.rotation = rotation;
    textures.push(t);
    return t;
  };
  const brushed = (rotation: number) => ({
    normalMap: finishTex(brushedMaps.normal, 0.09, rotation),
    normalScale: new THREE.Vector2(0.13, 0.13),
    roughnessMap: finishTex(brushedMaps.rough, 0.09, rotation),
    anisotropy: 0.75,
  });
  const bead = () => ({
    normalMap: finishTex(beadMaps.normal, 0.12, 0),
    normalScale: new THREE.Vector2(0.18, 0.18),
    roughnessMap: finishTex(beadMaps.rough, 0.12, 0),
  });
  const SLANT = 1.04;

  // Logo: the four facets from the brand mark.
  const facets = [
    { pts: [[26, 30], [56, 30], [42, 54], [12, 54]], color: 0x2430f0, metal: 1, rough: 0.72, finish: brushed(0) },
    { pts: [[56, 30], [86, 30], [72, 54], [42, 54]], color: 0x9297a6, metal: 1, rough: 0.68, finish: brushed(SLANT) },
    { pts: [[42, 54], [72, 54], [58, 78], [28, 78]], color: 0xc8cad2, metal: 0, rough: 0.74, finish: bead() },
    { pts: [[58, 78], [72, 54], [86, 54], [72, 78]], color: 0x6a35f0, metal: 1, rough: 0.72, finish: brushed(SLANT) },
  ];
  const MARK_CENTER = [49, 54];
  const logo = new THREE.Group();
  const meshes = facets.map((f) => {
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
    // ExtrudeGeometry groups: 0 is the textured face, 1 the bevel and sides, polished clean.
    const mesh = new THREE.Mesh(geo, [
      new THREE.MeshPhysicalMaterial({ color: f.color, metalness: f.metal, roughness: f.rough, envMapIntensity: 1.5, ...f.finish }),
      new THREE.MeshPhysicalMaterial({ color: f.color, metalness: f.metal, roughness: f.metal ? 0.26 : f.rough, envMapIntensity: 1.5 }),
    ]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(cx - MARK_CENTER[0], MARK_CENTER[1] - cy, 0);
    logo.add(mesh);
    return mesh;
  });
  world.add(logo);
  if (state.entering) logo.rotation.set(0.22, -0.5, 0);

  const pointer = { x: 0, y: 0, active: false };
  // Touch screens have no cursor to follow: the whole mark just sways on its axis.
  const calm = matchMedia("(hover: none)").matches || innerWidth <= PHONE_WIDTH;
  // When the entrance let go of the logo; long ago if it never held it.
  let releasedAt = state.entering ? -1 : -10;
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
    if (innerWidth <= PHONE_WIDTH) {
      return { x: 0, y: (0.5 - 0.18) * visH, s: Math.min(visW * 0.62, visH * 0.3) / 74 };
    }
    return { x: (0.74 - 0.5) * visW, y: (0.5 - 0.32) * visH, s: Math.min(visW * 0.34, visH * 0.55) / 74 };
  }
  resize();
  const place = target();

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = (e.clientY / innerHeight) * 2 - 1;
    pointer.active = true;
  };
  addEventListener("resize", resize);
  addEventListener("pointermove", onPointer, { passive: true });

  let coveredSince = -1;
  let raf = 0;
  let first = true;
  function frame(now: number) {
    // The first frame's stamp can predate the setup that just finished: time never runs back.
    const dt = Math.max(0, Math.min(0.25, (now - last) / 1000));
    last = now;
    const t = (now - start) / 1000;

    if (state.entering && !first) {
      raf = requestAnimationFrame(frame);
      return;
    }

    // Behind the blur the scene holds still, and costs nothing while it does.
    if (state.open) {
      if (coveredSince < 0) coveredSince = t;
      if (t - coveredSince > 0.5 && !reduced) {
        raf = requestAnimationFrame(frame);
        return;
      }
    } else {
      coveredSince = -1;
    }

    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);
    const tg = target();
    place.x += (tg.x - place.x) * k;
    place.y += (tg.y - place.y) * k;
    place.s += (tg.s - place.s) * k;

    logo.position.set(place.x, place.y, 1.2);
    logo.scale.setScalar(place.s);
    const sway = calm ? 0.4 : 0.55;
    const px = pointer.active ? pointer.x : Math.sin(t * 0.35) * sway;
    const py = pointer.active ? pointer.y : Math.cos(t * 0.27) * (calm ? 0.3 : 0.4);
    if (!state.entering) {
      if (releasedAt === -1) releasedAt = t;
      const turn = t - releasedAt < 1.4 ? 1 - Math.exp(-dt * 2.4) : k;
      logo.rotation.y += (px * 0.42 - 0.2 - logo.rotation.y) * turn;
      logo.rotation.x += (py * 0.28 + 0.1 - logo.rotation.x) * turn;
    }

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
  let dead = false;
  const begin = () => {
    if (dead) return;
    last = performance.now();
    if (reduced) {
      // No motion: draw the settled scene, and again whenever the layout changes.
      once();
      addEventListener("resize", once);
      addEventListener("hashchange", onceSoon);
    } else {
      raf = requestAnimationFrame(frame);
      document.addEventListener("visibilitychange", onVisibility);
    }
  };
  renderer.compileAsync(world, camera).then(begin, begin);

  return () => {
    dead = true;
    cancelAnimationFrame(raf);
    removeEventListener("resize", resize);
    removeEventListener("resize", once);
    removeEventListener("hashchange", onceSoon);
    removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    world.environment?.dispose();
    wall.geometry.dispose();
    wall.material.dispose();
    for (const mesh of meshes) {
      mesh.geometry.dispose();
      for (const m of mesh.material) m.dispose();
    }
    for (const t of textures) t.dispose();
    renderer.dispose();
  };
}
