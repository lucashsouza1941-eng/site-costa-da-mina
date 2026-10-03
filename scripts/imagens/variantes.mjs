// Gera as variantes responsivas (WebP por largura) de todas as matrizes em
// public/images para public/_img. Roda antes do build e do dev.
// Só refaz o que mudou (compara datas).
import { readdir, stat, mkdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { LARGURAS, caminhoDaVariante } from '../../src/lib/imagens/larguras.ts';

const publico = fileURLToPath(new URL('../../public/', import.meta.url));
const pastaImagens = join(publico, 'images');

async function listar(dir) {
  const saida = [];
  for (const nome of await readdir(dir, { withFileTypes: true })) {
    const c = join(dir, nome.name);
    if (nome.isDirectory()) saida.push(...(await listar(c)));
    else if (nome.name.endsWith('.webp')) saida.push(c);
  }
  return saida;
}

const data = (c) => stat(c).then((s) => s.mtimeMs, () => 0);

let geradas = 0;
let mantidas = 0;
for (const matriz of await listar(pastaImagens)) {
  const src = '/' + relative(publico, matriz).split(/[\\/]/).join('/');
  const quando = await data(matriz);
  const { width } = await sharp(matriz).metadata();
  const grafico = /\/marca\b|marca\.webp|cartaz|banner|ilustracao|padrao/.test(src);

  for (const largura of LARGURAS) {
    const destino = join(publico, caminhoDaVariante(src, largura).slice(1));
    if ((await data(destino)) >= quando) {
      mantidas++;
      continue;
    }
    await mkdir(dirname(destino), { recursive: true });
    await sharp(matriz)
      .resize({ width: Math.min(largura, width), withoutEnlargement: true })
      .webp(grafico ? { quality: 88, alphaQuality: 100 } : { quality: 74, effort: 5 })
      .toFile(destino);
    geradas++;
  }
}
console.log(`Variantes de imagem: ${geradas} geradas, ${mantidas} já atualizadas.`);
