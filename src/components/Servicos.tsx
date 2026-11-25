'use client';

import { useRef, type CSSProperties } from 'react';
import type { Content } from '@/content';
import { scrollTo } from '@/lib/motion';
import { scrollToStep, useStageIndex } from '@/lib/useStageIndex';
import { SectionHeading } from './SectionHeading';

type Props = { servicos: Content['servicos']; items: Content['perfil']['pillars']; aside: string };

/** "What I do": pinned for 30vh per item, one item at a time, with its dot illustration on the right. */
export function Servicos({ servicos, items, aside }: Props) {
  const section = useRef<HTMLElement>(null);
  const index = useStageIndex(section, items.length);
  const active = items[index];
  const skip = () => {
    const el = section.current!;
    scrollTo(el.getBoundingClientRect().top + scrollY + el.offsetHeight, 1.2);
  };

  return (
    <section
      ref={section}
      id="servicos"
      aria-labelledby="servicos-titulo"
      data-theme="light"
      data-chapter={`(02) ${servicos.label}`}
      className="stage relative"
      style={{ '--count': items.length } as CSSProperties}
    >
      <div className="gutter flex flex-col py-24 lg:sticky lg:top-0 lg:h-screen lg:pt-[5.5rem] lg:pb-[4.5rem]">
        <SectionHeading index="02" label={servicos.label} aside={aside} className="mb-10 border-t lg:mb-6" />

        <div className="grid min-h-0 flex-1 items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="servicos-titulo" className="max-w-[30em] text-fg-muted">
              {servicos.intro}
            </h2>
            {/* desktop: the active item; mobile: all of them */}
            <div key={index} className="stage-roll mt-12 hidden lg:block" aria-live="polite">
              <h3 className="display text-step-6">{active.title}</h3>
              <p className="mt-6 max-w-[34em] text-step-1 leading-snug">{active.text}</p>
            </div>
            <ul className="mt-10 space-y-10 lg:hidden">
              {items.map((it) => (
                <li key={it.title}>
                  <h3 className="display text-step-5">{it.title}</h3>
                  <p className="mt-3 text-fg-muted">{it.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div aria-hidden="true" className="services-slot hidden lg:col-span-7 lg:col-start-6 lg:block" />
        </div>

        <ol className="mt-6 hidden grid-cols-12 gap-6 lg:grid">
          {items.map((it, i) => (
            <li
              key={it.title}
              className="col-span-4 border-t-2 pt-3 transition-colors duration-400"
              style={{ borderColor: i <= index ? 'var(--fg)' : 'var(--line)' }}
            >
              <button
                type="button"
                aria-current={i === index ? 'step' : undefined}
                onClick={() => scrollToStep(section.current!, i, items.length)}
                className="text-left text-sm transition-colors hover:text-fg"
                style={{ color: i === index ? 'var(--fg)' : 'var(--fg-muted)' }}
              >
                <span className="block text-step--1 text-fg-muted">0{i + 1}</span>
                {it.title}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" onClick={skip} className="mt-4 hidden self-start text-sm text-fg-muted hover:text-fg lg:block">
          {servicos.skip} <span aria-hidden="true">↘</span>
        </button>
      </div>
    </section>
  );
}
