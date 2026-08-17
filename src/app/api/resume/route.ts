import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "resume_url")
    .single();

  const url = data?.value;
  if (!url) return new NextResponse("Resume not found", { status: 404 });

  return NextResponse.redirect(url, { status: 302 });
}
