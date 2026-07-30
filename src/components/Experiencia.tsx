import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';

export function Experiencia({ experiencia }: { experiencia: Content['experiencia'] }) {
  return (
    <section aria-labelledby="experiencia-titulo" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHeading id="experiencia-titulo" label={experiencia.label} heading={experiencia.heading} />

      <ol className="mt-14 border-l border-areia/15">
        {experiencia.items.map((item) => (
          <li key={`${item.company}-${item.period}`} className="relative pb-14 pl-6 last:pb-0 md:pl-10">
            <span aria-hidden="true" className="absolute top-2 -left-[5px] h-2.5 w-2.5 rounded-full bg-cobalto" />

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">{item.role}</h3>
              <p className="text-base text-cobalto-claro">{item.company}</p>
            </div>

            <p className="mt-2 font-mono text-xs tracking-[0.08em] text-areia-mudo uppercase">
              {item.period} · {item.mode}
            </p>

            <ul className="mt-5 space-y-3">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="max-w-[58ch] text-sm leading-relaxed text-areia-mudo md:text-base">
                  {bullet}
                </li>
              ))}
            </ul>

            <p className="mt-5 font-mono text-xs text-areia-mudo/80">{item.stack}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
