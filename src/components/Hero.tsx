'use client';

import { useEffect, useRef, useState } from 'react';
import type { Content } from '@/content';
import { onFrame, prefersReducedMotion } from '@/lib/motion';
import { Split } from './Split';
import { Portrait } from './Portrait';

const TZ = 'America/Sao_Paulo';
const RIO = { lat: -22.9, lon: -43.2 };

type Props = { hero: Content['hero']; ui: Content['ui'] };

export function Hero({ hero, ui }: Props) {
  const root = useRef<HTMLElement>(null);

  // scroll-out: from 100px to 100px + 55% of the viewport the hero comes apart
  useEffect(() => {
    const el = root.current!;
    const q = <T extends HTMLElement>(s: string) => el.querySelector<T>(s)!;
    const location = q('.js-location');
    const right = q('.js-right');
    const arrow = q('.js-arrow');
    const lead = q('.js-lead');
    const actions = q('.js-actions');
    const masks = [...el.querySelectorAll<HTMLElement>('h1 .split-mask')];
    const reduced = prefersReducedMotion();
    const narrow = matchMedia('(max-width: 1023px)').matches;
    const span = narrow ? 0.32 : 0.55;
    let last = -1;

    return onFrame(() => {
      const p = Math.min(1, Math.max(0, (scrollY - 100) / (innerHeight * span)));
      if (p === last) return;
      last = p;
      actions.style.visibility = p === 1 ? 'hidden' : '';
      if (reduced) {
        location.style.opacity = lead.style.opacity = String(1 - p);
        return;
      }
      const g = p * p * (3 - 2 * p);
      location.style.translate = `${(-g * 64).toFixed(1)}px 0`;
      location.style.opacity = String(1 - g);
      right.style.translate = `0 ${(scrollY * 0.3).toFixed(1)}px`;
      arrow.style.rotate = `${(g * 55).toFixed(2)}deg`;
      arrow.style.opacity = String(1 - g);
      const fade = String(Math.max(0, 1 - g * 1.6));
      const drop = `0 ${(g * 24).toFixed(1)}px`;
      lead.style.opacity = actions.style.opacity = fade;
      lead.style.translate = actions.style.translate = drop;
      const step = masks.length > 1 ? 0.45 / (masks.length - 1) : 0;
      masks.forEach((m, i) => {
        const a = Math.min(1, Math.max(0, (p - i * step) / 0.55));
        const tilt = (i % 2 ? 1 : -1) * (4 + ((i * 7) % 6));
        m.style.translate = `0 ${(a * a * 140).toFixed(1)}px`;
        m.style.rotate = `${(a * tilt).toFixed(2)}deg`;
        m.style.opacity = String(1 - a * a);
        if (!narrow) m.style.filter = a > 0.01 ? `blur(${(a * 3).toFixed(2)}px)` : '';
      });
    });
  }, []);

  return (
    <section
      ref={root}
      id="topo"
      aria-labelledby="hero-nome"
      data-theme="dark"
      className="gutter relative grid min-h-svh grid-cols-1 content-end gap-12 pt-28 pb-24 lg:grid-cols-12 lg:content-stretch lg:items-center lg:gap-x-6 lg:pb-0"
    >
      <div className="order-first h-[62svh] lg:absolute lg:top-[8.7rem] lg:left-[calc(var(--gutter)+3*var(--index-col))] lg:h-svh lg:w-[calc(5*var(--index-col)-24px)]">
        <Portrait />
      </div>

      <div className="js-location order-2 lg:order-none lg:col-span-3 lg:col-start-1 lg:row-start-1">
        <div className="location location-in">
          <Location ui={ui} />
        </div>
      </div>

      <div className="js-right order-1 lg:order-none lg:col-span-4 lg:col-start-9 lg:row-start-1">
        <span aria-hidden="true" className="js-arrow mb-8 hidden text-[36px] leading-none lg:mb-20 lg:inline-block">
          ↘
        </span>
        <Split
          as="h1"
          id="hero-nome"
          load
          delay={250}
          text={`${hero.nameTop}\n${hero.nameBottom}`}
          className="light-display text-step-4 text-fg"
        />
        <p className="js-lead hero-lead hero-lead-in mt-4 max-w-[26rem] text-sm leading-[1.45] text-fg-muted">{hero.lead}</p>
        <div className="js-actions hero-lead-in mt-4 flex items-center gap-6 text-sm">
          <a href="#contato" data-fill className="rounded-full bg-cobalto px-4 py-2 text-white [--fill-bg:var(--fg)]">
            {ui.ctaPrimary}
          </a>
          <a href="#trabalhos" className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg">
            {ui.ctaSecondary} <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function hoursBehindLondon(now: Date) {
  const hour = (tz: string) => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(now);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
    return get('hour') * 60 + get('minute');
  };
  let diff = (hour('Europe/London') - hour(TZ)) / 60;
  if (diff < -12) diff += 24;
  if (diff > 12) diff -= 24;
  return Math.round(diff);
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/** Rio time, rendered client-side only so the server and browser markup match. */
export function RioClock() {
  const now = useNow();
  return <>{now?.toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }) ?? '--:--'} BRT</>;
}

function Location({ ui }: { ui: Content['ui'] }) {
  const now = useNow();

  const time = now?.toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

  return (
    <div className="flex items-center gap-5">
      <Globe />
      <div>
        <p className="text-sm">
          <span className="font-semibold">{ui.city}</span> <span className="text-fg-muted tabular-nums">{time ?? '--:--'}</span>
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          {now ? ui.behindLondon.replace('{n}', String(hoursBehindLondon(now))) : ' '}
        </p>
      </div>
    </div>
  );
}

/** 96px dotted orthographic globe, slowly turning, with Rio marked. */
function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const size = 96;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const r = size / 2 - 3;
    const tilt = (-18 * Math.PI) / 180;
    const dots: [number, number][] = [];
    for (let lat = -80; lat <= 80; lat += 7) {
      const n = Math.max(6, Math.round(52 * Math.cos((lat * Math.PI) / 180)));
      for (let k = 0; k < n; k++) dots.push([(lat * Math.PI) / 180, (k / n) * Math.PI * 2]);
    }
    const project = (lat: number, lon: number, spin: number) => {
      const x0 = Math.cos(lat) * Math.sin(lon + spin);
      const y0 = Math.sin(lat);
      const z0 = Math.cos(lat) * Math.cos(lon + spin);
      const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
      return { x: size / 2 + x0 * r, y: size / 2 - y * r, z };
    };
    const reduced = prefersReducedMotion();
    let spin = (-RIO.lon * Math.PI) / 180 - 0.6;

    return onFrame(() => {
      if (!reduced) spin += 0.0025;
      const fg = getComputedStyle(canvas).color;
      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, r + 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = fg;
      for (const [lat, lon] of dots) {
        const p = project(lat, lon, spin);
        if (p.z <= 0) continue;
        ctx.globalAlpha = 0.15 + p.z * 0.6;
        ctx.fillRect(p.x - 0.6, p.y - 0.6, 1.2, 1.2);
      }
      const rio = project((RIO.lat * Math.PI) / 180, (RIO.lon * Math.PI) / 180, spin);
      if (rio.z > 0) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#2b4fff';
        ctx.beginPath();
        ctx.arc(rio.x, rio.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="h-24 w-24 shrink-0 text-fg" />;
}
