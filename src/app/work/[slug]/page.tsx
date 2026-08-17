import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/Logo";

type Props = PageProps<"/work/[slug]">;

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

  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await getSupabase()
    .from("projects")
    .select("title, description, thumbnail_url")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project) return {};

  return {
    title: project.title,
    description: project.description ?? undefined,
    openGraph: {
      title: project.title,
      description: project.description ?? undefined,
      images: project.thumbnail_url ? [{ url: project.thumbnail_url }] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const { data: project } = await getSupabase()
    .from("projects")
    .select("title, description, label, role, date, thumbnail_url, thumbnail_alt, content_html")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project) notFound();

  const accentColor = ACCENT_COLORS[slug] ?? "#fde440";

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <Link
          href="/"
          className="text-[var(--foreground)] hover:text-black transition-colors"
          aria-label="Home"
        >
          <LogoMark className="h-11 w-auto shrink-0" />
        </Link>
        <Link
          href="/"
          className="text-[var(--muted)] text-sm hover:text-[var(--foreground)] transition-colors duration-200"
        >
          Back
        </Link>
      </nav>

      <header className="pt-32 pb-12 px-6 max-w-3xl mx-auto">
        <div
          className="animate-fade-up h-[2px] w-10 mb-6"
          style={{ backgroundColor: accentColor }}
        />
        <p
          className="animate-fade-up text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 text-[var(--coffee-bean)]"
          style={{ animationDelay: "60ms" }}
        >
          {project.label ?? "Case Study"}
        </p>

        <h1
          className="animate-fade-up font-serif text-3xl sm:text-4xl leading-tight text-[var(--foreground)] mb-6"
          style={{ animationDelay: "110ms" }}
        >
          {project.title}
        </h1>

        <p
          className="animate-fade-up text-[var(--muted)] text-lg leading-relaxed mb-10"
          style={{ animationDelay: "170ms" }}
        >
          {project.description}
        </p>

        <div
          className="animate-fade-up flex items-center gap-6 text-xs text-[var(--coffee-bean)] border-t border-[var(--border)] pt-6"
          style={{ animationDelay: "220ms" }}
        >
          {project.role && <span>{project.role}</span>}
          {project.role && project.date && <span className="text-[var(--border)]">—</span>}
          {project.date && <span>{project.date}</span>}
        </div>
      </header>

      {project.thumbnail_url && (
        <div
          className="animate-fade-up px-6 mb-16 max-w-3xl mx-auto"
          style={{ animationDelay: "280ms" }}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--border)]">
            <Image
              src={project.thumbnail_url}
              alt={project.thumbnail_alt ?? project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </div>
      )}

      <div className="px-6 pb-32 max-w-3xl mx-auto">
        {project.content_html ? (
          <article className="prose" dangerouslySetInnerHTML={{ __html: project.content_html }} />
        ) : (
          <div className="border border-[var(--border)] p-8 text-center">
            <p className="text-[var(--muted)] text-sm">Conteudo nao disponivel.</p>
          </div>
        )}
      </div>

      <footer className="border-t border-[var(--border)] px-6 py-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors"
          >
            All work
          </Link>
          <span className="text-[var(--muted)] text-xs">Francisco Neto — Brusque, SC</span>
        </div>
      </footer>
    </main>
  );
}
