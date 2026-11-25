'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { Content } from '@/content';
import { onFrame } from '@/lib/motion';
import { SectionHeading } from './SectionHeading';

type Props = { perfil: Content['perfil']; aside: string };

const SINCE = 2021;

export function Perfil({ perfil, aside }: Props) {
  const section = useRef<HTMLElement>(null);
  const words = [
    ...perfil.heading.split(' ').map((text, i, all) => ({ text: i === all.length - 1 ? `${text}.` : text, bold: true })),
    ...perfil.body.split(' ').map((text) => ({ text, bold: false })),
  ];
  const years = String(new Date().getFullYear() - SINCE);

  // words ink in as the section rises: word g goes 45% → 100% over its slice of the scroll
  useEffect(() => {
    const el = section.current!;
    const spans = [...el.querySelectorAll<HTMLElement>('.js-word')];
    let last = -1;
    return onFrame(() => {
      const p = Math.max(0, Math.min(1, (innerHeight - el.getBoundingClientRect().top) / innerHeight));
      if (Math.abs(p - last) <= 0.004) return;
      last = p;
      spans.forEach((s, g) => {
        const mix = 0.45 + Math.max(0, Math.min(1, (p - (g / spans.length) * 0.65) / 0.3)) * 0.55;
        s.style.color = `color-mix(in srgb, var(--fg) ${Math.round(mix * 100)}%, transparent)`;
      });
    });
  }, []);

  return (
    <section
      ref={section}
      id="perfil"
      aria-labelledby="perfil-titulo"
      data-theme="light"
      data-chapter={`(01) ${perfil.label}`}
      className="gutter py-24 md:py-32"
    >
      <SectionHeading index="01" label={perfil.label} aside={aside} />

      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
        <h2 id="perfil-titulo" className="sr-only">
          {perfil.heading}
        </h2>
        <p aria-hidden="true" className="light-display text-step-4 lg:col-span-9">
          {words.map((w, i) => (
            <span key={i} className={`js-word ${w.bold ? 'font-display font-extrabold tracking-[-0.04em]' : ''}`}>
              {w.text}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        <p className="sr-only">{perfil.body}</p>
        <div aria-hidden="true" className="form-slot hidden h-72 lg:col-span-3 lg:block" />
      </div>

      <ul className="mt-24 grid grid-cols-2 gap-y-10 border-line lg:grid-cols-4">
        {perfil.stats.map((s, i) => (
          <li
            key={s.label}
            data-reveal=""
            style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
            className="border-line pr-6 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0"
          >
            <p className="display text-step-6">
              {s.value.replace('{years}', years)}
              {s.unit && <span className="light-display ml-2 text-step-2">{s.unit}</span>}
            </p>
            <p className="mt-2 text-sm text-fg-muted">{s.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
