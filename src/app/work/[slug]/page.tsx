import { PROJECTS } from "@/lib/projects-static";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";

type Props = PageProps<"/work/[slug]">;

function getContentHtml(slug: string): string | null {
  const contentPath = join(process.cwd(), "src/content", `${slug}.html`);
  if (!existsSync(contentPath)) return null;
  return readFileSync(contentPath, "utf-8");
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnailUrl ? [{ url: project.thumbnailUrl }] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) notFound();

  const contentHtml = getContentHtml(slug);

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
          Back
        </Link>
      </nav>

      {/* Header */}
      <header className="pt-32 pb-12 px-6 max-w-3xl mx-auto">
        <p
          className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-6"
          style={{ color: project.accentColor }}
        >
          {project.label}
        </p>

        <h1 className="text-[#f0e7e4] text-3xl sm:text-4xl font-medium leading-tight mb-6">
          {project.title}
        </h1>

        <p className="text-[#6b6560] text-lg leading-relaxed mb-10">
          {project.description}
        </p>

        <div className="flex items-center gap-6 text-xs text-[#433e3c] border-t border-[#1a1a1a] pt-6">
          <span>{project.role}</span>
          <span className="text-[#222]">—</span>
          <span>{project.date}</span>
        </div>
      </header>

      {/* Thumbnail */}
      {project.thumbnailUrl && (
        <div className="px-6 mb-16 max-w-3xl mx-auto">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-[#111]">
            <Image
              src={project.thumbnailUrl}
              alt={project.thumbnailAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </div>
      )}

      {/* Case study content */}
      <div className="px-6 pb-32 max-w-3xl mx-auto">
        {contentHtml ? (
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <div className="border border-[#1a1a1a] rounded-sm p-8 text-center">
            <p className="text-[#433e3c] text-sm">
              Run{" "}
              <code className="font-mono">npm run generate:content</code> to
              generate static case study content.
            </p>
          </div>
        )}
      </div>

      <footer className="border-t border-[#1a1a1a] px-6 py-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-[#433e3c] text-xs hover:text-[#f0e7e4] transition-colors"
          >
            All work
          </Link>
          <span className="text-[#433e3c] text-xs">
            Francisco Neto — Brusque, SC
          </span>
        </div>
      </footer>
    </main>
  );
}
