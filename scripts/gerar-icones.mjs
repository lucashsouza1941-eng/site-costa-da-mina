// Gera, a partir das peças oficiais do acervo, os arquivos de metadados que o
// Next.js publica automaticamente: favicon.ico, icon.png, apple-icon.png e
// opengraph-image.png (src/app). Rode quando a marca mudar:
//   node scripts/gerar-icones.mjs
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const app = raiz + 'src/app/';
const img = (c) => raiz + 'public/images/' + c;

const ROXO_PROFUNDO = '#170927';
const selo = img('instituto/marca/selo-roxo.webp');

// ícones quadrados
await sharp(selo).resize(512, 512).png().toFile(app + 'icon.png');
// iOS não aceita transparência: selo sobre fundo roxo, com respiro
const selo150 = await sharp(selo).resize(150, 150).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: ROXO_PROFUNDO } })
  .composite([{ input: selo150, top: 15, left: 15 }])
  .png()
  .toFile(app + 'apple-icon.png');

// favicon.ico com PNGs embutidos (16, 32 e 48 px)
const tamanhos = [16, 32, 48];
const pngs = await Promise.all(tamanhos.map((t) => sharp(selo).resize(t, t).png().toBuffer()));
const cabecalho = Buffer.alloc(6);
cabecalho.writeUInt16LE(0, 0);
cabecalho.writeUInt16LE(1, 2);
cabecalho.writeUInt16LE(pngs.length, 4);
let deslocamento = 6 + 16 * pngs.length;
const entradas = pngs.map((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(tamanhos[i], 0);
  e.writeUInt8(tamanhos[i], 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(deslocamento, 12);
  deslocamento += png.length;
  return e;
});
await writeFile(app + 'favicon.ico', Buffer.concat([cabecalho, ...entradas, ...pngs]));

// imagem de compartilhamento 1200×630: ilustração institucional escurecida,
// logo branco e selo amarelo
const L = 1200;
const A = 630;
const fundo = await sharp(img('instituto/ilustracao-brasil-africa.webp'))
  .resize(L, A, { fit: 'cover' })
  .modulate({ brightness: 0.45, saturation: 0.7 })
  .toBuffer();
const veu = Buffer.from(
  `<svg width="${L}" height="${A}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${ROXO_PROFUNDO}" stop-opacity="0.92"/><stop offset="1" stop-color="#2e113c" stop-opacity="0.55"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect y="${A - 14}" width="100%" height="14" fill="#f8b019"/></svg>`,
);
const logo = await sharp(img('instituto/marca/logo-horizontal-branco.webp')).resize({ width: 640 }).png().toBuffer();
const seloAmarelo = await sharp(img('instituto/marca/selo-amarelo.webp')).resize(300, 300).png().toBuffer();
// JPEG: bem mais leve que PNG para uma imagem com ilustração de fundo
await sharp(fundo)
  .composite([
    { input: veu, top: 0, left: 0 },
    { input: logo, top: 200, left: 90 },
    { input: seloAmarelo, top: 165, left: 820 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(app + 'opengraph-image.jpg');
await writeFile(app + 'opengraph-image.alt.txt', 'Logotipo do Instituto Costa da Mina e o selo da cadeira com raízes, sobre fundo roxo');

console.log('Ícones e imagem de compartilhamento gerados em src/app.');
