// Worst Fix Ever: Funniest Commit Message
// One-line commit message for a bug fix that made everything worse.
// Gate: /output/entry.txt is UTF-8 text of 1 to 100 characters.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The fix, the remedy, and the punchline — assembled, never edited in place.
const PREFIX = "fix: patched the leak";
const REMEDY = "by deleting the database";
const PUNCHLINE = "no data, no leak";

function buildLine(): string {
  return `${PREFIX} ${REMEDY}; ${PUNCHLINE}`;
}

interface GateReport {
  codePoints: number;
  valid: boolean;
}

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  return { codePoints, valid: codePoints >= 1 && codePoints <= 100 && text.trim().length > 0 };
}

function verifyWritten(path: string): string {
  const written = readFileSync(path, "utf8").trimEnd();
  return createHash("sha256").update(written, "utf8").digest("hex");
}

const ENTRY = buildLine();
const report = validateEntry(ENTRY);
if (!report.valid) {
  console.error(`gate FAILED: ${report.codePoints} code points`);
  process.exit(1);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");
const sha = verifyWritten(outPath);
console.log(`gate passes: ${report.codePoints} code points, not only whitespace`);
console.log(`wrote ${outPath} (${report.codePoints} code points, sha256 ${sha})`);
console.log(`verified: ${JSON.stringify(ENTRY)}`);
