import type { Content } from '@/content';
import { SectionHeading } from './SectionHeading';
import { Split } from './Split';

/** Off the clock: what's on repeat and what I'm playing. Hidden until content.ts has music or games. */
export function Fora({ fora, index }: { fora: Content['fora']; index: string }) {
  if (!fora.spotifyEmbed && fora.games.length === 0) return null;

  return (
    <section id="fora" aria-labelledby="fora-titulo" data-theme="light" data-chapter={`(${index}) ${fora.label}`} className="gutter py-24 md:py-32">
      <SectionHeading index={index} label={fora.label} aside={fora.aside} />
      <div className="grid items-center gap-6 lg:grid-cols-12">
        <Split as="h2" id="fora-titulo" prox text={fora.heading} className="display text-step-6 lg:col-span-9" />
        <div aria-hidden="true" className="form-slot hidden h-48 lg:col-span-3 lg:block" />
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:gap-6">
        {fora.spotifyEmbed && (
          <div data-reveal="" className="lg:col-span-6">
            <p className="text-step--1 font-bold tracking-[0.2em] uppercase">{fora.musicLabel}</p>
            <iframe
              title={fora.musicLabel}
              src={fora.spotifyEmbed}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="mt-6 h-[152px] w-full rounded-xl border-0"
            />
          </div>
        )}
        {fora.games.length > 0 && (
          <div data-reveal="" className="lg:col-span-6 lg:col-start-7">
            <p className="text-step--1 font-bold tracking-[0.2em] uppercase">{fora.gamesLabel}</p>
            <ul className="mt-6 border-t border-line">
              {fora.games.map((g) => (
                <li key={g.title} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-line py-4">
                  <span className="display text-step-2">{g.title}</span>
                  <em
                    className={`rounded-full px-2.5 py-0.5 text-step--1 font-bold tracking-[0.12em] not-italic uppercase ${g.status === 'now' ? 'bg-cobalto text-white' : 'text-accent-text shadow-[inset_0_0_0_1px_var(--color-cobalto)]'}`}
                  >
                    {g.status === 'now' ? fora.now : fora.next}
                  </em>
                  <span className="col-span-2 text-sm text-fg-muted">{g.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
