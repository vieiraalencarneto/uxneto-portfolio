import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 5;

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function getRecentFailures(email: string): Promise<number> {
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
  const { count } = await serviceClient()
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("identifier", email)
    .eq("success", false)
    .gte("attempted_at", since);
  return count ?? 0;
}

async function recordAttempt(email: string, success: boolean) {
  await serviceClient().from("login_attempts").insert({ identifier: email, success });
}

export async function POST(request: NextRequest) {
  try {
    const { email, cpf, password } = await request.json();

    if (!email || !cpf || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Rate limit check
    const failures = await getRecentFailures(email);
    if (failures >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`,
          locked: true,
        },
        { status: 429 },
      );
    }

    // CPF verification (server-side only, never logged)
    const cpfClean = cpf.replace(/\D/g, "");
    const cpfHash = process.env.ADMIN_CPF_HASH;
    if (!cpfHash) {
      return NextResponse.json({ error: "Admin not configured." }, { status: 500 });
    }
    const cpfValid = await bcrypt.compare(cpfClean, cpfHash);

    if (!cpfValid) {
      await recordAttempt(email, false);
      const remaining = MAX_ATTEMPTS - failures - 1;
      return NextResponse.json(
        {
          error: `Invalid credentials. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
        },
        { status: 401 },
      );
    }

    // Supabase Auth
    const cookieStore = await cookies();
    const response = NextResponse.json({ success: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, {
                ...options,
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
            }
          },
        },
      },
    );

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      await recordAttempt(email, false);
      const remaining = MAX_ATTEMPTS - failures - 1;
      return NextResponse.json(
        {
          error: `Invalid credentials. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
        },
        { status: 401 },
      );
    }

    await recordAttempt(email, true);
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
