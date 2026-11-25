'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { Content } from '@/content';
import { work } from '@/content/projects';
import { onFrame, scrollTo } from '@/lib/motion';
import { useStageIndex } from '@/lib/useStageIndex';
import { SectionHeading } from './SectionHeading';

type Props = { trabalhos: Content['trabalhos']; aside: string; skip: string };

/** Selected work: pinned for 38vh per project; each project's screen fills the stage as dots. */
export function Trabalhos({ trabalhos, aside, skip }: Props) {
  const section = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const index = useStageIndex(section, work.length);
  const active = work[index];
  const pad = (n: number) => String(n).padStart(2, '0');

  // "Visit" disc trails the pointer over the image
  useEffect(() => {
    const el = cursor.current!;
    const target = { x: 0, y: 0, on: false };
    const pos = { x: 0, y: 0, s: 0 };
    const slot = section.current!.querySelector<HTMLElement>('.work-slot')!;
    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.on = e.pointerType === 'mouse';
    };
    const leave = () => (target.on = false);
    slot.addEventListener('pointermove', move);
    slot.addEventListener('pointerleave', leave);
    const stop = onFrame(() => {
      if (!pos.s) {
        pos.x = target.x;
        pos.y = target.y;
      }
      pos.x += (target.x - pos.x) * 0.14;
      pos.y += (target.y - pos.y) * 0.14;
      pos.s += ((target.on ? 1 : 0) - pos.s) * 0.18;
      if (pos.s < 0.01) pos.s = 0;
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${pos.s.toFixed(3)})`;
    });
    return () => {
      stop();
      slot.removeEventListener('pointermove', move);
      slot.removeEventListener('pointerleave', leave);
    };
  }, []);

  const toEnd = () => {
    const el = section.current!;
    scrollTo(el.getBoundingClientRect().top + scrollY + el.offsetHeight, 1.2);
  };

  return (
    <section
      ref={section}
      id="trabalhos"
      aria-labelledby="trabalhos-titulo"
      data-theme="dark"
      data-chapter={`(03) ${trabalhos.label}`}
      className="stage-work relative"
      style={{ '--count': work.length } as CSSProperties}
    >
      <div className="dw-stage gutter relative flex flex-col justify-between overflow-hidden py-24 lg:sticky lg:top-0 lg:h-screen lg:py-10">
        <a
          href={active.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={trabalhos.visitAria.replace('{project}', active.name)}
          className="work-slot absolute top-1/2 left-1/2 hidden aspect-[16/10] w-[max(100vw,160vh)] -translate-x-1/2 -translate-y-1/2 cursor-none lg:block"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_bottom,#121110,rgb(18_17_16/0.7)_10%,transparent_30%),linear-gradient(to_top,#121110,rgb(18_17_16/0.85)_25%,transparent_60%)] lg:block" />

        <div className="relative">
          <SectionHeading index="03" label={trabalhos.label} aside={aside} className="mb-0" />
        </div>

        <ul className="relative mt-12 space-y-10 lg:hidden">
          {work.map((w) => (
            <li key={w.slug}>
              <a href={w.url} target="_blank" rel="noopener noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.image} alt="" loading="lazy" className="aspect-[16/10] w-full rounded-xl object-cover" />
                <span className="display mt-4 block text-step-5">{w.name}</span>
              </a>
              <p className="mt-2 text-sm text-fg-muted">{trabalhos.items[w.slug].meta}</p>
              <p className="mt-2">{trabalhos.items[w.slug].description}</p>
            </li>
          ))}
        </ul>

        <div className="relative hidden items-end gap-6 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 flex justify-between text-sm text-fg-muted">
              <span id="trabalhos-titulo">{trabalhos.heading}</span>
              <span className="text-fg tabular-nums lg:hidden">
                {pad(index + 1)} / {pad(work.length)}
              </span>
            </p>
            <ol className="grid">
              {work.map((w, i) => (
                <li
                  key={w.slug}
                  className="col-start-1 row-start-1 self-end overflow-hidden"
                  style={{ visibility: i === index ? 'visible' : 'hidden', transition: `visibility 0s linear ${i === index ? '0s' : '0.3s'}` }}
                >
                  <span
                    className="display block pb-[0.12em] text-[min(var(--text-step-7),15vh)] leading-[0.98]"
                    style={{
                      transform: i === index ? 'none' : 'translateY(110%)',
                      transition: i === index ? 'transform 0.8s var(--ease-out-expo) 0.15s' : 'transform 0.3s ease',
                    }}
                  >
                    {w.name}
                  </span>
                </li>
              ))}
            </ol>
            <button type="button" onClick={toEnd} className="mt-2 hidden text-sm text-fg-muted hover:text-fg lg:block">
              {skip} <span aria-hidden="true">↘</span>
            </button>
          </div>
          <div key={index} className="stage-fade min-h-[7.5rem] lg:col-span-4 lg:pb-14">
            <p className="mb-3 hidden justify-between text-sm text-fg-muted lg:flex">
              <span>{trabalhos.items[active.slug].meta}</span>
              <span className="text-fg tabular-nums">
                {pad(index + 1)} / {pad(work.length)}
              </span>
            </p>
            <p className="text-step-1 leading-snug">{trabalhos.items[active.slug].description}</p>
            <a href={active.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
              {trabalhos.visit} {active.name} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <span
          ref={cursor}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-10 grid h-24 w-24 place-items-center rounded-full bg-cobalto text-sm text-white"
          style={{ transform: 'scale(0)' }}
        >
          {trabalhos.visit} ↗
        </span>
      </div>
    </section>
  );
}
