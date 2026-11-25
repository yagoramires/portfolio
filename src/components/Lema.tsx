'use client';

import { useEffect, useRef } from 'react';
import type { Content } from '@/content';
import { canHover, onFrame } from '@/lib/motion';

const LENS_R = 200;

/** Motto: big centred line; a lens following the pointer reveals the honest version underneath. */
export function Lema({ lema }: { lema: Content['lema'] }) {
  const box = useRef<HTMLDivElement>(null);
  const shown = useRef<HTMLParagraphElement>(null);
  const hidden = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!canHover()) return;
    const el = box.current!;
    const lens = { x: 0, y: 0, tx: 0, ty: 0, r: 0, tr: 0, on: false };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      lens.tx = e.clientX - r.left;
      lens.ty = e.clientY - r.top;
      if (!lens.on) {
        lens.x = lens.tx;
        lens.y = lens.ty;
      }
      lens.on = true;
      lens.tr = LENS_R;
    };
    const leave = () => {
      lens.on = false;
      lens.tr = 0;
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    const stop = onFrame(() => {
      lens.x += (lens.tx - lens.x) * 0.12;
      lens.y += (lens.ty - lens.y) * 0.12;
      lens.r += (lens.tr - lens.r) * (lens.r < lens.tr ? 0.06 : 0.07);
      const r = lens.r < 0.5 ? 0 : lens.r;
      const at = `${lens.x.toFixed(1)}px ${lens.y.toFixed(1)}px`;
      hidden.current!.style.clipPath = `circle(${r.toFixed(1)}px at ${at})`;
      shown.current!.style.maskImage = r ? `radial-gradient(circle at ${at}, transparent ${r.toFixed(1)}px, #000 ${(r + 1).toFixed(1)}px)` : '';
      el.dataset.lens = r > 1 ? 'on' : '';
    });
    return () => {
      stop();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <section id="lema" aria-labelledby="lema-titulo" data-theme="dark" data-chapter={lema.label} className="gutter overflow-hidden py-32 text-center md:py-40">
      <p data-scramble="" className="lema-fade text-step--1 font-bold tracking-[0.2em] uppercase">
        {lema.label}
      </p>
      <div ref={box} className="group relative mx-auto mt-12 max-w-[80rem] cursor-default">
        <h2 id="lema-titulo" className="sr-only">
          {lema.line1} {lema.line2} {lema.accent} {lema.honest}
        </h2>
        <p ref={shown} aria-hidden="true" data-reveal="" className="display text-[clamp(3.5rem,11vw,11rem)] leading-[0.92] tracking-[-0.05em]">
          {lema.line1}
          <br />
          {lema.line2} <span className="text-cobalto-claro">{lema.accent}</span>
        </p>
        <p
          ref={hidden}
          aria-hidden="true"
          className="display absolute inset-0 grid place-items-center text-[clamp(3.5rem,11vw,11rem)] leading-[0.92] tracking-[-0.05em] text-cobalto-claro"
          style={{ clipPath: 'circle(0px at 50% 50%)' }}
        >
          {lema.honest}
        </p>
      </div>
      <p className="lema-fade mt-12 text-step--1 tracking-[0.04em] text-fg-muted">{lema.hint}</p>
    </section>
  );
}
