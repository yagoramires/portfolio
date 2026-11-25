import type { CSSProperties } from 'react';
import type { Content } from '@/content';

const NAME = 'Yago Ramires';

type Props = { nav: Content['nav']; role: string; ui: Content['ui']; links: { href: string; label: string }[] };

export function Header({ nav, role, ui, links }: Props) {
  return (
    <header className="gutter absolute inset-x-0 top-0 z-30 flex h-20 items-center text-sm text-fg">
      <a
        href="#topo"
        aria-label={nav.brandAria}
        className="nav-anim logo flex items-center"
        style={{ '--d': 0 } as CSSProperties}
      >
        {[...NAME].map((ch, i) => (
          <span key={i} aria-hidden="true" className="roll" style={{ '--i': i } as CSSProperties}>
            <span className="roll-track">
              <span>{ch === ' ' ? ' ' : ch}</span>
              <span>{ch === ' ' ? ' ' : ch}</span>
            </span>
          </span>
        ))}
        <span aria-hidden="true" className="logo-dots ml-2 flex gap-[0.18em]">
          <i style={{ '--n': 0 } as CSSProperties} />
          <i style={{ '--n': 1 } as CSSProperties} />
        </span>
      </a>

      <p className="nav-anim ml-6 hidden text-fg-muted lg:block" style={{ '--d': 1 } as CSSProperties}>
        {role}
      </p>

      <a
        href="#contato"
        className="nav-anim ml-12 hidden items-center gap-2 lg:flex"
        style={{ '--d': 2 } as CSSProperties}
      >
        <span className="pulse h-1.5 w-1.5 rounded-full bg-[#3ddc84] [--pulse-color:#3ddc84]" aria-hidden="true" />
        {ui.available}
      </a>

      <ul className="ml-auto hidden gap-8 lg:flex">
        {links.map((link, i) => (
          <li key={link.href} className="nav-anim" style={{ '--d': i + 3 } as CSSProperties}>
            <a href={link.href} className="transition-opacity hover:opacity-60">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        data-menu-open
        data-fill
        aria-label={ui.menuOpen}
        className="nav-anim ml-auto flex items-center gap-3 rounded-full border border-fg/25 px-4 py-2 lg:ml-10"
        style={{ '--d': 7 } as CSSProperties}
      >
        {ui.menu}
        <span aria-hidden="true" className="flex gap-1">
          <i className="block h-[5px] w-[5px] rounded-full bg-current" />
          <i className="block h-[5px] w-[5px] rounded-full bg-current" />
        </span>
      </button>
    </header>
  );
}
