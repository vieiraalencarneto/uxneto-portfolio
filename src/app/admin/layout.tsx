import Link from "next/link";
import { AdminLogout } from "@/components/admin/AdminLogout";
import { LogoMark } from "@/components/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <LogoMark className="h-7 w-auto text-[var(--foreground)]" />
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-[0.1em]">
              Admin
            </span>
          </Link>
          <nav className="flex gap-5">
            <Link
              href="/admin"
              className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/projects"
              className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/admin/settings"
              className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
            title="Back to portfolio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Portfolio
          </Link>
          <AdminLogout />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
