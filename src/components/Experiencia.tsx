'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Content } from '@/content';
import { getLenis, onFrame, prefersReducedMotion } from '@/lib/motion';
import { SectionHeading } from './SectionHeading';

type Props = {
  experiencia: Content['experiencia'];
  ui: Content['ui'];
  tools: string[];
};

const MARQUEE_SPEED = 0.6;

export function Experiencia({ experiencia, ui, tools }: Props) {
  // oldest first, like the reference; the first item in content is the current role
  const items = experiencia.items
    .map((item, i) => ({ ...item, year: Number(item.period.match(/\d{4}/)?.[0] ?? 0), current: i === 0 }))
    .reverse();
  const firstYear = Math.min(...items.map((i) => i.year));
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // active item = the one nearest the viewport centre; the rule fills between first and last centre
  useEffect(() => {
    const els = [...list.current!.querySelectorAll<HTMLElement>('.js-item')];
    return onFrame(() => {
      const mid = innerHeight / 2;
      const centres = els.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let best = 0;
      centres.forEach((c, i) => Math.abs(c - mid) < Math.abs(centres[best] - mid) && (best = i));
      setActive(best);
      const first = centres[0];
      const last = centres[centres.length - 1];
      const p = last === first ? 1 : Math.min(1, Math.max(0, (mid - first) / (last - first)));
      fill.current!.style.transform = `scaleY(${p.toFixed(4)})`;
    });
  }, []);

  // marquee drifts on its own and speeds up / skews with scroll velocity
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = track.current!;
    let x = 0;
    let skew = 0;
    return onFrame(() => {
      const v = getLenis()?.velocity ?? 0;
      const half = el.scrollWidth / 2;
      x -= (MARQUEE_SPEED + Math.abs(v) * 0.35) * (v < 0 ? -1 : 1);
      if (x <= -half) x += half;
      else if (x > 0) x -= half;
      skew += (Math.max(-12, Math.min(12, -v * 0.4)) - skew) * 0.1;
      el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    });
  }, []);

  const current = items[active];
  const years = new Date().getFullYear() - firstYear;

  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-titulo"
      data-theme="dark"
      data-chapter={`(02) ${experiencia.label}`}
      className="py-24 md:py-32"
    >
      <div className="gutter">
        <SectionHeading index="02" label={experiencia.label} aside={ui.asides.experiencia} />
        <div className="grid items-center gap-6 lg:grid-cols-12">
        <h2
          id="experiencia-titulo"
          data-reveal=""
          style={{ '--reveal-delay': '80ms' } as CSSProperties}
          className="light-display text-step-5 lg:col-span-9"
        >
          {experiencia.heading}
        </h2>
          <div aria-hidden="true" className="form-slot hidden h-64 lg:col-span-3 lg:block" />
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:sticky lg:top-[calc(50vh-11rem)] lg:col-span-6 lg:self-start">
            <p className="display flex text-step-year" aria-hidden="true">
              {[...String(current.year)].map((d, i) => (
                <span key={i} className="block h-[1em] w-[0.63em] overflow-hidden text-center">
                  <span className="exp-strip" style={{ '--digit': d } as CSSProperties}>
                    {Array.from({ length: 10 }, (_, n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </span>
                </span>
              ))}
            </p>
            <p className="mt-6 flex items-center gap-3 text-step-2 text-fg-muted">
              {current.current ? ui.yearsIn.replace('{n}', String(years)) : ui.yearN.replace('{n}', String(current.year - firstYear + 1))}
              <em
                className="rounded-full bg-cobalto px-2 py-0.5 text-[0.7rem] font-bold tracking-[0.12em] text-white not-italic uppercase transition-[opacity,transform] duration-500"
                style={{ opacity: current.current ? 1 : 0, transform: current.current ? 'none' : 'translateY(6px)' }}
              >
                {ui.now}
              </em>
            </p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p data-reveal="" className="text-step--1 font-bold tracking-[0.2em] uppercase">
              {ui.history}
            </p>
            <ol ref={list} className="relative mt-6 border-l border-line pl-8">
              <span aria-hidden="true" className="absolute top-0 -left-px h-full w-px">
                <span ref={fill} className="block h-full origin-top scale-y-0 bg-fg" />
              </span>
              {items.map((item, i) => (
                <li
                  key={`${item.company}-${item.period}`}
                  className="js-item relative flex min-h-[32vh] flex-col justify-center py-10 transition-colors duration-400"
                  style={{ color: i === active ? 'var(--fg)' : 'var(--fg-muted)' }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -left-[calc(2rem+5px)] -mt-[4.5px] h-[9px] w-[9px] rounded-full border transition-colors duration-300"
                    style={{
                      background: i <= active ? 'var(--color-cobalto)' : 'var(--canvas)',
                      borderColor: i <= active ? 'var(--color-cobalto)' : 'var(--fg-muted)',
                    }}
                  />
                  <span className="flex items-center gap-2 text-sm">
                    {item.period}
                    {item.current && (
                      <em className="rounded-full bg-cobalto px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.12em] text-white not-italic uppercase">
                        {ui.now}
                      </em>
                    )}
                  </span>
                  <h3 className="display mt-3 text-step-3">{item.role}</h3>
                  <p className="mt-2 text-sm">
                    {item.company} <span className="text-fg-muted">· {item.mode}</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {item.bullets.map((b) => (
                      <li key={b} className="max-w-[52ch] text-sm leading-relaxed text-fg-muted">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-fg-muted">{item.stack}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div role="group" aria-label="Stack" className="toolkit mt-32 overflow-hidden border-y border-line py-6">
        <div ref={track} className="flex w-max will-change-transform">
          {[0, 1].map((k) => (
            <span key={k} aria-hidden={k === 1} className="flex">
              {tools.map((t) => (
                <span key={t} className="tool inline-flex items-center text-step-2 tracking-[-0.02em] text-fg-muted">
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
