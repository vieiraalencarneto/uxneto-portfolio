import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Francisco Neto is a Product Designer based in Brusque, Santa Catarina. Six years designing digital products, currently at Havan's e-commerce division.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#000000]">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-[#433e3c] text-sm hover:text-[#f0e7e4] transition-colors duration-200"
        >
          Francisco Neto
        </Link>
        <Link
          href="/"
          className="text-[#433e3c] text-sm hover:text-[#f0e7e4] transition-colors duration-200"
        >
          Work
        </Link>
      </nav>

      <div className="pt-32 pb-32 px-6 max-w-2xl mx-auto">
        <p className="text-[#433e3c] text-xs tracking-[0.2em] uppercase mb-10">
          About
        </p>

        <div className="space-y-6">
          <p className="text-[#f0e7e4] text-xl leading-relaxed font-medium">
            I began my career in 2015 as a Graphic Designer and have spent the
            past six years specializing in UI/UX.
          </p>

          <p className="text-[#6b6560] text-base leading-relaxed">
            I&apos;m based in Brusque, Santa Catarina, where I work at
            Havan&apos;s e-commerce division as a Product Designer. My work
            focuses on designing and improving digital experiences — from product
            cards and navigation systems to gift registries and checkout flows.
          </p>

          <p className="text-[#6b6560] text-base leading-relaxed">
            I approach design through the lens of user research, behavioral
            data, and business outcomes. Every project starts with a problem
            worth solving and ends with a measurable result.
          </p>

          <p className="text-[#6b6560] text-base leading-relaxed">
            Outside of work, I&apos;m an amateur barista and musician who loves
            playing bass guitar. As a devoted Beatlemaniac, I collect vinyl
            records and think everything sounds better on warm-toned speakers.
          </p>
        </div>

        <div className="mt-14 pt-8 border-t border-[#1a1a1a]">
          <div className="flex flex-col gap-3 text-sm text-[#433e3c]">
            <div className="flex gap-4">
              <span className="w-20 shrink-0 text-[#222]">Location</span>
              <span>Brusque, Santa Catarina, Brazil</span>
            </div>
            <div className="flex gap-4">
              <span className="w-20 shrink-0 text-[#222]">Role</span>
              <span>Product Designer at Havan</span>
            </div>
            <div className="flex gap-4">
              <span className="w-20 shrink-0 text-[#222]">Since</span>
              <span>2015</span>
            </div>
            <div className="flex gap-4">
              <span className="w-20 shrink-0 text-[#222]">Email</span>
              <a
                href="mailto:vieiraalencar.neto@gmail.com"
                className="hover:text-[#f0e7e4] transition-colors"
              >
                vieiraalencar.neto@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#433e3c] hover:text-[#f0e7e4] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
    </main>
  );
}
