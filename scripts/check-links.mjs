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

// Alguns sites bloqueiam requisições automatizadas mesmo estando no ar
// (ex.: LinkedIn responde 999 a bots). Isso não é um link quebrado — é
// reportado como aviso, não como falha.
const botBlockStatuses = new Set([403, 429, 999]);

let ok = 0;
let warned = 0;
let failed = 0;

for (const url of [...urls].sort()) {
  try {
    const response = await fetch(url, { redirect: 'follow' });

    if (response.status < 400) {
      ok += 1;
      console.log(`ok   ${response.status} ${url}`);
    } else if (botBlockStatuses.has(response.status)) {
      warned += 1;
      console.log(`WARN ${response.status} ${url} — bloqueio a bot, verificar manualmente`);
    } else {
      failed += 1;
      console.log(`FAIL ${response.status} ${url}`);
    }
  } catch (error) {
    failed += 1;
    console.log(`FAIL err ${url} — ${error.message}`);
  }
}

console.log(`\n${urls.size} links: ${ok} ok, ${warned} com aviso, ${failed} com falha`);
process.exit(failed > 0 ? 1 : 0);
