'use client';

import { useEffect } from 'react';
import { work } from '@/content/projects';
import { GRID_H, GRID_W, flatForm, sampleDrawing, sampleImage, type Palette } from '@/lib/dots';
import { onFrame, prefersReducedMotion } from '@/lib/motion';

const N = GRID_W * GRID_H; // 64,000 dots, one per cell of a work image
const MORPH_S = 0.8;
const DOT_PX = 1.5;
const PAIR_MS = 3200;
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render/i;

const LIGHT: Palette = { fg: '#121110', accent: '#2b4fff' };
const DARK: Palette = { fg: '#f0ebe3', accent: '#9aa6ff' };
const ON_ACCENT: Palette = { fg: '#f0ebe3', accent: '#121110' };

type Shape = { to: Float32Array; color: Float32Array; slot: string; grid?: boolean; clip?: string; scale?: number; over?: boolean };
type Stage = { el: string; forms?: Shape[]; pairs?: Shape[][] };

const VERT = /* glsl */ `
precision highp float;
attribute vec2 aFrom;
attribute vec2 aTo;
attribute vec3 aFromColor;
attribute vec3 aToColor;
attribute vec3 aSeed;
uniform vec4 uRect;
uniform vec2 uView;
uniform vec2 uMouse;
uniform float uMix;
uniform float uTime;
uniform float uSize;
varying vec3 vColor;
void main() {
  float s = clamp(uMix * 1.5 - aSeed.z * 0.5, 0.0, 1.0);
  float e = s * s * (3.0 - 2.0 * s);
  vec2 p = mix(aFrom, uRect.xy + aTo * uRect.zw, e);
  p += sin(e * 3.14159) * (aSeed.xy - 0.5) * 420.0;
  p += vec2(sin(uTime * 0.8 + aSeed.x * 6.28), cos(uTime * 0.7 + aSeed.y * 6.28)) * 0.35;
  vec2 d = p - uMouse;
  float r = length(d);
  if (r > 0.001) p += d / r * pow(max(0.0, 1.0 - r / 130.0), 2.0) * 60.0;
  gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
  gl_PointSize = uSize;
  vColor = mix(aFromColor, aToColor, e);
}`;

const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vColor;
uniform float uAlpha;
void main() {
  if (length(gl_PointCoord - 0.5) > 0.5) discard;
  gl_FragColor = vec4(vColor, uAlpha);
}`;

const yieldFrame = () => new Promise((r) => setTimeout(r));

/**
 * Dot layer for the pinned sections: illustrations for "what I do" and the process, full-bleed work images, the open
 * side-project card. Dots swirl between shapes in 0.8s and part around the pointer. Hands over to and from the
 * portrait layer's forms at the about and experience slots.
 */
export function DotStage() {
  useEffect(() => {
    if (!matchMedia('(min-width: 1024px)').matches || prefersReducedMotion()) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'dots-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, failIfMajorPerformanceCaveat: true });
    const dbg = gl?.getExtension('WEBGL_debug_renderer_info');
    if (!gl || SOFTWARE_GL.test(String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER)))) return;
    document.body.append(canvas);
    const root = document.documentElement;
    const dpr = Math.min(devicePixelRatio, 2);
    let disposed = false;
    let stop = () => {};

    (async () => {
      const drawn = async (names: string[], palette: Palette, slot: string, over = false) => {
        const out: Shape[] = [];
        for (const name of names) {
          await yieldFrame(); // keep the page responsive while sampling
          out.push({ ...sampleDrawing(name, palette, N), slot, over });
        }
        return out;
      };
      const images = await Promise.all(work.map(async (w) => ({ ...(await sampleImage(w.image)), slot: '.work-slot', grid: true, clip: '.dw-stage' })));
      const home = {
        above: { ...flatForm('torus', N, [0.49, 0.48, 0.47]), slot: '#perfil .form-slot', scale: 1.2 } as Shape,
        below: { ...flatForm('wave', N, [0.6, 0.6, 0.59]), slot: '#experiencia .form-slot', scale: 1.15, over: true } as Shape,
      };
      const stages: Stage[] = [
        { el: '#servicos', forms: await drawn(['product', 'refactor', 'coverage'], LIGHT, '.services-slot') },
        { el: '#processo', forms: await drawn(['call', 'wireframe', 'system', 'code', 'checklist', 'pulse'], DARK, '.process-slot') },
        { el: '#trabalhos', forms: images },
        {
          el: '#projetos',
          pairs: [
            await drawn(['cardsDown', 'cardsUp'], ON_ACCENT, '.as-panel.is-open .apps-slot', true),
            await drawn(['calendar', 'booked'], ON_ACCENT, '.as-panel.is-open .apps-slot', true),
            await drawn(['catalog', 'order'], ON_ACCENT, '.as-panel.is-open .apps-slot', true),
          ],
        },
      ];
      if (disposed) return;

      // GL setup
      const prog = gl.createProgram()!;
      for (const [type, src] of [
        [gl.VERTEX_SHADER, VERT],
        [gl.FRAGMENT_SHADER, FRAG],
      ] as const) {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader');
        gl.attachShader(prog, sh);
      }
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buffers: Record<string, { buf: WebGLBuffer; data: Float32Array }> = {};
      const attr = (name: string, data: Float32Array, size: number, dynamic = false) => {
        const buf = gl.createBuffer()!;
        const loc = gl.getAttribLocation(prog, name);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        buffers[name] = { buf, data };
      };
      const from = new Float32Array(N * 2).map((_, i) => Math.random() * (i % 2 ? innerHeight : innerWidth));
      const seed = new Float32Array(N * 3).map(() => Math.random());
      attr('aFrom', from, 2, true);
      attr('aTo', new Float32Array(stages[0].forms![0].to), 2, true);
      attr('aFromColor', new Float32Array(stages[0].forms![0].color), 3, true);
      attr('aToColor', new Float32Array(stages[0].forms![0].color), 3, true);
      attr('aSeed', seed, 3);
      const upload = (...names: string[]) => {
        for (const n of names) {
          gl.bindBuffer(gl.ARRAY_BUFFER, buffers[n].buf);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, buffers[n].data);
        }
      };
      const u = (n: string) => gl.getUniformLocation(prog, n);
      const U = { rect: u('uRect'), view: u('uView'), mouse: u('uMouse'), mix: u('uMix'), time: u('uTime'), size: u('uSize'), alpha: u('uAlpha') };
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const resize = () => {
        canvas.width = innerWidth * dpr;
        canvas.height = innerHeight * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener('resize', resize);
      const mouse = { x: -999, y: -999 };
      const onMove = (e: PointerEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const rectOf = (s: Shape): [number, number, number, number] | null => {
        const r = document.querySelector(s.slot)?.getBoundingClientRect();
        if (!r) return null;
        if (s.scale) {
          const side = Math.min(r.width, r.height) * s.scale;
          return [r.left + r.width / 2 - side / 2, r.top + r.height / 2 - side / 2, side, side];
        }
        return [r.left, r.top, r.width, r.height];
      };

      let rect: [number, number, number, number] = [0, 0, 1, 1];
      let mix = 1;
      let key: string | null = null;
      let alpha = 0;

      // bake where every dot is right now, then aim it at the next shape
      const retarget = (next: Shape) => {
        const f = buffers.aFrom.data;
        const t = buffers.aTo.data;
        const fc = buffers.aFromColor.data;
        const tc = buffers.aToColor.data;
        for (let i = 0; i < N; i++) {
          const s = Math.min(1, Math.max(0, mix * 1.5 - seed[i * 3 + 2] * 0.5));
          const e = s * s * (3 - 2 * s);
          const swing = Math.sin(e * Math.PI) * 420;
          f[i * 2] += (rect[0] + t[i * 2] * rect[2] - f[i * 2]) * e + (seed[i * 3] - 0.5) * swing;
          f[i * 2 + 1] += (rect[1] + t[i * 2 + 1] * rect[3] - f[i * 2 + 1]) * e + (seed[i * 3 + 1] - 0.5) * swing;
          for (let k = 0; k < 3; k++) fc[i * 3 + k] += (tc[i * 3 + k] - fc[i * 3 + k]) * e;
        }
        t.set(next.to);
        tc.set(next.color);
        upload('aFrom', 'aTo', 'aFromColor', 'aToColor');
        mix = 0;
      };
      // start from a form sitting in its slot (the hand-over from the portrait layer)
      const startFrom = (start: Shape, next: Shape) => {
        const r = rectOf(start);
        if (!r) return retarget(next);
        const f = buffers.aFrom.data;
        for (let i = 0; i < N; i++) {
          f[i * 2] = r[0] + start.to[i * 2] * r[2];
          f[i * 2 + 1] = r[1] + start.to[i * 2 + 1] * r[3];
        }
        buffers.aFromColor.data.set(start.color);
        buffers.aTo.data.set(next.to);
        buffers.aToColor.data.set(next.color);
        upload('aFrom', 'aTo', 'aFromColor', 'aToColor');
        alpha = 1;
        mix = 0;
      };
      const homeForm = () => ((document.querySelector('#servicos')?.getBoundingClientRect().top ?? 0) > 0 ? home.above : home.below);

      let pairIndex = -1;
      let pairSince = 0;
      const current = (now: number): { key: string; shape: Shape } | null => {
        const vh = innerHeight;
        for (const st of stages) {
          const el = document.querySelector<HTMLElement>(st.el);
          const r = el?.getBoundingClientRect();
          if (!el || !r || r.top > vh * 0.5 || r.bottom < vh * 0.5) continue;
          const i = Number(el.dataset.index ?? 0);
          if (st.pairs) {
            if (i !== pairIndex) {
              pairIndex = i;
              pairSince = now;
            }
            const half = Math.floor((now - pairSince) / PAIR_MS) % 2;
            return { key: `${st.el}-${i}-${half}`, shape: st.pairs[i][half] };
          }
          return { key: `${st.el}-${i}`, shape: st.forms![Math.min(i, st.forms!.length - 1)] };
        }
        return null;
      };

      let last = performance.now();
      stop = onFrame((now) => {
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        let target = current(now);
        if (target && !key) {
          startFrom(homeForm(), target.shape);
          key = target.key;
        }
        if (!target && key) {
          const h = homeForm();
          const homeKey = h === home.above ? 'home-above' : 'home-below';
          if (key !== homeKey) {
            retarget(h);
            key = homeKey;
          }
          if (mix >= 1) {
            key = null;
            alpha = 0;
            gl.clear(gl.COLOR_BUFFER_BIT);
          } else target = { key: homeKey, shape: h };
        }
        root.classList.toggle('dots-active', !!key);
        root.classList.toggle('dots-over', !!key && !!target?.shape.over);
        if (!key || !target) return;
        if (target.key !== key) {
          retarget(target.shape);
          key = target.key;
        }
        mix = Math.min(1, mix + dt / MORPH_S);
        const r = rectOf(target.shape);
        if (r) rect = r;

        gl.disable(gl.SCISSOR_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const clip = target.shape.clip && document.querySelector(target.shape.clip)?.getBoundingClientRect();
        if (clip) {
          gl.enable(gl.SCISSOR_TEST);
          gl.scissor(clip.left * dpr, (innerHeight - clip.bottom) * dpr, clip.width * dpr, clip.height * dpr);
        }
        gl.uniform4f(U.rect, ...rect);
        gl.uniform2f(U.view, innerWidth, innerHeight);
        gl.uniform2f(U.mouse, mouse.x, mouse.y);
        gl.uniform1f(U.mix, mix);
        gl.uniform1f(U.time, now / 1000);
        gl.uniform1f(U.size, (target.shape.grid ? (rect[2] / GRID_W) * 1.14 : DOT_PX) * dpr);
        gl.uniform1f(U.alpha, alpha);
        gl.drawArrays(gl.POINTS, 0, N);
      });

      const stopFrame = stop;
      stop = () => {
        stopFrame();
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onMove);
        root.classList.remove('dots-active', 'dots-over');
      };
    })().catch(() => canvas.remove());

    return () => {
      disposed = true;
      stop();
      canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return null;
}
