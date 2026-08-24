import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { LogoMark } from "@/components/Logo";
import { TrackableAnchor } from "@/components/TrackableAnchor";
import { TrackableLink } from "@/components/TrackableLink";
import { getT, isLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getT(locale);
  return {
    title: t.about.label,
    description: t.about.metaDescription,
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getT(locale);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <TrackableLink
            href={`/${locale}`}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            aria-label="Home"
            trackingEvent="nav_click"
            trackingParams={{ element: "logo", page: "about" }}
          >
            <LogoMark className="h-11 w-auto shrink-0 text-[var(--foreground)]" />
            <span className="text-sm font-semibold text-[var(--foreground)]">{t.nav.role}</span>
          </TrackableLink>
          <div className="flex items-center gap-5 sm:gap-7">
            <nav className="flex gap-5 sm:gap-7">
              <TrackableLink
                href={`/${locale}`}
                className="text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
                trackingEvent="nav_click"
                trackingParams={{ element: "work", page: "about" }}
              >
                {t.nav.work}
              </TrackableLink>
              <TrackableAnchor
                href="mailto:vieiraalencar.neto@gmail.com"
                className="hidden sm:block text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
                trackingEvent="nav_click"
                trackingParams={{ element: "contact_email", page: "about" }}
              >
                {t.nav.contact}
              </TrackableAnchor>
              <TrackableAnchor
                href="/resume.pdf"
                className="hidden sm:block text-[var(--muted)] text-xs uppercase tracking-[0.12em] hover:text-[var(--foreground)] transition-colors duration-200"
                trackingEvent="nav_click"
                trackingParams={{ element: "resume", page: "about" }}
              >
                {t.nav.resume}
              </TrackableAnchor>
            </nav>
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      <div className="pt-32 pb-32 px-6 max-w-3xl mx-auto">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--coffee-bean)] mb-10">
          {t.about.label}
        </p>

        <div className="space-y-6">
          <p className="text-[var(--foreground)] text-xl leading-relaxed font-medium">
            {t.about.p1}
          </p>

          <p className="text-[var(--muted)] text-base leading-relaxed">{t.about.p2}</p>

          <p className="text-[var(--muted)] text-base leading-relaxed">{t.about.p3}</p>

          <p className="text-[var(--muted)] text-base leading-relaxed">{t.about.p4}</p>
        </div>

        <div className="mt-14 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col gap-3 text-sm text-[var(--muted)]">
            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-[var(--border)]">{t.about.locationLabel}</span>
              <span>{t.about.locationValue}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-[var(--border)]">{t.about.roleLabel}</span>
              <span>{t.about.roleValue}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-[var(--border)]">{t.about.sinceLabel}</span>
              <span>2015</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-[var(--border)]">{t.about.emailLabel}</span>
              <TrackableAnchor
                href="mailto:vieiraalencar.neto@gmail.com"
                className="hover:text-[var(--foreground)] transition-colors"
                trackingEvent="cta_click"
                trackingParams={{ element: "about", label: "email" }}
              >
                vieiraalencar.neto@gmail.com
              </TrackableAnchor>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <TrackableLink
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            trackingEvent="about_view_work_click"
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
            {t.about.viewWork}
          </TrackableLink>
        </div>
      </div>

      <footer className="border-t border-[var(--border)] px-6 sm:px-8 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-[var(--muted)] text-xs">{t.footer.location}</span>
          <TrackableAnchor
            href="mailto:vieiraalencar.neto@gmail.com"
            className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors duration-200"
            trackingEvent="footer_click"
            trackingParams={{ element: "email", page: "about" }}
          >
            vieiraalencar.neto@gmail.com
          </TrackableAnchor>
        </div>
      </footer>
    </main>
  );
}
