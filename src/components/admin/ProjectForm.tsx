"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ImageUpload } from "./ImageUpload";
import { RichEditor } from "./RichEditor";

type ProjectData = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  label: string;
  role: string;
  date: string;
  accent_color: string;
  thumbnail_url: string;
  thumbnail_alt: string;
  content_html: string;
  content_html_pt: string;
  published: boolean;
  sort_order: number;
};

interface Props {
  project?: Partial<ProjectData>;
  isNew?: boolean;
}

const ACCENT_OPTIONS = [
  { label: "Yellow", value: "#fde440" },
  { label: "Lavender", value: "#c6bffa" },
  { label: "Mint", value: "#56d270" },
];

export function ProjectForm({ project, isNew = false }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [contentTab, setContentTab] = useState<"en" | "pt">("en");
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");

  const [form, setForm] = useState<ProjectData>({
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    description: project?.description ?? "",
    label: project?.label ?? "CASE STUDY",
    role: project?.role ?? "Product Designer",
    date: project?.date ?? "",
    accent_color: project?.accent_color ?? "#fde440",
    thumbnail_url: project?.thumbnail_url ?? "",
    thumbnail_alt: project?.thumbnail_alt ?? "",
    content_html: project?.content_html ?? "",
    content_html_pt: project?.content_html_pt ?? "",
    published: project?.published ?? false,
    sort_order: project?.sort_order ?? 99,
  });

  function set(key: keyof ProjectData, value: string | boolean | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    setError("");
    setMessage("");

    const payload = { ...form };
    if (publish !== undefined) payload.published = publish;

    try {
      const res = await fetch(`/api/admin/projects${isNew ? "" : `/${form.slug}`}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setMessage(publish ? "Published!" : "Saved.");
      if (isNew) {
        startTransition(() => router.push(`/admin/projects/${data.slug}`));
      } else {
        startTransition(() => router.refresh());
      }
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/projects/${form.slug}`, { method: "DELETE" });
      startTransition(() => router.push("/admin/projects"));
    } finally {
      setSaving(false);
    }
  }

  async function handleTranslate() {
    const from = contentTab;
    const to = contentTab === "en" ? "pt" : "en";
    const sourceHtml = contentTab === "en" ? form.content_html : form.content_html_pt;
    if (!sourceHtml) return;

    setTranslating(true);
    setTranslateError("");
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_html: sourceHtml, from, to }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTranslateError(data.error || "Translation failed");
        return;
      }
      set(to === "pt" ? "content_html_pt" : "content_html", data.content_html);
      setContentTab(to);
    } catch {
      setTranslateError("Connection error.");
    } finally {
      setTranslating(false);
    }
  }

  const field =
    "w-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors";
  const label =
    "block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted)] mb-1.5";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-[var(--foreground)]">
          {isNew ? "New project" : form.title || "Edit project"}
        </h1>
        <div className="flex items-center gap-3">
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="text-xs text-[var(--ember-red)] hover:opacity-70 transition-opacity disabled:opacity-40"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving || isPending}
            className="text-xs border border-[var(--border)] px-4 py-2 hover:bg-[var(--border)] transition-colors disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving || isPending}
            className="text-xs bg-[var(--foreground)] text-[var(--background)] px-4 py-2 font-semibold hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {form.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {message && (
        <p className="text-xs text-[var(--mint-chip)] border border-[var(--mint-chip)]/30 bg-[var(--mint-chip)]/5 px-3 py-2">
          {message}
        </p>
      )}
      {error && (
        <p className="text-xs text-[var(--ember-red)] border border-[var(--ember-red)]/30 bg-[var(--ember-red)]/5 px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="pf-title" className={label}>
            Title
          </label>
          <input
            id="pf-title"
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={field}
            placeholder="Project title"
          />
        </div>
        <div>
          <label htmlFor="pf-slug" className={label}>
            Slug (URL)
          </label>
          <input
            id="pf-slug"
            type="text"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            className={field}
            placeholder="my-project-name"
            disabled={!isNew}
          />
          {!isNew && (
            <p className="text-[10px] text-[var(--muted)] mt-1">
              Slug cannot be changed after creation.
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pf-description" className={label}>
            Short description
          </label>
          <textarea
            id="pf-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className={field}
            placeholder="One or two sentences shown on the project card."
          />
        </div>
        <div>
          <label htmlFor="pf-label" className={label}>
            Label
          </label>
          <input
            id="pf-label"
            type="text"
            value={form.label}
            onChange={(e) => set("label", e.target.value)}
            className={field}
            placeholder="CASE STUDY"
          />
        </div>
        <div>
          <label htmlFor="pf-role" className={label}>
            Role
          </label>
          <input
            id="pf-role"
            type="text"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            className={field}
            placeholder="Product Designer"
          />
        </div>
        <div>
          <label htmlFor="pf-date" className={label}>
            Date / Period
          </label>
          <input
            id="pf-date"
            type="text"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className={field}
            placeholder="2023 — 2025"
          />
        </div>
        <div>
          <label htmlFor="pf-sort" className={label}>
            Sort order
          </label>
          <input
            id="pf-sort"
            type="number"
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
            className={field}
            min={1}
          />
        </div>
        <div>
          <p className={label}>Accent color</p>
          <div className="flex gap-2">
            {ACCENT_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => set("accent_color", o.value)}
                className={`w-8 h-8 border-2 transition-all ${form.accent_color === o.value ? "border-[var(--foreground)] scale-110" : "border-transparent"}`}
                style={{ backgroundColor: o.value }}
                title={o.label}
              />
            ))}
            <input
              type="color"
              value={form.accent_color}
              onChange={(e) => set("accent_color", e.target.value)}
              className="w-8 h-8 cursor-pointer border border-[var(--border)]"
              title="Custom color"
            />
          </div>
        </div>
        <div>
          <p className={label}>Published</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-[var(--muted)]">Visible on portfolio</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="pf-thumb-alt" className={label}>
          Thumbnail alt text
        </label>
        <input
          id="pf-thumb-alt"
          type="text"
          value={form.thumbnail_alt}
          onChange={(e) => set("thumbnail_alt", e.target.value)}
          className={field}
          placeholder="Brief description of the image"
        />
      </div>

      <ImageUpload
        label="Thumbnail image"
        value={form.thumbnail_url}
        onChange={(url) => set("thumbnail_url", url)}
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {(["en", "pt"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setContentTab(tab)}
                className={`text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${
                  contentTab === tab
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={
              translating || !(contentTab === "en" ? form.content_html : form.content_html_pt)
            }
            className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40"
          >
            {translating
              ? "Traduzindo..."
              : `Auto-traduzir para ${contentTab === "en" ? "PT" : "EN"}`}
          </button>
        </div>
        {translateError && (
          <p className="text-[10px] text-[var(--ember-red)] mb-2">{translateError}</p>
        )}
        {contentTab === "en" ? (
          <RichEditor
            key="content-en"
            content={form.content_html}
            onChange={(html) => set("content_html", html)}
            placeholder="Write the full case study here (English)..."
          />
        ) : (
          <RichEditor
            key="content-pt"
            content={form.content_html_pt}
            onChange={(html) => set("content_html_pt", html)}
            placeholder="Escreva o case study completo aqui (Portugues)..."
          />
        )}
      </div>
    </div>
  );
}
