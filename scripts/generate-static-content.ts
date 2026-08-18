/**
 * Reads Projects.csv, sanitizes each case study HTML, and writes to src/content/[slug].html
 * Run: npx tsx scripts/generate-static-content.ts
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { sanitizeHtml } from "../src/lib/sanitize";

const ROOT = resolve(__dirname, "..");
const CSV_PATH = resolve(process.env.PROJECTS_CSV ?? join(ROOT, "../../Downloads/Projects.csv"));
const OUT_DIR = join(ROOT, "src/content");

interface RawRow {
  Slug: string;
  "Project TItle": string;
  Thumbnail: string;
  "Thumbnail:alt": string;
  Description: string;
  "Case Study Content": string;
}

mkdirSync(OUT_DIR, { recursive: true });

const raw = readFileSync(CSV_PATH, "utf-8");
const rows = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
}) as RawRow[];

for (const row of rows) {
  const slug = row.Slug;
  const html = row["Case Study Content"] ?? "";
  const sanitized = sanitizeHtml(html);
  const outPath = join(OUT_DIR, `${slug}.html`);
  writeFileSync(outPath, sanitized, "utf-8");
  process.stdout.write(`  wrote: src/content/${slug}.html (${sanitized.length} chars)\n`);
}

process.stdout.write(`\nDone. ${rows.length} files written to src/content/\n`);
