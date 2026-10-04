// Baixa as imagens oficiais do site atual, trata (recorte, quadro de GIF ou
// de vídeo, versão branca do logo) e salva as matrizes em public/images.
// Gera src/content/acervo.gerado.json e docs/IMAGENS.md.
//
// Uso (precisa de internet; rode só quando o acervo mudar):
//   npm run imagens:baixar
// Quadros de vídeo usam o ffmpeg: defina FFMPEG=/caminho/do/ffmpeg se ele
// não estiver no PATH.
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { fontes, videos, excluidas, urlDe } from './fontes.mjs';

const raiz = fileURLToPath(new URL('../../', import.meta.url));
const cache = join(raiz, '.cache/imagens-originais');
const publico = join(raiz, 'public');
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const LARGURA_MAXIMA = 2400;

const existe = (c) => access(c).then(() => true, () => false);

async function baixar(origem) {
  const destino = join(cache, origem.replaceAll('/', '_'));
  if (await existe(destino)) return readFile(destino);
  for (let tentativa = 1; tentativa <= 4; tentativa++) {
    try {
      const r = await fetch(urlDe(origem), { headers: { 'User-Agent': 'Mozilla/5.0 (site-costa-da-mina)' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const dados = Buffer.from(await r.arrayBuffer());
      await mkdir(cache, { recursive: true });
      await writeFile(destino, dados);
      console.log(`  ↓ ${origem} (${Math.round(dados.length / 1024)} KB)`);
      return dados;
    } catch (e) {
      if (tentativa === 4) throw new Error(`Falha ao baixar ${origem}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 1500 * tentativa));
    }
  }
}

function executar(args, entrada) {
  return new Promise((resolver, rejeitar) => {
    const p = spawn(ffmpeg, args);
    const partes = [];
    let erro = '';
    p.stdout.on('data', (d) => partes.push(d));
    p.stderr.on('data', (d) => (erro += d));
    p.on('error', () => rejeitar(new Error(`ffmpeg não encontrado (${ffmpeg}). Defina FFMPEG.`)));
    p.on('close', (codigo) => (codigo === 0 ? resolver(Buffer.concat(partes)) : rejeitar(new Error(erro.slice(-400)))));
    if (entrada) p.stdin.end(entrada);
  });
}

async function quadroDeVideo(origem, segundo) {
  const arquivo = join(cache, origem.replaceAll('/', '_'));
  await baixar(origem);
  return executar(['-loglevel', 'error', '-ss', String(segundo), '-i', arquivo, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-']);
}

/** Versão para fundo escuro: roxo vira branco; amarelo (e o que está dentro dele) fica. */
async function versaoBranca(entrada) {
  const { data, info } = await sharp(entrada).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const amarelo = (r, g, b) => r > 170 && g > 120 && b < 120 && r - b > 90;

  // Faixa amarela vertical onde fica "INSTITUTO" (texto roxo que deve
  // continuar roxo): colunas, no quarto esquerdo, com amarelo em boa parte
  // da altura. Detalhes amarelos dentro das letras não entram.
  const amareloPorColuna = [];
  for (let x = 0; x < Math.floor(w * 0.25); x++) {
    let n = 0;
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] > 200 && amarelo(data[i], data[i + 1], data[i + 2])) n++;
    }
    amareloPorColuna.push(n);
  }
  const maximo = Math.max(...amareloPorColuna);
  let minX = amareloPorColuna.findIndex((n) => n > maximo * 0.5);
  let maxX = minX;
  // a faixa vai até o vão transparente que a separa da primeira letra
  while (minX >= 0 && maxX + 1 < amareloPorColuna.length && amareloPorColuna[maxX + 1] > 0) maxX++;
  let minY = h, maxY = -1;
  for (let y = 0; y < h && minX >= 0; y++) {
    for (let x = minX; x <= maxX; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] > 200 && amarelo(data[i], data[i + 1], data[i + 2])) {
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  const temFaixa = minX >= 0 && maxX - minX > w * 0.02 && maxY - minY > h * 0.4;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] === 0) continue;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (amarelo(r, g, b)) continue;
      if (temFaixa && x >= minX && x <= maxX && y >= minY && y <= maxY) continue;
      data[i] = data[i + 1] = data[i + 2] = 255;
    }
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function processar(f) {
  let imagem;
  if (f.segundo !== undefined) {
    imagem = sharp(await quadroDeVideo(f.origem, f.segundo));
  } else if (f.quadro !== undefined) {
    imagem = sharp(await baixar(f.origem), { page: f.quadro });
  } else {
    imagem = sharp(await baixar(f.origem));
  }
  if (f.recorte) {
    const [x0, y0, x1, y1] = f.recorte;
    imagem = imagem.extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 });
  }
  let buffer = await imagem.png().toBuffer();
  if (f.derivar === 'branco') buffer = await versaoBranca(buffer);

  const ehArte = f.tipo === 'marca' || f.tipo === 'grafico';
  const saida = await sharp(buffer)
    .resize({ width: LARGURA_MAXIMA, withoutEnlargement: true })
    .webp(ehArte ? { quality: 92, alphaQuality: 100, effort: 6 } : { quality: 86, effort: 6 })
    .toBuffer({ resolveWithObject: true });

  const caminho = join(publico, 'images', `${f.destino}.webp`);
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, saida.data);
  console.log(`  ✓ ${f.destino}.webp ${saida.info.width}×${saida.info.height} (${Math.round(saida.data.length / 1024)} KB)`);

  return {
    src: `/images/${f.destino}.webp`,
    largura: saida.info.width,
    altura: saida.info.height,
    alt: f.alt,
    categoria: f.categoria,
    tipo: f.tipo ?? 'foto',
    galeria: Boolean(f.galeria),
    origem: urlDe(f.origem) + (f.recorte ? ` (recorte ${f.recorte.join(',')})` : '') + (f.quadro !== undefined ? ` (quadro ${f.quadro})` : '') + (f.segundo !== undefined ? ` (vídeo, ${f.segundo}s)` : ''),
    ...(f.nota ? { nota: f.nota } : {}),
  };
}

async function processarVideo(v) {
  const entrada = join(cache, v.origem.replaceAll('/', '_'));
  await baixar(v.origem);
  const destino = join(publico, v.destino);
  await mkdir(dirname(destino), { recursive: true });
  await executar(['-loglevel', 'error', '-y', '-i', entrada, '-vf', 'scale=480:-2', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', destino]);
  console.log(`  ✓ ${v.destino}`);
  return { src: `/${v.destino}`, capa: v.capa, descricao: v.descricao, origem: urlDe(v.origem) };
}

const ids = new Set();
for (const f of fontes) {
  if (ids.has(f.id)) throw new Error(`id repetido: ${f.id}`);
  ids.add(f.id);
}

console.log(`Processando ${fontes.length} imagens…`);
const imagens = {};
for (const f of fontes) imagens[f.id] = await processar(f);
const listaVideos = {};
for (const v of videos) listaVideos[v.id] = await processarVideo(v);

await writeFile(
  join(raiz, 'src/content/acervo.gerado.json'),
  JSON.stringify({ aviso: 'Gerado por scripts/imagens/baixar.mjs. Não edite à mão.', imagens, videos: listaVideos }, null, 2) + '\n',
);

// ---------------------------------------------------------- inventário
const linhas = [
  '# Inventário de imagens',
  '',
  'Gerado por `npm run imagens:baixar` a partir de `scripts/imagens/fontes.mjs`. Não edite à mão.',
  '',
  'Todas as imagens abaixo foram baixadas do site atual (institutocostadamina.com.br) e são servidas pelo próprio site, sem hotlink. As matrizes ficam em `public/images` (WebP). As variantes por largura são geradas no build em `public/_img` (`npm run imagens:variantes`).',
  '',
  '## Em uso',
  '',
  '| Arquivo | Tamanho | Categoria | Galeria | Origem | Texto alternativo |',
  '| --- | --- | --- | :-: | --- | --- |',
  ...Object.values(imagens).map(
    (i) => `| \`${i.src}\` | ${i.largura}×${i.altura} | ${i.categoria} | ${i.galeria ? 'sim' : ''} | ${i.origem.replace('https://institutocostadamina.com.br/wp-content/uploads/', '')} | ${i.alt || '(decorativa)'}${i.nota ? ` — ${i.nota}` : ''} |`,
  ),
  '',
  '## Vídeos',
  '',
  ...Object.values(listaVideos).map((v) => `- \`${v.src}\`: ${v.descricao} Origem: ${v.origem}`),
  '',
  '## Deixadas de fora',
  '',
  '| Origem | Motivo |',
  '| --- | --- |',
  ...excluidas.map((e) => `| ${e.origem} | ${e.motivo} |`),
  '',
  '## Ainda faltam (pedir ao Instituto)',
  '',
  'O design aprovado pede fotografias grandes que o site atual não tem. Até chegarem, as seções usam o que há de oficial (ver pendência "Fotos em alta resolução").',
  '',
  '| Seção | O que falta | Hoje |',
  '| --- | --- | --- |',
  '| Hero | Foto horizontal, 1920 px ou mais, de pessoas do Instituto no território | Ilustração Brasil–África + foto da oficina |',
  '| Sobre o Instituto | Retrato da fundadora (com a cadeira, se possível), com autorização e nome confirmado | Retrato de 500 px já recortado em círculo |',
  '| Beco da Mina | Fotos dos murais em alta resolução (a colagem do site atual tem só 300 px de altura) | Recortes da colagem |',
  '| Impacto | Retrato ou foto de ação | — |',
  '| Apoie | Foto de mãos trançando | — |',
  '| Agenda e notícias | Fotos de cada evento ou matéria | — |',
  '| Galeria | Fotos originais dos posts do Instagram e de eventos | Recortes e quadros de vídeo |',
  '| Parceiros | Logos oficiais com autorização | — |',
  '',
];
await writeFile(join(raiz, 'docs/IMAGENS.md'), linhas.join('\n'));
console.log(`\n${Object.keys(imagens).length} imagens e ${Object.keys(listaVideos).length} vídeo(s). Inventário em docs/IMAGENS.md.`);
