import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Francisco Neto is a Product Designer based in Brusque, Santa Catarina. Six years designing digital products, currently at Havan's e-commerce division.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <LogoMark className="h-11 w-auto shrink-0 text-[var(--foreground)]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">Product Designer</span>
          </Link>
          <nav className="flex gap-5 sm:gap-7">
            <Link
              href="/"
              className="text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              Work
            </Link>
            <a
              href="mailto:vieiraalencar.neto@gmail.com"
              className="hidden sm:block text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              Contact
            </a>
            <a
              href="/resume.pdf"
              className="hidden sm:block text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              Resume
            </a>
          </nav>
        </div>
      </header>

      <div className="pt-32 pb-32 px-6 max-w-3xl mx-auto">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--coffee-bean)] mb-10">
          About
        </p>

        <div className="space-y-6">
          <p className="text-[var(--foreground)] text-xl leading-relaxed font-medium">
            I began my career in 2015 as a Graphic Designer and have spent the past six years
            specializing in UI/UX.
          </p>

          <p className="text-[var(--muted)] text-base leading-relaxed">
            I&apos;m based in Brusque, Santa Catarina, where I work at Havan&apos;s e-commerce
            division as a Product Designer. My work focuses on designing and improving digital
            experiences — from product cards and navigation systems to gift registries and checkout
            flows.
          </p>

          <p className="text-[var(--muted)] text-base leading-relaxed">
            I approach design through the lens of user research, behavioral data, and business
            outcomes. Every project starts with a problem worth solving and ends with a measurable
            result.
          </p>

          <p className="text-[var(--muted)] text-base leading-relaxed">
            Outside of work, I&apos;m an amateur barista and musician who loves playing bass guitar.
            As a devoted Beatlemaniac, I collect vinyl records and think everything sounds better on
            warm-toned speakers.
          </p>
        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col gap-3 text-sm text-[var(--muted)]">
            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-[var(--border)]">Location</span>
              <span>Brusque, Santa Catarina, Brazil</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-[var(--border)]">Role</span>
              <span>Product Designer at Havan</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-[var(--border)]">Since</span>
              <span>2015</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-[var(--border)]">Email</span>
              <a
                href="mailto:vieiraalencar.neto@gmail.com"
                className="hover:text-[var(--foreground)] transition-colors"
              >
                vieiraalencar.neto@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M11 7H3M6 4L3 7l3 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View work
          </Link>
        </div>
      </div>

      <footer className="border-t border-[var(--border)] px-6 sm:px-8 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-[var(--muted)] text-xs">Brusque, SC, Brazil</span>
          <a
            href="mailto:vieiraalencar.neto@gmail.com"
            className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors duration-200"
          >
            vieiraalencar.neto@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
