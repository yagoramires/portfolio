'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Content, Locale } from '@/content';
import { getLenis, onFrame, prefersReducedMotion, scrollTo } from '@/lib/motion';

type MenuLink = { href: string; label: string };
type Props = {
  locale: Locale;
  ui: Content['ui'];
  links: MenuLink[];
  contacts: Content['contato']['links'];
};

/** Fixed page furniture: full-screen menu, floating menu button, dock, chapter label, scroll rail, grain. */
export function Chrome({ locale, ui, links, contacts }: Props) {
  return (
    <>
      <Menu ui={ui} links={links} contacts={contacts} />
      <Dock locale={locale} ui={ui} />
      <ChapterLabel />
      <Hourglass />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

type MenuState = 'closed' | 'open' | 'closing';

function Menu({ ui, links, contacts }: Omit<Props, 'locale'>) {
  const [state, setState] = useState<MenuState>('closed');
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [floating, setFloating] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  // any [data-menu-open] button opens the menu from its own centre
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>('[data-menu-open]');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      opener.current = btn;
      setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      setState('open');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => onFrame(() => setFloating(window.scrollY > 150)), []);

  useEffect(() => {
    if (state === 'open') {
      getLenis()?.stop();
      panel.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    if (state === 'closing') {
      // bg runs 650ms reversed after a 100ms delay
      const t = setTimeout(() => {
        setState('closed');
        getLenis()?.start();
        opener.current?.focus({ preventScroll: true });
      }, prefersReducedMotion() ? 0 : 750);
      return () => clearTimeout(t);
    }
  }, [state]);

  const close = () => setState((s) => (s === 'open' ? 'closing' : s));
  const go = (href: string) => {
    close();
    setTimeout(() => scrollTo(href), 350);
  };

  return (
    <>
      <button
        type="button"
        data-menu-open
        aria-label={ui.menuOpen}
        className="fixed right-[var(--gutter)] bottom-[4.75rem] z-40 grid h-[49px] w-[49px] place-items-center rounded-full bg-cobalto text-white transition-[opacity,transform] duration-[350ms] ease-[var(--ease-spring)] md:right-9 md:bottom-9"
        style={{
          opacity: floating && state === 'closed' ? 1 : 0,
          transform: floating && state === 'closed' ? 'none' : 'translateY(16px) scale(0.9)',
          pointerEvents: floating && state === 'closed' ? 'auto' : 'none',
        }}
      >
        <span aria-hidden="true" className="flex flex-col gap-[5px]">
          <i className="block h-px w-4 bg-current" />
          <i className="block h-px w-4 bg-current" />
        </span>
      </button>

      {state !== 'closed' && (
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={ui.menuLabel}
          data-state={state}
          className="menu fixed inset-0 z-50 flex flex-col text-areia"
          style={{ '--ox': `${origin.x}px`, '--oy': `${origin.y}px` } as CSSProperties}
        >
          <div className="menu-bg absolute inset-0 -z-10 bg-breu" />

          <div className="menu-bar gutter flex h-20 items-center justify-between text-sm">
            <span>Yago Ramires</span>
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-areia/25 px-4 py-2 transition-colors hover:border-areia"
            >
              {ui.menuClose}
            </button>
          </div>

          <nav className="gutter flex flex-1 items-center">
            <ul className="w-full">
              {links.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      go(link.href);
                    }}
                    className="group block outline-none"
                  >
                    <span
                      className="menu-link-inner grid grid-cols-[var(--index-col)_auto_1fr] items-center py-0.5"
                      style={{ '--i': i } as CSSProperties}
                    >
                      <span className="text-step--1 text-areia/60 group-hover:text-cobalto-claro group-focus-visible:text-cobalto-claro">
                        0{i + 1}
                      </span>
                      <span className="display text-step-5 leading-[0.95] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-[0.6rem] group-focus-visible:underline">
                        {link.label}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div aria-hidden="true" className="menu-marquee overflow-hidden whitespace-nowrap text-areia/10">
            <div className="marquee-track display inline-flex text-step-7">
              {[0, 1].map((k) => (
                <span key={k} className="pr-12">
                  {ui.marquee} · {ui.marquee} ·&nbsp;
                </span>
              ))}
            </div>
          </div>

          <div className="menu-bar gutter flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-areia/15 py-6 text-sm text-areia/70">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="hover:text-areia"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Dock({ locale, ui }: { locale: Locale; ui: Content['ui'] }) {
  return (
    <nav
      aria-label={ui.dockLabel}
      className="dock-in fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-areia/12 bg-breu/80 p-1 text-sm text-areia backdrop-blur"
    >
      {(['en', 'pt'] as const).map((l) => (
        <a
          key={l}
          href={`/${l}`}
          hrefLang={l === 'pt' ? 'pt-BR' : 'en'}
          aria-current={l === locale ? 'page' : undefined}
          className={`grid h-[37px] min-w-[37px] place-items-center rounded-full px-2 uppercase transition-colors ${l === locale ? 'bg-areia/90 text-breu' : 'text-areia/60 hover:text-areia'}`}
        >
          {l}
        </a>
      ))}
      <span aria-hidden="true" className="mx-1 h-[18px] w-px bg-areia/20" />
      <a
        href="/curriculo-yago-ramires.pdf"
        download
        className="grid h-[37px] place-items-center rounded-full px-3 text-areia/80 transition-colors hover:text-areia"
      >
        {ui.dockCv}
      </a>
    </nav>
  );
}

function ChapterLabel() {
  const [text, setText] = useState('');
  useEffect(() => {
    const on = (e: Event) => setText((e as CustomEvent<string>).detail);
    window.addEventListener('chapter', on);
    return () => window.removeEventListener('chapter', on);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-[2.6rem] left-[calc(var(--gutter)/2)] z-30 hidden -translate-x-1/2 rotate-180 items-center gap-2 text-step--1 text-fg transition-opacity duration-400 [writing-mode:vertical-rl] lg:flex"
      style={{ opacity: text ? 1 : 0 }}
    >
      <span key={text} className="chapter-text">
        {text}
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-cobalto" />
    </div>
  );
}

const COLS = 2;
const GRAVITY = 0.45;
const MAX_SPAWN = 4;

type Grain = { slot: number; y: number; vy: number; state: 'fall' | 'rest' | 'rise'; alpha: number };

/** Right-edge scroll rail: dots fall and pile up as you scroll down, float away as you scroll up. */
function Hourglass() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let pitch = 5;
    let rows = 0;
    let slots = 0;
    let grains: Grain[] = [];
    let ticks: number[] = [];
    let color = '#f0ebe3';
    let frame = 0;

    const x = (slot: number) => w / 2 + ((slot % COLS) - (COLS - 1) / 2) * pitch;
    const restY = (slot: number) => h - pitch / 2 - Math.floor(slot / COLS) * pitch - 2;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    const measureTicks = () => {
      const m = max();
      ticks = m > 0 ? [...document.querySelectorAll<HTMLElement>('[data-chapter]')].map((el) => Math.min(1, Math.max(0, (el.getBoundingClientRect().top + scrollY - innerHeight * 0.5) / m))) : [];
    };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pitch = innerWidth < 648 ? 4 : 5;
      rows = Math.floor((h - 8) / pitch);
      slots = rows * COLS;
      grains = grains.filter((g) => g.slot < slots).map((g) => ({ ...g, y: restY(g.slot), vy: 0, state: 'rest', alpha: 1 }));
      measureTicks();
    };
    resize();
    window.addEventListener('resize', resize);

    const stop = onFrame(() => {
      if (frame % 10 === 0) color = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || color;
      if (frame++ % 60 === 0) measureTicks();
      const m = max();
      const target = Math.round((m > 0 ? Math.min(1, Math.max(0, scrollY / m)) : 0) * slots);
      const live = grains.filter((g) => g.state !== 'rise');
      for (let i = 0; live.length < target && i < MAX_SPAWN; i++) {
        const g: Grain = { slot: live.length, y: -4 - Math.random() * 30, vy: Math.random() * 2, state: reduced ? 'rest' : 'fall', alpha: 1 };
        if (reduced) g.y = restY(g.slot);
        grains.push(g);
        live.push(g);
      }
      if (live.length > target) {
        live
          .sort((a, b) => b.slot - a.slot)
          .slice(0, Math.min(MAX_SPAWN, live.length - target))
          .forEach((g) => (g.state = 'rise'));
        if (reduced) grains = grains.filter((g) => g.state !== 'rise');
      }
      for (const g of grains) {
        if (g.state === 'fall') {
          g.vy += GRAVITY;
          g.y += g.vy;
          const ry = restY(g.slot);
          if (g.y >= ry) {
            g.y = ry;
            if (g.vy > 3) g.vy *= -0.25;
            else g.state = 'rest';
          }
        } else if (g.state === 'rise') {
          g.vy = Math.min(g.vy, 0) - 0.35;
          g.y += g.vy;
          g.alpha -= 0.04;
        }
      }
      grains = grains.filter((g) => g.alpha > 0);

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = color;
      for (const t of ticks) ctx.fillRect(w / 2 - pitch * 1.6, restY(Math.floor(t * rows) * COLS), pitch * 3.2, 1);
      const top = grains.reduce((acc, g) => (g.state === 'rest' && g.slot > acc ? g.slot : acc), -1);
      for (const g of grains) {
        ctx.globalAlpha = g.state === 'fall' ? 0.7 : g.alpha * 0.9;
        ctx.fillStyle = g.slot === top ? '#2b4fff' : color;
        ctx.beginPath();
        ctx.arc(x(g.slot), g.y, g.slot === top ? 2.1 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });

    return () => {
      stop();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0.5 bottom-0 z-40 h-screen w-3 md:right-1 md:w-4"
    />
  );
}
