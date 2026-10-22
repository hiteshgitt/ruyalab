import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
  MathUtils,
} from "three";

/**
 * "Iris" — the Ruyalab hero sculpture. A dark core etched with flowing contour
 * lines, wrapped in concentric precision rings. At rest the rings face the
 * viewer like an iris; scroll progress opens them into a gyroscope.
 */

export type IrisQuality = "high" | "low";

export type IrisOptions = {
  quality: IrisQuality;
  onContextLost?: () => void;
};

export type IrisHandle = {
  /** Resolves once shaders are compiled (parallel where the GPU supports it). */
  ready: Promise<void>;
  setScroll(progress: number): void;
  setPointer(x: number, y: number): void;
  setActive(active: boolean): void;
  dispose(): void;
};

// Mascot palette: cyan contours, violet + cyan accent rings, deep-navy core.
const ACCENT = new Color("#45e3ff");
const VIOLET = new Color("#8f5bff");
const RIM = new Color("#e6ecff");
const BASE = new Color("#0e1840");

// Ashima / Stefan Gustavson 3D simplex noise (MIT).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const coreVertex = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
${NOISE}
void main(){
  vec3 p = position;
  float d = snoise(p * 0.9 + vec3(uTime * 0.08));
  p += normal * d * 0.055;
  vPos = position;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const coreFragment = /* glsl */ `
uniform float uTime;
uniform float uOpen;
uniform vec3 uAccent;
uniform vec3 uRim;
uniform vec3 uBase;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
${NOISE}
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float facing = max(dot(N, V), 0.0);
  float fres = pow(1.0 - facing, 2.6);

  vec3 L = normalize(vec3(-0.55, 0.8, 0.65));
  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(N, normalize(L + V)), 0.0), 72.0);

  // Topographic contour lines drifting across the surface.
  float n = snoise(vPos * 1.3 + vec3(0.0, uTime * 0.05, uTime * 0.025));
  float bands = n * 6.5;
  float dist = abs(fract(bands) - 0.5);
  float w = fwidth(bands);
  float line = 1.0 - smoothstep(0.0, w * 1.4, dist);
  float lineMask = smoothstep(0.1, 0.85, facing) * (0.3 + 0.7 * diff);

  vec3 col = uBase * (0.28 + 0.72 * diff);
  col += uRim * (spec * 0.4 + fres * 0.5);
  col += uAccent * line * lineMask * (0.5 + 0.5 * uOpen);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const haloVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const haloFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uStrength;
varying vec2 vUv;
void main(){
  float d = length(vUv - 0.5) * 2.0;
  float a = pow(clamp(1.0 - d, 0.0, 1.0), 3.0) * uStrength;
  gl_FragColor = vec4(uColor * a, a);
  #include <colorspace_fragment>
}`;

type Ring = {
  pivot: Object3D;
  material: LineBasicMaterial;
  baseOpacity: number;
  iris: { x: number; y: number; z: number };
  gyro: { x: number; y: number; z: number };
  order: number;
  bead?: { mesh: Mesh; radius: number; speed: number; phase: number };
};

function circle(radius: number, segments: number) {
  const pts: number[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pts, 3));
  return g;
}

export function createIris(canvas: HTMLCanvasElement, opts: IrisOptions): IrisHandle {
  const high = opts.quality === "high";
  const renderer = new WebGLRenderer({
    canvas,
    antialias: high,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, high ? 2 : 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 100);
  const FIT_RADIUS = 2.75;

  // --- Core
  const coreUniforms = {
    uTime: { value: 0 },
    uOpen: { value: 0 },
    uAccent: { value: ACCENT },
    uRim: { value: RIM },
    uBase: { value: BASE },
  };
  const core = new Mesh(
    new IcosahedronGeometry(1, high ? 48 : 22),
    new ShaderMaterial({ vertexShader: coreVertex, fragmentShader: coreFragment, uniforms: coreUniforms }),
  );

  // --- Halo (cheap bloom stand-in, kept outside the tilting group)
  const haloUniforms = { uColor: { value: new Color("#2f6bff") }, uStrength: { value: 0.16 } };
  const halo = new Mesh(
    new PlaneGeometry(7, 7),
    new ShaderMaterial({
      vertexShader: haloVertex,
      fragmentShader: haloFragment,
      uniforms: haloUniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    }),
  );
  halo.position.z = -1.2;
  scene.add(halo);

  // --- Rings
  const root = new Group();
  const spin = new Group();
  root.add(spin);
  spin.add(core);
  scene.add(root);

  const ringCount = high ? 26 : 16;
  const segments = high ? 160 : 96;
  const rings: Ring[] = [];
  const beadGeo = new SphereGeometry(0.028, 12, 12);

  for (let i = 0; i < ringCount; i++) {
    const t = i / (ringCount - 1);
    const radius = 1.32 + t * 1.15;
    const cyan = i === Math.round(ringCount * 0.35);
    const violet = i === ringCount - 3;
    const accent = cyan || violet;
    const baseOpacity = accent ? 0.85 : 0.1 + (1 - t) * 0.22;
    const material = new LineBasicMaterial({
      color: cyan ? ACCENT : violet ? VIOLET : RIM,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const line = new LineLoop(circle(radius, segments), material);
    const pivot = new Object3D();
    pivot.add(line);
    spin.add(pivot);

    const ring: Ring = {
      pivot,
      material,
      baseOpacity,
      order: t,
      iris: { x: (i % 2 ? 1 : -1) * 0.06 * (1 + t), y: (i % 3 - 1) * 0.05, z: i * 0.37 },
      gyro: { x: t * Math.PI * 0.92 + 0.2, y: i * 0.41, z: i * 0.21 },
    };

    if (i % Math.ceil(ringCount / 3) === 4) {
      const mesh = new Mesh(beadGeo, new MeshBasicMaterial({ color: i % 2 ? ACCENT : RIM }));
      line.add(mesh);
      ring.bead = { mesh, radius, speed: 0.12 + t * 0.1, phase: i * 1.7 };
    }
    rings.push(ring);
  }

  // --- State
  const state = {
    scroll: 0,
    scrollSmooth: 0,
    pointer: { x: 0, y: 0 },
    pointerSmooth: { x: 0, y: 0 },
    active: false,
    raf: 0,
    start: performance.now(),
    last: performance.now(),
    elapsed: 0,
  };

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Fit the sculpture's bounding radius within the shorter viewport axis.
    const vFov = MathUtils.degToRad(camera.fov);
    const fitV = FIT_RADIUS / Math.sin(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const fitH = FIT_RADIUS / Math.sin(hFov / 2);
    camera.userData.baseZ = Math.max(fitV, fitH);
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  resize();

  const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

  function frame(now: number) {
    const dt = Math.min((now - state.last) / 1000, 1 / 20);
    state.last = now;
    state.elapsed += dt;
    const time = state.elapsed;

    // Critically-damped-ish smoothing, framerate independent.
    const k = 1 - Math.exp(-dt * 4);
    state.scrollSmooth += (state.scroll - state.scrollSmooth) * k;
    state.pointerSmooth.x += (state.pointer.x - state.pointerSmooth.x) * k * 0.8;
    state.pointerSmooth.y += (state.pointer.y - state.pointerSmooth.y) * k * 0.8;

    const intro = easeOut(Math.min(time / 2.2, 1));
    const breathe = Math.sin(time * 0.6) * 0.04;
    const open = MathUtils.clamp(0.12 + breathe + state.scrollSmooth * 0.95, 0, 1);

    coreUniforms.uTime.value = time;
    coreUniforms.uOpen.value = open;
    haloUniforms.uStrength.value = (0.12 + open * 0.08) * intro;

    root.rotation.x = -state.pointerSmooth.y * 0.32 + state.scrollSmooth * 0.35;
    root.rotation.y = state.pointerSmooth.x * 0.42;
    spin.rotation.z = time * 0.035;
    spin.rotation.y = state.scrollSmooth * 0.9;

    const coreScale = (0.55 + intro * 0.45) * (1 - state.scrollSmooth * 0.18);
    core.scale.setScalar(coreScale);

    for (const r of rings) {
      // Outer rings open slightly after inner ones for a layered unfold.
      const local = MathUtils.clamp(open * 1.35 - r.order * 0.35, 0, 1);
      const e = local * local * (3 - 2 * local);
      r.pivot.rotation.set(
        MathUtils.lerp(r.iris.x, r.gyro.x, e),
        MathUtils.lerp(r.iris.y, r.gyro.y, e),
        MathUtils.lerp(r.iris.z, r.gyro.z, e) + time * 0.02 * (r.order - 0.5),
      );
      const ringIntro = easeOut(MathUtils.clamp((time - r.order * 0.6) / 1.6, 0, 1));
      r.pivot.scale.setScalar(0.82 + ringIntro * 0.18);
      r.material.opacity = r.baseOpacity * ringIntro;
      if (r.bead) {
        const a = r.bead.phase + time * r.bead.speed * Math.PI * 2 * 0.25;
        r.bead.mesh.position.set(Math.cos(a) * r.bead.radius, Math.sin(a) * r.bead.radius, 0);
      }
    }

    camera.position.set(0, 0, (camera.userData.baseZ ?? 10) * (1 - state.scrollSmooth * 0.08));
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    state.raf = requestAnimationFrame(frame);
  }

  function setActive(active: boolean) {
    if (active === state.active) return;
    state.active = active;
    if (active) {
      state.last = performance.now();
      state.raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(state.raf);
    }
  }

  const onLost = (e: Event) => {
    e.preventDefault();
    setActive(false);
    opts.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  // Parallel compile where supported; otherwise shaders compile on first render.
  const ready = renderer.extensions.has("KHR_parallel_shader_compile")
    ? renderer.compileAsync(scene, camera).then(
        () => undefined,
        () => undefined,
      )
    : Promise.resolve();

  return {
    ready,
    setScroll(p) {
      state.scroll = MathUtils.clamp(p, 0, 1);
    },
    setPointer(x, y) {
      state.pointer.x = MathUtils.clamp(x, -1, 1);
      state.pointer.y = MathUtils.clamp(y, -1, 1);
    },
    setActive,
    dispose() {
      setActive(false);
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      scene.traverse((obj) => {
        const m = obj as Mesh;
        m.geometry?.dispose();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
    },
  };
}
