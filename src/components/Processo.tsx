'use client';

import { useRef, type CSSProperties } from 'react';
import type { Content } from '@/content';
import { scrollTo } from '@/lib/motion';
import { scrollToStep, useStageIndex } from '@/lib/useStageIndex';
import { Split } from './Split';

type Props = { processo: Content['processo']; label: string; skip: string };

/** How I work: pinned, one step lit at a time, its dot illustration on the left. */
export function Processo({ processo, label, skip }: Props) {
  const section = useRef<HTMLElement>(null);
  const index = useStageIndex(section, processo.items.length);
  const toEnd = () => {
    const el = section.current!;
    scrollTo(el.getBoundingClientRect().top + scrollY + el.offsetHeight, 1.2);
  };

  return (
    <section
      ref={section}
      id="processo"
      aria-labelledby="processo-titulo"
      data-theme="dark"
      data-chapter={`(02) ${label}`}
      className="stage relative"
      style={{ '--count': processo.items.length } as CSSProperties}
    >
      <div className="gutter flex flex-col py-24 lg:sticky lg:top-0 lg:h-screen lg:pt-20 lg:pb-24">
        <div className="grid min-h-0 flex-1 items-center gap-6 lg:grid-cols-12">
          <div aria-hidden="true" className="process-slot hidden lg:col-span-7 lg:block" />
          <Split as="h2" id="processo-titulo" prox text={processo.heading} className="display text-step-4 lg:col-span-5 lg:col-start-8" />
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-6 lg:grid-cols-12">
          {processo.items.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-1 border-t-2 pt-3 transition-colors duration-400 lg:col-span-2"
              style={{
                borderColor: i === index ? 'var(--fg)' : i < index ? 'var(--fg-muted)' : 'var(--line)',
                color: i === index ? 'var(--fg)' : 'var(--fg-muted)',
              }}
            >
              <button type="button" onClick={() => scrollToStep(section.current!, i, processo.items.length)} className="flex flex-col gap-1 text-left">
                <span className="text-step--1 text-fg-muted">0{i + 1}</span>
                <span className="font-display text-[min(var(--text-step-2),1.9vw)] font-bold tracking-[-0.02em] max-lg:text-step-2">{step.title}</span>
                <span className="text-sm leading-snug">{step.text}</span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" onClick={toEnd} className="mt-4 hidden self-start text-sm text-fg-muted hover:text-fg lg:block">
          {skip} <span aria-hidden="true">↘</span>
        </button>
      </div>
    </section>
  );
}
