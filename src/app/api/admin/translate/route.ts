import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const client = new Anthropic();

const LANG_NAMES: Record<string, string> = {
  en: "English",
  pt: "Brazilian Portuguese",
};

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

  const { content_html, from, to } = await request.json();
  if (!content_html || !from || !to || !LANG_NAMES[from] || !LANG_NAMES[to]) {
    return NextResponse.json({ error: "content_html, from, and to are required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `Translate the following HTML content from ${LANG_NAMES[from]} to ${LANG_NAMES[to]}.

Rules:
- Preserve all HTML tags and attributes exactly as-is
- Only translate the visible text content between tags
- Do not translate URLs, slugs, code snippets, or proper nouns (tool names, company names, brand names)
- Output ONLY the translated HTML, no explanation or preamble

HTML:
${content_html}`,
      },
    ],
  });

  const translated = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  return NextResponse.json({ content_html: translated });
}
