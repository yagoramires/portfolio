import type { CSSProperties } from 'react';
import type { Content } from '@/content';

export function Hero({ hero }: { hero: Content['hero'] }) {
  return (
    <section id="topo" aria-labelledby="hero-nome" className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
      <p
        className="anim-rise font-mono text-[0.7rem] tracking-[0.18em] text-cobalto-claro uppercase"
        style={{ '--delay': '80ms' } as CSSProperties}
      >
        {hero.eyebrow}
      </p>

      <h1
        id="hero-nome"
        className="mt-8 font-display leading-[0.86] font-extrabold tracking-[-0.045em]"
        style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)' }}
      >
        <span className="anim-clip block" style={{ '--delay': '180ms' } as CSSProperties}>
          {hero.nameTop}
        </span>
        <span
          className="anim-clip mt-1 inline-block bg-cobalto px-[0.12em] pb-[0.04em] text-areia"
          style={{ '--delay': '320ms' } as CSSProperties}
        >
          {hero.nameBottom}
        </span>
      </h1>

      <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-end">
        <p
          className="anim-rise max-w-[46ch] text-base leading-relaxed text-areia-mudo md:text-lg"
          style={{ '--delay': '460ms' } as CSSProperties}
        >
          {hero.lead}
        </p>

        <div
          className="anim-rise border-l-2 border-cobalto pl-5"
          style={{ '--delay': '580ms' } as CSSProperties}
        >
          <p className="font-display text-5xl leading-none font-extrabold tracking-[-0.04em] md:text-6xl">
            {hero.statValue}
          </p>
          <p className="mt-2 max-w-[22ch] font-mono text-xs leading-relaxed text-areia-mudo">{hero.statLabel}</p>
        </div>
      </div>
    </section>
  );
}
