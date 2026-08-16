/**
 * Idempotent CSV importer for uxneto portfolio projects.
 * Uses slug as reconciliation key. Supports --dry-run flag.
 *
 * Usage:
 *   npm run import:csv          # live import
 *   npm run import:csv:dry      # dry run (no DB writes)
 *
 * Required env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { resolve } from "path";
import type { Database } from "../src/types/database";
import { sanitizeHtml } from "../src/lib/sanitize";

const DRY_RUN = process.argv.includes("--dry-run");

const PROJECTS_CSV = resolve(process.env.PROJECTS_CSV ?? "../../Downloads/Projects.csv");

function log(msg: string) {
  process.stdout.write(`${msg}\n`);
}

interface RawRow {
  Slug: string;
  "Project TItle": string;
  Thumbnail: string;
  "Thumbnail:alt": string;
  Description: string;
  "Case Study Content": string;
}

function parseProjectsCsv(filePath: string): RawRow[] {
  const raw = readFileSync(filePath, "utf-8");
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as RawRow[];
}

async function main() {
  if (DRY_RUN) log("[DRY RUN] No database writes will occur.\n");

  const rows = parseProjectsCsv(PROJECTS_CSV);
  log(`Parsed ${rows.length} rows from Projects.csv\n`);

  if (DRY_RUN) {
    for (const row of rows) {
      const sanitized = sanitizeHtml(row["Case Study Content"] ?? "");
      log(`  slug: ${row.Slug}`);
      log(`  title: ${row["Project TItle"]}`);
      log(`  thumbnail: ${row.Thumbnail}`);
      log(`  content_length: ${sanitized.length}`);
      log("");
    }
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars",
    );
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const slug = row.Slug;
    const title = row["Project TItle"];
    const contentHtml = sanitizeHtml(row["Case Study Content"] ?? "");

    log(`[${i + 1}/${rows.length}] Processing: ${slug}`);

    const { data: existing } = await supabase
      .from("projects")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle();

    const payload = {
      slug,
      title,
      thumbnail_url: row.Thumbnail || null,
      thumbnail_alt: row["Thumbnail:alt"] || null,
      description: row.Description || null,
      content_html: contentHtml,
      published: false,
      sort_order: i + 1,
    };

    if (existing) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("slug", slug);

      if (error) {
        log(`  ERROR updating ${slug}: ${error.message}`);
        await supabase.from("migration_logs").insert({
          slug,
          source_file: "Projects.csv",
          status: "error",
          message: error.message,
        });
      } else {
        log(`  UPDATED: ${slug}`);
        await supabase.from("migration_logs").insert({
          slug,
          source_file: "Projects.csv",
          status: "skipped",
          message: "Updated existing record",
        });
      }
    } else {
      const { error } = await supabase.from("projects").insert(payload);

      if (error) {
        log(`  ERROR inserting ${slug}: ${error.message}`);
        await supabase.from("migration_logs").insert({
          slug,
          source_file: "Projects.csv",
          status: "error",
          message: error.message,
        });
      } else {
        log(`  INSERTED: ${slug}`);
        await supabase.from("migration_logs").insert({
          slug,
          source_file: "Projects.csv",
          status: "success",
          message: null,
        });
      }
    }
  }

  log("\nImport complete.");
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err.message}\n`);
  process.exit(1);
});
