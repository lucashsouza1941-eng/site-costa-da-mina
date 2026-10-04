// Pós-build: o Next 16 (output: 'export') grava os segmentos de prefetch em
// subpastas, ex. out/apoie/__next.apoie/__PAGE__.txt, mas o navegador os
// pede com os nomes unidos por ponto: out/apoie/__next.apoie.__PAGE__.txt.
// Sem servidor para reescrever URLs (GitHub Pages), criamos as cópias com o
// nome esperado. Evita 404 no console e prefetch desperdiçado.
import { cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../out/', import.meta.url));
let copias = 0;

function arquivosEm(dir) {
  return readdirSync(dir).flatMap((n) => {
    const c = join(dir, n);
    return statSync(c).isDirectory() ? arquivosEm(c) : [c];
  });
}

function percorrer(dir) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (!statSync(caminho).isDirectory()) continue;
    if (nome.startsWith('__next.')) {
      for (const arquivo of arquivosEm(caminho)) {
        const achatado = join(dir, relative(dir, arquivo).split(sep).join('.'));
        if (!existsSync(achatado)) {
          cpSync(arquivo, achatado);
          copias++;
        }
      }
    } else if (nome !== '_next') {
      percorrer(caminho);
    }
  }
}

if (existsSync(out)) percorrer(out);
console.log(`Prefetch: ${copias} arquivos de segmento com o nome esperado pelo navegador.`);
