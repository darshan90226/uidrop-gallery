// Reads every file in /snippets, parses its header comment, and writes src/snippets.json.
// Run with --strict (npm run validate) to fail on any problem. Used in CI for pull requests.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'snippets');
const strict = process.argv.includes('--strict');
const CATEGORIES = ['Buttons', 'Forms', 'Cards', 'Loaders', 'Navigation', 'Layout'];
const MAX_BYTES = 8000;
const problems = [];
const out = [];

for (const file of readdirSync(dir).filter((f) => f.endsWith('.html')).sort()) {
  const raw = readFileSync(join(dir, file), 'utf8');
  const m = raw.match(/^\s*<!--([\s\S]*?)-->\s*([\s\S]*)$/);
  if (!m) { problems.push(`${file}: missing header comment`); continue; }
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*(\w+):\s*(.+?)\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  const code = m[2].trim();
  if (!meta.title) problems.push(`${file}: header needs "title:"`);
  if (!meta.author) problems.push(`${file}: header needs "author:"`);
  if (!CATEGORIES.includes(meta.category)) problems.push(`${file}: category must be one of ${CATEGORIES.join(', ')}`);
  if (/<script/i.test(code)) problems.push(`${file}: <script> is not allowed`);
  if (/https?:\/\//i.test(code.replace(/xmlns="[^"]*"/g, ''))) problems.push(`${file}: external URLs are not allowed`);
  if (Buffer.byteLength(code) > MAX_BYTES) problems.push(`${file}: larger than ${MAX_BYTES} bytes`);
  out.push({ id: file.replace(/\.html$/, ''), title: meta.title, author: meta.author, category: meta.category, code });
}

if (problems.length) {
  console.error(problems.join('\n'));
  if (strict) process.exit(1);
}
writeFileSync(join(root, 'src', 'snippets.json'), JSON.stringify(out, null, 2));
console.log(`Built ${out.length} snippets${problems.length ? ` (${problems.length} problems)` : ''}.`);
