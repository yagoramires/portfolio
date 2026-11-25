'use client';

import { useEffect, useRef, useState } from 'react';
import type { Content } from '@/content';
import { projects } from '@/content/projects';
import { prefersReducedMotion } from '@/lib/motion';
import { SectionHeading } from './SectionHeading';

const AUTO_MS = 7500;

/** Apps of my own: accordion of cards, the open one in accent with its dot illustration; rotates while idle. */
export function Projetos({ projetos, aside }: { projetos: Content['projetos']; aside: string }) {
  const section = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const touched = useRef(0);

  useEffect(() => {
    section.current!.dataset.index = String(open);
  }, [open]);

  // rotate while idle: AUTO_MS after the last change, whether it came from the user or from the rotation
  useEffect(() => {
    if (prefersReducedMotion()) return;
    touched.current = performance.now();
    const t = setInterval(() => {
      if (performance.now() - touched.current < AUTO_MS) return;
      touched.current = performance.now();
      setOpen((i) => (i + 1) % projects.length);
    }, 250);
    return () => clearInterval(t);
  }, []);

  const choose = (i: number) => {
    touched.current = performance.now();
    setOpen(i);
  };

  return (
    <section
      ref={section}
      id="projetos"
      aria-labelledby="projetos-titulo"
      data-theme="dark"
      data-chapter={`(04) ${projetos.label}`}
      className="gutter flex flex-col py-24 lg:h-screen lg:min-h-[44rem] lg:py-20"
    >
      <SectionHeading index="04" label={projetos.label} aside={aside} className="mb-6 border-t" />
      <h2 id="projetos-titulo" className="display text-[min(var(--text-step-5),9vh)] max-lg:text-step-5">
        {projetos.heading}
      </h2>

      <ul className="mt-8 flex flex-1 flex-col gap-6 lg:min-h-[22rem] lg:flex-row">
        {projects.map((p, i) => {
          const copy = projetos.items[p.slug];
          const isOpen = i === open;
          return (
            <li
              key={p.slug}
              onPointerEnter={() => choose(i)}
              className={`as-panel relative overflow-hidden rounded-2xl border transition-[flex-basis,background-color,border-color] duration-700 ease-[var(--ease-in-out-quart)] max-lg:bg-cobalto lg:min-w-0 ${isOpen ? 'is-open border-cobalto bg-cobalto lg:flex-[0_0_calc(8*var(--index-col)-24px)]' : 'border-line lg:flex-[0_0_calc(2*var(--index-col)-24px)]'}`}
            >
              <button
                type="button"
                onClick={() => choose(i)}
                aria-expanded={isOpen}
                className="absolute inset-0 hidden flex-col items-start justify-between p-6 text-left text-fg transition-opacity hover:bg-fg/5 lg:flex"
                style={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? 'none' : 'auto' }}
              >
                <span className="text-step--1">0{i + 1}</span>
                <span className="display rotate-180 text-[min(var(--text-step-5),7.5vh)] whitespace-nowrap [writing-mode:vertical-rl]">{p.name}</span>
              </button>
              <span aria-hidden="true" className="pulse absolute top-6 right-6 hidden h-2 w-2 rounded-full bg-cobalto [--pulse-size:10px] lg:block" style={{ opacity: isOpen ? 0 : 1 }} />

              <div
                className={`flex h-full flex-col p-6 text-white lg:absolute lg:inset-y-0 lg:left-0 lg:w-[calc(8*var(--index-col)-24px)] lg:transition-[opacity,visibility] lg:duration-500 ${isOpen ? 'lg:visible lg:opacity-100 lg:delay-300' : 'lg:invisible lg:opacity-0'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="display text-[min(var(--text-step-6),11vh)] max-lg:text-step-5 lg:transition-transform lg:duration-800"
                    style={{ transform: isOpen ? 'none' : 'translateY(16px)' }}
                  >
                    {p.name}
                  </h3>
                  <span className="text-step--1">0{i + 1}</span>
                </div>
                <div className="mt-auto grid items-end gap-6 lg:grid-cols-[calc(3*var(--index-col)-48px)_minmax(0,1fr)]">
                  <div>
                    <p className="text-step-1 leading-snug">{copy.description}</p>
                    <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-step--1">
                      {p.stack.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </p>
                    <p className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={projetos.codeAria.replace('{project}', p.name)}
                        className="rounded-full bg-areia px-3 py-1 text-breu"
                      >
                        {projetos.codeLabel} ↗
                      </a>
                      {p.demo ? (
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={projetos.demoAria.replace('{project}', p.name)}
                          className="inline-flex items-center gap-2"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
                          {projetos.demoLabel}
                        </a>
                      ) : (
                        <span className="opacity-70">{projetos.noDemo}</span>
                      )}
                    </p>
                  </div>
                  <div aria-hidden="true" className="apps-slot hidden aspect-[16/10] w-full max-w-[min(100%,52vh)] justify-self-end lg:block" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
