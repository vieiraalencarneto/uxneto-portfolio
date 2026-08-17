"use client";

import { useEffect, useRef } from "react";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
  className?: string;
}

function easeOut(t: number): number {
  return 1 - (1 - t) ** 4;
}

export function CountUpNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const ssrText = `${prefix}${decimals > 0 ? value.toFixed(decimals) : value}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const zero = `${prefix}${decimals > 0 ? (0).toFixed(decimals) : "0"}${suffix}`;

    const target = el; // TypeScript narrows to HTMLSpanElement here

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        // Reset to 0 immediately so the stagger pause shows "0", not the final value
        target.textContent = zero;

        setTimeout(() => {
          const duration = 1200;
          let startTime: number | null = null;

          function tick(now: number) {
            if (startTime === null) startTime = now;
            const t = Math.min((now - startTime) / duration, 1);
            const current = value * easeOut(t);
            const n = decimals > 0 ? current.toFixed(decimals) : String(Math.round(current));
            target.textContent = `${prefix}${n}${suffix}`;
            if (t < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.5 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [value, prefix, suffix, decimals, delay]);

  return (
    <span ref={ref} className={className}>
      {ssrText}
    </span>
  );
}
