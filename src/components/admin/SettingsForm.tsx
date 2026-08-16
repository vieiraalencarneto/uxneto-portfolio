"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";

interface Props {
  settings: Record<string, string>;
}

export function SettingsForm({ settings }: Props) {
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setMessage("Settings saved.");
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors";
  const lbl =
    "block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted)] mb-1.5";
  const section = "border-t border-[var(--border)] pt-8 mt-8";

  return (
    <div className="max-w-2xl space-y-6">
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

      {/* About */}
      <div>
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--foreground)] mb-6">
          About
        </h2>
        <div className="space-y-5">
          <div>
            <label htmlFor="sf-bio" className={lbl}>
              Bio
            </label>
            <textarea
              id="sf-bio"
              value={form.about_bio ?? ""}
              onChange={(e) => set("about_bio", e.target.value)}
              rows={4}
              className={field}
              placeholder="Your bio shown on the portfolio..."
            />
          </div>
          <ImageUpload
            label="Profile photo"
            value={form.about_photo_url ?? ""}
            onChange={(url) => set("about_photo_url", url)}
          />
        </div>
      </div>

      {/* Contact */}
      <div className={section}>
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--foreground)] mb-6">
          Contact & Links
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="sf-email" className={lbl}>
              Email
            </label>
            <input
              id="sf-email"
              type="email"
              value={form.contact_email ?? ""}
              onChange={(e) => set("contact_email", e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="sf-linkedin" className={lbl}>
              LinkedIn URL
            </label>
            <input
              id="sf-linkedin"
              type="url"
              value={form.contact_linkedin ?? ""}
              onChange={(e) => set("contact_linkedin", e.target.value)}
              className={field}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label htmlFor="sf-github" className={lbl}>
              GitHub URL (optional)
            </label>
            <input
              id="sf-github"
              type="url"
              value={form.contact_github ?? ""}
              onChange={(e) => set("contact_github", e.target.value)}
              className={field}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className={section}>
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--foreground)] mb-6">
          Resume
        </h2>
        <ImageUpload
          label="Resume PDF"
          value={form.resume_url ?? ""}
          onChange={(url) => set("resume_url", url)}
          accept="application/pdf"
          bucket="portfolio"
        />
        <p className="text-[10px] text-[var(--muted)] mt-2">
          Upload a PDF. The link in the nav and contact section updates automatically.
        </p>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-[var(--foreground)] text-[var(--background)] px-6 py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </div>
  );
}
