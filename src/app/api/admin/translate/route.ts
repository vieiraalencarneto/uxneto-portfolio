import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LANG_MAP: Record<string, string> = { en: "en", pt: "pt-BR" };
const SEP = " ||| ";

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

async function myMemoryTranslate(text: string, from: string, to: string): Promise<string> {
  const langpair = `${LANG_MAP[from] ?? from}|${LANG_MAP[to] ?? to}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("MyMemory request failed");
  const data = await res.json();
  if (data.responseStatus !== 200) throw new Error(data.responseDetails ?? "Translation failed");
  return data.responseData.translatedText as string;
}

async function translateHtml(html: string, from: string, to: string): Promise<string> {
  // Extract text nodes between HTML tags, replace with placeholders
  const segments: string[] = [];
  const template = html.replace(/>([^<]+)</g, (_match, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return `>${text}<`;
    const idx = segments.length;
    segments.push(trimmed);
    return `>{{${idx}}}<`;
  });

  if (segments.length === 0) return html;

  // Batch segments up to ~450 chars each to stay within MyMemory limits
  const translated = new Array<string>(segments.length);
  let batchText = "";
  let batchIndices: number[] = [];

  async function flush() {
    if (!batchIndices.length) return;
    const result = await myMemoryTranslate(batchText, from, to);
    const parts = result.split(SEP);
    batchIndices.forEach((idx, i) => {
      translated[idx] = parts[i]?.trim() ?? segments[idx];
    });
    batchText = "";
    batchIndices = [];
  }

  for (let i = 0; i < segments.length; i++) {
    const addition = batchText ? SEP + segments[i] : segments[i];
    if (batchText.length + addition.length > 450) {
      await flush();
    }
    batchText = batchText ? batchText + SEP + segments[i] : segments[i];
    batchIndices.push(i);
  }
  await flush();

  return template.replace(
    /\{\{(\d+)\}\}/g,
    (_: string, i: string) => translated[Number(i)] ?? segments[Number(i)],
  );
}

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content_html, from, to } = await request.json();
  if (!content_html || !from || !to || !LANG_MAP[from] || !LANG_MAP[to]) {
    return NextResponse.json({ error: "content_html, from, and to are required" }, { status: 400 });
  }

  try {
    const result = await translateHtml(content_html, from, to);
    return NextResponse.json({ content_html: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
