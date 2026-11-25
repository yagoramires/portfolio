import type Lenis from 'lenis';

type FrameFn = (time: number) => void;

const subscribers = new Set<FrameFn>();
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** One shared rAF loop (started by <Motion />) so every effect reads the same scroll value per frame. */
export function onFrame(fn: FrameFn) {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export function runFrame(time: number) {
  lenis?.raf(time);
  subscribers.forEach((fn) => fn(time));
}

export function scrollTo(target: string | number, duration = 1.6) {
  if (lenis) lenis.scrollTo(target, { duration });
  else if (typeof target === 'number') window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const canHover = () => window.matchMedia('(hover: hover)').matches;
