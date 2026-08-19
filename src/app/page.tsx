import Image from "next/image";
import Link from "next/link";
import { CountUpNumber } from "@/components/CountUpNumber";
import { LogoMark } from "@/components/Logo";
import { localizeProject, PROJECTS } from "@/lib/projects-static";

const LOCALIZED = PROJECTS.map((p) => localizeProject(p, "en"));

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Nav />
      <Hero />
      <Projects />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
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
            href="/work"
            className="text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
          >
            Work
          </Link>
          <Link
            href="/about"
            className="text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
          >
            About
          </Link>
          <a
            href="mailto:vieiraalencar.neto@gmail.com"
            className="hidden sm:block text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
          >
            Contact
          </a>
          <a
            href="/api/resume"
            className="hidden sm:block text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}

const SKILLS = [
  "UX Strategy",
  "Product Design",
  "Data-driven Design",
  "A/B Testing",
  "Interface Design",
  "Design Systems",
  "Service Design",
  "User Research",
  "Accessibility",
  "Stakeholder Management",
];

function Hero() {
  const featured = LOCALIZED[0];
  return (
    <section className="pt-20 pb-0 px-6 sm:px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start pt-12">
        {/* Left column */}
        <div>
          <p className="text-[var(--muted)] text-xl font-sans mb-1">Hi,</p>
          <h1 className="font-serif text-[clamp(3rem,6.5vw,5.5rem)] leading-[0.9] tracking-tight text-[var(--foreground)] mb-4">
            I'm Neto
          </h1>
          <p className="text-[var(--muted)] text-base mb-6">
            Senior Product Designer at{" "}
            <a
              href="https://www.havan.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--foreground)] hover:underline underline-offset-2 transition-colors duration-200"
            >
              Havan
            </a>
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--mint-chip)]/15 mb-7">
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--forest-floor)]">
              Brusque, SC, BR
            </span>
            <span className="text-sm leading-none">🇧🇷</span>
          </div>

          <p className="text-[var(--muted)] text-sm leading-relaxed mb-10 max-w-xs">
            Working for 6 years with innovations and process optimization to make the user
            experience the best it can be, currently focusing on e-commerce, service design, and UX
            strategy.
          </p>

          <div className="mb-10">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
              Havan
            </p>
            <p className="text-[var(--muted)] text-sm leading-relaxed mb-2">
              Work on internal and external products of{" "}
              <a
                href="https://www.havan.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--foreground)] transition-colors duration-200"
              >
                Havan
              </a>
            </p>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--mint-chip)]" />
              <span className="text-[var(--muted)] text-xs">Currently working here on Havan</span>
            </div>
          </div>

          <div className="border-t border-[var(--border)]">
            {[
              {
                label: "Email",
                href: "mailto:vieiraalencar.neto@gmail.com",
                external: false,
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/netoalencar/",
                external: true,
              },
              { label: "Resume", href: "/api/resume", external: false },
            ].map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between py-3.5 border-b border-[var(--border)]"
              >
                <span className="text-[var(--muted)] text-sm group-hover:text-[var(--foreground)] transition-colors duration-200">
                  {label}
                </span>
                <span className="text-[var(--muted)] text-xs group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 transition-all duration-200">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          {/* Photo + Impact metrics — top, correlates with "Hi, I'm Neto" */}
          <div className="grid grid-cols-[3fr_2fr] gap-3">
            <div className="relative min-h-[220px] overflow-hidden bg-[var(--border)]">
              <Image
                src="/neto.jpg"
                alt="Francisco Neto em Piccadilly Circus, Londres"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 60vw, 300px"
                priority
              />
            </div>
            <div className="border border-[var(--border)] p-4 flex flex-col justify-between">
              <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-4">
                Impact
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-serif text-2xl leading-none text-[var(--foreground)] mb-0.5">
                    <CountUpNumber value={42} suffix="%" delay={0} />
                  </p>
                  <p className="text-[10px] text-[var(--muted)] leading-tight">
                    revenue growth
                    <br />
                    Gift List
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl leading-none text-[var(--foreground)] mb-0.5">
                    <CountUpNumber value={79.5} prefix="+" suffix="%" decimals={1} delay={120} />
                  </p>
                  <p className="text-[10px] text-[var(--muted)] leading-tight">
                    more sign-ups
                    <br />
                    organic traffic
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl leading-none text-[var(--foreground)] mb-0.5">
                    <CountUpNumber value={6} suffix=" yrs" delay={240} />
                  </p>
                  <p className="text-[10px] text-[var(--muted)] leading-tight">
                    B2B & B2C
                    <br />
                    solutions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured project card */}
          <Link
            href={`/work/${featured.slug}`}
            className="group block border border-[var(--border)] hover:border-[var(--coffee-bean)] transition-colors duration-300 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--coffee-bean)]">
                  {featured.label}
                </span>
                <span className="text-[9px] font-semibold px-2 py-0.5 bg-[var(--solar-yellow)] text-[var(--obsidian)]">
                  Featured
                </span>
              </div>
              <p className="text-[var(--foreground)] text-xs font-medium leading-snug">
                {featured.title}
              </p>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--border)]">
              <Image
                src={featured.thumbnailUrl}
                alt={featured.thumbnailAlt}
                fill
                className="object-contain"
                sizes="480px"
              />
            </div>
          </Link>

          {/* Skills */}
          <div className="border border-[var(--border)] p-4">
            <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] text-[var(--muted)] border border-[var(--border)] px-2 py-0.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Project = (typeof LOCALIZED)[number];

function Projects() {
  const [featured, ...rest] = LOCALIZED;
  return (
    <section className="px-6 sm:px-8 pb-32 max-w-5xl mx-auto mt-20">
      <div className="flex items-center gap-5 mb-14">
        <span className="text-[var(--muted)] text-[10px] tracking-[0.25em] uppercase shrink-0">
          Selected Work
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <FeaturedCard project={featured} />

      <div
        className="mt-px grid grid-cols-1 sm:grid-cols-2 gap-px"
        style={{ backgroundColor: "var(--border)" }}
      >
        {rest.map((project, i) => (
          <GridCard key={project.slug} project={project} index={i + 2} />
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block pt-10 sm:pt-14 pb-10 sm:pb-14">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <div className="flex-1 order-2 lg:order-1 min-w-0">
          <div className="h-[2px] w-10 mb-6" style={{ backgroundColor: project.accentColor }} />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--coffee-bean)]">
              {project.label}
            </span>
            <span className="text-[var(--muted)] text-xs">01</span>
          </div>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1] tracking-tight text-[var(--foreground)] mb-5 group-hover:text-black transition-colors duration-200">
            {project.title}
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed max-w-sm mb-7">
            {project.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--coffee-bean)]">
            <span>{project.role}</span>
            <span>-</span>
            <span>{project.date}</span>
          </div>
        </div>

        <div className="w-full lg:w-[54%] shrink-0 order-1 lg:order-2 overflow-hidden bg-[var(--border)]">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={project.thumbnailUrl}
              alt={project.thumbnailAlt}
              fill
              priority
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function GridCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block bg-[var(--background)] p-7 sm:p-9">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--border)] mb-6">
        <Image
          src={project.thumbnailUrl}
          alt={project.thumbnailAlt}
          fill
          className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 480px"
        />
      </div>

      <div className="h-[2px] w-8 mb-5" style={{ backgroundColor: project.accentColor }} />

      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[var(--coffee-bean)]">
          {project.label}
        </span>
        <span className="text-[var(--muted)] text-xs">{String(index).padStart(2, "0")}</span>
      </div>

      <h3 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] leading-tight text-[var(--foreground)] mb-3 group-hover:text-black transition-colors duration-200">
        {project.title}
      </h3>

      <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">{project.description}</p>

      <div className="flex items-center gap-3 text-xs text-[var(--coffee-bean)]">
        <span>{project.role}</span>
        <span>-</span>
        <span>{project.date}</span>
      </div>
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-[var(--muted)] text-xs">Brusque, SC, Brazil</span>
        <div className="flex items-center gap-4">
          <a
            href="mailto:vieiraalencar.neto@gmail.com"
            className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors duration-200"
          >
            vieiraalencar.neto@gmail.com
          </a>
          <Link
            href="/admin"
            className="text-[var(--border)] hover:text-[var(--muted)] transition-colors duration-200"
            aria-label="Admin"
            title="Admin"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
