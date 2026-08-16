"use client";

import { useRouter } from "next/navigation";

export function AdminLogout() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-[var(--muted)] text-xs hover:text-[var(--foreground)] transition-colors"
    >
      Sign out
    </button>
  );
}
