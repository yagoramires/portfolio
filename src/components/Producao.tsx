import type { Content } from '@/content';
import { cases } from '@/content/projects';
import { SectionHeading } from './SectionHeading';
import { ExternalIcon } from './ExternalIcon';

export function Producao({ producao }: { producao: Content['producao'] }) {
  return (
    <section aria-labelledby="producao-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="producao-titulo" label={producao.label} heading={producao.heading} />

      <p className="reveal mt-6 max-w-[52ch] text-base leading-relaxed text-areia-mudo">{producao.intro}</p>

      <div className="mt-14 space-y-6">
        {cases.map((item) => {
          const copy = producao.cases[item.slug];

          return (
            <a
              key={item.slug}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl bg-painel p-8 transition-transform duration-300 hover:-translate-y-1 md:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-cobalto transition-all duration-300 group-hover:w-2"
              />

              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em] md:text-4xl">{item.name}</h3>
                  <p className="mt-2 font-mono text-xs tracking-[0.1em] text-cobalto-claro uppercase">{item.client}</p>
                  <p className="mt-1 font-mono text-xs tracking-[0.08em] text-areia-mudo uppercase">{copy.role}</p>
                </div>
                <span className="rounded-full border border-areia/20 px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-areia-mudo uppercase">
                  {producao.closedSource}
                </span>
              </div>

              <p className="mt-6 max-w-[58ch] text-sm leading-relaxed text-areia-mudo md:text-base">
                {copy.description}
              </p>

              <p className="mt-6 font-mono text-xs text-areia-mudo">{item.stack.join(' · ')}</p>

              <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-areia uppercase group-hover:text-cobalto-claro">
                {producao.visit}
                <ExternalIcon />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
