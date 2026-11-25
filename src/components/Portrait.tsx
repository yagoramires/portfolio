'use client';

import { useEffect, useRef } from 'react';
import { onFrame, prefersReducedMotion } from '@/lib/motion';
import { FORMS, form, type FormName } from '@/lib/dots';

const SRC = '/portrait.webp';
const INTRO_S = 2.6;
const REVEAL_R = 150;
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render/i;
const LINE_ITEM = 'Yago Ramires • ';
const LINE_SPEED = 60; // px/s, like the reference's hero marquee (1px per frame)
const LINE_END = 0.58; // portrait → line runs over scroll 0.02–0.58 viewport heights

/** The chain the dots travel down the page: one form per section (the pinned sections belong to DotStage). */
const CHAIN: { name: FormName; el: string }[] = [
  { name: 'torus', el: '#perfil' },
  { name: 'wave', el: '#experiencia' },
  { name: 'cloud', el: '#lema' },
  { name: 'vinyl', el: '#fora' },
];

type Link = { name: string; points: Float32Array; el: Element | null; alpha: number; tilt: number; spin: number; slotScale: number; top: number };

const VERT = /* glsl */ `
precision highp float;
uniform vec4 uFrom;       // centre x, y (CSS px, y down), size px, kind (0 portrait, 1 form)
uniform vec4 uTo;
uniform vec2 uFromRot;
uniform vec2 uToRot;
uniform float uFromAlpha;
uniform float uToAlpha;
uniform float uMix;
uniform float uSwirl;
uniform float uTime;
uniform float uProgress; // intro gather 0..1
uniform float uSpacing;  // portrait dot pitch in device px
uniform float uDot;      // form dot size in device px
uniform vec2 uViewport;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uReveal;    // centre x, y, radius
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aLum;
attribute vec3 aSeed;
varying float vLum;
varying float vSeed;
varying float vAlpha;

const float CAMERA = 2.2;

float easeInOut(float q) { return q < 0.5 ? 4.0 * q * q * q : 1.0 - pow(-2.0 * q + 2.0, 3.0) / 2.0; }

vec3 rotate(vec3 p, vec2 r) {
  float cy = cos(r.y), sy = sin(r.y);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  float cx = cos(r.x), sx = sin(r.x);
  return vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
}

// -> screen xy, point size, alpha
vec4 place(vec3 local, vec4 frame, vec2 rot, float alpha) {
  vec3 p = rotate(local, rot);
  p.z = min(p.z, CAMERA - 0.3);
  float persp = CAMERA / (CAMERA - p.z);
  vec2 screen = frame.xy + vec2(p.x, -p.y) * persp * frame.z;
  // portrait: lower body thins out
  if (frame.w < 0.5) return vec4(screen, uSpacing * (0.3 + aLum * 0.95) * persp, alpha * mix(0.12, 1.0, smoothstep(-0.5, -0.12, local.y)));
  // forms: nearer dots bigger and brighter
  return vec4(screen, uDot * (0.6 + aSeed.y * 0.8) * persp, alpha * clamp(0.55 + p.z * 1.4, 0.2, 1.0));
}

// the figure at rest breathes and sways, a shimmer rises through it, bright dots lean to the pointer
vec2 idle() {
  float h = aFrom.y + 0.5;
  vec2 o = vec2(sin(uTime * 0.45) * 4.0 * h, -sin(uTime * 1.1) * 3.0 * h);
  o.x += sin(aFrom.y * 16.0 - uTime * 1.8 + aSeed.z * 2.0) * 1.4 * smoothstep(0.1, 0.9, h);
  o += (uMouse - uFrom.xy) / uViewport * (aLum - 0.4) * 28.0;
  return o;
}

void main() {
  vec3 dir = normalize(aSeed * 2.0 - 1.0 + 0.0001);
  // leaving the portrait the dots set off together, slowly, as a mist; between forms they go at staggered moments
  bool mist = uFrom.w < 0.5;
  float order = aSeed.x * (mist ? 0.3 : 0.45);
  float t = easeInOut(clamp((uMix - order) / (mist ? 0.7 : 0.55), 0.0, 1.0));
  float flight = sin(t * 3.1416);

  vec4 a = place(aFrom, uFrom, uFromRot, uFromAlpha);
  if (mist) a.xy += idle();
  vec4 b = place(aTo, uTo, uToRot, uToAlpha);
  vec2 screen = mix(a.xy, b.xy, t) + dir.xy * flight * uViewport.y * uSwirl;
  float size = mix(a.z, b.z, t);
  float alpha = mix(a.w, b.w, t);
  if (mist) {
    size *= 1.0 + flight * 0.6;
    alpha *= 1.0 - flight * 0.45;
  }

  // intro: gather from a scattered cloud
  float g = clamp((uProgress - aSeed.x * 0.6) / 0.4, 0.0, 1.0);
  g = 1.0 - pow(1.0 - g, 3.0);
  vec2 scattered = uViewport * 0.5 + dir.xy * uViewport.y * (0.4 + aSeed.y * 0.6);
  screen = mix(scattered, screen, g);
  alpha *= 0.4 + 0.6 * g;

  screen += vec2(sin(uTime * 0.8 + aSeed.y * 6.2832), cos(uTime * 0.7 + aSeed.z * 6.2832)) * 1.2;

  // pointer pushes nearby dots away
  vec2 diff = screen - uMouse;
  float force = smoothstep(130.0, 0.0, length(diff)) * uHover;
  screen += normalize(diff + 0.0001) * force * 40.0;

  // portrait reveal: dots inside the circle scatter and fade so the photo behind shows
  float reveal = step(uFrom.w, 0.5) * (1.0 - t) * smoothstep(uReveal.z, uReveal.z * 0.4, length(screen - uReveal.xy));
  screen += normalize(screen - uReveal.xy + 0.0001) * reveal * 24.0;
  alpha *= 1.0 - reveal * 0.95;

  gl_Position = vec4(screen.x / uViewport.x * 2.0 - 1.0, 1.0 - screen.y / uViewport.y * 2.0, 0.0, 1.0);
  gl_PointSize = size * (1.0 + force * 0.6);
  vLum = mix(uFrom.w < 0.5 ? aLum : 0.85, uTo.w < 0.5 ? aLum : 0.85, t);
  vSeed = aSeed.x;
  vAlpha = alpha;
}`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uAccent;
varying float vLum;
varying float vSeed;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  vec3 color = uColor * (0.25 + 0.75 * vLum);
  color = mix(color, uAccent, step(0.985, vSeed));
  float paper = 1.0 - dot(uColor, vec3(0.3333));
  gl_FragColor = vec4(color, smoothstep(0.5, 0.3, d) * vAlpha * mix(1.0, 0.6, paper));
}`;

const DARK_DOT = [240 / 255, 235 / 255, 227 / 255];
const LIGHT_DOT = [18 / 255, 17 / 255, 16 / 255];
const ACCENT = [43 / 255, 79 / 255, 1];

function tier() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const mem = nav.deviceMemory || 4;
  if (innerWidth < 648 || cores <= 4 || mem <= 2) return { step: 5, maxDpr: 1.5 };
  if (cores < 8 || mem < 4) return { step: 4, maxDpr: 1.5 };
  return { step: 3, maxDpr: 2 };
}

function sample(img: HTMLImageElement, step: number) {
  const { naturalWidth: w, naturalHeight: h } = img;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, w, h);
  const pos: number[] = [];
  const lum: number[] = [];
  for (let y = 0; y < h; y += step)
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 128) continue;
      const l = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      pos.push((x - w / 2) / h, 0.5 - y / h, l * 0.04 + (Math.random() - 0.5) * 0.02);
      lum.push(l);
    }
  const seeds = new Float32Array(lum.length * 3).map(() => Math.random());
  return { pos: new Float32Array(pos), lum: new Float32Array(lum), seeds, count: lum.length, aspect: w / h };
}

/** Name line as dots, one target per portrait dot; pairs are matched left-to-right so dots mostly fall straight down. */
function sampleLine(pos: Float32Array, count: number, family: string) {
  const fontPx = 150;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  const font = `800 ${fontPx}px ${family}`;
  ctx.font = font;
  const itemW = ctx.measureText(LINE_ITEM).width;
  c.width = Math.ceil(itemW * 3);
  c.height = Math.ceil(fontPx * 1.25);
  ctx.font = font;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'middle';
  ctx.fillText(LINE_ITEM.repeat(3), 0, c.height / 2);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  const step = Math.max(3, Math.round(fontPx / 34));
  const raw: number[] = [];
  for (let y = 0; y < c.height; y += step)
    for (let x = 0; x < c.width; x += step)
      if (data[(y * c.width + x) * 4 + 3] > 128) raw.push((x - c.width / 2) / c.height, (c.height / 2 - y) / c.height);
  const n = raw.length / 2;
  const jitter = step / c.height;
  const picked: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const k = n >= count ? Math.floor((i * n) / count) : i < n ? i : Math.floor(Math.random() * n);
    const extra = n >= count ? 0 : jitter;
    picked.push([raw[k * 2] + (Math.random() - 0.5) * extra, raw[k * 2 + 1] + (Math.random() - 0.5) * extra]);
  }
  picked.sort((a, b) => a[0] - b[0]);
  const order = [...Array(count).keys()].sort((a, b) => pos[a * 3] - pos[b * 3]);
  const to = new Float32Array(count * 3);
  order.forEach((idx, k) => to.set([picked[k][0], picked[k][1], 0], idx * 3));
  return { to, item: itemW / c.height, width: c.width / c.height };
}

function compile(gl: WebGLRenderingContext, vs: string, fs: string) {
  const prog = gl.createProgram()!;
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader');
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
  return prog;
}

/** Hero portrait drawn as a field of dots on a fixed full-screen canvas behind the page. */
export function Portrait() {
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = slot.current!;
    const root = document.documentElement;
    const fallback = () => el.classList.add('is-static');

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'portrait-fx';
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, failIfMajorPerformanceCaveat: true });
    const dbg = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = gl && String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    if (!gl || SOFTWARE_GL.test(renderer ?? '')) {
      fallback();
      return;
    }

    const reveal = document.createElement('div');
    reveal.className = 'hero-reveal';
    reveal.setAttribute('aria-hidden', 'true');
    reveal.innerHTML = `<img src="${SRC}" alt="" />`;
    document.body.append(canvas, reveal);

    const reduced = prefersReducedMotion();
    const { step, maxDpr } = tier();
    let stop = () => {};
    let disposed = false;

    const img = new Image();
    img.src = SRC;
    Promise.all([img.decode(), document.fonts.ready])
      .then(() => {
        if (disposed) return;
        const pts = sample(img, step);
        const family = getComputedStyle(document.querySelector('.display') ?? document.body).fontFamily;
        const line = sampleLine(pts.pos, pts.count, family);
        const prog = compile(gl, VERT, FRAG);
        gl.useProgram(prog);
        const attr = (name: string, data: Float32Array, size: number) => {
          const buf = gl.createBuffer()!;
          const loc = gl.getAttribLocation(prog, name);
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
          return buf;
        };
        const fromBuf = attr('aFrom', pts.pos, 3);
        const toBuf = attr('aTo', line.to, 3);
        attr('aLum', pts.lum, 1);
        attr('aSeed', pts.seeds, 3);

        const base = { alpha: 1, tilt: 0, spin: 0, slotScale: 1, top: 0 };
        const chain: Link[] = [
          { ...base, name: 'portrait', points: pts.pos, el: null },
          { ...base, name: 'line', points: line.to, el: null, alpha: 1.6 },
        ];
        for (const c of CHAIN) {
          const sec = document.querySelector(c.el);
          if (sec) chain.push({ ...base, ...FORMS[c.name], name: c.name, points: form(c.name, pts.count), el: sec });
        }
        // after the last form, it fades out where it is as the contact section comes in
        const last = chain[chain.length - 1];
        chain.push({ ...last, name: 'end', el: document.querySelector('#contato'), alpha: 0 });
        let pair = '0-1';
        const u = (name: string) => gl.getUniformLocation(prog, name);
        const U = {
          from: u('uFrom'), to: u('uTo'), fromRot: u('uFromRot'), toRot: u('uToRot'), fromAlpha: u('uFromAlpha'),
          toAlpha: u('uToAlpha'), mix: u('uMix'), swirl: u('uSwirl'), time: u('uTime'), progress: u('uProgress'),
          spacing: u('uSpacing'), dot: u('uDot'), viewport: u('uViewport'), mouse: u('uMouse'), hover: u('uHover'),
          reveal: u('uReveal'), color: u('uColor'), accent: u('uAccent'),
        };
        gl.uniform3fv(U.accent, ACCENT);
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        // slot box in page coordinates, re-measured every 30 frames like the reference
        let box = { x: 0, y: 0, w: 1, h: 1 };
        let heroBottom = innerHeight;
        const hero = el.closest('section');
        let dpr = 1;
        const measure = () => {
          const r = el.getBoundingClientRect();
          box = { x: r.left, y: r.top + scrollY, w: r.width, h: r.height };
          if (hero) heroBottom = hero.getBoundingClientRect().bottom + scrollY;
          for (const c of chain) if (c.el) c.top = c.el.getBoundingClientRect().top + scrollY;
        };
        const resize = () => {
          dpr = Math.min(devicePixelRatio, maxDpr);
          canvas.width = innerWidth * dpr;
          canvas.height = innerHeight * dpr;
          gl.viewport(0, 0, canvas.width, canvas.height);
          measure();
        };
        resize();
        window.addEventListener('resize', resize);

        const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, hover: 0, active: 0, cx: -9999, cy: -9999, inside: false };
        const onMove = (e: PointerEvent) => {
          mouse.tx = e.clientX / innerWidth;
          mouse.ty = 1 - e.clientY / innerHeight;
          mouse.active = 1;
          if (e.pointerType === 'mouse') {
            mouse.cx = e.clientX;
            mouse.cy = e.clientY;
            mouse.inside = true;
          }
        };
        const onLeave = () => {
          mouse.active = 0;
          mouse.inside = false;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        root.addEventListener('pointerleave', onLeave);

        const color = [...DARK_DOT];
        const lens = { x: 0, y: 0, r: 0 };
        const start = performance.now();
        let loadedAt: number | null = null;
        let smoothY = scrollY;
        let frame = 0;
        let idle = false;
        let lastTime = 0;
        let shift = 0;
        let drift = 1;

        const stopFrame = onFrame((now) => {
          if (frame++ % 30 === 0) measure();
          const time = reduced ? 0 : (now - start) / 1000;
          if (loadedAt === null && root.classList.contains('is-loaded')) loadedAt = time + 0.2;
          const progress = reduced ? 1 : loadedAt === null ? 0 : Math.min(1, Math.max(0, (time - loadedAt) / INTRO_S));

          // scroll lags a little and is capped per frame, so a fast fling still plays the dissolve
          const vh = innerHeight;
          const d = scrollY - smoothY;
          smoothY += Math.max(-vh * 0.03, Math.min(vh * 0.03, d * 0.2));
          if (Math.abs(d) < 0.5 || Math.abs(d) > vh * 6) smoothY = scrollY;
          // which two links of the chain we are between, and how far (the reference's segment rule):
          // portrait → line by scroll; each later form morphs over 0.7vh starting 0.55vh before its section
          const centre = smoothY + vh / 2;
          let seg: [number, number, number] = [chain.length - 2, chain.length - 1, 1];
          let prevEnd = -Infinity;
          for (let i = 1; i < chain.length; i++) {
            if (chain[i].name === 'line') {
              if (smoothY / vh < LINE_END) {
                seg = [0, 1, Math.min(1, Math.max(0, (smoothY / vh - 0.02) / (LINE_END - 0.02)))];
                break;
              }
              continue;
            }
            let start = chain[i].top - vh * 0.55;
            let span = vh * 0.7;
            if (chain[i - 1].name === 'line') {
              start = Math.max(start, vh * (LINE_END + 0.06 + 0.5));
              span = vh * 0.36;
            }
            start = Math.max(start, prevEnd);
            prevEnd = start + span;
            if (centre < start + span) {
              seg = [i - 1, i, Math.min(1, Math.max(0, (centre - start) / span))];
              break;
            }
          }
          const [fi, ti, mix] = seg;
          if (pair !== `${fi}-${ti}`) {
            pair = `${fi}-${ti}`;
            gl.bindBuffer(gl.ARRAY_BUFFER, fromBuf);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, chain[fi].points);
            gl.bindBuffer(gl.ARRAY_BUFFER, toBuf);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, chain[ti].points);
          }

          // name line: sits low in the hero (~270px above the next section rule), scrolls with the page, drifts against the scroll direction
          const lh = Math.min(vh * 0.17, innerWidth * 0.12);
          const lineY = heroBottom - vh * 0.16 - scrollY;
          if (Math.abs(d) > 0.5) drift = d > 0 ? 1 : -1;
          const dt = Math.min(0.1, time - lastTime);
          lastTime = time;
          const itemPx = line.item * lh;
          shift -= LINE_SPEED * dt * drift;
          if (shift <= -itemPx) shift += itemPx;
          else if (shift > 0) shift -= itemPx;

          // nothing to draw once the last form has faded
          if (chain[ti].name === 'end' && mix >= 1) {
            if (!idle) gl.clear(gl.COLOR_BUFFER_BIT);
            idle = true;
            reveal.style.opacity = '0';
            return;
          }
          idle = false;

          mouse.x += (mouse.tx - mouse.x) * 0.08;
          mouse.y += (mouse.ty - mouse.y) * 0.08;
          mouse.hover += (mouse.active - mouse.hover) * 0.05;
          const target = root.dataset.theme === 'light' ? LIGHT_DOT : DARK_DOT;
          for (let i = 0; i < 3; i++) color[i] += (target[i] - color[i]) * 0.06;

          // portrait frame: fill the slot's height (it runs past the fold, like the reference), centred on it
          const ph = Math.min(box.h, innerWidth / pts.aspect);
          const pw = ph * pts.aspect;
          const left = box.x + (box.w - pw) / 2;
          const top = box.y + (box.h - ph) / 2 - scrollY;

          const wide = innerWidth >= 1024;
          const frameOf = (i: number): [number, number, number, number] => {
            const c = chain[i];
            if (c.name === 'portrait') return [left + pw / 2, top + ph / 2, ph, 0];
            if (c.name === 'line') return [shift + (line.width * lh) / 2, lineY, lh, 1];
            if (c.name === 'end') return frameOf(i - 1);
            const slot = c.el?.querySelector('.form-slot')?.getBoundingClientRect();
            if (slot?.width) return [slot.left + slot.width / 2, slot.top + slot.height / 2, Math.min(slot.width, slot.height) * c.slotScale, 1];
            return [innerWidth / 2, vh / 2, vh, 1]; // no slot: fill the viewport (the motto cloud)
          };
          const alphaOf = (i: number) => (wide || i < 2 ? chain[i].alpha : 0);
          const tiltX = (1 - mouse.y * 2) * 0.08;
          const tiltY = (mouse.x * 2 - 1) * 0.15;
          const rotOf = (i: number) => {
            const c = chain[i];
            const follow = c.name === 'line' ? 0 : 1;
            return [c.tilt + tiltX * follow, time * c.spin + tiltY * follow] as const;
          };

          const over = mouse.inside && mouse.cx > left && mouse.cx < left + pw && mouse.cy > top && mouse.cy < top + ph;
          lens.r += ((fi === 0 && mix < 0.05 && scrollY < 4 && over ? REVEAL_R : 0) - lens.r) * 0.12;
          const k = lens.r < 1 ? 1 : 0.25;
          lens.x += (mouse.cx - lens.x) * k;
          lens.y += (mouse.cy - lens.y) * k;
          const rs = reveal.style;
          rs.transform = `translate3d(${left}px, ${top}px, 0)`;
          rs.width = `${pw}px`;
          rs.height = `${ph}px`;
          rs.setProperty('--mx', `${(lens.x - left).toFixed(1)}px`);
          rs.setProperty('--my', `${(lens.y - top).toFixed(1)}px`);
          rs.setProperty('--r', `${lens.r.toFixed(1)}px`);
          rs.opacity = lens.r > 1 ? '1' : '0';

          gl.uniform4f(U.from, ...frameOf(fi));
          gl.uniform4f(U.to, ...frameOf(ti));
          gl.uniform2f(U.fromRot, ...rotOf(fi));
          gl.uniform2f(U.toRot, ...rotOf(ti));
          gl.uniform1f(U.fromAlpha, alphaOf(fi));
          gl.uniform1f(U.toAlpha, alphaOf(ti));
          gl.uniform1f(U.mix, mix);
          gl.uniform1f(U.swirl, fi === 0 ? 0.1 : chain[fi].name === 'line' ? 0.07 : 0.18);
          gl.uniform1f(U.time, time);
          gl.uniform1f(U.progress, progress);
          gl.uniform1f(U.spacing, (ph / img.naturalHeight) * step * dpr);
          gl.uniform1f(U.dot, 1.7 * dpr);
          gl.uniform2f(U.viewport, innerWidth, vh);
          gl.uniform2f(U.mouse, mouse.x * innerWidth, (1 - mouse.y) * vh);
          gl.uniform1f(U.hover, mouse.hover);
          gl.uniform3f(U.reveal, lens.x, lens.y, lens.r);
          gl.uniform3fv(U.color, color);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.POINTS, 0, pts.count);
        });

        root.classList.add('has-particles');
        stop = () => {
          stopFrame();
          window.removeEventListener('resize', resize);
          window.removeEventListener('pointermove', onMove);
          root.removeEventListener('pointerleave', onLeave);
          root.classList.remove('has-particles');
        };
      })
      .catch(() => {
        canvas.remove();
        reveal.remove();
        fallback();
      });

    return () => {
      disposed = true;
      stop();
      canvas.remove();
      reveal.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div ref={slot} aria-hidden="true" className="hero-portrait h-full w-full" />;
}
