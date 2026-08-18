/**
 * Migrates case study images from framerusercontent.com to Supabase Storage.
 *
 * For each src/content/[slug].html:
 *   1. Finds all <img src="https://framerusercontent.com/..."> URLs
 *   2. Downloads each image (skips if already uploaded — idempotent)
 *   3. Uploads to Supabase Storage bucket `case-study-images` under `framer/[filename]`
 *   4. Replaces the src in the HTML with the Supabase public URL
 *   5. Writes the updated HTML back to disk
 *
 * Usage:
 *   npm run migrate:images:dry    # dry run — no uploads, no file changes
 *   npm run migrate:images        # live run
 *
 * Required env (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Supabase pre-requisites:
 *   - Storage bucket named `case-study-images` created and set to public
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const DRY_RUN = process.argv.includes("--dry-run");
const BUCKET = "case-study-images";
const _FRAMER_ORIGIN = "https://framerusercontent.com";
const CONTENT_DIR = join(process.cwd(), "src/content");

const log = (msg: string) => process.stdout.write(`${msg}\n`);
const warn = (msg: string) => process.stderr.write(`  [warn] ${msg}\n`);

// Matches src="https://framerusercontent.com/images/..." (with or without query string)
const IMG_SRC_RE = /src="(https:\/\/framerusercontent\.com\/[^"]+)"/g;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseAny = any;

type UploadResult =
  | { status: "uploaded"; publicUrl: string }
  | { status: "exists"; publicUrl: string }
  | { status: "dry-run"; publicUrl: string }
  | { status: "error"; error: string };

async function getSupabasePublicUrl(supabase: SupabaseAny, path: string): Promise<string> {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadImage(
  supabase: SupabaseAny,
  url: string,
  storagePath: string,
): Promise<UploadResult> {
  const publicUrl = await getSupabasePublicUrl(supabase, storagePath);

  if (DRY_RUN) {
    return { status: "dry-run", publicUrl };
  }

  // Check if already uploaded
  const { data: existing, error: listError } = await supabase.storage
    .from(BUCKET)
    .list("framer", { search: basename(storagePath) });

  if (!listError && existing && existing.length > 0) {
    return { status: "exists", publicUrl };
  }

  // Download from framerusercontent
  let imageBuffer: ArrayBuffer;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { status: "error", error: `HTTP ${response.status} from ${url}` };
    }
    imageBuffer = await response.arrayBuffer();
  } catch (err) {
    return { status: "error", error: `Fetch failed: ${(err as Error).message}` };
  }

  // Detect content type from URL extension
  const ext = basename(url).split(".").pop()?.toLowerCase() ?? "png";
  const contentTypeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
  };
  const contentType = contentTypeMap[ext] ?? "image/png";

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, imageBuffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    // Supabase returns "The resource already exists" on duplicate — treat as exists
    if (uploadError.message.includes("already exists")) {
      return { status: "exists", publicUrl };
    }
    return { status: "error", error: uploadError.message };
  }

  return { status: "uploaded", publicUrl };
}

async function processFile(
  supabase: SupabaseAny,
  filePath: string,
): Promise<{ replaced: number; errors: number }> {
  const slug = basename(filePath, ".html");
  let html = readFileSync(filePath, "utf-8");

  // Collect unique framer URLs in this file
  const urlSet = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(IMG_SRC_RE.source, "g");
  while ((m = re.exec(html)) !== null) {
    urlSet.add(m[1]);
  }
  const urls = Array.from(urlSet);

  if (urls.length === 0) {
    log(`  ${slug}: no framerusercontent images — skipped`);
    return { replaced: 0, errors: 0 };
  }

  log(`  ${slug}: found ${urls.length} image(s)`);

  const replacements: Array<[string, string]> = [];
  let errors = 0;

  for (const url of urls) {
    // Strip query string for the storage filename, keep the hash for uniqueness
    const urlObj = new URL(url);
    const filename = basename(urlObj.pathname);
    const storagePath = `framer/${filename}`;

    const result = await uploadImage(supabase, url, storagePath);

    if (result.status === "error") {
      warn(`${filename}: ${result.error}`);
      errors++;
      continue;
    }

    replacements.push([url, result.publicUrl]);
    const label = result.status === "exists" ? "exists" : result.status;
    log(`    [${label}] ${filename}`);
  }

  if (replacements.length > 0 && !DRY_RUN) {
    for (const [original, replacement] of replacements) {
      html = html.split(`src="${original}"`).join(`src="${replacement}"`);
    }
    writeFileSync(filePath, html, "utf-8");
    log(`  ${slug}: updated ${replacements.length} src(s) in file`);
  }

  return { replaced: replacements.length, errors };
}

async function main() {
  if (DRY_RUN) log("[DRY RUN] No uploads or file writes will occur.\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
        "Add them to .env.local and run with: node --env-file=.env.local",
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Verify bucket exists and is accessible
  if (!DRY_RUN) {
    const { error } = await supabase.storage.from(BUCKET).list("framer", { limit: 1 });
    if (error) {
      throw new Error(
        `Cannot access bucket "${BUCKET}": ${error.message}\n` +
          "Create it in Supabase Dashboard > Storage > New bucket > name: case-study-images > Public: true",
      );
    }
  }

  const files = readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".html"))
    .map((f) => join(CONTENT_DIR, f));

  log(`Processing ${files.length} content files...\n`);

  let totalReplaced = 0;
  let totalErrors = 0;

  for (const file of files) {
    const { replaced, errors } = await processFile(supabase, file);
    totalReplaced += replaced;
    totalErrors += errors;
  }

  log(`\nDone. ${totalReplaced} image(s) processed, ${totalErrors} error(s).`);

  if (totalErrors > 0) process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`\nFatal: ${err.message}\n`);
  process.exit(1);
});
