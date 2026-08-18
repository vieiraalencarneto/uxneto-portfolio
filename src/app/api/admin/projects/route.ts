import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function service() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function requireAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    slug,
    title,
    description,
    label,
    role,
    date,
    accent_color,
    thumbnail_url,
    thumbnail_alt,
    content_html,
    content_html_pt,
    published,
    sort_order,
  } = body;

  if (!slug || !title)
    return NextResponse.json({ error: "slug and title are required" }, { status: 400 });

  const { data, error } = await service()
    .from("projects")
    .insert({
      slug,
      title,
      description,
      label,
      role,
      date,
      accent_color,
      thumbnail_url,
      thumbnail_alt,
      content_html,
      content_html_pt,
      published: published ?? false,
      sort_order: sort_order ?? 99,
    })
    .select("slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
