import type { Content } from '@/content';

export function Header({ nav }: { nav: Content['nav'] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-areia/10 bg-breu/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#topo"
          aria-label={nav.brandAria}
          className="font-mono text-xs tracking-[0.18em] text-areia-mudo uppercase"
        >
          Yago Ramires
        </a>
        <a
          href={`/${nav.otherLocale}`}
          aria-label={nav.otherLocaleAria}
          className="rounded-full border border-areia/25 px-3 py-1 font-mono text-xs tracking-[0.14em] text-areia transition-colors hover:border-cobalto-claro hover:text-cobalto-claro"
        >
          {nav.otherLocaleLabel}
        </a>
      </div>
    </header>
  );
}
