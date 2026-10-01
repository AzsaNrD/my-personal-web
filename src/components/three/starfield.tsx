'use client';

import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import { useTheme } from '@/components/theme/theme-provider';

type Palette = {
  base: number;
  emerald: number;
  magenta: number;
  alpha: number;
  additive: boolean;
};

const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: { base: 0xeafff6, emerald: 0x6ee7b7, magenta: 0xe879f9, alpha: 0.9, additive: true },
  light: { base: 0x059669, emerald: 0x047857, magenta: 0xa21caf, alpha: 0.32, additive: false },
};

// Depth parallax in the shader: near stars (small d) shift further on screen than far ones.
const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aTint;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uTwinkle;
  uniform float uScroll;
  uniform vec2 uMouse;
  varying float vAlpha;
  varying float vTint;

  void main() {
    vec3 p = position;
    float d = -p.z;
    float h = 1.4 * d;
    p.y = mod(p.y + uScroll + h * 0.5, h) - h * 0.5;
    p.xy += uMouse * 0.9;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float tw = 1.0 - 0.28 * uTwinkle * (0.5 + 0.5 * sin(uTime * 1.3 + aPhase));
    gl_PointSize = aSize * uPixelRatio * clamp(18.0 / d, 0.9, 2.4) * tw;
    vAlpha = tw * clamp(1.2 - d / 45.0, 0.35, 1.0);
    vTint = aTint;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uEmerald;
  uniform vec3 uMagenta;
  uniform float uAlpha;
  varying float vAlpha;
  varying float vTint;

  void main() {
    float dist = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, dist);
    a *= a;
    vec3 col = vTint < 0.8 ? uBase : (vTint < 0.94 ? uEmerald : uMagenta);
    gl_FragColor = vec4(col, a * vAlpha * uAlpha);
    #include <colorspace_fragment>
  }
`;

const DEPTH_MIN = 6;
const DEPTH_MAX = 38;
const FOV = 60;
const HALF = Math.tan((FOV / 2) * (Math.PI / 180));

type StarApi = { applyPalette: (mode: 'dark' | 'light') => void; dispose: () => void };

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<StarApi | null>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pixelRatio = Math.min(window.devicePixelRatio, 1.25);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);

    const MAX_STARS = 1100;
    const geometry = new BufferGeometry();
    const positions = new Float32Array(MAX_STARS * 3);
    const sizes = new Float32Array(MAX_STARS);
    const phases = new Float32Array(MAX_STARS);
    const tints = new Float32Array(MAX_STARS);
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new BufferAttribute(phases, 1));
    geometry.setAttribute('aTint', new BufferAttribute(tints, 1));

    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uTwinkle: { value: reducedMotion ? 0 : 1 },
        uScroll: { value: 0 },
        uMouse: { value: new Vector2() },
        uBase: { value: new Color() },
        uEmerald: { value: new Color() },
        uMagenta: { value: new Color() },
        uAlpha: { value: 1 },
      },
    });
    const points = new Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    function applyPalette(mode: 'dark' | 'light') {
      const p = PALETTES[mode];
      material.uniforms.uBase.value.set(p.base);
      material.uniforms.uEmerald.value.set(p.emerald);
      material.uniforms.uMagenta.value.set(p.magenta);
      material.uniforms.uAlpha.value = p.alpha;
      material.blending = p.additive ? AdditiveBlending : NormalBlending;
      material.needsUpdate = true;
    }
    applyPalette(themeRef.current);

    let generatedAspect = 0;
    function generate(aspect: number, count: number) {
      for (let i = 0; i < MAX_STARS; i += 1) {
        const d = DEPTH_MIN + Math.pow(Math.random(), 1.6) * (DEPTH_MAX - DEPTH_MIN);
        const halfW = HALF * d * aspect * 1.15;
        const halfH = HALF * d * 0.7;
        positions[i * 3] = (Math.random() * 2 - 1) * halfW;
        positions[i * 3 + 1] = (Math.random() * 2 - 1) * halfH * 1.4;
        positions[i * 3 + 2] = -d;
        sizes[i] = 0.9 + Math.random() * 1.5;
        phases[i] = Math.random() * Math.PI * 2;
        const r = Math.random();
        tints[i] = r;
      }
      geometry.setDrawRange(0, count);
      for (const name of ['position', 'aSize', 'aPhase', 'aTint']) {
        (geometry.getAttribute(name) as BufferAttribute).needsUpdate = true;
      }
      generatedAspect = aspect;
    }

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      const count = w < 768 ? 550 : MAX_STARS;
      // Mobile toolbars change innerHeight while scrolling; only re-roll on real shape changes.
      if (generatedAspect === 0 || Math.abs(aspect - generatedAspect) / generatedAspect > 0.15) {
        generate(aspect, count);
      } else {
        geometry.setDrawRange(0, count);
      }
    }

    const mouse = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let time = 0;

    function render() {
      material.uniforms.uTime.value = time;
      material.uniforms.uScroll.value = reducedMotion ? 0 : window.scrollY * 0.0035;
      material.uniforms.uMouse.value.set(smooth.x, smooth.y);
      renderer.render(scene, camera);
    }

    let raf = 0;
    let last = 0;
    let lastRender = 0;
    let running = false;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (now - lastRender < 33) return; // 30 fps is plenty for a backdrop
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      lastRender = now;
      time += dt;
      smooth.x += (mouse.x - smooth.x) * Math.min(dt * 4, 1);
      smooth.y += (mouse.y - smooth.y) * Math.min(dt * 4, 1);
      render();
    }

    function start() {
      if (running || reducedMotion || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return;
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }
    function onResize() {
      resize();
      if (!running) render();
    }

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);

    resize();
    render();
    container.style.opacity = '1';
    start();

    apiRef.current = {
      applyPalette: (mode) => {
        applyPalette(mode);
        if (!running) render();
      },
      dispose: () => {
        stop();
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('resize', onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        canvas.remove();
      },
    };

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.applyPalette(resolvedTheme);
  }, [resolvedTheme]);

  return <div ref={containerRef} aria-hidden className="starfield" style={{ opacity: 0 }} />;
}
