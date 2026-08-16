import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProjects() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, slug, title, published, sort_order, updated_at")
    .order("sort_order")
    .returns<
      Array<{
        id: string;
        slug: string;
        title: string;
        published: boolean;
        sort_order: number;
        updated_at: string;
      }>
    >();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-[var(--foreground)]">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="text-xs bg-[var(--foreground)] text-[var(--background)] px-4 py-2 font-semibold hover:opacity-80 transition-opacity"
        >
          + New project
        </Link>
      </div>

      <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
        {(projects ?? []).map((p, i) => (
          <div key={p.id} className="flex items-center gap-4 px-4 py-3">
            <span className="text-[var(--muted)] text-xs w-5 shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/projects/${p.slug}`}
                className="text-sm text-[var(--foreground)] hover:underline underline-offset-2 truncate block"
              >
                {p.title}
              </Link>
              <p className="text-[10px] text-[var(--muted)]">/work/{p.slug}</p>
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide shrink-0 ${p.published ? "text-[var(--mint-chip)]" : "text-[var(--muted)]"}`}
            >
              {p.published ? "Published" : "Draft"}
            </span>
            <span className="text-[10px] text-[var(--muted)] shrink-0 hidden sm:block">
              {new Date(p.updated_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
            <Link
              href={`/admin/projects/${p.slug}`}
              className="text-[10px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors shrink-0"
            >
              Edit →
            </Link>
          </div>
        ))}
        {!projects?.length && (
          <p className="px-4 py-8 text-sm text-[var(--muted)] text-center">
            No projects yet. Create your first one.
          </p>
        )}
      </div>
    </div>
  );
}
