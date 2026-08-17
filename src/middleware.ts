import { type CookieOptions, createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PORTUGUESE_COUNTRIES = new Set(["BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL"]);

function detectLocale(request: NextRequest): "en" | "pt" {
  // 1. Manual override via cookie
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie === "en" || cookie === "pt") return cookie;

  // 2. Vercel IP country header (set automatically on Vercel deployments)
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  if (PORTUGUESE_COUNTRIES.has(country)) return "pt";

  // 3. Accept-Language header as local dev / non-Vercel fallback
  const lang = request.headers.get("accept-language") ?? "";
  if (lang.toLowerCase().startsWith("pt")) return "pt";

  return "en";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin: protect with Supabase auth ──────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
            for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
            response = NextResponse.next({ request });
            for (const { name, value, options } of cookiesToSet)
              response.cookies.set(name, value, options);
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return response;
  }

  // ── Static / API routes: pass through ──────────────────────
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(.+)$/.test(pathname) // static files (images, pdf, etc.)
  ) {
    return NextResponse.next();
  }

  // ── Already locale-prefixed: pass through ──────────────────
  if (pathname.startsWith("/en") || pathname.startsWith("/pt")) {
    return NextResponse.next();
  }

  // ── Unprefixed public routes: redirect to locale version ───
  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  // Persist detected locale in cookie so root layout gets it for <html lang>
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
