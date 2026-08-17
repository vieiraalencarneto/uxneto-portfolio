import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { LogoMark } from "@/components/Logo";
import { getT, isLocale } from "@/lib/i18n";
import { localizeProject, PROJECTS } from "@/lib/projects-static";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getT(locale);
  return {
    title: t.meta.siteTitle,
    description: t.meta.siteDescription,
    openGraph: { locale: locale === "pt" ? "pt_BR" : "en_US" },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getT(locale);
  const projects = PROJECTS.map((p) => localizeProject(p, locale));

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Nav t={t} locale={locale} />
      <Hero t={t} locale={locale} projects={projects} />
      <Projects t={t} locale={locale} projects={projects} />
      <Footer t={t} locale={locale} />
    </main>
  );
}

type Project = ReturnType<typeof localizeProject>;

function Nav({ t, locale }: { t: ReturnType<typeof getT>; locale: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          aria-label="Home"
        >
          <LogoMark className="h-11 w-auto shrink-0 text-[var(--foreground)]" />
          <span className="text-sm font-semibold text-[var(--foreground)]">{t.nav.role}</span>
        </Link>
        <div className="flex items-center gap-5 sm:gap-7">
          <nav className="flex gap-5 sm:gap-7">
            <Link
              href={`/${locale}/about`}
              className="text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              {t.nav.about}
            </Link>
            <a
              href="mailto:vieiraalencar.neto@gmail.com"
              className="hidden sm:block text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              {t.nav.contact}
            </a>
            <a
              href="/api/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
            >
              {t.nav.resume}
            </a>
          </nav>
          <LocaleSwitcher />
        </div>
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

function Hero({
  t,
  locale,
  projects,
}: {
  t: ReturnType<typeof getT>;
  locale: string;
  projects: Project[];
}) {
  const featured = projects[0];
  return (
    <section className="pt-20 pb-0 px-6 sm:px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start pt-12">
        {/* Left column */}
        <div>
          <p className="text-[var(--muted)] text-xl font-sans mb-1">{t.hero.greeting}</p>
          <h1 className="font-serif text-[clamp(3rem,6.5vw,5.5rem)] leading-[0.9] tracking-tight text-[var(--foreground)] mb-4">
            {t.hero.name}
          </h1>
          <p className="text-[var(--muted)] text-base mb-6">
            {t.hero.subtitlePrefix}{" "}
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
              {t.hero.location}
            </span>
            <span className="text-sm leading-none">🇧🇷</span>
          </div>

          <p className="text-[var(--muted)] text-sm leading-relaxed mb-10 max-w-xs">
            {t.hero.description}
          </p>

          <div className="mb-10">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
              {t.hero.companyLabel}
            </p>
            <p className="text-[var(--muted)] text-sm leading-relaxed mb-2">
              {t.hero.companyDesc}{" "}
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
              <span className="text-[var(--muted)] text-xs">{t.hero.currentRole}</span>
            </div>
          </div>

          <div className="border-t border-[var(--border)]">
            {[
              {
                label: t.nav.contact,
                href: "mailto:vieiraalencar.neto@gmail.com",
                external: false,
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/netoalencar/",
                external: true,
              },
              { label: t.nav.resume, href: "/api/resume", external: true },
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
                {t.hero.impact}
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-serif text-2xl leading-none text-[var(--foreground)] mb-0.5">
                    42%
                  </p>
                  <p className="text-[10px] text-[var(--muted)] leading-tight whitespace-pre-line">
                    {t.hero.revenueGrowth}
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl leading-none text-[var(--foreground)] mb-0.5">
                    +79.5%
                  </p>
                  <p className="text-[10px] text-[var(--muted)] leading-tight whitespace-pre-line">
                    {t.hero.moreSignups}
                  </p>
                </div>
                <div>
                  <p className="font-serif text-2xl leading-none text-[var(--foreground)] mb-0.5">
                    6 yrs
                  </p>
                  <p className="text-[10px] text-[var(--muted)] leading-tight whitespace-pre-line">
                    {t.hero.yearsExp}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/work/${featured.slug}`}
            className="group block border border-[var(--border)] hover:border-[var(--coffee-bean)] transition-colors duration-300 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--coffee-bean)]">
                  {featured.label}
                </span>
                <span className="text-[9px] font-semibold px-2 py-0.5 bg-[var(--solar-yellow)] text-[var(--obsidian)]">
                  {t.hero.featured}
                </span>
              </div>
              <p className="text-[var(--foreground)] text-xs font-medium leading-snug">
                {featured.title}
              </p>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--border)]">
              <Image
                src={featured.thumbnailUrl}
                alt={featured.thumbnailAlt}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                sizes="480px"
              />
            </div>
          </Link>

          <div className="border border-[var(--border)] p-4">
            <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)] mb-3">
              {t.hero.skills}
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

function Projects({
  t,
  locale,
  projects,
}: {
  t: ReturnType<typeof getT>;
  locale: string;
  projects: Project[];
}) {
  const [featured, ...rest] = projects;
  return (
    <section className="px-6 sm:px-8 pb-32 max-w-5xl mx-auto mt-20">
      <div className="flex items-center gap-5 mb-14">
        <span className="text-[var(--muted)] text-[10px] tracking-[0.25em] uppercase shrink-0">
          {t.hero.selectedWork}
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <FeaturedCard project={featured} locale={locale} />

      <div
        className="mt-px grid grid-cols-1 sm:grid-cols-2 gap-px"
        style={{ backgroundColor: "var(--border)" }}
      >
        {rest.map((project, i) => (
          <GridCard key={project.slug} project={project} index={i + 2} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({ project, locale }: { project: Project; locale: string }) {
  return (
    <Link
      href={`/${locale}/work/${project.slug}`}
      className="group block pt-10 sm:pt-14 pb-10 sm:pb-14"
    >
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
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={project.thumbnailUrl}
              alt={project.thumbnailAlt}
              fill
              priority
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function GridCard({ project, index, locale }: { project: Project; index: number; locale: string }) {
  return (
    <Link
      href={`/${locale}/work/${project.slug}`}
      className="group block bg-[var(--background)] p-7 sm:p-9"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--border)] mb-6">
        <Image
          src={project.thumbnailUrl}
          alt={project.thumbnailAlt}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
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

function Footer({ t, locale }: { t: ReturnType<typeof getT>; locale: string }) {
  return (
    <footer className="border-t border-[var(--border)] px-6 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-[var(--muted)] text-xs">{t.footer.location}</span>
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
