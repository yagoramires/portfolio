import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/content';
const urls = new Set();

for (const file of readdirSync(dir)) {
  const source = readFileSync(join(dir, file), 'utf8');
  for (const match of source.matchAll(/https?:\/\/[^\s'"`]+/g)) {
    urls.add(match[0]);
  }
}

let failed = 0;

for (const url of [...urls].sort()) {
  try {
    const response = await fetch(url, { redirect: 'follow' });
    const ok = response.status < 400;
    if (!ok) failed += 1;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${response.status} ${url}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL err ${url} — ${error.message}`);
  }
}

console.log(`\n${urls.size} links, ${failed} com falha`);
process.exit(failed > 0 ? 1 : 0);
