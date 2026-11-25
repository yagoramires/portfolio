import type { CSSProperties } from 'react';
import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';
import { Split } from './Split';
import { RioClock } from './Hero';

type Props = { contato: Content['contato']; ui: Content['ui']; footer: string; index: string };

export function Contato({ contato, ui, footer, index }: Props) {
  const social = contato.links.filter((l) => l.href.startsWith('http'));

  return (
    <footer
      id="contato"
      aria-labelledby="contato-titulo"
      data-theme="dark"
      data-chapter={`(${index}) ${contato.label}`}
      className="overflow-hidden pt-24 md:pt-32"
    >
      <div className="gutter">
        <SectionHeading index={index} label={contato.label} aside={ui.asides.contato} />

        <p data-reveal="" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm">
          <span aria-hidden="true" className="pulse h-2 w-2 rounded-full bg-[#3ddc84] [--pulse-color:#3ddc84]" />
          {ui.available}
        </p>

        <Split
          as="h2"
          id="contato-titulo"
          prox
          text={contato.heading}
          className="display mt-10 max-w-[64rem] text-step-7 md:ml-[var(--index-col)]"
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8">
            <p
              data-reveal=""
              style={{ '--reveal-delay': '100ms' } as CSSProperties}
              className="max-w-[40ch] text-step-1 leading-snug text-fg-muted"
            >
              {contato.lead}
            </p>
            <ul data-reveal="" style={{ '--reveal-delay': '200ms' } as CSSProperties} className="mt-10 flex flex-wrap gap-3">
              {contato.links.map((link) => {
                const external = link.href.startsWith('http');
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      data-fill
                      className="inline-flex rounded-full border border-line px-6 py-3.5 text-sm"
                    >
                      <span className="text-fg-muted">{link.label}</span>&nbsp;&nbsp;{link.value}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end">
            <a
              href="/curriculo-yago-ramires.pdf"
              download
              data-magnetic="0.3"
              className="grid aspect-square w-48 place-items-center rounded-full bg-cobalto p-8 text-center text-sm text-white transition-colors hover:bg-[#4463ff]"
            >
              <span className="flex flex-col items-center gap-2">
                {contato.resume}
                <span aria-hidden="true" className="text-lg">
                  ↓
                </span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-24 grid gap-8 border-t border-line pt-8 text-sm sm:grid-cols-3">
          <div>
            <p className="text-step--1 tracking-[0.12em] text-fg-muted uppercase">{ui.version}</p>
            <p className="mt-3 text-fg-muted">{footer}</p>
          </div>
          <div>
            <p className="text-step--1 tracking-[0.12em] text-fg-muted uppercase">{ui.localTime}</p>
            <p className="mt-3 tabular-nums">
              <RioClock />
            </p>
          </div>
          <div>
            <p className="text-step--1 tracking-[0.12em] text-fg-muted uppercase">{ui.elsewhere}</p>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {social.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent-text">
                  {l.label}
                </a>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="mt-16 overflow-hidden pb-24 whitespace-nowrap text-fg/15 select-none">
        <div className="marquee-track display inline-flex text-[clamp(5rem,16vw,16rem)] leading-[0.9]">
          {[0, 1].map((k) => (
            <span key={k} className="pr-[0.3em]">
              Yago Ramires ● Yago Ramires ●&nbsp;
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
