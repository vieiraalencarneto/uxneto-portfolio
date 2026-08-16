/**
 * Run once to generate your admin credentials hash.
 * Usage: npx tsx scripts/setup-admin-credentials.ts
 *
 * Add the output to your .env.local file.
 * NEVER commit .env.local to git.
 */

import * as readline from "node:readline";
import bcrypt from "bcryptjs";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    if (hidden) process.stdout.write(question);
    rl.question(hidden ? "" : question, (answer) => {
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("\n=== Admin Credentials Setup ===\n");

  const cpf = await ask("Enter your CPF (numbers only, e.g. 12345678901): ");
  const cpfClean = cpf.replace(/\D/g, "");

  if (cpfClean.length !== 11) {
    console.error("CPF must have 11 digits.");
    process.exit(1);
  }

  const cpfHash = await bcrypt.hash(cpfClean, 12);

  console.log("\n✅ Add these lines to your .env.local:\n");
  console.log(`ADMIN_CPF_HASH="${cpfHash}"`);
  console.log("\nAlso make sure your Supabase Auth user (email + password) is created at:");
  console.log("https://supabase.com/dashboard/project/qnzyhneecnbovtpwkyfg/auth/users\n");

  rl.close();
}

main();
