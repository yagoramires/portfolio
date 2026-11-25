'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { canHover, prefersReducedMotion, runFrame, scrollTo, setLenis } from '@/lib/motion';

const GLYPHS = '</>{}[]=+*#_-01';
const SCRAMBLE_TICK = 28;
const PROX_RADIUS = 170;

function observeOnce(selector: string, run: (el: HTMLElement) => void, options: IntersectionObserverInit) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      run(entry.target as HTMLElement);
    }
  }, options);
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => io.observe(el));
  return () => io.disconnect();
}

function scramble(el: HTMLElement) {
  const text = el.dataset.text ?? el.textContent ?? '';
  el.dataset.text = text;
  el.style.opacity = '';
  const start = performance.now();
  const step = (now: number) => {
    const tick = Math.floor((now - start) / SCRAMBLE_TICK);
    let out = '';
    let done = true;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ' || tick >= i * 1.4 + 5) out += text[i];
      else {
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        done = false;
      }
    }
    el.textContent = out;
    if (!done) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Page-wide motion runtime, mounted once in the layout. Elements opt in with data attributes:
 * data-reveal, data-split (Split.tsx), data-scramble, data-theme + data-chapter, data-prox,
 * data-magnetic, data-fill. Same thresholds and timings as the reference site.
 */
export function Motion() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const hover = canHover();
    const cleanups: (() => void)[] = [];
    const root = document.documentElement;

    // smooth scroll + shared frame loop
    const lenis = reduced ? null : new Lenis({ lerp: 0.1 });
    setLenis(lenis);
    let raf = requestAnimationFrame(function loop(t) {
      runFrame(t);
      raf = requestAnimationFrame(loop);
    });
    cleanups.push(() => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      setLenis(null);
    });

    // in-page anchors scroll through Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || a.hash.length < 2) return;
      e.preventDefault();
      scrollTo(a.hash === '#topo' ? 0 : a.hash);
    };
    document.addEventListener('click', onClick);
    cleanups.push(() => document.removeEventListener('click', onClick));

    // load sequence starts once fonts are in, like the reference
    let loaded = false;
    document.fonts.ready.then(() => {
      if (loaded) return;
      loaded = true;
      root.classList.add('is-loaded');
      requestAnimationFrame(() =>
        document.querySelectorAll<HTMLElement>('[data-split="load"]').forEach((el) => (el.dataset.split = 'in')),
      );
    });
    cleanups.push(() => {
      loaded = true;
    });

    if (reduced) {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => (el.dataset.reveal = 'in'));
      document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => (el.dataset.split = 'in'));
    } else {
      cleanups.push(
        observeOnce('[data-reveal]', (el) => (el.dataset.reveal = 'in'), {
          threshold: 0.15,
          rootMargin: '0px 0px -5% 0px',
        }),
        observeOnce('[data-split=""]', (el) => (el.dataset.split = 'in'), { threshold: 0.2 }),
      );
      document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => (el.style.opacity = '0'));
      cleanups.push(observeOnce('[data-scramble]', scramble, { threshold: 0.4 }));
    }

    // theme + chapter label follow the section under the viewport centre
    root.dataset.theme = 'dark';
    const themeIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          root.dataset.theme = el.dataset.theme || 'dark';
          window.dispatchEvent(new CustomEvent('chapter', { detail: el.dataset.chapter ?? '' }));
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-theme]').forEach((el) => themeIo.observe(el));
    cleanups.push(() => themeIo.disconnect());

    if (hover && !reduced) {
      // letters near the cursor lift and lean away from it
      const proxChars = [...document.querySelectorAll<HTMLElement>('[data-prox] .prox-char')];
      const onMove = (e: MouseEvent) => {
        for (const ch of proxChars) {
          const r = ch.getBoundingClientRect();
          if (r.bottom < -PROX_RADIUS || r.top > innerHeight + PROX_RADIUS) continue;
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const d = Math.max(0, 1 - Math.hypot(dx, dy) / PROX_RADIUS);
          ch.style.transform = d ? `translateY(${(-d * 0.16).toFixed(3)}em) rotate(${(Math.sign(dx) * -d * 5).toFixed(2)}deg)` : '';
        }
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      cleanups.push(() => window.removeEventListener('mousemove', onMove));

      // magnetic: element follows the cursor by a factor, springs back on leave
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const k = Number(el.dataset.magnetic) || 0.3;
        el.style.transition = 'transform 500ms var(--ease-spring)';
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * k).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * k).toFixed(1)}px)`;
        };
        const leave = () => (el.style.transform = '');
        el.addEventListener('mousemove', move);
        el.addEventListener('mouseleave', leave);
        cleanups.push(() => {
          el.removeEventListener('mousemove', move);
          el.removeEventListener('mouseleave', leave);
        });
      });

      // fill: a circle grows from where the cursor entered
      document.querySelectorAll<HTMLElement>('[data-fill]').forEach((el) => {
        el.classList.add('fill');
        const place = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--fx', `${e.clientX - r.left}px`);
          el.style.setProperty('--fy', `${e.clientY - r.top}px`);
          el.style.setProperty('--fd', `${Math.hypot(r.width, r.height) * 2.1}px`);
        };
        const enter = (e: MouseEvent) => {
          place(e);
          el.classList.add('is-filled');
        };
        const leave = (e: MouseEvent) => {
          place(e);
          el.classList.remove('is-filled');
        };
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        cleanups.push(() => {
          el.removeEventListener('mouseenter', enter);
          el.removeEventListener('mouseleave', leave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
