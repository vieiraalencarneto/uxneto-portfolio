import { PROJECTS } from "@/lib/projects-static";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000]">
      <Nav />
      <Hero />
      <ProjectList />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between">
      <span className="text-[#f0e7e4] text-sm font-medium tracking-[0.08em] uppercase">
        Francisco Neto
      </span>
      <nav className="flex gap-6">
        <Link
          href="/work"
          className="text-[#6b6560] text-sm hover:text-[#f0e7e4] transition-colors duration-200"
        >
          Work
        </Link>
        <Link
          href="/about"
          className="text-[#6b6560] text-sm hover:text-[#f0e7e4] transition-colors duration-200"
        >
          About
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-end px-6 pb-16 pt-32 max-w-4xl">
      <div className="mb-12">
        <p className="text-[#433e3c] text-xs tracking-[0.2em] uppercase mb-6">
          Product Designer
        </p>
        <h1 className="text-[#f0e7e4] text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight max-w-2xl">
          Francisco Neto
        </h1>
        <p className="text-[#6b6560] text-lg mt-6 max-w-xl leading-relaxed">
          Six years designing digital products at Havan — the largest retail
          chain in the South of Brazil. I work at the intersection of research,
          business, and interface craft.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[#433e3c] text-sm">
        <span>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

function ProjectList() {
  return (
    <section className="px-6 pb-32">
      <div className="max-w-4xl">
        {PROJECTS.map((project, index) => (
          <ProjectEntry key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

type Project = (typeof PROJECTS)[number];

function ProjectEntry({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block border-t border-[#1a1a1a] py-10 sm:py-14 hover:border-[#433e3c] transition-colors duration-300"
    >
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[10px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: project.accentColor }}
            >
              {project.label}
            </span>
            <span className="text-[#333333] text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h2 className="text-[#f0e7e4] text-xl sm:text-2xl font-medium leading-snug mb-3 group-hover:text-white transition-colors duration-200">
            {project.title}
          </h2>

          <p className="text-[#6b6560] text-sm leading-relaxed max-w-sm">
            {project.description}
          </p>

          <div className="flex items-center gap-4 mt-6 text-xs text-[#433e3c]">
            <span>{project.role}</span>
            <span>—</span>
            <span>{project.date}</span>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="w-full sm:w-52 shrink-0 overflow-hidden rounded-sm bg-[#111111]">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={project.thumbnailUrl}
              alt={project.thumbnailAlt}
              fill
              className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
              sizes="(max-width: 640px) 100vw, 208px"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] px-6 py-8">
      <div className="max-w-4xl flex items-center justify-between">
        <span className="text-[#433e3c] text-xs">
          Francisco Neto — Brusque, SC, Brazil
        </span>
        <a
          href="mailto:vieiraalencar.neto@gmail.com"
          className="text-[#433e3c] text-xs hover:text-[#f0e7e4] transition-colors duration-200"
        >
          vieiraalencar.neto@gmail.com
        </a>
      </div>
    </footer>
  );
}
