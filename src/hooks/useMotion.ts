"use client";

import { useEffect, useRef, useState } from "react";

/** True when the user prefers reduced motion (defaults to true until measured — safer SSR). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    function onChange(event: MediaQueryListEvent) {
      setReduced(event.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Animates an integer from its previous displayed value to `target` over `durationMs`. */
export function useCountUp(target: number, durationMs = 800): number {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(target);
      displayRef.current = target;
      return;
    }

    const from = displayRef.current;
    if (from === target) return;

    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      const next = Math.round(from + (target - from) * eased);
      setDisplay(next);
      displayRef.current = next;
      if (t < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, prefersReducedMotion]);

  return display;
}
