'use client';

import { useEffect, useState, type RefObject } from 'react';
import { onFrame, scrollTo } from './motion';

const STEP_MS = 300;

/**
 * Active step of a pinned section: scroll progress through the section × step count, moving at most one step per
 * 300ms (like the reference) so a fast scroll still shows each step. Written to `data-index` for DotStage.
 */
export function useStageIndex(ref: RefObject<HTMLElement | null>, count: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let current = 0;
    let lastStep = 0;
    let inside = false;
    return onFrame((now) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      const target = Math.floor(Math.min(0.999, Math.max(0, -r.top / Math.max(1, r.height - vh))) * count);
      const centred = r.top <= vh / 2 && r.bottom >= vh / 2;
      if (!centred || !inside) {
        current = target;
        lastStep = now;
      } else if (current !== target && now - lastStep > STEP_MS) {
        current += Math.sign(target - current);
        lastStep = now;
      }
      inside = centred;
      el.dataset.index = String(current);
      setIndex(current);
    });
  }, [ref, count]);

  return index;
}

/** Scroll so the given step of a pinned section is centred in its range. */
export function scrollToStep(el: HTMLElement, step: number, count: number) {
  const top = el.getBoundingClientRect().top + scrollY;
  scrollTo(top + ((step + 0.5) / count) * (el.offsetHeight - innerHeight), 1);
}
