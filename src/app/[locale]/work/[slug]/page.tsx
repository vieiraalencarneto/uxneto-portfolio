import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { LogoMark } from "@/components/Logo";
import { getT, isLocale } from "@/lib/i18n";
import { localizeProject, PROJECTS } from "@/lib/projects-static";

type Props = { params: Promise<{ locale: string; slug: string }> };

const ACCENT_COLORS: Record<string, string> = {
  "improving-havan-gift-list": "#fde440",
  "havan-headers-ecommerce-gift-registry-internal-systems": "#c6bffa",
  "saving-costs-whatsapp-button": "#56d270",
  "havan-ecommerce-product-cards": "#fde440",
  "showcasing-gift-registry-items-a-strategic-approach": "#c6bffa",
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function generateStaticParams() {
  const { data } = await getSupabase()
    .from("projects")
    .select("slug")
    .eq("published", true)
    .order("sort_order");

  const slugs = (data ?? []).map((p: { slug: string }) => p.slug);

  return ["en", "pt"].flatMap((locale) => slugs.map((slug: string) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const { data: project } = await getSupabase()
    .from("projects")
    .select("title, description, thumbnail_url")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project) return {};

  const stub = PROJECTS.find((p) => p.slug === slug);
  const localized = stub ? localizeProject(stub, locale) : null;

  return {
    title: localized?.title ?? project.title,
    description: localized?.description ?? project.description ?? undefined,
    openGraph: {
      title: localized?.title ?? project.title,
      description: localized?.description ?? project.description ?? undefined,
      images: project.thumbnail_url ? [{ url: project.thumbnail_url }] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const t = getT(locale);

  const { data: project } = await getSupabase()
    .from("projects")
    .select(
      "title, description, label, role, date, thumbnail_url, thumbnail_alt, content_html, content_html_pt",
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project) notFound();

  const stub = PROJECTS.find((p) => p.slug === slug);
  const localized = stub ? localizeProject(stub, locale) : null;

  const title = localized?.title ?? project.title;
  const description = localized?.description ?? project.description;
  const label = localized?.label ?? project.label ?? "Case Study";
  const accentColor = ACCENT_COLORS[slug] ?? "#fde440";

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <Link
          href={`/${locale}`}
          className="text-[var(--foreground)] hover:opacity-80 transition-opacity"
          aria-label="Home"
        >
          <LogoMark className="h-11 w-auto shrink-0" />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}`}
            className="text-[var(--muted)] text-sm hover:text-[var(--foreground)] transition-colors duration-200"
          >
            {t.nav.back}
          </Link>
          <LocaleSwitcher />
        </div>
      </nav>

      <header className="pt-32 pb-12 px-6 max-w-3xl mx-auto">
        <div className="h-[2px] w-10 mb-6" style={{ backgroundColor: accentColor }} />
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 text-[var(--coffee-bean)]">
          {label}
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-[var(--foreground)] mb-6">
          {title}
        </h1>

        <p className="text-[var(--muted)] text-lg leading-relaxed mb-10">{description}</p>

        <div className="flex items-center gap-6 text-xs text-[var(--coffee-bean)] border-t border-[var(--border)] pt-6">
          {project.role && <span>{project.role}</span>}
          {project.role && project.date && <span className="text-[var(--border)]">-</span>}
          {project.date && <span>{project.date}</span>}
        </div>
      </header>

      {project.thumbnail_url && (
        <div className="px-6 mb-16 max-w-3xl mx-auto">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--border)]">
            <Image
              src={project.thumbnail_url}
              alt={project.thumbnail_alt ?? title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </div>
      )}

      <div className="px-6 pb-32 max-w-3xl mx-auto">
        {(locale === "pt" ? project.content_html_pt : project.content_html) ? (
          <article
            className="prose"
            dangerouslySetInnerHTML={{
              __html: (locale === "pt" ? project.content_html_pt : project.content_html) ?? "",
            }}
          />
        ) : (
          <div className="border border-[var(--border)] p-8 text-center">
            <p className="text-[var(--muted)] text-sm">{t.caseStudy.noContent}</p>
          </div>
        )}
      </div>

      <footer className="border-t border-[var(--border)] px-6 py-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors"
          >
            {t.nav.allWork}
          </Link>
          <span className="text-[var(--muted)] text-xs">{t.footer.location}</span>
        </div>
      </footer>
    </main>
  );
}
