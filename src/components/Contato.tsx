import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';
import { ExternalIcon } from './ExternalIcon';

export function Contato({ contato }: { contato: Content['contato'] }) {
  return (
    <section aria-labelledby="contato-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="contato-titulo" label={contato.label} heading={contato.heading} />

      <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-areia-mudo md:text-lg">{contato.lead}</p>

      <ul className="mt-12 border-t border-areia/15">
        {contato.links.map((link) => {
          const isExternal = link.href.startsWith('http');

          return (
            <li key={link.label}>
              <a
                href={link.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-areia/15 py-5 transition-colors hover:bg-painel"
              >
                <span className="font-display text-2xl font-bold tracking-[-0.03em] group-hover:text-cobalto-claro md:text-3xl">
                  {link.label}
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-sm text-areia-mudo">
                  {link.value}
                  {isExternal ? <ExternalIcon /> : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <a
        href="/curriculo-yago-ramires.pdf"
        download
        className="mt-12 inline-block bg-cobalto px-7 py-4 font-mono text-xs tracking-[0.14em] text-areia uppercase transition-transform hover:-translate-y-0.5"
      >
        {contato.resume}
      </a>
    </section>
  );
}
