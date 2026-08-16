import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: total }, { count: published }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("published", true),
  ]);

  const { data: recent } = await supabase
    .from("projects")
    .select("slug, title, published, updated_at")
    .order("updated_at", { ascending: false })
    .limit(5)
    .returns<Array<{ slug: string; title: string; published: boolean; updated_at: string }>>();

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--foreground)] mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total projects", value: total ?? 0 },
          { label: "Published", value: published ?? 0 },
          { label: "Drafts", value: (total ?? 0) - (published ?? 0) },
        ].map(({ label, value }) => (
          <div key={label} className="border border-[var(--border)] p-4">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted)] mb-1">
              {label}
            </p>
            <p className="font-serif text-3xl text-[var(--foreground)]">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--muted)]">
          Recent projects
        </h2>
        <Link
          href="/admin/projects/new"
          className="text-xs bg-[var(--foreground)] text-[var(--background)] px-3 py-1.5 font-medium hover:opacity-80 transition-opacity"
        >
          + New project
        </Link>
      </div>

      <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
        {(recent ?? []).map((p) => (
          <Link
            key={p.slug}
            href={`/admin/projects/${p.slug}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-[var(--border)]/20 transition-colors"
          >
            <span className="text-sm text-[var(--foreground)]">{p.title}</span>
            <div className="flex items-center gap-4">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide ${p.published ? "text-[var(--mint-chip)]" : "text-[var(--muted)]"}`}
              >
                {p.published ? "Published" : "Draft"}
              </span>
              <span className="text-[10px] text-[var(--muted)]">
                {new Date(p.updated_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/projects"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors underline underline-offset-2"
        >
          View all projects →
        </Link>
        <Link
          href="/admin/settings"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors underline underline-offset-2"
        >
          Edit settings →
        </Link>
      </div>
    </div>
  );
}
