"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";

export function PageIntro() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      setGone(true);
      return;
    }

    // bar fills: 250ms delay + 900ms duration = done at 1150ms
    // exit starts at 1350ms, takes 580ms — done at 1930ms
    const exitId = setTimeout(() => {
      overlayRef.current?.classList.add("is-exiting");
    }, 1350);

    const doneId = setTimeout(() => setGone(true), 1930);

    return () => {
      clearTimeout(exitId);
      clearTimeout(doneId);
    };
  }, [isAdmin]);

  if (gone) return null;

  return (
    <div ref={overlayRef} className="intro-overlay" aria-hidden="true">
      <div className="intro-logo">
        <LogoMark className="h-14 w-auto text-[var(--foreground)]" />
      </div>
      <div className="intro-track">
        <div className="intro-bar" />
      </div>
    </div>
  );
}
