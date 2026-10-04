// Acervo oficial de imagens: origem, arquivos, dimensões, textos alternativos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { todasAsImagens, fotosDaGaleria } from '../src/content/acervo.ts';
import { fontes, excluidas } from '../scripts/imagens/fontes.mjs';
import { caminhoDaVariante, LARGURAS } from '../src/lib/imagens/larguras.ts';
import { listarProjetos } from '../src/lib/conteudo.ts';
import dados from '../src/content/acervo.gerado.json' with { type: 'json' };

const publico = fileURLToPath(new URL('../public/', import.meta.url));
const imagens = todasAsImagens();

test('todo item do acervo foi gerado a partir das fontes', () => {
  assert.equal(imagens.length, fontes.length);
  assert.deepEqual(imagens.map((i) => i.id).sort(), fontes.map((f) => f.id).sort());
});

test('só imagens do próprio site do Instituto, nunca do tema WordPress', () => {
  for (const [id, i] of Object.entries(dados.imagens)) {
    assert.match(i.origem, /^https:\/\/institutocostadamina\.com\.br\/wp-content\/uploads\//, id);
    assert.doesNotMatch(i.origem, /unsplash|placeholder|smiley|Crypt-Logo|\/Logo(-Retina)?\.png|charis-?x|2026\/03\/cdm\.png/i, id);
  }
});

test('páginas não recebem a URL de origem', () => {
  for (const i of imagens) assert.ok(!('origem' in i) && !('nota' in i), i.id);
});

test('matrizes existem em public/images com as dimensões registradas', async () => {
  for (const i of imagens) {
    const arquivo = publico + i.src.slice(1);
    assert.ok(existsSync(arquivo), `faltou ${i.src}`);
    const m = await sharp(arquivo).metadata();
    assert.equal(m.format, 'webp', i.src);
    assert.deepEqual([m.width, m.height], [i.largura, i.altura], i.src);
  }
});

test('fotos têm texto alternativo; só gráficos decorativos ficam sem', () => {
  for (const i of imagens) {
    if (i.tipo === 'foto' && i.id !== 'trancando-video-capa') assert.ok(i.alt.length >= 10, `${i.id} sem alt`);
    if (!i.alt) assert.ok(['padrao-cadeiras', 'trancando-video-capa'].includes(i.id), `${i.id} sem alt`);
  }
});

test('nenhum nome de pessoa associado a fotos sem confirmação', () => {
  for (const i of imagens) {
    assert.doesNotMatch(i.alt, /Helaine|Cristina|Waldir|Age\b/i, `${i.id}: "${i.alt}"`);
  }
});

test('galeria só com fotos, em categorias conhecidas', () => {
  const galeria = fotosDaGaleria();
  assert.ok(galeria.length >= 10);
  for (const g of galeria) {
    assert.ok(['beco-da-mina', 'oficinas', 'territorio', 'institucional', 'eventos'].includes(g.categoria), g.id);
    assert.ok(g.imagem.alt, g.id);
  }
});

test('projetos usam imagens do acervo', () => {
  for (const p of listarProjetos()) {
    assert.ok(p.capa?.src.startsWith('/images/'), `${p.slug} sem capa`);
  }
});

test('variantes: nome previsível por largura', () => {
  assert.equal(caminhoDaVariante('/images/projetos/x/foto.webp', 640), '/_img/projetos/x/foto-640.webp');
  assert.deepEqual([...LARGURAS], [96, 192, 384, 640, 828, 1080, 1280, 1920]);
});

test('lista de exclusões explica o que ficou de fora', () => {
  assert.ok(excluidas.length >= 8);
  for (const e of excluidas) assert.ok(e.motivo.length > 10, e.origem);
});
