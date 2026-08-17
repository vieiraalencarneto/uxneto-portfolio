"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

export function LocaleSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const current = (params?.locale as string) ?? "en";

  function switchTo(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    const next = pathname.replace(/^\/(en|pt)/, `/${locale}`);
    router.push(next);
  }

  return (
    <div className="flex items-center gap-1.5 ml-2">
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors duration-150 ${
          current === "en"
            ? "text-[var(--foreground)]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
        aria-current={current === "en" ? "true" : undefined}
      >
        EN
      </button>
      <span className="text-[var(--border)] text-[10px] select-none">/</span>
      <button
        type="button"
        onClick={() => switchTo("pt")}
        className={`text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors duration-150 ${
          current === "pt"
            ? "text-[var(--foreground)]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
        aria-current={current === "pt" ? "true" : undefined}
      >
        PT
      </button>
    </div>
  );
}
